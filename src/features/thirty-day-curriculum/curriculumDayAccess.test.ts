import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/dev/isDevUnlockEnabled', () => ({ isDevUnlockEnabled: () => false }))
const { curriculumDayAccess } = await import('./curriculumProgress')

describe('curriculumDayAccess — the enroll popup only for learners who have not paid', () => {
  it('always opens a completed day, paid or not', () => {
    expect(curriculumDayAccess(6, [1, 6], false)).toBe('open')
    expect(curriculumDayAccess(6, [1, 6], true)).toBe('open')
  })

  it('offers enrolment for every day, Day 1 included, to a learner without the program', () => {
    expect(curriculumDayAccess(1, [], false)).toBe('needs_enrolment')
    expect(curriculumDayAccess(2, [1], false)).toBe('needs_enrolment')
    expect(curriculumDayAccess(25, [1, 2, 3], false)).toBe('needs_enrolment')
  })

  it('never offers enrolment to a paying learner — only “finish the previous day”', () => {
    // A paying learner with days 1 and 15–21 done (the owner account's real state).
    const done = [1, 15, 16, 17, 18, 19, 20, 21]
    expect(curriculumDayAccess(2, done, true)).toBe('open') // day 1 done
    expect(curriculumDayAccess(3, done, true)).toBe('finish_previous')
    expect(curriculumDayAccess(16, done, true)).toBe('open')
    expect(curriculumDayAccess(22, done, true)).toBe('open') // day 21 done
    expect(curriculumDayAccess(23, done, true)).toBe('finish_previous')
  })
})
