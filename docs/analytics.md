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
  (방침 12번의 「시행 7일 전부터 알림」, 사용자 결정 10-30: 예고는 지금, 켜기는 11-12). 켠 빌드에서는 그 예고가 빠집니다
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
| 1 | Render → Settings → Headers의 `/*` Content-Security-Policy를 위 출처를 더한 값으로 | 사용자 |
| 2 | Render 환경 변수 `GA_MEASUREMENT_ID`를 넣고 「Save, rebuild, and deploy」 | 사용자 |
| 3 | 위 확인 명령 | 사용자 또는 Claude |
| 4 | GA4 → 관리 → 데이터 보관 기간이 2개월인지(방침이 2개월이라고 말함), Google 신호가 꺼져 있는지 | 사용자 |
