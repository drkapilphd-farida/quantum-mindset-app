import { describe, expect, it } from 'vitest'
import {
  boostPercent,
  boostPoints,
  brainScore,
  focusPoints,
  formatSeconds,
  memoryHitsFrom,
  memoryPoints,
  readingPoints,
  roundSeconds,
} from './score'

describe('seconds', () => {
  it('rounds to one decimal, never 0.39999', () => {
    expect(roundSeconds(0.3999999)).toBe(0.4)
    expect(roundSeconds(38.44)).toBe(38.4)
    expect(roundSeconds(38.45)).toBe(38.5)
    expect(formatSeconds(30)).toBe('30.0')
    expect(formatSeconds(Number.NaN)).toBe('0.0')
    expect(formatSeconds(-3)).toBe('0.0')
  })
})

describe('focus points (16 numbers)', () => {
  it('≤ 10 s is 25, ≥ 45 s is 5, linear in between', () => {
    expect(focusPoints(6)).toBe(25)
    expect(focusPoints(10)).toBe(25)
    expect(focusPoints(27.5)).toBe(15)
    expect(focusPoints(17)).toBe(21)
    expect(focusPoints(45)).toBe(5)
    expect(focusPoints(120)).toBe(5)
  })
  it('a missing time scores nothing', () => {
    expect(focusPoints(0)).toBe(0)
    expect(focusPoints(Number.NaN)).toBe(0)
  })
})

describe('breath boost', () => {
  it('is (t1 − t2) / t1 as a whole percent', () => {
    expect(boostPercent(40, 30, false)).toBe(25)
    expect(boostPercent(38.4, 30.1, false)).toBe(22)
  })
  it('is negative when round 2 was slower (t2 > t1)', () => {
    expect(boostPercent(30, 36, false)).toBe(-20)
    expect(boostPoints(-20)).toBe(10)
  })
  it('skipped breaths give no boost number and the floor points', () => {
    expect(boostPercent(40, 30, true)).toBeNull()
    expect(boostPoints(null)).toBe(10)
  })
  it('≥ 30 % is 25, ≤ 0 % is 10, linear in between', () => {
    expect(boostPoints(30)).toBe(25)
    expect(boostPoints(60)).toBe(25)
    expect(boostPoints(0)).toBe(10)
    expect(boostPoints(15)).toBe(17.5)
  })
})

describe('memory points', () => {
  it('7/7 with no false picks is 25', () => {
    expect(memoryPoints(7, 0)).toBe(25)
  })
  it('a false pick costs half a hit', () => {
    expect(memoryPoints(5, 2)).toBeCloseTo((4 / 7) * 25)
  })
  it('all picks wrong, and no picks at all, are 0 — never negative', () => {
    expect(memoryPoints(0, 7)).toBe(0)
    expect(memoryPoints(0, 0)).toBe(0)
  })
  it('counts hits and false picks from the ids, ignoring repeats', () => {
    expect(memoryHitsFrom(['a', 'b', 'c'], ['a', 'x', 'a', 'c'])).toEqual({ hits: 2, falsePicks: 1 })
    expect(memoryHitsFrom(['a'], [])).toEqual({ hits: 0, falsePicks: 0 })
  })
})

describe('reading points', () => {
  it('right is 18, wrong is 8', () => {
    expect(readingPoints(true)).toBe(18)
    expect(readingPoints(false)).toBe(8)
  })
})

describe('brain score', () => {
  it('adds the four parts and rounds the total', () => {
    const s = brainScore({ round1Seconds: 20, round2Seconds: 15, breathsSkipped: false, memoryHits: 5, memoryFalse: 0, rsvpCorrect: true })
    // focus 25 − 5/35 × 20 = 22.142…, boost 25 % → 22.5, memory 17.857…, reading 18
    expect(s.total).toBe(Math.round(((25 - (5 / 35) * 20 + 22.5 + (5 / 7) * 25 + 18) / 93) * 100))
    expect(s.boostPct).toBe(25)
    expect(s.strongest).toBe('focus')
    expect(s.growth).toBe('memory')
  })
  it('stays within 0–100 in the worst case', () => {
    const s = brainScore({ round1Seconds: 0, round2Seconds: 0, breathsSkipped: true, memoryHits: 0, memoryFalse: 12, rsvpCorrect: false })
    expect(s.total).toBe(19) // (focus 0 + boost floor 10 + memory 0 + reading 8) / 93 × 100 = 19.35
    expect(s.total).toBeGreaterThanOrEqual(0)
  })
  it('a perfect run is 100 (the parts add up to 93, scaled to 100)', () => {
    const s = brainScore({ round1Seconds: 15, round2Seconds: 8, breathsSkipped: false, memoryHits: 7, memoryFalse: 0, rsvpCorrect: true })
    expect(s.total).toBe(100)
  })
  it('compares only Focus and Memory: a right Reading answer is never named', () => {
    // focus 30 s → 13.57 (54 %), memory 3/7 → 10.71 (43 %), reading 18 (100 %)
    const s = brainScore({ round1Seconds: 30, round2Seconds: 30, breathsSkipped: false, memoryHits: 3, memoryFalse: 0, rsvpCorrect: true })
    expect(s.strongest).toBe('focus')
    expect(s.growth).toBe('memory')
  })
  it('Memory can be the strongest', () => {
    // focus 17 s → 21 (84 %), memory 6/7 → 21.43 (86 %)
    const s = brainScore({ round1Seconds: 20, round2Seconds: 17, breathsSkipped: false, memoryHits: 6, memoryFalse: 0, rsvpCorrect: false })
    expect(s.strongest).toBe('memory')
    expect(s.growth).toBe('focus')
  })
  it('equal Focus and Memory are "balanced": neither is named', () => {
    const s = brainScore({ round1Seconds: 12, round2Seconds: 9, breathsSkipped: false, memoryHits: 7, memoryFalse: 0, rsvpCorrect: true })
    expect(s.strongest).toBeNull()
    expect(s.growth).toBeNull()
  })
  it('skipped breaths with a faster round 2 still claim no boost — and boost is never "room to grow"', () => {
    const s = brainScore({ round1Seconds: 20, round2Seconds: 12, breathsSkipped: true, memoryHits: 6, memoryFalse: 0, rsvpCorrect: false })
    expect(s.boostPct).toBeNull()
    expect(s.boost).toBe(10)
    expect(s.strongest).toBe('focus')
    expect(s.growth).toBe('memory')
  })
})
