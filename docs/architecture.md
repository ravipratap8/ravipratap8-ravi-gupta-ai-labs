# Architecture

## Overview
AI EventOps Assistant is a Next.js (App Router) application. The portfolio landing page and the SaaS dashboard share one codebase.

```
Browser (React client components)
   -> /api/* (Next.js Route Handler, catch-all)
      -> Service layer: lib/ai/mock-engine.js (AI), lib/mock-data.js (seed)
      -> MongoDB (events, messages, leads, content_generations, audit_logs)
```

## Key decisions
- **Service layer separation**: UI never embeds business logic. AI logic lives in `lib/ai`, data access in the API route, tool contracts in `lib/mcp`.
- **Human-in-the-loop by design**: AI replies are always created with status `Needs Review`; only an explicit approval can move them to `Approved`/`Sent`.
- **Stable shapes**: mock AI returns the exact shape a real LLM integration will, so swapping engines requires no UI change.
- **MCP-ready**: business actions are described once as typed tools and reused by REST and (future) MCP.

## Data model (collections / future Supabase tables)
`users, events, event_faqs, customer_messages (messages), ai_draft_responses, approvals, leads, content_generations, audit_logs, test_runs, test_results, prompt_risk_cases`

See `supabase/seed.sql` for the SQL placeholder schema.

## Future integration points
- `lib/supabase/*` — Auth, DB, Storage clients (placeholder).
- `lib/whatsapp/*` — webhook verify, parse, send (placeholder).
- `lib/ai/*` — swap mock engine for Vercel AI SDK / OpenAI.
