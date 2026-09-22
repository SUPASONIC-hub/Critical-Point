-- The ranking starts over for the fifty-case season.
--
-- 사건 25-49 made the season fifty cases, so completed-season rows from the
-- twenty-five-case season are ranked against a length no run can now have.
-- Same reset as the three before it: only `season-final` rows are ranking
-- rows; per-case telemetry stays.
delete from public.playtest_sessions where case_id = 'season-final';

notify pgrst, 'reload schema';
