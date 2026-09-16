-- ─────────────────────────────────────────────────────────────────────────────
-- 20260916000001_create_overthinking_test_leads
--
-- Overthinking Test™ (/mind-assessment) — 15-statement, 3-category
-- self-awareness quiz, final step. Captures Full Name + WhatsApp Number
-- alongside the three 0–20 category scores and the 0–60 overall sum, so
-- the full personalized report and the 21-Day Mind Reset System invite
-- can be followed up on via WhatsApp after the visitor unlocks their
-- report. Same shape/purpose as public.leads (the Discover Your Learning
-- Potential 2-minute assessment lead magnet) — a dedicated table rather
-- than reusing that one, since its reading_wpm/memory_percent/
-- focus_percent columns are a different quiz's fixed shape, not this
-- one's.
--
-- Reached BEFORE any sign-in by design — the whole point of the flow is
-- to capture contact info for a visitor who has no account yet. RLS is
-- insert-only for the anon role rather than the usual auth.uid()-scoped
-- policy: no SELECT policy is defined for anon or authenticated, since a
-- name + WhatsApp number is PII that no other visitor should ever be
-- able to read back through the public API. Reading leads back is a
-- service-role-only (admin/back-office) operation.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.overthinking_test_leads (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name          text        NOT NULL,
  whatsapp_number    text        NOT NULL,
  overthinking_score integer     NOT NULL CHECK (overthinking_score BETWEEN 0 AND 20),
  worry_score        integer     NOT NULL CHECK (worry_score BETWEEN 0 AND 20),
  stress_score       integer     NOT NULL CHECK (stress_score BETWEEN 0 AND 20),
  overall_score      integer     NOT NULL CHECK (overall_score BETWEEN 0 AND 60),
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX overthinking_test_leads_created_at_idx ON public.overthinking_test_leads (created_at DESC);

ALTER TABLE public.overthinking_test_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "overthinking_test_leads_insert_anonymous"
  ON public.overthinking_test_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
