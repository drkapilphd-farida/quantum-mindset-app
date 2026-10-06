'use client'

import { useEffect, useState } from 'react'
import { useAppT } from '@/lib/app-i18n/client'
import { usePrefersReducedMotion } from '@/hooks/exercises/usePrefersReducedMotion'
import type { PassageLang } from '../readingPassages'
import type { ChunkLayout } from './ChunkReadingRound'

const WORDS: Record<PassageLang, readonly string[]> = {
  en: ['Bees', 'dance', 'to', 'show', 'the', 'way'],
  hi: ['मधुमक्खियाँ', 'नाचकर', 'रास्ता', 'बताती', 'हैं'],
}

/** The little looping picture inside the chunk exercises' "how to play". */
export function ChunkDemo({ layout, lang, step = 'read' }: { layout: ChunkLayout; lang: PassageLang; step?: 'read' | 'question' | 'score' }): React.JSX.Element {
  const t = useAppT()
  const reducedMotion = usePrefersReducedMotion()
  const words = WORDS[lang]
  const [i, setI] = useState(0)
  useEffect(() => {
    if (step !== 'read' || reducedMotion) return undefined
    const id = setInterval(() => setI((x) => (x + 1) % words.length), 700)
    return () => clearInterval(id)
  }, [step, reducedMotion, words.length])

  if (step === 'question') {
    return (
      <div className="flex w-56 flex-col gap-1.5 text-xs">
        <p className="text-center font-semibold text-foreground">{t('training.chunks.demoQuestion')}</p>
        {[t('training.chunks.demoOptionA'), t('training.chunks.demoOptionB')].map((o, k) => (
          <span key={o} className={`rounded-xl border-2 px-2 py-1 ${k === 0 ? 'border-emerald-500 bg-emerald-500/10' : 'border-border'}`}>
            {o}
          </span>
        ))}
      </div>
    )
  }
  if (step === 'score') {
    return (
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-heading text-3xl font-bold text-foreground">150 × 100%</p>
        <p className="text-xs text-muted-foreground">{t('training.chunks.demoScore')}</p>
      </div>
    )
  }
  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row flex-wrap justify-center'} items-center gap-1.5`} lang={lang}>
      {words.map((w, k) => (
        <span
          key={w}
          className={`rounded-xl px-2 py-0.5 font-semibold transition-all duration-300 ${k === i ? 'bg-primary/10 text-xl text-foreground ring-2 ring-primary/30' : 'text-sm text-muted-foreground/60'}`}
        >
          {w}
        </span>
      ))}
    </div>
  )
}
