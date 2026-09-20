import { describe, expect, it } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import {
  ACTIVE_SESSION_WINDOW_MS,
  LAST_ACTIVE_THROTTLE_MS,
  decideActiveSessionAction,
  resolveActiveSession,
  type ActiveSessionRow,
} from './activeSessionGate'

// Single-Device Login Enforcement™ (see the "Pre-Launch Audit Fix Pass"
// task, Phase 7) — covers the three required scenarios directly: a
// second device logging in while the first is still active (should
// prompt, never silently allow both), a login after the first session
// has gone stale (should replace automatically, no prompt), and the
// replaced device being forced out on its own next request.

const NOW = new Date('2026-09-20T12:00:00.000Z').getTime()

function rowAt(msAgo: number, sessionId = 'session-A'): ActiveSessionRow {
  return { session_id: sessionId, last_active_at: new Date(NOW - msAgo).toISOString() }
}

describe('decideActiveSessionAction', () => {
  it('claims immediately when no row exists yet (first-ever login)', () => {
    expect(decideActiveSessionAction({ row: null, cookieSessionId: null, now: NOW })).toBe('claim')
  })

  it('allows the device whose cookie matches the current row, regardless of age', () => {
    expect(decideActiveSessionAction({ row: rowAt(ACTIVE_SESSION_WINDOW_MS * 10, 'session-A'), cookieSessionId: 'session-A', now: NOW })).toBe(
      'allow',
    )
  })

  // The core paywall-sharing deterrent: a second device attempting to
  // log in (no cookie of its own yet) while the account was genuinely
  // active elsewhere moments ago must be intercepted with a prompt, not
  // silently let in alongside the first device.
  it('requires confirmation for a new device/browser while the existing claim is still fresh', () => {
    expect(decideActiveSessionAction({ row: rowAt(1000), cookieSessionId: null, now: NOW })).toBe('confirm_required')
  })

  // Graceful handoff: once the previous device has gone quiet long
  // enough, a new device takes over automatically — no interruption for
  // a legitimate user who just switched devices.
  it('claims automatically for a new device once the existing claim has gone stale', () => {
    expect(decideActiveSessionAction({ row: rowAt(ACTIVE_SESSION_WINDOW_MS + 1), cookieSessionId: null, now: NOW })).toBe('claim')
  })

  it('treats the boundary itself (exactly the window) as no longer fresh', () => {
    expect(decideActiveSessionAction({ row: rowAt(ACTIVE_SESSION_WINDOW_MS), cookieSessionId: null, now: NOW })).toBe('claim')
  })

  // Enforcement: a device that HAD a valid claim (it carries a cookie)
  // but no longer matches the row was superseded by another device's
  // takeover — it must be forced out immediately, never re-prompted
  // (that would let the two devices ping-pong the claim back and forth
  // instead of one of them actually losing).
  it('force-logs-out a device whose cookie no longer matches the current row', () => {
    expect(decideActiveSessionAction({ row: rowAt(1000, 'session-B'), cookieSessionId: 'session-A', now: NOW })).toBe('force_logout')
  })

  it('force-logs-out even when the current row is stale — a stale row still means someone else already claimed it', () => {
    expect(decideActiveSessionAction({ row: rowAt(ACTIVE_SESSION_WINDOW_MS + 1, 'session-B'), cookieSessionId: 'session-A', now: NOW })).toBe(
      'force_logout',
    )
  })
})

// resolveActiveSession — the DB-touching wrapper middleware actually
// calls. Mocks `.from('active_sessions')` with a small in-memory table
// scoped to one user, mirroring the mocking convention already
// established elsewhere in this app's Supabase-backed tests.
function makeSupabase(initialRow: ActiveSessionRow | null): {
  client: { from: (table: string) => unknown }
  getRow: () => ActiveSessionRow | null
} {
  let row = initialRow

  const client = {
    from: (table: string) => {
      if (table !== 'active_sessions') throw new Error(`Unexpected table in test mock: ${table}`)
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: row }),
          }),
        }),
        upsert: (values: { session_id: string; last_active_at: string }) => {
          row = { session_id: values.session_id, last_active_at: values.last_active_at }
          return Promise.resolve({ error: null })
        },
        update: (values: { last_active_at: string }) => ({
          eq: () => {
            if (row) row = { ...row, last_active_at: values.last_active_at }
            return Promise.resolve({ error: null })
          },
        }),
      }
    },
  }

  return { client, getRow: () => row }
}

function asSupabase(client: { from: (table: string) => unknown }): SupabaseClient<Database> {
  return client as unknown as SupabaseClient<Database>
}

describe('resolveActiveSession', () => {
  it('claims and persists a fresh row when none existed before', async () => {
    const { client, getRow } = makeSupabase(null)

    const result = await resolveActiveSession({ supabase: asSupabase(client), userId: 'user-1', cookieSessionId: null, userAgent: 'test-agent' })

    expect(result.action).toBe('claim')
    expect(result.newSessionId).toBeDefined()
    expect(getRow()?.session_id).toBe(result.newSessionId)
  })

  it('confirm_required leaves the existing row untouched (no premature takeover before the user confirms)', async () => {
    const { client, getRow } = makeSupabase({ session_id: 'session-A', last_active_at: new Date().toISOString() })

    const result = await resolveActiveSession({ supabase: asSupabase(client), userId: 'user-1', cookieSessionId: null, userAgent: 'test-agent' })

    expect(result.action).toBe('confirm_required')
    expect(getRow()?.session_id).toBe('session-A')
  })

  it('force_logout leaves the (already-superseding) row untouched', async () => {
    const { client, getRow } = makeSupabase({ session_id: 'session-B', last_active_at: new Date().toISOString() })

    const result = await resolveActiveSession({
      supabase: asSupabase(client),
      userId: 'user-1',
      cookieSessionId: 'session-A',
      userAgent: 'test-agent',
    })

    expect(result.action).toBe('force_logout')
    expect(getRow()?.session_id).toBe('session-B')
  })

  it('allow does not rewrite last_active_at when it was updated recently (throttled)', async () => {
    const recent = new Date(Date.now() - 5_000).toISOString()
    const { client, getRow } = makeSupabase({ session_id: 'session-A', last_active_at: recent })

    await resolveActiveSession({ supabase: asSupabase(client), userId: 'user-1', cookieSessionId: 'session-A', userAgent: 'test-agent' })

    expect(getRow()?.last_active_at).toBe(recent)
  })

  it('allow does rewrite last_active_at once the throttle window has passed', async () => {
    const stale = new Date(Date.now() - LAST_ACTIVE_THROTTLE_MS - 5_000).toISOString()
    const { client, getRow } = makeSupabase({ session_id: 'session-A', last_active_at: stale })

    await resolveActiveSession({ supabase: asSupabase(client), userId: 'user-1', cookieSessionId: 'session-A', userAgent: 'test-agent' })

    expect(getRow()?.last_active_at).not.toBe(stale)
  })
})
