-- STAGING ONLY: objects that exist in production but were created outside migrations.
CREATE TABLE IF NOT EXISTS public.quantum_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  raw_text text NOT NULL,
  ai_summary text,
  spider_notes jsonb,
  keywords text[],
  quiz_questions jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
SELECT 'ok' AS result;
