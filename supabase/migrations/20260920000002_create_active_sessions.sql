-- ─────────────────────────────────────────────────────────────────────────────
-- 20260920000002_create_active_sessions
--
-- Single-Device Login Enforcement™ (see the "Pre-Launch Audit Fix Pass"
-- task, Phase 7) — a graceful handoff, not a hard lock: a signed-in
-- account may only be ACTIVELY used from one device/browser at a time,
-- but a genuine user switching between their own devices (a real,
-- expected pattern for QSR students moving between a phone and a
-- laptop) is never silently blocked, only asked to confirm a takeover
-- when the other device is still recently active.
--
-- One row per user (user_id is the primary key, not a separate id/fk
-- pair) — there is only ever one "current" claimed session per account
-- by design; a new claim overwrites the row in place rather than
-- growing a history table. session_id is this app's own opaque token
-- (never a Supabase Auth internal id), minted fresh on every claim and
-- mirrored into a same-named httpOnly cookie on the winning device —
-- see activeSessionGate.ts for the full claim/conflict/enforcement
-- logic built on top of this table.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.active_sessions (
  user_id        uuid        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  session_id     uuid        NOT NULL DEFAULT gen_random_uuid(),
  -- A short, human-readable device/browser label derived from the
  -- User-Agent (e.g. "Chrome on Windows") — never the raw UA string, and
  -- nothing more invasive (no IP, no precise fingerprint). Purely so a
  -- future "log out other device" UI could show something meaningful;
  -- not itself part of the security check.
  device_label   text,
  last_active_at timestamptz NOT NULL DEFAULT now(),
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "active_sessions_select_own"
  ON public.active_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "active_sessions_insert_own"
  ON public.active_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "active_sessions_update_own"
  ON public.active_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- An explicit sign-out (signOut.ts) relinquishes the claim entirely
-- rather than leaving a stale row behind — see that action's own doc
-- comment for why.
CREATE POLICY "active_sessions_delete_own"
  ON public.active_sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
