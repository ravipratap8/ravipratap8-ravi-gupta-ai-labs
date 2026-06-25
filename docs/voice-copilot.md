# Ravi AI Voice Copilot

A modular, optional, browser-based voice assistant for the AI EventOps Assistant. It lets users drive the dashboard with voice (or typed) commands. Version 1 uses only local/browser capabilities — no paid APIs, no OpenAI/Supabase/WhatsApp/Resend, no production MCP connection.

> The feature can be turned off via `lib/voice/voiceConfig.ts` (`enabled: false`) without removing any code.

## What it is
- A floating microphone button on dashboard pages.
- Click-to-speak: it only listens when you click the button. **No always-on / background listening.**
- Speech is transcribed in the browser (Web Speech API), routed to a typed intent, and the matching in-app action runs.
- Optional spoken responses via the browser `speechSynthesis` API (toggle in the panel).
- A typed text fallback box that works even when speech recognition is unavailable.

## Supported commands (v1)
Navigation: open dashboard, open events, open inbox, open approvals, open leads, open AI content, open settings, show pending approvals, show hot leads.
Content: generate Facebook post, generate Instagram caption, generate reel script.
Events/enquiries: create new event, simulate enquiry.
Approvals (confirmation required): approve selected reply, reject selected reply.
Help: “what can you do?”, “help”.

Matching is tolerant of variations, e.g. “go to approvals”, “take me to approvals” and “show approvals” all open the approvals page.

## Browser support
- Speech recognition uses `SpeechRecognition` / `webkitSpeechRecognition` (best in Chromium/Chrome/Edge).
- If unavailable (e.g. Firefox), the assistant automatically shows a **text command** box — the module still works.
- Text-to-speech uses `speechSynthesis` where available; otherwise it is silently skipped.

## Fallback mode
When speech recognition is not supported or microphone permission is denied, the panel shows a clear message and the text input is used to enter commands. The app never blocks on microphone access and loads fine without it.

## Safety rules (Voice Safety)
- Click-to-speak only — no always-on listening.
- No automatic customer messaging — WhatsApp sending is never triggered by voice.
- Human approval stays mandatory — approve/reject commands require an explicit on-screen **Confirm**.
- No deleting events or leads in v1.
- Never requests or exposes API keys.
- Unknown commands return a safe fallback message.

## API
`POST /api/voice/command` with `{ "transcript": "open approvals" }` returns a typed `VoiceCommandResult`:
```json
{ "success": true, "intent": "open_approvals", "confidence": 0.94, "actionType": "navigate", "target": "/dashboard/approvals", "response": "Opening approvals." }
```
Unknown commands return `success: false`, `intent: "fallback"` with a helpful message.

## Architecture
```
components/voice/  VoiceCopilot (orchestrator) -> VoiceButton + VoiceCommandPanel -> VoiceTranscript + VoiceStatusBadge
lib/voice/         types, voiceConfig, commands, intentRouter, speechToText, textToSpeech, voiceActions, mcpVoiceBridge
app/api/voice/command/route.ts   typed POST handler (zod-validated) using the same intentRouter
```
Cross-page actions (generate content, open composer, approve top card) are queued in `sessionStorage` via `voiceActions.ts` and consumed by the target page on mount.

## Future MCP integration
`lib/voice/mcpVoiceBridge.ts` already maps each intent to the MCP tool it will call later, e.g.:
- create_new_event → `create_event`
- show_pending_approvals → `get_pending_approvals`
- approve_selected_reply → `approve_ai_reply`
- generate_facebook_post → `generate_social_content`
- simulate_enquiry → `classify_customer_message` / `generate_customer_reply`

When an MCP server is added, `executeViaMcp()` will route confirmed intents to those tools — preserving the same human-in-the-loop and audit-logging guarantees.

## Future AI agent integration
The same intent layer can be driven by an LLM agent (OpenAI / Vercel AI SDK) for free-form natural language, with the intent router acting as a safe, deterministic action allow-list.

## Why this matters
It demonstrates senior-level AI workflow design: voice UX, tolerant intent routing, safe human-in-the-loop controls, graceful degradation, and an MCP-ready path to agentic automation — without compromising governance.
