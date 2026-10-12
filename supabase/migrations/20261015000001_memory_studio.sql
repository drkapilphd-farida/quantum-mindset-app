-- ─────────────────────────────────────────────────────────────────────────────
-- 20261015000001_memory_studio
--
-- Memory Studio, Release 2: the shared spaced-review queue and the learner's
-- own creations (Story and Peg lists, and later the other methods).
--
-- - review_items: one recall card per row (a list in order, a peg, later
--   numbers, chapter ideas, flashcards …). Due 1 → 3 → 7 → 14 → 30 days after
--   it is added; "remembered" moves it one step on, "forgot" one step back and
--   due tomorrow. step 5 = learned (no longer due).
-- - memory_creations: what the learner made with a method on their own
--   material (a list, its story or peg pictures), so it can be reopened and
--   reviewed.
--
-- Learners read their own rows; only the server writes (service role). Add-only.
--
-- Rollback: supabase/rollbacks/20261015000001_memory_studio.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.memory_creations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  method      text        NOT NULL CHECK (method IN ('story', 'peg')),
  title       text        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  items       jsonb       NOT NULL CHECK (jsonb_typeof(items) = 'array' AND jsonb_array_length(items) BETWEEN 2 AND 20),
  story       text        CHECK (story IS NULL OR char_length(story) <= 2000),
  lang        text        NOT NULL CHECK (lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX memory_creations_user_idx ON public.memory_creations (user_id, created_at DESC);

ALTER TABLE public.memory_creations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "memory_creations_select_own"
  ON public.memory_creations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE public.review_items (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  source       text        NOT NULL CHECK (source IN ('story', 'peg-list', 'peg', 'palace', 'chapter', 'flashcard', 'number', 'name-face', 'keyword', 'acronym')),
  source_ref   text        CHECK (source_ref IS NULL OR char_length(source_ref) <= 120),
  front        jsonb       NOT NULL CHECK (pg_column_size(front) <= 2048),
  back         jsonb       NOT NULL CHECK (pg_column_size(back) <= 4096),
  lang         text        NOT NULL CHECK (lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn')),
  step         smallint    NOT NULL DEFAULT 0 CHECK (step BETWEEN 0 AND 5),
  due_at       timestamptz,
  last_result  text        CHECK (last_result IS NULL OR last_result IN ('remembered', 'forgot')),
  reviews      integer     NOT NULL DEFAULT 0 CHECK (reviews >= 0),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX review_items_due_idx ON public.review_items (user_id, due_at) WHERE due_at IS NOT NULL;
-- One card per source item (e.g. peg 7 of the rhyme set). A plain unique index, so the
-- server can upsert on it; rows without a source_ref never collide (NULLs are distinct).
CREATE UNIQUE INDEX review_items_source_ref_key ON public.review_items (user_id, source, source_ref);

ALTER TABLE public.review_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "review_items_select_own"
  ON public.review_items
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
