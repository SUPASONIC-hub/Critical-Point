# 이벤트 주 운영: 「이번 주의 규칙」

어떤 주에는 그 주에만 서는 규칙이 하나 있습니다(README 「무엇으로 경쟁하나」의 **이번 주의 규칙**). 이 문서는 그
장치가 지금 어떻게 돌아가는지와, 이벤트 주 하나를 **예고 → 진행 → 정리**로 운영하는 절차를 적습니다. 2026-11-05
결정(F7 (1)): 주간 규칙 장치는 그대로 두고, 절차를 문서로 남깁니다.

차례

1. 지금 돌아가는 것
2. 달력
3. 이벤트 주 절차
4. 주중에 바꾸지 않는 것
5. 되돌리기
6. 끝난 뒤 적는 것
7. 참고: 파일 위치

---

## 1. 지금 돌아가는 것

**한 주 = 한 규칙.** 주는 한국 시간 월요일 0시부터 일요일 24시까지의 ISO 주(`2026-W47` 꼴,
`src/gauntlet/weeklyCalendar.js`의 `isoWeekKey`)입니다. 시즌은 **시작한 주의 규칙**을 끝까지 지니고(`newGame`
때 `weekRule` 도장, `src/state/runState.js`), 주가 바뀌어도 그 시즌 안에서는 바뀌지 않습니다.

**규칙 목록(카탈로그)** -- `src/gauntlet/weeklyRules.js`의 `WEEK_RULE_CATALOGUE`. 규칙이 움직일 수 있는 것은
둘뿐입니다.

| 규칙 id | 라벨 | 무엇을 움직이나 |
| --- | --- | --- |
| `near-wall` | NEAR WALL | 벽 띠를 열기 4만큼 앞당김(`wallShift`) |
| `heavy-fracture` | HEAVY FRACTURE | FRACTURE 청구 1.75배(`fractureRate`) |
| `short-clock` | SHORT CLOCK | 판마다 8초 짧고 칩 1.25배(`secondsShift`, `chipsFactor`) |
| `audit` / `cascade` / `audit-cascade` | AUDIT WEEK / CASCADE WEEK / AUDIT & CASCADE | 숫자는 그대로, 장치(`WEEK_RULE_DEVICES`의 `audit`·`cascade`)를 켬. W47 시험 주용 |

- 숫자는 `normalizeSchema`가 가두는 값(벽, FRACTURE, 봉인, 시계, 칩)만 움직이고, 판 위에 덮어 쓸 뿐 판의 표를
  고치지 않습니다(D4). 장치는 허용 목록 둘 말고는 켤 수 없습니다. `tests/unit/weekly-rules.test.mjs`가 둘 다
  지킵니다.
- 규칙의 말(제목·본문·이야기 속 한 줄 `world`)은 `src/copy/weekRules.js`, 시작 화면·순위 화면의 줄과 상자 문구는
  `src/copy/weekRule.js`이고, 영어·일본어는 `src/locales/<lang>/screens/weekRules.js`·`weekRule.js`에 같은
  키로 있습니다. 숫자는 `{shift}` 같은 빈칸으로 들어가 상수 하나를 고치면 세 언어가 따라옵니다.

**달력** -- `src/gauntlet/weeklyCalendar.js`의 `MERGED_WEEKS`: `{ week, id, added }` 한 줄이 한 주입니다.
`added`는 그 줄을 **병합한 날**이고, 유닛 테스트가 「주 시작 7일 전(`WEEKLY_NOTICE_DAYS`)에 병합됐는가」를 이
날짜로 잽니다. 그래서 **알린 날 = 병합한 날**입니다. 서버는 같은 달력을 `public.weekly_rules` 표로 들고 있고
(`supabase/migrations/20261021000000_weekly_rule_event.sql`과 그 뒤의 달력 마이그레이션들), `check:grants`가
PGlite로 마이그레이션을 다시 돌려 두 달력이 같은지 봅니다.

**누가 규칙을 켜나** -- `pickSeasonWeekRule`(`weeklyRules.js`). 이야기 모드는 없음. 이 기기의 **첫 시즌은
규칙 없이** 시작하고 「이번 주의 규칙으로 시작(이번 주 순위로)」 상자를 체크해야 켜집니다(E-8). 시즌을 하나라도
끝낸 기기는 켜진 채 시작하고 「이번 주의 규칙 없이 시작(평소 순위로)」 상자로 끕니다(결정 27). 두 상자는
기기 설정으로 남습니다(`src/state/weeklyRuleChoice.js`).

**화면** --

- 시작 화면 한 줄(`src/components/WeeklyRuleNotice.jsx` → `WeeklyRuleViews.jsx` → `gauntlet/weeklyRuleLine.js`):
  이번 주 규칙이 있으면 그 줄, 다음 주에도 있으면 그 뒤에 「다음 주의 규칙은 …, 다음 월요일 0시부터.」, 이번
  주에 없고 다음 주에 있으면 「다음 주의 규칙」 예고 줄. 둘 다 없는 주에는 문구 조각 자체를 받지 않습니다.
- 사건을 여는 쪽(브리핑) 아래 패널(`src/gauntlet/WeekRulePanel.jsx`, 어느 쪽에 붙는지는 `tableStaging.js`의
  `getBriefingWeekRuleId`): 시즌이 도장 찍은 규칙을 이야기 속 한 줄과 함께 찍고, 읽기 시계가 그 줄도 셉니다.
- 순위 화면(`src/screens/RankingScreen.jsx`의 `WeeklyRuleNotice view="boards"`): 평소 순위 옆에 **이번 주 규칙의
  판**, 그리고 지난주에 규칙이 있었으면 **「지난주의 규칙 · …」 판**이 그다음 한 주 동안 더 보입니다(#409,
  `weekBoardsAt`). 판은 `src/state/useLeaderboard.js`의 `selectLeaderboardWeek`로 고릅니다.

**순위는 주마다 따로** -- 서버가 가릅니다. 클라이언트의 시계는 믿지 않고, `ranking_run_week`가 그 런의 **첫
사건 행이 서버에 도착한 시각**의 주를 읽어 `weekly_rules`에 그 주의 그 규칙이 있을 때만 받습니다(없으면 400으로
거절, 결정 29: 월요일 0시 뒤 유예 없음). 규칙 없는 시즌은 `week`가 비어 평소 순위, 규칙 있는 시즌은
`public_rankings.week`에 주 키가 붙어 그 주의 판입니다. 하루 두 번 기기 제한은 두 판이 함께 씁니다(결정 30).

**테스트와 시계** -- 달력이 있는 화면은 월요일마다 스스로 깨지는 기준 화면이라, 테스트 빌드는 시계를 고정합니다
(`src/state/weeklyClock.js`: `.env.e2e`의 `VITE_WEEKLY_RULE_CLOCK`과 Node의 `E2E_WEEKLY_RULE_CLOCK`, 둘 다
규칙 없는 주 `2026-01-07`). 이벤트 주를 보는 e2e는 `tests/weekly-rule.spec.js` 하나뿐이고
`__weeklyRuleClock`으로 달력의 첫 항목(`WEEKLY_RULES[0]`, 지금 W46)의 주로 시계를 옮겨 시작 화면 줄·브리핑
패널·가까운 벽·순위 판 둘을 봅니다. 개발 서버에서는 `?week=<규칙 id>`로 아무 규칙이나 이번 주로 켜 볼 수
있고, 릴리스 빌드에는 그 스위치가 없습니다.

**시험 주(W47) 전용** -- `.github/workflows/test-week.yml`이 매일 23:40 KST에 운영 DB를 읽어 그 주 시즌이
감사·연쇄 장치에서 무엇을 했는지 Job Summary에 적습니다(`scripts/report-test-week.mjs`, 집계만, 행은 남기지
않음). 요약 마지막 열은 봇 기준값으로, `AUDIT_WEEK=1 CASCADE_WEEK=1 node scripts/check-endings.mjs --report`의
세 줄을 저장소 변수 `TEST_WEEK_SIM_LINES`(또는 수동 실행의 `sim` 입력)에 넣으면 그 값을 씁니다. 11-04에 다시
재 보니 스크립트 안의 10-21 값과 같아 변수는 비워 둡니다. 다른 주를 읽으려면 수동 실행의 `week`·`rule` 입력을
씁니다. `npm run verify:ranking`(`scripts/verify-ranking-rows.mjs --weeks=2026-W47,2026-W46`)은 평소 판과
지정한 주의 판을 함께 다시 계산합니다.

---

## 2. 달력

`MERGED_WEEKS`와 `weekly_rules`가 같은 줄을 듭니다(2026-11-05 기준).

| 주 | 날짜 | 규칙 | 병합일 |
| --- | --- | --- | --- |
| 2026-W46 | 11-09 ~ 11-15 | `near-wall` | 10-16 |
| 2026-W47 | 11-16 ~ 11-22 | `audit-cascade` (시험 주) | 10-22 |
| 2026-W48 | 11-23 ~ 11-29 | `heavy-fracture` | 10-23 |
| 2026-W50 | 12-07 ~ 12-13 | `short-clock` | 10-23 |
| 2026-W52 | 12-21 ~ 12-27 | `near-wall` | 10-23 |
| 2027-W01 | 01-04 ~ 01-10 | `heavy-fracture` | 10-23 |
| 2027-W03 | 01-18 ~ 01-24 | `short-clock` | 10-23 |

둘 중 하나가 격주입니다(2026년은 W53이 있어 2027-W01은 12-28 주 다음). 사이의 주는 규칙 없는 평범한 주이고,
그 주의 시작 화면은 다음 주 예고만 보입니다.

---

## 3. 이벤트 주 절차

### 3-1. 고르기 (D-14 이전)

- 카탈로그의 규칙 id 하나를 고릅니다. **새 규칙**을 만들려면 `WEEK_RULE_CATALOGUE`에 항목, `src/copy/weekRules.js`
  와 영어·일본어 `screens/weekRules.js`에 제목·본문·`world` 한 줄, 그리고 유닛 테스트가 요구하는 범위
  (`normalizeSchema`가 가두는 숫자이거나 허용된 장치, id 32자 이하 `[a-z0-9-]`)를 지킵니다. 새 규칙은 달력에
  올리기 **전에** 먼저 병합해 운영에 배포돼 있어야 합니다. 배포된 카탈로그가 모르는 id는 「규칙 없음」으로
  읽히기 때문입니다.
- 이야기 속 한 줄(`world`)은 「이번 주 그룹은 …했다」 꼴로, 판이 느끼는 것을 말합니다. 쉬운 말 규칙은 사건과 같습니다.

### 3-2. 달력에 올리기 (늦어도 D-7, 월요일 0시 KST 기준 7일 전까지 병합)

한 PR에 둘을 같이 넣습니다.

1. `src/gauntlet/weeklyCalendar.js`의 `MERGED_WEEKS`에 `{ week: "2027-W05", id: "near-wall", added: "<병합일>" }`.
   `added`는 **실제로 병합하는 날**로 씁니다. 날짜가 밀리면 줄을 고쳐서 다시 올립니다. 유닛 테스트가 7일을
   재므로 늦은 줄은 `npm test`에서 떨어집니다.
2. `supabase/migrations/<main의 마지막 마이그레이션 뒤 날짜>_weekly_rule_calendar_<주>.sql`:
   `insert into public.weekly_rules (week, rule_id) values (...) on conflict (week) do update set rule_id = excluded.rule_id;`
   (20261023010000 파일의 꼴). 마이그레이션이 든 PR은 병합하면 1분 안에 운영 DB에 적용되므로 **병합 직전에
   사용자에게 따로 묻습니다.** 아직 시작하지 않은 주의 줄이라 적용 순간에 판정받는 런은 없습니다.
3. `npm run check:grants`(두 달력 비교), `npm test`(`weekly-rules.test.mjs`), `npm run check:changed`.
4. README 「이번 주의 규칙」 문단의 주 목록과 이 문서 2장의 표를 맞춥니다(`check:doc-numbers`는 이 표를 세지
   않으니 손으로).

### 3-3. 알리기

- **게임 안은 저절로**: 병합되면 그 전 주 월요일 0시부터 시작 화면에 「다음 주의 규칙 …, 월요일 0시부터.」가
  세 언어로 붙습니다(`weekHasNews`가 +7일을 봅니다). 정적 쪽(`/about.html`·`/faq.html`·`/contact.html`,
  `scripts/site-pages.mjs`)은 「어떤 주에는 이번 주의 규칙이 열린다」는 한 문장만 있고 **주별 공지는 싣지
  않습니다.** 정적 페이지는 빌드 때 찍히는 글이라 주마다 바꾸면 매주 배포가 생기기 때문입니다.
- **확인**: 예고가 붙는 월요일에 운영 시작 화면을 세 언어로 봅니다. 11-04에 만든 로컬 점검 스크립트
  `.claude/check-week-notice.mjs`(저장소 밖)가 ko/en/ja 줄을 글자까지 비교합니다. 없으면 브라우저로 `/`, `/en/`,
  `/ja/`를 열어 줄 끝 문구를 봅니다.
- **게임 밖**(카톡 방, 테스터 안내문)은 사용자가 보냅니다. 초안의 꼴은 `cp-archive/메모-20261104/w47-tester-notice-1104.md`
  (저장소 밖)입니다. 안내문의 숫자·문구는 `src/copy/weekRules.js`에서 그대로 옮기고, 병합이 안 된 PR의 줄은 뺍니다.

### 3-4. 진행 중 (월요일 0시 ~ 일요일 24시)

- 순위판은 따로 쌓이고 평소 판은 그대로입니다. 할 일은 보는 것뿐입니다: Verify Ranking 정기 실행(23:55 KST)의
  요약에서 그 주 판의 런이 `not checked`로 빠지지 않는지, `differs`/`mismatch` 줄이 0인지. 시험 주면 Test Week
  요약도 매일 봅니다.
- 월요일 0시 직후에 끝난 시즌은 **지난주 판**에 남습니다(첫 사건 행의 주). 순위 화면에 그 판 탭이 한 주 더
  보입니다(#409).
- 다른 작업의 배포는 평소대로 해도 됩니다. 단, 4장의 것은 건드리지 않습니다. W47 시험 주처럼 **동결**을 정한
  주는 그 주의 확인표(`cp-archive/메모-20261104/W47-runup-checklist.md` 꼴)를 따릅니다.

---

## 4. 주중에 바꾸지 않는 것

| 바꾸지 않는 것 | 왜 |
| --- | --- |
| 진행 중인 주의 달력 줄(`MERGED_WEEKS`, `weekly_rules`) | 서버가 첫 사건 행의 주와 도장을 이 표로 대조합니다. 줄을 지우거나 id를 바꾸면 이미 도장 찍힌 시즌의 순위 행이 400으로 거절됩니다 |
| 그 규칙의 숫자(`NEAR_WALL_SHIFT` 등)와 장치 목록 | 시즌은 규칙 **id**만 들고 숫자는 배포된 클라이언트가 읽으므로, 주중에 바꾸면 같은 판에 다른 규칙으로 친 시즌이 섞입니다. `verify:ranking`이 점수를 다시 계산해 `score mismatch`로 잡습니다 |
| 판의 점수에 닿는 규칙(`tableRules.js`, 장치 `auditRisk.js`·`cascadeRisk.js`, 결말 판정) | 위와 같은 이유. 다음 주 월요일 0시 뒤, 지난주 판 탭이 닫힌 뒤에 넣습니다 |
| 랭킹 비우기 마이그레이션, `ranking_run_week`·`public_rankings`를 고치는 마이그레이션 | 병합 1분 안에 적용되고 진행 중인 판을 건드립니다. 원래 병합 직전에 묻는 것들입니다 |
| 테스트 시계 고정값(`E2E_WEEKLY_RULE_CLOCK`, `.env.e2e`) | 바꾸면 main의 기준 화면과 e2e가 그 주에 깨집니다. 고정값은 규칙 없는 주여야 하고 유닛 테스트가 봅니다 |
| 규칙의 말(`weekRules.js`, 세 언어) | 바꿔도 점수는 그대로지만, 안내문과 화면이 달라져 참가자가 혼란스럽습니다. 오타는 다음 주에 |

---

## 5. 되돌리기

- **주가 시작되기 전**: 달력 줄을 지우는 PR 하나에 `delete from public.weekly_rules where week = '…';` 마이그레이션을
  같이 넣습니다(둘 다 지워야 `check:grants`와 유닛 테스트가 맞습니다). 그 주는 평범한 주가 되고, 시작 화면의 예고
  줄은 배포와 함께 사라집니다. 이미 안내문을 보냈으면 취소 안내도 같이 보냅니다.
- **주중에 클라이언트가 잘못됐을 때**: 달력은 두고 **클라이언트만** 되돌립니다(README 「수동 배포와 롤백」,
  Render의 이전 빌드로). 되돌린 빌드도 같은 카탈로그를 알고 있어야 하니, 그 규칙을 처음 넣은 배포보다 앞으로는
  가지 않습니다.
- **주중에 주 자체를 취소해야 할 때**: 달력 줄과 서버 줄을 함께 지우면 그 주에 도장 찍고 아직 끝내지 않은
  시즌은 순위에 오르지 못합니다(400). 그 손실을 받아들일지 사용자가 정합니다. 대신 판은 비우지 않습니다 --
  `public_rankings`의 행은 주 키와 함께 남아 있어 다시 읽을 수 있습니다.
- 어느 경우든 `?week=` 스위치나 시계 고정값으로 운영 화면을 「고치지」 않습니다. 릴리스 빌드에는 그 스위치가
  없습니다.

---

## 6. 끝난 뒤 적는 것

다음 주 월요일에 사용자(소유자)가 적습니다.

1. **`docs/history.md`** 날짜 표에 한 줄: 그 주의 규칙, 판에 오른 시즌 수(Verify Ranking·Test Week 요약의 집계만,
   개인 행은 옮기지 않음), 거절(`differs`·`mismatch`)이 있었는지, 바꾸기로 한 것.
2. **`docs/work-status.md`**: 규칙의 숫자나 장치를 바꾸기로 했으면 그 결정과 다음 반영 PR을 「Still open」에.
   시험 주(W47)의 결과로 감사·연쇄가 판의 규칙이 되면 `weeklyRules.js`의 상수가 `tableRules.js`로 옮겨 가는
   일도 여기 적습니다(그 파일 주석이 그렇게 예고합니다).
3. **HANDOFF**(저장소 밖, 날짜별 `cp-archive/메모-<날짜>/HANDOFF-<날짜>.md`): 요약 파일을 받은 곳
   (`gh run download … -n verify-ranking-summary`), 다음 이벤트 주의 병합 마감(D-7), 지난주 판 탭이 닫히는 날.
4. **README** 「이번 주의 규칙」 문단: 지난 주의 서술을 지우고 다음 주들만 남깁니다(문단은 날짜를 그대로 두는
   기록이 아니라 지금 참인 것만 적는 곳입니다).
5. 다음 달력 줄이 D-7 안에 있는지 봅니다. 비어 있으면 3-2로 돌아갑니다.

---

## 7. 참고: 파일 위치

| 무엇 | 파일 |
| --- | --- |
| 달력, 주 계산, 개발 스위치 `?week=` | `src/gauntlet/weeklyCalendar.js` (`MERGED_WEEKS`, `isoWeekKey`, `weekHasNews`) |
| 카탈로그, 상수, 시즌이 규칙을 고르는 법, 순위 판 목록 | `src/gauntlet/weeklyRules.js` (`WEEK_RULE_CATALOGUE`, `pickSeasonWeekRule`, `weekBoardsAt`, `weekRuleOverlay`) |
| 규칙의 말(세 언어) | `src/copy/weekRules.js`, `src/locales/en/screens/weekRules.js`, `src/locales/ja/screens/weekRules.js` |
| 시작 화면 줄·상자, 순위 판 탭 문구 | `src/copy/weekRule.js`, `src/gauntlet/weeklyRuleLine.js`, `src/components/WeeklyRuleNotice.jsx`, `src/components/WeeklyRuleViews.jsx` |
| 브리핑 아래 패널 | `src/gauntlet/WeekRulePanel.jsx`, `src/gauntlet/tableStaging.js` (`getBriefingWeekRuleId`) |
| 기기의 상자 둘, 시즌의 도장 | `src/state/weeklyRuleChoice.js`, `src/state/runState.js` |
| 테스트 시계 | `src/state/weeklyClock.js`, `.env.e2e` |
| 순위 판 고르기 | `src/state/useLeaderboard.js`, `src/screens/RankingScreen.jsx` |
| 서버 달력·주 판정·`public_rankings.week` | `supabase/migrations/20261021000000_weekly_rule_event.sql`, `20261021010000_weekly_rule_w44_test_week.sql`, `20261022010000_test_week_to_w47.sql`, `20261023010000_weekly_rule_calendar_w48_w03.sql` |
| 달력 비교, 주 판 재계산 | `scripts/check-grants.mjs` (`check:grants`), `scripts/verify-ranking-rows.mjs` (`verify:ranking`) |
| 시험 주 보고 | `.github/workflows/test-week.yml`, `scripts/report-test-week.mjs`, 저장소 변수 `TEST_WEEK_SIM_LINES` |
| 테스트 | `tests/unit/weekly-rules.test.mjs`, `tests/unit/report-test-week.test.mjs`, `tests/unit/verify-ranking-weekly.test.mjs`, `tests/weekly-rule.spec.js` |
