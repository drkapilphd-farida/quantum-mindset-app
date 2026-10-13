'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { addNumberCards, getLearnedNumberSets } from '../actions'
import { NUMBER_LEARN_EXERCISE_ID, NUMBER_SETS, pairSounds, setPictures, type NumberList } from '../numberCode'
import { saveSimpleResult } from '../saveResult'
import { shuffle } from '../storyMethod'
import { NumberPictureCard } from './NumberPictureCard'
import { FeedbackSheet, type Feedback } from '@/components/play/FeedbackSheet'
import { answer, current, finished, isRetry, startQueue, willComeBack } from '@/components/play/retryQueue'

const rng = (n: number): number => Math.floor(Math.random() * n)
const PASS = 8

type Stage = { name: 'sets' } | { name: 'cards'; set: number; i: number } | { name: 'quiz'; set: number } | { name: 'result'; set: number; correct: number }

// Learn the number pictures 10 at a time: look at each card (number, picture,
// word, its two sounds) → a 10-question check → 8 or more and the set goes
// into the review queue (tomorrow, then 3, 7, 14 and 30 days).
// In the 30-day plan (planSet given): just that one set, then Continue.
export function NumberLearn({ list, onBack, planSet, onPlanDone }: { list: NumberList; onBack: () => void; planSet?: number; onPlanDone?: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [learned, setLearned] = useState<number[] | null>(null)
  const [stage, setStage] = useState<Stage>(planSet === undefined ? { name: 'sets' } : { name: 'cards', set: planSet, i: 0 })
  const started = useRef(0)

  useEffect(() => {
    void getLearnedNumberSets({ list }).then(setLearned)
  }, [list])

  if (stage.name === 'cards') {
    const pic = setPictures(list, stage.set)[stage.i]!
    const last = stage.i === 9
    return (
      <div className="flex flex-col items-center gap-5" data-number-card={pic.n}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: stage.i + 1, total: 10 })}</p>
        <NumberPictureCard list={list} pair={pic.n} size={110} />
        <p className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-foreground tabular-nums">{t('training.studio.numberSounds', { pair: pic.n, sounds: pairSounds(list, pic.n) })}</p>
        <p className="text-center text-sm text-muted-foreground">{t('training.studio.numberCardHint')}</p>
        <div className="grid w-full grid-cols-2 gap-2">
          <Button variant="outline" size="lg" className="min-h-12 rounded-full" disabled={stage.i === 0} onClick={() => setStage({ ...stage, i: stage.i - 1 })}>
            {t('training.studio.back')}
          </Button>
          <Button
            size="lg"
            className="min-h-12 rounded-full"
            onClick={() => {
              if (!last) return setStage({ ...stage, i: stage.i + 1 })
              started.current = performance.now()
              setStage({ name: 'quiz', set: stage.set })
            }}
            data-number-card-next="true"
          >
            {last ? t('training.studio.pegsCheck') : t('training.studio.next')}
          </Button>
        </div>
      </div>
    )
  }

  if (stage.name === 'quiz')
    return (
      <SetQuiz
        list={list}
        set={stage.set}
        onDone={(correct) => {
          saveSimpleResult(NUMBER_LEARN_EXERCISE_ID, correct, 10, performance.now() - started.current, uiLang)
          if (correct >= PASS) {
            void addNumberCards({ list, set: stage.set, lang: uiLang })
            setLearned((l) => [...new Set([...(l ?? []), stage.set])].sort((a, b) => a - b))
          }
          setStage({ name: 'result', set: stage.set, correct })
        }}
      />
    )

  if (stage.name === 'result') {
    const passed = stage.correct >= PASS
    const next = stage.set + 1 < NUMBER_SETS ? stage.set + 1 : null
    return (
      <div className="flex flex-col gap-4" data-number-learn-result={stage.correct}>
        <h2 className="font-heading text-3xl font-bold text-foreground tabular-nums">{t('training.studio.correctOf', { correct: stage.correct, total: 10 })}</h2>
        <p className="text-sm text-muted-foreground">{passed ? t('training.studio.numberSetDone') : t('training.studio.pegsAgain')}</p>
        {onPlanDone !== undefined && (
          <Button size="lg" className="min-h-12 rounded-full" onClick={onPlanDone} data-number-plan-done="true">
            {t('training.studio.continue')}
          </Button>
        )}
        {onPlanDone !== undefined ? null : passed && next !== null ? (
          <Button size="lg" className="min-h-12 rounded-full" onClick={() => setStage({ name: 'cards', set: next, i: 0 })} data-number-next-set="true">
            {t('training.studio.numberNextSet', { from: `${next}0`, to: `${next}9` })}
          </Button>
        ) : (
          !passed && (
            <Button size="lg" className="min-h-12 rounded-full" onClick={() => setStage({ name: 'cards', set: stage.set, i: 0 })}>
              {t('training.studio.pegsLookAgain')}
            </Button>
          )
        )}
        {onPlanDone === undefined && (
          <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={() => setStage({ name: 'sets' })}>
            {t('training.studio.numberAllSets')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4" data-number-sets={learned?.length ?? -1}>
      <p className="text-sm text-muted-foreground">{t('training.studio.numberSetsIntro')}</p>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: NUMBER_SETS }, (_, set) => {
          const done = learned?.includes(set) ?? false
          return (
            <button
              key={set}
              type="button"
              onClick={() => setStage({ name: 'cards', set, i: 0 })}
              className={`flex min-h-14 items-center justify-between gap-2 rounded-xl border-2 px-3 text-left ${done ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-background'}`}
              data-number-set={set}
            >
              <span className="font-heading text-lg font-bold text-foreground tabular-nums">
                {set}0–{set}9
              </span>
              {done && <Check className="size-5 text-primary" aria-label={t('training.studio.numberLearned')} />}
            </button>
          )
        })}
      </div>
      <Button variant="ghost" size="lg" className="min-h-12 rounded-full" onClick={onBack}>
        {t('training.studio.back')}
      </Button>
    </div>
  )
}

function SetQuiz({ list, set, onDone }: { list: NumberList; set: number; onDone: (correct: number) => void }): React.JSX.Element {
  const t = useAppT()
  const pictures = useMemo(() => setPictures(list, set), [list, set])
  const order = useMemo(
    () =>
      shuffle(
        pictures.map((_, i) => i),
        rng,
      ),
    [pictures],
  )
  const [queue, setQueue] = useState(() => startQueue(order))
  const [pending, setPending] = useState<{ chosen: string; right: boolean; feedback: Feedback } | null>(null)
  const ask = current(queue)
  const target = pictures[ask ?? 0]!
  const options = useMemo(() => shuffle([target, ...shuffle(pictures.filter((x) => x.n !== target.n), rng).slice(0, 3)], rng), [target, pictures])
  if (ask === null) return <div />
  const choose = (n: string): void => {
    if (pending !== null) return
    const right = n === target.n
    setPending({ right, chosen: n, feedback: right ? { kind: 'good', points: isRetry(queue) ? 0 : 2, detail: `${target.n} = ${target.word}` } : { kind: 'warn', answer: t('training.play.answerIs', { answer: `${target.n} = ${target.word}` }), tip: t('training.studio.numberTip', { pair: target.n, sounds: pairSounds(list, target.n) }), comesBack: willComeBack(queue) } })
  }
  const next = (): void => {
    if (pending === null) return
    const q2 = answer(queue, pending.right)
    setPending(null)
    setQueue(q2)
    if (finished(q2)) onDone(q2.correctFirst)
  }
  return (
    <div className="flex flex-col gap-4 pb-56" data-number-quiz={target.n}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: Math.min(queue.pos + 1, queue.order.length), total: queue.order.length })}</p>
      <h2 className="text-2xl text-foreground">{t('training.studio.numberQuiz', { n: target.n })}</h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => {
          const state = pending === null ? 'idle' : o.n === target.n ? 'right' : o.n === pending.chosen ? 'chosen' : 'idle'
          return (
            <button key={o.n} type="button" onClick={() => choose(o.n)} disabled={pending !== null} className="play-option flex min-h-28 items-center justify-center p-2" data-state={state} data-number-option={o.n}>
              <NumberPictureCard list={list} pair={o.n} size={52} showNumber={false} />
            </button>
          )
        })}
      </div>
      {pending !== null && <FeedbackSheet feedback={pending.feedback} onContinue={next} />}
    </div>
  )
}
