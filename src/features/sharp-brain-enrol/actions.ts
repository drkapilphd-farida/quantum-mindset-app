'use server'

import { z } from 'zod'
import { SHARP_BRAIN_PRICES, sharpBrainEnrolment } from '@/config/site.config'
import { LINKS } from '@/data/links'
import { PLAN_TYPES } from '@/features/sharp-brain-plans/rules'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'
import { createPaymentLink, hasPaymentLinksApi } from '@/lib/razorpay/paymentLinksApi'
import { createClient } from '@/lib/supabase/server'
import { attributionNotes } from './attribution'
import { findUpcomingBatch, priceForBatch } from './batches'
import { PROGRAM_NOTE, activeOffer, discountsChargeable, enrolConfig, getTestOffer, pricingSnapshot, resolveNow, type PricingSnapshot } from './server'

// Sharp Brain checkout. The browser only says which batch (and, from the
// test-offer page, which offer) and which plan; the price is always decided
// here from the server clock and the plan, and the Razorpay link is created here.
// Self-paced (₹2,999) has no batch: it starts the moment it is paid.

const SimulateSchema = z.string().max(40).optional()
const OfferIdSchema = z.string().uuid().optional()

const PricingInput = z.object({ simulateNow: SimulateSchema, offerId: OfferIdSchema })

export async function getSharpBrainPricing(input: unknown): Promise<PricingSnapshot> {
  const parsed = PricingInput.safeParse(input ?? {})
  const now = resolveNow(parsed.success ? parsed.data.simulateNow : undefined)
  const offerId = parsed.success ? parsed.data.offerId : undefined
  const offer = offerId === undefined ? null : activeOffer(await getTestOffer(offerId), now)
  return { ...pricingSnapshot(now, offer?.expiresAtMs ?? null), viewerEmail: await viewerEmail() }
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
  /** live = the ₹8,999 batch (default, unchanged); self_paced = ₹2,999. */
  plan: z.enum(PLAN_TYPES).default('live'),
  batch: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  // Sent to Razorpay so the payment can be matched to the learner's account.
  email: z.string().trim().toLowerCase().email().max(254),
  name: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((v) => (v === undefined || v === '' ? undefined : v)),
  offerId: OfferIdSchema,
  simulateNow: SimulateSchema,
  /** The visit's utm_* tags and the page section (e.g. "brain_unlock_live"), kept in the Razorpay notes for attribution. */
  utm: z.record(z.string().max(20), z.string().max(200)).optional(),
  from: z.string().regex(/^[a-z0-9_-]{1,60}$/).optional(),
})

export type CheckoutResult = { ok: true; url: string } | { ok: false; reason: 'invalid_email' | 'batch_closed' | 'unavailable' | 'rate_limited' }

const CHECKOUT_RATE_LIMIT = { max: 10, windowMs: 60_000 }

export async function startSharpBrainCheckout(input: unknown): Promise<CheckoutResult> {
  const parsed = CheckoutInput.safeParse(input)
  if (!parsed.success) return { ok: false, reason: parsed.error.issues.some((i) => i.path[0] === 'email') ? 'invalid_email' : 'unavailable' }
  const ip = await getClientIp()
  if (!checkRateLimit(`sharp-brain-checkout:${ip}`, CHECKOUT_RATE_LIMIT).allowed) return { ok: false, reason: 'rate_limited' }

  const attribution = attributionNotes(parsed.data.utm, parsed.data.from)
  if (parsed.data.plan === 'self_paced') return startSelfPacedCheckout(parsed.data.email, parsed.data.name, attribution)

  const now = resolveNow(parsed.data.simulateNow)
  if (parsed.data.batch === undefined) return { ok: false, reason: 'batch_closed' }
  const batch = findUpcomingBatch(parsed.data.batch, now, enrolConfig)
  if (batch === null) return { ok: false, reason: 'batch_closed' }

  const offer = parsed.data.offerId === undefined ? null : activeOffer(await getTestOffer(parsed.data.offerId), now)
  const chargeable = discountsChargeable()
  const price = priceForBatch(batch, now, enrolConfig, {
    earlyBirdEnabled: chargeable,
    testOfferExpiresAtMs: chargeable ? (offer?.expiresAtMs ?? null) : null,
  })

  if (!hasPaymentLinksApi()) {
    // Fixed links from site.config until the API keys are set. They cannot
    // carry the batch; the team confirms it with the buyer.
    const url = price.offer === 'regular' ? sharpBrainEnrolment.fallbackLinks.regular : sharpBrainEnrolment.fallbackLinks.discounted
    return url === null ? { ok: false, reason: 'unavailable' } : { ok: true, url }
  }

  const expireAtMs = price.endsAtMs ?? batch.enrolmentClosesAtMs
  const link = await createPaymentLink(
    {
      amountInr: price.amountInr,
      description: `Sharp Brain 30-Day Program — batch starting ${batch.start}`,
      notes: {
        program: PROGRAM_NOTE,
        plan: 'live',
        batch: batch.start,
        offer: price.offer,
        ...(price.offer === 'test1000' && offer !== null ? { offer_id: offer.id } : {}),
        ...attribution,
      },
      expireAtMs,
      customerEmail: parsed.data.email,
      ...(parsed.data.name !== undefined ? { customerName: parsed.data.name } : {}),
      ...(price.offer === 'test1000' && offer !== null ? { customerContact: offer.whatsappNumber } : {}),
    },
    Date.now(),
  )
  if (!link.ok) {
    logger.error('startSharpBrainCheckout: payment link not created', { status: link.status, offer: price.offer, batch: batch.start })
    return { ok: false, reason: 'unavailable' }
  }
  return { ok: true, url: link.url }
}

/** ₹2,999, decided here. Without the Payment Links API, the website's fixed ₹2,999 link (the webhook knows it). */
async function startSelfPacedCheckout(email: string, name: string | undefined, attribution: Record<string, string>): Promise<CheckoutResult> {
  if (!hasPaymentLinksApi()) return { ok: true, url: LINKS.rzpSharpBrainSelfPaced2999 }
  const link = await createPaymentLink(
    {
      amountInr: SHARP_BRAIN_PRICES.selfPacedInr,
      description: 'Sharp Brain 30-Day Program — Self-paced',
      notes: { program: PROGRAM_NOTE, plan: 'self_paced', ...attribution },
      expireAtMs: Date.now() + 24 * 60 * 60_000,
      customerEmail: email,
      ...(name !== undefined ? { customerName: name } : {}),
    },
    Date.now(),
  )
  if (!link.ok) {
    logger.error('startSharpBrainCheckout: self-paced payment link not created', { status: link.status })
    return { ok: false, reason: 'unavailable' }
  }
  return { ok: true, url: link.url }
}
