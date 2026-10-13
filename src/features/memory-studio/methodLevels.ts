import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

/** The learner's latest level per exercise (null = never played), for the Memory Studio cards. One query. */
export async function getMethodLevels(exerciseIds: readonly string[]): Promise<Record<string, number | null>> {
  const out: Record<string, number | null> = Object.fromEntries(exerciseIds.map((id) => [id, null]))
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return out
  const { data, error } = await supabase.from('exercise_results').select('exercise_id, level_end, played_at').eq('user_id', user.id).in('exercise_id', [...exerciseIds]).order('played_at', { ascending: false }).limit(500)
  if (error) {
    logger.warn('getMethodLevels: read failed', { code: error.code })
    return out
  }
  for (const row of data ?? []) if (out[row.exercise_id] === null) out[row.exercise_id] = row.level_end ?? 1
  return out
}
