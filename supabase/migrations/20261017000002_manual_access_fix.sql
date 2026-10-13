-- ─────────────────────────────────────────────────────────────────────────────
-- 20261017000002_manual_access_fix
--
-- Fix (13 Oct 2026): a manual enrolment for someone who already had an account
-- stayed "Waiting for sign-up". The admin page looked the email up in
-- profiles.email, which is empty for most older (Google) accounts, and the
-- sign-up claim never runs for an account that already exists.
--
-- - user_id_by_email(): the account for an email, from auth.users (case-insensitive).
-- - claim_pending_access(): gives an existing account any waiting program
--   payment (manual or Razorpay) or access grant for its email. The app calls
--   it when a signed-in learner has no access, so access also switches on at
--   the next login / page load.
-- - At most one active manual entry per email (a second one is refused).
-- - profiles.email filled in from auth.users where it is empty.
--
-- Both functions are server-only (service role). Add-only.
-- Rollback: supabase/rollbacks/20261017000002_manual_access_fix.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.user_id_by_email(p_email text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id FROM auth.users WHERE lower(email) = lower(trim(p_email)) ORDER BY created_at LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.user_id_by_email(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.user_id_by_email(text) TO service_role;

CREATE OR REPLACE FUNCTION public.claim_pending_access(p_user uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_email text;
  program_plan uuid;
  claimed integer := 0;
  pay record;
  grant_row record;
  grant_plan uuid;
BEGIN
  SELECT lower(email) INTO user_email FROM auth.users WHERE id = p_user;
  IF user_email IS NULL THEN RETURN 0; END IF;

  SELECT id INTO program_plan FROM public.plans WHERE key = 'qsr-masterclass';
  FOR pay IN
    SELECT id FROM public.masterclass_payments
    WHERE granted_at IS NULL AND refunded_at IS NULL AND lower(trim(email)) = user_email
    ORDER BY created_at
  LOOP
    IF program_plan IS NOT NULL THEN
      INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start)
      VALUES (p_user, program_plan, 'active', now())
      ON CONFLICT (user_id, plan_id) DO UPDATE SET status = 'active', canceled_at = NULL;
      UPDATE public.masterclass_payments SET user_id = p_user, granted_at = now() WHERE id = pay.id;
      claimed := claimed + 1;
    END IF;
  END LOOP;

  FOR grant_row IN
    SELECT id, plan_key, period_end FROM public.access_grants
    WHERE claimed_at IS NULL AND revoked_at IS NULL AND period_end > now() AND lower(trim(email)) = user_email
    ORDER BY created_at
  LOOP
    SELECT id INTO grant_plan FROM public.plans WHERE key = grant_row.plan_key;
    IF grant_plan IS NOT NULL THEN
      INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
      VALUES (p_user, grant_plan, 'active', now(), grant_row.period_end)
      ON CONFLICT (user_id, plan_id) DO UPDATE
        SET status = 'active', canceled_at = NULL,
            current_period_end = GREATEST(COALESCE(public.subscriptions.current_period_end, EXCLUDED.current_period_end), EXCLUDED.current_period_end);
      UPDATE public.access_grants SET user_id = p_user, claimed_at = now() WHERE id = grant_row.id;
      claimed := claimed + 1;
    END IF;
  END LOOP;

  RETURN claimed;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_pending_access(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_pending_access(uuid) TO service_role;

CREATE UNIQUE INDEX masterclass_payments_one_active_manual
  ON public.masterclass_payments (lower(trim(email)))
  WHERE source = 'manual' AND refunded_at IS NULL;

UPDATE public.profiles p SET email = u.email FROM auth.users u WHERE u.id = p.id AND p.email IS NULL AND u.email IS NOT NULL;
