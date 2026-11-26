'use client'

import { useEffect, useRef, useState } from 'react'
import type { V3Copy } from '../copyV3'
import { fill } from '../copyV3'

const HALF_MS = 4000
const BREATHS = 3

type BreathStepProps = {
  c: V3Copy
  onDone: (skipped: boolean) => void
}

/** Three slow breaths: the circle grows for 4 s (in) and shrinks for 4 s (out). */
export function BreathStep({ c, onDone }: BreathStepProps): React.JSX.Element {
  // 0,1 = breath 1 in/out · 2,3 = breath 2 · 4,5 = breath 3 · 6 = done
  const [half, setHalf] = useState(0)
  // The circle starts small and grows on the first frame, so breath 1 is a real 4 s inhale.
  const [grown, setGrown] = useState(false)
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setGrown(true))
    return () => window.cancelAnimationFrame(id)
  }, [])
  const ended = useRef(false)
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  }, [onDone])

  useEffect(() => {
    if (half >= BREATHS * 2) {
      if (!ended.current) {
        ended.current = true
        done.current(false)
      }
      return undefined
    }
    const id = window.setTimeout(() => setHalf((h) => h + 1), HALF_MS)
    return () => window.clearTimeout(id)
  }, [half])

  function handleSkip(): void {
    if (ended.current) return
    ended.current = true
    onDone(true)
  }

  const inhale = half % 2 === 0
  const breath = Math.min(BREATHS, Math.floor(half / 2) + 1)
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center" data-v3-breath={half}>
      <div className="relative flex size-64 items-center justify-center">
        <div
          className="absolute rounded-full bg-primary/20 transition-transform ease-in-out motion-reduce:transition-none"
          style={{ width: 256, height: 256, transform: `scale(${grown && inhale ? 1 : 0.45})`, transitionDuration: `${HALF_MS}ms` }}
          aria-hidden="true"
        />
        <div className="absolute size-24 rounded-full bg-primary/40" aria-hidden="true" />
        <p className="relative font-heading text-2xl font-bold text-foreground" aria-live="polite">
          {inhale ? c.breath.in : c.breath.out}
        </p>
      </div>
      <p className="text-lg font-semibold text-muted-foreground tabular-nums">{fill(c.breath.count, { n: breath })}</p>
      <button type="button" onClick={handleSkip} className="text-sm text-muted-foreground/70 underline-offset-4 hover:underline" data-v3-breath-skip>
        {c.breath.skip}
      </button>
    </section>
  )
}
