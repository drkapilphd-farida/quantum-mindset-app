'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { APP_LANG_COOKIE, isAppLang } from './languages'

const ONE_YEAR_S = 60 * 60 * 24 * 365

/**
 * Saves the learner's app language: always in a cookie (so the next page is
 * rendered in it), and on their profile when signed in (so it follows them
 * to other devices).
 */
export async function setAppLanguage(input: unknown): Promise<{ ok: boolean }> {
  if (!isAppLang(input)) return { ok: false }
  ;(await cookies()).set(APP_LANG_COOKIE, input, { path: '/', maxAge: ONE_YEAR_S, sameSite: 'lax' })
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user !== null) {
      const { error } = await supabase.from('profiles').update({ preferred_language: input }).eq('id', user.id)
      if (error) {
        logger.warn('setAppLanguage: profile update failed', { code: error.code })
        return { ok: false }
      }
    }
  } catch {
    return { ok: false }
  }
  return { ok: true }
}
