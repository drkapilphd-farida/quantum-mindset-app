'use server'

import { createClient } from '@/lib/supabase/server'
import { getIsPaidUser } from '@/lib/subscription/getIsPaidUser'
import { logger } from '@/lib/logger'
import { TOTAL_CURRICULUM_DAYS } from '../curriculumDatabase'

export type CompleteCurriculumDayInput = {
  day: number
  rawWpm?: number
  trueWpm?: number
  comprehensionAccuracyPercent?: number
}

export type CompleteCurriculumDayResult =
  | { ok: true; completedDays: readonly number[] }
  | { ok: false; reason: 'unauthenticated' | 'invalid_day' | 'not_pro' | 'previous_day_incomplete' | 'db_error' }

// The one real write path into `curriculum_day_completions` (see the
// "Pre-Launch Audit Fix Pass" task, Phase 4) — replaces the old
// syncCurriculumDayCompletion.ts, which upserted whatever `day` the
// client sent with zero server-side validation, purely as a
// non-authoritative mirror for the Parents Dashboard. The real gate
// (isCurriculumDayUnlocked) has always lived entirely in the browser's
// own localStorage, so tampering with it directly (or calling that old
// action by hand with an arbitrary day) could unlock any day, including
// 30, with no payment and no real progress at all.
//
// This function re-derives the exact same rules isCurriculumDayUnlocked
// enforces — real Pro access, and day N only after day N-1 is already
// recorded complete — directly against this table, server-side, before
// ever persisting a completion. A day that's already recorded complete
// (a legitimate re-practice) always succeeds and re-upserts its stats,
// skipping re-validation entirely — matching curriculumProgress.ts's own
// "permanent, re-practiceable" rule; it never re-checks Pro status or
// sequence for a day already earned.
export async function completeCurriculumDay(input: CompleteCurriculumDayInput): Promise<CompleteCurriculumDayResult> {
  if (!Number.isInteger(input.day) || input.day < 1 || input.day > TOTAL_CURRICULUM_DAYS) {
    return { ok: false, reason: 'invalid_day' }
  }

  // Two of this action's three real call sites (DayMasterPlayer.tsx,
  // curriculumReturnRouting.ts) fire this without awaiting, the same
  // "must never block real progress" posture the old mirror action had
  // — so any unexpected throw here (a missing Supabase env in a test
  // environment, a dropped connection before a query even starts) must
  // never surface as an unhandled rejection.
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { ok: false, reason: 'unauthenticated' }

    const { data: existingRows, error: readError } = await supabase
      .from('curriculum_day_completions')
      .select('day')
      .eq('user_id', user.id)

    if (readError) {
      logger.error('completeCurriculumDay: failed to read existing completions', { error: readError, userId: user.id })
      return { ok: false, reason: 'db_error' }
    }

    const completedDaysBefore = (existingRows ?? []).map((row) => row.day)
    const alreadyCompleted = completedDaysBefore.includes(input.day)

    if (!alreadyCompleted) {
      const isPro = await getIsPaidUser(user.id)
      if (!isPro) return { ok: false, reason: 'not_pro' }

      if (input.day !== 1 && !completedDaysBefore.includes(input.day - 1)) {
        return { ok: false, reason: 'previous_day_incomplete' }
      }
    }

    const { error: writeError } = await supabase.from('curriculum_day_completions').upsert(
      {
        user_id: user.id,
        day: input.day,
        raw_wpm: input.rawWpm ?? null,
        true_wpm: input.trueWpm ?? null,
        comprehension_accuracy_percent: input.comprehensionAccuracyPercent ?? null,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,day' },
    )

    if (writeError) {
      logger.error('completeCurriculumDay: failed to write completion', { error: writeError, userId: user.id, day: input.day })
      return { ok: false, reason: 'db_error' }
    }

    const completedDays = alreadyCompleted ? completedDaysBefore : [...completedDaysBefore, input.day].sort((a, b) => a - b)
    return { ok: true, completedDays }
  } catch (error) {
    logger.error('completeCurriculumDay: unexpected failure', { error, day: input.day })
    return { ok: false, reason: 'db_error' }
  }
}
