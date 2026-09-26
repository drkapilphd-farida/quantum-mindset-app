'use client'

import { useEffect, useState } from 'react'

type ExecutiveWorkshopCountdownProps = {
  deadlineIso: string
}

function getRemaining(deadlineIso: string): { days: number; hours: number; minutes: number } | null {
  // Explicit +05:30 — the deadline is always 11:59 PM IST regardless of
  // the visitor's own timezone, not their browser's local midnight.
  const diffMs = new Date(`${deadlineIso}T23:59:59+05:30`).getTime() - Date.now()
  if (diffMs <= 0) return null
  return {
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diffMs / (1000 * 60)) % 60),
  }
}

// Only ever rendered when executiveBrainWorkshopConfig.earlyBirdDeadlineISO
// is a real, non-empty date (see ExecutiveWorkshopPricing.tsx) — never a
// fake or auto-decreasing number, just a real countdown to a real
// config-supplied date. Ticks once a minute; renders nothing once the
// deadline has actually passed rather than showing a stale/negative
// countdown.
export function ExecutiveWorkshopCountdown({ deadlineIso }: ExecutiveWorkshopCountdownProps): React.JSX.Element | null {
  const [remaining, setRemaining] = useState(() => getRemaining(deadlineIso))

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(deadlineIso)), 60_000)
    return () => clearInterval(interval)
  }, [deadlineIso])

  if (remaining === null) return null

  return (
    <p className="text-[13px] font-semibold text-teal">
      Early Bird ends in {remaining.days}d {remaining.hours}h {remaining.minutes}m
    </p>
  )
}
