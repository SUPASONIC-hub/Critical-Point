-- 참가자 게시판: the makers' admin bar reads the report queue and its own log
-- (2026-11-16, after 20261118000000_board_admins.sql).
--
-- Three more RPCs, each as the five of 20261118000000 are: executable by
-- `authenticated` (and the service role) alone, refusing anyone
-- `is_board_admin()` does not name, and never returning a writer's
-- `actor_key`.
--
--   - `admin_board_queue(p_limit)`: the posts that wait for a person, in the
--     sense scripts/board-reports.mjs counts them (`readQueue().waiting`):
--       - a post on the board with at least one report, and
--       - a post the reports hid by themselves (`auto_hidden_at` set,
--         20261103000000) that no person has hidden for good or restored.
--     A post a person hid (hidden, `auto_hidden_at` null) is done; a post a
--     person restored lost its reports (`admin_board_set_hidden` and the
--     Board Reports restore delete them). Each row is a post as
--     `admin_board_search` returns it, plus how many writers reported it, the
--     reasons picked ('spam', 'abuse', 'privacy', 'other') and when its first
--     report came. Oldest wait first, as the run's table reads.
--   - `admin_board_queue_count()`: how many posts wait, for the bar's badge.
--   - `admin_board_log(p_limit)`: the newest rows of `board_admin_log`
--     (20261118000000): who, what, which post, when, and its detail (report
--     counts, whether a deleted post was hidden).
--
-- Deciding a waiting post is `admin_board_set_hidden`, unchanged: hide for
-- good clears `auto_hidden_at`, restore keeps the post (`kept_at`) and
-- deletes its reports. Either takes it out of the queue.

-- One rule for both readers: whether a post waits.
create or replace function public.board_admin_waits(p_post_id bigint, p_hidden boolean, p_auto_hidden_at timestamptz)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when p_hidden then p_auto_hidden_at is not null
    else exists (select 1 from public.board_reports r where r.post_id = p_post_id)
  end;
$$;

revoke all on function public.board_admin_waits(bigint, boolean, timestamptz) from public, anon, authenticated;
grant execute on function public.board_admin_waits(bigint, boolean, timestamptz) to service_role;

create or replace function public.admin_board_queue(p_limit integer default 50)
returns table (
  id bigint,
  nickname text,
  body text,
  created_at timestamptz,
  hidden boolean,
  auto_hidden_at timestamptz,
  kept_at timestamptz,
  report_count integer,
  same_writer_count integer,
  writer_count integer,
  reasons text[],
  first_report_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.board_admin_require();
  return query
  select p.id, p.nickname, p.body, p.created_at, p.hidden, p.auto_hidden_at, p.kept_at,
         rep.reports,
         case when p.actor_key is null then 1
              else (select count(*)::integer from public.board_posts s where s.actor_key = p.actor_key) end,
         rep.writers,
         coalesce(rep.reasons, '{}'::text[]),
         rep.first_at
    from public.board_posts p
    cross join lateral (
      select count(*)::integer as reports,
             count(distinct r.actor_key)::integer as writers,
             array_agg(distinct r.reason order by r.reason) as reasons,
             min(r.created_at) as first_at
        from public.board_reports r
       where r.post_id = p.id
    ) rep
   where public.board_admin_waits(p.id, p.hidden, p.auto_hidden_at)
   order by coalesce(rep.first_at, p.auto_hidden_at, p.created_at), p.id
   limit least(greatest(coalesce(p_limit, 50), 1), 100);
end;
$$;

create or replace function public.admin_board_queue_count()
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  perform public.board_admin_require();
  select count(*)::integer into v_count
    from public.board_posts p
   where public.board_admin_waits(p.id, p.hidden, p.auto_hidden_at);
  return v_count;
end;
$$;

create or replace function public.admin_board_log(p_limit integer default 50)
returns table (
  id bigint,
  at timestamptz,
  admin_email text,
  action text,
  post_id bigint,
  detail jsonb
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.board_admin_require();
  return query
  select l.id, l.at, l.admin_email, l.action, l.post_id, l.detail
    from public.board_admin_log l
   order by l.id desc
   limit least(greatest(coalesce(p_limit, 50), 1), 200);
end;
$$;

revoke all on function public.admin_board_queue(integer) from public, anon, authenticated;
revoke all on function public.admin_board_queue_count() from public, anon, authenticated;
revoke all on function public.admin_board_log(integer) from public, anon, authenticated;
grant execute on function public.admin_board_queue(integer) to authenticated, service_role;
grant execute on function public.admin_board_queue_count() to authenticated, service_role;
grant execute on function public.admin_board_log(integer) to authenticated, service_role;
