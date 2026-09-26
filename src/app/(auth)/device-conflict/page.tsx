import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeviceConflictPrompt } from '@/features/auth/components/DeviceConflictPrompt'

export const metadata: Metadata = {
  title: 'Continue Here?',
  robots: { index: false, follow: false },
}

type DeviceConflictPageProps = {
  searchParams: Promise<{ next?: string }>
}

// Single-Device Login Enforcement™ (see the "Pre-Launch Audit Fix Pass"
// task, Phase 7) — middleware redirects here (never renders this for a
// direct, unprompted visit) whenever a signed-in user's cookie doesn't
// match their account's `active_sessions` row, and that row is still
// fresh enough to mean another device is genuinely active right now. If
// somehow reached without a real session, this falls back to /login
// exactly like every other protected page in this app.
export default async function DeviceConflictPage({ searchParams }: DeviceConflictPageProps): Promise<React.JSX.Element> {
  const params = await searchParams
  const next = params.next && params.next.startsWith('/') ? params.next : '/dashboard'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: row } = await supabase.from('active_sessions').select('device_label').eq('user_id', user.id).maybeSingle()

  return <DeviceConflictPrompt next={next} otherDeviceLabel={row?.device_label ?? null} />
}
