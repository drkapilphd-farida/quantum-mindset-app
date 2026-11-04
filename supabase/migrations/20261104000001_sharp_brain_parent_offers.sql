-- 20261104000001_sharp_brain_parent_offers
--
-- Sharp Brain for parents (4 Nov 2026): rolling admission, ₹2,999 for the
-- first 100 paid seats, then ₹3,999 (instalments later). The webhook and
-- manual enrolments save the offer on each payment, and the website's
-- "Seats left at ₹2,999" counter counts the paid intro seats.
--
-- Widens the allowed values of masterclass_payments.offer (old values stay
-- valid for old rows) and adds a small index for the seat count. No data
-- changes. MUST be applied before the code that sells the new offers, or
-- those payments fail to save and no access is given.
--
-- Rollback: supabase/rollbacks/20261104000001_sharp_brain_parent_offers.down.sql

ALTER TABLE public.masterclass_payments
  DROP CONSTRAINT IF EXISTS masterclass_payments_offer_check;

ALTER TABLE public.masterclass_payments
  ADD CONSTRAINT masterclass_payments_offer_check
  CHECK (offer IS NULL OR offer IN ('earlybird', 'regular', 'test1000', 'parent_2999', 'parent_3999', 'instalment_1', 'instalment_2'));

CREATE INDEX IF NOT EXISTS masterclass_payments_intro_seats_idx
  ON public.masterclass_payments (offer)
  WHERE refunded_at IS NULL;
