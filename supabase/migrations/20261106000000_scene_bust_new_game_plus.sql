-- Ships with RULES_MARK 3 and its ranking reset (20261102000000, drafted
-- 2026-10-21), in the same pull request, so the two reach the database
-- together; re-dated with it on the merge day to follow main.
--
-- NEW GAME+ (NEWGAMEPLUS-이어받기-설계안.md, the user's answers of
-- 2026-10-21, 1 and 2): a season begun with NEW GAME+ plays the first four
-- prologues under every rule of the table (`veteran`, tableUnlocks.js), where
-- an ordinary season meets them a step at a time. Its windows there are not
-- the scene everyone else plays, so the scene page's wall rate
-- (`scene_bust_rates`, 20261020020000) leaves them out. The server tells them
-- by the row: a case row whose summary says `newGamePlus: true` (the NEW GAME+
-- pull request writes it on every case row) in one of the cases whose step
-- has fewer rules than the whole table -- prologue 01 to 04, prologue 04
-- still without the stances and the draft after RULES_MARK 3. A build that
-- does not write the mark yet sends nothing it would match, so the line is
-- harmless before then.
--
-- Only that line is new. `refresh_scene_bust_stats()` is otherwise the one
-- 20261020020000 wrote, word for word; the windows of the table before
-- RULES_MARK 3 and those after it are counted together, so the rate stays
-- printed while the new table's windows build up (the user's answer 2: no
-- `tableRules >= 3` line). The snapshot, the reader, the schedule and the
-- grants are not touched; `create or replace` keeps the function's grants,
-- restated anyway, and every attribute is set again.

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
         and not (coalesce(s.summary->'newGamePlus' = 'true'::jsonb, false) and s.case_id in ('prologue01', 'prologue02', 'prologue03', 'prologue04'))
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

select public.refresh_scene_bust_stats();

notify pgrst, 'reload schema';
