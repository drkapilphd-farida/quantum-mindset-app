-- Rollback for 20261002000001_app_languages. Removes the saved app language
-- and the practice-text language from reading results (the results
-- themselves are untouched).
ALTER TABLE public.reading_intelligence_sessions DROP COLUMN IF EXISTS content_lang;
ALTER TABLE public.qsr_reading_speed_samples DROP COLUMN IF EXISTS content_lang;
ALTER TABLE public.qsr_reading_assessments DROP COLUMN IF EXISTS content_lang;
ALTER TABLE public.journey_baseline_diagnostics DROP COLUMN IF EXISTS content_lang;
ALTER TABLE public.daily_quantum_sessions DROP COLUMN IF EXISTS content_lang;
ALTER TABLE public.curriculum_day_completions DROP COLUMN IF EXISTS content_lang;
REVOKE UPDATE (preferred_language) ON public.profiles FROM authenticated;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS preferred_language;
