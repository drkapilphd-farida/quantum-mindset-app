-- ─────────────────────────────────────────────────────────────────────────────
-- 20261115000002_brain_unlock_submit_events
--
-- Brain Unlock funnel (founder, 15 Nov 2026): two more events on the report's
-- WhatsApp form, so a lead that was tried but not saved is visible:
--   lead_submit_tried  — every tap on the submit button
--   lead_save_failed   — the save failed (data.reason: phone / email / name /
--                        invalid / rate / host / run / server / network)
-- Only the event CHECK is widened (the 13 existing events stay allowed).
-- No personal details are ever stored in events.
--
-- Rollback: supabase/rollbacks/20261115000002_brain_unlock_submit_events.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.brain_unlock_events DROP CONSTRAINT IF EXISTS brain_unlock_events_event_check;
ALTER TABLE public.brain_unlock_events
  ADD CONSTRAINT brain_unlock_events_event_check CHECK (event IN (
    'landing', 'role_picked', 'duo_chosen', 'started', 'check_done',
    'unlock_speed_done', 'unlock_memory_done', 'unlock_focus_done',
    'report_view', 'whatsapp_submitted', 'lead_submit_tried', 'lead_save_failed',
    'share_clicked', 'plan_clicked', 'payment_success'));
