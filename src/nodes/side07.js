/**
 * 번외 7 -- 금요일 17시 58분 (금융소재 기획 20261113 (a), 결정 Q1~Q5 모두 (1)).
 *
 * Friday 12 June 2026, the last day of 사건 31's five-day inspection, to the
 * Monday morning after: four overseas payments leave KD캐피탈 at 17:58, two
 * minutes before the end of the working week -- two to Hong Kong, one to
 * London, one to New York, 84억 원 in all. The first approver is 모지현, who
 * left the company on 31 March; the second is 「자금-공용02」, an account six
 * people share. On Monday a ransom notice is on every screen of the 자금부.
 *
 * The case is a race and a question. The race is the receiving banks' closing
 * hours (Hong Kong at 19:00 Seoul time, London at 01:00, New York on Saturday
 * at 06:00); the question is why a leaver's approval was still alive. It is
 * the habit 사건 44 turns on (four acquittals: approved from a shared account,
 * no approver can be named), seen three months before the verdict; this case
 * never names the trial, the verdict or the raid of 사건 32.
 *
 * It never says how anyone got in. Accounts, times and approval lines only:
 * no tool, no method, no weakness spelled out (기획 3절 6). The ransom is a
 * notice on a screen and nothing more.
 *
 * Speakers: 이민서 (KD데이터랩, who keeps a copy), 한지우 (the inspector, on
 * her last day), 석재우 (the 대표이사실, whose statement is the one-line
 * cover), and two new: 그레이스 웡, the payments investigator at the receiving
 * bank in Hong Kong, on the phone in English (said once, in the narration, as
 * the multinational cast plan asks), and 모지현, the leaver whose name the
 * payments carry. Both new faces are real photographs (neither is the case's
 * wrong side; docs/portrait-credits.md).
 *
 * The endings are the first line of Monday's 09:00 report: the money chased
 * (1.12 billion of 8.4 back, weeks later), the cause written (no money back,
 * the leavers' permissions struck, the shared account left as it is -- as it
 * still is in 사건 44), or the statement's line copied ("외부 세력의 정교한
 * 공격", 사건 37's echo).
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): ten
 * scenes, `s7_aftershock`'s three cards to `s7_result`, three `outcomes`.
 */
export const side07 = {
  id: "side07",
  label: "번외 7",
  title: "금요일 17시 58분",
  startNode: "s7_start",
  // A table from the week of 사건 31, not this device's season.
  startState: {
    resources: { time: 46, capital: 52, trust: 50, legitimacy: 50, humanCost: 24, fatigue: 40 },
  },
  nodes: {
    s7_start: {
      phase: "SIDE 07 BRIEFING",
      title: "17시 58분",
      speaker: "이민서",
      place: "KD캐피탈 본사 · 자금부",
      clock: "6월 12일 (금) 18:06, 퇴근 시간 6분 뒤",
      lead: "6월의 금요일 저녁, 금감원 정기검사의 마지막 날. 자금부 모니터에 승인 완료 알림 네 줄이 떠 있습니다.",
      text: "자금부 사람들은 이미 가방을 멨습니다. 화면에는 17시 58분에 승인된 해외 송금 네 건. 홍콩 두 곳, 런던, 뉴욕. 합계 84억 원. 장비 공급사 이름은 늘 보던 것인데, 받는 계좌는 처음 보는 번호입니다. KD데이터랩에서 기록 경보를 본 이민서가 전화를 겁니다. '분석관님, 승인자 칸 보셨어요? 첫 줄은 모지현 과장님이에요. 3월에 퇴사하신 분.' 잠깐 숨을 고릅니다. '두 번째 승인은 자금-공용02. 누가 눌렀는지는 계정이 몰라요.' 창밖에서 퇴근 버스가 출발합니다.",
      question: "퇴사자와 공용 계정의 이름으로 84억 원이 나갔습니다. 무엇부터 하겠습니까?",
      memo: ["17:58 승인, 해외 송금 4건, 합계 84억 원", "받는 곳: 홍콩 2곳, 런던, 뉴욕", "승인 1: 모지현(3월 31일 퇴사) / 승인 2: 자금-공용02"],
      triggers: ["responsibility", "curiosity", "fear"],
      choices: [
        { id: "s7_start_stay", label: "가방을 내려놓고 자금부에 남는다", effect: { trust: 6, legitimacy: 4, time: -3, fatigue: 4 }, cognition: { persistence: 2 }, next: "s7_lines" },
        { id: "s7_start_log", label: "이민서에게 기록 사본부터 떠 달라고 한다", effect: { legitimacy: 8, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s7_lines" },
        { id: "s7_start_call", label: "퇴근한 자금부장에게 먼저 전화한다", effect: { time: 3, trust: -2, fatigue: 1 }, cognition: { risk: 1 }, next: "s7_lines" },
      ],
    },
    s7_lines: {
      phase: "SIDE 07 BOARD",
      title: "네 줄",
      speaker: "이민서",
      place: "자금부 · 화이트보드 앞",
      clock: "18:15",
      text: "당신이 화이트보드에 네 줄을 적고, 이민서가 전화로 은행마다 마감을 불러 줍니다. 홍콩 두 곳은 서울 시각 19시에 닫습니다. 45분 남았습니다. 런던은 새벽 1시, 뉴욕은 토요일 아침 6시. 금요일에 닫으면 월요일에야 다시 엽니다. 정지 요청(받는 쪽 은행에 돈을 내보내지 말아 달라고 부탁하는 공문)은 한 통씩, 책임자 서명이 있어야 나갑니다. 오늘 이 층에서 서명할 수 있는 사람은 당신뿐입니다. 이민서가 묻습니다. '제일 큰 거부터요, 제일 빨리 닫는 데부터요?'",
      question: "45분 안에 한 통을 먼저 보내야 합니다. 어떤 순서로 하겠습니까?",
      memo: ["홍콩 31억 · 홍콩 9억: 19:00 마감", "런던 18억: 01:00 / 뉴욕 26억: 토 06:00", "정지 요청: 한 통씩, 책임자 서명"],
      triggers: ["choice", "system", "responsibility"],
      choices: [
        { id: "s7_lines_big", label: "홍콩 31억 건부터 정지 요청을 쓴다", effect: { capital: 6, legitimacy: 3, time: -4, fatigue: 3 }, cognition: { inference: 2 }, next: "s7_hongkong" },
        { id: "s7_lines_close", label: "닫는 순서대로 홍콩 두 건부터 보낸다", effect: { legitimacy: 5, trust: 2, time: -3, fatigue: 3 }, cognition: { persistence: 1, inference: 1 }, next: "s7_hongkong" },
        { id: "s7_lines_up", label: "대표이사실에 보고하고 지시를 기다린다", effect: { time: 4, legitimacy: -3, capital: -4, fatigue: -1 }, cognition: { risk: 2 }, next: "s7_inspector" },
      ],
    },
    s7_hongkong: {
      phase: "SIDE 07 CALL",
      title: "닫히는 창구",
      speaker: "그레이스 웡",
      place: "자금부 · 국제 전화",
      clock: "18:41 (홍콩 17:41)",
      text: "받는 쪽 홍콩 은행의 송금 조사 담당 그레이스 웡이 전화를 받습니다. 통화는 영어로 오가고, 당신은 들은 대로 수첩에 옮겨 적습니다. '요청서는 받았습니다. 마감 전에 와서 다행이에요.' 자판 소리가 멈춥니다. '다만 저희 규정상 보낸 쪽 승인자에게 확인 전화를 드려야 해요. 적힌 두 분 중 한 분은 퇴사하셨고, 다른 하나는 사람이 아니라 계정이네요.' 잠깐의 침묵. '분석관님, 저는 누구에게 전화하면 되나요?' 시계는 18시 44분입니다.",
      question: "받는 쪽 은행이 승인한 사람을 묻습니다. 어떻게 답하겠습니까?",
      memo: ["그레이스 웡: 홍콩 수취 은행 송금 조사 담당", "규정: 보낸 쪽 승인자에게 확인 전화", "승인자 둘: 퇴사자 한 명, 계정 하나"],
      triggers: ["system", "injustice", "responsibility"],
      choices: [
        { id: "s7_hk_self", label: "내 이름과 번호를 대고 내가 확인한다고 한다", effect: { trust: 6, legitimacy: 6, time: -3, fatigue: 4 }, cognition: { persistence: 2 }, next: "s7_inspector" },
        { id: "s7_hk_truth", label: "승인자를 특정할 수 없다고 그대로 말한다", effect: { legitimacy: 8, capital: -2, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s7_inspector" },
        { id: "s7_hk_later", label: "확인은 월요일에 하자며 접수부터 부탁한다", effect: { time: 4, capital: -3, trust: -2 }, cognition: { risk: 1 }, next: "s7_account" },
      ],
    },
    s7_inspector: {
      phase: "SIDE 07 LOBBY",
      title: "검사 마지막 날",
      speaker: "한지우",
      place: "KD캐피탈 본사 · 로비",
      clock: "19:30",
      text: "로비에 검은 캐리어 일곱 개가 줄지어 있습니다. 닷새짜리 정기검사가 오늘로 끝났습니다. 한지우가 캐리어 손잡이를 쥔 채 당신의 얼굴을 봅니다. '질문 하나만 드리겠습니다. 오늘 몇 시에, 무슨 일이 있었습니까.' 당신이 네 줄을 말하자 그가 수첩을 다시 꺼내 시각을 분 단위로 적습니다. '금융사고는 알게 된 즉시 보고가 원칙입니다. 규정입니다.' 펜이 멈춥니다. '승인자가 공용 계정이면, 보고서 승인자 칸에는 무엇을 쓰실 겁니까.' 그가 캐리어를 벽에 다시 세웁니다.",
      question: "검사역이 떠나다 말고 멈춰 섰습니다. 어떻게 하겠습니까?",
      memo: ["정기검사 5일차, 마지막 날", "한지우: '알게 된 즉시 보고가 원칙'", "보고서 승인자 칸: 아직 빈칸"],
      triggers: ["trust", "system", "fear"],
      choices: [
        { id: "s7_insp_tell", label: "아는 것과 모르는 것을 나눠 그대로 말한다", effect: { legitimacy: 9, trust: 3, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s7_account" },
        { id: "s7_insp_stay", label: "보고서 첫 장을 같이 봐 달라고 부탁한다", effect: { trust: 7, legitimacy: 4, time: -3, fatigue: 2 }, cognition: { reframing: 2 }, next: "s7_account" },
        { id: "s7_insp_wait", label: "회사 공식 보고가 나갈 때까지 말을 아낀다", effect: { time: 3, trust: -4, legitimacy: -3 }, cognition: { risk: 2 }, next: "s7_account" },
      ],
    },
    s7_account: {
      phase: "SIDE 07 RECORD",
      title: "석 달 된 계정",
      speaker: "이민서",
      place: "자금부 · 이민서의 노트북 앞",
      clock: "21:30",
      text: "이민서가 노트북을 들고 자금부로 왔습니다. '사본은 떠 뒀어요. 데이터랩 서버에 한 벌, 여기 한 벌.' 화면에 표 두 개가 나란히 뜹니다. 인사 시스템에서 모지현은 3월 31일 퇴사. 해외 송금 권한 목록에서는 아직 '승인 가능'. 두 목록은 서로를 모릅니다. 퇴사 날 모지현이 보낸 메일도 있습니다. '제 송금 승인 권한 꼭 지워 주세요.' 답장은 한 줄, '확인했습니다.' 이민서가 사원증을 뒤집어 쥡니다. '어떻게 들어왔는지는 저도 몰라요. 근데 누구 이름으로 나갔는지는 알아요. 그게 더 무서워요.'",
      question: "지워 달라고 한 권한이 석 달 동안 살아 있었습니다. 무엇을 하겠습니까?",
      memo: ["인사 시스템: 모지현 3월 31일 퇴사", "송금 권한 목록: 아직 '승인 가능'", "퇴사 날 메일: '권한 꼭 지워 주세요' → '확인했습니다'"],
      triggers: ["injustice", "system", "protection"],
      choices: [
        { id: "s7_acc_mail", label: "메일 두 통을 시각이 보이게 출력해 둔다", effect: { legitimacy: 9, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s7_night" },
        { id: "s7_acc_list", label: "권한 목록에 남은 다른 퇴사자도 센다", effect: { legitimacy: 6, trust: 2, time: -4, fatigue: 4 }, cognition: { persistence: 2 }, next: "s7_night" },
        { id: "s7_acc_call", label: "모지현에게 내일 만나자고 연락한다", effect: { trust: 5, humanCost: -2, time: -2, fatigue: 2 }, cognition: { reframing: 1, persistence: 1 }, next: "s7_former" },
      ],
    },
    s7_night: {
      phase: "SIDE 07 NIGHT",
      title: "남은 잔액",
      speaker: "그레이스 웡",
      place: "자금부 · 국제 전화",
      clock: "22:50 (홍콩 21:50)",
      text: "홍콩 은행의 송금 조사 담당 그레이스 웡이 퇴근하지 않고 전화를 겁니다. 영어 통화입니다. '저희 쪽 이상거래 확인에도 걸렸어요. 받는 계좌를 묶었습니다. 다만 31억 가운데 남은 건 11억쯤이에요. 나머지는 오후에 벌써 다른 계좌로 옮겨졌고요.' 두 번째 홍콩 건은 다른 은행이라 그도 모릅니다. 런던 마감까지 두 시간. 그레이스 웡이 덧붙입니다. '묶은 돈을 돌려드리는 건 제가 정하지 않아요. 서류와 법원이 정하고, 몇 주 걸려요.' 목소리가 조금 낮아집니다. '퇴사한 분 이름이 승인자 칸에 있는 거, 그분은 아세요?'",
      question: "묶인 돈은 일부이고, 런던 마감이 다가옵니다. 어떻게 하겠습니까?",
      memo: ["홍콩 31억 건: 받는 계좌 동결, 남은 잔액 약 11억", "돌려받는 건: 서류와 법원, 몇 주", "런던 마감 01:00"],
      triggers: ["helplessness", "responsibility", "choice"],
      choices: [
        { id: "s7_night_london", label: "런던 요청서에 서명해 바로 보낸다", effect: { capital: 5, legitimacy: 3, time: -3, fatigue: 4 }, cognition: { persistence: 2 }, next: "s7_former" },
        { id: "s7_night_paper", label: "동결 확인을 문서로 달라고 부탁한다", effect: { legitimacy: 8, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s7_former" },
        { id: "s7_night_answer", label: "그분은 아직 모른다고 솔직히 답한다", effect: { trust: 6, humanCost: -2, time: -1, fatigue: 1 }, cognition: { reframing: 2 }, next: "s7_former" },
      ],
    },
    s7_former: {
      phase: "SIDE 07 SATURDAY",
      title: "퇴사자",
      speaker: "모지현",
      place: "상암동 · 아파트 단지 앞 카페",
      clock: "6월 13일 (토) 11:00",
      text: "모지현은 유모차를 카페 문 옆에 세워 두고 앉습니다. 3월에 KD캐피탈을 떠나 지금은 집 근처 작은 회사의 경리로 일합니다. 해외 송금 승인만 9년. 당신이 승인 기록을 내밀자 그가 오래 들여다봅니다. '17시 58분이면 저 그때 애 데리러 어린이집 앞에 있었어요.' 휴대폰을 열어 퇴사 날의 메일과 '확인했습니다'를 보여 줍니다. '제가 지워 달라고 했잖아요.' 목소리가 떨리다 멈춥니다. '그 계정, 9년 동안 제 이름이었어요. 이제 제 이름으로 84억이 나간 거예요?'",
      question: "자기 이름으로 나간 돈 앞에서 모지현이 묻습니다. 어떻게 하겠습니까?",
      memo: ["모지현: 해외 송금 승인 9년, 3월 31일 퇴사", "17:58 그는 어린이집 앞에 있었음", "그의 휴대폰: 퇴사 날 메일과 '확인했습니다'"],
      triggers: ["affection", "injustice", "protection"],
      choices: [
        { id: "s7_former_name", label: "그의 잘못이 아님을 기록에 적겠다고 한다", effect: { trust: 9, humanCost: -3, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s7_statement" },
        { id: "s7_former_time", label: "어린이집 출입 기록을 같이 챙겨 둔다", effect: { legitimacy: 8, trust: 3, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s7_statement" },
        { id: "s7_former_quiet", label: "회사가 연락할 때까지 기다려 달라고 한다", effect: { time: 3, trust: -4, humanCost: 2 }, cognition: { risk: 1 }, next: "s7_monday" },
      ],
    },
    s7_statement: {
      phase: "SIDE 07 STATEMENT",
      title: "한 줄",
      speaker: "석재우",
      place: "KD캐피탈 본사 · 대표이사실 앞",
      clock: "6월 14일 (일) 16:00",
      text: "일요일 오후, 대표이사실 앞 복도는 조용합니다. 석재우가 소매를 두 번 접은 셔츠 차림으로 종이 한 장을 내밉니다. 월요일 아침에 낼 입장문 초안입니다. '외부 세력의 정교한 공격으로 일부 해외 송금에 차질이 있었으며, 고객 피해는 없습니다.' 그가 당신 어깨의 먼지를 털어 줍니다. '정리본이야. 다들 편하게. 퇴사자 이름이나 공용 계정 같은 건 수사기관이 알아서 볼 일이고.' 그가 웃습니다. '자네는 금요일에 잘했어. 그러니까 이제 쉬어.' 초안 아래에 서명 칸이 하나 비어 있습니다.",
      question: "84억 원이 '정교한 공격' 한 줄이 되려 합니다. 어떻게 하겠습니까?",
      memo: ["입장문 초안: '외부 세력의 정교한 공격'", "'고객 피해는 없습니다'", "빠진 것: 퇴사자 권한, 공용 계정"],
      triggers: ["injustice", "system", "choice"],
      choices: [
        { id: "s7_stmt_add", label: "초안 아래에 빠진 두 줄을 손으로 적는다", effect: { legitimacy: 8, trust: 2, capital: -2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s7_monday" },
        { id: "s7_stmt_ask", label: "'정교한'의 근거가 무엇이냐고 묻는다", effect: { legitimacy: 6, trust: 1, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s7_monday" },
        { id: "s7_stmt_take", label: "초안을 받아 들고 아무 말 없이 나온다", effect: { time: 4, trust: -3, legitimacy: -2, fatigue: -1 }, cognition: { risk: 1 }, next: "s7_monday" },
      ],
    },
    s7_monday: {
      phase: "SIDE 07 MONDAY",
      title: "월요일 아침",
      speaker: "이민서",
      place: "자금부",
      clock: "6월 15일 (월) 08:40",
      text: "출근한 자금부 모니터마다 같은 검은 화면이 떠 있습니다. 파일을 잠갔으니 풀고 싶으면 연락하라는 안내문, 그리고 줄어드는 숫자. 맨 먼저 잠긴 폴더 이름은 '해외송금_2026_06'입니다. 사람들이 자기 자리 앞에서 머뭇거립니다. 이민서가 들어와 자기 노트북을 엽니다. '금요일 밤에 떠 둔 사본, 그대로 있어요. 데이터랩 쪽은 안 잠겼고요.' 그가 사원증을 뒤집어 쥡니다. '금요일 일을 지우고 싶은 사람이 있으면, 이제 사본은 이거 한 벌이에요.'",
      question: "금요일의 기록이 잠겼고, 사본은 한 벌 남았습니다. 어떻게 하겠습니까?",
      memo: ["08:40 자금부 화면마다 랜섬 안내문", "먼저 잠긴 폴더: 해외송금_2026_06", "금요일 밤 사본: 데이터랩에 그대로"],
      triggers: ["fear", "protection", "responsibility"],
      choices: [
        { id: "s7_mon_copy", label: "사본을 한 벌 더 떠서 검사역에게 맡긴다", effect: { legitimacy: 8, trust: 3, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s7_aftershock" },
        { id: "s7_mon_people", label: "보안팀이 올 때까지 사람들 곁에 있는다", effect: { trust: 7, humanCost: -2, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s7_aftershock" },
        { id: "s7_mon_minseo", label: "사본을 이민서 혼자 지키지 않게 한다", effect: { trust: 6, humanCost: -2, legitimacy: 2, fatigue: 2 }, cognition: { reframing: 2 }, next: "s7_aftershock" },
      ],
    },
    s7_aftershock: {
      phase: "SIDE 07 AFTERMATH",
      title: "아홉 시 보고",
      speaker: "한지우",
      place: "자금부 · 회의실",
      clock: "08:55, 보고 5분 전",
      text: "한지우가 검은 캐리어 하나만 끌고 다시 왔습니다. 금융사고 보고를 받는 것도 감독원의 일입니다. 회의실 탁자에는 세 가지가 놓여 있습니다. 묶인 홍콩 계좌의 잔액을 쫓는 정지 요청 묶음, 모지현의 메일과 권한 목록을 붙인 원인 메모, 그리고 석재우의 입장문 초안. 런던과 뉴욕에서는 아직 답이 없습니다. 한지우가 수첩을 펴고 시각을 적습니다. '보고서는 한 장입니다. 첫 줄에 무엇을 쓰실지는 분석관님이 정하십시오. 저는 받은 대로 적겠습니다. 규정입니다.'",
      question: "보고서 첫 줄은 하나입니다. 무엇을 쓰겠습니까?",
      memo: ["홍콩 31억 건: 동결 약 11억, 돌려받는 건 몇 주 뒤", "런던·뉴욕: 답 없음", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "responsibility", "recognition"],
      choices: [
        { id: "s7_after_money", label: "남은 돈을 쫓는 정지 요청을 첫 줄에 둔다", effect: { capital: 6, trust: 2 }, cognition: { persistence: 2 }, next: "s7_result" },
        { id: "s7_after_cause", label: "퇴사자 권한과 공용 계정을 첫 줄에 쓴다", effect: { legitimacy: 7, trust: 1 }, cognition: { inference: 2 }, next: "s7_result" },
        { id: "s7_after_line", label: "입장문의 한 줄을 그대로 옮긴다", effect: { time: 4, legitimacy: -3 }, cognition: { risk: 1 }, next: "s7_result" },
      ],
    },
  },
  outcomes: {
    s7_after_money: {
      title: "11억",
      text: "당신은 첫 줄에 숫자를 씁니다. 홍콩 동결 약 11억, 홍콩 두 번째 9억, 런던 18억, 뉴욕 26억. 그 주 내내 정지 요청과 확인 서류가 오갑니다. 3주 뒤 그레이스 웡에게서 짧은 메일이 옵니다. '법원 결정이 나왔습니다. 묶어 둔 돈은 돌려보내 드려요.' 11억 2천만 원이 돌아옵니다. 나머지 72억 8천만 원에 대해서는 아무 데서도 답이 오지 않습니다. 메일 끝에 그가 한 줄을 덧붙였습니다. '모 과장님께 안부 전해 주세요. 그분께 확인 전화를 걸 뻔했어요.'",
    },
    s7_after_cause: {
      title: "지우지 않은 권한",
      text: "당신은 첫 줄에 이렇게 씁니다. '퇴사자 권한 미회수, 공용 계정 승인. 승인자 특정 불가.' 돈은 돌아오지 않습니다. 홍콩의 동결도 서류가 늦어 풀립니다. 대신 한지우가 그 한 장을 검사 결과 보고서 맨 뒤에 붙입니다. '지적 사항 하나 추가합니다.' 다음 주 모지현에게서 문자가 옵니다. 경찰 조사에서 그 보고서 사본을 냈더니 질문이 하나로 끝났다고. '제 이름은 이제 피해자 칸에 있어요.' 권한 목록에서 퇴사자 열한 명의 이름이 지워집니다. 공용 계정은 그대로입니다.",
    },
    s7_after_line: {
      title: "외부 공격",
      text: "당신은 입장문의 한 줄을 옮겨 적습니다. '외부 세력의 정교한 공격.' 오전 열 시, 같은 문장이 보도자료가 됩니다. 저녁 뉴스는 검은 안내문 화면을 잠깐 보여 주고 지나갑니다. 퇴사자의 이름도, 공용 계정도 어디에도 나오지 않습니다. 한지우는 받은 대로 적고, 수첩에 시각을 한 번 더 씁니다. 사흘 뒤 모지현에게서 전화가 옵니다. 경찰이 승인 기록 첫 줄의 이름을 물었다고. '외부 공격이라면서요. 그런데 왜 저한테 물어요?' 당신은 대답할 말을 찾지 못합니다.",
    },
  },
};
