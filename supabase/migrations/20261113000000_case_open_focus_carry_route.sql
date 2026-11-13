-- DRAFT (2026-11-12, branch f1-stage2), kept as `.sql.draft` so nothing
-- applies it: merging a `.sql` to main applies it to the production database
-- within a minute, before the client deploys. The user is asked once, after
-- #466's 20261112000000_ranking_reset_rules_mark4_relic_draft is applied;
-- then this file is renamed to `.sql` (re-dated only if a migration newer
-- than 20261113000000 is on main by then) and check:grants replays it
-- (scripts/check-grants.mjs, "the case-open snapshot's carry and route").
--
-- F1 step 2 (설계-남은-우선항목-20261111, F1-2 (1)): the case-open snapshot
-- (`dynamics.open`, 20261026000000) gains the two records the chain check
-- (src/chainRecheck.js UNCHECKED.between) has counted as not checked on every
-- link:
--
--   open.focusCarry    what LOCK left on the board the case opened on
--                      (gauntletEngine `normalizeFocusCarry`): `rebooted`,
--                      true or false, and `stance`, null or the stance carry
--                      the board before held (strikeWake, steadyLine,
--                      exposedHand). An object, or null.
--   open.openingRoute  the route the case opened on (caseRoutes.js
--                      `describeCaseOpening`, gauntletEngine
--                      `normalizeOpeningRoute`): `after`, the case before's
--                      outcome choice or null; `rank`, its rank or null; and
--                      `nodeId`, the scene. An object, or null.
--
-- Each is optional: a row from a build before them is taken as it was, and
-- the check counts them as not checked, never as broken. Together they add
-- under 120 bytes to a row (tests/unit/case-open.test.mjs measures it), well
-- inside the 6,144 bytes `telemetry_check_session_row` takes, so that
-- function is not touched.
--
-- `playtest_sessions_dynamics_shape`: the constraint as 20261112000000 (#466)
-- leaves it, line for line, plus the two blocks marked F1 step 2. Each reads
-- only a snapshot that is an object (the line before already refuses one that
-- is neither an object nor null). Not valid, as before: rows already stored
-- are not read again (tests/unit/case-open-records.test.mjs holds the lines
-- to #466's). Nothing is granted or revoked: no table, function or view is
-- created.

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
      -- F1 step 2: the opening snapshot's two records, each optional, read only on a snapshot that is an object.
      and (coalesce(jsonb_typeof(dynamics -> 'open'), 'none') <> 'object'
           or not (dynamics -> 'open' ? 'focusCarry')
           or jsonb_typeof(dynamics -> 'open' -> 'focusCarry') = 'null'
           or (jsonb_typeof(dynamics -> 'open' -> 'focusCarry') = 'object'
               and coalesce(jsonb_typeof(dynamics -> 'open' -> 'focusCarry' -> 'rebooted'), 'none') = 'boolean'
               and coalesce(jsonb_typeof(dynamics -> 'open' -> 'focusCarry' -> 'stance'), 'null') in ('null', 'string')
               and length(coalesce(dynamics -> 'open' -> 'focusCarry' ->> 'stance', '')) <= 32))
      and (coalesce(jsonb_typeof(dynamics -> 'open'), 'none') <> 'object'
           or not (dynamics -> 'open' ? 'openingRoute')
           or jsonb_typeof(dynamics -> 'open' -> 'openingRoute') = 'null'
           or (jsonb_typeof(dynamics -> 'open' -> 'openingRoute') = 'object'
               and coalesce(jsonb_typeof(dynamics -> 'open' -> 'openingRoute' -> 'nodeId'), 'none') = 'string'
               and length(dynamics -> 'open' -> 'openingRoute' ->> 'nodeId') <= 64
               and coalesce(jsonb_typeof(dynamics -> 'open' -> 'openingRoute' -> 'after'), 'null') in ('null', 'string')
               and length(coalesce(dynamics -> 'open' -> 'openingRoute' ->> 'after', '')) <= 64
               and coalesce(jsonb_typeof(dynamics -> 'open' -> 'openingRoute' -> 'rank'), 'null') in ('null', 'string')
               and length(coalesce(dynamics -> 'open' -> 'openingRoute' ->> 'rank', '')) <= 8))
    )
  ) not valid;

notify pgrst, 'reload schema';
