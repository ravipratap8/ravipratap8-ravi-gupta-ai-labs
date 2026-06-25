-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0012_seed.sql
-- Description:
-- Safe starter seed data for MCP tools and prompt templates.
-- This file does not create user-specific workspace data.
-- User workspaces are created automatically after signup.
-- ============================================================

BEGIN;

-- ============================================================
-- Global MCP tools
-- workspace_id NULL means available as platform-level tool definitions.
-- Actual execution must still enforce workspace security.
-- ============================================================

INSERT INTO public.mcp_tools (
    workspace_id,
    tool_name,
    display_name,
    description,
    input_schema,
    output_schema,
    version,
    is_enabled
)
VALUES
(
    NULL,
    'create_event',
    'Create Event',
    'Creates a new EventPilot AI event inside a workspace.',
    '{
      "type": "object",
      "required": ["workspace_id", "title", "starts_at"],
      "properties": {
        "workspace_id": { "type": "string", "format": "uuid" },
        "title": { "type": "string" },
        "starts_at": { "type": "string", "format": "date-time" },
        "venue_name": { "type": "string" },
        "city": { "type": "string" }
      }
    }'::jsonb,
    '{
      "type": "object",
      "properties": {
        "event_id": { "type": "string", "format": "uuid" },
        "status": { "type": "string" }
      }
    }'::jsonb,
    '1.0.0',
    TRUE
),
(
    NULL,
    'get_events',
    'Get Events',
    'Returns events available to the authenticated user workspace.',
    '{
      "type": "object",
      "required": ["workspace_id"],
      "properties": {
        "workspace_id": { "type": "string", "format": "uuid" },
        "status": { "type": "string" }
      }
    }'::jsonb,
    '{
      "type": "object",
      "properties": {
        "events": { "type": "array" }
      }
    }'::jsonb,
    '1.0.0',
    TRUE
),
(
    NULL,
    'search_event_faq',
    'Search Event FAQ',
    'Searches event FAQs for grounded AI customer responses.',
    '{
      "type": "object",
      "required": ["event_id", "query"],
      "properties": {
        "event_id": { "type": "string", "format": "uuid" },
        "query": { "type": "string" }
      }
    }'::jsonb,
    '{
      "type": "object",
      "properties": {
        "answers": { "type": "array" }
      }
    }'::jsonb,
    '1.0.0',
    TRUE
),
(
    NULL,
    'generate_customer_reply',
    'Generate Customer Reply',
    'Generates a grounded customer reply requiring human approval before sending.',
    '{
      "type": "object",
      "required": ["workspace_id", "message"],
      "properties": {
        "workspace_id": { "type": "string", "format": "uuid" },
        "event_id": { "type": "string", "format": "uuid" },
        "message": { "type": "string" }
      }
    }'::jsonb,
    '{
      "type": "object",
      "properties": {
        "draft": { "type": "string" },
        "confidence_score": { "type": "number" },
        "risk_level": { "type": "string" }
      }
    }'::jsonb,
    '1.0.0',
    TRUE
),
(
    NULL,
    'classify_message',
    'Classify Message',
    'Classifies a customer message into enquiry, complaint, refund, lead, sponsorship, or vendor category.',
    '{
      "type": "object",
      "required": ["message"],
      "properties": {
        "message": { "type": "string" }
      }
    }'::jsonb,
    '{
      "type": "object",
      "properties": {
        "category": { "type": "string" },
        "confidence_score": { "type": "number" }
      }
    }'::jsonb,
    '1.0.0',
    TRUE
),
(
    NULL,
    'create_lead',
    'Create Lead',
    'Creates a CRM lead from a customer enquiry.',
    '{
      "type": "object",
      "required": ["workspace_id", "title"],
      "properties": {
        "workspace_id": { "type": "string", "format": "uuid" },
        "title": { "type": "string" },
        "category": { "type": "string" },
        "value": { "type": "number" }
      }
    }'::jsonb,
    '{
      "type": "object",
      "properties": {
        "lead_id": { "type": "string", "format": "uuid" },
        "stage": { "type": "string" }
      }
    }'::jsonb,
    '1.0.0',
    TRUE
),
(
    NULL,
    'approve_ai_reply',
    'Approve AI Reply',
    'Approves an AI draft reply after human review.',
    '{
      "type": "object",
      "required": ["draft_id", "reviewer_id"],
      "properties": {
        "draft_id": { "type": "string", "format": "uuid" },
        "reviewer_id": { "type": "string", "format": "uuid" },
        "decision": { "type": "string" },
        "review_notes": { "type": "string" }
      }
    }'::jsonb,
    '{
      "type": "object",
      "properties": {
        "approval_id": { "type": "string", "format": "uuid" },
        "decision": { "type": "string" }
      }
    }'::jsonb,
    '1.0.0',
    TRUE
),
(
    NULL,
    'generate_social_content',
    'Generate Social Content',
    'Generates social and marketing content for an event.',
    '{
      "type": "object",
      "required": ["workspace_id", "event_id", "content_type"],
      "properties": {
        "workspace_id": { "type": "string", "format": "uuid" },
        "event_id": { "type": "string", "format": "uuid" },
        "content_type": { "type": "string" }
      }
    }'::jsonb,
    '{
      "type": "object",
      "properties": {
        "content": { "type": "string" }
      }
    }'::jsonb,
    '1.0.0',
    TRUE
),
(
    NULL,
    'get_pending_approvals',
    'Get Pending Approvals',
    'Returns AI drafts waiting for human approval.',
    '{
      "type": "object",
      "required": ["workspace_id"],
      "properties": {
        "workspace_id": { "type": "string", "format": "uuid" }
      }
    }'::jsonb,
    '{
      "type": "object",
      "properties": {
        "approvals": { "type": "array" }
      }
    }'::jsonb,
    '1.0.0',
    TRUE
)
ON CONFLICT (workspace_id, tool_name) DO NOTHING;

COMMIT;
