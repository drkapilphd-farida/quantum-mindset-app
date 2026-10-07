-- Rollback for 20261009000001_reading_tests. Deletes every fair reading test
-- result — export the table first if anything should be kept.
DROP TABLE IF EXISTS public.reading_tests;
