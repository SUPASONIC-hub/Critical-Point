-- 초안 (2026-11-16, 사용자 확인 전): the weekly calendar carried on from
-- 2027-W17 to 2027-W26, one week in two an event week as in W05 ~ W15
-- (20261115000000). The three event rules go on in turn after 2027-W15's
-- short-clock, and the two catalogue devices merged in #555 (B4 idle-erosion,
-- c2 market-shock) get one week each, in the rotation's slots, so neither
-- sits beside another rule's week. Five more rows in the server's copy of
-- the calendar, the client's MERGED_WEEKS (src/gauntlet/weeklyCalendar.js);
-- nothing else changes. The rules themselves are the client's; the server
-- needs only the rows, as for crisis-week (20261116000000).
--
--   2027-W17 (04-26 ~ 05-02)  near-wall
--   2027-W19 (05-10 ~ 05-16)  idle-erosion
--   2027-W21 (05-24 ~ 05-30)  heavy-fracture
--   2027-W23 (06-07 ~ 06-13)  short-clock
--   2027-W25 (06-21 ~ 06-27)  market-shock
--   (2027-W26, 06-28 ~ 07-04, an ordinary week)
--
-- Merged in the migration bundle after the user's answer, and at least seven
-- days before W17 (by 2027-04-19): the start screen announces a week the
-- Monday before. tests/unit/weekly-rules.test.mjs reads the pairs below with
-- the earlier files', and check:grants holds the table PGlite builds from all
-- of them to the client's calendar.

insert into public.weekly_rules (week, rule_id) values
  ('2027-W17', 'near-wall'),
  ('2027-W19', 'idle-erosion'),
  ('2027-W21', 'heavy-fracture'),
  ('2027-W23', 'short-clock'),
  ('2027-W25', 'market-shock')
on conflict (week) do update set rule_id = excluded.rule_id;
