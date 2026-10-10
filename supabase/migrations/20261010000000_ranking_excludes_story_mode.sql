-- Story mode (2026-10-09) deals a run's wall at 88 to 98, so a season with a
-- story case banks several times what the table pays anyone else, and the
-- public ranking compares seasons played on one table. A case closed in story
-- mode says so in its own row: `assistStory: true` at the top of its summary.
-- A season with even one such case is not ranked.
--
-- The client already sends no `season-final` row for such a season
-- (useChoiceCommit). This is the same rule held on the server, for a client
-- that sends one anyway: the mark is read from the case rows the run already
-- left here, not from the request, which can say anything.
--
-- A plain exception, so PostgREST answers 400 like the other refusals of the
-- row itself and the client's queue lets the row go; PT425 would mean "send it
-- again later", and later changes nothing for this run. It stands after the
-- coverage check and before the two timing checks, so a story season is told
-- so the first time it asks and not after ten minutes of "not yet".
--
-- The function is the one in 20260929010000 with that one block added to the
-- `season-final` branch. Nothing else changes: no column, constraint, table or
-- policy, and no stored row is touched.

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
  v_score_text text;
  v_run_id text;
  v_entry jsonb;
  v_covered integer;
  v_first_at timestamptz;
  v_last_at timestamptz;
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
  -- An error log is truncated below rather than refused -- one that is refused
  -- is lost -- so it is measured again after that; it keeps the old 512 KB
  -- bound on what is worth reading at all.
  if v_bytes > (case when TG_TABLE_NAME = 'app_error_logs' then 524288 else 196608 end) then
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
      or jsonb_array_length(new.decision_log) > 60 then
      raise exception 'invalid playtest session payload';
    end if;
    if (v_run_id is not null and length(v_run_id) > 128)
      or length(coalesce(new.case_title, '')) > 80
      or octet_length(v_summary::text) > 4096
      or octet_length(coalesce(new.resources, '{}'::jsonb)::text) > 1024
      or octet_length(coalesce(new.triggers, '{}'::jsonb)::text) > 1024
      or octet_length(coalesce(new.cognition, '{}'::jsonb)::text) > 1024
      or octet_length(coalesce(new.dynamics, '{}'::jsonb)::text) > 2048 then
      raise exception 'playtest session field too large';
    end if;
    for v_entry in select value from jsonb_array_elements(new.decision_log) loop
      if octet_length(v_entry::text) > 8192 then
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
        -- Dropped, and counted: a replay costs nothing to store, but it is
        -- still a request someone can send all day.
        if not public.bump_rate_limit('tele-replay:' || coalesce(v_writer, v_session_id), interval '1 hour', 600) then
          raise exception using errcode = 'PT429', message = 'telemetry rate limit exceeded';
        end if;
        return null;
      end if;
    end if;

    if new.case_id = 'season-final' then
      if (v_summary->>'seasonComplete') not in ('true', '1') then
        raise exception 'season ranking requires a completed summary';
      end if;
      if jsonb_array_length(new.decision_log) < 1 then
        raise exception 'season ranking requires decisions';
      end if;
      if v_run_id is null then
        raise exception 'season ranking requires a run id';
      end if;
      -- The run has to have been played where the database could see it: every
      -- case of the season, the first at least ten minutes ago, the last at
      -- least fifteen minutes after the first, and the `final` case from this
      -- device. Other cases may come from another device, since a cloud save
      -- carries the run across. Consent turned on mid-season means no ranking
      -- row for that run -- the server has no way to tell it apart.
      select count(distinct s.case_id), min(s.completed_at), max(s.completed_at),
             coalesce(bool_or(s.case_id = 'final' and s.session_id = v_session_id), false)
        into v_covered, v_first_at, v_last_at, v_owns_final
        from public.playtest_sessions s
       where s.run_id = v_run_id
         and s.case_id = any(public.season_case_ids());
      if v_covered < cardinality(public.season_case_ids()) or not v_owns_final then
        raise exception using errcode = 'PT425', message = 'season ranking requires every case of the run';
      end if;
      -- A case closed in story mode carries `assistStory: true` in its own
      -- row's summary, and one such case keeps the whole season off the
      -- ranking. Read from the run's rows, as above; a plain exception, since
      -- no later attempt can change what the run was.
      if exists (
        select 1 from public.playtest_sessions s
        where s.run_id = v_run_id
          and s.case_id = any(public.season_case_ids())
          and s.summary->'assistStory' = 'true'::jsonb
      ) then
        raise exception 'story-mode runs are not ranked';
      end if;
      if v_first_at > now() - interval '10 minutes' then
        raise exception using errcode = 'PT425', message = 'season ranking run is implausibly short';
      end if;
      if v_last_at - v_first_at < interval '15 minutes' then
        raise exception 'season ranking run was not played where the server could watch it';
      end if;

      -- What the ranking publishes is read from the run's own last case, not
      -- from this request.
      select s.summary into v_final_summary
        from public.playtest_sessions s
       where s.run_id = v_run_id and s.case_id = 'final' and s.session_id = v_session_id
       limit 1;
      v_final_summary := public.ranking_public_summary(v_final_summary);
      v_score_text := v_final_summary->>'burstScore';
      if v_score_text is null or v_score_text !~ '^[0-9]{1,3}([.][0-9]{1,6})?$' or v_score_text::numeric > 100 then
        raise exception 'invalid season ranking score';
      end if;
      if coalesce(v_final_summary->>'rank', '') not in ('S', 'A', 'B', 'C') then
        raise exception 'invalid season ranking rank';
      end if;

      select count(*) into v_recent_finals
        from public.playtest_sessions s
       where s.session_id = v_session_id
         and s.case_id = 'season-final'
         and s.completed_at > now() - interval '1 day';
      if v_recent_finals >= 2 then
        raise exception using errcode = 'PT429', message = 'season ranking limit reached';
      end if;
      if v_writer is not null
        and not public.bump_rate_limit('season-ip:' || v_writer, interval '1 day', 20) then
        raise exception using errcode = 'PT429', message = 'season ranking limit reached';
      end if;

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

  -- Pace, counted after the cheap refusals so they spend no budget. A season
  -- is 55 case rows plus feedback, so one device gets 240 an hour; an address
  -- -- a school, an office, a phone carrier's NAT -- gets 1,200 across all of
  -- its devices; and everyone together gets a day's worth of bytes.
  if not public.bump_rate_limit('tele:' || coalesce(v_writer, '-') || '|' || v_session_id, interval '1 hour', 240) then
    raise exception using errcode = 'PT429', message = 'telemetry rate limit exceeded';
  end if;
  if v_writer is not null and not public.bump_rate_limit('tele-ip:' || v_writer, interval '1 hour', 1200) then
    raise exception using errcode = 'PT429', message = 'telemetry rate limit exceeded';
  end if;
  if not public.bump_rate_budget(
    'global:telemetry-bytes',
    interval '1 day',
    public.private_setting_int('telemetry_daily_bytes', 209715200),
    v_bytes
  ) then
    raise exception using errcode = 'PT429', message = 'telemetry daily ceiling reached';
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_telemetry_insert() from public, anon, authenticated;

notify pgrst, 'reload schema';
