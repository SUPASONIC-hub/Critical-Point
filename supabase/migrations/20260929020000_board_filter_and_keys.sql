-- 참가자 게시판: a link filter that reads Korean, a writer key that is not an
-- address, and a duplicate rule that does not lie to the second person.
--
-- What the audit found in 20260928010000:
--
-- 1. The link pattern ended in `\y`. A word boundary is decided by the
--    database's ctype, and in a UTF-8 ctype a Hangul syllable is a word
--    character -- so a domain with a particle attached (`spam.com으로 오세요`,
--    the way Korean is actually written) has no boundary after the TLD and
--    never matched. The browser's copy used JavaScript's `\b`, which is ASCII
--    only and did match, so the honest client was stricter than the server,
--    which is the wrong way round. Both now end the TLD with an explicit
--    lookahead, `(?![a-z0-9-])`: whatever follows, it is not more of the name.
--    Both read one fixture list (`tests/fixtures/board-filter-cases.json`), so
--    the next disagreement fails a check instead of reaching the board.
--
-- 2. `[a-z0-9-]+` before the dot meant a Hangul label (`스팸.com`, `가게.kr`,
--    `예시.한국`) was never a domain. The label may now be Hangul. The spaced
--    form (`example. com`) stays ASCII-only: a Korean sentence ends in ". "
--    all the time.
--
-- 3. `actor_key` held the raw address for 180 days beside a nickname. It holds
--    `request_client_key()` now (20260929000000), which is a keyed hash and one
--    key per IPv6 /64.
--
-- 4. The duplicate rule answered a second person's identical post with the
--    success a retry gets -- "글을 올렸습니다" -- and stored nothing. Two students
--    behind one school address writing the same short line is ordinary. A
--    repeat from the same device is still accepted and dropped (that is a
--    retry); the same body from another device on the address is refused out
--    loud, so the writer is told and can say it differently.
--
-- 5. The accepted-and-dropped branch returned before anything was counted.
--    It is counted now, on its own key.
--
-- Refusals that time cures are raised as PT429 (see 20260929010000).

create or replace function public.board_text_has_link(p_text text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  with folded as (
    select regexp_replace(
      regexp_replace(
        lower(coalesce(p_text, '')),
        '\s*(\[\.\]|\(\.\)|\[dot\]|\(dot\)|\{dot\}|。|．|｡)\s*',
        '.',
        'g'
      ),
      '([a-z0-9-])\s+\.\s*([a-z])',
      '\1.\2',
      'g'
    ) as t
  )
  select t ~ '(https?:|hxxps?:|www\.|닷\s*컴|[a-z0-9가-힣-]+(\.|\s+dot\s+)(com|net|org|io|kr|co|xyz|top|ru|cn|me|ly|gg|app|link|site|online|shop|store|info|biz|tv|to|cc|be|us|uk|jp|de|fr|in|ai|dev|so|la|page|club|live|fun|icu|vip|win|pro|sh|ws|tk|ml|ga|cf|gq|gl|im|am|fm|one|click|lol|bio|zip|mov|pw|su|ooo|asia|cloud|space|website|tech|world|today|news|blog|한국|xn--[a-z0-9-]+)(?![a-z0-9-]))'
      -- "example. com": a space only after the dot is also how sentences end, so
      -- it only counts for the TLDs nobody ends a Korean sentence with.
      or t ~ '[a-z0-9-]+\.\s+(com|net|org|xyz|io|kr)(?![a-z0-9-])'
  from folded;
$$;

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
