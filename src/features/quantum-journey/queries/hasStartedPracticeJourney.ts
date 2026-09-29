import { createClient } from '@/lib/supabase/server'

// The Practice Journey (the old 21-day Starter) is closed to new users
// (2026-09-29). Its entry points — the habit dashboard card, the welcome
// card and the "History" menu item — show only to someone who already has
// at least one journey session or a Starter entitlement. RLS scopes both
// reads to the signed-in user.
export async function hasStartedPracticeJourney(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const [sessions, entitlement] = await Promise.all([
    supabase.from('daily_quantum_sessions').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('entitlements').select('id').eq('user_id', userId).eq('key', 'habit_builder_access').maybeSingle(),
  ])

  return (sessions.count ?? 0) > 0 || entitlement.data !== null
}
