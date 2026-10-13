'use client'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import type { MyPalace } from '../palaces'
import { PALACE_OWN_EXERCISE_ID } from '../palaces'
import { savePalaceList } from '../palaceActions'
import { shuffle } from '../storyMethod'
import { saveSimpleResult } from '../saveResult'

const rng = (n: number): number => Math.floor(Math.random() * n)

// The learner's own list, one item per station of one of their palaces →
// saved, tested once now ("what is at the bus stop?"), then reviewed later.
export function PalaceOwnList({ palaces, onBack }: { palaces: readonly MyPalace[]; onBack: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [palaceId, setPalaceId] = useState(palaces[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [itemsText, setItemsText] = useState('')
  const [stage, setStage] = useState<'form' | 'test' | 'result'>('form')
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState(0)
  const [correct, setCorrect] = useState(0)
  const started = useRef(0)
  const palace = palaces.find((p) => p.id === palaceId) ?? palaces[0]
  const items = useMemo(
    () =>
      itemsText
        .split('\n')
        .map((s) => s.trim().slice(0, 60))
        .filter(Boolean),
    [itemsText],
  )
  const order = useMemo(
    () =>
      shuffle(
        items.map((_, i) => i),
        rng,
      ),
    // A new order for each test.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stage === 'test'],
  )
  // The choices for the current question, fixed while it is on screen.
  const options = useMemo(() => {
    const i = order[q]
    if (i === undefined) return []
    return shuffle([i, ...shuffle(order.filter((x) => x !== i), rng).slice(0, Math.min(5, items.length - 1))], rng)
  }, [order, q, items.length])
  if (!palace) return <p className="text-sm text-muted-foreground">{t('training.studio.palaceNone')}</p>

  if (stage === 'result')
    return (
      <div className="flex flex-col gap-4" data-own-result={correct}>
        <h2 className="font-heading text-3xl font-bold text-foreground tabular-nums">{t('training.studio.correctOf', { correct, total: items.length })}</h2>
        <p className="text-sm text-muted-foreground">{t('training.studio.savedForReview')}</p>
        <Button size="lg" className="min-h-12 rounded-full" onClick={() => (setTitle(''), setItemsText(''), setCorrect(0), setQ(0), setStage('form'))}>
          {t('training.studio.anotherList')}
        </Button>
        <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={onBack}>
          {t('training.studio.back')}
        </Button>
      </div>
    )

  if (stage === 'test') {
    const i = order[q]!
    return (
      <div className="flex flex-col gap-4" data-palace-own-question={i}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: items.length })}</p>
        <h2 className="text-xl font-bold break-words text-foreground">{t('training.studio.palaceQuestion', { station: palace.stations[i]! })}</h2>
        <div className="flex flex-col gap-2">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              className="min-h-12 rounded-xl border-2 border-border/60 bg-background px-3 text-left text-base font-semibold break-words text-foreground"
              onClick={() => {
                const total = correct + (o === i ? 1 : 0)
                setCorrect(total)
                if (q + 1 < items.length) setQ(q + 1)
                else {
                  saveSimpleResult(PALACE_OWN_EXERCISE_ID, total, items.length, performance.now() - started.current, uiLang)
                  setStage('result')
                }
              }}
            >
              {items[o]}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (title.trim() === '') return setError(t('training.studio.needTitle'))
        if (items.length < 2 || items.length > palace.stations.length) return setError(t('training.studio.palaceTooMany', { max: palace.stations.length }))
        void savePalaceList({ palaceId: palace.id, title: title.trim(), items, lang: uiLang }).then((res) => {
          if (!res.ok) return setError(t('training.studio.saveError'))
          started.current = performance.now()
          setQ(0)
          setCorrect(0)
          setStage('test')
        })
      }}
      data-palace-own="true"
    >
      <p className="text-sm text-muted-foreground">{t('training.studio.palaceOwnIntro')}</p>
      {palaces.length > 1 && (
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">{t('training.studio.palaceChoose')}</span>
          <select value={palace.id} onChange={(e) => setPalaceId(e.target.value)} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base">
            {palaces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.listTitle')}</span>
        <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder={t('training.studio.listTitlePlaceholder')} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base" data-own-title="true" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.itemsLabel')}</span>
        <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows={6} className="rounded-xl border border-border bg-background px-3 py-2 text-base" data-own-items="true" />
      </label>
      {items.length > 0 && (
        <ol className="flex flex-col gap-1 rounded-2xl border border-border/60 p-3 text-sm">
          {items.slice(0, palace.stations.length).map((it, i) => (
            <li key={`${i}-${it}`} className="flex gap-2 break-words">
              <span className="font-semibold text-primary">{palace.stations[i]}</span> → {it}
            </li>
          ))}
        </ol>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="min-h-12 rounded-full" data-own-save="true">
        {t('training.studio.saveAndTest')}
      </Button>
    </form>
  )
}
