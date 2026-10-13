'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import type { KeywordHelp, KeywordList, KeywordRound as Round } from '../keyword'
import { SuggestButton } from './SuggestButton'

// One Keyword round: each new word with its meaning → its keyword (a word that
// sounds like it) and one picture joining keyword and meaning — given at the
// easier levels, the learner's own later → then each word again: which meaning?
export function KeywordRound({ round, help, list, level, onDone }: { round: Round; help: KeywordHelp; list: KeywordList; level: number; onDone: (o: RoundOutcome) => void }): React.JSX.Element {
  const t = useAppT()
  const [study, setStudy] = useState(0)
  const [notes, setNotes] = useState<string[]>(() => round.cards.map(() => ''))
  const [q, setQ] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)

  if (q === null) {
    const card = round.cards[study]!
    const last = study + 1 >= round.cards.length
    return (
      <div className="flex flex-col items-center gap-4" data-keyword-study={card.id}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: study + 1, total: round.cards.length })}</p>
        <p className="font-heading text-4xl font-bold text-foreground" lang="en">
          {card.word}
        </p>
        <p className="text-center text-lg text-foreground">{card.meaning}</p>
        {help !== 'none' && (
          <div className="flex w-full flex-col gap-1 rounded-2xl bg-primary/10 p-3 text-center" data-keyword-help={help}>
            <p className="text-sm font-semibold text-foreground">{t('training.studio.keywordSoundsLike', { keyword: card.keyword })}</p>
            {help === 'full' && <p className="text-sm text-foreground">{card.picture}</p>}
          </div>
        )}
        <p className="text-center text-sm text-muted-foreground">{help === 'full' ? t('training.studio.keywordStudyHintFull') : help === 'keyword' ? t('training.studio.keywordStudyHintKeyword') : t('training.studio.keywordStudyHintOwn')}</p>
        {help !== 'full' && (
          <>
            <label className="flex w-full flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">{t('training.studio.faceWrite')}</span>
              <input value={notes[study]} onChange={(e) => setNotes(notes.map((x, i) => (i === study ? e.target.value.slice(0, 300) : x)))} className="min-h-11 rounded-xl border border-border bg-background px-3 text-base text-foreground" />
            </label>
            <div className="w-full">
              <SuggestButton key={card.id} request={{ kind: 'keyword', word: card.word, meaning: card.meaning, lang: list }} onIdea={(text) => setNotes(notes.map((x, i) => (i === study ? text.slice(0, 300) : x)))} />
            </div>
          </>
        )}
        <Button size="lg" className="min-h-12 w-full rounded-full" onClick={() => (last ? setQ(0) : setStudy(study + 1))} data-keyword-next="true">
          {last ? t('training.studio.faceReady') : t('training.studio.next')}
        </Button>
      </div>
    )
  }

  const card = round.cards[round.askOrder[q]!]!
  return (
    <div className="flex flex-col gap-4" data-keyword-question={card.id}>
      <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: round.cards.length })}</p>
      <h2 className="text-xl font-bold text-foreground">{t('training.studio.keywordQuestion', { word: card.word })}</h2>
      <div className="flex flex-col gap-2">
        {round.choices.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              const total = correct + (c.id === card.id ? 1 : 0)
              if (q + 1 < round.cards.length) {
                setCorrect(total)
                setQ(q + 1)
              } else onDone({ correct: total, total: round.cards.length, score: total * level })
            }}
            className="min-h-12 rounded-xl border-2 border-border/60 bg-background px-3 py-2 text-left text-base font-semibold break-words text-foreground active:border-primary"
            data-keyword-option={c.id}
          >
            {c.meaning}
          </button>
        ))}
      </div>
    </div>
  )
}
