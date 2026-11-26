'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { MemorySet, V3Lang } from '../content'
import { shuffled } from '../content'
import type { V3Copy } from '../copyV3'
import { fill } from '../copyV3'
import { MEMORY_ITEMS } from '../score'
import { bigBtn, buzz } from './v3ui'

const SHOW_MS = 15_000

type MemoryRoundProps = {
  c: V3Copy
  lang: V3Lang
  set: MemorySet
  onDone: (picked: string[]) => void
}

/** 7 pictures for 15 seconds, then pick them out of 12 (no typing). */
export function MemoryRound({ c, lang, set, onDone }: MemoryRoundProps): React.JSX.Element {
  const [phase, setPhase] = useState<'show' | 'pick'>('show')
  const [left, setLeft] = useState(SHOW_MS)
  const [picked, setPicked] = useState<string[]>([])
  const options = useMemo(() => shuffled([...set.shown, ...set.distractors]), [set])
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    if (phase !== 'show') return undefined
    startedAt.current = performance.now()
    const id = window.setInterval(() => {
      const rest = SHOW_MS - (performance.now() - (startedAt.current ?? performance.now()))
      if (rest <= 0) {
        window.clearInterval(id)
        setLeft(0)
        setPhase('pick')
        return
      }
      setLeft(rest)
    }, 100)
    return () => window.clearInterval(id)
  }, [phase])

  function handleToggle(id: string): void {
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id)
      if (p.length >= MEMORY_ITEMS) return p
      buzz(8)
      return [...p, id]
    })
  }

  if (phase === 'show') {
    const R = 26
    const C = 2 * Math.PI * R
    return (
      <section className="flex flex-col items-center gap-4" data-v3-memory="show">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 64 64" className="size-14 -rotate-90" aria-hidden="true">
            <circle cx="32" cy="32" r={R} className="fill-none stroke-muted" strokeWidth="6" />
            <circle cx="32" cy="32" r={R} className="fill-none stroke-primary" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - left / SHOW_MS)} />
          </svg>
          <p className="font-heading text-3xl font-bold text-foreground tabular-nums" aria-live="off">
            {Math.ceil(left / 1000)}
          </p>
        </div>
        <p className="text-center text-xl font-bold text-foreground">{c.memory.remember}</p>
        <ul className="grid w-full grid-cols-3 gap-2">
          {set.shown.map((i) => (
            <li key={i.id} className="flex flex-col items-center gap-1 rounded-2xl border-2 border-border bg-card p-3" data-v3-shown={i.id}>
              <span className="text-4xl" aria-hidden="true">
                {i.emoji}
              </span>
              <span lang={lang} className="text-base font-semibold text-foreground">
                {i.word[lang]}
              </span>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4" data-v3-memory="pick">
      <p className="text-center text-xl font-bold text-foreground">{c.memory.pick}</p>
      <p className="text-center text-sm font-semibold text-muted-foreground tabular-nums">{fill(c.memory.picked, { n: picked.length })}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((i) => {
          const on = picked.includes(i.id)
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => handleToggle(i.id)}
              aria-pressed={on}
              className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 transition-colors ${on ? 'v3-pop border-primary bg-primary/10' : 'border-border bg-card'}`}
              data-v3-option={i.id}
            >
              <span className="text-3xl" aria-hidden="true">
                {i.emoji}
              </span>
              <span lang={lang} className="text-sm font-semibold text-foreground">
                {i.word[lang]}
              </span>
            </button>
          )
        })}
      </div>
      <button type="button" onClick={() => onDone(picked)} className={bigBtn} data-v3-memory-done>
        {c.memory.done} ✓
      </button>
    </section>
  )
}
