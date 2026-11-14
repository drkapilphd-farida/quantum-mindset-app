-- ─────────────────────────────────────────────────────────────────────────────
-- 20261114000001_brain_unlock
--
-- Brain Unlock (replaces the free Reading & Memory Test at /reading-memory-test).
--
-- 1. speed_test_results: Brain Unlock leads are saved in the same leads table
--    (so they show on /admin/test-leads) with test_kind 'brain_unlock' and a
--    few new optional columns: role, class band, Brain Type, score, the full
--    before/after numbers (details jsonb, both players in Duo Mode), an
--    optional email and the browser session id (to join the funnel events).
-- 2. brain_unlock_events: the funnel (landing → … → plan clicked), one row per
--    step, with UTM tags and a few numbers. No personal details, ever.
-- 3. brain_unlock_settings: one JSON row (id = 1) edited on
--    /admin/brain-unlock-settings — videos, batch date/seats, voice files,
--    score bands, Brain Type texts, goal ranges, follow-ups on/off.
-- 4. brain_unlock_followups: the WhatsApp follow-up queue (instant, +1 h,
--    +1 day, +2 days, +30 days). Sent BY HAND from /admin/followups (WhatsApp
--    Business app; no API): one row per step, the next queued on Done/Skip;
--    stopped when the lead buys or is marked Stop.
-- 5. whatsapp_opt_outs: numbers marked Stop (or that sent STOP) — never messaged again.
--
-- Add-only: one widened CHECK, new nullable columns, four new tables. Every
-- new table has RLS on and NO policies: only the server (service role) reads
-- or writes them. whatsapp_number / email / first_name are personal data —
-- never logged.
--
-- Rollback: supabase/rollbacks/20261114000001_brain_unlock.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Leads ────────────────────────────────────────────────────────────────────
ALTER TABLE public.speed_test_results DROP CONSTRAINT IF EXISTS speed_test_results_test_kind_check;
ALTER TABLE public.speed_test_results
  ADD CONSTRAINT speed_test_results_test_kind_check CHECK (test_kind IN ('speed', 'reading_memory', 'brain_unlock'));

ALTER TABLE public.speed_test_results
  ADD COLUMN email        text     CHECK (email IS NULL OR char_length(email) <= 254),
  ADD COLUMN role         text     CHECK (role IS NULL OR role IN ('parent', 'student', 'professional')),
  ADD COLUMN class_band   text     CHECK (class_band IS NULL OR class_band IN ('5-8', '9-10', '11-12', 'college')),
  ADD COLUMN brain_type   text     CHECK (brain_type IS NULL OR brain_type IN ('sprinter', 'diver', 'magician', 'genius', 'laser')),
  ADD COLUMN unlock_score smallint CHECK (unlock_score IS NULL OR unlock_score BETWEEN 0 AND 100),
  ADD COLUMN duo          boolean  NOT NULL DEFAULT false,
  ADD COLUMN details      jsonb,
  ADD COLUMN session_id   text     CHECK (session_id IS NULL OR char_length(session_id) <= 64);

CREATE INDEX speed_test_results_session_idx ON public.speed_test_results (session_id) WHERE session_id IS NOT NULL;

-- 2. Funnel events ────────────────────────────────────────────────────────────
CREATE TABLE public.brain_unlock_events (
  id           bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id   text        NOT NULL CHECK (char_length(session_id) BETWEEN 8 AND 64),
  event        text        NOT NULL CHECK (event IN (
                 'landing', 'role_picked', 'duo_chosen', 'started', 'check_done',
                 'unlock_speed_done', 'unlock_memory_done', 'unlock_focus_done',
                 'report_view', 'whatsapp_submitted', 'share_clicked', 'plan_clicked', 'payment_success')),
  role         text        CHECK (role IS NULL OR role IN ('parent', 'student', 'professional')),
  lang         text        CHECK (lang IS NULL OR lang IN ('en', 'hi')),
  duo          boolean     NOT NULL DEFAULT false,
  data         jsonb       NOT NULL DEFAULT '{}'::jsonb CHECK (pg_column_size(data) <= 2000),
  utm_source   text        CHECK (utm_source   IS NULL OR char_length(utm_source)   <= 120),
  utm_medium   text        CHECK (utm_medium   IS NULL OR char_length(utm_medium)   <= 120),
  utm_campaign text        CHECK (utm_campaign IS NULL OR char_length(utm_campaign) <= 200),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX brain_unlock_events_created_idx ON public.brain_unlock_events (created_at DESC);
CREATE INDEX brain_unlock_events_session_idx ON public.brain_unlock_events (session_id, event);

ALTER TABLE public.brain_unlock_events ENABLE ROW LEVEL SECURITY;

-- 3. Settings ─────────────────────────────────────────────────────────────────
CREATE TABLE public.brain_unlock_settings (
  id         smallint    PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  settings   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text        CHECK (updated_by IS NULL OR char_length(updated_by) <= 254)
);

ALTER TABLE public.brain_unlock_settings ENABLE ROW LEVEL SECURITY;

-- 4. WhatsApp follow-up queue ────────────────────────────────────────────────
CREATE TABLE public.brain_unlock_followups (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         uuid        NOT NULL REFERENCES public.speed_test_results (id) ON DELETE CASCADE,
  step            text        NOT NULL CHECK (step IN ('instant', 'h1', 'd1', 'd2', 'd30')),
  due_at          timestamptz NOT NULL,
  status          text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'skipped', 'stopped', 'failed')),
  reason          text        CHECK (reason IS NULL OR char_length(reason) <= 120),
  attempts        smallint    NOT NULL DEFAULT 0,
  sent_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT brain_unlock_followups_once UNIQUE (lead_id, step)
);

CREATE INDEX brain_unlock_followups_due_idx ON public.brain_unlock_followups (due_at) WHERE status = 'pending';

ALTER TABLE public.brain_unlock_followups ENABLE ROW LEVEL SECURITY;

-- 5. STOP list ────────────────────────────────────────────────────────────────
CREATE TABLE public.whatsapp_opt_outs (
  whatsapp_number text        PRIMARY KEY CHECK (whatsapp_number ~ '^[0-9]{10,15}$'),
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_opt_outs ENABLE ROW LEVEL SECURITY;
