-- Store the privacy-safe pressure loop alongside the existing case telemetry.
-- The column is nullable so older clients and queued events remain valid.
alter table public.playtest_sessions
  add column if not exists dynamics jsonb;

alter table public.playtest_sessions
  add constraint playtest_sessions_dynamics_shape
  check (
    dynamics is null
    or (
      jsonb_typeof(dynamics) = 'object'
      and (dynamics ? 'combo')
      and (dynamics ? 'stressLevel')
      and (dynamics ? 'timeDecay')
      and (dynamics ? 'hiddenChoice')
    )
  );

notify pgrst, 'reload schema';
