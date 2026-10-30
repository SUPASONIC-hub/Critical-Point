# 스토어 앱 껍데기 (안드로이드 TWA · iOS Capacitor)

웹 게임을 Google Play와 App Store에 올리기 위한 껍데기입니다. 웹(PWA)은 그대로이고, 웹 빌드·테스트·번들 예산은 이 폴더를 보지 않습니다. 광고·결제는 이 위에 올라가는 다음 PR에서 붙입니다(광고는 **앱판에만**, 웹판에는 넣지 않음 — 2026-10-25 결정).

## 구조

```
app/                         ← 껍데기 전용 작업 공간. 자기 package.json·node_modules
├─ package.json              ← @capacitor/core·ios·cli 8.5.3 (루트 node_modules와 섞지 않음)
├─ capacitor.config.json     ← appId com.taknroll.criticalpoint, 이름 「임계점」, webDir dist-app
├─ build-web.mjs             ← 루트 Vite로 `--mode app` 빌드 → app/dist-app (git 제외)
├─ build-ios-assets.mjs      ← public/profile.jpg로 iOS 아이콘(1024, 알파 없음)·시작 화면(2732)
├─ ios/                      ← `cap add ios`가 만든 Xcode 프로젝트(SPM, iOS 15+), git에 올림
│   └─ App/App/PrivacyInfo.xcprivacy  ← 개인정보 매니페스트(광고 없는 지금 기준)
└─ twa/
    ├─ twa-manifest.json     ← Bubblewrap 설정(안드로이드 프로젝트의 원본)
    └─ check-twa.mjs         ← 패키지 이름 일치·targetSdk 36·지문 자리표시 검사
public/.well-known/assetlinks.json   ← 웹 빌드에 실려 /.well-known/assetlinks.json으로 나감
src/platform/appShell.js             ← appShell() / isAppShell(): 웹 코드가 읽는 플랫폼 표시
```

### 플랫폼 표시 `src/platform/appShell.js`

- `appShell()` → `"web"`(기본) · `"ios"` · `"android"`, `isAppShell()` → 앱 안이면 `true`.
- iOS: Capacitor 네이티브 브리지가 페이지 코드보다 먼저 `window.Capacitor`를 넣으므로 웹 빌드에 따로 표시가 필요 없습니다.
- 안드로이드 TWA: 크롬이 사이트를 그대로 여므로, 실행 때 첫 페이지의 `document.referrer`가 `android-app://com.taknroll.criticalpoint/`인 것으로 압니다. 같은 방문의 새로 고침을 위해 sessionStorage `cp.appShell`에 적어 둡니다. 그래서 **처음 부르는 곳은 첫 페이지에서 불러야** 합니다(광고 PR이 시작할 때 한 번 부름).
- 지금은 아무 화면도 이 모듈을 import하지 않아 웹 번들에 들어가지 않습니다(보이는 변화 없음).

### `--mode app` 빌드

`app/build-web.mjs`가 루트의 Vite로 같은 페이지를 `app/dist-app`에 만듭니다. 다른 점은 둘입니다. 서비스 워커를 끕니다(`vite.config.js` `serviceWorkerSetting`): 파일이 이미 기기 안에 있고, WKWebView는 앱 자체 스킴에서 워커를 돌리지 않습니다. 그리고 사이트 확인 두 가지(AdSense의 `google-adsense-account` 메타·`/ads.txt`, Search Console의 `google-site-verification` 메타)를 `ADSENSE_CLIENT`·`GOOGLE_SITE_VERIFICATION`이 있어도 넣지 않습니다: 앱 안 페이지는 크롤러·AdSense 심사가 읽지 않고, 앱 광고는 AdMob입니다. 정적 페이지(방침·약관·소개·FAQ·문의)는 첫 화면 링크가 여는 곳이라 그대로 들어가고, 같이 만들어지는 `robots.txt`·`sitemap.xml`도 남습니다(앱 안에서 읽는 이 없음, 해 없음). Supabase 키는 사이트 빌드처럼 환경 변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)로 주고, 없으면 원격 랭킹·텔레메트리가 꺼진 채로 돕니다.

## 이 PC(Windows)에서 되는 것 / 안 되는 것

| | 여기서 됨 | 문서로만 |
|---|---|---|
| iOS | `npm run build:web`, `npx cap sync ios`(프로젝트에 웹 파일 복사), 아이콘 생성 | Xcode 빌드·서명·실기기·업로드(macOS + Xcode 26 필요) |
| 안드로이드 | `npm run check:twa`(설정 검사) | `bubblewrap update/build`(JDK 17·Android SDK 필요), 서명, Play 업로드 |

## iOS 빌드 (macOS, Xcode 26 이상)

App Store는 2026-04-28부터 **Xcode 26·iOS 26 SDK로 빌드한 것만** 받습니다. 최소 지원 OS는 프로젝트대로 iOS 15.

```sh
cd app
npm ci
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run sync:ios   # 웹 빌드 + cap sync ios
npx cap open ios                                                    # Xcode가 열림
```

1. Xcode › App 타깃 › Signing & Capabilities에서 **Team**을 고르면(자리표시: Apple Team ID) 번들 ID `com.taknroll.criticalpoint`로 자동 서명됩니다. 번들 ID는 App Store Connect에 먼저 등록.
2. 실기기 실행 → Product › Archive → Distribute App › App Store Connect.
3. 버전: `MARKETING_VERSION` 1.0.0, 빌드 번호 `CURRENT_PROJECT_VERSION`은 올릴 때마다 +1(CI면 실행 번호).
4. CI로 할 때: GitHub Actions `macos-26` 러너(Xcode 26 이미지)에서 `xcodebuild -project app/ios/App/App.xcodeproj -scheme App -configuration Release -archivePath build/App.xcarchive archive DEVELOPMENT_TEAM=<TEAM_ID>` 다음 `-exportArchive`. 인증서·프로비저닝 프로필·App Store Connect API 키는 GitHub Secrets에(워크플로는 서명 값이 생긴 뒤 추가).

아이콘·시작 화면은 `node app/build-ios-assets.mjs`(루트에서, Playwright 사용)로 다시 그립니다. 원본 `public/profile.jpg`가 256px라 1024 아이콘이 흐립니다 → **큰 원본으로 바꿀 것**(자리표시).

### 애플 4.2(웹사이트 재포장 금지) — 아직 없는 것

이 PR은 껍데기만입니다. 심사에 내기 전에 문서 A-2의 앱다운 기능이 들어가야 합니다: 햅틱(@capacitor/haptics), 로컬 알림(@capacitor/local-notifications, 기본 꺼짐), 공유 시트(@capacitor/share), 네이티브 저장(@capacitor/preferences), 상태 표시줄(@capacitor/status-bar), 오프라인은 이미 됨(웹 빌드가 앱 안에 들어 있음, 원격 URL을 띄우지 않음). 플러그인은 `app/package.json`에 넣고, 웹 쪽 호출은 `isAppShell()` 뒤에서 동적 import로(웹 번들 예산 영향 없음).

## 안드로이드 TWA 빌드 (Bubblewrap)

TWA는 크롬이 **배포된 사이트**(`https://critical-point-wn6p.onrender.com/`)를 주소창 없이 띄우는 방식입니다. 오프라인은 사이트의 서비스 워커가 맡습니다.

```sh
cd app/twa
npx @bubblewrap/cli@1.27.0 doctor      # 처음 한 번: JDK 17·Android SDK를 ~/.bubblewrap에 받음(몇 GB)
npx @bubblewrap/cli@1.27.0 update      # twa-manifest.json에서 안드로이드 프로젝트 생성(git 제외)
cd .. && npm run check:twa             # 패키지 이름·targetSdk 36 확인
cd twa && npx @bubblewrap/cli@1.27.0 build   # app-release-bundle.aab (서명 키 비밀번호 물음)
```

- Bubblewrap 1.27.0의 프로젝트 틀은 `compileSdkVersion 36`·`targetSdkVersion 36`입니다(Google Play: 2026-08-31부터 새 앱·업데이트는 API 36). `check:twa`가 생성된 `app/build.gradle`을 읽어 36 미만이면 실패합니다.
- minSdk 24(Android 7.0), 아이콘·마스커블 아이콘은 사이트의 `/icons/icon-512.png`·`/icons/icon-maskable-512.png`, 시작 화면은 배경 `#06090A` + 아이콘(Bubblewrap이 만듦).

### 서명과 assetlinks.json

1. 업로드 키 만들기(한 번, 잃으면 Play에 재설정 요청): `keytool -genkeypair -v -keystore app/twa/android.keystore -alias criticalpoint-upload -keyalg RSA -keysize 2048 -validity 10000`. keystore는 git 제외(`app/.gitignore`), 오프라인 사본 1벌 + 비밀번호는 비밀번호 관리자에.
2. Play Console에 AAB를 올리면 **Play 앱 서명**이 켜지고, 「앱 무결성 › 앱 서명 키 인증서」에 SHA-256이 나옵니다.
3. `public/.well-known/assetlinks.json`의 `00:00:…` 자리표시를 **Play 앱 서명 키 SHA-256**으로 바꾸고, 직접 설치해 볼 업로드 키 SHA-256(`keytool -list -v -keystore app/twa/android.keystore -alias criticalpoint-upload`)도 배열에 더합니다.
4. 배포 뒤 확인: `curl -i https://critical-point-wn6p.onrender.com/.well-known/assetlinks.json` → 200, `content-type: application/json`. 지문이 틀리면 앱이 주소창 달린 크롬 맞춤 탭으로 열립니다.
5. `npm run check:twa -- --release`가 통과해야 서명 준비 끝(자리표시 지문·프로젝트 없음이 오류).

자체 도메인(문서 E)으로 옮기면 `twa-manifest.json`의 `host`·`iconUrl`·`maskableIconUrl`·`webManifestUrl`·`fullScopeUrl`을 바꾸고 `bubblewrap update`, 새 도메인에도 assetlinks.json이 있어야 합니다. 패키지 ID는 바꿀 수 없습니다.

### 알아 둘 점: TWA와 광고

TWA 안의 화면은 사이트 그 자체라서 **네이티브 AdMob을 얹을 수 없습니다.** 앱판에만 광고를 넣는 결정(앱에서 AdMob·UMP, 웹에는 광고 없음)을 안드로이드에서 지키려면, 광고 PR에서 같은 `app/`에 `@capacitor/android`를 더해(`npx cap add android`, 같은 패키지 ID) 안드로이드도 Capacitor로 내는 길이 문서 A의 원래 권장(「Capacitor 하나로 둘 다」)입니다. 그 경우 TWA 설정과 assetlinks.json은 쓰지 않게 됩니다.

## 사용자가 채울 자리표시

| 자리 | 어디 | 무엇으로 |
|---|---|---|
| Play 앱 서명 키 SHA-256 | `public/.well-known/assetlinks.json` | Play Console › 앱 무결성 |
| 업로드 키 SHA-256 | 같은 파일(배열에 추가) | `keytool -list -v` |
| 업로드 keystore·비밀번호 | `app/twa/android.keystore`(git 제외) | `keytool -genkeypair` |
| Apple Team ID | Xcode Signing(또는 CI `DEVELOPMENT_TEAM=`) | Apple Developer 계정(조직 계정, 문서 D) |
| iOS 배포 인증서·프로비저닝 프로필·App Store Connect API 키 | GitHub Secrets(CI 때) | Apple Developer |
| 번들 ID 등록 | App Store Connect / Play Console | `com.taknroll.criticalpoint` |
| 고해상도 아이콘 원본(1024px 이상) | `public/profile.jpg` 대신 | 원본 그림 |
| 호스트 | `app/twa/twa-manifest.json` | 자체 도메인 정해지면(문서 E) |
| 영어 앱 이름 「Critical Point – Bank Thriller」 | 스토어 목록(코드 아님) | 문서 D |
