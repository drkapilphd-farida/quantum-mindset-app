import { doneStepIds, TOTAL_CURRICULUM_DAYS } from './curriculumDatabase'
import { dayStepIds } from './paceControl'

// THE rule for the 30-day program (founder, 9 Nov 2026 hotfix):
// 1. A learner with access opens Day N+1 the moment Day N is completed.
//    Nothing else: no batch, no calendar date, no midnight wait, no minimum time.
// 2. "Day N completed" = its required activity is done. A test day (1, 7, 14,
//    21, 30) is completed by its recorded reading test. Optional steps (the
//    chapter upload) never block.
// 3. Completed days are always open, with or without access.
// Every reader and the one writer (completeCurriculumDay) use these functions.

/** Days whose reading test is the day's completion. */
export const CHECKPOINT_DAYS: ReadonlySet<number> = new Set([1, 7, 14, 21, 30])

/** Steps that are offered but never required (uploading your own chapter). */
export const OPTIONAL_STEP_IDS: ReadonlySet<string> = new Set(['chapter-book'])

/** Required steps of a day that are not done yet, in play order. */
export function missingRequiredSteps(day: number, stepsDone: readonly string[]): string[] {
  const finished = doneStepIds(day, stepsDone)
  return dayStepIds(day).filter((id) => !OPTIONAL_STEP_IDS.has(id) && !finished.has(id))
}

export type DayEvidence = {
  day: number
  /** A row in curriculum_day_completions. */
  recorded: boolean
  /** A valid reading test saved for this (test) day. */
  checkpointTest: boolean
  /** Steps marked done in curriculum_day_activity. */
  stepsDone: readonly string[]
}

/** Whether the learner finished this day, from everything the server knows. */
export function isDayFinished(e: DayEvidence): boolean {
  if (!Number.isInteger(e.day) || e.day < 1 || e.day > TOTAL_CURRICULUM_DAYS) return false
  if (e.recorded) return true
  if (CHECKPOINT_DAYS.has(e.day)) return e.checkpointTest
  return e.stepsDone.length > 0 && missingRequiredSteps(e.day, e.stepsDone).length === 0
}

/** Open = completed, or (access and (Day 1 or the previous day completed)). */
export function isDayUnlocked(day: number, completedDays: readonly number[], hasAccess: boolean): boolean {
  if (completedDays.includes(day)) return true
  if (!hasAccess) return false
  return day === 1 || completedDays.includes(day - 1)
}

/** The first day not yet completed (1–30), or null when all 30 are done. */
export function currentDay(completedDays: readonly number[]): number | null {
  for (let day = 1; day <= TOTAL_CURRICULUM_DAYS; day++) if (!completedDays.includes(day)) return day
  return null
}
