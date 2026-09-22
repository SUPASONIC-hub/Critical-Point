/**
 * CASE 11 -- the authored scenes of the room everyone watches.
 *
 * Ten cases happen behind doors: an analysis room, a bid, a branch counter, a
 * creditors' table, a hospital ward. The season's thesis has been argued in
 * rooms where only the people in them could see what was decided, and the man
 * at the top of the chain -- 윤상혁, who left the signature box empty three
 * years ago -- has never once had to stand in any of them.
 *
 * This case opens the door. The loan that started the season becomes a news
 * story, the analyst is called to a 국정감사 as a 참고인, and 윤상혁 is called as
 * a witness and does not come. The question is no longer what to decide but
 * what to say out loud, and every true sentence has somebody's name attached to
 * it: 도윤하 sold the loan, 한서윤 signed the rejection, 이민서's account is in
 * the logs, 임경수 leaked the paper.
 *
 * It is also the season's widest emotional range on purpose. Anger at the two
 * scripts that each want the analyst to say something unprovable; the first
 * laughter the team has had in eleven cases, in a mock hearing staged on apple
 * crates; the grief of 한서윤's confession; a father and son at one table; and a
 * night at a 포장마차 that ends with the call from the 33rd floor the finale
 * answers.
 */
export const case11Nodes = {
  c11_start: {
    phase: "CASE 11 BRIEFING",
    title: "익명의 A씨",
    speaker: "한서윤",
    text:
      "새벽 여섯 시, 탐사보도 매체 리드라인에 기사 한 편이 올라왔습니다. 제목은 「반대 의견은 왜 사라졌나 -- KD은행 2023-0412 대출의 3년」. 기사 속 '익명의 반대 의견 작성자 A씨'가 당신입니다. 아홉 시, KD금융그룹 홍보실이 입장문을 냅니다. '당시 심사는 규정대로 진행됐으며, 일부 직원의 개인적 판단에 대해서는 사실관계를 확인 중입니다.' 정오에는 국회 정무위원회(금융 문제를 맡는 국회 위원회)가 당신을 국정감사(국회가 1년에 한 번 정부와 금융회사의 일을 공개적으로 따져 묻는 자리) 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)으로 채택합니다. 한서윤이 휴대폰을 엎어 놓습니다. '오늘 제 전화가 마흔 번 울렸어요. 서른아홉 번은 당신 번호를 묻는 전화였고요.'",
    memo: [
      "리드라인 기사 조회수 오전에만 41만",
      "그룹 홍보실 입장문: '일부 직원의 개인적 판단'",
      "참고인 출석까지 5일",
      "윤상혁 상무는 증인 채택, 해외 출장을 이유로 불출석 예정",
    ],
    triggers: ["fear", "injustice", "recognition"],
    choices: [
      {
        id: "c11_start_reporter",
        label: "기자에게 먼저 연락해 틀린 사실부터 바로잡는다",
        effect: { legitimacy: 10, trust: 5, time: -6, humanCost: 3, fatigue: 4 },
        next: "c11_script",
        cognition: { inference: 2 },
      },
      {
        id: "c11_start_pr",
        label: "그룹 홍보실의 입장문 초안부터 받아 읽는다",
        effect: { capital: 9, time: 5, trust: -8, legitimacy: -4, fatigue: 1 },
        next: "c11_script",
        cognition: { risk: 2 },
      },
      {
        id: "c11_start_team",
        label: "출석 전에 동료들부터 모아 무엇을 말할지 함께 정한다",
        effect: { trust: 12, humanCost: -5, capital: -5, time: -6, fatigue: 4 },
        next: "c11_script",
        cognition: { persistence: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c11_script",
      },
    ],
  },
  c11_script: {
    phase: "PUBLIC PRESSURE",
    title: "두 개의 대본",
    speaker: "차지원",
    text:
      "의원회관 7층, 정무위원회 의원실. 보좌관(의원을 도와 질문을 준비하는 직원) 차지원이 삼각김밥을 선 채로 먹으며 A4 두 장을 내밉니다. 한 장은 의원실의 질의 대본입니다. 마지막 줄에 당신이 할 답이 미리 적혀 있습니다. '윤상혁 상무가 반대 의견 삭제를 직접 지시했습니다.' 다른 한 장은 한 시간 전 그룹 홍보실이 보낸 '참고인 답변 참고 자료'입니다. 마지막 줄은 '당시 판단은 개인의 소신이었으며 조직적 압력은 없었습니다.' 차지원이 김밥 포장지를 반으로 접습니다. '의원님 질의 시간은 7분이에요. 7분 안에 안 들어가는 진실은, 여기서는 없는 진실이에요.' 두 대본 모두 당신이 증명할 수 없는 문장으로 끝납니다.",
    memo: [
      "의원실 대본: '윤상혁이 삭제를 직접 지시' -- 직접 증거 없음",
      "홍보실 자료: '조직적 압력 없음' -- 사실과 다름",
      "질의 시간 7분, 참고인 답변은 평균 40초",
      "두 대본 모두 오늘 밤 12시까지 회신 요청",
    ],
    triggers: ["manipulation", "injustice", "order"],
    choices: [
      {
        id: "c11_script_own",
        label: "두 대본 다 돌려보내고 증명할 수 있는 문장만으로 새로 쓴다",
        effect: { legitimacy: 13, trust: 4, time: -8, capital: -4, fatigue: 5 },
        next: "c11_rehearsal",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c11_script_trim",
        label: "의원실 대본을 받되 증거 없는 마지막 줄만 지운다",
        effect: { trust: 8, legitimacy: 5, time: 4, humanCost: 3, fatigue: 2 },
        next: "c11_rehearsal",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c11_script_pr",
        label: "홍보실 자료를 따르는 대신 동료들 인사 보복 금지를 약속받는다",
        effect: { capital: 8, humanCost: -6, legitimacy: -10, trust: -5, fatigue: -2 },
        next: "c11_rehearsal",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c11_rehearsal",
      },
    ],
  },
  c11_rehearsal: {
    phase: "THE REHEARSAL",
    title: "모의 국정감사",
    speaker: "나준혁",
    text:
      "회기동 헌책방 2층에 모의 국정감사장이 차려졌습니다. 의원석은 사과 상자 세 개, 참고인석은 임경수의 낡은 독서대입니다. 나준혁은 윤상혁 역을 하겠다며 두 치수 작은 감색 정장을 빌려 입고 왔는데, 단추가 잠기지 않습니다. 의원 역의 강태민은 질문마다 '그래서 컵라면은 누가 삽니까'로 끝내 버리고, 권도현은 초시계를 들고 답변마다 '41초, 깁니다'를 외칩니다. 기자 역의 오진우는 제일 못된 질문을 던지다가 자기가 먼저 웃음을 터뜨립니다. 도윤하가 3주 만에 처음으로 소리 내어 웃습니다. 웃음이 가라앉을 무렵, 이민서가 조용히 손을 듭니다. '근데요, 제 이름도 나와요? 사건 02 접속 기록에 제 계정이 있잖아요. 저 아직 계약직이에요.'",
    memo: [
      "모의 질의 12회 -- 평균 답변 41초",
      "나준혁의 정장 단추 1개 분실",
      "이민서 계약 갱신 심사는 다음 달",
      "사건 02의 접속 기록에 이민서 계정이 남아 있음",
    ],
    triggers: ["trust", "affection", "fear"],
    choices: [
      {
        id: "c11_rehearsal_shield",
        label: "이민서의 이름이 나올 질문은 답을 미리 막아 둔다",
        effect: { trust: 10, humanCost: -7, legitimacy: -4, time: -4, fatigue: 3 },
        next: "c11_sign",
        cognition: { persistence: 2 },
      },
      {
        id: "c11_rehearsal_truth",
        label: "숨기면 더 다친다며 이민서와 함께 사실대로 답하는 연습을 한다",
        effect: { legitimacy: 12, trust: 6, humanCost: 5, time: -6, fatigue: 5 },
        next: "c11_sign",
        cognition: { inference: 2 },
      },
      {
        id: "c11_rehearsal_contract",
        label: "출석 전에 이민서의 정규직 전환부터 요구한다",
        effect: { trust: 12, capital: -9, legitimacy: 5, time: -7, fatigue: 5 },
        next: "c11_sign",
        cognition: { reframing: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c11_sign",
      },
    ],
  },
  c11_sign: {
    phase: "CONFESSION",
    title: "반려한 사람",
    speaker: "한서윤",
    text:
      "출석 전날 밤, 한서윤이 트리거랩 옥상으로 당신을 부릅니다. 바람이 세서 그의 목소리가 자꾸 끊깁니다. '3년 전 당신 반대 의견을 반려한 사람, 저예요. 서명은 제가 했어요. 그날 오후에 윤 상무가 전화했어요. 반대 의견이 위로 올라가면 우리 팀 일곱 명이 흩어진다고. 그 일곱 명 중 셋은 그해 아이가 태어났어요.' 그가 휴대폰으로 음성 파일 하나를 재생합니다. 3년 전 그 통화입니다. '이걸 내일 내면, 당신이 옳았다는 게 증명돼요. 그리고 저는 끝나요. 3년 동안 이 파일을 못 지운 이유를, 저도 오늘에야 알았어요.'",
    memo: [
      "3년 전 통화 녹음 -- 윤상혁 목소리 확인 가능",
      "통화 내용: '반대 의견이 올라가면 팀 해체'",
      "한서윤: 반려 서명 당사자",
      "제출하면 한서윤도 징계와 고발 대상이 될 수 있음",
    ],
    triggers: ["affection", "responsibility", "selfAwareness"],
    choices: [
      {
        id: "c11_sign_ask",
        label: "녹음을 내일 함께 제출하자고 부탁한다",
        effect: { legitimacy: 14, trust: 4, humanCost: 6, time: -5, fatigue: 5 },
        next: "c11_final",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c11_sign_spare",
        label: "녹음은 두고 내 증언만으로 윤상혁을 부른다",
        effect: { trust: 12, humanCost: -6, legitimacy: -6, capital: -4, fatigue: 4 },
        next: "c11_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c11_sign_together",
        label: "반대한 사람과 반려한 사람이 함께 출석해 같이 말하자고 한다",
        effect: { trust: 11, legitimacy: 10, capital: -8, time: -8, humanCost: 3, fatigue: 7 },
        next: "c11_final",
        cognition: { reframing: 3 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c11_final",
      },
    ],
  },
  c11_final: {
    phase: "HEARING",
    title: "7분",
    speaker: "차지원",
    text:
      "증인석의 '윤상혁' 명패 앞 의자는 비어 있고, 카메라 열두 대가 그 빈 의자와 참고인석을 번갈아 찍습니다. 방청석 맨 뒷줄에 오상철이 앉아 있고, 그 옆에 오진우가 앉았습니다. 의원의 질의 시간 7분 중 3분이 지났습니다. 마지막 질문이 옵니다. '참고인, 3년 전 그 반대 의견은 왜 사라졌습니까. 누가 지웠습니까.' 뒤에서 차지원이 쪽지를 밀어 넣습니다. '남은 시간 4분. 이름을 말하면 내일 1면, 구조를 말하면 내일 4면이에요.' 셔터 소리가 한꺼번에 쏟아집니다.",
    memo: [
      "남은 질의 시간 4분",
      "증인석의 빈 의자: 윤상혁",
      "방청석: 오상철·오진우, 트리거랩 동료 7명",
      "이 답은 시즌 마지막 사건의 서명란으로 이어짐",
    ],
    triggers: ["choice", "injustice", "selfAwareness"],
    choices: [
      {
        id: "c11_final_name",
        label: "증거를 들고 윤상혁의 이름을 말한다",
        effect: { legitimacy: 14, trust: 5, capital: -8, humanCost: 4, time: -5, fatigue: 6 },
        next: "case11_result",
        cognition: { inference: 2, risk: 1 },
      },
      {
        id: "c11_final_system",
        label: "한 사람의 이름 대신 반대 의견이 사라지는 구조를 말한다",
        effect: { legitimacy: 10, trust: 9, capital: -6, time: -7, humanCost: -5, fatigue: 5 },
        next: "case11_result",
        cognition: { reframing: 3 },
      },
      {
        id: "c11_final_people",
        label: "1,740명의 숫자로 시작해 남은 시간을 피해자에게 쓴다",
        effect: { trust: 14, humanCost: -8, legitimacy: -5, time: -6, capital: -5, fatigue: 6 },
        next: "case11_result",
        cognition: { persistence: 3 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case11_result",
      },
    ],
  },
};
