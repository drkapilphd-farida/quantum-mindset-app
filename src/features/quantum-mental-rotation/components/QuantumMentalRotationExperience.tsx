'use client'

import { useAppT } from '@/lib/app-i18n/client'
import { AdaptiveExerciseShell, type SessionSummary } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import type { DemoStep } from '@/features/exercise-core/components/DemoPlayer'
import type { CubeState } from '../quantumMentalRotationDataset'
import { rotationLevel, ROUNDS_PER_SESSION, SIMPLE_SHAPES } from '../rotationTraining'
import { ColourCube, FlatShapeView } from './RotationVisuals'
import { RotationRound } from './RotationRound'

const DEMO_SHAPE = SIMPLE_SHAPES[0]!
const DEMO_CUBE: CubeState = { top: 'yellow', bottom: 'purple', front: 'blue', back: 'orange', left: 'green', right: 'red' }

// Mental Object Rotation — rebuilt on the shared 10-level trainer
// (exercise-core). Level 1: a flat shape, a quarter turn, 2 options, no timer;
// later levels add more options, bigger shapes, mirror images, a gentle timer
// and finally a colour cube turned in the mind. After every answer an
// animation shows the turn that gives the right answer.
type QuantumMentalRotationExperienceProps = {
  /** Journey / circuit / wizard hand-off: receives this session's accuracy (0–100). */
  onComplete?: (accuracyPercent: number, session: SessionSummary) => void
  onExit?: () => void
}

export function QuantumMentalRotationExperience({ onComplete, onExit }: QuantumMentalRotationExperienceProps = {}): React.JSX.Element {
  const t = useAppT()
  const demo: readonly DemoStep[] = [
    {
      caption: t('training.rotation.demo1'),
      visual: (
        <div className="motion-safe:animate-[mum-demo-turn_5s_ease-in-out_infinite]" style={{ ['--mum-turn' as string]: '90deg' }}>
          <FlatShapeView shape={DEMO_SHAPE} view={{ angle: 0, mirrored: false }} size={110} />
        </div>
      ),
    },
    {
      caption: t('training.rotation.demo2'),
      visual: (
        <div className="flex gap-3">
          <span className="rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 p-1">
            <FlatShapeView shape={DEMO_SHAPE} view={{ angle: 90, mirrored: false }} size={80} />
          </span>
          <span className="rounded-2xl border-2 border-border p-1 opacity-60">
            <FlatShapeView shape={DEMO_SHAPE} view={{ angle: -90, mirrored: false }} size={80} />
          </span>
        </div>
      ),
    },
    { caption: t('training.rotation.demo3'), visual: <ColourCube state={DEMO_CUBE} size={56} /> },
  ]

  return (
    <AdaptiveExerciseShell
      exerciseId="quantum-mental-rotation"
      title={t('training.rotation.title')}
      skill={t('training.skills.memory')}
      purpose={t('training.rotation.purpose')}
      minutes={3}
      demo={demo}
      roundsPerSession={ROUNDS_PER_SESSION}
      scoreLabel={t('training.shell.points')}
      describeLevel={(level) => {
        const c = rotationLevel(level)
        const kind = c.family === 'cube' ? t('training.rotation.levelCube') : c.family === 'match' ? t('training.rotation.levelMatch') : t('training.rotation.levelTurn')
        return c.timeLimitMs === null
          ? t('training.rotation.levelHintNoTimer', { kind, options: c.options })
          : t('training.rotation.levelHint', { kind, options: c.options, seconds: c.timeLimitMs / 1000 })
      }}
      renderRound={({ level, isPractice, onDone }) => <RotationRound level={level} isPractice={isPractice} onDone={onDone} />}
      {...(onComplete ? { onComplete } : {})}
      {...(onExit ? { onExit } : {})}
    />
  )
}
