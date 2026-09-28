'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ATTENTION_RESPONSE_WINDOW_MS, ATTENTION_STIMULUS_MS, type AttentionTrial } from '../assessmentScoring'

// Go / no-go attention task (Phase 8, Item 11). Blue circle = tap as fast
// as possible; orange cross = hold back. Shapes differ as well as colours,
// so the task works for colour-blind learners. Responses (tap or Space)
// count until ATTENTION_RESPONSE_WINDOW_MS after the shape appears.

type AttentionTaskProps = {
  sequence: readonly { go: boolean; gapMs: number }[]
  /** Practice shows a ✓ / ✗ after each shape; the real task shows nothing. */
  practice: boolean
  tapLabel: string
  onComplete: (trials: AttentionTrial[]) => void
}

type Phase = 'gap' | 'stimulus' | 'wait' | 'feedback'

export function AttentionTask({ sequence, practice, tapLabel, onComplete }: AttentionTaskProps): React.JSX.Element {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('gap')
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const onsetRef = useRef<number | null>(null)
  const responseRef = useRef<number | null>(null)
  const trialsRef = useRef<AttentionTrial[]>([])
  const completedRef = useRef(false)

  const current = sequence[index]

  useEffect(() => {
    if (current === undefined) {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete(trialsRef.current)
      }
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    onsetRef.current = null
    responseRef.current = null
    setPhase('gap')
    timers.push(
      setTimeout(() => {
        onsetRef.current = performance.now()
        setPhase('stimulus')
      }, current.gapMs),
    )
    timers.push(setTimeout(() => setPhase('wait'), current.gapMs + ATTENTION_STIMULUS_MS))
    timers.push(
      setTimeout(() => {
        const rt = responseRef.current
        const trial: AttentionTrial = { go: current.go, responded: rt !== null, rtMs: rt === null ? null : Math.min(Math.round(rt), ATTENTION_RESPONSE_WINDOW_MS) }
        trialsRef.current.push(trial)
        if (practice) {
          setFeedback(trial.go === trial.responded)
          setPhase('feedback')
          timers.push(setTimeout(() => setIndex((i) => i + 1), 500))
        } else {
          setIndex((i) => i + 1)
        }
      }, current.gapMs + ATTENTION_RESPONSE_WINDOW_MS),
    )
    return () => timers.forEach(clearTimeout)
  }, [index, current, practice, onComplete])

  const respond = useCallback((): void => {
    const onset = onsetRef.current
    if (onset === null || responseRef.current !== null) return
    const rt = performance.now() - onset
    if (rt <= ATTENTION_RESPONSE_WINDOW_MS) responseRef.current = rt
  }, [])

  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      if (event.code === 'Space') {
        event.preventDefault()
        respond()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [respond])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex h-48 w-48 items-center justify-center rounded-3xl border border-border bg-background" aria-live="off">
        {phase === 'stimulus' && current !== undefined &&
          (current.go ? (
            <span className="block h-28 w-28 rounded-full bg-[#1f6feb]" role="img" aria-label="blue circle" />
          ) : (
            <span className="text-[120px] font-black leading-none text-[#e07b00]" role="img" aria-label="orange cross">
              ✕
            </span>
          ))}
        {phase === 'gap' && <span className="text-3xl text-muted-foreground">+</span>}
        {phase === 'feedback' && <span className="text-4xl">{feedback === true ? '✓' : '✗'}</span>}
      </div>
      <button
        type="button"
        onPointerDown={respond}
        className="h-20 w-full max-w-xs select-none rounded-3xl bg-primary text-lg font-semibold text-primary-foreground active:scale-[0.98]"
      >
        {tapLabel}
      </button>
      <p className="text-xs text-muted-foreground tabular-nums">
        {Math.min(index + 1, sequence.length)} / {sequence.length}
      </p>
    </div>
  )
}
