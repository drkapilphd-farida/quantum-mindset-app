// Sharp Brain 30-Day Program batches and prices — pure functions of `now`
// and the config in site.config.ts (sharpBrainEnrolment). IST has no
// daylight saving, so every date here is plain UTC arithmetic shifted by
// +05:30. The server decides `now`; the browser clock is never used.

export const IST_OFFSET_MS = (5 * 60 + 30) * 60_000
const DAY_MS = 24 * 60 * 60_000

export type OfferKind = 'earlybird' | 'regular' | 'test1000'

export type BatchConfig = {
  batchStartDays: readonly number[]
  earlyBirdEndsDaysBefore: number
  regularInr: number
  earlyBirdInr: number
  floorInr: number
  testOffer: { discountInr: number; validHours: number }
}

export type Batch = {
  /** Start date in IST, "YYYY-MM-DD" — what is saved with a payment. */
  start: string
  /** 00:00 IST on the start date. */
  startsAtMs: number
  /** Enrolment for this batch stays open until the end of its start day (IST). */
  enrolmentClosesAtMs: number
  /** Early-bird is on while now < this: the end of (start − N days), 23:59:59 IST. */
  earlyBirdEndsAtMs: number
}

export type BatchPrice = {
  batch: Batch
  amountInr: number
  regularInr: number
  offer: OfferKind
  /** When this price ends (early-bird deadline or test-offer expiry); null for the regular price. */
  endsAtMs: number | null
}

/** 00:00 IST of a calendar date, as a UTC timestamp. Month is 0-based; overflowing days roll over like Date.UTC. */
export function istMidnight(year: number, month0: number, day: number): number {
  return Date.UTC(year, month0, day) - IST_OFFSET_MS
}

/** The IST calendar date of a timestamp. */
export function istDate(ms: number): { year: number; month0: number; day: number } {
  const shifted = new Date(ms + IST_OFFSET_MS)
  return { year: shifted.getUTCFullYear(), month0: shifted.getUTCMonth(), day: shifted.getUTCDate() }
}

export function isoDate(year: number, month0: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month0 + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function makeBatch(year: number, month0: number, day: number, earlyBirdEndsDaysBefore: number): Batch {
  const startsAtMs = istMidnight(year, month0, day)
  const normalised = istDate(startsAtMs)
  return {
    start: isoDate(normalised.year, normalised.month0, normalised.day),
    startsAtMs,
    enrolmentClosesAtMs: startsAtMs + DAY_MS,
    // The deadline day ends at the next midnight: start − N days + 1 day.
    earlyBirdEndsAtMs: istMidnight(year, month0, day - earlyBirdEndsDaysBefore + 1),
  }
}

/** The next `count` batches still open for enrolment at `now`, soonest first. */
export function upcomingBatches(now: number, config: Pick<BatchConfig, 'batchStartDays' | 'earlyBirdEndsDaysBefore'>, count = 2): Batch[] {
  const days = [...new Set(config.batchStartDays)].filter((d) => Number.isInteger(d) && d >= 1 && d <= 28).sort((a, b) => a - b)
  if (days.length === 0) return []
  const today = istDate(now)
  const result: Batch[] = []
  for (let monthOffset = 0; result.length < count && monthOffset < 24; monthOffset++) {
    for (const day of days) {
      const batch = makeBatch(today.year, today.month0 + monthOffset, day, config.earlyBirdEndsDaysBefore)
      if (now < batch.enrolmentClosesAtMs) result.push(batch)
      if (result.length === count) break
    }
  }
  return result
}

/** The batch starting on `start` ("YYYY-MM-DD"), if it is one of the next `count` open batches. */
export function findUpcomingBatch(start: string, now: number, config: BatchConfig, count = 2): Batch | null {
  return upcomingBatches(now, config, count).find((b) => b.start === start) ?? null
}

/**
 * The price a buyer pays for `batch` at `now`. Offers never stack: the
 * lowest of regular, early-bird (if on) and the test offer (if active),
 * never below the floor. On a tie the test offer wins, so the payment
 * records where the buyer came from.
 */
export function priceForBatch(
  batch: Batch,
  now: number,
  config: BatchConfig,
  options: { earlyBirdEnabled: boolean; testOfferExpiresAtMs?: number | null },
): BatchPrice {
  const candidates: { amountInr: number; offer: OfferKind; endsAtMs: number | null }[] = [
    { amountInr: config.regularInr, offer: 'regular', endsAtMs: null },
  ]
  if (options.testOfferExpiresAtMs != null && now < options.testOfferExpiresAtMs) {
    candidates.push({ amountInr: config.regularInr - config.testOffer.discountInr, offer: 'test1000', endsAtMs: options.testOfferExpiresAtMs })
  }
  if (options.earlyBirdEnabled && now < batch.earlyBirdEndsAtMs) {
    candidates.push({ amountInr: config.earlyBirdInr, offer: 'earlybird', endsAtMs: batch.earlyBirdEndsAtMs })
  }
  const best = candidates.reduce((a, b) => (b.amountInr < a.amountInr || (b.amountInr === a.amountInr && b.offer === 'test1000') ? b : a))
  return { batch, amountInr: Math.max(best.amountInr, config.floorInr), regularInr: config.regularInr, offer: best.offer, endsAtMs: best.endsAtMs }
}

/** When a test offer created at `createdAtMs` expires. */
export function testOfferExpiry(createdAtMs: number, config: Pick<BatchConfig, 'testOffer'>): number {
  return createdAtMs + config.testOffer.validHours * 60 * 60_000
}
