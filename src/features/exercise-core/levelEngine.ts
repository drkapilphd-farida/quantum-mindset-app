// The shared 10-level ladder every rebuilt exercise uses.
//
// A session is a few short ROUNDS (each a small block of trials). After every
// round its accuracy is classed as good, okay or poor:
//   3 good rounds in a row → one level up
//   2 poor rounds in a row → one level down
// With the default thresholds (good ≥ 85 %, poor < 60 %) learners settle on
// the level where they get roughly 70–85 % right — hard enough to grow, easy
// enough to enjoy. Everyone starts at level 1, and the runs carry over between
// sessions (they are saved with each result), so a level-up can be earned
// across two short sessions.

export const MIN_LEVEL = 1
export const MAX_LEVEL = 10
export const GOOD_ROUNDS_TO_LEVEL_UP = 3
export const POOR_ROUNDS_TO_LEVEL_DOWN = 2

export type RoundGrade = 'good' | 'okay' | 'poor'

export type LevelThresholds = { good: number; poor: number }

export const DEFAULT_THRESHOLDS: LevelThresholds = { good: 0.85, poor: 0.6 }

export type LevelState = { level: number; goodRun: number; poorRun: number }

export const START_STATE: LevelState = { level: MIN_LEVEL, goodRun: 0, poorRun: 0 }

export type LevelChange = 'up' | 'down' | null

export function clampLevel(level: number): number {
  if (!Number.isFinite(level)) return MIN_LEVEL
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level)))
}

/** accuracy is 0–1 (share of the round's trials answered correctly). */
export function gradeRound(accuracy: number, thresholds: LevelThresholds = DEFAULT_THRESHOLDS): RoundGrade {
  if (accuracy >= thresholds.good) return 'good'
  if (accuracy < thresholds.poor) return 'poor'
  return 'okay'
}

export function applyRound(state: LevelState, grade: RoundGrade): { state: LevelState; change: LevelChange } {
  const level = clampLevel(state.level)
  if (grade === 'good') {
    const goodRun = state.goodRun + 1
    if (goodRun >= GOOD_ROUNDS_TO_LEVEL_UP && level < MAX_LEVEL) return { state: { level: level + 1, goodRun: 0, poorRun: 0 }, change: 'up' }
    return { state: { level, goodRun: Math.min(goodRun, GOOD_ROUNDS_TO_LEVEL_UP), poorRun: 0 }, change: null }
  }
  if (grade === 'poor') {
    const poorRun = state.poorRun + 1
    if (poorRun >= POOR_ROUNDS_TO_LEVEL_DOWN && level > MIN_LEVEL) return { state: { level: level - 1, goodRun: 0, poorRun: 0 }, change: 'down' }
    return { state: { level, goodRun: 0, poorRun: Math.min(poorRun, POOR_ROUNDS_TO_LEVEL_DOWN) }, change: null }
  }
  return { state: { level, goodRun: 0, poorRun: 0 }, change: null }
}

/** Rebuilds a saved state defensively (old rows, hand-edited storage). */
export function normaliseLevelState(value: unknown): LevelState {
  if (typeof value !== 'object' || value === null) return START_STATE
  const record = value as Record<string, unknown>
  const num = (v: unknown, max: number): number => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(0, Math.round(v))) : 0)
  return {
    level: clampLevel(typeof record.level === 'number' ? record.level : MIN_LEVEL),
    goodRun: num(record.goodRun, GOOD_ROUNDS_TO_LEVEL_UP - 1),
    poorRun: num(record.poorRun, POOR_ROUNDS_TO_LEVEL_DOWN - 1),
  }
}
