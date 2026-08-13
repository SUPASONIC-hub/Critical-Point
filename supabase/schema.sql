create table if not exists public.playtest_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  session_code text not null,
  player_name text,
  case_id text not null,
  case_title text,
  completed_at timestamptz not null,
  summary jsonb not null,
  resources jsonb not null,
  triggers jsonb not null,
  cognition jsonb not null,
  decision_log jsonb not null,
  feedback jsonb,
  created_at timestamptz not null default now()
);

alter table public.playtest_sessions enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'playtest_sessions'
      and policyname = 'allow anonymous playtest inserts'
  ) then
    create policy "allow anonymous playtest inserts"
    on public.playtest_sessions
    for insert
    to anon
    with check (true);
  end if;
end $$;

create table if not exists public.playtest_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  session_code text not null,
  case_id text not null,
  case_title text,
  submitted_at timestamptz not null,
  clarity_score integer check (clarity_score between 1 and 5),
  difficulty_score integer check (difficulty_score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.playtest_feedback enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'playtest_feedback'
      and policyname = 'allow anonymous playtest feedback inserts'
  ) then
    create policy "allow anonymous playtest feedback inserts"
    on public.playtest_feedback
    for insert
    to anon
    with check (true);
  end if;
end $$;
