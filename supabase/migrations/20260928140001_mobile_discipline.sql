-- Phase 8, Item 12 — Mobile Discipline module.
--
-- Self-reported only: the app never blocks the device or reads other apps.
-- 1. screen_time_goals: one self-set daily screen-time goal per user.
-- 2. focus_sessions: completed focus-timer sessions (10 / 15 / 25 min).
--    Only finished sessions are logged; the server checks the elapsed time.
-- 3. digital_detox_checkins (existing, used by the 21-day journey): two new
--    columns for the daily "Did you stay within your screen-time goal
--    today?" check-in. Existing rows keep kind = 'phone_away' and are not
--    otherwise touched. One screen-goal check-in per user per (IST) day.
-- Rollback: supabase/rollbacks/20260928140001_mobile_discipline.rollback.sql

CREATE TABLE public.screen_time_goals (
  user_id              uuid        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  daily_limit_minutes  integer     NOT NULL CHECK (daily_limit_minutes BETWEEN 15 AND 720),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.screen_time_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "screen_time_goals_select_own" ON public.screen_time_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "screen_time_goals_insert_own" ON public.screen_time_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "screen_time_goals_update_own" ON public.screen_time_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.focus_sessions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  planned_minutes  integer     NOT NULL CHECK (planned_minutes IN (10, 15, 25)),
  started_at       timestamptz NOT NULL,
  completed_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (completed_at > started_at)
);

CREATE INDEX focus_sessions_user_completed_idx ON public.focus_sessions (user_id, completed_at DESC);

ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "focus_sessions_select_own" ON public.focus_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "focus_sessions_insert_own" ON public.focus_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.digital_detox_checkins
  ADD COLUMN kind text NOT NULL DEFAULT 'phone_away' CHECK (kind IN ('phone_away', 'screen_goal')),
  ADD COLUMN within_goal boolean,
  ADD COLUMN check_date date;

-- One screen-goal check-in per user per day (IST date, set by the server).
-- Partial, so existing 'phone_away' rows are never affected.
CREATE UNIQUE INDEX digital_detox_checkins_screen_goal_daily_idx
  ON public.digital_detox_checkins (user_id, check_date)
  WHERE kind = 'screen_goal';
