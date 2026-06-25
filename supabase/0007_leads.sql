-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0007_leads.sql
-- Description:
-- CRM Leads
-- ============================================================

BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='lead_stage') THEN
        CREATE TYPE lead_stage AS ENUM (
            'new',
            'qualified',
            'proposal',
            'won',
            'lost'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT,
    stage lead_stage NOT NULL DEFAULT 'new',
    value NUMERIC(12,2) DEFAULT 0,
    probability INTEGER DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
    source TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    ai_classification TEXT,
    ai_confidence NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_workspace
ON public.leads(workspace_id);

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id),
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_details TEXT,
    performed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.leads IS 'CRM pipeline records';
COMMENT ON TABLE public.lead_notes IS 'Internal notes';
COMMENT ON TABLE public.lead_activities IS 'Lead activity timeline';

COMMIT;
