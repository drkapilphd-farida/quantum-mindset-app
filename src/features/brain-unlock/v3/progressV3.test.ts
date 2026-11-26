import { describe, expect, it } from 'vitest'
import { MEMORY_SETS, RSVP_PASSAGES } from './content'
import { checkedResults, gridSeconds, progressFactsV3, roleForPlayer, scoreFor, V3RawSchema, type V3Raw } from './progressV3'

const set = MEMORY_SETS[0]!
const passage = RSVP_PASSAGES[0]!
const full: V3Raw = {
  player: 'child',
  firstName: 'Riya',
  round1: { ms: 38_000, errors: 1 },
  breathsSkipped: false,
  round2: { ms: 30_100, errors: 0 },
  memorySetId: set.id,
  memoryPicked: [...set.shown.slice(0, 5).map((i) => i.id), set.distractors[0]!.id],
  rsvpPassageId: passage.id,
  rsvpAnswer: passage.question.en.answer,
}

describe('v3 progress', () => {
  it('adds +1 s per wrong tap and rounds to one decimal', () => {
    expect(gridSeconds({ ms: 38_000, errors: 1 })).toBe(39)
    expect(gridSeconds({ ms: 399, errors: 0 })).toBe(0.4)
  })

  it('maps child/student → student and adult → professional', () => {
    expect(roleForPlayer('child')).toBe('student')
    expect(roleForPlayer('student')).toBe('student')
    expect(roleForPlayer('adult')).toBe('professional')
  })

  it('checks memory and reading against the content, not the page', () => {
    expect(checkedResults(full)).toEqual({ memoryHits: 5, memoryFalse: 1, rsvpCorrect: true })
    expect(checkedResults({ ...full, rsvpAnswer: (passage.question.en.answer + 1) % 3 }).rsvpCorrect).toBe(false)
    expect(checkedResults({ ...full, memorySetId: 'nope' }).memoryHits).toBe(0)
  })

  it('after round 1 only: round 1 time and a v2-shaped focus "before"', () => {
    const f = progressFactsV3(full, 1)
    expect(f).toEqual({ v: 3, role: 'child', round1_s: 39, focus: { before: 39 } })
  })

  it('after round 2: the focus before → after and the boost', () => {
    const f = progressFactsV3(full, 4)
    expect(f.round2_s).toBe(30.1)
    expect(f.focus).toEqual({ before: 39, after: 30.1 })
    expect(f.boost_pct).toBe(23)
    expect(f.memory_hits).toBeUndefined()
  })

  it('at 6 (the result screen): every number and the total score', () => {
    const f = progressFactsV3(full, 6)
    expect(f.memory_hits).toBe(5)
    expect(f.memory_false).toBe(1)
    expect(f.rsvp_wpm).toBe(350)
    expect(f.rsvp_correct).toBe(true)
    expect(f.score_total).toBe(scoreFor(full).total)
  })

  it('skipped breaths: no boost number is sent', () => {
    expect(progressFactsV3({ ...full, breathsSkipped: true }, 4).boost_pct).toBeNull()
  })

  it('rejects malformed input at the boundary', () => {
    expect(V3RawSchema.safeParse({ ...full, round1: { ms: -1, errors: 0 } }).success).toBe(false)
    expect(V3RawSchema.safeParse({ ...full, firstName: 'x'.repeat(31) }).success).toBe(false)
    expect(V3RawSchema.safeParse({ ...full, player: 'parent' }).success).toBe(false)
    expect(V3RawSchema.safeParse(full).success).toBe(true)
  })
})
