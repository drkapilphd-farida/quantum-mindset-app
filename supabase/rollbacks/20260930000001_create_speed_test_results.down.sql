-- Rollback for 20260930000001_create_speed_test_results.
-- Drops every stored speed-test result (and the WhatsApp numbers in it).
DROP TABLE IF EXISTS public.speed_test_results;
