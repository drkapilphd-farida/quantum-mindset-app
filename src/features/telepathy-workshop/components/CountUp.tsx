'use client'

import { useEffect, useRef, useState } from 'react'

// A number that counts up from 0 the first time it scrolls into view.
// Server render and reduced-motion visitors get the final number straight
// away; screen readers always get the final number.
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }): React.JSX.Element {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)
  const final = `${value.toLocaleString('en-IN')}${suffix}`

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    // Only animate numbers that start below the fold (no visible jump).
    if (el.getBoundingClientRect().top < window.innerHeight) return undefined

    let raf = 0
    setShown(0)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number): void => {
          const p = Math.min(1, (now - start) / 1800)
          setShown(Math.round(value * (1 - Math.pow(1 - p, 3))))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {shown.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
