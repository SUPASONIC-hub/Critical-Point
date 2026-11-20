-- 11-20 묶음 (PR #629).
-- G4 (2026-11-19, 「전부 1」): the reroll at the draft costs 1,500
-- under the next rules (src/gauntlet/relicsNext.js `NEXT_REROLL_COST`), so a
-- draft's cost can also be 1,500 (a reroll) or 13,500 (a reroll and one more).
-- The four costs of before stay allowed: a row played before the switch still
-- carries 4,000 or 16,000. Only the one check in the entry loop changes; the
-- function is otherwise as 20261112000000 left it.
create or replace function public.telemetry_check_session_row(
  p_case_id text,
  p_summary jsonb,
  p_decision_log jsonb,
  p_run_id text,
  p_case_title text,
  p_resources jsonb,
  p_triggers jsonb,
  p_cognition jsonb,
  p_dynamics jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_entry jsonb;
begin
  if not public.is_season_case_id(p_case_id, true)
    or jsonb_typeof(p_summary) <> 'object'
    or jsonb_typeof(p_decision_log) <> 'array'
    or jsonb_array_length(p_decision_log) > 60 then
    raise exception 'invalid playtest session payload';
  end if;
  if (p_run_id is not null and length(p_run_id) > 128)
    or length(coalesce(p_case_title, '')) > 80
    or octet_length(p_summary::text) > 4096
    or octet_length(coalesce(p_resources, '{}'::jsonb)::text) > 1024
    or octet_length(coalesce(p_triggers, '{}'::jsonb)::text) > 1024
    or octet_length(coalesce(p_cognition, '{}'::jsonb)::text) > 1024
    or octet_length(coalesce(p_dynamics, '{}'::jsonb)::text) > 6144 then
    raise exception 'playtest session field too large';
  end if;
  for v_entry in select value from jsonb_array_elements(p_decision_log) loop
    if octet_length(v_entry::text) > 8192 then
      raise exception 'decision log entry too large';
    end if;
    -- C9: a draft's cost, when the entry carries one, is one of the six a draft can come to (G4 adds 1,500 and 13,500).
    if jsonb_path_exists(v_entry, '$.relicDraft.cost ? (@ != 0 && @ != 1500 && @ != 4000 && @ != 12000 && @ != 13500 && @ != 16000)') then
      raise exception 'invalid relic draft cost';
    end if;
  end loop;
end;
$$;

revoke all on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) to service_role;

notify pgrst, 'reload schema';
