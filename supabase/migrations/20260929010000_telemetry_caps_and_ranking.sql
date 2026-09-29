-- Telemetry: caps the size a row is, answers "later" with a status that means
-- later, and stops the ranking publishing whatever a client wrote.
--
-- What the audit found in 20260928000000, in the order it is fixed below:
--
-- 1. The size caps were about twenty times a real row. Measured on 2026-09-28
--    with the runtime's own builders over all 4,206 choices of the season: a
--    decision entry is 3.0 KB on average and 3.3 KB at most, a case plays at
--    most 30 scenes (90 KB of log), a case summary is 1.6 KB, the run's
--    `dynamics` 0.3 KB, `triggers` 0.3 KB. The caps were 16 KB an entry, 100
--    entries, 64 KB a summary and 512 KB a row, and the hourly budgets multiply
--    against them: 1,200 rows of 0.5 MB is 600 MB an hour from one address.
--    Each cap is now roughly twice what was measured: 8 KB an entry, 60
--    entries, 4 KB a summary, 1 KB for each score object, 2 KB of dynamics,
--    192 KB a row. One address's hour is bounded by 1,200 x 192 KB either way,
--    so there is also a ceiling that does not multiply by addresses: the bytes
--    of telemetry accepted in a day, 200 MB unless `private_settings` says
--    otherwise (`telemetry_daily_bytes`). It fails closed.
--
-- 2. Every refusal was a plain `raise exception`, which PostgREST answers 400,
--    and the client's queue treats a 400 as "the server will never take this
--    row". So a row refused for pace, or a ranking row that arrived a moment
--    before the run's last case row, was deleted rather than retried. A
--    refusal that time cures is now raised with a `PT` SQLSTATE, which
--    PostgREST turns into that HTTP status: PT429 for pace, PT425 for "not
--    yet". A refusal that nothing cures stays a 400.
--
-- 3. `player_name` was forced to a constant because a free-text column anon can
--    read is a publishing channel -- and `case_title` and `summary`, which anon
--    reads on the same row, were left as sent. A ranking row's title is now a
--    constant, and its public summary is built here, from typed and
--    whitelisted keys of the summary the run's own `final` case row carries.
--    That row is the one the score was computed for, it is already stored, and
--    the season summary the client sends is the same object with two flags
--    added. The `score` column is therefore derived from a number the client
--    reported when it closed the last case -- it is server-*ordered* and
--    server-*typed*, not server-computed; this is still a playtest ranking.
--
-- 4. The ten-minute rule read only the oldest case row, so fifty-five rows
--    written in one burst and then a wait passed it. The run's first and last
--    case rows must now be at least fifteen minutes apart as well (an
--    automated walk that reads nothing takes about twenty-four). A run whose
--    rows all arrived together -- a season played offline and flushed at once
--    -- can never satisfy that, so it is a permanent refusal, not a "not yet".
--
-- 5. The two-a-day limit keyed on `session_id`, which the client chooses. It
--    stays, and an address now has twenty ranking rows a day between all of
--    its devices.
--
-- 6. A replayed case row (same run and case) returned before anything was
--    counted, so it was free to send forever. Replays are counted on their own
--    key, generously, and refused past it.
--
-- 7. The writer is keyed by `request_client_key()` (20260929000000): hashed,
--    and one key per IPv6 /64.

-- The part of a case summary the ranking publishes. Every key is typed; a key
-- of the wrong type is left out rather than copied.
create or replace function public.ranking_public_summary(p_summary jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_out jsonb := '{}'::jsonb;
  v_key text;
  v_pair jsonb;
begin
  if p_summary is null or jsonb_typeof(p_summary) <> 'object' then
    return v_out;
  end if;
  foreach v_key in array array[
    'schemaVersion', 'burstScore', 'momentumScore', 'rhythmScore', 'cognitionScore', 'pressureAdaptScore',
    'reflectionScore', 'consistencyScore', 'exploitPenalty', 'averageResponseTime', 'reframeCount',
    'challengeClearCount', 'reducedRiskCount'
  ] loop
    -- Nested, not `and`: SQL does not promise to test the type before the cast.
    if jsonb_typeof(p_summary->v_key) = 'number' then
      if (p_summary->>v_key)::numeric between 0 and 1000000 then
        v_out := v_out || jsonb_build_object(v_key, trim_scale(round((p_summary->>v_key)::numeric, 3)));
      end if;
    end if;
  end loop;
  if p_summary->>'rank' in ('S', 'A', 'B', 'C') then
    v_out := v_out || jsonb_build_object('rank', p_summary->>'rank');
  end if;
  if jsonb_typeof(p_summary->'momentumTier') = 'string' and p_summary->>'momentumTier' ~ '^[A-Z][A-Z ]{0,23}$' then
    v_out := v_out || jsonb_build_object('momentumTier', p_summary->>'momentumTier');
  end if;
  if jsonb_typeof(p_summary->'endingVariant') = 'string' and p_summary->>'endingVariant' ~ '^[a-z][a-z0-9-]{0,39}$' then
    v_out := v_out || jsonb_build_object('endingVariant', p_summary->>'endingVariant');
  end if;
  -- ["responsibility", 120]: a score family and how much of it the run showed.
  foreach v_key in array array['primary', 'secondary', 'thinking'] loop
    v_pair := p_summary->v_key;
    if jsonb_typeof(v_pair) = 'array' then
      if jsonb_array_length(v_pair) = 2
        and jsonb_typeof(v_pair->0) = 'string'
        and jsonb_typeof(v_pair->1) = 'number' then
        if (v_pair->>0) ~ '^[A-Za-z]{1,32}$' and (v_pair->>1)::numeric between 0 and 1000000 then
          v_out := v_out || jsonb_build_object(
            v_key,
            jsonb_build_array(v_pair->>0, trim_scale(round((v_pair->>1)::numeric, 3)))
          );
        end if;
      end if;
    end if;
  end loop;
  return v_out;
end;
$$;

revoke all on function public.ranking_public_summary(jsonb) from public, anon, authenticated;
grant execute on function public.ranking_public_summary(jsonb) to service_role;

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

-- Ranking rows stored before the summary was built here carry whatever the
-- client sent. They are rewritten through the same whitelist, so the public
-- column holds typed keys only, whenever the row was written.
update public.playtest_sessions s
set case_title = 'SEASON 01 COMPLETE',
    summary = public.ranking_public_summary(s.summary) || jsonb_build_object(
      'seasonComplete', true,
      'completedCaseCount', cardinality(public.season_case_ids())
    )
where s.case_id = 'season-final';

notify pgrst, 'reload schema';
