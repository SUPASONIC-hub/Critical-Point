-- Cloud saves: the ceiling on new codes a day goes from 300 to 1,000.
--
-- 20260929030000 counts new codes twice: 5 a day for one address, and 300 a
-- day for everyone (`cloud_daily_new_codes`). Past the second, a put for a
-- code the table has never seen is refused -- it fails closed, on purpose --
-- and puts for existing codes go on. The audit of 2026-10-06 did the division:
-- 300 / 5 is sixty addresses, or sixty /64s out of one routed IPv6 /56, and
-- for the rest of that day no new player can turn 온라인 저장 on.
--
-- What the number has to hold down is storage, since a code is up to 400,000
-- bytes of payload kept for 180 days: 300 a day is 120 MB a day at the very
-- worst, 1,000 is 400 MB. What it has to let through is a playtest's new
-- players, and a few hundred in a day is the size of one. 1,000 is the trade:
-- it takes two hundred addresses, each at its own limit, to shut the door on
-- everyone else, where it took sixty; and the worst day is still a day the
-- owner can see coming, because the same counter is in
-- `telemetry_rate_limits` under `global:cloud-new`. The per-address 5 is
-- unchanged, and so is failing closed. There is no alert at half the ceiling:
-- nothing in this project can send one.
--
-- The owner can still move it without a migration:
--   insert into public.private_settings (name, value) values ('cloud_daily_new_codes', '2000')
--   on conflict (name) do update set value = excluded.value;
--
-- The default is a literal inside `put_cloud_save`, 170 lines of a function
-- whose every other line is a check somebody measured. So the function is not
-- restated here with one number changed -- a copy is where a second, unmeant
-- difference hides. Its stored definition is read back, the one literal is
-- replaced, and the result is created in its place; `create or replace` keeps
-- the function's grants. If the literal is not there to replace, the
-- migration stops instead of reporting a change it did not make.

do $$
declare
  v_old constant text := $q$private_setting_int('cloud_daily_new_codes', 300)$q$;
  v_new constant text := $q$private_setting_int('cloud_daily_new_codes', 1000)$q$;
  v_definition text;
begin
  select pg_get_functiondef('public.put_cloud_save(text, timestamptz, jsonb, bigint)'::regprocedure)
    into v_definition;
  if position(v_new in v_definition) > 0 then
    -- Already applied: a replay ends in the same place.
    return;
  end if;
  if position(v_old in v_definition) = 0 then
    raise exception 'put_cloud_save no longer reads cloud_daily_new_codes with a default of 300; this migration has nothing to change';
  end if;
  execute replace(v_definition, v_old, v_new);
end;
$$;

notify pgrst, 'reload schema';
