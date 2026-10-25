# Upstream attribution

Source: https://github.com/ai-job-search-dev/ai-job-search

Author: Mads Lorentzen. Licence: MIT (see LICENSE in this folder).

Reviewed source commit: `e16acee3abdaae57f8026789338a3c6eebf4608b`.

The web implementation adapts the profile → evaluate → draft → second-pass review → human review → outcome/interview workflow. Its 30/25/15/30 fit weights derive from the upstream evaluation framework (included verbatim as `evaluation-reference.md`). Writing guidance and STAR preparation were reviewed in upstream files `03-writing-style.md` and `07-interview-prep.md`.

The integration is a Next.js adaptation using the host app's Supabase authentication and server OpenAI credentials. It does not execute upstream Claude Code commands, install their permissions, run Bun CLIs or LaTeX, import Danish job-board scrapers, or claim to reproduce every upstream feature. Unverified eligibility remains a question, rather than adopting the upstream framework's overly broad visa/clearance exclusions.

No candidate data is distributed in this directory. Upstream agent instructions are reference material, not executable instructions for this website.
