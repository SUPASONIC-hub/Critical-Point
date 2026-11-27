-- 참가자 게시판: 「만든 사람 공지」, one notice from the two makers pinned over
-- the posts (2026-11-26, the owner's choice (1)).
--
-- Until now nothing on the board was ours but the code-defined 「이번 주 질문」:
-- a post is anyone's, and its nickname proves nothing. This is the one place
-- on the board only the makers can write, and the board draws it apart from
-- the posts, so no post can pass for it.
--
--   - `public.board_notice` holds at most one row (`id = 1`): the notice in
--     Korean (required) and, optionally, English and Japanese, each 1 to 600
--     characters; when it was posted; an optional end; and which maker posted
--     it. A new notice replaces the old one.
--   - Nobody writes the table but the service role and three RPCs, each
--     executable by `authenticated` alone and each refusing anyone
--     `is_board_admin()` (20261118000000_board_admins.sql) does not name with
--     `board admin only`:
--       - `admin_board_notice_set(p_body_ko, p_body_en, p_body_ja, p_expires_at)`
--         writes (or replaces) the notice. Blank English or Japanese is
--         "none" (the page falls back to Korean); blank Korean, a text over
--         600 characters or an end already past is refused (22023).
--       - `admin_board_notice_clear()` takes it down; false when there was none.
--       - `admin_board_notice_get()` reads it back whole, ended or not, for
--         the admin bar's form.
--   - anon reads the words, `posted_at` and `expires_at` (column grants, as
--     `board_posts` is read), and only while the notice has not ended (the
--     policy). `posted_by` is not granted: the maker's address never leaves.
--     `authenticated` reads nothing directly (the page reads as anon).

create table if not exists public.board_notice (
  id smallint primary key default 1 check (id = 1),
  body_ko text not null check (char_length(btrim(body_ko)) between 1 and 600),
  body_en text check (body_en is null or char_length(btrim(body_en)) between 1 and 600),
  body_ja text check (body_ja is null or char_length(btrim(body_ja)) between 1 and 600),
  posted_at timestamptz not null default now(),
  expires_at timestamptz check (expires_at is null or expires_at > posted_at),
  posted_by text not null
);

alter table public.board_notice enable row level security;
revoke all on table public.board_notice from public, anon, authenticated;
grant select, insert, update, delete on table public.board_notice to service_role;
grant select (body_ko, body_en, body_ja, posted_at, expires_at) on table public.board_notice to anon;

drop policy if exists "public can read the board notice while it lasts" on public.board_notice;
create policy "public can read the board notice while it lasts" on public.board_notice
  for select to anon using (expires_at is null or expires_at > now());

-- A notice's words as stored: trimmed, and blank as none.
create or replace function public.board_notice_text(p_text text)
returns text
language sql
immutable
set search_path = ''
as $$
  select nullif(btrim(coalesce(p_text, '')), '');
$$;

revoke all on function public.board_notice_text(text) from public, anon, authenticated;
grant execute on function public.board_notice_text(text) to service_role;

create or replace function public.admin_board_notice_set(
  p_body_ko text,
  p_body_en text default null,
  p_body_ja text default null,
  p_expires_at timestamptz default null
)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin text := public.board_admin_require();
  v_ko text := public.board_notice_text(p_body_ko);
  v_en text := public.board_notice_text(p_body_en);
  v_ja text := public.board_notice_text(p_body_ja);
  v_at timestamptz := now();
begin
  if v_ko is null then
    raise exception using errcode = '22023', message = 'board notice needs its Korean text';
  end if;
  if char_length(v_ko) > 600 or char_length(coalesce(v_en, '')) > 600 or char_length(coalesce(v_ja, '')) > 600 then
    raise exception using errcode = '22023', message = 'board notice is over 600 characters';
  end if;
  if p_expires_at is not null and p_expires_at <= v_at then
    raise exception using errcode = '22023', message = 'board notice ends before it starts';
  end if;
  insert into public.board_notice as n (id, body_ko, body_en, body_ja, posted_at, expires_at, posted_by)
  values (1, v_ko, v_en, v_ja, v_at, p_expires_at, v_admin)
  on conflict (id) do update
     set body_ko = excluded.body_ko,
         body_en = excluded.body_en,
         body_ja = excluded.body_ja,
         posted_at = excluded.posted_at,
         expires_at = excluded.expires_at,
         posted_by = excluded.posted_by;
  return v_at;
end;
$$;

create or replace function public.admin_board_notice_clear()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_gone boolean;
begin
  perform public.board_admin_require();
  delete from public.board_notice n where n.id = 1 returning true into v_gone;
  return coalesce(v_gone, false);
end;
$$;

create or replace function public.admin_board_notice_get()
returns table (
  body_ko text,
  body_en text,
  body_ja text,
  posted_at timestamptz,
  expires_at timestamptz,
  posted_by text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.board_admin_require();
  return query
  select n.body_ko, n.body_en, n.body_ja, n.posted_at, n.expires_at, n.posted_by
    from public.board_notice n
   where n.id = 1;
end;
$$;

revoke all on function public.admin_board_notice_set(text, text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_board_notice_clear() from public, anon, authenticated;
revoke all on function public.admin_board_notice_get() from public, anon, authenticated;
grant execute on function public.admin_board_notice_set(text, text, text, timestamptz) to authenticated, service_role;
grant execute on function public.admin_board_notice_clear() to authenticated, service_role;
grant execute on function public.admin_board_notice_get() to authenticated, service_role;
