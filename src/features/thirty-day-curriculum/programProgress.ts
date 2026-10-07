import { getModuleProgress } from '@/lib/exercises/queries/getModuleProgress'
import { getCurriculumDayCompletions } from './actions/getCurriculumDayCompletions'
import { TOTAL_CURRICULUM_DAYS } from './curriculumDatabase'

// The old Eye Foundation module (removed Oct 2026, Phase 2). Its exercise_progress
// rows are kept; they only count so that no learner's score drops when scores
// switched from that module to the 30-day plan.
export const LEGACY_EYE_FOUNDATION_IDS = ['eye-warm-up', 'eye-stretch', 'eye-span', 'regression-control', 'reading-speed', 'rsvp'] as const

export type ProgramProgress = {
  completedDays: number
  totalDays: number
  /** The next day to do (1–30), or null when all 30 are done. */
  nextDay: number | null
  /** 30-day plan completion, 0–100. */
  percent: number
  /** What scores use: the higher of the 30-day plan and the old Eye Foundation completion, so no score drops. */
  scorePercent: number
  /** "Has practised" count for status labels: the higher of days done and old Eye Foundation exercises done. */
  activityCount: number
}

export function computeProgramProgress(completedDayNumbers: readonly number[], legacyCompleted: number, legacyTotal: number): ProgramProgress {
  const done = new Set(completedDayNumbers.filter((day) => day >= 1 && day <= TOTAL_CURRICULUM_DAYS))
  const completedDays = done.size
  let nextDay: number | null = null
  for (let day = 1; day <= TOTAL_CURRICULUM_DAYS; day++) {
    if (!done.has(day)) {
      nextDay = day
      break
    }
  }
  const percent = Math.round((completedDays / TOTAL_CURRICULUM_DAYS) * 100)
  const legacyPercent = legacyTotal > 0 ? Math.round((legacyCompleted / legacyTotal) * 100) : 0
  return {
    completedDays,
    totalDays: TOTAL_CURRICULUM_DAYS,
    nextDay,
    percent,
    scorePercent: Math.max(percent, legacyPercent),
    activityCount: Math.max(completedDays, legacyCompleted),
  }
}

/** The signed-in learner's 30-day plan progress (server only). */
export async function getProgramProgress(): Promise<ProgramProgress> {
  const [completions, legacy] = await Promise.all([
    getCurriculumDayCompletions(),
    getModuleProgress('quantum-speed-reading', LEGACY_EYE_FOUNDATION_IDS),
  ])
  return computeProgramProgress(
    completions.map((completion) => completion.day),
    legacy.completedCount,
    legacy.totalCount,
  )
}
