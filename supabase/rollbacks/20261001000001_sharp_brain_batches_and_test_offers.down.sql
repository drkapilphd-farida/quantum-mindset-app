-- Rollback for 20261001000001_sharp_brain_batches_and_test_offers.
-- Drops the batch/offer columns from masterclass_payments (payments and
-- access grants themselves are untouched) and every stored test offer.
DROP INDEX IF EXISTS public.masterclass_payments_batch_start_idx;
ALTER TABLE public.masterclass_payments
  DROP COLUMN IF EXISTS sharp_brain_offer_id,
  DROP COLUMN IF EXISTS payment_link_id,
  DROP COLUMN IF EXISTS batch_start,
  DROP COLUMN IF EXISTS offer,
  DROP COLUMN IF EXISTS customer_name;
DROP TABLE IF EXISTS public.sharp_brain_offers;
