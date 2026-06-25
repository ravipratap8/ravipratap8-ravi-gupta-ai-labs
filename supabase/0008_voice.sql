-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0008_voice.sql
-- Description:
-- Voice Copilot schema
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.voice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    input_mode TEXT DEFAULT 'voice',
    output_mode TEXT DEFAULT 'speech',
    language_code TEXT DEFAULT 'en-NZ',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_sessions_workspace
ON public.voice_sessions(workspace_id);

CREATE TABLE IF NOT EXISTS public.voice_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.voice_sessions(id) ON DELETE CASCADE,
    transcript TEXT NOT NULL,
    detected_intent TEXT,
    confidence_score NUMERIC(5,2),
    mcp_tool TEXT,
    action_taken TEXT,
    approval_required BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES public.profiles(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_commands_session
ON public.voice_commands(session_id);

COMMENT ON TABLE public.voice_sessions IS 'Voice Copilot user sessions';
COMMENT ON TABLE public.voice_commands IS 'Voice transcripts, detected intents and routed actions';

COMMIT;
