import { describe, expect, it } from 'vitest'
import { ASSESSMENT_PASSAGES, countWords, getAssessmentPassage, passageForStage, type AssessmentPassage } from './assessmentPassages'
import {
  computeEffectiveWpm,
  computeWpm,
  generateAttentionSequence,
  getDayThirtyWindow,
  isPlausibleWpm,
  scoreComprehension,
  summarizeAttention,
  type AttentionTrial,
} from './assessmentScoring'

function sentenceStats(text: string): { avgSentenceWords: number; avgWordLetters: number } {
  const sentences = text.split(/[.!?।]+\s/).filter((s) => s.trim().length > 0)
  const words = text.split(/\s+/).filter((w) => w.length > 0)
  const letters = words.reduce((sum, w) => sum + w.replace(/[^A-Za-z]/g, '').length, 0)
  return { avgSentenceWords: words.length / sentences.length, avgWordLetters: letters / words.length }
}

function byId(id: string): AssessmentPassage {
  const passage = getAssessmentPassage(id)
  if (passage === null) throw new Error(id)
  return passage
}

describe('assessment passages', () => {
  it.each([
    ['en', 'form-a', 'form-b', 280],
    ['hi', 'form-a-hi', 'form-b-hi', 280],
  ] as const)('%s forms are parallel: similar length and reading level', (_lang, idA, idB, minWords) => {
    const a = byId(idA)
    const b = byId(idB)
    const wa = countWords(a)
    const wb = countWords(b)
    expect(Math.abs(wa - wb) / Math.max(wa, wb)).toBeLessThan(0.1)
    expect(wa).toBeGreaterThan(minWords)
    const sa = sentenceStats(a.paragraphs.join(' '))
    const sb = sentenceStats(b.paragraphs.join(' '))
    expect(Math.abs(sa.avgSentenceWords - sb.avgSentenceWords) / sa.avgSentenceWords).toBeLessThan(0.15)
    if (a.lang === 'en') expect(Math.abs(sa.avgWordLetters - sb.avgWordLetters) / sa.avgWordLetters).toBeLessThan(0.1)
  })

  it('each have five questions with three options and a valid answer', () => {
    for (const passage of ASSESSMENT_PASSAGES) {
      expect(passage.questions).toHaveLength(5)
      for (const q of passage.questions) {
        expect(q.options).toHaveLength(3)
        expect(new Set(q.options).size).toBe(3)
      }
    }
  })

  it('Day 30 always uses the other form in the same language as Day 1', () => {
    expect(passageForStage('day1', null, 'en').id).toBe('form-a')
    expect(passageForStage('day1', null, 'hi').id).toBe('form-a-hi')
    expect(passageForStage('day30', 'form-a').id).toBe('form-b')
    expect(passageForStage('day30', 'form-b').id).toBe('form-a')
    // Day 30 language follows Day 1, whatever the current UI language.
    expect(passageForStage('day30', 'form-a-hi', 'en').id).toBe('form-b-hi')
    expect(passageForStage('day30', 'form-a', 'hi').id).toBe('form-b')
  })

  it('has four passages, one per form and language', () => {
    expect(ASSESSMENT_PASSAGES.map((p) => p.id).sort()).toEqual(['form-a', 'form-a-hi', 'form-b', 'form-b-hi'])
  })
})

describe('reading scores', () => {
  it('computes WPM from words and time', () => {
    expect(computeWpm(300, 60_000)).toBe(300)
    expect(computeWpm(330, 90_000)).toBe(220)
    expect(computeWpm(300, 0)).toBe(0)
  })

  it('flags implausible timings', () => {
    expect(isPlausibleWpm(250)).toBe(true)
    expect(isPlausibleWpm(20)).toBe(false)
    expect(isPlausibleWpm(3000)).toBe(false)
  })

  it('scores comprehension and does not reward speed without understanding', () => {
    expect(scoreComprehension([0, 1, 2, 0, 1], [0, 1, 2, 0, 1])).toEqual({ correct: 5, total: 5, percent: 100 })
    expect(scoreComprehension([0, 0, 0, 0, 0], [0, 1, 2, 0, 1])).toEqual({ correct: 2, total: 5, percent: 40 })
    expect(computeEffectiveWpm(600, 40)).toBe(240)
    expect(computeEffectiveWpm(300, 100)).toBe(300)
  })
})

describe('attention task', () => {
  it('generates 60 trials with 15 no-go, never first and never two in a row', () => {
    const seq = generateAttentionSequence(42)
    expect(seq).toHaveLength(60)
    expect(seq.filter((t) => !t.go)).toHaveLength(15)
    expect(seq[0]?.go).toBe(true)
    for (let i = 1; i < seq.length; i++) expect(!seq[i]?.go && !seq[i - 1]?.go).toBe(false)
    for (const t of seq) expect(t.gapMs).toBeGreaterThanOrEqual(600)
  })

  it('is reproducible for the same seed and varies between seeds', () => {
    expect(generateAttentionSequence(7)).toEqual(generateAttentionSequence(7))
    expect(generateAttentionSequence(7)).not.toEqual(generateAttentionSequence(8))
  })

  it('summarises accuracy and average reaction time of correct taps', () => {
    const trials: AttentionTrial[] = [
      { go: true, responded: true, rtMs: 400 },
      { go: true, responded: true, rtMs: 500 },
      { go: true, responded: true, rtMs: 100 }, // anticipation: counts as correct, not in the average
      { go: true, responded: false, rtMs: null }, // miss
      { go: false, responded: false, rtMs: null }, // correct hold-back
      { go: false, responded: true, rtMs: 300 }, // commission error
    ]
    expect(summarizeAttention(trials)).toEqual({ accuracyPercent: 67, meanRtMs: 450, trials: 6 })
    expect(summarizeAttention([])).toEqual({ accuracyPercent: 0, meanRtMs: null, trials: 0 })
  })
})

describe('Day 30 window', () => {
  const baseline = new Date('2026-10-01T10:00:00+05:30') // program day 1
  const at = (iso: string): Date => new Date(iso)

  it('needs a baseline first', () => {
    expect(getDayThirtyWindow(null, null, at('2026-11-01T10:00:00+05:30'))).toEqual({ status: 'no-baseline' })
  })

  it('is locked before day 28 and tells the unlock date', () => {
    const w = getDayThirtyWindow(baseline, null, at('2026-10-27T23:00:00+05:30')) // day 27
    expect(w.status).toBe('locked')
    if (w.status === 'locked') {
      expect(w.programDay).toBe(27)
      expect(w.unlocksOn.toISOString()).toBe(new Date('2026-10-28T00:00:00+05:30').toISOString())
    }
  })

  it('opens on day 28 (IST calendar day, not 27×24 hours)', () => {
    expect(getDayThirtyWindow(baseline, null, at('2026-10-28T00:30:00+05:30'))).toEqual({ status: 'open', programDay: 28 })
  })

  it('opens early once Day 29 is completed after the baseline', () => {
    expect(getDayThirtyWindow(baseline, at('2026-10-20T09:00:00+05:30'), at('2026-10-20T10:00:00+05:30'))).toEqual({ status: 'open', programDay: 20 })
  })

  it('ignores a Day 29 completed before the baseline (a new baseline restarts the count)', () => {
    expect(getDayThirtyWindow(baseline, at('2026-09-20T09:00:00+05:30'), at('2026-10-05T10:00:00+05:30')).status).toBe('locked')
  })

  it('stays open but late after day 35', () => {
    expect(getDayThirtyWindow(baseline, null, at('2026-11-04T10:00:00+05:30'))).toEqual({ status: 'open', programDay: 35 })
    expect(getDayThirtyWindow(baseline, null, at('2026-11-05T10:00:00+05:30'))).toEqual({ status: 'late', programDay: 36 })
  })
})
