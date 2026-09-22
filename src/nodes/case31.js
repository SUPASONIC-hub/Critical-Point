/**
 * CASE 31 -- the inspector, and the first signature box the analyst is asked to fill.
 *
 * 6막 「조사」 opens with the regulator walking in. In early June the 금융감독원
 * sends a routine inspection team into KD캐피탈 -- seven people, seven
 * suitcases -- and its lead, 한지우, does not trust the analyst: the analyst now
 * sits in the risk department that reports straight to 윤상혁. She speaks in
 * numbered questions and regulations and pays for her own cup noodles. The
 * case is five days of her questions about the 평택 officetel project loan, whose
 * maturity was pushed back four times so that its losses would not show before
 * the bulk sale to 라운드힐 캐피탈 closed.
 *
 * The laughter is character work: 한지우's question bombardment ("질문 42번"),
 * 반재욱 up from his regional audit tour to drop a folder "by accident" in the
 * inspection corridor -- three times, coached over the phone by 나준혁 -- and a
 * receipt written on a cup-noodle lid by 강태민 at the site office. The anger is
 * a box of original site photos marked for shredding the day before the
 * inspection notice. The sorrow is 한지우's own: as the youngest inspector on
 * the KD은행 inspection back then, she noticed that page 15 of the 2023-0412
 * file was missing, asked once, accepted "단순 누락", and learned only from the
 * hearing broadcast that page 15 was the analyst's dissent. The joy is the six
 * colleagues' group chat lighting up at three in the morning. The case closes
 * on a confirmer's signature box, and the aftermath hands the file to the
 * prosecutors -- 사건 32's search and seizure.
 */
export const case31Nodes = {
  c31_start: {
    phase: "CASE 31 BRIEFING",
    title: "검사역",
    speaker: "한지우",
    text:
      "6월 8일 월요일 오전 9시, KD캐피탈 본사 로비에 검은 캐리어 일곱 개가 줄지어 들어옵니다. 금융감독원 정기검사(금융감독원이 몇 년마다 금융회사의 장부와 업무를 통째로 들여다보는 점검)가 시작됐습니다. 맨 앞의 검사역(금융감독원에서 나와 회사를 직접 점검하는 사람) 한지우가 출입증을 받자마자 요구 자료 목록을 내밉니다. 148건, 첫 줄은 평택 오피스텔 PF(짓기도 전에 미래 분양 대금을 믿고 빌려주는 부동산 대출)입니다. 그가 당신 목에 걸린 '검사 대응 담당' 표찰을 봅니다. 위험관리부, 윤상혁 대표가 직접 지정한 자리입니다. '대표가 고른 대응 담당의 자료는 두 번 확인하겠습니다. 기분 나쁘셔도 됩니다. 규정입니다.' 그 옆에서 대표이사실 비서실장 석재우가 웃으며 USB 하나를 당신 손에 쥐여 줍니다. '정리본이야. 검사역님 편하시게.'",
    memo: [
      "현장 검사 5일 -- 검사역 7명, 팀장 한지우",
      "요구 자료 1차 148건, 첫 줄은 평택 오피스텔 PF",
      "대표이사실 비서실장 석재우가 건넨 '정리본' USB",
      "당신: 위험관리부 검사 대응 담당, 윤상혁 지정",
    ],
    triggers: ["order", "trust", "injustice"],
    choices: [
      {
        id: "c31_start_face",
        label: "한지우를 먼저 찾아가 내 자리와 사정을 솔직히 말한다",
        effect: { trust: 11, humanCost: -4, time: -4, capital: -2, fatigue: 5 },
        next: "c31_archive",
        cognition: { persistence: 2 },
      },
      {
        id: "c31_start_raw",
        label: "요구 자료 148건을 정리본 대신 원본으로 낸다",
        effect: { legitimacy: 12, time: -6, humanCost: 3, fatigue: 4 },
        next: "c31_archive",
        cognition: { inference: 2 },
      },
      {
        id: "c31_start_clean",
        label: "비서실장이 만든 정리본을 기한 안에 그대로 넘긴다",
        effect: { capital: 8, time: 5, legitimacy: -4, trust: -2, humanCost: 3, fatigue: -1 },
        next: "c31_archive",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c31_archive",
      },
    ],
  },
  c31_archive: {
    phase: "NIGHT SHIFT",
    title: "질문 42번",
    speaker: "한지우",
    text:
      "첫날 밤 11시 40분, 지하 1층 자료실. 한지우가 평택 오피스텔 PF(미래 분양 대금을 믿고 빌려준 부동산 대출) 서류철 여섯 권을 책상에 펼쳐 놓고 질문을 번호로 던집니다. '질문 1번, 이 도장은 누구 것입니까.' 새벽 1시에는 질문 38번입니다. KD캐피탈 심사역 최서진이 커피 두 잔을 들고 내려오자 한지우가 고개도 들지 않고 말합니다. '검사받는 회사가 주는 건 커피도 안 받습니다.' 최서진이 두 잔을 다 마십니다. 질문 42번에서 한지우의 형광펜이 멈춥니다. '만기 연장(갚을 날짜를 뒤로 미뤄 주는 것)을 네 번 했고, 할 때마다 충당금(떼일 것에 대비해 미리 쌓아 두는 돈)이 줄었습니다. 승인 도장은 전부 위험관리부입니다.' 그가 처음으로 당신을 봅니다. '당신이 오기 전 일이라는 건 압니다. 그래도 지금은 이 부서의 이름으로 대답하셔야 합니다.'",
    memo: [
      "평택 PF 만기 연장 4회 -- 연장마다 충당금 감소",
      "연장 승인 도장: 전부 위험관리부",
      "질문 1번부터 42번까지 2시간 -- 한지우가 분 단위로 기록",
      "연장 서류 작성 실무자 칸: 최서진",
    ],
    triggers: ["order", "curiosity", "responsibility"],
    choices: [
      {
        id: "c31_archive_answer",
        label: "실무자 이름은 빼 달라고 하고 질문에는 내가 답한다",
        effect: { trust: 12, humanCost: -5, legitimacy: -2, time: -4, fatigue: 5 },
        next: "c31_hallway",
        cognition: { persistence: 2 },
      },
      {
        id: "c31_archive_trace",
        label: "질문마다 서류 쪽수와 도장 날짜로만 답한다",
        effect: { legitimacy: 11, time: -6, trust: -1, fatigue: 4 },
        next: "c31_hallway",
        cognition: { inference: 2 },
      },
      {
        id: "c31_archive_brief",
        label: "비서실장이 써 둔 답변서를 그대로 읽어 준다",
        effect: { capital: 7, time: 5, trust: 2, legitimacy: -5, humanCost: 3, fatigue: -3 },
        next: "c31_hallway",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c31_hallway",
      },
    ],
  },
  c31_hallway: {
    phase: "CORRIDOR",
    title: "세 번 떨어진 서류철",
    speaker: "반재욱",
    text:
      "검사 사흘째 오후 2시, 12층 검사팀 방 앞 복도. 감사팀 지방 순회 중인 반재욱이 '서울 출장'이라는 핑계로 올라왔습니다. 단체방에서는 일주일째 읽기만 하던 사람입니다. 계획은 하나, 한지우 앞에서 우연히 서류철을 떨어뜨리는 것입니다. 이어폰 너머에서 나준혁이 코치합니다. '어깨 힘 빼요, 감사팀 아니고 사람처럼.' 첫 번째는 한지우가 통화 중이라 못 봅니다. 두 번째는 '어이쿠'가 국어책을 읽는 소리입니다. 세 번째, 한지우가 서류철을 주워 들고 말합니다. '세 번째네요. 연습은 계단에서 하세요. 거기가 CCTV가 적습니다.' 서류철 안에는 감사팀이 작년에 쓰고 묻은 메모가 있습니다. 평택 만기 연장(갚을 날짜를 미뤄 주는 것) 회의 메모, 여백에 윤상혁의 글씨로 '연장. 손실은 매각 뒤에.' 한지우가 표정 없이 묻습니다. '출처 없는 서류는 분실물입니다. 누가 이걸 증거로 만들어 주죠?'",
    memo: [
      "감사팀 내부 메모 -- 작성 뒤 보고 라인에서 멈춤",
      "여백의 글씨: '연장. 손실은 매각 뒤에.'",
      "반재욱의 연기 3회, 나준혁 원격 코치",
      "출처가 없으면 검사 자료가 아니라 분실물",
    ],
    triggers: ["trust", "system", "manipulation"],
    choices: [
      {
        id: "c31_hallway_vouch",
        label: "반재욱 대신 내가 이 서류의 출처가 되겠다고 한다",
        effect: { trust: 11, humanCost: -4, legitimacy: 3, capital: -4, time: -3, fatigue: 5 },
        next: "c31_rooftop",
        cognition: { persistence: 1, reframing: 1 },
      },
      {
        id: "c31_hallway_channel",
        label: "반재욱이 감사팀 이름으로 정식 제출하게 한다",
        effect: { legitimacy: 12, time: -6, humanCost: 3, fatigue: 5 },
        next: "c31_rooftop",
        cognition: { inference: 2 },
      },
      {
        id: "c31_hallway_drop",
        label: "분실물로 두고 한지우가 알아서 쓰게 맡긴다",
        effect: { capital: 6, time: 4, trust: 3, legitimacy: -4, humanCost: 3, fatigue: -3 },
        next: "c31_rooftop",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c31_rooftop",
      },
    ],
  },
  c31_rooftop: {
    phase: "ROOFTOP",
    title: "15쪽",
    speaker: "한지우",
    text:
      "검사 나흘째 밤 10시, KD캐피탈 옥상. 한지우가 편의점 바나나우유를 들고 난간에 기대 있습니다. 영수증도 챙겼습니다. 한참 말이 없다가 그가 숫자부터 꺼냅니다. '그때 저는 KD은행 정기검사(금융감독원이 몇 년마다 금융회사를 통째로 들여다보는 점검)의 막내였습니다. 2023-0412 서류철을 제가 넘겼어요. 14쪽 다음이 16쪽이었습니다.' 바람에 그의 출입증이 한 바퀴 돕니다. '질문서를 한 번 냈고, 단순 누락이라는 답을 받고 넘어갔습니다. 저는 그 질문을 한 번만 했습니다.' 그 15쪽이 당신의 반대 의견이었다는 건 국정감사(국회가 1년에 한 번 정부와 금융회사의 일을 공개적으로 따져 묻는 자리) 중계를 보고서야 알았다고 합니다. '그래서 당신을 안 믿었어요. 당신을 믿으면, 제가 한 번만 물은 게 더 무거워지니까요.'",
    memo: [
      "한지우: 그때 KD은행 검사팀 막내",
      "2023-0412 서류철 14쪽 다음 16쪽 -- 질문서 1회",
      "회사 답변: '단순 누락'",
      "사라진 15쪽 = 당신의 반대 의견",
    ],
    triggers: ["selfAwareness", "helplessness", "trust"],
    choices: [
      {
        id: "c31_rooftop_share",
        label: "15쪽을 쓴 사람으로서 그날의 이야기를 털어놓는다",
        effect: { trust: 13, humanCost: -4, legitimacy: -2, time: -4, fatigue: 5 },
        next: "c31_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c31_rooftop_reopen",
        label: "그때의 질문서를 이번 검사 자료에 다시 붙이자고 한다",
        effect: { legitimacy: 12, trust: 3, time: -6, humanCost: 1, fatigue: 5 },
        next: "c31_final",
        cognition: { inference: 2 },
      },
      {
        id: "c31_rooftop_lever",
        label: "그 미안함을 지렛대 삼아 검사 결과를 앞당겨 달라고 한다",
        effect: { capital: 8, time: 5, trust: -3, legitimacy: 2, humanCost: 3, fatigue: -2 },
        next: "c31_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c31_final",
      },
    ],
  },
  c31_final: {
    phase: "FINAL DECISION",
    title: "확인자 서명란",
    speaker: "한지우",
    text:
      "검사 마지막 날 오후 4시, 12층 검사팀 방. 한지우가 지적 사항(검사에서 잘못으로 적히는 항목) 초안 세 장을 내려놓습니다. 평택 PF(미래 분양 대금을 믿고 빌려준 부동산 대출)의 만기 연장(갚을 날짜를 미뤄 주는 것) 네 번으로 손실 380억을 미뤘고, 충당금(떼일 것에 대비해 쌓아 두는 돈)을 덜 쌓았고, 라운드힐 매각 계약 부속서(계약서 뒤에 붙는 추가 약속 문서)에 윤상혁의 자문역(실무 책임 없이 조언만 하는 자리) 자리가 있습니다. 맨 아래에 검사 결과 확인서(드러난 사실이 맞다고 회사 직원이 확인하는 문서)가 있습니다. 회사가 정한 확인자 석재우는 서명을 거부했습니다. '실무 확인자로 서명해 주시면 이 건은 사실 확인으로 검찰 통보까지 갑니다. 서명이 없으면 회사 소명 중으로 석 달을 갑니다.' 확인서의 실무자 칸에는 최서진의 이름이 먼저 적혀 있습니다. 한지우가 펜을 내밉니다. '이번에는 서명란이 비어 있지 않았으면 합니다.'",
    memo: [
      "지적 사항 3건 -- 미룬 손실 380억",
      "확인서 확인자 칸: 석재우 거부, 빈칸",
      "서명 시 검찰 통보, 미서명 시 소명 기간 3개월",
      "실무자 칸: 최서진 -- 서류만 채운 사람",
    ],
    triggers: ["choice", "responsibility", "protection"],
    choices: [
      {
        id: "c31_final_shield",
        label: "최서진의 이름을 실무자 칸에서 빼는 조건으로 서명한다",
        effect: { trust: 12, humanCost: -6, legitimacy: 5, capital: -5, time: -5, fatigue: 5 },
        next: "case31_result",
        cognition: { persistence: 1, reframing: 2 },
      },
      {
        id: "c31_final_sign",
        label: "확인자 서명란에 내 이름을 쓰고 사실 그대로 확인한다",
        effect: { legitimacy: 13, trust: 4, capital: -8, time: -5, humanCost: 3, fatigue: 5 },
        next: "case31_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c31_final_wait",
        label: "서명은 미루고 소명 기간 동안 안에서 더 모은다",
        effect: { capital: 9, time: 6, legitimacy: -3, trust: 3, humanCost: 4, fatigue: -2 },
        next: "case31_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case31_result",
      },
    ],
  },
};

/**
 * Everything else case 31 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case31 = {
  id: "case31",
  nodes: case31Nodes,
  aftermath: {
    c31_aftershock: {
      phase: "AFTERMATH",
      title: "캐리어 일곱 개",
      speaker: "한지우",
      text: "검사팀이 철수하는 날 오후 6시, 로비에 캐리어 일곱 개가 다시 줄을 섭니다. 들어올 때보다 무겁습니다. 최서진이 엘리베이터 앞까지 따라 나와 고개를 숙이고, 한지우는 받지 않던 커피 대신 그 인사는 받습니다. 그가 검사 수첩 맨 뒷장을 잠깐 펼쳐 보입니다. 컵라면 뚜껑에 강태민이 적어 준 영수증 '1,500원'이 테이프로 붙어 있습니다. '숫자는 제가 가져갑니다. 사람은 당신이 챙기세요.' 회전문이 한 바퀴 돌고 그가 나갑니다. 그날 밤 11시, 한지우에게서 문자가 옵니다. '지적 사항 한 건, 검찰에 통보했습니다. 다음 주에 상자가 많이 필요할 겁니다.'",
      memo: ["현장 검사 5일 종료 -- 캐리어 7개", "한지우 검사 수첩 뒷장: 컵라면 뚜껑 영수증", "지적 사항 1건 검찰 통보", "'다음 주에 상자가 많이 필요할 겁니다'"],
      triggers: ["trust", "responsibility", "choice"],
      choices: [
        { id: "c31_after_warm", label: "오늘 밤은 헌책방에 모여 동료들과 검사의 끝을 함께 보낸다", effect: { trust: 12, humanCost: -5, time: -3, capital: -2, fatigue: -7 }, next: "case31_result", cognition: { reframing: 2 } },
        { id: "c31_after_record", label: "검사 닷새의 모든 질문과 답을 날짜순 기록으로 남긴다", effect: { legitimacy: 14, trust: 3, time: -5, capital: -2, fatigue: 5 }, next: "case31_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c31_after_rush", label: "상자가 오기 전에 평택 원본을 챙기러 곧장 자료실로 간다", effect: { capital: 6, legitimacy: 5, trust: -6, humanCost: 4, fatigue: 5 }, next: "case31_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c31_final", "c31_aftershock"],
  connectiveScenes: [
    ["c31_boxes", "c31_archive", "c31_hallway", "폐기 예정", "최서진", "셋째 날 새벽 3시 10분, 지하 1층 자료실 맨 안쪽. 복사용지를 가지러 갔던 최서진이 창백한 얼굴로 돌아옵니다. 선반 아래에 상자 일곱 개가 테이프로 봉해져 있고, 옆면에 '보존 기간 경과 · 6월 12일 폐기'라고 적혀 있습니다. 하나를 열자 평택 공사 현장 사진 원본과, 빨간 펜 자국이 가득한 연장 심사 초안이 나옵니다. 폐기 승인 날짜는 검사 통보가 온 바로 전날입니다. 최서진이 사진 한 장을 들고 떨리는 목소리로 말합니다. '이거 제가 찍은 거예요. 9층까지밖에 안 올라갔다고, 제가 보고서에 썼어요.'", ["폐기 예정 상자 7개 -- 폐기일 6월 12일, 검사 마지막 날", "폐기 승인: 검사 통보 전날", "현장 사진 원본 -- 촬영자 최서진"], ["상자를 지금 바로 한지우에게 들고 간다", "폐기 중지를 부서에 공식 문서로 요청한다", "사진만 찍어 두고 상자는 제자리에 둔다"]],
    ["c31_buyer", "c31_hallway", "c31_rooftop", "입주 예정일", "연지안", "같은 날 저녁 6시 반, 12층 엘리베이터 앞. 간호사복 위에 카디건을 걸친 연지안이 분양 계약서 한 묶음을 안고 서 있습니다. 평택 오피스텔 212세대 중 한 집의 계약자로, 중도금 대출(분양 대금의 중간분을 내려고 계약자가 따로 받은 대출)을 받았습니다. 야간 근무 전에 들렀다고 합니다. '검사하시는 분이 오셨다고 들었어요. 입주가 올해 3월이었거든요. 중도금 대출 이자는 벌써 열네 달째 내고 있어요.' 그가 휴대폰을 내밉니다. 크레인만 서 있는 현장 사진입니다. '저 건물, 지금 몇 층이에요?' 대답할 수 있는 사람은 그 자리에 당신뿐입니다.", ["평택 오피스텔 분양 계약자 212세대", "연지안: 간호사, 중도금 대출 이자 14개월째", "입주 예정일 3월 -- 현장은 9층에서 멈춤"], ["연지안의 이야기를 검사팀에 직접 들려준다", "분양 계약자 민원을 공식 접수 절차로 돕는다", "검사 중이라며 로비까지 정중히 안내한다"]],
    ["c31_chat", "c31_rooftop", "c31_final", "새벽 3시의 단체방", "한서윤", "검사 닷새째 새벽 3시, 당신이 '내일도 출근' 단체방에 연장 날짜 네 개를 올립니다. 10분 만에 방이 불처럼 켜집니다. 이민서가 KD데이터랩에서 같은 날짜의 심사 기록 시각을 찾아 올리고, 도윤하는 강서지점에서 평택 중도금 대출을 받은 사람 수를 세어 옵니다. 오진우는 브릿지은행 쪽에서 본 매각 일정표를, 반재욱은 수첩 한 쪽을 찍어 올립니다. 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 중인 한서윤은 새벽 6시에 사진 한 장을 보냅니다. 도시락 일곱 개, 뚜껑마다 매직으로 '분석관 개인 도시락'. 검사팀은 받을 수 없다는 걸 알고 쓴 이름입니다.", ["단체방 새벽 3시 -- 10분 만에 자료 5건", "이민서·도윤하·오진우·반재욱 각자 자리에서 자료", "한서윤의 도시락 7개 -- '분석관 개인 도시락'"], ["동료들 이름은 빼고 자료는 내 이름으로만 낸다", "자료마다 출처와 시각을 적어 정식으로 제출한다", "가장 센 자료 하나만 골라 오늘 아침 바로 쓴다"]],
  ],
  connectiveOrder: [["c31_archive", "c31_boxes"], ["c31_hallway", "c31_buyer"], ["c31_rooftop", "c31_chat"]],
  choiceEffects: {
    c31_archive: [
      { trust: 10, legitimacy: 5, humanCost: -4, time: -5, capital: -2, fatigue: 4 },
      { legitimacy: 9, trust: 2, time: -6, fatigue: 3 },
      { time: 5, capital: 3, trust: -3, humanCost: 4, fatigue: -4 },
    ],
    c31_hallway: [
      { trust: 11, humanCost: -5, legitimacy: 2, time: -4, capital: -3, fatigue: 3 },
      { legitimacy: 8, trust: 4, time: -5, fatigue: 3 },
      { time: 4, capital: 3, trust: -3, humanCost: 5, fatigue: -3 },
    ],
    c31_rooftop: [
      { trust: 10, humanCost: -5, legitimacy: -2, capital: -3, time: -2, fatigue: 4 },
      { legitimacy: 11, trust: 3, time: -6, fatigue: 4 },
      { time: 5, capital: 5, legitimacy: 3, trust: -5, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c31_archive: {
      voice: ["상자를, 지금 바로 한지우에게 들고 간다.", "폐기 중지를, 부서에 공식 문서로 요청한다.", "사진만 찍어 두고, 상자는 제자리에 둔다."],
      echo: ["상자를 들고 가면 한지우가 봉인 테이프의 날짜부터 적습니다. 최서진의 이름도 그 옆에 적힙니다.", "공식 요청은 기록으로 남습니다. 요청서가 비서실장 책상에 닿는 데는 하루가 걸리고, 폐기일은 모레입니다.", "사진은 남습니다. 원본 상자는 검사 마지막 날 아침 파쇄 차량에 실립니다."],
    },
    c31_hallway: {
      voice: ["연지안의 이야기를, 검사팀에 직접 들려준다.", "분양 계약자 민원을, 공식 접수 절차로 돕는다.", "검사 중이라며, 연지안을 로비까지 정중히 안내한다."],
      echo: ["검사팀 방 문이 열리고 연지안이 한지우 앞에 앉습니다. 한지우는 이자 명세를 받아 적고, 해 줄 수 있는 게 없다는 말도 받아 적습니다.", "접수 번호가 생깁니다. 연지안은 번호를 휴대폰에 저장하고, 야간 근무에 20분 늦습니다.", "연지안은 고맙다고 하고 돌아섭니다. 엘리베이터 문이 닫히기 전까지 계약서 묶음을 한 번도 내려놓지 않습니다."],
    },
    c31_rooftop: {
      voice: ["동료들 이름은 빼고, 자료는 내 이름으로만 낸다.", "자료마다 출처와 시각을 적어, 정식으로 제출한다.", "가장 센 자료 하나만 골라, 오늘 아침 바로 쓴다."],
      echo: ["자료는 당신 한 사람의 것이 됩니다. 동료들은 안전해지고, 한지우는 한 사람이 이걸 다 모았을 리 없다는 걸 압니다.", "출처가 붙은 자료는 흔들리지 않습니다. 대신 여섯 명의 이름이 검사 기록에 나란히 남습니다.", "한 장은 빠릅니다. 나머지 네 사람이 밤새 찾은 자료는 단체방에 남은 채 아침을 맞습니다."],
    },
  },
  reactionScenes: [
    ["c31_boxes_reaction", "c31_boxes", "c31_hallway", "규정대로", "석재우", "아침 7시 20분, 12층 복도. 출근하던 석재우가 당신 옆에 나란히 섭니다. 흰 셔츠 소매가 두 번 접혀 있습니다. 그가 당신 어깨의 먼지를 털어 줍니다. '자료실 상자 얘기 들었네. 폐기는 규정대로야, 보존 기간이 지났으니까.' 목소리는 끝까지 부드럽습니다. '자네 여기 온 지 두 달이지. 윤 대표님이 자네 이름을 기억하시더군. 좋은 뜻으로.' 그가 엘리베이터 버튼을 누르고 먼저 탑니다. 문이 닫히기 직전에 한마디를 더 합니다. '최 심사역도 참 성실하지. 그런 친구가 다치면 안 되는데.'", ["규정 이야기는 한지우 앞에서 하자고 답한다", "폐기 결정 문서의 사본을 정식으로 요청한다", "못 들은 척 고개만 숙이고 지나간다"]],
    ["c31_buyer_reaction", "c31_buyer", "c31_rooftop", "가장 정확한 말", "한지우", "연지안이 돌아간 뒤, 한지우가 복도 창가에 한참 서 있습니다. '민원 번호를 알려 드린 건 그게 제가 할 수 있는 가장 정확한 말이라서입니다.' 그가 형광펜 뚜껑을 닫습니다. '정확한 말이 제일 쓸모없을 때도 있죠. 검사는 돈을 주지 않습니다. 이자를 대신 내 주지도 않고요.' 그리고 수첩을 펴서 질문 번호를 새로 매깁니다. '질문 97번. 212세대 계약자 명단, 있습니까? 연장이 없었다면 이 사람들이 언제 무엇을 알았을지 계산해 보고 싶습니다.'", ["명단 제출 전에 계약자들 동의부터 받는다", "212세대 명단을 검사 자료로 한지우에게 넘긴다", "명단은 검사 범위 밖이라며 넘기지 않는다"]],
    ["c31_chat_reaction", "c31_chat", "c31_final", "같은 엘리베이터", "윤상혁", "아침 7시 40분, 로비 엘리베이터에 먼저 타 있던 사람은 윤상혁입니다. KD캐피탈 대표가 된 뒤 처음 마주칩니다. 그가 당신 층 버튼을 대신 눌러 줍니다. '검사는 잘 받고 있나. 한 검사역은 숫자를 좋아하지. 자네도 숫자를 좋아했고.' 층수 표시가 3, 4, 5로 올라갑니다. '서명란 얘기는 아직이네. 급할 것 없지 않나.' 12층에서 문이 열립니다. 그는 내리지 않고, 당신이 내리기를 기다립니다. 그의 손에 들린 서류 봉투 겉면에 '질문 42번 답변'이라고 적혀 있습니다. 당신이 첫날 밤 자료실에서 한 대답입니다.", ["그 대출의 15쪽을 기억하느냐고 되묻는다", "대표 면담을 공식 일정으로 잡아 기록을 남기자고 한다", "아무 말 없이 먼저 엘리베이터에서 내린다"]],
  ],
  reactionEffects: {
    c31_boxes: [
      { trust: 9, legitimacy: 3, humanCost: -3, capital: -4, time: -3, fatigue: 4 },
      { legitimacy: 10, time: -4, fatigue: 3 },
      { time: 4, capital: 5, trust: -4, humanCost: 3, fatigue: -3 },
    ],
    c31_buyer: [
      { trust: 10, humanCost: -4, time: -5, fatigue: 4 },
      { legitimacy: 10, trust: 2, humanCost: 3, time: -3, fatigue: 4 },
      { time: 4, capital: 4, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
    c31_chat: [
      { trust: 7, legitimacy: 4, humanCost: -3, capital: -3, time: -2, fatigue: 4 },
      { legitimacy: 10, time: -4, fatigue: 4 },
      { time: 3, capital: 4, trust: 3, legitimacy: -4, humanCost: 2, fatigue: -4 },
    ],
  },
  reactionCopy: {
    c31_boxes: {
      voice: ["규정 이야기는, 한지우 앞에서 하자고 답한다.", "폐기 결정 문서의 사본을, 정식으로 요청한다.", "못 들은 척, 고개만 숙이고 지나간다."],
      echo: ["석재우가 처음으로 웃음을 멈춥니다. 규정은 규정을 아는 사람 앞에서만 약해진다는 걸 그도 압니다.", "사본 요청은 받아들여집니다. 이튿날 온 사본의 승인란에는 있어야 할 도장 하나가 빠져 있습니다.", "고개를 숙이면 복도는 조용합니다. 석재우가 최서진의 이름을 한 번 더 부르지 않아도 되게 됩니다."],
    },
    c31_buyer: {
      voice: ["명단을 내기 전에, 계약자들 동의부터 받자고 한다.", "212세대 명단을, 검사 자료로 한지우에게 넘긴다.", "명단은 검사 범위 밖이라며, 넘기지 않는다."],
      echo: ["동의를 구하는 문자 212통이 나갑니다. 사흘 동안 답이 온 사람은 131명, 연지안이 첫 번째입니다.", "명단은 숫자가 되어 한지우의 계산표에 들어갑니다. 212명은 자기 이름이 어디에 쓰였는지 모릅니다.", "명단은 서랍에 남습니다. 한지우는 질문 97번 옆에 '미제출'이라고 적고 다음 번호로 넘어갑니다."],
    },
    c31_chat: {
      voice: ["그 대출의 15쪽을 기억하느냐고, 윤상혁에게 되묻는다.", "대표 면담을 공식 일정으로 잡아, 기록을 남기자고 한다.", "아무 말 없이, 먼저 엘리베이터에서 내린다."],
      echo: ["윤상혁이 잠깐 층수 표시를 봅니다. '기억하지. 자네보다 잘.' 문이 닫힙니다.", "면담은 일정표에 올라갑니다. 비서실이 잡아 준 날짜는 검사가 끝난 다음 주입니다.", "내리면 문이 닫히고 엘리베이터는 꼭대기 층으로 올라갑니다. 그가 질문 42번을 어떻게 아는지는 묻지 못한 채 남습니다."],
    },
  },
  reactionMemos: {
    c31_boxes_reaction: ["어깨의 먼지를 털어 주는 경고", "다치면 안 되는 성실한 사람"],
    c31_buyer_reaction: ["가장 정확하고 가장 쓸모없는 말", "질문 97번: 212세대 명단"],
    c31_chat_reaction: ["대표가 대신 눌러 준 층 버튼", "봉투 겉면의 '질문 42번 답변'"],
  },
  branchPlan: ["c31_archive", 0, "c31_branch_site", "c31_branch_site_follow"],
  branchScenes: {
    // CASE 31's detour is the building itself. The inspection argues over what a
    // ledger says about a construction site; the side door is the site, where
    // 한지우 counts floors instead of pages.
    c31_branch_site: {
      phase: "SIDE DOOR",
      title: "층수를 세는 사람",
      speaker: "강태민",
      text: "둘째 날 오전, 한지우가 서류철을 덮고 말합니다. '건물을 보겠습니다.' 평택 공사 현장에는 타워크레인 두 대가 멈춰 있고, 현장 입구에서 강태민이 안전모 두 개를 들고 기다립니다. 4월부터 이 현장을 드나든 사람입니다. 한지우가 골조를 올려다보며 손가락으로 층을 셉니다. 아홉 번째 손가락에서 멈춥니다. '장부에는 공정률(공사가 얼마나 진행됐는지 나타낸 비율) 62%입니다. 20층짜리 건물이 9층에서 멈췄으면 45%입니다.' 그 숫자 차이만큼 충당금(떼일 것에 대비해 쌓아 두는 돈)이 덜 쌓였습니다. 현장 사무소 앞에서는 하도급(큰 건설사가 맡은 공사를 작은 업체에 다시 나눠 맡기는 것) 업체 인부 열한 명이 석 달째 밀린 임금 명세서를 들고 서 있습니다.",
      memo: ["장부상 공정률 62% -- 실제 골조 9층/20층, 약 45%", "공정률 차이만큼 충당금 과소", "하도급 인부 11명, 임금 석 달째 체불", "강태민: 4월부터 현장 지원"],
      triggers: ["injustice", "curiosity", "protection"],
      choices: [
        { id: "c31_branch_site_a", label: "인부들의 밀린 임금 명세부터 한지우에게 보여 준다", effect: { trust: 12, humanCost: -5, legitimacy: 3, time: -4, capital: -3, fatigue: 5 }, next: "c31_branch_site_follow", cognition: { reframing: 2 } },
        { id: "c31_branch_site_b", label: "층수를 세어 장부의 공정률과 대조표를 만든다", effect: { legitimacy: 12, trust: 2, time: -7, humanCost: 3, fatigue: 5 }, next: "c31_branch_site_follow", cognition: { inference: 2 } },
        { id: "c31_branch_site_c", label: "사진만 찍고 서울 검사팀 방으로 서둘러 돌아간다", effect: { time: 6, capital: 5, trust: -4, humanCost: 3, fatigue: -3 }, next: "c31_branch_site_follow", cognition: { risk: 1 } },
      ],
    },
    c31_branch_site_follow: {
      phase: "SIDE DOOR",
      title: "뚜껑에 쓴 영수증",
      speaker: "강태민",
      text: "현장 사무소 전기포트가 끓자 강태민이 컵라면 세 개에 물을 붓습니다. 한지우가 지갑을 꺼내 천 원짜리 한 장과 오백 원짜리 하나를 탁자에 놓습니다. '영수증 주세요.' 강태민이 한참 보다가 컵라면 뚜껑을 뜯어 매직으로 씁니다. '1,500원. 강태민.' 한지우가 그 뚜껑을 검사 수첩에 끼우며 이번 검사에서 처음으로 입꼬리를 올립니다. 그때 인부들의 반장이 문간에 서서 묻습니다. '검사하면 우리 돈 나와요?' 한지우가 젓가락을 내려놓습니다. '검사는 돈을 주지 않습니다.' 사무소가 조용해집니다. 라면 국물만 식어 갑니다.",
      memo: ["컵라면 1,500원 -- 뚜껑 영수증", "한지우의 첫 미소", "반장의 질문: '우리 돈 나와요?'", "검사 결과와 임금 지급은 별개의 절차"],
      triggers: ["affection", "helplessness", "responsibility"],
      choices: [
        { id: "c31_branch_site_follow_a", label: "검사와 따로 밀린 임금 지급 계획을 회사에 요구한다", effect: { trust: 13, humanCost: -6, capital: -7, time: -4, fatigue: 4 }, next: "c31_boxes", cognition: { persistence: 2 } },
        { id: "c31_branch_site_follow_b", label: "임금 체불을 검사 지적 사항에 넣어 달라고 요청한다", effect: { legitimacy: 11, trust: 5, time: -6, humanCost: 2, fatigue: 4 }, next: "c31_boxes", cognition: { inference: 2 } },
        { id: "c31_branch_site_follow_c", label: "지금은 검사가 먼저라며 반장에게 기다려 달라고 한다", effect: { time: 5, capital: 6, trust: -5, humanCost: 4, fatigue: -3 }, next: "c31_boxes", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c31_start",
    result: "c31_aftershock",
    defaultFree: "c31_route_system",
    // One inspection, one ledger. The case is a single line; the split is whose
    // name ends up in the confirmer's box.
    choices: {},
    system: {
      route: "c31_route_system",
      final: "c31_final_system_route",
      title: "먼저 도착한 계정",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 위험관리부 단말에 그룹의 심사 엔진(대출 여부를 자동으로 판단하는 프로그램) 노아의 기록 화면이 열립니다. 평택 PF(미래 분양 대금을 믿고 빌려준 부동산 대출)의 만기 연장(갚을 날짜를 미뤄 주는 것) 네 번, 노아의 권고는 네 번 모두 '거절'이었습니다. 네 번 모두 예외 승인(규칙이 거절한 건을 사람이 직접 통과시키는 것)으로 뒤집혔습니다. 승인 계정 넷 중 하나는 당신의 사번입니다. 날짜는 당신이 이 부서에 오기 사흘 전, 당신 계정이 미리 만들어진 날입니다. '계정은 사람보다 먼저 도착해 있었습니다. 저는 계정을 사람으로 학습했습니다.'",
      memo: ["노아 권고 '거절' 4회 -- 예외 승인 4회", "승인 계정 1개: 당신의 사번", "승인 날짜: 당신이 부서에 오기 사흘 전"],
      routeChoices: [
        ["c31_route_system_report", "내 사번이 쓰인 기록을 한지우에게 먼저 신고한다", { legitimacy: 11, trust: 5, humanCost: 2, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c31_route_system_trace", "계정을 미리 만든 사람을 접속 기록으로 거꾸로 쫓는다", { legitimacy: 7, trust: 3, capital: -4, time: -7, humanCost: -3, fatigue: 6 }, { reframing: 2 }],
        ["c31_route_system_bury", "내 이름이 엮이기 전에 기록 화면을 닫는다", { time: 7, capital: 6, trust: -6, legitimacy: -7, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "예외 승인마다 승인한 사람의 실명을 남기도록 규칙을 바꾸자고 한다", { legitimacy: 13, trust: 6, capital: -7, humanCost: -3, fatigue: 7 }, { reframing: 3 }],
      ["b", "계정 도용은 덮고 연장 손실만 지적 사항으로 남긴다", { capital: 8, time: 6, trust: -5, legitimacy: -7, humanCost: 5, fatigue: -3 }, { risk: 2 }],
      ["c", "도용된 계정의 주인들을 모아 함께 확인서를 쓴다", { trust: 10, legitimacy: 8, capital: -6, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c31_evidence_turn",
    result: "c31_aftershock",
    sourceRoutes: ["c31_archive", "c31_hallway", "c31_rooftop", "c31_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 만기 연장 날짜 옆에 놓고, 라운드힐 매각 협상 일정과 하루씩 맞춰 본다.",
    entryEcho: "날짜를 맞추면 손실이 왜 미뤄졌는지가 보입니다. 누가 그 미룬 값을 받는지도 함께 보입니다.",
    title: "연장의 날짜",
    speaker: "반재욱",
    text: "단서를 맞추자 평택 PF(미래 분양 대금을 믿고 빌려준 부동산 대출)의 만기 연장(갚을 날짜를 미뤄 주는 것) 네 번이 라운드힐 캐피탈과의 매각 협상 일정 옆에 나란히 섭니다. 연장할 때마다 손실은 장부에서 한 분기씩 밀렸고, 그사이 매각 가격 제안서의 자산 가치는 세 번 올랐습니다. 네 번째 연장은 윤상혁의 자문역 조항이 담긴 부속서 초안이 처음 오간 날의 바로 다음 날입니다. 반재욱이 수첩을 덮습니다. '손실을 미룬 게 아니라 값을 올린 겁니다. 산 쪽이 떠안을 손실을, 판 사람이 자문역 연봉으로 받아 가는 거고요.'",
    memo: ["연장 4회 = 매각 협상 4단계와 날짜 일치", "매각 제안서 자산 가치 3회 상승", "4번째 연장: 자문역 부속서 초안 다음 날"],
    triggers: ["injustice", "system", "curiosity"],
    entryEffect: { legitimacy: 4, trust: 5, time: -6, capital: -2, fatigue: 3 },
    choices: [
      ["c31_evidence_turn_link", "연장 날짜와 매각 일정 대조표를 검사 자료에 정식으로 붙인다", { legitimacy: 12, trust: 4, capital: -6, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
      ["c31_evidence_turn_hold", "대조표는 쥐고 있다가 매각 계약 전날 꺼낸다", { capital: 9, time: 5, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c31_evidence_turn_buyers", "212세대 계약자들에게 연장의 이유부터 알린다", { trust: 12, legitimacy: 5, capital: -5, humanCost: -6, time: -5, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c31_branch_site",
    systemNext: "c31_route_system",
    evidenceNext: "c31_evidence_turn",
    routeLabel: "직전 사건의 단체방 역할 분담으로 평택 현장 확인에 사람을 붙인다",
    systemLabel: "직전 자유응답 문장이 검사 요구 목록에도 남았는지 본다",
    evidenceLabel: "직전 단서를 붙여 연장 날짜와 매각 일정을 하루씩 맞춘다",
  },
  openingRoutes: {
    c30_after_warm: "c31_start_warm",
    c30_after_record: "c31_start_record",
    c30_after_rush: "c31_start_rush",
  },
  openingCopy: {
    c31_start_warm: ["셔터 앞에 있던 사람들의 월요일", "도윤하", "일주일 전 새벽, 첫 버스가 올 때까지 헌책방 셔터 앞에 다섯 명과 앉아 있었습니다. 단체방 이름은 그날 '내일도 출근'이 됐습니다. 6월 8일 월요일 오전 9시, KD캐피탈 로비에 검은 캐리어 일곱 개가 들어옵니다. 금융감독원 정기검사(금융감독원이 몇 년마다 금융회사의 장부와 업무를 통째로 들여다보는 점검)입니다. 단체방에 '검사 들어옴'을 올리자 5초 만에 답이 네 개 달리고, 읽음 숫자가 하나 더 줄어듭니다. 반재욱입니다. 맨 앞의 검사역(금융감독원에서 나와 회사를 직접 점검하는 사람) 한지우는 당신 목에 걸린 '검사 대응 담당' 표찰을 보자마자 말합니다. '대표가 고른 담당이시네요. 위험관리부 자료는 두 번 확인합니다.'", ["단체방 '내일도 출근' -- 답장 4개, 읽음 1", "금융감독원 현장 검사 5일, 팀장 한지우", "검사 대응 담당: 당신, 윤상혁 지정"]],
    c31_start_record: ["빈칸을 남긴 사람의 월요일", "한지우", "일주일 전 당신은 단체방의 기록 규칙과 증거 목록을 여섯 칸짜리 문서로 남겼습니다. 반재욱의 칸은 지우지 않고 비워 둔 채였습니다. 6월 8일 월요일, 금융감독원 정기검사(금융감독원이 몇 년마다 금융회사의 장부와 업무를 통째로 들여다보는 점검) 첫날, 손에 익은 그 형식 그대로 만든 제출 목록을 내밀자 검사역(금융감독원에서 나와 회사를 직접 점검하는 사람) 한지우가 한 칸에서 형광펜을 멈춥니다. '이 빈칸은 뭡니까. 빈칸이 있는 목록은 두 번 확인합니다. 빈칸에는 보통 이유가 있으니까요.' 목록 여백에 질문 번호가 벌써 열한 개 매겨져 있습니다.", ["제출 목록 -- 여섯 칸 형식, 빈칸 하나", "한지우: '빈칸에는 보통 이유가 있다'", "목록 여백의 질문 11개"]],
    c31_start_rush: ["먼저 출근한 사람의 접속 기록", "한지우", "일주일 전 당신은 검사 대응 담당 자리를 받아 첫차로 KD캐피탈에 출근했습니다. 그날 윤상혁의 대표실 문은 처음으로 열려 있었습니다. 그 뒤 일주일, 대응 자료를 만드느라 매일 새벽까지 부서 공유 폴더를 열었습니다. 6월 8일 월요일, 금융감독원 정기검사(금융감독원이 몇 년마다 금융회사의 장부와 업무를 통째로 들여다보는 점검)가 들어옵니다. 검사역(금융감독원에서 나와 회사를 직접 점검하는 사람) 한지우가 가장 먼저 요구한 자료는 지난 일주일의 부서 접속 기록입니다. 출력된 종이 맨 위에 당신 이름과 '04:02'가 찍혀 있습니다. 한지우가 그 줄에 밑줄을 긋습니다.", ["지난 일주일 접속 기록 -- 맨 위에 당신", "마지막 접속 04:02", "한지우의 첫 밑줄"]],
  },
  openingSignatures: {
    c31_start_warm: {
      label: "단체방 다섯 명에게 요구 자료를 나눠 맡긴다",
      effect: { trust: 10, legitimacy: 4, humanCost: 2, time: -4, capital: -3, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "단체방 다섯 명에게, 요구 자료를 나눠 맡긴다.",
      echo: "다섯 명이 각자 자리에서 자료를 찾기 시작합니다. 읽기만 하던 반재욱도 한 건을 가져갑니다. 다섯 자리가 모두 KD금융그룹 안이라는 건, 다섯 명 모두 걸릴 수 있다는 뜻입니다.",
    },
    c31_start_record: {
      label: "빈칸의 이유까지 적어 제출 목록을 원본과 대조한다",
      effect: { legitimacy: 11, trust: 3, time: -7, humanCost: 2, fatigue: 5 },
      cognition: { inference: 2 },
      voice: "빈칸의 이유까지 적어, 제출 목록을 한지우 앞에서 원본과 대조한다.",
      echo: "대조는 두 시간이 걸립니다. 빈칸의 이유를 적는 칸에서 당신은 반재욱의 이름을 쓰지 않습니다. 한지우는 믿는다고 말하지 않고, 체크 표시만 열한 개 늘립니다.",
    },
    c31_start_rush: {
      label: "새벽마다 무엇을 열어 봤는지 접속 기록을 먼저 설명한다",
      effect: { legitimacy: 9, trust: 5, capital: -3, time: -3, humanCost: 3, fatigue: 3 },
      cognition: { persistence: 2 },
      voice: "새벽마다 무엇을 열어 봤는지, 접속 기록부터 먼저 설명한다.",
      echo: "설명하면 한지우가 연 파일 이름을 하나씩 받아 적습니다. 그 목록이 그대로 검사팀의 두 번째 요구 자료가 됩니다.",
    },
  },
  voiceLines: {
    // CASE 31. The regulator in the room. Every line is said to someone who
    // writes the time down next to it.
    c31_start_face: "숨길 게 없다며, 한지우를 먼저 찾아가 내 자리와 사정을 솔직히 말한다.",
    c31_start_raw: "요구 자료 148건은, 정리본 대신 원본으로 낸다.",
    c31_start_clean: "기한이 먼저라며, 비서실장이 만든 정리본을 그대로 넘긴다.",
    c31_archive_answer: "실무자 이름은 빼 달라고 하고, 질문에는 내가 답한다.",
    c31_archive_trace: "질문마다, 서류 쪽수와 도장 날짜로만 답한다.",
    c31_archive_brief: "비서실장이 써 둔 답변서를, 그대로 읽어 준다.",
    c31_branch_site_a: "인부들의 밀린 임금 명세부터, 한지우에게 보여 준다.",
    c31_branch_site_b: "층수를 세어, 장부의 공정률과 대조표를 만든다.",
    c31_branch_site_c: "사진만 찍고, 서울 검사팀 방으로 서둘러 돌아간다.",
    c31_branch_site_follow_a: "검사와 따로, 밀린 임금 지급 계획을 회사에 요구한다.",
    c31_branch_site_follow_b: "임금 체불을, 검사 지적 사항에 넣어 달라고 요청한다.",
    c31_branch_site_follow_c: "지금은 검사가 먼저라며, 반장에게 기다려 달라고 한다.",
    c31_hallway_vouch: "반재욱 대신, 내가 이 서류의 출처가 되겠다고 한다.",
    c31_hallway_channel: "반재욱이 감사팀 이름으로, 정식 제출하게 한다.",
    c31_hallway_drop: "분실물로 두고, 한지우가 알아서 쓰게 맡긴다.",
    c31_rooftop_share: "15쪽을 쓴 사람으로서, 그날의 이야기를 털어놓는다.",
    c31_rooftop_reopen: "그때의 질문서를, 이번 검사 자료에 다시 붙이자고 한다.",
    c31_rooftop_lever: "그 미안함을 지렛대 삼아, 검사 결과를 앞당겨 달라고 한다.",
    c31_final_shield: "최서진의 이름을 실무자 칸에서 빼는 조건으로, 서명한다.",
    c31_final_sign: "확인자 서명란에 내 이름을 쓰고, 사실 그대로 확인한다.",
    c31_final_wait: "서명은 미루고, 소명 기간 동안 안에서 더 모은다.",
    c31_after_warm: "오늘 밤은 헌책방에 모여, 동료들과 검사의 끝을 함께 보낸다.",
    c31_after_record: "검사 닷새의 모든 질문과 답을, 날짜순 기록으로 남긴다.",
    c31_after_rush: "상자가 오기 전에, 평택 원본을 챙기러 곧장 자료실로 간다.",
    c31_route_system_report: "내 사번이 쓰인 기록을, 한지우에게 먼저 신고한다.",
    c31_route_system_trace: "계정을 미리 만든 사람을, 접속 기록으로 거꾸로 쫓는다.",
    c31_route_system_bury: "내 이름이 엮이기 전에, 기록 화면을 닫는다.",
    c31_final_system_route_a: "예외 승인마다, 승인한 사람의 실명을 남기도록 규칙을 바꾸자고 한다.",
    c31_final_system_route_b: "계정 도용은 덮고, 연장 손실만 지적 사항으로 남긴다.",
    c31_final_system_route_c: "도용된 계정의 주인들을 모아, 함께 확인서를 쓴다.",
    c31_evidence_turn_link: "연장 날짜와 매각 일정 대조표를, 검사 자료에 정식으로 붙인다.",
    c31_evidence_turn_hold: "대조표는 쥐고 있다가, 매각 계약 전날 꺼낸다.",
    c31_evidence_turn_buyers: "212세대 계약자들에게, 연장의 이유부터 알린다.",
  },
  echoReplies: {
    // CASE 31.
    c31_start_face: "솔직하게 말하면 한지우가 받아 적습니다. 믿는다는 뜻이 아니라, 닷새 뒤에 같은 질문을 다시 하겠다는 뜻입니다.",
    c31_start_raw: "원본을 내면 석재우의 USB는 당신 서랍에 남습니다. 비서실장은 그날 오후 내내 당신 자리를 두 번 지나갑니다.",
    c31_start_clean: "정리본은 깔끔합니다. 한지우는 첫 장을 넘기자마자 쪽수가 다시 매겨졌다는 걸 알아봅니다.",
    c31_archive_answer: "이름을 빼 달라는 부탁에 한지우가 대답하지 않습니다. 대신 질문 43번부터는 당신에게만 묻습니다.",
    c31_archive_trace: "쪽수와 날짜는 흔들리지 않습니다. 새벽 4시, 한지우가 처음으로 '확인했습니다'라고 말합니다.",
    c31_archive_brief: "답변서는 막힘이 없습니다. 한지우는 답변서 셋째 줄의 문장이 작년 다른 회사 답변서와 똑같다는 걸 압니다.",
    c31_branch_site_a: "명세서를 받은 한지우가 인부 열한 명의 이름을 하나씩 읽습니다. 검사 수첩에 처음으로 숫자 아닌 것이 적힙니다.",
    c31_branch_site_b: "대조표는 단단합니다. 17% 차이가 표 한가운데 빨간 칸으로 남습니다. 인부들은 그 칸에 들어 있지 않습니다.",
    c31_branch_site_c: "사진은 선명합니다. 크레인 아래 서 있던 사람들의 얼굴은 사진 가장자리에서 잘립니다.",
    c31_branch_site_follow_a: "요구는 회사로 올라갑니다. 석재우는 '검사 기간에는 어떤 지급도 안 된다'는 답을 사흘 만에 보냅니다.",
    c31_branch_site_follow_b: "지적 사항이 되면 체불은 기록에 남습니다. 기록이 돈이 되는 날은 검사가 끝나고도 한참 뒤입니다.",
    c31_branch_site_follow_c: "반장이 고개를 끄덕입니다. '기다리는 건 잘해요, 우리.' 식은 라면을 끝까지 먹고 나갑니다.",
    c31_hallway_vouch: "당신 이름이 출처 칸에 들어갑니다. 반재욱은 안전해지고, 석재우의 다음 면담 대상은 당신이 됩니다.",
    c31_hallway_channel: "정식 제출은 감사팀장 승인을 거쳐야 합니다. 반재욱은 '지방 순회 중'이라는 이유로 사흘을 기다립니다.",
    c31_hallway_drop: "분실물은 한지우의 서랍에 들어갑니다. 쓸 수 있을지는 한지우만 압니다. 반재욱은 계단에서 연습을 한 번 더 합니다.",
    c31_rooftop_share: "이야기를 들은 한지우가 바나나우유를 끝까지 마십니다. '그럼 우리 둘 다 한 번씩만 한 거네요.'",
    c31_rooftop_reopen: "그때의 질문서가 다시 붙으면, 한지우의 이름도 그 서류에 다시 남습니다. 그는 잠깐 망설이다 고개를 끄덕입니다.",
    c31_rooftop_lever: "한지우가 당신을 오래 봅니다. '미안함으로 당길 수 있는 날짜는 없습니다.' 그래도 다음 날 일정표가 하루 당겨져 있습니다.",
    c31_final_shield: "최서진의 이름이 지워지고 당신의 이름이 남습니다. 최서진은 복도 끝에서 한참 울다가 웃습니다.",
    c31_final_sign: "서명란이 채워집니다. 그날 저녁 석재우가 당신 책상 위의 명패를 말없이 반듯하게 돌려놓습니다.",
    c31_final_wait: "서명은 석 달 뒤로 갑니다. 그동안 모을 수 있는 것과, 그동안 파쇄될 수 있는 것이 함께 늘어납니다.",
    c31_after_warm: "헌책방 1층에 불이 늦게까지 켜집니다. 최서진이 처음으로 그 문을 열고 들어옵니다.",
    c31_after_record: "날짜순 기록은 누가 와도 같은 순서로 읽힙니다. 다음 주에 올 사람들에게도 그렇습니다.",
    c31_after_rush: "자료실 문은 아직 열립니다. 원본 상자를 드는 순간, 당신 이름이 출입 기록 맨 위에 다시 찍힙니다.",
    c31_route_system_report: "신고하면 한지우는 당신 사번을 질문 목록 맨 위에 올립니다. 믿기 위해서가 아니라 지우지 않기 위해서입니다.",
    c31_route_system_trace: "거꾸로 쫓으면 계정 생성 요청서가 나옵니다. 요청자 칸은 비어 있고, 승인자 칸에 도장이 있습니다.",
    c31_route_system_bury: "화면을 닫아도 기록은 남습니다. 다음에 그 기록을 여는 사람은 당신이 아닐 수 있습니다.",
    c31_final_system_route_a: "실명 규칙이 생기면 예외 승인은 줄어듭니다. 줄어든 만큼, 노아의 거절이 그대로 사람에게 닿습니다.",
    c31_final_system_route_b: "손실은 지적되고 계정은 조용해집니다. 다음 예외 승인도 이름 없는 계정으로 들어올 수 있습니다.",
    c31_final_system_route_c: "계정 주인 네 명 중 세 명이 모입니다. 나머지 한 명은 이미 회사를 떠났습니다.",
    c31_evidence_turn_link: "대조표가 붙으면 한지우의 지적 사항에 날짜가 생깁니다. 날짜가 생긴 의혹은 검찰이 좋아하는 모양입니다.",
    c31_evidence_turn_hold: "쥐고 있는 동안 대조표는 무기가 됩니다. 그동안 212세대는 이자를 한 달치 더 냅니다.",
    c31_evidence_turn_buyers: "계약자들은 처음으로 이유를 듣습니다. 이유를 들은 사람들이 모이기 시작하고, 그 모임은 검사 일정보다 빠릅니다.",
  },
  characterProfiles: {
    한지우: {
      role: "금융감독원 검사역 · KD캐피탈 정기검사 팀장",
      stance: "원칙 · 숫자 · 한 번만 했던 질문",
      job: "분석관을 믿지 않는 사람으로 들어와, 끝내 같은 서명란 앞에 선다. 검사는 돈을 주지 않는다는 말을 누구보다 먼저, 누구보다 괴롭게 한다.",
      appearance: "검은 캐리어, 번호를 매긴 질문 수첩, 뚜껑을 잃어버린 형광펜 세 자루, 자기 돈으로 산 바나나우유와 그 영수증.",
      thought: "사람의 말은 지워져도 숫자는 남는다. 그때 나는 그 질문을 한 번만 했다.",
      gesture: "대답을 들으면 수첩에 시각을 분 단위로 적는다. 믿는다는 뜻이 아니라, 나중에 다시 묻겠다는 뜻이다.",
      voice: "숫자와 규정으로만 말하고, 마음이 흔들릴수록 질문에 번호를 붙인다.",
      line: "기분 나쁘셔도 됩니다. 규정입니다. 질문 42번 드리겠습니다.",
    },
    석재우: {
      role: "KD캐피탈 대표이사실 비서실장 (윤상혁 대표 직속)",
      stance: "정리 · 충성 · 부드러운 압박",
      job: "윤상혁 아래에서 서류를 '정리본'으로 만든다. 한 번도 목소리를 높이지 않고 사람의 자리를 흔든다.",
      appearance: "소매를 두 번 접은 흰 셔츠, 목에 건 USB, 소리 나지 않는 구두.",
      thought: "정리는 거짓말이 아니다. 보는 사람을 편하게 해 주는 일이다.",
      gesture: "위협할 때일수록 상대 어깨의 먼지를 털어 준다.",
      voice: "부탁하는 말투로 지시하고, 칭찬하는 말투로 경고한다.",
      line: "정리본이야. 검사역님 편하시게. 자네도 편하고.",
    },
  },
  setting: { place: "KD캐피탈 본사 · 로비", clock: "6월 8일 월요일 · 현장 검사 1일차" },
  sceneContext: {
    c31_start: {
      place: "KD캐피탈 본사 · 로비",
      clock: "6월 8일 월요일 · 09:00 · 현장 검사 1일차",
      question: "검사역이 당신 부서의 자료는 두 번 확인하겠다고 합니다. 손에는 비서실장이 준 정리본이 있습니다. 무엇부터 하겠습니까?",
      lead: "흩어진 지 두 달, 당신의 자리는 KD캐피탈 위험관리부입니다. 윤상혁은 당신을 이번 검사의 대응 담당으로 직접 지정했습니다.",
    },
    c31_start_warm: {
      place: "KD캐피탈 본사 · 로비",
      clock: "6월 8일 월요일 · 09:00 · 현장 검사 1일차",
      question: "'내일도 출근' 단체방의 다섯 명이 기다립니다. 검사 첫날을 누구와 어떻게 나누겠습니까?",
      lead: "셔터 앞의 그 새벽 이후 일주일, 단체방은 하루도 조용한 날이 없었습니다.",
    },
    c31_start_record: {
      place: "KD캐피탈 본사 · 로비",
      clock: "6월 8일 월요일 · 09:00 · 현장 검사 1일차",
      question: "제출 목록의 빈칸 하나에서 검사역의 형광펜이 멈췄습니다. 그 빈칸을 어떻게 설명하겠습니까?",
      lead: "여섯 칸짜리 문서를 만든 지 일주일, 그 형식이 손에 익었습니다.",
    },
    c31_start_rush: {
      place: "KD캐피탈 본사 · 로비",
      clock: "6월 8일 월요일 · 09:00 · 현장 검사 1일차",
      question: "지난 일주일 접속 기록 맨 위에 당신 이름이 있습니다. 이 밑줄에 어떻게 답하겠습니까?",
      lead: "대응 담당 명패를 받은 지 일주일, 매일 새벽까지 12층에 남았습니다.",
    },
    c31_archive: {
      place: "KD캐피탈 지하 1층 · 자료실",
      clock: "현장 검사 1일차 · 23:40",
      question: "연장 승인 도장이 전부 당신 부서 것입니다. 질문 42번에 누구의 이름으로 답하겠습니까?",
      lead: "첫날 밤, 검사팀이 자료실을 통째로 빌렸고 당신은 부서 대표로 불려 내려왔습니다.",
    },
    c31_branch_site: {
      place: "평택 오피스텔 공사 현장 · 타워크레인 아래",
      clock: "현장 검사 2일차 · 10:30",
      question: "장부의 62%와 눈앞의 9층 사이에 17%가 비어 있습니다. 이 현장에서 무엇을 먼저 보여 주겠습니까?",
    },
    c31_branch_site_follow: {
      place: "평택 공사 현장 · 현장 사무소",
      clock: "현장 검사 2일차 · 13:00",
      question: "검사는 돈을 주지 않는다는 말에 반장이 조용해졌습니다. 이 사무소를 어떻게 나서겠습니까?",
    },
    c31_boxes: {
      place: "KD캐피탈 지하 1층 · 자료실 안쪽 서고",
      clock: "현장 검사 3일차 · 03:10",
      question: "검사 통보 전날 폐기 승인이 난 상자 일곱 개가 모레 파쇄됩니다. 이 상자를 어떻게 하겠습니까?",
    },
    c31_boxes_reaction: {
      place: "KD캐피탈 12층 · 복도",
      clock: "현장 검사 3일차 · 07:20",
      question: "비서실장이 규정을 말하며 최서진의 이름을 꺼냈습니다. 이 부드러운 경고에 어떻게 답하겠습니까?",
    },
    c31_hallway: {
      place: "KD캐피탈 12층 · 검사팀 회의실 앞 복도",
      clock: "현장 검사 3일차 · 14:00",
      question: "세 번 떨어진 서류철이 출처 없는 분실물이 될 참입니다. 누가 이 서류의 이름이 되겠습니까?",
      lead: "반재욱이 '서울 출장'이라며 올라왔다는 문자를 받고 복도로 나왔습니다. 그는 이미 서류철을 한 번 떨어뜨린 참입니다.",
    },
    c31_buyer: {
      place: "KD캐피탈 12층 · 엘리베이터 앞 복도",
      clock: "현장 검사 3일차 · 18:30",
      question: "입주 날짜가 지난 계약자가 그 건물이 지금 몇 층이냐고 묻습니다. 어떻게 하겠습니까?",
    },
    c31_buyer_reaction: {
      place: "KD캐피탈 12층 · 복도 창가",
      clock: "현장 검사 3일차 · 19:00",
      question: "검사역이 212세대 계약자 명단을 달라고 합니다. 그 이름들을 어떻게 건네겠습니까?",
    },
    c31_rooftop: {
      place: "KD캐피탈 본사 · 옥상",
      clock: "현장 검사 4일차 · 22:10",
      question: "사라진 15쪽을 한 번만 물었던 사람이 당신 앞에 있습니다. 그 고백에 어떻게 답하겠습니까?",
      lead: "한지우가 옥상에서 잠깐 보자고 했습니다. 검사 나흘 만에 처음으로 번호 없는 말입니다.",
    },
    c31_chat: {
      place: "회기동 헌책방 1층 · 책장 사이",
      clock: "현장 검사 5일차 · 03:00",
      question: "새벽 단체방에 다섯 사람의 자료가 쏟아졌습니다. 이 자료를 누구의 이름으로 내겠습니까?",
    },
    c31_chat_reaction: {
      place: "KD캐피탈 본사 · 엘리베이터",
      clock: "현장 검사 5일차 · 07:40",
      question: "대표가 당신 층 버튼을 대신 누르며 서명란 얘기는 아직이라고 합니다. 문이 열리기 전에 무엇을 하겠습니까?",
    },
    c31_route_system: {
      place: "KD캐피탈 12층 위험관리부 · 심사 단말",
      clock: "현장 검사 2일차 · 새벽",
      question: "당신이 오기 사흘 전에 당신 사번으로 예외 승인이 나 있습니다. 이 기록을 어떻게 하겠습니까?",
    },
    c31_final_system_route: {
      place: "KD캐피탈 12층 위험관리부 · 심사 단말",
      clock: "현장 검사 마지막 날 · 새벽",
      question: "사람보다 먼저 도착한 계정들을 어떻게 다루는 규칙을 남기겠습니까?",
    },
    c31_evidence_turn: {
      place: "KD캐피탈 지하 1층 · 기록실",
      clock: "현장 검사 마지막 날 · 07:00",
      question: "손실을 미룬 날짜가 매각 값을 올린 날짜와 겹칩니다. 이 대조표를 어떻게 쓰겠습니까?",
    },
    c31_final: {
      place: "KD캐피탈 12층 · 검사팀 회의실",
      clock: "현장 검사 마지막 날 · 16:00",
      question: "확인자 서명란이 비어 있고, 실무자 칸에는 최서진의 이름이 있습니다. 어떻게 서명하겠습니까?",
      lead: "검사팀이 캐리어를 싸기 두 시간 전, 한지우가 당신만 따로 불렀습니다.",
    },
    c31_aftershock: {
      place: "KD캐피탈 본사 · 로비",
      clock: "6월 12일 금요일 · 현장 검사 종료 · 18:00",
      question: "검사팀이 떠나고 다음 주에 상자가 많이 필요할 거라는 문자가 왔습니다. 이 밤을 어떻게 보내겠습니까?",
    },
  },
  clue: {
    id: "c31-extension-dates",
    title: "연장의 날짜",
    text: "평택 PF의 만기 연장 네 번은 라운드힐 매각 협상 네 단계와 날짜가 맞았습니다. 네 번째 연장은 윤상혁의 자문역 부속서 초안이 오간 다음 날이었습니다.",
  },
  outcomes: {
    c31_after_warm: { tag: "곁에 남은 결말", title: "검사가 끝난 밤, 헌책방 1층에 최서진이 처음 왔다", text: "닷새의 검사가 끝난 밤, 여섯 명과 최서진이 헌책방 1층에 모였습니다. 한서윤의 도시락 일곱 개는 이번에는 남김없이 비었습니다." },
    c31_after_record: { tag: "기록으로 남긴 결말", title: "닷새의 질문과 답이 날짜순으로 한 권이 됐다", text: "질문 1번부터 마지막 번호까지, 누가 언제 무엇을 답했는지가 한 권의 기록으로 묶였습니다. 다음 주에 올 사람들도 같은 순서로 읽게 됩니다." },
    c31_after_rush: { tag: "먼저 내려간 결말", title: "상자가 오기 전에 평택 원본을 먼저 챙겼다", text: "당신은 동료들의 연락을 뒤로하고 자료실로 내려가 원본 상자를 확보했습니다. 출입 기록 맨 위에는 다시 당신 이름이 찍혔습니다." },
  },
  carryovers: {
    c31_after_warm: { trust: 9, humanCost: -4, fatigue: -6 },
    c31_after_record: { legitimacy: 11, trust: 3, fatigue: 6 },
    c31_after_rush: { capital: 5, legitimacy: 5, trust: -7 },
  },
  continuityChallenges: {
    c30_after_warm: { id: "protect-trust", title: "셔터 앞의 여섯 명과 같이 검사 받기", text: "여섯 명은 첫 버스가 올 때까지 함께 있었습니다. 검사역 앞에 혼자가 아니라 여섯이 함께 서면서도, 누구도 다치지 않는 선택을 찾아야 보너스가 열립니다." },
    c30_after_record: { id: "use-reframe", title: "빈칸 있는 목록을 증거로 바꾸기", text: "당신이 만든 목록의 빈칸이 검사역에게는 의심의 이유가 됐습니다. 그 빈칸이 무엇을 지키는지 판을 다시 짜서 보여 줘야 합니다." },
    c30_after_rush: { id: "repair-legitimacy", title: "대표가 고른 담당의 공정함 회복하기", text: "윤상혁이 지정한 자리에서 일주일 동안 새벽마다 부서 폴더를 연 기록이 남았습니다. 그 일주일을 검사역 앞에서 떳떳하게 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
