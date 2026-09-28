'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { AuthActionResult } from '@/features/auth/types'
import { GUARDIAN_CONSENT_VERSION } from '../guardianConsent'
import { LearnerRoleSchema, LearningFocusSchema } from '../onboardingOptions'

// Saves the onboarding answers (first login or Settings → About you), or
// records a skip. A parent must tick the guardian consent checkbox; the
// consent is stored with its wording version and a timestamp.
const SaveOnboardingSchema = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('skip') }),
  z.object({
    mode: z.literal('save'),
    role: LearnerRoleSchema,
    focus: LearningFocusSchema,
    guardianConsent: z.boolean(),
    lang: z.enum(['en', 'hi']),
  }),
])

export async function saveOnboarding(input: unknown): Promise<AuthActionResult> {
  const parsed = SaveOnboardingSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Please choose an option.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated.' }

  const now = new Date().toISOString()

  if (parsed.data.mode === 'skip') {
    const { error } = await supabase.from('profiles').update({ onboarding_seen_at: now }).eq('id', user.id)
    return error ? { success: false, error: 'Could not save. Please try again.' } : { success: true }
  }

  const { role, focus, guardianConsent, lang } = parsed.data
  if (role === 'parent' && !guardianConsent) {
    return { success: false, error: 'consent_required' }
  }

  if (role === 'parent') {
    const { error: consentError } = await supabase.from('guardian_consents').insert({
      guardian_user_id: user.id,
      context: 'onboarding',
      wording_version: GUARDIAN_CONSENT_VERSION,
      lang,
    })
    if (consentError) return { success: false, error: 'Could not save. Please try again.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ learner_role: role, learning_focus: focus, onboarding_seen_at: now })
    .eq('id', user.id)

  return error ? { success: false, error: 'Could not save. Please try again.' } : { success: true }
}
