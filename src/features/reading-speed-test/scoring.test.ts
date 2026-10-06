import { describe, expect, it } from 'vitest'
import { countWords, hasReachedEnd, practiceStartingPace, scoreReadingTest } from './scoring'

const minutes = (m: number): number => m * 60_000

describe('scoreReadingTest', () => {
  it('computes WPM, comprehension and Effective Speed (WPM × comprehension)', () => {
    // 320 words in 80 s = 240 WPM; 4 of 5 = 80% → 192 effective.
    expect(scoreReadingTest({ wordCount: 320, elapsedMs: 80_000, correct: 4, total: 5 })).toEqual({
      status: 'valid',
      wpm: 240,
      comprehensionPercent: 80,
      effectiveWpm: 192,
    })
  })

  it('rejects a fast "Done" without reading (over 700 WPM) — no result', () => {
    // The 975-WPM case that prompted the rebuild: 325 words in 20 s.
    const score = scoreReadingTest({ wordCount: 325, elapsedMs: 20_000, correct: 2, total: 5 })
    expect(score.wpm).toBe(975)
    expect(score.status).toBe('too_fast')
  })

  it('treats exactly 700 WPM as measurable', () => {
    expect(scoreReadingTest({ wordCount: 350, elapsedMs: minutes(0.5), correct: 5, total: 5 }).status).toBe('valid')
  })

  it('does not highlight speed below 60% comprehension (a guessing run)', () => {
    const score = scoreReadingTest({ wordCount: 320, elapsedMs: minutes(1), correct: 2, total: 5 })
    expect(score).toMatchObject({ status: 'low_comprehension', comprehensionPercent: 40 })
  })

  it('accepts exactly 60% comprehension', () => {
    expect(scoreReadingTest({ wordCount: 320, elapsedMs: minutes(1.2), correct: 3, total: 5 }).status).toBe('valid')
  })

  it('checks the speed rule before the comprehension rule', () => {
    expect(scoreReadingTest({ wordCount: 320, elapsedMs: 5_000, correct: 0, total: 5 }).status).toBe('too_fast')
  })

  it('never divides by zero or counts more answers than questions', () => {
    const score = scoreReadingTest({ wordCount: 300, elapsedMs: 0, correct: 9, total: 5 })
    expect(score.comprehensionPercent).toBe(100)
    expect(Number.isFinite(score.wpm)).toBe(true)
  })
})

describe('practiceStartingPace', () => {
  it('starts about 20% above the measured speed', () => {
    expect(practiceStartingPace(250)).toBe(300)
  })

  it('never goes below 150 or above 450 WPM', () => {
    expect(practiceStartingPace(100)).toBe(150)
    expect(practiceStartingPace(400)).toBe(450)
    expect(practiceStartingPace(700)).toBe(450)
  })
})

describe('hasReachedEnd ("Done" unlocks only after the end of the passage)', () => {
  it('is false while the end marker is below the viewport', () => {
    expect(hasReachedEnd(1400, 800)).toBe(false)
  })

  it('is true once the end marker is on screen', () => {
    expect(hasReachedEnd(760, 800)).toBe(true)
    expect(hasReachedEnd(803, 800)).toBe(true) // sub-pixel tolerance
  })
})

describe('countWords', () => {
  it('counts whitespace-separated words in English and Hindi', () => {
    expect(countWords('  one two\n\nthree  ')).toBe(3)
    expect(countWords('गाँव का पुस्तकालय')).toBe(3)
    expect(countWords('   ')).toBe(0)
  })
})

describe('Reading Profile', () => {
  it('speed bands follow effective WPM', async () => {
    const { speedBand } = await import('./scoring')
    expect(speedBand(120)).toBe('developing')
    expect(speedBand(150)).toBe('average')
    expect(speedBand(249)).toBe('average')
    expect(speedBand(250)).toBe('strong')
    expect(speedBand(350)).toBe('advanced')
  })

  it('profile type comes only from the measured pattern', async () => {
    const { readingProfile } = await import('./scoring')
    expect(readingProfile(150, 100)).toBe('careful')
    expect(readingProfile(150, 60)).toBe('careful')
    expect(readingProfile(220, 80)).toBe('innerVoice')
    expect(readingProfile(320, 60)).toBe('skimmer')
    expect(readingProfile(320, 80)).toBe('balanced')
    expect(readingProfile(280, 100)).toBe('balanced')
  })
})
