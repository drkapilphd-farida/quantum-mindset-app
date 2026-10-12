'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { AdaptiveExerciseShell, type RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { useExerciseProgress } from '@/features/exercise-core/useExerciseProgress'
import { pegSetFor, type StudioLang } from '../content'
import { pegLesson, PEG_LESSON_ID } from '../lessons'
import { PEG_EXERCISE_ID, PEG_LEARN_EXERCISE_ID, pegLevel, pickPegRound, type PegQuestion } from '../pegMethod'
import type { StudioItem } from '../content'
import { MethodHome } from './MethodHome'
import { MethodLesson } from './MethodLesson'
import { OwnList } from './OwnList'
import { PegLearn } from './PegLearn'
import { PegPicture } from './PegPicture'
import { PegRound } from './PegRound'
import { StudioPicture } from './StudioPicture'

const rng = (n: number): number => Math.floor(Math.random() * n)
type Mode = 'home' | 'lesson' | 'learn' | 'practice' | 'own'

// Peg method: Learn (lesson) → learn the 10 pegs → Practise (levels 1–10) → own lists.
// English uses rhyme pegs; every other language uses shape pegs.
// Inside the 30-day plan (onComplete given): no start screen — the lesson and
// the pegs the first time, then one practice round and one scored round.
export function PegMethodExperience({ onComplete, onExit }: { onComplete?: () => void; onExit?: () => void } = {}): React.JSX.Element {
  const inPlan = onComplete !== undefined
  const t = useAppT()
  const uiLang = useUiLang()
  const lang: StudioLang = uiLang === 'hi' ? 'hi' : 'en'
  const set = pegSetFor(uiLang)
  const { progress } = useExerciseProgress(PEG_EXERCISE_ID)
  const learned = useExerciseProgress(PEG_LEARN_EXERCISE_ID).progress
  const [mode, setMode] = useState<Mode | null>(inPlan ? null : 'home')
  const rounds = useRef(new Map<string, { list: StudioItem[]; questions: PegQuestion[]; showPeg: boolean }>())
  const lastIds = useRef<string[]>([])
  const lesson = useMemo(() => pegLesson(set, t, lang), [set, t, lang])
  const pegsKnown = learned.ready && !learned.isFirstTime

  useEffect(() => {
    if (inPlan && mode === null && learned.ready && progress.ready) setMode(learned.isFirstTime ? 'lesson' : 'practice')
  }, [inPlan, mode, learned.ready, learned.isFirstTime, progress.ready])

  if (mode === null) return <div className="py-24 text-center text-sm text-muted-foreground">{t('training.shell.loading')}</div>

  const wrap = (children: React.ReactNode, title: string): React.JSX.Element => (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
      {children}
    </div>
  )

  if (mode === 'lesson') return <MethodLesson narrationId={PEG_LESSON_ID[set]} title={t('training.studio.pegTitle')} lines={lesson} onDone={() => setMode('learn')} />
  if (mode === 'learn') return wrap(<PegLearn set={set} lang={lang} onDone={() => setMode('practice')} />, t('training.studio.pegsTitle'))
  if (mode === 'own') return wrap(<OwnList method="peg" set={set} lang={lang} onBack={() => setMode('home')} />, t('training.studio.ownTitle'))

  if (mode === 'practice') {
    const demo = [
      { caption: t('training.studio.pegDemo1'), visual: <div className="flex gap-3">{[1, 2, 3].map((n) => <PegPicture key={n} set={set} n={n} lang={lang} size={48} showLabel={false} />)}</div> },
      { caption: t('training.studio.pegDemo2'), visual: <div className="flex items-center gap-3"><PegPicture set={set} n={1} lang={lang} size={52} showLabel={false} /><span className="text-xl text-primary">+</span><StudioPicture id="rocket" label="" size={52} showLabel={false} /></div> },
      { caption: t('training.studio.pegDemo3'), visual: <p className="font-heading text-4xl font-bold text-foreground">1 → ?</p> },
    ]
    return (
      <AdaptiveExerciseShell
        exerciseId={PEG_EXERCISE_ID}
        title={t('training.studio.pegTitle')}
        skill={t('training.skills.memory')}
        purpose={t('training.studio.pegPurpose')}
        minutes={5}
        demo={demo}
        roundsPerSession={inPlan ? 1 : 2}
        scoreLabel={t('training.studio.points')}
        contentLang={lang}
        {...(inPlan ? { onComplete: () => onComplete?.() } : {})}
        describeLevel={(level) => {
          const c = pegLevel(level)
          return !c.showPeg ? t('training.studio.pegLevelHidden', { count: c.count }) : c.mixedOrder ? t('training.studio.pegLevelMixed', { count: c.count }) : t('training.studio.pegLevelInOrder', { count: c.count })
        }}
        onExit={() => (inPlan ? onExit?.() : setMode('home'))}
        renderRound={({ level, isPractice, roundIndex, onDone }) => {
          const key = `${isPractice ? 'p' : 'r'}-${roundIndex}-${level}`
          let round = rounds.current.get(key)
          if (!round) {
            if (isPractice) {
              const r = pickPegRound(1, lastIds.current, rng)
              const list = r.list.slice(0, 3)
              round = { list, questions: r.questions.filter((q) => q.n <= 3).map((q) => ({ ...q, options: q.options.filter((o) => list.some((i) => i.id === o)) })), showPeg: true }
            } else {
              round = { ...pickPegRound(level, lastIds.current, rng), showPeg: pegLevel(level).showPeg }
            }
            rounds.current.set(key, round)
            lastIds.current = round.list.map((i) => i.id)
          }
          const done = (outcome: RoundOutcome): void => {
            rounds.current.delete(key)
            onDone(outcome)
          }
          return <PegRound key={key} set={set} lang={lang} level={level} list={round.list} questions={round.questions} showPeg={round.showPeg} onDone={done} />
        }}
      />
    )
  }

  return (
    <MethodHome
      title={t('training.studio.pegTitle')}
      description={t('training.studio.pegDesc')}
      actions={[
        { key: 'learn', icon: 'learn', label: t('training.studio.learn'), sub: t('training.studio.learnSub'), onClick: () => setMode('lesson'), primary: !pegsKnown },
        { key: 'pegs', icon: 'learn', label: t('training.studio.learnPegs'), sub: set === 'rhyme' ? t('training.studio.pegsSubRhyme') : t('training.studio.pegsSubShape'), onClick: () => setMode('learn') },
        { key: 'practise', icon: 'practise', label: t('training.studio.practise'), sub: t('training.studio.levelChip', { level: progress.levelState.level }), onClick: () => setMode('practice'), primary: pegsKnown },
        { key: 'own', icon: 'own', label: t('training.studio.own'), sub: t('training.studio.ownPegSub'), onClick: () => setMode('own') },
      ]}
    />
  )
}
