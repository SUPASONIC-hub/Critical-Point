/**
 * CASE 34 -- the daughter, and the one line her father wrote about the dissent.
 *
 * Thirty-three cases have chased 윤상혁 through other people's paper: a dormant
 * account, a gallery, a receipt log, boxes in a prosecutor's van. In early July
 * the paper comes to the analyst on its own. 윤서진, his daughter, a graduate
 * student in financial ethics, finds his 2023 notebook in the study at home and
 * sends one photographed line: "0412 -- 반대 의견 -- 보관 X". She says she wants
 * to protect her father. She also says she knows what he did, and the case is
 * about whether both sentences can stay true at once.
 *
 * The notebook is a double portrait. Every work note is in black ink; twenty-
 * three lines a year are in red, and all of them are her: a conference talk
 * ("꼭"), a birthday cake, "중간고사 -- 전화하지 말 것" one line under the order
 * not to keep the dissent. The man who wrote "do not keep" keeps every drawing
 * she ever made. The analyst sees the face he wears only for her -- in the back
 * row of her thesis talk in a polo shirt with a convenience-store sunflower --
 * and hears the one thing he asks: not in front of her.
 *
 * The laughter is character-driven: 문하준, writing his college essay at the
 * bookshop, spends an hour arguing financial ethics with a stranger who says a
 * banker who lends "to the end" is Santa Claus, and each draws the other badly;
 * 반서아 rates the notebook five stars for handwriting and zero for stickers.
 * The anger is the same legal letter 백아린 received last week, sent to a
 * student with only the name changed, and a prosecutor who will summon her if
 * the notebook is not handed over by Monday. The sorrow is a pear peeled in one
 * unbroken ribbon at 1 a.m. and the advice that came with it -- "a judgement
 * needs someone who objects" -- from the man who ordered the objection
 * discarded. The joy is a boy who already knew her surname and did not mind.
 * The case ends on who hands the notebook over, and how; the aftermath closes
 * on a sky coming down low over the bookshop and a message about a blocked
 * drain at the factory in 인천, which opens 사건 35.
 */
export const case34Nodes = {
  c34_start: {
    phase: "CASE 34 BRIEFING",
    title: "모르는 번호",
    speaker: "이민서",
    text:
      "7월 1일 밤, 회기동 헌책방 1층 아지트에서 당신의 휴대폰이 울립니다. 어젯밤 '만나 주실 수 있을까요' 한 줄만 보냈던 번호입니다. '윤상혁의 딸 윤서진입니다. 아버지 서재에서 찾은 2023년 수첩이에요. 아버지를 지키고 싶어서 보내 드려요.' 사진이 한 장 붙어 있습니다. 모서리가 닳은 검은 가죽 수첩의 한 쪽, 만년필 글씨로 이렇게 적혀 있습니다. '0412 — 반대 의견 — 보관 X.' 반재욱이 돋보기도 없이 화면을 오래 봅니다. '상무님 글씨 맞습니다. 7년 동안 그 글씨로 된 쪽지를 받았어요.' 이민서가 사진을 확대하다가 손을 멈춥니다. '지키고 싶다는 사람이 제일 불리한 줄을 제일 먼저 보냈네요. 이건 함정이거나, 아주 진심이거나 둘 중 하나예요.'",
    memo: [
      "발신: 윤서진 -- 윤상혁의 딸, 금융윤리 전공 대학원생",
      "사진 한 장: '0412 — 반대 의견 — 보관 X'",
      "반재욱: 윤상혁 본인 필체로 보임",
      "윤서진의 조건: 수첩은 직접 만나서만 보여 줌",
    ],
    triggers: ["curiosity", "trust", "injustice"],
    choices: [
      {
        id: "c34_start_meet",
        label: "그가 원하는 대로 혼자 직접 만나러 간다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -1, fatigue: 5 },
        next: "c34_study",
        cognition: { persistence: 2 },
      },
      {
        id: "c34_start_verify",
        label: "만나기 전에 필체와 날짜부터 기록과 대조한다",
        effect: { legitimacy: 12, time: -5, trust: -4, humanCost: 2, fatigue: 4 },
        next: "c34_study",
        cognition: { inference: 2 },
      },
      {
        id: "c34_start_scan",
        label: "수첩 전체를 먼저 찍어 보내 달라고 답장한다",
        effect: { capital: 6, time: 7, legitimacy: -5, trust: 1, humanCost: 3, fatigue: 1 },
        next: "c34_study",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c34_study",
      },
    ],
  },
  c34_study: {
    phase: "THE NOTEBOOK",
    title: "서명하지 않은 결정",
    speaker: "윤서진",
    text:
      "이튿날 오후, 신촌의 대학원 연구동 4층. 윤서진의 자리는 서고 옆 공동 연구실 맨 끝 칸입니다. 모니터 위에 붙은 논문 제목이 먼저 보입니다. 「서명하지 않은 결정은 누구의 것인가」. 그가 웃지도 않고 말합니다. '제목은 아버지 일을 알기 전에 정했어요. 지금은 좀 창피하고요.' 서랍에서 검은 가죽 수첩이 나옵니다. 날짜마다 만년필로 두세 줄씩입니다. 4월 둘째 주에 '0412 — 반대 의견 — 보관 X'가 있고, 같은 주 금요일 칸에 '온 개관 — 서진 등록금 확인'이 있습니다. 갤러리 온은 어머니의 갤러리입니다. 윤서진이 그 줄을 손끝으로 가립니다. '저는 아버지를 지키고 싶어요. 그러려면 이 줄까지 읽혀야 하는 건지, 그걸 모르겠어요.'",
    memo: [
      "2023년 수첩 -- 윤상혁 서재 책상 서랍 안쪽에서 발견",
      "4월 둘째 주: '0412 — 반대 의견 — 보관 X'",
      "같은 주 금요일: '온 개관 — 서진 등록금 확인'",
      "윤서진 석사 논문: 「서명하지 않은 결정은 누구의 것인가」",
    ],
    triggers: ["affection", "injustice", "selfAwareness"],
    choices: [
      {
        id: "c34_study_together",
        label: "가리지 말고 처음부터 끝까지 같이 읽자고 한다",
        effect: { trust: 12, humanCost: -5, time: -5, legitimacy: -1, fatigue: 5 },
        next: "c34_sketch",
        cognition: { persistence: 2 },
      },
      {
        id: "c34_study_copy",
        label: "윤서진의 동의를 받아 모든 쪽을 사본으로 남긴다",
        effect: { legitimacy: 11, trust: 1, time: -6, humanCost: 3, fatigue: 4 },
        next: "c34_sketch",
        cognition: { inference: 2 },
      },
      {
        id: "c34_study_page",
        label: "필요한 쪽만 찍고 가린 줄은 보지 않은 걸로 한다",
        effect: { capital: 5, time: 6, trust: 3, legitimacy: -6, humanCost: 4, fatigue: -2 },
        next: "c34_sketch",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c34_sketch",
      },
    ],
  },
  c34_sketch: {
    phase: "UNLIKELY PAIR",
    title: "끝까지 대출해 주는 은행원",
    speaker: "문하준",
    text:
      "사흘째 저녁, 윤서진이 수첩을 들고 헌책방 1층으로 옵니다. 먼저 와 있던 사람은 문하준입니다. 수시 자기소개서를 쓰려고 임소율의 책상을 빌렸고, 제목은 '끝까지 대출해 주는 은행원'입니다. 윤서진이 어깨 너머로 읽다가 참지 못합니다. '끝까지 대출해 주면 그건 은행원이 아니라 산타예요.' 문하준도 지지 않습니다. '끝까지 보고 해 준다는 뜻이거든요.' 둘은 한 시간 동안 금융윤리로 싸웁니다. 문하준은 스케치북에 돋보기를 든 윤서진을, 윤서진은 다리가 세 개인 은행 건물을 그립니다. 문하준이 웃다가 묻습니다. '누나는 왜 이 공부 해요?' 윤서진이 수첩을 가방 깊숙이 밀어 넣습니다. 이 소년의 아버지가 누구였는지, 그는 오늘 오기 전에 이미 읽고 왔습니다.",
    memo: [
      "문하준 자기소개서 제목: '끝까지 대출해 주는 은행원'",
      "윤서진: 문하준의 아버지가 가온정밀 문성호 대표라는 걸 알고 옴",
      "스케치북: 돋보기 든 윤서진, 다리 셋 달린 은행",
      "문하준은 윤서진의 성을 아직 묻지 않음",
    ],
    triggers: ["affection", "trust", "choice"],
    choices: [
      {
        id: "c34_sketch_wait",
        label: "윤서진이 스스로 말할 때까지 곁에서 기다린다",
        effect: { trust: 11, humanCost: -3, time: -5, capital: -2, fatigue: 5 },
        next: "c34_seminar",
        cognition: { reframing: 2 },
      },
      {
        id: "c34_sketch_mother",
        label: "문가을에게 먼저 알리고 둘이 만나도 되는지 묻는다",
        effect: { legitimacy: 10, trust: 5, time: -5, capital: -1, humanCost: 3, fatigue: 4 },
        next: "c34_seminar",
        cognition: { inference: 2 },
      },
      {
        id: "c34_sketch_part",
        label: "오늘은 수첩 얘기만 하자며 둘을 떼어 놓는다",
        effect: { time: 5, capital: 3, legitimacy: 2, trust: -1, humanCost: 4, fatigue: -3 },
        next: "c34_seminar",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c34_seminar",
      },
    ],
  },
  c34_seminar: {
    phase: "THE OTHER FACE",
    title: "뒷줄의 아버지",
    speaker: "윤상혁",
    text:
      "주말 오전, 연구동 지하 소강당. 윤서진의 논문 중간 발표에 청중은 열한 명입니다. 맨 뒷줄 끝에 감색 폴로셔츠 차림의 남자가 혼자 앉아 있습니다. 넥타이도 서류철도 없이, 편의점에서 산 해바라기 한 송이를 무릎에 올려 두었습니다. 윤상혁입니다. 딸이 첫 장을 넘기자 그가 수첩을 펴고 받아 적습니다. 지도교수가 '서명하지 않은 사람에게 책임을 물을 수 있습니까' 하고 묻자 윤서진이 3초 멈추고, 그 3초 동안 윤상혁의 펜도 멈춥니다. 박수는 그가 제일 먼저 칩니다. 복도에서 당신과 마주친 그는 놀라지 않습니다. '수첩은 서진이가 가져갔겠지. 어릴 때부터 내 서랍을 열던 애야.' 그가 해바라기를 내려다봅니다. '오늘은 저 애 날이네. 저 애 앞에서만은 그 얘기를 꺼내지 말아 주게.'",
    memo: [
      "청중 11명 -- 맨 뒷줄 끝에 윤상혁",
      "지도교수 질문에 윤서진 3초 침묵, 윤상혁의 펜도 3초 멈춤",
      "윤상혁: 딸이 수첩을 가져간 걸 이미 알고 있음",
      "부탁 하나: 딸 앞에서는 수첩 얘기를 하지 말 것",
    ],
    triggers: ["affection", "manipulation", "responsibility"],
    choices: [
      {
        id: "c34_seminar_honor",
        label: "오늘은 그 부탁을 받아들이고 윤서진의 날로 둔다",
        effect: { trust: 10, humanCost: -4, legitimacy: -2, time: -4, fatigue: 5 },
        next: "c34_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c34_seminar_ask",
        label: "딸이 없는 복도에서 '보관 X'를 쓴 이유를 묻는다",
        effect: { legitimacy: 12, trust: -4, time: -3, humanCost: 3, fatigue: 5 },
        next: "c34_final",
        cognition: { inference: 2 },
      },
      {
        id: "c34_seminar_bargain",
        label: "부탁을 들어줄 테니 검찰에 스스로 나가라고 조건을 건다",
        effect: { capital: 6, legitimacy: 5, time: 3, trust: -3, humanCost: 4, fatigue: -2 },
        next: "c34_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c34_final",
      },
    ],
  },
  c34_final: {
    phase: "FINAL DECISION",
    title: "보관 X",
    speaker: "윤서진",
    text:
      "다음 날 밤 11시, 헌책방 1층. 윤서진이 비닐 파일에 넣은 수첩을 탁자 위에 올려놓습니다. 오늘 저녁 아버지와 식탁에 마주 앉았다고 합니다. '아무것도 안 물으셨어요. 복숭아만 깎아 주셨어요. 껍질이 한 번도 안 끊기게요. 그게 제일 무서웠어요.' 나은호 검사가 정한 기한은 내일 오전 10시입니다. 그 전에 수첩이 가지 않으면 윤서진이 불려 갑니다. 그가 수첩 위에 손을 얹습니다. '제 손으로 내면 저는 아버지를 고발한 딸이 되고, 안 내면 저는 아버지 대신 불려 가는 딸이 돼요. 당신이 정해 달라는 게 아니에요. 같이 정해 달라는 거예요.' 잠깐 뒤 그가 덧붙입니다. '아버지를 지키는 방법이 이걸 숨기는 거라면, 저는 이 공부를 잘못한 거예요.'",
    memo: [
      "제출 기한: 7월 6일 오전 10시, 서울중앙지검 나은호 검사실",
      "기한을 넘기면 윤서진이 직접 불려 감",
      "그룹 법무팀: 수첩을 '영업비밀 문서'로 보고 반환 요구",
      "이 선택은 시즌 마지막 사건의 빈 서명란으로 이어짐",
    ],
    triggers: ["choice", "affection", "responsibility"],
    choices: [
      {
        id: "c34_final_father",
        label: "내기 전에 윤서진이 아버지에게 직접 묻고 오도록 하루를 번다",
        effect: { trust: 12, humanCost: -5, legitimacy: -5, time: -5, capital: -2, fatigue: 6 },
        next: "case34_result",
        cognition: { reframing: 2 },
      },
      {
        id: "c34_final_submit",
        label: "윤서진이 직접 수첩을 내고 신변 보호를 함께 신청한다",
        effect: { legitimacy: 13, trust: 5, time: -7, capital: -3, humanCost: 3, fatigue: 5 },
        next: "case34_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c34_final_copy",
        label: "원본은 윤서진에게 두고 사본만 내가 검찰에 넘긴다",
        effect: { capital: 7, time: 5, legitimacy: 4, trust: -6, humanCost: 4, fatigue: -3 },
        next: "case34_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case34_result",
      },
    ],
  },
};

/**
 * Everything else case 34 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case34 = {
  id: "case34",
  nodes: case34Nodes,
  aftermath: {
    c34_aftershock: {
      phase: "AFTERMATH",
      title: "복숭아 한 상자",
      speaker: "윤서진",
      text: "이튿날 저녁, 신촌 대학원 연구동의 공동 연구실. 수첩이 어디로 갔든 윤서진의 서랍에는 사본 한 벌이 남았습니다. 그가 복숭아 한 상자를 책상에 올립니다. 아버지가 사 온 건데 혼자 먹기엔 많다고 합니다. 문하준이 스케치북의 '돋보기 든 윤서진' 옆에 작은 해바라기를 그려 넣고, 반재욱은 새 수첩 표지에서 반서아가 붙인 별 스티커 하나를 떼어 건넵니다. 윤서진이 그걸 노트북에 붙이다가 처음으로 소리 내어 웃습니다. '저 스티커 붙이는 거 금지당하고 자랐어요.' 복숭아를 깎던 그가 사본 첫 장을 폅니다. '아직 끝까지 못 읽었어요. 혼자서는요.' 그때 강태민에게서 문자가 옵니다. '인천 공장 배수구가 막혔답니다. 장마 오기 전에 뚫어야 한대요.'",
      memo: ["윤서진의 서랍에 남은 수첩 사본 한 벌", "복숭아 한 상자 -- 윤상혁이 산 것", "반서아의 별 스티커 한 장 -- 윤서진 노트북으로", "강태민: 끝까지정밀 배수구 막힘, 장마 전에 손봐야 함"],
      triggers: ["affection", "trust", "responsibility"],
      choices: [
        { id: "c34_after_warm", label: "오늘은 연구실 불이 꺼질 때까지 사본을 끝까지 같이 읽는다", effect: { trust: 12, humanCost: -5, legitimacy: 1, time: -3, capital: -3, fatigue: -7 }, next: "case34_result", cognition: { reframing: 2 } },
        { id: "c34_after_record", label: "수첩의 그 한 줄과 나온 경위를 공식 기록으로 남긴다", effect: { legitimacy: 13, trust: 4, time: -5, capital: -2, fatigue: 4 }, next: "case34_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c34_after_rush", label: "사본을 쥐고 곧장 33층 프린터 기록을 쫓으러 간다", effect: { capital: 7, legitimacy: 5, trust: -6, humanCost: 4, fatigue: 6 }, next: "case34_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c34_final", "c34_aftershock"],
  connectiveScenes: [
    ["c34_margin", "c34_study", "c34_sketch", "빨간 잉크", "반재욱", "반재욱이 사진으로 받은 수첩 쪽들을 헌책방 탁자에 한 장씩 늘어놓습니다. 업무 메모는 전부 검은 잉크인데, 빨간 잉크로 쓴 줄이 한 해에 스물세 번 나옵니다. 전부 딸의 일정입니다. '서진 학회 발표 5/2 — 꼭', '서진 생일 — 케이크 예약'. '0412 — 반대 의견 — 보관 X'는 검은 잉크이고, 바로 아래 줄이 빨간 잉크입니다. '서진 중간고사 — 전화하지 말 것.' 두 색이 같은 날 쓰인 건지는 필적 감정(글씨를 누가 언제 썼는지 전문가가 가려내는 일)을 해야 압니다. 반재욱이 새로 산 수첩을 옆에 폅니다. 원래 수첩은 증거 봉투에 들어갔습니다. '같은 손으로 이런 걸 같이 적어요. 저도 그랬습니다.'", ["빨간 잉크 23줄 -- 전부 딸의 일정", "'보관 X' 바로 아래 줄: '서진 중간고사 — 전화하지 말 것'", "반재욱의 원래 수첩은 검찰 증거 봉투 안"], ["빨간 줄 스물세 개는 가족의 몫이라며 가려 준다", "잉크 색까지 필적 감정을 맡겨 쓴 시기를 가린다", "검은 줄만 골라 오늘 안에 요약본을 만든다"]],
    ["c34_pear", "c34_sketch", "c34_seminar", "새벽 한 시의 배", "윤서진", "문하준이 돌아간 뒤, 헌책방 앞 골목의 편의점 파라솔 아래에서 윤서진이 캔 음료를 굴리며 말합니다. '석사 면접 전날 새벽 한 시에, 아버지가 배를 깎아 주셨어요. 껍질이 한 번도 안 끊겼어요. 그러면서 그러셨어요. 면접관이 반대하면 왜 반대하는지 끝까지 물어라, 반대하는 사람이 있어야 판단이 선다.' 그가 캔을 내려놓습니다. '그 말 듣고 이 전공을 골랐어요. 그 말을 한 사람이, 그해 봄에 반대 의견을 보관하지 말라고 썼고요.'", ["석사 면접 전날 새벽 1시 -- 끊기지 않은 배 껍질", "윤상혁의 말: '반대하는 사람이 있어야 판단이 선다'", "그 말과 '보관 X' 사이의 날짜는 한 해 안"], ["그 말은 진심이었을 거라고 윤서진 편에서 말해 준다", "그 말을 한 날짜를 수첩의 날짜와 맞춰 본다", "아버지 얘기는 접고 내일 발표 준비부터 돕는다"]],
    ["c34_hallway", "c34_seminar", "c34_final", "모레 오전 10시", "나은호", "발표가 끝난 복도에서 휴대폰이 울립니다. 나은호 검사입니다. 김밥을 씹는 소리가 먼저 들립니다. '수첩 있는 거 압니다. 그 집 가사도우미가 서랍 열린 걸 봤대요.' 그가 원하는 건 임의제출(가진 사람이 스스로 수사기관에 증거를 내는 일)입니다. '모레 오전 10시까지 가져오세요. 아니면 윤서진 씨를 부릅니다. 대학원생한테 아버지 얘기 시키는 거, 저도 싫습니다. 근데 저는 싫은 일 하라고 월급 받는 사람이에요.' 전화를 끊기 전에 그가 덧붙입니다. '아, 제가 방금 무례했죠. 그것도 적어 두겠습니다.'", ["기한: 7월 6일 오전 10시", "나은호: 기한을 넘기면 윤서진을 직접 부름", "수첩의 존재는 가사도우미 진술로 이미 알려짐"], ["윤서진이 불려 가지 않게 먼저 나서서 막는다", "제출 절차와 윤서진의 권리를 문서로 확인받는다", "모레까지 기다리지 말고 오늘 수첩을 넘기자고 한다"]],
  ],
  connectiveOrder: [["c34_study", "c34_margin"], ["c34_sketch", "c34_pear"], ["c34_seminar", "c34_hallway"]],
  choiceEffects: {
    c34_study: [
      { trust: 10, humanCost: -5, time: -4, capital: -1, fatigue: 4 },
      { legitimacy: 9, trust: 3, capital: -5, time: -6, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 4, trust: 2, legitimacy: -4, humanCost: 4, fatigue: -3 },
    ],
    c34_sketch: [
      { trust: 11, humanCost: -4, legitimacy: -3, time: -3, fatigue: 5 },
      { legitimacy: 9, trust: -2, time: -5, humanCost: 3, fatigue: 3 },
      { time: 4, capital: 3, trust: 3, legitimacy: -3, humanCost: 3, fatigue: -4 },
    ],
    c34_seminar: [
      { trust: 11, humanCost: -5, legitimacy: 1, capital: -3, time: -5, fatigue: 5 },
      { legitimacy: 10, trust: 2, time: -6, humanCost: 3, fatigue: 3 },
      { time: 6, capital: 4, legitimacy: 3, trust: -6, humanCost: 4, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c34_study: {
      voice: ["빨간 줄 스물세 개는 가족의 몫이라며, 가려 준다.", "잉크 색까지 필적 감정을 맡겨, 쓴 시기를 가린다.", "검은 줄만 골라, 오늘 안에 요약본을 만든다."],
      echo: ["가려 주면 윤서진은 수첩을 조금 더 편하게 폅니다. 가려진 줄 중 하나가 나중에 날짜를 증명할 유일한 줄일 수도 있습니다.", "감정 결과는 2주 뒤에 나옵니다. 그 2주 동안 수첩은 윤서진의 손을 떠나 있습니다.", "요약본은 깔끔합니다. '중간고사 — 전화하지 말 것'이 빠진 수첩은 한 사람의 업무 일지처럼 읽힙니다."],
    },
    c34_sketch: {
      voice: ["그 말은 진심이었을 거라고, 윤서진 편에서 말해 준다.", "그 말을 한 날짜를, 수첩의 날짜와 맞춰 본다.", "아버지 얘기는 접고, 내일 발표 준비부터 돕는다."],
      echo: ["편을 들어 주면 윤서진이 고개를 끄덕입니다. 그리고 한참 뒤에 묻습니다. '그럼 진심인 사람이 왜 그렇게 썼어요?'", "날짜를 맞추면 면접은 '보관 X'보다 넉 달 뒤입니다. 그 말은 반대 의견을 지운 다음에 나온 말입니다.", "발표 자료는 새벽 두 시에 끝납니다. 배 이야기는 다시 꺼내지지 않습니다."],
    },
    c34_seminar: {
      voice: ["윤서진이 불려 가지 않게, 먼저 나서서 막는다.", "제출 절차와 윤서진의 권리를, 문서로 확인받는다.", "모레까지 기다리지 말고, 오늘 수첩을 넘기자고 한다."],
      echo: ["막아서면 나은호가 손가락을 하나 폅니다. '그럼 당신이 가져오시든가요.' 무게가 당신 쪽으로 옮겨 옵니다.", "확인서는 기한 당일 아침에야 옵니다. 그사이 윤서진은 주말 내내 휴대폰을 뒤집어 놓습니다.", "오늘 넘기면 기한 걱정은 사라집니다. 윤서진이 아버지와 마주 앉을 저녁도 함께 사라집니다."],
    },
  },
  reactionScenes: [
    ["c34_margin_reaction", "c34_margin", "c34_sketch", "별 다섯, 스티커 영 개", "반재욱", "반서아가 학교에서 돌아와 영상통화를 겁니다. 수첩 사진을 보여 달라고 조르더니 평을 내립니다. '글씨는 별 다섯. 스티커는 영 개. 이 아저씨 딸은 아빠 수첩에 아무것도 못 붙였나 봐.' 반재욱이 웃다가 사진 한 장을 다시 확대합니다. 표지 안쪽에 네모난 끈적이 자국이 여섯 개 있습니다. 누군가 스티커를 붙였다가, 누군가 조심스럽게 떼어 낸 자국입니다. '서아야, 이건 별 몇 개 줄래?' 반서아가 한참 보다가 말합니다. '이건 별 말고 반창고 줘야 돼.'", ["스티커 자국이 무슨 뜻인지 윤서진에게 직접 전한다", "표지 자국은 수첩이 손을 탄 흔적으로 기록해 둔다", "자국은 사건과 상관없다며 넘어간다"]],
    ["c34_pear_reaction", "c34_pear", "c34_seminar", "누나 성이 뭐예요", "문하준", "골목 끝에서 문하준이 뛰어 돌아옵니다. 스케치북을 두고 갔다고 합니다. 그가 스케치북을 집어 들다가 윤서진을 봅니다. '누나 성이 윤씨인 거 알아요. 아까 이름 검색하니까 학회 사진이 나왔어요.' 윤서진이 굳습니다. 문하준이 스케치북에서 '돋보기 든 윤서진' 장을 뜯어 내밉니다. '누나 아빠가 한 거지 누나가 한 거 아니잖아요. 우리 엄마는 다르게 생각할 수도 있어요. 근데 저는 그래요.' 그가 한마디 보탭니다. '그리고 산타 얘기, 아직 안 끝났어요.'", ["두 사람이 다음 주에도 만나 자기소개서를 고치게 한다", "오늘 일을 문가을에게 먼저 알리고 뜻을 묻는다", "고마운 말이지만 사건이 끝난 뒤로 미루자고 한다"]],
    ["c34_hallway_reaction", "c34_hallway", "c34_final", "받는 사람 이름만", "백아린", "그날 저녁 윤서진에게 등기 봉투가 옵니다. 그룹 법무팀이 보낸 내용증명(보낸 날짜와 내용을 우체국이 증명해 주는 편지)입니다. 수첩은 그룹의 영업비밀(회사가 비밀로 지키는 경영 정보)이 담긴 문서이니 사흘 안에 돌려주지 않으면 법적 절차를 밟겠다는 내용입니다. 사진을 받은 백아린이 곧장 전화를 겁니다. '제가 지난주에 받은 거랑 문장이 똑같아요. 쉼표 자리까지요. 받는 사람 이름만 바뀌었어요.' 그가 잠깐 숨을 고릅니다. '이번엔 대학원생이네요. 그 사람들은 상대가 누군지 안 봐요. 문장만 봐요.'", ["백아린이 윤서진을 만나 겪은 일을 직접 들려주게 한다", "두 봉투의 문장을 나란히 놓고 같은 작성자를 밝힌다", "봉투는 무시하고 수첩 일정대로 간다"]],
  ],
  reactionEffects: {
    c34_margin: [
      { trust: 8, humanCost: -4, time: -3, fatigue: 3 },
      { legitimacy: 7, trust: 2, capital: -3, time: -3, fatigue: 2 },
      { time: 4, capital: 2, trust: 1, humanCost: 2, fatigue: -3 },
    ],
    c34_pear: [
      { trust: 10, humanCost: -3, time: -4, capital: -1, fatigue: 3 },
      { legitimacy: 6, trust: 4, time: -3, humanCost: 2, fatigue: 2 },
      { time: 4, capital: 3, trust: 1, humanCost: 3, fatigue: -2 },
    ],
    c34_hallway: [
      { trust: 9, humanCost: -4, legitimacy: 1, time: -3, capital: -2, fatigue: 4 },
      { legitimacy: 8, trust: 1, time: -4, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 2, trust: 1, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c34_margin: {
      voice: ["스티커 자국이 무슨 뜻인지, 윤서진에게 직접 전한다.", "표지 자국은 수첩이 손을 탄 흔적으로, 기록해 둔다.", "자국은 사건과 상관없다며, 넘어간다."],
      echo: ["전해 들은 윤서진이 오래 말이 없습니다. 그리고 말합니다. '제가 붙였어요. 여섯 살 때요. 뗀 건 제가 아니에요.'", "기록은 정확합니다. '표지 안쪽 접착 흔적 6개.' 누가 왜 뗐는지는 그 칸에 들어가지 않습니다.", "넘어가면 반서아가 입을 삐죽입니다. '아빠는 별 두 개.'"],
    },
    c34_pear: {
      voice: ["두 사람이 다음 주에도 만나, 자기소개서를 고치게 한다.", "오늘 일을 문가을에게 먼저 알리고, 뜻을 묻는다.", "고마운 말이지만, 사건이 끝난 뒤로 미루자고 한다."],
      echo: ["다음 주 약속이 잡힙니다. 문하준의 자기소개서 제목이 '끝까지 보고 대출해 주는 은행원'으로 바뀝니다. 산타 논쟁은 무승부입니다.", "문가을은 전화를 받고 한참 떡만 썹니다. 그리고 말합니다. '하준이가 그렇다면 그런 거예요. 나는 아직 몰라요.'", "미루자는 말에 문하준이 고개를 끄덕입니다. 뜯어 준 그림은 윤서진의 가방 안에서 접힌 채 주말을 보냅니다."],
    },
    c34_hallway: {
      voice: ["백아린이 윤서진을 만나, 겪은 일을 직접 들려주게 한다.", "두 봉투의 문장을 나란히 놓고, 같은 작성자를 밝힌다.", "봉투는 무시하고, 수첩 일정대로 간다."],
      echo: ["백아린과 윤서진이 헌책방 계단참에 나란히 앉습니다. 윤서진은 처음으로 무서운 게 이상한 일이 아니라는 말을 듣습니다.", "나란히 놓으면 두 봉투의 문서 번호가 한 자리만 다릅니다. 같은 사람이 같은 주에 쓴 봉투입니다.", "무시하면 사흘은 조용히 지나갑니다. 윤서진은 등기 우편 알림이 올 때마다 숨을 멈춥니다."],
    },
  },
  reactionMemos: {
    c34_margin_reaction: ["표지 안쪽 스티커 자국 여섯 개", "별 대신 반창고"],
    c34_pear_reaction: ["이미 알고 있던 성", "산타 논쟁은 아직 진행 중"],
    c34_hallway_reaction: ["쉼표 자리까지 같은 두 봉투", "받는 사람 이름만 바뀐 문장"],
  },
  branchPlan: ["c34_study", 0, "c34_branch_study", "c34_branch_study_follow"],
  branchScenes: {
    // CASE 34's detour is the room the notebook came from. The case argues over
    // one line; the side door is the shelf it was taken off, where a man who
    // wrote "do not keep" has kept everything else.
    c34_branch_study: {
      phase: "SIDE DOOR",
      title: "아버지의 서재",
      speaker: "윤서진",
      text: "같이 읽기로 하자 윤서진이 수첩을 덮습니다. '앞뒤가 비어요. 2022년 수첩이랑 2024년 수첩이 서재에 있어요. 아버지는 오늘 저녁 약속이 있어서 늦게 들어오세요.' 그날 저녁, 평창동 집 2층 서재. 벽 한 면이 책장이고, 한 칸에 검은 수첩 열다섯 권이 연도 순서로 꽂혀 있습니다. 2023년 자리만 비어 있습니다. 윤서진이 맨 아래 칸을 가리킵니다. 초등학생 때 그린 그림, 중학교 상장, 대학 합격 문자를 인쇄한 종이가 투명 파일에 한 장씩 끼워져 있습니다. '보관 X라고 쓰는 사람이, 이런 건 한 장도 못 버려요.'",
      memo: ["검은 수첩 15권 -- 2011년부터, 2023년 자리만 빔", "맨 아래 칸: 윤서진의 그림·상장·합격 문자 출력본", "윤상혁 귀가 예정: 저녁 약속 뒤 23시 이후", "윤서진의 허락으로 들어온 방 -- 영장 없음"],
      triggers: ["curiosity", "affection", "order"],
      choices: [
        { id: "c34_branch_study_a", label: "윤서진이 고른 두 권만 꺼내 앞뒤를 함께 읽는다", effect: { trust: 11, legitimacy: 4, time: -5, capital: -2, fatigue: 5 }, next: "c34_branch_study_follow", cognition: { reframing: 2 } },
        { id: "c34_branch_study_b", label: "열다섯 권 전부의 목록과 위치부터 기록한다", effect: { legitimacy: 10, trust: -2, time: -6, humanCost: 3, fatigue: 4 }, next: "c34_branch_study_follow", cognition: { inference: 2 } },
        { id: "c34_branch_study_c", label: "서재 안에서는 아무것도 만지지 않고 나온다", effect: { time: 5, capital: 4, legitimacy: 2, trust: -5, humanCost: 2, fatigue: -3 }, next: "c34_branch_study_follow", cognition: { risk: 1 } },
      ],
    },
    c34_branch_study_follow: {
      phase: "SIDE DOOR",
      title: "현관의 불빛",
      speaker: "윤상혁",
      text: "2024년 수첩의 첫 장을 펴는 순간 현관 센서등이 켜집니다. 약속이 있다던 윤상혁이 일찍 왔습니다. 계단 아래에서 비닐봉지 소리와 함께 목소리가 올라옵니다. '서진아, 복숭아 사 왔다. 씻어 놓을 테니 내려와서 먹어라.' 회사에서 한 번도 들어 본 적 없는, 느리고 둥근 목소리입니다. 윤서진이 얼굴이 하얘진 채 수첩을 쥡니다. 2024년 첫 장에는 한 줄뿐입니다. '작년 일은 작년 수첩에.' 서재 창밖은 정원이고, 계단은 하나뿐입니다.",
      memo: ["윤상혁 귀가 21시 -- 평소보다 두 시간 빠름", "2024년 수첩 첫 장: '작년 일은 작년 수첩에'", "서재에서 나가는 길: 계단 하나, 정원 쪽 창문 하나", "1층 부엌에서 복숭아 씻는 물소리"],
      triggers: ["fear", "affection", "choice"],
      choices: [
        { id: "c34_branch_study_follow_a", label: "윤서진 곁에 남아 같이 계단을 내려가 인사한다", effect: { trust: 12, humanCost: -4, legitimacy: -3, time: -4, fatigue: 7 }, next: "c34_margin", cognition: { persistence: 2 } },
        { id: "c34_branch_study_follow_b", label: "2024년 첫 장을 찍어 두고 수첩을 제자리에 꽂는다", effect: { legitimacy: 11, trust: -3, humanCost: 3, time: -3, fatigue: 5 }, next: "c34_margin", cognition: { inference: 2 } },
        { id: "c34_branch_study_follow_c", label: "윤서진에게 맡기고 정원 쪽 창문으로 빠져나간다", effect: { time: 5, capital: 3, trust: -6, humanCost: 4, fatigue: -4 }, next: "c34_margin", cognition: { risk: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c34_start",
    result: "c34_aftershock",
    defaultFree: "c34_route_system",
    // One notebook, one line. Like the cases before it this is a single line;
    // the split is who carries the notebook out of the family and how.
    choices: {},
    system: {
      route: "c34_route_system",
      final: "c34_final_system_route",
      title: "보관되지 않은 반대 의견들",
      speaker: "이민서",
      text: "준비된 보기 밖의 문장을 쓰자 이민서가 KD데이터랩 계정으로 그룹의 문서 관리 기록을 엽니다. 지난 10년 동안 심사 보고서에 붙은 반대 의견은 214건입니다. 그중 보존연한(기록을 몇 년 보관하고 버릴지 정해 둔 기간)이 '0년'으로 바뀐 것이 61건이고, 61건 모두 바뀐 날짜가 대출이 나가기 전 사흘 안입니다. 바꾼 사람 칸은 전부 시스템 계정입니다. 이민서가 화면을 돌립니다. '수첩에 적힌 건 한 줄인데, 전산에는 예순한 줄이에요. 사람 이름이 붙은 건 그 수첩 한 줄뿐이고요.'",
      memo: ["반대 의견 214건 중 보존연한 '0년' 변경 61건", "61건 모두 대출 실행 전 72시간 안에 변경", "변경자: 전부 시스템 계정 -- 사람 이름 0개"],
      routeChoices: [
        ["c34_route_system_publish", "예순한 건의 목록을 검사실과 금융감독원에 함께 넘긴다", { legitimacy: 12, trust: 4, capital: -5, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c34_route_system_owners", "반대 의견을 썼던 예순한 명부터 찾아 알린다", { trust: 11, humanCost: -4, legitimacy: 4, time: -8, capital: -3, fatigue: 6 }, { reframing: 2 }],
        ["c34_route_system_hold", "목록은 두고 수첩 한 줄에만 집중한다", { time: 7, capital: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "반대 의견은 대출이 끝날 때까지 지울 수 없게 규정을 바꾼다", { legitimacy: 12, trust: 7, capital: -7, humanCost: -4, fatigue: 6 }, { reframing: 3 }],
      ["b", "수첩 한 줄로 윤상혁 한 사람만 겨눈다", { capital: 9, time: 6, trust: -4, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "반대 의견을 쓴 사람이 자기 사본을 가질 권리를 만든다", { legitimacy: 9, trust: 8, capital: -6, time: -6, humanCost: 2, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c34_evidence_turn",
    result: "c34_aftershock",
    sourceRoutes: ["c34_study", "c34_sketch", "c34_seminar", "c34_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 수첩의 그 한 줄 옆에 놓고, 반대 의견이 전산에서 언제 어떻게 지워졌는지 맞춰 본다.",
    entryEcho: "단서를 대면 한 줄의 날짜가 전산의 날짜가 됩니다. 그리고 그 날짜에 누가 무엇을 한 장 뽑아 갔는지도 보입니다.",
    title: "한 장만 뽑아 간 사람",
    speaker: "반재욱",
    text: "단서를 맞추자 2023-0412 심사 보고서의 문서 관리 기록이 열립니다. 반대 의견 1건의 보존연한(기록을 몇 년 보관하고 버릴지 정해 둔 기간)이 '10년'에서 '0년'으로 바뀐 날은 수첩의 그 줄과 같은 날입니다. 변경 신청은 당시 기업금융전략팀 공용 계정, 승인자 칸은 비어 있습니다. 그런데 지워지기 40분 전에 그 반대 의견을 출력한 기록이 하나 남아 있습니다. 출력한 곳은 33층 그룹전략실 프린터, 매수는 1장입니다. 반재욱이 새 수첩을 덮습니다. '보관하지 말라고 써 놓고, 자기는 한 장 뽑아 갔네요.'",
    memo: ["보존연한 변경일 = 수첩 '보관 X' 날짜", "변경 신청: 기업금융전략팀 공용 계정, 승인자 칸 빈칸", "삭제 40분 전 33층 프린터 출력 1장"],
    triggers: ["injustice", "curiosity", "system"],
    entryEffect: { legitimacy: 5, trust: 3, time: -5, capital: -3, fatigue: 5 },
    choices: [
      ["c34_evidence_turn_print", "33층에서 뽑아 간 그 한 장을 찾아 달라고 검사실에 요청한다", { legitimacy: 13, trust: 3, capital: -6, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c34_evidence_turn_quiet", "기록은 쥐고 있다가 윤상혁과 마주 앉는 날 꺼낸다", { capital: 7, time: 5, trust: -5, legitimacy: -4, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c34_evidence_turn_daughter", "윤서진에게 먼저 이 기록을 보여 주고 함께 판단한다", { trust: 12, legitimacy: 6, capital: -6, humanCost: -6, time: -4, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c34_branch_study",
    systemNext: "c34_route_system",
    evidenceNext: "c34_evidence_turn",
    routeLabel: "직전 사건에서 백아린 곁을 지킨 방식대로 윤서진과 서재 문을 연다",
    systemLabel: "직전 자유응답 문장이 그룹 문서 관리 기록에도 남았는지 본다",
    evidenceLabel: "직전 단서를 붙여 반대 의견이 지워진 날의 전산 기록을 연다",
  },
  openingRoutes: {
    c33_after_warm: "c34_start_warm",
    c33_after_record: "c34_start_record",
    c33_after_rush: "c34_start_rush",
  },
  openingCopy: {
    c34_start_warm: ["바짓단을 재는 저녁", "백아린", "윤경수선 2층에서 백아린의 상자 스물세 개를 다 푼 건 자정이 넘어서였습니다. 공익신고(회사의 불법을 공공기관에 알리는 일)를 한 대가로 사택에서 나온 사람의 짐이었습니다. 그 밤 온 윤서진의 문자는 아침까지 기다렸고, 아침에 답하자 저녁에 사진 한 장이 옵니다. 검은 가죽 수첩의 한 쪽, 만년필 글씨로 '0412 — 반대 의견 — 보관 X'. 허윤경이 당신 바짓단을 재다 말고 화면을 흘끗 봅니다. 백아린이 먼저 알아봅니다. '서진 씨요? 상무님 책상 액자 속 그 아이예요. 졸업식 날 해바라기 들고 찍은 사진이요.'", ["윤경수선 2층 상자 23개 -- 자정 넘어 다 풂", "윤서진의 두 번째 문자와 수첩 사진 한 장", "백아린: 윤상혁 책상 액자 속 딸의 얼굴을 기억함"]],
    c34_start_record: ["다음 사람의 문서", "반재욱", "도어락이 바뀐 시각에서 시작해 고소장이 만들어진 날로 끝나는 한 주의 기록을, 밤새 정리해 오늘 접수했습니다. 공익신고(회사의 불법을 공공기관에 알리는 일)를 한 사람이 무엇을 겪는지 다음 사람이 읽을 첫 문서입니다. 헌책방 1층으로 돌아오자 어젯밤 문자를 보냈던 번호에서 사진 한 장이 와 있습니다. '윤서진입니다. 아버지를 지키고 싶어서 보내 드려요.' 검은 가죽 수첩의 한 쪽, '0412 — 반대 의견 — 보관 X'. 반재욱이 방금 접수한 기록 사본을 내려다봅니다. '다음 사람이 이렇게 빨리 올 줄은 몰랐네요.'", ["백아린의 한 주 기록 -- 오늘 접수", "윤서진의 두 번째 문자와 수첩 사진 한 장", "반재욱: 기록 양식을 한 부 더 출력해 둠"]],
    c34_start_rush: ["자정의 카페", "이민서", "상자 테이프를 뜯다 말고 일어선 지 한 시간 뒤, 신촌역 앞 24시간 카페에 윤서진이 앉아 있었습니다. 수첩은 가져오지 않았고, 휴대폰 사진 한 장만 보여 줬습니다. 만년필 글씨로 '0412 — 반대 의견 — 보관 X'. '아버지를 지키고 싶어서 연락드렸어요. 원본은 제 연구실에서만 보여 드릴게요.' 다음 날 아침, 헌책방 1층에 온 이민서가 얘기를 듣고 눈을 크게 뜹니다. '밤에 혼자 나갔다고요? 확인도 안 하고요? 윤상혁 대표 딸이 당신 번호는 어떻게 알았대요?'", ["자정 카페 면담 40분 -- 사진 한 장만 봄", "윤서진의 조건: 원본은 연구실에서만", "이민서: 번호를 어떻게 알았는지부터 확인하자고 함"]],
  },
  openingSignatures: {
    c34_start_warm: {
      label: "백아린에게 윤서진이 어떤 사람인지 먼저 묻는다",
      effect: { trust: 10, legitimacy: 3, humanCost: -3, time: -4, capital: -3, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "백아린에게, 윤서진이 어떤 사람인지 먼저 묻는다.",
      echo: "백아린은 허윤경이 바짓단을 다 잴 때까지, 사진 한 장으로 기억하는 아이 이야기를 합니다. 해바라기를 든 졸업식 사진, 그리고 그 사진을 볼 때만 서류철을 늦게 덮던 상사.",
    },
    c34_start_record: {
      label: "윤서진도 신고자로 보호받을 수 있는지 요건부터 알아본다",
      effect: { legitimacy: 11, trust: 3, time: -6, capital: -2, humanCost: 1, fatigue: 3 },
      cognition: { inference: 2 },
      voice: "윤서진도 신고자로 보호받을 수 있는지, 요건부터 알아본다.",
      echo: "요건을 읽어 보면 가족이 가족의 기록을 낸 경우를 정한 조항은 없습니다. 빈칸은 윤서진에게 유리할 수도, 불리할 수도 있습니다.",
    },
    c34_start_rush: {
      label: "다음 약속부터는 건너편에 동료 한 명을 앉혀 둔다",
      effect: { trust: 5, legitimacy: 4, capital: 3, time: -3, humanCost: 2, fatigue: 2 },
      cognition: { risk: 2 },
      voice: "다음 약속부터는, 건너편에 동료 한 명을 앉혀 둔다.",
      echo: "강태민이 연구동 1층 로비 소파에 앉습니다. 두 시간 동안 자판기 커피 네 잔을 마시고, 윤서진은 그가 누구인지 첫 5분 만에 알아챕니다.",
    },
  },
  voiceLines: {
    // CASE 34. Every line is said to, or about, someone's daughter. None of them
    // is allowed to sound like it is using her.
    c34_start_meet: "그가 원한 방식이라며, 혼자 직접 만나러 간다.",
    c34_start_verify: "만나기 전에, 필체와 날짜부터 기록과 대조한다.",
    c34_start_scan: "수첩 전체를 먼저 찍어서, 보내 달라고 답장한다.",
    c34_study_together: "가리지 말고, 처음부터 끝까지 같이 읽자고 한다.",
    c34_study_copy: "윤서진의 동의를 받아, 모든 쪽을 사본으로 남긴다.",
    c34_study_page: "필요한 쪽만 찍고, 가린 줄은 보지 않은 걸로 한다.",
    c34_branch_study_a: "윤서진이 고른 두 권만 꺼내, 앞뒤를 함께 읽는다.",
    c34_branch_study_b: "열다섯 권 전부의 목록과 위치부터, 기록한다.",
    c34_branch_study_c: "서재 안에서는, 아무것도 만지지 않고 나온다.",
    c34_branch_study_follow_a: "윤서진 곁에 남아, 같이 계단을 내려가 인사한다.",
    c34_branch_study_follow_b: "2024년 첫 장을 찍어 두고, 수첩을 제자리에 꽂는다.",
    c34_branch_study_follow_c: "윤서진에게 맡기고, 정원 쪽 창문으로 빠져나간다.",
    c34_sketch_wait: "윤서진이 스스로 말할 때까지, 곁에서 기다린다.",
    c34_sketch_mother: "문가을에게 먼저 알리고, 둘이 만나도 되는지 묻는다.",
    c34_sketch_part: "오늘은 수첩 얘기만 하자며, 둘을 떼어 놓는다.",
    c34_seminar_honor: "오늘은 그 부탁을 받아들이고, 윤서진의 날로 둔다.",
    c34_seminar_ask: "딸이 없는 복도에서, '보관 X'를 쓴 이유를 묻는다.",
    c34_seminar_bargain: "부탁을 들어줄 테니, 검찰에 스스로 나가라고 조건을 건다.",
    c34_final_father: "내기 전에 윤서진이 아버지에게 직접 묻고 오도록, 하루를 번다.",
    c34_final_submit: "윤서진이 직접 수첩을 내고, 신변 보호를 함께 신청한다.",
    c34_final_copy: "원본은 윤서진에게 두고, 사본만 내가 검찰에 넘긴다.",
    c34_after_warm: "오늘은 연구실 불이 꺼질 때까지, 사본을 끝까지 같이 읽는다.",
    c34_after_record: "수첩의 그 한 줄과 나온 경위를, 공식 기록으로 남긴다.",
    c34_after_rush: "사본을 쥐고 곧장, 33층 프린터 기록을 쫓으러 간다.",
    c34_route_system_publish: "예순한 건의 목록을, 검사실과 금융감독원에 함께 넘긴다.",
    c34_route_system_owners: "반대 의견을 썼던 예순한 명부터, 찾아 알린다.",
    c34_route_system_hold: "목록은 두고, 수첩 한 줄에만 집중한다.",
    c34_final_system_route_a: "반대 의견은 대출이 끝날 때까지, 지울 수 없게 규정을 바꾼다.",
    c34_final_system_route_b: "수첩 한 줄로, 윤상혁 한 사람만 겨눈다.",
    c34_final_system_route_c: "반대 의견을 쓴 사람이, 자기 사본을 가질 권리를 만든다.",
    c34_evidence_turn_print: "33층에서 뽑아 간 그 한 장을, 찾아 달라고 검사실에 요청한다.",
    c34_evidence_turn_quiet: "기록은 쥐고 있다가, 윤상혁과 마주 앉는 날 꺼낸다.",
    c34_evidence_turn_daughter: "윤서진에게 먼저 이 기록을 보여 주고, 함께 판단한다.",
  },
  echoReplies: {
    // CASE 34.
    c34_start_meet: "혼자 가면 윤서진은 경계를 한 겹 내려놓습니다. 동료들은 그 두 시간 동안 헌책방에서 휴대폰만 봅니다.",
    c34_start_verify: "대조하면 필체는 맞고 날짜도 맞습니다. 그 사이 윤서진은 답장이 없는 휴대폰을 사흘째 들여다봅니다.",
    c34_start_scan: "답장을 받은 윤서진이 한 시간 뒤에 짧게 씁니다. '직접 뵙고 싶다고 했는데요.' 사진은 오지 않습니다.",
    c34_study_together: "처음부터 읽으면 수첩은 한 사람의 1년이 됩니다. 등록금 줄에서 윤서진이 손을 떼기까지 20분이 걸립니다.",
    c34_study_copy: "사본은 정확합니다. 복사기 소리가 날 때마다 윤서진이 창밖을 봅니다.",
    c34_study_page: "필요한 쪽은 손에 들어옵니다. 가린 줄은 가려진 채로, 윤서진 혼자의 몫으로 남습니다.",
    c34_branch_study_a: "두 권을 앞뒤로 놓으면 2023년만 글씨가 작아집니다. 그해 그는 한 칸에 더 많은 말을 적었습니다.",
    c34_branch_study_b: "목록은 완벽합니다. 윤서진은 당신이 자기 집 책장을 증거 목록처럼 적는 걸 말없이 봅니다.",
    c34_branch_study_c: "아무것도 만지지 않으면 서재는 그대로입니다. 2023년 자리의 빈칸도 그대로입니다.",
    c34_branch_study_follow_a: "계단을 내려가면 윤상혁이 복숭아를 씻다 말고 당신을 봅니다. 그가 접시를 하나 더 꺼냅니다. 아무것도 묻지 않습니다.",
    c34_branch_study_follow_b: "사진은 남습니다. 수첩을 꽂는 손이 떨려 2024년이 2022년 자리에 들어갑니다. 다음 날 아침 누군가 그걸 바로 꽂아 둡니다.",
    c34_branch_study_follow_c: "창문으로 나가면 정원 수국 화단에 신발 자국이 남습니다. 다음 날 윤서진이 문자로 씁니다. '아버지가 고라니가 왔다고 하세요.'",
    c34_sketch_wait: "기다리면 윤서진이 자정 무렵 스스로 말합니다. 문하준은 그때 이미 집에 가고 없습니다.",
    c34_sketch_mother: "문가을은 한참 말이 없다가 말합니다. '애들끼리 그림 그리는 걸 내가 왜 막아요.' 목소리가 조금 떨립니다.",
    c34_sketch_part: "떼어 놓으면 산타 논쟁은 중간에 끊깁니다. 문하준은 스케치북을 두고 나갑니다. 일부러인지는 모릅니다.",
    c34_seminar_honor: "부탁을 받아들이면 윤상혁이 고개를 한 번 숙입니다. 회사에서는 본 적 없는 각도입니다. 그 빚은 어디에도 적히지 않습니다.",
    c34_seminar_ask: "묻자 윤상혁이 해바라기를 다른 손으로 옮깁니다. '그 줄은 내가 쓴 게 맞네. 이유는 자네가 생각하는 것보다 단순해.' 그 이상은 말하지 않습니다.",
    c34_seminar_bargain: "조건을 걸자 윤상혁이 처음으로 웃습니다. '자네도 이제 자리를 거래하는군.' 그 웃음이 대답인지는 알 수 없습니다.",
    c34_final_father: "하루를 벌면 윤서진은 아버지 방 앞에 섭니다. 무엇을 물었는지, 무슨 대답을 들었는지는 그의 몫으로 남습니다. 나은호는 손가락 하나를 더 폅니다.",
    c34_final_submit: "직접 내면 조서의 제출인 칸에 윤서진의 이름이 적힙니다. 아버지의 이름 바로 위입니다. 그는 그 칸을 오래 봅니다.",
    c34_final_copy: "사본만 넘기면 윤서진은 불려 가지 않습니다. 대신 원본을 어디에 둘지는 그 혼자 정해야 합니다. 그룹 법무팀의 봉투는 계속 옵니다.",
    c34_after_warm: "마지막 쪽을 덮은 건 자정 무렵입니다. 윤서진이 '혼자 읽었으면 중간에 덮었을 거예요'라고 말합니다. 마지막 복숭아는 문하준이 먹습니다.",
    c34_after_record: "기록은 두 쪽입니다. 윤서진이 마지막 줄에 이름을 쓰고, 그 옆 칸이 비지 않도록 당신도 씁니다.",
    c34_after_rush: "당신이 나간 뒤 연구실에는 깎다 만 복숭아가 남습니다. 윤서진은 사본의 남은 쪽을 혼자 넘깁니다. 문하준이 그 옆에 조용히 앉습니다.",
    c34_route_system_publish: "목록이 넘어가면 두 기관이 같은 날 같은 질문을 그룹에 보냅니다. 시스템 계정 뒤에 누가 있었느냐는 질문입니다.",
    c34_route_system_owners: "예순한 명 중 절반은 자기 반대 의견이 지워진 걸 몰랐습니다. 한 사람은 전화를 받고 오래 웃다가 웁니다.",
    c34_route_system_hold: "한 줄에 집중하면 이야기는 선명해집니다. 나머지 예순 줄은 시스템 계정의 이름으로 계속 남습니다.",
    c34_final_system_route_a: "규정이 바뀌면 다음 반대 의견은 대출과 같은 날까지 삽니다. 규정을 누가 지키는지는 다음 문제입니다.",
    c34_final_system_route_b: "한 사람을 겨누면 수첩은 강력한 증거가 됩니다. 예순한 건을 지운 시스템은 그대로 다음 대출을 기다립니다.",
    c34_final_system_route_c: "자기 사본을 가질 권리가 생기면 반대한 사람은 더 이상 회사의 선의에 기대지 않습니다. 회사는 그 조항을 오래 반대합니다.",
    c34_evidence_turn_print: "요청이 받아들여지면 수사관들이 33층 문서 파쇄함 기록부터 엽니다. 그 한 장이 아직 있는지는 아무도 모릅니다.",
    c34_evidence_turn_quiet: "쥐고 있으면 그날까지 아무도 모릅니다. 윤서진도 모릅니다. 그녀가 가장 먼저 알았어야 할 사람일 수도 있습니다.",
    c34_evidence_turn_daughter: "보여 주면 윤서진이 '40분'이라는 숫자를 세 번 읽습니다. '지우기 전에 한 장은 남겼네요. 그건 아버지다운 일이에요.'",
  },
  characterProfiles: {
    윤서진: {
      role: "윤상혁의 딸 · 금융윤리 전공 석사과정 대학원생",
      stance: "사랑 · 앎 · 책임",
      job: "아버지의 수첩을 들고 온다. 아버지를 지키고 싶다는 말과, 아버지가 한 일을 안다는 말을 동시에 참으로 만들려 한다.",
      appearance: "아버지와 같은 각도로 밀어 올리는 뿔테 안경, 세 가지 색 볼펜, 스티커 하나 없는 노트북. 수첩은 늘 비닐 파일에 넣어 다닌다.",
      thought: "사랑하는 사람을 지키는 방법이 그 사람의 기록을 숨기는 거라면, 내가 배운 윤리는 다 거짓말이다.",
      gesture: "윤서진은 곤란한 질문을 받으면 정확히 3초 멈춘다. 그 3초 동안 볼펜 색을 검은색에서 빨간색으로 바꾼다.",
      voice: "논문처럼 정확하게 말하다가, 아버지 얘기가 길어지면 '아버지'가 한 번씩 '아빠'로 미끄러진다.",
      line: "저는 아버지를 지키고 싶어요. 그러려면 아버지가 한 일부터 알아야 하고요.",
    },
  },
  setting: { place: "회기동 헌책방 1층 아지트", clock: "7월 1일" },
  sceneContext: {
    c34_start: {
      place: "회기동 헌책방 1층 아지트 · 책장 앞",
      clock: "7월 1일 · 21:40",
      question: "윤상혁의 딸이 아버지를 지키고 싶다며 가장 불리한 한 줄을 보냈습니다. 어떻게 답하겠습니까?",
      lead: "어젯밤 '만나 주실 수 있을까요' 한 줄만 보냈던 번호에서, 오늘 밤 사진 한 장이 탁자 위 휴대폰을 깨웁니다.",
    },
    c34_start_warm: {
      place: "안양 중앙시장 윤경수선 · 2층 작업실",
      clock: "7월 1일 · 19:20",
      question: "백아린의 짐을 다 푼 다음 날, 윤상혁의 딸이 수첩 사진을 보냈습니다. 누구에게 무엇부터 묻겠습니까?",
      lead: "상자를 다 푼 다음 날 저녁, 허윤경이 동료들 바짓단을 한 벌씩 재는 2층에 다시 모였습니다.",
    },
    c34_start_record: {
      place: "회기동 헌책방 1층 아지트 · 책장 앞",
      clock: "7월 1일 · 22:10",
      question: "다음 신고자를 위한 기록을 접수한 날, 또 한 사람이 위험한 기록을 들고 왔습니다. 무엇부터 확인하겠습니까?",
      lead: "백아린의 한 주를 적은 기록 사본을 들고 헌책방으로 돌아온 밤입니다.",
    },
    c34_start_rush: {
      place: "회기동 헌책방 1층 아지트 · 책장 앞",
      clock: "7월 1일 · 09:10",
      question: "확인도 없이 윤상혁의 딸을 밤에 혼자 만났습니다. 다음 만남을 어떻게 준비하겠습니까?",
      lead: "자정의 카페에서 돌아온 다음 날 아침, 헌책방 1층의 공기가 차갑습니다.",
    },
    c34_study: {
      place: "신촌 대학원 연구동 · 서고 옆 공동 연구실",
      clock: "7월 2일 · 15:20",
      question: "윤서진이 수첩의 등록금 줄을 손끝으로 가립니다. 그 줄까지 읽어야 합니까?",
      lead: "약속한 연구실 문에는 '조용히'라는 쪽지가 붙어 있고, 맨 끝 칸에서 누군가 이미 수첩을 꺼내 놓고 기다립니다.",
    },
    c34_branch_study: {
      place: "평창동 윤상혁의 집 · 2층 서재 책장",
      clock: "7월 2일 · 20:10",
      question: "보관 X라고 쓴 사람의 책장에는 딸의 모든 것이 보관되어 있습니다. 이 방에서 무엇을 하겠습니까?",
    },
    c34_branch_study_follow: {
      place: "평창동 윤상혁의 집 · 2층 서재 책장",
      clock: "7월 2일 · 21:02",
      question: "윤상혁이 예정보다 일찍 돌아와 딸을 부릅니다. 계단은 하나뿐입니다. 어떻게 하겠습니까?",
    },
    c34_margin: {
      place: "회기동 헌책방 1층 아지트 · 책장 앞 탁자",
      clock: "7월 3일 · 16:00",
      question: "'보관 X' 바로 아래 줄은 딸의 중간고사입니다. 빨간 잉크의 줄들을 어떻게 다루겠습니까?",
    },
    c34_margin_reaction: {
      place: "회기동 헌책방 1층 · 계단참",
      clock: "7월 3일 · 17:05",
      question: "수첩 표지 안쪽에 누군가 떼어 낸 스티커 자국이 여섯 개 있습니다. 이 흔적을 어떻게 하겠습니까?",
    },
    c34_sketch: {
      place: "회기동 헌책방 1층 아지트 · 책장 앞",
      clock: "7월 3일 · 19:30",
      question: "문하준은 옆자리 사람이 누구의 딸인지 모른 채 웃고 있습니다. 어떻게 하겠습니까?",
      lead: "수첩을 들고 온 윤서진보다 먼저, 스케치북을 편 고3 수험생이 임소율의 책상에 앉아 있습니다.",
    },
    c34_pear: {
      place: "회기동 헌책방 앞 골목 · 편의점 파라솔",
      clock: "7월 3일 · 22:15",
      question: "반대하는 사람이 있어야 판단이 선다고 가르친 아버지가 반대 의견을 지웠습니다. 윤서진에게 무엇이라 하겠습니까?",
    },
    c34_pear_reaction: {
      place: "회기동 헌책방 앞 골목",
      clock: "7월 3일 · 22:40",
      question: "문하준은 윤서진의 성을 이미 알고 있었습니다. 이 두 사람을 어떻게 하겠습니까?",
    },
    c34_seminar: {
      place: "신촌 대학원 연구동 · 지하 소강당",
      clock: "7월 4일 · 10:30",
      question: "딸의 발표를 보러 온 윤상혁이 딸 앞에서만은 수첩 얘기를 하지 말아 달라고 합니다. 어떻게 답하겠습니까?",
      lead: "발표를 응원하러 들어간 소강당 맨 뒷줄에, 넥타이를 매지 않은 낯익은 얼굴이 있습니다.",
    },
    c34_hallway: {
      place: "신촌 대학원 연구동 · 1층 복도",
      clock: "7월 4일 · 12:10",
      question: "모레 오전 10시까지 수첩이 가지 않으면 검사가 윤서진을 부릅니다. 어떻게 하겠습니까?",
    },
    c34_hallway_reaction: {
      place: "회기동 헌책방 1층 · 계단참",
      clock: "7월 4일 · 19:20",
      question: "백아린이 받은 봉투와 쉼표까지 같은 봉투가 대학원생에게 왔습니다. 어떻게 하겠습니까?",
    },
    c34_route_system: {
      place: "판교 KD데이터랩 · 데이터센터 단말",
      clock: "7월 2일 · 새벽 01:20",
      question: "지워진 반대 의견이 예순한 건인데 사람 이름은 수첩 한 줄에만 있습니다. 이 목록을 어떻게 하겠습니까?",
    },
    c34_final_system_route: {
      place: "판교 KD데이터랩 · 데이터센터 단말",
      clock: "7월 5일 · 새벽 02:00",
      question: "반대 의견이 사흘 만에 지워지는 규칙을 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c34_evidence_turn: {
      place: "KD은행 본점 · 문서 보관소 단말",
      clock: "7월 5일 · 19:00",
      question: "반대 의견을 지우기 40분 전, 33층에서 한 장이 출력됐습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c34_final: {
      place: "회기동 헌책방 1층 아지트 · 책장 앞",
      clock: "7월 5일 · 23:05 · 제출 기한 7월 6일 10시",
      question: "수첩을 내면 아버지를 고발한 딸이 되고, 안 내면 아버지 대신 불려 가는 딸이 됩니다. 함께 어떻게 정하겠습니까?",
      lead: "헌책방 셔터를 반쯤 내린 밤, 윤서진이 비닐 파일 하나를 품에 안고 계단을 내려옵니다.",
    },
    c34_aftershock: {
      place: "신촌 대학원 연구동 · 서고 옆 공동 연구실",
      clock: "7월 6일 · 저녁",
      question: "윤서진이 혼자서는 수첩을 끝까지 못 읽었다고 합니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c34-keep-x",
    title: "보관 X의 날짜",
    text: "윤상혁의 2023년 수첩에 적힌 '0412 — 반대 의견 — 보관 X'. 같은 날 전산에서 그 반대 의견의 보존 기간이 0년으로 바뀌었고, 지워지기 40분 전 33층에서 한 장이 출력됐습니다.",
  },
  outcomes: {
    c34_after_warm: { tag: "끝까지 읽은 결말", title: "연구실 불이 꺼질 때까지 사본을 끝까지 같이 읽었다", text: "수첩이 어디로 갔든, 그날 밤 윤서진은 아버지의 1년을 혼자 읽지 않았습니다. 노트북에는 별 스티커 한 장이 붙었고, 문하준의 스케치북에는 해바라기가 하나 늘었습니다." },
    c34_after_record: { tag: "한 줄을 남긴 결말", title: "'보관 X'라는 한 줄이 공식 기록이 됐다", text: "누가 언제 어디서 수첩을 찾았고 누구에게 건넸는지, 그리고 그 한 줄이 무엇이었는지 기록으로 남았습니다. 딸이 아버지의 기록을 낸 길이 소문이 아니라 문서가 됐습니다." },
    c34_after_rush: { tag: "먼저 달려간 결말", title: "깎다 만 복숭아를 두고 33층의 한 장을 쫓아갔다", text: "당신은 사본을 들고 그날 밤 곧장 다음 싸움으로 갔습니다. 연구실에 남은 윤서진은 복숭아를 혼자 마저 깎았습니다." },
  },
  carryovers: {
    c34_after_warm: { trust: 11, humanCost: -5, fatigue: -7 },
    c34_after_record: { legitimacy: 13, trust: 3, fatigue: 5 },
    c34_after_rush: { capital: 7, legitimacy: 3, trust: -7 },
  },
  continuityChallenges: {
    c33_after_warm: { id: "protect-trust", title: "마지막 상자까지 푼 사람답게 곁에 서기", text: "윤경수선 2층에서 백아린의 상자를 끝까지 풀었습니다. 이번에는 아버지의 기록을 든 딸 곁에, 같은 방식으로 서는 선택을 찾아야 보너스가 열립니다." },
    c33_after_record: { id: "use-reframe", title: "다음 사람의 문서를 한 사람 더를 위해 다시 쓰기", text: "공익신고자가 겪은 한 주를 기록했습니다. 가족의 기록을 낸 사람도 지켜지도록 그 기록의 판을 다시 짜야 합니다." },
    c33_after_rush: { id: "repair-legitimacy", title: "자정 면담의 공정함 회복하기", text: "확인 없이 밤에 혼자 만났습니다. 수첩이 어떻게 당신 손에 왔는지 누구에게나 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
