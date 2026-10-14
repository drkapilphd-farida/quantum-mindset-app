'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * The learner's latest measured reading speed with understanding: the last
 * fair reading test (effective WPM), else the last day completion's true WPM.
 * null when nothing has been measured yet.
 */
export async function getMeasuredWpm(): Promise<number | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const [{ data: test }, { data: day }] = await Promise.all([
    supabase.from('reading_tests').select('effective_wpm').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('curriculum_day_completions').select('true_wpm').eq('user_id', user.id).not('true_wpm', 'is', null).order('completed_at', { ascending: false }).limit(1).maybeSingle(),
  ])
  const wpm = test?.effective_wpm ?? day?.true_wpm ?? null
  return typeof wpm === 'number' && wpm > 0 ? Math.round(wpm) : null
}
