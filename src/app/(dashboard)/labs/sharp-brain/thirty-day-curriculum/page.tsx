import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ThirtyDayCurriculumExperience } from '@/features/thirty-day-curriculum/components/ThirtyDayCurriculumExperience'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { getCurriculumDayCompletions } from '@/features/thirty-day-curriculum/actions/getCurriculumDayCompletions'
import { getCurriculumWatermarkText } from '@/features/thirty-day-curriculum/actions/getCurriculumWatermarkText'
import { isCurriculumDayUnlocked } from '@/features/thirty-day-curriculum/curriculumProgress'
import { getMyClassesDone } from '@/features/live-classes/actions'
import { getNextDayOpensAt } from '@/features/thirty-day-curriculum/actions/paceActions'
import { ReminderBanner } from '@/features/reminders/components/ReminderBanner'

export const metadata: Metadata = {
  title: 'Sharp Brain 30-Day Program Curriculum — Sharp Brain Lab',
  robots: { index: false, follow: false },
}

// 30-Day Quantum Speed Reading Mastery Curriculum™ — a single route,
// client-state-driven view machine (see ThirtyDayCurriculumExperience's
// own doc comment). Deliberately its own route, no collision with the
// existing 21-Day Journey's `/labs/sharp-brain/journey/[day]`.
//
// 30-Day Masterclass Paywall™ — the real gate resolves here, server-side,
// once per page load, via the same hasQuantumSpeedReadingProAccess() every
// other Pro-gated lab route in this app already uses. isPro is then
// threaded down as a prop — never re-derived client-side.
//
// Server-authoritative completion gate (see the "Pre-Launch Audit Fix
// Pass" task, Phase 4) — completedDays is likewise resolved here,
// server-side, from the real `curriculum_day_completions` table
// (getCurriculumDayCompletions), and threaded down alongside isPro.
// isCurriculumDayUnlocked never reads localStorage for this decision
// anymore — see curriculumProgress.ts's own doc comment on that
// function for why.
//
// Anti-Leak Watermark™ (see getCurriculumWatermarkText.ts's own doc
// comment) — resolved server-side here too, same posture as isPro and
// completedDays: never re-derived client-side, and null for the
// excluded owner account means CurriculumWatermarkOverlay simply isn't
// rendered at all for that one login.
type ThirtyDayCurriculumPageProps = {
  searchParams: Promise<{ view?: string | undefined; day?: string | undefined }>
}

export default async function ThirtyDayCurriculumPage({ searchParams }: ThirtyDayCurriculumPageProps): Promise<React.JSX.Element> {
  const [isPro, completions, watermarkText, liveClassesDone, nextDayOpensAt] = await Promise.all([
    hasQuantumSpeedReadingProAccess(),
    getCurriculumDayCompletions(),
    getCurriculumWatermarkText(),
    getMyClassesDone(),
    getNextDayOpensAt(),
  ])
  const initialServerCompletedDays = completions.map((completion) => completion.day)

  // Server check: a day opened by URL (?view=day&day=N) that this learner
  // may not open never renders its content — back to the overview, which
  // shows the enroll offer or "finish the previous day" as appropriate.
  const params = await searchParams
  const requestedDay = params.view === 'day' ? Number(params.day) : null
  if (requestedDay !== null && Number.isInteger(requestedDay) && !isCurriculumDayUnlocked(requestedDay, initialServerCompletedDays, isPro, nextDayOpensAt)) {
    redirect(`/labs/sharp-brain/thirty-day-curriculum?locked=${requestedDay}`)
  }
  return (
    <>
      {requestedDay === null && <ReminderBanner />}
      <ThirtyDayCurriculumExperience isPro={isPro} initialServerCompletedDays={initialServerCompletedDays} watermarkText={watermarkText} liveClassesDone={liveClassesDone} initialNextDayOpensAt={nextDayOpensAt} />
    </>
  )
}
