-- Rollback for 20261104000001_sharp_brain_parent_offers. Fails (on purpose)
-- while any payment already carries one of the new offer values.
DROP INDEX IF EXISTS public.masterclass_payments_intro_seats_idx;
ALTER TABLE public.masterclass_payments DROP CONSTRAINT IF EXISTS masterclass_payments_offer_check;
ALTER TABLE public.masterclass_payments
  ADD CONSTRAINT masterclass_payments_offer_check
  CHECK (offer IS NULL OR offer IN ('earlybird', 'regular', 'test1000'));
