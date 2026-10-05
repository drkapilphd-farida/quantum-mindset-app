import Link from 'next/link'
import type { Translator } from '@/lib/app-i18n/translate'
import { getAppT } from '@/lib/app-i18n/server'
import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

type TodaysRecommendationCardProps = {
  exerciseTitle: string | null
  exerciseHref: string | null
  actionLabel: string
  isComplete: boolean
}

const ESTIMATED_MINUTES = 4

// getContinueLearningSummary builds "Start: <exercise>" etc. in English;
// the exercise name stays, the verb is translated.
function actionText(t: Translator, actionLabel: string): string {
  const match = /^(Resume|Start|Continue): (.+)$/.exec(actionLabel)
  if (match === null) return actionLabel === 'Review' ? t('progress.review') : actionLabel
  const name = match[2] ?? ''
  if (match[1] === 'Resume') return t('progress.resumeX', { name })
  if (match[1] === 'Start') return t('progress.startX', { name })
  return t('progress.continueX', { name })
}

// Today's highest-impact recommendation is always the next exercise in the
// student's actual sequence — the real "highest impact" action, not a
// fabricated suggestion.
export async function TodaysRecommendationCard({
  exerciseTitle,
  exerciseHref,
  actionLabel,
  isComplete,
}: TodaysRecommendationCardProps): Promise<React.JSX.Element> {
  const { t } = await getAppT()
  return (
    <div className="glass-premium-card p-6">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        <Sparkles className="size-3.5" aria-hidden="true" />
        Today&apos;s Recommendation™
      </div>

      {isComplete ? (
        <div className="mt-4">
          <p className="text-base font-semibold text-foreground">{t('progress.moduleComplete')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('progress.moduleCompleteBody')}
          </p>
        </div>
      ) : exerciseTitle !== null ? (
        <>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">{t('progress.highestImpact')}</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-foreground">{exerciseTitle}</p>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" />
              {t('progress.minutes', { n: ESTIMATED_MINUTES })}
            </span>
            <span className="text-success font-medium">{t('progress.plusReading')}</span>
          </div>

          {exerciseHref !== null && (
            <Button asChild size="lg" className="mt-5 w-full gap-2 rounded-full">
              <Link href={exerciseHref}>
                {actionText(t, actionLabel)}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {t('progress.firstSession')}
        </p>
      )}
    </div>
  )
}
