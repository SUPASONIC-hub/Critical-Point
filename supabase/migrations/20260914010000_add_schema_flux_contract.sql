-- First gauntlet-loop pass: persist the consequence fracture axes that make a
-- reckless decision change the next turn's operating schema.
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
      and jsonb_typeof(dynamics -> 'schemaFlux') = 'number'
      and jsonb_typeof(dynamics -> 'consequenceStack') = 'number'
      and jsonb_typeof(dynamics -> 'fractureTurns') = 'number'
      and jsonb_typeof(dynamics -> 'thresholdState') = 'string'
      and jsonb_typeof(dynamics -> 'environmentMode') = 'string'
      and jsonb_typeof(dynamics -> 'rewardMultiplier') = 'number'
      and jsonb_typeof(dynamics -> 'heartbeatBpm') = 'number'
      and jsonb_typeof(dynamics -> 'shakeIntensity') = 'number'
    )
  );

notify pgrst, 'reload schema';
