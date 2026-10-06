'use client'

import { useAppT } from '@/lib/app-i18n/client'
import { AdaptiveExerciseShell, type SessionSummary } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import type { DemoStep } from '@/features/exercise-core/components/DemoPlayer'
import { breathPattern, ROUNDS_PER_SESSION } from '../breathingPatterns'
import { CalmBreathingRound } from './CalmBreathingRound'

const CALM_BREATHING_EXERCISE_ID = 'calm-breathing'

function DemoCircle({ text, grow }: { text: string; grow: 'loop' | 'in' | 'out' }): React.JSX.Element {
  const animation = grow === 'loop' ? 'mum-demo-breathe 5s ease-in-out infinite' : undefined
  const scale = grow === 'in' ? 1 : grow === 'out' ? 0.6 : undefined
  return (
    <div className="relative flex size-32 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full border-2 border-sky-400/60 bg-gradient-to-br from-sky-300/40 via-teal-300/30 to-indigo-300/40 motion-reduce:!animate-none"
        style={{ animation, transform: scale === undefined ? undefined : `scale(${scale})` }}
        aria-hidden="true"
      />
      <span className="relative text-xs font-semibold text-foreground">{text}</span>
    </div>
  )
}

/** Calm Breathing — replaces the old "Calm Breath Balance" game with real, guided slow breathing. */
export function CalmBreathingExperience({ onComplete, onExit }: { onComplete?: (accuracyPercent: number, session: SessionSummary) => void; onExit?: () => void } = {}): React.JSX.Element {
  const t = useAppT()
  const demo: readonly DemoStep[] = [
    { caption: t('training.breathing.demo1'), visual: <DemoCircle text={t('training.breathing.hold')} grow="in" /> },
    { caption: t('training.breathing.demo2'), visual: <DemoCircle text={t('training.breathing.letGo')} grow="out" /> },
    { caption: t('training.breathing.demo3'), visual: <DemoCircle text="4 · 6" grow="loop" /> },
  ]
  return (
    <AdaptiveExerciseShell
      exerciseId={CALM_BREATHING_EXERCISE_ID}
      title={t('training.breathing.title')}
      skill={t('training.skills.calmFocus')}
      purpose={t('training.breathing.purpose')}
      minutes={2}
      demo={demo}
      roundsPerSession={ROUNDS_PER_SESSION}
      thresholds={{ good: 0.75, poor: 0.5 }}
      scoreLabel={t('training.breathing.scoreLabel')}
      describeLevel={(level) => {
        const p = breathPattern(level)
        return p.holdMs > 0
          ? t('training.breathing.levelHintHold', { inS: p.inMs / 1000, holdS: p.holdMs / 1000, outS: p.outMs / 1000 })
          : t('training.breathing.levelHint', { inS: p.inMs / 1000, outS: p.outMs / 1000 })
      }}
      renderRound={({ level, isPractice, onDone }) => <CalmBreathingRound level={level} isPractice={isPractice} onDone={onDone} />}
      {...(onComplete ? { onComplete } : {})}
      {...(onExit ? { onExit } : {})}
    />
  )
}
