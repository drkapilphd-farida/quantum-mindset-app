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

describe('focus points', () => {
  it('≤ 20 s is 25, ≥ 90 s is 5, linear in between', () => {
    expect(focusPoints(12)).toBe(25)
    expect(focusPoints(20)).toBe(25)
    expect(focusPoints(55)).toBe(15)
    expect(focusPoints(90)).toBe(5)
    expect(focusPoints(300)).toBe(5)
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
  it('right is 25, wrong is 12', () => {
    expect(readingPoints(true)).toBe(25)
    expect(readingPoints(false)).toBe(12)
  })
})

describe('brain score', () => {
  it('adds the four parts and rounds the total', () => {
    const s = brainScore({ round1Seconds: 40, round2Seconds: 30, breathsSkipped: false, memoryHits: 5, memoryFalse: 0, rsvpCorrect: true })
    // focus 22.142…, boost 25 % → 22.5, memory 17.857…, reading 25
    expect(s.total).toBe(Math.round(25 - (10 / 70) * 20 + 22.5 + (5 / 7) * 25 + 25))
    expect(s.boostPct).toBe(25)
    expect(s.strongest).toBe('reading')
    expect(s.growth).toBe('memory')
  })
  it('stays within 0–100 in the worst case', () => {
    const s = brainScore({ round1Seconds: 0, round2Seconds: 0, breathsSkipped: true, memoryHits: 0, memoryFalse: 12, rsvpCorrect: false })
    expect(s.total).toBe(22) // focus 0 + boost floor 10 + memory 0 + reading 12
    expect(s.total).toBeGreaterThanOrEqual(0)
  })
  it('a perfect run is 100', () => {
    const s = brainScore({ round1Seconds: 30, round2Seconds: 15, breathsSkipped: false, memoryHits: 7, memoryFalse: 0, rsvpCorrect: true })
    expect(s.total).toBe(100)
  })
  it('skipped breaths with a faster round 2 still claim no boost', () => {
    const s = brainScore({ round1Seconds: 40, round2Seconds: 20, breathsSkipped: true, memoryHits: 7, memoryFalse: 0, rsvpCorrect: true })
    expect(s.boostPct).toBeNull()
    expect(s.boost).toBe(10)
    expect(s.growth).toBe('boost')
  })
})
