'use server'

import { z } from 'zod'
import { sharpBrainEnrolment } from '@/config/site.config'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'
import { createPaymentLink, hasPaymentLinksApi } from '@/lib/razorpay/paymentLinksApi'
import { createClient } from '@/lib/supabase/server'
import { findUpcomingBatch, priceForBatch } from './batches'
import { PROGRAM_NOTE, activeOffer, discountsChargeable, enrolConfig, getTestOffer, pricingSnapshot, resolveNow, type PricingSnapshot } from './server'

// Sharp Brain checkout. The browser only says which batch (and, from the
// test-offer page, which offer); the price is always decided here from the
// server clock, and the Razorpay link is created here.

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
  batch: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
})

export type CheckoutResult = { ok: true; url: string } | { ok: false; reason: 'invalid_email' | 'batch_closed' | 'unavailable' | 'rate_limited' }

const CHECKOUT_RATE_LIMIT = { max: 10, windowMs: 60_000 }

export async function startSharpBrainCheckout(input: unknown): Promise<CheckoutResult> {
  const parsed = CheckoutInput.safeParse(input)
  if (!parsed.success) return { ok: false, reason: parsed.error.issues.some((i) => i.path[0] === 'email') ? 'invalid_email' : 'unavailable' }
  const ip = await getClientIp()
  if (!checkRateLimit(`sharp-brain-checkout:${ip}`, CHECKOUT_RATE_LIMIT).allowed) return { ok: false, reason: 'rate_limited' }

  const now = resolveNow(parsed.data.simulateNow)
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
        batch: batch.start,
        offer: price.offer,
        ...(price.offer === 'test1000' && offer !== null ? { offer_id: offer.id } : {}),
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
