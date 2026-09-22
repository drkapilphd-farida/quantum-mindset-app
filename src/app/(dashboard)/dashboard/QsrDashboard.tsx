import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getIsPaidUser } from '@/lib/subscription/getIsPaidUser'
import { getCurrentUserProfile } from '@/lib/supabase/getCurrentUserProfile'
import { getModuleProgress } from '@/lib/exercises/queries/getModuleProgress'
import { getPracticeSessions } from '@/lib/exercises/queries/getPracticeSessions'
import { getContinueLearningSummary } from '@/lib/exercises/continueLearning'
import { computeDailyStreak, computeTodaysProgress, computeTotalPracticeStats } from '@/lib/exercises/practiceHistory'
import { EYE_FOUNDATION_MODULE } from '@/features/quantum-speed-reading/eyeFoundationModule'
import { computeMemoryScore } from '@/lib/exercises/mindScore'
import { GreetingHeading } from '@/components/dashboard/GreetingHeading'
import { AIMentorSection, AIMentorSkeleton } from '@/components/dashboard/AIMentorSection'
import { MindScoreCard } from '@/components/dashboard/MindScoreCard'
import { AIDocumentTransformerWidget } from '@/components/dashboard/AIDocumentTransformerWidget'
import { DashboardSectionHeader } from '@/components/dashboard/DashboardSectionHeader'
import { DashboardViewToggle } from '@/components/dashboard/DashboardViewToggle'
import { ThirtyDayMasterclassHeroCard } from '@/components/dashboard/ThirtyDayMasterclassHeroCard'
import { getQuantumDocumentHistory } from '@/features/quantum-document-transformer/actions/getQuantumDocumentHistory'
import { getQuantumDocumentSessionHistory } from '@/features/quantum-document-transformer/actions/getQuantumDocumentSessionHistory'
import { getFixationSessions } from '@/features/visual-intelligence/fixation/queries/getFixationSessions'
import { getFixationStats } from '@/features/visual-intelligence/fixation/queries/getFixationStats'
import { ParentFeedbackPrompt } from '@/features/school-dashboard/components/ParentFeedbackPrompt'
import { ParentDashboard } from '@/features/parent-dashboard/components/ParentDashboard'

const EXERCISE_IDS = EYE_FOUNDATION_MODULE.map((ex) => ex.exerciseId)

// Mind Score: weighted blend of Reading progress (60%) and streak
// consistency (40%), capped at 100. Grows as the student practices more
// and maintains a longer streak. Never fabricated — always from real data.
function computeMindScore(completionPercent: number, currentStreak: number): number {
  const practiceComponent = Math.round(completionPercent * 0.6)
  const consistencyComponent = Math.round(Math.min(currentStreak / 14, 1) * 100 * 0.4)
  return Math.min(100, practiceComponent + consistencyComponent)
}

type QsrDashboardProps = {
  view: 'student' | 'parent'
}

// Domain Split™ — app.mindurmind.org.in's dashboard: the Eye Foundation
// Module hero + Mind Score™, the AI Document Supercharger (Upload &
// Learn), and the 30-Day QSR Masterclass. The 21-Day Habit Builder card
// lives only on HabitDashboard.tsx now — habit-only routes are actively
// unreachable from this domain (see src/middleware.ts's DOMAIN_ROUTES).
//
// Elevated Parents Dashboard™ — `view` (from ?view=parent, resolved in
// page.tsx) swaps the whole body for the same real ParentDashboard
// already embedded as a tab on /masterclasses; branching before the
// student-only Promise.all below skips those queries entirely on the
// parent view instead of fetching and discarding them.
export async function QsrDashboard({ view }: QsrDashboardProps): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return <div />

  if (view === 'parent') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <DashboardViewToggle activeView="parent" />
        <ParentDashboard userId={user.id} />
      </div>
    )
  }

  const [labProgress, labSessions, profile, isPaidUser, recentQuantumDocuments, quantumDocumentSessionHistory, fixationSessions] = await Promise.all([
    getModuleProgress('quantum-speed-reading', EXERCISE_IDS),
    getPracticeSessions('quantum-speed-reading'),
    getCurrentUserProfile(user.id),
    getIsPaidUser(user.id),
    getQuantumDocumentHistory(),
    getQuantumDocumentSessionHistory(),
    getFixationSessions(),
  ])

  // ── Derived data from Learning Journey Engine ────────────────────────────
  const labSummary = getContinueLearningSummary(labProgress, EYE_FOUNDATION_MODULE)
  const labStreak = computeDailyStreak(labSessions)
  const labToday = computeTodaysProgress(labSessions)
  const labTotals = computeTotalPracticeStats(labSessions)

  const completionPercent = labProgress.totalCount > 0 ? Math.round((labProgress.completedCount / labProgress.totalCount) * 100) : 0

  // ── New computations (all from real data) ────────────────────────────────
  const mindScore = computeMindScore(completionPercent, labStreak.currentStreak)

  // Mind Score breakdown — Memory (AI Document Transformer recall-quiz
  // accuracy) and Focus (Visual Fixation Engine's own real, already-
  // computed focus score) — both real proxies, both null (locked in the
  // UI) until the student has real activity to derive them from, never a
  // fabricated starting number.
  const memoryScore = computeMemoryScore(quantumDocumentSessionHistory)
  const fixationStats = getFixationStats(fixationSessions)
  const focusScore = fixationStats.completedSessionCount > 0 ? fixationStats.focusScore : null

  const studentName = profile?.fullName ?? 'there'
  const studentFirstName = studentName.trim().split(' ').at(0) ?? 'there'

  return (
    <div className="glass-premium relative -m-6 space-y-4 p-6 sm:-m-8 sm:space-y-6 sm:p-8">
      {/* Dashboard Glass™ ambient background — fixed so it stays full-
          viewport regardless of this page's own scroll position or the
          parent layout's max-w-4xl centering; -z-10 keeps it behind both
          this content and the (opaque, unrelated) sidebar. Scoped to this
          page only — no other route renders this. */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="glass-ambient-blob" style={{ width: 520, height: 520, top: -140, left: -100, background: 'var(--ambient-a)' }} />
        <div className="glass-ambient-blob" style={{ width: 460, height: 460, top: 220, right: -140, background: 'var(--ambient-b)' }} />
        <div className="glass-ambient-blob" style={{ width: 380, height: 380, bottom: -160, left: '35%', background: 'var(--ambient-a)' }} />
      </div>

      <DashboardViewToggle activeView="student" />

      {/* Hero */}
      <div className="glass-premium-card glass-premium-lift p-6 sm:p-8">
        <GreetingHeading studentName={studentFirstName} />
        <p className="mt-1 text-sm text-muted-foreground">
          {labSummary.isComplete ? 'Eye Foundation Module complete — keep the momentum going.' : `${completionPercent}% through the Eye Foundation Module.`}
        </p>

        <div className="mt-5">
          <Suspense fallback={<AIMentorSkeleton />}>
            <AIMentorSection
              studentName={studentName}
              currentStreak={labStreak.currentStreak}
              bestStreak={labStreak.bestStreak}
              completedCount={labProgress.completedCount}
              totalCount={labProgress.totalCount}
              todaySessionCount={labToday.exercisesCompletedToday}
              totalCompletedSessions={labTotals.totalCompletedSessions}
            />
          </Suspense>
        </div>
      </div>

      {/* 3-Tier Value Ladder™ — Tier 1: My Document Tools. AI Document
          Transformer™ is the anchor target for Choose Your Path™'s
          "Upload & Learn™" card (/dashboard#upload-document), the direct,
          one-click destination for uploading a document from onboarding.
          QSR-Bundled Access™ (see the "Upload & Learn / QSR Bundling"
          task) — no longer its own separate ₹499/mo product; it's
          included in the 30-Day QSR Masterclass, the exact same access
          check every curriculum day already gates on. The widget itself
          (AIDocumentTransformerWidget) shows the real ₹9,999 paywall
          modal for a non-pro user — no separate pricing chip needed here
          anymore. */}
      <section aria-labelledby="document-tools-heading">
        <DashboardSectionHeader
          id="document-tools-heading"
          eyebrow="Tier 1 · Utility Hub"
          title="📄 Document Mastery Studio™"
          description="Drop any PDF, textbook, or research paper. Our AI instantly converts it into Quantum Speed Reading drills, Mind Maps, and Neural Map Notes."
        />
        <div id="upload-document">
          <AIDocumentTransformerWidget isPro={isPaidUser} recentDocuments={recentQuantumDocuments.slice(0, 1)} />
        </div>
      </section>

      {/* Domain Split™ — this used to be "Masterclass & Programs" and also
          hosted the 21-Day Habit Builder card (Tier 2). That card now
          lives only on HabitDashboard.tsx, so this section is Tier 3
          only — copy updated to match, not just the card removed. */}
      <section aria-labelledby="programs-heading" className="space-y-4 sm:space-y-6">
        <DashboardSectionHeader
          id="programs-heading"
          eyebrow="Tier 3 · Flagship Program"
          title="Masterclass"
          description="A flagship, structured 30-day mastery path with live mentorship."
        />
        <ThirtyDayMasterclassHeroCard />
      </section>

      {/* Mind Score™ */}
      <MindScoreCard mindScore={mindScore} readingScore={completionPercent} memoryScore={memoryScore} focusScore={focusScore} />

      {/* Parent NPS™ — last on the page, deliberately low-priority
          placement for a "non-intrusive" prompt; renders nothing for
          the common case (no tenant membership) or for tenant staff. */}
      <ParentFeedbackPrompt />
    </div>
  )
}
