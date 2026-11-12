-- N9 (2026-11-12, 결정 (1)): the weekly calendar carried on from 2027-W05 to
-- 2027-W15, one week in two an event week, the three event rules in turn
-- after 2027-W03's short-clock. Six more rows in the server's copy of the
-- calendar, the client's MERGED_WEEKS (src/gauntlet/weeklyCalendar.js);
-- nothing else changes.
--
--   2027-W05 (02-01 ~ 02-07)  near-wall
--   2027-W07 (02-15 ~ 02-21)  heavy-fracture
--   2027-W09 (03-01 ~ 03-07)  short-clock
--   2027-W11 (03-15 ~ 03-21)  near-wall
--   2027-W13 (03-29 ~ 04-04)  heavy-fracture
--   2027-W15 (04-12 ~ 04-18)  short-clock
--
-- Merge at least seven days before W05 (by 2027-01-25): the start screen
-- announces a week the Monday before. tests/unit/weekly-rules.test.mjs reads
-- the pairs below with the earlier files', and check:grants holds the table
-- PGlite builds from all of them to the client's calendar.

insert into public.weekly_rules (week, rule_id) values
  ('2027-W05', 'near-wall'),
  ('2027-W07', 'heavy-fracture'),
  ('2027-W09', 'short-clock'),
  ('2027-W11', 'near-wall'),
  ('2027-W13', 'heavy-fracture'),
  ('2027-W15', 'short-clock')
on conflict (week) do update set rule_id = excluded.rule_id;
