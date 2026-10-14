'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useAppT } from '@/lib/app-i18n/client'
import { getMeasuredWpm } from '@/features/reading-speed/actions'
import { recommendWpm } from '@/features/reading-speed/recommendWpm'

// Target speed for the reading drills (play design): the speed that suits the
// learner — a little above their own measured reading speed — is chosen for
// them and shown big as "Recommended for you"; every other speed sits smaller
// below. Without a measurement yet, it is a plain row of speeds.
export function TargetWpmPicker({ options, value, onChange }: { options: readonly number[]; value: number; onChange: (wpm: number) => void }): React.JSX.Element {
  const t = useAppT()
  const [recommended, setRecommended] = useState<number | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    let live = true
    getMeasuredWpm()
      .then((measured) => {
        if (!live) return
        const pick = recommendWpm(measured, options)
        setRecommended(pick)
        // Preselected once, when the settings open; the learner can still pick any other speed.
        if (pick !== null) onChangeRef.current(pick)
      })
      .catch(() => undefined)
    return () => {
      live = false
    }
    // options is a constant list per exercise
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const others = recommended === null ? options : options.filter((o) => o !== recommended)
  return (
    <div className="w-full" data-target-wpm={value} data-recommended-wpm={recommended ?? ''}>
      <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">{t('exercises.stats.targetWpm')}</p>
      {recommended !== null && (
        <button
          type="button"
          onClick={() => onChange(recommended)}
          aria-pressed={value === recommended}
          className="play-option mb-3 flex min-h-16 w-full flex-col items-center justify-center gap-0.5 px-4 py-2"
          data-state={value === recommended ? 'chosen' : 'idle'}
          data-wpm-recommended="true"
        >
          <span className="flex items-center gap-1 text-xs font-bold tracking-wider text-primary uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {t('training.play.recommendedForYou')}
          </span>
          <span className="font-heading text-2xl text-foreground tabular-nums">{t('training.reader.wpmValue', { n: recommended })}</span>
        </button>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {others.map((wpm) => (
          <button
            key={wpm}
            type="button"
            onClick={() => onChange(wpm)}
            aria-pressed={wpm === value}
            className={`min-h-10 min-w-12 rounded-xl border px-2.5 text-sm font-semibold tabular-nums ${wpm === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground'}`}
            data-wpm-option={wpm}
          >
            {wpm}
          </button>
        ))}
      </div>
    </div>
  )
}
