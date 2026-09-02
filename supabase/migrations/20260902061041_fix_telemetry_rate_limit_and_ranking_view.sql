-- Fix two errors observed in the Supabase logs on 2026-09-02.
--
-- 42702 column reference "actor_key" is ambiguous
--   validate_telemetry_insert() declared PL/pgSQL variables named actor_key,
--   request_count and window_started_at, which are also the column names of
--   public.telemetry_rate_limits. PL/pgSQL could not resolve the ON CONFLICT
--   target or the RETURNING list, so the BEFORE INSERT trigger aborted every
--   telemetry write on all three tables. The variables now carry a v_ prefix.
--   window_started_at was only ever assigned, never read, so it is dropped and
--   RETURNING yields just the request count.
--
-- 42501 permission denied for table playtest_sessions
--   public_rankings was declared with security_invoker = true while SELECT on
--   playtest_sessions is revoked from anon, so resolving the view failed for
--   anonymous readers and the ranking screen could not load. The view is itself
--   the security boundary -- its WHERE clause restricts output to completed
--   season rows and its select list omits decision_log -- so it must run with
--   its owner's privileges. Raw session rows stay unreadable for anon.

create or replace function public.validate_telemetry_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  headers_text text;
  headers jsonb := '{}'::jsonb;
  v_actor_key text;
  v_request_count integer;
  payload jsonb := to_jsonb(new);
  session_id_value text := payload->>'session_id';
  case_id_value text := payload->>'case_id';
  summary_value jsonb := coalesce(payload->'summary', '{}'::jsonb);
  score_text text := summary_value->>'burstScore';
begin
  if session_id_value is null or length(session_id_value) not between 8 and 128 then
    raise exception 'invalid telemetry session id';
  end if;

  -- Retries from a browser queue must not create a second record for one run/case.
  if TG_TABLE_NAME = 'playtest_sessions'
    and nullif(payload->>'run_id', '') is not null
    and exists (
      select 1 from public.playtest_sessions
      where run_id = payload->>'run_id'
        and case_id = payload->>'case_id'
    ) then
    return null;
  end if;

  headers_text := current_setting('request.headers', true);
  begin
    if headers_text is not null and headers_text <> '' then
      headers := headers_text::jsonb;
    end if;
  exception when others then
    headers := '{}'::jsonb;
  end;
  v_actor_key := left(coalesce(nullif(headers->>'x-forwarded-for', ''), session_id_value), 200);

  insert into public.telemetry_rate_limits (actor_key, window_started_at, request_count)
  values (v_actor_key, now(), 1)
  on conflict (actor_key) do update
  set request_count = case
    when now() - telemetry_rate_limits.window_started_at >= interval '1 hour' then 1
    else telemetry_rate_limits.request_count + 1
  end,
  window_started_at = case
    when now() - telemetry_rate_limits.window_started_at >= interval '1 hour' then now()
    else telemetry_rate_limits.window_started_at
  end
  returning request_count into v_request_count;

  if v_request_count > 120 then
    raise exception 'telemetry rate limit exceeded';
  end if;

  if TG_TABLE_NAME = 'playtest_sessions' then
    if case_id_value not in ('case01', 'case02', 'case03', 'case04', 'case05', 'final', 'season-final')
      or jsonb_typeof(summary_value) <> 'object'
      or jsonb_typeof(payload->'decision_log') <> 'array'
      or jsonb_array_length(payload->'decision_log') > 100 then
      raise exception 'invalid playtest session payload';
    end if;
    if case_id_value = 'season-final'
      and (summary_value->>'seasonComplete') <> 'true'
      and (summary_value->>'seasonComplete') <> '1' then
      raise exception 'season ranking requires a completed summary';
    end if;
    if case_id_value = 'season-final'
      and (score_text is null or score_text !~ '^[0-9]+([.][0-9]+)?$' or score_text::numeric not between 0 and 100) then
      raise exception 'invalid season ranking score';
    end if;
    if case_id_value = 'season-final'
      and summary_value->>'rank' not in ('S', 'A', 'B', 'C') then
      raise exception 'invalid season ranking rank';
    end if;
    if case_id_value = 'season-final'
      and (summary_value->>'averageResponseTime' is not null)
      and (summary_value->>'averageResponseTime') !~ '^[0-9]+([.][0-9]+)?$' then
      raise exception 'invalid season response time';
    end if;
    if case_id_value = 'season-final'
      and jsonb_array_length(payload->'decision_log') < 1 then
      raise exception 'season ranking requires decisions';
    end if;
  elsif TG_TABLE_NAME = 'playtest_feedback' then
    if payload->>'case_id' is not null and payload->>'case_id' not in ('case01', 'case02', 'case03', 'case04', 'case05', 'final') then
      raise exception 'invalid feedback case';
    end if;
  elsif TG_TABLE_NAME = 'app_error_logs' then
    if payload->>'current_case' is not null and payload->>'current_case' not in ('unknown', 'case01', 'case02', 'case03', 'case04', 'case05', 'final') then
      raise exception 'invalid error log case';
    end if;
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_telemetry_insert() from public, anon, authenticated;

alter view public.public_rankings set (security_invoker = false);
