-- Cloud saves: order two devices by lineage, not by the clock, and bound what a
-- code can hold and how many codes an address can make.
--
-- What the audit found in 20260928020000:
--
-- 1. The only precondition on a put was `saved_at <= excluded.saved_at`, and
--    every local write stamps `savedAt` with the present. So the guard caught
--    exactly one upload -- the one a device had queued while it was offline.
--    Device A plays at nine; device B loads the code and plays until eleven; A
--    is opened at noon, makes one decision, and its save is "newer" and
--    replaces B's two hours. `revision` has counted accepted writes since
--    20260928020000 and nothing read it. A put may now name the revision it
--    was built on (`p_expected_revision`), and is refused when the stored copy
--    has moved past it: `{accepted: false, reason: 'revision', saved_at,
--    revision}`. A put that names none is judged by `saved_at` as before, which
--    is what a client deployed before this migration sends.
--
--    The function gains a parameter, so the three-argument one is dropped and
--    this is the only overload; a call with the three old names resolves to it
--    through the default. Two overloads would make that call ambiguous.
--
-- 2. `peek_cloud_save` answers "what revision do you hold" without sending the
--    save, so a device can ask on launch before it claims to be in step.
--    `delete_cloud_save` removes the copy filed under a code: turning 온라인
--    저장 off used to stop uploads and leave the copy for 180 days, with no way
--    for the player to take it back.
--
-- 3. The payload cap was 1.5 MB and its shape was "an object". A save at the
--    end of a season measures about 125 KB and the settled-window list about
--    24 KB (2026-09-28); the worst the save's own limits allow is about 235 KB.
--    The cap is 400,000 bytes, and the payload must be what the client sends:
--    `save` (an object) and `settledWindows` (at most 400 short strings), and
--    no other key. It was usable as 1.5 MB of anonymous storage per code.
--
-- 4. Codes are minted by the client, and nothing counted new ones: 600 puts an
--    hour under 600 codes is 600 new rows. An address may now start 5 codes a
--    day, and everyone together 300 (`cloud_daily_new_codes` in
--    `private_settings`); past either, a put for a code the table has never
--    seen is refused and puts for existing codes go on. It fails closed.
--
-- Pace refusals are PT429 (20260929010000) and keyed by `request_client_key()`
-- (20260929000000).

drop function if exists public.put_cloud_save(text, timestamptz, jsonb);

create or replace function public.put_cloud_save(
  p_code text,
  p_saved_at timestamptz,
  p_payload jsonb,
  p_expected_revision bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_writer text := public.request_client_key();
  v_saved_at timestamptz;
  v_revision bigint;
  v_existing public.cloud_saves%rowtype;
  v_seed jsonb;
begin
  if p_code is null or p_code !~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{12}$' then
    raise exception 'invalid cloud save code';
  end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' or octet_length(p_payload::text) > 400000 then
    raise exception 'invalid cloud save payload';
  end if;
  if jsonb_typeof(p_payload->'save') is distinct from 'object'
    or (p_payload - 'save' - 'settledWindows') <> '{}'::jsonb then
    raise exception 'invalid cloud save payload';
  end if;
  if p_payload ? 'settledWindows' then
    if jsonb_typeof(p_payload->'settledWindows') <> 'array' then
      raise exception 'invalid cloud save payload';
    end if;
    if jsonb_array_length(p_payload->'settledWindows') > 400 then
      raise exception 'invalid cloud save payload';
    end if;
    for v_seed in select value from jsonb_array_elements(p_payload->'settledWindows') loop
      if jsonb_typeof(v_seed) <> 'string' or length(v_seed #>> '{}') > 200 then
        raise exception 'invalid cloud save payload';
      end if;
    end loop;
  end if;
  if p_saved_at is null or not isfinite(p_saved_at) then
    raise exception 'invalid cloud save time';
  end if;
  if p_expected_revision is not null and p_expected_revision < 0 then
    raise exception 'invalid cloud save revision';
  end if;
  v_hash := encode(sha256(convert_to(p_code, 'UTF8')), 'hex');

  if not public.bump_rate_limit('cloud-put:' || v_hash, interval '1 hour', 240)
    or (v_writer is not null and not public.bump_rate_limit('cloud-put-ip:' || v_writer, interval '1 hour', 600)) then
    raise exception using errcode = 'PT429', message = 'cloud save rate limit exceeded';
  end if;

  if not exists (select 1 from public.cloud_saves c where c.code_hash = v_hash) then
    if (v_writer is not null and not public.bump_rate_limit('cloud-new:' || v_writer, interval '1 day', 5))
      or not public.bump_rate_limit(
        'global:cloud-new',
        interval '1 day',
        public.private_setting_int('cloud_daily_new_codes', 300)::integer
      ) then
      raise exception using errcode = 'PT429', message = 'cloud save code limit reached';
    end if;
  end if;

  v_saved_at := least(p_saved_at, now());

  insert into public.cloud_saves as c (code_hash, saved_at, payload, updated_at, revision)
  values (v_hash, v_saved_at, p_payload, now(), 1)
  on conflict (code_hash) do update
  set saved_at = excluded.saved_at,
      payload = excluded.payload,
      updated_at = now(),
      revision = c.revision + 1
  where (p_expected_revision is null and c.saved_at <= excluded.saved_at)
     or (p_expected_revision is not null and c.revision = p_expected_revision)
  returning c.revision into v_revision;

  if v_revision is null then
    select * into v_existing from public.cloud_saves c where c.code_hash = v_hash;
    return jsonb_build_object(
      'accepted', false,
      'reason', case when p_expected_revision is null then 'older' else 'revision' end,
      'saved_at', v_existing.saved_at,
      'revision', v_existing.revision
    );
  end if;
  return jsonb_build_object('accepted', true, 'saved_at', v_saved_at, 'revision', v_revision);
end;
$$;

create or replace function public.get_cloud_save(p_code text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_writer text := public.request_client_key();
  v_row public.cloud_saves%rowtype;
begin
  if p_code is null or p_code !~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{12}$' then
    raise exception 'invalid cloud save code';
  end if;
  if v_writer is not null and not public.bump_rate_limit('cloud-get-ip:' || v_writer, interval '1 hour', 120) then
    raise exception using errcode = 'PT429', message = 'cloud save rate limit exceeded';
  end if;
  select * into v_row from public.cloud_saves
  where code_hash = encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
  if not found then
    return null;
  end if;
  return jsonb_build_object('saved_at', v_row.saved_at, 'payload', v_row.payload, 'revision', v_row.revision);
end;
$$;

-- The revision and the time, without the save. Counted with the reads.
create or replace function public.peek_cloud_save(p_code text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_writer text := public.request_client_key();
  v_row public.cloud_saves%rowtype;
begin
  if p_code is null or p_code !~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{12}$' then
    raise exception 'invalid cloud save code';
  end if;
  if v_writer is not null and not public.bump_rate_limit('cloud-get-ip:' || v_writer, interval '1 hour', 120) then
    raise exception using errcode = 'PT429', message = 'cloud save rate limit exceeded';
  end if;
  select * into v_row from public.cloud_saves
  where code_hash = encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
  if not found then
    return null;
  end if;
  return jsonb_build_object('saved_at', v_row.saved_at, 'revision', v_row.revision);
end;
$$;

-- Whoever holds the code may take the copy back. True when there was one.
create or replace function public.delete_cloud_save(p_code text)
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_writer text := public.request_client_key();
  v_deleted integer;
begin
  if p_code is null or p_code !~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{12}$' then
    raise exception 'invalid cloud save code';
  end if;
  if v_writer is not null and not public.bump_rate_limit('cloud-delete-ip:' || v_writer, interval '1 hour', 30) then
    raise exception using errcode = 'PT429', message = 'cloud save rate limit exceeded';
  end if;
  delete from public.cloud_saves
  where code_hash = encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
  get diagnostics v_deleted = row_count;
  return v_deleted > 0;
end;
$$;

-- anon only: the app has no sign-in, so `authenticated` is never the caller.
revoke all on function public.put_cloud_save(text, timestamptz, jsonb, bigint) from public, anon, authenticated;
revoke all on function public.get_cloud_save(text) from public, anon, authenticated;
revoke all on function public.peek_cloud_save(text) from public, anon, authenticated;
revoke all on function public.delete_cloud_save(text) from public, anon, authenticated;
grant execute on function public.put_cloud_save(text, timestamptz, jsonb, bigint) to anon, service_role;
grant execute on function public.get_cloud_save(text) to anon, service_role;
grant execute on function public.peek_cloud_save(text) to anon, service_role;
grant execute on function public.delete_cloud_save(text) to anon, service_role;

-- Copies stored before the shape was checked: anything that is not a save the
-- client could have written is not a save anyone can load.
delete from public.cloud_saves c
where jsonb_typeof(c.payload) <> 'object'
   or jsonb_typeof(c.payload->'save') is distinct from 'object';

notify pgrst, 'reload schema';
