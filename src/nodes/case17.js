/**
 * CASE 17 -- the notebook of names, and the man who kept it.
 *
 * 반재욱 has been the season's quiet ledger: the auditor who writes down every
 * person he cut, because erasing a name would mean he never cut them. Sixteen
 * cases have used that notebook as evidence, as leverage, as a thing handed
 * across a table. This case turns it back into what it is -- forty-seven people
 * -- and gives 반재욱 the arc the rest of the team has already had.
 *
 * In December the group's legal team claims the notebook as "company records"
 * and moves to put it before an HR committee as proof that the analyst steered
 * audits. 반재욱 decides to visit the names before anyone else reads them. The
 * first is 정태오, fired seven years ago for writing down what his branch
 * manager told him to do and now selling rice-cake skewers out of a food truck;
 * one name has a second line through it, because the man behind it has died.
 * The legal team retitles the list "people the analyst interfered with", and
 * the old audit rule -- the hand that wrote it down is the hand that pays --
 * comes back aimed at the auditor himself.
 *
 * The laughter is 반재욱 in a navy coat shaking a sauce tub so earnestly that
 * customers take him for the new part-timer, his daughter 반서아 rating every
 * name with star stickers, and 권도현 billing a bowl of 짬뽕 to "investigation".
 * The anger is the retitled list and a footnote that counts silence as consent;
 * the sorrow is a closed office in 문래동 and a diary line that says "tell them
 * it wasn't me". The joy is 정태오 telling 반재욱 that the notebook was the one
 * place his name was written down truthfully. The case ends on what to do with
 * the notebook -- court, owners, or fire -- and a phone call from 브릿지은행
 * that opens 사건 18.
 */
export const case17Nodes = {
  c17_start: {
    phase: "CASE 17 BRIEFING",
    title: "회사 기록물",
    speaker: "반재욱",
    text:
      "12월 둘째 주 월요일, 반재욱이 봉투 두 개를 책상에 올려놓습니다. 하나는 2주 전 그룹 법무팀이 보낸 내용증명(누가 언제 어떤 내용을 보냈는지 우체국이 증명해 주는 우편)입니다. 요구는 두 줄입니다. 감사팀 시절 쓴 수첩은 회사 기록물이니 돌려줄 것. 그리고 그 수첩을 12월 19일 인사위원회(직원의 징계나 자리 이동을 정하는 회의)에 당신의 '부당 조사 개입' 증거로 낼 것. 다른 하나는 오늘 온 법원 문서제출명령(법원이 상대에게 가진 문서를 내라고 명령하는 것) 신청서 사본입니다. 반재욱이 표지가 닳은 검은 수첩을 봉투 옆에 놓습니다. '마흔일곱 명입니다. 20년 동안 제가 내보낸 사람들이요. 회사는 이걸 자기 물건이라고 합니다.' 그가 수첩을 펴지 않은 채 말합니다. '넘기기 전에 한 명씩 찾아가 보려고 합니다. 같이 가시겠습니까.'",
    memo: [
      "법무팀 내용증명: 수첩은 '회사 기록물'",
      "12월 19일 인사위원회 -- 안건: 당신의 부당 조사 개입",
      "수첩 속 이름 47명, 맨 뒷장에 연필로 쓴 한 줄",
      "법원 문서제출명령 심문까지 5일",
    ],
    triggers: ["injustice", "responsibility", "trust"],
    choices: [
      {
        id: "c17_start_visit",
        label: "반재욱과 함께 수첩 속 사람들을 먼저 찾아간다",
        effect: { trust: 12, humanCost: -5, time: -5, capital: -3, fatigue: 5 },
        next: "c17_truck",
        cognition: { persistence: 2 },
      },
      {
        id: "c17_start_clause",
        label: "내용증명의 '회사 기록물' 근거부터 하나씩 따진다",
        effect: { legitimacy: 11, time: -4, trust: -3, humanCost: 2, fatigue: 3 },
        next: "c17_truck",
        cognition: { inference: 2 },
      },
      {
        id: "c17_start_self",
        label: "수첩 얘기는 빼고 내 징계 건만 해명서로 빨리 정리한다",
        effect: { time: 6, capital: 7, legitimacy: -5, trust: -3, humanCost: 3, fatigue: -2 },
        next: "c17_truck",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c17_truck",
      },
    ],
  },
  c17_truck: {
    phase: "FIELD VISIT",
    title: "소스 통",
    speaker: "정태오",
    text:
      "12월 눈발이 날리는 상암동 공원 주차장, 트럭 옆면에 '태오네 떡꼬치'라는 손글씨가 붙어 있습니다. 수첩 첫 장의 이름, 7년 전 해고된 정태오 대리입니다. 그는 반재욱을 알아보고도 꼬치 뒤집는 손을 멈추지 않습니다. '공짜로 드릴게요. 대신 저거 흔들어요.' 반재욱이 감색 코트 차림 그대로 소스 통을 흔듭니다. 너무 성실하게 흔들어서, 줄 선 손님이 '새로 온 알바세요?' 하고 묻습니다. 반재욱이 '임시직입니다'라고 대답합니다. 줄이 끊기자 정태오가 앞치마에 손을 닦습니다. '나 왜 잘렸는지 알아요? 지점장이 불러 준 걸 받아 적었어요. 대출 서류 날짜를 당기라는 말이요. 감사가 오니까 내 글씨만 남더라고요.' 그가 반재욱을 봅니다. '그 수첩에, 나는 뭐라고 적혀 있어요?'",
    memo: [
      "정태오: 전 KD은행 구로지점 기업대출 대리, 7년 전 해고",
      "해고 사유: 대출 서류 날짜 변경 -- 업무 수첩에 본인 글씨",
      "지시한 지점장은 징계 없이 정년퇴임",
      "트럭 하루 매출 38만 원, 오늘은 소스 통 담당 1명 추가",
    ],
    triggers: ["injustice", "affection", "selfAwareness"],
    choices: [
      {
        id: "c17_truck_stay",
        label: "영업이 끝날 때까지 소스 통을 흔들고 나서 수첩을 편다",
        effect: { trust: 12, humanCost: -4, time: -5, capital: -2, fatigue: 6 },
        next: "c17_office",
        cognition: { persistence: 2 },
      },
      {
        id: "c17_truck_report",
        label: "7년 전 감사 보고서와 수첩의 그 줄을 나란히 보여 준다",
        effect: { legitimacy: 11, trust: 3, time: -4, humanCost: 2, fatigue: 4 },
        next: "c17_office",
        cognition: { inference: 2 },
      },
      {
        id: "c17_truck_consent",
        label: "법무팀 서류부터 보여 주고 제출 동의서를 받는다",
        effect: { time: 6, capital: 5, legitimacy: 2, trust: -4, humanCost: 4, fatigue: -3 },
        next: "c17_office",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c17_office",
      },
    ],
  },
  c17_office: {
    phase: "THE NAMES",
    title: "두 줄",
    speaker: "하은경",
    text:
      "문래동 상가 3층 복도 끝, 유리문에 '하윤재 세무회계'라는 시트지가 반쯤 떨어져 있습니다. 수첩에서 유일하게 줄이 두 개 그어진 이름입니다. 6년 전 해고된 뒤 이 사무실을 열었고, 작년 봄 과로로 쓰러져 세상을 떠났습니다. 누나 하은경이 폐업 정리를 하러 와 있습니다. 반재욱이 이름을 말하자 그가 들고 있던 상자를 내려놓습니다. '동생은 가족한테 해고됐다고 한 적이 없어요. 자기가 그만뒀다고 했어요. 은행이 답답해서 나왔다고.' 책상 서랍에서 낡은 다이어리가 나옵니다. 6년 전 3월의 한 칸에 이렇게 적혀 있습니다. '반재욱 조사역 면담. 내가 한 게 아니라고 말할 것.' 하은경이 다이어리를 반재욱 쪽으로 밉니다. '말했어요? 우리 동생이, 그날?'",
    memo: [
      "하윤재: 전 KD은행 대리, 6년 전 해고, 작년 봄 사망",
      "가족은 해고 사실을 몰랐음 -- '스스로 그만둠'",
      "다이어리 한 줄: '내가 한 게 아니라고 말할 것'",
      "수첩 47명 중 연락 닿지 않음 3명, 사망 1명",
    ],
    triggers: ["helplessness", "responsibility", "selfAwareness"],
    choices: [
      {
        id: "c17_office_truth",
        label: "그날 면담에서 그가 한 말을 누나에게 그대로 전한다",
        effect: { trust: 12, humanCost: -5, legitimacy: -3, time: -4, fatigue: 6 },
        next: "c17_legal",
        cognition: { persistence: 2 },
      },
      {
        id: "c17_office_record",
        label: "6년 전 조사 기록을 열어 그의 말이 어디에 남았는지 찾는다",
        effect: { legitimacy: 12, trust: 4, time: -5, humanCost: 2, fatigue: 4 },
        next: "c17_legal",
        cognition: { inference: 2 },
      },
      {
        id: "c17_office_leave",
        label: "유족에게 더 묻지 않고 수첩에 '사망'만 적고 나온다",
        effect: { time: 7, capital: 4, trust: -4, humanCost: 3, fatigue: -4 },
        next: "c17_legal",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c17_legal",
      },
    ],
  },
  c17_legal: {
    phase: "CONFRONTATION",
    title: "첨부 목록",
    speaker: "반재욱",
    text:
      "KD금융그룹 본사 법무팀 회의실. 변호사 둘이 서류철을 밀어 줍니다. 제목은 '분석관 부당 조사 개입 관련 증거 목록', 첨부 3번이 수첩입니다. 그 아래 47명의 이름이 새로 타이핑돼 있고, 표 제목이 바뀌어 있습니다. '분석관이 조사에 개입한 대상자.' 정태오의 칸에는 '업무 문서 위조로 해고'라고만 적혀 있습니다. 누가 불러 줬는지는 어디에도 없습니다. 수석변호사가 부드럽게 말합니다. '수첩만 주시면 반 선생님은 이 목록에서 빼 드리겠습니다. 이미 퇴직하셨으니까요.' 반재욱이 펜을 내려놓습니다. 20년 동안 그가 쓰던 바로 그 형식입니다. 받아 적은 사람만 남고, 불러 준 사람은 없는 표. 그가 당신을 봅니다. '이번엔 제가 받아 적는 쪽이군요.'",
    memo: [
      "증거 목록 첨부 3번: 반재욱 수첩",
      "표 제목 변경: '분석관이 조사에 개입한 대상자'",
      "정태오 칸: '업무 문서 위조로 해고' -- 지시한 사람 없음",
      "제안: 수첩을 내면 반재욱은 목록에서 제외",
    ],
    triggers: ["injustice", "manipulation", "revenge"],
    choices: [
      {
        id: "c17_legal_walk",
        label: "제출에 반대한 17명의 이름을 대며 자리에서 일어선다",
        effect: { trust: 12, legitimacy: 4, capital: -5, time: -4, humanCost: -3, fatigue: 5 },
        next: "c17_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c17_legal_basis",
        label: "표 제목을 바꾼 사람과 그 근거를 서면으로 요구한다",
        effect: { legitimacy: 12, trust: -2, time: -5, humanCost: 2, fatigue: 4 },
        next: "c17_final",
        cognition: { inference: 2 },
      },
      {
        id: "c17_legal_deal",
        label: "반재욱을 빼 준다는 제안을 받고 사본만 넘기자고 한다",
        effect: { time: 7, capital: 6, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -3 },
        next: "c17_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c17_final",
      },
    ],
  },
  c17_final: {
    phase: "FINAL DECISION",
    title: "마흔일곱 개의 이름",
    speaker: "반재욱",
    text:
      "12월 19일 아침, 인사위원회실 앞 복도. 법무팀 변호사가 시계를 봅니다. 10시까지 수첩이 탁자에 오르지 않으면 법원의 문서제출명령(법원이 상대에게 가진 문서를 내라고 명령하는 것) 심문으로 넘어갑니다. 반재욱이 코트 안주머니에서 수첩을 꺼냅니다. 표지에 서아의 별 스티커가 아직 붙어 있습니다. 법원에 직접 내면 47명의 이름은 공개 기록이 되지만, '개입 대상자'라는 제목만은 붙지 않습니다. 한 장씩 뜯어 주인에게 돌려주면 동의한 사람의 이름만 남고 수첩은 사라집니다. 태우면 오늘 싸움은 끝나고, 정태오가 7년 만에 찾은 한 줄도 함께 없어집니다. 반재욱이 수첩을 당신 손에 올려놓습니다. '20년을 들고 다녔습니다. 이번엔 당신이 정해 주세요.'",
    memo: [
      "10:00 인사위원회 -- 수첩을 안 내면 문서제출명령 심문",
      "제출 반대 17명, 상관없음 12명, 닿지 않음 3명, 사망 1명",
      "수첩 표지: 서아의 별 스티커 12개",
      "이 선택은 시즌 마지막 사건의 서명란으로 이어짐",
    ],
    triggers: ["choice", "responsibility", "trust"],
    choices: [
      {
        id: "c17_final_return",
        label: "한 장씩 뜯어 동의를 받고 이름의 주인들에게 돌려준다",
        effect: { trust: 13, humanCost: -6, legitimacy: 3, time: -6, capital: -4, fatigue: 7 },
        next: "case17_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c17_final_court",
        label: "수첩 전체를 법원에 직접 내서 공개 기록으로 남긴다",
        effect: { legitimacy: 13, trust: 3, capital: -6, time: -6, humanCost: 4, fatigue: 5 },
        next: "case17_result",
        cognition: { inference: 2 },
      },
      {
        id: "c17_final_burn",
        label: "오늘 싸움을 끝내기 위해 반재욱과 함께 수첩을 태운다",
        effect: { time: 7, capital: 8, trust: -2, legitimacy: -9, humanCost: 2, fatigue: -5 },
        next: "case17_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case17_result",
      },
    ],
  },
};

/**
 * Everything else case 17 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case17 = {
  id: "case17",
  nodes: case17Nodes,
  aftermath: {
    c17_aftershock: {
      phase: "AFTERMATH",
      title: "떡꼬치 송년회",
      speaker: "정태오",
      text: "12월 20일, 눈발이 굵어진 저녁. 정태오가 트럭 앞에 '오늘 전부 무료'라고 써 붙입니다. 수첩 속 사람들 중 열한 명이 옵니다. 서로 모르는 사이인데, 누가 '몇 년도에 나오셨어요?' 하고 묻자 금방 이야기가 이어집니다. 반서아는 한 명씩 별 스티커를 나눠 주고, 반재욱은 코트를 벗고 소스 통을 흔듭니다. 이번엔 아무도 시키지 않았습니다. 강태민이 꼬치를 굽고, 권도현은 '무료 영업의 손실'을 계산하다 정태오가 내민 꼬치에 입이 막힙니다. 당신의 휴대폰에는 법무팀 문자가 와 있습니다. '내일 오전 9시, 수첩 건 후속 회의.' 그때 오진우의 휴대폰도 울립니다. 화면에 브릿지은행이 뜹니다. 그가 한참 화면만 보다가, 트럭 뒤로 걸어가 전화를 받습니다.",
      memo: ["송년회 참석: 수첩 속 11명", "떡꼬치 412개 무료 -- 권도현 추산 손실 82만 원", "법무팀: 내일 오전 수첩 건 후속 회의", "오진우에게 걸려 온 브릿지은행 전화"],
      triggers: ["affection", "trust", "competition"],
      choices: [
        { id: "c17_after_warm", label: "트럭 불이 꺼질 때까지 남아 소스 통을 같이 흔든다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case17_result", cognition: { reframing: 2 } },
        { id: "c17_after_record", label: "이름을 다루는 원칙과 '지시한 사람' 칸을 제안서로 남긴다", effect: { legitimacy: 15, trust: 4, time: -4, capital: -3, fatigue: 5 }, next: "case17_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c17_after_rush", label: "송년회를 두고 곧장 법무팀 후속 회의로 올라간다", effect: { capital: 8, legitimacy: 6, trust: -7, humanCost: 5, fatigue: 6 }, next: "case17_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c17_final", "c17_aftershock"],
  connectiveScenes: [
    ["c17_stars", "c17_truck", "c17_office", "별점", "반서아", "그날 밤 반재욱의 거실. 식탁 위에 수첩이 펼쳐져 있고, 초등학교 4학년 반서아가 이름마다 별 스티커를 붙이고 있습니다. '떡꼬치 아저씨는 별 다섯 개. 떡꼬치를 줬으니까.' 반재욱이 말리려다 그만둡니다. 서아가 페이지를 넘기다 한 이름 앞에서 멈춥니다. 이름마다 밑줄이 한 줄씩 그어져 있는데, 이 이름에만 줄이 하나 더 있습니다. '아빠, 이 아저씨는 왜 줄이 두 개야?' 반재욱이 한참 있다가 대답합니다. '그 사람은 이제 찾아가도 없어.' 서아가 스티커를 떼지 않고 한 장 더 붙입니다. 이번에는 별이 아니라 작은 꽃입니다.", ["서아가 붙인 별 스티커 12장 -- 기준은 서아 마음", "줄이 두 개인 이름: 하윤재, 작년 봄 사망", "서아의 규칙: 떡꼬치를 주면 별 다섯"], ["서아에게 그 두 줄이 무슨 뜻인지 있는 그대로 말해 준다", "증거가 될 수 있으니 스티커를 떼어 수첩을 원래대로 되돌린다", "오늘은 서아가 붙인 대로 두고 다음 이름을 찾는다"]],
    ["c17_unreached", "c17_office", "c17_legal", "결번", "권도현", "트리거랩 탕비실 화이트보드에 권도현이 표를 그립니다. 47명 중 만난 사람 29명, 그중 제출 반대 17명, 상관없다 12명. 만남을 거절한 사람 7명, 연락이 닿지 않는 사람 3명, 세상을 떠난 사람 1명. 강태민이 컵라면 두 개를 들고 와 하나를 반재욱 앞에 놓습니다. 권도현이 세 사람의 칸을 펜으로 두드립니다. '한 명은 번호가 중국집으로 바뀌었고, 한 명은 해외로 나갔고, 한 명은 주소지에 아무도 안 삽니다.' 그가 잠깐 멈춥니다. '중국집에 짬뽕을 하나 시켰습니다. 사장님이 전 주인을 기억하더군요. 짬뽕값 9천 원은 조사비로 올리겠습니다.'", ["만남 29명: 제출 반대 17, 상관없음 12", "만남 거절 7명, 연락 불가 3명, 사망 1명", "짬뽕 9,000원 -- 권도현 장부 '조사비'"], ["중국집 사장님이 기억한 단서로 한 명이라도 더 찾는다", "닿지 않는 세 명은 '동의 없음'으로 공식 기록에 남긴다", "시간이 없으니 연락된 사람들의 뜻만으로 결정한다"]],
    ["c17_name", "c17_legal", "c17_final", "남은 이름", "정태오", "인사위원회 전날 밤, 영업이 끝난 트럭 앞. 정태오가 앞치마 주머니에서 누렇게 바랜 업무 수첩 한 권을 꺼냅니다. 7년 전 그의 것입니다. '회사는 내가 자진 퇴사한 걸로 정리했어요. 인사 기록에도, 동기 단톡방에도, 우리 엄마 기억에도요.' 그가 반재욱의 수첩을 가리킵니다. '저기만 달라요. 정태오, 해고, 지시받아 적음, 지시한 사람 확인 못 함.' 그가 떡꼬치 하나를 반재욱 손에 쥐여 줍니다. 이번엔 소스 통을 흔들라는 말이 없습니다. '그때 당신이 적어 둔 덕에 내 이름이 남았어요. 7년 동안 나를 똑바로 적어 둔 데가 거기 하나였어요.'", ["정태오 인사 기록: '자진 퇴사'", "반재욱 수첩: '해고 · 지시받아 적음 · 지시한 사람 확인 못 함'", "정태오의 7년 전 업무 수첩 -- 지시받은 날의 쪽 그대로"], ["정태오의 업무 수첩까지 함께 지켜 주겠다고 약속한다", "두 수첩의 같은 날짜를 맞춰 지시한 사람의 흔적을 찾는다", "고맙다는 말만 받고 내일 인사위원회 준비로 돌아간다"]],
  ],
  connectiveOrder: [["c17_truck", "c17_stars"], ["c17_office", "c17_unreached"], ["c17_legal", "c17_name"]],
  choiceEffects: {
    c17_truck: [
      { trust: 11, humanCost: -4, time: -4, fatigue: 5 },
      { legitimacy: 9, trust: -4, time: -3, humanCost: 2, fatigue: 2 },
      { time: 5, capital: 3, trust: 3, legitimacy: -3, humanCost: 3, fatigue: -4 },
    ],
    c17_office: [
      { trust: 10, humanCost: -5, time: -4, capital: -2, fatigue: 5 },
      { legitimacy: 10, trust: 2, time: -3, humanCost: 3, fatigue: 3 },
      { time: 6, capital: 4, trust: -4, humanCost: 4, fatigue: -4 },
    ],
    c17_legal: [
      { trust: 11, humanCost: -4, capital: -3, time: -3, fatigue: 4 },
      { legitimacy: 11, trust: 4, time: -4, humanCost: 2, fatigue: 5 },
      { time: 5, capital: 3, legitimacy: -2, humanCost: 2, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c17_truck: {
      voice: ["서아에게, 그 두 줄이 무슨 뜻인지 있는 그대로 말해 준다.", "증거가 될 수 있으니, 스티커를 떼어 수첩을 원래대로 되돌린다.", "오늘은 서아가 붙인 대로 두고, 다음 이름을 찾는다."],
      echo: ["말해 주면 서아가 한동안 조용해집니다. 그리고 꽃 스티커를 두 장 더 가져옵니다.", "스티커를 떼면 수첩은 증거로 깨끗해집니다. 서아는 방문을 닫고 들어가 나오지 않습니다.", "별점이 붙은 수첩은 증거로는 흠이 됩니다. 법무팀 변호사가 그 스티커를 사진으로 찍어 갈 겁니다."],
    },
    c17_office: {
      voice: ["중국집 사장님이 기억한 단서로, 한 명이라도 더 찾는다.", "닿지 않는 세 명은, '동의 없음'으로 공식 기록에 남긴다.", "시간이 없다며, 연락된 사람들의 뜻만으로 결정한다."],
      echo: ["단서를 따라가면 한 명이 부산의 요양병원에 있습니다. 그곳까지 가는 데 하루가 듭니다.", "'동의 없음'은 기록으로 남습니다. 그 세 사람은 자기 이름이 어디에 쓰였는지 끝내 모릅니다.", "결정은 빨라집니다. 대답할 수 없는 네 사람의 몫은 대답한 사람들이 대신 정합니다."],
    },
    c17_legal: {
      voice: ["정태오의 업무 수첩까지, 함께 지켜 주겠다고 약속한다.", "두 수첩의 같은 날짜를 맞춰, 지시한 사람의 흔적을 찾는다.", "고맙다는 말만 받고, 내일 인사위원회 준비로 돌아간다."],
      echo: ["약속하면 정태오가 업무 수첩을 비닐봉지에 싸서 건넵니다. 지킬 물건이 두 권이 됩니다.", "날짜를 맞추면 밤이 샙니다. 새벽 세 시, 같은 날짜의 두 쪽이 나란히 펼쳐집니다.", "정태오는 더 붙잡지 않습니다. 업무 수첩은 다시 앞치마 주머니로 들어갑니다."],
    },
  },
  reactionScenes: [
    ["c17_stars_reaction", "c17_stars", "c17_office", "아이의 나이", "반재욱", "서아가 잠든 뒤 반재욱이 수첩 뒤쪽을 보여 줍니다. 이름 옆에 작은 숫자들이 적혀 있습니다. '서아가 태어난 해부터 적기 시작했습니다. 그 사람 집에 아이가 있으면, 아이 나이를요.' 숫자가 붙은 이름이 스물두 개입니다. '내 딸이 한 살 먹을 때마다 그 아이들도 한 살씩 먹었을 겁니다. 아빠가 은행에서 잘린 집에서요.' 그가 안경을 벗어 식탁에 내려놓습니다. '법무팀은 이 숫자까지 인사위원회 탁자에 올릴 겁니다.'", ["아이 나이가 적힌 스물두 명부터 먼저 찾아간다", "제출 범위에서 가족 정보는 빼라고 법무팀에 요구한다", "숫자는 못 본 걸로 하고 일정대로 이름 순서로 간다"]],
    ["c17_unreached_reaction", "c17_unreached", "c17_legal", "추정 동의", "에코", "에코가 법무팀의 제출 의견서 초안을 띄웁니다. 어떻게 들어왔는지는 묻지 않기로 합니다. 12쪽 아래 각주 한 줄. '수첩에 적힌 사람 가운데 회신이 없는 자는 제출에 이의가 없는 것으로 본다.' 에코가 그 줄에 밑줄을 긋습니다. '연락이 닿지 않는 세 명과 세상을 떠난 한 명은 이 문장으로 동의한 사람이 됩니다. 20년 전에는 받아 적은 사람이 책임자가 됐고, 오늘은 대답하지 못하는 사람이 동의한 사람이 됩니다.'", ["대답 못 하는 사람을 동의로 세는 각주부터 공개한다", "각주의 근거를 법무팀에 공식 질의서로 묻는다", "각주는 인사위원회 당일에 반박하기로 하고 넘어간다"]],
    ["c17_name_reaction", "c17_name", "c17_final", "첫 번째 칸", "반재욱", "정태오가 셔터를 내린 뒤, 반재욱이 트럭 옆 간이 의자에 앉아 떡꼬치를 끝까지 먹습니다. 그리고 처음으로 수첩 첫 장을 당신 쪽으로 돌립니다. 이름 칸 옆에 칸이 하나 더 있습니다. 20년 동안 한 번도 채운 적 없는 칸, 제목은 '지시한 사람'입니다. '증거가 없으면 못 적으니까 비워 뒀습니다.' 눈발이 수첩 위에 떨어져 녹습니다. '생각해 보면 저도 윗사람들처럼 서명란을 비워 둔 겁니다. 방식만 달랐지.'", ["그 빈칸은 당신 잘못이 아니라고 반재욱에게 말한다", "그 칸을 채울 증거부터 함께 찾자고 한다", "칸 얘기는 나중에 하고 내일 제출 여부부터 정한다"]],
  ],
  reactionEffects: {
    c17_stars: [
      { trust: 10, humanCost: -5, time: -4, fatigue: 4 },
      { legitimacy: 8, trust: 3, capital: -3, time: -1, fatigue: 2 },
      { time: 5, capital: 3, trust: -2, humanCost: 2, fatigue: -3 },
    ],
    c17_unreached: [
      { trust: 9, legitimacy: 5, humanCost: -3, capital: -4, time: -4, fatigue: 5 },
      { legitimacy: 10, trust: 2, time: -3, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 4, trust: -1, legitimacy: -3, humanCost: 2, fatigue: -3 },
    ],
    c17_name: [
      { trust: 10, humanCost: -4, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 3, capital: -2, time: -3, fatigue: 4 },
      { time: 5, capital: 3, legitimacy: -2, humanCost: 2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c17_stars: {
      voice: ["아이 나이가 적힌 스물두 명부터, 먼저 찾아간다.", "제출 범위에서 가족 정보는 빼라고, 법무팀에 요구한다.", "숫자는 못 본 걸로 하고, 일정대로 이름 순서로 간다."],
      echo: ["스물두 집을 먼저 돌면 순서가 바뀝니다. 수첩 첫 장부터 기다리던 사람 몇은 한 주를 더 기다립니다.", "요구는 공문으로 남습니다. 법무팀은 숫자를 지우는 대신 '가족 사항 별첨'이라는 칸을 새로 만듭니다.", "순서는 지켜집니다. 스물두 개의 숫자는 올해도 한 살씩 늘어납니다."],
    },
    c17_unreached: {
      voice: ["대답 못 하는 사람을 동의로 세는, 그 각주부터 공개한다.", "각주의 근거를, 법무팀에 공식 질의서로 묻는다.", "각주는 인사위원회 당일에 반박하기로 하고, 넘어간다."],
      echo: ["공개하면 리드라인이 각주 사진을 올립니다. 법무팀은 초안이 어떻게 샜는지부터 조사합니다.", "질의서는 답을 받을 권리를 만듭니다. 답이 오는 날짜는 인사위원회 다음 날로 잡힙니다.", "넘어가면 각주는 그대로 인쇄됩니다. 네 사람은 종이 위에서 동의합니다."],
    },
    c17_name: {
      voice: ["그 빈칸은 당신 잘못이 아니라고, 반재욱에게 말한다.", "그 칸을 채울 증거부터, 함께 찾자고 한다.", "칸 얘기는 나중에 하고, 내일 제출 여부부터 정하자고 한다."],
      echo: ["말하면 반재욱이 대답하지 않고 안경을 닦습니다. 오래 닦습니다.", "함께 찾자고 하면 반재욱이 수첩을 덮지 않습니다. 그 칸이 처음으로 할 일이 됩니다.", "제출 여부는 정해집니다. 빈칸은 오늘 밤에도 빈칸입니다."],
    },
  },
  reactionMemos: {
    c17_stars_reaction: ["아이 나이가 적힌 스물두 개의 이름", "딸과 같이 한 살씩 먹은 아이들"],
    c17_unreached_reaction: ["회신이 없으면 동의로 보는 각주", "대답하지 못하는 네 사람"],
    c17_name_reaction: ["20년 동안 비워 둔 '지시한 사람' 칸", "방식만 다른 빈 서명란"],
  },
  branchPlan: ["c17_office", 1, "c17_branch_pencil", "c17_branch_pencil_follow"],
  branchScenes: {
    // CASE 17's detour is the last page. The case visits forty-seven names in
    // ink; the side door is the one line in pencil, which is yours.
    c17_branch_pencil: {
      phase: "SIDE DOOR",
      title: "연필 한 줄",
      speaker: "반재욱",
      text: "문래동에서 돌아오는 길, 12월 눈발이 와이퍼에 쌓입니다. 뒷자리에서 서아가 잠들어 있고, 반재욱이 신호에 멈춰 수첩 맨 뒷장을 폅니다. 잉크로 쓴 마흔일곱 개의 이름 아래 연필로 쓴 한 줄. 당신의 이름과, 당신이 트리거랩으로 밀려나기 2주 전 날짜입니다. '법무팀이 원하는 게 이 줄입니다. 조사도 하기 전에 당신 이름을 적었으니 둘이 짰다는 거죠.' 그가 연필 자국을 엄지로 훑습니다. '그때 당신을 내보낼 서류가 제 책상에 올라왔습니다. 도장은 안 찍었고, 대신 연필로 적어 뒀어요. 언제든 지울 수 있게.' 신호가 바뀝니다. '이 줄, 어떻게 할까요.'",
      memo: ["맨 뒷장: 연필로 쓴 당신의 이름, 발령 2주 전 날짜", "당시 반재욱 책상에 올라온 서류: 당신의 인사 조치 검토", "반재욱은 도장을 찍지 않았음", "법무팀 주장: 조사 전에 이름을 적은 건 미리 짠 것"],
      triggers: ["trust", "selfAwareness", "manipulation"],
      choices: [
        { id: "c17_branch_pencil_a", label: "그 서류에 도장을 안 찍은 이유부터 끝까지 듣는다", effect: { trust: 12, humanCost: -4, time: -5, capital: -2, fatigue: 5 }, next: "c17_branch_pencil_follow", cognition: { reframing: 2 } },
        { id: "c17_branch_pencil_b", label: "연필 줄의 날짜를 인사 기록과 맞춰 사실을 증명한다", effect: { legitimacy: 11, trust: 3, time: -4, humanCost: 3, fatigue: 3 }, next: "c17_branch_pencil_follow", cognition: { inference: 2 } },
        { id: "c17_branch_pencil_c", label: "법무팀이 원하는 줄이니 오늘 밤 지워 버리자고 한다", effect: { time: 6, capital: 5, legitimacy: -6, trust: -3, humanCost: 3, fatigue: -3 }, next: "c17_branch_pencil_follow", cognition: { risk: 1 } },
      ],
    },
    c17_branch_pencil_follow: {
      phase: "SIDE DOOR",
      title: "꽃 지우개",
      speaker: "반서아",
      text: "아파트 주차장에 차를 세우자 서아가 깨어 뒷자리에서 몸을 내밉니다. 수첩이 펼쳐진 채입니다. '아빠, 이것만 연필이네.' 서아가 필통에서 꽃 모양 지우개를 꺼냅니다. '지워 줄까? 아니면 볼펜으로 덧써 줄까? 나 글씨 잘 써.' 반재욱이 웃음을 참다가 실패합니다. 20년 동안 쓴 이름 중 지울 수 있게 남겨 둔 건 이 한 줄뿐이었습니다. 서아가 당신을 빤히 봅니다. '이거 아빠 친구 이름이지? 그럼 이름 주인이 정해야지.' 꽃 지우개와 볼펜이 나란히 당신 앞에 놓입니다.",
      memo: ["서아의 필통: 꽃 지우개 1개, 볼펜 3자루", "잉크 이름 47개, 연필 이름 1개", "인사위원회까지 3일", "반재욱, 수첩 앞에서 처음 소리 내어 웃음"],
      triggers: ["affection", "choice", "trust"],
      choices: [
        { id: "c17_branch_pencil_follow_a", label: "서아에게 볼펜을 받아 내 손으로 그 줄을 덧쓴다", effect: { trust: 13, legitimacy: 4, humanCost: -3, time: -3, fatigue: 5 }, next: "c17_unreached", cognition: { reframing: 3 } },
        { id: "c17_branch_pencil_follow_b", label: "줄은 연필 그대로 두고 옆에 날짜와 사정을 적는다", effect: { legitimacy: 12, trust: 4, time: -3, humanCost: -2, fatigue: 3 }, next: "c17_unreached", cognition: { inference: 2 } },
        { id: "c17_branch_pencil_follow_c", label: "꽃 지우개로 그 줄을 지우고 없던 일로 한다", effect: { time: 6, capital: 5, trust: -7, legitimacy: -4, humanCost: 4, fatigue: -4 }, next: "c17_unreached", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c17_start",
    result: "c17_aftershock",
    defaultFree: "c17_route_system",
    // One notebook, forty-seven owners. Like 사건 12 the case is a single line;
    // the split is who gets to decide what a list of names is for.
    choices: {},
    system: {
      route: "c17_route_system",
      final: "c17_final_system_route",
      title: "받아 적은 손",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 KD은행 감사 보고서 20년 치 312건을 엽니다. 징계를 받은 사람 가운데 '문서를 쓴 사람'이 241명, '쓰라고 지시한 사람'은 19명입니다. 지시가 말로만 내려온 사건에서 지시한 사람이 징계된 경우는 한 건도 없습니다. '감사는 글씨를 따라갑니다. 말은 흔적을 남기지 않으니, 받아 적은 손이 늘 마지막 책임자로 학습되어 있습니다. 반재욱의 수첩 47명 가운데 39명이 그 손입니다.'",
      memo: ["감사 보고서 312건 -- 쓴 사람 징계 241명, 지시한 사람 징계 19명", "말로만 내려온 지시: 지시한 사람 징계 0건", "수첩 47명 중 39명이 '받아 적은 손'"],
      routeChoices: [
        ["c17_route_system_publish", "통계를 인사위원회와 47명 모두에게 동시에 보낸다", { legitimacy: 11, trust: 6, capital: -6, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c17_route_system_rule", "감사 보고서에 '지시한 사람' 칸을 의무로 두자고 제안한다", { legitimacy: 9, capital: 4, trust: 3, time: -7, humanCost: 3, fatigue: 6 }, { reframing: 2 }],
        ["c17_route_system_drop", "통계는 덮어 두고 수첩 문제만 일정대로 푼다", { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "지시한 사람을 밝히지 못한 감사는 징계로 끝내지 못하게 한다", { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 }, { reframing: 3 }],
      ["b", "규칙은 그대로 두고 받아 적은 사람들의 징계 기록만 지운다", { trust: 9, capital: 6, time: 6, legitimacy: -6, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ["c", "말로 받은 지시를 적어 둔 직원을 보호하는 규정을 만든다", { legitimacy: 8, trust: 9, capital: -7, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c17_evidence_turn",
    result: "c17_aftershock",
    sourceRoutes: ["c17_truck", "c17_office", "c17_legal", "c17_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 정태오의 업무 수첩 옆에 놓고, 지시가 어느 전화에서 내려왔는지 맞춰 본다.",
    entryEcho: "단서를 대면 20년 동안 비어 있던 칸에 처음으로 숫자 하나가 들어갑니다. 그 숫자의 주인도 함께 드러납니다.",
    title: "내선 3317",
    speaker: "이민서",
    text: "단서를 맞추자 정태오의 7년 전 업무 수첩 한 쪽이 기록 보관소의 내선 전화 대장과 겹칩니다. 서류 날짜를 당기라는 지시를 받아 적은 날, 그 쪽 귀퉁이에 적힌 네 자리 번호 3317. 당시 기업금융전략팀 팀장석, 윤상혁이 앉던 자리입니다. 지점장은 그 전화를 받아 옮겼을 뿐이고, 정태오는 옮긴 말을 적었을 뿐입니다. 이민서가 대장을 덮습니다. '저는 사라진 11초 때문에 잘릴 뻔했어요. 이분은 네 자리 숫자를 적어 둔 손 때문에 잘렸고요. 적은 사람이 늘 먼저예요.'",
    memo: ["정태오 업무 수첩 귀퉁이: 내선 3317", "3317 = 7년 전 기업금융전략팀 팀장석", "당시 팀장: 윤상혁"],
    triggers: ["injustice", "system", "revenge"],
    entryEffect: { legitimacy: 5, trust: 2, time: -3, fatigue: 5 },
    choices: [
      ["c17_evidence_turn_fill", "수첩의 '지시한 사람' 칸에 처음으로 그 번호를 적는다", { legitimacy: 12, trust: 7, capital: -7, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c17_evidence_turn_hold", "번호는 알아 두고 마지막 사건까지 아껴 둔다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c17_evidence_turn_tell", "정태오에게 그 번호의 주인을 먼저 알려 준다", { trust: 12, legitimacy: 6, capital: -6, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c17_branch_pencil",
    systemNext: "c17_route_system",
    evidenceNext: "c17_evidence_turn",
    routeLabel: "직전 사건의 야간조 교대표처럼 47명을 나눠 찾아간다",
    systemLabel: "직전 자유응답 문장이 법무팀 의견서에도 인용됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 정태오 업무 수첩의 내선 번호를 연다",
  },
  openingRoutes: {
    c16_after_warm: "c17_start_warm",
    c16_after_record: "c17_start_record",
    c16_after_rush: "c17_start_rush",
  },
  openingCopy: {
    c17_start_warm: ["마지막 컵라면 다음", "강태민", "야간조 대기실에서 여든한 번째 컵라면까지 다 먹은 그 밤, 반재욱의 문자에는 아침이 되어서야 답했습니다. 2주가 지난 지금, 강태민이 대기실 사물함 하나를 당신 몫으로 비워 두었고, 거기에 반재욱이 두고 간 우체국 봉투가 꽂혀 있습니다. 그룹 법무팀이 보낸 내용증명(누가 언제 어떤 내용을 보냈는지 우체국이 증명해 주는 우편)입니다. 감사팀 시절 쓴 수첩을 회사 기록물로 돌려주고, 12월 19일 인사위원회(직원의 징계나 자리 이동을 정하는 회의)에 당신의 '부당 조사 개입' 증거로 내라는 요구입니다. 강태민이 컵라면 두 개를 뜯으며 말합니다. '그 사람, 어제 여기 와서 한참 앉아 있다 갔어요. 수첩 속 사람들 찾아간대요. 혼자서요.'", ["법무팀 내용증명: 반재욱 수첩을 '회사 기록물'로 반환", "12월 19일 인사위원회 -- 당신의 부당 조사 개입", "반재욱, 수첩 속 47명을 혼자 찾아가기로 함"]],
    c17_start_record: ["표준 조항을 쓴 변호사", "에코", "전환과 재교육 조건을 그룹 리스(장비를 빌려 쓰는 금융)의 표준 조항으로 문서화한 뒤, 그룹 법무팀이 그 문서를 한 줄씩 검토했습니다. 검토가 끝난 날 법무팀은 다른 서류 하나를 반재욱에게 보냈습니다. 감사팀 시절 쓴 수첩을 회사 기록물로 돌려주고, 12월 19일 인사위원회(직원의 징계나 자리 이동을 정하는 회의)에 당신의 '부당 조사 개입' 증거로 내라는 요구입니다. 법원에는 문서제출명령(법원이 상대에게 가진 문서를 내라고 명령하는 것)도 신청돼 있습니다. 에코가 두 서류의 작성자 칸을 나란히 띄웁니다. 같은 변호사입니다. '당신이 문서로 이긴 다음 날, 그들은 문서로 되갚기로 했습니다.'", ["표준 조항 검토 변호사 = 수첩 반환 요구서 작성자", "12월 19일 인사위원회 -- 당신의 부당 조사 개입", "법원 문서제출명령 신청 접수"]],
    c17_start_rush: ["먼저 달려온 밤", "반재욱", "강태민이 건넨 여든한 번째 컵라면을 식게 두고 택시를 탄 밤, 반재욱은 불 꺼진 본사 로비 의자에 우체국 봉투를 무릎에 올려놓고 앉아 있었습니다. 그룹 법무팀의 내용증명(누가 언제 어떤 내용을 보냈는지 우체국이 증명해 주는 우편)입니다. 감사팀 시절 쓴 수첩을 회사 기록물로 돌려주고, 12월 19일 인사위원회(직원의 징계나 자리 이동을 정하는 회의)에 당신의 '부당 조사 개입' 증거로 내라는 요구입니다. 반재욱이 봉투를 내밀다 멈춥니다. '야간조는요. 오늘 같은 날 거길 두고 오셨습니까.' 대답을 기다리지 않고 그가 수첩을 쥔 손에 힘을 줍니다. '그래도 제일 먼저 와 주셨으니, 첫 이름부터 같이 가 주시겠습니까.'", ["법무팀 내용증명: 반재욱 수첩 반환 요구", "야간조 대기실: 뚜껑 덮인 컵라면 1개", "12월 19일 인사위원회 -- 당신의 부당 조사 개입"]],
  },
  openingSignatures: {
    c17_start_warm: {
      label: "강태민과 야간조 몇 명을 데리고 반재욱을 따라나선다",
      effect: { trust: 11, humanCost: -4, capital: -4, time: -5, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "강태민과 야간조 몇 명을 데리고, 반재욱을 따라나선다.",
      echo: "형광 조끼 셋이 따라오자 반재욱이 당황합니다. 수첩 속 사람들은 은행원 혼자보다 이 무리를 덜 경계합니다.",
    },
    c17_start_record: {
      label: "두 서류의 작성자가 같다는 걸 법무팀에 공식 질의한다",
      effect: { legitimacy: 12, trust: -2, capital: -5, time: -4, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "두 서류의 작성자가 같다는 걸, 법무팀에 공식 질의한다.",
      echo: "질의는 기록으로 남습니다. 법무팀은 다음 날 작성자 칸을 '법무팀'으로 바꿔 다시 보냅니다.",
    },
    c17_start_rush: {
      label: "로비에서 곧장 반재욱의 차에 올라 첫 이름부터 찾아간다",
      effect: { trust: 10, capital: 2, humanCost: -2, legitimacy: -3, time: -4, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "로비에서 곧장 반재욱의 차에 올라, 첫 이름부터 찾아간다.",
      echo: "이번에는 기다리지 않고 바로 출발합니다. 법무팀에 보낼 답장도, 대기실에 남긴 사과도 아직 아무도 쓰지 않았습니다.",
    },
  },
  voiceLines: {
    // CASE 17. The notebook of names. Every line is said beside a man who wrote
    // the names down himself, so none of them is allowed to sound like a verdict.
    c17_start_visit: "넘기기 전에 만나야 한다며, 반재욱과 함께 수첩 속 사람들을 먼저 찾아간다.",
    c17_start_clause: "사람 이름이 어떻게 회사 물건이냐며, '회사 기록물' 근거부터 하나씩 따진다.",
    c17_start_self: "수첩 얘기는 빼고, 내 징계 건만 해명서로 빨리 정리하겠다고 한다.",
    c17_truck_stay: "영업이 끝날 때까지 소스 통을 흔들고, 그다음에 수첩을 편다.",
    c17_truck_report: "7년 전 감사 보고서와 수첩의 그 줄을, 나란히 보여 준다.",
    c17_truck_consent: "법무팀 서류부터 보여 주고, 제출 동의서를 받겠다고 한다.",
    c17_office_truth: "그날 면담에서 그가 한 말을, 누나에게 그대로 전한다.",
    c17_office_record: "6년 전 조사 기록을 열어, 그의 말이 어디에 남았는지 찾는다.",
    c17_office_leave: "유족에게 더 묻지 않고, 수첩에 '사망'만 적고 나온다.",
    c17_branch_pencil_a: "그 서류에 도장을 안 찍은 이유부터, 끝까지 듣는다.",
    c17_branch_pencil_b: "연필 줄의 날짜를 인사 기록과 맞춰, 사실을 증명하자고 한다.",
    c17_branch_pencil_c: "법무팀이 원하는 줄이니, 오늘 밤 지워 버리자고 한다.",
    c17_branch_pencil_follow_a: "서아에게 볼펜을 받아, 내 손으로 그 줄을 덧쓴다.",
    c17_branch_pencil_follow_b: "줄은 연필 그대로 두고, 옆에 날짜와 사정을 적는다.",
    c17_branch_pencil_follow_c: "꽃 지우개로 그 줄을 지우고, 없던 일로 하자고 한다.",
    c17_legal_walk: "제출에 반대한 17명의 이름을 하나씩 대며, 자리에서 일어선다.",
    c17_legal_basis: "표 제목을 바꾼 사람과 그 근거를, 서면으로 요구한다.",
    c17_legal_deal: "반재욱을 빼 준다는 제안을 받고, 사본만 넘기자고 한다.",
    c17_final_return: "한 장씩 뜯어 동의를 받고, 이름의 주인들에게 돌려준다.",
    c17_final_court: "수첩 전체를 법원에 직접 내서, 공개 기록으로 남긴다.",
    c17_final_burn: "오늘 싸움을 끝내기 위해, 반재욱과 함께 수첩을 태운다.",
    c17_after_warm: "트럭 불이 꺼질 때까지 남아서, 소스 통을 같이 흔든다.",
    c17_after_record: "수첩 속 이름을 다루는 원칙과 '지시한 사람' 칸을, 제안서로 남긴다.",
    c17_after_rush: "송년회를 두고, 곧장 법무팀 후속 회의로 올라간다.",
    c17_route_system_publish: "이 통계를, 인사위원회와 47명 모두에게 동시에 보낸다.",
    c17_route_system_rule: "감사 보고서에 '지시한 사람' 칸을, 의무로 두자고 제안한다.",
    c17_route_system_drop: "통계는 덮어 두고, 수첩 문제만 일정대로 푼다.",
    c17_final_system_route_a: "지시한 사람을 밝히지 못한 감사는, 징계로 끝내지 못하게 한다.",
    c17_final_system_route_b: "규칙은 그대로 두고, 받아 적은 사람들의 징계 기록만 지운다.",
    c17_final_system_route_c: "말로 받은 지시를 적어 둔 직원을, 보호하는 규정을 만든다.",
    c17_evidence_turn_fill: "수첩의 '지시한 사람' 칸에, 처음으로 그 번호를 적는다.",
    c17_evidence_turn_hold: "번호는 알아 두고, 마지막 사건까지 아껴 둔다.",
    c17_evidence_turn_tell: "정태오에게, 그 번호의 주인을 먼저 알려 준다.",
  },
  echoReplies: {
    // CASE 17.
    c17_start_visit: "찾아가면 문을 열어 주지 않는 사람도 있습니다. 반재욱은 그 사람들 이름 옆에도 날짜를 적습니다.",
    c17_start_clause: "근거를 따지면 법무팀 답변이 사흘 뒤에 옵니다. 그사이 수첩 속 사람들은 아무 연락도 받지 못합니다.",
    c17_start_self: "해명서는 빨리 나갑니다. 반재욱은 그날 오후 혼자 차 키를 챙겨 나갑니다.",
    c17_truck_stay: "끝까지 흔들면 반재욱의 코트 소매가 소스 범벅이 됩니다. 정태오가 처음으로 웃습니다.",
    c17_truck_report: "나란히 놓으면 두 기록이 다르다는 게 보입니다. 정태오는 공식 보고서 쪽을 오래 보지 못합니다.",
    c17_truck_consent: "동의서를 먼저 내밀면 정태오가 꼬치를 뒤집던 손을 멈춥니다. '역시 서류부터네요.'",
    c17_office_truth: "전하면 하은경이 다이어리를 끌어안습니다. 동생이 그날 말을 했다는 걸, 가족은 6년 만에 압니다.",
    c17_office_record: "기록을 열면 그의 말은 '본인 부인'이라는 네 글자로 남아 있습니다. 그 네 글자를 누나에게 보여 줄지는 또 다른 문제입니다.",
    c17_office_leave: "조용히 나오면 하은경은 상자 정리를 계속합니다. 다이어리는 폐지 더미 맨 위에 놓입니다.",
    c17_branch_pencil_a: "끝까지 들으면 반재욱이 신호를 두 번 놓칩니다. 뒤차가 경적을 울리고, 서아가 잠결에 뒤척입니다.",
    c17_branch_pencil_b: "날짜를 맞추면 연필 줄은 공모가 아니라 거부의 기록이 됩니다. 증명하는 데 인사 기록 열람 신청 한 장이 듭니다.",
    c17_branch_pencil_c: "지우면 법무팀의 증거가 사라집니다. 반재욱이 도장을 거부했다는 유일한 흔적도 함께 사라집니다.",
    c17_branch_pencil_follow_a: "덧쓰면 연필 줄이 잉크가 됩니다. 서아가 옆에 별 스티커를 붙입니다. 반 개짜리입니다.",
    c17_branch_pencil_follow_b: "사정을 적으면 줄은 그대로 남고 설명이 붙습니다. 법무팀이 읽기에도, 서아가 읽기에도 긴 설명입니다.",
    c17_branch_pencil_follow_c: "지우면 종이에 희미한 자국만 남습니다. 서아가 지우개 가루를 모아 창밖으로 텁니다.",
    c17_legal_walk: "일어서면 회의는 10분 만에 끝납니다. 수석변호사가 문 앞에서 '법원에서 뵙겠습니다'라고 합니다.",
    c17_legal_basis: "서면으로 요구하면 표 제목을 바꾼 사람의 이름이 답변서에 나와야 합니다. 법무팀은 답변 기한을 최대한 늦춥니다.",
    c17_legal_deal: "사본을 넘기면 반재욱의 이름은 목록에서 빠집니다. 나머지 47명의 이름은 그대로 남습니다.",
    c17_final_return: "돌려주면 수첩은 얇아지다가 사라집니다. 법무팀이 낼 증거도 함께 사라지고, 반재욱의 20년도 한 장씩 흩어집니다.",
    c17_final_court: "법원에 내면 47명의 이름이 공개 기록에 오릅니다. '개입 대상자'라는 제목은 붙지 않지만, 반대한 17명은 당신을 다시 봅니다.",
    c17_final_burn: "태우면 인사위원회는 증거 없이 열립니다. 정태오의 한 줄도 재가 되고, 그는 7년 전처럼 다시 어디에도 없는 사람이 됩니다.",
    c17_after_warm: "불이 꺼질 때 트럭 앞에 열한 명과 트리거랩이 남습니다. 오진우의 통화는 아직 끝나지 않았습니다.",
    c17_after_record: "제안서가 된 칸은 사람이 바뀌어도 남습니다. 반재욱이 그 제안서 맨 끝에 처음으로 자기 이름을 적습니다.",
    c17_after_rush: "올라가면 회의실에서 변호사 셋이 기다립니다. 트럭 앞에서는 통화를 마친 오진우가 당신 자리를 찾다가, 흰 봉투를 주머니에 넣습니다.",
    c17_route_system_publish: "동시에 보내면 47명 중 몇 명이 처음으로 서로에게 연락합니다. 법무팀은 통계의 출처부터 묻습니다.",
    c17_route_system_rule: "칸을 의무로 두면 다음 감사부터 지시한 사람을 적어야 합니다. 적을 수 없을 때 무엇을 적을지는 아직 빈칸입니다.",
    c17_route_system_drop: "덮으면 수첩 문제는 일정대로 풀립니다. 241과 19라는 숫자는 에코의 로그에만 남습니다.",
    c17_final_system_route_a: "징계로 끝내지 못하게 하면 감사가 길어집니다. 대신 받아 적은 손 하나만 잘리는 일은 줄어듭니다.",
    c17_final_system_route_b: "기록을 지우면 39명의 이름이 깨끗해집니다. 다음 해에도 누군가는 불러 준 말을 받아 적고, 그 손이 잘립니다.",
    c17_final_system_route_c: "보호 규정이 생기면 받아 적는 일이 곧 증거를 남기는 일이 됩니다. 규정을 믿고 적을 사람이 몇이나 될지는 모릅니다.",
    c17_evidence_turn_fill: "번호를 적으면 20년 비어 있던 칸이 처음으로 채워집니다. 반재욱의 펜이 그 네 자리에서 오래 멈춥니다.",
    c17_evidence_turn_hold: "아껴 두면 번호는 마지막 사건의 카드가 됩니다. 그동안 정태오는 자기 해고를 부른 전화가 누구 것인지 모릅니다.",
    c17_evidence_turn_tell: "알려 주면 정태오가 한참 꼬치를 뒤집지 않습니다. 그리고 묻습니다. '그 사람, 지금도 거기 있어요?'",
  },
  characterProfiles: {
    정태오: {
      role: "푸드트럭 '태오네 떡꼬치' 사장 · 전 KD은행 구로지점 기업대출 대리",
      stance: "억울함 · 생계 · 뒤늦은 이름",
      job: "받아 적은 손이 어떻게 책임자가 되는지 보여 준다. 사과보다 제대로 된 기록을 원한다.",
      appearance: "소스 얼룩이 번진 남색 앞치마, 목장갑 위에 낀 비닐장갑, 앞치마 주머니에 늘 든 누런 업무 수첩.",
      thought: "시키는 대로 적었을 뿐이다. 그런데 적은 게 나라서, 나만 남았다.",
      gesture: "정태오는 곤란한 말을 할 때 꼬치를 한 번 더 뒤집는다. 뒤집는 동안 상대를 보지 않는다.",
      voice: "장사꾼의 너스레로 시작해서, 7년 전 이야기에서만 말이 짧아진다.",
      line: "공짜로 드릴게요. 대신 저거 흔들어요. 은행 사람도 손목은 있잖아요.",
    },
    반서아: {
      role: "반재욱의 딸 · 초등학교 4학년",
      stance: "호기심 · 공정함 · 별점",
      job: "아빠의 수첩을 처음으로 사람 이름의 목록으로 읽는다. 어른들이 피하는 질문을 그냥 묻는다.",
      appearance: "소매가 긴 분홍 패딩, 별·꽃 스티커가 가득한 필통, 꽃 모양 지우개.",
      thought: "아빠 수첩에는 모르는 사람이 너무 많다. 착한 사람한테는 별을 줘야 한다.",
      gesture: "서아는 대답을 기다릴 때 스티커 한 장을 떼어 손톱 끝에 붙여 둔다.",
      voice: "초등학생답게 짧고 곧게 묻고, 대답이 이상하면 한 번 더 묻는다.",
      line: "아빠, 이 아저씨는 왜 줄이 두 개야?",
    },
    하은경: {
      role: "고(故) 하윤재의 누나 · 동생의 세무회계 사무실 폐업 정리 중",
      stance: "상실 · 뒤늦은 진실",
      job: "해고를 가족에게 숨긴 채 세상을 떠난 사람의 빈자리를 보여 준다.",
      appearance: "목장갑, 테이프를 반쯤 감은 이삿짐 상자, 동생의 다이어리를 넣은 에코백.",
      thought: "동생이 왜 그렇게 일만 했는지, 이제야 조금 알 것 같다.",
      gesture: "하은경은 질문을 하기 전에 상자 테이프를 끝까지 붙인다.",
      voice: "조용하고 정확하게 묻는다. 대답을 재촉하지 않는다.",
      line: "말했어요? 우리 동생이, 그날?",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "12월 · 인사위원회까지 D-5" },
  sceneContext: {
    c17_start: {
      place: "트리거랩 4층 분석관실",
      clock: "12월 14일 · 인사위원회까지 D-5",
      question: "법무팀이 47명의 이름이 적힌 수첩을 회사 물건이라며 내놓으라고 합니다. 무엇부터 하겠습니까?",
      lead: "법원에서 두 번째 봉투가 온 월요일 아침, 반재욱이 평소보다 일찍 출근해 있습니다.",
    },
    c17_start_warm: {
      place: "플로우온 풀필먼트센터 · 야간조 대기실",
      clock: "12월 14일 · 새벽 교대",
      question: "반재욱이 수첩 속 사람들을 혼자 찾아가려 합니다. 누구와 함께 따라가겠습니까?",
      lead: "컵라면 여든 개를 비운 밤 이후, 야간조 대기실에는 당신 몫의 사물함이 하나 생겼습니다.",
    },
    c17_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "12월 14일 · 인사위원회까지 D-5",
      question: "리스 표준 조항을 검토한 변호사가 수첩 반환 요구서도 썼습니다. 이 우연을 어떻게 다루겠습니까?",
      lead: "재교육 조건을 담은 표준 조항이 법무팀 검토를 마치고 돌아온 날, 봉투가 하나 더 왔습니다.",
    },
    c17_start_rush: {
      place: "KD금융그룹 본사 1층 로비",
      clock: "11월 말 · 23:40",
      question: "야간조를 두고 달려온 당신에게 반재욱이 첫 이름부터 같이 가자고 합니다. 어떻게 답하겠습니까?",
      lead: "식어 가는 컵라면을 두고 택시를 탔습니다. 불 꺼진 로비 의자에 반재욱이 혼자 앉아 있습니다.",
    },
    c17_truck: {
      place: "상암동 공원 주차장 · 태오네 떡꼬치 트럭",
      clock: "12월 15일 · 눈발 · 인사위원회까지 D-4",
      question: "수첩 첫 장의 사람이 자기가 뭐라고 적혀 있는지 묻습니다. 어떻게 보여 주겠습니까?",
      lead: "수첩 첫 장의 주소는 은행이 아니라 공원 주차장의 푸드트럭이었습니다.",
    },
    c17_stars: {
      place: "반재욱의 집 · 거실",
      clock: "12월 15일 · 21시",
      question: "아이가 아빠 수첩의 이름마다 별점을 매기고, 두 줄 그인 이름에 꽃을 붙였습니다. 어떻게 하겠습니까?",
    },
    c17_stars_reaction: {
      place: "반재욱의 집 · 식탁",
      clock: "12월 15일 · 23:30",
      question: "이름 스물두 개 옆에 그 집 아이의 나이가 적혀 있습니다. 이 숫자를 어떻게 다루겠습니까?",
    },
    c17_office: {
      place: "문래동 상가 3층 · 복도 끝 폐업한 사무실",
      clock: "12월 16일 · 인사위원회까지 D-3",
      question: "세상을 떠난 사람의 누나가 동생이 그날 억울하다고 말했는지 묻습니다. 무엇이라 답하겠습니까?",
      lead: "수첩에서 줄이 두 개 그어진 이름의 주소를 찾아왔습니다. 유리문의 시트지가 반쯤 떨어져 있습니다.",
    },
    c17_branch_pencil: {
      place: "반재욱의 차 · 뒷자리에 잠든 서아",
      clock: "12월 16일 · 눈발 · 22시",
      question: "수첩 맨 뒷장의 연필 한 줄이 당신 이름이고, 법무팀이 원하는 줄입니다. 이 줄을 어떻게 하겠습니까?",
    },
    c17_branch_pencil_follow: {
      place: "반재욱의 차 · 뒷자리",
      clock: "12월 16일 · 23:10",
      question: "꽃 지우개와 볼펜이 나란히 놓였습니다. 연필로 쓴 당신 이름을 어떻게 남기겠습니까?",
    },
    c17_unreached: {
      place: "트리거랩 4층 · 탕비실",
      clock: "12월 17일 · 인사위원회까지 D-2",
      question: "47명 중 세 명은 끝내 연락이 닿지 않습니다. 대답할 수 없는 사람의 몫을 어떻게 하겠습니까?",
    },
    c17_unreached_reaction: {
      place: "트리거랩 4층 분석관실 · 에코 단말",
      clock: "12월 17일 · 19시",
      question: "회신이 없으면 동의로 본다는 각주가 의견서에 있습니다. 이 한 줄을 어떻게 하겠습니까?",
    },
    c17_legal: {
      place: "KD금융그룹 본사 법무팀 · 회의실",
      clock: "12월 18일 · 인사위원회 전날",
      question: "47명의 목록이 '분석관이 개입한 대상자'로 바뀌어 있고, 반재욱만 빼 주겠다고 합니다. 어떻게 하겠습니까?",
      lead: "법무팀이 먼저 만나자고 했습니다. 회의실 탁자에는 이미 서류철 두 개가 놓여 있습니다.",
    },
    c17_name: {
      place: "상암동 공원 주차장 · 셔터 내린 트럭 앞",
      clock: "12월 18일 · 눈발 · 23:00",
      question: "7년 동안 자기를 똑바로 적어 둔 곳이 그 수첩 하나였다고 정태오가 말합니다. 무엇이라 답하겠습니까?",
    },
    c17_name_reaction: {
      place: "상암동 공원 주차장 · 트럭 옆 간이 의자",
      clock: "12월 19일 · 00:20",
      question: "20년 동안 한 번도 채우지 못한 '지시한 사람' 칸이 있습니다. 반재욱에게 무엇이라 하겠습니까?",
    },
    c17_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "12월 17일",
      question: "감사가 20년 동안 지시한 사람 대신 받아 적은 손을 잘라 왔습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c17_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "12월 19일 · 새벽",
      question: "받아 적은 손만 책임지는 감사의 규칙을 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c17_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 내선 전화 대장",
      clock: "12월 19일 · 07시",
      question: "정태오 해고를 부른 지시가 윤상혁의 자리에서 내려왔습니다. 이 네 자리 번호를 어떻게 쓰겠습니까?",
    },
    c17_final: {
      place: "KD금융그룹 본사 12층 · 인사위원회실 앞 복도",
      clock: "12월 19일 · 인사위원회 10시",
      question: "20년 치 이름이 든 수첩이 당신 손에 있습니다. 법원에 내겠습니까, 돌려주겠습니까, 태우겠습니까?",
      lead: "반재욱이 오늘은 수첩을 코트 안주머니에 넣어 왔습니다. 표지에 별 스티커가 붙어 있습니다.",
    },
    c17_aftershock: {
      place: "상암동 공원 주차장 · 태오네 떡꼬치 트럭",
      clock: "12월 20일 · 눈발 · 저녁",
      question: "수첩 속 사람들이 트럭 앞에 모인 밤, 법무팀은 후속 회의를 잡고 오진우에게는 브릿지은행 전화가 옵니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c17-extension-3317",
    title: "내선 3317",
    text: "정태오를 해고시킨 지시는 7년 전 기업금융전략팀 팀장석, 윤상혁의 내선에서 내려왔습니다. 감사 기록에는 받아 적은 사람의 글씨만 남았습니다.",
  },
  outcomes: {
    c17_after_warm: { tag: "트럭 앞에 남은 결말", title: "불이 꺼질 때까지 소스 통을 같이 흔들었다", text: "수첩 속 사람 열한 명이 처음으로 같은 자리에 모였습니다. 반재욱은 그날 누구의 이름도 적지 않았습니다." },
    c17_after_record: { tag: "원칙을 남긴 결말", title: "이름을 다루는 원칙과 '지시한 사람' 칸을 문서로 남겼다", text: "수첩 속 이름은 주인의 동의 없이 쓰지 않는다는 원칙과, 감사 보고서의 새 칸 하나가 제안서가 됐습니다. 맨 끝에 반재욱의 이름이 있습니다." },
    c17_after_rush: { tag: "먼저 올라간 결말", title: "송년회를 두고 법무팀 후속 회의로 먼저 올라갔다", text: "트럭 앞의 열한 명을 두고 본사로 갔습니다. 그사이 오진우가 트럭 뒤에서 받은 전화가 무엇이었는지는 아무도 묻지 못했습니다." },
  },
  carryovers: {
    c17_after_warm: { trust: 9, humanCost: -5, fatigue: -7 },
    c17_after_record: { legitimacy: 12, trust: 3, fatigue: 5 },
    c17_after_rush: { capital: 6, legitimacy: 4, trust: -8 },
  },
  continuityChallenges: {
    c16_after_warm: { id: "protect-trust", title: "대기실에 남았던 사람답게 같이 가기", text: "당신은 마지막 컵라면까지 야간조 곁에 남았습니다. 이번에는 반재욱을 혼자 보내지 않는 선택을 찾아야 보너스가 열립니다." },
    c16_after_record: { id: "use-reframe", title: "문서로 되갚는 판 바꾸기", text: "당신이 남긴 표준 조항을 검토한 변호사가 수첩 반환 요구서를 썼습니다. 문서로 온 공격을 다른 판으로 바꿔야 합니다." },
    c16_after_rush: { id: "repair-legitimacy", title: "먼저 달려온 밤의 공정함 회복하기", text: "당신은 야간조 대기실을 두고 반재욱에게 먼저 달려왔습니다. 두고 온 사람들 앞에서도 설명할 수 있는 방식으로 수첩을 다뤄야 합니다." },
  },
};
