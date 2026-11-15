-- Rollback for 20261115000001_school_leads. Deletes every school lead and the
-- page settings: export /admin/school-leads (CSV) first. Files in the
-- school-media bucket must be removed (Storage → school-media) before the
-- bucket row can go.
DROP TABLE IF EXISTS public.school_leads;
DROP TABLE IF EXISTS public.school_page_settings;
DELETE FROM storage.buckets WHERE id = 'school-media';
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20261115000001';
