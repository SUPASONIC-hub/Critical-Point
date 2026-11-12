/**
 * 번외 4 -- 연말 정산 (E-11, 2026-11-12 「번외 04 지금 바로 시작해줘」, 방향 Q7 (1)
 * 한 달에 한 편, 랭킹 밖).
 *
 * A Thursday night in December 2025, 12월 11일, from 22:10 to 09:00 the next
 * morning: the night shift of KD은행's 고객센터, eight days after 사건 16's
 * 리스 승인위원회 (12월 3일) and four days before 사건 17 opens (12월 15일).
 * 312 small-business loans that end on 31 December have been refused a
 * 만기 연장, and every borrower is to be told by phone before the 09:00 report
 * to head office. The screen gives one reason for all of them: 「내부 종합 평가
 * 미달」. 야간조 팀장 한기호 asks 트리거랩 for someone who reads numbers, to
 * turn that one line into words a person can hear.
 *
 * What the night finds is the reason under the line. 문정택's 분식집 stands
 * across the road from 플로우온's 김포 센터; his last three months' card sales
 * pass the bank's own re-review bar (910만 원 a month against 800만), and his
 * loan is refused anyway, because the bank has marked the whole street as
 * 「상권 위험 가중」 for its exposure to 대출 2023-0412 -- the loan the analyst
 * wrote eleven pages against. The small shop pays for the big loan.
 *
 * It keeps clear of 사건 16 and 17. No robot, no lease, no 31 December
 * contract end on the floor, no 인사위원회; 문정택 only says his dawn
 * customers have stopped spending, and why is a rumour. The detail line names
 * the loan and nothing that happens to it, so it holds after any ending. The
 * endings say what the analyst leaves on the record that morning, never
 * whether the extension was granted.
 *
 * Its speakers are new and have portraits: 오민정 (상담원 7년 차), 문정택
 * (분식집 사장) and 한기호 (야간조 팀장, the 「예외 없음」 side, an ordinary
 * tired man who was handed the rule, not its author). The 강태민 and 배수경
 * of the plan are 플로우온's floor in the canon and are not put in a bank's
 * call centre.
 *
 * The laughter is the script's last line, "고객님의 소중한 사업을 KD은행이 늘
 * 응원합니다", read after every refusal, and the 공감 표현 counter that scores
 * each 「죄송합니다」; the anger a reason code that is not the shop's; the
 * sorrow 오민정's own contract, renewed every January by the same kind of
 * score; the joy a 떡볶이 pan lit at nine.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): ten
 * scenes, `s4_aftershock`'s three cards to `s4_result`, three `outcomes`. The
 * side screen shows no decision reveal, so the cards carry no voice or echo.
 */
export const side04 = {
  id: "side04",
  label: "번외 4",
  title: "연말 정산",
  startNode: "s4_start",
  // A table from between 사건 16 and 17, not this device's season.
  startState: {
    resources: { time: 46, capital: 55, trust: 56, legitimacy: 52, humanCost: 26, fatigue: 40 },
  },
  nodes: {
    s4_start: {
      phase: "SIDE 04 BRIEFING",
      title: "312건",
      speaker: "한기호",
      place: "KD은행 고객센터 · 야간 상담석",
      clock: "12월 11일 (목) 22:10, 본점 보고까지 11시간",
      lead: "연말을 3주 앞둔 12월의 목요일 밤. KD은행 고객센터 야간조 팀장 한기호가 숫자 읽는 사람이 필요하다며 트리거랩에 당신을 청했습니다.",
      text: "한기호 팀장이 와이셔츠 소매를 두 번 접고 출력물 한 묶음을 내밉니다. 12월 31일에 끝나는 소상공인 대출 가운데 만기 연장(갚을 날짜를 미뤄 주는 것)이 거절된 312건. 내일 아침 9시까지 한 사람도 빠짐없이 전화로 알려야 합니다. 팀장 모니터 옆 포스트잇에는 '통보 완료율 100%'라고 적혀 있습니다. '고객님들이 자꾸 왜냐고 물으세요. 화면엔 내부 종합 평가 미달, 한 줄뿐이고요.' 그가 볼펜 끝으로 그 한 줄을 톡톡 칩니다. '분석관님은 이걸 사람 말로 바꿔 주시면 돼요. 말은 저희가 합니다.' 그러고는 쑥스럽게 웃습니다. '저도 연말에 종합 평가 받아요.'",
      question: "한기호 팀장이 거절 사유 한 줄을 사람 말로 바꿔 달라고 합니다. 어떻게 하겠습니까?",
      memo: ["만기 연장 거절 통보: 312건", "기한: 내일 09:00 본점 보고", "화면의 사유: '내부 종합 평가 미달' 한 줄", "팀장 포스트잇: '통보 완료율 100%'"],
      triggers: ["system", "responsibility", "curiosity"],
      choices: [
        { id: "s4_start_seat", label: "상담석 옆에 의자를 놓고 첫 통화부터 같이 듣는다", effect: { trust: 9, humanCost: -2, time: -4, fatigue: 3 }, cognition: { persistence: 2 }, next: "s4_script" },
        { id: "s4_start_code", label: "거절 사유가 어떻게 정해지는지부터 묻는다", effect: { legitimacy: 9, trust: 1, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s4_script" },
        { id: "s4_start_order", label: "312건을 훑어 빨리 끝낼 순서부터 짠다", effect: { time: 6, trust: -3, fatigue: 1 }, cognition: { risk: 1 }, next: "s4_script" },
      ],
    },
    s4_script: {
      phase: "SIDE 04 SCRIPT",
      title: "응원합니다",
      speaker: "오민정",
      place: "KD은행 고객센터 · 야간 상담석 7번",
      clock: "22:40",
      text: "7번 상담석 모니터에 통화 대본이 떠 있습니다. 인사, 본인 확인, 거절 안내, 사과. 마지막 줄은 이렇습니다. '고객님의 소중한 사업을 KD은행이 늘 응원합니다.' 7년 차 상담원 오민정이 헤드셋을 고쳐 쓰며 보리차 보온병 뚜껑을 엽니다. '거절하고 응원해요. 둘 다 대본에 있어서요.' 화면 귀퉁이에는 작은 숫자 둘이 있습니다. 평균 통화 시간, 그리고 공감 표현 횟수. '죄송합니다'를 말할 때마다 시스템이 알아듣고 하나씩 올립니다. 통화가 2분 40초를 넘으면 빨간색이 됩니다. 오민정이 웃습니다. '오늘 밤엔 제가 우리 센터에서 제일 공감 잘하는 사람이 될 거예요. 312번이나.'",
      question: "거절 뒤에 응원이 붙은 대본으로 312번을 걸어야 합니다. 무엇부터 보겠습니까?",
      memo: ["대본 마지막 줄: '늘 응원합니다'", "평가 숫자: 평균 통화 시간, 공감 표현 횟수", "'죄송합니다' 한 번 = 공감 표현 1회", "2분 40초 넘으면 빨간색"],
      triggers: ["injustice", "affection", "system"],
      choices: [
        { id: "s4_script_read", label: "대본을 소리 내어 오민정과 같이 한 번 읽는다", effect: { trust: 9, humanCost: -2, time: -2, fatigue: 2 }, cognition: { reframing: 1, persistence: 1 }, next: "s4_first" },
        { id: "s4_script_limit", label: "2분 40초가 어디서 정해졌는지 묻는다", effect: { legitimacy: 8, trust: 2, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s4_first" },
        { id: "s4_script_skip", label: "대본은 두고 첫 통화를 바로 걸게 한다", effect: { time: 5, trust: -2, legitimacy: -1, fatigue: 1 }, cognition: { risk: 2 }, next: "s4_first" },
      ],
    },
    s4_first: {
      phase: "SIDE 04 CALLS",
      title: "첫 백 통",
      speaker: "오민정",
      place: "KD은행 고객센터 · 야간 상담석 7번",
      clock: "23:50",
      text: "백 번째 통화가 끝납니다. 꽃집 사장은 '연말에 꽃이 제일 잘 나가는데요'라고 했고, 세탁소 사장은 숨만 쉬다 끊었고, 미용실 사장은 왜냐고 세 번 물었습니다. 오민정은 세 번 다 같은 문장으로 답했습니다. 내부 종합 평가 미달입니다, 죄송합니다. 공감 표현 숫자가 100을 넘어 초록색이 됩니다. 오민정이 헤드셋을 목으로 내리고 보리차를 마십니다. '왜냐고 물으면, 저도 몰라요. 모른다고 하면 감점이고요.' 화면의 통화 목록에 '고객이 끊음'이 일곱 줄 있습니다. 그 가운데 하나가 김포의 분식집입니다. 22시 50분, 통화 41초.",
      question: "같은 문장이 백 번 나갔고, 일곱 사람이 먼저 끊었습니다. 어떻게 하겠습니까?",
      memo: ["통화 100건 완료, 공감 표현 100회 넘음", "'고객이 끊음' 7건", "김포 분식집: 22:50, 통화 41초에 끊김", "오민정: '모른다고 하면 감점'"],
      triggers: ["injustice", "helplessness", "choice"],
      choices: [
        { id: "s4_first_words", label: "다음 통화부터 사유를 쉬운 말로 풀어 적어 준다", effect: { trust: 8, legitimacy: 2, time: -5, fatigue: 4 }, cognition: { reframing: 2 }, next: "s4_callback" },
        { id: "s4_first_pace", label: "2분 40초 안에 끝나도록 대본대로 돕는다", effect: { time: 6, trust: -3, humanCost: 2, fatigue: 2 }, cognition: { risk: 1 }, next: "s4_callback" },
        { id: "s4_first_mark", label: "먼저 끊은 일곱 건을 따로 표시해 둔다", effect: { legitimacy: 7, trust: 2, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s4_callback" },
      ],
    },
    s4_callback: {
      phase: "SIDE 04 CALLBACK",
      title: "다시 건 사람",
      speaker: "문정택",
      place: "KD은행 고객센터 · 야간 상담석 7번",
      clock: "12월 12일 (금) 00:40",
      text: "7번 상담석으로 전화가 들어옵니다. 41초 만에 끊었던 김포의 분식집, 문정택입니다. 뒤에서 기름 끓는 소리가 납니다. '아까는 미안했어요. 떡볶이 불 끄다가 받아서.' 그는 쉰여섯이고, 길 건너 물류센터 야간조가 새벽에 먹고 가는 떡볶이로 12년을 버텼습니다. '아까 온 문자 보니까 서류를 더 내면 다시 볼 수도 있다던데요. 뭘 내면 돼요?' 오민정이 대본을 내려다봅니다. 대본에는 '재심사는 어렵습니다'만 있습니다. 당신은 한기호 팀장이 넘겨준 출력물 맨 뒷장에서 작은 글씨를 찾습니다. 최근 석 달 매출이 기준의 80%를 넘으면, 팀장 이름으로 재검토를 요청할 수 있습니다.",
      question: "문정택이 무엇을 내면 되는지 묻고, 대본에는 답이 없습니다. 어떻게 하겠습니까?",
      memo: ["문정택(56): 김포 분식집, 12년", "단골: 길 건너 물류센터 야간조", "출력물 맨 뒷장: 석 달 매출이 기준의 80%를 넘으면 재검토 요청 가능", "요청은 팀장 이름으로만"],
      triggers: ["affection", "curiosity", "responsibility"],
      choices: [
        { id: "s4_callback_slip", label: "카드 매출 내역을 어떻게 뽑는지 같이 찾는다", effect: { trust: 9, humanCost: -2, time: -4, fatigue: 3 }, cognition: { persistence: 2 }, next: "s4_receipt" },
        { id: "s4_callback_rule", label: "맨 뒷장의 재검토 기준을 그대로 읽어 준다", effect: { legitimacy: 8, trust: 3, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s4_receipt" },
        { id: "s4_callback_script", label: "오민정이 대본대로 '어렵습니다'라고 하게 둔다", effect: { time: 5, trust: -4, humanCost: 3 }, cognition: { risk: 1 }, next: "s4_receipt" },
      ],
    },
    s4_receipt: {
      phase: "SIDE 04 RECEIPTS",
      title: "카드 단말기",
      speaker: "문정택",
      place: "KD은행 고객센터 · 야간 상담석 7번",
      clock: "01:30",
      text: "문정택이 한 번 더 겁니다. 그사이 문자로 사진 세 장이 와 있습니다. 카드 단말기에서 뽑은 달별 매출입니다. 9월 1,140만 원, 10월 980만 원, 11월 610만 원. 영수증 종이가 떡볶이 국물에 한 귀퉁이 젖어 있습니다. '11월부터 새벽 손님이 확 줄었어요. 오긴 오는데 안 사 먹어. 센터가 연말에 어떻게 된다는 말이 돈다나.' 당신이 석 달 평균을 냅니다. 한 달 910만 원. 기준은 한 달 1,000만 원이고, 그 80%는 800만 원입니다. 넘습니다. 문정택이 웃습니다. '그럼 된 거죠? 우리 집 떡볶이가 숫자로도 맛있네.' 오민정이 헤드셋 마이크를 손으로 막고 당신을 봅니다. 이 줄의 세부 사유 화면은 아직 열어 보지 않았습니다.",
      question: "문정택의 석 달 매출이 재검토 기준을 넘습니다. 어떻게 하겠습니까?",
      memo: ["카드 매출: 9월 1,140만 / 10월 980만 / 11월 610만 원", "석 달 평균 910만 원, 기준 1,000만 원의 80% = 800만 원", "11월부터 새벽 손님이 줄었음"],
      triggers: ["recognition", "affection", "curiosity"],
      choices: [
        { id: "s4_receipt_sum", label: "계산한 줄을 문정택에게 한 줄씩 읽어 준다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 2 }, cognition: { persistence: 1, reframing: 1 }, next: "s4_memo" },
        { id: "s4_receipt_file", label: "사진 세 장을 요청서에 붙일 수 있게 정리한다", effect: { legitimacy: 9, trust: 1, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s4_memo" },
        { id: "s4_receipt_listen", label: "새벽 손님 이야기를 끝까지 듣는다", effect: { trust: 6, humanCost: -1, time: -2, fatigue: 1 }, cognition: { reframing: 2 }, next: "s4_memo" },
      ],
    },
    s4_memo: {
      phase: "SIDE 04 RULE",
      title: "예외 없음",
      speaker: "한기호",
      place: "KD은행 고객센터 · 팀장석",
      clock: "02:20",
      text: "팀장석 모니터 테두리에 포스트잇이 하나 더 있습니다. '예외 없음. 12/12 09:00 본점 보고.' 한기호 팀장이 편의점 김밥 은박지를 접다가 당신을 봅니다. 재검토 요청을 올리면 오늘 보고는 312건 가운데 311건 완료, 1건 미완료가 됩니다. 완료율 99.7%. '0.3%가 제 연말 평가에 그대로 들어가요. 반올림도 안 해 줘요.' 그가 웃다가 멈춥니다. '저도 한 번 올려 봤어요. 4년 전에. 답이 석 달 뒤에 왔어요. 그 가게는 그사이에 문을 닫았고요.' 그가 '예외 없음'을 손톱으로 긁습니다. '이건 제가 쓴 게 아니에요. 받은 거예요. 누가 처음 썼는지는 저도 몰라요.'",
      question: "재검토 요청 한 건이 팀장의 완료율을 0.3% 깎습니다. 어떻게 하겠습니까?",
      memo: ["포스트잇: '예외 없음. 12/12 09:00 본점 보고'", "요청 1건 = 완료율 99.7%", "4년 전 한기호의 요청: 답은 석 달 뒤, 가게는 그사이 폐업"],
      triggers: ["system", "choice", "helplessness"],
      choices: [
        { id: "s4_memo_write", label: "요청서를 같이 쓰자고, 이름 칸은 비워 두자고 한다", effect: { trust: 8, legitimacy: 3, time: -4, fatigue: 3 }, cognition: { persistence: 2 }, next: "s4_queue" },
        { id: "s4_memo_count", label: "보고 양식에 '요청 중' 칸이 있는지 찾아본다", effect: { legitimacy: 9, time: -3, fatigue: 2 }, cognition: { inference: 1, reframing: 1 }, next: "s4_queue" },
        { id: "s4_memo_later", label: "남은 통화부터 끝내고 아침에 다시 얘기하자고 한다", effect: { time: 5, trust: -2, fatigue: -1 }, cognition: { risk: 1 }, next: "s4_bottom" },
      ],
    },
    s4_queue: {
      phase: "SIDE 04 QUEUE",
      title: "대기 열일곱",
      speaker: "오민정",
      place: "KD은행 고객센터 · 야간 상담석 7번",
      clock: "03:30",
      text: "새벽 3시 반, 들어오는 전화의 대기 줄이 열일곱입니다. 저녁에 통보를 받고 잠을 못 잔 사람들입니다. 오민정이 보리차를 다 마시고 보온병을 거꾸로 세웁니다. '저도 1월에 연장 심사 받아요. 해마다요.' 그는 은행 직원이 아니라 용역 회사 소속이고, 계약은 1년씩 이어집니다. 기준은 평균 통화 시간과 공감 표현 횟수입니다. '오늘 숫자는 좋아요. 312번 죄송했으니까.' 대기 줄이 열여덟이 됩니다. 오민정이 헤드셋을 다시 올리며 당신에게 메모지를 한 장 밀어 줍니다. '왜냐고 물으면 뭐라고 할지, 여기 적어 주세요. 대본 말고요.'",
      question: "대기 줄은 늘고, 오민정은 대본 아닌 말을 적어 달라고 합니다. 어떻게 하겠습니까?",
      memo: ["새벽 대기 줄: 17 -> 18", "오민정: 용역 회사 소속, 계약 1년씩, 1월 심사", "심사 기준: 평균 통화 시간, 공감 표현 횟수"],
      triggers: ["affection", "injustice", "trust"],
      choices: [
        { id: "s4_queue_note", label: "메모지에 사유를 쉬운 말로 세 줄 적어 준다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 3 }, cognition: { reframing: 2 }, next: "s4_bottom" },
        { id: "s4_queue_log", label: "대기 줄의 사람들이 무엇을 묻는지 한 줄씩 적는다", effect: { legitimacy: 8, trust: 2, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s4_bottom" },
        { id: "s4_queue_rest", label: "오민정에게 5분만 헤드셋을 내려놓자고 한다", effect: { trust: 5, humanCost: -2, time: 1, fatigue: -3 }, cognition: { persistence: 1 }, next: "s4_bottom" },
      ],
    },
    s4_bottom: {
      phase: "SIDE 04 THE LAST NAME",
      title: "맨 아래 이름",
      speaker: "오민정",
      place: "KD은행 고객센터 · 야간 상담석 7번",
      clock: "05:10",
      text: "목록의 311번째 줄까지 통화가 끝납니다. 312번째, 맨 아래 줄에 문정택의 이름이 남아 있습니다. 오민정이 일부러 미뤄 둔 줄입니다. '아침엔 제 목소리가 좀 나아요. 이분한테는 좀 나은 목소리로 걸고 싶어서.' 당신은 그제야 그 줄의 세부 사유 화면을 엽니다. 내부 종합 평가 미달. 그 밑에 작은 글씨로 한 줄이 더 있습니다. '상권 위험 가중: 인근 대형 거래처 플로우온 김포 센터, 관련 대출 2023-0412 관리 대상.' 3년 전 당신이 열한 쪽짜리 반대 의견을 쓴 그 대출입니다. 은행은 그 대출을 지키려고 길 하나를 통째로 위험하다고 적었습니다. 분식집은 그 길에 있습니다.",
      question: "문정택의 거절 사유는 그의 가게가 아니라 3년 전의 그 대출이었습니다. 어떻게 하겠습니까?",
      memo: ["312번째 줄: 문정택(오민정이 아침으로 미룸)", "세부 사유: '상권 위험 가중'", "'인근 대형 거래처 플로우온 김포 센터, 관련 대출 2023-0412'"],
      triggers: ["injustice", "recognition", "responsibility"],
      choices: [
        { id: "s4_bottom_read", label: "그 한 줄을 오민정에게 그대로 읽어 준다", effect: { trust: 8, humanCost: -1, time: -2, fatigue: 2 }, cognition: { reframing: 2 }, next: "s4_morning" },
        { id: "s4_bottom_shot", label: "세부 사유 화면을 시각이 보이게 찍어 둔다", effect: { legitimacy: 10, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s4_morning" },
        { id: "s4_bottom_lead", label: "문정택에게 걸기 전에 한기호 팀장을 부른다", effect: { legitimacy: 5, trust: 3, time: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s4_morning" },
      ],
    },
    s4_morning: {
      phase: "SIDE 04 REPORT",
      title: "08:40",
      speaker: "한기호",
      place: "KD은행 고객센터 · 팀장석",
      clock: "08:40, 본점 보고 20분 전",
      text: "창밖이 밝고, 주간조가 하나둘 출근 카드를 찍습니다. 팀장석 모니터에 본점 보고 양식이 떠 있습니다. 칸은 셋입니다. 통보 완료, 통보 미완료, 비고. 한기호 팀장이 세부 사유 화면을 오래 들여다봅니다. '상권 위험 가중이라.' 그가 두 손으로 눈을 비빕니다. '이런 건 우리 화면엔 안 떠요. 맨 위 한 줄만 뜨지.' 그는 보고 양식의 완료 칸에 커서를 올렸다가 내립니다. '9시에 저 칸이 312면, 오늘 밤 일은 없었던 일이 돼요. 311이면, 제 이름 옆에 빨간 점이 하나 찍히고요.' 그가 당신을 봅니다. '분석관님 생각엔 숫자로 뭘 남기는 게 맞아요?'",
      question: "보고 양식에는 완료, 미완료, 비고 세 칸뿐입니다. 어떻게 하겠습니까?",
      memo: ["본점 보고 양식: 통보 완료 / 미완료 / 비고", "312면 '완료율 100%', 311이면 팀장 이름 옆 빨간 점", "세부 사유는 팀장 화면에 뜨지 않음"],
      triggers: ["choice", "system", "trust"],
      choices: [
        { id: "s4_morning_honest", label: "311과 1, 숫자를 있는 그대로 적자고 한다", effect: { legitimacy: 8, trust: 3, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s4_aftershock" },
        { id: "s4_morning_note", label: "비고 칸에 무엇을 적을지부터 같이 정한다", effect: { legitimacy: 6, trust: 4, time: -3, fatigue: 2 }, cognition: { inference: 1, reframing: 1 }, next: "s4_aftershock" },
        { id: "s4_morning_call", label: "9시 전에 문정택에게 셋이 같이 전화한다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 3 }, cognition: { reframing: 2 }, next: "s4_aftershock" },
      ],
    },
    s4_aftershock: {
      phase: "SIDE 04 AFTERMATH",
      title: "아침 9시",
      speaker: "오민정",
      place: "KD은행 고객센터 · 야간 상담석 7번",
      clock: "08:55, 본점 보고 5분 전",
      text: "주간조 상담원이 7번 상담석 뒤에 서서 기다립니다. 오민정이 헤드셋을 벗어 소독용 솜으로 닦습니다. 화면 귀퉁이의 공감 표현 숫자는 312를 넘었습니다. 그는 메모지 한 장을 모니터에 붙였다가 다시 뗍니다. '이 자리는 아침이면 다른 사람 자리예요. 붙여 둬도 9시면 떼요.' 팀장석에서는 한기호 팀장이 보고 양식 앞에 앉아 있고, 문정택의 사진 세 장과 세부 사유 화면은 당신 휴대폰에 있습니다. 오민정이 가방을 메며 말합니다. '제 이름으로 남길 수 있는 건 상담 메모 한 줄이에요. 팀장님은 보고서고. 분석관님은 뭘 남기실 거예요?'",
      question: "본점 보고 5분 전입니다. 무엇을 남기겠습니까?",
      memo: ["오민정: 상담 메모 한 줄", "한기호: 본점 보고서", "당신의 휴대폰: 매출 사진 세 장, 세부 사유 화면", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "recognition", "affection"],
      choices: [
        { id: "s4_after_request", label: "매출 사진을 붙여 재검토 요청서를 올리게 한다", effect: { trust: 5, legitimacy: 4 }, cognition: { persistence: 2 }, next: "s4_result" },
        { id: "s4_after_code", label: "보고서 비고 칸에 세부 사유를 옮겨 적는다", effect: { legitimacy: 7, trust: 1 }, cognition: { inference: 2 }, next: "s4_result" },
        { id: "s4_after_script", label: "오민정의 상담 메모에 쉬운 말 세 줄을 남긴다", effect: { trust: 6, humanCost: -2 }, cognition: { reframing: 2 }, next: "s4_result" },
      ],
    },
  },
  outcomes: {
    s4_after_request: {
      title: "요청 중",
      text: "한기호 팀장이 사진 세 장을 붙이고, 요청자 칸에 자기 사번을 칩니다. 9시, 보고서가 올라갑니다. 통보 완료 311, 미완료 1, 비고 '재검토 요청 중'. 접수 번호가 뜹니다. 그가 그 번호를 포스트잇에 적어 '예외 없음' 위에 겹쳐 붙입니다. '석 달 걸리면, 석 달 동안 매일 볼게요.' 오후에 문정택에게서 사진이 한 장 옵니다. 불이 켜진 떡볶이 판입니다. '오늘도 열었어요.' 요청이 어떻게 될지는 아무도 말하지 않습니다.",
    },
    s4_after_code: {
      title: "비고",
      text: "당신이 부르고 한기호 팀장이 칩니다. 비고 칸에 한 줄. '312번 거절 사유: 상권 위험 가중, 관련 대출 2023-0412. 고객의 매출은 재검토 기준을 넘음.' 9시, 보고서가 올라갑니다. 답은 오지 않습니다. 팀장이 그 화면을 한 장 뽑아 모니터 옆에 붙입니다. '비고는 아무도 안 읽는대요.' 그러고는 혼자 덧붙입니다. '그래도 제 이름 밑에 적혔네요.' 다음 날 밤, 야간조 상담원 셋이 그 출력물 앞에서 걸음을 멈춥니다.",
    },
    s4_after_script: {
      title: "세 줄",
      text: "당신이 오민정의 상담 메모 칸에 세 줄을 적습니다. 사유는 고객의 가게가 아닐 수 있습니다. 석 달 매출로 재검토를 요청할 수 있습니다. 요청은 팀장이 올립니다. 오민정이 소리 내어 한 번 읽고 저장을 누릅니다. '대본 이탈이네요. 감점 0.5.' 그가 웃습니다. 다음 날 밤, 야간조 단체방에 사진이 올라옵니다. 7번 상담석 모니터에 그 세 줄이 손글씨로 붙어 있습니다. 그 밑에 누군가 적었습니다. '응원합니다는 빼도 되나요?'",
    },
  },
};
