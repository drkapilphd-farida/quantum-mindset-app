-- ─────────────────────────────────────────────────────────────────────────────
-- 20261009000001_reading_tests
--
-- Fair reading test (Phase 3, item 1): one row per self-paced reading test —
-- the Day 1 baseline, the Day 7/14/21 check-ins and the Day 30 final, each on
-- a matched passage ("form"). The guarantee report, the 30-day certificate
-- and the admin export read from here.
--
-- Rows are written only by the server after it has timed the reading itself
-- and scored the answers (service role), so a result can't be forged from the
-- browser: there is deliberately no INSERT/UPDATE/DELETE policy. Learners can
-- read their own rows. Add-only.
--
-- Rollback: supabase/rollbacks/20261009000001_reading_tests.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.reading_tests (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  kind                   text        NOT NULL CHECK (kind IN ('baseline', 'checkpoint', 'final')),
  curriculum_day         integer     CHECK (curriculum_day IS NULL OR (curriculum_day >= 1 AND curriculum_day <= 30)),
  form_id                text        NOT NULL CHECK (form_id IN ('A', 'B', 'C', 'D', 'E', 'R')),
  lang                   text        NOT NULL CHECK (lang IN ('en', 'hi')),
  word_count             integer     NOT NULL CHECK (word_count > 0),
  elapsed_ms             integer     NOT NULL CHECK (elapsed_ms > 0),
  wpm                    integer     NOT NULL CHECK (wpm >= 0),
  comprehension_percent  integer     NOT NULL CHECK (comprehension_percent >= 0 AND comprehension_percent <= 100),
  effective_wpm          integer     NOT NULL CHECK (effective_wpm >= 0),
  status                 text        NOT NULL CHECK (status IN ('valid', 'low_comprehension')),
  answers                jsonb       NOT NULL DEFAULT '[]'::jsonb CHECK (pg_column_size(answers) <= 1024),
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX reading_tests_user_created_idx ON public.reading_tests (user_id, created_at);

ALTER TABLE public.reading_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reading_tests_select_own"
  ON public.reading_tests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
