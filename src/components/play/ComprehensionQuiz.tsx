'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import { ReadingLayout } from '@/features/reading-engine/components/ReadingLayout'
import { FeedbackSheet, type Feedback } from './FeedbackSheet'
import { Stars, starsFor } from './Stars'

export type ComprehensionQuestion = { id: string; question: string; options: readonly string[]; correctOptionIndex: number }

// The comprehension check after a reading drill (play design, all 8 languages):
// one question at a time → "Brilliant!" or "Almost there" with the right
// answer → stars for the check. Used by every reading mode, so they all look
// and behave the same. Questions are not repeated — the score stays honest.
export function ComprehensionQuiz({ questions, categoryLabel, onComplete, onExit }: { questions: readonly ComprehensionQuestion[]; categoryLabel: string; onComplete: (score: number) => void; onExit: () => void }): React.JSX.Element {
  const t = useAppT()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [pending, setPending] = useState<{ chosen: number; right: boolean; feedback: Feedback } | null>(null)
  const [done, setDone] = useState(false)
  const total = questions.length
  const q = questions[index]

  if (done || q === undefined) {
    return (
      <ReadingLayout maxWidthClassName="max-w-xl" onExit={onExit}>
        <div className="flex w-full flex-col items-center gap-5 text-center" data-quiz-done={score}>
          <Stars count={starsFor(score, Math.max(1, total))} size={44} />
          <h1 className="text-[1.75rem] text-foreground">{t('training.play.quizScore', { score, total })}</h1>
          <p className="text-base text-muted-foreground">{t(score === total ? 'training.play.quizPerfect' : score / Math.max(1, total) >= 0.6 ? 'training.play.quizGood' : 'training.play.quizTry')}</p>
          <Button size="lg" className="min-h-12 w-full max-w-xs rounded-2xl" onClick={() => onComplete(score)} data-quiz-continue="true">
            {t('training.play.continue')}
          </Button>
        </div>
      </ReadingLayout>
    )
  }

  const choose = (i: number): void => {
    if (pending !== null) return
    const right = i === q.correctOptionIndex
    setPending({ chosen: i, right, feedback: right ? { kind: 'good', points: 3 } : { kind: 'warn', answer: t('training.play.answerIs', { answer: q.options[q.correctOptionIndex] ?? '' }), tip: t('training.reader.questionTip'), comesBack: false } })
  }
  const next = (): void => {
    if (pending === null) return
    const s = score + (pending.right ? 1 : 0)
    setScore(s)
    setPending(null)
    if (index + 1 < total) setIndex(index + 1)
    else setDone(true)
  }

  return (
    <ReadingLayout maxWidthClassName="max-w-xl" onExit={onExit}>
      <div className="flex w-full flex-col gap-4 pb-56" data-quiz-question={index}>
        <div className="text-center">
          <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{t('training.play.comprehensionCheck')}</p>
          <p className="text-sm text-muted-foreground">
            {categoryLabel} · {t('training.studio.nOfTotal', { n: index + 1, total })}
          </p>
        </div>
        <h2 className="text-2xl break-words text-foreground">{q.question}</h2>
        <div className="flex flex-col gap-3">
          {q.options.map((option, i) => (
            <button
              key={`${i}-${option}`}
              type="button"
              disabled={pending !== null}
              onClick={() => choose(i)}
              className="play-option min-h-14 px-4 py-2 text-left text-lg font-semibold break-words text-foreground"
              data-state={pending === null ? 'idle' : i === q.correctOptionIndex ? 'right' : i === pending.chosen ? 'chosen' : 'idle'}
              data-quiz-option={i}
            >
              {option}
            </button>
          ))}
        </div>
        {pending !== null && <FeedbackSheet feedback={pending.feedback} onContinue={next} />}
      </div>
    </ReadingLayout>
  )
}
