import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/subscription/getIsPaidUser', () => ({ getIsPaidUser: vi.fn() }))
vi.mock('./actions/getCurriculumDayCompletions', () => ({ getCurriculumDayCompletions: vi.fn() }))

const { exerciseOpenInPlan, planDaysWithStep } = await import('./planExerciseAccess')
const upTo = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1)

// Founder rule (9 Nov 2026): inside the plan, the plan's order is the only order.
describe('exercise pages inside the 30-day plan', () => {
  it('knows which day each Day 22–30 exercise belongs to', () => {
    expect(planDaysWithStep('phrase-reading')).toEqual([22])
    expect(planDaysWithStep('multi-line-reading')).toEqual([23])
    expect(planDaysWithStep('number-flash')).toEqual([27])
    expect(planDaysWithStep('progressive-chunk-reading')).toEqual([30])
    expect(planDaysWithStep('fixation-reduction')).toEqual([])
  })

  it('Darshan: Day 22 finished → Multi-Line Reading opens without Phrase Reading being "complete"', () => {
    expect(exerciseOpenInPlan('multi-line-reading', upTo(22), true)).toBe(true)
  })

  it('Days 23–30 open as each previous day is finished', () => {
    const steps: Record<number, string> = { 24: 'sentence-reading', 25: 'paragraph-reading', 26: 'word-flash', 27: 'number-flash', 28: 'symbol-flash', 29: 'mixed-flash', 30: 'peripheral-flash' }
    for (const [day, id] of Object.entries(steps)) {
      expect(exerciseOpenInPlan(id, upTo(Number(day) - 1), true)).toBe(true)
      expect(exerciseOpenInPlan(id, upTo(Number(day) - 2), true)).toBe(false)
    }
  })

  it('never opens a day not earned, and needs access for a new day', () => {
    expect(exerciseOpenInPlan('multi-line-reading', upTo(21), true)).toBe(false)
    expect(exerciseOpenInPlan('multi-line-reading', upTo(22), false)).toBe(false)
    // A day already completed stays open (practice again).
    expect(exerciseOpenInPlan('multi-line-reading', upTo(23), false)).toBe(true)
  })
})
