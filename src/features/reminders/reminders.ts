import { isCheckpointDay } from '@/features/thirty-day-curriculum/curriculumDatabase'

// Pure rules of daily reminders (Phase 3): today's status for the in-app
// banner, the streak (India calendar days), and when a phone reminder is due.

const IST_OFFSET_MS = (5 * 60 + 30) * 60_000
const DAY_MS = 86_400_000
export const TOTAL_DAYS = 30
/** Reminder times a learner can pick (India time). */
export const EARLIEST_REMINDER = '06:00'
export const LATEST_REMINDER = '22:00'
export const DEFAULT_REMINDER = '19:00'
/** A reminder missed by the scheduler is still sent up to this long after its time. */
export const LATE_WINDOW_MIN = 180

/** "2026-10-08" — the calendar date in India. */
export function istDateKey(ms: number): string {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10)
}

/** Minutes since midnight in India. */
export function istMinutes(ms: number): number {
  const d = new Date(ms + IST_OFFSET_MS)
  return d.getUTCHours() * 60 + d.getUTCMinutes()
}

/** "19:00" or "19:00:00" → 1140. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number) as [number, number]
  return h * 60 + m
}

function dateKeyToMs(key: string): number {
  return Date.parse(`${key}T00:00:00Z`)
}

/** Whole calendar days from a to b. */
export function daysBetween(a: string, b: string): number {
  return Math.round((dateKeyToMs(b) - dateKeyToMs(a)) / DAY_MS)
}

export type Completion = { day: number; completedAt: string }

export type TodayStatus =
  | { kind: 'ready'; day: number }
  | { kind: 'opens_later'; day: number; opensAt: string }
  | { kind: 'missed'; day: number; missedDays: number }
  | { kind: 'complete' }

/** What the banner says today. Missed days never reset anything: the next day is simply waiting. */
export function todayStatus(completions: readonly Completion[], nextDayOpensAt: string | null, nowMs: number): TodayStatus {
  if (completions.length === 0) return { kind: 'ready', day: 1 }
  const last = completions.reduce((a, b) => (b.day > a.day ? b : a))
  if (last.day >= TOTAL_DAYS) return { kind: 'complete' }
  const next = last.day + 1
  if (nextDayOpensAt !== null && nowMs < Date.parse(nextDayOpensAt)) return { kind: 'opens_later', day: next, opensAt: nextDayOpensAt }
  const missedDays = daysBetween(istDateKey(Date.parse(last.completedAt)), istDateKey(nowMs)) - 1
  return missedDays >= 1 ? { kind: 'missed', day: next, missedDays } : { kind: 'ready', day: next }
}

/** Calendar days in a row (India time) with a completed day, ending today or yesterday. */
export function streakDays(completions: readonly Completion[], nowMs: number): number {
  const dates = new Set(completions.map((c) => istDateKey(Date.parse(c.completedAt))))
  const today = istDateKey(nowMs)
  let cursorMs = dateKeyToMs(today)
  if (!dates.has(today)) cursorMs -= DAY_MS
  let streak = 0
  while (dates.has(new Date(cursorMs).toISOString().slice(0, 10))) {
    streak += 1
    cursorMs -= DAY_MS
  }
  return streak
}

/** Practice is waiting today — the only time a phone reminder is sent. */
export function practiceWaiting(status: TodayStatus): status is Extract<TodayStatus, { kind: 'ready' | 'missed' }> {
  return status.kind === 'ready' || status.kind === 'missed'
}

/** The reminder time has come today (and isn't more than 3 hours past). */
export function isReminderTime(reminderTime: string, nowMs: number): boolean {
  const now = istMinutes(nowMs)
  const at = timeToMinutes(reminderTime)
  return now >= at && now < at + LATE_WINDOW_MIN
}

export type ReminderKind = 'checkin' | 'live_class' | 'missed' | 'daily'

/** Which message today's single reminder carries (check-in day first, then a class tomorrow, then a long absence). */
export function reminderKind(status: Extract<TodayStatus, { kind: 'ready' | 'missed' }>, liveClassTomorrow: boolean): ReminderKind {
  if (isCheckpointDay(status.day) && status.day !== 1) return 'checkin'
  if (liveClassTomorrow) return 'live_class'
  if (status.kind === 'missed' && status.missedDays >= 2) return 'missed'
  return 'daily'
}

/** A session starting on tomorrow's India calendar date. */
export function startsTomorrow(startsAt: string, nowMs: number): boolean {
  return istDateKey(Date.parse(startsAt)) === istDateKey(nowMs + DAY_MS)
}

/** A valid reminder time ("HH:MM", 06:00–22:00, on the quarter hour). */
export function cleanReminderTime(input: string): string | null {
  if (!/^\d{2}:\d{2}$/.test(input)) return null
  const minutes = timeToMinutes(input)
  if (minutes < timeToMinutes(EARLIEST_REMINDER) || minutes > timeToMinutes(LATEST_REMINDER) || minutes % 15 !== 0) return null
  return input
}
