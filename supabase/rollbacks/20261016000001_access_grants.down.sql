-- Rollback of 20261016000001_access_grants: restore handle_new_user exactly as it was, then drop the table.
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

  RETURN new;
END;
$function$;

DROP TABLE IF EXISTS public.access_grants;
