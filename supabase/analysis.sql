-- Case completion volume and average response time.
with parsed_sessions as (
  select
    *,
    case
      when summary ->> 'schemaVersion' ~ '^[0-9]+$' then (summary ->> 'schemaVersion')::integer
      else 1
    end as schema_version,
    case
      when summary ->> 'averageResponseTime' ~ '^-?[0-9]+(\.[0-9]+)?$'
        then (summary ->> 'averageResponseTime')::numeric
      else null
    end as average_response_time,
    case
      when summary ->> 'freeCount' ~ '^-?[0-9]+(\.[0-9]+)?$'
        then (summary ->> 'freeCount')::numeric
      else null
    end as free_count,
    case
      when summary ->> 'momentumScore' ~ '^-?[0-9]+(\.[0-9]+)?$'
        then (summary ->> 'momentumScore')::numeric
      else 0
    end as momentum_score,
    case
      when summary ->> 'challengeClearCount' ~ '^-?[0-9]+(\.[0-9]+)?$'
        then (summary ->> 'challengeClearCount')::numeric
      else 0
    end as challenge_clear_count,
    case
      when summary ->> 'reducedRiskCount' ~ '^-?[0-9]+(\.[0-9]+)?$'
        then (summary ->> 'reducedRiskCount')::numeric
      else 0
    end as reduced_risk_count
  from public.playtest_sessions
)
select
  case_id,
  max(case_title) as case_title,
  max(schema_version) as latest_schema_version,
  count(*) as completions,
  round(avg(average_response_time), 1) as avg_response_seconds,
  round(avg(free_count), 1) as avg_free_text_count,
  round(avg(momentum_score), 1) as avg_momentum_score,
  round(avg(challenge_clear_count), 1) as avg_challenge_clears,
  round(avg(reduced_risk_count), 1) as avg_risk_reductions,
  max(completed_at) as latest_completion
from parsed_sessions
group by case_id
order by case_id;

-- Submitted log schema versions.
with parsed_sessions as (
  select
    completed_at,
    case
      when summary ->> 'schemaVersion' ~ '^[0-9]+$' then (summary ->> 'schemaVersion')::integer
      else 1
    end as schema_version
  from public.playtest_sessions
)
select
  schema_version,
  count(*) as submissions,
  min(completed_at) as first_seen,
  max(completed_at) as last_seen
from parsed_sessions
group by schema_version
order by schema_version;

-- Gameplay rank distribution by completed case.
select
  case_id,
  coalesce(summary ->> 'rank', 'C') as rank,
  count(*) as count
from public.playtest_sessions
group by case_id, rank
order by case_id, rank;

-- Trigger distribution by completed case.
select
  case_id,
  summary #>> '{primary,0}' as primary_trigger,
  count(*) as count
from public.playtest_sessions
group by case_id, primary_trigger
order by case_id, count desc;

-- Scene challenge outcomes across submitted logs.
select
  case_id,
  log_item ->> 'title' as scene_title,
  log_item #>> '{challenge,title}' as challenge_title,
  count(*) filter (where log_item #>> '{challenge,matched}' = 'true') as cleared,
  count(*) filter (where log_item #>> '{challenge,matched}' = 'false') as missed,
  round(
    avg(
      case
        when log_item #>> '{challenge,riskDelta}' ~ '^-?[0-9]+(\.[0-9]+)?$'
          then (log_item #>> '{challenge,riskDelta}')::numeric
        else null
      end
    ),
    1
  ) as avg_risk_delta
from public.playtest_sessions
cross join lateral jsonb_array_elements(decision_log) as log_item
where log_item ? 'challenge'
  and log_item #>> '{challenge,title}' is not null
group by case_id, scene_title, challenge_title
order by case_id, scene_title;

-- Longest decision scenes across all submitted logs.
select
  session_code,
  case_id,
  log_item ->> 'title' as scene_title,
  case
    when log_item ->> 'responseTimeSec' ~ '^[0-9]+$' then (log_item ->> 'responseTimeSec')::integer
    else null
  end as response_seconds,
  log_item ->> 'choice' as choice_label,
  nullif(log_item ->> 'freeText', '') as free_text
from public.playtest_sessions
cross join lateral jsonb_array_elements(decision_log) as log_item
where log_item ->> 'responseTimeSec' ~ '^[0-9]+$'
order by response_seconds desc
limit 30;

-- Resource pressure by case.
with parsed_resources as (
  select
    case_id,
    case when resources ->> 'time' ~ '^-?[0-9]+(\.[0-9]+)?$' then (resources ->> 'time')::numeric end as time_left,
    case when resources ->> 'capital' ~ '^-?[0-9]+(\.[0-9]+)?$' then (resources ->> 'capital')::numeric end as capital,
    case when resources ->> 'trust' ~ '^-?[0-9]+(\.[0-9]+)?$' then (resources ->> 'trust')::numeric end as trust,
    case when resources ->> 'legitimacy' ~ '^-?[0-9]+(\.[0-9]+)?$' then (resources ->> 'legitimacy')::numeric end as legitimacy,
    case when resources ->> 'humanCost' ~ '^-?[0-9]+(\.[0-9]+)?$' then (resources ->> 'humanCost')::numeric end as human_cost,
    case when resources ->> 'fatigue' ~ '^-?[0-9]+(\.[0-9]+)?$' then (resources ->> 'fatigue')::numeric end as fatigue
  from public.playtest_sessions
)
select
  case_id,
  round(avg(time_left), 1) as avg_time_left,
  round(avg(capital), 1) as avg_capital,
  round(avg(trust), 1) as avg_trust,
  round(avg(legitimacy), 1) as avg_legitimacy,
  round(avg(human_cost), 1) as avg_human_cost,
  round(avg(fatigue), 1) as avg_fatigue
from parsed_resources
group by case_id
order by case_id;

-- Feedback score summary.
select
  case_id,
  max(case_title) as case_title,
  count(*) as feedback_count,
  round(avg(clarity_score), 2) as avg_clarity,
  round(avg(difficulty_score), 2) as avg_difficulty
from public.playtest_feedback
group by case_id
order by case_id;

-- Recent low-clarity comments for copy and UX fixes.
select
  submitted_at,
  session_code,
  case_id,
  clarity_score,
  difficulty_score,
  comment
from public.playtest_feedback
where clarity_score is null or clarity_score <= 3
order by submitted_at desc
limit 30;

-- Delete one participant session after a deletion request.
-- Replace XXXXXXXX with the 8-character session code shown on the result screen.
-- delete from public.playtest_feedback where session_code = 'XXXXXXXX';
-- delete from public.playtest_sessions where session_code = 'XXXXXXXX';
