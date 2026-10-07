-- Rollback for 20261008000001_bengali_language.
-- Learners who chose Bengali go back to "not chosen" (the app then uses the
-- browser language, else English) before the 7-language check is restored.
UPDATE public.profiles SET preferred_language = NULL WHERE preferred_language = 'bn';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_preferred_language_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_preferred_language_check
  CHECK (preferred_language IS NULL OR preferred_language IN ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'gu'));
