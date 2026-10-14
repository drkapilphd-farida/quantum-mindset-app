'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { AdaptiveExerciseShell, type RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { useExerciseProgress } from '@/features/exercise-core/useExerciseProgress'
import type { StudioItem, StudioLang } from '../content'
import { pegSetFor } from '../content'
import { storyLesson, STORY_LESSON_ID } from '../lessons'
import { pickStoryRound, STORY_EXERCISE_ID, storyLevel } from '../storyMethod'
import { MethodHome } from './MethodHome'
import { MethodLesson } from './MethodLesson'
import { OwnList } from './OwnList'
import { StoryRound } from './StoryRound'
import { StudioPicture } from './StudioPicture'
import { LoadingSkeleton } from '@/components/play/LoadingSkeleton'

const rng = (n: number): number => Math.floor(Math.random() * n)
type Mode = 'home' | 'lesson' | 'practice' | 'own'

// Story / Link method: Learn (lesson) → Practise (levels 1–10) → own lists.
// Inside the 30-day plan (onComplete given): no start screen — the lesson the
// first time, then one practice round and one scored round (about 3 minutes).
export function StoryMethodExperience({ onComplete, onExit }: { onComplete?: () => void; onExit?: () => void } = {}): React.JSX.Element {
  const inPlan = onComplete !== undefined
  const t = useAppT()
  const uiLang = useUiLang()
  const lang: StudioLang = uiLang === 'hi' ? 'hi' : 'en'
  const { progress } = useExerciseProgress(STORY_EXERCISE_ID)
  const [mode, setMode] = useState<Mode | null>(inPlan ? null : 'home')
  const rounds = useRef(new Map<string, { list: StudioItem[]; unseen: StudioItem[] }>())
  const lastIds = useRef<string[]>([])
  const lesson = useMemo(() => storyLesson(t, lang), [t, lang])
  const played = progress.ready && !progress.isFirstTime

  useEffect(() => {
    if (inPlan && mode === null && progress.ready) setMode(progress.isFirstTime ? 'lesson' : 'practice')
  }, [inPlan, mode, progress.ready, progress.isFirstTime])

  if (mode === null) return <LoadingSkeleton />

  if (mode === 'lesson') return <MethodLesson narrationId={STORY_LESSON_ID} title={t('training.studio.storyTitle')} lines={lesson} onDone={() => setMode('practice')} />

  if (mode === 'own')
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">{t('training.studio.ownTitle')}</h1>
        <OwnList method="story" set={pegSetFor(uiLang)} lang={lang} onBack={() => setMode('home')} />
      </div>
    )

  if (mode === 'practice') {
    const demo = [
      { caption: t('training.studio.storyDemo1'), visual: <Row ids={['rocket', 'guitar', 'tomato']} /> },
      { caption: t('training.studio.storyDemo2'), visual: <Row ids={['rocket', 'guitar']} link /> },
      { caption: t('training.studio.storyDemo3'), visual: <Row ids={['rocket', 'guitar', 'tomato']} numbered /> },
    ]
    return (
      <AdaptiveExerciseShell
        exerciseId={STORY_EXERCISE_ID}
        title={t('training.studio.storyTitle')}
        skill={t('training.skills.memory')}
        purpose={t('training.studio.storyPurpose')}
        minutes={5}
        demo={demo}
        roundsPerSession={inPlan ? 1 : 2}
        scoreLabel={t('training.studio.points')}
        contentLang={lang}
        {...(inPlan ? { onComplete: () => onComplete?.() } : {})}
        describeLevel={(level) => {
          const c = storyLevel(level)
          return c.pictures ? t('training.studio.levelPictures', { count: c.count }) : t('training.studio.levelWords', { count: c.count })
        }}
        onExit={() => (inPlan ? onExit?.() : setMode('home'))}
        renderRound={({ level, isPractice, roundIndex, onDone }) => {
          const key = `${isPractice ? 'p' : 'r'}-${roundIndex}-${level}`
          let round = rounds.current.get(key)
          if (!round) {
            round = isPractice ? { list: pickStoryRound(1, lastIds.current, rng).list.slice(0, 3), unseen: [] } : pickStoryRound(level, lastIds.current, rng)
            rounds.current.set(key, round)
            lastIds.current = [...round.list, ...round.unseen].map((i) => i.id)
          }
          const done = (outcome: RoundOutcome): void => {
            rounds.current.delete(key)
            onDone(outcome)
          }
          return <StoryRound key={key} level={level} list={round.list} unseen={round.unseen} lang={lang} practice={isPractice} onDone={done} />
        }}
      />
    )
  }

  return (
    <MethodHome
      title={t('training.studio.storyTitle')}
      description={t('training.studio.storyDesc')}
      actions={[
        { key: 'learn', icon: 'learn', label: t('training.studio.learn'), sub: t('training.studio.learnSub'), onClick: () => setMode('lesson'), primary: !played },
        { key: 'practise', icon: 'practise', label: t('training.studio.practise'), sub: t('training.studio.levelChip', { level: progress.levelState.level }), onClick: () => setMode('practice'), primary: played },
        { key: 'own', icon: 'own', label: t('training.studio.own'), sub: t('training.studio.ownStorySub'), onClick: () => setMode('own') },
      ]}
    />
  )
}

function Row({ ids, link = false, numbered = false }: { ids: string[]; link?: boolean; numbered?: boolean }): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      {ids.map((id, i) => (
        <div key={id} className="flex items-center gap-2">
          {i > 0 && <span className="text-lg text-primary">{link ? '⟶' : ''}</span>}
          <StudioPicture id={id} label="" showLabel={false} size={52} {...(numbered ? { number: i + 1 } : {})} />
        </div>
      ))}
    </div>
  )
}
