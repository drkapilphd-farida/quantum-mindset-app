'use client'

import { useState } from 'react'
import type { Translator } from '@/lib/app-i18n/translate'
import { useAppT } from '@/lib/app-i18n/client'
import { ReadingLayout } from '@/features/reading-engine/components/ReadingLayout'
import type { FlashRecallSprintQuizQuestion } from '../subvocalizationDestroyerDataset'

// Frosted-glass palette — own-copy, matching this exercise's own Canvas
// and every other Reading Mode built this session (a deliberate upgrade
// from Flash Recall Sprint's own solid-card quiz).
const CARD_CLASS_NAME = 'bg-[#FBF9F4]/95 dark:bg-[#16171A]/95 backdrop-blur-md'
const TEXT_COLOR_CLASS_NAME = 'text-[#17181C] dark:text-[#F5F5F2]'

type SubvocalizationDestroyerQuizProps = {
  questions: readonly FlashRecallSprintQuizQuestion[]
  categoryLabel: string
  onComplete: (score: number) => void
  onExit: () => void
}

function scoreMessage(score: number, total: number, t: Translator): string {
  if (score === total) return t('exercises.innerVoice.perfect')
  if (score >= Math.ceil(total / 2)) return t('exercises.innerVoice.solid')
  return t('exercises.innerVoice.again')
}

// Post-session MCQ comprehension quiz — appears only after the ultra-high-
// speed RSVP stream has flashed every word, with zero mid-exercise
// interruptions beforehand. Own-copy of FlashRecallSprintQuiz.tsx's own
// state machine (question -> instant feedback -> next, repeated, then a
// results view) — deliberately its own small component rather than a new
// phase inside the locked useReadingRuntime.ts, which stays untouched and
// shared by every other exercise.
export function SubvocalizationDestroyerQuiz({ questions, categoryLabel, onComplete, onExit }: SubvocalizationDestroyerQuizProps): React.JSX.Element {
  const t = useAppT()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const totalQuestions = questions.length
  const currentQuestion = questions[questionIndex]

  function handleSelectOption(optionIndex: number): void {
    if (selectedOptionIndex !== null || !currentQuestion) return
    setSelectedOptionIndex(optionIndex)
    if (optionIndex === currentQuestion.correctOptionIndex) {
      setScore((current) => current + 1)
    }
  }

  function handleAdvance(): void {
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((current) => current + 1)
      setSelectedOptionIndex(null)
    } else {
      setShowResults(true)
    }
  }

  if (showResults || !currentQuestion) {
    return (
      <ReadingLayout maxWidthClassName="max-w-xl" onExit={onExit}>
        <div className="flex w-full flex-col items-center gap-8 text-center">
          <div>
            <p className="mb-1 text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">{t('exercises.quiz.retentionCheck')}</p>
            <p className="mb-3 text-center text-xs text-muted-foreground">{categoryLabel}</p>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{t('exercises.quiz.youScored', { score, total: totalQuestions })}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{scoreMessage(score, totalQuestions, t)}</p>
          </div>
          <button
            onClick={() => onComplete(score)}
            className="rounded-full bg-foreground px-10 py-3 text-sm font-medium text-background transition-all duration-150 hover:opacity-80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t('exercises.quiz.continue')}
          </button>
        </div>
      </ReadingLayout>
    )
  }

  const isLastQuestion = questionIndex + 1 === totalQuestions

  return (
    <ReadingLayout maxWidthClassName="max-w-xl" onExit={onExit}>
      <div className="flex w-full flex-col items-center gap-6">
        <div className="w-full text-center">
          <p className="mb-1 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">{t('exercises.quiz.retentionCheck')}</p>
          <p className="text-xs text-muted-foreground">
            {t('exercises.quiz.questionOf', { topic: categoryLabel, n: questionIndex + 1, total: totalQuestions })}
          </p>
        </div>

        <div className={`w-full rounded-3xl border border-black/10 p-6 shadow-sm dark:border-white/10 ${CARD_CLASS_NAME}`}>
          <p className={`text-lg font-semibold ${TEXT_COLOR_CLASS_NAME}`}>{currentQuestion.question}</p>

          <div className="mt-5 flex flex-col gap-2.5">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = selectedOptionIndex === optionIndex
              const isCorrectOption = optionIndex === currentQuestion.correctOptionIndex
              const hasAnswered = selectedOptionIndex !== null

              let stateClassName = 'border-black/10 dark:border-white/15 hover:border-black/25 dark:hover:border-white/30'
              let stateLabel = ''
              if (hasAnswered && isCorrectOption) {
                stateClassName = 'border-emerald-500 bg-emerald-500/10 dark:border-emerald-400 dark:bg-emerald-400/10'
                stateLabel = ' (Correct answer)'
              } else if (hasAnswered && isSelected && !isCorrectOption) {
                stateClassName = 'border-red-500 bg-red-500/10 dark:border-red-400 dark:bg-red-400/10'
                stateLabel = ' (Your answer)'
              }

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectOption(optionIndex)}
                  disabled={hasAnswered}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${TEXT_COLOR_CLASS_NAME} transition-colors disabled:cursor-default ${stateClassName} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50`}
                >
                  {option}
                  {stateLabel && <span className="text-xs font-normal opacity-70">{stateLabel}</span>}
                </button>
              )
            })}
          </div>

          {selectedOptionIndex !== null && (
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              {selectedOptionIndex === currentQuestion.correctOptionIndex ? t('exercises.quiz.correct') : t('exercises.quiz.notQuite')}
            </p>
          )}
        </div>

        {selectedOptionIndex !== null && (
          <button
            onClick={handleAdvance}
            className="rounded-full bg-foreground px-10 py-3 text-sm font-medium text-background transition-all duration-150 hover:opacity-80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {isLastQuestion ? t('exercises.quiz.seeResults') : t('exercises.quiz.nextQuestion')}
          </button>
        )}
      </div>
    </ReadingLayout>
  )
}
