-- Rollback for 20261113000001_self_paced_and_recordings (drops only what it
-- added). Run the previous app deployment first: the new code reads these.
-- Self-paced buyers keep their access (subscriptions are not touched); they
-- would only lose the "self-paced" label and see the live-class pages again.
DROP TABLE IF EXISTS public.class_recordings;
DROP TABLE IF EXISTS public.unmatched_payments;
ALTER TABLE public.masterclass_payments DROP COLUMN IF EXISTS plan_type;
