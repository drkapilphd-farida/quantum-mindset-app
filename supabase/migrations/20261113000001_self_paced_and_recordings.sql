-- ─────────────────────────────────────────────────────────────────────────────
-- 20261113000001_self_paced_and_recordings
--
-- Sharp Brain: the ₹2,999 Self-paced plan inside the app + Class Recordings.
--
-- 1. masterclass_payments.plan_type: 'live' (₹8,999 batch) or 'self_paced'
--    (₹2,999). Every existing row becomes 'live', so existing buyers are
--    unchanged. Access itself stays the one shared check (subscriptions,
--    qsr-masterclass); plan_type only decides what the learner sees (live
--    class registration vs. the upgrade card).
-- 2. unmatched_payments: every payment_link.paid event the program webhook
--    does not recognise as Sharp Brain is saved here (never dropped) and
--    shown on /admin/unmatched-payments. Service role only.
-- 3. class_recordings: the 7 class recordings (YouTube unlisted video ids),
--    managed on /admin/recordings. Read by the server only after the shared
--    access check (getIsPaidUser), so no learner-facing policy is needed and
--    no access rule is duplicated in SQL. Service role only.
--
-- Add-only: one new defaulted column, two new tables (RLS on, no policies).
--
-- Rollback: supabase/rollbacks/20261113000001_self_paced_and_recordings.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.masterclass_payments
  ADD COLUMN plan_type text NOT NULL DEFAULT 'live' CHECK (plan_type IN ('live', 'self_paced'));

CREATE TABLE public.unmatched_payments (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_payment_id text        NOT NULL,
  event               text        NOT NULL CHECK (char_length(event) <= 80),
  reason              text        NOT NULL CHECK (reason IN ('other_link', 'invalid_payload')),
  payment_link_id     text,
  short_url           text,
  amount_cents        integer,
  currency            text,
  email               text,
  phone               text,
  customer_name       text,
  notes               jsonb       NOT NULL DEFAULT '{}'::jsonb,
  reviewed_at         timestamptz,
  reviewed_by         text        CHECK (reviewed_by IS NULL OR char_length(reviewed_by) <= 200),
  created_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unmatched_payments_payment_once UNIQUE (razorpay_payment_id)
);

CREATE INDEX unmatched_payments_created_idx ON public.unmatched_payments (created_at DESC);

ALTER TABLE public.unmatched_payments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.class_recordings (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_number  smallint    NOT NULL CHECK (class_number BETWEEN 1 AND 7),
  title         text        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160),
  class_date    date        NOT NULL,
  youtube_id    text        NOT NULL CHECK (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  sort_order    integer     NOT NULL DEFAULT 0,
  hidden        boolean     NOT NULL DEFAULT false,
  created_by    text        NOT NULL CHECK (char_length(created_by) BETWEEN 1 AND 200),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX class_recordings_order_idx ON public.class_recordings (sort_order, class_number, class_date);

ALTER TABLE public.class_recordings ENABLE ROW LEVEL SECURITY;
