'use client'

import { useRef, useState } from 'react'
import { savePracticeSession } from '@/lib/exercises/actions/savePracticeSession'
import type { LabId } from '@/lib/exercises/types'
import { saveExerciseResult } from '@/features/exercise-core/actions/exerciseResults'
import { resolveCurriculumDay } from '@/features/exercise-core/useExerciseProgress'
import { useCurriculumDayInfo } from '@/features/thirty-day-curriculum/embeddedExerciseContext'

/** An exercise's own result, saved on the server (exercise_results) next to the practice log. */
export type ExerciseScore = {
  score: number
  accuracyPercent: number | null
  extra?: Record<string, number>
}

export type ExerciseSessionStage = 'intro' | 'active' | 'completion'

type UseExerciseSessionOptions = {
  labId: LabId
  exerciseId: string
}

type UseExerciseSessionResult = {
  stage: ExerciseSessionStage
  start: () => void
  recordCompletion: (durationMs: number, result?: ExerciseScore) => Promise<void>
  recordExit: (durationMs: number) => Promise<void>
  awaitPendingSave: () => Promise<void>
}

// Owns the intro → active → completion lifecycle shared by every exercise, and
// reports each attempt through the one shared save action. Navigation (what
// screen comes next) deliberately stays with the caller — composed sessions
// will eventually chain exercises together, which this hook shouldn't assume.
export function useExerciseSession({ labId, exerciseId }: UseExerciseSessionOptions): UseExerciseSessionResult {
  const [stage, setStage] = useState<ExerciseSessionStage>('intro')
  // Tracks the most recent save so a caller that navigates afterward (either
  // exit, immediately, or "Continue Learning" on the completion screen) can
  // await it first. Found necessary in Sprint 2F's verification: a fast
  // click could outrace the fire-and-forget save, navigating away before the
  // write landed and silently showing stale progress on the next page.
  const pendingSaveRef = useRef<Promise<void>>(Promise.resolve())
  const dayFromContext = useCurriculumDayInfo()

  function start(): void {
    setStage('active')
  }

  async function recordCompletion(durationMs: number, result?: ExerciseScore): Promise<void> {
    setStage('completion')
    const saves: Promise<unknown>[] = [savePracticeSession({ labId, exerciseId, durationMs, completed: true })]
    if (result !== undefined) {
      const day = resolveCurriculumDay(exerciseId, dayFromContext)
      const extra = Object.fromEntries(Object.entries(result.extra ?? {}).filter(([, v]) => Number.isFinite(v)).map(([k, v]) => [k, Math.round(v * 10) / 10]))
      saves.push(
        saveExerciseResult({
          exerciseId,
          score: Math.max(0, Math.round(Number.isFinite(result.score) ? result.score : 0)),
          accuracyPercent: result.accuracyPercent === null || !Number.isFinite(result.accuracyPercent) ? null : Math.min(100, Math.max(0, Math.round(result.accuracyPercent))),
          levelStart: null,
          levelEnd: null,
          goodRun: 0,
          poorRun: 0,
          rounds: null,
          durationMs: Math.min(86_400_000, Math.max(0, Math.round(durationMs))),
          curriculumDay: day?.day ?? null,
          isReplay: day?.isReplay ?? false,
          contentLang: null,
          ...(Object.keys(extra).length > 0 ? { extra } : {}),
        }).catch(() => undefined),
      )
    }
    const promise = Promise.all(saves).then(() => undefined)
    pendingSaveRef.current = promise
    return promise
  }

  async function recordExit(durationMs: number): Promise<void> {
    const promise = savePracticeSession({ labId, exerciseId, durationMs, completed: false }).then(() => undefined)
    pendingSaveRef.current = promise
    return promise
  }

  function awaitPendingSave(): Promise<void> {
    return pendingSaveRef.current
  }

  return { stage, start, recordCompletion, recordExit, awaitPendingSave }
}
