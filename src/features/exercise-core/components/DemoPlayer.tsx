'use client'

import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/exercises/usePrefersReducedMotion'

export type DemoStep = { caption: string; visual: React.ReactNode }

const STEP_MS = 5_000

// The 15-second "how to play": three short captioned steps that play on a
// loop (5 s each). Learners can tap a dot to jump to a step. With reduced
// motion the steps still change, but nothing inside them animates.
export function DemoPlayer({ steps }: { steps: readonly DemoStep[] }): React.JSX.Element {
  const [index, setIndex] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % steps.length), STEP_MS)
    return () => clearInterval(id)
  }, [steps.length, index])

  const step = steps[index] ?? steps[0]
  if (step === undefined) return <div />

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card/70 p-3" data-demo-step={index} data-reduced-motion={reducedMotion ? 'true' : undefined}>
      <div key={index} className="flex h-40 items-center justify-center overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
        {step.visual}
      </div>
      <p className="mt-2 min-h-10 text-center text-sm font-medium text-foreground" aria-live="polite">
        <span className="mr-1 text-primary">{index + 1}.</span>
        {step.caption}
      </p>
      <div className="mt-2 flex justify-center gap-2">
        {steps.map((s, i) => (
          <button
            key={s.caption}
            type="button"
            aria-label={`${i + 1}`}
            aria-current={i === index ? 'step' : undefined}
            onClick={() => setIndex(i)}
            className="flex size-6 items-center justify-center"
          >
            <span className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-primary' : 'w-1.5 bg-border'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
