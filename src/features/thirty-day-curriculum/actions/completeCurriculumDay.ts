'use server'

import { createClient } from '@/lib/supabase/server'
import { getPracticeContentLang } from '@/lib/app-i18n/server'
import { getIsPaidUser } from '@/lib/subscription/getIsPaidUser'
import { logger } from '@/lib/logger'
import { createServiceClient } from '@/lib/supabase/service'
import { TOTAL_CURRICULUM_DAYS } from '../curriculumDatabase'
import { paceVerdict } from '../paceControl'

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
  // Pace control (Phase 3, item 4): the day isn't open yet, a step is
  // missing, or there's been less than about 10 minutes of practice.
  | { ok: false; reason: 'not_yet_open'; opensAt: string }
  | { ok: false; reason: 'steps_incomplete'; missing: string[] }
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

    const { data: existingRows, error: readError } = await supabase
      .from('curriculum_day_completions')
      .select('day, completed_at')
      .eq('user_id', user.id)

    if (readError) {
      logger.error('completeCurriculumDay: failed to read existing completions', { error: readError, userId: user.id })
      return { ok: false, reason: 'db_error' }
    }

    const completedDaysBefore = (existingRows ?? []).map((row) => row.day)
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
    const [{ data: activityRows }, { data: paceSetting }] = await Promise.all([
      supabase.from('curriculum_day_activity').select('day, active_seconds, steps_done, paced, short_attempts').eq('user_id', user.id).in('day', [input.day, input.day - 1]),
      supabase.from('curriculum_pace_settings').select('pace_off').eq('user_id', user.id).maybeSingle(),
    ])
    const paceOff = paceSetting?.pace_off === true
    const today = (activityRows ?? []).find((r) => r.day === input.day)
    const previousActivity = (activityRows ?? []).find((r) => r.day === input.day - 1)
    const previousCompletion = (existingRows ?? []).find((row) => row.day === input.day - 1)
    const verdict = paceVerdict({
      day: input.day,
      paceOff,
      prev: previousCompletion ? { completedAt: previousCompletion.completed_at, paced: previousActivity?.paced === true } : null,
      activeSeconds: today?.active_seconds ?? 0,
      stepsDone: today?.steps_done ?? [],
      nowMs: Date.now(),
    })
    const service = createServiceClient()
    if (!verdict.ok) {
      if (verdict.reason === 'needs_more_practice') {
        // Counted for the founder's two-week report ("a few more minutes" shown).
        await service
          .from('curriculum_day_activity')
          .upsert({ user_id: user.id, day: input.day, short_attempts: (today?.short_attempts ?? 0) + 1, updated_at: new Date().toISOString() }, { onConflict: 'user_id,day' })
      }
      return verdict
    }

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
      .upsert({ user_id: user.id, day: input.day, paced: !paceOff, completed_active_seconds: today?.active_seconds ?? 0, updated_at: new Date().toISOString() }, { onConflict: 'user_id,day' })

    const completedDays = [...completedDaysBefore, input.day].sort((a, b) => a - b)
    return { ok: true, completedDays, paced: !paceOff }
  } catch (error) {
    logger.error('completeCurriculumDay: unexpected failure', { error, day: input.day })
    return { ok: false, reason: 'db_error' }
  }
}
