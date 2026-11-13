import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { resolveLearnerPlan, type LearnerPlan } from './rules'

// The signed-in learner's Sharp Brain plan (live or self-paced), from their
// program payments. Payments are service-role only, so this reads them on
// the server for the signed-in learner's own id. Access is NOT decided here
// — that stays getIsPaidUser; callers check access first.

export async function planForUser(userId: string): Promise<LearnerPlan> {
  const { data, error } = await createServiceClient()
    .from('masterclass_payments')
    .select('plan_type, created_at, paid_on, refunded_at')
    .eq('user_id', userId)
  if (error) {
    // Fail towards what learners saw before this change (live).
    logger.error('planForUser: payments read failed', { code: error.code })
    return { plan: 'live' }
  }
  return resolveLearnerPlan(data ?? [])
}

/** The signed-in learner's plan, remembered for the request; null when signed out. */
export const getMyPlan = cache(async (): Promise<{ userId: string; email: string; plan: LearnerPlan } | null> => {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser()
  if (!user) return null
  return { userId: user.id, email: user.email ?? '', plan: await planForUser(user.id) }
})
