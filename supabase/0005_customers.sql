-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0005_customers.sql
-- Description:
-- Customers, conversations and messages
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email CITEXT,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_workspace
ON public.customers(workspace_id);

DROP TRIGGER IF EXISTS trg_customers_updated_at
ON public.customers;

CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE
ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    channel TEXT NOT NULL DEFAULT 'web',
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_conversations_updated_at
ON public.conversations;

CREATE TRIGGER trg_conversations_updated_at
BEFORE UPDATE
ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL,
    message TEXT NOT NULL,
    ai_generated BOOLEAN DEFAULT FALSE,
    confidence_score NUMERIC(5,2),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
ON public.messages(conversation_id);

COMMENT ON TABLE public.customers IS 'Customer master records';
COMMENT ON TABLE public.conversations IS 'Conversation threads across web, WhatsApp, email and voice';
COMMENT ON TABLE public.messages IS 'Individual conversation messages';

COMMIT;
