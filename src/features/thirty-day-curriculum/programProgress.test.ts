import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/exercises/queries/getModuleProgress', () => ({ getModuleProgress: vi.fn() }))
vi.mock('./actions/getCurriculumDayCompletions', () => ({ getCurriculumDayCompletions: vi.fn() }))

const { computeProgramProgress } = await import('./programProgress')

describe('30-day plan progress (replaces the Eye Foundation module in scores)', () => {
  it('Day 1 learner: nothing done, next day 1', () => {
    expect(computeProgramProgress([], 0, 6)).toMatchObject({ completedDays: 0, nextDay: 1, percent: 0, scorePercent: 0, activityCount: 0 })
  })

  it('Day 12 learner: 11 days done', () => {
    const days = Array.from({ length: 11 }, (_, i) => i + 1)
    expect(computeProgramProgress(days, 0, 6)).toMatchObject({ completedDays: 11, nextDay: 12, percent: 37, scorePercent: 37 })
  })

  it('finished learner: all 30 done, no next day', () => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1)
    expect(computeProgramProgress(days, 0, 6)).toMatchObject({ completedDays: 30, nextDay: null, percent: 100, scorePercent: 100 })
  })

  it('a learner who finished the old Eye Foundation module never sees a lower score', () => {
    expect(computeProgramProgress([1, 2], 6, 6)).toMatchObject({ percent: 7, scorePercent: 100, activityCount: 6 })
    expect(computeProgramProgress([1, 2, 3], 3, 6)).toMatchObject({ scorePercent: 50 })
  })

  it('ignores duplicates and out-of-range days; next day is the first gap', () => {
    expect(computeProgramProgress([1, 1, 2, 4, 31, 0], 0, 6)).toMatchObject({ completedDays: 3, nextDay: 3 })
  })
})
