-- ─────────────────────────────────────────────────────────────────────────────
-- 20261013000001_pace_control
--
-- Pace control (Phase 3, item 4): one new 30-day-plan day per calendar day
-- (opening at midnight IST), completed only after about 10 minutes of active
-- practice and all of that day's steps.
--
-- - curriculum_day_activity: per learner per day — active practice seconds
--   (credited by the server from heartbeats, never faster than the clock),
--   the steps finished, and whether the completion happened under pace
--   control (only then does the next day wait for midnight). Also keeps the
--   seconds at completion and how often "a few more minutes" was shown, for
--   the founder's two-week report.
-- - curriculum_pace_settings: the founder's per-learner switch to turn pace
--   control off (reviewers, catching up after illness …).
--
-- Learners read their own rows; only the server writes (service role). Add-only.
--
-- Rollback: supabase/rollbacks/20261013000001_pace_control.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.curriculum_day_activity (
  user_id                   uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  day                       smallint    NOT NULL CHECK (day BETWEEN 1 AND 30),
  active_seconds            integer     NOT NULL DEFAULT 0 CHECK (active_seconds BETWEEN 0 AND 86400),
  steps_done                text[]      NOT NULL DEFAULT '{}' CHECK (cardinality(steps_done) <= 12),
  started_at                timestamptz NOT NULL DEFAULT now(),
  last_beat_at              timestamptz,
  paced                     boolean     NOT NULL DEFAULT false,
  completed_active_seconds  integer     CHECK (completed_active_seconds IS NULL OR completed_active_seconds >= 0),
  short_attempts            integer     NOT NULL DEFAULT 0 CHECK (short_attempts >= 0),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day)
);

ALTER TABLE public.curriculum_day_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "curriculum_day_activity_select_own"
  ON public.curriculum_day_activity
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE public.curriculum_pace_settings (
  user_id   uuid        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  pace_off  boolean     NOT NULL DEFAULT true,
  note      text        CHECK (note IS NULL OR char_length(note) <= 200),
  set_by    text        NOT NULL CHECK (char_length(set_by) BETWEEN 1 AND 200),
  set_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.curriculum_pace_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "curriculum_pace_settings_select_own"
  ON public.curriculum_pace_settings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
