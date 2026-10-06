import { describe, expect, it } from 'vitest'
import { buildGlimpseTrial, flashMs, glimpsePoints, type GlimpseMode } from './glimpseTraining'

function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const MODES: readonly GlimpseMode[] = ['span', 'peripheral', 'phrase', 'blink']

describe('glimpse drills', () => {
  it('level 1 shows things long enough for a beginner; flashes only get shorter', () => {
    expect(flashMs('span', 1)).toBeGreaterThanOrEqual(1500)
    expect(flashMs('peripheral', 1)).toBeGreaterThanOrEqual(1500)
    expect(flashMs('phrase', 1)).toBeGreaterThanOrEqual(1500)
    expect(flashMs('blink', 1)).toBeGreaterThanOrEqual(900)
    for (const mode of MODES) for (let l = 2; l <= 10; l++) expect(flashMs(mode, l)).toBeLessThanOrEqual(flashMs(mode, l - 1))
  })

  it('every glimpse ends with 4 distinct options and exactly one right answer', () => {
    const rng = seeded(7)
    for (const mode of MODES)
      for (const lang of ['en', 'hi'] as const)
        for (let level = 1; level <= 10; level++)
          for (let i = 0; i < 30; i++) {
            const t = buildGlimpseTrial(mode, level, lang, rng)
            expect(t.options, `${mode} L${level} ${lang}`).toHaveLength(4)
            expect(new Set(t.options).size).toBe(4)
            expect(t.correctIndex).toBeGreaterThanOrEqual(0)
            const right = t.options[t.correctIndex]!
            if (mode === 'phrase' || mode === 'blink') expect(right).toBe(t.shown[0]!.label)
            else expect(t.shown.some((s) => s.label === right)).toBe(true)
          }
  })

  it('stays on the stage and grows with level', () => {
    const rng = seeded(3)
    for (let level = 1; level <= 10; level++) {
      for (const mode of ['span', 'peripheral'] as const) {
        for (const p of buildGlimpseTrial(mode, level, 'en', rng).shown) {
          expect(p.x).toBeGreaterThan(0)
          expect(p.x).toBeLessThan(1)
          expect(p.y).toBeGreaterThan(0)
          expect(p.y).toBeLessThan(1)
        }
      }
    }
    expect(buildGlimpseTrial('span', 10, 'en', rng).shown.length).toBeGreaterThan(buildGlimpseTrial('span', 1, 'en', rng).shown.length)
    expect(buildGlimpseTrial('phrase', 10, 'en', rng).shown[0]!.label.split(' ').length).toBe(5)
    expect(buildGlimpseTrial('peripheral', 6, 'en', rng).question).toBe('whichOnSide')
  })

  it('scores only correct answers, more at higher levels', () => {
    expect(glimpsePoints(3, false)).toBe(0)
    expect(glimpsePoints(3, true)).toBe(16)
  })
})
