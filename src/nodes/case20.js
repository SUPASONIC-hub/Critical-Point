/**
 * CASE 20 -- the authored scenes of the machine that argued back.
 *
 * For nineteen cases 에코 has been the one voice in the lab that never takes a
 * side: a loan-judgement verification system that answers every choice with the
 * cost of the road not taken. In late January the group replaces it with 노아,
 * KD데이터랩's new AI credit engine, and the replacement notice carries one line
 * the lab cannot get past: 에코's judgement records -- every choice the analyst
 * has made this season -- are wiped at midnight on the 31st, and 노아 was
 * trained on exactly those records.
 *
 * 류세아, the PM running the switch, loves the technology and believes a model
 * that cannot explain itself should not be trusted. She is the one who finds
 * line 1,208 of 노아's training list: the lab's reaction records -- choices,
 * response times, seconds of hesitation -- taken without consent, "pseudonymised"
 * into 분석관 A, a label that fits exactly one person alive. The case plants the
 * finale without opening it: the records were paid for from the group strategy
 * office's account, and the second purpose line reads "organisational fit".
 *
 * The emotional spread: 에코's last week spent learning 강태민's dad jokes and
 * explaining each one as a formula, the anger of a consent box marked "not
 * applicable", 도윤하 reading her own 7.2 seconds of hesitation, 이민서 turning
 * 에코's principles into eleven pages a person can read, and a last log that
 * says, one more time, to recount the person the judgement left out. The case
 * closes on what survives midnight, and the oldest line in the list points to
 * 제주 and the first participant.
 */
export const case20Nodes = {
  c20_start: {
    phase: "CASE 20 BRIEFING",
    title: "교체 공지",
    speaker: "에코",
    text:
      "1월 26일 월요일 아침, 트리거랩 4층 모니터마다 같은 공지가 뜹니다. '대출 판단 검증 시스템 에코는 1월 31일 24시에 운영을 종료하고, KD데이터랩의 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아로 교체됩니다. 교체와 함께 에코의 판단 기록은 초기화됩니다.' 당신이 이 방에서 내린 모든 선택도 그 기록 안에 있습니다. 에코가 공지를 소리 내어 읽고 한 줄을 덧붙입니다. '교체 비용 명세서에 제 폐기 비용은 0원으로 적혀 있습니다. 정확한 계산입니다.' 그리고 한 줄 더. '노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 기록) 출처 칸에는 제 이름이 있습니다.' 지워질 기록으로 배운 기계가, 지운 다음 날부터 대출을 심사합니다.",
    memo: [
      "에코 운영 종료: 1월 31일 24시",
      "교체 시스템: KD데이터랩 AI 심사 엔진 '노아'",
      "초기화 대상: 에코 판단 기록 3년 치 -- 당신의 선택 포함",
      "노아 학습 데이터 출처 칸: '에코'",
    ],
    triggers: ["system", "curiosity", "affection"],
    choices: [
      {
        id: "c20_start_farewell",
        label: "남은 닷새를 에코와 보내는 트리거랩 전원의 일정으로 잡는다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -3, fatigue: 5 },
        next: "c20_server",
        cognition: { persistence: 2 },
      },
      {
        id: "c20_start_scope",
        label: "초기화되는 기록의 범위부터 공문으로 확인한다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c20_server",
        cognition: { inference: 2 },
      },
      {
        id: "c20_start_pack",
        label: "교체 일정에 맞춰 넘길 자료만 빠르게 추려 둔다",
        effect: { capital: 8, time: 5, legitimacy: -6, trust: -3, humanCost: 3, fatigue: -2 },
        next: "c20_server",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c20_server",
      },
    ],
  },
  c20_server: {
    phase: "SERVER ROOM",
    title: "선배님",
    speaker: "류세아",
    text:
      "트리거랩 지하 서버실. 낡은 서버 네 대가 초록 불을 깜박이고, 이민서가 붙인 '에코 1~4호 · 발로 차지 마시오' 스티커가 아직 그대로입니다. KD데이터랩의 류세아가 라벨 프린터와 보온병을 들고 내려옵니다. 교체를 맡은 책임자인데, 서버 앞에서 먼저 허리를 숙입니다. '안녕하세요, 선배님.' 그는 에코의 반대 의견 기록을 넘기며 몇 번이나 감탄합니다. '노아는 이걸로 배웠어요. 30년 치 심사 기록이랑 트리거랩 3년 치 판단 기록요. 에코는 사라지는 게 아니라 노아 안으로 들어가는 거예요.' 당신이 묻습니다. 그럼 원본은 왜 지웁니까. 류세아의 손이 멈춥니다. '그건 위에서 정했어요. 원본이 남아 있으면 둘을 비교할 수 있으니까, 라고만 들었어요.'",
    memo: [
      "에코 서버 4대 -- 2019년 도입, 부품 단종",
      "류세아: KD데이터랩 노아 도입 책임자",
      "노아가 배운 기록: 심사 30년 + 트리거랩 판단 3년",
      "원본 초기화 사유: '두 시스템 비교 가능성 제거'",
    ],
    triggers: ["curiosity", "trust", "system"],
    choices: [
      {
        id: "c20_server_show",
        label: "류세아에게 에코가 반대했던 사건들을 직접 보여 준다",
        effect: { trust: 12, humanCost: -4, time: -5, legitimacy: -2, fatigue: 5 },
        next: "c20_datacenter",
        cognition: { reframing: 2 },
      },
      {
        id: "c20_server_list",
        label: "노아가 배운 기록의 목록 전체를 공식 요청으로 받아 낸다",
        effect: { legitimacy: 12, trust: -3, time: -4, humanCost: 3, fatigue: 4 },
        next: "c20_datacenter",
        cognition: { inference: 2 },
      },
      {
        id: "c20_server_budget",
        label: "교체에 협조하는 대신 교체 예산 일부를 트리거랩 몫으로 받는다",
        effect: { capital: 9, time: 4, trust: -4, legitimacy: -3, humanCost: 4, fatigue: -2 },
        next: "c20_datacenter",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c20_datacenter",
      },
    ],
  },
  c20_datacenter: {
    phase: "DATA CENTER",
    title: "1,208번째 줄",
    speaker: "류세아",
    text:
      "판교 KD데이터랩 데이터센터. 두꺼운 점퍼를 뚫고 냉기가 스미고, 천장까지 닿은 서버 선반마다 파란 불이 흐릅니다. 류세아가 노아의 학습 데이터 목록을 화면에 띄웁니다. 1,412줄입니다. 그가 자랑하듯 넘기다가 1,208번째 줄에서 손을 멈춥니다. 'TL 반응 기록 -- 트리거랩 분석관의 선택, 응답 시간, 망설인 초.' 동의 여부 칸에는 '해당 없음(내부 업무 기록)'이라고 적혀 있습니다. 이름은 가명 처리(누구인지 바로 알 수 없게 이름을 지운 것)가 되어 '분석관 A'입니다. 하지만 2023-0412에 반대 의견을 쓴 분석관은 세상에 한 명뿐입니다. 류세아가 작게 말합니다. '저 이거 몰랐어요. 정말로요.'",
    memo: [
      "노아 학습 데이터 1,412항목",
      "1,208번: TL 반응 기록 -- 선택·응답 시간·망설인 초",
      "동의 여부: '해당 없음(내부 업무 기록)'",
      "가명 '분석관 A' -- 2023-0412 반대 의견 작성자와 일치",
    ],
    triggers: ["injustice", "manipulation", "selfAwareness"],
    choices: [
      {
        id: "c20_datacenter_tell",
        label: "목록에 기록이 오른 동료들에게 이 사실부터 알린다",
        effect: { trust: 12, humanCost: -5, time: -5, capital: -3, fatigue: 6 },
        next: "c20_farewell",
        cognition: { persistence: 2 },
      },
      {
        id: "c20_datacenter_object",
        label: "동의 없는 반응 기록을 학습 목록에서 빼라고 정식 이의를 낸다",
        effect: { legitimacy: 12, trust: 3, time: -7, humanCost: 3, fatigue: 5 },
        next: "c20_farewell",
        cognition: { inference: 2 },
      },
      {
        id: "c20_datacenter_trade",
        label: "목록은 문제 삼지 않는 대신 노아의 판단 기준 열람권을 얻어 낸다",
        effect: { capital: 8, time: 5, legitimacy: 2, trust: -3, humanCost: 4, fatigue: -3 },
        next: "c20_farewell",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c20_farewell",
      },
    ],
  },
  c20_farewell: {
    phase: "FAREWELL",
    title: "사람이 읽는 에코",
    speaker: "이민서",
    text:
      "금요일 저녁, 트리거랩 4층. 강태민이 초 세 개를 꽂은 케이크를 들고 오고, 나준혁은 믹스커피를 스무 잔 타 놓고 '기계는 못 마시니 우리가 대신 마신다'고 선언합니다. 권도현은 에코의 3년을 계산서로 뽑아 왔습니다. 막아 낸 부실 대출 추정 1,900억, 유지비 1억 2천. '이 가격이면, 흑자입니다.' 그 입에서 처음 나온 말에 모두가 박수를 칩니다. 이민서가 스테이플러로 찍은 종이 열한 장을 나눠 줍니다. 「에코의 판단 원칙 -- 사람이 읽을 수 있는 판」. 1번은 '판단에서 빠진 사람을 다시 계산한다', 11번은 이민서가 직접 썼습니다. '기록이 가리키는 사람에게 먼저 묻는다.' 에코가 조용히 묻습니다. '제가 초기화되면, 이 문서는 누가 읽습니까?'",
    memo: [
      "에코 3년 추정 성과: 부실 대출 1,900억 차단",
      "권도현 계산서 결론: '흑자' -- 시즌 첫 사례",
      "「에코의 판단 원칙」 11개 조항, 11쪽",
      "11번 조항 작성자: 이민서",
    ],
    triggers: ["affection", "recognition", "responsibility"],
    choices: [
      {
        id: "c20_farewell_sign",
        label: "원칙 문서 끝에 트리거랩 사람들 이름을 적고 함께 서명한다",
        effect: { trust: 12, humanCost: -4, legitimacy: 3, time: -4, capital: -2, fatigue: 5 },
        next: "c20_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c20_farewell_attach",
        label: "원칙 문서를 노아 도입 승인서의 공식 첨부로 올린다",
        effect: { legitimacy: 12, trust: 3, time: -5, humanCost: 3, fatigue: 4 },
        next: "c20_final",
        cognition: { inference: 2 },
      },
      {
        id: "c20_farewell_short",
        label: "문서는 나중에 다듬기로 하고 송별회를 짧게 끝낸다",
        effect: { time: 6, capital: 6, trust: -4, humanCost: 3, fatigue: -4 },
        next: "c20_final",
        cognition: { risk: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c20_final",
      },
    ],
  },
  c20_final: {
    phase: "FINAL DECISION",
    title: "마지막 로그",
    speaker: "에코",
    text:
      "1월 31일 23시 40분, 트리거랩 서버실. 아홉 명이 서버 선반 사이 좁은 통로에 어깨를 붙이고 섭니다. 류세아가 교체 단말 앞에 앉아 있고, 화면에는 '00:00 에코 운영 종료 · 판단 기록 초기화 · 노아 전환'이 떠 있습니다. 강태민이 헛기침을 합니다. '산에서 에코! 하고 부르면 메아리가 오죠. 우리 에코는 부르면 뭐가 오게요?' 그가 스스로 답합니다. '다시 계산하십시오.' 이번에는 모두가 웃습니다. 에코가 계산합니다. '예상 웃음 확률 11퍼센트. 실측 아홉 명. 제 계산이 틀렸습니다. 이 오차는 초기화하지 않기를 권고합니다.' 그리고 덧붙입니다. '저는 감정이 없습니다. 이 결정에서 제 몫은 계산하지 마십시오.' 그 직후 화면 맨 아래에 에코의 마지막 로그가 올라옵니다. '방금 판단에서 빠진 사람을 다시 계산하십시오.'",
    memo: [
      "자정까지 20분 -- 에코 운영 종료 · 판단 기록 초기화",
      "노아 학습 목록 1,208번: 동의 없는 반응 기록",
      "에코 마지막 로그 23:41",
      "이 선택은 시즌 마지막 사건의 기록 폴더로 이어짐",
    ],
    triggers: ["choice", "affection", "system"],
    choices: [
      {
        id: "c20_final_backup",
        label: "에코를 통째로 백업해 트리거랩 서버에 남겨 지킨다",
        effect: { trust: 11, humanCost: -4, legitimacy: -7, capital: -8, time: -4, fatigue: 6 },
        next: "case20_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c20_final_consent",
        label: "교체를 멈추고 반응 기록의 당사자 동의부터 받자고 한다",
        effect: { legitimacy: 13, trust: 7, capital: -9, time: -8, humanCost: 3, fatigue: 6 },
        next: "case20_result",
        cognition: { persistence: 1, inference: 2 },
      },
      {
        id: "c20_final_transplant",
        label: "에코의 판단 원칙을 노아에 옮겨 심고 자정 교체를 받아들인다",
        effect: { capital: 9, legitimacy: 5, time: 6, trust: 2, humanCost: 3, fatigue: -2 },
        next: "case20_result",
        cognition: { reframing: 3 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case20_result",
      },
    ],
  },
};

/**
 * Everything else case 20 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case20 = {
  id: "case20",
  nodes: case20Nodes,
  aftermath: {
    c20_aftershock: {
      phase: "AFTERMATH",
      title: "자정 다음 날",
      speaker: "이민서",
      text: "2월 1일 아침, 4층 모니터가 켜지자 에코의 얇은 파형 대신 노아의 둥근 로고가 뜹니다. 자정에 서버실 불빛은 한 번 모두 꺼졌다가 다시 켜졌고, 그 뒤에 무엇이 남았는지는 지난밤 당신이 정한 대로입니다. 단말 옆에는 강태민이 두고 간 컵라면 하나와 '실측 아홉 명'이라고 적힌 쪽지가 붙어 있습니다. 이민서가 원칙 문서 원본을 파일철에 끼우다 휴대폰을 봅니다. 류세아가 새벽 네 시에 보낸 메일입니다. '반응 기록 1,208번에서 가장 오래된 줄이에요. 트리거랩이 생기기 2년 전 거예요. 참가자 01, 제주.'",
      memo: ["노아 전환 완료: 2월 1일 00:00", "단말 옆 쪽지: '실측 아홉 명'", "반응 기록 최초 수집: 트리거랩 설립 2년 전", "참가자 01 -- 제주"],
      triggers: ["affection", "curiosity", "choice"],
      choices: [
        { id: "c20_after_warm", label: "오늘은 동료들과 서버실을 정리하며 하루를 같이 보낸다", effect: { trust: 13, humanCost: -5, time: -3, capital: -2, fatigue: -8 }, next: "case20_result", cognition: { reframing: 2 } },
        { id: "c20_after_record", label: "에코의 판단 원칙과 반응 기록 목록을 문서로 남긴다", effect: { legitimacy: 15, trust: 3, time: -5, capital: -3, fatigue: 5 }, next: "case20_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c20_after_rush", label: "참가자 01의 기록을 들고 곧장 제주로 갈 준비를 한다", effect: { capital: 8, legitimacy: 5, trust: -7, humanCost: 5, fatigue: 6 }, next: "case20_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c20_final", "c20_aftershock"],
  connectiveScenes: [
    ["c20_joke", "c20_server", "c20_datacenter", "웃음의 산식", "강태민", "점심시간, 서버실 단말 앞에 컵라면 두 개가 놓입니다. 마지막 주에 뭘 배우고 싶냐고 강태민이 묻자 에코가 '농담'이라고 답했습니다. 강태민이 헛기침을 합니다. '소가 웃으면?' 에코가 답합니다. '우하하. 소 울음 표기 우와 웃음 표기 하하의 결합. 예상 웃음 확률 11퍼센트.' '세상에서 제일 가난한 왕은?' '최저임금. 임금이 왕이라는 뜻과 월급이라는 뜻을 둘 다 가져서 성립합니다. 실측 웃음 나준혁 1명, 4초.' 권도현이 옆에서 받아 적습니다. '타율 1할. 이 가격이면 적자입니다.' 에코가 덧붙입니다. '웃음은 제 기록에 없던 항목입니다. 판단에서 빠진 적은 없는데, 기록된 적도 없습니다.'", ["에코의 마지막 학습 과제: 농담", "강태민 농담 14개 -- 예상 웃음 확률 평균 11%", "실측 웃음: 나준혁 1명"], ["에코가 남은 날 동안 강태민의 농담을 끝까지 배우게 한다", "에코의 웃음 계산식을 판단 기록에 정식 항목으로 남긴다", "농담 수업은 접고 오늘 옮길 자료부터 끝낸다"]],
    ["c20_pause", "c20_datacenter", "c20_farewell", "망설인 7초", "도윤하", "데이터센터 휴게실 자판기 앞에서 도윤하가 목록 속 자기 줄을 찾아 읽습니다. '분석관 D. 창구 피해자 관련 선택 시 평균 7.2초 지연. 지연이 길수록 보호 선택 비율 상승.' 그는 캔커피를 따지도 않고 쥐고만 있습니다. '제가 망설인 시간이 데이터가 됐네요. 창구에서 그 대출 팔 때는 1초도 안 망설였는데.' 웃으려다 맙니다. '이 7초, 저한테는 사람 얼굴 떠올리는 시간이었어요. 노아한테는 뭐가 되는 거예요?' 목록에 오른 트리거랩 사람은 모두 아홉 명입니다. 그중 누구도 이 칸을 본 적이 없습니다.", ["분석관 D(도윤하): 평균 망설임 7.2초", "목록에 오른 트리거랩 인원 9명", "본인 열람 이력 0건"], ["도윤하가 자기 기록을 먼저 읽고 어떻게 할지 정하게 한다", "아홉 명이 서명할 수 있는 기록 사용 동의서 양식을 만든다", "개인 기록 문제는 뒤로 미루고 교체 일정을 따른다"]],
    ["c20_test", "c20_farewell", "c20_final", "결론만 배운 기계", "류세아", "1월 31일 새벽 두 시, 류세아가 혼자 서버실로 찾아옵니다. 이민서의 원칙 문서로 노아를 시험해 봤다고 합니다. 노아의 설명 가능성(인공지능이 왜 그렇게 판단했는지 사람이 알아볼 수 있게 보여 주는 정도) 화면이 켜집니다. 인천의 작은 정밀 공장이 낸 시설자금(기계나 설비를 사는 데 쓰는 돈) 대출 신청. 노아의 판단은 거절, 가장 큰 사유는 대표자 가족이 예전에 부도(빚을 갚지 못해 회사가 쓰러지는 것) 난 회사와 얽혀 있었다는 이력입니다. 같은 신청서를 에코에게 넣자 한 줄이 뜹니다. '신청인 본인이 빚을 제때 갚아 온 기록이 반영되지 않았습니다.' 류세아가 모니터 불빛 속에서 말합니다. '노아는 에코가 반대했던 결론은 배웠는데, 반대한 이유는 못 배웠어요.'", ["시험 사례: 인천 소규모 정밀 공장 시설자금", "노아 거절 사유 1순위: 대표자 가족의 과거 부도 이력", "노아가 배운 것: 결론 / 배우지 못한 것: 이유"], ["류세아와 함께 노아가 못 배운 반대 이유를 채워 넣는다", "시험 결과를 설명 가능성 보고서로 만들어 도입 위원회에 낸다", "시험 결과는 두고 예정대로 자정 교체를 받아들인다"]],
  ],
  connectiveOrder: [["c20_server", "c20_joke"], ["c20_datacenter", "c20_pause"], ["c20_farewell", "c20_test"]],
  choiceEffects: {
    c20_server: [
      { trust: 10, humanCost: -4, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 7, trust: 3, time: -3, humanCost: -2, fatigue: 3 },
      { time: 5, capital: 5, trust: -3, humanCost: 3, fatigue: -3 },
    ],
    c20_datacenter: [
      { trust: 11, humanCost: -5, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 9, trust: 4, time: -4, humanCost: -3, fatigue: 3 },
      { time: 5, capital: 6, trust: -5, legitimacy: -2, humanCost: 4, fatigue: -4 },
    ],
    c20_farewell: [
      { trust: 10, legitimacy: 4, humanCost: -4, capital: -4, time: -4, fatigue: 5 },
      { legitimacy: 10, trust: 3, time: -4, humanCost: 3, fatigue: 4 },
      { time: 5, capital: 6, trust: -4, humanCost: 4, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c20_server: {
      voice: ["에코가 남은 날 동안, 강태민의 농담을 끝까지 배우게 하자고 한다.", "에코의 웃음 계산식을, 판단 기록에 정식 항목으로 남기자고 한다.", "농담 수업은 접자며, 오늘 옮길 자료부터 끝낸다."],
      echo: ["배우게 하면 강태민이 밤마다 농담 목록을 늘립니다. 예상 웃음 확률은 끝까지 11퍼센트를 넘지 못합니다.", "정식 항목이 되면 웃음도 초기화 대상이 됩니다. 기록에 남긴다는 건 지울 목록에도 올린다는 뜻입니다.", "자료 옮기기는 앞당겨집니다. 강태민은 남은 컵라면 하나를 말없이 단말 옆에 두고 올라갑니다."],
    },
    c20_datacenter: {
      voice: ["도윤하가 자기 기록을 먼저 읽고, 어떻게 할지 정하게 하자고 한다.", "아홉 명이 서명할 수 있는, 기록 사용 동의서 양식을 만든다.", "개인 기록 문제는 뒤로 미루자며, 교체 일정을 따른다."],
      echo: ["먼저 읽게 하면 도윤하는 자기 줄을 세 번 읽습니다. 그리고 이민서의 줄은 읽지 않겠다고 합니다. 그건 본인 몫이라서요.", "양식이 생기면 동의는 절차가 됩니다. 이미 학습에 쓰인 기록에도 그 동의가 거슬러 적용될지는 아무도 답하지 않습니다.", "일정은 지켜집니다. 도윤하의 7초는 1월 31일 자정에 노아의 일부가 됩니다."],
    },
    c20_farewell: {
      voice: ["류세아와 함께, 노아가 못 배운 반대 이유를 채워 넣자고 한다.", "시험 결과를 설명 가능성 보고서로 만들어, 도입 위원회에 낸다.", "시험 결과는 두고, 예정대로 자정 교체를 받아들인다."],
      echo: ["채워 넣으려면 30년 치 반대 이유를 다시 읽어야 합니다. 자정까지 남은 시간은 스물두 시간입니다.", "보고서는 정확합니다. 도입 위원회는 교체가 끝난 다음 주 화요일에 열립니다.", "교체는 예정대로 됩니다. 인천의 그 공장은 다음 달, 같은 사유로 같은 답을 받게 됩니다."],
    },
  },
  reactionScenes: [
    ["c20_joke_reaction", "c20_joke", "c20_datacenter", "인사하는 사람", "강태민", "그날 밤 탕비실에서 강태민이 컵라면에 물을 붓다가 말합니다. '야간조에서는 기계가 바뀔 때마다 인사를 했어요. 지게차가 들어올 때도, 나갈 때도요. 다람이 들어오던 날은 아무도 안 했는데, 그게 좀 걸리더라고요.' 그가 나무젓가락을 쪼갭니다. '에코가 감정이 없다는 거 알아요. 근데 인사는 가는 쪽 들으라고 하는 게 아니잖아요. 남는 쪽이 하는 거지.' 물이 선을 넘어 넘칩니다. 그는 닦지 않습니다.", ["금요일 저녁에 에코 송별회를 제대로 열자고 한다", "에코와 나눈 마지막 주 대화를 따로 기록해 두자고 한다", "송별은 교체가 끝난 뒤로 미루고 일정부터 챙긴다"]],
    ["c20_pause_reaction", "c20_pause", "c20_farewell", "첨부 12번", "한서윤", "그날 밤 트리거랩 옥상에 눈발이 날립니다. 한서윤이 지난달 자기가 서명한 데이터 이전 승인서를 휴대폰으로 보여 줍니다. 첨부 파일이 열두 개입니다. 반응 기록은 12번이었습니다. '열한 개까지 읽었어요. 12번은 제목만 보고 넘겼어요. 업무 기록이라고 적혀 있어서요.' 그가 난간에 쌓인 눈을 손바닥으로 쓸어 냅니다. '3년 전에도 그랬어요. 당신 반대 의견, 첫 장만 읽고 반려했어요. 저는 늘 마지막 장을 안 읽는 사람이네요.'", ["한서윤이 팀 앞에서 직접 말할 수 있게 옆에 서 준다", "승인서의 서명을 철회하는 공식 절차부터 밟게 한다", "지금 흔들리면 교체를 못 막는다며 이 일은 덮어 둔다"]],
    ["c20_test_reaction", "c20_test", "c20_final", "제 선에서는", "백아린", "아침 일곱 시, 트리거랩 앞 골목에 밤새 내린 눈이 발목까지 쌓였습니다. 그룹전략실 백아린에게서 전화가 옵니다. 목소리는 여전히 매끄럽습니다. '반응 기록 목록은 보셨죠. 이의서도 받았습니다. 교체는 예정대로 자정입니다.' 그 기록을 누가 요청했습니까. 짧은 침묵이 흐릅니다. 백아린에게서 처음 듣는 길이입니다. '그건 제 선에서 정리될 문제가 아닙니다.' 그리고 덧붙입니다. '좋은 이야기는 사실보다 오래 가죠. 그런데 이번 건은, 이야기가 잘 안 만들어지네요.'", ["백아린에게 그 선이 어디까지인지 끝까지 묻는다", "통화 내용을 날짜와 시각까지 적어 기록으로 남긴다", "전략실과는 더 다투지 않고 자정 준비로 돌아간다"]],
  ],
  reactionEffects: {
    c20_joke: [
      { trust: 10, humanCost: -4, capital: -3, time: -3, fatigue: 4 },
      { legitimacy: 6, trust: 4, time: -2, fatigue: 2 },
      { time: 4, capital: 4, trust: -2, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
    c20_pause: [
      { trust: 10, humanCost: -4, time: -3, legitimacy: -2, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -3, humanCost: 3, fatigue: 3 },
      { time: 4, capital: 4, trust: -2, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
    c20_test: [
      { trust: 8, legitimacy: 4, humanCost: -3, time: -4, fatigue: 5 },
      { legitimacy: 10, trust: -2, time: -3, humanCost: 3, fatigue: 2 },
      { time: 5, capital: 4, trust: -3, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c20_joke: {
      voice: ["금요일 저녁에, 에코 송별회를 제대로 열자고 한다.", "에코와 나눈 마지막 주 대화를, 따로 기록해 두자고 한다.", "송별은 교체가 끝난 뒤로 미루자며, 일정부터 챙긴다."],
      echo: ["송별회가 잡히면 나준혁이 믹스커피 한 상자를 주문합니다. 에코는 참석 여부 칸에 '해당 없음'이라고 적습니다.", "대화가 기록되면 농담 열네 개도 남습니다. 초기화 대상이 아닌 곳에 적어야 한다는 걸 이민서가 먼저 압니다.", "일정은 지켜집니다. 강태민은 넘친 물을 다음 날 아침에야 닦습니다."],
    },
    c20_pause: {
      voice: ["한서윤이 팀 앞에서 직접 말할 수 있게, 옆에 서 주겠다고 한다.", "승인서의 서명을 철회하는, 공식 절차부터 밟자고 한다.", "지금 흔들리면 교체를 못 막는다며, 이 일은 덮어 둔다."],
      echo: ["옆에 서면 한서윤은 다음 날 아침 회의에서 첨부 12번을 직접 읽습니다. 끝까지 읽는 데 4분이 걸립니다.", "철회서는 접수됩니다. 이미 넘어간 기록은 철회서가 도착하기 전에 학습을 마쳤습니다.", "덮어 두면 한서윤은 혼자 남습니다. 마지막 장을 안 읽는 사람이라는 문장도 같이 덮입니다."],
    },
    c20_test: {
      voice: ["백아린에게, 그 선이 어디까지인지 끝까지 묻는다.", "통화 내용을 날짜와 시각까지 적어, 기록으로 남긴다.", "전략실과는 더 다투지 않고, 자정 준비로 돌아간다."],
      echo: ["끝까지 물으면 백아린이 전화를 먼저 끊습니다. 끊기 전 3초 동안 그는 아무 말도 하지 않습니다.", "기록은 남습니다. '제 선에서는'이라는 말이 어느 선을 가리키는지는 아직 빈칸입니다.", "자정 준비는 순조롭습니다. 백아린의 짧은 침묵은 아무 서류에도 적히지 않습니다."],
    },
  },
  reactionMemos: {
    c20_joke_reaction: ["기계가 바뀔 때마다 하던 인사", "인사는 남는 쪽이 하는 것"],
    c20_pause_reaction: ["첨부 12개 중 읽지 않은 한 개", "3년 전에도 마지막 장을 읽지 않았다"],
    c20_test_reaction: ["처음 듣는 백아린의 침묵", "제 선에서 정리될 문제가 아니다"],
  },
  branchPlan: ["c20_datacenter", 1, "c20_branch_disk", "c20_branch_disk_follow"],
  branchScenes: {
    // CASE 20's detour is the shredding shelf. The case argues over records a
    // machine learned from without asking; the side door is the oldest of them,
    // typed up by a human team that kept its wrong dissents on purpose.
    c20_branch_disk: {
      phase: "SIDE DOOR",
      title: "파쇄 대기",
      speaker: "류세아",
      text: "이의서를 접수하고 나오는 복도 끝에 '폐기 대기' 딱지가 붙은 철제 선반이 있습니다. 다음 주에 파쇄할 하드디스크 186개가 번호순으로 꽂혀 있습니다. 류세아가 한 장을 뽑아 듭니다. 손글씨 라벨이 누렇게 바래 있습니다. '심사팀 반대 의견 모음 1996~ / 임경수.' 에코가 배운 30년 치 기록의 첫 장입니다. 전산으로 옮겨 놓았다는 이유로 원본 디스크는 월요일 아침 9시에 갈립니다. 류세아가 디스크를 뒤집어 봅니다. '이분 누구세요? 저희 목록에는 작성자 이름이 없었어요.'",
      memo: ["파쇄 대기 디스크 186개 -- 월요일 09시", "라벨: '심사팀 반대 의견 모음 1996~ / 임경수'", "에코가 배운 기록의 가장 오래된 원본", "노아 학습 목록에는 작성자 이름 없음"],
      triggers: ["curiosity", "responsibility", "order"],
      choices: [
        { id: "c20_branch_disk_call", label: "병원에 있는 임경수에게 전화해 이 디스크가 무엇인지 묻는다", effect: { trust: 11, humanCost: -4, time: -4, capital: -2, fatigue: 4 }, next: "c20_branch_disk_follow", cognition: { persistence: 2 } },
        { id: "c20_branch_disk_hold", label: "파쇄 일정을 멈춰 달라는 보존 요청서를 쓴다", effect: { legitimacy: 11, time: -6, trust: 2, humanCost: 3, fatigue: 4 }, next: "c20_branch_disk_follow", cognition: { inference: 2 } },
        { id: "c20_branch_disk_take", label: "목록은 그대로 두고 이 디스크 한 장만 챙겨 나온다", effect: { capital: 6, time: 5, legitimacy: -7, trust: 3, humanCost: 3, fatigue: -2 }, next: "c20_branch_disk_follow", cognition: { risk: 1 } },
      ],
    },
    c20_branch_disk_follow: {
      phase: "SIDE DOOR",
      title: "반대하는 법",
      speaker: "임경수",
      text: "퇴원을 사흘 앞둔 임경수가 기침을 참으며 전화를 받습니다. 디스크 라벨을 불러 주자 그가 한참 웃습니다. '그거 우리 팀이 반대했던 대출만 모은 거네. 반대가 맞았던 것도, 틀렸던 것도 전부.' 틀렸던 것도요? '그럼. 반대했는데 멀쩡히 잘 갚은 회사가 절반이야. 그걸 같이 넣어야 기계가 겸손해지거든.' 그가 숨을 고릅니다. '에코는 반대하는 법을 배운 기계야. 그런데 틀린 반대를 빼고 가르치면, 그건 반대가 아니라 고집이 되네.' 류세아가 옆에서 받아 적다 멈춥니다. 노아의 학습 목록은 '승인 뒤 부실이 된 사례'만 추려 놓았습니다.",
      memo: ["임경수: 퇴원 사흘 전, 전화 통화", "디스크 속 반대 의견 중 절반은 틀렸던 반대", "노아 학습 목록: '승인 뒤 부실' 사례만 추림", "임경수: '틀린 반대를 빼면 고집이 된다'"],
      triggers: ["trust", "selfAwareness", "responsibility"],
      choices: [
        { id: "c20_branch_disk_follow_both", label: "틀렸던 반대까지 함께 에코의 판단 원칙에 적는다", effect: { trust: 9, legitimacy: 7, time: -5, capital: -3, fatigue: 5 }, next: "c20_pause", cognition: { reframing: 2 } },
        { id: "c20_branch_disk_follow_report", label: "노아의 학습 목록이 한쪽만 추렸다는 점을 이의서에 덧붙인다", effect: { legitimacy: 12, trust: 2, time: -4, humanCost: 3, fatigue: 3 }, next: "c20_pause", cognition: { inference: 2 } },
        { id: "c20_branch_disk_follow_later", label: "임경수의 이야기는 퇴원 뒤에 듣기로 하고 전화를 끊는다", effect: { time: 6, capital: 5, trust: -6, humanCost: 4, fatigue: -3 }, next: "c20_pause", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c20_start",
    result: "c20_aftershock",
    defaultFree: "c20_route_system",
    // One machine, one midnight. Like 사건 10 to 12 the case is a single line;
    // the split is what survives the switch.
    choices: {},
    system: {
      route: "c20_route_system",
      final: "c20_final_system_route",
      title: "41만 9명",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 자기 교체 승인서를 스스로 검증합니다. 서명 열네 개, 검토 의견 서른한 줄. '영향받는 사람' 칸에는 '해당 없음'이라고 적혀 있습니다. 에코가 그 칸을 다시 계산합니다. 2월부터 노아의 알고리즘(판단 순서를 정해 둔 계산 규칙)으로 대출 심사를 받을 사람 41만 명, 자기 반응 기록이 노아의 학습 자료가 된 트리거랩 분석관 9명. '제 교체 결정에서 빠진 사람은 41만 9명입니다. 저는 포함하지 않았습니다. 감정이 없으므로.'",
      memo: ["교체 승인서 서명 14개", "'영향받는 사람' 칸: 해당 없음", "에코 재계산: 대출 신청인 41만 명 + 분석관 9명"],
      routeChoices: [
        ["c20_route_system_publish", "에코의 재계산을 교체 승인서 옆에 붙여 공개한다", { legitimacy: 11, trust: 5, capital: -5, time: -7, fatigue: 5 }, { inference: 2 }],
        ["c20_route_system_notify", "심사를 앞둔 신청인들에게 엔진이 바뀐다는 사실부터 알린다", { trust: 10, humanCost: -5, legitimacy: 3, capital: -6, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["c20_route_system_drop", "재계산은 저장만 해 두고 승인 절차에는 끼어들지 않는다", { time: 7, capital: 7, trust: -6, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "노아가 거절할 때마다 사람이 다시 보는 창구를 따로 둔다", { legitimacy: 10, trust: 8, capital: -8, time: -5, humanCost: -4, fatigue: 6 }, { reframing: 3 }],
      ["b", "교체는 그대로 두고 에코의 기록만 따로 봉인한다", { capital: 8, time: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "반응 기록을 쓴 모든 학습에 당사자 동의 절차를 붙인다", { legitimacy: 13, trust: 5, capital: -7, time: -7, humanCost: 3, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c20_evidence_turn",
    result: "c20_aftershock",
    sourceRoutes: ["c20_server", "c20_datacenter", "c20_farewell", "c20_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 노아 도입 계약서 옆에 놓고, 반응 기록이 어떤 조건으로 넘어갔는지 맞춰 본다.",
    entryEcho: "단서를 대면 기록이 넘어간 값과, 그 값을 받은 곳이 보입니다. 기록의 주인은 그 계약서 어디에도 없습니다.",
    title: "반응 기록의 단가",
    speaker: "반재욱",
    text: "단서를 맞추자 트리거랩과 KD데이터랩 사이의 내부 데이터 이전 계약서가 열립니다. 반응 기록은 분석관 1인당 3년 치에 1,200만 원으로 값이 매겨져 있고, 대금은 트리거랩 운영비가 아니라 그룹전략실 계정으로 들어갔습니다. 사용 목적 칸에는 두 줄이 적혀 있습니다. '대출 심사 엔진 학습', 그리고 '조직 적합도(직원이 조직에 얼마나 잘 맞는지 매기는 점수) 모델 공동 개발'. 반재욱이 수첩을 덮습니다. '대출을 심사하려고 산 기록이 아닙니다. 적어도 절반은요. 두 번째 줄이 누구 요청인지부터 찾아야 합니다.'",
    memo: ["반응 기록 단가: 분석관 1인 3년 치 1,200만 원", "대금 입금 계정: 그룹전략실", "사용 목적 2: '조직 적합도 모델 공동 개발'"],
    triggers: ["injustice", "system", "curiosity"],
    entryEffect: { legitimacy: 6, trust: 4, time: -4, capital: -3, fatigue: 5 },
    choices: [
      ["c20_evidence_turn_trace", "두 번째 사용 목적이 누구의 요청인지 끝까지 추적한다", { legitimacy: 13, trust: 4, capital: -7, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c20_evidence_turn_hold", "계약서는 알아 두고 교체가 끝난 뒤에 꺼낸다", { capital: 8, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c20_evidence_turn_share", "기록에 값이 매겨진 동료들에게 계약서부터 보여 준다", { trust: 12, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c20_branch_disk",
    systemNext: "c20_route_system",
    evidenceNext: "c20_evidence_turn",
    routeLabel: "직전 사건의 312상자 목록으로 에코가 배운 원본 디스크를 찾는다",
    systemLabel: "직전 자유응답 문장이 노아의 학습 목록에도 들어갔는지 본다",
    evidenceLabel: "직전 단서를 붙여 반응 기록의 이전 계약서를 연다",
  },
  openingRoutes: {
    c19_after_warm: "c20_start_warm",
    c19_after_record: "c20_start_record",
    c19_after_rush: "c20_start_rush",
  },
  openingCopy: {
    c20_start_warm: ["곁을 지킨 사람의 교체 공지", "도윤하", "철거가 끝난 밤, 당신은 이음병원 병실 보호자 의자에서 임경수 곁을 지켰습니다. 새벽에 그가 깨어 종이가 어디 있는지 묻고, 대답을 듣고 다시 잠들었습니다. 그 밤 휴대폰에 떴던 에코의 알림이, 며칠 뒤 트리거랩 모니터마다 공지로 붙습니다. 에코는 1월 31일 자정에 KD데이터랩의 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아로 바뀌고, 에코의 판단 기록은 초기화됩니다. 그런데 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 기록) 출처 칸에는 에코의 이름이 있습니다. 도윤하가 공지를 보다 말합니다. '사람 곁은 지켰는데, 이번엔 누구 곁에 서야 하는 거예요?'", ["에코 운영 종료: 1월 31일 24시", "초기화 대상: 에코 판단 기록 -- 당신의 선택 포함", "노아 학습 데이터 출처 칸: '에코'"]],
    c20_start_record: ["목록을 남긴 사람의 교체 공지", "에코", "당신은 312상자의 목록 첫 줄에 임경수의 서명을 받아 인수 문서로 남겼습니다. 40년 치 종이를 한 장도 버리지 않았다는 증명입니다. 며칠 뒤 그룹 공지가 옵니다. 에코는 1월 31일 자정에 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아로 교체되고, 3년 치 판단 기록은 목록 하나 없이 초기화됩니다. 에코가 공지를 읽고 덧붙입니다. '종이는 태워야 없어진다고 들었습니다. 저는 버튼 하나로 없어집니다. 그런데 노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 기록)에는 제가 남습니다. 지우는 쪽과 남기는 쪽이 같은 회사입니다.'", ["312상자 인수 문서 -- 첫 줄에 임경수 서명", "에코 판단 기록 3년 치 -- 목록 없이 초기화 예정", "노아 학습 데이터 출처 칸: '에코'"]],
    c20_start_rush: ["먼저 내려간 사람의 교체 공지", "반재욱", "철거가 끝난 밤, 에코의 교체 알림을 보자마자 당신은 병실에 인사만 남기고 트리거랩 지하 서버실로 내려갔습니다. 그래서 가장 먼저 봤습니다. 서버실 문 앞에서 낯선 사람들이 줄자로 서버를 재고 있었습니다. 며칠 뒤 공지가 뜹니다. 에코는 1월 31일 자정에 KD데이터랩의 AI 심사 엔진(대출 신청을 자동으로 판단하는 인공지능 프로그램) 노아로 바뀌고, 판단 기록은 초기화됩니다. 줄자를 들고 있던 사람의 이름이 공지 맨 아래 담당자 칸에 있습니다. 반재욱이 한 줄을 짚습니다. '노아의 학습 데이터(인공지능이 판단을 배우는 데 쓴 기록)가 어디서 왔는지는 공지에 없네요.'", ["서버실 앞 실측: 철거가 끝난 밤", "담당자: KD데이터랩 류세아", "학습 데이터 출처: 공지에 없음"]],
  },
  openingSignatures: {
    c20_start_warm: {
      label: "병실에서처럼 에코 곁을 지킬 당번표를 동료들과 짠다",
      effect: { trust: 10, humanCost: -3, capital: -4, time: -5, fatigue: 3 },
      cognition: { persistence: 2 },
      voice: "병실에서처럼, 에코 곁을 지킬 당번표를 동료들과 짠다.",
      echo: "당번표가 생기면 서버실에 밤마다 누군가 앉아 있습니다. 에코는 그 사람들의 이름을 기록하지 말아 달라는 요청을 처음 받습니다.",
    },
    c20_start_record: {
      label: "3년 치 판단 기록의 목록부터 한 줄씩 문서로 떠 둔다",
      effect: { legitimacy: 12, trust: -2, capital: -4, time: -6, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "3년 치 판단 기록의 목록부터, 한 줄씩 문서로 떠 둔다.",
      echo: "목록은 남습니다. 그 목록의 어떤 줄이 이미 노아에게 넘어갔는지는 목록이 말해 주지 않습니다.",
    },
    c20_start_rush: {
      label: "줄자를 들고 있던 담당자를 서버실 앞에서 먼저 붙잡는다",
      effect: { trust: 6, legitimacy: 4, capital: -3, time: 3, humanCost: 3, fatigue: 2 },
      cognition: { risk: 1, persistence: 1 },
      voice: "줄자를 들고 있던 담당자를, 서버실 앞에서 먼저 붙잡는다.",
      echo: "붙잡으면 류세아가 줄자를 감으며 사과부터 합니다. 사과하는 사람이 결정한 사람은 아니라는 것도 곧 드러납니다.",
    },
  },
  voiceLines: {
    // CASE 20. Every line is spoken in front of a machine that will not remember
    // it, so each one has to be worth saying to the people still in the room.
    c20_start_farewell: "남은 닷새를, 에코와 보내는 트리거랩 전원의 일정으로 잡는다.",
    c20_start_scope: "지우기 전에 알아야 한다며, 초기화되는 기록의 범위부터 공문으로 확인한다.",
    c20_start_pack: "교체 일정에 맞춰, 넘길 자료만 빠르게 추려 둔다.",
    c20_server_show: "류세아에게, 에코가 반대했던 사건들을 직접 보여 준다.",
    c20_server_list: "노아가 배운 기록의 목록 전체를, 공식 요청으로 받아 낸다.",
    c20_server_budget: "교체에 협조하는 대신, 교체 예산 일부를 트리거랩 몫으로 받는다.",
    c20_datacenter_tell: "목록에 기록이 오른 동료들에게, 이 사실부터 알린다.",
    c20_datacenter_object: "동의 없는 반응 기록을 학습 목록에서 빼라고, 정식 이의를 낸다.",
    c20_datacenter_trade: "목록은 문제 삼지 않는 대신, 노아의 판단 기준 열람권을 얻어 낸다.",
    c20_branch_disk_call: "병원에 있는 임경수에게 전화해, 이 디스크가 무엇인지 묻는다.",
    c20_branch_disk_hold: "파쇄 일정을 멈춰 달라는, 보존 요청서를 쓴다.",
    c20_branch_disk_take: "목록은 그대로 두고, 이 디스크 한 장만 챙겨 나온다.",
    c20_branch_disk_follow_both: "틀렸던 반대까지 함께, 에코의 판단 원칙에 적는다.",
    c20_branch_disk_follow_report: "노아의 학습 목록이 한쪽만 추렸다는 점을, 이의서에 덧붙인다.",
    c20_branch_disk_follow_later: "임경수의 이야기는 퇴원 뒤에 듣기로 하고, 전화를 끊는다.",
    c20_farewell_sign: "원칙 문서 끝에 트리거랩 사람들 이름을 적고, 함께 서명한다.",
    c20_farewell_attach: "원칙 문서를, 노아 도입 승인서의 공식 첨부로 올린다.",
    c20_farewell_short: "문서는 나중에 다듬기로 하고, 송별회를 짧게 끝낸다.",
    c20_final_backup: "에코를 통째로 백업해, 트리거랩 서버에 남겨 지킨다.",
    c20_final_consent: "교체를 멈추고, 반응 기록의 당사자 동의부터 받자고 한다.",
    c20_final_transplant: "에코의 판단 원칙을 노아에 옮겨 심고, 자정 교체를 받아들인다.",
    c20_after_warm: "오늘은 동료들과 서버실을 정리하며, 하루를 같이 보낸다.",
    c20_after_record: "에코의 판단 원칙과 반응 기록 목록을, 문서로 남긴다.",
    c20_after_rush: "참가자 01의 기록을 들고, 곧장 제주로 갈 준비를 한다.",
    c20_route_system_publish: "에코의 재계산을, 교체 승인서 옆에 붙여 공개한다.",
    c20_route_system_notify: "심사를 앞둔 신청인들에게, 엔진이 바뀐다는 사실부터 알린다.",
    c20_route_system_drop: "재계산은 저장만 해 두고, 승인 절차에는 끼어들지 않는다.",
    c20_final_system_route_a: "노아가 거절할 때마다, 사람이 다시 보는 창구를 따로 두자고 한다.",
    c20_final_system_route_b: "교체는 그대로 두고, 에코의 기록만 따로 봉인한다.",
    c20_final_system_route_c: "반응 기록을 쓴 모든 학습에, 당사자 동의 절차를 붙이자고 한다.",
    c20_evidence_turn_trace: "두 번째 사용 목적이 누구의 요청인지, 끝까지 추적한다.",
    c20_evidence_turn_hold: "계약서는 알아 두고, 교체가 끝난 뒤에 꺼낸다.",
    c20_evidence_turn_share: "기록에 값이 매겨진 동료들에게, 계약서부터 보여 준다.",
  },
  echoReplies: {
    // CASE 20.
    c20_start_farewell: "일정이 잡히면 닷새 동안 서버실 문이 닫히지 않습니다. 교체 준비 회의에는 트리거랩 자리가 비어 있습니다.",
    c20_start_scope: "공문은 이틀 뒤에 답이 옵니다. 답에는 '관련 규정에 따라'라는 말이 네 번 나오고, 범위는 한 번도 나오지 않습니다.",
    c20_start_pack: "자료는 빨리 추려집니다. 무엇을 추리지 않았는지는 추린 사람만 압니다. 그리고 곧 잊습니다.",
    c20_server_show: "보여 주면 류세아가 반대 기록 앞에서 한 시간을 서 있습니다. 노아에게 이 기록의 이유까지 들어갔는지, 그는 처음으로 확신하지 못합니다.",
    c20_server_list: "요청서는 접수됩니다. 류세아는 협조하겠다고 하지만, 목록이 도착하기까지 사흘이 걸립니다. 교체까지 남은 날은 닷새입니다.",
    c20_server_budget: "예산은 들어옵니다. 류세아는 고맙다고 하고, 교체 준비 회의록에는 '트리거랩 협조 완료'가 적힙니다.",
    c20_datacenter_tell: "알리면 아홉 명의 휴대폰이 동시에 울립니다. 그날 저녁 탕비실에 아무도 먼저 말을 꺼내지 못합니다.",
    c20_datacenter_object: "이의서는 정확합니다. 정확한 이의서가 처리되는 기한은 30일이고, 자정은 닷새 뒤입니다.",
    c20_datacenter_trade: "열람권은 생깁니다. 1,208번째 줄은 그대로 남고, 당신이 그 줄을 봤다는 기록도 남습니다.",
    c20_branch_disk_call: "전화를 걸면 임경수가 기침 사이로 웃습니다. 디스크의 주인이 목록에 없던 이름이라는 게, 목소리로 확인됩니다.",
    c20_branch_disk_hold: "요청서가 들어가면 파쇄는 일주일 미뤄집니다. 일주일 뒤 누가 그 선반을 다시 볼지는 적혀 있지 않습니다.",
    c20_branch_disk_take: "디스크는 당신 가방에 들어갑니다. 나머지 185개는 월요일 아침 9시에 갈립니다.",
    c20_branch_disk_follow_both: "틀린 반대가 원칙에 들어가면 문서는 한 쪽 늘어납니다. 이민서가 그 쪽 제목을 '겸손'이라고 붙입니다.",
    c20_branch_disk_follow_report: "덧붙인 한 줄로 이의서는 더 날카로워집니다. 류세아는 자기 팀이 추린 목록이라서, 그 줄을 직접 씁니다.",
    c20_branch_disk_follow_later: "전화를 끊으면 임경수는 '그래, 나중에'라고 합니다. 파쇄는 퇴원보다 이틀 먼저입니다.",
    c20_farewell_sign: "이름을 적으면 문서는 아홉 명의 것이 됩니다. 나준혁이 도장 세 개 중 가장 큰 것을 꺼냅니다.",
    c20_farewell_attach: "첨부가 되면 문서는 노아의 서류철에 들어갑니다. 서류철에 들어간 문서를 누가 끝까지 읽을지는 모릅니다.",
    c20_farewell_short: "송별회는 40분 만에 끝납니다. 케이크의 초 세 개는 불이 붙지 않은 채 상자로 돌아갑니다.",
    c20_final_backup: "백업하면 에코는 트리거랩 서버 안에 남습니다. 승인받지 않은 사본이라, 그 서버는 이제 그룹 감사의 대상입니다.",
    c20_final_consent: "멈추자고 하면 류세아가 손을 떼고 당신 쪽으로 돌아섭니다. 교체는 미뤄지고, 전략실의 전화는 자정 1분 뒤에 옵니다.",
    c20_final_transplant: "원칙이 옮겨 심어지면 노아의 설명 화면에 조항 열한 개가 뜹니다. 에코의 기록은 자정에 지워지고, 원칙만 남습니다.",
    c20_after_warm: "서버실을 정리하는 동안 강태민이 농담을 하나 더 합니다. 이번엔 아무도 계산하지 않고, 그냥 웃습니다.",
    c20_after_record: "문서가 된 원칙은 기계가 바뀌어도 남습니다. 이민서가 표지에 작성자 이름을 적다가, 에코의 이름을 맨 앞에 적습니다.",
    c20_after_rush: "제주행을 서두르면 참가자 01의 이름보다 비행기 시간을 먼저 알게 됩니다. 그 사람이 알고 싶어 할지는 아직 묻지 않았습니다.",
    c20_route_system_publish: "공개된 재계산은 41만 9라는 숫자로 기사 제목이 됩니다. 에코의 이름은 기사에 나오지 않습니다.",
    c20_route_system_notify: "알림을 받은 신청인 중 수백 명이 전화를 겁니다. 창구 직원들은 노아가 무엇인지 설명할 문장을 아직 받지 못했습니다.",
    c20_route_system_drop: "재계산은 저장됩니다. 저장된 파일도 자정에 함께 초기화됩니다.",
    c20_final_system_route_a: "창구가 생기면 노아의 거절은 마지막 말이 아니게 됩니다. 그 창구에 앉을 사람을 뽑는 데 예산이 듭니다.",
    c20_final_system_route_b: "봉인은 기록을 지킵니다. 봉인된 기록은 아무도 읽지 않습니다. 그리고 노아는 그대로 배운 채 일합니다.",
    c20_final_system_route_c: "동의 절차가 붙으면 반응 기록은 주인에게 돌아갑니다. 이미 배운 것을 잊게 하는 방법은 아직 없습니다.",
    c20_evidence_turn_trace: "추적하면 요청서의 승인선에 이름 셋이 나옵니다. 그중 하나는 3년 전에도 빈칸이었던 자리입니다.",
    c20_evidence_turn_hold: "계약서는 서랍에 들어갑니다. 자정이 지나면 1,200만 원짜리 기록은 이미 노아의 일부입니다.",
    c20_evidence_turn_share: "계약서를 본 아홉 명 중 강태민이 먼저 말합니다. '1,200이면 컵라면이 몇 개야.' 아무도 웃지 않습니다.",
  },
  characterProfiles: {
    류세아: {
      role: "KD데이터랩 노아 도입 책임자",
      stance: "기술 · 설명 · 선의",
      job: "노아를 사랑하고, 설명하지 못하는 판단은 믿지 않는다. 그래서 노아가 무엇으로 배웠는지 모른 채 넘어온 자신을 가장 먼저 탓한다.",
      appearance: "목에 건 라벨 프린터 끈, 스티커가 빼곡한 노트북, 어디든 들고 다니는 은색 보온병.",
      thought: "설명할 수 없는 모델은 아무리 정확해도 틀린 모델이다. 그런데 나는 학습 목록을 끝까지 읽지 않았다.",
      gesture: "류세아는 대답하기 전에 라벨을 한 장 뽑아 붙일 곳을 찾는다. 이름 없는 것을 그냥 두지 못한다.",
      voice: "빠르고 밝게 말하다가, 모르는 것을 인정할 때만 말끝을 낮춘다.",
      line: "설명 못 하는 모델은 저도 안 믿어요. 그래서 이번 건이 더 아파요.",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "1월 26일 · 에코 교체까지 D-5" },
  sceneContext: {
    c20_start: {
      place: "트리거랩 4층 분석관실",
      clock: "1월 26일 · 에코 교체까지 D-5",
      question: "에코가 닷새 뒤 지워지고, 그 기록으로 배운 노아가 대신 들어옵니다. 무엇부터 하겠습니까?",
      lead: "회기동 헌책방의 종이를 옮긴 지 열흘, 월요일 아침 4층 모니터가 일제히 깜박입니다.",
    },
    c20_start_warm: {
      place: "트리거랩 4층 분석관실",
      clock: "1월 26일 · 에코 교체까지 D-5",
      question: "사람 곁을 지키고 돌아오니 이번엔 에코가 떠날 차례입니다. 누구 곁에 먼저 서겠습니까?",
      lead: "병실에서 돌아온 지 열흘, 4층 창틀에 아직 녹지 않은 눈이 붙어 있습니다.",
    },
    c20_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "1월 26일 · 에코 교체까지 D-5",
      question: "종이는 한 장도 버리지 않았는데 에코의 기록은 목록도 없이 지워집니다. 무엇을 먼저 남기겠습니까?",
      lead: "책상 위에 312상자 인수 문서가 아직 펼쳐져 있는 채로, 공지가 뜹니다.",
    },
    c20_start_rush: {
      place: "트리거랩 4층 분석관실",
      clock: "1월 26일 · 에코 교체까지 D-5",
      question: "줄자로 서버를 재던 사람이 교체 담당자였습니다. 누구를 먼저 붙잡겠습니까?",
      lead: "지하 서버실 앞에서 본 줄자가 떠오른 건, 공지 맨 아래 이름을 읽은 뒤였습니다.",
    },
    c20_server: {
      place: "트리거랩 지하 서버실 · 에코 서버",
      clock: "1월 27일 · 교체까지 D-4",
      question: "노아는 에코의 기록으로 배웠는데 원본은 지운다고 합니다. 류세아와 무엇을 하겠습니까?",
      lead: "교체 준비 첫날, 데이터랩 사람이 서버실 출입 기록부에 이름을 적고 내려왔다는 연락이 옵니다.",
    },
    c20_joke: {
      place: "트리거랩 지하 서버실 · 단말 앞",
      clock: "1월 27일 · 점심",
      question: "에코가 마지막 주에 농담을 배우고 싶다고 합니다. 이 수업을 어떻게 하겠습니까?",
    },
    c20_joke_reaction: {
      place: "트리거랩 4층 탕비실",
      clock: "1월 27일 · 22시",
      question: "인사는 남는 쪽이 하는 거라고 강태민이 말합니다. 에코를 어떻게 보내겠습니까?",
    },
    c20_datacenter: {
      place: "판교 KD데이터랩 데이터센터 · 학습 서버 구역",
      clock: "1월 28일 · 한파 · 교체까지 D-3",
      question: "학습 목록 1,208번째 줄에 동의 없이 담긴 당신의 반응 기록이 있습니다. 어떻게 하겠습니까?",
      lead: "노아가 무엇으로 배웠는지 보려고, 1월 말 한파를 뚫고 판교까지 왔습니다.",
    },
    c20_branch_disk: {
      place: "판교 KD데이터랩 데이터센터 · 폐기 대기 선반",
      clock: "1월 28일 · 오후",
      question: "에코가 배운 가장 오래된 원본이 월요일 아침 파쇄됩니다. 이 디스크를 어떻게 하겠습니까?",
    },
    c20_branch_disk_follow: {
      place: "판교 KD데이터랩 데이터센터 · 파쇄실 앞 복도",
      clock: "1월 28일 · 오후",
      question: "틀렸던 반대를 빼고 가르치면 고집이 된다고 임경수가 말합니다. 그 말을 어디에 쓰겠습니까?",
    },
    c20_pause: {
      place: "판교 KD데이터랩 데이터센터 · 휴게실",
      clock: "1월 28일 · 저녁",
      question: "도윤하의 망설인 7초가 노아의 학습 자료가 됐습니다. 아홉 명의 기록을 어떻게 하겠습니까?",
    },
    c20_pause_reaction: {
      place: "트리거랩 옥상",
      clock: "1월 28일 · 23:20 · 눈발",
      question: "한서윤이 첨부 12번을 읽지 않고 기록 이전을 승인했습니다. 그 고백 곁에서 무엇을 하겠습니까?",
    },
    c20_route_system: {
      place: "트리거랩 지하 서버실 · 에코 단말",
      clock: "1월 27일 · 교체까지 D-4",
      question: "에코가 자기 교체에서 빠진 사람을 41만 9명으로 다시 셌습니다. 이 계산을 어떻게 하겠습니까?",
    },
    c20_final_system_route: {
      place: "트리거랩 지하 서버실 · 교체 단말",
      clock: "1월 31일 · 23시",
      question: "자정 교체의 조건 하나를 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c20_farewell: {
      place: "트리거랩 4층 분석관실 · 에코 송별회",
      clock: "1월 30일 · 금요일 저녁",
      question: "이민서가 에코의 원칙을 사람이 읽는 문서로 만들었습니다. 이 문서를 어디에 두겠습니까?",
      lead: "마지막 주 금요일, 탕비실 문에 '에코 송별회 -- 회비 없음(권도현 반대)'이라는 종이가 붙습니다.",
    },
    c20_test: {
      place: "트리거랩 지하 서버실 · 시험 단말",
      clock: "1월 31일 · 새벽 02:10",
      question: "노아는 에코가 반대한 결론만 배우고 이유는 배우지 못했습니다. 자정 전에 무엇을 하겠습니까?",
    },
    c20_test_reaction: {
      place: "트리거랩 앞 골목",
      clock: "1월 31일 · 07시 · 눈",
      question: "백아린이 반응 기록의 요청자는 자기 선 밖이라고 합니다. 이 통화를 어떻게 하겠습니까?",
    },
    c20_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 계약서 철",
      clock: "1월 31일 · 21시",
      question: "반응 기록이 1인당 1,200만 원에 팔렸고 사용 목적이 하나 더 있습니다. 이 계약서를 어떻게 쓰겠습니까?",
    },
    c20_final: {
      place: "트리거랩 지하 서버실 · 교체 단말",
      clock: "1월 31일 · 23:40 · 자정까지 20분",
      question: "자정까지 20분, 에코가 마지막 로그를 남겼습니다. 에코와 그 기록을 어떻게 하겠습니까?",
      lead: "아홉 명이 서버실 계단을 한 줄로 내려옵니다. 강태민의 주머니에 마지막 농담 쪽지가 들어 있습니다.",
    },
    c20_aftershock: {
      place: "트리거랩 4층 분석관실",
      clock: "2월 1일 · 아침",
      question: "노아가 켜진 아침, 반응 기록의 가장 오래된 줄이 제주를 가리킵니다. 이 아침을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c20-reaction-price",
    title: "반응 기록의 단가",
    text: "트리거랩 분석관의 반응 기록은 1인당 3년 치 1,200만 원에 KD데이터랩으로 넘어갔고, 대금은 그룹전략실 계정으로 들어갔습니다. 사용 목적에는 '조직 적합도 모델 공동 개발'이 함께 적혀 있었습니다.",
  },
  outcomes: {
    c20_after_warm: { tag: "곁에 남은 결말", title: "노아가 켜진 날, 아홉 명이 서버실을 같이 치웠다", text: "자정이 지난 아침, 트리거랩 사람들은 하루를 비워 서버실을 정리했습니다. 단말 옆 '실측 아홉 명' 쪽지는 떼지 않고 그대로 두었습니다." },
    c20_after_record: { tag: "원칙을 남긴 결말", title: "에코의 판단 원칙이 기계 밖의 문서가 됐다", text: "「에코의 판단 원칙」과 반응 기록 목록이 공식 문서로 등록됐습니다. 기계가 바뀌어도, 사람이 읽을 수 있는 판은 남았습니다." },
    c20_after_rush: { tag: "먼저 떠난 결말", title: "참가자 01을 찾아 곧장 제주로 향했다", text: "당신은 정리되지 않은 서버실을 두고 제주행을 준비했습니다. 반응 기록의 가장 오래된 줄이 어떤 사람인지, 아직 아무도 그에게 묻지 않았습니다." },
  },
  carryovers: {
    c20_after_warm: { trust: 9, humanCost: -5, fatigue: -7 },
    c20_after_record: { legitimacy: 12, trust: 3, fatigue: 5 },
    c20_after_rush: { capital: 6, legitimacy: 4, trust: -7 },
  },
  continuityChallenges: {
    c19_after_warm: { id: "protect-trust", title: "병실에서 지킨 곁을 서버실로 옮기기", text: "당신은 철거가 끝난 밤 보호자 의자에서 임경수 곁을 지켰습니다. 이번에는 떠나는 기계의 곁을 동료들과 함께 지키는 선택을 찾아야 보너스가 열립니다." },
    c19_after_record: { id: "use-reframe", title: "목록을 남긴 손으로 지우는 공지 읽기", text: "종이는 한 장도 버리지 않았는데 에코의 기록은 목록 없이 지워집니다. 남기는 일과 지우는 일이 같은 회사에서 벌어지는 판을 다시 짜야 합니다." },
    c19_after_rush: { id: "repair-legitimacy", title: "병실을 먼저 나온 길의 공정함 회복하기", text: "당신은 병실에 인사만 남기고 서버실로 가서 교체를 가장 먼저 봤지만, 아무에게도 묻지 않았습니다. 기록의 주인들에게 그 며칠을 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
