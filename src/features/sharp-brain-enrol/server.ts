import { sharpBrainEnrolment } from '@/config/site.config'
import { hasPaymentLinksApi } from '@/lib/razorpay/paymentLinksApi'
import { createServiceClient } from '@/lib/supabase/service'
import { priceForBatch, testOfferExpiry, upcomingBatches, type BatchConfig, type OfferKind } from './batches'

// Server-side helpers for Sharp Brain enrolment: the clock, which offers
// can actually be charged, the price snapshot every page shows, and the
// Reading Speed Test offer rows. Imported only by server actions and
// server components.

export { SHARP_BRAIN_PROGRAM_NOTE as PROGRAM_NOTE } from './programPayment'

export const enrolConfig: BatchConfig = sharpBrainEnrolment

function isProduction(): boolean {
  return process.env.VERCEL_ENV === 'production'
}

/**
 * The server's clock. On preview and local builds only, `?now=` (an ISO
 * date) can simulate another moment, so the early-bird / regular / expired
 * states can be checked. Production always uses the real time.
 */
export function resolveNow(simulate?: string | null): number {
  if (!isProduction() && typeof simulate === 'string' && simulate !== '') {
    const ms = Date.parse(simulate)
    if (Number.isFinite(ms)) return ms
  }
  return Date.now()
}

/**
 * A discounted price (early-bird or test offer) is only offered when it
 * can be charged: through the Payment Links API, or the fixed ₹8,999 link
 * in site.config. Preview builds show it anyway so it can be reviewed.
 */
export function discountsChargeable(): boolean {
  return hasPaymentLinksApi() || sharpBrainEnrolment.fallbackLinks.discounted !== null || !isProduction()
}

export type PricedBatch = {
  start: string
  startsAtMs: number
  earlyBirdEndsAtMs: number
  amountInr: number
  regularInr: number
  offer: OfferKind
  endsAtMs: number | null
}

export type PricingSnapshot = {
  serverNowMs: number
  batches: PricedBatch[]
  seatsPerBatch: number | null
}

export function pricingSnapshot(now: number, testOfferExpiresAtMs: number | null = null): PricingSnapshot {
  const earlyBirdEnabled = discountsChargeable()
  const batches = upcomingBatches(now, enrolConfig).map((batch) => {
    const price = priceForBatch(batch, now, enrolConfig, { earlyBirdEnabled, testOfferExpiresAtMs: earlyBirdEnabled ? testOfferExpiresAtMs : null })
    return {
      start: batch.start,
      startsAtMs: batch.startsAtMs,
      earlyBirdEndsAtMs: batch.earlyBirdEndsAtMs,
      amountInr: price.amountInr,
      regularInr: price.regularInr,
      offer: price.offer,
      endsAtMs: price.endsAtMs,
    }
  })
  return { serverNowMs: now, batches, seatsPerBatch: sharpBrainEnrolment.seatsPerBatch }
}

// ── Reading Speed Test offer ────────────────────────────────────────────

export type TestOffer = { id: string; whatsappNumber: string; expiresAtMs: number; redeemed: boolean }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getTestOffer(id: string): Promise<TestOffer | null> {
  if (!UUID.test(id)) return null
  const { data } = await createServiceClient()
    .from('sharp_brain_offers')
    .select('id, whatsapp_number, expires_at, redeemed_at')
    .eq('id', id)
    .maybeSingle()
  if (data === null) return null
  return { id: data.id, whatsappNumber: data.whatsapp_number, expiresAtMs: Date.parse(data.expires_at), redeemed: data.redeemed_at !== null }
}

/** An offer that can still be used at `now`; null otherwise. */
export function activeOffer(offer: TestOffer | null, now: number): TestOffer | null {
  return offer !== null && !offer.redeemed && now < offer.expiresAtMs ? offer : null
}

/**
 * The one offer for this WhatsApp number. Creates it on the first call;
 * every later call (retake, other browser, other device) returns the same
 * row with its original expiry — the 48 hours never restart.
 */
export async function getOrCreateTestOffer(whatsappNumber: string, speedTestResultId: string | null): Promise<TestOffer | null> {
  const supabase = createServiceClient()
  const createdAt = Date.now()
  const { error } = await supabase.from('sharp_brain_offers').upsert(
    {
      whatsapp_number: whatsappNumber,
      speed_test_result_id: speedTestResultId,
      kind: 'test1000',
      discount_inr: sharpBrainEnrolment.testOffer.discountInr,
      created_at: new Date(createdAt).toISOString(),
      expires_at: new Date(testOfferExpiry(createdAt, enrolConfig)).toISOString(),
    },
    { onConflict: 'whatsapp_number', ignoreDuplicates: true },
  )
  if (error) return null
  const { data } = await supabase
    .from('sharp_brain_offers')
    .select('id, whatsapp_number, expires_at, redeemed_at')
    .eq('whatsapp_number', whatsappNumber)
    .maybeSingle()
  if (data === null) return null
  return { id: data.id, whatsappNumber: data.whatsapp_number, expiresAtMs: Date.parse(data.expires_at), redeemed: data.redeemed_at !== null }
}
