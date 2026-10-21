-- 2026-W44 (Monday 2026-10-26 to Sunday 2026-11-01, Korean time): B3's and
-- B2's test week, the audit and the links on one table (user, 2026-10-21).
-- One more row in the server's copy of the calendar, the client's
-- W44's `audit-cascade` (src/gauntlet/weeklyCalendar.js); nothing
-- else changes.
--
-- Merging applies it within a minute, before the client that knows the rule
-- is deployed. In those minutes no season can carry the stamp (the deployed
-- client's catalogue has no `audit-cascade`, and normalizeWeekRuleId drops an
-- id it does not know), and W44 has not begun, so no run is judged by it.
-- The ordinary ranking (`week` null) and W46's row are not touched:
-- `ranking_run_week` reads this table only for a run that carries a stamp,
-- and returns the week of that run's first case row as before.
-- tests/unit/weekly-rules.test.mjs reads the pairs below with the ones of
-- 20261021000000, and check:grants holds the table PGlite builds from both
-- to the client's calendar.

insert into public.weekly_rules (week, rule_id) values
  ('2026-W44', 'audit-cascade')
on conflict (week) do update set rule_id = excluded.rule_id;
