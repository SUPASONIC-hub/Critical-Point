-- Written 2026-11-03 on branch ranking-recheck-wider (보안 점검 M2, the user's
-- answer (1) of 11-03: before the W47 test week). Merging it applies it to the
-- production database within a minute, before the client deploys.
--
-- The page computes a season's score; the server keeps it, and the checker
-- (scripts/verify-ranking-rows.mjs, .github/workflows/verify-ranking.yml)
-- works it out again afterwards, once a night. Until the checker has read a
-- run, a row at the top of the ranking is the page's word alone. This lets the
-- ranking say so: a row the checker has not read yet is shown 「확인 중」
-- ("being checked") beside its score. Nothing is hidden or refused for it.
--
-- `rechecked_at` (20261023000000) cannot tell it: it is set only for a run
-- replayed whole, so a run from a build before the replay record, read and
-- marked, keeps it null for good. So the ranking row gets `recheck_seen_at`,
-- the time the checker last read the run whatever it found, set by
-- ranking_set_recheck_marks on every call. The runs it has read before this
-- column existed are those with a `rechecked_at`; the rest (no run at all on
-- 11-03: every nightly read since 10-24 found 0 ranked runs) are read again
-- the next night.
--
-- The page reads it through public_rankings as `rechecked` (true or false).
-- The view is security_invoker, so anon is granted select on the one column,
-- and so anon can also read the check time itself from playtest_sessions: not
-- sensitive (reviewed 2026-11-04). It cannot write it (anon's insert grant is a column list
-- without it) and only the service role can call the function.
--
-- check:grants replays it with every migration and holds it to its cases
-- (scripts/check-grants.mjs, "the checker's marks"): anon reads `rechecked`
-- through the view and the column alone, writes neither; the function sets it
-- on every call, replayed or not, and on the ranking row only; the checker's
-- run list keeps the rows not read yet.

alter table public.playtest_sessions add column if not exists recheck_seen_at timestamptz;

comment on column public.playtest_sessions.recheck_seen_at is
  'When scripts/verify-ranking-rows.mjs last read this ranking run, whatever it found (null: not read yet; the ranking shows the row as being checked). Set by ranking_set_recheck_marks only.';

update public.playtest_sessions
   set recheck_seen_at = rechecked_at
 where case_id = 'season-final'
   and rechecked_at is not null
   and recheck_seen_at is null;

-- Every line as 20261023000000 wrote it, and `recheck_seen_at` on every call.
create or replace function public.ranking_set_recheck_marks(p_run_id text, p_marks text[], p_replayed boolean default false)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recheck constant text[] := array['chain-off-log', 'score-off-log', 'window-no-replay', 'window-off-replay'];
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
         rechecked_at = case when coalesce(p_replayed, false) then now() end,
         recheck_seen_at = now()
   where case_id = 'season-final'
     and run_id = p_run_id
  returning suspicion into v_marks;
  return v_marks;
end;
$$;

revoke all on function public.ranking_set_recheck_marks(text, text[], boolean) from public, anon, authenticated;
grant execute on function public.ranking_set_recheck_marks(text, text[], boolean) to service_role;

-- The view of 20261021000000 with one column added at the end.
create or replace view public.public_rankings
with (security_invoker = true)
as
select
  run_tag,
  player_name,
  case_id,
  case_title,
  completed_at,
  summary,
  score,
  summary->>'week' as week,
  recheck_seen_at is not null as rechecked
from public.playtest_sessions
where case_id = 'season-final';

grant select (recheck_seen_at) on public.playtest_sessions to anon;
grant select on public.public_rankings to anon;
grant select on public.public_rankings to service_role;

notify pgrst, 'reload schema';
