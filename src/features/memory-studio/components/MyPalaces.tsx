'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { StudioLang } from '../content'
import { deletePalace, savePalace } from '../palaceActions'
import { MAX_PALACES, MAX_STATIONS, MIN_STATIONS, PALACE_KINDS, STATION_SUGGESTIONS, type MyPalace, type PalaceKind } from '../palaces'

type Draft = { id: string | null; name: string; kind: PalaceKind; stations: string[] }

// The learner's own palaces: up to 3, each with 10–20 stations in walking
// order. A new palace starts from suggested stations the learner changes to
// match their own place.
export function MyPalaces({ palaces, lang, onChanged }: { palaces: readonly MyPalace[]; lang: StudioLang; onChanged: () => void }): React.JSX.Element {
  const t = useAppT()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const kindLabel = (k: PalaceKind): string => t(`training.studio.palaceKind.${k}`)

  if (draft !== null) {
    const setStation = (i: number, v: string): void => setDraft({ ...draft, stations: draft.stations.map((s, j) => (j === i ? v : s)) })
    const move = (i: number, d: -1 | 1): void => {
      const s = [...draft.stations]
      const j = i + d
      if (j < 0 || j >= s.length) return
      ;[s[i], s[j]] = [s[j]!, s[i]!]
      setDraft({ ...draft, stations: s })
    }
    const filled = draft.stations.filter((s) => s.trim() !== '').length
    return (
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (filled < MIN_STATIONS || filled > MAX_STATIONS) return setError(t('training.studio.palaceStationsRule', { min: MIN_STATIONS, max: MAX_STATIONS }))
          setBusy(true)
          void savePalace({ id: draft.id, name: draft.name.trim() || kindLabel(draft.kind), kind: draft.kind, stations: draft.stations }).then((res) => {
            setBusy(false)
            if (!res.ok) return setError(res.error === 'limit' ? t('training.studio.palaceLimit', { max: MAX_PALACES }) : t('training.studio.saveError'))
            setDraft(null)
            onChanged()
          })
        }}
        data-palace-editor={draft.kind}
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{t('training.studio.palaceName')}</span>
          <input value={draft.name} maxLength={60} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder={kindLabel(draft.kind)} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base" data-palace-name="true" />
        </label>
        <p className="text-sm text-muted-foreground">{t('training.studio.palaceStationsHint')}</p>
        <ol className="flex flex-col gap-2">
          {draft.stations.map((s, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-right text-sm font-semibold text-primary tabular-nums">{i + 1}.</span>
              <input value={s} maxLength={40} onChange={(e) => setStation(i, e.target.value)} aria-label={t('training.studio.palaceStationN', { n: i + 1 })} className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-base" data-palace-station={i} />
              <button type="button" onClick={() => move(i, -1)} aria-label={t('training.studio.moveUp')} className="flex size-9 items-center justify-center rounded-lg border border-border/60">
                <ArrowUp className="size-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => move(i, 1)} aria-label={t('training.studio.moveDown')} className="flex size-9 items-center justify-center rounded-lg border border-border/60">
                <ArrowDown className="size-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setDraft({ ...draft, stations: draft.stations.filter((_, j) => j !== i) })} aria-label={t('training.studio.remove')} className="flex size-9 items-center justify-center rounded-lg border border-border/60">
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
        {draft.stations.length < MAX_STATIONS && (
          <Button type="button" variant="outline" className="min-h-11 self-start rounded-full" onClick={() => setDraft({ ...draft, stations: [...draft.stations, ''] })} data-palace-add-station="true">
            <Plus className="size-4" aria-hidden="true" /> {t('training.studio.addStation')}
          </Button>
        )}
        <p className="text-xs text-muted-foreground tabular-nums">{t('training.studio.stationCount', { count: filled, min: MIN_STATIONS, max: MAX_STATIONS })}</p>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="min-h-12 rounded-full" disabled={busy} data-palace-save="true">
          {t('training.studio.palaceSave')}
        </Button>
        <Button type="button" variant="ghost" size="lg" className="min-h-12 rounded-full" onClick={() => setDraft(null)}>
          {t('training.studio.back')}
        </Button>
      </form>
    )
  }

  return (
    <div className="flex flex-col gap-4" data-my-palaces={palaces.length}>
      {palaces.length === 0 && <p className="text-sm text-muted-foreground">{t('training.studio.palaceNone')}</p>}
      {palaces.map((p) => (
        <div key={p.id} className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-4" data-palace-card={p.id}>
          <p className="font-semibold text-foreground">{p.name}</p>
          <p className="text-sm text-muted-foreground">
            {kindLabel(p.kind)} · {t('training.studio.stationsN', { count: p.stations.length })}
          </p>
          <p className="text-xs break-words text-muted-foreground">{p.stations.join(' → ')}</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setDraft({ id: p.id, name: p.name, kind: p.kind, stations: [...p.stations] })}>
              {t('training.studio.edit')}
            </Button>
            {confirmDelete === p.id ? (
              <Button size="sm" variant="destructive" onClick={() => void deletePalace({ id: p.id }).then(() => (setConfirmDelete(null), onChanged()))}>
                {t('training.studio.confirmDelete')}
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(p.id)}>
                {t('training.studio.delete')}
              </Button>
            )}
          </div>
        </div>
      ))}
      {palaces.length < MAX_PALACES && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-foreground">{t('training.studio.palaceNew')}</p>
          <div className="grid grid-cols-2 gap-2">
            {PALACE_KINDS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setDraft({ id: null, name: '', kind: k, stations: k === 'other' ? Array.from({ length: MIN_STATIONS }, () => '') : [...STATION_SUGGESTIONS[k][lang]].slice(0, 12) })}
                className="min-h-14 rounded-xl border-2 border-border/60 bg-background px-2 text-base font-semibold text-foreground"
                data-palace-new={k}
              >
                {kindLabel(k)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
