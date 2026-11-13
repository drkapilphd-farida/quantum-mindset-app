import { afterEach, describe, expect, it, vi } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { LiveClassesView } from '@/features/live-classes/actions'

// Access rules for the two plans and the recordings:
// - recordings never leave the server without Sharp Brain access;
// - self-paced learners cannot register for live classes (the Zoom link is sent on registration);
// - live learners register exactly as before.

type Tables = Record<string, { data: unknown; error: null }>

function fakeDb(tables: Tables, reads: string[], writes: { table: string; op: string; values?: unknown }[]): { from: (t: string) => unknown; rpc: () => Promise<unknown> } {
  return {
    from: (table: string) => {
      reads.push(table)
      let op = 'select'
      let values: unknown
      const result = (): { data: unknown; error: null } => (op === 'select' ? (tables[table] ?? { data: null, error: null }) : { data: null, error: null })
      const b: Record<string, unknown> = {}
      for (const m of ['select', 'eq', 'is', 'gte', 'lte', 'order', 'limit', 'in']) b[m] = () => b
      for (const m of ['insert', 'update', 'upsert', 'delete'])
        b[m] = (v?: unknown) => {
          op = m
          values = v
          writes.push({ table, op, values })
          return b
        }
      b['maybeSingle'] = () => Promise.resolve(result())
      b['single'] = () => Promise.resolve(result())
      b['then'] = (f: (r: unknown) => unknown) => Promise.resolve(result()).then(f)
      return b
    },
    rpc: () => Promise.resolve({ data: null, error: null }),
  }
}

async function setup(options: { access: boolean; payments: { plan_type: string; created_at: string; paid_on: null; refunded_at: null }[]; extra?: Tables }): Promise<{ reads: string[]; serviceReads: string[]; writes: { table: string; op: string; values?: unknown }[] }> {
  vi.resetModules()
  const reads: string[] = []
  const serviceReads: string[] = []
  const writes: { table: string; op: string; values?: unknown }[] = []
  const userTables: Tables = {
    live_class_sessions: { data: { status: 'published', starts_at: new Date(Date.now() + 86_400_000).toISOString() }, error: null },
    ...(options.extra ?? {}),
  }
  const serviceTables: Tables = {
    masterclass_payments: { data: options.payments, error: null },
    class_recordings: { data: [{ id: 'r1', class_number: 1, title: 'Foundation', class_date: '2026-11-09', youtube_id: 'dQw4w9WgXcQ', sort_order: 10, hidden: false }], error: null },
    ...(options.extra ?? {}),
  }
  vi.doMock('@/lib/subscription/hasQuantumSpeedReadingProAccess', () => ({ hasQuantumSpeedReadingProAccess: () => Promise.resolve(options.access) }))
  vi.doMock('@/lib/supabase/server', () => ({
    createClient: () => Promise.resolve({ auth: { getUser: () => Promise.resolve({ data: { user: { id: 'user-1', email: 'learner@example.com' } } }) }, ...fakeDb(userTables, reads, writes) }),
  }))
  vi.doMock('@/lib/supabase/service', () => ({ createServiceClient: () => fakeDb(serviceTables, serviceReads, writes) }))
  return { reads, serviceReads, writes }
}

const SESSION = '7f0c2f5e-9a51-4c43-9d8a-2a9c4b1f0e11'
const REC = '1f0c2f5e-9a51-4c43-9d8a-2a9c4b1f0e22'
const selfPaid = [{ plan_type: 'self_paced', created_at: new Date().toISOString(), paid_on: null, refunded_at: null }]
const livePaid = [{ plan_type: 'live', created_at: '2026-10-20T10:00:00Z', paid_on: null, refunded_at: null }]

describe('Class Recordings access', () => {
  afterEach(() => vi.restoreAllMocks())

  it('without Sharp Brain access: locked, and the recordings table is never read', async () => {
    const { serviceReads } = await setup({ access: false, payments: [] })
    const { getRecordingsView } = await import('./recordings')
    expect(await getRecordingsView()).toEqual({ access: false })
    expect(serviceReads).not.toContain('class_recordings')
  })

  it('"Mark as watched" is refused without access', async () => {
    const { writes } = await setup({ access: false, payments: [] })
    const { markRecordingWatched } = await import('./recordings')
    expect(await markRecordingWatched({ recordingId: REC })).toEqual({ ok: false, error: 'not-enrolled' })
    expect(writes).toHaveLength(0)
  })

  it('with access (live or self-paced): the recordings are shown', async () => {
    await setup({ access: true, payments: selfPaid, extra: { live_class_sessions: { data: [], error: null } } })
    const { getRecordingsView } = await import('./recordings')
    const view = await getRecordingsView()
    expect(view.access).toBe(true)
    if (view.access) expect(view.classes[0]).toMatchObject({ state: 'available', recordings: [{ youtubeId: 'dQw4w9WgXcQ' }] })
  })

  it('"Mark as watched" counts the class (a recording attendance mark)', async () => {
    const { writes } = await setup({ access: true, payments: selfPaid, extra: { class_recordings: { data: { class_number: 3, hidden: false }, error: null }, live_class_attendance: { data: null, error: null } } })
    const { markRecordingWatched } = await import('./recordings')
    expect(await markRecordingWatched({ recordingId: REC })).toEqual({ ok: true })
    expect(writes).toEqual([{ table: 'live_class_attendance', op: 'insert', values: expect.objectContaining({ user_id: 'user-1', class_number: 3, kind: 'recording', counts: true }) }])
  })
})

describe('live class registration by plan (the Zoom link is sent only after registering)', () => {
  afterEach(() => vi.restoreAllMocks())

  it('self-paced learners cannot register', async () => {
    const { writes } = await setup({ access: true, payments: selfPaid })
    const { registerForClass } = await import('@/features/live-classes/actions')
    expect(await registerForClass({ sessionId: SESSION })).toEqual({ ok: false, error: 'not-live' })
    expect(writes).toHaveLength(0)
  })

  it('existing ₹8,999 (live) buyers register exactly as before', async () => {
    const { writes } = await setup({ access: true, payments: livePaid })
    const { registerForClass } = await import('@/features/live-classes/actions')
    expect(await registerForClass({ sessionId: SESSION })).toEqual({ ok: true })
    expect(writes.map((w) => `${w.table}:${w.op}`)).toEqual(['live_class_registrations:upsert'])
  })

  it('learners with access but no payment row (e.g. a grant) stay live', async () => {
    await setup({ access: true, payments: [] })
    const { registerForClass } = await import('@/features/live-classes/actions')
    expect(await registerForClass({ sessionId: SESSION })).toEqual({ ok: true })
  })
})

describe('Live Classes page by plan', () => {
  afterEach(() => vi.restoreAllMocks())

  const session = { id: SESSION, classNumber: 2, topicOverride: null, startsAt: new Date(Date.now() + 86_400_000).toISOString(), endsAt: new Date(Date.now() + 90_000_000).toISOString(), status: 'published' as const }
  const view = (plan: 'live' | 'self_paced', upgradeEndsAtMs: number | null = null): LiveClassesView => ({ enrolled: true, sessions: [session], registeredSessionIds: [], marks: [], daysCompleted: 3, learner: { name: 'Asha', email: 'asha@example.com' }, plan, upgradeEndsAtMs })

  async function render(v: LiveClassesView): Promise<string> {
    vi.resetModules()
    vi.doMock('next/navigation', () => ({ useRouter: () => ({ refresh: () => undefined }) }))
    const { LiveClassesExperience } = await import('@/features/live-classes/components/LiveClassesExperience')
    const { LanguageProvider } = await import('@/context/LanguageContext')
    return renderToStaticMarkup(createElement(LanguageProvider, null, createElement(LiveClassesExperience, { view: v, now: Date.now() })))
  }

  it('self-paced learners see no live registration (no way to the Zoom link) and, in the first 7 days, the ₹6,000 upgrade card', async () => {
    const html = await render(view('self_paced', Date.now() + 3 * 86_400_000))
    expect(html).not.toContain('data-session-register')
    expect(html).not.toContain('upcoming-classes')
    expect(html).toContain('data-upgrade-card')
    expect(html).toContain('wa.me/919540123161')
    expect(html).toContain(encodeURIComponent('asha@example.com'))
  })

  it('after 7 days the upgrade card is gone', async () => {
    const html = await render(view('self_paced', null))
    expect(html).not.toContain('data-upgrade-card')
  })

  it('live learners see registration as before, and no upgrade card', async () => {
    const html = await render(view('live'))
    expect(html).toContain('data-session-register')
    expect(html).not.toContain('data-upgrade-card')
  })
})
