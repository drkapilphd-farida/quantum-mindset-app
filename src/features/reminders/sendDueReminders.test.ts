import { beforeEach, describe, expect, it, vi } from 'vitest'

// The 15-minute reminder job, against a small in-memory stand-in for the
// database: one reminder a day, only when practice is waiting, claimed before
// sending, in the learner's language.

type Row = Record<string, unknown>
type Tables = Record<string, Row[]>

const sent: { endpoint: string; payload: { title: string; body: string } }[] = []
let failEndpoints: Record<string, number> = {}

vi.mock('web-push', () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn((sub: { endpoint: string }, payload: string) => {
      const code = failEndpoints[sub.endpoint]
      if (code) return Promise.reject(Object.assign(new Error('push failed'), { statusCode: code }))
      sent.push({ endpoint: sub.endpoint, payload: JSON.parse(payload) })
      return Promise.resolve({})
    }),
  },
}))
const paidChecks: unknown[] = []
vi.mock('@/lib/subscription/getIsPaidUser', () => ({ getIsPaidUser: (_uid: string, client?: unknown) => (paidChecks.push(client), Promise.resolve(client !== undefined)) }))

let tables: Tables = {}
let claimConflict = false

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- a small stand-in for the Supabase query builder
function query(table: string) {
  const filters: [string, unknown][] = []
  let op: 'select' | 'insert' | 'update' | 'delete' = 'select'
  let payload: Row | null = null
  const rows = (): Row[] => (tables[table] ?? []).filter((r) => filters.every(([k, v]) => r[k] === v))
  const run = (): { data: unknown; error: unknown } => {
    if (op === 'insert') {
      if (table === 'reminder_log' && (claimConflict || (tables.reminder_log ?? []).some((r) => r.user_id === payload!.user_id && r.ist_date === payload!.ist_date && r.status === 'sent'))) {
        return { data: null, error: { code: '23505' } }
      }
      const row = { id: `id-${Math.random()}`, ...payload }
      ;(tables[table] ??= []).push(row)
      return { data: row, error: null }
    }
    if (op === 'update') {
      for (const r of rows()) Object.assign(r, payload)
      return { data: null, error: null }
    }
    if (op === 'delete') {
      const keep = (tables[table] ?? []).filter((r) => !filters.every(([k, v]) => r[k] === v))
      tables[table] = keep
      return { data: null, error: null }
    }
    return { data: rows(), error: null }
  }
  const chain = {
    select: () => chain,
    eq: (k: string, v: unknown) => (filters.push([k, v]), chain),
    is: (k: string, v: unknown) => (filters.push([k, v]), chain),
    insert: (row: Row) => ((op = 'insert'), (payload = row), chain),
    update: (row: Row) => ((op = 'update'), (payload = row), chain),
    delete: () => ((op = 'delete'), chain),
    maybeSingle: () => Promise.resolve({ ...run(), data: (run().data as Row[] | Row | null) instanceof Array ? ((run().data as Row[])[0] ?? null) : run().data }),
    single: () => Promise.resolve(run()),
    then: (resolve: (v: { data: unknown; error: unknown }) => unknown) => Promise.resolve(run()).then(resolve),
  }
  return chain
}

vi.mock('@/lib/supabase/service', () => ({ createServiceClient: () => ({ from: (t: string) => query(t) }) }))

const ist = (local: string): number => Date.parse(`${local}+05:30`)
const at = (local: string): string => new Date(ist(local)).toISOString()

function seed(over: Partial<Tables> = {}): void {
  tables = {
    reminder_settings: [{ user_id: 'u1', reminder_time: '19:00:00', push_enabled: true, admin_disabled: false }],
    reminder_log: [],
    push_subscriptions: [{ id: 's1', user_id: 'u1', endpoint: 'https://push.example/1', p256dh: 'p256dh-key-123', auth: 'auth-key-123', failed_count: 0 }],
    curriculum_day_completions: [{ user_id: 'u1', day: 5, completed_at: at('2026-10-15T20:00:00') }],
    profiles: [{ id: 'u1', preferred_language: 'hi' }],
    curriculum_pace_settings: [],
    curriculum_day_activity: [{ user_id: 'u1', day: 5, paced: true }],
    live_class_registrations: [],
    ...over,
  }
}

async function run(local: string): Promise<import('./sendDueReminders').RunSummary> {
  const { sendDueReminders } = await import('./sendDueReminders')
  return sendDueReminders(ist(local))
}

describe('sendDueReminders', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = 'pub'
    process.env.VAPID_PRIVATE_KEY = 'priv'
    process.env.VAPID_SUBJECT = 'mailto:test@example.com'
    sent.length = 0
    failEndpoints = {}
    claimConflict = false
    seed()
  })

  it('at the chosen time, with Day 6 waiting: one reminder, in the learner language', async () => {
    const summary = await run('2026-10-16T19:05:00')
    expect(summary).toMatchObject({ sent: 1, failed: 0 })
    expect(sent).toHaveLength(1)
    expect(sent[0]!.payload.body).toContain('Day 6')
    expect(sent[0]!.payload.title).toContain('डॉ. कपिल')
    expect(tables.reminder_log).toEqual([expect.objectContaining({ user_id: 'u1', ist_date: '2026-10-16', channel: 'push', kind: 'daily', status: 'sent' })])
    // A background job has no signed-in learner: enrolment must be checked with the service client.
    expect(paidChecks.at(-1)).toBeDefined()
  })

  it('never a second reminder the same day', async () => {
    await run('2026-10-16T19:05:00')
    await run('2026-10-16T19:20:00')
    expect(sent).toHaveLength(1)
  })

  it('before the chosen time: nothing', async () => {
    expect((await run('2026-10-16T18:50:00')).sent).toBe(0)
    expect(sent).toHaveLength(0)
  })

  it('today already done (next day opens at midnight): no reminder', async () => {
    seed({ curriculum_day_completions: [{ user_id: 'u1', day: 5, completed_at: at('2026-10-16T18:00:00') }] })
    expect((await run('2026-10-16T19:05:00')).sent).toBe(0)
    expect(sent).toHaveLength(0)
    expect(tables.reminder_log).toHaveLength(0)
  })

  it('a parallel run that already claimed today wins: this one sends nothing', async () => {
    claimConflict = true
    expect((await run('2026-10-16T19:05:00')).sent).toBe(0)
    expect(sent).toHaveLength(0)
  })

  it('a phone that unsubscribed (410) is forgotten and the day is logged as failed', async () => {
    failEndpoints['https://push.example/1'] = 410
    expect((await run('2026-10-16T19:05:00')).failed).toBe(1)
    expect(tables.push_subscriptions).toHaveLength(0)
    expect(tables.reminder_log?.[0]).toMatchObject({ status: 'failed' })
  })

  it('a check-in day gets the progress-test message', async () => {
    seed({ curriculum_day_completions: [{ user_id: 'u1', day: 6, completed_at: at('2026-10-15T20:00:00') }], curriculum_day_activity: [{ user_id: 'u1', day: 6, paced: true }], profiles: [{ id: 'u1', preferred_language: 'en' }] })
    await run('2026-10-16T19:05:00')
    expect(sent[0]!.payload.body).toContain('progress test (Day 7)')
    expect(tables.reminder_log?.[0]).toMatchObject({ kind: 'checkin' })
  })
})
