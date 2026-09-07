-- Keep operational telemetry bounded without exposing delete access to clients.
-- Schedule this function from Supabase Cron or an external scheduler.
create or replace function public.purge_old_telemetry(retention interval default interval '180 days')
returns table (sessions_deleted bigint, feedback_deleted bigint, errors_deleted bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  cutoff timestamptz;
begin
  if retention < interval '30 days' then
    raise exception 'telemetry retention must be at least 30 days';
  end if;

  cutoff := now() - retention;

  delete from public.playtest_sessions where completed_at < cutoff;
  get diagnostics sessions_deleted = row_count;
  delete from public.playtest_feedback where created_at < cutoff;
  get diagnostics feedback_deleted = row_count;
  delete from public.app_error_logs where created_at < cutoff;
  get diagnostics errors_deleted = row_count;

  return next;
end;
$$;

revoke all on function public.purge_old_telemetry(interval) from public, anon, authenticated;
