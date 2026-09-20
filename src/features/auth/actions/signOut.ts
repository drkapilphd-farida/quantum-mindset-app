'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ACTIVE_SESSION_COOKIE } from '@/lib/activeSessions/activeSessionGate'

export async function signOut(): Promise<void> {
  const supabase = await createClient()

  // Single-Device Login Enforcement™ (see the "Pre-Launch Audit Fix
  // Pass" task, Phase 7) — an explicit, intentional sign-out relinquishes
  // this account's claim entirely, not just this device's own cookie.
  // Without this, the row would stay fresh and pointing at a session_id
  // nobody holds anymore, so the very next real login (anywhere) would
  // hit an unnecessary "continue here and log out there?" prompt for an
  // account nothing is actually still using.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('active_sessions').delete().eq('user_id', user.id)
  }

  await supabase.auth.signOut()

  const cookieStore = await cookies()
  cookieStore.delete(ACTIVE_SESSION_COOKIE)

  redirect('/login')
}
