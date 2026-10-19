-- Improvement notes D3. `check-grants.mjs` lists `scene_bust_rates` in
-- CLIENT_FUNCTIONS.anon and `scene_bust_stats` in UPDATE_PROBE.
--
-- The scene page (`SceneBriefing`) prints one line under 사건 파일: how many
-- of the other players' windows in this scene hit the wall --
-- "이 장면에서 다른 분석관의 31%가 벽에 닿았습니다". Three pieces, all
-- additive: no column, constraint, policy or trigger of an existing table
-- changes, and no stored row is touched.
--
-- 1. `scene_bust_stats` is a snapshot: one row per (case, scene) with three
--    counts. It holds no id, no time and nothing a player typed, and the
--    client roles get nothing on it; it is read only through (3).
--
-- 2. `refresh_scene_bust_stats()` rebuilds it from the case rows. A case row's
--    `decision_log` is that case's windows (the log starts empty at each case
--    open, runState `log.openCase: FRESH`), one entry a window, and each entry
--    says its scene (`nodeId`) and how it closed (`threshold.state`, "bust" or
--    "cash"; useChoiceCommit). Only the rows players sent with the research
--    box ticked exist here, so only those are counted. Left out:
--      * `season-final` rows, whose log repeats the finale's windows;
--      * rows with no `run_id`; the server keeps one row per run and case, so
--        a run is counted once in a scene however often the case was replayed;
--      * windows played in story mode (`assistStory`), whose wall stood at 88
--        and up and says nothing of the table everyone else plays;
--      * entries with no readable scene id or closing state (older builds).
--    It reads every case row the retention schedule keeps (180 days), which is
--    why it runs from pg_cron once an hour and not on each request.
--
-- 3. `scene_bust_rates()` answers the snapshot, gated: a scene appears only
--    once both its windows and its runs number fifty or more -- the floor the
--    ranking's band uses (`logic_hold_cutoffs`, LOGIC_RANK_FLOOR) -- and then
--    as [windows, percent], the percent a whole number. Below the floor a
--    scene is simply absent. It takes no argument, so the request says
--    nothing of the player -- not even which case is open; the answer is the
--    whole season, read once per page load and kept on the device (docs rule
--    91 is the same arrangement). It is SECURITY DEFINER because anon may not
--    read `decision_log` or `run_id` (20260928030000) nor the snapshot; what
--    it returns is two numbers per scene, never a row.
--
-- If pg_cron is unavailable (PGlite in check:grants, a plain Postgres), the
-- snapshot is filled once below and never again; the reader then answers that
-- first fill, and an empty one prints nothing.

create table if not exists public.scene_bust_stats (
  case_id text not null,
  node_id text not null,
  windows integer not null check (windows >= 0),
  busts integer not null check (busts >= 0 and busts <= windows),
  runs integer not null check (runs >= 0),
  primary key (case_id, node_id)
);

alter table public.scene_bust_stats enable row level security;
revoke all on table public.scene_bust_stats from public, anon, authenticated;
grant all on table public.scene_bust_stats to service_role;

create or replace function public.refresh_scene_bust_stats()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_rows integer;
begin
  -- One writer at a time; a second call waits and then rebuilds again.
  perform pg_advisory_xact_lock(hashtext('refresh-scene-bust-stats'));
  delete from public.scene_bust_stats;
  insert into public.scene_bust_stats (case_id, node_id, windows, busts, runs)
  select w.case_id, w.node_id,
         count(*)::integer,
         count(*) filter (where w.bust)::integer,
         count(distinct w.run_id)::integer
    from (
      select s.case_id, s.run_id,
             e.value->>'nodeId' as node_id,
             e.value->'threshold'->>'state' = 'bust' as bust
        from public.playtest_sessions s
       cross join lateral jsonb_array_elements(
         case when jsonb_typeof(s.decision_log) = 'array' then s.decision_log else '[]'::jsonb end
       ) as e(value)
       where s.case_id <> 'season-final'
         and s.run_id is not null
         and jsonb_typeof(e.value) = 'object'
         and coalesce(e.value->>'assistStory', 'false') <> 'true'
         and e.value->'threshold'->>'state' in ('bust', 'cash')
         and (e.value->>'nodeId') ~ '^[a-z][a-z0-9_]{0,39}$'
    ) w
   group by w.case_id, w.node_id;
  get diagnostics v_rows = row_count;
  return v_rows;
end;
$$;

revoke all on function public.refresh_scene_bust_stats() from public, anon, authenticated;
grant execute on function public.refresh_scene_bust_stats() to service_role;

-- {"case01": {"start": [64, 31], ...}, ...}: windows, then the percent of
-- them that hit the wall, rounded. `{}` until a scene reaches the floor.
create or replace function public.scene_bust_rates()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_object_agg(c.case_id, c.scenes), '{}'::jsonb)
    from (
      select t.case_id,
             jsonb_object_agg(t.node_id, jsonb_build_array(t.windows, round(100.0 * t.busts / t.windows)::integer)) as scenes
        from public.scene_bust_stats t
       where t.windows >= 50
         and t.runs >= 50
       group by t.case_id
    ) c
$$;

revoke all on function public.scene_bust_rates() from public, anon, authenticated;
grant execute on function public.scene_bust_rates() to anon, service_role;

select public.refresh_scene_bust_stats();

do $do$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    execute $sql$select cron.schedule('refresh-scene-bust-stats', '41 * * * *', 'select public.refresh_scene_bust_stats()')$sql$;
  else
    raise notice 'pg_cron unavailable; scene_bust_stats is filled once and not refreshed';
  end if;
end;
$do$;

notify pgrst, 'reload schema';
