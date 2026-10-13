'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { AdaptiveExerciseShell, type RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { useExerciseProgress } from '@/features/exercise-core/useExerciseProgress'
import { IllustratedFace } from '@/features/memory-check/components/IllustratedFace'
import type { StudioLang } from '../content'
import { NAME_FACE_LESSON_ID, nameFaceLessonText } from '../lessons'
import { NAME_FACE_EXERCISE_ID, nameFaceLevel, pickNameFaceRound, roundIds, STUDIO_FACES, type NameFaceRound as Round } from '../nameFace'
import { MethodHome } from './MethodHome'
import { MethodLesson, type LessonLine } from './MethodLesson'
import { NameFaceOwnList } from './NameFaceOwnList'
import { NameFaceRound } from './NameFaceRound'

const rng = (n: number): number => Math.floor(Math.random() * n)
type Mode = 'home' | 'lesson' | 'practice' | 'own'

/** The lesson's example person ("Sagar", round glasses). */
const EXAMPLE_FACE = STUDIO_FACES.find((f) => f.id === 'm02')!

// Names and faces: Learn (lesson) → Practise (levels 1–10, 3 → 10 faces) →
// people of your own. Inside the 30-day plan (onComplete given): the lesson
// the first time, then one practice round and one scored round.
export function NameFaceExperience({ onComplete, onExit }: { onComplete?: () => void; onExit?: () => void } = {}): React.JSX.Element {
  const inPlan = onComplete !== undefined
  const t = useAppT()
  const uiLang = useUiLang()
  const lang: StudioLang = uiLang === 'hi' ? 'hi' : 'en'
  const { progress } = useExerciseProgress(NAME_FACE_EXERCISE_ID)
  const [mode, setMode] = useState<Mode | null>(inPlan ? null : 'home')
  const rounds = useRef(new Map<string, Round>())
  const lastIds = useRef<string[]>([])
  const lesson = useMemo<LessonLine[]>(() => {
    const face = <IllustratedFace face={EXAMPLE_FACE.spec} colorIndex={0} size={110} label="" />
    return nameFaceLessonText(t).map((line, i) => (i >= 1 && i <= 6 ? { ...line, visual: face } : line))
  }, [t])
  const played = progress.ready && !progress.isFirstTime

  useEffect(() => {
    if (inPlan && mode === null && progress.ready) setMode(progress.isFirstTime ? 'lesson' : 'practice')
  }, [inPlan, mode, progress.ready, progress.isFirstTime])

  if (mode === null) return <div className="py-24 text-center text-sm text-muted-foreground">{t('training.shell.loading')}</div>

  if (mode === 'lesson') return <MethodLesson narrationId={NAME_FACE_LESSON_ID} title={t('training.studio.nameFaceTitle')} lines={lesson} onDone={() => setMode('practice')} />

  if (mode === 'own')
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">{t('training.studio.faceOwnTitle')}</h1>
        <NameFaceOwnList onBack={() => setMode('home')} />
      </div>
    )

  if (mode === 'practice') {
    const exampleFace = <IllustratedFace face={EXAMPLE_FACE.spec} colorIndex={0} size={64} label="" />
    const demo = [
      { caption: t('training.studio.faceDemo1'), visual: exampleFace },
      {
        caption: t('training.studio.faceDemo2'),
        visual: (
          <div className="flex items-center gap-3">
            {exampleFace}
            <span className="font-heading text-2xl font-bold text-foreground">{lang === 'hi' ? 'सागर' : 'Sagar'}</span>
          </div>
        ),
      },
      {
        caption: t('training.studio.faceDemo3'),
        visual: (
          <div className="flex items-center gap-2">
            {['m02', 'f05', 'm06'].map((id, i) => (
              <IllustratedFace key={id} face={STUDIO_FACES.find((x) => x.id === id)!.spec} colorIndex={i + 1} size={52} label="" />
            ))}
          </div>
        ),
      },
    ]
    return (
      <AdaptiveExerciseShell
        exerciseId={NAME_FACE_EXERCISE_ID}
        title={t('training.studio.nameFaceTitle')}
        skill={t('training.skills.memory')}
        purpose={t('training.studio.facePurpose')}
        minutes={5}
        demo={demo}
        roundsPerSession={inPlan ? 1 : 2}
        scoreLabel={t('training.studio.points')}
        contentLang={lang}
        {...(inPlan ? { onComplete: () => onComplete?.() } : {})}
        describeLevel={(level) => {
          const c = nameFaceLevel(level)
          return c.hint ? t('training.studio.faceLevelHint', { count: c.count }) : t('training.studio.faceLevel', { count: c.count })
        }}
        onExit={() => (inPlan ? onExit?.() : setMode('home'))}
        renderRound={({ level, isPractice, roundIndex, onDone }) => {
          const key = `${isPractice ? 'p' : 'r'}-${roundIndex}-${level}`
          let round = rounds.current.get(key)
          if (!round) {
            round = pickNameFaceRound(isPractice ? 1 : level, lastIds.current, rng, isPractice ? 2 : undefined)
            rounds.current.set(key, round)
            lastIds.current = roundIds(round)
          }
          const done = (outcome: RoundOutcome): void => {
            rounds.current.delete(key)
            onDone(outcome)
          }
          return <NameFaceRound key={key} round={round} hint={isPractice || nameFaceLevel(level).hint} lang={lang} level={level} onDone={done} />
        }}
      />
    )
  }

  return (
    <MethodHome
      title={t('training.studio.nameFaceTitle')}
      description={t('training.studio.nameFaceDesc')}
      actions={[
        { key: 'learn', icon: 'learn', label: t('training.studio.learn'), sub: t('training.studio.learnSub'), onClick: () => setMode('lesson'), primary: !played },
        { key: 'practise', icon: 'practise', label: t('training.studio.practise'), sub: t('training.studio.levelChip', { level: progress.levelState.level }), onClick: () => setMode('practice'), primary: played },
        { key: 'own', icon: 'own', label: t('training.studio.faceOwn'), sub: t('training.studio.faceOwnSub'), onClick: () => setMode('own') },
      ]}
    />
  )
}
