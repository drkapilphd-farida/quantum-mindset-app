'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveProgramAssessment } from '../actions/saveProgramAssessment'
import type { AssessmentCopy } from '../assessmentCopy'
import type { AssessmentPassage } from '../assessmentPassages'
import { generateAttentionSequence, type AttentionTrial } from '../assessmentScoring'
import type { AssessmentStage } from '../assessmentTypes'
import { AttentionTask } from './AttentionTask'

// One Day 1 or Day 30 assessment run: self-paced timed read → 5 questions
// → attention practice → attention task → save. The reading is free and
// self-paced (the learner taps Start and Done); nothing is app-paced here.

type Step = 'read-intro' | 'reading' | 'quiz' | 'attention-intro' | 'practice' | 'practice-done' | 'attention' | 'saving' | 'error'

const PRACTICE_SEQUENCE = [
  { go: true, gapMs: 800 },
  { go: true, gapMs: 700 },
  { go: false, gapMs: 900 },
  { go: true, gapMs: 650 },
  { go: false, gapMs: 800 },
  { go: true, gapMs: 750 },
] as const

type AssessmentFlowProps = {
  stage: AssessmentStage
  passage: AssessmentPassage
  copy: AssessmentCopy
  onCancel: () => void
}

const primaryButton = 'inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground disabled:opacity-50'

export function AssessmentFlow({ stage, passage, copy, onCancel }: AssessmentFlowProps): React.JSX.Element {
  const router = useRouter()
  const [step, setStep] = useState<Step>('read-intro')
  const [answers, setAnswers] = useState<(number | null)[]>(() => passage.questions.map(() => null))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const readStartRef = useRef<number | null>(null)
  const readingMsRef = useRef(0)
  const sequence = useMemo(() => generateAttentionSequence(Math.floor(Math.random() * 2 ** 31)), [])

  function startReading(): void {
    readStartRef.current = performance.now()
    setStep('reading')
    window.scrollTo({ top: 0 })
  }

  function finishReading(): void {
    readingMsRef.current = Math.round(performance.now() - (readStartRef.current ?? performance.now()))
    setStep('quiz')
    window.scrollTo({ top: 0 })
  }

  const finishPractice = useCallback(() => setStep('practice-done'), [])

  const finishAttention = useCallback(
    (trials: AttentionTrial[]) => {
      setStep('saving')
      void (async () => {
        const result = await saveProgramAssessment({
          stage,
          lang: passage.lang,
          passageId: passage.id,
          readingMs: readingMsRef.current,
          answers,
          attentionTrials: trials,
        })
        if (result.ok) {
          router.refresh()
          onCancel()
          return
        }
        setError(result.reason === 'implausible_timing' ? copy.errorImplausible : copy.errorGeneric)
        setStep('error')
      })()
    },
    [answers, copy, onCancel, passage.id, passage.lang, router, stage],
  )

  const question = passage.questions[questionIndex]

  return (
    <div className="space-y-6">
      {step === 'read-intro' && (
        <div className="space-y-5">
          <p className="text-[15px] leading-relaxed">{copy.readIntro}</p>
          <button type="button" className={primaryButton} onClick={startReading}>
            {copy.startReading}
          </button>
        </div>
      )}

      {step === 'reading' && (
        <article lang={passage.lang} className="space-y-4">
          <h2 className="text-xl font-semibold">{passage.title}</h2>
          {passage.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-[17px] leading-[1.75]">
              {paragraph}
            </p>
          ))}
          <div className="sticky bottom-4 flex justify-center pt-4">
            <button type="button" className={`${primaryButton} shadow-lg`} onClick={finishReading}>
              {copy.done}
            </button>
          </div>
        </article>
      )}

      {step === 'quiz' && question !== undefined && (
        <fieldset lang={passage.lang} className="space-y-4">
          <legend className="text-sm text-muted-foreground">{copy.question(questionIndex + 1, passage.questions.length)}</legend>
          <p className="text-lg font-semibold">{question.question}</p>
          <div className="space-y-2.5">
            {question.options.map((option, optionIndex) => (
              <label
                key={option}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-[15px] ${
                  answers[questionIndex] === optionIndex ? 'border-primary bg-primary/10' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name={`q${questionIndex}`}
                  checked={answers[questionIndex] === optionIndex}
                  onChange={() => setAnswers((prev) => prev.map((a, i) => (i === questionIndex ? optionIndex : a)))}
                />
                {option}
              </label>
            ))}
          </div>
          <button
            type="button"
            className={primaryButton}
            disabled={answers[questionIndex] === null}
            onClick={() => (questionIndex + 1 < passage.questions.length ? setQuestionIndex(questionIndex + 1) : setStep('attention-intro'))}
          >
            {copy.next}
          </button>
        </fieldset>
      )}

      {step === 'attention-intro' && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold">{copy.attentionTitle}</h2>
          <p className="text-[15px] leading-relaxed">{copy.attentionIntro}</p>
          <button type="button" className={primaryButton} onClick={() => setStep('practice')}>
            {copy.startPractice}
          </button>
        </div>
      )}

      {step === 'practice' && <AttentionTask sequence={PRACTICE_SEQUENCE} practice tapLabel={copy.tap} onComplete={finishPractice} />}

      {step === 'practice-done' && (
        <div className="space-y-5">
          <p className="text-[15px] leading-relaxed">{copy.practiceDone}</p>
          <button type="button" className={primaryButton} onClick={() => setStep('attention')}>
            {copy.startTask}
          </button>
        </div>
      )}

      {step === 'attention' && <AttentionTask sequence={sequence} practice={false} tapLabel={copy.tap} onComplete={finishAttention} />}

      {step === 'saving' && <p className="text-[15px]">{copy.saving}</p>}

      {step === 'error' && (
        <div className="space-y-4">
          <p role="alert" className="text-[15px] text-destructive">
            {error}
          </p>
          <button type="button" className={primaryButton} onClick={onCancel}>
            {copy.retry}
          </button>
        </div>
      )}
    </div>
  )
}
