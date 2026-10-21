-- Written 2026-10-21 on branch f1-stage2 (draft PR #216), first as a
-- .sql.draft and renamed once its check:grants cases passed. Merging it applies
-- it to the production database within a minute, before the client deploys;
-- that waits for the user after 11-02 (서버검증-설계안.md, the 10-21 answers 5
-- and 6), together with the CI job that calls it (verify-ranking.yml).
--
-- Server checks, phase 2: the checker's marks.
--
-- scripts/verify-ranking-rows.mjs works a ranking run out again off the page
-- (src/rankingRecheck.js) and names at most three marks for its ranking row:
--
--   score-off-log       the final case's summary does not hold the score
--                       its own decision log earns, or the ranking row's
--                       score differs from the final case row's.
--   window-off-replay   a logged window does not replay to what the log
--                       says it closed on, its record does not hold
--                       together, a sealed card was cashed below its seal, a
--                       response time is off the window clock, or its seed is
--                       not the one the page deals at that place (a wall picked).
--   window-no-replay    a window left no record in a run whose build writes
--                       them (from the run's first recorded case on).
--
-- They go into the `suspicion` column of 20261020000000 beside the insert
-- trigger's marks: a mark, never a refusal, and the ranking shows marked rows
-- unless `ranking_hide_marked` is set (decision 2 (1)). Only the service role
-- may call this; the checker holds that key in CI, never the page.
--
-- Each call states the run's recheck marks whole: the three marks above are
-- replaced by `p_marks` and every other mark is kept, so a run checked again
-- after a fix to the checker loses a mark it no longer earns.
--
-- Checked and clean is not the same as not checked: both leave `suspicion`
-- without the checker's marks. So the ranking row also gets `rechecked_at`,
-- the time the checker last replayed the run whole (`p_replayed`): a run from
-- a build before the record has its scores read and its marks stated, and its
-- `rechecked_at` stays null. A row with `rechecked_at` and no marks is the one
-- a reward that needs a checked season (D2) may read. Not granted to anon or
-- authenticated, like `suspicion`; the insert trigger never sets it.
--
-- Nothing refuses the update (checked 2026-10-21 against every migration):
-- the three triggers on playtest_sessions fire before insert only
-- (validate_playtest_session_insert, zz_charge_address_bytes,
-- zm_mark_season_suspicion), RLS is on but not forced, and a SECURITY DEFINER
-- function runs as the table's owner; update is granted to service_role alone
-- (20260927000000), anon holds column grants for insert and select.
--
-- check:grants replays it with every migration and holds it to its
-- cases (scripts/check-grants.mjs, "the checker's marks"): anon and
-- authenticated cannot call it; the trigger's marks survive; a call states the
-- marks whole; an unknown mark or null is refused; a run with no ranking row
-- answers null; another run and the run's case rows are left alone;
-- `rechecked_at` is set only for a run replayed whole, and no client can write it.
--
-- Dated after the last migration on main of 2026-10-21 (20261021010000, the
-- test week); re-date it after whatever is last on main when it merges.

alter table public.playtest_sessions add column if not exists rechecked_at timestamptz;

comment on column public.playtest_sessions.rechecked_at is
  'When scripts/verify-ranking-rows.mjs last replayed this ranking run whole (null: never, or a run from a build before the replay record). Set by ranking_set_recheck_marks only.';

create or replace function public.ranking_set_recheck_marks(p_run_id text, p_marks text[], p_replayed boolean default false)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recheck constant text[] := array['score-off-log', 'window-no-replay', 'window-off-replay'];
  v_marks text[];
begin
  if p_marks is null or not (p_marks <@ v_recheck) then
    raise exception 'ranking_set_recheck_marks takes only %', v_recheck using errcode = '22023';
  end if;
  update public.playtest_sessions
     set suspicion = (
       select coalesce(array_agg(distinct mark order by mark), '{}')
         from unnest(coalesce(suspicion, '{}') || p_marks) as mark
        where not (mark = any(v_recheck)) or mark = any(p_marks)
     ),
         rechecked_at = case when coalesce(p_replayed, false) then now() end
   where case_id = 'season-final'
     and run_id = p_run_id
  returning suspicion into v_marks;
  return v_marks;
end;
$$;

revoke all on function public.ranking_set_recheck_marks(text, text[], boolean) from public, anon, authenticated;
grant execute on function public.ranking_set_recheck_marks(text, text[], boolean) to service_role;

notify pgrst, 'reload schema';
