import { describe, expect, it } from 'vitest'
import { countWords, FAIR_FORMS, formForDay, type FairForm } from './forms'
import { MEASURED_PASSAGES, PRACTICE_PASSAGES } from '@/features/reading-speed-test/passages'

const sentences = (text: string): number => text.split(/[.!?।]+/u).map((s) => s.trim()).filter(Boolean).length
const wordsPerSentence = (f: FairForm): number => countWords(f.text) / sentences(f.text)

function syllables(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (w.length <= 3) return 1
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '')
  return w.match(/[aeiouy]{1,2}/g)?.length ?? 1
}

/** Flesch–Kincaid grade level (English). */
function fkGrade(text: string): number {
  const words = text.trim().split(/\s+/)
  const syl = words.reduce((a, w) => a + syllables(w), 0)
  return 0.39 * (words.length / sentences(text)) + 11.8 * (syl / words.length) - 15.59
}

const shingles = (text: string, n = 6): Set<string> => {
  const w = text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean)
  return new Set(Array.from({ length: Math.max(0, w.length - n + 1) }, (_, i) => w.slice(i, i + n).join(' ')))
}

const ALL = [...FAIR_FORMS.en, ...FAIR_FORMS.hi]
const FREE_TEST = [...MEASURED_PASSAGES, ...PRACTICE_PASSAGES]

describe('fair reading test forms', () => {
  it('has forms A, B, C, D, E and R in English and Hindi', () => {
    for (const lang of ['en', 'hi'] as const) expect(FAIR_FORMS[lang].map((f) => f.id)).toEqual(['A', 'B', 'C', 'D', 'E', 'R'])
  })

  it.each(ALL.map((f) => [`${f.lang}-${f.id}`, f] as const))('%s is 300 ± 10 words', (_, f) => {
    const n = countWords(f.text)
    expect(n, `${f.lang}-${f.id}: ${n} words`).toBeGreaterThanOrEqual(290)
    expect(n, `${f.lang}-${f.id}: ${n} words`).toBeLessThanOrEqual(310)
  })

  it.each(FAIR_FORMS.en.map((f) => [f.id, f] as const))('English %s: grade 6–7, 14–17 words per sentence', (_, f) => {
    const g = fkGrade(f.text)
    const wps = wordsPerSentence(f)
    expect(g, `grade ${g.toFixed(2)}`).toBeGreaterThanOrEqual(6)
    expect(g, `grade ${g.toFixed(2)}`).toBeLessThanOrEqual(7)
    expect(wps, `words/sentence ${wps.toFixed(1)}`).toBeGreaterThanOrEqual(14)
    expect(wps, `words/sentence ${wps.toFixed(1)}`).toBeLessThanOrEqual(17)
  })

  it.each(FAIR_FORMS.hi.map((f) => [f.id, f] as const))('Hindi %s: 16–19 words per sentence', (_, f) => {
    const wps = wordsPerSentence(f)
    expect(wps, `words/sentence ${wps.toFixed(1)}`).toBeGreaterThanOrEqual(16)
    expect(wps, `words/sentence ${wps.toFixed(1)}`).toBeLessThanOrEqual(19)
  })

  it.each(ALL.map((f) => [`${f.lang}-${f.id}`, f] as const))('%s has the fixed question mix with 4 different options', (_, f) => {
    expect(f.questions.map((q) => q.kind)).toEqual(['fact', 'fact', 'order', 'main-idea', 'inference'])
    for (const q of f.questions) expect(new Set(q.options).size).toBe(4)
  })

  it('Forms A and B (Day 1 / Day 30) are closely matched', () => {
    for (const lang of ['en', 'hi'] as const) {
      const [a, b] = [FAIR_FORMS[lang][0]!, FAIR_FORMS[lang][1]!]
      expect(Math.abs(countWords(a.text) - countWords(b.text)), lang).toBeLessThanOrEqual(10)
      expect(Math.abs(wordsPerSentence(a) - wordsPerSentence(b)), lang).toBeLessThanOrEqual(1.5)
      if (lang === 'en') expect(Math.abs(fkGrade(a.text) - fkGrade(b.text))).toBeLessThanOrEqual(0.6)
    }
  })

  it('never shares a title or any 6-word run with the free Reading Speed Test passages', () => {
    const freeTitles = new Set(FREE_TEST.map((p) => p.title))
    const free = FREE_TEST.map((p) => shingles(p.text))
    for (const f of ALL) {
      expect(freeTitles.has(f.title), f.title).toBe(false)
      const mine = shingles(f.text)
      for (const s of free) expect([...mine].filter((x) => s.has(x)), `${f.lang}-${f.id}`).toEqual([])
    }
  })
})

describe('which form on which day', () => {
  it('check-ins use C, D, E; the final is always the other of A/B', () => {
    expect([7, 14, 21].map((d) => formForDay(d, 'A'))).toEqual(['C', 'D', 'E'])
    expect(formForDay(30, 'A')).toBe('B')
    expect(formForDay(30, 'B')).toBe('A')
    expect(formForDay(1, 'B')).toBe('B')
  })
  it('a new baseline is A or B at random', () => {
    expect(formForDay(1, null, () => 0.1)).toBe('A')
    expect(formForDay(1, null, () => 0.9)).toBe('B')
  })
})
