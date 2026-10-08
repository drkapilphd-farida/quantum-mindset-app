-- Rollback for 20261013000001_pace_control. Completions themselves are untouched.
DROP TABLE IF EXISTS public.curriculum_pace_settings;
DROP TABLE IF EXISTS public.curriculum_day_activity;
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20261013000001';
