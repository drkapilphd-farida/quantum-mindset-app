-- ─────────────────────────────────────────────────────────────────────────────
-- 20261006000001_speed_test_lead_source
--
-- Reading Speed Test leads: record which reading profile the visitor got
-- and which video/ad brought them (the utm_* tags of their visit), so a
-- WhatsApp lead can be traced back to its source. All columns are optional;
-- existing rows are unchanged.
--
-- Rollback: supabase/rollbacks/20261006000001_speed_test_lead_source.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.speed_test_results
  ADD COLUMN profile_type text CHECK (profile_type IS NULL OR profile_type IN ('careful', 'innerVoice', 'skimmer', 'balanced')),
  ADD COLUMN utm_source   text CHECK (utm_source   IS NULL OR char_length(utm_source)   <= 120),
  ADD COLUMN utm_medium   text CHECK (utm_medium   IS NULL OR char_length(utm_medium)   <= 120),
  ADD COLUMN utm_campaign text CHECK (utm_campaign IS NULL OR char_length(utm_campaign) <= 200),
  ADD COLUMN utm_term     text CHECK (utm_term     IS NULL OR char_length(utm_term)     <= 200),
  ADD COLUMN utm_content  text CHECK (utm_content  IS NULL OR char_length(utm_content)  <= 200);
