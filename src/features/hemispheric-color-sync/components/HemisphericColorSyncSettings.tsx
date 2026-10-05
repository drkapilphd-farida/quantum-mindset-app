'use client'

import Link from 'next/link'
import { useAppT } from '@/lib/app-i18n/client'
import { PracticeTextNote } from '@/lib/app-i18n/PracticeTextNote'
import { BrandWatermark } from '@/components/brand/BrandWatermark'
import { useIsEmbeddedExercise } from '@/features/thirty-day-curriculum/embeddedExerciseContext'
import { WhyThisDrillWorks } from '@/components/exercises/WhyThisDrillWorks'
import { ROUNDS_PER_SESSION, RECALL_TIME_LIMIT_MS } from '../hemisphericColorSyncDataset'

type HemisphericColorSyncSettingsProps = {
  onStart: () => void
}

// No per-attempt configuration exists (the recall window and round count
// are fixed, and there's no target-pace concept for a pure conflict-
// resolution task), so this screen is purely the instructions/intro gate
// every advanced exercise has before Start.
export function HemisphericColorSyncSettings({ onStart }: HemisphericColorSyncSettingsProps): React.JSX.Element {
  const t = useAppT()
  const isEmbedded = useIsEmbeddedExercise()
  const recallSeconds = (RECALL_TIME_LIMIT_MS / 1000).toFixed(1)

  return (
    <div className={`relative mx-auto flex ${isEmbedded ? 'h-full' : 'min-h-[100dvh]'} max-w-md flex-col items-center justify-center gap-8 px-6 py-16 text-center`}>
      {!isEmbedded && <BrandWatermark className="absolute top-4 left-6" />}
      {!isEmbedded && (
        <Link
          href="/dashboard"
          className="absolute top-4 right-6 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
        >
          {t('exercises.exit')}
        </Link>
      )}

      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Color-Word Sync Grid</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t('exercises.colorSync.desc')}</p>
      </div>

      <WhyThisDrillWorks>
        {t('exercises.colorSync.why', { seconds: recallSeconds, rounds: ROUNDS_PER_SESSION })}
      </WhyThisDrillWorks>

      <PracticeTextNote kind="wordList" />

      <button
        onClick={onStart}
        className="rounded-full bg-foreground px-10 py-3 text-sm font-medium text-background transition-all duration-150 hover:opacity-80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {t('exercises.start')}
      </button>
    </div>
  )
}
