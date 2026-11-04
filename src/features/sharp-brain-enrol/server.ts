import { sharpBrainOffer } from '@/config/site.config'
import { nextCycleSlot } from '@/features/live-classes/liveClasses'
import { logger } from '@/lib/logger'
import { createServiceClient } from '@/lib/supabase/service'
import { INTRO_SEAT_OFFERS, priceForSeats, type CurrentPrice } from './offer'

// Server-side helpers for Sharp Brain enrolment: the clock, the real seat
// count, and the price snapshot every page shows. Imported only by server
// actions and server components.

export { SHARP_BRAIN_PROGRAM_NOTE as PROGRAM_NOTE } from './programPayment'

function isProduction(): boolean {
  return process.env.VERCEL_ENV === 'production'
}

/**
 * The server's clock. On preview and local builds only, `?now=` (an ISO
 * date) can simulate another moment. Production always uses the real time.
 */
export function resolveNow(simulate?: string | null): number {
  if (!isProduction() && typeof simulate === 'string' && simulate !== '') {
    const ms = Date.parse(simulate)
    if (Number.isFinite(ms)) return ms
  }
  return Date.now()
}

/**
 * Intro seats already paid: Razorpay and manual payments at the intro price
 * (or a first instalment), not refunded. null when the count can't be read.
 * On preview and local builds only, `?seats=` (0–1000) simulates a count, so
 * the switch to the later price can be checked.
 */
export async function introSeatsTaken(simulate?: string | null): Promise<number | null> {
  if (!isProduction() && typeof simulate === 'string' && /^\d{1,4}$/.test(simulate)) return Number(simulate)
  const { count, error } = await createServiceClient()
    .from('masterclass_payments')
    .select('id', { count: 'exact', head: true })
    .in('offer', [...INTRO_SEAT_OFFERS])
    .is('refunded_at', null)
  if (error || count === null) {
    logger.error('introSeatsTaken: count failed', { code: error?.code })
    return null
  }
  return count
}

export type PricingSnapshot = {
  serverNowMs: number
  price: CurrentPrice
  /** False when the seat count couldn't be read: the counter is hidden and checkout goes to WhatsApp. */
  seatsKnown: boolean
  /** Start of the next live class of the Mon & Thu cycle (ISO), for "Next live class". */
  nextClassAt: string | null
  /** The signed-in visitor's email, to prefill checkout (only from the server action, never cached in a page). */
  viewerEmail?: string | null
}

export function snapshotFor(now: number, seatsTaken: number | null): PricingSnapshot {
  return {
    serverNowMs: now,
    price: priceForSeats(seatsTaken ?? 0, sharpBrainOffer),
    seatsKnown: seatsTaken !== null,
    nextClassAt: nextCycleSlot(now)?.startsAt ?? null,
  }
}

export async function pricingSnapshot(now: number = Date.now()): Promise<PricingSnapshot> {
  return snapshotFor(now, await introSeatsTaken())
}

/** "₹2,999" / "₹3,999" — what a seat costs right now (server components). */
export async function currentProgramPriceLabel(): Promise<string> {
  const { price } = await pricingSnapshot()
  return `₹${price.amountInr.toLocaleString('en-IN')}`
}
