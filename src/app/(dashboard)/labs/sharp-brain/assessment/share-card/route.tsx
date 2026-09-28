import { appFeatures } from '@/config/site.config'
import { createClient } from '@/lib/supabase/server'
import { getAssessmentState } from '@/features/sharp-brain-assessment/queries/getAssessmentState'
import { buildShareCardResponse } from '@/features/sharp-brain-assessment/shareCard'

// Share card image (Phase 8, Item 11): generated only for the signed-in
// learner, on request (see shareCard.tsx for what it shows).
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  if (!appFeatures.dayThirtyComparison) return new Response('Not found', { status: 404 })
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { firstName, day1, day30 } = await getAssessmentState(user.id)
  if (day1 === null || day30 === null) return new Response('Not found', { status: 404 })

  return buildShareCardResponse({ firstName, day1, day30 })
}
