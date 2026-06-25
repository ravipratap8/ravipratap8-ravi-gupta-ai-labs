# Ravi Gupta — AI Labs &amp; AI EventOps Assistant

A production-quality personal portfolio for **Ravi Gupta** (Auckland, NZ — Senior Technology &amp; Delivery Leader, Test Lead, AI Solutions Builder) plus a fully working demo SaaS product, the **AI EventOps Assistant**.

Live demo route: `/dashboard` · Landing: `/` · Sign in: `/login`

## What the app does

**Portfolio (`/`)** — premium landing page: hero, about, key skills, featured AI app, projects, certifications and contact.

**AI EventOps Assistant (`/dashboard`)** — a SaaS for event organisers:

- **Dashboard** — KPIs, recent activity, AI safety status, quick actions.
- **Events** — create/list/detail events with an AI knowledge base (FAQ, refund, parking, meet &amp; greet).
- **AI Inbox** — WhatsApp-style enquiries with grounded AI draft replies, confidence scoring and category tags.
- **Admin Approvals** — human-in-the-loop review of AI drafts with risk levels (Approve / Edit / Reject). **AI never auto-sends.**
- **AI Content Generator** — Facebook, Instagram, reel script, email, FAQ page and LinkedIn content per event.
- **Smart Lead Capture** — CRM pipeline (New → Contacted → Interested → Converted → Closed) with auto-classification.
- **AI Safety &amp; Test Governance** — prompt risk register, test scenarios, audit logs and AI controls.
- **Settings** — profile, AI behaviour and integration placeholders (Supabase, OpenAI, WhatsApp, Resend) + MCP tool manifest.

## Why it was built

It doubles as Ravi&#39;s **AI Test Manager** portfolio piece — it demonstrates not just an AI feature, but the *governance* that makes AI safe to ship: human-in-the-loop, confidence scoring, risk-based routing, audit logs and a continuous test strategy.

## Tech stack

- **Next.js 15 (App Router)** + React 18
- **Tailwind CSS** + **shadcn/ui** + **lucide-react**
- **MongoDB** for live, persistent demo data (events/messages/leads/content/audit logs)
- **zod** for typed tool schemas (MCP-ready)
- Mock AI engine (`lib/ai/mock-engine.js`) with the same shape as a real LLM call

> Note on stack: the original brief specifies a TypeScript/Supabase/npm scaffold. This implementation delivers the full functional product on the provided Next.js + MongoDB workspace, keeping every external integration (Supabase, OpenAI, WhatsApp, Resend) as a clean, documented placeholder so it can be swapped in without UI changes.

## AI features

All AI is currently a deterministic **mock engine** (no API key needed):

- `classifyMessage()` — category + risk + confidence
- `generateReply()` — grounded reply from event knowledge base
- `generateContent()` — marketing content per type

Replace the bodies in `lib/ai/mock-engine.js` with the Vercel AI SDK / OpenAI; the API routes and UI stay the same.

## Testing strategy

See `docs/ai-test-strategy.md`, `docs/test-scenarios.md` and `docs/prompt-risk-register.md`. Key pillars: human-in-the-loop approval, confidence thresholds, risk-based routing, audit logging, golden-set test scenarios and webhook failure handling.

## How to run locally

This workspace runs under supervisor on port 3000. Endpoints are served under `/api/*`.

```bash
# served automatically; to restart:
sudo supervisorctl restart nextjs
```

Reset demo data any time: `POST /api/seed`.

## API routes (mock)

`/api/dashboard/stats` · `/api/events` · `/api/messages` · `/api/approvals/:id/approve` · `/api/ai/chat` · `/api/ai/generate-content` · `/api/ai/classify-message` · `/api/leads` · `/api/content` · `/api/whatsapp/webhook` · `/api/whatsapp/send` · `/api/mcp`

## Future integrations

- **Supabase** — Auth (replace mock login), Postgres (replace MongoDB collections), Storage (flyer uploads).
- **OpenAI / Vercel AI SDK** — real replies, classification and content.
- **WhatsApp Cloud API** — real inbound webhook + outbound send.
- **Resend** — real email announcements and contact form.

## Voice Copilot

The platform includes **Ravi AI Voice Copilot** \u2014 a modular, optional, click-to-speak voice assistant on the dashboard. Users can speak (or type) commands like *"open approvals"*, *"show hot leads"* or *"generate Instagram caption"* and the copilot routes them to local app actions today, and to **MCP tools** later.

- Click-to-speak only \u2014 no always-on listening.
- Browser Web Speech API for speech-to-text + text-to-speech; **typed fallback** when unsupported.
- Human-in-the-loop preserved: approval commands require explicit on-screen confirmation; no automatic customer messaging.
- Authored in **TypeScript** (`lib/voice/*`, `components/voice/*`, `app/api/voice/command/route.ts`).

See `docs/voice-copilot.md`. The first phase of the TypeScript migration is documented in `docs/typescript-migration.md`.

## MCP-ready architecture

Core actions are exposed as typed tool definitions in `lib/mcp/tools.js` (see `docs/mcp-roadmap.md`). A future MCP server can register `create_event`, `get_events`, `generate_customer_reply`, `approve_ai_reply`, `generate_social_content` and more — letting ChatGPT, Claude or enterprise AI assistants operate EventOps safely.
