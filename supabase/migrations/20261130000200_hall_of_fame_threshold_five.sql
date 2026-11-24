-- D2, the hall of fame: a board keeps its first three from five checked
-- seasons, not ten (decision T's T12). DRAFT: merging to main applies this to
-- the live database within a minute, so it waits for the owner's answer.
--
-- hall_of_fame_settle restated whole from 20261106010000_hall_of_fame.sql, its
-- only definition so far; the threshold and its refusal are the only change.
-- hall_of_fame_counts, the tables, the view and every written board stay. A
-- settled board is never written again, so it keeps what it has.
--
-- Client and server may differ for the minutes between this migration and the
-- deploy: the daily job at ten posts fewer places than five allows, never more.

create or replace function public.hall_of_fame_settle(p_boards jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_board jsonb;
  v_key text;
  v_kind text;
  v_checked integer;
  v_places jsonb;
  v_place jsonb;
  v_settle boolean;
  v_written text[] := '{}';
  v_kept text[] := '{}';
  v_settled text[] := '{}';
  v_tables text[] := '{}';
  v_counts jsonb;
begin
  if p_boards is null or jsonb_typeof(p_boards) <> 'array' then
    raise exception 'hall_of_fame_settle takes an array of boards' using errcode = '22023';
  end if;
  select coalesce(jsonb_object_agg(c.board, c.checked), '{}'::jsonb) into v_counts from public.hall_of_fame_counts() c;
  for v_board in select value from jsonb_array_elements(p_boards) loop
    v_key := v_board->>'board';
    v_places := coalesce(v_board->'places', '[]'::jsonb);
    if v_key is null or v_key !~ '^(table-[1-9][0-9]{0,2}|[0-9]{4}-W(0[1-9]|[1-4][0-9]|5[0-3]))$' then
      raise exception 'not a hall of fame board: %', v_key using errcode = '22023';
    end if;
    if jsonb_typeof(v_places) <> 'array' or jsonb_array_length(v_places) > 3 then
      raise exception 'board % takes at most three places', v_key using errcode = '22023';
    end if;
    v_kind := case when v_key like 'table-%' then 'table' else 'week' end;
    if v_kind = 'table' then v_tables := v_tables || v_key; end if;
    if exists (select 1 from public.hall_of_fame_boards where board = v_key and settled_at is not null) then
      v_kept := v_kept || v_key;
      continue;
    end if;
    -- The board's own count, never the call's.
    v_checked := coalesce((v_counts->>v_key)::integer, 0);
    if v_checked < 5 and jsonb_array_length(v_places) > 0 then
      raise exception 'board % takes no place below five checked seasons (it has %)', v_key, v_checked using errcode = '22023';
    end if;
    -- Every place a clean, checked season on this board, at the score posted.
    for v_place in select value from jsonb_array_elements(v_places) loop
      if not exists (
        select 1 from public.playtest_sessions s
         where s.case_id = 'season-final'
           and s.run_tag = v_place->>'run_tag'
           and s.suspicion = '{}'
           and s.rechecked_at is not null
           and s.summary->>'seasonComplete' = 'true'
           and s.score = (v_place->>'score')::numeric
           and (case when v_kind = 'week' then s.summary->>'week' = v_key else s.summary->>'week' is null end)
           and (v_kind = 'week' or exists (
             select 1 from public.playtest_sessions f
              where f.run_id = s.run_id and f.case_id = 'final'
                and f.dynamics->>'tableRules' = substring(v_key from 7)
           ))
      ) then
        raise exception 'board %: RUN % is not a clean, checked season on this board', v_key, v_place->>'run_tag' using errcode = '22023';
      end if;
    end loop;
    v_settle := v_kind = 'week'
      and now() >= ((to_date(v_key, 'IYYY-"W"IW')::timestamp at time zone 'UTC') - interval '9 hours') + interval '28 days';
    insert into public.hall_of_fame_boards as b (board, kind, checked_seasons, updated_at, settled_at)
    values (v_key, v_kind, v_checked, now(), case when v_settle then now() end)
    on conflict (board) do update
      set checked_seasons = excluded.checked_seasons, updated_at = excluded.updated_at, settled_at = excluded.settled_at;
    delete from public.hall_of_fame where board = v_key;
    insert into public.hall_of_fame (board, place, run_tag, score, rank, style, tags)
    select v_key, t.ord, t.e->>'run_tag', (t.e->>'score')::numeric, t.e->>'rank', t.e->>'style',
           coalesce(array(select jsonb_array_elements_text(coalesce(t.e->'tags', '[]'::jsonb))), '{}')
      from jsonb_array_elements(v_places) with ordinality as t(e, ord);
    v_written := v_written || v_key;
    if v_settle then v_settled := v_settled || v_key; end if;
  end loop;
  -- A table board written today closes every other open table board: the
  -- ranking was emptied for a new table, and the last day before is final.
  if cardinality(v_tables) > 0 then
    with closed as (
      update public.hall_of_fame_boards
         set settled_at = now()
       where kind = 'table' and settled_at is null and not (board = any(v_tables))
      returning board
    )
    select v_settled || coalesce(array_agg(board order by board), '{}') into v_settled from closed;
  end if;
  return jsonb_build_object('written', to_jsonb(v_written), 'kept', to_jsonb(v_kept), 'settled', to_jsonb(v_settled));
end;
$$;

revoke all on function public.hall_of_fame_settle(jsonb) from public, anon, authenticated;
grant execute on function public.hall_of_fame_settle(jsonb) to service_role;

notify pgrst, 'reload schema';
