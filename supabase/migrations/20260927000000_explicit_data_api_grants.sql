-- Say out loud the table grants the Data API has been handing out on its own.
--
-- Until 2026-10-30 Supabase grants anon, authenticated and service_role every
-- privilege on a table the moment it is created in `public`. After that date
-- it stops: a table created by a migration gets nothing unless the migration
-- grants it. The live database keeps what it already has, so nothing there
-- moves -- but a `supabase db reset`, a preview branch or a new project replays
-- these migrations from scratch, and four telemetry tables would come up with
-- an insert policy for anon and no insert privilege to go with it. The policy
-- would never be consulted; every write would be refused with 42501, and the
-- telemetry queue swallows failures, so nobody would notice.
--
-- The grants are the smallest the client needs, not the blanket
-- select/insert/update/delete the notice suggests: these tables are write-only
-- for anon by design (`insertRow` in `src/telemetry.js` posts with
-- `return=minimal`), and granting select would leave RLS as the only thing
-- between a player and every other player's rows.
--
-- Every statement is a no-op against the live database, where the automatic
-- grants already cover it.

grant insert on public.playtest_sessions to anon;
grant insert on public.playtest_feedback to anon;
grant insert on public.app_error_logs to anon;
grant insert on public.free_text_analyses to anon;

-- The service role is how a human moderates (`board_posts.hidden`) and how
-- retention runs. It bypasses RLS but not grants, so it needs them spelled out
-- like everyone else. `authenticated` gets nothing: the app has no sign-in.
grant all on public.playtest_sessions to service_role;
grant all on public.playtest_feedback to service_role;
grant all on public.app_error_logs to service_role;
grant all on public.free_text_analyses to service_role;
grant all on public.board_posts to service_role;
grant all on public.cloud_saves to service_role;
grant all on public.telemetry_rate_limits to service_role;

notify pgrst, 'reload schema';
