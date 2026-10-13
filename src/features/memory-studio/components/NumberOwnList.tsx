'use client'

import { useMemo, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { saveOwnList } from '../actions'
import { NUMBER_OWN_EXERCISE_ID, pairsOf, type NumberList } from '../numberCode'
import { saveSimpleResult } from '../saveResult'
import { shuffle } from '../storyMethod'
import { DigitPad } from './DigitPad'
import { NumberPictureCard } from './NumberPictureCard'

const rng = (n: number): number => Math.floor(Math.random() * n)
const MAX = 10
type Row = { label: string; number: string }
const empty = (): Row => ({ label: '', number: '' })

// "Your own numbers": numbers the learner needs (a formula's constant, a
// date, a roll number) → each shown as its pictures → saved, tested once now,
// then reviewed. The privacy note asks for no passwords, PINs or bank numbers.
export function NumberOwnList({ list, onBack }: { list: NumberList; onBack: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [title, setTitle] = useState('')
  const [rows, setRows] = useState<Row[]>([empty(), empty()])
  const [stage, setStage] = useState<{ name: 'form' } | { name: 'test'; rows: Row[] } | { name: 'result'; correct: number; total: number }>({ name: 'form' })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const started = useRef(0)
  const set = (i: number, patch: Partial<Row>): void => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  async function save(): Promise<void> {
    const filled = rows.map((r) => ({ label: r.label.trim().slice(0, 60), number: r.number })).filter((r) => r.label !== '' || r.number !== '')
    if (filled.length < 2 || filled.some((r) => r.label === '' || r.number.length < 2)) return setError(t('training.studio.numberOwnRule'))
    if (title.trim() === '') return setError(t('training.studio.needTitle'))
    setBusy(true)
    const res = await saveOwnList({ method: 'number', title: title.trim(), items: filled.map((r) => `${r.label}: ${r.number}`), story: null, lang: uiLang })
    setBusy(false)
    if (!res.ok) return setError(t('training.studio.saveError'))
    started.current = performance.now()
    setStage({ name: 'test', rows: filled })
  }

  if (stage.name === 'result')
    return (
      <div className="flex flex-col gap-4" data-own-result={stage.correct}>
        <h2 className="font-heading text-3xl font-bold text-foreground tabular-nums">{t('training.studio.correctOf', { correct: stage.correct, total: stage.total })}</h2>
        <p className="text-sm text-muted-foreground">{t('training.studio.savedForReview')}</p>
        <Button
          size="lg"
          className="min-h-12 rounded-full"
          onClick={() => {
            setTitle('')
            setRows([empty(), empty()])
            setStage({ name: 'form' })
          }}
        >
          {t('training.studio.anotherList')}
        </Button>
        <Button variant="outline" size="lg" className="min-h-12 rounded-full" onClick={onBack}>
          {t('training.studio.back')}
        </Button>
      </div>
    )

  if (stage.name === 'test')
    return (
      <OwnNumbersTest
        rows={stage.rows}
        onDone={(correct) => {
          saveSimpleResult(NUMBER_OWN_EXERCISE_ID, correct, stage.rows.length, performance.now() - started.current, uiLang)
          setStage({ name: 'result', correct, total: stage.rows.length })
        }}
      />
    )

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        void save()
      }}
      data-own-list="number"
    >
      <p className="text-sm text-muted-foreground">{t('training.studio.numberOwnIntro')}</p>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.listTitle')}</span>
        <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder={t('training.studio.numberOwnTitlePlaceholder')} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base text-foreground" data-own-title="true" />
      </label>
      <ol className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <li key={i} className="flex flex-col gap-2 rounded-2xl border border-border/60 p-3" data-own-number={i}>
            <div className="flex items-center gap-2">
              <input value={r.label} maxLength={60} onChange={(e) => set(i, { label: e.target.value })} placeholder={t('training.studio.numberOwnLabel')} aria-label={t('training.studio.numberOwnLabel')} className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-base text-foreground" />
              {rows.length > 2 && (
                <button type="button" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label={t('training.studio.remove')} className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60">
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <input value={r.number} inputMode="numeric" maxLength={16} onChange={(e) => set(i, { number: e.target.value.replace(/\D/g, '').slice(0, 16) })} placeholder={t('training.studio.numberOwnNumber')} aria-label={t('training.studio.numberOwnNumber')} className="min-h-11 rounded-lg border border-border bg-background px-2 font-heading text-lg tracking-wider text-foreground tabular-nums" />
            {r.number.length >= 2 && (
              <div className="flex flex-wrap gap-3">
                {pairsOf(r.number)
                  .filter((pair) => pair.length === 2)
                  .map((pair, k) => (
                    <NumberPictureCard key={`${k}-${pair}`} list={list} pair={pair} size={36} />
                  ))}
              </div>
            )}
          </li>
        ))}
      </ol>
      {rows.length < MAX && (
        <Button type="button" variant="outline" className="min-h-11 self-start rounded-full" onClick={() => setRows([...rows, empty()])}>
          <Plus className="size-4" aria-hidden="true" /> {t('training.studio.numberOwnAdd')}
        </Button>
      )}
      <p className="text-xs text-muted-foreground">{t('training.studio.numberOwnPrivacy')}</p>
      {error !== null && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="min-h-12 rounded-full" disabled={busy} data-own-save="true">
        {t('training.studio.saveAndTest')}
      </Button>
      <Button type="button" variant="ghost" size="lg" className="min-h-12 rounded-full" onClick={onBack}>
        {t('training.studio.back')}
      </Button>
    </form>
  )
}

function OwnNumbersTest({ rows, onDone }: { rows: Row[]; onDone: (correct: number) => void }): React.JSX.Element {
  const t = useAppT()
  const order = useMemo(
    () =>
      shuffle(
        rows.map((_, i) => i),
        rng,
      ),
    [rows],
  )
  const [q, setQ] = useState(0)
  const [correct, setCorrect] = useState(0)
  const row = rows[order[q]!]!
  return (
    <div className="flex flex-col gap-4" data-own-number-question={order[q]}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: rows.length })}</p>
      <h2 className="text-xl font-bold break-words text-foreground">{row.label}</h2>
      <DigitPad
        key={q}
        length={row.number.length}
        onSubmit={(answer) => {
          const total = correct + (answer === row.number ? 1 : 0)
          if (q + 1 < rows.length) {
            setCorrect(total)
            setQ(q + 1)
          } else onDone(total)
        }}
      />
    </div>
  )
}
