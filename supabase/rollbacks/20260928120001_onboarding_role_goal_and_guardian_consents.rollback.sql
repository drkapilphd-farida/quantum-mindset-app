-- Rollback for 20260928120001_onboarding_role_goal_and_guardian_consents.sql
-- Export public.guardian_consents and the three profile columns first
-- (~/MindUrMind-db-backups/) — this removes the onboarding answers and
-- consent records. No other data is affected.

DROP TABLE IF EXISTS public.guardian_consents;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS onboarding_seen_at,
  DROP COLUMN IF EXISTS learning_focus,
  DROP COLUMN IF EXISTS learner_role;

DELETE FROM supabase_migrations.schema_migrations WHERE version = '20260928120001';
