import { describe, expect, it } from 'vitest'
import { beatCredit, dayOpensAt, dayStepIds, doLater, formatPracticeTime, missingSteps, nextIstMidnight } from './paceControl'

describe('no midnight wait (founder rule, 9 Nov 2026)', () => {
  it('opens at the next midnight in India, whatever the UTC date', () => {
    expect(nextIstMidnight('2026-10-15T15:12:00Z')).toBe('2026-10-15T18:30:00.000Z') // 8:42 pm IST → 00:00 IST 16 Oct
    expect(nextIstMidnight('2026-10-15T19:00:00Z')).toBe('2026-10-16T18:30:00.000Z') // 00:30 IST 16 Oct → 00:00 IST 17 Oct
  })
  it('the next day is open as soon as a day is completed, paced or not', () => {
    expect(dayOpensAt({ completedAt: '2026-10-15T15:12:00Z', paced: true }, false)).toBeNull()
    expect(dayOpensAt({ completedAt: '2026-10-15T15:12:00Z', paced: false }, false)).toBeNull()
    expect(dayOpensAt({ completedAt: '2026-10-15T15:12:00Z', paced: true }, true)).toBeNull()
    expect(dayOpensAt(null, false)).toBeNull()
  })
})

describe('practice time', () => {
  const now = Date.parse('2026-10-16T13:00:00Z')
  it('a heartbeat credits the real gap, at most 45 s, and nothing after a long pause', () => {
    expect(beatCredit(new Date(now - 30_000).toISOString(), now)).toBe(30)
    expect(beatCredit(new Date(now - 90_000).toISOString(), now)).toBe(45)
    expect(beatCredit(new Date(now - 10 * 60_000).toISOString(), now)).toBe(0)
    expect(beatCredit(null, now)).toBe(0)
    expect(beatCredit(new Date(now + 5000).toISOString(), now)).toBe(0)
  })
  it('formats the timer', () => {
    expect(formatPracticeTime(372)).toBe('6:12')
    expect(formatPracticeTime(604)).toBe('10:04')
  })
})

describe('day steps', () => {
  const steps = [...dayStepIds(5)]
  it('every day has its steps; missing steps keep play order', () => {
    for (let d = 1; d <= 30; d++) expect(dayStepIds(d).length).toBeGreaterThanOrEqual(4)
    expect(missingSteps(5, [steps[1]!])).toEqual(steps.filter((s) => s !== steps[1]))
  })
})

describe('"Do this later"', () => {
  it('moves the current step to the end; a last step stays', () => {
    expect(doLater(['a', 'b', 'c'])).toEqual(['b', 'c', 'a'])
    expect(doLater(['a'])).toEqual(['a'])
  })
})
