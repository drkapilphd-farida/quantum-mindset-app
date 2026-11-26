'use client'

import { useEffect, useRef, useState } from 'react'
import type { GridRun } from '../progressV3'
import { formatSeconds } from '../score'
import { buzz } from './v3ui'

const SIZE = 25

type FocusGridV3Props = {
  order: readonly number[]
  instruction: string
  nextLabel: string
  greeting: string | null
  onDone: (run: GridRun) => void
}

/**
 * Tap 1 → 25 in order. The clock starts on the first correct tap. A wrong tap
 * shakes the tile and adds 1 second ("+1s"). The running time is shown with
 * the penalty included, the same number that is saved.
 */
export function FocusGridV3({ order, instruction, nextLabel, greeting, onDone }: FocusGridV3Props): React.JSX.Element {
  const [next, setNext] = useState(1)
  const [errors, setErrors] = useState(0)
  const [shake, setShake] = useState<number | null>(null)
  const [popped, setPopped] = useState<number | null>(null)
  const [penaltyKey, setPenaltyKey] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const startedAt = useRef<number | null>(null)
  const finished = useRef(false)

  // The visible clock ticks while the grid is being played.
  useEffect(() => {
    if (next === 1 || finished.current) return undefined
    const id = window.setInterval(() => {
      if (startedAt.current !== null) setElapsed(performance.now() - startedAt.current)
    }, 100)
    return () => window.clearInterval(id)
  }, [next])

  function handleTap(n: number): void {
    if (finished.current) return
    if (n === next) {
      if (n === 1) startedAt.current = performance.now()
      setPopped(n)
      buzz(8)
      if (n === SIZE) {
        finished.current = true
        const ms = Math.round(performance.now() - (startedAt.current ?? performance.now()))
        onDone({ ms, errors })
      }
      setNext(n + 1)
      return
    }
    if (n > next) {
      // Before the first correct tap the clock has not started: no penalty yet.
      if (startedAt.current !== null) {
        setErrors((e) => e + 1)
        setPenaltyKey((k) => k + 1)
      }
      setShake(n)
      buzz([20, 40, 20])
      window.setTimeout(() => setShake(null), 300)
    }
  }

  const seconds = elapsed / 1000 + errors
  return (
    <section className="flex flex-col gap-3" data-v3-grid data-next={next} data-errors={errors}>
      {greeting !== null && <p className="text-center text-base font-semibold text-foreground">{greeting}</p>}
      <p className="text-center text-xl font-bold text-foreground">{instruction}</p>
      <div className="relative flex items-center justify-center gap-4 text-base tabular-nums">
        <span className="rounded-full bg-muted px-3 py-1 font-semibold text-muted-foreground" aria-live="polite">
          {next <= SIZE ? nextLabel.replace('{n}', String(next)) : '✓'}
        </span>
        <span className="font-heading text-2xl font-bold text-foreground" data-v3-clock>
          {formatSeconds(seconds)}s
        </span>
        {penaltyKey > 0 && (
          <span key={penaltyKey} className="v3-float absolute right-4 font-bold text-red-600" aria-hidden="true">
            +1s
          </span>
        )}
      </div>
      <div className="mx-auto grid w-full max-w-sm grid-cols-5 gap-1.5">
        {order.map((n) => {
          const done = n < next
          return (
            <button
              key={n}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault()
                handleTap(n)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleTap(n)
              }}
              aria-label={String(n)}
              className={`aspect-square min-h-12 touch-manipulation rounded-xl border-2 font-heading text-xl font-bold select-none sm:text-2xl ${
                done ? 'border-primary/20 bg-primary/10 text-primary/40' : 'border-border bg-card text-foreground active:scale-95'
              } ${shake === n ? 'v3-shake border-red-500' : ''} ${popped === n ? 'v3-pop' : ''}`}
              data-v3-cell={n}
              data-done={done ? 'true' : undefined}
            >
              {n}
            </button>
          )
        })}
      </div>
    </section>
  )
}
