-- Rollback for 20261109000001_progress_transfers (drops only what it added;
-- rows already copied to a learner's new account stay).
DROP FUNCTION IF EXISTS public.transfer_learner_progress(uuid, uuid, text, text, text);
DROP TABLE IF EXISTS public.progress_transfers;
