// Server-only. Called by every sign-in path (password, sign-up, email code,
// and the Google / email-link callback) right after the session is created.
//
// Why: the one-device gate in middleware used to claim the session on the
// first page request after sign-in. A browser fires several requests at
// once at that moment (the page plus prefetches), all without the session
// cookie yet. The first claimed the session; the others saw it as "active
// on another device" and showed the "Continue here?" prompt — against the
// learner's own device. Two of them could even both claim, leaving the
// browser with a cookie that no longer matched and logging the learner
// out on the next page.
//
// Claiming here, before the redirect, means the cookie is already set when
// the first page loads. The one-device rule is unchanged: if another device
// was active within the last ACTIVE_SESSION_WINDOW_MS, nothing is claimed
// here and middleware shows the prompt as before.
import { cookies, headers } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { logger } from '@/lib/logger'
import { deriveDeviceLabel } from './deviceLabel'
import {
  ACTIVE_SESSION_COOKIE,
  ACTIVE_SESSION_COOKIE_MAX_AGE_SECONDS,
  ACTIVE_SESSION_WINDOW_MS,
  type ActiveSessionRow,
} from './activeSessionGate'

/** Claim at sign-in only when no other device holds a recent session. */
export function shouldClaimAtSignIn(row: ActiveSessionRow | null, now: number): boolean {
  if (row === null) return true
  return now - new Date(row.last_active_at).getTime() >= ACTIVE_SESSION_WINDOW_MS
}

export async function claimActiveSessionOnSignIn(supabase: SupabaseClient<Database>, userId: string): Promise<void> {
  try {
    const { data: row } = await supabase.from('active_sessions').select('session_id, last_active_at').eq('user_id', userId).maybeSingle()
    if (!shouldClaimAtSignIn(row, Date.now())) return

    const sessionId = crypto.randomUUID()
    const { error } = await supabase.from('active_sessions').upsert(
      {
        user_id: userId,
        session_id: sessionId,
        device_label: deriveDeviceLabel((await headers()).get('user-agent')),
        last_active_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    if (error) {
      logger.warn('claimActiveSessionOnSignIn: claim failed; middleware will claim instead', { code: error.code })
      return
    }

    ;(await cookies()).set(ACTIVE_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ACTIVE_SESSION_COOKIE_MAX_AGE_SECONDS,
    })
  } catch (error) {
    // Never block a sign-in on this; middleware still claims on the first request.
    logger.warn('claimActiveSessionOnSignIn: unexpected failure', { error: error instanceof Error ? error.message : String(error) })
  }
}
