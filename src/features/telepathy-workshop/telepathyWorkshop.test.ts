import { describe, expect, it } from 'vitest'
import { TELEPATHY_WORKSHOP_DATES, telepathyWhatsAppHref } from '@/config/telepathyWorkshopConfig'
import { countdownParts, googleCalendarUrl, langFromParam, nextWorkshop, pick } from './telepathyWorkshop'

describe('pick', () => {
  it('fills price and phone in either language', () => {
    expect(pick({ en: 'Book on WhatsApp — {price}', hi: 'WhatsApp पर बुक करें — {price}' }, 'hi')).toBe('WhatsApp पर बुक करें — ₹4,999')
    expect(pick({ en: 'Message on WhatsApp: {phone}', hi: '' }, 'en')).toBe('Message on WhatsApp: 95401 23161')
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

describe('nextWorkshop', () => {
  it('counts to Mumbai, then Ahmedabad, then nothing', () => {
    expect(nextWorkshop(Date.parse('2026-10-29T12:00:00+05:30'))?.city).toBe('mumbai')
    expect(nextWorkshop(Date.parse('2026-11-14T09:29:59+05:30'))?.city).toBe('mumbai')
    expect(nextWorkshop(Date.parse('2026-11-14T09:30:00+05:30'))?.city).toBe('ahmedabad')
    expect(nextWorkshop(Date.parse('2026-11-21T09:30:00+05:30'))).toBeNull()
  })
})

describe('countdownParts', () => {
  it('splits milliseconds and never goes negative', () => {
    expect(countdownParts(((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 })
    expect(countdownParts(-1000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  })
})

describe('googleCalendarUrl', () => {
  it('Mumbai: 14 Nov 9:30–18:00 IST, repeated for 2 days, venue as location', () => {
    const url = new URL(googleCalendarUrl(TELEPATHY_WORKSHOP_DATES[0]!, 'The Telepathy Workshop™ — Mumbai', 'details'))
    expect(url.searchParams.get('dates')).toBe('20261114T093000/20261114T180000')
    expect(url.searchParams.get('ctz')).toBe('Asia/Kolkata')
    expect(url.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY;COUNT=2')
    expect(url.searchParams.get('location')).toContain('Hotel Better Home International')
  })
})

describe('telepathyWhatsAppHref', () => {
  it('uses the exact English messages', () => {
    expect(telepathyWhatsAppHref('general')).toBe('https://wa.me/919540123161?text=TELEPATHY%20-%20I%20want%20to%20know%20about%20the%20workshop')
    expect(new URL(telepathyWhatsAppHref('mumbai')).searchParams.get('text')).toBe('TELEPATHY - Mumbai 14-15 Nov')
    expect(new URL(telepathyWhatsAppHref('ahmedabad')).searchParams.get('text')).toBe('TELEPATHY - Ahmedabad 21-22 Nov')
    expect(new URL(telepathyWhatsAppHref('vadodara')).searchParams.get('text')).toBe('TELEPATHY - Vadodara')
  })
})
