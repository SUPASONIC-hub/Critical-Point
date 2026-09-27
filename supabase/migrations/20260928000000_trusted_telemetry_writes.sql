-- Make the server, not the client, decide what a telemetry row says about time,
-- identity and pace -- and make the ranking something a script cannot own.
--
-- What the audit found, in the order it is fixed below:
--
-- 1. The ranking could be forged in one request. anon could insert any column
--    of `playtest_sessions`, the trigger checked only that a `season-final` row
--    had a 0-100 score, an S/A/B/C rank and one decision, and the client read
--    the 100 most recent rows (`order=completed_at.desc`) and ranked inside
--    them. A row dated 2099 was therefore both #1 and permanently among the
--    "most recent" 100, and a hundred such rows pushed every real run out.
--    Now: `completed_at` is `now()` whatever the client sends; a season-final
--    row is accepted only for a run the database has already seen play every
--    case of the season (`season_case_ids()`), over at least ten minutes, with
--    the same device having written the run's `final` case; one per run, two
--    per device a day; and the ranking is ordered by a server-computed `score`
--    column instead of by date. It is still a playtest ranking, not an
--    anti-cheat system -- a patient script can walk a fake run through every
--    case -- but it can no longer do it in one request, instantly, forever.
--
-- 2. The rate-limit key was the raw `x-forwarded-for` string. The API gateway
--    appends the address it saw to whatever the client sent, so a client that
--    sends its own XFF gets a fresh key per request, and a school's NAT shared
--    one 120/hour budget. `request_client_ip()` takes `cf-connecting-ip` when
--    the edge set one and otherwise the right-most XFF hop -- the one the
--    trusted proxy appended -- and the budget is per (address, session) with a
--    higher ceiling per address.
--
-- 3. Timestamps are forced or clamped in the trigger. `created_at` and
--    `completed_at` are `now()`; an error log's `occurred_at` must be inside
--    the last 30 days or becomes `now()`. 'infinity' can no longer escape
--    retention.
--
-- 4. Sizes are bounded: session codes, titles, names, each decision-log entry,
--    each jsonb blob and the row as a whole. Error-log text is truncated rather
--    than refused, because an error log that is refused is lost.
--
-- 5. `event_id` gets a full `unique` constraint (NULLs still never conflict), so
--    a retried item that already landed is refused with a 409, which the client
--    counts as delivered. It does not send `on_conflict=event_id`: an ON
--    CONFLICT target needs SELECT on that column, and anon must not read it.
--
-- 6. `unique (run_id, case_id)` replaces the check-then-insert dedupe, which
--    two concurrent retries could both pass. Duplicates already in the table
--    are deleted first (keeping the earliest row), and the index is built in
--    the migration's transaction rather than CONCURRENTLY -- CONCURRENTLY is
--    refused inside a transaction, and this table is small enough that the
--    brief write lock is the cheaper risk.
--
-- 7. `public_rankings` stops publishing `run_id` and `session_code`. It keeps
--    `security_invoker = true` (priority 25): the row filter stays an RLS
--    policy and the column filter a column grant (see 20260928030000), and the
--    view now reads `run_tag` -- the last eight characters the ranking screen
--    already printed -- and `score`.
--
-- 8. `seasonComplete` is normalised to JSON `true`. The trigger accepted '1'
--    while the read policy only listed 'true', so such a row was stored and
--    never shown.

-- ------------------------------------------------------------ helpers

-- The season as the database knows it. `src/gameCases.js` CASE_SEQUENCE is the
-- other copy, and `npm run check:grants` fails when the two disagree -- the
-- season has changed length six times, and every time the schema lagged.
create or replace function public.season_case_ids()
returns text[]
language sql
immutable
set search_path = ''
as $$
  select array[
    'prologue01', 'prologue02', 'prologue03', 'prologue04', 'prologue05',
    'case01', 'case02', 'case03', 'case04', 'case05', 'case06', 'case07', 'case08', 'case09', 'case10',
    'case11', 'case12', 'case13', 'case14', 'case15', 'case16', 'case17', 'case18', 'case19', 'case20',
    'case21', 'case22', 'case23', 'case24', 'case25', 'case26', 'case27', 'case28', 'case29', 'case30',
    'case31', 'case32', 'case33', 'case34', 'case35', 'case36', 'case37', 'case38', 'case39', 'case40',
    'case41', 'case42', 'case43', 'case44', 'case45', 'case46', 'case47', 'case48', 'case49',
    'final'
  ]::text[];
$$;

-- Unchanged predicate, now with a pinned search_path like every other function
-- here (the advisor flags a mutable one).
create or replace function public.is_season_case_id(p_case_id text, p_allow_season boolean)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_case_id ~ '^case[0-9]{2}$'
    or p_case_id ~ '^prologue[0-9]{2}$'
    or p_case_id = 'final'
    or (p_allow_season and p_case_id = 'season-final');
$$;

-- The address a request came from, as far as a trusted hop can vouch for it.
-- `cf-connecting-ip` is set by the edge and overwritten if a client sends it;
-- otherwise the right-most `x-forwarded-for` entry is the one the gateway
-- appended. The left-most entry -- what the old key effectively used -- is
-- whatever the client wrote. NULL when there is no request (SQL editor, cron,
-- tests without headers); callers fall back to the session.
create or replace function public.request_client_ip()
returns text
language plpgsql
stable
set search_path = ''
as $$
declare
  v_headers jsonb;
  v_ip text;
begin
  begin
    v_headers := nullif(current_setting('request.headers', true), '')::jsonb;
  exception when others then
    v_headers := null;
  end;
  if v_headers is null or jsonb_typeof(v_headers) <> 'object' then
    return null;
  end if;
  v_ip := btrim(coalesce(v_headers->>'cf-connecting-ip', ''));
  if v_ip = '' then
    v_ip := btrim(regexp_replace(coalesce(v_headers->>'x-forwarded-for', ''), '^.*,', ''));
  end if;
  if v_ip ~ '^[0-9A-Fa-f:.]{3,45}$' then
    return lower(v_ip);
  end if;
  return null;
end;
$$;

-- Increment, then compare: the upsert takes the row lock, so two concurrent
-- requests cannot both read the old count. A refused request raises and rolls
-- its own increment back, so a flood stays pinned at the limit rather than
-- digging a deeper hole.
create or replace function public.bump_rate_limit(p_key text, p_window interval, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.telemetry_rate_limits as t (actor_key, window_started_at, request_count)
  values (left(p_key, 200), now(), 1)
  on conflict (actor_key) do update
  set request_count = case
        when now() - t.window_started_at >= p_window then 1
        else t.request_count + 1
      end,
      window_started_at = case
        when now() - t.window_started_at >= p_window then now()
        else t.window_started_at
      end
  returning t.request_count into v_count;
  return v_count <= p_limit;
end;
$$;

revoke all on function public.request_client_ip() from public, anon, authenticated;
revoke all on function public.bump_rate_limit(text, interval, integer) from public, anon, authenticated;

-- ------------------------------------------------------------ constraints

alter table public.playtest_sessions add constraint playtest_sessions_event_id_key unique (event_id);
alter table public.playtest_feedback add constraint playtest_feedback_event_id_key unique (event_id);
alter table public.app_error_logs add constraint app_error_logs_event_id_key unique (event_id);
drop index if exists public.playtest_sessions_event_id_idx;
drop index if exists public.playtest_feedback_event_id_idx;
drop index if exists public.app_error_logs_event_id_idx;

delete from public.playtest_sessions a
using public.playtest_sessions b
where a.run_id is not null
  and a.run_id = b.run_id
  and a.case_id = b.case_id
  and a.id > b.id;
create unique index if not exists playtest_sessions_run_case_key
  on public.playtest_sessions (run_id, case_id) where run_id is not null;

-- ------------------------------------------------------------ ranking columns

-- Both are derived by the database, so neither can be written: a generated
-- column refuses an explicit value. Adding a stored column rewrites the table
-- once, under the migration's lock.
alter table public.playtest_sessions
  add column if not exists score numeric generated always as (
    case
      when summary->>'burstScore' ~ '^[0-9]{1,3}([.][0-9]{1,6})?$'
        and (summary->>'burstScore')::numeric <= 100
      then (summary->>'burstScore')::numeric
    end
  ) stored;
alter table public.playtest_sessions
  add column if not exists run_tag text generated always as (
    upper(right(regexp_replace(coalesce(run_id, ''), '[^A-Za-z0-9]', '', 'g'), 8))
  ) stored;

create index if not exists playtest_sessions_ranking_idx
  on public.playtest_sessions (score desc nulls last, completed_at)
  where case_id = 'season-final';
create index if not exists playtest_sessions_season_session_idx
  on public.playtest_sessions (session_id, completed_at)
  where case_id = 'season-final';

-- Rows the new rules would have refused. A season-final row dated in the future
-- is forged by construction (the client stamps `new Date()`), and one without
-- the run's case rows cannot be told apart from a forgery. Same reset as the
-- six before it: only ranking rows go, per-case telemetry stays. The copy of
-- `runId` inside a season summary goes too; `run_id` already holds it and the
-- summary is the part anon can read.
delete from public.playtest_sessions s
where s.case_id = 'season-final'
  and (
    s.completed_at > now() + interval '1 hour'
    or s.run_id is null
    or (
      select count(distinct c.case_id)
      from public.playtest_sessions c
      where c.run_id = s.run_id and c.case_id = any(public.season_case_ids())
    ) < cardinality(public.season_case_ids())
  );

-- ------------------------------------------------------------ the trigger

create or replace function public.validate_telemetry_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row jsonb := to_jsonb(new);
  v_session_id text := v_row->>'session_id';
  v_session_code text := v_row->>'session_code';
  v_event_id text := v_row->>'event_id';
  v_ip text := public.request_client_ip();
  v_summary jsonb;
  v_score_text text;
  v_run_id text;
  v_entry jsonb;
  v_covered integer;
  v_first_at timestamptz;
  v_owns_final boolean;
  v_recent_finals integer;
begin
  if v_session_id is null or length(v_session_id) not between 8 and 128 then
    raise exception 'invalid telemetry session id';
  end if;
  if v_session_code is not null and length(v_session_code) > 32 then
    raise exception 'invalid telemetry session code';
  end if;
  if v_event_id is not null and length(v_event_id) not between 1 and 128 then
    raise exception 'invalid telemetry event id';
  end if;
  if octet_length(v_row::text) > 524288 then
    raise exception 'telemetry payload too large';
  end if;

  if TG_TABLE_NAME = 'playtest_sessions' then
    new.completed_at := now();
    -- Every remote row is anonymous; the ranking never showed this column's
    -- value, and a free-text column readable by anon is a publishing channel.
    new.player_name := '익명 분석관';
    v_summary := coalesce(new.summary, '{}'::jsonb);
    v_run_id := nullif(new.run_id, '');
    new.run_id := v_run_id;

    if not public.is_season_case_id(new.case_id, true)
      or jsonb_typeof(v_summary) <> 'object'
      or jsonb_typeof(new.decision_log) <> 'array'
      or jsonb_array_length(new.decision_log) > 100 then
      raise exception 'invalid playtest session payload';
    end if;
    if (v_run_id is not null and length(v_run_id) > 128)
      or length(coalesce(new.case_title, '')) > 80
      or octet_length(v_summary::text) > 65536
      or octet_length(coalesce(new.resources, '{}'::jsonb)::text) > 8192
      or octet_length(coalesce(new.triggers, '{}'::jsonb)::text) > 8192
      or octet_length(coalesce(new.cognition, '{}'::jsonb)::text) > 8192
      or octet_length(coalesce(new.dynamics, '{}'::jsonb)::text) > 16384 then
      raise exception 'playtest session field too large';
    end if;
    for v_entry in select value from jsonb_array_elements(new.decision_log) loop
      if octet_length(v_entry::text) > 16384 then
        raise exception 'decision log entry too large';
      end if;
    end loop;

    -- One row per run and case. The lock serialises concurrent retries of the
    -- same pair; the unique index is the backstop if anything gets past it.
    if v_run_id is not null then
      perform pg_advisory_xact_lock(hashtext('run-case:' || v_run_id || ':' || new.case_id));
      if exists (
        select 1 from public.playtest_sessions s
        where s.run_id = v_run_id and s.case_id = new.case_id
      ) then
        return null;
      end if;
    end if;

    if new.case_id = 'season-final' then
      if (v_summary->>'seasonComplete') not in ('true', '1') then
        raise exception 'season ranking requires a completed summary';
      end if;
      v_summary := jsonb_set(v_summary - 'runId', '{seasonComplete}', 'true'::jsonb);
      v_score_text := v_summary->>'burstScore';
      if v_score_text is null or v_score_text !~ '^[0-9]{1,3}([.][0-9]{1,6})?$' or v_score_text::numeric > 100 then
        raise exception 'invalid season ranking score';
      end if;
      if coalesce(v_summary->>'rank', '') not in ('S', 'A', 'B', 'C') then
        raise exception 'invalid season ranking rank';
      end if;
      if (v_summary->>'averageResponseTime') is not null
        and (v_summary->>'averageResponseTime') !~ '^[0-9]{1,6}([.][0-9]+)?$' then
        raise exception 'invalid season response time';
      end if;
      if jsonb_array_length(new.decision_log) < 1 then
        raise exception 'season ranking requires decisions';
      end if;
      if length(coalesce(new.case_title, '')) > 40 then
        raise exception 'season ranking title too long';
      end if;
      if v_run_id is null then
        raise exception 'season ranking requires a run id';
      end if;
      -- The run has to have been played where the database could see it: every
      -- case of the season, the first at least ten minutes ago, and the `final`
      -- case from this device. Other cases may come from another device, since
      -- a cloud save carries the run across. Consent turned on mid-season means
      -- no ranking row for that run -- the server has no way to tell it apart.
      select count(distinct s.case_id), min(s.completed_at), coalesce(bool_or(s.case_id = 'final' and s.session_id = v_session_id), false)
        into v_covered, v_first_at, v_owns_final
        from public.playtest_sessions s
       where s.run_id = v_run_id
         and s.case_id = any(public.season_case_ids());
      if v_covered < cardinality(public.season_case_ids()) or not v_owns_final then
        raise exception 'season ranking requires every case of the run';
      end if;
      if v_first_at > now() - interval '10 minutes' then
        raise exception 'season ranking run is implausibly short';
      end if;
      select count(*) into v_recent_finals
        from public.playtest_sessions s
       where s.session_id = v_session_id
         and s.case_id = 'season-final'
         and s.completed_at > now() - interval '1 day';
      if v_recent_finals >= 2 then
        raise exception 'season ranking limit reached';
      end if;
      new.summary := v_summary;
    end if;
  elsif TG_TABLE_NAME = 'playtest_feedback' then
    new.created_at := now();
    if new.case_id is not null and not public.is_season_case_id(new.case_id, false) then
      raise exception 'invalid feedback case';
    end if;
    if jsonb_typeof(new.feedback) <> 'object' or octet_length(new.feedback::text) > 8192 then
      raise exception 'invalid feedback payload';
    end if;
  elsif TG_TABLE_NAME = 'app_error_logs' then
    new.created_at := now();
    if new.current_case is not null and new.current_case <> 'unknown' and not public.is_season_case_id(new.current_case, false) then
      raise exception 'invalid error log case';
    end if;
    if new.occurred_at is null or not isfinite(new.occurred_at)
      or new.occurred_at > now() or new.occurred_at < now() - interval '30 days' then
      new.occurred_at := now();
    end if;
    new.source := left(new.source, 64);
    new.node_id := left(new.node_id, 120);
    new.error_name := left(new.error_name, 120);
    new.error_message := left(new.error_message, 2000);
    new.error_stack := left(new.error_stack, 8000);
    new.component_stack := left(new.component_stack, 8000);
    new.dom_snapshot := left(new.dom_snapshot, 4000);
    if octet_length(new.viewport::text) > 2048 then new.viewport := '{"truncated": true}'::jsonb; end if;
    if octet_length(new.context::text) > 8192 then new.context := '{"truncated": true}'::jsonb; end if;
    if octet_length(new.error::text) > 8192 then new.error := '{"truncated": true}'::jsonb; end if;
  else
    -- free_text_analyses: no longer writable by anon (20260928030000), kept
    -- only so a service-role insert still gets a server timestamp.
    new := jsonb_populate_record(new, jsonb_build_object('created_at', now()));
  end if;

  -- Pace, counted after the cheap refusals and the silent dedupe so neither
  -- spends budget. A season is 55 case rows plus feedback, so one device gets
  -- 240 an hour; an address -- a school, an office, a phone carrier's NAT --
  -- gets 1,200 across all of its devices.
  if not public.bump_rate_limit('tele:' || coalesce(v_ip, '-') || '|' || v_session_id, interval '1 hour', 240) then
    raise exception 'telemetry rate limit exceeded';
  end if;
  if v_ip is not null and not public.bump_rate_limit('tele-ip:' || v_ip, interval '1 hour', 1200) then
    raise exception 'telemetry rate limit exceeded';
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_telemetry_insert() from public, anon, authenticated;

-- ------------------------------------------------------------ the ranking read

drop policy if exists "public can read completed season rankings" on public.playtest_sessions;
create policy "public can read completed season rankings" on public.playtest_sessions
for select to anon
using (
  case_id = 'season-final'
  and summary->>'seasonComplete' = 'true'
  and score is not null
);

drop view if exists public.public_rankings;
create view public.public_rankings
with (security_invoker = true)
as
select
  run_tag,
  player_name,
  case_id,
  case_title,
  completed_at,
  summary,
  score
from public.playtest_sessions
where case_id = 'season-final';

notify pgrst, 'reload schema';
