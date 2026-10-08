import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { sharpBrainCopy } from './sharpBrainCopy'

// The website's certificate section shows samples only: it must never
// promise a speed or a percentage, and must say results vary.
describe('Sharp Brain page — certificate section', () => {
  for (const lang of ['en', 'hi'] as const) {
    const c = sharpBrainCopy[lang].certificate
    const text = [c.eyebrow, c.title, c.intro, ...c.points.flatMap((p) => [p.title, p.desc]), c.vary, c.caption, c.certAlt, c.shareAlt, c.enlarge].join(' ')

    it(`${lang}: no percentage, WPM or speed-figure promises`, () => {
      expect(text).not.toMatch(/%|percent|प्रतिशत/i)
      expect(text).not.toMatch(/\bwpm\b|words per minute|शब्द प्रति मिनट/i)
      expect(text).not.toMatch(/\b\d+\s*x\b|\b(double|triple)\b|दोगुन|तिगुन/i)
      // The only numbers are the day numbers and "8 languages".
      expect(text.match(/\d+/g)?.every((n) => ['1', '30', '8'].includes(n))).toBe(true)
    })

    it(`${lang}: says results vary, and every sample image exists`, () => {
      expect(c.vary.length).toBeGreaterThan(10)
      for (const file of [`sample-certificate-${lang}.webp`, `sample-share-image-${lang}.webp`]) expect(existsSync(join(process.cwd(), 'public/brand/samples', file))).toBe(true)
    })
  }

  it('the page tells one story: Day 1 / Day 30, not Class 1 / Class 7', () => {
    expect(JSON.stringify(sharpBrainCopy)).not.toMatch(/Class 1|Class 7/)
  })
})
