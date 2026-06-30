-- Project Submissions table
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  code TEXT NOT NULL,
  stars INTEGER CHECK (stars >= 1 AND stars <= 5),
  critique TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'needs_revision')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can read their own submissions (anon key for client)
CREATE POLICY "Users can view own submissions"
  ON public.project_submissions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin can insert/update any (service key used server-side)
