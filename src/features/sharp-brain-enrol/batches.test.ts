import { describe, expect, it } from 'vitest'
import { findUpcomingBatch, priceForBatch, testOfferExpiry, upcomingBatches, type BatchConfig, type BatchPrice } from './batches'

const config: BatchConfig = {
  batchStartDays: [15, 25],
  earlyBirdEndsDaysBefore: 5,
  regularInr: 9999,
  earlyBirdInr: 8999,
  floorInr: 8999,
  testOffer: { discountInr: 1000, validHours: 48 },
}

/** A wall-clock time in IST. */
const ist = (iso: string): number => new Date(`${iso}+05:30`).getTime()
const starts = (now: number): string[] => upcomingBatches(now, config).map((b) => b.start)
const price = (now: number, testOfferExpiresAtMs: number | null = null): BatchPrice => {
  const batch = upcomingBatches(now, config)[0]!
  return priceForBatch(batch, now, config, { earlyBirdEnabled: true, testOfferExpiresAtMs })
}

describe('upcomingBatches (IST)', () => {
  it('early in the month shows the 15th and the 25th', () => {
    expect(starts(ist('2026-10-01T09:00:00'))).toEqual(['2026-10-15', '2026-10-25'])
  })

  it('keeps a batch open through its start day, then moves on', () => {
    expect(starts(ist('2026-10-15T23:59:00'))).toEqual(['2026-10-15', '2026-10-25'])
    expect(starts(ist('2026-10-16T00:00:00'))).toEqual(['2026-10-25', '2026-11-15'])
  })

  it('rolls over the month and the year', () => {
    expect(starts(ist('2026-10-26T00:00:00'))).toEqual(['2026-11-15', '2026-11-25'])
    expect(starts(ist('2026-12-26T08:00:00'))).toEqual(['2027-01-15', '2027-01-25'])
  })

  it('uses the IST date, not UTC: 25 Oct 00:30 IST is still 24 Oct in UTC', () => {
    expect(starts(ist('2026-10-26T00:30:00'))).toEqual(['2026-11-15', '2026-11-25'])
    expect(starts(ist('2026-10-25T00:30:00'))).toEqual(['2026-10-25', '2026-11-15'])
  })

  it('handles February and other short months', () => {
    expect(starts(ist('2027-02-26T10:00:00'))).toEqual(['2027-03-15', '2027-03-25'])
    expect(starts(ist('2028-02-29T10:00:00'))).toEqual(['2028-03-15', '2028-03-25'])
  })

  it('only accepts the next two batches by date', () => {
    const now = ist('2026-10-01T09:00:00')
    expect(findUpcomingBatch('2026-10-25', now, config)).not.toBeNull()
    expect(findUpcomingBatch('2026-11-15', now, config)).toBeNull()
    expect(findUpcomingBatch('2026-09-25', now, config)).toBeNull()
  })
})

describe('early-bird deadline', () => {
  it('15th batch: early-bird until the 10th, 23:59 IST', () => {
    expect(price(ist('2026-10-10T23:59:00'))).toMatchObject({ amountInr: 8999, offer: 'earlybird', endsAtMs: ist('2026-10-11T00:00:00') })
    expect(price(ist('2026-10-11T00:00:00'))).toMatchObject({ amountInr: 9999, offer: 'regular', endsAtMs: null })
  })

  it('25th batch: early-bird until the 20th, 23:59 IST', () => {
    expect(price(ist('2026-10-20T23:59:59'))).toMatchObject({ amountInr: 8999, offer: 'earlybird' })
    expect(price(ist('2026-10-21T00:00:00'))).toMatchObject({ amountInr: 9999, offer: 'regular' })
  })

  it('after the 15th the next batch is the 25th, already in its early-bird', () => {
    const p = price(ist('2026-10-16T09:00:00'))
    expect(p.batch.start).toBe('2026-10-25')
    expect(p).toMatchObject({ amountInr: 8999, offer: 'earlybird', endsAtMs: ist('2026-10-21T00:00:00') })
  })

  it('after the 25th the next batch is next month’s 15th, early-bird until the 10th', () => {
    const p = price(ist('2026-10-31T22:00:00'))
    expect(p.batch.start).toBe('2026-11-15')
    expect(p.endsAtMs).toBe(ist('2026-11-11T00:00:00'))
  })

  it('a deadline that falls in the previous month works (batch on the 3rd)', () => {
    const early = { ...config, batchStartDays: [3] }
    const batch = upcomingBatches(ist('2026-10-26T10:00:00'), early)[0]!
    expect(batch.start).toBe('2026-11-03')
    expect(batch.earlyBirdEndsAtMs).toBe(ist('2026-10-30T00:00:00'))
  })

  it('the offset is configurable', () => {
    const batch = upcomingBatches(ist('2026-10-01T10:00:00'), { ...config, earlyBirdEndsDaysBefore: 7 })[0]!
    expect(batch.earlyBirdEndsAtMs).toBe(ist('2026-10-09T00:00:00'))
  })

  it('no early-bird when it is switched off', () => {
    const now = ist('2026-10-01T09:00:00')
    const batch = upcomingBatches(now, config)[0]!
    expect(priceForBatch(batch, now, config, { earlyBirdEnabled: false })).toMatchObject({ amountInr: 9999, offer: 'regular' })
  })

  it('is identical for every caller at the same instant', () => {
    const now = ist('2026-10-05T12:34:56')
    expect(price(now)).toEqual(price(now))
  })
})

describe('test offer (₹1,000 off, 48 hours)', () => {
  const created = ist('2026-10-12T10:00:00')
  const expires = testOfferExpiry(created, config)

  it('expires exactly 48 hours after creation', () => {
    expect(expires).toBe(ist('2026-10-14T10:00:00'))
  })

  it('gives ₹8,999 while active and outside the early-bird', () => {
    expect(price(ist('2026-10-13T10:00:00'), expires)).toMatchObject({ amountInr: 8999, offer: 'test1000', endsAtMs: expires })
  })

  it('falls back to the normal price logic once expired', () => {
    expect(price(ist('2026-10-14T10:00:00'), expires)).toMatchObject({ amountInr: 9999, offer: 'regular' })
  })

  it('does not stack with the early-bird — the floor is ₹8,999', () => {
    const now = ist('2026-10-02T10:00:00')
    const p = price(now, testOfferExpiry(now, config))
    expect(p.amountInr).toBe(8999)
    expect(p.offer).toBe('test1000')
  })

  it('never goes below the floor, even with a bigger discount', () => {
    const big = { ...config, testOffer: { discountInr: 3000, validHours: 48 } }
    const now = ist('2026-10-13T10:00:00')
    const batch = upcomingBatches(now, big)[0]!
    expect(priceForBatch(batch, now, big, { earlyBirdEnabled: true, testOfferExpiresAtMs: now + 1000 }).amountInr).toBe(8999)
  })
})
