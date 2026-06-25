# TypeScript Migration Roadmap

The project began on a JavaScript Next.js template. TypeScript has now been introduced (see `tsconfig.json`) and the **Ravi AI Voice Copilot** module is fully TypeScript (`lib/voice/*.ts`, `components/voice/*.tsx`, `app/api/voice/command/route.ts`). This document defines how to migrate the rest, with risk and effort.

## Current state
- `tsconfig.json` with `allowJs: true`, `strict: true` — JS and TS coexist; existing `.js` files keep working untyped.
- New code is authored in strict TypeScript.

## Migration phases (recommended sequence)

### Phase 1 — Foundations (LOW risk, ~0.5 day) — DONE / in progress
- `tsconfig.json`, `next-env.d.ts`, install `typescript` + `@types/*`.
- Voice module authored in TS (reference implementation).
- **Risk:** minimal. **Effort:** small.

### Phase 2 — Shared libraries (LOW–MEDIUM, ~1 day)
- Convert `lib/api-client.js`, `lib/nav.js`, `lib/brand.js`, `lib/mcp/tools.js`, `lib/ai/mock-engine.js`, `lib/mock-data.js`, `lib/validations/index.js`.
- Add domain types: `Event`, `CustomerMessage`, `Lead`, `ContentGeneration`, `AuditLog`, `DashboardStats`.
- **Risk:** low (pure functions/data). **Effort:** medium. High value — types then flow into UI.

### Phase 3 — UI components (MEDIUM, ~1–2 days)
- Convert `components/dashboard/ui.jsx`, `components/dashboard/shell.jsx` to `.tsx`.
- Type props (StatCard, StatusBadge, PageHeader, etc.).
- **Risk:** medium (shadcn `.jsx` imports remain JS until Phase 5). **Effort:** medium.

### Phase 4 — Pages (MEDIUM, ~2–3 days)
- Convert `app/page.js`, `app/login/page.js`, and all `app/dashboard/**/page.js` to `.tsx`.
- Type API responses via the Phase 2 domain types; remove implicit anys.
- Convert the catch-all API route `app/api/[[...path]]/route.js` to `.ts` (type the Mongo documents and request/response shapes). Consider splitting into per-resource route handlers.
- **Risk:** medium (route behaviour must not change — cover with the existing backend tests). **Effort:** medium–high.

### Phase 5 — Strictness & UI kit (LOW–MEDIUM, ~1 day)
- Optionally convert `components/ui/*.jsx` (shadcn) to `.tsx` (or pull canonical TS versions).
- Enable `noUncheckedIndexedAccess`, turn on `next build` type checking in CI; remove any remaining `allowJs` usage.
- **Risk:** low. **Effort:** medium.

## Risk register for migration
| Area | Risk | Mitigation |
|------|------|------------|
| Catch-all API route | Behaviour regressions | Backend test suite (100% passing) run before/after |
| shadcn `.jsx` imports | Implicit any in `.tsx` | `allowJs: true` interim; convert in Phase 5 |
| Mongo documents | Loose typing | Define document interfaces in Phase 2 |
| Dev overlay type errors | Could block a route | Migrate file-by-file; keep `strict` but fix per file |

## Effort summary
~5–8 focused days total, incremental and shippable at each phase. Phases 1–2 are low risk and unlock most of the type-safety value. **Recommendation:** prioritise Phases 2 and 4 (data + API typing) for the biggest correctness gains.
