import { describe, expect, it } from 'vitest'
import { buildFlashMatrixRound } from './flashMatrixCategory'

describe('buildFlashMatrixRound', () => {
  it('always includes the real target text among exactly 4 unique options', () => {
    for (let i = 0; i < 30; i += 1) {
      const { target, correctOptionId, options } = buildFlashMatrixRound(new Set())
      expect(options.length).toBe(4)
      expect(new Set(options.map((o) => o.optionId)).size).toBe(4)
      expect(new Set(options.map((o) => o.displayText)).size).toBe(4)
      expect(target.optionId).toBe(correctOptionId)
    }
  })

  it('produces either a real word group (3-4 words) or a digit code (4 or 6 digits)', () => {
    for (let i = 0; i < 30; i += 1) {
      const { target } = buildFlashMatrixRound(new Set())
      if (target.monospace) {
        expect(target.displayText).toMatch(/^\d{4}$|^\d{6}$/)
      } else {
        const wordCount = target.displayText.split(' ').length
        expect(wordCount).toBeGreaterThanOrEqual(3)
        expect(wordCount).toBeLessThanOrEqual(4)
      }
    }
  })

  it('makes every decoy a genuine permutation of the same tokens as the target', () => {
    // Character-multiset equality (not exact-string inequality): a
    // digit code can rarely be generated with a repeated digit (e.g.
    // "1111"), where every "permutation" is textually identical to the
    // original — that's an inherent property of the random content, not
    // a bug, so this only asserts the token-multiset invariant that
    // always holds, not exact-string difference which would be flaky.
    for (let i = 0; i < 30; i += 1) {
      const { target, correctOptionId, options } = buildFlashMatrixRound(new Set())
      const targetTokens = [...target.displayText].sort().join('')
      const decoys = options.filter((o) => o.optionId !== correctOptionId)
      for (const decoy of decoys) {
        const decoyTokens = [...decoy.displayText].sort().join('')
        expect(decoyTokens).toBe(targetTokens)
      }
    }
  })

  it('never repeats a digit inside a digit code, so the 4 options are always 4 different orders', () => {
    // A code like "1111" has only one order, so its "decoys" were all
    // identical (seen as a rare CI failure of the first test above).
    // Enough rounds that the old generator (≈50% of 4-digit codes had a
    // repeated digit) fails this test essentially every time.
    let digitRounds = 0
    for (let i = 0; i < 400; i += 1) {
      const { target, options } = buildFlashMatrixRound(new Set())
      if (!target.monospace) continue
      digitRounds += 1
      expect(new Set(target.displayText).size).toBe(target.displayText.length)
      expect(new Set(options.map((o) => o.displayText)).size).toBe(4)
    }
    expect(digitRounds).toBeGreaterThan(0)
  })
})
