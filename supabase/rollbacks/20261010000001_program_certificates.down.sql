-- Rollback for 20261010000001_program_certificates.
-- WARNING: deletes every issued certificate. Remove the bucket's files first
-- (Storage → certificate-assets) or the bucket delete fails.
DELETE FROM storage.buckets WHERE id = 'certificate-assets';
DROP TABLE IF EXISTS public.program_certificates;
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20261010000001';
