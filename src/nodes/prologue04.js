/**
 * PROLOGUE 04 -- the fourth window, and the day the loan turned into a product.
 *
 * 2023-0412 was approved in April and 310억 went out. Prologue 03 ended with a
 * dissent sent back. This chapter is what a bank does next: it takes the thing
 * it just financed, wraps it, and sells it over a counter to people who came in
 * to renew a savings account.
 *
 * It is 도윤하's chapter. In 사건 01, on the night before payday, he says "그
 * 대출을 창구에서 판 사람이 저예요" and never explains it. Here the player
 * watches the sale. He is 3년차 at the fourth window of KD은행 강서지점, second
 * or third on the board every month, and he is not a bad person -- he simply
 * does not know what he is selling. The 설명서 is 22쪽; the script taped inside
 * his drawer is three minutes long and four pages of the 22 ever reach the
 * counter. The people he sells it to are people whose names he knows: a market
 * 반찬가게 사장, a laundry owner, the woman who asks about his mother's knee. He
 * keeps their names in a spring notebook so he can greet them next time. That
 * notebook is what will not let go of him three years later.
 *
 * The analyst is here because the dissent was returned and the errand that came
 * back in its place is called 판매 적정성 사후 점검 -- a demotion with a polite
 * name. Going down to the branch, he sees for the first time the money he tried
 * to stop arriving in other people's passbooks. The sales target came from the
 * 본점, the 공문 that carries it has a department stamp and an empty approval
 * box, and the three-minute script was written two hours after 2023-0412 was
 * approved.
 *
 * The feeling of the chapter is shame, not anger, and the one rule it keeps is
 * its own subject: the product has a hard name that has to be unpacked in
 * parentheses the first time anyone says it, because the bank sells in easy
 * words and takes responsibility in hard ones. 도윤하 smiles while he sells,
 * and the smile is sincere. That is the chapter.
 */
export const prologue04Nodes = {
  p4_start: {
    phase: "PROLOGUE 04 BRIEFING",
    title: "사후 점검",
    speaker: "배승호",
    text:
      "2023년 5월 15일 월요일 아침 9시 20분, KD은행 강서지점. 본점에서 내려온 종이 한 장의 제목은 '판매 적정성 사후 점검'입니다. 담당자 칸에 당신 이름이 있고, 그 옆 검토자 칸은 비어 있습니다. 지난주까지 심사실에서 하던 일은 다른 사람에게 넘어갔습니다. 객장 문을 열면 손님보다 먼저 보이는 것이 벽에 걸린 실적판입니다. 5월 셋째 주, 창구 여섯 개의 이름이 세로로 서 있고 옆에 숫자가 붙어 있습니다. 2번 창구 2억 3,100만. 4번 창구 1억 9,200만. 4번 창구 이름 칸에는 '도윤하'라고 적혀 있고, 그 아래 판매왕 스티커가 두 장 붙어 있습니다. 지점장 배승호가 종이컵을 내밀며 웃습니다. '본점에서 점검 나오셨다고요? 우리 지점 민원 한 건도 없습니다. 편하게 보세요.' 그가 실적판을 가리킵니다. '저 숫자가 거의 다 스마트물류 3호예요. 요즘 저것만 나갑니다.'",
    memo: [
      "점검 명칭: 판매 적정성 사후 점검 -- 담당 1명",
      "실적판 5월 셋째 주 -- 4번 창구 1억 9,200만, 2위",
      "4번 창구 도윤하 -- 입행 3년차, 판매왕 스티커 2장",
      "지점 민원 접수 0건",
    ],
    triggers: ["responsibility", "selfAwareness", "curiosity"],
    choices: [
      {
        id: "p4_start_open",
        label: "창구 뒤에 서기 전에 왜 왔는지 행원들에게 먼저 말한다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -2, fatigue: 4 },
        next: "p4_window",
        cognition: { persistence: 2 },
      },
      {
        id: "p4_start_board",
        label: "실적판과 이번 달 판매 목표 공문부터 사진으로 남긴다",
        effect: { legitimacy: 11, trust: -2, time: -5, humanCost: 2, fatigue: 3 },
        next: "p4_window",
        cognition: { inference: 2 },
      },
      {
        id: "p4_start_quick",
        label: "점검표 스무 칸만 채우고 오늘 안에 본점으로 올라간다",
        effect: { capital: 8, time: 6, legitimacy: -5, trust: -3, humanCost: 3, fatigue: -1 },
        next: "p4_window",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p4_window",
      },
    ],
  },
  p4_window: {
    phase: "THE FOURTH WINDOW",
    title: "3분",
    speaker: "도윤하",
    text:
      "4번 창구 옆에 접이식 의자를 놓고 앉습니다. 열 시 십 분, 일흔한 살 손님이 적금 만기 통장을 들고 옵니다. 6년 단골이라 도윤하가 이름을 먼저 부릅니다. 그리고 창구에서 팔리는 것은 KD 스마트물류 제3호 특정금전신탁(손님이 맡긴 돈을 은행이 정해 둔 한 곳에 넣어 굴려 주는 계약)입니다. 도윤하는 그 이름을 한 번도 소리 내지 않습니다. '어머니, 적금보다 조금 더 나와요. 물류 회사 한 군데에 넣는 건데 요즘 제일 잘 나가요.' 설명서는 22쪽인데 창구에 놓인 묶음은 앞 4쪽입니다. 12쪽에 이런 문장이 있습니다. 그 회사가 흔들리면 이 돈은 후순위(돌려받는 순서가 맨 뒤로 밀리는 자리)가 됩니다. 손님이 서명한 시각은 10시 13분, 앉은 지 3분 12초입니다. 도윤하가 통장을 두 손으로 건네며 웃습니다. 그 웃음에 거짓이 하나도 없다는 것이 이 자리에서 가장 견디기 어려운 부분입니다.",
    memo: [
      "상품 설명서 22쪽 -- 창구 배포본 4쪽",
      "12쪽: 회사가 흔들리면 후순위",
      "상담 시간 3분 12초, 최소 가입 300만 원",
      "제시 수익률 연 5.8% -- 원금 보장 아님",
    ],
    triggers: ["helplessness", "affection", "injustice"],
    choices: [
      {
        id: "p4_window_stop",
        label: "서명 전에 끼어들어 설명서 12쪽을 손님과 같이 읽는다",
        effect: { trust: 12, humanCost: -5, capital: -3, time: -5, fatigue: 5 },
        next: "p4_quota",
        cognition: { reframing: 2 },
      },
      {
        id: "p4_window_script",
        label: "대본과 설명서를 나란히 놓고 다른 문장을 한 줄씩 적는다",
        effect: { legitimacy: 11, trust: 4, time: -6, humanCost: 3, fatigue: 4 },
        next: "p4_quota",
        cognition: { inference: 2 },
      },
      {
        id: "p4_window_watch",
        label: "끼어들지 않고 오전 판매 여섯 건을 끝까지 지켜본다",
        effect: { capital: 7, time: 5, legitimacy: 2, trust: -3, humanCost: 4, fatigue: -2 },
        next: "p4_quota",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p4_quota",
      },
    ],
  },
  p4_quota: {
    phase: "THE WHITEBOARD",
    title: "2층 화이트보드",
    speaker: "배승호",
    text:
      "점심시간 지점 2층 회의실. 화이트보드 왼쪽에 5월 지점 목표 12억이 적혀 있고, 오른쪽에 창구 여섯 개의 칸이 있습니다. 채운 칸에는 동그라미가, 못 채운 칸에는 이름이 그대로 남아 있습니다. 3번 창구와 6번 창구는 지난달에도 이름이 남았고, 아직 지워지지 않았습니다. 목표를 내려보낸 종이가 탁자에 있습니다. 발신은 본점 기업금융전략팀, 당신 팀입니다. 제목은 '스마트물류 제3호 판매 협조', 맨 아래 승인 칸에는 부서 도장만 찍혀 있고 이름이 없습니다. 첨부된 약관(계약의 자세한 조건을 빼곡히 적어 둔 문서)은 18쪽이고, 창구에는 내려오지 않았습니다. 배승호가 화이트보드 마커를 쥐었다 놓습니다. '저 목표는 제가 만든 게 아니에요. 받아서 여섯으로 나눴을 뿐이고요.' 그가 잠깐 웃습니다. '불완전판매(손님이 내용을 제대로 모른 채 가입하게 만든 판매) 얘기 하시려는 거면, 우리 애들은 대본대로만 했습니다.'",
    memo: [
      "5월 지점 목표 12억 -- 창구당 2억",
      "미달 창구 이름은 지우지 않음 -- 3번·6번 2개월 연속",
      "공문 발신: 본점 기업금융전략팀, 승인 칸 이름 없음",
      "약관 18쪽 -- 창구 미배포",
    ],
    triggers: ["system", "order", "injustice"],
    choices: [
      {
        id: "p4_quota_erase",
        label: "목표를 못 채운 창구 이름부터 지워 달라고 지점장에게 말한다",
        effect: { trust: 11, humanCost: -5, legitimacy: -2, capital: -3, time: -4, fatigue: 4 },
        next: "p4_visit",
        cognition: { persistence: 2 },
      },
      {
        id: "p4_quota_trace",
        label: "비어 있는 승인 칸을 점검 보고서에 그대로 옮겨 적는다",
        effect: { legitimacy: 12, trust: 2, time: -6, humanCost: 2, fatigue: 4 },
        next: "p4_visit",
        cognition: { inference: 2 },
      },
      {
        id: "p4_quota_skip",
        label: "목표는 지점 사정이라며 건수만 세고 회의실을 나온다",
        effect: { capital: 8, time: 5, legitimacy: -3, trust: -4, humanCost: 3, fatigue: -2 },
        next: "p4_visit",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p4_visit",
      },
    ],
  },
  p4_visit: {
    phase: "THE MARKET",
    title: "가을떡방 옆",
    speaker: "신영란",
    text:
      "오후 네 시 망원시장. 가을떡방 셔터는 반쯤 내려가 있고 '오늘은 인천 다녀옵니다'라고 적힌 쪽지가 붙어 있습니다. 그 옆 반찬가게 들깨한줌의 신영란이 당신을 평상에 앉힙니다. 예순셋, 이 골목에서 19년입니다. 그가 통장을 내밉니다. 3월 22일, 4번 창구, 1,200만 원. '적금이라던데요. 2년 뒤에 가게 보증금 올려 줘야 해서요.' 통장에 찍힌 상품명 여섯 글자를 그는 읽지 않습니다. 읽어도 무슨 말인지 모르겠다고 합니다. 청약 철회(가입을 없던 일로 되돌릴 수 있는 기간)는 4월 초에 이미 끝났고, 지금 환매(맡긴 돈을 만기 전에 돌려받는 일)를 신청하면 수수료가 붙습니다. 신영란이 김치통 뚜껑을 닫으며 말합니다. '그 총각 참 착해요. 우리 김치 사 가고, 올 때마다 어머니 무릎 어떠시냐고 묻고요. 그런 사람이 나쁜 걸 팔았겠어요?'",
    memo: [
      "신영란 -- 들깨한줌, 3월 22일 4번 창구 가입 1,200만 원",
      "본인 인식: '적금'",
      "청약 철회 기간 종료 -- 4월 3일",
      "골목에서 같은 상품에 가입한 사람 6명 확인",
    ],
    triggers: ["affection", "helplessness", "responsibility"],
    choices: [
      {
        id: "p4_visit_read",
        label: "평상에 앉아 설명서 22쪽을 처음부터 끝까지 읽어 드린다",
        effect: { trust: 12, humanCost: -5, capital: -3, time: -7, fatigue: 6 },
        next: "p4_final",
        cognition: { persistence: 2 },
      },
      {
        id: "p4_visit_record",
        label: "3월 22일 판매가 어떻게 이뤄졌는지 확인해 점검 기록에 남긴다",
        effect: { legitimacy: 12, trust: 3, time: -6, humanCost: 3, fatigue: 4 },
        next: "p4_final",
        cognition: { inference: 2 },
      },
      {
        id: "p4_visit_leave",
        label: "아직 손해가 난 것은 아니라며 점검 대상에서 빼고 돌아선다",
        effect: { capital: 8, time: 6, legitimacy: -3, trust: -5, humanCost: 4, fatigue: -3 },
        next: "p4_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p4_final",
      },
    ],
  },
  p4_final: {
    phase: "FINAL DECISION",
    title: "4번 창구에 대하여",
    speaker: "도윤하",
    text:
      "저녁 여덟 시, 셔터가 내려간 객장에 형광등 두 줄만 켜져 있습니다. 도윤하가 혼자 남아 마감을 합니다. 그가 4번 서랍에서 스프링 수첩을 꺼내 뭔가를 세다가 당신과 눈이 마주칩니다. 이름 마흔일곱 개, 그중 서른한 개 옆에는 한 줄씩 메모가 붙어 있습니다. 6월 만기, 아들 등록금 9월, 무릎 수술 8월. 휴대폰이 울립니다. 한서윤입니다. 점검 결과는 내일 아침 9시까지, 양식은 스무 칸, 빈칸 없이. 전화를 끊자 도윤하가 수첩을 덮고 처음으로 묻습니다. '저, 본점에서 오셨으니까 아실 거 아니에요.' 그가 웃는 얼굴 그대로 말합니다. '이거 괜찮은 상품 맞죠? 저 어머니들한테 제가 괜찮다고 했거든요.'",
    memo: [
      "4번 창구 판매 47건 -- 이름을 아는 손님 31명",
      "점검 결과 제출 기한: 다음 날 09시, 스무 칸",
      "도윤하의 질문: '이거 괜찮은 상품 맞죠?'",
      "이 답이 3년 뒤 급여일 전날의 고백으로 이어짐",
    ],
    triggers: ["choice", "trust", "selfAwareness"],
    choices: [
      {
        id: "p4_final_tell",
        label: "지금 여기서 도윤하에게 이 상품이 무엇인지 그대로 말해 준다",
        effect: { trust: 13, humanCost: -5, legitimacy: -4, capital: -4, time: -4, fatigue: 6 },
        next: "prologue04_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "p4_final_file",
        label: "판매 방식 자체를 점검 보고서에 그대로 적어 올린다",
        effect: { legitimacy: 13, trust: -3, capital: -6, time: -6, humanCost: 5, fatigue: 5 },
        next: "prologue04_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "p4_final_close",
        label: "스무 칸만 채우고 오늘 본 것은 한 줄도 적지 않는다",
        effect: { capital: 10, time: 6, legitimacy: -7, trust: -4, humanCost: 4, fatigue: -3 },
        next: "prologue04_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "prologue04_result",
      },
    ],
  },
};

/**
 * Everything else prologue 04 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const prologue04 = {
  id: "prologue04",
  nodes: prologue04Nodes,
  aftermath: {
    p4_aftershock: {
      phase: "AFTERMATH",
      title: "5월의 마지막 금요일",
      speaker: "도윤하",
      text: "열흘 뒤, 5월의 마지막 금요일 저녁입니다. 강서지점 실적판이 지워지고 6월 목표가 새로 올라갑니다. 지점은 12억을 채웠고, 4번 창구가 처음으로 1위입니다. 도윤하의 이름 아래 판매왕 스티커가 세 장이 되고, 그가 실적판 앞에서 찍은 사진을 당신에게 보냅니다. '본점 선배님 덕분입니다!' 느낌표가 두 개입니다. 같은 날 오후, 본점 인사부에서 짧은 공문 한 장이 옵니다. 6월 1일자 발령(어느 자리로 가라는 회사의 명령) 예정 대상에 당신 이름이 있고, 가는 곳 칸은 아직 비어 있습니다. 창밖은 초여름이고, 골목 반찬가게에는 아직 불이 켜져 있습니다. 통장 여섯 개는 그대로 있고, 아무도 아직 아무 손해도 보지 않았습니다. 그게 지금 가장 무서운 부분입니다.",
      memo: ["강서지점 5월 목표 12억 달성 -- 4번 창구 1위", "도윤하 판매왕 스티커 3장", "인사부 공문: 6월 1일자 발령 대상, 가는 곳 칸 비어 있음", "골목 가입 6건 -- 손해 발생 0건"],
      triggers: ["affection", "fear", "choice"],
      choices: [
        { id: "p4_after_warn", label: "도윤하를 따로 불러 그가 판 것이 무엇인지 직접 말해 준다", effect: { trust: 13, humanCost: -6, legitimacy: -5, capital: -4, time: -3, fatigue: 4 }, next: "prologue04_result", cognition: { reframing: 2 } },
        { id: "p4_after_report", label: "창구 판매 방식을 정식 보고로 올려 절차를 밟게 한다", effect: { legitimacy: 14, trust: -5, capital: -5, time: -5, humanCost: 6, fatigue: 5 }, next: "prologue04_result", cognition: { inference: 2, persistence: 1 } },
        { id: "p4_after_quiet", label: "점검 결과를 양식대로만 적고 6월 발령을 기다린다", effect: { capital: 9, time: 7, trust: -7, legitimacy: -6, humanCost: 5, fatigue: -6 }, next: "prologue04_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["p4_final", "p4_aftershock"],
  connectiveScenes: [
    ["p4_ledger", "p4_window", "p4_quota", "4월 20일부터", "도윤하", "점심 전에 도윤하가 창구 단말에서 판매 기록을 뽑아 줍니다. 판매 개시일은 4월 20일, 대출이 승인되고 여드레 뒤입니다. 강서지점은 26일 동안 213건을 팔았습니다. 화면 아래쪽에 기준가(그날그날 상품 값을 매긴 숫자)가 매일 한 줄씩 찍혀 있는데, 창구 직원 누구도 그 줄을 본 적이 없다고 합니다. 213건 중 47건이 4번 창구입니다. 도윤하가 목록을 스크롤하며 이름을 소리 내어 읽습니다. 서른한 번째에서 그가 멈춥니다. '이분은 저 결혼식에도 오셨어요.' 그가 웃습니다. '제가 잘 판 게 아니라, 이 동네가 저를 아는 거예요.'", ["판매 개시 4월 20일 -- 대출 승인 8일 뒤", "강서지점 26일간 213건", "4번 창구 47건 -- 이름 아는 손님 31명"], ["47건의 손님 명단을 도윤하와 한 줄씩 같이 확인한다", "판매 기록 전체를 내려받아 점검 파일로 봉인한다", "숫자만 집계표에 옮기고 이름 칸은 비워 둔다"]],
    ["p4_script", "p4_quota", "p4_visit", "3분 대본", "배승호", "회의실을 나오다 배승호가 창구 서랍 하나를 열어 보여 줍니다. 코팅된 A4 한 장이 서랍 바닥에 깔려 있고, 여섯 개 서랍이 전부 똑같습니다. 제목은 '스마트물류 3호 응대 요령', 분량은 앞면뿐이고 읽는 데 3분이 걸립니다. 첫 줄은 '적금 만기 안내와 함께 자연스럽게'입니다. 배승호가 지난달 미스터리 쇼퍼(손님인 척 찾아와 판매 과정을 몰래 확인하는 사람) 점검 결과지를 꺼냅니다. 강서지점 A등급. 평가 항목은 여섯 개고, 여섯 개 전부 대본에 그대로 있습니다. '대본대로 하면 A가 나와요. 그럼 우리 애들이 뭘 잘못한 겁니까?'", ["창구 서랍 6개 전부 동일한 코팅 대본", "대본 낭독 시간 3분 -- 본점 배포", "지난달 미스터리 쇼퍼 점검 A등급"], ["이 대본을 만든 부서가 어디인지 지점장 앞에서 묻는다", "대본과 설명서가 다른 문장 열한 개를 문서로 정리한다", "대본은 본점 소관이라며 점검 범위에서 뺀다"]],
    ["p4_list", "p4_visit", "p4_final", "골목 여섯 사람", "신영란", "신영란이 평상에서 전화를 몇 통 겁니다. 20분 만에 여섯 명이 모입니다. 세탁소, 과일가게, 열쇠집, 건너편 분식집, 그리고 떡방 옆 그릇가게 부부입니다. 통장 여섯 개의 상품명이 전부 같습니다. 가입 날짜는 3월 18일부터 4월 9일 사이로 몰려 있고, 금액은 600만 원에서 2,000만 원까지입니다. 여섯 명 다 4번 창구에서 가입했고, 여섯 명 다 '적금 같은 것'이라고 말합니다. 열쇠집 아저씨가 웃으며 묻습니다. '이거 잘못된 거예요? 그럼 도윤하 총각이 혼나요?' 아무도 자기 돈 이야기를 먼저 하지 않습니다.", ["골목 가입 6건 -- 총 7,400만 원", "가입 시기 3월 18일~4월 9일에 집중", "6명 전원 4번 창구, 전원 '적금'으로 인식"], ["여섯 분을 한자리에 모아 상품을 처음부터 다시 설명한다", "여섯 건의 가입 경위를 한 장씩 받아 적어 둔다", "오늘은 아무 말도 하지 않고 명단만 적어 온다"]],
  ],
  connectiveOrder: [["p4_window", "p4_ledger"], ["p4_quota", "p4_script"], ["p4_visit", "p4_list"]],
  choiceEffects: {
    p4_window: [
      { trust: 10, humanCost: -4, time: -5, capital: -2, fatigue: 4 },
      { legitimacy: 9, trust: 3, time: -5, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 4, trust: -3, humanCost: 3, fatigue: -3 },
    ],
    p4_quota: [
      { legitimacy: 9, trust: 4, time: -6, humanCost: 2, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -5, humanCost: 3, capital: -1, fatigue: 3 },
      { time: 6, capital: 4, trust: -3, legitimacy: -4, humanCost: 2, fatigue: -3 },
    ],
    p4_visit: [
      { trust: 10, humanCost: -5, time: -4, capital: -3, fatigue: 5 },
      { legitimacy: 9, trust: 3, time: -5, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 3, trust: -4, legitimacy: 2, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    p4_window: {
      voice: ["47건의 손님 명단을, 도윤하와 한 줄씩 같이 확인한다.", "판매 기록 전체를 내려받아, 점검 파일로 봉인한다.", "숫자만 집계표에 옮기고, 이름 칸은 비워 둔다."],
      echo: ["같이 읽으면 도윤하가 서른한 명의 사연을 전부 말합니다. 마흔일곱 번째 이름에서 그가 처음으로 말을 멈춥니다.", "봉인하면 기록은 지점 손을 떠납니다. 도윤하는 그 파일에 자기 이름이 몇 번 들어갔는지 모릅니다.", "이름 칸이 비면 집계표는 깔끔해집니다. 213이라는 숫자에는 아무 얼굴도 남지 않습니다."],
    },
    p4_quota: {
      voice: ["이 대본을 만든 부서가 어디인지, 지점장 앞에서 묻는다.", "대본과 설명서가 다른 문장 열한 개를, 문서로 정리한다.", "대본은 본점 소관이라며, 점검 범위에서 뺀다."],
      echo: ["물으면 배승호가 파일 속성을 열어 보여 줍니다. 만든 곳은 지점이 아니라 당신이 앉아 있던 층입니다.", "열한 개를 정리하면 두 문장이 정반대라는 게 드러납니다. 대본은 '원금이 지켜집니다'라고 읽게 되어 있습니다.", "범위에서 빼면 오늘 점검은 두 시간 일찍 끝납니다. 대본은 내일도 여섯 개 서랍에 그대로 깔려 있습니다."],
    },
    p4_visit: {
      voice: ["여섯 분을 한자리에 모아, 상품을 처음부터 다시 설명한다.", "여섯 건의 가입 경위를, 한 장씩 받아 적어 둔다.", "오늘은 아무 말도 하지 않고, 명단만 적어 온다."],
      echo: ["설명이 끝나면 아무도 화를 내지 않습니다. 열쇠집 아저씨가 '그 총각한테는 말하지 말아요'라고 합니다.", "여섯 장이 모이면 문장이 거의 같습니다. '적금보다 조금 더 나온다고 했어요'가 여섯 번 나옵니다.", "명단만 들고 나오면 골목은 아까와 똑같습니다. 신영란이 김치 한 통을 봉투에 넣어 줍니다."],
    },
  },
  reactionScenes: [
    ["p4_ledger_reaction", "p4_ledger", "p4_quota", "이건 점검이 아니야", "오진우", "판매 기록을 받자마자 오진우가 전화를 겁니다. 본점 자기 자리에서 목소리를 낮춘 티가 납니다. '그거 점검 아니야. 정리야. 반대 의견 쓴 사람한테 판매 잘됐는지 확인하고 오라는 거, 그게 무슨 뜻이겠어.' 그가 잠깐 말을 고릅니다. '나는 너 편이야. 그래서 말하는 건데, 거기서 뭘 크게 만들면 6월에 네 자리가 어디로 갈지 아무도 못 정해 줘.' 수화기 너머로 팀 회의 시작을 알리는 소리가 들립니다. 그가 마지막에 덧붙입니다. '창구 애들은 아무 잘못 없어. 그건 나도 알아. 그러니까 더 조심하라고.'", ["오진우에게 창구에서 본 것을 그대로 다 말한다", "점검 범위를 문서로 정해 달라고 팀에 공식 요청한다", "걱정 말라고만 하고 전화를 먼저 끊는다"]],
    ["p4_script_reaction", "p4_script", "p4_visit", "22쪽 중 4쪽", "반재욱", "지점 뒷문 계단에서 낯선 사람이 수첩을 펴고 서 있습니다. 감사팀 조사역 3년차 반재욱입니다. 본점 정기 점검 일정과 겹쳐 내려왔다고 합니다. 그가 창구 배포본 4쪽과 원본 22쪽을 나란히 놓습니다. '빠진 18쪽에 무슨 말이 있는지 보셨습니까. 저는 봤습니다. 그리고 이게 왜 4쪽이 됐는지 물어볼 데가 없습니다.' 그가 수첩에 오늘 날짜와 시각을 적습니다. '저는 아직 3년차라 아무것도 못 바꿉니다. 대신 적습니다. 언젠가 누가 이 수첩을 찾을 때가 오면, 그때는 날짜가 있어야 하니까요.'", ["반재욱과 빠진 18쪽을 같이 맞춰 본다", "감사팀 공식 조사로 넘겨 달라고 요청한다", "감사팀이 낄 일이 아니라며 혼자 하겠다고 한다"]],
    ["p4_list_reaction", "p4_list", "p4_final", "김치 한 통", "신영란", "사람들이 흩어지고 신영란이 김치통 하나를 따로 쌉니다. 4번 창구 총각 갖다주라고 합니다. '지난주에 와서 한 통 사 갔는데, 어머니가 요즘 입맛이 없으시다고 하더라고요.' 그가 봉투를 묶다 말고 당신을 봅니다. '아까부터 말을 안 하시는데요. 우리 돈 어떻게 되는 거예요?' 처음으로 자기 돈 이야기를 합니다. 그리고 곧바로 덧붙입니다. '아니, 잘못되면 그 총각이 물어내야 되는 건 아니죠? 그건 아니어야 하는데.' 김치통은 아직 당신 손에 있습니다.", ["돈이 어떻게 되는지 아는 대로 신영란에게 말한다", "지금 답할 수 없다며 확인해서 서면으로 알려 주겠다고 한다", "김치통만 받아 들고 아무 말 없이 지점으로 돌아간다"]],
  ],
  reactionEffects: {
    p4_ledger: [
      { trust: 9, humanCost: -3, legitimacy: -2, time: -3, fatigue: 3 },
      { legitimacy: 10, trust: 2, time: -5, capital: -3, fatigue: 3 },
      { time: 5, capital: 4, trust: -4, humanCost: 3, fatigue: -3 },
    ],
    p4_script: [
      { legitimacy: 9, trust: 5, time: -4, humanCost: 2, fatigue: 4 },
      { legitimacy: 11, trust: -3, capital: -5, time: -4, humanCost: 4, fatigue: 3 },
      { time: 4, capital: 4, trust: 2, legitimacy: -5, humanCost: 3, fatigue: -3 },
    ],
    p4_list: [
      { trust: 10, humanCost: -5, legitimacy: -3, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 3, time: -5, humanCost: 2, capital: -2, fatigue: 3 },
      { time: 5, capital: 3, trust: -5, humanCost: 4, fatigue: -3 },
    ],
  },
  reactionCopy: {
    p4_ledger: {
      voice: ["창구에서 본 것을, 오진우에게 그대로 다 말한다.", "점검 범위를 문서로 정해 달라고, 팀에 공식 요청한다.", "걱정 말라고만 하고, 전화를 먼저 끊는다."],
      echo: ["다 말하면 오진우가 한참 조용합니다. 그리고 '나도 그 대본 회의에 들어갔었어'라고 합니다.", "요청은 접수됩니다. 범위가 문서가 되면 당신이 본 것도 그 문서 안에 들어가야 합니다.", "먼저 끊으면 오진우가 문자를 한 줄 보냅니다. '내가 아버지 얘기 왜 했는지 생각해 봐.'"],
    },
    p4_script: {
      voice: ["반재욱과 함께, 빠진 18쪽을 맞춰 본다.", "감사팀 공식 조사로 넘겨 달라고, 요청한다.", "감사팀이 낄 일이 아니라며, 혼자 하겠다고 한다."],
      echo: ["맞춰 보면 두 사람 수첩에 같은 문장이 적힙니다. 반재욱이 자기 쪽 날짜 옆에 당신 이름을 적습니다.", "넘기면 조사는 시작됩니다. 조사가 제일 먼저 부르는 사람은 대본을 읽은 창구 여섯 명입니다.", "혼자 하겠다고 하면 반재욱이 수첩을 덮습니다. '그럼 오늘 본 건 제 수첩에만 있겠네요.'"],
    },
    p4_list: {
      voice: ["돈이 어떻게 되는지, 아는 대로 신영란에게 말한다.", "지금은 답할 수 없다며, 확인해서 서면으로 알려 주겠다고 한다.", "김치통만 받아 들고, 아무 말 없이 지점으로 돌아간다."],
      echo: ["말하면 신영란이 평상에 오래 앉아 있습니다. 그리고 '그 총각은 몰랐겠죠'라고 두 번 말합니다.", "서면으로 하겠다고 하면 그가 고개를 끄덕입니다. 종이로 받는 걸 그는 더 믿습니다.", "돌아오는 길 내내 김치통이 무겁습니다. 지점 냉장고에 넣어 두면 내일 도윤하가 웃으며 가져갈 겁니다."],
    },
  },
  reactionMemos: {
    p4_ledger_reaction: ["오진우: '그거 점검 아니야, 정리야'", "6월 자리 -- 아직 아무도 정해 주지 않음"],
    p4_script_reaction: ["반재욱 수첩 -- 3년차, 날짜부터 적는 사람", "배포본 4쪽 / 원본 22쪽"],
    p4_list_reaction: ["신영란의 첫 질문: '우리 돈 어떻게 되는 거예요'", "두 번째 질문: '그 총각이 물어내는 건 아니죠'"],
  },
  branchPlan: ["p4_window", 0, "p4_branch_drawer", "p4_branch_drawer_follow"],
  branchScenes: {
    // PROLOGUE 04's detour is the drawer. The case watches a sale from the side;
    // the side door is what the seller keeps where no procedure looks -- a spring
    // notebook of names that no audit form has a column for.
    p4_branch_drawer: {
      phase: "SIDE DOOR",
      title: "4번 서랍",
      speaker: "도윤하",
      text: "12쪽을 같이 읽자 손님이 서명을 멈추고 '그럼 다음에 올게요' 하고 돌아갑니다. 도윤하는 화를 내지 않습니다. 대신 점심시간에 당신을 창구 안쪽으로 부릅니다. 4번 서랍이 열립니다. 코팅된 3분 대본, 박하사탕 한 봉지, 손톱깎이, 그리고 스프링 수첩 한 권입니다. 수첩에는 이름이 마흔일곱 개 적혀 있고, 서른한 개 옆에 한 줄씩 붙어 있습니다. '떡방 사장님 -- 6월 적금 만기', '세탁소 아저씨 -- 아들 등록금 9월', '들깨한줌 어머니 -- 무릎 수술 8월'. 도윤하가 수첩을 덮지 않고 그대로 둡니다. '이거 보고 뭐라고 하시려는지 알아요. 실적 관리표 같죠. 저한테는 아니에요.'",
      memo: ["4번 서랍 -- 대본, 사탕, 스프링 수첩", "수첩의 이름 47개 · 메모 31줄", "메모 내용: 만기, 등록금, 수술 날짜", "돌아간 손님 1명 -- '다음에 올게요'"],
      triggers: ["affection", "trust", "selfAwareness"],
      choices: [
        { id: "p4_branch_drawer_a", label: "수첩을 덮고 오늘 돌아간 손님 이야기부터 같이 한다", effect: { trust: 12, humanCost: -4, time: -4, capital: -2, fatigue: 5 }, next: "p4_branch_drawer_follow", cognition: { persistence: 2 } },
        { id: "p4_branch_drawer_b", label: "메모가 붙은 31명이 어떤 상품을 들었는지 한 줄씩 대조한다", effect: { legitimacy: 11, trust: 3, time: -5, humanCost: 3, fatigue: 4 }, next: "p4_branch_drawer_follow", cognition: { inference: 2 } },
        { id: "p4_branch_drawer_c", label: "수첩은 점검과 상관없다며 서랍을 닫고 창구로 돌아간다", effect: { time: 6, capital: 5, trust: -4, humanCost: 3, fatigue: -3 }, next: "p4_branch_drawer_follow", cognition: { risk: 1 } },
      ],
    },
    p4_branch_drawer_follow: {
      phase: "SIDE DOOR",
      title: "잘 팔린 이유",
      speaker: "도윤하",
      text: "창구 뒤 좁은 탕비실에서 도윤하가 종이컵에 물을 받습니다. 그가 왜 매달 2등이나 3등인지 스스로 설명합니다. 말 잘해서가 아니라고 합니다. '제가 이걸 왜 적는지 아세요? 다음에 오시면 이름을 부르려고요. 이름 부르면 사람들이 웃어요.' 그가 종이컵을 내려놓습니다. '3년 동안 이거 하나로 버텼어요. 저 학교도 안 좋고 자격증도 없는데, 저 동네 사람들 이름은 다 알거든요.' 그리고 처음으로 목소리가 작아집니다. '아까 12쪽 읽으시는 거 봤어요. 저는 그 쪽수 본 적이 없어요. 있는 줄도 몰랐고요.' 그가 웃으려다 맙니다. '제가 지금 뭘 판 건지, 선배님은 아시죠?'",
      memo: ["도윤하 -- 3년차, 실적판 2~3위 유지", "판매 방식: 이름을 외우고 이름을 부른다", "설명서 12쪽 -- 본 적 없음", "탕비실 대화 시각 12시 41분"],
      triggers: ["selfAwareness", "affection", "helplessness"],
      choices: [
        { id: "p4_branch_drawer_follow_a", label: "12쪽이 무슨 뜻인지 지금 여기서 끝까지 설명해 준다", effect: { trust: 13, legitimacy: -3, humanCost: -5, capital: -4, time: -5, fatigue: 5 }, next: "p4_ledger", cognition: { reframing: 3 } },
        { id: "p4_branch_drawer_follow_b", label: "설명서를 못 받은 사실을 날짜와 함께 진술로 받아 둔다", effect: { legitimacy: 12, trust: 4, time: -6, humanCost: 3, fatigue: 4 }, next: "p4_ledger", cognition: { inference: 2 } },
        { id: "p4_branch_drawer_follow_c", label: "지금 말하면 그가 다친다며 점검이 끝난 뒤로 미룬다", effect: { time: 5, capital: 6, trust: -3, humanCost: 4, legitimacy: 2, fatigue: -3 }, next: "p4_ledger", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "p4_start",
    result: "p4_aftershock",
    defaultFree: "p4_route_system",
    // One branch, one counter. The chapter is a single line; the split is what
    // the analyst decides the sale was, and whose name that decision protects.
    choices: {},
    system: {
      route: "p4_route_system",
      final: "p4_final_system_route",
      title: "26일 동안",
      speaker: "오진우",
      text: "준비된 보기 밖의 문장을 쓰자 오진우가 본점 단말에서 전국 판매 기록을 뽑아 보내 줍니다. 4월 20일부터 26일 동안 2,140건, 1,180억입니다. 가입자 평균 나이는 61세이고, 가입 시간은 평균 4분 3초입니다. 서식에는 손님이 설명서를 전부 받았는지 표시하는 칸이 없습니다. 만들지 않았으니 어길 수도 없습니다. 그리고 가장 많이 판 창구 열 곳 중 아홉 곳이, 지난달 화이트보드에 이름이 지워지지 않은 채 남아 있던 창구입니다. 오진우가 파일 끝에 한 줄을 붙입니다. '이거 내가 보낸 거 아니야. 그리고 이 표에서 제일 무서운 칸은 숫자가 아니라 없는 칸이야.'",
      memo: ["26일간 2,140건 · 1,180억", "가입자 평균 61세 · 평균 상담 4분 3초", "설명서 전달 확인 칸 -- 서식에 없음", "상위 판매 창구 10곳 중 9곳이 전월 목표 미달"],
      routeChoices: [
        ["p4_route_system_freeze", "오늘 안에 본점에 판매를 멈춰 달라고 요청한다", { legitimacy: 12, trust: 5, capital: -8, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["p4_route_system_call", "가장 많이 판 창구 열 곳에 먼저 전화를 걸어 사실을 알린다", { trust: 11, legitimacy: 4, humanCost: -5, capital: -5, time: -7, fatigue: 6 }, { reframing: 2 }],
        ["p4_route_system_drop", "전국 숫자는 접어 두고 강서지점 점검만 끝낸다", { time: 7, capital: 6, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "창구가 파는 상품에 설명 시간 하한을 두자고 제안한다", { legitimacy: 13, trust: 6, capital: -7, humanCost: -4, time: -2, fatigue: 7 }, { reframing: 3 }],
      ["b", "전국 표는 두고 강서지점 47건만 다시 확인한다", { capital: 7, time: 6, trust: -4, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "2,140명에게 설명서 22쪽을 전부 보내자고 요구한다", { legitimacy: 9, trust: 9, capital: -8, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "p4_evidence_turn",
    result: "p4_aftershock",
    sourceRoutes: ["p4_window", "p4_quota", "p4_visit", "p4_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 3분 대본 옆에 놓고, 이 한 장을 누가 언제 만들었는지 맞춰 본다.",
    entryEcho: "단서를 대면 대본의 작성 기록이 열립니다. 파는 손과 문장을 고른 손은 같은 층에 있지 않습니다.",
    title: "대본을 만든 손",
    speaker: "반재욱",
    text: "단서를 맞추자 '스마트물류 3호 응대 요령' 파일의 작성 기록이 열립니다. 만든 곳은 강서지점이 아니라 본점 기업금융전략팀이고, 작성 시각은 4월 12일 17시 40분입니다. 2023-0412가 승인된 그날, 승인이 난 지 두 시간 뒤입니다. 같은 계정이 같은 밤에 설명서 창구 배포본을 22쪽에서 4쪽으로 줄였습니다. 빠진 문장 가운데 12쪽의 한 줄이 있습니다. 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)이 180%를 넘으면 은행이 대출을 먼저 회수할 수 있고, 그때 이 상품의 돈은 맨 뒤로 밀린다는 문장입니다. 상담 녹취(대화를 녹음해 남기는 일) 의무 칸도 배포본에서는 사라졌습니다. 반재욱이 수첩을 덮습니다. '팔린 건 두 시간 만에 만들어졌고, 판 사람은 그게 언제 만들어졌는지도 모릅니다.'",
    memo: ["대본 작성: 본점 기업금융전략팀 계정, 4월 12일 17시 40분", "같은 밤 배포본 22쪽 → 4쪽", "빠진 문장: 180% · 회수 · 맨 뒤로 밀림", "빠진 칸: 상담 녹취 의무"],
    triggers: ["injustice", "system", "manipulation"],
    entryEffect: { legitimacy: 7, trust: 4, time: -4, capital: -2, fatigue: 4 },
    choices: [
      ["p4_evidence_turn_attach", "대본 작성 기록을 임경수와 감사팀에 동시에 넘긴다", { legitimacy: 13, trust: 5, capital: -8, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["p4_evidence_turn_hold", "작성 기록은 쥐고 있다가 점검 보고가 반려되면 꺼낸다", { capital: 9, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["p4_evidence_turn_share", "빠진 그 한 줄을 창구 여섯 명에게 먼저 보여 준다", { trust: 12, legitimacy: 6, capital: -7, humanCost: -6, time: -1, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "p4_branch_drawer",
    systemNext: "p4_route_system",
    evidenceNext: "p4_evidence_turn",
    routeLabel: "직전 사건에서 배운 손버릇대로 4번 창구 서랍부터 열어 본다",
    systemLabel: "직전 자유응답 문장이 창구 응대 대본에도 들어가 있는지 본다",
    evidenceLabel: "직전 단서를 붙여 3분 대본을 누가 언제 만들었는지 연다",
  },
  openingRoutes: {
    p3_after_appeal: "p4_start_appeal",
    p3_after_copy: "p4_start_copy",
    p3_after_accept: "p4_start_accept",
  },
  openingCopy: {
    p4_start_appeal: ["재심을 건 사람의 강서지점", "오진우", "당신은 반려를 그대로 두지 않고 재심을 걸었습니다. 5월 12일 금요일 오후, 답이 한 줄로 왔습니다. '재심 청구 건, 다시 볼 이유 없음.' 그 한 줄 말고는 아무것도 적혀 있지 않고, 서명란에는 부서 도장만 있습니다. 그리고 다음 월요일 아침, 당신은 강서지점 객장에 서 있습니다. 손에 든 종이의 제목은 '판매 적정성 사후 점검'입니다. 오진우가 지점 앞까지 따라 나와 담배를 물었다 도로 넣습니다. '재심 결과 봤어. 사흘 만에 답 온 거, 그거 읽어 보고 답한 게 아니야.' 그가 객장 안 실적판을 턱으로 가리킵니다. '재심 건 사람한테 이 일 주는 거, 우연 아니라고 나는 봐.'", ["재심 청구 결과: '다시 볼 이유 없음' -- 사흘 만", "통지문 서명란: 부서 도장만", "점검 배정일: 결과 통지 다음 근무일"]],
    p4_start_copy: ["사본을 가진 사람의 강서지점", "임경수", "당신은 반려된 의견서의 사본을 한 부 남겼습니다. 그 종이는 지금 가방 안쪽 주머니에 있고, 객장에서 가방을 열 때마다 손끝에 걸립니다. 강서지점으로 내려가라는 말은 금요일 퇴근 무렵에 왔습니다. 제목은 '판매 적정성 사후 점검', 기간은 하루입니다. 지하철 안에서 임경수가 전화를 겁니다. 목소리가 낮고 짧습니다. '그 종이 어디 있는지만 알고 있게. 오늘은 꺼내지 말고.' 잡음 사이로 종이 묶는 소리가 들립니다. '내가 아는 사람 중에 사본을 남긴 사람은 자네가 두 번째야. 첫 번째는 그걸 12년 동안 한 번도 못 꺼냈고.'", ["의견서 사본 1부 -- 가방 안쪽 주머니", "점검 통보: 금요일 퇴근 무렵, 기간 하루", "임경수: '오늘은 꺼내지 말고'"]],
    p4_start_accept: ["반려를 받아들인 사람의 강서지점", "한서윤", "당신은 반려를 받아들였습니다. 서명하고, 돌아서고, 다음 서류를 폈습니다. 그리고 2주 뒤 이 일이 왔습니다. 제목은 '판매 적정성 사후 점검', 담당 한 명, 기간 하루, 장소 강서지점입니다. 월요일 아침 로비에서 한서윤이 서류를 건넵니다. 그가 당신 얼굴을 잠깐 봅니다. '이건 벌이 아니에요. 그렇게 보이는 건 알아요.' 그가 엘리베이터 버튼을 누르고 문이 닫히기 전에 덧붙입니다. '가서 보고 오세요. 당신이 쓴 게 맞았는지, 거기서 알게 될 거예요. 그게 제일 아픈 방식으로요.'", ["반려 수용 후 2주 -- 심사 업무 재배정", "점검 배정: 담당 1명, 기간 하루", "한서윤: '벌이 아니에요'"]],
  },
  openingSignatures: {
    p4_start_appeal: {
      label: "기각 통지를 들고 온 김에 창구 사람들에게 사정부터 말한다",
      effect: { trust: 12, humanCost: -3, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "기각 통지를 들고 온 김에, 창구 사람들에게 사정부터 말한다.",
      echo: "말하면 창구 여섯 명이 잠깐 조용해집니다. 도윤하가 제일 먼저 '그럼 저희가 뭘 도와드리면 돼요?'라고 묻습니다.",
    },
    p4_start_copy: {
      label: "가방 속 사본과 오늘 볼 판매 기록을 같은 파일에 넣기로 한다",
      effect: { legitimacy: 12, trust: -1, capital: -4, time: -6, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "가방 속 사본과 오늘 볼 판매 기록을, 같은 파일에 넣기로 한다.",
      echo: "한 파일이 되면 반대 의견과 판매 실적이 나란히 놓입니다. 날짜가 여드레 차이라는 것이 첫 장에 보입니다.",
    },
    p4_start_accept: {
      label: "이 점검을 왜 나에게 맡겼는지 한서윤에게 그 자리에서 묻는다",
      effect: { trust: 11, legitimacy: 5, humanCost: 3, time: -4, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "이 점검을 왜 나에게 맡겼는지, 한서윤에게 그 자리에서 묻는다.",
      echo: "묻자 한서윤이 닫히던 문을 손으로 잡습니다. '제가 골랐어요. 다른 사람이 가면 아무것도 안 보고 올 테니까요.'",
    },
  },
  voiceLines: {
    // PROLOGUE 04. Every line here is said next to a counter where someone is
    // smiling, so none of them is allowed to sound like an audit finding.
    p4_start_open: "창구 뒤에 서기 전에, 왜 왔는지 행원들에게 먼저 말한다.",
    p4_start_board: "실적판과 이번 달 판매 목표 공문부터, 사진으로 남긴다.",
    p4_start_quick: "점검표 스무 칸만 채우고, 오늘 안에 본점으로 올라간다.",
    p4_window_stop: "서명 전에 끼어들어, 설명서 12쪽을 손님과 같이 읽는다.",
    p4_window_script: "대본과 설명서를 나란히 놓고, 다른 문장을 한 줄씩 적는다.",
    p4_window_watch: "끼어들지 않고, 오전 판매 여섯 건을 끝까지 지켜본다.",
    p4_branch_drawer_a: "수첩을 덮고, 오늘 돌아간 손님 이야기부터 같이 한다.",
    p4_branch_drawer_b: "메모가 붙은 31명이 어떤 상품을 들었는지, 한 줄씩 대조한다.",
    p4_branch_drawer_c: "수첩은 점검과 상관없다며, 서랍을 닫고 창구로 돌아간다.",
    p4_branch_drawer_follow_a: "12쪽이 무슨 뜻인지, 지금 여기서 끝까지 설명해 준다.",
    p4_branch_drawer_follow_b: "설명서를 못 받은 사실을, 날짜와 함께 진술로 받아 둔다.",
    p4_branch_drawer_follow_c: "지금 말하면 그가 다친다며, 점검이 끝난 뒤로 미룬다.",
    p4_quota_erase: "목표를 못 채운 창구 이름부터, 지워 달라고 지점장에게 말한다.",
    p4_quota_trace: "비어 있는 승인 칸을, 점검 보고서에 그대로 옮겨 적는다.",
    p4_quota_skip: "목표는 지점 사정이라며, 건수만 세고 회의실을 나온다.",
    p4_visit_read: "평상에 앉아, 설명서 22쪽을 처음부터 끝까지 읽어 드린다.",
    p4_visit_record: "3월 22일 판매가 어떻게 이뤄졌는지 확인해, 점검 기록에 남긴다.",
    p4_visit_leave: "아직 손해가 난 것은 아니라며, 점검 대상에서 빼고 돌아선다.",
    p4_final_tell: "지금 여기서, 도윤하에게 이 상품이 무엇인지 그대로 말해 준다.",
    p4_final_file: "판매 방식 자체를, 점검 보고서에 그대로 적어 올린다.",
    p4_final_close: "스무 칸만 채우고, 오늘 본 것은 한 줄도 적지 않는다.",
    p4_after_warn: "도윤하를 따로 불러, 그가 판 것이 무엇인지 직접 말해 준다.",
    p4_after_report: "창구 판매 방식을 정식 보고로 올려, 절차를 밟게 한다.",
    p4_after_quiet: "점검 결과를 양식대로만 적고, 6월 발령을 기다린다.",
    p4_route_system_freeze: "오늘 안에 본점에, 판매를 멈춰 달라고 요청한다.",
    p4_route_system_call: "가장 많이 판 창구 열 곳에, 먼저 전화를 걸어 사실을 알린다.",
    p4_route_system_drop: "전국 숫자는 접어 두고, 강서지점 점검만 끝낸다.",
    p4_final_system_route_a: "창구가 파는 상품에, 설명 시간 하한을 두자고 제안한다.",
    p4_final_system_route_b: "전국 표는 두고, 강서지점 47건만 다시 확인한다.",
    p4_final_system_route_c: "2,140명에게, 설명서 22쪽을 전부 보내자고 요구한다.",
    p4_evidence_turn_attach: "대본 작성 기록을, 임경수와 감사팀에 동시에 넘긴다.",
    p4_evidence_turn_hold: "작성 기록은 쥐고 있다가, 점검 보고가 반려되면 꺼낸다.",
    p4_evidence_turn_share: "빠진 그 한 줄을, 창구 여섯 명에게 먼저 보여 준다.",
  },
  echoReplies: {
    // PROLOGUE 04.
    p4_start_open: "말하면 창구 여섯 명이 하던 일을 멈춥니다. 도윤하가 제일 먼저 의자를 하나 끌어다 놓습니다.",
    p4_start_board: "사진은 스물두 장이 됩니다. 실적판은 금요일이면 지워지고, 사진에는 지워지기 전이 남습니다.",
    p4_start_quick: "스무 칸은 두 시간이면 찹니다. 남은 여섯 시간 동안 객장에서는 열한 건이 더 팔립니다.",
    p4_window_stop: "끼어들면 손님이 서명을 멈추고 '다음에 올게요' 하고 갑니다. 도윤하는 화를 내지 않고 당신을 봅니다.",
    p4_window_script: "나란히 놓으면 다른 문장이 열한 개 나옵니다. 그중 두 개는 뜻이 정반대입니다.",
    p4_window_watch: "여섯 건이 다 팔립니다. 평균 3분 40초였고, 여섯 명 다 웃으면서 나갔습니다.",
    p4_branch_drawer_a: "수첩을 덮으면 도윤하가 돌아간 손님 이야기를 합니다. '그분 다음 주에 또 오실 거예요. 저 믿으시거든요.'",
    p4_branch_drawer_b: "대조하면 31명 중 24명이 같은 상품입니다. 메모의 날짜와 만기가 겹치는 사람이 아홉 명입니다.",
    p4_branch_drawer_c: "서랍이 닫히면 오후 판매는 예정대로 이어집니다. 수첩은 저녁에 다시 열립니다.",
    p4_branch_drawer_follow_a: "설명이 끝나자 도윤하가 종이컵을 오래 들고 있습니다. '그럼 저는 그동안 뭘 한 거예요?'",
    p4_branch_drawer_follow_b: "진술이 남으면 날짜가 생깁니다. 그 날짜는 나중에 도윤하를 지킬 수도, 도윤하를 가리킬 수도 있습니다.",
    p4_branch_drawer_follow_c: "미루면 오늘 오후에 아홉 건이 더 나갑니다. 도윤하는 그중 세 건을 팝니다.",
    p4_quota_erase: "지워 달라고 하면 배승호가 마커를 듭니다. 그리고 '지우면 다음 달에 다시 적힙니다'라고 합니다.",
    p4_quota_trace: "옮겨 적으면 보고서에 이름 없는 도장이 하나 들어갑니다. 그 도장을 찍은 부서가 당신 부서입니다.",
    p4_quota_skip: "건수만 세면 점검은 빨라집니다. 화이트보드의 두 이름은 6월에도 그대로 남습니다.",
    p4_visit_read: "22쪽을 다 읽는 데 40분이 걸립니다. 신영란이 다 듣고 나서 '그럼 그 총각은 이걸 알았대요?'라고 묻습니다.",
    p4_visit_record: "기록이 남으면 3월 22일은 날짜가 됩니다. 그 날짜에 창구에 앉아 있던 사람 이름도 같이 남습니다.",
    p4_visit_leave: "빼고 돌아서면 오늘은 아무 일도 없습니다. 신영란은 2년 뒤에 보증금을 올려 줄 생각을 계속합니다.",
    p4_final_tell: "말해 주면 도윤하가 한참 서 있습니다. 그리고 수첩을 펴서 서른한 개 이름을 다시 셉니다.",
    p4_final_file: "보고서가 올라가면 절차가 시작됩니다. 절차가 제일 먼저 부르는 사람은 대본을 읽은 창구 여섯 명입니다.",
    p4_final_close: "스무 칸이 다 차면 점검은 '특이사항 없음'으로 끝납니다. 6월에도 상품은 팔리고, 도윤하는 1위가 됩니다.",
    p4_after_warn: "따로 부르면 도윤하가 웃음을 멈춥니다. 그 밤에 그는 수첩을 들고 골목을 두 시간 걷습니다. 기록에는 아무것도 남지 않습니다.",
    p4_after_report: "보고가 올라가면 다음 주에 강서지점 여섯 명이 먼저 불려 갑니다. 대본을 만든 층에서는 아무도 불려 가지 않습니다.",
    p4_after_quiet: "그대로 적으면 아무 일도 없었던 것이 됩니다. 3년 뒤 도윤하는 이 여름을 혼자 기억합니다.",
    p4_route_system_freeze: "요청하면 회신이 옵니다. '상품 판매 중단은 이 부서 권한이 아님.' 발신은 당신 부서입니다.",
    p4_route_system_call: "열 곳에 걸면 여섯 곳이 받습니다. 세 곳은 '저희도 이상하다고 생각했어요'라고 합니다.",
    p4_route_system_drop: "접어 두면 전국 표는 아무 데도 가지 않습니다. 2,140건은 다음 주에 2,600건이 됩니다.",
    p4_final_system_route_a: "하한이 생기면 3분짜리 상담은 불가능해집니다. 대신 하루에 팔 수 있는 건수도 줄고, 목표는 그대로입니다.",
    p4_final_system_route_b: "47건은 다시 확인됩니다. 나머지 2,093건은 오늘도 아무도 다시 보지 않습니다.",
    p4_final_system_route_c: "22쪽이 다 나가면 2,140통의 우편이 발송됩니다. 받은 사람 중 몇은 그날 지점으로 전화를 겁니다.",
    p4_evidence_turn_attach: "동시에 넘기면 두 사람이 같은 파일을 같은 날 엽니다. 임경수는 그 기록을 종이로 뽑아 끈으로 묶습니다.",
    p4_evidence_turn_hold: "쥐고 있으면 나중에 강한 패가 됩니다. 그 사이 6월 판매 목표가 창구별로 내려옵니다.",
    p4_evidence_turn_share: "보여 주면 여섯 명이 그 한 줄을 돌려 읽습니다. 다 읽고 나서 아무도 먼저 말을 꺼내지 못합니다.",
  },
  characterProfiles: {
    배승호: {
      role: "KD은행 강서지점장",
      stance: "실적 · 지점 보호 · 받은 대로",
      job: "판매 목표가 사람에서 시작되지 않았다는 것을 보여 준다. 그는 나누기만 했다.",
      appearance: "소매를 걷지 않은 셔츠, 늘 쥐고 있는 화이트보드 마커, 손님용 종이컵을 직접 뽑는 손.",
      thought: "나는 만든 적이 없다. 나눴을 뿐이다. 그런데 이름이 남는 건 나눠 받은 쪽이다.",
      gesture: "배승호는 곤란한 질문이 나오면 마커 뚜껑을 열었다 닫는다.",
      voice: "지점 사람 전부를 '우리 애들'이라고 부르고, 본점 이야기는 존댓말로 바꾼다.",
      line: "저 목표는 제가 만든 게 아니에요. 받아서 여섯으로 나눴을 뿐이고요.",
    },
    신영란: {
      role: "망원시장 반찬가게 들깨한줌 사장",
      stance: "생계 · 정 · 사람 먼저",
      job: "창구에서 팔린 것이 누구의 2년인지 얼굴로 보여 준다. 그는 상품이 아니라 사람을 믿었다.",
      appearance: "고무장갑 자국이 남은 손목, 앞치마 주머니의 통장, 평상 위에 늘 놓여 있는 김치통 뚜껑.",
      thought: "그 총각이 나쁜 걸 팔았을 리 없다. 그러니까 나쁜 건 다른 데 있다.",
      gesture: "신영란은 곤란한 이야기가 나오면 김치통 뚜껑부터 닫는다.",
      voice: "시장 말씨로 빠르게 말하다가, 돈 이야기에 닿으면 한 박자 느려진다.",
      line: "그 총각 참 착해요. 그런 사람이 나쁜 걸 팔았겠어요?",
    },
  },
  setting: { place: "KD은행 강서지점 객장", clock: "2023년 5월 15일 월요일 · 09시 20분" },
  sceneContext: {
    p4_start: {
      place: "KD은행 강서지점 객장",
      clock: "2023년 5월 15일 월요일 · 09시 20분",
      question: "반려 뒤에 온 일이 '판매 적정성 사후 점검'입니다. 무엇부터 하겠습니까?",
      lead: "객장 문을 열면 손님보다 먼저 보이는 것이 벽에 걸린 실적판입니다.",
    },
    p4_start_appeal: {
      place: "KD은행 강서지점 객장",
      clock: "2023년 5월 15일 월요일 · 09시 20분",
      question: "재심이 사흘 만에 기각되고 다음 근무일에 이 일이 왔습니다. 무엇부터 하겠습니까?",
      lead: "'다시 볼 이유 없음' 한 줄을 접어 넣은 가방을 들고 지점 문을 엽니다.",
    },
    p4_start_copy: {
      place: "KD은행 강서지점 객장",
      clock: "2023년 5월 15일 월요일 · 09시 20분",
      question: "가방 안쪽에 남겨 둔 사본이 있습니다. 오늘 이 사본을 어떻게 하겠습니까?",
      lead: "가방을 열 때마다 안쪽 주머니의 종이 한 장이 손끝에 걸립니다.",
    },
    p4_start_accept: {
      place: "KD은행 강서지점 객장",
      clock: "2023년 5월 15일 월요일 · 09시 20분",
      question: "받아들인 사람에게 온 하루짜리 점검입니다. 무엇부터 하겠습니까?",
      lead: "로비에서 받은 서류의 담당자 칸에는 당신 이름만 하나 적혀 있습니다.",
    },
    p4_window: {
      place: "KD은행 강서지점 · 4번 창구",
      clock: "2023년 5월 15일 · 10시 10분",
      question: "3분 12초 만에 상품 하나가 팔렸습니다. 이 자리에서 무엇을 하겠습니까?",
      lead: "접이식 의자를 창구 옆에 놓고 앉자, 손님 쪽 얼굴이 아니라 옆얼굴이 보입니다.",
    },
    p4_branch_drawer: {
      place: "KD은행 강서지점 · 창구 안쪽",
      clock: "2023년 5월 15일 · 12시 20분",
      question: "4번 서랍에 이름 마흔일곱 개가 적힌 수첩이 있습니다. 어떻게 하겠습니까?",
    },
    p4_branch_drawer_follow: {
      place: "KD은행 강서지점 · 탕비실",
      clock: "2023년 5월 15일 · 12시 41분",
      question: "그는 12쪽이 있는 줄도 몰랐다고 합니다. 지금 무엇이라 하겠습니까?",
    },
    p4_ledger: {
      place: "KD은행 강서지점 · 창구 단말",
      clock: "2023년 5월 15일 · 11시 30분",
      question: "26일 동안 213건이 팔렸고 47건이 4번 창구입니다. 이 기록을 어떻게 하겠습니까?",
    },
    p4_ledger_reaction: {
      place: "KD은행 강서지점 · 뒷문 계단",
      clock: "2023년 5월 15일 · 11시 50분",
      question: "사수가 이건 점검이 아니라 정리라고 합니다. 어떻게 답하겠습니까?",
    },
    p4_quota: {
      place: "KD은행 강서지점 2층 회의실",
      clock: "2023년 5월 15일 · 12시 50분",
      question: "판매 목표를 내려보낸 공문의 승인 칸이 비어 있습니다. 어떻게 하겠습니까?",
      lead: "화이트보드에는 채운 칸의 동그라미와, 못 채운 칸의 이름이 같이 남아 있습니다.",
    },
    p4_script: {
      place: "KD은행 강서지점 · 창구 서랍",
      clock: "2023년 5월 15일 · 13시 20분",
      question: "여섯 서랍에 똑같은 3분짜리 대본이 깔려 있습니다. 이 한 장을 어떻게 하겠습니까?",
    },
    p4_script_reaction: {
      place: "KD은행 강서지점 · 뒷문 계단",
      clock: "2023년 5월 15일 · 13시 40분",
      question: "감사팀 3년차가 배포본 4쪽과 원본 22쪽을 나란히 놓았습니다. 어떻게 하겠습니까?",
    },
    p4_visit: {
      place: "망원시장 · 반찬가게 들깨한줌",
      clock: "2023년 5월 15일 · 16시",
      question: "1,200만 원을 적금으로 알고 있는 사람이 앞에 있습니다. 무엇이라 하겠습니까?",
      lead: "가을떡방 셔터는 반쯤 내려가 있고, 쪽지 한 장이 바람에 들립니다.",
    },
    p4_list: {
      place: "망원시장 · 들깨한줌 앞 평상",
      clock: "2023년 5월 15일 · 16시 40분",
      question: "골목 여섯 명이 같은 통장을 들고 모였습니다. 어떻게 하겠습니까?",
    },
    p4_list_reaction: {
      place: "망원시장 · 들깨한줌 앞 평상",
      clock: "2023년 5월 15일 · 17시",
      question: "그가 처음으로 자기 돈 이야기를 꺼냈습니다. 무엇이라 답하겠습니까?",
    },
    p4_route_system: {
      place: "KD은행 강서지점 · 빈 상담실",
      clock: "2023년 5월 15일 · 18시",
      question: "26일 동안 2,140건이 나갔고 확인 칸은 서식에 없습니다. 이 표를 어떻게 하겠습니까?",
    },
    p4_final_system_route: {
      place: "KD은행 강서지점 · 빈 상담실",
      clock: "2023년 5월 15일 · 18시 30분",
      question: "이 판매에서 딱 하나만 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    p4_evidence_turn: {
      place: "KD은행 강서지점 · 문서 서버 접속 기록",
      clock: "2023년 5월 15일 · 19시",
      question: "3분 대본은 대출이 승인된 날 두 시간 뒤에 만들어졌습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    p4_final: {
      place: "KD은행 강서지점 객장 · 셔터 안",
      clock: "2023년 5월 15일 · 20시",
      question: "판 사람이 이게 괜찮은 상품이냐고 묻습니다. 이 판매에 대해 무엇을 하겠습니까?",
      lead: "형광등 두 줄만 켜진 객장에서 4번 서랍이 한 번 열렸다 닫힙니다.",
    },
    p4_aftershock: {
      place: "KD은행 강서지점 · 실적판 앞",
      clock: "2023년 5월 26일 금요일 · 저녁",
      question: "그가 1위가 됐고 당신에게는 6월 발령 공문이 왔습니다. 이 5월을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "p4-three-minute-script",
    title: "3분 대본을 만든 손",
    text: "창구 서랍의 '스마트물류 3호 응대 요령'은 2023-0412가 승인된 4월 12일 17시 40분, 본점 기업금융전략팀 계정이 만들었습니다. 같은 밤 설명서 배포본이 22쪽에서 4쪽으로 줄었고, 빠진 문장 안에 180%와 회수, 그리고 상담 녹취 의무가 들어 있었습니다.",
  },
  outcomes: {
    p4_after_warn: { tag: "직접 말한 결말", title: "판 사람에게 그가 판 것을 알려 줬다", text: "도윤하는 그날 밤 수첩을 들고 골목을 두 시간 걸었습니다. 그는 지켜졌고, 어느 기록에도 이 대화는 남지 않았습니다." },
    p4_after_report: { tag: "보고로 올린 결말", title: "창구 판매 방식이 정식 문서가 됐다", text: "절차는 시작됐습니다. 절차가 가장 먼저 부른 사람은 대본을 읽은 창구 여섯 명이었고, 대본을 만든 층에서는 아무도 불리지 않았습니다." },
    p4_after_quiet: { tag: "그대로 적은 결말", title: "점검은 '특이사항 없음'으로 끝났다", text: "스무 칸이 빈칸 없이 채워졌습니다. 6월에도 상품은 팔렸고, 3년 뒤 그 여름을 혼자 기억하는 사람이 하나 생겼습니다." },
  },
  carryovers: {
    p4_after_warn: { trust: 11, humanCost: -5, legitimacy: -4 },
    p4_after_report: { legitimacy: 12, trust: -4, humanCost: 5 },
    p4_after_quiet: { capital: 8, time: 6, trust: -8 },
  },
  continuityChallenges: {
    p3_after_appeal: { id: "protect-trust", title: "기각 통지를 들고 창구 사람들 곁에 서기", text: "재심은 사흘 만에 한 줄로 기각됐고, 그 다음 근무일에 이 점검이 왔습니다. 창구 사람들을 조사 대상이 아니라 같은 편으로 두는 선택을 찾아야 보너스가 열립니다." },
    p3_after_copy: { id: "use-reframe", title: "가방 속 사본으로 판 뒤집기", text: "반려된 의견서의 사본이 아직 당신 가방에 있습니다. 그 종이와 오늘의 판매 기록을 한자리에 놓아, 이 점검이 무엇을 보는 자리인지 다시 짜야 합니다." },
    p3_after_accept: { id: "repair-legitimacy", title: "잡무로 내려온 점검의 공정함 회복하기", text: "받아들인 사람에게 내려온 하루짜리 점검에는 범위도 근거도 적혀 있지 않습니다. 이 점검을 절차로 만들 수 있는 선택을 찾아야 합니다." },
  },
};
