-- ─────────────────────────────────────────────────────────────────────────────
-- 20261002000001_app_languages
--
-- The app's interface now has 7 languages (en, hi, kn, ta, te, mr, gu).
--
-- 1. profiles.preferred_language — the learner's chosen app language, so it
--    follows them to other devices. NULL = not chosen yet (the app then
--    uses the browser's language, else English). Learners may update only
--    this column on top of the columns they could already update.
-- 2. content_lang on every table that stores a reading-speed result — the
--    language of the PRACTICE TEXT that was read (not the interface
--    language). WPM is not comparable across languages, so the app only
--    compares a learner's results within the same content_lang. Existing
--    rows are all English practice text, hence DEFAULT 'en'.
--
-- Rollback: supabase/rollbacks/20261002000001_app_languages.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN preferred_language text
  CHECK (preferred_language IS NULL OR preferred_language IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu'));

GRANT UPDATE (preferred_language) ON public.profiles TO authenticated;

ALTER TABLE public.curriculum_day_completions
  ADD COLUMN content_lang text NOT NULL DEFAULT 'en' CHECK (content_lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu'));
ALTER TABLE public.daily_quantum_sessions
  ADD COLUMN content_lang text NOT NULL DEFAULT 'en' CHECK (content_lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu'));
ALTER TABLE public.journey_baseline_diagnostics
  ADD COLUMN content_lang text NOT NULL DEFAULT 'en' CHECK (content_lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu'));
ALTER TABLE public.qsr_reading_assessments
  ADD COLUMN content_lang text NOT NULL DEFAULT 'en' CHECK (content_lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu'));
ALTER TABLE public.qsr_reading_speed_samples
  ADD COLUMN content_lang text NOT NULL DEFAULT 'en' CHECK (content_lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu'));
ALTER TABLE public.reading_intelligence_sessions
  ADD COLUMN content_lang text NOT NULL DEFAULT 'en' CHECK (content_lang IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu'));
