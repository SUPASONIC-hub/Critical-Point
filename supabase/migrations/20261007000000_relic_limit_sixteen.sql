-- Relics: a run summary may carry sixteen, where it could carry nine.
--
-- 20260915010000 typed `dynamics.relics` and capped the array at 9, when the
-- table had nine relics. It has twelve now (src/gauntlet/relics.js, five to
-- start with and seven to unlock), a closed case drafts one, and nothing on
-- the client stops a season at nine. So a run holding its tenth sent a case
-- row this constraint refused with 23514, which PostgREST answers 400 and the
-- telemetry queue reads as "the server will never take this row": every case
-- row from there to the finale was dropped, and a run missing a case row
-- cannot rank. The audit of 2026-10-07 found it by reading both sides; how
-- many runs reached ten was not measured.
--
-- Sixteen rather than twelve, so the next relics added do not bring this back
-- the day they ship: `scripts/check-grants.mjs` holds RELIC_IDS.length to this
-- number and sends a row carrying every relic the client has. The other limit
-- on the same value is the 2,048 bytes `dynamics` may weigh (20260929010000);
-- sixteen ids of this length are about 200.
--
-- The change only loosens. A migration is applied on merge, before the client
-- that was written with it is deployed, and every row the client of either
-- side sends today still passes. Every other line of the constraint is the one
-- 20260915010000 wrote. NOT VALID, like the constraint it replaces, so rows
-- already written are not re-read; and dropped first, so a replay ends in the
-- same place.
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
      and (not (dynamics ? 'relics') or (jsonb_typeof(dynamics -> 'relics') = 'array' and jsonb_array_length(dynamics -> 'relics') <= 16))
    )
  ) not valid;

notify pgrst, 'reload schema';
