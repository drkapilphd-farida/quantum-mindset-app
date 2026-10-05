-- Rollback for 20261005000001_curriculum_day_practice. Restores learners'
-- ability to update their own completion rows and removes the practice
-- attempts (original completions are untouched).
CREATE POLICY "curriculum_day_completions_update_own"
  ON public.curriculum_day_completions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TABLE IF EXISTS public.curriculum_day_practice_attempts;
