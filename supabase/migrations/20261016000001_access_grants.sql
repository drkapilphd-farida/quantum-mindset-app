-- ─────────────────────────────────────────────────────────────────────────────
-- 20261016000001_access_grants
--
-- Complimentary / hand-given access by email, claimed automatically at
-- sign-up. A grant names the plan (normally 'qsr-app-continued', which the
-- app treats as ending at current_period_end) and an end date. When someone
-- signs up with that email, handle_new_user turns the grant into a
-- subscription that ends on that date. kind = 'complimentary' marks it as not
-- a sale (sales reports count Razorpay payments only).
--
-- - access_grants: no learner access at all (RLS on, no policies); written by
--   the founder's server/admin tools only.
-- - handle_new_user: unchanged, plus the grant claim at the end, wrapped so
--   that it can never block a sign-up.
--
-- Rollback: supabase/rollbacks/20261016000001_access_grants.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.access_grants (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text        NOT NULL CHECK (char_length(email) BETWEEN 3 AND 320),
  plan_key     text        NOT NULL DEFAULT 'qsr-app-continued',
  kind         text        NOT NULL DEFAULT 'complimentary' CHECK (kind IN ('complimentary', 'paid-outside-razorpay')),
  period_start timestamptz NOT NULL DEFAULT now(),
  period_end   timestamptz NOT NULL,
  note         text        CHECK (note IS NULL OR char_length(note) <= 200),
  granted_by   text        NOT NULL CHECK (char_length(granted_by) BETWEEN 1 AND 200),
  user_id      uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
  claimed_at   timestamptz,
  revoked_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (period_end > period_start)
);

CREATE INDEX access_grants_email_idx ON public.access_grants (lower(email)) WHERE claimed_at IS NULL;

ALTER TABLE public.access_grants ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  matched_plan_id uuid;
  matched_payment_id uuid;
  matched_habit_builder_payment_id uuid;
  grant_row record;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    new.email,
    new.phone
  );

  -- Claim-on-signup (QSR Masterclass) — unchanged from 20260826000001.
  SELECT id INTO matched_payment_id
  FROM public.masterclass_payments
  WHERE granted_at IS NULL
    AND (
      (new.email IS NOT NULL AND email = new.email)
      OR (new.phone IS NOT NULL AND phone = new.phone)
    )
  ORDER BY created_at ASC
  LIMIT 1;

  IF matched_payment_id IS NOT NULL THEN
    SELECT id INTO matched_plan_id FROM public.plans WHERE key = 'qsr-masterclass';

    IF matched_plan_id IS NOT NULL THEN
      INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start)
      VALUES (new.id, matched_plan_id, 'active', now())
      ON CONFLICT (user_id, plan_id) DO UPDATE SET status = 'active';

      UPDATE public.masterclass_payments
      SET user_id = new.id, granted_at = now()
      WHERE id = matched_payment_id;
    END IF;
  END IF;

  -- Claim-on-signup (Habit Builder) — new. Same "at most one unclaimed
  -- payment, oldest first" reasoning as the masterclass claim above: a
  -- real person paying twice for the same one-time product is a manual-
  -- support edge case, not something this trigger should silently grant
  -- twice over.
  SELECT id INTO matched_habit_builder_payment_id
  FROM public.habit_builder_payments
  WHERE granted_at IS NULL
    AND (
      (new.email IS NOT NULL AND email = new.email)
      OR (new.phone IS NOT NULL AND phone = new.phone)
    )
  ORDER BY created_at ASC
  LIMIT 1;

  IF matched_habit_builder_payment_id IS NOT NULL THEN
    INSERT INTO public.entitlements (user_id, key, value)
    VALUES (new.id, 'habit_builder_access', '{"granted": true}'::jsonb)
    ON CONFLICT (user_id, key) WHERE user_id IS NOT NULL DO UPDATE SET value = '{"granted": true}'::jsonb;

    UPDATE public.habit_builder_payments
    SET user_id = new.id, granted_at = now()
    WHERE id = matched_habit_builder_payment_id;
  END IF;

  -- Claim-on-signup (complimentary / hand-given access, 20261016000001): an
  -- unclaimed access grant for this email becomes a time-limited
  -- subscription that ends on the grant's end date. Wrapped so that a
  -- problem here can never block a sign-up.
  BEGIN
    FOR grant_row IN
      SELECT g.id, g.plan_key, g.period_end
      FROM public.access_grants g
      WHERE g.claimed_at IS NULL
        AND g.revoked_at IS NULL
        AND g.period_end > now()
        AND new.email IS NOT NULL
        AND lower(g.email) = lower(new.email)
      ORDER BY g.created_at ASC
    LOOP
      SELECT id INTO matched_plan_id FROM public.plans WHERE key = grant_row.plan_key;
      IF matched_plan_id IS NOT NULL THEN
        INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
        VALUES (new.id, matched_plan_id, 'active', now(), grant_row.period_end)
        ON CONFLICT (user_id, plan_id) DO UPDATE
          SET status = 'active',
              current_period_end = GREATEST(COALESCE(public.subscriptions.current_period_end, EXCLUDED.current_period_end), EXCLUDED.current_period_end);
        UPDATE public.access_grants SET user_id = new.id, claimed_at = now() WHERE id = grant_row.id;
      END IF;
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user: access grant claim skipped (%)', SQLSTATE;
  END;

  RETURN new;
END;
$function$;
