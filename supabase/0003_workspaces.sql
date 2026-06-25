-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0003_workspaces.sql
-- Description:
-- Multi-tenant workspace model
-- ============================================================

BEGIN;

-- ============================================================
-- Workspace Roles
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'workspace_role'
    ) THEN
        CREATE TYPE workspace_role AS ENUM (
            'owner',
            'admin',
            'editor',
            'viewer'
        );
    END IF;
END $$;

-- ============================================================
-- Workspaces
-- ============================================================

CREATE TABLE IF NOT EXISTS public.workspaces (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    slug TEXT UNIQUE NOT NULL,

    description TEXT,

    logo_url TEXT,

    website TEXT,

    owner_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

COMMENT ON TABLE public.workspaces IS
'Each organisation/user owns one or more workspaces.';

CREATE INDEX IF NOT EXISTS idx_workspaces_owner
ON public.workspaces(owner_id);

CREATE INDEX IF NOT EXISTS idx_workspaces_slug
ON public.workspaces(slug);

DROP TRIGGER IF EXISTS trg_workspaces_updated_at
ON public.workspaces;

CREATE TRIGGER trg_workspaces_updated_at
BEFORE UPDATE
ON public.workspaces
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Workspace Members
-- ============================================================

CREATE TABLE IF NOT EXISTS public.workspace_members (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workspace_id UUID NOT NULL
        REFERENCES public.workspaces(id)
        ON DELETE CASCADE,

    profile_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,

    role workspace_role NOT NULL DEFAULT 'viewer',

    invited_by UUID
        REFERENCES public.profiles(id),

    joined_at TIMESTAMPTZ DEFAULT NOW(),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(workspace_id, profile_id)

);

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace
ON public.workspace_members(workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspace_members_profile
ON public.workspace_members(profile_id);

DROP TRIGGER IF EXISTS trg_workspace_members_updated_at
ON public.workspace_members;

CREATE TRIGGER trg_workspace_members_updated_at
BEFORE UPDATE
ON public.workspace_members
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Automatically create first workspace
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_default_workspace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_workspace UUID;
BEGIN

INSERT INTO public.workspaces (

    name,
    slug,
    owner_id

)

VALUES (

    COALESCE(NEW.display_name,'My Workspace'),

    lower(
        replace(
            COALESCE(NEW.display_name,'workspace'),
            ' ',
            '-'
        )
    ) || '-' || substr(NEW.id::text,1,8),

    NEW.id

)

RETURNING id
INTO new_workspace;

INSERT INTO public.workspace_members (

    workspace_id,
    profile_id,
    role

)

VALUES (

    new_workspace,
    NEW.id,
    'owner'

);

RETURN NEW;

END;
$$;

DROP TRIGGER IF EXISTS trg_create_workspace
ON public.profiles;

CREATE TRIGGER trg_create_workspace
AFTER INSERT
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_default_workspace();

COMMIT;