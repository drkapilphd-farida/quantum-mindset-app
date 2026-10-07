'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useAppT } from '@/lib/app-i18n/client'
import type { MessageKey } from '@/lib/app-i18n/translate'
import { exerciseTitle } from '@/lib/app-i18n/curriculumText'
import { SchulteGridSpeedDrill } from '@/components/qsr/visual-activation/SchulteGridSpeedDrill'
import { BlinkRecallGlimpse, MultiWordFlashGlimpse, PeripheralFlashGlimpse, RapidVisualSpanGlimpse } from './GlimpseExperiences'

type Item = { id: string; title: string; purposeKey: MessageKey; href?: string }

// The current focus warm-ups — one menu, every entry the current version.
// Replaces the old 10-drill "Visual Activation Suite" that played eye
// stretches, staring drills and watch-only flashes back to back.
const ITEMS: readonly Item[] = [
  { id: 'calm-breathing', title: 'Calm Breathing', purposeKey: 'training.breathing.purpose', href: '/labs/sharp-brain/calm-breathing' },
  { id: 'schulte-grid-speed-drill', title: 'Peripheral Vision Activator', purposeKey: 'training.focusHub.schulte' },
  { id: 'rapid-visual-span-expander', title: 'Rapid Visual Span Expander', purposeKey: 'training.glimpse.span.purpose' },
  { id: 'peripheral-flash-expander', title: 'Peripheral Flash Expander', purposeKey: 'training.glimpse.peripheral.purpose' },
  { id: 'quantum-tachistoscope-multi-word-blast', title: 'Multi-Word Flash', purposeKey: 'training.glimpse.phrase.purpose' },
  { id: 'blink-trigger-micro-recall', title: 'Blink Recall', purposeKey: 'training.glimpse.blink.purpose' },
  { id: 'cross-lateral-tap', title: 'Cross-Lateral Tap', purposeKey: 'training.focusHub.crossLateral', href: '/labs/sharp-brain/cross-lateral-tap' },
  { id: 'fast-pattern-blinking', title: 'Fast Pattern Blinking', purposeKey: 'training.focusHub.fastPattern', href: '/labs/sharp-brain/fast-pattern-blinking' },
]

export function FocusWarmupsHub(): React.JSX.Element {
  const t = useAppT()
  const [playing, setPlaying] = useState<string | null>(null)
  const back = (): void => setPlaying(null)

  if (playing === 'schulte-grid-speed-drill') return <SchulteGridSpeedDrill onComplete={back} onExit={back} />
  if (playing === 'rapid-visual-span-expander') return <RapidVisualSpanGlimpse onComplete={back} onExit={back} />
  if (playing === 'peripheral-flash-expander') return <PeripheralFlashGlimpse onComplete={back} onExit={back} />
  if (playing === 'quantum-tachistoscope-multi-word-blast') return <MultiWordFlashGlimpse onComplete={back} onExit={back} />
  if (playing === 'blink-trigger-micro-recall') return <BlinkRecallGlimpse onComplete={back} onExit={back} />

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-10" data-focus-hub="true">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t('training.skills.focus')}</p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">{t('training.focusHub.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('training.focusHub.intro')}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {ITEMS.map((item) => {
          const body = (
            <>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{exerciseTitle(t, item)}</span>
                <span className="block text-xs text-muted-foreground">{t(item.purposeKey)}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </>
          )
          const className = 'flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-left transition-colors hover:border-primary/50'
          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className={className} data-hub-item={item.id}>
                  {body}
                </Link>
              ) : (
                <button type="button" onClick={() => setPlaying(item.id)} className={className} data-hub-item={item.id}>
                  {body}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
