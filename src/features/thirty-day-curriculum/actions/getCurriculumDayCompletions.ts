'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { isAppLang, type AppLang } from '@/lib/app-i18n/languages'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { TOTAL_CURRICULUM_DAYS } from '../curriculumDatabase'
import { isDayFinished } from '../dayRules'

export type CurriculumDayCompletionRecord = {
  day: number
  rawWpm: number | null
  trueWpm: number | null
  comprehensionAccuracyPercent: number | null
  completedAt: string
  /** Language of the practice text that was read (WPM is only comparable within one language). */
  contentLang: AppLang
}

// Two-Pillar Simplification™ — real, server-side completions for the
// signed-in account's own 30-Day Masterclass, written by
// completeCurriculumDay.ts. Powers the Parents Dashboard's "Daily
// Curriculum Progress" and "Session History" — ordered most-recent-first,
// matching every other session-history list in this app.
/** The signed-in learner's completed days. Fetched once per request (several parts of a page ask). */
export async function getCurriculumDayCompletions(): Promise<readonly CurriculumDayCompletionRecord[]> {
  return completionsForRequest()
}

const completionsForRequest = cache(async (): Promise<readonly CurriculumDayCompletionRecord[]> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('curriculum_day_completions')
    .select('day, raw_wpm, true_wpm, comprehension_accuracy_percent, completed_at, content_lang')
    .eq('user_id', user.id)
    .order('day', { ascending: false })

  if (!data) return []

  const recorded = data.map((row) => ({
    day: row.day,
    rawWpm: row.raw_wpm,
    trueWpm: row.true_wpm,
    comprehensionAccuracyPercent: row.comprehension_accuracy_percent,
    completedAt: row.completed_at,
    contentLang: isAppLang(row.content_lang) ? row.content_lang : ('en' as AppLang),
  }))
  const healed = await recordFinishedDays(user.id, supabase, recorded)
  return [...recorded, ...healed].sort((a, b) => b.day - a.day)
})

type Db = Awaited<ReturnType<typeof createClient>>

/**
 * Never leave a learner stuck (founder rule, 9 Nov 2026): a day the server
 * can see was finished — its reading test is saved (test days), or every
 * required step is done — but that was never recorded, is recorded now.
 * Old pace rules (10-minute minimum, midnight wait) refused such days while
 * the phone showed them as completed.
 */
async function recordFinishedDays(userId: string, supabase: Db, recorded: readonly CurriculumDayCompletionRecord[]): Promise<CurriculumDayCompletionRecord[]> {
  const have = new Set(recorded.map((r) => r.day))
  if (have.size >= TOTAL_CURRICULUM_DAYS) return []
  const [{ data: tests }, { data: activity }] = await Promise.all([
    supabase.from('reading_tests').select('curriculum_day, wpm, effective_wpm, comprehension_percent, lang, created_at').eq('user_id', userId).not('curriculum_day', 'is', null).order('created_at', { ascending: true }),
    supabase.from('curriculum_day_activity').select('day, steps_done, updated_at').eq('user_id', userId),
  ])
  const found: CurriculumDayCompletionRecord[] = []
  for (let day = 1; day <= TOTAL_CURRICULUM_DAYS; day++) {
    if (have.has(day)) continue
    // Never a day the learner didn't earn: the day before must be finished
    // too (recorded, or recorded just now in this pass) — days go in order.
    if (day > 1 && !have.has(day - 1)) continue
    const test = (tests ?? []).find((t) => t.curriculum_day === day)
    const act = (activity ?? []).find((a) => a.day === day)
    if (!isDayFinished({ day, recorded: false, checkpointTest: test !== undefined, stepsDone: act?.steps_done ?? [] })) continue
    have.add(day)
    found.push({
      day,
      rawWpm: test?.wpm ?? null,
      trueWpm: test?.effective_wpm ?? null,
      comprehensionAccuracyPercent: test?.comprehension_percent ?? null,
      completedAt: test?.created_at ?? act?.updated_at ?? new Date().toISOString(),
      contentLang: test && isAppLang(test.lang) ? test.lang : 'en',
    })
  }
  if (found.length === 0) return []
  const { error } = await createServiceClient()
    .from('curriculum_day_completions')
    .upsert(
      found.map((f) => ({ user_id: userId, day: f.day, raw_wpm: f.rawWpm, true_wpm: f.trueWpm, comprehension_accuracy_percent: f.comprehensionAccuracyPercent, completed_at: f.completedAt, content_lang: f.contentLang })),
      { onConflict: 'user_id,day', ignoreDuplicates: true },
    )
  if (error) logger.error('recordFinishedDays: write failed (days still count for this visit)', { code: error.code })
  else logger.info('recordFinishedDays: recorded finished days', { count: found.length })
  return found
}
