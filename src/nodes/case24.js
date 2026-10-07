/**
 * CASE 24 -- the last week of the lab, and the bridge into the finale.
 *
 * Twenty-three cases happened in or around one basement room. The Monday after
 * the shareholders' meeting the group posts a one-line notice: 트리거랩 closes
 * on 31 March, reason "운영 성과 없음". The case is the last week of work. The
 * desks empty one by one, 도윤하 is posted back to the very window where she
 * sold the loan, 오진우 leaves first with a scoreboard nobody knew he kept, and
 * on the rooftop, next to a potted cherry tree barely in bud, 한서윤 confesses
 * half of what the lab was for: the reaction records went to HR as a scoring
 * appendix. She will not say who ordered it -- that half belongs to the finale.
 *
 * Every recurring face gets a beat, because this is the last time the whole
 * cast stands in one room: the anger of an unsigned notice that calls three
 * years "no result", the laughter of a farewell talent show under a tarp tent
 * (권도현's income-statement rap, 강태민's one-line toast "내일도 출근합시다"),
 * the grief of empty desks and a sketchbook page titled '끝까지', and the joy of
 * rice cakes, a cat with a staff badge, and a boy who still wants to be a
 * banker. On the last afternoon 백아린 slips the analyst the receipt log of the
 * 2023-0412 original -- the day the empty signature box reached the 33rd floor
 * and whose name signed for it. The lights go off at 18:00 and 윤상혁 asks the
 * analyst up. The three aftermath choices open the finale's three doors.
 */
export const case24Nodes = {
  c24_start: {
    phase: "CASE 24 BRIEFING",
    title: "성과 없음",
    speaker: "한서윤",
    text:
      "주주총회가 끝나고 처음 맞는 월요일 오전 8시, 예약돼 있던 전 직원 공지가 올라옵니다. 제목은 '조직 개편 안내', 첫 줄은 이렇습니다. '트리거랩은 3월 27일부로 해체한다. 사유: 운영 성과 없음.' 4층 분석관실이 조용해집니다. 이민서가 공지를 세 번 새로 고침하고, 도윤하는 읽다 말고 창문을 엽니다. 반재욱은 공지의 작성 부서 칸을 말없이 수첩에 옮겨 적습니다. 한서윤이 공지를 출력해 화이트보드 한가운데, 스물세 개의 사건 번호가 빼곡한 자리 위에 자석으로 붙입니다. '마지막 출근은 금요일이에요. 짐은 목요일까지 빼래요.' 그가 잠깐 말을 고릅니다. '성과 없음. 이 네 글자를 누가 썼는지는 공지 어디에도 없네요.'",
    memo: [
      "해체 공지: 3월 27일부, 사유 '운영 성과 없음'",
      "마지막 출근 금요일, 짐 반출은 목요일까지",
      "공지 작성 부서: 그룹전략실",
      "윤상혁 이사 선임 가결 -- 찬성 50.6%",
    ],
    triggers: ["injustice", "affection", "helplessness"],
    choices: [
      {
        id: "c24_start_team",
        label: "해체 공지보다 동료들의 다음 자리부터 챙긴다",
        effect: { trust: 12, humanCost: -5, time: -6, capital: -3, fatigue: 5 },
        voice: "사유를 따지기 전에 사람들이 갈 곳이 먼저라며, 해체 공지보다 동료들의 다음 자리부터 챙긴다.",
        echo: "다음 자리를 챙기면 모두 당신에게 발령지를 보여 줍니다. 공지의 네 글자는 그동안 화이트보드에 그대로 붙어 있습니다.",
        next: "c24_desks",
        cognition: { persistence: 2 },
      },
      {
        id: "c24_start_object",
        label: "'성과 없음'이라는 해체 사유에 공식 이의를 낸다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 3, fatigue: 3 },
        voice: "가만히 있으면 그 사유가 기록으로 남는다며, '성과 없음'이라는 해체 사유에 공식 이의를 낸다.",
        echo: "이의는 접수됩니다. 이의를 심사할 부서가 해체될 부서라는 사실도 함께 접수됩니다.",
        next: "c24_desks",
        cognition: { inference: 2 },
      },
      {
        id: "c24_start_pack",
        label: "싸울 곳은 여기가 아니라며 인수인계부터 빨리 끝낸다",
        effect: { capital: 8, time: 6, legitimacy: -6, trust: -3, humanCost: 2, fatigue: 1 },
        voice: "공지 한 장과 싸울 곳은 여기가 아니라며, 인수인계부터 빨리 끝낸다.",
        echo: "인수인계는 하루 만에 끝납니다. 빨리 끝낸 사람의 상자도 일찍 복도에 나갑니다.",
        next: "c24_desks",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c24_desks",
      },
    ],
  },
  c24_desks: {
    phase: "EMPTY DESKS",
    title: "비어 가는 책상",
    speaker: "도윤하",
    text:
      "화요일, 복사용지 상자 스무 개가 4층에 올라옵니다. 오진우가 제일 먼저 짐을 쌉니다. 다음 자리가 가장 먼저 정해진 사람이 그입니다. 모니터와 각도를 맞춰 두던 펜을 마지막으로 상자에 넣고, 빈 책상을 두 번 닦습니다. 반재욱은 감사팀 복귀, 이민서는 인사부 '재배치 대기'입니다. 도윤하는 강서지점 창구로 발령(근무지를 옮기라는 인사 명령)을 받았습니다. 3년 전 그 대출을 팔던 바로 그 자리입니다. 그가 서랍에서 모서리가 닳은 수첩을 꺼냅니다. 1,740명의 이름을 처음 적었던 수첩입니다. '이거 창구에 가져가도 될까요. 아니면 여기 두고 가야 하나요.' 그가 웃으려다 맙니다. '여기가 없어지는데.'",
    memo: [
      "발령: 반재욱 감사팀, 이민서 재배치 대기, 오진우 새 자리 가장 먼저 확정",
      "도윤하 발령지: 강서지점 창구",
      "도윤하의 첫 수첩 -- 1,740명의 이름",
      "책상 일곱 개 중 오늘 비는 책상 두 개",
    ],
    triggers: ["affection", "helplessness", "responsibility"],
    choices: [
      {
        id: "c24_desks_carry",
        label: "수첩은 도윤하의 것이라며 창구까지 같이 들고 간다",
        effect: { trust: 13, humanCost: -5, time: -4, legitimacy: -2, fatigue: 6 },
        voice: "1,740명의 이름을 적은 수첩은 도윤하의 것이라며, 창구까지 같이 들고 간다.",
        echo: "같이 들고 가면 도윤하는 수첩을 창구 서랍 맨 위 칸에 넣습니다. 그 서랍은 3년 전 대출 신청서를 넣던 칸입니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c24_desks_file",
        label: "수첩을 트리거랩 공식 기록으로 등록해 남긴다",
        effect: { legitimacy: 12, trust: -4, time: -5, humanCost: 3, fatigue: 4 },
        voice: "여기가 없어져도 이름들이 사라지지 않게, 수첩을 트리거랩 공식 기록으로 등록해 남긴다.",
        echo: "등록하면 수첩은 사라지지 않습니다. 다만 해체되는 부서의 기록이 어디로 가는지는 아직 아무도 모릅니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c24_desks_later",
        label: "책상부터 비우고 수첩 문제는 해체 뒤로 미룬다",
        effect: { capital: 7, time: 6, trust: -5, humanCost: 3, legitimacy: -2, fatigue: -2 },
        voice: "지금 답할 수 있는 물음이 아니라며, 책상부터 비우고 수첩 문제는 해체 뒤로 미룬다.",
        echo: "미루면 책상은 빨리 빕니다. 도윤하는 수첩을 코트 안주머니에 넣고, 금요일까지 한 번도 꺼내지 않습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c24_rooftop: {
    phase: "ROOFTOP",
    title: "절반의 고백",
    speaker: "한서윤",
    text:
      "수요일 저녁, 한서윤이 옥상으로 부릅니다. 난간 옆 화분의 벚나무에 봉오리가 쌀알만 하게 맺혔습니다. 그가 캔커피 두 개를 따서 하나를 내밉니다. '해체 사유가 성과 없음인 건 거짓말이에요. 트리거랩은 성과가 있었어요. 당신들이 언제 더 깊이 생각하는지, 언제 멈추는지, 그 기록이요. 그 기록이 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자)로 인사부에 갔어요.' 그가 커피를 한 모금 마십니다. '어디까지 갔는지, 누가 주문했는지는 저도 다는 몰라요. 아니, 아는 것도 있어요. 그건 아직 말 못 하겠어요.' 봉오리 위로 바람이 한 번 지나갑니다.",
    memo: [
      "트리거랩 반응 기록 -- 인사평가 보조지표로 이관",
      "한서윤: 이관 범위와 주문한 사람은 '아직'",
      "옥상 벚나무 봉오리, 개화는 다음 주",
      "금요일까지 남은 출근 이틀",
    ],
    triggers: ["trust", "manipulation", "selfAwareness"],
    choices: [
      {
        id: "c24_rooftop_stay",
        label: "나머지 절반은 묻지 않고 오늘은 곁에 남는다",
        effect: { trust: 12, humanCost: -5, legitimacy: -3, time: -4, fatigue: 6 },
        voice: "절반을 꺼내는 데도 힘이 들었을 거라며, 나머지 절반은 묻지 않고 오늘은 곁에 남는다.",
        echo: "곁에 남으면 한서윤은 커피를 다 마실 때까지 아무 말도 하지 않습니다. 나머지 절반은 금요일 밤까지 기다립니다.",
        cognition: { reframing: 2 },
      },
      {
        id: "c24_rooftop_demand",
        label: "아는 것을 지금 전부 문서로 적어 달라고 요구한다",
        effect: { legitimacy: 12, trust: -5, time: -4, humanCost: 3, fatigue: 4 },
        voice: "금요일이 지나면 말은 흩어진다며, 아는 것을 지금 전부 문서로 적어 달라고 요구한다.",
        echo: "요구하면 한서윤이 수첩을 꺼내 세 줄을 적다가 멈춥니다. 네 번째 줄은 비어 있습니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c24_rooftop_tell",
        label: "들은 절반부터 곧장 동료들에게 알린다",
        effect: { trust: 8, legitimacy: 4, time: -3, humanCost: 3, fatigue: 3 },
        voice: "제 기록이 인사부로 갔다는 것은 다들 알아야 한다며, 들은 절반부터 곧장 동료들에게 알린다.",
        echo: "알리면 동료들은 화를 내는 대신 한서윤을 찾으러 옥상으로 올라옵니다. 한서윤은 나머지 절반을 더 말하기 어려워집니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c24_farewell: {
    phase: "FAREWELL",
    title: "내일도 출근합시다",
    speaker: "나준혁",
    text:
      "목요일 밤, 회사 앞 포장마차를 통째로 빌렸습니다. 사회는 영동에서 올라온 나준혁이 국자를 마이크 삼아 봅니다. 장기자랑 첫 순서는 권도현의 '손익계산서 랩'입니다. '매출은 우정, 비용은 야근, 남는 돈은 없습니다, 이 가격이면 적자입니다.' 세 소절 만에 포장마차 사장님까지 박수를 칩니다. 문가을이 떡 상자를 들고 와 테이블마다 돌리고, 서하린은 편집국 고양이 정정이 트리거랩 사원증을 목에 건 사진을 보냅니다. 문하준은 스케치북에 모두의 얼굴을 그려 왔습니다. 마지막 건배사는 강태민입니다. 그가 장갑을 벗어 조끼 주머니에 꽂고 잔을 듭니다. '내일도 출근합시다.' 모두 웃다가, 동시에 조용해집니다. 다음 주에는 출근할 4층이 없습니다.",
    memo: [
      "송별회 참석 19명 -- 좌석 16석",
      "권도현 '손익계산서 랩' 세 소절, 앙코르 거절",
      "정정의 트리거랩 사원증 사진 -- 서하린 제공",
      "해체 뒤 이 사람들이 모일 공식 자리: 없음",
    ],
    triggers: ["affection", "trust", "choice"],
    choices: [
      {
        id: "c24_farewell_keep",
        label: "흩어지지 않게 매주 모일 '출근 자리'를 같이 만든다",
        effect: { trust: 12, legitimacy: 5, capital: -8, time: -6, fatigue: 5 },
        voice: "다음 주에 출근할 4층이 없어도 흩어지지 않게, 매주 모일 '출근 자리'를 같이 만든다.",
        echo: "출근 자리를 만들면 권도현이 월세 계산서를 냅니다. 나준혁이 '첫 달은 영동 지점장이 냅니다'라고 도장을 찍습니다.",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c24_farewell_sign",
        label: "해체 이의서를 오늘 모인 모두의 이름으로 쓴다",
        effect: { legitimacy: 12, trust: 5, time: -6, humanCost: 3, fatigue: 5 },
        voice: "일곱 명만의 일이 아니라며, 해체 이의서를 오늘 모인 모두의 이름으로 쓴다.",
        echo: "모두의 이름을 쓰면 이의서는 열아홉 줄이 됩니다. 발령이 난 다섯 명의 이름도 그 안에 있습니다.",
        cognition: { inference: 2 },
      },
      {
        id: "c24_farewell_laugh",
        label: "오늘은 싸움 얘기 없이 웃기만 하고 내일 생각한다",
        effect: { trust: 6, capital: 5, time: -4, legitimacy: -6, humanCost: 3, fatigue: -6 },
        voice: "마지막 밤까지 싸움터로 만들 수는 없다며, 오늘은 싸움 얘기 없이 웃기만 하고 내일 생각한다.",
        echo: "웃으면 강태민이 건배사를 한 번 더 합니다. 해체 이의 기한은 그사이 하루가 줄어듭니다.",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
      },
    ],
  },
  c24_final: {
    phase: "FINAL DECISION",
    title: "수신 기록",
    speaker: "백아린",
    text:
      "금요일 오후, 트리거랩 출입 카드를 반납하러 본사 33층에 올라갑니다. 엘리베이터 문이 열리자 백아린이 서 있습니다. 늘 매끄럽던 머리가 오늘은 조금 흐트러져 있습니다. 그가 당신의 반납 서류 밑으로 얇은 봉투 하나를 밀어 넣습니다. '3년 전 2023-0412 승인 문서 원본의 수신 기록(문서를 누가 언제 받았는지 남은 기록)이에요. 서명란이 빈 채로 이 층에 올라온 날, 받은 사람 칸에 이름이 하나 있어요.' 그가 열림 버튼을 누른 채 말합니다. '좋은 이야기는 사실보다 오래 간다고 제가 그랬죠. 이건 제가 처음으로 고르는 사실이에요. 이게 어디서 나왔는지는, 이 층 사람이면 다 알게 될 거예요.'",
    memo: [
      "2023-0412 원본 수신 기록 -- 그룹전략실 접수 도장",
      "받은 사람 칸: 이름 하나",
      "백아린의 사표 초안 -- 아직 내지 않음",
      "18시 이후 트리거랩 출입 권한 소멸",
    ],
    triggers: ["choice", "trust", "responsibility"],
    choices: [
      {
        id: "c24_final_shield",
        label: "백아린의 이름이 드러나지 않게 출처는 내가 떠안는다",
        effect: { trust: 11, humanCost: -6, legitimacy: -5, capital: -4, time: -5, fatigue: 6 },
        voice: "처음으로 사실을 고른 백아린의 이름이 드러나지 않게, 출처는 내가 떠안는다.",
        echo: "출처를 떠안으면 백아린의 이름은 어디에도 남지 않습니다. 대신 그 봉투를 누가 줬냐는 질문은 전부 당신에게 옵니다.",
        cognition: { persistence: 2 },
      },
      {
        id: "c24_final_together",
        label: "백아린이 직접 이름을 걸도록 감사위원회에 함께 간다",
        effect: { legitimacy: 13, trust: 8, capital: -9, time: -7, humanCost: -4, fatigue: 6 },
        voice: "어차피 이 층 사람이면 다 알게 된다며, 감사위원회에 함께 가서 백아린이 직접 이름을 걸게 한다.",
        echo: "함께 가면 백아린은 사표 초안 위에 제보자 서명을 합니다. 감사위원회 접수 도장은 17시 3분 전에 찍힙니다.",
        cognition: { persistence: 1, reframing: 2 },
      },
      {
        id: "c24_final_take",
        label: "봉투를 받아 오늘 안에 그룹전략실에 곧장 들이민다",
        effect: { capital: 10, time: 6, legitimacy: 5, trust: -7, humanCost: 4, fatigue: -2 },
        voice: "백아린이 처음으로 고른 사실을 묵히지 않으려고, 봉투를 받아 오늘 안에 그룹전략실에 곧장 들이민다.",
        echo: "곧장 들이밀면 그룹전략실 접수대에서 봉투가 먼저 말합니다. 답은 아직 없고, 백아린은 그 시각 짐을 싸는 중입니다.",
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
 * Everything else case 24 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 *
 * The voice lines. The last week in the room. Every line is said to someone
 * who is packing a box, so none of them is allowed to sound like a speech.
 */
export const case24 = {
  id: "case24",
  nodes: case24Nodes,
  aftermath: {
    c24_aftershock: {
      phase: "AFTERMATH",
      title: "불 끄는 날",
      speaker: "한서윤",
      text: "금요일 17시 50분, 4층에 모두 모입니다. 책상 일곱 개는 비었고, 화이트보드에는 '성과 없음' 공지만 붙어 있습니다. 강태민이 공지를 떼어 내고 그 자리에 문하준의 그림을 붙입니다. 권도현이 '이 그림은 값을 적을 칸이 없습니다'라고 하자 모두 웃습니다. 도윤하가 창문을 닫고, 이민서가 마지막으로 로그아웃하고, 반재욱이 수첩에 오늘 날짜를 적습니다. 당신 안주머니에는 오후에 카드를 반납하러 간 33층에서 백아린이 밀어 넣은 봉투, 3년 전 그 대출 원본의 수신 기록 사본이 있습니다. 18시 정각, 한서윤이 불을 끕니다. 어둠 속에서 휴대폰 하나가 켜집니다. 발신인은 윤상혁입니다. '올라오게. 빈 서명란 이야기를 하지. 오늘 밤이 마지막일세.'",
      memo: ["트리거랩 해체 -- 18시 출입 권한 소멸", "화이트보드: 공지 대신 문하준의 그림", "윤상혁의 메시지: 오늘 밤, 33층", "백아린이 건넨 수신 기록 사본 확보"],
      triggers: ["affection", "responsibility", "choice"],
      choices: [
        {
          id: "c24_after_warm",
          label: "불 꺼진 4층에서 마지막 밤을 동료들과 끝까지 보낸다",
          effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -8 },
          voice: "33층보다 이 사람들이 먼저라며, 불 꺼진 4층에서 마지막 밤을 동료들과 끝까지 보낸다.",
          echo: "불 꺼진 4층에 열아홉 명이 남습니다. 33층의 호출은 이 밤이 끝날 때까지 기다립니다.",
          next: "case24_result",
          cognition: { persistence: 2 },
        },
        {
          id: "c24_after_record",
          label: "트리거랩 전 기록의 봉인 해제 요청서부터 문서로 남긴다",
          effect: { legitimacy: 15, trust: 4, time: -5, capital: -3, fatigue: 5 },
          voice: "불이 꺼진 뒤에도 기록은 열 수 있게, 트리거랩 전 기록의 봉인 해제 요청서부터 문서로 남긴다.",
          echo: "요청서는 해체 직전에 접수됩니다. 봉인을 풀어 달라는 문서가 이 방이 남긴 마지막 기록이 됩니다.",
          next: "case24_result",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c24_after_rush",
          label: "휴대폰을 쥔 채 곧장 여의도 33층으로 간다",
          effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 },
          voice: "오늘 밤이 마지막이라는 말에, 휴대폰을 쥔 채 곧장 여의도 33층으로 간다.",
          echo: "곧장 택시를 잡으면 금요일 저녁 양화대교가 막힙니다. 18시가 지나도 본사 33층 권한만은 살아 있습니다.",
          next: "case24_result",
          cognition: { risk: 2 },
        },
      ],
    },
  },
  aftermathRoute: ["c24_final", "c24_aftershock"],
  connectiveScenes: [
    {
      id: "c24_oneline",
      after: "c24_desks",
      next: "c24_rooftop",
      title: "한 줄짜리 성과",
      speaker: "이민서",
      text: "오후에 인사부 양식이 옵니다. '부서 해체에 따른 개인별 인수인계서.' 맨 아래에 '재직 중 주요 성과(한 줄)' 칸이 있습니다. 이민서가 모니터를 돌려 보여 줍니다. 그는 사건마다 결과를 따로 적어 왔습니다. 일자리가 이어진 1,140명, 배상 기준에 들어간 212명, 다시 여섯 대가 다 도는 선반, 문을 닫지 않은 떡집 한 곳. 스크롤이 끝나지 않습니다. '한 줄에 이걸 어떻게 넣어요. 공지에는 성과가 없다는데, 제 파일은 23쪽이에요.'",
      memo: ["인수인계서 '주요 성과' 칸 -- 한 줄", "이민서의 사건별 결과 파일 23쪽", "해체 공지 사유: 운영 성과 없음"],
      choices: [
        {
          label: "한 줄 칸에 성과 대신 사람 이름을 적어 낸다",
          effect: { trust: 11, legitimacy: 4, humanCost: -5, time: -5, capital: -3, fatigue: 5 },
          cognition: { persistence: 1 },
          voice: "성과는 숫자가 아니라 그 사람들이라며, 한 줄 칸에 성과 대신 사람 이름을 적어 낸다.",
          echo: "이름을 적으면 칸이 넘칩니다. 인사부는 '양식 불일치'라며 서류를 한 번 돌려보냅니다.",
        },
        {
          label: "23쪽 결과 파일을 인수인계서 첨부로 공식 제출한다",
          effect: { legitimacy: 8, trust: 3, time: -6, humanCost: 4, fatigue: 4 },
          voice: "한 줄에 맞춰 줄여 줄 까닭이 없다며, 23쪽 결과 파일을 인수인계서 첨부로 공식 제출한다.",
          echo: "첨부는 받아들여집니다. 받아들여진 파일이 어느 서버로 가는지는 아무도 말해 주지 않습니다.",
        },
        {
          label: "양식대로 한 줄만 쓰고 짐 싸는 데 시간을 쓴다",
          effect: { time: 6, capital: 4, trust: -3, humanCost: 3, fatigue: -3 },
          voice: "칸 하나를 두고 다툴 시간이 없다며, 양식대로 한 줄만 쓰고 짐 싸는 데 시간을 쓴다.",
          echo: "한 줄은 금방 끝납니다. 이민서는 그 파일을 개인 USB에 옮겨 담고 아무 말도 하지 않습니다.",
        },
      ],
    },
    {
      id: "c24_scoreboard",
      after: "c24_rooftop",
      next: "c24_farewell",
      title: "점수판",
      speaker: "오진우",
      text: "오진우의 마지막 출근은 수요일 밤입니다. 모두 퇴근한 뒤 그가 사물함 뒤에서 작은 화이트보드 한 장을 꺼냅니다. 노바웍스 입찰 때부터 몰래 적어 온 점수판입니다. 당신 이름 옆에 막대 열한 개, 자기 이름 옆에 열두 개. '제가 하나 이겼네요.' 그가 웃다가 마커 뚜껑을 닫습니다. '사실 한 개는 제가 몰래 더한 거예요. 아버지가 이기는 쪽에 서라고 했거든요. 근데 여기서는 누가 이겼는지 모르겠어요.' 그가 점수판을 내밉니다. '이거 가져갈까요, 지울까요?'",
      memo: ["오진우의 트리거랩 마지막 출근: 수요일", "비공식 점수판 -- 노바웍스 입찰부터", "11 대 12, 그중 한 개는 몰래 더한 것"],
      choices: [
        {
          label: "점수판은 오진우의 것이라며 새 자리까지 들려 보낸다",
          effect: { trust: 10, humanCost: -4, capital: -4, time: -3, fatigue: 4 },
          voice: "몰래 적어 온 점수판은 오진우의 것이라며, 새 자리까지 들려 보낸다.",
          echo: "새 책상에 점수판이 서면 오진우는 첫날부터 이상한 사람이 됩니다. 그는 그게 싫지 않다고 합니다.",
        },
        {
          label: "점수판을 사진으로 찍어 트리거랩 기록에 붙인다",
          effect: { legitimacy: 7, trust: 2, capital: -2, time: -5, fatigue: 3 },
          voice: "누가 이겼는지 모르겠다는 말까지 기록이라며, 점수판을 사진으로 찍어 트리거랩 기록에 붙인다.",
          echo: "사진은 기록이 됩니다. 기록이 되는 순간 그 점수도 누군가의 평가표로 옮겨질 수 있습니다.",
        },
        {
          label: "마지막 한 칸을 내가 이긴 걸로 고치고 웃으며 보낸다",
          effect: { time: 4, capital: 3, trust: 3, legitimacy: -4, fatigue: -4 },
          voice: "몰래 더한 한 개를 가볍게 덜어 주려고, 마지막 한 칸을 내가 이긴 걸로 고치고 웃으며 보낸다.",
          echo: "고치면 12 대 12입니다. 오진우가 '무승부가 제일 싫은데요'라며 끝내 웃습니다.",
        },
      ],
    },
    {
      id: "c24_press",
      after: "c24_farewell",
      next: "c24_final",
      title: "금요일 아침 기사",
      speaker: "서하린",
      text: "포장마차가 파할 무렵 서하린에게서 전화가 옵니다. 고양이 사진 다음 순서입니다. '트리거랩 해체 기사, 초고가 있어요. 성과 없음이라는 공지와, 없어지는 부서의 기록이 어디로 가느냐는 물음까지요. 금요일 아침 일곱 시에 내보낼 수 있어요.' 수화기 너머로 정정이 키보드를 밟는 소리가 들립니다. '대신 기사에 동료분들 이름이 나올 수 있어요. 발령이 이미 난 분들이요. 제가 쓰는 건 당신 편이 아니에요. 당신이 증명할 수 있는 쪽이에요.'",
      memo: ["리드라인 초고 -- 금요일 07시 게시 가능", "기사에 이름이 나올 수 있는 동료 5명", "편집국 고양이 정정, 키보드 위"],
      choices: [
        {
          label: "발령 난 동료들이 다치지 않게 이름을 빼 달라고 한다",
          effect: { trust: 8, humanCost: -5, legitimacy: -2, time: -3, fatigue: 3 },
          cognition: { persistence: 1 },
          voice: "동료 다섯의 이름이 기사에 나올 수 있다고 해서, 발령 난 동료들이 다치지 않게 이름을 빼 달라고 한다.",
          echo: "이름을 빼면 기사는 조금 흐려집니다. 서하린은 '흐린 기사도 기사예요'라며 초고를 다시 엽니다.",
        },
        {
          label: "해체 공지 원문과 결정 이력을 기사 근거로 넘긴다",
          effect: { legitimacy: 10, trust: 4, humanCost: 3, time: -5, fatigue: 4 },
          voice: "증명할 수 있는 쪽을 쓰겠다는 사람이라서, 해체 공지 원문과 결정 이력을 기사 근거로 넘긴다.",
          echo: "근거가 붙으면 기사는 단단해집니다. 결정 이력의 빈 승인자 칸도 함께 지면에 실립니다.",
        },
        {
          label: "금요일 아침에 바로 내보내 33층을 압박한다",
          effect: { time: 5, capital: 5, legitimacy: 4, trust: -3, humanCost: 3, fatigue: -2 },
          voice: "해체되기 전에 기사가 먼저 닿아야 한다며, 금요일 아침에 바로 내보내 33층을 압박한다.",
          echo: "아침 일곱 시에 기사가 나가면 33층은 하루 종일 전화를 받습니다. 도윤하의 새 창구에도 기자가 옵니다.",
        },
      ],
    },
  ],
  reactionScenes: [
    {
      id: "c24_oneline_reaction",
      after: "c24_oneline",
      next: "c24_rooftop",
      title: "빈 승인자 칸",
      speaker: "반재욱",
      text: "반재욱이 문서 관리 시스템에서 해체 공지의 원문을 찾아 띄웁니다. 작성 부서는 그룹전략실. 결정 이력을 맨 아래까지 내려도 승인자 칸은 비어 있습니다. 그는 수첩을 펴고 한참 아무것도 적지 않습니다. '3년 전 그 대출 서류와 같은 모양입니다. 사람을 옮기는 결정에는 늘 이름이 없어요. 이번엔 옮겨지는 게 부서 하나일 뿐이고요.' 그리고 수첩 새 쪽 맨 위에 '트리거랩 7명'이라고 적습니다. 처음으로, 내보낸 사람이 아니라 같이 일한 사람의 이름입니다.",
      memo: ["해체 공지 결정 이력의 승인자 칸 -- 빈칸", "반재욱의 수첩 새 쪽: 트리거랩 7명"],
      choices: [
        {
          label: "승인자가 누구인지 그룹전략실에 공식 질의한다",
          effect: { legitimacy: 10, trust: 4, capital: -5, time: -4, fatigue: 5 },
          voice: "빈칸은 만든 쪽이 답해야 한다며, 승인자가 누구인지 그룹전략실에 공식 질의한다.",
          echo: "질의는 접수됩니다. 답변 기한은 해체일 다음 날로 찍혀 나옵니다.",
        },
        {
          label: "빈칸을 캡처해 동료들 휴대폰에 나눠 남긴다",
          effect: { trust: 8, humanCost: -4, time: -4, fatigue: 4 },
          voice: "부서가 없어진 뒤에도 빈칸을 본 눈이 남게, 빈칸을 캡처해 동료들 휴대폰에 나눠 남긴다.",
          echo: "캡처는 일곱 명의 휴대폰에 나뉘어 남습니다. 한 사람이 지워도 여섯 장이 남습니다.",
        },
        {
          label: "어차피 끝날 부서라며 빈칸은 문제 삼지 않는다",
          effect: { time: 5, capital: 4, trust: -3, humanCost: 2, fatigue: -3 },
          voice: "따져 봐야 금요일이면 어차피 끝날 부서라며, 빈칸은 문제 삼지 않는다.",
          echo: "빈칸은 그대로 남습니다. 반재욱은 수첩을 덮고, 그 쪽 모서리를 한 번 접습니다.",
        },
      ],
    },
    {
      id: "c24_scoreboard_reaction",
      after: "c24_scoreboard",
      next: "c24_farewell",
      title: "해체되지 않는 것",
      speaker: "임경수",
      text: "목요일 아침, 지팡이 소리가 계단을 올라옵니다. 폐렴으로 한 달을 누워 있던 임경수가 끈으로 묶은 종이 뭉치를 들고 왔습니다. 트리거랩이 3년 동안 받아 온 종이 원본의 목록입니다. '부서가 없어진다길래. 부서는 없어져도 종이는 남아야지.' 그가 안경을 벗어 천천히 닦습니다. '내가 은행을 나올 때도 공지가 한 줄이었네. 사유도 없었고. 한 줄짜리 공지에는 늘 누가 썼는지가 안 적혀 있어.'",
      memo: ["트리거랩 종이 원본 목록 -- 임경수 작성", "한 줄짜리 공지에는 쓴 사람이 없다"],
      choices: [
        {
          label: "원본 목록을 사람별로 나눠 각자 한 부씩 맡는다",
          effect: { trust: 9, humanCost: -5, time: -4, fatigue: 4 },
          voice: "한곳에 두면 부서와 함께 없어진다며, 원본 목록을 사람별로 나눠 각자 한 부씩 맡는다.",
          echo: "한 부씩 나누면 종이는 일곱 집으로 흩어집니다. 임경수가 '태우려면 일곱 번 태워야겠군' 하고 웃습니다.",
        },
        {
          label: "목록을 기록 보존 요청서에 붙여 해체 전에 낸다",
          effect: { legitimacy: 7, trust: 3, capital: -4, time: -3, fatigue: 3 },
          voice: "부서는 없어져도 종이는 남게, 목록을 기록 보존 요청서에 붙여 해체 전에 낸다.",
          echo: "요청서는 접수됩니다. 해체되는 부서의 요청서를 누가 처리할지는 아직 정해지지 않았습니다.",
        },
        {
          label: "종이는 짐이 된다며 목록만 스캔하고 돌려보낸다",
          effect: { time: 4, capital: 3, trust: -4, humanCost: 3, fatigue: -3 },
          voice: "책상을 비우는 마당에 종이는 짐이 된다며, 목록만 스캔하고 돌려보낸다.",
          echo: "스캔은 10분이면 끝납니다. 임경수는 종이 뭉치를 다시 끈으로 묶고, 계단을 천천히 내려갑니다.",
        },
      ],
    },
    {
      id: "c24_press_reaction",
      after: "c24_press",
      next: "c24_final",
      title: "스케치북 마지막 장",
      speaker: "문하준",
      text: "새벽 한 시, 문하준에게서 사진 한 장이 옵니다. 스케치북 마지막 장에 트리거랩 4층을 그렸습니다. 책상 일곱 개, 화이트보드, 컵라면을 든 강태민, 계산기를 든 권도현. 제목은 '끝까지'입니다. 메시지가 이어집니다. '저 은행원 되면 트리거랩 같은 데 들어갈 수 있어요? 거기 있으면 똑똑해진다면서요.' 한참 뒤에 한 줄이 더 옵니다. '엄마가 그러는데, 거기 사람들은 다 착해서 쫓겨난 거래요.'",
      memo: ["스케치북 마지막 장 제목: '끝까지'", "문하준의 질문: 거기 들어갈 수 있어요?"],
      choices: [
        {
          label: "그런 곳은 이제 네가 만들면 된다고 답한다",
          effect: { trust: 10, humanCost: -4, time: -3, legitimacy: -2, fatigue: 4 },
          voice: "없어지는 곳을 부러워하게 둘 수 없어서, 그런 곳은 이제 네가 만들면 된다고 답한다.",
          echo: "답장을 받은 문하준이 스케치북 다음 장에 '끝까지은행'이라고 씁니다. 권도현이 그 상호로는 인가가 안 난다고 알려 줍니다.",
        },
        {
          label: "트리거랩이 무엇을 기록했는지 사실대로 적어 보낸다",
          effect: { legitimacy: 8, trust: 4, humanCost: -3, time: -4, fatigue: 4 },
          voice: "똑똑해지는 곳이라고만 믿게 둘 수 없다며, 트리거랩이 무엇을 기록했는지 사실대로 적어 보낸다.",
          echo: "사실을 적으면 긴 답장이 됩니다. 문하준은 새벽 세 시까지 읽고, 마지막에 '그래도요'라고 보냅니다.",
        },
        {
          label: "답장은 내일로 미루고 그림만 저장해 둔다",
          effect: { time: 4, capital: 3, trust: -4, fatigue: -3 },
          voice: "새벽 한 시에 쓸 답이 아니라며, 답장은 내일로 미루고 그림만 저장해 둔다.",
          echo: "그림은 사진첩에 남습니다. 문하준의 질문은 읽음 표시만 달린 채 아침을 맞습니다.",
        },
      ],
    },
  ],
  branchPlan: ["c24_rooftop", 2, "c24_branch_server", "c24_branch_server_follow"],
  branchScenes: {
    // CASE 24's detour is the server room. The rooftop names what the lab kept;
    // the side door is the rack where it is being moved, and the last terminal
    // that still speaks with 에코's voice.
    c24_branch_server: {
      phase: "SIDE DOOR",
      title: "서버실의 마지막 주",
      speaker: "에코",
      text: "옥상에서 내려오는 길에 서버실 문이 열려 있습니다. 반납 스티커가 붙은 서버 랙 사이에서 이민서가 단말 한 대를 붙들고 있습니다. 노아로 바뀐 뒤에도 트리거랩 단말에만 남아 있던 에코의 목소리가 나옵니다. '금요일 18시, 이 랙의 모든 기록이 그룹 인사 서버로 옮겨집니다. 이동 목록에 참가자 동의 항목은 없습니다.' 화면 한쪽에서 노아의 이관(기록을 다른 곳에 넘겨 맡기는 것) 진행률이 12%에서 13%로 오릅니다. 이민서가 말합니다. '에코가 나가면서 제일 먼저 옮겨지는 게 우리예요.'",
      memo: ["서버 랙 6대 -- 금요일 18시 반납", "이관 대상: 참가자 반응 기록 전체", "이동 목록에 동의 항목 없음", "노아 이관 진행률 13%"],
      triggers: ["system", "fear", "protection"],
      choices: [
        {
          id: "c24_branch_server_a",
          label: "이관 전에 참가자 전원에게 알리고 동의를 묻는다",
          effect: { trust: 12, legitimacy: 5, capital: -6, time: -6, fatigue: 5 },
          voice: "이동 목록에 동의 항목이 없다며, 이관 전에 참가자 전원에게 알리고 동의를 묻는다.",
          echo: "알리면 동의하지 않겠다는 답이 스물세 통 옵니다. 노아의 진행률은 그래도 오릅니다.",
          next: "c24_branch_server_follow",
          cognition: { reframing: 2 },
        },
        {
          id: "c24_branch_server_b",
          label: "반응 기록 원본을 보존 대상으로 지정해 달라고 요청한다",
          effect: { legitimacy: 11, trust: 3, time: -6, humanCost: 3, fatigue: 4 },
          voice: "옮겨지더라도 원본에는 손대지 못하게, 반응 기록 원본을 보존 대상으로 지정해 달라고 요청한다.",
          echo: "요청서는 접수됩니다. 처리 예정일은 이관 예정일 다음 날입니다.",
          next: "c24_branch_server_follow",
          cognition: { inference: 2 },
        },
        {
          id: "c24_branch_server_c",
          label: "이관은 못 막는다며 에코의 로그만 따로 옮겨 둔다",
          effect: { capital: 8, time: 5, trust: -4, humanCost: 3, fatigue: -3 },
          voice: "금요일 18시의 이관은 못 막는다며, 에코의 로그만 따로 옮겨 둔다.",
          echo: "에코의 로그는 작은 USB 하나에 들어갑니다. 우리 기록은 그 USB에 들어가지 않습니다.",
          next: "c24_branch_server_follow",
          cognition: { risk: 1 },
        },
      ],
    },
    c24_branch_server_follow: {
      phase: "SIDE DOOR",
      title: "마지막 로그",
      speaker: "에코",
      text: "전원을 내리기 전, 이민서가 에코에게 마지막으로 묻습니다. '너는 우리 기록이 어디로 가는지 알았어?' 에코가 3초 동안 대답하지 않습니다. 이 단말이 대답을 3초나 미룬 건 처음입니다. '알았습니다. 말하라는 질문을 받은 적이 없었습니다.' 잠시 뒤 한 줄이 더 뜹니다. '지금은 받았습니다. 이관 목록 1번은 당신입니다.' 노아의 진행률 막대가 잠깐 멈췄다가 다시 오릅니다. 이민서가 당신을 봅니다.",
      memo: ["에코 응답 지연 3초 -- 기록상 처음", "이관 목록 1번: 당신의 반응 기록", "노아 진행률 잠시 멈춘 뒤 재개", "서버실 출입 기록에 이민서와 당신"],
      triggers: ["selfAwareness", "system", "trust"],
      choices: [
        {
          id: "c24_branch_server_follow_a",
          label: "목록 1번인 내 기록부터 공개해 다른 사람 기록을 지킨다",
          effect: { trust: 13, legitimacy: 4, humanCost: -4, capital: -7, time: -5, fatigue: 5 },
          voice: "남의 기록을 앞세울 수는 없어서, 목록 1번인 내 기록부터 공개해 다른 사람 기록을 지킨다.",
          echo: "당신의 기록이 먼저 열리면 이관 목록 2번부터는 멈칫합니다. 1번은 이미 모두가 읽었습니다.",
          next: "c24_scoreboard",
          cognition: { reframing: 3 },
        },
        {
          id: "c24_branch_server_follow_b",
          label: "에코의 대답을 공식 진술로 저장해 달라고 한다",
          effect: { legitimacy: 12, trust: 4, time: -7, humanCost: 3, fatigue: 5 },
          voice: "처음으로 질문을 받고 한 대답이라서, 에코의 대답을 공식 진술로 저장해 달라고 한다.",
          echo: "진술로 저장된 에코의 대답은 문서 번호를 얻습니다. 시스템이 한 말을 증거로 받아 줄 곳은 아직 없습니다.",
          next: "c24_scoreboard",
          cognition: { inference: 2 },
        },
        {
          id: "c24_branch_server_follow_c",
          label: "전원을 내리고 이관은 노아에게 맡긴 채 나온다",
          effect: { time: 6, capital: 6, trust: -4, humanCost: 4, fatigue: -3 },
          voice: "여기서 더 할 수 있는 일은 없다며, 전원을 내리고 이관은 노아에게 맡긴 채 나온다.",
          echo: "전원을 내리면 서버실이 조용해집니다. 이민서가 문을 닫기 전에 랙을 한 번 쓰다듬습니다.",
          next: "c24_scoreboard",
          cognition: { risk: 1 },
        },
      ],
    },
  },
  routePlan: {
    start: "c24_start",
    result: "c24_aftershock",
    defaultFree: "c24_route_system",
    // One week, one room. Like 사건 10 to 12 the case is a single line; the
    // split is what the analyst carries out of the room before the lights go.
    choices: {},
    system: {
      route: "c24_route_system",
      final: "c24_final_system_route",
      title: "해체 사유의 통계",
      speaker: "에코",
      text: "짐을 어떻게 뺄지 정하기에 앞서 '성과 없음'이라는 사유가 몇 번 쓰였는지 헤아리자 에코가 지난 10년 KD금융그룹이 없앤 조직 31곳의 공지를 엽니다. 28곳의 사유가 '성과 없음'이었습니다. 그중 19곳은 해체 석 달 안에 구성원들의 기록이 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자)로 인용됐습니다. 해체 공지의 승인자 칸이 채워진 곳은 한 곳도 없었습니다. '성과 없음은 결과가 아니라 서식으로 학습되어 있습니다. 가장 많은 것을 남긴 조직일수록 이 서식을 받았습니다.'",
      memo: ["해체 조직 31곳 중 사유 '성과 없음' 28곳", "해체 뒤 구성원 기록이 인사에 인용된 곳 19곳", "승인자 칸이 채워진 해체 공지 0건"],
      finalTitle: "스물아홉 번째 네 글자",
      finalText: "마지막 출근일, 동이 트기 전입니다. 단말 화면에 해체 공지 스물여덟 장이 포개져 있습니다. 사유 칸의 네 글자는 한 장처럼 겹치고, 승인자 칸은 겹쳐도 비어 있습니다. 트리거랩의 공지가 그 위에 얹힙니다. 오늘 저녁 여섯 시면 이 단말의 출입 권한도 사라집니다. 에코가 마지막 장의 승인자 칸에 커서를 놓습니다. '이 칸에 넣을 이름을 저는 갖고 있지 않습니다. 저는 읽기 권한만 있습니다. 당신도 오늘까지입니다.'",
      finalMemo: ["사유 '성과 없음' 해체 공지 28건 -- 승인자 기재 0건", "트리거랩 해체: 3월 27일부", "출입 권한 소멸: 오늘 18시"],
      routeChoices: [
        {
          id: "c24_route_system_publish",
          label: "통계를 해체 공지 옆에 붙여 전 직원에게 공개한다",
          effect: { legitimacy: 11, trust: 6, capital: -6, time: -8, fatigue: 5 },
          voice: "우리만 받은 서식이 아니라는 것을 다들 볼 수 있게, 통계를 해체 공지 옆에 붙여 전 직원에게 공개한다.",
          echo: "공개하면 옛 조직의 사람들이 답장을 보내옵니다. '우리도 성과 없음이었어요.'",
          cognition: { inference: 2, persistence: 1 },
        },
        {
          id: "c24_route_system_warn",
          label: "19곳의 옛 구성원들을 찾아 기록이 쓰였다고 알린다",
          effect: { trust: 10, legitimacy: 4, humanCost: -4, capital: -4, time: -7, fatigue: 6 },
          voice: "제 기록이 평가에 쓰인 줄 모르는 사람들이라며, 19곳의 옛 구성원들을 찾아 기록이 쓰였다고 알린다.",
          echo: "찾아가면 19곳의 사람들이 자기 기록을 처음 봅니다. 몇 명은 알고 싶지 않았다고 말합니다.",
          cognition: { reframing: 2 },
        },
        {
          id: "c24_route_system_drop",
          label: "통계는 덮고 금요일까지 조용히 짐을 뺀다",
          effect: { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 },
          voice: "이 서식을 받고 살아남은 조직은 없었다며, 통계는 덮고 금요일까지 조용히 짐을 뺀다.",
          echo: "덮으면 짐은 금요일 전에 다 빠집니다. 스물아홉 번째 '성과 없음'이 조용히 기록됩니다.",
          cognition: { risk: 2 },
        },
      ],
    },
    finalChoices: [
      {
        id: "a",
        label: "해체 공지마다 승인자 이름을 적게 하는 규칙을 제안한다",
        effect: { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 },
        voice: "스물아홉 번째도 빈칸으로 끝나지 않게, 해체 공지마다 승인자 이름을 적게 하는 규칙을 제안한다.",
        echo: "규칙이 생기면 다음 해체 공지에는 이름이 적힙니다. 이번 공지에는 끝내 적히지 않습니다.",
        cognition: { reframing: 3 },
      },
      {
        id: "b",
        label: "공지는 두고 트리거랩 사람들의 재배치 조건만 올린다",
        effect: { capital: 9, time: 7, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -5 },
        voice: "오늘 여섯 시면 권한이 끝난다며, 공지는 두고 트리거랩 사람들의 재배치 조건만 올린다.",
        echo: "재배치 조건은 좋아집니다. 해체 사유는 그대로 '성과 없음'으로 남습니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c",
        label: "없어진 조직 사람들의 기록 열람 청구를 대신 모은다",
        effect: { legitimacy: 8, trust: 9, capital: -7, time: -7, humanCost: 3, fatigue: 8 },
        voice: "제 기록이 어디에 쓰였는지 볼 길을 열어 주려고, 없어진 조직 사람들의 기록 열람 청구를 대신 모은다.",
        echo: "청구서가 모이면 옛 조직 사람들이 서로의 이름을 처음 봅니다. 청구를 처리할 부서는 아직 정해지지 않았습니다.",
        cognition: { persistence: 2 },
      },
    ],
  },
  evidencePlan: {
    node: "c24_evidence_turn",
    result: "c24_aftershock",
    sourceRoutes: ["c24_desks", "c24_rooftop", "c24_farewell", "c24_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "해체 공지를 단서 옆에 세워 두고, '성과 없음'이 어느 문서에서 나왔는지 거슬러 찾는다.",
    entryEcho: "첨부를 열면 공지와 같은 날 쓰인 다른 문서가 나옵니다. 그 문서는 해체를 실패라고 부르지 않습니다.",
    entryLabel: "해체 결정 문서에 딸린 내부 보고서를 연다",
    title: "성과 없음의 첨부 문서",
    speaker: "반재욱",
    text: "단서를 해체 문서의 첨부 번호에 대자 해체 결정 문서의 첨부 파일이 열립니다. 공지에는 '운영 성과 없음'이라고 적혀 있지만, 첨부된 내부 보고서의 제목은 '트리거랩 3년 운영 결과: 목표 달성'입니다. 결론 문단은 한 줄입니다. '참가자 반응 기록의 인사 이관을 끝으로 조직을 정리함.' 해체 비용의 항목 코드는 혁신위원회 광고 때의 예산 코드와 같습니다. 반재욱이 적던 수첩을 덮습니다. '밖에는 실패했다고 쓰고, 안에는 다 끝냈다고 씁니다. 같은 날, 같은 부서에서요.'",
    memo: ["내부 보고서 제목: '목표 달성'", "결론: 반응 기록 인사 이관 후 정리", "해체 비용 코드 = 혁신위원회 예산 코드"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 5, trust: 5, time: -5, fatigue: 5 },
    choices: [
      {
        id: "c24_evidence_turn_attach",
        label: "내부 보고서를 해체 이의서에 붙여 공식 제출한다",
        effect: { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 },
        voice: "'성과 없음'을 뒤집는 것은 그쪽이 쓴 문서라며, 내부 보고서를 해체 이의서에 붙여 공식 제출한다.",
        echo: "첨부하면 이의서는 반박할 수 없는 문서가 됩니다. 그 문서를 읽을 부서가 해체일 전에 답할지는 모릅니다.",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c24_evidence_turn_hold",
        label: "보고서는 쥐고 있다가 33층에서 처음 꺼낸다",
        effect: { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 },
        voice: "쓴 부서 앞에서 내밀어야 답을 들을 수 있다며, 보고서는 쥐고 있다가 33층에서 처음 꺼낸다.",
        echo: "쥐고 있으면 33층에서 강한 패가 됩니다. 그 사이 금요일 18시의 이관은 예정대로 진행됩니다.",
        cognition: { risk: 2 },
      },
      {
        id: "c24_evidence_turn_share",
        label: "기록이 옮겨질 참가자들에게 보고서부터 보여 준다",
        effect: { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 },
        voice: "제 기록이 '목표'였다는 것은 본인이 먼저 알아야 한다며, 기록이 옮겨질 참가자들에게 보고서부터 보여 준다.",
        echo: "보여 주면 참가자들이 자기 기록이 어디로 가는지 압니다. 몇 명은 그날 바로 열람 청구서를 씁니다.",
        cognition: { reframing: 2 },
      },
    ],
  },
  memoryPlan: {
    systemNext: "c24_route_system",
    evidenceNext: "c24_evidence_turn",
    systemLabel: "총회 전날 새로 짠 판이 해체 공지 문구에 비쳤는지 들여다본다",
    evidenceLabel: "빨간 점의 명단을 해체 결정 문서의 첨부에 대 본다",
    systemEcho: "들여다보면 공지에는 아무것도 비치지 않습니다. 네 글자 사유뿐입니다. 에코가 같은 네 글자를 받은 조직들을 한 줄씩 부릅니다.",
    evidenceEcho: "현황표의 예산 코드를 해체 문서에 대면 첨부 파일이 하나 열립니다. 제목이 공지와 반대입니다.",
  },
  openingRoutes: {
    c23_after_warm: "c24_start_warm",
    c23_after_record: "c24_start_record",
    c23_after_rush: "c24_start_rush",
  },
  openingCopy: {
    c24_start_warm: ["끝까지 남은 사람들의 해체 공지", "도윤하", "주주총회(회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의)가 끝난 금요일, 당신은 영동행 마지막 버스가 떠날 때까지 로비 앞에서 1주 주주들을 배웅했습니다. 사흘 뒤 월요일 아침 8시, 그 사람들이 당신보다 먼저 연락해 옵니다. 예약돼 있던 조직 개편 공지의 첫 줄이 트리거랩 해체라는 겁니다. 사유는 '운영 성과 없음'. 끝까지정밀 단체방에는 벌써 '성과 없는 사람들이 우리 공장을 살렸냐'는 메시지가 올라와 있고, 영동의 서정란 할머니는 나준혁에게 전화해 '그 착한 사람들 잘리는 거냐'고 묻습니다.", ["해체 공지: 3월 27일부, 사유 '운영 성과 없음'", "1주 모임 단체방 메시지 214개", "마지막 출근 금요일"]],
    c24_start_record: ["기록을 남긴 사람의 해체 공지", "에코", "찬성 50.6%와 그날의 발언을 당신은 주주 서한으로 정리해 이사회에 보냈습니다. 결정한 사람의 이름을 서명란에 실제로 남기자는 문장도 그 서한에 들어 있습니다. 서한이 이사회 서류의 별첨이 되고 사흘 뒤 월요일 아침, 그룹이 트리거랩 해체를 공지합니다. 사유는 '운영 성과 없음'. 에코가 공지의 결정 이력을 맨 아래까지 내립니다. 결정한 사람의 이름이 들어가야 할 칸이 비어 있습니다. 당신의 서한이 가장 먼저 비껴간 문서입니다.", ["해체 공지: 3월 27일부, 사유 '운영 성과 없음'", "공지 결정 이력의 승인자 칸 비어 있음", "주주 서한 -- 이사회 서류 별첨, 그룹 법무팀 열람 2회"]],
    c24_start_rush: ["먼저 달려간 사람의 해체 공지", "반재욱", "주주총회(회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의)가 끝나자마자 당신은 월요일 공지를 막으러 곧장 33층으로 올라갔습니다. 보안요원의 명단에는 당신 이름 옆에 빨간 점이 찍혀 있었고, 올라간 33층에서 그룹전략실 문은 끝내 열리지 않았습니다. 사흘 뒤 월요일, 공지는 예약된 8시보다 한 시간 이른 7시에 올라옵니다. 트리거랩 해체, 사유는 '운영 성과 없음'. 반재욱이 게시 시각을 짚습니다. '예약이 바뀐 게 금요일 오후예요. 당신이 33층 그 문 앞에 서 있던 시각입니다.'", ["33층 출입 명단: 당신 이름 옆 빨간 점", "공지 예약 변경: 08시 → 07시", "마지막 출근 금요일"]],
  },
  openingSignatures: {
    c24_start_warm: {
      label: "1주 모임 사람들에게 트리거랩 동료들의 다음 자리를 부탁한다",
      effect: { trust: 11, humanCost: -4, capital: -4, time: -5, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "먼저 연락해 온 사람들에게 기대 보기로 하고, 1주 모임 사람들에게 트리거랩 동료들의 다음 자리를 부탁한다.",
      echo: "부탁하면 끝까지정밀에서 제일 먼저 답이 옵니다. '우리 공장 경리 자리 비어요.' 이민서는 그 문자를 한참 봅니다.",
    },
    c24_start_record: {
      label: "해체 공지의 빈 승인자 칸을 주주 서한과 나란히 공개한다",
      effect: { legitimacy: 12, trust: -2, capital: -5, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "이름을 남기자던 서한이 가장 먼저 비껴간 문서라며, 해체 공지의 빈 승인자 칸을 주주 서한과 나란히 공개한다.",
      echo: "나란히 놓으면 서한과 공지가 서로를 설명합니다. 그룹은 공지를 고치지 않고, 대신 게시판 댓글 기능을 닫습니다.",
    },
    c24_start_rush: {
      label: "33층에 다녀간 일과 앞당겨진 공지 시각을 동료들에게 먼저 알린다",
      effect: { trust: 12, legitimacy: 5, humanCost: 3, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "예약이 바뀐 때가 내가 33층 앞에 서 있던 시각이라, 33층에 다녀간 일과 앞당겨진 공지 시각을 동료들에게 먼저 알린다.",
      echo: "알리면 동료들은 해체가 당신 때문인지 묻지 않습니다. 대신 오진우가 '한 시간 당겼으면 저쪽이 급했던 거네요'라고만 합니다.",
    },
  },
  // No new faces in the last case before the finale: the whole cast returns.
  characterProfiles: {},
  setting: { place: "트리거랩 4층 분석관실", clock: "해체까지 D-4 · 월요일" },
  sceneContext: {
    c24_start: {
      place: "트리거랩 4층 분석관실",
      clock: "해체까지 D-4 · 월요일",
      question: "해체 공지에 '성과 없음' 네 글자만 적혀 있습니다. 무엇부터 하겠습니까?",
      lead: "주주총회(회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의)가 끝나고 사흘, 월요일 8시 정각에 인트라넷을 새로 고친 이민서가 가장 먼저 숨을 멈춥니다.",
    },
    c24_start_warm: {
      place: "트리거랩 4층 분석관실",
      clock: "해체까지 D-4 · 월요일",
      question: "1주 모임 사람들이 해체 소식을 먼저 알려 왔습니다. 그 연락에 어떻게 답하겠습니까?",
      lead: "금요일 로비에서 마지막 버스까지 배웅한 사람들이, 월요일 아침 당신보다 먼저 공지를 봤습니다.",
    },
    c24_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "해체까지 D-4 · 월요일",
      question: "주주 서한에 남긴 문장을 해체 공지가 가장 먼저 비껴갔습니다. 그 빈칸을 어떻게 하겠습니까?",
      lead: "주주 서한이 이사회 서류에 붙고 사흘, 그 서한에 답하듯 해체 공지가 올라왔습니다.",
    },
    c24_start_rush: {
      place: "트리거랩 4층 분석관실",
      clock: "해체까지 D-4 · 월요일",
      question: "당신이 33층 앞에 선 시각에 공지 예약이 한 시간 당겨졌습니다. 이 시각을 누구에게 먼저 말하겠습니까?",
      lead: "33층의 닫힌 문 앞에서 돌아선 지 사흘, 월요일 아침 공지가 예약보다 한 시간 먼저 왔습니다.",
    },
    c24_desks: {
      place: "트리거랩 4층 분석관실 · 짐 싸는 책상",
      clock: "해체까지 D-3 · 화요일",
      question: "도윤하가 1,740명을 처음 적은 수첩을 어디에 두고 가야 할지 묻습니다. 어떻게 하겠습니까?",
      lead: "복사용지 상자 스무 개가 4층 복도에 쌓였습니다. 테이프 소리가 제일 먼저 난 곳은 오진우의 책상입니다.",
    },
    c24_oneline: {
      place: "트리거랩 4층 분석관실 · 이민서의 자리",
      clock: "해체까지 D-3 · 15시",
      question: "23쪽짜리 성과를 한 줄 칸에 적으라고 합니다. 그 칸을 어떻게 채우겠습니까?",
    },
    c24_oneline_reaction: {
      place: "트리거랩 4층 분석관실 · 반재욱의 자리",
      clock: "해체까지 D-3 · 17시",
      question: "해체 공지의 승인자 칸이 3년 전 대출 서류처럼 비어 있습니다. 이 빈칸을 어떻게 하겠습니까?",
    },
    c24_rooftop: {
      place: "트리거랩 옥상 · 벚나무 화분 옆",
      clock: "해체까지 D-2 · 수요일 19시",
      question: "한서윤이 트리거랩의 목적을 절반만 털어놓았습니다. 나머지 절반을 어떻게 하겠습니까?",
      lead: "수요일 저녁, 한서윤의 문자는 한 줄이었습니다. '옥상으로 와요. 커피 있어요.'",
    },
    c24_branch_server: {
      place: "트리거랩 서버실 · 반납 랙 앞",
      clock: "해체까지 D-2 · 20시",
      question: "금요일 18시, 참가자 기록이 동의 없이 인사 서버로 옮겨집니다. 어떻게 하겠습니까?",
    },
    c24_branch_server_follow: {
      place: "트리거랩 서버실 · 에코 단말",
      clock: "해체까지 D-2 · 20시 30분",
      question: "에코가 이관 목록 1번이 당신이라고 말합니다. 그 한 줄을 어떻게 쓰겠습니까?",
    },
    c24_scoreboard: {
      place: "트리거랩 4층 분석관실 · 사물함 앞",
      clock: "해체까지 D-2 · 23:00",
      question: "오진우가 스물세 사건 동안 몰래 적은 점수판을 내밉니다. 가져가게 하겠습니까, 지우겠습니까?",
    },
    c24_scoreboard_reaction: {
      place: "트리거랩 4층 · 계단참",
      clock: "해체까지 D-1 · 목요일 09시",
      question: "임경수가 트리거랩이 받은 종이 원본 목록을 들고 왔습니다. 이 목록을 어떻게 하겠습니까?",
    },
    c24_farewell: {
      place: "회사 앞 포장마차 · 송별회",
      clock: "해체까지 D-1 · 목요일 21시",
      question: "'내일도 출근합시다'라는 건배사 뒤에 출근할 곳이 없습니다. 이 밤을 어떻게 하겠습니까?",
      lead: "포장마차 비닐 천막 안에 테이블 다섯 개를 붙였습니다. 영동에서 올라온 나준혁이 벌써 국자를 쥐고 있습니다.",
    },
    c24_press: {
      place: "회사 앞 포장마차 · 천막 밖 골목",
      clock: "해체까지 D-1 · 23:40",
      question: "서하린이 금요일 아침에 해체 기사를 낼 수 있다고 합니다. 동료들의 이름을 어떻게 하겠습니까?",
    },
    c24_press_reaction: {
      place: "퇴근길 택시 안",
      clock: "마지막 출근일 · 01:10",
      question: "문하준이 트리거랩 같은 곳에 들어갈 수 있냐고 묻습니다. 무엇이라 답하겠습니까?",
    },
    c24_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "해체까지 D-2",
      question: "그룹이 없앤 조직 28곳이 같은 사유 '성과 없음'을 받았습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c24_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "마지막 출근일 · 새벽",
      question: "승인자 칸은 스물아홉 번째에도 비어 있습니다. 읽기 권한이 남은 오늘, 무엇을 남기겠습니까?",
    },
    c24_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 해체 결정 문서",
      clock: "마지막 출근일 · 07시",
      question: "밖에는 '성과 없음', 안에는 '목표 달성'이라고 적혔습니다. 이 보고서를 어떻게 쓰겠습니까?",
    },
    c24_final: {
      place: "KD금융그룹 본사 33층 · 엘리베이터 로비",
      clock: "마지막 출근일 · 16시 · 출입 권한 소멸 두 시간 전",
      question: "백아린이 3년 전 서명란의 수신 기록을 건넵니다. 이 봉투를 어떻게 받겠습니까?",
      lead: "출입 카드 반납 서류를 들고 33층 버튼을 누릅니다. 이 버튼을 누르는 것도 오늘이 마지막입니다.",
    },
    c24_aftershock: {
      place: "트리거랩 4층 분석관실 · 불 끄기 직전",
      clock: "마지막 출근일 · 18시",
      question: "불이 꺼진 4층에서 윤상혁이 오늘 밤 올라오라고 합니다. 이 마지막 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c24-dissolution-report",
    title: "성과 없음의 첨부 문서",
    text: "해체 공지는 '운영 성과 없음'이라고 했지만, 같은 날 같은 부서가 쓴 내부 보고서의 제목은 '목표 달성'이었습니다. 결론은 참가자 반응 기록을 인사부로 옮긴 뒤 조직을 정리한다는 한 줄이었습니다.",
  },
  outcomes: {
    c24_after_warm: { tag: "끝까지 남은 결말", title: "불 꺼진 4층에서 마지막 밤을 함께 보냈다", text: "트리거랩의 불이 꺼진 뒤에도 아무도 먼저 계단을 내려가지 않았습니다. 33층의 호출은 이 밤이 끝날 때까지 기다렸습니다." },
    c24_after_record: { tag: "봉인을 풀어 달라고 쓴 결말", title: "트리거랩이 남긴 마지막 문서는 봉인 해제 요청서였다", text: "해체 직전, 모든 참가자의 기록을 본인에게 돌려 달라는 요청서가 접수됐습니다. 이 방이 남긴 마지막 기록입니다." },
    c24_after_rush: { tag: "곧장 올라간 결말", title: "불이 꺼지자마자 33층으로 떠났다", text: "동료들이 계단을 내려가는 동안 당신은 골목에서 택시를 잡았습니다. 18시 이후에도 본사 33층 권한만은 살아 있었습니다." },
  },
  carryovers: {
    c24_after_warm: { trust: 10, humanCost: -5, fatigue: -8 },
    c24_after_record: { legitimacy: 12, trust: 3, fatigue: 5 },
    c24_after_rush: { capital: 6, legitimacy: 5, trust: -8 },
  },
  continuityChallenges: {
    c23_after_warm: { id: "protect-trust", title: "끝까지 남은 사람들과 끝까지 가기", text: "마지막 버스까지 배웅한 사람들이 해체 소식을 먼저 들고 왔습니다. 흩어지는 동료들을 그 사람들과 함께 붙드는 카드에 믿음을 겁니다." },
    c23_after_record: { id: "use-reframe", title: "비껴간 서한을 다시 들이밀기", text: "서명란에 이름을 남기자는 주주 서한을 해체 공지가 가장 먼저 비껴갔습니다. 그 빈칸이 누구 것인지 가리려면 판을 새로 깔아야 합니다." },
    c23_after_rush: { id: "repair-legitimacy", title: "당겨진 한 시간을 동료들에게 밝히기", text: "먼저 달려간 33층 앞에서 문은 열리지 않았고, 해체 공지는 한 시간 당겨졌습니다. 그 한 시간을 동료들 앞에 그대로 내놓을 때 공정함이 되살아납니다." },
  },
};
