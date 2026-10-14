import { describe, expect, it } from 'vitest'
import { countWords } from '@/features/reading-speed-test/scoring'
import { MEMORY_TEST_PASSAGES } from './passages'

describe('Reading & Memory Test passages', () => {
  it('has at least 3 passages per language, rotated', () => {
    expect(MEMORY_TEST_PASSAGES.filter((p) => p.lang === 'en').length).toBeGreaterThanOrEqual(3)
    expect(MEMORY_TEST_PASSAGES.filter((p) => p.lang === 'hi').length).toBeGreaterThanOrEqual(3)
  })
  it.each(MEMORY_TEST_PASSAGES.map((p) => [p.id, p] as const))('%s: 200–260 words, 4 questions with 4 distinct options', (_id, p) => {
    const words = countWords(p.text)
    expect(words).toBeGreaterThanOrEqual(200)
    expect(words).toBeLessThanOrEqual(260)
    expect(p.questions).toHaveLength(4)
    for (const q of p.questions) {
      expect(new Set(q.options).size).toBe(4)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(4)
    }
  })
  it('ids are unique', () => {
    expect(new Set(MEMORY_TEST_PASSAGES.map((p) => p.id)).size).toBe(MEMORY_TEST_PASSAGES.length)
  })
})
