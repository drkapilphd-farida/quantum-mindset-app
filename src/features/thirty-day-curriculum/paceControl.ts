import { buildCurriculumDayPlan, doneStepIds } from './curriculumDatabase'
import { buildSessionQueue } from './curriculumSessionRunner'

// Pure rules of pace control (Phase 3, item 4): one new day per calendar day,
// opening at midnight India time, completed after about 10 minutes of active
// practice and all of that day's steps. The server applies these rules; the
// app only mirrors them for display.

/** About 10 minutes of active practice per day (approved 8 Oct 2026). */
export const PACE_REQUIRED_SECONDS = 600
/** The app sends a practice heartbeat this often while a day's step is open and in use. */
export const BEAT_INTERVAL_MS = 30_000
/** One heartbeat never credits more than this, so time can't add up faster than the clock. */
export const BEAT_MAX_CREDIT_S = 45
/** After a longer gap the next heartbeat restarts the count (credits nothing). */
export const BEAT_MAX_GAP_S = 120
/** No touch or key for this long pauses the count (audio-guided steps get longer). */
export const IDLE_PAUSE_MS = 2 * 60_000
export const AUDIO_IDLE_PAUSE_MS = 12 * 60_000
/** Steps a learner mostly listens to (guided audio or breathing), so few taps. */
export const AUDIO_GUIDED_STEPS: ReadonlySet<string> = new Set(['memory-palace', 'calm-breathing', 'color-scene-transformation'])

const IST_OFFSET_MS = (5 * 60 + 30) * 60_000

/** 00:00 IST on the calendar day after `iso` (in India time). */
export function nextIstMidnight(iso: string): string {
  const istMs = Date.parse(iso) + IST_OFFSET_MS
  const d = new Date(istMs)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - IST_OFFSET_MS).toISOString()
}

/**
 * When the day after `prev` opens: always now. Founder rule (9 Nov 2026):
 * the next day opens the moment a day is completed — no midnight wait.
 * Kept so callers (reminders, plan page) need no special case.
 */
export function dayOpensAt(_prev: { completedAt: string; paced: boolean } | null, _paceOff: boolean): string | null {
  return null
}

/** Seconds a heartbeat adds: the time since the last one, capped; nothing after a long gap. */
export function beatCredit(lastBeatAt: string | null, nowMs: number): number {
  if (lastBeatAt === null) return 0
  const gapS = (nowMs - Date.parse(lastBeatAt)) / 1000
  if (!Number.isFinite(gapS) || gapS <= 0 || gapS > BEAT_MAX_GAP_S) return 0
  return Math.min(Math.round(gapS), BEAT_MAX_CREDIT_S)
}

/** The exercise ids a day consists of, in play order. */
export function dayStepIds(day: number): readonly string[] {
  return buildSessionQueue(buildCurriculumDayPlan(day).exercises)
}

/** Steps of the day not yet finished, in play order. */
export function missingSteps(day: number, done: readonly string[]): string[] {
  const finished = doneStepIds(day, done)
  return dayStepIds(day).filter((id) => !finished.has(id))
}

/** "Do this later": the current step moves to the end of what's left. */
export function doLater<T>(order: readonly T[]): T[] {
  return order.length <= 1 ? [...order] : [...order.slice(1), order[0]!]
}

/** "6:12" */
export function formatPracticeTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
