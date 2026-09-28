-- Rollback for 20260928130001_create_program_assessments.sql
-- Export public.program_assessments first (~/MindUrMind-db-backups/) —
-- this removes all Day 1 / Day 30 assessment results. Nothing else changes.

DROP TABLE IF EXISTS public.program_assessments;

DELETE FROM supabase_migrations.schema_migrations WHERE version = '20260928130001';
