'use client'

import { useAppI18n } from '@/lib/app-i18n/client'
import { practiceContentLang } from '@/lib/app-i18n/practiceContent'
import { PracticeTextNote } from '@/lib/app-i18n/PracticeTextNote'
import { AdaptiveExerciseShell, type RoundOutcome, type SessionSummary } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { ChunkReadingRound } from '@/features/exercise-core/components/ChunkReadingRound'
import { ChunkDemo } from '@/features/exercise-core/components/ChunkDemo'
import { chunkLevel, ROUNDS_PER_SESSION, VERTICAL_CHUNK_LEVELS } from '@/features/exercise-core/chunkReading'
import type { PassageLang } from '@/features/exercise-core/readingPassages'

const mean = (rounds: readonly RoundOutcome[]): number => (rounds.length === 0 ? 0 : rounds.reduce((s, r) => s + r.score, 0) / rounds.length)

// Vertical Chunk Sliding — rebuilt on the shared 10-level trainer. The
// passage moves up a column, one word at a time at first (long words always
// on their own), then 2 and 3 words. A comprehension check follows each passage.
type Props = { onComplete?: (accuracyPercent: number, session: SessionSummary) => void; onExit?: () => void }

export function VerticalChunkSlidingExperience({ onComplete, onExit }: Props = {}): React.JSX.Element {
  const { t, lang } = useAppI18n()
  const contentLang = practiceContentLang(lang, 'chunkPassages') as PassageLang
  return (
    <AdaptiveExerciseShell
      exerciseId="vertical-chunk-sliding"
      title={t('training.chunks.verticalTitle')}
      skill={t('training.skills.smartReading')}
      purpose={t('training.chunks.verticalPurpose')}
      minutes={3}
      demo={[
        { caption: t('training.chunks.demo1Vertical'), visual: <ChunkDemo layout="vertical" lang={contentLang} /> },
        { caption: t('training.chunks.demo2'), visual: <ChunkDemo layout="vertical" lang={contentLang} step="question" /> },
        { caption: t('training.chunks.demo3Vertical'), visual: <ChunkDemo layout="vertical" lang={contentLang} step="score" /> },
      ]}
      roundsPerSession={ROUNDS_PER_SESSION}
      scoreLabel={t('training.chunks.scoreLabel')}
      combineScore={mean}
      contentLang={contentLang}
      introNote={<PracticeTextNote kind="chunkPassages" />}
      describeLevel={(level) => {
        const c = chunkLevel(VERTICAL_CHUNK_LEVELS, level)
        return t('training.chunks.levelHint', { chunk: c.chunkWords, wpm: c.wpm })
      }}
      renderRound={({ level, isPractice, onDone }) => (
        <ChunkReadingRound layout="vertical" levels={VERTICAL_CHUNK_LEVELS} level={level} isPractice={isPractice} lang={contentLang} withSummary={false} onDone={onDone} />
      )}
      {...(onComplete ? { onComplete } : {})}
      {...(onExit ? { onExit } : {})}
    />
  )
}
