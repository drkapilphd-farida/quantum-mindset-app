import { describe, expect, it } from 'vitest'
import { accessLabel, accessOf, betterAccess, mergedDays, normaliseEmail } from './rules'

const NOW = Date.parse('2026-11-09T12:00:00Z')

describe('transfer progress — keep the better value, never lower', () => {
  it('access: lifetime beats any end date; a later end date wins; none never wins', () => {
    const lifetime = { kind: 'lifetime' } as const
    const jan = { kind: 'until', endsAt: '2027-01-12T00:00:00Z' } as const
    const feb = { kind: 'until', endsAt: '2027-02-07T18:29:59Z' } as const
    const none = { kind: 'none' } as const
    expect(betterAccess(jan, lifetime)).toEqual(lifetime)
    expect(betterAccess(lifetime, none)).toEqual(lifetime)
    expect(betterAccess(jan, feb)).toEqual(feb)
    expect(betterAccess(feb, jan)).toEqual(feb)
    expect(betterAccess(none, jan)).toEqual(jan)
    expect(betterAccess(none, none)).toEqual(none)
  })

  it('reads access the way getIsPaidUser does', () => {
    expect(accessOf([{ status: 'active', current_period_end: null, billing_interval: 'lifetime' }], NOW)).toEqual({ kind: 'lifetime' })
    expect(accessOf([{ status: 'active', current_period_end: '2027-02-07T18:29:59Z', billing_interval: 'month' }], NOW)).toEqual({ kind: 'until', endsAt: '2027-02-07T18:29:59Z' })
    expect(accessOf([{ status: 'active', current_period_end: '2026-11-01T00:00:00Z', billing_interval: 'month' }], NOW)).toEqual({ kind: 'none' })
    expect(accessOf([{ status: 'canceled', current_period_end: null, billing_interval: 'lifetime' }], NOW)).toEqual({ kind: 'none' })
    expect(accessLabel({ kind: 'until', endsAt: '2027-02-07T18:29:59Z' })).toBe('Until 7 Feb 2027')
  })

  it('plan days: the union of both accounts, in order', () => {
    expect(mergedDays([1], [])).toEqual([1])
    expect(mergedDays([1, 2, 3], [1, 4])).toEqual([1, 2, 3, 4])
  })

  it('emails compare case- and space-insensitively', () => {
    expect(normaliseEmail('  Learner@Example.COM ')).toBe('learner@example.com')
  })
})
