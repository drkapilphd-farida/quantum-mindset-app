import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getCurriculumSmartCompleteHref,
  getCurriculumSmartExitHref,
  getWizardAwareBackHref,
  isCurriculumSessionCurrentExercise,
  setActiveWizardDay,
} from './curriculumReturnRouting'
import { startCurriculumSession, loadActiveCurriculumSession, type ActiveCurriculumSession } from './curriculumSessionRunner'
import { loadCurriculumProgress } from './curriculumProgress'
import { completeCurriculumDay } from './actions/completeCurriculumDay'
import { recordCurriculumDayPractice } from './actions/curriculumDayPractice'

vi.mock('./actions/completeCurriculumDay', () => ({ completeCurriculumDay: vi.fn(() => Promise.resolve({ ok: true, completedDays: [] })) }))
vi.mock('./actions/curriculumDayPractice', () => ({ recordCurriculumDayPractice: vi.fn(() => Promise.resolve({ ok: true })) }))

let sessionStore: Record<string, string>
let localStore: Record<string, string>

function createMemoryStorage(store: Record<string, string>): Storage {
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      for (const key of Object.keys(store)) delete store[key]
    },
    key: () => null,
    length: 0,
  } as Storage
}

beforeEach(() => {
  sessionStore = {}
  localStore = {}
  vi.stubGlobal('window', {})
  vi.stubGlobal('sessionStorage', createMemoryStorage(sessionStore))
  vi.stubGlobal('localStorage', createMemoryStorage(localStore))
})

afterEach(() => {
  vi.unstubAllGlobals()
  setActiveWizardDay(null)
})

function firstExerciseIdForDay(day: number): string {
  const session = startCurriculumSession(day)
  return session.exerciseIds[0]!
}

describe('isCurriculumSessionCurrentExercise', () => {
  it('is false with no active session', () => {
    expect(isCurriculumSessionCurrentExercise('eye-warm-up')).toBe(false)
  })

  it('is true only for the exact current step', () => {
    const firstId = firstExerciseIdForDay(1)
    expect(isCurriculumSessionCurrentExercise(firstId)).toBe(true)
    expect(isCurriculumSessionCurrentExercise('not-the-current-exercise')).toBe(false)
  })
})

describe('getCurriculumSmartExitHref', () => {
  it('falls back to the given href when there is no matching active session', () => {
    expect(getCurriculumSmartExitHref('eye-warm-up', '/labs/sharp-brain')).toBe('/labs/sharp-brain')
  })

  it('returns the day view (not the fallback) and clears the session for a matching exercise', () => {
    const firstId = firstExerciseIdForDay(7)
    const href = getCurriculumSmartExitHref(firstId, '/labs/sharp-brain')
    expect(href).toBe('/labs/sharp-brain/thirty-day-curriculum?view=day&day=7')
    expect(loadActiveCurriculumSession()).toBeNull()
  })

  it('does not mark the day complete on an early exit', () => {
    const firstId = firstExerciseIdForDay(2)
    getCurriculumSmartExitHref(firstId, '/labs/sharp-brain')
    expect(loadCurriculumProgress().completedDays).toEqual([])
  })
})

describe('getCurriculumSmartCompleteHref', () => {
  it('falls back to the given href when there is no matching active session', () => {
    expect(getCurriculumSmartCompleteHref('eye-warm-up', '/labs/sharp-brain')).toBe('/labs/sharp-brain')
  })

  it('on a non-final step, advances the session pointer but ALWAYS returns to the day view — never chains straight to the next exercise page', () => {
    const firstId = firstExerciseIdForDay(1)
    const href = getCurriculumSmartCompleteHref(firstId, '/labs/sharp-brain')
    const session = loadActiveCurriculumSession() as ActiveCurriculumSession
    expect(session.currentIndex).toBe(1)
    expect(href).toBe('/labs/sharp-brain/thirty-day-curriculum?view=day&day=1')
  })

  it('on the final exercise of a non-checkpoint day, marks the day complete, clears the session, and returns the day view with dayComplete=1', () => {
    // Day 2 is not a checkpoint day (CHECKPOINT_DAYS = [1,7,14,21,30]).
    let session = startCurriculumSession(2)
    while (session.currentIndex < session.exerciseIds.length - 1) {
      const currentId = session.exerciseIds[session.currentIndex]!
      getCurriculumSmartCompleteHref(currentId, '/labs/sharp-brain')
      session = loadActiveCurriculumSession() as ActiveCurriculumSession
    }
    const finalId = session.exerciseIds[session.currentIndex]!
    const href = getCurriculumSmartCompleteHref(finalId, '/labs/sharp-brain')
    expect(href).toBe('/labs/sharp-brain/thirty-day-curriculum?view=day&day=2&dayComplete=1')
    expect(loadActiveCurriculumSession()).toBeNull()
    expect(loadCurriculumProgress().completedDays).toEqual([2])
  })

  it('on the final exercise of a CHECKPOINT day, does NOT mark the day complete — the assessment is still required', () => {
    // Day 1 is a checkpoint day.
    let session = startCurriculumSession(1)
    while (session.currentIndex < session.exerciseIds.length - 1) {
      const currentId = session.exerciseIds[session.currentIndex]!
      getCurriculumSmartCompleteHref(currentId, '/labs/sharp-brain')
      session = loadActiveCurriculumSession() as ActiveCurriculumSession
    }
    const finalId = session.exerciseIds[session.currentIndex]!
    const href = getCurriculumSmartCompleteHref(finalId, '/labs/sharp-brain')
    expect(href).toBe('/labs/sharp-brain/thirty-day-curriculum?view=day&day=1')
    expect(loadActiveCurriculumSession()).toBeNull()
    expect(loadCurriculumProgress().completedDays).toEqual([])
  })
})

describe('setActiveWizardDay', () => {
  it('makes getCurriculumSmartExitHref return the day view for ANY exercise id, with no session needed', () => {
    setActiveWizardDay(12)
    expect(getCurriculumSmartExitHref('literally-anything', '/labs/sharp-brain')).toBe(
      '/labs/sharp-brain/thirty-day-curriculum?view=day&day=12',
    )
  })

  it('takes priority even when a real session exists for a different day', () => {
    startCurriculumSession(3)
    setActiveWizardDay(12)
    expect(getCurriculumSmartExitHref('unrelated-id', '/labs/sharp-brain')).toBe(
      '/labs/sharp-brain/thirty-day-curriculum?view=day&day=12',
    )
  })

  it('stops applying once cleared back to null', () => {
    setActiveWizardDay(12)
    setActiveWizardDay(null)
    expect(getCurriculumSmartExitHref('some-id', '/labs/sharp-brain')).toBe('/labs/sharp-brain')
  })
})

describe('getWizardAwareBackHref', () => {
  it('falls back to the given href with no active wizard day or session', () => {
    expect(getWizardAwareBackHref('any-id', '/labs/sharp-brain')).toBe('/labs/sharp-brain')
  })

  it('returns the day view when a wizard is active, for ANY exercise id, without mutating anything', () => {
    setActiveWizardDay(9)
    const href1 = getWizardAwareBackHref('id-a', '/labs/sharp-brain')
    const href2 = getWizardAwareBackHref('id-b', '/labs/sharp-brain')
    expect(href1).toBe('/labs/sharp-brain/thirty-day-curriculum?view=day&day=9')
    expect(href2).toBe(href1)
    // Calling it repeatedly must not have cleared or advanced anything.
    expect(getWizardAwareBackHref('id-a', '/labs/sharp-brain')).toBe(href1)
  })

  it('returns the day view when a real session matches this exact exercise, without clearing it', () => {
    const firstId = firstExerciseIdForDay(6)
    const href = getWizardAwareBackHref(firstId, '/labs/sharp-brain')
    expect(href).toBe('/labs/sharp-brain/thirty-day-curriculum?view=day&day=6')
    // Still there — this is a passive preview, not a real exit.
    expect(loadActiveCurriculumSession()).not.toBeNull()
  })

  it('falls back to the given href when a real session exists but points at a different exercise', () => {
    firstExerciseIdForDay(6)
    expect(getWizardAwareBackHref('not-the-current-one', '/labs/sharp-brain')).toBe('/labs/sharp-brain')
  })
})

describe('practising a completed day again (replay)', () => {
  function startReplayOnFinalStep(day: number): string {
    startCurriculumSession(day)
    const session = loadActiveCurriculumSession()!
    const lastIndex = session.exerciseIds.length - 1
    const replay: ActiveCurriculumSession = { ...session, currentIndex: lastIndex, replay: true }
    sessionStorage.setItem('qsr-active-curriculum-session', JSON.stringify(replay))
    return session.exerciseIds[lastIndex]!
  }

  beforeEach(() => {
    vi.mocked(completeCurriculumDay).mockClear()
    vi.mocked(recordCurriculumDayPractice).mockClear()
  })

  it('a replayed normal day saves practice and never re-completes the day', () => {
    const lastId = startReplayOnFinalStep(4)
    const href = getCurriculumSmartCompleteHref(lastId, '/labs/sharp-brain')

    expect(href).toBe('/labs/sharp-brain/thirty-day-curriculum?view=day&day=4&practised=1')
    expect(recordCurriculumDayPractice).toHaveBeenCalledWith({ day: 4 })
    expect(completeCurriculumDay).not.toHaveBeenCalled()
    expect(loadCurriculumProgress().completedDays).not.toContain(4)
  })

  it('a replayed checkpoint day goes to a practice-only check, not the official one', () => {
    const lastId = startReplayOnFinalStep(7)
    const href = getCurriculumSmartCompleteHref(lastId, '/labs/sharp-brain')

    expect(href).toBe('/labs/sharp-brain/thirty-day-curriculum?view=day&day=7&practiceCheckpoint=1')
    expect(completeCurriculumDay).not.toHaveBeenCalled()
    expect(recordCurriculumDayPractice).not.toHaveBeenCalled()
  })

  it('mid-replay steps keep the replay flag on the way back', () => {
    startCurriculumSession(4)
    const session = loadActiveCurriculumSession()!
    sessionStorage.setItem('qsr-active-curriculum-session', JSON.stringify({ ...session, replay: true }))
    const href = getCurriculumSmartCompleteHref(session.exerciseIds[0]!, '/labs/sharp-brain')

    expect(href).toBe('/labs/sharp-brain/thirty-day-curriculum?view=day&day=4&replay=1')
    expect(completeCurriculumDay).not.toHaveBeenCalled()
  })
})
