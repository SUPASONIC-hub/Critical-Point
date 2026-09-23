/**
 * PROLOGUE 01 -- the smallest case in the season, and the one everything else
 * grows out of.
 *
 * October 2022. The analyst is three months into probation at KD Bank's
 * corporate finance strategy team, with a desk between the copier and the
 * window and no nameplate on it. The last probation task is a 380-million-won
 * facility loan a branch has already cleared on its own authority: eleven
 * people, two packing machines from 1998, a delivery contract that starts on
 * the first of November. The file is clean. The debt column is not. One line --
 * a 40-million-won credit-union loan taken in July to make payroll -- is
 * missing from the total, and putting it back moves the debt ratio from 178.4%
 * to 184.7%, across the 180% line that decides whether a branch may approve
 * the loan by itself or whether head office has to. Eighteen working days,
 * says the average. The contract starts in fourteen.
 *
 * Three things happen in this chapter and nothing else does. The analyst turns
 * out to be a person who cannot walk past a number that does not add up. 오진우
 * -- a 대리 here, not yet a rival -- explains for the first time why he is the
 * way he is: his father 오상철 took one extra day on an exception approval in
 * 2009, the client went to another bank, and three months later he was moved to
 * the branch's general affairs desk. "여기서 늦은 사람은 틀린 사람이야." And the
 * organisation shows, in miniature, how it handles a dissenting number: the
 * team praises the probationer for finding it, the file goes down to the branch
 * unchanged, and the probation evaluation form ends up with one box filled in
 * -- 속도 -- and the assessor's signature line left blank. 윤상혁 starts that
 * habit on this page. 한서윤 walks past the blank box and says one sentence.
 * 임경수 keeps the paper. 반재욱's notebook is on its first page.
 *
 * The final is where the 40 million goes: on the record under the analyst's own
 * name, on the record under the mentor's, or nowhere, spoken aloud and gone.
 * Nobody dies and nobody is fired. The one thing the analyst learns here is the
 * thing that makes them stop, three years later, in front of 2023-0412.
 */
export const prologue01Nodes = {
  p1_start: {
    phase: "PROLOGUE 01 BRIEFING",
    title: "수습 마지막 과제",
    speaker: "오진우",
    text:
      "2022년 10월 17일 월요일 아침 아홉 시, 본점 12층 기업금융전략팀입니다. 수습 3개월차인 당신 책상은 복사기와 창문 사이에 있고 명패는 아직 없습니다. 오진우 대리가 서류철 하나를 내려놓습니다. 강서지점이 올린 온새포장 시설자금(기계나 설비를 사는 데 쓰는 돈) 대출 3억 8,000만 원, 승인 예정일은 이번 주 목요일입니다. '수습 마지막 과제야. 지점 한도 안에서 끝나는 건이라 숫자만 맞춰 보면 돼.' 서류는 깨끗합니다. 그런데 요약표에 적힌 부채 합계 11억 4,200만 원 아래 항목을 하나씩 더해 보면 11억 8,200만 원이 나옵니다. 4,000만 원짜리 차입금 한 줄이 합계에 들어가 있지 않고, 그 한 줄을 넣으면 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)이 178.4%에서 184.7%로 올라갑니다. 지점이 스스로 승인할 수 있는 선은 180%입니다. 당신은 그 줄에 연필로 점을 하나 찍고 한참 봅니다.",
    memo: [
      "온새포장 시설자금 대출 3억 8,000만 원 -- 강서지점 접수",
      "요약표 부채 합계 11억 4,200만 원 / 항목을 더한 합 11억 8,200만 원",
      "빠진 한 줄: 2022년 7월 차입금 4,000만 원",
      "지점 자체 승인 한도 -- 부채비율 180% 미만",
    ],
    triggers: ["curiosity", "order", "recognition"],
    choices: [
      {
        id: "p1_start_source",
        label: "강서지점 담당자에게 직접 전화해 숫자를 탓하지 않고 먼저 묻는다",
        effect: { trust: 10, humanCost: -3, time: -6, capital: -2, fatigue: 4 },
        next: "p1_counter",
        cognition: { persistence: 2 },
      },
      {
        id: "p1_start_note",
        label: "합계가 4,000만 원 어긋난다는 사실을 검토 기록에 먼저 적어 둔다",
        effect: { legitimacy: 11, trust: -2, time: -5, humanCost: 2, fatigue: 3 },
        next: "p1_counter",
        cognition: { inference: 2 },
      },
      {
        id: "p1_start_draft",
        label: "요약표 숫자대로 초안을 끝내고 어긋난 합계는 뒤로 미룬다",
        effect: { capital: 8, time: 6, legitimacy: -5, trust: 2, humanCost: 3, fatigue: -2 },
        next: "p1_counter",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p1_counter",
      },
    ],
  },
  p1_counter: {
    phase: "BRANCH FLOOR",
    title: "4번 창구 옆",
    speaker: "정해린",
    text:
      "다음 날 오전 열 시, KD은행 강서지점 객장입니다. 입구 옆 실적판에는 이달 판매 순위가 붙어 있고 1위 칸 옆에 '이달의 판매왕' 스티커가 세 장 겹쳐 있습니다. 4번 창구에서는 젊은 행원이 손님에게 상품을 설명하고 있습니다. '원금이 보장되는 건 아니고요.' 잠깐 멈췄다가 덧붙입니다. '그래도 요즘 다들 하세요.' 당신은 그 말을 들으며 지나갑니다. 이름은 묻지 않습니다. 대출 담당 자리 앞에는 온새포장 대표 정해린이 추가 서류를 들고 앉아 있습니다. 4,000만 원짜리 한 줄을 묻자 그가 바로 압니다. '7월에 새봄신협에서 빌린 거예요. 직원 열한 명 월급 주려고요.' 세무사가 보내 준 요약표에는 그 칸이 아예 없었고, 회계 원장(거래를 하나하나 적어 둔 원래 장부)에는 상환(빌린 돈을 갚는 일) 일정까지 그대로 적혀 있습니다.",
    memo: [
      "강서지점 실적판 -- '이달의 판매왕' 스티커 3장",
      "새봄신협 차입금 4,000만 원 -- 2022년 7월, 임금 지급용",
      "요약표 부채 칸 5개 -- 상호금융 차입금 칸 없음",
      "온새포장 직원 11명 · 11월 1일 납품 시작",
    ],
    triggers: ["curiosity", "protection", "order"],
    choices: [
      {
        id: "p1_counter_explain",
        label: "정해린 대표에게 이 4,000만 원이 왜 중요한지 끝까지 설명한다",
        effect: { trust: 11, humanCost: -4, capital: -3, time: -5, fatigue: 5 },
        next: "p1_mentor",
        cognition: { persistence: 2 },
      },
      {
        id: "p1_counter_request",
        label: "지점 대출 담당에게 요약표 대신 원장 사본을 정식으로 요청한다",
        effect: { legitimacy: 11, trust: 4, time: -6, humanCost: 3, fatigue: 4 },
        next: "p1_mentor",
        cognition: { inference: 2 },
      },
      {
        id: "p1_counter_return",
        label: "원장은 나중에 받기로 하고 오늘 본 것만 들고 돌아간다",
        effect: { capital: 7, time: 5, trust: -3, legitimacy: 2, humanCost: 3, fatigue: -3 },
        next: "p1_mentor",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p1_mentor",
      },
    ],
  },
  p1_mentor: {
    phase: "MENTOR",
    title: "늦은 사람이 틀린 사람",
    speaker: "오진우",
    text:
      "수요일 밤 아홉 시, 12층에는 두 자리만 불이 켜져 있습니다. 오진우가 편의점 커피 두 개를 들고 와 하나를 내밉니다. 그가 모니터를 당신 쪽으로 돌립니다. 18영업일. 이 건이 본점 대출심사팀으로 넘어가면 걸리는 평균 시간입니다. '자네가 맞아. 184.7%야. 그런데 그 숫자를 적으면 온새포장은 11월 1일을 못 맞춰.' 그가 커피를 한 모금 마시고 처음으로 자기 이야기를 합니다. 2009년, 부천 원미지점 대출 담당 차장이던 그의 아버지 오상철은 예외 승인(규정에서 벗어나지만 윗선이 따로 허락해 주는 것) 건 하나를 하루 늦춰 처리했습니다. 그 하루 사이에 거래처가 다른 은행으로 옮겨 갔고, 석 달 뒤 오상철은 지점 총무 자리로 발령(사람을 다른 자리로 보내는 인사 조치)이 났습니다. '그날 나는 열여덟이었어.' 오진우가 모니터를 제자리로 돌려놓습니다. '여기서 늦은 사람은 틀린 사람이야. 틀린 게 아니었다는 걸 증명할 자리는 아무도 안 줘.'",
    memo: [
      "본점 대출심사팀으로 넘어가면 평균 18영업일",
      "오상철 -- 2009년 부천 원미지점, 승인 하루 지연",
      "석 달 뒤 지점 총무 발령 · 5년 뒤 명예퇴직",
      "오진우: '늦은 사람이 틀린 사람'",
    ],
    triggers: ["competition", "responsibility", "helplessness"],
    choices: [
      {
        id: "p1_mentor_listen",
        label: "커피가 식을 때까지 아버지 이야기를 끝까지 듣는다",
        effect: { trust: 12, humanCost: -5, time: -4, capital: -2, fatigue: 5 },
        next: "p1_review",
        cognition: { persistence: 2 },
      },
      {
        id: "p1_mentor_ask",
        label: "18영업일을 줄일 방법이 있는지 절차부터 같이 확인하자고 한다",
        effect: { legitimacy: 10, trust: 3, time: -5, capital: -1, humanCost: 2, fatigue: 3 },
        next: "p1_review",
        cognition: { inference: 2 },
      },
      {
        id: "p1_mentor_agree",
        label: "속도가 맞다고 인정하고 목요일 승인 일정에 맞춘다",
        effect: { capital: 8, time: 4, legitimacy: -4, trust: 2, humanCost: 4, fatigue: -3 },
        next: "p1_review",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p1_review",
      },
    ],
  },
  p1_review: {
    phase: "PROBATION REVIEW",
    title: "비워 둔 서명란",
    speaker: "윤상혁",
    text:
      "목요일 오전 열한 시, 팀장실 문이 열립니다. 수습 평가 면담에 배정된 시간은 10분입니다. 윤상혁은 장식 하나 없는 감색 정장을 입고 있고 악수할 때만 웃습니다. 그가 평가표를 펴고 다섯 항목을 위에서 아래로 훑습니다. 속도, 정확성, 협업, 보고, 태도. 그리고 속도 칸에만 숫자를 적습니다. 5점 만점에 5점입니다. '나머지는 나중에 채우지.' 그가 4,000만 원 이야기를 먼저 꺼냅니다. '잘 찾았네. 수습이 요약표 밑줄까지 더해 보는 경우는 드물어.' 그러고는 서류철을 덮습니다. 덮는 속도가 대답입니다. '그런데 그 숫자를 적으면 열한 명이 11월을 못 넘기지. 자네 판단이 틀렸다고 한 적은 없네. 다만 그 판단이 설 자리는 내가 정하지.' 평가표 맨 아래 평가자 서명란은 비어 있습니다.",
    memo: [
      "수습 평가 면담 10분 -- 질문 1개",
      "평가 항목 5개 중 채워진 칸: 속도 5/5",
      "평가자 서명란 -- 비어 있음",
      "윤상혁: '나머지는 나중에 채우지'",
    ],
    triggers: ["recognition", "system", "choice"],
    choices: [
      {
        id: "p1_review_people",
        label: "평가표를 덮기 전에 온새포장 열한 명 이야기를 먼저 꺼낸다",
        effect: { trust: 11, humanCost: -4, legitimacy: -2, capital: -3, time: -3, fatigue: 5 },
        next: "p1_final",
        cognition: { reframing: 2 },
      },
      {
        id: "p1_review_fill",
        label: "나머지 네 칸과 서명란을 지금 채워 달라고 청한다",
        effect: { legitimacy: 12, trust: 3, time: -5, humanCost: 3, fatigue: 3 },
        next: "p1_final",
        cognition: { inference: 2 },
      },
      {
        id: "p1_review_speed",
        label: "속도 점수만 받고 면담을 10분 안에 끝낸다",
        effect: { capital: 7, time: 3, legitimacy: 3, trust: -2, humanCost: 3, fatigue: -2 },
        next: "p1_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "p1_final",
      },
    ],
  },
  p1_final: {
    phase: "FINAL DECISION",
    title: "어디에 적을 것인가",
    speaker: "오진우",
    text:
      "목요일 저녁 일곱 시, 12층에는 다시 두 자리만 불이 켜져 있습니다. 승인 서류는 내일 아침 아홉 시에 강서지점으로 내려갑니다. 화면에는 심사 의견란이 열려 있고 커서가 첫 칸에서 깜박입니다. 오진우가 의자를 끌어와 옆에 앉습니다. '4,000만 원, 184.7%, 180% 초과. 여기까지는 자네가 찾은 거야. 이제 어디에 적을지만 정하면 돼.' 그가 손가락 세 개를 폅니다. '자네 이름으로 적으면 이 건은 내일 안 나가. 내 이름으로 적으면 내가 받아. 안 적고 말로만 하면 아무 데도 안 남고, 자네는 금요일에 수습 딱지를 떼지.' 팀장실 불은 이미 꺼져 있습니다. 서류철 안의 평가표는 속도 칸 하나만 채워진 채, 서명란이 아직 비어 있습니다.",
    memo: [
      "승인 서류 하달 예정 -- 금요일 09시",
      "심사 의견란 -- 아직 비어 있음",
      "수습 평가 확정 -- 금요일",
      "평가자 서명란 -- 목요일 저녁 현재 공란",
    ],
    triggers: ["choice", "responsibility", "recognition"],
    choices: [
      {
        id: "p1_final_call",
        label: "적기 전에 정해린 대표에게 전화해 어느 쪽이든 직접 알리겠다고 한다",
        effect: { trust: 11, legitimacy: 5, humanCost: -4, capital: -6, time: -4, fatigue: 6 },
        next: "prologue01_result",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "p1_final_write",
        label: "4,000만 원과 184.7%를 의견란에 수치 그대로 적는다",
        effect: { legitimacy: 13, trust: 4, capital: -5, time: -6, humanCost: 3, fatigue: 5 },
        next: "prologue01_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "p1_final_oral",
        label: "의견란은 비워 두고 구두로만 보고하겠다고 한다",
        effect: { capital: 10, time: 5, legitimacy: 4, trust: -4, humanCost: 4, fatigue: -2 },
        next: "prologue01_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "prologue01_result",
      },
    ],
  },
};

/**
 * Everything else prologue 01 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const prologue01 = {
  id: "prologue01",
  nodes: prologue01Nodes,
  aftermath: {
    p1_aftershock: {
      phase: "AFTERMATH",
      title: "금요일 아침 아홉 시",
      speaker: "오진우",
      text: "금요일 아침 여덟 시 사십 분, 승인 서류가 출력되어 나옵니다. 스무 분 뒤에 강서지점으로 내려갑니다. 당신이 찾아낸 4,000만 원은 어제 저녁 팀 회의에서 두 번 언급됐습니다. 한 번은 '수습이 잘 찾았다'였고, 한 번은 '이번 건은 지점 한도 안에서 간다'였습니다. 오진우가 출력물을 정리하다 손을 멈추고 의견란 쪽을 봅니다. '지금이 마지막이야.' 복도 끝에서 한서윤이 태블릿을 보며 지나가고, 팀장실 문은 아직 닫혀 있습니다. 수습 평가서에 채워진 칸은 끝내 하나입니다. 속도. 이 아침에 당신이 고르는 한 줄이, 3년 뒤 어느 계약서 제7조 앞에서 당신을 3초 멈춰 세우게 됩니다.",
      memo: ["승인 서류 출력 08:40 · 하달 09:00", "어제 팀 회의 언급 2회 -- 칭찬 1, 일정 1", "심사 의견란 최종 확인 08:52", "수습 평가서에 채워진 칸: '속도' 하나"],
      triggers: ["choice", "responsibility", "order"],
      choices: [
        { id: "p1_after_credit", label: "오진우 대리 이름으로 의견을 올리고 대신 그에게 빚 하나를 지운다", effect: { trust: 10, capital: 6, legitimacy: -5, humanCost: 3, fatigue: 3 }, next: "prologue01_result", cognition: { reframing: 2 } },
        { id: "p1_after_record", label: "내 이름으로 의견란에 4,000만 원을 적어 남긴다", effect: { legitimacy: 14, trust: 2, capital: -7, time: -4, humanCost: 4, fatigue: 5 }, next: "prologue01_result", cognition: { persistence: 2, inference: 1 } },
        { id: "p1_after_speed", label: "구두로만 말하고 서류는 아홉 시에 그대로 내려보낸다", effect: { capital: 9, time: 7, trust: -6, legitimacy: -4, humanCost: 5, fatigue: -6 }, next: "prologue01_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["p1_final", "p1_aftershock"],
  connectiveScenes: [
    ["p1_ledger", "p1_counter", "p1_mentor", "칸이 다섯 개인 양식", "오진우", "화요일 오후, 강서지점 2층 서고에서 요약표 양식의 맨 아랫줄을 봅니다. '간이 재무 요약표 (2021.3 배포)'. 부채를 적는 칸은 다섯 개입니다. 은행 차입금, 회사채, 미지급금, 임대보증금, 기타. 상호금융에서 빌린 돈을 적을 칸은 없고 '기타' 칸에는 한 줄만 들어갑니다. 서울로 올라가는 전철에서 오진우에게 전화를 겁니다. 그가 3초쯤 조용합니다. '그 양식, 우리 팀에서 만든 거야.' 그리고 한 마디 덧붙입니다. '칸을 늘리자는 얘기는 작년에도 나왔어. 결론은 지점이 서류 쓰는 시간이 길어진다는 거였고.'", ["'간이 재무 요약표' -- 2021년 3월 배포, 부채 칸 5개", "배포 부서: 본점 기업금융전략팀", "같은 양식을 쓰는 지점 41곳", "칸 추가 논의 -- 2021년에 한 번, 보류"], ["같은 양식으로 서류를 만든 다른 지점 담당자들에게 먼저 알린다", "부채 칸이 다섯 개뿐이라는 사실을 정식 건의로 올린다", "이번 건만 손으로 고쳐 넣고 넘어간다"]],
    ["p1_scoreboard", "p1_mentor", "p1_review", "첫 점수판", "오진우", "커피 캔을 버리고 오진우가 화이트보드 앞에 섭니다. 그가 세로로 줄을 하나 긋고 왼쪽에 자기 이름, 오른쪽에 당신 이름을 적습니다. '수습 평가는 다섯 항목이야. 속도, 정확성, 협업, 보고, 태도. 그런데 실제로 점수가 갈리는 건 하나야.' 그가 속도 칸에만 동그라미를 칩니다. '나는 점수판을 만들어 두는 편이야. 안 만들면 누가 이겼는지 나중에 딴소리가 나오거든.' 왼쪽 칸에 1, 오른쪽 칸에 0이 적힙니다. 그가 마커 뚜껑을 닫습니다. '이번 건 끝나면 자네도 한 칸 가져가.'", ["화이트보드 점수판 -- 오진우 1 / 당신 0", "수습 평가 항목 5개 중 실제 배점은 속도", "점수판은 지우지 않기로 함", "승인까지 남은 시간 14시간"], ["점수판에 내 이름 대신 온새포장 직원 열한 명을 적어 달라고 한다", "'정확성' 칸을 누가 채우는지 절차부터 확인하자고 한다", "점수판대로 속도 칸부터 채우기로 한다"]],
    ["p1_blank", "p1_review", "p1_final", "저도 비워 둔 적 있어요", "한서윤", "면담이 끝나고 팀장실을 나오자 평가표는 책상 위 서류철에 그대로 꽂혀 있습니다. 지나가던 한서윤 과장이 걸음을 멈추고 그 칸을 봅니다. 그는 이 팀에서 가장 늦게까지 남는 사람이고, 태블릿에는 언제나 오래된 심사 보고서가 하나 열려 있습니다. 그가 서류철을 제자리로 밀어 넣으며 한 마디만 합니다. '저 칸 비어 있으면, 나중에 누가 채웠는지 아무도 몰라요.' 당신이 묻기 전에 그가 덧붙입니다. '저도 비워 둔 적 있어요.' 그리고 자기 자리로 돌아가 앉습니다. 더 묻지 않는 게 예의인 것 같아서 묻지 않습니다.", ["평가표 -- 팀장실 밖 서류철에 그대로", "한서윤 과장: '저도 비워 둔 적 있어요'", "그의 태블릿에 열려 있는 오래된 심사 보고서", "면담 종료 11시 10분"], ["한서윤에게 그때 무슨 일이 있었는지 지금 묻는다", "서명란이 비어 있다는 사실을 오늘 날짜로 적어 둔다", "묻지 않고 지나간 채 승인 서류로 돌아간다"]],
  ],
  connectiveOrder: [["p1_counter", "p1_ledger"], ["p1_mentor", "p1_scoreboard"], ["p1_review", "p1_blank"]],
  choiceEffects: {
    p1_counter: [
      { trust: 10, humanCost: -4, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 9, trust: 3, time: -5, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 4, trust: -2, legitimacy: -2, humanCost: 2, fatigue: -3 },
    ],
    p1_mentor: [
      { trust: 10, legitimacy: 3, humanCost: -4, time: -4, capital: -3, fatigue: 5 },
      { legitimacy: 10, trust: 2, time: -6, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 3, trust: -3, legitimacy: -3, humanCost: 3, fatigue: -4 },
    ],
    p1_review: [
      { trust: 9, humanCost: -5, time: -3, capital: -3, fatigue: 3 },
      { legitimacy: 10, trust: 3, time: -5, humanCost: 2, fatigue: 4 },
      { time: 4, capital: 5, trust: 1, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    p1_counter: {
      voice: ["같은 양식으로 서류를 만든 다른 지점 담당자들에게, 먼저 알린다.", "부채 칸이 다섯 개뿐이라는 사실을, 정식 건의로 올린다.", "이번 건만 손으로 고쳐 넣고, 넘어간다."],
      echo: ["알리면 그날 안에 네 곳이 답을 보냅니다. 그중 두 곳은 같은 칸을 이미 손으로 고쳐 쓰고 있었습니다.", "건의는 접수됩니다. 처리 부서는 그 양식을 만든 부서이고, 회신 기한은 정해져 있지 않습니다.", "손으로 고치면 이 건은 맞습니다. 41개 지점의 다음 서류는 여전히 칸이 다섯 개입니다."],
    },
    p1_mentor: {
      voice: ["점수판에 내 이름 대신, 온새포장 직원 열한 명을 적어 달라고 한다.", "'정확성' 칸을 누가 채우는지, 절차부터 확인하자고 한다.", "점수판대로, 속도 칸부터 채우기로 한다."],
      echo: ["오진우가 마커를 다시 뽑습니다. 열한 칸을 그리다 말고 '이러면 점수판이 아니잖아'라고 합니다. 그래도 지우지는 않습니다.", "확인해 보면 정확성 칸을 채우는 사람은 팀장 한 명입니다. 그리고 그 칸은 3년째 비어 있습니다.", "속도 칸은 그날 밤에 채워집니다. 나머지 네 칸은 다음 사람 차례에도 비어 있습니다."],
    },
    p1_review: {
      voice: ["한서윤에게, 그때 무슨 일이 있었는지 지금 묻는다.", "서명란이 비어 있다는 사실을, 오늘 날짜로 적어 둔다.", "묻지 않고 지나간 채, 승인 서류로 돌아간다."],
      echo: ["물으면 한서윤이 태블릿을 덮습니다. '지금은 말 안 할게요. 대신 당신이 그 칸을 비우면 그때 말할게요.'", "적어 두면 날짜가 남습니다. 2022년 10월 20일, 평가자 서명란 공란. 그 한 줄은 3년 동안 아무도 찾지 않습니다.", "지나가면 아무 일도 없습니다. 아무 일도 없다는 것이 이 팀에서는 가장 흔한 결과입니다."],
    },
  },
  reactionScenes: [
    ["p1_ledger_reaction", "p1_ledger", "p1_mentor", "끈으로 묶은 보고서", "임경수", "본점으로 돌아오자 대출심사팀장 임경수가 복도에서 당신을 세웁니다. 그는 서류를 전산에 넣기 전에 종이로 한 번 묶어 두는 사람입니다. '자네가 강서에 다녀왔다며.' 그가 끈으로 묶은 보고서 뭉치 위에 손을 올립니다. '그 양식 얘기는 나한테도 왔었네. 나는 반대했고, 반대한 사람 이름은 회의록에 안 남았지.' 그가 뭉치를 겨드랑이에 끼고 걸어가다 돌아섭니다. '수습 딱지 떼기 전에 하나만 배워 두게. 여기서는 찾는 것보다 남기는 게 훨씬 어려워.'", ["임경수에게 그때 반대한 이유를 끝까지 듣는다", "회의록에 없는 그 반대 의견을 지금이라도 기록으로 만들어 달라고 청한다", "이번 건이 급하다며 인사만 하고 올라간다"]],
    ["p1_scoreboard_reaction", "p1_scoreboard", "p1_review", "새벽 한 시의 문자", "정해린", "새벽 한 시, 정해린에게서 문자가 옵니다. 낮에 한 말을 스스로 정정하는 문자입니다. '아까 부끄럽다고 한 건 취소할게요. 부끄러운 건 제가 아니라 제 숫자예요.' 그 밑에 사진이 한 장 붙어 있습니다. 작업장 벽에 붙은 11월 납품 일정표이고, 첫 줄에 빨간 펜으로 '11/1 08:00'이 적혀 있습니다. 마지막 문장은 짧습니다. '늦어도 괜찮아요. 틀린 걸로는 안 남게 해 주세요.'", ["늦어도 괜찮다는 그 말을 오늘 안에 직접 확인해 주겠다고 답한다", "지금 서류가 어디까지 와 있는지 있는 그대로 적어 보낸다", "답장은 승인이 난 뒤에 하기로 하고 휴대폰을 엎어 둔다"]],
    ["p1_blank_reaction", "p1_blank", "p1_final", "열여덟 살의 오진우", "오진우", "오후 다섯 시, 오진우가 복사기 앞에서 당신을 기다립니다. 손에는 아버지 이야기를 하던 밤에 보여 주지 않은 종이 한 장이 있습니다. 2009년 인사 공고 사본이고, 오상철이라는 이름 옆에 '지점 총무'라고 적혀 있습니다. '하루 늦은 이유는 아무 데도 안 적혀 있어. 아버지는 그날 서류를 다시 봤던 거거든.' 그가 종이를 접어 다시 주머니에 넣습니다. '나도 알아. 그래서 나는 안 늦는 쪽을 골랐고, 자네한테도 그걸 가르친 거야.' 그가 복사기 덮개를 닫습니다. '근데 자네는 아직 안 골랐잖아.'", ["오진우에게 그 종이를 나한테도 한 장 달라고 한다", "'하루 늦은 이유'가 남는 칸이 서식에 필요하다고 말한다", "고를 시간이 없다며 승인 서류부터 끝낸다"]],
  ],
  reactionEffects: {
    p1_ledger: [
      { trust: 9, humanCost: -4, legitimacy: -2, time: -3, capital: -1, fatigue: 3 },
      { legitimacy: 9, trust: 3, time: -4, capital: -3, fatigue: 2 },
      { time: 4, capital: 4, legitimacy: 3, trust: -4, humanCost: 3, fatigue: -2 },
    ],
    p1_scoreboard: [
      { trust: 10, humanCost: -3, time: -3, capital: -2, fatigue: 4 },
      { legitimacy: 8, trust: 3, time: -5, humanCost: 2, capital: -1, fatigue: 3 },
      { time: 4, capital: 3, trust: 2, legitimacy: -3, humanCost: 2, fatigue: -4 },
    ],
    p1_blank: [
      { trust: 10, humanCost: -4, capital: -3, time: -2, fatigue: 5 },
      { legitimacy: 8, trust: 4, humanCost: 2, time: -4, fatigue: 2 },
      { time: 4, capital: 3, trust: 3, legitimacy: -2, humanCost: 2, fatigue: -5 },
    ],
  },
  reactionCopy: {
    p1_ledger: {
      voice: ["임경수에게, 그때 반대한 이유를 끝까지 듣는다.", "회의록에 없는 그 반대 의견을, 지금이라도 기록으로 만들어 달라고 청한다.", "이번 건이 급하다며, 인사만 하고 올라간다."],
      echo: ["들으면 40분이 걸립니다. 그가 끈을 풀었다 다시 묶는 동안 이야기는 2011년까지 거슬러 올라갑니다.", "청하면 임경수가 웃습니다. '지금 만들면 그건 기록이 아니라 뒷말이야.' 그래도 종이 한 장을 뭉치 뒤에 끼워 둡니다.", "인사만 하면 대화는 20초로 끝납니다. 뭉치는 그의 겨드랑이에 그대로 있고, 당신은 무엇을 놓쳤는지 모릅니다."],
    },
    p1_scoreboard: {
      voice: ["늦어도 괜찮다는 그 말을, 오늘 안에 직접 확인해 주겠다고 답한다.", "지금 서류가 어디까지 와 있는지, 있는 그대로 적어 보낸다.", "답장은 승인이 난 뒤에 하기로 하고, 휴대폰을 엎어 둔다."],
      echo: ["답하면 정해린이 새벽 두 시에 '고맙습니다' 한 줄을 보냅니다. 그 약속의 기한은 오늘 하루입니다.", "그대로 적어 보내면 문장이 아홉 줄이 됩니다. 마지막 줄은 '아직 아무것도 정해지지 않았습니다'입니다.", "엎어 두면 화면은 조용합니다. 아침에 뒤집어 보면 읽음 표시만 남아 있고 답장은 없습니다."],
    },
    p1_blank: {
      voice: ["오진우에게, 그 종이를 나한테도 한 장 달라고 한다.", "'하루 늦은 이유'가 남는 칸이, 서식에 필요하다고 말한다.", "고를 시간이 없다며, 승인 서류부터 끝낸다."],
      echo: ["달라고 하면 그가 복사기를 다시 켭니다. 사본이 두 장이 되는 건 13년 만에 처음입니다.", "말하면 오진우가 한참 있다가 '그 칸이 있었으면 아버지는 뭐라고 썼을까'라고 되묻습니다. 답은 둘 다 모릅니다.", "서류부터 끝내면 30분이 절약됩니다. 오진우는 종이를 주머니에 넣은 채 먼저 퇴근합니다."],
    },
  },
  reactionMemos: {
    p1_ledger_reaction: ["임경수 -- 2021년 양식 논의에서 반대", "회의록에 남지 않은 반대 의견"],
    p1_scoreboard_reaction: ["정해린 문자 01:04 -- '틀린 걸로는 안 남게'", "11월 납품 일정표 사진 -- '11/1 08:00'"],
    p1_blank_reaction: ["2009년 인사 공고 사본 -- 오상철, 지점 총무", "하루 늦은 이유가 적힌 칸은 없음"],
  },
  branchPlan: ["p1_counter", 0, "p1_branch_ledger", "p1_branch_ledger_follow"],
  branchScenes: {
    // PROLOGUE 01's detour is the workshop floor. The case is an argument about
    // one line in a summary sheet; the side door is the eleven people the line
    // was borrowed for, and the ledger that has kept them since July.
    p1_branch_ledger: {
      phase: "SIDE DOOR",
      title: "종이로만 보면 숫자예요",
      speaker: "정해린",
      text: "설명을 끝까지 듣고 나자 정해린이 가방을 챙깁니다. '그럼 한 번 보실래요. 종이로만 보면 우리 회사는 숫자예요.' 화곡동 골목 안쪽, 셔터를 반만 올린 작업장에 사람 열한 명이 있습니다. 포장기 두 대는 1998년에 들여온 것이고 그중 한 대는 오전에만 세 번 멈췄습니다. 벽에는 11월 1일부터 시작되는 납품 일정표가 붙어 있고, 그 옆에 7월 급여 명세서 열한 장이 압정으로 꽂혀 있습니다. 정해린이 원장을 펼쳐 7월 칸을 짚습니다. '이 4,000만 원 없었으면 그달에 네 명 내보냈어요. 그래서 요약표에 없는 게 저는 부끄러웠고요.' 실사(서류 대신 현장에 가서 직접 확인하는 일)라는 말은 아직 아무도 쓰지 않았습니다. 당신은 그냥 보러 온 것입니다.",
      memo: ["화곡동 작업장 -- 직원 11명, 포장기 2대(1998년식)", "오전 고장 3회 -- 라인 정지 47분", "11월 1일 납품 시작 -- 월 8,000만 원", "7월 급여 명세서 11장 -- 새봄신협 차입금으로 지급"],
      triggers: ["protection", "affection", "responsibility"],
      choices: [
        { id: "p1_branch_ledger_a", label: "명세서 열한 장의 이름을 하나씩 받아 적는다", effect: { trust: 12, humanCost: -4, time: -5, capital: -2, fatigue: 5 }, next: "p1_branch_ledger_follow", cognition: { persistence: 2 } },
        { id: "p1_branch_ledger_b", label: "원장 7월 칸을 사진으로 남기고 정식 자료로 받겠다고 한다", effect: { legitimacy: 11, trust: 3, time: -6, humanCost: 2, fatigue: 4 }, next: "p1_branch_ledger_follow", cognition: { inference: 2 } },
        { id: "p1_branch_ledger_c", label: "기계만 확인하고 본점으로 바로 돌아간다", effect: { time: 6, capital: 5, trust: -4, humanCost: 3, fatigue: -3 }, next: "p1_branch_ledger_follow", cognition: { risk: 1 } },
      ],
    },
    p1_branch_ledger_follow: {
      phase: "SIDE DOOR",
      title: "칸이 없어서 뺐습니다",
      speaker: "정해린",
      text: "작업장 사무실에서 정해린이 요약표를 만든 세무사에게 전화를 겁니다. 스피커를 켜 놓고 묻습니다. 대답은 3초 만에 옵니다. '지점에서 주신 양식에 그 칸이 없어요. 기타 칸은 한 줄인데 거기엔 미지급금을 넣었고요.' 숨은 게 아니라 들어갈 자리가 없었던 것입니다. 세무사가 덧붙입니다. '다들 그렇게 냅니다. 문제 된 적 없어요.' 전화가 끊기고 정해린이 한참 조용히 있다가 말합니다. '그 말이 더 무섭네요.' 그가 부도(빚을 갚지 못해 회사가 쓰러지는 일)라는 단어를 이 대화에서 처음 꺼냅니다. '늦는 건 견뎌요. 그런데 서류에 저희가 숨긴 걸로 적히면 그건 못 견뎌요.'",
      memo: ["세무사 진술 -- '양식에 그 칸이 없다'", "기타 칸 1줄 -- 미지급금이 차지", "'다들 그렇게 냅니다' -- 문제 제기 이력 없음", "정해린: '늦는 건 견뎌요'"],
      triggers: ["injustice", "protection", "order"],
      choices: [
        { id: "p1_branch_ledger_follow_a", label: "숨긴 것이 아니라는 문장을 정해린의 말 그대로 받아 둔다", effect: { trust: 13, legitimacy: 4, humanCost: -5, capital: -4, time: -4, fatigue: 6 }, next: "p1_ledger", cognition: { reframing: 3 } },
        { id: "p1_branch_ledger_follow_b", label: "세무사 통화 내용을 날짜와 함께 검토 기록에 넣는다", effect: { legitimacy: 12, trust: 4, time: -7, humanCost: 3, fatigue: 4 }, next: "p1_ledger", cognition: { inference: 2 } },
        { id: "p1_branch_ledger_follow_c", label: "양식 탓은 본점에서 따지기로 하고 오늘은 여기까지 한다", effect: { time: 5, capital: 6, trust: -3, humanCost: 4, fatigue: -4 }, next: "p1_ledger", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "p1_start",
    result: "p1_aftershock",
    defaultFree: "p1_route_system",
    // One small loan, one line. Like 사건 12 the case is a single thread; the
    // split is what the probationer does with a number nobody asked for.
    choices: {},
    system: {
      route: "p1_route_system",
      final: "p1_final_system_route",
      title: "구두로 끝난 스물일곱 건",
      speaker: "임경수",
      text: "준비된 보기 밖의 문장을 쓰자 임경수가 기록 보관실 문을 열어 줍니다. 끈으로 묶인 종이 심사 보고서가 벽을 따라 서 있고, 보존연한(기록을 반드시 보관해야 하는 기간)이 지난 칸은 이미 비어 있습니다. 남아 있는 5년치 안에서, 지점 한도 안으로 끝난 건 가운데 나중에 숫자가 다시 계산된 것이 31건입니다. 그중 서류가 정정된 건은 4건입니다. 나머지 27건은 마지막 줄이 똑같습니다. '구두 보고함.' 그 27건에서 오차를 처음 찾아낸 사람 스물일곱 명 가운데 스물한 명이 그해 수습이거나 1년차였습니다. 임경수가 끈을 다시 묶습니다. '찾는 건 늘 제일 어린 사람이 하네. 남기는 건 아무도 안 하고.'",
      memo: ["남은 5년치 지점 승인 건 중 재계산 31건", "서류 정정 4건 / '구두 보고함' 27건", "오차를 찾은 27명 중 21명이 수습·1년차"],
      routeChoices: [
        ["p1_route_system_file", "27건 목록을 대출심사팀 정식 기록으로 올린다", { legitimacy: 12, trust: 4, capital: -5, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["p1_route_system_find", "구두 보고로 끝낸 스물일곱 명을 찾아 먼저 알린다", { trust: 11, legitimacy: 3, humanCost: -5, capital: -4, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["p1_route_system_drop", "목록은 덮어 두고 이번 건 하나만 제대로 한다", { time: 7, capital: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "요약표만으로는 지점 한도 판단을 못 하게 하는 규칙을 제안한다", { legitimacy: 13, trust: 6, capital: -6, humanCost: -3, time: -2, fatigue: 7 }, { reframing: 3 }],
      ["b", "규칙은 그대로 두고 온새포장 건 하나만 바로잡는다", { capital: 8, time: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "오차를 찾아낸 사람 이름을 적는 칸을 심사 서식에 만들자고 한다", { legitimacy: 8, trust: 9, capital: -5, time: -6, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "p1_evidence_turn",
    result: "p1_aftershock",
    sourceRoutes: ["p1_counter", "p1_mentor", "p1_review", "p1_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 요약표 양식 옆에 놓고, 이 양식을 누가 만들고 누가 승인했는지 맞춰 본다.",
    entryEcho: "단서를 대면 양식의 배포 기록이 열립니다. 만든 손과 승인한 손이 같은 문서 안에 있지 않을 수 있습니다.",
    title: "양식을 만든 사람",
    speaker: "반재욱",
    text: "단서를 맞추자 '간이 재무 요약표' 배포 승인 문서가 열립니다. 2021년 3월 9일, 기업금융전략팀, 배포 대상 지점 41곳. 작성자 칸에는 오진우 대리의 이름이 적혀 있고, 승인자 서명란은 비어 있습니다. 문서는 서명 없이 그대로 시행됐고, 같은 해 여름에 지점 두 곳이 칸을 늘려 달라고 요청했지만 회신 기록은 남아 있지 않습니다. 감사팀 조사역 반재욱이 검은 수첩을 펴고 날짜부터 적습니다. 그의 수첩은 아직 첫 장입니다. '만든 사람 이름은 있고 승인한 사람 이름은 없습니다. 이런 문서를 뭐라고 부르는지 아십니까. 저는 아무도 책임지지 않은 규칙이라고 부릅니다.'",
    memo: ["'간이 재무 요약표' 배포 승인 문서 -- 2021년 3월 9일", "작성자: 오진우 대리 / 승인자 서명란: 공란", "칸 추가 요청 지점 2곳 -- 회신 기록 없음"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 6, trust: 4, time: -4, capital: -2, fatigue: 4 },
    choices: [
      ["p1_evidence_turn_audit", "배포 승인 문서의 빈 서명란을 감사팀에 정식으로 넘긴다", { legitimacy: 13, trust: 4, capital: -7, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["p1_evidence_turn_hold", "이 기록은 쥐고 있다가 수습 평가가 끝난 뒤에 꺼낸다", { capital: 9, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["p1_evidence_turn_share", "같은 양식을 쓰는 41개 지점 담당자들에게 먼저 알린다", { trust: 12, legitimacy: 5, capital: -6, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "p1_branch_ledger",
    systemNext: "p1_route_system",
    evidenceNext: "p1_evidence_turn",
    routeLabel: "지난주에 본 지점 서류의 빈칸부터 정해린 대표에게 다시 확인한다",
    systemLabel: "지난번 자유응답 문장이 양식 개정 요청에도 남았는지 본다",
    evidenceLabel: "모아 둔 단서를 붙여 요약표 양식을 누가 승인했는지 연다",
  },
  // The season's first case. There is no previous chapter to arrive from, so
  // the briefing has one opening and no signature move.
  openingRoutes: {},
  openingCopy: {},
  openingSignatures: {},
  voiceLines: {
    // PROLOGUE 01. Every line is said by someone who is still allowed to be
    // told what to do, so none of them is allowed to sound like a verdict.
    p1_start_source: "강서지점 담당자에게 직접 전화해, 숫자를 탓하지 않고 먼저 묻는다.",
    p1_start_note: "합계가 4,000만 원 어긋난다는 사실을, 검토 기록에 먼저 적어 둔다.",
    p1_start_draft: "요약표 숫자대로 초안을 끝내고, 어긋난 합계는 뒤로 미룬다.",
    p1_counter_explain: "정해린 대표에게, 이 4,000만 원이 왜 중요한지 끝까지 설명한다.",
    p1_counter_request: "지점 대출 담당에게, 요약표 대신 원장 사본을 정식으로 요청한다.",
    p1_counter_return: "원장은 나중에 받기로 하고, 오늘 본 것만 들고 돌아간다.",
    p1_branch_ledger_a: "명세서 열한 장의 이름을, 하나씩 받아 적는다.",
    p1_branch_ledger_b: "원장 7월 칸을 사진으로 남기고, 정식 자료로 받겠다고 한다.",
    p1_branch_ledger_c: "기계만 확인하고, 본점으로 바로 돌아간다.",
    p1_branch_ledger_follow_a: "숨긴 것이 아니라는 문장을, 정해린의 말 그대로 받아 둔다.",
    p1_branch_ledger_follow_b: "세무사 통화 내용을, 날짜와 함께 검토 기록에 넣는다.",
    p1_branch_ledger_follow_c: "양식 탓은 본점에서 따지기로 하고, 오늘은 여기까지 한다.",
    p1_mentor_listen: "커피가 식을 때까지, 아버지 이야기를 끝까지 듣는다.",
    p1_mentor_ask: "18영업일을 줄일 방법이 있는지, 절차부터 같이 확인하자고 한다.",
    p1_mentor_agree: "속도가 맞다고 인정하고, 목요일 승인 일정에 맞춘다.",
    p1_review_people: "평가표를 덮기 전에, 온새포장 열한 명 이야기를 먼저 꺼낸다.",
    p1_review_fill: "나머지 네 칸과 서명란을, 지금 채워 달라고 청한다.",
    p1_review_speed: "속도 점수만 받고, 면담을 10분 안에 끝낸다.",
    p1_final_call: "적기 전에 정해린 대표에게 전화해, 어느 쪽이든 직접 알리겠다고 한다.",
    p1_final_write: "4,000만 원과 184.7%를, 의견란에 수치 그대로 적는다.",
    p1_final_oral: "의견란은 비워 두고, 구두로만 보고하겠다고 한다.",
    p1_after_credit: "오진우 대리 이름으로 의견을 올리고, 대신 그에게 빚 하나를 지운다.",
    p1_after_record: "내 이름으로, 의견란에 4,000만 원을 적어 남긴다.",
    p1_after_speed: "구두로만 말하고, 서류는 아홉 시에 그대로 내려보낸다.",
    p1_route_system_file: "27건 목록을, 대출심사팀 정식 기록으로 올린다.",
    p1_route_system_find: "구두 보고로 끝낸 스물일곱 명을 찾아, 먼저 알린다.",
    p1_route_system_drop: "목록은 덮어 두고, 이번 건 하나만 제대로 한다.",
    p1_final_system_route_a: "요약표만으로는, 지점 한도 판단을 못 하게 하는 규칙을 제안한다.",
    p1_final_system_route_b: "규칙은 그대로 두고, 온새포장 건 하나만 바로잡는다.",
    p1_final_system_route_c: "오차를 찾아낸 사람 이름을 적는 칸을, 심사 서식에 만들자고 한다.",
    p1_evidence_turn_audit: "배포 승인 문서의 빈 서명란을, 감사팀에 정식으로 넘긴다.",
    p1_evidence_turn_hold: "이 기록은 쥐고 있다가, 수습 평가가 끝난 뒤에 꺼낸다.",
    p1_evidence_turn_share: "같은 양식을 쓰는 41개 지점 담당자들에게, 먼저 알린다.",
  },
  echoReplies: {
    // PROLOGUE 01.
    p1_start_source: "전화를 받은 담당자가 '저도 그 칸이 늘 걸렸어요'라고 합니다. 원자료는 오후에 옵니다. 대신 오늘 초안은 못 끝냅니다.",
    p1_start_note: "기록에 적히면 숫자는 사라지지 않습니다. 같은 기록을 오진우도 열 수 있고, 그는 그 줄을 보는 즉시 일정을 계산합니다.",
    p1_start_draft: "초안은 한 시간 만에 끝납니다. 4,000만 원짜리 한 줄은 연필 점이 찍힌 채 그대로 남습니다.",
    p1_counter_explain: "끝까지 설명하면 정해린이 처음으로 서류를 손으로 짚습니다. '그럼 저희가 숨긴 게 되는 건가요.' 그 질문에는 아직 답할 수 없습니다.",
    p1_counter_request: "정식 요청은 접수됩니다. 접수된 순간 이 건은 '지점에서 조용히 끝나는 건'이 아니게 됩니다.",
    p1_counter_return: "돌아오면 오늘 안에 초안을 고칠 수 있습니다. 원장은 내일도, 모레도 오지 않습니다.",
    p1_branch_ledger_a: "받아 적으면 열한 명 중 넷이 7월에 그만두려다 남은 사람입니다. 이름을 적은 종이는 어떤 서식에도 들어가지 않습니다.",
    p1_branch_ledger_b: "사진은 남습니다. 정식 자료로 받으면 그 순간부터 본점이 이 건을 들여다볼 근거가 생깁니다.",
    p1_branch_ledger_c: "기계는 한 대가 멀쩡하고 한 대가 아닙니다. 그 사실만으로는 서류의 어느 칸도 바뀌지 않습니다.",
    p1_branch_ledger_follow_a: "말 그대로 받아 두면 문장은 두 줄입니다. 그 두 줄이 나중에 '숨겼다'는 말을 막을 수 있는 유일한 종이가 됩니다.",
    p1_branch_ledger_follow_b: "기록에 들어가면 세무사 이름도 함께 들어갑니다. 그는 이 통화가 기록될 줄 몰랐습니다.",
    p1_branch_ledger_follow_c: "오늘은 여기까지 하면 저녁 시간이 남습니다. 양식 이야기는 본점에서 아무도 먼저 꺼내지 않습니다.",
    p1_mentor_listen: "끝까지 들으면 오진우가 열여덟 살 이야기를 두 번 합니다. 두 번째에는 아버지가 그날 왜 서류를 다시 봤는지가 빠져 있습니다.",
    p1_mentor_ask: "절차를 확인하면 18영업일은 12일까지 줄어듭니다. 11월 1일에는 여전히 닿지 않습니다.",
    p1_mentor_agree: "인정하면 오진우가 처음으로 웃습니다. '이제 좀 팀 사람 같네.' 그 말이 칭찬인지 아닌지는 알 수 없습니다.",
    p1_review_people: "열한 명 이야기를 꺼내면 윤상혁이 서류철에서 손을 뗍니다. 그리고 묻습니다. '그 열한 명 이름을 자네가 다 아나?'",
    p1_review_fill: "지금 채워 달라고 하면 그가 펜을 들었다 내려놓습니다. '나중에.' 면담은 예정보다 2분 일찍 끝납니다.",
    p1_review_speed: "10분 안에 끝나면 평가는 무사합니다. 속도 칸의 5점은 이 팀에서 제일 안전한 숫자입니다.",
    p1_final_call: "전화를 걸면 정해린이 세 번째 신호에 받습니다. 어느 쪽을 고르든 그 사람은 내일 아침에 이유를 알게 됩니다.",
    p1_final_write: "수치 그대로 적으면 이 건은 내일 아침에 못 나갑니다. 의견란에 남은 숫자는 3년 뒤에도 같은 자리에 있습니다.",
    p1_final_oral: "구두로만 하면 회의에서 한 번 언급되고 끝납니다. 언급은 기록이 아니고, 이 조직에서 기록이 아닌 것은 없던 일입니다.",
    p1_after_credit: "오진우가 잠깐 당신을 봅니다. '이거 갚아야 되는 거 알지.' 그가 점수판 오른쪽 칸에 처음으로 1을 적습니다.",
    p1_after_record: "이름을 남기면 서류는 아홉 시에 안 내려갑니다. 그날 오후 팀 회의에서 당신 이름이 두 번 불리고, 둘 다 질문이 아닙니다.",
    p1_after_speed: "서류는 정시에 내려갑니다. 수습 딱지는 그날 떨어지고, 4,000만 원은 아무 칸에도 적히지 않은 채 남습니다.",
    p1_route_system_file: "정식 기록에 오르면 27건은 목록이 됩니다. 목록을 만든 사람 이름도 같은 장에 남습니다.",
    p1_route_system_find: "찾아가면 열아홉 명이 아직 은행에 있습니다. 그중 여섯은 자기가 무엇을 찾았었는지 이미 기억하지 못합니다.",
    p1_route_system_drop: "덮어 두면 이번 건은 깨끗해집니다. 27건은 내년에도 스물일곱 건이고, 숫자는 늘어나는 쪽으로만 움직입니다.",
    p1_final_system_route_a: "규칙이 생기면 다음 서류부터는 원장이 따라옵니다. 이번 서류는 규칙보다 하루 먼저 내려갑니다.",
    p1_final_system_route_b: "한 건은 바로잡힙니다. 41개 지점의 다음 요약표는 오늘과 똑같은 칸 다섯 개를 들고 올라옵니다.",
    p1_final_system_route_c: "칸이 생기면 찾은 사람의 이름이 남습니다. 남는 순간부터 그 이름은 책임자 이름이기도 합니다.",
    p1_evidence_turn_audit: "넘기면 반재욱의 수첩 첫 장에 사건 번호가 붙습니다. 작성자 칸의 이름은 오진우이고, 그는 그 사실을 아직 모릅니다.",
    p1_evidence_turn_hold: "쥐고 있으면 수습은 조용히 끝납니다. 그 사이 41개 지점은 같은 양식으로 서류를 아홉 건 더 올립니다.",
    p1_evidence_turn_share: "알리면 사흘 안에 열한 곳이 답을 보냅니다. 그중 세 곳은 이미 손으로 칸을 그려 넣고 있었습니다.",
  },
  characterProfiles: {
    정해린: {
      role: "온새포장 대표 · 강서구 화곡동",
      stance: "생계 · 정확함 · 부끄러움",
      job: "서류 한 줄이 누구의 한 달인지 말해 준다.",
      appearance: "손등에 마른 풀 자국, 압정으로 꽂아 둔 급여 명세서 열한 장, 표지가 닳은 원장.",
      thought: "늦는 건 견딘다. 숨긴 사람으로 적히는 건 못 견딘다.",
      gesture: "정해린은 대답하기 전에 원장의 해당 달을 손가락으로 먼저 짚는다.",
      voice: "변명을 하지 않고, 자기 숫자의 출처를 먼저 댄다.",
      line: "저희가 숨긴 게 되는 건가요, 아니면 칸이 없었던 게 되는 건가요.",
    },
  },
  setting: { place: "본점 12층 기업금융전략팀", clock: "2022년 10월 셋째 주 월요일 · 09시" },
  sceneContext: {
    p1_start: {
      place: "본점 12층 기업금융전략팀 · 수습 책상",
      clock: "2022년 10월 17일 월요일 · 09시",
      question: "요약표의 합계가 한 줄만큼 어긋나 있습니다. 무엇부터 하겠습니까?",
      lead: "복사기와 창문 사이 책상에는 아직 명패가 없고, 서류철 하나가 새로 놓였습니다.",
    },
    p1_counter: {
      place: "KD은행 강서지점 객장",
      clock: "2022년 10월 18일 화요일 · 10시",
      question: "빠진 한 줄의 주인이 창구 앞에 앉아 있습니다. 어떻게 하겠습니까?",
      lead: "번호표 기계가 84번을 부르고, 입구 옆 실적판에는 이달 순위가 붙어 있습니다.",
    },
    p1_branch_ledger: {
      place: "화곡동 온새포장 작업장",
      clock: "2022년 10월 18일 화요일 · 15시",
      question: "종이에서는 숫자였던 것이 여기서는 열한 명입니다. 이 자리에서 무엇을 하겠습니까?",
    },
    p1_branch_ledger_follow: {
      place: "온새포장 작업장 · 안쪽 사무실",
      clock: "2022년 10월 18일 화요일 · 16시 20분",
      question: "그 한 줄은 숨긴 것이 아니라 들어갈 칸이 없었습니다. 이 사실을 어떻게 다루겠습니까?",
    },
    p1_ledger: {
      place: "KD은행 강서지점 2층 서고",
      clock: "2022년 10월 18일 화요일 · 17시",
      question: "요약표의 부채 칸은 다섯 개뿐이고, 그 양식은 당신 팀이 만들었습니다. 어떻게 하겠습니까?",
    },
    p1_ledger_reaction: {
      place: "본점 12층 복도",
      clock: "2022년 10월 18일 화요일 · 19시",
      question: "임경수는 그 양식에 반대했고 그 이름은 회의록에 없습니다. 무엇을 묻겠습니까?",
    },
    p1_mentor: {
      place: "본점 12층 기업금융전략팀 · 야간",
      clock: "2022년 10월 19일 수요일 · 21시",
      question: "사수가 처음으로 자기 아버지 이야기를 꺼냅니다. 이 밤을 어떻게 쓰겠습니까?",
      lead: "층 전체에서 불이 켜진 자리는 둘뿐이고, 편의점 커피 두 개가 책상에 놓입니다.",
    },
    p1_scoreboard: {
      place: "본점 12층 · 화이트보드 앞",
      clock: "2022년 10월 19일 수요일 · 22시",
      question: "사수가 처음으로 점수판을 그렸습니다. 이 점수판을 어떻게 하겠습니까?",
    },
    p1_scoreboard_reaction: {
      place: "본점 12층 · 빈 자리",
      clock: "2022년 10월 20일 목요일 · 01시",
      question: "'틀린 걸로는 안 남게 해 달라'는 문자가 왔습니다. 무엇이라 답하겠습니까?",
    },
    p1_review: {
      place: "본점 12층 팀장실",
      clock: "2022년 10월 20일 목요일 · 11시",
      question: "평가표 다섯 칸 중 하나만 채워졌고 서명란은 비어 있습니다. 이 10분을 어떻게 쓰겠습니까?",
      lead: "문이 열리고, 안에서 서류철 덮는 소리가 먼저 들립니다.",
    },
    p1_blank: {
      place: "본점 12층 팀장실 앞 통로",
      clock: "2022년 10월 20일 목요일 · 11시 20분",
      question: "한서윤이 그 빈칸을 보고 한 마디만 하고 지나갔습니다. 어떻게 하겠습니까?",
    },
    p1_blank_reaction: {
      place: "본점 12층 복사기 앞",
      clock: "2022년 10월 20일 목요일 · 17시",
      question: "사수가 13년 된 인사 공고 사본을 들고 기다립니다. 무엇이라 답하겠습니까?",
    },
    p1_route_system: {
      place: "본점 8층 기록 보관실",
      clock: "2022년 10월 20일 목요일",
      question: "5년치에서 재계산된 31건 중 27건이 '구두 보고함'으로 끝났습니다. 이 목록을 어떻게 하겠습니까?",
    },
    p1_final_system_route: {
      place: "본점 8층 기록 보관실 · 창가",
      clock: "2022년 10월 20일 목요일 · 22시",
      question: "오차가 남는 방식을 하나만 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    p1_evidence_turn: {
      place: "본점 12층 · 문서 관리 단말",
      clock: "2022년 10월 20일 목요일 · 18시",
      question: "양식을 만든 사람 이름은 있고 승인한 사람 이름은 없습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    p1_final: {
      place: "본점 12층 기업금융전략팀 · 야간",
      clock: "2022년 10월 20일 목요일 · 19시",
      question: "찾아낸 4,000만 원을 어디에 어떻게 남길지 오늘 밤 안에 정해야 합니다. 어떻게 하겠습니까?",
      lead: "심사 의견란이 열린 채 커서가 첫 칸에서 깜박이고, 팀장실 불은 이미 꺼져 있습니다.",
    },
    p1_aftershock: {
      place: "본점 12층 · 출력기 앞",
      clock: "2022년 10월 21일 금요일 · 08시 40분",
      question: "서류가 내려가기까지 스무 분 남았습니다. 이 아침을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "p1-blank-approver",
    title: "비어 있는 승인자 칸",
    text: "지점들이 쓰는 '간이 재무 요약표'는 2021년 3월 기업금융전략팀이 41개 지점에 배포했습니다. 배포 승인 문서의 작성자 칸에는 오진우 대리의 이름이 있고, 승인자 서명란은 비어 있습니다.",
  },
  outcomes: {
    p1_after_credit: { tag: "공을 넘긴 결말", title: "의견은 사수의 이름으로 올라갔다", text: "4,000만 원은 기록에 남았고, 그 옆의 이름은 당신 것이 아닙니다. 오진우의 점수판 오른쪽 칸에 처음으로 1이 적혔습니다." },
    p1_after_record: { tag: "이름을 남긴 결말", title: "의견란에 내 이름으로 4,000만 원을 적었다", text: "서류는 아홉 시에 내려가지 않았습니다. 수습은 통과했고, 그날부터 당신은 이 층에서 눈에 띄는 사람이 됐습니다." },
    p1_after_speed: { tag: "속도를 고른 결말", title: "말로만 하고 서류는 정시에 내려갔다", text: "수습 딱지는 금요일에 떨어졌습니다. 평가서에 채워진 칸은 하나였고, 4,000만 원은 어느 칸에도 없습니다." },
  },
  carryovers: {
    p1_after_credit: { trust: 10, capital: 6, legitimacy: -5 },
    p1_after_record: { legitimacy: 14, trust: 2, humanCost: 4 },
    p1_after_speed: { capital: 9, time: 7, trust: -6 },
  },
  // The season starts here, so there is no previous chapter to carry a
  // challenge in from.
  continuityChallenges: {},
};
