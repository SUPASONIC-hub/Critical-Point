-- The test week moves from 2026-W44 to 2026-W47 (Monday 2026-11-16 to Sunday
-- 2026-11-22, Korean time): the user, 2026-10-22, so the improvements waiting
-- in drafts are live first and the audit and the links are tested on top of
-- them. W44 (10-26 to 11-01) is an ordinary week again; W46's `near-wall` is
-- not touched. The client's calendar (src/gauntlet/weeklyCalendar.js) moves
-- the same row in the same pull request.
--
-- Merging applies it within a minute, before the client is deployed. W44 has
-- not begun (this has to be merged before Monday 2026-10-26 00:00 KST), so no
-- run is judged by the row taken out: `ranking_run_week` reads this table
-- only for a run that carries a stamp, and the deployed client stamps
-- `audit-cascade` only from W44's Monday. No function reads the week by name,
-- so none is restated.
-- tests/unit/weekly-rules.test.mjs replays the three files' rows in order
-- and check:grants holds the table PGlite builds from them to the client's
-- calendar.

delete from public.weekly_rules where week = '2026-W44';

insert into public.weekly_rules (week, rule_id) values
  ('2026-W47', 'audit-cascade')
on conflict (week) do update set rule_id = excluded.rule_id;
