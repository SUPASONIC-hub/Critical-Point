/**
 * CASE 29 -- the consulting-fee trail crosses a border.
 *
 * 사건 08 followed 해온파트너스's quarterly consulting fee from a dormant account
 * in 영동 to a gallery in 청담동, and 사건 12 found that not one won of it was
 * ever clawed back. The company was wound up. This case finds where the last of
 * its money went: eleven days before the wind-up a mailbox company opened in
 * Singapore, and three days before it 11억 4천 left for that mailbox.
 *
 * The analyst, now reviewing risk at KD캐피탈 under 윤상혁, is sent to
 * Singapore to sign off on a bulk sale of 4,270억 in bad loans to the private
 * fund 라운드힐 캐피탈. 서하린 is on the same flight, chasing the fee. The deal's
 * annex hires 윤상혁 as the buyer's "Asia advisor" for three years, paid to the
 * very mailbox, and the price was cut by exactly what the seat costs. The
 * analyst's risk opinion is the last condition precedent: this time the empty
 * signature box has the dissent-writer's name printed under it.
 *
 * Anger at a collection plan that calls the most reliable payers the first to
 * phone; laughter at a hawker centre where 오진우 loses to a level-five chili
 * crab and a grandmother at the next table; sorrow at 3 a.m. when 서하린 tells
 * the story of the source her prize-winning story cost his job; joy on the
 * last night, when 오진우 finishes a level-four crab and the source finally
 * writes back. The case closes on a group chat where 이민서 starts typing three
 * times and stops -- the message that opens 사건 30.
 */
export const case29Nodes = {
  c29_start: {
    phase: "CASE 29 BRIEFING",
    title: "같은 비행기",
    speaker: "서하린",
    text:
      "5월 넷째 주 화요일 아침 7시 40분, 인천공항 출국장. KD캐피탈 위험관리부로 옮긴 지 두 달 만의 첫 해외 출장입니다. 안건은 부실채권(돌려받기 어려워진 대출) 4,270억 원어치를 싱가포르의 사모펀드(큰손 몇몇의 돈을 모아 굴리는 투자 회사) 라운드힐 캐피탈에 넘기는 통매각(부실 자산을 한 묶음으로 한꺼번에 파는 것)입니다. 윤상혁 대표 이름으로 내려온 출장 명령서에는 '위험 검토 의견서 작성'이라고 적혀 있습니다. 체크인 줄 끝에서 누군가 캐리어로 당신 발을 칩니다. 나흘 전 전화로 '여권 있죠?'라고 묻던 서하린입니다. '해온파트너스 기억하죠. 분기마다 자문료(조언해 준 값이라며 받은 돈)를 받던 회사요. 청산(회사를 정리해 없애는 절차) 사흘 전에 남은 11억 4천이 싱가포르로 나갔어요.' 그가 탑승권으로 부채질을 합니다. '받은 회사 주소가 이번 매각 상대방 사무실에서 걸어서 7분이에요. 우연이면 기사 안 써요.'",
    memo: [
      "매각 대상: 부실채권 4,270억 -- 채무자 3,860명",
      "매수자: 라운드힐 캐피탈(싱가포르), 서명식 목요일 10시",
      "출장 명령: 위험 검토 의견서 작성, 승인자 윤상혁",
      "해온파트너스 청산 사흘 전 11억 4천 해외 송금",
    ],
    triggers: ["curiosity", "injustice", "responsibility"],
    choices: [
      {
        id: "c29_start_debtors",
        label: "묶음에 든 채무자 3,860명의 사정부터 따로 챙겨 간다",
        effect: { trust: 11, legitimacy: 1, humanCost: -5, time: -6, capital: -4, fatigue: 5 },
        next: "c29_marina",
        cognition: { persistence: 2 },
      },
      {
        id: "c29_start_mandate",
        label: "출장 명령서의 검토 범위부터 문서로 확인해 둔다",
        effect: { legitimacy: 11, time: -4, trust: -3, humanCost: 3, fatigue: 4 },
        next: "c29_marina",
        cognition: { inference: 2 },
      },
      {
        id: "c29_start_board",
        label: "탑승 전에 서하린의 자료부터 받아 기내에서 읽는다",
        effect: { capital: 9, time: 5, legitimacy: -6, trust: -2, humanCost: 3, fatigue: 1 },
        next: "c29_marina",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c29_marina",
      },
    ],
  },
  c29_marina: {
    phase: "ROOFTOP WELCOME",
    title: "급할수록 돌아가라",
    speaker: "조현석",
    text:
      "그날 밤 10시, 마리나 베이가 내려다보이는 57층 루프탑 바. 라운드힐 캐피탈 파트너 조현석이 직접 마중을 나왔습니다. 영어 이름은 에단, 뉴저지에서 나서 싱가포르에서만 12년을 일했습니다. 그가 레몬그라스 칵테일을 건네며 또박또박 한국어로 말합니다. '한국 속담에 급할수록 돌아가라, 하잖아요. 그러니까 우리 빨리 사인해요.' 아무도 웃지 않자 본인이 먼저 웃습니다. 그리고 태블릿을 켭니다. 매각가 1,310억, 회수율(빌려준 돈 가운데 돌려받는 비율) 30.7%. '저희는 부실을 청소하는 사람들이에요. 은행이 못 받는 돈을 사람답게 받아 드리죠.' 다음 화면은 추심(빌려준 돈을 받아 내는 일) 계획표입니다. 첫 달 목표 회수액 옆에 작은 글씨로 '연락 강도: 주 5회'라고 적혀 있습니다.",
    memo: [
      "매각가 1,310억 -- 장부상 4,270억의 30.7%",
      "추심 계획: 첫 달 연락 강도 주 5회",
      "조현석(에단 조): 라운드힐 파트너, 싱가포르 12년",
      "서명식까지 36시간",
    ],
    triggers: ["injustice", "manipulation", "protection"],
    choices: [
      {
        id: "c29_marina_ask",
        label: "회수율보다 채무자에게 연락하는 방식부터 따져 묻는다",
        effect: { trust: 12, humanCost: -5, legitimacy: -2, time: -4, fatigue: 6 },
        next: "c29_hawker",
        cognition: { persistence: 2 },
      },
      {
        id: "c29_marina_basis",
        label: "가격을 정한 근거 자료를 실사 목록에 공식으로 올린다",
        effect: { legitimacy: 12, trust: -4, time: -4, humanCost: 3, fatigue: 4 },
        next: "c29_hawker",
        cognition: { inference: 2 },
      },
      {
        id: "c29_marina_play",
        label: "환대에 장단을 맞추며 상대의 패부터 읽는다",
        effect: { capital: 7, time: 5, trust: 3, legitimacy: -5, humanCost: 3, fatigue: -2 },
        next: "c29_hawker",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c29_hawker",
      },
    ],
  },
  c29_hawker: {
    phase: "HAWKER NIGHT",
    title: "매운맛 5단계",
    speaker: "오진우",
    text:
      "다음 날 저녁 8시, 차이나타운 호커센터(값싼 노점 식당이 모인 야외 식당가). 브릿지은행 쪽에서 이번 거래를 맡아 먼저 와 있던 오진우가 플라스틱 의자 세 개를 맡아 뒀습니다. 그가 칠리크랩 가게의 '매운맛 5단계' 표지를 가리킵니다. '저거 다 먹은 한국 사람이 없대요. 오늘 생깁니다.' 서하린이 카메라를 켭니다. 첫 집게발에서 오진우의 귀가 빨개지고, 두 번째에서 말이 없어지고, 세 번째에서 옆 테이블 할머니가 말없이 연유 음료를 밀어 줍니다. 그가 눈물을 닦으며 목소리를 낮춥니다. '브릿지가 라운드힐에 인수 자금 900억을 빌려줘요. 대출 서류 지급처 칸에 노스게이트 어드바이저리, 매년 12억. 무슨 돈인지는 부속서(계약서 뒤에 붙는 추가 약속 문서) C에만 있대요.' 서하린의 젓가락이 멈춥니다. 해온의 마지막 돈을 받은 회사입니다. '제가 오늘 밤 찍어 올 수 있어요. 들키면 저는 끝이고요.'",
    memo: [
      "브릿지은행 → 라운드힐 인수 자금 900억",
      "지급처: 노스게이트 어드바이저리, 매년 12억",
      "노스게이트 = 해온 11억 4천의 수신처",
      "오진우 칠리크랩 5단계: 집게발 세 개에서 중단",
    ],
    triggers: ["competition", "trust", "curiosity"],
    choices: [
      {
        id: "c29_hawker_spare",
        label: "오진우가 다치지 않게 부속서는 다른 길로 구하자고 한다",
        effect: { trust: 12, humanCost: -4, time: -5, capital: -3, fatigue: 5 },
        next: "c29_hotel",
        cognition: { reframing: 2 },
      },
      {
        id: "c29_hawker_address",
        label: "노스게이트의 등록 주소부터 직접 찾아간다",
        effect: { legitimacy: 11, trust: 3, time: -5, capital: -1, humanCost: 2, fatigue: 4 },
        next: "c29_hotel",
        cognition: { inference: 2 },
      },
      {
        id: "c29_hawker_photo",
        label: "오진우에게 오늘 밤 부속서를 찍어 달라고 부탁한다",
        effect: { capital: 8, time: 6, legitimacy: 3, trust: -4, humanCost: 4, fatigue: -1 },
        next: "c29_hotel",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c29_hotel",
      },
    ],
  },
  c29_hotel: {
    phase: "BEFORE DAWN",
    title: "새해 인사",
    speaker: "서하린",
    text:
      "새벽 3시, 호텔 방 창밖으로 마리나의 불빛이 하나씩 꺼집니다. 서하린이 미니바 땅콩 봉지를 뜯지도 않고 쥔 채 말합니다. 7년 전, 그는 한 저축은행 대리 하윤호가 건넨 서류로 기사를 썼습니다. 기사는 상을 받았고, 하윤호는 두 달 뒤 해고됐습니다. 서류 귀퉁이에 찍힌 출력 번호 한 줄이 그를 가리켰습니다. 지금 그는 대전에서 택배 트럭을 몹니다. 해마다 1월 1일이면 '기자님 잘 지내요?'라는 문자가 옵니다. 서하린은 한 번도 답장하지 못했습니다. '그 번호를 제가 못 봤어요. 제 기사 때문에 한 사람 인생이 바뀌었는데, 그 사람은 저한테 새해 인사를 해요.' 그가 땅콩을 내려놓습니다. '백다온 씨 사진에도 뭔가 찍혀 있을 거예요. 늘 그래요.'",
    memo: [
      "하윤호: 7년 전 제보자, 보도 두 달 뒤 해고",
      "해고 사유가 된 것: 서류 귀퉁이 출력 번호",
      "부속서 C를 열 수 있는 라운드힐 직원 4명",
      "서명식까지 7시간",
    ],
    triggers: ["protection", "selfAwareness", "helplessness"],
    choices: [
      {
        id: "c29_hotel_protect",
        label: "백다온이 드러날 수 있는 사진은 쓰지 않기로 한다",
        effect: { trust: 13, humanCost: -5, legitimacy: -2, time: -3, fatigue: 7 },
        next: "c29_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c29_hotel_official",
        label: "부속서 원본을 라운드힐에 공식으로 요청해 확인한다",
        effect: { legitimacy: 12, trust: -3, time: -4, humanCost: 3, fatigue: 3 },
        next: "c29_final",
        cognition: { inference: 2 },
      },
      {
        id: "c29_hotel_publish",
        label: "서명식 전에 서하린이 기사부터 내게 한다",
        effect: { capital: 8, legitimacy: 5, time: 4, trust: -4, humanCost: 5, fatigue: -1 },
        next: "c29_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c29_final",
      },
    ],
  },
  c29_final: {
    phase: "FINAL DECISION",
    title: "서명란의 이름",
    speaker: "조현석",
    text:
      "오전 10시, 마리나 원 타워 42층 라운드힐 캐피탈 협상실. 창밖으로 그저께 밤의 루프탑이 보입니다. 긴 테이블에 계약서 세 권과 만년필 두 자루가 놓였고, 벽 화면에는 서울의 윤상혁이 떠 있습니다. 조현석이 마지막 서류를 당신 앞으로 밉니다. KD캐피탈 위험관리부 의견서, 서명란 하나. 서명란 아래에는 당신 이름이 이미 인쇄돼 있습니다. '이게 선행 조건(계약이 효력을 가지려면 먼저 갖춰야 하는 조건)이에요. 이것만 있으면 오늘 끝나요.' 계약서 맨 뒤에 부속서 C가 붙어 있습니다. 종결 뒤 3년, 윤상혁을 아시아 자문역(실무 책임 없이 조언만 하는 자리)으로 선임, 해마다 12억, 지급처 노스게이트 어드바이저리. 화면 속 윤상혁이 말합니다. '서명란이 비어 있으면 곤란하지. 그건 자네가 제일 잘 알 텐데.'",
    memo: [
      "위험 검토 의견서 -- 계약의 마지막 선행 조건",
      "부속서 C: 윤상혁 아시아 자문역 3년, 연 12억",
      "지급처: 노스게이트 어드바이저리(우편함 214번)",
      "채무조정 중인 46명 -- 계약서에 보호 조항 없음",
    ],
    triggers: ["choice", "injustice", "responsibility"],
    choices: [
      {
        id: "c29_final_protect",
        label: "추심 제한과 채무조정 승계 조항을 넣어야 서명한다고 한다",
        effect: { trust: 12, humanCost: -6, legitimacy: 5, capital: -9, time: -6, fatigue: 6 },
        next: "case29_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c29_final_report",
        label: "부속서 C를 이사회에 보고하기 전에는 의견서를 낼 수 없다고 한다",
        effect: { legitimacy: 13, trust: 5, capital: -8, time: -6, humanCost: 2, fatigue: 5 },
        next: "case29_result",
        cognition: { inference: 2 },
      },
      {
        id: "c29_final_sign",
        label: "의견서에 서명하고 부속서 사본을 들고 귀국해 뒤에서 싸운다",
        effect: { capital: 10, time: 6, legitimacy: 4, trust: -5, humanCost: 5, fatigue: -2 },
        next: "case29_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case29_result",
      },
    ],
  },
};

/**
 * Everything else case 29 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case29 = {
  id: "case29",
  nodes: case29Nodes,
  aftermath: {
    c29_aftershock: {
      phase: "AFTERMATH",
      title: "4단계의 복수",
      speaker: "오진우",
      text: "서명식이 끝난 목요일 밤 9시, 다시 차이나타운 호커센터. 오진우가 같은 칠리크랩 가게 앞에 섭니다. 이번에는 4단계입니다. '5단계는 사람이 먹는 게 아니었어요. 이건 전략적 후퇴입니다.' 옆 테이블의 그 할머니가 이번에는 연유 음료를 미리 두 잔 시켜 둡니다. 크랩이 반쯤 비었을 때 서하린이 휴대폰을 보다 고개를 숙입니다. 오후에 7년 만에 보낸 문자에 하윤호가 답했습니다. '기자님, 드디어 답장하시네요. 저 요즘 트럭 두 대예요.' 서하린이 웃다가 눈가를 닦고, 오진우는 매워서 우는 척 따라 웁니다. 자정 무렵, 한 달 가까이 조용하던 여섯 명의 단체방에 '이민서 님이 입력 중'이 떴다가 사라집니다. 벌써 세 번째입니다.",
      memo: ["오진우 칠리크랩 재도전: 4단계, 완주", "하윤호의 7년 만의 답장: '저 요즘 트럭 두 대예요'", "부속서 C 사본과 우편함 214번 기록 확보", "단체방 '이민서 님이 입력 중' -- 세 번째"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c29_after_warm", label: "싱가포르의 마지막 밤을 서하린, 오진우와 끝까지 보낸다", effect: { trust: 13, humanCost: -5, time: -3, capital: -3, fatigue: -8 }, next: "case29_result", cognition: { reframing: 2 } },
        { id: "c29_after_record", label: "돌아오는 비행기에서 부속서 C를 정리본으로 옮겨 남긴다", effect: { legitimacy: 14, trust: 3, time: -4, capital: -3, fatigue: 5 }, next: "case29_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c29_after_rush", label: "첫 비행기로 먼저 돌아가 캐리어째 윤상혁의 대표실로 간다", effect: { capital: 8, legitimacy: 6, trust: -5, humanCost: 5, fatigue: 4 }, next: "case29_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c29_final", "c29_aftershock"],
  connectiveScenes: [
    ["c29_ledger", "c29_marina", "c29_hawker", "노란 표시 46개", "최서진", "호텔로 돌아온 밤 11시 40분, 서울의 KD캐피탈 심사역 최서진이 파일 하나를 보냅니다. 매각 묶음에 든 채무자 3,860명의 명세입니다. 그중 46명 옆에 노란 표시가 있습니다. 이미 채무조정(갚기 힘든 사람의 빚을 줄이거나 기한을 늘려 주는 약속)을 받아 매달 조금씩 갚고 있는 사람들입니다. '묶음으로 팔리면 이 약속은 따라가지 않아요. 새 주인이 처음부터 다시 받겠다고 해도 막을 조항이 없어요.' 46명 중 서른한 명은 한 번도 연체한 적이 없습니다. 최서진이 한 줄을 더 보냅니다. '제일 착실한 사람들이 제일 먼저 전화를 받게 생겼어요.'", ["매각 채무자 3,860명 중 채무조정 중 46명", "46명 중 연체 이력 없음 31명", "매각 계약서에 조정 약속 승계 조항 없음"], ["조정 중인 46명을 매각 묶음에서 빼 달라고 요구한다", "조정 약속이 매각 뒤에도 이어지는 조항을 계약서에서 찾는다", "묶음은 그대로 두고 46명은 매각 뒤에 따로 챙긴다"]],
    ["c29_annex", "c29_hawker", "c29_hotel", "넷 중 하나", "백다온", "호커센터를 나서는데 택시 승강장에서 한 청년이 따라붙습니다. 라운드힐 캐피탈 애널리스트 백다온, 스물아홉, 서울에서 대학을 나왔습니다. 루프탑에서 조현석의 태블릿을 넘기던 사람입니다. 그가 휴대폰을 반쯤만 내밉니다. 화면에 부속서 C의 첫 장이 떠 있습니다. '그 추심 계획표, 제가 만들었어요. 연락 강도 주 5회, 그거 제 엑셀이에요.' 그가 손을 거둡니다. '나머지 장도 보여 드릴 수 있어요. 근데 이 파일을 열 수 있는 사람이 회사에 넷뿐이에요. 저는 그중에 제일 힘이 없는 사람이고요.'", ["백다온: 라운드힐 애널리스트, 추심 계획표 작성자", "부속서 C 열람 권한자 4명", "보여 준 것: 첫 장 한 장"], ["백다온의 신원이 드러나지 않을 방법부터 같이 찾는다", "정식 경로로 부속서 공개를 요구하겠다며 사양한다", "오늘 밤 바로 받아 사진으로 남겨 둔다"]],
    ["c29_call", "c29_hotel", "c29_final", "날씨 이야기", "윤상혁", "아침 6시 10분, 서울은 7시 10분입니다. 전화가 옵니다. 윤상혁은 인사 대신 날씨 이야기를 합니다. '싱가포르는 5월에도 덥지. 자네 의견서가 이번 계약의 선행 조건(계약이 효력을 가지려면 먼저 갖춰야 하는 조건)이라더군. 좋은 자리야. 그때는 자네 서명이 아무 데도 필요 없었는데.' 수화기 너머로 찻잔 내려놓는 소리가 들립니다. '어젯밤 호커센터에서 브릿지 쪽 친구와 저녁을 먹었다지. 매운 걸 잘 먹는 친구는 아니더군.' 그가 끊기 전에 덧붙입니다. '10시 서명식에는 나도 화면으로 들어가지.'", ["윤상혁의 전화: 싱가포르 06:10", "어젯밤 호커센터 저녁을 알고 있음", "서명식 10시, 윤상혁 화상 참석"], ["의견서보다 먼저 46명의 조정 약속을 이야기한다", "지금 통화를 기록하고 있다고 분명히 알린다", "대답하지 않고 끊은 뒤 서명식 준비에 들어간다"]],
  ],
  connectiveOrder: [["c29_marina", "c29_ledger"], ["c29_hawker", "c29_annex"], ["c29_hotel", "c29_call"]],
  choiceEffects: {
    c29_marina: [
      { trust: 11, legitimacy: 3, humanCost: -5, time: -4, capital: -3, fatigue: 5 },
      { legitimacy: 9, trust: 3, time: -5, fatigue: 4 },
      { time: 6, capital: 4, trust: -3, humanCost: 4, fatigue: -3 },
    ],
    c29_hawker: [
      { trust: 12, humanCost: -5, legitimacy: 2, time: -4, capital: -4, fatigue: 5 },
      { legitimacy: 8, trust: 4, time: -3, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 5, trust: -2, humanCost: 5, legitimacy: 2, fatigue: -3 },
    ],
    c29_hotel: [
      { trust: 10, legitimacy: 4, humanCost: -4, time: -3, capital: -3, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -4, fatigue: 4 },
      { time: 4, capital: 5, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -2 },
    ],
  },
  choiceCopy: {
    c29_marina: {
      voice: ["조정 중인 46명은, 매각 묶음에서 빼 달라고 요구한다.", "조정 약속이 매각 뒤에도 이어지는 조항을, 계약서에서 찾는다.", "묶음은 그대로 두고, 46명은 매각 뒤에 따로 챙기겠다고 한다."],
      echo: ["빼 달라는 요구는 곧장 가격표를 흔듭니다. 조현석은 아침 식사 자리에서 그 값을 정확히 말해 줄 겁니다.", "조항을 찾으면 계약서 본문 212쪽을 새벽까지 넘깁니다. 찾은 것은 '양수인의 재량'이라는 네 글자뿐입니다.", "따로 챙기겠다는 약속은 매각 뒤의 일입니다. 매각 뒤의 첫 전화는 새 주인이 겁니다."],
    },
    c29_hawker: {
      voice: ["백다온의 신원이 드러나지 않을 방법부터, 같이 찾자고 한다.", "정식 경로로 부속서 공개를 요구하겠다며, 사양한다.", "오늘 밤 바로 받아, 사진으로 남겨 둔다."],
      echo: ["방법을 찾는 동안 택시 세 대가 그냥 지나갑니다. 백다온은 처음으로 자기 이름을 걱정해 주는 사람을 봅니다.", "사양하면 백다온이 고개를 끄덕이고 돌아섭니다. 정식 경로의 답은 서명식이 끝난 뒤에 올 겁니다.", "사진은 남습니다. 파일을 열 수 있는 사람이 넷이라는 사실도 함께 남습니다."],
    },
    c29_hotel: {
      voice: ["의견서보다 먼저, 46명의 조정 약속을 이야기한다.", "지금 통화를 기록하고 있다고, 분명히 알린다.", "대답하지 않고 끊은 뒤, 서명식 준비에 들어간다."],
      echo: ["46명 이야기를 꺼내자 윤상혁이 잠시 말이 없습니다. '자네는 늘 숫자 대신 사람 수를 세더군.'", "기록한다는 말에 윤상혁이 웃습니다. '좋은 습관이지. 나는 그 습관이 없어서 여기까지 왔네.' 그 문장도 기록에 남습니다.", "끊으면 방이 조용해집니다. 윤상혁이 무엇을 이미 정해 놓았는지는 10시에야 보입니다."],
    },
  },
  reactionScenes: [
    ["c29_ledger_reaction", "c29_ledger", "c29_hawker", "공짜 망고", "조현석", "다음 날 아침 호텔 조식당, 조현석이 망고 접시를 들고 합석합니다. 46명 이야기를 꺼내자 그가 포크를 내려놓습니다. '그분들 빼면 가격이 38억 내려가요. 왜냐면 그분들이 제일 잘 갚거든요.' 그는 진심으로 곤란한 얼굴입니다. '저 나쁜 사람 아니에요. 우리 엄마도 퀸스에서 세탁소 하다 빚졌어요. 근데 펀드 투자자들한테 제 엄마 얘기를 팔 순 없잖아요.' 그가 망고 한 조각을 당신 접시로 옮깁니다. '이거 맛있어요. 이건 공짜예요.'", ["가격이 내려가도 46명은 빼야 한다고 버틴다", "38억이 어떻게 나왔는지 계산식을 공식으로 받아 둔다", "망고를 받고 오늘은 가격 이야기만 듣는다"]],
    ["c29_annex_reaction", "c29_annex", "c29_hotel", "택시 뒷자리", "서하린", "호텔로 가는 택시 뒷자리에서 서하린이 창밖만 봅니다. 마리나 쪽 불빛이 유리창을 지나갑니다. '회사에 넷뿐이면, 넷 중 하나예요. 넷 중 하나는 이름이 있는 거랑 같아요.' 그가 휴대폰 사진첩을 열었다가 닫습니다. '제보하는 사람들은 늘 자기가 제일 힘이 없다고 말해요. 그 말이 맞아서 무서운 거예요.' 기사가 라디오 소리를 줄입니다. 서하린이 덧붙입니다. '오늘 밤에 제 얘기 하나 할게요. 들어 줄래요?'", ["서하린의 이야기를 먼저 듣고 결정하자고 한다", "제보 파일에 남는 흔적을 지우는 절차부터 확인한다", "넷 중 하나라도 지금은 증거가 먼저라고 말한다"]],
    ["c29_call_reaction", "c29_call", "c29_final", "달걀말이 여섯 칸", "한서윤", "전화를 끊자마자 개인 메시지가 옵니다. 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 중인 한서윤입니다. 도시락 사진 한 장, 달걀말이가 반듯하게 여섯 칸 들어 있습니다. '할 일이 없어서 요리가 늘었어요. 여섯 칸 싸 놓고 보니 먹을 사람이 저 하나네요.' 단체방은 한 달 가까이 조용합니다. 다들 자기 자리에서 버티는 중이라, 누구도 먼저 말을 꺼내지 않습니다. 한서윤이 한 줄을 더 보냅니다. '윤 대표 전화 받았죠. 그 사람, 끊기 전에 시간 얘기를 하면 이미 정해 놓은 거예요. 싸울 땐 밥 먹고 싸워요.'", ["한서윤에게 지금 상황을 있는 그대로 털어놓는다", "부속서 사본을 한서윤에게 보내 따로 보관해 달라고 한다", "걱정 말라고만 답하고 휴대폰을 엎어 둔다"]],
  ],
  reactionEffects: {
    c29_ledger: [
      { trust: 10, humanCost: -4, capital: -5, time: -3, fatigue: 4 },
      { legitimacy: 8, trust: 2, capital: -3, time: -3, fatigue: 3 },
      { time: 4, capital: 4, trust: 2, legitimacy: -4, humanCost: 2, fatigue: -3 },
    ],
    c29_annex: [
      { trust: 9, humanCost: -4, time: -3, fatigue: 4 },
      { legitimacy: 7, trust: 3, capital: -4, time: -2, fatigue: 3 },
      { time: 4, capital: 3, trust: 2, humanCost: 3, fatigue: -4 },
    ],
    c29_call: [
      { trust: 10, humanCost: -4, time: -3, legitimacy: -2, fatigue: 3 },
      { legitimacy: 9, trust: 4, humanCost: -2, time: -3, fatigue: 4 },
      { time: 4, capital: 3, trust: -2, fatigue: -4 },
    ],
  },
  reactionCopy: {
    c29_ledger: {
      voice: ["가격이 내려가도, 46명은 빼야 한다고 버틴다.", "38억이 어떻게 나왔는지, 계산식을 공식으로 받아 둔다.", "망고를 받고, 오늘은 가격 이야기만 듣는다."],
      echo: ["버티면 조현석이 망고 접시를 치웁니다. '그럼 38억은 누가 내요?' 대답은 서명식까지 미뤄집니다.", "계산식은 이메일로 옵니다. 표 맨 아래 '조정 중 채무자 할인 제외'라는 줄이 당신이 찾던 줄입니다.", "망고는 정말 맛있습니다. 46명의 노란 표시는 그대로 파일 속에 남습니다."],
    },
    c29_annex: {
      voice: ["서하린의 이야기를 먼저 듣고, 결정하자고 한다.", "제보 파일에 남는 흔적을 지우는 절차부터, 확인한다.", "넷 중 하나라도, 지금은 증거가 먼저라고 말한다."],
      echo: ["듣겠다고 하자 서하린이 택시 창문을 조금 내립니다. 뜨거운 밤공기가 들어옵니다. 그는 호텔에 도착할 때까지 아무 말도 하지 않습니다.", "절차를 확인하면 사진 한 장에 숨은 정보가 열한 줄 나옵니다. 그중 한 줄은 백다온의 휴대폰 기종입니다.", "증거가 먼저라는 말에 서하린이 고개를 돌립니다. '저도 7년 전에 그렇게 말했어요.'"],
    },
    c29_call: {
      voice: ["한서윤에게, 지금 상황을 있는 그대로 털어놓는다.", "부속서 사본을 한서윤에게 보내, 따로 보관해 달라고 한다.", "걱정 말라고만 답하고, 휴대폰을 엎어 둔다."],
      echo: ["털어놓자 답이 한참 없다가 한 줄이 옵니다. '제가 그 사람 밑에서 오래 있었어요. 10시 전에 조항 하나만 더 읽어요.'", "사본은 대기발령 중인 사람의 휴대폰에 남습니다. 회사가 가장 들여다보지 않는 휴대폰입니다.", "엎어 둔 휴대폰이 서명식 직전까지 세 번 더 떨립니다. 한서윤의 마지막 메시지는 읽지 않은 채 남습니다."],
    },
  },
  reactionMemos: {
    c29_ledger_reaction: ["46명을 빼면 가격이 38억 내려감", "조현석의 어머니: 퀸스의 세탁소"],
    c29_annex_reaction: ["넷 중 하나는 이름이 있는 것과 같다", "서하린이 들려줄 이야기 하나"],
    c29_call_reaction: ["한서윤의 도시락 -- 달걀말이 여섯 칸, 먹을 사람 하나", "시간 얘기를 하면 이미 정해 놓은 것"],
  },
  branchPlan: ["c29_hawker", 1, "c29_branch_mailbox", "c29_branch_mailbox_follow"],
  branchScenes: {
    // CASE 29's detour is the address. The hawker table names the payee; the
    // side door is the building that is supposed to hold it, where there is no
    // office at all -- only a numbered steel box and a forwarding label to 청담동.
    c29_branch_mailbox: {
      phase: "SIDE DOOR",
      title: "우편함 214번",
      speaker: "서하린",
      text: "밤 11시, 래플스 플레이스의 공유 오피스 건물. 등록 주소는 21층인데, 로비 뒤편 벽에 우편함 318개가 촘촘히 박혀 있습니다. 노스게이트 어드바이저리는 214번, 사무실은 없고 우편함만 있습니다. 페이퍼컴퍼니(서류로만 있고 실제 사무실도 직원도 없는 회사)입니다. 야간 관리인 웨이린이 영어와 광둥어를 섞어 말합니다. 214번 우편물은 달마다 한 번 봉투째 서울로 부쳐지고, 받는 주소는 청담동의 한 갤러리입니다. 서하린이 수첩에 '갤러리 온'이라고 쓰고 밑줄을 두 번 긋습니다. 웨이린이 덧붙입니다. '오늘 오후에 서울에서 전화가 왔어요. 누가 214번을 찾으면 알려 달라고요.'",
      memo: ["노스게이트 어드바이저리: 우편함 214번, 사무실 없음", "우편물 발송지: 서울 청담동 갤러리 온", "같은 벽 우편함 318개", "오늘 오후 서울에서 걸려 온 문의 전화"],
      triggers: ["curiosity", "revenge", "order"],
      choices: [
        { id: "c29_branch_mailbox_a", label: "웨이린에게 사정을 털어놓고 우편 발송 기록을 부탁한다", effect: { trust: 11, legitimacy: 4, capital: -5, time: -5, fatigue: 5 }, next: "c29_branch_mailbox_follow", cognition: { reframing: 2 } },
        { id: "c29_branch_mailbox_b", label: "싱가포르 회사 등기부를 정식으로 발급받아 대조한다", effect: { legitimacy: 11, trust: 3, time: -5, humanCost: 2, fatigue: 3 }, next: "c29_branch_mailbox_follow", cognition: { inference: 2 } },
        { id: "c29_branch_mailbox_c", label: "우편함 번호와 발송 주소만 찍고 바로 빠져나온다", effect: { capital: 7, time: 5, trust: -3, humanCost: 3, fatigue: -3 }, next: "c29_branch_mailbox_follow", cognition: { risk: 1 } },
      ],
    },
    c29_branch_mailbox_follow: {
      phase: "SIDE DOOR",
      title: "가로 20센티",
      speaker: "서하린",
      text: "새벽 1시, 호텔 로비 소파에서 싱가포르 회사 등기부 발급본을 엽니다. 노스게이트의 유일한 이사는 윤상혁의 처남, 경력란에는 'KD캐피탈 비상근 고문'이라고 적혀 있습니다. 설립일은 해온파트너스가 청산(회사를 정리해 없애는 절차)을 신청하기 열하루 전입니다. 문을 닫기 전에 옮겨 갈 집부터 지어 둔 셈입니다. 서하린이 한참 화면을 보다가 웃습니다. '그렇게 오래 쫓았는데 결국 우편함 하나네요. 가로 20센티, 세로 12센티.' 그때 웨이린에게서 문자가 옵니다. '서울에서 또 전화 왔어요. 뭐라고 할까요?'",
      memo: ["노스게이트 유일한 이사: 윤상혁의 처남", "설립일: 해온 청산 신청 11일 전", "등기부 발급 수수료 5.5 싱가포르달러", "서울에서 두 번째 문의 전화"],
      triggers: ["protection", "revenge", "system"],
      choices: [
        { id: "c29_branch_mailbox_follow_a", label: "웨이린이 곤란하지 않게 우리가 왔었다고 그대로 말하라고 한다", effect: { trust: 12, humanCost: -4, legitimacy: 3, capital: -6, time: -4, fatigue: 5 }, next: "c29_annex", cognition: { reframing: 3 } },
        { id: "c29_branch_mailbox_follow_b", label: "등기부와 해온의 송금 기록을 묶어 감사팀에 보낸다", effect: { legitimacy: 12, trust: 4, time: -5, humanCost: 2, fatigue: 5 }, next: "c29_annex", cognition: { inference: 2 } },
        { id: "c29_branch_mailbox_follow_c", label: "서울의 전화가 누군지 보려고 일부러 흔적을 남긴다", effect: { time: 5, capital: 6, trust: -4, humanCost: 4, fatigue: -2 }, next: "c29_annex", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c29_start",
    result: "c29_aftershock",
    defaultFree: "c29_route_system",
    // One deal, one border. Like 사건 12 the case is a single line; the split is
    // what the analyst's signature is allowed to carry across the table.
    choices: {},
    system: {
      route: "c29_route_system",
      final: "c29_final_system_route",
      title: "할인율과 다음 자리",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 탑승구 앞 노트북에서 노아가 답합니다. 이번 매각가를 계산한 KD캐피탈의 심사 엔진(대출과 가격을 자동으로 판단하는 프로그램)입니다. 노아가 지난 10년 KD금융그룹이 한 통매각(부실 자산을 한 묶음으로 한꺼번에 파는 것) 23건을 엽니다. 19건에서 매각 뒤 1년 안에 채무자에게 가는 독촉 연락이 네 배로 늘었습니다. 14건에서는 파는 쪽 임원이 1년 안에 사는 쪽의 자문 자리에 앉았습니다. '할인율과 임원의 다음 자리는 같은 방향으로 움직이도록 학습되어 있습니다. 두 숫자를 한 문서에 적은 사람은 없습니다.'",
      memo: ["그룹 통매각 23건 중 매각 뒤 독촉 연락 4배 19건", "파는 쪽 임원이 사는 쪽 자문 자리로 간 경우 14건", "두 숫자를 함께 적은 내부 문서 0건"],
      routeChoices: [
        ["c29_route_system_publish", "두 숫자를 한 장에 적어 이사회와 채무자 모임에 함께 보낸다", { legitimacy: 11, trust: 5, capital: -6, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c29_route_system_watch", "매각 뒤 1년 동안 연락 방식을 공개 보고하게 하는 조건을 건다", { trust: 9, legitimacy: 5, humanCost: -4, capital: -5, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["c29_route_system_drop", "통계는 덮고 서명식 일정대로 비행기에 오른다", { time: 7, capital: 7, trust: -6, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "파는 쪽 임원이 사는 쪽 자리에 가지 못하게 막는 조항을 넣는다", { legitimacy: 12, trust: 8, capital: -9, humanCost: -4, fatigue: 6 }, { reframing: 3 }],
      ["b", "조항은 그대로 두고 매각 가격만 올려 받는다", { capital: 9, time: 6, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "팔려 간 채무자들을 위한 상담 창구를 매각 대금으로 연다", { trust: 10, legitimacy: 6, capital: -7, time: -6, humanCost: -3, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c29_evidence_turn",
    result: "c29_aftershock",
    sourceRoutes: ["c29_marina", "c29_hawker", "c29_hotel", "c29_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 매각가 협상 이력 옆에 놓고, 마지막에 깎인 금액이 어디로 가는지 맞춰 본다.",
    entryEcho: "단서를 대면 가격표의 빈자리가 사람 이름 하나와 같은 크기라는 게 보입니다.",
    title: "36억의 자리",
    speaker: "반재욱",
    text: "단서를 맞추자 숫자 하나가 제자리를 찾습니다. 매각가는 마지막 협상에서 1,346억에서 1,310억으로 36억이 깎였습니다. 부속서 C의 자문 보수는 해마다 12억씩 3년, 합계 36억입니다. 목포 출장지 모텔에서 화상으로 들어온 반재욱이 수첩을 넘깁니다. 'KD캐피탈이 덜 받은 돈이 그대로 윤 대표의 3년 치 보수가 됩니다. 그게 배임(맡은 일을 어기고 회사에 손해를 끼치는 죄)입니다.' 그가 한 줄을 더 적습니다. '받는 곳은 해온의 자문료(조언해 준 값이라며 받은 돈)가 마지막으로 들어간 그 우편함이고요. 그때 흘러간 돈과 앞으로 흘러갈 돈이 같은 주소를 씁니다.'",
    memo: ["마지막 협상에서 깎인 매각가: 36억", "부속서 C 자문 보수 합계: 36억", "지급처 = 해온 11억 4천의 수신처"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 4, trust: 4, time: -5, fatigue: 4 },
    choices: [
      ["c29_evidence_turn_file", "36억의 계산과 송금 흔적을 묶어 이사회와 감독 기관에 함께 낸다", { legitimacy: 13, trust: 5, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c29_evidence_turn_hold", "숫자는 쥐고 있다가 서명식 테이블에서 처음 꺼낸다", { capital: 9, time: 5, trust: -6, legitimacy: -4, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c29_evidence_turn_share", "매각 묶음에 든 채무자들에게 이 계산부터 알린다", { trust: 12, legitimacy: 6, capital: -7, humanCost: -6, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c29_branch_mailbox",
    systemNext: "c29_route_system",
    evidenceNext: "c29_evidence_turn",
    routeLabel: "직전 사건의 콜센터 통화 기록으로 팔려 갈 채무자 이름을 먼저 맞춰 본다",
    systemLabel: "직전 자유응답 문장이 매각 계약서 문구에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 매각가가 마지막에 깎인 자리를 연다",
  },
  openingRoutes: {
    c28_after_warm: "c29_start_warm",
    c28_after_record: "c29_start_record",
    c28_after_rush: "c29_start_rush",
  },
  openingCopy: {
    c29_start_warm: ["끝까지 들은 사람의 출국장", "도윤하", "구로 KD생명 콜센터 7층의 불이 꺼질 때까지 당신은 도윤하, 상담사들과 떡을 나눴습니다. 연하진의 팀 열두 명이 처음으로 같은 시간에 헤드셋을 벗었습니다. 나흘 뒤 아침, 인천공항 출국장에서 그 도윤하의 문자를 받습니다. '싱가포르 간다면서요. 팔려 가는 대출 묶음에 우리 지점 손님 이름도 있어요. 그분들 목소리, 저 아직 기억해요.' 이번 출장의 안건은 KD캐피탈의 부실 대출 4,270억 원어치를 싱가포르 라운드힐 캐피탈에 한 묶음으로 넘기는 일입니다. 두 줄 뒤 좌석에는 서하린이 앉습니다.", ["매각 묶음 채무자 3,860명 -- 강서지점 손님 포함", "도윤하: 콜센터 파견 종료, 강서지점 창구 복귀", "같은 비행기 두 줄 뒤: 서하린"]],
    c29_start_record: ["답을 미룬 날의 출국장", "반재욱", "제19조로 보험금을 거절당한 1,318명의 재심사 요청서를 당신은 KD생명에 냈습니다. 요청서는 접수됐고, 답변 기한은 '관련 매각 종결 이후'로 찍혀 나왔습니다. 무슨 매각인지 찾아보니 이번 주 목요일, KD캐피탈의 부실 대출 4,270억 원어치를 싱가포르 라운드힐 캐피탈에 넘기는 서명식 날입니다. 그 묶음에는 1,318명 가운데 마흔두 명의 대출도 들어 있습니다. 목포 출장지에서 반재욱이 전화로 말합니다. '답을 미룬 날짜가 서명 날짜예요. 그날 전에는 아무도 대답 안 한다는 뜻입니다.' 출국장에는 서하린이 먼저 와 있습니다.", ["재심사 요청서 답변 기한: '관련 매각 종결 이후'", "매각 서명식: 이번 주 목요일, 싱가포르", "매각 묶음에 보험금 거절자 42명의 대출 포함"]],
    c29_start_rush: ["먼저 떠난 사람의 출국장", "서하린", "헤드셋을 반납한 날 저녁, 서하린의 전화를 받자마자 당신은 싱가포르행 일정부터 잡았습니다. '해온파트너스의 마지막 돈이 어디로 갔는지 찾았어요. 여권 있죠?' 콜센터에서 받은 떡 한 팩은 아직 가방에 있고, 출장 명령은 공항 리무진 안에서 받았습니다. 공교롭게 행선지가 같습니다. KD캐피탈의 부실 대출 4,270억 원어치를 싱가포르 라운드힐 캐피탈에 넘기는 거래, 그 위험 검토가 당신 몫입니다. 서하린은 출국장 벤치에서 캐리어를 깔고 앉아 있습니다. '너무 빨리 왔어요. 비행기가 아직 안 왔어요.'", ["출장 명령 수신: 공항 리무진 안 -- 떡 한 팩 동행", "서하린: 해온의 마지막 돈의 행방 확보", "탑승까지 2시간 40분"]],
  },
  openingSignatures: {
    c29_start_warm: {
      label: "도윤하가 기억하는 손님 이름부터 매각 명세에서 찾아본다",
      effect: { trust: 10, humanCost: -4, capital: -3, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "도윤하가 기억하는 손님 이름부터, 매각 명세에서 찾아본다.",
      echo: "찾아보면 이름 열일곱 개가 나옵니다. 도윤하는 그중 넷의 목소리까지 기억한다고 답장합니다.",
    },
    c29_start_record: {
      label: "답변 기한과 서명식 날짜가 같다는 걸 공식 기록으로 남긴다",
      effect: { legitimacy: 12, trust: -2, capital: -5, time: -5, fatigue: 3 },
      cognition: { inference: 2 },
      voice: "답변 기한과 서명식 날짜가 같다는 걸, 공식 기록으로 남긴다.",
      echo: "기록은 남습니다. KD생명은 기한을 고치지 않고, 대신 '내부 사정'이라는 네 글자를 붙여 1,318명 명의로 다시 보냅니다.",
    },
    c29_start_rush: {
      label: "서둘러 떠난 사정과 서하린의 동행을 동료들에게 먼저 알린다",
      effect: { trust: 11, legitimacy: 4, humanCost: 3, time: -6, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "서둘러 떠난 사정과 서하린의 동행을, 동료들에게 먼저 알린다.",
      echo: "알리면 한 달 가까이 조용하던 동료들 가운데 반재욱에게서만 답이 옵니다. '기자와 같은 비행기면 좌석 번호도 적어 두세요.'",
    },
  },
  voiceLines: {
    // CASE 29. A deal abroad. Every line is said across a table where the other
    // side is smiling, so none of them is allowed to sound like a threat.
    c29_start_debtors: "묶음에 든 채무자 3,860명의 사정부터, 따로 챙겨 간다.",
    c29_start_mandate: "출장 명령서의 검토 범위부터, 문서로 확인해 둔다.",
    c29_start_board: "탑승 전에 서하린의 자료부터 받아, 기내에서 읽는다.",
    c29_marina_ask: "회수율보다, 채무자에게 연락하는 방식부터 따져 묻는다.",
    c29_marina_basis: "가격을 정한 근거 자료를, 실사 목록에 공식으로 올린다.",
    c29_marina_play: "환대에 장단을 맞추며, 상대의 패부터 읽는다.",
    c29_hawker_spare: "오진우가 다치지 않게, 부속서는 다른 길로 구하자고 한다.",
    c29_hawker_address: "노스게이트의 등록 주소부터, 직접 찾아간다.",
    c29_hawker_photo: "오진우에게, 오늘 밤 부속서를 찍어 달라고 부탁한다.",
    c29_branch_mailbox_a: "웨이린에게 사정을 털어놓고, 우편 발송 기록을 부탁한다.",
    c29_branch_mailbox_b: "싱가포르 회사 등기부를 정식으로 발급받아, 대조한다.",
    c29_branch_mailbox_c: "우편함 번호와 발송 주소만 찍고, 바로 빠져나온다.",
    c29_branch_mailbox_follow_a: "웨이린이 곤란하지 않게, 우리가 왔었다고 그대로 말하라고 한다.",
    c29_branch_mailbox_follow_b: "등기부와 해온의 송금 기록을 묶어, 감사팀에 보낸다.",
    c29_branch_mailbox_follow_c: "서울의 전화가 누군지 보려고, 일부러 흔적을 남긴다.",
    c29_hotel_protect: "백다온이 드러날 수 있는 사진은, 쓰지 않기로 한다.",
    c29_hotel_official: "부속서 원본을, 라운드힐에 공식으로 요청해 확인한다.",
    c29_hotel_publish: "서명식 전에, 서하린이 기사부터 내게 한다.",
    c29_final_protect: "추심 제한과 채무조정 승계 조항을 넣어야, 서명한다고 한다.",
    c29_final_report: "부속서 C를 이사회에 보고하기 전에는, 의견서를 낼 수 없다고 한다.",
    c29_final_sign: "의견서에 서명하고, 부속서 사본을 들고 귀국해 뒤에서 싸운다.",
    c29_after_warm: "싱가포르의 마지막 밤을, 서하린, 오진우와 끝까지 보낸다.",
    c29_after_record: "돌아오는 비행기에서, 부속서 C를 정리본으로 옮겨 남긴다.",
    c29_after_rush: "첫 비행기로 먼저 돌아가, 캐리어째 윤상혁의 대표실로 간다.",
    c29_route_system_publish: "두 숫자를 한 장에 적어, 이사회와 채무자 모임에 함께 보낸다.",
    c29_route_system_watch: "매각 뒤 1년 동안, 연락 방식을 공개 보고하게 하는 조건을 건다.",
    c29_route_system_drop: "통계는 덮고, 서명식 일정대로 비행기에 오른다.",
    c29_final_system_route_a: "파는 쪽 임원이 사는 쪽 자리에 가지 못하게, 막는 조항을 넣는다.",
    c29_final_system_route_b: "조항은 그대로 두고, 매각 가격만 올려 받는다.",
    c29_final_system_route_c: "팔려 간 채무자들을 위한 상담 창구를, 매각 대금으로 연다.",
    c29_evidence_turn_file: "36억의 계산과 송금 흔적을 묶어, 이사회와 감독 기관에 함께 낸다.",
    c29_evidence_turn_hold: "숫자는 쥐고 있다가, 서명식 테이블에서 처음 꺼낸다.",
    c29_evidence_turn_share: "매각 묶음에 든 채무자들에게, 이 계산부터 알린다.",
  },
  echoReplies: {
    // CASE 29.
    c29_start_debtors: "챙겨 가면 가방이 무거워집니다. 명세 3,860줄을 출력하느라 공항 비즈니스 센터 프린터가 한 번 멈춥니다.",
    c29_start_mandate: "범위를 확인하면 '가격 적정성'은 있고 '채무자 보호'는 없습니다. 없는 칸은 당신이 채우라는 뜻인지, 채우지 말라는 뜻인지 모릅니다.",
    c29_start_board: "기내에서 읽으면 착륙 전에 흐름이 보입니다. 옆자리 승객이 '해온'이라는 글자를 세 번 훔쳐봅니다.",
    c29_marina_ask: "묻자 조현석이 웃음을 멈춥니다. '주 5회는 업계 평균이에요.' 평균이라는 말이 대답이 아니라는 걸 그도 압니다.",
    c29_marina_basis: "근거 자료는 목록에 오릅니다. 자료실이 서명식 한 시간 전에 열린다는 답도 함께 옵니다.",
    c29_marina_play: "장단을 맞추면 조현석이 세 번째 잔을 시킵니다. 그리고 부속서가 하나 더 있다는 말을 흘립니다. 흘린 말은 녹음되지 않습니다.",
    c29_hawker_spare: "다른 길은 멀고 느립니다. 오진우는 '제가 이긴 적이 없는 싸움이 하나 늘었네요' 하며 크랩 껍데기를 치웁니다.",
    c29_hawker_address: "주소를 찾아가면 호커센터에서 걸어서 14분입니다. 서하린이 걸음을 세다 '7분이라더니 두 배네'라고 투덜댑니다.",
    c29_hawker_photo: "부탁하면 오진우가 고개를 끄덕입니다. 그의 휴대폰 화면 잠금이 풀리는 소리가 오늘 밤 가장 큰 소리입니다.",
    c29_branch_mailbox_a: "털어놓으면 웨이린이 발송 대장을 넘겨 줍니다. 그 대장에 웨이린의 서명도 함께 있습니다.",
    c29_branch_mailbox_b: "등기부는 누구나 뗄 수 있습니다. 누구나 뗄 수 있는 서류가 가장 오래 버팁니다.",
    c29_branch_mailbox_c: "사진은 두 장입니다. 우편함 214번과 발송 라벨. 웨이린은 나가는 뒷모습을 보고 서울에 전화할지 고민합니다.",
    c29_branch_mailbox_follow_a: "그대로 말하라고 하면 웨이린의 짐이 가벼워집니다. 서울은 이제 누가 왔는지 압니다.",
    c29_branch_mailbox_follow_b: "감사팀에 간 자료는 목포 출장 중인 반재욱에게 먼저 닿습니다. 그는 모텔 책상에서 새벽 두 시에 답장합니다.",
    c29_branch_mailbox_follow_c: "흔적을 남기면 서울이 먼저 움직입니다. 움직이는 쪽이 이름을 흘립니다. 웨이린은 그 사이에 서 있습니다.",
    c29_hotel_protect: "쓰지 않기로 하면 서하린이 사진을 지웁니다. 그리고 7년 만에 하윤호에게 보낼 문자를 쓰기 시작합니다.",
    c29_hotel_official: "공식 요청은 조현석의 메일함으로 갑니다. 답장은 '서명식 자리에서 보여 드리겠습니다' 한 줄입니다.",
    c29_hotel_publish: "기사는 서명식 두 시간 전에 나갑니다. 라운드힐 사내 보안팀이 파일을 연 네 사람의 기록부터 뽑습니다.",
    c29_final_protect: "조항을 요구하면 조현석이 계산기를 꺼냅니다. 가격은 다시 38억 내려가고, 윤상혁의 화면이 잠깐 꺼졌다 켜집니다.",
    c29_final_report: "보고 전에는 못 낸다고 하면 서명식이 멈춥니다. 조현석이 처음으로 영어로 욕을 하고, 곧 한국어로 사과합니다.",
    c29_final_sign: "서명하면 거래가 닫힙니다. 가방 속 사본은 무겁고, 46명의 첫 독촉 전화는 다음 달 첫째 주에 갑니다.",
    c29_after_warm: "호커센터 불이 하나씩 꺼질 때까지 플라스틱 의자 세 개가 비지 않습니다. 오진우가 '매운맛은 이제 은퇴합니다'라고 선언하고, 할머니가 박수를 칩니다.",
    c29_after_record: "기내 조명이 꺼진 뒤에도 노트북 불빛이 남습니다. 정리본은 열여덟 쪽, 윤상혁의 새 자리가 적힌 한 줄에 형광펜이 세 번 그어집니다.",
    c29_after_rush: "캐리어 바퀴 소리가 KD캐피탈 대표실 앞 복도까지 이어집니다. 비서는 '외부 일정'이라고 하고, 닫힌 문 너머에서 웃음소리가 들립니다.",
    c29_route_system_publish: "한 장에 적힌 두 숫자는 설명이 필요 없습니다. 이사회 사무국이 그 장을 받고 회의 안건 순서를 바꿉니다.",
    c29_route_system_watch: "조건을 걸면 라운드힐이 1년 동안 보고서를 내야 합니다. 조현석은 '서류가 늘면 사람도 느네요'라며 받아들입니다.",
    c29_route_system_drop: "덮으면 비행기는 제시간에 뜹니다. 노아의 통계는 탑승구 노트북 화면보호기 뒤로 사라집니다.",
    c29_final_system_route_a: "조항이 들어가면 윤상혁의 새 자리는 계약서에서 지워집니다. 사람이 아니라 칸이 먼저 사라집니다.",
    c29_final_system_route_b: "가격은 오르고 부속서는 남습니다. 오른 만큼이 누구의 몫인지는 다음 사건의 장부가 알려 줄 겁니다.",
    c29_final_system_route_c: "상담 창구는 매각 대금에서 3억을 떼어 엽니다. 첫 달 전화 312통 중 열에 일곱이 '누구한테 갚아야 하냐'는 질문입니다.",
    c29_evidence_turn_file: "함께 내면 36억이 두 기관의 서류에 동시에 찍힙니다. 서명식은 '추가 검토'로 이틀 밀립니다.",
    c29_evidence_turn_hold: "테이블에서 처음 꺼내면 협상실이 얼어붙습니다. 얼어붙은 방에서는 누구도 46명 얘기를 듣지 않습니다.",
    c29_evidence_turn_share: "알리면 채무자 모임 단체방에 첫 질문이 올라옵니다. '그럼 우리 빚이 그 사람 월급이 되는 거예요?'",
  },
  characterProfiles: {
    조현석: {
      role: "라운드힐 캐피탈 파트너 · 영어 이름 에단 조",
      stance: "매력 · 계산 · 확신",
      job: "KD의 부실 자산을 사서 '사람답게' 받아 내겠다고 믿는다. 윤상혁의 다음 자리를 계약서 맨 뒤에 붙여 둔 사람.",
      appearance: "소매를 두 번 접은 흰 셔츠, 뉴저지 억양이 남은 한국어, 손목에 세탁소 이름이 새겨진 낡은 시계.",
      thought: "부실은 누군가 치워야 한다. 치우는 사람이 욕을 먹는 건 가격에 이미 들어 있다.",
      gesture: "조현석은 불리한 숫자가 나오면 먼저 먹을 것을 권한다. 망고, 칵테일, 크랩. 접시가 대답의 쉼표다.",
      voice: "한국 속담을 거꾸로 쓰고, 틀린 걸 알아도 고치지 않는다. 숫자를 말할 때만 억양이 사라진다.",
      line: "한국 속담에 급할수록 돌아가라, 하잖아요. 그러니까 우리 빨리 사인해요.",
    },
    백다온: {
      role: "라운드힐 캐피탈 애널리스트 · 입사 3년차",
      stance: "양심 · 두려움 · 엑셀",
      job: "추심 계획표를 직접 만든 사람. 자기 엑셀이 사람의 휴대폰을 주 5회 울린다는 걸 안다.",
      appearance: "사원증을 셔츠 안에 넣어 다닌다. 노트북 모서리에 한국 대학 스티커 반쯤 뜯긴 자국.",
      thought: "파일을 열 수 있는 사람은 넷이다. 넷 중 하나는 이름이 있는 것과 같다.",
      gesture: "백다온은 보여 줄 것을 반만 내밀고, 상대가 손을 뻗기 전에 거둔다.",
      voice: "존댓말이 빠르고 조용하다. 문장 끝에 늘 자기가 가장 힘이 없다는 말을 붙인다.",
      line: "그 추심 계획표, 제가 만들었어요. 연락 강도 주 5회, 그거 제 엑셀이에요.",
    },
  },
  setting: { place: "인천공항 제2여객터미널 · 출국장", clock: "5월 넷째 주 화요일 · 07:40" },
  sceneContext: {
    c29_start: {
      place: "인천공항 제2여객터미널 · 출국장",
      clock: "5월 넷째 주 화요일 · 07:40",
      question: "4,270억어치 대출 묶음을 넘기는 출장길에 서하린이 같은 비행기를 탑니다. 무엇부터 챙기겠습니까?",
      lead: "KD캐피탈 위험관리부로 옮긴 지 두 달, 첫 해외 출장 가방이 아직 가볍습니다.",
    },
    c29_start_warm: {
      place: "인천공항 제2여객터미널 · 출국장",
      clock: "5월 넷째 주 화요일 · 07:40",
      question: "도윤하가 기억하는 손님들이 팔려 가는 묶음 안에 있습니다. 그 이름들을 들고 어디부터 가겠습니까?",
      lead: "콜센터 불이 꺼진 뒤 도윤하는 강서지점 창구로 돌아갔고, 당신은 출국장에 섰습니다.",
    },
    c29_start_record: {
      place: "인천공항 제2여객터미널 · 출국장",
      clock: "5월 넷째 주 화요일 · 07:40",
      question: "재심사 답변을 미룬 날짜가 매각 서명식 날짜와 같습니다. 이 우연을 어떻게 다루겠습니까?",
      lead: "재심사 요청서의 접수증을 여권 사이에 끼운 채 출국장에 왔습니다.",
    },
    c29_start_rush: {
      place: "인천공항 제2여객터미널 · 출국장",
      clock: "5월 넷째 주 화요일 · 07:40",
      question: "서하린의 전화 한 통에 짐을 싸서 먼저 공항에 와 버렸습니다. 남은 두 시간을 어떻게 쓰겠습니까?",
      lead: "콜센터를 나선 지 반나절, 출장 명령은 공항 리무진 안에서 받았습니다.",
    },
    c29_marina: {
      place: "싱가포르 마리나 베이 · 57층 루프탑",
      clock: "화요일 · 22:00",
      question: "환영 칵테일 옆 계획표에 '연락 강도: 주 5회'가 적혀 있습니다. 조현석에게 무엇을 먼저 묻겠습니까?",
      lead: "창이 공항에 내린 지 네 시간, 라운드힐 쪽 차량이 곧장 루프탑으로 데려왔습니다.",
    },
    c29_ledger: {
      place: "싱가포르 마리나 호텔 · 객실",
      clock: "화요일 · 23:40",
      question: "채무조정을 받아 착실히 갚던 46명이 묶음과 함께 팔립니다. 어떻게 하겠습니까?",
    },
    c29_ledger_reaction: {
      place: "싱가포르 마리나 호텔 · 조식당",
      clock: "수요일 · 07:30",
      question: "46명을 빼면 가격이 38억 내려간다고 조현석이 말합니다. 그 망고 접시 앞에서 어떻게 답하겠습니까?",
    },
    c29_hawker: {
      place: "싱가포르 차이나타운 호커센터 · 야외 골목 테이블",
      clock: "수요일 · 20:00",
      question: "눈물 젖은 오진우가 부속서 C를 오늘 밤 찍어 올 수 있다고 합니다. 어떻게 하겠습니까?",
      lead: "브릿지은행 쪽에서 먼저 와 있던 오진우가 저녁을 사겠다며 차이나타운으로 불렀습니다.",
    },
    c29_branch_mailbox: {
      place: "싱가포르 래플스 플레이스 · 공유 오피스 로비",
      clock: "수요일 · 23:00",
      question: "노스게이트는 사무실이 아니라 우편함 하나였습니다. 이 벽 앞에서 무엇을 하겠습니까?",
    },
    c29_branch_mailbox_follow: {
      place: "싱가포르 마리나 호텔 · 로비",
      clock: "목요일 · 01:00",
      question: "서울에서 두 번째 전화가 왔다고 웨이린이 묻습니다. 뭐라고 답하게 하겠습니까?",
    },
    c29_annex: {
      place: "싱가포르 차이나타운 · 택시 승강장",
      clock: "수요일 · 21:30",
      question: "추심 계획표를 만든 애널리스트가 부속서를 반만 보여 줍니다. 나머지를 어떻게 받겠습니까?",
    },
    c29_annex_reaction: {
      place: "싱가포르 · 호텔로 가는 택시 뒷자리",
      clock: "수요일 · 22:10",
      question: "넷 중 하나는 이름이 있는 것과 같다고 서하린이 말합니다. 그 말 앞에서 무엇을 먼저 하겠습니까?",
    },
    c29_hotel: {
      place: "싱가포르 마리나 호텔 · 객실",
      clock: "목요일 · 03:00",
      question: "기사 한 편이 제보자 한 사람의 인생을 바꾼 적이 있습니다. 백다온의 사진을 어떻게 하겠습니까?",
      lead: "호텔 방에 돌아온 뒤에도 둘 다 잠들지 못했습니다. 창밖 마리나의 불빛만 줄어듭니다.",
    },
    c29_call: {
      place: "싱가포르 마리나 호텔 · 객실",
      clock: "목요일 · 06:10",
      question: "윤상혁이 날씨 이야기로 시작해 서명식 시간으로 전화를 끝냅니다. 무엇이라 답하겠습니까?",
    },
    c29_call_reaction: {
      place: "싱가포르 마리나 호텔 · 엘리베이터",
      clock: "목요일 · 06:30",
      question: "대기발령 중인 한서윤이 도시락 사진과 경고 한 줄을 보냅니다. 무엇이라 답하겠습니까?",
    },
    c29_route_system: {
      place: "인천공항 제2여객터미널 · 탑승구 앞",
      clock: "화요일 · 09:50",
      question: "할인율과 임원의 다음 자리가 함께 움직인다는 통계가 나왔습니다. 이 숫자를 어떻게 하겠습니까?",
    },
    c29_final_system_route: {
      place: "마리나 원 타워 42층 · 라운드힐 캐피탈 협상실",
      clock: "목요일 · 09:40",
      question: "매각 계약에 규칙 하나를 더 넣을 수 있다면, 무엇을 넣겠습니까?",
    },
    c29_evidence_turn: {
      place: "싱가포르 마리나 호텔 · 객실 책상",
      clock: "목요일 · 08:00",
      question: "깎인 매각가 36억과 부속서의 3년 치 보수가 같은 숫자입니다. 이 계산을 어떻게 쓰겠습니까?",
    },
    c29_final: {
      place: "마리나 원 타워 42층 · 라운드힐 캐피탈 협상실",
      clock: "목요일 · 10:00",
      question: "당신 이름이 인쇄된 서명란 하나가 거래의 마지막 조건입니다. 어떻게 하겠습니까?",
      lead: "협상실 창밖으로 첫날 밤의 루프탑이 보입니다. 벽 화면에는 서울의 윤상혁이 이미 떠 있습니다.",
    },
    c29_aftershock: {
      place: "싱가포르 차이나타운 호커센터 · 야외 골목 테이블",
      clock: "목요일 · 21:00",
      question: "단체방에 '입력 중'이 세 번 떴다 사라집니다. 싱가포르의 마지막 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c29-mailbox-214",
    title: "우편함 214번",
    text: "해온파트너스의 마지막 11억 4천과 윤상혁의 3년 치 자문 보수가 같은 곳으로 갑니다. 싱가포르 래플스 플레이스의 우편함 214번, 이사는 윤상혁의 처남입니다.",
  },
  outcomes: {
    c29_after_warm: { tag: "끝까지 남은 결말", title: "호커센터의 마지막 불이 꺼질 때까지 셋이 앉아 있었다", text: "싱가포르의 마지막 밤, 당신은 서하린, 오진우와 플라스틱 의자에서 새벽 비행기 시간까지 버텼습니다. 칠리크랩 4단계는 완주였습니다." },
    c29_after_record: { tag: "정리본을 남긴 결말", title: "부속서 C가 열여덟 쪽 정리본이 됐다", text: "돌아오는 비행기에서 부속서와 우편함 214번, 해온의 송금 기록을 한 문서로 옮겼습니다. 그때 흘러간 돈과 앞으로 흘러갈 돈이 같은 문서에 처음 나란히 놓였습니다." },
    c29_after_rush: { tag: "먼저 달려간 결말", title: "캐리어를 끈 채 대표실 문 앞에 섰다", text: "당신은 첫 비행기로 먼저 돌아와 곧장 KD캐피탈 대표실로 갔습니다. 문은 열리지 않았고, 문 너머에서 윤상혁이 웃고 있었습니다." },
  },
  carryovers: {
    c29_after_warm: { trust: 11, humanCost: -4, fatigue: -6 },
    c29_after_record: { legitimacy: 13, trust: 2, fatigue: 4 },
    c29_after_rush: { capital: 7, legitimacy: 3, trust: -8, humanCost: 2 },
  },
  continuityChallenges: {
    c28_after_warm: { id: "protect-trust", title: "끝까지 들은 목소리 지키기", text: "콜센터에서 끝까지 들은 목소리들이 팔려 가는 묶음 안에 있습니다. 그 사람들을 이름으로 챙기는 선택을 찾아야 보너스가 열립니다." },
    c28_after_record: { id: "use-reframe", title: "미뤄진 답변 기한 뒤집기", text: "약관 답변 기한이 서명식 날짜로 밀렸습니다. 그 날짜가 누구의 방패인지 판을 다시 짜야 합니다." },
    c28_after_rush: { id: "repair-legitimacy", title: "서두른 출국의 공정함 회복하기", text: "기자와 같은 비행기에 먼저 올랐습니다. 출장의 공정함을 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
