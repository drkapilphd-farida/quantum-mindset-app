-- ─────────────────────────────────────────────────────────────────────────────
-- 20261017000001_manual_enrolments
--
-- Sharp Brain 30-Day Program payments taken outside Razorpay (GPay, cash,
-- bank transfer), recorded by the founder in /admin/manual-enrolments. They
-- live in masterclass_payments next to Razorpay payments, so they count as
-- sales in the enrolment reports and are claimed at sign-up by the existing
-- handle_new_user (unchanged). razorpay_payment_id holds "manual-<uuid>".
--
-- Add-only: new nullable/defaulted columns; existing rows become source 'razorpay'.
--
-- Rollback: supabase/rollbacks/20261017000001_manual_enrolments.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.masterclass_payments
  ADD COLUMN source       text        NOT NULL DEFAULT 'razorpay' CHECK (source IN ('razorpay', 'manual')),
  ADD COLUMN payment_mode text        CHECK (payment_mode IS NULL OR payment_mode IN ('gpay', 'cash', 'bank')),
  ADD COLUMN paid_on      date,
  ADD COLUMN recorded_by  text        CHECK (recorded_by IS NULL OR char_length(recorded_by) <= 200),
  ADD COLUMN refunded_at  timestamptz,
  ADD COLUMN note         text        CHECK (note IS NULL OR char_length(note) <= 300),
  ADD CONSTRAINT masterclass_payments_manual_fields CHECK (source = 'razorpay' OR (payment_mode IS NOT NULL AND paid_on IS NOT NULL AND recorded_by IS NOT NULL));
