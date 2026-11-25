-- 묶음 R (2026-11-25, moved up from Monday 11-30 on 11-25, the owner's
-- answer 2): the public ranking is emptied once with the rules change, as the
-- start screen and the guide have said since 11-16 (#535, `rankingReset` in
-- src/copy/intro.js; the day in them is 11-25 since the move). Merged by hand
-- on 11-25, not before: merging a `.sql` to main applies it within a minute,
-- before the client deploys (Supabase migrations apply on merge). The file
-- keeps its 1130 name: it sorts after every migration applied before it
-- (20261129120000), so it applies in order; a later migration needs a name
-- after 20261130000200.
--
-- Same pattern as the one wipe of 11-12
-- (20261112000000_ranking_reset_rules_mark4_relic_draft.sql), narrower:
--
-- 1. `ranking_check_run_marks` is restated (check:grants asks the newest
--    reset to: the older-table refusal lives in no other function the
--    trigger calls). Word for word as 20261112000000 left it, but for the
--    mark: RULES_MARK 7 (src/gauntlet/gauntletEngine.js), so `>= 7` below.
--
--    [SLOT RULES_MARK] Filled (2026-11-17): N26 (#591, n26-case-variants)
--    deals 사건 09, 11, 14 and 16 a rule of their own in a season with no
--    weekly rule, so the same play scores differently there and the mark goes
--    to 5 (the decision 「RULES_MARK 묶음 R에서 5로(채점 바뀜)」). Changed
--    2026-11-19 (the user's 「1」 twice): N26 and G1~G7 ship on 11-20 at 5,
--    G5's other acts on 11-25 at 6. Changed 2026-11-20: G11b, G11c, G13, G16
--    and G18 ship with this wipe as RULES_MARK 7, so `>= 7`. A season
--    begun at mark 4 before this and finished after it is refused, as at
--    every mark before. scripts/check-grants.mjs reads the mark from the
--    `>= N` of this file (SERVER_MARK); DB_MARKS in
--    scripts/verify-ranking-rows.mjs is the checker's text marks, not this
--    number, and does not move.
--
-- 2. The finished count is snapshotted before the delete (N15, 2026-11-16):
--    a `raise notice` with the `season-final` rows and finished runs, read
--    in the migration's log. The numbers to keep are taken by hand first
--    (`node scripts/report-funnel.mjs`, the 11-30 (now 11-25) checklist in
--    docs/work-status.md); this line is the second copy. No table is
--    written: check:grants holds a reset to deleting `season-final` rows and
--    changing nothing else.
--
-- 3. Only `season-final` rows are deleted. The `final` case rows stay, and
--    with them every finish (scripts/report-funnel.mjs counts a run finished
--    from its `final` case row too, and LAST_RANKING_RESET there moves to
--    this merge). The hall of fame (`hall_of_fame`, `hall_of_fame_boards`)
--    is not touched: it is what stays when the ranking is emptied. The
--    client's local board keeps its key (v12): the notice promised the
--    public ranking only (question 2 of the PR).
--
-- [SLOT N18] Filled: the server change is its own file,
-- 20261130000100_scene_bust_ladder_n18.sql (NEW GAME+'s scene wall leaves out
-- the range through case 04).
--
-- [SLOT N21] Filled: first BUST keeps the scene in prologue 01/02. Client
-- only, no server change.
--
-- [SLOT DECISION-T] Filled 2026-11-19 (the owner's answer Q4 (1)): no
-- change. The run of `node scripts/report-decision-t.mjs --fetch` (#563) on
-- 11-19 (run 44453002577) had 0 of 30 finished seasons, 87 of 150 case rows,
-- 55 of 100 bust hands and 0 of 80 W47 audit-cascade rows, so none of T1~T12
-- (T-11's honour threshold included) could be judged, and 11-23 would not
-- have more. Nothing here changes what the server accepts; T is looked at
-- again once players are many.
--
-- Every statement is idempotent: `create or replace` with every attribute
-- and the grants restated, a notice, and a delete that finds nothing the
-- second time.

-- 1. The run marks the ranking asks for: RULES_MARK 7 (see [SLOT RULES_MARK]).
create or replace function public.ranking_check_run_marks(p_run_id text)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  -- A case closed in story mode carries `assistStory: true` in its own
  -- row's summary, and one such case keeps the whole season off the
  -- ranking. Read from the run's rows; a plain exception, since no later
  -- attempt can change what the run was.
  if exists (
    select 1 from public.playtest_sessions s
    where s.run_id = p_run_id
      and s.case_id = any(public.season_case_ids())
      and s.summary->'assistStory' = 'true'::jsonb
  ) then
    raise exception 'story-mode runs are not ranked';
  end if;
  -- A case closed at the table that paid for a press timed to the beat has
  -- no `logicStreak` in its row's `dynamics`; a case closed at this one
  -- always has, as a number. One such case keeps the whole season off the
  -- ranking, read from the run's rows like the story mark above, and a
  -- row with no `dynamics` is such a row. `is not true`, so a missing
  -- key, a missing object and a value of another type all read alike.
  if exists (
    select 1 from public.playtest_sessions s
    where s.run_id = p_run_id
      and s.case_id = any(public.season_case_ids())
      and (jsonb_typeof(s.dynamics->'logicStreak') = 'number') is not true
  ) then
    raise exception 'beat-table runs are not ranked';
  end if;
  -- A case closed at a table before this one has no `tableRules` in its
  -- row's `dynamics`, or one below 5 (4 is the table of C-3 and C-4, 3 the
  -- audit and the links from prologue 04, 2 the day-ten table of 2026-10-20);
  -- a case closed at this one always has, as a number of 5 or more. One such case
  -- keeps the whole season off the ranking, read from the run's rows like
  -- the two marks above. `is not true`, so a missing key, a missing object,
  -- a value of another type and a smaller number all read alike. The `case`
  -- keeps the cast off a stored row whose key is not a number.
  if exists (
    select 1 from public.playtest_sessions s
    where s.run_id = p_run_id
      and s.case_id = any(public.season_case_ids())
      and (case when jsonb_typeof(s.dynamics->'tableRules') = 'number'
                then (s.dynamics->>'tableRules')::numeric >= 7 end) is not true
  ) then
    raise exception 'older-table runs are not ranked';
  end if;
end;
$$;

revoke all on function public.ranking_check_run_marks(text) from public, anon, authenticated;
grant execute on function public.ranking_check_run_marks(text) to service_role;

-- 2. The finished count before the delete (N15): read only, into the log.
do $$
declare
  v_rows int;
  v_runs int;
  v_finals int;
begin
  select count(*), count(distinct run_id) into v_rows, v_runs
    from public.playtest_sessions where case_id = 'season-final';
  select count(distinct run_id) into v_finals
    from public.playtest_sessions where case_id = 'final';
  raise notice 'ranking reset 2026-11-25: % season-final rows (% runs) deleted; % runs keep a final case row', v_rows, v_runs, v_finals;
end;
$$;

-- 3. The ranking starts over: `season-final` rows only, as every reset before.
delete from public.playtest_sessions where case_id = 'season-final';

notify pgrst, 'reload schema';
