-- The season's closing report prints a hold rate (`logicHold`, 0 to 100) and
-- the longest logic streak (`bestLogic`), and says which band of the public
-- ranking's seasons the hold rate falls in: top 10, 25 or 50 percent. Two
-- things are needed here for that, and both are additive: no column,
-- constraint, table, policy or trigger changes, and no stored row is touched.
--
-- 1. `ranking_public_summary` publishes only the keys it lists, and a ranking
--    row's summary is built through it once, when the row is inserted
--    (`validate_telemetry_insert`), from the run's own `final` case row. The
--    client writes the two numbers at the top of that row's summary
--    (useChoiceCommit, `getSeasonLogic`), so until this runs they stay on the
--    case row and reach no ranking row. The function is the one in
--    20260929050000 with those two keys added to the numeric list. A ranking
--    row stored before this keeps the summary it has and never gains them.
--
-- 2. `logic_hold_cutoffs()` answers with the three cut points and the number
--    of seasons they were read from, and takes no argument: the player's own
--    number is compared on the device and never sent. Below fifty seasons it
--    answers with the count alone, since a band drawn from a handful of rows
--    says nothing.
--
--    The seasons are the public ranking's: the same three conditions as the
--    policy "public can read completed season rankings" (20260928000000), so a
--    story-mode season, which gets no ranking row (20261010000000), is not
--    among them, and a run counts once (one `season-final` row per run). The
--    function is SECURITY INVOKER: anon may already read `case_id`, `summary`
--    and `score` of exactly these rows (20260928030000), so it needs no right
--    its caller lacks, and what it returns -- a count and three percentiles of
--    a published number -- is something anon could work out from
--    `public_rankings` as it is.

create or replace function public.ranking_public_summary(p_summary jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_out jsonb := '{}'::jsonb;
  v_key text;
  v_pair jsonb;
begin
  if p_summary is null or jsonb_typeof(p_summary) <> 'object' then
    return v_out;
  end if;
  foreach v_key in array array[
    'schemaVersion', 'burstScore', 'momentumScore', 'rhythmScore', 'cognitionScore', 'pressureAdaptScore',
    'reflectionScore', 'consistencyScore', 'exploitPenalty', 'averageResponseTime', 'reframeCount',
    'challengeClearCount', 'reducedRiskCount', 'assistTime', 'logicHold', 'bestLogic'
  ] loop
    -- Nested, not `and`: SQL does not promise to test the type before the cast.
    if jsonb_typeof(p_summary->v_key) = 'number' then
      if (p_summary->>v_key)::numeric between 0 and 1000000 then
        v_out := v_out || jsonb_build_object(v_key, trim_scale(round((p_summary->>v_key)::numeric, 3)));
      end if;
    end if;
  end loop;
  if p_summary->>'rank' in ('S', 'A', 'B', 'C') then
    v_out := v_out || jsonb_build_object('rank', p_summary->>'rank');
  end if;
  if jsonb_typeof(p_summary->'momentumTier') = 'string' and p_summary->>'momentumTier' ~ '^[A-Z][A-Z ]{0,23}$' then
    v_out := v_out || jsonb_build_object('momentumTier', p_summary->>'momentumTier');
  end if;
  if jsonb_typeof(p_summary->'endingVariant') = 'string' and p_summary->>'endingVariant' ~ '^[a-z][a-z0-9-]{0,39}$' then
    v_out := v_out || jsonb_build_object('endingVariant', p_summary->>'endingVariant');
  end if;
  -- ["responsibility", 120]: a score family and how much of it the run showed.
  foreach v_key in array array['primary', 'secondary', 'thinking'] loop
    v_pair := p_summary->v_key;
    if jsonb_typeof(v_pair) = 'array' then
      if jsonb_array_length(v_pair) = 2
        and jsonb_typeof(v_pair->0) = 'string'
        and jsonb_typeof(v_pair->1) = 'number' then
        if (v_pair->>0) ~ '^[A-Za-z]{1,32}$' and (v_pair->>1)::numeric between 0 and 1000000 then
          v_out := v_out || jsonb_build_object(
            v_key,
            jsonb_build_array(v_pair->>0, trim_scale(round((v_pair->>1)::numeric, 3)))
          );
        end if;
      end if;
    end if;
  end loop;
  return v_out;
end;
$$;

revoke all on function public.ranking_public_summary(jsonb) from public, anon, authenticated;
grant execute on function public.ranking_public_summary(jsonb) to service_role;

-- `cuts` is keyed by the band it opens: a hold rate at or above cuts."10" is
-- in the top ten percent. percentile_disc answers with a value some season
-- actually has, so every cut is a number from 0 to 100 and the three are in
-- order: "50" <= "25" <= "10".
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

notify pgrst, 'reload schema';
