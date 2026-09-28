import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { parseLearnerRole, parseLearningFocus, type LearnerRole, type LearningFocus } from '../onboardingOptions'

export type OnboardingProfile = {
  role: LearnerRole | null
  focus: LearningFocus | null
  /** True once the onboarding screen was completed or skipped. */
  seen: boolean
  /** False when the user has no profiles row (then onboarding is never forced). */
  hasProfile: boolean
}

export const getOnboardingProfile = cache(async (userId: string): Promise<OnboardingProfile> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('learner_role, learning_focus, onboarding_seen_at')
    .eq('id', userId)
    .maybeSingle()

  return {
    role: parseLearnerRole(data?.learner_role),
    focus: parseLearningFocus(data?.learning_focus),
    seen: data?.onboarding_seen_at !== null && data?.onboarding_seen_at !== undefined,
    hasProfile: data !== null,
  }
})
