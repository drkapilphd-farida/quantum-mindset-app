// Reading Speed Test — pure scoring rules, shared by the server actions and
// the client (the client only uses hasReachedEnd and the display helpers;
// every number shown as a result comes from the server).

/** Above this, the passage cannot have been fully read — no result. */
export const MAX_VALID_WPM = 700
/** Below this, speed is not highlighted — understanding comes first. */
export const MIN_COMPREHENSION_PERCENT = 60

export const PRACTICE_PACE_MIN_WPM = 150
export const PRACTICE_PACE_MAX_WPM = 450
/** The practice demo starts about 20% above the measured speed. */
export const PRACTICE_PACE_UPLIFT = 1.2

export type ReadingTestStatus = 'valid' | 'too_fast' | 'low_comprehension'

export type ReadingTestScore = {
  status: ReadingTestStatus
  wpm: number
  comprehensionPercent: number
  /** WPM × comprehension. The main result, shown only when status is 'valid'. */
  effectiveWpm: number
}

/** Words separated by whitespace — works the same for English and Hindi. */
export function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed === '' ? 0 : trimmed.split(/\s+/u).length
}

export function scoreReadingTest(input: { wordCount: number; elapsedMs: number; correct: number; total: number }): ReadingTestScore {
  const minutes = Math.max(input.elapsedMs, 1) / 60_000
  const wpm = Math.round(input.wordCount / minutes)
  const ratio = input.total > 0 ? Math.min(Math.max(input.correct, 0), input.total) / input.total : 0
  const comprehensionPercent = Math.round(ratio * 100)
  const effectiveWpm = Math.round(wpm * ratio)

  let status: ReadingTestStatus = 'valid'
  if (wpm > MAX_VALID_WPM) status = 'too_fast'
  else if (comprehensionPercent < MIN_COMPREHENSION_PERCENT) status = 'low_comprehension'

  return { status, wpm, comprehensionPercent, effectiveWpm }
}

/** RSVP practice pace: ~20% above the measured WPM, kept within 150–450. */
export function practiceStartingPace(measuredWpm: number): number {
  const target = Math.round(measuredWpm * PRACTICE_PACE_UPLIFT)
  return Math.min(PRACTICE_PACE_MAX_WPM, Math.max(PRACTICE_PACE_MIN_WPM, target))
}

/**
 * "Done" unlocks only once the end of the passage has been on screen:
 * the end marker's top edge is within the viewport (with a small
 * tolerance for sub-pixel rounding).
 */
export function hasReachedEnd(endMarkerTop: number, viewportHeight: number, tolerancePx = 4): boolean {
  return endMarkerTop <= viewportHeight + tolerancePx
}
