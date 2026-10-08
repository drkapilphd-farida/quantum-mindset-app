-- ─────────────────────────────────────────────────────────────────────────────
-- 20261012000001_live_class_attendance
--
-- Live class attendance (Phase 3, item 3) — a rolling monthly cycle of the 7
-- Sharp Brain live classes. Any enrolled learner can register for any session;
-- progress is which class numbers (1–7) they have completed, across cycles.
--
-- - live_class_sessions: the schedule. No Zoom link is stored (the trainer
--   sends it on WhatsApp). Signed-in learners read non-draft sessions.
-- - live_class_registrations: "Register for this class". Learners read their own.
-- - live_class_attendance: marked ONLY by the trainer from the admin page —
--   present at a live session, or "watched recording" (counts only when the
--   trainer ticks it). Learners read their own.
--
-- All writes go through the server (service role) after an access or admin
-- check: no INSERT/UPDATE/DELETE policies. Add-only.
--
-- Rollback: supabase/rollbacks/20261012000001_live_class_attendance.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.live_class_sessions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  class_number    smallint    NOT NULL CHECK (class_number BETWEEN 1 AND 7),
  topic_override  text        CHECK (topic_override IS NULL OR char_length(topic_override) BETWEEN 1 AND 120),
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL,
  status          text        NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT live_class_sessions_ends_after_start CHECK (ends_at > starts_at)
);

CREATE INDEX live_class_sessions_starts_idx ON public.live_class_sessions (starts_at);

ALTER TABLE public.live_class_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "live_class_sessions_select_scheduled"
  ON public.live_class_sessions
  FOR SELECT
  TO authenticated
  USING (status <> 'draft');

CREATE TABLE public.live_class_registrations (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid        NOT NULL REFERENCES public.live_class_sessions (id) ON DELETE CASCADE,
  user_id       uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  cancelled_at  timestamptz,
  CONSTRAINT live_class_registrations_once UNIQUE (session_id, user_id)
);

CREATE INDEX live_class_registrations_user_idx ON public.live_class_registrations (user_id);

ALTER TABLE public.live_class_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "live_class_registrations_select_own"
  ON public.live_class_registrations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE public.live_class_attendance (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  class_number  smallint    NOT NULL CHECK (class_number BETWEEN 1 AND 7),
  session_id    uuid        REFERENCES public.live_class_sessions (id) ON DELETE SET NULL,
  kind          text        NOT NULL CHECK (kind IN ('live', 'recording')),
  counts        boolean     NOT NULL,
  marked_by     text        NOT NULL CHECK (char_length(marked_by) BETWEEN 1 AND 200),
  marked_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT live_class_attendance_live_has_session CHECK (kind <> 'live' OR session_id IS NOT NULL)
);

-- One mark per learner per live session; one recording mark per learner per class number.
CREATE UNIQUE INDEX live_class_attendance_live_once ON public.live_class_attendance (user_id, session_id) WHERE kind = 'live';
CREATE UNIQUE INDEX live_class_attendance_recording_once ON public.live_class_attendance (user_id, class_number) WHERE kind = 'recording';
CREATE INDEX live_class_attendance_user_idx ON public.live_class_attendance (user_id);

ALTER TABLE public.live_class_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "live_class_attendance_select_own"
  ON public.live_class_attendance
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
