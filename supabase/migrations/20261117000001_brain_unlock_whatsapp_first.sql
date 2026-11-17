-- ─────────────────────────────────────────────────────────────────────────────
-- 20261117000001_brain_unlock_whatsapp_first
--
-- Brain Unlock report (founder, 17 Nov 2026): "Get my plan on WhatsApp" opens
-- WhatsApp straight away, with no number typed. The lead is saved first with
-- scores, Brain Type, UTM and session but NO phone; Dr. Kapil matches it with
-- the chat (a reference code is in the message) and adds the number by hand.
--
-- 1. speed_test_results.whatsapp_number may be empty, for Brain Unlock leads
--    only (every other test still requires it). The 10–15 digit format check
--    is unchanged and still applies whenever a number is present.
-- 2. brain_unlock_events: one more event, 'whatsapp_opened' (the visitor
--    tapped the button and WhatsApp was opened). Device type goes into each
--    event's data (no schema change).
--
-- Add-only in effect: no data changes; existing rows all have a number.
-- Rollback: supabase/rollbacks/20261117000001_brain_unlock_whatsapp_first.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.speed_test_results ALTER COLUMN whatsapp_number DROP NOT NULL;
ALTER TABLE public.speed_test_results
  ADD CONSTRAINT speed_test_results_phone_required_check
  CHECK (whatsapp_number IS NOT NULL OR test_kind = 'brain_unlock');

ALTER TABLE public.brain_unlock_events DROP CONSTRAINT IF EXISTS brain_unlock_events_event_check;
ALTER TABLE public.brain_unlock_events
  ADD CONSTRAINT brain_unlock_events_event_check CHECK (event IN (
    'landing', 'role_picked', 'duo_chosen', 'started', 'check_done',
    'unlock_speed_done', 'unlock_memory_done', 'unlock_focus_done',
    'report_view', 'whatsapp_opened', 'whatsapp_submitted', 'lead_submit_tried', 'lead_save_failed',
    'share_clicked', 'plan_clicked', 'payment_success'));
