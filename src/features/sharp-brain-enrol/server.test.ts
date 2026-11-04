import { describe, expect, it } from 'vitest'
import { sharpBrainOffer } from '@/config/site.config'
import { priceForSeats } from './offer'
import { snapshotFor } from './server'

describe('price for the parents offer', () => {
  it('₹2,999 (₹8,999 struck) for the first 100 paid seats, then ₹3,999', () => {
    expect(sharpBrainOffer).toMatchObject({ struckInr: 8999, introInr: 2999, introSeats: 100, laterInr: 3999 })
    expect(priceForSeats(0, sharpBrainOffer)).toMatchObject({ offer: 'parent_2999', amountInr: 2999, struckInr: 8999, seatsLeft: 100 })
    expect(priceForSeats(99, sharpBrainOffer)).toMatchObject({ offer: 'parent_2999', amountInr: 2999, seatsLeft: 1 })
    expect(priceForSeats(100, sharpBrainOffer)).toMatchObject({ offer: 'parent_3999', amountInr: 3999, seatsLeft: 0 })
    expect(priceForSeats(130, sharpBrainOffer)).toMatchObject({ offer: 'parent_3999', seatsLeft: 0 })
  })
  it('the snapshot carries the next live class and hides the counter when seats are unknown', () => {
    const now = Date.parse('2026-11-04T12:00:00+05:30')
    expect(snapshotFor(now, 12)).toMatchObject({ seatsKnown: true, nextClassAt: '2026-11-09T14:30:00.000Z', price: { seatsLeft: 88 } })
    expect(snapshotFor(now, null).seatsKnown).toBe(false)
  })
})
