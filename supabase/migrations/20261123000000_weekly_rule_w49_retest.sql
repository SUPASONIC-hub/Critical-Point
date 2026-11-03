-- P5 of the 11-23 verdict (W44-판정기준 ②): the test week once more, the
-- audit and the links together, in 2026-W49 (11-30 ~ 12-06). One more row in
-- the server's copy of the calendar, the client's MERGED_WEEKS
-- (src/gauntlet/weeklyCalendar.js); nothing else changes. W48 (11-23 ~ 11-29)
-- heavy-fracture and W50 (12-07 ~ 12-13) short-clock (20261023010000) stay as
-- they are: W49 was the free week between them.
--
--   2026-W49 (11-30 ~ 12-06)  audit-cascade
--
-- Dated the day it is merged, 2026-11-23, and merged only if the verdict is
-- P5: merging applies it within a minute. `audit-cascade` is in the deployed
-- catalogue since W47, so a season stamped with it in those minutes is
-- judged the way the client will judge it, and W49 has not begun. The start
-- screen announces a week the Monday before, so 11-23 is the last day it can
-- go in. `ranking_run_week` reads this table only for a run that carries a
-- stamp. tests/unit/weekly-rules.test.mjs reads the pair below with the
-- earlier files', and check:grants holds the table PGlite builds from all of
-- them to the client's calendar.

insert into public.weekly_rules (week, rule_id) values
  ('2026-W49', 'audit-cascade')
on conflict (week) do update set rule_id = excluded.rule_id;
