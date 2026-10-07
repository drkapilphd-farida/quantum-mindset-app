import { describe, expect, it } from 'vitest'
import { getStep1AndStep2, getWeekTheme, isMandatoryBreathingDay, TOTAL_JOURNEY_DAYS } from './quantumJourneyLevels'

// What actually plays on a day: on compulsory-breathing days the breathing
// warm-up takes Step 1's place.
function played(day: number): string[] {
  const { step1, step2 } = getStep1AndStep2(day)
  return [isMandatoryBreathingDay(day) ? 'breathing-warm-up' : step1.exerciseId, step2.exerciseId]
}

describe('21-day journey steps', () => {
  it('never plays breathing twice in a row', () => {
    for (let day = 1; day <= TOTAL_JOURNEY_DAYS; day++) {
      const [first, second] = played(day)
      const breathing = (id: string | undefined): boolean => id === 'breathing-warm-up' || id === 'calm-breathing'
      expect(breathing(first) && breathing(second), `day ${day}: ${played(day).join(' → ')}`).toBe(false)
    }
  })

  it('day 4 swaps Calm Breathing for the easy Color-Word grid', () => {
    expect(played(4)).toEqual(['breathing-warm-up', 'hemispheric-color-sync'])
  })

  it('no eye drills, Brain Gym circuit or Zener anywhere in the journey', () => {
    for (let day = 1; day <= TOTAL_JOURNEY_DAYS; day++) {
      const { step1, step2 } = getStep1AndStep2(day)
      for (const id of [step1.exerciseId, step2.exerciseId]) expect(['eye-warm-up', 'brain-gym-circuit', 'esp-zener-telepathy']).not.toContain(id)
    }
    expect(getWeekTheme(1)).not.toMatch(/brain gym/i)
  })

  it('step 1 and step 2 differ every day', () => {
    for (let day = 1; day <= TOTAL_JOURNEY_DAYS; day++) {
      const { step1, step2 } = getStep1AndStep2(day)
      expect(step1.exerciseId).not.toBe(step2.exerciseId)
    }
  })
})
