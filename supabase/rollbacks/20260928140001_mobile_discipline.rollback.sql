-- Rollback for 20260928140001_mobile_discipline.sql
-- Export screen_time_goals, focus_sessions and the screen-goal rows of
-- digital_detox_checkins first (~/MindUrMind-db-backups/). Existing
-- 'phone_away' check-ins (21-day journey) are kept.

DROP INDEX IF EXISTS public.digital_detox_checkins_screen_goal_daily_idx;
DELETE FROM public.digital_detox_checkins WHERE kind = 'screen_goal';
ALTER TABLE public.digital_detox_checkins
  DROP COLUMN IF EXISTS check_date,
  DROP COLUMN IF EXISTS within_goal,
  DROP COLUMN IF EXISTS kind;

DROP TABLE IF EXISTS public.focus_sessions;
DROP TABLE IF EXISTS public.screen_time_goals;

DELETE FROM supabase_migrations.schema_migrations WHERE version = '20260928140001';
