import { describe, expect, it } from 'vitest'
import { buildPictureTrial, orderMatches, PICTURE_LEVELS, PICTURES, pictureLevel, studyDurationMs, THEMES } from './pictureTraining'

function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

describe('picture memory levels', () => {
  it('level 1: 3 pictures, 6 s to look (2 s each), then 4 options', () => {
    expect(pictureLevel(1)).toEqual({ mode: 'seen', items: 3, studyMs: 6000, options: 4 })
  })

  it('every picture is on screen at least 1 s at the hardest level, and longer for beginners', () => {
    for (const [lv, c] of Object.entries(PICTURE_LEVELS)) {
      const perPicture = c.mode === 'order' ? c.studyMs : c.studyMs / c.items
      expect(perPicture, `L${lv}`).toBeGreaterThanOrEqual(c.mode === 'order' ? 1000 : 850)
    }
    expect(pictureLevel(1).studyMs / pictureLevel(1).items).toBeGreaterThanOrEqual(2000)
  })

  it('adds a recall-in-order mode at higher levels, with more pictures as levels rise', () => {
    expect([1, 2, 3, 4, 5].some((l) => pictureLevel(l).mode === 'order')).toBe(false)
    expect([6, 8, 10].every((l) => pictureLevel(l).mode === 'order')).toBe(true)
    expect(pictureLevel(10).items).toBeGreaterThan(pictureLevel(6).items)
    expect(pictureLevel(9).items).toBeGreaterThan(pictureLevel(4).items)
  })

  it('has 6 vivid themes with enough unique pictures for every level', () => {
    expect(THEMES).toHaveLength(6)
    expect(new Set(PICTURES.map((p) => p.id)).size).toBe(PICTURES.length)
    const needed = (c: (typeof PICTURE_LEVELS)[number]): number => (c.mode === 'seen' ? c.items + c.options - 1 : c.mode === 'notSeen' ? c.items + 1 : Math.max(c.items, c.options))
    const maxNeeded = Math.max(...Object.values(PICTURE_LEVELS).map(needed))
    for (const theme of THEMES) expect(PICTURES.filter((p) => p.theme === theme).length).toBeGreaterThanOrEqual(maxNeeded)
  })
})

describe('picture trials', () => {
  it('one theme per trial, one right answer, distinct options', () => {
    const rng = seeded(11)
    for (let level = 1; level <= 10; level++) {
      for (let i = 0; i < 100; i++) {
        const trial = buildPictureTrial(level, rng)
        const c = pictureLevel(level)
        expect(trial.shown).toHaveLength(c.items)
        expect(trial.options).toHaveLength(c.options)
        expect(new Set(trial.options.map((o) => o.id)).size).toBe(c.options)
        expect([...trial.shown, ...trial.options].every((p) => p.theme === trial.theme)).toBe(true)
        const shownIds = new Set(trial.shown.map((s) => s.id))
        if (trial.mode === 'seen') {
          expect(trial.options.filter((o) => shownIds.has(o.id))).toHaveLength(1)
          expect(shownIds.has(trial.options[trial.correctIndex]!.id)).toBe(true)
        } else if (trial.mode === 'notSeen') {
          expect(trial.options.filter((o) => !shownIds.has(o.id))).toHaveLength(1)
          expect(shownIds.has(trial.options[trial.correctIndex]!.id)).toBe(false)
        } else {
          expect(trial.shown.every((s) => trial.options.some((o) => o.id === s.id))).toBe(true)
        }
      }
    }
  })

  it('never repeats the previous theme when asked not to', () => {
    const rng = seeded(5)
    for (let i = 0; i < 50; i++) expect(buildPictureTrial(3, rng, 'animals').theme).not.toBe('animals')
  })

  it('scores recall-in-order by position', () => {
    const [a, b, c] = PICTURES
    expect(orderMatches([a!, b!, c!], [a!, b!, c!])).toBe(3)
    expect(orderMatches([a!, b!, c!], [b!, a!, c!])).toBe(1)
    const trial = buildPictureTrial(8, seeded(1))
    expect(studyDurationMs(trial)).toBe(1200 * 4)
  })
})
