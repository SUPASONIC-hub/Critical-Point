-- Drafted 2026-10-16 on branch weekly-rules as a .sql.draft (last named
-- 20261019010000) and re-dated 2026-10-20 to sort after every migration it
-- follows: on main the validator in parts (20261014000000) and the ranking's
-- suspicion marks (20261020000000), and the two pull requests that go in
-- before this one, the day-ten rules (#190, 20261020010000) and the scene bust
-- rates (#197, 20261020020000). Merging it to main applies it to the
-- production database within a minute, and the client of the same pull
-- request reads `public_rankings.week`, so the two go together or the ranking
-- screen's request fails. scripts/check-grants.mjs plays the weeks' cases
-- against it (the block "this week's rule").
--
-- 이번 주의 규칙: one rule for one ISO week (Korean time), a ranking of its
-- own for it, and the ordinary ranking untouched.
--
-- 1. `weekly_rules` is the server's copy of the client's calendar, one row a
--    week. tests/unit/weekly-rules.test.mjs fails when the rows below and
--    `WEEKLY_RULES` differ. Nobody but the definer functions reads it: RLS on,
--    no policy, every right revoked from anon and authenticated.
--
-- 2. Which week a run belongs to is the server's (D1). The client stamps the
--    rule it took at the season's start on every case row's `dynamics`
--    (`weekRule`, createRunSummary), and the device clock that chose it is not
--    trusted. `ranking_run_week` reads the run's case rows and
--      (a) refuses a run whose rows do not all say the same: the stamp is the
--          season's, set once (D3), so rows that differ are not one season;
--      (b) with no rule, returns null: the ordinary ranking, as before;
--      (c) with a rule, takes the week of the first case row the server
--          received (`completed_at` is the server's `now()`), and refuses the
--          run unless `weekly_rules` has that rule for that week. A device
--          clock moved to another week is refused here. A season started
--          offline and sent late is judged by when its first row arrived,
--          which can be the week after; that run is refused too (a small loss,
--          and the player is told nothing worse than the queue's 400).
--    A plain exception, like the run marks: PostgREST answers 400 and the
--    client's queue lets the row go.
--
-- 3. `ranking_run_summary` (one of the nine parts) is restated -- every line
--    as 20261014000000 wrote it -- and adds `week` to what it returns when the
--    run has one. The trigger function and the other parts are not touched:
--    `ranking_check_run` has already refused an incomplete or marked run by
--    the time this part runs, so the order of refusals is the one it was, and
--    a mismatched week is told last.
--
-- 4. `public_rankings` gains `week` as its last column (`create or replace
--    view` may only add at the end; it keeps the grants of 20260928030000:75
--    and :85, so they are not restated). The ordinary ranking reads
--    `week=is.null`, the event's `week=eq.2026-W46`.
--
-- 5. `dynamics` gains the stamp's line: optional, a string of at most 32
--    characters when present (WEEK_RULE_ID_MAX), or null. Every other line is
--    the one 20261020010000 wrote. NOT VALID, dropped first, as before.
--
-- 6. The week is judged strictly (결정 29 (1)): the week of the first case
--    row the server received, exactly, with no grace after Monday 00:00.
--
-- 7. The two-a-day device limit is shared by both rankings (결정 30 (1)):
--    `ranking_charge_limits` counts ranking rows whatever their week, and is
--    not touched. The hold-rate percentiles (`logic_hold_cutoffs`, every line
--    as 20261011000000 wrote it) read the ordinary ranking only: one more
--    condition, `week` absent, so an event week's table does not move the
--    bands of the ordinary one.
--
-- No reset: a season with no rule is the ordinary table, so the ordinary
-- ranking is not emptied (설계안 2-3).

create table if not exists public.weekly_rules (
  week text primary key check (week ~ '^[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3])$'),
  rule_id text not null check (rule_id ~ '^[a-z][a-z0-9-]*$' and length(rule_id) <= 32)
);

alter table public.weekly_rules enable row level security;
revoke all on table public.weekly_rules from public, anon, authenticated;
grant select, insert, update, delete on table public.weekly_rules to service_role;

-- The calendar. One line a week, in the client's order; the unit test reads
-- the `('week', 'id')` pairs out of this file.
insert into public.weekly_rules (week, rule_id) values
  ('2026-W46', 'near-wall')
on conflict (week) do update set rule_id = excluded.rule_id;

-- The ISO week of a moment in Korean time, which keeps no daylight saving:
-- UTC + 9 all year, so a fixed offset and no time-zone table.
create or replace function public.kst_iso_week(p_at timestamptz)
returns text
language sql
immutable
set search_path = ''
as $$
  select to_char((p_at at time zone 'UTC') + interval '9 hours', 'IYYY-"W"IW');
$$;

revoke all on function public.kst_iso_week(timestamptz) from public, anon, authenticated;
grant execute on function public.kst_iso_week(timestamptz) to service_role;

create or replace function public.ranking_run_week(p_run_id text)
returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_rules integer;
  v_rule text;
  v_first_at timestamptz;
  v_week text;
begin
  -- A stamp that is not a string or null is not one the client writes.
  if exists (
    select 1 from public.playtest_sessions s
    where s.run_id = p_run_id
      and s.case_id = any(public.season_case_ids())
      and coalesce(jsonb_typeof(s.dynamics->'weekRule'), 'null') not in ('null', 'string')
  ) then
    raise exception 'week rule is not a rule id';
  end if;
  select count(distinct coalesce(s.dynamics->>'weekRule', '')), max(s.dynamics->>'weekRule'), min(s.completed_at)
    into v_rules, v_rule, v_first_at
    from public.playtest_sessions s
   where s.run_id = p_run_id
     and s.case_id = any(public.season_case_ids());
  if v_rules > 1 then
    raise exception 'week rule changed within the run';
  end if;
  if v_rule is null then
    return null;
  end if;
  v_week := public.kst_iso_week(v_first_at);
  if not exists (select 1 from public.weekly_rules w where w.week = v_week and w.rule_id = v_rule) then
    raise exception 'week rule does not match the week the run began';
  end if;
  return v_week;
end;
$$;

revoke all on function public.ranking_run_week(text) from public, anon, authenticated;
grant execute on function public.ranking_run_week(text) to service_role;

-- Every line as 20261014000000 wrote it, and the week at the end.
create or replace function public.ranking_run_summary(p_run_id text, p_session_id text)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_final_summary jsonb;
  v_score_text text;
  v_week text;
begin
  select s.summary into v_final_summary
    from public.playtest_sessions s
   where s.run_id = p_run_id and s.case_id = 'final' and s.session_id = p_session_id
   limit 1;
  v_final_summary := public.ranking_public_summary(v_final_summary);
  v_score_text := v_final_summary->>'burstScore';
  if v_score_text is null or v_score_text !~ '^[0-9]{1,3}([.][0-9]{1,6})?$' or v_score_text::numeric > 100 then
    raise exception 'invalid season ranking score';
  end if;
  if coalesce(v_final_summary->>'rank', '') not in ('S', 'A', 'B', 'C') then
    raise exception 'invalid season ranking rank';
  end if;
  v_week := public.ranking_run_week(p_run_id);
  if v_week is not null then
    v_final_summary := v_final_summary || jsonb_build_object('week', v_week);
  end if;
  return v_final_summary;
end;
$$;

-- The grants as 20261014000000:358,367 wrote them.
revoke all on function public.ranking_run_summary(text, text) from public, anon, authenticated;
grant execute on function public.ranking_run_summary(text, text) to service_role;

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
  summary->>'week' as week
from public.playtest_sessions
where case_id = 'season-final';

-- Every line as 20261011000000 wrote it, and the ordinary ranking only (7).
create or replace function public.logic_hold_cutoffs()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with seasons as (
    -- A CASE, not `and`: SQL does not promise to test the type before the
    -- cast, and a CASE does. Anything that is not a number reads as null.
    select case when jsonb_typeof(s.summary->'logicHold') = 'number'
                then (s.summary->>'logicHold')::numeric end as v
      from public.playtest_sessions s
     where s.case_id = 'season-final'
       and s.summary->>'seasonComplete' = 'true'
       and s.score is not null
       and s.summary->>'week' is null
  ),
  pool as (
    select v from seasons where v between 0 and 100
  )
  select case
    when count(*) < 50 then jsonb_build_object('n', count(*))
    else jsonb_build_object(
      'n', count(*),
      'cuts', jsonb_build_object(
        '50', percentile_disc(0.50) within group (order by v),
        '25', percentile_disc(0.75) within group (order by v),
        '10', percentile_disc(0.90) within group (order by v)
      )
    )
  end
  from pool
$$;

revoke all on function public.logic_hold_cutoffs() from public, anon, authenticated;
grant execute on function public.logic_hold_cutoffs() to anon, service_role;

alter table public.playtest_sessions
  drop constraint if exists playtest_sessions_dynamics_shape;

-- The constraint as 20261020010000 (the day-ten rules) left it, line for
-- line, plus the `weekRule` line. #197 (20261020020000) does not touch it.
alter table public.playtest_sessions
  add constraint playtest_sessions_dynamics_shape
  check (
    dynamics is null
    or (
      jsonb_typeof(dynamics) = 'object'
      and jsonb_typeof(dynamics -> 'windowIndex') = 'number'
      and jsonb_typeof(dynamics -> 'runPot') = 'number'
      and jsonb_typeof(dynamics -> 'vault') = 'number'
      and jsonb_typeof(dynamics -> 'streak') = 'number'
      and jsonb_typeof(dynamics -> 'busts') = 'number'
      and jsonb_typeof(dynamics -> 'cashes') = 'number'
      and jsonb_typeof(dynamics -> 'bestMultiplier') = 'number'
      and jsonb_typeof(dynamics -> 'lastGauge') = 'number'
      and jsonb_typeof(dynamics -> 'lastOutcome') = 'string'
      and jsonb_typeof(dynamics -> 'mutations') = 'array'
      and jsonb_typeof(dynamics -> 'responseTimeSec') = 'number'
      and (not (dynamics ? 'beatCombo') or jsonb_typeof(dynamics -> 'beatCombo') = 'number')
      and (not (dynamics ? 'bestCombo') or jsonb_typeof(dynamics -> 'bestCombo') = 'number')
      and (not (dynamics ? 'grooveVault') or jsonb_typeof(dynamics -> 'grooveVault') = 'number')
      and (not (dynamics ? 'logicStreak') or jsonb_typeof(dynamics -> 'logicStreak') = 'number')
      and (not (dynamics ? 'bestLogic') or jsonb_typeof(dynamics -> 'bestLogic') = 'number')
      and (not (dynamics ? 'handVault') or jsonb_typeof(dynamics -> 'handVault') = 'number')
      and (not (dynamics ? 'tableRules') or jsonb_typeof(dynamics -> 'tableRules') = 'number')
      and (not (dynamics ? 'weekRule') or jsonb_typeof(dynamics -> 'weekRule') = 'null'
           or (jsonb_typeof(dynamics -> 'weekRule') = 'string' and length(dynamics ->> 'weekRule') <= 32))
      and (not (dynamics ? 'relics') or (jsonb_typeof(dynamics -> 'relics') = 'array' and jsonb_array_length(dynamics -> 'relics') <= 16))
    )
  ) not valid;

notify pgrst, 'reload schema';
