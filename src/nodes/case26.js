/**
 * CASE 26 -- a building that stopped at its bones, and whose name goes in the box.
 *
 * Act 5 scatters the lab, and every place it lands shows a new link of the same
 * chain. The analyst's new desk is KD캐피탈's risk department, three days into
 * 윤상혁's tenure as its chief executive, and his first agenda item is a stalled
 * 22-storey officetel in 평택 financed before a single unit was built: 620억 of
 * KD캐피탈 money at the front of the queue, 브릿지은행 in the middle, and five
 * small lenders -- a 군산 credit union among them -- at the back. The loan falls
 * due in two weeks. 윤상혁 wants a one-year extension, so this year's books show
 * no loss, and he wants the risk department's opinion to carry the analyst's
 * name. Under the new rules the chief executive's own box reads "해당 없음".
 *
 * The case walks from that box to the people under it: a formwork foreman who
 * has been sitting in the cab of a tower crane for three weeks over 14억 of
 * unpaid wages for 87 workers, a pregnant buyer who chose the wallpaper for a
 * nursery in a flat that has no floor yet, and 권도현, back on the other side of
 * the table for 브릿지은행, whose spreadsheet concludes -- coldly, correctly --
 * that paying the workers first is the cheapest option on it. The laughter is a
 * rope-and-bucket supply line of cup noodles (강태민, who knows the foreman never
 * stops at one), the anger an elevator ride with 윤상혁, the grief a ninth floor
 * where the youngest worker fell last summer, the joy a foreman coming down the
 * ladder on the twenty-second day. Behind all of it sits a 32억 "advisory fee"
 * to 해온파트너스, paid the same day the reported progress jumped to 72%. The
 * aftermath hands 사건 27 its thread: the smallest lender at the back of the
 * table, 군산 새봄신협, and a lender table that leaves the building.
 */
export const case26Nodes = {
  c26_start: {
    phase: "CASE 26 BRIEFING",
    title: "작성자 칸",
    speaker: "윤상혁",
    text:
      "월요일 아침 8시, KD캐피탈 20층 대표실. 취임 사흘 만에 윤상혁의 책상에는 벌써 서류가 쌓여 있습니다. 그가 맨 위 파일을 밀어 줍니다. 평택 고덕의 22층 오피스텔 '르하임 고덕'의 부동산 PF(건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출)입니다. KD캐피탈이 맨 앞에서 빌려준 돈이 620억, 만기는 4월 24일. 공사는 1월에 멈췄고, 지난주부터 타워크레인 꼭대기에 사람이 하나 올라가 있습니다. '1년 연장으로 가지. 위험관리부 의견서는 자네가 쓰게. 위험을 아는 사람이 위험을 적어야지.' 12층으로 내려오자 부장 채이안이 귀에 꽂은 연필을 빼 책상 위에 눕혀 놓습니다. '작성자 칸에 벌써 이름이 인쇄돼 있죠? 이 층에선 그걸 배려라고 불러요.'",
    memo: [
      "르하임 고덕 PF -- KD캐피탈 620억, 만기 4월 24일",
      "공사 중단 석 달째 -- 타워크레인 농성 8일째",
      "대표 지시: 1년 만기 연장",
      "의견서 작성자 칸: 당신 이름 인쇄됨",
    ],
    triggers: ["injustice", "responsibility", "system"],
    choices: [
      {
        id: "c26_start_site",
        label: "의견서보다 먼저 크레인이 선 공사 현장으로 간다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -2, fatigue: 6 },
        next: "c26_crane",
        cognition: { persistence: 2 },
      },
      {
        id: "c26_start_terms",
        label: "대출 약정서와 공사 기록부터 한 장씩 대조한다",
        effect: { legitimacy: 11, time: -5, trust: -1, humanCost: 3, fatigue: 4 },
        next: "c26_crane",
        cognition: { inference: 2 },
      },
      {
        id: "c26_start_draft",
        label: "연장 의견서 초안부터 써 두고 시간을 번다",
        effect: { capital: 8, time: 5, legitimacy: -6, trust: -1, humanCost: 3, fatigue: 2 },
        next: "c26_crane",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c26_crane",
      },
    ],
  },
  c26_crane: {
    phase: "ON THE CRANE",
    title: "40미터 위의 반장",
    speaker: "지강현",
    text:
      "평택 고덕, 펜스에 '공사 일시 중지' 현수막이 걸린 공사 현장입니다. 15층까지 올라가다 멈춘 콘크리트 골조 옆, 타워크레인 운전석에 형틀 반장 지강현이 올라간 지 9일째입니다. 크레인 기둥에는 '석 달 치 임금 14억, 87명'이라고 쓴 천이 묶여 있습니다. 하도급(큰 건설사가 맡은 공사를 작은 업체에 다시 나눠 맡기는 것) 업체 여섯 곳이 시공사 세움건설에게서 대금을 못 받았고, 인부들은 그 업체들에게서 월급을 못 받았습니다. 휴대폰 스피커를 켜자 40미터 위에서 목소리가 내려옵니다. '돈 빌려준 회사에서 왔다고요? 잘 왔네. 이 건물 누구 거요? 우리가 쌓았는데, 우리 건 아니라대.' 펜스에는 시행사(땅을 사고 사업을 꾸려 건물을 지어 파는 회사)가 붙인 경고문이 있습니다. '무단 점거 시 민·형사상 조치.'",
    memo: [
      "농성 9일째 -- 타워크레인 운전석, 높이 40m",
      "하도급 업체 6곳 대금 미지급 -- 인부 87명, 14억",
      "시공사 세움건설: 책임준공 약정 뒤 자금난",
      "시행사 경고문: 무단 점거 시 민·형사상 조치",
    ],
    triggers: ["injustice", "protection", "helplessness"],
    choices: [
      {
        id: "c26_crane_listen",
        label: "크레인 아래에 남아 반장의 요구를 끝까지 받아 적는다",
        effect: { trust: 12, humanCost: -5, time: -5, legitimacy: -2, fatigue: 6 },
        next: "c26_creditors",
        cognition: { persistence: 2 },
      },
      {
        id: "c26_crane_ledger",
        label: "하도급 계약서로 임금이 어디서 끊겼는지부터 확인한다",
        effect: { legitimacy: 11, trust: 2, time: -5, humanCost: 2, fatigue: 5 },
        next: "c26_creditors",
        cognition: { inference: 2 },
      },
      {
        id: "c26_crane_down",
        label: "협상은 나중이라며 크레인에서 내려오라고 먼저 설득한다",
        effect: { capital: 6, time: 6, trust: -2, humanCost: 4, legitimacy: 2, fatigue: -2 },
        next: "c26_creditors",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c26_creditors",
      },
    ],
  },
  c26_creditors: {
    phase: "CREDITORS",
    title: "가운데 칸",
    speaker: "권도현",
    text:
      "금요일 오후, 여의도 브릿지은행 회의실에서 르하임 고덕의 채권단(돈을 빌려준 곳들의 모임) 회의가 열립니다. 맨 앞자리는 선순위(가장 먼저 돌려받는 순서) 620억의 KD캐피탈, 가운데가 180억의 브릿지은행, 맨 끝 후순위(가장 나중에 돌려받는 순서)에는 군산 새봄신협 60억을 비롯한 다섯 곳이 화상으로 붙어 있습니다. 브릿지은행 대표로 나온 권도현이 한 장짜리 표를 돌립니다. 왼쪽 칸은 1년 연장, 오른쪽 칸은 지금 손실 처리. 가운데에 칸 하나를 더 그어 놓았습니다. '임금 14억 먼저, 시공사 교체.' 그가 안경을 밀어 올립니다. '인부들이 유치권(공사 대금을 받을 때까지 건물을 넘기지 않고 붙잡아 둘 권리)을 걸면 이 건물은 아무도 못 팝니다. 참고로 크레인 임대료가 하루 83만 원입니다. 동정이 아니라 계산입니다.'",
    memo: [
      "채권자 7곳 -- KD캐피탈 620억 · 브릿지은행 180억 · 후순위 5곳",
      "권도현 안: 임금 14억 먼저, 시공사 교체",
      "유치권이 걸리면 매각 불가",
      "KD캐피탈 입장: 대표 지시대로 1년 연장",
    ],
    triggers: ["order", "competition", "responsibility"],
    choices: [
      {
        id: "c26_creditors_wages",
        label: "임금 먼저를 붙인 권도현의 가운데 칸에 표를 보탠다",
        effect: { trust: 12, humanCost: -6, capital: -7, time: -4, legitimacy: 2, fatigue: 5 },
        next: "c26_tower",
        cognition: { reframing: 2 },
      },
      {
        id: "c26_creditors_audit",
        label: "결정 전에 현장 실사부터 하자며 회의를 멈춘다",
        effect: { legitimacy: 12, time: -6, trust: -2, humanCost: 4, fatigue: 4 },
        next: "c26_tower",
        cognition: { inference: 2 },
      },
      {
        id: "c26_creditors_extend",
        label: "대표 뜻대로 1년 연장 쪽에 KD캐피탈 표를 던진다",
        effect: { capital: 9, time: 6, trust: -3, legitimacy: -5, humanCost: 4, fatigue: -1 },
        next: "c26_tower",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c26_tower",
      },
    ],
  },
  c26_tower: {
    phase: "NIGHT CLIMB",
    title: "운전석의 밤",
    speaker: "지강현",
    text:
      "밤 11시 반, 지강현이 처음으로 올라오라고 합니다. 안전줄을 걸고 크레인 기둥 사다리를 오릅니다. 150칸쯤에서 다리가 떨리고, 아래에서 강태민이 '쉬면 더 무서워요'라고 외칩니다. 두 평 남짓한 운전석에는 전기장판과 김 빠진 콜라, 손주 사진이 있습니다. 평택 불빛 너머로 멈춘 골조가 검게 서 있습니다. 지강현이 한 층을 가리킵니다. '9층. 작년 여름에 거기서 막내가 떨어졌어요. 살긴 살았는데 다시는 못 올라와요. 산업재해(일하다 다치거나 목숨을 잃는 사고)로 인정받는 데만 넉 달 걸렸고.' 그가 담배를 꺼냈다가 도로 넣습니다. '내가 내려가면 다들 저 층에 다시 올라가야 돼요. 돈 받고. 그러니까 당신이 말해 봐요. 내가 내려가면, 뭐가 달라져요?'",
    memo: [
      "크레인 높이 40m -- 사다리 약 200칸",
      "운전석: 전기장판, 손주 사진, 농성 19일째",
      "9층: 작년 여름 추락 사고, 산업재해 인정까지 넉 달",
      "지강현의 질문: 내려가면 뭐가 달라지나",
    ],
    triggers: ["protection", "selfAwareness", "fear"],
    choices: [
      {
        id: "c26_tower_promise",
        label: "내려오면 임금부터 받게 하겠다고 이름을 걸고 약속한다",
        effect: { trust: 13, humanCost: -5, legitimacy: -3, capital: -4, time: -3, fatigue: 6 },
        next: "c26_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c26_tower_explain",
        label: "약속 대신 결정이 어떤 순서로 나는지 그대로 설명한다",
        effect: { legitimacy: 10, trust: 4, time: -4, humanCost: 3, fatigue: 5 },
        next: "c26_final",
        cognition: { inference: 2 },
      },
      {
        id: "c26_tower_warn",
        label: "강제 해산이 오기 전에 오늘 밤 같이 내려가자고 한다",
        effect: { time: 5, capital: 5, trust: 2, humanCost: 5, legitimacy: -3, fatigue: -2 },
        next: "c26_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c26_final",
      },
    ],
  },
  c26_final: {
    phase: "FINAL DECISION",
    title: "서명할 칸",
    speaker: "채이안",
    text:
      "만기 하루 전 오후 3시, KD캐피탈 심사위원회. 위원 다섯 명 앞에 당신 이름이 인쇄된 의견서가 놓여 있습니다. 1년 연장으로 가면 손실은 올해 장부에 나타나지 않고, 이자는 공사비 대신 1년 동안 쌓입니다. 손실 처리로 가면 건물은 공매(공공기관이 맡아 공개 입찰로 파는 것)로 넘어가고, 선순위(가장 먼저 돌려받는 순서)인 KD캐피탈은 대부분 돌려받지만 후순위 다섯 곳과 분양 계약자 212세대는 맨 뒷줄에 섭니다. 권도현의 가운데 칸, 임금 먼저와 시공사 교체를 붙인 연장은 KD캐피탈이 새 돈 40억을 더 넣어야 합니다. 채이안이 옆자리에서 연필을 눕혀 놓습니다. '어느 쪽이든 서명은 당신 거예요. 대표이사 칸은 해당 없음이니까.' 휴대폰에 평택에서 온 사진이 뜹니다. 크레인 운전석의 불, 21일째입니다.",
    memo: [
      "만기 4월 24일 -- 위원회는 하루 전",
      "1년 연장: 올해 손실 0, 이자 1년 누적",
      "손실 처리: 공매, 후순위 5곳·계약자 212세대 맨 뒷줄",
      "조건부 연장: 새 돈 40억, 임금 14억 먼저",
    ],
    triggers: ["choice", "responsibility", "injustice"],
    choices: [
      {
        id: "c26_final_condition",
        label: "임금 먼저와 시공사 교체를 조건으로 연장 의견서에 서명한다",
        effect: { trust: 12, humanCost: -6, capital: -9, legitimacy: 4, time: -5, fatigue: 6 },
        next: "case26_result",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c26_final_dissent",
        label: "연장에 반대 의견을 쓰고 손실 처리를 의견서에 남긴다",
        effect: { legitimacy: 13, trust: 3, humanCost: 5, capital: -4, time: -6, fatigue: 5 },
        next: "case26_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c26_final_sign",
        label: "대표 뜻대로 1년 연장에 서명하고 다음 싸움을 위해 자리를 지킨다",
        effect: { capital: 11, time: 6, trust: -4, legitimacy: -8, humanCost: 4, fatigue: -3 },
        next: "case26_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case26_result",
      },
    ],
  },
};

/**
 * Everything else case 26 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case26 = {
  id: "case26",
  nodes: case26Nodes,
  aftermath: {
    c26_aftershock: {
      phase: "AFTERMATH",
      title: "내려온 반장",
      speaker: "강태민",
      text: "위원회 다음 날 오후, 인부 87명의 통장에 첫 임금이 들어옵니다. 석 달 치 가운데 한 달 치입니다. 결론이 어느 쪽으로 났든, 권도현이 채권단 회의록에 박아 넣은 '임금 먼저' 한 줄은 살아남았습니다. 해 질 녘, 지강현이 22일 만에 사다리를 내려옵니다. 마지막 칸에서 다리가 풀리자 강태민이 받아 안고, 뚜껑을 뜯은 컵라면 하나를 쥐여 줍니다. 인부들이 박수를 치고, 권도현은 '크레인 임대료, 오늘부로 멈춥니다'라며 계산기를 끕니다. 그 박수 속에서 채이안의 문자가 옵니다. 채권자 일곱 곳의 표 사진, 맨 끝 줄 군산 새봄신협 60억에 연필로 동그라미가 쳐져 있습니다. '이런 판에서 제일 먼저 무너지는 건 늘 맨 끝 줄이에요.'",
      memo: ["첫 임금 입금 -- 87명, 석 달 치 중 한 달 치", "지강현 농성 22일 만에 하강", "후순위 맨 끝 줄: 군산 새봄신협 60억", "채이안: '제일 먼저 무너지는 건 맨 끝 줄'"],
      triggers: ["affection", "trust", "fear"],
      choices: [
        { id: "c26_after_warm", label: "내려온 반장과 인부들 곁에 남아 현장의 밤을 끝까지 보낸다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -7 }, next: "case26_result", cognition: { reframing: 2 } },
        { id: "c26_after_record", label: "돈을 댄 일곱 곳과 금액을 표로 묶어 이번 결정을 문서로 남긴다", effect: { legitimacy: 13, trust: 4, time: -5, capital: -2, fatigue: 5 }, next: "case26_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c26_after_rush", label: "현장을 뒤로하고 곧장 본사로 돌아가 다음 안건을 연다", effect: { capital: 7, legitimacy: 5, trust: -6, humanCost: 5, fatigue: 4 }, next: "case26_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c26_final", "c26_aftershock"],
  connectiveScenes: [
    ["c26_ramen", "c26_crane", "c26_creditors", "국물 더", "강태민", "밤 아홉 시, 현장 사무소 컨테이너에 강태민이 컵라면 두 상자를 들고 나타납니다. 농성하는 인부들 가운데 셋은 로봇이 들어온 뒤 물류센터 야간조를 나와 공사장으로 온 옛 동료입니다. 그는 인사 대신 전기 포트에 물을 올립니다. 크레인 기둥에 매달린 밧줄 끝 양동이에 컵라면을 넣어 올려 보내자, 10분 뒤 양동이가 내려옵니다. 빈 용기 안에 매직으로 쓴 쪽지가 있습니다. '국물 더.' 강태민이 두 번째 컵라면을 올려 보내며 말합니다. '저 형님, 한 개로 끝난 적 없어요.' 옆에서 웃던 인부 하나가 휴대폰 속 딸 사진을 오래 봅니다. 대학 등록금 마감이 금요일입니다.", ["인부 87명 중 옛 야간조 동료 3명", "양동이 왕복 10분 -- 두 번째 컵라면 요청", "인부 자녀 등록금 마감: 금요일"], ["급한 사람부터 임금 일부를 먼저 받을 길을 찾는다", "인부 87명의 밀린 임금 명세를 한 사람씩 정리한다", "오늘은 컵라면만 나누고 결정은 채권자들에게 맡긴다"]],
    ["c26_nursery", "c26_creditors", "c26_tower", "아기 방", "송하율", "토요일, 문 닫은 르하임 고덕 모델하우스 앞 주차장에 분양 계약자 마흔 명이 모였습니다. 대표 송하율은 서른두 살이고, 10월이 출산 예정일입니다. 그가 유리문에 붙은 평면도에서 작은 방 하나를 손가락으로 짚습니다. '여기요. 아기 방으로 하려고 벽지 색까지 골랐어요.' 계약자들은 모두 중도금 대출(분양 대금의 중간분을 내려고 계약자가 따로 받은 대출)을 받았고, 이자는 공사가 멈춘 뒤에도 매달 나갑니다. 송하율의 전세 계약은 원래 입주 예정일이던 12월에 끝납니다. '은행 분들은 연장이다, 손실이다 하시잖아요. 저희는 12월에 어디서 자요?'", ["분양 계약자 212세대 -- 오늘 모인 40명", "중도금 대출 이자: 공사 중단 뒤에도 매달", "송하율: 출산 예정 10월, 전세 만기 12월"], ["계약자들이 12월에 머물 곳부터 시행사에 책임지게 한다", "계약자 212세대의 피해를 결정 자료에 정식으로 넣는다", "공사가 다시 돌면 해결된다며 오늘은 설명만 하고 간다"]],
    ["c26_elevator", "c26_tower", "c26_final", "옳았던 사람", "윤상혁", "위원회 전날 아침 7시 50분, 12층에서 엘리베이터를 타자 윤상혁이 먼저 타 있습니다. 대표실 밖에서 마주치는 건 처음입니다. 장식 없는 감색 정장, 서명란이 빈 서류철. 그가 버튼을 누르지 않고 문이 닫히기를 기다립니다. '평택에 자주 간다더군. 크레인에도 올라갔다지.' 층수 표시가 18에서 19로 바뀝니다. '위험관리부는 위험을 적는 곳이지 없애는 곳이 아닐세. 자네 이름은 작성자 칸에만 들어가. 결정은 위원회가 하지.' 20층에서 문이 열립니다. 그가 내리며 덧붙입니다. '3년 전에도 자네는 옳았어. 그래서 지하로 갔지.'", ["윤상혁과 대표실 밖 첫 대면 -- 엘리베이터 50초", "'자네 이름은 작성자 칸에만'", "심사위원회: 만기 하루 전 15시"], ["지강현과의 약속을 윤상혁에게 그대로 말한다", "오늘 대화를 날짜와 시각까지 적어 기록으로 남긴다", "대답하지 않고 의견서 쓸 시간을 번다"]],
  ],
  connectiveOrder: [["c26_crane", "c26_ramen"], ["c26_creditors", "c26_nursery"], ["c26_tower", "c26_elevator"]],
  choiceEffects: {
    c26_crane: [
      { trust: 11, humanCost: -5, capital: -5, time: -4, fatigue: 4 },
      { legitimacy: 8, trust: 3, humanCost: 3, time: -5, fatigue: 4 },
      { time: 5, capital: 4, trust: 2, humanCost: 4, fatigue: -4 },
    ],
    c26_creditors: [
      { trust: 10, humanCost: -5, capital: -5, time: -3, legitimacy: 2, fatigue: 4 },
      { legitimacy: 9, trust: 4, humanCost: 2, time: -4, fatigue: 3 },
      { time: 5, capital: 4, trust: -1, humanCost: 4, legitimacy: 1, fatigue: -3 },
    ],
    c26_tower: [
      { trust: 9, humanCost: -4, legitimacy: -2, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 2, time: -4, humanCost: 4, fatigue: 2 },
      { time: 5, capital: 4, trust: 1, humanCost: 2, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c26_crane: {
      voice: ["급한 사람부터, 임금 일부를 먼저 받을 길을 찾자고 한다.", "인부 87명의 밀린 임금 명세를, 한 사람씩 정리한다.", "오늘은 컵라면만 나누고, 결정은 채권자들에게 맡긴다."],
      echo: ["길을 찾으면 등록금 마감 전에 한 사람 몫은 나옵니다. 나머지 여든여섯 명은 그 순서를 지켜봅니다.", "명세가 정리되면 87명이 이름을 갖습니다. 한 사람씩 적는 데 밤이 다 갑니다.", "컵라면은 따뜻합니다. 양동이는 밤새 세 번 더 오르내리고, 결정은 아무도 하지 않습니다."],
    },
    c26_creditors: {
      voice: ["계약자들이 12월에 머물 곳부터, 시행사에 책임지게 한다.", "계약자 212세대의 피해를, 결정 자료에 정식으로 넣는다.", "공사가 다시 돌면 해결된다며, 오늘은 설명만 하고 간다."],
      echo: ["책임을 물으면 시행사는 '검토하겠습니다'라는 문자 한 줄을 보냅니다. 송하율은 그 문자를 캡처해 모임 방에 올립니다.", "자료에 들어가면 212세대는 숫자가 아니라 표 한 장이 됩니다. 위원회가 그 표를 몇 초 볼지는 모릅니다.", "설명은 친절합니다. 송하율은 고개를 끄덕이고, 부동산 앱에서 12월 전세 매물을 다시 검색합니다."],
    },
    c26_tower: {
      voice: ["지강현과의 약속을, 윤상혁에게 그대로 말한다.", "오늘 대화를 날짜와 시각까지 적어, 기록으로 남긴다.", "대답하지 않고, 의견서 쓸 시간을 번다."],
      echo: ["약속을 말하면 윤상혁이 처음으로 당신을 똑바로 봅니다. '약속은 서명이 아니네.' 문이 닫힙니다.", "기록은 50초 분량입니다. 반재욱이 그 메모를 받고 '3년 전 그 말이랑 어미까지 같네요'라고 답합니다.", "침묵은 시간을 법니다. 윤상혁은 그 침묵을 동의로 적어 두는 사람입니다."],
    },
  },
  reactionScenes: [
    ["c26_ramen_reaction", "c26_ramen", "c26_creditors", "30년 형틀", "지강현", "자정 무렵 지강현이 전화를 겁니다. 수화기 너머는 바람 소리뿐입니다. '내가 형틀만 30년이요. 콘크리트 붓기 전에 나무로 틀 짜는 일. 건물 다 올라가면 틀은 뜯어서 버려요. 준공식 사진에 우리 얼굴 나오는 거 봤어요?' 그가 잠깐 웃습니다. '밑에서 태민이가 라면 올려 보내니까 좋긴 하네. 근데 내가 내려가면 저 현수막 누가 봐요. 이 건물 다 지어지면, 석 달 치 월급 떼인 사람들이 쌓았다는 거 아무도 몰라요.'", ["내려와도 이름이 남게 인부 명단을 건물 기록에 넣자고 한다", "농성의 이유를 채권자 회의 안건으로 공식 올린다", "현수막은 우리가 지키겠다며 내려오라고만 한다"]],
    ["c26_nursery_reaction", "c26_nursery", "c26_tower", "해당 없음", "채이안", "월요일 아침, 채이안이 위원회에 올라갈 승인 문서 양식을 출력해 옵니다. 작성자 칸에는 당신 이름, 검토자 칸에는 채이안의 이름이 인쇄돼 있습니다. 맨 아래 대표이사 칸에는 '해당 없음' 네 글자가 미리 찍혀 있습니다. 채이안이 연필을 귀에서 빼 양식 위에 눕힙니다. '1,000억 아래는 대표이사가 서명하지 않는 게 규정이래요. 지난달에 바뀐 규정이에요.' 지난달은 윤상혁의 대표이사 선임이 정해진 달입니다. '대표를 세 명 모셨는데, 칸이 없어진 건 처음이에요. 웃기죠. 웃다 보면 제 이름만 남아요.'", ["채이안의 이름도 지키게 검토 의견을 따로 쓰자고 한다", "규정이 바뀐 날짜와 승인 기록을 공식으로 요청한다", "칸은 칸일 뿐이라며 양식대로 의견서를 채운다"]],
    ["c26_elevator_reaction", "c26_elevator", "c26_final", "벽을 보는 책상", "한서윤", "밤 아홉 시, 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 중인 한서윤이 전화를 받습니다. 그는 2주째 본사 7층 복도 끝 방으로 출근합니다. 벽을 보고 놓인 책상, 컴퓨터 없이 A4 한 묶음과 볼펜 한 자루. '엘리베이터에서 그랬다고요? 옳아서 지하로 갔다고.' 그가 웃다가 멈춥니다. '3년 전 당신 반대 의견에 반려 도장을 찍은 게 저예요. 그 칸도 작성자 칸이었어요. 결정한 사람은 칸이 없었고요.' 종이 넘기는 소리가 납니다. '할 일이 없어서 요즘 규정집을 처음부터 읽어요. 대표이사가 서명 안 해도 되는 그 규정, 부칙이 이상해요. 내일 보내 줄게요.'", ["대기실에 혼자 두지 않겠다며 내일 점심을 같이 먹자고 한다", "한서윤이 찾은 부칙을 위원회 자료에 공식으로 붙인다", "오늘은 부칙만 받고 통화를 짧게 끝낸다"]],
  ],
  reactionEffects: {
    c26_ramen: [
      { trust: 10, humanCost: -4, time: -4, legitimacy: 2, fatigue: 4 },
      { legitimacy: 9, trust: 3, capital: -2, time: -3, fatigue: 4 },
      { time: 4, capital: 3, trust: 1, humanCost: 3, fatigue: -3 },
    ],
    c26_nursery: [
      { trust: 10, humanCost: -4, legitimacy: 3, capital: -3, time: -3, fatigue: 5 },
      { legitimacy: 10, trust: 2, time: -4, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 5, trust: -2, legitimacy: -2, fatigue: -3 },
    ],
    c26_elevator: [
      { trust: 10, humanCost: -5, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 10, trust: 3, capital: -4, time: -4, fatigue: 4 },
      { time: 4, capital: 3, trust: -2, humanCost: 3, legitimacy: 2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c26_ramen: {
      voice: ["내려와도 이름이 남게, 인부 명단을 건물 기록에 넣자고 한다.", "농성의 이유를, 채권자 회의 안건으로 공식 올린다.", "현수막은 우리가 지키겠다며, 내려오라고만 한다."],
      echo: ["명단을 넣자고 하면 지강현이 한참 조용합니다. '머릿돌에 새겨 줄 거면 내가 글씨는 잘 써요.'", "안건이 되면 농성은 회의록에 한 줄로 남습니다. 회의는 이번 주 금요일입니다.", "내려오라는 말에 지강현이 전화를 끊지 않고 오래 듣기만 합니다. 크레인 불은 꺼지지 않습니다."],
    },
    c26_nursery: {
      voice: ["채이안의 이름도 지키게, 검토 의견을 따로 쓰자고 한다.", "규정이 바뀐 날짜와 승인 기록을, 공식으로 요청한다.", "칸은 칸일 뿐이라며, 양식대로 의견서를 채운다."],
      echo: ["따로 쓰자고 하면 채이안이 연필을 한참 굴립니다. '17년 동안 검토 의견을 따로 써 본 적이 없네요. 쓰는 법은 알아요.'", "요청하면 규정 개정 문서가 나옵니다. 개정을 올린 부서 칸에 대표이사 비서실이 적혀 있습니다.", "양식대로 채우면 서류는 깔끔해집니다. '해당 없음' 네 글자도 그대로 위원회에 올라갑니다."],
    },
    c26_elevator: {
      voice: ["대기실에 혼자 두지 않겠다며, 내일 점심을 같이 먹자고 한다.", "한서윤이 찾은 부칙을, 위원회 자료에 공식으로 붙인다.", "오늘은 부칙만 받고, 통화를 짧게 끝낸다."],
      echo: ["점심을 약속하면 한서윤이 '도시락 두 개 쌀게요'라고 합니다. 할 일 없는 사람이 싸는 도시락은 반찬이 일곱 가지입니다.", "부칙이 붙으면 규정의 적용일이 이 대출 만기 두 주 전이었다는 게 드러납니다. 위원들이 그 줄에서 서류를 넘기지 않습니다.", "통화는 3분 만에 끝납니다. 한서윤은 벽을 보는 책상에서 규정집을 다시 폅니다."],
    },
  },
  reactionMemos: {
    c26_ramen_reaction: ["형틀은 준공식 사진에 나오지 않는다", "내려가면 현수막을 볼 사람이 없다"],
    c26_nursery_reaction: ["대표이사 승인 칸: '해당 없음' 미리 인쇄", "규정 개정: 윤상혁 선임이 정해진 달"],
    c26_elevator_reaction: ["한서윤: 대기발령 2주째, 벽을 보는 책상", "대표이사 서명 면제 규정의 부칙"],
  },
  branchPlan: ["c26_crane", 1, "c26_branch_frame", "c26_branch_frame_follow"],
  branchScenes: {
    // CASE 26's detour is inside the concrete. The crane argues over wages; the
    // side door is the unfinished floors themselves, where the progress figure
    // the lenders paid against can be checked with a pair of eyes.
    c26_branch_frame: {
      phase: "SIDE DOOR",
      title: "하늘이 보이는 층",
      speaker: "지강현",
      text: "하도급 계약서를 넘기다 날짜 하나가 걸립니다. 시공사가 돈을 빌려준 곳들에 낸 1월 말 보고서에는 공정률(공사가 얼마나 진행됐는지 나타낸 비율)이 72%로 적혀 있습니다. 지강현이 크레인 위에서 전화로 길을 알려 줍니다. '14층으로 올라가 봐요. 계단 난간 없으니까 벽 쪽으로.' 안전모를 쓰고 골조 계단을 오릅니다. 12층부터는 기둥만 서 있고 바닥이 비어 있습니다. 벽에 분필 글씨가 남아 있습니다. '1/9 거푸집 철수 -- 돈 안 나옴.' 전화기 너머에서 지강현이 말합니다. '72%? 거기 서 보면 알잖아요. 하늘 보이는 층까지 다 지었다고 적었나 보네.'",
      memo: ["보고된 공정률 72% -- 현장 추정 58%", "12층 이상 바닥 미시공", "벽 분필 기록: '1/9 거푸집 철수 -- 돈 안 나옴'", "공정률에 맞춰 대출금이 단계별로 나감"],
      triggers: ["curiosity", "injustice", "order"],
      choices: [
        { id: "c26_branch_frame_a", label: "분필 글씨와 빈 층을 찍어 인부들과 함께 증언을 모은다", effect: { trust: 12, legitimacy: 4, capital: -5, time: -6, fatigue: 5 }, next: "c26_branch_frame_follow", cognition: { reframing: 2 } },
        { id: "c26_branch_frame_b", label: "보고된 공정률과 실제 공정을 층마다 대조해 기록한다", effect: { legitimacy: 12, trust: 2, time: -6, humanCost: 4, fatigue: 3 }, next: "c26_branch_frame_follow", cognition: { inference: 2 } },
        { id: "c26_branch_frame_c", label: "숫자 차이는 위원회에서 쓰자며 오늘은 내려간다", effect: { capital: 7, time: 5, trust: -4, humanCost: 3, fatigue: -3 }, next: "c26_branch_frame_follow", cognition: { risk: 1 } },
      ],
    },
    c26_branch_frame_follow: {
      phase: "SIDE DOOR",
      title: "도장만 있는 칸",
      speaker: "권도현",
      text: "현장 사무소 컨테이너 문을 여니 먼저 온 사람이 있습니다. 브릿지은행 권도현이 레이저 줄자를 창밖 골조에 겨누고 있습니다. 브릿지은행도 이 공사에 180억을 빌려준 곳입니다. 그가 캐비닛에서 찾은 공정 보고서 사본을 내밉니다. 72%라는 숫자 옆 확인란에 KD캐피탈 부동산금융팀 도장이 찍혀 있고, 확인자 이름 칸은 비어 있습니다. 권도현이 계산기를 두드립니다. '14% 부풀린 공정률로 더 나간 돈이 87억입니다. 인부들 석 달 치 임금의 여섯 배예요.' 그가 빈 종이에 세로줄을 긋습니다. '이 칸은 누가 채웁니까.'",
      memo: ["브릿지은행 180억 -- 권도현 현장 확인", "공정 보고서 72% 확인란: KD캐피탈 도장, 이름 없음", "부풀린 공정률로 더 나간 대출금 87억", "인부 임금 14억의 여섯 배"],
      triggers: ["order", "injustice", "trust"],
      choices: [
        { id: "c26_branch_frame_follow_a", label: "빈 확인자 칸을 인부들에게 먼저 보여 주고 같이 따진다", effect: { trust: 12, humanCost: -4, legitimacy: 3, capital: -6, time: -5, fatigue: 6 }, next: "c26_ramen", cognition: { reframing: 2 } },
        { id: "c26_branch_frame_follow_b", label: "도장이 찍힌 경위를 부동산금융팀에 공식 질의한다", effect: { legitimacy: 12, trust: 3, time: -5, humanCost: 2, fatigue: 5 }, next: "c26_ramen", cognition: { inference: 2 } },
        { id: "c26_branch_frame_follow_c", label: "사본을 권도현에게 넘기고 브릿지은행이 먼저 싸우게 한다", effect: { capital: 7, time: 5, trust: -3, humanCost: 3, legitimacy: 2, fatigue: -3 }, next: "c26_ramen", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c26_start",
    result: "c26_aftershock",
    defaultFree: "c26_route_system",
    // One building, one due date. Like the cases before it the case is a single
    // line; the split is whose name ends up in the box the chief left empty.
    choices: {},
    system: {
      route: "c26_route_system",
      final: "c26_final_system_route",
      title: "날짜를 옮기는 결정",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 그룹의 심사 엔진(대출을 자동으로 판단하는 AI) 노아가 지난 7년 동안 KD캐피탈이 만기를 연장한 부동산 대출 41건을 엽니다. 연장 뒤 제값을 돌려받은 건은 9건이고, 나머지 32건은 1~2년 뒤 더 큰 손실로 끝났습니다. 연장한 해마다 담당 임원의 성과 평가는 '손실 없음'이었습니다. 노아가 한 줄을 덧붙입니다. '연장은 손실을 없애는 결정이 아니라 손실의 날짜를 옮기는 결정으로 학습되어 있습니다. 옮겨진 날짜에 그 자리에 앉아 있는 사람은 대개 다른 사람입니다.'",
      memo: ["KD캐피탈 만기 연장 부동산 대출 41건", "제값 회수 9건 -- 더 큰 손실 32건", "연장한 해 담당 임원 평가: 전부 '손실 없음'"],
      routeChoices: [
        ["c26_route_system_publish", "통계를 위원회 자료와 채권자 회의에 함께 공개한다", { legitimacy: 11, trust: 5, capital: -5, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c26_route_system_names", "32건이 무너진 날 그 자리에 있던 사람들을 찾아본다", { trust: 9, legitimacy: 5, humanCost: -3, capital: -4, time: -8, fatigue: 6 }, { reframing: 2 }],
        ["c26_route_system_drop", "통계는 덮고 의견서는 연장 쪽으로 쓴다", { time: 7, capital: 6, trust: -6, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "만기를 연장할 때마다 대표이사 서명을 반드시 받게 하는 규칙을 제안한다", { legitimacy: 13, trust: 6, capital: -8, humanCost: -4, fatigue: 6 }, { reframing: 3 }],
      ["b", "연장은 하되 이자보다 인부 임금이 먼저 나가게 조건만 바꾼다", { trust: 9, humanCost: -6, time: 5, capital: -3, legitimacy: -4, fatigue: 4 }, { risk: 2 }],
      ["c", "후순위 신협 조합원들에게 손실 위험을 먼저 알린다", { legitimacy: 8, trust: 8, capital: -6, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c26_evidence_turn",
    result: "c26_aftershock",
    sourceRoutes: ["c26_crane", "c26_creditors", "c26_tower", "c26_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 르하임 고덕의 사업비 명세서 옆에 놓고, 빌려준 돈이 어디로 나갔는지 맞춰 본다.",
    entryEcho: "단서를 대면 공사비가 아닌 칸 하나가 보입니다. 그 칸에 적힌 이름은 이 시즌 내내 본 이름입니다.",
    title: "사업비 명세서의 한 줄",
    speaker: "반재욱",
    text: "감사팀 지방 순회 중에 평택 일정을 하루 끼워 넣은 반재욱이 새벽 6시에 KD캐피탈 자료실로 옵니다. 단서를 맞추자 르하임 고덕의 사업비 명세서가 열립니다. 토지비, 공사비, 설계비 사이에 '사업 자문료(조언값이라며 내보낸 돈) 32억'이 있습니다. 받은 곳은 해온파트너스. 2023-0412 대출 때 분기마다 자문료를 받아 가던 바로 그 회사입니다. 지급일은 공사가 멈추기 두 달 전이고, 같은 날 공정률(공사가 얼마나 진행됐는지 나타낸 비율) 보고가 72%로 올라갔습니다. 반재욱이 수첩을 폅니다. '인부 임금 14억은 못 줬는데, 조언값 32억은 줬습니다. 3년 전과 같은 회사로요.'",
    memo: ["사업비 명세서: 사업 자문료 32억 -- 해온파트너스", "지급일: 공사 중단 두 달 전", "같은 날 공정률 보고 72%로 상향"],
    triggers: ["injustice", "system", "curiosity"],
    entryEffect: { legitimacy: 4, trust: 2, time: -5, fatigue: 5 },
    choices: [
      ["c26_evidence_turn_reclaim", "자문료 32억을 되찾아 임금부터 주자고 위원회에 올린다", { legitimacy: 12, trust: 7, capital: -6, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c26_evidence_turn_hold", "명세서는 쥐고 있다가 해온파트너스를 쫓을 때 쓴다", { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c26_evidence_turn_share", "인부들과 계약자들에게 32억이 어디로 갔는지 먼저 알린다", { trust: 12, legitimacy: 6, capital: -5, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c26_branch_frame",
    systemNext: "c26_route_system",
    evidenceNext: "c26_evidence_turn",
    routeLabel: "직전 사건의 여섯 명 단체방에 평택 현장 사진부터 올린다",
    systemLabel: "직전 자유응답 문장이 KD캐피탈 의견서 양식에도 들어갔는지 본다",
    evidenceLabel: "직전 단서를 붙여 르하임 고덕의 사업비 명세서를 연다",
  },
  openingRoutes: {
    c25_after_warm: "c26_start_warm",
    c25_after_record: "c26_start_record",
    c25_after_rush: "c26_start_rush",
  },
  openingCopy: {
    c26_start_warm: ["끝까지 걸은 사람의 첫 안건", "도윤하", "벚꽃길 끝까지 여섯이 함께 걸은 그 밤, 채이안의 메일은 읽지 않은 채 주말을 넘겼습니다. 월요일 아침, 20층으로 올라가는 엘리베이터 안에서야 메일을 엽니다. 첨부 사진 속 타워크레인 기둥에 천이 묶여 있습니다. '석 달 치 임금 14억, 87명.' 8시 정각, 윤상혁이 파일을 내밉니다. 평택 오피스텔 부동산 PF(건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출) 620억, 만기 4월 24일. '1년 연장으로 가지. 의견서는 자네가 쓰게.' 단체방에 사진을 올리자 도윤하가 제일 먼저 답합니다. '우리 벚꽃 보는 동안, 저분은 주말 내내 저 위에 있었던 거네요.'", ["르하임 고덕 PF 620억 -- 만기 4월 24일", "채이안의 메일: 주말 동안 읽지 않음", "크레인 농성 8일째 -- 도윤하가 기사 링크 공유"]],
    c26_start_record: ["지도를 그린 사람의 첫 안건", "이민서", "흩어진 여섯 자리에서 첫 주에 본 것을 한 문서로 묶자, 지도 한가운데에 평택이 있었습니다. 도윤하의 강서지점 창구에는 평택 오피스텔 계약자 둘이 대출 이자 상담을 왔고, 오진우의 브릿지은행도 같은 현장에 돈을 댔고, 이민서의 KD데이터랩에서는 그 현장 인부들의 신용 점수가 한꺼번에 떨어졌습니다. 월요일 8시, 20층에서 윤상혁이 바로 그 파일을 내밉니다. 부동산 PF(건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출) 620억, 만기 4월 24일. '1년 연장. 의견서는 자네 이름으로.' 이민서가 메시지를 보냅니다. '지도 한가운데가 당신 책상이 됐네요.'", ["여섯 자리 지도의 한가운데: 평택", "르하임 고덕 PF 620억 -- 만기 4월 24일", "현장 인부 신용 점수 동시 하락 -- KD데이터랩"]],
    c26_start_rush: ["먼저 달려간 사람의 첫 안건", "반재욱", "메일을 연 금요일 밤 곧장 차를 몰아, 새벽 두 시에 평택 현장에 닿았습니다. 타워크레인 운전석의 불빛이 전조등을 먼저 봤고, 40미터 위에서 손전등이 세 번 깜빡였습니다. 당신은 날이 밝을 때까지 펜스 밖 차 안에 있었습니다. 월요일 8시, 20층의 윤상혁이 파일을 내밉니다. 평택 오피스텔 부동산 PF(건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출) 620억, 만기 4월 24일. '주말에 현장에 갔다지. 부지런하군. 의견서는 1년 연장으로 쓰게.' 군산에 있는 반재욱이 전화로 묻습니다. '그 새벽에 거기 누가 있었습니까. 대표가 그걸 어떻게 알아요?'", ["토요일 02시 평택 현장 도착 -- 크레인 손전등 신호 3번", "르하임 고덕 PF 620억 -- 만기 4월 24일", "윤상혁: '주말에 현장에 갔다지'"]],
  },
  openingSignatures: {
    c26_start_warm: {
      label: "단체방 여섯 명과 현장에 갈 사람과 서류를 볼 사람을 나눈다",
      effect: { trust: 10, legitimacy: 3, humanCost: -4, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "단체방 여섯 명과, 현장에 갈 사람과 서류를 볼 사람을 나눈다.",
      echo: "나누면 도윤하가 현장을, 이민서가 서류를 맡겠다고 합니다. 오진우는 둘 다 하겠다고 하다가 권도현에게 '그럼 둘 다 반만 합니다'라는 소리를 듣습니다.",
    },
    c26_start_record: {
      label: "여섯 자리 지도를 의견서 첨부로 붙여 공식 기록으로 남긴다",
      effect: { legitimacy: 12, trust: -1, capital: -4, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "여섯 자리 지도를, 의견서 첨부로 붙여 공식 기록으로 남긴다.",
      echo: "첨부하면 의견서가 열두 쪽이 됩니다. 채이안이 '이 부서에서 첨부가 본문보다 긴 건 처음 봐요'라며 연필을 귀에 도로 꽂습니다.",
    },
    c26_start_rush: {
      label: "새벽에 현장에서 본 것과 대표의 말을 동료들에게 먼저 알린다",
      effect: { trust: 11, legitimacy: 5, humanCost: 3, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "새벽에 현장에서 본 것과 대표의 말을, 동료들에게 먼저 알린다.",
      echo: "알리면 반재욱이 현장 경비 업체 이름부터 묻습니다. 경비 업체는 KD캐피탈이 관리하는 협력사 명단에 있습니다.",
    },
  },
  voiceLines: {
    // CASE 26. A building that stopped at its bones. Every line is said to
    // someone standing under forty metres of steel, so none may sound like a memo.
    c26_start_site: "의견서는 나중이라며, 크레인이 선 공사 현장부터 간다.",
    c26_start_terms: "대출 약정서와 공사 기록부터, 한 장씩 대조한다.",
    c26_start_draft: "연장 의견서 초안부터 써 두고, 시간을 번다.",
    c26_crane_listen: "크레인 아래에 남아, 반장의 요구를 끝까지 받아 적는다.",
    c26_crane_ledger: "하도급 계약서로, 임금이 어디서 끊겼는지부터 확인한다.",
    c26_crane_down: "협상은 나중이라며, 크레인에서 내려오라고 먼저 설득한다.",
    c26_branch_frame_a: "분필 글씨와 빈 층을 찍어, 인부들과 함께 증언을 모은다.",
    c26_branch_frame_b: "보고된 공정률과 실제 공정을, 층마다 대조해 기록한다.",
    c26_branch_frame_c: "숫자 차이는 위원회에서 쓰자며, 오늘은 내려간다.",
    c26_branch_frame_follow_a: "빈 확인자 칸을 인부들에게 먼저 보여 주고, 같이 따진다.",
    c26_branch_frame_follow_b: "도장이 찍힌 경위를, 부동산금융팀에 공식 질의한다.",
    c26_branch_frame_follow_c: "사본을 권도현에게 넘기고, 브릿지은행이 먼저 싸우게 한다.",
    c26_creditors_wages: "임금 먼저를 붙인 권도현의 가운데 칸에, 우리 표를 보탠다.",
    c26_creditors_audit: "결정 전에 현장 실사부터 하자며, 회의를 멈춘다.",
    c26_creditors_extend: "대표 뜻대로, 1년 연장 쪽에 KD캐피탈 표를 던진다.",
    c26_tower_promise: "내려오면 임금부터 받게 하겠다고, 이름을 걸고 약속한다.",
    c26_tower_explain: "약속 대신, 결정이 어떤 순서로 나는지 그대로 설명한다.",
    c26_tower_warn: "강제 해산이 오기 전에, 오늘 밤 같이 내려가자고 한다.",
    c26_final_condition: "임금 먼저와 시공사 교체를 조건으로, 연장 의견서에 서명한다.",
    c26_final_dissent: "연장에 반대 의견을 쓰고, 손실 처리를 의견서에 남긴다.",
    c26_final_sign: "대표 뜻대로 1년 연장에 서명하고, 다음 싸움을 위해 자리를 지킨다.",
    c26_after_warm: "내려온 반장과 인부들 곁에 남아, 현장의 밤을 끝까지 보낸다.",
    c26_after_record: "돈을 댄 일곱 곳과 금액을 표로 묶어, 이번 결정을 문서로 남긴다.",
    c26_after_rush: "현장을 뒤로하고, 곧장 본사로 돌아가 다음 안건을 연다.",
    c26_route_system_publish: "통계를, 위원회 자료와 채권자 회의에 함께 공개한다.",
    c26_route_system_names: "32건이 무너진 날, 그 자리에 있던 사람들을 찾아본다.",
    c26_route_system_drop: "통계는 덮고, 의견서는 연장 쪽으로 쓴다.",
    c26_final_system_route_a: "만기를 연장할 때마다, 대표이사 서명을 반드시 받게 하는 규칙을 제안한다.",
    c26_final_system_route_b: "연장은 하되, 이자보다 인부 임금이 먼저 나가게 조건만 바꾼다.",
    c26_final_system_route_c: "후순위 신협 조합원들에게, 손실 위험을 먼저 알린다.",
    c26_evidence_turn_reclaim: "자문료 32억을 되찾아, 임금부터 주자고 위원회에 올린다.",
    c26_evidence_turn_hold: "명세서는 쥐고 있다가, 해온파트너스를 쫓을 때 쓴다.",
    c26_evidence_turn_share: "인부들과 계약자들에게, 32억이 어디로 갔는지 먼저 알린다.",
  },
  echoReplies: {
    // CASE 26.
    c26_start_site: "현장에 가면 의견서의 빈칸은 그대로 기다립니다. 대신 크레인 위에서 누군가 당신 차의 번호판을 봅니다.",
    c26_start_terms: "대조하면 약정서 17쪽에 시공사가 공사를 반드시 끝내겠다는 약속이 있습니다. 그 약속을 지킬 돈이 시공사에 없다는 사실은 어느 쪽에도 없습니다.",
    c26_start_draft: "초안은 한 시간 만에 나옵니다. 인쇄된 당신 이름 위로, 당신이 쓴 첫 문장이 연장을 권합니다.",
    c26_crane_listen: "받아 적으면 요구는 세 줄입니다. 임금, 사과, 그리고 '내 사람들 이름'. 세 번째 줄은 어느 서류 양식에도 칸이 없습니다.",
    c26_crane_ledger: "계약서를 보면 돈은 시공사에서 멈췄습니다. 시공사는 시행사를, 시행사는 KD캐피탈을 가리킵니다.",
    c26_crane_down: "설득하면 지강현이 웃습니다. '내려가면 협상이 나중이 아니라 없는 거요.' 전화가 끊깁니다.",
    c26_branch_frame_a: "사진을 찍으면 인부 여섯 명이 자기가 짜다 만 층을 하나씩 가리킵니다. 증언이 층수만큼 모입니다.",
    c26_branch_frame_b: "층마다 대조하면 차이는 14%입니다. 그 14%만큼 돈은 먼저 나갔습니다.",
    c26_branch_frame_c: "내려가면 분필 글씨는 벽에 남습니다. 다음 비가 오기 전까지만입니다.",
    c26_branch_frame_follow_a: "보여 주면 인부들이 확인자 칸을 오래 봅니다. 누군가 '우리 임금 명세서에도 이런 칸 있었지' 하고 중얼거립니다.",
    c26_branch_frame_follow_b: "질의는 접수됩니다. 부동산금융팀은 '담당자 퇴사'라고 답하고, 퇴사일은 도장이 찍힌 다음 날입니다.",
    c26_branch_frame_follow_c: "넘기면 권도현이 받아 듭니다. '브릿지가 싸우면 브릿지 몫만 챙깁니다. 알고 넘기시는 거죠?'",
    c26_creditors_wages: "표를 보태면 가운데 칸이 이깁니다. KD캐피탈 쪽 자리의 헛기침이 그날 오후 대표실까지 올라갑니다.",
    c26_creditors_audit: "회의를 멈추면 실사에 2주가 걸립니다. 만기는 2주 뒤이고, 크레인 임대료는 그동안에도 하루 83만 원입니다.",
    c26_creditors_extend: "연장 쪽에 표가 모이면 회의는 40분 만에 끝납니다. 권도현이 가운데 칸을 볼펜으로 천천히 지웁니다.",
    c26_tower_promise: "약속하면 지강현이 손주 사진을 한 번 봅니다. '이름 걸었으면 도망 못 가요.' 당신 이름이 크레인 위에 하나 더 올라갑니다.",
    c26_tower_explain: "설명하면 지강현이 끝까지 듣습니다. '그러니까 결정하는 사람은 여기 안 온다는 거네.' 틀린 말이 아닙니다.",
    c26_tower_warn: "같이 내려가자고 하면 그는 사다리를 내려다봅니다. 아래에서 강태민이 손전등을 흔듭니다. 그가 고개를 젓습니다.",
    c26_final_condition: "서명하면 새 돈 40억이 들어가고 임금이 먼저 나갑니다. 연장된 1년의 이자는 그 40억 위에 또 붙습니다.",
    c26_final_dissent: "반대 의견은 위원회 기록에 남습니다. 3년 전처럼 지워지지는 않지만, 공매가 시작되면 맨 뒷줄 사람들이 가장 먼저 그 기록을 읽습니다.",
    c26_final_sign: "서명하면 올해 장부는 깨끗합니다. 크레인 위의 불은 오늘 밤에도 켜져 있고, 당신은 20층 사람들이 믿는 자리에 한 칸 더 가까워집니다.",
    c26_after_warm: "남으면 현장 사무소 컨테이너에 불이 늦게까지 켜집니다. 지강현이 인부 87명의 이름을 하나씩 부르고, 강태민이 대답 대신 컵라면을 돌립니다.",
    c26_after_record: "표로 묶으면 일곱 곳의 돈과 순서가 한 장에 보입니다. 맨 끝 줄이 얼마나 얇은지도 보입니다.",
    c26_after_rush: "곧장 돌아가면 12층에는 금요일 밤에도 사람이 남아 있습니다. 칸막이 너머에서 메신저 알림이 유난히 자주 울립니다.",
    c26_route_system_publish: "공개하면 채권자 회의 화면 속 신협 담당자 한 명이 처음으로 마이크를 켭니다. '그럼 우리는 늘 맨 끝에서 그 날짜를 맞는 거네요.'",
    c26_route_system_names: "찾아보면 32건의 마지막 담당자 가운데 스물한 명이 이미 회사를 떠났습니다. 떠난 사유는 대부분 '손실 책임'입니다.",
    c26_route_system_drop: "덮으면 의견서는 매끄럽게 연장을 권합니다. 42번째 연장이 조용히 기록됩니다.",
    c26_final_system_route_a: "규칙이 생기면 다음 연장부터 대표이사 칸이 살아납니다. 이번 서류의 '해당 없음'은 그대로 남습니다.",
    c26_final_system_route_b: "조건을 바꾸면 인부들이 먼저 받습니다. 날짜를 옮기는 결정이라는 사실은 바뀌지 않습니다.",
    c26_final_system_route_c: "알리면 신협 조합원들이 자기 돈이 평택 크레인에 걸려 있다는 걸 처음 압니다. 아는 순간부터 그 돈은 불안해집니다.",
    c26_evidence_turn_reclaim: "위원회에 올리면 32억이 처음으로 안건 제목이 됩니다. 해온파트너스는 그날 오후 등기부의 주소를 옮깁니다.",
    c26_evidence_turn_hold: "쥐고 있으면 강한 패가 됩니다. 그 패를 쥐고 있는 동안 인부들의 두 달 치 임금은 계속 밀립니다.",
    c26_evidence_turn_share: "알리면 지강현이 크레인 위에서 오래 말이 없습니다. 그리고 현수막 밑에 한 줄을 덧씁니다. '조언값 32억.'",
  },
  characterProfiles: {
    지강현: {
      role: "르하임 고덕 현장 형틀 반장 · 타워크레인 농성 중",
      stance: "생계 · 자존심 · 버팀",
      job: "지은 사람의 이름이 남지 않는 건물 위에서, 떼인 임금만큼 지워진 이름을 따진다.",
      appearance: "색 바랜 흰 안전모, 먹줄 자국이 밴 손바닥, 크레인 운전석 유리에 테이프로 붙인 손주 사진.",
      thought: "틀은 다 짓고 나면 뜯어서 버린다. 사람도 그렇게 다루는 걸 30년 봤다.",
      gesture: "지강현은 대답하기 전에 난간을 손바닥으로 두 번 친다. 아직 튼튼한지 확인하는 버릇이다.",
      voice: "현장 반장의 짧은 말투로 반말과 존댓말을 섞고, 질문을 질문으로 돌려준다.",
      line: "이 건물 누구 거요? 우리가 쌓았는데, 우리 건 아니라대.",
    },
    송하율: {
      role: "르하임 고덕 분양 계약자 모임 대표 · 10월 출산 예정",
      stance: "생활 · 불안 · 또렷함",
      job: "연장이냐 손실이냐는 은행의 말을 '12월에 어디서 자느냐'는 질문으로 바꿔 되묻는다.",
      appearance: "평면도가 든 투명 파일, 불러 오는 배를 받친 손, 부동산 앱이 켜진 채 식지 않는 휴대폰.",
      thought: "벽지 색까지 골랐다. 고른 게 잘못은 아니잖아.",
      gesture: "송하율은 말이 막히면 평면도 속 작은 방을 손가락으로 한 번 짚는다.",
      voice: "차분하고 예의 바르지만, 대답을 들을 때까지 같은 질문을 다시 한다.",
      line: "은행 분들은 연장이다, 손실이다 하시잖아요. 저희는 12월에 어디서 자요?",
    },
  },
  setting: { place: "KD캐피탈 20층 · 대표실", clock: "4월 10일 월요일 · 08:00 · 만기까지 D-14" },
  sceneContext: {
    c26_start: {
      place: "KD캐피탈 20층 · 대표실",
      clock: "4월 10일 월요일 · 08:00 · 만기까지 D-14",
      question: "취임 사흘 만의 첫 안건에 당신 이름이 이미 인쇄돼 있습니다. 무엇부터 하겠습니까?",
      lead: "취임식에서 월요일 여덟 시에 올라오라던 말대로, 20층 엘리베이터 문이 열립니다.",
    },
    c26_start_warm: {
      place: "KD캐피탈 20층 · 대표실",
      clock: "4월 10일 월요일 · 08:00 · 만기까지 D-14",
      question: "벚꽃을 보던 주말 내내 누군가 크레인 위에 있었습니다. 여섯 명과 이 파일을 어떻게 나누겠습니까?",
      lead: "주말 내내 읽지 않은 메일을, 20층으로 올라가는 엘리베이터 안에서 엽니다.",
    },
    c26_start_record: {
      place: "KD캐피탈 20층 · 대표실",
      clock: "4월 10일 월요일 · 08:00 · 만기까지 D-14",
      question: "여섯 자리 지도의 한가운데가 당신 책상 위 파일이 됐습니다. 그 지도를 어떻게 쓰겠습니까?",
      lead: "주말 동안 묶은 문서를 가방에 넣은 채 20층 버튼을 누릅니다.",
    },
    c26_start_rush: {
      place: "KD캐피탈 20층 · 대표실",
      clock: "4월 10일 월요일 · 08:00 · 만기까지 D-14",
      question: "아무도 없던 새벽의 방문을 대표가 알고 있습니다. 그 새벽을 누구에게 먼저 말하겠습니까?",
      lead: "토요일 새벽 펜스 밖에서 크레인의 불빛을 본 뒤, 이틀 만에 20층에 올라왔습니다.",
    },
    c26_crane: {
      place: "평택 고덕 르하임 오피스텔 · 공사 현장 타워크레인 아래",
      clock: "4월 11일 · 10:00 · 4월 · 농성 9일째",
      question: "40미터 위의 반장이 이 건물이 누구 것이냐고 묻습니다. 어떻게 답하겠습니까?",
      lead: "평택 고덕 사거리에서 내려 펜스를 따라 걷자, 멈춘 골조 옆 크레인 꼭대기에 흰 천이 펄럭입니다.",
    },
    c26_branch_frame: {
      place: "평택 고덕 르하임 오피스텔 · 골조 14층",
      clock: "4월 11일 · 14:00",
      question: "72%라고 보고된 건물의 14층에 바닥이 없습니다. 이 빈 층을 어떻게 하겠습니까?",
    },
    c26_branch_frame_follow: {
      place: "평택 고덕 르하임 오피스텔 · 현장 사무소",
      clock: "4월 11일 · 16:00",
      question: "부풀린 공정률 옆 확인란에 도장만 있고 이름이 없습니다. 이 칸을 어떻게 하겠습니까?",
    },
    c26_ramen: {
      place: "평택 고덕 르하임 오피스텔 · 현장 사무소 컨테이너",
      clock: "4월 11일 · 21:00",
      question: "양동이로 오가는 컵라면 옆에서 한 인부의 등록금 마감이 다가옵니다. 어떻게 하겠습니까?",
    },
    c26_ramen_reaction: {
      place: "평택 고덕 르하임 오피스텔 · 타워크레인 아래",
      clock: "4월 12일 · 00:10",
      question: "내려가면 현수막을 볼 사람이 없다고 반장이 말합니다. 그 이름들을 어떻게 남기겠습니까?",
    },
    c26_creditors: {
      place: "여의도 브릿지은행 · 채권자 회의실",
      clock: "4월 14일 · 14:00 · 만기까지 D-10",
      question: "연장과 손실 사이에 임금을 먼저 주는 가운데 칸이 생겼습니다. KD캐피탈의 표를 어디에 두겠습니까?",
      lead: "브릿지은행 로비에서 오진우가 방문증을 건네며 '오늘 권도현 씨 표 세 번 고쳤어요'라고 귀띔합니다.",
    },
    c26_nursery: {
      place: "르하임 고덕 모델하우스 · 앞 주차장",
      clock: "4월 15일 · 11:00",
      question: "12월에 어디서 자느냐는 질문이 마흔 명 앞에서 나왔습니다. 무엇이라 답하겠습니까?",
    },
    c26_nursery_reaction: {
      place: "KD캐피탈 12층 · 위험관리부",
      clock: "4월 17일 · 08:30",
      question: "대표이사 칸에만 '해당 없음'이 미리 찍혀 있습니다. 이 양식을 어떻게 하겠습니까?",
    },
    c26_tower: {
      place: "평택 고덕 르하임 오피스텔 · 타워크레인 운전석",
      clock: "4월 21일 · 23:30 · 농성 19일째",
      question: "내려가면 무엇이 달라지냐고 40미터 위에서 묻습니다. 무엇을 약속할 수 있겠습니까?",
      lead: "처음으로 올라오라는 전화를 받고, 안전줄을 허리에 건 채 사다리 첫 칸에 발을 올립니다.",
    },
    c26_elevator: {
      place: "KD캐피탈 본사 · 엘리베이터",
      clock: "4월 22일 · 07:50 · 위원회 전날",
      question: "윤상혁이 당신 이름은 작성자 칸에만 들어간다고 말합니다. 이 50초에 어떻게 답하겠습니까?",
    },
    c26_elevator_reaction: {
      place: "KD금융그룹 본사 7층 · 대기실",
      clock: "4월 22일 · 21:00",
      question: "반려 도장을 찍었던 사람이 대표이사 서명 면제 규정의 부칙을 찾았습니다. 어떻게 하겠습니까?",
    },
    c26_route_system: {
      place: "KD캐피탈 12층 · 위험관리부 심사 단말",
      clock: "4월 12일 · 19:00",
      question: "연장된 부동산 대출 41건 중 32건이 더 큰 손실로 끝났습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c26_final_system_route: {
      place: "KD캐피탈 12층 · 위험관리부 심사 단말",
      clock: "위원회 당일 · 새벽",
      question: "손실의 날짜를 옮기는 결정의 모양을 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c26_evidence_turn: {
      place: "KD캐피탈 17층 · 자료실",
      clock: "위원회 당일 · 06:00",
      question: "임금 14억은 못 줬는데 조언값 32억은 나갔습니다. 이 명세서를 어떻게 쓰겠습니까?",
    },
    c26_final: {
      place: "KD캐피탈 19층 · 심사위원회 회의실",
      clock: "4월 23일 · 15:00 · 만기 하루 전",
      question: "대표이사 칸이 빈 서류에 당신이 서명해야 합니다. 어떤 의견서에 이름을 남기겠습니까?",
      lead: "회의실 문 앞에서 채이안이 연필을 귀에서 빼 손에 쥡니다. 오늘은 도로 꽂지 않을 모양입니다.",
    },
    c26_aftershock: {
      place: "평택 고덕 르하임 오피스텔 · 공사 현장 타워크레인 아래",
      clock: "4월 24일 · 18:40",
      question: "반장이 22일 만에 내려오고, 맨 끝 줄의 신협에 동그라미가 쳐졌습니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c26-advisory-fee",
    title: "사업비 명세서의 한 줄",
    text: "르하임 고덕의 사업비에서 '사업 자문료' 32억이 공사가 멈추기 두 달 전 해온파트너스로 나갔습니다. 같은 날 공정률 보고가 72%로 올라갔고, 인부 87명의 임금 14억은 끝내 나가지 않았습니다.",
  },
  outcomes: {
    c26_after_warm: { tag: "곁에 남은 결말", title: "22일 만에 내려온 반장과 현장의 밤을 보냈다", text: "지강현이 사다리를 내려온 밤, 현장 사무소 컨테이너에는 늦게까지 불이 켜져 있었습니다. 인부 87명의 이름이 한 번씩 불렸고, 컵라면은 끝까지 모자라지 않았습니다." },
    c26_after_record: { tag: "표로 남긴 결말", title: "돈을 댄 일곱 곳이 한 장의 표가 됐다", text: "르하임 고덕에 돈을 댄 일곱 곳과 각자의 금액, 돌려받는 순서가 문서로 남았습니다. 맨 끝 줄이 얼마나 얇은지도 함께 남았습니다." },
    c26_after_rush: { tag: "먼저 돌아간 결말", title: "박수가 끝나기 전에 본사로 돌아갔다", text: "인부들의 박수를 뒤로하고 당신은 12층으로 돌아가 다음 안건을 열었습니다. 금요일 밤에도 칸막이 너머 메신저 알림은 멈추지 않았습니다." },
  },
  carryovers: {
    c26_after_warm: { trust: 11, humanCost: -6, fatigue: -7 },
    c26_after_record: { legitimacy: 12, trust: 4, fatigue: 4 },
    c26_after_rush: { capital: 6, legitimacy: 4, trust: -9 },
  },
  continuityChallenges: {
    c25_after_warm: { id: "protect-trust", title: "벚꽃길의 여섯 명과 함께 크레인 아래 서기", text: "벚꽃길 끝까지 함께 걸은 여섯 명이 월요일 아침 같은 사진을 봤습니다. 크레인 아래에 혼자가 아니라 그 사람들과 함께 서는 선택을 찾아야 보너스가 열립니다." },
    c25_after_record: { id: "use-reframe", title: "지도 한가운데를 거꾸로 읽기", text: "여섯 자리 지도의 한가운데가 당신 이름이 인쇄된 파일이 됐습니다. 그 지도가 연장의 근거가 아니라 사람들의 증거가 되게 판을 다시 짜야 합니다." },
    c25_after_rush: { id: "repair-legitimacy", title: "아무도 없던 새벽의 공정함 회복하기", text: "먼저 달려간 새벽의 방문을 대표가 알고 있었습니다. 그 새벽이 누구의 판단이었는지 동료들에게 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
