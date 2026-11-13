-- Rollback for 20261114000001_brain_unlock.
-- Brain Unlock lead rows must be removed (or re-labelled) before the old
-- test_kind CHECK can be restored.
DROP TABLE IF EXISTS public.whatsapp_opt_outs;
DROP TABLE IF EXISTS public.brain_unlock_followups;
DROP TABLE IF EXISTS public.brain_unlock_settings;
DROP TABLE IF EXISTS public.brain_unlock_events;

DROP INDEX IF EXISTS public.speed_test_results_session_idx;
ALTER TABLE public.speed_test_results
  DROP COLUMN IF EXISTS session_id,
  DROP COLUMN IF EXISTS details,
  DROP COLUMN IF EXISTS duo,
  DROP COLUMN IF EXISTS unlock_score,
  DROP COLUMN IF EXISTS brain_type,
  DROP COLUMN IF EXISTS class_band,
  DROP COLUMN IF EXISTS role,
  DROP COLUMN IF EXISTS email;

DELETE FROM public.speed_test_results WHERE test_kind = 'brain_unlock';
ALTER TABLE public.speed_test_results DROP CONSTRAINT IF EXISTS speed_test_results_test_kind_check;
ALTER TABLE public.speed_test_results
  ADD CONSTRAINT speed_test_results_test_kind_check CHECK (test_kind IN ('speed', 'reading_memory'));
