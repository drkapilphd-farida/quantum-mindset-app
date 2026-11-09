'use client'

import Link from 'next/link'
import { useAppT } from '@/lib/app-i18n/client'
import { useCurriculumSessionCompletion } from '../useCurriculumSessionCompletion'

// No exercise is ever a dead end (founder rule, 9 Nov 2026). Shown under the
// pass and fail screens of the level-ladder exercises (Phrase, Multi-Line,
// Sentence, Paragraph and Progressive Chunk Reading):
// - inside the 30-day plan: "Back to today's plan" — one finished round
//   counts as the step done (recorded on the server), and the day goes on;
// - outside the plan, after a failed level: "Back to Lab".
export function LevelEndPlanExit({ exerciseId, labHref, failed }: { exerciseId: string; labHref: string; failed: boolean }): React.JSX.Element | null {
  const t = useAppT()
  const session = useCurriculumSessionCompletion(exerciseId, labHref)
  const className = 'mt-1 rounded-full border border-border px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted'
  if (session.isActiveStep) {
    return (
      <button type="button" onClick={session.advance} className={className} data-back-to-plan={exerciseId}>
        {t('exercises.quiz.backToPlan')}
      </button>
    )
  }
  if (!failed) return null
  return (
    <Link href={labHref} className={className} data-back-to-lab={exerciseId}>
      {t('exercises.complete.backToLab')}
    </Link>
  )
}
