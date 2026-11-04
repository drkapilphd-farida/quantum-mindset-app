import { afterEach, describe, expect, it, vi } from 'vitest'
import { accessVerdict } from './rules'

// "Give full access" must end in a real, verified result — never a silent
// write. These run the app's own getIsPaidUser against a fake database.

type World = {
  lookup: { userId: string | null } | 'error'
  /** Subscriptions as getIsPaidUser sees them (active/trialing only). */
  subscriptions: { status: string; interval: string; periodEnd: string | null }[]
  /** Unclaimed, unrefunded payments for the email. */
  openPayments: number
  bannedUntil?: string
  /** What claim_pending_access does: moves open payments into an active lifetime subscription. */
  claimWorks?: boolean
}

function fakeDb(world: World): { db: unknown; claims: string[] } {
  const claims: string[] = []
  const active = (): World['subscriptions'] => world.subscriptions.filter((s) => s.status === 'active' || s.status === 'trialing')
  const db = {
    rpc: (name: string, args: Record<string, unknown>) => {
      if (name === 'user_id_by_email') return Promise.resolve(world.lookup === 'error' ? { data: null, error: { code: 'XX' } } : { data: world.lookup.userId, error: null })
      if (name === 'claim_pending_access') {
        claims.push(String(args.p_user))
        if (world.claimWorks && world.openPayments > 0) {
          const n = world.openPayments
          world.openPayments = 0
          world.subscriptions.push({ status: 'active', interval: 'lifetime', periodEnd: null })
          return Promise.resolve({ data: n })
        }
        return Promise.resolve({ data: 0 })
      }
      throw new Error(`unexpected rpc ${name}`)
    },
    auth: { admin: { getUserById: () => Promise.resolve({ data: { user: { banned_until: world.bannedUntil } } }) } },
    from: (table: string) => {
      if (table === 'subscriptions') {
        return {
          select: (cols: string) => ({
            eq: () =>
              cols.includes('billing_interval')
                ? { in: () => Promise.resolve({ data: active().map((s) => ({ plan_id: 'p', current_period_end: s.periodEnd, plans: { billing_interval: s.interval } })) }) }
                : { eq: () => ({ maybeSingle: () => Promise.resolve({ data: world.subscriptions[0] ? { status: world.subscriptions[0].status } : null }) }) },
          }),
        }
      }
      if (table === 'masterclass_payments') {
        const b = { is: () => b, ilike: () => Promise.resolve({ count: world.openPayments }) }
        return { select: () => b }
      }
      throw new Error(`unexpected table ${table}`)
    },
  }
  return { db, claims }
}

async function verify(world: World): Promise<{ verdict: Awaited<ReturnType<typeof import('./verifyAccess').verifyLearnerAccess>>; claims: string[] }> {
  vi.resetModules()
  const { db, claims } = fakeDb(world)
  vi.doMock('@/lib/supabase/service', () => ({ createServiceClient: () => db }))
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(db) }))
  const { verifyLearnerAccess } = await import('./verifyAccess')
  return { verdict: await verifyLearnerAccess('  Parent@Example.com '), claims }
}

describe('verifyLearnerAccess (the check after "Give full access")', () => {
  afterEach(() => vi.doUnmock('@/lib/supabase/service'))

  it('existing account with the program on → ✅ verified now', async () => {
    const { verdict } = await verify({ lookup: { userId: 'u1' }, subscriptions: [{ status: 'active', interval: 'lifetime', periodEnd: null }], openPayments: 0 })
    expect(verdict).toMatchObject({ ok: true, when: 'now' })
    expect(verdict.text).toContain('✅ Access verified')
  })

  it('existing account whose payment is still open → claims it (as the app does) → ✅ verified now', async () => {
    const { verdict, claims } = await verify({ lookup: { userId: 'u1' }, subscriptions: [], openPayments: 1, claimWorks: true })
    expect(claims).toEqual(['u1'])
    expect(verdict).toMatchObject({ ok: true, when: 'now' })
  })

  it('no account yet, open payment waiting → ✅ verified for first sign-in', async () => {
    const { verdict } = await verify({ lookup: { userId: null }, subscriptions: [], openPayments: 1 })
    expect(verdict).toMatchObject({ ok: true, when: 'first-sign-in' })
    expect(verdict.text).toContain('parent@example.com')
  })

  it('no account and nothing to claim → red', async () => {
    expect((await verify({ lookup: { userId: null }, subscriptions: [], openPayments: 0 })).verdict.ok).toBe(false)
  })

  it('subscription not active (e.g. canceled) → red with the status', async () => {
    const { verdict } = await verify({ lookup: { userId: 'u1' }, subscriptions: [{ status: 'canceled', interval: 'lifetime', periodEnd: null }], openPayments: 0 })
    expect(verdict.ok).toBe(false)
    expect(verdict.text).toContain('canceled')
  })

  it('blocked login → red even if paid', async () => {
    const { verdict } = await verify({ lookup: { userId: 'u1' }, subscriptions: [{ status: 'active', interval: 'lifetime', periodEnd: null }], openPayments: 0, bannedUntil: '2999-01-01T00:00:00Z' })
    expect(verdict.ok).toBe(false)
    expect(verdict.text).toMatch(/blocked/)
  })

  it('account lookup fails → red, never a false ✅', async () => {
    expect((await verify({ lookup: 'error', subscriptions: [], openPayments: 1 })).verdict.ok).toBe(false)
  })
})

describe('accessVerdict', () => {
  it('only two outcomes are green: paid now, or a claimable payment with no account yet', () => {
    expect(accessVerdict({ account: 'found', paid: true, blocked: false, programSubscription: { status: 'active' } }, 'a@b.c').ok).toBe(true)
    expect(accessVerdict({ account: 'none', pendingPayment: true }, 'a@b.c').ok).toBe(true)
    expect(accessVerdict({ account: 'found', paid: false, blocked: false, programSubscription: { status: 'active' } }, 'a@b.c').ok).toBe(false)
    expect(accessVerdict({ account: 'found', paid: false, blocked: false, programSubscription: null }, 'a@b.c').ok).toBe(false)
    expect(accessVerdict({ account: 'none', pendingPayment: false }, 'a@b.c').ok).toBe(false)
    expect(accessVerdict({ account: 'lookup-failed' }, 'a@b.c').ok).toBe(false)
  })
})
