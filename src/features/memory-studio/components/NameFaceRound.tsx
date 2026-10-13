'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { IllustratedFace } from '@/features/memory-check/components/IllustratedFace'
import type { StudioLang } from '../content'
import { mainFeature, personName, type FaceFeature, type NameFaceRound as Round } from '../nameFace'
import { SuggestButton } from './SuggestButton'
import { FeedbackSheet, type Feedback } from '@/components/play/FeedbackSheet'
import { answer, current, finished, isRetry, startQueue, willComeBack } from '@/components/play/retryQueue'

export function featureKey(feature: FaceFeature): Parameters<ReturnType<typeof useAppT>>[0] {
  return `training.studio.feature.${feature}` as Parameters<ReturnType<typeof useAppT>>[0]
}

// One Names-and-faces round: meet each person (notice one feature, turn the
// name into a picture, link the two — writing it down is optional) → see the
// faces again in a new order and pick each one's name.
export function NameFaceRound({ round, hint, lang, level, onDone }: { round: Round; hint: boolean; lang: StudioLang; level: number; onDone: (o: RoundOutcome) => void }): React.JSX.Element {
  const t = useAppT()
  const [study, setStudy] = useState(0)
  const [notes, setNotes] = useState<string[]>(() => round.people.map(() => ''))
  const [suggested, setSuggested] = useState(false)
  const [q, setQ] = useState<number | null>(null)
  const [queue, setQueue] = useState(() => startQueue(round.askOrder))
  const [pending, setPending] = useState<{ chosen: string; right: boolean; feedback: Feedback } | null>(null)

  if (q === null) {
    const person = round.people[study]!
    const name = personName(person.name, lang)
    const feature = t(featureKey(mainFeature(person.face.spec)))
    return (
      <div className="flex flex-col items-center gap-4" data-face-study={study}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: study + 1, total: round.people.length })}</p>
        <IllustratedFace face={person.face.spec} colorIndex={person.shirt} size={150} label={name} />
        <p className="font-heading text-3xl font-bold text-foreground" data-face-name={person.name.id}>
          {name}
        </p>
        {hint && (
          <p className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-foreground" data-face-hint="true">
            {t('training.studio.faceNotice', { feature })}
          </p>
        )}
        <p className="text-center text-sm text-muted-foreground">{t('training.studio.faceStudyHint')}</p>
        <label className="flex w-full flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{t('training.studio.faceWrite')}</span>
          <input
            value={notes[study]}
            onChange={(e) => setNotes(notes.map((x, i) => (i === study ? e.target.value.slice(0, 300) : x)))}
            placeholder={t('training.studio.faceWritePlaceholder')}
            className="min-h-11 rounded-xl border border-border bg-background px-3 text-base text-foreground"
          />
        </label>
        <div className="w-full">
          <SuggestButton
            key={study}
            request={{ kind: 'face', name, feature, lang }}
            onIdea={(text) => {
              setSuggested(true)
              setNotes(notes.map((x, i) => (i === study ? text.slice(0, 300) : x)))
            }}
          />
          {suggested && <p className="mt-1 text-xs text-muted-foreground">{t('training.studio.suggestNote')}</p>}
        </div>
        <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => (study + 1 < round.people.length ? setStudy(study + 1) : setQ(0))} data-face-next="true">
          {study + 1 < round.people.length ? t('training.studio.next') : t('training.studio.faceReady')}
        </Button>
      </div>
    )
  }

  const ask = queue.order.length > 0 ? current(queue) : null
  if (ask === null) return <div />
  const person = round.people[ask]!
  const choose = (id: string): void => {
    if (pending !== null) return
    const right = id === person.name.id
    setPending({ right, chosen: id, feedback: right ? { kind: 'good', points: isRetry(queue) ? 0 : level * 2, detail: personName(person.name, lang) } : { kind: 'warn', answer: t('training.play.answerIs', { answer: personName(person.name, lang) }), tip: t('training.studio.faceTip', { feature: t(featureKey(mainFeature(person.face.spec))) }), comesBack: willComeBack(queue) } })
  }
  const next = (): void => {
    if (pending === null) return
    const q2 = answer(queue, pending.right)
    setPending(null)
    setQueue(q2)
    if (finished(q2)) onDone({ correct: q2.correctFirst, total: round.people.length, score: q2.correctFirst * level })
  }
  return (
    <div className="flex flex-col items-center gap-4 pb-56" data-face-question={queue.pos}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: Math.min(queue.pos + 1, queue.order.length), total: queue.order.length })}</p>
      <IllustratedFace face={person.face.spec} colorIndex={person.recallShirt} size={130} label={t('training.studio.faceQuestion')} />
      <h2 className="text-2xl text-foreground">{t('training.studio.faceQuestion')}</h2>
      <div className="grid w-full grid-cols-2 gap-3 min-[420px]:grid-cols-3">
        {round.choices.map((c) => {
          const state = pending === null ? 'idle' : c.id === person.name.id ? 'right' : c.id === pending.chosen ? 'chosen' : 'idle'
          return (
            <button key={c.id} type="button" onClick={() => choose(c.id)} disabled={pending !== null} className="play-option min-h-14 px-2 text-lg font-bold text-foreground" data-state={state} data-face-option={c.id}>
              {personName(c, lang)}
            </button>
          )
        })}
      </div>
      {pending !== null && <FeedbackSheet feedback={pending.feedback} onContinue={next} />}
    </div>
  )
}
