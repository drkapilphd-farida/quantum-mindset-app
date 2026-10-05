'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getPracticeContentLang } from '@/lib/app-i18n/server'
import { getIsPaidUser } from '@/lib/subscription/getIsPaidUser'
import { logger } from '@/lib/logger'
import { TOTAL_CURRICULUM_DAYS } from '../curriculumDatabase'

// Practising a completed day again ("Practised again"). Saved only in
// curriculum_day_practice_attempts — never in curriculum_day_completions —
// so a replay can't change the original completion, progress, streak,
// unlocks, the Day 1 baseline, the official Day 30 result or certificate
// eligibility. Only enrolled learners, and only for days they have
// completed; both are checked here on the server.

const PracticeInputSchema = z
  .object({
    day: z.number().int().min(1).max(TOTAL_CURRICULUM_DAYS),
    rawWpm: z.number().int().min(0).max(5000).optional(),
    trueWpm: z.number().int().min(0).max(5000).optional(),
    comprehensionAccuracyPercent: z.number().int().min(0).max(100).optional(),
  })
  .strict()

export type CurriculumDayPracticeInput = z.infer<typeof PracticeInputSchema>

export type CurriculumDayPracticeAttempt = {
  day: number
  practisedAt: string
  trueWpm: number | null
  comprehensionAccuracyPercent: number | null
  /** How many times this day has been practised again. */
  count: number
}

export type RecordCurriculumDayPracticeResult =
  | { ok: true; attempt: CurriculumDayPracticeAttempt }
  | { ok: false; reason: 'invalid_input' | 'unauthenticated' | 'not_pro' | 'day_not_completed' | 'db_error' }

export async function recordCurriculumDayPractice(input: unknown): Promise<RecordCurriculumDayPracticeResult> {
  const parsed = PracticeInputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, reason: 'invalid_input' }
  const { day, rawWpm, trueWpm, comprehensionAccuracyPercent } = parsed.data

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { ok: false, reason: 'unauthenticated' }

    if (!(await getIsPaidUser(user.id))) return { ok: false, reason: 'not_pro' }

    const { data: completion, error: readError } = await supabase
      .from('curriculum_day_completions')
      .select('day')
      .eq('user_id', user.id)
      .eq('day', day)
      .maybeSingle()
    if (readError) {
      logger.error('recordCurriculumDayPractice: failed to read completion', { error: readError, userId: user.id, day })
      return { ok: false, reason: 'db_error' }
    }
    if (completion === null) return { ok: false, reason: 'day_not_completed' }

    const { error: writeError } = await supabase.from('curriculum_day_practice_attempts').insert({
      user_id: user.id,
      day,
      raw_wpm: rawWpm ?? null,
      true_wpm: trueWpm ?? null,
      comprehension_accuracy_percent: comprehensionAccuracyPercent ?? null,
      content_lang: await getPracticeContentLang('reading'),
    })
    if (writeError) {
      logger.error('recordCurriculumDayPractice: failed to save practice', { error: writeError, userId: user.id, day })
      return { ok: false, reason: 'db_error' }
    }

    const latest = await getCurriculumDayPractice(day)
    if (latest === null) return { ok: false, reason: 'db_error' }
    return { ok: true, attempt: latest }
  } catch (error) {
    logger.error('recordCurriculumDayPractice: unexpected failure', { error, day })
    return { ok: false, reason: 'db_error' }
  }
}

/** The learner's latest practice of a day, with how many times they've practised it. */
export async function getCurriculumDayPractice(day: unknown): Promise<CurriculumDayPracticeAttempt | null> {
  const parsedDay = z.number().int().min(1).max(TOTAL_CURRICULUM_DAYS).safeParse(day)
  if (!parsedDay.success) return null

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, count, error } = await supabase
      .from('curriculum_day_practice_attempts')
      .select('day, practised_at, true_wpm, comprehension_accuracy_percent', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('day', parsedDay.data)
      .order('practised_at', { ascending: false })
      .limit(1)
    if (error) {
      logger.error('getCurriculumDayPractice: failed to read practice', { error, userId: user.id, day: parsedDay.data })
      return null
    }
    const row = data?.[0]
    if (row === undefined) return null
    return {
      day: row.day,
      practisedAt: row.practised_at,
      trueWpm: row.true_wpm,
      comprehensionAccuracyPercent: row.comprehension_accuracy_percent,
      count: count ?? 1,
    }
  } catch (error) {
    logger.error('getCurriculumDayPractice: unexpected failure', { error })
    return null
  }
}
