import type { Metadata } from 'next'
import { ThirtyDayCurriculumExperience } from '@/features/thirty-day-curriculum/components/ThirtyDayCurriculumExperience'
import { hasQuantumSpeedReadingProAccess } from '@/lib/subscription/hasQuantumSpeedReadingProAccess'
import { getCurriculumDayCompletions } from '@/features/thirty-day-curriculum/actions/getCurriculumDayCompletions'
import { getCurriculumWatermarkText } from '@/features/thirty-day-curriculum/actions/getCurriculumWatermarkText'

export const metadata: Metadata = {
  title: '30-Day Quantum Speed Reading Mastery Curriculum — Quantum Speed Reading Lab™',
}

// 30-Day Quantum Speed Reading Mastery Curriculum™ — a single route,
// client-state-driven view machine (see ThirtyDayCurriculumExperience's
// own doc comment). Deliberately its own route, no collision with the
// existing 21-Day Journey's `/labs/quantum-speed-reading/journey/[day]`.
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
export default async function ThirtyDayCurriculumPage(): Promise<React.JSX.Element> {
  const [isPro, completions, watermarkText] = await Promise.all([
    hasQuantumSpeedReadingProAccess(),
    getCurriculumDayCompletions(),
    getCurriculumWatermarkText(),
  ])
  const initialServerCompletedDays = completions.map((completion) => completion.day)
  return <ThirtyDayCurriculumExperience isPro={isPro} initialServerCompletedDays={initialServerCompletedDays} watermarkText={watermarkText} />
}
