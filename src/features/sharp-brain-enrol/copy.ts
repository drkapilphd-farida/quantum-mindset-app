import { LANGUAGES, type AppLang } from '@/lib/app-i18n/languages'
import { IST_OFFSET_MS } from './batches'

// Price and date formatting for the batch / price / countdown UI. Dates are
// always shown in IST, whatever the visitor's own time zone. The words are in
// src/lib/app-i18n/messages/<lang>/enrol.json (see enrolT).

export function inr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
} as const

/** "15 Oct" / "15 अक्टूबर" / "15 ಅಕ್ಟೋಬರ್" … for an instant, in IST. */
export function istDayMonth(ms: number, lang: AppLang): string {
  if (lang === 'en' || lang === 'hi') {
    const d = new Date(ms + IST_OFFSET_MS)
    return `${d.getUTCDate()} ${MONTHS[lang][d.getUTCMonth()]}`
  }
  return new Intl.DateTimeFormat(LANGUAGES[lang].htmlLang, { day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' }).format(ms)
}

/** The last IST day an offer ending (exclusively) at `endsAtMs` is still on, e.g. "10 Oct, 11:59 PM IST". */
export function istDeadline(endsAtMs: number, lang: AppLang): string {
  const last = endsAtMs - 60_000
  if (lang === 'en' || lang === 'hi') {
    const d = new Date(last + IST_OFFSET_MS)
    const h = d.getUTCHours()
    const m = String(d.getUTCMinutes()).padStart(2, '0')
    const h12 = h % 12 === 0 ? 12 : h % 12
    return `${istDayMonth(last, lang)}, ${h12}:${m} ${h < 12 ? 'AM' : 'PM'} IST`
  }
  const time = new Intl.DateTimeFormat(LANGUAGES[lang].htmlLang, { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(last)
  return `${istDayMonth(last, lang)}, ${time} IST`
}

export function countdownParts(remainingMs: number): { d: number; h: number; m: number; s: number } {
  const total = Math.max(0, Math.floor(remainingMs / 1000))
  return { d: Math.floor(total / 86_400), h: Math.floor((total % 86_400) / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 }
}
