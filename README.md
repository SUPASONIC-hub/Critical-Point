# CRITICAL POINT (임계점)

Tak'n Roll 제작, SUPASONIC 기획·개발.

선택 하나가 다음 사건을 바꾸는 대화형 스토리 게임입니다. 플레이어는 제한된 시간과 자원 안에서
무엇을 먼저 지킬지 결정하고, 그 선택이 다음 사건의 조건과 결말에 반영되는 흐름을 경험합니다.

React 19 + Vite 단일 페이지 앱이고, 서버 없이도 완결됩니다. Supabase는 원격 랭킹과 플레이테스트
텔레메트리에만 쓰이는 선택 사항입니다.

## 실행

```bash
npm ci
npm run dev
```

브라우저에서 터미널이 알려주는 `http://127.0.0.1:<port>`를 엽니다.

## 게임

- **사건과 선택** — 5개 사건과 최종 사건. 선택이 다음 장면의 질문 자체를 바꾸고, 앞선 사건에서
  확보한 단서와 기억이 뒤 사건의 선택지를 엽니다.
- **자원** — 시간, 현금, 믿음, 공정함, 사람 피해, 지침 변화를 함께 추적합니다. 어떤 선택도
  공짜가 아니며, 한 축을 올리면 다른 축을 냅니다.
- **자유입력** — 조건을 만족한 서술형 해결안은 실제 분기로 승격되어 집필된 장면으로 이어집니다.
- **판단 레일** — 상황·선택·확정을 분리한 관제형 플레이 화면. 압력 미터, 선택 예보, 장면 목표,
  예상 자원 변화를 선택 전에 비교할 수 있습니다.
- **보상** — 장면 목표 연속 달성(STREAK BREAKTHROUGH), 5연속 달성(PERFECT RUN), 숨은 단서
  발견(EVIDENCE BONUS)이 선택 직후 연출창에 뜹니다.
- **결말** — 자원 임계값과 누적된 선택 성향으로 갈리는 엔딩과 최종 결과 리포트.

### 키보드

| 키 | 동작 |
|---|---|
| 숫자 키 | 선택지 미리보기 |
| `↑`/`↓` 또는 `J`/`K` | 선택지 순환 |
| `Enter` / `Space` | 선택 확정 |
| `Escape` | 검토 취소 |
| `P` / `Shift+P` | 저장 / 저장 후 나가기 |
| `R` / `N` | (결과 화면) 재도전 / 다음 사건 |

### 데이터와 접근성

- 브라우저 자동 저장, 완료 기록 JSON 내보내기, 로컬 랭킹은 서버 없이 동작합니다.
- 일반 저장과 별도로 최근 5개 복구 슬롯을 유지하며, 장면 이동·사건 완료·에러 같은 체크포인트에서만
  만듭니다. 저장된 사건과 장면이 어긋나면 해당 사건 시작 장면으로 보정하고 복구 알림을 남깁니다.
- 실명, 연락처, 회사명을 감지해 익명화를 돕고, 분석관 이름과 자유입력 길이를 제한합니다.
- 장면·엔딩·초상화는 WebP로 제공하며 480/960px 변형을 함께 둡니다. 키 비주얼만 `<picture>`와
  `image-set`의 JPEG 대체본을 갖습니다.
- 배경음은 사용자 제스처 이후 장면 분위기에 맞춰 재생됩니다.

## 검증

```bash
npm run verify        # 정적 검증 + 빌드 + 런타임 스모크 + E2E
npm run verify:quick  # 브라우저 E2E 없이
npm run verify:static # 브라우저 자체가 필요 없는 티어 (배포 빌드가 쓰는 것)
npm run test:visual   # 시각 회귀만
```

`verify:static`은 lint, CSS 포맷, 단위·스모크 테스트, 인코딩, 텍스트, CSS 토큰, CSS 구조,
그래프, 대사, 밸런스, 엔딩, 아트 예산, 뷰 계약, 상수, 런타임 예산, 시각 베이스라인, Node 핀
17개 검사입니다. `npm test`는 `node --test`로 돌아가므로 어서션 하나가 실패해도 나머지가 모두
실행되고 실패한 것만 이름으로 보고됩니다.

GitHub Actions는 PR에서 `verify:quick`만 돌리고, E2E는 push 또는 `e2e` 라벨에서 실행합니다.
전체 경로 검증(`npm run test:e2e:full`)은 `Full Coverage` 워크플로가 매주 월요일과 수동 실행으로
수행합니다. 시각 회귀는 별도 워크플로이며 베이스라인은 플랫폼별(`linux`, `win32`)로 커밋되어
있습니다.

## 생성물

브라우저로 측정해 만들고 저장소에 커밋하는 파일이 둘 있습니다. 배포 환경에는 Playwright
브라우저가 없으므로 빌드가 이것들을 다시 만들지 않습니다.

- `npm run build:art` — 반응형 이미지 변형. `npm run check:art`가 예산을 지킵니다.
- `npm run build:critical` — 인트로가 실제로 칠하는 CSS. `src/styles/critical.generated.css`에
  쓰고, `vite.config.js`가 이를 인라인한 뒤 전체 스타일시트를 비차단으로 내립니다. 생성 파일은
  잘라낸 스타일시트의 해시를 함께 기록하므로, 스타일이 바뀌면 빌드가 재생성을 요구하며 실패합니다.
  첫 페인트를 막는 바이트: 28.5KB gzip → 8.0KB gzip.

## 배포

Render 배포는 `render.yaml`을 사용합니다.

- Build: `npm ci --include=dev && npm run verify:static && npm run build`
- Publish: `dist`

`VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`는 값 없이 선언되어 있으므로 Render 대시보드에서
설정합니다. 없으면 앱은 텔레메트리와 원격 랭킹을 끈 채로 조용히 동작합니다.

## 원격 랭킹 (선택)

1. `.env.example`을 `.env`로 복사하고 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 채웁니다.
2. 배포 전에 스키마를 적용합니다. `npx supabase link --project-ref <ref>` 후 `npx supabase db push`.
   마이그레이션은 `supabase/migrations/`에 있고, 원격 이력이 유일한 출처입니다. 대시보드 SQL
   에디터로 직접 적용하지 마십시오.
3. 스키마는 공개 플레이테스트용 익명 insert를 허용하고, 텔레메트리 payload 형태·완주 점수 검증과
   시간당 요청 제한(`telemetry_rate_limits`)을 서버에서 겁니다.
4. 익명 읽기는 `playtest_sessions`의 RLS 정책(완주 시즌 행)과 컬럼 단위 grant로 제한됩니다.
   `run_id`, `session_code`, `player_name`, `case_id`, `case_title`, `completed_at`, `summary`만
   읽을 수 있고 `decision_log`, `session_id`, `id`는 읽히지 않으므로 `select *`는 거부됩니다.
   `public_rankings` 뷰는 `security_invoker = true`로 같은 규칙을 상속합니다.
5. 에러 로그 수집용 `app_error_logs`와 피드백용 `playtest_feedback`도 같은 baseline
   마이그레이션에 포함되어 있습니다. 별도로 만들 것은 없습니다.

공개 플레이테스트가 아니라면 전용 프로젝트를 쓰고 키를 주기적으로 교체하십시오.

원격 저장을 설정하지 않아도 플레이, 자동 저장, JSON 내보내기, 로컬 랭킹은 그대로 동작합니다.

## 개발 메모

- 개발 도구는 Vite 개발 모드에서 `?debug=1`을 붙이거나 `VITE_ENABLE_DEBUG_TOOLS=true`일 때만
  노출됩니다. 디버그 패널에서 복구 슬롯 복원·삭제, 기록된 사건/장면으로 바로 재현 진입,
  `playtest_sessions`·`playtest_feedback`·`app_error_logs` 읽기 점검을 할 수 있습니다.
  운영 RLS에서 anon 키를 insert 전용으로 두면 저장은 되어도 헬스체크는 `확인 필요`로 뜹니다.
- 에러가 나면 현재 저장본을 `paused`로 남기고 로컬 에러 로그를 기록합니다. 원격 전송은 데이터
  제공 동의가 있는 저장본에서만 하며, 대기열은 온라인 복귀 후 지수 백오프로 재시도합니다.
- 결과 화면의 기본 공유 요약은 `src/state/playtestExport.js`가 조립하며, `playerName`, `log`,
  `sessionId`, `errorLog`, `saveSlots`, `trace`가 빠지는지 단위 테스트로 고정합니다. 원문은
  디버그 진단 로그에만 들어갑니다.
- Windows PowerShell은 유효한 UTF-8 한글을 깨져 보이게 출력할 수 있습니다. 화면에서 깨져 보인다는
  이유로 원고를 고치기 전에 `npm run check:encoding`과 `npm run check:text`를 기준으로 삼으십시오.
- Prettier는 `src/styles`만 관리합니다(`npm run format`). `app.css`가 다시 압축된 형태로
  커밋되는 것을 막기 위한 장치이고, JS/JSX 포맷은 diff 가독성을 위해 강제하지 않습니다.
- ESLint(`npm run lint`)에서 `no-unused-vars`와 `no-undef`는 오류, `react-hooks/exhaustive-deps`와
  `react-hooks/set-state-in-effect`는 경고입니다. 후자는 `AppContent`가 아직 명령형으로 다루는
  효과들에 대한 남은 과제입니다.
- 코드를 바꾸기 전에 `docs/work-status.md`의 Maintenance Priorities를 읽으십시오. 지금 유효한
  규칙과 금지 사항의 유일한 출처입니다. 무엇을 왜 바꿨는지는 `docs/changelog/`에 있습니다.
