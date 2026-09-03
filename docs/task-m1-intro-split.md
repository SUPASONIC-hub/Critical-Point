# TASK M-1 — 인트로를 AppContent에서 분리한다

3차 감사(`design-audit-2026-09-03-round3.md`)의 M-1을 실행 가능한 형태로 쪼갠 문서입니다.
`작업지시서.md` 6장의 프롬프트 템플릿과 금지 항목을 그대로 적용했습니다.

> **실행 완료(2026-09-03).** A·B 모두 반영했습니다. 결과는 `docs/work-status.md`의
> "Applied: M-1"과 `작업지시서.md`의 마지막 상태 업데이트에 있습니다. 진입 청크는
> 31.6KB gzip, 진입 소스 19개 파일, e2e 110 passed, 시각 기준선 5장 통과입니다.
> 아래 원문은 지시 그대로 보존한 기록입니다.

**A를 먼저 돌리고 통과한 뒤 B를 주십시오.** A는 import 문만 건드리므로 실패해도 되돌리기
쉽고, B의 가장 큰 위험(저장본 복구 경로)을 A가 미리 줄여줍니다.

측정 기준 커밋: `f360e19`

---

## 배경 수치 (실측)

```
진입 청크 원본 소스 453KB / 47개 파일
   98KB  src/AppContent.jsx     62KB  src/gameData.js
   49KB  src/gameLogic.js       22KB  src/gameDialogue.js
   21KB  src/advancedSystems.js 19KB  src/state/savedState.js

한국어 문자열을 전부 스텁으로 바꾼 대조군
   진입 청크 348KB → 261KB,  gzip 115.7KB → 85.2KB
```

회수 대상은 그 30KB입니다. AppContent가 인트로를 그리기 때문에 그 import 그래프 전체가
첫 화면에 필요하고, 그래서 지금은 한 바이트도 미룰 수 없습니다.

---

## TASK M-1A. AppContent의 상수 import를 원 모듈로 되돌린다

```
아래 TASK 하나만 수행해라. TASK에 없는 변경은 하지 마라.

[배경]
src/AppContent.jsx:25-42는 상수 17개를 전부 ./gameData.js에서 가져온다. 그중 그래프가
필요한 것은 7개뿐이고, 나머지 10개는 gameData가 다른 모듈에서 re-export 하는 것을
통과시키는 것뿐이다. 이 통로 때문에 인트로 한 화면을 그리려고 장면 그래프 62KB와
대사 22KB가 진입 청크에 들어온다. M-1B의 전제 작업이다.

[지시]
1. src/AppContent.jsx:25-42의 gameData import를 셋으로 나눈다.
   - ./gameConstants.js → cognitionLabels, initialResources, triggerLabels
   - ./gameCases.js     → CASE_RESULT_NODES, CASE_SEQUENCE, CASE_START_NODES,
                          caseObjectives, seasonCasesBase
   - ./gameDialogue.js  → boardChangePrompts
2. ./gameData.js에는 그래프 심볼 7개만 남긴다:
   nodes, nodeOrders, caseOpeningRoutes, getBranchDetourBypass,
   getCaseBranchNodes, getCaseRouteLength, getNodeRouteIndex

[함정 — 코드를 쓰기 전에 반드시 확인]
nodeOrders는 gameCases.js가 export 하지만, gameData.js가 로드 시점에
order.splice(...)(gameData.js:482, 561, 771)와 unshift(...)(982)로 변형한다.
gameCases에서 직접 가져오면 연결·반응·분기·오프닝 장면 66개가 빠진 배열을 받는다.
nodeOrders는 반드시 gameData에서 계속 가져와라.

[금지]
- 새 정규화/폴백/복구 함수를 추가하지 말 것. 기존 것을 불필요하게 만드는 방향으로만 고칠 것.
- 상수를 새로 선언하면 실패로 간주한다. 반드시 기존 export를 import 할 것.
- 이 TASK의 [지시] 목록 외의 변경은 전부 되돌릴 것. import 문 외에는 한 줄도 바뀌면 안 된다.
- 파일 총 줄 수가 ±5줄을 넘게 변하면 안 된다.

[검증]
npm run verify:static
npm run verify:e2e
node --input-type=module -e "import { nodeOrders } from './src/gameData.js'; console.log('case01 길이', nodeOrders.case01.length, '(15여야 함)');"

[완료 기준]
- verify:static 11개 전부 통과, e2e 110 passed.
- grep -c "" src/AppContent.jsx 가 2387 ± 5.
- AppContent가 gameData에서 가져오는 심볼이 정확히 7개.

작업 전에:
- 수정할 파일과 줄 번호를 먼저 나열해라.
- [금지] 항목을 어기게 되는 부분이 있으면 코드를 쓰기 전에 말해라.

작업 후에:
- [검증]의 명령을 실제로 실행하고 출력을 붙여라.
- 변경된 파일의 줄 수 증감을 보고해라.
```

---

## TASK M-1B. 장면 그래프를 인트로 뒤로 미룬다

```
아래 TASK 하나만 수행해라. TASK에 없는 변경은 하지 마라.

[배경]
진입 청크는 원본 소스 453KB이고 그중 AppContent 98KB, gameData 62KB, gameDialogue
22KB다. AppContent가 인트로를 그리기 때문에 그 import 그래프 전체가 첫 화면에 필요하다.
측정: 한국어 문자열을 전부 스텁으로 바꾸면 진입 청크가 348KB → 261KB,
gzip 115.7KB → 85.2KB가 된다. 회수 대상은 그 30KB다. M-1A가 선행되어야 한다.

[지시]
1. src/GameRuntime.jsx를 새로 만든다. AppContent에서 아래 14개 지점과 그것들이 만드는
   파생값을 이 파일로 옮긴다. 상태(useState/useRef)는 옮기지 말고 props로 받는다.
     446  activeNodeOrder      447  debugNodeOptions     449  resolvedNodeId
     452  caseOpeningRoutes    455  node                 631  unopenedBranchCount
     1033 musicRouteIndex      1256 startNode            1463 getFreeTextBranchTarget
     1475 choose의 next 검증   1634 branchBypass         1837 decisionReveal.nextTitle
     2036 startDebugNode       2203 routeLength / 2204 routeIndex
2. AppContent는 started === false일 때 IntroScreen만 그린다. gameData import 0개가
   되어야 한다. started가 되면 lazy(() => import("./GameRuntime.jsx"))를 Suspense로
   마운트한다. 기존 IntroScreen/PlayScreen/ResultScreen의 lazy 구조를 그대로 따른다.
3. 저장본 복구 경로를 확인한다. parseCurrentSavedState가 started: true인 세이브를
   돌려주면 인트로를 거치지 않고 런타임이 바로 마운트되어야 한다. 이 경로가 이번
   작업에서 가장 깨지기 쉬운 곳이다.
4. src/viewModels/appViewModels.js의 viewGroups가 이동한 필드를 계속 정확히 기술해야
   한다. npm run check:views가 이것을 강제한다.

[금지]
- 새 정규화/폴백/복구 함수를 추가하지 말 것. 그래프가 아직 없을 때의 처리는
  "렌더하지 않는다"여야 하고, ?? nodes.start 같은 조용한 대체를 새로 만들면 안 된다.
- 폴백을 불가피하게 추가한다면 반드시 reportSilentFailure(AppContent.jsx:106)를 함께
  호출할 것.
- 상수를 재선언하면 실패로 간주한다.
- 템플릿 생성 함수로 코드를 늘리지 말 것.
- 이 TASK의 [지시] 목록 외의 변경은 전부 되돌릴 것. 게임 로직·데이터·CSS는 한 줄도
  바뀌면 안 된다.
- 파일 총 줄 수(AppContent + GameRuntime)가 현재 AppContent 2387줄보다 늘어나면,
  코드를 쓰기 전에 왜 늘어야 하는지 먼저 말할 것.

[검증]
npm run verify:static
npm run verify:e2e          # 110 passed 여야 한다. 순수 함수 assert만으로는 완료가 아니다.
npm run test:visual
npm run build
node node_modules/vite/bin/vite.js build --sourcemap --outDir dist-map --logLevel error
node -e "const {readFileSync,readdirSync}=require('fs');const d='dist-map/assets';const m=readdirSync(d).find(f=>/^index-.*\.js\.map$/.test(f));const {sources}=JSON.parse(readFileSync(d+'/'+m,'utf8'));const has=n=>sources.some(s=>s.endsWith(n));console.log('gameData in entry:',has('gameData.js'),'gameDialogue:',has('gameDialogue.js'));"

[완료 기준]
- 위 마지막 명령이 gameData in entry: false gameDialogue: false 를 출력한다.
- dist/assets/index-*.js의 gzip 크기가 현재 124KB에서 95KB 이하로 내려간다.
- e2e 110 passed. 특히 다음 4개가 통과해야 한다:
  "reload restores the run" / "corrupt saved route is repaired before resume" /
  "a replay link restores the captured scene in a fresh context" /
  "error log replay jumps to the captured scene"
- 시각 기준선 5장이 재생성 없이 통과한다(레이아웃은 바뀌지 않아야 한다).

작업 전에:
- 수정할 파일과 줄 번호를 먼저 나열해라.
- [금지] 항목을 어기게 되는 부분이 있으면 코드를 쓰기 전에 말해라.

작업 후에:
- [검증]의 명령을 실제로 실행하고 출력을 붙여라.
- 변경된 파일의 줄 수 증감을 보고해라.
```

---

## 왜 이 순서인가

M-1A는 import 문만 바꾸므로 바이트가 줄지 않습니다. 그런데도 먼저 하는 이유는, 이 작업이
끝나야 **AppContent가 그래프에 실제로 의존하는 표면이 7개 심볼 14개 지점으로 보이기**
때문입니다. 지금은 상수 통로에 가려 17개 심볼처럼 보입니다. M-1B의 어려움은 코드량이
아니라 그 표면을 정확히 아는 데 있습니다.
