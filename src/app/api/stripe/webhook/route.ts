import { type NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'

// Error visibility fix (see the "Pre-Launch Audit Fix Pass" task, Phase
// 1) — this route previously had zero logging anywhere: a failed
// signature check, a missing/malformed metadata payload, or a failed
// enrollment insert all failed silently, visible only as a generic 4xx/
// 5xx in Stripe's own dashboard retry log, never in this app's own
// observability. Every failure path now calls logger.error, which (as of
// this same phase) also reports to Sentry — and the whole handler is
// wrapped in a top-level try/catch so a genuinely unexpected throw
// (e.g. createServiceClient() itself failing) can't escape as an
// unhandled rejection the way it could before.
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    return await handleStripeWebhook(request)
  } catch (error) {
    logger.error('[stripe-webhook] unhandled exception', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 })
  }
}

async function handleStripeWebhook(request: NextRequest): Promise<NextResponse> {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    logger.error('[stripe-webhook] missing stripe-signature header')
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    logger.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured.' },
      { status: 500 },
    )
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    logger.error('[stripe-webhook] signature verification failed', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const metadata = session.metadata
    if (metadata === null) {
      logger.error('[stripe-webhook] checkout.session.completed with no metadata', { stripeSessionId: session.id })
      return NextResponse.json({ error: 'No metadata.' }, { status: 400 })
    }

    const user_id = metadata['user_id']
    const course_id = metadata['course_id']

    if (user_id === undefined || course_id === undefined) {
      logger.error('[stripe-webhook] checkout.session.completed missing user_id/course_id metadata', {
        stripeSessionId: session.id,
        hasUserId: user_id !== undefined,
        hasCourseId: course_id !== undefined,
      })
      return NextResponse.json(
        { error: 'Missing metadata fields.' },
        { status: 400 },
      )
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('enrollments')
      .insert({ user_id, course_id })

    if (error && error.code !== '23505') {
      // A real, paid checkout that didn't turn into an enrollment row is
      // exactly the "paid but locked out" failure mode this whole audit
      // pass is about — this is not a routine warning.
      logger.error('[stripe-webhook] paid checkout succeeded but enrollment insert failed', {
        stripeSessionId: session.id,
        userId: user_id,
        courseId: course_id,
        error: error.message,
      })
      return NextResponse.json(
        { error: 'Failed to create enrollment.' },
        { status: 500 },
      )
    }
  }

  return NextResponse.json({ received: true })
}
