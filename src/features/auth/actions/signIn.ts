'use server'

import { redirect } from 'next/navigation'
import { authErrorKey } from '../authErrorKey'
import { getAppT } from '@/lib/app-i18n/server'
import { createClient } from '@/lib/supabase/server'
import { claimActiveSessionOnSignIn } from '@/lib/activeSessions/claimOnSignIn'
import { resolvePostSignInPath } from '@/features/school-dashboard/queries/resolvePostSignInPath'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { SignInSchema } from '../types'

// Per-IP, not per-account — the point is slowing down credential
// stuffing against this endpoint generally, before we even know which
// account (if any) is being targeted.
const SIGN_IN_RATE_LIMIT = { max: 10, windowMs: 60_000 }

export async function signIn(
  input: unknown,
  next: string = '/dashboard',
): Promise<{ success: false; error: string }> {
  const { t } = await getAppT()
  const parsed = SignInSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: t('auth.errors.invalidCredentials') }
  }

  const clientIp = await getClientIp()
  if (!checkRateLimit(`sign-in:${clientIp}`, SIGN_IN_RATE_LIMIT).allowed) {
    return { success: false, error: t('auth.errors.tooMany') }
  }

  const supabase = await createClient()
  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { success: false, error: t(authErrorKey(error.code)) }
  }

  // Claim the one-device session before the redirect (see claimOnSignIn.ts).
  if (signInData.user) await claimActiveSessionOnSignIn(supabase, signInData.user.id)

  // A caller-specified `next` (e.g. middleware bounced someone here with a
  // real deep link) always wins; only the untouched default gets the
  // role-based override, so a school_admin/franchise_partner lands on
  // their own portal instead of the student dashboard.
  redirect(next === '/dashboard' ? await resolvePostSignInPath() : next)
}
