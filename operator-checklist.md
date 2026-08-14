# 임계점 운영 체크리스트

## 테스트 전

- 로컬에서 `npm test`와 `npm run build`가 통과하는지 확인한다.
- Render 최신 배포 커밋이 GitHub `main` 최신 커밋과 같은지 확인한다.
- 시작 화면에 `DB 연결됨`이 보이는지 확인한다.
- Supabase SQL Editor에서 [supabase/schema.sql](./supabase/schema.sql)을 실행했는지 확인한다.
- 테스트 링크를 [participant-invite.md](./participant-invite.md) 안내문에 넣어 공유한다.
- 테스트 대상에게 실명, 연락처, 회사명, 실제 사건 관계자 이름을 쓰지 말라고 안내한다.

## 테스트 중

- 플레이어가 막히면 “원하는 방식으로 결정하면 됩니다”까지만 말한다.
- 결과 화면에 `PLAYTEST SESSION` 코드가 보이는지 확인한다.
- 원격 저장 상태가 실패로 표시되면 `로그 내보내기` JSON을 받는다.
- 각 케이스 결과 화면의 피드백 입력을 작성하도록 안내하고, 경고가 뜨면 저장 전 익명화 버튼을 누르게 한다.
- 자유입력과 피드백의 600자 제한 때문에 내용이 잘리는 오해가 없는지 확인한다.

## 테스트 후

- Supabase SQL Editor에서 [supabase/analysis.sql](./supabase/analysis.sql)을 실행한다.
- 8자리 세션 코드와 인터뷰 기록을 매칭한다.
- 이해도 평균 3점 이하 케이스는 UX/문구를 먼저 수정한다.
- 고민 강도 평균 2점 이하 케이스는 선택지 비용과 에코 반론을 강화한다.
- 삭제 요청이 들어오면 세션 코드 기준으로 `playtest_sessions`, `playtest_feedback`을 함께 삭제한다.
