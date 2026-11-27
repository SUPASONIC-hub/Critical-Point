-- 첫 30분 자동 기록 (2026-11-27 결정, 사용자 「전부 1」).
--
-- The three-person observation of a first half hour, written by the game
-- (src/firstHourLog.js). A device that had none of the game's data when the
-- page first loaded keeps one small flat record of its first 30 minutes --
-- the first button on the start screen, the cold opening, the first table,
-- the first BUST, the case file, the scout, where it left, how far it got,
-- and the answers to two tap questions -- and sends it whole at a few points.
-- Only a device that left 「기록 보내기」 on sends.
--
-- One row per record, by the record's own id (a random UUID the client mints
-- for this alone: no session id, no run id, no name). No address is stored
-- here or used as a key: the only limit is one for everyone together, new
-- records in a day (`first_hour_daily_new_runs`, private_settings, 2,000 by
-- default), and a record takes at most 80 updates in its first 7 days.
--
-- The client has no grant on the table. It calls one function:
--   first_hour_record(id, record)  -- insert the record, or replace it with a newer copy
-- It never reads anything back. Only the service role reads the table (the
-- daily Funnel run's aggregate, scripts/report-first-hour.mjs). Until this is
-- applied the call answers 404 and the client says nothing (a lost send is
-- carried by the next).
--
-- The record is flat: at most the keys below, each a string of up to 64
-- characters, a number from 0 to 100000, a boolean or null, 1,536 bytes in all,
-- and `first` must be true.

create table if not exists public.first_hour_runs (
  id bigint generated always as identity primary key,
  record_id uuid not null unique,
  record jsonb not null,
  updates integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint first_hour_runs_record check (jsonb_typeof(record) = 'object' and octet_length(record::text) <= 1536)
);

create index if not exists first_hour_runs_created_at_idx on public.first_hour_runs (created_at);

alter table public.first_hour_runs enable row level security;
revoke all on public.first_hour_runs from public, anon, authenticated;
grant all on public.first_hour_runs to service_role;

create or replace function public.first_hour_record(p_id uuid, p_record jsonb)
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_bad integer;
begin
  if p_id is null or p_record is null or jsonb_typeof(p_record) <> 'object'
     or octet_length(p_record::text) > 1536
     or p_record -> 'first' is distinct from 'true'::jsonb then
    raise exception 'invalid first hour record';
  end if;
  -- The fields src/firstHourLog.js sends (FIRST_HOUR_FIELDS), and nothing nested.
  select count(*) into v_bad
  from jsonb_each(p_record) as e
  where not (e.key = any (array[
      'v', 'first', 'dev', 'lang', 'btn', 'btnS', 'startS', 'cold', 'coldPages',
      't1', 't1Push', 't1Hint', 't1Timeout', 'bustS', 'bustNode', 'file', 'scout', 'narrow',
      'lastAt', 'lastS', 'past30', 'far', 'farCase', 'lost', 'again'
    ]))
    or jsonb_typeof(e.value) not in ('string', 'number', 'boolean', 'null')
    or (jsonb_typeof(e.value) = 'string' and length(e.value #>> '{}') > 64)
    or (jsonb_typeof(e.value) = 'number' and (e.value #>> '{}')::numeric not between 0 and 100000);
  if v_bad > 0 then
    raise exception 'invalid first hour record';
  end if;

  if not exists (select 1 from public.first_hour_runs r where r.record_id = p_id) then
    if not public.bump_rate_limit(
      'global:first-hour-new',
      interval '1 day',
      public.private_setting_int('first_hour_daily_new_runs', 2000)::integer
    ) then
      raise exception using errcode = 'PT429', message = 'first hour record limit reached';
    end if;
    insert into public.first_hour_runs (record_id, record)
    values (p_id, p_record)
    on conflict (record_id) do nothing;
    return true;
  end if;

  update public.first_hour_runs
  set record = p_record, updates = updates + 1, updated_at = now()
  where record_id = p_id
    and updates < 80
    and created_at > now() - interval '7 days';
  return found;
end;
$$;

-- anon only: the app has no sign-in, so `authenticated` is never the caller.
revoke all on function public.first_hour_record(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.first_hour_record(uuid, jsonb) to anon, service_role;

-- Kept 180 days, as the play records are (purge_old_telemetry): a job of its
-- own, scheduled the way 20260928040000 schedules that one, and a notice
-- where pg_cron is not there (PGlite in check:grants, a plain Postgres).
do $do$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    execute $sql$select cron.schedule('purge-first-hour-runs', '27 4 * * *', 'delete from public.first_hour_runs where created_at < now() - interval ''180 days''')$sql$;
  else
    raise notice 'pg_cron unavailable; first_hour_runs is not purged on a schedule';
  end if;
end;
$do$;
