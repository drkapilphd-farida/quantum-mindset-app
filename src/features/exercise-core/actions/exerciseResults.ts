'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { APP_LANGS } from '@/lib/app-i18n/languages'
import { MAX_LEVEL, MIN_LEVEL, normaliseLevelState, type LevelState } from '../levelEngine'

// Server-saved exercise scores (table exercise_results). One row per
// finished session. The learner's current level and run come from their
// latest row; the personal best is their highest score. Not signed in →
// nothing is saved and the exercise keeps its own on-device copy instead.

const ExerciseIdSchema = z.string().regex(/^[a-z0-9-]{1,80}$/)

const SaveExerciseResultSchema = z
  .object({
    exerciseId: ExerciseIdSchema,
    score: z.number().int().min(0).max(1_000_000),
    accuracyPercent: z.number().int().min(0).max(100).nullable(),
    levelStart: z.number().int().min(MIN_LEVEL).max(MAX_LEVEL).nullable(),
    levelEnd: z.number().int().min(MIN_LEVEL).max(MAX_LEVEL).nullable(),
    goodRun: z.number().int().min(0).max(10),
    poorRun: z.number().int().min(0).max(10),
    rounds: z.number().int().min(0).max(100).nullable(),
    durationMs: z.number().int().min(0).max(86_400_000).nullable(),
    curriculumDay: z.number().int().min(1).max(30).nullable(),
    isReplay: z.boolean(),
    contentLang: z.enum(APP_LANGS).nullable(),
    /** Small, exercise-specific numbers (e.g. wpm, reaction time). */
    extra: z.record(z.string().max(40), z.union([z.number(), z.string().max(80), z.boolean()])).optional(),
  })
  .strict()

export type SaveExerciseResultInput = z.infer<typeof SaveExerciseResultSchema>

export type ExerciseStats = {
  levelState: LevelState
  bestScore: number
  plays: number
  lastPlayedAt: string | null
}

export type SaveExerciseResultResponse = { ok: true; stats: ExerciseStats } | { ok: false; reason: 'invalid_input' | 'unauthenticated' | 'db_error' }

export async function saveExerciseResult(input: unknown): Promise<SaveExerciseResultResponse> {
  const parsed = SaveExerciseResultSchema.safeParse(input)
  if (!parsed.success) {
    logger.warn('saveExerciseResult: invalid input', { issues: parsed.error.issues.map((i) => i.path.join('.')) })
    return { ok: false, reason: 'invalid_input' }
  }
  const r = parsed.data
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { ok: false, reason: 'unauthenticated' }

    const { error } = await supabase.from('exercise_results').insert({
      user_id: user.id,
      exercise_id: r.exerciseId,
      score: r.score,
      accuracy_percent: r.accuracyPercent,
      level_start: r.levelStart,
      level_end: r.levelEnd,
      rounds: r.rounds,
      duration_ms: r.durationMs,
      curriculum_day: r.curriculumDay,
      is_replay: r.isReplay,
      content_lang: r.contentLang,
      details: { goodRun: r.goodRun, poorRun: r.poorRun, ...(r.extra ?? {}) },
    })
    if (error) {
      logger.error('saveExerciseResult: insert failed', { code: error.code, exerciseId: r.exerciseId })
      return { ok: false, reason: 'db_error' }
    }
    const stats = await getExerciseStats(r.exerciseId)
    return stats === null ? { ok: false, reason: 'db_error' } : { ok: true, stats }
  } catch (error) {
    logger.error('saveExerciseResult: unexpected error', { error, exerciseId: r.exerciseId })
    return { ok: false, reason: 'db_error' }
  }
}

/** The signed-in learner's level, run and best for one exercise; null when signed out or on error. */
export async function getExerciseStats(exerciseId: unknown): Promise<ExerciseStats | null> {
  const parsed = ExerciseIdSchema.safeParse(exerciseId)
  if (!parsed.success) return null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const columns = 'score, level_end, details, played_at'
    const [latest, best, count] = await Promise.all([
      supabase.from('exercise_results').select(columns).eq('user_id', user.id).eq('exercise_id', parsed.data).order('played_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('exercise_results').select(columns).eq('user_id', user.id).eq('exercise_id', parsed.data).order('score', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('exercise_results').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('exercise_id', parsed.data),
    ])
    if (latest.error || best.error || count.error) {
      logger.warn('getExerciseStats: read failed', { exerciseId: parsed.data, code: latest.error?.code ?? best.error?.code ?? count.error?.code })
      return null
    }
    const details = (latest.data?.details ?? {}) as Record<string, unknown>
    return {
      levelState: normaliseLevelState({ level: latest.data?.level_end ?? MIN_LEVEL, goodRun: details.goodRun, poorRun: details.poorRun }),
      bestScore: best.data?.score ?? 0,
      plays: count.count ?? 0,
      lastPlayedAt: latest.data?.played_at ?? null,
    }
  } catch (error) {
    logger.warn('getExerciseStats: unexpected error', { error, exerciseId: parsed.data })
    return null
  }
}
