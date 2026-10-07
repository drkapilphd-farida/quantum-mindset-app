import { beforeAll, describe, expect, it } from 'vitest'
import { getForm } from './forms'
import { beforeAfter, countCorrect, needsOneTimeBaseline, percentChange, scoreFairTest, type FairResult } from './fairTest'
import { signFairToken, verifyFairToken } from './fairToken'
import { baselinePrompt } from './oneTimeBaseline'

const result = (over: Partial<FairResult>): FairResult => ({ kind: 'baseline', day: 1, form: 'A', lang: 'en', wpm: 200, comprehensionPercent: 80, effectiveWpm: 160, status: 'valid', createdAt: '2026-10-01T00:00:00Z', ...over })

describe('scoring', () => {
  const form = getForm('en', 'A')
  it('WPM from words and time; effective speed = WPM × comprehension', () => {
    const s = scoreFairTest(form, 90_000, 4) // 296 words in 1.5 min
    expect(s.wpm).toBe(197)
    expect(s.comprehensionPercent).toBe(80)
    expect(s.effectiveWpm).toBe(158)
    expect(s.status).toBe('valid')
  })
  it('over 700 WPM is too fast (not saved); under 60% is saved as low comprehension', () => {
    expect(scoreFairTest(form, 20_000, 5).status).toBe('too_fast')
    expect(scoreFairTest(form, 90_000, 2).status).toBe('low_comprehension')
  })
  it('counts answers through the shuffled option order', () => {
    const perm = form.questions.map(() => [3, 2, 1, 0])
    const answers = form.questions.map((q) => 3 - q.correctIndex)
    expect(countCorrect(form, perm, answers)).toBe(5)
    expect(countCorrect(form, perm, [0, 0, 0, 0, 0])).toBeLessThan(5)
  })
})

describe('before/after', () => {
  it('percent change', () => {
    expect(percentChange(160, 220)).toBe(38)
    expect(percentChange(0, 220)).toBeNull()
  })
  it('pairs the baseline with the final in the same language', () => {
    const pair = beforeAfter([result({}), result({ kind: 'checkpoint', day: 7, form: 'C' }), result({ kind: 'final', day: 30, form: 'B', effectiveWpm: 230 })])
    expect(pair?.before.form).toBe('A')
    expect(pair?.after?.effectiveWpm).toBe(230)
    expect(beforeAfter([result({ kind: 'checkpoint' })])).toBeNull()
  })
})

describe('one-time fair baseline for existing learners', () => {
  it('needed only when Day 1 is done and there is no fair baseline yet', () => {
    expect(needsOneTimeBaseline([1, 2, 3], [])).toBe(true)
    expect(needsOneTimeBaseline([1, 2, 3], [{ kind: 'baseline' }])).toBe(false)
    expect(needsOneTimeBaseline([], [])).toBe(false)
  })
})

describe('signed token', () => {
  beforeAll(() => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-key-for-unit-tests'
  })
  const payload = { kind: 'reading' as const, uid: 'learner-1', lang: 'en' as const, form: 'A' as const, test: 'baseline' as const, day: 1, t0: 1000, perm: [[0, 1, 2, 3]] }
  it('verifies for the same learner only', () => {
    const token = signFairToken(payload, 1000)
    expect(verifyFairToken(token, 'reading', 'learner-1', 2000).form).toBe('A')
    expect(() => verifyFairToken(token, 'reading', 'someone-else', 2000)).toThrow()
  })
  it('rejects a tampered or expired token', () => {
    const token = signFairToken(payload, 1000)
    const [body, sig] = token.split('.')
    const forged = Buffer.from(JSON.stringify({ ...payload, t0: 0, iat: 1000 })).toString('base64url')
    expect(() => verifyFairToken(`${forged}.${sig}`, 'reading', 'learner-1', 2000)).toThrow()
    expect(() => verifyFairToken(`${body}.${sig}`, 'reading', 'learner-1', 1000 + 2 * 3_600_000)).toThrow()
  })
})

describe('one-time baseline postponement', () => {
  const now = new Date(2026, 9, 7, 10)
  it('offers Tomorrow once, hides for the rest of that day, then offers without Tomorrow', () => {
    expect(baselinePrompt(null, now)).toBe('offer-with-tomorrow')
    expect(baselinePrompt('2026-10-07', now)).toBe('hidden')
    expect(baselinePrompt('2026-10-06', now)).toBe('offer')
  })
})
