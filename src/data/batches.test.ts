import { describe, expect, it } from 'vitest'
import { BATCHES, FALLBACK_EN, FALLBACK_HI, daysUntilStart, labelHiNoYear, startDayHi, startMonth, upcomingBatch, upcomingBatches, weekdaysEn, weekdaysHi } from './batches'
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

  it('formats the first day and a label without the year', () => {
    const online = upcomingBatch('online', at('2026-11-05T12:00:00+05:30'))
    expect(online !== null && online.startDate !== null ? startDayHi({ ...online, startDate: online.startDate }) : null).toBe('17 नवंबर')
    const vadodara = upcomingBatch('vadodara', at('2026-11-05T12:00:00+05:30'))
    expect(vadodara === null ? null : labelHiNoYear(vadodara)).toBe('28–29 नवंबर')
  })

  it('counts days to the first day in IST, and names month and weekdays', () => {
    const mumbai = BATCHES[0]!
    expect(daysUntilStart(mumbai, at('2026-11-05T23:30:00+05:30'))).toBe(9)
    expect(daysUntilStart(mumbai, at('2026-11-13T00:10:00+05:30'))).toBe(1)
    expect(daysUntilStart(mumbai, at('2026-11-14T08:00:00+05:30'))).toBe(0)
    expect(startMonth(mumbai, 'hi')).toBe('नवंबर')
    expect(startMonth(mumbai, 'en')).toBe('November')
    expect(weekdaysHi(mumbai)).toBe('(शनि–रवि)')
    expect(weekdaysEn(mumbai)).toBe('(Sat–Sun)')
  })

  it('never ships a seat count that was not filled in by hand', () => {
    expect(BATCHES.find((b) => b.id === 'online')?.seatsLeft).toBeNull()
  })
})

describe('links', () => {
  it('sends a button to WhatsApp with its own text while its link is still a placeholder', () => {
    expect(LINKS.waGroupOverthinking).toBe('[[WA_GROUP_OVERTHINKING]]')
    expect(linkOrWhatsApp('waGroupOverthinking', 'ग्रुप में जुड़िए')).toBe(waLink('ग्रुप में जुड़िए'))
    expect(linkOrWhatsApp('rzpOnline3999', 'x')).toBe('https://rzp.io/rzp/NIZqolHs')
    expect(linkOrWhatsApp('rzpTelepathyDeposit1000', 'x')).toBe('https://rzp.io/rzp/elNaxRB')
    expect(waLink('a b')).toBe('https://wa.me/919540123161?text=a%20b')
  })
})
