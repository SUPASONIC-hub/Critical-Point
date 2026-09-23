-- The 프롤로그 puts five cases in front of 사건 01, and they need two things
-- from the database.
--
-- 1. Their ids have to be accepted. `is_season_case_id` was written when every
--    case was `caseNN`, so `prologue01` is rejected by the telemetry trigger,
--    by the cloud-save insert and by the anon read policies -- the first five
--    cases of a run would have been silently unrecordable. The predicate now
--    also matches `prologue[0-9]{2}`. Nothing else about it changes: `final`
--    and `season-final` keep their places, and `season-final` still only counts
--    where the caller allows it.
--
-- 2. The ranking starts over. The season grew from fifty cases to fifty-five,
--    so every completed-season row was scored against a length no run can have
--    any more. Same reset as the five before it: only `season-final` rows are
--    ranking rows, and per-case telemetry stays where it is.

create or replace function public.is_season_case_id(p_case_id text, p_allow_season boolean)
returns boolean
language sql
immutable
as $$
  select p_case_id ~ '^case[0-9]{2}$'
    or p_case_id ~ '^prologue[0-9]{2}$'
    or p_case_id = 'final'
    or (p_allow_season and p_case_id = 'season-final');
$$;

delete from public.playtest_sessions where case_id = 'season-final';

notify pgrst, 'reload schema';
