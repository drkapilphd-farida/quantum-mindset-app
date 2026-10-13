'use client'

import { useMemo, useRef, useState } from 'react'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { AdaptiveExerciseShell, type RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { useExerciseProgress } from '@/features/exercise-core/useExerciseProgress'
import { KEYWORD_CARDS, KEYWORD_EXERCISE_ID, keywordLevel, keywordListFor, pickKeywordRound, type KeywordRound as Round } from '../keyword'
import { KEYWORD_LESSON_ID, keywordLesson } from '../lessons'
import { KeywordOwnList } from './KeywordOwnList'
import { KeywordRound } from './KeywordRound'
import { MethodHome } from './MethodHome'
import { MethodLesson } from './MethodLesson'

const rng = (n: number): number => Math.floor(Math.random() * n)
type Mode = 'home' | 'lesson' | 'practice' | 'own'

// Keyword method: Learn (lesson) → Practise (levels 1–10, 3 → 10 words, help
// fading from keyword + picture to the learner's own) → your own words.
export function KeywordExperience(): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const list = keywordListFor(uiLang)
  const { progress } = useExerciseProgress(KEYWORD_EXERCISE_ID)
  const [mode, setMode] = useState<Mode>('home')
  const rounds = useRef(new Map<string, Round>())
  const lastIds = useRef<string[]>([])
  const lesson = useMemo(() => keywordLesson(t, list), [t, list])
  const example = KEYWORD_CARDS[list][0]!

  if (mode === 'lesson') return <MethodLesson narrationId={KEYWORD_LESSON_ID[list]} title={t('training.studio.keywordTitle')} lines={lesson} onDone={() => setMode('practice')} />
  if (mode === 'own')
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">{t('training.studio.keywordOwnTitle')}</h1>
        <KeywordOwnList onBack={() => setMode('home')} />
      </div>
    )

  if (mode === 'practice') {
    const demo = [
      { caption: t('training.studio.keywordDemo1'), visual: <p className="font-heading text-3xl font-bold text-foreground">{example.word}</p> },
      { caption: t('training.studio.keywordDemo2'), visual: <p className="font-heading text-2xl font-bold text-primary">{example.keyword}</p> },
      { caption: t('training.studio.keywordDemo3'), visual: <p className="max-w-xs text-center text-sm text-foreground">{example.picture}</p> },
    ]
    return (
      <AdaptiveExerciseShell
        exerciseId={KEYWORD_EXERCISE_ID}
        title={t('training.studio.keywordTitle')}
        skill={t('training.skills.memory')}
        purpose={t('training.studio.keywordPurpose')}
        minutes={5}
        demo={demo}
        roundsPerSession={2}
        scoreLabel={t('training.studio.points')}
        contentLang={list}
        describeLevel={(level) => {
          const c = keywordLevel(level)
          return t(c.help === 'full' ? 'training.studio.keywordLevelFull' : c.help === 'keyword' ? 'training.studio.keywordLevelKeyword' : 'training.studio.keywordLevelOwn', { count: c.count })
        }}
        onExit={() => setMode('home')}
        renderRound={({ level, isPractice, roundIndex, onDone }) => {
          const key = `${isPractice ? 'p' : 'r'}-${roundIndex}-${level}`
          let round = rounds.current.get(key)
          if (!round) {
            round = pickKeywordRound(list, isPractice ? 1 : level, lastIds.current, rng, isPractice ? 2 : undefined)
            rounds.current.set(key, round)
            lastIds.current = round.choices.map((c) => c.id)
          }
          const done = (outcome: RoundOutcome): void => {
            rounds.current.delete(key)
            onDone(outcome)
          }
          return <KeywordRound key={key} round={round} help={isPractice ? 'full' : keywordLevel(level).help} list={list} level={level} onDone={done} />
        }}
      />
    )
  }

  const played = progress.ready && !progress.isFirstTime
  return (
    <MethodHome
      title={t('training.studio.keywordTitle')}
      description={t('training.studio.keywordDesc')}
      actions={[
        { key: 'learn', icon: 'learn', label: t('training.studio.learn'), sub: t('training.studio.learnSub'), onClick: () => setMode('lesson'), primary: !played },
        { key: 'practise', icon: 'practise', label: t('training.studio.practise'), sub: t('training.studio.levelChip', { level: progress.levelState.level }), onClick: () => setMode('practice'), primary: played },
        { key: 'own', icon: 'own', label: t('training.studio.keywordOwnTitle'), sub: t('training.studio.keywordOwnSub'), onClick: () => setMode('own') },
      ]}
    />
  )
}
