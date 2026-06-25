-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0004_events.sql
-- Description:
-- EventPilot AI core event schema
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    category TEXT,
    venue_name TEXT,
    venue_address TEXT,
    city TEXT,
    country TEXT DEFAULT 'New Zealand',
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    timezone TEXT DEFAULT 'Pacific/Auckland',
    status TEXT NOT NULL DEFAULT 'draft',
    refund_policy TEXT,
    parking_info TEXT,
    ticket_url TEXT,
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_event_slug UNIQUE(workspace_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_events_workspace
ON public.events(workspace_id);

CREATE INDEX IF NOT EXISTS idx_events_status
ON public.events(status);

CREATE INDEX IF NOT EXISTS idx_events_start
ON public.events(starts_at);

DROP TRIGGER IF EXISTS trg_events_updated_at
ON public.events;

CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE
ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.event_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_event_faqs_updated_at
ON public.event_faqs;

CREATE TRIGGER trg_event_faqs_updated_at
BEFORE UPDATE
ON public.event_faqs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.event_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_ticket_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    quantity_total INTEGER NOT NULL DEFAULT 0,
    quantity_available INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_event_ticket_types_updated_at
ON public.event_ticket_types;

CREATE TRIGGER trg_event_ticket_types_updated_at
BEFORE UPDATE
ON public.event_ticket_types
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.events IS 'Core EventPilot AI event records';
COMMENT ON TABLE public.event_faqs IS 'Grounding knowledge for AI responses';
COMMENT ON TABLE public.event_documents IS 'Uploaded event documents';
COMMENT ON TABLE public.event_ticket_types IS 'Ticket categories for an event';

COMMIT;
