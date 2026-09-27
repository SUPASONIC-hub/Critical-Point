-- Retention that covers every table and actually runs.
--
-- `purge_old_telemetry` (20260923010000) deleted from four tables and skipped
-- three: `free_text_analyses`, `cloud_saves` and `telemetry_rate_limits` grew
-- forever. It filtered on timestamps the client wrote, so a row dated
-- 'infinity' was never old enough. And nothing called it -- the comment said
-- "schedule this from Supabase Cron", and no migration did.
--
-- Now:
--   * every table is covered; cloud saves by `updated_at` (the last upload, not
--     the save's own claimed time), rate-limit rows one day after their window
--     opened, whatever `retention` says -- they are only counters;
--   * the timestamps are the server's since 20260928000000, and rows written
--     before that with a date more than a day ahead are deleted as well, since
--     they could otherwise never age out;
--   * the filtered columns are indexed;
--   * a daily pg_cron job calls it, when pg_cron can be enabled.
--
-- The returned row gains three counts, which changes its type, so the function
-- is dropped first (42P13 otherwise). The argument list is unchanged.

create index if not exists playtest_sessions_completed_at_idx on public.playtest_sessions (completed_at);
create index if not exists playtest_feedback_created_at_idx on public.playtest_feedback (created_at);
create index if not exists app_error_logs_created_at_idx on public.app_error_logs (created_at);
create index if not exists free_text_analyses_created_at_idx on public.free_text_analyses (created_at);
create index if not exists board_posts_created_at_idx on public.board_posts (created_at);
create index if not exists telemetry_rate_limits_window_idx on public.telemetry_rate_limits (window_started_at);

drop function if exists public.purge_old_telemetry(interval);

create function public.purge_old_telemetry(retention interval default interval '180 days')
returns table (
  sessions_deleted bigint,
  feedback_deleted bigint,
  errors_deleted bigint,
  board_posts_deleted bigint,
  analyses_deleted bigint,
  cloud_saves_deleted bigint,
  rate_limits_deleted bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cutoff timestamptz;
  v_future timestamptz := now() + interval '1 day';
begin
  if retention < interval '30 days' then
    raise exception 'telemetry retention must be at least 30 days';
  end if;
  v_cutoff := now() - retention;

  delete from public.playtest_sessions where completed_at < v_cutoff or completed_at > v_future;
  get diagnostics sessions_deleted = row_count;

  delete from public.playtest_feedback where created_at < v_cutoff or created_at > v_future;
  get diagnostics feedback_deleted = row_count;

  delete from public.app_error_logs where created_at < v_cutoff or created_at > v_future;
  get diagnostics errors_deleted = row_count;

  delete from public.board_posts where created_at < v_cutoff or created_at > v_future;
  get diagnostics board_posts_deleted = row_count;

  delete from public.free_text_analyses where created_at < v_cutoff or created_at > v_future;
  get diagnostics analyses_deleted = row_count;

  delete from public.cloud_saves where updated_at < v_cutoff;
  get diagnostics cloud_saves_deleted = row_count;

  delete from public.telemetry_rate_limits where window_started_at < now() - interval '1 day';
  get diagnostics rate_limits_deleted = row_count;

  return next;
end;
$$;

revoke all on function public.purge_old_telemetry(interval) from public, anon, authenticated;
grant execute on function public.purge_old_telemetry(interval) to service_role;

-- The schedule. On Supabase, pg_cron is available but has to be enabled; this
-- tries, and if it cannot (no permission, or a Postgres without the extension --
-- PGlite in `npm run check:grants`, a plain local Postgres) it says so and
-- moves on rather than failing the migration. `cron.schedule` with a job name
-- replaces a job of the same name, so re-running this is harmless. Check with
--   select jobname, schedule, command, active from cron.job;
do $do$
begin
  begin
    create extension if not exists pg_cron with schema pg_catalog;
  exception when others then
    raise notice 'pg_cron unavailable (%); purge_old_telemetry is not scheduled', sqlerrm;
  end;
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    execute $sql$select cron.schedule('purge-old-telemetry', '17 4 * * *', 'select public.purge_old_telemetry()')$sql$;
  end if;
end;
$do$;
