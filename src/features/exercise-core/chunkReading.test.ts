import { describe, expect, it } from 'vitest'
import { chunkDurationMs, chunkLevel, chunkText, DYNAMIC_CHUNK_LEVELS, effectiveWpm, isLongWord, VERTICAL_CHUNK_LEVELS } from './chunkReading'
import { passageTierForLevel, pickPassage, READING_PASSAGES, wordCount } from './readingPassages'

describe('chunk levels', () => {
  it('chunk size grows 1 → 2 → 3 words and pace only rises', () => {
    for (const table of [DYNAMIC_CHUNK_LEVELS, VERTICAL_CHUNK_LEVELS]) {
      expect([1, 2, 3].map((l) => chunkLevel(table, l).chunkWords)).toEqual([1, 1, 1])
      expect([4, 5, 6].map((l) => chunkLevel(table, l).chunkWords)).toEqual([2, 2, 2])
      expect([7, 8, 9, 10].map((l) => chunkLevel(table, l).chunkWords)).toEqual([3, 3, 3, 3])
      for (let l = 2; l <= 10; l++) expect(chunkLevel(table, l).wpm).toBeGreaterThan(chunkLevel(table, l - 1).wpm)
    }
  })

  it('starts gently: level 1 is one word at a time at ≤ 110 words a minute', () => {
    expect(chunkLevel(DYNAMIC_CHUNK_LEVELS, 1)).toMatchObject({ chunkWords: 1 })
    expect(chunkLevel(DYNAMIC_CHUNK_LEVELS, 1).wpm).toBeLessThanOrEqual(110)
    expect(chunkLevel(VERTICAL_CHUNK_LEVELS, 1).wpm).toBeLessThanOrEqual(110)
    // Every word stays on screen at least about half a second at level 1.
    expect(chunkDurationMs('word', chunkLevel(DYNAMIC_CHUNK_LEVELS, 1).wpm)).toBeGreaterThanOrEqual(500)
  })
})

describe('chunking', () => {
  it('groups words, never across a sentence end', () => {
    expect(chunkText('One two three. Four five six seven.', 3, 'en')).toEqual(['One two three.', 'Four five six', 'seven.'])
    expect(chunkText('A b. C d', 3, 'en')).toEqual(['A b.', 'C d'])
  })

  it('shows long words alone', () => {
    expect(isLongWord('comprehension', 'en')).toBe(true)
    expect(isLongWord('reading', 'en')).toBe(false)
    expect(chunkText('we read comprehension tests now', 3, 'en')).toEqual(['we read', 'comprehension', 'tests now'])
  })

  it('treats the Hindi full stop (।) as a sentence end', () => {
    expect(chunkText('यह एक वाक्य है। दूसरा वाक्य', 3, 'hi')).toEqual(['यह एक वाक्य', 'है।', 'दूसरा वाक्य'])
  })

  it('size 1 gives one word per chunk', () => {
    const p = READING_PASSAGES.en[0]!
    expect(chunkText(p.text, 1, 'en')).toHaveLength(wordCount(p.text))
  })

  it('effective WPM = pace × comprehension', () => {
    expect(effectiveWpm(200, 3, 4)).toBe(150)
    expect(effectiveWpm(200, 0, 0)).toBe(0)
  })
})

describe('passage bank', () => {
  it('has the same 18 passages in English and Hindi, 6 per length', () => {
    for (const lang of ['en', 'hi'] as const) {
      const list = READING_PASSAGES[lang]
      expect(list).toHaveLength(18)
      for (const tier of [1, 2, 3]) expect(list.filter((p) => p.tier === tier)).toHaveLength(6)
    }
    expect(READING_PASSAGES.hi.map((p) => p.id)).toEqual(READING_PASSAGES.en.map((p) => p.id))
  })

  it('every passage has 3 questions and a summary with valid answers', () => {
    for (const p of [...READING_PASSAGES.en, ...READING_PASSAGES.hi]) {
      expect(p.questions).toHaveLength(3)
      for (const q of p.questions) {
        expect(q.answer).toBeGreaterThanOrEqual(0)
        expect(q.answer).toBeLessThan(q.options.length)
        expect(new Set(q.options).size).toBe(q.options.length)
      }
      expect(p.summary.answer).toBeLessThan(p.summary.options.length)
    }
  })

  it('English passages get longer with the tier', () => {
    const avg = (tier: number): number => {
      const list = READING_PASSAGES.en.filter((p) => p.tier === tier)
      return list.reduce((s, p) => s + wordCount(p.text), 0) / list.length
    }
    expect(avg(1)).toBeLessThan(avg(2))
    expect(avg(2)).toBeLessThan(avg(3))
    expect(avg(1)).toBeLessThanOrEqual(65)
  })

  it('answers are not always in the same position', () => {
    const positions = new Set(READING_PASSAGES.en.flatMap((p) => p.questions.map((q) => q.answer)))
    expect(positions.size).toBe(3)
  })

  it('picks the right length and avoids recently read passages', () => {
    expect(passageTierForLevel(1)).toBe(1)
    expect(passageTierForLevel(5)).toBe(2)
    expect(passageTierForLevel(10)).toBe(3)
    const recent = READING_PASSAGES.en.filter((p) => p.tier === 1).slice(0, 5).map((p) => p.id)
    for (let i = 0; i < 20; i++) expect(recent).not.toContain(pickPassage('en', 1, recent).id)
  })
})
