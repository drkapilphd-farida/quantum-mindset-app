import { describe, expect, it } from 'vitest'
import {
  CURRICULUM_EXERCISE_CATALOG,
  CURRICULUM_EXERCISE_CATEGORIES,
  FLASH_INTELLIGENCE_POOL,
  READING_EXPANSION_POOL,
  getCurriculumExerciseById,
} from './curriculumExerciseCatalog'

describe('CURRICULUM_EXERCISE_CATALOG', () => {
  it('has no duplicate ids', () => {
    const ids = CURRICULUM_EXERCISE_CATALOG.map((exercise) => exercise.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every exercise has a valid category', () => {
    for (const exercise of CURRICULUM_EXERCISE_CATALOG) {
      expect(CURRICULUM_EXERCISE_CATEGORIES).toContain(exercise.category)
    }
  })

  it('every exercise has a non-empty title and a real /labs/sharp-brain href', () => {
    for (const exercise of CURRICULUM_EXERCISE_CATALOG) {
      expect(exercise.title.length).toBeGreaterThan(0)
      expect(exercise.href.startsWith('/labs/sharp-brain/')).toBe(true)
    }
  })

  it('does not include schulte-grid-drill (no standalone route exists for it)', () => {
    expect(getCurriculumExerciseById('schulte-grid-drill')).toBeUndefined()
  })

  it('includes schulte-grid-speed-drill as its routable replacement', () => {
    expect(getCurriculumExerciseById('schulte-grid-speed-drill')).toBeDefined()
  })
})

describe('getCurriculumExerciseById', () => {
  it('finds a known exercise', () => {
    expect(getCurriculumExerciseById('calm-breathing')?.title).toBe('Calm Breathing')
  })
  it('returns undefined for an unknown id', () => {
    expect(getCurriculumExerciseById('does-not-exist')).toBeUndefined()
  })
})

describe('gated module pools preserve their real, server-enforced internal order', () => {
  it('Reading Expansion Module order matches readingExpansionModule.ts', () => {
    expect(READING_EXPANSION_POOL.map((exercise) => exercise.id)).toEqual([
      'phrase-reading',
      'multi-line-reading',
      'sentence-reading',
      'paragraph-reading',
    ])
  })

  it('Flash Intelligence Pack order matches flashIntelligenceModule.ts', () => {
    expect(FLASH_INTELLIGENCE_POOL.map((exercise) => exercise.id)).toEqual([
      'word-flash',
      'number-flash',
      'symbol-flash',
      'mixed-flash',
      'peripheral-flash',
    ])
  })
})

describe('exercise rebuild, Phase 1', () => {
  const REMOVED = [
    'esp-zener-telepathy-sprint',
    'quantum-hidden-target-grid',
    'after-image-gazing',
    'tratak-afterimage-stretches',
    'cardinal-oculomotor-stretches',
    'infinity-figure-eight-gliding',
    'aura-edge-color-pulsing',
    'saccadic-eye-jump',
    'peripheral-expanding-circle',
    'brain-gym-circuit',
    'theta-breathing-anchor',
    'eye-warm-up',
    'eye-stretch',
    'eye-span',
    'regression-control',
    'reading-speed',
    'rsvp',
    'fluid-energy-balancer',
  ]

  it('no guessing game, eye-movement, staring or afterimage drill is in the programme', () => {
    for (const id of REMOVED) expect(getCurriculumExerciseById(id), id).toBeUndefined()
  })

  it('real guided breathing replaces the old balance game', () => {
    expect(getCurriculumExerciseById('calm-breathing')?.href).toBe('/labs/sharp-brain/calm-breathing')
  })
})
