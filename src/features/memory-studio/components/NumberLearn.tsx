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

const rng = (n: number): number => Math.floor(Math.random() * n)
const PASS = 8

type Stage = { name: 'sets' } | { name: 'cards'; set: number; i: number } | { name: 'quiz'; set: number } | { name: 'result'; set: number; correct: number }

// Learn the number pictures 10 at a time: look at each card (number, picture,
// word, its two sounds) → a 10-question check → 8 or more and the set goes
// into the review queue (tomorrow, then 3, 7, 14 and 30 days).
export function NumberLearn({ list, onBack }: { list: NumberList; onBack: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [learned, setLearned] = useState<number[] | null>(null)
  const [stage, setStage] = useState<Stage>({ name: 'sets' })
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
        {passed && next !== null ? (
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
        <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={() => setStage({ name: 'sets' })}>
          {t('training.studio.numberAllSets')}
        </Button>
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
  const order = useMemo(() => shuffle(pictures, rng), [pictures])
  const [q, setQ] = useState(0)
  const [correct, setCorrect] = useState(0)
  const target = order[q]!
  const options = useMemo(() => shuffle([target, ...shuffle(pictures.filter((x) => x.n !== target.n), rng).slice(0, 3)], rng), [target, pictures])
  return (
    <div className="flex flex-col gap-4" data-number-quiz={target.n}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: 10 })}</p>
      <h2 className="text-xl font-bold text-foreground">{t('training.studio.numberQuiz', { n: target.n })}</h2>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => (
          <button
            key={o.n}
            type="button"
            onClick={() => {
              const total = correct + (o.n === target.n ? 1 : 0)
              if (q + 1 < 10) {
                setCorrect(total)
                setQ(q + 1)
              } else onDone(total)
            }}
            className="flex min-h-24 items-center justify-center rounded-xl border-2 border-border/60 bg-background p-2 active:border-primary"
            data-number-option={o.n}
          >
            <NumberPictureCard list={list} pair={o.n} size={44} showNumber={false} />
          </button>
        ))}
      </div>
    </div>
  )
}
