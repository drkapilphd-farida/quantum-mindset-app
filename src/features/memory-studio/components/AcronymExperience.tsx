'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { useExerciseProgress } from '@/features/exercise-core/useExerciseProgress'
import { ACRONYM_EXAMPLES, ACRONYM_EXERCISE_ID, ACRONYM_MAX, ACRONYM_MIN, ACRONYM_READY_LISTS, ACRONYM_TRY_EXERCISE_ID, firstLetters, sentenceMatches } from '../acronym'
import { saveOwnList } from '../actions'
import { ACRONYM_LESSON_ID, acronymLesson } from '../lessons'
import { saveSimpleResult } from '../saveResult'
import { orderScore, shuffle } from '../storyMethod'
import { MethodHome } from './MethodHome'
import { MethodLesson } from './MethodLesson'
import { OrderRecall } from './OrderRecall'
import { SuggestButton } from './SuggestButton'
import { LoadingSkeleton } from '@/components/play/LoadingSkeleton'

const rng = (n: number): number => Math.floor(Math.random() * n)
type Stage = { name: 'plan' } | { name: 'try'; index: number } | { name: 'home' } | { name: 'lesson' } | { name: 'make' } | { name: 'test'; items: string[]; code: string; sentence: string } | { name: 'result'; correct: number; total: number }

// Acronyms & first-letter sentences: a quick tool, no levels. A short list →
// its first letters → a word or a funny sentence → saved, tested once now
// (put the list back in order with the code as the only help), then reviewed.
// Inside the 30-day plan (onComplete given): the lesson the first time, then
// "try it" on a ready list (its letters, an optional sentence, then put it back in order).
export function AcronymExperience({ onComplete, onExit }: { onComplete?: () => void; onExit?: () => void } = {}): React.JSX.Element {
  const inPlan = onComplete !== undefined
  const t = useAppT()
  const uiLang = useUiLang()
  const exampleLang = uiLang === 'hi' ? 'hi' : 'en'
  const { progress } = useExerciseProgress(ACRONYM_TRY_EXERCISE_ID)
  const [stage, setStage] = useState<Stage>(inPlan ? { name: 'plan' } : { name: 'home' })
  useEffect(() => {
    if (inPlan && stage.name === 'plan' && progress.ready) setStage(progress.isFirstTime ? { name: 'lesson' } : { name: 'try', index: 1 + Math.floor(Math.random() * 2) })
  }, [inPlan, stage.name, progress.ready, progress.isFirstTime])
  const [title, setTitle] = useState('')
  const [itemsText, setItemsText] = useState('')
  const [sentence, setSentence] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const started = useRef(0)
  const lesson = useMemo(() => acronymLesson(t), [t])
  const items = useMemo(
    () =>
      itemsText
        .split('\n')
        .map((s) => s.trim().slice(0, 60))
        .filter(Boolean),
    [itemsText],
  )
  const code = firstLetters(items)
  const sentenceOk = sentence.trim() === '' || sentenceMatches(code, sentence)

  async function save(): Promise<void> {
    if (items.length < ACRONYM_MIN || items.length > ACRONYM_MAX) return setError(t('training.studio.acronymRule', { min: ACRONYM_MIN, max: ACRONYM_MAX }))
    if (title.trim() === '') return setError(t('training.studio.needTitle'))
    setBusy(true)
    const res = await saveOwnList({ method: 'acronym', title: title.trim(), items, story: `${code}${sentence.trim() ? ` — ${sentence.trim()}` : ''}`.slice(0, 2000), lang: uiLang })
    setBusy(false)
    if (!res.ok) return setError(t('training.studio.saveError'))
    started.current = performance.now()
    setStage({ name: 'test', items, code, sentence: sentence.trim() })
  }

  const wrap = (children: React.ReactNode): React.JSX.Element => (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">{t('training.studio.acronymTitle')}</h1>
      {children}
    </div>
  )

  if (stage.name === 'plan') return <LoadingSkeleton />
  if (stage.name === 'lesson') return <MethodLesson narrationId={ACRONYM_LESSON_ID} title={t('training.studio.acronymTitle')} lines={lesson} onDone={() => setStage(inPlan ? { name: 'try', index: 0 } : { name: 'make' })} />
  if (stage.name === 'try') {
    const lists = ACRONYM_READY_LISTS[exampleLang]
    const ready = lists[stage.index % lists.length]!
    return wrap(<AcronymTry key={ready.title} list={ready} onDone={() => (inPlan ? onComplete?.() : setStage({ name: 'home' }))} />)
  }

  if (stage.name === 'test') {
    const choices = shuffle(
      stage.items.map((label, i) => ({ id: `i${i}`, label, picture: false })),
      rng,
    )
    return wrap(
      <>
        <div className="rounded-2xl bg-primary/10 p-3 text-center" data-acronym-hint="true">
          <p className="font-heading text-2xl font-bold tracking-widest text-foreground">{stage.code}</p>
          {stage.sentence && <p className="mt-1 text-sm text-foreground">{stage.sentence}</p>}
        </div>
        <OrderRecall
          choices={choices}
          count={stage.items.length}
          hint={t('training.studio.acronymRecallHint')}
          onCheck={(answer) => {
            const correct = orderScore(
              stage.items.map((_, i) => `i${i}`),
              answer,
            )
            saveSimpleResult(ACRONYM_EXERCISE_ID, correct, stage.items.length, performance.now() - started.current, uiLang)
            setStage({ name: 'result', correct, total: stage.items.length })
          }}
        />
      </>,
    )
  }

  if (stage.name === 'result')
    return wrap(
      <div className="flex flex-col gap-4" data-own-result={stage.correct}>
        <h2 className="font-heading text-3xl font-bold text-foreground tabular-nums">{t('training.studio.correctOf', { correct: stage.correct, total: stage.total })}</h2>
        <p className="text-sm text-muted-foreground">{t('training.studio.savedForReview')}</p>
        <Button
          size="lg"
          className="min-h-12 rounded-full"
          onClick={() => {
            setTitle('')
            setItemsText('')
            setSentence('')
            setStage({ name: 'make' })
          }}
        >
          {t('training.studio.anotherList')}
        </Button>
        <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={() => setStage({ name: 'home' })}>
          {t('training.studio.back')}
        </Button>
      </div>,
    )

  if (stage.name === 'make')
    return wrap(
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          void save()
        }}
        data-own-list="acronym"
      >
        <p className="text-sm text-muted-foreground">{t('training.studio.acronymIntro')}</p>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{t('training.studio.listTitle')}</span>
          <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder={t('training.studio.acronymTitlePlaceholder')} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base text-foreground" data-own-title="true" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{t('training.studio.acronymItems', { min: ACRONYM_MIN, max: ACRONYM_MAX })}</span>
          <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows={6} className="rounded-xl border border-border bg-background px-3 py-2 text-base text-foreground" data-own-items="true" />
        </label>
        {items.length >= 2 && (
          <div className="flex flex-col gap-1 rounded-2xl border border-border/60 p-3" data-acronym-code={code}>
            <span className="text-sm font-semibold text-foreground">{t('training.studio.acronymLetters')}</span>
            <p className="font-heading text-3xl font-bold tracking-widest text-primary">{code}</p>
            <p className="text-xs text-muted-foreground">{t('training.studio.acronymLettersHint')}</p>
          </div>
        )}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{t('training.studio.acronymSentence')}</span>
          <input value={sentence} maxLength={300} onChange={(e) => setSentence(e.target.value)} placeholder={t('training.studio.acronymSentencePlaceholder')} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base text-foreground" data-acronym-sentence="true" />
          {!sentenceOk && <span className="text-xs text-muted-foreground">{t('training.studio.acronymSentenceCheck', { letters: code })}</span>}
        </label>
        {items.length >= ACRONYM_MIN && items.length <= ACRONYM_MAX && <SuggestButton request={{ kind: 'acronym', letters: code.replace(/\s/g, '').slice(0, 12), items, lang: uiLang }} onIdea={(text) => setSentence(text.slice(0, 300))} />}
        {error !== null && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="min-h-12 rounded-full" disabled={busy} data-own-save="true">
          {t('training.studio.saveAndTest')}
        </Button>
        <Button type="button" variant="ghost" size="lg" className="min-h-12 rounded-full" onClick={() => (inPlan ? onExit?.() : setStage({ name: 'home' }))}>
          {t('training.studio.back')}
        </Button>
      </form>,
    )

  return (
    <>
      <MethodHome
        title={t('training.studio.acronymTitle')}
        description={t('training.studio.acronymDesc')}
        actions={[
          { key: 'learn', icon: 'learn', label: t('training.studio.learn'), sub: t('training.studio.acronymLearnSub'), onClick: () => setStage({ name: 'lesson' }) },
          { key: 'make', icon: 'own', label: t('training.studio.acronymMake'), sub: t('training.studio.acronymMakeSub'), onClick: () => setStage({ name: 'make' }), primary: true },
        ]}
      />
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3 px-4 pb-8" data-acronym-examples="true">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.studio.acronymExamples')}</p>
        {ACRONYM_EXAMPLES[exampleLang].map((ex) => (
          <div key={ex.title} className="rounded-2xl border border-border/60 bg-card p-4">
            <p className="text-sm font-semibold text-foreground">{ex.title}</p>
            <p className="mt-1 font-heading text-xl font-bold tracking-widest text-primary">{ex.code}</p>
            {ex.sentence && <p className="text-sm text-foreground">{ex.sentence}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{ex.items.join(' · ')}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function AcronymTry({ list, onDone }: { list: { title: string; items: string[] }; onDone: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [sentence, setSentence] = useState('')
  const [phase, setPhase] = useState<'study' | 'recall' | 'result'>('study')
  const [correct, setCorrect] = useState(0)
  const started = useRef(performance.now())
  const code = firstLetters(list.items)
  const choices = useMemo(
    () =>
      shuffle(
        list.items.map((label, i) => ({ id: `i${i}`, label, picture: false })),
        rng,
      ),
    [list],
  )
  if (phase === 'result')
    return (
      <div className="flex flex-col gap-4" data-acronym-try-result={correct}>
        <h2 className="font-heading text-3xl font-bold text-foreground tabular-nums">{t('training.studio.correctOf', { correct, total: list.items.length })}</h2>
        <Button size="lg" className="min-h-12 rounded-full" onClick={onDone} data-acronym-try-done="true">
          {t('training.studio.continue')}
        </Button>
      </div>
    )
  if (phase === 'recall')
    return (
      <>
        <div className="rounded-2xl bg-primary/10 p-3 text-center">
          <p className="font-heading text-2xl font-bold tracking-widest text-foreground">{code}</p>
          {sentence.trim() && <p className="mt-1 text-sm text-foreground">{sentence.trim()}</p>}
        </div>
        <OrderRecall
          choices={choices}
          count={list.items.length}
          hint={t('training.studio.acronymRecallHint')}
          onCheck={(answer) => {
            const n = orderScore(
              list.items.map((_, i) => `i${i}`),
              answer,
            )
            saveSimpleResult(ACRONYM_TRY_EXERCISE_ID, n, list.items.length, performance.now() - started.current, uiLang)
            setCorrect(n)
            setPhase('result')
          }}
        />
      </>
    )
  return (
    <div className="flex flex-col gap-4" data-acronym-try={list.title}>
      <p className="text-sm text-muted-foreground">{t('training.studio.acronymTryIntro')}</p>
      <div className="rounded-2xl border border-border/60 p-4">
        <p className="font-semibold text-foreground">{list.title}</p>
        <ol className="mt-2 flex flex-col gap-1">
          {list.items.map((it, i) => (
            <li key={it} className="flex gap-2 text-base text-foreground">
              <span className="w-6 text-right font-bold text-primary tabular-nums">{i + 1}.</span>
              <span>
                <strong className="text-primary">{Array.from(it)[0]}</strong>
                {Array.from(it).slice(1).join('')}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 font-heading text-3xl font-bold tracking-widest text-primary">{code}</p>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.acronymSentence')}</span>
        <input value={sentence} maxLength={300} onChange={(e) => setSentence(e.target.value)} placeholder={t('training.studio.acronymSentencePlaceholder')} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base text-foreground" />
        {sentence.trim() !== '' && !sentenceMatches(code, sentence) && <span className="text-xs text-muted-foreground">{t('training.studio.acronymSentenceCheck', { letters: code })}</span>}
      </label>
      <SuggestButton request={{ kind: 'acronym', letters: code.replace(/\s/g, '').slice(0, 12), items: list.items, lang: uiLang }} onIdea={(text) => setSentence(text.slice(0, 300))} />
      <Button size="lg" className="min-h-12 rounded-full" onClick={() => setPhase('recall')} data-acronym-try-ready="true">
        {t('training.studio.faceReady')}
      </Button>
    </div>
  )
}
