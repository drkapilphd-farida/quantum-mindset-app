import { calmMindBatch } from '@/config/site.config'

// 21-Day Calm Mind batch — dates, seats and the calendar file (pure functions,
// tested). All times are IST (UTC+5:30); classes run 8:00–9:00 PM IST.

export type Lang = 'en' | 'hi'
export type BatchStatus = 'open' | 'full' | 'ended'
export type BatchState = { status: BatchStatus; seatsLeft: number | null; showSeats: boolean }

const IST_OFFSET_MS = 330 * 60_000
export const CLASS_START_IST = { hour: 20, minute: 0 }
export const CLASS_MINUTES = 60
/** "Only X seats left" shows only when X is 10 or fewer (owner). */
export const SHOW_SEATS_AT = 10

/** "1 December 2026" / "1 दिसंबर 2026". */
export function formatBatchDate(iso: string, lang: Lang): string {
  const date = new Date(`${iso}T12:00:00+05:30`)
  return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
}

/** "Tue 1 Dec" / "मंगल, 1 दिस॰" — short label next to each class in the timeline. */
export function formatClassDate(iso: string, lang: Lang): string {
  const date = new Date(`${iso}T12:00:00+05:30`)
  return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })
}

/** Today's date in IST as YYYY-MM-DD. */
export function istToday(nowMs: number): string {
  return new Date(nowMs + IST_OFFSET_MS).toISOString().slice(0, 10)
}

/** UTC milliseconds of a class start (8:00 PM IST on that date). */
export function classStartMs(iso: string): number {
  return Date.parse(`${iso}T${String(CLASS_START_IST.hour).padStart(2, '0')}:${String(CLASS_START_IST.minute).padStart(2, '0')}:00+05:30`)
}

/**
 * The batch on the page right now:
 * - ended: the start date has passed (in IST) → "dates announced soon — join the waitlist";
 * - full: no seats left → "Batch full — join the waitlist", checkout off;
 * - open: seats left shown only when ≤ 10. paidCount null = unknown (database not reachable): no seat line, checkout stays on.
 */
export function batchState(nowMs: number, paidCount: number | null, startDate: string = calmMindBatch.nextBatch.startDate, seatsTotal: number = calmMindBatch.seatsTotal): BatchState {
  if (istToday(nowMs) > startDate) return { status: 'ended', seatsLeft: null, showSeats: false }
  if (paidCount === null) return { status: 'open', seatsLeft: null, showSeats: false }
  const seatsLeft = Math.max(0, seatsTotal - paidCount)
  if (seatsLeft === 0) return { status: 'full', seatsLeft: 0, showSeats: false }
  return { status: 'open', seatsLeft, showSeats: seatsLeft <= SHOW_SEATS_AT }
}

const icsDate = (ms: number): string => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsText = (text: string): string => text.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

/** An .ics calendar with the 6 classes (8:00–9:00 PM IST). The Zoom link is added only in the email copy. */
export function buildBatchIcs(options: { zoomLink?: string | undefined; nowMs?: number } = {}): string {
  const stamp = icsDate(options.nowMs ?? Date.now())
  const description = options.zoomLink !== undefined && options.zoomLink !== '' ? `Zoom: ${options.zoomLink}` : 'Your Zoom link is in your confirmation email and on WhatsApp.'
  const events = calmMindBatch.nextBatch.classDates.map((iso, index) => {
    const start = classStartMs(iso)
    return [
      'BEGIN:VEVENT',
      `UID:calm-mind-${calmMindBatch.nextBatch.startDate}-class-${index + 1}@mindurmind.org.in`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(start + CLASS_MINUTES * 60_000)}`,
      `SUMMARY:${icsText(`21-Day Calm Mind — Live class ${index + 1} of 6 (Dr. Kapil)`)}`,
      `DESCRIPTION:${icsText(description)}`,
      ...(options.zoomLink !== undefined && options.zoomLink !== '' ? [`LOCATION:${icsText(options.zoomLink)}`] : []),
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      `DESCRIPTION:${icsText('Calm Mind class in 1 hour')}`,
      'END:VALARM',
      'END:VEVENT',
    ].join('\r\n')
  })
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mind Ur Mind//Calm Mind Batch//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', ...events, 'END:VCALENDAR', ''].join('\r\n')
}

/** The reminders cron runs every 15 minutes: a reminder is due when "now" falls in its 15-minute window. */
export const REMINDER_WINDOW_MS = 15 * 60_000
export type DueReminder = { kind: 'day-before' | 'hour-before'; classNumber: number }

/** Day-before email for class 1 (8:00 PM IST the evening before), and an email 1 hour before each class. */
export function dueReminders(nowMs: number, classDates: readonly string[] = calmMindBatch.nextBatch.classDates): DueReminder[] {
  const due: DueReminder[] = []
  const inWindow = (target: number): boolean => nowMs >= target && nowMs < target + REMINDER_WINDOW_MS
  classDates.forEach((iso, index) => {
    const start = classStartMs(iso)
    if (index === 0 && inWindow(start - 24 * 60 * 60_000)) due.push({ kind: 'day-before', classNumber: 1 })
    if (inWindow(start - 60 * 60_000)) due.push({ kind: 'hour-before', classNumber: index + 1 })
  })
  return due
}
