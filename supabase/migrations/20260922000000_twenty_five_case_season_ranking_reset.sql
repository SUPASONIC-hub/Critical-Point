-- The ranking starts over for the twenty-five-case season.
--
-- 사건 13-24 made the season twenty-five cases, so completed-season rows from
-- the thirteen-case season are ranked against a length no run can now have.
-- Same reset as 20260916000000, 20260921010000 and 20260921020000: only
-- `season-final` rows are ranking rows; per-case telemetry stays.
delete from public.playtest_sessions where case_id = 'season-final';

notify pgrst, 'reload schema';
