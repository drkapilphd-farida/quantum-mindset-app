import { describe, expect, it } from 'vitest'
import { applyRound, clampLevel, gradeRound, normaliseLevelState, START_STATE, type LevelState, type RoundGrade } from './levelEngine'

function play(state: LevelState, grades: readonly RoundGrade[]): LevelState {
  return grades.reduce((s, g) => applyRound(s, g).state, state)
}

describe('level engine', () => {
  it('everyone starts on level 1', () => {
    expect(START_STATE).toEqual({ level: 1, goodRun: 0, poorRun: 0 })
  })

  it('grades a round: good ≥ 85 %, poor < 60 %, otherwise okay', () => {
    expect(gradeRound(1)).toBe('good')
    expect(gradeRound(0.85)).toBe('good')
    expect(gradeRound(0.75)).toBe('okay')
    expect(gradeRound(0.6)).toBe('okay')
    expect(gradeRound(0.5)).toBe('poor')
  })

  it('3 good rounds in a row → level up', () => {
    const r = applyRound(play(START_STATE, ['good', 'good']), 'good')
    expect(r.change).toBe('up')
    expect(r.state).toEqual({ level: 2, goodRun: 0, poorRun: 0 })
  })

  it('an okay or poor round breaks the good run', () => {
    expect(play(START_STATE, ['good', 'good', 'okay', 'good']).level).toBe(1)
    expect(play(START_STATE, ['good', 'good', 'poor', 'good', 'good', 'good']).level).toBe(2)
  })

  it('2 poor rounds in a row → level down, never below 1', () => {
    const at4: LevelState = { level: 4, goodRun: 0, poorRun: 0 }
    const r = applyRound(applyRound(at4, 'poor').state, 'poor')
    expect(r.change).toBe('down')
    expect(r.state.level).toBe(3)
    expect(play(START_STATE, ['poor', 'poor', 'poor', 'poor']).level).toBe(1)
  })

  it('never goes above 10', () => {
    const at10: LevelState = { level: 10, goodRun: 0, poorRun: 0 }
    const r = applyRound(play(at10, ['good', 'good']), 'good')
    expect(r.change).toBeNull()
    expect(r.state.level).toBe(10)
  })

  it('runs carry over between sessions (saved state)', () => {
    const afterSession1 = play(START_STATE, ['good', 'good'])
    expect(applyRound(afterSession1, 'good').change).toBe('up')
  })

  it('a learner at ~75 % settles, one at 100 % climbs, one at 40 % drops', () => {
    // Deterministic round sequences approximating those success rates.
    expect(play({ level: 5, goodRun: 0, poorRun: 0 }, Array<RoundGrade>(12).fill('good')).level).toBe(9)
    expect(play({ level: 5, goodRun: 0, poorRun: 0 }, ['good', 'okay', 'good', 'okay', 'poor', 'good', 'okay', 'good']).level).toBe(5)
    expect(play({ level: 5, goodRun: 0, poorRun: 0 }, Array<RoundGrade>(6).fill('poor')).level).toBe(2)
  })

  it('normalises saved state defensively', () => {
    expect(normaliseLevelState(null)).toEqual(START_STATE)
    expect(normaliseLevelState({ level: 42, goodRun: 9, poorRun: -1 })).toEqual({ level: 10, goodRun: 2, poorRun: 0 })
    expect(clampLevel(Number.NaN)).toBe(1)
  })
})
