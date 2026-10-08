/**
 * CASE 09 -- the authored scenes of the rescue case.
 *
 * 사건 01 was 플로우온 collapsing and the analyst deciding who pays. Eight cases
 * later the same company is back at 72 hours, and this time the agenda is
 * liquidation. The bank pushing for it sends, as its reviewer, the founder's
 * eldest son -- the one who turned down the family business to become a banker,
 * whose uncles filled the seat he left and ran the company into 2023-0412.
 *
 * 사건 08 was the grudge's intelligence: it finds the weak point and it punishes.
 * This case is the other two engines of the season's thesis working together.
 * The analyst wants to help a person; 권도현 will not take help he cannot write
 * down, so every favour has to become a line on a profit-and-loss sheet with the
 * helper's own loss filled in. What the season has been building towards is
 * that the two sheets -- the one that saves the company and the one that
 * charges the people who broke it -- belong on the same table. Rescue without
 * accountability is a cover-up; accountability without rescue is 1,140 people
 * paying for someone else's crime a second time.
 */
export const case09Nodes = {
  c9_start: {
    phase: "CASE 09 BRIEFING",
    title: "다시, 72시간",
    speaker: "도윤하",
    text:
      "3년 전 KD은행이 310억을 빌려준 플로우온이 다시 채권단(돈을 빌려준 금융회사들의 협의체) 결의를 앞두고 있습니다. 이번 안건은 회생(빚을 조정해 회사를 살리는 절차)이 아니라 청산(회사를 정리해 없애는 절차)입니다. 직원 1,140명, 협력사 280곳. 청산을 밀어붙이는 쪽은 선순위 담보(회사가 무너지면 가장 먼저 돈을 가져갈 권리)를 쥔 브릿지은행이고, 그 대표로 나온 심사역(대출을 내줘도 되는지 따지는 은행 직원)은 창업주의 장남 권도현입니다. 도윤하가 채권단 명단을 내려놓습니다. '가업을 거절하고 은행에 간 사람이, 이번엔 은행 쪽에서 아버지 회사를 닫으러 왔어요.'",
    memo: [
      "채권단 결의까지 60시간, 안건: 청산",
      "직원 1,140명 · 협력사 280곳",
      "청산 주도: 선순위 담보권자 브릿지은행",
      "브릿지은행 대표 심사역 권도현 = 창업주 장남",
    ],
    triggers: ["affection", "responsibility", "protection"],
    choices: [
      {
        id: "c9_start_meet",
        label: "공식 회의 전에 권도현을 따로 만난다",
        effect: { trust: 9, legitimacy: -4, time: -6, fatigue: 5 },
        voice: "회의실에서는 서로의 은행만 말할 거라며, 권도현을 따로 만난다.",
        echo: "따로 만난 자리에서는 은행 이름을 내려놓을 수 있습니다. 회의록에는 그 만남이 없습니다.",
        next: "c9_ledger",
        cognition: { reframing: 2 },
      },
      {
        id: "c9_start_table",
        label: "채권단 공식 절차 안에서 회생안을 다시 올린다",
        effect: { legitimacy: 11, capital: -5, time: -9, fatigue: 4 },
        voice: "사람을 살리는 안도 절차 안에서 이겨야 한다며, 회생안을 다시 올린다.",
        echo: "공식 절차 안의 회생안은 흔들리지 않습니다. 흔들리지 않는 만큼 느리고, 60시간은 빠르게 줄어듭니다.",
        next: "c9_ledger",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "c9_start_floor",
        label: "물류센터 야간조부터 찾아가 현장 숫자를 모은다",
        effect: { trust: 7, humanCost: -6, capital: -4, time: -10, fatigue: 6 },
        voice: "숫자는 새벽 네 시에 있다며, 야간조부터 찾아가 현장 숫자를 모은다.",
        echo: "현장 숫자는 계산서에 없는 칸을 채웁니다. 새벽에 모은 숫자는 오후 회의에서 가장 늦게 읽힙니다.",
        next: "c9_ledger",
        cognition: { persistence: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c9_ledger",
      },
    ],
  },
  c9_ledger: {
    phase: "THE LEDGER",
    title: "권도현의 계산서",
    speaker: "권도현",
    text:
      "여의도의 새벽 카페. 권도현이 빈 종이에 세로줄을 긋고 칸을 나눕니다. 브릿지은행, KD은행, 직원, 협력사, 삼촌들, 그리고 당신. '저를 돕겠다고 하셨죠. 그럼 당신 칸부터 채우십시오. 이 일로 잃는 것과 얻는 것. 그 칸이 비어 있으면 저는 이 제안을 동정으로 읽고 거절합니다.' 그의 칸은 이미 채워져 있습니다. 잃는 것: 가족. 얻는 것: 없음.",
    memo: [
      "권도현의 칸: 잃는 것 '가족', 얻는 것 '없음'",
      "당신의 칸: 아직 공란",
      "브릿지은행 회수율(빌려준 돈을 돌려받는 비율): 회생 61%, 청산 78%",
      "회생안을 지지하면 권도현은 브릿지은행에서 경질될 수 있음",
    ],
    triggers: ["reward", "responsibility", "affection"],
    choices: [
      {
        id: "c9_ledger_honest",
        label: "내 칸에 잃을 것을 숨김없이 적는다",
        effect: { trust: 12, legitimacy: 4, capital: -6, fatigue: 6 },
        voice: "동정이 아니라는 걸 보여 주겠다며, 내 칸에 잃을 것을 숨김없이 적는다.",
        echo: "당신 칸이 채워지면 권도현은 제안을 읽기 시작합니다. 잃을 것을 적은 종이는 나중에 누구든 볼 수 있습니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c9_ledger_price",
        label: "그의 증언을 내가 받을 보상으로 적는다",
        effect: { legitimacy: 10, capital: 5, trust: -5, humanCost: 3, fatigue: 4 },
        voice: "공짜 도움은 당신도 불편할 거라며, 그의 증언을 내 보상 칸에 적는다.",
        echo: "보상을 적으면 거래가 됩니다. 거래는 동정보다 믿을 만하고, 동정보다 차갑습니다.",
        cognition: { inference: 1, risk: 1 },
      },
      {
        id: "c9_ledger_blank",
        label: "칸은 비워 두고 1,140명 때문이라고만 말한다",
        effect: { humanCost: -7, legitimacy: 3, trust: -6, time: -5, fatigue: 5 },
        voice: "내 칸은 중요하지 않다며, 1,140명 때문이라고만 말한다.",
        echo: "비워 둔 칸은 선의처럼 보입니다. 권도현에게는 계산하지 않은 사람의 약속처럼 보입니다.",
        cognition: { reframing: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c9_family: {
    phase: "THE FAMILY",
    title: "179.6",
    speaker: "반재욱",
    text:
      "반재욱이 3년 전 플로우온 장부 원본을 펼칩니다. 그 72시간 동안 누가 만들었는지 끝내 밝히지 못한 숫자, 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자) 179.6%. 만든 사람은 대표이사 권승우와 CFO(재무 책임자) 배성준, 권도현의 작은아버지와 고모부입니다. 장부를 부풀린 분식회계(실적을 꾸며 장부를 조작하는 일), 회삿돈으로 산 골프 회원권, 해온파트너스로 나간 자문료(조언을 해 준 값이라며 준 돈)까지. 배임(맡은 회사에 손해를 끼친 죄)과 횡령(회삿돈을 빼돌린 죄)이 한 장부에 같이 있습니다. 권도현이 한 장씩 넘기다 멈춥니다. '작은아버지가 제 대학 등록금을 내줬습니다. 그 돈이 어디서 나왔는지, 이제 알겠네요.'",
    memo: [
      "부채비율 179.6%를 만든 장부, 작성자 권승우·배성준",
      "회삿돈 골프 회원권 3구좌, 해온파트너스 자문료 지급",
      "배임·횡령·분식회계 고발 요건 충족",
      "고발하면 권도현은 가족 재판의 증인이 됨",
    ],
    triggers: ["responsibility", "injustice", "affection"],
    choices: [
      {
        id: "c9_family_charge",
        label: "두 사람을 배임·횡령·분식회계로 고발하기로 한다",
        effect: { legitimacy: 14, trust: -6, humanCost: 5, capital: -5, fatigue: 5 },
        voice: "등록금의 출처를 알고도 덮을 수는 없다며, 두 사람을 고발하기로 한다.",
        echo: "고발장은 179.6%에 이름을 붙입니다. 그 고발장이 접수되는 날 권도현은 가족 재판의 증인이 됩니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c9_family_restore",
        label: "고발 대신 개인 재산을 내놓게 해 피해부터 메운다",
        effect: { capital: 11, humanCost: -6, trust: 3, legitimacy: -9, fatigue: 4 },
        voice: "감옥보다 메우는 게 먼저라며, 개인 재산을 내놓게 해 피해부터 채운다.",
        echo: "개인 재산으로 메운 피해는 빨리 돌아옵니다. 장부를 부풀린 사람이 법정에 서는 날은 그만큼 멀어집니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "c9_family_choice",
        label: "고발 여부는 권도현이 정하게 하고 기다린다",
        effect: { trust: 12, legitimacy: 2, humanCost: 3, time: -10, fatigue: 6 },
        voice: "그의 가족이니 그가 정해야 한다며, 고발 여부를 권도현에게 맡기고 기다린다.",
        echo: "그에게 맡기면 결정은 그의 것이 됩니다. 그 결정을 기다리는 동안 결의 시각은 다가옵니다.",
        cognition: { persistence: 1, reframing: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c9_timing: {
    phase: "THE TIMING",
    title: "검사 착수일",
    speaker: "오진우",
    text:
      "오진우가 4층 자기 자리로 돌아왔습니다. 사직서는 한서윤이 철회 요청을 넣어 되돌렸고, 자리도 그대로입니다. 반재욱의 사표는 감사팀장 서랍에서 나오지 않았습니다. 수염은 깎지 않았지만 반찬통은 비워서 들고 왔습니다. 그가 달력 한 칸에 동그라미를 칩니다. '금융감독원(은행과 금융회사를 감시하는 나라 기관)이 브릿지은행을 정기검사(은행의 영업 전반을 들여다보는 정기 조사)하러 내일 아침 9시에 들어갑니다. 흔적표를 오늘 밤 안에 넣으면, 검사반은 담보 순위(누가 먼저 돈을 받느냐의 순서)를 사들인 거래를 첫날부터 봅니다.' 브릿지은행이 제재(감독 기관이 내리는 벌)를 받으면 선순위 담보(가장 먼저 돈을 가져갈 권리)가 묶이고 청산 결의는 힘을 잃습니다. 다만 그 은행에는 권도현이 있습니다.",
    memo: [
      "금감원 브릿지은행 정기검사 착수: 내일 09:00",
      "착수 전에 제보하면 부당하게 얻은 담보가 첫 검사 항목이 됨",
      "제재를 받으면 브릿지은행의 청산 찬성표 효력을 다툴 수 있음",
      "권도현은 담보 거래와 무관하지만 같은 부서 소속",
    ],
    triggers: ["revenge", "responsibility", "choice"],
    choices: [
      {
        id: "c9_timing_strike",
        label: "착수 전날 밤에 흔적표를 검사반에 넣는다",
        effect: { legitimacy: 13, capital: 8, trust: -7, humanCost: 5, fatigue: 5 },
        voice: "검사반이 첫날 볼 서류를 우리가 정하자며, 착수 전날 밤에 흔적표를 넣는다.",
        echo: "착수 전날 밤의 제보는 첫날의 검사를 바꿉니다. 같은 부서의 권도현도 첫날부터 조사 대상 옆에 앉습니다.",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c9_timing_warn",
        label: "넣기 전에 권도현에게 먼저 알린다",
        effect: { trust: 13, legitimacy: 3, capital: -7, time: -6, fatigue: 6 },
        voice: "같은 은행에 있는 사람을 모르게 칠 수는 없다며, 권도현에게 먼저 알린다.",
        echo: "먼저 알리면 그는 대비할 수 있습니다. 대비하는 사람 중에는 흔적을 지우고 싶은 사람도 있습니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "c9_timing_after",
        label: "청산 결의가 끝난 뒤로 제보를 미룬다",
        effect: { time: 8, capital: 4, humanCost: 8, legitimacy: -6, fatigue: -2 },
        voice: "결의부터 넘기고 보자며, 제보를 청산 결의 뒤로 미룬다.",
        echo: "결의 뒤의 제보는 결의를 흔들지 않습니다. 그날 청산이 결정되면 1,140명은 그 결정 안에 있습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c9_final: {
    phase: "FINAL DECISION",
    title: "살리는 쪽과 벌하는 쪽",
    speaker: "권도현",
    text:
      "채권단 결의 3시간 전. 권도현이 계산서 두 장을 나란히 놓습니다. 왼쪽은 플로우온을 살리는 계산서, 출자전환(빌려준 돈을 회사의 주인 몫으로 바꾸기)과 고용 승계(직원을 해고 없이 그대로 넘겨받기). 오른쪽은 무너뜨린 사람을 벌하는 계산서, 고발장과 흔적표와 검사반 제보. '둘 다 맞는 계산입니다. 문제는 두 장이 한 테이블에 올라가면 채권단이 겁을 먹는다는 거죠.' 그가 펜을 내밉니다. '어느 장에 서명하시겠습니까. 아니면 둘 다입니까.'",
    memo: [
      "살리는 계산서: 출자전환 + 1,140명 고용 승계",
      "벌하는 계산서: 권승우·배성준 고발 + 브릿지은행 제보",
      "두 장을 함께 올리면 결의가 지연될 수 있음",
      "권도현은 어느 쪽이든 서명란에 자기 이름을 쓰겠다고 함",
    ],
    triggers: ["affection", "responsibility", "choice", "reward"],
    choices: [
      {
        id: "c9_final_both",
        label: "두 장 모두 서명한다: 회사는 살리고 사람은 벌한다",
        effect: { legitimacy: 15, trust: 8, capital: -9, time: -6, fatigue: 7 },
        voice: "살리는 것과 벌하는 것은 같은 계산이라며, 두 장 모두 서명한다.",
        echo: "두 장에 모두 서명하면 결의는 늦어질 수 있습니다. 늦어진 결의에는 살린 이유와 벌한 이유가 함께 적힙니다.",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c9_final_rescue",
        label: "살리는 계산서만 올리고 고발은 결의 뒤로 미룬다",
        effect: { capital: 10, humanCost: -9, trust: 6, legitimacy: -7, fatigue: 5 },
        voice: "사람이 먼저 살아야 벌도 의미가 있다며, 살리는 계산서만 올린다.",
        echo: "살리는 계산서만 올리면 결의는 부드럽게 통과합니다. 고발은 다음 달의 일이 되고, 다음 달은 늘 바쁩니다.",
        cognition: { risk: 1, reframing: 1 },
      },
      {
        id: "c9_final_punish",
        label: "벌하는 계산서만 올리고 회생은 법원에 맡긴다",
        effect: { legitimacy: 12, capital: 4, trust: -5, humanCost: 10, fatigue: 4 },
        voice: "벌하지 않으면 다음 플로우온이 생긴다며, 벌하는 계산서만 올린다.",
        echo: "벌하는 계산서는 정확합니다. 회생을 맡은 법원은 1,140명의 이름을 한 명씩 읽지 않습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
};

/**
 * Everything else 사건 09 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case09 = {
  id: "case09",
  nodes: case09Nodes,
  aftermath: {
    c9_aftershock: {
      phase: "AFTERMATH",
      title: "야간조의 아침",
      speaker: "강태민",
      text: "결의가 끝난 다음 날 새벽 네 시, 플로우온 풀필먼트센터(물건을 보관하고 포장해 내보내는 물류 창고). 72시간의 그날 밤 컵라면을 뜯어 주던 야간조 반장 강태민이 당신을 알아봅니다. '낮에 오라니까.' 그가 웃으며 컵라면 두 개에 물을 붓습니다. 회사 이름은 바뀔지 모르지만 오늘 새벽에도 상자는 옮겨집니다. 삼 분을 기다리는 동안 그가 묻습니다. '이제 어디로 가요.'",
      memo: ["채권단 결의 결과가 현장에 공지됨", "야간조 380명 전원 출근", "권도현이 출근 명단 사본을 요청함", "영동지점 복귀 명령은 아직 유효"],
      triggers: ["affection", "protection", "responsibility"],
      choices: [
        {
          id: "c9_after_stay",
          label: "고용 승계가 끝날 때까지 현장 합의 자리를 지킨다",
          effect: { trust: 14, humanCost: -6, capital: -6, fatigue: 8 },
          voice: "공지된 결의가 현장에서 지켜지는지 보려고, 고용 승계가 끝날 때까지 현장 합의 자리를 지킨다.",
          echo: "남은 사람은 약속의 증인이 됩니다. 영동지점에는 복귀 지연 사유서가 한 장 더 쌓입니다.",
          next: "case09_result",
          cognition: { persistence: 2 },
        },
        {
          id: "c9_after_court",
          label: "법정과 검사반에서 끝까지 증언하러 간다",
          effect: { legitimacy: 15, trust: 4, time: -6, fatigue: 8 },
          voice: "이 계산에 끼어든 사람이 끝까지 설명해야 한다며, 법정과 검사반으로 간다.",
          echo: "증언은 계산서를 사실로 만듭니다. 법정은 새벽 네 시의 컵라면을 증거로 받지 않습니다.",
          next: "case09_result",
          cognition: { inference: 2, reframing: 1 },
        },
        {
          id: "c9_after_return",
          label: "컵라면을 다 먹고 조용히 영동지점으로 돌아간다",
          effect: { capital: 11, time: 7, trust: -11, legitimacy: -5, humanCost: 7, fatigue: 2 },
          voice: "컵라면 국물까지 다 마시고, 조용히 영동으로 돌아가는 첫차를 탄다.",
          echo: "조용히 돌아가면 고용 승계가 어떻게 끝났는지는 뉴스로 듣습니다. 강태민은 다음에도 컵라면을 두 개 챙길지 잠깐 고민합니다.",
          next: "case09_result",
          cognition: { risk: 2 },
        },
      ],
    },
  },
  aftermathRoute: ["c9_final", "c9_aftershock"],
  connectiveScenes: [
    {
      id: "c9_calc",
      after: "c9_ledger",
      next: "c9_family",
      title: "계산기 두 대",
      speaker: "권도현",
      text: "카페 문이 닫힐 무렵, 권도현이 계산기를 하나 더 꺼냅니다. '각자 자기 입장에서 계산해 봅시다. 숫자가 같게 나오면 그때부터 믿겠습니다.' 둘이 20분 동안 말없이 두드립니다. 결과는 3억 차이. 권도현이 처음으로 웃습니다. '그 차이가 선의입니까, 실수입니까.'",
      memo: ["두 계산 결과의 차이 3억", "차이는 직원 퇴직금 산정 방식에서 발생", "권도현은 차이의 이유를 요구함"],
      choices: [
        {
          label: "차이 3억을 직원 퇴직금 쪽으로 맞춘다",
          effect: { trust: 9, humanCost: -4, capital: -7, time: -4, fatigue: 5 },
          voice: "퇴직금 산정 방식에서 난 차이를 깎는 쪽으로 맞출 수는 없다며, 차이 3억을 직원 퇴직금 쪽으로 맞춘다.",
          echo: "퇴직금 쪽으로 맞추면 선의라는 답이 됩니다. 권도현은 그 선의가 누구 돈으로 계산됐는지 물을 겁니다.",
        },
        {
          label: "산정 기준표를 꺼내 한 줄씩 대조한다",
          effect: { legitimacy: 7, time: -6, humanCost: 3, fatigue: 4 },
          voice: "선의인지 실수인지 답하려면 차이가 난 자리부터 봐야 해서, 산정 기준표를 꺼내 한 줄씩 대조한다.",
          echo: "한 줄씩 대조하면 실수라는 답이 나올 수 있습니다. 실수를 찾는 데 새벽 한 시간이 들어갑니다.",
        },
        {
          label: "차이는 반올림 오차로 처리하고 넘어간다",
          effect: { time: 6, capital: 6, trust: -7, humanCost: 4, fatigue: -3 },
          voice: "숫자가 같아야 믿겠다는 권도현 앞에서 차이를 키우지 않으려고, 3억은 반올림 오차로 처리하고 넘어간다.",
          echo: "오차로 넘기면 둘 다 편합니다. 3억은 사라지지 않고 누군가의 퇴직금 칸에서 빠집니다.",
        },
      ],
    },
    {
      id: "c9_wedding",
      after: "c9_family",
      next: "c9_timing",
      title: "청첩장",
      speaker: "도윤하",
      text: "권도현의 휴대폰 잠금화면에 청첩장이 떠 있습니다. 다음 달, 혼주석 옆에 작은아버지 부부 자리가 이미 잡혀 있습니다. 도윤하가 그 화면을 보고 커피를 사러 나갔다가, 한참 뒤에 세 잔을 들고 들어옵니다. '제일 단 걸로 샀어요. 오늘은 그래도 되는 날 같아서요.'",
      memo: ["권도현 결혼식 5주 뒤", "혼주석 배치에 권승우 부부 포함", "고발하면 결혼식 전에 기사가 날 수 있음"],
      choices: [
        {
          label: "결혼식 뒤로 고발 시점을 옮길 수 있는지 함께 따져 본다",
          effect: { trust: 10, legitimacy: 3, capital: -5, time: -5, fatigue: 5 },
          voice: "고발하면 결혼식 전에 기사가 날 수 있어서, 고발 시점을 결혼식 뒤로 옮길 수 있는지 함께 따져 본다.",
          echo: "시점을 따져 보면 그는 혼자가 아닙니다. 옮긴 5주 동안 장부를 고칠 시간도 함께 생깁니다.",
        },
        {
          label: "일정과 상관없이 고발 절차 시간표를 그대로 둔다",
          effect: { legitimacy: 8, time: -4, humanCost: 4, fatigue: 3 },
          voice: "혼주석 자리에 맞춰 고발 날짜를 정할 수는 없다며, 일정과 상관없이 고발 절차 시간표를 그대로 둔다.",
          echo: "시간표를 지키면 고발은 흔들리지 않습니다. 기사는 결혼식보다 먼저 나갈 수 있습니다.",
        },
        {
          label: "그 얘기는 꺼내지 않고 오늘 일만 끝낸다",
          effect: { time: 5, capital: 5, trust: -6, humanCost: 3, fatigue: -3 },
          voice: "청첩장 얘기는 꺼내지 않고, 오늘 일만 끝내자고 한다.",
          echo: "꺼내지 않으면 오늘은 끝납니다. 청첩장은 내일도 잠금화면에 있습니다.",
        },
      ],
    },
    {
      id: "c9_night",
      after: "c9_timing",
      next: "c9_final",
      title: "새벽 두 시의 사무실",
      speaker: "한서윤",
      text: "새벽 두 시, 트리거랩 4층. 한서윤이 진술서를 인쇄하다가 프린터 앞에서 멈춥니다. 오진우는 소파에서 잠들었고, 반재욱은 그 위에 자기 재킷을 덮어 줍니다. 도윤하는 컵라면 물을 올립니다. 한서윤이 작게 말합니다. '이 방에서 다섯 사람이 같은 편으로 앉아 있는 걸, 저는 처음 봅니다.'",
      memo: ["한서윤 진술서 인쇄 완료", "검사반 제보 마감까지 7시간", "다섯 사람이 같은 파일을 보고 있음"],
      choices: [
        {
          label: "잠든 사람은 깨우지 않고 남은 일을 나눠 맡는다",
          effect: { trust: 9, legitimacy: 4, capital: -6, time: -5, fatigue: 6 },
          voice: "반재욱이 재킷까지 덮어 준 잠이라, 잠든 사람은 깨우지 않고 남은 일을 나눠 맡는다.",
          echo: "나눠 맡은 밤은 길어집니다. 아침에 깬 사람은 자기 몫이 끝나 있는 걸 봅니다.",
        },
        {
          label: "제보 서류를 체크리스트대로 한 번 더 검토한다",
          effect: { legitimacy: 8, time: -5, humanCost: 3, fatigue: 4 },
          voice: "검사반 마감까지 일곱 시간이 남아 있어서, 제보 서류를 체크리스트대로 한 번 더 검토한다.",
          echo: "한 번 더 본 서류는 검사반에서 되돌아오지 않습니다. 마감까지 남은 7시간 중 두 시간이 여기에 들어갑니다.",
        },
        {
          label: "오늘은 여기까지 하고 각자 집으로 보낸다",
          effect: { time: 6, capital: 4, trust: -5, humanCost: 4, fatigue: -4 },
          voice: "새벽 두 시이고 진술서 인쇄도 끝났으니, 오늘은 여기까지 하고 각자 집으로 보낸다.",
          echo: "집에 간 사람들은 잠을 잡니다. 제보 서류는 아침에 한 사람이 혼자 마감합니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c9_calc_reaction",
      after: "c9_calc",
      next: "c9_family",
      title: "3억의 이름",
      speaker: "에코",
      text: "에코가 3억의 내역을 띄웁니다. 차이는 22년 동안 일한 물류 직원 열한 명의 퇴직금 누적분입니다. 권도현의 계산에서는 회사를 넘기는 순간 사라지고, 당신의 계산에서는 그대로 지급됩니다. '같은 회사를 살리는 계산서 두 장이, 열한 명의 22년을 두고 갈라집니다.'",
      memo: ["열한 명의 22년", "승계 조건에 못 박을 숫자"],
      choices: [
        {
          label: "열한 명의 퇴직금을 승계 조건에 못 박는다",
          effect: { trust: 9, humanCost: -5, capital: -6, time: -4, fatigue: 5 },
          voice: "회사를 넘기는 순간 사라지는 돈이 되지 않게, 열한 명의 퇴직금을 승계 조건에 못 박는다.",
          echo: "못 박은 3억은 회생안의 비용이 됩니다. 채권단은 그 3억을 회수율에서 뺍니다.",
        },
        {
          label: "소멸 조항의 법적 근거부터 확인한다",
          effect: { legitimacy: 6, time: -5, humanCost: 3, fatigue: 3 },
          voice: "소멸 조항이 법적으로 맞는지, 근거부터 확인하자고 한다.",
          echo: "법적 근거를 확인하면 싸움은 정확해집니다. 열한 명은 그 사이 결과를 기다립니다.",
        },
        {
          label: "승계 협상에서 쓸 양보 카드로 남겨 둔다",
          effect: { time: 5, capital: 6, trust: -6, humanCost: 4, fatigue: -3 },
          voice: "퇴직금 3억은 승계 협상에서 쓸 양보 카드로 남겨 두자고 한다.",
          echo: "양보 카드는 협상을 부드럽게 합니다. 카드로 쓰인 퇴직금은 누군가의 22년입니다.",
        },
      ],
    },
    {
      id: "c9_wedding_reaction",
      after: "c9_wedding",
      next: "c9_timing",
      title: "혼주석",
      speaker: "권도현",
      text: "권도현이 휴대폰을 뒤집어 놓습니다. '작은아버지가 혼주석에 앉는 걸 막으면 신부가 이유를 묻겠죠. 저는 그 이유를 말할 자신이 없습니다.' 그가 단 커피를 한 모금 마시고 얼굴을 찡그립니다. '그렇다고 등록금 받은 값으로 1,140명을 계산할 수도 없고요.'",
      memo: ["혼주석에 앉을 사람", "말할 자신이 없는 이유"],
      choices: [
        {
          label: "신부에게 직접 말할 수 있도록 그의 곁에 선다",
          effect: { trust: 10, legitimacy: 2, capital: -3, time: -6, fatigue: 6 },
          voice: "신부에게 직접 말할 수 있도록, 권도현 곁에 서겠다고 한다.",
          echo: "곁에 서면 그는 말할 수 있습니다. 당신은 남의 결혼식에서 가장 불편한 손님이 됩니다.",
        },
        {
          label: "결혼식과 무관하게 법적 일정대로 간다",
          effect: { legitimacy: 7, time: -3, humanCost: 3, fatigue: 3 },
          voice: "1,140명을 가족 사정으로 계산할 수는 없다는 그의 말대로, 결혼식과 무관하게 법적 일정대로 간다.",
          echo: "법적 일정은 흔들리지 않습니다. 권도현은 흔들리는 마음을 혼자 감당합니다.",
        },
        {
          label: "가족 일에는 끼어들지 않겠다고 선을 긋는다",
          effect: { time: 6, capital: 4, trust: -7, humanCost: 3, fatigue: -3 },
          voice: "혼주석에 누가 앉을지는 그와 신부가 정할 일이라며, 가족 일에는 끼어들지 않겠다고 선을 긋는다.",
          echo: "선을 그으면 당신은 계산서 밖에 남습니다. 그가 원한 게 그것인지는 모릅니다.",
        },
      ],
    },
    {
      id: "c9_night_reaction",
      after: "c9_night",
      next: "c9_final",
      title: "재킷",
      speaker: "반재욱",
      text: "반재욱이 재킷 없이 창가에 서서 말합니다. '나는 사람을 자르는 일을 20년 했습니다. 오늘 처음으로 사람을 남기는 서류를 씁니다.' 그가 수첩의 빈 장을 한 장 찢어 건넵니다. 마흔일곱 명의 이름을 적어 온 수첩의 종이에 한 줄이 새로 적혀 있습니다. '1,140 -- 남김.'",
      memo: ["자르는 서류와 남기는 서류", "결의 자료 맨 앞의 한 줄"],
      choices: [
        {
          label: "그 한 장을 결의 자료 맨 앞에 붙인다",
          effect: { trust: 8, legitimacy: 5, capital: -5, time: -5, fatigue: 5 },
          voice: "반재욱이 찢어 준 한 장을, 결의 자료 맨 앞에 붙인다.",
          echo: "맨 앞에 붙은 한 장은 채권단이 가장 먼저 읽습니다. 숫자가 아닌 줄이 결의 자료에 들어간 건 처음입니다.",
        },
        {
          label: "수첩 한 장은 증거가 아니니 따로 보관한다",
          effect: { legitimacy: 6, time: -4, humanCost: 3, fatigue: 3 },
          voice: "한 줄뿐인 종이는 제보 서류에 넣을 증거가 못 된다며, 수첩 한 장을 따로 보관한다.",
          echo: "따로 둔 한 장은 누구에게도 설명할 필요가 없습니다. 그래서 오래 남습니다.",
        },
        {
          label: "감상은 나중에 하고 서류 마감부터 챙긴다",
          effect: { time: 5, capital: 5, trust: -6, humanCost: 4, fatigue: -4 },
          voice: "제보 마감이 아침으로 다가와 있어서, 감상은 나중에 하고 서류 마감부터 챙긴다.",
          echo: "마감은 지켜집니다. 반재욱은 창가에 조금 더 서 있다가 재킷 없이 퇴근합니다.",
        },
      ],
    },
  ],
  branchPlan: ["c9_family", 2, "c9_branch_father", "c9_branch_father_follow"],
  branchScenes: {
    // CASE 09's detour is the founder. The case argues in spreadsheets, so its
    // side door is the one room where nobody can read one.
    c9_branch_father: {
      phase: "SIDE DOOR",
      title: "요양병원 3층",
      speaker: "권도현",
      text: "권도현이 결정을 미루고 요양병원으로 갑니다. 당신도 따라갑니다. 창업주 권태호는 아들을 알아보지 못하고 당신에게 묻습니다. '자네가 새로 온 배차 담당인가. 야간조 애들 밥은 먹였나.' 권도현이 창밖을 봅니다. '아버지가 기억하는 회사는 1,140명이 아니라 서른 명일 때입니다. 그때는 이름을 다 외웠대요.'",
      memo: ["창업주 권태호, 치매 진단 4년차", "창업 초기 직원 30명 중 11명이 아직 재직", "그 11명이 퇴직금 차이 3억의 당사자"],
      triggers: ["affection", "protection", "responsibility"],
      choices: [
        {
          id: "c9_branch_father_a",
          label: "초기 직원 열한 명의 이름을 회생안 첫 장에 적는다",
          effect: { trust: 11, humanCost: -7, capital: -8, time: -5, fatigue: 6 },
          voice: "아버지가 외우던 이름부터 적자며, 초기 직원 열한 명을 회생안 첫 장에 쓴다.",
          echo: "열한 명의 이름이 첫 장에 오면 회생안은 사람의 문서가 됩니다. 채권단은 그 장을 넘기고 숫자부터 봅니다.",
          next: "c9_branch_father_follow",
          cognition: { reframing: 2 },
        },
        {
          id: "c9_branch_father_b",
          label: "감정은 접고 고발 여부를 오늘 안에 정하자고 한다",
          effect: { legitimacy: 9, time: 5, trust: -6, humanCost: 3, fatigue: 3 },
          voice: "여기서 흔들리면 결의를 놓친다며, 고발 여부를 오늘 안에 정하자고 한다.",
          echo: "오늘 정하면 결의에 늦지 않습니다. 권도현은 아버지 병실에서 나온 지 한 시간 만에 가족을 고발할지 정해야 합니다.",
          next: "c9_branch_father_follow",
          cognition: { risk: 1 },
        },
        {
          id: "c9_branch_father_c",
          label: "그가 아버지 곁에 있도록 협상을 하루 대신 맡는다",
          effect: { trust: 9, legitimacy: 5, capital: -4, time: -9, fatigue: 8 },
          voice: "결정을 미루고 온 병실이니 오늘은 아버지 곁에 있으라며, 협상을 하루 대신 맡는다.",
          echo: "대신 맡은 협상은 당신의 하루를 씁니다. 권도현은 아버지가 기억하는 서른 명의 이름을 한 번 더 듣습니다.",
          next: "c9_branch_father_follow",
          cognition: { persistence: 2 },
        },
      ],
    },
    c9_branch_father_follow: {
      phase: "SIDE DOOR",
      title: "서른 명의 사진",
      speaker: "강태민",
      text: "병원 주차장에서 야간조 반장 강태민이 기다리고 있습니다. 권도현이 불렀습니다. 강태민이 낡은 사진 한 장을 내밉니다. 창업 첫해, 트럭 두 대 앞에 선 서른 명. 맨 끝에 어린 권도현이 있습니다. '대표님 아들이 가업 안 잇는다고 했을 때 우리가 제일 좋아했어요. 저 사람은 우리처럼 살지 말라고.'",
      memo: ["창업 첫해 사진: 직원 30명과 어린 권도현", "강태민은 초기 직원 11명 중 한 명", "권도현은 사진을 채권단 자료에 넣을지 망설임"],
      triggers: ["affection", "trust", "responsibility"],
      choices: [
        {
          id: "c9_branch_father_follow_a",
          label: "사진을 채권단 자료 맨 뒤에 조용히 넣는다",
          effect: { trust: 10, legitimacy: 4, humanCost: -5, capital: -6, fatigue: 6 },
          voice: "숫자로 설명되지 않는 한 장이라며, 사진을 채권단 자료 맨 뒤에 넣는다.",
          echo: "맨 뒤의 사진은 아무도 먼저 말하지 않습니다. 끝까지 읽은 사람만 봅니다.",
          next: "c9_timing",
          cognition: { reframing: 3 },
        },
        {
          id: "c9_branch_father_follow_b",
          label: "사진은 돌려주고 숫자로만 싸운다",
          effect: { legitimacy: 8, time: 4, trust: -4, humanCost: 3, fatigue: 3 },
          voice: "사진은 당신들 것이라며 돌려주고, 숫자로만 싸우겠다고 한다.",
          echo: "숫자로만 싸우면 반박당할 틈이 없습니다. 사진 속 서른 명은 다시 서랍으로 들어갑니다.",
          next: "c9_timing",
          cognition: { inference: 1 },
        },
        {
          id: "c9_branch_father_follow_c",
          label: "열한 명을 결의장에 직접 부른다",
          effect: { trust: 13, humanCost: -6, legitimacy: -3, time: -10, fatigue: 8 },
          voice: "사진 속 사람들이 직접 말하게 하자며, 열한 명을 결의장에 부른다.",
          echo: "결의장에 선 열한 명은 가장 강한 자료입니다. 그들은 그날 하루치 일당을 잃습니다.",
          next: "c9_timing",
          cognition: { persistence: 2 },
        },
      ],
    },
  },
  routePlan: {
    start: "c9_start",
    result: "c9_aftershock",
    defaultFree: "c9_route_system",
    // One rescue, two sheets of paper. The split is the table, not the route.
    choices: {},
    system: {
      route: "c9_route_system",
      final: "c9_final_system_route",
      title: "세 번째 계산서",
      speaker: "에코",
      text: "채권단(돈을 빌려준 금융회사들의 협의체) 앞에 놓일 계산서는 두 장입니다. 플로우온을 살리는 계산서와, 무너뜨린 사람을 벌하는 계산서. 그 옆에 아무도 세지 않은 비용을 놓자고 하자 에코가 세 번째 표를 엽니다. 채권단 누구도 작성하지 않은 계산서, 청산(회사를 정리해 없애는 절차)했을 때 1,140명의 가족이 치르는 비용입니다. 건강보험 전환, 학자금 연체(갚을 날짜를 넘긴 빚), 협력사 연쇄 부도(빚을 갚지 못해 회사가 쓰러지는 일). 합계는 브릿지은행이 청산으로 더 돌려받는 금액의 2.3배입니다.",
      memo: ["청산 때 가족·협력사가 치를 비용 추정: 더 돌려받는 금액의 2.3배", "채권단 계산서에는 이 칸이 없음", "추정치라 법적 구속력은 없음"],
      routeChoices: [
        {
          id: "c9_route_system_add",
          label: "세 번째 계산서를 채권단 공식 자료로 올린다",
          effect: { legitimacy: 10, trust: 4, capital: -6, time: -8, fatigue: 7 },
          voice: "아무도 세지 않은 비용이 논의에 들어가게, 세 번째 계산서를 채권단 공식 자료로 올린다.",
          echo: "공식 자료가 되면 채권단은 그 숫자를 반박해야 합니다. 반박하려면 먼저 읽어야 합니다.",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c9_route_system_quiet",
          label: "표는 닫고 기존 두 장으로만 싸운다",
          effect: { time: 7, capital: 8, trust: -7, legitimacy: -6, humanCost: 4, fatigue: -4 },
          voice: "추정으로는 채권단을 못 움직인다며, 표는 닫고 기존 두 장으로만 싸운다.",
          echo: "두 장으로만 싸우면 회의는 회수율의 말로 끝납니다. 1,140명의 비용은 이번에도 회의록 밖에 있습니다.",
          cognition: { risk: 2 },
        },
        {
          id: "c9_route_system_families",
          label: "가족 대표들에게 이 표를 먼저 보여 준다",
          effect: { trust: 12, legitimacy: 5, capital: -7, humanCost: -6, time: -9, fatigue: 8 },
          voice: "비용을 치를 사람들이 먼저 봐야 한다며, 가족 대표들에게 이 표를 먼저 보여 준다.",
          echo: "먼저 보여 주면 가족들은 자기 집 숫자를 표에서 찾습니다. 몇 사람은 추정치가 실제보다 적다며 고쳐 줍니다.",
          cognition: { reframing: 2 },
        },
      ],
      finalTitle: "아무도 쓰지 않은 한 장",
      finalText: "채권단 결의까지 여섯 시간, 자료 단말에는 세 번째 계산서가 저장되지 않은 채 떠 있습니다. 회사를 닫으면 1,140명의 가족과 협력사가 치를 비용이고, 채권단의 두 장 어디에도 이 칸은 없습니다. 에코는 표의 제목 옆에 '추정'이라고 적어 둡니다. '추정이라는 말은 틀렸다는 뜻이 아닙니다. 추정이라서 아무도 서명하지 않았고, 서명이 없어서 회의에 오른 적이 없습니다.'",
      finalMemo: ["세 번째 계산서: 작성자 칸 공란", "채권단 자료에는 없는 비용", "채권단 결의까지 6시간"],
    },
    finalChoices: [
      {
        id: "a",
        label: "세 장의 계산서를 한 묶음으로 결의에 올린다",
        effect: { legitimacy: 12, trust: 7, capital: -8, humanCost: -5, fatigue: 8 },
        voice: "빠진 칸까지 보고 결정할 수 있게, 세 장의 계산서를 한 묶음으로 결의에 올린다.",
        echo: "한 묶음이 되면 살리는 값과 벌하는 값 옆에 치르는 값이 섭니다. 채권단은 세 번째 장에서 가장 오래 멈춥니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "b",
        label: "세 번째 표는 덮고 회수율로만 협상한다",
        effect: { capital: 9, time: 6, trust: -8, legitimacy: -7, humanCost: 6, fatigue: -4 },
        voice: "서명 없는 추정은 회의에서 힘이 없다며, 세 번째 표는 덮고 회수율로만 협상한다.",
        echo: "회수율로만 말하면 협상은 빨라집니다. 표에 적혔던 비용은 청구서가 되어 집집마다 따로 갑니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c",
        label: "세 번째 표 맨 아래에 작성자로 내 이름을 쓴다",
        effect: { legitimacy: 9, trust: 6, capital: -5, time: -6, humanCost: 3, fatigue: 8 },
        voice: "서명이 없어 못 오른 표라면 내가 서명하기로 하고, 세 번째 표 맨 아래에 작성자로 내 이름을 쓴다.",
        echo: "이름을 쓰면 추정치를 책임질 사람이 생깁니다. 숫자가 틀린 날 가장 먼저 불려 갈 사람도 당신입니다.",
        cognition: { persistence: 2 },
      },
    ],
  },
  evidencePlan: {
    node: "c9_evidence_turn",
    result: "c9_aftershock",
    sourceRoutes: ["c9_ledger", "c9_family", "c9_timing", "c9_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "청산 계산서의 숫자를 단서의 흔적표와 짝지어, 어느 숫자가 어느 승인에서 왔는지 거슬러 오른다.",
    entryEcho: "숫자를 짝지으면 청산의 계산서는 중립적인 숫자가 아니라 누군가 사 둔 결론이 됩니다.",
    title: "청산 회수율의 출처",
    speaker: "오진우",
    text: "단서를 맞추자 브릿지은행이 내민 청산 회수율(빌려준 돈을 돌려받는 비율) 78%의 출처가 드러납니다. 담보 가치를 매긴 감정평가법인(부동산·설비 값을 매기는 회사)은 해온파트너스와 같은 세무 대리인(세금 신고를 대신해 주는 사무소)을 씁니다. 청산이 유리하다는 숫자 자체가, 흔적표의 같은 손에서 나왔습니다.",
    memo: ["회수율 78%를 산정한 감정평가법인 = 해온과 같은 세무 대리인", "다시 평가하면 청산 회수율 64%로 하락 추정", "회생안이 청산보다 유리해질 수 있음"],
    triggers: ["injustice", "system", "responsibility"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, fatigue: 4 },
    choices: [
      {
        id: "c9_evidence_turn_reappraise",
        label: "담보 재평가를 요구해 회수율 숫자를 다시 쓴다",
        effect: { legitimacy: 12, trust: 5, capital: -7, time: -6, fatigue: 7 },
        voice: "사 둔 숫자는 다시 재야 한다며, 담보 재평가를 요구한다.",
        echo: "재평가는 숫자를 바로잡습니다. 바로잡는 데 드는 시간은 청산을 서두르는 쪽이 가장 싫어합니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c9_evidence_turn_hold",
        label: "출처는 알아 두고 결의장에서만 꺼낸다",
        effect: { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -3 },
        voice: "출처는 결의장에서 한 번에 꺼내자며, 지금은 알아 두기만 한다.",
        echo: "결의장에서 꺼낸 출처는 극적입니다. 극적인 증거는 회의를 멈추고, 멈춘 회의는 다시 날짜를 잡습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c9_evidence_turn_share",
        label: "권도현에게 먼저 보여 주고 그의 이름으로 문제를 제기하게 한다",
        effect: { trust: 11, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 7 },
        voice: "그의 은행이 산 숫자이니 그가 말해야 한다며, 권도현에게 먼저 보여 준다.",
        echo: "그가 문제를 제기하면 자기 은행을 겨누는 셈입니다. 그 계산은 그가 가장 잘합니다.",
        cognition: { reframing: 2 },
      },
    ],
    entryLabel: "청산 회수율 78%를 계산한 곳을 찾아간다",
  },
  memoryPlan: {
    systemNext: "c9_route_system",
    evidenceNext: "c9_evidence_turn",
    systemLabel: "영동지점에서 다시 짠 판이 채권단 자료에 자리를 얻었는지 찾는다",
    evidenceLabel: "자문료의 날짜를 청산 계산서의 작성일에 겹친다",
    systemEcho: "찾아봐도 채권단 자료에는 당신이 다시 짠 판이 들어갈 칸이 없습니다. 에코가 그 빈자리에 세 번째 표를 엽니다.",
    evidenceEcho: "작성일에 겹치면 청산 회수율을 계산한 곳의 이름이 나옵니다. 흔적표에서 본 세무 대리인을 같이 씁니다.",
  },
  openingRoutes: {
    c8_after_law: "c9_start_law",
    c8_after_friend: "c9_start_friend",
    c8_after_blade: "c9_start_blade",
  },
  openingCopy: {
    c9_start_law: ["흔적을 기록으로 만든 사람의 72시간", "반재욱", "당신은 흔적표에 지점장 도장까지 받아 공식 기록으로 만들었습니다. 수사는 느리게 시작됐고, 그 사이 플로우온 채권단(돈을 빌려준 금융회사들의 협의체)은 빠르게 청산 쪽으로 기울었습니다. 직원은 1,140명이고, 청산을 미는 브릿지은행이 대표로 보낸 사람은 창업주의 장남 권도현입니다. 기록은 남았지만, 기록이 사람을 먼저 구하지는 않습니다.", ["수사 의뢰서 접수 완료, 착수 시점 미정", "채권단 결의 안건: 청산", "권도현이 기록 사본 열람을 요청함"]],
    c9_start_friend: ["친구를 찾으러 간 사람의 72시간", "오진우", "당신은 연락이 끊긴 오진우를 찾아 서울로 올라왔습니다. 그는 고시원 방 벽에 흔적표를 붙여 놓고 있었습니다. 둘이 국밥을 먹은 다음 날, 플로우온 청산(회사를 정리해 없애는 절차) 안건이 채권단(돈을 빌려준 금융회사들의 협의체)에 올라옵니다. 청산을 미는 브릿지은행이 대표로 보낸 사람은 창업주의 장남 권도현, 걸린 직원은 1,140명입니다. 오진우가 먼저 일어섭니다. '이번엔 같이 가죠. 복수 말고, 다른 거 하러.'", ["오진우가 추적 자료를 공동 보관으로 넘김", "채권단 결의 안건: 청산", "오진우와 권도현은 대학 동기"]],
    c9_start_blade: ["칼을 혼자 쥔 사람의 72시간", "에코", "당신은 흔적표를 혼자 쥐고 기다렸고, 쓸 때가 왔습니다. 플로우온 청산(회사를 정리해 없애는 절차) 안건이 채권단(돈을 빌려준 금융회사들의 협의체)에 올라왔고, 청산을 밀어붙이는 브릿지은행이 흔적표의 한 줄에 있습니다. 그 은행이 대표로 보낸 사람은 창업주의 장남 권도현이고, 플로우온 직원은 1,140명입니다. 혼자 쥔 칼은 빠르지만, 누구도 그 칼이 공정했는지 증언해 주지 않습니다.", ["흔적표 원본은 당신 혼자 보관", "채권단 결의 안건: 청산", "칼의 쓰임새를 아는 사람이 없음"]],
  },
  openingSignatures: {
    c9_start_law: {
      label: "접수된 수사 의뢰서를 채권단 참고 자료로 정식 제출한다",
      effect: { legitimacy: 11, trust: 3, capital: -6, time: -5, fatigue: 5 },
      cognition: { inference: 2 },
      voice: "공식 기록으로 만든 흔적표를, 채권단 테이블에도 같은 문으로 올린다.",
      echo: "수사 의뢰서가 채권단 자료에 붙으면 청산을 서두르는 쪽이 설명해야 합니다. 설명하는 동안 60시간은 줄어듭니다.",
    },
    c9_start_friend: {
      label: "오진우에게 권도현을 먼저 만나 달라고 부탁한다",
      effect: { trust: 12, legitimacy: -6, humanCost: -4, time: -7, fatigue: 6 },
      cognition: { reframing: 2 },
      voice: "대학 동기라는 말에 기대어, 오진우에게 권도현을 먼저 만나 달라고 한다.",
      echo: "복수를 내려놓은 사람이 처음 맡은 일이 친구를 설득하는 일입니다. 실패하면 둘 다 조금 더 외로워집니다.",
    },
    c9_start_blade: {
      label: "흔적표 한 줄을 권도현에게만 보여 주고 반응을 본다",
      effect: { capital: 9, legitimacy: 3, trust: -5, humanCost: 3, time: -3, fatigue: 4 },
      cognition: { risk: 2 },
      voice: "칼끝만 조금 보이듯, 흔적표의 한 줄을 권도현 앞에 놓는다.",
      echo: "한 줄만 보여 주면 상대는 나머지를 계산합니다. 권도현은 계산이 빠른 사람입니다.",
    },
  },
  setting: { place: "플로우온 본사 8층 상황실", clock: "채권단 결의까지 60h" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 09
    c9_start: {
      place: "플로우온 본사 8층 상황실",
      clock: "채권단 결의까지 60h",
      question: "72시간의 그 회사가 이번에는 청산 안건에 올랐습니다. 어디서부터 시작하겠습니까?",
      lead: "3년 만에 같은 상황실입니다. 화이트보드에는 그때 누군가 적은 '72h'가 반쯤 지워진 채 남아 있습니다.",
    },
    c9_start_law: {
      place: "플로우온 본사 8층 상황실",
      clock: "채권단 결의까지 60h",
      question: "수사는 느리고 결의는 빠릅니다. 기록이 구하지 못한 사람을 어디서부터 찾겠습니까?",
      lead: "흔적표는 공식 기록이 됐지만 수사 착수일은 아직 비어 있습니다. 그 사이 청산(회사를 정리해 없애는 절차) 안건이 먼저 올라왔습니다.",
    },
    c9_start_friend: {
      place: "플로우온 본사 8층 상황실",
      clock: "채권단 결의까지 60h",
      question: "오진우가 복수 말고 다른 걸 하자고 합니다. 어디서부터 시작하겠습니까?",
      lead: "고시원에서 국밥을 먹은 다음 날입니다. 오진우는 권도현이 대학 동기라는 사실을 늦게야 말합니다.",
    },
    c9_start_blade: {
      place: "플로우온 본사 8층 상황실",
      clock: "채권단 결의까지 60h",
      question: "청산을 미는 은행이 당신이 혼자 쥔 흔적표에 있습니다. 어디서부터 시작하겠습니까?",
      lead: "혼자 쥔 흔적표를 쓸 때가 왔습니다. 문제는 칼로는 벌할 수 있어도 살릴 수는 없다는 겁니다.",
    },
    c9_ledger: {
      place: "여의도 새벽 카페",
      clock: "채권단 결의까지 52h",
      question: "권도현이 당신 칸이 비어 있으면 동정으로 읽겠다고 합니다. 당신 칸에 무엇을 적겠습니까?",
      lead: "권도현은 약속 시간보다 20분 먼저 와서 출력물의 모서리를 맞추고 있습니다.",
    },
    c9_calc: {
      place: "여의도 새벽 카페 · 창가 자리",
      clock: "채권단 결의까지 50h",
      question: "같은 회사를 살리는 두 계산이 3억 차이 납니다. 그 차이를 어떻게 맞추겠습니까?",
    },
    c9_calc_reaction: {
      place: "여의도 새벽 카페 · 창가 자리",
      clock: "채권단 결의까지 49h",
      question: "3억은 22년 동안 일한 열한 명의 퇴직금입니다. 이 숫자를 어디에 두겠습니까?",
    },
    c9_family: {
      place: "회기동 헌책방 2층 · 장부 더미",
      clock: "채권단 결의까지 40h",
      question: "179.6%를 만든 사람은 권도현의 작은아버지와 고모부입니다. 두 사람을 어떻게 하겠습니까?",
      lead: "임경수가 3년 동안 모아 둔 종이 장부 사이에서, 반재욱이 3년 전 플로우온 원본을 찾아냈습니다.",
    },
    c9_branch_father: {
      place: "일산 요양병원 3층 · 복도",
      clock: "채권단 결의까지 36h",
      question: "창업주는 아들을 못 알아보고 야간조 밥을 걱정합니다. 이 자리에서 무엇을 정하겠습니까?",
    },
    c9_branch_father_follow: {
      place: "일산 요양병원 · 주차장",
      clock: "채권단 결의까지 34h",
      question: "창업 첫해 서른 명이 찍힌 사진이 있습니다. 이 사진을 어떻게 쓰겠습니까?",
    },
    c9_wedding: {
      place: "여의도 브릿지은행 본점 · 1층 로비",
      clock: "채권단 결의까지 32h",
      question: "권도현의 결혼식 혼주석에 작은아버지 자리가 있습니다. 고발 시점을 어떻게 하겠습니까?",
    },
    c9_wedding_reaction: {
      place: "여의도 브릿지은행 본점 · 1층 로비",
      clock: "채권단 결의까지 31h",
      question: "권도현은 신부에게 이유를 말할 자신이 없다고 합니다. 어디에 서겠습니까?",
    },
    c9_timing: {
      place: "트리거랩 4층 분석관실",
      clock: "채권단 결의까지 26h",
      question: "검사 착수 전날 밤에 흔적표를 넣으면 청산 결의가 흔들립니다. 언제 넣겠습니까?",
      lead: "오진우가 빈 반찬통을 들고 4층으로 돌아왔습니다. 달력에는 내일 09:00에 동그라미가 쳐져 있습니다.",
    },
    c9_night: {
      place: "트리거랩 4층 분석관실",
      clock: "새벽 두 시 · 제보 마감까지 7h",
      question: "다섯 사람이 처음으로 같은 편에 앉은 밤입니다. 남은 일을 어떻게 끝내겠습니까?",
    },
    c9_night_reaction: {
      place: "트리거랩 4층 · 창가",
      clock: "새벽 세 시 · 제보 마감까지 6h",
      question: "반재욱이 '1,140 -- 남김'이라고 적은 수첩 한 장을 건넵니다. 이 한 장을 어떻게 하겠습니까?",
    },
    c9_route_system: {
      place: "플로우온 채권단 회의실 · 자료 단말",
      clock: "채권단 결의까지 12h",
      question: "청산 때 가족이 치르는 비용이 회수 차액의 2.3배입니다. 이 세 번째 표를 어떻게 하겠습니까?",
    },
    c9_final_system_route: {
      place: "플로우온 채권단 회의실 · 자료 단말",
      clock: "채권단 결의까지 6h",
      question: "아무도 쓰지 않은 계산서가 한 장 더 생겼습니다. 결의에 어떻게 올리겠습니까?",
    },
    c9_evidence_turn: {
      place: "플로우온 채권단 회의실 · 자료 검토석",
      clock: "채권단 결의까지 5h",
      question: "청산이 유리하다는 회수율을 흔적표의 같은 손이 만들었습니다. 이 출처를 어떻게 쓰겠습니까?",
    },
    c9_final: {
      place: "플로우온 채권단 회의실",
      clock: "채권단 결의까지 3h",
      question: "살리는 계산서와 벌하는 계산서가 나란히 있습니다. 어느 장에 서명하겠습니까?",
      lead: "권도현이 펜 두 자루를 꺼내 한 자루를 당신 앞에 놓습니다. 둘 다 아버지 회사 로고가 박힌 볼펜입니다.",
    },
    c9_aftershock: {
      place: "플로우온 풀필먼트센터 · 야간조 휴게실",
      clock: "결의 다음 날 · 새벽 4시",
      question: "강태민이 컵라면에 물을 부으며 이제 어디로 가느냐고 묻습니다. 어디로 가겠습니까?",
    },
  },
  clue: {
    id: "c9-bought-recovery",
    title: "사 둔 회수율",
    text: "청산이 유리하다는 숫자를 만든 감정평가법인이 흔적표와 같은 세무 대리인을 씁니다. 계산서도 누군가 주문할 수 있습니다.",
  },
  outcomes: {
    c9_after_stay: { tag: "현장을 지킨 결말", title: "야간조의 컵라면이 식기 전에 합의서가 끝났다", text: "고용 승계 합의서의 마지막 서명까지 곁에 있었습니다. 영동지점에는 복귀 지연 사유서가 쌓였고, 풀필먼트센터 휴게실에는 당신 몫의 컵라면이 하나 더 생겼습니다." },
    c9_after_court: { tag: "끝까지 설명한 결말", title: "그날의 계산을 법정과 검사반에서 끝까지 설명했다", text: "증언대에서 당신은 그날 테이블에 올린 계산을 한 줄씩 설명했습니다. 누구를 살리려 했고 누구에게 값을 물으려 했는지가 같은 사건 번호 아래 기록으로 남았습니다." },
    c9_after_return: { tag: "조용히 돌아간 결말", title: "고용 승계 소식을 영동지점 텔레비전으로 들었다", text: "당신이 없는 자리에서도 합의는 이어졌습니다. 강태민은 당신 몫으로 뜯어 둔 컵라면을 다음 날 아침에 혼자 먹었습니다." },
  },
  carryovers: {
    c9_after_stay: { trust: 10, humanCost: -4, fatigue: 7 },
    c9_after_court: { legitimacy: 10, trust: 3, fatigue: 7 },
    c9_after_return: { capital: 6, trust: -10, humanCost: 6 },
  },
  continuityChallenges: {
    c8_after_law: { id: "find-cost", title: "느린 법이 놓친 사람 찾기", text: "수사는 시작됐지만 결의는 기다려 주지 않습니다. 기록이 구하지 못한 사람을 먼저 찾으면 숨은 단서가 열릴 수 있습니다." },
    c8_after_friend: { id: "protect-trust", title: "되찾은 친구를 계산서에 쓰지 않기", text: "오진우와 권도현은 동기입니다. 그 관계를 협상 도구로만 쓰지 않는 선택을 찾아야 합니다." },
    c8_after_blade: { id: "use-reframe", title: "혼자 쥔 칼을 계산서로 바꾸기", text: "칼은 벌할 수는 있어도 살리지는 못합니다. 흔적표를 사람을 살리는 계산에 넣도록 판을 다시 짜야 합니다." },
  },
};
