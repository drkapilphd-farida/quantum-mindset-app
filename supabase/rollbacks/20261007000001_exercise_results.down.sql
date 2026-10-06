-- Rollback for 20261007000001_exercise_results. Removes the server-saved
-- exercise scores table (nothing else depends on it; practice_sessions and
-- all curriculum progress are untouched).
DROP TABLE IF EXISTS public.exercise_results;
