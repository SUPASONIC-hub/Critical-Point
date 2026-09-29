-- The comfort settings (2026-09-29) let a player slow the table's clock to
-- x1.5 or x2. A run that did carries `assistTime` in its case summaries, the
-- finale's being the slowest of the season, and the ranking row should say so
-- rather than rank it silently beside runs played at the table's pace.
--
-- `ranking_public_summary` publishes only the keys it lists, so until this
-- runs the key is dropped and the row shows no mark; the client reads the key
-- when it is there and nothing breaks when it is not. The function is the one
-- in 20260929010000 with that one key added to the numeric list.

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
    'challengeClearCount', 'reducedRiskCount', 'assistTime'
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
