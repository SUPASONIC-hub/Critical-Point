-- Written 2026-10-25 on branch d2-hall-of-fame (a draft pull request on top
-- of #224, rules-mark-3b). Merging it applies it to the production database
-- within a minute, before the client deploys; that waits for the user, after
-- #224 (RULES_MARK 3) and seven days of the daily check watched
-- (D2-명예의전당-설계안-20261021.md, question 8 (1): the week of 11-16 at
-- the earliest). Re-date it after whatever is last on main when it merges.
-- Renumbered 20261102030000 -> 20261102040000 on 2026-10-25 in the 11-30
-- merge rehearsal (integration-1130): C-1's 판 읽기 axis (#307) took 030000,
-- and this comes after it, the last of the four.
--
-- D2, 명예 보상: the hall of fame. The ranking is emptied whenever the table
-- changes; the hall of fame is what stays. Each board -- the table's own
-- (`table-3` for RULES_MARK 3) and each week's rule board (`2026-W47`) --
-- keeps its first three seasons that passed the daily check, by run tag,
-- style, score and grade only. No name, no full run id, no time of play, no
-- device: run_tag and the style are already on the public board.
--
-- 1. Two tables. `hall_of_fame_boards` holds one row a board: how many
--    seasons on it carry no mark (`checked_seasons`, below), when it was last
--    written, and when it was settled (`settled_at`; null: provisional, still
--    rewritten each day). `hall_of_fame` holds that board's places, 1 to 3.
--    A board with fewer than ten checked seasons (HALL_OF_FAME_MIN_SEASONS,
--    src/hallOfFame.js) keeps its row and no place: 「표본 부족」.
--
--    The ten are counted over the whole board, by `hall_of_fame_counts()`,
--    not over the rows the day's check replayed (it replays only each board's
--    first candidates): a complete ranking season on that board whose
--    `suspicion` is an empty array -- the insert trigger judged it and found
--    nothing, and no daily check marked it. The board is the season's week,
--    or `table-<tableRules>` of its final case row when it has none (the same
--    rule hall_of_fame_settle holds a place to). Service role only.
--
-- 2. Only `hall_of_fame_settle` writes them, and only the service role may
--    call it: verify-ranking.yml calls it right after it writes the day's
--    marks, from the same check (scripts/verify-ranking-rows.mjs
--    --hall-of-fame-sql), so what was checked and what is posted cannot
--    differ. It takes every board at once and
--      (a) counts each open board itself (hall_of_fame_counts; a count in
--          the call is not read) and refuses any place on one below ten;
--      (b) refuses a place whose ranking row is not a clean, checked season
--          on that board: `suspicion` empty, `rechecked_at` set, the same
--          score, a complete season, the board's week (or none, on a table
--          board) and, on a table board, a final case row of that table.
--          One refusal fails the whole call, so the tables stay as they were
--          the day before (설계안 ② 5: "바꾸지 않음" is the default);
--      (c) leaves a settled board as it is;
--      (d) rewrites an open board's places and count;
--      (e) settles a week's board from its week's start + 28 days (question
--          9 (1): the seasons of a week finish over the weeks after it; Monday
--          00:00 KST + 4 weeks, so 2026-W47's board settles at the first daily
--          check from 12-14), and a table board once a later table's board is
--          written (the ranking was emptied: the last day before is final).
--
-- 3. `public_hall_of_fame`, a view anon may read (security_invoker over two
--    tables anon may only read; RLS on, one select policy each). It gives the
--    settled and written dates in Korean time, not the times. The ranking
--    screen reads it for its badges, and the CI job for the page it pushes to
--    the `hall-of-fame` branch.
--
-- 4. A ranking reset deletes `season-final` rows and nothing else; these two
--    tables are not touched by it. check:grants seeds a row in every table
--    before the newest reset and holds the reset to that.
--
-- check:grants replays it with every migration and holds it to its cases
-- (scripts/check-grants.mjs, "the hall of fame"): anon reads the view and
-- cannot write either table or call the function; a clean season takes its
-- place; a marked, unchecked, other-week or other-score season is refused and
-- nothing changes; fewer than ten leaves the board empty, counted by the
-- server whatever the call says; the count reads the whole board; a settled week is
-- kept; a week four weeks old settles; a later table settles the one before.

create table if not exists public.hall_of_fame_boards (
  board text primary key check (board ~ '^(table-[1-9][0-9]{0,2}|[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3]))$'),
  kind text not null check (kind in ('table', 'week')),
  checked_seasons integer not null check (checked_seasons >= 0),
  updated_at timestamptz not null default now(),
  settled_at timestamptz,
  check ((kind = 'table') = (board like 'table-%'))
);

create table if not exists public.hall_of_fame (
  board text not null references public.hall_of_fame_boards (board) on delete cascade,
  place smallint not null check (place between 1 and 3),
  run_tag text not null check (run_tag ~ '^[A-Z0-9]{1,8}$'),
  score numeric not null check (score between 0 and 100),
  rank text not null check (rank in ('S', 'A', 'B', 'C')),
  style text not null check (style in ('BOARD BREAKER', 'RISK CUTTER', 'SYSTEM THINKER', 'FIELD DECIDER')),
  tags text[] not null default '{}' check (tags <@ array['NEW GAME+', '테이블 시간 ×1.5', '테이블 시간 ×2', '붕괴한 시즌']::text[]),
  primary key (board, place)
);

comment on table public.hall_of_fame_boards is
  'D2 hall of fame: one row a board (table-N, or an ISO week). settled_at null: provisional. Written by hall_of_fame_settle only.';
comment on table public.hall_of_fame is
  'D2 hall of fame: a board''s first three checked seasons, by run_tag, score, grade, style and tags only. Written by hall_of_fame_settle only.';

alter table public.hall_of_fame_boards enable row level security;
alter table public.hall_of_fame enable row level security;
revoke all on table public.hall_of_fame_boards from public, anon, authenticated;
revoke all on table public.hall_of_fame from public, anon, authenticated;
-- Column grants, the rule check:grants holds every table to: anon reads
-- the columns the view reads, and nothing else is there to read.
grant select (board, kind, checked_seasons, updated_at, settled_at) on table public.hall_of_fame_boards to anon;
grant select (board, place, run_tag, score, rank, style, tags) on table public.hall_of_fame to anon;
grant select, insert, update, delete on table public.hall_of_fame_boards to service_role;
grant select, insert, update, delete on table public.hall_of_fame to service_role;

drop policy if exists "public can read the hall of fame boards" on public.hall_of_fame_boards;
create policy "public can read the hall of fame boards" on public.hall_of_fame_boards
  for select to anon using (true);
drop policy if exists "public can read the hall of fame" on public.hall_of_fame;
create policy "public can read the hall of fame" on public.hall_of_fame
  for select to anon using (true);

create or replace view public.public_hall_of_fame
with (security_invoker = true)
as
select
  b.board,
  b.kind,
  b.checked_seasons,
  ((b.settled_at at time zone 'UTC') + interval '9 hours')::date as settled_on,
  ((b.updated_at at time zone 'UTC') + interval '9 hours')::date as updated_on,
  h.place,
  h.run_tag,
  h.score,
  h.rank,
  h.style,
  h.tags
from public.hall_of_fame_boards b
left join public.hall_of_fame h on h.board = b.board;

revoke all on table public.public_hall_of_fame from public, anon, authenticated;
grant select on table public.public_hall_of_fame to anon, service_role;

-- Each board's count of seasons with no mark, over the whole board (1.). The
-- CI job reads it after the day's marks (verify-ranking-rows
-- --hall-of-fame-counts-sql) to choose whether to post places, and
-- hall_of_fame_settle reads it again itself.
create or replace function public.hall_of_fame_counts()
returns table (board text, checked integer)
language sql
stable
security definer
set search_path = public
as $$
  select b.board, count(*)::integer as checked
    from (
      select case
               when s.summary->>'week' ~ '^[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3])$' then s.summary->>'week'
               when s.summary->>'week' is null then (
                 select 'table-' || (f.dynamics->>'tableRules')
                   from public.playtest_sessions f
                  where f.run_id = s.run_id and f.case_id = 'final'
                    and f.dynamics->>'tableRules' ~ '^[1-9][0-9]{0,2}$'
                  limit 1)
             end as board
        from public.playtest_sessions s
       where s.case_id = 'season-final'
         and s.run_id is not null
         and s.score is not null
         and s.summary->>'seasonComplete' = 'true'
         and s.suspicion = '{}'
    ) b
   where b.board is not null
   group by b.board
   order by b.board;
$$;

revoke all on function public.hall_of_fame_counts() from public, anon, authenticated;
grant execute on function public.hall_of_fame_counts() to service_role;

-- `p_boards`: [{ "board": "table-3", "places": [{ "run_tag", "score",
-- "rank", "style", "tags" }, ...] }, ...], places best first (a "checked" in
-- a board is not read: the function counts). Returns { "written": [...],
-- "kept": [...], "settled": [...] } by board.
create or replace function public.hall_of_fame_settle(p_boards jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_board jsonb;
  v_key text;
  v_kind text;
  v_checked integer;
  v_places jsonb;
  v_place jsonb;
  v_settle boolean;
  v_written text[] := '{}';
  v_kept text[] := '{}';
  v_settled text[] := '{}';
  v_tables text[] := '{}';
  v_counts jsonb;
begin
  if p_boards is null or jsonb_typeof(p_boards) <> 'array' then
    raise exception 'hall_of_fame_settle takes an array of boards' using errcode = '22023';
  end if;
  select coalesce(jsonb_object_agg(c.board, c.checked), '{}'::jsonb) into v_counts from public.hall_of_fame_counts() c;
  for v_board in select value from jsonb_array_elements(p_boards) loop
    v_key := v_board->>'board';
    v_places := coalesce(v_board->'places', '[]'::jsonb);
    if v_key is null or v_key !~ '^(table-[1-9][0-9]{0,2}|[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3]))$' then
      raise exception 'not a hall of fame board: %', v_key using errcode = '22023';
    end if;
    if jsonb_typeof(v_places) <> 'array' or jsonb_array_length(v_places) > 3 then
      raise exception 'board % takes at most three places', v_key using errcode = '22023';
    end if;
    v_kind := case when v_key like 'table-%' then 'table' else 'week' end;
    if v_kind = 'table' then v_tables := v_tables || v_key; end if;
    if exists (select 1 from public.hall_of_fame_boards where board = v_key and settled_at is not null) then
      v_kept := v_kept || v_key;
      continue;
    end if;
    -- The board's own count, never the call's.
    v_checked := coalesce((v_counts->>v_key)::integer, 0);
    if v_checked < 10 and jsonb_array_length(v_places) > 0 then
      raise exception 'board % takes no place below ten checked seasons (it has %)', v_key, v_checked using errcode = '22023';
    end if;
    -- Every place a clean, checked season on this board, at the score posted.
    for v_place in select value from jsonb_array_elements(v_places) loop
      if not exists (
        select 1 from public.playtest_sessions s
         where s.case_id = 'season-final'
           and s.run_tag = v_place->>'run_tag'
           and s.suspicion = '{}'
           and s.rechecked_at is not null
           and s.summary->>'seasonComplete' = 'true'
           and s.score = (v_place->>'score')::numeric
           and (case when v_kind = 'week' then s.summary->>'week' = v_key else s.summary->>'week' is null end)
           and (v_kind = 'week' or exists (
             select 1 from public.playtest_sessions f
              where f.run_id = s.run_id and f.case_id = 'final'
                and f.dynamics->>'tableRules' = substring(v_key from 7)
           ))
      ) then
        raise exception 'board %: RUN % is not a clean, checked season on this board', v_key, v_place->>'run_tag' using errcode = '22023';
      end if;
    end loop;
    v_settle := v_kind = 'week'
      and now() >= ((to_date(v_key, 'IYYY-"W"IW')::timestamp at time zone 'UTC') - interval '9 hours') + interval '28 days';
    insert into public.hall_of_fame_boards as b (board, kind, checked_seasons, updated_at, settled_at)
    values (v_key, v_kind, v_checked, now(), case when v_settle then now() end)
    on conflict (board) do update
      set checked_seasons = excluded.checked_seasons, updated_at = excluded.updated_at, settled_at = excluded.settled_at;
    delete from public.hall_of_fame where board = v_key;
    insert into public.hall_of_fame (board, place, run_tag, score, rank, style, tags)
    select v_key, t.ord, t.e->>'run_tag', (t.e->>'score')::numeric, t.e->>'rank', t.e->>'style',
           coalesce(array(select jsonb_array_elements_text(coalesce(t.e->'tags', '[]'::jsonb))), '{}')
      from jsonb_array_elements(v_places) with ordinality as t(e, ord);
    v_written := v_written || v_key;
    if v_settle then v_settled := v_settled || v_key; end if;
  end loop;
  -- A table board written today closes every other open table board: the
  -- ranking was emptied for a new table, and the last day before is final.
  if cardinality(v_tables) > 0 then
    with closed as (
      update public.hall_of_fame_boards
         set settled_at = now()
       where kind = 'table' and settled_at is null and not (board = any(v_tables))
      returning board
    )
    select v_settled || coalesce(array_agg(board order by board), '{}') into v_settled from closed;
  end if;
  return jsonb_build_object('written', to_jsonb(v_written), 'kept', to_jsonb(v_kept), 'settled', to_jsonb(v_settled));
end;
$$;

revoke all on function public.hall_of_fame_settle(jsonb) from public, anon, authenticated;
grant execute on function public.hall_of_fame_settle(jsonb) to service_role;

notify pgrst, 'reload schema';
