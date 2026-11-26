'use client'

import type { V3Copy } from '../copyV3'
import { bigBtn } from './v3ui'

type BreathIntroProps = {
  c: V3Copy
  onStart: () => void
}

/** One screen before the 3 breaths: what is about to happen, and a big Start button. */
export function BreathIntro({ c, onStart }: BreathIntroProps): React.JSX.Element {
  return (
    <section className="flex min-h-[55vh] flex-col items-center justify-center gap-8 text-center" data-v3-breath-intro>
      <p className="v3-in text-2xl leading-snug font-bold text-foreground">{c.breathIntro.line}</p>
      <button type="button" onClick={onStart} className={bigBtn} data-v3-breath-start>
        {c.breathIntro.start}
      </button>
    </section>
  )
}
