'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppT } from '@/lib/app-i18n/client'
import { usePrefersReducedMotion } from '@/hooks/exercises/usePrefersReducedMotion'
import type { RoundOutcome } from '@/features/exercise-core/components/AdaptiveExerciseShell'
import { breathPattern, breathSync, IN_RHYTHM_SYNC, PRACTICE_BREATHS, type BreathSample } from '../breathingPatterns'

const READY_MS = 3_000
const TICK_MS = 100
const FOLLOW_KEY = 'mum-breath-follow'

type PhaseKind = 'ready' | 'in' | 'hold' | 'out' | 'done'

type Moment = { kind: PhaseKind; breath: number; msIntoPhase: number; phaseMs: number }

function momentAt(elapsedMs: number, level: number, breaths: number): Moment {
  const p = breathPattern(level)
  if (elapsedMs < READY_MS) return { kind: 'ready', breath: 0, msIntoPhase: elapsedMs, phaseMs: READY_MS }
  const cycle = p.inMs + p.holdMs + p.outMs
  const t = elapsedMs - READY_MS
  const breath = Math.floor(t / cycle)
  if (breath >= breaths) return { kind: 'done', breath: breaths, msIntoPhase: 0, phaseMs: 0 }
  const inCycle = t - breath * cycle
  if (inCycle < p.inMs) return { kind: 'in', breath, msIntoPhase: inCycle, phaseMs: p.inMs }
  if (inCycle < p.inMs + p.holdMs) return { kind: 'hold', breath, msIntoPhase: inCycle - p.inMs, phaseMs: p.holdMs }
  return { kind: 'out', breath, msIntoPhase: inCycle - p.inMs - p.holdMs, phaseMs: p.outMs }
}

function readFollow(): boolean {
  try {
    return localStorage.getItem(FOLLOW_KEY) === '1'
  } catch {
    return false
  }
}

export function CalmBreathingRound({ level, isPractice, onDone }: { level: number; isPractice: boolean; onDone: (o: RoundOutcome) => void }): React.JSX.Element {
  const t = useAppT()
  const reducedMotion = usePrefersReducedMotion()
  const pattern = breathPattern(level)
  const breaths = isPractice ? PRACTICE_BREATHS : pattern.breathsPerRound

  const [follow, setFollow] = useState(false)
  const [moment, setMoment] = useState<Moment>({ kind: 'ready', breath: 0, msIntoPhase: 0, phaseMs: READY_MS })
  const [pressed, setPressed] = useState(false)
  const pressedRef = useRef(false)
  const followRef = useRef(false)
  const samplesRef = useRef<BreathSample[][]>(Array.from({ length: breaths }, () => []))
  const doneRef = useRef(false)

  useEffect(() => {
    const f = readFollow()
    setFollow(f)
    followRef.current = f
  }, [])

  function setPress(value: boolean): void {
    pressedRef.current = value
    setPressed(value)
  }

  useEffect(() => {
    const startedAt = performance.now()
    const id = setInterval(() => {
      const m = momentAt(performance.now() - startedAt, level, breaths)
      setMoment((prev) => (prev.kind === m.kind && prev.breath === m.breath && Math.floor(prev.msIntoPhase / 1000) === Math.floor(m.msIntoPhase / 1000) ? prev : m))
      if (m.kind === 'in' || m.kind === 'hold' || m.kind === 'out') {
        samplesRef.current[m.breath]?.push({ expectPressed: m.kind !== 'out', pressed: pressedRef.current, msIntoPhase: m.msIntoPhase })
      }
      if (m.kind === 'done' && !doneRef.current) {
        doneRef.current = true
        clearInterval(id)
        const syncs = samplesRef.current.map((s) => breathSync(s))
        const following = followRef.current
        const correct = following ? breaths : syncs.filter((s) => s >= IN_RHYTHM_SYNC).length
        const avgSync = syncs.length > 0 ? syncs.reduce((a, b) => a + b, 0) / syncs.length : 0
        onDone({
          correct,
          total: breaths,
          score: following ? breaths * 5 : Math.round(syncs.reduce((a, s) => a + s * 10, 0)),
          metrics: following ? { breaths } : { breaths, rhythmPercent: Math.round(avgSync * 100) },
        })
      }
    }, TICK_MS)
    return () => clearInterval(id)
    // onDone is stable for the life of this round (the shell remounts per round).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, breaths])

  // Space bar works like holding the circle.
  useEffect(() => {
    function down(e: KeyboardEvent): void {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        setPress(true)
      }
    }
    function up(e: KeyboardEvent): void {
      if (e.code === 'Space') setPress(false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  function toggleFollow(): void {
    const next = !follow
    setFollow(next)
    followRef.current = next
    try {
      localStorage.setItem(FOLLOW_KEY, next ? '1' : '0')
    } catch {
      // Not remembered — fine.
    }
  }

  const big = moment.kind === 'in' || moment.kind === 'hold'
  const scale = big ? 1 : 0.55
  const transitionMs = moment.kind === 'in' ? pattern.inMs : moment.kind === 'out' ? pattern.outMs : 600
  const secondsLeft = Math.max(1, Math.ceil((moment.phaseMs - moment.msIntoPhase) / 1000))
  const label =
    moment.kind === 'ready'
      ? t('training.breathing.getReady')
      : moment.kind === 'in'
        ? t('training.breathing.breatheIn')
        : moment.kind === 'hold'
          ? t('training.breathing.pause')
          : moment.kind === 'out'
            ? t('training.breathing.breatheOut')
            : t('training.breathing.wellDone')
  const expectPressed = moment.kind === 'in' || moment.kind === 'hold'
  const inSync = moment.kind === 'ready' || moment.kind === 'done' || follow || expectPressed === pressed

  return (
    <div className="flex w-full flex-col items-center gap-3" data-breath-phase={moment.kind} data-breath={moment.breath}>
      <p className="font-heading text-2xl font-bold text-foreground" aria-live="polite">
        {label}
      </p>
      <p className="h-5 text-sm tabular-nums text-muted-foreground">{moment.kind === 'done' ? '' : secondsLeft}</p>
      <button
        type="button"
        aria-pressed={pressed}
        aria-label={follow ? label : t('training.breathing.holdAria')}
        onPointerDown={(e) => {
          try {
            e.currentTarget.setPointerCapture(e.pointerId)
          } catch {
            // Some browsers refuse capture for synthetic/stylus events — holding still works.
          }
          setPress(true)
        }}
        onPointerUp={() => setPress(false)}
        onPointerCancel={() => setPress(false)}
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex size-64 touch-none items-center justify-center rounded-full outline-none select-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          className={`absolute inset-0 rounded-full border-2 ${inSync ? 'border-sky-400/60' : 'border-amber-400/80'} bg-gradient-to-br from-sky-300/40 via-teal-300/30 to-indigo-300/40 dark:from-sky-500/25 dark:via-teal-500/20 dark:to-indigo-500/25`}
          style={{
            transform: reducedMotion ? 'scale(0.8)' : `scale(${scale})`,
            transition: reducedMotion ? 'none' : `transform ${transitionMs}ms ease-in-out`,
          }}
          aria-hidden="true"
        />
        <span className="relative px-6 text-center text-sm font-semibold text-foreground">
          {follow ? '' : moment.kind === 'out' ? t('training.breathing.letGo') : moment.kind === 'done' ? '' : t('training.breathing.hold')}
        </span>
      </button>
      <p className="text-xs text-muted-foreground">
        {t('training.breathing.breathOf', { n: Math.min(moment.breath + 1, breaths), total: breaths })}
        {!follow && moment.kind !== 'ready' && moment.kind !== 'done' && !inSync && <span className="ml-2 font-medium text-amber-700 dark:text-amber-300">{expectPressed ? t('training.breathing.pressNow') : t('training.breathing.releaseNow')}</span>}
      </p>
      <label className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={follow} onChange={toggleFollow} className="size-4 accent-primary" data-follow-toggle="true" />
        {t('training.breathing.justFollow')}
      </label>
    </div>
  )
}
