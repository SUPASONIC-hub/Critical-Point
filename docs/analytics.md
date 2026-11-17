# Google 애널리틱스 4 — 방문 통계

방문자 수, 많이 본 페이지, 유입 경로를 보는 스위치입니다. 기본은 꺼짐이고, 꺼진 빌드는 이 기능이 없던 빌드와
개인정보처리방침 3쪽의 변경 예고 한 문단(과 `sw.js`의 release 이름) 말고는 바이트까지 같습니다(`tests/unit/analytics.test.mjs`).

## 스위치 (`GA_MEASUREMENT_ID`)

| 환경 변수 | 값 | 들어가는 것 | 번들 JS |
| --- | --- | --- | --- |
| (없음) | — | 아무것도 없음 | 변화 0 |
| `GA_MEASUREMENT_ID` | `G-` + 대문자·숫자 6~12자 (GA4 속성 → 데이터 스트림 → 웹 스트림의 측정 ID) | 아래 표 | 변화 0 (`sw.js`의 파일 목록만 바뀜) |

켜면 들어가는 것:

| 어디 | 무엇 |
| --- | --- |
| `index.html`과 정적 페이지 15개의 `<head>` 끝 | `<script async src="https://www.googletagmanager.com/gtag/js?id=…">`와 `<script src="/assets/analytics-<hash>.js" defer>` |
| `/assets/analytics-<hash>.js` | Google 스니펫의 설정 부분(`gtag("config", …)`, Google 신호·광고 개인화 끔). 인라인이 아닌 파일인 까닭은 CSP가 `script-src 'self'`라 인라인 스크립트를 막고 `check:deploy`가 인라인 스크립트를 실패로 치기 때문 |
| 개인정보처리방침 3언어 | 2번 (5)/(e) 「방문 통계 — Google 애널리틱스」 절, 요약·3번 쿠키·6번 국외 이전 문장, 시행일 2026-11-12 (`ANALYTICS_POLICY`, `scripts/legal-pages.mjs`) |
| 자주 묻는 질문 3언어 | 쿠키 문장 하나 (`ANALYTICS_FAQ`, `scripts/site-pages.mjs`) |

- `ADSENSE_CLIENT`처럼 이름에 `VITE_`가 없습니다. 게임 코드는 측정 ID를 모르고, 태그는 페이지에만 있습니다.
- 개발 서버, e2e 빌드(`--mode e2e`), 디버그 빌드(`VITE_ENABLE_DEBUG_TOOLS=true`)에는 변수가 있어도 들어가지 않습니다
  (`analyticsFor`, `scripts/analytics-config.mjs`). 테스트의 네트워크 픽스처(`tests/helpers/network.js`)는 다른 출처
  요청을 막고 실패로 칩니다.
- 형식이 틀리면 빌드가 실패합니다.
- 서비스 워커는 다른 출처 요청을 건드리지 않으므로 Google 요청은 캐시되지 않습니다. 설정 파일은 같은 출처의
  `/assets/` 파일이라 다른 자산처럼 미리 받습니다.
- 방침의 그 절은 켠 빌드에만 있습니다. 꺼진 빌드의 방침은 「분석용 쿠키나 외부 추적 도구를 쓰지 않습니다」를
  그대로 말하고, 시행일 아래에 「2026년 11월 12일부터 … Google 애널리틱스를 사용합니다」 변경 예고 한 문단이 있습니다
  (방침 12번의 「시행 7일 전부터 알림」, 우리 결정 10-30: 예고는 지금, 켜기는 11-12). 켠 빌드에서는 그 예고가 빠집니다
  (`ANALYTICS_NOTICE`, `scripts/legal-pages.mjs`).

## CSP (Render 대시보드 → Settings → Headers)

태그가 Google에서 스크립트를 받고 Google로 보내므로 `/*`의 Content-Security-Policy에 Google 출처가 있어야 합니다.
`render.yaml`의 값이 이미 그 값이고, 대시보드의 같은 줄을 이 값으로 바꿉니다(Supabase 주소는 대시보드에 있는 프로젝트
주소 그대로 둡니다). 와일드카드 없이 호스트마다 적습니다(`check:deploy`가 `connect-src`의 와일드카드를 실패로 침).

| 지시어 | 더하는 출처 |
| --- | --- |
| `script-src` | `https://www.googletagmanager.com` |
| `connect-src` | `https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://region1.analytics.google.com` |
| `img-src` | `https://www.google-analytics.com https://www.googletagmanager.com` |

태그가 있는 페이지가 이 출처를 허용하지 않는 CSP로 나가면 `check:deploy`(배포 뒤 확인)가 실패합니다
(`analyticsCspProblems`, `scripts/deploy-policy.mjs`). 그래서 **헤더를 먼저 바꾸고** 변수를 넣습니다.

## Render 환경 변수 (대시보드 → 서비스 → Environment)

| Key | Value |
| --- | --- |
| `GA_MEASUREMENT_ID` | `G-CN8M5TQ77N` |

환경 변수는 빌드할 때 읽으므로 넣은 뒤 다시 빌드해야 반영됩니다(「Save, rebuild, and deploy」 또는 다음 배포).

## 확인 명령

```sh
curl -s https://critical-point-wn6p.onrender.com/ | grep -o '<script[^>]*googletagmanager[^>]*>'
curl -s https://critical-point-wn6p.onrender.com/ | grep -o '/assets/analytics-[0-9a-f]*\.js'   # 그 파일을 curl로 열어 측정 ID 확인
curl -s https://critical-point-wn6p.onrender.com/privacy.html | grep -c 'Google 애널리틱스'      # 1 이상
curl -sI https://critical-point-wn6p.onrender.com/ | grep -i content-security-policy | grep -o 'googletagmanager[^;]*'
```

그다음 GA4 → 보고서 → 실시간에서 자기 방문이 보이는지 봅니다.

## 순서

| # | 할 일 | 누가 |
| --- | --- | --- |
| 1 | Render → Settings → Headers의 `/*` Content-Security-Policy를 위 출처를 더한 값으로 | 우리 |
| 2 | Render 환경 변수 `GA_MEASUREMENT_ID`를 넣고 「Save, rebuild, and deploy」 | 우리 |
| 3 | 위 확인 명령 | 우리 또는 Claude |
| 4 | GA4 → 관리 → 데이터 보관 기간이 2개월인지(방침이 2개월이라고 말함), Google 신호가 꺼져 있는지 | 우리 |

## 게임 이벤트와 공유 주소 (N2·N3·N12, 2026-11-12)

게임 코드는 측정 ID를 모르고, 페이지에 Google 태그(`window.gtag`)가 있을 때만 보냅니다(`src/gameEvents.js`). 그래서 개발 서버·e2e·디버그 빌드와
ID 없는 빌드에서는 아무것도 나가지 않습니다. 이름과 0 이상의 정수만 보내고(그 밖의 값은 버림), 플레이어 이름·세션 코드·선택은 보내지 않습니다.
방침의 거부 방법(차단 부가기능, 쿠키 차단)은 Google 태그가 지키므로 이 이벤트에도 그대로 적용됩니다.

| 이벤트 | 언제 | 값 |
| --- | --- | --- |
| `cp_start_pressed` | 첫 화면에서 「프롤로그 시작」(저장이 있으면 확인 뒤) 누름, 페이지당 한 번 | 없음 |
| `cp_first_table_open` | 프롤로그 01의 첫 판이 열림(브리핑 닫힘), 페이지당 한 번 | 없음 |
| `cp_prologue01_done` | 프롤로그 01이 처음 닫힘(다시 하기는 세지 않음) | 없음 |
| `cp_lcp` / `cp_inp` | 페이지 20개 중 1개(5%)만, 처음 숨겨지거나 닫힐 때 한 번 | `value` = 밀리초 정수 |

- 속도 측정 코드(`src/webVitals.js`)는 뽑힌 5%만 `load` 뒤에 받습니다. 나머지는 받지 않습니다.
- **주간 「폰 속도」 줄(N28, `scripts/report-web-vitals.mjs`)**: Funnel 워크플로가 N17과 같은 Secrets(`GA4_SA_KEY`, `GA4_PROPERTY_ID`)로
  지난 7일과 그 전 7일의 LCP·INP p75를 기기 종류(폰·태블릿·PC)별로 읽어 Job Summary에 붙입니다. 기준(LCP 2.5초, INP 200ms)을
  넘으면 ⚠와 경고 한 줄, 실행은 실패하지 않습니다. 표본 20개 미만 칸은 「적음」(4주 모인 뒤 판단). Secrets가 없으면 읽지 않았다는 한 줄만.
  p75에는 이벤트 하나하나의 값이 필요해서 **맞춤 측정기준 하나를 등록**해야 합니다(사용자 2분): GA4 → 관리 → 맞춤 정의 →
  맞춤 측정기준 만들기 → 이름 `value`, 범위 「이벤트」, 이벤트 매개변수 `value`. 등록 전에는 평균(이벤트 값 합 ÷ 수)으로
  대신 쓰고 그렇다고 적으며, 등록한 날부터 쌓인 것만 p75로 읽힙니다(아래 줄의 「등록 필요 없음」은 보고서 화면에서 볼 때 이야기).
- 공유 문장의 주소는 `/?from=card&h=<판단 습관 id>`입니다(`src/shareLink.js`). GA 페이지 조회의 주소에 그대로 남으므로
  탐색 분석에서 `page_location`에 `from=card`가 든 방문을 세면 공유로 온 방문입니다. 받은 사람의 첫 화면에는
  「친구의 결과: ○○형」 한 줄이 그 사람의 언어로 나옵니다. 열한 개 id 말고는 아무것도 찍히지 않습니다.
- GA4에서 `value` 말고 다른 매개변수는 없으므로 맞춤 측정기준 등록은 필요 없습니다. 보고서 → 참여도 → 이벤트에서 봅니다.

## GA4 숫자를 funnel 요약에 (N17, `scripts/report-ga4.mjs`)

Funnel 워크플로(매일 22:10 KST)가 GA4 Data API로 첫 시간 숫자를 읽어 Job Summary 끝에 「첫 시간 (GA4)」 절을 붙입니다.

- 주별(최근 8주): 시작 누름(`cp_start_pressed`) → 첫 판(`cp_first_table_open`) → 프롤로그 01 끝(`cp_prologue01_done`)의 사용자 수와 앞 단계 대비 비율
- 장면별(최근 28일): 프롤로그 01·02 장면마다 사용자 수와 그 사건 첫 장면 대비 비율(N16의 `cp_scene`, 맞춤 측정기준 `case_no`·`scene_no` 등록 뒤)
- 합계·비율만 씁니다. 사람·기기·주소·지역은 묻지 않습니다(저장소와 실행 요약은 공개).

GitHub Secrets 둘이 있어야 읽습니다. 없으면 「비밀이 없어 GA4를 읽지 않았습니다」 한 줄만 쓰고 나머지 요약은 그대로입니다.

| Secret | 값 |
| --- | --- |
| `GA4_SA_KEY` | 서비스 계정 JSON 키 파일의 내용 전체 |
| `GA4_PROPERTY_ID` | GA4 속성 번호(숫자, 관리 → 속성 설정 → 속성 ID). 측정 ID `G-…`가 아님 |

등록 순서(사용자, 약 15분):

1. Google Cloud 콘솔 → 프로젝트 하나(새로 만들어도 됨) → API 및 서비스 → 라이브러리 → 「Google Analytics Data API」 사용 설정
2. IAM 및 관리자 → 서비스 계정 → 만들기(이름 예: `cp-funnel-reader`, 역할은 주지 않음) → 그 계정 → 키 → 키 추가 → JSON → 파일이 내려받아짐
3. GA4 관리 → 속성 액세스 관리 → + → 2의 서비스 계정 이메일(`…@….iam.gserviceaccount.com`)을 **뷰어**로 추가
4. GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret: `GA4_SA_KEY`(2의 JSON 파일 내용 전체), `GA4_PROPERTY_ID`(속성 번호)
5. Actions → Funnel → Run workflow로 한 번 돌려 요약 끝 「첫 시간 (GA4)」 표를 확인. 내려받은 JSON 파일은 지웁니다(키는 Secrets에만)
6. (N16 배포 뒤) GA4 관리 → 맞춤 정의 → 맞춤 측정기준 만들기: 범위 「이벤트」, 이벤트 매개변수 `case_no`, `scene_no` 둘. 등록 전에는 장면별 표 대신 「아직 등록되지 않았습니다」가 나옵니다
