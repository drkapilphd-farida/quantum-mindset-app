import { describe, expect, it } from 'vitest'
import { computeCheckpointDelta, computeReadingGrowthPercent, type CurriculumCheckpointResult, type CurriculumProgress } from './curriculumProgress'

// Reading speed is not comparable across languages: growth and Day-1 deltas
// only compare checkpoints read in the same language. Unlocking and
// completed days are unaffected.

const cp = (day: number, trueWpm: number, contentLang?: CurriculumCheckpointResult['contentLang']): CurriculumCheckpointResult => ({
  day,
  rawWpm: trueWpm,
  trueWpm,
  comprehensionAccuracyPercent: 80,
  completedAt: '2026-10-02T10:00:00.000Z',
  ...(contentLang !== undefined ? { contentLang } : {}),
})
const progress = (...checkpoints: CurriculumCheckpointResult[]): CurriculumProgress => ({
  completedDays: checkpoints.map((c) => c.day),
  checkpoints: Object.fromEntries(checkpoints.map((c) => [c.day, c])),
  completedDayTimestamps: {},
  uploadStartedDays: [],
})

describe('WPM is compared only within one language', () => {
  it('same language: growth and delta as before (older records without a language count as English)', () => {
    const p = progress(cp(1, 200), cp(7, 250, 'en'))
    expect(computeReadingGrowthPercent(p)).toBe(25)
    expect(computeCheckpointDelta(p, 7)?.wpmGrowthPercent).toBe(25)
  })

  it('different languages: no Day-1 delta and no growth across them', () => {
    const p = progress(cp(1, 200, 'en'), cp(7, 120, 'hi'))
    expect(computeCheckpointDelta(p, 7)).toBeNull()
    expect(computeReadingGrowthPercent(p)).toBeNull()
  })

  it('growth uses the earliest checkpoint in the latest checkpoint’s language', () => {
    const p = progress(cp(1, 200, 'en'), cp(7, 100, 'hi'), cp(14, 150, 'hi'))
    expect(computeReadingGrowthPercent(p)).toBe(50)
  })
})
