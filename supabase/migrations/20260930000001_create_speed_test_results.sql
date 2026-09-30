-- ─────────────────────────────────────────────────────────────────────────────
-- 20260930000001_create_speed_test_results
--
-- Free Reading Speed Test — a result is stored ONLY when the visitor leaves
-- a WhatsApp number to receive it (anonymous attempts are never stored).
-- Every number here is computed on the server (see
-- src/features/reading-speed-test/actions.ts); the browser cannot write
-- this table directly.
--
-- RLS is enabled with no policies: only the service role (server action)
-- can insert or read. whatsapp_number and first_name are personal data —
-- never log them. Deletion on request: see the privacy policy section
-- "Free Reading Speed Test".
-- Rollback: supabase/rollbacks/20260930000001_create_speed_test_results.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.speed_test_results (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number       text        NOT NULL CHECK (whatsapp_number ~ '^[0-9]{10,15}$'),
  first_name            text        CHECK (first_name IS NULL OR char_length(first_name) BETWEEN 1 AND 60),
  passage_id            text        NOT NULL,
  lang                  text        NOT NULL CHECK (lang IN ('en', 'hi')),
  wpm                   integer     NOT NULL CHECK (wpm >= 0),
  comprehension_percent integer     NOT NULL CHECK (comprehension_percent BETWEEN 0 AND 100),
  effective_wpm         integer     NOT NULL CHECK (effective_wpm >= 0),
  status                text        NOT NULL CHECK (status IN ('valid', 'too_fast', 'low_comprehension')),
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX speed_test_results_created_at_idx ON public.speed_test_results (created_at DESC);

ALTER TABLE public.speed_test_results ENABLE ROW LEVEL SECURITY;
