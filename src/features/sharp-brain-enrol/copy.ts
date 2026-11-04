import { LANGUAGES, type AppLang } from '@/lib/app-i18n/languages'

// Price and date formatting for the price / seat / next-class UI. Dates are
// always shown in IST, whatever the visitor's own time zone. The words are in
// src/lib/app-i18n/messages/<lang>/enrol.json (see enrolT).

export function inr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

const IST = 'Asia/Kolkata'

/**
 * A live class start, the way the page says it: "Mon, 9 Nov, 8 pm" /
 * "सोमवार, 9 नवंबर, रात 8 बजे"; other app languages use their own date and
 * time format. Always India time, 0–9 digits.
 */
export function classWhen(iso: string, lang: AppLang): string {
  const at = new Date(iso)
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: IST, hour: 'numeric', minute: '2-digit', hourCycle: 'h23' }).formatToParts(at)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  const clock = minute === '00' ? `${h12}` : `${h12}:${minute}`
  if (lang === 'en') {
    const date = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: IST }).format(at)
    return `${date}, ${clock} ${hour < 12 ? 'am' : 'pm'}`
  }
  if (lang === 'hi') {
    const date = new Intl.DateTimeFormat('hi-IN-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', timeZone: IST }).format(at)
    const part = hour < 12 ? 'सुबह' : hour < 17 ? 'दोपहर' : hour < 19 ? 'शाम' : 'रात'
    return `${date}, ${part} ${clock} बजे`
  }
  const htmlLang = LANGUAGES[lang].htmlLang
  const date = new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { weekday: 'short', day: 'numeric', month: 'short', timeZone: IST }).format(at)
  const time = new Intl.DateTimeFormat(`${htmlLang}-IN-u-nu-latn`, { hour: 'numeric', minute: '2-digit', timeZone: IST }).format(at)
  return `${date}, ${time}`
}

export function countdownParts(remainingMs: number): { d: number; h: number; m: number; s: number } {
  const total = Math.max(0, Math.floor(remainingMs / 1000))
  return { d: Math.floor(total / 86_400), h: Math.floor((total % 86_400) / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 }
}
