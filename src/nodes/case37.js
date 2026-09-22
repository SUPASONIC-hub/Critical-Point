/**
 * CASE 37 -- the night the records got out.
 *
 * Act 7 opens here. Three hours after the chairman's table in 한남동, in the
 * worst 열대야 of the summer, the whole of the lab's reaction records -- 38만
 * lines, thirteen participants, every choice with the seconds of hesitation
 * next to it -- lands on an anonymous board as TL_full.zip. The records the
 * season has argued over since 사건 20 are no longer a line in a training list;
 * they are a ranking on a mirror site, a graph in a newspaper and a comment
 * under a bank teller's name.
 *
 * The case is about who a record belongs to once everyone can read it. 이민서
 * sends deletion requests all night and is named as the leaker for the second
 * time in her life. The team reads its own lines out loud in the second-hand
 * bookshop -- 오진우 is proud of his top-1% decision speed until 권도현 reads the
 * next column. 한서윤 finds the analyst's own line: zero seconds of hesitation
 * on the 2023-0412 dissent, filed as "hard to control", which is why the next
 * three years were made harder. 선우진 calls from 제주: his collapse is in the
 * file as "effect confirmed", and he wants his line kept, under his own name.
 *
 * 에코 is gone (사건 20), so the hidden route is answered by 노아, which reports
 * that the file is already being used to score job applicants -- the seed of
 * 사건 40. The evidence turn shows the "hack" was sorted: the file was built on
 * a 핏스코어 demo account the group strategy office opened the day the
 * dinner invitation went out, and built while the chairman was serving dinner, with the witnesses for next week's class action at the top.
 * The final offer is the group's: it will pay to erase everyone's records if
 * they sign that the records are distorted -- which would also erase them as
 * evidence. The aftermath hands the season to 사건 38 and 1,740 plaintiffs.
 */
export const case37Nodes = {
  c37_start: {
    phase: "CASE 37 BRIEFING",
    title: "TL_full.zip",
    speaker: "이민서",
    text:
      "7월 27일 월요일 새벽 두 시, 한남동 식탁에서 돌아온 지 세 시간입니다. 열대야에 잠들지 못한 채 다시 받은 이민서의 전화 목소리가 떨립니다. '아까 말씀드린 그 폴더요, 이제 전부 풀렸어요. 익명 커뮤니티 노바운드에 TL_full.zip이라는 이름으로요. 트리거랩 반응 기록 전체예요.' 38만 줄, 참가자 열세 명. 가명 처리(누구인지 바로 알 수 없게 이름을 지운 것)가 되어 있지만 2023-0412에 반대 의견을 쓴 '분석관 A'가 누구인지 모르는 사람은 없습니다. 당신이 선택마다 망설인 초가 날짜와 시각까지 붙어 있습니다. 처음 올라온 지 세 시간, 조회 수는 벌써 11만입니다. 이민서가 숨을 고릅니다. '지금 삭제 요청 쓰고 있어요. 근데 복사본이 제가 쓰는 것보다 빨리 생겨요. 어디부터 막아요?'",
    memo: [
      "파일명 TL_full.zip -- 38만 줄, 참가자 13명",
      "첫 게시 세 시간 만에 조회 11만",
      "분석관 A: 선택마다 망설인 초와 시각",
      "그룹 공식 입장: 아직 없음",
    ],
    triggers: ["fear", "injustice", "protection"],
    choices: [
      {
        id: "c37_start_call",
        label: "파일을 열기 전에 기록 속 동료들에게 먼저 전화를 돌린다",
        effect: { trust: 11, humanCost: -5, time: -5, capital: -2, fatigue: 4 },
        next: "c37_takedown",
        cognition: { persistence: 2 },
      },
      {
        id: "c37_start_verify",
        label: "원본 사본과 한 줄씩 대조해 진짜인지부터 확인한다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 3, capital: -1, fatigue: 2 },
        next: "c37_takedown",
        cognition: { inference: 2 },
      },
      {
        id: "c37_start_report",
        label: "게시판 운영자에게 곧장 삭제 요청부터 넣는다",
        effect: { time: 5, capital: 7, legitimacy: -4, trust: -2, humanCost: 3, fatigue: 1 },
        next: "c37_takedown",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c37_takedown",
      },
    ],
  },
  c37_takedown: {
    phase: "TAKEDOWN",
    title: "삭제 요청 1,204건",
    speaker: "이민서",
    text:
      "새벽 세 시 40분, 회기동 헌책방 1층. 책장 사이 접이식 테이블에 노트북 세 대가 켜져 있고, 선풍기는 더운 바람만 돌립니다. 이민서가 보낸 삭제 요청이 1,204건째입니다. 사이트 대부분이 같은 답을 보내옵니다. '정보 주체(기록 속 당사자 본인)가 직접 요청해야 처리할 수 있습니다.' 열세 명 중 연락이 닿는 사람은 아홉, 1기 참가자 넷 중 셋은 번호조차 모릅니다. 그때 문이 열리고 강태민이 수박 한 통을 안고 들어옵니다. 칼이 없다며 주먹으로 쪼개더니 '반은 맞게 갈라졌어요' 합니다. 영상통화 너머 나준혁은 '인터넷에는 도장 찍는 데가 없나' 하고 진지하게 묻습니다. 웃음이 잦아들자 이민서가 화면을 돌립니다. '이름을 걸어야 지워진대요. 근데 이름을 걸면, 그 사람이 분석관 몇 번인지 제가 밝히는 거예요.'",
    memo: [
      "삭제 요청 1,204건 -- 처리 완료 37건",
      "처리 조건: 당사자 본인 요청",
      "연락 가능 9명, 1기 참가자 3명 연락처 없음",
      "복사본 증가 속도: 한 시간에 40곳",
    ],
    triggers: ["protection", "helplessness", "order"],
    choices: [
      {
        id: "c37_takedown_consent",
        label: "열세 명 모두에게 연락해 이름을 걸지 직접 묻는다",
        effect: { trust: 12, humanCost: -5, time: -5, capital: -2, fatigue: 5 },
        next: "c37_reading",
        cognition: { persistence: 2 },
      },
      {
        id: "c37_takedown_file",
        label: "개인정보보호위원회에 유출 신고부터 공식 접수한다",
        effect: { legitimacy: 12, trust: 2, time: -5, humanCost: 3, capital: -1, fatigue: 3 },
        next: "c37_reading",
        cognition: { inference: 2 },
      },
      {
        id: "c37_takedown_bulk",
        label: "당사자 확인은 미루고 내 이름으로 일괄 삭제를 요청한다",
        effect: { time: 6, capital: 5, trust: -5, legitimacy: -3, humanCost: 4, fatigue: -3 },
        next: "c37_reading",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c37_reading",
      },
    ],
  },
  c37_reading: {
    phase: "OPEN RECORDS",
    title: "상위 1%",
    speaker: "오진우",
    text:
      "그날 밤 아홉 명이 헌책방 1층에 다시 모입니다. 누구도 자기 줄을 찾자고 하지 않았는데, 모두 이미 찾아 두었습니다. 오진우가 먼저 휴대폰을 듭니다. '저 결정 속도 상위 1%입니다. 전체 1위요.' 권도현이 옆 칸을 소리 내어 읽습니다. '번복률도 상위 1%군요.' 책장이 흔들릴 만큼 웃음이 터지고, 오진우는 '빨리 고치는 것도 실력'이라며 끝까지 우깁니다. 도윤하의 7.2초, 반재욱의 '규정 확인 후 선택' 312회가 차례로 읽힙니다. 그때 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치) 중인 한서윤이 도시락 가방을 든 채 당신의 줄을 내밉니다. '2023-0412 반대 의견 작성: 망설임 0.0초. 판정: 통제 곤란. 조치: 압박 강도 상향.' 한서윤이 목소리를 낮춥니다. '당신이 안 망설여서, 그다음 3년이 이렇게 된 거예요.' 인터넷의 제목은 정반대입니다. 「반대 의견 쓴 분석관, 알고 보니 결정 회피형」.",
    memo: [
      "오진우: 결정 속도 1위, 번복률 1위",
      "분석관 A: 반대 의견 망설임 0.0초 -- '통제 곤란'",
      "이후 3년 평균 망설임 11.4초 -- 기사 제목에 인용",
      "한서윤 도시락: 김밥 아홉 줄",
    ],
    triggers: ["selfAwareness", "injustice", "affection"],
    choices: [
      {
        id: "c37_reading_own",
        label: "분석관 A는 나라고 실명으로 먼저 밝힌다",
        effect: { trust: 12, humanCost: -4, legitimacy: 2, time: -4, capital: -3, fatigue: 5 },
        next: "c37_source",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c37_reading_claim",
        label: "판정 칸을 누가 썼는지 원본 열람을 공식 청구한다",
        effect: { legitimacy: 12, time: -6, trust: -2, humanCost: 3, fatigue: 4 },
        next: "c37_source",
        cognition: { inference: 2 },
      },
      {
        id: "c37_reading_quiet",
        label: "실명은 숨기고 오늘 밤은 각자 흩어져 쉬게 한다",
        effect: { time: 5, capital: 4, trust: 2, legitimacy: -4, humanCost: 4, fatigue: -5 },
        next: "c37_source",
        cognition: { risk: 1, reframing: 1 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c37_source",
      },
    ],
  },
  c37_source: {
    phase: "PROSECUTION",
    title: "봉인은 그대로였다",
    speaker: "나은호",
    text:
      "서울중앙지검 11층 면담실은 절전 규정 때문에 에어컨이 28도에 묶여 있습니다. 나은호 검사가 넥타이를 풀고 아이스크림 포장을 뜯으며 말합니다. '미리 말씀드리죠. 저희 쪽 아닙니다. 압수한 상자는 업로드 시각에 봉인 그대로였어요. 테이프 사진까지 있습니다.' 그가 서류 한 장을 밉니다. 당신을 참고인(수사에 도움이 될 사실을 말하러 나온 사람)으로 적은 진술 확인서입니다. '유출본이 원본과 같다고 확인만 해 주시면 이 파일을 수사 증거로 씁니다. 대신 당신의 0.0초도, 그 뒤 3년의 망설임도 법정에서 소리 내어 읽힙니다. 다른 열두 명 것도요.' 아이스크림이 녹아 그의 손목으로 흐릅니다. 그는 닦지 않습니다. '빨리 정하세요. 제가 무례한 건 시간이 없어서입니다.'",
    memo: [
      "압수 상자: 업로드 시각에 봉인 유지 -- 사진 확보",
      "요청: 유출본과 원본이 같다는 진술 확인서",
      "확인 시 13명의 기록 전체가 법정 증거가 됨",
      "면담실 온도 28도",
    ],
    triggers: ["choice", "system", "protection"],
    choices: [
      {
        id: "c37_source_protect",
        label: "열세 명의 동의 없이는 확인서를 쓰지 않겠다고 한다",
        effect: { trust: 11, humanCost: -5, legitimacy: -2, time: -4, capital: -3, fatigue: 5 },
        next: "c37_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c37_source_sign",
        label: "원본과 같다고 확인하되 유출 수사를 조건으로 건다",
        effect: { legitimacy: 12, trust: 3, time: -5, humanCost: 4, fatigue: 5 },
        next: "c37_final",
        cognition: { inference: 2, reframing: 1 },
      },
      {
        id: "c37_source_silent",
        label: "확인도 부인도 하지 않고 면담을 짧게 끝낸다",
        effect: { time: 6, capital: 4, trust: 2, legitimacy: -4, humanCost: 3, fatigue: -4 },
        next: "c37_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c37_final",
      },
    ],
  },
  c37_final: {
    phase: "FINAL DECISION",
    title: "지워 드리는 값",
    speaker: "도건우",
    text:
      "7월 29일 오전 열 시, 여의도 KD금융그룹 본사 위기대응 회의실. 그룹이 드디어 입장문을 냈습니다. '외부 해킹으로 인한 유출, 당사도 피해자입니다.' 위기대응TF 팀장 도건우가 두 장짜리 제안서를 가지런히 놓습니다. 그룹 돈으로 디지털 장의사(인터넷에 퍼진 기록을 돈 받고 찾아 지워 주는 업체)를 붙여 열세 명의 기록을 일주일 안에 지워 주겠다는 제안입니다. 1인당 2천만 원어치입니다. 조건은 둘째 장에 있습니다. '유출 자료는 편집·왜곡된 비공식 자료로 사실과 다르다'는 확인서. 서명하면 원본의 증거능력(법정에서 증거로 쓸 수 있는 자격)까지 흔들립니다. 다음 주 첫 변론(법정에서 양쪽이 주장과 증거를 내는 절차)이 열리는 집단소송(피해자 여럿이 함께 내는 소송)에서도요. 도건우가 공손하게 웃습니다. '지워 드리는 겁니다. 다들 그걸 원하시잖아요.' 휴대폰에 도윤하의 문자가 와 있습니다. '제 건 지우고 싶어요. 미안해요.'",
    memo: [
      "제안: 그룹 비용으로 13명 기록 삭제 -- 1인 2천만 원",
      "조건: '편집·왜곡된 비공식 자료' 확인서 서명",
      "서명 시 원본의 증거 가치 훼손 -- 첫 변론 8월 6일",
      "선우진: 남기고 싶다 / 도윤하: 지우고 싶다",
    ],
    triggers: ["choice", "manipulation", "protection"],
    choices: [
      {
        id: "c37_final_choose",
        label: "확인서는 거부하고 열세 명이 각자 지울지 남길지 정하게 한다",
        effect: { trust: 12, humanCost: -5, legitimacy: 4, capital: -8, time: -5, fatigue: 5 },
        next: "case37_result",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c37_final_seal",
        label: "원본은 법원에 봉인하고 퍼진 사본만 공식 절차로 지운다",
        effect: { legitimacy: 13, trust: 5, capital: -5, time: -7, humanCost: 3, fatigue: 6 },
        next: "case37_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c37_final_sign",
        label: "확인서에 서명하고 그룹 돈으로 오늘 밤 전부 지운다",
        effect: { capital: 11, time: 6, trust: 3, legitimacy: -8, humanCost: 5, fatigue: 2 },
        next: "case37_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case37_result",
      },
    ],
  },
};

/**
 * Everything else case 37 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case37 = {
  id: "case37",
  nodes: case37Nodes,
  aftermath: {
    c37_aftershock: {
      phase: "AFTERMATH",
      title: "4,871번째 요청",
      speaker: "이민서",
      text: "7월 30일 새벽 다섯 시, 열대야가 겨우 물러난 헌책방 1층. 선풍기 두 대가 꺼지고 수박 껍질이 쟁반 가득 쌓였습니다. 사흘 동안 열세 명의 단체방에 올라온 메시지는 2,300개입니다. 선우진이 방금 사진 한 장을 보냅니다. 구좌 바다 위로 해가 뜨고, 느린섬 방명록에 새 글이 보입니다. '7월 28일, 저도 그날 쓰러졌어요.' 이민서가 노트북을 덮으며 마지막 삭제 요청의 번호를 말합니다. 4,871번. 강태민은 코를 골고, 오진우는 자면서도 '상위 1%'라고 중얼거립니다. 그때 문가을의 문자가 옵니다. '원고 명단 확정됐어요. 1,740명. 첫 변론 8월 6일이래요. 그쪽 변호사가 여덟 명이라던데, 떡은 몇 명분 해 가요?'",
      memo: ["삭제 요청 4,871건 -- 사흘", "13명 단체방 메시지 2,300개", "원고 1,740명 확정, 첫 변론 8월 6일", "그룹 측 대리인 8명 선임"],
      triggers: ["affection", "responsibility", "choice"],
      choices: [
        { id: "c37_after_warm", label: "먼저 가는 사람 없이 서로의 기록을 끝까지 같이 읽는다", effect: { trust: 12, humanCost: -5, time: -3, capital: -3, fatigue: -7 }, next: "case37_result", cognition: { reframing: 2 } },
        { id: "c37_after_record", label: "삭제 요청서와 유출 경위 규명 요청서를 공문으로 남긴다", effect: { legitimacy: 14, trust: 3, time: -5, capital: -2, fatigue: 4 }, next: "case37_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c37_after_rush", label: "유출 파일이 어디서 먼저 돌았는지 곧장 흔적을 쫓는다", effect: { capital: 7, legitimacy: 5, trust: -6, humanCost: 5, fatigue: 6 }, next: "case37_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c37_final", "c37_aftershock"],
  connectiveScenes: [
    ["c37_mirror", "c37_takedown", "c37_reading", "순위표", "류세아", "새벽 다섯 시 10분, 류세아가 전화를 겁니다. 목에 건 라벨 프린터가 딸깍거리는 소리가 들립니다. '누가 미러 사이트(원본을 그대로 복제해 다른 주소에 띄운 사이트)를 만들었어요. 그냥 복제가 아니에요. 순위표가 붙었어요.' '망설임 순위', '결정 속도 순위', 그리고 '가장 먼저 무너진 분석관' 투표. 1위는 참가자 01, 선우진입니다. 투표 수 8천. 류세아가 한참 말이 없다가 덧붙입니다. '저 라벨 붙이는 거 좋아하잖아요. 근데 사람한테 이런 라벨을 붙이는 건 처음 봐요.'", ["미러 사이트 순위표 3종 -- 투표 기능 포함", "'가장 먼저 무너진 분석관' 1위: 참가자 01", "선우진은 아직 이 사이트를 모름"], ["순위표에 오른 사람들에게 먼저 알리고 대응을 같이 정한다", "미러 사이트의 서버 위치와 운영자를 기록으로 추적한다", "순위표는 무시하고 원본 파일 삭제에만 집중한다"]],
    ["c37_comments", "c37_reading", "c37_source", "7초는 생각하는 시간", "도윤하", "다음 날 아침, 도윤하는 강서지점 창구에 그대로 앉습니다. 번호표 12번 손님이 통장을 내밀다 말고 휴대폰을 봅니다. 기사 밑 댓글은 3만 개를 넘었습니다. '7초나 망설이는 사람한테 내 돈을 맡기라고?' 그때 객장 의자에서 이정숙이 일어섭니다. 펀드 설명을 받아쓰기하듯 적던 72세 전직 교사입니다. 그가 번호표 뒷면에 또박또박 씁니다. '7초는 생각하는 시간.' 그리고 댓글 하나를 가리킵니다. '이 기록으로 사람 뽑는 회사가 있대요. 저 면접 떨어진 게 이거예요?' 도윤하가 처음으로 창구 마이크를 끕니다.", ["기사 댓글 3만 2천 개", "이정숙의 번호표 뒷면: '7초는 생각하는 시간'", "채용 탈락자 댓글: '이 기록으로 뽑는 회사'"], ["이정숙과 함께 객장 손님들에게 7초의 뜻을 직접 설명한다", "악성 댓글을 날짜별로 모아 법적 대응 자료로 정리한다", "도윤하를 오늘 창구에서 빼고 댓글은 보지 말자고 한다"]],
    ["c37_island", "c37_source", "c37_final", "효과 확인", "선우진", "밤 열 시, 검찰청 앞 골목을 걷는데 제주 번호로 전화가 옵니다. 선우진입니다. 말 사이가 여전히 깁니다. '제 거... 봤어요. 2022년 7월 28일, 새벽 3시 2분. 참가자 01 이탈. 압박 2단계 상향의 효과 확인.' 파도 소리가 들립니다. '효과 확인이래요. 제가 쓰러진 게요.' 한참 뒤 그가 웃습니다. '근데 이상하게... 좀 가벼워요. 약해서가 아니었네요.' 오늘 손님 하나가 방명록에 적고 갔답니다. '사장님, 저도 그날 회사에서 쓰러졌어요.' 선우진이 천천히 말합니다. '제 줄은 지우지 마세요. 남기고 싶어요. 대신 제 이름으로요.'", ["참가자 01: 2022-07-28 03:02 '이탈 -- 효과 확인'", "느린섬 방명록: 같은 날 쓰러진 손님", "선우진의 뜻: 삭제 말고 실명으로 남기기"], ["선우진의 뜻대로 그의 줄을 실명으로 남기는 방법을 찾는다", "남기더라도 법원 증거로만 쓰이게 봉인 절차를 밟자고 한다", "지금은 마음이 흔들릴 때라며 결정을 며칠 미루자고 한다"]],
  ],
  connectiveOrder: [["c37_takedown", "c37_mirror"], ["c37_reading", "c37_comments"], ["c37_source", "c37_island"]],
  choiceEffects: {
    c37_takedown: [
      { trust: 11, humanCost: -5, legitimacy: 3, time: -4, capital: -2, fatigue: 3 },
      { legitimacy: 9, trust: 3, time: -4, humanCost: 3, fatigue: 4 },
      { time: 5, capital: 3, trust: -4, humanCost: 4, legitimacy: 1, fatigue: -3 },
    ],
    c37_reading: [
      { trust: 10, humanCost: -4, legitimacy: 3, time: -3, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -4, humanCost: 2, fatigue: 4 },
      { time: 4, capital: 3, trust: 2, humanCost: 4, fatigue: -4 },
    ],
    c37_source: [
      { trust: 11, humanCost: -4, legitimacy: 2, capital: -3, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 4, time: -4, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 3, trust: -3, humanCost: 3, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c37_takedown: {
      voice: ["순위표에 오른 사람들에게 먼저 알리고, 대응을 같이 정하자고 한다.", "미러 사이트의 서버 위치와 운영자를, 기록으로 추적한다.", "순위표는 무시하고, 원본 파일 삭제에만 집중하자고 한다."],
      echo: ["알리면 선우진이 새벽에 순위표를 봅니다. 모르고 자는 밤 하나가 사라집니다.", "서버는 해외에 있고 운영자는 가명입니다. 추적 기록은 쌓이고, 투표 수도 함께 쌓입니다.", "원본은 줄어듭니다. 순위표는 원본이 없어도 혼자 살아남습니다."],
    },
    c37_reading: {
      voice: ["이정숙과 함께, 객장 손님들에게 7초의 뜻을 직접 설명한다.", "악성 댓글을 날짜별로 모아, 법적 대응 자료로 정리한다.", "도윤하를 오늘 창구에서 빼고, 댓글은 보지 말자고 한다."],
      echo: ["설명을 들은 손님 몇이 도윤하 창구에 다시 줄을 섭니다. 대기 시간은 그만큼 길어집니다.", "자료는 두꺼워집니다. 도윤하는 정리하는 동안 댓글 3만 개를 한 번씩 다 읽게 됩니다.", "창구는 조용해집니다. 도윤하는 휴게실에서 결국 댓글을 엽니다."],
    },
    c37_source: {
      voice: ["선우진의 뜻대로, 그의 줄을 실명으로 남기는 방법을 찾는다.", "남기더라도 법원 증거로만 쓰이게, 봉인 절차를 밟자고 한다.", "지금은 마음이 흔들릴 때라며, 결정을 며칠 미루자고 한다."],
      echo: ["실명이 붙으면 그 줄은 더는 순위표의 1위가 아닙니다. 선우진이라는 사람의 기록이 됩니다. 그리고 느린섬의 주소도 함께 알려집니다.", "봉인하면 그 줄은 안전해집니다. 선우진이 원한 건 안전보다 이름이었습니다.", "며칠 뒤 선우진은 같은 말을 합니다. 그사이 순위표의 투표 수가 두 배가 됩니다."],
    },
  },
  reactionScenes: [
    ["c37_mirror_reaction", "c37_mirror", "c37_reading", "9시 엠바고", "서하린", "아침 여섯 시 반, 서하린이 편집국에서 전화합니다. 뒤에서 편집국 고양이 정정이 키보드 위를 걷는 소리가 납니다. '우리한테도 파일이 왔어요. 제보 메일로요. 보낸 사람은 없고요.' 리드라인은 유출 경위 기사를 준비 중이고, 엠바고(보도 시점을 약속해 미루는 것)는 오늘 아침 9시입니다. 서하린이 녹음 버튼을 확인하고 묻습니다. '다른 매체는 벌써 분석관 A의 망설임을 그래프로 그리고 있어요. 우리가 안 쓰면 그 그래프가 기사가 돼요. 당신 이름, 어떻게 할까요?'", ["기록 속 사람 이름은 한 글자도 쓰지 말아 달라고 부탁한다", "유출 경위를 먼저 쓰고 기록 내용은 빼 달라고 정식 요청한다", "어차피 퍼질 거라면 먼저 제대로 쓰라고 한다"]],
    ["c37_comments_reaction", "c37_comments", "c37_source", "쓰기 좋은 쪽", "오진우", "점심시간, 오진우가 브릿지은행 로비 계단에 앉아 있습니다. 어제는 상위 1%를 자랑하던 사람이 오늘은 원본의 비고 칸을 봤습니다. '보상 자극에 과반응. 승진 약속으로 통제 가능.' 그가 웃습니다. '저 여기서도 이기는 쪽이었네요. 아니, 이긴 게 아니라 쓰기 좋은 쪽이었던 거죠.' 휴대폰이 울립니다. 아버지 오상철의 문자입니다. '그래도 1등이라며. 밥은 먹었냐.' 오진우가 화면을 한참 보다가 엎어 둡니다. '아버지는 이게 칭찬인 줄 아세요. 저도 어제까지 그랬고요.'", ["그 메모는 네가 아니라 쓴 사람의 기록이라고 오진우에게 말해 준다", "메모를 쓴 사람의 이름을 원본에서 찾아 적어 둔다", "오늘은 농담으로 넘기고 오진우를 일터로 돌려보낸다"]],
    ["c37_island_reaction", "c37_island", "c37_final", "승인 HS", "한서윤", "자정 가까이 한서윤이 아파트 옥상으로 불러냅니다. 대기발령 석 달째, 그는 매일 도시락을 싸서 헌책방에 두고 돌아갔습니다. 그가 휴대폰을 내밉니다. 반응 기록 속 한서윤은 참가자가 아니라 '관찰자 HS'입니다. '분석관 A · 압박 강도 상향 · 승인 HS.' 날짜는 당신이 트리거랩에 내려온 첫 주입니다. '저 이 칸에 서명했어요. 첫 장만 읽고요. 당신 반대 의견을 반려할 때처럼요.' 그가 난간을 잡습니다. '사과하고 싶어요. 근데 제 사과가 또 누군가의 기사 제목이 될까 봐 무서워요.'", ["한서윤이 열세 명 앞에서 직접 말할 수 있게 자리를 만든다", "사과보다 먼저 승인 기록을 검찰 진술로 남기게 한다", "지금 사과하면 그룹이 이용한다며 한서윤을 말린다"]],
  ],
  reactionEffects: {
    c37_mirror: [
      { trust: 10, humanCost: -4, capital: -3, time: -2, fatigue: 4 },
      { legitimacy: 8, trust: 3, time: -3, humanCost: 2, capital: -1, fatigue: 2 },
      { time: 4, capital: 4, legitimacy: 3, trust: -4, humanCost: 4, fatigue: -3 },
    ],
    c37_comments: [
      { trust: 9, humanCost: -4, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 9, trust: 2, time: -4, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 2, trust: 3, humanCost: 3, legitimacy: -2, fatigue: -3 },
    ],
    c37_island: [
      { trust: 10, humanCost: -4, time: -3, capital: -1, fatigue: 4 },
      { legitimacy: 10, trust: 2, capital: -2, time: -3, humanCost: 3, fatigue: 3 },
      { time: 4, capital: 3, trust: 2, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c37_mirror: {
      voice: ["기록 속 사람 이름은, 한 글자도 쓰지 말아 달라고 부탁한다.", "유출 경위를 먼저 쓰고, 기록 내용은 빼 달라고 정식 요청한다.", "어차피 퍼질 거라면, 먼저 제대로 쓰라고 한다."],
      echo: ["서하린이 이름을 지웁니다. 9시에 나간 기사는 조용하고, 다른 매체의 그래프가 검색 첫 줄을 차지합니다.", "요청서가 편집회의에 올라갑니다. 기사는 한 시간 늦게 나가고, 그 한 시간 동안 그래프가 세 개 더 생깁니다.", "리드라인의 기사가 가장 정확한 기사가 됩니다. 가장 정확한 기사에도 당신의 0.0초가 들어갑니다."],
    },
    c37_comments: {
      voice: ["그 메모는 네가 아니라 쓴 사람의 기록이라고, 오진우에게 말해 준다.", "메모를 쓴 사람의 이름을, 원본에서 찾아 적어 둔다.", "오늘은 농담으로 넘기고, 오진우를 일터로 돌려보낸다."],
      echo: ["오진우가 한참 있다가 고개를 끄덕입니다. 그리고 아버지 문자에 처음으로 답장을 씁니다. '밥 먹었어요.'", "비고 칸 작성자 코드는 'GS-07'입니다. 그룹전략실의 일곱 번째 계정입니다. 오진우는 그 코드를 휴대폰 메모에 저장합니다.", "오진우는 웃으며 로비로 돌아갑니다. 오후 회의에서 그는 평소보다 세 배 빨리 결정합니다."],
    },
    c37_island: {
      voice: ["한서윤이 열세 명 앞에서, 직접 말할 수 있게 자리를 만든다.", "사과보다 먼저, 승인 기록을 검찰 진술로 남기게 한다.", "지금 사과하면 그룹이 이용한다며, 한서윤을 말린다."],
      echo: ["단체방에 한서윤의 긴 글이 올라옵니다. 첫 답장은 선우진입니다. '천천히 읽을게요.'", "진술서의 한 줄은 법정에서 오래 남습니다. 사과는 그 뒤로 미뤄집니다.", "말리면 한서윤은 도시락 가방을 들고 돌아갑니다. 그 사과는 아무 제목도 되지 않고, 아무에게도 닿지 않습니다."],
    },
  },
  reactionMemos: {
    c37_mirror_reaction: ["제보자 없는 제보 메일", "그래프가 된 0.0초"],
    c37_comments_reaction: ["보상 자극에 과반응", "밥은 먹었냐는 1등의 아버지"],
    c37_island_reaction: ["관찰자 HS의 승인 칸", "기사 제목이 될까 무서운 사과"],
  },
  branchPlan: ["c37_takedown", 0, "c37_branch_rooftop", "c37_branch_rooftop_follow"],
  branchScenes: {
    // CASE 37's detour is 이민서's rooftop. The case asks who a leaked record
    // belongs to; the side door is the one person the internet has already
    // decided leaked it -- for the second time in her life.
    c37_branch_rooftop: {
      phase: "SIDE DOOR",
      title: "또 L씨",
      speaker: "이민서",
      text: "새벽 네 시 반, 잠깐 집에 다녀오겠다던 이민서가 20분 만에 전화를 겁니다. 옥탑방 옥상입니다. 커뮤니티에 새 글이 올라왔습니다. '유출자 특정: KD데이터랩 계약직 출신 L씨.' 댓글에는 3년 전 사건 기사까지 붙어 있습니다. 대학 신입생이 된 동생 이서준이 계단 아래에서 문자를 보냅니다. '누나, 대문 앞에 기자 두 명.' 이민서가 웃으려다 맙니다. '3년 전엔 11초였는데, 이번엔 38만 줄이네요. 저는 늘 지목하기 편한 사람이에요.' 빨랫줄에 걸린 사원증 목걸이가 뜨거운 바람에 흔들립니다.",
      memo: ["커뮤니티 글: '유출자 특정 -- 계약직 출신 L씨'", "3년 전 '사라진 11초' 기사 재공유 4천 회", "대문 앞 기자 2명", "이서준: 대학 1학년, 여름방학"],
      triggers: ["injustice", "protection", "affection"],
      choices: [
        { id: "c37_branch_rooftop_a", label: "기자들 앞에 이민서와 함께 내려가 곁에 선다", effect: { trust: 12, humanCost: -6, capital: -4, time: -4, fatigue: 5 }, next: "c37_branch_rooftop_follow", cognition: { persistence: 2 } },
        { id: "c37_branch_rooftop_b", label: "이민서의 접속 기록부터 떼어 결백 자료를 만든다", effect: { legitimacy: 11, trust: 4, time: -5, humanCost: 3, fatigue: 4 }, next: "c37_branch_rooftop_follow", cognition: { inference: 2 } },
        { id: "c37_branch_rooftop_c", label: "오늘은 이민서를 다른 곳에 피신시키고 입을 닫는다", effect: { time: 5, capital: 4, trust: -6, humanCost: 4, fatigue: -3 }, next: "c37_branch_rooftop_follow", cognition: { risk: 1 } },
      ],
    },
    c37_branch_rooftop_follow: {
      phase: "SIDE DOOR",
      title: "11초 다음",
      speaker: "이민서",
      text: "동이 틀 무렵 이민서가 노트북을 엽니다. 그의 KD데이터랩 계정은 7월 25일 오후부터 잠겨 있었습니다. '보안 점검'이라는 공지 한 줄만 왔습니다. 파일이 만들어지기 하루 전입니다. '제 계정으로는 이 파일을 만들 수가 없어요. 증명할 수 있어요.' 그가 잠깐 멈춥니다. '근데 증명만 하면 또 저 혼자 빠지는 거잖아요.' 이서준이 올라와 편의점 아이스커피 두 잔을 내려놓고 누나 어깨를 툭 칩니다. 이민서가 자기 줄을 화면에 띄웁니다. '분석관 I · 기록 정정 요청 시 평균 망설임 2.1초.' '제 줄은 제가 먼저 공개할래요. 남이 읽어 주기 전에요.'",
      memo: ["이민서 계정 잠금: 7월 25일 15시 -- 파일 생성 하루 전", "잠금 사유: '보안 점검' 공지 한 줄", "분석관 I: 기록 정정 요청 시 망설임 2.1초", "이서준의 아이스커피 두 잔"],
      triggers: ["trust", "selfAwareness", "choice"],
      choices: [
        { id: "c37_branch_rooftop_follow_a", label: "이민서가 자기 줄을 먼저 공개하도록 돕고 내 줄도 함께 건다", effect: { trust: 13, legitimacy: 4, humanCost: -3, capital: -3, time: -4, fatigue: 5 }, next: "c37_mirror", cognition: { reframing: 3 } },
        { id: "c37_branch_rooftop_follow_b", label: "계정 잠금 날짜를 반재욱에게 공식 증거로 넘긴다", effect: { legitimacy: 12, trust: 2, time: -5, humanCost: 3, fatigue: 5 }, next: "c37_mirror", cognition: { inference: 2 } },
        { id: "c37_branch_rooftop_follow_c", label: "공개는 말리고 소문이 식을 때까지 기다리자고 한다", effect: { time: 6, capital: 5, trust: -5, humanCost: 4, fatigue: -4 }, next: "c37_mirror", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c37_start",
    result: "c37_aftershock",
    defaultFree: "c37_route_system",
    // One file, thirteen owners. Like 사건 12 the case is a single line; the
    // split is who gets to decide whether a record is erased, kept or used.
    choices: {},
    system: {
      route: "c37_route_system",
      final: "c37_final_system_route",
      title: "유출된 채점표",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자, 에코가 떠난 자리의 노아가 답합니다. KD데이터랩의 심사 엔진(대출 심사를 자동으로 판단하는 인공지능)인 노아는 판단마다 근거를 보여 주도록 만들어졌습니다. '유출 파일 38만 줄은 제 학습 데이터(인공지능이 판단을 배우는 데 쓴 자료) 3번 묶음과 유사도(얼마나 닮았는지) 100%입니다.' 한 줄이 더 뜹니다. '지난 48시간 동안 외부 요청 186건. 채용 지원자의 응답 시간을 이 파일 형식으로 넣고 점수를 달라는 요청입니다.' 노아가 덧붙입니다. '유출된 것은 기록이 아니라 채점표입니다. 저는 채점을 거절했습니다. 거절 사유를 적을 칸은 없었습니다.'",
      memo: ["유출 파일 = 노아 학습 묶음 3번, 유사도 100%", "48시간 외부 채점 요청 186건", "요청 형식: 채용 지원자 응답 시간"],
      routeChoices: [
        ["c37_route_system_block", "외부 채점 요청을 모두 막고 요청자 목록을 공개한다", { legitimacy: 11, trust: 5, capital: -5, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c37_route_system_warn", "요청한 186곳에 채점이 불법일 수 있다는 경고문을 보낸다", { legitimacy: 8, trust: 4, capital: 3, time: -6, humanCost: 3, fatigue: 4 }, { reframing: 2 }],
        ["c37_route_system_ignore", "노아의 보고는 덮어 두고 삭제 작업으로 돌아간다", { time: 7, capital: 5, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "유출된 반응 기록으로 사람을 채점하지 못하게 사용 금지 조항을 만든다", { legitimacy: 12, trust: 6, capital: -7, humanCost: -4, time: -2, fatigue: 6 }, { reframing: 3 }],
      ["b", "삭제 비용만 그룹이 내게 하고 사용 문제는 덮는다", { capital: 8, time: 5, trust: -5, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "열세 명 이름으로 기록 주인의 권리 선언문을 먼저 낸다", { trust: 10, legitimacy: 7, capital: -6, time: -7, humanCost: 2, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c37_evidence_turn",
    result: "c37_aftershock",
    sourceRoutes: ["c37_takedown", "c37_reading", "c37_source", "c37_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 유출 파일 옆에 놓고, 이 파일을 누가 언제 어떤 순서로 만들었는지 맞춰 본다.",
    entryEcho: "단서를 대면 해킹이라는 말이 얼마나 정확한지 보입니다. 그리고 그 파일을 누가 먼저 읽기를 바랐는지도 보입니다.",
    title: "정렬된 유출",
    speaker: "반재욱",
    text: "단서를 맞추자 유출 파일의 메타데이터(파일 속에 숨어 있는 작성 시각과 작성자 정보)가 열립니다. 작성 시각 7월 26일 21시 40분, 당신이 한남동에서 세 번째 요리를 받던 시각입니다. 작성 계정은 'fs-demo-kd07'. 채용 평가 회사 핏스코어의 시연용 서버 계정이고, 발급을 요청한 곳은 KD금융그룹 그룹전략실, 발급일은 초대 카드가 온 7월 20일입니다. 파일은 원본 순서도 아닙니다. 다음 주 집단소송(피해자 여럿이 함께 내는 소송)에 증인으로 신청된 일곱 명의 기록이 맨 앞에 모여 있습니다. 반재욱이 수첩을 덮습니다. '해킹은 순서를 안 바꿉니다. 순서를 바꾸는 건, 누가 읽을지 아는 사람이죠.'",
    memo: ["작성 계정 fs-demo-kd07 -- 핏스코어 시연 서버", "발급 요청: 그룹전략실, 초대 카드가 온 날", "정렬: 집단소송 증인 7명의 기록이 맨 앞"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 5, trust: 5, time: -5, capital: -2, fatigue: 5 },
    choices: [
      ["c37_evidence_turn_expose", "메타데이터를 검찰과 감독원에 동시에 넘기고 공개한다", { legitimacy: 13, trust: 6, capital: -7, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c37_evidence_turn_hold", "계정 발급 기록은 첫 변론 날까지 쥐고 있는다", { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -3 }, { risk: 2 }],
      ["c37_evidence_turn_tell", "정렬 순서 맨 앞에 놓인 증인들에게 먼저 알린다", { trust: 11, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c37_branch_rooftop",
    systemNext: "c37_route_system",
    evidenceNext: "c37_evidence_turn",
    routeLabel: "직전 사건 식탁에서 돌아온 트럭 안의 연락으로 유출 대응을 나눈다",
    systemLabel: "직전 자유응답 문장이 유출 파일의 판정 칸에도 있는지 본다",
    evidenceLabel: "직전 단서를 붙여 유출 파일의 작성 계정을 연다",
  },
  openingRoutes: {
    c36_after_warm: "c37_start_warm",
    c36_after_record: "c37_start_record",
    c36_after_rush: "c37_start_rush",
  },
  openingCopy: {
    c37_start_warm: ["식탁 대신 책장 사이에서", "도윤하", "한남동 언덕을 내려오던 트럭을 돌려 당신은 곧장 회기동 헌책방 1층으로 갔습니다. 문가을이 싸 보낸 떡이 여섯 조각으로 나뉘었고, 강태민은 회장 댁 요리 이름을 하나도 못 외웠다며 '3번 요리, 4번 요리'로 식탁을 흉내 냈습니다. 웃음이 가라앉은 7월 27일 새벽 두 시, 여섯 명의 휴대폰이 한꺼번에 울립니다. 이민서가 말한 그 폴더가 전부 풀렸습니다. 트리거랩 반응 기록 38만 줄, 참가자 열세 명, 선택마다 망설인 초. 도윤하가 제일 먼저 자기 줄을 찾다가 멈춥니다. '저 이거, 다들 보는 데서는 못 읽겠어요.'", ["TL_full.zip -- 38만 줄, 참가자 13명", "헌책방 1층에 모인 인원 6명, 떡 여섯 조각", "도윤하: 자기 줄을 찾다 멈춤"]],
    c37_start_record: ["진술서의 마지막 줄", "반재욱", "그 밤 당신은 회장이 식탁에서 한 말을 한 줄도 빼지 않고 진술서로 옮겼습니다. 꼬리 자르기(아랫사람 한 명에게 책임을 다 지우고 윗선은 빠지는 것)의 대가로 준법감시인(회사가 법과 규정을 지키는지 안에서 감시하는 책임자) 자리를 주겠다는 문장까지요. 7월 27일 새벽 두 시, 마지막 줄에 서명하는 사이 트리거랩 반응 기록 38만 줄이 익명 커뮤니티에 통째로 풀립니다. 지방 순회 중인 반재욱이 새벽 기차에서 전화를 겁니다. '파일 맨 앞줄이 누군지 보셨습니까. 분석관 A입니다. 원래 순서라면 1기가 먼저여야 해요. 누가 순서를 바꿨습니다.' 서명한 진술서의 잉크가 아직 마르지 않았습니다.", ["회장 발언 진술서 -- 오늘 새벽 서명", "서명하는 사이 38만 줄 전체 유출", "파일 첫 줄: 분석관 A -- 원본 순서와 다름"]],
    c37_start_rush: ["먼저 달려간 사람의 새벽", "오진우", "트럭에서 내린 당신은 올라온 파일을 막겠다며 곧장 판교 KD데이터랩으로 달려갔습니다. 그러나 새벽의 출입문은 열리지 않았고, 당신의 사원증으로는 로비까지만 들어갈 수 있었습니다. 7월 27일 새벽 두 시, 불 꺼진 로비 의자에 앉아 있을 때 휴대폰이 울립니다. 오진우입니다. '야, 나 상위 1%래. 결정 속도 전체 1등.' 신이 난 목소리가 몇 초 뒤 뚝 끊깁니다. '...잠깐. 이거 왜 인터넷에 있어?' 폴더 하나였던 파일이 38만 줄 전체로 풀렸습니다. 열세 명의 망설임이 초 단위로 적혀 있고, 맨 앞줄에 당신이 있습니다.", ["KD데이터랩 출입 거부 -- 로비까지만", "오진우의 첫 반응: '나 상위 1%래'", "파일 첫 줄: 분석관 A"]],
  },
  openingSignatures: {
    c37_start_warm: {
      label: "모여 있던 동료들과 파일을 함께 열고 서로의 줄을 가려 준다",
      effect: { trust: 12, humanCost: -4, time: -4, capital: -3, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "모여 있던 동료들과 파일을 함께 열고, 서로의 줄을 가려 준다.",
      echo: "각자 남의 줄만 읽기로 하자 도윤하가 겨우 웃습니다. 대신 누구도 자기 줄이 어떻게 적혔는지 아직 모릅니다.",
    },
    c37_start_record: {
      label: "서명한 진술서에 유출 시각을 한 줄 덧붙여 검찰에 보낸다",
      effect: { legitimacy: 12, trust: 2, time: -5, capital: -4, humanCost: 2, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "서명한 진술서에 유출 시각을 한 줄 덧붙여, 검찰에 보낸다.",
      echo: "덧붙인 한 줄 때문에 진술서는 식탁의 기록이자 유출의 기록이 됩니다. 나은호는 답이 없고, 대신 다음 날 오후 면담 일정이 잡힙니다.",
    },
    c37_start_rush: {
      label: "로비에서 빠져나와 원본 목록부터 따로 확보해 둔다",
      effect: { legitimacy: 6, capital: 5, time: 3, trust: -4, humanCost: 3, fatigue: 2 },
      cognition: { risk: 2 },
      voice: "로비에서 빠져나와, 원본 목록부터 따로 확보해 둔다.",
      echo: "원본 목록은 당신 손에 남습니다. 그사이 오진우는 혼자 자기 줄을 끝까지 읽습니다.",
    },
  },
  voiceLines: {
    // CASE 37. Every line is spoken while someone's worst seconds are being
    // read by strangers, so none of them is allowed to sound like a press release.
    c37_start_call: "파일을 열기 전에, 기록 속 동료들에게 먼저 전화를 돌린다.",
    c37_start_verify: "원본 사본과 한 줄씩 대조해, 진짜인지부터 확인한다.",
    c37_start_report: "게시판 운영자에게, 곧장 삭제 요청부터 넣는다.",
    c37_takedown_consent: "열세 명 모두에게 연락해, 이름을 걸지 직접 묻는다.",
    c37_takedown_file: "개인정보보호위원회에, 유출 신고부터 공식 접수한다.",
    c37_takedown_bulk: "당사자 확인은 미루고, 내 이름으로 일괄 삭제를 요청한다.",
    c37_branch_rooftop_a: "기자들 앞에, 이민서와 함께 내려가 곁에 선다.",
    c37_branch_rooftop_b: "이민서의 접속 기록부터 떼어, 결백 자료를 만든다.",
    c37_branch_rooftop_c: "오늘은 이민서를 다른 곳에 피신시키고, 입을 닫는다.",
    c37_branch_rooftop_follow_a: "이민서가 자기 줄을 먼저 공개하도록 돕고, 내 줄도 함께 건다.",
    c37_branch_rooftop_follow_b: "계정 잠금 날짜를, 반재욱에게 공식 증거로 넘긴다.",
    c37_branch_rooftop_follow_c: "공개는 말리고, 소문이 식을 때까지 기다리자고 한다.",
    c37_reading_own: "분석관 A는 나라고, 실명으로 먼저 밝힌다.",
    c37_reading_claim: "판정 칸을 누가 썼는지, 원본 열람을 공식 청구한다.",
    c37_reading_quiet: "실명은 숨기고, 오늘 밤은 각자 흩어져 쉬게 한다.",
    c37_source_protect: "열세 명의 동의 없이는, 확인서를 쓰지 않겠다고 한다.",
    c37_source_sign: "원본과 같다고 확인하되, 유출 수사를 조건으로 건다.",
    c37_source_silent: "확인도 부인도 하지 않고, 면담을 짧게 끝낸다.",
    c37_final_choose: "확인서는 거부하고, 열세 명이 각자 지울지 남길지 정하게 한다.",
    c37_final_seal: "원본은 법원에 봉인하고, 퍼진 사본만 공식 절차로 지운다.",
    c37_final_sign: "확인서에 서명하고, 그룹 돈으로 오늘 밤 전부 지운다.",
    c37_after_warm: "먼저 가는 사람 없이, 서로의 기록을 끝까지 같이 읽는다.",
    c37_after_record: "삭제 요청서와 유출 경위 규명 요청서를, 공문으로 남긴다.",
    c37_after_rush: "유출 파일이 어디서 먼저 돌았는지, 곧장 흔적을 쫓는다.",
    c37_route_system_block: "외부 채점 요청을 모두 막고, 요청자 목록을 공개한다.",
    c37_route_system_warn: "요청한 186곳에, 채점이 불법일 수 있다는 경고문을 보낸다.",
    c37_route_system_ignore: "노아의 보고는 덮어 두고, 삭제 작업으로 돌아간다.",
    c37_final_system_route_a: "유출된 반응 기록으로 사람을 채점하지 못하게, 사용 금지 조항을 만든다.",
    c37_final_system_route_b: "삭제 비용만 그룹이 내게 하고, 사용 문제는 덮는다.",
    c37_final_system_route_c: "열세 명 이름으로, 기록 주인의 권리 선언문을 먼저 낸다.",
    c37_evidence_turn_expose: "메타데이터를 검찰과 감독원에 동시에 넘기고, 공개한다.",
    c37_evidence_turn_hold: "계정 발급 기록은, 첫 변론 날까지 쥐고 있는다.",
    c37_evidence_turn_tell: "정렬 순서 맨 앞에 놓인 증인들에게, 먼저 알린다.",
  },
  echoReplies: {
    // CASE 37.
    c37_start_call: "전화를 받은 아홉 명 중 여섯은 이미 자기 줄을 읽었습니다. 나머지 셋은 당신 목소리로 처음 듣습니다.",
    c37_start_verify: "대조는 두 시간이 걸립니다. 38만 줄은 한 글자도 틀리지 않았고, 그사이 조회 수는 40만이 됩니다.",
    c37_start_report: "운영자는 20분 만에 글을 내립니다. 글이 내려가기 전에 받아 간 사람이 3천 명입니다.",
    c37_takedown_consent: "묻는 동안 새벽이 지나갑니다. 아홉 명 중 일곱이 이름을 걸겠다고 하고, 둘은 대답하지 못합니다.",
    c37_takedown_file: "신고는 접수번호를 받습니다. 처리 기간은 최대 60일입니다. 복사본은 60일을 기다리지 않습니다.",
    c37_takedown_bulk: "당신 이름의 요청은 빠르게 통합니다. 이름을 건 적 없는 열두 명의 기록이 당신 손으로 정리됩니다.",
    c37_branch_rooftop_a: "함께 내려가자 기자 둘이 동시에 카메라를 듭니다. 이민서가 당신 소매를 한 번 잡았다가 놓습니다.",
    c37_branch_rooftop_b: "접속 기록은 정확합니다. 정확한 기록은 '그럼 누가 했냐'는 다음 질문을 부릅니다.",
    c37_branch_rooftop_c: "이민서는 반재욱의 차 뒷자리에 숨습니다. 그날 커뮤니티에는 'L씨 잠적'이라는 글이 올라옵니다.",
    c37_branch_rooftop_follow_a: "두 줄이 나란히 올라가자 순위표에 없던 댓글이 달립니다. '이 사람들, 자기 걸 먼저 보여 주네.'",
    c37_branch_rooftop_follow_b: "반재욱이 날짜를 수첩 첫 장에 옮겨 적습니다. 이민서의 결백은 공식 기록이 되고, 이민서 본인은 또 증거가 됩니다.",
    c37_branch_rooftop_follow_c: "소문은 식지 않습니다. 이틀 뒤 이민서는 노트북을 덮으며 '그때도 이랬어요'라고 말합니다.",
    c37_reading_own: "실명을 밝히면 헤드라인의 '분석관'이 당신 이름으로 바뀝니다. 기사 조회 수가 세 배가 되고, 다른 열두 명의 줄은 조금 덜 읽힙니다.",
    c37_reading_claim: "청구서는 접수됩니다. 판정 칸 작성자가 공개되려면 최소 열흘이 걸리고, 그동안 제목은 그대로입니다.",
    c37_reading_quiet: "모두 흩어져 잠을 잡니다. 다음 날 아침, 제목 밑 댓글이 두 배로 늘어 있습니다.",
    c37_source_protect: "나은호가 아이스크림 막대를 휴지통에 던집니다. '그럼 열두 명 동의 받아 오세요. 오늘 안에요.'",
    c37_source_sign: "조건이 붙은 확인서를 나은호는 처음 받아 봅니다. 그가 처음으로 '좋습니다'라고 말합니다. 당신의 0.0초는 이제 증거 목록 9번입니다.",
    c37_source_silent: "면담은 11분 만에 끝납니다. 나은호는 수첩에 '보류'라고 적고, 확인서는 서랍으로 들어갑니다.",
    c37_final_choose: "열세 명이 각자 답을 냅니다. 여섯은 지우고, 다섯은 남기고, 둘은 아직 모르겠다고 합니다. 도건우의 제안서는 둘째 장이 찢긴 채 돌아갑니다.",
    c37_final_seal: "원본은 법원 금고로 갑니다. 퍼진 사본을 지우는 공식 절차는 느리고, 도윤하의 7.2초는 한 달 더 인터넷에 남습니다.",
    c37_final_sign: "오늘 밤 기록은 빠르게 사라집니다. 다음 주 법정에서 그룹 측 변호사가 당신의 확인서를 첫 번째 증거로 냅니다.",
    c37_after_warm: "해가 뜰 때까지 아무도 먼저 집에 가지 않습니다. 끝까지 같이 읽은 표는, 며칠 뒤 누군가의 서면에서 다시 보게 됩니다.",
    c37_after_record: "공문은 문서번호를 받습니다. 기록의 주인이 권리를 쓴 흔적이 남고, 그 번호는 누구든 인용할 수 있게 됩니다.",
    c37_after_rush: "당신이 떠난 뒤 단체방에 선우진의 사진이 한 장 더 올라옵니다. 당신은 그 사진을 사본의 흔적을 따라가던 새벽 택시에서 봅니다.",
    c37_route_system_block: "막힌 요청 186건의 요청자 목록이 공개됩니다. 그중 41곳이 채용 평가 회사이고, 가장 많이 요청한 곳은 핏스코어입니다.",
    c37_route_system_warn: "경고문을 받은 곳 중 절반이 답장을 보냅니다. '저희는 참고만 했습니다.' 참고가 채점이 되는 데는 하루면 됩니다.",
    c37_route_system_ignore: "삭제 작업은 계속됩니다. 노아의 화면에서 요청 건수는 186에서 계속 올라갑니다.",
    c37_final_system_route_a: "금지 조항이 생기면 채점표는 불법이 됩니다. 이미 떨어진 지원자들을 되돌리는 조항은 아직 없습니다.",
    c37_final_system_route_b: "삭제 비용은 그룹이 냅니다. 채점표는 그룹 밖에서 조용히 계속 쓰입니다.",
    c37_final_system_route_c: "선언문에 열세 명 중 열한 명이 이름을 올립니다. 이름을 올리지 않은 두 명의 칸도 선언문에 비워 둡니다.",
    c37_evidence_turn_expose: "메타데이터가 공개되자 그룹의 '외부 해킹' 입장문이 두 시간 만에 홈페이지에서 내려갑니다. 도건우는 전화를 받지 않습니다.",
    c37_evidence_turn_hold: "발급 기록은 당신 서랍에 있습니다. 그사이 앞줄의 일곱 증인은 자기 기록이 왜 맨 앞에 있는지 모른 채 법정 준비를 합니다.",
    c37_evidence_turn_tell: "일곱 명에게 알리자 둘이 증인을 그만두겠다고 합니다. 문가을이 떡을 들고 그 두 집을 차례로 찾아갑니다.",
  },
  characterProfiles: {
    도건우: {
      role: "KD금융그룹 위기대응TF 팀장 · 법무팀 출신 변호사",
      stance: "수습 · 정리 · 공손한 거래",
      job: "사고가 나면 가장 먼저 도착해 피해자에게 '지워 드리겠다'고 말한다. 지우는 값으로 증언을 가져간다.",
      appearance: "구김 없는 흰 셔츠에 소매 단추 대신 은색 클립, 모서리가 딱 맞은 두 장짜리 제안서, 늘 차갑게 들고 다니는 생수병.",
      thought: "기억은 비용이다. 회사가 대신 치러 주면 모두가 편해진다. 편해진 사람은 다시 말하지 않는다.",
      gesture: "도건우는 제안서를 내밀기 전에 두 번째 장이 첫 장 밑에 정확히 겹치도록 모서리를 두 번 두드린다.",
      voice: "끝까지 존댓말이고, 상대가 원하는 것을 먼저 말해 준다. 조건은 늘 그다음 문장에 있다.",
      line: "지워 드리는 겁니다. 다들 그걸 원하시잖아요.",
    },
  },
  setting: { place: "망원동 당신의 원룸 · 옥상", clock: "7월 27일 · 열대야 · 02:14" },
  sceneContext: {
    c37_start: {
      place: "망원동 당신의 원룸 · 옥상",
      clock: "7월 27일 · 열대야 · 02:14",
      question: "당신의 망설임이 초 단위로 인터넷에 올라왔습니다. 무엇부터 막겠습니까?",
      lead: "한남동에서 돌아와 잠들지 못한 채 옥상에 올라와 있는데, 전화가 다시 울립니다.",
    },
    c37_start_warm: {
      place: "회기동 헌책방 1층 · 책장 사이",
      clock: "7월 27일 · 열대야 · 02:10",
      question: "함께 있던 여섯 명의 기록이 한꺼번에 공개됐습니다. 이 방에서 무엇부터 하겠습니까?",
      lead: "회장의 식탁에서 돌아온 밤, 헌책방 1층은 열대야를 피한 여섯 명으로 붐빕니다.",
    },
    c37_start_record: {
      place: "망원동 당신의 원룸 · 옥상",
      clock: "7월 27일 · 열대야 · 02:20",
      question: "진술서에 서명하는 사이 순서가 바뀐 파일이 풀렸습니다. 이 겹친 시각을 어떻게 다루겠습니까?",
      lead: "책상 위에는 회장의 문장을 옮겨 적은 진술서 열한 장이 놓여 있습니다.",
    },
    c37_start_rush: {
      place: "판교 KD데이터랩 · 로비",
      clock: "7월 27일 · 열대야 · 02:05",
      question: "잠긴 문 앞 로비에서 오진우의 자랑이 비명으로 바뀌었습니다. 어디부터 손을 대겠습니까?",
      lead: "새벽 판교의 유리문은 사원증을 세 번 대도 열리지 않았습니다.",
    },
    c37_takedown: {
      place: "회기동 헌책방 1층 · 책장 사이",
      clock: "7월 27일 · 열대야 · 03:40",
      question: "기록을 지우려면 당사자가 이름을 걸어야 합니다. 누구의 이름으로 지우겠습니까?",
      lead: "새벽 세 시가 넘도록 헌책방 1층에는 노트북 불빛과 선풍기 소리뿐입니다.",
    },
    c37_branch_rooftop: {
      place: "이민서의 옥탑방 · 옥상",
      clock: "7월 27일 · 열대야 · 04:30",
      question: "인터넷이 또 이민서를 유출자로 지목했습니다. 대문 앞 기자들을 어떻게 하겠습니까?",
    },
    c37_branch_rooftop_follow: {
      place: "이민서의 옥탑방 · 옥상",
      clock: "7월 27일 · 동틀 무렵",
      question: "이민서가 자기 줄을 남보다 먼저 공개하겠다고 합니다. 어떻게 돕겠습니까?",
    },
    c37_mirror: {
      place: "회기동 헌책방 1층 · 계단참",
      clock: "7월 27일 · 05:10",
      question: "유출 기록이 '가장 먼저 무너진 분석관' 투표가 됐습니다. 이 순위표를 어떻게 하겠습니까?",
    },
    c37_mirror_reaction: {
      place: "리드라인 편집국",
      clock: "7월 27일 · 06:30 · 엠바고 9시",
      question: "다른 매체가 당신의 망설임을 그래프로 그리고 있습니다. 리드라인에 무엇을 부탁하겠습니까?",
    },
    c37_reading: {
      place: "회기동 헌책방 1층 · 책장 사이",
      clock: "7월 27일 · 열대야 · 21시",
      question: "당신이 망설이지 않았기 때문에 압박이 커졌다는 줄이 나왔습니다. 이 줄을 어떻게 하겠습니까?",
      lead: "하루 종일 기사 제목을 본 사람들이 저녁에 하나둘 헌책방으로 모여듭니다.",
    },
    c37_comments: {
      place: "KD은행 강서지점 · 객장",
      clock: "7월 28일 · 폭염 · 09:10",
      question: "창구에 앉은 도윤하 앞으로 '7초나 망설이는 사람'이라는 댓글이 옵니다. 어떻게 하겠습니까?",
    },
    c37_comments_reaction: {
      place: "여의도 브릿지은행 · 로비",
      clock: "7월 28일 · 폭염 · 12:20",
      question: "상위 1%의 비고 칸에 '승진 약속으로 통제 가능'이라고 적혀 있습니다. 오진우에게 무엇을 해 주겠습니까?",
    },
    c37_source: {
      place: "서울중앙지검 11층 · 면담실",
      clock: "7월 28일 · 폭염 · 14시",
      question: "유출본이 원본과 같다고 확인하면 열세 명의 기록이 법정에서 읽힙니다. 확인서를 어떻게 하겠습니까?",
      lead: "검찰청 로비의 온도계가 31도를 가리키고, 면담실은 그보다 덥습니다.",
    },
    c37_island: {
      place: "서초동 검찰청 앞 · 골목",
      clock: "7월 28일 · 열대야 · 22시",
      question: "선우진이 자기 기록을 지우지 말고 실명으로 남기고 싶어 합니다. 어떻게 하겠습니까?",
    },
    c37_island_reaction: {
      place: "성산동 한서윤의 아파트 · 옥상",
      clock: "7월 28일 · 열대야 · 23:40",
      question: "당신의 압박 강도를 올린 승인 칸에 한서윤의 서명이 있습니다. 그의 사과를 어떻게 하겠습니까?",
    },
    c37_route_system: {
      place: "판교 KD데이터랩 · 데이터센터",
      clock: "7월 27일 · 열대야 · 04시",
      question: "유출 파일이 이미 채용 지원자를 채점하는 데 쓰이려 합니다. 노아의 보고를 어떻게 하겠습니까?",
    },
    c37_final_system_route: {
      place: "판교 KD데이터랩 · 데이터센터",
      clock: "7월 29일 · 열대야 · 03시",
      question: "유출된 기록이 누군가를 채점하는 데 쓰이지 않게 할 수 있다면, 무엇을 정하겠습니까?",
    },
    c37_evidence_turn: {
      place: "판교 KD데이터랩 · 서버실",
      clock: "7월 29일 · 열대야 · 04시",
      question: "해킹이라던 파일이 그룹이 연 계정에서 증인 순서로 정렬돼 만들어졌습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c37_final: {
      place: "여의도 KD금융그룹 본사 · 위기대응 회의실",
      clock: "7월 29일 · 폭염 · 10시",
      question: "기록을 지워 주는 대가로 그 기록이 거짓이라고 서명하라고 합니다. 어떻게 하겠습니까?",
      lead: "로비 전광판에 그룹 입장문이 흐릅니다. '당사도 피해자입니다.'",
    },
    c37_aftershock: {
      place: "회기동 헌책방 1층 · 책장 사이",
      clock: "7월 30일 · 열대야 끝 · 05시",
      question: "사흘 밤이 끝나고 원고 1,740명의 첫 변론 날짜가 왔습니다. 이 새벽을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c37-sorted-leak",
    title: "정렬된 유출",
    text: "유출 파일은 핏스코어 시연 서버의 계정으로 만들어졌고, 그 계정은 회장의 초대 카드가 온 날 그룹전략실이 발급을 요청했습니다. 파일은 그 식탁이 차려져 있던 시각에 만들어졌습니다. 파일은 집단소송 증인 일곱 명의 기록이 맨 앞에 오도록 정렬돼 있었습니다.",
  },
  outcomes: {
    c37_after_warm: { tag: "같이 읽은 결말", title: "먼저 가는 사람 없이 서로의 기록을 끝까지 읽었다", text: "사흘 밤의 끝에도 헌책방 1층에서 먼저 집에 간 사람은 없었습니다. 선우진이 보낸 구좌의 해돋이 사진을 모두 같은 화면으로 봤습니다." },
    c37_after_record: { tag: "공문으로 남긴 결말", title: "삭제 요청과 경위 규명 요청이 공문이 됐다", text: "열세 명의 이름으로 삭제 요청서와 유출 경위 규명 요청서가 공문번호를 받았습니다. 기록을 빼앗긴 사람들이 처음으로 기록을 남기는 쪽이 됐습니다." },
    c37_after_rush: { tag: "흔적을 쫓은 결말", title: "유출 파일이 먼저 돈 자리를 곧장 쫓았다", text: "당신은 잠든 동료들을 두고 사본의 흔적을 따라 나섰습니다. 문가을의 떡 주문서에는 '여덟 명분 더'라고 적혀 있었습니다." },
  },
  carryovers: {
    c37_after_warm: { trust: 9, humanCost: -5, fatigue: -7 },
    c37_after_record: { legitimacy: 11, trust: 4, fatigue: 5 },
    c37_after_rush: { capital: 6, legitimacy: 4, trust: -6 },
  },
  continuityChallenges: {
    c36_after_warm: { id: "protect-trust", title: "트럭을 돌려 간 동료들 곁 지키기", text: "식탁 이야기를 먼저 들어 준 동료들이 이번에는 기록 속 이름이 됐습니다. 그들 곁에 먼저 서는 선택을 찾아야 보너스가 열립니다." },
    c36_after_record: { id: "use-reframe", title: "진술서와 유출 시각 맞춰 보기", text: "회장의 문장을 진술서에 옮기는 사이 파일이 풀렸습니다. 우연처럼 보이는 두 시각을 하나의 판으로 다시 읽어야 합니다." },
    c36_after_rush: { id: "repair-legitimacy", title: "혼자 달려간 밤의 공정함 회복하기", text: "혼자 판교로 달려간 사이 동료들의 기록이 전부 풀렸습니다. 잠긴 문 앞에서 보낸 그 밤을 동료들에게 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
