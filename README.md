# 임계점

Vite/React로 만든 인터랙티브 의사결정 게임입니다. 플레이어는 사건별 장면에서 선택지 또는 자유입력으로 판단을 내리고, 시간·자본·신뢰·정당성·인적 비용·피로가 어떻게 변하는지 확인합니다.

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

`npm test`는 자원 계산, 위험 압력, 압박 원인 분석, 선택 예측, 케이스 요약, 개인정보 감지/익명화, 텍스트 제한 규칙을 확인합니다.

## 현재 기능

- CASE 01부터 FINAL까지 이어지는 시즌형 의사결정 플로우
- 선택지별 전술 등급, 위험 압력 변화, 보상/비용 예측
- 전술 정보 패널의 결정 예보: 안정 선택, 큰 대가, 주요 압박 원인 비교
- 자유입력 기반 구조 재설계와 개인정보 감지/익명화
- 장면 타이머, 에코 힌트, 위기 프로토콜, 직관 보너스
- 브라우저 `localStorage` 저장, 이어하기, 플레이 로그 JSON 내보내기
- 선택적 Supabase 원격 저장과 실패분 재시도 대기열

## 파일 구조

```text
index.html             Vite 엔트리와 메타 태그
public/                런타임 이미지 자산
src/main.jsx           React 앱, 게임 상태, 선택 UI, 저장/원격 전송
src/gameData.js        케이스, 장면, 선택지, 캐릭터 데이터
src/gameLogic.js       자원 계산, 위험 분석, 선택 예측, 텍스트 처리
src/styles.css         화면 스타일과 반응형 레이아웃
src/appConfig.js       저장 키와 입력 제한 설정
src/telemetry.js       선택적 Supabase 저장 클라이언트
scripts/smoke-test.mjs 핵심 로직 스모크 테스트
render.yaml            Render 정적 사이트 배포 설정
```

`dist/`, `node_modules/`, 루트의 `Profile.jpg`, `.env`는 서비스 소스 형상에 포함하지 않습니다.

## 배포

Render 정적 사이트 기준 설정은 `render.yaml`에 있습니다.

- Build Command: `npm ci && npm test && npm run build`
- Publish Directory: `dist`
- Auto Deploy: enabled

선택적 원격 저장을 사용하려면 배포 환경에 아래 값을 설정합니다.

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

환경변수가 없으면 원격 저장은 건너뛰고 로컬 저장과 JSON 내보내기만 사용합니다.
