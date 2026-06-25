-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0006_ai.sql
-- Description:
-- AI drafts, approvals, prompts and generated content
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    active_version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_prompts_updated_at ON public.prompts;
CREATE TRIGGER trg_prompts_updated_at
BEFORE UPDATE ON public.prompts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.prompt_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    prompt_text TEXT NOT NULL,
    model_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(prompt_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.ai_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    prompt_version_id UUID REFERENCES public.prompt_versions(id),
    draft_type TEXT NOT NULL,
    content TEXT NOT NULL,
    confidence_score NUMERIC(5,2),
    risk_level TEXT DEFAULT 'low',
    status TEXT DEFAULT 'pending',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_drafts_workspace
ON public.ai_drafts(workspace_id);

CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draft_id UUID NOT NULL REFERENCES public.ai_drafts(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id),
    decision TEXT DEFAULT 'pending',
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.ai_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    content_type TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    generated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id),
    entity_type TEXT NOT NULL,
    entity_id UUID,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.ai_drafts IS 'AI generated drafts awaiting review';
COMMENT ON TABLE public.approvals IS 'Human-in-the-loop approvals';
COMMENT ON TABLE public.ai_content IS 'Generated marketing and communication content';
COMMENT ON TABLE public.audit_logs IS 'Audit trail for AI and user actions';

COMMIT;
