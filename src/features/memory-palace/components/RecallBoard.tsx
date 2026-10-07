'use client'

import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useAppT } from '@/lib/app-i18n/client'
import type { MessageKey } from '@/lib/app-i18n/translate'
import { buildChoices, levelConfig, PALACE_OBJECTS } from '../memoryPalace'

const FEEDBACK_MS = 1100

export function objectNameKey(id: string): MessageKey {
  return `training.palace.objects.o${id.replace('-', '_')}` as MessageKey
}

export function placeNameKey(index: number): MessageKey {
  return `training.palace.places.p${String(index + 1).padStart(2, '0')}` as MessageKey
}

export function ObjectPicture({ id, size = 64 }: { id: string; size?: number }): React.JSX.Element {
  const icon = PALACE_OBJECTS.find((o) => o.id === id)?.icon ?? ''
  // eslint-disable-next-line @next/next/no-img-element -- tiny static SVGs; next/image adds nothing here
  return <img src={icon} alt="" width={size} height={size} className="select-none" draggable={false} />
}

type RecallBoardProps = {
  objects: readonly string[]
  level: number
  onFinished: (correct: number) => void
}

// One place at a time, in walking order: "What did you leave here?" with
// 4 (or 6) pictures. Brief right/wrong feedback, then the next place.
export function RecallBoard({ objects, level, onFinished }: RecallBoardProps): React.JSX.Element {
  const t = useAppT()
  // Built once per palace, so choices never reshuffle while the learner answers.
  const choicesPerPlace = useMemo(() => objects.map((id) => buildChoices(id, levelConfig(level))), [objects, level])
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  const answer = objects[index]!
  const choices = choicesPerPlace[index]!

  function pick(id: string): void {
    if (picked !== null) return
    setPicked(id)
    const nextCorrect = correct + (id === answer ? 1 : 0)
    setCorrect(nextCorrect)
    window.setTimeout(() => {
      setPicked(null)
      if (index + 1 >= objects.length) onFinished(nextCorrect)
      else setIndex(index + 1)
    }, FEEDBACK_MS)
  }

  return (
    <div className="flex w-full flex-col gap-4" data-recall-place={index + 1}>
      <div className="text-center">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.palace.placeOf', { n: index + 1, total: objects.length })}</p>
        <p className="mt-1 font-heading text-2xl font-bold text-foreground">{t(placeNameKey(index))}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('training.palace.recallQ')}</p>
      </div>
      <div className={`grid gap-3 ${choices.length > 4 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`} role="group" aria-label={t('training.palace.choicesAria')}>
        {choices.map((id) => {
          const isAnswer = id === answer
          const state = picked === null ? 'idle' : isAnswer ? 'right' : picked === id ? 'wrong' : 'idle'
          return (
            <button
              key={id}
              type="button"
              onClick={() => pick(id)}
              disabled={picked !== null}
              data-choice={id}
              className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 text-center transition-colors ${
                state === 'right' ? 'border-emerald-500 bg-emerald-500/10' : state === 'wrong' ? 'border-red-500 bg-red-500/10' : 'border-border/60 bg-card hover:border-primary/50'
              }`}
            >
              <ObjectPicture id={id} size={56} />
              <span className="text-sm leading-tight font-medium text-foreground">{t(objectNameKey(id))}</span>
              {state === 'right' && <Check className="size-4 text-emerald-600" aria-label={t('training.palace.correct')} />}
              {state === 'wrong' && <X className="size-4 text-red-600" aria-label={t('training.palace.notQuite')} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
