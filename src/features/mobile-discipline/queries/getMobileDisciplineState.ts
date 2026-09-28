import { createClient } from '@/lib/supabase/server'
import { computeGoalStreak, istDate, weeklySummary, type WeeklySummary } from '../mobileDiscipline'

export type MobileDisciplineState = {
  dailyLimitMinutes: number | null
  todayCheckin: boolean | null
  streak: number
  week: WeeklySummary
}

export async function getMobileDisciplineState(userId: string, now: Date = new Date()): Promise<MobileDisciplineState> {
  const supabase = await createClient()
  const today = istDate(now)
  const since = new Date(now.getTime() - 60 * 86_400_000).toISOString()
  const [goal, checkins, sessions] = await Promise.all([
    supabase.from('screen_time_goals').select('daily_limit_minutes').eq('user_id', userId).maybeSingle(),
    supabase
      .from('digital_detox_checkins')
      .select('check_date, within_goal')
      .eq('user_id', userId)
      .eq('kind', 'screen_goal')
      .gte('occurred_at', since)
      .order('occurred_at', { ascending: false }),
    supabase.from('focus_sessions').select('planned_minutes, completed_at').eq('user_id', userId).gte('completed_at', since),
  ])

  const goalCheckins = (checkins.data ?? [])
    .filter((row): row is { check_date: string; within_goal: boolean } => row.check_date !== null && row.within_goal !== null)
    .map((row) => ({ date: row.check_date, withinGoal: row.within_goal }))
  const focus = (sessions.data ?? []).map((row) => ({ plannedMinutes: row.planned_minutes, completedAt: row.completed_at }))

  return {
    dailyLimitMinutes: goal.data?.daily_limit_minutes ?? null,
    todayCheckin: goalCheckins.find((c) => c.date === today)?.withinGoal ?? null,
    streak: computeGoalStreak(goalCheckins, today),
    week: weeklySummary(focus, goalCheckins, today),
  }
}
