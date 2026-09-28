// Mobile Discipline (Phase 8, Item 12) — pure logic shared by the server
// actions and the screens. Everything is self-reported: the app never
// blocks the device or reads other apps.

export const FOCUS_SESSION_MINUTES = [10, 15, 25] as const
export type FocusMinutes = (typeof FOCUS_SESSION_MINUTES)[number]

export const GOAL_PRESETS_MINUTES = [30, 60, 90, 120] as const
export const MIN_GOAL_MINUTES = 15
export const MAX_GOAL_MINUTES = 720

const DAY_MS = 86_400_000
const IST_OFFSET_MS = 5.5 * 3_600_000

/** The calendar date in India (YYYY-MM-DD) — days roll over at IST midnight. */
export function istDate(date: Date): string {
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10)
}

function shiftDate(isoDate: string, days: number): string {
  return new Date(Date.parse(`${isoDate}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)
}

export type GoalCheckin = { date: string; withinGoal: boolean }

/**
 * Days in a row within the goal, ending today — or ending yesterday while
 * today's check-in hasn't been done yet (so the streak isn't "lost" in the
 * morning). A missed or "no" day ends the streak; the next "yes" starts a
 * new one. No penalties, no shaming — it simply restarts.
 */
export function computeGoalStreak(checkins: readonly GoalCheckin[], today: string): number {
  const byDate = new Map(checkins.map((c) => [c.date, c.withinGoal]))
  let day = byDate.has(today) ? today : shiftDate(today, -1)
  let streak = 0
  while (byDate.get(day) === true) {
    streak++
    day = shiftDate(day, -1)
  }
  return streak
}

export type FocusSessionRecord = { plannedMinutes: number; completedAt: string }

export type WeekDay = { date: string; focusMinutes: number; sessions: number; withinGoal: boolean | null }

export type WeeklySummary = {
  days: WeekDay[]
  focusMinutes: number
  sessions: number
  daysWithinGoal: number
  daysCheckedIn: number
}

/** The last 7 IST days (oldest first), including today. */
export function weeklySummary(sessions: readonly FocusSessionRecord[], checkins: readonly GoalCheckin[], today: string): WeeklySummary {
  const dates = Array.from({ length: 7 }, (_, i) => shiftDate(today, i - 6))
  const checkinByDate = new Map(checkins.map((c) => [c.date, c.withinGoal]))
  const days: WeekDay[] = dates.map((date) => {
    const daySessions = sessions.filter((s) => istDate(new Date(s.completedAt)) === date)
    return {
      date,
      focusMinutes: daySessions.reduce((sum, s) => sum + s.plannedMinutes, 0),
      sessions: daySessions.length,
      withinGoal: checkinByDate.get(date) ?? null,
    }
  })
  return {
    days,
    focusMinutes: days.reduce((sum, d) => sum + d.focusMinutes, 0),
    sessions: days.reduce((sum, d) => sum + d.sessions, 0),
    daysWithinGoal: days.filter((d) => d.withinGoal === true).length,
    daysCheckedIn: days.filter((d) => d.withinGoal !== null).length,
  }
}

/** Grace for timer jitter / a slow network when checking a completed session. */
export const FOCUS_COMPLETION_GRACE_MS = 30_000
/** A session started longer ago than this is not accepted (stale page). */
export const FOCUS_MAX_AGE_MS = 3 * 3_600_000

/** True when a session that started at `startedAt` could really have run its full length by `now`. */
export function isCompletedFocusSession(plannedMinutes: number, startedAt: Date, now: Date): boolean {
  const elapsed = now.getTime() - startedAt.getTime()
  return elapsed >= plannedMinutes * 60_000 - FOCUS_COMPLETION_GRACE_MS && elapsed <= FOCUS_MAX_AGE_MS
}
