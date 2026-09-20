import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

// Subscription lapse policy test (see the "Pre-Launch Audit Fix Pass"
// task, Phase 5A) — mirrors the small `.from(table)` mocking convention
// already established in this app's other Supabase-backed action tests
// (e.g. revokeMasterclassAccess.test.ts).

type SubscriptionRow = { plan_id: string; current_period_end: string | null }
type PlanRow = { id: string; billing_interval: string }

function makeClient(subscriptions: SubscriptionRow[], plans: PlanRow[]): { from: (table: string) => unknown } {
  return {
    from: (table: string) => {
      if (table === 'subscriptions') {
        return { select: () => ({ eq: () => ({ in: () => Promise.resolve({ data: subscriptions }) }) }) }
      }
      if (table === 'plans') {
        return { select: () => ({ in: () => Promise.resolve({ data: plans }) }) }
      }
      throw new Error(`Unexpected table in test mock: ${table}`)
    },
  }
}

async function importGetIsPaidUser(client: ReturnType<typeof makeClient>): Promise<typeof import('./getIsPaidUser')> {
  vi.resetModules()
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
  return import('./getIsPaidUser')
}

const NOW = new Date('2026-09-15T00:00:00.000Z')

describe('getIsPaidUser', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is false with no active/trialing subscription at all', async () => {
    const client = makeClient([], [])
    const { getIsPaidUser } = await importGetIsPaidUser(client)

    expect(await getIsPaidUser('user-1')).toBe(false)
  })

  // The lifetime masterclass plan must NEVER be subject to this check —
  // this is the one behavior the task explicitly calls out as needing
  // confirmation, and the one regression that would be most costly:
  // silently revoking access customers paid once, in full, to keep
  // forever.
  it('a lifetime plan subscription stays paid regardless of current_period_end (past, null, or absent)', async () => {
    const pastEnd = makeClient(
      [{ plan_id: 'plan-lifetime', current_period_end: '2020-01-01T00:00:00.000Z' }],
      [{ id: 'plan-lifetime', billing_interval: 'lifetime' }],
    )
    expect(await (await importGetIsPaidUser(pastEnd)).getIsPaidUser('user-1')).toBe(true)

    const nullEnd = makeClient(
      [{ plan_id: 'plan-lifetime', current_period_end: null }],
      [{ id: 'plan-lifetime', billing_interval: 'lifetime' }],
    )
    expect(await (await importGetIsPaidUser(nullEnd)).getIsPaidUser('user-1')).toBe(true)
  })

  it('a monthly plan subscription is paid while current_period_end is still in the future', async () => {
    const client = makeClient(
      [{ plan_id: 'plan-monthly', current_period_end: '2026-10-01T00:00:00.000Z' }],
      [{ id: 'plan-monthly', billing_interval: 'month' }],
    )
    expect(await (await importGetIsPaidUser(client)).getIsPaidUser('user-1')).toBe(true)
  })

  // The actual Phase 5A behavior change: a monthly plan whose period has
  // lapsed without renewal must now read as unpaid.
  it('auto-expires a monthly plan subscription once current_period_end has passed, even with status still active/trialing', async () => {
    const client = makeClient(
      [{ plan_id: 'plan-monthly', current_period_end: '2026-08-01T00:00:00.000Z' }],
      [{ id: 'plan-monthly', billing_interval: 'month' }],
    )
    expect(await (await importGetIsPaidUser(client)).getIsPaidUser('user-1')).toBe(false)
  })

  it('a monthly plan with no recorded current_period_end is treated as a data gap, not a lapse', async () => {
    const client = makeClient([{ plan_id: 'plan-monthly', current_period_end: null }], [{ id: 'plan-monthly', billing_interval: 'month' }])
    expect(await (await importGetIsPaidUser(client)).getIsPaidUser('user-1')).toBe(true)
  })

  it('is paid if ANY one of multiple subscriptions is still valid (lapsed monthly + valid lifetime)', async () => {
    const client = makeClient(
      [
        { plan_id: 'plan-monthly', current_period_end: '2026-01-01T00:00:00.000Z' },
        { plan_id: 'plan-lifetime', current_period_end: null },
      ],
      [
        { id: 'plan-monthly', billing_interval: 'month' },
        { id: 'plan-lifetime', billing_interval: 'lifetime' },
      ],
    )
    expect(await (await importGetIsPaidUser(client)).getIsPaidUser('user-1')).toBe(true)
  })
})
