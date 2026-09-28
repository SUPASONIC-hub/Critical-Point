-- Stop keeping addresses, and stop treating one IPv6 customer as 2^64 strangers.
--
-- What the audit found in 20260928000000 and 20260928010000:
--
-- 1. Every pace key was the raw address, and `board_posts.actor_key` kept it
--    beside a nickname for the whole 180-day retention. Nothing the limits do
--    needs the address itself -- only "is this the same writer as before" -- so
--    the key is now a keyed hash: SHA-256 over a salt this database alone holds
--    (`private_settings`, service_role only, created below with a random
--    value) and the address. The salt never leaves the database, so a dump of
--    the keys is not a list of addresses, and the hash of one deployment says
--    nothing about another's.
--
-- 2. The key was the full address. An ordinary IPv6 connection owns a /64, and
--    privacy extensions rotate the host half for honest people too, so every
--    per-address rule -- the board's three posts per thirty seconds, its
--    duplicate check, telemetry's hourly ceiling, the cloud budgets -- reset on
--    demand for anyone with IPv6 and drifted for everyone else. An IPv6 address
--    is reduced to its /64 before it is keyed, and an IPv4-mapped one
--    (`::ffff:203.0.113.9`, either spelling) is keyed as the IPv4 address it is.
--
-- 3. There was no ceiling that did not multiply by the number of addresses.
--    `bump_rate_budget` counts an amount rather than a request, which is what a
--    daily byte ceiling needs (20260929010000), and the ceilings themselves are
--    rows in `private_settings`, so the owner can move one without a migration:
--      update public.private_settings set value = '400000000' where name = 'telemetry_daily_bytes';
--
-- The counters in `telemetry_rate_limits` are cleared: they are keyed the old
-- way, and the oldest of them is an hour of history.

create table if not exists public.private_settings (
  name text primary key,
  value text not null
);
alter table public.private_settings enable row level security;
revoke all on table public.private_settings from public, anon, authenticated;
grant all on table public.private_settings to service_role;

-- Two UUIDs' worth of the server's strong random source, hashed so the stored
-- value is not shaped like either. Written once: a second run keeps the salt,
-- because changing it orphans every key already stored.
insert into public.private_settings (name, value)
values (
  'address_salt',
  encode(sha256(convert_to(gen_random_uuid()::text || gen_random_uuid()::text, 'UTF8')), 'hex')
)
on conflict (name) do nothing;

-- A number the owner may tune, or the default the migration was written with.
create or replace function public.private_setting_int(p_name text, p_default bigint)
returns bigint
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_text text;
begin
  select s.value into v_text from public.private_settings s where s.name = p_name;
  if v_text is null or v_text !~ '^[0-9]{1,18}$' then
    return p_default;
  end if;
  return v_text::bigint;
end;
$$;

-- One address, written one way. NULL for anything that is not an address.
create or replace function public.normalize_client_address(p_address text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_text text := btrim(coalesce(p_address, ''));
  v_inet inet;
begin
  -- `203.0.113.9:51234` and `[2001:db8::1]:443`: some proxies append the port.
  if v_text ~ '^[0-9]{1,3}([.][0-9]{1,3}){3}:[0-9]{1,5}$' then
    v_text := regexp_replace(v_text, ':[0-9]{1,5}$', '');
  elsif v_text ~ '^\[[0-9A-Fa-f:.]{2,45}\](:[0-9]{1,5})?$' then
    v_text := regexp_replace(regexp_replace(v_text, '\](:[0-9]{1,5})?$', ''), '^\[', '');
  end if;
  if v_text !~ '^[0-9A-Fa-f:.]{3,45}$' then
    return null;
  end if;
  begin
    v_inet := v_text::inet;
  exception when others then
    return null;
  end;
  if family(v_inet) = 6 then
    if v_inet <<= inet '::ffff:0:0/96' then
      return host(inet '0.0.0.0' + (v_inet - inet '::ffff:0:0'));
    end if;
    return host(network(set_masklen(v_inet, 64))) || '/64';
  end if;
  return host(v_inet);
end;
$$;

-- The address a request came from, as far as a trusted hop can vouch for it
-- (20260928000000), now normalised. Still NULL when there is no request.
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
  return public.normalize_client_address(v_ip);
end;
$$;

-- What is stored in place of an address. It raises when the salt is missing
-- rather than hashing with none: an unsalted hash of an IPv4 address is a
-- lookup table away from the address.
create or replace function public.hash_client_address(p_address text)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_salt text;
begin
  if p_address is null then
    return null;
  end if;
  select s.value into v_salt from public.private_settings s where s.name = 'address_salt';
  if v_salt is null or length(v_salt) < 32 then
    raise exception 'address salt is missing';
  end if;
  return left(encode(sha256(convert_to(v_salt || '|' || p_address, 'UTF8')), 'hex'), 32);
end;
$$;

-- The writer of the current request, as every pace rule keys it.
create or replace function public.request_client_key()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select public.hash_client_address(public.request_client_ip());
$$;

-- `bump_rate_limit` counts requests; this counts an amount against the same
-- table, under the same row lock. A refusal raises in the caller and rolls the
-- increment back, so a flood stays pinned at the limit.
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
  return v_count <= p_limit;
end;
$$;

revoke all on function public.private_setting_int(text, bigint) from public, anon, authenticated;
revoke all on function public.normalize_client_address(text) from public, anon, authenticated;
revoke all on function public.request_client_ip() from public, anon, authenticated;
revoke all on function public.hash_client_address(text) from public, anon, authenticated;
revoke all on function public.request_client_key() from public, anon, authenticated;
revoke all on function public.bump_rate_budget(text, interval, bigint, integer) from public, anon, authenticated;
grant execute on function public.private_setting_int(text, bigint) to service_role;
grant execute on function public.normalize_client_address(text) to service_role;
grant execute on function public.request_client_ip() to service_role;
grant execute on function public.hash_client_address(text) to service_role;
grant execute on function public.request_client_key() to service_role;
grant execute on function public.bump_rate_budget(text, interval, bigint, integer) to service_role;

-- Addresses already stored. The board kept `board:<address>` (or
-- `board:session:<id>` when there was no request); the first becomes the hash
-- of the normalised address, and a value that was never an address is left as
-- a key that matches nothing.
update public.board_posts p
set actor_key = 'board:' || coalesce(
  public.hash_client_address(public.normalize_client_address(substr(p.actor_key, 7))),
  'unknown'
)
where p.actor_key like 'board:%'
  and p.actor_key not like 'board:session:%'
  and p.actor_key !~ '^board:[0-9a-f]{32}$';

delete from public.telemetry_rate_limits;

notify pgrst, 'reload schema';
