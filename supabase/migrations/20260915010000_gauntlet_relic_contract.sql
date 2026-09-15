-- Relics: the run summary in telemetry `dynamics` now carries the relics the
-- season drafted, as an array of relic ids. Typed when present and not
-- required, so a client on an earlier bundle keeps writing; the required keys
-- and the tempo keys from the previous contract are unchanged. NOT VALID, like
-- the constraint it replaces, so rows already written are not re-read.
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
      and (not (dynamics ? 'relics') or (jsonb_typeof(dynamics -> 'relics') = 'array' and jsonb_array_length(dynamics -> 'relics') <= 9))
    )
  ) not valid;

notify pgrst, 'reload schema';
