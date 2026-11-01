import { describe, expect, it } from 'vitest'
import { TELEPATHY_WORKSHOP_FEE } from '@/config/site.config'
import { SHORT_REVIEW_VIDEOS, LONG_REVIEW_VIDEOS, FREE_SESSION_VIDEO, TELEPATHY_BATCHES, TELEPATHY_PRICE, telepathyWhatsAppHref } from '@/config/telepathyWorkshopConfig'
import { countdownParts, googleCalendarUrl, langFromParam, nextBatch, pick, visibleBatches } from './telepathyWorkshop'
import { telepathyCopy } from './telepathyWorkshopCopy'

const at = (iso: string): number => Date.parse(iso)

describe('fee', () => {
  it('comes from site.config and fills {price} / {earlier}', () => {
    expect(TELEPATHY_WORKSHOP_FEE).toEqual({ earlierInr: 7999, currentInr: 5999 })
    expect(TELEPATHY_PRICE.offer).toBe('₹5,999')
    expect(TELEPATHY_PRICE.earlier).toBe('₹7,999')
    expect(pick(telepathyCopy.bookButton, 'en')).toBe('Book on WhatsApp — ₹5,999')
    expect(pick(telepathyCopy.bookButton, 'hi')).toBe('WhatsApp पर बुक करें — ₹5,999')
  })
  it('no old price is left anywhere in the copy', () => {
    const all = JSON.stringify(telepathyCopy)
    expect(all).not.toMatch(/4,999|6,500|4999|6500/)
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
  it('a batch hides itself after its last day; Vadodara (no date) always shows', () => {
    const ids = (now: string): string[] => visibleBatches(at(now)).map((b) => b.id)
    expect(ids('2026-11-01T12:00:00+05:30')).toEqual(['mumbai', 'ahmedabad', 'vadodara'])
    expect(ids('2026-11-15T17:59:00+05:30')).toEqual(['mumbai', 'ahmedabad', 'vadodara'])
    expect(ids('2026-11-15T18:00:01+05:30')).toEqual(['ahmedabad', 'vadodara'])
    expect(ids('2026-11-23T00:00:00+05:30')).toEqual(['vadodara'])
  })
  it('the countdown targets Mumbai, then Ahmedabad, then nothing', () => {
    expect(nextBatch(at('2026-11-01T12:00:00+05:30'))?.id).toBe('mumbai')
    expect(nextBatch(at('2026-11-14T09:30:00+05:30'))?.id).toBe('ahmedabad')
    expect(nextBatch(at('2026-11-21T09:30:00+05:30'))).toBeNull()
  })
  it('countdownParts splits milliseconds and never goes negative', () => {
    expect(countdownParts(((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 })
    expect(countdownParts(-1000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  })
  it('Google Calendar: Mumbai 14 Nov 9:30–18:00 IST for 2 days; none for Vadodara', () => {
    const url = new URL(googleCalendarUrl(TELEPATHY_BATCHES[0]!, 'The Telepathy Workshop™ — Mumbai', 'details')!)
    expect(url.searchParams.get('dates')).toBe('20261114T093000/20261114T180000')
    expect(url.searchParams.get('ctz')).toBe('Asia/Kolkata')
    expect(url.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY;COUNT=2')
    expect(url.searchParams.get('location')).toContain('Hotel Better Home International')
    expect(googleCalendarUrl(TELEPATHY_BATCHES[2]!, 't', 'd')).toBeNull()
  })
  it('every batch in the config has its copy card and vice versa', () => {
    expect(telepathyCopy.batches.cities.map((c) => c.id)).toEqual(TELEPATHY_BATCHES.map((b) => b.id))
  })
})

describe('WhatsApp', () => {
  it('starts with the TELEPATHY keyword and names the workshop and batch', () => {
    const text = (topic: Parameters<typeof telepathyWhatsAppHref>[0]): string | null => new URL(telepathyWhatsAppHref(topic)).searchParams.get('text')
    expect(telepathyWhatsAppHref('general').startsWith('https://wa.me/919540123161?text=')).toBe(true)
    expect(text('general')).toBe('TELEPATHY - Hi Dr. Kapil, I want to book the Telepathy Workshop.')
    expect(text('mumbai')).toBe('TELEPATHY - Hi Dr. Kapil, I want to book the Telepathy Workshop — Mumbai, 14–15 Nov.')
    expect(text('ahmedabad')).toBe('TELEPATHY - Hi Dr. Kapil, I want to book the Telepathy Workshop — Ahmedabad, 21–22 Nov.')
    expect(text('vadodara')).toContain('Vadodara')
  })
})

describe('videos', () => {
  it('no video appears twice', () => {
    const all = [FREE_SESSION_VIDEO, ...LONG_REVIEW_VIDEOS, ...SHORT_REVIEW_VIDEOS]
    expect(new Set(all).size).toBe(all.length)
    expect(all.every((id) => /^[\w-]{11}$/.test(id))).toBe(true)
  })
})
