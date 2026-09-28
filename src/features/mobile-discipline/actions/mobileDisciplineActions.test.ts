import { beforeEach, describe, expect, it, vi } from 'vitest'

type Call = { table: string; op: string; values: Record<string, unknown> }

function makeClient(insertErrorCode: string | null = null): { calls: Call[]; client: unknown } {
  const calls: Call[] = []
  return {
    calls,
    client: {
      auth: { getUser: () => Promise.resolve({ data: { user: { id: 'user-1' } } }) },
      from: (table: string) => ({
        upsert: (values: Record<string, unknown>) => {
          calls.push({ table, op: 'upsert', values })
          return Promise.resolve({ error: null })
        },
        insert: (values: Record<string, unknown>) => {
          calls.push({ table, op: 'insert', values })
          return Promise.resolve({ error: insertErrorCode === null ? null : { code: insertErrorCode, message: 'x' } })
        },
      }),
    },
  }
}

async function importActions(client: unknown, enabled = true): Promise<typeof import('./mobileDisciplineActions')> {
  vi.resetModules()
  vi.doMock('@/lib/supabase/server', () => ({ createClient: () => Promise.resolve(client) }))
  vi.doMock('@/lib/subscription/hasQuantumSpeedReadingProAccess', () => ({ hasQuantumSpeedReadingProAccess: () => Promise.resolve(true) }))
  vi.doMock('@/config/site.config', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/config/site.config')>()
    return { ...original, appFeatures: { ...original.appFeatures, mobileDiscipline: enabled } }
  })
  return import('./mobileDisciplineActions')
}

describe('mobile discipline actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('do nothing while the feature is switched off', async () => {
    const { client, calls } = makeClient()
    const actions = await importActions(client, false)
    expect(await actions.setScreenTimeGoal({ dailyLimitMinutes: 60 })).toEqual({ ok: false, reason: 'disabled' })
    expect(await actions.saveScreenGoalCheckin({ withinGoal: true })).toEqual({ ok: false, reason: 'disabled' })
    expect(calls).toHaveLength(0)
  })

  it('saves a goal within 15–720 minutes only', async () => {
    const { client, calls } = makeClient()
    const actions = await importActions(client)
    expect(await actions.setScreenTimeGoal({ dailyLimitMinutes: 5 })).toEqual({ ok: false, reason: 'invalid_input' })
    expect(await actions.setScreenTimeGoal({ dailyLimitMinutes: 90 })).toEqual({ ok: true })
    expect(calls[0]).toMatchObject({ table: 'screen_time_goals', op: 'upsert', values: { user_id: 'user-1', daily_limit_minutes: 90 } })
  })

  it('logs a focus session only when the full time has passed', async () => {
    const { client, calls } = makeClient()
    const actions = await importActions(client)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60_000).toISOString()
    expect(await actions.logFocusSession({ plannedMinutes: 15, startedAt: tenMinutesAgo })).toEqual({ ok: false, reason: 'not_completed' })
    expect(await actions.logFocusSession({ plannedMinutes: 12, startedAt: tenMinutesAgo })).toEqual({ ok: false, reason: 'invalid_input' })
    expect(await actions.logFocusSession({ plannedMinutes: 10, startedAt: tenMinutesAgo })).toEqual({ ok: true })
    expect(calls).toHaveLength(1)
    expect(calls[0]).toMatchObject({ table: 'focus_sessions', values: { user_id: 'user-1', planned_minutes: 10 } })
  })

  it('stores the daily check-in as a screen-goal row with the India date', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-05T19:00:00Z')) // 00:30 on 6 Oct in India
    const { client, calls } = makeClient()
    const actions = await importActions(client)
    expect(await actions.saveScreenGoalCheckin({ withinGoal: false })).toEqual({ ok: true })
    expect(calls[0]).toMatchObject({ table: 'digital_detox_checkins', values: { kind: 'screen_goal', within_goal: false, check_date: '2026-10-06' } })
  })

  it('reports a second check-in on the same day instead of failing', async () => {
    const { client } = makeClient('23505')
    const actions = await importActions(client)
    expect(await actions.saveScreenGoalCheckin({ withinGoal: true })).toEqual({ ok: false, reason: 'already_checked_in' })
  })
})
