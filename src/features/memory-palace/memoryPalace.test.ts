import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import {
  applyPalaceSession,
  buildChoices,
  decodeObjects,
  encodeObjects,
  levelConfig,
  lookalikesOf,
  nextDayRecallStatus,
  PALACE_OBJECTS,
  PALACE_PLACE_LINE_IDS,
  pickObjects,
} from './memoryPalace'

const seeded = (seed: number): (() => number) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('objects, places and script', () => {
  it('has 40 objects with an icon file each, and 10 places', () => {
    expect(PALACE_OBJECTS).toHaveLength(40)
    expect(PALACE_PLACE_LINE_IDS).toHaveLength(10)
    for (const o of PALACE_OBJECTS) expect(fs.existsSync(path.join(process.cwd(), 'public', o.icon)), o.icon).toBe(true)
  })

  it('every language script has the same 67 line ids, including every object and place', () => {
    const ids = (lang: string): string[] => JSON.parse(fs.readFileSync(path.join(__dirname, 'script', `${lang}.json`), 'utf8')).lines.map((l: { id: string }) => l.id)
    const en = ids('en')
    expect(en).toHaveLength(67)
    for (const o of PALACE_OBJECTS) expect(en).toContain(o.lineId)
    for (const p of PALACE_PLACE_LINE_IDS) expect(en).toContain(p)
    for (const lang of ['hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn']) expect(ids(lang), lang).toEqual(en)
  })

  it('look-alikes are real objects and never the object itself', () => {
    for (const o of PALACE_OBJECTS) for (const l of lookalikesOf(o.id)) {
      expect(l).not.toBe(o.id)
      expect(PALACE_OBJECTS.some((x) => x.id === l)).toBe(true)
    }
  })
})

describe('levels', () => {
  it('starts with 5 places and grows to 10', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((l) => levelConfig(l).places)).toEqual([5, 5, 5, 6, 7, 8, 8, 9, 10, 10])
    expect(levelConfig(6).lookalikes).toBe(false)
    expect(levelConfig(7).lookalikes).toBe(true)
    expect(levelConfig(10).choices).toBe(6)
  })

  it('two sessions at 80%+ in a row move up; one under 50% moves down; never below 1', () => {
    let s = { level: 1, goodRun: 0, poorRun: 0 }
    s = applyPalaceSession(s, 0.8)
    expect(s.level).toBe(1)
    s = applyPalaceSession(s, 1)
    expect(s.level).toBe(2)
    s = applyPalaceSession(s, 0.6)
    expect(s).toEqual({ level: 2, goodRun: 0, poorRun: 0 })
    s = applyPalaceSession(s, 0.4)
    expect(s.level).toBe(1)
    expect(applyPalaceSession(s, 0).level).toBe(1)
  })

  it('a middling session breaks the run of good ones', () => {
    let s = { level: 3, goodRun: 0, poorRun: 0 }
    s = applyPalaceSession(s, 0.9)
    s = applyPalaceSession(s, 0.7)
    s = applyPalaceSession(s, 0.9)
    expect(s.level).toBe(3)
  })
})

describe('objects and choices', () => {
  it('never repeats objects inside a palace and avoids the previous palace', () => {
    const previous = pickObjects(10, [], seeded(1))
    const next = pickObjects(10, previous, seeded(2))
    expect(new Set(next).size).toBe(10)
    expect(next.filter((id) => previous.includes(id))).toEqual([])
  })

  it('builds the right number of choices, always including the answer once', () => {
    for (const level of [1, 7, 10]) {
      const config = levelConfig(level)
      const choices = buildChoices('2-03', config, seeded(level))
      expect(choices).toHaveLength(config.choices)
      expect(choices.filter((c) => c === '2-03')).toHaveLength(1)
      expect(new Set(choices).size).toBe(choices.length)
    }
  })

  it('from level 7 the kite comes with its look-alike, the kite string', () => {
    expect(buildChoices('2-03', levelConfig(7), seeded(3))).toContain('4-05')
  })

  it('object lists round-trip and reject anything unexpected', () => {
    const ids = ['1-01', '4-10', '2-07']
    expect(decodeObjects(encodeObjects(ids))).toEqual(ids)
    expect(encodeObjects(pickObjects(10, [])).length).toBeLessThanOrEqual(80)
    expect(decodeObjects('1-01,9-99')).toBeNull()
    expect(decodeObjects(42)).toBeNull()
  })
})

describe('next-day recall timing', () => {
  it('under 12 hours is still the same day', () => {
    expect(nextDayRecallStatus(2)).toEqual({ due: false, reason: 'too-soon' })
    expect(nextDayRecallStatus(7.9)).toEqual({ due: false, reason: 'too-soon' })
    // 11 pm palace → 7 am next day (8 h) is due: pace control opens days at midnight.
    expect(nextDayRecallStatus(8)).toMatchObject({ due: true, label: '24h' })
  })

  it('12–36 h is 24 h, 36–60 h is 48 h, then "later" up to 7 days', () => {
    expect(nextDayRecallStatus(12)).toMatchObject({ due: true, label: '24h' })
    expect(nextDayRecallStatus(25)).toMatchObject({ due: true, label: '24h' })
    expect(nextDayRecallStatus(50)).toMatchObject({ due: true, label: '48h' })
    expect(nextDayRecallStatus(24 * 4)).toMatchObject({ due: true, label: 'later', days: 4 })
    expect(nextDayRecallStatus(24 * 7)).toMatchObject({ due: true, label: 'later', days: 7 })
  })

  it('expires after 7 days', () => {
    expect(nextDayRecallStatus(24 * 7 + 1)).toEqual({ due: false, reason: 'expired' })
  })
})
