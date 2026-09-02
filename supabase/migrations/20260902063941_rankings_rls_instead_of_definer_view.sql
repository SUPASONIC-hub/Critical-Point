-- Move the ranking exposure rules from the view definition onto the table, so
-- public_rankings can go back to security_invoker and stop tripping the
-- "Security Definer View" advisor.
--
-- The previous migration made public_rankings a definer view because anon has
-- no SELECT on playtest_sessions. That worked, but it put the entire security
-- boundary in the view body: the row filter, the column list, and the implicit
-- RLS bypass. Anything else that ever reads the table would need its own copy
-- of those rules.
--
-- Instead the row filter becomes an RLS policy and the column filter becomes a
-- column-level grant. Both travel with the table, so they apply to the view and
-- to any future reader. The exposed data is unchanged: completed season rows,
-- and never decision_log, session_id or the surrogate id.

-- Row filter. Mirrors the view's WHERE clause, including the burst score guard
-- that keeps malformed summaries out of the public ranking.
drop policy if exists "public can read completed season rankings" on public.playtest_sessions;
create policy "public can read completed season rankings" on public.playtest_sessions
for select to anon
using (
  case_id = 'season-final'
  and summary->>'seasonComplete' = 'true'
  and summary->>'burstScore' ~ '^[0-9]+([.][0-9]+)?$'
  and (summary->>'burstScore')::numeric between 0 and 100
);

-- Column filter. A column-level grant leaves decision_log, session_id and id
-- unreadable, so `select *` on the raw table is still refused for anon.
grant select (
  run_id,
  session_code,
  player_name,
  case_id,
  case_title,
  completed_at,
  summary
) on public.playtest_sessions to anon;

alter view public.public_rankings set (security_invoker = true);

notify pgrst, 'reload schema';
