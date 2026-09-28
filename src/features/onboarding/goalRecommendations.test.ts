import { describe, expect, it } from 'vitest'
import { LEARNING_FOCUSES } from './onboardingOptions'
import { getGoalRecommendations, programFirstFor } from './goalRecommendations'
import { safeNextPath } from './safeNextPath'

describe('getGoalRecommendations', () => {
  it.each(LEARNING_FOCUSES)('returns four real catalog exercises for "%s"', (focus) => {
    const exercises = getGoalRecommendations(focus)
    expect(exercises).toHaveLength(4)
    for (const exercise of exercises) expect(exercise.href.startsWith('/labs/sharp-brain/')).toBe(true)
  })

  it('puts Smart Reading and Memory exercises first for exam preparation', () => {
    const ids = getGoalRecommendations('exam').map((e) => e.id)
    expect(ids).toEqual(expect.arrayContaining(['sentence-reading', 'dot-memory-grid']))
  })

  it('moves the 30-day program up for exam, memory and reading goals only', () => {
    expect(programFirstFor('exam')).toBe(true)
    expect(programFirstFor('memory')).toBe(true)
    expect(programFirstFor('reading')).toBe(true)
    expect(programFirstFor('focus')).toBe(false)
    expect(programFirstFor(null)).toBe(false)
  })
})

describe('safeNextPath', () => {
  it('allows same-site paths only', () => {
    expect(safeNextPath('/dashboard?view=parent')).toBe('/dashboard?view=parent')
    expect(safeNextPath('https://evil.example')).toBe('/dashboard')
    expect(safeNextPath('//evil.example')).toBe('/dashboard')
    expect(safeNextPath('/\\evil.example')).toBe('/dashboard')
    expect(safeNextPath(undefined)).toBe('/dashboard')
  })
})
