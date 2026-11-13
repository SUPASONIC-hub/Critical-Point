-- B10 (2026-11-13, 금융 소재 기획 (c) c1, 결정 Q4 (1)): the crisis week's first
-- week in the server's copy of the calendar. The rule itself is the client's
-- (`crisis-week` in src/gauntlet/weeklyRules.js: the wall 3 closer, chips 1.2
-- times); the server needs only the row, as for every other week.
--
--   2026-W49 (11-30 ~ 12-06)  crisis-week
--
-- The user's answer (2026-11-13, 「전부 1」): applied, first week 2026-W49.
-- MERGED_WEEKS (src/gauntlet/weeklyCalendar.js) names the same week. Merged
-- by 2026-11-23 at the latest: the start screen announces a week the Monday before.

insert into public.weekly_rules (week, rule_id) values
  ('2026-W49', 'crisis-week')
on conflict (week) do update set rule_id = excluded.rule_id;
