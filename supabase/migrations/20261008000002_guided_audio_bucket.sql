-- ─────────────────────────────────────────────────────────────────────────────
-- 20261008000002_guided_audio_bucket
--
-- Recorded guided-voice audio (Phase 2, Part D): one MP3 per script line plus
-- a manifest.json per language, at guided-audio/<exercise>/<lang>/<file>.
-- Public read (the same audio for every learner, no personal data); there is
-- deliberately no INSERT/UPDATE/DELETE policy, so only the service role (the
-- upload script) can write. Add-only.
--
-- Rollback: supabase/rollbacks/20261008000002_guided_audio_bucket.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('guided-audio', 'guided-audio', true, 2097152, ARRAY['audio/mpeg', 'application/json'])
ON CONFLICT (id) DO NOTHING;
