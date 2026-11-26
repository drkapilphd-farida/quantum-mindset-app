'use client'

import { useEffect, useMemo, useState } from 'react'
import type { RsvpPassage, V3Lang } from '../content'
import type { V3Copy } from '../copyV3'
import { RSVP_WPM } from '../score'
import { bigBtn, buzz } from './v3ui'

/** Every word gets the same time, so the speed really is 350 words per minute. */
const WORD_MS = Math.round(60_000 / RSVP_WPM)

type RsvpRoundProps = {
  c: V3Copy
  lang: V3Lang
  passage: RsvpPassage
  onDone: (answer: number) => void
}

/** 3-2-1, the passage one word at a time in the centre, then one question. */
export function RsvpRound({ c, lang, passage, onDone }: RsvpRoundProps): React.JSX.Element {
  const words = useMemo(() => passage.text[lang].split(/\s+/).filter(Boolean), [passage, lang])
  const [phase, setPhase] = useState<'ready' | 'count' | 'run' | 'question'>('ready')
  const [count, setCount] = useState(3)
  const [at, setAt] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)

  useEffect(() => {
    if (phase !== 'count') return undefined
    if (count === 0) {
      setAt(0)
      setPhase('run')
      return undefined
    }
    const id = window.setTimeout(() => setCount((n) => n - 1), 700)
    return () => window.clearTimeout(id)
  }, [phase, count])

  useEffect(() => {
    if (phase !== 'run') return undefined
    if (at >= words.length) {
      setPhase('question')
      return undefined
    }
    const id = window.setTimeout(() => setAt((i) => i + 1), WORD_MS)
    return () => window.clearTimeout(id)
  }, [phase, at, words.length])

  function handleStart(): void {
    setCount(3)
    setPhase('count')
  }

  function handleChoose(i: number): void {
    if (chosen !== null) return
    setChosen(i)
    buzz(10)
    window.setTimeout(() => onDone(i), 450)
  }

  if (phase === 'ready') {
    return (
      <section className="flex min-h-[55vh] flex-col items-center justify-center gap-6 text-center" data-v3-rsvp="ready">
        <p className="font-heading text-5xl font-bold text-primary">{RSVP_WPM}</p>
        <p className="text-xl font-bold text-foreground">{c.rsvp.ready}</p>
        <button type="button" onClick={handleStart} className={bigBtn} data-v3-rsvp-start>
          {c.continue} →
        </button>
      </section>
    )
  }

  if (phase === 'count' || phase === 'run') {
    return (
      <section className="flex min-h-[55vh] flex-col items-center justify-center gap-4" data-v3-rsvp={phase}>
        {phase === 'count' && <p className="text-base font-semibold text-muted-foreground">{c.rsvp.getReady}</p>}
        <div className="flex h-40 w-full items-center justify-center rounded-3xl border-2 border-border bg-card px-3" aria-live="off">
          <p lang={lang} className="font-heading text-[clamp(2rem,10vw,3rem)] leading-none font-bold whitespace-nowrap text-foreground">
            {phase === 'count' ? count : (words[Math.min(at, words.length - 1)] ?? '')}
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full bg-primary" style={{ width: `${phase === 'run' ? (at / words.length) * 100 : 0}%` }} />
        </div>
      </section>
    )
  }

  const q = passage.question[lang]
  return (
    <section className="flex flex-col gap-3" data-v3-rsvp="question" data-v3-passage={passage.id}>
      <p className="text-center text-sm font-semibold text-muted-foreground">{c.rsvp.question}</p>
      <p lang={lang} className="text-center text-xl font-bold text-foreground">
        {q.q}
      </p>
      <div className="flex flex-col gap-2" role="group">
        {q.options.map((o, i) => (
          <button
            key={o}
            type="button"
            lang={lang}
            disabled={chosen !== null}
            onClick={() => handleChoose(i)}
            className={`min-h-14 rounded-2xl border-2 px-4 text-left text-lg font-semibold text-foreground transition-colors ${chosen === i ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
            data-v3-rsvp-option={i}
          >
            {o}
          </button>
        ))}
      </div>
    </section>
  )
}
