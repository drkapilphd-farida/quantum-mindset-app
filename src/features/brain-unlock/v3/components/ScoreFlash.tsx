'use client'

import { useEffect, useRef } from 'react'

type ScoreFlashProps = {
  /** The big line, e.g. "Focus: 38.4 sec ⚡". */
  line: string
  sub?: string | null
  /** How long it stays before moving on by itself. */
  ms?: number
  onNext: () => void
  continueLabel: string
}

/** A short score screen between rounds: moves on by itself after `ms`, or on a tap. */
export function ScoreFlash({ line, sub = null, ms = 2000, onNext, continueLabel }: ScoreFlashProps): React.JSX.Element {
  const done = useRef(false)
  const next = useRef(onNext)
  useEffect(() => {
    next.current = onNext
  }, [onNext])

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (done.current) return
      done.current = true
      next.current()
    }, ms)
    return () => window.clearTimeout(id)
  }, [ms])

  function handleTap(): void {
    if (done.current) return
    done.current = true
    onNext()
  }

  return (
    <section className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center" data-v3-flash>
      <p className="v3-in font-heading text-4xl leading-tight font-bold text-foreground">{line}</p>
      {sub !== null && <p className="text-base text-muted-foreground">{sub}</p>}
      <button type="button" onClick={handleTap} className="mt-4 min-h-12 rounded-full px-6 text-base font-semibold text-primary" data-v3-flash-next>
        {continueLabel} →
      </button>
    </section>
  )
}
