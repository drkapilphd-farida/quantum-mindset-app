import { describe, expect, it, vi } from 'vitest'

// "Give full access" must switch the program on for an existing account and
// then run the access check, returning its verdict to the admin page.

async function load(options: { userId: string | null; subError?: boolean }): Promise<{ actions: typeof import('./actions'); upserts: unknown[]; inserts: Record<string, unknown>[]; verified: string[] }> {
  const upserts: unknown[] = []
  const inserts: Record<string, unknown>[] = []
  const verified: string[] = []
  vi.resetModules()
  vi.doMock('next/cache', () => ({ revalidatePath: () => undefined }))
  vi.doMock('@/features/live-classes/admin/data', () => ({ currentAdminEmail: () => Promise.resolve('admin@example.com') }))
  vi.doMock('./verifyAccess', () => ({
    lookupAccount: () => Promise.resolve({ ok: true, userId: options.userId }),
    verifyLearnerAccess: (email: string) => {
      verified.push(email)
      return Promise.resolve({ ok: true, when: options.userId ? 'now' : 'first-sign-in', text: '✅ Access verified' })
    },
  }))
  vi.doMock('@/lib/supabase/service', () => ({
    createServiceClient: () => ({
      from: (table: string) => {
        if (table === 'plans') return { select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: { id: 'plan-program' } }) }) }) }
        if (table === 'masterclass_payments') {
          const b = { eq: () => b, is: () => b, ilike: () => b, limit: () => Promise.resolve({ data: [] }) }
          return {
            select: () => b,
            insert: (row: Record<string, unknown>) => {
              inserts.push(row)
              return Promise.resolve({ error: null })
            },
          }
        }
        if (table === 'subscriptions')
          return {
            upsert: (row: unknown) => {
              upserts.push(row)
              return Promise.resolve({ error: options.subError ? { code: 'XX' } : null })
            },
          }
        throw new Error(`unexpected table ${table}`)
      },
    }),
  }))
  return { actions: await import('./actions'), upserts, inserts, verified }
}

const input = { email: ' Parent@Example.com ', amountInr: 2999, mode: 'gpay', paidOn: '2026-11-01', offer: 'parent_2999' }

describe('recordManualEnrolment ("Give full access")', () => {
  it('existing account: program switched on (active, not canceled) and access verified', async () => {
    const { actions, upserts, inserts, verified } = await load({ userId: 'u1' })
    const res = await actions.recordManualEnrolment(input)
    expect(upserts).toEqual([expect.objectContaining({ user_id: 'u1', plan_id: 'plan-program', status: 'active', canceled_at: null })])
    expect(inserts[0]).toMatchObject({ user_id: 'u1', email: 'parent@example.com', source: 'manual' })
    expect(inserts[0]).not.toHaveProperty('batch_start')
    expect(verified).toEqual(['parent@example.com'])
    expect(res).toMatchObject({ ok: true, access: { ok: true, when: 'now' } })
  })

  it('no account yet: payment left open for first sign-in, and still verified', async () => {
    const { actions, upserts, inserts, verified } = await load({ userId: null })
    const res = await actions.recordManualEnrolment(input)
    expect(upserts).toEqual([])
    expect(inserts[0]).not.toHaveProperty('granted_at')
    expect(verified).toEqual(['parent@example.com'])
    expect(res).toMatchObject({ ok: true, access: { ok: true, when: 'first-sign-in' } })
  })

  it('if switching access on fails, the admin still gets the access check', async () => {
    const { actions, verified } = await load({ userId: 'u1', subError: true })
    const res = await actions.recordManualEnrolment(input)
    expect(res.ok).toBe(false)
    expect(verified).toEqual(['parent@example.com'])
    expect(res.access).toBeDefined()
  })
})
