# 웹 광고(Google AdSense) — 출시 로드맵 2단계

지금(1단계)은 광고가 없습니다. 2단계에서 AdSense를 붙이기 전에, 1단계 동안 **사이트 승인만 먼저** 받아 둘 수
있게 사이트 확인 스위치를 넣었습니다. 광고 자리·광고 스크립트·방침 광고 절·CSP 변경은 draft #341에 있고
이 저장소에는 아직 없습니다.

## 사이트 확인 (`ADSENSE_CLIENT`)

| 환경 변수 | 값 | 들어가는 것 | 번들 JS |
| --- | --- | --- | --- |
| (없음) | — | 아무것도 없음. 지금 운영과 같은 빌드 | 변화 0 |
| `ADSENSE_CLIENT` | `ca-pub-` + 16자리 | `index.html` `<head>`의 `<meta name="google-adsense-account">`, 빌드 산출물 `/ads.txt` | 변화 0 (`sw.js`의 파일 목록만 바뀜) |

- 광고 스크립트(`adsbygoogle.js`)는 넣지 않습니다. 플레이어 브라우저가 Google에 아무것도 요청하지 않고 쿠키도
  생기지 않으므로 개인정보처리방침은 그대로입니다(광고를 켤 때 광고 절을 더함, #341).
- 게시자 ID는 저장소에 쓰지 않고 Render 환경 변수로만 둡니다. 다만 이 값은 원래 비밀이 아니라 `ads.txt`와
  광고가 나오는 페이지에 누구나 볼 수 있게 공개되는 값입니다.
- 이름에 `VITE_`를 붙이지 않는 것은 일부러입니다. Vite는 `VITE_` 변수를 전부 `import.meta.env`에 넣고, 그
  객체를 통째로 읽는 코드가 있어서 `VITE_`로 두면 진입·런타임 청크에 ID가 들어갔습니다(2026-10-26 측정).
- `check:bundle`은 `ADSENSE_ADS=on`(광고 켜기, #341)이 아닌 빌드의 스크립트에 광고 코드가 있으면 실패합니다.

### Render 환경 변수 (대시보드 → 서비스 → Environment)

| Key | Value |
| --- | --- |
| `ADSENSE_CLIENT` | `ca-pub-0000000000000000` (AdSense 콘솔 → 계정 → 계정 정보의 게시자 ID, 앞에 `ca-`) |

환경 변수는 빌드할 때 읽으므로 넣은 뒤 다시 빌드해야 반영됩니다(「Save, rebuild, and deploy」 또는 다음 배포).

### 확인 명령

```sh
curl -s https://critical-point-wn6p.onrender.com/ | grep -o '<meta name="google-adsense-account"[^>]*>'
curl -s https://critical-point-wn6p.onrender.com/ads.txt
# → google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
curl -s https://critical-point-wn6p.onrender.com/ | grep -o 'adsbygoogle'   # 아무것도 안 나오면 정상
```

### 순서

| # | 할 일 | 누가 |
| --- | --- | --- |
| 1 | Render 환경 변수 `ADSENSE_CLIENT`를 넣고 다시 배포 | 사용자 |
| 2 | 위 확인 명령으로 meta·`ads.txt` 확인 | 사용자 또는 Claude |
| 3 | AdSense 콘솔 → 사이트 → 사이트 추가(`critical-point-wn6p.onrender.com`) → 확인 방법 「메타 태그」 또는 「ads.txt」 → 검토 요청 | 사용자 |
| 4 | 승인(기간은 Google이 약속하지 않음). 거절되면 사유를 보고 고친 뒤 다시 요청 | Google |

## 도메인은 필요 없음

AdSense가 받는 사이트는 「도메인」, 「Public Suffix List에 있는 플랫폼의 하위 도메인(예: site.appspot.com)」,
「AdSense 플랫폼 파트너가 관리하는 사이트」입니다([사이트 관리](https://support.google.com/adsense/answer/12170421)).
`onrender.com`은 Public Suffix List에 있습니다(Render 등록,
[PSL](https://publicsuffix.org/list/public_suffix_list.dat)). 그래서 지금 주소로 신청할 수 있습니다. 승인은
주소마다 받으므로 자기 도메인으로 옮길 생각이면 신청 전에 옮기는 편이 낫습니다.

## 광고 켜기 (draft #341)

광고 자리(리포트 맨 아래), 광고 스크립트, 방침·약관 광고 문장, CSP(`https:`로 열기)는 #341에 있습니다.
