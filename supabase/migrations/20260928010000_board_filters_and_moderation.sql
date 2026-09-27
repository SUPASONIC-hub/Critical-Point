-- 참가자 게시판: close the gaps the audit found in 20260923010000.
--
-- 1. The pace checks were check-then-act. The trigger read the hourly count,
--    then looked for a post in the last 30 seconds, then incremented -- two
--    concurrent requests both passed every read. Every check now runs under
--    `pg_advisory_xact_lock` on the writer's key, held until the insert commits,
--    so posts from one writer are decided one at a time.
--
-- 2. The checks were keyed on `session_id`, which the client chooses. A script
--    that sends a new one per request had no 30-second gap and no duplicate
--    check. The writer is now the address `request_client_ip()` vouches for
--    (the session only when there is no request, i.e. in tests and the SQL
--    editor), stored in `actor_key` -- a column anon can neither write nor read.
--    Per address: 3 posts per 30 seconds, 30 an hour, and one copy of a body per
--    6 hours. Per address and session: 1 per 30 seconds and 10 an hour. The two
--    levels are there because a classroom shares one address.
--
-- 3. The link filter only read the body, missed most TLDs (.me .ly .gg .app
--    .link ...), and missed `example . com`. It also never matched a bare
--    domain at all: it ended in `\b`, which in a Postgres regex is a backspace
--    character, not a word boundary (that is `\y`). It now reads the nickname
--    too, folds `[.]`, `(dot)`, full-width dots, and a space before a dot, and
--    catches 닷컴.
--
-- 4. `btrim` only removes ASCII spaces, so a body of newlines, tabs, U+3000 or
--    zero-width characters counted as text. `clean_board_text` strips invisible
--    characters and Unicode spaces at both ends, and a post needs two visible
--    characters.
--
-- 5. Phone numbers and e-mail addresses were only caught in the browser. The
--    trigger refuses them too, Korean mobile, landline and +82 forms included.
--    (Organisation names stay client-side: the pattern is too loose to be a
--    server-side refusal.)
--
-- 6. Moderation had no path but a hand-written UPDATE. `moderate_board_post`
--    hides or restores one post; only service_role can execute it.
--
-- `event_id` gets the same full unique constraint the telemetry tables got in
-- 20260928000000, so the client can name it as its ON CONFLICT target.

alter table public.board_posts add column if not exists actor_key text;
alter table public.board_posts add constraint board_posts_event_id_key unique (event_id);
drop index if exists public.board_posts_event_id_idx;
create index if not exists board_posts_actor_recent_idx on public.board_posts (actor_key, created_at desc);
create index if not exists board_posts_session_recent_idx on public.board_posts (session_id, created_at desc);

create or replace function public.clean_board_text(p_text text)
returns text
language sql
immutable
set search_path = ''
as $$
  select regexp_replace(
    regexp_replace(
      coalesce(p_text, ''),
      '[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F\u00AD\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]',
      '',
      'g'
    ),
    '^[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+|[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+$',
    '',
    'g'
  );
$$;

create or replace function public.board_visible_length(p_text text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select length(regexp_replace(coalesce(p_text, ''), '[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]', '', 'g'));
$$;

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
  select t ~ '(https?:|hxxps?:|www\.|닷\s*컴|[a-z0-9-]+(\.|\s+dot\s+)(com|net|org|io|kr|co|xyz|top|ru|cn|me|ly|gg|app|link|site|online|shop|store|info|biz|tv|to|cc|be|us|uk|jp|de|fr|in|ai|dev|so|la|page|club|live|fun|icu|vip|win|pro|sh|ws|tk|ml|ga|cf|gq|gl|im|am|fm|one|click|lol|bio|zip|mov|pw|su|ly|ooo|asia|cloud|space|website|tech|world|today|news|blog|xn--[a-z0-9-]+)\y)'
      -- "example. com": a space only after the dot is also how sentences end, so
      -- it only counts for the TLDs nobody ends a Korean sentence with.
      or t ~ '[a-z0-9-]+\.\s+(com|net|org|xyz|io|kr)\y'
  from folded;
$$;

create or replace function public.board_text_has_contact(p_text text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select lower(coalesce(p_text, '')) ~ '[^\s@]+@[^\s@]+\.[a-z]{2,}'
    or coalesce(p_text, '') ~ '(^|[^0-9])(\+?82[-.\s]?1[016789]|01[016789]|0[2-6][0-9]?|070|050[0-9]?)[-.\s)]{0,2}[0-9]{3,4}[-.\s]?[0-9]{4}([^0-9]|$)';
$$;

create or replace function public.validate_board_post_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip text := public.request_client_ip();
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

  v_writer := 'board:' || coalesce(v_ip, 'session:' || new.session_id);
  new.nickname := v_nickname;
  new.body := v_body;
  new.hidden := false;
  new.created_at := now();
  new.actor_key := left(v_writer, 200);

  perform pg_advisory_xact_lock(hashtext(new.actor_key));

  -- Accepted and dropped, not refused: a client that retries a post it already
  -- landed gets a success and the board stays as it was.
  if exists (
    select 1 from public.board_posts p
    where p.actor_key = new.actor_key
      and p.body = v_body
      and p.created_at > now() - interval '6 hours'
  ) then
    return null;
  end if;

  if exists (
    select 1 from public.board_posts p
    where p.actor_key = new.actor_key
      and p.session_id = new.session_id
      and p.created_at > now() - interval '30 seconds'
  ) then
    raise exception 'board posts must be at least 30 seconds apart';
  end if;
  select count(*) into v_recent
    from public.board_posts p
   where p.actor_key = new.actor_key
     and p.created_at > now() - interval '30 seconds';
  if v_recent >= 3 then
    raise exception 'board posts must be at least 30 seconds apart';
  end if;

  if not public.bump_rate_limit(new.actor_key || '|' || new.session_id, interval '1 hour', 10)
    or not public.bump_rate_limit(new.actor_key, interval '1 hour', 30) then
    raise exception 'board rate limit exceeded';
  end if;

  return new;
end;
$$;

revoke execute on function public.validate_board_post_insert() from public, anon, authenticated;

-- Hide (or restore) one post. From the SQL editor or with the service key:
--   select public.moderate_board_post(123);          -- hide
--   select public.moderate_board_post(123, false);   -- restore
-- Returns true when a post with that id exists. To find a writer's other posts,
-- read `actor_key` on the table itself as service_role.
create or replace function public.moderate_board_post(p_post_id bigint, p_hidden boolean default true)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  update public.board_posts set hidden = p_hidden where id = p_post_id returning true;
$$;

revoke all on function public.moderate_board_post(bigint, boolean) from public, anon, authenticated;
grant execute on function public.moderate_board_post(bigint, boolean) to service_role;

notify pgrst, 'reload schema';
