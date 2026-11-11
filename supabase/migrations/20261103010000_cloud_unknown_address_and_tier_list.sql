-- Three small fixes from the security review of 2026-11-03.
--
-- 1. A cloud-save request whose client address the gateway did not pass on
--    (L3). `request_client_key()` is null then, and the four cloud functions
--    read `v_writer is not null and not bump_rate_limit(...)`: with no address
--    the per-address limits (reads 120 an hour, puts 600, deletes 30, new codes
--    5 a day) were skipped, and only the per-code and the everyone limits held.
--    Behind Supabase's gateway an address always comes, but nothing held the
--    app to that. Every request without one now shares one key, `unknown`, and
--    meets the same limits as one address: it fails closed. The key cannot be
--    an address's, since `request_client_key()` is a keyed hash
--    (20260929000000).
--
-- 2. New cloud-save codes for everyone in a day (M3): 1,000 -> 3,000, the
--    default of `cloud_daily_new_codes`. The limit fails closed, so one actor
--    with many addresses who used it up would turn new codes off for every
--    player that day. An address starts five a day, so the everyone limit only
--    has to stop what many addresses do together; 3,000 is three times the old
--    default and a day of new devices the launch has not yet had. The owner can
--    still set any value in `private_settings` without a migration (README
--    section 6). How close a day comes is now read twice a day
--    (scripts/report-budgets.mjs, the Funnel and Board Reports workflows) and
--    the run fails at 80%.
--
-- 3. The public summary of a ranking row (L5): `momentumTier` was any upper-
--    case text of up to 24 characters, so a ranking row could carry an English
--    phrase of the writer's choosing. It is now one of the four tiers the game
--    gives (src/gameLogic.js getGameplayStats): BURST, FLOW, READY, BUILDING.
--    Anything else is left out of the summary, as a malformed value was before.
--    Rows already stored keep the summary they were stored with.
--
-- None of the functions is restated here, for the reason 20261006010000 gives:
-- each stored definition is read back, one expression is replaced, and the
-- result is created in its place. If the expression is not there to replace,
-- the migration stops; a replay that finds the new expression changes nothing.

do $$
declare
  v_old constant text := $q$v_writer text := public.request_client_key();$q$;
  v_new constant text := $q$v_writer text := coalesce(public.request_client_key(), 'unknown');$q$;
  v_function text;
  v_definition text;
begin
  foreach v_function in array array[
    'public.put_cloud_save(text, timestamptz, jsonb, bigint)',
    'public.get_cloud_save(text)',
    'public.peek_cloud_save(text)',
    'public.delete_cloud_save(text)'
  ] loop
    select pg_get_functiondef(v_function::regprocedure) into v_definition;
    if position(v_new in v_definition) > 0 then
      continue;
    end if;
    if position(v_old in v_definition) = 0 then
      raise exception '% no longer takes its writer from request_client_key(); this migration has nothing to change', v_function;
    end if;
    execute replace(v_definition, v_old, v_new);
  end loop;
end;
$$;

do $$
declare
  v_old constant text := $q$least(public.private_setting_int('cloud_daily_new_codes', 1000), 2147483647)::integer$q$;
  v_new constant text := $q$least(public.private_setting_int('cloud_daily_new_codes', 3000), 2147483647)::integer$q$;
  v_definition text;
begin
  select pg_get_functiondef('public.put_cloud_save(text, timestamptz, jsonb, bigint)'::regprocedure)
    into v_definition;
  if position(v_new in v_definition) > 0 then
    return;
  end if;
  if position(v_old in v_definition) = 0 then
    raise exception 'put_cloud_save no longer reads cloud_daily_new_codes with a default of 1000; this migration has nothing to change';
  end if;
  execute replace(v_definition, v_old, v_new);
end;
$$;

do $$
declare
  v_old constant text := $q$p_summary->>'momentumTier' ~ '^[A-Z][A-Z ]{0,23}$'$q$;
  v_new constant text := $q$p_summary->>'momentumTier' in ('BURST', 'FLOW', 'READY', 'BUILDING')$q$;
  v_definition text;
begin
  select pg_get_functiondef('public.ranking_public_summary(jsonb)'::regprocedure)
    into v_definition;
  if position(v_new in v_definition) > 0 then
    return;
  end if;
  if position(v_old in v_definition) = 0 then
    raise exception 'ranking_public_summary no longer reads momentumTier with the upper-case pattern; this migration has nothing to change';
  end if;
  execute replace(v_definition, v_old, v_new);
end;
$$;

notify pgrst, 'reload schema';
