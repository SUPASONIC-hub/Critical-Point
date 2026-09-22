/**
 * CASE 21 -- the first participant.
 *
 * 사건 20 ended with the lab's verification system replaced by 노아 and the
 * training list for 노아 opened line by line. The oldest line on it is not the
 * analyst's. It belongs to 선우진, participant 01 of the lab's first cohort in
 * 2022, with no consent on file. He burned out that summer, left, and now runs
 * 느린섬, a guesthouse built inside a 1978 tangerine warehouse in 구좌 on Jeju.
 * He remembers the experiment as a "crisis-response training". The group's
 * legal team has already mailed him a retroactive consent form with a 300만
 * "thank-you" payment, due back the day before 노아 goes live.
 *
 * This is the season's quietest case on purpose, and the one that sets up the
 * finale's "첫 번째 참가자" without resolving it: one weekly sheet surfaces with
 * the margin note "압박 강도 조정 +2단계" and a denied compassionate leave, the
 * rest of the cohort's originals stay in the sealed zone of B2, and a sentence
 * from his guestbook turns out to be choice #0001 of the lab's template library
 * -- the button the team pressed every day. The joy is the first time the team
 * travels instead of deploying (a tangerine harvest before a cold snap), the
 * comedy is 권도현 pricing the harvest until the farmer tells him not to pick,
 * the grief is a man on a breakwater who thought he broke because he was weak,
 * and the anger is the note that turned the pressure up. The last question is
 * not whether he should know but who gets to decide when.
 */
export const case21Nodes = {
  c21_start: {
    phase: "CASE 21 BRIEFING",
    title: "맨 아래 줄",
    speaker: "이민서",
    text:
      "노아의 정식 가동일이 2월 10일로 잡힌 날, 이민서가 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 자료) 목록을 끝까지 내립니다. 맨 아래, 가장 오래된 줄에 이렇게 적혀 있습니다. 'TL-1기 · 참가자 01 · 2022년 3월~9월 · 동의서 없음.' 트리거랩에는 당신보다 먼저 온 사람이 있었습니다. 이름은 선우진, 그해 가을 퇴사해 지금은 제주 구좌에서 귤 창고를 고친 게스트하우스를 합니다. 같은 날 류세아가 메시지를 보냅니다. '법무팀이 과거 참가자들한테 사후 동의서(이미 끝난 일을 뒤늦게 허락받는 서류)를 등기로 보냈어요. 감사금 300만 원을 붙여서요. 첫 봉투는 제주로 갔어요.' 한서윤에게 1기를 묻자, 그는 '제가 오기 전 일이에요'라고만 하고 모니터를 끕니다.",
    memo: [
      "노아 정식 가동 2월 10일 -- D-6",
      "참가자 01 선우진: 1기 분석관, 2022년 3~9월",
      "동의서 기록 없음 -- 사후 동의서 등기 발송",
      "감사금 300만 원, 가동 전날까지 회신 조건",
    ],
    triggers: ["curiosity", "injustice", "protection"],
    choices: [
      {
        id: "c21_start_visit",
        label: "주소를 받아 들고 제주 구좌로 직접 내려간다",
        effect: { trust: 12, humanCost: -5, time: -6, capital: -3, fatigue: 5 },
        next: "c21_inn",
        cognition: { persistence: 2 },
      },
      {
        id: "c21_start_origin",
        label: "참가자 01의 원본 기록부터 기록 보관소에서 찾는다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c21_inn",
        cognition: { inference: 2 },
      },
      {
        id: "c21_start_call",
        label: "게스트하우스에 전화를 걸어 봉투가 왔는지부터 떠본다",
        effect: { capital: 8, time: 6, legitimacy: -6, trust: -4, humanCost: 2, fatigue: 1 },
        next: "c21_inn",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c21_inn",
      },
    ],
  },
  c21_inn: {
    phase: "FIRST CONTACT",
    title: "느린섬",
    speaker: "선우진",
    text:
      "구좌 바닷가 마을 끝, 1978년에 지은 귤 창고가 게스트하우스 '느린섬'이 됐습니다. 현무암 벽에 노란 귤 컨테이너를 쌓아 책장을 만들었고, 칠판에는 '체크인은 천천히, 체크아웃은 더 천천히'라고 적혀 있습니다. 선우진이 귤피차를 따르며 한 단어씩 말합니다. '은행... 사람들이죠. 얼굴이... 그래요. 저도 거기 있었어요. 지하에.' 그가 웃습니다. 그는 그 시절을 '위기 대응 역량 진단'이라는 교육으로 기억합니다. 그리고 계산대 위, 귤 한 알로 눌러 둔 KD 등기 봉투를 가리킵니다. '옛 회사에서 고맙다고 돈을 준대요. 아직 안 뜯었어요. 여기선 급한 게 없어서.' 봉투 뒷면에 회신 기한이 찍혀 있습니다. 2월 9일.",
    memo: [
      "느린섬: 방 네 칸, 이번 주 손님은 우리뿐",
      "선우진: 그 시절을 '교육'으로 기억함",
      "KD 등기 봉투 -- 미개봉, 회신 기한 2월 9일",
      "마당의 개 이름은 '꼭지'",
    ],
    triggers: ["affection", "selfAwareness", "curiosity"],
    choices: [
      {
        id: "c21_inn_truth",
        label: "트리거랩에서 왔다고 먼저 밝히고 하룻밤 묵겠다고 한다",
        effect: { trust: 13, humanCost: -5, time: -4, fatigue: 6 },
        next: "c21_orchard",
        cognition: { persistence: 2 },
      },
      {
        id: "c21_inn_postmark",
        label: "봉투는 건드리지 않고 발신 부서와 기한만 적어 둔다",
        effect: { legitimacy: 12, trust: -2, time: -4, humanCost: 3, fatigue: 4 },
        next: "c21_orchard",
        cognition: { inference: 2 },
      },
      {
        id: "c21_inn_guest",
        label: "사정은 미루고 손님으로 사흘 치 방값부터 낸다",
        effect: { time: 6, capital: -4, trust: -4, legitimacy: -3, humanCost: 2, fatigue: -4 },
        next: "c21_orchard",
        cognition: { risk: 1, reframing: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c21_orchard",
      },
    ],
  },
  c21_orchard: {
    phase: "HARVEST",
    title: "그럼 따지 마세요",
    speaker: "고은비",
    text:
      "다음 날 아침, 옆집 감귤밭 주인 고은비가 트럭 짐칸에 빈 컨테이너 마흔 개를 싣고 옵니다. 밤부터 한파가 온다는 예보에 남은 귤 3톤을 오늘 안에 따야 합니다. 은행 사람 손은 안 빌린다던 고은비가 선우진의 부탁에 가위를 여섯 개 내밉니다. 강태민은 20킬로그램짜리 컨테이너를 혼자 다 나르다 '저분은 내일도 와요'라는 말을 듣고, 나준혁은 30년 도장 솜씨로 꼭지를 한 번에 잘라 칭찬을 독차지합니다. 권도현이 '시간당 1만 1천 원으로 치면 1킬로그램당 인건비가...' 하자 고은비가 가위를 멈춥니다. '그럼 따지 마세요.' 모두가 웃는 사이 고은비가 당신 옆으로 옵니다. '우진 씨, 처음 왔을 때 석 달 동안 말 한 마디 없이 귤만 땄어요. 그 편지, 지붕 고칠 돈이라고 좋아하던데. 그거 좋은 돈 맞아요?'",
    memo: [
      "남은 귤 3톤 -- 오늘 밤 한파 전까지",
      "컨테이너 40개, 일손 여덟 명",
      "느린섬 지붕: 지난 태풍에 파손, 수리비 280만 원",
      "고은비: 3대째 감귤 농사, 은행을 믿지 않음",
    ],
    triggers: ["affection", "trust", "responsibility"],
    choices: [
      {
        id: "c21_orchard_stay",
        label: "한파 전에 마지막 귤을 딸 때까지 끝까지 손을 보탠다",
        effect: { trust: 12, humanCost: -4, legitimacy: 3, capital: -5, time: -5, fatigue: 6 },
        next: "c21_breakwater",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c21_orchard_terms",
        label: "좋은 돈인지 답하기 전에 동의서 조건부터 확인한다",
        effect: { legitimacy: 11, trust: 5, time: -5, humanCost: 3, fatigue: 5 },
        next: "c21_breakwater",
        cognition: { inference: 2 },
      },
      {
        id: "c21_orchard_hire",
        label: "일당을 주고 일손을 불러 맡긴 뒤 선우진을 따로 만난다",
        effect: { time: 7, capital: -2, trust: -5, humanCost: 4, fatigue: -4 },
        next: "c21_breakwater",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c21_breakwater",
      },
    ],
  },
  c21_breakwater: {
    phase: "CONFESSION",
    title: "꼭지가 상한다",
    speaker: "선우진",
    text:
      "한파가 온 밤, 선우진이 손전등을 들고 방파제 끝으로 걸어갑니다. 등대 불이 네 번 돌 때까지 말이 없다가 입을 엽니다. '그 교육, 매주 조금씩 어려워졌어요. 아버지가 쓰러졌을 때 휴가를 냈는데, 안 된대요. 이번 주가 중요하다고.' 파도가 방파제 블록 사이로 빠집니다. '7월 말에, 새벽 세 시에 책상에서 일어나다가 쓰러졌어요. 아버지 장례식엔... 갔어요. 늦게.' 그가 주머니에서 귤 하나를 꺼내 천천히 깝니다. '나는 그때 내가 약해서 무너진 줄 알았어요. 그래서 여기 와서 느리게 사는 연습을 했어요. 은비 씨 할머니가 그러더라고요. 귤은 급하게 따면 꼭지가 상한다고.' 그가 귤 반쪽을 당신에게 내밉니다. '근데 당신들, 휴가 온 거 아니죠?'",
    memo: [
      "그의 기억과 1기 주간표 날짜가 일치: 7월 둘째 주",
      "부친 사망 2022년 8월 -- 휴가 반려 뒤",
      "퇴사 서류의 사유: '개인 사정'",
      "사후 동의서 회신 기한: 내일 17시",
    ],
    triggers: ["helplessness", "affection", "selfAwareness"],
    choices: [
      {
        id: "c21_breakwater_stay",
        label: "대답을 서두르지 않고 그가 다 말할 때까지 곁에 앉아 있는다",
        effect: { trust: 13, humanCost: -6, time: -4, legitimacy: -2, fatigue: 7 },
        next: "c21_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c21_breakwater_match",
        label: "그가 말한 날짜들을 주간표와 하나씩 맞춰 적어 둔다",
        effect: { legitimacy: 9, trust: 2, time: -3, humanCost: 3, fatigue: 3 },
        next: "c21_final",
        cognition: { inference: 2 },
      },
      {
        id: "c21_breakwater_admit",
        label: "휴가가 아니라고 짧게 인정하고 이야기는 내일 아침으로 미룬다",
        effect: { time: 5, legitimacy: 3, trust: 2, humanCost: 4, fatigue: -4 },
        next: "c21_final",
        cognition: { risk: 1, reframing: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c21_final",
      },
    ],
  },
  c21_final: {
    phase: "FINAL DECISION",
    title: "알고 싶은 사람",
    speaker: "선우진",
    text:
      "오후 네 시, 구좌 우체국 등기 마감까지 한 시간이 남았습니다. 선우진이 서명하지 않은 동의서를 계산대에 올려놓고 당신 앞에 앉습니다. 방파제의 밤 이후 그는 한 번도 재촉하지 않았습니다. 꼭지가 그의 발밑에 엎드려 있습니다. '어젯밤에 방명록 보던 거, 봤어요. 아침에 은비 씨가 한 말도 들었고요.' 그가 천천히 숨을 고릅니다. '제가 모르는 게 있죠. 5년 전 그 지하에서요.' 반재욱이 보낸 주간표 사진은 당신 휴대폰에 있고, 1기의 나머지 원본은 아직 봉인된 구역에 있습니다. 그가 펜을 내려놓습니다. '말해 줄 수도 있고, 안 해 줄 수도 있겠죠. 어느 쪽이든 저는 오늘 이 종이에 뭔가를 써야 해요.'",
    memo: [
      "동의서 미서명 -- 등기 마감 17시",
      "가진 것: 주간표 1장, 방명록 문장, 노아의 학습 목록",
      "1기 나머지 원본은 B2 봉인 구역",
      "이 선택은 시즌 마지막 사건의 '첫 번째 참가자'로 이어짐",
    ],
    triggers: ["choice", "protection", "injustice"],
    choices: [
      {
        id: "c21_final_tell",
        label: "주간표와 방명록 문장을 보여 주고 5년 전 일을 그대로 알린다",
        effect: { trust: 11, legitimacy: 6, humanCost: 3, capital: -5, time: -5, fatigue: 6 },
        next: "case21_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c21_final_secure",
        label: "알리기 전에 1기 원본부터 보존 요청으로 묶어 둔다",
        effect: { legitimacy: 13, trust: 2, capital: -4, time: -6, humanCost: 4, fatigue: 5 },
        next: "case21_result",
        cognition: { inference: 2, risk: 1 },
      },
      {
        id: "c21_final_ask",
        label: "무엇을 말하기 전에 그가 알고 싶은지부터 묻는다",
        effect: { trust: 9, humanCost: -6, legitimacy: -6, time: 5, fatigue: -3 },
        next: "case21_result",
        cognition: { reframing: 3 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case21_result",
      },
    ],
  },
};

/**
 * Everything else case 21 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case21 = {
  id: "case21",
  nodes: case21Nodes,
  aftermath: {
    c21_aftershock: {
      phase: "AFTERMATH",
      title: "급하게 따지 않은 귤",
      speaker: "선우진",
      text: "우체국 마감 시간이 지나고, 느린섬 마당에 눈발이 날립니다. 고은비가 비상품과(크기나 모양 때문에 제값을 못 받는 귤) 한 상자를 권도현에게 안기며 명세서를 내밉니다. 금액 칸에 '0원', 비고 칸에 '따지 마세요'. 권도현은 그 명세서를 접어 지갑에 넣습니다. 강태민은 내일도 오라는 말을 세 번째 듣고, 나준혁은 방명록에 도장처럼 반듯한 글씨로 '천천히 다시 오겠습니다'라고 씁니다. 선우진이 당신에게 귤 한 상자를 건넵니다. '급하게 따지 않은 거예요.' 그때 문가을의 문자가 옵니다. '끝까지정밀 새 기계 살 돈 빌리는 신청서 오늘 냈어요. 심사는 새 컴퓨터가 한대요. 하준이는 다음 주부터 강서지점 인턴이고요.'",
      memo: ["사후 동의서 회신 마감 지남", "비상품과 한 상자 -- 명세서 0원", "끝까지정밀 대출 신청, 노아가 심사", "문하준, 다음 주 강서지점 인턴 시작"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c21_after_warm", label: "마지막 비행기 시간까지 느린섬에 남아 귤 상자를 같이 싼다", effect: { trust: 13, humanCost: -5, time: -3, capital: -2, fatigue: -8 }, next: "case21_result", cognition: { reframing: 2 } },
        { id: "c21_after_record", label: "1기 참가자가 자기 기록을 볼 수 있는 열람 청구 안내문을 문서로 만든다", effect: { legitimacy: 15, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case21_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c21_after_rush", label: "귤 상자를 든 채 첫 비행기로 올라가 노아의 심사를 들여다본다", effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 }, next: "case21_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c21_final", "c21_aftershock"],
  connectiveScenes: [
    ["c21_guestbook", "c21_inn", "c21_orchard", "방명록 열두 권", "이민서", "밤 열한 시, 거실 난로 옆에 방명록이 열두 권 꽂혀 있습니다. 4년 동안 이곳을 찾은 손님 대부분은 회사를 쉬러 온 사람들이고, 선우진은 모든 글 아래 손글씨로 답을 달아 두었습니다. 이민서가 한 권을 넘기다 손을 멈춥니다. 답글 하나가 눈에 익습니다. '사람부터 세고, 숫자는 그다음에 셉니다.' 트리거랩 케이스 템플릿의 보기 문장 라이브러리, 그 첫 번째 줄과 한 글자도 다르지 않습니다. 이민서가 속삭입니다. '이거, 우리가 매일 누르던 버튼이에요.'", ["방명록 12권 -- 모든 글에 선우진의 답글", "보기 문장 #0001과 같은 문장", "라이브러리 등록일: 2022년 6월"], ["방명록은 그의 것이니 사진 없이 조용히 덮어 둔다", "답글 날짜와 보기 문장 번호를 나란히 적어 둔다", "사진만 찍어 두고 내일 귤밭 일정부터 챙긴다"]],
    ["c21_storehouse", "c21_orchard", "c21_breakwater", "+2단계", "반재욱", "귤을 다 들인 밤, 서울의 반재욱이 기록 보관소 B2에서 전화를 겁니다. '참가자 01의 주간표를 찾았습니다. 한 장입니다. 나머지 원본은 봉인 구역에 있고, 제 권한으로는 거기까지 못 들어갑니다.' 사진이 옵니다. 2022년 7월 둘째 주. 반응 점수 옆 여백에 볼펜 메모가 있습니다. '참가자 01 반응 둔화. 압박 강도 조정 +2단계. 부친 입원 사유 휴가 신청 -- 반려 권고.' 선우진은 지금 창고 반대편에서 컨테이너를 닦으며 휘파람을 붑니다.", ["2022년 7월 둘째 주 주간표 1장", "메모: 압박 강도 조정 +2단계, 휴가 반려 권고", "1기 나머지 원본은 봉인 구역"], ["주간표는 선우진이 볼 수 있을 때까지 우리끼리만 본다", "메모를 쓴 사람과 승인선을 원본에서 확인하게 한다", "주간표 사진을 류세아에게 넘겨 노아 가동을 멈출 근거로 쓴다"]],
    ["c21_letter", "c21_breakwater", "c21_final", "지붕 고칠 돈", "선우진", "다음 날 아침, 선우진이 계산대에서 봉투를 뜯습니다. 감사 편지 한 장, 동의서 두 장. '귀하의 2022년 역량 진단 참여 기록을 연구 목적으로 활용하는 데 동의합니다.' 서명란 아래 감사금 300만 원을 받을 계좌 칸이 있고, 회신은 오늘 오후 다섯 시 구좌 우체국 등기 마감까지입니다. 류세아의 메시지가 함께 옵니다. 그는 그 기록의 정보 주체(기록의 주인인 사람)라서, 서명하기 전에 열람 청구(내 기록을 보여 달라고 요구하는 것)를 할 수 있습니다. 선우진이 지붕의 파란 방수포를 올려다봅니다. '연구 목적이면... 좋은 데 쓰이는 거죠? 지붕 고칠 돈이네요.' 그가 펜 뚜껑을 엽니다.", ["동의서 2장 + 감사금 300만 원", "회신 마감: 오늘 17시 구좌 우체국", "지붕 수리비 280만 원"], ["지붕 수리비는 우리가 따로 구해 보겠다고 먼저 말한다", "동의서에 적힌 문장을 그와 함께 한 줄씩 읽는다", "오늘 서명만 미뤄 달라고 부탁하고 자리를 비켜 준다"]],
  ],
  connectiveOrder: [["c21_inn", "c21_guestbook"], ["c21_orchard", "c21_storehouse"], ["c21_breakwater", "c21_letter"]],
  choiceEffects: {
    c21_inn: [
      { trust: 11, legitimacy: 4, humanCost: -5, time: -4, capital: -3, fatigue: 5 },
      { legitimacy: 7, trust: 3, time: -4, humanCost: 4, fatigue: 4 },
      { time: 6, capital: 4, trust: -5, humanCost: 4, fatigue: -3 },
    ],
    c21_orchard: [
      { trust: 10, humanCost: -5, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 3, time: -5, humanCost: 3, fatigue: 4 },
      { time: 5, capital: 5, legitimacy: 4, trust: -4, humanCost: 4, fatigue: -4 },
    ],
    c21_breakwater: [
      { trust: 11, humanCost: -5, capital: -7, time: -2, fatigue: 4 },
      { legitimacy: 10, trust: 5, humanCost: 3, time: -4, fatigue: 4 },
      { time: 5, capital: 3, trust: -4, humanCost: 4, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c21_inn: {
      voice: ["방명록은 그의 것이라며, 사진 없이 조용히 덮어 둔다.", "답글 날짜와 보기 문장 번호를, 나란히 적어 둔다.", "사진만 찍어 두고, 내일 귤밭 일정부터 챙긴다."],
      echo: ["덮어 두면 방명록은 다시 그의 것이 됩니다. 그 문장이 어디서 왔는지는 오늘 밤 아무도 적지 않습니다.", "나란히 적으면 순서가 보입니다. 라이브러리 등록은 2022년 6월, 그가 트리거랩 지하에 있던 여름입니다.", "사진은 남습니다. 남의 방명록을 찍는 셔터 소리에 거실 난로 옆 꼭지가 고개를 듭니다."],
    },
    c21_orchard: {
      voice: ["주간표는 선우진이 볼 수 있을 때까지, 우리끼리만 본다.", "메모를 쓴 사람과 승인선을, 원본에서 확인하게 한다.", "주간표 사진을 류세아에게 넘겨, 노아 가동을 멈출 근거로 쓴다."],
      echo: ["우리끼리만 보면 선우진은 오늘 밤도 휘파람을 붑니다. 그 한 장을 숨긴 사람이 우리가 됩니다.", "승인선을 확인하려면 봉인 구역의 문을 두드려야 합니다. 두드리는 소리는 33층까지 갑니다.", "근거는 빨리 도착합니다. 한 사람의 가장 나쁜 여름이 주인보다 먼저 회의 자료가 됩니다."],
    },
    c21_breakwater: {
      voice: ["지붕 수리비는 우리가 따로 구해 보겠다고, 먼저 말한다.", "동의서에 적힌 문장을, 그와 함께 한 줄씩 읽는다.", "오늘 서명만 미뤄 달라고 부탁하고, 자리를 비켜 준다."],
      echo: ["수리비를 구하겠다고 하면 선우진이 펜을 내려놓습니다. 대신 왜 그렇게까지 하는지 묻는 눈이 됩니다.", "한 줄씩 읽으면 '범위는 회사가 정한다'는 줄에서 그가 멈춥니다. 그 멈춤은 당신이 만든 것입니다.", "자리를 비켜 주면 결정은 그의 것이 됩니다. 그가 모르는 것까지 그의 몫으로 남습니다."],
    },
  },
  reactionScenes: [
    ["c21_guestbook_reaction", "c21_guestbook", "c21_orchard", "등록자 칸", "류세아", "이민서가 보낸 문장을 받은 류세아가 자정 넘어 전화를 겁니다. '라이브러리 첫 50개 문장 중에 31개가 등록자 칸이 비어 있어요. 등록일은 전부 2022년 봄과 여름이고요.' 그가 잠깐 멈춥니다. '노아도 이 문장들로 선택지를 만들어요. 지금 이 순간에도요. 누가 처음 쓴 말인지는 아무도 안 적었어요.' 다락방 창밖에서 꼭지가 한 번 짖습니다. 아래층 선우진의 방은 벌써 불이 꺼져 있고, 문틈으로 귤 향만 새어 나옵니다.", ["선우진이 직접 알기 전에는 아무에게도 넘기지 말자고 한다", "31개 문장의 등록 기록을 공식 요청서로 남긴다", "일단 31개 문장을 노아에서 빼 달라고 바로 요청한다"]],
    ["c21_storehouse_reaction", "c21_storehouse", "c21_breakwater", "33층 서식", "한서윤", "사진을 본 한서윤이 밤늦게 전화를 겁니다. 한참 말이 없다가, 이번에는 '제가 오기 전 일'이라고 하지 않습니다. '그 메모 양식, 칸 나누는 방식이 33층 서식이에요. 제가 처음 트리거랩에 왔을 때 인수인계 받은 파일도 같은 모양이었어요.' 수화기 너머로 서랍 여는 소리가 납니다. '더는 지금 말 못 해요. 말할 수 있을 때, 제 이름을 넣고 말할게요.' 돌담 너머 방파제 쪽으로 선우진의 손전등 불빛이 움직입니다.", ["한서윤이 말할 수 있을 때까지 묻지 않고 기다린다", "33층 서식이라는 말을 통화 기록으로 남겨 둔다", "누구 서식인지 지금 바로 말하라고 몰아붙인다"]],
    ["c21_letter_reaction", "c21_letter", "c21_final", "별표 친 데만", "고은비", "귤 상자를 가지러 온 고은비가 계산대 위 동의서를 넘겨봅니다. 그리고 웃지도 않고 말합니다. '은행은 꼭 돈 줄 때 종이를 같이 줘요. 우리 할아버지 때도 그랬어요. 별표 친 데만 사인하라고.' 그가 동의서 둘째 장을 손끝으로 두드립니다. 작은 글씨로 '참여 기록의 범위는 회사가 정한다'는 줄이 있습니다. '범위를 회사가 정하면, 우진 씨는 뭘 허락하는지도 모르고 허락하는 거잖아요.' 계산대 뒤에서 선우진이 펜을 든 채 가만히 듣고 있습니다.",["고은비에게 오늘 선우진 곁에 같이 있어 달라고 부탁한다", "'범위는 회사가 정한다'는 줄에 밑줄을 긋고 법무팀에 질의한다", "선우진 일은 선우진이 정할 거라며 대화를 여기서 끊는다"]],
  ],
  reactionEffects: {
    c21_guestbook: [
      { trust: 9, legitimacy: 3, humanCost: -5, time: -4, fatigue: 4 },
      { legitimacy: 10, trust: 4, capital: -5, time: -5, fatigue: 5 },
      { time: 5, capital: 5, legitimacy: 3, trust: -4, humanCost: 4, fatigue: -3 },
    ],
    c21_storehouse: [
      { trust: 9, humanCost: -4, time: -4, fatigue: 3 },
      { legitimacy: 7, trust: 4, capital: -3, time: -3, fatigue: 2 },
      { time: 4, capital: 3, legitimacy: 2, trust: -3, humanCost: 2, fatigue: -3 },
    ],
    c21_letter: [
      { trust: 9, legitimacy: 2, humanCost: -5, time: -4, fatigue: 3 },
      { legitimacy: 11, trust: 3, capital: -5, time: -3, fatigue: 5 },
      { time: 5, capital: 4, trust: 2, legitimacy: -6, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c21_guestbook: {
      voice: ["선우진이 직접 알기 전에는, 아무에게도 넘기지 말자고 한다.", "31개 문장의 등록 기록을, 공식 요청서로 남긴다.", "일단 31개 문장을 노아에서 빼 달라고, 바로 요청한다."],
      echo: ["넘기지 않으면 문장은 오늘도 노아의 선택지가 됩니다. 주인이 아는 날까지 그 버튼은 계속 눌립니다.", "요청서는 남습니다. 등록자 칸을 채워 달라는 요청을 받은 부서는 답을 사흘 뒤로 미룹니다.", "빼 달라고 하면 류세아가 망설입니다. 노아의 선택지 서른한 개가 비고, 왜 비었는지 누군가 묻기 시작합니다."],
    },
    c21_storehouse: {
      voice: ["한서윤이 말할 수 있을 때까지, 묻지 않고 기다린다.", "33층 서식이라는 말을, 통화 기록으로 남겨 둔다.", "누구 서식인지, 지금 바로 말하라고 몰아붙인다."],
      echo: ["기다리면 한서윤이 전화를 끊기 전에 한 번 더 숨을 쉽니다. 그 숨이 고맙다는 말 대신입니다.", "기록으로 남기면 그 한마디는 증거가 됩니다. 한서윤은 자기 말이 적히는 것을 압니다.", "몰아붙이면 수화기 너머가 조용해집니다. 서랍이 닫히는 소리가 대답입니다."],
    },
    c21_letter: {
      voice: ["고은비에게, 오늘 선우진 곁에 같이 있어 달라고 부탁한다.", "'범위는 회사가 정한다'는 줄에 밑줄을 긋고, 법무팀에 질의한다.", "선우진 일은 선우진이 정할 거라며, 대화를 여기서 끊는다."],
      echo: ["고은비는 대답 대신 귤 상자를 내려놓고 계산대 옆 의자에 앉습니다. 오늘 수확은 반나절 늦어집니다.", "질의는 기록으로 남습니다. 법무팀의 답은 우체국 마감 뒤에 옵니다.", "대화가 끊기면 고은비가 문을 닫고 나갑니다. 문 닫는 소리가 조금 큽니다."],
    },
  },
  reactionMemos: {
    c21_guestbook_reaction: ["등록자 칸이 빈 31개 문장", "노아가 지금도 이 문장으로 선택지를 만듦"],
    c21_storehouse_reaction: ["'33층 서식'", "말할 수 있을 때, 이름을 넣고"],
    c21_letter_reaction: ["'참여 기록의 범위는 회사가 정한다'", "별표 친 데만 사인하라는 말"],
  },
  branchPlan: ["c21_orchard", 2, "c21_branch_rind", "c21_branch_rind_follow"],
  branchScenes: {
    // CASE 21's detour is the neighbour's warehouse. The case is about a form a
    // bank sends with money attached; the side door is the farmer who already
    // signed one, and what it cost her grandfather.
    c21_branch_rind: {
      phase: "SIDE DOOR",
      title: "비상품과 2톤",
      speaker: "고은비",
      text: "'일당 줄 돈 있으면 우리 창고 귤이나 봐요.' 고은비가 앞장서 자기 귤 창고 문을 엽니다. 노란 컨테이너 백 개에 비상품과(크기나 모양 때문에 제값을 못 받는 귤)가 2톤 쌓여 있습니다. 농협 수매가(농협이 농가에서 사들이는 값)는 1킬로그램에 300원입니다. 벽에는 할아버지가 쓴 영농자금(농사에 쓰라고 빌려주는 돈) 상환(빌린 돈을 갚는 일) 달력이 붙어 있고, 3월 칸에 빨간 동그라미가 있습니다. 4,000만 원입니다. '2년 전 우박 맞았을 때 은행이 연장을 안 해 줘서, 할아버지가 밭 반을 팔았어요. 그래서 전 은행 사람 안 믿어요.' 컨테이너를 세던 권도현이 조용히 계산기를 내려놓습니다.",
      memo: ["비상품과 2톤 -- 수매가 1kg 300원", "영농자금 대출 4,000만 원, 3월 만기", "2년 전 우박 피해 때 연장 거절, 밭 절반 매각", "권도현이 처음으로 계산기를 내려놓음"],
      triggers: ["injustice", "affection", "trust"],
      choices: [
        { id: "c21_branch_rind_a", label: "비상품과로 귤피차를 만들어 느린섬에서 같이 팔자고 한다", effect: { trust: 12, legitimacy: 4, capital: -7, time: -6, fatigue: 5 }, next: "c21_branch_rind_follow", cognition: { reframing: 2 } },
        { id: "c21_branch_rind_b", label: "영농자금 만기를 늘릴 수 있는 조건부터 같이 확인한다", effect: { legitimacy: 11, time: -6, humanCost: 3, trust: 3, fatigue: 4 }, next: "c21_branch_rind_follow", cognition: { inference: 2 } },
        { id: "c21_branch_rind_c", label: "수매가대로 넘기자고 하고 선우진 일로 돌아간다", effect: { time: 6, capital: 6, trust: -5, humanCost: 3, fatigue: -3 }, next: "c21_branch_rind_follow", cognition: { risk: 1 } },
      ],
    },
    c21_branch_rind_follow: {
      phase: "SIDE DOOR",
      title: "별표 열네 개",
      speaker: "권도현",
      text: "오후 네 시, 구좌 농협 대출 창구. 고은비가 만기 연장(갚을 날짜를 미뤄 주는 것) 신청서를 받습니다. 열네 장입니다. 직원이 형광펜으로 서명할 곳에 별표를 쳐 주며 말합니다. '다 읽으실 필요는 없고요, 별표만 하시면 돼요.' 펜을 들던 고은비가 멈춥니다. 할아버지가 2년 전에 들은 말과 똑같습니다. 옆에 앉은 권도현이 빈 종이에 세로줄을 하나 긋습니다. '연장해 주는 대신 금리를 1.8%포인트 올리는 조항이 9쪽에 있습니다. 거기엔 별표가 없고요.' 고은비가 권도현을 처음으로 똑바로 봅니다.",
      memo: ["만기 연장 신청서 14장, 별표 14개", "9쪽: 금리 1.8%포인트 인상 조항 -- 별표 없음", "창구 직원: '다 읽으실 필요는 없고요'", "고은비가 권도현의 이름을 처음 부름"],
      triggers: ["injustice", "trust", "order"],
      choices: [
        { id: "c21_branch_rind_follow_a", label: "고은비 옆에서 열네 장을 끝까지 소리 내어 같이 읽는다", effect: { trust: 13, legitimacy: 4, capital: -6, time: -6, fatigue: 5 }, next: "c21_storehouse", cognition: { persistence: 2 } },
        { id: "c21_branch_rind_follow_b", label: "9쪽 금리 조항을 빼 달라고 서면으로 요청하고 서명은 미룬다", effect: { legitimacy: 12, trust: 5, time: -7, humanCost: 3, fatigue: 5 }, next: "c21_storehouse", cognition: { inference: 2 } },
        { id: "c21_branch_rind_follow_c", label: "오늘은 별표만 하고 금리는 나중에 다투자고 한다", effect: { time: 6, capital: 6, trust: -5, humanCost: 3, fatigue: -3 }, next: "c21_storehouse", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c21_start",
    result: "c21_aftershock",
    defaultFree: "c21_route_system",
    // One man, one form, one deadline. Like 사건 12 the case is a single line;
    // the split is who decides when he learns what was done to him.
    choices: {},
    system: {
      route: "c21_route_system",
      final: "c21_final_system_route",
      title: "유사도 91%",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자, 에코 대신 노아가 답합니다. 노아는 판단마다 근거를 보여 주도록 만들어졌습니다. 화면에 한 줄이 뜹니다. '입력하신 문장과 가장 가까운 학습 사례: 참가자 01, 2022년 5월 11일 03:12. 유사도(얼마나 닮았는지) 91%.' 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 자료) 가운데 1기 참가자 네 명의 반응 기록은 1만 2천 건이고, 가중치(판단에 얼마나 크게 반영하는지)가 가장 높은 묶음입니다. '이 묶음을 빼면 제 판단 정확도는 14% 떨어집니다. 이 묶음의 동의 여부는 제 설명 범위 밖입니다.'",
      memo: ["1기 반응 기록 1만 2천 건 -- 가중치 최상위", "당신의 문장과 참가자 01의 문장 유사도 91%", "동의 여부: 노아의 설명 범위 밖"],
      routeChoices: [
        ["c21_route_system_disclose", "노아의 설명 화면을 류세아와 동의 심사 쪽에 그대로 공유한다", { legitimacy: 11, trust: 6, capital: -6, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c21_route_system_exclude", "1기 묶음을 빼고 정확도 14%를 감수하자고 요구한다", { trust: 8, legitimacy: 7, capital: -8, humanCost: -4, time: -5, fatigue: 6 }, { reframing: 2 }],
        ["c21_route_system_close", "유사도 91%는 못 본 것으로 하고 화면을 닫는다", { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "1기 기록마다 처음 쓴 사람의 이름 칸을 되살려 붙인다", { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 }, { reframing: 3 }],
      ["b", "기록은 그대로 두고 감사금만 올려 다시 보낸다", { capital: 9, time: 7, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "동의하지 않은 참가자를 위한 기록 삭제 창구를 따로 만든다", { legitimacy: 8, trust: 9, capital: -7, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c21_evidence_turn",
    result: "c21_aftershock",
    sourceRoutes: ["c21_inn", "c21_orchard", "c21_breakwater", "c21_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 1기 주간표 옆에 놓고, 그 실험을 누가 주문했는지 맞춰 본다.",
    entryEcho: "단서를 대면 실험이 어디서 주문됐는지 보입니다. 그리고 그 주문서에 누구의 이름이 없는지도 보입니다.",
    title: "주문서의 빈칸",
    speaker: "반재욱",
    text: "단서를 맞추자 1기 운영 명세서가 열립니다. 과제명 'TL-2022-01 인사 혁신 기초 연구', 발주 부서 그룹전략실, 결과물 형식 '인사 참고 자료'. 반재욱이 한 장을 더 넘깁니다. 선우진이 퇴사 직전 낸 산업재해(일하다 얻은 병이나 다침) 신청에 회사가 붙인 의견서입니다. '개인적 스트레스로 판단됨.' 의견서 맨 아래 서명란은 비어 있습니다. 반재욱이 수첩을 덮습니다. '실험을 주문한 칸에도, 그 사람을 개인 사정으로 만든 칸에도 이름이 없습니다. 같은 손버릇입니다.'",
    memo: ["발주: 그룹전략실, 과제 TL-2022-01", "결과물 형식: 인사 참고 자료", "산업재해 신청 회사 의견서 -- 서명란 공란"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 4, trust: 4, time: -4, fatigue: 5 },
    choices: [
      ["c21_evidence_turn_reopen", "산업재해 재심사를 선우진 이름으로 낼 수 있게 서류를 갖춘다", { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c21_evidence_turn_hold", "명세서는 알고만 있고 봉인 구역이 열릴 때 함께 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c21_evidence_turn_share", "1기의 다른 세 사람에게도 이 명세서가 있다는 것부터 알린다", { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c21_branch_rind",
    systemNext: "c21_route_system",
    evidenceNext: "c21_evidence_turn",
    routeLabel: "직전 사건의 에코 송별 명단으로 제주에 갈 사람을 정한다",
    systemLabel: "직전 자유응답 문장이 노아의 학습 목록에도 있는지 본다",
    evidenceLabel: "직전 단서를 붙여 1기 운영 명세서를 연다",
  },
  openingRoutes: {
    c20_after_warm: "c21_start_warm",
    c20_after_record: "c21_start_record",
    c20_after_rush: "c21_start_rush",
  },
  openingCopy: {
    c21_start_warm: ["송별회에 남았던 사람들의 여행", "도윤하", "에코의 송별회가 끝난 새벽까지 여섯 명은 트리거랩 4층을 떠나지 않았습니다. 마지막 로그가 꺼진 화면 앞에서 강태민이 컵라면을 끓였고, 누군가 '다음엔 우리 진짜 여행 가요'라고 했습니다. 이틀 뒤 이민서가 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 자료) 맨 아래 줄을 들고 옵니다. 'TL-1기 · 참가자 01 · 동의서 없음.' 이름은 선우진, 지금 제주 구좌에서 게스트하우스를 합니다. 그리고 그에게 사후 동의서(이미 끝난 일을 뒤늦게 허락받는 서류)가 감사금 300만 원과 함께 등기로 가는 중입니다. 도윤하가 달력을 봅니다. '여행, 가죠. 제주로.'", ["여섯 명 전원 이번 주 연차 신청", "참가자 01 선우진 -- 동의서 없음", "사후 동의서 회신 기한 2월 9일"]],
    c21_start_record: ["문서를 남긴 사람이 찾은 빈칸", "류세아", "에코의 기록을 문서로 남긴 다음 날, 류세아가 그 문서의 부록을 채우다 전화를 겁니다. 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 자료)마다 동의 여부를 적는 칸입니다. '다 채웠는데, 맨 아래 한 줄이 비어요.' TL-1기, 참가자 01, 선우진. 동의서가 없는 줄은 그것 하나뿐입니다. 그런데 법무팀은 그 빈칸을 이미 알고 있었습니다. 제주 구좌의 그의 주소로 사후 동의서(이미 끝난 일을 뒤늦게 허락받는 서류)와 감사금 300만 원이 사흘 전에 발송됐습니다. 당신이 남긴 문서가, 그들이 채울 칸을 먼저 알려 준 셈입니다.", ["부록의 빈칸 1줄 -- 참가자 01", "법무팀 등기 발송: 사흘 전", "회신 기한 2월 9일, 노아 가동 전날"]],
    c21_start_rush: ["먼저 내려간 사람이 찾은 이름", "반재욱", "에코의 마지막 로그가 꺼지기도 전에 당신은 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 자료) 목록을 내려받았습니다. 송별 케이크는 절반이 남았고, 강태민이 혼자 탕비실을 치웠습니다. 목록은 날짜순이었고, 당신은 가장 오래된 줄까지 곧장 내려갔습니다. 'TL-1기 · 참가자 01 · 2022년 · 동의서 없음.' 선우진, 제주 구좌. 반재욱이 한 가지를 덧붙입니다. '법무팀이 이 사람한테 사후 동의서(이미 끝난 일을 뒤늦게 허락받는 서류)를 보냈습니다. 우리가 목록을 여는 걸 보고 서두른 겁니다.' 고개를 들자 4층에 남은 사람이 없습니다.", ["송별회 다음 날 목록 전체 내려받음", "참가자 01 선우진 -- 동의서 없음", "법무팀 사후 동의서 발송, 우리보다 먼저"]],
  },
  openingSignatures: {
    c21_start_warm: {
      label: "송별회에 남았던 여섯 명이 다 같이 첫 비행기를 탄다",
      effect: { trust: 11, humanCost: -4, capital: -5, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "송별회에 남았던 여섯 명이, 다 같이 첫 비행기를 탄다.",
      echo: "여섯 명이 한꺼번에 오면 선우진은 방이 모자라다며 웃습니다. 강태민과 권도현이 한 방을 쓰게 됩니다.",
    },
    c21_start_record: {
      label: "동의 부록의 첫 줄에 참가자 01의 이름을 올리고 내려간다",
      effect: { legitimacy: 12, trust: -3, capital: -5, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "동의 부록의 첫 줄에 참가자 01의 이름을 올리고, 제주로 내려간다.",
      echo: "첫 줄에 이름이 오르면 그 칸은 더는 법무팀만의 것이 아닙니다. 대신 그의 이름이 그가 모르는 문서에 한 번 더 적힙니다.",
    },
    c21_start_rush: {
      label: "목록에서 찾은 그 이름 하나만 들고 혼자 먼저 내려간다",
      effect: { trust: 12, legitimacy: 4, humanCost: 3, time: -5, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "목록에서 찾은 그 이름 하나만 들고, 혼자 먼저 내려간다.",
      echo: "혼자 가면 빠릅니다. 느린섬의 방 네 칸 중 세 칸이 비어 있고, 선우진은 왜 혼자 왔는지 묻지 않습니다.",
    },
  },
  voiceLines: {
    // CASE 21. Every line is spoken to a man who does not know yet, so none of
    // them is allowed to arrive faster than he can hear it.
    c21_start_visit: "주소를 받아 들고, 제주 구좌로 직접 내려간다.",
    c21_start_origin: "참가자 01의 원본 기록부터, 기록 보관소에서 찾는다.",
    c21_start_call: "게스트하우스에 전화를 걸어, 봉투가 왔는지부터 떠본다.",
    c21_inn_truth: "트리거랩에서 왔다고 먼저 밝히고, 하룻밤 묵겠다고 한다.",
    c21_inn_postmark: "봉투는 건드리지 않고, 발신 부서와 기한만 적어 둔다.",
    c21_inn_guest: "사정은 미루고, 손님으로 사흘 치 방값부터 낸다.",
    c21_orchard_stay: "한파 전에 마지막 귤을 딸 때까지, 끝까지 손을 보탠다.",
    c21_orchard_terms: "좋은 돈인지 답하기 전에, 동의서 조건부터 확인한다.",
    c21_orchard_hire: "일당을 주고 일손을 불러 맡긴 뒤, 선우진을 따로 만난다.",
    c21_branch_rind_a: "비상품과로 귤피차를 만들어, 느린섬에서 같이 팔자고 한다.",
    c21_branch_rind_b: "영농자금 만기를 늘릴 수 있는 조건부터, 같이 확인한다.",
    c21_branch_rind_c: "수매가대로 넘기자고 하고, 선우진 일로 돌아간다.",
    c21_branch_rind_follow_a: "고은비 옆에서, 열네 장을 끝까지 소리 내어 같이 읽는다.",
    c21_branch_rind_follow_b: "9쪽 금리 조항을 빼 달라고 서면으로 요청하고, 서명은 미룬다.",
    c21_branch_rind_follow_c: "오늘은 별표만 하고, 금리는 나중에 다투자고 한다.",
    c21_breakwater_stay: "대답을 서두르지 않고, 그가 다 말할 때까지 곁에 앉아 있는다.",
    c21_breakwater_match: "그가 말한 날짜들을, 주간표와 하나씩 맞춰 적어 둔다.",
    c21_breakwater_admit: "휴가가 아니라고 짧게 인정하고, 이야기는 내일 아침으로 미룬다.",
    c21_final_tell: "주간표와 방명록 문장을 보여 주고, 5년 전 일을 그대로 알린다.",
    c21_final_secure: "알리기 전에, 1기 원본부터 보존 요청으로 묶어 둔다.",
    c21_final_ask: "무엇을 말하기 전에, 그가 알고 싶은지부터 묻는다.",
    c21_after_warm: "마지막 비행기 시간까지, 느린섬에 남아 귤 상자를 같이 싼다.",
    c21_after_record: "1기 참가자가 자기 기록을 볼 수 있게, 열람 청구 안내문을 문서로 만든다.",
    c21_after_rush: "귤 상자를 든 채 첫 비행기로 올라가, 노아의 심사를 들여다본다.",
    c21_route_system_disclose: "노아의 설명 화면을, 류세아와 동의 심사 쪽에 그대로 공유한다.",
    c21_route_system_exclude: "1기 묶음을 빼고, 정확도 14%를 감수하자고 요구한다.",
    c21_route_system_close: "유사도 91%는 못 본 것으로 하고, 화면을 닫는다.",
    c21_final_system_route_a: "1기 기록마다, 처음 쓴 사람의 이름 칸을 되살려 붙인다.",
    c21_final_system_route_b: "기록은 그대로 두고, 감사금만 올려 다시 보낸다.",
    c21_final_system_route_c: "동의하지 않은 참가자를 위해, 기록 삭제 창구를 따로 만든다.",
    c21_evidence_turn_reopen: "산업재해 재심사를 선우진 이름으로 낼 수 있게, 서류를 갖춘다.",
    c21_evidence_turn_hold: "명세서는 알고만 있다가, 봉인 구역이 열릴 때 함께 꺼낸다.",
    c21_evidence_turn_share: "1기의 다른 세 사람에게도, 이 명세서가 있다는 것부터 알린다.",
  },
  echoReplies: {
    // CASE 21.
    c21_start_visit: "직접 가면 그의 얼굴을 봅니다. 얼굴을 본 뒤에는 서류로만 말하기가 어려워집니다.",
    c21_start_origin: "원본을 찾으면 주간표 한 장이 나옵니다. 나머지는 봉인 구역에 있고, 그 문 앞에서 하루가 갑니다.",
    c21_start_call: "전화는 빠릅니다. 수화기 너머의 느린 목소리가 '무슨 일이세요'라고 묻고, 당신은 대답할 문장을 아직 준비하지 못했습니다.",
    c21_inn_truth: "밝히면 선우진이 잠깐 웃음을 멈춥니다. 그리고 가장 볕이 잘 드는 방 열쇠를 내줍니다.",
    c21_inn_postmark: "적어 두면 발신 부서가 보입니다. KD데이터랩 법무팀, 담당자 칸은 비어 있습니다.",
    c21_inn_guest: "방값을 내면 당신은 손님이 됩니다. 손님에게는 아무도 왜 왔는지 묻지 않고, 그래서 말할 때를 놓칩니다.",
    c21_orchard_stay: "끝까지 따면 고은비가 처음으로 귤 한 알을 까서 건넵니다. 그날 선우진과 단둘이 앉을 시간은 없습니다.",
    c21_orchard_terms: "조건을 확인하면 '범위는 회사가 정한다'는 줄이 나옵니다. 고은비는 대답을 듣기 전에 가위를 다시 듭니다.",
    c21_orchard_hire: "일당을 말하는 순간 고은비의 표정이 굳습니다. 돈으로 사는 손은 이 밭에서 제일 싼 손입니다.",
    c21_branch_rind_a: "귤피차가 되면 2톤은 버릴 귤이 아닙니다. 말리고 썰고 포장하는 데 사흘이 듭니다.",
    c21_branch_rind_b: "조건을 보면 연장은 됩니다. 대신 서류가 열네 장이고, 할아버지가 들은 말을 고은비도 듣게 됩니다.",
    c21_branch_rind_c: "수매가대로면 2톤은 60만 원입니다. 고은비는 계산을 끝낸 얼굴로 창고 문을 닫습니다.",
    c21_branch_rind_follow_a: "소리 내어 읽으면 창구 뒤에 줄이 섭니다. 9쪽에서 고은비가 읽기를 멈추고 직원을 봅니다.",
    c21_branch_rind_follow_b: "서면 요청은 남습니다. 만기까지 한 달, 고은비는 그 한 달을 기다려야 합니다.",
    c21_branch_rind_follow_c: "별표를 치면 오늘 일은 끝납니다. 9쪽의 1.8%포인트는 3월부터 매달 옵니다.",
    c21_breakwater_stay: "곁에 있으면 그가 한 번 더 말을 잇습니다. 아버지 이야기가 하나 더 나오고, 등대 불이 열 번 더 돕니다.",
    c21_breakwater_match: "날짜는 맞아떨어집니다. 그의 가장 나쁜 여름이 표 한 장에 칸칸이 들어가 있습니다.",
    c21_breakwater_admit: "인정하면 그가 고개를 끄덕입니다. '내일 아침에요.' 그는 그날 밤 잠을 자지 못합니다.",
    c21_final_tell: "알리면 그는 주간표를 오래 봅니다. '약해서가 아니었네요.' 그리고 한참 뒤에 묻습니다. '나머지 기록은 어디 있어요?'",
    c21_final_secure: "보존 요청은 기록을 지킵니다. 우체국 마감이 지나고, 그는 자기에게 무엇이 지켜졌는지 모른 채 저녁을 차립니다.",
    c21_final_ask: "물으면 그가 창밖의 귤밭을 봅니다. 대답이 나오기까지 우체국 마감 시간이 지나갑니다. 그 사이 원본은 봉인 구역에 그대로 있습니다.",
    c21_after_warm: "남으면 귤 상자 여섯 개가 테이프로 봉해집니다. 서울의 노아는 그날 밤도 1기의 문장으로 선택지를 만듭니다.",
    c21_after_record: "안내문이 생기면 1기의 다른 세 사람도 자기 기록을 볼 수 있습니다. 선우진은 그 문서에 '천천히 읽겠습니다'라고 답합니다.",
    c21_after_rush: "먼저 올라가면 노아의 첫 심사 목록에 끝까지정밀이 보입니다. 공항까지 배웅 나온 사람은 꼭지뿐입니다.",
    c21_route_system_disclose: "공유하면 류세아가 설명 화면을 캡처해 동의 심사 안건으로 올립니다. 노아는 자기 약점을 처음으로 스스로 보여 준 셈입니다.",
    c21_route_system_exclude: "빼면 노아가 덜 정확해집니다. 정확도 14%만큼의 오답이 누구 앞으로 갈지는 아직 모릅니다.",
    c21_route_system_close: "화면을 닫아도 유사도는 남습니다. 당신의 다음 문장도 그 1만 2천 건 옆에 쌓입니다.",
    c21_final_system_route_a: "이름 칸이 되살아나면 보기 문장 #0001 옆에 '선우진'이 적힙니다. 그가 원하는지는 아직 아무도 묻지 않았습니다.",
    c21_final_system_route_b: "감사금이 오르면 서명하는 사람도 늘어납니다. 무엇에 서명하는지 아는 사람은 늘지 않습니다.",
    c21_final_system_route_c: "삭제 창구가 생기면 기록은 주인의 것이 됩니다. 노아의 정확도는 그 창구를 연 날부터 조금씩 떨어집니다.",
    c21_evidence_turn_reopen: "서류를 갖추면 5년 전 '개인 사정'이 다시 심사대에 오릅니다. 선우진이 원하는지는 서류 맨 앞 칸에 적혀야 합니다.",
    c21_evidence_turn_hold: "알고만 있으면 명세서는 안전합니다. 1기의 다른 세 사람도 그만큼 오래 모릅니다.",
    c21_evidence_turn_share: "알리면 세 사람 중 한 명이 바로 전화를 겁니다. '저도 그해 여름에 쓰러졌어요.'",
  },
  characterProfiles: {
    선우진: {
      role: "트리거랩 1기 분석관 출신 · 제주 구좌 게스트하우스 '느린섬' 주인",
      stance: "느림 · 회복 · 모르는 채로 사는 평화",
      job: "당신보다 먼저 실험을 통과한 사람. 자기 반응이 자료였다는 걸 모른 채, 무너진 이유를 자기 탓으로 알고 산다.",
      appearance: "귤 물이 든 손톱, 무릎이 나온 작업 바지, 계산대 위에 귤로 눌러 둔 뜯지 않은 봉투.",
      thought: "그때 나는 약해서 무너졌다. 그러니 여기서는 급하지 않게, 꼭지가 상하지 않게 산다.",
      gesture: "선우진은 대답하기 전에 귤을 하나 집어 천천히 깐다. 껍질이 한 줄로 이어지면 말을 시작한다.",
      voice: "한 단어씩 말하고, 말 사이에 오래 쉰다. 쉬는 동안 상대가 서두르지 않기를 기다린다.",
      line: "여기선 급한 게 없어서요. 그 편지도 아직 안 뜯었어요.",
    },
    고은비: {
      role: "제주 구좌 3대째 감귤 농장 주인 · 선우진의 이웃",
      stance: "생계 · 불신 · 이웃",
      job: "은행이 돈과 함께 건네는 종이가 어떤 값을 치르게 하는지, 농사짓는 사람의 자리에서 먼저 알아본다.",
      appearance: "귤 가위가 꽂힌 앞치마 주머니, 트럭 열쇠에 매단 할아버지의 도장, 햇볕에 그을린 팔목의 고무줄.",
      thought: "은행은 꼭 돈 줄 때 종이를 같이 준다. 할아버지는 그 종이를 다 읽지 않았고, 밭 반을 팔았다.",
      gesture: "고은비는 화가 나면 가위를 멈추고, 마음을 정하면 다시 가위질을 시작한다.",
      voice: "짧고 무뚝뚝하게 말하지만, 사람을 쫓아낸 뒤에는 귤 한 알을 꼭 쥐여 보낸다.",
      line: "그럼 따지 마세요.",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "2월 초 · 노아 가동 D-6" },
  sceneContext: {
    c21_start: {
      place: "트리거랩 4층 분석관실",
      clock: "2월 초 · 노아 가동 D-6",
      question: "노아의 학습 목록 맨 아래 줄에 동의서 없는 첫 번째 참가자가 있습니다. 무엇부터 하겠습니까?",
      lead: "노아 가동을 엿새 앞두고, 이민서가 목록의 스크롤을 끝까지 내린 채 당신 자리로 옵니다.",
    },
    c21_start_warm: {
      place: "트리거랩 4층 분석관실",
      clock: "2월 초 · 노아 가동 D-6",
      question: "송별회 날 약속한 여행이 제주행이 됐습니다. 여섯 명이 함께 어떻게 가겠습니까?",
      lead: "송별회 다음 날에도 탕비실에는 여섯 명의 컵이 나란히 엎어져 있습니다.",
    },
    c21_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "2월 초 · 노아 가동 D-6",
      question: "당신이 남긴 부록이 법무팀에 빈칸을 먼저 알려 줬습니다. 그 빈칸의 주인에게 어떻게 가겠습니까?",
      lead: "에코의 기록을 문서로 남긴 다음 날, 류세아의 전화가 부록 맨 아래 줄 이야기로 시작됩니다.",
    },
    c21_start_rush: {
      place: "트리거랩 4층 분석관실",
      clock: "2월 초 · 노아 가동 D-6",
      question: "목록을 먼저 연 사이 법무팀이 먼저 움직였습니다. 비어 버린 4층에서 누구와 가겠습니까?",
      lead: "송별 케이크가 치워진 책상 위에, 당신이 밤새 내려받은 목록만 남아 있습니다.",
    },
    c21_inn: {
      place: "제주 구좌 느린섬 · 귤 창고 게스트하우스",
      clock: "2월 7일 · 노아 가동 D-3",
      question: "첫 번째 참가자가 귤피차를 따르며 뜯지 않은 봉투를 가리킵니다. 자신을 어떻게 소개하겠습니까?",
      lead: "구좌 바닷가 마을 끝, 돌담 너머 귤 창고 지붕에 파란 방수포가 덮여 있습니다.",
    },
    c21_guestbook: {
      place: "제주 구좌 느린섬 · 귤 창고 거실",
      clock: "2월 7일 · 23:00",
      question: "그의 방명록 답글이 트리거랩 보기 문장 #0001과 같습니다. 이 방명록을 어떻게 하겠습니까?",
    },
    c21_guestbook_reaction: {
      place: "제주 구좌 느린섬 · 귤 창고 다락방",
      clock: "2월 8일 · 00:20",
      question: "등록자 칸이 빈 문장 31개로 노아가 지금도 선택지를 만듭니다. 이 문장들을 어떻게 하겠습니까?",
    },
    c21_orchard: {
      place: "제주 구좌 고은비 감귤밭 · 과수원",
      clock: "2월 8일 · 한파 예보 당일",
      question: "한파 전 귤 3톤을 따는 사이, 그 편지가 좋은 돈이냐는 질문이 나왔습니다. 무엇이라 하겠습니까?",
      lead: "트럭 짐칸의 빈 컨테이너 마흔 개가 감귤밭 입구에 내려집니다. 가위가 여섯 개 모자랍니다.",
    },
    c21_branch_rind: {
      place: "제주 구좌 고은비 농장 · 귤 창고",
      clock: "2월 8일 · 15시",
      question: "제값을 못 받는 귤 2톤과 3월 만기 대출이 한 창고에 있습니다. 이 창고를 어떻게 하겠습니까?",
    },
    c21_branch_rind_follow: {
      place: "구좌 농협 · 대출 창구",
      clock: "2월 8일 · 16시",
      question: "별표 없는 9쪽에 금리 인상 조항이 있습니다. 열네 장의 연장 신청서를 어떻게 하겠습니까?",
    },
    c21_storehouse: {
      place: "제주 구좌 느린섬 · 귤 창고 계산대",
      clock: "2월 8일 · 한파 · 21:40",
      question: "주간표 여백에 '압박 강도 조정 +2단계'가 적혀 있습니다. 이 한 장을 어떻게 하겠습니까?",
    },
    c21_storehouse_reaction: {
      place: "제주 구좌 느린섬 · 감귤밭 돌담 앞",
      clock: "2월 8일 · 한파 · 23:10",
      question: "한서윤이 그 메모가 33층 서식이라고 말합니다. 더 묻겠습니까, 기다리겠습니까?",
    },
    c21_breakwater: {
      place: "제주 구좌 바닷가 · 방파제",
      clock: "2월 8일 · 한파 · 23:50",
      question: "그는 자기가 약해서 무너진 줄 알았다고 말하고, 휴가 온 게 아니지 않냐고 묻습니다. 어떻게 답하겠습니까?",
      lead: "한파가 온 밤, 등대 불빛이 도는 방파제 끝에서 손전등 하나가 당신을 기다립니다.",
    },
    c21_letter: {
      place: "제주 구좌 느린섬 · 귤 창고 계산대",
      clock: "2월 9일 · 오전 9시",
      question: "지붕 고칠 돈이라며 그가 동의서 앞에서 펜 뚜껑을 엽니다. 어떻게 하겠습니까?",
    },
    c21_letter_reaction: {
      place: "제주 구좌 느린섬 · 귤 창고 앞 마당",
      clock: "2월 9일 · 오전 11시",
      question: "범위를 회사가 정하면 무엇을 허락하는지도 모르고 허락한다고 고은비가 말합니다. 어떻게 답하겠습니까?",
    },
    c21_route_system: {
      place: "제주 구좌 느린섬 · 귤 창고 원격 단말",
      clock: "2월 8일 · 노아 가동 D-2",
      question: "당신의 문장이 참가자 01의 문장과 91% 닮았다고 노아가 말합니다. 이 설명을 어떻게 하겠습니까?",
    },
    c21_final_system_route: {
      place: "제주 구좌 느린섬 · 귤 창고 원격 단말",
      clock: "2월 9일 · 새벽",
      question: "1기의 문장으로 배운 엔진을 고칠 수 있다면, 무엇부터 고치겠습니까?",
    },
    c21_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 1기 서가",
      clock: "2월 9일 · 14시",
      question: "실험 주문서에도, 산업재해 의견서에도 이름이 없습니다. 이 명세서를 어떻게 쓰겠습니까?",
    },
    c21_final: {
      place: "제주 구좌 느린섬 · 귤 창고",
      clock: "2월 9일 · 등기 마감 17시",
      question: "그는 자기가 모르는 게 있다는 걸 압니다. 우체국 마감 한 시간 전, 무엇을 하겠습니까?",
      lead: "선우진이 서명하지 않은 동의서를 계산대에 올려 두고, 처음으로 당신보다 먼저 자리에 앉아 있습니다.",
    },
    c21_aftershock: {
      place: "제주 구좌 느린섬 · 귤 창고 앞 마당",
      clock: "2월 9일 · 저녁 · 눈발",
      question: "눈발 속에 귤 상자가 건네지고 끝까지정밀의 대출이 노아에게 갔습니다. 제주의 마지막 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c21-first-sheet",
    title: "참가자 01의 주간표",
    text: "2022년 7월 둘째 주, 반응이 둔해진 참가자 01에게 압박 강도를 두 단계 올리고 부친 입원 휴가를 반려하라는 메모가 있었습니다. 실험의 발주 부서는 그룹전략실이었고, 결과물은 '인사 참고 자료'였습니다.",
  },
  outcomes: {
    c21_after_warm: { tag: "귤을 싼 결말", title: "마지막 비행기 시간까지 느린섬에 남았다", text: "여섯 명은 귤 상자를 싸고 방명록에 한 줄씩 남겼습니다. 선우진은 모든 글 아래 답글을 달겠다고, 천천히 달겠다고 했습니다." },
    c21_after_record: { tag: "기록을 돌려줄 길을 낸 결말", title: "1기 참가자가 자기 기록을 볼 수 있는 안내문이 생겼다", text: "열람 청구 안내문이 1기 네 명에게 발송됐습니다. 동의서 없이 쓰인 기록에, 처음으로 주인이 찾아갈 길이 생겼습니다." },
    c21_after_rush: { tag: "먼저 올라간 결말", title: "귤 상자를 든 채 노아의 심사 목록으로 갔다", text: "당신은 첫 비행기로 올라가 노아의 첫 심사 목록을 열었습니다. 공항까지 배웅 나온 것은 꼭지 한 마리였습니다." },
  },
  carryovers: {
    c21_after_warm: { trust: 10, humanCost: -4, fatigue: -8 },
    c21_after_record: { legitimacy: 11, trust: 3, fatigue: 5 },
    c21_after_rush: { capital: 7, legitimacy: 3, trust: -8 },
  },
  continuityChallenges: {
    c20_after_warm: { id: "protect-trust", title: "송별회의 여섯 명과 같이 가기", text: "에코를 보낸 밤 여섯 명은 흩어지지 않았습니다. 첫 번째 참가자 앞에 혼자가 아니라 여럿이 서는 선택을 찾아야 보너스가 열립니다." },
    c20_after_record: { id: "use-reframe", title: "빈칸을 알려 준 내 문서 되찾기", text: "당신이 남긴 부록이 법무팀에 빈칸을 먼저 알려 줬습니다. 그 문서가 누구를 위한 것인지 판을 다시 짜야 합니다." },
    c20_after_rush: { id: "repair-legitimacy", title: "먼저 연 목록의 공정함 회복하기", text: "먼저 내려받은 목록이 법무팀을 서두르게 했습니다. 첫 번째 참가자에게 그 순서를 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
