# 임계점

인터랙티브 의사결정 게임 **임계점 - 판단이 깊어지는 순간**의 Vite/React 웹 앱입니다.

## 실행

```bash
npm install
npm run dev -- --port 5173
```

브라우저에서 `http://127.0.0.1:5173`을 엽니다.

## 주요 기능

- CASE 01부터 FINAL까지 이어지는 시즌형 의사결정 플로우
- 선택지 전술 등급, 플로우 서지 보너스, 구조 재설계 자유입력, 에코 반론, 자원 변화, 결과 리포트
- 브라우저 `localStorage` 기반 진행 저장, 저장 후 나가기, 이어하기
- 플레이 로그 JSON 내보내기
- 선택적 Supabase 원격 저장과 실패분 재시도 대기열

## 파일 구조

```text
index.html             Vite 앱 엔트리와 메타 태그
public/                앱 이미지와 아이콘 자산
src/main.jsx           화면, 상태 관리, 저장/이어하기, 케이스 전환, 전술 등급/보너스 UI
src/gameData.js        시즌/케이스/노드/선택지 데이터
src/gameLogic.js       자원 계산, 자유입력 평가, 결과 요약
src/styles.css         UI 스타일
src/telemetry.js       선택적 Supabase 저장 클라이언트
scripts/smoke-test.mjs 핵심 로직 스모크 테스트
render.yaml            Render 정적 사이트 배포 설정
```

## 테스트와 빌드

```bash
npm test
npm run build
```

`npm test`는 자원 변화, 위험 압력, 모멘텀/랭크 계산, 개인정보 감지/익명화, 텍스트 제한 로직을 확인합니다.

## 배포

Render 정적 사이트 기준 설정은 `render.yaml`에 들어 있습니다.

- Build Command: `npm ci && npm test && npm run build`
- Publish Directory: `dist`
- Auto Deploy: enabled

선택적 원격 저장을 사용하려면 배포 환경에 아래 값을 설정합니다.

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

두 환경변수가 없으면 앱은 원격 저장을 건너뛰고 로컬 저장과 JSON 내보내기만 사용합니다.
