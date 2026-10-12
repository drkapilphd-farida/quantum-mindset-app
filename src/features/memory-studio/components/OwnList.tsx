'use client'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { pegFor, pegName, type PegSet, type StudioLang } from '../content'
import { saveOwnList } from '../actions'
import { PEG_OWN_EXERCISE_ID } from '../pegMethod'
import { orderScore, shuffle, STORY_OWN_EXERCISE_ID } from '../storyMethod'
import { saveSimpleResult } from '../saveResult'
import { OrderRecall } from './OrderRecall'
import { PegPicture } from './PegPicture'
import { SuggestButton } from './SuggestButton'

const rng = (n: number): number => Math.floor(Math.random() * n)
const MIN_STORY = 10

type Stage = { name: 'form' } | { name: 'test'; items: string[]; choices: { id: string; label: string; picture: boolean }[] } | { name: 'result'; correct: number; total: number }

// "Use it on your own list": the learner's own list → their own story (Story)
// or their own peg pictures (Peg) → saved and tested once now; it then comes
// back in the review queue 1, 3, 7, 14 and 30 days later.
export function OwnList({ method, set, lang, onBack }: { method: 'story' | 'peg'; set: PegSet; lang: StudioLang; onBack: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const [stage, setStage] = useState<Stage>({ name: 'form' })
  const [title, setTitle] = useState('')
  const [itemsText, setItemsText] = useState('')
  const [story, setStory] = useState('')
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const started = useRef(0)
  const items = useMemo(
    () =>
      itemsText
        .split('\n')
        .map((s) => s.trim().slice(0, 60))
        .filter(Boolean),
    [itemsText],
  )

  async function save(): Promise<void> {
    if (items.length < 2 || items.length > 20) return setError(t('training.studio.tooFew'))
    if (title.trim() === '') return setError(t('training.studio.needTitle'))
    if (method === 'story' && story.trim().length < MIN_STORY) return setError(t('training.studio.needStory'))
    setBusy(true)
    const pegNotes = items.map((_, i) => (notes[i] ?? '').trim()).some(Boolean) ? items.map((it, i) => `${i + 1}. ${it}: ${(notes[i] ?? '').trim()}`).join('\n') : null
    const res = await saveOwnList({ method, title: title.trim(), items, story: method === 'story' ? story.trim() : pegNotes, lang: uiLang })
    setBusy(false)
    if (!res.ok) return setError(t('training.studio.saveError'))
    started.current = performance.now()
    setStage({ name: 'test', items, choices: shuffle(items.map((label, i) => ({ id: `i${i}`, label, picture: false })), rng) })
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
            setItemsText('')
            setStory('')
            setNotes({})
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
    const finish = (correct: number): void => {
      saveSimpleResult(method === 'story' ? STORY_OWN_EXERCISE_ID : PEG_OWN_EXERCISE_ID, correct, stage.items.length, performance.now() - started.current, uiLang)
      setStage({ name: 'result', correct, total: stage.items.length })
    }
    if (method === 'story') {
      const ids = stage.items.map((_, i) => `i${i}`)
      return (
        <OrderRecall
          choices={stage.choices}
          count={stage.items.length}
          onCheck={(answer) => finish(orderScore(ids, answer))}
        />
      )
    }
    return <OwnPegTest items={stage.items} onDone={finish} />
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        void save()
      }}
      data-own-list={method}
    >
      <p className="text-sm text-muted-foreground">{method === 'story' ? t('training.studio.ownStoryIntro') : t('training.studio.ownPegIntro')}</p>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.listTitle')}</span>
        <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder={t('training.studio.listTitlePlaceholder')} className="min-h-12 rounded-xl border border-border bg-background px-3 text-base text-foreground" data-own-title="true" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{t('training.studio.itemsLabel')}</span>
        <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows={6} className="rounded-xl border border-border bg-background px-3 py-2 text-base text-foreground" data-own-items="true" />
        <span className="text-xs text-muted-foreground tabular-nums">{t('training.studio.itemCount', { count: items.length })}</span>
      </label>
      {method === 'story' ? (
        <>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">{t('training.studio.storyLabel')}</span>
            <textarea value={story} onChange={(e) => setStory(e.target.value.slice(0, 2000))} rows={4} placeholder={t('training.studio.storyWritePlaceholder')} className="rounded-xl border border-border bg-background px-3 py-2 text-base text-foreground" data-own-story="true" />
          </label>
          {items.length >= 2 && <SuggestButton request={{ kind: 'story', items, lang: uiLang }} onIdea={(text) => setStory((s) => (s.trim() === '' ? text : `${s}\n${text}`))} />}
        </>
      ) : (
        items.length > 0 && (
          <ol className="flex flex-col gap-3">
            {items.slice(0, 20).map((it, i) => {
              const peg = pegFor(set, i + 1)
              return (
                <li key={`${i}-${it}`} className="flex items-start gap-3 rounded-2xl border border-border/60 p-3">
                  <PegPicture set={set} n={i + 1} lang={lang} size={40} showLabel={false} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-sm font-semibold break-words text-foreground">
                      {pegName(peg.base, lang)} + {it}
                    </p>
                    <input
                      value={notes[i] ?? ''}
                      maxLength={200}
                      onChange={(e) => setNotes((n) => ({ ...n, [i]: e.target.value }))}
                      placeholder={t('training.studio.pegNotePlaceholder')}
                      aria-label={t('training.studio.pegNoteLabel', { n: i + 1 })}
                      className="min-h-10 rounded-lg border border-border bg-background px-2 text-sm text-foreground"
                    />
                    <SuggestButton request={{ kind: 'peg', peg: pegName(peg.base, 'en'), n: i + 1, item: it, lang: uiLang }} onIdea={(text) => setNotes((n) => ({ ...n, [i]: text.slice(0, 200) }))} />
                  </div>
                </li>
              )
            })}
          </ol>
        )
      )}
      {error !== null && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="min-h-12 rounded-full" disabled={busy} data-own-save="true">
        {t('training.studio.saveAndTest')}
      </Button>
    </form>
  )
}

function OwnPegTest({ items, onDone }: { items: string[]; onDone: (correct: number) => void }): React.JSX.Element {
  const t = useAppT()
  const order = useMemo(
    () =>
      shuffle(
        items.map((_, i) => i),
        rng,
      ),
    [items],
  )
  const [q, setQ] = useState(0)
  const [correct, setCorrect] = useState(0)
  const i = order[q]!
  const options = useMemo(() => shuffle([i, ...shuffle(order.filter((x) => x !== i), rng).slice(0, Math.min(5, items.length - 1))], rng), [i, order, items.length])
  return (
    <div className="flex flex-col gap-4" data-own-peg-question={i + 1}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: items.length })}</p>
      <h2 className="text-xl font-bold text-foreground">{t('training.studio.pegQuestion', { n: i + 1 })}</h2>
      <div className="flex flex-col gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className="min-h-12 rounded-xl border-2 border-border/60 bg-background px-3 text-left text-base font-semibold break-words text-foreground active:border-primary"
            onClick={() => {
              const total = correct + (o === i ? 1 : 0)
              if (q + 1 < items.length) {
                setCorrect(total)
                setQ(q + 1)
              } else onDone(total)
            }}
          >
            {items[o]}
          </button>
        ))}
      </div>
    </div>
  )
}
