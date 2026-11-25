-- Part of the reset bundle R (N18, the owner's answer of 2026-11-16, (1)),
-- merged with the ranking reset on 11-25 (moved up from 11-30). A `.sql` dated
-- after the last migration on main, beside the reset (20261130000000).
--
-- N18: prologue 02 opens two rules, the logic combo and BLACKOUT, where it
-- opened four; AFTERSHOCK opens in case 04 and SILENCE in case 05. The ladder
-- reaches case 05, so the cases whose step has fewer rules than the whole
-- table are prologue 01 to case 04 (`VETERAN_TABLE_CASES`, tableUnlocks.js,
-- held to this list by a unit test), where 20261106040000 named prologue 01
-- to case 02.
--
-- Only that list is new. `refresh_scene_bust_stats()` is otherwise the one
-- 20261106040000 wrote, word for word; the grants are restated.

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
         and not (coalesce(s.summary->'newGamePlus' = 'true'::jsonb, false) and s.case_id in ('prologue01', 'prologue02', 'prologue03', 'prologue04', 'prologue05', 'case01', 'case02', 'case03', 'case04'))
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
