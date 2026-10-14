import { describe, expect, it } from 'vitest'
import { CURRICULUM_EXERCISE_CATALOG } from './curriculumExerciseCatalog'
import {
  CHECKPOINT_DAYS,
  CURRICULUM_DAY_THEMES,
  CURRICULUM_PHASES,
  TOTAL_CURRICULUM_DAYS,
  buildCurriculumDayPlan,
  buildFullCurriculum,
  doneStepIds,
  getCurriculumDayTheme,
  getCurriculumPhase,
  getPhaseForDay,
  getPhaseJustCompleted,
  isCheckpointDay,
  PREVIOUS_MEMORY_STEP,
} from './curriculumDatabase'

function allExerciseIdsInPlan(day: number): string[] {
  const plan = buildCurriculumDayPlan(day)
  return [
    ...plan.exercises.brainGym.map((exercise) => exercise.id),
    ...plan.exercises.rightBrainIntuition.map((exercise) => exercise.id),
    ...plan.exercises.visualization.map((exercise) => exercise.id),
    ...plan.exercises.readingIntelligence.map((exercise) => exercise.id),
  ]
}

describe('CURRICULUM_PHASES', () => {
  it('covers days 1-30 with no gaps or overlaps', () => {
    const coveredDays = new Set<number>()
    for (const phase of CURRICULUM_PHASES) {
      for (let day = phase.dayRange[0]; day <= phase.dayRange[1]; day++) {
        expect(coveredDays.has(day)).toBe(false)
        coveredDays.add(day)
      }
    }
    expect(coveredDays.size).toBe(TOTAL_CURRICULUM_DAYS)
  })
})

describe('getPhaseForDay / getCurriculumPhase', () => {
  it('maps boundary days to the correct phase', () => {
    expect(getPhaseForDay(1)).toBe(1)
    expect(getPhaseForDay(7)).toBe(1)
    expect(getPhaseForDay(8)).toBe(2)
    expect(getPhaseForDay(14)).toBe(2)
    expect(getPhaseForDay(15)).toBe(3)
    expect(getPhaseForDay(21)).toBe(3)
    expect(getPhaseForDay(22)).toBe(4)
    expect(getPhaseForDay(30)).toBe(4)
  })
  it('throws for out-of-range days', () => {
    expect(() => getPhaseForDay(0)).toThrow()
    expect(() => getPhaseForDay(31)).toThrow()
  })
  it('getCurriculumPhase returns the matching phase descriptor', () => {
    expect(getCurriculumPhase(3).title).toContain('Memory Palace')
  })
})

describe('CURRICULUM_DAY_THEMES', () => {
  it('has exactly 30 entries, days 1-30 in order with no gaps', () => {
    expect(CURRICULUM_DAY_THEMES.map((theme) => theme.day)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
  })
  it('every theme has a non-empty title and focus', () => {
    for (const theme of CURRICULUM_DAY_THEMES) {
      expect(theme.title.length).toBeGreaterThan(0)
      expect(theme.focus.length).toBeGreaterThan(0)
    }
  })
  it('getCurriculumDayTheme finds the right entry', () => {
    expect(getCurriculumDayTheme(1).title).toContain('Baseline')
    expect(getCurriculumDayTheme(30).title).toContain('Final Certification')
  })
})

describe('CHECKPOINT_DAYS / isCheckpointDay', () => {
  it('matches the documented checkpoint days', () => {
    expect(CHECKPOINT_DAYS).toEqual([1, 7, 14, 21, 30])
  })
  it('flags checkpoint and non-checkpoint days correctly', () => {
    expect(isCheckpointDay(1)).toBe(true)
    expect(isCheckpointDay(21)).toBe(true)
    expect(isCheckpointDay(2)).toBe(false)
  })
})

describe('getPhaseJustCompleted', () => {
  it('returns the phase whose last day this is, for Days 7/14/21', () => {
    expect(getPhaseJustCompleted(7)).toBe(1)
    expect(getPhaseJustCompleted(14)).toBe(2)
    expect(getPhaseJustCompleted(21)).toBe(3)
  })

  it('returns null for Day 30 — no Phase 5 to transition into', () => {
    expect(getPhaseJustCompleted(30)).toBeNull()
  })

  it('returns null for every non-phase-boundary day', () => {
    expect(getPhaseJustCompleted(1)).toBeNull()
    expect(getPhaseJustCompleted(6)).toBeNull()
    expect(getPhaseJustCompleted(15)).toBeNull()
  })
})

describe('buildCurriculumDayPlan', () => {
  it('throws for out-of-range days', () => {
    expect(() => buildCurriculumDayPlan(0)).toThrow()
    expect(() => buildCurriculumDayPlan(31)).toThrow()
    expect(() => buildCurriculumDayPlan(1.5)).toThrow()
  })

  it('only day 1 requires the mandatory baseline assessment', () => {
    expect(buildCurriculumDayPlan(1).requiresBaseline).toBe(true)
    for (let day = 2; day <= 30; day++) {
      expect(buildCurriculumDayPlan(day).requiresBaseline).toBe(false)
    }
  })

  it('every day plans at least one exercise from each of the 4 categories', () => {
    for (let day = 1; day <= TOTAL_CURRICULUM_DAYS; day++) {
      const plan = buildCurriculumDayPlan(day)
      expect(plan.exercises.brainGym.length).toBeGreaterThan(0)
      expect(plan.exercises.rightBrainIntuition.length).toBeGreaterThan(0)
      expect(plan.exercises.visualization.length).toBeGreaterThan(0)
      expect(plan.exercises.readingIntelligence.length).toBeGreaterThan(0)
    }
  })

  it('is deterministic — building the same day twice yields the same plan', () => {
    expect(buildCurriculumDayPlan(15)).toEqual(buildCurriculumDayPlan(15))
  })

  it('Phase 3 (days 15-21) includes Memory Palace and Calm Breathing in its visualization rotation', () => {
    const phase3VisualizationIds = new Set<string>()
    for (let day = 15; day <= 21; day++) {
      for (const exercise of buildCurriculumDayPlan(day).exercises.visualization) {
        phase3VisualizationIds.add(exercise.id)
      }
    }
    expect(phase3VisualizationIds.has('memory-palace')).toBe(true)
    expect(phase3VisualizationIds.has('calm-breathing')).toBe(true)
  })

  // Group A (13 Oct 2026) replaced these visual-memory drills as the memory step of Days 11–30.
  // They stay in the labs for free practice, just not in the plan.
  const RETIRED_FROM_PLAN = ['pictorial-essence-sprint', 'hemispheric-color-sync', 'word-flash-grid', 'dot-memory-grid', 'number-flash-grid', 'image-flash-grid']

  it('covers every catalog exercise at least once across all 30 days, except the drills Group A retired from the plan', () => {
    const touchedIds = new Set<string>()
    for (let day = 1; day <= TOTAL_CURRICULUM_DAYS; day++) {
      for (const id of allExerciseIdsInPlan(day)) {
        touchedIds.add(id)
      }
    }
    for (const { id } of CURRICULUM_EXERCISE_CATALOG) expect(touchedIds.has(id), id).toBe(!RETIRED_FROM_PLAN.includes(id))
  })

  it('never schedules the same exercise twice on one day', () => {
    for (let day = 1; day <= TOTAL_CURRICULUM_DAYS; day++) {
      const ids = allExerciseIdsInPlan(day)
      expect(new Set(ids).size, `day ${day}`).toBe(ids.length)
    }
  })

  it('Group A: Days 11–30 use the new memory methods, easy to hard, with Chapter & Book by Day 22 — replacing, so every day keeps 4 steps', () => {
    const memory = (day: number): string => buildCurriculumDayPlan(day).exercises.rightBrainIntuition[0]!.id
    const NEW = ['names-and-faces', 'number-pictures', 'keyword-method', 'my-palaces', 'chapter-book', 'acronyms']
    for (let day = 11; day <= 30; day++) {
      expect(NEW, `day ${day}`).toContain(memory(day))
      expect(buildCurriculumDayPlan(day).exercises.rightBrainIntuition).toHaveLength(1)
    }
    for (const id of NEW) expect(Array.from({ length: 20 }, (_, i) => memory(11 + i))).toContain(id)
    const firstChapter = Array.from({ length: 20 }, (_, i) => 11 + i).find((d) => memory(d) === 'chapter-book')!
    expect(firstChapter).toBeLessThanOrEqual(22)
    // Each method's first day comes before its later days; palaces are built before Chapter & Book uses them.
    expect(Array.from({ length: 20 }, (_, i) => 11 + i).find((d) => memory(d) === 'my-palaces')!).toBeLessThan(firstChapter)
  })

  it('a learner part-way through a day who already did the old memory step keeps it as done', () => {
    expect(PREVIOUS_MEMORY_STEP[12]).toBe('pictorial-essence-sprint')
    expect(doneStepIds(12, ['pictorial-essence-sprint']).has('names-and-faces')).toBe(true)
    expect(doneStepIds(12, []).has('names-and-faces')).toBe(false)
    expect(doneStepIds(5, ['story-method']).has('story-method')).toBe(true)
  })

  it('Release 2: the memory step of Days 2–6 is the Story method and of Days 7–10 the Peg method — replacing it, so every day keeps 4 steps', () => {
    for (let day = 2; day <= 10; day++) {
      const plan = buildCurriculumDayPlan(day)
      expect(plan.exercises.rightBrainIntuition.map((e) => e.id)).toEqual([day <= 6 ? 'story-method' : 'peg-method'])
      expect(plan.exercises.brainGym).toHaveLength(1)
      expect(plan.exercises.visualization).toHaveLength(1)
      expect(plan.exercises.readingIntelligence).toHaveLength(1)
    }
    for (const day of [1, 11, 20, 30]) expect(buildCurriculumDayPlan(day).exercises.rightBrainIntuition[0]?.id).not.toMatch(/story|peg-method/)
  })

  it('no day mentions eye training, energies, holograms or intuition in its theme', () => {
    for (const theme of CURRICULUM_DAY_THEMES) expect(`${theme.title} ${theme.focus}`).not.toMatch(/ocular|eye|energy|hologram|intuiti|RSVP/i)
  })

  it('Reading Expansion Module exercises appear on days 22-25 in their exact real prerequisite order', () => {
    const expectedOrder = ['phrase-reading', 'multi-line-reading', 'sentence-reading', 'paragraph-reading']
    for (let i = 0; i < expectedOrder.length; i++) {
      const day = 22 + i
      expect(buildCurriculumDayPlan(day).exercises.readingIntelligence.map((exercise) => exercise.id)).toContain(expectedOrder[i])
    }
  })

  it('Flash Reading Pack exercises appear on days 26-30 in their exact real prerequisite order', () => {
    const expectedOrder = ['word-flash', 'number-flash', 'symbol-flash', 'mixed-flash', 'peripheral-flash']
    for (let i = 0; i < expectedOrder.length; i++) {
      const day = 26 + i
      expect(buildCurriculumDayPlan(day).exercises.readingIntelligence.map((exercise) => exercise.id)).toContain(expectedOrder[i])
    }
  })

  it('progressive-chunk-reading appears on the final day', () => {
    expect(buildCurriculumDayPlan(30).exercises.readingIntelligence.map((exercise) => exercise.id)).toContain('progressive-chunk-reading')
  })
})

describe('buildFullCurriculum', () => {
  it('returns all 30 days in order', () => {
    const fullCurriculum = buildFullCurriculum()
    expect(fullCurriculum).toHaveLength(30)
    expect(fullCurriculum.map((plan) => plan.day)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
  })

  it('Memory Palace replaced Sensory Imagery Builder on exactly Days 3, 7, 11, 15, 19, 23 and 27', () => {
    const days: number[] = []
    for (let day = 1; day <= 30; day++) {
      const ids = Object.values(buildCurriculumDayPlan(day).exercises).flat().map((e) => e.id)
      expect(ids, `day ${day}`).not.toContain('sensory-hologram-builder')
      if (ids.includes('memory-palace')) days.push(day)
    }
    expect(days).toEqual([3, 7, 11, 15, 19, 23, 27])
  })
})
