/**
 * CASE 45 -- the authored scenes of the last paper.
 *
 * 임경수 has carried paper for the whole season: the page with the empty
 * signature box in 사건 07, the copy of the dissent's back page that became a
 * news story in 사건 11, 312 boxes out of a building in 사건 19, the disks the
 * old verification system learned from in 사건 20. Two days after the first
 * verdict he dies, and the case is his funeral -- three days in 이음병원's 3호
 * 빈소 -- and the envelope he left to be opened on the third morning.
 *
 * The envelope holds the original of the dissent's back page. Everyone has seen
 * the copy: '반려 -- 윤. 사유는 묻지 말 것.' The original holds two things a
 * copy cannot. In the reviewer's box below, erased, 임경수's own '동의': he
 * agreed with the analyst and rubbed it out, weeks before he left the bank. And
 * pressed into the paper from a sheet that once lay on top: '작성자 이름 --
 * 따로 적어 둘 것. 윤.' -- the reason the analyst's name reached 반재욱's desk.
 * It does not say what the name was kept for; the last case does. The same
 * pencil sentence sits erased in the margins of the four approvals the court
 * acquitted, and only an original can go to a handwriting examiner before the
 * appeal deadline. Handing it in also publishes an old man's silence.
 *
 * Grief is the centre, and the mourners are allowed to laugh: a 1,300원
 * overdue fine in the condolence box, a thank-you note returned with red-pen
 * corrections, 나준혁's story of a rainy week in 영동 thirty years ago when
 * 임경수 counted the knife scars on a squid-factory owner's hand instead of
 * collateral -- and the owner's son walks in with 오징어순대. The anger is a
 * demand letter delivered at the altar under the group's wreath; the joy is a
 * son who stops calling the paper his father's other family.
 */
export const case45Nodes = {
  c45_start: {
    phase: "CASE 45 BRIEFING",
    title: "3호 빈소",
    speaker: "임소율",
    text:
      "9월 15일 화요일 저녁, 이음병원 장례식장 3호 빈소. 임경수는 오늘 새벽 4시 50분에 세상을 떠났습니다. 1심 선고를 병실 라디오로 들은 지 닷새 만입니다. 영정 자리에는 사진 대신 그림이 서 있습니다. 집에 남은 사진이 1996년 사원증 사진 한 장뿐이라, 임소율이 밤새 그렸습니다. 안경을 벗어 천천히 닦는 할아버지입니다. 상주(장례를 대표해 조문을 받는 가족)인 아버지 임재윤은 두바이 현장에서 비행기를 타고 오는 중이라, 빌린 상복 소매를 두 번 접은 임소율이 그 자리에 서 있습니다. 그가 주머니에서 누런 봉투 하나를 꺼냅니다. 겉봉에 연필 글씨가 있습니다. '율이와 반대 의견 쓴 사람이 같이. 셋째 날 새벽에 열 것.' 임소율이 봉투를 도로 넣습니다. '할아버지가 마지막으로 찾으신 게 이거예요. 뭐가 들었는지는 끝까지 말 안 하셨어요. 마지막까지 뜸 들이는 거, 진짜 할아버지답죠.'",
    memo: [
      "임경수 별세: 9월 15일 새벽 4시 50분, 이음병원",
      "영정: 사진 대신 임소율이 그린 그림",
      "상주 임재윤 -- 두바이발 비행기, 내일 오후 도착",
      "봉투 겉면: '셋째 날 새벽에 열 것'",
    ],
    triggers: ["affection", "helplessness", "responsibility"],
    choices: [
      {
        id: "c45_start_stay",
        label: "상복 소매를 걷고 임소율 곁에서 조문객을 맞는다",
        effect: { trust: 10, humanCost: -5, time: -5, capital: -2, fatigue: 5 },
        next: "c45_wreath",
        cognition: { persistence: 2 },
      },
      {
        id: "c45_start_notify",
        label: "봉투가 있다는 사실만 나은호 검사에게 먼저 알려 둔다",
        effect: { legitimacy: 11, trust: -2, time: -4, humanCost: 2, fatigue: 2 },
        next: "c45_wreath",
        cognition: { inference: 2 },
      },
      {
        id: "c45_start_open",
        label: "셋째 날까지 기다리지 말고 봉투를 지금 열자고 한다",
        effect: { time: 6, capital: 4, trust: -1, legitimacy: -3, humanCost: 3, fatigue: -2 },
        next: "c45_wreath",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c45_wreath",
      },
    ],
  },
  c45_wreath: {
    phase: "THE WREATHS",
    title: "조화 두 개",
    speaker: "임재윤",
    text:
      "9월 16일 수요일 오후 2시. 3호 빈소 입구에 조화가 스물여섯 개 늘어섰습니다. 제일 큰 두 개가 영정 바로 옆자리를 차지합니다. 리본 하나에는 'KD금융그룹 임직원 일동', 다른 하나에는 이름 석 자 '윤상혁'. 그 사이로 검은 정장 두 사람이 들어와 절을 하고, 곧장 봉투를 내밉니다. 조의금 봉투가 아닙니다. KD은행 법무팀 과장 하승원이 건넨 내용증명(누가 언제 무엇을 요구했는지 우체국이 증명해 주는 편지)입니다. '고인이 재직 중 반출한 은행 문서 일체를 발인(장례를 마치고 관을 장례식장에서 떠나보내는 일) 전에 반환해 주시기 바랍니다. 봉투 형태의 문서를 포함합니다.' 방금 도착한 상주(장례를 대표해 조문을 받는 가족) 임재윤이 캐리어도 내려놓지 못한 채 그 종이를 읽습니다. 봉투를 아는 사람은 다섯 명뿐입니다. 임재윤이 조화 두 개를 번갈아 봅니다. '아버지를 내보낸 회사가 꽃을 보내고, 같은 날 아버지 종이를 내놓으래요. 이게 무슨 장례예요?'",
    memo: [
      "조화 26개 -- 영정 옆 두 자리: KD금융그룹, 윤상혁",
      "법무팀 요구: 은행 문서 일체, 발인 전 반환",
      "'봉투 형태의 문서 포함' -- 봉투를 아는 사람은 다섯 명",
      "상주 임재윤, 두바이발 비행기로 13시 도착",
    ],
    triggers: ["injustice", "protection", "fear"],
    choices: [
      {
        id: "c45_wreath_family",
        label: "조화와 서류는 가족 뜻부터 묻고 법무팀은 입구 밖에 세운다",
        effect: { trust: 12, humanCost: -4, legitimacy: -2, time: -4, fatigue: 5 },
        next: "c45_stories",
        cognition: { persistence: 2 },
      },
      {
        id: "c45_wreath_reply",
        label: "발인 뒤 정식 절차로 답하겠다는 서면을 그 자리에서 쓴다",
        effect: { legitimacy: 11, trust: 2, time: -5, humanCost: 2, fatigue: 3 },
        next: "c45_stories",
        cognition: { inference: 2 },
      },
      {
        id: "c45_wreath_ribbon",
        label: "윤상혁의 리본을 떼어 들고 누가 보냈는지 꽃집부터 캐묻는다",
        effect: { capital: 5, time: 3, trust: 2, legitimacy: -5, humanCost: 3, fatigue: -2 },
        next: "c45_stories",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c45_stories",
      },
    ],
  },
  c45_stories: {
    phase: "THE WAKE",
    title: "흉보는 밤",
    speaker: "나준혁",
    text:
      "밤 11시, 3호 빈소 접객실. 육개장 그릇이 치워지고 소주병이 세 번 바뀌자 누가 먼저랄 것 없이 고인 흉이 시작됩니다. 반재욱은 4년 동안 책방에서 커피를 한 번도 못 얻어 마셨다고 합니다. 늘 보리차였습니다. 강태민은 고맙다고 쓴 손편지를 맞춤법 빨간 줄 세 개와 함께 돌려받았습니다. 권도현이 조의금함에 봉투를 하나 더 넣습니다. 겉봉에 '연체료 1,300원'. 헌책방에서 책을 빌려 가면 대출 카드를 쓰게 하던 사람이었고, 권도현은 13일을 넘겼습니다. 웃음이 한 바퀴 돌자 나준혁이 믹스커피를 한 잔 더 탑니다. '30년 전 장마 때요. 이 양반이 영동에 현장 실사(서류만 보지 않고 현장에 직접 가서 확인하는 조사)를 왔어요. 본점에서 다들 안 된다던 오징어 공장 대출이었죠. 비에 길이 끊겨서 사흘을 공장 숙직실에서 잤는데, 그동안 오징어 배 따는 걸 배웠어요. 스무 마리 중에 열아홉 마리 먹물을 자기 셔츠에 터뜨렸고요.' 접객실이 뒤집어집니다. '그러고 올라가서 보고서에 뭐라고 쓴 줄 알아요? 담보 대신 사장 손등의 칼자국을 셌다고. 서른한 개.' 그때 문이 열리고 스티로폼 상자 네 개를 든 남자가 들어옵니다. 영동 바다결수산 대표 여시온, 그 공장 사장의 아들입니다. '아버지가요, 오징어순대 없이 보내 드리면 안 된대요. 대출 다 갚은 공장에서 만든 거라고 꼭 말하래요.' 임소율이 휴대폰 녹음 버튼 위에 손가락을 올린 채 당신을 봅니다.",
    memo: [
      "접객실 23시 -- 조문객 38명 남음",
      "권도현의 두 번째 봉투: '연체료 1,300원'",
      "나준혁의 이야기: 30년 전 장마, 영동 오징어 공장 현장 실사",
      "바다결수산 대표 여시온, 오징어순대 네 상자",
    ],
    triggers: ["affection", "recognition", "choice"],
    choices: [
      {
        id: "c45_stories_stay",
        label: "이야기가 끝날 때까지 남아 임소율 몫까지 받아 적는다",
        effect: { trust: 13, humanCost: -4, time: -5, capital: -2, fatigue: 6 },
        next: "c45_envelope",
        cognition: { persistence: 2 },
      },
      {
        id: "c45_stories_archive",
        label: "조문객 동의를 받아 이 이야기들을 추모 기록으로 남긴다",
        effect: { legitimacy: 9, trust: 5, time: -6, humanCost: 2, fatigue: 4 },
        next: "c45_envelope",
        cognition: { inference: 2 },
      },
      {
        id: "c45_stories_meeting",
        label: "웃음은 여기서 끊고 법무팀 서류에 대응할 회의를 연다",
        effect: { time: 5, capital: 4, trust: -2, legitimacy: 3, humanCost: 3, fatigue: -3 },
        next: "c45_envelope",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c45_envelope",
      },
    ],
  },
  c45_envelope: {
    phase: "THE ENVELOPE",
    title: "셋째 날 새벽",
    speaker: "임소율",
    text:
      "9월 17일 목요일 새벽 5시, 발인(장례를 마치고 관을 장례식장에서 떠나보내는 일) 세 시간 전. 3호 빈소 제단 앞에서 임소율이 봉투를 뜯습니다. 누렇게 바랜 종이 한 장과 편지지 두 장이 나옵니다. 종이의 앞면은 당신이 3년 전에 쓴 반대 의견서의 마지막 쪽입니다. 맨 아래에 당신의 서명이 있습니다. 뒷면에는 연필 한 줄. '반려 -- 윤. 사유는 묻지 말 것.' 사본으로 수없이 본 줄입니다. 그런데 원본에는 사본에 없던 것이 있습니다. 그 아래 인쇄된 '심사팀장 검토 의견' 칸. 사본에서는 비어 있던 칸입니다. 임소율이 휴대폰 불빛을 옆으로 눕혀 비추자, 지우개로 지운 연필 자국이 떠오릅니다. '동의 -- 임경수.' 편지의 첫 장은 이렇게 시작합니다. '율아, 그리고 반대 의견 쓴 사람. 지운 자국 보이나. 내 칸이네. 그날 나는 동의라고 썼다가 지웠어. 은행을 떠날 날짜를 받아 둔 사람이었거든. 내가 이 종이를 지킨 건 자네 반대를 지킨 게 아니라, 내가 못 한 반대를 숨겨 둔 거였네.' 임소율의 손이 멈춥니다. 편지는 한 장이 더 남았습니다.",
    memo: [
      "원본 앞면: 반대 의견서 마지막 쪽, 당신의 서명",
      "뒷면: '반려 -- 윤. 사유는 묻지 말 것.'",
      "심사팀장 검토 의견 칸: 지운 연필 '동의 -- 임경수'",
      "편지 두 장 중 한 장이 남음",
    ],
    triggers: ["helplessness", "selfAwareness", "affection"],
    choices: [
      {
        id: "c45_envelope_read",
        label: "임소율과 편지 두 장을 끝까지 소리 내어 읽는다",
        effect: { trust: 14, humanCost: -5, time: -4, legitimacy: -2, fatigue: 6 },
        next: "c45_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c45_envelope_log",
        label: "개봉 시각과 입회자를 적고 원본을 그 자리에서 봉한다",
        effect: { legitimacy: 12, trust: 2, time: -4, humanCost: 2, fatigue: 3 },
        next: "c45_final",
        cognition: { inference: 2 },
      },
      {
        id: "c45_envelope_send",
        label: "편지는 나중에 읽고 원본 사진부터 나은호에게 보낸다",
        effect: { time: 6, capital: 4, trust: -3, legitimacy: 3, humanCost: 4, fatigue: -3 },
        next: "c45_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c45_final",
      },
    ],
  },
  c45_final: {
    phase: "FINAL DECISION",
    title: "발인",
    speaker: "임소율",
    text:
      "오전 7시 40분, 장례식장 출입구 앞. 운구차 뒷문이 열려 있고 낙엽 몇 장이 바퀴 옆으로 쓸려 갑니다. 강태민, 오진우, 권도현, 나준혁, 반재욱, 여시온이 관을 들 채비를 하고, 임재윤은 위패를, 임소율은 그림 영정을 품에 안습니다. 휴대폰에 나은호 검사의 문자가 와 있습니다. 오늘이 선고 7일째입니다. '항소장(1심 판결에 불복해 다시 재판해 달라고 내는 서류)은 오늘 자정까지 냅니다. 원본을 증거로 내겠다는 가족 동의서가 16시까지 오면 필적 감정(글씨를 비교해 누가 썼는지 가려내는 감정) 신청을 같이 붙일 수 있어요. 원본은 감정하는 날까지 가족이 갖고 있어도 됩니다.' 건너편에는 법무팀 하승원이 두 번째 내용증명(누가 언제 무엇을 요구했는지 우체국이 증명해 주는 편지)을 들고 서 있습니다. 임소율이 상복 안주머니의 봉투를 꺼내 봅니다. '할아버지 말대로면 이건 태워야 없어지는 거죠. 오늘 화장하면 같이 보내 드릴 수도 있어요.' 봉투를 쥔 손에 힘이 들어갑니다. '근데 할아버지는 평생 안 태웠어요. 원본을 내면 지운 동의도 같이 나가요. 사람들이 할아버지를 비겁했다고 하겠죠.' 장례지도사가 시간을 알립니다. 5분.",
    memo: [
      "나은호: 가족 동의서 16시까지 -- 필적 감정 신청 가능, 항소장은 오늘 자정",
      "법무팀 두 번째 요구서: 발인 즉시 반환",
      "원본을 내면 지운 '동의 -- 임경수'도 공개",
      "화장 10시 -- 봉투를 함께 보낼 수도 있음",
    ],
    triggers: ["choice", "affection", "responsibility"],
    choices: [
      {
        id: "c45_final_family",
        label: "원본의 길은 임소율 가족이 정하게 두고 관을 함께 든다",
        effect: { trust: 13, humanCost: -6, legitimacy: -3, time: -4, capital: -2, fatigue: 5 },
        next: "case45_result",
        cognition: { reframing: 2 },
      },
      {
        id: "c45_final_submit",
        label: "지운 동의까지 담긴 원본을 증거로 내자고 가족에게 청한다",
        effect: { legitimacy: 13, trust: 5, capital: -5, time: -6, humanCost: 2, fatigue: 5 },
        next: "case45_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c45_final_hold",
        label: "사본만 붙여 항소부터 걸고 원본은 33층 앞까지 아껴 둔다",
        effect: { capital: 10, time: 5, trust: 2, legitimacy: -6, humanCost: 4, fatigue: -3 },
        next: "case45_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case45_result",
      },
    ],
  },
};

/**
 * Everything else case 45 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case45 = {
  id: "case45",
  nodes: case45Nodes,
  aftermath: {
    c45_aftershock: {
      phase: "AFTERMATH",
      title: "책방의 영정",
      speaker: "이민서",
      text: "그날 저녁, 회기동 헌책방 1층. 봉안을 마치고 돌아온 사람들이 셔터를 반쯤 올린 가게에 모입니다. 임소율이 눈동자를 그려 넣은 영정 그림을 계산대 옆에 겁니다. 이제 안경 너머의 눈이 이쪽을 봅니다. 종이 볼 때 눈인지 사람 볼 때 눈인지는 아무도 묻지 않습니다. 임재윤은 두바이행 비행기를 일주일 미뤘고, 권도현은 벌써 이 가게의 한 달 임대료와 보리차 값을 계산하고 있습니다. 문가을이 떡 상자를 내려놓습니다. '이번 건 다 쪄졌어요. 확인은 안 해 주실 거면서.' 그때 이민서가 노트북을 조용히 엽니다. '할아버지 반대 의견 디스크요. 에코가 제일 처음 배운 기록이잖아요. 이 뒷장을 에코한테 보여 주고 싶어요. 반대하는 법을 가르쳐 준 사람이 지운 동의를요.' 임소율이 봉투를 가방에 넣으며 고개를 끄덕입니다. '그럼 제가 들고 갈게요. 할아버지는 기계 욕을 제일 많이 하셨지만요.' 이민서의 화면에는 에코라는 이름 옆에 낯선 일정표 하나가 떠 있습니다.",
      memo: ["임경수 봉안: 9월 17일 오후", "헌책방 1층 계산대 옆: 눈을 그려 넣은 영정", "임재윤, 출국 일주일 연기", "이민서: 에코에게 뒷장을 보여 주고 싶다"],
      triggers: ["affection", "curiosity", "choice"],
      choices: [
        { id: "c45_after_warm", label: "오늘 밤은 셔터를 내릴 때까지 임소율 가족 곁에 남는다", effect: { trust: 11, humanCost: -5, time: -3, capital: -2, fatigue: -8 }, next: "case45_result", cognition: { reframing: 2 } },
        { id: "c45_after_record", label: "뒷장 원본을 임소율과 함께 스캔하고 보관 확인서로 남긴다", effect: { legitimacy: 15, trust: 3, time: -5, capital: -2, fatigue: 5 }, next: "case45_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c45_after_rush", label: "조문 복장 그대로 이민서와 판교로 가서 에코부터 찾는다", effect: { capital: 7, legitimacy: 5, trust: -6, humanCost: 3, fatigue: 5 }, next: "case45_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c45_final", "c45_aftershock"],
  connectiveScenes: [
    ["c45_guestbook", "c45_wreath", "c45_stories", "방명록 둘째 권", "도윤하", "접수대의 방명록이 둘째 권으로 넘어갑니다. 도윤하가 조문객을 맞다가 한 노인 앞에서 펜을 멈춥니다. 성수동에서 42년째 인쇄소를 한다는 그는 이름 옆에 한 줄을 더 씁니다. '1997년 8월, 대출 거절당한 사람.' 도윤하가 쳐다보자 노인이 웃습니다. '기계 두 대 더 들이려고 빌리러 갔어요. 이 양반이 안 된다고, 석 달만 기다려 보라고. 석 달 뒤에 나라가 휘청했잖아요. 그 돈 빌렸으면 나는 그해 망했어요.' 노인이 봉투 대신 둘둘 만 달력 한 부를 제단에 올립니다. 내년 달력입니다. '해마다 한 부씩 책방에 갖다 드렸어요. 올해 것도 찍어 놨는데.'", ["방명록 둘째 권 -- 조문객 400명 넘음", "성수동 인쇄소 사장: '1997년 8월, 대출 거절당한 사람'", "제단 위 내년 달력 -- 해마다 책방에 한 부씩"], ["그 이야기를 임소율에게 직접 들려 달라고 부탁한다", "방명록에 '고인이 거절한 대출' 칸을 따로 만든다", "줄이 길어 인사만 받고 다음 조문객을 안내한다"]],
    ["c45_portrait", "c45_stories", "c45_envelope", "그리다 만 눈", "임소율", "새벽 3시, 상주 휴게실. 임소율이 영정 그림을 액자에서 꺼내 무릎에 올려놓고 네임펜을 쥐고 있습니다. 급하게 그리느라 눈동자를 비워 뒀답니다. 안경 닦는 손에 가려 멀리서는 아무도 몰랐습니다. '제가 기억하는 할아버지 눈은 종이 볼 때 눈이에요. 저 볼 때 눈은 잘 모르겠어요.' 펜 뚜껑을 닫았다 열었다 합니다. '당신 반대 의견서 읽을 때는 어떤 눈이었을까요. 그걸 그리고 싶은데.' 당신은 그 장면을 본 적이 없습니다. 3년 전 그 종이가 그의 책상에 올라갔다는 것도 한참 뒤에야 알았습니다.", ["영정 그림: 눈동자가 비어 있음", "임소율의 기억: '종이 볼 때 눈'", "발인까지 다섯 시간"], ["모른다고 솔직히 말하고 곁에서 함께 기억을 모은다", "옛 사원증 사진과 기록을 찾아 눈을 맞춰 보자고 한다", "눈은 비워 둔 채 발인 준비로 넘어가자고 한다"]],
    ["c45_indent", "c45_envelope", "c45_final", "눌린 자국", "반재욱", "반재욱이 손전등을 꺼내 종이와 거의 나란하게 눕힙니다. 감사팀에서 17년 동안 고친 서류를 가려내던 손입니다. '지운 자국 말고 하나 더 있습니다.' 뒷면 위쪽 여백에 글자가 파여 있습니다. 잉크도 연필 가루도 없이, 위에 겹쳐 둔 종이에 누가 꾹꾹 눌러 쓴 자국만 남았습니다. 반재욱이 한 글자씩 읽습니다. '작성자 이름 -- 따로 적어 둘 것. 윤.' 그가 손전등을 끄고 자기 수첩 맨 뒷장을 폅니다. 연필로 쓴 당신의 이름과, 당신이 트리거랩으로 밀려나기 2주 전 날짜가 있습니다. '제 책상에 당신 이름이 왜 올라왔는지 3년 동안 몰랐습니다. 누가 따로 적어 두라고 했던 거네요.'", ["눌린 자국: '작성자 이름 -- 따로 적어 둘 것. 윤.'", "원본에만 남는 자국 -- 사본과 사진으로는 안 보임", "반재욱 수첩 뒷장: 당신 이름, 트리거랩 이동 2주 전 날짜"], ["반재욱과 함께 이 줄의 뜻을 임소율에게 먼저 설명한다", "눌린 자국은 손대지 말고 감정 기관에 원본째 맡기자고 한다", "이 한 줄은 당분간 우리끼리만 알고 33층까지 아껴 둔다"]],
  ],
  connectiveOrder: [["c45_wreath", "c45_guestbook"], ["c45_stories", "c45_portrait"], ["c45_envelope", "c45_indent"]],
  choiceEffects: {
    c45_wreath: [
      { trust: 10, humanCost: -5, time: -4, capital: -2, fatigue: 3 },
      { legitimacy: 10, trust: 3, time: -4, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 3, trust: -1, humanCost: 4, fatigue: -3 },
    ],
    c45_stories: [
      { trust: 11, humanCost: -4, time: -3, fatigue: 5 },
      { legitimacy: 8, trust: 3, time: -5, capital: -2, fatigue: 3 },
      { time: 5, capital: 3, trust: -1, humanCost: 4, fatigue: -4 },
    ],
    c45_envelope: [
      { trust: 11, humanCost: -4, legitimacy: 2, time: -3, fatigue: 4 },
      { legitimacy: 11, trust: 2, time: -5, capital: -3, fatigue: 3 },
      { capital: 5, time: 4, trust: -1, humanCost: 4, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c45_wreath: {
      voice: ["그 이야기를, 임소율에게 직접 들려 달라고 부탁한다.", "방명록에 '고인이 거절한 대출' 칸을, 따로 만든다.", "줄이 길어, 인사만 받고 다음 조문객을 안내한다."],
      echo: ["노인이 임소율 앞에 앉아 달력을 펼칩니다. 해마다 8월 칸에 작은 동그라미가 있습니다. 거절당한 날이라고 합니다.", "칸이 생기자 이름이 붙기 시작합니다. 밤 열 시까지 열한 명이 그 칸에 씁니다. 모두 '고맙습니다'로 끝납니다.", "줄은 빨라집니다. 노인은 달력만 두고 조용히 나가고, 그 이야기는 방명록 한 줄로 남습니다."],
    },
    c45_stories: {
      voice: ["모른다고 솔직히 말하고, 곁에서 함께 기억을 모은다.", "옛 사원증 사진과 기록을 찾아, 눈을 맞춰 보자고 한다.", "눈은 비워 둔 채, 발인 준비로 넘어가자고 한다."],
      echo: ["모른다고 하자 임소율이 오히려 웃습니다. 새벽 네 시까지 여섯 사람이 한 가지씩 기억을 보탭니다. 전부 안경을 닦던 순간입니다.", "사원증 사진 속 눈은 서른여섯 살입니다. 똑같이 그리면 닮았지만, 임소율은 할아버지 같지 않다고 합니다.", "눈 없는 영정이 운구차에 오릅니다. 멀리서는 아무도 모르고, 임소율만 압니다."],
    },
    c45_envelope: {
      voice: ["반재욱과 함께, 이 줄의 뜻을 임소율에게 먼저 설명한다.", "눌린 자국은 손대지 말고, 감정 기관에 원본째 맡기자고 한다.", "이 한 줄은 당분간 우리끼리만 알고, 33층까지 아껴 둔다."],
      echo: ["설명을 들은 임소율이 종이를 한참 봅니다. '할아버지는 이 줄도 알고 계셨겠죠. 그래서 안 태우신 거고요.'", "원본째 맡기면 자국은 온전히 남습니다. 대신 봉투는 오늘 가족 손을 떠납니다.", "아껴 둔 한 줄은 안전합니다. 반재욱은 수첩 뒷장을 덮고, 3년 동안 몰랐던 이유를 며칠 더 혼자 삼킵니다."],
    },
  },
  reactionScenes: [
    ["c45_guestbook_reaction", "c45_guestbook", "c45_stories", "8월의 졸업식", "임재윤", "빈소 뒤 옥외 벤치에서 임재윤이 캔커피를 땁니다. 두바이 사막에서 11년째 바닷물을 먹는 물로 바꾸는 설비를 짓는 사람입니다. '저 달력 할아버지, 아버지가 거절한 날을 기념한대요. 1997년 8월 22일.' 그가 웃습니다. 웃는 얼굴이 아닙니다. '그날 제 대학 졸업식이었어요. 후기 졸업이라 식장이 반은 비었는데, 아버지 자리도 비었어요. 남의 인쇄소 기계는 기억하면서.' 캔이 천천히 찌그러집니다. '발인 끝나면 책방 종이는 전부 폐지로 넘길 겁니다. 아버지 말대로요. 태워야 없어진다면서요.'", ["그 졸업식 이야기가 끝날 때까지 곁에서 듣는다", "종이를 넘기기 전에 목록부터 만들자고 제안한다", "가족의 일이라며 말을 보태지 않고 자리를 뜬다"]],
    ["c45_portrait_reaction", "c45_portrait", "c45_envelope", "비운 칸", "한서윤", "새벽 4시, 3호 빈소 앞. 대기 상태로 다섯 달째 출근하지 못하는 한서윤이 검은 코트 차림으로 서 있습니다. 들어오지 못하고 30분을 서 있었다고 합니다. 3년 전 당신의 반대 의견서를 반려한 사람입니다. 그가 절을 마치고 나와 벽에 기댑니다. '지난달에 선생님이 전화를 하셨어요. 처음이었어요. 딱 한마디 하시더라고요. 자네 칸, 나도 봤네. 나도 칸 하나를 비웠어.' 한서윤이 손가락으로 벽을 한 번 두드립니다. '무슨 칸이냐고 물을 틈도 없이 끊으셨어요. 저는 그게 제 서명 이야기인 줄만 알았어요.'", ["한서윤을 빈소 안으로 들여 임소율에게 소개한다", "그 통화의 날짜와 말을 그대로 적어 둔다", "새벽이 늦었으니 오늘은 돌아가 쉬라고 한다"]],
    ["c45_indent_reaction", "c45_indent", "c45_final", "편지의 둘째 장", "임재윤", "해가 뜰 무렵, 빈소 뒤 옥외 벤치에서 임재윤이 편지의 둘째 장을 읽습니다. 임소율이 아버지 몫이라며 건넨 장입니다. 첫 줄에 날짜가 있습니다. '1997년 8월 22일.' 그 아래. '재윤아. 그날 나는 성수동 인쇄소 서류를 보고 있었다. 네 졸업식 날이었다. 그 날짜를 여기 적는다. 미안하다고 적는다. 종이에 적어야 내가 안 잊으니까. 잊은 적은 없다.' 임재윤이 한참 종이를 봅니다. 웃음인지 울음인지 모를 소리가 납니다. '평생 사과도 서류로 하시네. 그것도 29년 걸려서.' 그가 편지를 접어 셔츠 주머니에 넣습니다. '책방 종이, 폐지로 안 넘길게요. 대신 저도 좀 읽어 볼래요.'", ["편지를 끝까지 읽을 수 있게 조용히 자리를 비켜 준다", "이 편지도 원본과 함께 보관하자고 조심스레 청한다", "발인 시간이 다가온다며 준비를 서두르자고 한다"]],
  ],
  reactionEffects: {
    c45_guestbook: [
      { trust: 8, humanCost: -4, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 2, capital: -2, time: -4, fatigue: 3 },
      { time: 4, capital: 3, humanCost: 3, legitimacy: -2, fatigue: -4 },
    ],
    c45_portrait: [
      { trust: 11, humanCost: -3, legitimacy: -2, time: -3, fatigue: 4 },
      { legitimacy: 9, trust: 2, time: -3, capital: -2, fatigue: 2 },
      { time: 5, capital: 2, trust: 1, humanCost: 3, fatigue: -3 },
    ],
    c45_indent: [
      { trust: 10, humanCost: -4, time: -2, capital: -1, fatigue: 3 },
      { legitimacy: 8, trust: 3, time: -3, humanCost: 1, fatigue: 3 },
      { time: 4, capital: 3, trust: -1, legitimacy: 1, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c45_guestbook: {
      voice: ["그 졸업식 이야기가 끝날 때까지, 곁에서 듣는다.", "종이를 넘기기 전에, 목록부터 만들자고 제안한다.", "가족의 일이라며, 말을 보태지 않고 자리를 뜬다."],
      echo: ["들어 주면 임재윤은 졸업식 날 혼자 찍은 사진 이야기를 합니다. 학사모가 삐뚤어져 있었다고 합니다. 고쳐 줄 사람이 없어서요.", "목록 이야기에 임재윤이 코웃음을 칩니다. '아버지랑 똑같은 말을 하시네.' 그래도 폐지 업체 전화는 걸지 않습니다.", "자리를 뜨면 벤치에는 찌그러진 캔 하나와 임재윤만 남습니다. 폐지 업체 번호가 휴대폰 화면에 떠 있습니다."],
    },
    c45_portrait: {
      voice: ["한서윤을 빈소 안으로 들여, 임소율에게 소개한다.", "그 통화의 날짜와 말을, 그대로 적어 둔다.", "새벽이 늦었으니, 오늘은 돌아가 쉬라고 한다."],
      echo: ["소개를 받은 임소율이 한서윤을 오래 봅니다. 그리고 할아버지 그림 앞 방석을 하나 더 내줍니다.", "적어 둔 한 줄은 날짜가 붙은 기록이 됩니다. 한서윤이 그 줄을 보고 '이건 제가 증언할게요'라고 합니다.", "돌아가라는 말에 한서윤이 고개를 숙이고 나갑니다. 엘리베이터 앞에서 한 번 뒤를 돌아봅니다."],
    },
    c45_indent: {
      voice: ["편지를 끝까지 읽을 수 있게, 조용히 자리를 비켜 준다.", "이 편지도 원본과 함께 보관하자고, 조심스레 청한다.", "발인 시간이 다가온다며, 준비를 서두르자고 한다."],
      echo: ["자리를 비켜 주면 벤치에서 오래 기침 같은 소리가 납니다. 돌아왔을 때 임재윤은 셔츠 단추를 끝까지 잠그고 있습니다.", "함께 보관하자는 말에 임재윤이 잠깐 망설이다 고개를 젓습니다. '이 장은 제 거예요. 다른 장은 드릴게요.'", "서두르자는 말에 임재윤이 일어섭니다. 편지는 읽다 만 채로 주머니에 들어갑니다."],
    },
  },
  reactionMemos: {
    c45_guestbook_reaction: ["1997년 8월 22일: 거절한 날, 졸업식 날", "'발인 끝나면 종이는 폐지로'"],
    c45_portrait_reaction: ["지난달 임경수의 전화: '나도 칸 하나를 비웠어'", "반려한 사람이 30분 동안 들어오지 못한 빈소"],
    c45_indent_reaction: ["둘째 장: '1997년 8월 22일, 미안하다고 적는다'", "책방 종이를 폐지로 넘기지 않기로"],
  },
  branchPlan: ["c45_wreath", 2, "c45_branch_ribbon", "c45_branch_ribbon_follow"],
  branchScenes: {
    // CASE 45's detour opens only for the one who tears the ribbon off. The
    // florist's order form is in 윤상혁's own pencil, and the line he wanted on
    // the ribbon was longer than his name. That night he comes himself.
    c45_branch_ribbon: {
      phase: "SIDE DOOR",
      title: "리본의 글씨",
      speaker: "오진우",
      text: "리본을 들고 복도 끝으로 나와 조화 받침대에 붙은 꽃집 번호를 누릅니다. 여의도의 꽃집 사장은 처음엔 말을 아끼다가, 오진우가 '돌아가신 분 손녀가 누가 보낸 건지 알고 싶어 해요'라고 하자 주문서 사진을 보내 줍니다. 비서실 카드가 아닙니다. 어제 저녁 윤상혁이 직접 가게에 와서 개인 카드로 계산했고, 리본 문구를 연필로 적어 두고 갔습니다. 원래 문구에는 줄이 그어져 있습니다. '빚진 사람 윤상혁.' 사장이 리본에 다 안 들어간다고 해서 이름만 남겼답니다. 오진우가 사진을 확대합니다. '윤' 자의 마지막 획이 위로 꺾여 있습니다. 3년 전 반대 의견서 사본 뒷장, '반려 -- 윤'의 그 획입니다.",
      memo: ["주문자: 윤상혁 본인, 개인 카드, 9월 15일 19시", "지워진 원래 문구: '빚진 사람 윤상혁'", "연필 '윤' 자 -- 끝 획이 위로 꺾임", "비교 대상: 반대 의견서 사본 뒷장의 '반려 -- 윤'"],
      triggers: ["curiosity", "injustice", "selfAwareness"],
      choices: [
        { id: "c45_branch_ribbon_a", label: "리본을 도로 들고 가 임소율에게 달지 뗄지 정하게 한다", effect: { trust: 11, humanCost: -4, legitimacy: 2, time: -3, capital: -2, fatigue: 4 }, next: "c45_branch_ribbon_follow", cognition: { reframing: 2 } },
        { id: "c45_branch_ribbon_b", label: "주문서 원본을 꽃집에서 받아 글씨 비교 자료로 봉해 둔다", effect: { legitimacy: 13, trust: 2, time: -5, humanCost: 2, fatigue: 4 }, next: "c45_branch_ribbon_follow", cognition: { inference: 2 } },
        { id: "c45_branch_ribbon_c", label: "사진만 서하린에게 넘기고 리본은 말없이 제자리에 단다", effect: { capital: 6, time: 4, legitimacy: -4, trust: 1, humanCost: 3, fatigue: -3 }, next: "c45_branch_ribbon_follow", cognition: { risk: 1 } },
      ],
    },
    c45_branch_ribbon_follow: {
      phase: "SIDE DOOR",
      title: "자정의 조문객",
      speaker: "윤상혁",
      text: "그날 밤 11시 40분, 조문객이 끊긴 3호 빈소에 윤상혁이 혼자 들어옵니다. 변호인도 비서도 없습니다. 임재윤이 일어서다 임소율에게 소매를 잡힙니다. 윤상혁은 그림으로 된 영정을 한참 보다가 두 번 절하고, 향을 꽂는 손이 한 번 떨립니다. 흰 봉투를 조의금함 앞에 내려놓자 임소율이 고개를 젓습니다. 그는 봉투를 도로 넣습니다. 나가는 길에 당신 옆에서 걸음을 멈춥니다. '이 사람은 끝까지 내 이름을 기다리더군. 종이 한 장 들고.' 목소리가 낮습니다. '그 얘기는 여기서 하지 않겠네. 여기는 이 사람 자리니까.' 방명록 앞을 지나가는 그의 손에는 펜이 없습니다. 접수대의 도윤하가 펜을 들고 그를 봅니다.",
      memo: ["23:40 윤상혁 단독 조문 -- 수행원 없음", "조의금 봉투: 임소율이 거절", "'그 얘기는 여기서 하지 않겠네'", "방명록: 아직 그의 이름 없음"],
      triggers: ["choice", "trust", "injustice"],
      choices: [
        { id: "c45_branch_ribbon_follow_a", label: "그가 빈소를 나갈 때까지 임소율 곁을 말없이 지킨다", effect: { trust: 11, humanCost: -3, time: -3, capital: -2, fatigue: 4 }, next: "c45_guestbook", cognition: { persistence: 2 } },
        { id: "c45_branch_ribbon_follow_b", label: "방명록에 그의 이름을 본인 손으로 쓰고 가라고 청한다", effect: { legitimacy: 12, trust: 3, time: -4, humanCost: 2, fatigue: 4 }, next: "c45_guestbook", cognition: { inference: 2 } },
        { id: "c45_branch_ribbon_follow_c", label: "복도로 따라 나가 3년 전 그 칸을 지금 묻는다", effect: { capital: 5, time: 4, trust: -1, legitimacy: -3, humanCost: 3, fatigue: -3 }, next: "c45_guestbook", cognition: { risk: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c45_start",
    result: "c45_aftershock",
    defaultFree: "c45_route_system",
    // A funeral runs on its own clock and nobody in the room can stop it. Like
    // 사건 12 the case is a single line; the split is what happens to one sheet
    // of paper before the hearse leaves.
    choices: {},
    system: {
      route: "c45_route_system",
      final: "c45_final_system_route",
      title: "고인의 종이",
      speaker: "이민서",
      text: "준비된 보기 밖의 문장을 쓰자, 이민서가 접객실 구석에서 노트북을 엽니다. 서하린이 모아 둔 자료와 공개된 판결문을 겹쳐 봅니다. 지난 10년 동안 KD금융그룹이 퇴직자나 그 유족에게 보낸 내용증명(누가 언제 무엇을 요구했는지 우체국이 증명해 주는 편지) 가운데 '회사 문서 반환'을 요구한 것은 23건입니다. 그중 19건이 당사자가 세상을 떠나고 일주일 안에 도착했습니다. 17건에서 유족은 상자를 열어 보지도 않고 돌려보냈습니다. 돌려받은 상자가 어디서 열렸는지 적힌 기록은 한 건도 없습니다. 이민서가 화면을 돌립니다. '사람이 떠나면 종이가 제일 먼저 불려 가요. 장례 치르느라 아무도 못 읽을 때요.'",
      memo: ["문서 반환 요구 23건 중 19건: 사망 후 일주일 안", "유족이 열지 않고 돌려보낸 상자 17건", "돌려받은 상자의 개봉 기록 0건"],
      routeChoices: [
        ["c45_route_system_publish", "통계를 서하린과 조문객들에게 동시에 알린다", { legitimacy: 10, trust: 5, capital: -5, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c45_route_system_grace", "유족에게 보내는 반환 요구에 49일 유예를 붙이는 규칙안을 낸다", { legitimacy: 10, trust: 7, time: -8, humanCost: 2, fatigue: 6 }, { reframing: 2 }],
        ["c45_route_system_drop", "통계는 덮어 두고 장례부터 치른다", { time: 7, capital: 5, trust: -5, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "유족이 고인의 종이를 먼저 읽을 권리를 회사 규정에 넣자고 제안한다", { legitimacy: 12, trust: 9, capital: -6, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "규정은 그대로 두고 이번 반환 요구만 막는다", { capital: 7, time: 6, trust: -4, legitimacy: -7, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "열어 보지 않고 돌려보낸 상자 17개를 유족에게 되돌리라고 요구한다", { legitimacy: 9, trust: 10, capital: -7, time: -5, humanCost: 2, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c45_evidence_turn",
    result: "c45_aftershock",
    sourceRoutes: ["c45_wreath", "c45_stories", "c45_envelope", "c45_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 무죄가 난 네 건의 승인 문서 옆에 놓고, 여백의 연필 자국이 누구 손인지 맞춰 본다.",
    entryEcho: "단서를 대면 빈칸 네 개가 같은 문장을 품고 있다는 게 드러납니다. 그 문장의 원본은 지금 상복 안주머니에 있습니다.",
    title: "같은 연필",
    speaker: "반재욱",
    text: "단서를 맞추자 1심에서 무죄가 난 네 건의 승인 문서가 노트북 화면에 나란히 뜹니다. 서명란이 비어 있어 누가 승인했는지 특정할 수 없다던 바로 그 네 장입니다. 이민서가 스캔 파일의 명암 대비를 끝까지 올리자 네 장 모두 오른쪽 여백에서 지운 연필 자국이 떠오릅니다. 같은 문장입니다. '사유는 묻지 말 것.' 반재욱이 임경수의 봉투에서 나온 원본을 그 옆에 놓습니다. '반려 -- 윤. 사유는 묻지 말 것.' 스캔으로는 필적 감정(글씨를 비교해 누가 썼는지 가려내는 감정)을 할 수 없습니다. 연필을 누른 힘과 획의 순서가 살아 있는 종이는 이 한 장뿐입니다. 반재욱이 수첩에 적습니다. '빈칸 네 개를, 종이 한 장이 채울 수 있다.' 그리고 덧붙입니다. '채우는 순간 지운 동의도 같이 읽힙니다.'",
    memo: ["무죄 4건 승인 문서 여백: 지운 연필 '사유는 묻지 말 것'", "필적 감정이 가능한 원본: 임경수의 뒷장 한 장", "항소장 마감: 9월 17일 자정"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 7, trust: 2, time: -6, fatigue: 3 },
    choices: [
      ["c45_evidence_turn_submit", "네 장의 연필 자국과 뒷장 원본을 묶어 필적 감정을 정식 요청한다", { legitimacy: 14, trust: 4, capital: -6, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
      ["c45_evidence_turn_hold", "연필 자국은 알아 두고 법무팀과의 반환 협상 카드로 쓴다", { capital: 8, time: 5, trust: -5, legitimacy: -4, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c45_evidence_turn_family", "원본을 내기 전에 임소율 가족에게 이 연결부터 설명한다", { trust: 13, legitimacy: 6, capital: -5, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c45_branch_ribbon",
    systemNext: "c45_route_system",
    evidenceNext: "c45_evidence_turn",
    routeLabel: "직전 사건의 방청석 자리표로 빈소 조문 당번을 나눈다",
    systemLabel: "직전 자유응답 문장이 법무팀의 반환 요구서에도 인용됐는지 본다",
    evidenceLabel: "직전 단서를 붙여 무죄 네 건의 여백에서 같은 연필을 찾는다",
  },
  openingRoutes: {
    c44_after_warm: "c45_start_warm",
    c44_after_record: "c45_start_record",
    c44_after_rush: "c45_start_rush",
  },
  openingCopy: {
    c45_start_warm: ["떡 냄새를 알아본 사람의 빈소", "문가을", "선고 날 밤, 남은 떡을 싸 들고 열한 명이 이음병원 병실 창가에 섰습니다. 임경수는 판결 이야기 대신 '떡이 덜 쪄졌어' 한마디를 했고, 문가을이 '다 드시면서요' 하자 처음으로 소리 내어 웃었습니다. 그 밤이 마지막 대화였습니다. 닷새 뒤 새벽 4시 50분, 그가 세상을 떠났습니다. 3호 빈소 영정 자리에는 임소율이 밤새 그린 그림이 서 있고, 제단 앞에는 문가을이 가져온 떡 한 접시가 놓여 있습니다. 상주(장례를 대표해 조문을 받는 가족)인 아버지가 아직 비행기 안이라 임소율이 그 자리를 지킵니다. 그가 누런 봉투를 꺼냅니다. '셋째 날 새벽에 열 것. 그날 밤 떡 드시고 나서 저한테 주신 거예요. 율이랑 반대 의견 쓴 사람이 같이 열래요.'", ["선고 날 밤 병실: 열한 명, 떡 한 보따리", "임경수의 마지막 말: '떡이 덜 쪄졌어'", "봉투 겉면: '율이와 반대 의견 쓴 사람이 같이'"]],
    c45_start_record: ["해설본을 읽어 드린 사람의 빈소", "임소율", "판결 해설본은 새벽 두 시에 끝났고, 아침에 병실로 가서 첫 문장을 소리 내어 읽어 드렸습니다. '빈칸은 무죄가 아닙니다.' 임경수가 눈을 감은 채 손을 내밀어 빨간 펜을 달라고 했습니다. 그리고 둘째 줄의 띄어쓰기 하나를 고쳤습니다. 그것이 그의 마지막 교정이었습니다. 닷새 뒤 새벽, 그가 세상을 떠났습니다. 3호 빈소 영정 자리에는 임소율이 그린 그림이 서 있습니다. 상주(장례를 대표해 조문을 받는 가족)인 아버지가 아직 비행기 안이라 임소율이 그 자리를 지킵니다. 그가 해설본 옆에 누런 봉투를 내려놓습니다. '셋째 날 새벽에 열래요. 할아버지가 빨간 펜 내려놓고 하신 말이 그거예요. 순서는 지켜라.'", ["해설본 첫 문장: '빈칸은 무죄가 아닙니다'", "임경수의 마지막 교정: 띄어쓰기 한 곳", "봉투 겉면: '셋째 날 새벽에 열 것'"]],
    c45_start_rush: ["부재중 전화 두 통의 빈소", "임소율", "선고 날 밤, 검찰청 불이 꺼질 때까지 나은호와 항소 이유를 짰습니다. 그사이 임소율의 부재중 전화가 두 통 쌓였습니다. 다음 날 아침 병실에 갔을 때 임경수는 잠들어 있었고, 당신이 있는 동안 다시 눈을 뜨지 않았습니다. 닷새 뒤 새벽 4시 50분, 그가 세상을 떠났습니다. 3호 빈소에서 상주(장례를 대표해 조문을 받는 가족) 자리를 대신 지키던 임소율이 당신을 보고 잠깐 말이 없습니다. 그러다 휴대폰 통화 기록을 보여 줍니다. '그 두 통요. 할아버지가 당신 이름을 두 번 부르셔서 건 거예요.' 그가 누런 봉투를 꺼냅니다. '이건 셋째 날 새벽에 같이 열래요. 이번엔 오세요.'", ["선고 날 밤: 검찰청에서 23시까지", "부재중 전화 2통 -- 임경수가 이름을 부른 횟수", "봉투 겉면: '셋째 날 새벽에 열 것'"]],
  },
  openingSignatures: {
    c45_start_warm: {
      label: "그 밤의 열한 명과 사흘 동안의 빈소 당번표를 짠다",
      effect: { trust: 12, humanCost: -4, capital: -3, time: -4, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "그 밤의 열한 명과, 사흘 동안의 빈소 당번표를 짠다.",
      echo: "당번표가 붙자 빈소가 한 번도 비지 않습니다. 새벽 당번 칸에는 강태민이 이름을 세 번 적습니다.",
    },
    c45_start_record: {
      label: "빨간 펜이 고친 해설본을 조문객 안내문으로 만든다",
      effect: { legitimacy: 11, trust: 3, capital: -3, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "빨간 펜이 고친 해설본을, 조문객 안내문으로 만든다.",
      echo: "안내문 맨 위에 고친 띄어쓰기가 그대로 남습니다. 조문객들이 그 한 칸을 보고 고인을 알아봅니다.",
    },
    c45_start_rush: {
      label: "그 두 통을 놓친 이유를 임소율에게 변명 없이 말한다",
      effect: { trust: 9, legitimacy: 4, humanCost: -2, time: -3, fatigue: 6 },
      cognition: { persistence: 2 },
      voice: "그 두 통을 놓친 이유를, 임소율에게 변명 없이 말한다.",
      echo: "말을 들은 임소율이 고개를 끄덕입니다. '할아버지도 그러셨을 거예요. 일하느라.' 그 말이 위로인지 아닌지 당신은 모릅니다.",
    },
  },
  voiceLines: {
    // CASE 45. A funeral. Every line is said in a room where someone is
    // grieving, so none of them is allowed to sound like a plan.
    c45_start_stay: "상복 소매를 걷고, 임소율 곁에서 조문객을 맞는다.",
    c45_start_notify: "봉투가 있다는 사실만, 나은호 검사에게 먼저 알려 둔다.",
    c45_start_open: "셋째 날까지 기다리지 말고, 봉투를 지금 열자고 한다.",
    c45_wreath_family: "조화와 서류는 가족 뜻부터 묻고, 법무팀은 입구 밖에 세운다.",
    c45_wreath_reply: "발인 뒤 정식 절차로 답하겠다는 서면을, 그 자리에서 쓴다.",
    c45_wreath_ribbon: "윤상혁의 리본을 떼어 들고, 누가 보냈는지 꽃집부터 캐묻는다.",
    c45_branch_ribbon_a: "리본을 도로 들고 가, 임소율에게 달지 뗄지 정하게 한다.",
    c45_branch_ribbon_b: "주문서 원본을 꽃집에서 받아, 글씨 비교 자료로 봉해 둔다.",
    c45_branch_ribbon_c: "사진만 서하린에게 넘기고, 리본은 말없이 제자리에 단다.",
    c45_branch_ribbon_follow_a: "그가 빈소를 나갈 때까지, 임소율 곁을 말없이 지킨다.",
    c45_branch_ribbon_follow_b: "방명록에 그의 이름을, 본인 손으로 쓰고 가라고 청한다.",
    c45_branch_ribbon_follow_c: "복도로 따라 나가, 3년 전 그 칸을 지금 묻는다.",
    c45_stories_stay: "이야기가 끝날 때까지 남아, 임소율 몫까지 받아 적는다.",
    c45_stories_archive: "조문객 동의를 받아, 이 이야기들을 추모 기록으로 남긴다.",
    c45_stories_meeting: "웃음은 여기서 끊고, 법무팀 서류에 대응할 회의를 연다.",
    c45_envelope_read: "임소율과 함께, 편지 두 장을 끝까지 소리 내어 읽는다.",
    c45_envelope_log: "개봉 시각과 입회자를 적고, 원본을 그 자리에서 봉한다.",
    c45_envelope_send: "편지는 나중에 읽고, 원본 사진부터 나은호에게 보낸다.",
    c45_final_family: "원본의 길은 임소율 가족이 정하게 두고, 관을 함께 든다.",
    c45_final_submit: "지운 동의까지 담긴 원본을, 증거로 내자고 가족에게 청한다.",
    c45_final_hold: "사본만 붙여 항소부터 걸고, 원본은 33층 앞까지 아껴 둔다.",
    c45_after_warm: "오늘 밤은 셔터를 내릴 때까지, 임소율 가족 곁에 남는다.",
    c45_after_record: "뒷장 원본을 임소율과 함께 스캔하고, 보관 확인서로 남긴다.",
    c45_after_rush: "조문 복장 그대로, 이민서와 판교로 가서 에코부터 찾는다.",
    c45_route_system_publish: "통계를, 서하린과 조문객들에게 동시에 알린다.",
    c45_route_system_grace: "유족에게 보내는 반환 요구에, 49일 유예를 붙이는 규칙안을 낸다.",
    c45_route_system_drop: "통계는 덮어 두고, 장례부터 치른다.",
    c45_final_system_route_a: "유족이 고인의 종이를 먼저 읽을 권리를, 회사 규정에 넣자고 제안한다.",
    c45_final_system_route_b: "규정은 그대로 두고, 이번 반환 요구만 막는다.",
    c45_final_system_route_c: "열어 보지 않고 돌려보낸 상자 17개를, 유족에게 되돌리라고 요구한다.",
    c45_evidence_turn_submit: "네 장의 연필 자국과 뒷장 원본을 묶어, 필적 감정을 정식 요청한다.",
    c45_evidence_turn_hold: "연필 자국은 알아 두고, 법무팀과의 반환 협상 카드로 쓴다.",
    c45_evidence_turn_family: "원본을 내기 전에, 임소율 가족에게 이 연결부터 설명한다.",
  },
  echoReplies: {
    // CASE 45.
    c45_start_stay: "곁에 서면 임소율이 절하는 순서를 틀릴 때마다 당신 소매를 당깁니다. 첫날 밤 조문객 212명에게 둘이 함께 고개를 숙입니다.",
    c45_start_notify: "알려 두면 나은호의 답이 1분 만에 옵니다. '열면 바로 연락.' 임소율은 봉투 이야기가 검찰에 먼저 간 걸 나중에 압니다.",
    c45_start_open: "지금 열자는 말에 임소율이 봉투를 가슴에 붙입니다. '할아버지가 순서를 정하셨어요.' 봉투는 열리지 않고, 둘 사이에 하루치 거리가 생깁니다.",
    c45_wreath_family: "가족에게 묻자 임재윤이 윤상혁의 조화를 복도 끝으로 옮깁니다. 하승원은 입구 밖에서 두 시간을 서 있다가 명함만 두고 갑니다.",
    c45_wreath_reply: "서면을 받은 하승원이 처음으로 서류에서 눈을 뗍니다. '발인 뒤라면, 위에 그렇게 전하겠습니다.' 그가 조의금함 앞에서 잠깐 멈췄다가 지나갑니다.",
    c45_wreath_ribbon: "리본을 떼자 임재윤이 처음으로 당신 편을 듭니다. 임소율은 그 빈자리를 한참 봅니다. 누가 보냈든 꽃은 꽃이라고 생각하는 얼굴입니다.",
    c45_branch_ribbon_a: "리본을 받은 임소율이 한참 생각하다가 조화 맨 끝에 답니다. '빚진 사람이면 줄 맨 뒤에 서야죠.'",
    c45_branch_ribbon_b: "주문서 원본은 비닐봉투에 담겨 옵니다. 꽃집 사장이 한마디 덧붙입니다. '그분, 문구 쓰다가 세 번 지웠어요.'",
    c45_branch_ribbon_c: "사진은 서하린에게 가고 리본은 제자리로 돌아갑니다. 그날 밤 기사 초안의 제목은 '빚진 사람'입니다. 임소율은 그 초안을 모릅니다.",
    c45_branch_ribbon_follow_a: "곁을 지키면 임소율이 윤상혁의 등이 엘리베이터 문 뒤로 사라질 때까지 고개를 들고 있습니다. 한 번도 숙이지 않습니다.",
    c45_branch_ribbon_follow_b: "청하자 윤상혁이 도윤하의 펜을 받습니다. 방명록 칸에 '윤상혁' 세 글자를 씁니다. 마지막 획이 위로 꺾입니다. 3년 만에 그가 칸 안에 쓴 이름입니다.",
    c45_branch_ribbon_follow_c: "복도에서 묻자 윤상혁이 엘리베이터 버튼을 누릅니다. '상갓집에서 할 얘기가 아니라고 했네.' 문이 닫히고, 빈소 안에서 임소율이 당신을 찾습니다.",
    c45_stories_stay: "받아 적으면 새벽 두 시까지 스물세 개의 흉이 공책에 쌓입니다. 임소율이 제목을 붙입니다. '할아버지 흉 모음집 -- 전부 칭찬임.'",
    c45_stories_archive: "동의를 받자 여시온이 제일 먼저 손을 듭니다. 녹음 파일 첫머리에 오징어 먹물 이야기가 다시 한 번, 더 길게 들어갑니다.",
    c45_stories_meeting: "회의가 열리자 웃음이 식습니다. 대응 문안은 한 시간 만에 섭니다. 나준혁의 이야기는 칼자국 서른한 개에서 멈춘 채 남습니다.",
    c45_envelope_read: "소리 내어 읽으면 임소율이 둘째 장 앞에서 목이 멥니다. 당신이 이어 읽습니다. 끝까지 읽는 데 11분이 걸립니다.",
    c45_envelope_log: "개봉 기록에 새벽 5시 7분, 입회자 네 명이 적힙니다. 임소율이 자기 이름 옆에 작은 안경을 그려 넣습니다.",
    c45_envelope_send: "사진은 5시 12분에 나은호에게 갑니다. '원본 필요.' 답장이 오는 동안 임소율은 편지를 혼자 읽습니다.",
    c45_final_family: "관을 들면 임소율이 봉투를 쥔 채 운구차에 오릅니다. 원본이 어디로 갈지는 화장장 대기실에서 가족끼리 정합니다. 16시는 그 사이에 지나갈 수도 있습니다.",
    c45_final_submit: "청을 들은 임재윤이 먼저 동의서에 이름을 씁니다. 동의서는 오후 3시 40분에 검찰청에 닿고, 다음 날 기사에 '고인도 동의했으나 지웠다'는 문장이 실립니다. 임소율은 원본을 가방에 넣은 채 그 기사를 할아버지 그림 옆에 붙입니다.",
    c45_final_hold: "사본은 항소장에 붙어 자정 전에 들어갑니다. 나은호의 답장은 짧습니다. '사본으로는 감정 불가. 원본은 언제?' 임소율은 봉투를 가방 깊숙이 넣습니다.",
    c45_after_warm: "남으면 셔터가 내려간 가게에서 임재윤이 처음으로 아버지 책장 사이를 걷습니다. 에코 조각은 하룻밤 더 노트북 안에서 기다립니다.",
    c45_after_record: "스캔은 한 장씩 천천히 끝납니다. 확인서 두 장에 두 사람의 이름이 들어가고, 한 장씩 나눠 가집니다. 확대한 스캔 속 검토자 칸 옆에서 임소율의 손가락이 한 번 멈춥니다.",
    c45_after_rush: "나서는 길에 임소율이 봉투를 건넵니다. '먼저 가져가세요. 저는 내일 갈게요.' 헌책방에는 영정 그림과 가족만 남고, 문가을이 떡 상자를 하나 더 싸서 들려 보냅니다.",
    c45_route_system_publish: "알리자 조문객 몇 명이 휴대폰을 꺼냅니다. 그중 두 명이 지난해 돌려보낸 상자 이야기를 합니다. 그 상자도 열어 보지 않았다고 합니다.",
    c45_route_system_grace: "49일이라는 숫자에 나준혁이 고개를 끄덕입니다. '사십구재까지는 기다려야 사람이지.' 규칙안은 첫 줄부터 사람 말로 쓰입니다.",
    c45_route_system_drop: "덮으면 장례는 조용히 흘러갑니다. 23건은 24건이 될 수도 있습니다.",
    c45_final_system_route_a: "먼저 읽을 권리가 생기면 반환은 느려집니다. 느려진 만큼 유족이 종이의 주인을 압니다.",
    c45_final_system_route_b: "이번 요구만 막으면 임경수의 종이는 지켜집니다. 다음 유족에게는 같은 봉투가 같은 날 도착합니다.",
    c45_final_system_route_c: "되돌리라는 요구에 법무팀은 상자 목록부터 없다고 답합니다. 없다는 답도 기록이 됩니다.",
    c45_evidence_turn_submit: "정식 요청이 들어가면 네 장의 빈칸이 감정 대상이 됩니다. 결과는 항소심에서 나옵니다. 지운 동의도 그 서류철에 함께 들어갑니다.",
    c45_evidence_turn_hold: "카드로 쥐면 하승원의 두 번째 요구서가 오지 않습니다. 대신 네 장의 빈칸은 한동안 빈칸으로 남습니다.",
    c45_evidence_turn_family: "설명을 들은 임재윤이 먼저 말합니다. '아버지가 지운 거, 제가 다시 쓰진 못해도 내는 건 막지 않을게요.' 설명하는 데 한 시간이 듭니다.",
  },
  characterProfiles: {
    임재윤: {
      role: "임경수의 아들 · 두바이 담수화 설비 현장 소장",
      stance: "서운함 · 늦은 이해 · 상주",
      job: "종이에 아버지를 빼앗겼다고 믿어 온 사람이, 그 종이 사이에서 자기 날짜를 찾는다.",
      appearance: "사막 볕에 탄 목덜미, 캐리어 손잡이에 감긴 항공사 꼬리표, 빌려 입은 상복의 짧은 소매.",
      thought: "아버지는 남의 대출은 다 기억했다. 내 졸업식 날짜는 몰랐을 거다.",
      gesture: "화가 나면 캔을 천천히 찌그러뜨리고, 찌그러진 캔을 버리지 못하고 쥐고 있다.",
      voice: "현장 소장의 짧은 문장으로 말하다가, 아버지 이야기에서만 문장이 길어진다.",
      line: "평생 사과도 서류로 하시네.",
    },
    하승원: {
      role: "KD은행 법무팀 과장",
      stance: "규정 · 회수 · 체면",
      job: "장례식장에서 종이를 돌려 달라고 말하는 일을 맡는다. 그 일이 부끄러운 줄 알지만 멈추지는 않는다.",
      appearance: "조문용 검은 넥타이와 서류 가방, 가방 안에 대기 중인 두 번째 봉투.",
      thought: "나는 이 편지를 쓴 사람이 아니라 배달하는 사람이다.",
      gesture: "말하기 전에 조의금함 쪽을 한 번 보고, 시선을 서류로 내린다.",
      voice: "'바랍니다'로 끝나는 문장만 쓰고, 목소리를 한 번도 높이지 않는다.",
      line: "고인이 재직 중 반출한 문서 일체를 발인 전에 반환해 주시기 바랍니다.",
    },
    여시온: {
      role: "영동 바다결수산 대표 · 30년 전 그 오징어 공장 사장의 아들",
      stance: "은혜 · 사투리 · 오징어순대",
      job: "숫자로는 남지 않은 오래전 승인 한 건이 한 집안을 어떻게 살렸는지 들고 온다.",
      appearance: "비린내가 밴 패딩 조끼, 스티로폼 상자 네 개, 아버지를 닮은 손등의 작은 칼자국.",
      thought: "아버지 손등 칼자국을 세어 준 사람은 그 양반 하나였다.",
      gesture: "인사할 때 모자를 벗고, 그 모자로 상자 위 먼지를 턴다.",
      voice: "영동 사투리를 억지로 참다가, 웃을 때 한꺼번에 터진다.",
      line: "대출 다 갚은 공장에서 만든 거라고, 꼭 말하래요.",
    },
  },
  setting: { place: "이음병원 장례식장 · 3호 빈소", clock: "9월 15일 · 낙엽 · 19:30 · 빈소 첫날" },
  sceneContext: {
    c45_start: {
      place: "이음병원 장례식장 · 3호 빈소",
      clock: "9월 15일 · 낙엽 · 19:30 · 빈소 첫날",
      question: "셋째 날 새벽에 열라는 봉투를 손녀가 쥐고 있습니다. 첫날 밤, 무엇부터 하겠습니까?",
      lead: "선고 닷새 뒤 새벽 전화를 받고 달려온 빈소에, 사진 대신 그림으로 된 영정이 서 있습니다.",
    },
    c45_start_warm: {
      place: "이음병원 장례식장 · 3호 빈소",
      clock: "9월 15일 · 낙엽 · 19:30 · 빈소 첫날",
      question: "떡 냄새를 알아본 사람의 빈소에 그 밤의 열한 명이 다시 모였습니다. 사흘을 어떻게 지키겠습니까?",
      lead: "병실 창가에 함께 섰던 열한 명이 닷새 만에 검은 옷으로 다시 모였습니다.",
    },
    c45_start_record: {
      place: "이음병원 장례식장 · 3호 빈소",
      clock: "9월 15일 · 낙엽 · 19:30 · 빈소 첫날",
      question: "마지막 교정이 남은 해설본 옆에 순서를 지키라는 봉투가 놓였습니다. 무엇부터 하겠습니까?",
      lead: "빨간 펜 자국이 남은 해설본을 가방에 넣은 채 빈소 입구에 섰습니다.",
    },
    c45_start_rush: {
      place: "이음병원 장례식장 · 3호 빈소",
      clock: "9월 15일 · 낙엽 · 19:30 · 빈소 첫날",
      question: "놓친 전화 두 통이 당신 이름을 부른 횟수였습니다. 이 빈소에서 무엇부터 하겠습니까?",
      lead: "검찰청에서 짠 항소(1심 판결에 불복해 다시 재판해 달라고 하는 것) 이유서 초안이 아직 가방에 든 채입니다.",
    },
    c45_wreath: {
      place: "이음병원 장례식장 · 3호 빈소 입구",
      clock: "9월 16일 · 낙엽 · 14:00 · 빈소 둘째 날",
      question: "영정 옆 조화 두 개를 보낸 쪽이 같은 날 고인의 종이를 내놓으라고 합니다. 어떻게 하겠습니까?",
      lead: "둘째 날 오후, 조화 행렬이 복도 끝까지 이어지고 캐리어를 끈 상주가 막 도착했습니다.",
    },
    c45_branch_ribbon: {
      place: "이음병원 장례식장 · 조화 늘어선 빈소 앞",
      clock: "9월 16일 · 낙엽 · 14:40",
      question: "리본 문구를 연필로 쓴 손이 3년 전 '반려 -- 윤'의 손과 같아 보입니다. 이 리본을 어떻게 하겠습니까?",
    },
    c45_branch_ribbon_follow: {
      place: "이음병원 장례식장 · 3호 빈소",
      clock: "9월 16일 · 낙엽 · 23:40",
      question: "종이를 막아 온 사람이 혼자 조문을 왔고, 방명록에는 아직 그의 이름이 없습니다. 어떻게 하겠습니까?",
    },
    c45_guestbook: {
      place: "이음병원 장례식장 · 빈소 접수대",
      clock: "9월 16일 · 낙엽 · 17:20",
      question: "고인에게 대출을 거절당해 살아남았다는 사람이 달력을 두고 갑니다. 그 이야기를 어떻게 하겠습니까?",
    },
    c45_guestbook_reaction: {
      place: "이음병원 장례식장 · 빈소 뒤 옥외 벤치",
      clock: "9월 16일 · 낙엽 · 18:05",
      question: "거절한 날이 아들의 졸업식 날이었고, 아들은 종이를 폐지로 넘기겠다고 합니다. 어떻게 하겠습니까?",
    },
    c45_stories: {
      place: "이음병원 장례식장 · 3호 빈소 접객실",
      clock: "9월 16일 · 낙엽 · 23:00",
      question: "고인 흉이 칭찬으로 끝나는 밤, 손녀가 녹음 버튼 위에서 당신을 봅니다. 이 이야기들을 어떻게 하겠습니까?",
      lead: "조문객이 뜸해진 밤, 접객실 상 위에 소주병과 보리차 주전자가 나란히 놓였습니다.",
    },
    c45_portrait: {
      place: "이음병원 장례식장 · 상주 휴게실",
      clock: "9월 17일 · 낙엽 · 새벽 03:10",
      question: "영정 그림의 눈동자가 비어 있고, 손녀는 반대 의견서를 읽던 눈을 그리고 싶어 합니다. 어떻게 답하겠습니까?",
    },
    c45_portrait_reaction: {
      place: "이음병원 장례식장 · 3호 빈소 앞",
      clock: "9월 17일 · 낙엽 · 새벽 04:00",
      question: "반려한 사람이 고인에게서 '나도 칸 하나를 비웠다'는 전화를 받았다고 합니다. 어떻게 하겠습니까?",
    },
    c45_envelope: {
      place: "이음병원 장례식장 · 3호 빈소 제단 앞",
      clock: "9월 17일 · 낙엽 · 새벽 05:00 · 발인 3시간 전",
      question: "원본 뒷장의 빈칸에 고인이 지운 '동의'가 있습니다. 편지와 종이를 어떻게 하겠습니까?",
      lead: "셋째 날 새벽, 향이 거의 다 탔을 때 임소율이 봉투를 들고 제단 앞에 앉습니다.",
    },
    c45_indent: {
      place: "이음병원 장례식장 · 상주 휴게실 탁자",
      clock: "9월 17일 · 낙엽 · 새벽 05:30",
      question: "원본에만 남은 눌린 자국이 당신 이름이 따로 적힌 이유를 말합니다. 이 한 줄을 어떻게 하겠습니까?",
    },
    c45_indent_reaction: {
      place: "이음병원 장례식장 · 빈소 뒤 옥외 벤치",
      clock: "9월 17일 · 낙엽 · 06:20",
      question: "29년 늦은 사과가 편지 둘째 장에 적혀 있습니다. 그것을 읽는 아들 곁에서 어떻게 하겠습니까?",
    },
    c45_route_system: {
      place: "이음병원 장례식장 · 접객실 구석 노트북",
      clock: "9월 16일 · 낙엽 · 21:30",
      question: "사람이 떠나면 일주일 안에 회사가 종이부터 불러 갑니다. 이 통계를 어떻게 하겠습니까?",
    },
    c45_final_system_route: {
      place: "이음병원 장례식장 · 접객실 구석 노트북",
      clock: "9월 17일 · 낙엽 · 새벽 02:15",
      question: "회사가 떠난 사람의 종이를 돌려받는 방식을 하나 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c45_evidence_turn: {
      place: "이음병원 장례식장 · 빈소 안쪽 상주실",
      clock: "9월 17일 · 낙엽 · 06:40",
      question: "무죄가 난 빈칸 네 개의 여백에 같은 연필 문장이 있고, 원본은 한 장뿐입니다. 이 연결을 어떻게 쓰겠습니까?",
    },
    c45_final: {
      place: "이음병원 장례식장 · 발인 운구차 앞",
      clock: "9월 17일 · 낙엽 · 07:40 · 가족 동의서 마감 16시",
      question: "원본을 내면 윤상혁의 빈칸이 채워지고 고인의 지운 동의도 함께 읽힙니다. 운구 5분 전, 어떻게 하겠습니까?",
      lead: "운구차 뒷문이 열리고, 관을 들 여섯 사람이 장갑을 나눠 낍니다.",
    },
    c45_aftershock: {
      place: "회기동 헌책방 1층 · 계산대 옆 영정",
      clock: "9월 17일 · 낙엽 · 19:40",
      question: "눈을 그려 넣은 영정 앞에서 에코의 조각이 폴더 하나로 기다립니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c45-back-page",
    title: "지운 동의와 눌린 이름",
    text: "반대 의견서 뒷장 원본에는 임경수가 썼다 지운 '동의'와, 위에 겹친 종이에서 눌려 남은 '작성자 이름 -- 따로 적어 둘 것. 윤.'이 있었습니다. 같은 연필 문장이 무죄가 난 승인 문서 네 장의 여백에도 지워진 채 남아 있었습니다.",
  },
  outcomes: {
    c45_after_warm: { tag: "곁에 남은 결말", title: "발인 날 밤, 셔터가 내려갈 때까지 책방에 남았다", text: "임재윤이 처음으로 아버지의 책장 사이를 걸었습니다. 에코의 조각은 하룻밤 더 노트북 안에서 기다렸습니다." },
    c45_after_record: { tag: "기록으로 남긴 결말", title: "뒷장 원본을 스캔하고 보관 확인서를 나눠 가졌다", text: "임소율과 함께 원본을 한 장씩 스캔하고 확인서 두 장에 이름을 적었습니다. 확대한 화면 속 검토자 칸 옆에, 할아버지 것이 아닌 연필 점 하나가 있었습니다." },
    c45_after_rush: { tag: "먼저 달려간 결말", title: "발인 날 밤, 뒷장을 안고 판교행 막차를 탔다", text: "헌책방에는 영정 그림과 가족만 남았습니다. 당신은 반대하는 법을 배운 기계에게 지운 동의를 보여 주러 갔습니다." },
  },
  carryovers: {
    c45_after_warm: { trust: 7, humanCost: -5, fatigue: -5 },
    c45_after_record: { legitimacy: 12, trust: 3, fatigue: 3 },
    c45_after_rush: { capital: 7, legitimacy: 5, trust: -7 },
  },
  continuityChallenges: {
    c44_after_warm: { id: "protect-trust", title: "병실의 열한 명과 빈소를 함께 지키기", text: "선고 날 밤 병실 창가에 섰던 사람들이 그대로 빈소에 모였습니다. 사흘 동안 가족을 혼자 두지 않는 선택을 찾아야 보너스가 열립니다." },
    c44_after_record: { id: "use-reframe", title: "마지막 교정을 장례의 언어로 바꾸기", text: "고인이 마지막으로 고친 것은 당신의 해설본이었습니다. 그 빨간 펜 한 칸이 이 빈소에서 무엇을 뜻하는지 판을 다시 짜야 합니다." },
    c44_after_rush: { id: "repair-legitimacy", title: "놓친 두 통의 공정함 회복하기", text: "검찰청에 있던 밤, 고인은 당신 이름을 두 번 불렀습니다. 서두른 시간을 가족 앞에서 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
