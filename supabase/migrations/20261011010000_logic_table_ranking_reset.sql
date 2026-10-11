-- 2026-10-11. The table stopped paying for a press timed to the beat and pays
-- a logic streak instead (the client of 2026-10-10 and 2026-10-11). Two things
-- follow here.
--
-- 1. The ranking starts over. A season's score was earned at the table, and a
--    score from the beat table does not compare with one from the logic-streak
--    table: the same hand banks a different pot on each. Same reset as the six
--    before it (20260916000000 to 20260923000000), the same statement and
--    nothing wider: only `season-final` rows are ranking rows, and per-case
--    telemetry -- the `final` case row of every run among it -- stays where it
--    is. The client's own ranking was emptied the same way, by a new storage
--    key. This is the one reset for the change of table.
--
--    What the delete does not do: a run whose case rows are all here can ask
--    for a ranking row again, since the row that answered "this run is ranked
--    already" is the row that went. The client sends a ranking row once, when
--    the finale closes, and never again once it has landed, so only a row
--    still waiting in a device's queue (it keeps a row seven days) or a
--    request written by hand comes back. Nothing here refuses those.
--
-- 2. `dynamics` carries the run summary (`createRunSummary`), and since those
--    two clients it has three keys the constraint did not know: `logicStreak`
--    and `bestLogic`, the streak the next window opens with and the longest of
--    the run, and `handVault`, the hand's share of the vault, which was
--    `grooveVault`. Each gets the line the keys it replaced had: optional, and
--    a number when present. The client writes all three through a normaliser
--    that can only produce a finite number, so no row either client sends is
--    refused by them.
--
--    `beatCombo`, `bestCombo` and `grooveVault` keep their lines. The client
--    no longer sends them, but a tab left open on an older build and a queue
--    filled by one still do, for as long as seven days, and a line that only
--    reads a key when it is there costs a newer row nothing.
--
--    Every other line is the one 20261007000000 wrote. NOT VALID, like the
--    constraint it replaces, so rows already written are not re-read, not
--    rewritten and not refused: a stored row is checked again only if it is
--    updated, and nothing updates a case row. Dropped first, so a replay ends
--    in the same place. Both statements change the catalog and scan nothing.

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
      and (not (dynamics ? 'relics') or (jsonb_typeof(dynamics -> 'relics') = 'array' and jsonb_array_length(dynamics -> 'relics') <= 16))
    )
  ) not valid;

notify pgrst, 'reload schema';
