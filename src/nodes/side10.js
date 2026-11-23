/**
 * 번외 10 -- 인사 없이 (Season 2026-12, owner's answer 11-20: 10-1).
 *
 * Saturday 13 September 2025, 21:00, to the Sunday's dawn: two days after
 * 사건 05's 원인 회의, whose 회의록 was left with seven blank signatures and
 * whose last scene finds 오진우's desk empty ("인사도 없이 갔어요"), and
 * before 사건 06's 위원회. The 312 red dots on 사건 05's wall map are the
 * homes 돌봄 플랫폼 온새 did not visit the day before: its 배차 시스템 ranked
 * them by a 가중치표 that 오진우 signed off last, in the six minutes his
 * review was allowed.
 *
 * Where he went: the night 수동 배차 of 온새's 강서 거점, riding in the
 * passenger seat of 변정순, 58, a 방문 요양보호사 eleven years with 온새, to
 * the houses the weights pushed back. She keeps the hand list in a notebook
 * with a column of her own, 「말 안 하는 집」. The automatic 배차 comes back
 * on Monday at 06:00 with the weights as they are.
 *
 * Speakers: 도윤하 and 오진우 (existing) and one new, 변정순 (a photograph,
 * docs/portrait-credits.md). The households do not speak by name. The case
 * says nothing of 사건 06's 위원회 or of a 사직서: it ends before them.
 *
 * The endings are what goes on the one page 오진우 hands in on Monday: her
 * column written into the 가중치표 / every one of the fourteen approvals and
 * the six-minute limit, by name / nothing, and a lift home. None changes
 * 사건 05 or 06.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): nine
 * scenes, `s10_aftershock`'s three cards to `s10_result`, three `outcomes`.
 */
export const side10 = {
  id: "side10",
  label: "번외 10",
  title: "인사 없이",
  startNode: "s10_start",
  // A table from the September of 사건 05, not this device's season.
  startState: {
    resources: { time: 50, capital: 60, trust: 46, legitimacy: 48, humanCost: 30, fatigue: 38 },
  },
  nodes: {
    s10_start: {
      phase: "SIDE 10 BRIEFING",
      title: "명패",
      speaker: "도윤하",
      place: "트리거랩 · 분석관실",
      clock: "9월 13일 (토) 21:00, 원인 회의 이틀 뒤",
      lead: "토요일 밤의 분석관실. 창가 책상에는 짐이 없고 명패 하나만 남아 있습니다.",
      text: "도윤하가 명패를 손가락으로 톡 칩니다. 검토자 오진우. 원인 회의 뒤로 이틀째 전화가 꺼져 있습니다. '인사도 없이 간 사람치고 차는 부지런히 다니네요.' 그가 법인카드 주차 내역을 보여 줍니다. 어젯밤과 그젯밤, 온새 돌봄 강서 거점 주차장, 밤 9시부터 아침 7시까지. 빨간 점 312개가 찍혔던 그 회사입니다. '사고 난 회사 주차장에서 밤을 새우는 이유가 뭘까요. 저는 사과문 쓰러 간 건 아니라고 봐요.'",
      question: "오진우가 이틀째 밤을 온새 거점에서 보냅니다. 어떻게 하겠습니까?",
      memo: ["오진우: 원인 회의 뒤 이틀째 연락 없음", "주차 내역: 온새 돌봄 강서 거점, 밤 9시~아침 7시", "312: 사고 전날 방문 돌봄을 받지 못한 집"],
      triggers: ["curiosity", "responsibility", "affection"],
      choices: [
        { id: "s10_start_go", label: "지금 강서 거점으로 간다", effect: { trust: 4, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s10_depot" },
        { id: "s10_start_log", label: "주차 내역을 출력해 들고 간다", effect: { legitimacy: 5, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s10_depot" },
        { id: "s10_start_note", label: "책상에 쪽지만 남기고 기다린다", effect: { time: 3, trust: -2, fatigue: -1 }, cognition: { risk: 1 }, next: "s10_depot" },
      ],
    },
    s10_depot: {
      phase: "SIDE 10 DEPOT",
      title: "수동 배차",
      speaker: "변정순",
      place: "온새 돌봄 강서 거점 · 배차실",
      clock: "22:10",
      text: "강서 거점 배차실의 화이트보드에 손글씨 명단이 빼곡합니다. 사고 뒤로 배차를 사람이 직접 하고 있습니다. 312 가운데 지운 줄이 271, 남은 줄이 41. 요양보호사 변정순이 마커 뚜껑을 입으로 물고 말합니다. 온새에서 11년째 집을 도는 사람입니다. '그 젊은 사람이요? 이틀째 내 차 조수석에 타요. 커피는 안 마시고 표만 봐요.' 그가 명단 옆 공책을 툭 칩니다. 맨 끝 칸 머리에 볼펜으로 「말 안 하는 집」. '오늘은 마흔한 집. 같이 탈 거면 뒷자리예요.'",
      question: "남은 41집을 도는 차에 자리가 하나 있습니다. 어떻게 하겠습니까?",
      memo: ["수동 배차: 312 가운데 271 끝, 남은 41집", "변정순(58): 방문 요양보호사, 온새 11년", "공책 맨 끝 칸: 「말 안 하는 집」"],
      triggers: ["curiosity", "protection", "system"],
      choices: [
        { id: "s10_depot_ride", label: "뒷자리에 타서 같이 돈다", effect: { trust: 5, time: -3, fatigue: 4 }, cognition: { persistence: 2 }, next: "s10_car" },
        { id: "s10_depot_copy", label: "공책의 맨 끝 칸부터 사진으로 찍는다", effect: { legitimacy: 6, trust: -1, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s10_car" },
        { id: "s10_depot_ask", label: "오진우가 무엇을 묻고 다녔는지 묻는다", effect: { legitimacy: 3, trust: 2, time: -2, fatigue: 2 }, cognition: { reframing: 2 }, next: "s10_car" },
      ],
    },
    s10_car: {
      phase: "SIDE 10 CAR",
      title: "조수석",
      speaker: "오진우",
      place: "강서구 · 변정순의 경차 안",
      clock: "22:40",
      text: "오진우의 무릎 위에 가중치표 출력물이 있습니다. 배차 순서를 정할 때 조건마다 얼마나 무겁게 따질지 적은 표입니다. 여백에 연필 숫자가 가득합니다. 그는 당신을 보고도 놀라지 않습니다. '도윤하 씨가 주차 내역을 볼 줄 알았습니다.' 그가 표의 두 줄을 짚습니다. 민원 이력 없음, 순번 두 칸 아래로. 연락 안 됨, 세 칸 아래로. '저는 이 표를 6분 보고 넘겼습니다. 그래서 이 표가 민 집을 하나씩 보는 데는 6분보다 오래 걸려야 맞다고 생각했어요.'",
      question: "오진우는 자기가 넘긴 표가 민 집을 직접 보고 있습니다. 어떻게 하겠습니까?",
      memo: ["민원 이력 없음: 순번 두 칸 아래", "연락 안 됨: 순번 세 칸 아래", "오진우: '6분보다 오래 걸려야 맞다'"],
      triggers: ["responsibility", "recognition", "helplessness"],
      choices: [
        { id: "s10_car_why", label: "왜 인사도 없이 갔는지 묻는다", effect: { trust: 4, legitimacy: -1, time: -1, fatigue: 1 }, cognition: { reframing: 2 }, next: "s10_house" },
        { id: "s10_car_table", label: "여백의 숫자를 같이 맞춰 본다", effect: { legitimacy: 6, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s10_house" },
        { id: "s10_car_quiet", label: "아무것도 묻지 않고 같이 간다", effect: { trust: 3, time: 1, fatigue: 1 }, cognition: { risk: 1 }, next: "s10_house" },
      ],
    },
    s10_house: {
      phase: "SIDE 10 HOUSE",
      title: "괜찮아요",
      speaker: "변정순",
      place: "강서구 · 다세대 주택 반지하",
      clock: "23:20",
      text: "첫 집은 반지하입니다. 여든두 살 할머니가 문을 열자마자 사과합니다. 이 늦은 밤에 와 줘서 미안하다고, 자기는 괜찮다고. 싱크대에는 이틀 전 약 봉투가 뜯기지 않은 채 있습니다. 변정순이 신발을 벗으며 말합니다. '이 집은 민원을 한 번도 안 넣었어요. 전화도 없고요. 그러니까 표는 이 집이 안 급하대요.' 그가 약 봉투를 열어 아침 몫을 따로 담습니다. '괜찮다는 사람이 제일 안 괜찮아요. 11년 해 보면 알아요.'",
      question: "괜찮다는 집이 표에서는 안 급한 집이 됩니다. 어떻게 하겠습니까?",
      memo: ["할머니(82): 민원 0회, 전화 없음", "이틀 전 약 봉투가 그대로", "변정순: '괜찮다는 사람이 제일 안 괜찮아요'"],
      triggers: ["affection", "injustice", "protection"],
      choices: [
        { id: "s10_house_help", label: "약 정리를 거들고 시간을 적는다", effect: { trust: 6, humanCost: -2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s10_weights" },
        { id: "s10_house_record", label: "이 집이 밀린 칸을 표에서 찾는다", effect: { legitimacy: 6, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s10_weights" },
        { id: "s10_house_wait", label: "차에서 기다리며 다음 집을 확인한다", effect: { time: 3, trust: -2, humanCost: 1 }, cognition: { risk: 1 }, next: "s10_weights" },
      ],
    },
    s10_weights: {
      phase: "SIDE 10 WEIGHTS",
      title: "열네 장",
      speaker: "오진우",
      place: "강서구 · 변정순의 경차 안",
      clock: "9월 14일 (일) 00:30",
      text: "편의점 앞에 차를 세우고 오진우가 서류철을 엽니다. 가중치표가 지금 모양이 되기까지 승인 문서가 열네 장입니다. 확인 전화는 두 번에서 한 번으로, 연락 안 되는 집은 뒤로, 검토 시간은 6분으로. 장마다 작은 양보이고, 승인자 이름은 장마다 다릅니다. 마지막 장의 마지막 칸이 그의 이름입니다. '마지막 칸이라 제 이름만 기사에 남았습니다. 억울하다는 말은 아닙니다.' 그가 삼각김밥 포장을 반쯤 뜯다 멈춥니다. '열세 명도 다 6분쯤 봤을 거예요.'",
      question: "열네 장의 승인 가운데 마지막 이름만 남았습니다. 어떻게 하겠습니까?",
      memo: ["승인 문서 14장, 승인자 이름이 장마다 다름", "검토 제한시간 6분도 그 가운데 한 장", "기사에 남은 이름: 마지막 칸의 오진우"],
      triggers: ["system", "injustice", "responsibility"],
      choices: [
        { id: "s10_weights_list", label: "열네 명의 이름을 순서대로 옮겨 적는다", effect: { legitimacy: 7, trust: -1, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s10_former" },
        { id: "s10_weights_six", label: "6분을 정한 장부터 찾아 묻는다", effect: { legitimacy: 5, time: -3, fatigue: 2 }, cognition: { persistence: 2 }, next: "s10_former" },
        { id: "s10_weights_eat", label: "삼각김밥부터 먹으라고 한다", effect: { trust: 5, time: -1, fatigue: -2 }, cognition: { reframing: 2 }, next: "s10_former" },
      ],
    },
    s10_former: {
      phase: "SIDE 10 NIGHT SHIFT",
      title: "야간조",
      speaker: "변정순",
      place: "강서구 · 원룸 4층",
      clock: "01:40",
      text: "엘리베이터 없는 4층 원룸. 쉰셋의 남자가 문을 열고 허리를 펴지 못한 채 섭니다. 작년까지 플로우온 물류센터 야간조였고, 정리된 뒤 올해 돌봄 대상이 됐습니다. 지난 이틀, 그는 아무 데도 전화하지 않았습니다. '바쁜 데 많을 텐데 나까지 뭘.' 변정순이 파스를 갈아 붙이는 동안 그가 오진우를 봅니다. '은행 분이에요? 우리 센터 정리할 때도 은행 분들이 왔었는데.' 오진우가 대답하지 못합니다. 남자가 웃습니다. '아니, 고맙다고요. 밤에 사람 오는 거, 오랜만이라.'",
      question: "전화하지 않는 사람이 표에서는 연락 안 되는 사람입니다. 어떻게 하겠습니까?",
      memo: ["남자(53): 작년까지 플로우온 야간조", "지난 이틀 아무 데도 전화하지 않음", "'바쁜 데 많을 텐데 나까지 뭘'"],
      triggers: ["affection", "recognition", "helplessness"],
      choices: [
        { id: "s10_former_stay", label: "파스를 다 붙일 때까지 곁에 있는다", effect: { trust: 6, humanCost: -2, time: -2, fatigue: 2 }, cognition: { persistence: 2 }, next: "s10_column" },
        { id: "s10_former_answer", label: "은행에서 왔다는 말에 그대로 답한다", effect: { trust: 3, legitimacy: 3, time: -1, fatigue: 2 }, cognition: { reframing: 2 }, next: "s10_column" },
        { id: "s10_former_number", label: "거점 번호를 냉장고에 붙여 둔다", effect: { legitimacy: 4, humanCost: -1, time: -1, fatigue: 1 }, cognition: { inference: 1, risk: 1 }, next: "s10_column" },
      ],
    },
    s10_column: {
      phase: "SIDE 10 COLUMN",
      title: "말 안 하는 집",
      speaker: "변정순",
      place: "온새 돌봄 강서 거점 · 배차실",
      clock: "03:30",
      text: "거점으로 돌아오니 화이트보드의 남은 줄은 열둘입니다. 공지가 한 장 붙었습니다. 「자동 배차 재개: 9월 15일 (월) 06:00. 가중치 변경 없음.」 변정순이 공책의 맨 끝 칸을 펼칩니다. 말 안 하는 집마다 작은 별, 11년 치입니다. '시스템 들어오기 전엔 우리가 이걸로 순서를 정했어요. 시스템 들어오고는 아무도 안 물어봤어요.' 오진우가 공책과 가중치표를 나란히 놓습니다. 별이 붙은 집은 표에서 거의 다 아래쪽입니다. 변정순이 덧붙입니다. '공책은 회사 거 아니에요. 내 거예요.'",
      question: "공책의 별과 표의 순번이 거꾸로입니다. 어떻게 하겠습니까?",
      memo: ["자동 배차 재개: 9월 15일 (월) 06:00, 가중치 그대로", "공책 맨 끝 칸: 말 안 하는 집에 별, 11년 치", "변정순: '공책은 내 거예요'"],
      triggers: ["system", "choice", "recognition"],
      choices: [
        { id: "s10_column_ask", label: "별을 표에 옮겨도 되는지 먼저 묻는다", effect: { trust: 6, legitimacy: 2, time: -2, fatigue: 1 }, cognition: { reframing: 2 }, next: "s10_dawn" },
        { id: "s10_column_count", label: "별 붙은 집이 표에서 몇 칸 밀렸는지 센다", effect: { legitimacy: 7, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s10_dawn" },
        { id: "s10_column_leave", label: "공책은 덮어 두고 남은 열두 집을 돈다", effect: { humanCost: -2, trust: 2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s10_dawn" },
      ],
    },
    s10_dawn: {
      phase: "SIDE 10 DAWN",
      title: "6시 이전",
      speaker: "오진우",
      place: "온새 돌봄 강서 거점 · 주차장",
      clock: "05:50",
      text: "남은 줄이 0이 되자 하늘이 밝아 옵니다. 주차장에서 오진우가 차 열쇠를 돌리다 맙니다. '인사를 안 한 건, 할 말이 없어서였습니다. 미안하다고 하면 제가 다 한 일 같고, 아니라고 하면 변명 같고.' 그가 가중치표를 접어 주머니에 넣습니다. '월요일 아침에 의견서 한 장은 낼 수 있습니다. 한 장이요. 그 이상 쓰면 아무도 안 읽습니다.' 변정순이 거점 문을 잠그며 외칩니다. '다음 주에도 탈 거면 커피는 마셔요. 내 차에서 표만 보는 사람 처음이야.'",
      question: "오진우가 월요일에 낼 한 장을 고민합니다. 무엇을 거들겠습니까?",
      memo: ["오진우: '할 말이 없어서였습니다'", "월요일 아침에 낼 의견서 한 장", "자동 배차 재개까지 하루"],
      triggers: ["affection", "responsibility", "choice"],
      choices: [
        { id: "s10_dawn_draft", label: "한 장의 뼈대를 같이 잡는다", effect: { legitimacy: 5, trust: 3, time: -2, fatigue: 2 }, cognition: { inference: 2 }, next: "s10_aftershock" },
        { id: "s10_dawn_coffee", label: "커피 두 잔을 사 온다", effect: { trust: 6, time: -1, fatigue: -1 }, cognition: { reframing: 2 }, next: "s10_aftershock" },
        { id: "s10_dawn_home", label: "오늘은 자고 내일 쓰자고 한다", effect: { time: 3, fatigue: -3, legitimacy: -1 }, cognition: { risk: 1 }, next: "s10_aftershock" },
      ],
    },
    s10_aftershock: {
      phase: "SIDE 10 AFTERMATH",
      title: "한 장",
      speaker: "도윤하",
      place: "트리거랩 · 분석관실",
      clock: "9월 14일 (일) 07:30",
      text: "일요일 아침, 도윤하가 창가 책상에 커피를 내려놓습니다. 명패 옆에 세 가지가 놓입니다. 접힌 가중치표, 열네 장 승인 문서의 이름 목록, 변정순의 공책 맨 끝 칸을 찍은 사진. 오진우는 소파에서 잠들었습니다. 도윤하가 작게 말합니다. '인사 없이 간 사람이 인사 없이 돌아왔네요.' 내일 06시면 자동 배차가 돌아옵니다. 그 전에 낼 수 있는 건 한 장뿐이고, 첫 줄에 들어갈 수 있는 건 하나입니다.",
      question: "오진우의 한 장, 첫 줄에 무엇을 쓰겠습니까?",
      memo: ["자동 배차 재개: 내일 06:00", "한 장: 첫 줄에 하나", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "responsibility", "recognition"],
      choices: [
        { id: "s10_after_column", label: "말 안 하는 집을 표의 칸으로 넣자고 쓴다", effect: { trust: 6, humanCost: -2 }, cognition: { persistence: 2 }, next: "s10_result" },
        { id: "s10_after_names", label: "승인자 열네 명과 6분 기준을 적는다", effect: { legitimacy: 7, trust: -1 }, cognition: { inference: 2 }, next: "s10_result" },
        { id: "s10_after_none", label: "아무것도 쓰지 않고 그를 집에 보낸다", effect: { time: 4, fatigue: -3, legitimacy: -3 }, cognition: { risk: 1 }, next: "s10_result" },
      ],
    },
  },
  outcomes: {
    s10_after_column: {
      title: "별 하나",
      text: "첫 줄은 이렇게 됩니다. '말하지 않는 집은 급하지 않은 집이 아닙니다. 현장 요양보호사의 기록을 가중치에 한 칸으로 넣어 주십시오.' 월요일 06시, 자동 배차는 가중치 그대로 돌아옵니다. 그 한 장은 온새 운영팀의 서류함으로 갑니다. 그 주 금요일, 변정순의 거점에 시험용 입력 칸이 하나 생깁니다. 이름은 「현장 특이 사항」. 그가 그 칸에 처음 적은 것은 반지하 할머니의 주소와 별 하나입니다. 칸이 순번을 얼마나 바꾸는지는 아직 어느 표에도 없습니다.",
    },
    s10_after_names: {
      title: "열네 칸",
      text: "첫 줄은 이렇게 됩니다. '이 가중치표의 승인자는 열네 명이고, 검토 제한시간 6분도 그 가운데 한 장이 정했습니다.' 그 아래 열네 이름이 날짜순으로 이어지고, 맨 끝에 오진우 자신의 이름이 있습니다. 월요일 06시, 자동 배차는 가중치 그대로 돌아옵니다. 그 한 장은 온새와 트리거랩 양쪽으로 갑니다. 기사에 남은 이름은 여전히 하나입니다. 대신 원인 회의록의 빈 서명란 일곱 칸 옆에, 누군가 연필로 '14'라고 적어 둡니다.",
    },
    s10_after_none: {
      title: "인사",
      text: "당신은 한 장을 쓰지 않습니다. 오진우를 깨워 집 앞까지 태워다 줍니다. 내리면서 그가 처음으로 고개를 숙입니다. '고맙습니다. 이게 인사입니다.' 월요일 06시, 자동 배차는 가중치 그대로 돌아옵니다. 화이트보드의 손글씨 명단은 지워집니다. 변정순의 공책은 그의 가방 안에 그대로 있고, 맨 끝 칸의 별은 그 주에도 세 개가 늘어납니다. 오진우의 차는 그 주 금요일 밤에도 강서 거점 주차장에 섭니다.",
    },
  },
};
