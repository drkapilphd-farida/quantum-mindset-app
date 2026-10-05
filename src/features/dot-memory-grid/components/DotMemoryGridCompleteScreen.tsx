'use client'

import Link from 'next/link'
import { useAppT } from '@/lib/app-i18n/client'
import { ReadingStatTile } from '@/features/reading-engine/components/ReadingStatTile'
import { formatElapsedTime } from '@/features/quantum-speed-reading/readingSessionEngine'
import { DOT_MEMORY_GRID_ROUNDS_PER_SESSION, computeAccuracyPercent } from '../dotMemoryGridEngine'

type DotMemoryGridCompleteScreenProps = {
  elapsedMs: number
  totalCorrect: number
  totalDots: number
  bestStreak: number
  bestScorePercentAllTime: number
  bestStreakAllTime: number
  onPlayAgain: () => void
  backHref?: string
}

// A dedicated completion screen, not a reuse of ReadingSessionCompleteScreen
// — that component's stats (Average Reading Pace, Target WPM, Words Read)
// are hard WPM-shaped and don't describe a spatial memorize-then-tap game
// honestly. Same visual language/classes as
// SchulteGridDrillCompleteScreen.tsx / EspZenerTelepathyCompleteScreen.tsx,
// without modifying or forking either locked component.
export function DotMemoryGridCompleteScreen({
  elapsedMs,
  totalCorrect,
  totalDots,
  bestStreak,
  bestScorePercentAllTime,
  bestStreakAllTime,
  onPlayAgain,
  backHref = '/labs/sharp-brain',
}: DotMemoryGridCompleteScreenProps): React.JSX.Element {
  const t = useAppT()
  const accuracyPercent = computeAccuracyPercent(totalCorrect, totalDots)

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{t('exercises.complete.sessionComplete')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('exercises.dotMemory.nice')}</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <ReadingStatTile variant="card" label={t('exercises.stats.roundsPlayed')} value={String(DOT_MEMORY_GRID_ROUNDS_PER_SESSION)} />
        <ReadingStatTile variant="card" label={t('exercises.common.correctPlacements')} value={`${totalCorrect} / ${totalDots}`} />
        <ReadingStatTile variant="card" label={t('exercises.stats.accuracy')} value={`${accuracyPercent}%`} />
        <ReadingStatTile variant="card" label={t('exercises.stats.bestStreak')} value={String(bestStreak)} />
        <ReadingStatTile variant="card" label={t('exercises.stats.time')} value={formatElapsedTime(elapsedMs)} />
        <ReadingStatTile variant="card" label={t('exercises.stats.bestAccuracyAllTime')} value={`${bestScorePercentAllTime}%`} />
        <ReadingStatTile variant="card" label={t('exercises.stats.bestStreakAllTime')} value={String(bestStreakAllTime)} />
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
