'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import { StudioPicture } from './StudioPicture'

export type RecallChoice = { id: string; label: string; picture: boolean }

// Put items back in order: tap them one after another (undo the last tap if
// needed). Used by the Story method's practice and the learner's own lists.
export function OrderRecall({ choices, count, onCheck }: { choices: readonly RecallChoice[]; count: number; onCheck: (answer: string[]) => void }): React.JSX.Element {
  const t = useAppT()
  const [answer, setAnswer] = useState<string[]>([])
  const byId = useMemo(() => new Map(choices.map((c) => [c.id, c])), [choices])
  return (
    <div className="flex flex-col gap-4" data-order-recall="true">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t('training.studio.recallTitle')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('training.studio.recallHint')}</p>
      </div>
      <ol className="flex min-h-14 flex-wrap gap-2 rounded-2xl border border-dashed border-border p-2" aria-label={t('training.studio.yourOrder')}>
        {answer.map((id, i) => (
          <li key={id} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-foreground">
            <span className="text-primary tabular-nums">{i + 1}.</span> {byId.get(id)?.label}
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-3 gap-2 min-[420px]:grid-cols-4">
        {choices.map((c) => {
          const used = answer.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              disabled={used || answer.length >= count}
              onClick={() => setAnswer((a) => [...a, c.id])}
              className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border-2 p-1 text-sm font-semibold break-words ${used ? 'border-border/40 opacity-30' : 'border-border/60 bg-background text-foreground active:border-primary'}`}
              data-recall-choice={c.id}
            >
              {c.picture ? <StudioPicture id={c.id} label={c.label} size={40} /> : c.label}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="lg" className="min-h-12 rounded-full" disabled={answer.length === 0} onClick={() => setAnswer((a) => a.slice(0, -1))} data-recall-undo="true">
          {t('training.studio.undo')}
        </Button>
        <Button size="lg" className="min-h-12 rounded-full" disabled={answer.length < count} onClick={() => onCheck(answer)} data-recall-check="true">
          {t('training.studio.check')}
        </Button>
      </div>
    </div>
  )
}
