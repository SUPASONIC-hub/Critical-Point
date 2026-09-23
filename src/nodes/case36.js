/**
 * CASE 36 -- the chairman's table, and the offer to end everything with one name.
 *
 * Five cases of investigation have closed in on 윤상혁: an inspection, a raid,
 * a whistleblower, his daughter's notebook, a flood that showed what the group's
 * machines do to people when nobody signs. The man above him has never appeared.
 * 서도경, chairman of KD금융그룹, invites the analyst to dinner at his house in
 * 한남동. He decides everything and signs nothing; his invitation card is in his
 * secretary's handwriting. Over nine courses whose names nobody can remember --
 * he calls them by number -- he makes the offer: put the whole chain on 윤상혁,
 * declare the reform finished, and sit in the compliance officer's chair that
 * certifies it.
 *
 * The case is about the shape repeating one floor higher. The garden has a
 * persimmon tree the chairman's father planted and a ladder the analyst is asked
 * to hold, exactly as 윤상혁 held it twelve years ago. Under that tree the chairman
 * tells the only story he has never delegated: his father's small market savings
 * bank in 대구 fell because he signed one guarantee, and the son decided never to
 * write his own name on paper again. The emotional range stays wide: anger at a
 * press release already drafted with the analyst's name slot left blank, comedy
 * from a chef who lengthens every dish name as revenge on a man who never learns
 * them, grief in a phone call from 윤상혁 asking that his daughter not be told,
 * and joy in 강태민 waiting outside the gate with two cup noodles and a guard he
 * has already befriended. The case ends in the truck going home, where 이민서
 * reports that an account with no name has opened the lab's reaction records
 * three times tonight -- three days before 사건 37's leak.
 */
export const case36Nodes = {
  c36_start: {
    phase: "CASE 36 BRIEFING",
    title: "한남동의 카드",
    speaker: "한서윤",
    text:
      "7월 20일 월요일 아침, 회장 비서실의 문자가 온 다음 날입니다. KD캐피탈 위험관리부 당신 책상에 두꺼운 크림색 카드가 놓여 있습니다. '일요일 19시, 한남동. 밥이나 한 끼 하지. 서도경.' KD금융그룹 회장의 이름입니다. 같은 날 오전, 윤상혁은 해온파트너스 자문료(조언값이라며 내보낸 돈) 배임(회사에 손해를 끼친 죄) 혐의로 두 번째 검찰 소환을 받습니다. 카드를 들고 1층에 내려가자 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 중인 한서윤이 아이스커피 두 잔을 들고 기다립니다. 카드를 뒤집어 보더니 웃지도 않습니다. '이거 회장님 글씨 아니에요. 비서실장 글씨예요. 그분은 자기 이름도 남이 쓰게 해요.' 그가 빨대를 한 번 돌립니다. '그 식탁에 불려 가는 사람은 두 종류예요. 자리를 받는 사람, 그리고 자리를 비워 주는 사람.'",
    memo: [
      "초대: 7월 26일 일요일 19시, 한남동 회장 자택",
      "윤상혁 -- 해온파트너스 자문료 배임 혐의, 두 번째 소환",
      "카드 글씨: 비서실장 여민규",
      "당신의 신분: 같은 사건의 검찰 참고인",
    ],
    triggers: ["curiosity", "fear", "trust"],
    choices: [
      {
        id: "c36_start_share",
        label: "초대장을 여섯 명의 단체방에 올리고 같이 정한다",
        effect: { trust: 11, humanCost: -3, time: -5, capital: -2, fatigue: 4 },
        next: "c36_garden",
        cognition: { persistence: 2 },
      },
      {
        id: "c36_start_log",
        label: "초대받은 사실을 참고인 진술 기록에 먼저 남긴다",
        effect: { legitimacy: 12, time: -4, trust: -2, humanCost: 2, fatigue: 3 },
        next: "c36_garden",
        cognition: { inference: 2 },
      },
      {
        id: "c36_start_alone",
        label: "누구에게도 말하지 않고 일요일에 혼자 간다",
        effect: { capital: 7, time: 5, legitimacy: -3, trust: -3, humanCost: 3, fatigue: -1 },
        next: "c36_garden",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c36_garden",
      },
    ],
  },
  c36_garden: {
    phase: "THE GARDEN",
    title: "사다리를 잡아 주게",
    speaker: "서도경",
    text:
      "일요일 저녁, 강태민의 낡은 1톤 트럭이 한남동 언덕을 오릅니다. 야간조 출근 전이라며 태워 준 그는 대문 앞에서 시동을 끕니다. '저는 여기까지요. 컵라면 두 개 있어요.' 대문 안은 폭염이 거짓말처럼 서늘합니다. 돌길 끝 감나무 아래, 밀짚모자를 쓴 노인이 사다리에 올라 가지를 치고 있습니다. 정원사인 줄 알았던 그가 내려다봅니다. '사다리 좀 잡아 주게. 아버지가 심은 나무라 남한테 못 맡기네.' 서도경 회장입니다. 가위질 사이로 그가 묻습니다. '열흘 전 비에 망원시장이 잠겼다지. 떡집은 괜찮은가.' 문가을의 가게도, 노아가 거절한 긴급대출 건수도 그는 이미 압니다. '회사는 사람이 아니라 기억으로 굴러가네. 나는 기억을 좀 많이 하는 편이고.'",
    memo: [
      "감나무 61년 -- 회장의 부친이 심음",
      "회장이 먼저 꺼낸 화제: 망원시장 수해",
      "대문 밖 대기: 강태민의 1톤 트럭",
      "식탁에 앉기까지 30분",
    ],
    triggers: ["curiosity", "manipulation", "fear"],
    choices: [
      {
        id: "c36_garden_flood",
        label: "사다리를 잡은 채 수해 긴급대출 거절부터 따진다",
        effect: { trust: 12, humanCost: -5, legitimacy: -2, time: -5, fatigue: 4 },
        next: "c36_table",
        cognition: { persistence: 2 },
      },
      {
        id: "c36_garden_record",
        label: "참고인 신분이라 오늘 대화를 기록하겠다고 먼저 밝힌다",
        effect: { legitimacy: 11, trust: -3, time: -3, humanCost: 3, fatigue: 4 },
        next: "c36_table",
        cognition: { inference: 2 },
      },
      {
        id: "c36_garden_ladder",
        label: "말없이 사다리를 잡아 주며 회장의 이야기를 듣는다",
        effect: { capital: 6, time: 4, trust: -2, humanCost: 2, fatigue: -3 },
        next: "c36_table",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c36_table",
      },
    ],
  },
  c36_table: {
    phase: "THE TABLE",
    title: "이름이 너무 긴 요리",
    speaker: "서도경",
    text:
      "열두 명이 앉는 식탁에 두 자리만 차려져 있습니다. 젊은 셰프 은재하가 첫 접시를 내려놓으며 읊습니다. '제주 햇감자 퓌레 위에 올린 72시간 숙성 한우 채끝, 산청 매실 조청과 구운 대파 재를 곁들였습니다.' 회장이 고개를 끄덕입니다. '첫 번째 것이군.' 다섯 번째 접시까지 그는 번호로만 부릅니다. 뒤에서 메뉴 카드를 보며 속삭이던 비서실장 여민규가 '대파 재'를 '대파 제'로 읽자 셰프의 눈썹이 올라갑니다. 여섯 번째 접시에서 회장이 포크를 내려놓습니다. '윤상혁 하나면 되네. 검찰도 신문도 이름 하나를 원하지. 그 이름을 주고 그룹은 개혁 완료를 선언하네. 자네는 그 선언을 확인하는 자리에 앉게.' 그 자리는 준법감시인(회사가 법과 규정을 지키는지 안에서 감시하는 책임자)입니다. 꼬리 자르기(아랫사람 한 명에게 책임을 다 지우고 윗선은 빠지는 것)의 값입니다.",
    memo: [
      "식탁 12인용 -- 차린 자리 2개",
      "요리 아홉 가지, 회장은 번호로 부름",
      "제안: 윤상혁 단독 책임 + 개혁 완료 선언",
      "대가: 그룹 준법감시인 자리",
    ],
    triggers: ["injustice", "manipulation", "reward"],
    choices: [
      {
        id: "c36_table_victims",
        label: "윤상혁 한 명이 아니라 피해자 1,740명 이야기부터 꺼낸다",
        effect: { trust: 12, legitimacy: 3, humanCost: -5, capital: -4, time: -4, fatigue: 5 },
        next: "c36_father",
        cognition: { reframing: 2 },
      },
      {
        id: "c36_table_terms",
        label: "준법감시인의 권한과 임기를 문서로 먼저 보여 달라고 한다",
        effect: { legitimacy: 12, trust: -3, time: -5, humanCost: 3, fatigue: 3 },
        next: "c36_father",
        cognition: { inference: 2 },
      },
      {
        id: "c36_table_listen",
        label: "여섯 번째 접시 이름을 따라 외우며 제안을 끝까지 듣는다",
        effect: { capital: 8, time: 4, trust: -3, legitimacy: 2, humanCost: 3, fatigue: -2 },
        next: "c36_father",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c36_father",
      },
    ],
  },
  c36_father: {
    phase: "THE FATHER",
    title: "아버지의 금고",
    speaker: "서도경",
    text:
      "디저트는 회장이 직접 깎은 복숭아입니다. 그가 당신을 감나무 아래 벤치로 데리고 나와 낡은 통장 하나를 내밉니다. 표지에 '서문상호신용금고'라고 찍혀 있습니다. 상호신용금고(지금의 저축은행 같은 동네 금융회사)입니다. '아버지 가게였네. 대구 시장 상인들 돈을 받아 상인들한테 빌려줬지. 친구 회사 보증서에 이름 한 줄 쓴 게 시작이었어.' 그 회사가 쓰러지자 금고 앞에 줄이 섰고, 아버지는 예금자 집을 한 집씩 돌며 절을 했다고 합니다. '두 해 뒤에 돌아가셨네. 나는 열아홉이었고.' 복숭아 즙이 손목으로 흐르는데 그는 닦지 않습니다. '그 뒤로 나는 종이에 내 이름을 안 쓰네. 이름을 쓴 사람이 다 치르더군.' 목소리가 잠깐 흔들리다 곧 돌아옵니다. '그러니 이번에도 이름 하나면 되네.'",
    memo: [
      "서문상호신용금고 -- 1980년 문 닫음",
      "회장의 부친: 보증서 서명 한 줄, 2년 뒤 세상을 떠남",
      "회장 이름이 적힌 결정 문서: 지난 20년 0건",
      "쇄신 발표 예정일: 8월 3일 월요일",
    ],
    triggers: ["helplessness", "selfAwareness", "manipulation"],
    choices: [
      {
        id: "c36_father_stay",
        label: "아버지 이야기를 끝까지 듣고 그 줄에 섰던 사람들을 묻는다",
        effect: { trust: 13, humanCost: -4, legitimacy: -3, time: -3, fatigue: 6 },
        next: "c36_final",
        cognition: { persistence: 1, reframing: 1 },
      },
      {
        id: "c36_father_sign",
        label: "이번에는 회장님 이름으로 결정하라고 서명을 요구한다",
        effect: { legitimacy: 13, trust: 3, time: -5, humanCost: 2, capital: -3, fatigue: 4 },
        next: "c36_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c36_father_raise",
        label: "흔들린 틈을 타 동료들의 복직을 조건에 더 얹는다",
        effect: { capital: 9, time: 3, trust: -2, humanCost: 4, fatigue: -2 },
        next: "c36_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c36_final",
      },
    ],
  },
  c36_final: {
    phase: "FINAL DECISION",
    title: "비워 둔 액자 자리",
    speaker: "서도경",
    text:
      "식탁에 돌아오니 접시는 치워지고 종이 두 장이 놓여 있습니다. 준법감시인(회사가 법과 규정을 지키는지 안에서 감시하는 책임자) 임명안과 다음 주 월요일자 쇄신 발표문입니다. 임명안 맨 아래 서명란에는 회장의 이름이 없습니다. 이사회 의장 대행의 이름이 인쇄돼 있습니다. 회장이 복숭아 씨를 접시에 내려놓습니다. '다음 주 월요일 이사회에 올리네. 윤상혁은 월요일에 물러나고, 검찰에는 그룹이 먼저 자료를 내지. 자네 첫 업무는 배상 2차 기준과 212명으로 해도 좋네. 그게 자네가 원하던 거 아닌가.' 그가 처음으로 당신 눈을 똑바로 봅니다. '이름 하나로 수천 명이 편해지네. 아버지 때도 그랬으면 좋았을 거야.' 여민규가 펜을 식탁 위에 가로로 내려놓습니다.",
    memo: [
      "준법감시인 임명안 -- 서명란: 이사회 의장 대행",
      "쇄신 발표문: 8월 3일 월요일, 윤상혁 단독 책임",
      "제시된 첫 업무: 배상 2차 기준과 212명",
      "이사회: 8월 3일 월요일",
    ],
    triggers: ["choice", "injustice", "responsibility"],
    choices: [
      {
        id: "c36_final_refuse",
        label: "자리를 거절하고 동료·피해자들과 조사를 끝까지 간다",
        effect: { trust: 12, legitimacy: 6, capital: -10, time: -6, humanCost: -3, fatigue: 6 },
        next: "case36_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c36_final_audit",
        label: "자리를 받되 첫 감사 대상을 이 식탁으로 정한다",
        effect: { legitimacy: 13, trust: 5, capital: -6, time: -7, humanCost: 2, fatigue: 5 },
        next: "case36_result",
        cognition: { reframing: 2, inference: 1 },
      },
      {
        id: "c36_final_take",
        label: "자리를 받고 배상 2차를 월요일 발표문에 넣게 한다",
        effect: { capital: 11, time: 5, humanCost: -5, trust: -2, legitimacy: -5, fatigue: 2 },
        next: "case36_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case36_result",
      },
    ],
  },
};

/**
 * Everything else case 36 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case36 = {
  id: "case36",
  nodes: case36Nodes,
  aftermath: {
    c36_aftershock: {
      phase: "AFTERMATH",
      title: "대문 밖의 트럭",
      speaker: "강태민",
      text: "대문이 닫히고, 강태민의 트럭이 한남동 언덕을 내려갑니다. 밤 열한 시가 넘었는데 창문을 열어도 바람이 뜨겁습니다. 조수석 서랍에서 비닐에 싼 떡이 나옵니다. 문가을이 '회장님 집 밥은 배 안 부를 거니까'라며 오후에 강태민 편에 보낸 것입니다. 한 입 베어 물자 강태민이 앞만 보고 말합니다. '오늘 거기서 뭘 골랐든, 저는 내일도 출근해요. 그러니까 괜찮아요.' 신호에 걸린 사이 휴대폰이 울립니다. 이민서입니다. 'KD데이터랩 서버에서 트리거랩 반응 기록 폴더가 오늘 밤에만 세 번 열렸어요. 연 계정에 이름이 없어요. 이름 없는 계정은 원래 있을 수가 없는데요.'",
      memo: ["한남동 출발 23:12", "문가을의 떡 -- 강태민 편으로", "이민서: 트리거랩 기록 폴더 접속 3회, 계정 이름 없음", "8월 3일 이사회까지 여드레"],
      triggers: ["affection", "fear", "choice"],
      choices: [
        { id: "c36_after_warm", label: "트럭을 돌려 헌책방 1층의 동료들 곁으로 먼저 간다", effect: { trust: 12, humanCost: -5, time: -2, capital: -4, fatigue: -8 }, next: "case36_result", cognition: { reframing: 2 } },
        { id: "c36_after_record", label: "식탁의 제안을 문장 그대로 적어 한지우와 나은호에게 보낸다", effect: { legitimacy: 14, trust: 4, time: -4, capital: -3, fatigue: 5 }, next: "case36_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c36_after_rush", label: "그 길로 사무실에 가서 꼬리 자르기에 쓰일 서류부터 복사한다", effect: { capital: 7, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 4 }, next: "case36_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c36_final", "c36_aftershock"],
  connectiveScenes: [
    ["c36_phone", "c36_garden", "c36_table", "옻칠 바구니", "여민규", "현관 복도에서 비서실장 여민규가 기다립니다. 20년째 회장 곁에 있는 사람, 한서윤 말로는 회장 이름으로 나가는 문장을 전부 쓰는 사람입니다. 그가 옻칠한 바구니와 종이 한 장을 내밉니다. '식탁에는 휴대폰이 오르지 않습니다. 그리고 이건 형식입니다.' 비밀유지 서약서(식탁에서 들은 말을 밖에 옮기지 않겠다는 약속)입니다. 제3조가 눈에 걸립니다. '들은 내용은 수사기관을 포함한 제3자에게 알리지 않는다.' 여민규가 펜 뚜껑을 열어 건넵니다. '다들 서명하셨습니다. 윤 대표님도요.'", ["휴대폰 보관 바구니 -- 옻칠, 칸 두 개", "서약서 제3조: 수사기관 포함 제3자 비공개", "여민규: 비서실장 20년, 회장 명의 문장 작성"], ["서명 대신 들은 말은 동료와 나누겠다고 미리 말한다", "수사기관 조항을 지우고 불법은 예외라고 고쳐 쓴다", "형식이라니 서약서에 서명하고 휴대폰을 맡긴다"]],
    ["c36_draft", "c36_table", "c36_father", "세 번째 문단", "여민규", "디저트 전, 회장이 전화를 받으러 서재로 가자 여민규가 대기실로 당신을 안내합니다. 탁자 위에 A4 두 장이 뒤집혀 있습니다. 치우는 걸 잊은 척하는 건지 정말 잊은 건지는 모르겠습니다. 제목은 'KD금융그룹 쇄신 완료 발표문', 날짜는 8월 3일 월요일입니다. 세 번째 문단에 이런 문장이 있습니다. '신임 준법감시인은 이번 조치로 재발 방지가 충분하다고 확인하였다.' 이름 칸은 비어 있습니다. 여민규가 물컵을 내려놓습니다. '회장님 이름으로 나가는 문장은 전부 제가 씁니다. 이번 문장만은 제 것이 아니었으면 좋겠네요.'", ["쇄신 완료 발표문 -- 8월 3일 월요일자", "세 번째 문단: 신임 준법감시인의 '확인'", "이름 칸 비어 있음, 작성자 여민규"], ["세 번째 문단의 내 이름 칸을 지워 달라고 한다", "발표문의 날짜와 문장을 손으로 베껴 적어 둔다", "못 본 척 발표문을 뒤집어 두고 자리로 돌아간다"]],
    ["c36_gate", "c36_father", "c36_final", "대문 밖 10분", "강태민", "회장이 말합니다. '대문 밖에서 10분 생각하고 오게. 답은 식탁에서 듣지.' 여민규가 휴대폰을 돌려줍니다. 대문 밖 골목, 강태민이 트럭 짐칸에 걸터앉아 경비원과 컵라면을 나눠 먹고 있습니다. 경비원이 먼저 인사합니다. '반장님이 물을 딱 선까지 붓더라고요.' 휴대폰에는 단체방 메시지 186개가 쌓여 있습니다. 권도현은 준법감시인 연봉과 윤상혁 혐의를 두 칸짜리 표로 만들어 '어느 칸도 흑자가 아닙니다'라고 적었고, 오진우는 '받으면 1등, 거절하면 전설'이라고 썼습니다. 도윤하는 한 줄만 남겼습니다. '누구 이름이 빠지는지 봐요.'", ["단체방 메시지 186개", "강태민과 경비원 -- 컵라면 두 개째", "회장이 준 시간: 10분"], ["투표 대신 동료들에게 각자 한 줄씩만 달라고 한다", "단체방 대화 전체를 제안 기록으로 저장해 둔다", "휴대폰을 덮고 강태민의 컵라면부터 한 젓가락 먹는다"]],
  ],
  connectiveOrder: [["c36_garden", "c36_phone"], ["c36_table", "c36_draft"], ["c36_father", "c36_gate"]],
  choiceEffects: {
    c36_garden: [
      { trust: 10, legitimacy: 3, humanCost: -4, capital: -3, time: -4, fatigue: 4 },
      { legitimacy: 9, trust: 2, time: -6, humanCost: 3, fatigue: 2 },
      { time: 5, capital: 5, trust: 2, legitimacy: -1, humanCost: 4, fatigue: -3 },
    ],
    c36_table: [
      { legitimacy: 8, trust: 5, capital: -4, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: -2, humanCost: 2, time: -4, fatigue: 5 },
      { time: 4, capital: 5, trust: -1, humanCost: 3, fatigue: -4 },
    ],
    c36_father: [
      { trust: 10, humanCost: -4, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 10, trust: 4, time: -5, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 3, trust: 3, humanCost: 2, fatigue: -5 },
    ],
  },
  choiceCopy: {
    c36_garden: {
      voice: ["서명 대신, 들은 말은 동료와 나누겠다고 미리 말한다.", "수사기관 조항을 지우고, 불법은 예외라고 고쳐 쓴다.", "형식이라니, 서약서에 서명하고 휴대폰을 맡긴다."],
      echo: ["미리 말하면 여민규가 처음으로 펜을 거둡니다. 서약서 없는 손님은 20년 만이라고, 그는 수첩에 적습니다.", "고친 서약서는 받아들여집니다. 여민규는 고친 줄 위에 자기 도장을 찍고, 그 도장은 회장의 것이 아닙니다.", "서명하면 식탁은 부드러워집니다. 오늘 들을 말은 그 순간부터 수사기관에 가져갈 수 없는 말이 됩니다."],
    },
    c36_table: {
      voice: ["세 번째 문단의, 내 이름 칸을 지워 달라고 한다.", "발표문의 날짜와 문장을, 손으로 베껴 적어 둔다.", "못 본 척, 발표문을 뒤집어 두고 자리로 돌아간다."],
      echo: ["지워 달라고 하면 여민규가 연필로 그 칸에 줄을 긋습니다. 월요일 인쇄본에서 그 줄이 남을지는 회장이 정합니다.", "베껴 적은 종이는 휴대폰이 없는 방에서 유일한 기록이 됩니다. 손글씨는 증거로 약하지만 날짜는 정확합니다.", "뒤집어 두면 발표문은 제자리에 남습니다. 월요일 아침, 그 빈칸은 누군가의 이름으로 채워집니다."],
    },
    c36_father: {
      voice: ["투표 대신, 동료들에게 각자 한 줄씩만 달라고 한다.", "단체방 대화 전체를, 제안 기록으로 저장해 둔다.", "휴대폰을 덮고, 강태민의 컵라면부터 한 젓가락 먹는다."],
      echo: ["한 줄씩 받으면 여섯 줄이 옵니다. 한서윤의 줄이 가장 늦게 오고, 가장 짧습니다. '저는 받았어요. 12년 전에.'", "저장한 대화는 날짜가 찍힌 기록이 됩니다. 권도현의 표도 함께 증거 목록에 올라갑니다.", "컵라면은 식었습니다. 강태민이 '10분 중에 3분은 이게 제일 잘 쓴 시간이에요'라며 국물까지 건넵니다."],
    },
  },
  reactionScenes: [
    ["c36_phone_reaction", "c36_phone", "c36_table", "바구니에 넣기 전", "윤서진", "휴대폰을 바구니에 넣으려는 순간 화면에 메시지가 뜹니다. 윤서진입니다. '오늘 한남동 가시죠. 아빠가 알아요. 저녁 내내 거실에서 시계만 봐요.' 한 줄이 더 옵니다. '아빠는 그 식탁에 12년을 앉았어요. 그 의자에 오늘 누가 앉는지가 아빠한테는 판결 같대요. 저는 아빠가 벌받길 바라요. 근데 아빠 혼자 받는 건 싫어요. 그게 이상한가요?' 여민규가 바구니를 든 채 기다립니다. 에어컨 바람에 서약서 모서리가 들립니다.", ["'이상하지 않다'고 답하고 휴대폰을 맡긴다", "메시지를 참고인 자료로 남겨도 되는지 윤서진에게 묻는다", "답장 없이 휴대폰을 바구니에 넣는다"]],
    ["c36_draft_reaction", "c36_draft", "c36_father", "일곱 번째 접시", "은재하", "대기실에서 나오는 길에 주방 문이 열려 있습니다. 은재하가 남은 재료로 직원들 비빔밥을 비비다 당신을 보고 숟가락을 하나 더 꺼냅니다. '요리 이름이 긴 건 제 복수예요. 회장님은 한 번도 안 외우시거든요. 3년째 한 단어씩 늘리는 중이에요.' 주방 직원들이 웃습니다. 그러다 그가 숟가락을 멈춥니다. '저희 엄마가 망원시장에서 반찬가게를 해요. 열흘 전 비에 냉장고 세 대가 다 잠겼는데, 긴급대출이 0.6초 만에 거절됐대요. 회장님 댁 주방에서 일하는 아들을 둔 엄마가요.'", ["어머니 가게의 긴급대출을 사람 심사로 다시 올리겠다고 한다", "수해 거절 사례로 기록해도 되는지 은재하에게 묻는다", "비빔밥만 한 숟가락 먹고 식탁으로 돌아간다"]],
    ["c36_gate_reaction", "c36_gate", "c36_final", "12년 전의 사다리", "윤상혁", "10분 중 4분이 남았을 때 모르는 번호로 전화가 옵니다. 윤상혁입니다. 목소리가 생각보다 가볍습니다. '감나무 사다리, 잡아 드렸나. 나도 12년 전에 잡았지.' 그가 짧게 웃습니다. '받게. 거절하면 그 의자에 다른 사람이 앉고, 그 사람은 자네보다 덜 귀찮을 걸세. 나는 어차피 이름 하나로 끝날 사람이야.' 잠깐 숨소리만 들립니다. '서진이한테는 말하지 말게. 그 애는 아직 내가 혼자가 아니라고 믿거든.' 그가 대답을 기다립니다. 강태민이 컵라면 국물을 마시다 당신 얼굴을 봅니다.", ["윤상혁에게 식탁의 제안을 있는 그대로 알려 준다", "통화 내용을 참고인 진술에 붙이겠다고 말한다", "대답하지 않고 전화를 끊은 채 대문 안으로 들어간다"]],
  ],
  reactionEffects: {
    c36_phone: [
      { trust: 9, humanCost: -5, time: -3, fatigue: 3 },
      { legitimacy: 7, trust: 3, capital: -3, time: -3, fatigue: 3 },
      { time: 4, capital: 3, trust: 3, legitimacy: 2, humanCost: 2, fatigue: -3 },
    ],
    c36_draft: [
      { trust: 11, humanCost: -6, capital: -4, time: -3, fatigue: 4 },
      { legitimacy: 8, trust: 3, humanCost: 1, time: -4, fatigue: 3 },
      { time: 3, capital: 3, trust: 2, humanCost: 3, fatigue: -3 },
    ],
    c36_gate: [
      { trust: 8, legitimacy: 4, humanCost: -3, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: -2, capital: -3, time: -2, fatigue: 3 },
      { time: 4, capital: 4, trust: -2, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c36_phone: {
      voice: ["'이상하지 않다'고 답하고, 휴대폰을 맡긴다.", "메시지를 참고인 자료로 남겨도 되는지, 윤서진에게 묻는다.", "답장 없이, 휴대폰을 바구니에 넣는다."],
      echo: ["답장을 받은 윤서진이 '고마워요' 한 줄을 보냅니다. 그 한 줄은 바구니 안에서 식사가 끝날 때까지 읽히지 않습니다.", "물으면 윤서진은 한참 뒤에 '네'라고 합니다. 딸의 문장이 아버지 사건의 기록이 됩니다.", "바구니 뚜껑이 닫힙니다. 윤서진의 질문은 읽음 표시만 달린 채 한남동의 밤을 보냅니다."],
    },
    c36_draft: {
      voice: ["어머니 가게의 긴급대출을, 사람 심사로 다시 올리겠다고 한다.", "수해 거절 사례로 기록해도 되는지, 은재하에게 묻는다.", "비빔밥만 한 숟가락 먹고, 식탁으로 돌아간다."],
      echo: ["약속하면 은재하가 여덟 번째 접시 이름에서 한 단어를 뺍니다. 회장은 그래도 '여덟 번째 것'이라고 부릅니다.", "기록해도 된다고 하면서 은재하가 조건을 답니다. '엄마 이름은 빼 주세요. 동네에서 창피해하세요.'", "비빔밥은 이 집에서 먹은 것 중 가장 맛있습니다. 은재하의 어머니 가게 냉장고는 다음 주에도 꺼져 있습니다."],
    },
    c36_gate: {
      voice: ["윤상혁에게, 식탁의 제안을 있는 그대로 알려 준다.", "통화 내용을, 참고인 진술에 붙이겠다고 말한다.", "대답하지 않고, 전화를 끊은 채 대문 안으로 들어간다."],
      echo: ["있는 그대로 들은 윤상혁이 한참 말이 없다가 '역시 그 문장이군' 합니다. 12년 전 그가 들은 말과 같은 말입니다.", "진술에 붙인다고 하자 윤상혁이 웃습니다. '그래, 자네는 그래야지.' 그리고 먼저 전화를 끊습니다.", "끊긴 전화 너머에 윤상혁이 남습니다. 강태민이 빈 컵라면 용기 두 개를 겹쳐 짐칸에 넣습니다."],
    },
  },
  reactionMemos: {
    c36_phone_reaction: ["윤서진: '아빠 혼자 받는 건 싫어요'", "윤상혁은 그 식탁에 12년 앉았다"],
    c36_draft_reaction: ["요리 이름이 긴 이유: 셰프의 복수", "셰프 어머니 가게 긴급대출 -- 0.6초 거절"],
    c36_gate_reaction: ["윤상혁도 12년 전 같은 사다리를 잡았다", "'서진이한테는 말하지 말게'"],
  },
  branchPlan: ["c36_garden", 2, "c36_branch_annex", "c36_branch_annex_follow"],
  branchScenes: {
    // CASE 36's detour is the annex corridor. The garden hands the analyst a
    // ladder; the side door shows the wall of photographs taken under the same
    // tree, and the nail holes left where the people who took the blame hung.
    c36_branch_annex: {
      phase: "SIDE DOOR",
      title: "별채 복도의 못 자국",
      speaker: "석문호",
      text: "회장이 전화를 받으러 들어간 사이, 진짜 정원사 석문호가 물 호스를 감으며 턱짓을 합니다. '더우시면 별채 복도에 들어가 계세요. 에어컨은 거기가 세요.' 별채 복도 양쪽 벽에 액자가 마흔 개쯤 걸려 있습니다. 전부 회장과 임원 한 명이 이 감나무 아래서 찍은 사진입니다. 석문호가 호스를 내려놓습니다. '마흔 해 이 집 정원을 봤는데, 사진이 걸리는 사람보다 내려가는 사람이 많아요. 내려간 자리엔 못 자국이 남고.' 그가 벽을 손가락으로 짚어 갑니다. 못 자국이 열한 개입니다.",
      memo: ["별채 복도 액자 약 40개 -- 모두 감나무 아래", "액자를 뗀 못 자국 11개", "정원사 석문호: 이 집 정원 40년", "회장 통화 중 -- 식탁까지 20분"],
      triggers: ["curiosity", "injustice", "system"],
      choices: [
        { id: "c36_branch_annex_a", label: "못 자국 열한 개의 주인이 누구였는지 석문호에게 묻는다", effect: { trust: 11, legitimacy: 5, capital: -5, time: -6, fatigue: 4 }, next: "c36_branch_annex_follow", cognition: { persistence: 2 } },
        { id: "c36_branch_annex_b", label: "액자마다 찍힌 날짜를 그룹 사건 연표와 맞춰 적는다", effect: { legitimacy: 10, trust: 1, time: -6, humanCost: 3, fatigue: 4 }, next: "c36_branch_annex_follow", cognition: { inference: 2 } },
        { id: "c36_branch_annex_c", label: "남의 집 벽이라며 사진은 두고 시원한 데서 쉰다", effect: { capital: 6, time: 4, trust: 2, humanCost: 3, legitimacy: -3, fatigue: -4 }, next: "c36_branch_annex_follow", cognition: { risk: 1 } },
      ],
    },
    c36_branch_annex_follow: {
      phase: "SIDE DOOR",
      title: "12년 전의 액자",
      speaker: "석문호",
      text: "복도 끝 액자 하나가 유난히 새것입니다. 12년 전 날짜, 사다리 위의 회장, 그리고 그 사다리를 붙잡고 올려다보는 30대 남자. 윤상혁입니다. 오늘 당신이 선 자리와 똑같은 자리입니다. 석문호가 액자 모서리의 먼지를 닦습니다. '저 양반은 이 사진 찍고 석 달 뒤에 상무가 됐어요. 그런데 요새 비서실에서 이 액자 뗄 못 뽑개를 찾더라고.' 그가 당신 손을 봅니다. 아까 사다리를 잡았던 손입니다. '다음 액자 자리는 벌써 비워 뒀어요. 저기, 불 켜진 데요.'",
      memo: ["윤상혁 액자 -- 12년 전, 사다리를 잡은 모습", "촬영 석 달 뒤 상무 승진", "비서실이 못 뽑개를 찾는 중", "새 액자 자리 하나 -- 조명 설치 완료"],
      triggers: ["selfAwareness", "manipulation", "fear"],
      choices: [
        { id: "c36_branch_annex_follow_a", label: "석문호가 다치지 않게 오늘 들은 말은 묻어 두겠다고 약속한다", effect: { trust: 12, humanCost: -4, capital: -6, time: -4, fatigue: 5 }, next: "c36_phone", cognition: { reframing: 2 } },
        { id: "c36_branch_annex_follow_b", label: "액자의 날짜와 윤상혁의 승진 기록을 증거 목록에 올린다", effect: { legitimacy: 11, trust: 3, time: -5, humanCost: 2, fatigue: 5 }, next: "c36_phone", cognition: { inference: 2 } },
        { id: "c36_branch_annex_follow_c", label: "비워 둔 자리를 보고도 모른 척 식탁으로 향한다", effect: { time: 5, capital: 5, trust: -2, humanCost: 4, fatigue: -3 }, next: "c36_phone", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c36_start",
    result: "c36_aftershock",
    defaultFree: "c36_route_system",
    // One evening, one house. Like the cases before it the chapter is a single
    // line; the split is whose name ends up paying for the chain.
    choices: {},
    system: {
      route: "c36_route_system",
      final: "c36_final_system_route",
      title: "이름 하나의 통계",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 KD캐피탈 단말의 노아가 지난 20년 KD금융그룹의 큰 사고 34건을 엽니다. 그중 29건이 임원 한 명의 사임과 '쇄신 완료' 발표로 끝났습니다. 발표 뒤 3년 안에 같은 모양의 사고가 다시 난 경우가 21건이었습니다. 사임한 29명의 결정 문서 가운데 회장의 이름이 적힌 문서는 한 건도 없었습니다. 노아가 한 줄을 덧붙입니다. '이름 하나는 사고를 닫는 가장 싼 서식으로 학습되어 있습니다. 저는 같은 서식으로 대출을 거절하도록 배웠습니다.'",
      memo: ["큰 사고 34건 중 임원 1명 사임으로 끝난 29건", "3년 안에 같은 모양으로 재발 21건", "회장 이름이 적힌 결정 문서 0건"],
      routeChoices: [
        ["c36_route_system_publish", "통계를 이사회 전에 전 직원과 금감원에 공개한다", { legitimacy: 12, trust: 4, capital: -4, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c36_route_system_names", "사임한 29명을 찾아 누구 대신 떠났는지 묻는다", { trust: 11, legitimacy: 3, humanCost: -4, capital: -3, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["c36_route_system_drop", "통계는 덮고 식탁에서 나온 조건만 챙긴다", { time: 7, capital: 8, trust: -6, legitimacy: -7, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "결정 문서마다 실제로 정한 사람의 이름을 적게 한다", { legitimacy: 12, trust: 7, capital: -8, humanCost: -4, fatigue: 6 }, { reframing: 3 }],
      ["b", "규칙은 두고 윤상혁 한 사람으로 이번 일을 닫는다", { capital: 10, time: 6, trust: -5, legitimacy: -8, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "사임한 임원들의 증언을 모아 결정 구조를 공개한다", { legitimacy: 9, trust: 9, capital: -6, time: -8, humanCost: 2, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c36_evidence_turn",
    result: "c36_aftershock",
    sourceRoutes: ["c36_garden", "c36_table", "c36_father", "c36_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 준법감시인 임명안 옆에 놓고, 이 자리에 앉았던 사람들이 무엇을 확인했는지 맞춰 본다.",
    entryEcho: "단서를 대면 의자 하나가 세 번 비었다가 세 번 같은 모양으로 채워진 기록이 보입니다.",
    title: "네 번째 의자",
    speaker: "반재욱",
    text: "단서를 맞추자 그룹 인사 기록의 한 줄이 이어집니다. 지난 12년 KD금융그룹 준법감시인(회사가 법과 규정을 지키는지 안에서 감시하는 책임자)은 세 명이었습니다. 세 명 모두 큰 사고가 터지고 2주 안에 임명됐고, 임명 직전 한남동 식탁에 초대됐습니다. 세 사람이 쓴 첫 보고서의 결론은 한 글자도 다르지 않았습니다. '추가 조사 필요 없음.' 그리고 셋 다 18개월 안에 계열사(같은 그룹에 속한 다른 회사) 고문으로 옮겼습니다. 반재욱이 수첩을 덮습니다. '감시하는 자리가 아니에요. 잘린 꼬리가 다시 안 자라는지 확인 도장 찍는 자리예요. 당신이 네 번째 의자고요.'",
    memo: ["준법감시인 3명 -- 모두 사고 2주 안에 임명", "첫 보고서 결론: '추가 조사 필요 없음'", "세 명 모두 18개월 안에 계열사 고문으로"],
    triggers: ["injustice", "system", "manipulation"],
    entryEffect: { legitimacy: 5, trust: 5, time: -2, capital: -2, fatigue: 3 },
    choices: [
      ["c36_evidence_turn_visit", "전임 준법감시인 세 명을 찾아가 무엇을 확인했는지 묻는다", { trust: 12, legitimacy: 6, capital: -6, time: -6, humanCost: -4, fatigue: 7 }, { persistence: 2, reframing: 1 }],
      ["c36_evidence_turn_file", "세 번의 임명 기록을 금감원 한지우 검사역에게 공식 제출한다", { legitimacy: 13, trust: 5, capital: -7, time: -6, fatigue: 5 }, { inference: 2 }],
      ["c36_evidence_turn_hold", "기록은 쥐고 있다가 다음 주 이사회 직전에 꺼낸다", { capital: 9, time: 5, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c36_branch_annex",
    systemNext: "c36_route_system",
    evidenceNext: "c36_evidence_turn",
    routeLabel: "직전 사건의 수해 복구 명단에서 식탁에 가져갈 이름을 고른다",
    systemLabel: "직전 자유응답 문장이 쇄신 발표문 초안에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 준법감시인 임명 기록을 연다",
  },
  openingRoutes: {
    c35_after_warm: "c36_start_warm",
    c35_after_record: "c36_start_record",
    c35_after_rush: "c36_start_rush",
  },
  openingCopy: {
    c36_start_warm: ["떡판이 빈 다음 날의 초대장", "문가을", "비 갠 망원시장에서 당신은 떡 한 판이 다 빌 때까지 시장 사람들 곁에 남았습니다. 설거지까지 끝낸 밤, 휴대폰에는 회장 비서실의 문자가 와 있었습니다. 다음 날인 7월 20일 월요일, 문가을이 남은 떡을 싸 들고 KD캐피탈 로비까지 찾아옵니다. '물 퍼 준 값이에요. 계산하지 마요.' 떡 보자기 위에 경비실에서 올라온 크림색 카드가 얹혀 있습니다. '일요일 19시, 한남동. 밥이나 한 끼 하지. 서도경.' KD금융그룹 회장입니다. 같은 날 윤상혁은 해온파트너스 자문료(조언값이라며 내보낸 돈) 배임(회사에 손해를 끼친 죄) 혐의로 두 번째 소환을 받습니다. 문가을이 카드를 흘끗 봅니다. '회장님 집 밥은 배가 안 부를 텐데. 떡 싸 갈래요?'", ["한남동 초대: 7월 26일 일요일 19시","문가을의 떡 보자기 -- 복구 인사","윤상혁 두 번째 검찰 소환"]],
    c36_start_record: ["개정안을 먼저 읽은 사람", "이민서", "비가 그친 날 밤, 당신은 수해 긴급대출 거절 38건을 재해 대출 기준 개정안으로 묶어 그룹 준법감시팀에 접수했습니다. 답은 오지 않았습니다. 대신 다음 날인 7월 20일 월요일 아침, 크림색 카드가 옵니다. '일요일 19시, 한남동. 자네 개정안 잘 읽었네. 밥이나 한 끼 하지. 서도경.' KD금융그룹 회장입니다. 같은 날 윤상혁은 해온파트너스 자문료(조언값이라며 내보낸 돈) 배임(회사에 손해를 끼친 죄) 혐의로 두 번째 소환을 받습니다. 이민서가 KD데이터랩에서 전화합니다. '개정안 열람 기록 봤어요. 준법감시팀은 한 번도 안 열었고, 회장 비서실이 밤새 네 번 열었어요.'", ["재해 대출 기준 개정안 -- 거절 38건","열람: 준법감시팀 0회, 회장 비서실 4회","한남동 초대: 7월 26일 일요일 19시"]],
    c36_start_rush: ["닫힌 대문 앞에 먼저 간 사람", "반재욱", "회장 비서실의 문자에 당신은 곧장 답하고, 떡판을 두고 그 밤 한남동으로 갔습니다. 대문은 열리지 않았습니다. 인터폰 너머에서 비서실장 여민규가 공손하게 말했습니다. '회장님은 정하신 날에만 사람을 만나십니다.' 다음 날인 7월 20일 월요일 아침, 책상에 크림색 카드가 와 있습니다. '일요일 19시, 한남동. 빨리 오는 사람은 늘 반갑네. 그래도 밥은 정한 날 먹지. 서도경.' 같은 날 윤상혁은 해온파트너스 자문료(조언값이라며 내보낸 돈) 배임(회사에 손해를 끼친 죄) 혐의로 두 번째 소환을 받습니다. 반재욱이 카드 뒷면을 짚습니다. '당신이 대문 앞에서 돌아선 그 밤에 쓴 카드예요. 기다리게 하는 것까지 정해 뒀다는 거죠.'", ["한남동 대문 앞 -- 인터폰 1분, 문 열리지 않음","카드 작성: 당신이 돌아선 그 밤","한남동 초대: 7월 26일 일요일 19시"]],
  },
  openingSignatures: {
    c36_start_warm: {
      label: "문가을의 떡을 싸 들고 한남동에 가겠다고 단체방에 알린다",
      effect: { trust: 10, humanCost: -5, capital: -3, time: -6, fatigue: 2 },
      cognition: { reframing: 2 },
      voice: "문가을의 떡을 싸 들고, 한남동에 가겠다고 단체방에 알린다.",
      echo: "알리면 단체방이 떡 이야기로 도배됩니다. 권도현이 '회장님 댁에 떡을 가져가는 건 선물입니까, 시위입니까'라고 묻습니다.",
    },
    c36_start_record: {
      label: "비서실이 네 번 열어 본 개정안을 준법감시팀에 되묻는다",
      effect: { legitimacy: 11, trust: -1, capital: -4, time: -4, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "비서실이 네 번 열어 본 개정안을, 준법감시팀에 되묻는다.",
      echo: "되물으면 준법감시팀은 이틀 뒤 '해당 개정안은 검토 예정'이라고 답합니다. 답장 참조란에 회장 비서실이 들어가 있습니다.",
    },
    c36_start_rush: {
      label: "한남동 대문 앞에 혼자 다녀온 일을 동료들에게 먼저 알린다",
      effect: { trust: 9, legitimacy: 6, humanCost: 2, time: -6, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "한남동 대문 앞에 혼자 다녀온 일을, 동료들에게 먼저 알린다.",
      echo: "알리면 오진우가 '문도 안 열어 줬는데 왜 먼저 갔어요'라고 묻습니다. 대답을 듣고 나서야 그가 일요일에 트럭을 태워 줄 사람을 찾기 시작합니다.",
    },
  },
  voiceLines: {
    // CASE 36. A dinner in a house that decides without signing. Every line is
    // said across a table to a man who remembers everything, so none of them
    // is allowed to sound like a speech he could quote back.
    c36_start_share: "혼자 정하지 않겠다며, 초대장을 여섯 명의 단체방에 올리고 같이 정한다.",
    c36_start_log: "초대받은 사실부터, 참고인 진술 기록에 먼저 남긴다.",
    c36_start_alone: "누구에게도 말하지 않고, 일요일에 혼자 간다.",
    c36_garden_flood: "사다리를 잡은 채, 수해 긴급대출 거절부터 따진다.",
    c36_garden_record: "참고인 신분이라, 오늘 대화를 기록하겠다고 먼저 밝힌다.",
    c36_garden_ladder: "말없이 사다리를 잡아 주며, 회장의 이야기를 듣는다.",
    c36_branch_annex_a: "못 자국 열한 개의 주인이 누구였는지, 석문호에게 묻는다.",
    c36_branch_annex_b: "액자마다 찍힌 날짜를, 그룹 사건 연표와 맞춰 적는다.",
    c36_branch_annex_c: "남의 집 벽이라며, 사진은 두고 시원한 데서 쉰다.",
    c36_branch_annex_follow_a: "석문호가 다치지 않게, 오늘 들은 말은 묻어 두겠다고 약속한다.",
    c36_branch_annex_follow_b: "액자의 날짜와 윤상혁의 승진 기록을, 증거 목록에 올린다.",
    c36_branch_annex_follow_c: "비워 둔 자리를 보고도, 모른 척 식탁으로 향한다.",
    c36_table_victims: "윤상혁 한 명이 아니라, 피해자 1,740명 이야기부터 꺼낸다.",
    c36_table_terms: "준법감시인의 권한과 임기를, 문서로 먼저 보여 달라고 한다.",
    c36_table_listen: "여섯 번째 접시 이름을 따라 외우며, 제안을 끝까지 듣는다.",
    c36_father_stay: "아버지 이야기를 끝까지 듣고, 그 줄에 섰던 사람들을 묻는다.",
    c36_father_sign: "이번에는 회장님 이름으로 결정하시라고, 서명을 요구한다.",
    c36_father_raise: "흔들린 틈을 타, 동료들의 복직을 조건에 더 얹는다.",
    c36_final_refuse: "자리를 거절하고, 동료·피해자들과 조사를 끝까지 간다.",
    c36_final_audit: "자리를 받되, 첫 감사 대상을 이 식탁으로 정한다.",
    c36_final_take: "자리를 받고, 배상 2차를 월요일 발표문에 넣게 한다.",
    c36_after_warm: "트럭을 돌려, 헌책방 1층의 동료들 곁으로 먼저 간다.",
    c36_after_record: "식탁의 제안을 문장 그대로 적어, 한지우와 나은호에게 보낸다.",
    c36_after_rush: "그 길로 사무실에 가서, 꼬리 자르기에 쓰일 서류부터 복사한다.",
    c36_route_system_publish: "통계를 이사회 전에, 전 직원과 금감원에 공개한다.",
    c36_route_system_names: "사임한 29명을 찾아, 누구 대신 떠났는지 묻는다.",
    c36_route_system_drop: "통계는 덮고, 식탁에서 나온 조건만 챙긴다.",
    c36_final_system_route_a: "결정 문서마다, 실제로 정한 사람의 이름을 적게 한다.",
    c36_final_system_route_b: "규칙은 두고, 윤상혁 한 사람으로 이번 일을 닫는다.",
    c36_final_system_route_c: "사임한 임원들의 증언을 모아, 결정 구조를 공개한다.",
    c36_evidence_turn_visit: "전임 준법감시인 세 명을 찾아가, 무엇을 확인했는지 묻는다.",
    c36_evidence_turn_file: "세 번의 임명 기록을, 금감원 한지우 검사역에게 공식 제출한다.",
    c36_evidence_turn_hold: "기록은 쥐고 있다가, 다음 주 이사회 직전에 꺼낸다.",
  },
  echoReplies: {
    // CASE 36.
    c36_start_share: "단체방에 올리면 여섯 명이 한꺼번에 답합니다. 가지 말라는 말이 셋, 가서 보고 오라는 말이 셋입니다. 결정은 여전히 당신 몫입니다.",
    c36_start_log: "기록에 남기면 초대는 수사 기록의 한 줄이 됩니다. 나은호 검사가 '밥은 드시고 오세요'라는 답을 보냅니다.",
    c36_start_alone: "혼자 가면 일요일까지 엿새 동안 조용합니다. 한서윤만 '돌아오면 연락해요' 한 줄을 남깁니다.",
    c36_garden_flood: "따지면 회장의 가위가 잠깐 멈춥니다. 그리고 그는 거절 건수를 당신보다 정확히 말합니다. 이미 알고 있던 숫자입니다.",
    c36_garden_record: "밝히면 회장이 웃습니다. '기록하게. 나는 기록에 남는 말을 한 적이 없네.' 그 말부터 기록됩니다.",
    c36_garden_ladder: "사다리를 잡으면 회장은 가지 하나를 더 칩니다. 12년 전에도 누군가 이 자리에서 같은 사다리를 잡았습니다.",
    c36_branch_annex_a: "물으면 석문호가 이름 열한 개를 기억에서 꺼냅니다. 그중 여섯은 신문에서 '책임지고 물러난' 사람들입니다.",
    c36_branch_annex_b: "맞춰 적으면 액자가 떼어진 날마다 그룹의 큰 사고가 하나씩 겹칩니다. 날짜는 거짓말을 하지 않습니다.",
    c36_branch_annex_c: "쉬는 동안 에어컨 바람이 땀을 식힙니다. 못 자국 열한 개는 당신이 보지 않아도 그대로 벽에 있습니다.",
    c36_branch_annex_follow_a: "약속하면 석문호가 고개를 끄덕이고 호스를 다시 감습니다. 오늘 본 액자는 당신 기억 속에만 남습니다.",
    c36_branch_annex_follow_b: "목록에 오르면 사진 한 장이 승진의 날짜를 증명합니다. 석문호의 이름도 출처 칸에 함께 들어갈 수 있습니다.",
    c36_branch_annex_follow_c: "모른 척 지나가면 불 켜진 빈 자리가 등 뒤에 남습니다. 그 조명은 당신이 떠난 뒤에도 켜져 있습니다.",
    c36_table_victims: "1,740명을 꺼내면 회장이 그 숫자를 정확히 되풀이합니다. '1,740명. 그래서 이름 하나가 필요한 걸세.'",
    c36_table_terms: "문서를 요구하면 여민규가 준비된 서류철을 내밉니다. 권한은 넓고, 임기는 2년이고, 해임 조건 칸은 비어 있습니다.",
    c36_table_listen: "따라 외우면 셰프가 처음으로 웃습니다. 제안은 끝까지 들리고, 끝까지 들은 사람은 반쯤 대답한 사람이 됩니다.",
    c36_father_stay: "물으면 회장은 그 줄에 섰던 사람 셋의 이름을 댑니다. 45년이 지났는데 그 이름들은 하나도 흐려지지 않았습니다.",
    c36_father_sign: "요구하면 회장이 복숭아를 내려놓습니다. '그건 아버지가 한 일이네.' 대답은 거절이지만, 그 말은 처음으로 그의 입에서 나왔습니다.",
    c36_father_raise: "조건을 얹으면 회장은 곧바로 받아들입니다. 흔들렸던 목소리가 너무 빨리 돌아오고, 당신은 방금 무엇을 샀는지 모릅니다.",
    c36_final_refuse: "거절하면 회장은 화내지 않습니다. '다음 사람은 자네보다 빨리 앉겠지.' 이사회는 예정대로 열리고, 그 의자의 주인은 아직 없습니다.",
    c36_final_audit: "조건을 걸면 회장이 한참 당신을 봅니다. 그리고 여민규에게 임명안을 다시 쓰라고 합니다. 새 임명안에도 회장의 이름은 없습니다.",
    c36_final_take: "받으면 배상 2차는 월요일 발표문에 한 줄로 들어갑니다. 같은 발표문 세 번째 문단의 빈칸에는 당신 이름이 들어갑니다.",
    c36_after_warm: "헌책방 1층에 불이 켜져 있습니다. 문을 열자 여섯 명이 한꺼번에 '어떻게 됐어요'라고 묻고, 강태민은 트럭에서 떡 상자를 내립니다.",
    c36_after_record: "적어 보내면 금감원과 검찰에 같은 문장이 동시에 도착합니다. 요리 이름은 하나도 적지 못했지만, 회장이 한 말은 한 문장도 빠지지 않았습니다.",
    c36_after_rush: "곧장 가면 여의도 사무실에 불이 켜진 자리는 당신 하나입니다. 복사기가 도는 동안 이름 없는 계정은 폴더를 한 번 더 엽니다.",
    c36_route_system_publish: "공개하면 이사회 전날 밤 직원 게시판에 댓글이 쌓입니다. '우리 부서 상무도 그렇게 나갔어요.'",
    c36_route_system_names: "찾아가면 29명 중 열한 명이 전화를 받습니다. 세 명은 '누구 대신인지 이제야 말할 수 있겠네요'라고 합니다.",
    c36_route_system_drop: "덮으면 식탁의 조건은 깔끔해집니다. 서른 번째 '쇄신 완료'가 조용히 준비됩니다.",
    c36_final_system_route_a: "규칙이 생기면 다음 결정 문서에는 이름이 적힙니다. 이번 발표문에는 끝내 회장의 이름이 없습니다.",
    c36_final_system_route_b: "이번 일은 한 사람으로 닫힙니다. 노아의 통계에 서른 번째 줄이 더해집니다.",
    c36_final_system_route_c: "증언이 모이면 사임한 임원들이 서로의 이름을 처음 봅니다. 그 증언을 들어 줄 자리는 아직 정해지지 않았습니다.",
    c36_evidence_turn_visit: "찾아가면 세 명 중 한 명만 문을 엽니다. 그는 '나는 확인 도장을 찍었지, 확인은 안 했소'라고 말합니다.",
    c36_evidence_turn_file: "제출하면 한지우가 숫자부터 확인합니다. 2주, 18개월, 세 명. 그는 '규정 위반은 아닙니다. 그래서 더 문제입니다'라고 답합니다.",
    c36_evidence_turn_hold: "쥐고 있으면 이사회 날 아침 강한 패가 됩니다. 그 사이 월요일 발표문은 인쇄소로 넘어갑니다.",
  },
  characterProfiles: {
    서도경: {
      role: "KD금융그룹 회장",
      stance: "기억 · 배치 · 무서명",
      job: "사건을 이름 하나로 닫는다. 결정은 늘 남의 이름으로 내려보낸다.",
      appearance: "밀짚모자와 전지가위, 소매 끝이 닳은 흰 셔츠, 한 번도 펜이 꽂힌 적 없는 가슴 주머니.",
      thought: "이름을 쓴 사람이 다 치른다. 아버지가 그랬다. 그러니 회사는 이름 없이 굴러가야 한다.",
      gesture: "서도경은 대답 대신 상대가 지난번에 한 말을 정확히 되풀이한다. 기억이 그의 협상이다.",
      voice: "말수가 적고 낮다. 명령을 권유처럼 말하고, 문장 끝에 늘 '~하지'를 붙인다.",
      line: "회사는 사람이 아니라 기억으로 굴러가네.",
    },
    여민규: {
      role: "KD금융그룹 회장 비서실장",
      stance: "문장 · 형식 · 침묵",
      job: "회장 이름으로 나가는 모든 문장을 쓴다. 자기 이름은 어디에도 남기지 않는다.",
      appearance: "주름 하나 없는 회색 정장, 뚜껑을 열어 건네는 만년필, 20년째 같은 메뉴 카드 보관함.",
      thought: "나는 쓰기만 했다. 정한 사람은 따로 있다. 그 말을 20년째 스스로에게 하고 있다.",
      gesture: "여민규는 곤란한 말을 하기 전에 물컵을 정확히 한가운데 내려놓는다.",
      voice: "공손하고 정확하다. 문장마다 주어를 빼고 말한다.",
      line: "회장님 이름으로 나가는 문장은 전부 제가 씁니다.",
    },
  },
  setting: { place: "KD캐피탈 위험관리부", clock: "한남동 식사까지 D-6 · 월요일" },
  sceneContext: {
    c36_start: {
      place: "KD캐피탈 위험관리부 · 당신의 자리",
      clock: "한남동 식사까지 D-6 · 7월 20일 월요일",
      question: "회장이 남의 글씨로 저녁 초대장을 보냈습니다. 누구와, 어떻게 이 초대를 받겠습니까?",
      lead: "압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사) 뒤로 불이 꺼진 윤상혁의 대표실을 지나 자리로 오니, 키보드 위에 크림색 카드가 먼저 와 있습니다.",
    },
    c36_start_warm: {
      place: "KD캐피탈 1층 로비",
      clock: "한남동 식사까지 D-6 · 7월 20일 월요일",
      question: "복구 인사로 온 떡 보자기 위에 회장의 초대장이 얹혀 있습니다. 이 초대에 누구와 함께 답하겠습니까?",
      lead: "떡판이 빈 다음 날 아침, 망원시장의 떡 냄새가 로비 경비실까지 먼저 올라옵니다.",
    },
    c36_start_record: {
      place: "KD캐피탈 위험관리부 · 당신의 자리",
      clock: "한남동 식사까지 D-6 · 7월 20일 월요일",
      question: "준법감시팀보다 회장 비서실이 당신의 개정안을 먼저 읽었습니다. 그 순서를 어떻게 따지겠습니까?",
      lead: "재해 대출 기준 개정안을 낸 다음 날 아침, 답장 대신 두꺼운 카드 한 장이 책상에 왔습니다.",
    },
    c36_start_rush: {
      place: "KD캐피탈 위험관리부 · 당신의 자리",
      clock: "한남동 식사까지 D-6 · 7월 20일 월요일",
      question: "먼저 찾아간 대문은 열리지 않았고, 그 밤에 쓴 초대장이 왔습니다. 이 걸음을 누구에게 먼저 말하겠습니까?",
      lead: "한남동 대문 앞에서 돌아선 다음 날 아침, 책상 위의 카드가 당신의 발걸음을 알고 있습니다.",
    },
    c36_garden: {
      place: "한남동 서도경 회장 자택 · 정원 감나무 아래",
      clock: "일요일 18시 30분 · 폭염",
      question: "회장이 사다리를 잡아 달라며 망원시장 수해 이야기를 먼저 꺼냅니다. 어떻게 첫마디를 하겠습니까?",
      lead: "강태민의 트럭이 대문 앞에서 멈추고, 돌길 끝에서 가위질 소리가 들립니다.",
    },
    c36_branch_annex: {
      place: "한남동 회장 자택 · 별채 복도",
      clock: "일요일 18시 45분 · 폭염",
      question: "감나무 아래서 찍은 액자 사이에 못 자국 열한 개가 있습니다. 이 벽을 어떻게 읽겠습니까?",
    },
    c36_branch_annex_follow: {
      place: "한남동 회장 자택 · 별채 복도 끝",
      clock: "일요일 18시 50분",
      question: "12년 전 같은 사다리를 잡은 윤상혁의 액자와 비워 둔 새 자리가 있습니다. 어떻게 하겠습니까?",
    },
    c36_phone: {
      place: "한남동 회장 자택 · 현관 복도",
      clock: "일요일 19시",
      question: "수사기관에도 알리지 않겠다는 서약서와 펜이 건네집니다. 어떻게 하겠습니까?",
    },
    c36_phone_reaction: {
      place: "한남동 회장 자택 · 현관 복도",
      clock: "일요일 19시 02분",
      question: "윤서진이 아버지 혼자 벌받는 건 싫다고, 그게 이상하냐고 묻습니다. 무엇이라 답하겠습니까?",
    },
    c36_table: {
      place: "한남동 회장 자택 · 열두 자리 식탁",
      clock: "일요일 19시 40분",
      question: "윤상혁 한 사람에게 모든 책임을 지우고 그 선언을 확인하는 자리를 주겠다고 합니다. 어떻게 답하겠습니까?",
      lead: "휴대폰 없는 식탁에 두 자리만 차려져 있고, 셰프가 첫 접시의 이름을 숨도 안 쉬고 읊습니다.",
    },
    c36_draft: {
      place: "한남동 회장 자택 · 비서실 대기실",
      clock: "일요일 20시 50분",
      question: "쇄신 발표문 세 번째 문단에 당신 이름이 들어갈 칸이 비어 있습니다. 어떻게 하겠습니까?",
    },
    c36_draft_reaction: {
      place: "한남동 회장 자택 · 주방",
      clock: "일요일 21시",
      question: "셰프의 어머니 반찬가게 긴급대출이 0.6초 만에 거절됐습니다. 어떻게 하겠습니까?",
    },
    c36_father: {
      place: "한남동 회장 자택 · 정원 벤치",
      clock: "일요일 21시 20분",
      question: "보증서에 이름 한 줄을 쓴 아버지 이야기 끝에 회장이 다시 이름 하나를 요구합니다. 어떻게 하겠습니까?",
      lead: "복숭아 접시를 든 회장이 식탁을 두고 감나무 아래 벤치로 먼저 나갑니다.",
    },
    c36_gate: {
      place: "한남동 회장 자택 대문 앞 · 골목",
      clock: "일요일 21시 50분",
      question: "대문 밖 10분 동안 단체방 메시지 186개가 쌓였습니다. 동료들의 말을 어떻게 듣겠습니까?",
    },
    c36_gate_reaction: {
      place: "한남동 골목 · 강태민의 트럭 옆",
      clock: "일요일 21시 56분",
      question: "윤상혁이 전화로 받으라고, 딸에게는 말하지 말라고 합니다. 어떻게 답하겠습니까?",
    },
    c36_route_system: {
      place: "KD캐피탈 위험관리부 · 노아 단말",
      clock: "한남동 식사까지 D-5",
      question: "그룹 사고 29건이 임원 한 명의 사임으로 닫혔고 21건이 다시 났습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c36_final_system_route: {
      place: "KD캐피탈 위험관리부 · 노아 단말",
      clock: "식사 당일 · 새벽",
      question: "사고를 이름 하나로 닫는 서식을 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c36_evidence_turn: {
      place: "KD금융그룹 본사 · 인사 자료실",
      clock: "일요일 22시 30분",
      question: "앞선 준법감시인 세 명이 모두 같은 결론을 쓰고 떠났습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c36_final: {
      place: "한남동 회장 자택 · 열두 자리 식탁",
      clock: "일요일 22시 · 이사회까지 여드레",
      question: "회장 이름이 없는 임명안과 윤상혁 단독 책임 발표문이 놓였습니다. 어떻게 하겠습니까?",
      lead: "대문 안으로 돌아오니 접시가 모두 치워지고, 식탁 위에 종이 두 장과 펜 하나만 남아 있습니다.",
    },
    c36_aftershock: {
      place: "한남동 골목 · 강태민의 트럭 안",
      clock: "일요일 23:12",
      question: "돌아가는 트럭 안에서 이름 없는 계정이 트리거랩 기록을 열었다는 연락이 옵니다. 이 밤을 어디서 닫겠습니까?",
    },
  },
  clue: {
    id: "c36-fourth-chair",
    title: "네 번째 의자",
    text: "지난 12년 준법감시인 세 명은 모두 큰 사고 2주 안에 한남동 식탁을 거쳐 임명됐고, 첫 보고서에 '추가 조사 필요 없음'을 쓴 뒤 18개월 안에 계열사 고문으로 옮겼습니다.",
  },
  outcomes: {
    c36_after_warm: { tag: "동료에게 돌아간 결말", title: "트럭을 돌려 헌책방 1층으로 갔다", text: "한남동에서 돌아오는 길, 당신은 이사회보다 동료들에게 먼저 식탁 이야기를 했습니다. 문가을의 떡이 여섯 조각으로 나뉘었습니다." },
    c36_after_record: { tag: "문장으로 남긴 결말", title: "회장의 제안을 한 줄도 빼지 않고 적어 보냈다", text: "서명하지 않는 사람의 말이 처음으로 금감원과 검찰의 기록에 남았습니다. 요리 이름만 하나도 적지 못했습니다." },
    c36_after_rush: { tag: "곧장 움직인 결말", title: "트럭에서 내려 곧장 사무실 복사기 앞에 섰다", text: "식탁의 대답을 정리할 틈 없이 당신은 꼬리 자르기에 쓰일 서류부터 모았습니다. 강태민은 떡 상자를 조수석에 둔 채 야간조로 갔습니다." },
  },
  carryovers: {
    c36_after_warm: { trust: 10, humanCost: -4, fatigue: -8 },
    c36_after_record: { legitimacy: 12, trust: 3, fatigue: 4 },
    c36_after_rush: { capital: 7, legitimacy: 4, trust: -8 },
  },
  continuityChallenges: {
    c35_after_warm: { id: "protect-trust", title: "떡판을 같이 비운 사람들과 식탁까지 가기", text: "떡판이 빌 때까지 함께한 시장 사람들이 남은 떡을 싸 들고 왔습니다. 회장의 식탁 앞에 혼자가 아니라 그 사람들과 함께 서는 선택을 찾아야 보너스가 열립니다." },
    c35_after_record: { id: "use-reframe", title: "회장이 먼저 읽은 개정안 되찾기", text: "재해 대출 기준 개정안을 준법감시팀보다 회장 비서실이 먼저 읽었습니다. 그 개정안이 누구의 손에 있어야 하는지 판을 다시 짜야 합니다." },
    c35_after_rush: { id: "repair-legitimacy", title: "먼저 달려간 걸음의 공정함 회복하기", text: "떡판을 두고 먼저 달려간 한남동의 대문은 열리지 않았습니다. 식탁에 가기 전에 동료들에게 그 걸음을 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
