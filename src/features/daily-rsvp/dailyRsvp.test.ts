import { describe, expect, it } from 'vitest'
import {
  clampRsvpWpm,
  dailyRsvpGrowth,
  measuredWpm,
  nextWpmAfter,
  oneResultPerDay,
  retentionPercent,
  startingWpm,
  stepRsvpWpm,
  suggestedWpm,
} from './dailyRsvp'
import { dailyRsvpPassage, dailyRsvpPassages } from './passages'
import { rsvpWords } from '@/features/brain-unlock/rsvp'

describe('speed rule', () => {
  it('starts at 1.2 × the Day 1 test speed, within 180–400, or 200 without a test', () => {
    expect(startingWpm(null)).toBe(200)
    expect(startingWpm(200)).toBe(240)
    expect(startingWpm(100)).toBe(180)
    expect(startingWpm(500)).toBe(400)
  })

  it('+25 at 70% or more, same at 50–69%, −25 below 50%', () => {
    expect(nextWpmAfter({ wpm: 250, retentionPercent: 100 })).toBe(275)
    expect(nextWpmAfter({ wpm: 250, retentionPercent: 70 })).toBe(275)
    expect(nextWpmAfter({ wpm: 250, retentionPercent: 67 })).toBe(250)
    expect(nextWpmAfter({ wpm: 250, retentionPercent: 33 })).toBe(225)
    expect(nextWpmAfter({ wpm: 150, retentionPercent: 0 })).toBe(150)
  })

  it('builds on the speed the words were shown at, not the slightly lower measured speed', () => {
    expect(nextWpmAfter({ wpm: 198, targetWpm: 225, retentionPercent: 67 })).toBe(225)
    expect(nextWpmAfter({ wpm: 198, targetWpm: 225, retentionPercent: 100 })).toBe(250)
    expect(suggestedWpm([{ day: 1, wpm: 198, targetWpm: 225, retentionPercent: 67 }], 2, null)).toBe(225)
  })

  it('suggests from the latest earlier day only', () => {
    const history = [
      { day: 1, wpm: 200, retentionPercent: 100 },
      { day: 2, wpm: 225, retentionPercent: 33 },
      { day: 3, wpm: 300, retentionPercent: 100 },
    ]
    expect(suggestedWpm(history, 3, null)).toBe(200)
    expect(suggestedWpm(history, 4, null)).toBe(325)
    expect(suggestedWpm([], 1, 200)).toBe(240)
  })

  it('keeps − / + within 150–800', () => {
    expect(stepRsvpWpm(150, -1)).toBe(150)
    expect(stepRsvpWpm(800, 1)).toBe(800)
    expect(stepRsvpWpm(250, 1)).toBe(275)
    expect(clampRsvpWpm(Number.NaN)).toBe(200)
  })
})

describe('results', () => {
  it('measures speed from words and active time, ignoring a too-short time', () => {
    expect(measuredWpm(150, 30_000, 250)).toBe(300)
    expect(measuredWpm(150, 500, 250)).toBe(250)
  })

  it('retention is the share of questions right', () => {
    expect(retentionPercent(3, 3)).toBe(100)
    expect(retentionPercent(2, 3)).toBe(67)
    expect(retentionPercent(0, 3)).toBe(0)
    expect(retentionPercent(1, 0)).toBe(0)
  })

  it('keeps the latest play of each day and reports growth since the first day', () => {
    const rows = oneResultPerDay([
      { day: 1, wpm: 200, retentionPercent: 67, playedAt: '2026-11-01T10:00:00Z' },
      { day: 1, wpm: 210, retentionPercent: 100, playedAt: '2026-11-01T11:00:00Z' },
      { day: 2, wpm: 250, retentionPercent: 100, playedAt: '2026-11-02T10:00:00Z' },
    ])
    expect(rows).toEqual([
      { day: 1, wpm: 210, retentionPercent: 100 },
      { day: 2, wpm: 250, retentionPercent: 100 },
    ])
    expect(dailyRsvpGrowth(rows)).toMatchObject({ firstWpm: 210, latestWpm: 250, wpmGain: 40, wpmGainPercent: 19 })
    expect(dailyRsvpGrowth([])).toBeNull()
  })
})

describe('passages', () => {
  for (const lang of ['en', 'hi'] as const) {
    it(`${lang}: one passage for every day 1–30, each with 3 valid questions`, () => {
      const list = dailyRsvpPassages(lang)
      expect(list.map((p) => p.day)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
      for (const p of list) {
        expect(p.questions, `day ${p.day}`).toHaveLength(3)
        for (const q of p.questions) {
          expect(q.options.length, `day ${p.day}`).toBe(3)
          expect(q.answer, `day ${p.day}`).toBeGreaterThanOrEqual(0)
          expect(q.answer, `day ${p.day}`).toBeLessThan(q.options.length)
          expect(new Set(q.options).size, `day ${p.day}`).toBe(q.options.length)
        }
      }
    })

    it(`${lang}: passages get a little longer through the month`, () => {
      const words = (day: number): number => rsvpWords(dailyRsvpPassage(day, lang).text).length
      for (let day = 1; day <= 30; day++) {
        expect(words(day), `day ${day}`).toBeGreaterThanOrEqual(85)
        expect(words(day), `day ${day}`).toBeLessThanOrEqual(240)
      }
      const avg = (from: number, to: number): number => {
        let sum = 0
        for (let d = from; d <= to; d++) sum += words(d)
        return sum / (to - from + 1)
      }
      expect(avg(21, 30)).toBeGreaterThan(avg(1, 10))
    })
  }

  it('the same day asks the same questions in English and Hindi (same correct option)', () => {
    for (let day = 1; day <= 30; day++) {
      const en = dailyRsvpPassage(day, 'en').questions.map((q) => q.answer)
      const hi = dailyRsvpPassage(day, 'hi').questions.map((q) => q.answer)
      expect(hi, `day ${day}`).toEqual(en)
    }
  })

  it('an unknown day falls back to Day 1', () => {
    expect(dailyRsvpPassage(0, 'en').day).toBe(1)
    expect(dailyRsvpPassage(31, 'hi').day).toBe(1)
  })
})
