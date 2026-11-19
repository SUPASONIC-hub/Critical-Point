-- 주 1회 알림 (N25, 2026-11-17 결정: iOS까지 Web Push, 규칙 있는 주만, 기본 꺼짐).
--
-- A device that turned the weekly reminder on in the comfort settings of the
-- installed app hands over its browser's push subscription: the address the
-- push service gave it (`endpoint`) and the two keys a message is encrypted
-- with (`p256dh`, `auth`), plus the language the notification is written in.
-- Nothing else: no session id, no address, no save. The Monday morning of a
-- week with a rule, .github/workflows/weekly-push.yml sends one notification
-- to every row (scripts/send-weekly-push.mjs) and deletes the rows the push
-- service answers 404/410 for (the subscription is gone).
--
-- The client has no grant on the table at all. It calls two functions:
--   push_subscribe(endpoint, p256dh, auth, language)  -- insert, or refresh
--     the keys and language of the row with that endpoint
--   push_unsubscribe(endpoint)                        -- delete that row
-- So a row is reached only by its endpoint, which only that browser knows: a
-- client can add or remove its own subscription and read nobody's. Only the
-- service role (the weekly sender) reads the table.
--
-- The endpoint must be an https address on a known push service (Google FCM,
-- Mozilla, Apple, Microsoft WNS), so the weekly sender never posts to an
-- address someone typed in. Pace: 30 calls an hour per address
-- (`request_client_key()`), and at most `push_daily_new_subscriptions`
-- (private_settings, 500 by default) new endpoints a day for everyone
-- together. Refusals are PT429, as the cloud save's.

create table if not exists public.push_subscriptions (
  id bigint generated always as identity primary key,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  language text not null default 'ko',
  created_at timestamptz not null default now(),
  last_sent_at timestamptz,
  constraint push_subscriptions_endpoint check (
    length(endpoint) <= 1024
    and endpoint ~ '^https://(fcm\.googleapis\.com|android\.googleapis\.com|updates\.push\.services\.mozilla\.com|push\.services\.mozilla\.com|([a-z0-9-]+\.)*push\.apple\.com|([a-z0-9-]+\.)*notify\.windows\.com)/[A-Za-z0-9._~:/?#@!$&()*+,;=%-]+$'
  ),
  constraint push_subscriptions_p256dh check (p256dh ~ '^[A-Za-z0-9_-]{80,100}={0,2}$'),
  constraint push_subscriptions_auth check (auth ~ '^[A-Za-z0-9_-]{16,32}={0,2}$'),
  constraint push_subscriptions_language check (language in ('ko', 'en', 'ja'))
);

alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from public, anon, authenticated;
grant all on public.push_subscriptions to service_role;

create or replace function public.push_subscribe(
  p_endpoint text,
  p_p256dh text,
  p_auth text,
  p_language text default 'ko'
)
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_writer text := public.request_client_key();
  v_language text := coalesce(p_language, 'ko');
begin
  if v_language not in ('ko', 'en', 'ja') then
    raise exception 'invalid push subscription';
  end if;
  if v_writer is not null and not public.bump_rate_limit('push-ip:' || v_writer, interval '1 hour', 30) then
    raise exception using errcode = 'PT429', message = 'push subscription rate limit exceeded';
  end if;
  if not exists (select 1 from public.push_subscriptions s where s.endpoint = p_endpoint) then
    if not public.bump_rate_limit(
      'global:push-new',
      interval '1 day',
      public.private_setting_int('push_daily_new_subscriptions', 500)::integer
    ) then
      raise exception using errcode = 'PT429', message = 'push subscription limit reached';
    end if;
  end if;
  -- The table's checks refuse an endpoint or a key that is not one (23514).
  insert into public.push_subscriptions (endpoint, p256dh, auth, language)
  values (p_endpoint, p_p256dh, p_auth, v_language)
  on conflict (endpoint) do update
    set p256dh = excluded.p256dh, auth = excluded.auth, language = excluded.language;
  return true;
end;
$$;

-- Whoever holds the endpoint may take the row back. True when there was one.
create or replace function public.push_unsubscribe(p_endpoint text)
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
  if p_endpoint is null or length(p_endpoint) > 1024 then
    raise exception 'invalid push subscription';
  end if;
  if v_writer is not null and not public.bump_rate_limit('push-ip:' || v_writer, interval '1 hour', 30) then
    raise exception using errcode = 'PT429', message = 'push subscription rate limit exceeded';
  end if;
  delete from public.push_subscriptions where endpoint = p_endpoint;
  get diagnostics v_deleted = row_count;
  return v_deleted > 0;
end;
$$;

-- anon only: the app has no sign-in, so `authenticated` is never the caller.
revoke all on function public.push_subscribe(text, text, text, text) from public, anon, authenticated;
revoke all on function public.push_unsubscribe(text) from public, anon, authenticated;
grant execute on function public.push_subscribe(text, text, text, text) to anon, service_role;
grant execute on function public.push_unsubscribe(text) to anon, service_role;
