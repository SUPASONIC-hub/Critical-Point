-- 참가자 게시판: the two makers moderate the board from the board screen
-- (2026-11-16, the owner's choice: Google sign-in only).
--
-- Until now a post was hidden or restored by `moderate_board_post`, which only
-- the service role may run: the SQL Editor or the Board Reports workflow. This
-- adds a second way in, for two people only, from the game itself:
--
--   - `public.board_admins` names them by e-mail (the two creator addresses
--     the credits already print). Nobody but the service role reads it.
--   - `public.is_board_admin()` is true only for a signed-in Supabase Auth
--     user (`auth.role() = 'authenticated'`) whose token's e-mail is on that
--     list and who signed in with Google (`app_metadata.providers` holds
--     `google`). The provider is part of the gate on purpose: a token's e-mail
--     is whatever the account says, and an e-mail/password account opened
--     under one of these addresses before its owner ever signed in would carry
--     it too. Google proves the address; the auth server sets
--     `app_metadata`, a user cannot.
--   - Five RPCs, each executable by `authenticated` alone and each refusing
--     anyone `is_board_admin()` does not name: search, a writer's other
--     posts, hide/restore, delete for good, and "am I an admin". The raw
--     `actor_key` never leaves the database; a writer's other posts are
--     reached by a post id.
--   - `public.board_admin_log` keeps one row per hide, restore and delete:
--     who, when, which post. Not the post's words: a post deleted for good is
--     gone, and its body is not kept here either.
--
-- Hide and restore are `moderate_board_post`'s update, and restore deletes the
-- post's reports as scripts/board-reports.mjs `restore` does: a post a person
-- read and kept leaves the report queue. `moderate_board_post` keeps its
-- arguments and its grants; the SQL Editor path still works.
--
-- The client (src/boardAdmin.js) signs in with Supabase Auth's Google
-- provider; docs/board-admin.md has the dashboard steps.

-- ---- who

create table if not exists public.board_admins (
  email text primary key check (email = lower(email) and length(email) between 3 and 254)
);

alter table public.board_admins enable row level security;
revoke all on table public.board_admins from public, anon, authenticated;
grant all on table public.board_admins to service_role;

insert into public.board_admins (email)
values ('from.logic.to.magic@gmail.com'), ('goeun.nam@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_board_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(auth.role() = 'authenticated', false)
     and coalesce((auth.jwt() -> 'app_metadata' -> 'providers') ? 'google', false)
     and exists (
       select 1 from public.board_admins a
        where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
     );
$$;

revoke all on function public.is_board_admin() from public, anon, authenticated;
grant execute on function public.is_board_admin() to service_role;

-- ---- what was done

create table if not exists public.board_admin_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  admin_email text not null,
  action text not null check (action in ('hide', 'restore', 'delete')),
  post_id bigint not null,
  detail jsonb not null default '{}'::jsonb
);

alter table public.board_admin_log enable row level security;
revoke all on table public.board_admin_log from public, anon, authenticated;
grant all on table public.board_admin_log to service_role;

create or replace function public.board_admin_require()
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_board_admin() then
    raise exception using errcode = '42501', message = 'board admin only';
  end if;
  return lower(auth.jwt() ->> 'email');
end;
$$;

revoke all on function public.board_admin_require() from public, anon, authenticated;
grant execute on function public.board_admin_require() to service_role;

-- ---- reading

-- The rows both readers return. A writer is its `actor_key` (one per address,
-- 20260929020000), compared here and never returned.
create or replace function public.board_admin_rows(
  p_query text,
  p_include_hidden boolean,
  p_limit integer,
  p_before_id bigint,
  p_writer_of bigint
)
returns table (
  id bigint,
  nickname text,
  body text,
  created_at timestamptz,
  hidden boolean,
  auto_hidden_at timestamptz,
  kept_at timestamptz,
  report_count integer,
  same_writer_count integer
)
language sql
stable
security definer
set search_path = ''
as $$
  with q as (
    select nullif(lower(btrim(coalesce(p_query, ''))), '') as needle,
           (select w.actor_key from public.board_posts w where w.id = p_writer_of) as writer
  )
  select p.id, p.nickname, p.body, p.created_at, p.hidden, p.auto_hidden_at, p.kept_at,
         (select count(*)::integer from public.board_reports r where r.post_id = p.id),
         case when p.actor_key is null then 1
              else (select count(*)::integer from public.board_posts s where s.actor_key = p.actor_key) end
    from public.board_posts p, q
   where (coalesce(p_include_hidden, true) or not p.hidden)
     and (p_before_id is null or p.id < p_before_id)
     and (q.needle is null
          or strpos(lower(p.nickname), q.needle) > 0
          or strpos(lower(p.body), q.needle) > 0)
     and (p_writer_of is null or p.id = p_writer_of or (q.writer is not null and p.actor_key = q.writer))
   order by p.id desc
   limit least(greatest(coalesce(p_limit, 30), 1), 100);
$$;

revoke all on function public.board_admin_rows(text, boolean, integer, bigint, bigint) from public, anon, authenticated;
grant execute on function public.board_admin_rows(text, boolean, integer, bigint, bigint) to service_role;

create or replace function public.admin_board_search(
  p_query text default null,
  p_include_hidden boolean default true,
  p_limit integer default 30,
  p_before_id bigint default null
)
returns table (
  id bigint,
  nickname text,
  body text,
  created_at timestamptz,
  hidden boolean,
  auto_hidden_at timestamptz,
  kept_at timestamptz,
  report_count integer,
  same_writer_count integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.board_admin_require();
  return query select * from public.board_admin_rows(p_query, p_include_hidden, p_limit, p_before_id, null);
end;
$$;

create or replace function public.admin_board_same_writer(p_post_id bigint)
returns table (
  id bigint,
  nickname text,
  body text,
  created_at timestamptz,
  hidden boolean,
  auto_hidden_at timestamptz,
  kept_at timestamptz,
  report_count integer,
  same_writer_count integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.board_admin_require();
  return query select * from public.board_admin_rows(null, true, 100, null, p_post_id);
end;
$$;

-- ---- acting

-- `moderate_board_post`'s update, then (on restore) the reports deleted as the
-- Board Reports run's restore deletes them. False when there is no such post.
create or replace function public.admin_board_set_hidden(p_post_id bigint, p_hidden boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin text := public.board_admin_require();
  v_found boolean;
  v_reports integer := 0;
begin
  update public.board_posts
     set hidden = p_hidden,
         auto_hidden_at = null,
         kept_at = case when p_hidden then null else now() end
   where board_posts.id = p_post_id
  returning true into v_found;
  if v_found is null then
    return false;
  end if;
  if not p_hidden then
    with gone as (delete from public.board_reports r where r.post_id = p_post_id returning 1)
    select count(*)::integer into v_reports from gone;
  end if;
  insert into public.board_admin_log (admin_email, action, post_id, detail)
  values (v_admin, case when p_hidden then 'hide' else 'restore' end, p_post_id,
          jsonb_build_object('reports_deleted', v_reports));
  return true;
end;
$$;

-- For good: the post and (on delete cascade) its reports.
create or replace function public.admin_board_delete(p_post_id bigint)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin text := public.board_admin_require();
  v_reports integer;
  v_was_hidden boolean;
begin
  select count(*)::integer into v_reports from public.board_reports r where r.post_id = p_post_id;
  delete from public.board_posts p where p.id = p_post_id returning p.hidden into v_was_hidden;
  if v_was_hidden is null then
    return false;
  end if;
  insert into public.board_admin_log (admin_email, action, post_id, detail)
  values (v_admin, 'delete', p_post_id, jsonb_build_object('was_hidden', v_was_hidden, 'reports_deleted', v_reports));
  return true;
end;
$$;

-- Whether the caller is one of the two. Asked by the page after sign-in; it
-- refuses nobody, so a signed-in stranger learns "no" and nothing else.
create or replace function public.admin_board_me()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_board_admin();
$$;

revoke all on function public.admin_board_search(text, boolean, integer, bigint) from public, anon, authenticated;
revoke all on function public.admin_board_same_writer(bigint) from public, anon, authenticated;
revoke all on function public.admin_board_set_hidden(bigint, boolean) from public, anon, authenticated;
revoke all on function public.admin_board_delete(bigint) from public, anon, authenticated;
revoke all on function public.admin_board_me() from public, anon, authenticated;
grant execute on function public.admin_board_search(text, boolean, integer, bigint) to authenticated, service_role;
grant execute on function public.admin_board_same_writer(bigint) to authenticated, service_role;
grant execute on function public.admin_board_set_hidden(bigint, boolean) to authenticated, service_role;
grant execute on function public.admin_board_delete(bigint) to authenticated, service_role;
grant execute on function public.admin_board_me() to authenticated, service_role;
