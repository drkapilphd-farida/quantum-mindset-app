-- ─────────────────────────────────────────────────────────────────────────────
-- 20261018000001_memory_group_a
--
-- Memory Studio, Group A:
-- - memory_palaces: a learner's own palaces (home, school/office, a route …),
--   10–20 stations in walking order; at most 3 per learner (checked by the server).
-- - chapter_maps: Chapter & Book — a chapter's 5–9 key ideas and simple mind
--   map (editable), optionally placed in one of the learner's palaces.
-- - memory_creations.method: also the new methods' own lists.
--
-- Learners read their own rows; only the server writes. Add-only (the method
-- check is widened, never narrowed).
--
-- Rollback: supabase/rollbacks/20261018000001_memory_group_a.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.memory_palaces (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name        text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  kind        text        NOT NULL CHECK (kind IN ('home', 'school', 'route', 'other')),
  stations    text[]      NOT NULL CHECK (cardinality(stations) BETWEEN 10 AND 20),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX memory_palaces_user_idx ON public.memory_palaces (user_id, created_at);

ALTER TABLE public.memory_palaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "memory_palaces_select_own"
  ON public.memory_palaces
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE public.chapter_maps (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  book_title  text        CHECK (book_title IS NULL OR char_length(book_title) <= 120),
  title       text        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  source      text        NOT NULL CHECK (source IN ('paste', 'upload')),
  text_hash   text        NOT NULL CHECK (char_length(text_hash) BETWEEN 16 AND 128),
  lang        text        NOT NULL CHECK (lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn')),
  ideas       jsonb       NOT NULL CHECK (jsonb_typeof(ideas) = 'array' AND jsonb_array_length(ideas) BETWEEN 2 AND 12),
  questions   jsonb       NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(questions) = 'array'),
  palace_id   uuid        REFERENCES public.memory_palaces (id) ON DELETE SET NULL,
  edited      boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (pg_column_size(ideas) <= 16384 AND pg_column_size(questions) <= 16384)
);

CREATE INDEX chapter_maps_user_idx ON public.chapter_maps (user_id, created_at DESC);

ALTER TABLE public.chapter_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chapter_maps_select_own"
  ON public.chapter_maps
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

ALTER TABLE public.memory_creations DROP CONSTRAINT IF EXISTS memory_creations_method_check;
ALTER TABLE public.memory_creations
  ADD CONSTRAINT memory_creations_method_check CHECK (method IN ('story', 'peg', 'palace', 'name-face', 'number', 'keyword', 'acronym'));
