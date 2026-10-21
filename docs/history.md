# 임계점 개발 기록

질문 하나에서 쉰다섯 사건까지, 2026년 8월 13일부터 10월 8일까지의 여덟 주.

이 글은 2026년 10월 8일에 썼다. 그날 아침 만든 사람이 남긴 요청이 출발점이다. "계속 진행했던만틈 완성도가
올라간것 같아서 흔적을 남기고 싶어." 어떻게, 어떤 방식으로, 어떤 생각으로 이 게임을 만들었는지를 적어
두자는 것이었다.

여기 적힌 것은 전부 남아 있는 기록에서 왔다. 커밋 899개와 그 메시지, 9월 8일부터 남아 있는 만든 사람의
작업 지시 311건, README와 `docs/work-status.md`, PR과 감사 보고서다. 기록이 없는 구간은 없다고 적었고,
장면이나 감정을 지어내지 않았다. 인용한 말은 오타까지 원문 그대로다. 무엇을 보고 무엇을 보지 못했는지는
맨 끝 "자료와 한계"에 있다. 시각은 모두 한국 시간이다.

## 1. 질문

작업 폴더의 이름은 영어 문장이다. *When does my creativity burst.* README는 그것을 이렇게 옮긴다. "내
창의성은 언제 가장 크게 확장되는가."

이 질문에는 날짜가 있다. 2026년 8월 7일, 만든 사람은 AI와 이케이도 준의 소설 《아키라와 아키라》와
《한자와 나오키》를 두고 열 차례 문답을 주고받았고, 그 대화록을 저장소의 첫 커밋에 넣었다(이틀 뒤
작업 트리에서는 지웠지만 git 이력에 남아 있다). 첫 답에서부터 만든 사람은 주인공의 지성이 어디서
왔는지를 문제 삼았다. 고난이 사람을 똑똑하게 만든다는 설명을 받아들이지 않았고, 다음 답에서 다른 설명을
냈다. "집념. 그 사람을
도와주고 싶다는 마음에서 나오는 지속적으로 고민을 하는 힘." 그리고 바로 뒤에 자기 답을 의심했다. 그런
선의를 계속 유지하는 것은 "소서적 허구라는 생각이야."

대화가 《한자와 나오키》로 넘어가자 같은 구조가 다른 감정에서 나왔다. 한쪽은 애정이, 다른 쪽은
"인간에 대한 복수심이 트리거가 된거 같아." 가장 마음에 남았다고 한 통찰은 사람은 돈을 쓰고 그래서
"돈의 흐름이라는 흔적이 남는다"는 것이었다. 결론에 가까운 문장도 그날 나왔다. "아무리 비정한 자본이라도
그걸 움직이는건 인간이고, 그 인간을 움직이는 동력은 인간에 대한 애정이다."

문답이 끝난 뒤의 기록이 더 짧고 더 중요하다. "이걸 가지고 뭔가를 만들고 싶은데 방향을 모르겠어."
AI가 에세이를 권하자 "에세이 같은거말고"라고 했고, 저작권 때문에 2차 창작은 못 한다고 했고, 게임이라는
제안에 이렇게 답했다. "좋아. 게임이라는 방향성 마음에 들고, 나는 언제똑똑해지는가? 라는 포인트도 좋아."

같은 날짜로 된 기획 초안 v0.1이 그 뒤를 잇는다. 가제는 `TRIGGER — 나는 언제 똑똑해지는가?`였다가
초안 안에서 이미 **임계점 — 판단이 깊어지는 순간**으로 바뀌어 있다. 초안은 이 게임이 무엇이 아닌지부터
적는다. IQ 테스트가 아니고, 성격 분류가 아니고, 정답 맞히기가 아니다. 원작의 인물, 회사, 사건, 대사는
하나도 가져오지 않고 "추상화된 사유"만 쓴다는 원칙도 여기 있다. 플레이어가 받아야 할 보상은 한 줄로
적혀 있다. 선택지만 고르던 사람이 어느 순간 스스로 판을 다시 짜고 싶어지는 것. "잠깐. 그러면 이렇게
하면 되잖아?"

이 문서가 따라가는 여덟 주는, 그 한 줄을 화면에서 실제로 일어나게 하려고 한 시도의 기록이다. 그리고
8월 7일의 문장들은 나중에 사건이 되어 돌아온다. 돈의 흔적은 사건 08이, 손익계산서는 사건 09가, 선의는
소설적 허구라는 의심은 사건 10이 받았다.

## 2. 여덟 주

### 사흘 — 8월 13일~15일

첫 커밋은 8월 13일 16시 23분, 제목은 `Initial critical point prototype`이다. 파일 14개, 8,608줄.
화면과 상태를 한 파일에 담은 `src/main.jsx`가 922줄, 사건 데이터가 1,480줄이었다. 그때의 README가
적은 범위는 사건 다섯 개와 마지막 사건 하나, 각 사건에는 선택지, 구조 재설계 자유입력, 에코의 반론,
자원 변화, 결과 리포트가 있었다. 초안의 말대로 "화려한 그래픽보다 상황 설계와 반론의 질"이 먼저인
텍스트 게임이었다.

첫 커밋 2분 뒤에 Supabase 플레이테스트 텔레메트리가 붙고, 7분 뒤에 데이터 제공 동의가, 15분 뒤에
Render 배포 설정이 들어간다. 이 게임은 처음부터 남에게 플레이시키고 그 기록을 모으는 도구로 시작했다.
README는 지금도 이 게임을 만든 사람에게는 "플레이테스트 도구"라고 적는다.

사흘째인 8월 15일에는 커밋이 117개다. 새벽 2시 25분부터 밤 9시 11분까지, 대부분 `main.jsx` 한 파일을
몇 줄에서 수십 줄씩 고친 것들이다. 제목만 읽어도 무엇이 쌓였는지 보인다. `Add timed decision
pressure`(03:24), `Add adaptive background music`(03:18), `Add public player leaderboard`(15:56),
`Pause decision timer in background`(18:42). 시간 제한, 음악, 랭킹, 저장 복구, 키보드 조작이 이날 하루에
들어왔다. 이 사흘의 커밋 134개에는 공동 작성 표시가 없고, 어떤 도구로 어떻게 썼는지는 커밋 기록만으로는
알 수 없다.

### 조용한 주와 작업지시서 — 8월 16일~9월 4일

8월 16일부터 26일까지 커밋은 두 개뿐이다. 8월 20일의 `Add recovery logging and e2e safeguards`와
다음 날의 모바일 흐름 수정. 그 열하루 동안 무슨 일이 있었는지는 자료에 없다. 다만 그 두 커밋 가운데
앞의 것이 첫 GitHub Actions 워크플로(`verify.yml`)와 첫 브라우저 테스트 두 개를 들여왔다는 것은 남아
있다. 검사는 가장 조용한 주에 시작됐다.

8월 28일에 `작업지시서.md`가 등장한다. 나중 커밋은 그것을 "the 2026-08-28 Codex work order"라고
부르고, 결함 D-1부터 D-13, 과제 T1부터 T5가 적혀 있었다고 전한다. 그 무렵 `main.jsx`는 5,410줄이었다.
8월 29일 하루에 커밋 29개가 들어가는데, 자정 직후의 두 개가 이 저장소의 성격을 정한다.

하나는 게임이 아예 열리지 않던 문제다. 떼어 낸 컴포넌트 네 개에 `import React`가 빠져 있어서 e2e
테스트 90개 중 74개가 깨져 있었다. 다른 하나는 글자가 보이지 않던 문제다. 스타일시트가 113KB짜리 한
줄로 압축되면서 색 선언 119개가 망가졌고, 배경을 잃은 패널 위의 글자가 읽히지 않았다. 이 수정은 고치는
데서 끝나지 않고 `tests/contrast.spec.js`를 남겼으며, 커밋 메시지는 한 줄을 덧붙인다. "Verified it
fails when a fix is reverted." 고친 것을 되돌리면 검사가 실패하는지까지 확인했다는 뜻이다. Claude가
공동 작성자로 적힌 커밋은 이 두 개가 처음이다.

9월 2일에는 유지 규칙의 집인 `docs/work-status.md`가 생기고, 데이터베이스 스키마를 대시보드에 손으로
붙여 넣던 방식이 마이그레이션 파일로 바뀌고, 검증이 빠른 단계와 무거운 단계로 나뉜다. 커밋 제목의 말투도
이날 오후부터 달라진다. `Add …`로 시작하던 제목이 `Give each selector one home and name the colour
shades` 같은 문장이 된다. 9월 3일에는 하루에 디자인 감사가 세 번 돌았고, 9월 4일의 한 커밋은 제목이
`Fix what playing the first case actually showed`다. 같은 날 `Make the Node pin a check instead of a
convention`이 들어간다. 약속을 검사로 바꾼다는, 이후 계속 반복될 문장의 첫 등장이다. `verify:static`은
이때 검사 열여섯 개였다.

### 정체 — 9월 7일~9일

9월 7일 저녁, 저장소에 `.agents/` 폴더가 생긴다. PM, 기획, 디자인, 사운드, DBA, 개발, QA 일곱 역할의
지침서와 그 역할들을 차례로 돌리는 스크립트다. 남아 있는 작업 지시 가운데 가장 이른 것이 다음 날 오후
3시의 이 문장이다. "저장소의 에이전트 오케스트레이터를 실제로 실행해 PM·기획·디자인·사운드·DBA·개발·QA
의견을 순차 수집하고, 공통 우선순위로 통합한 개선만 반영해줘." 끝에는 "이 작업을 루틴하게
반복진행해줘"가 붙어 있다. 9월 8일과 9일의 커밋 제목은 대부분 `feat:`, `fix:`, `polish:`로 시작한다. 9월 8일
12시 58분에는 작성자 이름이 `Codex`인, 파일을 하나도 바꾸지 않는 커밋 `chore: credit Codex
contributor`가 하나 있고, 전날에는 `fix Codex subcommand forwarding on Windows`가 있다. 기록이 말해
주는 것은 거기까지다.

하루 뒤 만든 사람은 이렇게 썼다. "개선 방식이 정체되어있는 느낌이야." 그리고 게임명, 장르, 디자인,
소리, 진행 방식, 이야기 어느 것이든 "게임성, 재미요소를 위해서라면 변경이 가능해"라고 했다.

그날 저녁 커밋 `feat: one decision, one screen`이 그 정체가 무엇이었는지를 숫자로 적었다. 플레이 화면에는
늘 떠 있는 구역이 28개, 서랍이 7개 있었고, 390x844 휴대폰에서 3,953px였다. 결정 하나를 하려면 화면
4.7장을 내려야 했다. 결과 리포트는 10,616px였다. 메시지의 한 문장이 원인을 짚는다. "Every cycle had
added a panel." 사이클을 돌 때마다 패널이 하나씩 늘어 온 것이다.

역할 일곱 개의 자동 순환은 9월 16일에 폴더째 삭제된다. 삭제 커밋의 이유는 아무도 그것을 실행하지
않는다는 것이었다.

### 판을 부수다 — 9월 10일~15일

9월 10일 오후 5시의 지시는 그 전까지와 전혀 다르게 생겼다. 여러 장의 긴 지시문을 이어 붙인 것으로,
"마이너 패치나 리팩토링 수준의 작업은 전면 거부한다"고 선언하고, Balatro와 Inscryption과 Papers,
Please를 기준으로 들고, 세 가지를 요구한다. 게이지가 찰수록 보상이 커지지만 임계점을 넘으면 전부 잃는
'Push Your Luck', 심장박동 소리와 화면 흔들림, 그리고 선택이 다음 턴의 규칙을 부수는 구조. 커밋
메시지에 `[Breaking Change: Core Loop Overhaul]`을 붙이라는 요구도 있었다. 그 꼬리표를 단 커밋이 9월
10일부터 15일까지 44개다. 그 사이 만든 사람의 대답은 대부분 "ㅇㅇ"이거나 "B", "A" 한 글자였다.

다음 날 오전, 정리하다 남긴 것이 있다는 보고에 만든 사람은 전부 지우라고 답했다. 남긴 이유가 외형이
바뀔까 봐였던 CSS에는 "외형변경 돼도 돼. 외형이 이상하면 다시 수정하면 돼." 옛 변경 기록 1,075줄에는 "삭제해." 그리고
"과거 형상은 중요하지 않아."

9월 14일 15시 52분, `Replace the decision board with the gauntlet table`. 파일 64개에서 3,848줄이
더해지고 9,377줄이 빠졌다. 메시지는 이전 화면을 한 문장으로 정리한다. "The board was a visual novel
with a push-your-luck HUD bolted on." 터질 확률이 정확한 퍼센트로 찍혀 있어서 0%가 아니게 될 때까지
누르는 것이 최선이었고, 휴대폰에서는 첫 선택지가 1,800px 아래에 있었다. 새 판에서는 결정 하나가 한
화면이다. 카드를 걸고, 밀거나 확정한다. 벽은 보이는 구간 어딘가에 있고 그것을 가리키는 것은 오차가 있는
심박뿐이다. 벽에 닿으면 판돈이 사라지고 다음 판의 규칙이 부서진다. 탭을 새로 열거나 저장을 되돌려서 한
번 본 벽을 다시 볼 수 없게 한 것도 이 커밋이다.

30분 뒤 만든 사람이 직접 해 보고 썼다. "실제 화면 테스트 해봤는데 간결해지고 게임성도 재밌어지고 작업
방향성은 다 좋은데, 현재 어던 상황이라는 설명이 너무 부족해." 한 시간 남짓 뒤의 커밋이 `Restore
gauntlet situation clarity`다.

9월 15일에는 판에 몸과 축적이 생긴다. 13시 26분의 커밋은 그때까지의 판을 "brain and luck and no
body"라고 적고, 밀어붙이는 순간을 심박의 박자에 맞추게 했다(PERFECT, GOOD, SLIP과 GROOVE 보너스).
14시 39분의 커밋은 그때까지 판이 바꾸는 규칙이 여섯 가지 전부 벌이었다는 것을 짚고, 사건이 닫힐 때
도구 셋 중 하나를 고르게 했다. 저녁에는 화면 셋이 하나의 어두운 유리 층으로 다시 그려졌고, 19시의
마지막 커밋이 README에 이 게임이 무엇을 위한 것이며 어떻게 이기는지를 처음으로 적었다.

### 사슬 — 9월 16일~23일

9월 16일 하루의 기록은 지시와 커밋이 번갈아 나온다.

오전 10시 11분, 만든 사람은 이야기가 읽히지 않는다고 썼다. "질문내용이 빈약해." 장소가 어떻게 바뀌는지
모르겠다는 말은 더 구체적이다. "내가 이동한건가? 이민지는 갑자기 왜나오고?" 33분 뒤의 커밋 `Let every
scene say where it is and what it asks`가 원인을 찾아 적었다. 카드 위의 한 줄이 틀에서 찍혀 나와, 장면
149개가 전부 같은 문장으로 묻고 있었다.

10시 46분에는 어둡고 긴장된 분위기 "일변도만으로는 플레이가 힘들테니" 웃음과 슬픔이 쉬어 갈 자리가
필요하다고 했다. 12시 11분의 커밋이 사건 06과 함께 막간을 만든다. 베팅도 시계도 없는, 복도와 문자 한
통과 자판기의 장면이다.

12시 14분의 지시가 이 게임의 이야기를 정했다. "이 모든 스토리의 근원에는 이케이도 준의 데뷔작부터
한자와나오키, 최근작 아키라와 아키라까지 은행, 금융, 회사 간의 미스테리, 서스펜스가 기본 축이야."
그리고 한 줄. "기준점은 오로지 재미. 이갸기의 개연성." 42분 뒤의 커밋이 `Hang all seven cases off one
bad loan`이다. 메시지는 이렇게 시작한다. "The season was an anthology." 서로 무관하던 일곱 사건이
KD은행이 플로우온에 내준 310억 대출, 대출번호 2023-0412 하나에 매달렸다. 분석관은 3년 전 그 대출에
혼자 반대 의견을 쓴 사람이 되었고, 같은 방의 동료들은 저마다 그 대출에 빚이 있는 사람이 되었다. 일본식
금융 한자어를 쓰지 않고 어려운 말은 괄호로 풀어 준다는 두 규칙도 이 커밋에서 나왔다.

오후도 같은 식이다. 장면마다 그림을 더 달라는 지시(13:00) 뒤에 방을 파일 없이 코드로 그려 내는
`scenePlate.js`가 생겼다(14:03). "플레이가 시간에 쫒겨서" 읽고 생각할 여유가 없다는 말(15:13) 뒤에
`Take reading off the clock`이 읽는 시간을 판단 시계에서 떼어 냈다(17:50). 17시 51분, 만든 사람은
8월 7일의 대화록을 가리키며 "여기서 [사용자]가 나의 생각의 결과이고, 이걸 기반으로 이 게임의 초안을
마련한거야"라고 알려 주었고, 45분 뒤 복수심의 사건 08과 애정·책임의 사건 09가 들어왔다. "이동중에
전부 완료까지 한숨에 가기가 어려움"이라는 말(18:41) 뒤의 커밋 제목은 그 말을 그대로 받는다. `Let a
season be played in the pieces a commute is made of`(19:23). 판을 걸어 둔 채 멈췄다가 다른 기기에서
이어 하는 기능이 그날 생겼다.

9월 18일의 사건 10은 8월 7일의 의심에 답한다. 커밋 메시지는 그 의심을 한국어 그대로 인용하고, 사건이
그 반박과 싸우지 않고 동의한다고 적는다. 선의가 옳은지가 아니라 그 값이 얼마이고 청구서가 누구에게
가는지를 묻는 사건이다.

9월 16일부터 23일까지 시즌의 길이는 아홉 번 바뀐다.

| 날짜 | 사건 수 | 무엇이 들어왔나 |
|---|---|---|
| 8월 13일 | 6 | 사건 01~05와 마지막 사건 |
| 9월 16일 | 7 → 8 → 10 | 동료의 사건 06, 사건 07, 2막의 08·09 |
| 9월 18일 | 11 | 사건 10 「멈추지 못하는 사람」 |
| 9월 21일 | 12 → 13 | 국정감사의 사건 11, 피해자들을 만나는 사건 12 |
| 9월 22일 | 25 → 50 | 3·4막(13~24), 두 번째 해의 5~8막(25~49) |
| 9월 23일 | 55 | 3년 전을 다루는 프롤로그 다섯 장 |

9월 22일의 두 번은 지시 한 줄씩이었다. 10시 8분에 "챕터가 전부 13개인데 25개까지 늘려줘", 커밋은
13시 11분. 14시 38분에 "25개인데 50개까지 늘려줘", 커밋은 17시 2분. 뒤의 커밋은 스물다섯 작가가
동시에 쓰는 바람에 예시 이름이 겹쳤고 그래서 이름 하나에 사람 하나가 되도록 연속성 점검을 따로 했다고
적는다. 사건을 하나 더하려면 네 파일의 표 스무 개를 고쳐야 했던 구조가 이때 "사건 하나는 파일 하나"로
바뀌었고, 용어집은 29개에서 189개가 되었다. 시즌 길이가 바뀔 때마다 랭킹은 비워졌다. 9월 16일부터
23일까지 여섯 번이다.

이 시기에는 들어왔다가 나간 것도 있다. 9월 21일, 자유 입력 카드를 언어 모델이 읽어 채점하는 장치가
들어갔다. 만든 사람이 직접 쓴 채점 지시문이 기록에 있고, 커밋은 그 지시문이 하려던 일 가운데 세 가지는
구조상 할 수 없다고 조목조목 적었다. 이틀 뒤 만든 사람이 방향을 바꾼다. "판을 다시 짠다도 주관식이
아니라 객관식으로 만들어줘." 그날 커밋이 모델 호출, 서버 함수, 배치 스크립트, 글 상자를 전부 지웠다. 지운 이유도 적혀 있다. 숨은 경로가 열리는 조건이 키워드 네 묶음이었고, 플레이어는 그 규칙을 볼
수 없었으며, 가장 좋은 전략은 결정을 하는 것이 아니라 마법의 낱말을 쓰는 것이었다.

9월 23일의 마지막 수정은 낱말 하나다. 게임이 '사고(思考)'라는 말로 생각을 가리키고 있었는데 이야기
안의 '사고(事故)'와 겹쳤다. 만든 사람의 말은 이렇다. "accident의 의미로 오해 소지가 있어. 생각이
폭발적으로 확장되는 순간인데 의미가 이상해." 생각을 뜻하는 '사고'는 저장소 전체에서 '생각'이 되었다.
README 맨 위 질문의 "가장 크게 확장되는가"라는 표현이 이때 정해졌다.

### 더하기에서 확인하기로 — 9월 27일~29일

9월 27일 오전, 만든 사람은 Supabase에서 온 안내 메일을 붙여 넣고 물었다. 10월 30일부터 새 테이블에
권한이 자동으로 붙지 않는다는 내용이었다. 권한을 적어 넣는 것으로 끝낼 수 있었지만 한 번 더 나갔다.
"응 check:grants 검사로 저장소에 넣어줘." 모든 마이그레이션을 빈 데이터베이스에 처음부터 다시 돌려 보고
권한 없는 테이블이 있으면 실패하는 검사가 그날 생겼다.

같은 날 17시 57분의 지시는 한 줄이다. "현재 전체 형상 기준으로 개선포인트 세밀하게 찾아줘." 새로 만들
것을 말하지 않고, 이미 있는 것을 전부 읽어 달라는 요청이다. 9월 9일에도 개선점을 추천해 달라고 한 적이
있지만 그때 붙은 조건은 재미였다. 이 문장은 그 뒤로 세 번 더, 글자 하나 다르지 않게 나온다.

그날 밤의 커밋 제목들은 찾아낸 것을 그대로 말한다. `drop the 880 routes no run ever took`(사건 파일에
적힌 다음 장면 1,488개 가운데 880개가 실행 전에 덮어쓰여 한 번도 쓰인 적이 없었다). `Check the CSP by
its value … because presence proved nothing`. `Ship one 264KB font cut from the game's own text`(글꼴이
조각 92개, 3.1MB로 실려 있었다). 온라인 저장은 기본으로 꺼졌고, 랭킹의 시각과 신원과 속도는 서버가
정하게 되었다. `worktree-agent-…`라는 이름의 브랜치 병합이 커밋 기록에 처음 나타나는 것도 이날이다.
여러 에이전트가 각자의 작업 트리에서 동시에 고쳤다는 뜻이다.

9월 28일에 감사를 한 번 더 했고, 약 100건이 나왔다. 그날 커밋은 84개다. 그런데 이날의 가장 오래 남은
결과는 실패에서 나왔다. 에이전트 여덟 개를 한꺼번에 돌렸더니 사용 한도를 몇 시간 안에 두 번 소진했고,
컴퓨터가 버티지 못해 혼자 돌리면 통과하는 브라우저 테스트가 시간 초과로 떨어졌다. 그 뒤로 에이전트는
세 개씩, 브라우저 테스트는 한 번에 하나라는 규칙이 생겼고 지금도 그대로다.

같은 날 17시 46분의 지시가 또 하나의 규칙을 만든다. "19시까지 깃 푸시 완료 및 렌더 배포 검증까지
마치지 못할것 같으면, 중간 내용 기록하고 내일 작업 이어서 할 수 있도록 해줘." 다음 날 첫 지시는
"HANDOFF.md 읽고 audit-fix-pass 작업 이어서 해줘"였다. 하루를 저녁 7시에 끝내고, 끝나지 않은 일은
파일에 적어 다음 날로 넘기는 방식이 이 이틀 사이에 자리 잡았다.

이 사흘에 생긴 것들이 지금의 뼈대다. 이야기의 사실을 한 표에 적고 원고를 그 표에 대조하는
`docs/canon.md`와 `check:canon`. 읽는 시계와 번쩍임과 단축키를 플레이어가 고르는 편의 설정. 시즌을
사건 하나씩 내려받는 구조. 그리고 9월 29일 14시 26분에 병합된 PR #13(파일 250개, 16,006줄 추가,
4,786줄 삭제) 이후로 `main`에 들어간 것은 전부 PR이다.

배포도 이 무렵 제 모양이 되었다. 계기는 9월 18일의 한 줄이다. 방금 푸시한 것이 자동으로 배포됐다는
보고를 받은 만든 사람이 답했다. "자동으로 렌더 디플로이 된다는 말 거짓말 같아. 확인 후 수정해줘."
그 말이 맞았다. `render.yaml`의 자동 배포 설정은 한 번도 적용된 적이 없었고, 배포 확인 작업은 아무것도
가져오지 않으면서 초록불을 내고 있었다. 수정 커밋은 그 초록불이 "was good enough to fool me into
telling someone their latest commit was live"였다고 적는다. 그 뒤로 배포는 검증을 통과한 커밋에만
걸리고, 배포된 사이트가 바로 그 커밋을 내주는지까지 확인한다.

### 읽고 또 읽기 — 10월 4일~8일

9월 30일부터 10월 3일까지는 커밋이 없다. 10월 4일 밤 9시 반에 "이어서 진행해줘"로 다시 시작해 새벽
2시 25분까지 PR 여덟 개가 병합됐다. 열한 개의 옛 사건이 새 파일 구조로 옮겨졌고, 모든 카드가 선택지
제목을 되읽는 대신 자기 말로 말하게 되었다.

10월 5일의 지시는 46건으로 기록상 가장 많다. 그날 PR 제목 하나가 이 주의 일을 요약한다. `Every voice
line read against its scene`. 저녁에 만든 사람이 물었다. 처음에 개선사항을 추천받은 뒤로 며칠째 고치고
있는데 "몇%나 수정진행됐는지 궁금해."

10월 6일에 세 번째 전체 감사를 했다. 네 갈래로 읽어 약 90건, PR #37은 파일 244개였다. 처음 시작할
때 사건 쉰다섯 개를 다 기다리던 것이 한 개만 기다리게 되었고, 한 번 연 사본은 연결 없이도 열리게
되었고(서비스 워커), 판의 상태가 한 표에서 나오게 되었고, 사건 01~07과 마지막 사건이 시즌의 나머지와
같은 길이로 다시 쓰였다. 이날 알게 된 사실도 하나 있다. `main`에 병합하면 데이터베이스 마이그레이션이
1분 안에 운영에 적용되고 있었다. README는 그때까지 반대 순서로 적혀 있었다.

10월 7일 아침의 지시는 여섯 항목이고, 그 가운데 둘이 방식을 바꾼다. 하나는 어제의 발견이 "에이전트가
코드 읽기로만 확인한 것이라 재검증이 필요해"라는 것. 다른 하나는 "보고까지만 하고, 수정은 내가 목록을
보고 고른 뒤에 진행해줘." 읽기만 하는 에이전트 열다섯이 전날 쓴 코드, 판과 소리, 테스트, 옛 마이그레이션
34개, 사건 파일 38개를 읽었다. 목록을 본 뒤 만든 사람이 전부 고치라고 했고, 그날 커밋은 126개로 가장
많다. 그 가운데 줄거리가 두 가지로 읽히던 세 곳은 만든 사람이 판단을 넘겼다. "네 추정으로 더 반전에
재미있을 케이스로 선택해서 반영해줘." 트리거랩은 여섯 명과 에코가 되었고, 백아린의 사표는 끝내 수리되지
않다가 해고로 돌아오게 되었고, 평택의 건물은 22층이 되었다.

18시 26분에 그 수정이 운영에 올라간 것을 확인했다. 그날의 인수인계 파일에는 굵은 글씨로 한 줄이 있다.
"사람이 브라우저로 본 화면은 아직 없습니다."

10월 8일, 이 글을 쓰는 날. 아침의 지시는 여덟 항목이고, 다음에 할 일의 방향을 길게 붙여 넣은 뒤 맨
끝에서 이 글을 부탁한다. 오전에 죽은 함수를 지우고 검사 네 개가 더 많이 읽게 한 PR #45가 병합됐다.
전날 감사 범위 밖이던 사건 열여섯 개를 세 갈래로 읽은 보고서가 111줄의 발견을 냈고, 그것을 받아 고친
PR #47과 #46이 12시 8분과 14분에 병합됐다.

## 3. 만드는 방식

**지시는 작업 지시서였다.** 남은 지시 311건은 대화라기보다 주문에 가깝다. 번호를 매긴 목록이 많고, 같은
틀이 되풀이된다. "최종 형상 중심으로 불필요한 코드, 파일, 폴더 등 모두 삭제 정리해주고, readme.md 등
설명에도 내용 현행화 한 후 깃 푸시해줘"라는 항목은 스무 번 넘게 나온다. 새것을 더하는 지시의 끝에는 거의
언제나 지우고 문서를 맞추라는 말이 붙어 있었다는 뜻이다. 그 사이를 짧은 승인이 메운다. "ㅇㅇ"으로
시작하는 지시가 19건, "계속 진행해줘"가 11건이다.

**가장 자주 한 말은 묻는 말이었다.** "현재상황, 잔여작업, 잔여예상시간 알려줘." 이 문장과 그 변형이
48건으로, 여섯 건에 하나꼴이다. 일을 시작하기 전에 묻기도 했다. "다음과 같은 프롬프트로 작업 완료하는데
예상시간 알려줘. 그걸 보고 작업할지 판단할게."

**직접 해 보고, 본 대로 말했다.** 방향을 바꾼 지시는 대개 플레이한 사람의 말로 적혀 있다. 설명이 부족하다,
시간에 쫓긴다, 어디로 이동했는지 모르겠다. 기술 용어가 없고, 무엇이 불편했는지만 있다. 그 말을 원인으로
옮기는 일이 커밋 메시지에서 벌어진다.

**하루는 저녁 7시에 끝난다.** "저녁 7시면 보통 종료하기 때문에 작업시간 예상해서 시간내 가능한 작업부터
진행해줘"(10월 7일). 다음 계획도 하루 분량을 "저녁 7시 전에 운영 배포까지 끝낼 수 있는 범위"로 잘라
놓았다. 끝나지 않은 일은 `HANDOFF.md`에 적는다. 그 파일은 git에 올리지 않고, 끝낸 항목은 지운다.

**감사는 읽기 전용으로 먼저, 고치기는 그다음에.** 9월 27일, 28일, 10월 6일, 7일, 8일의 다섯 차례 모두
찾는 일과 고치는 일이 나뉘어 있다(저장소의 문서는 10월 6일과 7일의 것을 각각 첫 번째, 두 번째 감사라고
부른다. 이 글은 9월 27일부터 센다). 10월 7일부터는 그 사이에 사람의 선택이 들어갔고, 에이전트가 읽기만으로
찾은 것은 코드에 다시 대 본 뒤에야 목록에 올랐다.

**에이전트는 세 개씩, 각자 작업 트리에서.** 갈래 하나가 PR 하나가 되고, 갈래 하나에 25분에서 105분이
걸렸다고 인수인계 파일은 적는다. 10월 8일의 지시는 이 규칙에 괄호를 달았다. "에이전트는 세 개씩(넘기지
말 것)."

**병합이 곧 배포다.** `main`에 병합하면 검증이 초록일 때 바로 운영에 올라가고, 데이터베이스는 그보다
먼저 바뀐다. 그래서 "병합은 내가 말할 때만 해줘"가 규칙이다.

**약속 대신 관문, 래칫, 예산.** `npm run verify:static`은 지금 검사 스물다섯 개를 한꺼번에 돌린다.
9월 4일에는 열여섯, 9월 11일에는 열아홉이었다. 일본식 한자어를 쓰지 않는다는 약속은 `check:plain-language`가, 이야기의 날짜와
숫자가 서로 맞는다는 약속은 `check:canon`이, 새 글자가 글꼴에 들어 있다는 약속은 `check:fonts`가
지킨다. 고칠 수 없어 남긴 예외는 개수를 세어 상한으로 묶었다(풀이 없이 먼저 읽히는 용어 28쌍, 라벨과
시계가 어긋나는 카드 69장). 줄일 수는 있어도 늘릴 수는 없다. 파일 크기에도 같은 규칙이 걸려 있다.
README의 문장으로는 "예산은 내리기만 하고 올리지 않습니다."

**커밋 메시지는 고치기 전의 상태를 적는다.** README의 마지막 줄이 이 규칙을 말한다. "이 저장소의 커밋
메시지는 변경 내용이 아니라 그 변경을 하게 만든 상태를 적습니다." 그래서 변경 기록 파일을 지울 수
있었고, 이 글도 대부분 거기서 나왔다.

**사람만 할 수 있는 일은 사람이 했다.** Render 대시보드의 헤더 규칙, 저장소 시크릿, Supabase의 회원가입
끄기는 만든 사람이 손으로 했다. 그때의 지시는 매번 비슷하다. "방법 순서대로 쉽게 알려줘." 반대 방향의 말도
있다. "그냥 네가 다해줘."

## 4. 되풀이된 원칙

구호로 적힌 적은 없고, 기록에서 같은 모양으로 여러 번 나타난 것들이다.

**기준은 재미와 개연성이고, 지난 형상에는 미련을 두지 않는다.** "기준점은 오로지 재미. 이갸기의
개연성." "과거 형상은 중요하지 않아." 9월 14일에 9,377줄이 빠졌고, 9월 23일에는 이틀 전에 만든 장치가
통째로 나갔다. 역할 일곱 개의 자동 순환도, 변경 기록 폴더도, 한때의 작업지시서도 쓰이지 않게 되자
지워졌다.

**더한 만큼 정리한다.** 스무 번 넘게 반복된 정리 항목이 그 증거다. 감사 때마다 "nothing reads"라는
말이 커밋 제목에 나온다. `What nothing read after the audit is gone`.

**초록불을 믿지 않는다.** 배포되지 않는 자동 배포, 아무것도 가져오지 않는 배포 확인, 프롤로그 다섯 장을
건너뛰고 있던 쉬운 말 검사("Two checks were lying"), 있기만 하면 통과하던 보안 헤더 검사. 네 번 다
검사가 통과하고 있었고, 네 번 다 검사가 실제로 무엇을 읽는지를 고쳤다. 그 가운데 첫 번째는 만든 사람이
자기 손으로 매번 배포 버튼을 누르고 있었기 때문에 알아챘다.

**플레이어가 읽고 생각할 시간은 게임이 빼앗지 않는다.** 읽는 시간을 판단 시계에서 떼어 낸 것, 어려운
금융 용어를 처음 나오는 자리마다 괄호로 푸는 것, 보이지 않는 규칙으로 채점하던 글 상자를 없앤 것,
시계 배속과 번쩍임을 고르게 한 것이 같은 쪽을 향한다. 이 게임의 질문이 "얼마나 똑똑한가"가 아니라
"언제 똑똑해지는가"라면, 그 조건을 게임이 망가뜨려서는 안 된다는 판단으로 읽힌다.

**데이터는 동의한 만큼만, 이름 없이.** 첫 커밋 7분 뒤에 동의 장치가 있었다. 온라인 저장은 켠 사람만
쓰고, 랭킹의 다른 참가자는 모두 '익명 분석관'이다. README는 랭킹이 "플레이테스트 순위이지 부정행위 방지
장치가 아닙니다"라고 스스로 적는다.

**모르는 것은 모른다고 적는다.** `WIP: retire extensions.css (unverified in the browser)`라는 커밋이
있고, 세 시간 남짓 뒤에 `verified in the browser`가 붙은 커밋이 있다. 서비스 워커 설명에는 "확인하지 못한
것" 항목이 있다(iOS Safari). 감사 기록마다 "Looked at and left"라는 절이 있어, 보고도 고치지 않은 것과
그 이유가 남는다.

**정하는 것은 사람이다.** 10월 8일 아침에는 줄거리 사실과 개편 방향 일곱 가지에 대한 답을 한 번에
주었고, 계획 파일은 그것을 받은 대로 적어 두었다. 판단을 넘길 때도 넘긴다는 말을 남겼다.

## 5. 숫자로 본 여덟 주

2026년 10월 8일 낮, `main`이 `b9f24c7`일 때 직접 세거나 실행해서 얻은 값이다. README를 인용한 것은
그렇게 적었다.

| 무엇 | 값 | 어떻게 셌나 |
|---|---|---|
| 커밋 | 899 | `git rev-list --count b9f24c7` |
| 커밋이 있는 날 | 57일 중 33일 | `git log --date=format:%Y-%m-%d` |
| 작성자 | SUPASONIC 876, github-actions[bot] 19, dependabot[bot] 3, Codex 1 | `git log --format=%an` |
| 사건 | 6 → 55 | 첫 README, `src/nodes/`의 사건 파일 |
| 쓰인 장면과 카드 | 1,129개, 4,206장 | README "개발 메모" |
| 괄호로 풀어 주는 용어 | 189개 | README |
| 추적하는 파일 | 14 → 465 | 첫 커밋, `git ls-files` |
| `src`의 JS·JSX | 77,491줄 (그중 사건 파일 49,663줄) | `git ls-files`와 `wc -l` |
| 정적 검사 | 16 → 19 → 25 → 26 | 9월 4일·11일 커밋 메시지, `npm run verify:static` |
| 단위 테스트 | 767개 통과 | `npm test` |
| 브라우저 테스트 | 스펙 파일 18개, `test(` 165개 | `tests/*.spec.js` |
| 워크플로 | 5 | `.github/workflows/` |
| 데이터베이스 마이그레이션 | 38 | `supabase/migrations/` |
| 유지 규칙 | 89 | `docs/work-status.md`의 번호 매긴 항목 |
| PR | 46 (병합 44, 열림 2) | `gh pr list --state all` |
| 남아 있는 작업 지시 | 46개 세션, 311건 | 9월 8일~10월 8일 |

주별 커밋 수(ISO 주 기준).

| 주 | 기간 | 커밋 | 그 주의 일 |
|---|---|---|---|
| W33 | 8월 13~15일 | 134 | 프로토타입 |
| W34 | 8월 20~21일 | 2 | 첫 워크플로와 브라우저 테스트 |
| W35 | 8월 27~29일 | 32 | 작업지시서, 깨진 화면 복구 |
| W36 | 8월 31일~9월 4일 | 96 | 유지 규칙, 마이그레이션, 디자인 감사 |
| W37 | 9월 7~11일 | 112 | 에이전트 순환, 정체, 코어 루프 교체 시작 |
| W38 | 9월 14~18일 | 63 | 건틀릿 테이블, 한 대출의 사슬, 사건 10 |
| W39 | 9월 21~27일 | 65 | 사건 11~49와 프롤로그, 첫 전체 감사 |
| W40 | 9월 28일~10월 4일 | 132 | 두 번째 감사, PR로 전환 |
| W41 | 10월 5~8일 | 263 | 세 번째·네 번째·다섯 번째 감사 |

사건이 6개에서 55개가 된 것은 9월 16일부터 23일까지 여드레 사이의 일이고, 그 여드레가 걸친 두 주의
커밋은 63개와 65개로 앞뒤 주의 절반쯤이다. 커밋이 가장 많은 주는 사건이 하나도 늘지 않은 마지막 주다.

## 6. 남은 것과 다음

알고도 남겨 둔 것이 있다. `docs/work-status.md`의 "Still open, on purpose"와 "Looked at and left"가
그 목록이다(감사 기록 원문은 이 글 끝의 부록에 있다). 몇 가지만 옮긴다.

- 10월 7일 저녁의 인수인계 파일 기준으로, 그날 운영에 올라간 변경을 사람이 브라우저로 본 적이 없다.
  열 배쯤 커진 효과음, 번쩍임 줄이기가 닿는 범위, 옆으로 누인 휴대폰의 배치가 확인을 기다린다.
- 서비스 워커는 iOS Safari와 홈 화면에 설치한 사본에서 돌려 보지 못했다.
- 프롤로그는 2022~23년이고 사건 01은 2025년인데 시즌은 내내 "3년 전"이라고 말한다. 알고 그대로 두었다.
- 한 번의 플레이가 지나는 장면은 약 576개다. README는 "이 길이는 코드 문제가 아니라 집필 판단입니다"라고
  적는다.
- 숨은 경로의 시계는 사건의 이른 시각에 고정돼 있어, 늦게 들어가면 시간이 거꾸로 간다. 관례로 두었다.
- 같은 파일의 "남은 코드"와 "남은 본문" 목록. 예산에 자리가 없어 못 넣은 CSS, 브라우저가 있어야 쓸 수
  있는 테스트, 말투의 시즌 전체 정리가 적혀 있었다. 10월 8일의 PR들이 그 가운데 얼마를 닫았는지는 이
  글에서 대조하지 않았다.

다음 방향은 10월 8일 아침의 지시에 있다. 만든 사람은 출처를 밝히지 않은 긴 비평문을 붙여 넣고, 꼼꼼히
분석해 다음 계획으로 잡으라고 했다. 비평의 요지는 판의 규칙이 너무 많고 촘촘해서 이야기를 읽으러 온
사람이 초반에 지친다는 것, 그리고 박자를 맞추는 조작이 생각을 재겠다는 목적과 어긋난다는 것이다. 계획
파일은 제안을 지금 코드에 하나씩 대 본 뒤 순서를 정했다.

1. 소리를 끈 사람도 볼 수 있는 심박 계기, 휴대폰에서 글과 그림의 자리 조정.
2. 프롤로그 다섯 장에 걸쳐 판의 규칙을 하나씩 여는 단계별 해금.
3. 벽을 멀리 두고 다음 판 규칙을 끄는 스토리 모드(공개 랭킹에는 올리지 않는다).
4. 판단 DNA와 결말을 그림 한 장으로 내보내는 결과 카드.
5. 박자의 제거. 타이밍 대신, 압박 속에서 생각의 방식을 유지하거나 필요할 때 바꾸는 것이 판돈의 상한을
   올리는 '논리 콤보'로 바꾼다. 박자는 20개 파일 258곳에 걸쳐 있어 사흘로 나누었고, 규칙이 바뀌므로
   랭킹은 다시 비운다.
6. 사건 23의 주주총회를 위임장 대결에서 자본의 명분 싸움으로 다시 쓰기, 선택이 사람을 내보낸 사건의
   막간 고쳐 쓰기.
7. 글꼴 범위 다시 재기, 사건 파일에서 본문을 떼어 내기.

9월 15일에 "brain and luck and no body"라며 들여온 박자가, 3주 뒤에 생각을 재는 데 방해가 된다는
이유로 나갈 차례가 된 셈이다. 기준은 9월 16일의 그 한 줄에서 달라지지 않았다.

**덧붙임, 2026년 10월 11일.** 이 계획은 10월 8일 밤부터 11일 저녁까지 PR #56~#92로 닫혔다. 여기부터는
병합 기록과 지금의 README에서 옮긴 것이고, 위 본문은 10월 8일에 쓴 그대로다.

- 1은 10월 8일 밤과 9일(#57~#61), 2는 9일(#62~#64), 4는 9일(#66, #70), 3은 10일(#74, #77, #79)에
  배포됐다.
- 5는 10일 밤 논리 콤보가 박자의 자리에 들어가고(#81) 11일 오전 박자의 남은 코드가 지워졌다(#83). 같은 날
  로컬 랭킹(#83)과 공개 랭킹(#88)을 비웠고, 논리 콤보 이전에 마친 사건이 있는 시즌은 온라인 랭킹에 보내지 않는다
  (#89). 계획에 없던 것 하나가 여기서 더해졌다. 결말 화면의 논리 유지력 리포트와 결과 카드의 점수 한
  줄이다(#84~#87).
- 6은 9일에 사건 23(#67)과 사건 16·18·06의 막간(#68), 10일에 사건 40의 막간(#75)이 들어갔다. 같은 날 마지막
  사건의 네 경로가 모두 33층을 지나게 됐다(#72, #78).
- 7은 둘 다 재 보고 하지 않았다. 완성형 2,350자를 통째로 담으면 글꼴이 461,852바이트로 예산(283,500)을
  넘고, 본문을 JSON으로 옮겨 아낄 수 있는 검사 시간은 검사 하나에 많아야 0.15초쯤이었다. 그 대신 느리던
  `check:canon`을 파일당 한 번만 읽게 고쳤다(#71). 수치는 README의 「검증」과 「생성물」에 있다.

박자는 9월 15일에 들어와 10월 11일에 나갔다. 그날 저녁의 인수인계 파일 기준으로 열린 PR과 이슈는 없고,
남은 것은 사람이 브라우저로 볼 목록이다. 10월 9~11일에 바뀐 화면도 사람이 운영에서 직접 본 적은 아직 없다.

**덧붙임, 2026년 10월 15일.** 10월 12일부터 16일까지의 일이다. 병합 기록과 커밋 메시지, 그날그날의 인수인계
파일(git에 올리지 않는다)에서 옮겼다. 위 본문과 10월 11일의 덧붙임은 그대로 두었다.

- 10월 12일 낮에는 사람이 볼 목록을 기계가 먼저 줄였다(저장을 심어 찍은 화면과 WebKit 폰 화면). 같은 날 폰 화면
  네 곳(PR 제목 그대로 "효과음과 캡션, 다음 판 줄, 음악 버튼, 짧은 폰의 브리핑")이 고쳐졌고(#99),
  결말 검사가 런타임에 없는 값(`finalRiskDelta`)을 읽고 있던 것도 고쳐졌다(#93). README에 개발 노트가 생겼다(#98).
- 같은 날 저녁, 남은 일을 하루 단위로 나눈 계획을 세웠다. 규칙을 바꾸고 랭킹을 한 번 더 비우는 10일차까지다.
  하루의 크기는 "에이전트 여럿, PR 15~25개, 저녁 7시 전 운영 배포"로 적혔다. 9월 28일부터 세 개였던 에이전트
  상한은 이때 없어졌고, 인수인계 파일의 규칙은 "성능과 네트워크가 허락하는 만큼"이 되었다. 브라우저 테스트는
  여전히 한 번에 하나다.
- 10월 13일에는 PR 27개가 병합됐다(의존성 올리기 둘 포함, #96·#97·#101~#125). 커밋 메시지들이 적은 상태는
  대개 "틀렸는데 빨간 것이 없었다"였다. 바닥값을 올린 그 시각에 README의 커버리지 숫자가 낡았고, 결말 검사와
  e2e 도우미가 런타임에서 복사해 둔 규칙 하나가 이미 어긋나 있었고, 서비스 워커 릴리스 이름에 커밋이 들어 있어
  문서만 바꾼 병합에도 모든 기기가 받아 둔 것을 버렸다. 그래서 문서가 인용하는 숫자를 코드에서 계산하는
  `check:doc-numbers`가 생겨 26번째 정적 검사가 되었고(#104, #111), 복사된 규칙 셋은 한 모듈로 모였고(#103),
  릴리스는 내보내는 파일로 이름 붙게 되었다(#124). 화면 쪽에서는 처음 10분의 안내가 이제 없는 단계와 어느 화면에도
  없는 버튼을 설명하던 것(#117), 붉은 경보가 보상에도 벌만큼 크게 울리던 것(#114), 붕괴 결말이 규칙이 읽지 않는
  시간과 믿음을 탓하던 것(#118)이 고쳐졌다. 만든 사람이 읽을 시간을 넉넉히 달라고 해서 읽기 시계는 초당 16자·상한
  50초에서 10자·95초가 되었고(#123), 그 때문에 시간이 빠듯해진 새로고침 테스트는 120초를 받았다(#125).
- 화면을 바꾸는 갈래는 이날부터 로컬 통합 브랜치 하나에 모아 브라우저 테스트를 한 번 돌리고, PR은 갈래마다 따로
  냈다. 그날 몫이 일찍 끝나면 다음 날 할 일을 작업 트리에 수정만 해 두는 "미리 하기"도 이 무렵의 사용자 지시다.
  커밋·푸시·검증은 다음 날 한다.
- 10월 14일 아침, 전날 번호를 매겨 물은 선택 118가지에 만든 사람은 모두 1번(추천안)으로 답했다. 이날 PR 14개가
  병합됐다(#126~#139). STRIKE와 LOCK 문장이 상한(×1.5)을 사실대로 말하게 되었고(#132), 결과 화면의 같은 동작은
  한 이름(`이 사건 다시 도전`, `초기화`)을 갖게 되었고(#135), 배율은 어디서나 `×`로 적히고(#137), 원고의 옛말
  넷(공책·인부·하달·동일한)이 오늘 쓰는 말로 바뀌었다(#139). 통합 브랜치에서 359개를 돌린 브라우저 테스트 가운데
  새 테스트를 세 번씩 반복한 42번 중 한 번이 떨어졌고, 그것이 오프라인이 되는 순간 온라인 저장이 올리기를 보내던
  실제 버그(main에도 있던 것)였다(#134). 런타임 청크는 예산을 올리지 않고 시즌 사이 문구를 별도 조각으로 떼어
  자리를 만들었고(#128), 스타일시트를 하나도 열지 않고 통과하던 `format:check`가 시트를 읽게 되었고(#130), 카드
  라벨의 길이를 재는 `check:card-labels`가 27번째 정적 검사가 되었다(#129).
- 그날 저녁의 인수인계 파일 기준으로 브라우저 검증을 기다리는 커밋된 갈래가 16개, 커밋하지 않은 미리 하기가
  23개 있다.
- 10월 15일에는 PR 8개가 병합되어 운영에 배포됐다(#140~#147, 운영은 `1904bf1`). README가 접히는 네 절로 나뉘었고
  (#140), 시뮬레이션 플레이어가 `scripts/sim/season-bot.mjs`로 모였고(#141), 새 사건 파일을 쓰는 안내
  `docs/writing-a-case.md`가 생겼고(#142), `report:endings`가 끝에 결말 퍼널을 찍게 되었다(#143). 화면 쪽에서는
  브라우저의 `confirm()` 창이 게임 안 대화상자가 되어 묻는 동안 판의 시계가 멈추고(#144), 건너뛴 장면이 공개 아래와
  보고서에 접힌 분 단위로 남고(#146), 프롤로그 뒤의 결정 공개가 짧은 형태로 열리고 전체는 `자세히` 뒤로
  갔다(#147). 테스트에는 `@once` 태그가 생겨 mobile 프로젝트가 화면 크기와 무관한 테스트 32개를 건너뛴다(#145).
- 화면 갈래 15개는 로컬 통합 브랜치 하나에 모아 chromium과 mobile-chromium으로 함께 돌렸다. 폰 테스트 196개 중
  186개가 통과하고 9개를 건너뛰었다. 실행은 한 번 메모리가 모자라 죽었고, 워커 하나로 이어서 돌렸다.
  layout-sweep은 테스트 하나에 8분쯤 걸려 일부만 돌았다. 실제 실패 둘은 모두 낡은 테스트 기대였고 각 갈래에서
  고쳤다. 짧은 공개의 맨 앞에 `자세히`가 오게 되어 장면 분 단위의 키보드 단계는 Shift+Tab으로 거꾸로 걷게
  되었고, 360x740 브리핑 측정은 small-phone-fit이 바닥 줄을 `display: contents`로 만들 때 `판 열기`를 바닥
  도크로 읽게 되었다.
- 개선 포인트 갈래 12개는 두 번째 통합 브랜치에 모아 두었고 브라우저 검증을 기다린다. 10일차(균열 10→8 등)의
  설계와 측정도 준비해 두었지만 병합하지 않았다.
- 10월 16일에는 PR 20개가 병합됐다(#148~#165, #167, #168, 운영은 `a6bd03f`). 화면 쪽에서는 접힌 사건 파일이 여섯 숫자의
  줄로 열리고(#149), 시즌 결과가 붕괴선과의 거리를 표시하고 붕괴하면 피해가 큰 사건 셋을 다시 도전하게 되었고(#151),
  판 머리줄에서 편의 설정이 열리고(#152), 카드에 콤보 기호가, 게이지에 30·60 눈금이 생겼고(#153), 스토리의 약속이
  게임이 실제로 하는 일대로 고쳐졌고(#154), 인트로가 "사건 하나 약 10분"이라고 말하게 되었다(#155). 짧은 폰에서
  다섯 장이 잘리지 않게 되었고(#156), 카드 라벨 139개가 줄었고(두 커밋에 걸쳐 141번)(#157), 화면 자투리 넷이 고쳐졌고(#158), 게임 용어는
  하나에 이름 하나가 되었다(#160). 만드는 쪽에서는 결과 화면 조각을 미리 받고(#150), `npm audit`이 0이 되고(#159),
  결과 뷰의 조립이 뷰 모델로 옮겨지고(#161), season-flow 스펙이 셋으로 나뉘었다(#162).
- 이슈 #100의 원인이던 짧은 폰의 잘림은 small-phone-fit(#156)과 five-card-labels(#157)로 고쳐졌고, Full Coverage를
  손으로 한 번 돌려 초록이었다. 기준 화면을 움직인 PR은 예상한 셋보다 많은 일곱(#151 #152 #153 #154 #155 #158
  #160)이어서, 만든 사람이 `!` 한 줄로 다시 찍기를 일곱 번 했다.
- #153은 #152 뒤에 올라가자 GauntletStage의 가져오기가 69개가 되어 예산 68을 넘었고 PR 검사에 떨어졌다. 예산은
  올리지 않고, 자물쇠의 봉인 판정을 엔진으로 옮기고 게이지 눈금을 한 이름(`GAUGE_MARKS`)으로 묶어 68로 맞췄다.
- 두 번째 통합 브랜치(개선 포인트 12갈래)는 두 프로젝트로 돌려 아홉 스펙에서 실패가 0이었다. runtime-long-lines의
  한 실행에서는 메모리 여유가 1.4GB로 떨어진 동안 시간 초과가 셋 났고, 그 스펙만 혼자 다시 돌려 통과했다.
- 오후 다섯 시 뒤에는 다음 날 몫의 앞쪽 다섯을 당겨 병합했다. 프롤로그 02의 문하준이 중학생이 되었고(#163), 확정한 판과
  BUST가 벽에서 얼마나 떨어져 있었는지 재는 로컬 보고서가 생겼고(#164), 이어하기 카드에 기록 칭호가 붙었고(#165),
  등장인물 초상 11장이 더해져 16명이 되었고(#167), 리포트의 평균 시간 칸이 사건 안에서 고르는 속도의 변화를 한 줄로
  말하게 되었다(#168).
- 저녁 7시 전에 다음 날 몫을 커밋 없이 미리 했다. 10일차 규칙 갈래 다섯을 한 작업 트리에 합쳤고(콤보 상한 ×1.6과
  LOCK ×1.5, 도구 다섯 칸 교체, 조회), 주간 규칙에 고정 시계를 두었다.

**덧붙임, 2026년 10월 19일.** 10월 17·18일에는 작업이 없었다. 19일 하루의 일이다.

- 10월 19일에는 PR 24개가 병합됐다(#166, #169~#176, #178~#182, #185~#189, #191~#195, 운영은 `8531b88`). 플레이어가 보는 쪽에서는 판이 벽에 가까울수록
  게이지 빛·판 떨림·심박 음높이가 한 단계씩 오르고(#185), BUST 글자와 붕괴 결말의 머리줄이 0.9초 갈라졌다 자리를 잡고(#186),
  사건의 마지막 결정 173곳은 0.8초 꾹 눌러야 확정되고 짧게 누르면 「한 번 더」가 된다(#192). 첫 밀기 뒤에는 시계가 열기를
  얼마나 올리는지(#172), LOCK이 상한에 닿았는지(#174), 이미 벽 구간 안인지(#193)를 판이 말한다. 결과 카드에는 판단 습관의
  이름(#171)이, 붕괴 결말에는 가장 큰 피해가 사람의 말로(#169) 나온다. 화면 낭독기는 판을 한 목소리로 듣는다(#179).
- 처음으로 main이 빨개졌다. 각자 예산 안이던 #179와 #172가 합쳐지자 플레이 화면 번들이 104,323바이트로 예산 104,200을 넘었다.
  운영은 그 앞 커밋에 머물렀고, 효과음 모듈을 형제 청크로 떼어(#191) 6,425바이트를 덜어 한 시간 안에 초록으로 돌아왔다.
  그 뒤로는 병합 전에 합친 상태에서 빌드와 `check:bundle`까지 본다.
- CSS 갈래 다섯은 옛 기반 위에서 만들어져, 쌓아 보니 play.css가 예산을 425바이트 넘었다. 만든 사람이 정한 원칙은 "줄이고
  떼어 낸 뒤, 모자라는 만큼만 그 갈래가 실측값으로"였다. 계산된 스타일이 한 값도 바뀌지 않는 규칙 합치기로 487바이트를 먼저
  덜었고(#180), 다섯 갈래는 예산을 올리지 않고 들어갔다. 새로 뗀 효과음 청크만 심박 코드 몇 줄과 해시 이름 흔들림만큼 숫자를 옮겼다.
- 기준 화면 다시 찍기와 Migration Drift를 처음으로 만든 사람 대신 돌렸다(10월 8일에는 막혀 있었다). 서버 쪽 검증 함수를
  작은 부분으로 나누는 마이그레이션(#182)은 하루 끝에 혼자 들어갔고 Drift가 초록이었다. Playwright는 1.64.1이 되었고(#181),
  axe 4.14가 새로 잡은 "보이는 글과 이름이 다른 컨트롤" 다섯이 고쳐졌다(#195).
- 병합하지 않고 draft로 둔 것: 10일차 규칙 한 PR(#190, 예산 셋을 숫자 그대로 맞춤), 랭킹 의심 표시(#183), 장면별 익명 BUST 비율의
  서버와 클라이언트(#197 #198), 주간 규칙(#199), 붕괴 결말의 "거둬진 호의" 문장(#196, 사람이 읽고 정함).

**덧붙임, 2026년 10월 20일.**

- 10월 20일에는 PR 13개가 병합됐다(#183, #190, #196~#199, #202~#206, #209, 운영은 `43e7ed1`). 플레이어가 보는 쪽에서는 10일차 표가
  들어왔다(#190). 한 자원을 8 태우면 다음 판이 갈라지고(10에서), 논리 콤보는 콤보 10에서 ×1.6까지, LOCK은 그 안에서 ×1.5까지
  판돈을 올린다. 도구는 다섯 칸이고 다 차면 하나를 내려놓고 바꾼다. 프롤로그 03부터는 판마다 한 번 R로 시계 3초를 내고 벽 구간을
  20칸 폭으로 좁혀 본다(조회). HUMAN RECORD 결말은 모든 사건의 기록을 요구하고, 저장 형식은 3이 되었다. 인트로 제목 아래에는
  영어 부제 *When does my creativity burst?*가 붙었다(#203).
- 읽는 쪽도 바뀌었다. 장면 본문은 렌더링할 때 작은따옴표 대사를 굵게 제 색으로, 숫자와 단위를 굵게 강조 색으로, 단어 바로 뒤
  괄호의 쉬운 말 풀이를 점선 밑줄과 기울임으로 보여 주고, 본문 글자를 키웠다(#205). 카드와 본문의 글자는 한 자도 바뀌지 않았다.
  강조를 나누는 구분자로 처음 고른 U+2029는 글꼴에 없는 글자라 `check:fonts`가 잡았고, U+001F로 바꿨다. 이야기 속 분은 숫자로,
  지난 나이는 「~ 살이었어」로(#202), 열 이상의 수는 숫자로 쓴다(#209, 917곳: 「회의는 안건 11개를 47분 만에 끝냅니다」, 붕괴
  결말의 「49개 사건」). 붕괴 결말은 회사가 버틸 때 사람들 몫이던 야간 수당과 가족 학자금 지원이 먼저 거둬졌다고 말한다(#196,
  사건 파일에 있는 것만). 다섯 화자에게 얼굴이 생겨 초상은 스물한 명이 되었다(#206). 나은호와 권도현은 무료 스톡 사진이고,
  악역인 백아린·윤상혁과 미성년인 문하준은 실제 사람을 쓰지 않으려고 실존하지 않는 사람의 AI 생성 사진을 썼다.
- 마이그레이션 셋이 하루에 들어갔다. 병합하면 1분 안에 운영 DB에 적용되므로 셋 모두 날짜를 main의 마지막 마이그레이션 뒤로
  다시 매기고(`20261020000000`, `20261020010000`, `20261020020000`) 정한 순서로 하나씩 넣었다. 랭킹 기록은 점수 때문에 거절되지
  않고 맞지 않는 조건이 `suspicion` 열에 표시만 된다(#183). 그 직후 10일차의 비우기 v9가 시즌 랭킹을 비웠고(#190), 표시는 비운
  뒤의 첫 기록부터 붙는다. 장면별 익명 BUST 비율은 서버(#197, 창 50개·판 50개 이상인 장면만 답함)를 먼저 넣고, 그 뒤에
  장면 페이지의 한 줄(#198)을 넣었다. 그 한 줄은 플레이 화면 번들에 넣지 않고 형제 청크 `sceneTraces`로 뗐다.
- main이 다시 빨개졌다. 부제가 `.intro-hero-copy > p`라서, 태블릿에서 사진 위 글줄을 둘로 세던 대비 검사가 셋을 셌다(대비 자체는
  세 줄 모두 통과). e2e는 PR에서 돌지 않아 #203에서 잡히지 않았다. #204가 개수를 셋으로 고쳤고, 그 뒤로 화면을 바꾸는 PR은
  `e2e` 라벨을 달아 PR에서도 e2e 층을 돈다.
- axe 4.14의 label-in-name 규칙(#195)이 10일차의 조회 버튼을 잡았다. 버튼에 보이는 벽 구간이 이름에 없었고, 이름은 이제
  「벽 56–92 · 조회, 시간 3초」처럼 보이는 것부터 말한다.
- 만든 사람이 규칙 둘을 바꿨다. 하나는 메모리다. 돌고 있는 일은 메모리 때문에 끊지 않는다. 남은 메모리가 2GB 이상이면 에이전트를
  더하고, 1~2GB면 node만 쓰는 일을, 1GB 아래면 새 브라우저나 빌드를 띄우지 않고, 500MB 아래면 아무것도 새로 시작하지 않는다.
  다른 하나는 미리 한 일이다. 검사가 통과하면 병합해 배포까지 하고, 랭킹을 비우는 변경과 아직 정하지 않은 것만 묻는다.
- 하루 끝 정리에서 자기 파일 안에서만 쓰이던 이름 일곱의 `export`를 뗐다.
- 주간 규칙(#199)은 17시 31분에 병합됐다(마이그레이션 `20261021000000`, 랭킹 표에 `week` 칸, 평소 판과 이벤트 주 판을 따로 셈; 운영 curl로 두 판과 쓰기 거절 확인).
- 병합하지 않고 둔 것: 장치형 주간 규칙의 감사 위험(#201, draft, 정할 것은 정해 둠),
  보이는 연쇄 위험의 시뮬레이션 측정(#208, draft, 결정 셋과 본 규칙 9문항을 10월 20일에 정함). 둘은 사용자가 직접 플레이한 뒤 한 PR(`RULES_MARK` 3, 랭킹 한 번 비움)로 들어간다.
  (10월 21일에 바뀌었다. 아래 덧붙임.)

**덧붙임, 2026년 10월 21일.**

- 낮까지 PR 4개가 병합됐다(#212~#215, 운영은 `8a535e2`). #212는 10월 20일 검토에서 고른 문구 일곱 항목이다(사건 23의 말한 사람,
  「밤을 새우고도」, 「반대 의견서를 쓴 밤」, 「STEADY는 식힘(PUSH 뒤에만)」, 이번 주 규칙의 NEAR WALL 문구, 장면 표시의 단위 줄·페이지·통).
- 초상이 없던 66명이 모두 얼굴을 얻어 장면에서 말하는 87명 전부가 초상을 가진다(#213 스물두 명, #214 스무 명, #215 스물네 명).
  55명은 무료 스톡 사진을 같은 톤으로 보정했고, 악역과 미성년 11명은 실존하지 않는 사람의 생성 사진이다. 생성 사진 몫으로 처음
  분류한 다섯(연태준, 배승호, 은시온, 여민규, 배성준)은 장면을 읽어 보니 악역이 아니라 타협한 사람이라 사진으로 바꿨고, 눈을
  내리깔거나 고개를 숙여 얼굴이 보이지 않던 사진(하도율, 진서우)은 카메라를 보는 사진으로 바꿨다.
- 만든 사람이 초상의 규칙 둘을 정했다. 실루엣으로 남기는 인물은 없다(새 인물에게도 초상을 준다). 악역도 일부러 악해 보이게 고르지
  않고 평범한 얼굴을 쓴다. 평범하게 생긴 사람이 저지르는 잘못이 더 현실적이고 무서우며, 어둡게 연출된 얼굴은 보정으로 되돌리기 어렵다.
- 보이는 연쇄 위험(#208)을 결정 셋대로 다시 쟀다. 사건이 닫힐 때 남은 연결을 다음 사건 첫 판들로 넘기자 풀림은 68%에서 2.5%로
  사라졌지만 붕괴가 23.0%, 조회 손실이 29.8%로 기준을 넘었다. 넘기는 연결의 상한 `LINK_CARRY_MAX`를 3에서 1로 낮추자 붕괴 21.0%,
  조회 손실 24.2%로 모든 기준을 맞췄다. 칩을 읽는 봇 손의 마진은 5·10·15 가운데 10이 원형 일곱 가운데 넷으로 가장 나아
  `CHIP_MARGIN` 10으로 두었다(기준 다섯에는 못 미침, 사용자 플레이로 본다).
- NEW GAME+ 이어받기 설계를 main에 다시 대조했고, 새 질문 셋에 모두 (1)로 답했다. 장면 BUST 비율에서 NEW GAME+ 판은 서버가 사건
  요약의 `newGamePlus`와 `case_id`로 행마다 거르고, 그 줄은 rules-mark-3 마이그레이션의 `refresh_scene_bust_stats` 다시 정의로
  넣으며, NEW GAME+ 갈래는 rules-mark-3 병합 다음 날 만들어 W46(11월 9일) 전에 병합한다.
- 서버 검증 2단계(F1)의 여덟 문항에도 모두 (1)로 답했다. 첫 조각은 draft #216이다. 결정 기록으로 점수를 다시 계산하는 읽기 전용
  스크립트(`npm run verify:ranking`)가 지금 들어가고, 맞지 않는 행은 기존 `suspicion` 열에 `score-off-log`·`window-off-replay`로
  표시만 한다(service_role 전용 함수, 아직 초안). 판 규칙이 다른 행은 "검증 안 함"이다. 창마다의 다시 하기 기록은 rules-mark-3 뒤
  별도 PR로 W46 전에 넣는다.
- 방향을 바꿨다. 10월 19일에 정한 「시험 주 없음」을 바꿔, 감사 위험(#201)과 연쇄 위험(#208)을 합친 PR이 2026-W44(10월 26일~
  11월 1일)를 감사·연쇄 시험 주로 운영에서 연다. 랭킹은 비우지 않는다. 만든 사람의 이유는 따로 시험하는 것보다 운영에서 모인 실제
  플레이 흔적을 보는 편이 낫다는 것이다. 그 PR은 준비 중이고, `RULES_MARK` 3과 랭킹 비우기는 W44의 데이터를 본 뒤 다음 PR에서 정한다.

## 7. 자료와 한계

**본 것**

- 커밋 899개의 날짜, 작성자, 제목 전부와 본문 일부(`git log`, `git show --stat`).
- 만든 사람의 작업 지시 311건(Claude Code 세션 46개, 2026-09-08~10-08). 한 건당 6,000자에서 잘린
  추출본이다. 여기에는 역할 에이전트에게 넘어간 지침, 터미널 입력, 연결 확인용 한 글자짜리도 섞여 있다.
- 첫 커밋에 들어 있던 2026-08-07자 문서 세 개(대화록, 후속 대화, 기획 초안 v0.1). 지금 작업 트리에는
  없고 git 이력에서 읽었다.
- `README.md`, `docs/work-status.md`, `docs/canon.md`, `scripts/`, `.github/workflows/`, `package.json`.
- git에 올리지 않는 인수인계 파일과 계획 파일, 감사 보고서 네 개의 머리말, PR #13·#37·#43의 설명,
  PR과 이슈 목록, 작업 메모 다섯 개.

**없는 것**

- 8월 13일부터 9월 7일까지의 작업 지시. 첫 네 주는 커밋만 남아 있다. 그 기간에 어떤 도구에 무엇을
  시켰는지는 9월 4일 커밋이 `작업지시서.md`를 "Codex work order"라고 부른 것, 8월 29일부터 Claude가 공동
  작성자로 적힌 것 말고는 알 수 없다.
- 8월 16~19일, 8월 22~26일, 9월 30일~10월 3일에 있었던 일. 커밋도 지시도 없다.
- AI 쪽의 답변. 추출본에는 만든 사람의 말만 있다. 무엇을 보고받았는지는 다음 지시에 인용된 조각과 커밋
  메시지로만 알 수 있다.
- 플레이테스트 참가자의 반응. 텔레메트리와 게시판의 내용은 보지 않았고 여기 옮기지도 않았다.
- 만든 사람이 화면을 보며 실제로 느낀 것. 지시문에 적힌 말 이상은 쓰지 않았다.

**추정한 것**

- 지시와 커밋의 연결. "지시 몇 분 뒤 이 커밋"이라고 쓴 곳은 시각의 순서와 내용의 일치로 이었다. 지시의
  시각은 UTC 기록을 한국 시간으로 옮겼다.
- `[Breaking Change: Core Loop Overhaul]`이 붙은 첫 커밋(9월 10일 16:37)은 그 문구가 든 지시가 기록에
  처음 나오는 시각(17:02)보다 25분 이르다. 같은 지시가 기록에 남지 않은 곳에서 먼저 쓰였을 것으로 보이나
  확인하지 못했다.
- 일본식 한자어를 쓰지 않는다는 규칙은 9월 16일 커밋에서 처음 보인다. 만든 사람의 지시에는 9월 18일에
  "이전에 수정했던" 일로 나온다. 처음 요청한 말은 추출본에서 찾지 못했다.
- "원칙"이라고 적은 것들은 기록에서 반복된 모양을 묶은 것이다. 만든 사람이 그렇게 이름 붙인 적은 없다.
- 4절에서 플레이어의 시간에 관한 원칙을 게임의 질문과 이은 문장은 이 글의 해석이다.

숫자는 `b9f24c7` 기준이다. 이 글을 쓰는 동안에도 `main`은 두 번 움직였고, 병합될 때쯤에는 커밋과
PR의 수가 다시 달라져 있을 것이다.

## 부록: 감사 기록 원문 (docs/work-status.md에서 옮김)

2026-10-12에 `docs/work-status.md`에서 옮긴 글이다. 그 파일에는 지금 참인 것만 두기로 했고, 날짜가 붙은
보고 세 절과 머리말의 변경 내역, 기준선 기록 항목은 여기로 왔다. 영어 원문 그대로이고 제목의 단계만 한
칸 내렸다. 글 속의 "the priorities above", "at the end", "the last section"은 옮기기 전
`docs/work-status.md` 안에서의 자리를 가리킨다. 남겨 둔 것의 현재 목록은 그 파일의 "Looked at and left"
절에 있다.

### Audit of 2026-10-06

Four readers went through the repository as it stood at `c68967d` -- the
table's logic and state, the screens and stylesheets, the tooling and backend,
and the case text -- and what they found was fixed in one pass. The rules
that came out of it are in the priorities above; this is the record of what
was done and what was looked at and left.

Fixed, by area:

- **Logic and state.** A first start waits for one case (88). A restore waits
  for the season (36). Case and season rows are queued before they are sent
  (61). A case records the card it followed (12). A chunk that fails with no
  connection asks again instead of reloading (86). Withdrawn consent stays
  withdrawn (61). Starting over asks first (36). A second tab is not a second
  device (59). A console line no longer rewrites the save (57). Practice does
  not lean the season in, and a window keeps its own clock record (39, 87).
  Slots are taken at places worth returning to (36). A missing key is not a
  repair, and scalars are held to their type (85). Five dead save fields and
  the copy that promised what they did not do are gone (43). The run has one
  definition (1), and `GameRuntime.jsx` went from 1,247 lines and 120 imported
  names to 964 and 104.
- **Screens.** The header no longer reserves dead room (27). Focus follows the
  page, and messages are announced (4). Type is in rem; field borders hold
  3:1; text fields are 16px (6). Shortcut hints follow the setting (83). A
  phone on its side has a table (27). Wide screens take the art at their own
  width (15). The cloud panel's successes are not alerts. `ScenePlate.jsx` is
  one file a room, proved byte-identical over all 1,129 scenes. `시즌 처음부터
  다시` is told apart from the two per-case retries.
- **A service worker** (89).
- **Tooling and backend.** Every spec runs in some tier, and `check:specs`
  fails on one that does not; two files, fourteen tests, had run nowhere.
  WebKit gets a pass for `@layout` (17). A hand-run deploy passes the gate, and
  there is a rollback path (66). The scheduled runs report what happened (82).
  Visual regression compares on the pull requests that can change a picture
  (19). One address cannot spend everyone's telemetry day, and the ceiling on
  new cloud codes is 1,000 (80). `check:grants` holds definer functions to a
  pinned `search_path` and views to `security_invoker`. `check:deploy` asks
  which backend the release was built for and whether the worker is this
  release's. `raise:gains` lists unless told to write (13). Migration Drift.
- **Case text.** Twenty-five numbered findings: closings and evidence scenes
  that were false on a route that skipped the middle (사건 01, 04, 08, 12, 23,
  33, 38, 45, the finale), dates that disagreed with the calendar (사건 23's
  "3주", 사건 33's 6월 30일), thirteen cards whose numbers contradicted their
  labels (a card that waits no longer buys time). Seventy-two first mentions
  in 35 files now introduce the person or thing a skipped scene had set up.
  Ninety generated cards name their way of thinking (12). 사건 01-07 and the
  finale were written at the season's length and then read in story order,
  which changed 85 more places: 임경수 has kept the paper three years, not
  four; 오진우's "30년" lost its number; the finale opens at eleven at night;
  사건 01 names the CFO, 배성준, once.

Looked at and left, on purpose or for the owner:

- 사건 07's evidence scene (`src/nodes/case07.js`, the `c7_evidence_turn`
  body and memo) now dates the posting order to the day after the analyst
  asked where 온새's repayment terms came from; it had said the dispatch
  failure's budget ceiling, which the order's own date (twelve days before the
  inquiry opened) puts a week before that failure happened. This changes
  which question caused the posting, and waits for the owner's word.
- 사건 07's 강서지점 has four people at the counter (the number is in a card
  label) and 프롤로그 04 has six; the papers there are loan applications in one
  and a trust product in the other.
- A hidden route's clock is fixed at an early hour of its case, so entered
  late the time runs backwards. 사건 13, 23 and 33 do the same; it reads as a
  convention.
- 사건 01: "협상서는 양쪽 서명을 받았습니다" is followed by a closing scene that
  treats the sale as still open.
- 한서윤 speaks 해요체 in 사건 01-05 and 합니다체 from 사건 06; 반재욱 says
  "저는" in 01-05 and "나는" from 06. Later cases are split the same way.
- The finale's "마흔아홉 사건과 1년" beside "3년" elsewhere; 사건 06's
  "사직서는 아직 수리되지 않았습니다" beside a memo that says none was handed in.
- A replayed case replaces that case's story summary. That is the design
  (priority 39), not an oversight.
- Outcomes that finding "a case records the card it followed" got wrong
  before the fix are not repaired in saves already written.
- The service worker has not been run on iOS Safari or in an installed copy on
  a phone, and Playwright WebKit skips the offline spec.
- 다시 시도 on the offline panel, pressed after the connection returns, ends
  in the one automatic reload in Chromium instead of opening the screen in
  place: a failed dynamic import is remembered by the document.
- The shell's `createStartSave` (`AppContent.jsx`) is still its own list of
  the run's fields (priority 1).
- A debug jump keeps `discoveredClues`, `caseResults` and `playtestFeedback`
  from the run it left; a jump does not close the recovery centre or clear the
  stale-tab lock. Kept as they were and written on the rows of `RUN_FIELDS`.
- Not done: manifest `screenshots` (no suitable image exists), smaller icon
  PNGs (`build:icons` writes lossless files), one breakpoint for the five
  near 720px (each guards a different component), `install-deps` skipped on a
  browser-cache hit (the runner image's libraries are not known to be there).
- Needs a hand outside the repository: the four header rules in the Render
  dashboard (priority 66), the `SUPABASE_ACCESS_TOKEN` secret for Migration
  Drift, and a ruleset on `main` (it has no branch protection). The two
  migrations needed no `db push`: the Supabase integration applied them at
  the merge.
- Not read: the opening variants against the second scene in the 43 cases the
  content audit only swept, and speech levels season-wide.

### Audit of 2026-10-07

Fifteen readers went through what the first audit had not: the code written
on 2026-10-06, the table screen and its sound, the screens around the play
screen, the tests, the content checks, the 34 older migrations, and 38 case
files read whole. What they found was fixed the same day, by area, each on a
branch of its own.

Fixed, by area:

- **Consent and telemetry.** The playtest-data box starts ticked on a device
  with no save. Restoring a slot or a kept copy keeps this device's consent.
  A run can carry all twelve relics: the server's limit is 16
  (`20261007000000`), and `check:grants` ties it to `RELIC_IDS`. A ranking row
  the server can never take is sent once and let go, and the player is told.
  Rows the player was told were deleted are not sent after a re-tick. A reset
  holds the online copy until the player chooses in the panel. A ceiling set
  past the counter's range is still a ceiling (`20261007010000`).
- **The table.** Grade labels and the relic toast survive reduced motion.
  Nothing on the table blinks faster than three times a second, and the
  comfort setting reaches every animation on the stage. A bust says what
  closed the window (clock heat and an off-beat lock had read "직접 확정했다").
  그 탭에 두기 closes the question it answers. A held key does not leak to the
  focused button, and a walked Space is graded when it goes down. Push and
  lock keep one accessible name. Sound follows the mute, the volume and the
  visible tab. `GauntletStage.jsx` is 825 lines and 68 imports.
- **Screens.** The roadmap card of the case in progress resumes it; another
  card asks before discarding it. The finale counts clues out of the real
  total. The phone-on-its-side table is for phones (`pointer: coarse`), so a
  laptop at 200% keeps the desktop table. The board and the ranking say what
  they are doing and why a button will not act.
- **Service worker and tooling.** The kept page answers when the host fails.
  A page asks the new worker to warm when its release is replaced, and offers
  a reload instead of a retry that cannot work. A release is the commit plus a
  hash of the files the page names. A deploy waits for a second build of a
  commit already served and says when the worker is the kill switch. Migration
  Drift takes fifteen shapes of credential out of what it prints and reports
  what it used to drop. Visual regression compares pull requests that change
  markup.
- **Case text.** About 300 places in 38 files: openings that follow the ending
  they come from (the `rush` openings of 사건 18, 30, 35, 36, 37, 40, 47 had
  gone somewhere the previous case did not), openings that give what the next
  scene assumes, echoes that leave open what a later scene decides, side
  branches that no longer return to an earlier hour, evidence scenes in 사건
  41-44, 46 and 49 that say their own time. Decided with the owner's leave and
  now in `docs/canon.md`: 반재욱 is a 17-year 조사역 in 2023 (twenty by the
  season) and carries one notebook; 사건 19 is 1월 19일-22일; 트리거랩 and the
  33rd floor are different buildings; the 보관 X line is 2023-04-27 18:44 on
  윤상혁's account; the dissent is eleven pages (사건 31's "15쪽" is the eleven
  missing pages); the response records hold 63 participants and 1기 was four
  people; 사건 49's appointment is midnight, as the finale's clocks say.

Looked at and left, for the owner:

- 프롤로그 04's national sales figure was changed from 1,180억 to 214억 so it
  sits under the 310억 loan; another number may be meant.
- Sixty-odd cards whose numbers or way of thinking argued with their label
  were changed (the "곁에 남는다" aftermath card is `persistence`, a card whose
  echo says a day is lost no longer gains time); the ones that could be read
  either way were left, and 69 cards whose label waits while `time` rises
  stand as the game's rule that waiting buys today at a later cost.
- The content checks now refuse another case's result as a `next`, a way
  back, a card id used twice in a case and a card with no cognition; the
  canon check reads 34 facts in every file that states them; a hard word has
  to be explained on every route to the scene that says it, with 28 case and
  term pairs allowed as they stand (`--list` names them).
- 트리거랩 is six people and 에코; the nine on 사건 20's list are those six and
  three who left; 백아린's resignation is never accepted and comes back as a
  dismissal; the 평택 tower is 22 floors and the 58% of April was wrong too.
  All three are in `docs/canon.md`. The make-up of the 63 participants
  (nine analysts, four of 1기, fifty who sat at the lab's terminal in
  training) was written to make the count add up and may not be what was
  meant.
- Nothing here was looked at in a browser by a person: the louder reveal and
  card cues, the comfort setting's wider reach, the beat marker at every other
  beat above 180bpm, the roadmap's open cards printing their summary in full.

### The two content ratchets, 2026-10-08

Both ceilings the audit of 2026-10-07 left open are at 0, so either check
fails on the first new offender.

- **Plain language.** The 28 case and term pairs a route could read
  unexplained each carry the season's gloss at the first place the word is
  read. `BARE_ON_A_ROUTE` in `check-plain-language.mjs` is empty.
- **A label against the clock (`check:balance` rule 7).** 시간 is time left
  today, and putting a thing off buys today at a later price; the echoes say
  so. The rule read it the other way and held 54 such cards as exceptions.
  It now reads, in `scripts/balance-rules.mjs`:
  - a label that waits or puts a thing off (미룬다, 보류한다, 늦춘다, 뒤로
    돌린다, 기다린다) may gain time, and is refused only when the card loses
    time and the label is nothing but the putting-off -- the wait word is its
    last verb and nothing before it names a second act (…고, …며, …채, …부터)
    or a span waited through (…까지, 동안, 며칠, 하루, 곁);
  - a label that says it acts at once (바로, 즉시, 곧장) may not lose time.
  Twelve labels (fifteen dealt cards) said 바로 or 곧장 on a card that takes
  time for what it does and lost the word. `tests/unit/balance-rules.test.mjs`
  holds both halves on cards made up for the test.

### The "Last updated" line as it stood on 2026-10-11

Last updated: 2026-10-11 (the thirteen-day rework is closed and deployed: the table's rules step in over the five 프롤로그, story mode, the result card, the logic streak in place of the beat, the season's logic report, 사건 23 and the finale's 33층 rewritten -- see Current State and priorities 38, 70 and 87; 2026-10-08: the two content ratchets are at 0 -- see the last section; 2026-10-07: a second audit and its fixes -- see "Audit of 2026-10-07" at the end; before that: a whole-repository audit and its fixes: the table's state and its save from one definition; a first start that waits for one case; a service worker; a landscape layout and type in rem; 사건 01-07 and the finale written at the season's length; explicit cognition on generated cards; deploy, report and database-limit fixes -- see "Audit of 2026-10-06" at the end)

### The visual-baseline entry of Current State as it stood on 2026-10-11

- Visual baselines were last recorded on 2026-09-29, after the font, colours,
  copy, the case card's markup and the phone header moved, and the phone play
  screen again on 2026-10-05, when the dateline stopped cutting off its clock;
  the comparison passes on main (priority 19 says how to record them again).
  The 2026-10-06 audit moved the intro, the 사건 01 result screen and the
  phone play screen (type in rem with an 11px floor, the hero art by width,
  `시즌 처음부터 다시`); those baselines are recorded again with that change.
