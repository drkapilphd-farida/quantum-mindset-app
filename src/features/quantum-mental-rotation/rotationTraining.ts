// Mental Object Rotation — 10 levels from "turn a simple flat shape a
// quarter turn, pick 1 of 2" up to "turn a coloured cube twice in your head".
//
//   Levels 1–4  flat (2D) shapes, told how to turn them; no timer until L4
//   Level 5     bigger flat shapes, 4 options
//   Level 6     "which one is the SAME shape, just turned?" (others are mirror images)
//   Levels 7–8  coloured cube, one turn: which colour ends up on a face?
//   Level 9     "same shape?" with bigger shapes
//   Level 10    coloured cube, two turns in a row
//
// Every shape is chiral (its mirror image can never be made by turning) and
// has no turning symmetry, so every wrong option is genuinely different.

import { applyRotation, buildRandomCubeState, COLOR_PALETTE, type ColorName, type CubeState, type Face, type RotationType } from './quantumMentalRotationDataset'

export type Rng = () => number

// ---- Flat shapes ---------------------------------------------------------

export type Cell = readonly [number, number]
export type FlatShape = { id: string; cells: readonly Cell[]; color: string; markCell: number }

// Cells are [column, row]. markCell = index of a cell drawn with a dot, so the
// orientation is easy to follow.
export const SIMPLE_SHAPES: readonly FlatShape[] = [
  { id: 'L4', cells: [[0, 0], [0, 1], [0, 2], [1, 2]], color: '#3b82f6', markCell: 0 },
  { id: 'J4', cells: [[1, 0], [1, 1], [1, 2], [0, 2]], color: '#22c55e', markCell: 3 },
  { id: 'P5', cells: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], color: '#f97316', markCell: 4 },
]

export const COMPLEX_SHAPES: readonly FlatShape[] = [
  { id: 'F5', cells: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], color: '#a855f7', markCell: 1 },
  { id: 'N5', cells: [[1, 0], [1, 1], [0, 2], [1, 2], [0, 3]], color: '#ef4444', markCell: 0 },
  { id: 'Y5', cells: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]], color: '#0ea5e9', markCell: 1 },
  { id: 'R6', cells: [[0, 0], [1, 0], [1, 1], [2, 1], [1, 2], [1, 3]], color: '#eab308', markCell: 0 },
]

/** A drawn option: the shape turned by `angle` degrees clockwise, optionally mirrored first. */
export type FlatView = { angle: number; mirrored: boolean }

const norm = (angle: number): number => ((Math.round(angle) % 360) + 360) % 360

export function sameView(a: FlatView, b: FlatView): boolean {
  return a.mirrored === b.mirrored && norm(a.angle) === norm(b.angle)
}

// ---- Levels -------------------------------------------------------------

export type RotationLevel = {
  family: 'turn' | 'match' | 'cube'
  shapes: 'simple' | 'complex'
  angles: readonly number[]
  options: 2 | 3 | 4
  timeLimitMs: number | null
  /** cube only */
  cubeTurns?: readonly RotationType[]
  steps?: 1 | 2
}

export const ROTATION_LEVELS: Readonly<Record<number, RotationLevel>> = {
  1: { family: 'turn', shapes: 'simple', angles: [90, 45], options: 2, timeLimitMs: null },
  2: { family: 'turn', shapes: 'simple', angles: [90, -90, 45, -45], options: 2, timeLimitMs: null },
  3: { family: 'turn', shapes: 'simple', angles: [90, -90, 180], options: 3, timeLimitMs: null },
  4: { family: 'turn', shapes: 'simple', angles: [45, 90, 135, 180, -45, -90, -135], options: 3, timeLimitMs: 20_000 },
  5: { family: 'turn', shapes: 'complex', angles: [90, -90, 135, -135, 180], options: 4, timeLimitMs: 15_000 },
  6: { family: 'match', shapes: 'simple', angles: [90, 135, 180, 225, 270], options: 3, timeLimitMs: 15_000 },
  7: { family: 'cube', shapes: 'simple', angles: [], options: 3, timeLimitMs: 15_000, cubeTurns: ['yaw-right', 'yaw-left'], steps: 1 },
  8: { family: 'cube', shapes: 'simple', angles: [], options: 4, timeLimitMs: 12_000, cubeTurns: ['yaw-right', 'yaw-left', 'yaw-180', 'flip-upside-down'], steps: 1 },
  9: { family: 'match', shapes: 'complex', angles: [45, 90, 135, 180, 225, 270, 315], options: 4, timeLimitMs: 12_000 },
  10: { family: 'cube', shapes: 'simple', angles: [], options: 4, timeLimitMs: 15_000, cubeTurns: ['yaw-right', 'yaw-left', 'yaw-180', 'flip-upside-down'], steps: 2 },
}

export function rotationLevel(level: number): RotationLevel {
  return ROTATION_LEVELS[Math.min(10, Math.max(1, Math.round(level)))] ?? ROTATION_LEVELS[1]!
}

export const TRIALS_PER_ROUND = 4
export const PRACTICE_TRIALS = 2
export const ROUNDS_PER_SESSION = 3

// ---- Trials -------------------------------------------------------------

export type FlatTrial = {
  family: 'turn' | 'match'
  shape: FlatShape
  /** turn: how far the learner must turn it (clockwise +). */
  angle: number
  options: readonly FlatView[]
  correctIndex: number
}

export type CubeTrial = {
  family: 'cube'
  initial: CubeState
  turns: readonly RotationType[]
  askFace: Face
  options: readonly ColorName[]
  correctIndex: number
}

export type RotationTrial = FlatTrial | CubeTrial

function pick<T>(values: readonly T[], rng: Rng): T {
  const v = values[Math.floor(rng() * values.length)]
  if (v === undefined) throw new Error('empty pool')
  return v
}

function shuffled<T>(values: readonly T[], rng: Rng): T[] {
  const out = [...values]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const a = out[i] as T
    out[i] = out[j] as T
    out[j] = a
  }
  return out
}

function addUnique(list: FlatView[], view: FlatView): void {
  if (!list.some((v) => sameView(v, view))) list.push(view)
}

export function buildFlatTrial(levelConfig: RotationLevel, rng: Rng): FlatTrial {
  const family = levelConfig.family === 'match' ? 'match' : 'turn'
  const shape = pick(levelConfig.shapes === 'complex' ? COMPLEX_SHAPES : SIMPLE_SHAPES, rng)
  const angle = pick(levelConfig.angles, rng)
  const correct: FlatView = { angle, mirrored: false }
  const wrong: FlatView[] = []
  if (family === 'turn') {
    // Most tempting first: the other direction (or "not turned" for a half turn), then the mirror image, then a different angle.
    addUnique(wrong, norm(angle) === 180 ? { angle: 0, mirrored: false } : { angle: -angle, mirrored: false })
    addUnique(wrong, { angle, mirrored: true })
    addUnique(wrong, { angle: angle + 90, mirrored: false })
    addUnique(wrong, { angle: angle - 90, mirrored: true })
  } else {
    // "Same shape, just turned": every wrong answer is a mirror image at some angle.
    for (const a of shuffled([angle, angle + 90, angle + 180, angle + 270, angle + 45], rng)) addUnique(wrong, { angle: a, mirrored: true })
  }
  const filtered = wrong.filter((v) => !sameView(v, correct)).slice(0, levelConfig.options - 1)
  const options = shuffled([correct, ...filtered], rng)
  return { family, shape, angle, options, correctIndex: options.findIndex((v) => sameView(v, correct)) }
}

const ASKABLE_FACES: readonly Face[] = ['front', 'top', 'right']

export function buildCubeTrial(levelConfig: RotationLevel, rng: Rng): CubeTrial {
  const pool = levelConfig.cubeTurns ?? ['yaw-right']
  const turns: RotationType[] = [pick(pool, rng)]
  if (levelConfig.steps === 2) turns.push(pick(pool, rng))
  const initial = buildRandomCubeState()
  const final = turns.reduce((state, turn) => applyRotation(turn, state), initial)
  // Ask about a face that actually changed, so the answer can't be read off the picture.
  const changed = ASKABLE_FACES.filter((f) => final[f] !== initial[f])
  const askFace = pick(changed.length > 0 ? changed : ASKABLE_FACES, rng)
  const answer = final[askFace]
  // The most tempting wrong colour: what that face shows now (before turning).
  const distractors = shuffled(
    COLOR_PALETTE.map((c) => c.name).filter((c) => c !== answer && c !== initial[askFace]),
    rng,
  )
  const wrongColours = [initial[askFace] === answer ? undefined : initial[askFace], ...distractors].filter((c): c is ColorName => c !== undefined)
  const options = shuffled([answer, ...wrongColours.slice(0, levelConfig.options - 1)], rng)
  return { family: 'cube', initial, turns, askFace, options, correctIndex: options.indexOf(answer) }
}

export function buildTrial(level: number, rng: Rng = Math.random): RotationTrial {
  const config = rotationLevel(level)
  return config.family === 'cube' ? buildCubeTrial(config, rng) : buildFlatTrial(config, rng)
}

/** Points for one answer: more for higher levels and a quick, correct answer. */
export function trialPoints(level: number, correct: boolean, answerMs: number): number {
  if (!correct) return 0
  return 10 + level * 2 + (answerMs <= 5_000 ? 3 : 0)
}

/** CSS rotation for one cube turn (verified against applyRotation's face moves). */
export function cubeTurnCss(turn: RotationType): { x: number; y: number } {
  if (turn === 'yaw-right') return { x: 0, y: 90 }
  if (turn === 'yaw-left') return { x: 0, y: -90 }
  if (turn === 'yaw-180') return { x: 0, y: 180 }
  return { x: 180, y: 0 }
}
