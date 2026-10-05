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
        voice: "기사에 틀린 게 있으면 그것부터라며, 기자에게 먼저 연락해 바로잡는다.",
        echo: "바로잡은 기사는 더 빨리 퍼집니다. 기자와 처음 통화한 사람이라는 사실도 함께 퍼집니다.",
        next: "c11_script",
        cognition: { inference: 2 },
      },
      {
        id: "c11_start_pr",
        label: "그룹 홍보실의 입장문 초안부터 받아 읽는다",
        effect: { capital: 9, time: 5, trust: -8, legitimacy: -4, fatigue: 1 },
        voice: "상대가 무엇을 말하려는지부터 보겠다며, 홍보실의 입장문 초안을 받아 읽는다.",
        echo: "초안을 읽으면 그룹이 누구를 개인의 일탈로 만들지 미리 압니다. 읽었다는 기록은 그룹에 남습니다.",
        next: "c11_script",
        cognition: { risk: 2 },
      },
      {
        id: "c11_start_team",
        label: "출석 전에 동료들부터 모아 무엇을 말할지 함께 정한다",
        effect: { trust: 12, humanCost: -5, capital: -5, time: -6, fatigue: 4 },
        voice: "혼자 나갈 자리가 아니라며, 동료들부터 모아 무엇을 말할지 함께 정한다.",
        echo: "함께 정하면 닷새가 버틸 만해집니다. 여섯 사람이 합의한 문장은, 누구 하나 빠지면 다시 써야 합니다.",
        next: "c11_script",
        cognition: { persistence: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
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
        voice: "둘 다 증명할 수 없는 문장으로 끝나서, 두 대본 다 돌려보내고 증명할 수 있는 문장만으로 새로 쓴다.",
        echo: "증명할 수 있는 문장만 남기면 7분이 짧아집니다. 짧은 답은 편집되지 않습니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c11_script_trim",
        label: "의원실 대본을 받되 증거 없는 마지막 줄만 지운다",
        effect: { trust: 8, legitimacy: 5, time: 4, humanCost: 3, fatigue: 2 },
        voice: "직접 지시했다는 말은 증명할 수 없어서, 의원실 대본을 받되 증거 없는 마지막 줄만 지운다.",
        echo: "마지막 줄을 지우면 의원실은 질문을 바꿔야 합니다. 바뀐 질문이 어디로 향할지는 당신이 정할 수 없습니다.",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c11_script_pr",
        label: "홍보실 자료를 따르는 대신 동료들 인사 보복 금지를 약속받는다",
        effect: { capital: 8, humanCost: -6, legitimacy: -10, trust: -5, fatigue: -2 },
        voice: "의원실 문장도 증명할 수 없기는 마찬가지라, 홍보실 자료를 따르는 대신 동료들 인사 보복 금지를 약속받는다.",
        echo: "약속은 받았습니다. 서면이 아니라 전화로 받은 약속이고, 당신은 방송에서 사실과 다른 문장을 읽게 됩니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c11_rehearsal: {
    phase: "THE REHEARSAL",
    title: "모의 국정감사",
    speaker: "나준혁",
    text:
      "회기동 헌책방 2층에 모의 국정감사장이 차려졌습니다. 의원석은 사과 상자 세 개, 참고인석은 임경수의 낡은 독서대입니다. 나준혁은 윤상혁 역을 하겠다며 두 치수 작은 감색 정장을 빌려 입고 왔는데, 단추가 잠기지 않습니다. 의원 역의 강태민은 질문마다 '그래서 컵라면은 누가 삽니까'로 끝내 버리고, 권도현은 초시계를 들고 답변마다 '41초, 깁니다'를 외칩니다. 기자 역의 오진우는 제일 못된 질문을 던지다가 자기가 먼저 웃음을 터뜨립니다. 도윤하가 3주 만에 처음으로 소리 내어 웃습니다. 웃음이 가라앉을 무렵, 이민서가 조용히 손을 듭니다. '근데요, 제 이름도 나와요? 그때 유출 소동 접속 기록에 제 계정이 있잖아요. 저 아직 계약직이에요.'",
    memo: [
      "모의 질의 12회 -- 평균 답변 41초",
      "나준혁의 정장 단추 1개 분실",
      "이민서 계약 갱신 심사는 다음 달",
      "유출 소동의 접속 기록에 이민서 계정이 남아 있음",
    ],
    triggers: ["trust", "affection", "fear"],
    choices: [
      {
        id: "c11_rehearsal_shield",
        label: "이민서의 이름이 나올 질문은 답을 미리 막아 둔다",
        effect: { trust: 10, humanCost: -7, legitimacy: -4, time: -4, fatigue: 3 },
        voice: "아직 계약직인 사람이 그 방에서 불리지 않게, 이민서의 이름이 나올 질문은 답을 미리 막아 둔다.",
        echo: "막아 두면 이민서는 그 방에서 불리지 않습니다. 대신 그 질문은 다른 날, 다른 방에서 옵니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c11_rehearsal_truth",
        label: "숨기면 더 다친다며 이민서와 함께 사실대로 답하는 연습을 한다",
        effect: { legitimacy: 12, trust: 6, humanCost: 5, time: -6, fatigue: 5 },
        voice: "어차피 남아 있는 접속 기록이라 숨기면 더 다친다며, 이민서와 함께 사실대로 답하는 연습을 한다.",
        echo: "연습한 답은 떨리지 않습니다. 사실대로 나온 이름은 계약 갱신 심사 서류에도 같이 올라갑니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c11_rehearsal_contract",
        label: "출석 전에 이민서의 정규직 전환부터 요구한다",
        effect: { trust: 12, capital: -9, legitimacy: 5, time: -7, fatigue: 5 },
        voice: "다음 달 계약 갱신 심사에 이름이 걸리지 않게, 출석 전에 이민서의 정규직 전환부터 요구한다.",
        echo: "요구는 협상이 됩니다. 협상 테이블에 오른 순간, 이민서의 전환은 당신 증언의 값으로 읽힐 수 있습니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
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
        voice: "윤상혁의 목소리가 그대로 남은 통화라서, 녹음을 내일 함께 제출하자고 한서윤에게 부탁한다.",
        echo: "녹음이 나가면 당신이 옳았다는 게 증명됩니다. 한서윤은 그 증명과 함께 징계위원회에 섭니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c11_sign_spare",
        label: "녹음은 두고 내 증언만으로 윤상혁을 부른다",
        effect: { trust: 12, humanCost: -6, legitimacy: -6, capital: -4, fatigue: 4 },
        voice: "녹음은 당신이 가지고 있으라며, 내 증언만으로 윤상혁을 부르겠다고 한다.",
        echo: "녹음 없이 가면 한서윤은 남습니다. 윤상혁은 당신 말에 '기억나지 않는다'로 답할 수 있습니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c11_sign_together",
        label: "반대한 사람과 반려한 사람이 함께 출석해 같이 말하자고 한다",
        effect: { trust: 11, legitimacy: 10, capital: -8, time: -8, humanCost: 3, fatigue: 7 },
        voice: "한 사람만 끝나게 두지 않으려고, 반대한 사람과 반려한 사람이 함께 출석해 같이 말하자고 한다.",
        echo: "둘이 함께 서면 반대와 반려가 한 문장이 됩니다. 그 문장은 두 사람 모두를 드러냅니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
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
      "이 답은 33층의 빈 서명란으로 이어짐",
    ],
    triggers: ["choice", "injustice", "selfAwareness"],
    choices: [
      {
        id: "c11_final_name",
        label: "증거를 들고 윤상혁의 이름을 말한다",
        effect: { legitimacy: 14, trust: 5, capital: -8, humanCost: 4, time: -5, fatigue: 6 },
        voice: "누가 지웠느냐는 질문에는 이름으로 답해야 해서, 증거를 들고 윤상혁의 이름을 말한다.",
        echo: "이름은 내일 1면이 됩니다. 1면에 오른 이름은 다음 날부터 변호사의 이름으로 답합니다.",
        cognition: { inference: 2, risk: 1 },
      },
      {
        id: "c11_final_system",
        label: "한 사람의 이름 대신 반대 의견이 사라지는 구조를 말한다",
        effect: { legitimacy: 10, trust: 9, capital: -6, time: -7, humanCost: -5, fatigue: 5 },
        voice: "이름 하나로 끝나면 다음에도 사라진다며, 한 사람의 이름 대신 반대 의견이 사라지는 구조를 말한다.",
        echo: "구조는 4면에 실립니다. 4면을 끝까지 읽는 사람은, 그 구조 안에서 일하는 사람들입니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "c11_final_people",
        label: "1,740명의 숫자로 시작해 남은 시간을 피해자에게 쓴다",
        effect: { trust: 14, humanCost: -8, legitimacy: -5, time: -6, capital: -5, fatigue: 6 },
        voice: "이름도 구조도 아니고 잃은 사람이 먼저라며, 1,740명의 숫자로 시작해 남은 시간을 피해자에게 쓴다.",
        echo: "숫자로 시작하면 방이 조용해집니다. 방송은 그 침묵을 3초만 내보냅니다.",
        cognition: { persistence: 3 },
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
 * Everything else 사건 11 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 *
 * The voice lines. The first room the whole country can see into. Every line
 * is spoken to somebody who will be quoted, so none of them is a private
 * promise.
 */
export const case11 = {
  id: "case11",
  nodes: case11Nodes,
  aftermath: {
    c11_aftershock: {
      phase: "AFTERMATH",
      title: "여의도 포장마차",
      speaker: "강태민",
      text: "국정감사가 끝난 밤, 여의도 한강공원 앞 포장마차. 참고인 발언 영상은 저녁 뉴스 세 곳에 나갔고, 오진우 부자는 같은 테이블 끝에서 말없이 어묵 국물을 나눠 마십니다. 강태민이 처음으로 컵라면 대신 떡볶이를 삽니다. '오늘은 컵라면 말고 제대로 된 거 먹읍시다.' 나준혁이 단추 떨어진 정장 얘기를 세 번째로 꺼내고, 도윤하는 웃다가 울다가 다시 웃습니다. 그때 모두의 휴대폰이 동시에 울립니다. KD금융그룹 그룹전략실. 윤상혁 상무가 오늘 오후 귀국했고, 내일 아침 본사 33층에서 당신을 보자고 합니다.",
      memo: ["참고인 발언 영상 하루 조회수 380만", "오진우 부자, 2년 만에 같은 테이블", "윤상혁 상무 오늘 오후 귀국", "본사 33층 면담 요청: 내일 09:00"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        {
          id: "c11_after_toast",
          label: "오늘 밤은 휴대폰을 엎어 두고 끝까지 같이 먹는다",
          effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -9 },
          voice: "면담은 내일 아침 아홉 시라서, 오늘 밤은 휴대폰을 엎어 두고 끝까지 같이 먹는다.",
          echo: "엎어 둔 휴대폰은 밤새 울립니다. 아무도 뒤집지 않습니다. 떡볶이는 식기 전에 다 먹습니다.",
          next: "case11_result",
          cognition: { reframing: 2 },
        },
        {
          id: "c11_after_record",
          label: "영상 대신 속기록 전문을 공개한다",
          effect: { legitimacy: 16, trust: 3, time: -4, capital: -3, fatigue: 5 },
          voice: "잘린 영상 말고 전부 남겨야 한다며, 속기록 전문을 공개한다.",
          echo: "속기록은 잘리지 않습니다. 당신이 더듬은 12초도, 그룹이 인용할 한 문장도 그대로 남습니다.",
          next: "case11_result",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c11_after_summon",
          label: "지금 바로 33층 면담에 응하겠다고 답한다",
          effect: { capital: 9, legitimacy: 5, trust: -7, humanCost: 5, fatigue: 6 },
          voice: "미룰 이유가 없다며, 지금 바로 33층 면담에 응하겠다고 답한다.",
          echo: "바로 응하면 주도권을 쥔 것처럼 보입니다. 33층은 당신이 얼마나 빨리 오는지부터 기록합니다.",
          next: "case11_result",
          cognition: { risk: 2 },
        },
      ],
    },
  },
  aftermathRoute: ["c11_final", "c11_aftershock"],
  connectiveScenes: [
    {
      id: "c11_press",
      after: "c11_script",
      next: "c11_rehearsal",
      title: "부재중 전화 스물세 통",
      speaker: "서하린",
      text: "밤 열 시, 리드라인 기자 서하린이 의원회관 앞 편의점으로 찾아옵니다. 당신 휴대폰에는 그의 부재중 전화가 스물세 통 쌓여 있습니다. 그가 컵라면 두 개에 물을 붓고 하나를 밀어 줍니다. '기사에 틀린 게 하나 있어요. 제보자가 그렇게 말해서 A씨를 여성이라고 썼거든요. 고칠까요, 그냥 둘까요? 그냥 두면 당신은 조금 더 숨을 수 있어요.' 편의점 직원이 두 사람을 번갈아 보다가, 텔레비전 볼륨을 슬쩍 줄입니다. 화면에는 그 기사가 나오고 있습니다.",
      memo: ["기사 속 A씨의 성별이 틀리게 적힘", "그대로 두면 신원 추적이 며칠 늦어짐", "고치면 기사 신뢰도는 올라가고 당신은 드러남"],
      choices: [
        {
          label: "틀린 건 고쳐 달라고 하고 드러나는 쪽을 택한다",
          effect: { legitimacy: 10, trust: 6, humanCost: 4, time: -5, fatigue: 5 },
          voice: "틀린 기사 뒤에 숨어서 출석할 수는 없어서, 틀린 건 고쳐 달라고 하고 드러나는 쪽을 택한다.",
          echo: "고친 기사는 더 단단해집니다. 오늘 밤부터 당신 집 앞에도 카메라가 옵니다.",
        },
        {
          label: "국정감사 날까지만 그대로 두자고 부탁한다",
          effect: { time: 5, trust: 4, legitimacy: -6, humanCost: 3, fatigue: 2 },
          voice: "신원 추적이 며칠이라도 늦어지게, 국정감사 날까지만 그대로 두자고 부탁한다.",
          echo: "닷새는 숨을 수 있습니다. 출석하는 날 당신은 틀린 기사 속 사람으로 등장합니다.",
        },
        {
          label: "기사 내용은 기자 판단에 맡기고 선을 긋는다",
          effect: { capital: 5, time: 6, trust: -7, legitimacy: -3, fatigue: -3 },
          voice: "참고인이 기사 문장까지 정해 줄 수는 없어서, 기사 내용은 기자 판단에 맡기고 선을 긋는다.",
          echo: "선을 그으면 기자는 자유롭게 씁니다. 다음 기사에서 무엇이 틀릴지는 당신이 고를 수 없습니다.",
        },
      ],
    },
    {
      id: "c11_father",
      after: "c11_rehearsal",
      next: "c11_sign",
      title: "방청권 한 장",
      speaker: "오진우",
      text: "리허설이 끝나고 오진우가 계단참에서 휴대폰을 오래 봅니다. 국정감사 방청권(회의를 지켜볼 수 있는 입장권) 신청 명단에 '오상철'이라는 이름이 있습니다. 오래전 승인을 하루 늦춰 지점에서 밀려난 그의 아버지입니다. 부자는 2년째 명절에도 통화하지 않았습니다. '아버지가 거길 왜 오시는지 모르겠어요. 제가 틀렸다는 걸 보러 오시는 건지, 자기가 옳았다는 걸 보러 오시는 건지.' 그가 웃으려다 그만둡니다.",
      memo: ["방청 신청 명단에 오상철", "오진우 부자, 2년째 연락 없음", "오상철: 승인을 하루 늦춘 옛 지점장"],
      choices: [
        {
          label: "출석 전날 두 사람이 같이 밥을 먹게 자리를 만든다",
          effect: { trust: 12, humanCost: -6, time: -6, capital: -4, fatigue: 5 },
          voice: "아버지가 왜 오는지 오진우가 직접 물을 수 있게, 출석 전날 두 사람이 같이 밥을 먹게 자리를 만든다.",
          echo: "같은 밥상은 어색합니다. 그래도 둘 중 누구도 먼저 일어나지 않습니다.",
        },
        {
          label: "방청석 자리를 오진우 옆으로 바꿔 준다",
          effect: { trust: 6, legitimacy: 3, time: -3, humanCost: 3, fatigue: 2 },
          voice: "2년째 통화도 없는 부자가 나란히 앉기라도 하게, 방청석 자리를 오진우 옆으로 바꿔 준다.",
          echo: "옆자리는 말을 강요하지 않습니다. 대신 7분 동안 같은 방향을 보게 합니다.",
        },
        {
          label: "아버지 일은 오진우가 정하게 두고 묻지 않는다",
          effect: { time: 5, capital: 5, trust: -6, humanCost: 4, fatigue: -4 },
          voice: "2년 동안 끊긴 사이에 남이 끼어들 수는 없어서, 아버지 일은 오진우가 정하게 두고 묻지 않는다.",
          echo: "묻지 않으면 오진우는 혼자 정합니다. 그는 늘 그랬고, 그래서 늘 한 박자 늦었습니다.",
        },
      ],
    },
    {
      id: "c11_eve",
      after: "c11_sign",
      next: "c11_final",
      title: "여섯 시 사십 분",
      speaker: "도윤하",
      text: "출석 날 새벽 여섯 시 사십 분, 국회 앞 횡단보도. 도윤하가 보온병을 들고 먼저 와 있습니다. 강태민이 야간조를 마치고 형광 조끼 차림 그대로 합류하고, 나준혁은 단추를 새로 단 정장을 입고 와서 모두에게 보여 줍니다. 도윤하가 종이컵에 보리차를 따르다 손을 떱니다. '오늘 제 이름도 나올 거예요. 판 사람으로요. 괜찮아요. 3년 동안 그 말을 제일 많이 한 사람이 저니까.' 신호가 바뀌고, 아무도 먼저 건너지 않습니다.",
      memo: ["참고인 출석 3시간 전", "도윤하: 판매 당사자로 언급될 가능성", "방청 신청 7명 전원 도착"],
      choices: [
        {
          label: "도윤하의 이름이 나오면 내가 먼저 받아서 답하겠다고 한다",
          effect: { trust: 12, humanCost: -6, legitimacy: -3, time: -4, fatigue: 5 },
          voice: "그 말을 혼자 듣게 두지 않겠다며, 도윤하의 이름이 나오면 내가 먼저 받아서 답하겠다고 한다.",
          echo: "먼저 받으면 도윤하는 그 질문을 직접 듣지 않습니다. 대신 당신 답변 40초가 거기에 쓰입니다.",
        },
        {
          label: "판 사람과 팔게 만든 구조를 나눠서 말하자고 정한다",
          effect: { legitimacy: 10, trust: 4, time: -6, humanCost: 3, fatigue: 4 },
          voice: "한 사람이 다 뒤집어쓰지 않게, 판 사람과 팔게 만든 구조를 나눠서 말하자고 정한다.",
          echo: "나눠서 말하면 문장이 길어집니다. 긴 문장은 방송에서 잘립니다.",
        },
        {
          label: "오늘은 도윤하가 방청석에 오지 않는 게 낫다고 말한다",
          effect: { time: 5, capital: 4, trust: -8, humanCost: 5, fatigue: -3 },
          voice: "판 사람이라는 말을 그 자리에서 직접 듣지 않게, 오늘은 도윤하가 방청석에 오지 않는 게 낫다고 말한다.",
          echo: "오지 않으면 그는 안전합니다. 3년을 센 사람이 그 방에 없었다는 것도 기록에 남습니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c11_press_reaction",
      after: "c11_press",
      next: "c11_rehearsal",
      title: "검색어 3위",
      speaker: "에코",
      text: "에코가 지난 48시간의 검색 기록을 띄웁니다. 'KD은행 A씨'가 검색어 3위이고, 연관 검색어에 도윤하의 이름이 있습니다. 강서지점 실적 1위 표창 사진이 퍼졌고, 댓글 1,200개 중 공감을 가장 많이 받은 문장은 '판 사람도 공범 아닌가요'입니다. '당신이 드러나지 않는 동안, 사람들은 드러난 얼굴을 대신 찾습니다.'",
      memo: ["연관 검색어에 오른 도윤하", "공감 1위 댓글: 판 사람도 공범"],
      choices: [
        {
          label: "도윤하에게 먼저 알리고 대응을 같이 정한다",
          effect: { trust: 11, humanCost: -6, time: -6, capital: -3, fatigue: 5 },
          voice: "도윤하가 먼저 알아야 한다며, 알리고 대응을 같이 정한다.",
          echo: "먼저 들은 소식은 덜 아픕니다. 도윤하는 그날 밤 휴대폰을 끄지 않고 댓글을 끝까지 읽습니다.",
        },
        {
          label: "표창 사진을 퍼뜨린 계정부터 확인한다",
          effect: { legitimacy: 8, time: -7, humanCost: 4, fatigue: 4 },
          voice: "표창 사진이 어디서 퍼졌는지, 그 계정부터 확인한다.",
          echo: "계정을 따라가면 그룹 홍보 대행사의 이름이 나옵니다. 그걸 확인하는 데 하루가 듭니다.",
        },
        {
          label: "댓글은 보지 말자고 하고 출석 준비에만 집중한다",
          effect: { time: 6, capital: 5, trust: -7, humanCost: 5, fatigue: -4 },
          voice: "댓글 1,200개에 답할 수는 없다며, 댓글은 보지 말자고 하고 출석 준비에만 집중한다.",
          echo: "준비는 끝납니다. 도윤하는 그 댓글을 혼자 읽습니다.",
        },
      ],
    },
    {
      id: "c11_father_reaction",
      after: "c11_father",
      next: "c11_sign",
      title: "늦춘 하루",
      speaker: "오진우",
      text: "오상철이 먼저 전화를 걸어왔습니다. 오진우가 스피커를 켭니다. 쉰 목소리가 한참 망설이다 말합니다. '그날 하루 늦춘 거, 나는 아직도 잘했다고 생각한다. 그런데 그게 너한테 그동안 무슨 뜻이었는지는 한 번도 안 물어봤더라.' 오진우가 대답하지 못하고 휴대폰을 당신 쪽으로 밉니다. 통화 시간이 1분, 2분 넘어갑니다.",
      memo: ["2년 만의 부자 통화", "잘했다는 말과 묻지 못한 말"],
      choices: [
        {
          label: "휴대폰을 오진우 손에 다시 쥐여 준다",
          effect: { trust: 10, humanCost: -5, time: -4, fatigue: 4 },
          voice: "이 대답은 대신 해 줄 수 없다며, 휴대폰을 오진우 손에 다시 쥐여 준다.",
          echo: "손에 쥐여 주면 그는 말해야 합니다. 첫마디는 '밥은 드셨어요'입니다.",
        },
        {
          label: "당신이 대신 인사하고 출석 날 뵙자고 한다",
          effect: { legitimacy: 5, trust: 2, time: -2, humanCost: 3, fatigue: 2 },
          voice: "오진우가 대답하지 못하고 휴대폰을 밀어 줘서, 내가 대신 인사하고 출석 날 뵙자고 한다.",
          echo: "대신 인사하면 통화는 부드럽게 끝납니다. 오진우가 하려던 말은 출석 날까지 미뤄집니다.",
        },
        {
          label: "잠깐 자리를 비켜 두 사람만 남긴다",
          effect: { time: 4, capital: 3, trust: -4, humanCost: 3, fatigue: -3 },
          voice: "부자 사이의 말에 남이 낄 자리는 없어서, 잠깐 자리를 비켜 두 사람만 남긴다.",
          echo: "자리를 비키면 계단참에는 오진우만 남습니다. 통화는 11분 동안 이어집니다.",
        },
      ],
    },
    {
      id: "c11_eve_reaction",
      after: "c11_eve",
      next: "c11_final",
      title: "불출석 사유서",
      speaker: "에코",
      text: "국회 게시판에 윤상혁의 불출석 사유서(증인이 나오지 못하는 이유를 적어 내는 문서)가 올라옵니다. 사유는 '싱가포르 투자 설명회 참석'. 에코가 한 줄을 겹쳐 띄웁니다. 그 설명회 주최 측의 공지입니다. '행사는 주최 측 사정으로 취소되었습니다.' 공지 날짜는 사흘 전입니다. '사유서는 이미 사라진 일정 위에 쓰였습니다. 이 사실을 언제 말하느냐가 7분의 모양을 정합니다.'",
      memo: ["사라진 일정 위에 쓰인 사유서", "7분 중 언제 꺼낼지"],
      choices: [
        {
          label: "질의 첫 1분에 취소 공지부터 꺼낸다",
          effect: { legitimacy: 11, trust: 5, capital: -6, time: -3, fatigue: 5 },
          voice: "빈 의자가 왜 비었는지부터 알려야 한다며, 질의 첫 1분에 취소 공지부터 꺼낸다.",
          echo: "첫 1분에 꺼내면 방의 공기가 바뀝니다. 남은 6분은 전부 그 빈 의자를 위한 시간이 됩니다.",
        },
        {
          label: "의원실에 먼저 넘겨 의원이 묻게 한다",
          effect: { legitimacy: 7, trust: 3, time: -5, humanCost: 3, fatigue: 3 },
          voice: "내 답변 40초에 넣기에는 큰 사실이라, 취소 공지를 의원실에 먼저 넘겨 의원이 묻게 한다.",
          echo: "의원이 물으면 무게가 실립니다. 그 질문이 누구의 공이 될지는 의원실이 정합니다.",
        },
        {
          label: "사유서는 건드리지 않고 내 이야기에만 집중한다",
          effect: { time: 5, capital: 5, trust: 4, legitimacy: -7, humanCost: 3, fatigue: -3 },
          voice: "7분을 없는 사람에게 쓸 수는 없다며, 사유서는 건드리지 않고 내 이야기에만 집중한다.",
          echo: "당신 이야기는 온전히 남습니다. 사라진 일정은 다음 날 기사 한 줄로만 나옵니다.",
        },
      ],
    },
  ],
  branchPlan: ["c11_script", 1, "c11_branch_newsroom", "c11_branch_newsroom_follow"],
  branchScenes: {
    // CASE 11's detour is the newsroom. The case argues in scripts and camera
    // time; the side door is the one room where the evidence is on paper and a
    // cat is allowed to edit it.
    c11_branch_newsroom: {
      phase: "SIDE DOOR",
      title: "편집국의 밤",
      speaker: "서하린",
      text: "리드라인 편집국은 망원동 상가 건물 3층에 있습니다. 기자 열한 명, 고양이 한 마리. 서하린이 모니터 두 대를 돌려 제보 원본을 보여 줍니다. 3년 전 반대 의견서의 종이 사본, 그리고 그 뒷장에 연필로 적힌 한 줄. '반려 -- 윤. 사유는 묻지 말 것.' 제보자는 이름을 밝히지 않았지만, 서하린은 알 것 같다고 합니다. '이 필체, 당신도 아시죠. 회기동에서 헌책방 하시는 분.' 고양이가 키보드 위를 걸어가 기사 초안에 'ㅋㅋㅋㅋㅋ'를 입력합니다. 서하린이 지우지 않고 웃습니다. '이 기사에서 제일 정직한 문장이네요.'",
      memo: ["제보 원본: 반대 의견서 종이 사본과 뒷장 연필 메모", "메모: '반려 -- 윤. 사유는 묻지 말 것.'", "제보자 추정: 임경수", "KD 법무팀이 정정보도 청구를 예고함"],
      triggers: ["curiosity", "trust", "injustice"],
      choices: [
        {
          id: "c11_branch_newsroom_a",
          label: "제보자를 보호한다는 조건으로 원본 대조에 협조한다",
          effect: { trust: 11, legitimacy: 7, time: -6, capital: -4, fatigue: 4 },
          voice: "제보자를 보호한다는 조건을 걸고, 원본 대조에 협조하겠다고 한다.",
          echo: "원본이 맞으면 기사는 법정에서도 버팁니다. 제보자를 지킨다는 조건은 서하린이 지켜야 하는 약속이 됩니다.",
          next: "c11_branch_newsroom_follow",
          cognition: { inference: 2 },
        },
        {
          id: "c11_branch_newsroom_b",
          label: "원본은 못 본 것으로 하고 조용히 나온다",
          effect: { time: 6, capital: 6, trust: -7, legitimacy: -4, fatigue: -3 },
          voice: "원본은 못 본 것으로 하겠다며, 조용히 편집국을 나온다.",
          echo: "못 본 것으로 하면 당신은 안전합니다. 연필 메모 한 줄은 기자 혼자 지키게 됩니다.",
          next: "c11_branch_newsroom_follow",
          cognition: { risk: 1 },
        },
        {
          id: "c11_branch_newsroom_c",
          label: "임경수에게 먼저 전화해 공개해도 되는지 묻는다",
          effect: { trust: 13, humanCost: -5, time: -7, capital: -3, fatigue: 5 },
          voice: "공개는 제보한 사람이 정할 일이라며, 임경수에게 먼저 전화한다.",
          echo: "먼저 물으면 임경수는 선택할 수 있습니다. 전화 너머에서 그가 한참 웃다가 말합니다. '이제야 누가 묻는군.'",
          next: "c11_branch_newsroom_follow",
          cognition: { reframing: 2, persistence: 1 },
        },
      ],
    },
    c11_branch_newsroom_follow: {
      phase: "SIDE DOOR",
      title: "정정보도 청구서",
      speaker: "서하린",
      text: "밤 열한 시, KD금융그룹 법무팀의 정정보도(잘못된 기사를 고쳐 다시 싣게 하는 것) 청구서가 도착합니다. 요구는 하나입니다. '반려 -- 윤'의 '윤'이 윤상혁이라는 근거를 대라. 서하린이 청구서를 소리 내어 읽다가 멈춥니다. '근거는 있어요. 필적 감정(글씨를 과학적으로 비교하는 검사) 결과요. 그런데 그걸 내면 제보자가 누군지 법정에서 드러나요.' 창밖으로 막차 버스가 지나갑니다. 고양이는 청구서 위에서 잠들었습니다.",
      memo: ["정정보도 청구 회신 기한: 국정감사 전날", "필적 감정: '윤'은 윤상혁 필체와 일치할 가능성이 높음", "감정서를 내면 제보자 신원 노출 위험", "서하린: 기사를 내리는 선택지는 없다고 말함"],
      triggers: ["trust", "fear", "responsibility"],
      choices: [
        {
          id: "c11_branch_newsroom_follow_a",
          label: "필적 감정서는 내고 제보자 이름은 끝까지 가린다",
          effect: { legitimacy: 12, trust: 5, capital: -6, time: -5, fatigue: 5 },
          voice: "'윤'이 윤상혁이라는 근거를 대라는 청구라서, 필적 감정서는 내고 제보자 이름은 끝까지 가린다.",
          echo: "감정서가 나가면 '윤'은 윤상혁이 됩니다. 이름을 가린 제보자는 이제 법원이 궁금해하는 사람이 됩니다.",
          next: "c11_press",
          cognition: { inference: 2 },
        },
        {
          id: "c11_branch_newsroom_follow_b",
          label: "감정서 대신 내가 참고인석에서 그 메모를 직접 말한다",
          effect: { trust: 12, legitimacy: 6, humanCost: 4, time: -6, fatigue: 6 },
          voice: "감정서 대신, 그 메모를 참고인석에서 내가 직접 말하겠다고 한다.",
          echo: "당신이 말하면 제보자는 가려집니다. 대신 그 메모의 무게를 참고인석에서 혼자 받습니다.",
          next: "c11_press",
          cognition: { reframing: 2 },
        },
        {
          id: "c11_branch_newsroom_follow_c",
          label: "회신 기한까지 대응을 미루고 국정감사 뒤로 넘긴다",
          effect: { time: 7, capital: 5, legitimacy: -7, trust: -5, fatigue: -3 },
          voice: "출석을 앞두고 제보자를 드러낼 수는 없어서, 회신 기한까지 대응을 미루고 국정감사 뒤로 넘긴다.",
          echo: "미루면 오늘 밤은 조용합니다. 기한이 지난 청구는 국정감사 다음 날 아침 기사로 먼저 나옵니다.",
          next: "c11_press",
          cognition: { risk: 1 },
        },
      ],
    },
  },
  routePlan: {
    start: "c11_start",
    result: "c11_aftershock",
    defaultFree: "c11_route_system",
    // One hearing, one answer. Like 사건 10, the case is a single line to the
    // room; the split is what the analyst says in it, not where they go.
    choices: {},
    system: {
      route: "c11_route_system",
      final: "c11_final_system_route",
      title: "확인해 보겠습니다",
      speaker: "에코",
      text: "두 대본 가운데 하나를 고르는 대신 이 방에서 답이 어떻게 미뤄져 왔는지 묻자 에코가 지난 10년 정무위원회 국정감사(국회가 1년에 한 번 정부와 금융회사의 일을 공개적으로 따져 묻는 자리)의 속기록(회의에서 오간 말을 그대로 적은 공식 기록) 1,812건을 엽니다. 금융회사 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)이 받은 질문은 7,430개, 가장 많이 나온 답은 '확인해 보겠습니다'로 2,114번입니다. 그 약속 가운데 다음 해 국정감사에서 확인 결과가 실제로 보고된 건 3%입니다. '이 방은 진실을 묻는 곳이 아니라, 1년 동안 미룰 수 있는 문장을 고르는 곳으로 학습되어 있습니다.'",
      memo: ["지난 10년 속기록 1,812건", "'확인해 보겠습니다' 2,114번 -- 이행 보고 3%", "이 통계는 어떤 보고서에도 인용된 적 없음"],
      routeChoices: [
        {
          id: "c11_route_system_publish",
          label: "통계를 서하린에게 넘겨 기사로 만든다",
          effect: { legitimacy: 10, trust: 6, capital: -6, time: -8, fatigue: 5 },
          voice: "인용된 적 없는 숫자는 없는 숫자라며, 통계를 서하린에게 넘겨 기사로 만든다.",
          echo: "넘기면 기사는 출석 전에 나갑니다. 의원들은 자기 방의 통계를 기사로 먼저 읽고 회의장에 들어옵니다.",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c11_route_system_pledge",
          label: "내 답변에서만은 '확인해 보겠습니다'를 쓰지 않기로 한다",
          effect: { trust: 11, legitimacy: 7, humanCost: 3, time: -7, fatigue: 6 },
          voice: "2,114번에 한 번을 더 보태지 않으려고, 내 답변에서만은 '확인해 보겠습니다'를 쓰지 않기로 한다.",
          echo: "쓰지 않기로 하면 모르는 것은 모른다고 말해야 합니다. 40초짜리 답변에서 그 말은 생각보다 길게 들립니다.",
          cognition: { reframing: 2 },
        },
        {
          id: "c11_route_system_drop",
          label: "통계는 덮고 준비된 답변 틀을 따른다",
          effect: { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 },
          voice: "방 전체와 싸울 자리는 아니라며, 통계는 덮고 준비된 답변 틀을 따른다.",
          echo: "틀을 따르면 답변은 매끄럽습니다. 속기록에는 '확인해 보겠습니다'가 한 번 더 적힙니다.",
          cognition: { risk: 2 },
        },
      ],
      finalTitle: "미루지 않을 한 가지",
      finalText: "출석 당일 새벽, 실험 단말의 통계는 밤새 한 줄도 바뀌지 않았습니다. 가장 많이 나온 답은 '확인해 보겠습니다'였고, 다음 해에 확인 결과가 보고된 것은 3%입니다. 에코가 마지막 줄을 띄웁니다. '오늘 당신에게 돌아올 답변 시간은 평균 40초입니다. 그 안에 들어가는 말 가운데 내년으로 넘어가지 않는 것은 몇 개입니까.'",
      finalMemo: ["'확인해 보겠습니다' 2,114번 -- 이행 보고 3%", "참고인 답변 평균 40초", "출석까지 몇 시간"],
    },
    finalChoices: [
      {
        id: "a",
        label: "답변마다 확인 기한과 보고 날짜를 붙여 말한다",
        effect: { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 },
        voice: "미룰 수 없는 문장으로 만들려고, 답변마다 확인 기한과 보고 날짜를 붙여 말한다.",
        echo: "날짜를 붙이면 약속은 속기록에 기한과 함께 남습니다. 그날 가장 먼저 전화를 받는 사람은 당신입니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "b",
        label: "질문을 넘기고 통계는 기록에만 남긴다",
        effect: { capital: 9, time: 7, trust: -7, legitimacy: -8, humanCost: 5, fatigue: -5 },
        voice: "40초로는 다 말할 수 없다며, 질문을 넘기고 통계는 기록에만 남긴다.",
        echo: "질문은 넘어갑니다. 통계는 부록에 실리고, 부록을 여는 사람은 내년 국정감사를 준비하는 보좌관쯤입니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c",
        label: "내년 국정감사에 스스로 다시 나오겠다고 약속한다",
        effect: { legitimacy: 8, trust: 8, capital: -5, time: -7, humanCost: 3, fatigue: 9 },
        voice: "확인 결과를 들고 올 사람이 있어야 한다며, 내년 국정감사에 스스로 다시 나오겠다고 약속한다.",
        echo: "약속하면 방이 잠깐 조용해집니다. 제 발로 다시 오겠다는 참고인의 말은 그 방의 속기록에서 찾기 어렵습니다.",
        cognition: { persistence: 2 },
      },
    ],
  },
  evidencePlan: {
    node: "c11_evidence_turn",
    result: "c11_aftershock",
    sourceRoutes: ["c11_script", "c11_rehearsal", "c11_sign", "c11_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "3년 전 승인 시스템의 변경 기록을 단서로 불러, 반대 의견서의 상태가 바뀐 시각을 잡는다.",
    entryEcho: "변경 기록을 부르면 반려한 손과 지운 손이 같은 손이 아니었다는 게 드러납니다.",
    title: "다섯 시간 열두 분",
    speaker: "반재욱",
    text: "단서를 맞추자 3년 전 승인 시스템의 변경 기록이 열립니다. 한서윤의 반려 서명은 오후 1시 32분. 그런데 반대 의견서가 '보관'에서 '폐기'로 바뀐 건 저녁 6시 44분이고, 바꾼 계정은 당시 기업금융전략팀장 윤상혁입니다. 반려한 사람과 지운 사람은 다른 사람이었습니다. 반재욱이 수첩에 두 시각을 나란히 적습니다. '다섯 시간 열두 분. 그 사이에 누가 무엇을 결심했는지가 이 사건입니다.'",
    memo: ["반려 서명 13:32 -- 한서윤", "폐기 처리 18:44 -- 윤상혁 계정", "폐기 사유란: 공란"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 5, trust: 3, time: -4, fatigue: 4 },
    choices: [
      {
        id: "c11_evidence_turn_submit",
        label: "두 시각을 나란히 적은 기록을 의원실과 언론에 동시에 넘긴다",
        effect: { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 },
        voice: "한쪽에서 묻히지 않게, 두 시각을 나란히 적은 기록을 의원실과 언론에 동시에 넘긴다.",
        echo: "동시에 넘기면 어느 쪽도 먼저 묻을 수 없습니다. 두 시각 사이의 빈 시간이 내일 질의의 첫 질문이 됩니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c11_evidence_turn_hold",
        label: "기록은 쥐고 있다가 참고인석에서 직접 꺼낸다",
        effect: { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 },
        voice: "먼저 새면 해명할 시간을 준다며, 기록은 쥐고 있다가 참고인석에서 직접 꺼낸다.",
        echo: "참고인석에서 꺼내면 카메라 열두 대가 그 종이를 찍습니다. 그 전까지 한서윤은 자기가 지운 사람으로 남아 있습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c11_evidence_turn_share",
        label: "한서윤에게 먼저 보여 주고 그가 어떻게 할지 고르게 한다",
        effect: { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 },
        voice: "반려와 폐기가 다르다는 걸 본인이 먼저 알아야 한다며, 한서윤에게 먼저 보여 주고 어떻게 할지 고르게 한다.",
        echo: "먼저 보여 주면 한서윤이 두 시각을 오래 봅니다. 3년 동안 자기가 지웠다고 믿어 온 것이 반려까지였다는 것을 처음 압니다.",
        cognition: { reframing: 2 },
      },
    ],
    entryLabel: "반대 의견서가 폐기로 바뀐 시각을 잡아낸다",
  },
  memoryPlan: {
    systemNext: "c11_route_system",
    evidenceNext: "c11_evidence_turn",
    systemLabel: "분담표 앞에서 다시 짠 판이 그룹 입장문에 옮겨졌는지 대 본다",
    evidenceLabel: "사유란의 기본값을 바꾼 부서를 반대 의견서의 폐기 기록에서 찾아본다",
    systemEcho: "대 보면 그룹 입장문은 당신의 판단을 '개인적 판단'이라는 말로 옮겨 적었습니다. 미룰 수 있는 문장을 고르는 법이 그 안에 있습니다.",
    evidenceEcho: "그 부서를 찾아보면 3년 전 승인 시스템의 변경 기록이 열립니다. 반려와 폐기 사이에 시각이 하나 더 찍혀 있습니다.",
  },
  openingRoutes: {
    c10_after_rest: "c11_start_rest",
    c10_after_record: "c11_start_record",
    c10_after_keep: "c11_start_keep",
  },
  openingCopy: {
    c11_start_rest: ["불을 끈 사람의 기사", "한서윤", "여섯 명을 정시에 퇴근시킨 그 주말 이후 3주, 분담표는 느리지만 멈추지 않고 돌았습니다. 그리고 월요일 새벽 여섯 시, 리드라인에 기사가 올라옵니다. 쉬어 본 사람들은 이번 주를 버틸 힘이 있습니다. 문제는 그 힘을 누구 이름으로 쓰느냐입니다.", ["분담표 3주 처리 102건", "리드라인 기사: 익명의 반대 의견 작성자 A씨", "출석까지 5일"]],
    c11_start_record: ["제도를 남긴 사람의 기사", "에코", "분담표가 그룹 제도안으로 접수된 지 3주 뒤, 그룹 홍보실이 그 제도안을 '선제적 피해 구제 모범 사례'로 보도자료에 넣었습니다. 같은 날 새벽 리드라인 기사가 올라왔습니다. 당신이 만든 제도가 이제 그룹이 당신을 반박하는 근거가 됐습니다.", ["그룹 보도자료: 분담표를 모범 사례로 인용", "리드라인 기사: 익명의 반대 의견 작성자 A씨", "출석까지 5일"]],
    c11_start_keep: ["서랍을 닫지 않은 사람의 기사", "반재욱", "212명의 명단은 아직 당신 서랍에 있습니다. 리드라인 기사가 올라온 날, 그룹 법무팀은 '비공식 명단을 보관한 직원'을 조사하겠다고 공지합니다. 서랍 속 명단이 이제 당신을 겨누는 증거가 될 수 있습니다.", ["법무팀 공지: 비공식 명단 보유 직원 조사", "212명 명단 개인 보관 중", "출석까지 5일"]],
  },
  openingSignatures: {
    c11_start_rest: {
      label: "분담표 여섯 명에게 출석 준비도 칸을 나눠 맡긴다",
      effect: { trust: 11, humanCost: -5, capital: -4, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "분담표처럼, 출석 준비도 여섯 명이 칸을 나눠 맡자고 한다.",
      echo: "나눠 맡으면 닷새가 버틸 만해집니다. 준비한 답이 여섯 사람의 문장이 되면, 누구의 말인지 흐려질 수도 있습니다.",
    },
    c11_start_record: {
      label: "보도자료가 잘라 쓴 제도안 원문을 기자에게 먼저 보낸다",
      effect: { legitimacy: 12, trust: -3, capital: -5, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "그룹이 제도안을 나를 반박하는 근거로 써서, 보도자료가 잘라 쓴 제도안 원문을 기자에게 먼저 보낸다.",
      echo: "원문이 나가면 모범 사례라는 말은 힘을 잃습니다. 그룹은 그 제도안을 만든 사람이 누구인지 다시 확인합니다.",
    },
    c11_start_keep: {
      label: "조사 전에 서랍의 212명 명단을 도윤하에게 돌려준다",
      effect: { trust: 13, humanCost: -5, legitimacy: -5, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "명단이 나를 겨누는 증거가 될 수 있어서, 조사 전에 서랍의 212명 명단을 도윤하에게 돌려준다.",
      echo: "돌려주면 당신 서랍은 비고, 조사는 빈 서랍을 봅니다. 그 명단의 무게는 다시 한 사람에게 갑니다.",
    },
  },
  setting: { place: "트리거랩 4층 분석관실 · 속보 화면", clock: "국정감사까지 D-5" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 11
    c11_start: {
      place: "트리거랩 4층 분석관실 · 속보 화면",
      clock: "국정감사까지 D-5",
      question: "3년 전 사라진 반대 의견이 기사가 됐고, 기사 속 A씨는 당신입니다. 누구에게 먼저 말하겠습니까?",
      lead: "월요일 새벽 여섯 시, 분석관실 벽의 속보 화면에 당신이 쓴 문장 하나가 인용돼 있습니다.",
    },
    c11_start_rest: {
      place: "트리거랩 4층 분석관실 · 속보 화면",
      clock: "국정감사까지 D-5",
      question: "쉬어 본 여섯 사람이 이번 주를 버틸 힘이 있습니다. 그 힘을 누구 이름으로 쓰겠습니까?",
      lead: "분담표가 3주째 도는 사무실입니다. 오늘 아침은 모두가 같은 기사를 보고 있습니다.",
    },
    c11_start_record: {
      place: "트리거랩 4층 분석관실 · 속보 화면",
      clock: "국정감사까지 D-5",
      question: "당신이 만든 제도가 그룹의 모범 사례로 쓰였습니다. 그 제도를 어떻게 되찾겠습니까?",
      lead: "그룹 보도자료와 리드라인 기사가 같은 날 아침 나란히 떴습니다.",
    },
    c11_start_keep: {
      place: "트리거랩 4층 분석관실 · 속보 화면",
      clock: "국정감사까지 D-5",
      question: "법무팀이 비공식 명단을 가진 직원을 조사한다고 합니다. 서랍 속 212명을 어떻게 하겠습니까?",
      lead: "기사가 뜬 날 오후, 법무팀 공지가 전 직원 메일함에 도착했습니다.",
    },
    c11_script: {
      place: "국회 의원회관 7층 · 정무위원회 의원실",
      clock: "국정감사까지 D-4",
      question: "두 대본이 모두 당신이 증명할 수 없는 문장으로 끝납니다. 무엇을 들고 나가겠습니까?",
      lead: "처음 들어가 본 의원회관은 복도마다 형광 포스트잇이 붙어 있습니다.",
    },
    c11_branch_newsroom: {
      place: "망원동 리드라인 편집국",
      clock: "국정감사까지 D-4 · 21시",
      question: "반대 의견서 뒷장에 '반려 -- 윤'이라는 연필 메모가 있습니다. 이 원본을 어떻게 하겠습니까?",
    },
    c11_branch_newsroom_follow: {
      place: "망원동 리드라인 편집국",
      clock: "국정감사까지 D-4 · 23시",
      question: "근거를 내면 제보자가 드러납니다. 정정보도 청구에 어떻게 답하겠습니까?",
    },
    c11_press: {
      place: "국회 의원회관 앞 편의점 · 창가 자리",
      clock: "국정감사까지 D-4 · 22시",
      question: "틀린 기사가 당신을 조금 더 숨겨 줍니다. 고치겠습니까, 두겠습니까?",
    },
    c11_press_reaction: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "국정감사까지 D-3",
      question: "당신 대신 드러난 얼굴은 도윤하입니다. 무엇부터 하겠습니까?",
    },
    c11_rehearsal: {
      place: "회기동 헌책방 2층 · 장부 더미",
      clock: "국정감사까지 D-2",
      question: "웃음이 가라앉은 자리에서 이민서가 자기 이름도 나오냐고 묻습니다. 어떻게 답하겠습니까?",
      lead: "사과 상자 세 개로 의원석을 만들었습니다. 참고인석은 임경수의 낡은 독서대입니다.",
    },
    c11_father: {
      place: "회기동 헌책방 2층 · 계단참",
      clock: "국정감사까지 D-2 · 밤",
      question: "방청 신청 명단에 오진우의 아버지 이름이 있습니다. 이 일을 어떻게 하겠습니까?",
    },
    c11_father_reaction: {
      place: "회기동 헌책방 앞 골목",
      clock: "국정감사까지 D-2 · 밤",
      question: "2년 만에 아버지가 먼저 전화했고, 오진우는 대답을 못 합니다. 어떻게 하겠습니까?",
    },
    c11_sign: {
      place: "트리거랩 옥상",
      clock: "출석 전날 23:40",
      question: "반려 서명을 한 사람이 그 통화 녹음을 내밉니다. 이 파일을 어떻게 하겠습니까?",
      lead: "출석 전날 밤, 한서윤이 옥상으로 불렀습니다. 바람이 세서 난간 쪽으로는 아무도 가지 않습니다.",
    },
    c11_eve: {
      place: "국회 앞 · 새벽 횡단보도",
      clock: "출석 3시간 전 · 06:40",
      question: "오늘 도윤하의 이름도 판 사람으로 나올 겁니다. 그 이름을 어떻게 받겠습니까?",
    },
    c11_eve_reaction: {
      place: "국회 본관 · 복도",
      clock: "출석 1시간 전",
      question: "불출석 사유서는 이미 취소된 일정 위에 쓰였습니다. 이 사실을 언제 말하겠습니까?",
    },
    c11_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "국정감사까지 D-1",
      question: "이 방에서 가장 많이 나온 답은 '확인해 보겠습니다'였습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c11_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "국정감사 당일 · 새벽",
      question: "미룰 수 있는 문장을 고르는 방에서, 당신은 무엇을 미루지 않겠습니까?",
    },
    c11_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 승인 기록",
      clock: "국정감사 당일 · 07시",
      question: "반려한 사람과 지운 사람이 달랐습니다. 이 두 시각을 어떻게 쓰겠습니까?",
    },
    c11_final: {
      place: "국회 본관 정무위원회 회의실 · 참고인석",
      clock: "질의 7분 중 4분 남음",
      question: "누가 반대 의견을 지웠느냐는 질문에 남은 4분이 있습니다. 무엇을 말하겠습니까?",
      lead: "참고인석에 앉기 전, 방청석 맨 앞줄의 트리거랩 동료 일곱 명과 한 번씩 눈이 마주쳤습니다.",
    },
    c11_aftershock: {
      place: "여의도 한강공원 앞 · 포장마차",
      clock: "국정감사 당일 · 22시",
      question: "모두가 웃는 밤에 33층이 당신을 부릅니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c11-two-timestamps",
    title: "다섯 시간 열두 분",
    text: "반려 서명은 13:32, 폐기 처리는 18:44였습니다. 반려한 사람과 반대 의견을 지운 사람은 같은 사람이 아니었습니다.",
  },
  outcomes: {
    c11_after_toast: { tag: "같이 먹은 결말", title: "휴대폰은 밤새 울렸고 아무도 뒤집지 않았다", text: "그날 밤 여섯 사람은 처음으로 같은 테이블에서 끝까지 웃었습니다. 33층의 호출은 다음 날 아침까지 기다려야 했습니다." },
    c11_after_record: { tag: "기록으로 남긴 결말", title: "잘리지 않은 7분이 누구나 읽는 문서가 되었다", text: "속기록 전문이 공개됐습니다. 당신이 더듬은 12초도, 그룹이 인용할 한 문장도 그대로 남았습니다." },
    c11_after_summon: { tag: "바로 응한 결말", title: "포장마차를 먼저 나와 33층으로 향했다", text: "당신은 가장 먼저 호출에 답했습니다. 테이블에는 떡볶이 한 접시와 당신 몫의 빈 의자가 남았습니다." },
  },
  carryovers: {
    c11_after_toast: { trust: 9, humanCost: -4, fatigue: -8 },
    c11_after_record: { legitimacy: 12, trust: 2, fatigue: 5 },
    c11_after_summon: { capital: 6, legitimacy: 4, trust: -8 },
  },
  continuityChallenges: {
    c10_after_rest: { id: "protect-trust", title: "쉬어 본 사람들과 함께 말하기", text: "여섯 명은 이번 주를 버틸 힘이 있습니다. 그 힘을 한 사람의 발언이 아니라 여섯 사람의 문장으로 쓰는 선택을 찾아야 합니다." },
    c10_after_record: { id: "use-reframe", title: "빼앗긴 제도를 되찾기", text: "당신이 만든 제도가 그룹의 모범 사례가 됐습니다. 그 제도가 누구의 것인지 판을 다시 짜면 숨은 단서가 열릴 수 있습니다." },
    c10_after_keep: { id: "repair-legitimacy", title: "서랍 속 명단을 떳떳하게 만들기", text: "조사는 서랍을 겨눕니다. 212명의 이름을 숨긴 기록이 아니라 지킨 기록으로 바꾸는 선택을 찾아야 합니다." },
  },
};
