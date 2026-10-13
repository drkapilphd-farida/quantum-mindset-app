-- Rollback of 20261017000001_manual_enrolments. Manual rows are kept as
-- payments (their access stays); only the extra columns are dropped.
ALTER TABLE public.masterclass_payments
  DROP CONSTRAINT IF EXISTS masterclass_payments_manual_fields,
  DROP COLUMN IF EXISTS note,
  DROP COLUMN IF EXISTS refunded_at,
  DROP COLUMN IF EXISTS recorded_by,
  DROP COLUMN IF EXISTS paid_on,
  DROP COLUMN IF EXISTS payment_mode,
  DROP COLUMN IF EXISTS source;
