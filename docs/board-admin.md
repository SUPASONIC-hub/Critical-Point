# 게시판 관리자 도구

만든 사람 두 명(SUPASONIC `from.logic.to.magic@gmail.com`, ALICE `goeun.nam@gmail.com`)만 게임 안 게시판 화면에서
글을 찾아보고, 숨기고, 되살리고, 영구 삭제할 수 있습니다. 로그인은 **Google 하나**입니다.

## 쓰는 법

1. 게임 주소 끝에 `?admin`을 붙여 엽니다(예: `https://critical-point-wn6p.onrender.com/?admin`, `#admin`도 됨).
   플레이어 화면에는 이 입구로 가는 링크가 없습니다.
2. 뜬 창에서 `Google로 로그인`을 누르고 본인 Google 계정을 고릅니다.
3. 「관리자 모드가 켜졌습니다」가 보이면 `게시판 열기`. 게시판 위에 관리 막대가 붙습니다.
   - 검색(본문·이름 일부), `숨긴 글 포함` 켜고 끄기, `더 보기`
   - 글마다 `숨기기` / `되살리기`, `같은 사람 글 N`, `영구 삭제`(확인 창), 신고 수
   - 숨긴 글은 점선 테두리와 `숨김` 또는 `신고로 자동 숨김` 표시
   - 막대 위 `신고 대기 N건` 배지: 사람이 볼 차례인 글 수(아래 「신고 대기」와 같은 기준)
   - 보기 셋: `글 검색` · `신고 대기` · `관리 기록`
     - `신고 대기`: 신고가 들어와 아직 보이는 글과 신고로 자동 숨김된 글(`auto_hidden_at`), 오래 기다린 글부터 50개.
       신고 수, 신고한 사람 수, 사유(광고·도배 등), 첫 신고 시각. `숨기기 확정`(= 숨기기) 또는
       `되살리기`/`그대로 두기`(= 되살리기, 신고도 지움). 어느 쪽이든 대기에서 빠집니다.
       기준은 `Board Reports` 워크플로(`scripts/board-reports.mjs`)의 「기다리는 글」과 같습니다.
     - `관리 기록`: `board_admin_log` 최근 50줄(언제·누가·숨김/되살림/영구 삭제·몇 번 글)
4. 로그인은 이 브라우저에 남습니다. 다음에는 `?admin` 없이 게시판만 열어도 관리 막대가 보입니다. 끝나면 `로그아웃`.

되살리기는 `Board Reports` 워크플로의 `restore`와 같습니다. 글이 다시 보이고(`kept_at`, 다시는 신고로 자동 숨김되지
않음) 그 글의 신고도 지웁니다. 숨기기는 `hide`와 같습니다. 영구 삭제는 글과 신고를 함께 지우며 되돌릴 수 없습니다.
숨기기·되살리기·삭제는 모두 `board_admin_log`에 누가·언제·몇 번 글을 남깁니다(본문은 남기지 않음).

## 막는 곳

진짜 관문은 서버입니다(`supabase/migrations/20261118000000_board_admins.sql`).

- `board_admins` 표의 두 주소이면서, Supabase Auth로 로그인했고(`authenticated`), 그 계정이 Google로 로그인한 적이
  있을 때(`app_metadata.providers`에 `google`)만 `is_board_admin()`이 참입니다. 같은 주소로 만든 이메일·비밀번호
  계정만으로는 관리자가 되지 않습니다.
- `admin_board_search` · `admin_board_same_writer` · `admin_board_set_hidden` · `admin_board_delete` ·
  `admin_board_me` 다섯 RPC는 `authenticated`만 실행할 수 있고, 관리자가 아니면 `board admin only`로 거절합니다.
  `admin_board_queue` · `admin_board_queue_count` · `admin_board_log`(`20261118010000_board_admin_queue.sql`)도 같습니다.
  글쓴이 키(`actor_key`)는 내보내지 않습니다. `npm run check:grants`가 이 규칙을 매번 돌려 봅니다.
- 화면(`src/boardAdmin.js`)도 두 주소가 아니면 바로 로그아웃시키지만, 이것은 안내일 뿐입니다.
- 관리자를 바꾸려면 SQL Editor에서 `insert into public.board_admins values ('새주소@gmail.com');`(소문자) 또는
  `delete from public.board_admins where email = '…';`. 화면 쪽 목록(`BOARD_ADMIN_EMAILS`)도 같이 고칩니다.

## 대시보드에서 한 번 할 일 (주인만)

**1. Google Cloud에서 OAuth 클라이언트 만들기**

- [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → OAuth consent screen: 앱 이름, 지원
  이메일. 사용자 유형 External, 게시 상태는 Testing이어도 됩니다(그때는 Test users에 두 Gmail 주소를 넣음).
- Credentials → Create credentials → OAuth client ID → Web application
  - Authorized JavaScript origins: `https://critical-point-wn6p.onrender.com`
  - Authorized redirect URIs: `https://kiazzdbpkazwqhhimdib.supabase.co/auth/v1/callback`
- 만들어진 Client ID와 Client secret을 복사합니다.

**2. Supabase → Authentication → Sign In / Providers → Google**

- Enable Sign in with Google: 켬, Client ID와 Client Secret 붙여 넣고 Save.

**3. Supabase → Authentication → URL Configuration**

- Site URL: `https://critical-point-wn6p.onrender.com`
- Redirect URLs에 추가: `https://critical-point-wn6p.onrender.com/**`
  (로그인 뒤 돌아오는 주소가 `https://critical-point-wn6p.onrender.com/?admin`입니다)

**4. 처음 로그인**

- 두 사람이 각자 `?admin`으로 한 번 로그인합니다. 처음 로그인할 때 Supabase가 Auth 사용자를 만듭니다.
- Authentication → Sign In / Providers의 「Allow new users to sign up」은 그 뒤 꺼도 됩니다. 꺼져 있는 동안
  처음 로그인하면 `Signups not allowed`가 창에 보입니다. 그때는 잠깐 켜고 로그인한 뒤 다시 끕니다. 켜 둔 채여도
  모르는 사람이 만든 계정은 서버가 관리자로 받지 않습니다(다만 Auth 사용자 목록에 남음).

## SQL로 하는 길 (예전 그대로)

로그인이 안 될 때는 Supabase SQL Editor에서 서비스 롤로 실행합니다.

```sql
select public.moderate_board_post(123);         -- 숨기기
select public.moderate_board_post(123, false);  -- 되살리기 (신고는 아래로 따로 지움)
delete from public.board_reports where post_id = 123;
delete from public.board_posts where id = 123;  -- 영구 삭제 (신고도 함께 지워짐)
```

`Board Reports` 워크플로의 손 실행(`hide` / `restore` / `dismiss`)도 그대로 쓸 수 있습니다.
