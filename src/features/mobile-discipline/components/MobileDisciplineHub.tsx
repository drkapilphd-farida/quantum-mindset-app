'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import { logFocusSession, saveScreenGoalCheckin, setScreenTimeGoal } from '../actions/mobileDisciplineActions'
import { MOBILE_DISCIPLINE_COPY, type MobileDisciplineCopy } from '../mobileDisciplineCopy'
import { FOCUS_SESSION_MINUTES, GOAL_PRESETS_MINUTES, MAX_GOAL_MINUTES, MIN_GOAL_MINUTES, type FocusMinutes } from '../mobileDiscipline'
import type { MobileDisciplineState } from '../queries/getMobileDisciplineState'

// Mobile Discipline screen (Phase 8, Item 12): goal → focus timer → daily
// check-in + streak → this week. All self-reported.

/** Height of the weekly bar area (h-24). */
const BAR_AREA_PX = 96

const card = 'rounded-3xl border border-border bg-background/60 p-5 sm:p-6'
const primaryButton = 'inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground disabled:opacity-50'
const chip = (selected: boolean): string =>
  cn('min-h-11 rounded-full border px-4 text-sm font-medium', selected ? 'border-primary bg-primary/10' : 'border-border hover:border-foreground/30')

function GoalCard({ copy, current }: { copy: MobileDisciplineCopy; current: number | null }): React.JSX.Element {
  const router = useRouter()
  const [editing, setEditing] = useState(current === null)
  const [minutes, setMinutes] = useState<number>(current ?? 60)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const isPreset = (GOAL_PRESETS_MINUTES as readonly number[]).includes(minutes)

  function save(): void {
    startTransition(async () => {
      const result = await setScreenTimeGoal({ dailyLimitMinutes: minutes })
      setMessage(result.ok ? copy.goalSaved : copy.error)
      if (result.ok) {
        setEditing(false)
        router.refresh()
      }
    })
  }

  return (
    <section className={card} aria-labelledby="goal-heading">
      <h2 id="goal-heading" className="text-lg font-semibold">
        {copy.goalTitle}
      </h2>
      {!editing && current !== null ? (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px]">{copy.goalCurrent(current)}</p>
          <button type="button" className={chip(false)} onClick={() => setEditing(true)}>
            {copy.goalChange}
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-4">
          <p className="text-sm text-muted-foreground">{copy.goalNone}</p>
          <div className="flex flex-wrap gap-2">
            {GOAL_PRESETS_MINUTES.map((preset) => (
              <button key={preset} type="button" aria-pressed={minutes === preset} className={chip(minutes === preset)} onClick={() => setMinutes(preset)}>
                {copy.minutes(preset)}
              </button>
            ))}
            <label className={cn(chip(!isPreset), 'inline-flex items-center gap-2')}>
              <span>{copy.goalCustom}</span>
              <input
                type="number"
                inputMode="numeric"
                min={MIN_GOAL_MINUTES}
                max={MAX_GOAL_MINUTES}
                step={5}
                value={isPreset ? '' : minutes}
                onChange={(event) => setMinutes(Math.min(MAX_GOAL_MINUTES, Math.max(MIN_GOAL_MINUTES, Number(event.target.value) || MIN_GOAL_MINUTES)))}
                placeholder="—"
                className="w-14 border-b border-foreground/30 bg-transparent text-right outline-none"
                aria-label={copy.goalCustom}
              />
            </label>
          </div>
          <button type="button" className={primaryButton} disabled={pending} onClick={save}>
            {copy.goalSave}
          </button>
        </div>
      )}
      {message !== null && <p className="mt-3 text-sm text-muted-foreground" role="status">{message}</p>}
    </section>
  )
}

function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function FocusTimerCard({ copy }: { copy: MobileDisciplineCopy }): React.JSX.Element {
  const router = useRouter()
  const [length, setLength] = useState<FocusMinutes>(15)
  const [run, setRun] = useState<{ startedAt: string; endsAt: number } | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [finished, setFinished] = useState<{ minutes: number; note: string | null } | null>(null)
  const wakeLock = useRef<{ release: () => Promise<void> } | null>(null)

  useEffect(() => {
    if (run === null) return
    const tick = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(tick)
  }, [run])

  useEffect(() => {
    if (run === null || now < run.endsAt) return
    const minutes = length
    const startedAt = run.startedAt
    setRun(null)
    void wakeLock.current?.release().catch(() => undefined)
    void (async () => {
      const result = await logFocusSession({ plannedMinutes: minutes, startedAt })
      setFinished({ minutes, note: result.ok ? null : result.reason === 'not_completed' ? copy.notCompleted : copy.error })
      router.refresh()
    })()
  }, [now, run, length, copy, router])

  async function start(): Promise<void> {
    const startedAt = new Date()
    setFinished(null)
    setNow(startedAt.getTime())
    setRun({ startedAt: startedAt.toISOString(), endsAt: startedAt.getTime() + length * 60_000 })
    try {
      const nav = navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> } }
      wakeLock.current = (await nav.wakeLock?.request('screen')) ?? null
    } catch {
      wakeLock.current = null
    }
  }

  function stop(): void {
    setRun(null)
    void wakeLock.current?.release().catch(() => undefined)
  }

  return (
    <section className={card} aria-labelledby="focus-heading">
      <h2 id="focus-heading" className="text-lg font-semibold">
        {copy.focusTitle}
      </h2>
      {run !== null ? (
        <div className="mt-4 flex flex-col items-center gap-4 text-center">
          <p className="font-mono text-6xl tabular-nums" aria-live="off">
            {formatClock(run.endsAt - now)}
          </p>
          <p className="text-[15px] text-muted-foreground">{copy.focusRunning}</p>
          <button type="button" className={chip(false)} onClick={stop}>
            {copy.endEarly}
          </button>
          <p className="text-xs text-muted-foreground">{copy.endEarlyNote}</p>
        </div>
      ) : finished !== null ? (
        <div className="mt-4 flex flex-col items-center gap-3 text-center">
          <p className="text-xl font-semibold">{copy.focusDone(finished.minutes)}</p>
          <p className="text-[15px] text-muted-foreground">{finished.note ?? copy.focusDoneSub}</p>
          <button type="button" className={primaryButton} onClick={() => setFinished(null)}>
            {copy.focusAgain}
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-4">
          <p className="text-sm text-muted-foreground">{copy.focusSub}</p>
          <div className="flex flex-wrap gap-2">
            {FOCUS_SESSION_MINUTES.map((option) => (
              <button key={option} type="button" aria-pressed={length === option} className={chip(length === option)} onClick={() => setLength(option)}>
                {copy.minutes(option)}
              </button>
            ))}
          </div>
          <button type="button" className={primaryButton} onClick={() => void start()}>
            {copy.start}
          </button>
        </div>
      )}
    </section>
  )
}

function CheckinCard({ copy, state }: { copy: MobileDisciplineCopy; state: MobileDisciplineState }): React.JSX.Element {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function answer(withinGoal: boolean): void {
    startTransition(async () => {
      const result = await saveScreenGoalCheckin({ withinGoal })
      if (!result.ok && result.reason !== 'already_checked_in') setError(copy.error)
      router.refresh()
    })
  }

  return (
    <section className={card} aria-labelledby="checkin-heading">
      <h2 id="checkin-heading" className="text-lg font-semibold">
        {copy.checkinTitle}
      </h2>
      {state.dailyLimitMinutes === null ? (
        <p className="mt-2 text-sm text-muted-foreground">{copy.checkinNeedsGoal}</p>
      ) : state.todayCheckin === null ? (
        <div className="mt-2 space-y-3">
          <p className="text-[15px]">{copy.checkinQuestion}</p>
          <div className="flex gap-2">
            <button type="button" className={primaryButton} disabled={pending} onClick={() => answer(true)}>
              {copy.yes}
            </button>
            <button type="button" className={chip(false)} disabled={pending} onClick={() => answer(false)}>
              {copy.notToday}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[15px]">{state.todayCheckin ? copy.checkedYes : copy.checkedNo}</p>
      )}
      <p className="mt-4 text-sm font-medium">{state.streak > 0 ? `🔥 ${copy.streak(state.streak)}` : copy.streakZero}</p>
      {error !== null && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  )
}

function WeekCard({ copy, state, lang }: { copy: MobileDisciplineCopy; state: MobileDisciplineState; lang: 'en' | 'hi' }): React.JSX.Element {
  const { week } = state
  const max = Math.max(25, ...week.days.map((d) => d.focusMinutes))
  const weekday = new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short', timeZone: 'UTC' })
  return (
    <section className={card} aria-labelledby="week-heading">
      <h2 id="week-heading" className="text-lg font-semibold">
        {copy.weekTitle}
      </h2>
      <div className="mt-4 flex items-end gap-2" aria-hidden="true">
        {week.days.map((day) => (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-24 w-full items-end">
              <div className="w-full rounded-t-md bg-primary/80" style={{ height: day.focusMinutes > 0 ? Math.max(4, Math.round((day.focusMinutes / max) * BAR_AREA_PX)) : 0 }} />
            </div>
            <span className={cn('h-2 w-2 rounded-full', day.withinGoal === true ? 'bg-emerald-600' : day.withinGoal === false ? 'bg-muted-foreground/40' : 'bg-transparent')} />
            <span className="text-[11px] text-muted-foreground">{weekday.format(new Date(`${day.date}T00:00:00Z`))}</span>
          </div>
        ))}
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl border border-border p-3">
          <dt className="text-xs text-muted-foreground">{copy.weekFocusMinutes}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{week.focusMinutes}</dd>
        </div>
        <div className="rounded-2xl border border-border p-3">
          <dt className="text-xs text-muted-foreground">{copy.weekSessions}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{week.sessions}</dd>
        </div>
        <div className="rounded-2xl border border-border p-3">
          <dt className="text-xs text-muted-foreground">{copy.weekDaysWithinLabel}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums">{week.daysWithinGoal}</dd>
          <dd className="text-[11px] text-muted-foreground">{copy.weekDaysWithin(week.daysWithinGoal, week.daysCheckedIn)}</dd>
        </div>
      </dl>
    </section>
  )
}

export function MobileDisciplineHub({ state }: { state: MobileDisciplineState }): React.JSX.Element {
  const { lang } = useLanguage()
  const copy = MOBILE_DISCIPLINE_COPY[lang]
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{copy.sub}</p>
        </div>
        <LanguageToggle />
      </div>
      <GoalCard copy={copy} current={state.dailyLimitMinutes} />
      <FocusTimerCard copy={copy} />
      <CheckinCard copy={copy} state={state} />
      <WeekCard copy={copy} state={state} lang={lang} />
      <p className="text-xs text-muted-foreground">{copy.selfReported}</p>
    </div>
  )
}
