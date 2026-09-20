import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { deriveDeviceLabel } from './deviceLabel'

// Single-Device Login Enforcement™ (see the "Pre-Launch Audit Fix Pass"
// task, Phase 7) — a graceful handoff, not a hard lock. The goal is
// deterring the same paid account being ACTIVELY used on two devices at
// once, while a genuine user switching between their own devices (a
// real, expected pattern for QSR students moving between a phone and a
// laptop) is never silently blocked.
//
// The cookie below is this app's own opaque token — never a Supabase
// Auth internal id — minted fresh every time a device "claims" the
// account (see resolveActiveSession's 'claim' branch and
// claimActiveSession.ts). httpOnly + a long maxAge so it survives
// closing and reopening the browser on the SAME device, resuming
// normally with no interruption, exactly like Supabase's own auth
// cookies already do — real enforcement only ever triggers on an actual
// cookie mismatch, never on elapsed time alone for the device that
// still holds a valid claim.
export const ACTIVE_SESSION_COOKIE = 'qm_session_id'
export const ACTIVE_SESSION_COOKIE_MAX_AGE_SECONDS = 34 * 24 * 60 * 60 // 34 days, matching Supabase's own refresh token window

// "Active" window for deciding whether a second device gets a
// confirmation prompt vs. a silent takeover — 12 minutes, inside the
// task's own specified 10-15 minute range.
export const ACTIVE_SESSION_WINDOW_MS = 12 * 60 * 1000

// last_active_at is only ever re-written this often, regardless of how
// many authenticated requests the active device makes in between —
// this is a presence heartbeat, not an audit log.
export const LAST_ACTIVE_THROTTLE_MS = 60 * 1000

export type ActiveSessionRow = { session_id: string; last_active_at: string }

export type ActiveSessionAction = 'allow' | 'claim' | 'confirm_required' | 'force_logout'

// Pure decision function, deliberately separated from resolveActiveSession's
// actual database reads/writes below so the branching logic itself is
// simple to unit test without mocking Supabase.
//
//   - No row at all               -> claim (first-ever login, or the row was cleared)
//   - Cookie matches the row      -> allow (this IS the currently active device)
//   - Cookie present, mismatched  -> force_logout (this device HAD a valid claim,
//                                    but another device has since taken over —
//                                    never re-negotiate, just log it out)
//   - No cookie, row still fresh  -> confirm_required (a genuinely new device/
//                                    browser, while the account looks actively
//                                    used elsewhere)
//   - No cookie, row stale        -> claim (the other device went quiet — take
//                                    over automatically, no prompt)
export function decideActiveSessionAction(params: {
  row: ActiveSessionRow | null
  cookieSessionId: string | null
  now: number
}): ActiveSessionAction {
  const { row, cookieSessionId, now } = params

  if (row === null) return 'claim'
  if (cookieSessionId !== null && cookieSessionId === row.session_id) return 'allow'
  if (cookieSessionId !== null) return 'force_logout'

  const isFresh = now - new Date(row.last_active_at).getTime() < ACTIVE_SESSION_WINDOW_MS
  return isFresh ? 'confirm_required' : 'claim'
}

export type ActiveSessionResolution = {
  action: ActiveSessionAction
  // Only set when action === 'claim' — the new cookie value the caller
  // (middleware) must set on its response for this device to be
  // recognized as the active one on its next request.
  newSessionId?: string
}

// Performs the real read (and, for 'claim'/'allow', the real write) this
// decision needs — called from middleware once per protected-path
// request. `supabase` is expected to be the same request-scoped,
// RLS-respecting client middleware already builds for auth.getUser(),
// so this never stands up a second connection.
export async function resolveActiveSession(params: {
  supabase: SupabaseClient<Database>
  userId: string
  cookieSessionId: string | null
  userAgent: string | null
}): Promise<ActiveSessionResolution> {
  const { supabase, userId, cookieSessionId, userAgent } = params

  const { data: row } = await supabase.from('active_sessions').select('session_id, last_active_at').eq('user_id', userId).maybeSingle()

  const now = Date.now()
  const action = decideActiveSessionAction({ row, cookieSessionId, now })

  if (action === 'claim') {
    const newSessionId = crypto.randomUUID()
    await supabase.from('active_sessions').upsert(
      { user_id: userId, session_id: newSessionId, device_label: deriveDeviceLabel(userAgent), last_active_at: new Date(now).toISOString() },
      { onConflict: 'user_id' },
    )
    return { action, newSessionId }
  }

  if (action === 'allow' && row !== null) {
    const msSinceLastUpdate = now - new Date(row.last_active_at).getTime()
    if (msSinceLastUpdate > LAST_ACTIVE_THROTTLE_MS) {
      await supabase.from('active_sessions').update({ last_active_at: new Date(now).toISOString() }).eq('user_id', userId)
    }
  }

  return { action }
}
