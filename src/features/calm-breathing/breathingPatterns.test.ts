import { describe, expect, it } from 'vitest'
import { BREATH_PATTERNS, breathPattern, breathSync, breathsPerMinute, PHASE_GRACE_MS } from './breathingPatterns'

describe('calm breathing patterns', () => {
  it('has 10 levels; level 1 is short and easy, out-breath always ≥ in-breath', () => {
    expect(Object.keys(BREATH_PATTERNS)).toHaveLength(10)
    expect(breathPattern(1)).toMatchObject({ inMs: 3000, outMs: 4000, holdMs: 0 })
    for (const p of Object.values(BREATH_PATTERNS)) {
      expect(p.outMs).toBeGreaterThanOrEqual(p.inMs)
      expect(p.holdMs).toBeLessThanOrEqual(2000)
    }
  })

  it('the classic 4–6 rhythm is level 4', () => {
    expect(breathPattern(4)).toMatchObject({ inMs: 4000, outMs: 6000 })
    expect(breathsPerMinute(breathPattern(4))).toBe(6)
  })

  it('gets slower (calmer) as levels rise', () => {
    for (let level = 2; level <= 10; level++) expect(breathsPerMinute(breathPattern(level))).toBeLessThanOrEqual(breathsPerMinute(breathPattern(level - 1)))
  })

  it('clamps unknown levels', () => {
    expect(breathPattern(0)).toEqual(breathPattern(1))
    expect(breathPattern(99)).toEqual(breathPattern(10))
  })

  it('measures rhythm, ignoring the first moment of each phase', () => {
    const late = { expectPressed: true, pressed: false, msIntoPhase: PHASE_GRACE_MS - 100 }
    const ok = { expectPressed: true, pressed: true, msIntoPhase: 2000 }
    const off = { expectPressed: false, pressed: true, msIntoPhase: 2000 }
    expect(breathSync([late, ok, ok, ok])).toBe(1)
    expect(breathSync([ok, off])).toBe(0.5)
    expect(breathSync([late])).toBe(0)
  })
})
