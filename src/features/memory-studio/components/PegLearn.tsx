'use client'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAppT, useUiLang } from '@/lib/app-i18n/client'
import { RHYME_PEGS, SHAPE_PEGS, type PegSet, type StudioLang } from '../content'
import { PEG_LEARN_EXERCISE_ID } from '../pegMethod'
import { shuffle } from '../storyMethod'
import { addPegCards } from '../actions'
import { saveSimpleResult } from '../saveResult'
import { PegPicture } from './PegPicture'

const rng = (n: number): number => Math.floor(Math.random() * n)
const PASS = 8

// Learn the ten pegs: see them all (with why each fits), then a quick check
// "which picture is number n?". 8 of 10 adds the pegs to the review queue.
export function PegLearn({ set, lang, onDone }: { set: PegSet; lang: StudioLang; onDone: () => void }): React.JSX.Element {
  const t = useAppT()
  const uiLang = useUiLang()
  const pegs = set === 'rhyme' ? RHYME_PEGS : SHAPE_PEGS
  const [stage, setStage] = useState<'look' | 'quiz' | 'result'>('look')
  const [q, setQ] = useState(0)
  const [correct, setCorrect] = useState(0)
  const started = useRef(0)
  const quiz = useMemo(
    () =>
      shuffle(
        pegs.map((p) => p.n),
        rng,
      ).map((n) => ({ n, options: shuffle([n, ...shuffle(pegs.map((p) => p.n).filter((x) => x !== n), rng).slice(0, 3)], rng) })),
    // A new order each time the check starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stage === 'quiz', pegs],
  )

  if (stage === 'look') {
    return (
      <div className="flex flex-col gap-4" data-peg-learn="look">
        <p className="text-sm text-muted-foreground">{set === 'rhyme' ? t('training.studio.pegsIntroRhyme') : t('training.studio.pegsIntroShape')}</p>
        <ol className="flex flex-col divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
          {pegs.map((p) => (
            <li key={p.n} className="flex items-center gap-4 px-4 py-2">
              <PegPicture set={set} n={p.n} lang={lang} size={44} showLabel={false} />
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{lang === 'hi' ? p.hi : p.en}</p>
                <p className="text-xs text-muted-foreground">{lang === 'hi' ? p.hintHi : p.hintEn}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-muted-foreground">{t('training.studio.iceNote')}</p>
        <Button
          size="lg"
          className="min-h-12 rounded-full"
          onClick={() => {
            started.current = performance.now()
            setQ(0)
            setCorrect(0)
            setStage('quiz')
          }}
          data-pegs-check="true"
        >
          {t('training.studio.pegsCheck')}
        </Button>
      </div>
    )
  }

  if (stage === 'quiz') {
    const item = quiz[q]!
    return (
      <div className="flex flex-col gap-4" data-peg-learn="quiz" data-pegs-question={item.n}>
        <p className="text-sm font-semibold text-muted-foreground tabular-nums">{t('training.studio.nOfTotal', { n: q + 1, total: quiz.length })}</p>
        <h2 className="text-xl font-bold text-foreground">{t('training.studio.pegsQuiz', { n: item.n })}</h2>
        <div className="grid grid-cols-2 gap-3">
          {item.options.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                const total = correct + (n === item.n ? 1 : 0)
                setCorrect(total)
                if (q + 1 < quiz.length) return setQ(q + 1)
                saveSimpleResult(PEG_LEARN_EXERCISE_ID, total, quiz.length, performance.now() - started.current, uiLang)
                if (total >= PASS) void addPegCards({ set, lang: uiLang })
                setStage('result')
              }}
              className="flex min-h-28 items-center justify-center rounded-xl border-2 border-border/60 bg-background active:border-primary"
              data-pegs-option={n}
            >
              <PegPicture set={set} n={n} lang={lang} size={56} showLabel={false} />
            </button>
          ))}
        </div>
      </div>
    )
  }

  const passed = correct >= PASS
  return (
    <div className="flex flex-col gap-4" data-peg-learn="result" data-pegs-score={correct}>
      <h2 className="font-heading text-3xl font-bold text-foreground tabular-nums">{t('training.studio.correctOf', { correct, total: quiz.length })}</h2>
      <p className="text-sm text-muted-foreground">{passed ? t('training.studio.pegsDone') : t('training.studio.pegsAgain')}</p>
      {passed ? (
        <Button size="lg" className="min-h-12 rounded-full" onClick={onDone} data-pegs-continue="true">
          {t('training.studio.continue')}
        </Button>
      ) : (
        <Button size="lg" className="min-h-12 rounded-full" onClick={() => setStage('look')} data-pegs-look-again="true">
          {t('training.studio.pegsLookAgain')}
        </Button>
      )}
    </div>
  )
}
