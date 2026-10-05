-- ─────────────────────────────────────────────────────────────────────────────
-- 20261005000001_curriculum_day_practice
--
-- Learners can practise any completed curriculum day again. A replay must
-- never change the original completion: its date, progress, streak, unlock
-- state, the Day 1 baseline, the official Day 30 result, or certificate
-- eligibility.
--
-- 1. curriculum_day_practice_attempts — one row per replay of a completed
--    day ("Practised again"), kept separate from curriculum_day_completions.
--    Checkpoint-day replays (1, 7, 14, 21, 30) store their WPM and
--    comprehension here as practice only. Learners can read and add their
--    own rows; they cannot edit or delete them.
-- 2. curriculum_day_completions becomes write-once for learners: the
--    "update own" policy is dropped, so an original completion can no
--    longer be overwritten (the app now only ever inserts it once).
--
-- Rollback: supabase/rollbacks/20261005000001_curriculum_day_practice.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.curriculum_day_practice_attempts (
  id                              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                         uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  day                             integer     NOT NULL CHECK (day >= 1 AND day <= 30),
  raw_wpm                         integer,
  true_wpm                        integer,
  comprehension_accuracy_percent  integer     CHECK (comprehension_accuracy_percent IS NULL OR (comprehension_accuracy_percent >= 0 AND comprehension_accuracy_percent <= 100)),
  content_lang                    text        NOT NULL DEFAULT 'en' CHECK (content_lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu')),
  practised_at                    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX curriculum_day_practice_attempts_user_day_idx
  ON public.curriculum_day_practice_attempts (user_id, day, practised_at DESC);

ALTER TABLE public.curriculum_day_practice_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "curriculum_day_practice_attempts_insert_own"
  ON public.curriculum_day_practice_attempts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "curriculum_day_practice_attempts_select_own"
  ON public.curriculum_day_practice_attempts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "curriculum_day_completions_update_own" ON public.curriculum_day_completions;
