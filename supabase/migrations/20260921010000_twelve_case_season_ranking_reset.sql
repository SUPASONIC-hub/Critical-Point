-- The ranking starts over for the twelve-case season.
--
-- 사건 11 made the season twelve cases. Completed-season rows were played on
-- the eleven-case season and ranked against a length no run can now have, so
-- they are removed the same way the five-case rows were when the season became
-- ten (20260916000000). Only `season-final` rows are ranking rows; per-case
-- telemetry stays.
delete from public.playtest_sessions where case_id = 'season-final';

notify pgrst, 'reload schema';
