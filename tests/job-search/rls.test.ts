import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { describe, it, expect } from "vitest";

describe("Postgres career workspace isolation", () => {
  it("enforces read/write ownership, denies anon and prevents owner reassignment", async () => {
    const db = new PGlite();
    try {
      await db.exec(`create role anon; create role authenticated; create schema auth;
        create table auth.users(id uuid primary key);
        create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
        grant usage on schema auth to authenticated;
        insert into auth.users values ('11111111-1111-4111-8111-111111111111'), ('22222222-2222-4222-8222-222222222222');`);
      await db.exec(
        readFileSync(
          new URL("../../docs/job-search/schema.sql", import.meta.url),
          "utf8",
        ),
      );
      await db.exec(`set role authenticated; set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
        insert into public.job_search_workspaces(user_id) values ('11111111-1111-4111-8111-111111111111');`);
      expect(
        (await db.query("select * from public.job_search_workspaces")).rows,
      ).toHaveLength(1);
      await expect(
        db.exec(
          `update public.job_search_workspaces set user_id='22222222-2222-4222-8222-222222222222'`,
        ),
      ).rejects.toThrow();
      await db.exec(
        `set request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';`,
      );
      expect(
        (await db.query("select * from public.job_search_workspaces")).rows,
      ).toHaveLength(0);
      await expect(
        db.exec(
          `insert into public.job_search_workspaces(user_id) values ('11111111-1111-4111-8111-111111111111')`,
        ),
      ).rejects.toThrow();
      expect(
        (
          await db.query(
            "update public.job_search_workspaces set version=9 returning *",
          )
        ).rows,
      ).toHaveLength(0);
      expect(
        (await db.query("delete from public.job_search_workspaces returning *"))
          .rows,
      ).toHaveLength(0);
      await db.exec(
        `insert into public.job_search_workspaces(user_id) values ('22222222-2222-4222-8222-222222222222');`,
      );
      expect(
        (await db.query("select * from public.job_search_workspaces")).rows,
      ).toHaveLength(1);
      await db.exec("reset role; set role anon;");
      await expect(
        db.query("select * from public.job_search_workspaces"),
      ).rejects.toThrow();
    } finally {
      await db.close();
    }
  }, 30000);
});
