-- ─────────────────────────────────────────────────────────────────────────────
-- 20261020000001_test_leads
--
-- Free test leads: a follow-up status for the founder's "Test Leads" admin
-- page (new → contacted → enrolled), and room for the Reading & Memory
-- Test's own scores (retention X of 4, memory X of 8). All additions are
-- optional or defaulted; existing rows stay as they are (status 'new').
-- Writes stay server-only (service role); no learner-facing access changes.
--
-- Rollback: supabase/rollbacks/20261020000001_test_leads.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.speed_test_results
  ADD COLUMN lead_status text NOT NULL DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'enrolled')),
  ADD COLUMN lead_status_updated_at timestamptz,
  ADD COLUMN test_kind text NOT NULL DEFAULT 'speed' CHECK (test_kind IN ('speed', 'reading_memory')),
  ADD COLUMN retention_correct smallint CHECK (retention_correct IS NULL OR retention_correct BETWEEN 0 AND 4),
  ADD COLUMN memory_correct smallint CHECK (memory_correct IS NULL OR memory_correct BETWEEN 0 AND 8);

CREATE INDEX speed_test_results_lead_status_idx ON public.speed_test_results (lead_status, created_at DESC);
