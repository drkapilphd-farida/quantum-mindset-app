-- Rollback for 20261014000001_reminders.
DROP TABLE IF EXISTS public.reminder_log;
DROP TABLE IF EXISTS public.push_subscriptions;
DROP TABLE IF EXISTS public.reminder_settings;
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20261014000001';
