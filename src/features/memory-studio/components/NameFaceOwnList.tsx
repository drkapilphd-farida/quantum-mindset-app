'use client'

import { useMemo, useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { saveOwnList } from '../actions'
import { NAME_FACE_OWN_EXERCISE_ID } from '../nameFace'
import { shuffle } from '../storyMethod'
import { saveSimpleResult } from '../saveResult'
import { SuggestButton } from './SuggestButton'

const rng = (n: number): number => Math.floor(Math.random() * n)
const MAX_PEOPLE = 20

type Row = { name: string; who: string; picture: string }
const empty = (): Row => ({ name: '', who: '', picture: '' })

// "People I want to remember": real people the learner meets (a new class, a
// new office). Only words are saved — never a photo. For each person: the
// name, who they are and what stands out, and (optionally) the picture that
// links the two. Tested once now (who is this? → the name), then reviewed.
export function NameFaceOwnList({ onBack }: { onBack: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [title, setTitle] = useState('')
  const [rows, setRows] = useState<Row[]>([empty(), empty(), empty()])
  const [stage, setStage] = useState<{ name: 'form' } | { name: 'test'; people: Row[] } | { name: 'result'; correct: number; total: number }>({ name: 'form' })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const started = useRef(0)
  const set = (i: number, patch: Partial<Row>): void => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  async function save(): Promise<void> {
    const people = rows.map((r) => ({ name: r.name.trim().slice(0, 40), who: r.who.trim().slice(0, 70), picture: r.picture.trim().slice(0, 200) })).filter((r) => r.name !== '')
    if (people.length < 2) return setError(t('training.studio.faceOwnTooFew'))
    if (people.some((p) => p.who === '')) return setError(t('training.studio.faceOwnNeedWho'))
    if (title.trim() === '') return setError(t('training.studio.needTitle'))
    setBusy(true)
    const pictures = people.some((p) => p.picture !== '') ? people.map((p) => `${p.name}: ${p.picture}`).join('\n') : null
    const res = await saveOwnList({ method: 'name-face', title: title.trim(), items: people.map((p) => `${p.name} — ${p.who}`), story: pictures === null ? null : pictures.slice(0, 2000), lang: uiLang })
    setBusy(false)
    if (!res.ok) return setError(t('training.studio.saveError'))
    started.current = performance.now()
    setStage({ name: 'test', people })
  }

  if (stage.name === 'result') {
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
  }

  if (stage.name === 'test') {
    return (
      <OwnPeopleTest
        people={stage.people}
        onDone={(correct) => {
          saveSimpleResult(NAME_FACE_OWN_EXERCISE_ID, correct, stage.people.length, performance.now() - started.current, uiLang)
          setStage({ name: 'result', correct, total: stage.people.length })
        }}
      />
    )
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        void save()
      }}
      data-own-list="name-face"
    >
      <p className="text-sm text-muted-foreground">{t('training.studio.faceOwnIntro')}</p>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.listTitle')}</span>
        <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder={t('training.studio.faceOwnTitlePlaceholder')} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base text-foreground" data-own-title="true" />
      </label>
      <ol className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <li key={i} className="flex flex-col gap-2 rounded-2xl border border-border/60 p-3" data-own-person={i}>
            <div className="flex items-center gap-2">
              <span className="w-6 text-right text-sm font-bold text-primary tabular-nums">{i + 1}.</span>
              <input value={r.name} maxLength={40} onChange={(e) => set(i, { name: e.target.value })} placeholder={t('training.studio.faceOwnName')} aria-label={t('training.studio.faceOwnName')} className="min-h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-base font-semibold text-foreground" />
              {rows.length > 2 && (
                <button type="button" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label={t('training.studio.remove')} className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60">
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <input value={r.who} maxLength={70} onChange={(e) => set(i, { who: e.target.value })} placeholder={t('training.studio.faceOwnWho')} aria-label={t('training.studio.faceOwnWho')} className="min-h-10 rounded-lg border border-border bg-background px-2 text-sm text-foreground" />
            <input value={r.picture} maxLength={200} onChange={(e) => set(i, { picture: e.target.value })} placeholder={t('training.studio.faceWritePlaceholder')} aria-label={t('training.studio.faceWrite')} className="min-h-10 rounded-lg border border-border bg-background px-2 text-sm text-foreground" />
            {r.name.trim() !== '' && r.who.trim() !== '' && <SuggestButton request={{ kind: 'face', name: r.name.trim().slice(0, 40), feature: r.who.trim().slice(0, 60), lang: uiLang }} onIdea={(text) => set(i, { picture: text.slice(0, 200) })} />}
          </li>
        ))}
      </ol>
      {rows.length < MAX_PEOPLE && (
        <Button type="button" variant="outline" className="min-h-11 self-start rounded-full" onClick={() => setRows([...rows, empty()])} data-own-add-person="true">
          <Plus className="size-4" aria-hidden="true" /> {t('training.studio.faceOwnAdd')}
        </Button>
      )}
      <p className="text-xs text-muted-foreground">{t('training.studio.faceOwnPrivacy')}</p>
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

function OwnPeopleTest({ people, onDone }: { people: Row[]; onDone: (correct: number) => void }): React.JSX.Element {
  const t = useAppT()
  const order = useMemo(
    () =>
      shuffle(
        people.map((_, i) => i),
        rng,
      ),
    [people],
  )
  const names = useMemo(
    () =>
      shuffle(
        people.map((p, i) => ({ i, name: p.name })),
        rng,
      ),
    [people],
  )
  const [q, setQ] = useState(0)
  const [correct, setCorrect] = useState(0)
  const i = order[q]!
  return (
    <div className="flex flex-col gap-4" data-own-face-question={i}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: people.length })}</p>
      <h2 className="text-xl font-bold break-words text-foreground">{t('training.studio.faceOwnQuestion', { who: people[i]!.who })}</h2>
      <div className="grid grid-cols-2 gap-2">
        {names.map((o) => (
          <button
            key={o.i}
            type="button"
            className="min-h-12 rounded-xl border-2 border-border/60 bg-background px-3 text-base font-semibold break-words text-foreground active:border-primary"
            onClick={() => {
              const total = correct + (o.i === i ? 1 : 0)
              if (q + 1 < people.length) {
                setCorrect(total)
                setQ(q + 1)
              } else onDone(total)
            }}
          >
            {o.name}
          </button>
        ))}
      </div>
    </div>
  )
}
