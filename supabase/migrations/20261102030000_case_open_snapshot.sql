-- Written 2026-10-22 on branch f1-s3 (draft, base f1-stage3). Merging it
-- applies it to the production database within a minute, before the client
-- deploys; that waits for the user after 11-02 (W44 code freeze; 서버검증-설계안.md,
-- 3단계 S3, question 8 (1)).
--
-- It must come after #216's 20261023000000_ranking_recheck_marks.sql (on main
-- since 10-23). Re-date it to the day it merges, after whatever is last on
-- main then.
--
-- Server checks, phase 3, piece S3: the case-open snapshot.
--
-- A case row's `dynamics` gains what the chain check (src/chainRecheck.js)
-- reads between two cases:
--
--   open             the case as it opened (gauntletEngine's createCaseOpen):
--                    the vault, the tools, the stance mastery, the logic
--                    streak, the links it opened on, the board and the
--                    opening hand. An object with a string `caseId`, or null.
--   linksOut         the links the close hands the next case (B2): an array.
--   relicOffer       the tools the close is offering: an array.
--   practiceWindows  how many of the run's windows were practice: a number.
--
-- Each is optional: a row from a build before them is taken as it was, and
-- the chain check counts its opening as not checked, never as broken.
--
-- 1. telemetry_check_session_row: `dynamics` may be 6,144 bytes as jsonb text
--    (was 2,048). An honest row measures at most about 1.5 KB and the largest
--    a run can make (every tool, the longest week stamp, eight mutations, the
--    links at their cap) 2.2 KB (tests/unit/case-open.test.mjs); the page sends
--    at most 4,096 bytes of JSON and drops the snapshot first
--    (payloadSchemas.fitCaseDynamics). The row's own cap (196,608 bytes) and
--    every other line are as 20261014000000 wrote them. The production
--    database was 13 MB of 500 MB on 10-21 (서버검증-설계안.md, question 9),
--    so a snapshot on every case row is room it has.
-- 2. playtest_sessions_dynamics_shape: the constraint as 20261021000000 left
--    it, line for line, plus the four lines above (a missing `caseId` is read
--    through coalesce: jsonb_typeof of nothing is null, and a check that comes
--    to null passes). Not valid, as before: rows
--    already stored are not read again.
--
-- check:grants replays it with every migration and holds it to its cases
-- (scripts/check-grants.mjs, "the case-open snapshot").

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
  end loop;
end;
$$;

revoke all on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) to service_role;

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
    )
  ) not valid;

notify pgrst, 'reload schema';
