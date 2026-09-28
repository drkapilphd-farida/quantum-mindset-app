-- STAGING ONLY: 30-Day Program access for the test accounts.
INSERT INTO public.profiles (id, full_name, email)
SELECT u.id, u.raw_user_meta_data->>'full_name', u.email FROM auth.users u
WHERE u.email LIKE 'mindurmindlab+%@gmail.com'
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
INSERT INTO public.subscriptions (user_id, plan_id, status)
SELECT u.id, p.id, 'active' FROM auth.users u CROSS JOIN public.plans p
WHERE u.email LIKE 'mindurmindlab+%@gmail.com' AND p.key = 'qsr-masterclass'
  AND NOT EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.user_id = u.id AND s.plan_id = p.id);
SELECT u.email, (SELECT count(*) FROM public.subscriptions s WHERE s.user_id = u.id) AS subs, (SELECT full_name FROM public.profiles pr WHERE pr.id = u.id) AS name
FROM auth.users u WHERE u.email LIKE 'mindurmindlab+%@gmail.com' ORDER BY u.email;
