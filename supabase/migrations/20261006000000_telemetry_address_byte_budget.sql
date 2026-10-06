-- Telemetry: one address gets a day's bytes of its own, smaller than
-- everyone's.
--
-- What the audit of 2026-10-06 found in 20260929010000. The limits there are
-- right one at a time and wrong multiplied together:
--
--   192 KB a row  x  1,200 rows an hour for one address  =  236 MB an hour
--   the ceiling for everyone, for a day                  =  210 MB
--
-- So one address, sending rows as large as the cap lets a row be, spends the
-- whole day's ceiling in under an hour. The ceiling fails closed, which is
-- what it is for; the consequence is that every other player's case rows and
-- ranking rows are refused with PT429 until the window turns over, and the
-- same script can do it again the next day. Rows with a null `run_id` skip
-- the dedupe, and the 240-an-hour device limit keys on a `session_id` the
-- client chooses, so five session ids are all it takes. The ceiling protects
-- the disk; nothing protected the players from one writer.
--
-- This adds the missing rung: the bytes one address may write in a day, 32 MB
-- unless `private_settings` says otherwise (`telemetry_address_daily_bytes`).
--
-- Why 32 MB. Measured on 2026-09-28 a case row's log is at most 90 KB and its
-- summary 1.6 KB, and a season is 55 of them: about 5 MB for a season played
-- to the end, 10.6 MB if every row sat at the 192 KB cap. 32 MB is six
-- measured seasons a day from one address -- a household, or a classroom
-- behind one NAT that does not all finish a season in one day -- and three at
-- the cap. It takes seven addresses, each at its limit, to reach the ceiling
-- for everyone, where it took one. A refusal is PT429, so the client's queue
-- keeps the row and sends it again; a classroom that does run out loses
-- nothing, it delivers the rest the next day.
--
-- It is a trigger of its own, not another paragraph in
-- `validate_telemetry_insert`: that function is 210 lines the ranking depends
-- on, and restating all of it to add six would be the riskier change. The
-- name sorts after the `validate_*` triggers, and Postgres fires a table's
-- BEFORE triggers in name order, so this sees the row as the validator left
-- it -- sized, truncated, timestamped -- and is never reached by a row the
-- validator refused or dropped as a replay. The order the two budgets are
-- charged in does not matter for the counters: a refusal raises, the insert
-- rolls back, and every increment it made rolls back with it, the global one
-- included. An address at its limit does not eat into anyone else's day.
--
-- Keyed by `request_client_key()` (20260929000000): hashed, one key per IPv6
-- /64. A request with no address is not charged here, as in every other
-- per-address limit; the device limit and the global ceiling still hold it.

create or replace function public.charge_telemetry_address_bytes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_writer text := public.request_client_key();
begin
  if v_writer is null then
    return new;
  end if;
  if not public.bump_rate_budget(
    'tele-bytes-ip:' || v_writer,
    interval '1 day',
    public.private_setting_int('telemetry_address_daily_bytes', 33554432),
    octet_length(to_jsonb(new)::text)
  ) then
    raise exception using errcode = 'PT429', message = 'telemetry address daily budget reached';
  end if;
  return new;
end;
$$;

revoke all on function public.charge_telemetry_address_bytes() from public, anon, authenticated;
grant execute on function public.charge_telemetry_address_bytes() to service_role;

-- The three tables anon writes. `free_text_analyses` is service_role only
-- (20260928030000) and has no address to charge.
drop trigger if exists zz_charge_address_bytes on public.playtest_sessions;
create trigger zz_charge_address_bytes
before insert on public.playtest_sessions
for each row execute function public.charge_telemetry_address_bytes();

drop trigger if exists zz_charge_address_bytes on public.playtest_feedback;
create trigger zz_charge_address_bytes
before insert on public.playtest_feedback
for each row execute function public.charge_telemetry_address_bytes();

drop trigger if exists zz_charge_address_bytes on public.app_error_logs;
create trigger zz_charge_address_bytes
before insert on public.app_error_logs
for each row execute function public.charge_telemetry_address_bytes();

notify pgrst, 'reload schema';
