# 임계점 Prototype

인터랙티브 의사결정 게임 **임계점 — 판단이 깊어지는 순간**의 로컬 웹 프로토타입.

## 실행

```bash
npm install
npm run dev -- --port 5173
```

브라우저에서 `http://127.0.0.1:5173`을 연다.

## 현재 범위

- CASE 01 — 72 HOURS
- CASE 02 — FALSE SIGNAL
- CASE 03 — RED TEAM
- CASE 04 — THE PRICE
- CASE 05 — NO ONE TO BLAME
- FINAL — TRIGGER LAB

각 케이스는 선택지, 구조 재설계 자유입력, 에코 반론, 자원 변화, 결과 리포트를 포함한다.

## 파일 구조

```text
src/main.jsx      화면, 상태 관리, 케이스 전환
src/gameData.js   시즌/케이스/노드/선택지/반론 데이터
src/gameLogic.js  자원 계산, 자유입력 평가, 점수 초기화
src/styles.css    UI 스타일
```

## 테스트

```bash
npm run build
```

플레이테스트 절차는 `playtest-guide.md`를 따른다.

## Render 배포

현재 앱은 Vite 정적 사이트이므로 Render에서는 `Static Site`로 배포한다.

권장 설정:

- Repository: GitHub의 이 프로젝트 저장소
- Branch: `main`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Auto-Deploy: On Commit

대시보드 설정 대신 Blueprint를 사용할 경우 루트의 `render.yaml`을 사용한다.

절차:

1. GitHub 저장소에 현재 파일을 push한다.
2. Render Dashboard에서 `New` → `Static Site`를 선택한다.
3. GitHub 저장소를 연결한다.
4. 위 설정값을 입력하거나 `render.yaml` Blueprint를 사용한다.
5. 첫 배포가 끝나면 발급된 `onrender.com` URL을 플레이테스트 참가자에게 공유한다.

## 데이터 수집 방향

지금 버전은 브라우저 `localStorage`와 JSON 로그 내보내기로 테스트한다. 여러 사람의 데이터를 자동으로 모으려면 다음 단계에서 서버 저장을 붙여야 한다.

현재 코드는 Supabase 환경변수가 있고 플레이어가 시작 화면에서 데이터 제공에 동의하면 케이스 완료 시 플레이 로그를 자동 저장한다. 환경변수가 없거나 동의하지 않으면 저장 요청을 건너뛰고 기존 로컬 플레이만 동작한다.

무료 DB 추천:

- Supabase Free Plan
- 테이블 1개로 시작
- Render Static Site 환경변수에 Supabase URL과 anon key만 등록

Supabase 테이블 SQL:

```sql
create table public.playtest_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  player_name text,
  case_id text not null,
  case_title text,
  completed_at timestamptz not null,
  summary jsonb not null,
  resources jsonb not null,
  triggers jsonb not null,
  cognition jsonb not null,
  decision_log jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.playtest_sessions enable row level security;

create policy "allow anonymous playtest inserts"
on public.playtest_sessions
for insert
to anon
with check (true);
```

Render 환경변수:

```text
VITE_SUPABASE_URL=https://프로젝트ID.supabase.co
VITE_SUPABASE_ANON_KEY=Supabase anon public key
```

Render에 환경변수를 추가한 뒤 `Manual Deploy` 또는 GitHub push로 재배포한다.

권장 확장 구조:

- 프론트엔드: 현재 Vite 앱 유지
- API: Render Web Service 또는 Supabase Edge Function
- DB: Supabase Postgres 또는 Render Postgres
- 저장 데이터: 세션 ID, 케이스 ID, 선택 로그, 자원 변화, 자유입력 여부, 응답 시간, 결과 트리거

초기에는 Supabase 테이블 하나로 충분하다. 현재 원격 저장 payload는 이름을 저장하지 않고 `player_name`을 `null`로 보낸다. 자유입력 내용에는 개인정보가 들어갈 수 있으므로 공개 테스트 전에는 안내 문구와 삭제 요청 방법을 추가한다.

## 이미지 출처

인트로 배경 이미지는 Unsplash의 무료 이미지를 사용한다.

- Photo by Vitaly Gariev on Unsplash
- Source: https://unsplash.com/photos/two-colleagues-working-late-in-a-dimly-lit-office-S-YM-CY8X8A

## 주의

현재는 브라우저 `localStorage`에 진행 상태를 저장한다. 공개 베타 전에는 서버 저장 또는 DB 저장으로 교체해야 한다.
