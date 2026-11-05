import { describe, expect, it } from 'vitest'
import { BATCHES, FALLBACK_EN, FALLBACK_HI, upcomingBatch, upcomingBatches } from './batches'
import { LINKS, linkOrWhatsApp, waLink } from './links'

const at = (iso: string): Date => new Date(iso)

describe('batches', () => {
  it('keeps a batch visible through its last day (IST) and hides it the day after', () => {
    expect(upcomingBatch('vadodara', at('2026-11-29T23:00:00+05:30'))?.id).toBe('vadodara')
    expect(upcomingBatch('vadodara', at('2026-11-30T00:05:00+05:30'))).toBeNull()
  })

  it('returns null (show the fallback line) for a batch without a date', () => {
    expect(upcomingBatch('pune', at('2026-11-05T12:00:00+05:30'))).toBeNull()
    expect(upcomingBatch('exec-mumbai', at('2026-11-05T12:00:00+05:30'))).toBeNull()
    expect(FALLBACK_HI).toBe('अगली तारीख जल्दी — वॉट्सऐप पर पूछिए')
    expect(FALLBACK_EN).toBe('Next date soon — ask on WhatsApp')
  })

  it('lists upcoming dated batches earliest first and drops past ones', () => {
    expect(upcomingBatches(at('2026-11-05T12:00:00+05:30')).map((b) => b.id)).toEqual(['mumbai', 'online', 'ahmedabad', 'vadodara'])
    expect(upcomingBatches(at('2026-11-20T12:00:00+05:30')).map((b) => b.id)).toEqual(['ahmedabad', 'vadodara'])
  })

  it('never ships a seat count that was not filled in by hand', () => {
    expect(BATCHES.find((b) => b.id === 'online')?.seatsLeft).toBeNull()
  })
})

describe('links', () => {
  it('sends a button to WhatsApp with its own text while its link is still a placeholder', () => {
    expect(LINKS.rzpTelepathyDeposit1000).toBe('[[RZP_TELEPATHY_1000]]')
    expect(linkOrWhatsApp('rzpTelepathyDeposit1000', 'सीट पक्की कीजिए — ₹1,000')).toBe(waLink('सीट पक्की कीजिए — ₹1,000'))
    expect(waLink('a b')).toBe('https://wa.me/919540123161?text=a%20b')
  })
})
