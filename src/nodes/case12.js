/**
 * CASE 12 -- the authored scenes of the people the loan landed on.
 *
 * Eleven cases are told from inside institutions: the lab, the bank, a client,
 * a regulator's hearing. The 1,740 people the loan hurt have been a number the
 * whole season -- counted by 도윤하, cited in a hearing, split into a relay
 * table -- and never once a room the analyst walks into.
 *
 * Two weeks after the 국정감사 the group announces a voluntary compensation
 * fund of 300억, on one condition: whoever takes it signs away the right to sue
 * again. The case goes to the people the fund is for. 문가을 runs a rice-cake
 * shop in 망원시장 and leads the victims' group; her husband ran 가온정밀, a
 * supplier that went under with 플로우온, and died the year after. She does not
 * thank the analyst for the dissent. She asks why a person who saw it coming
 * did not stop it.
 *
 * The emotional range is the widest in the season on purpose: the anger of a
 * room of victims, the comedy of a 추석 rush at a rice-cake shop where the whole
 * team is drafted onto the steamers, the grief of an anniversary at a columbarium
 * and a letter addressed to "the reviewer who wrote the dissent", and the plain
 * joy of the first payment landing. The case closes on whose names the
 * compensation standard includes -- the 212 from 사건 10 come due again -- and
 * the 33rd floor is waiting after it.
 */
export const case12Nodes = {
  c12_start: {
    phase: "CASE 12 BRIEFING",
    title: "300억의 조건",
    speaker: "도윤하",
    text:
      "국정감사가 끝나고 2주 뒤, KD금융그룹이 '자율 배상안'을 발표합니다. 배상에 쓸 돈은 300억, 대상은 2023-0412 대출로 피해를 본 사람들입니다. 조건이 하나 붙어 있습니다. 배상금을 받는 사람은 부제소 합의(앞으로 이 일로 소송하지 않겠다는 약속)에 서명해야 합니다. 도윤하가 공지문을 출력해 들고 옵니다. '피해자 모임 대표가 당신을 만나고 싶대요. 망원시장에서 떡집을 하시는 분이에요.' 그가 잠깐 망설입니다. '고맙다는 말 들으러 가는 자리는 아닐 거예요.'",
    memo: [
      "자율 배상안 총액 300억 -- 1인당 평균 1,700만 원",
      "수령 조건: 부제소 합의서 서명",
      "피해자 모임 등록 1,021명, 대표 문가을",
      "금융감독원 분쟁조정 신청 마감까지 10일",
    ],
    triggers: ["injustice", "responsibility", "affection"],
    choices: [
      {
        id: "c12_start_visit",
        label: "피해자 모임 대표부터 직접 찾아간다",
        effect: { trust: 12, humanCost: -5, time: -6, capital: -3, fatigue: 5 },
        next: "c12_mediation",
        cognition: { persistence: 2 },
      },
      {
        id: "c12_start_clause",
        label: "합의서의 부제소 조항부터 한 줄씩 읽는다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c12_mediation",
        cognition: { inference: 2 },
      },
      {
        id: "c12_start_fast",
        label: "일단 빨리 받게 하는 것이 먼저라며 접수를 돕는다",
        effect: { capital: 9, time: 6, legitimacy: -7, trust: -4, humanCost: 3, fatigue: 1 },
        next: "c12_mediation",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c12_mediation",
      },
    ],
  },
  c12_mediation: {
    phase: "PUBLIC PRESSURE",
    title: "왜 안 막았어요",
    speaker: "문가을",
    text:
      "여의도 금융감독원 분쟁조정(금융회사와 고객 사이의 다툼을 법원 대신 중재하는 절차) 설명회. 접이식 의자 200개가 모자라 뒤에 선 사람이 더 많습니다. 당신이 소개되자 박수 대신 웅성거림이 번집니다. 맨 앞줄에서 앞치마를 두른 채 온 문가을이 일어섭니다. '반대 의견 쓰셨다면서요. 기사 봤어요. 그럼 왜 안 막았어요? 쓰고 나서 지하로 내려가서, 3년 동안 뭐 하셨어요?' 마이크가 없는데도 목소리가 방 끝까지 갑니다. 누군가 '그만해요' 하고, 다른 누군가 '아니, 들어야죠' 합니다.",
    memo: [
      "설명회 참석 340명 -- 좌석 200석",
      "문가을: 남편은 협력사 가온정밀 대표, 부도 이듬해 사망",
      "참석자 다수가 자율 배상안 수령을 고민 중",
      "질문의 대상: 당신의 3년",
    ],
    triggers: ["injustice", "selfAwareness", "fear"],
    choices: [
      {
        id: "c12_mediation_own",
        label: "변명 없이 막지 못한 3년을 인정하고 사과한다",
        effect: { trust: 13, legitimacy: -3, humanCost: -5, time: -4, fatigue: 6 },
        next: "c12_market",
        cognition: { persistence: 2 },
      },
      {
        id: "c12_mediation_explain",
        label: "반대 의견이 어떻게 지워졌는지 기록으로 설명한다",
        effect: { legitimacy: 12, trust: -4, time: -6, humanCost: 3, fatigue: 4 },
        next: "c12_market",
        cognition: { inference: 2 },
      },
      {
        id: "c12_mediation_ask",
        label: "대답 대신 지금 무엇이 필요한지부터 묻는다",
        effect: { trust: 10, humanCost: -6, legitimacy: 4, capital: -5, time: -7, fatigue: 5 },
        next: "c12_market",
        cognition: { reframing: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c12_market",
      },
    ],
  },
  c12_market: {
    phase: "THE MARKET",
    title: "추석 대목",
    speaker: "강태민",
    text:
      "추석 사흘 전, 문가을이 설명회 다음 날 문자를 보냈습니다. '말로 하지 말고 와서 떡이나 쪄요.' 그래서 모두 왔습니다. 강태민은 야간조 근육으로 떡메를 치다가 문가을에게 '힘만 세다'는 평을 듣고, 나준혁은 30년 경력의 도장 솜씨로 송편 모양을 찍어 내 칭찬을 독차지합니다. 권도현은 계산대에서 1분마다 '이 가격이면 적자입니다'를 외치다 쫓겨나 떡을 포장하고, 오진우는 시장 할머니들에게 '은행 총각'으로 불리며 얼굴이 빨개집니다. 김이 가득 찬 가게에서 문가을이 처음으로 웃습니다. 그리고 떡을 썰다 말고 묻습니다. '배상 기준에 212명도 들어가요? 서류 없는 사람들요. 우리 모임에 그런 사람이 서른 명이 넘어요.'",
    memo: [
      "추석 대목 사흘 매출 -- 평소 한 달치",
      "피해자 모임 중 서류 없는 사람 31명",
      "자율 배상안 기준: 대출 서류가 있는 사람만",
      "212명 명단은 사건 10 이후 아직 어느 기준에도 없음",
    ],
    triggers: ["affection", "trust", "injustice"],
    choices: [
      {
        id: "c12_market_include",
        label: "212명을 배상 기준에 넣지 않으면 조정에 응하지 않겠다고 한다",
        effect: { trust: 12, legitimacy: 6, capital: -9, time: -7, fatigue: 5 },
        next: "c12_memorial",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c12_market_prove",
        label: "서류 없는 31명의 피해를 증명할 자료부터 함께 모은다",
        effect: { legitimacy: 11, trust: 7, time: -8, humanCost: -4, fatigue: 6 },
        next: "c12_memorial",
        cognition: { inference: 2 },
      },
      {
        id: "c12_market_split",
        label: "서류가 있는 사람부터 먼저 받게 하고 나머지는 따로 싸운다",
        effect: { capital: 8, time: 5, trust: -6, humanCost: 5, legitimacy: -3, fatigue: 2 },
        next: "c12_memorial",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c12_memorial",
      },
    ],
  },
  c12_memorial: {
    phase: "MEMORIAL",
    title: "1주기",
    speaker: "문가을",
    text:
      "가온정밀 문성호 대표의 1주기입니다. 문가을이 유리문 앞에 송편 세 개와 소주 한 잔을 놓습니다. 고등학교 2학년 아들 문하준이 교복 차림으로 뒤에 서 있다가 불쑥 말합니다. '저 은행원 될 거예요. 아빠 같은 사람한테 대출 안 해 주는 은행원이요. 아니, 해 주는데 제대로 해 주는 은행원이요.' 문가을이 웃다가 고개를 돌립니다. 그리고 가방에서 누렇게 바랜 봉투 하나를 꺼냅니다. 겉봉에는 남편의 글씨로 이렇게 적혀 있습니다. '반대 의견을 쓰신 심사역님께.'",
    memo: [
      "문성호: 가온정밀 대표, 플로우온 부도 이듬해 사망",
      "봉투 발견: 남편의 공장 서랍, 부치지 않음",
      "수신: '반대 의견을 쓰신 심사역님께'",
      "아들 문하준, 경영학과 진학 희망",
    ],
    triggers: ["affection", "helplessness", "selfAwareness"],
    choices: [
      {
        id: "c12_memorial_read",
        label: "그 자리에서 가족과 함께 편지를 읽는다",
        effect: { trust: 13, humanCost: -6, time: -4, legitimacy: -2, fatigue: 7 },
        next: "c12_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c12_memorial_keep",
        label: "편지는 조정이 끝난 뒤에 읽겠다며 받아서 간직한다",
        effect: { legitimacy: 8, time: 5, trust: -5, humanCost: 3, fatigue: 2 },
        next: "c12_final",
        cognition: { risk: 1, inference: 1 },
      },
      {
        id: "c12_memorial_son",
        label: "문하준에게 은행이 어떻게 판단하는지 직접 가르쳐 주겠다고 약속한다",
        effect: { trust: 11, humanCost: -4, capital: -5, time: -7, fatigue: 5 },
        next: "c12_final",
        cognition: { reframing: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c12_final",
      },
    ],
  },
  c12_final: {
    phase: "FINAL DECISION",
    title: "1,740번째 사람",
    speaker: "문가을",
    text:
      "분쟁조정위원회 마지막 회의. 그룹 측 변호사가 조정안을 내밉니다. 자율 배상안 그대로, 부제소 합의 포함, 서류 있는 1,528명만 대상입니다. 오늘 서명하면 추석이 지나기 전에 입금됩니다. 문가을이 당신 옆에서 조정안을 넘기다 한 줄에 손가락을 멈춥니다. '여기 빠진 사람들, 우리 모임에도 있어요. 떡 사러 오는 할머니도 있고요.' 그가 당신을 봅니다. '남편 편지에 그렇게 쓰여 있었어요. 반대해 줘서 고맙다고, 근데 다음엔 끝까지 해 달라고. 이번이 그 다음이에요.'",
    memo: [
      "조정안 대상 1,528명 -- 212명 제외",
      "부제소 합의 포함, 오늘 서명 시 추석 전 입금",
      "거부하면 집단소송(피해자 여럿이 함께 내는 소송)으로 2~3년 예상",
      "이 선택은 시즌 마지막 사건의 서명란으로 이어짐",
    ],
    triggers: ["choice", "injustice", "affection"],
    choices: [
      {
        id: "c12_final_accept",
        label: "추석 전 입금을 위해 조정안에 서명하게 돕는다",
        effect: { capital: 12, humanCost: -6, trust: 4, legitimacy: -9, time: 6, fatigue: 3 },
        next: "case12_result",
        cognition: { risk: 2 },
      },
      {
        id: "c12_final_amend",
        label: "212명을 넣고 부제소 조항을 빼야 서명한다고 버틴다",
        effect: { legitimacy: 13, trust: 9, capital: -10, time: -9, humanCost: 3, fatigue: 6 },
        next: "case12_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c12_final_both",
        label: "서류 있는 사람은 지금 받게 하고 212명은 집단소송으로 따로 간다",
        effect: { trust: 10, legitimacy: 7, capital: -6, time: -7, humanCost: -3, fatigue: 7 },
        next: "case12_result",
        cognition: { reframing: 3 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case12_result",
      },
    ],
  },
};

/**
 * Everything else case 12 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case12 = {
  id: "case12",
  nodes: case12Nodes,
  aftermath: {
    c12_aftershock: {
      phase: "AFTERMATH",
      title: "떡 돌리는 날",
      speaker: "문가을",
      text: "첫 배상금이 들어온 날, 가을떡방 앞에 줄이 섭니다. 문가을이 모임 사람들에게 떡을 한 상자씩 돌리고, 강태민은 상자를 나르고, 나준혁은 받는 사람마다 '추석 잘 쇠세요'를 서른 번째 반복합니다. 문하준이 교복 차림으로 와서 영수증을 한 장씩 정리하다가 권도현에게 '이거 왜 이렇게 적어요?'를 스무 번 묻습니다. 권도현은 스무 번 다 대답합니다. 해 질 무렵 문가을이 당신에게 마지막 상자를 내밉니다. '이건 남편 몫이에요. 당신이 대신 받아요.' 그때 휴대폰이 울립니다. 본사 33층 그룹전략실입니다. 윤상혁이, 이번에는 서명란 얘기를 하자고 합니다.",
      memo: ["첫 배상 입금 확인", "떡 상자 1,021개 -- 모임 전원", "문하준, 영수증 정리 자원봉사", "33층 호출: 이번에는 서명란에 대해"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c12_after_feast", label: "오늘은 떡집 셔터를 내릴 때까지 같이 떡을 돌린다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case12_result", cognition: { reframing: 2 } },
        { id: "c12_after_fund", label: "212명이 들어갈 배상 기준 개정안부터 문서로 남긴다", effect: { legitimacy: 15, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case12_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c12_after_meet", label: "마지막 상자를 들고 곧장 33층으로 간다", effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 }, next: "case12_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c12_final", "c12_aftershock"],
  connectiveScenes: [
    ["c12_line", "c12_mediation", "c12_market", "번호표 38번", "이민서", "설명회가 끝나고 분쟁조정 접수 창구 앞에 줄이 섭니다. 이민서가 자청해서 서류 작성을 돕습니다. 번호표 38번 할머니가 돋보기를 두고 왔다며 신청서를 내밉니다. 칸이 스물네 개입니다. 이민서가 한 칸씩 소리 내어 읽어 드리다가 '대출 약정 번호'(대출 계약서에 붙은 번호)에서 멈춥니다. 할머니는 그 번호를 받은 적이 없습니다. 아들 이름으로 받은 대출이었고, 아들은 연락이 끊겼습니다. 할머니가 웃으며 말합니다. '그럼 나는 피해자가 아닌가 봐요.'", ["접수 창구 대기 186명", "38번: 아들 명의 대출, 본인 서류 없음", "신청서 칸 24개 중 본인이 채울 수 있는 칸 9개"], ["서류 없는 사람도 낼 수 있는 진술서 양식을 따로 만든다", "할머니의 아들을 찾아 서류부터 받아 온다", "오늘은 서류 있는 사람부터 접수를 끝낸다"]],
    ["c12_rival", "c12_market", "c12_memorial", "떡값", "권도현", "밤 열 시, 가게 셔터를 반쯤 내린 뒤 권도현이 문가을의 장부를 봅니다. 허락은 받았습니다. 받았다고 그는 주장합니다. 그가 계산기를 두드리다 멈춥니다. '사장님, 매달 80만 원이 비는데요.' 문가을이 떡을 썰며 대답하지 않습니다. 장부 뒷장에 이름 스물세 개가 있습니다. 모임 사람들 중 가게 문을 닫은 사람들이고, 그 사람들 몫의 떡은 한 번도 계산된 적이 없습니다. 권도현이 한참 있다가 그 장에 세로줄을 긋습니다. '이건 적자가 아니라 지출로 적읍시다. 칸 이름은 제가 정할게요.'", ["매달 80만 원 공짜 떡", "장부 뒷장 이름 23개 -- 문 닫은 가게 사장들", "권도현: 칸 이름을 붙이면 비용이 된다"], ["그 칸에 '연대비'라는 이름을 붙여 모임 회비로 나눈다", "배상금이 나오면 그 80만 원부터 메우자고 한다", "사장님의 방식이니 장부에는 손대지 않는다"]],
    ["c12_letter", "c12_memorial", "c12_final", "부치지 못한 편지", "문가을", "봉안당 앞 벤치에서 편지를 엽니다. 날짜는 3년 전, 플로우온 대출이 실행된 다음 달입니다. '심사역님께. 거래 은행 창구에서 반대 의견이 한 건 있었다는 말을 들었습니다. 그게 누구인지는 모릅니다. 고맙습니다. 그 한 건 덕분에 저는 적어도 제가 미친 게 아니라는 걸 알았습니다. 다만 부탁이 하나 있습니다. 다음에는 끝까지 해 주십시오. 저 같은 사람은 끝까지 할 힘이 없습니다.' 문가을이 편지를 접습니다. '이걸 보낼까 말까 1년을 고민하다 쓰러졌어요.'", ["편지 날짜: 대출 실행 다음 달", "수신인: 반대 의견 작성자", "부탁: '다음에는 끝까지'"], ["편지를 조정위원회에 참고 자료로 낸다", "편지는 가족의 것이라며 돌려준다", "편지의 마지막 줄을 조정 발언의 첫 문장으로 쓴다"]],
  ],
  connectiveOrder: [["c12_mediation", "c12_line"], ["c12_market", "c12_rival"], ["c12_memorial", "c12_letter"]],
  choiceEffects: {
    c12_mediation: [
      { trust: 12, legitimacy: 5, humanCost: -5, time: -6, capital: -3, fatigue: 5 },
      { legitimacy: 6, trust: 3, time: -7, humanCost: 4, fatigue: 4 },
      { time: 6, capital: 5, trust: -7, humanCost: 5, fatigue: -3 },
    ],
    c12_market: [
      { trust: 11, legitimacy: 4, humanCost: -5, capital: -4, time: -4, fatigue: 4 },
      { humanCost: -4, trust: 4, capital: -7, time: -2, fatigue: 2 },
      { time: 5, capital: 5, trust: -6, humanCost: 4, fatigue: -4 },
    ],
    c12_memorial: [
      { legitimacy: 10, trust: 5, humanCost: 3, time: -5, fatigue: 4 },
      { trust: 9, humanCost: -5, legitimacy: -3, time: -2, fatigue: 3 },
      { trust: 8, legitimacy: 7, capital: -5, time: -6, fatigue: 5 },
    ],
  },
  choiceCopy: {
    c12_mediation: {
      voice: ["서류 없는 사람도 낼 수 있는, 진술서 양식을 따로 만든다.", "할머니의 아들을 찾아, 서류부터 받아 오겠다고 한다.", "오늘은 서류 있는 사람부터 접수를 끝내자고 한다."],
      echo: ["양식이 생기면 38번 할머니는 피해자가 됩니다. 그 양식을 위원회가 받아 줄지는 아직 모릅니다.", "아들을 찾으면 서류는 생깁니다. 할머니가 알고 싶지 않았던 소식도 함께 올 수 있습니다.", "줄은 줄어듭니다. 38번 할머니는 번호표를 쥔 채 집으로 돌아갑니다."],
    },
    c12_market: {
      voice: ["그 칸에 '연대비'라는 이름을 붙여, 모임 회비로 나누자고 한다.", "배상금이 나오면, 그 80만 원부터 메우자고 한다.", "사장님의 방식이라며, 장부에는 손대지 않는다."],
      echo: ["이름이 붙으면 23명은 빚진 사람이 아니라 회원이 됩니다. 문가을은 그 이름이 조금 쑥스럽다고 합니다.", "메우자는 말에 문가을이 웃습니다. '그 돈은 남편 몫이에요. 떡값으로 쓰면 그 사람이 좋아할 거예요.'", "장부는 그대로 남습니다. 80만 원은 다음 달에도 조용히 빕니다."],
    },
    c12_memorial: {
      voice: ["편지를, 조정위원회에 참고 자료로 낸다.", "편지는 가족의 것이라며 문가을에게 돌려준다.", "편지의 마지막 줄을, 조정 발언의 첫 문장으로 쓰겠다고 한다."],
      echo: ["자료가 된 편지는 위원들이 읽습니다. 그룹 측 변호사도 읽습니다.", "돌려받은 편지를 문가을이 가방 제일 안쪽에 넣습니다. 그 편지는 이제 아무 절차에도 쓰이지 않습니다.", "첫 문장이 '다음에는 끝까지'가 되면 회의실이 조용해집니다. 그 조용함이 누구에게 유리할지는 모릅니다."],
    },
  },
  reactionScenes: [
    ["c12_line_reaction", "c12_line", "c12_market", "부제소 조항", "에코", "에코가 자율 배상안 합의서의 조항을 띄웁니다. 제7조 부제소 합의. 서명한 사람은 이 대출과 관련해 그룹과 계열사(같은 그룹에 속한 다른 회사), '그 임직원'을 상대로 어떤 소송도 내지 않습니다. 에코가 '그 임직원'에 밑줄을 긋습니다. '이 한 단어에 윤상혁이 들어갑니다. 1,528명이 서명하면, 국정감사(국회가 공개적으로 따져 묻는 자리)에서 불린 그 이름은 민사로는 다시 불리지 않습니다.'", ["'그 임직원'을 조항에서 빼라고 요구한다", "조항의 뜻을 모임 전원에게 먼저 설명한다", "배상이 급하니 조항은 문제 삼지 않는다"]],
    ["c12_rival_reaction", "c12_rival", "c12_memorial", "공짜 떡", "문가을", "문가을이 장부를 덮고 웃습니다. '공짜 떡은 제 복수예요. 은행은 우리한테 이자를 받았잖아요. 저는 이 사람들한테 아무것도 안 받을 거예요. 그게 제가 이기는 방법이에요.' 권도현이 계산기를 내려놓고 떡 하나를 집어 먹습니다. 한참 씹다가 말합니다. '이건 제 장부에 적을 칸이 없네요. 처음 있는 일입니다.'", ["그 복수에 나도 한 칸 끼워 달라고 한다", "복수 말고 제도로 갚게 하자고 설득한다", "오늘은 떡이나 먹자며 아무 말도 보태지 않는다"]],
    ["c12_letter_reaction", "c12_letter", "c12_final", "같은 날", "한서윤", "편지 사진을 받은 한서윤이 밤늦게 전화를 겁니다. '편지 날짜요. 제가 당신 반대 의견을 반려한 그다음 달이에요. 이분은 반대 의견이 있었다는 것까지는 들었는데, 그게 반려됐다는 건 몰랐던 거예요.' 수화기 너머가 한참 조용합니다. '제가 조정위원회에 같이 가도 될까요. 거기서 이분 가족한테 제 이름을 말하고 싶어요.'", ["한서윤과 함께 조정위원회에 간다", "가족이 원하는지 먼저 묻고 정한다", "오늘은 한서윤을 말리고 혼자 간다"]],
  ],
  reactionEffects: {
    c12_line: [
      { legitimacy: 10, trust: 5, capital: -6, time: -4, fatigue: 5 },
      { trust: 8, humanCost: -5, time: -7, fatigue: 5 },
      { time: 5, capital: 5, trust: -6, humanCost: 5, fatigue: -3 },
    ],
    c12_rival: [
      { trust: 10, humanCost: -5, time: -4, fatigue: 4 },
      { legitimacy: 6, trust: 3, capital: -4, time: -2, fatigue: 2 },
      { time: 4, capital: 3, trust: -4, humanCost: 3, fatigue: -3 },
    ],
    c12_letter: [
      { legitimacy: 11, trust: 5, capital: -6, time: -3, fatigue: 5 },
      { trust: 7, humanCost: -4, legitimacy: 2, time: -5, fatigue: 3 },
      { time: 5, capital: 5, trust: 4, legitimacy: -7, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c12_line: {
      voice: ["'그 임직원'을 조항에서 빼라고 요구한다.", "조항이 무슨 뜻인지, 모임 전원에게 먼저 설명한다.", "배상이 급하다며, 조항은 문제 삼지 않는다."],
      echo: ["한 단어를 빼자고 하면 그룹 측 변호사가 처음으로 목소리를 높입니다. 그 단어가 가장 비싼 단어였다는 뜻입니다.", "설명을 들은 1,021명 중 몇 명은 서명을 망설입니다. 망설이는 동안 추석은 다가옵니다.", "조항은 그대로 통과합니다. 국정감사에서 불린 이름은 법정에서는 다시 불리지 않습니다."],
    },
    c12_rival: {
      voice: ["그 복수에 나도 한 칸 끼워 달라고 한다.", "복수 말고 제도로 갚게 하자고, 문가을을 설득한다.", "오늘은 떡이나 먹자며, 아무 말도 보태지 않는다."],
      echo: ["끼워 주면 당신 몫의 칸이 생깁니다. 문가을이 칸 이름을 '반대 의견'이라고 적습니다.", "제도는 오래 갑니다. 문가을은 제도가 자기 남편에게 한 일을 기억합니다.", "떡은 맛있습니다. 권도현이 두 개째를 집습니다."],
    },
    c12_letter: {
      voice: ["한서윤과 함께, 조정위원회에 간다.", "가족이 원하는지 먼저 묻고 정하자고 한다.", "오늘은 한서윤을 말리고, 혼자 간다."],
      echo: ["함께 가면 반대한 사람과 반려한 사람이 유족 앞에 나란히 섭니다. 문가을은 둘 중 누구를 먼저 볼지 정해야 합니다.", "물으면 문가을이 하루를 생각합니다. 그리고 '그 사람 얼굴을 보고 싶어요'라고 답합니다.", "혼자 가면 회의는 조용합니다. 한서윤은 그날 밤 편지 사진을 오래 봅니다."],
    },
  },
  reactionMemos: {
    c12_line_reaction: ["'그 임직원'이라는 한 단어", "서명하면 다시 불리지 않는 이름"],
    c12_rival_reaction: ["아무것도 받지 않는 복수", "장부에 적을 칸이 없는 떡"],
    c12_letter_reaction: ["반려 다음 달에 쓴 편지", "가족 앞에서 말할 이름"],
  },
  branchPlan: ["c12_mediation", 2, "c12_branch_factory", "c12_branch_factory_follow"],
  branchScenes: {
    // CASE 12's detour is the factory. The case argues over a compensation
    // standard; the side door is the machine floor the standard is about, where
    // nothing has moved in a year.
    c12_branch_factory: {
      phase: "SIDE DOOR",
      title: "멈춘 공장",
      speaker: "강태민",
      text: "1년째 셔터가 내려진 공장 안에 선반 여섯 대가 비닐을 쓴 채 서 있습니다. 문가을이 열쇠를 건네며 '저는 못 들어가겠어요'라고 해서 강태민과 둘이 들어왔습니다. 벽에 걸린 달력은 부도(빚을 갚지 못해 회사가 쓰러지는 일)가 난 달에 멈춰 있고, 작업대에는 '납품 D-3'이라고 적힌 쪽지가 그대로 붙어 있습니다. 강태민이 비닐 하나를 걷고 선반을 한참 봅니다. '이거 아직 살아 있어요. 기름만 치면 돼요.' 공장 밖에는 이 공장에서 일하던 기술자 일곱 명 중 셋이 와서 기다리고 있습니다.",
      memo: ["선반 6대 -- 보존 상태 양호", "전 직원 7명 중 3명이 재가동을 원함", "공장 명의: 문가을, 담보로 잡혀 있음", "배상금으로 재가동 초기 비용 충당 가능"],
      triggers: ["affection", "trust", "responsibility"],
      choices: [
        { id: "c12_branch_factory_a", label: "기술자 세 명과 재가동 계획부터 같이 세운다", effect: { trust: 12, legitimacy: 5, capital: -7, time: -6, fatigue: 5 }, next: "c12_branch_factory_follow", cognition: { reframing: 2 } },
        { id: "c12_branch_factory_b", label: "공장은 정리하고 배상금은 가족 생활비로 쓰자고 한다", effect: { capital: 9, time: 5, trust: -6, humanCost: 4, fatigue: -3 }, next: "c12_branch_factory_follow", cognition: { risk: 1 } },
        { id: "c12_branch_factory_c", label: "담보가 어떻게 잡혔는지 대출 서류부터 확인한다", effect: { legitimacy: 11, time: -6, humanCost: 3, trust: 3, fatigue: 4 }, next: "c12_branch_factory_follow", cognition: { inference: 2 } },
      ],
    },
    c12_branch_factory_follow: {
      phase: "SIDE DOOR",
      title: "다시 켜는 선반",
      speaker: "강태민",
      text: "강태민이 기름을 치고 전원을 올립니다. 선반이 한 번 헛돌다가, 1년 만에 낮고 고른 소리를 냅니다. 밖에서 기다리던 기술자 셋이 문간까지 들어와 소리만 듣습니다. 가장 나이 많은 김 반장이 말합니다. '사장님 없이 우리끼리 돌리려면 협동조합(일하는 사람들이 함께 소유하고 운영하는 회사)밖에 없어요. 근데 우리 셋은 대출이 안 나와요. 신용이 다 깨져서.' 강태민이 장갑을 벗어 조끼 주머니에 꽂습니다. '대출은 원래 이런 사람들 쓰라고 있는 거 아니에요?'",
      memo: ["선반 1대 정상 가동 확인", "협동조합 설립 최소 인원 5명", "기술자 3명 모두 신용등급 하락", "문하준이 공장 이름을 지어 오겠다고 함"],
      triggers: ["trust", "responsibility", "injustice"],
      choices: [
        { id: "c12_branch_factory_follow_a", label: "협동조합 설립을 돕고 강태민을 네 번째 조합원으로 부른다", effect: { trust: 13, legitimacy: 5, capital: -8, time: -6, fatigue: 5 }, next: "c12_line", cognition: { reframing: 3 } },
        { id: "c12_branch_factory_follow_b", label: "신용이 깨진 사람도 받을 수 있는 대출 조건을 은행에 제안한다", effect: { legitimacy: 12, trust: 5, time: -7, humanCost: 3, fatigue: 5 }, next: "c12_line", cognition: { inference: 2 } },
        { id: "c12_branch_factory_follow_c", label: "재가동은 조정이 끝난 뒤로 미루고 전원을 내린다", effect: { time: 6, capital: 6, trust: -7, humanCost: 4, fatigue: -3 }, next: "c12_line", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c12_start",
    result: "c12_aftershock",
    defaultFree: "c12_route_system",
    // One standard, many people. Like 사건 10 and 11 the case is a single line;
    // the split is whose names the standard ends up holding.
    choices: {},
    system: {
      route: "c12_route_system",
      final: "c12_final_system_route",
      title: "합의서의 문장",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 지난 10년 금융회사들이 내놓은 자율 배상안 47건을 엽니다. 그중 43건에 부제소 합의(앞으로 이 일로 소송하지 않겠다는 약속)가 붙어 있었습니다. 서명한 사람 가운데 나중에 더 큰 피해가 드러난 경우가 11건이었지만, 다시 소송할 수 있었던 사람은 한 명도 없었습니다. '배상금은 사과가 아니라 조용함을 사는 값으로 학습되어 있습니다. 가격표가 붙은 적은 없습니다.'",
      memo: ["자율 배상안 47건 중 부제소 합의 43건", "추가 피해가 드러난 11건 -- 재소송 0건", "이 통계는 어떤 조정 자료에도 인용된 적 없음"],
      routeChoices: [
        ["c12_route_system_publish", "통계를 조정위원회와 모임에 동시에 공개한다", { legitimacy: 11, trust: 6, capital: -6, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c12_route_system_price", "부제소 조항에 따로 값을 매겨 배상금에 더하라고 요구한다", { capital: 6, legitimacy: 8, trust: 3, time: -7, humanCost: 3, fatigue: 6 }, { reframing: 2 }],
        ["c12_route_system_drop", "통계는 덮고 조정 일정대로 간다", { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "부제소 조항에 기한을 두어 5년 뒤에는 효력이 끝나게 한다", { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 }, { reframing: 3 }],
      ["b", "조항은 그대로 두고 배상금만 올린다", { capital: 9, time: 7, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "서명하지 않은 사람들을 위한 소송 기금을 따로 만든다", { legitimacy: 8, trust: 9, capital: -7, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c12_evidence_turn",
    result: "c12_aftershock",
    sourceRoutes: ["c12_mediation", "c12_market", "c12_memorial", "c12_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 그룹이 발표한 배상금 출처 옆에 놓고, 300억이 어느 계정에서 나오는지 맞춰 본다.",
    entryEcho: "단서를 대면 배상금이 누구의 주머니에서 나오는지, 그리고 누구의 주머니에서는 안 나오는지 보입니다.",
    title: "배상금의 주소",
    speaker: "반재욱",
    text: "단서를 맞추자 자율 배상안에 쓸 돈이 장부에 어떻게 잡혔는지가 열립니다. 300억 중 210억은 올해 직원 성과급 삭감분이고, 90억은 '브랜드 신뢰 회복 광고비' 계정입니다. 해온파트너스로 나갔던 자문료(조언값이라며 내보낸 돈)를 되찾아 온 돈은 0원입니다. 반재욱이 수첩을 덮습니다. '돈을 가져간 사람은 한 푼도 안 내고, 돈을 안 가져간 직원들이 배상을 합니다. 그리고 그 배상에는 광고비라는 이름이 붙어 있습니다.'",
    memo: ["210억의 출처: 직원 성과급 삭감", "90억의 출처: 광고비 계정", "해온파트너스 자문료 환수: 0원"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 5, trust: 3, time: -4, fatigue: 4 },
    choices: [
      ["c12_evidence_turn_reclaim", "되찾은 자문료를 배상금에 보태기 전에는 조정에 응하지 않는다", { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c12_evidence_turn_hold", "회계 처리는 알아 두고 조정위원회 마지막 날 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c12_evidence_turn_share", "성과급이 깎인 직원들에게 먼저 이 사실을 알린다", { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c12_branch_factory",
    systemNext: "c12_route_system",
    evidenceNext: "c12_evidence_turn",
    routeLabel: "직전 사건의 출석 준비 역할표로 피해자 모임 일을 나눈다",
    systemLabel: "직전 자유응답 문장이 배상안 보도자료에도 인용됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 배상금이 어디서 나왔는지 장부를 연다",
  },
  openingRoutes: {
    c11_after_toast: "c12_start_toast",
    c11_after_record: "c12_start_record",
    c11_after_summon: "c12_start_summon",
  },
  openingCopy: {
    c12_start_toast: ["같이 먹은 사람들의 배상안", "도윤하", "포장마차의 그 밤을 같이 보낸 여섯 사람은 2주 동안 한 번도 흩어지지 않았습니다. 그리고 그룹이 300억 자율 배상안을 발표합니다. 받는 사람은 다시는 소송하지 않겠다고 서명해야 합니다. 여섯 사람이 동시에 같은 줄을 가리킵니다.", ["자율 배상안 300억 -- 부제소 합의 조건", "피해자 모임 대표 문가을이 면담 요청", "여섯 명 전원 이번 주 일정 비움"]],
    c12_start_record: ["속기록을 연 사람의 배상안", "에코", "공개된 속기록(오간 말을 그대로 적은 공식 기록)을 피해자 모임이 한 줄씩 읽었습니다. 2주 뒤 그룹은 300억 자율 배상안을 발표했고, 보도자료에는 당신의 국정감사(국회가 공개적으로 따져 묻는 자리) 발언 한 줄이 '진정성 있는 문제 제기'라며 인용돼 있습니다. 당신의 문장이 배상안의 홍보 문구가 됐습니다.", ["자율 배상안 300억 -- 부제소 합의 조건", "보도자료에 당신의 발언 인용", "피해자 모임이 속기록 전문을 공유함"]],
    c12_start_summon: ["33층에 다녀온 사람의 배상안", "반재욱", "33층 면담은 12분 만에 끝났습니다. 윤상혁은 당신에게 아무것도 묻지 않았고, 서명란 얘기도 꺼내지 않았습니다. 2주 뒤 그룹이 300억 자율 배상안을 발표합니다. 발표문의 문장 몇 개가 그날 윤상혁이 한 말과 똑같습니다.", ["33층 면담 12분 -- 질문 0개", "자율 배상안 300억 -- 부제소 합의 조건", "발표문과 면담 발언의 문장이 일치"]],
  },
  openingSignatures: {
    c12_start_toast: {
      label: "여섯 명이 가리킨 그 줄을 들고 다 같이 피해자 모임에 간다",
      effect: { trust: 11, humanCost: -5, capital: -4, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "여섯 명이 가리킨 그 줄을 들고, 다 같이 피해자 모임에 간다.",
      echo: "여섯 명이 한꺼번에 오면 모임 사람들은 긴장합니다. 은행 사람 여섯이 떡집에 들어서는 건 처음 보는 장면입니다.",
    },
    c12_start_record: {
      label: "보도자료에 인용된 내 발언을 빼 달라고 공식 요청한다",
      effect: { legitimacy: 12, trust: -3, capital: -5, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "보도자료에 인용된 내 발언을, 빼 달라고 공식 요청한다.",
      echo: "요청은 기록으로 남습니다. 그룹은 인용을 빼고, 그 자리에 '일부 참고인'이라는 말을 넣습니다.",
    },
    c12_start_summon: {
      label: "발표문과 면담 발언이 같은 문장이라는 걸 모임에 먼저 알린다",
      effect: { trust: 12, legitimacy: 5, humanCost: 3, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "발표문과 면담 발언이 같은 문장이라는 걸, 모임에 먼저 알린다.",
      echo: "알리면 모임은 배상안을 다시 읽습니다. 다시 읽은 사람 중 몇은 그래도 서명하겠다고 합니다. 추석이 코앞입니다.",
    },
  },
  voiceLines: {
    // CASE 12. The people the loan landed on. Every line is spoken to someone
    // who paid for it, so none of them is allowed to sound like a statement.
    c12_start_visit: "서류보다 사람이 먼저라며, 피해자 모임 대표부터 직접 찾아간다.",
    c12_start_clause: "서명하기 전에 알아야 한다며, 부제소 조항부터 한 줄씩 읽는다.",
    c12_start_fast: "일단 빨리 받게 하는 것이 먼저라며, 접수를 돕는다.",
    c12_mediation_own: "변명하지 않겠다며, 막지 못한 3년을 인정하고 사과한다.",
    c12_mediation_explain: "반대 의견이 어떻게 지워졌는지, 기록으로 하나씩 설명한다.",
    c12_mediation_ask: "대답 대신, 지금 무엇이 필요한지부터 묻는다.",
    c12_branch_factory_a: "기술자 세 명과 함께, 재가동 계획부터 같이 세운다.",
    c12_branch_factory_b: "공장은 정리하고, 배상금은 가족 생활비로 쓰자고 한다.",
    c12_branch_factory_c: "담보가 어떻게 잡혔는지, 대출 서류부터 확인한다.",
    c12_branch_factory_follow_a: "협동조합 설립을 돕고, 강태민을 네 번째 조합원으로 부른다.",
    c12_branch_factory_follow_b: "신용이 깨진 사람도 받을 수 있는 대출 조건을, 은행에 제안한다.",
    c12_branch_factory_follow_c: "재가동은 조정이 끝난 뒤로 미루자며, 전원을 내린다.",
    c12_market_include: "212명을 배상 기준에 넣지 않으면, 조정에 응하지 않겠다고 한다.",
    c12_market_prove: "서류 없는 31명의 피해를 증명할 자료부터, 함께 모은다.",
    c12_market_split: "서류가 있는 사람부터 먼저 받게 하고, 나머지는 따로 싸우자고 한다.",
    c12_memorial_read: "그 자리에서, 가족과 함께 편지를 읽는다.",
    c12_memorial_keep: "조정이 끝난 뒤에 읽겠다며, 편지를 받아서 간직한다.",
    c12_memorial_son: "문하준에게, 은행이 어떻게 판단하는지 직접 가르쳐 주겠다고 약속한다.",
    c12_final_accept: "추석 전에 받아야 한다며, 조정안에 서명하도록 돕는다.",
    c12_final_amend: "212명을 넣고 부제소 조항을 빼야 서명한다며, 끝까지 버틴다.",
    c12_final_both: "서류 있는 사람은 지금 받게 하고, 212명은 집단소송으로 따로 가자고 한다.",
    c12_after_feast: "오늘은 떡집 셔터를 내릴 때까지, 같이 떡을 돌린다.",
    c12_after_fund: "212명이 들어갈 배상 기준 개정안부터, 문서로 남긴다.",
    c12_after_meet: "마지막 상자를 들고, 곧장 33층으로 간다.",
  },
  echoReplies: {
    // CASE 12.
    c12_start_visit: "찾아가면 문가을은 반기지 않습니다. 대신 떡 써는 칼을 멈추고 끝까지 듣습니다.",
    c12_start_clause: "조항을 읽으면 '그 임직원'이라는 단어가 눈에 걸립니다. 그 단어를 설명하는 데 하루가 듭니다.",
    c12_start_fast: "접수는 빨라집니다. 서명한 사람의 부제소 합의도 그만큼 빨리 효력을 얻습니다.",
    c12_mediation_own: "사과를 들은 방이 조용해집니다. 문가을은 받아들이지도 거절하지도 않고 자리에 앉습니다.",
    c12_mediation_explain: "기록은 정확합니다. 정확한 설명은 '그래서 당신은 뭘 했냐'는 질문에 답하지 못합니다.",
    c12_mediation_ask: "묻자 대답이 쏟아집니다. 서류, 병원비, 문 닫은 가게. 받아 적는 데 두 시간이 걸립니다.",
    c12_branch_factory_a: "계획을 세우면 선반이 다시 돌 날짜가 생깁니다. 그 날짜까지 누가 돈을 댈지는 아직 빈칸입니다.",
    c12_branch_factory_b: "정리하면 가족의 겨울은 따뜻해집니다. 기술자 셋은 비닐을 다시 덮고 돌아갑니다.",
    c12_branch_factory_c: "서류를 보면 담보가 부도 두 달 전에 추가됐다는 게 드러납니다. 누가 그걸 권했는지도 적혀 있습니다.",
    c12_branch_factory_follow_a: "강태민이 조합원 가입서에 이름을 씁니다. 야간조를 그만두지 않고 주말에만 오겠다고 합니다.",
    c12_branch_factory_follow_b: "제안은 심사에 올라갑니다. 신용이 깨진 사람에게 대출을 해 주자는 제안서를, 은행은 처음 받아 봅니다.",
    c12_branch_factory_follow_c: "전원을 내리면 공장은 다시 조용해집니다. 김 반장이 '1년 더 기다리죠 뭐'라고 웃습니다.",
    c12_market_include: "버티면 조정은 길어집니다. 추석 전에 받을 수 있었던 1,528명이 당신을 봅니다.",
    c12_market_prove: "자료를 모으면 31명이 하나씩 이름을 갖습니다. 시장 할머니 한 분은 30년치 가계부를 들고 옵니다.",
    c12_market_split: "먼저 받는 사람은 추석을 쇱니다. 서류 없는 사람들은 이번에도 다음 차례가 됩니다.",
    c12_memorial_read: "함께 읽으면 문하준이 마지막 줄에서 울음을 참지 못합니다. 문가을은 아들의 등을 쓸어 줍니다.",
    c12_memorial_keep: "간직한 편지는 당신의 것이 됩니다. 조정이 끝날 때까지 한 번도 꺼내 보지 않습니다.",
    c12_memorial_son: "약속하면 문하준이 휴대폰에 당신 번호를 저장합니다. 이름 칸에 '반대 의견'이라고 적습니다.",
    c12_final_accept: "서명하면 추석 전에 돈이 들어옵니다. 212명은 조정안의 어느 칸에도 없고, 윤상혁의 이름은 다시 불리지 않습니다.",
    c12_final_amend: "버티면 그룹 측 변호사가 휴회를 요청합니다. 추석은 입금 없이 지나가고, 다음 회의 날짜는 아직 없습니다.",
    c12_final_both: "둘로 나누면 1,528명은 추석을 쇠고 212명은 소송을 시작합니다. 두 싸움을 동시에 하는 사람은 당신입니다.",
    c12_after_feast: "셔터가 내려갈 때 가게 안에 여섯 명과 문가을 가족이 남습니다. 33층의 호출은 내일 아침까지 기다립니다.",
    c12_after_fund: "문서가 된 기준은 사람이 바뀌어도 남습니다. 문가을은 그 문서에 서명하며 '이번엔 끝까지네요'라고 합니다.",
    c12_after_meet: "상자를 든 채 33층에 가면 로비 보안요원이 상자를 검사합니다. 떡입니다. 그가 하나 달라고 합니다.",
  },
  characterProfiles: {
    문가을: {
      role: "피해자 모임 대표 · 망원시장 가을떡방 사장",
      stance: "분노 · 생계 · 끝까지",
      job: "숫자였던 1,740명을 얼굴로 되돌린다. 고맙다는 말 대신 왜 안 막았냐고 묻는다.",
      appearance: "벗지 않는 앞치마, 떡 칼에 베인 손가락의 밴드, 남편 공장 열쇠가 달린 열쇠고리.",
      thought: "사과는 필요 없다. 다음엔 끝까지 하라는 그 사람 부탁을, 누군가는 들어줘야 한다.",
      gesture: "문가을은 대답하기 전에 떡을 한 번 더 썬다. 칼질 소리가 대답의 박자다.",
      voice: "시장 사람의 속도로 말하고, 화가 날수록 존댓말이 또렷해진다.",
      line: "고맙다는 말 들으러 오셨으면 잘못 오셨어요. 떡이나 쪄요.",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "분쟁조정 신청 마감까지 D-10" },
  sceneContext: {
    c12_start: {
      place: "트리거랩 4층 분석관실",
      clock: "분쟁조정 신청 마감까지 D-10",
      question: "300억 배상안에 '다시는 소송하지 않는다'는 조건이 붙었습니다. 무엇부터 하겠습니까?",
      lead: "국정감사(국회가 공개적으로 따져 묻는 자리)가 끝나고 2주, 분석관실 프린터에서 그룹 공지문이 계속 나옵니다.",
    },
    c12_start_toast: {
      place: "트리거랩 4층 분석관실",
      clock: "분쟁조정 신청 마감까지 D-10",
      question: "여섯 명이 같은 조항을 가리킵니다. 그 줄을 들고 어디부터 가겠습니까?",
      lead: "포장마차의 그 밤 이후 여섯 명은 매일 점심을 같이 먹었습니다.",
    },
    c12_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "분쟁조정 신청 마감까지 D-10",
      question: "당신의 국정감사 발언이 배상안의 홍보 문구가 됐습니다. 그 문장을 어떻게 되찾겠습니까?",
      lead: "그룹 보도자료 세 번째 문단에서 당신이 한 말을 발견했습니다.",
    },
    c12_start_summon: {
      place: "트리거랩 4층 분석관실",
      clock: "분쟁조정 신청 마감까지 D-10",
      question: "12분 면담의 말들이 배상안 발표문에 그대로 있습니다. 이 사실을 누구에게 먼저 말하겠습니까?",
      lead: "33층에서 내려온 뒤 2주, 발표문을 읽다가 익숙한 문장에서 멈췄습니다.",
    },
    c12_mediation: {
      place: "여의도 금융감독원 · 분쟁조정 설명회장",
      clock: "분쟁조정 신청 마감까지 D-8",
      question: "왜 안 막았냐는 질문이 340명 앞에서 나왔습니다. 어떻게 답하겠습니까?",
      lead: "소개 순서를 기다리는 동안, 앞치마를 두른 사람 하나가 맨 앞줄에서 당신을 보고 있습니다.",
    },
    c12_branch_factory: {
      place: "인천 남동공단 가온정밀 · 공장",
      clock: "분쟁조정 신청 마감까지 D-7",
      question: "1년 멈춘 선반이 아직 살아 있습니다. 이 공장을 어떻게 하겠습니까?",
    },
    c12_branch_factory_follow: {
      place: "인천 남동공단 가온정밀 · 공장",
      clock: "분쟁조정 신청 마감까지 D-7",
      question: "신용이 깨진 기술자들은 대출을 받을 수 없습니다. 다시 켠 선반을 어떻게 하겠습니까?",
    },
    c12_line: {
      place: "여의도 금융감독원 · 접수 창구",
      clock: "분쟁조정 신청 마감까지 D-8",
      question: "번호표 38번 할머니는 채울 수 있는 칸이 아홉 개뿐입니다. 어떻게 하겠습니까?",
    },
    c12_line_reaction: {
      place: "여의도 금융감독원 1층 로비",
      clock: "분쟁조정 신청 마감까지 D-8",
      question: "'그 임직원'이라는 한 단어에 윤상혁이 들어갑니다. 이 조항을 어떻게 하겠습니까?",
    },
    c12_market: {
      place: "망원시장 가을떡방",
      clock: "추석 사흘 전",
      question: "김 서린 가게에서 서류 없는 212명도 배상에 들어가냐는 질문이 나왔습니다. 무엇이라 하겠습니까?",
      lead: "가게 문을 열자마자 김이 얼굴을 덮습니다. 앞치마가 이미 여섯 장 걸려 있습니다.",
    },
    c12_rival: {
      place: "망원시장 가을떡방 · 계산대",
      clock: "추석 사흘 전 · 22시",
      question: "장부 뒷장에 한 번도 계산되지 않은 떡값 스물세 칸이 있습니다. 어떻게 하겠습니까?",
    },
    c12_rival_reaction: {
      place: "망원시장 가을떡방 · 셔터 앞",
      clock: "추석 사흘 전 · 22시",
      question: "공짜 떡은 자기 복수라고 문가을이 말합니다. 그 복수에 어떻게 답하겠습니까?",
    },
    c12_memorial: {
      place: "인천 추모공원 · 봉안당",
      clock: "추석 이틀 전 · 1주기",
      question: "남편이 '반대 의견을 쓰신 심사역님께' 남긴 봉투가 나왔습니다. 어떻게 하겠습니까?",
      lead: "추석 연휴를 앞둔 봉안당은 조용합니다. 복도 끝에서 교복 입은 뒷모습이 먼저 보입니다.",
    },
    c12_letter: {
      place: "인천 추모공원 · 벤치",
      clock: "추석 이틀 전 · 1주기",
      question: "다음에는 끝까지 해 달라는 부탁이 편지에 있습니다. 이 편지를 어떻게 하겠습니까?",
    },
    c12_letter_reaction: {
      place: "트리거랩 4층 분석관실 · 야간",
      clock: "조정 전날 · 23:10",
      question: "반려한 사람이 유족 앞에서 자기 이름을 말하고 싶어 합니다. 어떻게 하겠습니까?",
    },
    c12_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "조정 전날",
      question: "자율 배상안 47건 중 43건이 조용함을 함께 샀습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c12_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "조정 당일 · 새벽",
      question: "배상금에 붙은 조건을 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c12_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 회계 원장",
      clock: "조정 당일 · 07시",
      question: "배상금은 돈을 가져간 쪽이 아니라 직원 성과급에서 나왔습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c12_final: {
      place: "여의도 금융감독원 · 분쟁조정위원회 회의실",
      clock: "추석 전 입금 마감 · 오늘 18시",
      question: "212명이 빠진 조정안에 오늘 서명하면 추석 전에 입금됩니다. 어떻게 하겠습니까?",
      lead: "문가을이 앞치마 대신 검은 재킷을 입고 왔습니다. 가방 안쪽에 편지가 들어 있습니다.",
    },
    c12_aftershock: {
      place: "망원시장 가을떡방 · 가게 앞",
      clock: "첫 배상 입금일 · 저녁",
      question: "떡 상자가 다 돌 무렵 33층이 서명란 얘기를 하자고 합니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c12-fund-source",
    title: "배상금의 주소",
    text: "300억 중 210억은 직원 성과급 삭감분, 90억은 광고비 계정이었습니다. 돈을 가져간 쪽에서 되찾아 온 돈은 0원이었습니다.",
  },
  outcomes: {
    c12_after_feast: { tag: "떡을 돌린 결말", title: "셔터가 내려갈 때까지 1,021개의 상자를 돌렸다", text: "첫 배상금이 들어온 날, 피해자 모임 전원이 떡 한 상자씩을 받았습니다. 마지막 상자는 문성호 대표 몫으로 당신이 받았습니다." },
    c12_after_fund: { tag: "기준을 고친 결말", title: "212명이 들어갈 칸이 문서로 생겼다", text: "배상 기준 개정안이 접수됐습니다. 서류가 없어서 피해자가 아니었던 사람들이, 처음으로 칸을 가졌습니다." },
    c12_after_meet: { tag: "먼저 올라간 결말", title: "마지막 떡 상자를 들고 33층에 먼저 갔다", text: "당신은 떡집 앞 줄을 두고 33층으로 향했습니다. 로비 보안요원만 떡을 하나 얻어 먹었습니다." },
  },
  carryovers: {
    c12_after_feast: { trust: 9, humanCost: -5, fatigue: -8 },
    c12_after_fund: { legitimacy: 12, trust: 2, fatigue: 5 },
    c12_after_meet: { capital: 6, legitimacy: 4, trust: -8 },
  },
  continuityChallenges: {
    c11_after_toast: { id: "protect-trust", title: "같이 먹은 사람들과 같이 가기", text: "여섯 명은 흩어지지 않았습니다. 피해자들 앞에 혼자가 아니라 여섯이 서는 선택을 찾아야 보너스가 열립니다." },
    c11_after_record: { id: "use-reframe", title: "홍보 문구가 된 내 문장 되찾기", text: "당신의 발언이 배상안 보도자료에 인용됐습니다. 그 문장이 누구를 위한 것인지 판을 다시 짜야 합니다." },
    c11_after_summon: { id: "repair-legitimacy", title: "12분 면담의 공정함 회복하기", text: "먼저 올라간 면담은 아무것도 남기지 않았습니다. 피해자들에게 그 12분을 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
