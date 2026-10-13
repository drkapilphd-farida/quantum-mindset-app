'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { AdaptiveExerciseShell, type RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { useExerciseProgress } from '@/features/exercise-core/useExerciseProgress'
import type { StudioItem, StudioLang } from '../content'
import { palaceLesson, PALACE_LESSON_ID } from '../lessons'
import { listMyPalaces } from '../palaceActions'
import { palaceLevel, PALACE_PRACTICE_EXERCISE_ID, pickPalaceRound, type MyPalace, type PalaceQuestion } from '../palaces'
import { MethodHome } from './MethodHome'
import { MethodLesson } from './MethodLesson'
import { MyPalaces } from './MyPalaces'
import { PalaceOwnList } from './PalaceOwnList'
import { PalaceRound } from './PalaceRound'

const rng = (n: number): number => Math.floor(Math.random() * n)
type Mode = 'home' | 'lesson' | 'palaces' | 'practice' | 'own'

// My memory palaces: Learn → build up to 3 palaces → practise in your own
// palace (levels 1–10) → your own lists. The guided Memory Palace stays as it is.
// Inside the 30-day plan (onComplete given): the lesson the first time, build a
// palace if the learner has none yet, then one scored round in it.
export function PalaceMethodExperience({ onComplete, onExit }: { onComplete?: () => void; onExit?: () => void } = {}): React.JSX.Element {
  const inPlan = onComplete !== undefined
  const t = useAppT()
  const uiLang = useUiLang()
  const lang: StudioLang = uiLang === 'hi' ? 'hi' : 'en'
  const { progress } = useExerciseProgress(PALACE_PRACTICE_EXERCISE_ID)
  const [mode, setMode] = useState<Mode | null>(inPlan ? null : 'home')
  const [palaces, setPalaces] = useState<MyPalace[] | null>(null)
  const [palaceId, setPalaceId] = useState<string | null>(null)
  const rounds = useRef(new Map<string, { items: StudioItem[]; questions: PalaceQuestion[]; pictures: boolean }>())
  const lastIds = useRef<string[]>([])
  const lesson = useMemo(() => palaceLesson(t, lang), [t, lang])
  const reload = useCallback(() => void listMyPalaces().then(setPalaces), [])
  useEffect(reload, [reload])
  // In the plan: start once the palaces and progress are known; after building the first palace, go straight to practice.
  useEffect(() => {
    if (!inPlan || palaces === null || !progress.ready) return
    if (mode === null) setMode(palaces.length === 0 ? (progress.isFirstTime ? 'lesson' : 'palaces') : 'practice')
    else if (mode === 'palaces' && palaces.length > 0) setMode('practice')
  }, [inPlan, mode, palaces, progress.ready, progress.isFirstTime])

  const palace = palaces?.find((p) => p.id === palaceId) ?? palaces?.[0] ?? null
  const wrap = (title: string, children: React.ReactNode): React.JSX.Element => (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
      {children}
    </div>
  )

  if (mode === null) return <div className="py-24 text-center text-sm text-muted-foreground">{t('training.shell.loading')}</div>
  if (mode === 'lesson') return <MethodLesson narrationId={PALACE_LESSON_ID} title={t('training.studio.myPalacesTitle')} lines={lesson} onDone={() => setMode('palaces')} />
  if (mode === 'palaces' || ((mode === 'practice' || mode === 'own') && palaces !== null && palaces.length === 0))
    return wrap(
      t('training.studio.myPalacesTitle'),
      palaces === null ? <p className="text-sm text-muted-foreground">{t('training.shell.loading')}</p> : (
<MyPalaces palaces={palaces} lang={lang} onChanged={reload} onBack={() => (inPlan ? onExit?.() : setMode('home'))} />
      ),
    )
  if (mode === 'own' && palaces !== null) return wrap(t('training.studio.ownTitle'), <PalaceOwnList palaces={palaces} onBack={() => setMode('home')} />)

  if (mode === 'practice' && palace !== null) {
    return (
      <div>
        {palaces !== null && palaces.length > 1 && progress.ready && (
          <div className="mx-auto flex max-w-xl gap-2 overflow-x-auto px-4 pt-3">
            {palaces.map((p) => (
              <button key={p.id} type="button" onClick={() => setPalaceId(p.id)} className={`min-h-9 shrink-0 rounded-full border px-3 text-sm ${p.id === palace.id ? 'border-primary bg-primary/10 font-semibold' : 'border-border'}`}>
                {p.name}
              </button>
            ))}
          </div>
        )}
        <AdaptiveExerciseShell
          key={palace.id}
          exerciseId={PALACE_PRACTICE_EXERCISE_ID}
          title={palace.name}
          skill={t('training.skills.memory')}
          purpose={t('training.studio.palacePurpose')}
          minutes={5}
          demo={[
            { caption: t('training.studio.palaceDemo1'), visual: <p className="text-center text-lg font-semibold text-foreground">{palace.stations.slice(0, 3).join(' → ')}</p> },
            { caption: t('training.studio.palaceDemo2'), visual: <p className="text-center text-lg font-semibold text-foreground">{palace.stations[0]} + 🚀</p> },
            { caption: t('training.studio.palaceDemo3'), visual: <p className="text-center text-lg font-semibold text-foreground">{palace.stations[0]} → ?</p> },
          ]}
          roundsPerSession={inPlan ? 1 : 2}
          scoreLabel={t('training.studio.points')}
          contentLang={lang}
          {...(inPlan ? { onComplete: () => onComplete?.() } : {})}
          describeLevel={(level) => t('training.studio.palaceLevel', { count: palaceLevel(level, palace.stations.length).count })}
          onExit={() => (inPlan ? onExit?.() : setMode('home'))}
          renderRound={({ level, isPractice, roundIndex, onDone }) => {
            const key = `${palace.id}-${isPractice ? 'p' : 'r'}-${roundIndex}-${level}`
            let round = rounds.current.get(key)
            if (!round) {
              const r = pickPalaceRound(isPractice ? 1 : level, palace.stations.length, lastIds.current, rng)
              round = isPractice ? { items: r.items.slice(0, 3), questions: r.questions.slice(0, 3).map((q) => ({ ...q, options: q.options.filter((o) => r.items.slice(0, 3).some((i) => i.id === o)) })), pictures: true } : { ...r, pictures: palaceLevel(level, palace.stations.length).pictures }
              rounds.current.set(key, round)
              lastIds.current = round.items.map((i) => i.id)
            }
            const done = (o: RoundOutcome): void => {
              rounds.current.delete(key)
              onDone(o)
            }
            return <PalaceRound key={key} stations={palace.stations} items={round.items} questions={round.questions} pictures={round.pictures} lang={lang} level={level} onDone={done} />
          }}
        />
      </div>
    )
  }

  const has = palaces !== null && palaces.length > 0
  return (
    <MethodHome
      title={t('training.studio.myPalacesTitle')}
      description={t('training.studio.myPalacesDesc')}
      actions={[
        { key: 'learn', icon: 'learn', label: t('training.studio.learn'), sub: t('training.studio.learnSub'), onClick: () => setMode('lesson'), primary: !has },
        { key: 'palaces', icon: 'own', label: t('training.studio.myPalacesManage'), sub: has ? t('training.studio.palacesCount', { count: palaces.length }) : t('training.studio.palaceNone'), onClick: () => setMode('palaces') },
        { key: 'practise', icon: 'practise', label: t('training.studio.practise'), sub: t('training.studio.levelChip', { level: progress.levelState.level }), onClick: () => setMode('practice'), primary: has },
        { key: 'own', icon: 'own', label: t('training.studio.own'), sub: t('training.studio.palaceOwnSub'), onClick: () => setMode('own') },
      ]}
    />
  )
}
