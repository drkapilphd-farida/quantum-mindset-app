-- Rollback of 20261018000001_memory_group_a. Drops the two new tables; the
-- method check goes back to story/peg only after removing rows of the new methods.
DROP TABLE IF EXISTS public.chapter_maps;
DROP TABLE IF EXISTS public.memory_palaces;
DELETE FROM public.memory_creations WHERE method NOT IN ('story', 'peg');
ALTER TABLE public.memory_creations DROP CONSTRAINT IF EXISTS memory_creations_method_check;
ALTER TABLE public.memory_creations ADD CONSTRAINT memory_creations_method_check CHECK (method IN ('story', 'peg'));
