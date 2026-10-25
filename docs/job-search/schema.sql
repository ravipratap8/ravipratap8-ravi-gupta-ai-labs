-- Apply once to the SAME Supabase project already used by Ravi Gupta AI Labs.
-- Additive only. Never imports CVs or example personal data.
begin;
create table public.job_search_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{"profile":null,"applications":[],"activity":[]}'::jsonb,
  version integer not null default 1 check (version > 0),
  updated_at timestamptz not null default now(),
  constraint job_search_state_shape check (
    jsonb_typeof(state) = 'object'
    and jsonb_typeof(state->'applications') = 'array'
    and jsonb_typeof(state->'activity') = 'array'
    and octet_length(state::text) < 20000000
  )
);
alter table public.job_search_workspaces enable row level security;
alter table public.job_search_workspaces force row level security;
revoke all on public.job_search_workspaces from public, anon, authenticated;
grant select, insert, update, delete on public.job_search_workspaces to authenticated;
create policy "Read own career workspace" on public.job_search_workspaces
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own career workspace" on public.job_search_workspaces
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own career workspace" on public.job_search_workspaces
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Delete own career workspace" on public.job_search_workspaces
  for delete to authenticated using ((select auth.uid()) = user_id);
commit;
