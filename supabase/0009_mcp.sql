-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0009_mcp.sql
-- Description:
-- MCP Tool Registry & Execution Logs
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.mcp_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    tool_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    input_schema JSONB DEFAULT '{}'::jsonb,
    output_schema JSONB DEFAULT '{}'::jsonb,
    version TEXT DEFAULT '1.0.0',
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, tool_name)
);

DROP TRIGGER IF EXISTS trg_mcp_tools_updated_at
ON public.mcp_tools;

CREATE TRIGGER trg_mcp_tools_updated_at
BEFORE UPDATE
ON public.mcp_tools
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.mcp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES public.mcp_tools(id) ON DELETE SET NULL,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    request_payload JSONB DEFAULT '{}'::jsonb,
    response_payload JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'success',
    duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mcp_logs_workspace
ON public.mcp_logs(workspace_id);

CREATE INDEX IF NOT EXISTS idx_mcp_logs_tool
ON public.mcp_logs(tool_id);

COMMENT ON TABLE public.mcp_tools IS 'Registry of MCP tools exposed by the platform.';
COMMENT ON TABLE public.mcp_logs IS 'Execution history of MCP tool calls.';

COMMIT;
