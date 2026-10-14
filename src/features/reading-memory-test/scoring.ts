import { MAX_VALID_WPM, type ReadingTestStatus } from '@/features/reading-speed-test/scoring'

// Reading & Memory Test rules (founder, 14 Oct 2026). Pure — used by the
// server action and the tests.
export const RETENTION_TOTAL = 4
/** Fewer than 2 of 4 remembered: the result isn't shown as a score (no price, no offer). */
export const MIN_RETENTION = 2
export const MEMORY_TOTAL = 8

export type MemoryTestScore = {
  status: ReadingTestStatus
  wpm: number
  retention: number
  /** Retention as a percent (the "understanding" part of effective speed). */
  comprehensionPercent: number
  /** WPM × understanding. */
  effectiveWpm: number
  memory: number
}

export function scoreMemoryTest(input: { wordCount: number; elapsedMs: number; retention: number; memory: number }): MemoryTestScore {
  const minutes = Math.max(input.elapsedMs, 1) / 60_000
  const wpm = Math.round(input.wordCount / minutes)
  const retention = Math.min(Math.max(Math.round(input.retention), 0), RETENTION_TOTAL)
  const memory = Math.min(Math.max(Math.round(input.memory), 0), MEMORY_TOTAL)
  const ratio = retention / RETENTION_TOTAL
  let status: ReadingTestStatus = 'valid'
  if (wpm > MAX_VALID_WPM) status = 'too_fast'
  else if (retention < MIN_RETENTION) status = 'low_comprehension'
  return { status, wpm, retention, comprehensionPercent: Math.round(ratio * 100), effectiveWpm: Math.round(wpm * ratio), memory }
}
