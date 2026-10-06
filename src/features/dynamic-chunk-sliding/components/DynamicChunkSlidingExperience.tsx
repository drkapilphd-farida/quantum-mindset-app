'use client'

import { useAppI18n } from '@/lib/app-i18n/client'
import { practiceContentLang } from '@/lib/app-i18n/practiceContent'
import { PracticeTextNote } from '@/lib/app-i18n/PracticeTextNote'
import { AdaptiveExerciseShell, type RoundOutcome, type SessionSummary } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { ChunkReadingRound } from '@/features/exercise-core/components/ChunkReadingRound'
import { ChunkDemo } from '@/features/exercise-core/components/ChunkDemo'
import { chunkLevel, DYNAMIC_CHUNK_LEVELS, ROUNDS_PER_SESSION } from '@/features/exercise-core/chunkReading'
import type { PassageLang } from '@/features/exercise-core/readingPassages'

const mean = (rounds: readonly RoundOutcome[]): number => (rounds.length === 0 ? 0 : rounds.reduce((s, r) => s + r.score, 0) / rounds.length)

// Dynamic Chunk Sliding — rebuilt on the shared 10-level trainer. A short
// passage slides past a few words at a time (the current chunk highlighted,
// a progress bar on top). Then 2–3 recall questions and a one-line summary.
// Score = reading pace × comprehension ("effective WPM"). Chunk size grows
// 1 → 2 → 3 words with level.
type Props = { onComplete?: (accuracyPercent: number, session: SessionSummary) => void; onExit?: () => void }

export function DynamicChunkSlidingExperience({ onComplete, onExit }: Props = {}): React.JSX.Element {
  const { t, lang } = useAppI18n()
  const contentLang = practiceContentLang(lang, 'chunkPassages') as PassageLang
  return (
    <AdaptiveExerciseShell
      exerciseId="dynamic-chunk-sliding"
      title={t('training.chunks.dynamicTitle')}
      skill={t('training.skills.smartReading')}
      purpose={t('training.chunks.dynamicPurpose')}
      minutes={3}
      demo={[
        { caption: t('training.chunks.demo1'), visual: <ChunkDemo layout="horizontal" lang={contentLang} /> },
        { caption: t('training.chunks.demo2'), visual: <ChunkDemo layout="horizontal" lang={contentLang} step="question" /> },
        { caption: t('training.chunks.demo3Dynamic'), visual: <ChunkDemo layout="horizontal" lang={contentLang} step="score" /> },
      ]}
      roundsPerSession={ROUNDS_PER_SESSION}
      scoreLabel={t('training.chunks.scoreLabel')}
      combineScore={mean}
      contentLang={contentLang}
      introNote={<PracticeTextNote kind="chunkPassages" />}
      describeLevel={(level) => {
        const c = chunkLevel(DYNAMIC_CHUNK_LEVELS, level)
        return t('training.chunks.levelHint', { chunk: c.chunkWords, wpm: c.wpm })
      }}
      renderRound={({ level, isPractice, onDone }) => (
        <ChunkReadingRound layout="horizontal" levels={DYNAMIC_CHUNK_LEVELS} level={level} isPractice={isPractice} lang={contentLang} withSummary onDone={onDone} />
      )}
      {...(onComplete ? { onComplete } : {})}
      {...(onExit ? { onExit } : {})}
    />
  )
}
