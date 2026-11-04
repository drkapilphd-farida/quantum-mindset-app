'use server'

import { z } from 'zod'
import { sharpBrainOffer } from '@/config/site.config'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'
import { createPaymentLink } from '@/lib/razorpay/paymentLinksApi'
import { createClient } from '@/lib/supabase/server'
import { PROGRAM_NOTE, introSeatsTaken, resolveNow, snapshotFor, type PricingSnapshot } from './server'

// Sharp Brain checkout. The browser only sends the buyer's email (and
// name); the price is always decided here from the real seat count, and the
// Razorpay link is created here. Paying gives access the same day.

const SimulateSchema = z.string().max(40).optional()

const PricingInput = z.object({ simulateNow: SimulateSchema, simulateSeats: SimulateSchema })

export async function getSharpBrainPricing(input: unknown): Promise<PricingSnapshot> {
  const parsed = PricingInput.safeParse(input ?? {})
  const data = parsed.success ? parsed.data : {}
  const now = resolveNow(data.simulateNow)
  return { ...snapshotFor(now, await introSeatsTaken(data.simulateSeats)), viewerEmail: await viewerEmail() }
}

async function viewerEmail(): Promise<string | null> {
  try {
    const { data } = await (await createClient()).auth.getUser()
    return data.user?.email ?? null
  } catch {
    return null
  }
}

const CheckoutInput = z.object({
  // Sent to Razorpay so the payment can be matched to the learner's account.
  email: z.string().trim().toLowerCase().email().max(254),
  name: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((v) => (v === undefined || v === '' ? undefined : v)),
  simulateNow: SimulateSchema,
  simulateSeats: SimulateSchema,
})

export type CheckoutResult =
  | { ok: true; url: string; amountInr: number; seatsLeft: number }
  | { ok: false; reason: 'invalid_email' | 'unavailable' | 'rate_limited' }

const CHECKOUT_RATE_LIMIT = { max: 10, windowMs: 60_000 }

export async function startSharpBrainCheckout(input: unknown): Promise<CheckoutResult> {
  const parsed = CheckoutInput.safeParse(input)
  if (!parsed.success) return { ok: false, reason: parsed.error.issues.some((i) => i.path[0] === 'email') ? 'invalid_email' : 'unavailable' }
  const ip = await getClientIp()
  if (!checkRateLimit(`sharp-brain-checkout:${ip}`, CHECKOUT_RATE_LIMIT).allowed) return { ok: false, reason: 'rate_limited' }

  const now = resolveNow(parsed.data.simulateNow)
  // Without a reliable seat count the price can't be decided: WhatsApp instead.
  const seats = await introSeatsTaken(parsed.data.simulateSeats)
  if (seats === null) return { ok: false, reason: 'unavailable' }
  const { price } = snapshotFor(now, seats)

  // A short-lived link, so an intro-price link can't be paid long after the
  // seats have gone. Without the API keys there is no link: WhatsApp.
  const link = await createPaymentLink(
    {
      amountInr: price.amountInr,
      description: 'Sharp Brain 30-Day Program — start today',
      notes: { program: PROGRAM_NOTE, offer: price.offer },
      expireAtMs: Date.now() + sharpBrainOffer.linkValidMinutes * 60_000,
      customerEmail: parsed.data.email,
      ...(parsed.data.name !== undefined ? { customerName: parsed.data.name } : {}),
    },
    Date.now(),
  )
  if (!link.ok) {
    logger.error('startSharpBrainCheckout: payment link not created', { status: link.status, offer: price.offer })
    return { ok: false, reason: 'unavailable' }
  }
  return { ok: true, url: link.url, amountInr: price.amountInr, seatsLeft: price.seatsLeft }
}
