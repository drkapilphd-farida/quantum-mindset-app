import { describe, expect, it } from 'vitest'
import { scoreMemoryTest } from './scoring'

describe('Reading & Memory Test scoring', () => {
  it('effective speed = WPM × share of the 4 facts remembered', () => {
    // 220 words in 60 s = 220 WPM; 3 of 4 → 165
    expect(scoreMemoryTest({ wordCount: 220, elapsedMs: 60_000, retention: 3, memory: 5 })).toEqual({ status: 'valid', wpm: 220, retention: 3, comprehensionPercent: 75, effectiveWpm: 165, memory: 5 })
  })
  it('2 of 4 is still a result; 1 of 4 is not', () => {
    expect(scoreMemoryTest({ wordCount: 220, elapsedMs: 60_000, retention: 2, memory: 0 }).status).toBe('valid')
    expect(scoreMemoryTest({ wordCount: 220, elapsedMs: 60_000, retention: 1, memory: 8 }).status).toBe('low_comprehension')
  })
  it('over 700 WPM is never a result', () => {
    expect(scoreMemoryTest({ wordCount: 220, elapsedMs: 15_000, retention: 4, memory: 8 }).status).toBe('too_fast')
  })
  it('keeps memory within 0–8', () => {
    expect(scoreMemoryTest({ wordCount: 220, elapsedMs: 60_000, retention: 4, memory: 12 }).memory).toBe(8)
    expect(scoreMemoryTest({ wordCount: 220, elapsedMs: 60_000, retention: 4, memory: -3 }).memory).toBe(0)
  })
})
