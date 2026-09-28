import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { appFeatures, programs } from '@/config/site.config'
import { createClient } from '@/lib/supabase/server'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { AssessmentHub } from '@/features/sharp-brain-assessment/components/AssessmentHub'
import { getAssessmentState } from '@/features/sharp-brain-assessment/queries/getAssessmentState'

export const metadata: Metadata = {
  title: 'Day 1 vs Day 30 assessment — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

// Sharp Brain Day 1 / Day 30 assessment (Phase 8, Item 11) — for 30-Day
// Program members, behind appFeatures.dayThirtyComparison.
export default async function AssessmentPage(): Promise<React.JSX.Element> {
  if (!appFeatures.dayThirtyComparison) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/labs/sharp-brain/assessment')

  if (!(await hasQuantumSpeedReadingProAccess())) {
    return (
      <div className="mx-auto max-w-2xl space-y-3 px-4 py-10">
        <h1 className="text-2xl font-semibold">Day 1 vs Day 30 assessment</h1>
        <p className="text-muted-foreground">This assessment is part of the {programs.sharpBrain.name}.</p>
        <Link href={programs.sharpBrain.url} className="font-medium underline underline-offset-4">
          See the program →
        </Link>
      </div>
    )
  }

  const state = await getAssessmentState(user.id)
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <AssessmentHub state={state} />
    </div>
  )
}
