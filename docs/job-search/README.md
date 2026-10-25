# Personal Job Search integration

Routes: `/job-search` redirects to authenticated `/dashboard/job-search`. The dashboard navigation contains Job Search. `/api/job-search` independently validates the session and refuses anonymous Auth users. Page metadata excludes indexing.

## Deployment

1. Apply `docs/job-search/schema.sql` once in the existing Ravi Gupta AI Labs Supabase project. This creates only `public.job_search_workspaces`, with explicit authenticated grants and per-owner RLS. It does not change existing tables. Review the target project before running SQL. Run Supabase's database/security advisors after applying.
2. Retain existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` settings. No service-role key is needed by this feature.
3. Set `OPENAI_API_KEY` as a server-only secret. Optional `JOB_SEARCH_MODEL` overrides existing `OPENAI_MODEL`; fallback is `gpt-5`, matching the host application's existing default. The chosen model must support Responses API structured outputs. Never add a key to source control.
4. Recommended for Ravi's private-only use: set server-only `JOB_SEARCH_OWNER_EMAIL` to the email of his existing Supabase account. With this unset, all non-anonymous signed-in accounts have separate workspaces. The allowlist protects the feature API, not other pre-existing host APIs.
5. Deploy the branch through the existing GitHub → Vercel project. Both database setup and deployment are required before this is usable on the live domain.

## First use

Sign in, open Job Search, use Browse CV under My profile to choose a PDF, Word (.docx) or UTF-8 text file, or paste your CV, then save your profile and goals. Files are read locally in the browser; only reviewed extracted text is saved to Supabase. The original file is not uploaded. Imports support up to 5 MB, 20 PDF pages and 40,000 characters. Scanned/image-only or password-protected PDFs need a readable export or pasted text. Review reading order and missing content before saving. Add explicit work rights, languages, salary expectations and location constraints where relevant. No personal profile is seeded into the public repository.

Use Add role to open SEEK, LinkedIn or Trade Me searches for NZ/Australia. Paste the full visible advert, role, company and optional HTTPS source URL. The source URL is stored for reference, never fetched by this API. Saved adverts are snapshots; verify availability on the original board.

Consent before analysis sends the saved profile and selected application context to OpenAI. Evaluate fit, inspect gaps, then Draft + AI review. Edit the resulting plain-text CV/cover letter and confirm that you checked the claims. Submit manually on the employer's site, then record Applied. Track interview stages, feedback and follow-up dates. Download text documents or use browser print; this does not reproduce upstream LaTeX CV layouts or guarantee ATS acceptance. Export private backups before changing the profile: profile edits invalidate all previous generated outputs and approvals. No JSON restore/import is provided in this version.

## Architecture and data controls

- Strongly typed Zod contracts in `lib/job-search/schema.ts`.
- Provider interface and two sequential drafter/reviewer requests in `provider.ts`. Credentials stay on the server. Validated structured output, explicit refusal/incomplete handling, finite request timeouts and `store:false` on API requests. `store:false` disables Response storage; it is not a claim about provider abuse-monitoring retention.
- Owner-scoped repository with optimistic version checks. The whole personal workspace updates atomically in one row. This is deliberately bounded to 200 jobs and a 20 MB row, not a multi-tenant high-volume job platform.
- Per-account persisted 30-second AI cooldown claimed before tokens are spent. Failed calls retain the cooldown and started activity; UI refreshes its version. Concurrent saves cause a 409 rather than overwriting newer content. Generated output is discarded on a concurrent edit, so a retry may cost tokens.
- Review state resets on re-evaluation, draft regeneration and profile changes. Applied requires an existing human-reviewed draft. Interview/Offer may be recorded for applications made elsewhere. There are no sending, auto-application, Gmail or Notion actions.
- Prompt version and model recorded on each AI attempt. Activity history holds the most recent 300 events and is editable by its owner through direct DB access. It is not an immutable compliance audit log.
- Posting integrity heuristics flag invisible characters, HTML and obvious embedded instructions. They do not guarantee injection detection. No network tools or posting URL fetches are exposed to the model. User data and prior outputs remain untrusted evidence in the system prompt.
- Gate failures block drafting. Unknown dimensions produce no aggregate score. A valid aggregate uses upstream weights. Confidence is an uncalibrated model estimate of evidence quality, not a hiring probability.
- No localStorage, server disk CV files, public candidate seeds, full response logging or service-role bypass. Backups and text exports contain private information and are user-initiated.

## Deliberate scope

This adapts the upstream methodology into a native page, rather than embedding a CLI application into Vercel. It does not include automated board scraping, scheduled search, Gmail/Notion sync, salary datasets, company web research, multi-template PDF compilation or a live MCP server. `JobAIProvider`, schemas and repository provide reusable boundaries for future tools. No MCP capabilities are advertised as live.

The existing site remains on React 18 and Tailwind 3 despite the newer target versions in the platform brief. This feature follows existing components and does not bundle an unrelated framework migration. Existing mock AI flows and unrelated security/configuration issues are outside this change.

## Validation

Run `npm run test:job-search` for service/API/repository regression tests, including an actual isolated Postgres RLS test. Run `npm run typecheck` and `npm run build`. `npm run test:job-search-ui` exercises the actual page component with mocked API responses; this is UI contract verification, not proof of live credentials or deployment. Live acceptance still requires two real accounts, deployed schema, OpenAI credentials and an employer submission made by the user.
