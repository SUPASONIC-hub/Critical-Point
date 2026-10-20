-- Ships with the day-ten rules, in the same pull request (drafted 2026-10-15 as
-- 20261015020000, re-dated on the merge day to follow 20261020000000). The mark
-- key `tableRules` (RULES_MARK_KEY in src/gauntlet/gauntletEngine.js) and the
-- message 'older-table runs are not ranked' are the ones chosen on 2026-10-15.
--
-- 2026-10-20. The table changed what it pays (the client of 2026-10-20, the
-- day-ten table): a burn of 8 breaks the next board (10 before), the logic
-- streak pays up to x1.6 and LOCK has its own cap of x1.5 under it, a hand holds
-- five tools, the wall's lowest place is 56, HUMAN RECORD asks for every case's
-- record, and from prologue 03 a window can be scouted once (SCOUT, 3 seconds).
-- Three things follow here, as in 20261011010000.
--
-- 1. The ranking starts over. A season's score was earned at the table, and a
--    score from the table before this one does not compare with one from
--    this one. Same reset as the seven before it (20260916000000 to
--    20261011010000), the same statement and nothing wider: only
--    `season-final` rows are ranking rows, and per-case telemetry stays where
--    it is. The client's own ranking was emptied the same way, by a new
--    storage key (v9). This is the one reset for the change of table.
--
-- 2. A season from the table before does not come back, for the reason
--    20261011010000 gave: the delete removes the row that answered "this run
--    is ranked already". So the ranking refuses a `season-final` row for a
--    run with any case row that was not written at this table. The mark is
--    `tableRules` in the row's `dynamics`, a number of 2 or more: every build
--    from this one writes it on every case row (`createRunSummary`), and no
--    build before did. A case row with no `dynamics`, or one that is not an
--    object, is read the same way.
--
--    A plain exception, like the two refusals it stands beside: PostgREST
--    answers 400 and the client's queue lets the row go. After the story
--    check and the beat-table check, so a season that is several of them is
--    told the oldest reason, and before the two timing checks.
--
--    Where it goes: `validate_telemetry_insert` is in parts since
--    20261014000000, and this is the part that change was made for. Only
--    `ranking_check_run_marks(text)` is restated -- the two blocks it had,
--    word for word, and the third after them. `ranking_check_run` calls it
--    between the coverage check and the timing checks, where the blocks stood
--    in the whole function, so that order needs nothing here. The trigger
--    function and the other eight parts are not touched. This file needs
--    20261014000000 before it: without it nothing calls the part.
--
--    What this costs: a season begun before this table and finished after it
--    is never ranked, whatever it scores from here on.
--
-- 3. `dynamics` gains one key the constraint did not know, the mark, which
--    gets the line every key since 20261011010000 got: optional, and a number
--    when present. Every other line is the one 20261011010000 wrote. NOT
--    VALID, dropped first, as before.
--
-- The part first, so the ranking is never empty and unguarded. `create or
-- replace` keeps the part's grants, and they are restated anyway, as
-- 20261014000000 wrote them; every attribute it set (SECURITY INVOKER,
-- VOLATILE, `search_path = public`) is set again, since `create or replace`
-- drops one left out.

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
  -- A case closed at the table before this one has no `tableRules`
  -- in its row's `dynamics`; a case closed at this one
  -- always has, as a number of 2 or more. One such case keeps the whole
  -- season off the ranking, read from the run's rows like the two marks
  -- above. `is not true`, so a missing key, a missing object, a value of
  -- another type and a smaller number all read alike. The `case` keeps
  -- the cast off a stored row whose key is not a number (rows written
  -- before section 3's line are not re-read).
  if exists (
    select 1 from public.playtest_sessions s
    where s.run_id = p_run_id
      and s.case_id = any(public.season_case_ids())
      and (case when jsonb_typeof(s.dynamics->'tableRules') = 'number'
                then (s.dynamics->>'tableRules')::numeric >= 2 end) is not true
  ) then
    raise exception 'older-table runs are not ranked';
  end if;
end;
$$;

revoke all on function public.ranking_check_run_marks(text) from public, anon, authenticated;
grant execute on function public.ranking_check_run_marks(text) to service_role;

delete from public.playtest_sessions where case_id = 'season-final';

alter table public.playtest_sessions
  drop constraint if exists playtest_sessions_dynamics_shape;

alter table public.playtest_sessions
  add constraint playtest_sessions_dynamics_shape
  check (
    dynamics is null
    or (
      jsonb_typeof(dynamics) = 'object'
      and jsonb_typeof(dynamics -> 'windowIndex') = 'number'
      and jsonb_typeof(dynamics -> 'runPot') = 'number'
      and jsonb_typeof(dynamics -> 'vault') = 'number'
      and jsonb_typeof(dynamics -> 'streak') = 'number'
      and jsonb_typeof(dynamics -> 'busts') = 'number'
      and jsonb_typeof(dynamics -> 'cashes') = 'number'
      and jsonb_typeof(dynamics -> 'bestMultiplier') = 'number'
      and jsonb_typeof(dynamics -> 'lastGauge') = 'number'
      and jsonb_typeof(dynamics -> 'lastOutcome') = 'string'
      and jsonb_typeof(dynamics -> 'mutations') = 'array'
      and jsonb_typeof(dynamics -> 'responseTimeSec') = 'number'
      and (not (dynamics ? 'beatCombo') or jsonb_typeof(dynamics -> 'beatCombo') = 'number')
      and (not (dynamics ? 'bestCombo') or jsonb_typeof(dynamics -> 'bestCombo') = 'number')
      and (not (dynamics ? 'grooveVault') or jsonb_typeof(dynamics -> 'grooveVault') = 'number')
      and (not (dynamics ? 'logicStreak') or jsonb_typeof(dynamics -> 'logicStreak') = 'number')
      and (not (dynamics ? 'bestLogic') or jsonb_typeof(dynamics -> 'bestLogic') = 'number')
      and (not (dynamics ? 'handVault') or jsonb_typeof(dynamics -> 'handVault') = 'number')
      and (not (dynamics ? 'tableRules') or jsonb_typeof(dynamics -> 'tableRules') = 'number')
      and (not (dynamics ? 'relics') or (jsonb_typeof(dynamics -> 'relics') = 'array' and jsonb_array_length(dynamics -> 'relics') <= 16))
    )
  ) not valid;

notify pgrst, 'reload schema';
