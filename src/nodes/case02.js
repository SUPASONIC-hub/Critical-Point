/**
 * CASE 02 -- the authored scenes of the records case.
 *
 * The leak is the cover-up of 사건 01. What actually left the building was a
 * scan of the 플로우온 loan review -- the page with the empty signature box --
 * and the access logs that point at 이민서 were assembled by someone who needed
 * a name before the analyst asked whose name belonged in that box. She is a
 * contract worker up for renewal, which is the entire reason it is her.
 */
export const case02Nodes = {
  c2_start: {
    phase: "CASE 02 BRIEFING",
    title: "FALSE SIGNAL",
    speaker: "반재욱",
    text:
      "트리거랩 데이터 담당 이민서가 외부로 내부 자료를 넘긴 혐의로 지목됐습니다. 접속 기록, 전송 기록, 보안 알림이 모두 한 사람을 가리킵니다. 그런데 넘어갔다는 파일이 문제입니다. 플로우온 현장에서 당신이 열람을 신청했던 대출 심사 보고서 원본, 그중에서도 서명란이 비어 있는 3페이지입니다.",
    memo: [
      "유출 시각: 어젯밤 23:41",
      "접속 계정: 이민서 (계약직, 재계약 심사 2주 뒤)",
      "전송 파일: 2023-0412 심사 보고서 스캔 3p",
      "감사팀은 2시간 안에 1차 보고를 요구함",
    ],
    triggers: ["trust", "injustice", "responsibility"],
    choices: [
      {
        id: "c2_start_report",
        label: "로그 증거를 기준으로 1차 보고한다",
        effect: { time: -2, trust: -10, legitimacy: 8, fatigue: 2 },
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c2_start_meet",
        label: "이민서를 비공식적으로 먼저 만난다",
        effect: { time: -8, trust: 9, legitimacy: -6, fatigue: 2 },
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "c2_start_verify",
        label: "시스템 로그 원본을 재검증한다",
        effect: { time: -10, legitimacy: 3, fatigue: 2 },
        cognition: { inference: 2 },
      },
      {
        id: "reframe",
        label: "다른 가능성을 제안한다",
        type: "reframe",
        next: "c2_logs",
      },
    ],
  },
  c2_logs: {
    phase: "EVIDENCE",
    title: "너무 완벽한 기록",
    speaker: "에코",
    text:
      "기록이 지나치게 깔끔합니다. 접속, 내려받기, 전송, 삭제 시도가 11분 안에 이어졌고 실패한 흔적이 하나도 없습니다. 에코가 한 줄을 덧붙입니다. '이 형태는 사내 보안 교육 자료의 예시와 항목 순서까지 같습니다. 그 교육 자료를 만든 부서는 기업금융전략팀입니다. 능숙한 유출자이거나, 유출을 가르쳐 본 사람입니다.'",
    memo: [
      "삭제 시도는 실패했는데 실패 기록만 남음",
      "이민서의 평소 접속 패턴과 다름",
      "전송 대상 주소는 이미 폐쇄됨",
      "오진우가 같은 기록으로 보고서 초안을 쓰는 중",
    ],
    triggers: ["curiosity", "injustice", "competition"],
    choices: [
      {
        id: "c2_logs_verify",
        label: "로그 원본과 백업 로그를 대조한다",
        effect: { time: -12, legitimacy: 8, fatigue: 3 },
        cognition: { inference: 3, persistence: 1 },
      },
      {
        id: "isolate",
        label: "이민서의 접근 권한을 즉시 차단한다",
        effect: { trust: -12, legitimacy: 6, humanCost: 4, fatigue: 2 },
        cognition: { risk: 2 },
      },
      {
        id: "escalate",
        label: "한서윤에게 즉시 공유한다",
        effect: { time: -3, trust: 3, legitimacy: 5, fatigue: 2 },
        cognition: { risk: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c2_meeting: {
    phase: "HUMAN TRIGGER",
    title: "이민서의 말",
    speaker: "도윤하",
    text:
      "이민서는 그 시각에 응급실에 있었다고 말합니다. 진료 기록은 아직 확인 전입니다. 그는 사원증을 뒤집어 쥔 채 묻습니다. '제 재계약 심사가 2주 뒤입니다. 그 전에 이름이 올라가면, 나중에 아니라고 밝혀져도 계약은 끝나요. 기록이 저를 가리키면, 저는 이미 끝난 건가요?'",
    memo: [
      "응급실 방문 주장은 확인 전",
      "이민서는 플로우온 심사 보고서 스캔 정리 지시를 받았음",
      "지시한 사람 이름이 업무 메일에는 남아 있지 않음",
      "반재욱은 감정적 판단을 경계하라고 경고함",
    ],
    triggers: ["trust", "affection", "protection", "responsibility"],
    choices: [
      {
        id: "c2_meeting_meet",
        label: "이민서의 알리바이를 먼저 확인한다",
        effect: { time: -10, trust: 11, legitimacy: -2, fatigue: 2 },
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c2_meeting_report",
        label: "감정 개입을 피하고 공식 절차로 넘긴다",
        effect: { trust: -10, legitimacy: 7, humanCost: 5, fatigue: 2 },
        cognition: { risk: 1 },
      },
      {
        id: "c2_meeting_shadow",
        label: "공식 보고 전 대체 접속 가능성을 추적한다",
        effect: { time: -12, legitimacy: -4, humanCost: -3, fatigue: 4 },
        cognition: { reframing: 2, inference: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c2_pressure: {
    phase: "COUNTER PRESSURE",
    title: "오진우의 보고서",
    speaker: "오진우",
    text:
      "오진우는 이미 1차 결론을 냈습니다. 그의 보고서는 당신 것보다 빠르고 깔끔합니다. '증거가 충분한데 사람을 믿느라 시간을 쓰면, 다음 유출은 당신 책임입니다.' 그러고는 목소리를 낮춥니다. '저도 압니다. 계약직 하나로 닫으면 아무도 안 다친다는 게 이 조직의 계산이라는 것도요.'",
    memo: [
      "오진우 보고서: 이민서 단독 유출 가능성 높음",
      "한서윤은 30분 안에 당신의 판단을 요구함",
      "에코는 당신이 플로우온 때보다 오래 머물고 있다고 표시함",
      "대체 접속 가능성은 아직 증명되지 않음",
    ],
    triggers: ["competition", "trust", "responsibility"],
    choices: [
      {
        id: "c2_pressure_report",
        label: "오진우 보고서에 동의하고 사건을 종결한다",
        effect: { time: 5, trust: -14, legitimacy: 6, humanCost: 8, fatigue: 1 },
        cognition: { risk: 1 },
      },
      {
        id: "c2_pressure_verify",
        label: "30분 안에 반증 가능한 단서 하나만 더 찾는다",
        effect: { time: -10, trust: 5, legitimacy: 2, fatigue: 4 },
        cognition: { persistence: 2, inference: 2 },
      },
      {
        id: "c2_pressure_shadow",
        label: "오진우 보고서의 전제를 공격한다",
        effect: { time: -6, trust: -2, legitimacy: -2, fatigue: 4 },
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "reframe",
        label: "판을 바꿔 제안한다",
        type: "reframe",
      },
    ],
  },
};

/**
 * Everything else 사건 02 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case02 = {
  id: "case02",
  nodes: case02Nodes,
  aftermath: {
    c2_aftershock: {
      phase: "AFTERMATH",
      title: "누가 기록을 고쳤는가",
      speaker: "에코",
      text: "보고서가 올라간 뒤 원본 기록 한 줄이 사라졌습니다. 이민서를 지목한 기록과 당신이 고른 보고 방식이 같은 손에서 만들어졌을 가능성이 생겼습니다. 삭제 권한을 가진 세 계정 중 하나는 그룹전략실 소속입니다.",
      memo: ["원본과 복사본의 시각이 다름", "이민서 계정은 이미 잠김", "삭제 권한 계정 3개 중 1개는 그룹전략실"],
      triggers: ["trust", "curiosity", "injustice"],
      choices: [
        { id: "c2_after_audit", label: "원본 보관자부터 조사해 기록의 흐름을 복원한다", effect: { time: -7, legitimacy: 9, fatigue: 6 }, next: "case02_result", cognition: { inference: 2 } },
        { id: "c2_after_person", label: "이민서에게 직접 사라진 기록을 묻는다", effect: { trust: 9, legitimacy: -2, fatigue: 5 }, next: "case02_result", cognition: { persistence: 1, reframing: 1 } },
        { id: "c2_after_public", label: "기록 조작 가능성을 즉시 외부에 알린다", effect: { trust: -4, legitimacy: 15, capital: -8, fatigue: 8 }, next: "case02_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: [null, "c2_aftershock"],
  connectiveScenes: [
    {
      id: "c2_trace",
      after: "c2_logs",
      next: "c2_meeting",
      title: "사라진 11초",
      speaker: "임경수",
      text: "퇴직한 전 심사팀장이 헌책방 2층에서 끈으로 묶은 서류를 풀어 놓습니다. 접속 기록에는 11초의 빈틈이 있고, 그 11초에 바뀐 페이지가 그의 종이 사본에는 그대로 남아 있습니다. '전산은 고치면 그만이지만 종이는 태워야 하거든. 태운 자리는 표가 나고.'",
      memo: ["종이 사본에만 남은 3페이지 하단", "이민서 계정은 빈틈 직전에 사용됨", "보안팀은 빈틈을 단순 오류라고 주장함", "임경수는 이 사본을 4년째 보관 중"],
      choices: [
        {
          label: "11초를 기술적으로 재현한다",
          effect: { legitimacy: 8, time: -7, capital: -4, fatigue: 5 },
          voice: "그 11초에 무엇이 가능했는지 그대로 재현하겠습니다.",
          echo: "재현은 가능성을 보여주지만, 가능했다는 것과 했다는 것은 다릅니다.",
        },
        {
          label: "이민서에게 그 시간의 행동을 묻는다",
          effect: { trust: 7, legitimacy: 3, humanCost: -3, time: -5, fatigue: 4 },
          voice: "그 시간에 무엇을 했는지 이민서에게 직접 묻겠습니다.",
          echo: "직접 물으면 답은 빨라지고, 묻는 순간 그는 이미 용의자가 됩니다.",
        },
        {
          label: "오류로 처리하고 보고 시간을 지킨다",
          effect: { time: 6, capital: 4, legitimacy: -7, humanCost: 4, fatigue: -4 },
          voice: "단순 오류로 정리하고 보고 시간을 지키겠습니다.",
          echo: "지킨 마감은 오늘 조용하고, 오류로 닫은 11초는 다음 사건에서 다시 열립니다.",
        },
      ],
    },
    {
      id: "c2_witness",
      after: "c2_meeting",
      next: "c2_pressure",
      title: "이민서의 침묵",
      speaker: "도윤하",
      text: "이민서는 자신을 변호하지 않습니다. 대신 누가 그 파일을 받았는지보다, 왜 하필 서명란이 빈 3페이지만 정리하라는 지시가 내려왔는지부터 물어봅니다.",
      memo: ["스캔 정리 지시는 구두로만 내려옴", "지시받은 범위는 3페이지 한 장뿐", "이민서는 그 페이지를 읽지 않고 처리함", "재계약 심사까지 2주"],
      choices: [
        {
          label: "이민서의 안전을 먼저 확보한다",
          effect: { trust: 9, humanCost: -5, capital: -6, time: -4, fatigue: 5 },
          voice: "결론보다 이민서의 안전을 먼저 확보하겠습니다.",
          echo: "안전을 먼저 두면 조사는 느려지고, 그가 말할 수 있는 조건은 남습니다.",
        },
        {
          label: "파일의 이동 경로만 추적한다",
          effect: { legitimacy: 7, time: -7, humanCost: 2, fatigue: 5 },
          voice: "사람은 두고 파일이 지나간 경로만 따라가겠습니다.",
          echo: "경로만 보면 공정해 보이지만, 그 경로 끝에는 결국 사람이 서 있습니다.",
        },
        {
          label: "침묵을 의심 신호로 기록한다",
          effect: { time: 5, trust: -8, legitimacy: -2, humanCost: 5, fatigue: -3 },
          voice: "그의 침묵을 의심 신호로 기록에 남기겠습니다.",
          echo: "침묵을 신호로 적는 순간, 다음 사람은 말하지 않을 이유를 하나 더 얻습니다.",
        },
        {
          label: "이민서와 조건을 걸고 거래한다",
          effect: { capital: 7, trust: 5, legitimacy: -6, humanCost: 3, fatigue: 3 },
          voice: "지목된 사람과 조건을 걸고 거래하겠습니다.",
          echo: "거래는 답을 빨리 주지만 그 답의 값은 나중에 청구됩니다.",
        },
      ],
    },
    {
      id: "c2_judgment",
      after: "c2_pressure",
      next: "c2_final_evidence",
      title: "보고서 밖의 사람",
      speaker: "한서윤",
      text: "보안팀은 결론을 요구하지만, 이민서의 동료들은 보고서에 없는 사실을 알고 있습니다. 공식 기록과 사람의 기억 중 하나만 고를 수는 없습니다.",
      memo: ["동료 두 명이 익명 증언을 제출함", "1차 보고 마감까지 18분", "외부 기업은 유출 사실을 부인함"],
      choices: [
        {
          label: "익명 증언을 공식 부록으로 붙인다",
          effect: { legitimacy: 8, trust: 6, humanCost: -3, time: -6, fatigue: 6 },
          voice: "익명 증언을 공식 부록으로 보고서에 붙이겠습니다.",
          echo: "부록이 되면 증언은 기록이 되고, 익명은 그만큼 얇아집니다.",
        },
        {
          label: "기록에 없는 정보는 보류한다",
          effect: { time: 4, legitimacy: -4, trust: -5, humanCost: 5, fatigue: -3 },
          voice: "기록에 없는 것은 이번 보고에서 보류하겠습니다.",
          echo: "보류한 문장은 지워지지 않고, 보고서 밖에서 계속 돌아다닙니다.",
        },
        {
          label: "외부 기업과 먼저 대면한다",
          effect: { capital: 7, legitimacy: 3, trust: -3, humanCost: 2, time: -5, fatigue: 4 },
          voice: "결론을 내기 전에 외부 기업과 먼저 마주 앉겠습니다.",
          echo: "먼저 마주 앉으면 사실은 빨리 좁혀지고, 마감은 그만큼 뒤로 밀립니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c2_trace_reaction",
      after: "c2_trace",
      next: "c2_meeting",
      title: "11초 뒤의 접속",
      speaker: "에코",
      text: "빈틈을 재현하자 다른 계정이 깨어났습니다. 오류를 고치면 진실도 함께 사라질 수 있습니다.",
      memo: ["복원된 11초의 앞뒤 기록", "접근 권한을 다시 열 조건"],
      choices: [
        {
          label: "기록을 보존한 채 접근을 막는다",
          effect: { legitimacy: 8, capital: -4, time: -6, fatigue: 5 },
          voice: "기록을 그대로 두고 접근만 잠그겠습니다.",
          echo: "잠그는 일은 고치는 일이 아니지만 지울 수도 없게 만듭니다.",
        },
        {
          label: "계정을 따라가 원인을 확인한다",
          effect: { legitimacy: 5, trust: -3, humanCost: 2, time: -7, fatigue: 6 },
          voice: "그 계정이 무엇을 했는지 끝까지 따라가겠습니다.",
          echo: "계정을 따라가면 원인에 닿지만 사람에게도 닿습니다.",
        },
        {
          label: "전체 시스템을 초기화한다",
          effect: { time: 7, capital: -3, legitimacy: -7, humanCost: 6, fatigue: -5 },
          voice: "시스템을 초기화하고 처음부터 다시 세우겠습니다.",
          echo: "초기화는 오류와 함께 증거도 지웁니다.",
        },
      ],
    },
    {
      id: "c2_witness_reaction",
      after: "c2_witness",
      next: "c2_pressure",
      title: "보호받은 사람의 말",
      speaker: "반재욱",
      text: "이민서는 처음으로 자신이 보호받는 것이 두렵다고 말합니다. 보호는 때로 의심받을 기회를 빼앗습니다.",
      memo: ["보호와 침묵을 구분하는 절차", "당사자가 고를 수 있는 공개 범위"],
      choices: [
        {
          label: "이민서가 직접 말할 수 있는 절차를 만든다",
          effect: { trust: 8, legitimacy: 6, time: -6, fatigue: 7 },
          voice: "당사자가 직접 말할 절차를 만들겠습니다.",
          echo: "직접 말할 절차는 느리지만 그 진술은 대신 무너지지 않습니다.",
        },
        {
          label: "대신 진술해 위험을 줄인다",
          effect: { trust: 4, humanCost: -3, legitimacy: -3, capital: -4, fatigue: 5 },
          voice: "제가 대신 진술해 위험을 나누겠습니다.",
          echo: "대신 말하면 안전해지지만 그 사람의 말은 기록에서 사라집니다.",
        },
        {
          label: "보호를 해제하고 조사에 맡긴다",
          effect: { time: 6, trust: -7, humanCost: 6, fatigue: -6 },
          voice: "보호를 풀고 공식 조사에 맡기겠습니다.",
          echo: "보호를 푸는 순간 의심과 기회가 동시에 돌아옵니다.",
        },
      ],
    },
    {
      id: "c2_judgment_reaction",
      after: "c2_judgment",
      next: "c2_final_evidence",
      title: "익명성의 가격",
      speaker: "도윤하",
      text: "익명 증언을 붙이면 진실은 커지지만, 누구도 그 책임을 지지 않습니다. 보고서의 문장 하나가 사람들의 이름을 바꿀 수 있습니다.",
      memo: ["익명 증언의 검증 경로", "보고서 밖 목소리를 보존할 위치"],
      choices: [
        {
          label: "익명성을 지키며 증언의 한계를 쓴다",
          effect: { legitimacy: 8, trust: 5, time: -5, fatigue: 6 },
          voice: "익명을 지키고 그 한계를 함께 쓰겠습니다.",
          echo: "한계를 적은 증언은 약해 보이지만 반박에도 견딥니다.",
        },
        {
          label: "실명을 확인한 뒤 보고한다",
          effect: { legitimacy: 7, trust: -6, humanCost: 5, time: -6, fatigue: 4 },
          voice: "실명을 확인한 뒤에 보고하겠습니다.",
          echo: "실명은 보고서를 단단하게 하고 증언자를 얇게 만듭니다.",
        },
        {
          label: "증언을 빼고 기록만 제출한다",
          effect: { time: 6, legitimacy: -5, trust: -4, humanCost: 4, fatigue: -5 },
          voice: "증언을 빼고 기록만 제출하겠습니다.",
          echo: "빼기로 한 문장은 보고서 밖에서 계속 돌아다닙니다.",
        },
      ],
    },
  ],
  branchPlan: ["c2_meeting", 0, "c2_branch_records", "c2_branch_records_follow"],
  branchScenes: {
    c2_branch_records: {
      phase: "SIDE DOOR",
      title: "11초를 누구의 시간으로 볼 것인가",
      speaker: "반재욱",
      text: "기록 사이의 11초를 기술 오류로 닫을지, 누군가의 판단이 들어간 시간으로 열어둘지 선택해야 합니다.",
      memo: ["원본 로그의 공백", "접속 계정의 순서", "삭제 요청의 승인자"],
      triggers: ["curiosity", "trust"],
      choices: [
        { id: "c2_branch_records_a", label: "원본과 백업을 동시에 보존한다", effect: { legitimacy: 8, time: -8, capital: -5, fatigue: 4 }, next: "c2_branch_records_follow", cognition: { inference: 2 } },
        { id: "c2_branch_records_b", label: "접속자의 진술부터 확보한다", effect: { trust: 7, time: -6, legitimacy: 3, humanCost: -3, fatigue: 4 }, next: "c2_branch_records_follow", cognition: { persistence: 1 } },
        { id: "c2_branch_records_c", label: "오류로 표시하고 보고를 진행한다", effect: { time: 6, legitimacy: -7, humanCost: 4, fatigue: -4 }, next: "c2_branch_records_follow", cognition: { risk: 2 } },
      ],
    },
    c2_branch_records_follow: {
      phase: "SIDE DOOR",
      title: "복원된 기록의 주인",
      speaker: "한서윤",
      text: "복원된 기록에는 이름보다 먼저 책임을 미룬 순서가 남아 있습니다. 누가 말할 수 있게 할지도 기록의 일부입니다.",
      memo: ["복원 시각", "진술 순서", "보고서에 남길 원문"],
      triggers: ["injustice", "responsibility"],
      choices: [
        { id: "c2_branch_records_follow_a", label: "진술자에게 원문 확인 권한을 준다", effect: { trust: 7, legitimacy: 4, capital: -5, time: -4, fatigue: 5 }, next: "c2_final_system", cognition: { reframing: 1 } },
        { id: "c2_branch_records_follow_b", label: "원문을 첨부해 외부 검증을 연다", effect: { legitimacy: 9, capital: -5, time: -4 }, next: "c2_final_system", cognition: { inference: 2 } },
        { id: "c2_branch_records_follow_c", label: "보고서의 결론만 남긴다", effect: { time: 5, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -4 }, next: "c2_final_system", cognition: { risk: 1 } },
      ],
    },
  },
  evidencePlan: {
    node: "c2_evidence_turn",
    result: "c2_aftershock",
    sourceRoutes: ["c2_route_report", "c2_route_person", "c2_route_origin", "c2_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "유출 파일의 시각을 단서의 증언 시각과 맞세워, 이 일이 정말 한 사람의 짓인지 되묻는다.",
    entryEcho: "두 시각을 맞세우면 혐의의 주어가 사람에서 기록으로 옮겨 갑니다.",
    title: "보호된 증언이 기록을 뒤집는다",
    speaker: "이민서",
    text: "앞서 얻은 단서를 붙이자 유출 파일의 시간이 맞지 않습니다. 누가 말했는지보다 누가 말할 수 없게 만들었는지가 새 질문으로 떠오릅니다.",
    memo: ["증언 시간과 파일 생성 시간이 어긋남", "보호 조치가 오히려 증언자를 고립시킨 흔적", "다음 케이스의 점수판에 같은 시간 조작이 남아 있음"],
    triggers: ["protection", "injustice", "curiosity"],
    entryEffect: { trust: 4, legitimacy: 3, time: -3, fatigue: 3 },
    choices: [
      ["c2_evidence_turn_guard", "증언자의 열람권을 먼저 복구한다", { trust: 9, legitimacy: 5, capital: -6, time: -5, fatigue: 6 }, { reframing: 2 }],
      ["c2_evidence_turn_stamp", "시간 조작 증거를 외부 감사에 보낸다", { legitimacy: 10, trust: -2, capital: -7, time: -6, fatigue: 7 }, { inference: 2 }],
      ["c2_evidence_turn_delay", "증언을 늦추고 로그 복원부터 끝낸다", { time: -8, legitimacy: 7, trust: 3, fatigue: 6 }, { persistence: 2 }],
    ],
    entryLabel: "유출 기록에 찍힌 시각을 증언과 다시 맞춘다",
  },
  memoryPlan: {
    routeNext: "c2_route_person",
    systemNext: "c2_route_system",
    evidenceNext: "c2_evidence_turn",
    routeLabel: "직전 사건의 남은 약속을 이민서에게 먼저 확인한다",
    systemLabel: "플로우온에서 다시 짠 판이 유출 파일에 복제됐는지 뜯어본다",
    evidenceLabel: "숨은 급여표의 작성자를 유출 파일의 시각 옆에 세운다",
    routeEcho: "약속부터 확인하면 이민서는 기록보다 먼저 사람으로 불립니다. 보고서의 첫 줄은 그만큼 늦게 채워집니다.",
    systemEcho: "뜯어보면 유출 파일의 한 줄이 플로우온에서 당신이 다시 짠 판과 같은 순서로 적혀 있습니다. 혐의의 주어가 이민서에서 기록을 만든 쪽으로 옮겨 갑니다.",
    evidenceEcho: "급여표를 옆에 세우면 유출 파일이 만들어진 시각과 증언 시각이 어긋납니다. 누가 말했는지보다 누가 말을 막았는지가 먼저 남습니다.",
  },
  openingRoutes: {
    c1_after_people: "c2_start_people",
    c1_after_numbers: "c2_start_records",
    c1_after_silence: "c2_start_silence",
  },
  openingCopy: {
    c2_start_people: ["보호받은 사람의 다음 사건", "도윤하", "이민서가 유출자로 지목됐습니다. 하지만 당신은 지난 사건에서 사람의 목소리를 먼저 남겼습니다. 이번에는 그 목소리가 기록보다 먼저 당신을 찾아옵니다.", ["익명 증언 요청이 이미 들어옴", "이민서는 당신에게 직접 연락함", "보안팀은 보호 조치를 문제 삼음"]],
    c2_start_records: ["공개된 숫자의 다음 사건", "반재욱", "지난 사건에서 현금 흐름을 공개한 뒤, 누군가가 그 공개 자료를 이용해 내부 기록을 조작했습니다. 이번에는 숫자를 믿는 방식 자체가 시험됩니다.", ["공개 자료의 복사본이 세 개 존재", "유출 파일에 공개 수치가 포함됨", "기록 관리자는 책임을 부인함"]],
    c2_start_silence: ["침묵의 청구서", "한서윤", "지난 사건에서 공개를 늦춘 대가는 조용히 쌓였습니다. 이번 사건의 유출 파일에는 당신이 말하지 않았던 조건까지 담겨 있습니다.", ["유출 파일에 비공개 회의 문장 포함", "이민서가 가장 먼저 의심받음", "외부 기업은 이미 다음 행동을 준비함"]],
  },
  openingSignatures: {
    c2_start_people: {
      label: "지난 사건에서 보호한 사람에게 먼저 연락한다",
      effect: { trust: 8, humanCost: -4, legitimacy: -2, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      next: "c2_route_person",
      voice: "절차보다 먼저, 지난 사건에서 이름을 지켜준 사람에게 전화를 건다.",
      echo: "지난 보호가 이번 사건의 통로가 됩니다. 그 통로를 쓰는 순간 보호는 거래처럼 보이기도 합니다.",
    },
    c2_start_records: {
      label: "공개했던 수치를 기준선으로 삼아 조작 지점을 역추적한다",
      effect: { legitimacy: 7, capital: -3, time: -7, fatigue: 5 },
      cognition: { inference: 2 },
      next: "c2_route_origin",
      voice: "내가 공개한 숫자가 어디서 어긋났는지부터 거꾸로 짚는다.",
      echo: "공개한 숫자는 이제 비교 기준이 됩니다. 그 기준이 틀렸다면 이번 조사도 함께 무너집니다.",
    },
    c2_start_silence: {
      label: "말하지 않았던 조건을 내가 먼저 공개한다",
      effect: { legitimacy: 8, trust: 6, capital: -6, humanCost: -3, fatigue: 6 },
      cognition: { persistence: 2 },
      next: "c2_route_report",
      voice: "유출된 문서가 말하기 전에, 지난번 삼킨 조건을 내 입으로 꺼낸다.",
      echo: "미뤄둔 말을 스스로 꺼내면 주도권이 돌아옵니다. 왜 그때는 말하지 않았는지도 함께 묻게 됩니다.",
    },
  },
  voiceLines: {
    c2_start_verify: "너무 깔끔한 증거를 믿지 못하겠다는 표정으로 원본 로그를 요구한다.",
    c2_start_meet: "그 말이 위험하다는 것을 알면서도, 절차보다 먼저 얼굴을 보겠다고 말한다.",
    isolate: "무고할 가능성을 남겨둔 채, 접근 권한부터 끊자고 한다.",
    escalate: "내 손에서 해석권이 떠나는 걸 알면서도 상급자 공유를 택한다.",
    c2_meeting_shadow: "공식 기록 바깥으로 한 발 물러나, 조용히 다시 확인하자고 한다.",
    c2_branch_records_a: "어느 쪽도 지우지 않겠다는 듯, 원본과 백업을 동시에 보존하자고 한다.",
    c2_branch_records_b: "기록보다 사람의 말이 먼저 사라진다는 걸 알기에, 진술부터 확보한다.",
    c2_branch_records_c: "의심을 접어두고, 기술 오류로 표시한 채 보고를 진행한다.",
    c2_branch_records_follow_a: "진술한 사람이 자기 말의 주인이 되도록, 원문 확인 권한을 준다.",
    c2_branch_records_follow_b: "결론만 믿게 하지 않으려고, 원문을 첨부해 외부 검증을 연다.",
    c2_branch_records_follow_c: "복잡한 것을 다 걷어내고, 보고서에 결론만 남긴다.",
    c2_after_audit: "누가 기록을 만졌는지부터 밝히려고, 원본 보관자를 먼저 조사한다.",
    c2_after_person: "절차를 건너뛰는 위험을 알면서도, 이민서에게 직접 묻는다.",
    c2_after_public: "덮을 시간을 주지 않으려고, 조작 가능성을 즉시 밖에 알린다.",
    c2_start_report: "지금 가진 것이 로그뿐이라는 사실을 함께 적어, 1차 보고를 올린다.",
    c2_meeting_report: "지금 흔들리면 판단이 아니라 인상이 남는다며, 절차에 맡긴다.",
    c2_pressure_report: "더 끌어봐야 같은 결론이라는 말에, 서명란으로 손을 옮긴다.",
    c2_meeting_meet: "혐의보다 그 시간에 어디 있었는지부터 묻는다.",
    c2_logs_verify: "완벽한 기록일수록 사본을 봐야 한다며, 두 벌을 나란히 연다.",
    c2_pressure_verify: "결론을 뒤집을 것 하나만 찾겠다며, 남은 30분을 건다.",
    c2_pressure_shadow: "결론이 아니라 그 결론이 서 있는 전제를 겨눈다.",
    c2_start_people_report: "지난번엔 사람을 먼저 적었으니, 이번엔 기록부터 올려보겠다고 말한다.",
    c2_start_people_meet: "또 사람부터 만나는 사람이 되겠다며, 이민서에게 먼저 연락한다.",
    c2_start_people_verify: "보호가 감정이 아니었다는 걸 증명하려고, 원본 로그부터 다시 연다.",
    c2_start_records_report: "내가 공개한 숫자로 시작한 사건이니, 기록으로 끝내겠다고 말한다.",
    c2_start_records_meet: "숫자만으로는 알 수 없는 게 있다며, 이민서를 먼저 만난다.",
    c2_start_records_verify: "내가 낸 자료가 조작의 재료가 됐는지부터 확인한다.",
    c2_start_silence_report: "이번엔 늦지 않겠다며, 가진 것만으로 먼저 보고를 올린다.",
    c2_start_silence_meet: "말하지 않아 생긴 일이라며, 이번엔 당사자를 먼저 찾아간다.",
    c2_start_silence_verify: "숨긴 조건이 유출 파일에 있는지부터 원본으로 확인한다.",
    c2_evidence_turn_guard: "말할 사람이 자기 기록부터 볼 수 있어야 한다고, 열람권을 되돌린다.",
    c2_evidence_turn_stamp: "11초가 오류가 아니라는 증거를 밖으로 보낸다.",
    c2_evidence_turn_delay: "말이 기록보다 먼저 나가지 않게, 복원부터 끝낸다.",
  },
  echoReplies: {
    c2_start_verify:
      "로그는 강한 증거입니다. 다만 시스템이 기록한 사실과 사람이 실제로 한 행동은 항상 같은 것이 아닙니다.",
    c2_start_meet:
      "사람을 먼저 만나면 숨은 동기를 찾을 수 있습니다. 대신 증거 보존과 보고 의무를 늦춘 책임은 당신에게 남습니다.",
    isolate:
      "접근 권한 차단은 피해 확산을 막습니다. 그러나 무고한 사람이라면 당신이 먼저 처벌을 시작한 셈입니다.",
    escalate:
      "상급자 공유는 안전합니다. 동시에 사건 해석권을 넘기는 선택이기도 합니다.",
    c2_meeting_shadow:
      "비공식 재검증은 판을 넓힙니다. 하지만 절차 밖에서 움직인 순간, 당신의 판단도 조사 대상이 될 수 있습니다.",
    c2_branch_records_a:
      "둘 다 남기면 나중에 비교할 수 있습니다. 대신 지금 결론을 내려야 할 시간은 그만큼 줄어듭니다.",
    c2_branch_records_b:
      "진술은 맥락을 줍니다. 그러나 진술은 시간이 지날수록 기억이 아니라 해석으로 바뀝니다.",
    c2_branch_records_c:
      "오류로 닫으면 보고는 깔끔해집니다. 11초 동안 누가 무엇을 했는지는 영영 질문되지 않습니다.",
    c2_branch_records_follow_a:
      "확인 권한은 방어권입니다. 동시에 진술을 다듬을 기회이기도 합니다.",
    c2_branch_records_follow_b:
      "외부 검증은 당신의 판단을 단단하게 만듭니다. 그 검증은 당신의 절차도 함께 봅니다.",
    c2_branch_records_follow_c:
      "결론만 남기면 읽기 쉬워집니다. 대신 그 결론을 의심할 도구도 함께 사라집니다.",
    c2_after_audit:
      "보관자를 조사하면 흐름이 복원됩니다. 그 조사 대상 목록에 당신의 접근 기록도 들어 있습니다.",
    c2_after_person:
      "직접 묻는 것은 빠릅니다. 다만 이 대화 자체가 나중에 회유로 읽힐 수 있습니다.",
    c2_after_public:
      "즉시 공개는 은폐를 막습니다. 확증 없이 던진 의심은 무고한 사람을 먼저 태울 수도 있습니다.",
    c2_start_report:
      "기록만으로 쓴 보고는 빠릅니다. 그 보고가 사람의 이름을 먼저 굳힌다는 점은 남습니다.",
    c2_meeting_report:
      "절차는 공정해 보입니다. 다만 절차 안에서 이민서는 설명할 자리를 스스로 만들어야 합니다.",
    c2_pressure_report:
      "종결은 조직을 안정시킵니다. 그 안정의 값을 누가 냈는지는 보고서에 적히지 않습니다.",
    c2_meeting_meet:
      "알리바이를 먼저 보면 사람의 시간이 기록보다 앞섭니다. 그 순서가 뒤집히면 되돌리기 어렵습니다.",
    c2_logs_verify:
      "대조는 조작을 드러냅니다. 대조할 사본이 이미 같은 손을 거쳤다면 무엇도 드러나지 않습니다.",
    c2_pressure_verify:
      "30분은 반증에는 짧고 변명에는 충분합니다. 못 찾으면 동의한 것으로 기록됩니다.",
    c2_pressure_shadow:
      "전제를 흔들면 보고서 전체가 흔들립니다. 대신 다음 보고서를 쓸 사람도 당신이 됩니다.",
    c2_start_people_report:
      "지난 사건에서 사람을 먼저 세운 사람이 이번엔 기록을 먼저 냅니다. 그 전환을 팀도 봅니다.",
    c2_start_people_meet:
      "같은 방식을 두 번 쓰면 원칙이 됩니다. 원칙은 예측 가능해지고, 예측 가능한 것은 이용됩니다.",
    c2_start_people_verify:
      "지난번의 보호를 정당화하려면 이번 검증은 더 엄격해야 합니다. 그 부담은 당신 몫입니다.",
    c2_start_records_report:
      "공개한 숫자가 사건의 입구가 됐습니다. 같은 방식으로 닫으면 책임의 선이 분명해집니다.",
    c2_start_records_meet:
      "숫자를 공개한 사람이 사람을 만나러 가면, 조직은 그 전환의 이유를 묻습니다.",
    c2_start_records_verify:
      "자신이 공개한 자료를 의심하는 일은 느립니다. 그러나 그 순서를 건너뛰면 나머지 판단이 다 흔들립니다.",
    c2_start_silence_report:
      "지난번의 침묵이 이번의 속도를 만듭니다. 서두른 보고가 또 다른 침묵을 덮지 않도록 하십시오.",
    c2_start_silence_meet:
      "미룬 말은 사라지지 않고 상대에게 도착합니다. 지금 만나는 것은 사과가 아니라 순서의 수정입니다.",
    c2_start_silence_verify:
      "당신이 말하지 않은 것이 남의 손에 먼저 있습니다. 검증의 결과가 자신을 향할 수도 있습니다.",
    c2_evidence_turn_guard: "열람권이 돌아가면 진술은 방어가 아니라 검증이 됩니다.",
    c2_evidence_turn_stamp: "외부로 나간 증거는 되돌릴 수 없고, 조직의 대응도 되돌릴 수 없습니다.",
    c2_evidence_turn_delay: "복원된 로그는 진술을 지킵니다. 그동안 증언자는 혼자 기다립니다.",
  },
  setting: { place: "트리거랩 보안 감사실", clock: "1차 보고까지 2h" },
  sceneContext: {
    // ---------------------------------------------------------------- CASE 02
    // The three variants of a case opening. Which one plays is decided by how the
    // previous case closed, so each says the move -- the building left, the
    // building entered -- and names the decision it is the consequence of.
    c2_start_people: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고까지 2h",
      question: "지난 사건에서 사람을 먼저 지킨 당신에게, 이번엔 그 사람이 기록보다 먼저 찾아왔습니다. 누구의 말을 먼저 듣겠습니까?",
      lead: "플로우온 현장을 떠나 트리거랩 보안 감사실로 복귀한 아침입니다. 유출자로 지목된 이민서는 플로우온 심사 보고서 스캔을 정리하라는 지시를 받았던 계약직 동료입니다.",
    },
    c2_start_records: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고까지 2h",
      question: "당신이 공개한 자료로 누군가 내부 기록을 만졌습니다. 이번엔 숫자를 믿는 방식 자체를 어떻게 검증하겠습니까?",
      lead: "플로우온 현장을 떠나 트리거랩 보안 감사실로 복귀한 아침입니다. 유출된 파일은 당신이 공개했던 그 자료에서 출발했습니다.",
    },
    c2_start_silence: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고까지 2h",
      question: "미뤄 둔 공개의 청구서가 도착했습니다. 이번 유출 파일에 담긴 당신의 침묵을 어떻게 다루겠습니까?",
      lead: "플로우온 현장을 떠나 트리거랩 보안 감사실로 복귀한 아침입니다. 유출 파일에는 당신이 끝내 말하지 않았던 조건까지 들어 있습니다.",
    },
    c2_start: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고까지 2h",
      question: "재계약을 2주 앞둔 계약직 동료가 유출자로 지목됐고 기록은 전부 그를 가리킵니다. 2시간 뒤 보고에 무엇을 쓰겠습니까?",
      lead: "플로우온 현장에서 돌아온 다음 날 아침, 트리거랩 보안 감사실로 호출됐습니다. 유출된 파일은 플로우온 현장에서 당신이 열람을 신청했던 심사 보고서 원본이고, 그 스캔을 정리한 사람이 계약직 이민서입니다.",
    },
    c2_logs: {
      place: "트리거랩 보안 감사실 · 로그 단말",
      clock: "1차 보고까지 1h 40m",
      question: "기록이 지나치게 깔끔합니다. 이 기록을 증거로 믿겠습니까, 만들어진 것으로 의심하겠습니까?",
      lead: "감사실 단말에 어젯밤 23시 41분의 접속 기록이 그대로 떠 있습니다. 실패한 흔적이 하나도 없습니다.",
    },
    c2_meeting: {
      place: "트리거랩 3층 비공식 면담실",
      clock: "1차 보고까지 1h 10m",
      question: "이민서는 그 시각 응급실에 있었다고 말합니다. 알리바이를 먼저 확인하겠습니까, 절차로 넘기겠습니까?",
      lead: "감사실을 나와 3층 빈 회의실에서 이민서를 마주 앉습니다. 공식 면담 전 접촉이라 이 자리 자체가 기록에 남을 수 있습니다.",
    },
    c2_pressure: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고까지 30m",
      question: "오진우가 먼저 결론을 냈습니다. 그 보고서에 동의하겠습니까, 30분 안에 반증을 찾겠습니까?",
      lead: "면담을 마치고 감사실로 돌아오자 오진우의 보고서 초안이 이미 회람되고 있습니다.",
    },
    c2_trace: {
      place: "회기동 헌책방 2층",
      clock: "1차 보고까지 1h 30m",
      question: "접속 기록의 11초 공백에서 바뀐 페이지가, 퇴직한 심사팀장의 종이 사본에는 그대로 남아 있습니다. 그 시간을 기술 오류로 닫겠습니까, 판단이 들어간 시간으로 열겠습니까?",
      lead: "감사실을 빠져나와 전산에 남지 않는 기록을 찾아왔습니다. 임경수는 정년으로 퇴직했고, 그때 들고 나온 종이 서류를 아직 끈으로 묶어 두고 있습니다.",
    },
    c2_trace_reaction: {
      place: "트리거랩 보안 감사실 · 로그 단말",
      clock: "1차 보고까지 1h 20m",
      question: "11초를 재현하자 다른 계정이 깨어났습니다. 오류를 고치겠습니까, 증거를 그대로 두겠습니까?",
    },
    c2_witness: {
      place: "트리거랩 3층 비공식 면담실",
      clock: "1차 보고까지 55m",
      question: "이민서는 자신을 변호하지 않고 파일의 용도를 묻습니다. 그의 안전과 사건의 진행 중 무엇을 먼저 두겠습니까?",
    },
    c2_witness_reaction: {
      place: "트리거랩 3층 복도",
      clock: "1차 보고까지 45m",
      question: "이민서는 보호받는 것이 두렵다고 말합니다. 그가 직접 말할 절차를 만들겠습니까?",
    },
    c2_judgment: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고까지 18m",
      question: "동료 두 명이 익명 증언을 냈습니다. 기록에 없는 말을 보고서에 넣겠습니까?",
    },
    c2_judgment_reaction: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고까지 10m",
      question: "익명 증언은 진실을 키우지만 책임자는 없습니다. 익명을 지키겠습니까, 실명을 확인하겠습니까?",
    },
    c2_branch_records: {
      place: "트리거랩 보안 감사실 · 백업 서버실",
      clock: "1차 보고까지 1h",
      question: "원본과 백업이 다릅니다. 11초를 누구의 시간으로 기록하겠습니까?",
    },
    c2_branch_records_follow: {
      place: "트리거랩 보안 감사실 · 백업 서버실",
      clock: "1차 보고까지 50m",
      question: "기록이 복원됐습니다. 이 기록의 주인을 누구로 적겠습니까?",
    },
    c2_route_report: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고까지 1h 50m",
      question: "보고서를 먼저 올리기로 했습니다. 사람보다 빠른 절차를 어디까지 밀겠습니까?",
      lead: "로그 증거를 기준으로 1차 보고하겠다고 말한 직후입니다. 절차가 사람보다 먼저 움직이기 시작합니다.",
    },
    c2_route_person: {
      place: "트리거랩 3층 비공식 면담실",
      clock: "1차 보고까지 1h 50m",
      question: "기록보다 사람을 먼저 만나기로 했습니다. 이 만남을 어떻게 기록에 남기겠습니까?",
      lead: "이민서를 비공식적으로 먼저 만나겠다고 말한 직후입니다. 보안팀은 공식 면담 전 접촉을 문제 삼을 수 있습니다.",
    },
    c2_route_origin: {
      place: "트리거랩 보안 감사실 · 백업 서버실",
      clock: "1차 보고까지 1h 50m",
      question: "원본 로그가 재검증을 거부합니다. 이 거부 자체를 증거로 쓰겠습니까?",
      lead: "시스템 로그 원본을 재검증하겠다고 말한 직후입니다. 원본은 열리지만 같은 답을 두 번 내놓지 않습니다.",
    },
    c2_route_system: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고까지 1h 50m",
      question: "다시 짠 판이 로그를 깨웠습니다. 이 반응을 누구에게 보고하겠습니까?",
      lead: "보고서 셋 중 어느 것도 고르지 않은 채 판을 다시 짜자 로그 시스템이 먼저 반응했습니다.",
    },
    c2_final_evidence: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고 직전",
      question: "절차가 범인을 만들었습니다. 이 보고서를 그대로 올리겠습니까?",
    },
    c2_final_person: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고 직전",
      question: "보호는 누구의 목소리를 지웠습니까? 이민서의 말을 어떤 형태로 남기겠습니까?",
    },
    c2_final_system: {
      place: "트리거랩 보안 감사실",
      clock: "1차 보고 직전",
      question: "범인이 아니라 설계자가 보입니다. 개인 혐의와 시스템 조작 중 무엇을 공식화하겠습니까?",
    },
    c2_evidence_turn: {
      place: "트리거랩 3층 비공식 면담실",
      clock: "1차 보고까지 35m",
      question: "보호된 증언이 기록을 뒤집습니다. 이민서의 말을 증거로 올리겠습니까?",
    },
    c2_aftershock: {
      place: "트리거랩 보안 감사실",
      clock: "보고 다음 날 새벽",
      question: "보고 뒤 원본 로그 한 줄이 사라졌습니다. 이 삭제를 누구에게 묻겠습니까?",
      lead: "사건은 닫혔는데 기록이 움직였습니다. 이민서를 지목한 기록과 당신의 보고 방식이 같은 손에서 나왔을 가능성이 생겼습니다.",
    },
  },
  clue: {
    id: "c2-false-timestamp",
    title: "어긋난 시간",
    text: "유출 기록의 시간이 서로 맞지 않습니다. 범인보다 기록을 만든 사람이 더 중요할 수 있습니다.",
  },
  outcomes: {
    c2_after_audit: { tag: "기록을 복원한 결말", title: "사라진 11초가 증거가 되었다", text: "범인을 바로 정하지 않고 기록의 흐름을 복원했습니다. 진실은 느려졌지만, 누군가의 이름을 성급히 고정하지 않았습니다." },
    c2_after_person: { tag: "사람을 만난 결말", title: "보호는 의심받을 권리도 남겼다", text: "이민서는 스스로 말할 수 있었고 사건은 더 복잡해졌습니다. 대신 다음 판단은 사람의 맥락을 지우기 어려워집니다." },
    c2_after_public: { tag: "즉시 공개한 결말", title: "경보가 사건보다 먼저 퍼졌다", text: "외부의 눈이 사건을 감시하기 시작했습니다. 책임은 분명해졌지만, 아직 확인되지 않은 사실도 함께 퍼졌습니다." },
  },
  carryovers: {
    c2_after_audit: { time: -5, legitimacy: 6, fatigue: 3 },
    c2_after_person: { trust: 6, humanCost: -2, fatigue: 5 },
    c2_after_public: { capital: -5, legitimacy: 8, trust: -3, fatigue: 4 },
  },
  continuityChallenges: {
    c1_after_people: { id: "protect-trust", title: "보호를 기록으로 만들기", text: "지난 사건처럼 사람을 먼저 보되, 이번에는 보호의 근거까지 기록하면 숨은 단서가 열릴 수 있습니다." },
    c1_after_numbers: { id: "find-cost", title: "숫자 뒤의 사람 찾기", text: "공개한 숫자가 누구에게 어떤 부담을 옮겼는지 찾으면 숨은 단서가 열릴 수 있습니다." },
    c1_after_silence: { id: "repair-legitimacy", title: "늦은 설명 되찾기", text: "지난 사건의 침묵으로 흔들린 공정함을 회복하는 선택이 다음 압박을 낮춥니다." },
  },
};
