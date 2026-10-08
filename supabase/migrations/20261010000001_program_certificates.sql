-- ─────────────────────────────────────────────────────────────────────────────
-- 20261010000001_program_certificates
--
-- Sharp Brain 30-day certificate (Phase 3, item 2): one certificate per
-- learner per programme, issued when Day 30 is complete. The numbers printed
-- on it (fair reading test before/after, Memory Palace scores) are frozen in
-- `snapshot` at issue time, so a certificate never changes afterwards.
--
-- Rows are written only by the server (service role) after it has checked
-- that Day 30 is really complete: there is deliberately no INSERT/UPDATE/
-- DELETE policy. Learners read their own row. The public verification page
-- reads through the server and shows only first name + last initial,
-- programme, date and ID — never scores or contact details.
--
-- Also creates the private `certificate-assets` bucket (the founder's
-- signature). Private: the server reads it with the service role and hands it
-- only to a learner who holds a certificate. Add-only.
--
-- Rollback: supabase/rollbacks/20261010000001_program_certificates.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.program_certificates (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  program       text        NOT NULL DEFAULT 'sharp-brain-30' CHECK (program IN ('sharp-brain-30')),
  code          text        NOT NULL UNIQUE CHECK (code ~ '^SB-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$'),
  learner_name  text        NOT NULL CHECK (char_length(learner_name) BETWEEN 2 AND 60),
  completed_on  date        NOT NULL,
  snapshot      jsonb       NOT NULL DEFAULT '{}'::jsonb CHECK (pg_column_size(snapshot) <= 4096),
  issued_at     timestamptz NOT NULL DEFAULT now(),
  revoked_at    timestamptz,
  CONSTRAINT program_certificates_one_per_learner UNIQUE (user_id, program)
);

ALTER TABLE public.program_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "program_certificates_select_own"
  ON public.program_certificates
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('certificate-assets', 'certificate-assets', false, 524288, ARRAY['image/png'])
ON CONFLICT (id) DO NOTHING;
