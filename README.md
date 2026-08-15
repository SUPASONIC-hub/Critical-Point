# 임계점

판단이 깊어지는 순간을 추적하는 Vite/React 인터랙티브 의사결정 게임입니다. 플레이어의 선택은 시간, 자본, 신뢰, 정당성, 인적 비용, 피로를 움직이고 다음 사건의 압박 조건으로 이어집니다.

## 실행

```bash
npm install
npm run dev -- --port 5173
```

브라우저에서 `http://127.0.0.1:5173`을 엽니다.

## 검증

```bash
npm test
npm run build
```

스모크 테스트는 자원 계산, 위험 예보, 누적 판단 원장, 판단 DNA, 케이스 요약, 개인정보 감지/익명화, 입력 제한을 검증합니다.

## 플레이 시스템

- CASE 01부터 FINAL까지 이어지는 시즌형 사건 플로우
- 선택지와 자유입력 구조 재설계, 장면별 챌린지와 보너스
- 결정 예보: 선택 전 위험 변화, 주요 압박 원인, 보상/비용 비교
- LIVE LEDGER: 현재 세션의 누적 비용, 회복 선택, 위험 궤적
- DECISION DNA: 트리거·사고 방식·선택 패턴을 조합한 플레이 프로필
- COUNTERFACTUAL LAB: 실제 선택과 가장 안전한 대안, 가장 큰 압박 경로 비교
- PUBLIC SIGNAL BOARD: 완료 세션의 최고 모멘텀 점수와 랭크를 비교하는 참가자 랭킹
- SUSPENSE CONSOLE: 위험 압력과 결정 시간에 따라 상승하는 장면 긴장도
- HIDDEN PROTOCOL: 임계선을 넘는 선택에서 관찰자, 패턴 고정, 숨은 프로토콜이 드러나는 반전 이벤트
- 타이머, 에코 반론, 위기 프로토콜, 적응형 배경음악
- 브라우저 저장, 이어하기, JSON 로그 내보내기
- 선택적 Supabase 원격 저장과 실패분 재시도 대기열

## 구조

```text
index.html             Vite 엔트리와 메타 태그
public/                런타임 이미지 자산
src/main.jsx           React 앱과 게임 상태/화면
src/gameData.js        케이스, 장면, 선택지, 캐릭터 데이터
src/gameLogic.js       자원, 위험, 서스펜스, 예보, 원장, DNA, 대안 경로, 텍스트 처리
src/styles.css         화면 스타일과 반응형 레이아웃
src/appConfig.js       저장 키와 입력 제한
src/telemetry.js       선택적 Supabase 저장/랭킹 조회 클라이언트
src/ranking.js         세션 중복 제거와 랭킹 정렬 로직
scripts/smoke-test.mjs 핵심 로직 스모크 테스트
render.yaml            Render 정적 사이트 배포 설정
```

`dist/`, `node_modules/`, 루트의 `Profile.jpg`, `.env`는 서비스 소스 형상에 포함하지 않습니다.

## 배포

Render 정적 사이트는 `render.yaml`을 사용합니다.

- Build: `npm ci && npm test && npm run build`
- Publish: `dist`
- Auto Deploy: enabled

원격 저장을 사용할 때만 배포 환경에 설정합니다.

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

환경변수가 없으면 플레이는 로컬 저장과 JSON 내보내기로 동작하며, 랭킹 페이지도 현재 브라우저의 완료 기록만 표시합니다.
