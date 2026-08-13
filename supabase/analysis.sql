-- Case completion volume and average response time.
select
  case_id,
  max(case_title) as case_title,
  count(*) as completions,
  round(avg((summary ->> 'averageResponseTime')::numeric), 1) as avg_response_seconds,
  round(avg((summary ->> 'freeCount')::numeric), 1) as avg_free_text_count,
  max(completed_at) as latest_completion
from public.playtest_sessions
group by case_id
order by case_id;

-- Trigger distribution by completed case.
select
  case_id,
  summary #>> '{primary,0}' as primary_trigger,
  count(*) as count
from public.playtest_sessions
group by case_id, primary_trigger
order by case_id, count desc;

-- Longest decision scenes across all submitted logs.
select
  session_code,
  case_id,
  log_item ->> 'title' as scene_title,
  (log_item ->> 'responseTimeSec')::integer as response_seconds,
  log_item ->> 'choice' as choice_label,
  nullif(log_item ->> 'freeText', '') as free_text
from public.playtest_sessions
cross join lateral jsonb_array_elements(decision_log) as log_item
order by response_seconds desc
limit 30;

-- Resource pressure by case.
select
  case_id,
  round(avg((resources ->> 'time')::numeric), 1) as avg_time_left,
  round(avg((resources ->> 'capital')::numeric), 1) as avg_capital,
  round(avg((resources ->> 'trust')::numeric), 1) as avg_trust,
  round(avg((resources ->> 'legitimacy')::numeric), 1) as avg_legitimacy,
  round(avg((resources ->> 'humanCost')::numeric), 1) as avg_human_cost,
  round(avg((resources ->> 'fatigue')::numeric), 1) as avg_fatigue
from public.playtest_sessions
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
