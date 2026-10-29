'use client'

import { useEffect, useRef, useState } from 'react'

// A restless, jagged wave across the full width…
const JAGGED =
  'M0,60 L18,30 L34,92 L50,22 L66,98 L82,40 L98,84 L114,18 L130,102 L146,44 L162,78 L178,26 L194,96 L210,36 L226,88 L242,20 L258,100 L274,46 L290,74 L306,24 L322,94 L338,52 L354,70 L370,30 L386,90 L402,40 L418,82 L434,22 L450,98 L466,48 L482,72 L498,28 L514,92 L530,38 L546,86 L562,24 L578,96 L594,50 L610,68 L626,32 L642,88 L658,42 L674,80 L690,26 L706,94 L722,46 L738,74 L754,30 L770,90 L786,44 L800,60'
// …that settles into a calm, even rhythm.
const SMOOTH =
  'M0,60 C50,38 83,38 133,60 S216,82 266,60 S350,38 400,60 S483,82 533,60 S616,38 666,60 S750,82 800,60'

// Muse 2 section: the jagged line fades and a smooth one draws in the
// first time the wave scrolls into view (CSS in telepathy-workshop.css;
// reduced-motion visitors see the calm line without animation).
export function BrainWave({ className = '' }: { className?: string }): React.JSX.Element {
  const ref = useRef<SVGSVGElement>(null)
  const [calm, setCalm] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setCalm(true)
        io.disconnect()
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 800 120" preserveAspectRatio="none" className={`tw-wave ${calm ? 'is-calm' : ''} ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="tw-wave-calm" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6FD9D0" />
          <stop offset="0.5" stopColor="#E8C46E" />
          <stop offset="1" stopColor="#8B6CF0" />
        </linearGradient>
      </defs>
      <path d={JAGGED} className="tw-wave-jagged" fill="none" stroke="#e46f6f" strokeOpacity="0.85" strokeWidth="2.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={SMOOTH} pathLength={1} className="tw-wave-smooth" fill="none" stroke="url(#tw-wave-calm)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
