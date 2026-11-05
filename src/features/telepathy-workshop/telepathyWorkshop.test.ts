import { describe, expect, it } from 'vitest'
import { TELEPATHY_WORKSHOP_FEE } from '@/config/site.config'
import {
  SHORT_REVIEW_VIDEOS,
  LONG_REVIEW_VIDEOS,
  FREE_SESSION_VIDEO,
  TELEPATHY_BATCHES,
  TELEPATHY_BATCH_MESSAGE_LABELS,
  TELEPATHY_BOOKING_URL,
  TELEPATHY_PRICE,
  telepathyBookedMessage,
  telepathyWhatsAppHref,
  telepathyWhatsAppMessage,
} from '@/config/telepathyWorkshopConfig'
import { batchDatesText, batchVenueText, countdownParts, googleCalendarUrl, langFromParam, nextBatch, pick, visibleBatches } from './telepathyWorkshop'
import { telepathyCopy } from './telepathyWorkshopCopy'

const at = (iso: string): number => Date.parse(iso)

describe('fee', () => {
  it('comes from site.config and fills {price} / {earlier} / {deposit} / {balance}', () => {
    expect(TELEPATHY_WORKSHOP_FEE).toEqual({ earlierInr: 7999, currentInr: 5999, depositInr: 1000 })
    expect(TELEPATHY_PRICE.offer).toBe('₹5,999')
    expect(TELEPATHY_PRICE.earlier).toBe('₹7,999')
    expect(TELEPATHY_PRICE.balance).toBe('₹4,999')
    expect(pick(telepathyCopy.bookButton, 'en')).toBe('Book your seat — ₹1,000')
    expect(pick(telepathyCopy.bookButton, 'hi')).toBe('₹1,000 देकर अपनी seat book करें')
    expect(pick(telepathyCopy.booking.note, 'en')).toBe('Balance ₹4,999 at the venue (UPI / cash). ₹1,000 is non-refundable but can be moved to a later batch.')
    expect(pick(telepathyCopy.booking.note, 'hi')).toBe('बाकी ₹4,999 venue पर (UPI / cash)। ₹1,000 वापस नहीं होगा, लेकिन अगले batch में transfer हो सकता है।')
  })
  it('books on the ₹1,000 Razorpay link, never the old ₹500 one', () => {
    expect(TELEPATHY_BOOKING_URL).toBe('https://rzp.io/rzp/elNaxRB')
  })
})

describe('no stale numbers (page copy and every WhatsApp text, both languages)', () => {
  const filled = (value: unknown): string[] =>
    typeof value === 'object' && value !== null && 'en' in value && 'hi' in value && typeof value.en === 'string' && typeof value.hi === 'string'
      ? [pick(value as { en: string; hi: string }, 'en'), pick(value as { en: string; hi: string }, 'hi')]
      : typeof value === 'object' && value !== null
        ? Object.values(value).flatMap(filled)
        : typeof value === 'string'
          ? [value]
          : []
  const batchIds = TELEPATHY_BATCHES.map((b) => b.id)
  const texts = [
    ...filled(telepathyCopy),
    telepathyWhatsAppMessage('question', null),
    ...batchIds.flatMap((id) => [telepathyWhatsAppMessage('question', id), telepathyWhatsAppMessage('pay_full', id), telepathyBookedMessage('Asha', id, 'pay_ABCDEFGH12')]),
  ]
  const all = texts.join('\n')

  it('₹4,999 appears only as the balance at the venue', () => {
    const balances = all.match(/.{0,12}4,999.{0,16}/g) ?? []
    expect(balances.length).toBeGreaterThan(0)
    for (const hit of balances) expect(hit).toMatch(/(Balance|balance) ₹4,999 at the venue|बाकी ₹4,999 venue पर|बाकी ₹4,999 मौके पर/)
  })
  it('no ₹500, ₹6,500, 200+, "3 cities" or the old Razorpay link', () => {
    expect(all).not.toMatch(/₹ ?500\b|6,500|6500|200\+|3 cities|3 शहर|sNVbKv9/)
    expect(telepathyCopy.trust.find((t) => t.label.en === 'cities')?.value.en).toBe('4')
    expect(telepathyCopy.trust.find((t) => t.label.en === 'video reviews')?.value.en).toBe('300+')
  })
})

describe('langFromParam', () => {
  it('accepts only hi/en', () => {
    expect(langFromParam('hi')).toBe('hi')
    expect(langFromParam(['en', 'hi'])).toBe('en')
    expect(langFromParam('gu')).toBeNull()
    expect(langFromParam(undefined)).toBeNull()
  })
})

describe('batches', () => {
  it('a batch hides itself after its last day; Pune (no date) always shows', () => {
    const ids = (now: string): string[] => visibleBatches(at(now)).map((b) => b.id)
    expect(ids('2026-11-01T12:00:00+05:30')).toEqual(['mumbai', 'ahmedabad', 'vadodara', 'pune'])
    expect(ids('2026-11-15T17:59:00+05:30')).toEqual(['mumbai', 'ahmedabad', 'vadodara', 'pune'])
    expect(ids('2026-11-15T18:00:01+05:30')).toEqual(['ahmedabad', 'vadodara', 'pune'])
    expect(ids('2026-11-23T00:00:00+05:30')).toEqual(['vadodara', 'pune'])
    expect(ids('2026-11-30T00:00:00+05:30')).toEqual(['pune'])
  })
  it('the countdown targets Mumbai, then Ahmedabad, then Vadodara, then nothing', () => {
    expect(nextBatch(at('2026-11-01T12:00:00+05:30'))?.id).toBe('mumbai')
    expect(nextBatch(at('2026-11-14T09:30:00+05:30'))?.id).toBe('ahmedabad')
    expect(nextBatch(at('2026-11-21T09:30:00+05:30'))?.id).toBe('vadodara')
    expect(nextBatch(at('2026-11-28T09:30:00+05:30'))).toBeNull()
  })
  it('dates and venues come from src/data/batches.ts', () => {
    expect(TELEPATHY_BATCHES[2]).toMatchObject({ id: 'vadodara', startISO: '2026-11-28T09:30:00+05:30', endISO: '2026-11-29T18:00:00+05:30', days: 2 })
    expect(batchDatesText('vadodara', 'hi')).toBe('28–29 नवंबर 2026')
    expect(batchVenueText('ahmedabad', 'hi')).toBe('Hotel Silver Cloud, आश्रम रोड')
    expect(batchDatesText('pune', 'hi')).toBe('अगली तारीख जल्दी — वॉट्सऐप पर पूछिए')
    expect(batchVenueText('pune', 'en')).toBe('')
  })
  it('countdownParts splits milliseconds and never goes negative', () => {
    expect(countdownParts(((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 })
    expect(countdownParts(-1000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  })
  it('Google Calendar: Mumbai 14 Nov 9:30–18:00 IST for 2 days; none for Vadodara (no English venue) or Pune', () => {
    const url = new URL(googleCalendarUrl(TELEPATHY_BATCHES[0]!, 'The Telepathy Workshop™ — Mumbai', 'details')!)
    expect(url.searchParams.get('dates')).toBe('20261114T093000/20261114T180000')
    expect(url.searchParams.get('ctz')).toBe('Asia/Kolkata')
    expect(url.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY;COUNT=2')
    expect(url.searchParams.get('location')).toContain('Hotel Better Home International')
    expect(googleCalendarUrl(TELEPATHY_BATCHES[2]!, 't', 'd')).toBeNull()
    expect(googleCalendarUrl(TELEPATHY_BATCHES[3]!, 't', 'd')).toBeNull()
  })
  it('every batch in the config has its copy card and vice versa', () => {
    expect(telepathyCopy.batches.cities.map((c) => c.id)).toEqual(TELEPATHY_BATCHES.map((b) => b.id))
    expect(Object.keys(TELEPATHY_BATCH_MESSAGE_LABELS)).toEqual(TELEPATHY_BATCHES.map((b) => b.id))
  })
  it('the hero eyebrow names all four cities', () => {
    expect(pick(telepathyCopy.hero.eyebrow, 'en')).toBe('2-DAY OFFLINE EXPERIENTIAL WORKSHOP · MUMBAI · AHMEDABAD · VADODARA · PUNE')
    expect(pick(telepathyCopy.hero.eyebrow, 'hi')).toContain('पुणे')
  })
})

describe('WhatsApp', () => {
  const text = (message: string): string | null => new URL(telepathyWhatsAppHref(message)).searchParams.get('text')
  it('goes to +91 95401 23161 with the message exactly as written', () => {
    const href = telepathyWhatsAppHref(telepathyWhatsAppMessage('question', 'mumbai'))
    expect(href.startsWith('https://wa.me/919540123161?text=')).toBe(true)
    expect(text(telepathyWhatsAppMessage('question', 'mumbai'))).toBe(telepathyWhatsAppMessage('question', 'mumbai'))
  })
  it('questions: TELEPATHY keyword, the workshop and the batch', () => {
    expect(telepathyWhatsAppMessage('question', null)).toBe('TELEPATHY - Hi Dr. Kapil, I have a question about the Telepathy Workshop.')
    expect(telepathyWhatsAppMessage('question', 'ahmedabad')).toBe('TELEPATHY - Hi Dr. Kapil, I have a question about the Telepathy Workshop — Ahmedabad, 21–22 November 2026.')
  })
  it('pay full: names ₹5,999, the city and the dates', () => {
    expect(telepathyWhatsAppMessage('pay_full', 'mumbai')).toBe('TELEPATHY - Hi Dr. Kapil, I want to pay the full ₹5,999 for the Telepathy Workshop — Mumbai, 14–15 November 2026.')
    expect(telepathyWhatsAppMessage('pay_full', 'pune')).toBe('TELEPATHY - Hi Dr. Kapil, I want to pay the full ₹5,999 for the Telepathy Workshop — Pune (please share the date and venue).')
  })
  it('booked: ₹1,000 paid, name, city/batch and payment id; no sales keyword', () => {
    expect(telepathyBookedMessage(' Asha ', 'ahmedabad', 'pay_ABCDEFGH12')).toBe(
      "Hi Dr. Kapil, I've paid ₹1,000 to book my seat for the Telepathy Workshop.\nName: Asha\nCity/batch: Ahmedabad, 21–22 November 2026\nPayment ID: pay_ABCDEFGH12",
    )
    expect(telepathyBookedMessage('', 'vadodara')).toBe("Hi Dr. Kapil, I've paid ₹1,000 to book my seat for the Telepathy Workshop.\nName: __\nCity/batch: Vadodara, 28–29 November 2026")
  })
})

describe('videos', () => {
  it('no video appears twice', () => {
    const all = [FREE_SESSION_VIDEO, ...LONG_REVIEW_VIDEOS, ...SHORT_REVIEW_VIDEOS]
    expect(new Set(all).size).toBe(all.length)
    expect(all.every((id) => /^[\w-]{11}$/.test(id))).toBe(true)
  })
})
