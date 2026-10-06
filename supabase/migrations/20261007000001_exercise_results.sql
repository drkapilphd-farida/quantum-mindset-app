-- ─────────────────────────────────────────────────────────────────────────────
-- 20261007000001_exercise_results
--
-- Server-saved exercise scores. Until now an exercise saved only that it
-- was played (practice_sessions: duration + completed); scores, levels and
-- personal bests lived in the browser and were lost on a new phone.
--
-- One row per finished exercise session: the score, accuracy, the level the
-- learner started and ended on (1–10), and — when played inside the 30-day
-- programme — which day. The learner's current level is the level_end of
-- their latest row; their personal best is their highest score. Learners can
-- read and add their own rows; they cannot edit or delete them.
--
-- Purely additive: no existing table, row or policy is touched.
-- Rollback: supabase/rollbacks/20261007000001_exercise_results.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.exercise_results (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  exercise_id       text        NOT NULL CHECK (char_length(exercise_id) BETWEEN 1 AND 80),
  curriculum_day    integer     CHECK (curriculum_day IS NULL OR (curriculum_day >= 1 AND curriculum_day <= 30)),
  is_replay         boolean     NOT NULL DEFAULT false,
  score             integer     NOT NULL CHECK (score >= 0 AND score <= 1000000),
  accuracy_percent  integer     CHECK (accuracy_percent IS NULL OR (accuracy_percent >= 0 AND accuracy_percent <= 100)),
  level_start       smallint    CHECK (level_start IS NULL OR (level_start >= 1 AND level_start <= 10)),
  level_end         smallint    CHECK (level_end IS NULL OR (level_end >= 1 AND level_end <= 10)),
  rounds            smallint    CHECK (rounds IS NULL OR (rounds >= 0 AND rounds <= 100)),
  duration_ms       integer     CHECK (duration_ms IS NULL OR (duration_ms >= 0 AND duration_ms <= 86400000)),
  details           jsonb       NOT NULL DEFAULT '{}'::jsonb CHECK (pg_column_size(details) <= 4096),
  content_lang      text        CHECK (content_lang IS NULL OR content_lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu')),
  played_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX exercise_results_user_exercise_idx
  ON public.exercise_results (user_id, exercise_id, played_at DESC);

ALTER TABLE public.exercise_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercise_results_insert_own"
  ON public.exercise_results FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exercise_results_select_own"
  ON public.exercise_results FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
