import { describe, expect, it } from 'vitest'
import { gridOrder, MEMORY_SETS, RSVP_PASSAGES, shuffled } from './content'

const words = (s: string): number => s.trim().split(/\s+/).length

describe('memory sets', () => {
  it('3 sets, each 7 shown + 5 distractors, all ids unique, words in both languages', () => {
    expect(MEMORY_SETS).toHaveLength(3)
    for (const set of MEMORY_SETS) {
      expect(set.shown).toHaveLength(7)
      expect(set.distractors).toHaveLength(5)
      const all = [...set.shown, ...set.distractors]
      expect(new Set(all.map((i) => i.id)).size).toBe(12)
      for (const i of all) {
        expect(i.word.en.length, i.id).toBeGreaterThan(0)
        expect(i.word.hi.length, i.id).toBeGreaterThan(0)
      }
    }
  })
})

describe('RSVP passages', () => {
  it('3 passages of about 60 words, one valid 3-option question per language', () => {
    expect(RSVP_PASSAGES).toHaveLength(3)
    for (const p of RSVP_PASSAGES) {
      expect(words(p.text.en), p.id).toBeGreaterThanOrEqual(50)
      expect(words(p.text.en), p.id).toBeLessThanOrEqual(75)
      expect(words(p.text.hi), p.id).toBeGreaterThanOrEqual(50)
      for (const lang of ['en', 'hi'] as const) {
        const q = p.question[lang]
        expect(q.options).toHaveLength(3)
        expect(q.answer).toBeGreaterThanOrEqual(0)
        expect(q.answer).toBeLessThan(3)
      }
      expect(p.question.hi.answer).toBe(p.question.en.answer)
    }
  })
})

describe('grid and shuffle', () => {
  it('a grid holds 1–25 once each', () => {
    expect([...gridOrder()].sort((a, b) => a - b)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1))
  })
  it('shuffle keeps every element', () => {
    expect([...shuffled([1, 2, 3, 4], () => 0.5)].sort()).toEqual([1, 2, 3, 4])
  })
})
