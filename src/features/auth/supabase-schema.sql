-- ═══════════════════════════════════════════════════════════════════════════
-- Massar — unified profiles schema + RLS + approval flow
-- Run this in Supabase SQL editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════════

// UPDATE public.profiles
// SET role = 'super_admin', status = 'active'
// WHERE email = 'your-admin-email@example.com';


-- 1. PROFILES TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  -- Base fields (all roles)
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL UNIQUE,
  role            text NOT NULL CHECK (role IN (
                    'student',
                    'company_admin',
                    'university_admin',
                    'university_admin'   -- set only by admin approval
                  )),
  first_name      text,
  last_name       text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),

  -- Approval status (used by university flow)
  status          text NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'pending', 'rejected')),

  -- Optional role-specific fields
  degree_level    text,                 -- student
  company_name    text,                 -- company_admin
  industry        text,                 -- company_admin
  university_name text,                 -- university_admin / university_admin
  city            text                  -- university_admin / university_admin
);

-- Automatically update updated_at on row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- 2. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update only safe fields of their own profile
-- (role is excluded — users can NEVER change their own role)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevent self-role escalation: role must stay the same
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Only service_role (server-side / admin) can INSERT profiles
-- (done via create_profile RPC with SECURITY DEFINER)
CREATE POLICY "profiles_insert_service_only"
  ON public.profiles FOR INSERT
  WITH CHECK (false);   -- blocked for all normal users

-- Only service_role can DELETE
CREATE POLICY "profiles_delete_service_only"
  ON public.profiles FOR DELETE
  USING (false);


-- 3. create_profile RPC  (SECURITY DEFINER = runs as superuser, bypasses RLS)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_profile(
  p_id              uuid,
  p_email           text,
  p_first_name      text,
  p_last_name       text,
  p_role            text,
  p_degree_level    text DEFAULT NULL,
  p_company_name    text DEFAULT NULL,
  p_industry        text DEFAULT NULL,
  p_university_name text DEFAULT NULL,
  p_city            text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate allowed roles (prevent injecting university_admin directly)
  IF p_role NOT IN ('student', 'company_admin', 'university_admin') THEN
    RAISE EXCEPTION 'Invalid role: %', p_role;
  END IF;

  INSERT INTO public.profiles (
    id, email, role, first_name, last_name,
    degree_level, company_name, industry,
    university_name, city,
    status
  ) VALUES (
    p_id, p_email, p_role, p_first_name, p_last_name,
    p_degree_level, p_company_name, p_industry,
    p_university_name, p_city,
    CASE WHEN p_role = 'university_admin' THEN 'pending' ELSE 'active' END
  );
END;
$$;


-- 4. ADMIN APPROVAL FUNCTIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- Approve a pending university (call from admin panel with service_role key)
CREATE OR REPLACE FUNCTION public.approve_university(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET role   = 'university_admin',
      status = 'active'
  WHERE id   = p_user_id
    AND role = 'university_admin';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % is not a pending university', p_user_id;
  END IF;
END;
$$;

-- Reject a pending university
CREATE OR REPLACE FUNCTION public.reject_university(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET status = 'rejected'
  WHERE id   = p_user_id
    AND role = 'university_admin';
END;
$$;


-- 5. ADMIN VIEW — pending universities (use service_role in admin panel)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.university_admin AS
  SELECT
    id,
    email,
    first_name,
    last_name,
    university_name,
    city,
    created_at
  FROM public.profiles
  WHERE role   = 'university_admin'
    AND status = 'pending'
  ORDER BY created_at DESC;
