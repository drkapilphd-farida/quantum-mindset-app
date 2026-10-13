'use client'

import { useMemo, useRef, useState } from 'react'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { AdaptiveExerciseShell, type RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { useExerciseProgress } from '@/features/exercise-core/useExerciseProgress'
import type { StudioLang } from '../content'
import { NUMBER_LESSON_ID, numberLesson } from '../lessons'
import { NUMBER_EXERCISE_ID, numberLevel, numberListFor, randomNumber } from '../numberCode'
import { MethodHome } from './MethodHome'
import { MethodLesson, type LessonLine } from './MethodLesson'
import { NumberDates } from './NumberDates'
import { NumberLearn } from './NumberLearn'
import { NumberOwnList } from './NumberOwnList'
import { NumberPictureCard } from './NumberPictureCard'
import { NumberRound } from './NumberRound'

const rng = (n: number): number => Math.floor(Math.random() * n)
type Mode = 'home' | 'lesson' | 'pictures' | 'practice' | 'dates' | 'own'

// Number pictures: Learn (lesson) → learn the 100 pictures, 10 at a time →
// Practise (4 → 12 digits) → Dates → your own numbers.
export function NumberCodeExperience(): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const lang: StudioLang = uiLang === 'hi' ? 'hi' : 'en'
  const list = numberListFor(uiLang)
  const { progress } = useExerciseProgress(NUMBER_EXERCISE_ID)
  const [mode, setMode] = useState<Mode>('home')
  const numbers = useRef(new Map<string, string>())
  const lesson = useMemo<LessonLine[]>(
    () =>
      numberLesson(t, list).map(({ pairs, ...line }) =>
        pairs
          ? {
              ...line,
              visual: (
                <div className="flex gap-6">
                  {pairs.map((pair) => (
                    <NumberPictureCard key={pair} list={list} pair={pair} size={56} />
                  ))}
                </div>
              ),
            }
          : line,
      ),
    [t, list],
  )
  const wrap = (title: string, children: React.ReactNode): React.JSX.Element => (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
      {children}
    </div>
  )

  if (mode === 'lesson') return <MethodLesson narrationId={NUMBER_LESSON_ID[list]} title={t('training.studio.numberTitle')} lines={lesson} onDone={() => setMode('pictures')} />
  if (mode === 'pictures') return wrap(t('training.studio.numberPicturesTitle'), <NumberLearn list={list} onBack={() => setMode('home')} />)
  if (mode === 'dates') return wrap(t('training.studio.numberDatesTitle'), <NumberDates list={list} lang={lang} onBack={() => setMode('home')} />)
  if (mode === 'own') return wrap(t('training.studio.numberOwnTitle'), <NumberOwnList list={list} onBack={() => setMode('home')} />)

  if (mode === 'practice') {
    const demoPairs = list === 'en' ? ['47', '19'] : ['47', '25']
    const demo = [
      { caption: t('training.studio.numberDemo1'), visual: <p className="font-heading text-3xl font-bold text-foreground tabular-nums">{demoPairs.join(' ')}</p> },
      {
        caption: t('training.studio.numberDemo2'),
        visual: (
          <div className="flex gap-4">
            {demoPairs.map((pair) => (
              <NumberPictureCard key={pair} list={list} pair={pair} size={44} />
            ))}
          </div>
        ),
      },
      { caption: t('training.studio.numberDemo3'), visual: <p className="font-heading text-3xl font-bold text-primary tabular-nums">{demoPairs.join('')}</p> },
    ]
    return (
      <AdaptiveExerciseShell
        exerciseId={NUMBER_EXERCISE_ID}
        title={t('training.studio.numberTitle')}
        skill={t('training.skills.memory')}
        purpose={t('training.studio.numberPurpose')}
        minutes={5}
        demo={demo}
        roundsPerSession={2}
        scoreLabel={t('training.studio.points')}
        contentLang={lang}
        describeLevel={(level) => {
          const c = numberLevel(level)
          return c.pictures ? t('training.studio.numberLevelPictures', { count: c.digits }) : t('training.studio.numberLevel', { count: c.digits })
        }}
        onExit={() => setMode('home')}
        renderRound={({ level, isPractice, roundIndex, onDone }) => {
          const key = `${isPractice ? 'p' : 'r'}-${roundIndex}-${level}`
          let number = numbers.current.get(key)
          if (number === undefined) {
            number = randomNumber(isPractice ? 4 : numberLevel(level).digits, rng)
            numbers.current.set(key, number)
          }
          const done = (outcome: RoundOutcome): void => {
            numbers.current.delete(key)
            onDone(outcome)
          }
          return <NumberRound key={key} number={number} list={list} pictures={isPractice || numberLevel(level).pictures} level={level} onDone={done} />
        }}
      />
    )
  }

  const played = progress.ready && !progress.isFirstTime
  return (
    <MethodHome
      title={t('training.studio.numberTitle')}
      description={t('training.studio.numberDesc')}
      actions={[
        { key: 'learn', icon: 'learn', label: t('training.studio.learn'), sub: t('training.studio.learnSub'), onClick: () => setMode('lesson'), primary: !played },
        { key: 'pictures', icon: 'learn', label: t('training.studio.numberPicturesTitle'), sub: t('training.studio.numberPicturesSub'), onClick: () => setMode('pictures') },
        { key: 'practise', icon: 'practise', label: t('training.studio.practise'), sub: t('training.studio.levelChip', { level: progress.levelState.level }), onClick: () => setMode('practice'), primary: played },
        { key: 'dates', icon: 'practise', label: t('training.studio.numberDatesTitle'), sub: t('training.studio.numberDatesSub'), onClick: () => setMode('dates') },
        { key: 'own', icon: 'own', label: t('training.studio.numberOwnTitle'), sub: t('training.studio.numberOwnSub'), onClick: () => setMode('own') },
      ]}
    />
  )
}
