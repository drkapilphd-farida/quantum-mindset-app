import type { Lang } from '@/lib/i18n'
import {
  TELEPATHY_PRICE,
  TELEPATHY_WHATSAPP_DISPLAY,
  TELEPATHY_WORKSHOP_DATES,
  type TelepathyWorkshopDate,
} from '@/config/telepathyWorkshopConfig'
import type { Bi } from './telepathyWorkshopCopy'

/** One language's text, with {price}/{mrp}/{phone} filled from the config. */
export function pick(text: Bi, lang: Lang, vars: Record<string, string> = {}): string {
  const all: Record<string, string> = { price: TELEPATHY_PRICE.offer, mrp: TELEPATHY_PRICE.mrp, phone: TELEPATHY_WHATSAPP_DISPLAY, ...vars }
  return text[lang].replace(/\{(\w+)\}/g, (match, key: string) => all[key] ?? match)
}

/** "?lang=hi" / "?lang=en" → that language; anything else → null (keep the saved choice). */
export function langFromParam(value: string | string[] | undefined | null): Lang | null {
  const v = Array.isArray(value) ? value[0] : value
  return v === 'hi' || v === 'en' ? v : null
}

/** The first workshop that hasn't started yet at `now` (null once all have started). */
export function nextWorkshop(now: number, dates: readonly TelepathyWorkshopDate[] = TELEPATHY_WORKSHOP_DATES): TelepathyWorkshopDate | null {
  return (
    [...dates]
      .sort((a, b) => Date.parse(a.startISO) - Date.parse(b.startISO))
      .find((d) => Date.parse(d.startISO) > now) ?? null
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
 * `days` days), so each day shows its own 9:30–18:00 slot in IST.
 */
export function googleCalendarUrl(date: TelepathyWorkshopDate, title: string, details: string): string {
  const day = date.startISO.slice(0, 10).replace(/-/g, '')
  const hhmm = (t: string): string => `${t.replace(':', '')}00`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${day}T${hhmm(date.dailyStart)}/${day}T${hhmm(date.dailyEnd)}`,
    ctz: 'Asia/Kolkata',
    location: date.calendarLocation,
    details,
  })
  if (date.days > 1) params.set('recur', `RRULE:FREQ=DAILY;COUNT=${date.days}`)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
