-- DRAFT (2026-11-05, bundle-rules2), kept as `.sql.draft` so nothing applies
-- it: merging a `.sql` to main applies it within a minute, before the client
-- deploys. It is promoted on the evening of 2026-11-12, right before the test
-- week's sha is cut (the user's decision of 2026-11-05: everything ships
-- before 11-13, and the ranking is wiped ONCE, on 11-12, by this one file).
-- On that evening: the user is asked first; then the file is renamed to
-- `.sql` (re-dated only if a migration newer than 20261112000000 is on main
-- by then), `DB_MARKS` in scripts/verify-ranking-rows.mjs takes
-- RELIC_DRAFT_MARK (one line; the function below accepts it from here), and
-- check:grants replays it (scripts/check-grants.mjs judges the newest ranking
-- reset by what it leaves and asks for the mark it sets; it knows this file
-- by its name, `*_ranking_reset_rules_mark4_relic_draft.sql`).
--
-- It folds three drafts into one wipe, and nothing of theirs is lost:
--
-- - 20261102000000_rules_mark3_ranking_reset.sql.draft (2026-10-21): RULES_MARK
--   3, the audit and the links as rules of the table from prologue 04. Its
--   `ranking_check_run_marks` asked for `tableRules` of 3 or more.
-- - 20261103000000_rules_mark4_ranking_reset.sql.draft (2026-10-25): RULES_MARK
--   4, C-3 (the streak held on the card's direction) and C-4 (OVERCLOCK, the
--   audit and the links open one a case from 사건 01). Its function asked for
--   4 or more, and is the one kept below: 4 is the mark the rules bundle
--   (#461 rules-1105 and this one) ends at, and the client writes 4
--   (`createRunSummary`, RULES_MARK in src/gauntlet/gauntletEngine.js).
-- - The pieces src/rankingRecheck.js left for "the ranking wipe's migration"
--   (C9, KD은행 계좌 at the draft, kd-spend-engine): the checker's mark
--   `relic-draft` in `ranking_set_recheck_marks`, the season's spent column
--   in `playtest_sessions_dynamics_shape`, and the log's draft cost in
--   `telemetry_check_session_row`.
--
-- What it does, in order, so the ranking is never empty and unguarded:
--
-- 1. `ranking_check_run_marks`: a season from the table before does not come
--    back. The ranking refuses a `season-final` row for a run with any case
--    row whose `tableRules` (in its `dynamics`) is not a number of 4 or more.
--    Only that number differs from the day-ten table's (20261020010000); the
--    three blocks are otherwise word for word. What this costs: a season begun
--    before this table and finished after it is never ranked, and in the
--    minute between this migration and the client's deploy the build before
--    still sends its mark, and its seasons are refused the same way (the
--    client has written 4 since #461, so on 11-12 that minute refuses nothing).
--
-- 2. `ranking_set_recheck_marks`: every line as 20261103020000 wrote it, with
--    `relic-draft` among the marks the checker may set. The function raises on
--    a mark it does not know, and one run's would stop the whole nightly
--    write, which is why verify-ranking-rows.mjs shows the mark but leaves it
--    out of `DB_MARKS` until this is live.
--
-- 3. `playtest_sessions_dynamics_shape`: the constraint as 20261026000000 left
--    it, line for line, plus `seasonSpent` (a whole number of 0 or more when
--    present: what the season paid at its drafts, carried by the run and sent
--    with every case row since C9). Not valid, as before: rows already stored
--    are not read again.
--
-- 4. `telemetry_check_session_row`: the function as 20261026000000 left it,
--    plus one check in the entry loop: a log entry's `relicDraft.cost`, when
--    present, is one of the four a draft can come to (0, 4,000 reroll, 12,000
--    one more, 16,000 both: RELIC_REROLL_COST and RELIC_EXTRA_COST in
--    src/gauntlet/relics.js). The checker re-prices the draft from the record
--    (rankingRecheck.js); this keeps a row with an impossible price out.
--
-- 5. The ranking starts over: the same statement as every reset before it
--    and nothing wider. Only `season-final` rows are ranking rows -- the
--    ordinary board's and the event weeks' (`week`, 20261021000000) alike --
--    and per-case telemetry stays where it is. The hall of fame
--    (`hall_of_fame`, `hall_of_fame_boards`, 20261106010000) is not touched: it
--    is what stays when the ranking is emptied, and the nightly check settles
--    the last table's board on its first write after this. The client's own
--    ranking was emptied by its storage key already (v12 at RULES_MARK 4,
--    src/state/useLocalRanking.js, with #461); nothing more moves there.
--
-- Every statement is idempotent: `create or replace` on the functions (every
-- attribute set again, since `create or replace` drops one left out; the
-- grants restated), `drop constraint if exists` before the constraint, and a
-- delete that finds nothing the second time.

-- 1. The run marks the ranking asks for: RULES_MARK 4.
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
  -- row's `dynamics`, or one below 4 (3 is the table of the audit and the
  -- links from prologue 04, 2 the day-ten table of 2026-10-20); a case
  -- closed at this one always has, as a number of 4 or more. One such case
  -- keeps the whole season off the ranking, read from the run's rows like
  -- the two marks above. `is not true`, so a missing key, a missing object,
  -- a value of another type and a smaller number all read alike. The `case`
  -- keeps the cast off a stored row whose key is not a number.
  if exists (
    select 1 from public.playtest_sessions s
    where s.run_id = p_run_id
      and s.case_id = any(public.season_case_ids())
      and (case when jsonb_typeof(s.dynamics->'tableRules') = 'number'
                then (s.dynamics->>'tableRules')::numeric >= 4 end) is not true
  ) then
    raise exception 'older-table runs are not ranked';
  end if;
end;
$$;

revoke all on function public.ranking_check_run_marks(text) from public, anon, authenticated;
grant execute on function public.ranking_check_run_marks(text) to service_role;

-- 2. The checker's marks, with the draft's (`relic-draft`, RELIC_DRAFT_MARK in
--    src/rankingRecheck.js). Every other line as 20261103020000 wrote it.
create or replace function public.ranking_set_recheck_marks(p_run_id text, p_marks text[], p_replayed boolean default false)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recheck constant text[] := array['chain-off-log', 'relic-draft', 'score-off-log', 'window-no-replay', 'window-off-replay'];
  v_marks text[];
begin
  if p_marks is null or not (p_marks <@ v_recheck) then
    raise exception 'ranking_set_recheck_marks takes only %', v_recheck using errcode = '22023';
  end if;
  update public.playtest_sessions
     set suspicion = (
       select coalesce(array_agg(distinct mark order by mark), '{}')
         from unnest(coalesce(suspicion, '{}') || p_marks) as mark
        where not (mark = any(v_recheck)) or mark = any(p_marks)
     ),
         rechecked_at = case when coalesce(p_replayed, false) then now() end,
         recheck_seen_at = now()
   where case_id = 'season-final'
     and run_id = p_run_id
  returning suspicion into v_marks;
  return v_marks;
end;
$$;

revoke all on function public.ranking_set_recheck_marks(text, text[], boolean) from public, anon, authenticated;
grant execute on function public.ranking_set_recheck_marks(text, text[], boolean) to service_role;

-- 3. The season's spent column in the case row's `dynamics`: the constraint
--    as 20261026000000 left it, line for line, plus the `seasonSpent` line.
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
      and (not (dynamics ? 'weekRule') or jsonb_typeof(dynamics -> 'weekRule') = 'null'
           or (jsonb_typeof(dynamics -> 'weekRule') = 'string' and length(dynamics ->> 'weekRule') <= 32))
      and (not (dynamics ? 'relics') or (jsonb_typeof(dynamics -> 'relics') = 'array' and jsonb_array_length(dynamics -> 'relics') <= 16))
      and (not (dynamics ? 'open') or jsonb_typeof(dynamics -> 'open') = 'null'
           or (jsonb_typeof(dynamics -> 'open') = 'object' and coalesce(jsonb_typeof(dynamics -> 'open' -> 'caseId'), 'none') = 'string'))
      and (not (dynamics ? 'linksOut') or jsonb_typeof(dynamics -> 'linksOut') = 'array')
      and (not (dynamics ? 'relicOffer') or jsonb_typeof(dynamics -> 'relicOffer') = 'array')
      and (not (dynamics ? 'practiceWindows') or jsonb_typeof(dynamics -> 'practiceWindows') = 'number')
      -- C9: the season's spent column, a whole number of 0 or more when present.
      and (not (dynamics ? 'seasonSpent') or (jsonb_typeof(dynamics -> 'seasonSpent') = 'number' and (dynamics ->> 'seasonSpent')::numeric >= 0))
    )
  ) not valid;

-- 4. The log's draft cost: the function as 20261026000000 left it, plus the
--    one check in the entry loop.
create or replace function public.telemetry_check_session_row(
  p_case_id text,
  p_summary jsonb,
  p_decision_log jsonb,
  p_run_id text,
  p_case_title text,
  p_resources jsonb,
  p_triggers jsonb,
  p_cognition jsonb,
  p_dynamics jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_entry jsonb;
begin
  if not public.is_season_case_id(p_case_id, true)
    or jsonb_typeof(p_summary) <> 'object'
    or jsonb_typeof(p_decision_log) <> 'array'
    or jsonb_array_length(p_decision_log) > 60 then
    raise exception 'invalid playtest session payload';
  end if;
  if (p_run_id is not null and length(p_run_id) > 128)
    or length(coalesce(p_case_title, '')) > 80
    or octet_length(p_summary::text) > 4096
    or octet_length(coalesce(p_resources, '{}'::jsonb)::text) > 1024
    or octet_length(coalesce(p_triggers, '{}'::jsonb)::text) > 1024
    or octet_length(coalesce(p_cognition, '{}'::jsonb)::text) > 1024
    or octet_length(coalesce(p_dynamics, '{}'::jsonb)::text) > 6144 then
    raise exception 'playtest session field too large';
  end if;
  for v_entry in select value from jsonb_array_elements(p_decision_log) loop
    if octet_length(v_entry::text) > 8192 then
      raise exception 'decision log entry too large';
    end if;
    -- C9: a draft's cost, when the entry carries one, is one of the four a draft can come to.
    if jsonb_path_exists(v_entry, '$.relicDraft.cost ? (@ != 0 && @ != 4000 && @ != 12000 && @ != 16000)') then
      raise exception 'invalid relic draft cost';
    end if;
  end loop;
end;
$$;

revoke all on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) to service_role;

-- 5. The ranking starts over: the one wipe of 2026-11-12.
delete from public.playtest_sessions where case_id = 'season-final';

notify pgrst, 'reload schema';
