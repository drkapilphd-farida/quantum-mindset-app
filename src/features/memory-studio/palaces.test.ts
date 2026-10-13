import { describe, expect, it } from 'vitest'
import { cleanStations, MAX_STATIONS, MIN_STATIONS, palaceLevel, pickPalaceRound, STATION_SUGGESTIONS } from './palaces'

const rng = (n: number): number => Math.floor(Math.random() * n)

describe('personal palaces', () => {
  it('suggested stations: at least 10 per kind, the same number in English and Hindi', () => {
    for (const kind of ['home', 'school', 'route'] as const) {
      expect(STATION_SUGGESTIONS[kind].en.length).toBeGreaterThanOrEqual(MIN_STATIONS)
      expect(STATION_SUGGESTIONS[kind].hi).toHaveLength(STATION_SUGGESTIONS[kind].en.length)
      expect(new Set(STATION_SUGGESTIONS[kind].en).size).toBe(STATION_SUGGESTIONS[kind].en.length)
    }
  })
  it('stations are trimmed, empty ones dropped, long ones cut to 40 characters', () => {
    expect(cleanStations(['  Door ', '', '   ', 'x'.repeat(60)])).toEqual(['Door', 'x'.repeat(40)])
  })
  it('levels use 5 → 20 stations, never more than the palace has; pictures up to level 5', () => {
    expect(palaceLevel(1, 12)).toEqual({ count: 5, pictures: true, choices: 4 })
    expect(palaceLevel(10, MAX_STATIONS).count).toBe(20)
    expect(palaceLevel(10, 12).count).toBe(12)
    expect(palaceLevel(6, 20).pictures).toBe(false)
  })
  it('a round puts one distinct item on each station, and every question has its answer', () => {
    for (let level = 1; level <= 10; level++) {
      const r = pickPalaceRound(level, 14, [], rng)
      expect(r.items).toHaveLength(palaceLevel(level, 14).count)
      expect(new Set(r.items.map((i) => i.id)).size).toBe(r.items.length)
      r.questions.forEach((q, i) => {
        expect(q.station).toBe(i)
        expect(q.answer).toBe(r.items[i]!.id)
        expect(q.options).toContain(q.answer)
        expect(new Set(q.options).size).toBe(q.options.length)
      })
    }
  })
})
