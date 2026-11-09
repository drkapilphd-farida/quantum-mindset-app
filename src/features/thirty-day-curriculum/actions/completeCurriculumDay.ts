'use server'

import { createClient } from '@/lib/supabase/server'
import { getPracticeContentLang } from '@/lib/app-i18n/server'
import { getIsPaidUser } from '@/lib/subscription/getIsPaidUser'
import { logger } from '@/lib/logger'
import { createServiceClient } from '@/lib/supabase/service'
import { TOTAL_CURRICULUM_DAYS } from '../curriculumDatabase'
import { CHECKPOINT_DAYS, missingRequiredSteps } from '../dayRules'
import { getCurriculumDayCompletions } from './getCurriculumDayCompletions'

export type CompleteCurriculumDayInput = {
  day: number
  rawWpm?: number
  trueWpm?: number
  comprehensionAccuracyPercent?: number
  /** Language of the passage the checkpoint was read in (fair reading test: 'en' or 'hi'). Defaults to the practice-text language. */
  contentLang?: 'en' | 'hi'
}

export type CompleteCurriculumDayResult =
  | { ok: true; completedDays: readonly number[]; paced: boolean }
  | { ok: false; reason: 'unauthenticated' | 'invalid_day' | 'not_pro' | 'previous_day_incomplete' | 'db_error' }
  // A required step is still missing (dayRules.ts). The other two are no
  // longer returned (founder rule, 9 Nov 2026) and stay only for old clients.
  | { ok: false; reason: 'steps_incomplete'; missing: string[] }
  | { ok: false; reason: 'not_yet_open'; opensAt: string }
  | { ok: false; reason: 'needs_more_practice'; activeSeconds: number }

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

    // Same list every page reads (finished-but-unrecorded days included).
    const existingRows = await getCurriculumDayCompletions()
    const completedDaysBefore = existingRows.map((row) => row.day)
    const alreadyCompleted = completedDaysBefore.includes(input.day)

    // A completion is written once and never changed: replaying a completed
    // day is saved separately (recordCurriculumDayPractice), so the original
    // date, scores, Day 1 baseline and official Day 30 result stay intact.
    if (alreadyCompleted) return { ok: true, completedDays: completedDaysBefore, paced: false }

    const isPro = await getIsPaidUser(user.id)
    if (!isPro) return { ok: false, reason: 'not_pro' }

    if (input.day !== 1 && !completedDaysBefore.includes(input.day - 1)) {
      return { ok: false, reason: 'previous_day_incomplete' }
    }

    // Pace control: one new day per calendar day (midnight IST, only after a
    // day completed under pace control), all of the day's steps, and about
    // 10 minutes of active practice — all checked here, on the server.
    // The one rule (dayRules.ts): a test day is completed by its reading
    // test; any other day once its required steps are done. No minimum time,
    // no midnight wait, no batch or date.
    const { data: today } = await supabase.from('curriculum_day_activity').select('active_seconds, steps_done').eq('user_id', user.id).eq('day', input.day).maybeSingle()
    if (!CHECKPOINT_DAYS.has(input.day)) {
      const missing = missingRequiredSteps(input.day, today?.steps_done ?? [])
      if (missing.length > 0) return { ok: false, reason: 'steps_incomplete', missing }
    }
    const service = createServiceClient()

    const { error: writeError } = await supabase.from('curriculum_day_completions').insert({
      user_id: user.id,
      day: input.day,
      content_lang: input.contentLang === 'en' || input.contentLang === 'hi' ? input.contentLang : await getPracticeContentLang('reading'),
      raw_wpm: input.rawWpm ?? null,
      true_wpm: input.trueWpm ?? null,
      comprehension_accuracy_percent: input.comprehensionAccuracyPercent ?? null,
      completed_at: new Date().toISOString(),
    })

    // 23505: the same day was completed a moment ago in another tab — the
    // first completion stands.
    if (writeError && writeError.code !== '23505') {
      logger.error('completeCurriculumDay: failed to write completion', { error: writeError, userId: user.id, day: input.day })
      return { ok: false, reason: 'db_error' }
    }

    // Only a completion under pace control makes the next day wait for midnight.
    await service
      .from('curriculum_day_activity')
      .upsert({ user_id: user.id, day: input.day, paced: false, completed_active_seconds: today?.active_seconds ?? 0, updated_at: new Date().toISOString() }, { onConflict: 'user_id,day' })

    const completedDays = [...completedDaysBefore, input.day].sort((a, b) => a - b)
    return { ok: true, completedDays, paced: false }
  } catch (error) {
    logger.error('completeCurriculumDay: unexpected failure', { error, day: input.day })
    return { ok: false, reason: 'db_error' }
  }
}
