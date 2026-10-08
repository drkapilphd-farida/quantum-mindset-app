-- First live-class cycle (approved by the founder, 8 Oct 2026), 7:00–9:00 pm IST.
-- Sun 8 Nov skipped for Diwali; no Wednesdays (free demo class). Safe to re-run.
INSERT INTO public.live_class_sessions (class_number, starts_at, ends_at)
SELECT v.n, (v.d || ' 19:00+05:30')::timestamptz, (v.d || ' 21:00+05:30')::timestamptz
FROM (VALUES (1, '2026-10-18'), (2, '2026-10-25'), (3, '2026-10-29'), (4, '2026-11-01'), (5, '2026-11-05'), (6, '2026-11-12'), (7, '2026-11-15')) AS v(n, d)
WHERE NOT EXISTS (
  SELECT 1 FROM public.live_class_sessions s WHERE s.class_number = v.n AND s.starts_at = (v.d || ' 19:00+05:30')::timestamptz
);
