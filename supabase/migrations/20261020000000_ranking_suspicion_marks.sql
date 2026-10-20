-- Drafted 2026-10-14 on branch ranking-marks as 20261015010000 and re-dated
-- 2026-10-20 to follow every migration on main (last 20261014000000).
--
-- Server checks, phase 1: mark, don't refuse.
--
-- A ranking row (`season-final`) that a client made up is refused today only
-- for what can be read off the run's own rows: every case present, the final
-- one from this device, no story or beat-table case, the play spread over
-- fifteen minutes. What the score itself says is taken as given. This adds
-- cheap bounds checks on that score and on the run it came from, and writes
-- what fails into a new column, `suspicion`. Nothing is refused for it.
--
-- Why not refuse. A refusal is a plain exception, PostgREST answers 400, and
-- the client's queue lets a 400 go for good (telemetryBatch's
-- classifyTelemetryFailure, "permanent"). A check that is wrong about one
-- honest season would delete that season's ranking row from every device it
-- is queued on, with no way back. A mark costs nothing to be wrong about: the
-- row is stored and shown as before, and someone reads the marks before any
-- of them hides anything.
--
-- What is checked, on the row as the validator left it -- its summary is the
-- server's copy of the run's `final` case, through ranking_public_summary --
-- and on the run's case rows already stored:
--
--   rank-off-score       `rank` is not the letter `burstScore` earns:
--                        S from 88, A from 72, B from 52, C below
--                        (gameLogic's getGameplayStats).
--   tier-off-score       `momentumTier` is not the tier the score earns:
--                        BURST from 78, FLOW from 58, READY from 36.
--   score-twins-differ   `momentumScore` and `burstScore` differ; the client
--                        writes one number under both names.
--   score-not-whole      `burstScore` is not a whole number; the client
--                        rounds it.
--   part-out-of-range    one of the six parts the score is made from is
--                        outside 0 to 100, or `exploitPenalty` above 18.
--   time-over-gap        the decisions of the run took longer, by their own
--                        `responseTimeSec`, than the server saw pass between
--                        the run's first case row and its last. The first
--                        case's decisions are left out (they were played
--                        before the first row arrived), and the allowance is
--                        five minutes plus a second a decision, since the
--                        client rounds every response up to at least one.
--   wall-out-of-range    a logged decision's wall is not 0 (a window closed
--                        with no table) or a whole number from 38 to 98
--                        (normalizeSchema's WALL_FLOOR and the story wall's
--                        top), or its gauge, or a case row's `lastGauge`, is
--                        outside 0 to 100 (GAUGE_MAX).
--   unchecked            the checks themselves failed on this row; it is
--                        stored with this mark rather than refused.
--
-- What is NOT checked: whether the score is the one the summary's parts add
-- up to. That would put the score's formula in SQL, a second copy to keep in
-- step with gameLogic.js, and the published parts are not enough to redo it
-- (`currentChallengeStreak` is not among them). The design's decision 3.
--
-- Where an honest season can still be marked: `completed_at` is when a row
-- reached the server, so a season played partly offline and delivered in a
-- burst shows a shorter gap than it took (time-over-gap). That is the reason
-- this is a mark.
--
-- The column. `text[]`, one code per failed check: NULL on every row this has
-- not looked at (case rows, and ranking rows stored before it), `{}` on a
-- ranking row that passed. anon is granted neither select nor insert on it
-- (20260928030000 grants columns by name), so the marks are not published and
-- a client cannot write its own; the trigger sets it on every ranking row
-- whatever the request carried. Adding a nullable column with no default
-- changes the catalog only.
--
-- The trigger. A trigger of its own, like zz_charge_address_bytes
-- (20261006000000), and not a block in validate_telemetry_insert: that
-- function is restated whole by every migration that touches it, and the
-- local branch telemetry-validator-parts rewrites it into helpers. Postgres
-- fires a table's BEFORE triggers in name order, so `zm_` runs after
-- `validate_playtest_session_insert` -- it sees the row the validator
-- accepted, with the server's summary in it, and is never reached by a row
-- the validator refused or dropped as a replay -- and before
-- `zz_charge_address_bytes`, which charges the row with its marks. It relies
-- on two things only, both true of the function today and of the
-- telemetry-validator-parts shape: the validator's trigger keeps its name,
-- and for `season-final` it sets `new.summary` to the server's copy before it
-- returns. It reads nothing from validate_telemetry_insert's variables and
-- calls none of its helpers.
--
-- The public ranking. The policy "public can read completed season rankings"
-- gains one condition: a marked row is left out when the private setting
-- `ranking_hide_marked` is 1. With no such row -- the state this leaves --
-- the ranking reads exactly as before, marked rows included. The owner
-- switches it from the SQL editor, without a migration:
--   insert into public.private_settings (name, value) values ('ranking_hide_marked', '1')
--   on conflict (name) do update set value = excluded.value;
-- and back with `delete from public.private_settings where name = 'ranking_hide_marked';`.
-- public_rankings (security_invoker) and logic_hold_cutoffs() (SECURITY
-- INVOKER) read through the policy, so the list and the hold-rate bands agree.
-- The flag is read by ranking_hides_marked(), which anon must be able to run
-- because the policy runs as anon; all it can tell anyone is whether the
-- switch is on.
--
-- To read the marks:
--   select run_tag, score, summary->>'rank' as rank, suspicion, completed_at
--     from public.playtest_sessions
--    where case_id = 'season-final' and cardinality(suspicion) > 0
--    order by completed_at desc;

alter table public.playtest_sessions add column if not exists suspicion text[];

comment on column public.playtest_sessions.suspicion is
  'Ranking rows only: the checks the row failed (20261020000000). NULL = not checked, {} = passed. Never refused for; not readable by anon.';

-- The letter and the tier a score earns, as getGameplayStats writes them.
-- check-grants holds both to the client's source.
create or replace function public.ranking_rank_for(p_score numeric)
returns text
language sql
immutable
set search_path = ''
as $$
  select case when p_score >= 88 then 'S' when p_score >= 72 then 'A' when p_score >= 52 then 'B' else 'C' end
$$;

create or replace function public.ranking_tier_for(p_score numeric)
returns text
language sql
immutable
set search_path = ''
as $$
  select case when p_score >= 78 then 'BURST' when p_score >= 58 then 'FLOW' when p_score >= 36 then 'READY' else 'BUILDING' end
$$;

-- The marks of one ranking row: its published summary and its run id. Reads
-- the run's stored case rows; never raises on what it reads (every cast is
-- behind a type test), and the trigger catches anything it did not foresee.
create or replace function public.ranking_suspicion_of(p_summary jsonb, p_run_id text)
returns text[]
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_marks text[] := '{}';
  v_score numeric;
  v_key text;
  v_first_at timestamptz;
  v_last_at timestamptz;
  v_spent numeric;
  v_decisions integer;
begin
  -- Nested, not `and`: SQL does not promise to test the type before the cast.
  if jsonb_typeof(p_summary->'burstScore') = 'number' then
    v_score := (p_summary->>'burstScore')::numeric;
  end if;

  if v_score is not null then
    if coalesce(p_summary->>'rank', '') <> public.ranking_rank_for(v_score) then
      v_marks := array_append(v_marks, 'rank-off-score');
    end if;
    if p_summary ? 'momentumTier' and coalesce(p_summary->>'momentumTier', '') <> public.ranking_tier_for(v_score) then
      v_marks := array_append(v_marks, 'tier-off-score');
    end if;
    if jsonb_typeof(p_summary->'momentumScore') = 'number' then
      if (p_summary->>'momentumScore')::numeric <> v_score then
        v_marks := array_append(v_marks, 'score-twins-differ');
      end if;
    end if;
    if v_score <> trunc(v_score) then
      v_marks := array_append(v_marks, 'score-not-whole');
    end if;
  end if;

  foreach v_key in array array[
    'rhythmScore', 'cognitionScore', 'pressureAdaptScore', 'reflectionScore', 'consistencyScore', 'exploitPenalty'
  ] loop
    if jsonb_typeof(p_summary->v_key) = 'number' then
      if (p_summary->>v_key)::numeric not between 0 and (case when v_key = 'exploitPenalty' then 18 else 100 end) then
        v_marks := array_append(v_marks, 'part-out-of-range');
        exit;
      end if;
    end if;
  end loop;

  if p_run_id is not null then
    -- One row per run and case (playtest_sessions_run_case_key), so a case
    -- played twice is counted as the row that stands.
    select min(s.completed_at), max(s.completed_at)
      into v_first_at, v_last_at
      from public.playtest_sessions s
     where s.run_id = p_run_id
       and s.case_id = any(public.season_case_ids());

    -- Only the entries a row logged for its own case, and only numbers: a
    -- TABLE RECORD entry carried in by a slot restore has no response time.
    select coalesce(sum(case when jsonb_typeof(e.value->'responseTimeSec') = 'number'
                             then greatest(0, (e.value->>'responseTimeSec')::numeric) end), 0),
           count(*) filter (where jsonb_typeof(e.value->'responseTimeSec') = 'number')
      into v_spent, v_decisions
      from public.playtest_sessions s
      cross join lateral jsonb_array_elements(case when jsonb_typeof(s.decision_log) = 'array' then s.decision_log else '[]'::jsonb end) e
     where s.run_id = p_run_id
       and s.case_id = any(public.season_case_ids())
       and s.completed_at > v_first_at
       and e.value->>'caseId' = s.case_id;
    if v_first_at is not null
      and v_spent > extract(epoch from (v_last_at - v_first_at)) + 300 + v_decisions then
      v_marks := array_append(v_marks, 'time-over-gap');
    end if;

    if exists (
      select 1
        from public.playtest_sessions s
        cross join lateral jsonb_array_elements(case when jsonb_typeof(s.decision_log) = 'array' then s.decision_log else '[]'::jsonb end) e
       where s.run_id = p_run_id
         and s.case_id = any(public.season_case_ids())
         and (
           case when jsonb_typeof(e.value->'threshold'->'wall') = 'number'
                then not (
                  (e.value->'threshold'->>'wall')::numeric = 0
                  or ((e.value->'threshold'->>'wall')::numeric between 38 and 98
                      and (e.value->'threshold'->>'wall')::numeric = trunc((e.value->'threshold'->>'wall')::numeric)))
                else false end
           or case when jsonb_typeof(e.value->'threshold'->'gauge') = 'number'
                   then (e.value->'threshold'->>'gauge')::numeric not between 0 and 100
                   else false end
         )
    ) or exists (
      select 1
        from public.playtest_sessions s
       where s.run_id = p_run_id
         and s.case_id = any(public.season_case_ids())
         and case when jsonb_typeof(s.dynamics->'lastGauge') = 'number'
                  then (s.dynamics->>'lastGauge')::numeric not between 0 and 100
                  else false end
    ) then
      v_marks := array_append(v_marks, 'wall-out-of-range');
    end if;
  end if;

  return v_marks;
end;
$$;

create or replace function public.mark_season_suspicion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.case_id is distinct from 'season-final' then
    return new;
  end if;
  begin
    new.suspicion := public.ranking_suspicion_of(new.summary, new.run_id);
  exception when others then
    -- A mark, never a refusal: whatever went wrong here, the row is stored.
    new.suspicion := array['unchecked'];
  end;
  return new;
end;
$$;

-- On by default: no row, no hiding.
create or replace function public.ranking_hides_marked()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.private_setting_int('ranking_hide_marked', 0) = 1
$$;

revoke all on function public.ranking_rank_for(numeric) from public, anon, authenticated;
revoke all on function public.ranking_tier_for(numeric) from public, anon, authenticated;
revoke all on function public.ranking_suspicion_of(jsonb, text) from public, anon, authenticated;
revoke all on function public.mark_season_suspicion() from public, anon, authenticated;
revoke all on function public.ranking_hides_marked() from public, authenticated;
grant execute on function public.ranking_rank_for(numeric) to service_role;
grant execute on function public.ranking_tier_for(numeric) to service_role;
grant execute on function public.ranking_suspicion_of(jsonb, text) to service_role;
grant execute on function public.mark_season_suspicion() to service_role;
-- anon: the policy below calls it as the role reading the ranking.
grant execute on function public.ranking_hides_marked() to anon, service_role;

drop trigger if exists zm_mark_season_suspicion on public.playtest_sessions;
create trigger zm_mark_season_suspicion
before insert on public.playtest_sessions
for each row execute function public.mark_season_suspicion();

-- The policy of 20260928000000 with the one condition added.
drop policy if exists "public can read completed season rankings" on public.playtest_sessions;
create policy "public can read completed season rankings" on public.playtest_sessions
for select to anon
using (
  case_id = 'season-final'
  and summary->>'seasonComplete' = 'true'
  and score is not null
  and (coalesce(cardinality(suspicion), 0) = 0 or not public.ranking_hides_marked())
);

notify pgrst, 'reload schema';
