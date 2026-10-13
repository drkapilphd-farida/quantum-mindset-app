-- ─────────────────────────────────────────────────────────────────────────────
-- 20261019000001_smart_reader
--
-- Smart Reader (Group B): the learner's reading place, so a passage or their
-- own chapter resumes where they stopped, on any phone. One row per thing
-- being read. Learners read their own rows; only the server writes. Add-only.
--
-- Rollback: supabase/rollbacks/20261019000001_smart_reader.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.reading_positions (
  user_id     uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  source      text        NOT NULL CHECK (source IN ('library', 'chapter')),
  source_ref  text        NOT NULL CHECK (char_length(source_ref) BETWEEN 1 AND 120),
  section     smallint    NOT NULL DEFAULT 0 CHECK (section BETWEEN 0 AND 60),
  word_index  integer     NOT NULL DEFAULT 0 CHECK (word_index BETWEEN 0 AND 20000),
  wpm         smallint    NOT NULL CHECK (wpm BETWEEN 50 AND 1000),
  mode        text        NOT NULL DEFAULT 'pacer' CHECK (mode IN ('pacer', 'flash', 'normal')),
  finished    boolean     NOT NULL DEFAULT false,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, source, source_ref)
);

ALTER TABLE public.reading_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reading_positions_select_own"
  ON public.reading_positions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
