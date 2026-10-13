'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { itemName, STORY_ITEMS, type StudioItem, type StudioLang } from '../content'
import type { PalaceQuestion } from '../palaces'
import { StudioPicture } from './StudioPicture'

// One round in the learner's own palace: walk the stations, leaving one item
// at each (a vivid picture of the two together) → walk again and say what is
// at each station.
export function PalaceRound({ stations, items, questions, pictures, lang, level, onDone }: { stations: readonly string[]; items: readonly StudioItem[]; questions: readonly PalaceQuestion[]; pictures: boolean; lang: StudioLang; level: number; onDone: (o: RoundOutcome) => void }): React.JSX.Element {
  const t = useAppT()
  const [study, setStudy] = useState(0)
  const [q, setQ] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const name = (id: string): string => itemName(STORY_ITEMS.find((i) => i.id === id)!, lang)

  if (q === null) {
    const item = items[study]!
    return (
      <div className="flex flex-col items-center gap-5" data-palace-study={study}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: study + 1, total: items.length })}</p>
        <p className="text-center font-heading text-3xl font-bold break-words text-foreground">{stations[study]}</p>
        {pictures ? <StudioPicture id={item.id} label={itemName(item, lang)} size={84} /> : <p className="text-2xl font-semibold text-foreground">{itemName(item, lang)}</p>}
        <p className="text-center text-sm text-muted-foreground">{t('training.studio.palaceStudyHint')}</p>
        <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => (study + 1 < items.length ? setStudy(study + 1) : setQ(0))} data-palace-next="true">
          {t('training.studio.next')}
        </Button>
      </div>
    )
  }
  const question = questions[q]!
  return (
    <div className="flex flex-col gap-4" data-palace-question={question.station}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: questions.length })}</p>
      <h2 className="text-xl font-bold break-words text-foreground">{t('training.studio.palaceQuestion', { station: stations[question.station]! })}</h2>
      <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3">
        {question.options.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              const total = correct + (id === question.answer ? 1 : 0)
              if (q + 1 < questions.length) {
                setCorrect(total)
                setQ(q + 1)
              } else onDone({ correct: total, total: questions.length, score: total * level })
            }}
            className="flex min-h-24 flex-col items-center justify-center rounded-xl border-2 border-border/60 bg-background p-2 active:border-primary"
            data-palace-option={id}
          >
            {pictures ? <StudioPicture id={id} label={name(id)} size={44} /> : <span className="text-base font-semibold text-foreground">{name(id)}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
