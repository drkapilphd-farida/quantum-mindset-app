'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import type { MessageKey } from '@/lib/app-i18n/translate'
import type { PassageLang } from '../readingPassages'
import { buildGlimpseTrial, glimpsePoints, PRACTICE_TRIALS, TRIALS_PER_ROUND, type GlimpseMode, type GlimpseSymbol, type GlimpseTrial } from '../glimpseTraining'
import type { RoundOutcome } from './AdaptiveExerciseShell'

type Stage = 'focus' | 'flash' | 'mask' | 'question' | 'review'

const FOCUS_MS = 900
const MASK_MS = 300

function SymbolGlyph({ symbol, size = 'text-4xl' }: { symbol: GlimpseSymbol; size?: string }): React.JSX.Element {
  return (
    <span className={`${size} leading-none`} style={{ color: symbol.color }} aria-hidden="true">
      {symbol.char}
    </span>
  )
}

export function GlimpseRound({
  mode,
  level,
  isPractice,
  lang,
  onDone,
}: {
  mode: GlimpseMode
  level: number
  isPractice: boolean
  lang: PassageLang
  onDone: (o: RoundOutcome) => void
}): React.JSX.Element {
  const t = useAppT()
  const count = isPractice ? PRACTICE_TRIALS : TRIALS_PER_ROUND
  const trials = useMemo(() => Array.from({ length: count }, () => buildGlimpseTrial(mode, level, lang)), [count, mode, level, lang])
  const [index, setIndex] = useState(0)
  const [stage, setStage] = useState<Stage>('focus')
  const [answers, setAnswers] = useState<number[]>([])
  const trial: GlimpseTrial | undefined = trials[index]

  useEffect(() => {
    if (trial === undefined) return undefined
    const timers: ReturnType<typeof setTimeout>[] = []
    if (stage === 'focus') timers.push(setTimeout(() => setStage('flash'), FOCUS_MS))
    if (stage === 'flash') timers.push(setTimeout(() => setStage('mask'), trial.flashMs))
    if (stage === 'mask') timers.push(setTimeout(() => setStage('question'), MASK_MS))
    return () => timers.forEach(clearTimeout)
  }, [stage, trial])

  if (trial === undefined) return <div />

  function choose(i: number): void {
    if (stage !== 'question') return
    setAnswers((prev) => [...prev, i])
    setStage('review')
  }

  function next(): void {
    if (index + 1 < trials.length) {
      setIndex(index + 1)
      setStage('focus')
      return
    }
    const correct = trials.filter((tr, i) => answers[i] === tr.correctIndex).length
    onDone({ correct, total: trials.length, score: trials.reduce((s, tr, i) => s + glimpsePoints(level, answers[i] === tr.correctIndex), 0) })
  }

  const chosen = answers[index]
  const isWords = mode === 'phrase' || mode === 'blink'
  const question =
    trial.question === 'whichOnSide' && trial.side !== undefined
      ? t('training.glimpse.whichOnSide', { side: t(`training.glimpse.sides.${trial.side}` as MessageKey) })
      : t(`training.glimpse.${trial.question}` as MessageKey)

  return (
    <div className="flex w-full flex-col items-center gap-3" data-glimpse-trial={index} data-stage={stage} data-mode={mode}>
      <p className="text-xs text-muted-foreground">{t('training.glimpse.glimpseOf', { n: index + 1, total: trials.length })}</p>
      <div className="relative aspect-square w-full max-w-[18rem] overflow-hidden rounded-3xl border border-border/60 bg-card" aria-live="off">
        {(stage === 'focus' || stage === 'flash' || stage === 'mask') && (
          <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" aria-hidden="true" />
        )}
        {stage === 'focus' && <p className="absolute inset-x-0 bottom-4 text-center text-xs text-muted-foreground">{t('training.glimpse.lookAtDot')}</p>}
        {(stage === 'flash' || stage === 'review') &&
          trial.shown.map((p) => (
            <span
              key={`${p.label}-${p.x}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${stage === 'review' ? 'opacity-60' : ''}`}
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              lang={isWords ? lang : undefined}
            >
              {p.symbol ? (
                <SymbolGlyph symbol={p.symbol} size={mode === 'peripheral' ? 'text-3xl' : 'text-4xl'} />
              ) : (
                <span className={`block bg-card px-2 text-center font-semibold whitespace-nowrap text-foreground ${mode === 'blink' ? 'text-3xl' : 'text-xl'}`}>{p.label}</span>
              )}
            </span>
          ))}
        {stage === 'mask' && <p className="absolute inset-0 flex items-center justify-center text-2xl tracking-[0.4em] text-muted-foreground/40">· · ·</p>}
        {stage === 'question' && <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">{t('training.glimpse.whatDidYouSee')}</p>}
      </div>
      {(stage === 'question' || stage === 'review') && (
        <>
          <p className="text-center text-sm font-semibold text-foreground">{question}</p>
          <div className={`grid w-full gap-2 ${isWords ? 'grid-cols-1' : 'grid-cols-4'}`} role="group">
            {trial.options.map((option, i) => {
              const symbol = trial.optionSymbols?.[i]
              const state =
                stage !== 'review' ? 'border-border hover:border-primary/60' : i === trial.correctIndex ? 'border-emerald-500 bg-emerald-500/10' : i === chosen ? 'border-amber-500 bg-amber-500/10' : 'border-border opacity-50'
              return (
                <button
                  key={option}
                  type="button"
                  disabled={stage === 'review'}
                  onClick={() => choose(i)}
                  lang={isWords ? lang : undefined}
                  aria-label={symbol ? t(`training.glimpse.symbols.${symbol.id}` as MessageKey) : option}
                  className={`flex items-center justify-center rounded-2xl border-2 bg-card px-3 py-3 font-medium text-foreground transition-all active:scale-95 ${state}`}
                  data-option={i}
                  data-correct={i === trial.correctIndex ? 'true' : undefined}
                >
                  {symbol ? <SymbolGlyph symbol={symbol} size="text-3xl" /> : option}
                </button>
              )
            })}
          </div>
        </>
      )}
      {stage === 'review' && (
        <div className="flex w-full flex-col items-center gap-2">
          <p className={`text-sm font-semibold ${chosen === trial.correctIndex ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-300'}`} aria-live="polite">
            {chosen === trial.correctIndex ? t('training.shell.correct') : t('training.shell.notQuite')}
          </p>
          <Button size="lg" className="w-full rounded-full" onClick={next} data-next-trial="true">
            {t('training.shell.next')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}
