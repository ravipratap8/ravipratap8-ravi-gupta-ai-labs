# Ravi Gupta AI Labs

I built **Ravi Gupta AI Labs** as my personal AI engineering portfolio and innovation platform.

The goal is not just to show a landing page or a basic demo app. The goal is to demonstrate how I design and build enterprise-style AI applications with proper architecture, governance, testing, auditability, and human-in-the-loop controls.

The first working application inside this platform is **EventPilot AI**, an AI-powered EventOps assistant for event organisers.

* Landing page: `/`
* Dashboard: `/dashboard`
* Sign in: `/login`

## Why I built this

I wanted my portfolio to show more than UI design or a simple chatbot.

This platform is built to demonstrate the kind of AI systems I believe businesses actually need:

* AI that supports real workflows
* AI that is grounded in business context
* AI that provides confidence scores
* AI that routes risky outputs for human review
* AI that keeps an audit trail
* AI that can be tested properly
* AI that can become part of a wider enterprise architecture

In simple terms, this project is my way of showing that I can build AI-enabled business platforms, not just AI demos.

## What the platform includes

Ravi Gupta AI Labs currently includes:

* **Portfolio website**
* **EventPilot AI**
* **Ravi AI Voice Copilot**
* **MCP-ready architecture**

Future applications I plan to add:

* **TestPilot AI**
* **RequirementPilot AI**
* **DefectPilot AI**
* **Prompt Studio**
* **AI Playground**
* **Developer APIs**

The long-term idea is simple: build the foundation once, then reuse it across multiple AI applications.

## Portfolio

The landing page presents my experience across software testing, delivery leadership, enterprise systems, AI workflows, automation, and solution design.

It includes:

* Hero section
* About section
* Skills and capabilities
* Featured AI application
* Projects
* Certifications
* Contact section

The page is designed for recruiters, hiring managers, CTOs, engineering managers, test managers, and AI leaders who want to understand the type of work I can deliver.

## EventPilot AI

**EventPilot AI** is the first flagship application inside Ravi Gupta AI Labs.

It demonstrates how AI can improve event management workflows without blindly automating customer-facing actions.

The application is built around real event organiser use cases, such as handling enquiries, generating content, managing leads, reviewing AI drafts, and maintaining governance over AI-generated output.

## EventPilot AI Features

### Dashboard

The dashboard provides KPIs, recent activity, AI safety status, and quick actions for event organisers.

### Events

Users can create, list, and manage events.

Each event can include useful knowledge such as:

* FAQs
* Refund rules
* Parking details
* Ticket information
* Venue details
* Meet and greet information
* Event-specific instructions

This knowledge is used to ground AI replies and content generation.

### AI Inbox

The AI Inbox works like a WhatsApp-style enquiry centre.

Customer messages are classified by:

* Category
* Risk level
* Confidence score

The AI can draft a reply, but it does not automatically send customer messages.

### Admin Approvals

This is one of the most important parts of the application.

AI-generated replies go through a human approval workflow where an admin can:

* Approve
* Edit
* Reject

This keeps the workflow safe, controlled, and auditable.

### AI Content Generator

The app can generate event-specific content for:

* Facebook posts
* Instagram captions
* Reel scripts
* Email campaigns
* FAQ pages
* LinkedIn posts

The content is based on the selected event and its available context.

### Smart Lead Capture

The CRM-style lead pipeline helps track event enquiries and potential customers.

Lead stages include:

* New
* Contacted
* Interested
* Converted
* Closed

The system can also help classify and prioritise leads.

### AI Safety & Test Governance

This section demonstrates how I think about safe AI delivery.

It includes:

* Prompt risk register
* AI test scenarios
* Audit logs
* Approval controls
* AI safety checks
* Risk-based routing

For me, this is the difference between a serious AI product and a shiny demo.

### Settings

The settings area includes profile settings, AI behaviour settings, and placeholders for future integrations such as:

* Supabase
* OpenAI
* WhatsApp Cloud API
* Resend
* MCP tools

## AI Workflow Design

I have designed the AI workflow around this pattern:

```text
Context
↓
Grounding
↓
AI
↓
Confidence Score
↓
Risk Assessment
↓
Human Approval where required
↓
Audit Log
↓
Action
```

This is the core principle of the platform.

AI should assist the user, not secretly take risky actions in the background.

## Current AI Features

The current AI capabilities include:

* `classifyMessage()`
  Classifies customer messages by category, risk, and confidence.

* `generateReply()`
  Creates grounded customer reply drafts using event-specific knowledge.

* `generateContent()`
  Generates marketing and operational content for events.

At this stage, the AI engine can run as a deterministic mock engine so the demo stays stable and does not require an API key.

The structure is intentionally designed so the mock engine can later be replaced with OpenAI or the Vercel AI SDK without changing the main user flow.

## Ravi AI Voice Copilot

The platform also includes **Ravi AI Voice Copilot**, a click-to-speak assistant inside the dashboard.

Users can speak or type commands such as:

* “Open approvals”
* “Show hot leads”
* “Generate Instagram caption”
* “Open events”
* “Show AI safety”

The voice assistant is designed to support workflow navigation and future MCP actions.

### Voice Copilot Principles

* Click-to-speak only
* No always-on listening
* Browser speech recognition where supported
* Typed fallback when speech recognition is unavailable
* Text-to-speech support where available
* Intent routing to local app actions
* Future MCP bridge support
* Human approval preserved for sensitive actions
* No automatic customer messaging

The voice copilot is not meant to be an uncontrolled agent. It is a safe assistant layer.

## MCP-Ready Architecture

I am designing the platform to be MCP-ready.

In the future, business capabilities can be exposed as MCP tools such as:

* `create_event`
* `update_event`
* `search_event`
* `generate_customer_reply`
* `approve_ai_reply`
* `generate_social_content`
* `create_lead`
* `classify_message`
* `search_faq`
* `get_dashboard_metrics`

The goal is to allow future AI assistants to operate business workflows safely while still respecting authentication, permissions, audit logging, confidence scoring, and human approval rules.

## Technology Stack

Target production stack:

* Next.js 15+
* React 19+
* TypeScript
* App Router
* Tailwind CSS 4+
* shadcn/ui
* npm
* Node.js 20+
* Vercel
* Supabase
* OpenAI
* WhatsApp Cloud API
* Resend
* MCP
* Playwright
* Vitest
* Zod

I am intentionally avoiding outdated patterns such as:

* Pages Router
* Yarn
* Create React App
* Unstructured component-heavy business logic

## Architecture Principles

The platform is being built around these principles:

* Clean Architecture
* SOLID principles
* Feature-based structure
* Service layer
* Repository pattern
* Dependency injection where useful
* Strong TypeScript typing
* Modular components
* Reusable UI
* Shared authentication
* Shared settings
* Shared audit logging
* Shared AI provider abstraction
* MCP-ready business capabilities

Business logic should not live inside React components. React should handle the UI. The business workflow should sit in proper services, repositories, and domain logic.

## Authentication and Data Isolation

The intended production model uses:

* Supabase Auth
* Supabase Postgres
* Row Level Security
* Per-user workspaces
* Secure storage
* User-level data isolation

Each user should only see and manage their own workspace data.

## Planned Integrations

### Supabase

Planned use:

* Authentication
* Database
* Storage
* Realtime features
* Row Level Security

### OpenAI

Planned use:

* AI replies
* Content generation
* Message classification
* Embeddings
* Retrieval-augmented workflows

### WhatsApp Cloud API

Planned use:

* Customer conversations
* Inbound enquiries
* Outbound approved replies
* Notifications

### Resend

Planned use:

* Email notifications
* AI-assisted email campaigns
* Contact form messages

## AI Governance

Every AI workflow should support:

* Confidence scores
* Prompt versioning
* Audit logs
* Human approval
* Prompt risk register
* AI testing strategy
* Prompt validation
* Hallucination prevention
* Safe fallbacks
* Risk-based routing

This is an important part of the project because I want the platform to show how AI can be shipped responsibly, not just quickly.

## Testing Strategy

The testing strategy covers:

* Unit tests
* Integration tests
* Playwright UI tests
* AI workflow validation
* Prompt testing
* MCP tool validation
* Voice command validation
* Regression testing
* Webhook failure handling
* Approval workflow testing
* Audit log validation

Key testing documents:

* `docs/ai-test-strategy.md`
* `docs/test-scenarios.md`
* `docs/prompt-risk-register.md`
* `docs/voice-copilot.md`
* `docs/mcp-roadmap.md`
* `docs/typescript-migration.md`

## API Routes

Example routes:

```text
/api/dashboard/stats
/api/events
/api/messages
/api/approvals/:id/approve
/api/ai/chat
/api/ai/generate-content
/api/ai/classify-message
/api/leads
/api/content
/api/whatsapp/webhook
/api/whatsapp/send
/api/mcp
/api/voice/command
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Reset demo data if available:

```bash
POST /api/seed
```

## Deployment

The target deployment platform is **Vercel**.

Production deployment should include:

* Environment variables
* Supabase project configuration
* OpenAI API key
* WhatsApp Cloud API credentials
* Resend API key
* Database migrations
* Row Level Security policies
* Production audit logging
* CI checks
* Playwright smoke tests

## Roadmap

### Phase 1

* Portfolio
* EventPilot AI
* Voice Copilot
* MCP-ready structure

### Phase 2

* Supabase integration
* OpenAI integration
* WhatsApp Cloud API integration
* Resend integration
* Production deployment

### Phase 3

* TestPilot AI

### Phase 4

* RequirementPilot AI

### Phase 5

* DefectPilot AI

### Phase 6

* Prompt Studio

### Phase 7

* AI Playground

### Phase 8

* Developer APIs

## Success Criteria

I will consider this platform successful when:

* Recruiters can explore it publicly
* Users can create their own accounts
* Every user gets a secure workspace
* AI workflows are safe and explainable
* Voice Copilot works naturally
* MCP tools are available
* Multiple AI applications share one architecture
* The platform demonstrates senior-level AI engineering, test leadership, governance, and product thinking

## Guiding Principle

Build once. Reuse everywhere.

Every new application should reuse the same platform foundation: authentication, AI services, MCP infrastructure, governance model, audit logging, UI patterns, and testing strategy.

That is how Ravi Gupta AI Labs can grow into one cohesive AI engineering platform instead of a collection of disconnected demos.
