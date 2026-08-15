# 임계점

선택 하나가 다음 사건을 바꾸는 대화형 스토리 게임입니다. 플레이어는 제한된 시간과 자원 안에서 무엇을 먼저 지킬지 결정하고, 그 선택이 다음 사건의 조건과 결말에 반영되는 흐름을 경험합니다.

## 실행

```bash
npm ci
npm run dev -- --port 5173
```

브라우저에서 `http://127.0.0.1:5173`을 엽니다.

## 주요 기능

- 사건별 선택, 자유입력 해결안, 후폭풍 분기
- 시간, 현금, 믿음, 공정함, 사람 피해, 지침 변화 추적
- 선택 미리보기, 장면 목표, 숨은 단서, 최종 결과 리포트
- 브라우저 자동 저장, 완료 기록 JSON 내보내기, 로컬 랭킹
- 선택적 원격 저장과 원격 랭킹
- 실명, 연락처, 회사명 감지 및 익명화 보조
- 사용자 제스처 후 장면 분위기에 맞춰 재생되는 배경음

## 검증

```bash
npm test
npm run build
```

## 파일 구조

```text
index.html              앱 HTML과 메타 태그
src/main.jsx            React 화면, 저장, 선택 흐름
src/gameData.js         사건, 선택지, 결말 분기
src/gameLogic.js        점수, 위험, 단서, 결과 계산
src/playerLanguage.js   화면 문구 정리
src/ranking.js          로컬/원격 랭킹 정규화
src/telemetry.js        선택적 원격 저장 연동
src/styles.css          화면 스타일
public/                 프로필 및 장면 이미지
scripts/smoke-test.mjs  핵심 계산 테스트
render.yaml             Render 배포 설정
```

## 배포

Render 배포는 `render.yaml`을 사용합니다.

- Build: `npm ci && npm test && npm run build`
- Publish: `dist`

원격 저장은 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`가 있을 때만 활성화됩니다. 설정하지 않아도 플레이, 자동 저장, JSON 내보내기, 로컬 랭킹은 정상 동작합니다.
