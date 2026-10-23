-- E-6: under the decision reveal, one line -- "같은 카드를 고른 분석관 47%",
-- and "드문 선택" when the card is the minority's. The same frame as D3's
-- wall rate (20261020020000_scene_bust_rates.sql), three additive pieces: no
-- column, constraint, policy or trigger of an existing table changes, and no
-- stored row is touched. `check-grants.mjs` lists `scene_choice_rates` in
-- CLIENT_FUNCTIONS.anon and `scene_choice_stats` in UPDATE_PROBE.
--
-- Dated the day it is merged, 2026-10-23 (renumbered from 20261027 by the
-- user's choice, 10-23), right after this
-- branch's calendar (20261023010000). Merging applies it within a minute;
-- the client that reads it comes with the deploy after, and until a scene
-- has fifty runs nothing is printed anyway.
--
-- 1. `scene_choice_stats`: one row per (case, scene, card) with the windows
--    that staked that card and the scene's own windows and runs, the latter
--    two repeated on each of the scene's rows so the reader needs no second
--    table. No id, no time, nothing a player typed; the client roles get
--    nothing on it.
--
-- 2. `refresh_scene_choice_stats()` rebuilds it from the case rows, as D3's
--    does, with the same rows left out (`season-final`, no `run_id`, entries
--    with no readable scene, card or closing state) and one more: a window the
--    room played (`threshold.forced`), which was no one's choice. Story-mode
--    windows count: the wall differs there, the choice does not. Once a day
--    (pg_cron, 03:29 KST) and not each hour like D3: the free plan's compute
--    is the cost, and a percentage of fifty runs and more moves slowly.
--
-- 3. `scene_choice_rates()` answers the snapshot, gated at D3's floor: a scene
--    appears only once its windows and its runs number fifty or more, as
--    {"case01": {"start": [64, {"layoff": 47, "funding": 30}]}} -- the
--    scene's windows, then each card's share as a whole percent. No argument,
--    so the request says nothing of the player, not even which case is open;
--    read once per page load and kept on the device. SECURITY DEFINER because
--    anon may read neither `decision_log` nor the snapshot.
--
-- If pg_cron is unavailable (PGlite in check:grants), the snapshot is filled
-- once below and never again.

create table if not exists public.scene_choice_stats (
  case_id text not null,
  node_id text not null,
  choice_id text not null,
  picks integer not null check (picks >= 0),
  windows integer not null check (windows >= 0 and picks <= windows),
  runs integer not null check (runs >= 0),
  primary key (case_id, node_id, choice_id)
);

alter table public.scene_choice_stats enable row level security;
revoke all on table public.scene_choice_stats from public, anon, authenticated;
grant all on table public.scene_choice_stats to service_role;

create or replace function public.refresh_scene_choice_stats()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_rows integer;
begin
  perform pg_advisory_xact_lock(hashtext('refresh-scene-choice-stats'));
  delete from public.scene_choice_stats;
  with w as (
    select s.case_id, s.run_id,
           e.value->>'nodeId' as node_id,
           e.value->>'choiceId' as choice_id
      from public.playtest_sessions s
     cross join lateral jsonb_array_elements(
       case when jsonb_typeof(s.decision_log) = 'array' then s.decision_log else '[]'::jsonb end
     ) as e(value)
     where s.case_id <> 'season-final'
       and s.run_id is not null
       and jsonb_typeof(e.value) = 'object'
       and coalesce(e.value->'threshold'->>'forced', 'false') <> 'true'
       and e.value->'threshold'->>'state' in ('bust', 'cash')
       and (e.value->>'nodeId') ~ '^[a-z][a-z0-9_]{0,39}$'
       and (e.value->>'choiceId') ~ '^[a-z_][a-z0-9_]{0,63}$'
  ),
  scenes as (
    select case_id, node_id, count(*)::integer as windows, count(distinct run_id)::integer as runs
      from w
     group by case_id, node_id
  )
  insert into public.scene_choice_stats (case_id, node_id, choice_id, picks, windows, runs)
  select w.case_id, w.node_id, w.choice_id, count(*)::integer, sc.windows, sc.runs
    from w
    join scenes sc on sc.case_id = w.case_id and sc.node_id = w.node_id
   group by w.case_id, w.node_id, w.choice_id, sc.windows, sc.runs;
  get diagnostics v_rows = row_count;
  return v_rows;
end;
$$;

revoke all on function public.refresh_scene_choice_stats() from public, anon, authenticated;
grant execute on function public.refresh_scene_choice_stats() to service_role;

create or replace function public.scene_choice_rates()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_object_agg(c.case_id, c.scenes), '{}'::jsonb)
    from (
      select n.case_id, jsonb_object_agg(n.node_id, jsonb_build_array(n.windows, n.cards)) as scenes
        from (
          select t.case_id, t.node_id, t.windows,
                 jsonb_object_agg(t.choice_id, round(100.0 * t.picks / t.windows)::integer) as cards
            from public.scene_choice_stats t
           where t.windows >= 50
             and t.runs >= 50
           group by t.case_id, t.node_id, t.windows
        ) n
       group by n.case_id
    ) c
$$;

revoke all on function public.scene_choice_rates() from public, anon, authenticated;
grant execute on function public.scene_choice_rates() to anon, service_role;

select public.refresh_scene_choice_stats();

do $do$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    execute $sql$select cron.schedule('refresh-scene-choice-stats', '29 18 * * *', 'select public.refresh_scene_choice_stats()')$sql$;
  else
    raise notice 'pg_cron unavailable; scene_choice_stats is filled once and not refreshed';
  end if;
end;
$do$;

notify pgrst, 'reload schema';
