'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { FOCUS_LABELS, type LearningFocus } from '../onboardingOptions'
import { getGoalRecommendations } from '../goalRecommendations'

// Dashboard card: the exercises that fit the learner's onboarding goal,
// shown near the top (Phase 8, Item 10). Titles and links come from the
// curriculum exercise catalog.
export function GoalRecommendationsCard({ focus }: { focus: LearningFocus }): React.JSX.Element {
  const { lang } = useLanguage()
  const exercises = getGoalRecommendations(focus)

  return (
    <section aria-labelledby="goal-recommendations-heading" className="glass-premium-card p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {lang === 'hi' ? 'आपके लक्ष्य के लिए सुझाव' : 'Recommended for your goal'}
      </p>
      <h2 id="goal-recommendations-heading" className="mt-1 text-lg font-semibold">
        {FOCUS_LABELS[focus][lang]}
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <Link
              href={exercise.href}
              className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 text-[15px] font-medium transition-colors hover:border-foreground/30"
            >
              {exercise.title}
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        <Link href="/settings#about-you" className="underline underline-offset-2">
          {lang === 'hi' ? 'लक्ष्य बदलें' : 'Change goal'}
        </Link>
      </p>
    </section>
  )
}
