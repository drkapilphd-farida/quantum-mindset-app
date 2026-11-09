import { afterEach, describe, expect, it, vi } from 'vitest'
import { dayStepIds } from './paceControl'
import { currentDay, isDayFinished, isDayUnlocked, missingRequiredSteps } from './dayRules'
import { curriculumDayAccess, isCurriculumDayUnlocked } from './curriculumProgress'

// Founder rule (9 Nov 2026 hotfix): with access, Day N+1 opens the moment
// Day N is completed — nothing else (no batch, date, midnight, minimum time).

const upTo = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1)

describe('the one day rule', () => {
  afterEach(() => vi.useRealTimers())

  it('(a) a checkpoint (test) day completed by its reading test → the next day is open', () => {
    expect(isDayFinished({ day: 1, recorded: false, checkpointTest: true, stepsDone: [] })).toBe(true)
    expect(isDayUnlocked(2, [1], true)).toBe(true)
    expect(isCurriculumDayUnlocked(2, [1], true)).toBe(true)
    expect(currentDay([1])).toBe(2)
  })

  it('(b) a future batch start date or the calendar never matters — only progress', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z')) // long before any batch
    expect(isCurriculumDayUnlocked(1, [], true)).toBe(true)
    expect(isCurriculumDayUnlocked(2, [1], true)).toBe(true)
    // An old "opens at" time in the future is ignored.
    expect(isCurriculumDayUnlocked(2, [1], true, '2099-01-01T00:00:00Z')).toBe(true)
    expect(curriculumDayAccess(2, [1], true, '2099-01-01T00:00:00Z')).toBe('open')
  })

  it('(c) Day 21 complete → Day 22 open (Darshan)', () => {
    expect(isDayFinished({ day: 21, recorded: false, checkpointTest: true, stepsDone: [] })).toBe(true)
    expect(isCurriculumDayUnlocked(22, upTo(21), true)).toBe(true)
    expect(currentDay(upTo(21))).toBe(22)
  })

  it('(d) no access → new days locked (paywall as before); completed days stay open', () => {
    expect(isCurriculumDayUnlocked(1, [], false)).toBe(false)
    expect(curriculumDayAccess(1, [], false)).toBe('needs_enrolment')
    expect(isCurriculumDayUnlocked(4, [1, 2, 3], false)).toBe(false)
    expect(isCurriculumDayUnlocked(2, [1, 2, 3], false)).toBe(true)
  })

  it('a day not reached yet stays closed with access (finish the previous one first)', () => {
    expect(isCurriculumDayUnlocked(5, [1, 2], true)).toBe(false)
    expect(curriculumDayAccess(5, [1, 2], true)).toBe('finish_previous')
  })

  it('a normal day is finished by its required steps; the chapter upload is optional', () => {
    const day = upTo(30).find((d) => dayStepIds(d).includes('chapter-book') && ![1, 7, 14, 21, 30].includes(d))!
    const withoutUpload = dayStepIds(day).filter((id) => id !== 'chapter-book')
    expect(missingRequiredSteps(day, withoutUpload)).toEqual([])
    expect(isDayFinished({ day, recorded: false, checkpointTest: false, stepsDone: withoutUpload })).toBe(true)
    expect(isDayFinished({ day, recorded: false, checkpointTest: false, stepsDone: withoutUpload.slice(1) })).toBe(false)
    expect(isDayFinished({ day, recorded: false, checkpointTest: false, stepsDone: [] })).toBe(false)
  })

  it('a test day is not finished by steps alone — it needs its test', () => {
    expect(isDayFinished({ day: 7, recorded: false, checkpointTest: false, stepsDone: [...dayStepIds(7)] })).toBe(false)
  })
})
