'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurriculumDayCompletions } from './getCurriculumDayCompletions'
import { computeSkillBars, type SkillBar } from '../skillProgress'

/** The signed-in learner's 4 skill bars (Focus, Memory, Reading, Retention): first practice → now. */
export async function getSkillProgress(): Promise<readonly SkillBar[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return computeSkillBars([], [])
  const [{ data }, completions] = await Promise.all([
    supabase.from('exercise_results').select('exercise_id, accuracy_percent, played_at').eq('user_id', user.id).order('played_at', { ascending: true }).limit(2000),
    getCurriculumDayCompletions(),
  ])
  return computeSkillBars(
    (data ?? []).map((r) => ({ exerciseId: r.exercise_id, accuracyPercent: r.accuracy_percent, playedAt: r.played_at })),
    completions.map((c) => ({ trueWpm: c.trueWpm, completedAt: c.completedAt, contentLang: c.contentLang })),
  )
}
