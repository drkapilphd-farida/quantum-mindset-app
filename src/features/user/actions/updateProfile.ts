'use server'

import { z } from 'zod'
import { getAppT } from '@/lib/app-i18n/server'
import { createClient } from '@/lib/supabase/server'
import type { AuthActionResult } from '@/features/auth/types'

export async function updateProfile(input: unknown): Promise<AuthActionResult> {
  const { t } = await getAppT()
  const UpdateProfileSchema = z.object({
    fullName: z.string().min(2, t('settings.profile.nameTooShort')).max(100, t('settings.profile.nameTooLong')),
  })
  const parsed = UpdateProfileSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? t('settings.errors.invalidInput'),
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: t('settings.errors.notSignedIn') }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: parsed.data.fullName })
    .eq('id', user.id)

  if (error) return { success: false, error: t('settings.profile.failed') }

  return { success: true }
}
