import { describe, expect, it } from 'vitest'
import { beatCredit, dayOpensAt, dayStepIds, doLater, formatPracticeTime, missingSteps, nextIstMidnight, paceVerdict, PACE_REQUIRED_SECONDS } from './paceControl'

const ist = (local: string): number => Date.parse(`${local}+05:30`)

describe('one new day per calendar day (midnight IST)', () => {
  it('opens at the next midnight in India, whatever the UTC date', () => {
    expect(nextIstMidnight('2026-10-15T15:12:00Z')).toBe('2026-10-15T18:30:00.000Z') // 8:42 pm IST → 00:00 IST 16 Oct
    expect(nextIstMidnight('2026-10-15T19:00:00Z')).toBe('2026-10-16T18:30:00.000Z') // 00:30 IST 16 Oct → 00:00 IST 17 Oct
  })
  it('only a completion made under pace control waits; everything before launch stays open', () => {
    expect(dayOpensAt({ completedAt: '2026-10-15T15:12:00Z', paced: true }, false)).toBe('2026-10-15T18:30:00.000Z')
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

describe('completing a day', () => {
  const steps = [...dayStepIds(5)]
  const base = { day: 5, paceOff: false, prev: { completedAt: '2026-10-15T15:12:00Z', paced: true }, activeSeconds: PACE_REQUIRED_SECONDS, stepsDone: steps, nowMs: ist('2026-10-16T19:00:00') }
  it('needs the day to be open, all steps, then about 10 minutes', () => {
    expect(paceVerdict(base)).toEqual({ ok: true })
    expect(paceVerdict({ ...base, nowMs: ist('2026-10-15T23:59:00') })).toMatchObject({ ok: false, reason: 'not_yet_open' })
    expect(paceVerdict({ ...base, stepsDone: steps.slice(1) })).toMatchObject({ ok: false, reason: 'steps_incomplete', missing: [steps[0]] })
    expect(paceVerdict({ ...base, activeSeconds: 372 })).toEqual({ ok: false, reason: 'needs_more_practice', activeSeconds: 372 })
  })
  it('missed days: the next day is simply open later; pace off skips every check', () => {
    expect(paceVerdict({ ...base, nowMs: ist('2026-10-19T18:30:00') })).toEqual({ ok: true })
    expect(paceVerdict({ ...base, paceOff: true, activeSeconds: 0, stepsDone: [] })).toEqual({ ok: true })
  })
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
