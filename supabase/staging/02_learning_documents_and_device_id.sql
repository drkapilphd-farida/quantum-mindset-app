-- STAGING ONLY: match production objects that no migration creates.
CREATE TABLE IF NOT EXISTS public.learning_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  processed_content jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.learning_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "learning_documents_own" ON public.learning_documents;
CREATE POLICY "learning_documents_own" ON public.learning_documents FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_device_id text;
SELECT 'ok' AS result;
