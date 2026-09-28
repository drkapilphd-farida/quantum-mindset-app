-- Phase 8, Item 11 — Sharp Brain Day 1 / Day 30 assessments.
--
-- One row per user per stage ('day1', 'day30'). The learner chooses the
-- language (en / hi) at Day 1; Day 30 uses the other form in that language. Every number is computed
-- on the server from the raw answers and timings (self-paced timed read,
-- five comprehension questions, 60-trial go/no-go attention task).
-- Practice assessment only — not a medical or psychological test.
-- Existing tables (curriculum_day_completions etc.) are not touched.
-- Rollback: supabase/rollbacks/20260928130001_create_program_assessments.rollback.sql

CREATE TABLE public.program_assessments (
  id                          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  stage                       text        NOT NULL CHECK (stage IN ('day1', 'day30')),
  passage_id                  text        NOT NULL,
  lang                        text        NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'hi')),
  word_count                  integer     NOT NULL CHECK (word_count > 0),
  reading_ms                  integer     NOT NULL CHECK (reading_ms > 0),
  wpm                         integer     NOT NULL CHECK (wpm >= 0),
  correct_answers             integer     NOT NULL CHECK (correct_answers >= 0),
  total_questions             integer     NOT NULL CHECK (total_questions > 0),
  comprehension_percent       integer     NOT NULL CHECK (comprehension_percent BETWEEN 0 AND 100),
  effective_wpm               integer     NOT NULL CHECK (effective_wpm >= 0),
  attention_trials            integer     NOT NULL CHECK (attention_trials > 0),
  attention_accuracy_percent  integer     NOT NULL CHECK (attention_accuracy_percent BETWEEN 0 AND 100),
  attention_mean_rt_ms        integer     CHECK (attention_mean_rt_ms IS NULL OR attention_mean_rt_ms BETWEEN 0 AND 2000),
  taken_at                    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT program_assessments_user_stage_unique UNIQUE (user_id, stage)
);

ALTER TABLE public.program_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "program_assessments_select_own"
  ON public.program_assessments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "program_assessments_insert_own"
  ON public.program_assessments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- A new Day 1 baseline replaces the old one (only allowed before Day 30).
CREATE POLICY "program_assessments_update_own"
  ON public.program_assessments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
