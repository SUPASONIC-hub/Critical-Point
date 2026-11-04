-- 참가자 게시판: a post reported by three writers leaves the board by itself,
-- and a short list of blocked words is refused on the way in (2026-11-03, the
-- owner's choice 1 on the security review's M1).
--
-- 1. Hiding at three writers. 20261027000000 left every report to a person
--    ("a report count that hides a post is a button for hiding anyone's post
--    from three addresses"). The answer to that is kept, not dropped: a post a
--    person has read and restored is kept (`kept_at`) and is never hidden by
--    reports again; only the operator can hide it. What hides a post:
--      - distinct writers, as the report trigger already counts them (one per
--        address, `board-report:<hash>`): a second report from one writer is
--        dropped before it is stored, so it is never counted;
--      - writers known by address only: a report whose writer fell back to its
--        session id (`board-report:session:...`, no client address) is
--        stored and not counted, since a session id is the client's to choose;
--      - `board_auto_hide_writers` in private_settings, 3 when unset;
--      - two limits on top (2026-11-04, the user's decision on the review's
--        finding that one person is many writers: a phone that changes its
--        address, a home IPv6 range of many /64s). Both are in
--        `board_auto_hide_limit`, beside the three writers:
--          `board_auto_hide_per_hour`, 5: posts the reports may hide in an
--          hour, everyone's together. Past it a post with enough writers stays
--          on the board and waits in the queue as any reported post does;
--          a person decides.
--          `board_auto_hide_reports_per_writer_day`, 3: reports one writer
--          (request_client_key) counts toward hiding in a day. Past it the
--          writer's reports are stored and shown in the queue as before, and
--          `counts_for_hide` is false on them: they do not count.
--    The hide is the same `hidden = true` the operator sets, so the anon
--    policy ("where not hidden") takes the post off the board at once, and
--    `auto_hidden_at` says the reports did it. The Board Reports run counts
--    such a post as waiting for a person until it is hidden for good (hide,
--    which clears `auto_hidden_at`) or restored (restore, which sets
--    `kept_at` and deletes its reports): scripts/board-reports.mjs.
--    `moderate_board_post` keeps its two arguments and its grants.
--
-- 2. Blocked words. `public.board_blocked_terms` holds the list, one folded
--    word a row, filled below from src/boardBlockedTerms.js (the browser's copy;
--    tests/unit/board-blocked-terms.test.mjs holds the two equal, and a word
--    added there needs a migration that adds its row here). Why each word is on
--    it, and what is kept off, is the head of that file. `board_fold_text` is
--    `foldBoardText` step for step (NFKC, lower case, katakana as hiragana, a
--    split final joined back, jamo as typed, letters only), and the trigger
--    refuses a name or a post that holds a word, after the link and contact
--    filters, with its own message. How far a word is matched is its row's
--    `scope` (2026-11-04, BOARD_TERM_SCOPE in that file: the whole folded
--    post, one word of it, or a Latin word of its own), and two Japanese
--    words carry guards (`pass_next`, `pass_after_kanji`); `board_text_units`
--    cuts a post into words as `boardUnits` does. Nothing here is readable by
--    anon; the functions are not RPCs.

alter table public.board_posts add column if not exists auto_hidden_at timestamptz;
alter table public.board_posts add column if not exists kept_at timestamptz;

-- ---- 1. hiding at three writers

create or replace function public.moderate_board_post(p_post_id bigint, p_hidden boolean default true)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  -- A person decided: hidden for good, or kept for good.
  update public.board_posts
     set hidden = p_hidden,
         auto_hidden_at = null,
         kept_at = case when p_hidden then null else now() end
   where id = p_post_id
  returning true;
$$;

revoke all on function public.moderate_board_post(bigint, boolean) from public, anon, authenticated;
grant execute on function public.moderate_board_post(bigint, boolean) to service_role;

-- The limits on hiding by reports, in one place. The defaults are the
-- owner's: three writers (2026-11-03), and five posts an hour for everyone
-- and three reports a day from one writer (2026-11-04, the user's decision).
-- Each can be set in private_settings without a migration.
create or replace function public.board_auto_hide_limit(p_name text)
returns integer
language sql
stable
set search_path = ''
as $$
  select least(case p_name
    when 'writers' then public.private_setting_int('board_auto_hide_writers', 3)
    when 'per_hour' then public.private_setting_int('board_auto_hide_per_hour', 5)
    when 'per_writer_day' then public.private_setting_int('board_auto_hide_reports_per_writer_day', 3)
  end, 2147483647)::integer;
$$;

revoke all on function public.board_auto_hide_limit(text) from public, anon, authenticated;
grant execute on function public.board_auto_hide_limit(text) to service_role;

-- Whether a report counts toward hiding its post. Set by the report trigger
-- only (anon's insert grant is the four columns of 20261027000000). Reports
-- stored before this column: those from a writer known by address count
-- (they were stored before any day's limit, so none is past it).
alter table public.board_reports add column if not exists counts_for_hide boolean not null default false;
update public.board_reports
   set counts_for_hide = true
 where not counts_for_hide
   and actor_key like 'board-report:%'
   and actor_key not like 'board-report:session:%';

-- The report trigger of 20261027000000, and `counts_for_hide` set at its end.
-- Everything else is as it was.
create or replace function public.validate_board_report_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client text := public.request_client_key();
  v_writer text;
begin
  if new.session_id is null or length(new.session_id) not between 8 and 128 then
    raise exception 'invalid board report session id';
  end if;
  if new.event_id is not null and length(new.event_id) not between 1 and 128 then
    raise exception 'invalid board report event id';
  end if;
  if new.reason is null or new.reason not in ('spam', 'abuse', 'privacy', 'other') then
    raise exception 'invalid board report reason';
  end if;
  if new.post_id is null or not exists (
    select 1 from public.board_posts p where p.id = new.post_id and not p.hidden
  ) then
    raise exception 'board report names no visible post';
  end if;

  v_writer := 'board-report:' || coalesce(v_client, 'session:' || new.session_id);
  new.actor_key := left(v_writer, 200);
  new.created_at := now();

  perform pg_advisory_xact_lock(hashtext(new.actor_key));

  -- Once per writer and post: a second press is accepted and dropped.
  if exists (
    select 1 from public.board_reports r
    where r.actor_key = new.actor_key
      and r.post_id = new.post_id
  ) then
    return null;
  end if;

  if not public.bump_rate_limit(new.actor_key || '|' || new.session_id, interval '1 hour', 10)
    or not public.bump_rate_limit(new.actor_key, interval '1 hour', 30) then
    raise exception using errcode = 'PT429', message = 'board report rate limit exceeded';
  end if;

  -- New (20261103000000): a writer known by address counts toward hiding,
  -- for its first reports of the day only. The counter is the rate limits'
  -- table, so restoring or dismissing a post (which deletes its reports) does
  -- not give the writer its count back. A session id is never `hide`
  -- (8-128 characters), so the key is the writer's own.
  new.counts_for_hide := v_client is not null
    and public.bump_rate_limit(new.actor_key || '|hide', interval '1 day', public.board_auto_hide_limit('per_writer_day'));

  return new;
end;
$$;

revoke all on function public.validate_board_report_insert() from public, anon, authenticated;
grant execute on function public.validate_board_report_insert() to service_role;

create or replace function public.board_report_auto_hide()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_writers integer;
begin
  -- One post's reports counted one at a time, so two writers reporting at
  -- once cannot both count two and leave a third report uncounted.
  perform pg_advisory_xact_lock(hashtext('board-post:' || new.post_id::text));

  -- Writers known by address, each within its day's limit (counts_for_hide).
  select count(distinct r.actor_key) into v_writers
    from public.board_reports r
   where r.post_id = new.post_id
     and r.counts_for_hide;

  -- The hour's limit is spent only on a post this would hide; past it the
  -- post stays up, and its reports wait in the queue for a person.
  if v_writers >= public.board_auto_hide_limit('writers')
    and exists (
      select 1 from public.board_posts p
       where p.id = new.post_id and not p.hidden and p.kept_at is null
    )
    and public.bump_rate_limit('global:board-auto-hide', interval '1 hour', public.board_auto_hide_limit('per_hour')) then
    update public.board_posts
       set hidden = true, auto_hidden_at = now()
     where id = new.post_id and not hidden and kept_at is null;
  end if;
  return null;
end;
$$;

revoke all on function public.board_report_auto_hide() from public, anon, authenticated;
grant execute on function public.board_report_auto_hide() to service_role;

drop trigger if exists board_reports_auto_hide on public.board_reports;
create trigger board_reports_auto_hide
after insert on public.board_reports
for each row execute function public.board_report_auto_hide();

-- ---- 2. blocked words

create table if not exists public.board_blocked_terms (
  term text primary key,
  -- How far the word is matched (BOARD_TERM_SCOPE): 'text' the whole folded
  -- post, 'token' one word of it, 'word' a Latin word of its own.
  scope text not null default 'text',
  -- A match followed in its word by one of these does not count (死ねない).
  pass_next text[] not null default '{}',
  -- A match right after a kanji does not count (田中氏ね).
  pass_after_kanji boolean not null default false,
  constraint board_blocked_terms_term_check check (length(term) between 1 and 40),
  constraint board_blocked_terms_scope_check check (scope in ('text', 'token', 'word'))
);

alter table public.board_blocked_terms enable row level security;
revoke all on table public.board_blocked_terms from public, anon, authenticated;
grant all on table public.board_blocked_terms to service_role;

insert into public.board_blocked_terms (term) values
  ('씨발'),
  ('시발'),
  ('씨바'),
  ('씨팔'),
  ('시팔'),
  ('씨빨'),
  ('씨부랄'),
  ('시부랄'),
  ('십새'),
  ('씹새'),
  ('씹할'),
  ('병신'),
  ('븅신'),
  ('빙신'),
  ('개새끼'),
  ('개새기'),
  ('개색기'),
  ('개색끼'),
  ('개세끼'),
  ('좆'),
  ('지랄'),
  ('엠창'),
  ('니미럴'),
  ('느금마'),
  ('느개비'),
  ('애미뒤진'),
  ('애비뒤진'),
  ('ㅅㅂ'),
  ('ㅆㅂ'),
  ('ㅂㅅ'),
  ('ㅈㄹ'),
  ('ㅈ같'),
  ('ㄱㅅㄲ'),
  ('ㄴㄱㅁ'),
  ('한남충'),
  ('김치녀'),
  ('된장녀'),
  ('맘충'),
  ('틀딱'),
  ('급식충'),
  ('짱깨'),
  ('짱개'),
  ('쪽바리'),
  ('똥남아'),
  ('깜둥이'),
  ('똥꼬충'),
  ('fuck'),
  ('fuk'),
  ('fuq'),
  ('shit'),
  ('bitch'),
  ('bastard'),
  ('asshole'),
  ('cunt'),
  ('whore'),
  ('slut'),
  ('nigger'),
  ('nigga'),
  ('faggot'),
  ('retard'),
  ('chink'),
  ('wetback'),
  ('tranny'),
  ('killyourself'),
  ('bullshit'),
  ('dipshit'),
  ('horseshit'),
  ('motherfuck'),
  ('死ね'),
  ('氏ね'),
  ('殺すぞ'),
  ('ころすぞ'),
  ('きちがい'),
  ('基地外'),
  ('くたばれ'),
  ('ちゃんころ'),
  ('支那人')
on conflict (term) do nothing;

-- How far each word is matched, as BOARD_TERM_SCOPE and BOARD_TERM_GUARDS
-- say (2026-11-04); every other row keeps 'text'.
update public.board_blocked_terms set scope = 'token'
 where term in (
   '씨발', '시발', '씨바', '씨팔', '시팔', '씨빨', '십새', '씹새', '씹할', '병신', '븅신', '빙신',
   '지랄', '엠창', '맘충', '틀딱', '짱깨', '짱개',
   'bitch', 'bastard', 'asshole', 'whore', 'nigger', 'nigga', 'faggot', 'wetback', 'tranny',
   'bullshit', 'dipshit', 'horseshit', 'motherfuck',
   '死ね', '氏ね'
 );
update public.board_blocked_terms set scope = 'word'
 where term in ('fuck', 'fuk', 'fuq', 'shit', 'cunt', 'slut', 'chink', 'retard');
update public.board_blocked_terms set pass_next = array['な', 'る', 'た', 'ま', 'ず'] where term = '死ね';
update public.board_blocked_terms set pass_after_kanji = true where term = '氏ね';

create or replace function public.board_fold_text(p_text text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_text text := lower(normalize(coalesce(p_text, ''), NFKC));
  v_out text := '';
  v_code integer;
  v_next integer;
  v_last integer;
  v_final integer;
  v_choseong constant text := 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  v_jongseong constant text := 'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';
  v_as_final constant integer[] := array[1, 2, 4, 7, 0, 8, 16, 17, 0, 19, 20, 21, 22, 0, 23, 24, 25, 26, 27];
begin
  -- Katakana as hiragana.
  v_text := translate(v_text, 'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ', 'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ');
  -- ㅄ typed alone: NFKC makes it the old initial U+1121.
  v_text := replace(v_text, chr(4385), chr(4359) || chr(4361));
  for i in 1 .. length(v_text) loop
    v_code := ascii(substr(v_text, i, 1));
    v_next := case when i < length(v_text) then ascii(substr(v_text, i + 1, 1)) else 0 end;
    v_last := case when length(v_out) > 0 then ascii(right(v_out, 1)) else 0 end;
    if v_code between 4352 and 4370 then
      v_final := v_as_final[v_code - 4352 + 1];
      if v_final > 0 and v_last between 44032 and 55203 and (v_last - 44032) % 28 = 0 and not (v_next between 4449 and 4469) then
        v_out := left(v_out, -1) || chr(v_last + v_final);
      else
        v_out := v_out || substr(v_choseong, v_code - 4352 + 1, 1);
      end if;
    elsif v_code between 4449 and 4469 then
      v_out := v_out || chr(12623 + v_code - 4449);
    elsif v_code between 4520 and 4546 then
      v_out := v_out || substr(v_jongseong, v_code - 4520 + 1, 1);
    else
      v_out := v_out || substr(v_text, i, 1);
    end if;
  end loop;
  return regexp_replace(v_out, '[^a-z가-힣ㄱ-ㆎぁ-ゖ一-鿿]', '', 'g');
end;
$$;

revoke all on function public.board_fold_text(text) from public, anon, authenticated;
grant execute on function public.board_fold_text(text) to service_role;

-- `boardUnits` step for step: the post cut at whitespace and apostrophes (the
-- characters written out, as WORD_BREAK writes them), each piece folded, the
-- pieces that fold to nothing left out, and a run of one-letter pieces joined
-- back into one word (씨 . 발).
create or replace function public.board_text_units(p_text text)
returns text[]
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_piece text;
  v_word text;
  v_run text := '';
  v_units text[] := '{}';
begin
  foreach v_piece in array regexp_split_to_array(normalize(coalesce(p_text, ''), NFKC), '[\t\n\v\f\r \u0085\u1680\u2028\u2029\ufeff''\u2018\u2019]+') loop
    v_word := public.board_fold_text(v_piece);
    continue when v_word = '';
    if length(v_word) = 1 then
      v_run := v_run || v_word;
      continue;
    end if;
    if v_run <> '' then
      v_units := v_units || v_run;
    end if;
    v_run := '';
    v_units := v_units || v_word;
  end loop;
  if v_run <> '' then
    v_units := v_units || v_run;
  end if;
  return v_units;
end;
$$;

revoke all on function public.board_text_units(text) from public, anon, authenticated;
grant execute on function public.board_text_units(text) to service_role;

-- Whether `p_unit` holds `p_term` at a place its guards do not pass (`holds`).
create or replace function public.board_unit_holds(p_unit text, p_term text, p_pass_next text[], p_pass_after_kanji boolean)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_from integer := 1;
  v_at integer;
begin
  loop
    v_at := strpos(substr(p_unit, v_from), p_term);
    exit when v_at = 0;
    v_at := v_at + v_from - 1;
    if not (p_pass_after_kanji and v_at > 1 and substr(p_unit, v_at - 1, 1) ~ '^[一-鿿]$')
      and not exists (
        select 1 from unnest(p_pass_next) as n(start)
         where n.start <> '' and left(substr(p_unit, v_at + length(p_term)), length(n.start)) = n.start
      ) then
      return true;
    end if;
    v_from := v_at + 1;
  end loop;
  return false;
end;
$$;

revoke all on function public.board_unit_holds(text, text, text[], boolean) from public, anon, authenticated;
grant execute on function public.board_unit_holds(text, text, text[], boolean) to service_role;

-- `findBlockedTerm`: each word matched as its scope says. A 'word' word is a
-- run of Latin letters that is the word, or the word and one of the endings
-- BOARD_WORD_ENDINGS lists.
create or replace function public.board_text_has_blocked_term(p_text text)
returns boolean
language sql
stable
set search_path = ''
as $$
  with folded as (select public.board_fold_text(p_text) as t),
  units as (select unnest(public.board_text_units(p_text)) as u),
  runs as (
    select r.run from units, regexp_split_to_table(units.u, '[^a-z]+') as r(run) where r.run <> ''
  )
  select (select t from folded) <> '' and exists (
    select 1 from public.board_blocked_terms b
     where case b.scope
       when 'word' then exists (
         select 1 from runs
          where runs.run = b.term
             or (left(runs.run, length(b.term)) = b.term
                 and substr(runs.run, length(b.term) + 1) = any (array['s', 'es', 'ed', 'er', 'ers', 'ing', 'in', 'y', 'ty']))
       )
       when 'token' then exists (
         select 1 from units where public.board_unit_holds(units.u, b.term, b.pass_next, b.pass_after_kanji)
       )
       else public.board_unit_holds((select t from folded), b.term, b.pass_next, b.pass_after_kanji)
     end
  );
$$;

revoke all on function public.board_text_has_blocked_term(text) from public, anon, authenticated;
grant execute on function public.board_text_has_blocked_term(text) to service_role;

-- The insert trigger of 20260929020000, with the blocked words after the
-- contact filter. Everything else is as it was.
create or replace function public.validate_board_post_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client text := public.request_client_key();
  v_writer text;
  v_nickname text;
  v_body text;
  v_recent integer;
begin
  if new.session_id is null or length(new.session_id) not between 8 and 128 then
    raise exception 'invalid board session id';
  end if;
  if new.event_id is not null and length(new.event_id) not between 1 and 128 then
    raise exception 'invalid board event id';
  end if;

  -- The nickname is one line: any run of whitespace inside it is one space.
  v_nickname := public.clean_board_text(regexp_replace(coalesce(new.nickname, ''), '[\s\u00A0\u3000]+', ' ', 'g'));
  v_body := public.clean_board_text(new.body);

  if length(v_nickname) not between 2 and 24 or public.board_visible_length(v_nickname) < 2 then
    raise exception 'board nickname must be 2-24 characters';
  end if;
  if length(v_body) not between 2 and 300 or public.board_visible_length(v_body) < 2 then
    raise exception 'board post must be 2-300 characters';
  end if;
  if public.board_text_has_link(v_nickname) then
    raise exception 'board nickname must not contain a link';
  end if;
  if public.board_text_has_link(v_body) then
    raise exception 'board post must not contain a link';
  end if;
  if public.board_text_has_contact(v_nickname) or public.board_text_has_contact(v_body) then
    raise exception 'board post must not contain contact details';
  end if;
  -- New (20261103000000): the blocked words, after the filters that were here
  -- first, so a post that breaks two rules is refused for the same one as before.
  if public.board_text_has_blocked_term(v_nickname) then
    raise exception 'board nickname must not contain a blocked word';
  end if;
  if public.board_text_has_blocked_term(v_body) then
    raise exception 'board post must not contain a blocked word';
  end if;

  v_writer := 'board:' || coalesce(v_client, 'session:' || new.session_id);
  new.nickname := v_nickname;
  new.body := v_body;
  new.hidden := false;
  new.created_at := now();
  new.actor_key := left(v_writer, 200);

  perform pg_advisory_xact_lock(hashtext(new.actor_key));

  -- The same device saying the same thing again is a retry: accepted and
  -- dropped, so the client sees success and the board stays as it was.
  if exists (
    select 1 from public.board_posts p
    where p.actor_key = new.actor_key
      and p.session_id = new.session_id
      and p.body = v_body
      and p.created_at > now() - interval '6 hours'
  ) then
    if not public.bump_rate_limit(new.actor_key || '|replay', interval '1 hour', 60) then
      raise exception using errcode = 'PT429', message = 'board rate limit exceeded';
    end if;
    return null;
  end if;
  -- The same words from another device on the address are refused out loud.
  if exists (
    select 1 from public.board_posts p
    where p.actor_key = new.actor_key
      and p.body = v_body
      and p.created_at > now() - interval '6 hours'
  ) then
    raise exception 'board post repeats a recent post';
  end if;

  if exists (
    select 1 from public.board_posts p
    where p.actor_key = new.actor_key
      and p.session_id = new.session_id
      and p.created_at > now() - interval '30 seconds'
  ) then
    raise exception using errcode = 'PT429', message = 'board posts must be at least 30 seconds apart';
  end if;
  select count(*) into v_recent
    from public.board_posts p
   where p.actor_key = new.actor_key
     and p.created_at > now() - interval '30 seconds';
  if v_recent >= 3 then
    raise exception using errcode = 'PT429', message = 'board posts must be at least 30 seconds apart';
  end if;

  if not public.bump_rate_limit(new.actor_key || '|' || new.session_id, interval '1 hour', 10)
    or not public.bump_rate_limit(new.actor_key, interval '1 hour', 30) then
    raise exception using errcode = 'PT429', message = 'board rate limit exceeded';
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_board_post_insert() from public, anon, authenticated;

notify pgrst, 'reload schema';
