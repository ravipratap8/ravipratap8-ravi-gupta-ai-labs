import type { SupabaseClient } from "@supabase/supabase-js";
import type { Application, CandidateProfile } from "./schema";

export type Activity = {
  at: string;
  action: string;
  applicationId?: string;
  promptVersion?: string;
  model?: string;
};
export type JobWorkspace = {
  profile: CandidateProfile | null;
  applications: Application[];
  activity: Activity[];
  lastAIAt?: string;
};
export const emptyWorkspace = (): JobWorkspace => ({
  profile: null,
  applications: [],
  activity: [],
});
export class WorkspaceConflict extends Error {}

// Uses the signed-in user's client, never a service-role key. RLS is the second boundary.
export class JobSearchRepository {
  constructor(
    private db: SupabaseClient,
    private userId: string,
  ) {}
  async read(): Promise<{ state: JobWorkspace; version: number }> {
    const { data, error } = await this.db
      .from("job_search_workspaces")
      .select("state, version")
      .eq("user_id", this.userId)
      .maybeSingle();
    if (error) throw new Error("STORAGE_UNAVAILABLE");
    return data
      ? { state: data.state as JobWorkspace, version: data.version }
      : { state: emptyWorkspace(), version: 0 };
  }
  async save(state: JobWorkspace, version: number, event: Activity) {
    const next = { ...state, activity: [...state.activity, event].slice(-300) };
    const row = {
      state: next,
      version: version + 1,
      updated_at: new Date().toISOString(),
    };
    if (version === 0) {
      const { error } = await this.db
        .from("job_search_workspaces")
        .insert({ user_id: this.userId, ...row });
      if (error?.code === "23505") throw new WorkspaceConflict();
      if (error) throw new Error("STORAGE_UNAVAILABLE");
    } else {
      const { data, error } = await this.db
        .from("job_search_workspaces")
        .update(row)
        .eq("user_id", this.userId)
        .eq("version", version)
        .select("version")
        .maybeSingle();
      if (error) throw new Error("STORAGE_UNAVAILABLE");
      if (!data) throw new WorkspaceConflict();
    }
    return { state: next, version: version + 1 };
  }
}
