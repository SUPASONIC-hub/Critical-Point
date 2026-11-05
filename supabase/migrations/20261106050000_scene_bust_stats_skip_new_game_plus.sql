-- Written 2026-11-05 on branch scene-bust-ngplus (improvement notes 11-05 D3,
-- the user's answer (1): keep the scene wall rates as they are -- the floor of
-- fifty windows and fifty runs, the hourly rebuild -- and only leave the
-- NEW GAME+ windows out). Merging it applies it to the production database
-- within a minute, before the client deploys; the client does not change.
--
-- The decision it carries is older. docs/history.md (2026-10-21, NEW GAME+
-- carry-over, three answers all option 1): "장면 BUST 비율에서 NEW GAME+ 판은
-- 서버가 사건 요약의 `newGamePlus`와 `case_id`로 행마다 거르고, 그 줄은
-- rules-mark-3 마이그레이션의 `refresh_scene_bust_stats` 다시 정의로 넣으며".
-- The NEW GAME+ work (#220) went out on 2026-10-23 and the rows have carried
-- the mark since, but no migration redefined the function: the rates have
-- counted the veteran table's windows with everyone else's. This is that
-- redefinition, on its own.
--
-- Why they are left out: a NEW GAME+ season plays the veteran table
-- (`getTableRules(caseId, { veteran })`, src/rankingRecheck.js), whose wall
-- and rules differ from the table a first season plays, so its windows say
-- nothing of the scene the line is printed on -- the same reason story-mode
-- windows (`assistStory`) are already left out.
--
-- The mark: a case row's `summary.newGamePlus` is `true` for a run begun
-- with NEW GAME+ (`newGamePlusMark`, src/ranking.js; the drop-off report
-- reads the same key, scripts/report-funnel.mjs, as `summary->>'newGamePlus'
-- = 'true'`). It is the row's, not the entry's, so the filter is on the
-- session row beside the `season-final` and `run_id` ones. A row with no mark
-- or with `false` counts as before.
--
-- Same body otherwise: SECURITY DEFINER, `search_path` pinned to '', the
-- advisory lock, the delete-and-insert rebuild, the same return. The table,
-- its grants, `scene_bust_rates()` and the pg_cron entry
-- ('refresh-scene-bust-stats', 41 * * * *) are untouched; the job calls the
-- function by name and so runs this body from its next tick. The snapshot is
-- rebuilt once below so the hour until then does not answer the old counts.
--
-- check:grants replays it with every migration and holds it to its cases
-- (scripts/check-grants.mjs, "D3: NEW GAME+ windows are left out of the scene
-- wall rates"): forty NEW GAME+ windows on a scene of sixty plain ones change
-- neither its windows nor its percent, and a scene of thirty plain and thirty
-- NEW GAME+ runs stays under the floor.

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
         -- NEW GAME+ rows play the veteran table (history 2026-10-21).
         and coalesce(s.summary->>'newGamePlus', 'false') <> 'true'
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
