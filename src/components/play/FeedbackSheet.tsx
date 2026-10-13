'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import { playFeedbackSound, playFeedbackVibration } from './playPrefs'

export type Feedback = { kind: 'good'; points?: number; detail?: React.ReactNode } | { kind: 'warn'; answer: React.ReactNode; tip?: React.ReactNode; comesBack: boolean }

// Answer feedback (play design): correct = green "Brilliant!" with a soft
// chime, a light vibration and XP; wrong = amber "Almost there" with the right
// answer and a tip — never red, never a buzzer. Sits at the bottom of the
// screen; the learner moves on with one tap.
export function FeedbackSheet({ feedback, onContinue }: { feedback: Feedback; onContinue: () => void }): React.JSX.Element {
  const t = useAppT()
  const button = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    playFeedbackSound(feedback.kind)
    playFeedbackVibration(feedback.kind)
    button.current?.focus({ preventScroll: true })
  }, [feedback])
  const good = feedback.kind === 'good'
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-xl rounded-t-3xl border-t-4 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] motion-safe:animate-in motion-safe:slide-in-from-bottom-6"
      style={{ background: good ? 'var(--play-good-bg)' : 'var(--play-warn-bg)', borderColor: good ? 'var(--play-good)' : 'var(--play-warn)' }}
      data-feedback={feedback.kind}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-heading text-3xl" style={{ color: good ? 'var(--play-good)' : 'var(--play-warn)' }}>
          {good ? t('training.play.brilliant') : t('training.play.almost')}
        </p>
        {good && feedback.points !== undefined && feedback.points > 0 && (
          <p className="font-heading text-xl" style={{ color: 'var(--play-star)' }} data-feedback-xp={feedback.points}>
            {t('training.play.xp', { n: feedback.points })}
          </p>
        )}
      </div>
      {good ? (
        feedback.detail && <p className="mt-1 text-base text-foreground">{feedback.detail}</p>
      ) : (
        <>
          <p className="mt-1 text-base text-foreground">{feedback.answer}</p>
          {feedback.tip && <p className="mt-1 text-sm text-muted-foreground">{feedback.tip}</p>}
          {feedback.comesBack && <p className="mt-1 text-sm text-muted-foreground">{t('training.play.comesBack')}</p>}
        </>
      )}
      <Button
        ref={button}
        size="lg"
        className="mt-4 min-h-12 w-full rounded-2xl"
        style={{ background: good ? 'var(--play-good)' : 'var(--play-warn)', color: 'var(--background)' }}
        onClick={onContinue}
        data-feedback-continue="true"
      >
        {good ? t('training.play.continue') : t('training.play.gotIt')}
      </Button>
    </div>
  )
}
