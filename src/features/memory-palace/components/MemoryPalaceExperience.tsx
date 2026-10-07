'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { resolveCurriculumDay, useExerciseProgress } from '@/features/exercise-core/useExerciseProgress'
import { useCurriculumDayInfo } from '@/features/thirty-day-curriculum/embeddedExerciseContext'
import { useGuidedNarration, type NarrationLine } from '@/features/guided-audio/useGuidedNarration'
import { NarrationBar } from '@/features/guided-audio/components/NarrationBar'
import { getPendingPalace, type PendingPalace } from '../actions/palaceActions'
import { loadPalaceScript } from '../script/loadScript'
import { applyPalaceSession, encodeObjects, levelConfig, MEMORY_PALACE_EXERCISE_ID, pickObjects, recallScore } from '../memoryPalace'
import { loadLastObjects, saveLastObjects, saveTodayPalace } from '../todayPalace'
import { ObjectPicture, objectNameKey, placeNameKey, RecallBoard } from './RecallBoard'
import { PalaceRecallStep } from './PalaceRecallStep'

type Stage = 'loading' | 'next-day' | 'intro' | 'guided' | 'recall' | 'result' | 'closing'

type MemoryPalaceExperienceProps = { onComplete?: () => void; onExit?: () => void }

const PLACE_LEAVE_LINE_COUNT = 3 // "Leave it there, and walk on." after the first 3 places only

// Memory Palace: settle → build the palace in your own home → place one
// vivid object at each place → walk back → immediate recall (scored). A
// palace waiting from an earlier session is recalled first (next-day
// recall). In the 30-day plan the day's player adds the end-of-session recall
// after the day's other exercises.
export function MemoryPalaceExperience({ onComplete, onExit }: MemoryPalaceExperienceProps): React.JSX.Element {
  const t = useAppT()
  const lang = useUiLang()
  const dayFromContext = useCurriculumDayInfo()
  const { progress, save } = useExerciseProgress(MEMORY_PALACE_EXERCISE_ID)
  const narration = useGuidedNarration(MEMORY_PALACE_EXERCISE_ID, lang)
  const [stage, setStage] = useState<Stage>('loading')
  const [pending, setPending] = useState<PendingPalace | null>(null)
  const [script, setScript] = useState<Map<string, NarrationLine> | null>(null)
  const [placeIndex, setPlaceIndex] = useState<number | null>(null)
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null)
  const cancelled = useRef(false)
  const startedAt = useRef(0)

  const level = progress.levelState.level
  const config = levelConfig(level)
  const [objects, setObjects] = useState<string[]>([])
  const palaceId = useMemo(() => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`), [])

  useEffect(() => {
    void loadPalaceScript(lang).then(setScript)
  }, [lang])

  useEffect(() => {
    if (!progress.ready) return
    let alive = true
    void getPendingPalace()
      .catch(() => null)
      .then((p) => {
        if (!alive) return
        setPending(p)
        setStage(p ? 'next-day' : 'intro')
      })
    return () => {
      alive = false
    }
  }, [progress.ready])

  useEffect(() => {
    cancelled.current = false
    return () => {
      cancelled.current = true
      narration.stop()
    }
  }, [narration.stop]) // eslint-disable-line react-hooks/exhaustive-deps

  async function say(id: string, nextId?: string): Promise<void> {
    const line = script?.get(id)
    if (!line || cancelled.current) return
    const next = nextId ? script?.get(nextId) : undefined
    await narration.speak(line, next)
  }

  async function runGuided(): Promise<void> {
    narration.unlock()
    const chosen = pickObjects(config.places, loadLastObjects())
    setObjects(chosen)
    startedAt.current = Date.now()
    setStage('guided')
    const opening = ['common-01', 'common-02', 'common-03', 'common-04', 'common-05', 'common-06', 'common-07', 'common-08', 'common-09']
    for (let i = 0; i < opening.length; i++) {
      await say(opening[i]!, opening[i + 1] ?? 'place-01')
      if (cancelled.current) return
    }
    for (let i = 0; i < chosen.length; i++) {
      setPlaceIndex(i)
      const placeLine = `place-${String(i + 1).padStart(2, '0')}`
      const objectLine = `object-${chosen[i]}`
      await say(placeLine, objectLine)
      await say(objectLine, i < PLACE_LEAVE_LINE_COUNT ? 'common-10' : undefined)
      if (i < PLACE_LEAVE_LINE_COUNT) await say('common-10')
      if (cancelled.current) return
    }
    setPlaceIndex(null)
    await say('common-11', 'common-12')
    await say('common-12', 'common-13')
    if (cancelled.current) return
    setStage('recall')
    await say('common-13')
  }

  function recalled(correct: number): void {
    narration.stop()
    const total = objects.length
    const { score, accuracyPercent } = recallScore(correct, total)
    const next = applyPalaceSession(progress.levelState, total > 0 ? correct / total : 0)
    setResult({ correct, total })
    setStage('result')
    saveLastObjects(objects)
    const dayInfo = resolveCurriculumDay(MEMORY_PALACE_EXERCISE_ID, dayFromContext)
    if (dayInfo !== null) saveTodayPalace({ palaceId, objects, level, day: dayInfo.day, createdAt: Date.now() })
    void save({
      score,
      accuracyPercent,
      levelStart: level,
      levelState: next,
      rounds: total,
      durationMs: Date.now() - startedAt.current,
      extra: { phase: 'immediate', palaceId, places: total, objects: encodeObjects(objects), level, narrationLang: lang },
    })
  }

  async function close(): Promise<void> {
    setStage('closing')
    await say('common-15', 'common-16')
    await say('common-16')
    if (!cancelled.current) onComplete?.()
  }

  const shell = (children: React.ReactNode): React.JSX.Element => (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center gap-5 px-4 py-6" data-memory-palace={stage}>
      {onExit && (
        <button type="button" onClick={onExit} className="flex size-12 items-center justify-center self-start rounded-full text-muted-foreground" aria-label={t('exercises.exitExercise')}>
          <X className="size-5" aria-hidden="true" />
        </button>
      )}
      {children}
    </div>
  )

  if (stage === 'loading' || script === null) return shell(<p className="text-sm text-muted-foreground">{t('training.shell.loading')}</p>)

  if (stage === 'next-day' && pending) {
    return (
      <PalaceRecallStep
        palace={pending}
        phase="next-day"
        delay={{ label: pending.label, days: pending.days, hoursSince: pending.hoursSince }}
        onDone={() => setStage('intro')}
        onNotNow={() => setStage('intro')}
      />
    )
  }

  const bar = (
    <NarrationBar line={narration.current} source={narration.source} muted={narration.muted} volume={narration.volume} onMutedChange={narration.setMuted} onVolumeChange={narration.setVolume} onReplay={narration.replay} />
  )

  if (stage === 'intro') {
    return shell(
      <>
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.skills.memory')}</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-foreground">{t('training.palace.title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('training.palace.purpose')}</p>
        </div>
        <ol className="flex w-full flex-col gap-2 text-sm text-foreground">
          {(['demo1', 'demo2', 'demo3'] as const).map((k, i) => (
            <li key={k} className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3">
              <span className="font-semibold text-primary">{i + 1}</span>
              {t(`training.palace.${k}`)}
            </li>
          ))}
        </ol>
        <p className="text-xs text-muted-foreground" data-level={level}>
          {t('training.shell.levelOfMax', { level, max: 10 })} · {t('training.palace.levelHint', { places: config.places, choices: config.choices })}
        </p>
        <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => void runGuided()} data-palace-begin="true">
          {t('training.palace.begin')}
        </Button>
      </>,
    )
  }

  if (stage === 'guided') {
    const objectId = placeIndex === null ? null : objects[placeIndex]
    return shell(
      <>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          {placeIndex === null ? t('training.palace.yourPalace') : t('training.palace.placeOf', { n: placeIndex + 1, total: objects.length })}
        </p>
        <div className="flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-3xl border border-border/60 bg-card p-6" data-palace-place={placeIndex === null ? '' : placeIndex + 1}>
          {placeIndex === null || objectId === null || objectId === undefined ? (
            <span className="text-5xl" aria-hidden="true">🏠</span>
          ) : (
            <>
              <p className="font-heading text-xl font-bold text-foreground">{t(placeNameKey(placeIndex))}</p>
              <ObjectPicture id={objectId} size={112} />
              <p className="text-base font-medium text-foreground">{t(objectNameKey(objectId))}</p>
            </>
          )}
        </div>
        {bar}
      </>,
    )
  }

  if (stage === 'recall') {
    return shell(
      <>
        <RecallBoard objects={objects} level={level} onFinished={recalled} />
        {bar}
      </>,
    )
  }

  return shell(
    <div className="flex w-full flex-col items-center gap-4 text-center" data-palace-result={result ? `${result.correct}/${result.total}` : ''}>
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.palace.recallTitle')}</p>
      {result && <p className="font-heading text-3xl font-bold text-foreground">{t('training.palace.resultLine', { correct: result.correct, total: result.total })}</p>}
      <p className="text-sm text-muted-foreground">{t('training.palace.savedMemory')}</p>
      {stage === 'closing' ? (
        bar
      ) : (
        <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => void close()} data-palace-continue="true">
          {t('training.palace.continue')}
        </Button>
      )}
    </div>,
  )
}
