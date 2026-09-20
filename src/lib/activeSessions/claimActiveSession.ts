'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deriveDeviceLabel } from './deviceLabel'
import { ACTIVE_SESSION_COOKIE, ACTIVE_SESSION_COOKIE_MAX_AGE_SECONDS } from './activeSessionGate'

// The "Continue here and log out there" confirmation (see
// DeviceConflictPrompt.tsx / activeSessionGate.ts) — mints a fresh claim
// for THIS device, overwriting whatever device previously held it. That
// other device's own cookie no longer matches this new row, so its very
// next authenticated request is forced out by the middleware gate (see
// resolveActiveSession's 'force_logout' branch) with a clear reason,
// never silently left signed in alongside this one.
export async function claimActiveSession(next: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const newSessionId = crypto.randomUUID()
  const headerList = await headers()

  await supabase.from('active_sessions').upsert(
    {
      user_id: user.id,
      session_id: newSessionId,
      device_label: deriveDeviceLabel(headerList.get('user-agent')),
      last_active_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )

  const cookieStore = await cookies()
  cookieStore.set(ACTIVE_SESSION_COOKIE, newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ACTIVE_SESSION_COOKIE_MAX_AGE_SECONDS,
  })

  redirect(next.startsWith('/') ? next : '/dashboard')
}
