'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { countdownParts, nextBatch, pick } from '../telepathyWorkshop'

const UNITS = ['days', 'hours', 'minutes', 'seconds'] as const

// Live countdown to the next batch start (TELEPATHY_BATCHES): Mumbai, then
// Ahmedabad, then hidden. Renders only after mount (the server doesn't know
// the visitor's clock); the slot keeps its height meanwhile.
export function Countdown({ lang }: { lang: Lang }): React.JSX.Element | null {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (now === null) return <div className="min-h-[132px]" aria-hidden="true" />

  const next = nextBatch(now)
  if (next === null) return null

  const c = telepathyCopy.batches
  const parts = countdownParts(Date.parse(next.startISO) - now)
  const city = c.cities.find((x) => x.id === next.id)
  const label = `${pick(c.countdownLabel, lang)}${city === undefined ? '' : ` — ${pick(city.city, lang)}`}`

  return (
    <div className="tw-card mx-auto max-w-2xl px-4 py-5 text-center sm:px-8">
      <p className="text-[15.5px] text-ink-dim">{label}</p>
      <div role="timer" aria-label={label} className="mt-3 grid grid-cols-4 gap-2 sm:gap-4">
        {UNITS.map((unit) => (
          <div key={unit} className="rounded-sm border border-line bg-panel-2 px-1 py-2.5">
            <div className="text-[28px] font-extrabold leading-none text-ink tabular-nums sm:text-[34px]">{String(parts[unit]).padStart(2, '0')}</div>
            <div className="mt-1.5 text-[12.5px] text-ink-dim">{pick(c.countdownUnits[unit], lang)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
