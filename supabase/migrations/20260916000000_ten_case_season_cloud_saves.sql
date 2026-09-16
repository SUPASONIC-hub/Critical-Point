-- Three things, all driven by the season as it now ships.
--
-- 1. The season is ten cases. Every case id list in this schema was written
--    when it had five: the insert policies, and the trigger that validates
--    telemetry. A run that reached 사건 06 had every case, feedback and error row
--    after it refused by the database, silently, because the browser queue only
--    retries. The lists are replaced by one predicate that accepts any
--    `caseNN` id, so the next case needs no migration.
--
-- 2. Cloud saves. A save is written to the device first and uploaded when the
--    browser is online, under a continuation code the player can type on
--    another device. The table is never readable by anon: two security-definer
--    functions put and get one row by the code, and the row is keyed by the
--    code's SHA-256, so the table alone does not hand out codes. A put carries
--    the save's own `savedAt` and is refused when the stored copy is newer, so a
--    device that was offline cannot overwrite play made elsewhere since.
--
-- 3. The ranking starts over. The four completed-season rows were played on
--    the five-case season and ranked against a length no run can now have.
--    Only `season-final` rows are ranking rows; per-case telemetry stays.

create or replace function public.is_season_case_id(p_case_id text, p_allow_season boolean)
returns boolean
language sql
immutable
as $$
  select p_case_id ~ '^case[0-9]{2}$'
    or p_case_id = 'final'
    or (p_allow_season and p_case_id = 'season-final');
$$;

CREATE OR REPLACE FUNCTION public.validate_telemetry_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    if not public.is_season_case_id(case_id_value, true)
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
    if payload->>'case_id' is not null and not public.is_season_case_id(payload->>'case_id', false) then
      raise exception 'invalid feedback case';
    end if;
  elsif TG_TABLE_NAME = 'app_error_logs' then
    if payload->>'current_case' is not null and payload->>'current_case' <> 'unknown' and not public.is_season_case_id(payload->>'current_case', false) then
      raise exception 'invalid error log case';
    end if;
  end if;

  return new;
end;
$function$;

drop policy if exists "public can insert playtest sessions" on public.playtest_sessions;
create policy "public can insert playtest sessions" on public.playtest_sessions
for insert to anon
with check (
  length(session_id) between 8 and 128
  and public.is_season_case_id(case_id, true)
  and jsonb_typeof(summary) = 'object'
);

drop policy if exists "public can insert playtest feedback" on public.playtest_feedback;
create policy "public can insert playtest feedback" on public.playtest_feedback
for insert to anon
with check (
  length(session_id) between 8 and 128
  and (case_id is null or public.is_season_case_id(case_id, false))
);

drop policy if exists "public can insert app error logs" on public.app_error_logs;
create policy "public can insert app error logs" on public.app_error_logs
for insert to anon
with check (
  (session_id is null or length(session_id) between 8 and 128)
  and (current_case is null or current_case = 'unknown' or public.is_season_case_id(current_case, false))
);

-- ------------------------------------------------------------ cloud saves
create table if not exists public.cloud_saves (
  code_hash text primary key,
  saved_at timestamptz not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.cloud_saves enable row level security;
revoke all on public.cloud_saves from anon, authenticated;

create or replace function public.put_cloud_save(p_code text, p_saved_at timestamptz, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_existing timestamptz;
begin
  if p_code is null or p_code !~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{12}$' then
    raise exception 'invalid cloud save code';
  end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' or octet_length(p_payload::text) > 1500000 then
    raise exception 'invalid cloud save payload';
  end if;
  if p_saved_at is null or p_saved_at > now() + interval '1 day' then
    raise exception 'invalid cloud save time';
  end if;
  v_hash := encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
  select saved_at into v_existing from public.cloud_saves where code_hash = v_hash for update;
  if v_existing is not null and v_existing > p_saved_at then
    return jsonb_build_object('accepted', false, 'saved_at', v_existing);
  end if;
  insert into public.cloud_saves (code_hash, saved_at, payload, updated_at)
  values (v_hash, p_saved_at, p_payload, now())
  on conflict (code_hash) do update
  set saved_at = excluded.saved_at, payload = excluded.payload, updated_at = now();
  return jsonb_build_object('accepted', true, 'saved_at', p_saved_at);
end;
$$;

create or replace function public.get_cloud_save(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.cloud_saves%rowtype;
begin
  if p_code is null or p_code !~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{12}$' then
    raise exception 'invalid cloud save code';
  end if;
  select * into v_row from public.cloud_saves
  where code_hash = encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
  if not found then
    return null;
  end if;
  return jsonb_build_object('saved_at', v_row.saved_at, 'payload', v_row.payload);
end;
$$;

revoke execute on function public.put_cloud_save(text, timestamptz, jsonb) from public;
revoke execute on function public.get_cloud_save(text) from public;
grant execute on function public.put_cloud_save(text, timestamptz, jsonb) to anon, authenticated;
grant execute on function public.get_cloud_save(text) to anon, authenticated;

-- ------------------------------------------------------------ ranking reset
delete from public.playtest_sessions where case_id = 'season-final';

notify pgrst, 'reload schema';
