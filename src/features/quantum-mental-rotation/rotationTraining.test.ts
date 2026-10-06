import { describe, expect, it } from 'vitest'
import { applyRotation, type CubeState, type Face, type RotationType } from './quantumMentalRotationDataset'
import {
  buildCubeTrial,
  buildFlatTrial,
  buildTrial,
  COMPLEX_SHAPES,
  cubeTurnCss,
  ROTATION_LEVELS,
  rotationLevel,
  sameView,
  SIMPLE_SHAPES,
  trialPoints,
  type Cell,
  type FlatShape,
} from './rotationTraining'

function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

// Canonical form of a cell set under translation, so shapes can be compared.
function canon(cells: readonly Cell[]): string {
  const minX = Math.min(...cells.map((c) => c[0]))
  const minY = Math.min(...cells.map((c) => c[1]))
  return cells
    .map(([x, y]) => `${x - minX},${y - minY}`)
    .sort()
    .join(' ')
}
const rot90 = (cells: readonly Cell[]): Cell[] => cells.map(([x, y]) => [-y, x] as Cell)
const mirror = (cells: readonly Cell[]): Cell[] => cells.map(([x, y]) => [-x, y] as Cell)
function allTurns(cells: readonly Cell[]): string[] {
  const out: string[] = []
  let c: Cell[] = [...cells]
  for (let i = 0; i < 4; i++) {
    out.push(canon(c))
    c = rot90(c)
  }
  return out
}

describe('mental rotation levels', () => {
  it('has 10 levels; level 1 is flat shapes, 2 options, no timer', () => {
    expect(Object.keys(ROTATION_LEVELS)).toHaveLength(10)
    expect(rotationLevel(1)).toMatchObject({ family: 'turn', shapes: 'simple', options: 2, timeLimitMs: null })
    expect(rotationLevel(1).angles.every((a) => a === 45 || a === 90)).toBe(true)
  })

  it('gets harder: options never shrink and timers only appear from level 4', () => {
    for (let l = 2; l <= 10; l++) expect(rotationLevel(l).options).toBeGreaterThanOrEqual(rotationLevel(l - 1).options === 4 ? 3 : rotationLevel(l - 1).options)
    expect([1, 2, 3].every((l) => rotationLevel(l).timeLimitMs === null)).toBe(true)
  })

  it('every shape is chiral and has no turning symmetry (so wrong options always look different)', () => {
    for (const shape of [...SIMPLE_SHAPES, ...COMPLEX_SHAPES] as FlatShape[]) {
      const turns = allTurns(shape.cells)
      expect(new Set(turns).size, `${shape.id} turning symmetry`).toBe(4)
      expect(turns.includes(canon(mirror(shape.cells))), `${shape.id} mirror = a turn`).toBe(false)
    }
  })
})

describe('flat trials', () => {
  it('always has exactly one correct option and the right number of distinct options', () => {
    for (const level of [1, 2, 3, 4, 5, 6, 9]) {
      const rng = seeded(level * 7)
      for (let i = 0; i < 200; i++) {
        const trial = buildFlatTrial(rotationLevel(level), rng)
        expect(trial.options).toHaveLength(rotationLevel(level).options)
        const correct = trial.options[trial.correctIndex]!
        expect(correct.mirrored).toBe(false)
        if (trial.family === 'turn') expect(sameView(correct, { angle: trial.angle, mirrored: false })).toBe(true)
        for (let a = 0; a < trial.options.length; a++)
          for (let b = a + 1; b < trial.options.length; b++) expect(sameView(trial.options[a]!, trial.options[b]!)).toBe(false)
        if (trial.family === 'match') expect(trial.options.filter((o) => !o.mirrored)).toHaveLength(1)
      }
    }
  })
})

// The animated explanation must turn the cube exactly as the answer says.
type Vec = [number, number, number]
const NORMALS: Record<Face, Vec> = { front: [0, 0, 1], back: [0, 0, -1], right: [1, 0, 0], left: [-1, 0, 0], top: [0, -1, 0], bottom: [0, 1, 0] }
function rotate([x, y, z]: Vec, { x: ax, y: ay }: { x: number; y: number }): Vec {
  const r = (d: number): number => (d * Math.PI) / 180
  // CSS rotateX then rotateY as separate turns (only one is non-zero here).
  const [x1, y1, z1] = [x, y * Math.cos(r(ax)) - z * Math.sin(r(ax)), y * Math.sin(r(ax)) + z * Math.cos(r(ax))]
  return [x1 * Math.cos(r(ay)) + z1 * Math.sin(r(ay)), y1, -x1 * Math.sin(r(ay)) + z1 * Math.cos(r(ay))].map((v) => Math.round(v)) as Vec
}
function faceOf(v: Vec): Face {
  return (Object.entries(NORMALS) as [Face, Vec][]).find(([, n]) => n.every((c, i) => c === v[i]))![0]
}

describe('cube trials', () => {
  const state: CubeState = { top: 'red', bottom: 'blue', front: 'green', back: 'yellow', left: 'purple', right: 'orange' }

  it('the CSS turn used for the explanation moves faces exactly like the answer key', () => {
    for (const turn of ['yaw-right', 'yaw-left', 'yaw-180', 'flip-upside-down'] as RotationType[]) {
      const after = applyRotation(turn, state)
      for (const face of Object.keys(NORMALS) as Face[]) {
        const movedTo = faceOf(rotate(NORMALS[face], cubeTurnCss(turn)))
        expect(after[movedTo], `${turn}: ${face} → ${movedTo}`).toBe(state[face])
      }
    }
  })

  it('asks about a face whose colour changed, with one correct colour among distinct options', () => {
    const rng = seeded(3)
    for (const level of [7, 8, 10]) {
      for (let i = 0; i < 100; i++) {
        const trial = buildCubeTrial(rotationLevel(level), rng)
        const final = trial.turns.reduce((s, t) => applyRotation(t, s), trial.initial)
        expect(trial.options[trial.correctIndex]).toBe(final[trial.askFace])
        expect(new Set(trial.options).size).toBe(trial.options.length)
        expect(trial.options).toHaveLength(rotationLevel(level).options)
        expect(trial.turns).toHaveLength(level === 10 ? 2 : 1)
      }
    }
  })

  it('buildTrial picks the family for the level', () => {
    expect(buildTrial(1).family).toBe('turn')
    expect(buildTrial(6).family).toBe('match')
    expect(buildTrial(8).family).toBe('cube')
  })

  it('scores only correct answers, more for higher levels and quick answers', () => {
    expect(trialPoints(1, false, 1000)).toBe(0)
    expect(trialPoints(1, true, 9000)).toBe(12)
    expect(trialPoints(5, true, 2000)).toBe(23)
  })
})
