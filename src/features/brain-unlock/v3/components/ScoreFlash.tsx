'use client'

import { useRef } from 'react'
import { bigBtn } from './v3ui'

type ScoreFlashProps = {
  /** The big line, e.g. "Focus: 38.4 sec ⚡". */
  line: string
  sub?: string | null
  onNext: () => void
  continueLabel: string
}

/** A score screen between rounds: it stays until the person taps Continue (founder, 26 Nov 2026: no auto-advance). */
export function ScoreFlash({ line, sub = null, onNext, continueLabel }: ScoreFlashProps): React.JSX.Element {
  const done = useRef(false)

  function handleTap(): void {
    if (done.current) return
    done.current = true
    onNext()
  }

  return (
    <section className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center" data-v3-flash>
      <p className="v3-in font-heading text-4xl leading-tight font-bold text-foreground">{line}</p>
      {sub !== null && <p className="text-base text-muted-foreground">{sub}</p>}
      <button type="button" onClick={handleTap} className={`mt-6 ${bigBtn}`} data-v3-flash-next>
        {continueLabel} →
      </button>
    </section>
  )
}
