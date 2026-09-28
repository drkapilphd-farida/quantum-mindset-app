-- Phase 8, Item 10 — onboarding (role + goal) and guardian consent records.
--
-- profiles: three new NULLABLE columns. Existing rows are untouched; NULL
-- means "not answered yet" (onboarding_seen_at NULL = the one-time
-- onboarding screen has not been shown or skipped).
--
-- guardian_consents: an append-only record of each time a parent / legal
-- guardian ticks the consent checkbox (onboarding, creating a child
-- account, linking an existing child account). The wording shown is
-- stored as a version string so the exact text can always be traced.
-- Rollback: supabase/rollbacks/20260928120001_onboarding_role_goal_and_guardian_consents.rollback.sql

ALTER TABLE public.profiles
  ADD COLUMN learner_role text
    CHECK (learner_role IN ('parent', 'student', 'professional')),
  ADD COLUMN learning_focus text
    CHECK (learning_focus IN ('focus', 'memory', 'exam', 'reading')),
  ADD COLUMN onboarding_seen_at timestamptz;

CREATE TABLE public.guardian_consents (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_user_id  uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  child_user_id     uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
  context           text        NOT NULL CHECK (context IN ('onboarding', 'create_child', 'link_child')),
  wording_version   text        NOT NULL,
  lang              text        NOT NULL CHECK (lang IN ('en', 'hi')),
  accepted_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX guardian_consents_guardian_idx
  ON public.guardian_consents (guardian_user_id, accepted_at DESC);

ALTER TABLE public.guardian_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guardian_consents_select_own"
  ON public.guardian_consents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = guardian_user_id);

CREATE POLICY "guardian_consents_insert_own"
  ON public.guardian_consents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = guardian_user_id);
