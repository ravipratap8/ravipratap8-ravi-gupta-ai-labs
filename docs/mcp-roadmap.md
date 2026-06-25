# MCP Roadmap

## What is MCP?
The **Model Context Protocol** is an open standard that lets AI assistants (ChatGPT, Claude, enterprise copilots) call external tools and data sources through a typed, secure interface.

## Why this app is MCP-ready
Every core business action is already defined once as a strongly-typed tool with a zod input schema, a handler and a sample response in `lib/mcp/tools.js`, and surfaced at `GET /api/mcp`. The same contracts power the REST API and a future MCP server — no duplication.

## Tools defined
`create_event`, `get_events`, `get_event_by_id`, `search_event_faq`, `generate_customer_reply`, `classify_customer_message`, `create_lead`, `approve_ai_reply`, `generate_social_content`, `get_pending_approvals`.

## Workflows that become agent tools
- "Create the Diwali event and draft an Instagram caption."
- "Show me all High-risk approvals and summarise them."
- "Classify this WhatsApp message and create a lead if it&#39;s a hot lead."

## How it connects later
1. Add `@modelcontextprotocol/sdk` and create `lib/mcp/server.js` registering the tools.
2. Route tool handlers to the same service layer used by `/api`.
3. Expose over stdio (desktop assistants) or HTTP (enterprise).
4. Enforce the same governance: human-in-the-loop on `approve_ai_reply`, audit logging on every call.

## Safety
MCP does not bypass governance. `approve_ai_reply` still requires a human decision; all tool calls are audit-logged; High-risk categories remain human-gated.
