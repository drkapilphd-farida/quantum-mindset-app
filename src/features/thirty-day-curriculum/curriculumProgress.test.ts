import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CURRICULUM_PROGRESS_STORAGE_KEY,
  computeBrainDevelopmentScore,
  computeCheckpointDelta,
  computeComprehensionAveragePercent,
  computeConsistencyPercent,
  computeDailyCurriculumStreak,
  computeReadingGrowthPercent,
  getHighestUnlockedDay,
  isCurriculumDayUnlocked,
  loadCurriculumProgress,
  markCurriculumDayComplete,
  recordCurriculumCheckpoint,
  type CurriculumProgress,
} from './curriculumProgress'

// This suite's default vitest environment is 'node' (see vitest.config.ts),
// so `window`/`localStorage` don't exist unless stubbed — same approach as
// readingLocalHistory.test.ts / sensoryHologramBuilderLocalHistory.test.ts.
let store: Record<string, string>

beforeEach(() => {
  store = {}
  vi.stubGlobal('window', {})
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadCurriculumProgress', () => {
  it('returns empty progress when nothing is stored', () => {
    expect(loadCurriculumProgress()).toEqual({ completedDays: [], checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] })
  })

  it('ignores corrupted JSON rather than throwing', () => {
    localStorage.setItem(CURRICULUM_PROGRESS_STORAGE_KEY, '{not valid json')
    expect(loadCurriculumProgress()).toEqual({ completedDays: [], checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] })
  })
})

describe('markCurriculumDayComplete', () => {
  it('adds a day and persists it', () => {
    markCurriculumDayComplete(1)
    expect(loadCurriculumProgress().completedDays).toEqual([1])
  })

  it('does not duplicate an already-completed day', () => {
    markCurriculumDayComplete(1)
    markCurriculumDayComplete(1)
    expect(loadCurriculumProgress().completedDays).toEqual([1])
  })

  it('keeps completedDays sorted regardless of completion order', () => {
    markCurriculumDayComplete(3)
    markCurriculumDayComplete(1)
    markCurriculumDayComplete(2)
    expect(loadCurriculumProgress().completedDays).toEqual([1, 2, 3])
  })

  it('records a real completion timestamp for the day', () => {
    markCurriculumDayComplete(1)
    const timestamp = loadCurriculumProgress().completedDayTimestamps[1]
    expect(timestamp).toBeDefined()
    expect(Number.isNaN(new Date(timestamp!).getTime())).toBe(false)
  })

  it('never overwrites an already-recorded completion timestamp on replay', () => {
    markCurriculumDayComplete(1)
    const firstTimestamp = loadCurriculumProgress().completedDayTimestamps[1]
    markCurriculumDayComplete(1)
    expect(loadCurriculumProgress().completedDayTimestamps[1]).toBe(firstTimestamp)
  })
})

describe('isCurriculumDayUnlocked / getHighestUnlockedDay', () => {
  it('30-Day Masterclass Paywall: a NEW (not-yet-completed) day is locked for a non-Pro user, including day 1', () => {
    expect(isCurriculumDayUnlocked(1, [], false)).toBe(false)
    expect(isCurriculumDayUnlocked(2, [], false)).toBe(false)
  })

  it('day 1 is unlocked for a Pro user', () => {
    expect(isCurriculumDayUnlocked(1, [], true)).toBe(true)
  })

  it('for a Pro user, day N unlocks only once day N-1 is complete', () => {
    expect(isCurriculumDayUnlocked(2, [1], true)).toBe(true)
    expect(isCurriculumDayUnlocked(3, [1], true)).toBe(false)
  })

  // Permanent access regression tests (see the "Fix 30-Day Curriculum
  // Pricing + Permanent Day Access" task) — the reported bug: a user
  // completes Day 1-20, then Day 1 (and any other already-completed day)
  // shows as locked again. Root cause was `!isPro` being checked BEFORE
  // completion, so any lapse/glitch in the Pro check re-locked every
  // already-earned day, including Day 1. These assert the fix: a
  // completed day is permanently accessible, full stop.
  describe('permanent access to already-completed days', () => {
    it('a completed day stays unlocked even if isPro is now false (lapsed subscription, stale check, etc.)', () => {
      expect(isCurriculumDayUnlocked(1, [1, 2], false)).toBe(true)
      expect(isCurriculumDayUnlocked(2, [1, 2], false)).toBe(true)
      // Day 3 was never completed — still correctly gated by isPro.
      expect(isCurriculumDayUnlocked(3, [1, 2], false)).toBe(false)
    })

    it('regression check: after completing days 1-20, Day 1 and Day 10 (any earlier completed day) both remain open for a Pro user', () => {
      const completedDays = Array.from({ length: 20 }, (_, i) => i + 1) // [1..20]
      expect(isCurriculumDayUnlocked(1, completedDays, true)).toBe(true)
      expect(isCurriculumDayUnlocked(10, completedDays, true)).toBe(true)
      expect(isCurriculumDayUnlocked(20, completedDays, true)).toBe(true)
      // Day 21 (the next NEW day) still correctly requires day 20 complete — it is, so it's open too.
      expect(isCurriculumDayUnlocked(21, completedDays, true)).toBe(true)
      // Day 22 has not been earned yet — still correctly locked.
      expect(isCurriculumDayUnlocked(22, completedDays, true)).toBe(false)
    })

    it('a completed day out of order (non-contiguous completedDays) is still permanently accessible', () => {
      expect(isCurriculumDayUnlocked(5, [1, 5], true)).toBe(true)
      expect(isCurriculumDayUnlocked(5, [1, 5], false)).toBe(true)
    })
  })

  // Paywall bypass regression tests (see the "Pre-Launch Audit Fix Pass"
  // task, Phase 4) — isCurriculumDayUnlocked no longer takes a
  // browser-owned CurriculumProgress at all; it only ever sees
  // `serverCompletedDays`, an argument standing in for a real,
  // RLS-scoped read of curriculum_day_completions. These assert the two
  // exploits that motivated the change: completing only Day 1 (server-
  // side) must never unlock Day 30, and there is structurally no
  // "localStorage" input left to tamper with for this function's
  // decision — a caller that passed a client-forged list would be
  // passing something other than the real server response, not
  // something this function itself can be tricked into trusting.
  it('paywall bypass: completing only day 1 server-side does not unlock day 30', () => {
    expect(isCurriculumDayUnlocked(30, [1], true)).toBe(false)
  })

  it('paywall bypass: an empty server-verified list locks every day except day 1 for a Pro user, no matter what day is requested', () => {
    for (const day of [2, 5, 15, 29, 30]) {
      expect(isCurriculumDayUnlocked(day, [], true)).toBe(false)
    }
  })

  it('getHighestUnlockedDay walks the unbroken completion streak from day 1', () => {
    expect(getHighestUnlockedDay({ completedDays: [1, 2, 3], checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] })).toBe(4)
    expect(getHighestUnlockedDay({ completedDays: [1, 3], checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] })).toBe(2)
    expect(getHighestUnlockedDay({ completedDays: [], checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] })).toBe(1)
  })

  describe('dev/test unlock override (NEXT_PUBLIC_DEV_UNLOCK)', () => {
    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('unlocks every day, regardless of Pro status or completion, when the platform-wide dev/test bypass is on', () => {
      vi.stubEnv('NEXT_PUBLIC_DEV_UNLOCK', 'true')
      expect(isCurriculumDayUnlocked(1, [], false)).toBe(true)
      expect(isCurriculumDayUnlocked(15, [], false)).toBe(true)
      expect(isCurriculumDayUnlocked(30, [], false)).toBe(true)
      // getHighestUnlockedDay is a pure content-sequencing display helper,
      // deliberately decoupled from isPro/dev-unlock — it always reflects
      // real completion progress only, so it stays 1 here regardless.
      expect(getHighestUnlockedDay({ completedDays: [], checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] })).toBe(1)
    })

    it('leaves the real Pro + sequential gate untouched when the bypass is off', () => {
      vi.stubEnv('NEXT_PUBLIC_DEV_UNLOCK', 'false')
      expect(isCurriculumDayUnlocked(15, [], true)).toBe(false)
      expect(isCurriculumDayUnlocked(1, [], false)).toBe(false)
      expect(getHighestUnlockedDay({ completedDays: [], checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] })).toBe(1)
    })
  })
})

describe('recordCurriculumCheckpoint', () => {
  it('stores the checkpoint result and marks that day complete in one write', () => {
    const next = recordCurriculumCheckpoint({ day: 1, rawWpm: 220, trueWpm: 200, comprehensionAccuracyPercent: 100, completedAt: '2026-01-01T00:00:00.000Z' })
    expect(next.checkpoints[1]?.trueWpm).toBe(200)
    expect(next.completedDays).toEqual([1])
  })

  it('uses the checkpoint result’s own completedAt as the day’s completion timestamp', () => {
    const next = recordCurriculumCheckpoint({ day: 1, rawWpm: 220, trueWpm: 200, comprehensionAccuracyPercent: 100, completedAt: '2026-01-01T00:00:00.000Z' })
    expect(next.completedDayTimestamps[1]).toBe('2026-01-01T00:00:00.000Z')
  })
})

describe('computeComprehensionAveragePercent', () => {
  it('returns null with no checkpoints recorded', () => {
    expect(computeComprehensionAveragePercent({ completedDays: [], checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] })).toBeNull()
  })

  it('averages every recorded checkpoint', () => {
    const progress: CurriculumProgress = {
      completedDays: [1, 7],
      checkpoints: {
        1: { day: 1, rawWpm: 200, trueWpm: 200, comprehensionAccuracyPercent: 100, completedAt: 'x' },
        7: { day: 7, rawWpm: 240, trueWpm: 216, comprehensionAccuracyPercent: 50, completedAt: 'x' },
      },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    expect(computeComprehensionAveragePercent(progress)).toBe(75)
  })
})

describe('computeReadingGrowthPercent', () => {
  it('returns null with fewer than 2 checkpoints', () => {
    const progress: CurriculumProgress = {
      completedDays: [1],
      checkpoints: { 1: { day: 1, rawWpm: 200, trueWpm: 200, comprehensionAccuracyPercent: 100, completedAt: 'x' } },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    expect(computeReadingGrowthPercent(progress)).toBeNull()
  })

  it('computes real percent growth between the first and latest checkpoint', () => {
    const progress: CurriculumProgress = {
      completedDays: [1, 7],
      checkpoints: {
        1: { day: 1, rawWpm: 200, trueWpm: 200, comprehensionAccuracyPercent: 100, completedAt: 'x' },
        7: { day: 7, rawWpm: 260, trueWpm: 260, comprehensionAccuracyPercent: 100, completedAt: 'x' },
      },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    expect(computeReadingGrowthPercent(progress)).toBe(30)
  })

  it('clamps a regression to 0 rather than showing negative growth', () => {
    const progress: CurriculumProgress = {
      completedDays: [1, 7],
      checkpoints: {
        1: { day: 1, rawWpm: 200, trueWpm: 200, comprehensionAccuracyPercent: 100, completedAt: 'x' },
        7: { day: 7, rawWpm: 150, trueWpm: 150, comprehensionAccuracyPercent: 100, completedAt: 'x' },
      },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    expect(computeReadingGrowthPercent(progress)).toBe(0)
  })
})

describe('computeConsistencyPercent', () => {
  it('is a real fraction of 30 days, never fabricated', () => {
    expect(computeConsistencyPercent({ completedDays: [], checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] })).toBe(0)
    expect(
      computeConsistencyPercent({ completedDays: Array.from({ length: 15 }, (_, i) => i + 1), checkpoints: {}, completedDayTimestamps: {}, uploadStartedDays: [] }),
    ).toBe(50)
  })
})

describe('computeBrainDevelopmentScore', () => {
  it('returns null until at least 2 checkpoints exist (growth is not yet measurable)', () => {
    const progress: CurriculumProgress = {
      completedDays: [1],
      checkpoints: { 1: { day: 1, rawWpm: 200, trueWpm: 200, comprehensionAccuracyPercent: 100, completedAt: 'x' } },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    expect(computeBrainDevelopmentScore(progress)).toBeNull()
  })

  it('computes the documented 40/30/30 weighted composite once real data exists', () => {
    const progress: CurriculumProgress = {
      completedDays: Array.from({ length: 7 }, (_, i) => i + 1),
      checkpoints: {
        1: { day: 1, rawWpm: 200, trueWpm: 200, comprehensionAccuracyPercent: 100, completedAt: 'x' },
        7: { day: 7, rawWpm: 260, trueWpm: 260, comprehensionAccuracyPercent: 100, completedAt: 'x' },
      },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    // growth = 30, comprehensionAvg = 100, consistency = round(7/30*100) = 23
    // score = round(30*0.4 + 100*0.3 + 23*0.3) = round(12 + 30 + 6.9) = round(48.9) = 49
    const result = computeBrainDevelopmentScore(progress)
    expect(result?.readingGrowthPercent).toBe(30)
    expect(result?.comprehensionAveragePercent).toBe(100)
    expect(result?.consistencyPercent).toBe(23)
    expect(result?.score).toBe(49)
  })
})

describe('computeCheckpointDelta', () => {
  it('is null on Day 1 — it IS the baseline, no delta to show', () => {
    const progress: CurriculumProgress = {
      completedDays: [1],
      checkpoints: { 1: { day: 1, rawWpm: 200, trueWpm: 200, comprehensionAccuracyPercent: 80, completedAt: 'x' } },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    expect(computeCheckpointDelta(progress, 1)).toBeNull()
  })

  it('is null when the Day 1 baseline checkpoint is missing', () => {
    const progress: CurriculumProgress = {
      completedDays: [7],
      checkpoints: { 7: { day: 7, rawWpm: 260, trueWpm: 260, comprehensionAccuracyPercent: 90, completedAt: 'x' } },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    expect(computeCheckpointDelta(progress, 7)).toBeNull()
  })

  it('computes real, signed WPM growth and comprehension delta vs Day 1', () => {
    const progress: CurriculumProgress = {
      completedDays: [1, 7],
      checkpoints: {
        1: { day: 1, rawWpm: 200, trueWpm: 200, comprehensionAccuracyPercent: 80, completedAt: 'x' },
        7: { day: 7, rawWpm: 260, trueWpm: 260, comprehensionAccuracyPercent: 90, completedAt: 'x' },
      },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    const delta = computeCheckpointDelta(progress, 7)
    expect(delta?.wpmGrowthPercent).toBe(30)
    expect(delta?.comprehensionDeltaPercent).toBe(10)
  })

  it('shows a genuine negative delta honestly, never clamped to 0', () => {
    const progress: CurriculumProgress = {
      completedDays: [1, 14],
      checkpoints: {
        1: { day: 1, rawWpm: 200, trueWpm: 200, comprehensionAccuracyPercent: 90, completedAt: 'x' },
        14: { day: 14, rawWpm: 150, trueWpm: 150, comprehensionAccuracyPercent: 70, completedAt: 'x' },
      },
      completedDayTimestamps: {}, uploadStartedDays: [],
    }
    const delta = computeCheckpointDelta(progress, 14)
    expect(delta?.wpmGrowthPercent).toBe(-25)
    expect(delta?.comprehensionDeltaPercent).toBe(-20)
  })
})

describe('computeDailyCurriculumStreak', () => {
  const REFERENCE = '2026-08-22'

  function progressWithTimestamps(timestamps: Record<number, string>): CurriculumProgress {
    return { completedDays: Object.keys(timestamps).map(Number), checkpoints: {}, completedDayTimestamps: timestamps, uploadStartedDays: [] }
  }

  it('is 0 with no completions recorded', () => {
    expect(computeDailyCurriculumStreak(progressWithTimestamps({}), REFERENCE)).toBe(0)
  })

  it('counts an unbroken run of real calendar days ending today', () => {
    const progress = progressWithTimestamps({
      1: '2026-08-20T09:00:00.000Z',
      2: '2026-08-21T09:00:00.000Z',
      3: '2026-08-22T09:00:00.000Z',
    })
    expect(computeDailyCurriculumStreak(progress, REFERENCE)).toBe(3)
  })

  it('stays alive when today has no completion yet but yesterday does', () => {
    const progress = progressWithTimestamps({
      1: '2026-08-20T09:00:00.000Z',
      2: '2026-08-21T09:00:00.000Z',
    })
    expect(computeDailyCurriculumStreak(progress, REFERENCE)).toBe(2)
  })

  it('resets to 0 once a full day passes with nothing done', () => {
    const progress = progressWithTimestamps({
      1: '2026-08-18T09:00:00.000Z',
    })
    expect(computeDailyCurriculumStreak(progress, REFERENCE)).toBe(0)
  })

  it('counts multiple days completed on the same real calendar day as one streak day', () => {
    const progress = progressWithTimestamps({
      1: '2026-08-22T09:00:00.000Z',
      2: '2026-08-22T14:00:00.000Z',
    })
    expect(computeDailyCurriculumStreak(progress, REFERENCE)).toBe(1)
  })
})
