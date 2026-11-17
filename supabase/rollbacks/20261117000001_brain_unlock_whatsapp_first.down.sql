-- Rollback for 20261117000001_brain_unlock_whatsapp_first. WhatsApp-only
-- Brain Unlock leads (no number) must get a number or be deleted first:
--   SELECT id FROM public.speed_test_results WHERE whatsapp_number IS NULL;
DELETE FROM public.brain_unlock_events WHERE event = 'whatsapp_opened';
ALTER TABLE public.brain_unlock_events DROP CONSTRAINT IF EXISTS brain_unlock_events_event_check;
ALTER TABLE public.brain_unlock_events
  ADD CONSTRAINT brain_unlock_events_event_check CHECK (event IN (
    'landing', 'role_picked', 'duo_chosen', 'started', 'check_done',
    'unlock_speed_done', 'unlock_memory_done', 'unlock_focus_done',
    'report_view', 'whatsapp_submitted', 'lead_submit_tried', 'lead_save_failed',
    'share_clicked', 'plan_clicked', 'payment_success'));
ALTER TABLE public.speed_test_results DROP CONSTRAINT IF EXISTS speed_test_results_phone_required_check;
ALTER TABLE public.speed_test_results ALTER COLUMN whatsapp_number SET NOT NULL;
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20261117000001';
