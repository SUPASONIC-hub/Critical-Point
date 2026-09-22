/**
 * CASE 14 -- the good fund.
 *
 * Act three opens on the group's first "reform" product. Three weeks after the
 * innovation committee's face goes up on billboards, KD자산운용 launches a
 * '상생' fund and sells it at KD은행 counters to retirees whose deposits have
 * just matured. What it buys is the group's bad loans and the last slices of the
 * 플로우온 loan, at 92 won on the hundred while the market pays 41. The loss the
 * group should book walks out of the branch in the savings of 3,146 people whose
 * average age is 71. The chain repeats with a friendlier name.
 *
 * It is 도윤하's case. The sales script carries a sentence she used at the same
 * counter three years ago, and the widow now signing the fund is the wife of a
 * man she sold a 플로우온-linked product to; he died the winter after. The fund's
 * designer, 주은채, is not a villain: she built it for pension funds that can
 * wait five years, and the group moved it to the counter without asking. The
 * range runs from 강태민 playing a seventy-three-year-old mystery shopper who
 * memorised the question sheet too well, through a sales bonus table weighted
 * for customers over seventy, to a retired teacher, 이정숙, taking the chalk
 * from a bank instructor and writing "모르면 사인하지 마세요". The case closes on
 * the first morning of the second sale, and its last beat hands the next case
 * to 이민서.
 */
export const case14Nodes = {
  c14_start: {
    phase: "CASE 14 BRIEFING",
    title: "은행이 망하지 않는 한",
    speaker: "도윤하",
    text:
      "10월 마지막 주, KD은행 창구 대기 화면마다 초록색 광고가 돕니다. '은퇴 후에도 착하게, 상생 ESG(환경·사회·회사 운영의 투명성을 따지는 투자) 펀드.' 3주 만에 1,070억이 팔렸고 가입자 평균 나이는 71세입니다. 설명서 맨 뒤 부록에 이 펀드가 사들이는 것이 적혀 있습니다. 그룹 계열사(같은 그룹에 속한 다른 회사)의 부실채권(돌려받기 어려워진 대출) 38건, 그리고 플로우온 대출의 남은 조각. 도윤하가 강서지점 동기에게 받은 판매 대본을 내려놓고 둘째 장의 한 줄을 손톱으로 짚습니다. '은행이 망하지 않는 한 걱정 안 하셔도 돼요.' 그가 대본을 뒤집습니다. '이거 제 문장이에요. 3년 전에 제가 창구에서 쓰던 말이요. 불완전판매(위험을 제대로 설명하지 않고 파는 것)를, 이번엔 제 말투로 하고 있네요.'",
    memo: [
      "상생 ESG 펀드 1차 판매 1,070억 -- 가입자 3,146명",
      "가입자 평균 나이 71세, 판매처는 KD은행 창구",
      "편입 자산: 그룹 부실채권 38건 + 플로우온 대출 남은 조각",
      "판매 대본 둘째 장: 3년 전 도윤하의 문장",
    ],
    triggers: ["injustice", "responsibility", "selfAwareness"],
    choices: [
      {
        id: "c14_start_shop",
        label: "손님인 척 강서지점 창구에 가서 판매 현장을 직접 본다",
        effect: { trust: 11, humanCost: -5, time: -6, capital: -3, fatigue: 5 },
        next: "c14_counter",
        cognition: { persistence: 2 },
      },
      {
        id: "c14_start_compare",
        label: "판매 대본과 펀드 설명서를 한 줄씩 맞대어 읽는다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c14_counter",
        cognition: { inference: 2 },
      },
      {
        id: "c14_start_trace",
        label: "판매는 두고 펀드가 사들인 채권 목록부터 뽑는다",
        effect: { capital: 9, time: 6, legitimacy: -5, trust: -3, humanCost: 3, fatigue: 1 },
        next: "c14_counter",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c14_counter",
      },
    ],
  },
  c14_counter: {
    phase: "MYSTERY SHOPPER",
    title: "너무 똑똑한 할아버지",
    speaker: "오진우",
    text:
      "강서지점 객장, 오전 10시 40분. 번호표 51번을 쥔 강태민이 백발 가발에 지팡이를 짚고 앉아 있습니다. 미스터리 쇼퍼(손님인 척 판매 과정을 점검하는 사람)로 온 '은퇴한 일흔셋'입니다. 아들 역의 오진우는 옆에서 '아버지, 천천히요'를 연습합니다. 문제는 강태민이 질문지를 밤새 외워 왔다는 겁니다. 창구에 앉자마자 그가 묻습니다. '환매(펀드를 팔아 돈을 돌려받는 것)가 3년 막혀 있던데, 편입 자산 중 후순위(돈을 돌려받는 순서가 뒤인 것) 비중은 얼마요?' 신입 행원의 볼펜이 멈춥니다. 오진우가 속삭입니다. '형님, 일흔셋은 그런 거 안 물어요.' 그때 옆 창구에서 조용한 목소리가 들립니다. '천천히 다시 말해 주세요. 받아 적을게요.' 흰 블라우스의 할머니가 공책에 또박또박 씁니다. '원금은, 은행이, 지킨다.'",
    memo: [
      "점검 대상: 강서지점 4번·5번 창구",
      "강태민 배역: 은퇴한 73세 '강 선생' -- 질문 22문항 암기",
      "옆 창구 고객 이정숙(72) -- 가입 금액 2,400만 원",
      "창구 설명 중 환매 제한 3년은 한 번도 나오지 않음",
    ],
    triggers: ["protection", "injustice", "curiosity"],
    choices: [
      {
        id: "c14_counter_stop",
        label: "옆 창구로 건너가 이정숙에게 서명을 잠시 멈춰 달라고 한다",
        effect: { trust: 13, legitimacy: -3, humanCost: -5, time: -4, fatigue: 6 },
        next: "c14_desk",
        cognition: { persistence: 2 },
      },
      {
        id: "c14_counter_report",
        label: "점검표에 빠진 설명 항목을 적어 지점장에게 정식으로 낸다",
        effect: { legitimacy: 12, trust: -4, time: -6, humanCost: 3, fatigue: 4 },
        next: "c14_desk",
        cognition: { inference: 2 },
      },
      {
        id: "c14_counter_record",
        label: "정체를 숨긴 채 옆 창구의 설명을 끝까지 녹음해 둔다",
        effect: { capital: 6, time: 5, legitimacy: 4, trust: -3, humanCost: 4, fatigue: -2 },
        next: "c14_desk",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c14_desk",
      },
    ],
  },
  c14_desk: {
    phase: "TRADING ROOM",
    title: "착한 이름",
    speaker: "주은채",
    text:
      "판교 KD자산운용 운용실. 시세 화면 여섯 대 앞에서 주은채가 형광펜 세 자루를 번갈아 쥡니다. 그는 당신을 적으로 보지 않습니다. 오히려 반가워합니다. '이 펀드 제가 설계했어요. 부실채권을 싸게 사서 회사들이 숨 돌릴 시간을 주고, 5년 기다려서 돌려받는 구조예요. 회수율(빌려준 돈 중 실제로 돌려받는 비율)을 68%로 잡으면 연 4.8%가 나와요. 착한 돈이 착한 수익을 내는 거죠.' 모형을 넘기던 그가 두 번째 모니터를 켭니다. 은행 판매 현황판 옆에 처음 보는 표가 붙어 있습니다. KD은행 판매 성과급 표. 1억당 40만 원, 그리고 맨 아래 한 줄. '예금 만기 70세 이상 고객 전환 시 1.5배.' 주은채의 형광펜이 멈춥니다. '이건… 제가 만든 표가 아니에요.'",
    memo: [
      "설계 전제: 5년 보유, 회수율 68%, 연 4.8%",
      "원래 판매 대상: 연기금 등 5년을 기다릴 수 있는 기관",
      "판매 성과급: 1억당 40만 원, 70세 이상 전환 시 1.5배",
      "창구 대본: '필요하시면 언제든 찾으실 수 있어요'",
    ],
    triggers: ["injustice", "manipulation", "system"],
    choices: [
      {
        id: "c14_desk_play",
        label: "창구에서 녹음한 설명을 주은채에게 들려주고 함께 멈추자고 한다",
        effect: { trust: 12, legitimacy: 6, capital: -5, time: -7, fatigue: 5 },
        next: "c14_class",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c14_desk_gap",
        label: "설계 문서와 판매 대본이 어긋나는 대목을 표로 정리한다",
        effect: { legitimacy: 11, trust: 6, time: -6, humanCost: -3, fatigue: 5 },
        next: "c14_class",
        cognition: { inference: 2 },
      },
      {
        id: "c14_desk_model",
        label: "주은채의 모형 파일만 받아 사들인 채권의 출처를 쫓는다",
        effect: { capital: 8, time: 5, trust: -2, humanCost: 3, legitimacy: -1, fatigue: 2 },
        next: "c14_class",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c14_class",
      },
    ],
  },
  c14_class: {
    phase: "FINANCE CLASS",
    title: "모르면 사인하지 마세요",
    speaker: "이정숙",
    text:
      "강서 노인복지관 3층, '행복한 노후 금융 교실'. 강사는 강서지점 PB(큰돈을 맡긴 고객을 따로 관리하는 직원)이고, 교실 뒤 탁자에는 가입 신청서가 여든 장 쌓여 있습니다. 교실이 아니라 판매 설명회입니다. 강사가 '은행이 망하지 않는 한'을 꺼내려는 순간, 둘째 줄의 이정숙이 손을 듭니다. 그가 공책을 펴고 지난주 창구에서 받아 적은 문장을 읽습니다. '언제든 찾을 수 있다. 그런데 설명서에는 3년 동안 못 찾는다고 돼 있어요. 둘 중 뭐가 틀렸어요?' 강사가 대답하지 못하자 이정숙이 앞으로 걸어 나가 분필을 집습니다. 38년 동안 칠판 앞에 선 손입니다. 그가 큼직하게 씁니다. '모르면 사인하지 마세요.' 교실 여기저기서 신청서를 접는 소리가 납니다. 강사가 당신을 봅니다.",
    memo: [
      "금융 교실 참석 62명 -- 뒤편 가입 신청서 80장",
      "강사: 강서지점 PB, 교실 한 번에 판매 목표 5억",
      "이정숙: 초등학교 교사 38년, 빨간 색연필로 채점",
      "이정숙의 가입 취소 기한: 2차 판매 당일 18시",
    ],
    triggers: ["affection", "trust", "recognition"],
    choices: [
      {
        id: "c14_class_read",
        label: "이정숙과 함께 어르신들 가입서를 한 장씩 같이 읽는다",
        effect: { trust: 13, humanCost: -6, time: -4, legitimacy: -2, fatigue: 7 },
        next: "c14_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c14_class_notice",
        label: "이미 가입한 어르신들에게 취소 방법을 서면으로 안내한다",
        effect: { legitimacy: 10, trust: 4, time: -4, humanCost: 3, fatigue: 4 },
        next: "c14_final",
        cognition: { inference: 2 },
      },
      {
        id: "c14_class_leave",
        label: "교실은 이정숙에게 맡기고 판교로 돌아가 돈의 흐름을 쫓는다",
        effect: { capital: 8, time: 5, trust: -3, humanCost: 3, fatigue: -2 },
        next: "c14_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c14_final",
      },
    ],
  },
  c14_final: {
    phase: "FINAL DECISION",
    title: "2차 판매 첫날",
    speaker: "도윤하",
    text:
      "월요일 오전 8시 50분, 강서지점 객장. 셔터가 오르기 10분 전입니다. 오늘부터 상생 펀드 2차 판매 1,500억이 시작되고, 번호표 기계 옆에 초록색 입간판이 새로 섰습니다. 창구마다 새 대본이 놓였지만 둘째 장의 그 문장은 그대로입니다. 판교의 주은채에게서 문자가 옵니다. '2차 모집 승인란에 제 서명만 남았어요. 9시까지요.' 유리문 밖에는 벌써 어르신들이 줄을 섰고, 맨 앞에 이정숙이 공책을 들고 서 있습니다. 오늘 18시가 그의 청약 철회(가입하고 7일 안에는 계약을 되돌릴 수 있는 권리) 마감입니다. 도윤하가 4번 창구 의자를 한 번 쓰다듬고 당신을 봅니다. '3년 전엔 여기 앉아서 그 문장을 말했어요. 오늘은 뭐라고 말할까요?'",
    memo: [
      "2차 판매 목표 1,500억 -- 오늘 09시 시작",
      "2차 모집 승인란: 주은채 서명만 남음",
      "이정숙 청약 철회 마감 오늘 18시",
      "이 선택은 그룹이 손실을 옮기는 다음 방식을 정함",
    ],
    triggers: ["choice", "responsibility", "protection"],
    choices: [
      {
        id: "c14_final_halt",
        label: "셔터가 오르기 전에 판매를 공개적으로 멈추라고 요구한다",
        effect: { trust: 12, humanCost: -6, legitimacy: 4, capital: -7, time: -6, fatigue: 6 },
        next: "case14_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c14_final_fix",
        label: "설명서와 판매 절차를 고치기 전엔 2차 판매를 열지 않게 한다",
        effect: { legitimacy: 13, trust: 5, capital: -6, time: -6, humanCost: 3, fatigue: 5 },
        next: "case14_result",
        cognition: { inference: 2 },
      },
      {
        id: "c14_final_trace",
        label: "판매는 그대로 두고 1,500억이 어디로 흘러가는지 추적한다",
        effect: { capital: 10, time: 6, legitimacy: 3, trust: -5, humanCost: 4, fatigue: 2 },
        next: "case14_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case14_result",
      },
    ],
  },
};

/**
 * Everything else case 14 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case14 = {
  id: "case14",
  nodes: case14Nodes,
  aftermath: {
    c14_aftershock: {
      phase: "AFTERMATH",
      title: "칠판 사진",
      speaker: "이정숙",
      text: "마감 한 시간 전, 이정숙이 4번 창구에서 철회 신청서를 냅니다. 도윤하가 칸을 하나씩 읽어 주고, 이정숙은 그 속도를 따라 받아 적습니다. 서명을 마친 그가 휴대폰을 내밉니다. 손자 장윤재가 보낸 사진입니다. 복지관 칠판의 '모르면 사인하지 마세요'가 학교 단체방에서 돌고 있다고 합니다. '우리 할머니 유명해짐.' 강태민이 백발 가발을 기념으로 건네자 이정숙이 정중하게 거절합니다. '나는 진짜가 있어요.' 모두가 웃는 사이 이민서에게서 메시지가 옵니다. '인사부에서 연락이 왔어요. 정규직 전환이요. 근데 조건이 하나 있대요.'",
      memo: ["이정숙 청약 철회 접수 -- 2,400만 원 돌려받을 예정", "칠판 사진, 손자 학교 단체방에서 공유", "가입자 단체방 40명 → 186명", "이민서: 정규직 전환 제안, 조건 하나"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c14_after_warm", label: "오늘은 이정숙과 가입자 모임 저녁 자리에 끝까지 남는다", effect: { trust: 12, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case14_result", cognition: { reframing: 2 } },
        { id: "c14_after_record", label: "그 문장을 지우는 창구 판매 기준 개정안부터 문서로 남긴다", effect: { legitimacy: 15, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case14_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c14_after_rush", label: "이민서의 메시지를 받자마자 곧장 인사부로 간다", effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 }, next: "case14_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c14_final", "c14_aftershock"],
  connectiveScenes: [
    ["c14_husband", "c14_counter", "c14_desk", "장현규, 1951년생", "도윤하", "오진우가 복사해 온 이정숙의 가입서에서 도윤하가 한 칸을 봅니다. 연락처 칸에 적었다 지운 이름 하나가 비칩니다. 장현규. 도윤하가 가방에서 3년 전 창구 수첩을 꺼내 넘기다 멈춥니다. '장현규 님, 퇴직금 1억 2천, 플로우온 연계 채권형 상품.' 그 옆에 자기 글씨로 적은 메모가 있습니다. '부인분이 선생님이셨다고. 손주 자랑 많이 하심.' 그 상품은 플로우온과 함께 반토막이 났고, 장현규는 이듬해 겨울 세상을 떠났습니다. 도윤하가 수첩을 덮지 못합니다. '같은 대출이 같은 집에 두 번 가요. 두 번 다 제 문장으로.'", ["장현규: 3년 전 도윤하 창구 고객, 퇴직금 1억 2천", "플로우온 연계 상품 손실 -- 이듬해 겨울 사망", "이정숙 가입 금액: 손자 장윤재 대학 등록금 4년치"], ["도윤하가 이정숙에게 3년 전 일을 털어놓도록 곁에 선다", "3년 전 판매 기록을 찾아 같은 대본이었는지 맞춰 본다", "3년 전 일은 뒤로 미루고 이번 펀드부터 막는다"]],
    ["c14_recovery", "c14_desk", "c14_class", "41%", "권도현", "주은채의 모형을 넘겨받은 권도현이 3초 만에 한 칸을 가리킵니다. '회수율 68%요? 브릿지은행이 작년에 산 플로우온 조각은 41%였습니다. 제가 샀으니까 압니다.' 그가 계산기를 두드립니다. '41을 넣으면 연 4.8%가 아니라 원금의 22%가 사라집니다. 이 가격이면 적자입니다. 고객이요.' 오진우가 '판매사는요?' 하고 묻자 계산기를 한 번 더 두드립니다. '판매사는 흑자입니다. 이런 흑자는 제 장부에 적기 싫습니다.' 주은채가 모형에 41을 직접 쳐 넣습니다. 기준가(펀드 한 좌의 가격) 그래프가 화면 아래로 꺾입니다.", ["주은채 모형의 회수율 68%", "브릿지은행 실제 매입 회수율 41%", "41% 적용 시 원금 22% 손실 추정"], ["주은채와 41%로 다시 돌린 모형을 가입자 기준으로 풀어 쓴다", "회수율 가정의 근거 자료를 운용사에 공식 요청한다", "권도현의 계산서만 챙겨 들고 다음 판으로 간다"]],
    ["c14_grade", "c14_class", "c14_final", "받아쓰기 100점", "강태민", "교실이 끝나자 강태민이 이정숙에게 다가가 가발을 벗습니다. '어머님, 저 사실 일흔셋 아닙니다.' 이정숙이 안경을 내리고 그를 봅니다. '알았어요. 일흔셋은 무릎이 그렇게 안 굽혀져요.' 그가 강태민의 질문지를 받아 빨간 색연필로 채점합니다. 스물두 문항 전부 동그라미입니다. '받아쓰기는 100점인데 표정이 빵점이에요.' 모두가 웃는 사이 이정숙이 공책 맨 뒷장을 보여 줍니다. 가입자 단체방에서 받아 적은 이름 마흔 개입니다. '다들 나처럼 창구에서 적어 놨대요. 근데 그걸 어디에 내야 하는지를 몰라요.'", ["강태민 질문지 22문항 -- 전부 정답", "가입자 단체방에서 모은 이름 40명", "모두 창구 설명을 받아 적어 둔 사람들"], ["마흔 명의 공책을 모아 가입자들과 함께 들고 간다", "공책마다 날짜와 창구 번호를 붙여 민원 자료로 묶는다", "공책은 이정숙에게 맡기고 판매 중단 요구에만 집중한다"]],
  ],
  connectiveOrder: [["c14_counter", "c14_husband"], ["c14_desk", "c14_recovery"], ["c14_class", "c14_grade"]],
  choiceEffects: {
    c14_counter: [
      { trust: 12, legitimacy: 4, humanCost: -5, time: -6, capital: -2, fatigue: 5 },
      { legitimacy: 7, trust: 3, time: -4, humanCost: 4, fatigue: 3 },
      { time: 6, capital: 5, trust: -4, humanCost: 4, fatigue: -3 },
    ],
    c14_desk: [
      { trust: 11, legitimacy: 4, humanCost: -5, capital: -4, time: -4, fatigue: 4 },
      { legitimacy: 8, humanCost: 3, capital: -3, time: -4, fatigue: 2 },
      { time: 5, capital: 5, trust: -4, humanCost: 3, fatigue: -4 },
    ],
    c14_class: [
      { trust: 11, humanCost: -5, capital: -3, time: -5, fatigue: 4 },
      { legitimacy: 10, trust: 4, humanCost: 3, time: -3, fatigue: 4 },
      { time: 5, capital: 4, legitimacy: 3, trust: 3, humanCost: 2, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c14_counter: {
      voice: ["도윤하가 이정숙에게, 3년 전 일을 털어놓도록 곁에 선다.", "3년 전 판매 기록을 찾아, 같은 대본이었는지 맞춰 본다.", "3년 전 일은 뒤로 미루고, 이번 펀드부터 막자고 한다."],
      echo: ["곁에 서면 도윤하가 첫 문장을 세 번 고쳐 씁니다. 네 번째에는 그냥 이름을 부르기로 합니다.", "기록을 찾으면 3년 전 대본과 지금 대본이 한 글자도 다르지 않습니다. 쓴 사람만 바뀌었습니다.", "미루면 도윤하는 고개를 끄덕입니다. 그날 밤 수첩의 그 장을 접어 둡니다."],
    },
    c14_desk: {
      voice: ["주은채와 41%로 다시 돌린 모형을, 가입자 기준으로 풀어 쓴다.", "회수율 가정의 근거 자료를, 운용사에 공식 요청한다.", "권도현의 계산서만 챙겨 들고, 다음 판으로 간다."],
      echo: ["풀어 쓰면 '연 4.8%'가 '2,400만 원 중 528만 원'이 됩니다. 주은채가 그 숫자를 소리 내어 읽지 못합니다.", "요청은 접수됩니다. 답변 기한은 2차 판매가 시작되고 사흘 뒤입니다.", "계산서는 정확합니다. 주은채는 혼자 운용실에 남아 41을 지웠다 다시 씁니다."],
    },
    c14_class: {
      voice: ["마흔 명의 공책을 모아, 가입자들과 함께 들고 간다.", "공책마다 날짜와 창구 번호를 붙여, 민원 자료로 묶는다.", "공책은 이정숙에게 맡기고, 판매 중단 요구에만 집중한다."],
      echo: ["함께 들고 가면 마흔 권의 공책이 한 가방에 들어가지 않습니다. 강태민이 장바구니 두 개를 빌려 옵니다.", "묶인 공책은 증거가 됩니다. 증거가 되는 동안 공책 주인들은 서류 칸을 스무 개씩 채웁니다.", "맡기면 이정숙은 공책을 한 권씩 돌려줍니다. 어디에 내야 하는지는 여전히 아무도 모릅니다."],
    },
  },
  reactionScenes: [
    ["c14_husband_reaction", "c14_husband", "c14_desk", "친절한 아가씨", "이정숙", "복지관 앞 벤치에서 도윤하가 이정숙에게 수첩의 그 장을 펼쳐 보입니다. 이정숙은 한참 들여다보다가 빨간 색연필을 꺼내 도윤하의 옛 글씨 옆에 동그라미를 칩니다. '손주 자랑 많이 하심. 맞아요, 그 양반 그랬어요.' 그리고 공책을 덮습니다. '남편이 그랬어요. 창구 아가씨가 참 친절했다고. 그래서 더 믿었다고.' 도윤하가 고개를 숙입니다. 이정숙이 그 손을 잡습니다. '그러니까 이번엔 나한테 친절하지 말고, 정확하게 말해 줘요.'", ["이정숙에게 펀드가 사들인 채권을 있는 그대로 설명한다", "이정숙의 공책을 판매 과정의 증거로 써도 되는지 묻는다", "오늘은 사과만 전하고 설명은 다음 교실로 미룬다"]],
    ["c14_recovery_reaction", "c14_recovery", "c14_class", "제가 지은 이름", "주은채", "밤 11시, 운용실에 주은채만 남았습니다. 그가 식은 보리차를 마시며 말합니다. '원래는 연기금에 팔 상품이었어요. 5년 기다릴 수 있는 돈이요. 한 달 전에 그룹에서 창구로 내리자고 했어요. 저는 반대 안 했어요. 착한 펀드니까, 할머니들 돈도 착하게 불려 드릴 줄 알았어요.' 그가 모니터 속 펀드 이름을 봅니다. '상생이라는 이름, 제가 지었어요. 그 이름 덕분에 설명서에서 위험이라는 단어가 작아졌고요.'", ["주은채에게 2차 판매 승인 서명을 같이 거부하자고 한다", "창구 판매 결정이 누구에게서 내려왔는지 기록으로 남기게 한다", "주은채의 자책은 두고 그의 접속 권한만 빌려 쓴다"]],
    ["c14_grade_reaction", "c14_grade", "c14_final", "은행 총각 팬클럽", "오진우", "그날 밤 이정숙이 오진우를 가입자 단체방에 초대합니다. 10분 만에 메시지가 213개 쌓입니다. '은행 총각, 우리 것도 3년 못 찾아요?' '총각 밥은 먹었어요?' '얼굴 사진 좀 올려 봐요, 보고 믿게.' 오진우가 질문마다 답을 달다가 새벽 한 시에 휴대폰을 내려놓습니다. '다 합쳐서 41억이에요. 마흔 명이 41억. 대부분 예금 만기 날 창구에 갔다가 바뀐 돈이고요.' 늘 이기는 쪽을 고르던 그가 천장을 봅니다. '이건 이기는 싸움이 아니네요. 지면 안 되는 싸움이지.'", ["단체방 어르신들에게 내일 창구에 같이 가자고 한다", "마흔 명의 가입 날짜와 예금 만기일을 한 표로 맞춰 본다", "단체방은 오진우에게 맡기고 내일 결정만 준비한다"]],
  ],
  reactionEffects: {
    c14_husband: [
      { trust: 10, humanCost: -5, time: -4, fatigue: 4 },
      { legitimacy: 9, trust: 3, capital: -4, time: -3, fatigue: 3 },
      { time: 5, capital: 3, trust: 4, legitimacy: -2, humanCost: 2, fatigue: -3 },
    ],
    c14_recovery: [
      { trust: 11, legitimacy: 4, capital: -4, time: -3, fatigue: 5 },
      { legitimacy: 8, trust: 3, humanCost: -3, time: -3, fatigue: 3 },
      { time: 5, capital: 6, trust: -4, legitimacy: -3, humanCost: 2, fatigue: -3 },
    ],
    c14_grade: [
      { trust: 11, humanCost: -4, legitimacy: 3, capital: -3, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 3, time: -3, fatigue: 3 },
      { time: 5, capital: 5, legitimacy: -3, trust: 3, humanCost: 2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c14_husband: {
      voice: ["이정숙에게, 펀드가 사들인 채권을 있는 그대로 설명한다.", "이정숙의 공책을, 판매 과정의 증거로 써도 되는지 묻는다.", "오늘은 사과만 전하고, 설명은 다음 교실로 미룬다."],
      echo: ["설명을 들은 이정숙이 공책에 '부실채권'이라고 쓰고 물음표를 세 개 붙입니다. 그 물음표를 지우는 데 한 시간이 걸립니다.", "물으면 이정숙이 공책을 내밉니다. '선생 공책은 원래 증거예요.' 그 공책은 이제 이정숙의 것만은 아닙니다.", "미루면 이정숙은 공책을 가방에 넣고 버스를 탑니다. 가입을 되돌릴 수 있는 날이 하루 줄어듭니다."],
    },
    c14_recovery: {
      voice: ["주은채에게, 2차 판매 승인 서명을 같이 거부하자고 한다.", "창구 판매 결정이 누구에게서 내려왔는지, 기록으로 남기게 한다.", "주은채의 자책은 두고, 그의 접속 권한만 빌려 쓴다."],
      echo: ["같이 거부하자는 말에 주은채가 한참 웃습니다. '저 이 회사 4년 다녔어요. 처음으로 무서운 일을 해 보네요.'", "기록을 남기면 결정 칸에 사람 이름 대신 '그룹 협의'라는 네 글자가 적혀 있다는 게 드러납니다. 그 네 글자가 서명란입니다.", "권한은 빌려집니다. 주은채는 그 권한이 무엇에 쓰였는지 다음 날 접속 기록으로 알게 됩니다."],
    },
    c14_grade: {
      voice: ["단체방 어르신들에게, 내일 창구에 같이 가자고 한다.", "마흔 명의 가입 날짜와 예금 만기일을, 한 표로 맞춰 본다.", "단체방은 오진우에게 맡기고, 내일 결정만 준비한다."],
      echo: ["같이 가자는 말에 '몇 시요?'가 서른일곱 개 달립니다. 세 명은 무릎 때문에 못 간다며 대신 떡을 보내겠다고 합니다.", "맞춰 보면 서른여덟 명이 예금 만기 당일에 가입했습니다. 우연이라고 부르기에는 날짜가 너무 가지런합니다.", "맡기면 오진우는 밤새 답장을 씁니다. 아침에 그의 눈은 빨갛고, 단체방 이름은 '은행 총각 팬클럽'으로 바뀌어 있습니다."],
    },
  },
  reactionMemos: {
    c14_husband_reaction: ["남편이 믿었던 친절한 창구", "친절 대신 정확하게"],
    c14_recovery_reaction: ["연기금용 상품을 창구로 내린 한 달", "착한 이름이 가린 위험"],
    c14_grade_reaction: ["마흔 명, 41억", "예금 만기 날 바뀐 돈"],
  },
  branchPlan: ["c14_counter", 1, "c14_branch_tape", "c14_branch_tape_follow"],
  branchScenes: {
    // CASE 14's detour is the branch's own recording room. The case argues over
    // what a customer was told; the side door is the tape of what they were not.
    c14_branch_tape: {
      phase: "SIDE DOOR",
      title: "3분 12초",
      speaker: "반재욱",
      text: "점검표를 받은 지점장이 뜻밖에 순순히 녹취(상담 내용을 녹음해 남긴 것) 자료실 열쇠를 내줍니다. '다 규정대로 했습니다.' 반재욱이 헤드폰을 쓰고 70세 이상 고객 상담 스무 건을 차례로 틉니다. 길이가 모두 비슷합니다. 3분 남짓. 그리고 스무 건 모두 '이 상품은 원금 손실이' 직전에서 끊겼다가 '그럼 여기 서명하시면 됩니다'에서 다시 시작합니다. 반재욱이 헤드폰을 벗습니다. '규정대로 맞네요. 규정에는 켜라고만 적혀 있지, 끄지 말라고는 안 적혀 있으니까.' 자료실 밖 복도에서 누군가 서성이는 발소리가 들립니다.",
      memo: ["70세 이상 고객 상담 녹음 20건 확인", "평균 길이 3분 12초 -- 위험 설명 구간 전부 빠짐", "지점 규정: '가입 의사 확인 구간은 반드시 녹음'", "자료실 밖: 4번 창구 신입 행원"],
      triggers: ["order", "injustice", "system"],
      choices: [
        { id: "c14_branch_tape_a", label: "녹음이 끊긴 스무 명의 고객에게 먼저 전화를 건다", effect: { trust: 12, humanCost: -5, capital: -6, time: -6, fatigue: 5 }, next: "c14_branch_tape_follow", cognition: { persistence: 2 } },
        { id: "c14_branch_tape_b", label: "녹음 목록을 봉인해 금융감독원 민원 자료로 남긴다", effect: { legitimacy: 10, trust: 3, time: -3, humanCost: 3, fatigue: 2 }, next: "c14_branch_tape_follow", cognition: { inference: 2 } },
        { id: "c14_branch_tape_c", label: "지점장의 규정 해석을 받아 적고 조용히 물러난다", effect: { capital: 7, time: 6, trust: -6, humanCost: 4, fatigue: -3 }, next: "c14_branch_tape_follow", cognition: { risk: 1 } },
      ],
    },
    c14_branch_tape_follow: {
      phase: "SIDE DOOR",
      title: "4번 창구",
      speaker: "도윤하",
      text: "복도에서 서성이던 사람은 입사 8개월 차 신입 행원입니다. 명찰을 뒤집어 단 채 도윤하에게 말을 겁니다. '선배님, 4번 창구 쓰셨죠. 서랍에 선배님 이름 스티커가 아직 붙어 있어요.' 그가 휴대폰을 내밉니다. 지점 단체방에 매일 아침 올라오는 문장들입니다. '위험 설명은 녹음 끄고 짧게.' '고객이 망설이면 은행이 망하지 않는 한.' 그의 목소리가 떨립니다. '이번 달 목표 못 채우면 저 다른 지점으로 가요. 근데 어제 한 할머니가 제 손을 잡고 고맙다고 하셨어요.' 도윤하가 한참 대답하지 못합니다.",
      memo: ["신입 행원 입사 8개월 -- 4번 창구 배정", "지점 단체방 지시 캡처 14장", "이달 판매 목표 미달 시 다른 지점 발령 대상", "도윤하의 이름 스티커가 서랍에 남아 있음"],
      triggers: ["responsibility", "protection", "injustice"],
      choices: [
        { id: "c14_branch_tape_follow_a", label: "신입 행원을 지키겠다고 약속하고 단체방 캡처를 받는다", effect: { trust: 12, legitimacy: 5, capital: -7, time: -5, fatigue: 5 }, next: "c14_husband", cognition: { reframing: 2 } },
        { id: "c14_branch_tape_follow_b", label: "지시 문장이 누구에게서 내려왔는지 단체방을 거슬러 오른다", effect: { legitimacy: 11, trust: 4, time: -3, humanCost: 3, fatigue: 3 }, next: "c14_husband", cognition: { inference: 2 } },
        { id: "c14_branch_tape_follow_c", label: "신입 행원은 돌려보내고 캡처 없이 녹음만 들고 나온다", effect: { time: 6, capital: 5, trust: -7, humanCost: 4, fatigue: -3 }, next: "c14_husband", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c14_start",
    result: "c14_aftershock",
    defaultFree: "c14_route_system",
    // One product, one counter. The case is a single line like 사건 12; the split
    // is whether the sale stops, is repaired, or is followed to where the money goes.
    choices: {},
    system: {
      route: "c14_route_system",
      final: "c14_final_system_route",
      title: "따뜻한 이름",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 지난 15년 동안 은행 창구에서 팔렸다가 큰 손실을 낸 상품 아홉 건을 불러옵니다. 아홉 건 모두 가입자 평균 나이가 65세를 넘었고, 일곱 건의 이름에 '안심', '행복', '상생' 같은 말이 들어 있었습니다. 에코가 두 목록을 겹칩니다. 이름이 따뜻할수록 핵심 설명서는 짧았습니다. 가장 짧은 것은 한 장 반이었습니다. '위험을 설명하는 문장의 길이는 상품 이름의 온도와 반대로 움직이도록 학습되어 있습니다. 이 펀드의 핵심 설명서는 한 장입니다.'",
      memo: ["창구에서 팔려 큰 손실을 낸 상품 9건 -- 가입자 평균 65세 이상", "이름에 '안심·행복·상생'이 들어간 상품 7건", "상생 펀드 핵심 설명서: 1장"],
      routeChoices: [
        ["c14_route_system_publish", "아홉 건의 통계를 가입자 모임과 기자에게 동시에 공개한다", { legitimacy: 11, trust: 6, capital: -6, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c14_route_system_rename", "상품 이름에서 '상생'을 빼고 위험 등급을 넣으라고 요구한다", { legitimacy: 9, trust: 4, capital: -3, time: -6, humanCost: 3, fatigue: 5 }, { reframing: 2 }],
        ["c14_route_system_drop", "통계는 덮고 판매 일정대로 움직인다", { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "70세 이상 고객에게는 가족이 함께 듣는 설명을 의무로 만든다", { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 }, { reframing: 3 }],
      ["b", "판매는 그대로 두고 설명서만 두 장으로 늘린다", { capital: 9, time: 7, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "창구 판매 성과급에서 고령 고객 가중치를 없애라고 요구한다", { legitimacy: 8, trust: 9, capital: -7, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c14_evidence_turn",
    result: "c14_aftershock",
    sourceRoutes: ["c14_counter", "c14_desk", "c14_class", "c14_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 펀드 매입 명세서 옆에 놓고, 채권을 얼마에 사들였는지 맞춰 본다.",
    entryEcho: "단서를 대면 펀드가 채권을 산 값과 시장이 매긴 값 사이의 틈이 보입니다. 그 틈을 누구 돈이 메웠는지도 보입니다.",
    title: "92원과 41원",
    speaker: "반재욱",
    text: "단서를 맞추자 펀드의 매입 명세서가 열립니다. 펀드는 그룹 계열사(같은 그룹에 속한 다른 회사)의 부실채권 38건을 원래 대출 금액 100원당 92원에 샀습니다. 같은 달 브릿지은행이 같은 종류의 채권을 산 값은 41원입니다. 반재욱이 수첩에 뺄셈을 적습니다. '51원 차이. 1,070억 기준으로 590억쯤 됩니다. 그룹 장부에서 사라져야 할 손실이 은퇴자 3,146명의 통장으로 옮겨 간 겁니다.' 그가 명세서 맨 아래 칸을 가리킵니다. 매입 승인자 칸은 비어 있고, '그룹 협의'라는 도장만 찍혀 있습니다.",
    memo: ["매입 가격: 100원당 92원", "같은 달 시장 가격: 100원당 41원", "매입 승인자 칸: 비어 있음, '그룹 협의' 도장"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 5, trust: 4, time: -5, fatigue: 3 },
    choices: [
      ["c14_evidence_turn_reprice", "매입 가격을 시장 가격으로 되돌리기 전엔 판매를 못 열게 한다", { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c14_evidence_turn_hold", "명세서는 알아 두고 2차 판매 결산 때 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c14_evidence_turn_share", "가입자 3,146명에게 매입 가격부터 알린다", { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c14_branch_tape",
    systemNext: "c14_route_system",
    evidenceNext: "c14_evidence_turn",
    routeLabel: "직전 사건 촬영장의 배역표로 미스터리 쇼퍼 역할을 나눈다",
    systemLabel: "직전 자유응답 문장이 펀드 광고 문구에도 쓰였는지 본다",
    evidenceLabel: "직전 단서의 예산 코드를 펀드 매입 명세서에 대 본다",
  },
  openingRoutes: {
    c13_after_warm: "c14_start_warm",
    c13_after_record: "c14_start_record",
    c13_after_rush: "c14_start_rush",
  },
  openingCopy: {
    c14_start_warm: ["점심 자리에 놓인 대본", "도윤하", "생방송이 끝난 밤 조명 스탠드를 마지막 하나까지 같이 나른 뒤로, 여섯 사람은 3주 동안 점심을 한 번도 따로 먹지 않았습니다. 그 점심 자리에 도윤하가 판매 대본 한 장을 내려놓습니다. 그룹이 은행 창구에서 은퇴자에게 파는 '상생 펀드'의 대본입니다. 이 펀드가 사들이는 것은 그룹의 부실채권(돌려받기 어려워진 대출)과 플로우온 대출의 남은 조각입니다. '둘째 줄, 제가 3년 전에 쓰던 말이에요. 이거 불완전판매(위험을 제대로 설명하지 않고 파는 것)예요.' 숟가락 여섯 개가 동시에 멈춥니다.", ["상생 펀드 1차 판매 1,070억 -- 평균 나이 71세", "편입 자산: 부실채권 38건 + 플로우온 대출 남은 조각", "판매 대본 둘째 줄: 도윤하의 3년 전 문장"]],
    c14_start_record: ["같은 예산 코드의 다음 줄", "반재욱", "33층의 출연 제안을 조건과 대가까지 문서로 남긴 뒤 3주, 반재욱이 그 문서에 적힌 혁신위원회 예산 코드가 한 번 더 쓰인 곳을 찾아냅니다. KD자산운용의 새 상품, 은행 창구에서 은퇴자에게 파는 '상생 펀드'의 광고비입니다. 펀드가 사들이는 것은 그룹의 부실채권(돌려받기 어려워진 대출)과 플로우온 대출의 남은 조각입니다. 반재욱이 도윤하가 구해 온 판매 대본을 옆에 놓습니다. 위험을 말하는 문장이 한 줄도 없습니다. '광고로 얼굴을 씻고, 창구에서는 불완전판매(위험을 제대로 설명하지 않고 파는 것)로 손실을 넘기는 겁니다. 같은 돈으로요.'", ["혁신위원회 광고비와 같은 예산 코드 -- 펀드 광고", "편입 자산: 부실채권 38건 + 플로우온 대출 남은 조각", "판매 대본에 위험 설명 문장 0줄"]],
    c14_start_rush: ["멈추지 않은 사람의 다음 싸움", "오진우", "세트장이 식기도 전에 '상생'이 들어간 다음 상품을 캐기 시작한 당신에게, 오진우가 먼저 전화를 겁니다. '아버지 친구분이 어제 은행에서 펀드를 드셨대요. 착한 펀드라고, 은행이 망하지 않는 한 괜찮다고.' KD자산운용의 '상생 펀드', 백아린이 귀띔한 바로 그 상품입니다. 3주 만에 1,070억이 팔렸고, 사들인 것은 그룹의 부실채권(돌려받기 어려워진 대출)과 플로우온 대출의 남은 조각입니다. 오진우의 말이 빨라집니다. '도윤하 선배가 이 문장 자기가 쓰던 거래요. 이거 불완전판매(위험을 제대로 설명하지 않고 파는 것)예요. 우리가 늦으면 이번 주에만 300억이 더 팔려요.'", ["상생 펀드 1차 판매 1,070억 -- 이번 주 300억 추가 예상", "편입 자산: 부실채권 38건 + 플로우온 대출 남은 조각", "오상철의 친구, 어제 가입"]],
  },
  openingSignatures: {
    c14_start_warm: {
      label: "점심 자리의 여섯 명이 배역을 나눠 창구에 같이 간다",
      effect: { trust: 11, humanCost: -5, capital: -4, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "점심 자리의 여섯 명이 배역을 나눠, 창구에 같이 간다.",
      echo: "배역을 나누자 강태민이 제일 먼저 손을 듭니다. '할아버지 역, 제가 합니다.' 아무도 말리지 못합니다.",
    },
    c14_start_record: {
      label: "광고와 판매가 같은 예산 코드라는 기록을 감사팀에 정식으로 낸다",
      effect: { legitimacy: 12, trust: -3, capital: -5, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "광고와 판매가 같은 예산 코드라는 기록을, 감사팀에 정식으로 낸다.",
      echo: "기록은 접수됩니다. 감사팀은 코드를 확인하고, 확인했다는 사실만 다시 기록으로 남깁니다.",
    },
    c14_start_rush: {
      label: "오상철의 친구분부터 찾아가 가입 서류를 같이 다시 읽는다",
      effect: { trust: 10, humanCost: -4, legitimacy: 3, time: -5, capital: -2, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "오상철의 친구분부터 찾아가, 가입 서류를 같이 다시 읽는다.",
      echo: "찾아가면 어르신이 반가워하며 서류를 꺼냅니다. 반가운 얼굴이 서류 셋째 장에서 굳습니다.",
    },
  },
  voiceLines: {
    // CASE 14. The counter. Every line is said across a counter to someone who
    // is taking notes, so none of them may be kind instead of exact.
    c14_start_shop: "손님인 척 강서지점 창구에 가서, 판매 현장을 직접 본다.",
    c14_start_compare: "판매 대본과 펀드 설명서를, 한 줄씩 맞대어 읽는다.",
    c14_start_trace: "판매는 두고, 펀드가 사들인 채권 목록부터 뽑는다.",
    c14_counter_stop: "옆 창구로 건너가, 이정숙에게 서명을 잠시 멈춰 달라고 한다.",
    c14_counter_report: "점검표에 빠진 설명 항목을 적어, 지점장에게 정식으로 낸다.",
    c14_counter_record: "정체를 숨긴 채, 옆 창구의 설명을 끝까지 녹음해 둔다.",
    c14_branch_tape_a: "녹음이 끊긴 스무 명의 고객에게, 먼저 전화를 건다.",
    c14_branch_tape_b: "녹음 목록을 봉인해, 금융감독원 민원 자료로 남긴다.",
    c14_branch_tape_c: "지점장의 규정 해석을 받아 적고, 조용히 물러난다.",
    c14_branch_tape_follow_a: "신입 행원을 지키겠다고 약속하고, 단체방 캡처를 받는다.",
    c14_branch_tape_follow_b: "지시 문장이 누구에게서 내려왔는지, 단체방을 거슬러 오른다.",
    c14_branch_tape_follow_c: "신입 행원은 돌려보내고, 캡처 없이 녹음만 들고 나온다.",
    c14_desk_play: "창구에서 녹음한 설명을 주은채에게 들려주고, 함께 멈추자고 한다.",
    c14_desk_gap: "설계 문서와 판매 대본이 어긋나는 대목을, 표로 정리한다.",
    c14_desk_model: "주은채의 모형 파일만 받아, 사들인 채권의 출처를 쫓는다.",
    c14_class_read: "이정숙과 함께, 어르신들 가입서를 한 장씩 같이 읽는다.",
    c14_class_notice: "이미 가입한 어르신들에게, 취소 방법을 서면으로 안내한다.",
    c14_class_leave: "교실은 이정숙에게 맡기고, 판교로 돌아가 돈의 흐름을 쫓는다.",
    c14_final_halt: "셔터가 오르기 전에, 판매를 공개적으로 멈추라고 요구한다.",
    c14_final_fix: "설명서와 판매 절차를 고치기 전엔, 2차 판매를 열지 않게 한다.",
    c14_final_trace: "판매는 그대로 두고, 1,500억이 어디로 흘러가는지 추적한다.",
    c14_after_warm: "오늘은 이정숙과, 가입자 모임 저녁 자리에 끝까지 남는다.",
    c14_after_record: "그 문장을 지우는 창구 판매 기준 개정안부터, 문서로 남긴다.",
    c14_after_rush: "이민서의 메시지를 받자마자, 곧장 인사부로 간다.",
    c14_route_system_publish: "아홉 건의 통계를, 가입자 모임과 기자에게 동시에 공개한다.",
    c14_route_system_rename: "상품 이름에서 '상생'을 빼고, 위험 등급을 넣으라고 요구한다.",
    c14_route_system_drop: "통계는 덮고, 판매 일정대로 움직인다.",
    c14_final_system_route_a: "70세 이상 고객에게는, 가족이 함께 듣는 설명을 의무로 만든다.",
    c14_final_system_route_b: "판매는 그대로 두고, 설명서만 두 장으로 늘린다.",
    c14_final_system_route_c: "창구 판매 성과급에서, 고령 고객 가중치를 없애라고 요구한다.",
    c14_evidence_turn_reprice: "매입 가격을 시장 가격으로 되돌리기 전엔, 판매를 못 열게 한다.",
    c14_evidence_turn_hold: "명세서는 알아 두고, 2차 판매 결산 때 꺼낸다.",
    c14_evidence_turn_share: "가입자 3,146명에게, 매입 가격부터 알린다.",
  },
  echoReplies: {
    // CASE 14.
    c14_start_shop: "창구에 가면 대본이 사람의 목소리로 들립니다. 그 목소리가 얼마나 친절한지가 제일 무섭습니다.",
    c14_start_compare: "맞대어 읽으면 설명서의 '원금 손실 가능'이 대본에서는 '은행이 망하지 않는 한'이 됩니다. 한 줄을 확인하는 데 하루가 듭니다.",
    c14_start_trace: "목록은 빨리 나옵니다. 그 목록을 뽑는 동안 창구에서는 스무 명이 더 서명합니다.",
    c14_counter_stop: "멈춰 달라는 말에 이정숙이 펜을 내려놓습니다. 그리고 공책에 당신 말을 받아 적습니다. '잠깐, 멈춰라.'",
    c14_counter_report: "점검표는 정확합니다. 지점장은 받아서 서랍에 넣고, 옆 창구의 서명은 그사이 끝납니다.",
    c14_counter_record: "녹음은 증거가 됩니다. 증거가 녹음되는 동안 이정숙의 도장이 가입서에 찍힙니다.",
    c14_branch_tape_a: "전화를 받은 스무 명 중 열한 명이 '위험 설명은 들은 적 없다'고 합니다. 나머지는 기억이 안 난다고 합니다.",
    c14_branch_tape_b: "봉인된 목록은 지워지지 않습니다. 민원 답변은 45일 뒤에 옵니다.",
    c14_branch_tape_c: "받아 적은 해석은 한 줄입니다. '규정 위반 없음.' 복도의 발소리가 멀어집니다.",
    c14_branch_tape_follow_a: "약속하면 신입 행원이 명찰을 바로 답니다. 그 약속을 지키는 비용은 이번 달 목표표에 적혀 있습니다.",
    c14_branch_tape_follow_b: "거슬러 오르면 문장은 지점장에서 본부로, 본부에서 '그룹 협의'로 올라갑니다. 거기서 이름이 끊깁니다.",
    c14_branch_tape_follow_c: "돌려보내면 신입 행원은 4번 창구로 돌아갑니다. 내일 아침에도 단체방 문장은 올라옵니다.",
    c14_desk_play: "녹음을 들은 주은채가 두 번 되감습니다. 세 번째에는 헤드폰을 벗고 한동안 화면만 봅니다.",
    c14_desk_gap: "표는 두 칸이면 충분합니다. 설계 문서 '5년 보유', 판매 대본 '언제든지'. 그 사이에 3,146명이 있습니다.",
    c14_desk_model: "모형은 넘어옵니다. 주은채는 자기 설계가 무엇에 쓰일지 묻지 못하고 파일을 보냅니다.",
    c14_class_read: "같이 읽으면 가입서 한 장에 20분이 걸립니다. 62명 중 누구도 자리를 뜨지 않습니다.",
    c14_class_notice: "서면 안내는 모두에게 갑니다. 글씨가 작아서 이정숙이 돋보기를 돌려 가며 다시 읽어 줍니다.",
    c14_class_leave: "판교로 가면 돈의 길이 보입니다. 복지관 칠판의 글씨는 다음 날 아침 청소 시간에 지워집니다.",
    c14_final_halt: "멈추라는 요구가 객장에 울립니다. 셔터는 오르지만 번호표 기계는 한 시간 동안 꺼져 있고, 그룹 홍보실 전화가 먼저 울립니다.",
    c14_final_fix: "고치기 전엔 열지 않게 하면 2차 판매가 3주 미뤄집니다. 그 3주 동안 새 대본의 둘째 장을 누가 쓸지가 새 싸움이 됩니다.",
    c14_final_trace: "판매가 열리면 오늘 하루에만 207억이 들어옵니다. 그 돈의 길은 선명해지고, 그 길 위에는 오늘 줄 선 사람들이 있습니다.",
    c14_after_warm: "저녁 자리에서 이정숙이 모두에게 받아쓰기 시험을 냅니다. 강태민은 이번에도 100점이고, 권도현은 답안 옆에 채점 비용을 적다가 감점됩니다.",
    c14_after_record: "문서가 된 기준은 대본에서 그 문장을 지웁니다. 도윤하가 개정안 맨 끝에 자기 이름을 적습니다.",
    c14_after_rush: "인사부 복도는 조용합니다. 가입자 모임의 저녁 자리에는 한 사람 몫의 수저가 남습니다.",
    c14_route_system_publish: "공개하면 기사가 나고, 그룹은 '업계 전반의 문제'라는 답을 냅니다. 이 펀드의 이름은 기사 세 번째 문단에 나옵니다.",
    c14_route_system_rename: "이름을 바꾸라는 요구에 운용사는 '브랜드 훼손'을 이유로 사흘을 버팁니다. 사흘째 저녁, '상생'이 작은 글씨로 줄어듭니다.",
    c14_route_system_drop: "덮으면 일정은 흔들리지 않습니다. 따뜻한 이름의 목록에 열 번째 칸이 조용히 생깁니다.",
    c14_final_system_route_a: "가족이 함께 들으면 설명은 두 배로 길어집니다. 창구 하루 판매량은 절반이 되고, 손주들이 할머니 대신 질문을 합니다.",
    c14_final_system_route_b: "설명서가 두 장이 되면 두 번째 장은 아무도 넘기지 않습니다. 대본의 둘째 장은 그대로입니다.",
    c14_final_system_route_c: "가중치를 없애면 창구 직원들의 성과급이 줄어듭니다. 4번 창구의 신입 행원은 처음으로 목표표를 덜 무서워합니다.",
    c14_evidence_turn_reprice: "가격을 되돌리면 590억의 손실이 그룹 장부로 돌아옵니다. 그룹은 그 숫자를 '일회성 비용'이라고 부르기로 합니다.",
    c14_evidence_turn_hold: "알아 두면 결산 날에 꺼낼 무기가 생깁니다. 그날까지 명세서의 틈은 매일 조금씩 더 채워집니다.",
    c14_evidence_turn_share: "알리면 3,146명이 한꺼번에 전화를 겁니다. 콜센터가 멈추고, 멈춘 콜센터가 뉴스가 됩니다.",
  },
  characterProfiles: {
    주은채: {
      role: "KD자산운용 대체투자운용팀 펀드매니저 · 상생 펀드 설계자",
      stance: "숫자 · 선의 · 흔들림",
      job: "악당이 아닌 설계자로 선다. 좋은 숫자로 만든 상품이 창구에 내려가며 어떻게 다른 물건이 되는지 보여 준다.",
      appearance: "소매를 두 번 걷은 흰 셔츠, 색이 다른 형광펜 세 자루, 모니터 여섯 대의 빛이 비친 안경.",
      thought: "숫자는 거짓말을 안 한다. 그런데 숫자를 누가 누구에게 읽어 주는지는 한 번도 모형에 넣은 적이 없다.",
      gesture: "주은채는 숫자를 말할 때마다 소수점 첫째 자리까지 말하고, 확신이 없을 때만 반올림한다.",
      voice: "밝고 빠르게 설명하다가, 모르는 것을 알게 되는 순간 말이 뚝 끊긴다.",
      line: "착한 돈이 착한 수익을 내는 구조예요. 적어도 제 모형에서는요.",
    },
    이정숙: {
      role: "상생 펀드 가입 고객 · 전직 초등학교 교사 · 72세",
      stance: "받아쓰기 · 정확함 · 가르치는 사람",
      job: "창구 대본을 받아 적은 공책으로 불완전판매의 증거가 되고, 끝내 금융 교실의 강사가 된다.",
      appearance: "흰 블라우스, 목에 건 돋보기, 가방 속 줄 공책과 빨간 색연필.",
      thought: "모르는 걸 모른다고 말하는 건 창피한 일이 아니다. 38년 동안 아이들에게 그렇게 가르쳤다.",
      gesture: "이정숙은 설명을 들을 때 공책에 받아 적고, 틀린 말이 나오면 말없이 빨간 동그라미를 친다.",
      voice: "교실에서처럼 또박또박, 천천히 말하고, 대답을 들을 때까지 기다린다.",
      line: "천천히 다시 말해 주세요. 받아 적을게요.",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "2차 판매 시작까지 D-8" },
  sceneContext: {
    c14_start: {
      place: "트리거랩 4층 분석관실",
      clock: "2차 판매 시작까지 D-8",
      question: "은퇴자에게 팔리는 펀드의 대본에 도윤하의 3년 전 문장이 있습니다. 무엇부터 하겠습니까?",
      lead: "10월 마지막 주, 분석관실 창밖의 은행 광고판이 하룻밤 사이 초록색으로 바뀌었습니다.",
    },
    c14_start_warm: {
      place: "트리거랩 4층 분석관실",
      clock: "2차 판매 시작까지 D-8",
      question: "점심 자리의 숟가락 여섯 개가 한 대본 앞에서 멈췄습니다. 여섯 명이 어디로 가겠습니까?",
      lead: "성수동 세트장을 같이 치운 뒤로 여섯 명은 점심을 늘 같은 분식집에서 먹었습니다.",
    },
    c14_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "2차 판매 시작까지 D-8",
      question: "혁신위원회 광고와 펀드 광고가 같은 예산 코드에서 나왔습니다. 이 기록을 어디에 쓰겠습니까?",
      lead: "출연 제안 문서를 정리하던 반재욱이 같은 여섯 자리 숫자를 두 번 봅니다.",
    },
    c14_start_rush: {
      place: "트리거랩 4층 분석관실",
      clock: "2차 판매 시작까지 D-8",
      question: "오상철의 친구가 어제 그 펀드에 가입했습니다. 늦기 전에 누구부터 만나겠습니까?",
      lead: "'상생 ESG(환경·사회·회사 운영의 투명성을 따지는 투자)'라는 이름의 폴더를 열자마자 오진우의 전화가 먼저 울립니다.",
    },
    c14_counter: {
      place: "KD은행 강서지점 · 객장 창구",
      clock: "2차 판매 시작까지 D-7 · 10:40",
      question: "옆 창구의 할머니가 '원금은 은행이 지킨다'고 받아 적고 있습니다. 어떻게 하겠습니까?",
      lead: "가발과 지팡이를 챙긴 강태민이 지점 앞에서 걸음걸이를 세 번 연습했습니다.",
    },
    c14_branch_tape: {
      place: "KD은행 강서지점 · 녹취 자료실",
      clock: "2차 판매 시작까지 D-7 · 14시",
      question: "스무 건의 상담 녹음이 모두 위험 설명 직전에 끊겨 있습니다. 이 녹음을 어떻게 하겠습니까?",
    },
    c14_branch_tape_follow: {
      place: "KD은행 강서지점 · 직원 복도",
      clock: "2차 판매 시작까지 D-7 · 15시",
      question: "4번 창구의 신입 행원이 매일 아침 내려오는 지시를 보여 줍니다. 그를 어떻게 하겠습니까?",
    },
    c14_husband: {
      place: "KD은행 강서지점 · 면담실",
      clock: "2차 판매 시작까지 D-7 · 저녁",
      question: "이정숙의 남편은 3년 전 도윤하의 창구 손님이었습니다. 이 사실을 어떻게 하겠습니까?",
    },
    c14_husband_reaction: {
      place: "강서 노인복지관 앞 골목",
      clock: "2차 판매 시작까지 D-6 · 오전",
      question: "친절하지 말고 정확하게 말해 달라고 이정숙이 부탁합니다. 무엇을 말하겠습니까?",
    },
    c14_desk: {
      place: "판교 KD자산운용 · 운용실",
      clock: "2차 판매 시작까지 D-5",
      question: "착한 펀드를 설계한 사람이 처음 보는 성과급 표 앞에서 멈췄습니다. 그와 무엇을 하겠습니까?",
      lead: "강서지점 창구에서 본 것을 들고, 이 펀드를 설계한 사람을 찾아 판교로 왔습니다.",
    },
    c14_recovery: {
      place: "판교 KD자산운용 · 트레이딩룸 회의 탁자",
      clock: "2차 판매 시작까지 D-5 · 19시",
      question: "회수율 68%를 41%로 바꾸자 원금의 22%가 사라집니다. 이 계산을 어떻게 쓰겠습니까?",
    },
    c14_recovery_reaction: {
      place: "판교 KD자산운용 운용실 · 야간",
      clock: "2차 판매 시작까지 D-5 · 23:00",
      question: "상생이라는 이름을 자기가 지었다고 주은채가 말합니다. 그에게 무엇을 청하겠습니까?",
    },
    c14_class: {
      place: "강서 노인복지관 · 금융 교실",
      clock: "2차 판매 시작까지 D-2",
      question: "칠판에 '모르면 사인하지 마세요'가 적혔고 강사가 당신을 봅니다. 이 교실을 어떻게 하겠습니까?",
      lead: "주은채의 모형에서 41이라는 숫자를 본 뒤, 복지관 3층에 '금융 교실' 현수막이 걸렸습니다.",
    },
    c14_grade: {
      place: "강서 노인복지관 · 금융 교실 뒷줄",
      clock: "2차 판매 시작까지 D-2 · 오후",
      question: "창구 설명을 받아 적은 공책이 마흔 권 있습니다. 이 공책들을 어떻게 하겠습니까?",
    },
    c14_grade_reaction: {
      place: "트리거랩 4층 분석관실 · 야간",
      clock: "2차 판매 시작까지 D-1 · 새벽 01:10",
      question: "마흔 명이 넣은 41억은 대부분 예금 만기 날 바뀐 돈입니다. 이 단체방에 무엇이라 답하겠습니까?",
    },
    c14_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "2차 판매 시작까지 D-3",
      question: "이름이 따뜻한 상품일수록 설명서가 짧았습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c14_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "2차 판매 당일 · 새벽",
      question: "창구에서 노인에게 파는 방식을 하나만 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c14_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 매입 명세서",
      clock: "2차 판매 당일 · 07시",
      question: "펀드는 41원짜리 채권을 92원에 샀고 승인자 칸은 비어 있습니다. 이 명세서를 어떻게 쓰겠습니까?",
    },
    c14_final: {
      place: "KD은행 강서지점 · 객장",
      clock: "2차 판매 당일 · 08:50",
      question: "셔터가 오르기 10분 전, 2차 판매 1,500억이 시작되려 합니다. 어떻게 하겠습니까?",
      lead: "월요일 아침, 셔터가 오르기 전의 객장에는 번호표 기계의 대기음만 들립니다.",
    },
    c14_aftershock: {
      place: "KD은행 강서지점 · 4번 창구",
      clock: "청약 철회 마감 · 17시",
      question: "칠판 사진이 손자의 학교를 돌고, 이민서에게 조건 붙은 제안이 왔습니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c14-price-gap",
    title: "92원과 41원",
    text: "상생 펀드는 그룹의 부실채권을 100원당 92원에 샀습니다. 같은 달 시장 가격은 41원이었고, 그 차이 590억은 은퇴자 3,146명의 돈으로 메워졌습니다.",
  },
  outcomes: {
    c14_after_warm: { tag: "곁에 남은 결말", title: "받아쓰기 시험을 끝까지 같이 봤다", text: "이정숙이 가입자 모임 저녁 자리에서 모두에게 받아쓰기 시험을 냈습니다. 당신은 마지막까지 남아 빨간 동그라미를 받았습니다." },
    c14_after_record: { tag: "문장을 지운 결말", title: "창구 대본에서 그 문장이 지워졌다", text: "판매 기준 개정안이 접수됐습니다. '은행이 망하지 않는 한'은 이제 어느 창구 대본에도 쓸 수 없는 문장이 됐습니다." },
    c14_after_rush: { tag: "먼저 간 결말", title: "저녁 자리를 두고 인사부로 먼저 갔다", text: "당신은 이민서의 메시지를 받자마자 인사부로 향했습니다. 가입자 모임의 저녁 자리에는 한 사람 몫의 수저가 남았습니다." },
  },
  carryovers: {
    c14_after_warm: { trust: 9, humanCost: -6, fatigue: -7 },
    c14_after_record: { legitimacy: 11, trust: 3, fatigue: 5 },
    c14_after_rush: { capital: 7, legitimacy: 3, trust: -8 },
  },
  continuityChallenges: {
    c13_after_warm: { id: "protect-trust", title: "점심을 같이 먹던 사람들과 같이 가기", text: "세트장을 같이 치운 뒤로 여섯 명은 흩어지지 않았습니다. 창구 앞에 혼자가 아니라 여섯이 서는 선택을 찾아야 보너스가 열립니다." },
    c13_after_record: { id: "use-reframe", title: "같은 예산 코드의 다른 얼굴 읽기", text: "혁신위원회 광고와 펀드 광고가 같은 돈에서 나왔습니다. 개혁의 얼굴과 판매의 얼굴이 한 장부라는 것을 판을 다시 짜서 보여 줘야 합니다." },
    c13_after_rush: { id: "repair-legitimacy", title: "서둘러 온 싸움의 공정함 회복하기", text: "스튜디오에서 곧장 달려온 싸움에는 기록이 없습니다. 가입자들에게 무엇을 근거로 멈추라고 하는지 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
