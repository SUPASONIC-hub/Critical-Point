-- G34 보상금 (게임성 개선점 4차, 「전부 1」 of 2026-11-25; RULES_MARK 9).
-- A case closed with people hurt can be paid off from the vault before the
-- next case opens (src/gauntlet/settlementPay.js). The next case row's
-- opening snapshot carries the payment as `dynamics.open.paid`
-- ({ caseId, cost, harm }), and the chain recheck (src/chainRecheck.js) opens
-- that case on the vault the case before closed on, less `cost`.
--
-- The server takes only the prices the ladder can make: PAY_BASE 9,000
-- rising 1.5 times a cover, ten at most (PAY_LADDER, rounded to the hundred):
-- 9,000 / 13,500 / 20,300 / 30,400 / 45,600 / 68,300 / 102,500 / 153,800 /
-- 230,700 / 346,000. `harm` is a whole number from 1 to 200 (a case's human
-- cost), `caseId` a short string. A row without `open.paid`, and every row
-- before RULES_MARK 9, is taken as before.
--
-- Only the one check after the entry loop is new; the function is otherwise
-- as 20261129120000 left it. Nothing is granted or revoked beyond what that
-- migration did for the same function.
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
  v_paid jsonb;
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
  -- G34: a payment the opening snapshot carries is one the ladder makes, for a harm a case can close on.
  v_paid := case when jsonb_typeof(p_dynamics) = 'object' and jsonb_typeof(p_dynamics -> 'open') = 'object' then p_dynamics -> 'open' -> 'paid' end;
  if v_paid is not null and jsonb_typeof(v_paid) <> 'null' then
    if jsonb_typeof(v_paid) <> 'object'
      or coalesce(jsonb_typeof(v_paid -> 'cost'), 'none') <> 'number'
      or (v_paid ->> 'cost')::numeric not in (9000, 13500, 20300, 30400, 45600, 68300, 102500, 153800, 230700, 346000)
      or coalesce(jsonb_typeof(v_paid -> 'harm'), 'none') <> 'number'
      or (v_paid ->> 'harm')::numeric <> trunc((v_paid ->> 'harm')::numeric)
      or (v_paid ->> 'harm')::numeric < 1
      or (v_paid ->> 'harm')::numeric > 200
      or coalesce(jsonb_typeof(v_paid -> 'caseId'), 'none') <> 'string'
      or length(v_paid ->> 'caseId') > 32 then
      raise exception 'invalid settlement pay';
    end if;
  end if;
end;
$$;

revoke all on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.telemetry_check_session_row(text, jsonb, jsonb, text, text, jsonb, jsonb, jsonb, jsonb) to service_role;

notify pgrst, 'reload schema';
