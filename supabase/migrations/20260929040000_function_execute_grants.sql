-- Functions get the treatment tables got in 20260928030000: nothing is
-- executable by a client role unless it is written down here.
--
-- A function created in `public` is executable by PUBLIC, and on Supabase by
-- anon and authenticated by name as well, so every helper the board's trigger
-- calls was also an RPC: `/rest/v1/rpc/board_text_has_link` answers anyone, at
-- no cost to any budget -- an oracle for what the filter lets through, and a
-- regex run over request-sized input for free. The triggers that call these
-- helpers are SECURITY DEFINER, so they run as the owner and need no grant
-- from the caller.
--
-- What anon keeps, and why:
--   is_season_case_id   the insert policies on the telemetry tables call it,
--                       and a policy runs as the role making the request.
--   put_cloud_save, get_cloud_save, peek_cloud_save, delete_cloud_save
--                       the client's cloud-save RPCs (20260929030000).
--
-- `npm run check:grants` holds the rule itself -- no function in `public` is
-- executable by anon or authenticated unless it is on that list -- so a helper
-- added later cannot be left open by forgetting a revoke.

revoke all on function public.clean_board_text(text) from public, anon, authenticated;
revoke all on function public.board_visible_length(text) from public, anon, authenticated;
revoke all on function public.board_text_has_link(text) from public, anon, authenticated;
revoke all on function public.board_text_has_contact(text) from public, anon, authenticated;
revoke all on function public.season_case_ids() from public, anon, authenticated;
grant execute on function public.clean_board_text(text) to service_role;
grant execute on function public.board_visible_length(text) to service_role;
grant execute on function public.board_text_has_link(text) to service_role;
grant execute on function public.board_text_has_contact(text) to service_role;
grant execute on function public.season_case_ids() to service_role;

revoke all on function public.is_season_case_id(text, boolean) from public, authenticated;
grant execute on function public.is_season_case_id(text, boolean) to anon, service_role;

-- Already revoked where they were defined; repeated so this file is the whole
-- list and a replay that reorders nothing still ends in the same place.
revoke all on function public.validate_telemetry_insert() from public, anon, authenticated;
revoke all on function public.validate_board_post_insert() from public, anon, authenticated;
revoke all on function public.bump_rate_limit(text, interval, integer) from public, anon, authenticated;
revoke all on function public.purge_old_telemetry(interval) from public, anon, authenticated;
revoke all on function public.moderate_board_post(bigint, boolean) from public, anon, authenticated;
grant execute on function public.bump_rate_limit(text, interval, integer) to service_role;

-- There is no default to change for the next function: EXECUTE for PUBLIC is a
-- global default, and a per-schema `alter default privileges` cannot take a
-- global one away. A new function carries its own revoke, and `npm run check:grants`
-- is what notices when it does not.

notify pgrst, 'reload schema';
