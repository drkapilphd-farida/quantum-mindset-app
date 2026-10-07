import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { getPracticeSessions } from '@/lib/exercises/queries/getPracticeSessions'
import { computeDailyStreak } from '@/lib/exercises/practiceHistory'
import { computeReadingScore, computeMindScore } from '@/lib/exercises/mindScore'
import { getProgramProgress } from '@/features/thirty-day-curriculum/programProgress'
import { UnifiedQuantumSessionPreviewClient } from './components/UnifiedQuantumSessionPreviewClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// QSR Pro Circuit™ — real, standalone route for the Daily Quantum Session
// (a deliberately non-colliding sandbox, separate from both the
// discover-welcome-preview lead-magnet funnel and the still-mid-
// development labs/quantum-speed-reading/start/* multi-page flow — the
// "-preview" in the folder name is legacy, this is production).
//
// Now an async Server Component (previously a bare client page) so the
// Circuit can resolve real, server-side Pro access and Mind Score before
// ever rendering — same isPro-prop pattern AIDocumentTransformerWidget
// already uses, and the exact same Mind Score computation chain
// (dashboard)/progress/page.tsx already runs (getModuleProgress +
// getPracticeSessions + computeDailyStreak + computeReadingScore +
// computeMindScore), reused here rather than re-derived, purely to
// surface a rank band on the Circuit's own completion screen
// (getMindScoreRank). No login gate here — anonymous visitors already
// degrade gracefully throughout this flow (saveDailyQuantumSession is a
// silent no-op for them), so this route stays open exactly as before.
export default async function UnifiedQuantumSessionPreviewPage(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isPro = await hasQuantumSpeedReadingProAccess()

  let mindScore = 0
  if (user) {
    const [program, labSessions] = await Promise.all([
      getProgramProgress(),
      getPracticeSessions('quantum-speed-reading'),
    ])
    // The higher of the 30-day plan and the old Eye Foundation module, so no score drops.
    const completionPercent = program.scorePercent
    const labStreak = computeDailyStreak(labSessions)
    const readingScore = computeReadingScore(completionPercent, labStreak.currentStreak)
    mindScore = computeMindScore([readingScore])
  }

  return <UnifiedQuantumSessionPreviewClient isPro={isPro} userId={user?.id ?? 'anonymous'} mindScore={mindScore} />
}
