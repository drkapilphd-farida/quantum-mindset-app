-- STAGING ONLY: pre-Phase-8 progress for the legacy test account.
INSERT INTO public.curriculum_day_completions (user_id, day, raw_wpm, true_wpm, comprehension_accuracy_percent, completed_at)
SELECT u.id, d, CASE WHEN d = 1 THEN 210 END, CASE WHEN d = 1 THEN 195 END, CASE WHEN d = 1 THEN 80 END, now() - make_interval(days => 10 - d)
FROM auth.users u CROSS JOIN generate_series(1, 5) AS d
WHERE u.email = 'mindurmindlab+legacy@gmail.com'
ON CONFLICT DO NOTHING;
SELECT count(*) AS legacy_days FROM public.curriculum_day_completions c JOIN auth.users u ON u.id = c.user_id WHERE u.email = 'mindurmindlab+legacy@gmail.com';
