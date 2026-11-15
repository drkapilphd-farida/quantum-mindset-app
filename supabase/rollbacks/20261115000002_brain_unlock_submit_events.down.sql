-- Rollback for 20261115000002_brain_unlock_submit_events: deletes the two new
-- events' rows, then restores the original 13-event CHECK.
DELETE FROM public.brain_unlock_events WHERE event IN ('lead_submit_tried', 'lead_save_failed');
ALTER TABLE public.brain_unlock_events DROP CONSTRAINT IF EXISTS brain_unlock_events_event_check;
ALTER TABLE public.brain_unlock_events
  ADD CONSTRAINT brain_unlock_events_event_check CHECK (event IN (
    'landing', 'role_picked', 'duo_chosen', 'started', 'check_done',
    'unlock_speed_done', 'unlock_memory_done', 'unlock_focus_done',
    'report_view', 'whatsapp_submitted', 'share_clicked', 'plan_clicked', 'payment_success'));
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20261115000002';
