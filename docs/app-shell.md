# 스토어 앱 껍데기 (iOS · 안드로이드 모두 Capacitor) · 앱판 광고 · 광고 제거 결제

웹 게임을 Google Play와 App Store에 올리기 위한 껍데기입니다. 웹(PWA)은 그대로이고, 웹 빌드·테스트·번들 예산은 이 폴더를 보지 않습니다.

- **안드로이드도 Capacitor**(2026-10-25 사용자 결정 4, 같은 패키지 ID `com.taknroll.criticalpoint`). 처음 PR(#327)의 TWA 설정은 지웠습니다.
- **광고는 앱판에만**, 웹판에는 넣지 않습니다(결정 3). 앱의 AdMob(Google UMP 동의, iOS ATT)과 광고 제거 결제(`remove_ads`)는 앱 빌드에만 들어가고, 사이트 빌드에는 한 바이트도 들어가지 않습니다(아래 「웹과 떨어뜨리는 방법」).
- 광고 원칙·자리·문구는 앱 출시 메모 B, 결제 문구는 메모 C(둘 다 git 제외, 사용자 답 「전부 1」).

## 구조

```
app/                         ← 껍데기 전용 작업 공간. 자기 package.json·node_modules(루트와 섞지 않음)
├─ package.json              ← Capacitor 8.5.3(core·ios·android·cli), 광고·결제 플러그인(정확한 버전)
├─ capacitor.config.json     ← appId com.taknroll.criticalpoint, 이름 「임계점」, webDir dist-app
├─ build-web.mjs             ← 루트 Vite로 `--mode app` 빌드 → app/dist-app (git 제외)
├─ build-ios-assets.mjs      ← public/profile.jpg로 iOS 아이콘(1024, 알파 없음)·시작 화면(2732)
├─ check-app.mjs             ← `npm run check:app`: 두 껍데기 설정 검사(아래)
├─ native/                   ← 앱 빌드에서만 `cp:app-native`로 불리는 네이티브 쪽
│   ├─ index.js              ← AdMob: UMP → ATT 사전 안내 → ATT → SDK 시작, 전면·보상형
│   ├─ store.js              ← 광고 제거: StoreKit 2 / Play Billing, 구매·복원·확인(acknowledge)
│   ├─ screens.js            ← ATT 사전 안내 한 장, 전면 광고 앞 가림막(DOM)
│   └─ adUnits.js            ← 광고 단위 ID(지금 Google 테스트 ID, 실 ID 자리표시)
├─ ios/                      ← `cap add ios` Xcode 프로젝트(SPM, iOS 15+), git에 올림
└─ android/                  ← `cap add android` Gradle 프로젝트(compile/target 36, min 24), git에 올림
src/platform/appShell.js     ← appShell() / isAppShell(): "web" · "ios" · "android"
src/platform/ads.js          ← 게임이 부르는 광고·결제 창구(웹에서는 아무것도 안 함)
src/platform/adPacing.js     ← 전면 광고 간격 규칙(순수 함수)
src/platform/adCopy.js       ← 메모 B·C의 문구를 페이지 언어로(한국어 src/copy/appStore.js, 영어·일본어 src/locales/<lang>/app/appStore.js — 웹 사전에는 없음)
src/components/AppStorePanel.jsx ← 「광고와 개인정보」 칸·광고 제거 구매, 결말 도감 보상형 힌트
```

### 플러그인 (`app/package.json`, 모두 정확한 버전, 2026-10-25 기준 2주 이상 된 것)

| 패키지 | 버전 | 무엇 |
|---|---|---|
| `@capacitor/core` · `ios` · `android` · `cli` | 8.5.3 | 껍데기(2026-10-07) |
| `@capacitor-community/admob` | 8.2.1 | AdMob(Android SDK 25.4.x, iOS 13.11.0), Google UMP 동의, iOS ATT(2026-10-06) |
| `@capgo/native-purchases` | 8.9.2 | iOS StoreKit 2 · Android Play Billing 9.1(2026-10-09). 서버 없이 스토어 계정으로 구매 확인 |

RevenueCat은 서버 서비스가 끼어서(메모 C-6 ③ (1) 「스토어 계정에만 묶음, 서버 없음」), cordova-plugin-purchase는 Cordova 플러그인이라 고르지 않았습니다.

### 플랫폼 표시 `src/platform/appShell.js`

Capacitor 네이티브 브리지가 페이지 코드보다 먼저 `window.Capacitor`를 넣으므로, `Capacitor.isNativePlatform()`이 참이고 플랫폼이 `ios`/`android`일 때만 앱입니다. 그 밖은 모두 `"web"`. TWA 실행 referrer로 알던 길은 없앴습니다.

### `--mode app` 빌드

`app/build-web.mjs`가 루트의 Vite로 같은 페이지를 `app/dist-app`에 만듭니다. 사이트 빌드와 다른 점:

1. 서비스 워커를 끔(파일이 이미 기기 안에 있음).
2. `__CP_APP__`가 `true`이고, `cp:app-native`가 `app/native/index.js`로 풀림(그 파일이 `app/node_modules`의 플러그인을 import).
3. 광고·결제 코드는 따로 지연 청크(`ads`, `AppStorePanel`, `app-native`)로 나뉘어 첫 화면에 미리 받지 않습니다.
4. 사이트 확인 두 가지(AdSense의 `google-adsense-account` 메타·`/ads.txt`, Search Console의 `google-site-verification` 메타)를 `ADSENSE_CLIENT`·`GOOGLE_SITE_VERIFICATION`이 있어도 넣지 않음: 앱 안 페이지는 크롤러·AdSense 심사가 읽지 않고, 앱 광고는 AdMob입니다.
5. 정적 페이지(방침·약관·소개·FAQ·문의)는 첫 화면 링크가 여는 곳이라 앱에도 들어가되, 방침·약관·FAQ는 앱판 문장(AdMob 광고·광고 제거 결제)으로 바꾼 사본입니다(`scripts/legal-pages.mjs` `APP_LINES`, `scripts/site-pages.mjs` `APP_LINES`; 웹 문장이 바뀌어 찾을 문장이 없으면 빌드 실패). 소개·문의는 웹과 같고, 같이 만들어지는 `robots.txt`·`sitemap.xml`도 남습니다(앱 안에서 읽는 이 없음).

Supabase 키는 사이트 빌드처럼 환경 변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), 실 광고 단위는 `VITE_ADMOB_LIVE=true`일 때만(아래).

## 웹과 떨어뜨리는 방법 (광고는 앱판에만)

- 게임이 광고·결제를 부르는 곳은 두 군데뿐입니다: `GameRuntime.openCase`(결과 화면의 「다음 사건」, 전면 광고)와 `IntroScreen`(편의 설정 서랍 안 「광고와 개인정보」 칸, 결말 도감 힌트). 둘 다 `__CP_APP__ ? 동적 import : 원래 것` 꼴이라, 사이트 빌드(`__CP_APP__` = false)에서는 접혀서 사라집니다. 사이트 청크 크기는 #327과 똑같습니다(index 172,282 / 62,230, GameRuntime 142,725 / 52,271, sw.js 3,427 — 예산 그대로).
- `cp:app-native`는 사이트 빌드에서 `export default null` 한 줄로 풀리고(vite.config.js `appNative`), 루트 CI는 `app/node_modules`를 설치하지 않습니다.
- `src/platform/ads.js`는 부를 때마다 `appShell()`을 먼저 보고, 웹이면 네이티브 쪽을 불러오지도, 아무것도 쓰지도 않습니다(앱 빌드를 브라우저로 열어도 마찬가지).
- 검사: `check:bundle`이 사이트 `dist/` 전체에서 앱 전용 이름(`AdMob`, `ca-app-pub-`, `NativePurchases`, `remove_ads`, `TrackingAuthorization`, `cp:app-native`, `AppStorePanel`, 「광고 제거」…)을 찾으면 실패(`scripts/app-only-code.mjs`). 유닛 테스트 `tests/unit/app-ads.test.mjs`가 웹에서 광고 호출·네이티브 로드·저장이 하나도 없음을, 그리고 `src/`에서 앱 전용 코드를 부르는 줄이 모두 `__CP_APP__` 뒤의 동적 import임을 확인합니다.

## 광고 (메모 B, 사용자 답 전부 (1))

| 슬롯 | 형식 | 언제 |
|---|---|---|
| `between-cases` | 전면 | 사건이 닫히고 결과 화면에서 「다음 사건」(버튼·N 키)을 누른 직후, 다음 사건이 열리기 전. **3사건마다 1번, 하루 최대 4번, 8분 간격**. 프롤로그 01~05·사건 01 앞에는 없음(첫 10분), 2026-W47(시험 주) 없음, 광고 제거 구매자 없음 |
| `reward-ending-hint` | 보상형 | 시작 화면 결말 도감: 앱에서는 힌트 한 줄부터, 「광고 보고 힌트 한 줄 더」로 한 줄씩. 구매자는 「광고 없이 바로 받기」 |
| `reward-archive` | 보상형 | `ads.watchRewarded("reward-archive")`와 문구는 있음. 「지난 판 기록 보관함」 칸 수 기능이 아직 게임에 없어 버튼은 그 기능이 생길 때 붙임 |
| 배너 | — | 1.0에서 끔(B-7 ① (1)) |

- 전면 광고는 판·라운드·시계 도중에는 절대 부르지 않습니다(결과 화면에서 다음 사건으로 넘어갈 때만). 광고가 열리기 전 불투명한 가림막이 결과 화면을 덮고 「다음 사건 전에 짧은 광고가 나옵니다.」를 1초 보여 주므로 점수 위에 광고가 뜨지 않습니다. 광고가 닫히면 가림막이 걷히고 다음 사건이 열립니다.
- 보상은 점수·순위·판에 영향이 없고(B-1 ①), ATT 허용을 보상 조건으로 걸지 않습니다(5.1.2(i)).
- 보상형 광고가 없거나·중간에 닫거나·오프라인이면 메모 B-3 문구를 보여 줍니다.
- 원격 설정(Supabase `ad_config`)은 아직 없음: 규칙 기본값은 `src/platform/adPacing.js` `AD_RULES`(B-2의 기본값과 같음). 원격으로 끄는 스위치는 다음 단계.

### 동의 순서 (메모 B-4)

광고가 처음 필요할 때 — **사건 01이 닫히고 「다음 사건」을 누를 때** — 한 번 묻습니다(첫 실행 화면에서 바로 묻지 않음):

1. 게임의 「데이터 저장 안내」(이미 끝난 상태)
2. **Google UMP** 동의 메시지(유럽·영국·스위스 등 해당 지역만, AdMob 콘솔에서 만든 문안)
3. (iOS, 아직 묻지 않았을 때) **ATT 사전 안내**: 「광고를 고르는 방식에 대해」 한 장, 버튼은 「계속」 하나 → 시스템 ATT 창(`NSUserTrackingUsageDescription`, ko·en·ja `InfoPlist.strings`)
4. Mobile Ads SDK 시작(`maxAdContentRating: Teen`, 테스트 빌드면 `initializeForTesting`)

맞춤 광고는 UMP·ATT 답대로 SDK가 스스로 정합니다. 「광고와 개인정보」 칸의 「광고 개인정보 설정 다시 열기」가 UMP 개인정보 옵션 양식을 다시 엽니다(해당 지역이 아니면 「이 지역에서는 따로 고를 광고 동의 항목이 없습니다.」).

### 광고 단위 ID

- 지금은 모든 빌드가 **Google 테스트 ID**입니다. 앱 ID: Android `ca-app-pub-3940256099942544~3347511713`(`app/android/app/src/main/res/values/strings.xml` `admob_app_id`), iOS `ca-app-pub-3940256099942544~1458002511`(`Info.plist` `GADApplicationIdentifier`). 단위 ID: `app/native/adUnits.js` `TEST_UNITS`.
- 출시 때: AdMob에 앱 둘(Android·iOS)을 만들고 위 두 앱 ID와 `LIVE_UNITS`(플랫폼마다 전면 1·보상형 1)를 채운 뒤 `VITE_ADMOB_LIVE=true npm run sync`. 실 ID가 자리표시인 채로는 `VITE_ADMOB_LIVE`를 줘도 테스트 ID가 나갑니다.
- 팀은 실제 광고를 누르지 않습니다(B-1 ⑥). 실기기 테스트는 AdMob › 설정 › 테스트 기기에 등록.
- iOS `SKAdNetworkItems`에는 Google 것(`cstr6suwn9`)만 넣었습니다. 미디에이션·서드파티 구매자를 쓰면 Google 문서의 전체 목록을 더합니다.
- 자체 도메인이 생기면 `app-ads.txt`(메모 E)를 그 도메인 루트에.

## 광고 제거 결제 (메모 C, 사용자 답 전부 (1))

- 상품 `remove_ads`: App Store 비소모성(Non-Consumable), Play 일회성 인앱 상품. 3,300원 / US$2.99.
- 효과: 전면(과 나중 배너) 없음, 보상형 보상은 광고 없이 바로(C-6 ② (1)).
- **서버 없음**(C-6 ③ (1)): 산 것인지는 매번 스토어에 묻습니다 — iOS는 StoreKit 2 `Transaction.currentEntitlements`(지금 Apple ID의 것만, 환불되면 빠짐), Android는 Play Billing의 구매 목록(`PURCHASED`만). 세션에 한 번, 그리고 「구매 복원」 때 다시. 기기에는 오프라인 실행 때 쓸 답만 남기고(`cp.store.removeAds`), 이어하기 코드로 옮기지 않습니다.
- Play는 3일 안에 확인(acknowledge)하지 않으면 환불하므로 플러그인이 구매 때 확인하고, 그때 대기(PENDING)였던 구매는 완료된 것을 찾을 때 여기서 확인합니다. 대기 중 구매가 끝나면 `transactionUpdated`로 바로 적용.
- 화면(메모 C-2): 편의 설정 서랍 안 「광고와 개인정보」 칸 — 제목 「광고 없이 끝까지」, 본문 넷, 「{가격}에 광고 제거」(가격은 스토어 문자열), 그 아래 청약철회 한 줄(C-6 ④ (1)) 「구매 즉시 적용되며 청약철회가 제한될 수 있습니다. 환불은 스토어 정책을 따릅니다.」, 「구매 복원」. 개인정보처리방침·이용약관 링크는 자체 도메인 페이지 주소가 생기면 `AppStorePanel.jsx` `POLICY_LINKS`에 넣으면 나타납니다.
- 결과 문구(메모 C-3): 성공·복원 성공·복원할 것 없음·취소·대기·오류·오프라인.
- 웹판에는 결제도, 「앱에서 살 수 있다」는 말도 없습니다.

### 스토어에 상품 만들기 (사람이 할 일)

- **App Store Connect** › 앱 › 수익화 › 앱 내 구입 › 「+」 비소모성: 참조 이름 `Remove Ads`, 제품 ID `remove_ads`, 가격 등급(₩3,300 / $2.99), 현지화 ko 「광고 제거」/설명, en 「Remove Ads」/설명(메모 C-1), 심사용 스크린샷(설정 › 광고와 개인정보), 심사 메모(C-1 영문). 첫 빌드와 함께 심사에 제출. 계약·세금·은행 정보(유료 앱 계약)가 먼저 있어야 함. Xcode에서 따로 켤 capability는 없습니다(StoreKit 2는 기본, 샌드박스 테스터로 확인).
- **Play Console** › 수익 창출 › 인앱 상품 › 상품 만들기: 상품 ID `remove_ads`, 이름·설명(C-1), 기본 가격 ₩3,300, 활성화. 인앱 상품은 결제 라이브러리를 쓰는 AAB를 한 번 올린 뒤에 만들 수 있습니다. 라이선스 테스터(설정 › 라이선스 테스트)로 시험 구매.

## 이 PC(Windows)에서 되는 것 / 안 되는 것

| | 여기서 됨 | 문서로만 |
|---|---|---|
| 공통 | `npm run build:web`, `npx cap sync`(두 프로젝트에 웹 파일 복사·플러그인 등록), `npm run check:app` | — |
| iOS | 아이콘 생성 | Xcode 빌드·서명·실기기·업로드(macOS + Xcode 26) |
| 안드로이드 | — | Gradle 빌드(JDK 21 + Android SDK 36), 서명, Play 업로드 |

## `npm run check:app`

`check:twa`를 대신합니다(파일만 읽으므로 SDK 없이 돌고, `npm test`가 매번 돌림 — `tests/unit/app-shell.test.mjs`):

- 패키지 이름 하나: `capacitor.config.json`·안드로이드 `namespace`/`applicationId`/`package_name`·Xcode 번들 ID·`appShell.js`
- 안드로이드 `compileSdkVersion`·`targetSdkVersion` ≥ 36(Google Play: 2026-08-31부터 새 앱·업데이트 API 36), `minSdkVersion` ≥ 24(Capacitor 8 기본)
- AdMob 앱 ID(안드로이드 매니페스트 meta-data, iOS `GADApplicationIdentifier`), iOS ATT 문구(Info.plist·ko·en·ja)와 `cstr6suwn9.skadnetwork`
- 플러그인 버전이 정확한 버전, 상품이 `remove_ads`
- 테스트·자리표시 광고 ID는 경고, `--release`면 오류 → 출시 빌드 전에 `npm run check:app -- --release` 통과

## iOS 빌드 (macOS, Xcode 26 이상)

App Store는 2026-04-28부터 **Xcode 26·iOS 26 SDK로 빌드한 것만** 받습니다. 최소 지원 OS는 iOS 15(StoreKit 2와 같음).

```sh
cd app
npm ci
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run sync:ios   # 웹 빌드 + cap sync ios
npx cap open ios                                                    # Xcode가 열림(SPM이 GoogleMobileAds·플러그인을 받음)
```

1. App 타깃 › Signing & Capabilities에서 **Team**(자리표시: Apple Team ID) → 번들 ID `com.taknroll.criticalpoint` 자동 서명. 번들 ID는 App Store Connect에 먼저 등록.
2. 실기기 실행 → 사건 01을 끝내고 「다음 사건」: UMP(유럽 테스트는 AdMob 테스트 기기 + 디버그 지역) → ATT 사전 안내 → 시스템 창 → 사건 03 뒤 테스트 전면 광고. 설정 › 「광고와 개인정보」에서 샌드박스 계정으로 광고 제거 구매·복원.
3. Product › Archive → Distribute App › App Store Connect. `MARKETING_VERSION` 1.0.0, `CURRENT_PROJECT_VERSION`은 올릴 때마다 +1.
4. CI로 할 때: `macos-26` 러너에서 `xcodebuild -project app/ios/App/App.xcodeproj -scheme App -configuration Release -archivePath build/App.xcarchive archive DEVELOPMENT_TEAM=<TEAM_ID>` 다음 `-exportArchive`. 인증서·프로필·App Store Connect API 키는 GitHub Secrets.
5. 개인정보: 앱의 `PrivacyInfo.xcprivacy`는 게임 코드가 보내는 것만, AdMob SDK가 모으는 것(광고 ID는 ATT 허용 뒤만, IP·대략 위치, 제품 상호작용, 진단)은 SDK 자체 매니페스트가 선언합니다. App Store Connect의 개인정보 답(메모 D)에는 둘 다 적습니다.

아이콘·시작 화면은 `node app/build-ios-assets.mjs`(루트에서, Playwright)로 다시 그립니다. 원본 `public/profile.jpg`가 256px라 흐림 → **큰 원본으로 바꿀 것**(자리표시).

### 애플 4.2(웹사이트 재포장 금지) — 아직 없는 것

심사 전에 문서 A-2의 앱다운 기능: 햅틱(@capacitor/haptics), 로컬 알림(기본 꺼짐), 공유 시트, 네이티브 저장, 상태 표시줄. 플러그인은 `app/package.json`에, 웹 쪽 호출은 광고와 같은 방식(`__CP_APP__` 뒤 동적 import, `cp:app-native`)으로.

## 안드로이드 빌드 (JDK 21 · Android SDK 36)

```sh
cd app
npm ci
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run sync:android   # 웹 빌드 + cap sync android
npx cap open android                                                    # Android Studio(또는 아래 gradlew)
cd android && ./gradlew bundleRelease                                   # app/build/outputs/bundle/release/app-release.aab
```

- Android Studio(최신 안정판)가 JDK 21과 SDK를 같이 설치합니다. 명령줄만 쓰면 JDK 21(`JAVA_HOME`)과 Android SDK Platform 36·Build-Tools를 깔고 `app/android/local.properties`에 `sdk.dir=...`(git 제외).
- Gradle 8.14.3, AGP 8.13.0, `compileSdkVersion`·`targetSdkVersion` 36, `minSdkVersion` 24(`app/android/variables.gradle`), `versionCode` 1·`versionName` 1.0.0(`app/android/app/build.gradle`, 올릴 때마다 `versionCode` +1).
- 아이콘·시작 화면은 지금 Capacitor 기본 그림입니다 → Android Studio › New › Image Asset으로 `public/icons/icon-maskable-512.png`(또는 큰 원본)에서 만들기(자리표시). 배경 `#06090A`.
- 실기기에서 iOS와 같은 흐름 확인(UMP → 사건 03 뒤 테스트 전면, 「광고와 개인정보」에서 라이선스 테스터로 구매·복원). Android에는 ATT가 없고, 광고 ID 권한(`AD_ID`)은 Mobile Ads SDK가 매니페스트에 넣습니다 → Play Console 「광고 ID」 선언에 「광고」로 답.

### 서명

1. 업로드 키(한 번, 잃으면 Play에 재설정 요청): `keytool -genkeypair -v -keystore app/android/criticalpoint-upload.jks -alias criticalpoint-upload -keyalg RSA -keysize 2048 -validity 10000`. keystore는 git 제외(`app/.gitignore`), 오프라인 사본 1벌 + 비밀번호는 비밀번호 관리자에.
2. `app/android/keystore.properties`(git 제외)에 경로·별칭·비밀번호를 두고 `app/build.gradle`의 `signingConfigs.release`에서 읽거나, Android Studio › Build › Generate Signed App Bundle.
3. Play Console에 AAB를 올리면 **Play 앱 서명**이 켜집니다.

### assetlinks.json은 지웠습니다

`/.well-known/assetlinks.json`은 TWA(크롬이 사이트를 주소창 없이 띄움)와, 웹 주소를 앱으로 여는 App Links에 쓰는 파일입니다. Capacitor 앱은 웹 파일을 앱 안에 싣고 자기 스킴으로 띄우므로 사이트와 연결을 증명할 일이 없고, 지금 앱에는 웹 주소로 앱을 여는 링크(intent filter)도 없습니다. 그래서 `public/.well-known/assetlinks.json`과 TWA 설정(`app/twa/`)을 지웠습니다. 나중에 공유 링크를 앱으로 열고 싶어지면(App Links) 그때 자체 도메인(메모 E)에 Play 앱 서명 키 SHA-256으로 다시 둡니다.

## 사용자가 채울 자리표시

| 자리 | 어디 | 무엇으로 |
|---|---|---|
| AdMob 앱 ID(Android) | `app/android/app/src/main/res/values/strings.xml` `admob_app_id` | AdMob › 앱 › 앱 설정 |
| AdMob 앱 ID(iOS) | `app/ios/App/App/Info.plist` `GADApplicationIdentifier` | AdMob › 앱 › 앱 설정 |
| 광고 단위 ID 4개(플랫폼마다 전면·보상형) | `app/native/adUnits.js` `LIVE_UNITS` | AdMob › 광고 단위 |
| UMP 메시지(GDPR + 미국 주 규정) | AdMob › 개인정보 보호 및 메시지 | 앱 이름·로고·개인정보처리방침 URL |
| `app-ads.txt` | 자체 도메인 루트(메모 E) | AdMob이 주는 한 줄 |
| `remove_ads` 상품 | App Store Connect·Play Console | 위 「스토어에 상품 만들기」 |
| 개인정보처리방침·이용약관 URL | `src/components/AppStorePanel.jsx` `POLICY_LINKS` | 자체 도메인 페이지 |
| 업로드 keystore·비밀번호 | `app/android/*.jks`·`keystore.properties`(git 제외) | `keytool -genkeypair` |
| 안드로이드 아이콘·시작 화면 | `app/android/app/src/main/res/` | Image Asset(큰 원본) |
| Apple Team ID | Xcode Signing(또는 CI `DEVELOPMENT_TEAM=`) | Apple Developer(조직 계정, 문서 D) |
| iOS 배포 인증서·프로필·App Store Connect API 키 | GitHub Secrets(CI 때) | Apple Developer |
| 번들 ID 등록 | App Store Connect / Play Console | `com.taknroll.criticalpoint` |
| 고해상도 아이콘 원본(1024px 이상) | `public/profile.jpg` 대신 | 원본 그림 |
| 영어 앱 이름 「Critical Point – Bank Thriller」 | 스토어 목록(코드 아님) | 문서 D |
