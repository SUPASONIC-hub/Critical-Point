-- Written 2026-11-13 on branch f1-hide (draft PR). F1's last piece: the
-- switch that takes a season the checks caught off the public ranking. It is
-- OFF and this file leaves it off. The owner turns it on, with one SQL line,
-- only after the nightly checker has marked no honest season for 14 days
-- (F1-3 (1), 설계-남은-우선항목-20261111.md; HANDOFF "~11-26"). Merging it
-- applies it to the production database within a minute, before the client
-- deploys, so it waits for the one bundled migration question.
--
-- What there was. 20261020000000 put the switch in the ranking's read policy:
-- with `ranking_hide_marked` = 1 in private_settings, a ranking row with ANY
-- mark in `suspicion` is left out. Turned on as it stood, it would also hide
-- the two marks an honest season can earn without anyone cheating:
--
--   time-over-gap   a season played partly offline and delivered in a burst
--                   (20261020000000 says so itself: "That is the reason this
--                   is a mark").
--   unchecked       the insert trigger's checks failed on the row -- the
--                   server's fault, not the player's.
--
-- What this changes. The policy now leaves a row out only for a mark on the
-- list below, the ones that a forged or edited season earns and a played one
-- does not:
--
--   the checker's (ranking_set_recheck_marks, 20261112000000; DB_MARKS in
--   scripts/verify-ranking-rows.mjs), the 14 days are watched for these:
--     chain-off-log, relic-draft, score-off-log, window-no-replay,
--     window-off-replay
--   the insert trigger's, values no table deals (20261020000000):
--     part-out-of-range, wall-out-of-range, rank-off-score, tier-off-score,
--     score-twins-differ, score-not-whole
--     (the last four no longer fall on a ranking row since the server writes
--     the season score itself, 20261106020000; listed so that they hide if
--     they ever come back)
--
-- A mark not on the list is shown, as every mark is today: a new mark is
-- hidden only when a migration adds it here, after its own observation.
-- check:grants holds the list to HIDE_MARKS in scripts/verify-ranking-rows.mjs
-- and every checker mark to it, so neither side can drift alone.
--
-- What it does not change. The switch's name and values: no row, or 0, shows
-- every row (the state this leaves); 1 hides. ranking_hides_marked() is the
-- same function, still the only one anon calls for it. public_rankings and
-- logic_hold_cutoffs() read through the policy (security_invoker), so the list
-- and the hold-rate bands agree. The hall of fame already takes only seasons
-- with no mark at all (20261106010000). Nothing is refused or deleted: a hidden
-- row comes back the moment the switch is off, or the night the checker no
-- longer marks it. The player's own device keeps showing its own season (the
-- page merges its local copy, src/ranking.js), so the switch tells a cheater
-- nothing on their own screen.
--
-- Before turning it on, what it would hide now (service role, SQL editor):
--   select run_tag, score, suspicion, completed_at
--     from public.playtest_sessions
--    where case_id = 'season-final'
--      and suspicion && array['chain-off-log', 'relic-draft', 'score-off-log', 'window-no-replay', 'window-off-replay',
--                             'part-out-of-range', 'wall-out-of-range', 'rank-off-score', 'tier-off-score',
--                             'score-twins-differ', 'score-not-whole']::text[]
--    order by completed_at desc;
-- Each nightly run of verify-ranking.yml also prints, per run, "hide switch:
-- hidden once on" and the count at the end of its report.
--
-- On:
--   insert into public.private_settings (name, value) values ('ranking_hide_marked', '1')
--   on conflict (name) do update set value = excluded.value;
-- Off again:
--   delete from public.private_settings where name = 'ranking_hide_marked';
--
-- Dated after the last migration on main of 2026-11-13 (20261116000000, the
-- crisis week); re-date it after whatever is last on main when it merges.

-- The policy of 20261020000000 with its last condition narrowed to the list.
drop policy if exists "public can read completed season rankings" on public.playtest_sessions;
create policy "public can read completed season rankings" on public.playtest_sessions
for select to anon
using (
  case_id = 'season-final'
  and summary->>'seasonComplete' = 'true'
  and score is not null
  and (
    not (coalesce(suspicion, '{}'::text[]) && array[
      'chain-off-log', 'relic-draft', 'score-off-log', 'window-no-replay', 'window-off-replay',
      'part-out-of-range', 'wall-out-of-range', 'rank-off-score', 'tier-off-score',
      'score-twins-differ', 'score-not-whole'
    ]::text[])
    or not public.ranking_hides_marked()
  )
);

notify pgrst, 'reload schema';
