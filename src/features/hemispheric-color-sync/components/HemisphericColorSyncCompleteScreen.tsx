'use client'

import Link from 'next/link'
import { useAppT } from '@/lib/app-i18n/client'
import { ReadingStatTile } from '@/features/reading-engine/components/ReadingStatTile'
import { formatElapsedTime } from '@/features/quantum-speed-reading/readingSessionEngine'
import { ROUNDS_PER_SESSION, PERFECT_SESSION_BONUS } from '../hemisphericColorSyncDataset'

type HemisphericColorSyncCompleteScreenProps = {
  elapsedMs: number
  correctCount: number
  totalScore: number
  bestStreak: number
  fastestReactionMs: number | null
  bestAccuracyPercentAllTime: number
  bestStreakAllTime: number
  onPlayAgain: () => void
  backHref?: string
}

// A dedicated completion screen, not a reuse of ReadingSessionCompleteScreen
// — that component's stats (Average Reading Pace, Target WPM, Words Read)
// are hard WPM-shaped and don't describe a Stroop conflict sprint
// honestly. Rather than fabricate a WPM/words-read number just to fit
// that shared component's prop contract, this is a small, additive
// screen matching the exact same visual language/classes as every
// sibling gamified exercise's own completion screen, without modifying
// or forking the locked component itself.
export function HemisphericColorSyncCompleteScreen({
  elapsedMs,
  correctCount,
  totalScore,
  bestStreak,
  fastestReactionMs,
  bestAccuracyPercentAllTime,
  bestStreakAllTime,
  onPlayAgain,
  backHref = '/labs/sharp-brain',
}: HemisphericColorSyncCompleteScreenProps): React.JSX.Element {
  const t = useAppT()
  const accuracyPercent = Math.round((correctCount / ROUNDS_PER_SESSION) * 100)
  const isPerfectSprint = correctCount === ROUNDS_PER_SESSION

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{t('exercises.colorSync.complete')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('exercises.colorSync.nice')}</p>
        {isPerfectSprint && (
          <p className="mt-2 text-sm font-semibold text-emerald-600">{t('exercises.colorSync.flawless', { bonus: PERFECT_SESSION_BONUS })}</p>
        )}
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <ReadingStatTile variant="card" label={t('exercises.colorSync.syncAccuracy')} value={`${accuracyPercent}%`} />
        <ReadingStatTile variant="card" label={t('exercises.colorSync.correctMatches')} value={`${correctCount} / ${ROUNDS_PER_SESSION}`} />
        <ReadingStatTile variant="card" label={t('exercises.colorSync.totalPoints')} value={String(totalScore)} />
        <ReadingStatTile variant="card" label={t('exercises.colorSync.bestStreak')} value={String(bestStreak)} />
        <ReadingStatTile
          variant="card"
          label={t('exercises.colorSync.fastestReaction')}
          value={fastestReactionMs === null ? '—' : `${(fastestReactionMs / 1000).toFixed(1)}s`}
        />
        <ReadingStatTile variant="card" label={t('exercises.stats.time')} value={formatElapsedTime(elapsedMs)} />
        <ReadingStatTile variant="card" label={t('exercises.colorSync.bestAccuracyAllTime')} value={`${bestAccuracyPercentAllTime}%`} />
        <ReadingStatTile variant="card" label={t('exercises.colorSync.bestStreakAllTime')} value={String(bestStreakAllTime)} />
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={onPlayAgain}
          className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-all duration-150 hover:opacity-80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('exercises.complete.playAgain')}
        </button>
        <Link
          href={backHref}
          className="rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          {t('exercises.complete.backToLab')}
        </Link>
      </div>
    </div>
  )
}
