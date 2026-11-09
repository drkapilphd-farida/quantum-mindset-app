-- ─────────────────────────────────────────────────────────────────────────────
-- 20261109000001_progress_transfers
--
-- Admin "Transfer progress" (founder, 9 Nov 2026): a learner who signed up
-- again with a new email gets their old account's progress, checkpoints,
-- scores and access copied to the new account. The better value is kept
-- wherever both accounts have one; nothing is ever lowered or removed, and
-- the old account is left exactly as it was (its certificate, if any, moves).
--
-- - progress_transfers: one log row per transfer (who, when, what changed).
-- - transfer_learner_progress(): the whole copy in ONE transaction — all or
--   nothing. Service role only (the admin page calls it after its own admin
--   check). Running it twice changes nothing the second time.
--
-- Add-only. Rollback: supabase/rollbacks/20261109000001_progress_transfers.down.sql
-- (drops the function and the log; copied rows stay, as they belong to the learner).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.progress_transfers (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id    uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
  to_user_id      uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
  from_email      text        NOT NULL CHECK (char_length(from_email) BETWEEN 3 AND 320),
  to_email        text        NOT NULL CHECK (char_length(to_email) BETWEEN 3 AND 320),
  transferred_by  text        NOT NULL CHECK (char_length(transferred_by) BETWEEN 1 AND 320),
  summary         jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (from_user_id IS DISTINCT FROM to_user_id)
);

CREATE INDEX progress_transfers_created_idx ON public.progress_transfers (created_at DESC);

-- Server-only: no policies, so only the service role can read or write.
ALTER TABLE public.progress_transfers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.transfer_learner_progress(
  p_from uuid,
  p_to uuid,
  p_by text,
  p_from_email text,
  p_to_email text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s jsonb := '{}'::jsonb;
  n integer;
BEGIN
  IF p_from IS NULL OR p_to IS NULL OR p_from = p_to THEN
    RAISE EXCEPTION 'transfer needs two different accounts';
  END IF;
  -- One transfer for this pair at a time.
  PERFORM pg_advisory_xact_lock(hashtext('progress-transfer:' || least(p_from, p_to)::text || greatest(p_from, p_to)::text));

  -- 30-day plan: finished days. Missing days are added; for a day both have,
  -- the better reading score is kept and the earlier finish date.
  INSERT INTO curriculum_day_completions AS c (user_id, day, raw_wpm, true_wpm, comprehension_accuracy_percent, completed_at, content_lang)
  SELECT p_to, day, raw_wpm, true_wpm, comprehension_accuracy_percent, completed_at, content_lang
  FROM curriculum_day_completions WHERE user_id = p_from
  ON CONFLICT (user_id, day) DO UPDATE SET
    raw_wpm = CASE WHEN coalesce(EXCLUDED.true_wpm, -1) > coalesce(c.true_wpm, -1) THEN EXCLUDED.raw_wpm ELSE c.raw_wpm END,
    comprehension_accuracy_percent = CASE WHEN coalesce(EXCLUDED.true_wpm, -1) > coalesce(c.true_wpm, -1) THEN EXCLUDED.comprehension_accuracy_percent ELSE c.comprehension_accuracy_percent END,
    content_lang = CASE WHEN coalesce(EXCLUDED.true_wpm, -1) > coalesce(c.true_wpm, -1) THEN EXCLUDED.content_lang ELSE c.content_lang END,
    true_wpm = GREATEST(c.true_wpm, EXCLUDED.true_wpm),
    completed_at = LEAST(c.completed_at, EXCLUDED.completed_at);
  GET DIAGNOSTICS n = ROW_COUNT; s := s || jsonb_build_object('plan_days', n);

  -- 30-day plan: steps done and practice time per day (union / the larger).
  INSERT INTO curriculum_day_activity AS a (user_id, day, active_seconds, steps_done, started_at, last_beat_at, paced, completed_active_seconds, short_attempts, updated_at)
  SELECT p_to, day, active_seconds, steps_done, started_at, last_beat_at, false, completed_active_seconds, short_attempts, now()
  FROM curriculum_day_activity WHERE user_id = p_from
  ON CONFLICT (user_id, day) DO UPDATE SET
    steps_done = (SELECT coalesce((array_agg(DISTINCT x))[1:12], '{}') FROM unnest(a.steps_done || EXCLUDED.steps_done) AS x),
    active_seconds = GREATEST(a.active_seconds, EXCLUDED.active_seconds),
    completed_active_seconds = GREATEST(a.completed_active_seconds, EXCLUDED.completed_active_seconds),
    started_at = LEAST(a.started_at, EXCLUDED.started_at),
    paced = false,
    updated_at = now();
  GET DIAGNOSTICS n = ROW_COUNT; s := s || jsonb_build_object('plan_activity_days', n);

  -- Checkpoints: the fair reading tests (Day 1/7/14/21/30). History — copied once.
  INSERT INTO reading_tests (user_id, kind, curriculum_day, form_id, lang, word_count, elapsed_ms, wpm, comprehension_percent, effective_wpm, status, answers, created_at)
  SELECT p_to, r.kind, r.curriculum_day, r.form_id, r.lang, r.word_count, r.elapsed_ms, r.wpm, r.comprehension_percent, r.effective_wpm, r.status, r.answers, r.created_at
  FROM reading_tests r WHERE r.user_id = p_from
    AND NOT EXISTS (SELECT 1 FROM reading_tests t WHERE t.user_id = p_to AND t.created_at = r.created_at AND t.kind = r.kind AND t.form_id = r.form_id);
  GET DIAGNOSTICS n = ROW_COUNT; s := s || jsonb_build_object('reading_tests', n);

  -- Practice-again results of finished days. History — copied once.
  INSERT INTO curriculum_day_practice_attempts (user_id, day, raw_wpm, true_wpm, comprehension_accuracy_percent, content_lang, practised_at)
  SELECT p_to, r.day, r.raw_wpm, r.true_wpm, r.comprehension_accuracy_percent, r.content_lang, r.practised_at
  FROM curriculum_day_practice_attempts r WHERE r.user_id = p_from
    AND NOT EXISTS (SELECT 1 FROM curriculum_day_practice_attempts t WHERE t.user_id = p_to AND t.day = r.day AND t.practised_at = r.practised_at);
  GET DIAGNOSTICS n = ROW_COUNT; s := s || jsonb_build_object('practice_attempts', n);

  -- Scores: every exercise result (skill progress, brain score). History — copied once.
  INSERT INTO exercise_results (user_id, exercise_id, curriculum_day, is_replay, score, accuracy_percent, level_start, level_end, rounds, duration_ms, details, content_lang, played_at)
  SELECT p_to, r.exercise_id, r.curriculum_day, r.is_replay, r.score, r.accuracy_percent, r.level_start, r.level_end, r.rounds, r.duration_ms, r.details, r.content_lang, r.played_at
  FROM exercise_results r WHERE r.user_id = p_from
    AND NOT EXISTS (SELECT 1 FROM exercise_results t WHERE t.user_id = p_to AND t.exercise_id = r.exercise_id AND t.played_at = r.played_at);
  GET DIAGNOSTICS n = ROW_COUNT; s := s || jsonb_build_object('exercise_results', n);

  -- Practice history (streaks, time). History — copied once.
  INSERT INTO practice_sessions (user_id, lab_id, exercise_id, duration_ms, completed, occurred_at)
  SELECT p_to, r.lab_id, r.exercise_id, r.duration_ms, r.completed, r.occurred_at
  FROM practice_sessions r WHERE r.user_id = p_from
    AND NOT EXISTS (SELECT 1 FROM practice_sessions t WHERE t.user_id = p_to AND t.lab_id = r.lab_id AND t.exercise_id = r.exercise_id AND t.occurred_at = r.occurred_at);
  GET DIAGNOSTICS n = ROW_COUNT; s := s || jsonb_build_object('practice_sessions', n);

  -- Exercise unlock progress: completed beats in progress.
  INSERT INTO exercise_progress AS e (user_id, lab_id, exercise_id, status, started_at, completed_at, updated_at)
  SELECT p_to, lab_id, exercise_id, status, started_at, completed_at, updated_at
  FROM exercise_progress WHERE user_id = p_from
  ON CONFLICT (user_id, lab_id, exercise_id) DO UPDATE SET
    status = CASE WHEN e.status = 'completed' OR EXCLUDED.status = 'completed' THEN 'completed' ELSE 'in_progress' END,
    completed_at = CASE WHEN e.completed_at IS NULL THEN EXCLUDED.completed_at WHEN EXCLUDED.completed_at IS NULL THEN e.completed_at ELSE LEAST(e.completed_at, EXCLUDED.completed_at) END,
    started_at = LEAST(e.started_at, EXCLUDED.started_at),
    updated_at = GREATEST(e.updated_at, EXCLUDED.updated_at);
  GET DIAGNOSTICS n = ROW_COUNT; s := s || jsonb_build_object('exercise_progress', n);

  -- Certificate: moves to the new account if it has none (its code stays valid).
  UPDATE program_certificates SET user_id = p_to
  WHERE user_id = p_from AND NOT EXISTS (SELECT 1 FROM program_certificates t WHERE t.user_id = p_to AND t.program = program_certificates.program);
  GET DIAGNOSTICS n = ROW_COUNT; s := s || jsonb_build_object('certificates_moved', n);

  -- Access: only the old account's CURRENT access is copied, per plan; the
  -- better one wins (lifetime never gets an end date; a later end date wins).
  INSERT INTO subscriptions AS sub (user_id, plan_id, status, current_period_start, current_period_end, created_at, updated_at)
  SELECT p_to, o.plan_id, 'active', o.current_period_start, o.current_period_end, now(), now()
  FROM subscriptions o JOIN plans p ON p.id = o.plan_id
  WHERE o.user_id = p_from AND o.status IN ('active', 'trialing')
    AND (p.billing_interval <> 'month' OR o.current_period_end IS NULL OR o.current_period_end > now())
  ON CONFLICT (user_id, plan_id) DO UPDATE SET
    status = 'active',
    canceled_at = NULL,
    current_period_end = CASE
      WHEN sub.status IN ('active', 'trialing') AND sub.current_period_end IS NULL THEN NULL
      WHEN EXCLUDED.current_period_end IS NULL THEN NULL
      WHEN sub.status IN ('active', 'trialing') THEN GREATEST(sub.current_period_end, EXCLUDED.current_period_end)
      ELSE EXCLUDED.current_period_end END,
    updated_at = now();
  GET DIAGNOSTICS n = ROW_COUNT; s := s || jsonb_build_object('access_plans', n);

  INSERT INTO progress_transfers (from_user_id, to_user_id, from_email, to_email, transferred_by, summary)
  VALUES (p_from, p_to, p_from_email, p_to_email, p_by, s);

  RETURN s;
END;
$$;

REVOKE ALL ON FUNCTION public.transfer_learner_progress(uuid, uuid, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.transfer_learner_progress(uuid, uuid, text, text, text) TO service_role;
