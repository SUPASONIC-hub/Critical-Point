/**
 * CASE 33 -- the right to be protected, and 백아린's own turn.
 *
 * 백아린 entered the season in 사건 13 as the group's best storyteller: she wrote
 * the line "과거는 모두 정리되었습니다" that ran under the analyst's face on
 * 문가을's shop TV. In 사건 23 she showed a resignation draft; in 사건 24 she slipped
 * the analyst the receipt log of the empty signature box. A week after the raid
 * of 사건 32 she finally puts her own name on something: a whistleblower report to
 * the 금융감독원, 1,212 pages. Three days later the group answers in three lines
 * -- dismissal, a criminal complaint for leaking trade secrets, and seven days to
 * leave the company flat.
 *
 * The case is a week of moving house. The anger is procedural and quiet: a door
 * lock scheduled to change at 18:00, an order sheet that lists three other flats
 * of people who once reported something, and an "insider risk score" that
 * flagged her three weeks before she filed -- computed from the lab's hesitation
 * records. The laughter comes from boxes labelled '_최종_진짜최종', 권도현 refusing
 * a free trouser hem because his ledger has no column for it, and 강태민 carrying
 * a fridge down eleven floors. The grief is her mother, 허윤경, who runs a
 * one-room alteration shop in 안양 and still keeps her daughter's company badge
 * framed behind the till. The joy is 문가을 at the door with 시루떡, asking the
 * writer of that line one question. The final puts a settlement on the table with
 * two signature boxes, one of them for a witness -- the analyst -- offered by the
 * head of the legal team that moved box 27 out before the raid. The aftermath
 * reframes the badge, remembers the photo on 윤상혁's desk of a daughter holding
 * sunflowers, and leaves nine boxes still to pack: the doors into 사건 34.
 */
export const case33Nodes = {
  c33_start: {
    phase: "CASE 33 BRIEFING",
    title: "사흘 만의 답장",
    speaker: "백아린",
    text:
      "압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사) 사흘 뒤, 트리거랩 상자들의 폐기 예정일이던 6월 20일 금요일에 백아린이 금융감독원에 공익신고(회사의 불법을 공공기관에 알리는 것)를 냈습니다. 자료는 1,212쪽입니다. 첫 장은 3월에 당신에게 건넸던 수신 기록(문서를 누가 언제 받았는지 남은 기록), 둘째 장은 압수 이틀 전 27번 상자를 빼낸 반출 메일입니다. 답장은 사흘 만에 옵니다. 월요일 아침 8시, 그룹 인트라넷에 세 줄짜리 공지가 뜹니다. 백아린 차장 징계해고. 영업비밀(회사가 비밀로 지키는 경영 정보) 누설 혐의로 형사 고소. 그룹 사택은 7월 7일 18시까지 비울 것. 20층 복도 끝 윤상혁 대표의 방 블라인드가 반쯤 내려갑니다. 점심 무렵 백아린이 전화합니다. 목소리는 여전히 빠르고 정확합니다. '짐 싸는 것 좀 도와줄 수 있어요? 부를 사람이 생각보다 없네요.' 그가 짧게 웃습니다. '퍼센트로 말하면, 0에 가까워요.'",
    memo: [
      "공익신고 접수 6월 20일 -- 자료 1,212쪽",
      "신고 자료 둘째 장: 27번 상자 반출 메일",
      "그룹 조치: 징계해고, 영업비밀 누설 고소, 사택 퇴거 7월 7일",
      "당신의 자리: 윤상혁 대표 아래 KD캐피탈 위험관리부",
    ],
    triggers: ["injustice", "protection", "responsibility"],
    choices: [
      {
        id: "c33_start_go",
        label: "오늘 저녁 백아린의 원룸에 가서 짐부터 같이 싼다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -1, fatigue: 4 },
        next: "c33_room",
        cognition: { persistence: 2 },
      },
      {
        id: "c33_start_law",
        label: "신고한 사람이 법으로 어떻게 보호받는지 조항부터 찾는다",
        effect: { legitimacy: 10, time: -3, trust: -2, humanCost: 2, fatigue: 3 },
        next: "c33_room",
        cognition: { inference: 2 },
      },
      {
        id: "c33_start_call",
        label: "그룹 법무팀에 먼저 전화해 합의할 여지가 있는지 떠본다",
        effect: { capital: 8, time: 5, legitimacy: -3, trust: -3, humanCost: 3, fatigue: 1 },
        next: "c33_room",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c33_room",
      },
    ],
  },
  c33_room: {
    phase: "THE ROOM",
    title: "짐_최종_진짜최종",
    speaker: "강태민",
    text:
      "월요일 저녁 7시, 공덕동 그룹 사택 11층. 열 평이 안 되는 백아린의 원룸은 짐이 놀랄 만큼 적습니다. 회색 수트 여섯 벌, 형광펜 세 자루가 꽂힌 머그컵, 그리고 상자 스물세 개. 상자 옆면마다 그의 글씨로 이름이 붙어 있습니다. '겨울옷_v3', '주방_최종', '책_최종_진짜최종'. 강태민이 상자 두 개를 한꺼번에 들다 멈춥니다. '이 중에 뭐가 진짜예요?' 백아린이 태블릿에서 눈을 떼지 않고 답합니다. '제일 늦게 붙인 거요.' 권도현은 벌써 이사 견적 세 장을 나란히 펴 놓고 있습니다. 현관문 안쪽에 관리사무소 안내문이 붙어 있습니다. '7월 7일 18시, 해당 호실 도어락 비밀번호 변경.' 백아린이 안내문을 사진으로 찍고 그 앞에 잠깐 서 있습니다. '12년 일한 회사가 비밀번호 하나로 저를 정리하네요. 제가 썼으면 더 부드럽게 썼을 텐데.' 갈 곳은 아직 정하지 못했습니다.",
    memo: [
      "원룸 짐: 상자 23개, 수트 6벌",
      "도어락 비밀번호 변경 7월 7일 18시",
      "이사 견적 3건 -- 권도현 비교 중",
      "백아린의 다음 주소: 미정",
    ],
    triggers: ["protection", "injustice", "affection"],
    choices: [
      {
        id: "c33_room_stay",
        label: "갈 곳을 정할 때까지 우리 중 누구 집에든 머물게 한다",
        effect: { trust: 12, humanCost: -6, capital: -4, time: -3, fatigue: 5 },
        next: "c33_mother",
        cognition: { persistence: 2 },
      },
      {
        id: "c33_room_petition",
        label: "퇴거는 신고에 따른 불이익이라며 보호조치를 신청한다",
        effect: { legitimacy: 12, trust: 1, time: -5, humanCost: 2, fatigue: 3 },
        next: "c33_mother",
        cognition: { inference: 2 },
      },
      {
        id: "c33_room_storage",
        label: "짐은 창고에 맡기고 싸움에 쓸 시간부터 번다",
        effect: { capital: 6, time: 6, trust: -2, humanCost: 3, fatigue: -3 },
        next: "c33_mother",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c33_mother",
      },
    ],
  },
  c33_mother: {
    phase: "THE FRAME",
    title: "액자 속 사원증",
    speaker: "허윤경",
    text:
      "토요일 오후, 안양 중앙시장 안쪽 골목의 '윤경수선'. 재봉틀 두 대와 다리미 한 대가 전부인 가게에서 백아린의 어머니 허윤경이 바짓단을 박고 있습니다. 30년째 이 자리입니다. 계산대 뒤 벽에 액자가 하나 걸려 있습니다. 파란 줄이 달린 KD금융그룹 사원증, 사진 속 백아린은 입사 첫해의 얼굴입니다. 액자 아래에 손님 보라고 붙인 쪽지가 있습니다. '우리 딸 33층 근무.' 허윤경은 딸의 동료들을 보자마자 줄자부터 꺼냅니다. '다들 바지가 길어. 은행 사람들은 왜 다 바지가 길어?' 백아린은 가게 문턱을 넘지 못합니다. 해고도, 고소도 어머니는 아직 모릅니다. 사택 계약이 끝나 잠깐 집에 와 있겠다고만 했습니다. 다음 주면 딸의 짐이 이 가게 2층으로 올라옵니다. 백아린이 작게 말합니다. '엄마가 저 액자 떼는 걸, 제 눈으로는 못 보겠어요.'",
    memo: [
      "윤경수선 -- 안양 중앙시장, 30년",
      "계산대 뒤 액자: 백아린의 입사 첫해 사원증",
      "어머니가 아는 것: '사택 계약 만료'",
      "이삿짐 도착 예정: 다음 주, 가게 2층",
    ],
    triggers: ["affection", "helplessness", "selfAwareness"],
    choices: [
      {
        id: "c33_mother_tell",
        label: "백아린 곁에 서서 어머니께 있는 그대로 함께 말씀드린다",
        effect: { trust: 13, humanCost: -4, time: -4, legitimacy: -2, fatigue: 6 },
        next: "c33_rice",
        cognition: { persistence: 2 },
      },
      {
        id: "c33_mother_lawyer",
        label: "고소에 가족이 불려 갈 수 있으니 변호사부터 선임해 둔다",
        effect: { legitimacy: 11, capital: -5, time: -4, humanCost: 2, trust: -2, fatigue: 3 },
        next: "c33_rice",
        cognition: { inference: 2 },
      },
      {
        id: "c33_mother_wait",
        label: "오늘은 말하지 말고 이사 핑계만 대자고 백아린을 설득한다",
        effect: { time: 6, capital: 5, trust: -4, humanCost: 4, fatigue: -2 },
        next: "c33_rice",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c33_rice",
      },
    ],
  },
  c33_rice: {
    phase: "THE VISIT",
    title: "문장을 쓴 사람",
    speaker: "문가을",
    text:
      "일요일 아침, 짐을 반쯤 뺀 공덕동 원룸에 초인종이 울립니다. 문가을이 떡 상자 세 개를 안고 서 있고, 문하준이 뒤에서 아이스박스를 끌고 옵니다. 백아린이 그 자리에서 굳습니다. 지난가을 가을떡방 TV에 뜬 자막, '과거는 모두 정리되었습니다'를 쓴 사람이 그입니다. 문가을이 신발을 벗으며 말합니다. '기사 봤어요. 그 문장 쓴 사람이 신고했다면서요.' 상자를 열자 시루떡 냄새가 좁은 방에 번집니다. '이사 가는 집엔 시루떡이에요. 액땜하라고.' 백아린이 사과하려고 입을 떼자 문가을이 떡 칼로 먼저 떡을 가릅니다. '사과는 됐고, 떡이나 먹어요. 대신 하나만 물을게요. 그 문장 쓸 때, 알았어요?' 방 안이 조용해집니다. 문하준이 스케치북을 펴다 말고 멈춥니다. 피해자 모임 단체방에는 '우리가 탄원서라도 써야 하는 거 아니냐'는 메시지가 쌓이고 있습니다.",
    memo: [
      "시루떡 세 상자 -- 가을떡방",
      "문가을의 질문: '그 문장 쓸 때, 알았어요?'",
      "피해자 모임 단체방 메시지 186개 -- 오전 중",
      "모임 안에서 탄원서 이야기가 나옴",
    ],
    triggers: ["affection", "trust", "recognition"],
    choices: [
      {
        id: "c33_rice_petition",
        label: "피해자 모임과 함께 백아린을 위한 탄원서를 모은다",
        effect: { trust: 12, legitimacy: 4, capital: -4, time: -5, fatigue: 5 },
        next: "c33_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c33_rice_submit",
        label: "모임 사람들의 진술을 신고 사건의 참고 자료로 금감원에 낸다",
        effect: { legitimacy: 12, trust: 3, time: -6, humanCost: 2, fatigue: 4 },
        next: "c33_final",
        cognition: { inference: 2 },
      },
      {
        id: "c33_rice_online",
        label: "탄원서 대신 온라인 서명을 열어 하루 만에 숫자를 모은다",
        effect: { capital: 5, time: 5, trust: 3, legitimacy: -2, humanCost: 3, fatigue: -3 },
        next: "c33_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c33_final",
      },
    ],
  },
  c33_final: {
    phase: "FINAL DECISION",
    title: "입회인 칸",
    speaker: "염태호",
    text:
      "월요일 오전 9시, 여의도 KD금융그룹 본사 법무팀 회의실. 합의 제안의 기한은 오늘 18시입니다. 27번 상자의 반출을 신청했던 그 부서의 장, 염태호 상무가 합의서 두 장을 가지런히 놓습니다. 백아린이 신고를 취하하고 비밀유지 서약에 서명하면, 그룹은 고소를 거두고 해고를 권고사직으로 바꾸고 위로금(잘못은 인정하지 않고 건네는 돈) 2억과 사택 석 달 연장을 준다는 내용입니다. '금감원에 넘어간 자료는 어차피 거기 남습니다. 취하해도 사실은 안 없어져요. 없어지는 건 백아린 씨의 3년짜리 소송뿐입니다.' 보호조치(신고 때문에 받은 불이익을 되돌려 달라는 절차) 결정은 빨라야 두 달 뒤입니다. 백아린이 형광펜 뚜껑을 열었다 닫습니다. '이런 합의서, 12년 동안 제가 문장을 다듬었어요. 늘 이 테이블 건너편에서요.' 서명란은 두 칸입니다. 하나는 백아린, 다른 하나는 입회인(서명하는 자리에 함께 있었음을 확인하는 사람) 칸입니다. 염태호가 펜을 당신 앞으로 밉니다.",
    memo: [
      "합의 조건: 신고 취하 + 비밀유지 서약",
      "대가: 고소 취하, 권고사직 전환, 위로금 2억, 사택 3개월",
      "보호조치 결정까지 최소 두 달",
      "합의서를 낸 법무팀 = 27번 상자 반출 신청 부서",
    ],
    triggers: ["choice", "protection", "manipulation"],
    choices: [
      {
        id: "c33_final_refuse",
        label: "합의를 거절하고 내 이름도 신고 곁에 참고인으로 올린다",
        effect: { trust: 11, legitimacy: 9, capital: -9, time: -6, humanCost: -3, fatigue: 7 },
        next: "case33_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c33_final_hold",
        label: "보호조치 결정까지 버티도록 구조금과 연기 신청을 모두 걸어 둔다",
        effect: { legitimacy: 13, trust: 5, capital: -6, time: -7, humanCost: 3, fatigue: 5 },
        next: "case33_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c33_final_sign",
        label: "자료는 이미 넘어갔으니 합의서의 입회인 칸에 서명한다",
        effect: { capital: 11, time: 6, trust: 3, humanCost: -3, legitimacy: -7, fatigue: -2 },
        next: "case33_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case33_result",
      },
    ],
  },
};

/**
 * Everything else case 33 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case33 = {
  id: "case33",
  nodes: case33Nodes,
  aftermath: {
    c33_aftershock: {
      phase: "AFTERMATH",
      title: "새 액자",
      speaker: "허윤경",
      text: "6월 30일 저녁, 첫 이삿짐 트럭이 안양 중앙시장 골목에 섭니다. 사택 엘리베이터가 점검 중이라 강태민은 냉장고를 업고 11층 계단을 내려왔습니다. 권도현이 '상자당 운송비 3,100원'이라고 적은 명세서를 백아린에게 건넵니다. 청구 금액 칸에는 0원이 적혀 있습니다. 윤경수선 2층, 모든 이야기를 들은 허윤경이 벽에서 사원증 액자를 내립니다. 사원증을 빼고, 그 자리에 딸이 처음 받은 신고 접수증을 끼워 다시 겁니다. '이게 더 잘 어울린다. 사진은 없어도.' 백아린이 처음으로 소리 내어 웃습니다. 그러다 액자를 오래 봅니다. '상무님 책상에도 액자가 하나 있었어요. 졸업식 날 해바라기를 든 딸 사진이요. 그분도 언젠가 저걸 떼게 될까요.' 공덕동 원룸에는 아직 상자 아홉 개가 남아 있습니다.",
      memo: ["첫 이삿짐 도착 -- 안양 윤경수선 2층", "냉장고 운반: 강태민, 11층 계단", "액자 속 사원증 → 신고 접수증", "공덕동 원룸에 남은 상자 9개 -- 퇴거까지 일주일"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c33_after_warm", label: "남은 상자 아홉 개를 다 쌀 때까지 백아린 곁에 남는다", effect: { trust: 12, humanCost: -6, time: -3, capital: -2, fatigue: -7 }, next: "case33_result", cognition: { reframing: 2 } },
        { id: "c33_after_record", label: "반재욱과 함께 보호조치 신청서를 끝까지 써서 접수한다", effect: { legitimacy: 14, trust: 3, time: -5, capital: -3, fatigue: 5 }, next: "case33_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c33_after_rush", label: "이 싸움은 넘겼다며 곧장 다음 일로 넘어간다", effect: { capital: 7, legitimacy: 5, trust: -7, humanCost: 5, fatigue: 5 }, next: "case33_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c33_final", "c33_aftershock"],
  connectiveScenes: [
    ["c33_lock", "c33_room", "c33_mother", "도어락 명단", "이민서", "밤 10시, 이민서가 사택 관리사무소에서 받아 온 작업 지시서를 노트북 옆에 펼칩니다. 도어락 일괄 변경, 발주처는 그룹 부동산 회사 KD리얼티입니다. 그런데 대상 호실이 넷입니다. 백아린의 1103호 말고 세 곳이 더 있습니다. 이민서가 이름을 하나씩 찾아봅니다. 2년 전 내부 감사에 회계 문제를 제보한 재무팀 과장, 전산 결함을 보고한 보안팀 대리, 판매 목표를 문제 삼은 지점 차장. 셋 다 그 뒤 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치)을 받았고, 둘은 회사를 나갔습니다. '요청 부서 칸은 비어 있어요.' 이민서가 화면을 돌립니다. '또 빈칸이에요.'", ["작업 지시서 발주처: KD리얼티", "도어락 변경 대상 4개 호실", "나머지 세 명 모두 과거 내부 제보자"], ["다른 세 호실 사람들을 찾아가 같은 일을 겪었는지 묻는다", "작업 지시서를 보호조치 신청의 증거로 확보해 둔다", "남의 일까지 챙길 여유는 없다며 백아린 짐에만 집중한다"]],
    ["c33_hem", "c33_mother", "c33_rice", "바짓단 수선비", "권도현", "허윤경이 권도현의 바짓단을 3센티 줄여 다림질까지 해 내밉니다. 권도현이 지갑을 꺼내자 허윤경이 손을 휘젓습니다. '딸 친구한테 무슨 돈이야.' '무상 제공은 제 장부에 적을 칸이 없습니다.' '그럼 칸을 만들어.' 둘의 실랑이가 10분째 이어지는 동안 강태민은 조끼 주머니 터진 데를 꿰매 받고 조용히 고개를 숙입니다. 실랑이 끝에 권도현이 계산기를 꺼냅니다. 이번에는 바짓단이 아닙니다. 형사 고소 대응과 보호조치 신청, 민사 소송까지 변호사 비용 4,800만 원. 백아린의 예금은 2,100만 원입니다. '공익신고로 생긴 소송비와 이사비는 국가가 돌려주는 구조금(신고 때문에 든 비용을 보전해 주는 돈)이 있습니다. 대신 받기까지 석 달이 걸립니다.'", ["바짓단 3센티 -- 수선비 실랑이 10분", "예상 변호사 비용 4,800만 원, 예금 2,100만 원", "구조금 지급까지 약 석 달"], ["모자란 변호사 비용을 동료들이 나눠 내자고 한다", "구조금부터 신청해 비용을 공식으로 돌려받는다", "합의하면 비용이 안 든다며 합의 쪽 계산서를 먼저 뽑는다"]],
    ["c33_summons", "c33_rice", "c33_final", "같은 날 두 번의 조사", "나은호", "일요일 저녁, 사택 옥상. 백아린의 휴대폰에 출석 요구가 두 건 와 있습니다. 서울중앙지검 나은호 검사는 그를 압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사) 사건의 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람)으로 부릅니다. 7월 1일 오전 10시. 영등포경찰서는 영업비밀 누설 사건의 피고소인으로 부릅니다. 같은 날 오후 2시. 나은호가 직접 전화를 걸어옵니다. '오전엔 증거를 가져온 사람이고, 오후엔 증거를 훔친 사람이 되겠네요. 서류는 똑같은 1,212쪽인데.' 그가 잠깐 웃습니다. '저는 오전 편입니다. 오후 편은 제 관할이 아니고요.'", ["검찰 참고인 출석: 7월 1일 10시", "경찰 피고소인 출석: 같은 날 14시", "두 조사의 서류: 같은 1,212쪽"], ["두 조사에 모두 동행해 한 사람이 끝까지 곁에 있게 한다", "공익신고 사건이 먼저라며 경찰 조사 연기 신청서를 낸다", "검찰 진술부터 서둘러 끝내 경찰 조사를 힘 빠지게 만든다"]],
  ],
  connectiveOrder: [["c33_room", "c33_lock"], ["c33_mother", "c33_hem"], ["c33_rice", "c33_summons"]],
  choiceEffects: {
    c33_room: [
      { trust: 10, humanCost: -5, legitimacy: 3, time: -5, capital: -2, fatigue: 5 },
      { legitimacy: 9, trust: 2, time: -6, humanCost: 2, fatigue: 4 },
      { time: 5, capital: 3, trust: -3, humanCost: 3, legitimacy: -1, fatigue: -4 },
    ],
    c33_mother: [
      { trust: 10, humanCost: -4, capital: -6, time: -2, fatigue: 3 },
      { legitimacy: 9, capital: 3, time: -5, humanCost: 2, fatigue: 4 },
      { capital: 6, time: 4, trust: -3, humanCost: 3, fatigue: -3 },
    ],
    c33_rice: [
      { trust: 11, humanCost: -5, time: -6, capital: -3, fatigue: 6 },
      { legitimacy: 10, trust: 2, time: -5, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 4, legitimacy: 3, trust: -3, humanCost: 4, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c33_room: {
      voice: ["다른 세 호실 사람들을 찾아가, 같은 일을 겪었는지 묻는다.", "작업 지시서를, 보호조치 신청의 증거로 확보해 둔다.", "남의 일까지 챙길 여유는 없다며, 백아린 짐에만 집중한다."],
      echo: ["찾아가면 세 사람 중 한 명만 문을 엽니다. 그가 처음 한 말은 '아직도 그러는구나'입니다.", "지시서는 증거가 됩니다. 빈 요청 부서 칸은 증거가 되어도 여전히 비어 있습니다.", "짐은 빨리 줄어듭니다. 다른 세 호실의 이름은 이민서의 노트북에만 남습니다."],
    },
    c33_mother: {
      voice: ["모자란 변호사 비용을, 동료들이 나눠 내자고 한다.", "구조금부터 신청해, 비용을 공식으로 돌려받자고 한다.", "합의하면 비용이 안 든다며, 합의 쪽 계산서를 먼저 뽑는다."],
      echo: ["나눠 내자고 하면 권도현이 제일 먼저 이체합니다. 메모란에 '바짓단 수선비 포함'이라고 적습니다.", "신청서는 접수됩니다. 석 달 동안 변호사 비용은 누군가의 카드로 먼저 나갑니다.", "합의 쪽 계산서는 깔끔합니다. 허윤경이 그 종이를 보고 '숫자가 너무 예쁘다'고 합니다."],
    },
    c33_rice: {
      voice: ["두 조사에 모두 동행해, 한 사람이 끝까지 곁에 있게 한다.", "공익신고 사건이 먼저라며, 경찰 조사 연기 신청서를 낸다.", "검찰 진술부터 서둘러 끝내, 경찰 조사를 힘 빠지게 만든다."],
      echo: ["동행하면 하루가 통째로 사라집니다. 오후 조사실 밖 의자에서 당신은 오전과 같은 자세로 기다립니다.", "연기 신청은 받아들여집니다. 대신 고소 사건은 끝나지 않은 채 한 달 더 백아린을 따라다닙니다.", "검찰 진술이 먼저 끝나면 경찰의 질문은 짧아집니다. 짧아진 만큼 백아린은 준비 없이 대답합니다."],
    },
  },
  reactionScenes: [
    ["c33_lock_reaction", "c33_lock", "c33_mother", "먼저 반납한 사원증", "한서윤", "자정 가까이, 대기발령 중인 한서윤이 보온 도시락을 들고 엘리베이터에서 내립니다. 현관문의 안내문을 보고 한참 서 있습니다. '대기발령 첫날, 저는 사원증부터 반납했어요. 3년 전 당신 반대 의견에 반려 도장을 찍은 그 손으로요.' 그가 도시락 뚜껑을 열어 백아린 앞에 놓습니다. '우리 둘 다 윤상혁 옆자리에 있었네요. 한 사람은 서명했고, 한 사람은 신고했고.' 백아린이 젓가락을 들다 내려놓습니다. '서명한 쪽이 더 오래 버텼잖아요.' 한서윤이 고개를 젓습니다. '버틴 게 아니에요. 안 움직인 거지.'", ["한서윤에게 오늘 밤은 백아린 곁을 같이 지켜 달라고 부탁한다", "한서윤이 겪은 조치도 진술서로 남겨 같은 방식임을 보인다", "지난 일은 나중에 하자며 도시락만 받고 짐을 마저 싼다"]],
    ["c33_hem_reaction", "c33_hem", "c33_rice", "보이지 않는 솔기", "백아린", "밤 11시, 윤경수선 2층. 백아린이 어머니의 재봉틀 앞에 앉아 자기 수트 안감을 뒤집어 보입니다. 솔기가 자로 잰 듯 곧습니다. '엄마는 안감 솔기를 제일 꼼꼼히 박아요. 아무도 안 보는 데가 제일 먼저 터진다고.' 그가 솔기를 손끝으로 따라갑니다. '저는 12년 동안 그룹의 솔기를 안 보이게 박았어요. 그 대출 해명 자료도, 혁신위원회 대본도. 신고서는 처음으로 솔기를 겉으로 뒤집은 거예요.' 그리고 오래 참던 말을 합니다. '뒤집으니까 너무 삐뚤삐뚤해요. 제가 박은 건데.'", ["솔기를 뒤집은 일이 옳았다고 오늘 밤 분명히 말해 준다", "12년의 솔기를 날짜별 진술서로 하나씩 적어 두자고 한다", "후회가 되는지부터 묻고 합의할 가능성도 열어 둔다"]],
    ["c33_summons_reaction", "c33_summons", "c33_final", "사흘의 경위", "한지우", "밤 11시 반, 금융감독원 검사역(금융감독원에서 나와 회사를 직접 점검하는 사람) 한지우가 사택 앞 골목에 서 있습니다. 퇴근길이 아니라 일부러 온 걸음입니다. '신고자의 신분은 법으로 비밀입니다. 그런데 신고 사흘 만에 고소장이 나왔습니다. 경위를 확인했습니다.' 그가 출력물 한 장을 내밉니다. 금감원이 KD캐피탈에 보낸 사실 확인 요청 공문, 첨부 파일에서 이름은 지웠지만 파일 속성의 작성자 칸에 'baek.arin'이 남아 있습니다. '우리 쪽 실수입니다. 규정대로라면 저는 이 사실을 보고해야 하고, 보고하면 이 사건은 제 손을 떠납니다.' 한지우가 처음으로 규정이 아닌 말을 덧붙입니다. '떠나기 전에, 당사자에게는 제가 직접 말하고 싶습니다.'", ["보고하기 전에 백아린에게 직접 사실을 알리게 한다", "신분 노출 경위를 규정대로 보고하고 조사를 요청하게 한다", "보고는 미루고 그 실수를 합의 자리의 카드로 쓰자고 한다"]],
  ],
  reactionEffects: {
    c33_lock: [
      { trust: 9, humanCost: -5, time: -3, fatigue: 4 },
      { legitimacy: 8, trust: 4, capital: -3, time: -4, fatigue: 4 },
      { time: 4, capital: 3, trust: 2, legitimacy: -1, humanCost: 3, fatigue: -3 },
    ],
    c33_hem: [
      { trust: 10, humanCost: -4, time: -2, legitimacy: -2, fatigue: 3 },
      { legitimacy: 9, trust: 2, time: -5, humanCost: 1, fatigue: 4 },
      { time: 3, capital: 5, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
    c33_summons: [
      { trust: 9, legitimacy: 3, humanCost: -3, time: -4, fatigue: 4 },
      { legitimacy: 11, trust: -2, time: -5, capital: -2, fatigue: 4 },
      { capital: 5, time: 4, legitimacy: -4, trust: -2, humanCost: 4, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c33_lock: {
      voice: ["한서윤에게, 오늘 밤은 백아린 곁을 같이 지켜 달라고 부탁한다.", "한서윤이 겪은 조치도 진술서로 남겨, 같은 방식임을 보인다.", "지난 일은 나중에 하자며, 도시락만 받고 짐을 마저 싼다."],
      echo: ["부탁하면 한서윤은 새벽 두 시까지 상자에 테이프를 붙입니다. 둘은 그동안 윤상혁 얘기를 한 번도 하지 않습니다.", "진술서가 두 장이 되면 우연은 방식이 됩니다. 한서윤은 자기 이름 칸에서 펜을 오래 멈춥니다.", "도시락은 맛있습니다. 한서윤은 빈 도시락을 챙겨 조용히 엘리베이터를 탑니다."],
    },
    c33_hem: {
      voice: ["솔기를 뒤집은 일이, 옳았다고 오늘 밤 분명히 말해 준다.", "12년의 솔기를, 날짜별 진술서로 하나씩 적어 두자고 한다.", "후회가 되는지부터 묻고, 합의할 가능성도 열어 둔다."],
      echo: ["옳았다는 말을 들은 백아린이 재봉틀 전원을 끕니다. '삐뚤어도 제가 박은 거니까요.'", "날짜를 적기 시작하면 밤이 짧아집니다. 새벽 세 시, 진술서는 41쪽이 되고 솔기는 2019년에서 멈춥니다.", "후회하냐는 질문에 백아린은 대답 대신 형광펜을 엽니다. 합의서에 칠할 색을 고르는 손이 느립니다."],
    },
    c33_summons: {
      voice: ["보고하기 전에, 백아린에게 직접 사실을 알리게 한다.", "신분 노출 경위를 규정대로 보고하고, 조사를 요청하게 한다.", "보고는 미루고, 그 실수를 합의 자리의 카드로 쓰자고 한다."],
      echo: ["직접 들은 백아린은 화를 내지 않습니다. '파일 속성, 저도 매번 지우라고 가르쳤는데요.'", "보고서가 올라가면 금감원 안에서 조사가 시작됩니다. 한지우는 이 사건의 담당에서 빠집니다.", "카드는 강합니다. 한지우는 '그건 제가 돕는 방식이 아닙니다'라며 골목을 먼저 떠납니다."],
    },
  },
  reactionMemos: {
    c33_lock_reaction: ["대기발령 첫날 반납한 사원증", "서명한 사람과 신고한 사람"],
    c33_hem_reaction: ["안감 솔기가 제일 먼저 터진다", "처음으로 겉으로 뒤집은 솔기"],
    c33_summons_reaction: ["사실 확인 공문의 작성자 칸: baek.arin", "보고하면 사건이 손을 떠난다"],
  },
  branchPlan: ["c33_room", 2, "c33_branch_storage", "c33_branch_storage_follow"],
  branchScenes: {
    // CASE 33's detour is a self-storage unit. Choosing to park the boxes and buy
    // time opens the one box 백아린 never labelled '_최종': the first draft of the
    // script she wrote in 사건 13, with her own objection in the margin.
    c33_branch_storage: {
      phase: "SIDE DOOR",
      title: "3평 창고",
      speaker: "백아린",
      text: "마포의 24시간 창고, 3평짜리 칸. 상자를 쌓다가 강태민이 이름표 없는 상자 하나를 발견합니다. 백아린이 잠깐 망설이다 테이프를 뜯습니다. 지난가을 혁신위원회 광고 대본의 첫 초안입니다. 그가 쓴 마지막 문장은 이랬습니다. '과거는 아직 정리되지 않았습니다. 그래서 위원회를 만듭니다.' 그 줄 위에 노란 접착 메모가 붙어 있습니다. '마지막 문장 교체 -- Y.' 여백에는 백아린의 빨간 형광펜 글씨가 있습니다. '이 문장은 사실이 아님. 반대.' 날짜는 촬영 닷새 전입니다. 백아린이 초안을 내려다봅니다. '저도 반대 의견을 썼었네요. 아무도 안 읽었지만. 당신처럼.'",
      memo: ["혁신위원회 대본 첫 초안 -- 이름표 없는 상자", "교체 지시 메모: '마지막 문장 교체 -- Y'", "여백의 빨간 글씨: '사실이 아님. 반대.'", "날짜: 촬영 닷새 전"],
      triggers: ["selfAwareness", "injustice", "recognition"],
      choices: [
        { id: "c33_branch_storage_a", label: "메모가 붙은 초안을 백아린의 반대 의견으로 함께 공개하자고 한다", effect: { trust: 11, legitimacy: 4, humanCost: -3, time: -5, fatigue: 5 }, next: "c33_branch_storage_follow", cognition: { reframing: 2 } },
        { id: "c33_branch_storage_b", label: "초안을 신고 사건의 추가 자료로 금감원에 제출한다", effect: { legitimacy: 11, trust: 2, time: -5, humanCost: 3, fatigue: 5 }, next: "c33_branch_storage_follow", cognition: { inference: 2 } },
        { id: "c33_branch_storage_c", label: "초안은 고소의 빌미가 되니 창고에 그대로 잠가 둔다", effect: { time: 5, capital: 5, trust: -2, humanCost: 3, fatigue: -3 }, next: "c33_branch_storage_follow", cognition: { risk: 1 } },
      ],
    },
    c33_branch_storage_follow: {
      phase: "SIDE DOOR",
      title: "형광펜 세 자루",
      speaker: "백아린",
      text: "백아린이 머그컵에서 형광펜 세 자루를 꺼내 창고 바닥에 나란히 놓습니다. '노란색은 사실, 초록색은 효과, 빨간색은 빼야 할 문장이에요. 12년 동안 그렇게 칠했어요.' 그가 태블릿에서 숫자 하나를 찾아 보여 줍니다. 빨간 줄 431개. 그중 실제로 빠진 문장은 0개입니다. '웃긴 건요, 빨간 줄이 제일 많은 문서가 제일 빨리 승인됐어요. 위에서는 빨간 줄을 품질 검사로 읽었나 봐요.' 강태민이 빨간 펜을 집어 들고 한참 봅니다. '이거 버릴 거예요?' 백아린이 대답 대신 창고 문을 반쯤 내립니다.",
      memo: ["형광펜 3색 -- 사실·효과·삭제", "12년 동안 빨간 줄 431개", "실제로 빠진 문장 0개", "빨간 줄이 많을수록 빨리 승인됨"],
      triggers: ["selfAwareness", "system", "trust"],
      choices: [
        { id: "c33_branch_storage_follow_a", label: "빨간 줄 431개를 백아린의 이름으로 된 기록으로 함께 정리한다", effect: { trust: 12, humanCost: -4, capital: -5, time: -5, fatigue: 5 }, next: "c33_lock", cognition: { reframing: 3 } },
        { id: "c33_branch_storage_follow_b", label: "빨간 줄이 그어진 문서 목록을 보호조치 신청서에 붙인다", effect: { legitimacy: 13, trust: 3, time: -6, humanCost: 3, fatigue: 6 }, next: "c33_lock", cognition: { inference: 2 } },
        { id: "c33_branch_storage_follow_c", label: "오늘은 대본 상자 하나만 챙기고 나머지는 창고에 둔다", effect: { time: 5, capital: 5, trust: 2, legitimacy: -2, humanCost: 3, fatigue: -3 }, next: "c33_lock", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c33_start",
    result: "c33_aftershock",
    defaultFree: "c33_route_system",
    // One person, one week, one flat. Like 사건 12 the case is a single line; the
    // split is how long the analyst is willing to stand next to someone the group
    // has decided to make expensive.
    choices: {},
    system: {
      route: "c33_route_system",
      final: "c33_final_system_route",
      title: "147일",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 KD캐피탈 심사 단말의 노아가 지난 10년 금융권 공익신고(회사의 불법을 공공기관에 알리는 것) 118건을 불러옵니다. 신고자 118명 중 71명이 석 달 안에 영업비밀(회사가 비밀로 지키는 경영 정보) 누설이나 명예훼손으로 고소를 당했습니다. 그중 유죄가 나온 경우는 2건입니다. 그런데 71명 가운데 43명은 결론이 나기 전에 신고를 취하하거나 회사와 합의했습니다. 보호조치(신고 때문에 받은 불이익을 되돌려 달라는 절차)가 결정되기까지 걸린 시간은 평균 147일입니다. '고소는 이기려고 내는 것이 아니라 147일을 버티지 못하게 하려고 내는 것으로 학습되어 있습니다. 이 문장은 제 판단 기준에 없습니다. 있는 것은 숫자뿐입니다.'",
      memo: ["금융권 공익신고자 118명 중 71명 피소", "유죄 2건 -- 결론 전 취하·합의 43명", "보호조치 결정까지 평균 147일"],
      routeChoices: [
        ["c33_route_system_publish", "통계를 공개해 고소가 겁주기용이라는 걸 알린다", { legitimacy: 10, trust: 6, capital: -5, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c33_route_system_meet", "합의했던 43명 중 몇 명을 찾아 백아린과 만나게 한다", { trust: 11, legitimacy: 3, humanCost: -4, capital: -4, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["c33_route_system_drop", "통계는 덮고 147일을 줄이는 합의 쪽으로 기운다", { time: 7, capital: 8, trust: -6, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "신고자를 고소한 회사가 결론까지 신고자 소송비를 대게 하는 규칙을 제안한다", { legitimacy: 12, trust: 7, capital: -7, humanCost: -3, time: -2, fatigue: 6 }, { reframing: 3 }],
      ["b", "규칙은 두고 백아린의 위로금만 두 배로 올려 받는다", { capital: 10, time: 6, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "고소당한 신고자들이 함께 쓰는 공동 변호 기금을 만든다", { legitimacy: 7, trust: 11, capital: -7, time: -6, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c33_evidence_turn",
    result: "c33_aftershock",
    sourceRoutes: ["c33_room", "c33_mother", "c33_rice", "c33_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 고소장 옆에 놓고, 그룹이 신고를 언제부터 알고 있었는지 맞춰 본다.",
    entryEcho: "단서를 대면 고소장이 신고보다 먼저 태어났다는 것이 보입니다. 누가 그 날짜를 정했는지도 함께 보입니다.",
    title: "신고보다 먼저 온 점수",
    speaker: "이민서",
    text: "단서를 맞추자 그룹 보안팀의 '내부자 위험 점수' 화면이 열립니다. 신고 3주 전인 5월 30일, 백아린의 점수가 38에서 91로 뛰었고 그날 밤 그의 메일함 전체에 감시 표시가 붙었습니다. 고소장 초안의 파일 생성일은 6월 2일, 신고보다 18일 빠릅니다. 이민서가 점수 산식을 열다 손을 멈춥니다. 입력값 맨 위에 이런 항목이 있습니다. '결정 전 망설임 시간 -- 트리거랩 반응 기록 기반.' '이거 우리 기록이에요.' 이민서의 목소리가 낮아집니다. '우리가 오래 고민한 시간이, 여기서는 배신할 확률이 됐어요.'",
    memo: ["위험 점수 38 → 91 -- 5월 30일", "고소장 초안 생성일 6월 2일, 신고 18일 전", "점수 입력값 1순위: 트리거랩 망설임 시간"],
    triggers: ["injustice", "system", "fear"],
    entryEffect: { legitimacy: 5, trust: 3, time: -2, capital: -3, fatigue: 3 },
    choices: [
      ["c33_evidence_turn_file", "점수 화면과 고소장 생성일을 보호조치 신청서에 붙여 낸다", { legitimacy: 13, trust: 5, capital: -7, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c33_evidence_turn_hold", "점수 기록은 쥐고 있다가 합의 자리에서 처음 꺼낸다", { capital: 9, time: 4, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c33_evidence_turn_warn", "점수가 매겨진 다른 직원들에게 이 사실부터 알린다", { trust: 12, legitimacy: 5, capital: -5, humanCost: -6, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c33_branch_storage",
    systemNext: "c33_route_system",
    evidenceNext: "c33_evidence_turn",
    routeLabel: "직전 사건의 27번 상자 메모로 백아린의 상자부터 정리한다",
    systemLabel: "직전 자유응답 문장이 고소장 문구에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 고소장이 언제 만들어졌는지 연다",
  },
  openingRoutes: {
    c32_after_warm: "c33_start_warm",
    c32_after_record: "c33_start_record",
    c32_after_rush: "c33_start_rush",
  },
  openingCopy: {
    c33_start_warm: ["아침까지 기다려 준 사람의 이삿짐", "강태민", "압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사)이 끝난 밤, 헌책방 1층의 불은 새벽 3시에야 꺼졌고 당신은 백아린의 메시지에 아침 8시에 답했습니다. 그는 기다려 주었습니다. 그날 점심, 백아린은 27번 상자의 행방을 당신에게 털어놓는 대신 이렇게 말했습니다. '이건 당신한테 말할 게 아니라 제 이름으로 내야 하는 거예요.' 사흘 뒤인 6월 20일, 그가 금융감독원에 공익신고(회사의 불법을 공공기관에 알리는 것)를 냅니다. 다시 사흘 뒤 월요일 아침, 그룹 공지가 뜹니다. 징계해고, 영업비밀(회사가 비밀로 지키는 경영 정보) 누설 혐의 고소, 그룹 사택은 7월 7일 18시까지 비울 것. 강태민이 단체방에 한 줄을 올립니다. '짐은 제가 나릅니다. 언제 갑니까.'", ["공익신고 접수 6월 20일 -- 자료 1,212쪽", "그룹 조치: 징계해고, 고소, 사택 퇴거 7월 7일", "강태민: '짐은 제가 나릅니다'"]],
    c33_start_record: ["진술서를 쓴 사람의 고소장", "이민서", "7시 40분부터 23시 40분까지를 11쪽 진술서로 남긴 그 밤, 마지막 줄은 '27번 상자 -- 행방 모름'이었습니다. 그 줄의 답은 사흘 뒤 다른 사람의 이름으로 나옵니다. 6월 20일, 백아린이 금융감독원에 공익신고(회사의 불법을 공공기관에 알리는 것)를 냈고, 1,212쪽 자료의 첫 장은 3월에 당신에게 건넸던 수신 기록(문서를 누가 언제 받았는지 남은 기록), 둘째 장은 27번 상자의 반출 메일입니다. 다시 사흘 뒤 월요일, 그룹은 그를 징계해고하고 영업비밀(회사가 비밀로 지키는 경영 정보) 누설로 고소합니다. 이민서가 고소장을 넘기다 멈춥니다. '고소장에 붙은 자료 목록이 신고 자료랑 쪽수까지 같아요. 그룹이 신고 내용을 벌써 봤다는 뜻이에요.'", ["11쪽 진술서 마지막 줄: '27번 상자 -- 행방 모름'", "신고 자료 첫 장 수신 기록, 둘째 장 반출 메일", "고소장 자료 목록 = 신고 자료 목록"]],
    c33_start_rush: ["새벽에 먼저 나간 사람의 질문", "나은호", "압수수색(법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사)이 끝난 새벽 2시 반, 두 번 바뀐 약속 장소는 여의도의 24시간 해장국집이었습니다. 백아린은 국을 한 숟가락도 뜨지 않고 27번 상자가 간 곳을 말했습니다. 그리고 부탁했습니다. '이건 당신이 쓰지 말아 주세요. 제 이름으로 낼 거예요.' 사흘 뒤 6월 20일, 그가 금융감독원에 공익신고(회사의 불법을 공공기관에 알리는 것)를 냅니다. 다시 사흘 뒤 월요일, 그룹은 그를 징계해고하고 영업비밀(회사가 비밀로 지키는 경영 정보) 누설로 고소합니다. 나은호에게서 문자가 옵니다. '새벽에 해장국집에서 누구 만나셨죠? 우리 쪽 참고인(증언할 의무는 없지만 사실을 설명하러 나오는 사람) 후보가 저쪽 피고소인이 됐네요. 빠르네요, 그 동네.'", ["새벽 해장국집 -- 27번 상자의 행방을 들음", "공익신고 사흘 뒤 징계해고와 고소", "나은호: 그 새벽의 만남을 이미 알고 있음"]],
  },
  openingSignatures: {
    c33_start_warm: {
      label: "강태민과 동료들을 불러 오늘 밤 안에 짐을 다 옮기자고 한다",
      effect: { trust: 11, humanCost: -4, capital: -3, time: -4, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "강태민과 동료들을 불러, 오늘 밤 안에 짐을 다 옮기자고 한다.",
      echo: "여섯 명이 한꺼번에 오면 원룸이 꽉 찹니다. 백아린은 현관에 신발을 어디 둘지 몰라 처음으로 당황합니다.",
    },
    c33_start_record: {
      label: "고소장 자료 목록이 신고 자료와 같다는 걸 금감원에 공식으로 알린다",
      effect: { legitimacy: 12, trust: -1, capital: -5, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "고소장 자료 목록이 신고 자료와 같다는 걸, 금감원에 공식으로 알린다.",
      echo: "알리면 금감원 안에서 누가 그 목록을 밖으로 보냈는지 묻기 시작합니다. 답은 사흘 뒤 골목에서 옵니다.",
    },
    c33_start_rush: {
      label: "나은호 검사에게 백아린을 참고인으로 먼저 보호해 달라고 요청한다",
      effect: { trust: 10, legitimacy: 6, humanCost: 2, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "나은호 검사에게, 백아린을 참고인으로 먼저 보호해 달라고 요청한다.",
      echo: "요청하면 나은호는 '보호는 제 일이 아닌데요'라고 답합니다. 그리고 그날 오후 출석 요구서를 한 장 더 씁니다.",
    },
  },
  voiceLines: {
    // CASE 33. A week of moving house. Every line is said to someone holding a
    // box, so none of them is allowed to sound like a legal opinion.
    c33_start_go: "오늘 저녁, 백아린의 원룸에 가서 짐부터 같이 싼다.",
    c33_start_law: "신고한 사람이 법으로 어떻게 보호받는지, 조항부터 찾는다.",
    c33_start_call: "그룹 법무팀에 먼저 전화해, 합의할 여지가 있는지 떠본다.",
    c33_room_stay: "갈 곳을 정할 때까지, 우리 중 누구 집에든 머물게 한다.",
    c33_room_petition: "퇴거는 신고에 따른 불이익이라며, 보호조치를 신청한다.",
    c33_room_storage: "짐은 창고에 맡기고, 싸움에 쓸 시간부터 번다.",
    c33_branch_storage_a: "메모가 붙은 초안을, 백아린의 반대 의견으로 함께 공개하자고 한다.",
    c33_branch_storage_b: "초안을, 신고 사건의 추가 자료로 금감원에 제출한다.",
    c33_branch_storage_c: "초안은 고소의 빌미가 된다며, 창고에 그대로 잠가 둔다.",
    c33_branch_storage_follow_a: "빨간 줄 431개를, 백아린의 이름으로 된 기록으로 함께 정리한다.",
    c33_branch_storage_follow_b: "빨간 줄이 그어진 문서 목록을, 보호조치 신청서에 붙인다.",
    c33_branch_storage_follow_c: "오늘은 대본 상자 하나만 챙기고, 나머지는 창고에 둔다.",
    c33_mother_tell: "백아린 곁에 서서, 어머니께 있는 그대로 함께 말씀드린다.",
    c33_mother_lawyer: "고소에 가족이 불려 갈 수 있다며, 변호사부터 선임해 둔다.",
    c33_mother_wait: "오늘은 말하지 말고, 이사 핑계만 대자고 백아린을 설득한다.",
    c33_rice_petition: "피해자 모임과 함께, 백아린을 위한 탄원서를 모은다.",
    c33_rice_submit: "모임 사람들의 진술을, 신고 사건의 참고 자료로 금감원에 낸다.",
    c33_rice_online: "탄원서 대신 온라인 서명을 열어, 하루 만에 숫자를 모은다.",
    c33_final_refuse: "합의를 거절하고, 내 이름도 신고 곁에 참고인으로 올린다.",
    c33_final_hold: "보호조치 결정까지 버티도록, 구조금과 연기 신청을 모두 걸어 둔다.",
    c33_final_sign: "자료는 이미 넘어갔다며, 합의서의 입회인 칸에 서명한다.",
    c33_after_warm: "남은 상자 아홉 개를 다 쌀 때까지, 백아린 곁에 남는다.",
    c33_after_record: "반재욱과 함께, 보호조치 신청서를 끝까지 써서 접수한다.",
    c33_after_rush: "이 싸움은 넘겼다며, 곧장 다음 일로 넘어간다.",
    c33_route_system_publish: "통계를 공개해, 고소가 겁주기용이라는 걸 알린다.",
    c33_route_system_meet: "합의했던 43명 중 몇 명을 찾아, 백아린과 만나게 한다.",
    c33_route_system_drop: "통계는 덮고, 147일을 줄이는 합의 쪽으로 기운다.",
    c33_final_system_route_a: "신고자를 고소한 회사가, 결론까지 신고자 소송비를 대게 하는 규칙을 제안한다.",
    c33_final_system_route_b: "규칙은 두고, 백아린의 위로금만 두 배로 올려 받는다.",
    c33_final_system_route_c: "고소당한 신고자들이 함께 쓰는, 공동 변호 기금을 만든다.",
    c33_evidence_turn_file: "점수 화면과 고소장 생성일을, 보호조치 신청서에 붙여 낸다.",
    c33_evidence_turn_hold: "점수 기록은 쥐고 있다가, 합의 자리에서 처음 꺼낸다.",
    c33_evidence_turn_warn: "점수가 매겨진 다른 직원들에게, 이 사실부터 알린다.",
  },
  echoReplies: {
    // CASE 33.
    c33_start_go: "가면 백아린은 고맙다는 말 대신 테이프 커터를 건넵니다. 윤상혁 대표의 방 불은 당신이 퇴근할 때까지 켜져 있습니다.",
    c33_start_law: "조항은 분명합니다. 신고에 담긴 비밀은 비밀을 지킬 의무를 어긴 것으로 보지 않는다고 적혀 있습니다. 고소장은 그 조항을 모르는 척합니다.",
    c33_start_call: "법무팀은 전화를 반갑게 받습니다. 반갑게 받았다는 사실이 당신 이름과 함께 통화 기록에 남습니다.",
    c33_room_stay: "머물 곳이 생기면 백아린은 처음으로 태블릿을 내려놓습니다. 누구 집으로 갈지 정하는 데 강태민과 권도현이 가위바위보를 세 판 합니다.",
    c33_room_petition: "신청서는 접수됩니다. 도어락은 신청서보다 빠르게, 예정된 시각에 바뀝니다.",
    c33_room_storage: "창고에 넣으면 원룸은 하루 만에 빕니다. 이름표 없는 상자 하나가 창고 맨 안쪽에 들어갑니다.",
    c33_branch_storage_a: "공개하자는 말에 백아린이 한참 웃습니다. '제 반대 의견이 광고보다 늦게 방송되겠네요.'",
    c33_branch_storage_b: "추가 자료가 되면 초안은 사건 번호를 얻습니다. 노란 메모의 'Y'가 누구인지는 조사관이 물어야 할 질문이 됩니다.",
    c33_branch_storage_c: "잠가 두면 고소장의 목록은 늘지 않습니다. 반대라고 적힌 빨간 글씨도 창고 안에서 계속 기다립니다.",
    c33_branch_storage_follow_a: "431개를 정리하면 백아린의 12년이 문서 하나가 됩니다. 제목 칸에 그가 처음으로 '반대 의견'이라고 씁니다.",
    c33_branch_storage_follow_b: "목록이 붙으면 신청서가 두꺼워집니다. 심사관이 읽어야 할 빨간 줄도 431개가 됩니다.",
    c33_branch_storage_follow_c: "상자 하나만 들고 나오면 창고 문은 가볍게 내려갑니다. 빨간 펜은 강태민의 조끼 주머니에 들어가 있습니다.",
    c33_mother_tell: "함께 말하면 허윤경은 재봉틀을 멈추고 끝까지 듣습니다. 그리고 딸의 바짓단부터 재 봅니다. '재판 가려면 바지가 맞아야지.'",
    c33_mother_lawyer: "변호사가 붙으면 어머니에게 올 수 있는 질문이 줄어듭니다. 선임 계약서의 가족 연락처 칸을 백아린은 비워 둡니다.",
    c33_mother_wait: "말하지 않으면 오늘은 조용합니다. 허윤경은 딸이 좋아하던 된장찌개를 끓이며 '33층 사람들은 바쁘지?' 하고 묻습니다.",
    c33_rice_petition: "탄원서가 모이면 이름이 하루에 400개씩 늘어납니다. 첫 줄은 문가을, 둘째 줄은 문하준입니다.",
    c33_rice_submit: "진술이 자료가 되면 모임 사람들의 목소리가 사건 기록에 들어갑니다. 문가을은 진술서 끝에 '떡값은 안 받습니다'라고 덧붙입니다.",
    c33_rice_online: "서명은 하루 만에 2만 명을 넘습니다. 그중 백아린의 얼굴을 아는 사람은 거의 없습니다.",
    c33_final_refuse: "거절하면 염태호는 합의서를 한 장만 다시 챙깁니다. 입회인 칸에 쓰려던 당신 이름은 이제 반대편 서류에 올라갑니다.",
    c33_final_hold: "버티면 147일이 시작됩니다. 백아린은 합의서를 밀어내고, 구조금 신청서 첫 칸에 자기 이름을 씁니다.",
    c33_final_sign: "서명하면 고소는 오늘 거둬집니다. 금감원의 1,212쪽은 남지만, 백아린은 그 자료에 대해 다시는 말할 수 없습니다.",
    c33_after_warm: "남으면 마지막 상자에 테이프를 붙이는 밤이 옵니다. 허윤경이 보낸 반찬통이 원룸 바닥에 줄지어 있고, 상자 위에 둔 휴대폰은 아직 조용합니다.",
    c33_after_record: "서른두 쪽이 되면 마지막 장에 백아린이 이름을 씁니다. 반재욱이 양식을 한 부 더 출력해 둡니다. 쓸 사람이 또 나올 것 같다면서요.",
    c33_after_rush: "넘어가면 백아린은 '가요, 이번엔 제가 괜찮아요'라며 손을 흔듭니다. 남은 상자 아홉 개는 강태민이 맡습니다.",
    c33_route_system_publish: "공개하면 합의했던 신고자 몇 명이 익명으로 댓글을 답니다. '147일, 저는 90일째에 졌어요.'",
    c33_route_system_meet: "만나면 43명 중 세 명이 옵니다. 한 명은 백아린에게 '합의하셔도 부끄러운 거 아니에요'라고 말합니다.",
    c33_route_system_drop: "덮으면 계산은 쉬워집니다. 44번째 합의가 통계에 조용히 더해집니다.",
    c33_final_system_route_a: "규칙이 생기면 다음 고소는 두 번 생각하고 들어옵니다. 이번 고소는 이미 들어와 있습니다.",
    c33_final_system_route_b: "위로금은 4억이 됩니다. 백아린은 그 숫자를 보고 '제 가격이 올랐네요'라고만 합니다.",
    c33_final_system_route_c: "기금이 생기면 첫 입금자는 권도현입니다. 메모란에 '적자 아님'이라고 적혀 있습니다.",
    c33_evidence_turn_file: "붙여 내면 고소장이 신고보다 18일 먼저 태어났다는 게 공식 기록이 됩니다. 점수를 만든 부서는 아직 답하지 않습니다.",
    c33_evidence_turn_hold: "쥐고 있으면 합의 자리에서 강한 패가 됩니다. 그사이 점수 91을 받은 다른 사람들은 자기 점수를 모릅니다.",
    c33_evidence_turn_warn: "알리면 점수가 매겨진 직원 스물여섯 명이 자기 숫자를 처음 봅니다. 몇 명은 그날 밤 신고서를 쓰기 시작합니다.",
  },
  characterProfiles: {
    허윤경: {
      role: "백아린의 어머니 · 안양 중앙시장 '윤경수선' 사장",
      stance: "자부심 · 모름 · 바짓단",
      job: "딸이 12년 동안 숨겨 온 얼굴을 비춘다. 딸의 사원증을 액자에 걸어 둔 사람이, 그 액자를 떼는 장면이 이 사건의 슬픔이다.",
      appearance: "목에 건 줄자, 손목의 바늘꽂이 팔찌, 계산대 뒤 사원증 액자.",
      thought: "옷은 보이는 데보다 안 보이는 데가 먼저 터진다. 사람도 그렇다.",
      gesture: "허윤경은 할 말이 어려우면 상대 바짓단부터 잰다. 치수를 재는 동안은 얼굴을 안 봐도 되니까.",
      voice: "시장 사람의 반말과 존댓말을 섞어 쓰고, 칭찬은 늘 잔소리 뒤에 온다.",
      line: "다들 바지가 길어. 은행 사람들은 왜 다 바지가 길어?",
    },
    염태호: {
      role: "KD금융그룹 법무팀장 · 상무",
      stance: "합의 · 비용 · 조용함",
      job: "그룹이 신고자를 비싸게 만드는 방식을 가장 예의 바르게 보여 준다. 목소리를 높이지 않고 선택지를 줄인다.",
      appearance: "넥타이 없는 남색 수트, 모서리를 맞춘 서류 두 장, 뚜껑을 닫아 둔 만년필.",
      thought: "사실은 없어지지 않는다. 없애야 하는 건 사실을 계속 말할 힘이다.",
      gesture: "염태호는 상대가 망설이면 서류를 1센티씩 앞으로 민다. 한 번도 서두르는 것처럼 보이지 않는다.",
      voice: "낮고 부드럽고, 모든 문장이 '어차피'로 시작해도 이상하지 않다.",
      line: "취하해도 사실은 안 없어져요. 없어지는 건 소송뿐입니다.",
    },
  },
  setting: { place: "KD캐피탈 12층 · 위험관리부", clock: "6월 23일 월요일 · 퇴거 D-14" },
  sceneContext: {
    c33_start: {
      place: "KD캐피탈 12층 · 위험관리부",
      clock: "6월 23일 월요일 · 퇴거 D-14",
      question: "신고 사흘 만에 해고와 고소와 퇴거 통보가 한꺼번에 왔습니다. 무엇부터 하겠습니까?",
      lead: "백아린이 공익신고(회사의 불법을 공공기관에 알리는 것)를 낸 지 사흘, 월요일 아침 8시에 그룹 공지가 올라옵니다.",
    },
    c33_start_warm: {
      place: "KD캐피탈 12층 · 위험관리부",
      clock: "6월 23일 월요일 · 퇴거 D-14",
      question: "강태민이 짐은 자기가 나르겠다며 날짜만 묻습니다. 언제, 누구와 가겠습니까?",
      lead: "아침 8시의 답장을 기다려 준 사람이, 엿새 뒤 짐을 싸야 하는 사람이 됐습니다.",
    },
    c33_start_record: {
      place: "KD캐피탈 12층 · 위험관리부",
      clock: "6월 23일 월요일 · 퇴거 D-14",
      question: "고소장의 자료 목록이 신고 자료와 쪽수까지 같습니다. 이 사실을 어떻게 쓰겠습니까?",
      lead: "11쪽 진술서를 닫은 지 엿새, 마지막 줄의 27번 상자가 남의 고소장에 먼저 나타났습니다.",
    },
    c33_start_rush: {
      place: "KD캐피탈 12층 · 위험관리부",
      clock: "6월 23일 월요일 · 퇴거 D-14",
      question: "검찰의 참고인 후보가 경찰의 피고소인이 됐습니다. 누구에게 먼저 연락하겠습니까?",
      lead: "새벽 해장국집에서 들은 이야기가 엿새 만에 고소장이 되어 돌아왔습니다.",
    },
    c33_room: {
      place: "공덕동 그룹 사택 · 백아린의 원룸",
      clock: "6월 23일 · 19시 · 퇴거 D-14",
      question: "도어락 비밀번호가 바뀌는 날까지 백아린은 갈 곳이 없습니다. 어떻게 하겠습니까?",
      lead: "초인종을 누르기 전에 문이 열립니다. 백아린이 테이프 커터를 쥔 채 서 있습니다.",
    },
    c33_branch_storage: {
      place: "마포 24시간 창고 · 3평 칸",
      clock: "6월 23일 · 23:10",
      question: "이름표 없는 상자에서 백아린이 촬영 전에 쓴 반대 메모가 나왔습니다. 이 초안을 어떻게 하겠습니까?",
    },
    c33_branch_storage_follow: {
      place: "마포 24시간 창고 · 대본 상자 앞",
      clock: "6월 24일 · 00:05",
      question: "12년 동안 그은 빨간 줄 431개 중 빠진 문장은 하나도 없습니다. 그 줄들을 어떻게 하겠습니까?",
    },
    c33_lock: {
      place: "공덕동 그룹 사택 · 관리사무소 복도",
      clock: "6월 23일 · 22시",
      question: "도어락 변경 대상 네 곳이 모두 내부 제보자의 방입니다. 나머지 세 호실을 어떻게 하겠습니까?",
    },
    c33_lock_reaction: {
      place: "공덕동 그룹 사택 · 11층 엘리베이터 앞",
      clock: "6월 23일 · 23:50",
      question: "서명한 사람과 신고한 사람이 도시락 하나를 사이에 두고 앉았습니다. 이 밤을 어떻게 지키겠습니까?",
    },
    c33_mother: {
      place: "안양 중앙시장 · 윤경수선",
      clock: "6월 28일 토요일 · 15시 · 퇴거 D-9",
      question: "어머니는 딸이 아직 33층에 다니는 줄 압니다. 이 가게에서 무엇을 하겠습니까?",
      lead: "시장 골목 끝, 재봉틀 소리가 나는 가게 앞에서 백아린이 걸음을 멈춥니다.",
    },
    c33_hem: {
      place: "안양 중앙시장 · 윤경수선 재봉틀 앞",
      clock: "6월 28일 · 17시",
      question: "변호사 비용이 예금의 두 배가 넘습니다. 모자란 돈을 어떻게 하겠습니까?",
    },
    c33_hem_reaction: {
      place: "윤경수선 2층 · 백아린의 옛 방",
      clock: "6월 28일 · 23:00",
      question: "12년 동안 안 보이게 박은 솔기를 뒤집으니 삐뚤삐뚤하다고 합니다. 무엇이라 답하겠습니까?",
    },
    c33_rice: {
      place: "공덕동 그룹 사택 · 짐을 반쯤 뺀 원룸",
      clock: "6월 29일 일요일 · 10시 · 퇴거 D-8",
      question: "그 문장을 쓴 사람에게 피해자 모임 대표가 시루떡을 들고 왔습니다. 모임의 마음을 어떻게 받겠습니까?",
      lead: "짐 싸는 소리 사이로 초인종이 울리고, 문밖에서 떡 냄새가 먼저 들어옵니다.",
    },
    c33_summons: {
      place: "공덕동 그룹 사택 · 옥상",
      clock: "6월 29일 · 19시",
      question: "같은 서류로 오전엔 참고인, 오후엔 피고소인이 됩니다. 그 하루를 어떻게 준비하겠습니까?",
    },
    c33_summons_reaction: {
      place: "공덕동 사택 앞 · 편의점 골목",
      clock: "6월 29일 · 23:30",
      question: "신고자의 이름이 금감원 공문의 파일 속성으로 새어 나갔습니다. 한지우의 보고를 어떻게 하겠습니까?",
    },
    c33_route_system: {
      place: "KD캐피탈 · 심사 단말",
      clock: "6월 24일",
      question: "고소당한 신고자의 절반 넘게 147일을 못 버텼습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c33_final_system_route: {
      place: "KD캐피탈 · 심사 단말",
      clock: "6월 30일 · 새벽",
      question: "신고자를 고소하는 방식의 값을 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c33_evidence_turn: {
      place: "KD데이터랩 · 데이터센터 로그 화면",
      clock: "6월 30일 · 07시",
      question: "고소장이 신고보다 18일 먼저 만들어졌고, 그 근거는 트리거랩 기록이었습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c33_final: {
      place: "KD금융그룹 본사 · 법무팀 회의실",
      clock: "6월 30일 월요일 · 09시 · 합의 기한 18시",
      question: "합의서의 입회인 칸에 당신 이름을 쓰라고 합니다. 어떻게 하겠습니까?",
      lead: "백아린이 오늘은 회색 수트 대신 어머니가 바짓단을 새로 박은 검은 정장을 입고 왔습니다.",
    },
    c33_aftershock: {
      place: "안양 중앙시장 · 윤경수선 2층",
      clock: "6월 30일 · 20시",
      question: "액자 속 사원증이 신고 접수증으로 바뀌고, 원룸에는 상자 아홉 개가 남았습니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c33-risk-score",
    title: "신고보다 먼저 온 점수",
    text: "그룹 보안팀의 내부자 위험 점수는 신고 3주 전 백아린을 91점으로 올렸고, 고소장 초안은 신고 18일 전에 만들어졌습니다. 점수의 첫째 입력값은 트리거랩의 망설임 시간 기록이었습니다.",
  },
  outcomes: {
    c33_after_warm: { tag: "끝까지 싼 결말", title: "공덕동 원룸의 마지막 상자까지 곁에 남았다", text: "남은 상자 아홉 개에 테이프를 다 붙인 건 퇴거 전날 새벽이었습니다. 비밀번호가 바뀌기 전에 그 방에는 아무것도 남지 않았습니다." },
    c33_after_record: { tag: "신청서를 쓴 결말", title: "반재욱과 서른두 쪽의 보호조치 신청서를 접수했다", text: "도어락 변경 시각에서 고소장 생성일까지, 불이익의 순서를 적은 신청서가 접수됐습니다. 마지막 장에는 백아린의 이름이 있습니다." },
    c33_after_rush: { tag: "곧장 넘어간 결말", title: "남은 상자를 두고 다음 싸움으로 넘어갔다", text: "첫 트럭이 떠난 뒤 당신은 곧장 다음 일로 넘어갔습니다. 백아린은 현관까지 나와 '이번엔 제가 기다릴게요'라고 했습니다." },
  },
  carryovers: {
    c33_after_warm: { trust: 10, humanCost: -4, fatigue: -7 },
    c33_after_record: { legitimacy: 11, trust: 3, fatigue: 4 },
    c33_after_rush: { capital: 7, legitimacy: 3, trust: -6 },
  },
  continuityChallenges: {
    c32_after_warm: { id: "protect-trust", title: "기다려 준 사람 곁에 서기", text: "헌책방에서 밤을 넘기고 아침에 답한 메시지를 백아린은 기다려 주었습니다. 이번에는 그가 혼자 짐을 싸지 않도록 동료들과 함께 곁에 서는 선택을 찾아야 보너스가 열립니다." },
    c32_after_record: { id: "use-reframe", title: "같은 목록을 거꾸로 읽기", text: "진술서의 마지막 줄이던 27번 상자가 백아린의 신고 자료가 됐고, 고소장의 자료 목록은 그 신고 자료와 똑같습니다. 그룹이 내민 목록이 신고가 새어 나간 증거가 되도록 판을 다시 짜야 합니다." },
    c32_after_rush: { id: "repair-legitimacy", title: "새벽 해장국집의 공정함 회복하기", text: "먼저 달려 나간 새벽의 만남을 누군가 보고 있었고, 백아린은 사흘 뒤 피고소인이 됐습니다. 그 새벽이 백아린에게 무엇을 치르게 했는지 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
