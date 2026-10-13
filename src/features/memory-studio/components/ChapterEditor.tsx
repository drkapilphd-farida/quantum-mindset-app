'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import { MAX_IDEAS, MIN_IDEAS, type ChapterIdea } from '../chapterBook'
import type { MyPalace } from '../palaces'
import { saveChapterMap, type ChapterMap } from '../chapterActions'
import { ChapterMindMap } from './ChapterMindMap'

// The learner checks and changes the key ideas (the AI only suggests them),
// sees them as a mind map, and picks the palace for the chapter journey.
export function ChapterEditor({ map, palaces, defaultStations, onSaved }: { map: ChapterMap; palaces: readonly MyPalace[]; defaultStations: readonly string[]; onSaved: (ideas: ChapterIdea[], palaceId: string | null) => void }): React.JSX.Element {
  const t = useAppT()
  const [ideas, setIdeas] = useState<ChapterIdea[]>(map.ideas)
  const [palaceId, setPalaceId] = useState<string | null>(map.palaceId ?? palaces.find((p) => p.stations.length >= map.ideas.length)?.id ?? null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (i: number, patch: Partial<ChapterIdea>): void => setIdeas(ideas.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const move = (i: number, d: -1 | 1): void => {
    const next = [...ideas]
    const j = i + d
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j]!, next[i]!]
    setIdeas(next)
  }
  const usable = palaces.filter((p) => p.stations.length >= ideas.length)
  const stations = (usable.find((p) => p.id === palaceId) ?? null)?.stations ?? defaultStations

  return (
    <div className="flex flex-col gap-5" data-chapter-editor={map.id}>
      <ChapterMindMap title={map.title} ideas={ideas} />
      <p className="text-sm text-muted-foreground">{t('training.studio.chapterEditHint')}</p>
      <ol className="flex flex-col gap-3">
        {ideas.map((idea, i) => (
          <li key={i} className="flex flex-col gap-2 rounded-2xl border border-border/60 p-3" data-chapter-idea={i}>
            <div className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-right font-semibold text-primary tabular-nums">{i + 1}.</span>
              <input value={idea.title} maxLength={80} onChange={(e) => set(i, { title: e.target.value })} aria-label={t('training.studio.ideaTitle')} className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-base font-semibold" />
            </div>
            <textarea value={idea.detail} maxLength={200} rows={2} onChange={(e) => set(i, { detail: e.target.value })} aria-label={t('training.studio.ideaDetail')} className="rounded-lg border border-border bg-background px-2 py-1 text-sm" />
            <div className="flex gap-2">
              <button type="button" onClick={() => move(i, -1)} aria-label={t('training.studio.moveUp')} className="flex size-9 items-center justify-center rounded-lg border border-border/60">
                <ArrowUp className="size-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => move(i, 1)} aria-label={t('training.studio.moveDown')} className="flex size-9 items-center justify-center rounded-lg border border-border/60">
                <ArrowDown className="size-4" aria-hidden="true" />
              </button>
              <button type="button" disabled={ideas.length <= MIN_IDEAS} onClick={() => setIdeas(ideas.filter((_, j) => j !== i))} aria-label={t('training.studio.remove')} className="flex size-9 items-center justify-center rounded-lg border border-border/60 disabled:opacity-30">
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ol>
      {ideas.length < MAX_IDEAS && (
        <Button type="button" variant="outline" className="min-h-11 self-start rounded-full" onClick={() => setIdeas([...ideas, { title: '', detail: '', points: [] }])}>
          <Plus className="size-4" aria-hidden="true" /> {t('training.studio.addIdea')}
        </Button>
      )}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold text-foreground">{t('training.studio.chapterPalace')}</legend>
        {usable.map((p) => (
          <label key={p.id} className="flex min-h-11 items-center gap-2 rounded-xl border border-border/60 px-3">
            <input type="radio" name="palace" checked={palaceId === p.id} onChange={() => setPalaceId(p.id)} />
            <span className="text-sm">{p.name}</span>
          </label>
        ))}
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-border/60 px-3">
          <input type="radio" name="palace" checked={palaceId === null || !usable.some((p) => p.id === palaceId)} onChange={() => setPalaceId(null)} />
          <span className="text-sm">{t('training.studio.chapterDefaultWalk')}</span>
        </label>
        <p className="text-xs break-words text-muted-foreground">{stations.slice(0, ideas.length).join(' → ')}</p>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        size="lg"
        className="min-h-12 rounded-full"
        disabled={busy}
        onClick={() => {
          const clean = ideas.map((x) => ({ ...x, title: x.title.trim(), detail: x.detail.trim() })).filter((x) => x.title !== '')
          if (clean.length < MIN_IDEAS) return setError(t('training.studio.ideasRule', { min: MIN_IDEAS, max: MAX_IDEAS }))
          const chosen = usable.some((p) => p.id === palaceId) ? palaceId : null
          setBusy(true)
          void saveChapterMap({ id: map.id, ideas: clean, palaceId: chosen }).then((res) => {
            setBusy(false)
            if (!res.ok) return setError(t('training.studio.saveError'))
            onSaved(clean, chosen)
          })
        }}
        data-chapter-save="true"
      >
        {t('training.studio.chapterStartJourney')}
      </Button>
    </div>
  )
}
