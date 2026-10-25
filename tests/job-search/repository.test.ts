import { describe, expect, it, vi } from "vitest";
import {
  JobSearchRepository,
  WorkspaceConflict,
  emptyWorkspace,
} from "../../lib/job-search/repository";
import type { SupabaseClient } from "@supabase/supabase-js";

function database(result: object) {
  const chain: any = {};
  for (const name of ["select", "eq", "update"])
    chain[name] = vi.fn(() => chain);
  chain.maybeSingle = vi.fn(async () => result);
  chain.insert = vi.fn(async () => result);
  const from = vi.fn(() => chain);
  return { client: { from } as unknown as SupabaseClient, from, chain };
}
describe("owner-scoped repository concurrency", () => {
  it("scopes reads and conditional updates to the signed-in owner", async () => {
    const db = database({
      data: { state: emptyWorkspace(), version: 7 },
      error: null,
    });
    const repo = new JobSearchRepository(db.client, "owner-id");
    expect((await repo.read()).version).toBe(7);
    expect(db.chain.eq).toHaveBeenCalledWith("user_id", "owner-id");
    await repo.save(emptyWorkspace(), 7, { action: "create", at: "now" });
    expect(db.chain.eq).toHaveBeenCalledWith("version", 7);
    expect(db.chain.update.mock.calls[0][0].version).toBe(8);
  });
  it("rejects a concurrent edit when the conditional update matches no row", async () => {
    const db = database({ data: null, error: null });
    await expect(
      new JobSearchRepository(db.client, "owner").save(emptyWorkspace(), 7, {
        action: "create",
        at: "now",
      }),
    ).rejects.toBeInstanceOf(WorkspaceConflict);
  });
  it("treats competing first inserts as a conflict instead of overwriting", async () => {
    const db = database({ data: null, error: { code: "23505" } });
    await expect(
      new JobSearchRepository(db.client, "owner").save(emptyWorkspace(), 0, {
        action: "create",
        at: "now",
      }),
    ).rejects.toBeInstanceOf(WorkspaceConflict);
  });
});
