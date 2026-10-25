import { beforeEach, describe, expect, it, vi } from "vitest";
import { emptyWorkspace } from "../../lib/job-search/repository";
import type { JobWorkspace } from "../../lib/job-search/repository";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  read: vi.fn(),
  save: vi.fn(),
  generate: vi.fn(),
  importURL: vi.fn(),
}));
vi.mock("@/lib/job-search/job-url", async (original) => ({
  ...(await original<typeof import("../../lib/job-search/job-url")>()),
  importJobURL: mocks.importURL,
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: mocks.getUser } }),
}));
vi.mock("@/lib/job-search/provider", () => ({
  OpenAIJobProvider: class {},
  generateJobOutput: mocks.generate,
}));
vi.mock("@/lib/job-search/repository", async (original) => {
  const module =
    await original<typeof import("../../lib/job-search/repository")>();
  return {
    ...module,
    JobSearchRepository: class {
      read = mocks.read;
      save = mocks.save;
    },
  };
});
import { GET, POST } from "../../app/api/job-search/route";
let state: JobWorkspace;
let version: number;
const id = "11111111-1111-4111-8111-111111111111";
function post(body: object, origin = "https://ravigupta.dev") {
  return POST(
    new Request("https://ravigupta.dev/api/job-search", {
      method: "POST",
      headers: { origin, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}
beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.JOB_SEARCH_OWNER_EMAIL;
  delete process.env.OPENAI_API_KEY;
  state = emptyWorkspace();
  version = 1;
  mocks.getUser.mockResolvedValue({
    data: { user: { id, email: "owner@example.com" } },
    error: null,
  });
  mocks.read.mockImplementation(async () => ({
    state: structuredClone(state),
    version,
  }));
  mocks.save.mockImplementation(async (next, previous, event) => {
    if (previous !== version) throw new Error("unexpected version");
    const saved = { ...next, activity: [...next.activity, event] };
    state = structuredClone(saved);
    version++;
    return { state: saved, version };
  });
});
describe("job search API boundaries", () => {
  it("imports a job URL without an AI key, reserves cooldown and returns fields without saving a role", async () => {
    mocks.importURL.mockResolvedValue({
      company: "Example",
      role: "QA Lead",
      posting: "Description",
      url: "https://example.com/job",
      warnings: [],
    });
    const response = await post({
      action: "import-url",
      version,
      url: "https://example.com/job",
    });
    expect(response.status).toBe(200);
    expect((await response.json()).imported.company).toBe("Example");
    expect(state.applications).toEqual([]);
    expect(state.lastImportAt).toBeTruthy();
    expect(
      (
        await post({
          action: "import-url",
          version,
          url: "https://example.com/job",
        })
      ).status,
    ).toBe(429);
    expect(mocks.importURL).toHaveBeenCalledTimes(1);
  });
  it("rejects unsafe URLs and signed-out imports before any network call", async () => {
    expect(
      (
        await post({
          action: "import-url",
          version,
          url: "https://127.0.0.1/job",
        })
      ).status,
    ).toBe(422);
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect(
      (
        await post({
          action: "import-url",
          version,
          url: "https://example.com/job",
        })
      ).status,
    ).toBe(401);
    expect(mocks.importURL).not.toHaveBeenCalled();
  });
  it("saves generated evaluation after the reservation and clears stale approvals", async () => {
    process.env.OPENAI_API_KEY = "fake-test-key";
    state.profile = {
      cv: "CV",
      goals: "QA",
      constraints: "",
      writingStyle: "",
    };
    state.applications = [
      {
        id,
        posting: "Plain posting",
        reviewed: true,
        draft: { cv: "old" },
        version: 1,
      },
    ] as never;
    mocks.generate.mockResolvedValue({ recommendation: "Clarify work rights" });
    const response = await post({
      action: "evaluate",
      version,
      id,
      consent: true,
      acknowledgeWarnings: false,
    });
    expect(response.status).toBe(200);
    expect(state.applications[0]).toMatchObject({
      evaluation: { recommendation: "Clarify work rights" },
      reviewed: false,
      draft: null,
      version: 2,
    });
    expect(state.activity.map((a) => a.action)).toEqual([
      "evaluate:started",
      "evaluate",
    ]);
    expect(version).toBe(3);
  });
  it("rejects signed-out requests before reading data", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect((await GET()).status).toBe(401);
    expect(mocks.read).not.toHaveBeenCalled();
  });
  it("enforces the optional server owner allowlist", async () => {
    process.env.JOB_SEARCH_OWNER_EMAIL = "different@example.com";
    expect((await GET()).status).toBe(401);
    expect(mocks.read).not.toHaveBeenCalled();
  });
  it("rejects anonymous Auth accounts", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id, is_anonymous: true } },
      error: null,
    });
    expect((await GET()).status).toBe(401);
  });
  it("rejects cross-origin writes, malformed inputs and stale state", async () => {
    expect(
      (await post({ action: "create" }, "https://attacker.example")).status,
    ).toBe(403);
    expect((await post({ action: "create" })).status).toBe(400);
    expect((await post({ action: "delete", version: 0, id })).status).toBe(409);
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("returns 404 for another workspace application ID", async () => {
    expect((await post({ action: "delete", version, id })).status).toBe(404);
  });
  it("stores pasted adverts without fetching their URLs", async () => {
    const response = await post({
      action: "create",
      version,
      job: {
        role: "QA Lead",
        company: "Example",
        posting: "Job description. ".repeat(10),
        url: "https://example.com/job",
      },
    });
    expect(response.status).toBe(200);
    expect(state.applications[0].posting).toContain("Job description.");
  });
  it("invalidates AI results and review after profile changes", async () => {
    state.applications = [
      { id, reviewed: true, draft: { cv: "old" }, evaluation: {}, version: 1 },
    ] as never;
    expect(
      (
        await post({
          action: "profile",
          version,
          profile: {
            cv: "Verified CV ".repeat(20),
            goals: "QA leadership roles",
            constraints: "",
            writingStyle: "",
          },
        })
      ).status,
    ).toBe(200);
    expect(state.applications[0]).toMatchObject({
      draft: null,
      evaluation: null,
      reviewed: false,
      version: 2,
    });
  });
  it("requires human review before recording Applied", async () => {
    state.applications = [{ id, reviewed: false, draft: null }] as never;
    expect(
      (
        await post({
          action: "update",
          version,
          id,
          status: "Applied",
          notes: "",
          followUp: "",
        })
      ).status,
    ).toBe(422);
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("fails honestly without an AI key, and never returns mock AI success", async () => {
    state.profile = {
      cv: "CV",
      goals: "QA",
      constraints: "",
      writingStyle: "",
    };
    state.applications = [{ id, posting: "Plain posting" }] as never;
    expect(
      (
        await post({
          action: "evaluate",
          version,
          id,
          consent: true,
          acknowledgeWarnings: false,
        })
      ).status,
    ).toBe(503);
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("persists cooldown before provider failure, preventing rapid retries", async () => {
    process.env.OPENAI_API_KEY = "fake-test-key";
    state.profile = {
      cv: "CV",
      goals: "QA",
      constraints: "",
      writingStyle: "",
    };
    state.applications = [{ id, posting: "Plain posting" }] as never;
    mocks.generate.mockRejectedValue(new Error("Timeout"));
    expect(
      (
        await post({
          action: "evaluate",
          version,
          id,
          consent: true,
          acknowledgeWarnings: false,
        })
      ).status,
    ).toBe(502);
    expect(state.activity[0].action).toBe("evaluate:started");
    expect(
      (
        await post({
          action: "evaluate",
          version,
          id,
          consent: true,
          acknowledgeWarnings: false,
        })
      ).status,
    ).toBe(429);
  });
});
