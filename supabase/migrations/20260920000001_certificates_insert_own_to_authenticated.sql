-- ─────────────────────────────────────────────────────────────────────────────
-- 20260920000001_certificates_insert_own_to_authenticated
--
-- Pre-Launch Audit Fix Pass, Phase 6 — certificates_insert_own (see
-- 20260627000004_create_certificates.sql) was created with no `TO`
-- clause, defaulting it to PUBLIC (applies to anon too). Its own
-- `WITH CHECK (auth.uid() = user_id)` already made this unexploitable —
-- auth.uid() is null for an anonymous request, which can never equal a
-- real user_id — but every other insert/update-own policy in this
-- project is scoped `TO authenticated` explicitly. Bringing this one in
-- line is a consistency fix, not a real vulnerability patch.
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY "certificates_insert_own" ON public.certificates;

CREATE POLICY "certificates_insert_own"
  ON public.certificates FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
