-- AI EventOps Assistant — Supabase schema PLACEHOLDER
-- Maps 1:1 to the MongoDB collections used by the demo today.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date,
  venue text, city text,
  flyer_image text, ticket_link text,
  organiser_name text, organiser_email text,
  artist_details text, refund_policy text, parking_info text, meet_greet text,
  status text default 'Draft',
  created_at timestamptz default now()
);

create table if not exists event_faqs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  question text, answer text
);

create table if not exists customer_messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  customer_name text, channel text default 'whatsapp', message text,
  category text, risk_level text, confidence numeric, status text default 'Needs Review',
  created_at timestamptz default now()
);

create table if not exists ai_draft_responses (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references customer_messages(id) on delete cascade,
  reply text, confidence numeric, model text, created_at timestamptz default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references customer_messages(id),
  decision text, decided_by text, decided_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  name text, email text, phone text, category text, stage text default 'New', value numeric default 0, note text,
  created_at timestamptz default now()
);

create table if not exists content_generations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  type text, prompt text, content text, created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text, actor text, detail text, risk_level text, created_at timestamptz default now()
);

create table if not exists test_runs (
  id uuid primary key default gen_random_uuid(), name text, started_at timestamptz default now(), status text
);
create table if not exists test_results (
  id uuid primary key default gen_random_uuid(), run_id uuid references test_runs(id), scenario text, status text, detail text
);
create table if not exists prompt_risk_cases (
  id uuid primary key default gen_random_uuid(), code text, risk text, category text, level text, mitigation text
);
