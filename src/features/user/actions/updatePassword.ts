'use server'

import { z } from 'zod'
import { getAppT } from '@/lib/app-i18n/server'
import { createClient } from '@/lib/supabase/server'
import type { AuthActionResult } from '@/features/auth/types'

export async function updatePassword(input: unknown): Promise<AuthActionResult> {
  const { t } = await getAppT()
  const UpdatePasswordSchema = z
    .object({
      password: z.string().min(8, t('settings.password.tooShort')),
      confirmPassword: z.string().min(1, t('settings.password.confirmRequired')),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: t('settings.password.mismatch'),
      path: ['confirmPassword'],
    })
  const parsed = UpdatePasswordSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? t('settings.errors.invalidInput'),
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) return { success: false, error: t('settings.password.failed') }

  return { success: true }
}
