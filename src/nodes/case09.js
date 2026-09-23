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
        next: "c9_ledger",
        cognition: { reframing: 2 },
      },
      {
        id: "c9_start_table",
        label: "채권단 공식 절차 안에서 회생안을 다시 올린다",
        effect: { legitimacy: 11, capital: -5, time: -9, fatigue: 4 },
        next: "c9_ledger",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "c9_start_floor",
        label: "물류센터 야간조부터 찾아가 현장 숫자를 모은다",
        effect: { trust: 7, humanCost: -6, capital: -4, time: -10, fatigue: 6 },
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
        next: "c9_family",
        cognition: { persistence: 2 },
      },
      {
        id: "c9_ledger_price",
        label: "그의 증언을 내가 받을 보상으로 적는다",
        effect: { legitimacy: 10, capital: 5, trust: -5, humanCost: 3, fatigue: 4 },
        next: "c9_family",
        cognition: { inference: 1, risk: 1 },
      },
      {
        id: "c9_ledger_blank",
        label: "칸은 비워 두고 1,140명 때문이라고만 말한다",
        effect: { humanCost: -7, legitimacy: 3, trust: -6, time: -5, fatigue: 5 },
        next: "c9_family",
        cognition: { reframing: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c9_family",
      },
    ],
  },
  c9_family: {
    phase: "THE FAMILY",
    title: "179.6",
    speaker: "반재욱",
    text:
      "반재욱이 3년 전 플로우온 장부 원본을 펼칩니다. 사건 01에서 누가 만들었는지 끝내 밝히지 못한 매출채권(아직 받지 못한 판매 대금) 179.6억. 만든 사람은 대표이사 권승우와 CFO(재무 책임자) 배성준, 권도현의 작은아버지와 고모부입니다. 장부를 부풀린 분식회계(실적을 꾸며 장부를 조작하는 일), 회삿돈으로 산 골프 회원권, 해온파트너스로 나간 자문료(조언을 해 준 값이라며 준 돈)까지. 배임(맡은 회사에 손해를 끼친 죄)과 횡령(회삿돈을 빼돌린 죄)이 한 장부에 같이 있습니다. 권도현이 한 장씩 넘기다 멈춥니다. '작은아버지가 제 대학 등록금을 내줬습니다. 그 돈이 어디서 나왔는지, 이제 알겠네요.'",
    memo: [
      "부풀린 매출채권 179.6억, 작성자 권승우·배성준",
      "회삿돈 골프 회원권 3구좌, 해온파트너스 자문료 지급",
      "배임·횡령·분식회계 고발 요건 충족",
      "고발하면 권도현은 가족 재판의 증인이 됨",
    ],
    triggers: ["responsibility", "injustice", "affection"],
    choices: [
      {
        id: "c9_family_charge",
        label: "두 사람을 배임·횡령·분식회계로 고발한다",
        effect: { legitimacy: 14, trust: -6, humanCost: 5, capital: -5, fatigue: 5 },
        next: "c9_timing",
        cognition: { inference: 2 },
      },
      {
        id: "c9_family_restore",
        label: "고발 대신 개인 재산을 내놓게 해 피해부터 메운다",
        effect: { capital: 11, humanCost: -6, trust: 3, legitimacy: -9, fatigue: 4 },
        next: "c9_timing",
        cognition: { reframing: 2 },
      },
      {
        id: "c9_family_choice",
        label: "고발 여부는 권도현이 정하게 하고 기다린다",
        effect: { trust: 12, legitimacy: 2, humanCost: 3, time: -10, fatigue: 6 },
        next: "c9_timing",
        cognition: { persistence: 1, reframing: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c9_timing",
      },
    ],
  },
  c9_timing: {
    phase: "THE TIMING",
    title: "검사 착수일",
    speaker: "오진우",
    text:
      "오진우가 돌아왔습니다. 수염은 깎지 않았지만 반찬통은 비워서 들고 왔습니다. 그가 달력 한 칸에 동그라미를 칩니다. '금융감독원(은행과 금융회사를 감시하는 나라 기관)이 브릿지은행을 정기검사(은행의 영업 전반을 들여다보는 정기 조사)하러 모레 아침 9시에 들어갑니다. 흔적표를 그 전날 밤에 넣으면, 검사반은 담보 순위(누가 먼저 돈을 받느냐의 순서)를 사들인 거래를 첫날부터 봅니다.' 브릿지은행이 제재(감독 기관이 내리는 벌)를 받으면 선순위 담보(가장 먼저 돈을 가져갈 권리)가 묶이고 청산 결의는 힘을 잃습니다. 다만 그 은행에는 권도현이 있습니다.",
    memo: [
      "금감원 브릿지은행 정기검사 착수: 모레 09:00",
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
        next: "c9_final",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c9_timing_warn",
        label: "넣기 전에 권도현에게 먼저 알린다",
        effect: { trust: 13, legitimacy: 3, capital: -7, time: -6, fatigue: 6 },
        next: "c9_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c9_timing_after",
        label: "청산 결의가 끝난 뒤로 제보를 미룬다",
        effect: { time: 8, capital: 4, humanCost: 8, legitimacy: -6, fatigue: -2 },
        next: "c9_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c9_final",
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
        next: "case09_result",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c9_final_rescue",
        label: "살리는 계산서만 올리고 고발은 결의 뒤로 미룬다",
        effect: { capital: 10, humanCost: -9, trust: 6, legitimacy: -7, fatigue: 5 },
        next: "case09_result",
        cognition: { risk: 1, reframing: 1 },
      },
      {
        id: "c9_final_punish",
        label: "벌하는 계산서만 올리고 회생은 법원에 맡긴다",
        effect: { legitimacy: 12, capital: 4, trust: -5, humanCost: 10, fatigue: 4 },
        next: "case09_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case09_result",
      },
    ],
  },
};
