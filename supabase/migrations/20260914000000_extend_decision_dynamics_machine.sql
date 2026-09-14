-- Extend the telemetry contract for the live pressure state machine.
-- These fields are privacy-safe: they describe timing, pressure and phase, not
-- the player's authored text or spoken choice.
alter table public.playtest_sessions
  add column if not exists dynamics jsonb;

alter table public.playtest_sessions
  drop constraint if exists playtest_sessions_dynamics_shape;

alter table public.playtest_sessions
  add constraint playtest_sessions_dynamics_shape
  check (
    dynamics is null
    or (
      jsonb_typeof(dynamics) = 'object'
      and jsonb_typeof(dynamics -> 'combo') = 'number'
      and jsonb_typeof(dynamics -> 'stressLevel') = 'number'
      and jsonb_typeof(dynamics -> 'timeDecay') = 'number'
      and (dynamics ? 'hiddenChoice')
      and jsonb_typeof(dynamics -> 'hiddenChoiceAge') = 'number'
      and jsonb_typeof(dynamics -> 'hesitationCharge') = 'number'
      and jsonb_typeof(dynamics -> 'responseTimeSec') = 'number'
      and jsonb_typeof(dynamics -> 'decisionPhase') = 'string'
      and jsonb_typeof(dynamics -> 'thresholdState') = 'string'
      and jsonb_typeof(dynamics -> 'environmentMode') = 'string'
      and jsonb_typeof(dynamics -> 'rewardMultiplier') = 'number'
      and jsonb_typeof(dynamics -> 'heartbeatBpm') = 'number'
      and jsonb_typeof(dynamics -> 'shakeIntensity') = 'number'
    )
  );

notify pgrst, 'reload schema';
