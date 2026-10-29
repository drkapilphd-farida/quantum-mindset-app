'use client'

import { useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'
import { telepathyCopy } from '../telepathyWorkshopCopy'
import { countdownParts, nextWorkshop, pick } from '../telepathyWorkshop'

const UNITS = ['days', 'hours', 'minutes', 'seconds'] as const

// Live countdown to the next workshop start (telepathyWorkshopConfig.ts):
// Mumbai, then Ahmedabad, then hidden. Renders only after mount (the
// server doesn't know the visitor's clock); the slot keeps its height.
export function Countdown({ lang }: { lang: Lang }): React.JSX.Element | null {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  if (now === null) return <div className="min-h-[148px] sm:min-h-[132px]" aria-hidden="true" />

  const next = nextWorkshop(now)
  if (next === null) return null

  const parts = countdownParts(Date.parse(next.startISO) - now)
  const city = telepathyCopy.dates.cities.find((c) => c.id === next.city)
  const label = pick(telepathyCopy.dates.countdownLabel, lang)

  return (
    <div className="tw-glass mx-auto max-w-2xl rounded-2xl px-4 py-5 text-center sm:px-8">
      <p className="text-[15px] text-ink-dim sm:text-base">
        {label}
        {city !== undefined && (
          <>
            {' — '}
            <span className="font-semibold text-gold">{pick(city.city, lang)}</span>
          </>
        )}
      </p>
      <div role="timer" aria-label={`${label} ${pick(city?.city ?? { en: '', hi: '' }, lang)}`} className="mt-3 grid grid-cols-4 gap-2 sm:gap-4">
        {UNITS.map((unit) => (
          <div key={unit} className="rounded-xl border border-line bg-void/50 px-1 py-2.5">
            <div className="tw-display text-[30px] leading-none text-ink [font-variant-numeric:lining-nums_tabular-nums] sm:text-[40px]" style={{ lineHeight: 1.05 }}>
              {String(parts[unit]).padStart(2, '0')}
            </div>
            <div className="mt-1.5 text-[12px] uppercase tracking-[0.08em] text-ink-faint sm:text-[13px]">{pick(telepathyCopy.dates.countdownUnits[unit], lang)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
