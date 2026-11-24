'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { DAILY_RSVP_EXERCISE_ID, oneResultPerDay, suggestedWpm, type DailyRsvpDayResult } from './dailyRsvp'
import type { DailyRsvpLang } from './passages'

export type DailyRsvpState = {
  /** One result per plan day, first plays only (replays never change it), in this language. */
  history: readonly DailyRsvpDayResult[]
  /** Reading speed of the Day 1 reading test in this language, when there is one. */
  baselineWpm: number | null
  /** Today's starting speed for `day` (or after the latest day when `day` is null). */
  suggestedWpm: number
}

const EMPTY = (day: number | null): DailyRsvpState => ({ history: [], baselineWpm: null, suggestedWpm: suggestedWpm([], day, null) })

/**
 * The signed-in learner's Daily Speed Read results. WPM is compared only
 * within one language (as everywhere in the app), so results are read for
 * the language the learner is reading in now.
 */
export async function getDailyRsvpState(lang: DailyRsvpLang, day: number | null): Promise<DailyRsvpState> {
  const safeLang: DailyRsvpLang = lang === 'hi' ? 'hi' : 'en'
  const safeDay = typeof day === 'number' && Number.isInteger(day) && day >= 1 && day <= 30 ? day : null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return EMPTY(safeDay)

    const [{ data: rows, error }, { data: dayOne }] = await Promise.all([
      supabase
        .from('exercise_results')
        .select('curriculum_day, score, accuracy_percent, details, played_at')
        .eq('user_id', user.id)
        .eq('exercise_id', DAILY_RSVP_EXERCISE_ID)
        .eq('is_replay', false)
        .eq('content_lang', safeLang)
        .not('curriculum_day', 'is', null)
        .order('played_at', { ascending: true })
        .limit(200),
      supabase.from('curriculum_day_completions').select('raw_wpm, content_lang').eq('user_id', user.id).eq('day', 1).maybeSingle(),
    ])
    if (error) {
      logger.warn('getDailyRsvpState: read failed', { code: error.code })
      return EMPTY(safeDay)
    }
    const history = oneResultPerDay(
      (rows ?? []).map((r) => {
        const target = (r.details as { targetWpm?: unknown } | null)?.targetWpm
        return {
          day: r.curriculum_day as number,
          wpm: r.score,
          retentionPercent: r.accuracy_percent ?? 0,
          ...(typeof target === 'number' && target > 0 ? { targetWpm: target } : {}),
          playedAt: r.played_at,
        }
      }),
    )
    const baselineWpm = dayOne && (dayOne.content_lang ?? 'en') === safeLang && typeof dayOne.raw_wpm === 'number' && dayOne.raw_wpm > 0 ? dayOne.raw_wpm : null
    return { history, baselineWpm, suggestedWpm: suggestedWpm(history, safeDay, baselineWpm) }
  } catch (error) {
    logger.warn('getDailyRsvpState: unexpected error', { error })
    return EMPTY(safeDay)
  }
}
