import { beforeEach, describe, expect, it, vi } from 'vitest'

type Call = { table: string; op: 'update' | 'insert'; values: Record<string, unknown> }

function makeClient(user: { id: string } | null = { id: 'user-1' }, failTable: string | null = null): {
  calls: Call[]
  client: { auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }; from: (table: string) => unknown }
} {
  const calls: Call[] = []
  const result = (table: string): { error: { message: string } | null } => ({ error: failTable === table ? { message: 'fail' } : null })
  return {
    calls,
    client: {
      auth: { getUser: () => Promise.resolve({ data: { user } }) },
      from: (table: string) => ({
        update: (values: Record<string, unknown>) => {
          calls.push({ table, op: 'update', values })
          return { eq: () => Promise.resolve(result(table)) }
        },
        insert: (values: Record<string, unknown>) => {
          calls.push({ table, op: 'insert', values })
          return Promise.resolve(result(table))
        },
      }),
    },
  }
}

async function importAction(client: ReturnType<typeof makeClient>['client']): Promise<typeof import('./saveOnboarding')> {
  vi.resetModules()
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
  return import('./saveOnboarding')
}

describe('saveOnboarding', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects unknown roles or goals before touching the database', async () => {
    const { client, calls } = makeClient()
    const { saveOnboarding } = await importAction(client)
    const result = await saveOnboarding({ mode: 'save', role: 'teacher', focus: 'focus', guardianConsent: false, lang: 'en' })
    expect(result.success).toBe(false)
    expect(calls).toHaveLength(0)
  })

  it('rejects an unauthenticated request', async () => {
    const { client } = makeClient(null)
    const { saveOnboarding } = await importAction(client)
    expect(await saveOnboarding({ mode: 'skip' })).toEqual({ success: false, error: 'Not authenticated.' })
  })

  it('records a skip without saving any answers', async () => {
    const { client, calls } = makeClient()
    const { saveOnboarding } = await importAction(client)
    expect(await saveOnboarding({ mode: 'skip' })).toEqual({ success: true })
    expect(calls).toHaveLength(1)
    expect(Object.keys(calls[0]?.values ?? {})).toEqual(['onboarding_seen_at'])
  })

  it('requires guardian consent from a parent and stores nothing without it', async () => {
    const { client, calls } = makeClient()
    const { saveOnboarding } = await importAction(client)
    const result = await saveOnboarding({ mode: 'save', role: 'parent', focus: 'exam', guardianConsent: false, lang: 'hi' })
    expect(result).toEqual({ success: false, error: 'consent_required' })
    expect(calls).toHaveLength(0)
  })

  it('stores a parent consent record with its wording version, then the answers', async () => {
    const { client, calls } = makeClient()
    const { saveOnboarding } = await importAction(client)
    const result = await saveOnboarding({ mode: 'save', role: 'parent', focus: 'exam', guardianConsent: true, lang: 'hi' })
    expect(result).toEqual({ success: true })
    expect(calls[0]).toMatchObject({ table: 'guardian_consents', op: 'insert', values: { guardian_user_id: 'user-1', context: 'onboarding', lang: 'hi' } })
    expect(String(calls[0]?.values['wording_version'])).toContain('pending-legal-review')
    expect(calls[1]).toMatchObject({ table: 'profiles', op: 'update', values: { learner_role: 'parent', learning_focus: 'exam' } })
  })

  it('does not create a consent record for a student', async () => {
    const { client, calls } = makeClient()
    const { saveOnboarding } = await importAction(client)
    expect(await saveOnboarding({ mode: 'save', role: 'student', focus: 'memory', guardianConsent: false, lang: 'en' })).toEqual({ success: true })
    expect(calls.map((c) => c.table)).toEqual(['profiles'])
  })

  it('does not save the answers when the consent record fails', async () => {
    const { client, calls } = makeClient({ id: 'user-1' }, 'guardian_consents')
    const { saveOnboarding } = await importAction(client)
    const result = await saveOnboarding({ mode: 'save', role: 'parent', focus: 'focus', guardianConsent: true, lang: 'en' })
    expect(result.success).toBe(false)
    expect(calls.map((c) => c.table)).toEqual(['guardian_consents'])
  })
})
