-- Rollback for 20261006000001_speed_test_lead_source. Removes the profile and
-- UTM columns from Reading Speed Test leads (the leads themselves stay).
ALTER TABLE public.speed_test_results
  DROP COLUMN IF EXISTS profile_type,
  DROP COLUMN IF EXISTS utm_source,
  DROP COLUMN IF EXISTS utm_medium,
  DROP COLUMN IF EXISTS utm_campaign,
  DROP COLUMN IF EXISTS utm_term,
  DROP COLUMN IF EXISTS utm_content;
