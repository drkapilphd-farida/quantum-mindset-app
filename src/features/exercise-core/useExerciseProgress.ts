'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useCurriculumDayInfo, type CurriculumDayInfo } from '@/features/thirty-day-curriculum/embeddedExerciseContext'
import { getCurrentSessionExerciseId, loadActiveCurriculumSession } from '@/features/thirty-day-curriculum/curriculumSessionRunner'
import type { AppLang } from '@/lib/app-i18n/languages'
import { getExerciseStats, saveExerciseResult, type ExerciseStats } from './actions/exerciseResults'
import { normaliseLevelState, START_STATE, type LevelState } from './levelEngine'

// Loads a learner's level / personal best for one exercise and saves each
// finished session. Signed-in learners: the server (exercise_results) is the
// source of truth, so progress follows them to a new phone. Signed out (or
// offline): an on-device copy keeps the same experience for that browser.

export type ExerciseProgress = {
  ready: boolean
  levelState: LevelState
  bestScore: number
  plays: number
  /** First time on this exercise (on this account / device): show the demo + a practice round. */
  isFirstTime: boolean
}

export type FinishedSession = {
  score: number
  accuracyPercent: number | null
  levelStart: number | null
  levelState: LevelState | null
  rounds: number | null
  durationMs: number | null
  contentLang?: AppLang | null
  extra?: Record<string, number | string | boolean>
}

const localKey = (exerciseId: string): string => `mum-ex-${exerciseId}`

type LocalCopy = { levelState: LevelState; bestScore: number; plays: number }

function readLocal(exerciseId: string): LocalCopy | null {
  try {
    const raw = localStorage.getItem(localKey(exerciseId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return {
      levelState: normaliseLevelState(parsed.levelState),
      bestScore: typeof parsed.bestScore === 'number' && Number.isFinite(parsed.bestScore) ? Math.max(0, parsed.bestScore) : 0,
      plays: typeof parsed.plays === 'number' && Number.isFinite(parsed.plays) ? Math.max(0, parsed.plays) : 0,
    }
  } catch {
    return null
  }
}

function writeLocal(exerciseId: string, copy: LocalCopy): void {
  try {
    localStorage.setItem(localKey(exerciseId), JSON.stringify(copy))
  } catch {
    // Storage blocked — the server copy (when signed in) still has it.
  }
}

/** The programme day this exercise is being played for, if any (wizard context, or a gated hand-off). */
export function resolveCurriculumDay(exerciseId: string, fromContext: CurriculumDayInfo | null): CurriculumDayInfo | null {
  if (fromContext !== null) return fromContext
  const session = loadActiveCurriculumSession()
  if (session === null || getCurrentSessionExerciseId(session) !== exerciseId) return null
  return { day: session.day, isReplay: session.replay === true }
}

const EMPTY: ExerciseProgress = { ready: false, levelState: START_STATE, bestScore: 0, plays: 0, isFirstTime: true }

export function useExerciseProgress(exerciseId: string): {
  progress: ExerciseProgress
  save: (session: FinishedSession) => Promise<ExerciseProgress>
} {
  const dayFromContext = useCurriculumDayInfo()
  const [progress, setProgress] = useState<ExerciseProgress>(EMPTY)
  const signedInRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    const local = readLocal(exerciseId)
    void getExerciseStats(exerciseId)
      .catch(() => null)
      .then((server: ExerciseStats | null) => {
        if (cancelled) return
        signedInRef.current = server !== null
        const source = server ?? local
        const plays = Math.max(server?.plays ?? 0, local?.plays ?? 0)
        setProgress({
          ready: true,
          levelState: source?.levelState ?? START_STATE,
          bestScore: Math.max(server?.bestScore ?? 0, local?.bestScore ?? 0),
          plays,
          isFirstTime: plays === 0,
        })
      })
    return () => {
      cancelled = true
    }
  }, [exerciseId])

  const save = useCallback(
    async (session: FinishedSession): Promise<ExerciseProgress> => {
      const levelState = session.levelState ?? START_STATE
      const local = readLocal(exerciseId)
      const localCopy: LocalCopy = {
        levelState,
        bestScore: Math.max(local?.bestScore ?? 0, session.score),
        plays: (local?.plays ?? 0) + 1,
      }
      writeLocal(exerciseId, localCopy)

      const dayInfo = resolveCurriculumDay(exerciseId, dayFromContext)
      const response = await saveExerciseResult({
        exerciseId,
        score: Math.max(0, Math.round(session.score)),
        accuracyPercent: session.accuracyPercent === null ? null : Math.min(100, Math.max(0, Math.round(session.accuracyPercent))),
        levelStart: session.levelStart,
        levelEnd: session.levelState === null ? null : levelState.level,
        goodRun: levelState.goodRun,
        poorRun: levelState.poorRun,
        rounds: session.rounds,
        durationMs: session.durationMs === null ? null : Math.max(0, Math.round(session.durationMs)),
        curriculumDay: dayInfo?.day ?? null,
        isReplay: dayInfo?.isReplay ?? false,
        contentLang: session.contentLang ?? null,
        ...(session.extra ? { extra: session.extra } : {}),
      }).catch(() => null)

      const next: ExerciseProgress =
        response !== null && response.ok
          ? { ready: true, levelState: response.stats.levelState, bestScore: Math.max(response.stats.bestScore, localCopy.bestScore), plays: response.stats.plays, isFirstTime: false }
          : { ready: true, levelState, bestScore: localCopy.bestScore, plays: localCopy.plays, isFirstTime: false }
      setProgress(next)
      return next
    },
    [exerciseId, dayFromContext],
  )

  return { progress, save }
}
