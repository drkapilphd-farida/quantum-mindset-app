'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { itemName, STORY_ITEMS, type StudioItem, type StudioLang } from '../content'
import type { PalaceQuestion } from '../palaces'
import { StudioPicture } from './StudioPicture'
import { FeedbackSheet, type Feedback } from '@/components/play/FeedbackSheet'
import { answer, current, finished, isRetry, startQueue, willComeBack } from '@/components/play/retryQueue'

// One round in the learner's own palace: walk the stations, leaving one item
// at each (a vivid picture of the two together) → walk again and say what is
// at each station.
export function PalaceRound({ stations, items, questions, pictures, lang, level, onDone }: { stations: readonly string[]; items: readonly StudioItem[]; questions: readonly PalaceQuestion[]; pictures: boolean; lang: StudioLang; level: number; onDone: (o: RoundOutcome) => void }): React.JSX.Element {
  const t = useAppT()
  const [study, setStudy] = useState(0)
  const [q, setQ] = useState<number | null>(null)
  const [queue, setQueue] = useState(() => startQueue(questions.map((_, i) => i)))
  const [pending, setPending] = useState<{ chosen: string; right: boolean; feedback: Feedback } | null>(null)
  const name = (id: string): string => itemName(STORY_ITEMS.find((i) => i.id === id)!, lang)

  if (q === null) {
    const item = items[study]!
    return (
      <div className="flex flex-col items-center gap-5" data-palace-study={study}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: study + 1, total: items.length })}</p>
        <p className="text-center font-heading text-3xl font-bold break-words text-foreground">{stations[study]}</p>
        {pictures ? <StudioPicture id={item.id} label={itemName(item, lang)} size={84} /> : <p className="text-2xl font-semibold text-foreground">{itemName(item, lang)}</p>}
        <p className="text-center text-sm text-muted-foreground">{t('training.studio.palaceStudyHint')}</p>
        <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => (study + 1 < items.length ? setStudy(study + 1) : setQ(0))} data-palace-next="true">
          {t('training.studio.next')}
        </Button>
      </div>
    )
  }
  const ask = current(queue)
  if (ask === null) return <div />
  const question = questions[ask]!
  const choose = (id: string): void => {
    if (pending !== null) return
    const right = id === question.answer
    setPending({ right, chosen: id, feedback: right ? { kind: 'good', points: isRetry(queue) ? 0 : level * 2, detail: `${stations[question.station]} → ${name(question.answer)}` } : { kind: 'warn', answer: t('training.play.answerIs', { answer: `${stations[question.station]} → ${name(question.answer)}` }), tip: t('training.studio.palaceTip'), comesBack: willComeBack(queue) } })
  }
  const next = (): void => {
    if (pending === null) return
    const q2 = answer(queue, pending.right)
    setPending(null)
    setQueue(q2)
    if (finished(q2)) onDone({ correct: q2.correctFirst, total: questions.length, score: q2.correctFirst * level })
  }
  return (
    <div className="flex flex-col gap-4 pb-56" data-palace-question={question.station}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: Math.min(queue.pos + 1, queue.order.length), total: queue.order.length })}</p>
      <h2 className="text-2xl break-words text-foreground">{t('training.studio.palaceQuestion', { station: stations[question.station]! })}</h2>
      <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3">
        {question.options.map((id) => {
          const state = pending === null ? 'idle' : id === question.answer ? 'right' : id === pending.chosen ? 'chosen' : 'idle'
          return (
            <button key={id} type="button" onClick={() => choose(id)} disabled={pending !== null} className="play-option flex min-h-24 flex-col items-center justify-center p-2" data-state={state} data-palace-option={id}>
              {pictures ? <StudioPicture id={id} label={name(id)} size={48} /> : <span className="text-lg font-semibold text-foreground">{name(id)}</span>}
            </button>
          )
        })}
      </div>
      {pending !== null && <FeedbackSheet feedback={pending.feedback} onContinue={next} />}
    </div>
  )
}
