'use server'

import { createClient } from '@/lib/supabase/server'
import { isAppLang, type AppLang } from '@/lib/app-i18n/languages'

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
export async function getCurriculumDayCompletions(): Promise<readonly CurriculumDayCompletionRecord[]> {
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

  return data.map((row) => ({
    day: row.day,
    rawWpm: row.raw_wpm,
    trueWpm: row.true_wpm,
    comprehensionAccuracyPercent: row.comprehension_accuracy_percent,
    completedAt: row.completed_at,
    contentLang: isAppLang(row.content_lang) ? row.content_lang : 'en',
  }))
}
