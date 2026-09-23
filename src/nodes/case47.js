/**
 * CASE 47 -- the authored scenes of the same 추석, one year on.
 *
 * 사건 12 ended on a 추석 at a rice-cake shop: the whole team drafted onto the
 * steamers, a letter from a dead man asking the reviewer to "go all the way
 * next time", and 문가을 stopping her knife to ask whether the 212 without
 * papers would be in the compensation standard. "There are more than thirty of
 * them in our group." Thirty-five cases later it is 추석 again. The class
 * action has reached a court-led settlement; 181 of the 212 have been matched
 * through subcontracting records and statements and will be paid over the
 * holiday. The last 31 are stamped '확인 불가'. They are the people 문가을 meant a
 * year ago: the canteen cook, the laundry, the dawn couriers -- people who fed,
 * clothed and carried for 가온정밀 on credit and never appeared on a loan file.
 *
 * It is the warmest case of the season on purpose, and the warmth is earned by
 * what it costs. The comedy is a rota on the fridge door (강태민 promoted to
 * head of steamers, 나준혁 out-stamped by his apprentice, 권도현 banned from the
 * word "deficit"); the joy is 끝까지정밀's first month in the black and 문하준's
 * first-round admission; the grief is a notebook found in 문성호's drawer,
 * headed '갚을 곳', with thirty-one names and a margin that says "couldn't pay
 * again today, sorry"; the anger is a screening engine that cannot count what
 * was never typed in, and a remainder of 22억 earmarked for a holiday-giving TV
 * advert. The case closes on whether to finish without the 31 so the 181 are
 * paid tonight, and on 문가을 almost saying thank you -- and on a KD캐피탈 credit
 * committee after the holiday, with the analyst's name on the panel (사건 48).
 */
export const case47Nodes = {
  c47_start: {
    phase: "CASE 47 BRIEFING",
    title: "1년 뒤, 같은 문자",
    speaker: "선재윤",
    text:
      "추석 사흘 전 아침 7시 40분, 휴대폰에 문자 두 통이 나란히 와 있습니다. 첫 번째는 문가을입니다. 지난주 '떡 찌러 와요'에 이어 오늘은 이렇게 왔습니다. '말로 하지 말고 와서 떡이나 쪄요. 올해는 찜기가 여섯 대예요.' 꼭 1년 전 그 문장에 한 줄이 늘었습니다. 두 번째는 공익 변호사 선재윤의 긴 메일입니다. 집단소송(피해자 여럿이 함께 내는 소송)이 법원 조정(판사가 가운데서 양쪽 합의를 이끄는 절차)으로 넘어갔고, 그룹이 2차 배상 기준안을 냈습니다. 서류 없는 212명 가운데 181명은 하도급(큰 건설사가 맡은 공사를 작은 업체에 다시 나눠 맡기는 것) 명세와 진술로 피해가 확인돼 추석 연휴 안에 입금됩니다. 남은 31명 옆에는 한 단어가 찍혀 있습니다. '확인 불가.' 선재윤이 메일 끝에 덧붙였습니다. '원고 측 동의 마감은 추석 전날 18시예요. 31명, 작년에 문가을 씨가 떡 썰다 말고 물었던 바로 그 사람들이에요.'",
    memo: [
      "2차 배상 기준안 -- 212명 중 181명 확인, 연휴 안 입금",
      "남은 31명: '확인 불가'",
      "원고 측 동의 마감: 추석 전날 18시",
      "문가을: '올해는 찜기가 여섯 대예요'",
    ],
    triggers: ["affection", "injustice", "responsibility"],
    choices: [
      {
        id: "c47_start_names",
        label: "떡집 문을 열기 전에 31명의 이름부터 문가을과 같이 본다",
        effect: { trust: 11, humanCost: -6, time: -5, capital: -3, fatigue: 5 },
        next: "c47_steam",
        cognition: { persistence: 2 },
      },
      {
        id: "c47_start_criteria",
        label: "'확인 불가'를 가른 판정 기준부터 한 줄씩 읽는다",
        effect: { legitimacy: 11, time: -4, trust: -2, humanCost: 3, fatigue: 4 },
        next: "c47_steam",
        cognition: { inference: 2 },
      },
      {
        id: "c47_start_first",
        label: "181명의 연휴 안 입금부터 확정하고 31명은 뒤로 미룬다",
        effect: { capital: 8, time: 6, legitimacy: -5, trust: -2, humanCost: 4, fatigue: 1 },
        next: "c47_steam",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c47_steam",
      },
    ],
  },
  c47_steam: {
    phase: "THE STEAMERS",
    title: "찜기 여섯 대",
    speaker: "강태민",
    text:
      "추석 사흘 전 오전 10시, 가을떡방. 냉장고 문에 문가을의 손글씨 근무표가 붙어 있습니다. 강태민은 작년 떡메 담당에서 올해 '찜기 반장'으로 올랐고, 두 주 전부터 떡방에서 일하는 전 야간조 서지호는 나준혁에게 송편 도장을 배운 지 사흘 만에 스승보다 모양이 고르다는 평을 듣습니다. 나준혁은 '30년 도장 인생에 후계자가 생겼다'며 기쁜 척 우울해합니다. 권도현은 '적자'라는 말을 쓰지 않는 조건으로 계산대에 복귀했다가, 첫 손님에게 '이 가격이면… 손익분기점입니다'라고 말하고 다시 포장대로 쫓겨납니다. 11시, 남희원이 들어옵니다. 일흔넷, 가온정밀 구내식당을 12년 한 사람입니다. 부도(빚을 갚지 못해 회사가 쓰러지는 일)가 나던 해 외상 2,340만 원을 받지 못했습니다. 그가 비닐에 싼 장부를 내려놓습니다. 7월 장마에 물이 들어 일곱 장이 번졌습니다. '작년엔 떡 사러 왔고, 올해는 이름 찾으러 왔어요. 근데 종이가 먼저 울어 버렸네.'",
    memo: [
      "근무표: 강태민 찜기 반장, 서지호 송편 도장",
      "권도현: '적자' 금지 조건으로 계산대 복귀",
      "남희원(74): 가온정밀 구내식당 12년, 외상 2,340만 원",
      "장마에 젖은 장부 일곱 장",
    ],
    triggers: ["affection", "injustice", "trust"],
    choices: [
      {
        id: "c47_steam_dry",
        label: "남희원의 젖은 장부를 찜기 옆에서 한 장씩 말리며 같이 읽는다",
        effect: { trust: 12, humanCost: -6, time: -5, legitimacy: 2, fatigue: 5 },
        next: "c47_factory",
        cognition: { persistence: 2 },
      },
      {
        id: "c47_steam_appeal",
        label: "31명의 '확인 불가' 판정마다 이의 신청서를 쓴다",
        effect: { legitimacy: 11, trust: 3, time: -5, humanCost: 2, fatigue: 5 },
        next: "c47_factory",
        cognition: { inference: 2 },
      },
      {
        id: "c47_steam_orders",
        label: "대목 주문부터 끝내고 31명 이야기는 저녁으로 미룬다",
        effect: { capital: 8, time: 5, trust: -3, humanCost: 4, fatigue: -3 },
        next: "c47_factory",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c47_factory",
      },
    ],
  },
  c47_factory: {
    phase: "THE FACTORY",
    title: "첫 흑자",
    speaker: "김 반장",
    text:
      "추석 이틀 전 오후 2시, 인천 남동공단 끝까지정밀. 7월 장마에 무릎까지 잠겼던 공장에서 선반 여섯 대가 모두 돕니다. 협동조합(일하는 사람들이 함께 소유하고 운영하는 회사)으로 공장을 다시 연 지 열한 달 만에, 9월 결산이 처음으로 흑자입니다. 412만 원. 김 반장이 그 숫자를 A4에 크게 뽑아 선반마다 붙였고, 권도현은 세 번 검산한 뒤 '흑자 맞습니다'라고 말합니다. 이번 달에만 세 번째 흑자라며, 조금 감동한 얼굴로 돌아섭니다. 잔치 준비로 옛 사장실을 치우던 김 반장이 책상 맨 아래 서랍 앞에서 손을 멈춥니다. 문가을이 차마 못 열겠다던 서랍입니다. 검은 수첩 하나, 표지에 문성호의 글씨로 '갚을 곳'. 안에는 이름 서른한 개와 금액, 날짜가 적혀 있습니다. 구내식당 2,340만 원, 작업복 세탁소 410만 원, 퀵 기사 세 명… 마지막 장에는 한 줄만 있습니다. '추석 전에는 식당부터.'",
    memo: [
      "9월 결산 첫 흑자 412만 원",
      "선반 6대 전부 가동 -- 장마 피해 복구",
      "문성호의 수첩 '갚을 곳': 이름 31개·금액·날짜",
      "마지막 줄: '추석 전에는 식당부터'",
    ],
    triggers: ["affection", "helplessness", "responsibility"],
    choices: [
      {
        id: "c47_factory_family",
        label: "수첩은 문가을에게 먼저 가져가 가족이 정하게 한다",
        effect: { trust: 13, humanCost: -5, time: -4, legitimacy: -3, fatigue: 4 },
        next: "c47_memorial",
        cognition: { persistence: 2 },
      },
      {
        id: "c47_factory_match",
        label: "수첩의 서른한 줄을 31명 명단과 한 줄씩 맞춰 본다",
        effect: { legitimacy: 12, trust: 3, time: -5, humanCost: 2, fatigue: 3 },
        next: "c47_memorial",
        cognition: { inference: 2 },
      },
      {
        id: "c47_factory_send",
        label: "수첩 사진부터 찍어 연서준에게 보내 협상 카드로 쓴다",
        effect: { capital: 8, time: 6, legitimacy: 2, trust: -5, humanCost: 4, fatigue: -2 },
        next: "c47_memorial",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c47_memorial",
      },
    ],
  },
  c47_memorial: {
    phase: "MEMORIAL",
    title: "2주기",
    speaker: "문하준",
    text:
      "추석 전날 오전 11시, 인천 추모공원 봉안당. 작년 이맘때 1주기였던 자리 앞에 문가을이 송편 세 개와 소주 한 잔을 놓습니다. 올해 송편은 모양이 유난히 고릅니다. 서지호가 찍었다고 합니다. 교복 차림의 문하준이 휴대폰 화면을 유리문에 댑니다. 어젯밤 온 문자입니다. '수시 1단계 합격 -- 경영학과, 면접 10월 18일.' 하준이 작게 말합니다. '아빠, 은행원 되려면 아직 한참 남았는데, 일단 1단계는 됐어.' 문가을이 웃다가 고개를 돌립니다. 그리고 가방에서 어제 공장 서랍에서 나온 남편의 검은 수첩, '갚을 곳'을 꺼냅니다. 서른한 명의 이름과 금액 말고도, 여백에 문성호의 혼잣말이 적혀 있습니다. '오늘도 못 갚았다. 미안하다.' 문가을이 수첩을 쥔 손에 힘을 줍니다. '이거 내면 다들 알겠죠. 이 사람이 명절 밥값도 못 갚고 간 사람이라는 거.'",
    memo: [
      "문성호 2주기 -- 송편 세 개, 소주 한 잔",
      "문하준: 수시 1단계 합격, 면접 10월 18일",
      "'갚을 곳' 수첩: 31명 이름과 금액",
      "수첩 여백: '오늘도 못 갚았다. 미안하다.'",
    ],
    triggers: ["affection", "selfAwareness", "choice"],
    choices: [
      {
        id: "c47_memorial_wait",
        label: "문가을이 정할 때까지 봉안당 벤치에 함께 앉아 기다린다",
        effect: { trust: 13, humanCost: -5, time: -5, legitimacy: -2, fatigue: 5 },
        next: "c47_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c47_memorial_cover",
        label: "혼잣말은 가리고 서른한 줄만 옮겨 증거로 낸다",
        effect: { legitimacy: 12, trust: 5, capital: -4, time: -5, humanCost: 2, fatigue: 4 },
        next: "c47_final",
        cognition: { inference: 2 },
      },
      {
        id: "c47_memorial_son",
        label: "하준의 합격을 먼저 축하하고 수첩 이야기는 저녁으로 미룬다",
        effect: { time: 5, capital: 4, trust: 2, humanCost: 3, fatigue: -4 },
        next: "c47_final",
        cognition: { reframing: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c47_final",
      },
    ],
  },
  c47_final: {
    phase: "FINAL DECISION",
    title: "서른한 명",
    speaker: "문가을",
    text:
      "추석 전날 오후 5시, 가을떡방. 법무법인 도율의 연서준이 회색 정장 차림으로 들어서자 문가을이 말없이 앞치마부터 건넵니다. 그는 잠깐 망설이다 받아 입습니다. 선재윤이 조정안을 펼칩니다. 181명은 오늘 18시에 동의하면 연휴 중에 입금됩니다. 31명은 '확인 불가'를 그대로 두는 대신 한 사람에 300만 원씩 위로금(잘못은 인정하지 않고 건네는 돈)을 받고, 받는 사람은 부제소 합의(앞으로 이 일로 소송하지 않겠다는 약속)에 서명합니다. 연서준이 조용히 말합니다. '수첩은 존중합니다. 다만 고인의 자필 메모는 피해를 증명하는 서류가 아닙니다.' 계산대 옆에는 가온정밀 구내식당을 하던 남희원이 젖었다 마른 장부를 끌어안고 앉아 있습니다. 문가을이 당신을 봅니다. '작년에 남편 편지에 그랬죠. 다음엔 끝까지 해 달라고. 올해는 제가 부탁할게요. 이 사람들 빼고 끝내지 마요.'",
    memo: [
      "181명: 오늘 18시 동의 시 연휴 중 입금",
      "31명: 위로금 1인 300만 원 + 부제소 합의",
      "31명 청구액 합계 6억 2천만 원",
      "이 선택은 사건 48의 심사위원회로 이어짐",
    ],
    triggers: ["choice", "injustice", "affection"],
    choices: [
      {
        id: "c47_final_hold",
        label: "수첩과 이웃 보증으로 31명을 넣을 때까지 동의하지 않는다",
        effect: { trust: 12, legitimacy: 8, capital: -8, time: -8, humanCost: 3, fatigue: 6 },
        next: "case47_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c47_final_split",
        label: "181명은 오늘 동의하고 31명은 법원에 따로 입증을 신청한다",
        effect: { legitimacy: 12, trust: 5, time: -5, capital: -3, humanCost: 2, fatigue: 5 },
        next: "case47_result",
        cognition: { inference: 2, reframing: 1 },
      },
      {
        id: "c47_final_settle",
        label: "31명에게 위로금을 받게 하고 오늘 2차 기준을 모두 끝낸다",
        effect: { capital: 10, time: 6, humanCost: -3, trust: -3, legitimacy: -8, fatigue: -3 },
        next: "case47_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case47_result",
      },
    ],
  },
};

/**
 * Everything else case 47 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case47 = {
  id: "case47",
  nodes: case47Nodes,
  aftermath: {
    c47_aftershock: {
      phase: "AFTERMATH",
      title: "고마…",
      speaker: "문가을",
      text: "추석 밤 9시, 가을떡방 옥상. 시장 지붕들 위로 보름달이 떠 있습니다. 문가을이 남은 송편을 평상에 펼치고, 나준혁은 서지호의 송편을 달에 비춰 보더니 '이건 내 도장보다 낫다'고 결국 인정합니다. 권도현은 오늘 떡값을 계산하다 계산기를 압수당하고, 문하준은 옥상 사람들을 스케치북에 그리다 '열한 명'이라고 셉니다. 달이 가장 높이 떴을 때 문가을이 당신 옆에 앉습니다. '작년부터 하려던 말이 있는데요. 고마…' 그가 말을 멈추고 송편 하나를 당신 입에 밀어 넣습니다. '…떡이나 먹어요.' 그때 휴대폰에 KD캐피탈 공지가 뜹니다. 새 규칙에 따라 심사위원은 전원 실명으로 서명하고, 첫 임시 심사위원회는 월요일 오전 9시. 위원 명단 맨 아래 줄에 당신의 이름이 있습니다. 안건은 아직 한 줄뿐입니다. '배송 플랫폼 운영자금.' 3년 전 그 서류의 첫 줄도 그렇게 시작했습니다.",
      memo: ["추석 보름달 -- 가을떡방 옥상 열한 명", "문가을: '고마…' 대신 송편", "KD캐피탈 임시 심사위원회: 월요일 09시, 위원 실명 서명", "안건 한 줄: '배송 플랫폼 운영자금'"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c47_after_warm", label: "보름달이 질 때까지 옥상에 남아 모두와 송편을 빚는다", effect: { trust: 11, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case47_result", cognition: { reframing: 2 } },
        { id: "c47_after_record", label: "서른한 명의 이야기와 증거를 배상 기준 개정 요청서로 남긴다", effect: { legitimacy: 13, trust: 4, time: -4, capital: -3, fatigue: 5 }, next: "case47_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c47_after_rush", label: "송편 봉지를 챙겨 먼저 내려가 심사위원회 준비에 들어간다", effect: { capital: 8, legitimacy: 4, trust: -6, humanCost: 4, fatigue: 4 }, next: "case47_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c47_final", "c47_aftershock"],
  connectiveScenes: [
    ["c47_ledger", "c47_steam", "c47_factory", "올해의 그 칸", "권도현", "밤 10시, 셔터를 반쯤 내린 가게에서 권도현이 문가을의 장부를 폅니다. 이번에는 정말로 허락을 받았습니다. 작년 추석, 그가 세로줄을 그어 둔 그 칸입니다. 문 닫은 가게 사장들 몫의 공짜 떡. 스물세 줄이던 이름이 올해는 아홉 줄입니다. 열네 명이 다시 가게를 열었거나 배상을 받았습니다. 그런데 칸 맨 아래에 새 줄이 하나 있습니다. '31 -- 매달 한 상자씩.' 권도현이 계산기를 두드리다 멈춥니다. '사장님, 올해 이 장부 처음으로 흑자입니다. 이 줄만 빼면요.' 문가을이 떡을 썰며 대꾸합니다. '그 줄 빼고 하는 흑자는 안 할래요.'", ["작년 23줄 → 올해 9줄", "새 줄: 31명 몫 매달 한 상자", "가게 장부 첫 흑자 -- 그 줄을 빼면"], ["31명 몫 떡값을 동료들이 나눠 내자고 한다", "그 줄의 날짜들을 31명과 가게의 거래 기록으로 정리한다", "대목 장부는 연휴 뒤에 보자며 셔터를 내린다"]],
    ["c47_banner", "c47_factory", "c47_memorial", "끝까지, 세 번", "문하준", "오후 6시, 문하준이 학교에서 곧장 지하철을 타고 교복 차림으로 도착합니다. 등에 둘둘 만 현수막을 메고 있습니다. 미술 시간에 몰래 그렸다는 현수막에는 '끝까지정밀 첫 흑자 -- 끝까지 버텨서 끝까지 남긴 돈'이라고 적혀 있습니다. 권도현이 '끝까지가 세 번입니다. 작년 사업계획서의 열한 번보다는 많이 줄었네요'라고 하자 하준이 '성장이죠'라고 받습니다. 현수막이 걸리자 선반 앞에서 조합원 총회가 즉석으로 열립니다. 안건은 하나, 흑자 412만 원을 어디에 쓰는가. 조합원 다섯 명은 작년 겨울 두 달 치 월급을 아직 못 받았습니다. 김 반장이 손을 듭니다. '저는 사장님 수첩에 있는 사람들부터 드렸으면 해요. 우리가 그 집 밥을 먹고 일했잖아요.'", ["현수막 '끝까지' 3회 -- 작년 사업계획서 11회", "조합원 총회 안건: 흑자 412만 원의 쓰임", "조합원 5명, 작년 겨울 월급 두 달 미지급"], ["흑자를 31명 몫으로 먼저 떼자는 김 반장 편을 든다", "조합 규약대로 무기명 투표로 정하게 한다", "흑자는 밀린 월급에 쓰고 31명은 배상에 맡기자고 한다"]],
    ["c47_count", "c47_memorial", "c47_final", "212에서 31까지", "도윤하", "봉안당 앞 벤치에서 도윤하가 낡은 수첩을 폅니다. 3년 전 창구 뒤에서 혼자 세기 시작한 그 이름들입니다. 212명 가운데 181개의 이름에 가느다란 줄이 그어져 있고, 옆에 확인된 날짜와 입금 예정일이 적혀 있습니다. 줄이 없는 이름이 서른한 개 남았습니다. 도윤하가 볼펜 뚜껑을 열었다 닫습니다. '작년 이맘때는 212였어요. 줄 하나 그을 때마다 좋았는데, 이상하게 오늘은 무서워요. 이 서른한 명 옆에 확인 불가라고 적어야 하나, 아무것도 안 적어야 하나.' 수첩 뒷장에는 그가 쓰러졌던 해의 날짜가 볼펜으로 눌러 쓴 채 남아 있습니다.", ["도윤하 수첩: 212명 중 181명 줄 그음", "남은 이름 31개 -- 적을 말이 없음", "볼펜 뚜껑을 네 번 열었다 닫음"], ["남은 서른한 이름 옆에 오늘 찾은 단서를 하나씩 적어 준다", "도윤하의 수첩을 원고 측 증거 목록에 정식으로 올린다", "오늘은 수첩을 덮고 181명 입금부터 기뻐하자고 한다"]],
  ],
  connectiveOrder: [["c47_steam", "c47_ledger"], ["c47_factory", "c47_banner"], ["c47_memorial", "c47_count"]],
  choiceEffects: {
    c47_steam: [
      { trust: 10, humanCost: -5, capital: -6, time: -2, fatigue: 3 },
      { legitimacy: 8, trust: 3, time: -4, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 3, trust: 1, humanCost: 4, fatigue: -4 },
    ],
    c47_factory: [
      { trust: 11, humanCost: -3, capital: -5, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 4, time: -3, humanCost: 2, fatigue: 2 },
      { capital: 5, time: 3, trust: 2, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
    c47_memorial: [
      { trust: 10, humanCost: -4, legitimacy: 2, time: -4, fatigue: 3 },
      { legitimacy: 10, trust: 1, time: -3, humanCost: 3, fatigue: 2 },
      { time: 4, capital: 2, trust: 3, humanCost: 4, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c47_steam: {
      voice: ["31명 몫 떡값을, 동료들이 나눠 내자고 한다.", "그 줄의 날짜들을, 31명과 가게의 거래 기록으로 정리한다.", "대목 장부는 연휴 뒤에 보자며, 셔터를 내린다."],
      echo: ["나눠 내자고 하면 권도현이 먼저 지갑을 엽니다. 영수증을 달라는 말은, 이번에는 하지 않습니다.", "날짜를 모으면 31명이 매달 이 가게에 왔다는 기록이 생깁니다. 떡값이 증거가 된다는 말에 문가을이 떨떠름한 얼굴을 합니다.", "셔터가 내려가면 오늘은 끝납니다. 장부의 마지막 줄은 내일도 그대로 '31'입니다."],
    },
    c47_factory: {
      voice: ["흑자를 31명 몫으로 먼저 떼자는, 김 반장 편을 든다.", "조합 규약대로, 무기명 투표로 정하게 한다.", "흑자는 밀린 월급에 쓰고, 31명은 배상에 맡기자고 한다."],
      echo: ["편을 들면 조합원 한 명이 한숨을 쉬고 손을 듭니다. '찬성. 대신 제 월급은 내년 흑자로 주세요.'", "투표는 3대 2로 끝납니다. 결과가 읽히자 진 쪽 두 사람이 먼저 박수를 칩니다.", "월급이 들어오면 조합원들의 추석이 따뜻해집니다. 김 반장은 수첩을 조용히 서랍에 다시 넣습니다."],
    },
    c47_memorial: {
      voice: ["남은 서른한 이름 옆에, 오늘 찾은 단서를 하나씩 적어 준다.", "도윤하의 수첩을, 원고 측 증거 목록에 정식으로 올린다.", "오늘은 수첩을 덮고, 181명 입금부터 기뻐하자고 한다."],
      echo: ["단서를 적으면 '확인 불가' 자리에 '구내식당 12년', '작업복 세탁 8년'이 들어갑니다. 도윤하가 처음으로 볼펜을 끝까지 누릅니다.", "목록에 오른 수첩은 그룹 변호인단도 읽습니다. 쓰러진 날짜가 적힌 뒷장까지 복사됩니다.", "181명의 입금은 진짜 기쁜 일입니다. 서른한 이름은 오늘도 줄 없이 남습니다."],
    },
  },
  reactionScenes: [
    ["c47_ledger_reaction", "c47_ledger", "c47_factory", "밥 해 주던 사람들", "문가을", "문가을이 칼을 내려놓고 셔터 밖을 봅니다. 시장 골목 위로 거의 둥근 달이 떠 있습니다. '그 서른한 명요, 우리 남편이 외상 달아 놓은 사람들이에요. 남희원 언니는 공장 밥을 해 줬고, 세탁소 사장님은 작업복을 빨아 줬고, 퀵 기사 셋은 새벽마다 부품을 날라 줬어요. 대출 서류에 있을 리가 없죠. 남편이 갚기로 한 사람들인데.' 그가 장부의 그 줄을 손톱으로 긁습니다. '남편은 못 갚고 갔어요. 그래서 제가 떡으로 갚는 중이에요. 이자는 없고요.'", ["31명 이름을 한 사람씩 문가을에게 듣고 받아 적는다", "남편이 진 빚을 그룹의 배상 책임으로 다시 적자고 한다", "오늘은 셔터를 같이 내리고 내일 이야기하자고 한다"]],
    ["c47_banner_reaction", "c47_banner", "c47_memorial", "식당부터", "강태민", "잔치가 끝난 선반 앞, 강태민이 종이컵에 보리차를 따라 김 반장에게 건넵니다. 김 반장이 수첩 마지막 장을 한참 봅니다. '공장 문 닫기 한 달 전에 사장님이 그랬어요. 추석 전에는 식당 외상부터 갚자고. 우리 밥 해 주던 사람이 명절에 빈손이면 안 된다고.' 그가 웃는데 눈가가 붉습니다. '그해 추석이 오기 전에 공장이 멈췄어요.' 강태민이 한참 있다가 짧게 말합니다. '그럼 올해 추석에 갚으면 되네요.' 김 반장이 컵을 내려놓습니다. '그게 되면 좋겠어요. 근데 그 사람들, 서류가 없대요.'", ["올해 추석 안에 식당 외상부터 갚게 하겠다고 약속한다", "수첩을 문성호의 자필 기록으로 확인받을 방법부터 찾는다", "약속은 미루고 오늘 밤은 잔치를 마무리하자고 한다"]],
    ["c47_count_reaction", "c47_count", "c47_final", "받을 수 있어요?", "문하준", "돌아오는 지하철 1호선, 문하준이 스케치북을 펴고 무언가를 그립니다. 송편 서른한 개가 담긴 접시입니다. 송편마다 작은 글씨로 별명이 붙어 있습니다. '고등어 두 토막', '빨간 오토바이', '다림질 할아버지'. 하준이 연필을 멈춥니다. '제가 나중에 은행원 되면요, 이런 사람들도 받을 수 있어요? 서류 없는 사람들요. 노아는 안 된다고 할 거잖아요.' 옆자리 문가을은 수첩을 무릎에 올린 채 졸고 있습니다. 하준이 목소리를 낮춥니다. '엄마가 아빠 빚을 떡으로 갚는 거, 저 알아요. 엄마는 제가 모르는 줄 알아요.'", ["하준에게 그 사람들을 받을 방법을 같이 찾자고 한다", "서류 없는 사람을 셀 수 있는 규칙이 있어야 한다고 설명한다", "오늘은 합격한 날이니 은행 이야기는 그만하자고 한다"]],
  ],
  reactionEffects: {
    c47_ledger: [
      { trust: 9, humanCost: -5, time: -4, capital: -1, fatigue: 3 },
      { legitimacy: 9, trust: 2, capital: -3, time: -3, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 2, trust: 2, humanCost: 3, fatigue: -4 },
    ],
    c47_banner: [
      { trust: 10, humanCost: -5, legitimacy: -2, time: -3, fatigue: 5 },
      { legitimacy: 10, trust: 3, capital: -3, time: -4, fatigue: 3 },
      { time: 4, capital: 3, trust: -3, humanCost: 3, fatigue: -4 },
    ],
    c47_count: [
      { trust: 8, humanCost: -4, time: -2, fatigue: 3 },
      { legitimacy: 8, trust: 4, time: -3, humanCost: 1, fatigue: 2 },
      { time: 3, capital: 2, trust: 2, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c47_ledger: {
      voice: ["31명 이름을 한 사람씩, 문가을에게 듣고 받아 적는다.", "남편이 진 빚을, 그룹의 배상 책임으로 다시 적자고 한다.", "오늘은 셔터를 같이 내리고, 내일 이야기하자고 한다."],
      echo: ["받아 적으면 서른한 명이 저마다 별명을 달고 나옵니다. '고등어 두 토막 언니', '빨간 오토바이'. 새벽 한 시가 넘습니다.", "다시 적자는 말에 문가을이 고개를 젓다가 멈춥니다. '남편 빚이 남편 잘못만은 아니라는 거죠? 그 말, 처음 들어요.'", "셔터가 내려가고 둘이 골목에 섭니다. 달은 내일 조금 더 둥글어지고, 마감은 하루 가까워집니다."],
    },
    c47_banner: {
      voice: ["올해 추석 안에, 식당 외상부터 갚게 하겠다고 약속한다.", "수첩을 문성호의 자필 기록으로, 확인받을 방법부터 찾는다.", "약속은 미루고, 오늘 밤은 잔치를 마무리하자고 한다."],
      echo: ["약속하면 김 반장이 수첩을 당신 손에 쥐여 줍니다. 추석까지 남은 날은 이틀입니다.", "방법을 찾으면 선재윤이 필적 감정 이야기를 꺼냅니다. 열흘이 걸린다고 합니다. 마감은 모레입니다.", "잔치는 따뜻하게 끝납니다. 수첩은 서랍으로 돌아가고, 마지막 장의 약속은 올해도 날짜를 넘깁니다."],
    },
    c47_count: {
      voice: ["하준에게, 그 사람들을 받을 방법을 같이 찾자고 한다.", "서류 없는 사람을 셀 수 있는 규칙이, 있어야 한다고 설명한다.", "오늘은 합격한 날이니, 은행 이야기는 그만하자고 한다."],
      echo: ["같이 찾자고 하면 하준이 스케치북 새 장에 '방법'이라고 적고 밑줄을 두 번 긋습니다. 면접 준비보다 열심입니다.", "규칙 이야기를 들은 하준이 고개를 끄덕이다 묻습니다. '그 규칙은 누가 만들어요?' 대답하기 전에 지하철이 역에 섭니다.", "하준이 스케치북을 덮습니다. 송편 서른한 개는 접힌 종이 안에서 오늘 하루를 보냅니다."],
    },
  },
  reactionMemos: {
    c47_ledger_reaction: ["외상으로 공장을 먹이고 입히고 날라 준 사람들", "이자 없는 떡값 갚기"],
    c47_banner_reaction: ["공장 문 닫기 한 달 전의 약속: 식당부터", "서류 없는 사람들의 외상"],
    c47_count_reaction: ["송편 서른한 개의 별명", "엄마가 떡으로 갚는 빚"],
  },
  branchPlan: ["c47_steam", 1, "c47_branch_screen", "c47_branch_screen_follow"],
  branchScenes: {
    // CASE 47's detour is the bank counter. The case argues over thirty-one
    // people nobody can find on paper; the side door is the screen that decided
    // they were not there, and the one ledger that remembers them anyway.
    c47_branch_screen: {
      phase: "SIDE DOOR",
      title: "0.3초씩 서른한 번",
      speaker: "탁예린",
      text: "이의 신청서 양식을 받으러 강서지점에 들르자 탁예린 대리가 기업대출 창구 모니터를 돌려 보입니다. 2차 배상 기준의 1차 선별도 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아가 맡았습니다. 212건 중 31건이 0.3초씩, 모두 같은 사유로 떨어졌습니다. '전산 거래 이력 없음.' 탁예린이 화면을 짚습니다. '외상은 전산에 안 남아요. 구내식당 밥값을 계좌로 꼬박꼬박 받는 사장님은 없거든요. 노아는 이 사람들을 없는 사람이라고 판단한 게 아니에요. 보이지 않는 사람을 셀 줄 모르는 거예요.' 창구 너머 번호표 기계 옆에는 지난겨울 문하준이 붙여 둔 손글씨 배치도가 아직 있습니다.",
      memo: ["2차 기준 1차 선별: 노아", "31건 판정 시간 각 0.3초", "사유: 전산 거래 이력 없음", "번호표 기계 옆 문하준의 배치도"],
      triggers: ["system", "injustice", "curiosity"],
      choices: [
        { id: "c47_branch_screen_review", label: "탁예린과 31건을 사람이 다시 보는 재검토 요청서를 쓴다", effect: { trust: 8, legitimacy: 7, time: -5, capital: -3, fatigue: 5 }, next: "c47_branch_screen_follow", cognition: { reframing: 2 } },
        { id: "c47_branch_screen_rule", label: "노아의 '확인 불가' 판정 규칙을 공개하라고 정식 요청한다", effect: { legitimacy: 11, time: -5, trust: 1, humanCost: 3, fatigue: 5 }, next: "c47_branch_screen_follow", cognition: { inference: 2 } },
        { id: "c47_branch_screen_skip", label: "판정은 그대로 두고 181명 입금 일정부터 확인한다", effect: { time: 5, capital: 6, trust: -4, humanCost: 4, fatigue: -3 }, next: "c47_branch_screen_follow", cognition: { risk: 1 } },
      ],
    },
    c47_branch_screen_follow: {
      phase: "SIDE DOOR",
      title: "식대 입금 기록",
      speaker: "탁예린",
      text: "탁예린이 한참 자판을 두드리다 손을 멈춥니다. 남희원은 12년 전 이 지점에서 적금을 하나 열었습니다. 그 계좌에 가온정밀 이름으로 매달 식대가 들어왔습니다. 적은 달은 180만 원, 많은 달은 260만 원. 그러다 부도 넉 달 전부터 입금이 멈춥니다. 외상이 시작된 날짜가 은행 전산에 거꾸로 찍혀 있는 셈입니다. 탁예린이 목소리를 낮춥니다. '이건 우리 은행 기록이라 조회는 할 수 있어요. 근데 조정 자료로 내려면 고객 동의가 있어야 하고, 31명 전원을 이렇게 찾으려면 지점장님 서명이 필요해요.' 지점장실 문틈으로 서태경 지점장이 추석 선물 상자를 정리하는 모습이 보입니다.",
      memo: ["남희원 적금 계좌: 가온정밀 식대 매달 입금", "부도 넉 달 전 입금 중단", "조정 자료 제출: 고객 동의 필요", "31명 전원 조회: 지점장 서명 필요"],
      triggers: ["trust", "order", "responsibility"],
      choices: [
        { id: "c47_branch_screen_follow_consent", label: "입금 기록을 남희원에게 먼저 보여 주고 동의를 받는다", effect: { trust: 11, humanCost: -5, time: -4, legitimacy: 2, fatigue: 4 }, next: "c47_ledger", cognition: { persistence: 2 } },
        { id: "c47_branch_screen_follow_all", label: "31명 전원의 입금 기록을 찾도록 지점장 서명을 받아 낸다", effect: { legitimacy: 12, trust: 5, time: -5, humanCost: 3, fatigue: 5 }, next: "c47_ledger", cognition: { inference: 2 } },
        { id: "c47_branch_screen_follow_one", label: "남희원 한 건만 먼저 인정받고 나머지는 나중에 찾는다", effect: { capital: 6, time: 5, trust: -3, legitimacy: 2, humanCost: 4, fatigue: -3 }, next: "c47_ledger", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c47_start",
    result: "c47_aftershock",
    defaultFree: "c47_route_system",
    // One standard, thirty-one people. Like 사건 12 a year ago the case is a
    // single line; the split is whether the standard learns to count people who
    // were only ever written down by hand.
    choices: {},
    system: {
      route: "c47_route_system",
      final: "c47_final_system_route",
      title: "이웃 두 사람",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자, 떡방 구석 테이블에 놓인 노트북에서 에코가 대답합니다. 돌아온 뒤 처음 맡은 계산입니다. 지난 20년 국내 피해 배상 기준 64건 가운데 서류 없는 피해자를 넣은 기준은 7건이었습니다. 7건 모두 인우보증(이웃이나 동료 두 사람이 그 사실을 보증해 주는 방식)을 받았고, 나중에 거짓으로 밝혀진 보증은 한 건도 없었습니다. 나머지 57건에서 '확인 불가'로 빠진 사람은 1만 2천여 명입니다. '제게 싫어하는 기능이 있다면 이 출력값에 쓰겠습니다. 확인 불가는 계산을 끝낸 자리가 아니라, 계산을 그만둔 자리에 붙는 이름입니다.' 노트북 옆에는 문가을이 '걔 몫'이라며 놓아 둔 송편 한 접시가 있고, 찜기에서 올라온 김에 화면이 흐려집니다.",
      memo: ["배상 기준 64건 중 서류 없는 피해자 포함 7건", "7건 모두 인우보증 -- 거짓 보증 0건", "'확인 불가'로 빠진 사람 1만 2천여 명"],
      routeChoices: [
        ["c47_route_system_share", "통계를 조정 재판부와 원고 단체방에 같이 올린다", { legitimacy: 10, trust: 7, capital: -5, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c47_route_system_vouch", "31명마다 보증해 줄 이웃 두 사람을 오늘 안에 찾는다", { trust: 9, humanCost: -4, legitimacy: 4, time: -8, fatigue: 7 }, { persistence: 2 }],
        ["c47_route_system_skip", "통계는 접어 두고 조정 일정대로 간다", { time: 7, capital: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "서류 대신 이웃 두 사람의 보증으로도 피해를 인정하는 조항을 넣는다", { legitimacy: 12, trust: 8, capital: -7, time: -6, fatigue: 7 }, { reframing: 3 }],
      ["b", "조항은 그대로 두고 31명의 위로금 액수만 올린다", { capital: 8, time: 7, trust: -5, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "남는 배상 재원으로 서류 없는 피해자 기금을 따로 만든다", { legitimacy: 7, trust: 10, capital: -8, time: -5, humanCost: -3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c47_evidence_turn",
    result: "c47_aftershock",
    sourceRoutes: ["c47_steam", "c47_factory", "c47_memorial", "c47_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 2차 배상 재원 옆에 놓고, 31명에게 줄 돈이 정말 없는지 맞춰 본다.",
    entryEcho: "단서를 대면 돈이 없어서 빠진 게 아니라는 게 보입니다. 그 돈이 어디로 가는지도 함께 보입니다.",
    title: "남는 돈",
    speaker: "권도현",
    text: "단서를 맞추자 2차 배상 재원(배상에 쓰려고 따로 마련해 둔 돈)이 어떻게 짜였는지 열립니다. 재원은 140억, 181명에게 나갈 돈은 118억입니다. 남는 22억은 '미집행 잔액'으로 연말에 그룹 사회공헌재단으로 넘어가고, 재단의 내년 사업 계획서 첫 줄에 쓰일 곳이 적혀 있습니다. '한가위 나눔 캠페인 -- 텔레비전 광고.' 31명의 청구액을 다 더하면 6억 2천만 원입니다. 권도현이 계산기를 내려놓습니다. '31명 몫을 다 주고도 15억 8천이 남습니다. 추석에 나눔 광고를 찍을 돈으로, 추석에 나눌 사람을 뺐어요. 이건 적자도 흑자도 아닙니다. 그냥 틀린 계산입니다.'",
    memo: ["2차 배상 재원 140억 -- 181명 118억", "미집행 잔액 22억: 사회공헌재단 '한가위 나눔' 광고", "31명 청구액 합계 6억 2천만 원"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 7, trust: 4, time: -2, fatigue: 5 },
    choices: [
      ["c47_evidence_turn_demand", "남는 22억에서 31명 몫을 먼저 떼기 전에는 동의하지 않는다", { legitimacy: 13, trust: 6, capital: -7, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c47_evidence_turn_hold", "잔액 문서는 쥐고 있다가 조정이 틀어질 때 꺼낸다", { capital: 9, time: 4, trust: -5, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c47_evidence_turn_share", "181명과 31명 모두에게 남는 돈의 행방을 먼저 알린다", { trust: 12, legitimacy: 5, capital: -6, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c47_branch_screen",
    systemNext: "c47_route_system",
    evidenceNext: "c47_evidence_turn",
    routeLabel: "직전 사건에서 되살린 판단 기록을 들고 31명의 판정 화면을 연다",
    systemLabel: "직전 자유응답 문장을 돌아온 에코가 기억하는지 본다",
    evidenceLabel: "직전 단서를 붙여 2차 배상 재원에서 남는 돈을 찾는다",
  },
  openingRoutes: {
    c46_after_warm: "c47_start_warm",
    c46_after_record: "c47_start_record",
    c46_after_rush: "c47_start_rush",
  },
  openingCopy: {
    c47_start_warm: ["곁에 남았던 사람의 추석", "이민서", "파쇄 트럭이 떠난 그 밤, 헌책방 1층에서 이민서 곁에 남아 새벽까지 에코 이야기를 들었습니다. 그사이 떡방 단체방에는 추석 대목에 가겠다는 답이 열한 개 올라왔습니다. 나흘 뒤 아침 7시 40분, 문가을이 한 줄을 더 보냅니다. '말로 하지 말고 와서 떡이나 쪄요. 올해는 찜기가 여섯 대예요.' 바로 아래에 선재윤이 집단소송(피해자 여럿이 함께 내는 소송)의 2차 배상 기준안을 올립니다. 서류 없는 212명 중 181명은 연휴 안에 입금되고, 31명에게는 '확인 불가'가 찍혔습니다. 동의 마감은 추석 전날 18시. 이민서가 답합니다. '에코한테 물어봤는데요. 확인 불가는 판단이 아니래요. 판단을 안 했다는 뜻이래요. 아, 에코도 떡방 가요. 노트북에 담아서.'", ["떡방 단체방: 추석 대목 참석 답 11개", "2차 기준안: 181명 확인, 31명 '확인 불가'", "동의 마감 추석 전날 18시"]],
    c47_start_record: ["읽는 법을 남긴 사람의 추석", "반재욱", "에코의 재계산과 점 318개를 열네 쪽 보고서로 쓴 지 나흘. 마지막 쪽 제목은 '빈칸 옆의 점을 읽는 법'이었습니다. 반재욱이 그 보고서를 수첩 사이에 끼운 채 아침 7시에 전화합니다. 선재윤이 집단소송(피해자 여럿이 함께 내는 소송)의 2차 배상 기준안을 보냈답니다. 서류 없는 212명 중 181명은 확인, 31명은 '확인 불가'. 동의 마감은 추석 전날 18시입니다. 반재욱이 한 번 더 읽습니다. '31명 판정 이유 칸이 전부 비어 있어요. 보고서에 쓴 그 모양 그대로요. 이번엔 누가 비워 뒀는지부터 물어야겠습니다.' 전화를 끊자마자 문가을의 문자가 옵니다. '말로 하지 말고 와서 떡이나 쪄요. 올해는 찜기가 여섯 대예요.'", ["열네 쪽 보고서 제출 나흘째", "2차 기준안: 31명 판정 이유 칸 공란", "동의 마감 추석 전날 18시"]],
    c47_start_rush: ["먼저 달려간 사람의 추석", "오진우", "점이 찍힌 파일 목록을 그 밤 검찰청 로비에서 나은호 검사에게 넘겼고, 그 뒤 나흘은 참고 자료 정리와 연휴 전 서류로 지나갔습니다. 헌책방 1층에는 당신 몫의 떡 약속만 남았습니다. 오늘 아침 7시 40분, 오진우가 KD캐피탈 사무실 문을 두드립니다. 손에 떡 상자 대신 출력물이 들려 있습니다. 집단소송(피해자 여럿이 함께 내는 소송)의 2차 배상 기준안입니다. 서류 없는 212명 중 181명은 연휴 안에 입금, 31명은 '확인 불가'. 동의 마감은 추석 전날 18시입니다. 오진우가 휴대폰을 내밉니다. 문가을이 단체방에 새로 올린 문자입니다. '말로 하지 말고 와서 떡이나 쪄요. 올해는 찜기가 여섯 대예요.' 답하지 않은 사람은 당신 하나입니다. '다들 가 있어요. 당신 앞치마만 못에 걸려 있대요.'", ["검찰에 넘긴 파일 목록 -- 나흘째 참고 자료 정리", "떡방 단체방: 답하지 않은 사람 1명", "2차 기준안: 31명 '확인 불가'"]],
  },
  openingSignatures: {
    c47_start_warm: {
      label: "단체방 사람들과 다 같이 새벽 떡방 앞에 모인다",
      effect: { trust: 12, humanCost: -4, capital: -4, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "단체방 사람들과, 다 같이 새벽 떡방 앞에 모인다.",
      echo: "여섯 시에 모이자고 했는데 강태민은 다섯 시에 와 있습니다. 문가을은 셔터를 올리며 '일당은 없어요'라고 먼저 말합니다.",
    },
    c47_start_record: {
      label: "31명 판정의 이유 칸을 채워 달라고 서면으로 요구한다",
      effect: { legitimacy: 12, trust: -1, capital: -4, time: -5, fatigue: 5 },
      cognition: { inference: 2 },
      voice: "31명 판정의 이유 칸을, 채워 달라고 서면으로 요구한다.",
      echo: "서면은 연서준의 사무실에 도착합니다. 답은 연휴 뒤에 보내겠다는 자동 회신이고, 마감은 연휴 전입니다. 반재욱이 회신 시각을 수첩에 적습니다.",
    },
    c47_start_rush: {
      label: "남은 서류를 오진우에게 나눠 주고 떡방으로 곧장 간다",
      effect: { trust: 9, legitimacy: 4, humanCost: 3, time: -6, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "남은 서류를 오진우에게 나눠 주고, 떡방으로 곧장 간다.",
      echo: "오진우가 서류 더미를 받아 들고 한숨을 쉽니다. '은행 총각 소리 듣는 것보다는 낫죠.' 떡방에 도착하면 앞치마에 먼지가 앉아 있습니다.",
    },
  },
  voiceLines: {
    // CASE 47. The same 추석, one year on. Every line is said in a kitchen full
    // of steam to people who have been waiting a year, so none of them may
    // sound like a filing.
    c47_start_names: "떡집 문을 열기 전에, 31명의 이름부터 문가을과 같이 본다.",
    c47_start_criteria: "'확인 불가'를 가른 판정 기준부터, 한 줄씩 읽는다.",
    c47_start_first: "181명의 연휴 안 입금부터 확정하고, 31명은 뒤로 미룬다.",
    c47_steam_dry: "남희원의 젖은 장부를, 찜기 옆에서 한 장씩 말리며 같이 읽는다.",
    c47_steam_appeal: "31명의 '확인 불가' 판정마다, 이의 신청서를 쓴다.",
    c47_steam_orders: "대목 주문부터 끝내고, 31명 이야기는 저녁으로 미룬다.",
    c47_branch_screen_review: "탁예린과 함께, 31건을 사람이 다시 보는 재검토 요청서를 쓴다.",
    c47_branch_screen_rule: "노아의 '확인 불가' 판정 규칙을, 공개하라고 정식 요청한다.",
    c47_branch_screen_skip: "판정은 그대로 두고, 181명 입금 일정부터 확인한다.",
    c47_branch_screen_follow_consent: "입금 기록을 남희원에게 먼저 보여 주고, 동의를 받는다.",
    c47_branch_screen_follow_all: "31명 전원의 입금 기록을 찾도록, 지점장 서명을 받아 낸다.",
    c47_branch_screen_follow_one: "남희원 한 건만 먼저 인정받고, 나머지는 나중에 찾는다.",
    c47_factory_family: "수첩은 문가을에게 먼저 가져가, 가족이 정하게 한다.",
    c47_factory_match: "수첩의 서른한 줄을, 31명 명단과 한 줄씩 맞춰 본다.",
    c47_factory_send: "수첩 사진부터 찍어, 연서준에게 보내 협상 카드로 쓴다.",
    c47_memorial_wait: "문가을이 정할 때까지, 봉안당 벤치에 함께 앉아 기다린다.",
    c47_memorial_cover: "혼잣말은 가리고, 서른한 줄만 옮겨 증거로 낸다.",
    c47_memorial_son: "하준의 합격을 먼저 축하하고, 수첩 이야기는 저녁으로 미룬다.",
    c47_final_hold: "수첩과 이웃 보증으로 31명을 넣을 때까지, 동의하지 않는다.",
    c47_final_split: "181명은 오늘 동의하고, 31명은 법원에 따로 입증을 신청한다.",
    c47_final_settle: "31명에게 위로금을 받게 하고, 오늘 2차 기준을 모두 끝낸다.",
    c47_after_warm: "보름달이 질 때까지, 옥상에 남아 모두와 송편을 빚는다.",
    c47_after_record: "서른한 명의 이야기와 증거를, 배상 기준 개정 요청서로 남긴다.",
    c47_after_rush: "송편 봉지를 챙겨 먼저 내려가, 심사위원회 준비에 들어간다.",
    c47_route_system_share: "통계를, 조정 재판부와 원고 단체방에 같이 올린다.",
    c47_route_system_vouch: "31명마다 보증해 줄 이웃 두 사람을, 오늘 안에 찾는다.",
    c47_route_system_skip: "통계는 접어 두고, 조정 일정대로 간다.",
    c47_final_system_route_a: "서류 대신 이웃 두 사람의 보증으로도, 피해를 인정하는 조항을 넣는다.",
    c47_final_system_route_b: "조항은 그대로 두고, 31명의 위로금 액수만 올린다.",
    c47_final_system_route_c: "남는 배상 재원으로, 서류 없는 피해자 기금을 따로 만든다.",
    c47_evidence_turn_demand: "남는 22억에서 31명 몫을 먼저 떼기 전에는, 동의하지 않는다.",
    c47_evidence_turn_hold: "잔액 문서는 쥐고 있다가, 조정이 틀어질 때 꺼낸다.",
    c47_evidence_turn_share: "181명과 31명 모두에게, 남는 돈의 행방을 먼저 알린다.",
  },
  echoReplies: {
    // CASE 47.
    c47_start_names: "이름을 같이 보면 문가을이 서른한 명 중 스물여섯 명의 얼굴을 떠올립니다. 나머지 다섯 명은 떡을 사러 온 적이 없습니다.",
    c47_start_criteria: "기준을 읽으면 '확인 불가'의 정의가 한 줄뿐이라는 게 드러납니다. '전산 기록 없음.' 그 한 줄을 뒤집는 데 오전이 다 갑니다.",
    c47_start_first: "181명의 입금은 확정됩니다. 31명은 이번에도 '다음 차례'가 되고, 마감 시계는 그대로 돕니다.",
    c47_steam_dry: "장부를 말리면 번진 일곱 장 중 다섯 장이 다시 읽힙니다. 찜기 옆 송편 한 판이 타고, 강태민이 말없이 새 판을 올립니다.",
    c47_steam_appeal: "서른한 장을 쓰는 동안 대목 주문이 밀립니다. 이의 신청서는 연휴 뒤에나 읽힙니다.",
    c47_steam_orders: "주문은 제시간에 나갑니다. 남희원은 장부를 무릎에 올린 채 저녁까지 기다립니다.",
    c47_branch_screen_review: "요청서가 들어가면 31건이 처음으로 사람의 책상에 오릅니다. 어느 책상인지, 연휴에 누가 앉아 있을지는 모릅니다.",
    c47_branch_screen_rule: "공개 요청은 기록에 남습니다. 답변 기한은 30일이고, 마감은 사흘 뒤입니다.",
    c47_branch_screen_skip: "181명의 입금 일정표가 깔끔하게 나옵니다. 모니터 구석의 31건은 '종결'로 바뀝니다.",
    c47_branch_screen_follow_consent: "남희원이 화면을 한참 보다 말합니다. '내가 12년을 밥 한 거, 은행이 알고 있었네.' 동의서에 이름을 또박또박 씁니다.",
    c47_branch_screen_follow_all: "서태경 지점장이 선물 상자를 내려놓고 서명합니다. 서른한 명 중 열아홉 명의 계좌가 나옵니다. 열두 명은 이 은행에 계좌가 없습니다.",
    c47_branch_screen_follow_one: "남희원 한 건은 빨라집니다. 나머지 서른 명은 '나중'이라는 칸으로 옮겨집니다.",
    c47_factory_family: "수첩을 받은 문가을이 한참 표지만 봅니다. 열어 보는 데 하루가 걸리고, 그 하루만큼 마감이 가까워집니다.",
    c47_factory_match: "맞춰 보면 서른한 줄이 서른한 명과 하나도 어긋나지 않습니다. 금액까지 남희원의 장부와 같습니다.",
    c47_factory_send: "사진은 5분 만에 도착합니다. 연서준의 답은 한 줄입니다. '검토하겠습니다.' 문가을은 사진이 먼저 간 걸 저녁에야 압니다.",
    c47_memorial_wait: "기다리면 문가을이 한 시간 뒤에 입을 엽니다. '내요. 남편은 창피해도, 그 사람들은 받아야 하니까.'",
    c47_memorial_cover: "가린 수첩은 서류가 됩니다. 문가을은 가린 부분을 집에서 혼자 다시 읽겠다고 합니다.",
    c47_memorial_son: "하준이 합격 문자를 봉안당 방명록에 옮겨 적습니다. 문가을은 수첩을 가방 제일 안쪽으로 다시 넣습니다.",
    c47_final_hold: "버티면 연서준이 휴회를 요청합니다. 181명의 입금은 연휴를 넘기고, 단체방에 '괜찮아요, 기다릴게요'가 백 개 넘게 올라옵니다. 그렇지 않은 메시지도 있습니다.",
    c47_final_split: "둘로 나누면 181명은 추석을 쇠고 31명은 법원으로 갑니다. 남희원이 장부를 선재윤에게 건네며 '이번엔 안 젖게 해 줘요'라고 합니다.",
    c47_final_settle: "위로금은 연휴 안에 들어옵니다. 31명은 300만 원과 함께 '확인 불가'를 그대로 받고, 다시는 이 일로 소송할 수 없습니다.",
    c47_after_warm: "달이 질 때까지 옥상에 열한 명이 남고, 셔터는 새벽까지 반만 내려가 있습니다. 공지 속 한 줄짜리 안건은 아침까지 아무도 검색하지 않습니다.",
    c47_after_record: "요청서가 된 서른한 명의 이야기는 사람이 바뀌어도 남습니다. 문가을이 맨 끝에 서명하며 '이번엔 끝까지네요'라고 합니다.",
    c47_after_rush: "옥상을 먼저 내려오면 문가을이 계단 위에서 송편 봉지를 던져 줍니다. 파일은 아직 오지 않았는데, 위원 명단의 당신 이름은 이미 인쇄돼 있습니다.",
    c47_route_system_share: "재판부와 단체방이 같은 숫자를 봅니다. 연서준은 '참고하겠습니다'라고 하고, 단체방은 '거짓 보증 0건'에 밑줄을 긋습니다.",
    c47_route_system_vouch: "시장 골목을 돌면 보증인이 예순두 명보다 많이 모입니다. 남희원에게는 열한 명이 줄을 섭니다. 해가 집니다.",
    c47_route_system_skip: "조정은 예정대로 갑니다. 에코는 화면을 끄기 전에 한 줄을 남깁니다. '계산 중단 1건 추가.'",
    c47_final_system_route_a: "조항이 들어가면 서류가 아니라 이웃이 증거가 됩니다. 그룹 측은 거짓 보증이 늘 거라고 반대하고, 에코는 0이라는 숫자를 다시 띄웁니다.",
    c47_final_system_route_b: "위로금은 두 배가 됩니다. '확인 불가'라는 네 글자는 한 글자도 바뀌지 않습니다.",
    c47_final_system_route_c: "기금이 생기면 31명 다음에 올 사람들의 자리도 생깁니다. 그 기금을 누가 관리할지 정하는 데 석 달이 걸립니다.",
    c47_evidence_turn_demand: "버티면 연서준이 처음으로 재단 담당자에게 전화를 겁니다. 광고 촬영 일정표가 회의실 테이블에 올라옵니다.",
    c47_evidence_turn_hold: "문서는 당신 가방 안에서 안전합니다. 31명은 그 문서가 있다는 걸 모른 채 마감을 맞습니다.",
    c47_evidence_turn_share: "알리면 181명의 단체방이 먼저 들끓습니다. '우리 돈 받고 남는 걸로 광고를 찍는다고요?' 누군가 31명 몫을 먼저 떼라는 연명서를 올립니다.",
  },
  characterProfiles: {
    남희원: {
      role: "가온정밀 전 구내식당 사장 · 서류 없는 31명 중 한 사람",
      stance: "생계 · 자존심 · 기억",
      job: "대출 서류가 아니라 밥값 장부로 공장과 이어져 있던 사람들을 대표한다. 은행이 셀 줄 모르는 피해가 어떤 모양인지 보여 준다.",
      appearance: "비닐에 싼 외상 장부, 손등의 오래된 기름 화상 자국, 공장 식당 시절부터 쓰던 꽃무늬 토시.",
      thought: "돈보다 이름이 먼저다. 12년 동안 공장 사람들을 먹인 사람을 없는 사람 취급할 수는 없다.",
      gesture: "남희원은 억울한 말을 할 때 장부 모서리를 손바닥으로 편다. 번진 글씨를 펴면 다시 읽힐 것처럼.",
      voice: "밥은 먹었냐는 말로 대화를 시작하고, 숫자는 원 단위까지 외워서 말한다.",
      line: "작년엔 떡 사러 왔고, 올해는 이름 찾으러 왔어요.",
    },
  },
  setting: { place: "KD캐피탈 위험관리부 · 창가 자리", clock: "추석 사흘 전 · 07:40" },
  sceneContext: {
    c47_start: {
      place: "KD캐피탈 위험관리부 · 창가 자리",
      clock: "추석 사흘 전 · 07:40",
      question: "181명은 연휴 안에 받고 31명에게는 '확인 불가'가 찍혔습니다. 무엇부터 하겠습니까?",
      lead: "추석 대목을 앞둔 아침, KD캐피탈 사무실 창가 자리에서 휴대폰이 두 번 연달아 울립니다.",
    },
    c47_start_warm: {
      place: "KD캐피탈 위험관리부 · 창가 자리",
      clock: "추석 사흘 전 · 07:40",
      question: "열한 명이 가겠다고 답한 단체방에 떡방 호출과 '확인 불가'가 나란히 올라왔습니다. 누구와 어디로 가겠습니까?",
      lead: "헌책방 1층에서 새벽까지 에코 이야기를 들은 지 나흘, 단체방 알림이 아침부터 멈추지 않습니다.",
    },
    c47_start_record: {
      place: "KD캐피탈 위험관리부 · 창가 자리",
      clock: "추석 사흘 전 · 07:00",
      question: "31명을 가른 판정의 이유 칸이 비어 있습니다. 그 빈칸을 어떻게 다루겠습니까?",
      lead: "'빈칸 옆의 점을 읽는 법'을 보고서로 넘긴 지 나흘, 반재욱의 전화가 아침 7시에 옵니다.",
    },
    c47_start_rush: {
      place: "KD캐피탈 위험관리부 · 창가 자리",
      clock: "추석 사흘 전 · 07:40",
      question: "떡방 단체방에 답하지 않은 사람은 당신 하나입니다. 늦게 도착한 사람으로서 무엇부터 하겠습니까?",
      lead: "검찰청 로비에 다녀온 뒤 나흘을 서류 더미 사이에서 보냈습니다. 오진우가 사무실 문을 두드립니다.",
    },
    c47_route_system: {
      place: "망원시장 가을떡방 · 구석 테이블",
      clock: "추석 사흘 전 · 13시",
      question: "서류 없는 피해자를 넣은 기준은 모두 이웃 두 사람의 보증을 썼습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c47_steam: {
      place: "망원시장 가을떡방",
      clock: "추석 사흘 전 · 10시",
      question: "대목 한가운데서 젖은 장부를 든 사람이 이름을 찾으러 왔습니다. 무엇을 먼저 하겠습니까?",
      lead: "근무표에 당신 이름도 있습니다. 담당은 '설거지 및 잡일', 옆에 작게 '작년 성적 반영'이라고 적혀 있습니다.",
    },
    c47_branch_screen: {
      place: "KD은행 강서지점 · 기업대출 창구",
      clock: "추석 사흘 전 · 15시",
      question: "31건이 0.3초씩, '전산 거래 이력 없음'으로 떨어졌습니다. 이 판정을 어떻게 하겠습니까?",
    },
    c47_branch_screen_follow: {
      place: "KD은행 강서지점 · 객장",
      clock: "추석 사흘 전 · 16:30",
      question: "은행 전산이 외상이 시작된 날짜를 거꾸로 보여 줍니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c47_ledger: {
      place: "망원시장 가을떡방 · 계산대",
      clock: "추석 사흘 전 · 22시",
      question: "장부의 공짜 떡 칸 맨 아래에 '31'이라는 새 줄이 생겼습니다. 이 줄을 어떻게 하겠습니까?",
    },
    c47_ledger_reaction: {
      place: "망원시장 가을떡방 · 셔터 앞",
      clock: "추석 사흘 전 · 22:40",
      question: "31명은 남편이 외상을 달아 둔 사람들이고, 문가을은 그 빚을 떡으로 갚는 중입니다. 무엇이라 하겠습니까?",
    },
    c47_factory: {
      place: "인천 남동공단 끝까지정밀 · 공장",
      clock: "추석 이틀 전 · 14시",
      question: "첫 흑자 날, 문성호가 남긴 '갚을 곳' 수첩이 서랍에서 나왔습니다. 이 수첩을 어떻게 하겠습니까?",
      lead: "공장 정문에 '끝까지정밀 첫 흑자 잔치 -- 18시'라는 종이가 붙어 있고, 그 아래 누군가 볼펜으로 '떡 있음'이라고 적었습니다.",
    },
    c47_banner: {
      place: "인천 남동공단 끝까지정밀 · 공장 마당",
      clock: "추석 이틀 전 · 18시",
      question: "첫 흑자 412만 원을 어디에 쓸지 선반 앞 총회가 묻습니다. 어느 쪽에 서겠습니까?",
    },
    c47_banner_reaction: {
      place: "인천 남동공단 끝까지정밀 · 선반 앞",
      clock: "추석 이틀 전 · 19시",
      question: "공장이 멈추기 한 달 전, 문성호는 식당 외상부터 갚자고 했습니다. 그 약속을 어떻게 하겠습니까?",
    },
    c47_memorial: {
      place: "인천 추모공원 · 봉안당",
      clock: "추석 전날 · 11시 · 2주기",
      question: "합격 문자와 '못 갚았다'는 혼잣말이 같은 날 유리문 앞에 놓였습니다. 수첩을 어떻게 하겠습니까?",
      lead: "추석 연휴 첫날 봉안당 복도는 붐빕니다. 작년처럼 교복 입은 뒷모습이 먼저 보이는데, 키가 한 뼘 자랐습니다.",
    },
    c47_count: {
      place: "인천 추모공원 · 벤치",
      clock: "추석 전날 · 12:30",
      question: "줄이 그어지지 않은 서른한 이름 옆에 무엇을 적을지 도윤하가 묻습니다. 어떻게 하겠습니까?",
    },
    c47_count_reaction: {
      place: "지하철 1호선 · 객실",
      clock: "추석 전날 · 14시",
      question: "은행원이 되면 서류 없는 사람도 받을 수 있냐고 문하준이 묻습니다. 무엇이라 답하겠습니까?",
    },
    c47_final_system_route: {
      place: "망원시장 가을떡방 · 구석 테이블",
      clock: "추석 전날 · 16시",
      question: "'확인 불가'라는 칸을 바꿀 수 있다면, 무엇으로 바꾸겠습니까?",
    },
    c47_evidence_turn: {
      place: "선재윤 법률사무소 · 자료실",
      clock: "추석 전날 · 15시",
      question: "31명 몫을 다 주고도 15억이 남고, 그 돈은 나눔 광고로 갑니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c47_final: {
      place: "망원시장 가을떡방",
      clock: "추석 전날 · 17시 · 동의 마감 18시",
      question: "31명 없이 끝내면 181명은 연휴 중에 받습니다. 남은 한 시간 동안 어떻게 하겠습니까?",
      lead: "마감 한 시간 전, 떡방 안에서 찜기 여섯 대가 한꺼번에 김을 뿜습니다. 셔터 밖에는 31명 중 열두 명이 와 있습니다.",
    },
    c47_aftershock: {
      place: "망원시장 가을떡방 · 옥상",
      clock: "추석 · 보름달 · 21시",
      question: "보름달 아래 끝내 못 한 말과 연휴 다음 날의 심사위원회 호출이 함께 왔습니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c47-remaining-fund",
    title: "남는 22억",
    text: "2차 배상 재원 140억 중 181명에게 118억이 나가고 22억이 남습니다. 그 돈은 '한가위 나눔' 광고로 갈 예정이었고, 31명의 청구액은 6억 2천만 원이었습니다.",
  },
  outcomes: {
    c47_after_warm: { tag: "달이 질 때까지 남은 결말", title: "추석 보름달 아래, 열한 명이 송편을 빚었다", text: "가을떡방 옥상에서 달이 질 때까지 모두와 송편을 빚었습니다. 문가을은 끝내 그 말을 다 하지 않았고, 대신 당신 몫의 송편을 가장 크게 빚었습니다." },
    c47_after_record: { tag: "기준을 다시 쓴 결말", title: "서른한 명의 이야기가 개정 요청서가 됐다", text: "수첩, 젖은 장부, 식대 입금 기록, 이웃들의 보증을 한 묶음으로 정리했습니다. '확인 불가' 자리에 처음으로 서른한 개의 문장이 들어갔습니다." },
    c47_after_rush: { tag: "먼저 내려간 결말", title: "송편 봉지를 주머니에 넣고 떡방을 먼저 나섰다", text: "보름달 아래 옥상을 먼저 내려왔습니다. 안건은 아직 '배송 플랫폼 운영자금' 한 줄뿐이었고, 3년 전 당신이 반대 의견을 쓴 서류도 그렇게 시작했습니다." },
  },
  carryovers: {
    c47_after_warm: { trust: 10, humanCost: -6, fatigue: -7 },
    c47_after_record: { legitimacy: 12, trust: 2, fatigue: 4 },
    c47_after_rush: { capital: 6, legitimacy: 5, trust: -7 },
  },
  continuityChallenges: {
    c46_after_warm: { id: "protect-trust", title: "헌책방의 밤을 떡방까지 잇기", text: "이민서 곁에 남았던 밤, 떡방에 가겠다는 답이 열한 개 올라왔습니다. 31명 앞에 혼자가 아니라 열한 명이 서는 선택을 찾아야 보너스가 열립니다." },
    c46_after_record: { id: "use-reframe", title: "비어 있는 판정 이유 칸 채우기", text: "'빈칸 옆의 점을 읽는 법'을 쓴 사람 앞에 이유 칸이 빈 판정 31건이 왔습니다. 그 빈칸을 사람의 문장으로 채울 판을 다시 짜야 합니다." },
    c46_after_rush: { id: "repair-legitimacy", title: "떡 약속만 남긴 사람의 공정함 회복하기", text: "떡 약속만 남겨 두고 검찰청으로 갔고, 단체방에 답하지 않은 사람은 당신 하나입니다. 늦게 온 사람이 31명 앞에서 믿음과 공정함을 되찾는 선택을 찾아야 합니다." },
  },
};
