-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0011_rls.sql
-- Description:
-- Row Level Security policies for workspace isolation
-- ============================================================

BEGIN;

-- ============================================================
-- Helper functions
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_workspace_member(target_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.workspace_members wm
        WHERE wm.workspace_id = target_workspace_id
          AND wm.profile_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_admin(target_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.workspace_members wm
        WHERE wm.workspace_id = target_workspace_id
          AND wm.profile_id = auth.uid()
          AND wm.role IN ('owner', 'admin')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_editor(target_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.workspace_members wm
        WHERE wm.workspace_id = target_workspace_id
          AND wm.profile_id = auth.uid()
          AND wm.role IN ('owner', 'admin', 'editor')
    );
$$;

-- ============================================================
-- Enable RLS
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Profiles
-- ============================================================

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================================
-- Workspaces
-- ============================================================

DROP POLICY IF EXISTS "workspaces_select_member" ON public.workspaces;
CREATE POLICY "workspaces_select_member"
ON public.workspaces
FOR SELECT
USING (public.is_workspace_member(id));

DROP POLICY IF EXISTS "workspaces_insert_auth" ON public.workspaces;
CREATE POLICY "workspaces_insert_auth"
ON public.workspaces
FOR INSERT
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "workspaces_update_admin" ON public.workspaces;
CREATE POLICY "workspaces_update_admin"
ON public.workspaces
FOR UPDATE
USING (public.is_workspace_admin(id))
WITH CHECK (public.is_workspace_admin(id));

-- ============================================================
-- Workspace Members
-- ============================================================

DROP POLICY IF EXISTS "workspace_members_select_member" ON public.workspace_members;
CREATE POLICY "workspace_members_select_member"
ON public.workspace_members
FOR SELECT
USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "workspace_members_insert_admin" ON public.workspace_members;
CREATE POLICY "workspace_members_insert_admin"
ON public.workspace_members
FOR INSERT
WITH CHECK (public.is_workspace_admin(workspace_id));

DROP POLICY IF EXISTS "workspace_members_update_admin" ON public.workspace_members;
CREATE POLICY "workspace_members_update_admin"
ON public.workspace_members
FOR UPDATE
USING (public.is_workspace_admin(workspace_id))
WITH CHECK (public.is_workspace_admin(workspace_id));

-- ============================================================
-- Direct workspace_id tables
-- ============================================================

DROP POLICY IF EXISTS "events_workspace_select" ON public.events;
CREATE POLICY "events_workspace_select" ON public.events
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "events_workspace_insert" ON public.events;
CREATE POLICY "events_workspace_insert" ON public.events
FOR INSERT WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "events_workspace_update" ON public.events;
CREATE POLICY "events_workspace_update" ON public.events
FOR UPDATE USING (public.is_workspace_editor(workspace_id))
WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "customers_workspace_select" ON public.customers;
CREATE POLICY "customers_workspace_select" ON public.customers
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "customers_workspace_insert" ON public.customers;
CREATE POLICY "customers_workspace_insert" ON public.customers
FOR INSERT WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "customers_workspace_update" ON public.customers;
CREATE POLICY "customers_workspace_update" ON public.customers
FOR UPDATE USING (public.is_workspace_editor(workspace_id))
WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "conversations_workspace_select" ON public.conversations;
CREATE POLICY "conversations_workspace_select" ON public.conversations
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "conversations_workspace_insert" ON public.conversations;
CREATE POLICY "conversations_workspace_insert" ON public.conversations
FOR INSERT WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "conversations_workspace_update" ON public.conversations;
CREATE POLICY "conversations_workspace_update" ON public.conversations
FOR UPDATE USING (public.is_workspace_editor(workspace_id))
WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "ai_drafts_workspace_select" ON public.ai_drafts;
CREATE POLICY "ai_drafts_workspace_select" ON public.ai_drafts
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "ai_drafts_workspace_insert" ON public.ai_drafts;
CREATE POLICY "ai_drafts_workspace_insert" ON public.ai_drafts
FOR INSERT WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "ai_content_workspace_select" ON public.ai_content;
CREATE POLICY "ai_content_workspace_select" ON public.ai_content
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "ai_content_workspace_insert" ON public.ai_content;
CREATE POLICY "ai_content_workspace_insert" ON public.ai_content
FOR INSERT WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "leads_workspace_select" ON public.leads;
CREATE POLICY "leads_workspace_select" ON public.leads
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "leads_workspace_insert" ON public.leads;
CREATE POLICY "leads_workspace_insert" ON public.leads
FOR INSERT WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "leads_workspace_update" ON public.leads;
CREATE POLICY "leads_workspace_update" ON public.leads
FOR UPDATE USING (public.is_workspace_editor(workspace_id))
WITH CHECK (public.is_workspace_editor(workspace_id));

DROP POLICY IF EXISTS "audit_logs_workspace_select" ON public.audit_logs;
CREATE POLICY "audit_logs_workspace_select" ON public.audit_logs
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "audit_logs_workspace_insert" ON public.audit_logs;
CREATE POLICY "audit_logs_workspace_insert" ON public.audit_logs
FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "prompts_workspace_select" ON public.prompts;
CREATE POLICY "prompts_workspace_select" ON public.prompts
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "prompts_workspace_insert" ON public.prompts;
CREATE POLICY "prompts_workspace_insert" ON public.prompts
FOR INSERT WITH CHECK (public.is_workspace_admin(workspace_id));

DROP POLICY IF EXISTS "voice_sessions_workspace_select" ON public.voice_sessions;
CREATE POLICY "voice_sessions_workspace_select" ON public.voice_sessions
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "voice_sessions_workspace_insert" ON public.voice_sessions;
CREATE POLICY "voice_sessions_workspace_insert" ON public.voice_sessions
FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "mcp_tools_workspace_select" ON public.mcp_tools;
CREATE POLICY "mcp_tools_workspace_select" ON public.mcp_tools
FOR SELECT USING (workspace_id IS NULL OR public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "mcp_tools_workspace_insert" ON public.mcp_tools;
CREATE POLICY "mcp_tools_workspace_insert" ON public.mcp_tools
FOR INSERT WITH CHECK (workspace_id IS NULL OR public.is_workspace_admin(workspace_id));

DROP POLICY IF EXISTS "mcp_logs_workspace_select" ON public.mcp_logs;
CREATE POLICY "mcp_logs_workspace_select" ON public.mcp_logs
FOR SELECT USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "mcp_logs_workspace_insert" ON public.mcp_logs;
CREATE POLICY "mcp_logs_workspace_insert" ON public.mcp_logs
FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));

-- ============================================================
-- Child tables using parent ownership
-- ============================================================

DROP POLICY IF EXISTS "event_faqs_select" ON public.event_faqs;
CREATE POLICY "event_faqs_select" ON public.event_faqs
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_faqs.event_id
        AND public.is_workspace_member(e.workspace_id)
    )
);

DROP POLICY IF EXISTS "event_faqs_insert" ON public.event_faqs;
CREATE POLICY "event_faqs_insert" ON public.event_faqs
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_faqs.event_id
        AND public.is_workspace_editor(e.workspace_id)
    )
);

DROP POLICY IF EXISTS "event_documents_select" ON public.event_documents;
CREATE POLICY "event_documents_select" ON public.event_documents
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_documents.event_id
        AND public.is_workspace_member(e.workspace_id)
    )
);

DROP POLICY IF EXISTS "event_ticket_types_select" ON public.event_ticket_types;
CREATE POLICY "event_ticket_types_select" ON public.event_ticket_types
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.events e
        WHERE e.id = event_ticket_types.event_id
        AND public.is_workspace_member(e.workspace_id)
    )
);

DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "messages_select" ON public.messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
        AND public.is_workspace_member(c.workspace_id)
    )
);

DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_insert" ON public.messages
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
        AND public.is_workspace_editor(c.workspace_id)
    )
);

DROP POLICY IF EXISTS "prompt_versions_select" ON public.prompt_versions;
CREATE POLICY "prompt_versions_select" ON public.prompt_versions
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.prompts p
        WHERE p.id = prompt_versions.prompt_id
        AND public.is_workspace_member(p.workspace_id)
    )
);

DROP POLICY IF EXISTS "approvals_select" ON public.approvals;
CREATE POLICY "approvals_select" ON public.approvals
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.ai_drafts d
        WHERE d.id = approvals.draft_id
        AND public.is_workspace_member(d.workspace_id)
    )
);

DROP POLICY IF EXISTS "approvals_update" ON public.approvals;
CREATE POLICY "approvals_update" ON public.approvals
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.ai_drafts d
        WHERE d.id = approvals.draft_id
        AND public.is_workspace_editor(d.workspace_id)
    )
);

DROP POLICY IF EXISTS "lead_notes_select" ON public.lead_notes;
CREATE POLICY "lead_notes_select" ON public.lead_notes
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.leads l
        WHERE l.id = lead_notes.lead_id
        AND public.is_workspace_member(l.workspace_id)
    )
);

DROP POLICY IF EXISTS "lead_activities_select" ON public.lead_activities;
CREATE POLICY "lead_activities_select" ON public.lead_activities
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.leads l
        WHERE l.id = lead_activities.lead_id
        AND public.is_workspace_member(l.workspace_id)
    )
);

DROP POLICY IF EXISTS "voice_commands_select" ON public.voice_commands;
CREATE POLICY "voice_commands_select" ON public.voice_commands
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.voice_sessions s
        WHERE s.id = voice_commands.session_id
        AND public.is_workspace_member(s.workspace_id)
    )
);

COMMIT;
