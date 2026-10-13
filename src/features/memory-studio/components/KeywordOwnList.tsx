'use client'

import { useMemo, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { saveOwnList } from '../actions'
import { KEYWORD_OWN_EXERCISE_ID } from '../keyword'
import { saveSimpleResult } from '../saveResult'
import { shuffle } from '../storyMethod'
import { SuggestButton } from './SuggestButton'

const rng = (n: number): number => Math.floor(Math.random() * n)
const MAX = 20
type Row = { word: string; meaning: string; picture: string }
const empty = (): Row => ({ word: '', meaning: '', picture: '' })

// "Your own words": new words from a lesson, science terms or another
// language → each with its meaning and (optionally) the learner's keyword
// picture → saved, tested once now (word → meaning), then reviewed.
export function KeywordOwnList({ onBack }: { onBack: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [title, setTitle] = useState('')
  const [rows, setRows] = useState<Row[]>([empty(), empty(), empty()])
  const [stage, setStage] = useState<{ name: 'form' } | { name: 'test'; rows: Row[] } | { name: 'result'; correct: number; total: number }>({ name: 'form' })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const started = useRef(0)
  const set = (i: number, patch: Partial<Row>): void => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  async function save(): Promise<void> {
    const filled = rows.map((r) => ({ word: r.word.trim().slice(0, 40), meaning: r.meaning.trim().slice(0, 70), picture: r.picture.trim().slice(0, 200) })).filter((r) => r.word !== '' || r.meaning !== '')
    if (filled.length < 2 || filled.some((r) => r.word === '' || r.meaning === '')) return setError(t('training.studio.keywordOwnRule'))
    if (title.trim() === '') return setError(t('training.studio.needTitle'))
    setBusy(true)
    const pictures = filled.some((r) => r.picture !== '') ? filled.map((r) => `${r.word}: ${r.picture}`).join('\n').slice(0, 2000) : null
    const res = await saveOwnList({ method: 'keyword', title: title.trim(), items: filled.map((r) => `${r.word} — ${r.meaning}`), story: pictures, lang: uiLang })
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
            setRows([empty(), empty(), empty()])
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
      <OwnWordsTest
        rows={stage.rows}
        onDone={(correct) => {
          saveSimpleResult(KEYWORD_OWN_EXERCISE_ID, correct, stage.rows.length, performance.now() - started.current, uiLang)
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
      data-own-list="keyword"
    >
      <p className="text-sm text-muted-foreground">{t('training.studio.keywordOwnIntro')}</p>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.listTitle')}</span>
        <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder={t('training.studio.keywordOwnTitlePlaceholder')} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base text-foreground" data-own-title="true" />
      </label>
      <ol className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <li key={i} className="flex flex-col gap-2 rounded-2xl border border-border/60 p-3" data-own-word={i}>
            <div className="flex items-center gap-2">
              <span className="w-6 text-right text-sm font-bold text-primary tabular-nums">{i + 1}.</span>
              <input value={r.word} maxLength={40} onChange={(e) => set(i, { word: e.target.value })} placeholder={t('training.studio.keywordOwnWord')} aria-label={t('training.studio.keywordOwnWord')} className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-base font-semibold text-foreground" />
              {rows.length > 2 && (
                <button type="button" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label={t('training.studio.remove')} className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60">
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <input value={r.meaning} maxLength={70} onChange={(e) => set(i, { meaning: e.target.value })} placeholder={t('training.studio.keywordOwnMeaning')} aria-label={t('training.studio.keywordOwnMeaning')} className="min-h-10 rounded-lg border border-border bg-background px-2 text-sm text-foreground" />
            <input value={r.picture} maxLength={200} onChange={(e) => set(i, { picture: e.target.value })} placeholder={t('training.studio.keywordOwnPicture')} aria-label={t('training.studio.keywordOwnPicture')} className="min-h-10 rounded-lg border border-border bg-background px-2 text-sm text-foreground" />
            {r.word.trim() !== '' && r.meaning.trim() !== '' && <SuggestButton request={{ kind: 'keyword', word: r.word.trim().slice(0, 40), meaning: r.meaning.trim().slice(0, 70), lang: uiLang }} onIdea={(text) => set(i, { picture: text.slice(0, 200) })} />}
          </li>
        ))}
      </ol>
      {rows.length < MAX && (
        <Button type="button" variant="outline" className="min-h-11 self-start rounded-full" onClick={() => setRows([...rows, empty()])}>
          <Plus className="size-4" aria-hidden="true" /> {t('training.studio.keywordOwnAdd')}
        </Button>
      )}
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

function OwnWordsTest({ rows, onDone }: { rows: Row[]; onDone: (correct: number) => void }): React.JSX.Element {
  const t = useAppT()
  const order = useMemo(
    () =>
      shuffle(
        rows.map((_, i) => i),
        rng,
      ),
    [rows],
  )
  const meanings = useMemo(
    () =>
      shuffle(
        rows.map((r, i) => ({ i, meaning: r.meaning })),
        rng,
      ),
    [rows],
  )
  const [q, setQ] = useState(0)
  const [correct, setCorrect] = useState(0)
  const i = order[q]!
  return (
    <div className="flex flex-col gap-4" data-own-word-question={i}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: rows.length })}</p>
      <h2 className="text-xl font-bold break-words text-foreground">{t('training.studio.keywordQuestion', { word: rows[i]!.word })}</h2>
      <div className="flex flex-col gap-2">
        {meanings.map((o) => (
          <button
            key={o.i}
            type="button"
            className="min-h-12 rounded-xl border-2 border-border/60 bg-background px-3 py-2 text-left text-base font-semibold break-words text-foreground active:border-primary"
            onClick={() => {
              const total = correct + (o.i === i ? 1 : 0)
              if (q + 1 < rows.length) {
                setCorrect(total)
                setQ(q + 1)
              } else onDone(total)
            }}
            data-own-meaning={o.i}
          >
            {o.meaning}
          </button>
        ))}
      </div>
    </div>
  )
}
