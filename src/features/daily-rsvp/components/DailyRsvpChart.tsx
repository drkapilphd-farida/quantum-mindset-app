'use client'

import { useState } from 'react'
import { useAppT } from '@/lib/app-i18n/client'
import type { DailyRsvpDayResult } from '../dailyRsvp'

const DAYS = 30
const W = 300
const SPEED_H = 96
const RET_H = 28
const GAP = 2
const SLOT = W / DAYS
const BAR = SLOT - GAP

/**
 * Reading speed per plan day (bars, one series) with retention as its own
 * strip underneath on the same day axis. Two measures with different scales
 * are two charts, never one chart with two y-axes. Tap or hover a day for
 * its numbers; the same numbers are in a table for screen readers.
 */
export function DailyRsvpChart({ history, highlightDay = null }: { history: readonly DailyRsvpDayResult[]; highlightDay?: number | null }): React.JSX.Element {
  const t = useAppT()
  const [active, setActive] = useState<number | null>(highlightDay)

  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground" data-rsvp-chart="empty">{t('training.dailyRsvp.chartEmpty')}</p>
  }

  const byDay = new Map(history.map((r) => [r.day, r]))
  const maxWpm = Math.max(...history.map((r) => r.wpm))
  const top = Math.ceil((maxWpm * 1.15) / 50) * 50
  const shown = active !== null ? byDay.get(active) : undefined
  const first = history[0]!
  const latest = history[history.length - 1]!

  return (
    <figure className="flex w-full flex-col gap-2" data-rsvp-chart="true">
      <figcaption className="sr-only">
        {t('training.dailyRsvp.chartSummary', { first: first.wpm, latest: latest.wpm, days: history.length })}
      </figcaption>

      <p className="min-h-5 text-xs tabular-nums text-muted-foreground" aria-live="polite" data-rsvp-chart-readout={shown?.day}>
        {shown !== undefined
          ? t('training.dailyRsvp.chartDay', { day: shown.day, wpm: shown.wpm, retention: shown.retentionPercent })
          : t('training.dailyRsvp.chartSummary', { first: first.wpm, latest: latest.wpm, days: history.length })}
      </p>

      <div className="relative flex flex-col gap-2">
      <div className="flex items-stretch gap-2">
        <div className="flex w-8 shrink-0 flex-col justify-between text-right text-[10px] tabular-nums text-muted-foreground" aria-hidden="true">
          <span>{top}</span>
          <span>{Math.round(top / 2)}</span>
          <span>0</span>
        </div>
        <svg viewBox={`0 0 ${W} ${SPEED_H}`} className="h-28 min-w-0 flex-1" role="img" aria-hidden="true" preserveAspectRatio="none">
          {[0.5, 1].map((f) => (
            <line key={f} x1={0} x2={W} y1={SPEED_H * (1 - f)} y2={SPEED_H * (1 - f)} className="stroke-border" strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
          ))}
          <line x1={0} x2={W} y1={SPEED_H} y2={SPEED_H} className="stroke-muted-foreground/40" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          {Array.from({ length: DAYS }, (_, i) => {
            const day = i + 1
            const r = byDay.get(day)
            const x = i * SLOT + GAP / 2
            if (r === undefined) return <rect key={day} x={x + BAR / 2 - 0.5} y={SPEED_H - 1.5} width={1} height={1.5} className="fill-border" />
            const h = Math.max(2, (r.wpm / top) * SPEED_H)
            return (
              <rect
                key={day}
                x={x}
                y={SPEED_H - h}
                width={BAR}
                height={h}
                rx={Math.min(2, BAR / 2)}
                className={active === day ? 'fill-primary' : 'fill-primary/70'}
                data-rsvp-bar={day}
              />
            )
          })}
        </svg>
      </div>

      <div className="flex items-stretch gap-2">
        <span className="w-8 shrink-0 text-right text-[10px] leading-7 text-muted-foreground" aria-hidden="true">%</span>
        <svg viewBox={`0 0 ${W} ${RET_H}`} className="h-7 min-w-0 flex-1" role="img" aria-hidden="true" preserveAspectRatio="none">
          {Array.from({ length: DAYS }, (_, i) => {
            const day = i + 1
            const r = byDay.get(day)
            const x = i * SLOT + GAP / 2
            if (r === undefined) return null
            const h = Math.max(1.5, (r.retentionPercent / 100) * RET_H)
            return <rect key={day} x={x} y={RET_H - h} width={BAR} height={h} rx={Math.min(1.5, BAR / 2)} className={active === day ? 'fill-foreground/70' : 'fill-muted-foreground/40'} />
          })}
        </svg>
      </div>

      {/* Hit targets: a full-height column per day, larger than the bar itself. */}
      <div className="absolute inset-y-0 right-0 left-10 grid grid-cols-[repeat(30,minmax(0,1fr))]" onMouseLeave={() => setActive(highlightDay)}>
        {Array.from({ length: DAYS }, (_, i) => {
          const day = i + 1
          const has = byDay.has(day)
          return (
            <button
              key={day}
              type="button"
              tabIndex={has ? 0 : -1}
              disabled={!has}
              aria-label={has ? t('training.dailyRsvp.chartDay', { day, wpm: byDay.get(day)!.wpm, retention: byDay.get(day)!.retentionPercent }) : undefined}
              onMouseEnter={() => has && setActive(day)}
              onFocus={() => has && setActive(day)}
              onClick={() => has && setActive(day)}
              className="h-full cursor-default focus-visible:rounded focus-visible:outline-2 focus-visible:outline-primary disabled:pointer-events-none"
            />
          )
        })}
      </div>
      </div>

      <div className="relative ml-10 h-4 text-[10px] tabular-nums text-muted-foreground" aria-hidden="true">
        {[1, 10, 20, 30].map((d) => (
          <span key={d} className="absolute -translate-x-1/2" style={{ left: `${((d - 0.5) / DAYS) * 100}%` }}>
            {d}
          </span>
        ))}
      </div>
      <div className="ml-10 flex gap-4 text-[11px] text-muted-foreground" aria-hidden="true">
        <span className="flex items-center gap-1">
          <span className="inline-block size-2.5 rounded-sm bg-primary/70" />
          {t('training.dailyRsvp.speed')} ({t('training.dailyRsvp.wpm')})
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2.5 rounded-sm bg-muted-foreground/40" />
          {t('training.dailyRsvp.retention')} (%)
        </span>
      </div>

      <table className="sr-only">
        <caption>{t('training.dailyRsvp.chartTitle')}</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">{t('training.dailyRsvp.speed')}</th>
            <th scope="col">{t('training.dailyRsvp.retention')}</th>
          </tr>
        </thead>
        <tbody>
          {history.map((r) => (
            <tr key={r.day}>
              <td>{r.day}</td>
              <td>{r.wpm}</td>
              <td>{r.retentionPercent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
