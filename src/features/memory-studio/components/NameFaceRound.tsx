'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { IllustratedFace } from '@/features/memory-check/components/IllustratedFace'
import type { StudioLang } from '../content'
import { mainFeature, personName, type FaceFeature, type NameFaceRound as Round } from '../nameFace'
import { SuggestButton } from './SuggestButton'

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
  const [correct, setCorrect] = useState(0)

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

  const person = round.people[round.askOrder[q]!]!
  return (
    <div className="flex flex-col items-center gap-4" data-face-question={q}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: round.people.length })}</p>
      <IllustratedFace face={person.face.spec} colorIndex={person.recallShirt} size={130} label={t('training.studio.faceQuestion')} />
      <h2 className="text-xl font-bold text-foreground">{t('training.studio.faceQuestion')}</h2>
      <div className="grid w-full grid-cols-2 gap-2 min-[420px]:grid-cols-3">
        {round.choices.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              const total = correct + (c.id === person.name.id ? 1 : 0)
              if (q + 1 < round.people.length) {
                setCorrect(total)
                setQ(q + 1)
              } else onDone({ correct: total, total: round.people.length, score: total * level })
            }}
            className="min-h-12 rounded-xl border-2 border-border/60 bg-background px-2 text-base font-semibold text-foreground active:border-primary"
            data-face-option={c.id}
          >
            {personName(c, lang)}
          </button>
        ))}
      </div>
    </div>
  )
}
