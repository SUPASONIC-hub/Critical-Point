-- 2026-10-14. `validate_telemetry_insert` in parts. No rule changes here.
--
-- The function has been written out whole seven times (20260902055713,
-- 20260902061041, 20260916000000, 20260928000000, 20260929010000,
-- 20261010000000, 20261011010000). The last two restated 209 and 221 lines to
-- add 12 and 14: one block each, saying which runs the ranking does not take.
-- A restated function is reviewed by diffing it against the one before, and
-- the day that diff is skipped is the day a cap or a pace limit changes with
-- nobody having decided it.
--
-- So the checks move into nine functions, one per thing that has changed
-- together so far, and the trigger function keeps what cannot leave it: the
-- row itself (`new`), the table it fired for, and the order. The next rule
-- change restates the one small function it is about.
--
--   telemetry_check_envelope      session id, session code, event id, row bytes
--   telemetry_check_session_row   a case row's shape and the caps of 20260929010000
--   telemetry_case_is_replay      one row per run and case; the replay budget
--   ranking_check_request         what a ranking request has to say itself
--   ranking_check_run             every case, from this device, watched for long enough
--   ranking_check_run_marks       which runs are not ranked: story mode, the beat table
--   ranking_run_summary           what is published, read from the run's final case
--   ranking_charge_limits         two a day for a device, twenty for an address
--   telemetry_charge_pace         240 an hour, 1,200 an hour, the day's bytes
--
-- What is the same, and has to be: every statement below is one from
-- 20261011010000, in the order it stood there, with a variable renamed to the
-- parameter that carries it (`v_run_id` to `p_run_id`, `new.case_id` to
-- `p_case_id`, `TG_TABLE_NAME` to `p_table`, and so on) and nothing else
-- changed. Every message and every error code is the one it was, a row that
-- fails two checks is told the first as before, and every number is the one
-- it was. The feedback, error-log and free-text branches are not moved: they
-- write to `new` field by field, and no rule change has touched them since
-- 20260928000000.
--
-- What is not the same: an exception raised in a part carries that part's
-- name in its CONTEXT, which the database log prints and PostgREST does not
-- send; and each insert makes a few more function calls.
--
-- Each part is SECURITY INVOKER. The trigger function is SECURITY DEFINER and
-- is the only caller, so a part runs as that function's owner, exactly as the
-- lines did when they stood in it, and needs no rights of its own. Each pins
-- `search_path = public`, the trigger function's own. Each is VOLATILE, the
-- default, and has to stay so: a statement after the advisory lock must see
-- what the transaction it waited for committed. None is executable by anon or
-- authenticated (20260929040000); `npm run check:grants` holds each to that
-- by name, and replays one row for every refusal against this definition and
-- the one in 20261011010000.
--
-- The parts first and the trigger function last, so the function never calls
-- something that is not there yet. `create or replace` keeps its grants and
-- the four triggers that run it; neither is restated, and the revoke at the
-- end is the one every restatement has carried.

create or replace function public.telemetry_check_envelope(
  p_table text,
  p_session_id text,
  p_session_code text,
  p_event_id text,
  p_bytes integer
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_session_id is null or length(p_session_id) not between 8 and 128 then
    raise exception 'invalid telemetry session id';
  end if;
  if p_session_code is not null and length(p_session_code) > 32 then
    raise exception 'invalid telemetry session code';
  end if;
  if p_event_id is not null and length(p_event_id) not between 1 and 128 then
    raise exception 'invalid telemetry event id';
  end if;
  -- An error log is truncated by the trigger function rather than refused --
  -- one that is refused is lost -- so it is measured again after that; it
  -- keeps the old 512 KB bound on what is worth reading at all.
  if p_bytes > (case when p_table = 'app_error_logs' then 524288 else 196608 end) then
    raise exception 'telemetry payload too large';
  end if;
end;
$$;

-- `p_summary` is the row's summary with a missing one read as `{}`, and
-- `p_run_id` its run id with an empty one read as null: the trigger function
-- does both before it calls this.
create or replace function public.telemetry_check_session_row(
  p_case_id text,
  p_summary jsonb,
  p_decision_log jsonb,
  p_run_id text,
  p_case_title text,
  p_resources jsonb,
  p_triggers jsonb,
  p_cognition jsonb,
  p_dynamics jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_entry jsonb;
begin
  if not public.is_season_case_id(p_case_id, true)
    or jsonb_typeof(p_summary) <> 'object'
    or jsonb_typeof(p_decision_log) <> 'array'
    or jsonb_array_length(p_decision_log) > 60 then
    raise exception 'invalid playtest session payload';
  end if;
  if (p_run_id is not null and length(p_run_id) > 128)
    or length(coalesce(p_case_title, '')) > 80
    or octet_length(p_summary::text) > 4096
    or octet_length(coalesce(p_resources, '{}'::jsonb)::text) > 1024
    or octet_length(coalesce(p_triggers, '{}'::jsonb)::text) > 1024
    or octet_length(coalesce(p_cognition, '{}'::jsonb)::text) > 1024
    or octet_length(coalesce(p_dynamics, '{}'::jsonb)::text) > 2048 then
    raise exception 'playtest session field too large';
  end if;
  for v_entry in select value from jsonb_array_elements(p_decision_log) loop
    if octet_length(v_entry::text) > 8192 then
      raise exception 'decision log entry too large';
    end if;
  end loop;
end;
$$;

-- One row per run and case. The lock serialises concurrent retries of the
-- same pair; the unique index is the backstop if anything gets past it. True
-- means the pair is stored already and the trigger function drops the row.
create or replace function public.telemetry_case_is_replay(
  p_run_id text,
  p_case_id text,
  p_writer text,
  p_session_id text
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_run_id is not null then
    perform pg_advisory_xact_lock(hashtext('run-case:' || p_run_id || ':' || p_case_id));
    if exists (
      select 1 from public.playtest_sessions s
      where s.run_id = p_run_id and s.case_id = p_case_id
    ) then
      -- Dropped, and counted: a replay costs nothing to store, but it is
      -- still a request someone can send all day.
      if not public.bump_rate_limit('tele-replay:' || coalesce(p_writer, p_session_id), interval '1 hour', 600) then
        raise exception using errcode = 'PT429', message = 'telemetry rate limit exceeded';
      end if;
      return true;
    end if;
  end if;
  return false;
end;
$$;

create or replace function public.ranking_check_request(
  p_summary jsonb,
  p_decision_log jsonb,
  p_run_id text
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if (p_summary->>'seasonComplete') not in ('true', '1') then
    raise exception 'season ranking requires a completed summary';
  end if;
  if jsonb_array_length(p_decision_log) < 1 then
    raise exception 'season ranking requires decisions';
  end if;
  if p_run_id is null then
    raise exception 'season ranking requires a run id';
  end if;
end;
$$;

-- Which runs the ranking does not take, whatever they scored. This is the
-- part a change of table restates: 20261010000000 added the first block and
-- 20261011010000 the second.
create or replace function public.ranking_check_run_marks(p_run_id text)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  -- A case closed in story mode carries `assistStory: true` in its own
  -- row's summary, and one such case keeps the whole season off the
  -- ranking. Read from the run's rows; a plain exception, since no later
  -- attempt can change what the run was.
  if exists (
    select 1 from public.playtest_sessions s
    where s.run_id = p_run_id
      and s.case_id = any(public.season_case_ids())
      and s.summary->'assistStory' = 'true'::jsonb
  ) then
    raise exception 'story-mode runs are not ranked';
  end if;
  -- A case closed at the table that paid for a press timed to the beat has
  -- no `logicStreak` in its row's `dynamics`; a case closed at this one
  -- always has, as a number. One such case keeps the whole season off the
  -- ranking, read from the run's rows like the story mark above, and a
  -- row with no `dynamics` is such a row. `is not true`, so a missing
  -- key, a missing object and a value of another type all read alike.
  if exists (
    select 1 from public.playtest_sessions s
    where s.run_id = p_run_id
      and s.case_id = any(public.season_case_ids())
      and (jsonb_typeof(s.dynamics->'logicStreak') = 'number') is not true
  ) then
    raise exception 'beat-table runs are not ranked';
  end if;
end;
$$;

-- The run has to have been played where the database could see it: every
-- case of the season, the first at least ten minutes ago, the last at
-- least fifteen minutes after the first, and the `final` case from this
-- device. Other cases may come from another device, since a cloud save
-- carries the run across. Consent turned on mid-season means no ranking
-- row for that run -- the server has no way to tell it apart.
--
-- The marks are read between the coverage check and the two timing checks,
-- where they stood: a season that is not whole is told that first, and one
-- the ranking does not take is told so the first time it asks.
create or replace function public.ranking_check_run(p_run_id text, p_session_id text)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_covered integer;
  v_first_at timestamptz;
  v_last_at timestamptz;
  v_owns_final boolean;
begin
  select count(distinct s.case_id), min(s.completed_at), max(s.completed_at),
         coalesce(bool_or(s.case_id = 'final' and s.session_id = p_session_id), false)
    into v_covered, v_first_at, v_last_at, v_owns_final
    from public.playtest_sessions s
   where s.run_id = p_run_id
     and s.case_id = any(public.season_case_ids());
  if v_covered < cardinality(public.season_case_ids()) or not v_owns_final then
    raise exception using errcode = 'PT425', message = 'season ranking requires every case of the run';
  end if;
  perform public.ranking_check_run_marks(p_run_id);
  if v_first_at > now() - interval '10 minutes' then
    raise exception using errcode = 'PT425', message = 'season ranking run is implausibly short';
  end if;
  if v_last_at - v_first_at < interval '15 minutes' then
    raise exception 'season ranking run was not played where the server could watch it';
  end if;
end;
$$;

-- What the ranking publishes is read from the run's own last case, not
-- from the request. The trigger function adds `seasonComplete` and the case
-- count to what this returns.
create or replace function public.ranking_run_summary(p_run_id text, p_session_id text)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_final_summary jsonb;
  v_score_text text;
begin
  select s.summary into v_final_summary
    from public.playtest_sessions s
   where s.run_id = p_run_id and s.case_id = 'final' and s.session_id = p_session_id
   limit 1;
  v_final_summary := public.ranking_public_summary(v_final_summary);
  v_score_text := v_final_summary->>'burstScore';
  if v_score_text is null or v_score_text !~ '^[0-9]{1,3}([.][0-9]{1,6})?$' or v_score_text::numeric > 100 then
    raise exception 'invalid season ranking score';
  end if;
  if coalesce(v_final_summary->>'rank', '') not in ('S', 'A', 'B', 'C') then
    raise exception 'invalid season ranking rank';
  end if;
  return v_final_summary;
end;
$$;

create or replace function public.ranking_charge_limits(p_session_id text, p_writer text)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_recent_finals integer;
begin
  select count(*) into v_recent_finals
    from public.playtest_sessions s
   where s.session_id = p_session_id
     and s.case_id = 'season-final'
     and s.completed_at > now() - interval '1 day';
  if v_recent_finals >= 2 then
    raise exception using errcode = 'PT429', message = 'season ranking limit reached';
  end if;
  if p_writer is not null
    and not public.bump_rate_limit('season-ip:' || p_writer, interval '1 day', 20) then
    raise exception using errcode = 'PT429', message = 'season ranking limit reached';
  end if;
end;
$$;

-- Pace, counted after the cheap refusals so they spend no budget. A season
-- is 55 case rows plus feedback, so one device gets 240 an hour; an address
-- -- a school, an office, a phone carrier's NAT -- gets 1,200 across all of
-- its devices; and everyone together gets a day's worth of bytes.
create or replace function public.telemetry_charge_pace(
  p_writer text,
  p_session_id text,
  p_bytes integer
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.bump_rate_limit('tele:' || coalesce(p_writer, '-') || '|' || p_session_id, interval '1 hour', 240) then
    raise exception using errcode = 'PT429', message = 'telemetry rate limit exceeded';
  end if;
  if p_writer is not null and not public.bump_rate_limit('tele-ip:' || p_writer, interval '1 hour', 1200) then
    raise exception using errcode = 'PT429', message = 'telemetry rate limit exceeded';
  end if;
  if not public.bump_rate_budget(
    'global:telemetry-bytes',
    interval '1 day',
    public.private_setting_int('telemetry_daily_bytes', 209715200),
    p_bytes
  ) then
    raise exception using errcode = 'PT429', message = 'telemetry daily ceiling reached';
  end if;
end;
$$;

revoke all on function public.telemetry_check_envelope(text, text, text, text, integer) from public, anon, authenticated;
revoke all on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.telemetry_case_is_replay(text, text, text, text) from public, anon, authenticated;
revoke all on function public.ranking_check_request(jsonb, jsonb, text) from public, anon, authenticated;
revoke all on function public.ranking_check_run_marks(text) from public, anon, authenticated;
revoke all on function public.ranking_check_run(text, text) from public, anon, authenticated;
revoke all on function public.ranking_run_summary(text, text) from public, anon, authenticated;
revoke all on function public.ranking_charge_limits(text, text) from public, anon, authenticated;
revoke all on function public.telemetry_charge_pace(text, text, integer) from public, anon, authenticated;
grant execute on function public.telemetry_check_envelope(text, text, text, text, integer) to service_role;
grant execute on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) to service_role;
grant execute on function public.telemetry_case_is_replay(text, text, text, text) to service_role;
grant execute on function public.ranking_check_request(jsonb, jsonb, text) to service_role;
grant execute on function public.ranking_check_run_marks(text) to service_role;
grant execute on function public.ranking_check_run(text, text) to service_role;
grant execute on function public.ranking_run_summary(text, text) to service_role;
grant execute on function public.ranking_charge_limits(text, text) to service_role;
grant execute on function public.telemetry_charge_pace(text, text, integer) to service_role;

create or replace function public.validate_telemetry_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row jsonb := to_jsonb(new);
  v_bytes integer := octet_length(to_jsonb(new)::text);
  v_session_id text := v_row->>'session_id';
  v_session_code text := v_row->>'session_code';
  v_event_id text := v_row->>'event_id';
  v_writer text := public.request_client_key();
  v_summary jsonb;
  v_final_summary jsonb;
  v_run_id text;
begin
  perform public.telemetry_check_envelope(TG_TABLE_NAME::text, v_session_id, v_session_code, v_event_id, v_bytes);

  if TG_TABLE_NAME = 'playtest_sessions' then
    new.completed_at := now();
    -- Every remote row is anonymous; the ranking never showed this column's
    -- value, and a free-text column readable by anon is a publishing channel.
    new.player_name := '익명 분석관';
    v_summary := coalesce(new.summary, '{}'::jsonb);
    v_run_id := nullif(new.run_id, '');
    new.run_id := v_run_id;

    perform public.telemetry_check_session_row(
      new.case_id, v_summary, new.decision_log, v_run_id, new.case_title,
      new.resources, new.triggers, new.cognition, new.dynamics
    );

    if public.telemetry_case_is_replay(v_run_id, new.case_id, v_writer, v_session_id) then
      return null;
    end if;

    if new.case_id = 'season-final' then
      perform public.ranking_check_request(v_summary, new.decision_log, v_run_id);
      perform public.ranking_check_run(v_run_id, v_session_id);
      v_final_summary := public.ranking_run_summary(v_run_id, v_session_id);
      perform public.ranking_charge_limits(v_session_id, v_writer);

      new.case_title := 'SEASON 01 COMPLETE';
      new.summary := v_final_summary || jsonb_build_object(
        'seasonComplete', true,
        'completedCaseCount', cardinality(public.season_case_ids())
      );
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
    v_bytes := octet_length(to_jsonb(new)::text);
  else
    -- free_text_analyses: no longer writable by anon (20260928030000), kept
    -- only so a service-role insert still gets a server timestamp.
    new := jsonb_populate_record(new, jsonb_build_object('created_at', now()));
  end if;

  perform public.telemetry_charge_pace(v_writer, v_session_id, v_bytes);

  return new;
end;
$$;

revoke execute on function public.validate_telemetry_insert() from public, anon, authenticated;

notify pgrst, 'reload schema';
