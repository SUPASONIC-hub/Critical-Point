# 임계점 Prototype

인터랙티브 의사결정 게임 **임계점 — 판단이 깊어지는 순간**의 로컬 웹 프로토타입.

## 실행

```bash
npm install
npm run dev -- --port 5173
```

브라우저에서 `http://127.0.0.1:5173`을 연다.

## 현재 범위

- CASE 01 — 72 HOURS
- CASE 02 — FALSE SIGNAL
- CASE 03 — RED TEAM
- CASE 04 — THE PRICE
- CASE 05 — NO ONE TO BLAME
- FINAL — TRIGGER LAB

각 케이스는 선택지, 구조 재설계 자유입력, 에코 반론, 자원 변화, 결과 리포트를 포함한다.

## 파일 구조

```text
src/main.jsx      화면, 상태 관리, 케이스 전환
src/gameData.js   시즌/케이스/노드/선택지/반론 데이터
src/gameLogic.js  자원 계산, 자유입력 평가, 점수 초기화
src/styles.css    UI 스타일
```

## 테스트

```bash
npm run build
```

플레이테스트 절차는 `playtest-guide.md`를 따른다.

## Render 배포

현재 앱은 Vite 정적 사이트이므로 Render에서는 `Static Site`로 배포한다.

권장 설정:

- Repository: GitHub의 이 프로젝트 저장소
- Branch: `main`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Auto-Deploy: On Commit

대시보드 설정 대신 Blueprint를 사용할 경우 루트의 `render.yaml`을 사용한다.

절차:

1. GitHub 저장소에 현재 파일을 push한다.
2. Render Dashboard에서 `New` → `Static Site`를 선택한다.
3. GitHub 저장소를 연결한다.
4. 위 설정값을 입력하거나 `render.yaml` Blueprint를 사용한다.
5. 첫 배포가 끝나면 발급된 `onrender.com` URL을 플레이테스트 참가자에게 공유한다.

## 데이터 수집 방향

지금 버전은 브라우저 `localStorage`와 JSON 로그 내보내기로 테스트한다. 여러 사람의 데이터를 자동으로 모으려면 다음 단계에서 서버 저장을 붙여야 한다.

권장 1차 구조:

- 프론트엔드: 현재 Vite 앱 유지
- API: Render Web Service 또는 Supabase Edge Function
- DB: Supabase Postgres 또는 Render Postgres
- 저장 데이터: 세션 ID, 케이스 ID, 선택 로그, 자원 변화, 자유입력 여부, 응답 시간, 결과 트리거

무료/저비용으로 빠르게 검증하려면 Supabase 테이블 하나를 만들고, 게임 종료 시 결과 JSON을 저장하는 방식이 가장 단순하다.

## 이미지 출처

인트로 배경 이미지는 Unsplash의 무료 이미지를 사용한다.

- Photo by Vitaly Gariev on Unsplash
- Source: https://unsplash.com/photos/two-colleagues-working-late-in-a-dimly-lit-office-S-YM-CY8X8A

## 주의

현재는 브라우저 `localStorage`에 진행 상태를 저장한다. 공개 베타 전에는 서버 저장 또는 DB 저장으로 교체해야 한다.
