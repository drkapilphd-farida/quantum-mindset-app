// Daily Speed Read (founder, 23 Nov 2026): every day of the 30-day plan, Day 1
// to Day 30, one new passage shown one word at a time (RSVP), then 3 recall
// questions. The learner sees each day's reading speed (WPM) and retention
// (% of questions right), and how much the speed has grown since Day 1.
//
// Speed rule (approved by the founder): the next day's suggested speed is
// +25 WPM after 70% or more retention, −25 after less than 50%, otherwise the
// same. With 3 questions: 3/3 → +25, 2/3 → same, 0–1/3 → −25. The learner can
// still change the speed with − / + before starting.

export const DAILY_RSVP_EXERCISE_ID = 'daily-rsvp'

export const DAILY_RSVP_MIN_WPM = 150
export const DAILY_RSVP_MAX_WPM = 800
export const DAILY_RSVP_STEP = 25
/** First speed when there is no Day 1 reading test yet. */
export const DAILY_RSVP_DEFAULT_START = 200
/** The first speed is a little above the learner's own Day 1 test speed. */
export const DAILY_RSVP_START_MULTIPLIER = 1.2
export const DAILY_RSVP_START_MIN = 180
export const DAILY_RSVP_START_MAX = 400

export const RETENTION_UP_AT = 70
export const RETENTION_DOWN_BELOW = 50

export type DailyRsvpDayResult = {
  day: number
  /** The real reading speed (words ÷ reading time, pauses left out) — what the learner sees. */
  wpm: number
  retentionPercent: number
  /**
   * The speed the words were shown at. The next day's speed builds on this,
   * not on the measured speed: punctuation pauses make the measured speed a
   * little lower, which would otherwise pull the speed down day after day.
   */
  targetWpm?: number
}

const round5 = (n: number): number => Math.round(n / 5) * 5

export function clampRsvpWpm(wpm: number): number {
  if (!Number.isFinite(wpm)) return DAILY_RSVP_DEFAULT_START
  return Math.min(DAILY_RSVP_MAX_WPM, Math.max(DAILY_RSVP_MIN_WPM, Math.round(wpm)))
}

/** − / + on the start screen: steps of 25, within the allowed range. */
export function stepRsvpWpm(wpm: number, dir: -1 | 1): number {
  return clampRsvpWpm(wpm + dir * DAILY_RSVP_STEP)
}

/** Day 1's starting speed: 1.2 × the Day 1 test speed (180–400), or 200 without a test. */
export function startingWpm(baselineWpm: number | null): number {
  if (baselineWpm === null || !Number.isFinite(baselineWpm) || baselineWpm <= 0) return DAILY_RSVP_DEFAULT_START
  return Math.min(DAILY_RSVP_START_MAX, Math.max(DAILY_RSVP_START_MIN, round5(baselineWpm * DAILY_RSVP_START_MULTIPLIER)))
}

/** The speed after a day's result: +25 / same / −25 by retention. */
export function nextWpmAfter(result: { wpm: number; retentionPercent: number; targetWpm?: number }): number {
  const base = round5(result.targetWpm ?? result.wpm)
  if (result.retentionPercent >= RETENTION_UP_AT) return clampRsvpWpm(base + DAILY_RSVP_STEP)
  if (result.retentionPercent < RETENTION_DOWN_BELOW) return clampRsvpWpm(base - DAILY_RSVP_STEP)
  return clampRsvpWpm(base)
}

/** Today's suggested speed: from the latest earlier day's result, else the starting speed. */
export function suggestedWpm(history: readonly DailyRsvpDayResult[], today: number | null, baselineWpm: number | null): number {
  const earlier = history.filter((r) => today === null || r.day < today).sort((a, b) => b.day - a.day)
  const latest = earlier[0]
  return latest === undefined ? startingWpm(baselineWpm) : nextWpmAfter(latest)
}

export function retentionPercent(correct: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((Math.max(0, Math.min(correct, total)) / total) * 100)
}

/** Real reading speed from the words shown and the reading time (pauses left out). */
export function measuredWpm(words: number, activeMs: number, fallbackWpm: number): number {
  if (words <= 0 || !Number.isFinite(activeMs) || activeMs < 1000) return clampRsvpWpm(fallbackWpm)
  return clampRsvpWpm((words / activeMs) * 60_000)
}

export type DailyRsvpGrowth = {
  firstDay: number
  firstWpm: number
  latestDay: number
  latestWpm: number
  /** Change in WPM from the first day to the latest. */
  wpmGain: number
  /** Same, as a percent of the first day's speed. */
  wpmGainPercent: number
}

/** Growth from the first recorded day to the latest one; null with fewer than one result. */
export function dailyRsvpGrowth(history: readonly DailyRsvpDayResult[]): DailyRsvpGrowth | null {
  if (history.length === 0) return null
  const sorted = [...history].sort((a, b) => a.day - b.day)
  const first = sorted[0]!
  const latest = sorted[sorted.length - 1]!
  const wpmGain = latest.wpm - first.wpm
  return {
    firstDay: first.day,
    firstWpm: first.wpm,
    latestDay: latest.day,
    latestWpm: latest.wpm,
    wpmGain,
    wpmGainPercent: first.wpm > 0 ? Math.round((wpmGain / first.wpm) * 100) : 0,
  }
}

/** One result per day: the latest saved play of that day (first plays only, never replays). */
type ResultRow = { day: number; wpm: number; retentionPercent: number; targetWpm?: number; playedAt: string }

export function oneResultPerDay(rows: readonly ResultRow[]): DailyRsvpDayResult[] {
  const byDay = new Map<number, ResultRow>()
  for (const row of rows) {
    const have = byDay.get(row.day)
    if (have === undefined || row.playedAt > have.playedAt) byDay.set(row.day, row)
  }
  return [...byDay.values()]
    .map((r) => ({ day: r.day, wpm: r.wpm, retentionPercent: r.retentionPercent, ...(r.targetWpm !== undefined ? { targetWpm: r.targetWpm } : {}) }))
    .sort((a, b) => a.day - b.day)
}
