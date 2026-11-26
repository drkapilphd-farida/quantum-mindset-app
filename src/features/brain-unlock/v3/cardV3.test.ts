import { describe, expect, it } from 'vitest'
import { cardRowsV3, roundsDoneV3 } from '../progressCard'
import type { V3Facts } from './progressV3'

const full: V3Facts = {
  v: 3, role: 'student', round1_s: 38.4, round2_s: 30.1, boost_pct: 22, breaths_skipped: false,
  memory_hits: 5, memory_false: 1, rsvp_wpm: 350, rsvp_correct: true, score_total: 78,
  focus: { before: 38.4, after: 30.1 },
}

describe('v3 card rows', () => {
  it('full test: focus before → after with the gain, memory x/7, reading ✓', () => {
    const rows = cardRowsV3(full, 'en')
    expect(rows.map((r) => r.main)).toEqual(['38.4s → 30.1s', '+22%', '5/7', '350 WPM ✓'])
    expect(rows[0]!.badge).toBe('+22%')
    expect(rows.every((r) => !r.pending)).toBe(true)
  })
  it('after round 1 only: the rest is "not done yet", never a made-up number', () => {
    const rows = cardRowsV3({ v: 3, role: null, round1_s: 38.4, focus: { before: 38.4 } }, 'hi')
    expect(rows[0]!.main).toBe('38.4s → ?')
    expect(rows.slice(1).every((r) => r.pending)).toBe(true)
  })
  it('skipped breaths: no boost number', () => {
    const rows = cardRowsV3({ ...full, breaths_skipped: true, boost_pct: null }, 'en')
    expect(rows[1]!.main).toBe('—')
    expect(rows[0]!.badge).toBeNull()
  })
  it('a slower round 2 shows no gain badge', () => {
    const rows = cardRowsV3({ ...full, round2_s: 41, boost_pct: -7 }, 'en')
    expect(rows[0]!.badge).toBeNull()
    expect(rows[1]!.main).toBe('-7%')
  })
  it('counts rounds done from the phases', () => {
    expect([0, 1, 3, 4, 5, 6].map(roundsDoneV3)).toEqual([0, 1, 1, 2, 3, 4])
  })
})
