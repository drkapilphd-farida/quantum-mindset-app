-- ─────────────────────────────────────────────────────────────────────────────
-- Daily reminders scheduler (Phase 3) — PRODUCTION ONLY, run with the
-- founder's OK. The Vercel Hobby plan only allows daily jobs, so Supabase's
-- scheduler (pg_cron) calls the reminder job every 15 minutes over HTTPS
-- (pg_net). The job's password lives in Supabase Vault, never in this file:
-- step 2 is run separately with the real value, which is never printed,
-- logged or committed.
--
-- Undo: select cron.unschedule('sharp-brain-reminders');
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. The scheduler and HTTP extensions (add-only).
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. (separately) select vault.create_secret('<REMINDERS_CRON_SECRET>', 'reminders_cron_secret');

-- 3. Every 15 minutes.
SELECT cron.schedule(
  'sharp-brain-reminders',
  '*/15 * * * *',
  $job$
    SELECT net.http_post(
      url := 'https://www.mindurmind.org.in/api/cron/reminders',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'reminders_cron_secret'),
        'Content-Type', 'application/json'
      ),
      timeout_milliseconds := 55000
    );
  $job$
);
