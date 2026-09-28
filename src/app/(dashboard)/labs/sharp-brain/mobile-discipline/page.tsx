import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { appFeatures, programs } from '@/config/site.config'
import { createClient } from '@/lib/supabase/server'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { MobileDisciplineHub } from '@/features/mobile-discipline/components/MobileDisciplineHub'
import { getMobileDisciplineState } from '@/features/mobile-discipline/queries/getMobileDisciplineState'

export const metadata: Metadata = {
  title: 'Mobile Discipline — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

// Mobile Discipline (Phase 8, Item 12) — for 30-Day Program members,
// behind appFeatures.mobileDiscipline.
export default async function MobileDisciplinePage(): Promise<React.JSX.Element> {
  if (!appFeatures.mobileDiscipline) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/labs/sharp-brain/mobile-discipline')

  if (!(await hasQuantumSpeedReadingProAccess())) {
    return (
      <div className="mx-auto max-w-2xl space-y-3 px-4 py-10">
        <h1 className="text-2xl font-semibold">Mobile Discipline</h1>
        <p className="text-muted-foreground">This is part of the {programs.sharpBrain.name}.</p>
        <Link href={programs.sharpBrain.url} className="font-medium underline underline-offset-4">
          See the program →
        </Link>
      </div>
    )
  }

  const state = await getMobileDisciplineState(user.id)
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <MobileDisciplineHub state={state} />
    </div>
  )
}
