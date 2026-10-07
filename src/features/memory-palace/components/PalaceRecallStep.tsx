'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { useExerciseProgress } from '@/features/exercise-core/useExerciseProgress'
import { useGuidedNarration } from '@/features/guided-audio/useGuidedNarration'
import { NarrationBar } from '@/features/guided-audio/components/NarrationBar'
import { loadPalaceScript } from '../script/loadScript'
import { encodeObjects, MEMORY_PALACE_EXERCISE_ID, NEXT_DAY_RECALL_EXERCISE_ID, recallScore, SAME_DAY_RECALL_EXERCISE_ID, type DelayLabel, type Palace } from '../memoryPalace'
import { RecallBoard } from './RecallBoard'

type PalaceRecallStepProps = {
  palace: Palace
  phase: 'same-day' | 'next-day'
  delay?: { label: DelayLabel; days: number; hoursSince: number }
  onDone: () => void
  /** Next-day recall only: leave it for the next session (it stays due until 7 days). */
  onNotNow?: () => void
}

// The end-of-session and next-day recalls: the voice invites the learner to
// walk the palace again, then the recall board; scored and saved as its own
// exercise (memory-palace-same-day / memory-palace-next-day) so it never
// changes the Memory Palace level.
export function PalaceRecallStep({ palace, phase, delay, onDone, onNotNow }: PalaceRecallStepProps): React.JSX.Element {
  const t = useAppT()
  const lang = useUiLang()
  const narration = useGuidedNarration(MEMORY_PALACE_EXERCISE_ID, lang)
  const { save } = useExerciseProgress(phase === 'same-day' ? SAME_DAY_RECALL_EXERCISE_ID : NEXT_DAY_RECALL_EXERCISE_ID)
  const [stage, setStage] = useState<'intro' | 'recall' | 'result'>('intro')
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null)
  const startedAt = useRef(Date.now())

  const title = phase === 'same-day' ? t('training.palace.sameDayTitle') : t('training.palace.nextDayTitle')
  const intro =
    phase === 'same-day'
      ? t('training.palace.sameDayIntro')
      : delay?.label === '48h'
        ? t('training.palace.nextDayIntro48')
        : delay?.label === 'later'
          ? t('training.palace.nextDayIntroLater', { days: delay.days })
          : t('training.palace.nextDayIntro24')

  useEffect(() => () => narration.stop(), [narration.stop]) // eslint-disable-line react-hooks/exhaustive-deps

  async function begin(): Promise<void> {
    narration.unlock()
    const script = await loadPalaceScript(lang)
    const line = script.get(phase === 'same-day' ? 'common-14' : 'common-17')
    setStage('recall')
    if (line) await narration.speak(line)
  }

  function finished(correct: number): void {
    narration.stop()
    const total = palace.objects.length
    setResult({ correct, total })
    setStage('result')
    const { score, accuracyPercent } = recallScore(correct, total)
    void save({
      score,
      accuracyPercent,
      levelStart: null,
      levelState: null,
      rounds: total,
      durationMs: Date.now() - startedAt.current,
      extra: {
        phase,
        palaceId: palace.palaceId,
        places: total,
        objects: encodeObjects(palace.objects),
        level: palace.level,
        narrationLang: lang,
        ...(delay ? { hoursSince: delay.hoursSince, delayLabel: delay.label } : {}),
      },
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-4 py-6" data-palace-recall={phase}>
      <div className="text-center">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.palace.title')}</p>
        <h2 className="mt-1 font-heading text-2xl font-bold text-foreground">{title}</h2>
        {stage !== 'result' && <p className="mt-2 text-sm text-muted-foreground">{intro}</p>}
      </div>

      {stage === 'intro' && (
        <div className="flex w-full flex-col gap-2">
          <Button size="lg" className="min-h-12 rounded-full" onClick={() => void begin()} data-recall-begin="true">
            {t('training.palace.begin')}
          </Button>
          {onNotNow && (
            <Button variant="ghost" size="lg" className="min-h-12" onClick={onNotNow}>
              {t('training.palace.notNow')}
            </Button>
          )}
        </div>
      )}

      {stage === 'recall' && (
        <>
          <RecallBoard objects={palace.objects} level={palace.level} onFinished={finished} />
          <NarrationBar line={narration.current} source={narration.source} muted={narration.muted} volume={narration.volume} onMutedChange={narration.setMuted} onVolumeChange={narration.setVolume} onReplay={narration.replay} />
        </>
      )}

      {stage === 'result' && result && (
        <div className="flex w-full flex-col items-center gap-4 text-center" data-recall-result={`${result.correct}/${result.total}`}>
          <p className="font-heading text-3xl font-bold text-foreground">{t('training.palace.resultLine', { correct: result.correct, total: result.total })}</p>
          <p className="text-sm text-muted-foreground">{t('training.palace.savedMemory')}</p>
          <Button size="lg" className="min-h-12 w-full rounded-full" onClick={onDone} data-recall-continue="true">
            {t('training.palace.continue')}
          </Button>
        </div>
      )}
    </div>
  )
}
