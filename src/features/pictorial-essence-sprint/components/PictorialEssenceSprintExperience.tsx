'use client'

import { useAppT } from '@/lib/app-i18n/client'
import { AdaptiveExerciseShell, type SessionSummary } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import type { DemoStep } from '@/features/exercise-core/components/DemoPlayer'
import { PICTURES, pictureLevel, ROUNDS_PER_SESSION } from '../pictureTraining'
import { PictureCard } from './PictureRound'
import { PictureRound } from './PictureRound'

const byId = (id: string): (typeof PICTURES)[number] => PICTURES.find((p) => p.id === id) ?? PICTURES[0]!
const DEMO_SHOWN = ['mango', 'banana', 'grapes'].map(byId)
const DEMO_OPTIONS = ['apple', 'banana', 'pineapple', 'lemon'].map(byId)

// Picture Memory Sprint (was "Pictorial Essence Sprint") — rebuilt on the
// shared 10-level trainer. Level 1: 3 vivid pictures for 6 seconds, then
// "which one did you see?" from 4. Higher levels show more pictures for less
// time, ask which one was NOT shown, and finally ask for the order.
type Props = { onComplete?: (accuracyPercent: number, session: SessionSummary) => void; onExit?: () => void }

export function PictorialEssenceSprintExperience({ onComplete, onExit }: Props = {}): React.JSX.Element {
  const t = useAppT()
  const demo: readonly DemoStep[] = [
    {
      caption: t('training.pictures.demo1'),
      visual: (
        <div className="grid w-56 grid-cols-3 gap-2">
          {DEMO_SHOWN.map((item) => (
            <PictureCard key={item.id} item={item} size="sm" />
          ))}
        </div>
      ),
    },
    {
      caption: t('training.pictures.demo2'),
      visual: (
        <div className="grid w-56 grid-cols-4 gap-1.5">
          {DEMO_OPTIONS.map((item) => (
            <PictureCard key={item.id} item={item} size="sm" {...(item.id === 'banana' ? { state: 'right' as const } : {})} />
          ))}
        </div>
      ),
    },
    {
      caption: t('training.pictures.demo3'),
      visual: (
        <div className="flex gap-2">
          {DEMO_SHOWN.map((item, i) => (
            <span key={item.id} className="relative w-16">
              <PictureCard item={item} size="sm" />
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{i + 1}</span>
            </span>
          ))}
        </div>
      ),
    },
  ]
  return (
    <AdaptiveExerciseShell
      exerciseId="pictorial-essence-sprint"
      title={t('training.pictures.title')}
      skill={t('training.skills.memory')}
      purpose={t('training.pictures.purpose')}
      minutes={3}
      demo={demo}
      roundsPerSession={ROUNDS_PER_SESSION}
      scoreLabel={t('training.shell.points')}
      describeLevel={(level) => {
        const c = pictureLevel(level)
        return c.mode === 'order'
          ? t('training.pictures.levelHintOrder', { n: c.items, seconds: c.studyMs / 1000 })
          : t(c.mode === 'seen' ? 'training.pictures.levelHintSeen' : 'training.pictures.levelHintNotSeen', { n: c.items, seconds: c.studyMs / 1000 })
      }}
      renderRound={({ level, isPractice, onDone }) => <PictureRound level={level} isPractice={isPractice} onDone={onDone} />}
      {...(onComplete ? { onComplete } : {})}
      {...(onExit ? { onExit } : {})}
    />
  )
}
