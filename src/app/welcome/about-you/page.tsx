import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { appFeatures } from '@/config/site.config'
import { ArrivalBackground } from '@/components/welcome/ArrivalBackground'
import { AboutYouForm } from '@/features/onboarding/components/AboutYouForm'
import { getOnboardingProfile } from '@/features/onboarding/queries/getOnboardingProfile'
import { safeNextPath } from '@/features/onboarding/safeNextPath'

export const metadata: Metadata = {
  title: 'About you',
  robots: { index: false, follow: false },
}

type AboutYouPageProps = {
  searchParams: Promise<{ next?: string | undefined }>
}

// One-time "About you" screen (Phase 8, Item 10) — role + goal, skippable.
export default async function AboutYouPage({ searchParams }: AboutYouPageProps): Promise<React.JSX.Element> {
  const next = safeNextPath((await searchParams).next)
  if (!appFeatures.onboarding) redirect(next)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent('/welcome/about-you')}`)

  const profile = await getOnboardingProfile(user.id)

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <ArrivalBackground />
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-background/80 p-5 shadow-sm backdrop-blur-sm sm:p-8">
        <AboutYouForm mode="welcome" initialRole={profile.role} initialFocus={profile.focus} next={next} />
      </div>
    </div>
  )
}
