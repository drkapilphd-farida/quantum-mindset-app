import type { Lang } from '@/lib/i18n'
import { TELEPATHY_BATCHES, TELEPATHY_PRICE, TELEPATHY_WHATSAPP_DISPLAY, telepathyBatchData, type TelepathyBatch, type TelepathyBatchId } from '@/config/telepathyWorkshopConfig'
import { FALLBACK_EN, FALLBACK_HI } from '@/data/batches'
import type { Bi } from './telepathyWorkshopCopy'

/** One language's text, with {price}/{earlier}/{deposit}/{balance}/{phone} filled from the config. */
export function pick(text: Bi, lang: Lang, vars: Record<string, string> = {}): string {
  const all: Record<string, string> = { price: TELEPATHY_PRICE.offer, earlier: TELEPATHY_PRICE.earlier, deposit: TELEPATHY_PRICE.deposit, balance: TELEPATHY_PRICE.balance, phone: TELEPATHY_WHATSAPP_DISPLAY, ...vars }
  return text[lang].replace(/\{(\w+)\}/g, (match, key: string) => all[key] ?? match)
}

/** "?lang=hi" / "?lang=en" → that language; anything else → null (keep the saved choice). */
export function langFromParam(value: string | string[] | undefined | null): Lang | null {
  const v = Array.isArray(value) ? value[0] : value
  return v === 'hi' || v === 'en' ? v : null
}

/** Batches still to come at `now`: a dated batch disappears after its last day; an undated one always shows. */
export function visibleBatches(now: number, batches: readonly TelepathyBatch[] = TELEPATHY_BATCHES): TelepathyBatch[] {
  return batches.filter((b) => b.endISO === null || Date.parse(b.endISO) > now)
}

/** The first dated batch that hasn't started yet at `now` (null once all have started). */
export function nextBatch(now: number, batches: readonly TelepathyBatch[] = TELEPATHY_BATCHES): (TelepathyBatch & { startISO: string }) | null {
  return (
    batches
      .filter((b): b is TelepathyBatch & { startISO: string } => b.startISO !== null && Date.parse(b.startISO) > now)
      .sort((a, b) => Date.parse(a.startISO) - Date.parse(b.startISO))[0] ?? null
  )
}

export type CountdownParts = { days: number; hours: number; minutes: number; seconds: number }

export function countdownParts(msLeft: number): CountdownParts {
  const total = Math.max(0, Math.floor(msLeft / 1000))
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

/**
 * Google Calendar "add event" link: one event per day (daily repeat for
 * `days` days), so each day shows its own 9:30–18:00 slot in IST. Null for
 * a batch without a date or venue yet.
 */
export function googleCalendarUrl(batch: TelepathyBatch, title: string, details: string): string | null {
  if (batch.startISO === null || batch.calendarLocation === '') return null
  const day = batch.startISO.slice(0, 10).replace(/-/g, '')
  const hhmm = (t: string): string => `${t.replace(':', '')}00`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${day}T${hhmm(batch.dailyStart)}/${day}T${hhmm(batch.dailyEnd)}`,
    ctz: 'Asia/Kolkata',
    location: batch.calendarLocation,
    details,
  })
  if (batch.days > 1) params.set('recur', `RRULE:FREQ=DAILY;COUNT=${batch.days}`)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** A city's dates, from src/data/batches.ts; the "next date soon" line while it has none. */
export function batchDatesText(id: TelepathyBatchId, lang: Lang): string {
  const data = telepathyBatchData(id)
  if (data === undefined || data.startDate === null) return lang === 'hi' ? FALLBACK_HI : FALLBACK_EN
  return lang === 'hi' ? data.labelHi : data.labelEn
}

/** A city's venue, from src/data/batches.ts ('' while it has none). English falls back to the Hindi venue text. */
export function batchVenueText(id: TelepathyBatchId, lang: Lang): string {
  const data = telepathyBatchData(id)
  if (data === undefined || data.startDate === null) return ''
  return (lang === 'hi' ? data.venueHi : (data.venueEn ?? data.venueHi)) ?? ''
}
