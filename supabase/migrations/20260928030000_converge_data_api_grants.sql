-- Make the live grants and the replayed grants the same list.
--
-- 20260927000000 wrote down the grants a fresh database needs and called itself
-- a no-op on the live one. That was true of what it added, and it is exactly
-- the problem: the live database still holds everything Supabase granted
-- automatically before 2026-10-30. anon and authenticated can select, update,
-- delete and truncate `playtest_feedback`, `app_error_logs` and
-- `free_text_analyses`, and update and delete `playtest_sessions`. RLS happens
-- to have no policy for those commands, so today they return nothing -- but the
-- privilege is one careless `create policy` away from being real, and
-- `npm run check:grants` can only prove what a replay has, which is not that.
--
-- So every table the Data API can reach starts from nothing for both client
-- roles, on both databases, and gets back only what the client sends or reads:
--
--   playtest_sessions   insert: the columns `src/telemetry.js` posts. Not
--                       `id`, `score`, `run_tag` (identity/generated). The
--                       client still sends `completed_at`, so it keeps an
--                       insert grant -- a missing grant is a 42501 on every
--                       case row, including the ones already queued in
--                       players' browsers -- but the trigger overwrites it
--                       with now() (20260928000000). Revoke it once no client
--                       sends it.
--                       select: what the ranking shows, and nothing that ties
--                       a row to a device -- `run_id` and `session_code` are
--                       no longer readable; `run_tag` and `score` are.
--   playtest_feedback   insert: event_id, session_id, session_code, case_id,
--                       feedback. `created_at` is the server's.
--   app_error_logs      insert: the columns an error report carries.
--   board_posts         select/insert as in 20260923010000; `actor_key` is
--                       never granted.
--   free_text_analyses  nothing. `saveAnalysisTelemetry` had no caller left
--                       when the free-input card was replaced, so the table
--                       stopped receiving rows; its insert policy goes too.
--                       The table and its rows stay (service_role only) until
--                       someone decides they are not worth keeping -- a drop
--                       cannot be undone and a revoke can.
--   cloud_saves,
--   telemetry_rate_limits  nothing; reached only through definer functions.
--
-- `authenticated` gets nothing anywhere: the app has no sign-in.

revoke all on table
  public.playtest_sessions,
  public.playtest_feedback,
  public.app_error_logs,
  public.free_text_analyses,
  public.board_posts,
  public.cloud_saves,
  public.telemetry_rate_limits,
  public.public_rankings,
  public.telemetry_health
from anon, authenticated;

grant insert (
  event_id, session_id, run_id, session_code, player_name, case_id, case_title,
  completed_at, summary, resources, triggers, cognition, decision_log, dynamics
) on public.playtest_sessions to anon;
grant select (
  run_tag, player_name, case_id, case_title, completed_at, summary, score
) on public.playtest_sessions to anon;

grant insert (event_id, session_id, session_code, case_id, feedback)
  on public.playtest_feedback to anon;

grant insert (
  event_id, session_id, session_code, occurred_at, source, current_case, node_id,
  error_name, error_message, error_stack, component_stack, dom_snapshot,
  viewport, context, error
) on public.app_error_logs to anon;

grant select (id, nickname, body, created_at) on public.board_posts to anon;
grant insert (event_id, session_id, nickname, body) on public.board_posts to anon;

grant select on public.public_rankings to anon;
grant select on public.telemetry_health to anon;

drop policy if exists "public can insert free text analyses" on public.free_text_analyses;

-- Identity columns draw from their sequence without a privilege check, so the
-- client roles need no sequence grants either.
revoke all on all sequences in schema public from anon, authenticated;

-- service_role keeps everything (20260927000000); the views need it spelled out.
grant select on public.public_rankings to service_role;
grant select on public.telemetry_health to service_role;

notify pgrst, 'reload schema';
