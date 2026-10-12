import { beforeAll, describe, expect, it } from 'vitest'
import { ALL_MEMORY_WORDS, MEMORY_FACES, MEMORY_WORDS } from './content'
import {
  currentDay,
  memoryBeforeAfter,
  memoryCheckStatus,
  memoryScore,
  newNumber,
  scoreDigits,
  scoreFaces,
  scoreWords,
  shuffle,
  type MemoryCheckResult,
} from './memoryCheck'
import { signMemoryToken, verifyMemoryToken } from './memoryToken'

const result = (over: Partial<MemoryCheckResult>): MemoryCheckResult => ({
  phase: 'baseline',
  form: 'A',
  lang: 'en',
  day: 1,
  score: 50,
  words: 10,
  wordsFound: 12,
  wrongTaps: 2,
  digits: 5,
  faces: 2,
  takenAt: '2026-10-15T05:00:00Z',
  ...over,
})

describe('material', () => {
  it('each form: 20 words + 20 unseen, 4 of each kind, never shared between forms', () => {
    for (const form of ['A', 'B'] as const) {
      expect(MEMORY_WORDS[form].targets).toHaveLength(20)
      expect(MEMORY_WORDS[form].unseen).toHaveLength(20)
    }
    const ids = ALL_MEMORY_WORDS.map((w) => w.id)
    expect(new Set(ids).size).toBe(80)
  })
  it('every word has distinct English and Hindi text, so no two buttons look the same', () => {
    expect(new Set(ALL_MEMORY_WORDS.map((w) => w.en)).size).toBe(80)
    expect(new Set(ALL_MEMORY_WORDS.map((w) => w.hi)).size).toBe(80)
    for (const w of ALL_MEMORY_WORDS) expect(w.hi).toMatch(/[ऀ-ॿ]/)
  })
  it('5 faces per form, all names different', () => {
    const faces = [...MEMORY_FACES.A, ...MEMORY_FACES.B]
    expect(MEMORY_FACES.A).toHaveLength(5)
    expect(MEMORY_FACES.B).toHaveLength(5)
    expect(new Set(faces.map((f) => f.name.en)).size).toBe(10)
    expect(new Set(faces.map((f) => f.name.hi)).size).toBe(10)
  })
  it('both forms have the same mix of people (a child, an older person, two with glasses)', () => {
    for (const form of ['A', 'B'] as const) {
      const f = MEMORY_FACES[form].map((x) => x.face)
      expect(f.filter((x) => x.age === 'child')).toHaveLength(1)
      expect(f.filter((x) => x.age === 'older')).toHaveLength(1)
      expect(f.filter((x) => x.glasses !== 'none')).toHaveLength(2)
    }
  })
})

describe('scoring', () => {
  const targets = MEMORY_WORDS.A.targets.map((w) => w.id)
  const unseen = MEMORY_WORDS.A.unseen.map((w) => w.id)
  it('words = found − wrong taps, never below 0; repeats and unknown ids are ignored', () => {
    expect(scoreWords('A', targets)).toEqual({ words: 20, wordsFound: 20, wrongTaps: 0 })
    expect(scoreWords('A', [...targets.slice(0, 12), ...unseen.slice(0, 3), targets[0]!, 'not-a-word'])).toEqual({ words: 9, wordsFound: 12, wrongTaps: 3 })
    expect(scoreWords('A', unseen)).toEqual({ words: 0, wordsFound: 0, wrongTaps: 20 })
  })
  it('tapping every word on the grid scores 0', () => {
    expect(scoreWords('A', [...targets, ...unseen]).words).toBe(0)
  })
  it("form B's words don't count on form A", () => {
    expect(scoreWords('A', MEMORY_WORDS.B.targets.map((w) => w.id)).words).toBe(0)
  })
  it('digits count only in the right place', () => {
    expect(scoreDigits('4815162342', '4815162342')).toBe(10)
    expect(scoreDigits('4815162342', '48151')).toBe(5)
    expect(scoreDigits('4815162342', '8151623424')).toBe(0)
    expect(scoreDigits('4815162342', '')).toBe(0)
  })
  it('faces: a pick counts when the name belongs to that face', () => {
    expect(scoreFaces('A', { arjun: 'arjun', meera: 'meera', farhan: 'joseph' })).toBe(2)
    expect(scoreFaces('A', {})).toBe(0)
  })
  it('memory score = average of the three parts, 0–100', () => {
    expect(memoryScore({ words: 20, digits: 10, faces: 5 })).toBe(100)
    expect(memoryScore({ words: 0, digits: 0, faces: 0 })).toBe(0)
    expect(memoryScore({ words: 10, digits: 5, faces: 3 })).toBe(53)
  })
})

describe('when the checks are open', () => {
  it('start: Days 1–7 only, once', () => {
    expect(memoryCheckStatus([], []).baselineOpen).toBe(true)
    expect(memoryCheckStatus([1, 2, 3, 4, 5, 6], []).baselineOpen).toBe(true)
    expect(memoryCheckStatus([1, 2, 3, 4, 5, 6, 7], []).baselineOpen).toBe(false)
    expect(memoryCheckStatus([1], [result({})]).baselineOpen).toBe(false)
  })
  it('Day 30: once Day 29 is done, once — with or without a start', () => {
    const upTo29 = Array.from({ length: 29 }, (_, i) => i + 1)
    expect(memoryCheckStatus(upTo29.slice(0, 28), []).finalOpen).toBe(false)
    expect(memoryCheckStatus(upTo29, []).finalOpen).toBe(true)
    expect(memoryCheckStatus(upTo29, [result({ phase: 'final', form: 'B' })]).finalOpen).toBe(false)
  })
  it('the current day follows the furthest completed day', () => {
    expect(currentDay([])).toBe(1)
    expect(currentDay([1, 2, 4])).toBe(5)
    expect(currentDay(Array.from({ length: 30 }, (_, i) => i + 1))).toBe(30)
  })
})

describe('before → after', () => {
  it('compares only when both exist in the same language', () => {
    const start = result({})
    const end = result({ phase: 'final', form: 'B', day: 30 })
    expect(memoryBeforeAfter({ baseline: start, final: end })?.before).toBe(start)
    expect(memoryBeforeAfter({ baseline: null, final: end })).toBeNull()
    expect(memoryBeforeAfter({ baseline: start, final: { ...end, lang: 'hi' } })).toBeNull()
  })
})

describe('number and shuffle', () => {
  it('10 digits, never starting with 0', () => {
    expect(newNumber(() => 0)).toBe('1000000000')
    for (let i = 0; i < 50; i++) expect(newNumber((n) => Math.floor(Math.random() * n))).toMatch(/^[1-9]\d{9}$/)
  })
  it('shuffle keeps every item', () => {
    const items = [1, 2, 3, 4, 5, 6]
    expect(shuffle(items, (n) => Math.floor(Math.random() * n)).sort()).toEqual(items)
  })
})

describe('signed token', () => {
  beforeAll(() => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
  })
  const payload = { uid: 'user-1', phase: 'baseline' as const, form: 'A' as const, lang: 'en' as const, day: 1, number: '4815162342', t0: 0 }
  it('round-trips for the same learner', () => {
    expect(verifyMemoryToken(signMemoryToken(payload, 1000), 'user-1', 2000).number).toBe('4815162342')
  })
  it('refuses another learner, a changed token, or an old one', () => {
    const token = signMemoryToken(payload, 1000)
    expect(() => verifyMemoryToken(token, 'user-2', 2000)).toThrow()
    const [body, sig] = token.split('.')
    const forged = Buffer.from(JSON.stringify({ ...payload, number: '0000000000', iat: 1000 })).toString('base64url')
    expect(body).not.toBe(forged)
    expect(() => verifyMemoryToken(`${forged}.${sig}`, 'user-1', 2000)).toThrow()
    expect(() => verifyMemoryToken(token, 'user-1', 1000 + 61 * 60 * 1000)).toThrow()
  })
})
