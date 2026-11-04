-- New live-class cycle (founder, 4 Nov 2026): Mon & Thu, 8:00–9:00 pm IST,
-- from Mon 9 Nov 2026 (src/config/liveClassCycle.ts). Class 5 on Thu 5 Nov
-- (7–9 pm) stays; the old cycle's Class 6 (Thu 12 Nov) and Class 7 (Sun
-- 15 Nov) are cancelled — learners registered for them see "cancelled" and
-- can register for the same class in the new cycle (26 / 30 Nov).
-- Safe to re-run.
UPDATE public.live_class_sessions
SET status = 'cancelled'
WHERE status = 'published'
  AND starts_at IN ('2026-11-12 19:00+05:30'::timestamptz, '2026-11-15 19:00+05:30'::timestamptz);

INSERT INTO public.live_class_sessions (class_number, starts_at, ends_at)
SELECT v.n, (v.d || ' 20:00+05:30')::timestamptz, (v.d || ' 21:00+05:30')::timestamptz
FROM (VALUES (1, '2026-11-09'), (2, '2026-11-12'), (3, '2026-11-16'), (4, '2026-11-19'), (5, '2026-11-23'), (6, '2026-11-26'), (7, '2026-11-30')) AS v(n, d)
WHERE NOT EXISTS (
  SELECT 1 FROM public.live_class_sessions s WHERE s.class_number = v.n AND s.starts_at = (v.d || ' 20:00+05:30')::timestamptz
);
