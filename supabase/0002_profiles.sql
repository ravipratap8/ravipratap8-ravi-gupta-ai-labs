-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0002_profiles.sql
-- Description:
-- Creates user profiles linked to Supabase Auth.
-- ============================================================

BEGIN;

-- ============================================================
-- Profiles
-- One profile per authenticated Supabase user
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    full_name TEXT,

    display_name TEXT,

    avatar_url TEXT,

    company_name TEXT,

    job_title TEXT,

    phone TEXT,

    timezone TEXT DEFAULT 'Pacific/Auckland',

    country TEXT DEFAULT 'New Zealand',

    onboarding_completed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS
'Stores additional user information for authenticated users.';

CREATE INDEX IF NOT EXISTS idx_profiles_display_name
ON public.profiles(display_name);

CREATE INDEX IF NOT EXISTS idx_profiles_company
ON public.profiles(company_name);

-- ============================================================
-- Updated At Trigger
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at
ON public.profiles;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Automatically create profile after signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN

INSERT INTO public.profiles (
    id,
    full_name,
    display_name,
    avatar_url
)
VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        NEW.email
    ),
    NEW.raw_user_meta_data->>'avatar_url'
);

RETURN NEW;

END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT
ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

COMMIT;