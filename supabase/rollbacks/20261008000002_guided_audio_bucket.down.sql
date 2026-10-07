-- Rollback for 20261008000002_guided_audio_bucket. Empty the bucket first
-- (Storage API or dashboard); a bucket that still holds files can't be deleted.
DELETE FROM storage.buckets WHERE id = 'guided-audio';
