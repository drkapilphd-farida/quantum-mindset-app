import { describe, expect, it } from 'vitest'
import { findPassage, LIBRARY, passageWords } from './library'

describe('Smart Reader library', () => {
  for (const lang of ['en', 'hi'] as const) {
    it(`${lang}: 6 passages, each 3 sections with 2 well-formed questions`, () => {
      expect(LIBRARY[lang]).toHaveLength(6)
      for (const p of LIBRARY[lang]) {
        expect(p.lang).toBe(lang)
        expect(p.sections).toHaveLength(3)
        expect(passageWords(p)).toBeGreaterThan(300)
        for (const s of p.sections) {
          expect(s.questions).toHaveLength(2)
          for (const q of s.questions) {
            expect(q.options).toHaveLength(4)
            expect(new Set(q.options).size).toBe(4)
            expect(q.correctIndex).toBeGreaterThanOrEqual(0)
            expect(q.correctIndex).toBeLessThan(4)
          }
        }
      }
    })
  }
  it('ids are unique and findable; English and Hindi cover the same topics', () => {
    const ids = [...LIBRARY.en, ...LIBRARY.hi].map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(findPassage('hi-story-of-zero')?.title).toBe('शून्य की कहानी')
    expect(LIBRARY.en.map((p) => p.id.slice(3))).toEqual(LIBRARY.hi.map((p) => p.id.slice(3)))
  })
})
