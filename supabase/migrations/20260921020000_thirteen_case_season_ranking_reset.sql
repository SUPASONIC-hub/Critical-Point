-- The ranking starts over for the thirteen-case season.
--
-- 사건 12 made the season thirteen cases, so completed-season rows from the
-- twelve-case season are ranked against a length no run can now have. Same
-- reset as 20260916000000 and 20260921010000: only `season-final` rows are
-- ranking rows; per-case telemetry stays.
delete from public.playtest_sessions where case_id = 'season-final';

notify pgrst, 'reload schema';
