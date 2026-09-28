'use client'

import { useState } from 'react'
import type { AssessmentCopy } from '../assessmentCopy'
import type { AssessmentRecord } from '../assessmentTypes'

// Day 1 vs Day 30 side by side (Phase 8, Item 11): one row per measure
// with two bars (plain HTML, no chart library) and the change. Reaction
// time is "lower is better". With only Day 1, shows the Day 1 values.

type Metric = { key: string; label: string; unit: string; day1: number | null; day30: number | null; lowerIsBetter?: boolean }

function percentChange(from: number, to: number): number {
  return from === 0 ? 0 : Math.round(((to - from) / from) * 100)
}

function Bar({ value, max, tone, label }: { value: number | null; max: number; tone: 'muted' | 'strong'; label: string }): React.JSX.Element {
  const width = value === null || max === 0 ? 0 : Math.max(4, Math.round((value / max) * 100))
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 flex-none text-xs text-muted-foreground">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${tone === 'strong' ? 'bg-primary' : 'bg-foreground/35'}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

export function ResultsComparison({ day1, day30, copy }: { day1: AssessmentRecord; day30: AssessmentRecord | null; copy: AssessmentCopy }): React.JSX.Element {
  const metrics: Metric[] = [
    { key: 'wpm', label: copy.metrics.wpm, unit: '', day1: day1.wpm, day30: day30?.wpm ?? null },
    { key: 'comprehension', label: copy.metrics.comprehension, unit: '%', day1: day1.comprehensionPercent, day30: day30?.comprehensionPercent ?? null },
    { key: 'effective', label: copy.metrics.effective, unit: '', day1: day1.effectiveWpm, day30: day30?.effectiveWpm ?? null },
    { key: 'accuracy', label: copy.metrics.accuracy, unit: '%', day1: day1.attentionAccuracyPercent, day30: day30?.attentionAccuracyPercent ?? null },
    { key: 'rt', label: copy.metrics.rt, unit: ' ms', day1: day1.attentionMeanRtMs, day30: day30?.attentionMeanRtMs ?? null, lowerIsBetter: true },
  ]

  return (
    <div className="space-y-5">
      <ul className="space-y-4">
        {metrics.map((metric) => {
          const max = Math.max(metric.day1 ?? 0, metric.day30 ?? 0)
          const both = metric.day1 !== null && metric.day30 !== null
          const change = both ? percentChange(metric.day1 as number, metric.day30 as number) : null
          const improved = change !== null && (metric.lowerIsBetter === true ? change < 0 : change > 0)
          return (
            <li key={metric.key} className="rounded-2xl border border-border p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{metric.label}</span>
                <span className="text-sm tabular-nums">
                  {metric.day1 ?? '—'}
                  {metric.day1 !== null && metric.unit}
                  {day30 !== null && (
                    <>
                      {' → '}
                      <strong>
                        {metric.day30 ?? '—'}
                        {metric.day30 !== null && metric.unit}
                      </strong>
                    </>
                  )}
                  {change !== null && (
                    <span className={`ml-2 text-xs ${improved ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                      {change === 0 ? copy.noChange : change > 0 ? copy.changeUp(change) : copy.changeDown(Math.abs(change))}
                    </span>
                  )}
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                <Bar value={metric.day1} max={max} tone="muted" label={copy.day1} />
                {day30 !== null && <Bar value={metric.day30} max={max} tone="strong" label={copy.day30} />}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {copy.effectiveNote} {copy.rtNote}
      </p>
    </div>
  )
}

export function ShareCard({ copy }: { copy: AssessmentCopy }): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const src = '/labs/sharp-brain/assessment/share-card'

  async function share(): Promise<void> {
    try {
      const blob = await (await fetch(src)).blob()
      const file = new File([blob], 'sharp-brain-results.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file] })
    } catch {
      // Share cancelled or unsupported — the download link is still there.
    }
  }

  if (!open) {
    return (
      <div className="space-y-2">
        <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted">
          {copy.share}
        </button>
        <p className="text-xs text-muted-foreground">{copy.shareNote}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- generated per user on request; next/image optimisation doesn't apply. */}
      <img src={src} alt={copy.resultsTitle} width={540} height={540} className="h-auto w-full max-w-[540px] rounded-2xl border border-border" />
      <div className="flex flex-wrap gap-2">
        <a href={src} download="sharp-brain-results.png" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
          {copy.download}
        </a>
        <button type="button" onClick={() => void share()} className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted">
          {copy.shareButton}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">{copy.shareNote}</p>
    </div>
  )
}
