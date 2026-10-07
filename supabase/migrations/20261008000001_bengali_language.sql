-- ─────────────────────────────────────────────────────────────────────────────
-- 20261008000001_bengali_language
--
-- Bengali (bn) is the app's 8th language. profiles.preferred_language must
-- accept 'bn' so a learner's choice follows them to other devices. Add-only:
-- every existing value stays valid. content_lang columns are unchanged —
-- Bengali practice text doesn't exist yet, so Bengali reading results are
-- saved as English ('en').
--
-- Rollback: supabase/rollbacks/20261008000001_bengali_language.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_preferred_language_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_preferred_language_check
  CHECK (preferred_language IS NULL OR preferred_language IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu', 'bn'));
