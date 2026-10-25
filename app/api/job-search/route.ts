import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  JobSearchRepository,
  WorkspaceConflict,
} from "@/lib/job-search/repository";
import {
  profileSchema,
  jobSchema,
  statusSchema,
  postingWarnings,
  PROMPT_VERSION,
} from "@/lib/job-search/schema";
import type { Application } from "@/lib/job-search/schema";
import {
  generateJobOutput,
  OpenAIJobProvider,
} from "@/lib/job-search/provider";

export const runtime = "nodejs";
export const maxDuration = 180;
export const dynamic = "force-dynamic";
const mutationSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("profile"),
    version: z.number().int().nonnegative(),
    profile: profileSchema,
  }),
  z.object({
    action: z.literal("create"),
    version: z.number().int().nonnegative(),
    job: jobSchema,
  }),
  z.object({
    action: z.literal("update"),
    version: z.number().int().nonnegative(),
    id: z.string().uuid(),
    status: statusSchema,
    notes: z.string().max(5000),
    followUp: jobSchema.shape.followUp,
  }),
  z.object({
    action: z.literal("review"),
    version: z.number().int().nonnegative(),
    id: z.string().uuid(),
    draft: z.object({
      cv: z.string().min(1).max(40000),
      coverLetter: z.string().min(1).max(20000),
    }),
  }),
  z.object({
    action: z.literal("delete"),
    version: z.number().int().nonnegative(),
    id: z.string().uuid(),
  }),
  z.object({
    action: z.enum(["evaluate", "draft", "interview"]),
    version: z.number().int().nonnegative(),
    id: z.string().uuid(),
    consent: z.literal(true),
    acknowledgeWarnings: z.boolean(),
  }),
]);
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
async function repository() {
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user || user.is_anonymous) return null;
  // Optional personal-only allowlist. Use trusted server config, not editable user metadata.
  const owner = process.env.JOB_SEARCH_OWNER_EMAIL?.trim().toLowerCase();
  if (owner && user.email?.toLowerCase() !== owner) return null;
  return new JobSearchRepository(db, user.id);
}
function failure(error: unknown) {
  if (error instanceof WorkspaceConflict)
    return json(
      { error: "This workspace changed in another tab. Reload before saving." },
      409,
    );
  if (error instanceof z.ZodError || error instanceof SyntaxError)
    return json({ error: "Check the supplied fields and input lengths." }, 400);
  const message = error instanceof Error ? error.message : "";
  if (message === "AI_NOT_CONFIGURED")
    return json(
      {
        error:
          "AI is not configured. Set OPENAI_API_KEY on the server. Saved applications remain available.",
      },
      503,
    );
  if (message === "EVALUATION_REQUIRED")
    return json(
      {
        error:
          "Evaluate the role first and resolve failed eligibility, language or location gates before drafting.",
      },
      422,
    );
  if (message === "STORAGE_UNAVAILABLE")
    return json(
      {
        error:
          "Job Search storage is unavailable. The deployment needs the Job Search database setup.",
      },
      503,
    );
  return json(
    {
      error:
        "The operation failed. No generated result was saved. Try again shortly.",
    },
    502,
  );
}
export async function GET() {
  try {
    const repo = await repository();
    if (!repo)
      return json({ error: "Sign in with an authorised account." }, 401);
    return json({
      ...(await repo.read()),
      aiConfigured: !!process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    // Reject cross-origin browser writes even when the host's global CORS is permissive.
    if (
      request.headers.get("origin") &&
      request.headers.get("origin") !== new URL(request.url).origin
    )
      return json({ error: "Cross-origin request rejected." }, 403);
    const repo = await repository();
    if (!repo)
      return json({ error: "Sign in with an authorised account." }, 401);
    if (Number(request.headers.get("content-length")) > 170000)
      return json({ error: "Request too large." }, 413);
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 170000)
      return json({ error: "Request too large." }, 413);
    const input = mutationSchema.parse(JSON.parse(raw));
    let { state, version } = await repo.read();
    if (version !== input.version) throw new WorkspaceConflict();
    const now = new Date().toISOString();
    let job: Application | undefined;
    if ("id" in input) {
      job = state.applications.find((a) => a.id === input.id);
      if (!job) return json({ error: "Application not found." }, 404);
    }
    if (input.action === "profile") {
      state.profile = input.profile;
      // Profile edits invalidate earlier assessments and human approvals.
      state.applications = state.applications.map((a) => ({
        ...a,
        evaluation: null,
        draft: null,
        interview: null,
        reviewed: false,
        version: a.version + 1,
        updated_at: now,
      }));
    } else if (input.action === "create") {
      if (state.applications.length >= 200)
        return json(
          {
            error:
              "Export and remove older applications before adding more (200 limit).",
          },
          422,
        );
      state.applications.unshift({
        ...input.job,
        id: crypto.randomUUID(),
        status: "Saved",
        evaluation: null,
        draft: null,
        interview: null,
        reviewed: false,
        version: 1,
        updated_at: now,
      });
    } else if (input.action === "delete") {
      state.applications = state.applications.filter((a) => a.id !== input.id);
    } else if (input.action === "update" && job) {
      if (input.status === "Applied" && (!job.reviewed || !job.draft))
        return json(
          {
            error:
              "Review and confirm the application draft before recording it as applied.",
          },
          422,
        );
      Object.assign(job, {
        status: input.status,
        notes: input.notes,
        followUp: input.followUp,
        version: job.version + 1,
        updated_at: now,
      });
    } else if (input.action === "review" && job) {
      if (!job.draft) return json({ error: "Generate a draft first." }, 422);
      job.draft = { ...job.draft, ...input.draft };
      job.reviewed = true;
      job.updated_at = now;
      job.version++;
    } else if ("consent" in input && job) {
      if (!state.profile)
        return json({ error: "Save your CV and goals first." }, 422);
      if (!process.env.OPENAI_API_KEY) throw new Error("AI_NOT_CONFIGURED");
      if (postingWarnings(job.posting).length && !input.acknowledgeWarnings)
        return json(
          {
            error:
              "Inspect and acknowledge the posting integrity warnings first.",
          },
          422,
        );
      if (state.lastAIAt && Date.now() - Date.parse(state.lastAIAt) < 30000)
        return json(
          { error: "Please wait 30 seconds between AI requests." },
          429,
        );
      state.lastAIAt = now;
      // Persist the cooldown before spending tokens. CAS also prevents simultaneous starts.
      ({ state, version } = await repo.save(state, version, {
        at: now,
        action: `${input.action}:started`,
        applicationId: job.id,
        promptVersion: PROMPT_VERSION,
        model:
          process.env.JOB_SEARCH_MODEL || process.env.OPENAI_MODEL || "gpt-5",
      }));
      const result = await generateJobOutput(
        input.action,
        state.profile!,
        job,
        new OpenAIJobProvider(),
      );
      if (input.action === "evaluate") {
        job.evaluation = result as Application["evaluation"];
        job.draft = null;
        job.interview = null;
        job.reviewed = false;
      }
      if (input.action === "draft") {
        job.draft = result as Application["draft"];
        job.reviewed = false;
      }
      if (input.action === "interview")
        job.interview = result as Application["interview"];
      job.updated_at = new Date().toISOString();
      job.version++;
    }
    return json({
      ...(await repo.save(state, version, {
        at: new Date().toISOString(),
        action: input.action,
        ...("id" in input ? { applicationId: input.id } : {}),
      })),
      aiConfigured: !!process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    return failure(error);
  }
}
