-- Persist the pre-click push forecast so telemetry can prove that the danger was
-- visible before the player chose to raise the pot.
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
      and jsonb_typeof(dynamics -> 'nextPushMinStress') = 'number'
      and jsonb_typeof(dynamics -> 'nextPushMaxStress') = 'number'
      and jsonb_typeof(dynamics -> 'nextPushBustChance') = 'number'
      and jsonb_typeof(dynamics -> 'nextPushRisk') = 'string'
      and jsonb_typeof(dynamics -> 'thresholdState') = 'string'
      and jsonb_typeof(dynamics -> 'environmentMode') = 'string'
      and jsonb_typeof(dynamics -> 'rewardMultiplier') = 'number'
      and jsonb_typeof(dynamics -> 'heartbeatBpm') = 'number'
      and jsonb_typeof(dynamics -> 'shakeIntensity') = 'number'
    )
  );

notify pgrst, 'reload schema';
