/**
 * CASE 28 -- the fine print, read aloud in three minutes.
 *
 * Act five scatters the lab across the group, and every place someone lands
 * turns out to hold another link of the same chain. 도윤하 is sent from the
 * 강서지점 window to KD생명's call centre in 구로 for ten days and handed
 * "script 4": the standard call for telling a customer their claim is refused.
 * Her first name on the list is 채도훈, a lathe hand from 가온정밀 who now
 * works at the 끝까지정밀 cooperative. He lost the feeling in two fingers of his
 * right hand in February, and his disability payout of 4,200만 is refused on
 * clause 19 of the policy: he changed jobs without telling the insurer. Same
 * lathe, same hand -- only the name tag changed from 반장 to 조합원.
 *
 * The case walks the claim from a headset to a boardroom: a call floor where
 * the team metric is "refusals that stayed refused", a branch table in the
 * rice-cake shop covered in seventeen identical refusal letters, 권도현 taking
 * a steel ruler to a 6.5-point clause, a grey van filming a man working
 * left-handed, and a sales record showing that 도윤하 sold him the policy herself,
 * stapled to a factory loan. The laughter is character-made (a ruler, a
 * four-panel comic, 0.8 rice cakes per head), the anger is a metric, the grief
 * is a team leader who learned to read the script best because it was read to
 * her father, and the joy is the 179th call -- a customer ringing back to say
 * thank you, which the scoring system counts as a demerit. The evidence turn
 * finds who shortened the script: a claims-cost task force under the KD캐피탈
 * CEO's office, saving 180억 to plug the stalled 평택 site from 사건 26. The
 * case closes on an offer to pay one man in full if nobody asks about the other
 * 1,317, and 서하린 calls about Singapore.
 */
export const case28Nodes = {
  c28_start: {
    phase: "CASE 28 BRIEFING",
    title: "대본 4번",
    speaker: "도윤하",
    text:
      "월요일 밤 9시, KD생명 구로 콜센터 7층. 야간조 몇 자리만 켜진 상담석 사이에서 도윤하가 손을 흔듭니다. 그는 오늘 아침 강서지점에서 계열사(같은 그룹에 속한 다른 회사) KD생명으로 열흘 파견(잠시 다른 회사에 보내 일하게 하는 것)을 나왔습니다. 책상 위에 '거절'이라는 말이 열네 번 나오는 A4 한 장이 있습니다. '부지급(보험금을 주지 않기로 한 결정) 안내 표준 대본 4번.' 내일 오전 10시 통화 목록 첫 줄은 채도훈입니다. 가온정밀에서 23년 선반을 돌렸고 지금은 끝까지정밀 조합원입니다. 지난 2월 산업재해(일하다 다친 사고)로 오른손 두 손가락의 감각을 잃었고, 후유장해(치료가 끝나도 남는 장애) 보험금 4,200만 원이 약관(보험 계약의 세부 조건을 적은 문서) 한 줄로 거절됐습니다. 도윤하가 대본을 뒤집어 놓습니다. '평균 3분이면 끝난대요. 이 3분을 저는 어떻게 읽어야 해요?'",
    memo: [
      "대본 4번: 부지급 안내 · 평균 통화 3분",
      "채도훈(58) -- 끝까지정밀 조합원, 오른손 검지·중지 감각 상실",
      "청구 금액 4,200만 원 · 거절 근거 약관 제19조",
      "도윤하 파견 열흘 중 첫날 · 대본 속 '거절' 14번",
    ],
    triggers: ["injustice", "protection", "responsibility"],
    choices: [
      {
        id: "c28_start_visit",
        label: "대본을 읽기 전에 채도훈을 먼저 찾아가 사정을 듣는다",
        effect: { trust: 12, humanCost: -4, time: -5, capital: -2, fatigue: 4 },
        next: "c28_headset",
        cognition: { persistence: 2 },
      },
      {
        id: "c28_start_clause",
        label: "거절 근거가 된 제19조와 심사 기록부터 받아 본다",
        effect: { legitimacy: 11, time: -4, trust: -2, humanCost: 3, fatigue: 4 },
        next: "c28_headset",
        cognition: { inference: 2 },
      },
      {
        id: "c28_start_appeal",
        label: "대본은 도윤하에게 맡기고 이의신청 서류부터 빨리 넣는다",
        effect: { capital: 7, time: 6, legitimacy: -3, trust: 2, humanCost: 3, fatigue: 1 },
        next: "c28_headset",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c28_headset",
      },
    ],
  },
  c28_headset: {
    phase: "CALL FLOOR",
    title: "하루 180통",
    speaker: "연하진",
    text:
      "화요일 아침 9시, 칸막이마다 모니터 두 대가 달린 상담석 240개가 한꺼번에 켜집니다. 벽 전광판에는 대기 고객 수 옆에 오늘의 팀 지표가 떠 있습니다. '부지급 유지율 93.1%.' 거절한 결정을 고객이 끝내 뒤집지 못한 비율이고, 이 숫자가 팀 성과급에 들어갑니다. 12년 차 파트장 연하진이 도윤하에게 요령을 일러 줍니다. '욕이 들어오면 음소거 누르고 속으로 셋 세요. 그다음에 네, 고객님. 울면 세지 말고 기다리고요.' 오전에만 욕설이 스물두 통, 고맙다는 말이 한 통입니다. 10시 정각, 모니터에 채도훈의 이름이 뜹니다. 도윤하가 대본을 쥔 손을 무릎에 내려놓습니다. 헤드셋 너머에서 낮고 느린 목소리가 먼저 말합니다. '안 되는 거면 빨리 말해 줘요. 공장 들어가 봐야 돼서.'",
    memo: [
      "상담석 240석 · 1인 하루 할당 180통",
      "팀 지표: 부지급 유지율 93.1% -- 성과급 반영",
      "오전 욕설 22통, 감사 1통",
      "10:00 채도훈 통화 연결",
    ],
    triggers: ["injustice", "helplessness", "protection"],
    choices: [
      {
        id: "c28_headset_listen",
        label: "대본을 내려놓고 채도훈의 말을 끝까지 듣게 한다",
        effect: { trust: 11, humanCost: -5, time: -4, legitimacy: -2, fatigue: 5 },
        next: "c28_ruler",
        cognition: { persistence: 2 },
      },
      {
        id: "c28_headset_metric",
        label: "'부지급 유지율'이 성과급에 들어간 근거부터 문서로 요구한다",
        effect: { legitimacy: 10, trust: -3, time: -4, humanCost: 3, fatigue: 4 },
        next: "c28_ruler",
        cognition: { inference: 2 },
      },
      {
        id: "c28_headset_quota",
        label: "오늘 할당을 채우게 두고 채도훈에게는 퇴근 뒤 다시 건다",
        effect: { capital: 6, time: 6, trust: -4, humanCost: 4, fatigue: -2 },
        next: "c28_ruler",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c28_ruler",
      },
    ],
  },
  c28_ruler: {
    phase: "FINE PRINT",
    title: "6.5포인트",
    speaker: "권도현",
    text:
      "수요일 저녁, 회기동 헌책방 1층. 브릿지은행에서 퇴근하던 길이라는 권도현이 서류 가방에서 쇠자와 돋보기를 꺼냅니다. 채도훈의 보험 약관 87쪽을 펴고 제19조에 자를 댑니다. '본문은 9포인트, 이 조항만 6.5포인트입니다. 이 책을 전부 이 크기로 읽으면 4시간 12분. 시급으로 치면 읽는 사람이 적자입니다.' 내친김에 문가을이 보낸 떡 포장지의 원산지 표시까지 재더니 '이쪽이 더 큽니다'라고 적습니다. 제19조는 통지 의무(바뀐 사정을 보험회사에 알릴 의무) 조항입니다. 직업이 바뀌면 알려야 하고, 알리지 않으면 보험금을 주지 않을 수 있습니다. KD생명은 가온정밀 반장이던 채도훈이 끝까지정밀 조합원이 된 것을 직업 변경으로 봤습니다. 권도현이 자를 내려놓습니다. '같은 선반, 같은 손입니다. 바뀐 건 명찰뿐인데요.'",
    memo: [
      "약관 본문 9pt / 제19조 6.5pt",
      "약관 전체 낭독 예상 4시간 12분",
      "KD생명 판단: 반장 → 조합원 = 직업 변경",
      "KD생명 비공식 제안: 합의하면 절반 지급",
    ],
    triggers: ["injustice", "curiosity", "order"],
    choices: [
      {
        id: "c28_ruler_read",
        label: "채도훈과 약관을 한 줄씩 읽고 그의 말로 이의서를 쓴다",
        effect: { trust: 12, legitimacy: 3, humanCost: -4, time: -5, capital: -2, fatigue: 5 },
        next: "c28_factory",
        cognition: { persistence: 2 },
      },
      {
        id: "c28_ruler_mediate",
        label: "글자 크기와 설명 부족을 근거로 분쟁조정을 신청한다",
        effect: { legitimacy: 10, time: -5, trust: -2, humanCost: 3, fatigue: 4 },
        next: "c28_factory",
        cognition: { inference: 2 },
      },
      {
        id: "c28_ruler_half",
        label: "KD생명이 넌지시 내민 절반 지급 합의를 받아들이게 한다",
        effect: { capital: 8, time: 5, legitimacy: -3, trust: 2, humanCost: 4, fatigue: -2 },
        next: "c28_factory",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c28_factory",
      },
    ],
  },
  c28_factory: {
    phase: "FIELD SURVEY",
    title: "회색 승합차",
    speaker: "강태민",
    text:
      "토요일 오후, 끝까지정밀 공장. 주말 조합원 강태민이 선반 칩을 쓸다가 빗자루를 멈춥니다. 맞은편 편의점 앞에 사흘째 같은 회색 승합차가 서 있습니다. 그가 장갑을 벗어 조끼 주머니에 꽂고 건너가 창문을 두드립니다. 안에 있던 사람이 명함을 내밉니다. KD생명이 일을 맡긴 손해사정사(보험 사고의 손해를 조사해 금액을 정하는 사람) 사무소 직원입니다. 조수석에 망원 렌즈를 단 카메라가 있고, 채도훈이 왼손으로 공구를 드는 장면이 이틀 치 찍혀 있습니다. 직원이 난처하게 웃습니다. '일을 하실 수 있으면 장해가 아니라는 근거가 된대서요.' 공장 안에서 문하준이 그리던 스케치북을 덮습니다. 채도훈은 아무 말 없이 오른손을 작업복 주머니에 넣습니다.",
    memo: [
      "회색 승합차 사흘째 -- 손해사정사 사무소",
      "촬영분: 채도훈이 왼손으로 일하는 장면 이틀 치",
      "조사 목적: '일할 능력이 남아 있다'는 근거",
      "채도훈의 딸 채윤아, 간호대 4학년 -- 2학기 등록금 8월",
    ],
    triggers: ["injustice", "protection", "order"],
    choices: [
      {
        id: "c28_factory_guard",
        label: "촬영을 멈추게 하고 조합원들과 채도훈 곁을 지킨다",
        effect: { trust: 12, humanCost: -5, legitimacy: -2, time: -3, capital: -3, fatigue: 5 },
        next: "c28_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c28_factory_order",
        label: "촬영 영상과 조사 지시서를 정식으로 요청해 증거로 삼는다",
        effect: { legitimacy: 10, trust: 3, time: -5, humanCost: 3, fatigue: 5 },
        next: "c28_final",
        cognition: { inference: 2 },
      },
      {
        id: "c28_factory_settle",
        label: "등록금 날짜를 생각해 빠른 합의 쪽으로 채도훈을 설득한다",
        effect: { capital: 8, time: 5, trust: -3, humanCost: 4, fatigue: -2 },
        next: "c28_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c28_final",
      },
    ],
  },
  c28_final: {
    phase: "FINAL DECISION",
    title: "예외 한 건",
    speaker: "도윤하",
    text:
      "수요일 오후 4시, KD생명 본사 보상심사 회의실. 보상본부 서재윤 상무가 합의서 한 장을 내밉니다. 채도훈에게 4,200만 원 전액 지급. 다만 이름은 '예외 지급'이고, 제19조와 대본 4번, 손해사정사의 촬영을 더는 문제 삼지 않는다는 확인서에 도윤하와 당신이 함께 서명해야 합니다. 같은 조항으로 지난 3년 동안 거절된 사람은 1,318명입니다. 서 상무가 손목시계를 봅니다. '오늘 서명하시면 월요일에 입금됩니다. 따님 등록금 날짜, 저희도 압니다.' 도윤하가 가방에서 대본 4번을 꺼내 합의서 옆에 나란히 놓습니다. 손이 떨리지는 않습니다. '이분 한 분 받으시면, 나머지 1,317명한테는 다음 주에도 제가 이걸 읽어요. 제 목소리로요.'",
    memo: [
      "예외 지급 4,200만 원 -- 월요일 입금",
      "조건: 제19조·대본 4번·촬영을 문제 삼지 않는다는 확인서",
      "같은 조항 거절 3년 1,318명",
      "채윤아 2학기 등록금 납부 8월 초",
    ],
    triggers: ["choice", "injustice", "responsibility"],
    choices: [
      {
        id: "c28_final_both",
        label: "채도훈 지급은 받되 확인서는 빼고 1,318명 명단을 요구한다",
        effect: { trust: 10, legitimacy: 7, capital: -6, time: -6, humanCost: -3, fatigue: 6 },
        next: "case28_result",
        cognition: { reframing: 3 },
      },
      {
        id: "c28_final_clause",
        label: "제19조를 고치지 않으면 예외 지급도 받지 않겠다고 버틴다",
        effect: { legitimacy: 13, trust: 6, capital: -9, time: -7, humanCost: 4, fatigue: 6 },
        next: "case28_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c28_final_sign",
        label: "등록금을 위해 확인서에 서명하고 예외 지급을 받는다",
        effect: { capital: 11, humanCost: -5, trust: 4, legitimacy: -7, time: 6, fatigue: 2 },
        next: "case28_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case28_result",
      },
    ],
  },
};

/**
 * Everything else case 28 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case28 = {
  id: "case28",
  nodes: case28Nodes,
  aftermath: {
    c28_aftershock: {
      phase: "AFTERMATH",
      title: "헤드셋 반납",
      speaker: "도윤하",
      text: "파견 마지막 날 저녁 6시, 도윤하가 헤드셋을 소독 티슈로 닦아 반납함에 넣습니다. 그의 칸막이에는 문하준의 네 칸 만화가 붙어 있고, 연하진이 그 밑에 자기 글씨로 한 줄을 보탰습니다. '3분 안에 끊지 말 것.' 강태민이 채도훈 대신 들고 온 떡 상자를 층 전체에 돌리고, 권도현은 '한 사람당 떡 0.8개, 이 가격이면 적자입니다'라며 자기 몫을 신입 상담사에게 건넵니다. 그때 서하린에게서 전화가 옵니다. '해온파트너스 자문료(조언값이라며 내보낸 돈), 마지막 행방이 싱가포르예요. 돈을 받은 회사 이사 명단에 KD캐피탈 쪽 이름이 하나 있어요. 여권 있죠?'",
      memo: ["도윤하 파견 종료 -- 헤드셋 반납", "칸막이 메모: '3분 안에 끊지 말 것'", "서하린: 해온파트너스 자문료, 싱가포르", "다음 주 출국 가능 항공편 2편"],
      triggers: ["affection", "trust", "curiosity"],
      choices: [
        { id: "c28_after_warm", label: "콜센터 불이 꺼질 때까지 남아 상담사들과 떡을 나눈다", effect: { trust: 12, humanCost: -4, time: -3, capital: -3, fatigue: -7 }, next: "case28_result", cognition: { reframing: 2 } },
        { id: "c28_after_record", label: "제19조와 대본 4번을 나란히 적은 개정 요청서부터 문서로 남긴다", effect: { legitimacy: 14, trust: 5, time: -5, capital: -2, fatigue: 5 }, next: "case28_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c28_after_rush", label: "서하린의 전화에 곧장 싱가포르행 일정부터 잡는다", effect: { capital: 6, legitimacy: 5, trust: -6, humanCost: 4, fatigue: 6 }, next: "case28_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c28_final", "c28_aftershock"],
  connectiveScenes: [
    ["c28_mute", "c28_headset", "c28_ruler", "특별 응대팀", "연하진", "오후 휴게실, 연하진이 자판기 커피 두 잔을 뽑아 하나를 도윤하에게 건넵니다. 그리고 대본 4번의 맨 마지막 쪽을 펼쳐 보입니다. 작은 글씨로 된 분기표가 있습니다. 고객이 '금융감독원'이나 '기자'라는 말을 꺼내면 통화를 특별 응대팀으로 넘기라는 지시입니다. 그 팀으로 넘어간 건은 64%가 결국 보험금을 받습니다. 나머지는 7%입니다. 연하진이 빈 종이컵을 구깁니다. '크게 화내는 사람은 받아요. 조용히 네, 네 하는 사람은 못 받고요. 저는 12년 동안 그 조용한 사람들한테 전화했어요.'", ["대본 4번 마지막 쪽: 특별 응대팀 분기표", "분기어: '금융감독원', '기자'", "특별 응대팀으로 간 건 지급률 64% / 일반 건 7%"], ["모든 고객에게 특별 응대팀으로 가는 말을 똑같이 알린다", "분기표를 문서로 받아 지급 기록과 대조한다", "채도훈 건만 그 분기표로 조용히 넘긴다"]],
    ["c28_bundle", "c28_ruler", "c28_factory", "3년 전의 커피", "도윤하", "목요일 새벽, 강서지점 옛 판매 기록을 뒤지던 도윤하가 전화를 겁니다. 목소리가 갈라져 있습니다. 채도훈의 보험 가입 창구는 KD은행 강서지점 4번, 판매자는 도윤하입니다. 3년 전 가온정밀이 공장 설비 대출을 받던 날, 대출 서류 사이에 KD생명 상해보험 가입서가 끼워져 있었습니다. 지점 실적표에는 '대출 연계 보험 1건'으로 적혔습니다. '기억나요. 커피를 타 드렸어요. 좋은 보험이라고 했어요. 제19조 얘기는 안 했어요. 저도 몰랐으니까요.' 한참 조용하다가 그가 묻습니다. '이것도 제가 판 거였네요.'", ["가입 창구: 강서지점 4번 · 판매자 도윤하", "가입일 = 가온정밀 설비 대출 실행일", "실적표 기록: '대출 연계 보험 1건'"], ["도윤하가 채도훈에게 그때 일을 직접 말하도록 곁에 선다", "대출에 보험을 묶어 판 기록을 불완전판매 증거로 낸다", "도윤하의 이름이 드러나지 않게 판매 기록은 빼고 간다"]],
    ["c28_thanks", "c28_factory", "c28_final", "179번째 전화", "도윤하", "파견(잠시 다른 회사에 보내 일하게 하는 것) 여드레째인 월요일 오후 5시 반. 도윤하의 179번째 통화는 걸려 온 전화입니다. 지난주 대본 대신 분쟁조정(금융회사와 고객 사이의 다툼을 법원 대신 중재하는 절차) 신청 방법을 알려 준 일흔한 살 고객입니다. 남편의 입원 보험금이 어제 들어왔다고 합니다. '아가씨 이름 알려 줘요. 떡이라도 보내게.' 도윤하가 웃으며 사양하는 동안 모니터 구석에 알림이 뜹니다. 상담 품질 평가, 도윤하 C등급. 사유는 '대본 이탈 3회, 지급 전환 유도 1회'. 연하진이 화면을 보고 작게 말합니다. '고맙다는 전화도 여기선 감점이에요. C 세 번이면 파견이 일찍 끝나요.'", ["179번째 통화: 감사 전화 -- 입원 보험금 지급 완료", "도윤하 상담 품질 C등급: 대본 이탈 3회", "C등급 3회 누적 시 파견 조기 종료"], ["감점을 받더라도 권리를 알리는 방식을 팀 전체와 나눈다", "상담 평가 기준을 바꾸자는 제안서를 KD생명 준법감시부에 낸다", "파견이 끝나지 않게 이번 주는 대본대로 받게 한다"]],
  ],
  connectiveOrder: [["c28_headset", "c28_mute"], ["c28_ruler", "c28_bundle"], ["c28_factory", "c28_thanks"]],
  choiceEffects: {
    c28_headset: [
      { trust: 11, legitimacy: 4, humanCost: -5, capital: -3, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 2, time: -4, humanCost: 1, fatigue: 4 },
      { time: 5, capital: 4, trust: 2, legitimacy: -2, humanCost: 4, fatigue: -3 },
    ],
    c28_ruler: [
      { trust: 9, humanCost: -4, legitimacy: 3, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: -2, time: -4, humanCost: 4, fatigue: 3 },
      { time: 4, capital: 3, trust: 3, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
    c28_factory: [
      { trust: 10, humanCost: -4, legitimacy: 2, capital: -2, time: -2, fatigue: 4 },
      { legitimacy: 10, trust: 3, time: -4, humanCost: -2, fatigue: 4 },
      { time: 4, capital: 4, trust: 2, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c28_headset: {
      voice: ["모든 고객에게, 특별 응대팀으로 가는 말을 똑같이 알리자고 한다.", "분기표를 문서로 받아, 지급 기록과 대조한다.", "채도훈 건만, 그 분기표로 조용히 넘긴다."],
      echo: ["알리면 오후부터 '금융감독원'이라는 말이 전화마다 나옵니다. 특별 응대팀 대기 시간이 네 시간으로 늘어납니다.", "대조하면 64%와 7%가 같은 표에 나란히 섭니다. 그 분기표를 누가 만들었는지는 아직 빈칸입니다.", "채도훈 건은 특별 응대팀으로 갑니다. 그날 조용히 '네'라고만 한 나머지 179명은 그대로 남습니다."],
    },
    c28_ruler: {
      voice: ["도윤하가 채도훈에게 그때 일을 직접 말하도록, 곁에 선다.", "대출에 보험을 묶어 판 기록을, 불완전판매 증거로 낸다.", "도윤하의 이름이 드러나지 않게, 판매 기록은 빼고 간다."],
      echo: ["곁에 서면 도윤하는 자기 입으로 말할 수 있습니다. 채도훈이 그 말을 어떻게 받을지는 그의 몫입니다.", "증거로 내면 싸움은 단단해집니다. 판매자 칸의 도윤하라는 이름도 같은 서류에 실립니다.", "기록을 빼면 도윤하는 지켜집니다. 대출에 보험을 끼워 판 방식은 어느 서류에도 남지 않습니다."],
    },
    c28_factory: {
      voice: ["감점을 받더라도, 권리를 알리는 방식을 팀 전체와 나눈다.", "상담 평가 기준을 바꾸자는 제안서를, KD생명 준법감시부에 낸다.", "파견이 끝나지 않게, 이번 주는 대본대로 받게 한다."],
      echo: ["나누면 연하진의 팀 열두 명 중 다섯 명이 따라 합니다. 그 주에 팀 전체가 C등급을 받습니다.", "제안서는 접수됩니다. 준법감시부 답변 기한은 30일이고, 도윤하의 파견은 이틀 남았습니다.", "대본대로 받으면 도윤하는 끝까지 남습니다. 남은 이틀 동안 그는 대본을 360번 읽습니다."],
    },
  },
  reactionScenes: [
    ["c28_mute_reaction", "c28_mute", "c28_ruler", "조용한 사람들", "이민서", "퇴근길에 도윤하가 분기표 사진을 단체방에 올리자, KD데이터랩의 이민서가 한 시간 만에 답을 보냅니다. 그룹 데이터 권한으로 열어 본 KD생명 거절 건 3년 치입니다. 이의 없이 끝난 사람의 71%가 예순 살 이상이고, 그중 절반은 통화가 4분도 안 돼 끝났습니다. '대본이 3분짜리잖아요. 3분 안에 끝난 사람들이 제일 많이 잃었어요.' 잠시 뒤 한 줄이 더 옵니다. '근데 이 숫자, 제가 보면 안 되는 숫자일 수도 있어요.'", ["예순 넘은 고객에게 먼저 다시 전화를 걸게 한다", "이 숫자를 본 경로부터 적법한지 확인하고 쓴다", "숫자는 이민서에게 지우라 하고 채도훈 건에 집중한다"]],
    ["c28_bundle_reaction", "c28_bundle", "c28_factory", "글씨는 없었어요", "채도훈", "토요일 오전, 끝까지정밀 공장 앞 평상. 채도훈이 왼손으로 믹스커피를 젓다가 도윤하를 알아봅니다. '아, 그 창구 아가씨. 커피 맛있게 타 주던.' 도윤하가 고개를 숙이자 그가 손을 내젓습니다. '설명은 다 들었어요. 좋다고 했지, 거짓말은 안 했어요.' 그가 오른손을 펴 보입니다. 검지와 중지가 살짝 굽은 채 펴지지 않습니다. '근데 그 작은 글씨는 아무도 안 읽어 줬어. 읽어 줬으면 반장 그만둘 때 전화 한 통은 했겠지. 전화 한 통 값이 4,200만 원이야.'", ["도윤하의 사과를 채도훈이 원하는 방식으로 받게 한다", "'읽어 주지 않은 글씨'를 판매 절차의 결함으로 기록한다", "사과는 뒤로 미루고 청구 서류부터 받아 간다"]],
    ["c28_thanks_reaction", "c28_thanks", "c28_final", "연습한 목소리", "연하진", "퇴근 뒤 불 꺼진 1층 로비, 연하진이 담배 대신 사탕 껍질을 깝니다. '저희 아버지도 KD생명 보험이었어요. 폐암 진단금이 거절됐는데, 가입할 때 말 안 한 기침 때문이래요. 그 전화를 제가 입사 2년 차에 받았어요. 걸어 온 사람은 제가 가르친 후배였고요. 대본 4번이었어요.' 그가 사탕을 깨물어 부숩니다. '저는 그 대본을 제 목소리로 제일 잘 읽는 사람이에요. 그래서 파트장이 됐어요.'", ["연하진에게 그 대본을 같이 고쳐 쓰자고 손을 내민다", "연하진의 경험을 진술서로 남겨 달라고 부탁한다", "오늘은 연하진을 두고 채도훈 건 서류만 챙겨 간다"]],
  ],
  reactionEffects: {
    c28_mute: [
      { trust: 9, humanCost: -5, capital: -2, time: -3, fatigue: 3 },
      { legitimacy: 6, trust: 3, time: -3, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 3, trust: -3, legitimacy: 2, humanCost: 3, fatigue: -3 },
    ],
    c28_bundle: [
      { trust: 11, humanCost: -4, time: -2, capital: -2, fatigue: 3 },
      { legitimacy: 9, trust: 2, humanCost: -2, time: -3, fatigue: 3 },
      { time: 4, capital: 4, trust: -4, humanCost: 3, fatigue: -2 },
    ],
    c28_thanks: [
      { trust: 10, humanCost: -3, time: -2, capital: -2, fatigue: 3 },
      { legitimacy: 9, trust: -2, humanCost: 2, time: -3, fatigue: 3 },
      { time: 5, capital: 3, trust: 3, humanCost: 3, legitimacy: 2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c28_mute: {
      voice: ["예순 넘은 고객에게, 먼저 다시 전화를 걸게 하자고 한다.", "이 숫자를 본 경로부터, 적법한지 확인하고 쓰자고 한다.", "숫자는 이민서에게 지우라 하고, 채도훈 건에 집중한다."],
      echo: ["다시 걸면 첫날에만 마흔 명이 '그런 절차가 있는 줄 몰랐다'고 합니다. 그 마흔 통은 누구의 할당에도 잡히지 않습니다.", "경로를 확인하면 이민서는 지켜집니다. 확인이 끝나는 2주 동안 그 71%는 숫자로만 남습니다.", "지우면 이민서는 안도합니다. 3분 안에 끝난 사람들이 제일 많이 잃었다는 사실도 함께 지워집니다."],
    },
    c28_bundle: {
      voice: ["도윤하의 사과를, 채도훈이 원하는 방식으로 받게 한다.", "'읽어 주지 않은 글씨'를, 판매 절차의 결함으로 기록한다.", "사과는 뒤로 미루고, 청구 서류부터 받아 간다."],
      echo: ["채도훈이 원하는 방식은 간단합니다. '커피나 한 잔 더 타 줘요.' 도윤하가 믹스커피를 두 봉지 넣습니다.", "기록하면 한 사람의 사과가 절차의 결함이 됩니다. 결함은 고칠 수 있고, 사과는 그렇지 않습니다.", "서류는 빨리 모입니다. 도윤하는 돌아오는 차 안에서 한마디도 하지 않습니다."],
    },
    c28_thanks: {
      voice: ["연하진에게, 그 대본을 같이 고쳐 쓰자고 손을 내민다.", "연하진의 경험을, 진술서로 남겨 달라고 부탁한다.", "오늘은 연하진을 두고, 채도훈 건 서류만 챙겨 간다."],
      echo: ["손을 내밀면 연하진이 사탕을 하나 더 줍니다. 대본 4번의 첫 문장을 그가 제일 먼저 지웁니다.", "진술서에는 12년이 적힙니다. 서명하는 손이 그의 헤드셋 쥐는 손보다 오래 멈춥니다.", "서류는 챙겨집니다. 연하진은 로비 불이 꺼질 때까지 혼자 앉아 있습니다."],
    },
  },
  reactionMemos: {
    c28_mute_reaction: ["3분 안에 끝난 사람이 가장 많이 잃었다", "이민서: 보면 안 되는 숫자일 수도"],
    c28_bundle_reaction: ["채도훈: 설명은 다 들었다, 글씨는 없었다", "전화 한 통 값 4,200만 원"],
    c28_thanks_reaction: ["연하진의 아버지 -- 대본 4번으로 거절", "제일 잘 읽는 사람이 파트장이 됐다"],
  },
  branchPlan: ["c28_headset", 0, "c28_branch_market", "c28_branch_market_follow"],
  branchScenes: {
    // CASE 28's detour is the rice-cake shop. The call floor hears one refusal
    // at a time; the side door lays seventeen of them side by side on a steamer
    // table, and a sixteen-year-old translates the clause into four panels.
    c28_branch_market: {
      phase: "SIDE DOOR",
      title: "거절 통지서 열일곱 장",
      speaker: "문가을",
      text: "점심시간, 문가을의 전화를 받고 망원시장으로 갑니다. 떡을 찌는 스테인리스 작업대 위에 봉투 열일곱 장이 줄지어 있습니다. 피해자 모임 사람들이 KD생명에서 받은 거절 통지서입니다. 문가을이 안경을 올려 쓰고 한 장씩 소리 내어 읽습니다. '고객님의 소중한 청구에 깊이 공감하오나.' 다음 장. '고객님의 소중한 청구에 깊이 공감하오나.' 열일곱 번째까지 같은 문장이 이어지자 떡을 사러 온 손님 둘이 박수를 칩니다. 문가을은 웃지 않습니다. '공감은 열일곱 번 받았는데 돈은 한 번도 못 받았어요.' 열일곱 장 가운데 열한 장이 같은 조항, 제19조를 들고 있습니다.",
      memo: ["거절 통지서 17장 -- 피해자 모임 회원", "같은 첫 문장 17번: '깊이 공감하오나'", "그중 11장이 제19조", "문가을: 공감 17번, 지급 0번"],
      triggers: ["injustice", "affection", "curiosity"],
      choices: [
        { id: "c28_branch_market_a", label: "열일곱 명을 한 명씩 만나 같이 이의신청서를 쓴다", effect: { trust: 11, humanCost: -5, capital: -4, time: -4, fatigue: 4 }, next: "c28_branch_market_follow", cognition: { persistence: 2 } },
        { id: "c28_branch_market_b", label: "통지서 열일곱 장을 조항별로 나눠 표로 정리한다", effect: { legitimacy: 9, trust: 3, time: -6, humanCost: 3, fatigue: 4 }, next: "c28_branch_market_follow", cognition: { inference: 2 } },
        { id: "c28_branch_market_c", label: "제19조 열한 장만 추려 채도훈 건에 붙여 쓴다", effect: { capital: 3, time: 5, trust: -3, humanCost: 4, fatigue: -3 }, next: "c28_branch_market_follow", cognition: { risk: 2 } },
      ],
    },
    c28_branch_market_follow: {
      phase: "SIDE DOOR",
      title: "같은 선반",
      speaker: "문하준",
      text: "학교가 끝난 문하준이 교복 차림으로 가게에 들어와 제19조를 한참 들여다봅니다. 그리고 스케치북에 네 칸 만화를 그립니다. 첫 칸, 선반 앞의 아저씨. 둘째 칸, 같은 선반 앞의 같은 아저씨, 명찰만 '가온정밀'에서 '끝까지정밀'로 바뀜. 셋째 칸, 보험회사 사람이 '직업이 바뀌셨네요'라고 말함. 넷째 칸, 아저씨가 선반을 가리킴. '이거 그대로인데.' 손님들이 돌려 보다 웃음을 터뜨리고, 문가을이 처음으로 따라 웃습니다. 문하준이 연필을 내려놓습니다. '어른들 글씨로 쓰면 아무도 안 읽잖아요. 이건 다들 읽던데요.'",
      memo: ["문하준의 네 칸 만화 '같은 선반'", "제19조 요지: 직업이 바뀌면 알려야 한다", "채도훈의 선반 -- 23년째 같은 기계", "가게 손님 9명이 돌려 봄"],
      triggers: ["affection", "recognition", "injustice"],
      choices: [
        { id: "c28_branch_market_follow_a", label: "문하준의 만화를 피해자 모임 단체방에 먼저 돌린다", effect: { trust: 11, humanCost: -4, capital: -3, time: -2, fatigue: 3 }, next: "c28_mute", cognition: { reframing: 2 } },
        { id: "c28_branch_market_follow_b", label: "만화를 쉬운 약관 설명서 시안으로 KD생명에 공식 제안한다", effect: { legitimacy: 10, trust: 4, time: -6, humanCost: 2, fatigue: 5 }, next: "c28_mute", cognition: { inference: 2 } },
        { id: "c28_branch_market_follow_c", label: "만화는 나중에 쓰기로 하고 오후 통화 일정부터 챙긴다", effect: { time: 5, capital: 4, trust: -4, humanCost: 3, fatigue: -3 }, next: "c28_mute", cognition: { risk: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c28_start",
    result: "c28_aftershock",
    defaultFree: "c28_route_system",
    // One clause, many callers. Like 사건 12 the case is a single line; the
    // split is whether one man's payout buys the silence of the other 1,317.
    choices: {},
    system: {
      route: "c28_route_system",
      final: "c28_final_system_route",
      title: "3분의 설계",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 KD생명의 지난 3년 상담 녹취(통화를 녹음해 남긴 기록) 요약본을 엽니다. 부지급(보험금을 주지 않기로 한 결정) 안내 통화 41만 건, 평균 통화 시간 3분 4초. 고객이 '다시 설명해 달라'고 말한 통화에서는 이의 제기가 네 배 많았고, 대본 4번은 그 말이 나오기 전에 통화가 끝나도록 문단 순서가 짜여 있습니다. 약관(보험 계약의 세부 조건을 적은 문서)은 한 글자도 바뀌지 않았습니다. 바뀐 것은 대본의 개정 이력 한 줄, '평균 통화 시간 단축'뿐입니다. '거절은 약관에 적혀 있습니다. 거절이 뒤집히지 않는 이유는 약관이 아니라 시간표에 적혀 있습니다.'",
      memo: ["부지급 안내 통화 41만 건 -- 평균 3분 4초", "'다시 설명해 달라' 통화의 이의 제기 4배", "대본 개정 사유: 평균 통화 시간 단축"],
      routeChoices: [
        ["c28_route_system_slow", "대본 4번의 '다시 설명' 문단을 맨 앞으로 옮기라고 요구한다", { legitimacy: 10, trust: 7, capital: -5, time: -7, fatigue: 5 }, { reframing: 2 }],
        ["c28_route_system_publish", "녹취 요약 통계를 금융감독원과 피해자 모임에 동시에 넘긴다", { legitimacy: 12, trust: 4, time: -8, humanCost: 3, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c28_route_system_drop", "통계는 덮고 채도훈 한 사람의 통화에만 쓴다", { time: 7, capital: 5, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "거절 안내 통화에 최소 10분과 다시 설명받을 권리를 규정으로 넣는다", { legitimacy: 11, trust: 8, capital: -7, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "대본은 그대로 두고 이의신청 서식만 쉽게 바꾼다", { capital: 8, time: 6, trust: -4, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "3분 안에 끝난 거절 건 전부를 다시 심사할 기금을 따로 만든다", { legitimacy: 8, trust: 10, capital: -8, time: -6, humanCost: 2, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c28_evidence_turn",
    result: "c28_aftershock",
    sourceRoutes: ["c28_headset", "c28_ruler", "c28_factory", "c28_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 대본 4번의 개정 이력 옆에 놓고, 3분짜리 통화를 누가 주문했는지 맞춰 본다.",
    entryEcho: "단서를 대면 대본을 줄인 사람이 콜센터 밖에 있다는 것이 보입니다. 그 사람이 아낀 돈이 어디로 갔는지도 함께 보입니다.",
    title: "손해율 목표표",
    speaker: "반재욱",
    text: "단서를 맞추자 대본 4번의 개정 요청서가 열립니다. 요청 부서는 KD생명이 아닙니다. KD캐피탈 대표실 아래 꾸려진 '그룹 보험 손해율(받은 보험료 가운데 보험금으로 나간 돈의 비율) 개선 태스크포스'입니다. 올해 목표는 보험금 지급 180억 절감. 첨부된 표 맨 아래에 아낀 돈의 쓰임이 적혀 있습니다. '평택 오피스텔 공사 손실 보전.' 지방 감사 출장길에 올라온 반재욱이 가방을 내려놓고 수첩에 두 숫자를 나란히 적습니다. '공사가 멈춘 건물의 구멍을, 다친 사람들 보험금으로 메우고 있습니다. 대본을 줄인 사람은 콜센터에 한 번도 와 본 적이 없을 겁니다.'",
    memo: ["대본 4번 개정 요청: KD캐피탈 대표실 산하 TF", "목표: 보험금 지급 180억 절감", "아낀 돈의 쓰임: 평택 오피스텔 공사 손실"],
    triggers: ["injustice", "system", "revenge"],
    entryEffect: { legitimacy: 4, trust: 3, time: -6, capital: -3, fatigue: 5 },
    choices: [
      ["c28_evidence_turn_expose", "TF 요청서와 평택 숫자를 금융감독원 민원에 함께 붙여 낸다", { legitimacy: 12, trust: 5, capital: -7, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c28_evidence_turn_hold", "요청서는 쥐고 있다가 싱가포르 건과 한꺼번에 꺼낸다", { capital: 7, time: 5, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c28_evidence_turn_share", "절감 목표표를 콜센터 상담사들에게 먼저 보여 준다", { trust: 11, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c28_branch_market",
    systemNext: "c28_route_system",
    evidenceNext: "c28_evidence_turn",
    routeLabel: "직전 사건의 번호표 명단처럼 거절 통지서를 받은 사람들을 한 명씩 찾는다",
    systemLabel: "직전 자유응답 문장이 KD생명 상담 대본에도 옮겨졌는지 본다",
    evidenceLabel: "직전 단서를 붙여 대본 4번을 누가 3분으로 줄였는지 연다",
  },
  openingRoutes: {
    c27_after_warm: "c28_start_warm",
    c27_after_record: "c28_start_record",
    c27_after_rush: "c28_start_rush",
  },
  openingCopy: {
    c28_start_warm: ["군산에서 돌아온 월요일", "도윤하", "군산에 하루 더 남아 돌아오는 사람들을 맞고, 곽 사장이 들고 온 박대 한 상자와 함께 일요일 막차로 올라왔습니다. 다음 날 밤 도윤하가 구로의 KD생명 콜센터로 부릅니다. 그는 계열사(같은 그룹에 속한 다른 회사) KD생명에 열흘 파견(잠시 다른 회사에 보내 일하게 하는 것)을 나와 '부지급(보험금을 주지 않기로 한 결정) 안내 대본 4번'을 받았습니다. 내일 첫 통화는 끝까지정밀 조합원 채도훈입니다. 선반 사고로 오른손 감각을 잃었고, 후유장해(치료가 끝나도 남는 장애) 보험금 4,200만 원이 약관(보험 계약의 세부 조건을 적은 문서) 한 줄로 거절됐습니다. '적금 깨면서 우셨다던 군산 할머니 생각나요. 이분 통화도 3분이면 끝난대요.'", ["군산에서 하루 더 -- 일요일 막차로 귀경", "대본 4번: 부지급 안내 · 평균 3분", "채도훈 후유장해 보험금 4,200만 원 거절"]],
    c28_start_record: ["보고서 다음 날의 대본", "에코", "대화방 기록과 정리안을 묶은 소문 피해 보고서 일곱 장은 접수 번호를 받았습니다. 마지막 장에는 비어 있는 승인자 칸이 들어갔습니다. 그 번호가 뜬 날 밤, 도윤하가 보여 준 것은 다른 서류입니다. 계열사(같은 그룹에 속한 다른 회사) KD생명의 '부지급(보험금을 주지 않기로 한 결정) 안내 대본 4번'. 그는 KD생명 콜센터에 열흘 파견(잠시 다른 회사에 보내 일하게 하는 것)을 나왔고, 내일 첫 통화 상대는 채도훈입니다. 후유장해(치료가 끝나도 남는 장애) 보험금 4,200만 원이 약관(보험 계약의 세부 조건을 적은 문서) 제19조로 거절됐습니다. 에코가 대본 파일의 속성을 띄웁니다. '보고서 마지막 장은 승인자 칸이 비어 있었습니다. 이 대본은 작성자 칸이 비어 있습니다. 빈칸이 하나 늘었습니다.'", ["소문 피해 보고서 7장 -- 접수 번호 받음", "대본 4번 파일 속성: 작성자 빈칸", "채도훈 거절 근거: 약관 제19조"]],
    c28_start_rush: ["지워진 방 다음의 대본", "도윤하", "캡처를 들고 곧장 올라간 KD캐피탈 12층 부동산금융팀은 불이 꺼져 있었고, 사내 메신저에서 그 대화방은 이미 사라져 있었습니다. 사흘 뒤 월요일 밤, 도윤하가 KD생명 콜센터로 부릅니다. 계열사(같은 그룹에 속한 다른 회사) KD생명에 열흘 파견(잠시 다른 회사에 보내 일하게 하는 것)을 나온 그의 책상에 '부지급(보험금을 주지 않기로 한 결정) 안내 대본 4번'이 있습니다. 내일 첫 줄은 채도훈, 후유장해(치료가 끝나도 남는 장애) 보험금 4,200만 원을 약관(보험 계약의 세부 조건을 적은 문서) 한 줄로 거절당한 끝까지정밀 조합원입니다. 대본 맨 아래 개정 요청 부서 칸에 '손해율(받은 보험료 가운데 보험금으로 나간 돈의 비율) 개선 TF'라고 적혀 있고, 담당자 칸에는 지워지기 전 대화방 참여자 목록에서 본 부동산금융팀 이름 하나가 있습니다.", ["지워진 대화방 참여자 중 한 명", "대본 4번 개정 담당자: 같은 이름", "채도훈 후유장해 보험금 4,200만 원 거절"]],
  },
  openingSignatures: {
    c28_start_warm: {
      label: "군산에서처럼 채도훈의 이름부터 외우고 공장으로 간다",
      effect: { trust: 11, humanCost: -5, capital: -3, time: -5, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "군산에서처럼, 채도훈의 이름부터 외우고 공장으로 간다.",
      echo: "이름을 외우고 가면 채도훈이 먼저 알아봅니다. '은행 사람이 내 이름을 안 틀리네.' 공장 문이 조금 더 열립니다.",
    },
    c28_start_record: {
      label: "대본 4번의 작성 부서를 KD생명에 공식 질의한다",
      effect: { legitimacy: 12, trust: -3, capital: -4, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "대본 4번의 작성 부서를, KD생명에 공식 질의한다.",
      echo: "질의는 접수됩니다. 답변 기한은 14일이고, 채도훈의 통화는 내일 오전 10시입니다.",
    },
    c28_start_rush: {
      label: "지워진 대화방의 이름과 대본 담당자가 같다는 걸 도윤하와 먼저 맞춰 본다",
      effect: { trust: 9, legitimacy: 5, humanCost: 3, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "지워진 대화방의 이름과 대본 담당자가 같다는 걸, 도윤하와 먼저 맞춰 본다.",
      echo: "맞춰 보면 군산의 소문과 구로의 대본이 한 이름으로 이어집니다. 그 이름 위에 누가 있는지는 아직 모릅니다.",
    },
  },
  voiceLines: {
    // CASE 28. A call centre and a clause. Every line is said to someone whose
    // claim is three minutes long, so none of them is allowed to sound rehearsed.
    c28_start_visit: "대본을 읽기 전에, 채도훈을 먼저 찾아가 사정을 듣는다.",
    c28_start_clause: "거절 근거가 된 제19조와 심사 기록부터, 받아 본다.",
    c28_start_appeal: "대본은 도윤하에게 맡기고, 이의신청 서류부터 빨리 넣는다.",
    c28_headset_listen: "대본은 내려놓고, 채도훈의 말을 끝까지 듣게 한다.",
    c28_headset_metric: "'부지급 유지율'이 성과급에 들어간 근거부터, 문서로 요구한다.",
    c28_headset_quota: "오늘 할당은 채우게 두고, 채도훈에게는 퇴근 뒤 다시 걸자고 한다.",
    c28_branch_market_a: "열일곱 명을 한 명씩 만나, 같이 이의신청서를 쓴다.",
    c28_branch_market_b: "통지서 열일곱 장을, 조항별로 나눠 표로 정리한다.",
    c28_branch_market_c: "제19조 열한 장만 추려, 채도훈 건에 붙여 쓴다.",
    c28_branch_market_follow_a: "문하준의 만화를, 피해자 모임 단체방에 먼저 돌린다.",
    c28_branch_market_follow_b: "만화를 쉬운 약관 설명서 시안으로, KD생명에 공식 제안한다.",
    c28_branch_market_follow_c: "만화는 나중에 쓰기로 하고, 오후 통화 일정부터 챙긴다.",
    c28_ruler_read: "채도훈과 약관을 한 줄씩 읽고, 그의 말로 이의서를 쓴다.",
    c28_ruler_mediate: "글자 크기와 설명 부족을 근거로, 분쟁조정을 신청한다.",
    c28_ruler_half: "KD생명이 넌지시 내민 절반 지급 합의를, 받아들이게 한다.",
    c28_factory_guard: "촬영을 멈추게 하고, 조합원들과 채도훈 곁을 지킨다.",
    c28_factory_order: "촬영 영상과 조사 지시서를 정식으로 요청해, 증거로 삼는다.",
    c28_factory_settle: "등록금 날짜를 생각해서, 빠른 합의 쪽으로 채도훈을 설득한다.",
    c28_final_both: "채도훈 지급은 받되, 확인서는 빼고 1,318명 명단을 요구한다.",
    c28_final_clause: "제19조를 고치지 않으면, 예외 지급도 받지 않겠다고 버틴다.",
    c28_final_sign: "등록금을 위해, 확인서에 서명하고 예외 지급을 받는다.",
    c28_after_warm: "콜센터 불이 꺼질 때까지 남아, 상담사들과 떡을 나눈다.",
    c28_after_record: "제19조와 대본 4번을 나란히 적은 개정 요청서부터, 문서로 남긴다.",
    c28_after_rush: "서하린의 전화에, 곧장 싱가포르행 일정부터 잡는다.",
    c28_route_system_slow: "대본 4번의 '다시 설명' 문단을, 맨 앞으로 옮기라고 요구한다.",
    c28_route_system_publish: "녹취 요약 통계를, 금융감독원과 피해자 모임에 동시에 넘긴다.",
    c28_route_system_drop: "통계는 덮고, 채도훈 한 사람의 통화에만 쓴다.",
    c28_final_system_route_a: "거절 안내 통화에, 최소 10분과 다시 설명받을 권리를 규정으로 넣는다.",
    c28_final_system_route_b: "대본은 그대로 두고, 이의신청 서식만 쉽게 바꾼다.",
    c28_final_system_route_c: "3분 안에 끝난 거절 건 전부를, 다시 심사할 기금을 따로 만든다.",
    c28_evidence_turn_expose: "TF 요청서와 평택 숫자를, 금융감독원 민원에 함께 붙여 낸다.",
    c28_evidence_turn_hold: "요청서는 쥐고 있다가, 싱가포르 건과 한꺼번에 꺼낸다.",
    c28_evidence_turn_share: "절감 목표표를, 콜센터 상담사들에게 먼저 보여 준다.",
  },
  echoReplies: {
    // CASE 28.
    c28_start_visit: "찾아가면 채도훈은 공장 문을 열어 줍니다. 대신 내일 오전 10시 통화는 대본 없이 도윤하 혼자 받습니다.",
    c28_start_clause: "기록을 받으면 제19조가 87쪽에 있다는 걸 압니다. 그 쪽을 찾는 데만 한 시간이 걸립니다.",
    c28_start_appeal: "이의신청은 오늘 접수됩니다. 도윤하는 내일 아침 대본 4번을 그대로 읽어야 합니다.",
    c28_headset_listen: "끝까지 들으면 통화는 41분이 됩니다. 그사이 도윤하의 대기 고객이 서른 명 쌓입니다.",
    c28_headset_metric: "근거를 요구하면 파트장 회의가 열립니다. 도윤하의 자리는 그날부터 '관리 대상'이 됩니다.",
    c28_headset_quota: "할당은 채워집니다. 퇴근 뒤 다시 건 전화를 채도훈은 받지 않습니다. 야간 작업 중입니다.",
    c28_branch_market_a: "한 명씩 만나면 열일곱 개의 사정이 나옵니다. 받아 적는 데 이틀이 들고, 문가을이 떡을 세 번 쪄 줍니다.",
    c28_branch_market_b: "표가 되면 제19조 열한 칸이 한눈에 보입니다. 표에는 떡집 작업대의 김도, 박수 소리도 남지 않습니다.",
    c28_branch_market_c: "열한 장이 붙으면 채도훈 건은 무거워집니다. 나머지 여섯 장은 봉투에 다시 들어갑니다.",
    c28_branch_market_follow_a: "만화는 한 시간 만에 삼백 명에게 퍼집니다. 문하준이 '저작권은 끝까지정밀'이라고 덧붙입니다.",
    c28_branch_market_follow_b: "제안서는 접수됩니다. KD생명은 '검토하겠다'고 답하고, 만화의 넷째 칸만 빼 달라고 합니다.",
    c28_branch_market_follow_c: "통화 일정은 지켜집니다. 스케치북은 떡집 선반 위에서 하루를 기다립니다.",
    c28_ruler_read: "한 줄씩 읽으면 채도훈이 제19조에서 오래 멈춥니다. 그가 쓴 이의서의 첫 문장은 '저는 같은 선반 앞에 있었습니다'입니다.",
    c28_ruler_mediate: "신청은 접수됩니다. 조정 결과가 나오기까지 석 달, 채윤아의 등록금 날짜는 그보다 빠릅니다.",
    c28_ruler_half: "절반이면 2,100만 원입니다. 채도훈은 고개를 끄덕이고, 제19조는 다음 사람에게도 그대로 남습니다.",
    c28_factory_guard: "촬영은 멈춥니다. 손해사정사 사무소는 '조사 방해'라는 말을 보고서에 적습니다.",
    c28_factory_order: "지시서를 받으면 촬영을 주문한 날짜가 나옵니다. 이의신청이 들어온 바로 다음 날입니다.",
    c28_factory_settle: "설득하면 채도훈은 '딸 학교가 먼저지'라며 웃습니다. 문하준은 스케치북을 다시 펴지 않습니다.",
    c28_final_both: "명단을 요구하면 서 상무가 회의를 30분 멈춥니다. 돌아온 그는 확인서 없이 지급하겠다고 합니다. 명단은 '검토'입니다.",
    c28_final_clause: "버티면 합의서는 다시 가방으로 들어갑니다. 월요일 입금은 없고, 제19조를 다루는 회의 날짜도 아직 없습니다.",
    c28_final_sign: "서명하면 월요일에 4,200만 원이 들어옵니다. 1,317명에게는 다음 주에도 대본 4번이 읽힙니다.",
    c28_after_warm: "불이 꺼질 때 도윤하가 헤드셋 자국을 문지르며 웃습니다. '오늘은 욕보다 고맙다는 말이 한 통 더 많았어요.' 싱가포르는 다음 주까지 기다립니다.",
    c28_after_record: "요청서에는 같은 조항에 걸린 1,318명의 명단이 붙습니다. 연하진이 명단 첫 줄에 자기 아버지 이름을 적어 넣습니다.",
    c28_after_rush: "일정을 잡으면 도윤하가 떡 한 팩을 가방에 넣어 줍니다. '싱가포르에서 먹어요. 거기 떡은 비쌀 거예요.'",
    c28_route_system_slow: "문단 하나를 옮기면 평균 통화가 7분으로 늘어납니다. 상담사 한 명의 하루 할당이 반으로 줄어듭니다.",
    c28_route_system_publish: "통계가 넘어가면 금융감독원이 녹취 원본을 요구합니다. 41만 건을 추리는 데 석 달이 걸립니다.",
    c28_route_system_drop: "채도훈의 통화는 길어집니다. 나머지 41만 건은 여전히 3분 4초입니다.",
    c28_final_system_route_a: "10분이 규정이 되면 콜센터는 상담사를 더 뽑아야 합니다. 비용이 늘고, 거절은 줄어듭니다.",
    c28_final_system_route_b: "서식은 쉬워집니다. 쉬운 서식을 알려 주는 말이 대본에 없으면 아무도 그 서식을 모릅니다.",
    c28_final_system_route_c: "기금이 생기면 다시 심사할 거절 건은 12만 건입니다. 누가 그 기금을 채울지는 빈칸입니다.",
    c28_evidence_turn_expose: "민원이 들어가면 태스크포스라는 이름이 공문에 처음 오릅니다. 그 아래 대표실이라는 글자도 함께 오릅니다.",
    c28_evidence_turn_hold: "쥐고 있으면 싱가포르에서 강한 패가 됩니다. 그사이 대본 4번은 매일 3분씩 읽힙니다.",
    c28_evidence_turn_share: "상담사들이 표를 보면 7층이 조용해집니다. 연하진이 헤드셋을 벗어 책상 위에 내려놓습니다.",
  },
  characterProfiles: {
    연하진: {
      role: "KD생명 구로 콜센터 12년 차 파트장",
      stance: "생존 · 숙련 · 뒤늦은 분노",
      job: "대본을 가장 잘 읽는 사람으로서, 대본이 어떻게 사람을 3분 안에 끊어 내는지 안에서부터 보여 준다.",
      appearance: "헤드셋 자국이 눌린 짧은 단발, 목에 건 사원증 뒤에 끼운 아버지 사진, 주머니 가득한 사탕.",
      thought: "나는 이 대본을 제일 잘 읽어서 여기까지 왔다. 그 대본이 아버지에게 읽힌 날에도 나는 출근했다.",
      gesture: "연하진은 화가 나면 사탕을 깨물어 부순다. 소리가 날 때까지 아무 말도 하지 않는다.",
      voice: "상담사의 부드러운 억양으로 가장 날카로운 말을 한다. 존댓말이 흐트러지는 법이 없다.",
      line: "욕이 들어오면 셋 세요. 울면 세지 말고 기다리고요. 그게 제가 12년 동안 배운 전부예요.",
    },
    채도훈: {
      role: "끝까지정밀 조합원 · 가온정밀 23년 차 선반 기술자",
      stance: "생계 · 자존심 · 담담함",
      job: "약관의 작은 글씨가 한 사람의 손과 딸의 등록금에 어떻게 닿는지 몸으로 보여 준다.",
      appearance: "기름 밴 작업복, 살짝 굽은 채 펴지지 않는 오른손 검지와 중지, 왼손에 든 믹스커피.",
      thought: "설명은 다 들었다. 아무도 그 작은 글씨를 읽어 주지 않았을 뿐이다.",
      gesture: "채도훈은 불편한 말이 나오면 오른손을 조용히 작업복 주머니에 넣는다.",
      voice: "느리고 낮게, 반말과 존댓말을 섞어 말한다. 화를 내는 대신 값을 말한다.",
      line: "같은 선반이에요. 명찰만 바뀌었지. 그게 직업이 바뀐 거면, 나는 23년 동안 직업이 없었던 거요.",
    },
  },
  setting: { place: "KD생명 구로 콜센터 · 상담석", clock: "5월 11일 월요일 · 21:10" },
  sceneContext: {
    c28_start: {
      place: "KD생명 구로 콜센터 · 상담석",
      clock: "5월 11일 월요일 · 21:10",
      question: "내일 아침 채도훈에게 3분짜리 거절 대본을 읽어야 합니다. 무엇부터 하겠습니까?",
      lead: "도윤하가 KD생명 첫 출근을 마친 밤, 야간조만 남은 7층으로 당신을 부릅니다.",
    },
    c28_start_warm: {
      place: "KD생명 구로 콜센터 · 상담석",
      clock: "5월 11일 월요일 · 21:10",
      question: "군산의 번호표 다음에 구로의 거절 대본이 왔습니다. 이번에는 누구 곁에 먼저 서겠습니까?",
      lead: "일요일 막차로 올라온 다음 날, 가방에는 아직 새봄신협 번호표 한 장이 들어 있습니다.",
    },
    c28_start_record: {
      place: "KD생명 구로 콜센터 · 상담석",
      clock: "5월 11일 월요일 · 21:10",
      question: "보고서의 승인자 칸에 이어 대본의 작성자 칸도 비어 있습니다. 그 빈칸을 어떻게 채우겠습니까?",
      lead: "소문 피해 보고서의 접수 번호를 받은 날 밤, 도윤하의 문자를 받고 구로로 왔습니다.",
    },
    c28_start_rush: {
      place: "KD생명 구로 콜센터 · 상담석",
      clock: "5월 11일 월요일 · 21:10",
      question: "지워진 대화방과 거절 대본에 같은 이름이 적혀 있습니다. 이 연결을 어떻게 쓰겠습니까?",
      lead: "불 꺼진 12층에서 헛걸음을 하고 사흘, 도윤하가 구로로 부릅니다.",
    },
    c28_headset: {
      place: "KD생명 구로 콜센터 · 상담석 7층",
      clock: "5월 12일 화요일 · 10:00",
      question: "헤드셋 너머의 채도훈이 안 되는 거면 빨리 말하라고 합니다. 이 통화를 어떻게 하겠습니까?",
      lead: "도윤하 옆 빈 상담석에 보조 헤드셋을 끼고 앉았습니다. 전광판의 숫자가 먼저 눈에 들어옵니다.",
    },
    c28_branch_market: {
      place: "망원시장 가을떡방 · 작업대",
      clock: "5월 12일 화요일 · 12:40",
      question: "같은 문장으로 시작하는 거절 통지서 열일곱 장이 떡 작업대에 있습니다. 어떻게 하겠습니까?",
    },
    c28_branch_market_follow: {
      place: "망원시장 가을떡방",
      clock: "5월 12일 화요일 · 15:40",
      question: "고등학생의 네 칸 만화가 제19조를 누구나 읽을 수 있게 만들었습니다. 이 만화를 어떻게 쓰겠습니까?",
    },
    c28_mute: {
      place: "KD생명 구로 콜센터 · 휴게실",
      clock: "5월 12일 화요일 · 17:10",
      question: "크게 화내는 사람만 특별 응대팀으로 가는 분기표가 있습니다. 어떻게 하겠습니까?",
    },
    c28_mute_reaction: {
      place: "지하철 2호선 · 퇴근길",
      clock: "5월 12일 화요일 · 19:05",
      question: "3분 안에 끝난 예순 넘은 고객들이 가장 많이 잃었습니다. 이 숫자를 어떻게 다루겠습니까?",
    },
    c28_ruler: {
      place: "회기동 헌책방 1층 · 책장",
      clock: "5월 13일 수요일 · 20:00",
      question: "명찰만 바뀐 것을 직업이 바뀐 것으로 본 6.5포인트 조항이 있습니다. 어떻게 맞서겠습니까?",
      lead: "헌책방 1층 긴 탁자에 약관 책자와 쇠자, 문가을이 보낸 떡 한 상자가 놓여 있습니다.",
    },
    c28_bundle: {
      place: "KD은행 강서지점 · 4번 창구",
      clock: "5월 14일 목요일 · 05:40",
      question: "채도훈에게 이 보험을 판 사람이 도윤하였습니다. 이 기록을 어떻게 하겠습니까?",
    },
    c28_bundle_reaction: {
      place: "인천 남동공단 끝까지정밀 · 공장 앞 평상",
      clock: "5월 16일 토요일 · 10:30",
      question: "채도훈은 설명은 다 들었지만 작은 글씨는 아무도 읽어 주지 않았다고 합니다. 무엇이라 답하겠습니까?",
    },
    c28_factory: {
      place: "인천 남동공단 끝까지정밀 · 공장",
      clock: "5월 16일 토요일 · 14:00",
      question: "왼손으로 일하는 채도훈을 보험회사가 몰래 찍고 있습니다. 어떻게 하겠습니까?",
      lead: "평상에서 커피를 마신 뒤 공장 안으로 들어서자, 선반 세 대가 고르게 돌고 있습니다.",
    },
    c28_thanks: {
      place: "KD생명 구로 콜센터 · 상담석",
      clock: "5월 18일 월요일 · 17:30",
      question: "고맙다는 전화 한 통이 도윤하의 감점이 됐습니다. 이 평가를 어떻게 하겠습니까?",
    },
    c28_thanks_reaction: {
      place: "KD생명 구로 콜센터 · 1층 로비",
      clock: "5월 18일 월요일 · 19:40",
      question: "대본을 가장 잘 읽는 사람이 그 대본으로 아버지를 잃었습니다. 연하진에게 무엇을 청하겠습니까?",
    },
    c28_route_system: {
      place: "KD캐피탈 위험관리부 · 분석 단말",
      clock: "5월 19일 화요일 · 23:10",
      question: "거절이 뒤집히지 않도록 통화 시간이 설계돼 있었습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c28_final_system_route: {
      place: "KD캐피탈 위험관리부 · 분석 단말",
      clock: "5월 20일 수요일 · 새벽",
      question: "3분짜리 거절 통화의 규칙을 하나 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c28_evidence_turn: {
      place: "KD캐피탈 · 문서 보관소",
      clock: "5월 20일 수요일 · 07:30",
      question: "다친 사람들의 보험금을 아껴 멈춘 공사 현장의 손실을 메우려 했습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c28_final: {
      place: "KD생명 본사 · 보상심사 회의실",
      clock: "5월 20일 수요일 · 16:00",
      question: "한 사람에게 전액을 주는 대신 나머지 1,317명에 대해 입을 닫으라고 합니다. 어떻게 하겠습니까?",
      lead: "도윤하가 파견 사원증을 목에 건 채 들어옵니다. 가방 안에 대본 4번이 접혀 있습니다.",
    },
    c28_aftershock: {
      place: "KD생명 구로 콜센터 · 상담석",
      clock: "5월 20일 수요일 · 18:00",
      question: "헤드셋을 반납한 저녁, 싱가포르에서 전화가 옵니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c28-script-four",
    title: "3분짜리 대본의 주문서",
    text: "대본 4번을 3분으로 줄이라고 요청한 곳은 KD캐피탈 대표실 아래 손해율 개선 태스크포스였습니다. 아낀 보험금 180억의 쓰임은 평택 공사 현장의 손실이었습니다.",
  },
  outcomes: {
    c28_after_warm: { tag: "곁에 남은 결말", title: "불 꺼진 7층에서 상담사들과 떡을 나눴다", text: "파견 마지막 날, 도윤하와 당신은 콜센터 불이 꺼질 때까지 남았습니다. 연하진의 팀 열두 명이 처음으로 같은 시간에 헤드셋을 벗었습니다." },
    c28_after_record: { tag: "문서로 남긴 결말", title: "조항과 대본을 나란히 적은 개정 요청서가 접수됐다", text: "제19조와 대본 4번의 문장이 한 문서에 나란히 섰고, 같은 조항에 걸린 1,318명의 명단이 붙었습니다. 명단 첫 줄에는 연하진이 적어 넣은 그의 아버지 이름이 있습니다." },
    c28_after_rush: { tag: "먼저 떠난 결말", title: "헤드셋을 반납한 날 싱가포르행 일정을 잡았다", text: "당신은 떡 한 팩을 가방에 넣고 자문료의 마지막 행방을 쫓기로 했습니다. 구로의 7층은 다음 주에도 3분짜리 대본으로 시작합니다." },
  },
  carryovers: {
    c28_after_warm: { trust: 8, humanCost: -4, fatigue: -7 },
    c28_after_record: { legitimacy: 10, trust: 3, fatigue: 5 },
    c28_after_rush: { capital: 6, legitimacy: 3, trust: -7 },
  },
  continuityChallenges: {
    c27_after_warm: { id: "protect-trust", title: "번호표 다음의 사람 지키기", text: "군산에 하루 더 남아 돌아오는 사람들을 맞았습니다. 거절 대본 앞에 선 채도훈과 도윤하를 같은 방식으로 지키는 선택을 찾아야 보너스가 열립니다." },
    c27_after_record: { id: "use-reframe", title: "작성자 없는 대본 다시 읽기", text: "보고서의 승인자 칸도, 대본의 작성자 칸도 비어 있습니다. 이름 없는 문서가 누구를 위해 쓰였는지 판을 다시 짜야 합니다." },
    c27_after_rush: { id: "repair-legitimacy", title: "헛걸음의 공정함 회복하기", text: "불 꺼진 12층으로 먼저 올라간 걸음은 아무것도 남기지 못했습니다. 그 이름을 절차 안에서 다시 증명할 선택을 찾아야 합니다." },
  },
};
