# 웹 광고(Google AdSense) 켜는 순서 — 출시 로드맵 2단계

지금(1단계)은 광고가 없습니다. 이 문서는 2단계에서 웹에 AdSense를 붙일 때의 순서입니다. 코드는 미리
들어가 있고 **기본은 꺼짐**입니다. 스위치는 Render 환경 변수 세 개이며, 빌드할 때만 읽습니다
(`scripts/adsense-config.mjs`, `vite.config.js`의 `adsense()`).

| 환경 변수 | 값 | 켜지는 것 | 번들 JS |
| --- | --- | --- | --- |
| (없음) | — | 아무것도 없음. 지금 운영과 같은 빌드 | 변화 0 |
| `ADSENSE_CLIENT` | `ca-pub-` + 16자리 | **사이트 확인용**: `index.html`의 `<meta name="google-adsense-account">`, 빌드 산출물 `/ads.txt` | 변화 0 (`sw.js`의 파일 목록만 바뀜) |
| `ADSENSE_ADS` | `on` | 광고 자리(`src/ads/AdSlot.jsx`)와 AdSense 스크립트, 개인정보처리방침·이용약관의 광고 문장 | 광고 자리가 있는 화면 청크만 늘어남 |
| `ADSENSE_SLOTS` | `report:<광고 단위 번호>` (쉼표로 여럿, `ranking:<번호>`) | `ADSENSE_ADS=on`일 때 그 자리만 그림 | — |

게시자 ID(`ca-pub-…`)는 저장소에 쓰지 않고 Render 환경 변수로만 둡니다. 다만 이 값은 원래 비밀이 아니라
광고가 나오는 페이지와 `ads.txt`에 누구나 볼 수 있게 공개되는 값입니다.
이름에 `VITE_`를 붙이지 않는 것은 일부러입니다. Vite는 `VITE_` 변수를 전부 `import.meta.env`에 넣고, 그 객체를
통째로 읽는 코드가 있어서 `VITE_`로 두면 사이트 확인만 켠 빌드에도 진입 청크·런타임 청크에 ID가 들어갔습니다(측정).

## 순서

| # | 할 일 | 누가 | 확인 |
| --- | --- | --- | --- |
| 1 | 도메인: 지금 주소 `critical-point-wn6p.onrender.com`으로 신청해도 됩니다(아래 「도메인」). 자기 도메인으로 옮길 생각이면 **신청 전에** 옮깁니다 — 승인은 사이트 주소마다 받습니다 | 사용자 | 새 주소에서 게임이 열림 |
| 2 | Render 환경 변수 `ADSENSE_CLIENT` 하나만 넣고 배포(사이트 확인용, 광고 없음) | 사용자(값) / 배포는 자동 | 아래 「확인 명령」 |
| 3 | AdSense 콘솔 → 사이트 → 사이트 추가 → 확인 방법 「메타 태그」 또는 「ads.txt」 → 검토 요청 | 사용자 | 콘솔에 「준비 중」 |
| 4 | 승인(보통 며칠~몇 주, Google이 기간을 약속하지 않음). 거절되면 사유를 보고 고친 뒤 다시 요청 | Google | 콘솔에 「준비됨」 |
| 5 | AdSense 콘솔에서 광고 단위 만들기: 디스플레이 광고, **고정 크기 300×250**(자리 높이를 고정하므로 반응형 말고). 받은 번호가 `ADSENSE_SLOTS`의 값 | 사용자 | 광고 단위 번호 |
| 6 | 「개인정보 보호 및 메시지」에서 유럽 규정(EEA·영국·스위스) 메시지 만들기 — Google 인증 동의 창. 문구는 Google 기본 문안 | 사용자 | 콘솔에 메시지 게시됨 |
| 7 | 방침 공지: 광고 문장이 들어간 방침은 방침 12번대로 **시행 7일 전**부터 알립니다. `scripts/legal-pages.mjs`의 `EFFECTIVE_DATE`를 시행일로 바꾸는 PR(광고 문장은 `AD_EDITS`, 켜지면 자동으로 들어감) | Claude | `renderLegalPages({ ads: true })` 유닛 테스트 |
| 8 | Render 대시보드 헤더: CSP를 아래 「CSP」의 값으로 | 사용자 | `npm run check:deploy`(CSP 기대값도 같이 바꾼 PR 뒤) |
| 9 | Render 환경 변수 `ADSENSE_ADS=on`, `ADSENSE_SLOTS=report:<번호>`를 넣고 배포 | 사용자 | 리포트 맨 아래 「광고」 칸, 방침 10번 |
| 10 | `ads.txt` 상태: AdSense 콘솔 → 사이트 → ads.txt 「승인됨」 | 사용자 | 아래 curl |

시험 주(W47 같은)나 문제가 생기면 `ADSENSE_ADS`를 지우고 다시 배포하면 광고 코드가 없는 빌드로
돌아갑니다(사이트 확인용 meta·ads.txt는 남음).

## Render 환경 변수 (대시보드 → 서비스 → Environment)

| Key | Value | 언제 |
| --- | --- | --- |
| `ADSENSE_CLIENT` | `ca-pub-0000000000000000`(AdSense 콘솔 → 계정 → 계정 정보의 게시자 ID 앞에 `ca-`) | 2번 |
| `ADSENSE_ADS` | `on` | 9번 |
| `ADSENSE_SLOTS` | `report:1234567890` | 9번 |

환경 변수를 바꾼 뒤에는 새로 빌드해야 반영됩니다(Render의 「Save, rebuild, and deploy」 또는 `main` 다음 배포).

## 확인 명령

```sh
# 2번 뒤: meta 태그와 ads.txt (값이 콘솔의 게시자 ID와 같아야 함)
curl -s https://critical-point-wn6p.onrender.com/ | grep -o '<meta name="google-adsense-account"[^>]*>'
curl -s https://critical-point-wn6p.onrender.com/ads.txt
# → google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0

# 2번 뒤에도 광고 스크립트는 없어야 함 (아무것도 안 나오면 정상)
curl -s https://critical-point-wn6p.onrender.com/ | grep -o 'adsbygoogle'

# 9번 뒤: 방침에 광고 절
curl -s https://critical-point-wn6p.onrender.com/privacy.html | grep -o 'Google AdSense' | head -1
```

## 광고 자리

| 자리 | 마커 | 언제 숨김 |
| --- | --- | --- |
| `report` — 사건 리포트 맨 아래(접힌 기록 보관함 아래) | `src/screens/ResultScreen.jsx` | 프롤로그 01~05의 리포트, 결말을 다 읽기 전(`endingStep < 3`) |
| `ranking` — 랭킹 화면 맨 아래(설명 문단 아래) | `src/screens/RankingScreen.jsx` | 없음 |

판(테이블)·결정·브리핑·첫 화면·게시판에는 마커가 없고, 유닛 테스트(`tests/unit/adsense.test.mjs`)가
그것을 지킵니다. 자리는 300×250 광고 + 한 줄 라벨로 **높이 276px 고정**이라 광고가 차든, 실패하든,
막히든 아래가 밀리지 않습니다. 300px는 폰 360px에서 양쪽 16px 여백 안에 들어갑니다. 움직임이 없고
(동작 줄이기와 무관), 낭독기는 「광고」 구역과 라벨 한 줄을 먼저 읽습니다.

마커는 JSX 주석 `{/* ad-slot: placement="report" … */}`이라 꺼진 빌드에서는 컴파일되면 없어집니다.
켠 빌드에서만 `<AdSlot … />`과 import로 바뀝니다.

## CSP (9번 전에 대시보드에)

Google은 AdSense 코드에 nonce를 쓰는 strict CSP만 지원한다고 합니다 — 광고 코드가 쓰는 도메인이 바뀌기
때문입니다([AdSense 도움말](https://support.google.com/adsense/answer/16283098)). Render 정적 호스팅은
응답마다 nonce를 만들 수 없으므로, 도메인을 나열하는 대신 script/frame/connect/img를 `https:`로 엽니다.
나머지(`default-src`, `frame-ancestors 'none'`, `object-src 'none'` 등)는 지금 값 그대로입니다. 값의
원본은 `scripts/adsense-config.mjs`의 `AD_CSP`입니다.

| Path | Name | Value |
| --- | --- | --- |
| `/*` | `Content-Security-Policy` | `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https:; media-src 'self' blob:; connect-src 'self' https:; script-src 'self' 'unsafe-eval' https:; frame-src https:; fenced-frame-src https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; manifest-src 'self'; worker-src 'self'` |

바뀌는 지시어만 보면: `script-src 'self'` → `'self' 'unsafe-eval' https:`, `connect-src 'self'
https://*.supabase.co` → `'self' https:`, `img-src`에 `https:`, 새로 `frame-src https:`·`fenced-frame-src
https:`. 다른 헤더(`Cross-Origin-Opener-Policy: same-origin`, `Permissions-Policy`의 `browsing-topics=()`)는
그대로 둡니다. `browsing-topics=()`는 Topics API를 끄므로 맞춤 광고 단가가 조금 낮을 수 있습니다[확인].

이 CSP로 바꾸는 PR에서는 `render.yaml`의 CSP 값과 `scripts/deploy-policy.mjs`의 기대값을 같이 바꿉니다
(이 draft는 운영 헤더를 바꾸지 않습니다).

## 도메인과 승인 조건 (2026-10-26 조사)

- **`*.onrender.com`으로 신청 가능**: AdSense가 받는 사이트는 「도메인」, 「Public Suffix List에 있는
  플랫폼의 하위 도메인(예: site.appspot.com)」, 「AdSense 플랫폼 파트너가 관리하는 사이트」입니다
  ([사이트 관리](https://support.google.com/adsense/answer/12170421)). `onrender.com`은 Public Suffix
  List에 있습니다(Render 등록, [PSL](https://publicsuffix.org/list/public_suffix_list.dat)). 그러니 자기
  도메인은 **필수가 아닙니다**. 다만 승인은 주소마다라 나중에 도메인을 옮기면 다시 받아야 하므로, 옮길
  생각이면 신청 전에 옮기는 편이 낫습니다. 랜덤 꼬리(`-wn6p`)가 붙은 플랫폼 주소가 심사에 불리한지는
  공식 문서에 없습니다[확인].
- **신청 자격**: 만 18세 이상, 사이트 HTML을 고칠 수 있을 것, 「고품질·독창적이며 방문자를 모으는
  콘텐츠」, 프로그램 정책 준수([자격 요건](https://support.google.com/adsense/answer/9724)). **최소
  트래픽·사이트 나이 기준은 공식 문서에 없습니다**(블로그들의 「6개월」, 「글 몇 개」는 비공식).
- **게임 사이트 정책**: 게임 화면(game interfaces)에는 콘텐츠 광고를 두지 말라고 합니다
  ([정책 입문](https://support.google.com/adsense/answer/23921)). 알림·이동·행동용 화면, 내용 없는 화면에도
  광고 금지([Inventory value](https://support.google.com/publisherpolicies/answer/11112688)). 그래서
  판·결정·브리핑을 빼고 글이 많은 리포트·랭킹 아래만 자리로 둡니다. 게임 속 칩·판돈 같은 표현이 「도박
  관련」 제한 광고 게재로 분류될 수 있는지는 [확인]. 대부분의 내용이 스크립트로 그려지는 단일 페이지라
  「가치가 낮은 콘텐츠」로 거절될 가능성도 [확인] — 거절되면 방침·약관 같은 글 페이지를 늘리는 쪽.
- **EU·영국·스위스**: 이 지역에 맞춤 광고를 내려면 Google 인증 동의 관리 플랫폼(TCF)이 필요합니다
  (EEA·영국 2024-01-16, 스위스 2024-07-31부터; [동의 관리 요건](https://support.google.com/adsense/answer/13554116)).
  AdSense 「개인정보 보호 및 메시지」의 유럽 규정 메시지가 그것입니다. 없으면 그 지역은 비맞춤·제한 광고만.
- **한국 개인·세금**: AdSense는 개인 계정으로 가입할 수 있고, 지급 전에 미국 세금 정보(개인은 W-8BEN)를
  내야 합니다. 안 내면 Google이 최고 세율로 원천징수할 수 있습니다
  ([미국 외 세금 정보](https://support.google.com/adsense/answer/14131950),
  [FAQ](https://support.google.com/adsense/answer/10735961)). 한미 조세조약으로 줄어드는 세율, 한국의
  사업자 등록·종합소득세 신고가 필요한지는 세무 확인[확인].
