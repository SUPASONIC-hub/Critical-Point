-- N44 (the owner's answer Q9 (1), 2026-11-18; improvement notes D3, next
-- step). Dated to follow the last migration on main (20261121000000).
--
-- The scene page's wall rate (`scene_bust_rates()`, 20261020020000) answered
-- a scene only once it had fifty windows from fifty runs, so a scene with
-- fewer printed nothing at all. From here it answers every scene of the
-- snapshot as [windows, percent], and the percent is there only once the
-- scene has twenty windows from twenty runs; below that it is null, and the
-- page prints 「모으는 중 (판단 N번)」 instead of a rate (SCENE_TRACE_FLOOR in
-- src/sceneTraces.js, the same twenty, checked again on the device).
--
-- What a scene under the floor now says is only how many windows were played
-- in it -- never a share of them, a run, a time or anything a player typed.
-- The request still carries nothing of the player's.
--
-- Only `scene_bust_rates()` changes. The snapshot (`scene_bust_stats`), its
-- rebuild (`refresh_scene_bust_stats()`, 20261106040000), the hourly schedule
-- and the choice rates (`scene_choice_rates()`, its own floor of fifty) are
-- not touched; `create or replace` keeps the grants, restated anyway.
--
-- The ranking resets (11-30's, 20261130000000, and the quarterly ones) delete
-- only the `season-final` rows; the case rows this counts stay (the 180-day
-- retention), so the counts do not start again from zero on those days.

create or replace function public.scene_bust_rates()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(jsonb_object_agg(c.case_id, c.scenes), '{}'::jsonb)
    from (
      select t.case_id,
             jsonb_object_agg(
               t.node_id,
               jsonb_build_array(
                 t.windows,
                 case when t.windows >= 20 and t.runs >= 20 then to_jsonb(round(100.0 * t.busts / t.windows)::integer) else 'null'::jsonb end
               )
             ) as scenes
        from public.scene_bust_stats t
       where t.windows >= 1
       group by t.case_id
    ) c
$$;

revoke all on function public.scene_bust_rates() from public, anon, authenticated;
grant execute on function public.scene_bust_rates() to anon, service_role;

notify pgrst, 'reload schema';
