-- Rollback of 20261017000002_manual_access_fix (profile emails that were filled in are kept).
DROP INDEX IF EXISTS public.masterclass_payments_one_active_manual;
DROP FUNCTION IF EXISTS public.claim_pending_access(uuid);
DROP FUNCTION IF EXISTS public.user_id_by_email(text);
