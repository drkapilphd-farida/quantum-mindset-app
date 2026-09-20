'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { logger } from '@/lib/logger'

const CheckoutSchema = z.object({
  courseId: z.string().uuid(),
})

type CheckoutResult =
  | { success: true; url: string }
  | { success: false; error: string }

export async function createCheckoutSession(
  input: unknown,
): Promise<CheckoutResult> {
  const parsed = CheckoutSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Invalid request.' }
  }

  const { courseId } = parsed.data

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated.' }

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, description, price_cents')
    .eq('id', courseId)
    .eq('is_published', true)
    .single()

  if (!course) return { success: false, error: 'Course not found.' }
  if (course.price_cents === 0) {
    return {
      success: false,
      error: 'This course is free — use the enroll button.',
    }
  }

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (enrollment) {
    return { success: false, error: 'You are already enrolled in this course.' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Error-visibility fix (see the "Pre-Launch Audit Fix Pass" task, Phase
  // 1) — this call was previously unguarded: any Stripe API error
  // (network blip, transient outage, misconfigured key) rejected this
  // Server Action's promise instead of returning the typed
  // { success: false, error } shape every other failure path here
  // already uses. BuyButton.tsx's toast-on-failure logic only ever
  // fires for that typed shape, so an unguarded throw here reached the
  // user as nothing at all. Wrapped and logged (logger.error also
  // reports to Sentry as of this same phase) so a real checkout failure
  // is both visible to the user and to whoever's watching Sentry.
  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>
  try {
    session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: course.title,
                ...(course.description !== null
                  ? { description: course.description }
                  : {}),
              },
              unit_amount: course.price_cents,
            },
            quantity: 1,
          },
        ],
        metadata: { user_id: user.id, course_id: courseId },
        ...(user.email != null ? { customer_email: user.email } : {}),
        success_url: `${appUrl}/courses/${course.slug}?payment=success`,
        cancel_url: `${appUrl}/courses/${course.slug}`,
      },
      { idempotencyKey: `checkout-${user.id}-${courseId}` },
    )
  } catch (error) {
    logger.error('[createCheckoutSession] Stripe checkout session creation failed', {
      userId: user.id,
      courseId,
      error: error instanceof Error ? error.message : String(error),
    })
    return { success: false, error: 'Something went wrong starting checkout. Please try again in a moment.' }
  }

  if (!session.url) {
    logger.error('[createCheckoutSession] Stripe returned a session with no url', { userId: user.id, courseId, stripeSessionId: session.id })
    return { success: false, error: 'Failed to create checkout session.' }
  }

  return { success: true, url: session.url }
}
