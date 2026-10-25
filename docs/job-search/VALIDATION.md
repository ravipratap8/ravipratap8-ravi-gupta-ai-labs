# Integration verification

Target repository: `ravipratap8/ravipratap8-ravi-gupta-ai-labs`

Base commit: `cc6ab72` (existing main branch when work began).

Implemented on branch `feat/personal-job-search`. Deployment and live acceptance remain pending; see the GitHub pull request for publishing status.

Verified locally on 25 October 2026:

- 23 passing Vitest checks across workflow, API boundaries, repository concurrency and isolated Postgres RLS.
- Real Postgres engine (PGlite) denies cross-account reads, inserts, updates, deletes and owner reassignment. Anonymous database role cannot read the table.
- Two passing Chromium Playwright tests. The actual component completes profile setup, role capture, explicit AI consent, assessment rendering, draft editing, human review and manual application tracking against a mocked HTTP API. Mobile renders at 390 px without document overflow; storage errors disable writes and remain visible.
- TypeScript compilation passes.
- Next.js production build passes with non-secret placeholder Supabase configuration. This proves compilation/prerendering, not connectivity or valid credentials.
- Desktop and mobile screenshots visually inspected. Fixed host Tailwind content globs to include TS/TSX, which previously omitted this component's utilities.

Live acceptance is pending. At initial verification the GitHub connection reported `push:false`; write access was subsequently connected. The connected Supabase account did not list the existing `ravi-gupta-ai-labs` project. No production schema, environment variables, deployment or existing personal data was changed. No real CV was sent to OpenAI, and live AI quality/latency remains unverified.

To finish: connect access to the existing Supabase project, then apply the additive schema, verify RLS on the target, configure server secrets if missing, publish through the existing deployment and perform an authenticated live acceptance check. Keep the personal-only email allowlist enabled for Ravi's use.
