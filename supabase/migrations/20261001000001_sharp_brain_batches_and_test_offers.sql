-- ─────────────────────────────────────────────────────────────────────────────
-- 20261001000001_sharp_brain_batches_and_test_offers
--
-- Sharp Brain 30-Day Program: batch, offer and buyer name on each payment,
-- and the Reading Speed Test offer (₹1,000 off for 48 hours).
--
-- 1. sharp_brain_offers — one row per WhatsApp number, ever (UNIQUE), so
--    retaking the test, another browser or another device never creates a
--    second offer or restarts the 48 hours. Created only by the server
--    (src/features/sharp-brain-enrol) after a VALID Reading Speed Test.
--    RLS on, no policies: service role only. whatsapp_number is personal
--    data — never log it.
-- 2. masterclass_payments — new nullable columns filled by the
--    masterclass-webhook from the payment link's notes: buyer name, offer
--    (earlybird | regular | test1000), chosen batch start date (IST), the
--    payment link id and the test offer it redeemed. Old rows stay NULL.
--
-- Depends on 20260930000001_create_speed_test_results.
-- Rollback: supabase/rollbacks/20261001000001_sharp_brain_batches_and_test_offers.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.sharp_brain_offers (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number      text        NOT NULL CHECK (whatsapp_number ~ '^[0-9]{10,15}$'),
  speed_test_result_id uuid        REFERENCES public.speed_test_results (id) ON DELETE SET NULL,
  kind                 text        NOT NULL DEFAULT 'test1000' CHECK (kind IN ('test1000')),
  discount_inr         integer     NOT NULL CHECK (discount_inr > 0),
  created_at           timestamptz NOT NULL DEFAULT now(),
  expires_at           timestamptz NOT NULL,
  redeemed_at          timestamptz,
  razorpay_payment_id  text,
  CONSTRAINT sharp_brain_offers_whatsapp_number_unique UNIQUE (whatsapp_number),
  CONSTRAINT sharp_brain_offers_expiry_after_creation CHECK (expires_at > created_at)
);

ALTER TABLE public.sharp_brain_offers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.masterclass_payments
  ADD COLUMN customer_name        text,
  ADD COLUMN offer                text CHECK (offer IS NULL OR offer IN ('earlybird', 'regular', 'test1000')),
  ADD COLUMN batch_start          date,
  ADD COLUMN payment_link_id      text,
  ADD COLUMN sharp_brain_offer_id uuid REFERENCES public.sharp_brain_offers (id) ON DELETE SET NULL;

CREATE INDEX masterclass_payments_batch_start_idx ON public.masterclass_payments (batch_start, created_at DESC);
