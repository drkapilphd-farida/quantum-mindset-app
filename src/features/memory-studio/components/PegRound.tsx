'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { itemName, STORY_ITEMS, type PegSet, type StudioItem, type StudioLang } from '../content'
import type { PegQuestion } from '../pegMethod'
import { PegPicture } from './PegPicture'
import { StudioPicture } from './StudioPicture'
import { FeedbackSheet, type Feedback } from '@/components/play/FeedbackSheet'
import { answer, current, finished, isRetry, startQueue, willComeBack } from '@/components/play/retryQueue'

// One Peg-method round: each item on its number's peg (one picture of the two
// together) → "what was on number n?" for every number (in order, or mixed).
export function PegRound({
  set,
  lang,
  level,
  list,
  questions,
  showPeg,
  onDone,
}: {
  set: PegSet
  lang: StudioLang
  level: number
  list: readonly StudioItem[]
  questions: readonly PegQuestion[]
  showPeg: boolean
  onDone: (outcome: RoundOutcome) => void
}): React.JSX.Element {
  const t = useAppT()
  const [study, setStudy] = useState(0)
  const [q, setQ] = useState<number | null>(null)
  const [queue, setQueue] = useState(() => startQueue(questions.map((_, i) => i)))
  const [pending, setPending] = useState<{ chosen: string; right: boolean; feedback: Feedback } | null>(null)
  const name = (id: string): string => itemName(STORY_ITEMS.find((i) => i.id === id)!, lang)

  if (q === null) {
    const item = list[study]!
    const n = study + 1
    return (
      <div className="flex flex-col items-center gap-5" data-peg-study={n}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n, total: list.length })}</p>
        <p className="font-heading text-5xl font-bold text-foreground tabular-nums">{n}</p>
        <div className="flex items-end justify-center gap-6">
          {showPeg ? <PegPicture set={set} n={n} lang={lang} size={72} /> : <div className="flex size-[72px] items-center justify-center rounded-2xl border-2 border-dashed border-border text-2xl font-bold text-muted-foreground">?</div>}
          <span className="pb-8 text-2xl text-muted-foreground">+</span>
          <StudioPicture id={item.id} label={itemName(item, lang)} size={72} />
        </div>
        <p className="text-center text-sm text-muted-foreground">{showPeg ? t('training.studio.pegStudyHint') : t('training.studio.pegStudyHintHidden')}</p>
        <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => (study + 1 < list.length ? setStudy(study + 1) : setQ(0))} data-peg-next="true">
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
    setPending({ right, chosen: id, feedback: right ? { kind: 'good', points: isRetry(queue) ? 0 : level * 2, detail: `${question.n} → ${name(question.answer)}` } : { kind: 'warn', answer: t('training.play.answerIs', { answer: `${question.n} → ${name(question.answer)}` }), tip: t('training.studio.pegTip', { n: question.n }), comesBack: willComeBack(queue) } })
  }
  const next = (): void => {
    if (pending === null) return
    const q2 = answer(queue, pending.right)
    setPending(null)
    setQueue(q2)
    if (finished(q2)) onDone({ correct: q2.correctFirst, total: questions.length, score: q2.correctFirst * level })
  }
  return (
    <div className="flex flex-col gap-4 pb-56" data-peg-question={question.n}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: Math.min(queue.pos + 1, queue.order.length), total: queue.order.length })}</p>
      <h2 className="text-2xl text-foreground">{t('training.studio.pegQuestion', { n: question.n })}</h2>
      <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3">
        {question.options.map((id) => {
          const state = pending === null ? 'idle' : id === question.answer ? 'right' : id === pending.chosen ? 'chosen' : 'idle'
          return (
            <button key={id} type="button" onClick={() => choose(id)} disabled={pending !== null} className="play-option flex min-h-24 flex-col items-center justify-center p-2" data-state={state} data-peg-option={id}>
              <StudioPicture id={id} label={name(id)} size={48} />
            </button>
          )
        })}
      </div>
      {pending !== null && <FeedbackSheet feedback={pending.feedback} onContinue={next} />}
    </div>
  )
}
