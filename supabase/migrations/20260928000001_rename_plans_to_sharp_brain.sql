-- site-rebuild Phase 5B: "Quantum Speed Reading" is now Sharp Brain™ and the
-- app is the Mind Ur Mind App. Display text only — plan keys
-- ('qsr-masterclass', 'qsr-app-continued') and ids are unchanged, so
-- entitlements, webhooks and existing subscriptions are unaffected.
UPDATE public.plans
SET
  name = 'Sharp Brain 30-Day Program',
  description = '7 live classes with Dr. Kapil Dev Sharma plus 30 days of practice in the Mind Ur Mind App (reading speed and comprehension tracking) — one-time enrolment.'
WHERE key = 'qsr-masterclass';

UPDATE public.plans
SET
  name = 'Mind Ur Mind App — Continued Practice Access',
  description = 'Continued access to the Mind Ur Mind App''s daily practice tools after completing the Sharp Brain 30-Day Program.'
WHERE key = 'qsr-app-continued';
