-- E-9 (a): the weekly calendar booked from 2026-W47 to 2027-W03 in one
-- merge, one week in two an event week (사용자 확인 후보). Five more rows in
-- the server's copy of the calendar, the client's MERGED_WEEKS
-- (src/gauntlet/weeklyCalendar.js); nothing else changes. W47 stays open for
-- a second test week should the 11-02 ruling ask for one.
--
--   2026-W48 (11-23 ~ 11-29)  heavy-fracture
--   2026-W50 (12-07 ~ 12-13)  short-clock     (new: clock -8 s, chips x1.25)
--   2026-W52 (12-21 ~ 12-27)  near-wall
--   2027-W01 (01-04 ~ 01-10)  heavy-fracture  (2026 has a W53, 12-28 ~ 01-03)
--   2027-W03 (01-18 ~ 01-24)  short-clock
--
-- Dated after 11-02 (W44's code freeze; 20261102000000-030000 are other
-- drafts'). Merging applies it within a minute, before the client that knows
-- `short-clock` is deployed; in those minutes no season can carry that stamp
-- (the deployed catalogue drops an id it does not know) and none of these
-- weeks has begun, so no run is judged by it. Merge at least seven days
-- before W48 (by 11-16): the start screen announces a week the Monday before.
-- `ranking_run_week` reads this table only for a run that carries a stamp.
-- tests/unit/weekly-rules.test.mjs reads the pairs below with the earlier
-- files', and check:grants holds the table PGlite builds from all of them to
-- the client's calendar.

insert into public.weekly_rules (week, rule_id) values
  ('2026-W48', 'heavy-fracture'),
  ('2026-W50', 'short-clock'),
  ('2026-W52', 'near-wall'),
  ('2027-W01', 'heavy-fracture'),
  ('2027-W03', 'short-clock')
on conflict (week) do update set rule_id = excluded.rule_id;
