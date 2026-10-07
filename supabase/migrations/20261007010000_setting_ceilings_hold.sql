-- Two limits the owner can set in `private_settings` stopped working past a
-- size nobody had written down. README section 6 says these values can be
-- changed without a migration, so a large one should mean "a large limit",
-- not "no limit" in one place and "every request fails" in the other. Found
-- by reading, in the audit of 2026-10-07; neither default is near either edge.
--
-- 1. `bump_rate_budget` keeps its count in an integer column and stops adding
--    at 2,000,000,000 so the column cannot overflow. It then answered
--    `count <= limit`, which is always true for a limit above that: with
--    `telemetry_daily_bytes` or `telemetry_address_daily_bytes` set past two
--    billion the ceiling could never be reached, and the one rule here that
--    fails closed did not. A count that has reached the stop is now over any
--    limit. Nothing changes for a limit below two billion, which is every
--    limit in use: the defaults are 209,715,200 and 33,554,432.
--
-- 2. `put_cloud_save` casts `cloud_daily_new_codes` to integer, and
--    `private_setting_int` reads up to eighteen digits. A value of 2^31 or
--    more raised 22003 on every put for a new code -- the owner raising the
--    limit as far as it goes turned new codes off. The value is now held to
--    the largest integer before the cast.
--
-- The second is a change inside `put_cloud_save`, which is not restated here
-- for the reason 20261006010000 gives: its stored definition is read back, the
-- one expression is replaced, and the result is created in its place. If the
-- expression is not there to replace, the migration stops.

create or replace function public.bump_rate_budget(p_key text, p_window interval, p_limit bigint, p_amount integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_amount integer := greatest(coalesce(p_amount, 1), 0);
begin
  insert into public.telemetry_rate_limits as t (actor_key, window_started_at, request_count)
  values (left(p_key, 200), now(), v_amount)
  on conflict (actor_key) do update
  set request_count = case
        when now() - t.window_started_at >= p_window then v_amount
        -- An integer column: stop short of overflowing it.
        else least(t.request_count::bigint + v_amount, 2000000000)::integer
      end,
      window_started_at = case
        when now() - t.window_started_at >= p_window then now()
        else t.window_started_at
      end
  returning t.request_count into v_count;
  -- At the stop the count no longer says how much was written, only that it
  -- was at least this much. That is over the limit, whatever the limit.
  return v_count <= p_limit and v_count < 2000000000;
end;
$$;

do $$
declare
  v_old constant text := $q$public.private_setting_int('cloud_daily_new_codes', 1000)::integer$q$;
  v_new constant text := $q$least(public.private_setting_int('cloud_daily_new_codes', 1000), 2147483647)::integer$q$;
  v_definition text;
begin
  select pg_get_functiondef('public.put_cloud_save(text, timestamptz, jsonb, bigint)'::regprocedure)
    into v_definition;
  if position(v_new in v_definition) > 0 then
    -- Already applied: a replay ends in the same place.
    return;
  end if;
  if position(v_old in v_definition) = 0 then
    raise exception 'put_cloud_save no longer casts cloud_daily_new_codes (default 1000) to integer; this migration has nothing to change';
  end if;
  execute replace(v_definition, v_old, v_new);
end;
$$;

notify pgrst, 'reload schema';
