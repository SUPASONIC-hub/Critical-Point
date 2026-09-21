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
      "국정감사가 끝나고 2주 뒤, KD금융그룹이 '자율 배상안'을 발표합니다. 재원은 300억, 대상은 2023-0412 대출로 피해를 본 사람들입니다. 조건이 하나 붙어 있습니다. 배상금을 받는 사람은 부제소 합의(앞으로 이 일로 소송하지 않겠다는 약속)에 서명해야 합니다. 도윤하가 공지문을 출력해 들고 옵니다. '피해자 모임 대표가 당신을 만나고 싶대요. 망원시장에서 떡집을 하시는 분이에요.' 그가 잠깐 망설입니다. '고맙다는 말 들으러 가는 자리는 아닐 거예요.'",
    memo: [
      "자율 배상안 재원 300억 -- 1인당 평균 1,700만 원",
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
