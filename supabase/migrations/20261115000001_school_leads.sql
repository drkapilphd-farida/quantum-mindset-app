-- ─────────────────────────────────────────────────────────────────────────────
-- 20261115000001_school_leads
--
-- "Sharp Brain for Schools" (/schools): the EEG Brain & Focus Assessment page
-- for principals and school management.
--
-- 1. school_leads: "Book a free pilot" form submissions. Same insert-only
--    shape as franchise_leads: a visitor fills it in before any sign-in, so
--    anon/authenticated may INSERT a new row (status 'new', no admin notes),
--    and nobody may read, update or delete through the public API. The admin
--    page /admin/school-leads reads and updates with the service role.
-- 2. school_page_settings: one JSON row (id = 1) edited on
--    /admin/school-leads → Page settings: hero photo/video, sample Brain
--    Passport images, Day 1 vs Day 30 example values, package prices, real
--    school results, FAQ edits. RLS on, no policies (service role only).
-- 3. school-media bucket: the images/video for that page. Public read (the
--    page shows them to every visitor; sample reports use fictional names
--    only); no write policy, so only the service role (signed upload URLs
--    from the admin page) can add files.
--
-- Add-only. school_name / contact_name / phone / email are personal data —
-- never logged.
--
-- Rollback: supabase/rollbacks/20261115000001_school_leads.down.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Leads ────────────────────────────────────────────────────────────────────
CREATE TABLE public.school_leads (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name      text        NOT NULL CHECK (char_length(school_name) BETWEEN 2 AND 150),
  city             text        NOT NULL CHECK (char_length(city) BETWEEN 2 AND 100),
  contact_name     text        NOT NULL CHECK (char_length(contact_name) BETWEEN 2 AND 100),
  role             text        NOT NULL CHECK (role IN ('principal', 'director', 'vice_principal', 'coordinator', 'teacher', 'other')),
  phone            text        NOT NULL CHECK (phone ~ '^\+91[6-9][0-9]{9}$'),
  email            text        CHECK (email IS NULL OR char_length(email) <= 254),
  students         integer     CHECK (students IS NULL OR students BETWEEN 1 AND 100000),
  preferred_month  text        CHECK (preferred_month IS NULL OR preferred_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  message          text        CHECK (message IS NULL OR char_length(message) <= 1000),
  lang             text        NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'hi')),
  utm_source       text        CHECK (utm_source   IS NULL OR char_length(utm_source)   <= 200),
  utm_medium       text        CHECK (utm_medium   IS NULL OR char_length(utm_medium)   <= 200),
  utm_campaign     text        CHECK (utm_campaign IS NULL OR char_length(utm_campaign) <= 200),
  utm_term         text        CHECK (utm_term     IS NULL OR char_length(utm_term)     <= 200),
  utm_content      text        CHECK (utm_content  IS NULL OR char_length(utm_content)  <= 200),
  status           text        NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'pilot_booked', 'camp', 'program', 'not_now')),
  notes            text        CHECK (notes IS NULL OR char_length(notes) <= 4000),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX school_leads_created_at_idx ON public.school_leads (created_at DESC);
CREATE INDEX school_leads_status_idx ON public.school_leads (status);

CREATE TRIGGER set_school_leads_updated_at
  BEFORE UPDATE ON public.school_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.school_leads ENABLE ROW LEVEL SECURITY;

-- Insert only, and only as a fresh lead (a visitor can't set a status or notes).
CREATE POLICY "school_leads_insert_form"
  ON public.school_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new' AND notes IS NULL);

-- 2. Page settings ────────────────────────────────────────────────────────────
CREATE TABLE public.school_page_settings (
  id         smallint    PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  settings   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text        CHECK (updated_by IS NULL OR char_length(updated_by) <= 254)
);

ALTER TABLE public.school_page_settings ENABLE ROW LEVEL SECURITY;

-- 3. Media bucket ─────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('school-media', 'school-media', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4'])
ON CONFLICT (id) DO NOTHING;
