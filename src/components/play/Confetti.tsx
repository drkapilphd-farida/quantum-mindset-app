'use client'

import { useMemo } from 'react'

// A one-time burst of confetti that falls and settles (about 2 s). Gentle:
// no flashing. With reduce-motion on, nothing is drawn.
const COLOURS = ['#7c3aed', '#4f46e5', '#ea580c', '#0d9488', '#f59e0b', '#ec4899']

export function Confetti({ pieces = 60 }: { pieces?: number }): React.JSX.Element {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        left: (i * 37) % 100,
        delay: (i % 12) * 0.06,
        duration: 1.6 + ((i * 13) % 9) / 10,
        rotate: (i * 47) % 360,
        colour: COLOURS[i % COLOURS.length]!,
        w: 6 + (i % 3) * 2,
      })),
    [pieces],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden motion-reduce:hidden" aria-hidden="true" data-confetti="true">
      {items.map((p, i) => (
        <i
          key={i}
          className="play-confetti absolute top-0 block rounded-[2px]"
          style={{ left: `${p.left}%`, width: p.w, height: p.w * 2, background: p.colour, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`, ['--r' as string]: `${p.rotate}deg` }}
        />
      ))}
    </div>
  )
}
