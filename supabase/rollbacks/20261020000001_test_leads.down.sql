-- Rollback for 20261020000001_test_leads (drops only the columns it added).
DROP INDEX IF EXISTS public.speed_test_results_lead_status_idx;
ALTER TABLE public.speed_test_results
  DROP COLUMN IF EXISTS memory_correct,
  DROP COLUMN IF EXISTS retention_correct,
  DROP COLUMN IF EXISTS test_kind,
  DROP COLUMN IF EXISTS lead_status_updated_at,
  DROP COLUMN IF EXISTS lead_status;
