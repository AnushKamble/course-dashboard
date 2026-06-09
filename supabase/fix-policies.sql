-- Fix: Create a security definer function to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Drop problematic policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate with safe policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Update other policies to use the helper function too
DROP POLICY IF EXISTS "Admins can insert lectures" ON public.lectures;
CREATE POLICY "Admins can insert lectures"
  ON public.lectures FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update lectures" ON public.lectures;
CREATE POLICY "Admins can update lectures"
  ON public.lectures FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
CREATE POLICY "Admins can insert questions"
  ON public.questions FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all submissions" ON public.submissions;
CREATE POLICY "Admins can view all submissions"
  ON public.submissions FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update submissions" ON public.submissions;
CREATE POLICY "Admins can update submissions"
  ON public.submissions FOR UPDATE
  USING (public.is_admin());
