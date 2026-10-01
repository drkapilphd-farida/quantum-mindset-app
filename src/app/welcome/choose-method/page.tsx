import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAppDomain } from '@/lib/domains/appDomain'
import { ChooseLearningMethodExperience } from '@/components/welcome/ChooseLearningMethodExperience'
import { hasStartedPracticeJourney } from '@/features/quantum-journey/queries/hasStartedPracticeJourney'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'
import { sharpBrainEnrolment } from '@/config/site.config'
import { istDayMonth } from '@/features/sharp-brain-enrol/copy'

// Belt-and-suspenders against edge/CDN caching serving the wrong
// domain's card — same reasoning and same fix as
// (dashboard)/dashboard/page.tsx's own `dynamic = 'force-dynamic'`.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Choose Learning Method',
  robots: { index: false, follow: false },
}

// Sprint LW-1C — Choose Learning Method™. Replaces the previous
// `/welcome/preparing` ModulePlaceholder stub (renamed to this route —
// its only referrer, LearningGoalSelector.tsx, was updated in the same
// sprint).
//
// Gateway Auth Modal™ — this page used to hard-redirect signed-out
// visitors to /login before ever rendering, so they never saw the two
// cards at all. It no longer does: both cards are now visible to everyone,
// and ChooseLearningMethodExperience itself gates each card's action
// behind a modal (not a page redirect) when `isAuthenticated` is false —
// see that component for why. This is still the one real auth check for
// this route (outside `PROTECTED_PATHS`, no shared `/welcome/*`
// layout.tsx), just no longer load-bearing for *access* — only for which
// UI state renders.
//
// Domain Split™ — this is the universal front door for BOTH domains
// (never gated by src/middleware.ts's DOMAIN_ROUTES), so it has to pick
// its own single card per domain rather than showing one fixed set —
// see ChooseLearningMethodExperience.tsx for what each domain actually
// shows.
export default async function ChooseLearningMethodPage(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const appDomain = await getAppDomain()
  const hasStartedJourney = user !== null && appDomain === 'habit' ? await hasStartedPracticeJourney(user.id) : false

  const next = pricingSnapshot(Date.now()).batches[0]
  const programPrice = {
    amountInr: next?.amountInr ?? sharpBrainEnrolment.regularInr,
    regularInr: next?.regularInr ?? sharpBrainEnrolment.regularInr,
    earlyBird: next?.offer === 'earlybird',
    batchLabel: next === undefined ? '' : istDayMonth(next.startsAtMs, 'en'),
  }

  return (
    <ChooseLearningMethodExperience
      isAuthenticated={user !== null}
      appDomain={appDomain}
      hasStartedJourney={hasStartedJourney}
      programPrice={programPrice}
    />
  )
}
