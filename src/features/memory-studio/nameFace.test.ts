import { describe, expect, it } from 'vitest'
import { MEMORY_FACES } from '@/features/memory-check/content'
import { mainFeature, nameFaceLevel, pickNameFaceRound, roundIds, STUDIO_FACES, STUDIO_NAMES } from './nameFace'

const seeded = (seed: number) => {
  let s = seed
  return (n: number): number => {
    s = (s * 1103515245 + 12345) % 2 ** 31
    return s % n
  }
}

describe('Names and faces material', () => {
  it('never reuses a memory-check face or name', () => {
    const check = [...MEMORY_FACES.A, ...MEMORY_FACES.B]
    const checkNames = new Set(check.flatMap((f) => [f.name.en.toLowerCase(), f.name.hi]))
    for (const n of STUDIO_NAMES) {
      expect(checkNames.has(n.en.toLowerCase()), n.en).toBe(false)
      expect(checkNames.has(n.hi), n.hi).toBe(false)
    }
    const key = (s: object): string => JSON.stringify(s, Object.keys(s).sort())
    const checkSpecs = new Set(check.map((f) => key(f.face)))
    for (const f of STUDIO_FACES) expect(checkSpecs.has(key(f.spec)), f.id).toBe(false)
  })

  it('has distinct faces and names, enough for the hardest level', () => {
    expect(new Set(STUDIO_FACES.map((f) => JSON.stringify(f.spec))).size).toBe(STUDIO_FACES.length)
    expect(new Set(STUDIO_NAMES.map((n) => n.id)).size).toBe(STUDIO_NAMES.length)
    expect(STUDIO_FACES.length).toBeGreaterThanOrEqual(2 * nameFaceLevel(10).count)
  })

  it('every face has a feature to notice', () => {
    for (const f of STUDIO_FACES) expect(mainFeature(f.spec)).toBeTruthy()
  })
})

describe('pickNameFaceRound', () => {
  it('grows from 3 faces at level 1 to 10 at level 10', () => {
    expect(nameFaceLevel(1).count).toBe(3)
    expect(nameFaceLevel(10).count).toBe(10)
    for (let l = 2; l <= 10; l++) expect(nameFaceLevel(l).count).toBeGreaterThanOrEqual(nameFaceLevel(l - 1).count)
  })

  it('gives every face a different name that suits it, plus unseen names in the choices', () => {
    for (let level = 1; level <= 10; level++) {
      for (let seed = 1; seed <= 20; seed++) {
        const r = pickNameFaceRound(level, [], seeded(seed * level))
        const c = nameFaceLevel(level)
        expect(r.people).toHaveLength(c.count)
        expect(new Set(r.people.map((p) => p.face.id)).size).toBe(c.count)
        expect(new Set(r.people.map((p) => p.name.id)).size).toBe(c.count)
        for (const p of r.people) expect(p.name.look).toBe(p.face.look)
        expect(r.choices).toHaveLength(c.count + c.unseen)
        expect(new Set(r.choices.map((x) => x.id)).size).toBe(r.choices.length)
        expect([...r.askOrder].sort((a, b) => a - b)).toEqual(r.people.map((_, i) => i))
      }
    }
  })

  it('changes shirt colours at recall from level 4, so only the face helps', () => {
    const easy = pickNameFaceRound(1, [], seeded(3))
    for (const p of easy.people) expect(p.recallShirt).toBe(p.shirt)
    const hard = pickNameFaceRound(6, [], seeded(3))
    for (const p of hard.people) expect(p.recallShirt).not.toBe(p.shirt)
  })

  it('avoids the last round’s faces and names', () => {
    const first = pickNameFaceRound(5, [], seeded(7))
    const next = pickNameFaceRound(5, roundIds(first), seeded(8))
    const before = new Set(roundIds(first))
    for (const p of next.people) {
      expect(before.has(p.face.id)).toBe(false)
      expect(before.has(p.name.id)).toBe(false)
    }
  })

  it('the warm-up has 2 faces and 1 unseen name', () => {
    const r = pickNameFaceRound(1, [], seeded(1), 2)
    expect(r.people).toHaveLength(2)
    expect(r.choices).toHaveLength(3)
  })
})
