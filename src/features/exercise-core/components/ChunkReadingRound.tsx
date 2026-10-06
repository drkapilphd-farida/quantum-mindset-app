'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppT } from '@/lib/app-i18n/client'
import { usePrefersReducedMotion } from '@/hooks/exercises/usePrefersReducedMotion'
import { chunkDurationMs, chunkLevel, chunkText, effectiveWpm, type ChunkLevel } from '../chunkReading'
import { pickPassage, wordCount, type PassageLang, type PassageQuestion, type ReadingPassage } from '../readingPassages'
import type { RoundOutcome } from './AdaptiveExerciseShell'

export type ChunkLayout = 'horizontal' | 'vertical'

const RECENT_KEY = (lang: PassageLang): string => `mum-recent-passages-${lang}`
const RECENT_MAX = 12

function readRecent(lang: PassageLang): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENT_KEY(lang)) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function rememberPassage(lang: PassageLang, id: string): void {
  try {
    const next = [id, ...readRecent(lang).filter((x) => x !== id)].slice(0, RECENT_MAX)
    localStorage.setItem(RECENT_KEY(lang), JSON.stringify(next))
  } catch {
    // Not remembered — a passage may repeat sooner; harmless.
  }
}

type Stage = 'ready' | 'reading' | 'questions'

type Props = {
  layout: ChunkLayout
  levels: Readonly<Record<number, ChunkLevel>>
  level: number
  isPractice: boolean
  lang: PassageLang
  /** Dynamic Chunk Sliding adds "pick the best one-line summary" after the questions. */
  withSummary: boolean
  onDone: (o: RoundOutcome) => void
}

type Item = { kind: 'question'; question: PassageQuestion } | { kind: 'summary'; question: PassageQuestion }

export function ChunkReadingRound({ layout, levels, level, isPractice, lang, withSummary, onDone }: Props): React.JSX.Element {
  const t = useAppT()
  const config = chunkLevel(levels, level)
  const [passage] = useState<ReadingPassage>(() => pickPassage(lang, isPractice ? 1 : level, typeof window === 'undefined' ? [] : readRecent(lang)))
  const chunks = useMemo(() => chunkText(passage.text, config.chunkWords, lang), [passage, config.chunkWords, lang])
  const items = useMemo<Item[]>(() => {
    const qs = passage.questions.slice(0, isPractice ? 1 : config.questions).map((question) => ({ kind: 'question' as const, question }))
    if (!withSummary || isPractice) return qs
    return [...qs, { kind: 'summary' as const, question: { q: t('training.chunks.summaryQ'), options: passage.summary.options, answer: passage.summary.answer } }]
  }, [passage, config.questions, isPractice, withSummary, t])

  const [stage, setStage] = useState<Stage>('ready')
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [itemIndex, setItemIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  useEffect(() => {
    if (stage !== 'reading' || paused) return undefined
    const chunk = chunks[index]
    if (chunk === undefined) return undefined
    const id = setTimeout(() => {
      if (index + 1 >= chunks.length) {
        rememberPassage(lang, passage.id)
        setStage('questions')
      } else setIndex(index + 1)
    }, chunkDurationMs(chunk, config.wpm))
    return () => clearTimeout(id)
  }, [stage, paused, index, chunks, config.wpm, lang, passage.id])

  const item = items[itemIndex]
  const chosen = answers[itemIndex]

  function choose(option: number): void {
    if (chosen !== undefined) return
    setAnswers((prev) => (prev.length === itemIndex ? [...prev, option] : prev))
  }

  function nextItem(): void {
    if (itemIndex + 1 < items.length) {
      setItemIndex(itemIndex + 1)
      return
    }
    const correct = items.filter((it, i) => answers[i] === it.question.answer).length
    onDone({
      correct,
      total: items.length,
      score: effectiveWpm(config.wpm, correct, items.length),
      metrics: { wpm: config.wpm, comprehension: Math.round((correct / items.length) * 100), words: wordCount(passage.text) },
    })
  }

  if (stage === 'ready') {
    return (
      <div className="flex w-full flex-col items-center gap-3 py-4 text-center" data-chunk-stage="ready">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{t('training.chunks.upNext')}</p>
        <h2 className="font-heading text-2xl font-bold text-foreground">{passage.title}</h2>
        <p className="text-sm text-muted-foreground">
          {t('training.chunks.readyMeta', { words: wordCount(passage.text), chunk: config.chunkWords, wpm: config.wpm })}
        </p>
        <p className="text-sm text-muted-foreground">{t('training.chunks.readyHint')}</p>
        <Button size="lg" className="mt-2 w-full rounded-full" onClick={() => setStage('reading')} data-start-reading="true">
          {t('training.chunks.startReading')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    )
  }

  if (stage === 'reading') {
    return (
      <div className="flex w-full flex-col items-center gap-4" data-chunk-stage="reading" data-chunk-index={index}>
        <div className="w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
            <div className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / chunks.length) * 100}%` }} />
          </div>
          <p className="mt-1 text-right text-[10px] tabular-nums text-muted-foreground">
            {passage.title} · {config.wpm} {t('training.chunks.wpm')}
          </p>
        </div>
        <ChunkStage layout={layout} chunks={chunks} index={index} lang={lang} />
        <Button variant="outline" className="rounded-full" onClick={() => setPaused(!paused)} data-pause="true">
          {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
          {paused ? t('training.chunks.resume') : t('training.chunks.pause')}
        </Button>
      </div>
    )
  }

  if (item === undefined) return <div />
  const answered = chosen !== undefined
  return (
    <div className="flex w-full flex-col gap-3" data-chunk-stage="questions" data-item={itemIndex}>
      <p className="text-center text-xs text-muted-foreground">
        {item.kind === 'summary' ? t('training.chunks.summaryLabel') : t('training.chunks.recallOf', { n: itemIndex + 1, total: items.filter((i) => i.kind === 'question').length })}
      </p>
      <p className="text-center text-base font-semibold text-foreground" lang={lang}>
        {item.question.q}
      </p>
      <div className="flex flex-col gap-2" role="group">
        {item.question.options.map((option, i) => {
          const state = !answered ? '' : i === item.question.answer ? 'border-emerald-500 bg-emerald-500/10' : i === chosen ? 'border-amber-500 bg-amber-500/10' : 'opacity-50'
          return (
            <button
              key={option}
              type="button"
              lang={lang}
              disabled={answered}
              onClick={() => choose(i)}
              className={`rounded-2xl border-2 border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-all active:scale-[0.98] ${state}`}
              data-option={i}
              data-correct={i === item.question.answer ? 'true' : undefined}
            >
              {option}
            </button>
          )
        })}
      </div>
      {answered && (
        <>
          <p className={`text-center text-sm font-semibold ${chosen === item.question.answer ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-300'}`} aria-live="polite">
            {chosen === item.question.answer ? t('training.shell.correct') : t('training.shell.notQuite')}
          </p>
          <Button size="lg" className="w-full rounded-full" onClick={nextItem} data-next-question="true">
            {t('training.shell.next')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </>
      )}
    </div>
  )
}

/** The moving strip of chunks: the current chunk is centred and highlighted. */
function ChunkStage({ layout, chunks, index, lang }: { layout: ChunkLayout; chunks: readonly string[]; index: number; lang: PassageLang }): React.JSX.Element {
  const reducedMotion = usePrefersReducedMotion()
  const frameRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [offset, setOffset] = useState(0)

  useLayoutEffect(() => {
    const frame = frameRef.current
    const el = itemRefs.current[index]
    if (!frame || !el) return
    if (layout === 'horizontal') setOffset(frame.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2))
    else setOffset(frame.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2))
  }, [index, layout, chunks])

  const transition = reducedMotion ? 'none' : 'transform 260ms ease-out'
  if (layout === 'horizontal') {
    return (
      <div
        ref={frameRef}
        className="relative h-28 w-full overflow-hidden rounded-3xl border border-border/60 bg-card [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]"
        aria-live="off"
      >
        <div className="absolute top-0 left-0 flex h-full items-center gap-5 whitespace-nowrap" style={{ transform: `translateX(${offset}px)`, transition }}>
          {chunks.map((chunk, i) => (
            <span
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              lang={lang}
              className={`rounded-2xl px-3 py-1.5 font-semibold transition-colors duration-200 ${i === index ? 'bg-primary/10 text-[clamp(1.2rem,6vw,1.875rem)] text-foreground ring-2 ring-primary/30' : 'text-lg text-muted-foreground/60'}`}
              data-current={i === index ? 'true' : undefined}
            >
              {chunk}
            </span>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div
      ref={frameRef}
      className="relative h-72 w-full overflow-hidden rounded-3xl border border-border/60 bg-card [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
      aria-live="off"
    >
      <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-3" style={{ transform: `translateY(${offset}px)`, transition }}>
        {chunks.map((chunk, i) => (
          <span
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            lang={lang}
            className={`rounded-2xl px-4 py-1 text-center font-semibold transition-colors duration-200 ${i === index ? 'bg-primary/10 text-3xl text-foreground ring-2 ring-primary/30' : 'text-xl text-muted-foreground/50'}`}
            data-current={i === index ? 'true' : undefined}
          >
            {chunk}
          </span>
        ))}
      </div>
    </div>
  )
}
