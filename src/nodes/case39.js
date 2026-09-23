/**
 * CASE 39 -- the night the story is cut to fit the advertising.
 *
 * Seven acts have argued over signatures, records and votes. This case argues
 * over twenty minutes of tape. The night before 서하린's documentary 「서명하지
 * 않은 사람들」 airs on 라온방송, three companies of the KD group pull fourteen
 * ad slots, "with no conditions", and attach a "reference note" that lists two
 * timecodes: the whole of part four -- the chairman's dinner-table offer to pin
 * everything on 윤상혁 -- and six minutes of part five on the lab's reaction
 * records sold to 핏스코어. Cut them and the film becomes the story the chairman
 * wanted: one bad man, now gone.
 *
 * The case happens in one building over fifteen hours: an edit suite, an empty
 * studio, a corridor, the roof at sunrise, the master control room at 09:40.
 * 연태준, the executive producer, cut twelve minutes eleven years ago and kept
 * the tape; 주하온 edits on energy drinks and file names ending in "진짜최종";
 * 은시온 sells the thirty-second slots and was hired on a 핏스코어 score. The
 * emotional range is deliberate: anger at a cut nobody ordered, laughter when
 * the newsroom cat 정정 walks across the keyboard and becomes the first name in
 * three years to fill the approver box of 2023-0412, grief when 문가을 sees her
 * husband move on a monitor for the first time since the funeral, and joy when
 * the interviewees watch the broadcast together. The evidence turn finds who
 * wrote the note: the chairman's office, from the copy the station sent for
 * the group's right of reply. The case ends forty minutes into the broadcast,
 * on a tip from someone who says they worked in the chairman's office.
 */
export const case39Nodes = {
  c39_start: {
    phase: "CASE 39 BRIEFING",
    title: "정확히 20분",
    speaker: "서하린",
    text:
      "첫 변론(법정에서 양쪽이 주장과 증거를 내는 절차)이 끝난 화요일 밤 9시, 상암동 라온방송 3층 편집실. 서하린이 열한 달 동안 찍은 탐사 다큐멘터리 「서명하지 않은 사람들」 90분 최종본이 모니터 네 대에 나란히 걸려 있습니다. 문이 열리고 시사제작국 책임 프로듀서 연태준이 A4 한 장을 들고 들어옵니다. KD금융그룹 계열사(같은 그룹에 속한 다른 회사) 세 곳이 내일 밤 광고 14개를 모두 빼겠다는 통보입니다. 조건은 없다고 했습니다. 다만 함께 온 '참고 의견'에 타임코드(영상의 몇 분 몇 초인지 적은 번호) 두 줄이 있습니다. 4부 전체와 5부 일부, 정확히 20분입니다. 연태준이 종이를 내려놓고 손을 주머니에 넣습니다. '자르라는 말은 아무도 안 했어. 20분이 정확히 적혀 있을 뿐이지.' 서하린이 녹음 버튼부터 확인합니다. '내일 아침 10시까지 70분으로 넘기래요. 아니면 결방(예정된 방송이 안 나가는 것)이고요.'",
    memo: [
      "광고 철회 통보: KD카드·KD생명·KD캐피탈, 14개",
      "'참고 의견'의 타임코드: 4부 전체 + 5부 6분 = 20분",
      "최종본 납품 마감: 내일 10:00",
      "방송: 내일(수요일) 22:00, 90분",
    ],
    triggers: ["injustice", "manipulation", "responsibility"],
    choices: [
      {
        id: "c39_start_call",
        label: "다큐에 나온 사람들에게 먼저 전화해 사정을 알린다",
        effect: { trust: 11, humanCost: -5, time: -6, capital: -3, fatigue: 4 },
        next: "c39_cut",
        cognition: { persistence: 2 },
      },
      {
        id: "c39_start_paper",
        label: "'참고 의견'을 누가 썼는지 문서로 받아 두자고 한다",
        effect: { legitimacy: 11, time: -5, trust: -2, humanCost: 3, fatigue: 4 },
        next: "c39_cut",
        cognition: { inference: 2 },
      },
      {
        id: "c39_start_trim",
        label: "밤을 아끼자며 자를 후보부터 바로 표시한다",
        effect: { capital: 7, time: 6, legitimacy: -4, trust: 1, humanCost: 3, fatigue: 1 },
        next: "c39_cut",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c39_cut",
      },
    ],
  },
  c39_cut: {
    phase: "THE CUT",
    title: "1초에 19만 원",
    speaker: "주하온",
    text:
      "밤 10시 반, 편집 감독 주하온이 타임라인의 20분을 빨갛게 칠합니다. 프로젝트 파일 이름은 '서명하지않은사람들_최종_진짜최종_방송용4'입니다. 빨간 구간의 14분은 4부 「식탁」입니다. 한남동 회장 식탁에서 나온 제안, 윤상혁 한 사람에게 모든 책임을 지우고 그룹은 '개혁 완료'를 선언하자는 꼬리 자르기(아랫사람 한 명에게 책임을 다 지우고 윗선은 빠지는 것)를 증언 셋과 문서 두 장으로 재구성한 대목입니다. 나머지 6분은 트리거랩 반응 기록이 채용 평가 회사 핏스코어로 팔려 간 계약서입니다. 광고 단가표를 들여다보던 권도현이 계산기를 내려놓습니다. '광고 14개에 2억 3천. 20분으로 나누면 1초에 19만 원입니다. 이 다큐에서 제일 비싼 20분이네요.' 주하온은 웃지 않습니다. '이거 빼면 남는 얘기는 하나예요. 나쁜 사람 한 명이 있었다. 끝.'",
    memo: [
      "잘릴 구간: 4부 「식탁」 14분 + 5부 '팔려 간 기록' 6분",
      "광고 14개 = 2억 3천만 원 -- 1초에 19만 원",
      "20분을 빼면 회장의 이름이 한 번도 나오지 않음",
      "분석관 인터뷰 분량: 22분",
    ],
    triggers: ["injustice", "system", "order"],
    choices: [
      {
        id: "c39_cut_mine",
        label: "4부 대신 내 인터뷰 22분부터 잘라 내자고 한다",
        effect: { trust: 10, humanCost: -4, legitimacy: -3, time: -5, fatigue: 6 },
        next: "c39_mosaic",
        cognition: { reframing: 2 },
      },
      {
        id: "c39_cut_contract",
        label: "광고 계약서에 방송 내용을 건드릴 조항이 있는지 따진다",
        effect: { legitimacy: 12, trust: 2, time: -7, humanCost: 3, fatigue: 4 },
        next: "c39_mosaic",
        cognition: { inference: 2 },
      },
      {
        id: "c39_cut_lift",
        label: "빨간 20분을 통째로 들어내 방송부터 살린다",
        effect: { capital: 8, time: 5, trust: -3, legitimacy: -3, humanCost: 4, fatigue: -3 },
        next: "c39_mosaic",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c39_mosaic",
      },
    ],
  },
  c39_mosaic: {
    phase: "FACES",
    title: "얼굴의 주인",
    speaker: "서하린",
    text:
      "새벽 1시 반, 편집실이 좁아 불 꺼진 B스튜디오에 모니터 하나를 끌어다 놓았습니다. 방송국 법무팀이 자정에 기준을 보냈습니다. 고소당한 사람, 미성년자, 회사 승인이 없는 직원은 얼굴을 가릴 것. 이 기준과 부딪히는 인터뷰이가 셋입니다. 백아린은 공익신고(회사의 불법을 공공기관에 알리는 것)를 했다가 그룹에 영업비밀(회사가 비밀로 지키는 경영 정보) 유출로 고소당했습니다. '가리면 제가 도둑이 돼요. 엄마가 대전에서 보신대요.' 도윤하는 강서지점장에게서 '직원의 방송 출연은 사전 승인 사항'이라는 문자를 받고도 말합니다. '그 대출 판 얼굴이 제 얼굴이에요.' 고3 문하준은 스케치북을 들고 나오겠다고 하고, 문가을은 전화로 짧게 답합니다. '우리 애는 안 돼요. 걔 아빠 얼굴도 다 나가는데.' 세 사람의 얼굴 위에 주하온이 네모 모자이크를 올렸다 내렸다 합니다.",
    memo: [
      "법무팀 기준: 고소당한 사람·미성년자·승인 없는 직원 얼굴 가림",
      "백아린: 공개 원함 -- 영업비밀 유출로 피소",
      "도윤하: 공개 원함 -- 지점의 '사전 승인' 문자",
      "문하준(고3): 공개 원함 / 보호자 문가을: 반대",
    ],
    triggers: ["protection", "affection", "choice"],
    choices: [
      {
        id: "c39_mosaic_choose",
        label: "모자이크는 얼굴의 주인이 정하게 하고 새벽까지 기다린다",
        effect: { trust: 11, humanCost: -3, legitimacy: -2, time: -6, fatigue: 6 },
        next: "c39_caption",
        cognition: { persistence: 2 },
      },
      {
        id: "c39_mosaic_rule",
        label: "법무팀 기준에 걸리는 세 사람은 모두 가린다",
        effect: { legitimacy: 11, trust: -3, humanCost: 4, time: -3, fatigue: 3 },
        next: "c39_caption",
        cognition: { inference: 2 },
      },
      {
        id: "c39_mosaic_open",
        label: "얼굴이 나와야 힘이 생긴다며 모두 공개를 설득한다",
        effect: { capital: 7, time: 4, legitimacy: 3, trust: -3, humanCost: 5, fatigue: -2 },
        next: "c39_caption",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c39_caption",
      },
    ],
  },
  c39_caption: {
    phase: "THE CAPTION",
    title: "승인자: 정정",
    speaker: "주하온",
    text:
      "새벽 4시 40분. 리드라인 편집국 에어컨이 열대야에 손을 들어서, 서하린은 명예 기자증을 건 고양이 정정을 이동장에 넣어 데려왔습니다. 모두가 눈을 붙인 십 분 사이, 정정이 편집 키보드를 천천히 가로지릅니다. 깨어 보니 3부 마지막 장면, 2023-0412 대출 승인서 위의 자막이 '승인자: (공란)'에서 '승인자: 정정ㅓㅓㅓㅓ'로 바뀌어 있습니다. 주하온이 소파에서 굴러떨어집니다. '3년 만에 처음으로 서명한 사람이 나왔네요.' 권도현이 안경을 고쳐 씁니다. '고양이 서명은 효력이 없습니다. 방금 찾아봤습니다.' 강태민은 말없이 정정을 들어 무릎에 올립니다. 웃음이 가라앉자 서하린이 휴대폰을 내밉니다. 방송국 심의(방송 내용이 법과 규정에 맞는지 따지는 절차) 담당의 메일입니다. '공란 표기는 은폐를 암시함. 승인 경위는 수사 중으로 수정 요망.'",
    memo: [
      "정정의 수정: '승인자: (공란)' → '승인자: 정정ㅓㅓㅓㅓ'",
      "심의 담당 요청: '승인 경위는 수사 중'으로 수정",
      "원본 승인서의 승인자 칸: 실제로 비어 있음",
      "납품까지 5시간 20분",
    ],
    triggers: ["curiosity", "trust", "order"],
    choices: [
      {
        id: "c39_caption_names",
        label: "빈 승인자 칸 아래로 피해자 모임의 이름을 한 줄씩 올린다",
        effect: { trust: 12, humanCost: -4, legitimacy: 2, time: -5, capital: -3, fatigue: 5 },
        next: "c39_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c39_caption_blank",
        label: "원본 승인서의 빈칸을 자막 없이 5초 동안 보여 준다",
        effect: { legitimacy: 12, trust: 3, time: -4, humanCost: 2, fatigue: 3 },
        next: "c39_final",
        cognition: { inference: 2 },
      },
      {
        id: "c39_caption_soft",
        label: "심의 요청대로 '승인 경위는 수사 중'으로 고친다",
        effect: { capital: 7, time: 5, legitimacy: -4, trust: 1, humanCost: 3, fatigue: -3 },
        next: "c39_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c39_final",
      },
    ],
  },
  c39_final: {
    phase: "FINAL DECISION",
    title: "외장 하드 두 개",
    speaker: "연태준",
    text:
      "오전 9시 40분, 주조정실(방송을 실제로 내보내는 방) 앞. 법원은 새벽에 들어온 방송금지 가처분(방송을 미리 막아 달라고 법원에 급히 내는 신청)을 9시 20분에 기각했습니다. 법으로는 90분이 나갈 수 있습니다. 대신 사장실에서 한 줄이 내려왔습니다. 90분으로 가면 광고 14개는 끝내 빠지고, 가을 개편 때 이 시사 다큐 시간대는 없어진다는 것. 연태준이 외장 하드 두 개를 책상에 올립니다. 70분과 90분. '결정 문서 책임자 칸에는 내 이름이 들어가. 우리 국에서 그 칸을 비워 둔 적은 없어.' 서하린이 세 번째 길을 말합니다. 70분은 방송으로 내고, 잘린 20분은 근거 자료와 함께 같은 시각 리드라인에 올리는 것. 그러면 공동 제작 계약을 어긴 값은 연태준이 치러야 합니다. 그때 문가을의 문자가 옵니다. '떡 쪄 놨어요. 몇 분짜리든 다 같이 봐요.'",
    memo: [
      "가처분: 09:20 기각",
      "사장실: 90분이면 가을 개편 때 시간대 폐지",
      "외장 하드 두 개 -- 70분 / 90분",
      "이 선택은 시즌의 '빈 서명란'과 같은 칸을 묻는다",
    ],
    triggers: ["choice", "injustice", "responsibility"],
    choices: [
      {
        id: "c39_final_full",
        label: "인터뷰이들이 얼굴을 건 90분 원본을 그대로 납품한다",
        effect: { trust: 12, legitimacy: 7, capital: -10, time: -5, humanCost: 3, fatigue: 6 },
        next: "case39_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c39_final_split",
        label: "70분은 방송으로 내고 잘린 20분은 근거 자료와 함께 공개한다",
        effect: { legitimacy: 12, trust: 6, capital: -5, time: -7, humanCost: -2, fatigue: 7 },
        next: "case39_result",
        cognition: { reframing: 3 },
      },
      {
        id: "c39_final_short",
        label: "70분 방송본을 납품해 오늘 밤 방송부터 확실히 지킨다",
        effect: { capital: 11, time: 6, trust: 5, legitimacy: -7, humanCost: 4, fatigue: -3 },
        next: "case39_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case39_result",
      },
    ],
  },
};

/**
 * Everything else case 39 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case39 = {
  id: "case39",
  nodes: case39Nodes,
  aftermath: {
    c39_aftershock: {
      phase: "AFTERMATH",
      title: "밤 10시의 모니터 벽",
      speaker: "서하린",
      text: "수요일 밤 10시, 3층 편집실 모니터 벽에 방송이 뜹니다. 문가을이 떡 상자 셋을 들고 왔고, 백아린과 도윤하가 소파 양 끝에 앉았습니다. 주하온은 첫 장면이 나가자마자 담요를 덮고 코를 곱니다. 정정은 방을 한 바퀴 돌더니 당신 무릎에 자리를 잡습니다. 연태준은 맨 뒤에 서서 분당 시청률이 3.8%에서 6.1%까지 오르는 걸 말없이 봅니다. 백아린의 휴대폰에 어머니의 문자가 옵니다. '우리 딸 목소리 잘 들었다.' 방송 40분째, 서하린의 제보 메일함에 한 통이 들어옵니다. '회장실 비서팀에 있었습니다. 참고 의견을 누가 시켰는지 압니다. 오늘 밤 12시, 합정역 7번 출구.' 서하린이 화면을 당신 쪽으로 돌립니다. 크레디트까지는 50분이 남았습니다.",
      memo: ["방송 중 -- 분당 시청률 최고 6.1%", "편집실에 모인 인터뷰이 5명, 떡 상자 3개", "제보: '회장실 비서팀 출신', 오늘 00시 합정역", "정정: 당신 무릎 위"],
      triggers: ["affection", "curiosity", "choice"],
      choices: [
        { id: "c39_after_warm", label: "마지막 자막이 올라갈 때까지 편집실 사람들 곁을 지킨다", effect: { trust: 11, humanCost: -6, time: -3, capital: -3, fatigue: -7 }, next: "case39_result", cognition: { reframing: 2 } },
        { id: "c39_after_record", label: "잘린 20분을 원본 그대로 묶어 보존 기록으로 남긴다", effect: { legitimacy: 14, trust: 2, time: -5, capital: -3, fatigue: 5 }, next: "case39_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c39_after_rush", label: "방송이 끝나기도 전에 편집실을 나와 제보자를 만나러 간다", effect: { capital: 8, legitimacy: 3, trust: -5, humanCost: 4, fatigue: 6 }, next: "case39_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c39_final", "c39_aftershock"],
  connectiveScenes: [
    ["c39_door", "c39_cut", "c39_mosaic", "편집 중입니다", "강태민", "밤 11시 50분, 광고영업국 사람들이 '진행 상황만 보겠다'며 두 번째로 편집실을 찾아옵니다. 강태민이 문 앞에 접이식 의자를 놓고 앉아 있습니다. 그가 하는 말은 한 문장뿐입니다. '편집 중입니다.' 세 번째로 온 사람은 연태준입니다. 강태민이 비켜 주자 그는 들어오지 않고 복도에 선 채 말합니다. '11년 전에 나도 12분을 잘랐어. 조선소 하청 노동자 인터뷰였지. 얼굴은 나가고, 그 사람이 왜 말했는지는 잘렸어. 석 달 뒤에 그 사람 계약이 끝났고.' 그가 복도 끝 자판기 불빛을 봅니다. '너희는 뭘 지킬 건지 먼저 정해. 20분이야, 사람이야.'", ["광고영업국 방문 2회 -- '진행 상황 확인'", "연태준: 11년 전 12분 삭제", "그 인터뷰이: 방송 석 달 뒤 계약 종료"], ["이번엔 분량보다 사람부터 지키자고 연태준에게 말한다", "영업국이 찾아온 시각과 말을 한 줄씩 기록해 둔다", "문을 열어 두고 영업국과 직접 분량을 협상한다"]],
    ["c39_cakes", "c39_mosaic", "c39_caption", "새벽 세 시의 떡", "문가을", "새벽 3시, 법정에서 돌아온 지 여덟 시간 만에 문가을이 택시를 타고 떡 상자를 들고 옵니다. '밤새는 사람들 배고플까 봐요.' 권도현이 인절미를 세 개째 집으며 '이건 제작비에 안 잡히는 지원입니다'라고 중얼거립니다. 떡을 나누던 문가을이 모니터 앞에서 멈춥니다. 2부에 들어간 2019년 가온정밀 홍보 영상입니다. 남편 문성호가 선반 앞에서 웃으며 말합니다. '우리 공장은 0.01밀리까지 봅니다.' 장례식 뒤로 움직이는 남편을 보는 건 처음입니다. 문가을이 떡 상자를 내려놓고 한참 서 있다가 묻습니다. '이거 몇 초 나가요?'", ["2019년 가온정밀 홍보 영상 -- 지금 12초", "문성호: '0.01밀리까지 봅니다'", "영상 권리: 문 닫은 회사의 것 -- 확인 필요"], ["문가을이 원하면 남편의 영상을 더 길게 넣자고 한다", "홍보 영상을 쓸 권리가 누구에게 있는지 먼저 확인한다", "분량이 빠듯하니 남편의 영상은 5초로 줄인다"]],
    ["c39_court", "c39_caption", "c39_final", "여섯 시의 신청서", "서하린", "새벽 6시 10분, 옥상 너머로 해가 올라옵니다. 서하린의 휴대폰에 법원 알림이 뜹니다. 그룹 측 로펌이 4부만 콕 집어 방송금지 가처분(방송을 미리 막아 달라고 법원에 급히 내는 신청)을 냈고, 심문은 오전 9시입니다. 신청서 첫 문장은 '회장 관련 부분은 확인되지 않은 추측'입니다. 서하린이 난간에 기대 말합니다. '추측 아니에요. 증언 셋에 문서 둘이에요. 근데 증언한 셋 중 둘은 이름을 안 밝히기로 했어요.' 그가 목소리를 낮춥니다. '법정에서 그 둘을 부르면 이기고, 그 둘은 끝나요.'", ["가처분 신청: 4부 한정, 심문 09:00", "4부의 근거: 증언 3개(익명 2) + 문서 2장", "납품 마감: 10:00"], ["익명의 두 증언자는 부르지 않고 우리가 대신 법정에 선다", "4부의 모든 문장에 근거 자료 번호를 붙여 법원에 낸다", "심문 전에 4부를 스스로 빼서 가처분을 헛돌게 한다"]],
  ],
  connectiveOrder: [["c39_cut", "c39_door"], ["c39_mosaic", "c39_cakes"], ["c39_caption", "c39_court"]],
  choiceEffects: {
    c39_cut: [
      { trust: 10, humanCost: -5, time: -4, capital: -3, fatigue: 5 },
      { legitimacy: 9, trust: 2, time: -5, humanCost: 3, fatigue: 3 },
      { capital: 6, time: 4, trust: -2, humanCost: 3, fatigue: -3 },
    ],
    c39_mosaic: [
      { trust: 11, humanCost: -4, time: -3, capital: -3, fatigue: 5 },
      { legitimacy: 8, trust: 3, time: -4, humanCost: 2, fatigue: 2 },
      { time: 5, capital: 4, trust: -3, humanCost: 5, fatigue: -4 },
    ],
    c39_caption: [
      { trust: 9, humanCost: -3, legitimacy: 2, time: -5, capital: -2, fatigue: 5 },
      { legitimacy: 11, trust: 2, time: -6, humanCost: 3, fatigue: 5 },
      { time: 5, capital: 5, legitimacy: -2, trust: -1, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c39_cut: {
      voice: ["이번엔 분량보다, 사람부터 지키자고 연태준에게 말한다.", "영업국이 찾아온 시각과 말을, 한 줄씩 기록해 둔다.", "문을 열어 두고, 영업국과 직접 분량을 협상한다."],
      echo: ["사람부터라고 하면 연태준이 오래 웃습니다. 11년 전 자기가 하지 못한 말이라고 합니다. 20분은 여전히 빨간색입니다.", "기록은 시각과 말만 남깁니다. 영업국 사람들은 네 번째로 오지 않고, 메일로 같은 말을 보냅니다.", "문을 열면 협상은 빨라집니다. 영업국은 20분을 16분으로 깎아 주고, 무엇이 남을지는 그들이 고릅니다."],
    },
    c39_mosaic: {
      voice: ["문가을이 원하면, 남편의 영상을 더 길게 넣자고 한다.", "홍보 영상을 쓸 권리가 누구에게 있는지, 먼저 확인한다.", "분량이 빠듯하니, 남편의 영상은 5초로 줄인다."],
      echo: ["영상이 길어지면 문성호가 선반을 설명하는 목소리가 끝까지 나갑니다. 그 40초만큼 다른 누군가의 장면이 빠집니다.", "권리를 확인하면 영상의 주인이 파산 관리인이라는 게 나옵니다. 새벽 3시에 전화를 받을 사람은 아닙니다.", "5초면 웃는 얼굴까지만 나갑니다. '0.01밀리'라는 말은 편집실 바닥에 남습니다."],
    },
    c39_caption: {
      voice: ["익명의 두 증언자는 부르지 않고, 우리가 대신 법정에 선다.", "4부의 모든 문장에, 근거 자료 번호를 붙여 법원에 낸다.", "심문 전에 4부를 스스로 빼서, 가처분을 헛돌게 한다."],
      echo: ["대신 법정에 서면 익명의 두 사람은 지켜집니다. 판사는 이름 없는 증언에 무게를 덜 둡니다.", "번호를 붙이면 4부의 문장 212개가 전부 출처를 갖습니다. 번호를 다 붙이는 데 세 시간이 걸립니다.", "스스로 빼면 신청은 대상이 없어 끝납니다. 그룹은 아무것도 막지 않고 원하는 것을 얻습니다."],
    },
  },
  reactionScenes: [
    ["c39_door_reaction", "c39_door", "c39_mosaic", "12분짜리 테이프", "연태준", "연태준이 영상 자료실 맨 아래 칸에서 먼지 앉은 테이프 하나를 꺼냅니다. 라벨에는 매직으로 '12분'이라고만 적혀 있습니다. '버리라는 말은 아무도 안 했어. 그래서 안 버렸지. 11년 동안 한 번도 안 틀었고.' 그가 테이프를 당신 손에 쥐여 줍니다. '오늘 잘리는 20분도 이렇게 될 거야. 어느 칸에 꽂혀서, 아무도 안 트는 거.' 그리고 처음으로 묻습니다. '너희 쪽에서 그걸 막을 방법, 있어?'", ["오늘 결정에는 연태준의 이름도 함께 걸어 달라고 부탁한다", "잘리는 분량은 원본째 따로 보관하자고 제안한다", "옛 테이프보다 오늘 밤 70분이 급하다고 말한다"]],
    ["c39_cakes_reaction", "c39_cakes", "c39_caption", "네모 안의 웃음", "문하준", "엄마를 따라온 문하준이 로비 소파에서 스케치북을 펼칩니다. 다큐의 마지막 장면을 그려 왔습니다. 인터뷰이들이 떡집 앞에 한 줄로 서 있고, 몇 명의 얼굴은 모자이크처럼 네모 칸으로 칠해져 있는데, 네모마다 작은 웃는 입이 그려져 있습니다. '가려도 웃고 있는 건 보이게요.' 맨 끝 네모 하나는 비어 있습니다. '이건 저예요. 엄마가 정하면 칠할게요.' 문가을이 그림을 오래 봅니다. 내려와 있던 주하온이 어깨 너머로 보고 말합니다. '이거 그대로 엔딩에 3초면 돼요. 파일 이름은 진짜최종으로 할게요.'", ["하준의 그림을 다큐 마지막 장면으로 넣자고 한다", "보호자 동의서부터 받고 하준의 출연 범위를 정한다", "하준의 출연은 다음으로 미루고 편집을 서두른다"]],
    ["c39_court_reaction", "c39_court", "c39_final", "책임자 칸", "연태준", "아침 7시 반, 연태준이 방송 결정 문서를 출력해 옵니다. 맨 아래 책임자 칸에 이미 자기 이름을 써 놓았습니다. '어느 쪽으로 가든 내 이름이야. 이 칸을 비워 두고 내보낸 방송은 우리 국에 한 편도 없어.' 그가 볼펜을 굴립니다. 11년 전 '12분' 방송의 결정 문서에도 그의 이름이 있었다고 합니다. 그때도 칸은 채웠고, 잘린 이유는 어디에도 적지 않았습니다. '이번엔 뭘 같이 적을래?'", ["연태준 혼자가 아니라 제작진 모두가 함께 서명하자고 한다", "누가 무엇을 자르라 했는지 편집 이력을 문서에 붙인다", "그의 서명이면 충분하다며 결정을 연태준에게 맡긴다"]],
  ],
  reactionEffects: {
    c39_door: [
      { trust: 9, humanCost: -3, legitimacy: 2, time: -3, fatigue: 3 },
      { legitimacy: 8, trust: 3, capital: -3, time: -3, fatigue: 2 },
      { time: 4, capital: 5, trust: 2, humanCost: 3, fatigue: -2 },
    ],
    c39_cakes: [
      { trust: 10, humanCost: -4, capital: -3, time: -2, fatigue: 3 },
      { legitimacy: 8, trust: 3, time: -4, capital: -1, humanCost: 2, fatigue: 2 },
      { time: 4, capital: 3, trust: 1, humanCost: 4, fatigue: -2 },
    ],
    c39_court: [
      { trust: 10, humanCost: -2, legitimacy: 3, time: -3, fatigue: 3 },
      { legitimacy: 9, trust: 2, time: -4, capital: -2, fatigue: 2 },
      { time: 4, capital: 4, trust: 2, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c39_door: {
      voice: ["오늘 결정에는, 연태준의 이름도 함께 걸어 달라고 부탁한다.", "잘리는 분량은, 원본째 따로 보관하자고 제안한다.", "옛 테이프보다, 오늘 밤 70분이 급하다고 말한다."],
      echo: ["연태준이 테이프를 다시 받아 가지 않습니다. '그럼 이건 네가 들고 있어. 둘이 같이 걸었다는 표시로.'", "보관하자고 하면 주하온이 폴더를 하나 만듭니다. 이름은 '12분_그리고_20분'입니다. 연다는 약속은 아직 아무도 하지 않았습니다.", "연태준이 고개를 끄덕이고 테이프를 제 칸에 도로 꽂습니다. 먼지가 조금 덜 앉은 자리입니다."],
    },
    c39_cakes: {
      voice: ["하준의 그림을, 다큐 마지막 장면으로 넣자고 한다.", "보호자 동의서부터 받고, 하준의 출연 범위를 정한다.", "하준의 출연은 다음으로 미루고, 편집을 서두른다."],
      echo: ["그림이 엔딩이 되면 빈 네모 하나도 같이 나갑니다. 문가을은 그 네모를 칠할지 방송 직전까지 정하지 못합니다.", "동의서에는 칸이 여섯 개 있습니다. 문가을이 다섯 칸을 채우고, 마지막 칸을 하준에게 넘깁니다.", "하준이 스케치북을 덮습니다. '다음에 더 잘 그려 올게요.' 그 말이 조금 빨랐습니다."],
    },
    c39_court: {
      voice: ["연태준 혼자가 아니라, 제작진 모두가 함께 서명하자고 한다.", "누가 무엇을 자르라 했는지, 편집 이력을 문서에 붙인다.", "그의 서명이면 충분하다며, 결정을 연태준에게 맡긴다."],
      echo: ["책임자 칸이 좁아 이름 일곱 개가 두 줄이 됩니다. 주하온은 자기 이름 옆에 '진짜최종'이라고 쓰려다 참습니다.", "편집 이력이 붙으면 결정 문서가 열한 장이 됩니다. '참고 의견'도 그 안에 들어갑니다.", "연태준이 혼자 서명합니다. 이번 결정의 무게도 11년 전처럼 한 사람의 칸에만 들어갑니다."],
    },
  },
  reactionMemos: {
    c39_door_reaction: ["라벨에 '12분'만 적힌 테이프", "11년 동안 한 번도 틀지 않음"],
    c39_cakes_reaction: ["네모마다 그려 넣은 웃는 입", "아직 칠하지 않은 마지막 네모"],
    c39_court_reaction: ["이미 채워진 책임자 칸", "잘린 이유는 적힌 적 없음"],
  },
  branchPlan: ["c39_cut", 2, "c39_branch_sales", "c39_branch_sales_follow"],
  branchScenes: {
    // CASE 39's detour is the ad sales floor. The case argues over twenty
    // minutes of tape; the side door is the room where those minutes have a
    // price, and the woman who sells them turns out to have been scored too.
    c39_branch_sales: {
      phase: "SIDE DOOR",
      title: "30초의 값",
      speaker: "은시온",
      text: "빨간 20분을 들어내기로 하자 연태준이 광고영업국 확인을 받아 오라고 합니다. 밤 11시, 불 켜진 회의실에서 광고영업국 차장 은시온이 태블릿을 당신 쪽으로 돌립니다. 수요일 밤 광고 판매표에서 KD 쪽 14칸이 회색으로 칠해져 있습니다. '올해 우리 팀 목표의 31%가 KD예요.' 그가 한 칸을 누릅니다. '그리고 방금 연락이 왔어요. 20분이 빠지면 추석 특집에 6칸을 더 사겠대요.' 통보 메일은 KD카드 마케팅팀이 아니라 그룹 브랜드전략팀에서 왔고, 참조란 한 줄은 은시온이 손가락으로 가리고 있습니다.",
      memo: ["수요일 22시대 광고 14칸 -- 회색", "영업국 올해 목표 중 KD 비중 31%", "추가 제안: 20분 삭제 시 추석 특집 6칸", "통보 메일 발신: 그룹 브랜드전략팀, 참조 1줄 가림"],
      triggers: ["reward", "manipulation", "system"],
      choices: [
        { id: "c39_branch_sales_a", label: "영업국의 목표 손실을 제작국과 나눠 지자고 제안한다", effect: { trust: 9, humanCost: -3, capital: -5, time: -3, fatigue: 4 }, next: "c39_branch_sales_follow", cognition: { reframing: 2 } },
        { id: "c39_branch_sales_b", label: "통보 메일을 참조란까지 원문 그대로 받아 둔다", effect: { legitimacy: 10, trust: -2, time: -4, humanCost: 2, fatigue: 3 }, next: "c39_branch_sales_follow", cognition: { inference: 2 } },
        { id: "c39_branch_sales_c", label: "추석 광고 6칸을 받는 조건으로 20분을 내주는 거래를 받는다", effect: { capital: 10, time: 3, trust: -3, legitimacy: -2, humanCost: 3, fatigue: -3 }, next: "c39_branch_sales_follow", cognition: { risk: 2 } },
      ],
    },
    c39_branch_sales_follow: {
      phase: "SIDE DOOR",
      title: "적합도 88점",
      speaker: "은시온",
      text: "은시온이 참조란을 가리던 손가락을 뗍니다. 'KD금융그룹 회장실'. 그가 태블릿을 끄고 한참 있다가 말합니다. '5부에 나오는 채용 평가 회사요. 저도 작년에 그 회사 점수로 여기 들어왔어요. 조직 적합도(회사에 잘 맞을 사람인지 매겼다는 점수) 88점. 합격 문자에 점수가 같이 왔어요. 그땐 자랑했어요.' 그가 사원증 줄에 매단 작은 계산기를 만지작거립니다. '그 점수가 누구 망설임으로 만든 건지, 편집실 모니터 보고 알았어요. 제가 파는 건 30초예요. 그 30초가 20분을 사 가는 줄은 몰랐고요.'",
      memo: ["참조: KD금융그룹 회장실", "은시온: 작년 입사, 핏스코어 점수 88점", "합격 문자에 점수가 함께 옴", "5부의 6분이 다루는 바로 그 회사"],
      triggers: ["selfAwareness", "trust", "injustice"],
      choices: [
        { id: "c39_branch_sales_follow_a", label: "은시온에게 합격 문자를 5부의 증언으로 보태 달라고 부탁한다", effect: { trust: 8, legitimacy: 5, humanCost: 3, time: -4, fatigue: 4 }, next: "c39_door", cognition: { persistence: 2 } },
        { id: "c39_branch_sales_follow_b", label: "광고 통보와 채용 점수는 따로 다뤄야 한다며 선을 긋는다", effect: { legitimacy: 9, trust: 2, time: -3, humanCost: 2, fatigue: 2 }, next: "c39_door", cognition: { inference: 2 } },
        { id: "c39_branch_sales_follow_c", label: "들은 말은 묻어 두고 추석 광고 조건만 받아 온다", effect: { capital: 7, time: 4, trust: 2, legitimacy: -2, humanCost: 2, fatigue: -3 }, next: "c39_door", cognition: { risk: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c39_start",
    result: "c39_aftershock",
    defaultFree: "c39_route_system",
    // One cut, many faces. Like 사건 12 the case is a single line; the split is
    // what the twenty minutes turn into by morning.
    choices: {},
    system: {
      route: "c39_route_system",
      final: "c39_final_system_route",
      title: "잘리는 20분의 공통점",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 지난 10년 국내 탐사 다큐멘터리 가운데 방송 직전 광고 철회 통보를 받은 스물세 편을 엽니다. 방송 전에 분량이 줄어든 것이 열아홉 편이고, 그중 열일곱 편에서 잘린 대목은 한 사람의 잘못이 아니라 조직이 어떻게 결정했는지를 보여 주는 부분이었습니다. 잘린 분량이 나중에라도 공개된 경우는 두 편입니다. '잘리는 것은 사람의 얼굴이 아니라 구조의 설명으로 학습되어 있습니다. 얼굴은 광고와 함께 나갈 수 있습니다. 구조는 그렇지 않습니다.'",
      memo: ["광고 철회 통보 23편 중 분량 축소 19편", "잘린 대목이 구조 설명이었던 경우 17편", "잘린 분량이 나중에 공개된 경우 2편"],
      routeChoices: [
        ["c39_route_system_publish", "통계를 방송국 제작진 게시판에 그대로 공개한다", { legitimacy: 10, trust: 5, capital: -4, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c39_route_system_insert", "통계 한 장을 다큐 마지막 자막으로 넣자고 한다", { trust: 7, legitimacy: 7, humanCost: 2, time: -5, fatigue: 6 }, { reframing: 2 }],
        ["c39_route_system_drop", "통계는 덮고 오늘 밤 편집에만 집중한다", { time: 7, capital: 6, trust: -5, legitimacy: -6, humanCost: 3, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "잘린 분량을 3년 뒤 자동으로 공개되게 봉인해 맡긴다", { legitimacy: 12, trust: 5, capital: -6, humanCost: -3, fatigue: 6 }, { reframing: 3 }],
      ["b", "잘린 분량은 지우고 방송본만 남긴다", { capital: 9, time: 6, trust: -6, legitimacy: -8, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "광고 철회 통보를 받은 제작진이 함께 쓸 공개 기준을 만든다", { legitimacy: 8, trust: 9, capital: -5, time: -7, humanCost: 2, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c39_evidence_turn",
    result: "c39_aftershock",
    sourceRoutes: ["c39_cut", "c39_mosaic", "c39_caption", "c39_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 '참고 의견' 파일 옆에 놓고, 그 20분을 누가 처음 표시했는지 맞춰 본다.",
    entryEcho: "단서를 대면 광고의 이름 뒤에 누가 있었는지 보입니다. 그리고 그 표시가 어떤 선의에서 빠져나왔는지도 보입니다.",
    title: "참고 의견의 작성자",
    speaker: "이민서",
    text: "단서를 맞추자 이민서가 '참고 의견' 파일의 문서 속성 창을 엽니다. 작성자 칸에는 'KD금융그룹 회장실', 만든 시각은 월요일 14시 22분입니다. 라온방송이 그룹에 반론(보도 대상이 자기 입장을 밝힐 기회)을 준비하라며 다큐 사본을 보낸 지 22분 뒤입니다. 타임코드(영상의 몇 분 몇 초인지 적은 번호)는 그 사본에만 있던 임시 번호와 한 칸도 다르지 않습니다. 이민서가 노트북을 돌립니다. '공정하게 하려고 먼저 보여 준 사본으로, 자를 곳을 표시했어요. 그 표시는 광고 이름으로 왔고요. 회장님은 이번에도 남의 이름으로 결정했어요.'",
    memo: ["문서 작성자: KD금융그룹 회장실", "작성 시각: 반론용 사본 발송 22분 뒤", "타임코드: 반론용 사본의 임시 번호와 일치"],
    triggers: ["injustice", "system", "curiosity"],
    entryEffect: { legitimacy: 6, trust: 2, time: -6, capital: -3, fatigue: 5 },
    choices: [
      ["c39_evidence_turn_air", "작성자 정보를 다큐 마지막 장면에 그대로 넣는다", { legitimacy: 13, trust: 5, capital: -6, time: -7, humanCost: 3, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c39_evidence_turn_hold", "작성자 정보는 쥐고 있다가 영업국과의 협상 카드로 쓴다", { capital: 9, time: 5, trust: -5, legitimacy: -4, humanCost: 4, fatigue: -3 }, { risk: 2 }],
      ["c39_evidence_turn_share", "반론용 사본이 어떻게 쓰였는지 제작진 전원에게 먼저 알린다", { trust: 11, legitimacy: 7, capital: -5, humanCost: -5, time: -4, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c39_branch_sales",
    systemNext: "c39_route_system",
    evidenceNext: "c39_evidence_turn",
    routeLabel: "직전 변론의 방청 노트로 인터뷰이들의 순서를 다시 짠다",
    systemLabel: "직전 자유응답 문장이 다큐 자막 어디에 쓰였는지 찾는다",
    evidenceLabel: "직전 단서를 붙여 '참고 의견'을 누가 썼는지 문서 속성을 연다",
  },
  openingRoutes: {
    c38_after_warm: "c39_start_warm",
    c38_after_record: "c39_start_record",
    c38_after_rush: "c39_start_rush",
  },
  openingCopy: {
    c39_start_warm: ["떡집에서 온 사람의 편집실", "문가을", "첫 변론(법정에서 양쪽이 주장과 증거를 내는 절차)이 끝난 화요일 저녁, 당신은 원고들과 가을떡방으로 돌아가 늦은 저녁을 끝까지 함께했습니다. 1,740명이 함께 낸 집단소송(피해자 여럿이 함께 내는 소송)의 첫날이었습니다. 밤 9시, 문가을이 남은 떡을 싸 주며 등을 떠밉니다. 서하린이 상암동 라온방송 편집실에서 기다립니다. 내일 밤 나갈 다큐멘터리 「서명하지 않은 사람들」에는 원고 셋이 나옵니다. KD금융그룹 계열사(같은 그룹에 속한 다른 회사) 세 곳이 광고 14개를 빼겠다고 했고, 함께 온 '참고 의견'에 20분짜리 구간이 적혀 있습니다. 택시 문을 닫기 전에 문가을이 묻습니다. '우리 얘기 잘려요? 법원에선 끝까지 들어 주던데.'", ["광고 철회 통보: KD 쪽 세 곳, 14개", "'참고 의견'이 가리킨 구간: 20분", "원고 3명이 다큐에 출연"]],
    c39_start_record: ["기록을 나눈 사람의 편집실", "서하린", "오늘 법정의 방청 기록 23쪽을 당신은 저녁 내내 정리해 원고 전원에게 보냈습니다. 받는 사람 목록 맨 끝에 서하린이 있었고, 그는 기록의 두 문장을 곧바로 다큐멘터리 「서명하지 않은 사람들」 5부 끝 자막에 넣었습니다. 밤 9시, 상암동 라온방송 편집실. 방송은 내일 밤입니다. KD금융그룹 계열사(같은 그룹에 속한 다른 회사) 세 곳이 광고 14개를 빼겠다고 통보했고, 함께 온 '참고 의견'에 타임코드(영상의 몇 분 몇 초인지 적은 번호) 두 줄이 적혀 있습니다. 서하린이 형광펜으로 그 구간을 칠합니다. '오늘 넣은 두 문장, 딱 이 20분 안에 있어요.'", ["광고 철회 통보: KD 쪽 세 곳, 14개", "방청 기록의 두 문장 -- 5부 끝 자막", "그 두 문장이 잘릴 20분 안에 있음"]],
    c39_start_rush: ["먼저 온 사람의 편집실", "서하린", "서하린의 전화를 받자마자 당신은 떡 한 상자를 무릎에 얹고 택시로 상암동까지 왔습니다. 법원 앞에 남은 사람들이 트렁크에 떡을 더 실어 주었습니다. 밤 8시, 라온방송 편집실. 내일 밤 나갈 다큐멘터리 「서명하지 않은 사람들」을 두고 KD금융그룹 계열사(같은 그룹에 속한 다른 회사) 세 곳이 광고 14개를 한꺼번에 빼겠다고 통보했고, 함께 온 '참고 의견'에 4부 전체와 5부 일부, 정확히 20분이 적혀 있습니다. 화이트보드의 반론(보도 대상이 자기 입장을 밝힐 기회) 요청 발송처 칸에는 오후 법정에서 그룹 쪽에 앉아 있던 법무법인 도율이 적혀 있습니다. 서하린이 말합니다. '오늘 법정의 그 변호사들이 우리 사본을 제일 먼저 본 사람들이에요.'", ["광고 철회 통보: KD 쪽 세 곳, 14개", "반론 요청 발송처: 법무법인 도율", "'참고 의견'의 구간: 4부 전체 + 5부 일부"]],
  },
  openingSignatures: {
    c39_start_warm: {
      label: "원고들이 나오는 장면부터 문가을과 영상 통화로 함께 본다",
      effect: { trust: 10, humanCost: -6, time: -5, capital: -3, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "원고들이 나오는 장면부터, 문가을과 영상 통화로 함께 본다.",
      echo: "화면 너머로 떡집에 남은 원고들이 하나둘 모여듭니다. 다들 자기 장면보다 옆 사람 장면에서 더 오래 웁니다. 그 장면들이 20분 안에 있는지는 아무도 묻지 않습니다.",
    },
    c39_start_record: {
      label: "방청 기록에서 온 두 문장의 출처를 자막에 밝히자고 한다",
      effect: { legitimacy: 10, trust: 3, capital: -3, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "방청 기록에서 온 두 문장의 출처를, 자막에 밝히자고 한다.",
      echo: "출처가 붙으면 두 문장은 법정 기록이 됩니다. 법정 기록을 자르는 일은 광고 이름으로 하기 조금 어려워집니다.",
    },
    c39_start_rush: {
      label: "도율이 사본을 언제 받았는지 방송국 법무팀부터 찾아가 묻는다",
      effect: { legitimacy: 6, capital: 4, time: 3, trust: -4, humanCost: 2, fatigue: 2 },
      cognition: { risk: 2 },
      voice: "도율이 사본을 언제 받았는지, 방송국 법무팀부터 찾아가 묻는다.",
      echo: "법무팀은 그룹에 사본을 보낸 날짜를 알려 줍니다. 그 날짜는 광고 철회 통보보다 하루 빠릅니다.",
    },
  },
  voiceLines: {
    // CASE 39. The night of the cut. Every line is said in a room where
    // someone's face or voice is on a monitor, so none of them gets to sound
    // like a press release.
    c39_start_call: "다큐에 나온 사람들에게, 먼저 전화해 사정을 알린다.",
    c39_start_paper: "'참고 의견'을 누가 썼는지, 문서로 받아 두자고 한다.",
    c39_start_trim: "밤을 아끼자며, 자를 후보부터 바로 표시한다.",
    c39_cut_mine: "4부 대신, 내 인터뷰 22분부터 잘라 내자고 한다.",
    c39_cut_contract: "광고 계약서에, 방송 내용을 건드릴 조항이 있는지 따진다.",
    c39_cut_lift: "빨간 20분을 통째로 들어내서, 방송부터 살린다.",
    c39_branch_sales_a: "영업국의 목표 손실을, 제작국과 나눠 지자고 제안한다.",
    c39_branch_sales_b: "통보 메일을, 참조란까지 원문 그대로 받아 둔다.",
    c39_branch_sales_c: "추석 광고 6칸을 받는 조건으로, 20분을 내주는 거래를 받는다.",
    c39_branch_sales_follow_a: "은시온에게, 합격 문자를 5부의 증언으로 보태 달라고 부탁한다.",
    c39_branch_sales_follow_b: "광고 통보와 채용 점수는 따로 다뤄야 한다며, 선을 긋는다.",
    c39_branch_sales_follow_c: "들은 말은 묻어 두고, 추석 광고 조건만 받아 온다.",
    c39_mosaic_choose: "모자이크는 얼굴의 주인이 정하게 하고, 새벽까지 기다린다.",
    c39_mosaic_rule: "법무팀 기준에 걸리는 세 사람은, 모두 가린다.",
    c39_mosaic_open: "얼굴이 나와야 힘이 생긴다며, 모두 공개하자고 설득한다.",
    c39_caption_names: "빈 승인자 칸 아래로, 피해자 모임의 이름을 한 줄씩 올린다.",
    c39_caption_blank: "원본 승인서의 빈칸을, 자막 없이 5초 동안 보여 준다.",
    c39_caption_soft: "심의 요청대로, '승인 경위는 수사 중'으로 고친다.",
    c39_final_full: "인터뷰이들이 얼굴을 건, 90분 원본을 그대로 납품한다.",
    c39_final_split: "70분은 방송으로 내고, 잘린 20분은 근거 자료와 함께 공개한다.",
    c39_final_short: "70분 방송본을 납품해서, 오늘 밤 방송부터 확실히 지킨다.",
    c39_after_warm: "마지막 자막이 올라갈 때까지, 편집실 사람들 곁을 지킨다.",
    c39_after_record: "잘린 20분을 원본 그대로 묶어, 보존 기록으로 남긴다.",
    c39_after_rush: "방송이 끝나기도 전에 편집실을 나와, 제보자를 만나러 간다.",
    c39_route_system_publish: "통계를, 방송국 제작진 게시판에 그대로 공개한다.",
    c39_route_system_insert: "통계 한 장을, 다큐 마지막 자막으로 넣자고 한다.",
    c39_route_system_drop: "통계는 덮고, 오늘 밤 편집에만 집중한다.",
    c39_final_system_route_a: "잘린 분량을, 3년 뒤 자동으로 공개되게 봉인해 맡긴다.",
    c39_final_system_route_b: "잘린 분량은 지우고, 방송본만 남긴다.",
    c39_final_system_route_c: "광고 철회 통보를 받은 제작진이, 함께 쓸 공개 기준을 만든다.",
    c39_evidence_turn_air: "작성자 정보를, 다큐 마지막 장면에 그대로 넣는다.",
    c39_evidence_turn_hold: "작성자 정보는 쥐고 있다가, 영업국과의 협상 카드로 쓴다.",
    c39_evidence_turn_share: "반론용 사본이 어떻게 쓰였는지, 제작진 전원에게 먼저 알린다.",
  },
  echoReplies: {
    // CASE 39.
    c39_start_call: "전화를 받은 다섯 명 중 넷이 같은 걸 묻습니다. '제 얼굴 나가요?' 그 대답을 하려면 먼저 20분을 정해야 합니다.",
    c39_start_paper: "연태준이 웃습니다. '문서로 달라고 하면 문서는 안 와. 대신 전화가 오지.' 밤 10시에 정말로 전화가 옵니다.",
    c39_start_trim: "주하온의 손이 빠릅니다. 빨간 표시가 20분을 넘어 23분까지 번지고, 넘친 3분이 누구의 장면인지는 아무도 확인하지 않습니다.",
    c39_cut_mine: "당신의 22분이 빠지면 4부는 남습니다. 대신 '반대 의견을 쓴 사람'이 왜 썼는지는 이 다큐 어디에도 없게 됩니다.",
    c39_cut_contract: "계약서 열일곱 쪽에 방송 내용을 건드릴 조항은 없습니다. 광고를 뺄 권리는 있습니다. 둘 다 사실이라서 밤이 깁니다.",
    c39_cut_lift: "20분이 빠지자 다큐가 매끄러워집니다. 주하온이 처음부터 다시 봅니다. '잘 만든 70분이네요. 딴 얘기라서 그렇지.'",
    c39_branch_sales_a: "은시온이 처음으로 태블릿에서 눈을 뗍니다. '제작국이 영업 손실을 나눠 지자고 한 건 처음 들어요.' 나눠 질 방법은 아직 둘 다 모릅니다.",
    c39_branch_sales_b: "원문을 받으면 참조란의 한 줄도 같이 옵니다. 은시온은 전달 버튼을 누르고, 그 버튼을 누른 사람으로 남습니다.",
    c39_branch_sales_c: "거래가 성사되면 영업국 목표는 채워집니다. 추석 특집 광고 6칸에 KD의 새 캠페인 문구가 들어갑니다. '기억하는 금융'.",
    c39_branch_sales_follow_a: "은시온이 합격 문자를 캡처해 보냅니다. 증언이 되는 순간, 그 88점은 자랑이 아니라 증거가 됩니다. 인사팀이 이 방송을 볼 겁니다.",
    c39_branch_sales_follow_b: "선을 그으면 오늘 밤 편집은 한 갈래로 정리됩니다. 은시온의 88점은 다음 사건까지 그의 휴대폰에만 남습니다.",
    c39_branch_sales_follow_c: "조건은 받아 옵니다. 은시온이 한 말은 회의실에 두고 나옵니다. 문이 닫힐 때 그가 태블릿을 다시 켭니다.",
    c39_mosaic_choose: "기다리면 백아린은 얼굴을, 도윤하는 목소리를, 문하준은 스케치북만 고릅니다. 세 번의 결정에 두 시간이 듭니다.",
    c39_mosaic_rule: "기준대로 가리면 백아린의 얼굴이 네모가 됩니다. 그가 화면을 보고 말합니다. '이러니까 진짜 뭘 훔친 사람 같네요.'",
    c39_mosaic_open: "모두 공개하면 화면에 힘이 생깁니다. 도윤하의 지점장은 방송 다음 날 아침 9시에 면담을 잡습니다.",
    c39_caption_names: "이름이 올라가면 빈칸이 더 크게 보입니다. 1,021명의 이름이 지나가는 데 4분이 걸리고, 그 4분은 어디선가 빠져야 합니다.",
    c39_caption_blank: "5초의 빈칸은 편집실에서 가장 긴 5초가 됩니다. 주하온이 소리를 끄고, 또 켜고, 결국 끕니다.",
    c39_caption_soft: "'수사 중'은 틀린 말이 아닙니다. 다만 그 자막 아래에서는 빈칸이 보이지 않습니다. 정정이 키보드 위에서 하품을 합니다.",
    c39_final_full: "90분이 나가면 시청자는 회장의 식탁까지 봅니다. 가을 개편표에서 이 시간대 칸은 빈칸이 되고, 그 칸에도 결정한 사람의 이름은 없습니다.",
    c39_final_split: "둘로 나누면 방송은 오늘 밤 나가고, 잘린 20분은 같은 시각 인터넷에서 더 많이 재생됩니다. 연태준은 다음 날 징계 회의에 불려 갑니다.",
    c39_final_short: "70분은 확실히 나갑니다. 인터뷰이들은 떡을 먹으며 끝까지 봅니다. 회장이라는 말은 70분 동안 한 번도 나오지 않습니다.",
    c39_after_warm: "자리를 지키면 백아린이 어머니와 통화하는 소리가 들립니다. '응, 나 맞아. 잘 나왔지.' 정정은 크레디트가 끝날 때까지 무릎에서 내려오지 않고, 제보 메일에는 읽음 표시만 남습니다.",
    c39_after_record: "보존 기록에는 잘린 20분의 원본과 '참고 의견'과 편집 이력이 한 폴더에 들어갑니다. 연태준이 '12분' 테이프를 그 폴더 옆에 둡니다.",
    c39_after_rush: "나서면 편집실의 떡은 식습니다. 자정의 합정역 7번 출구에 나타난 사람은 이름을 말하지 않고, 다음 약속 날짜만 남깁니다.",
    c39_route_system_publish: "게시판에 올리자 댓글이 서른 개 달립니다. 스물아홉 개가 '우리 팀도'로 시작합니다.",
    c39_route_system_insert: "마지막 자막이 통계가 되면 다큐는 이 다큐 자신에 대한 이야기로 끝납니다. 심의 담당이 그 한 장에도 밑줄을 긋습니다.",
    c39_route_system_drop: "편집은 빨라집니다. 스물세 편 옆에 한 편이 조용히 더해지고, 그 숫자를 세는 건 에코뿐입니다.",
    c39_final_system_route_a: "봉인하면 3년 뒤 누군가 이 20분을 봅니다. 그때 회장의 식탁에 앉아 있던 사람들이 어디 있을지는 아무도 모릅니다.",
    c39_final_system_route_b: "지우면 파일은 사라지고 방송본만 남습니다. 연태준의 서랍 속 테이프처럼, 이번엔 테이프조차 남지 않습니다.",
    c39_final_system_route_c: "기준을 만들면 다음 편집실은 이 밤을 처음부터 다시 겪지 않아도 됩니다. 기준에 서명할 방송국은 아직 한 곳뿐입니다.",
    c39_evidence_turn_air: "마지막 장면에 문서 속성 창이 3초 나갑니다. '작성자: KD금융그룹 회장실'. 그룹 홍보실은 방송 도중 입장문을 냅니다.",
    c39_evidence_turn_hold: "카드는 강합니다. 영업국은 20분 중 12분을 살려 주겠다고 합니다. 회장실이라는 말은 협상 테이블 밖으로 나가지 않습니다.",
    c39_evidence_turn_share: "제작진 전원이 알면 다음 반론용 사본에는 워터마크가 붙습니다. 오늘 밤의 20분은 그 워터마크보다 먼저 잘립니다.",
  },
  characterProfiles: {
    연태준: {
      role: "라온방송 시사제작국 책임 프로듀서 · 26년차",
      stance: "타협 · 기억 · 책임",
      job: "광고 철회와 방송 사이에서 20분을 자르라는 말을 전하는 사람. 11년 전 자기가 잘랐던 12분짜리 테이프를 아직 버리지 못했다.",
      appearance: "목이 늘어난 방송국 로고 티셔츠, 머리 위에 올려놓고 찾는 돋보기, 서랍 속 '12분'이라고만 적힌 테이프.",
      thought: "방송은 오늘 밤 나가야 한다. 다만 무엇을 잘랐는지는 누군가 기억해야 하고, 결정 문서의 책임자 칸은 비워 두지 않는다.",
      gesture: "연태준은 나쁜 소식을 전할 때 종이를 먼저 내려놓고, 두 손을 주머니에 넣는다.",
      voice: "반말과 존댓말을 섞어 짧게 말하고, 결론은 늘 마지막에 한 번만 말한다.",
      line: "자르라는 말은 아무도 안 했어. 20분이 정확히 적혀 있을 뿐이지.",
    },
    주하온: {
      role: "라온방송 편집 감독 · 9년차",
      stance: "속도 · 장면 · 농담",
      job: "90분을 70분으로 만드는 손. 무엇이 잘리는지 가장 먼저 알고, 그 장면의 이름을 가장 오래 기억한다.",
      appearance: "편집실 소파에 개어 둔 담요, 에너지 음료 캔으로 쌓은 탑, 양 손목의 보호대.",
      thought: "편집은 거짓말이 아니다. 무엇을 안 보여 줄지 고르는 일이라서 더 무섭다.",
      gesture: "주하온은 결정하기 전에 같은 장면을 세 번 돌려 보고, 세 번째에만 소리를 켠다.",
      voice: "파일 이름처럼 말한다. 짧고, 버전이 붙고, 가끔 끝에 '진짜최종'이 붙는다.",
      line: "이거 빼면 남는 얘기는 하나예요. 나쁜 사람 한 명이 있었다. 끝.",
    },
    은시온: {
      role: "라온방송 광고영업국 차장 · 광고 판매 담당",
      stance: "목표 · 계약 · 체면",
      job: "광고 14개가 빠진다는 통보를 제작국에 전한 사람. 악당이 아니라, 올해 목표의 31%를 한 그룹에 기대고 있고 자기도 점수로 채용된 사람.",
      appearance: "칼같이 다린 셔츠, 광고 판매표를 띄운 태블릿, 사원증 줄에 매단 작은 계산기.",
      thought: "광고가 방송을 산다고 생각해 본 적은 없다. 그런데 광고 없이 방송이 나간 적도 없다.",
      gesture: "은시온은 곤란한 질문을 받으면 태블릿 화면을 상대 쪽으로 돌려 숫자부터 보여 준다.",
      voice: "공손하고 빠르다. 숫자에서는 절대 틀리지 않고, 사람 얘기에서는 말끝을 흐린다.",
      line: "제가 파는 건 30초예요. 그 30초가 20분을 사 가는 줄은 몰랐어요.",
    },
  },
  setting: { place: "상암동 라온방송 · 3층 편집실", clock: "방송 하루 전 · 21:00 · 열대야" },
  sceneContext: {
    c39_start: {
      place: "상암동 라온방송 · 3층 편집실",
      clock: "방송 하루 전 · 21:00 · 열대야",
      question: "광고 14개가 빠지며 '참고 의견'에 정확히 20분이 적혀 왔습니다. 무엇부터 하겠습니까?",
      lead: "서하린의 문자 한 줄에 상암동까지 왔습니다. '오늘 밤 새워야 할 것 같아요. 칫솔 챙겨요.'",
    },
    c39_start_warm: {
      place: "상암동 라온방송 · 3층 편집실",
      clock: "방송 하루 전 · 21:00 · 열대야",
      question: "떡집에서 저녁을 함께한 원고들이 자기 얘기가 잘리냐고 묻습니다. 무엇부터 하겠습니까?",
      lead: "문가을이 싸 준 떡이 아직 따뜻하고, 택시 안에서 원고 단체방 알림이 쉬지 않습니다.",
    },
    c39_start_record: {
      place: "상암동 라온방송 · 3층 편집실",
      clock: "방송 하루 전 · 21:00 · 열대야",
      question: "당신이 정리한 방청 기록의 두 문장이 잘릴 20분 안에 있습니다. 그 문장을 어떻게 지키겠습니까?",
      lead: "편집실 화이트보드에 당신이 보낸 기록의 두 문장이 형광펜으로 칠해져 붙어 있습니다.",
    },
    c39_start_rush: {
      place: "상암동 라온방송 · 3층 편집실",
      clock: "방송 하루 전 · 21:00 · 열대야",
      question: "오후 법정의 그 변호사들이 다큐 사본을 가장 먼저 봤습니다. 어디서부터 캐겠습니까?",
      lead: "택시 트렁크에서 꺼낸 떡 상자를 편집실 구석에 내려놓자마자 서하린이 화이트보드를 가리킵니다.",
    },
    c39_cut: {
      place: "상암동 라온방송 · 3층 편집실",
      clock: "방송 하루 전 · 22:30 · 열대야",
      question: "빨간 20분을 빼면 회장의 이름이 한 번도 나오지 않습니다. 무엇을 자르겠습니까?",
      lead: "편집실 에어컨이 모니터 열기를 못 이겨 윙윙거리고, 타임라인 한가운데가 빨갛게 칠해져 있습니다.",
    },
    c39_branch_sales: {
      place: "상암동 라온방송 · 광고영업국 회의실",
      clock: "방송 하루 전 · 23:10",
      question: "20분이 빠지면 추석 광고 6칸이 더 온다고 합니다. 이 거래 앞에서 어떻게 하겠습니까?",
    },
    c39_branch_sales_follow: {
      place: "상암동 라온방송 · 광고영업국 회의실",
      clock: "방송 하루 전 · 23:40",
      question: "광고를 파는 사람도 핏스코어 점수로 채용됐습니다. 그의 88점을 어떻게 다루겠습니까?",
    },
    c39_door: {
      place: "상암동 라온방송 · 3층 복도 끝 문",
      clock: "방송 하루 전 · 23:50",
      question: "11년 전 12분을 자른 사람이 20분이냐 사람이냐고 묻습니다. 무엇이라 답하겠습니까?",
    },
    c39_door_reaction: {
      place: "상암동 라온방송 · 영상 자료실",
      clock: "방송 당일 · 00:20",
      question: "잘린 분량이 아무도 안 트는 테이프가 되지 않게 할 방법이 있냐고 묻습니다. 어떻게 하겠습니까?",
    },
    c39_mosaic: {
      place: "상암동 라온방송 · 방송국 B스튜디오",
      clock: "방송 당일 · 새벽 01:30",
      question: "얼굴을 드러내겠다는 세 사람과 가리라는 기준이 부딪칩니다. 모자이크를 누가 정하게 하겠습니까?",
      lead: "불 꺼진 스튜디오 한가운데, 조명 하나 아래 모니터 속 세 얼굴 위로 네모가 올라갔다 내려갑니다.",
    },
    c39_cakes: {
      place: "상암동 라온방송 · 3층 편집실",
      clock: "방송 당일 · 새벽 03:00",
      question: "장례식 뒤 처음 움직이는 남편을 본 문가을이 몇 초 나가냐고 묻습니다. 어떻게 답하겠습니까?",
    },
    c39_cakes_reaction: {
      place: "상암동 라온방송 · 1층 로비",
      clock: "방송 당일 · 새벽 03:40",
      question: "하준의 그림 속 마지막 네모가 아직 비어 있습니다. 그 칸을 어떻게 하겠습니까?",
    },
    c39_caption: {
      place: "상암동 라온방송 · 3층 편집실",
      clock: "방송 당일 · 새벽 04:40",
      question: "고양이가 채운 승인자 칸을 다시 비우자 심의 담당이 그 빈칸을 고치라고 합니다. 어떻게 하겠습니까?",
      lead: "에너지 음료 캔 탑이 한 층 더 높아졌고, 이동장 문이 반쯤 열려 있습니다.",
    },
    c39_court: {
      place: "상암동 라온방송 · 옥상",
      clock: "방송 당일 · 새벽 06:10",
      question: "법정에서 익명 증언자를 부르면 이기고 그들은 끝납니다. 어떻게 싸우겠습니까?",
    },
    c39_court_reaction: {
      place: "상암동 라온방송 · 시사제작국 회의실",
      clock: "방송 당일 · 07:30",
      question: "책임자 칸을 이미 채운 연태준이 이번엔 뭘 같이 적겠냐고 묻습니다. 무엇을 적겠습니까?",
    },
    c39_route_system: {
      place: "상암동 라온방송 · 3층 편집실 · 에코 단말",
      clock: "방송 하루 전 · 22:10",
      question: "광고 철회 뒤 잘린 대목은 대부분 구조를 설명하는 부분이었습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c39_final_system_route: {
      place: "상암동 라온방송 · 3층 편집실 · 에코 단말",
      clock: "방송 당일 · 새벽 05:00",
      question: "잘린 분량이 어디로 가는지 정할 수 있다면, 어디로 보내겠습니까?",
    },
    c39_evidence_turn: {
      place: "상암동 라온방송 · 영상 자료실",
      clock: "방송 당일 · 08:10",
      question: "20분을 표시한 문서가 반론용 사본으로 회장실에서 만들어졌습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c39_final: {
      place: "상암동 라온방송 · 방송국 주조정실",
      clock: "납품 마감 · 방송 당일 09:40",
      question: "70분과 90분, 두 개의 외장 하드가 책상 위에 있습니다. 어느 쪽을 넘기겠습니까?",
      lead: "밤을 새운 사람들이 유리문 앞에 줄지어 서 있고, 서하린은 녹음 버튼을 켠 채입니다.",
    },
    c39_aftershock: {
      place: "상암동 라온방송 · 3층 편집실",
      clock: "방송 당일 · 22:00 · 열대야",
      question: "방송 40분째 회장실 비서팀 출신이라는 제보가 자정 약속을 청합니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c39-reply-copy",
    title: "반론용 사본",
    text: "광고 철회와 함께 온 '참고 의견'은 그룹이 반론을 준비하라고 받은 다큐 사본으로 만들어졌습니다. 문서 작성자 칸에는 KD금융그룹 회장실이 적혀 있었습니다.",
  },
  outcomes: {
    c39_after_warm: { tag: "끝까지 지킨 결말", title: "마지막 자막이 올라갈 때까지 편집실을 지켰다", text: "방송이 끝난 밤, 인터뷰이들은 떡을 나누며 자기 얼굴이 나온 장면을 서로 돌려 봤습니다. 정정은 그 밤 내내 당신 무릎에서 잤습니다." },
    c39_after_record: { tag: "원본을 남긴 결말", title: "잘린 20분이 원본 그대로 기록으로 묶였다", text: "잘린 20분의 원본과 '참고 의견'과 편집 이력이 한 폴더에 묶였습니다. 연태준의 '12분' 테이프가 그 폴더 옆에 나란히 꽂혔습니다." },
    c39_after_rush: { tag: "먼저 떠난 결말", title: "크레디트가 오르기 전에 제보자를 만나러 나갔다", text: "방송이 끝나기도 전에 편집실을 나섰습니다. 합정역 7번 출구의 제보자는 이름 대신 다음 약속만 남겼습니다." },
  },
  carryovers: {
    c39_after_warm: { trust: 9, humanCost: -4, fatigue: -8 },
    c39_after_record: { legitimacy: 12, trust: 3, fatigue: 5 },
    c39_after_rush: { capital: 6, legitimacy: 5, trust: -7 },
  },
  continuityChallenges: {
    c38_after_warm: { id: "protect-trust", title: "떡집의 원고들과 같이 보기", text: "첫 변론이 끝난 밤 저녁을 함께한 원고들이 이번엔 화면 속에 있습니다. 그들의 분량과 얼굴을 그들과 함께 정하는 선택을 찾아야 보너스가 열립니다." },
    c38_after_record: { id: "use-reframe", title: "방청 기록의 두 문장 되살리기", text: "당신이 원고들에게 보낸 방청 기록의 두 문장이 잘릴 20분 안에 있습니다. 잘리는 분량을 사라지지 않는 기록으로 바꾸도록 판을 다시 짜야 합니다." },
    c38_after_rush: { id: "repair-legitimacy", title: "먼저 온 사람의 공정함 회복하기", text: "법원 앞 사람들을 두고 먼저 편집실에 왔습니다. 이번에는 누가 무엇을 자르라 했는지 절차로 남기는 선택을 찾아야 합니다." },
  },
};
