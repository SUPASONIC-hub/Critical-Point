-- The live playtest_feedback table was created by hand before the baseline, with
-- one column per field (case_title, submitted_at, clarity_score,
-- difficulty_score, comment). The baseline's `create table if not exists` left
-- it alone, so every replayed database has `feedback jsonb` while the live one
-- never did. 20260928000000 validates `new.feedback` on every insert and the
-- client now sends `{ ..., feedback: {...} }`, so on the live table every
-- feedback row was refused.
--
-- Give the live table the column the migrations and the client agree on, fill it
-- from the per-field columns for rows written before, and let submitted_at
-- default so a row that only carries `feedback` is accepted. On a replayed
-- database the column already exists and the per-field columns do not, so only
-- the first statement runs and does nothing.

alter table public.playtest_feedback
  add column if not exists feedback jsonb not null default '{}'::jsonb;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'playtest_feedback' and column_name = 'clarity_score'
  ) then
    execute $sql$
      update public.playtest_feedback
      set feedback = jsonb_strip_nulls(jsonb_build_object(
        'caseTitle', case_title,
        'submittedAt', submitted_at,
        'clarity', clarity_score,
        'difficulty', difficulty_score,
        'comment', comment
      ))
      where feedback = '{}'::jsonb
    $sql$;
    execute 'alter table public.playtest_feedback alter column submitted_at set default now()';
  end if;
end;
$$;
