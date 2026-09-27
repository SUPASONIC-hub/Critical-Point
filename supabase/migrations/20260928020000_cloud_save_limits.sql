-- Cloud saves: bound them the way every other anon write is bounded.
--
-- `put_cloud_save` (20260916000000) had three gaps.
--
-- 1. No pace. It was the one anon write with no rate limit, and each call can
--    carry 1.5 MB. Puts now count against `telemetry_rate_limits`: 240 an hour
--    per code (the client debounces one upload per settled save, so a player
--    making a decision every fifteen seconds stays under it) and 600 an hour
--    per address. Reads by code count too, 120 an hour per address -- the code
--    has 60 bits, so this is about load, not guessing.
--
-- 2. A put carried its own `saved_at`, accepted up to a day in the future. One
--    put dated tomorrow locked every honest device out of that code until then:
--    each of their saves was "older" and refused. The client value is still
--    what orders two devices' saves -- an offline phone must not overwrite the
--    evening's play when it reconnects, and only the device knows when its save
--    was made -- but it is clamped to `now()` before it is stored, so the
--    furthest a copy can claim to be ahead is the present.
--
-- 3. Two first puts for one code could race: both saw no row, and the second
--    upsert overwrote the first whatever their times. The comparison is now the
--    upsert's own `where`, so the row lock decides, and `revision` counts
--    accepted writes so a reader can tell two copies with one timestamp apart.
--
-- The signature and the returned keys (`accepted`, `saved_at`) are unchanged,
-- so `src/cloudSave.js` needs no edit; `revision` is an extra key it may ignore.
-- Retention now covers the table through `updated_at` (20260928040000).

alter table public.cloud_saves add column if not exists revision bigint not null default 0;
create index if not exists cloud_saves_updated_at_idx on public.cloud_saves (updated_at);

create or replace function public.put_cloud_save(p_code text, p_saved_at timestamptz, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_ip text := public.request_client_ip();
  v_saved_at timestamptz;
  v_revision bigint;
  v_existing timestamptz;
begin
  if p_code is null or p_code !~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{12}$' then
    raise exception 'invalid cloud save code';
  end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' or octet_length(p_payload::text) > 1500000 then
    raise exception 'invalid cloud save payload';
  end if;
  if p_saved_at is null or not isfinite(p_saved_at) then
    raise exception 'invalid cloud save time';
  end if;
  v_hash := encode(sha256(convert_to(p_code, 'UTF8')), 'hex');

  if not public.bump_rate_limit('cloud-put:' || v_hash, interval '1 hour', 240)
    or (v_ip is not null and not public.bump_rate_limit('cloud-put-ip:' || v_ip, interval '1 hour', 600)) then
    raise exception 'cloud save rate limit exceeded';
  end if;

  v_saved_at := least(p_saved_at, now());

  insert into public.cloud_saves as c (code_hash, saved_at, payload, updated_at, revision)
  values (v_hash, v_saved_at, p_payload, now(), 1)
  on conflict (code_hash) do update
  set saved_at = excluded.saved_at,
      payload = excluded.payload,
      updated_at = now(),
      revision = c.revision + 1
  where c.saved_at <= excluded.saved_at
  returning c.revision into v_revision;

  if v_revision is null then
    select c.saved_at into v_existing from public.cloud_saves c where c.code_hash = v_hash;
    return jsonb_build_object('accepted', false, 'saved_at', v_existing);
  end if;
  return jsonb_build_object('accepted', true, 'saved_at', v_saved_at, 'revision', v_revision);
end;
$$;

-- Volatile now, because counting a read is a write.
create or replace function public.get_cloud_save(p_code text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_ip text := public.request_client_ip();
  v_row public.cloud_saves%rowtype;
begin
  if p_code is null or p_code !~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{12}$' then
    raise exception 'invalid cloud save code';
  end if;
  if v_ip is not null and not public.bump_rate_limit('cloud-get-ip:' || v_ip, interval '1 hour', 120) then
    raise exception 'cloud save rate limit exceeded';
  end if;
  select * into v_row from public.cloud_saves
  where code_hash = encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
  if not found then
    return null;
  end if;
  return jsonb_build_object('saved_at', v_row.saved_at, 'payload', v_row.payload, 'revision', v_row.revision);
end;
$$;

-- anon only: the app has no sign-in, so `authenticated` is never the caller
-- (and `enable_signup` is off in config.toml).
revoke execute on function public.put_cloud_save(text, timestamptz, jsonb) from public, authenticated;
revoke execute on function public.get_cloud_save(text) from public, authenticated;
grant execute on function public.put_cloud_save(text, timestamptz, jsonb) to anon, service_role;
grant execute on function public.get_cloud_save(text) to anon, service_role;

notify pgrst, 'reload schema';
