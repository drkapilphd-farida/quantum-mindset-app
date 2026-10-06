'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Eye, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { MessageKey, Translator } from '@/lib/app-i18n/translate'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import {
  buildPictureTrial,
  orderMatches,
  PRACTICE_TRIALS,
  picturePoints,
  TRIALS_PER_ROUND,
  type PictureItem,
  type PictureTheme,
  type PictureTrial,
} from '../pictureTraining'

export function pictureName(t: Translator, item: PictureItem): string {
  return t(`training.pictures.items.${item.id}` as MessageKey)
}

function themeName(t: Translator, theme: PictureTheme): string {
  return t(`training.pictures.themes.${theme}` as MessageKey)
}

type Stage = 'study' | 'question' | 'review'

const GAP_MS = 500

export function PictureCard({ item, size = 'md', state }: { item: PictureItem; size?: 'sm' | 'md' | 'lg'; state?: 'right' | 'wrong' | 'dim' | 'selected' }): React.JSX.Element {
  const t = useAppT()
  const emoji = size === 'lg' ? 'text-7xl' : size === 'md' ? 'text-5xl' : 'text-4xl'
  const ring = state === 'right' ? 'border-emerald-500 bg-emerald-500/10' : state === 'selected' ? 'border-primary bg-primary/5' : state === 'wrong' ? 'border-amber-500 bg-amber-500/10' : 'border-border/70 bg-card'
  return (
    <span className={`flex w-full flex-col items-center gap-1 rounded-2xl border-2 px-1 py-2 ${ring} ${state === 'dim' ? 'opacity-40' : ''}`}>
      <span className={`${emoji} leading-none`} role="img" aria-label={pictureName(t, item)}>
        {item.emoji}
      </span>
      <span className="text-center text-[11px] leading-tight font-medium text-foreground">{pictureName(t, item)}</span>
    </span>
  )
}

export function PictureRound({ level, isPractice, onDone }: { level: number; isPractice: boolean; onDone: (o: RoundOutcome) => void }): React.JSX.Element {
  const t = useAppT()
  const count = isPractice ? PRACTICE_TRIALS : TRIALS_PER_ROUND
  const trials = useMemo(() => {
    const list: PictureTrial[] = []
    for (let i = 0; i < count; i++) list.push(buildPictureTrial(level, Math.random, list[i - 1]?.theme))
    return list
  }, [count, level])
  const [index, setIndex] = useState(0)
  const [stage, setStage] = useState<Stage>('study')
  const [studyStep, setStudyStep] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [tapped, setTapped] = useState<PictureItem[]>([])
  const [results, setResults] = useState<{ correct: number; total: number }[]>([])

  const trial = trials[index]

  // Study phase: all pictures together, or one after another for "in order".
  useEffect(() => {
    if (trial === undefined || stage !== 'study') return undefined
    setStudyStep(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    if (trial.mode === 'order') {
      trial.shown.forEach((_, i) => timers.push(setTimeout(() => setStudyStep(i), i * trial.studyMs)))
      timers.push(setTimeout(() => setStudyStep(trial.shown.length), trial.shown.length * trial.studyMs))
      timers.push(setTimeout(() => setStage('question'), trial.shown.length * trial.studyMs + GAP_MS))
    } else {
      timers.push(setTimeout(() => setStudyStep(1), trial.studyMs))
      timers.push(setTimeout(() => setStage('question'), trial.studyMs + GAP_MS))
    }
    return () => timers.forEach(clearTimeout)
  }, [trial, stage])

  if (trial === undefined) return <div />

  function finishTrial(correct: number, total: number): void {
    setResults((prev) => [...prev, { correct, total }])
    setStage('review')
  }

  function choose(i: number): void {
    if (stage !== 'question' || trial === undefined) return
    setChosen(i)
    finishTrial(i === trial.correctIndex ? 1 : 0, 1)
  }

  function tap(item: PictureItem): void {
    if (stage !== 'question' || trial === undefined || tapped.some((x) => x.id === item.id)) return
    const next = [...tapped, item]
    setTapped(next)
    if (next.length === trial.shown.length) finishTrial(orderMatches(trial.shown, next), trial.shown.length)
  }

  function next(): void {
    if (index + 1 < trials.length) {
      setIndex(index + 1)
      setChosen(null)
      setTapped([])
      setStage('study')
      return
    }
    const correct = results.reduce((s, r) => s + r.correct, 0)
    const total = results.reduce((s, r) => s + r.total, 0)
    onDone({ correct, total, score: picturePoints(level, correct) })
  }

  const cols = trial.shown.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
  const optionCols = trial.options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
  const last = results[index]

  return (
    <div className="flex w-full flex-col items-center gap-3" data-picture-trial={index} data-stage={stage} data-mode={trial.mode}>
      <p className="text-xs text-muted-foreground">
        {t('training.pictures.trialOf', { n: index + 1, total: trials.length })} · {themeName(t, trial.theme)}
      </p>

      {stage === 'study' && (
        <>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Eye className="size-4 text-primary" aria-hidden="true" />
            {trial.mode === 'order' ? t('training.pictures.watchOrder') : t('training.pictures.remember', { n: trial.shown.length })}
          </p>
          {trial.mode === 'order' ? (
            <div className="flex h-52 w-48 items-center justify-center">
              {studyStep < trial.shown.length && trial.shown[studyStep] !== undefined && (
                <div key={studyStep} className="w-full motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
                  <PictureCard item={trial.shown[studyStep]!} size="lg" />
                </div>
              )}
            </div>
          ) : studyStep === 0 ? (
            <div className={`grid w-full gap-2 ${cols}`}>
              {trial.shown.map((item) => (
                <PictureCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="h-52" />
          )}
          {trial.mode === 'order' && (
            <div className="flex gap-1.5" aria-hidden="true">
              {trial.shown.map((item, i) => (
                <span key={item.id} className={`size-2 rounded-full ${i <= studyStep ? 'bg-primary' : 'bg-border'}`} />
              ))}
            </div>
          )}
          {trial.mode !== 'order' && studyStep === 0 && <StudyTimer ms={trial.studyMs} />}
        </>
      )}

      {stage !== 'study' && (
        <>
          <p className="text-center text-sm font-semibold text-foreground" aria-live="polite">
            {trial.mode === 'seen' ? t('training.pictures.whichSeen') : trial.mode === 'notSeen' ? t('training.pictures.whichNotSeen') : t('training.pictures.tapOrder', { n: trial.shown.length })}
          </p>
          {trial.mode === 'order' ? (
            <>
              <div className={`grid w-full gap-2 ${optionCols}`}>
                {trial.options.map((item) => {
                  const pos = tapped.findIndex((x) => x.id === item.id)
                  const reviewState = stage === 'review' ? (trial.shown.findIndex((s) => s.id === item.id) === -1 ? 'dim' : pos !== -1 && trial.shown[pos]?.id === item.id ? 'right' : 'wrong') : undefined
                  return (
                    <button key={item.id} type="button" onClick={() => tap(item)} disabled={stage === 'review'} className="relative transition-transform active:scale-95" data-picture-option={item.id}>
                      <PictureCard item={item} size="sm" {...(reviewState ? { state: reviewState } : pos !== -1 ? { state: 'selected' as const } : {})} />
                      {pos !== -1 && <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{pos + 1}</span>}
                    </button>
                  )
                })}
              </div>
              {stage === 'question' && tapped.length > 0 && (
                <button type="button" onClick={() => setTapped(tapped.slice(0, -1))} className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Undo2 className="size-3.5" aria-hidden="true" />
                  {t('training.pictures.undo')}
                </button>
              )}
            </>
          ) : (
            <div className={`grid w-full gap-2 ${optionCols}`}>
              {trial.options.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={stage === 'review'}
                  className="transition-transform active:scale-95"
                  data-picture-option={item.id}
                  data-correct={i === trial.correctIndex ? 'true' : undefined}
                >
                  <PictureCard item={item} {...(stage === 'review' ? { state: i === trial.correctIndex ? ('right' as const) : i === chosen ? ('wrong' as const) : ('dim' as const) } : {})} />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {stage === 'review' && last !== undefined && (
        <div className="flex w-full flex-col items-center gap-2" data-answer={last.correct === last.total ? 'correct' : 'wrong'}>
          <p className={`text-sm font-semibold ${last.correct === last.total ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-300'}`}>
            {trial.mode === 'order'
              ? t('training.pictures.orderResult', { correct: last.correct, total: last.total })
              : last.correct === 1
                ? t('training.shell.correct')
                : t('training.shell.notQuite')}
          </p>
          <div className="flex w-full flex-wrap items-center justify-center gap-1 text-xs text-muted-foreground">
            <span>{t('training.pictures.youSaw')}</span>
            {trial.shown.map((item, i) => (
              <span key={item.id} className="rounded-full bg-muted px-2 py-0.5">
                {trial.mode === 'order' ? `${i + 1}. ` : ''}
                {item.emoji} {pictureName(t, item)}
              </span>
            ))}
          </div>
          <Button className="w-full rounded-full" size="lg" onClick={next} data-next-trial="true">
            {t('training.shell.next')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}

function StudyTimer({ ms }: { ms: number }): React.JSX.Element {
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setStarted(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
      <div className="h-full bg-primary/60 ease-linear" style={{ width: started ? '0%' : '100%', transition: `width ${ms}ms linear` }} />
    </div>
  )
}
