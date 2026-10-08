-- ─────────────────────────────────────────────────────────────────────────────
-- 20261014000001_reminders
--
-- Daily reminders (Phase 3): in-app banners need no storage; phone
-- notifications (web push) and, later, WhatsApp need these three tables.
--
-- - reminder_settings: per learner — phone notifications on/off, the reminder
--   time (India time), WhatsApp opt-in (for later), and the founder's switch
--   to turn reminders off for anyone.
-- - push_subscriptions: one row per phone/browser that allowed notifications.
-- - reminder_log: every reminder sent, one row each. The partial unique index
--   is what guarantees "never more than one reminder a day across all
--   channels".
--
-- Learners read their own rows; only the server writes (service role). Add-only.
--
-- Rollback: supabase/rollbacks/20261014000001_reminders.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.reminder_settings (
  user_id                 uuid        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  push_enabled            boolean     NOT NULL DEFAULT false,
  reminder_time           time        NOT NULL DEFAULT '19:00' CHECK (reminder_time BETWEEN '06:00' AND '22:00'),
  whatsapp_opt_in         boolean     NOT NULL DEFAULT false,
  whatsapp_number         text        CHECK (whatsapp_number IS NULL OR whatsapp_number ~ '^[0-9]{10,15}$'),
  whatsapp_opted_in_at    timestamptz,
  admin_disabled          boolean     NOT NULL DEFAULT false,
  admin_note              text        CHECK (admin_note IS NULL OR char_length(admin_note) <= 200),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reminder_settings_select_own"
  ON public.reminder_settings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE public.push_subscriptions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  endpoint         text        NOT NULL UNIQUE CHECK (char_length(endpoint) BETWEEN 10 AND 1000),
  p256dh           text        NOT NULL CHECK (char_length(p256dh) BETWEEN 10 AND 200),
  auth             text        NOT NULL CHECK (char_length(auth) BETWEEN 10 AND 100),
  device_label     text        CHECK (device_label IS NULL OR char_length(device_label) <= 120),
  created_at       timestamptz NOT NULL DEFAULT now(),
  last_success_at  timestamptz,
  failed_count     integer     NOT NULL DEFAULT 0 CHECK (failed_count >= 0)
);

CREATE INDEX push_subscriptions_user_idx ON public.push_subscriptions (user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "push_subscriptions_select_own"
  ON public.push_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE public.reminder_log (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  ist_date             date        NOT NULL,
  channel              text        NOT NULL CHECK (channel IN ('push', 'whatsapp')),
  kind                 text        NOT NULL CHECK (kind IN ('daily', 'checkin', 'live_class', 'missed')),
  status               text        NOT NULL CHECK (status IN ('sent', 'failed')),
  detail               text        CHECK (detail IS NULL OR char_length(detail) <= 300),
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- Never more than one reminder a day, across every channel.
CREATE UNIQUE INDEX reminder_log_one_per_day ON public.reminder_log (user_id, ist_date) WHERE status = 'sent';
CREATE INDEX reminder_log_user_idx ON public.reminder_log (user_id, created_at DESC);

ALTER TABLE public.reminder_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reminder_log_select_own"
  ON public.reminder_log
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
