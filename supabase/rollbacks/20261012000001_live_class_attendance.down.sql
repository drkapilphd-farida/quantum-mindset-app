-- Rollback for 20261012000001_live_class_attendance.
-- WARNING: deletes every class session, registration and attendance mark.
DROP TABLE IF EXISTS public.live_class_attendance;
DROP TABLE IF EXISTS public.live_class_registrations;
DROP TABLE IF EXISTS public.live_class_sessions;
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20261012000001';
