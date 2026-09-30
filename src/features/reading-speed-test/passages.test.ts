import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { MEASURED_PASSAGES, PRACTICE_PASSAGES } from './passages'
import { countWords } from './scoring'

describe('Reading Speed Test passages', () => {
  it('has at least 3 measured passages per language, 300–350 words each, 5 questions', () => {
    for (const lang of ['en', 'hi'] as const) {
      const passages = MEASURED_PASSAGES.filter((p) => p.lang === lang)
      expect(passages.length).toBeGreaterThanOrEqual(3)
      for (const p of passages) {
        const words = countWords(p.text)
        expect(words, `${p.id} has ${words} words`).toBeGreaterThanOrEqual(300)
        expect(words, `${p.id} has ${words} words`).toBeLessThanOrEqual(350)
        expect(p.questions).toHaveLength(5)
      }
    }
  })

  it('has short practice passages with 3 questions in each language', () => {
    for (const lang of ['en', 'hi'] as const) {
      const passages = PRACTICE_PASSAGES.filter((p) => p.lang === lang)
      expect(passages.length).toBeGreaterThanOrEqual(1)
      for (const p of passages) {
        expect(countWords(p.text)).toBeLessThanOrEqual(140)
        expect(p.questions).toHaveLength(3)
      }
    }
  })

  it('gives every question 4 distinct options and a valid answer', () => {
    for (const p of [...MEASURED_PASSAGES, ...PRACTICE_PASSAGES]) {
      for (const q of p.questions) {
        expect(new Set(q.options).size, `${p.id}: ${q.question}`).toBe(4)
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(4)
      }
    }
  })

  it('matches docs/speed-test-passages.md word for word, answers marked ✅', () => {
    const doc = readFileSync(join(process.cwd(), 'docs/speed-test-passages.md'), 'utf8')
    for (const p of [...MEASURED_PASSAGES, ...PRACTICE_PASSAGES]) {
      expect(doc, `${p.id} title`).toContain(`### ${p.id} · ${p.title}`)
      for (const paragraph of p.text.split(/\n\s*\n/)) expect(doc, `${p.id} paragraph`).toContain(paragraph.trim())
      for (const q of p.questions) {
        expect(doc, `${p.id}: ${q.question}`).toContain(q.question)
        q.options.forEach((option, i) => {
          expect(doc, `${p.id}: ${option}`).toContain(`- ${option}${i === q.correctIndex ? ' ✅' : ''}\n`)
        })
      }
    }
  })

  it('uses unique passage ids', () => {
    const ids = [...MEASURED_PASSAGES, ...PRACTICE_PASSAGES].map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
