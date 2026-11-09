import { createClient } from '@/lib/supabase/server'
import { getIsPaidUser } from '@/lib/subscription/getIsPaidUser'
import { TOTAL_CURRICULUM_DAYS } from './curriculumDatabase'
import { isDayUnlocked } from './dayRules'
import { dayStepIds } from './paceControl'
import { getCurriculumDayCompletions } from './actions/getCurriculumDayCompletions'

// Founder rule (9 Nov 2026): inside the 30-day plan, the plan's own order is
// the only order. Some steps (Days 22–30) open an exercise on its own page,
// and those pages also had a module order (Phrase → Multi-Line → …,
// Word Flash → Number Flash → …) that locked Day 23+ until the module's
// previous exercise was fully completed. An exercise that is a step of a
// plan day the learner has open skips that module order. Paid access is
// still checked separately by every page and on every save.

/** The plan days that have this exercise as a step. */
export function planDaysWithStep(exerciseId: string): number[] {
  const days: number[] = []
  for (let day = 1; day <= TOTAL_CURRICULUM_DAYS; day++) if (dayStepIds(day).includes(exerciseId)) days.push(day)
  return days
}

/** Pure rule: open when any plan day containing the exercise is open. */
export function exerciseOpenInPlan(exerciseId: string, completedDays: readonly number[], hasAccess: boolean): boolean {
  return planDaysWithStep(exerciseId).some((day) => isDayUnlocked(day, completedDays, hasAccess))
}

/** For the signed-in learner (server only). */
export async function isExerciseOpenInPlan(exerciseId: string): Promise<boolean> {
  if (planDaysWithStep(exerciseId).length === 0) return false
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const [completions, hasAccess] = await Promise.all([getCurriculumDayCompletions(), getIsPaidUser(user.id)])
  return exerciseOpenInPlan(exerciseId, completions.map((c) => c.day), hasAccess)
}
