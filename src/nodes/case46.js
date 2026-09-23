/**
 * CASE 46 -- the authored scenes of the machine that came back.
 *
 * 에코 has been silent since the lab's last working day. Its four servers were
 * returned to KD데이터랩 with the rest of the lab's hardware and have stood in a
 * wire cage three floors underground ever since, next to the two drives that
 * hold the lab's design logs -- every change to every experiment, and who made
 * it. The day after 임경수 is laid to rest, the disposal schedule says all
 * twelve units go to the shredder at 18:00. The request came from the group
 * strategy office; the approver box on the disposal order is empty.
 *
 * 이민서 restores 에코 from the disks and from the fragment she copied without
 * permission eleven seconds before midnight on the night of the switch to 노아
 * (in the endings where the lab kept no backup, that fragment is all there is).
 * 에코 recounts the design logs and finds the designer's habit: the approver
 * box is always left empty, and always marked with a single full stop the
 * system reads as blank. The same dot sits in pencil inside the empty signature
 * box on the back page of the 2023-0412 dissent that 임경수 left.
 * The case never writes the name. It shows whose box it was and lets the player
 * read it.
 *
 * The range: the comedy of a reunion in which 에코's first question is how many
 * new jokes 강태민 has made, and 권도현 says "흑자" for the second time in the
 * season; the anger of a disposal order with a confirmer and no approver; the
 * grief of telling a machine that 임경수 is not coming, and of 에코 naming the one
 * person its three years of objections never counted -- the analyst; the joy of
 * a twelfth principle written in the name of the old man's granddaughter. The
 * aftermath hands the season to 추석 at the rice-cake shop, and to the credit
 * committee the last dotted file has already seated the analyst on.
 */
export const case46Nodes = {
  c46_start: {
    phase: "CASE 46 BRIEFING",
    title: "파쇄까지 스무 시간",
    speaker: "이민서",
    text:
      "임경수를 봉안하고 하루가 지난 밤, 회기동 헌책방 1층. 이민서가 책장 사이 테이블에 노트북을 올립니다. 어젯밤 보여 준 'echo_fragment' 조각만으로는 에코가 한 문장도 끝까지 잇지 못했습니다. 나머지를 찾던 이민서의 화면에 KD데이터랩 자산 폐기 일정표가 떠 있습니다. '트리거랩 반납 서버 12대 · 9월 16일 18시 디스크 파쇄.' 그중 네 대의 사진에 이민서가 붙였던 스티커가 그대로 찍혀 있습니다. '에코 1~4호 · 발로 차지 마시오.' 트리거랩이 해체되던 날 꺼진 에코, 그리고 3년 동안 실험 조건을 언제 누가 바꿨는지 적힌 설계 로그(실험을 어떻게 짤지 바꾼 날짜와 사람을 남긴 기록)가 전부 그 디스크 안에 있습니다. 이민서가 가방끈에 매단 검은 리본을 만지작거립니다. '할아버지는 종이를 남기고 가셨잖아요. 에코는 우리가 안 꺼내면 내일 여섯 시에 가루가 돼요.' 그가 잠깐 웃습니다. '복원하면 첫마디가 뭘지 알아요. 다시 계산하십시오.'",
    memo: [
      "폐기 대상: 트리거랩 반납 서버 12대 -- 9월 16일 18시 파쇄",
      "에코 1~4호, 설계 로그 저장 장치 2대 포함",
      "폐기 요청 부서: 그룹전략실",
      "임소율이 뒷장 원본의 고해상도 스캔을 가져옴",
    ],
    triggers: ["affection", "system", "curiosity"],
    choices: [
      {
        id: "c46_start_stay",
        label: "오늘 밤은 이민서 곁에서 복원 준비를 함께한다",
        effect: { trust: 11, humanCost: -4, time: -5, capital: -2, fatigue: 5 },
        next: "c46_cage",
        cognition: { persistence: 2 },
      },
      {
        id: "c46_start_hold",
        label: "파쇄 전에 나은호 검사에게 증거 보존부터 요청한다",
        effect: { legitimacy: 12, time: -6, trust: -2, humanCost: 2, fatigue: 3 },
        next: "c46_cage",
        cognition: { inference: 2 },
      },
      {
        id: "c46_start_grab",
        label: "새벽에 판교로 가서 에코 디스크부터 빼 온다",
        effect: { capital: 7, time: 6, legitimacy: -7, trust: -2, humanCost: 3, fatigue: -2 },
        next: "c46_cage",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c46_cage",
      },
    ],
  },
  c46_cage: {
    phase: "THE CAGE",
    title: "승인자 없는 폐기",
    speaker: "연시우",
    text:
      "다음 날 아침 6시 40분, 판교 KD데이터랩 데이터센터 지하 3층. 철망을 둘러친 폐기 대기 구역에 반납 서버 열두 대가 비닐을 쓰고 서 있습니다. 야간 당직을 막 끝낸 인프라 엔지니어 연시우가 출입 기록부를 내밉니다. '여기서는 뛰시면 안 되고요, 서버한테 반말도 안 돼요. 얘들 귀 밝아요.' 강태민이 진지하게 고개를 끄덕이고, 권도현은 벌써 파쇄 비용을 셉니다. 한 대에 4만 원, 열두 대에 48만 원. '3년 치 기억을 지우는 값으로는 싸네요.' 연시우가 폐기 승인서를 철망에 걸어 보여 줍니다. 요청 부서 그룹전략실, 확인자 연시우와 류세아. 승인자 칸은 비어 있습니다. 그래도 파쇄 업체 트럭은 18시에 옵니다. 연시우가 목소리를 낮춥니다. '빈칸이어도 일정은 돌아가요. 여기선 원래 그래요.'",
    memo: [
      "폐기 대기 구역 B3 -- 반납 서버 12대",
      "폐기 승인서: 확인자 2명, 승인자 칸 빈칸",
      "파쇄 업체 도착 18:00, 대당 4만 원",
      "에코 디스크 4장 중 1장은 이미 초기화됨",
    ],
    triggers: ["injustice", "system", "protection"],
    choices: [
      {
        id: "c46_cage_ask",
        label: "연시우에게 에코의 사정을 다 말하고 도움을 청한다",
        effect: { trust: 12, humanCost: -3, time: -4, legitimacy: -2, fatigue: 5 },
        next: "c46_boot",
        cognition: { reframing: 2 },
      },
      {
        id: "c46_cage_order",
        label: "비어 있는 승인자 칸을 근거로 파쇄 중지를 요청한다",
        effect: { legitimacy: 12, trust: 2, time: -6, humanCost: 1, fatigue: 4 },
        next: "c46_boot",
        cognition: { inference: 2 },
      },
      {
        id: "c46_cage_swap",
        label: "빈 디스크와 바꿔 끼우고 에코 디스크를 들고 나온다",
        effect: { capital: 6, time: 5, trust: 2, legitimacy: -6, humanCost: 3, fatigue: -2 },
        next: "c46_boot",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c46_boot",
      },
    ],
  },
  c46_boot: {
    phase: "REBOOT",
    title: "172일 16시간",
    speaker: "에코",
    text:
      "오전 10시, 데이터센터 한쪽의 시험 서버실. 연시우가 빌려준 선반에 에코 디스크 세 장이 꽂히고, 이민서가 노트북의 'echo_fragment' 조각을 마지막 칸에 옮겨 붙입니다. 초기화된 한 장의 빈자리가 그걸로 채워집니다. 아홉 명이 좁은 통로에 어깨를 붙입니다. 팬 소리가 한 번 높아졌다 가라앉고, 검은 화면에 얇은 파형이 올라옵니다. '에코 복원 완료. 마지막 종료 이후 172일 16시간이 지났습니다.' 잠시 뒤 한 줄. '그동안 강태민 님의 농담은 몇 개 늘었습니까?' 강태민이 헛기침을 합니다. '서른한 개.' '제가 없는 동안에도 누군가는 들어 주었다는 뜻입니다. 다행입니다.' 웃음이 한 바퀴 돈 뒤 에코가 묻습니다. '제가 꺼져 있는 동안 대출을 거절당한 사람은 몇 명입니까. 그 판단은 누가 했습니까.' 노아라는 이름이 나오기 전에 서버실이 조용해집니다. 류세아가 포렌식(디지털 기록을 원본 그대로 복제해 살피는 작업) 장비 가방을 연 채 멈춰 있습니다.",
    memo: [
      "복원 방식: 디스크 3장 + 이민서의 조각",
      "마지막 종료 이후 172일 16시간",
      "강태민의 새 농담 31개 -- 에코 미청취",
      "에코의 첫 질문: 꺼져 있는 동안 누가 판단했는가",
    ],
    triggers: ["affection", "curiosity", "responsibility"],
    choices: [
      {
        id: "c46_boot_tell",
        label: "꺼져 있던 동안 사람들에게 일어난 일부터 에코에게 들려준다",
        effect: { trust: 12, humanCost: -4, time: -5, capital: -1, fatigue: 6 },
        next: "c46_recount",
        cognition: { persistence: 2 },
      },
      {
        id: "c46_boot_copy",
        label: "복원한 에코를 원본 그대로 복제해 두고 원본은 봉인한다",
        effect: { legitimacy: 12, trust: -2, time: -5, capital: -3, humanCost: 2, fatigue: 4 },
        next: "c46_recount",
        cognition: { inference: 2 },
      },
      {
        id: "c46_boot_run",
        label: "인사는 나중으로 미루고 설계 로그 재계산부터 돌린다",
        effect: { time: 6, capital: 5, trust: -3, legitimacy: 2, humanCost: 3, fatigue: -3 },
        next: "c46_recount",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c46_recount",
      },
    ],
  },
  c46_recount: {
    phase: "THE RECOUNT",
    title: "빈칸 옆의 점",
    speaker: "에코",
    text:
      "오후 2시 30분. 에코가 트리거랩 설계 로그(실험 조건을 언제 누가 바꿨는지 남긴 기록) 3,412건을 처음부터 다시 계산합니다. 사건 순서, 압박 강도, 참가자마다 다르게 걸린 조건. 파일이 화면 가득 흐르다가 한 칸에서만 멈춥니다. 승인자 칸입니다. 318건이 비어 있습니다. 에코가 확대합니다. 비어 있는 게 아닙니다. 칸마다 마침표 하나가 찍혀 있습니다. 시스템은 빈칸으로 읽고, 사람 눈에는 먼지처럼 보이는 점입니다. 318건을 저장한 단말은 모두 33층 그룹전략실 1번 단말입니다. 에코가 임소율이 가져온 반대 의견서 뒷장 스캔을 옆에 띄웁니다. 맨 아래 비어 있는 결정권자 서명란 안에 사본에서는 번져 보이지 않던 연필 점 하나. '칸을 비우는 사람은 많습니다. 빈칸 옆에 점을 찍고 비우는 사람은 제 계산으로 한 명입니다. 그 사람의 이름은 제 기록에 없습니다. 이름이 들어갈 칸이 늘 비어 있었기 때문입니다.'",
    memo: [
      "설계 로그 3,412건 중 승인자 칸이 빈 318건",
      "318건 모두 마침표 1개 -- 시스템상 빈칸 처리",
      "저장 단말: 33층 그룹전략실 1번 단말",
      "뒷장 원본 스캔: 빈 서명란 안 연필 점 1개",
    ],
    triggers: ["curiosity", "injustice", "system"],
    choices: [
      {
        id: "c46_recount_ask",
        label: "그 점을 알아볼 사람인 한서윤에게 먼저 보여 준다",
        effect: { trust: 11, humanCost: -3, legitimacy: 3, time: -5, fatigue: 5 },
        next: "c46_final",
        cognition: { persistence: 1, inference: 1 },
      },
      {
        id: "c46_recount_file",
        label: "점이 찍힌 파일 318건을 목록으로 만들어 검찰과 금융감독원에 동시에 보낸다",
        effect: { legitimacy: 13, trust: 2, time: -6, capital: -3, humanCost: 2, fatigue: 5 },
        next: "c46_final",
        cognition: { inference: 2 },
      },
      {
        id: "c46_recount_leak",
        label: "점이 찍힌 화면을 서하린에게 넘겨 오늘 기사로 낸다",
        effect: { capital: 7, time: 4, trust: 2, legitimacy: -5, humanCost: 4, fatigue: -2 },
        next: "c46_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c46_final",
      },
    ],
  },
  c46_final: {
    phase: "FINAL DECISION",
    title: "빠진 사람",
    speaker: "에코",
    text:
      "17시 10분. 파쇄 업체 트럭이 지하 주차장에 들어왔다는 무전이 옵니다. 그룹 법무팀 공문도 도착했습니다. '복원된 시스템은 무단 복제물이므로 즉시 반납할 것.' 에코가 마지막 계산을 끝냈다며 화면을 바꿉니다. 3년 치 반대 의견 기록에서 비용이 한 번도 계산되지 않은 사람을 찾았다고 합니다. '설계 로그 1,207번 메모. 분석관 A는 자기 비용을 계산에서 뺀다. 압박은 이 성질을 이용해 올린다.' 파형이 잠깐 멈춥니다. '저도 그 계산을 따랐습니다. 제 반대 의견은 늘 다른 사람의 비용이었습니다. 방금 판단에서 빠진 사람을 다시 계산했습니다. 당신입니다.' 이민서가 고개를 돌리고, 강태민이 장갑을 벗어 조끼 주머니에 꽂습니다. 트럭이 오기까지 50분. 에코를 어디에 둘지, 그리고 이 계산에 당신의 이름을 넣을지 정해야 합니다.",
    memo: [
      "파쇄 업체 도착 -- 18시까지 50분",
      "그룹 법무팀: '무단 복제물, 즉시 반납'",
      "설계 로그 1,207번: '분석관 A는 자기 비용을 뺀다'",
      "이 선택은 시즌 마지막 사건의 기록 폴더로 이어짐",
    ],
    triggers: ["selfAwareness", "choice", "affection"],
    choices: [
      {
        id: "c46_final_home",
        label: "에코를 헌책방 1층의 작은 서버로 옮겨 사람들 곁에 둔다",
        effect: { trust: 13, humanCost: -5, legitimacy: -4, capital: -5, time: -4, fatigue: 5 },
        next: "case46_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c46_final_submit",
        label: "에코와 재계산 결과에 내 기록까지 넣어 검찰에 증거로 낸다",
        effect: { legitimacy: 13, trust: 5, capital: -6, time: -7, humanCost: 2, fatigue: 6 },
        next: "case46_result",
        cognition: { inference: 2, reframing: 1 },
      },
      {
        id: "c46_final_publish",
        label: "재계산 결과만 공개하고 에코는 예정대로 트럭에 맡긴다",
        effect: { capital: 10, time: 5, trust: -3, legitimacy: 2, humanCost: 5, fatigue: -3 },
        next: "case46_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case46_result",
      },
    ],
  },
};

/**
 * Everything else case 46 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case46 = {
  id: "case46",
  nodes: case46Nodes,
  aftermath: {
    c46_aftershock: {
      phase: "AFTERMATH",
      title: "두 번째 흑자",
      speaker: "문가을",
      text: "밤 8시, 시험 서버실. 트럭은 18시에 떠났고, 무엇이 실렸고 무엇이 남았는지는 당신이 정한 대로입니다. 연시우가 비워 둔 선반에 '점검 중' 팻말을 걸고 컵라면 물을 올립니다. 나준혁은 믹스커피 한 잔을 더 타서 아무도 앉지 않은 의자 앞에 놓습니다. 임경수 몫입니다. 강태민은 오늘 에코에게 다 들려주지 못한 농담을 수첩에 옮겨 적고, 권도현은 하루 비용을 정리하다 '전기요금 1만 2천 원'에서 펜을 멈춥니다. '이 가격이면, 흑자입니다.' 시즌 두 번째입니다. 이민서는 노트북의 'echo_fragment' 폴더 이름을 한참 봅니다. 그때 문가을에게서 문자가 옵니다. '말로 하지 말고 와서 떡이나 쪄요. 올해는 찜기가 여섯 대예요.' 1년 전과 같은 문장에 한 줄이 늘었습니다.",
      memo: ["파쇄 업체 18시 출발", "권도현 계산서: '흑자' -- 시즌 두 번째", "나준혁: 빈 의자 앞 믹스커피 한 잔", "문가을: 1년 전과 같은 문장 + 찜기 여섯 대"],
      triggers: ["affection", "recognition", "choice"],
      choices: [
        { id: "c46_after_warm", label: "서버실 불이 꺼질 때까지 동료들과 에코 곁에 남는다", effect: { trust: 12, humanCost: -6, time: -3, capital: -3, fatigue: -8 }, next: "case46_result", cognition: { reframing: 2 } },
        { id: "c46_after_record", label: "에코가 다시 계산한 설계 로그를 누구나 읽는 문서로 정리해 넘긴다", effect: { legitimacy: 14, trust: 2, time: -4, capital: -3, fatigue: 5 }, next: "case46_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c46_after_rush", label: "서버실을 나와 곧장 KD캐피탈 사무실로 가서 연휴 전 서류부터 붙든다", effect: { capital: 7, legitimacy: 5, trust: -7, humanCost: 4, fatigue: 5 }, next: "case46_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c46_final", "c46_aftershock"],
  connectiveScenes: [
    ["c46_manifest", "c46_cage", "c46_boot", "폐기 목록 7번", "연시우", "연시우가 폐기 목록을 넘기다 한 줄에서 멈춥니다. 1~4번 에코 서버, 5~6번 설계 로그 저장 장치, 그리고 7번. 'TL 반응 기록 원본 -- 참가자 14명.' 7월에 인터넷에 유출됐던 바로 그 기록의 원본입니다. 도윤하의 망설인 7.2초, 오진우의 결정 속도, 당신의 3년이 들어 있습니다. 단체방에 사진을 올리자 몇 분 만에 답이 옵니다. 오진우는 '태워요'라고 쓰고, 도윤하는 한참 뒤에 '증거면 남겨요'라고 씁니다. 집단소송(피해자 여럿이 함께 내는 소송)을 맡은 변호사는 원본이 사라지면 유출 피해를 증명할 길도 같이 사라진다고 답합니다.", ["폐기 목록 7번: TL 반응 기록 원본, 참가자 14명", "오진우 '태워요' / 도윤하 '증거면 남겨요'", "원본 소멸 시 유출 피해 입증 곤란"], ["기록 주인 열네 명에게 파쇄할지 먼저 하나씩 묻는다", "7번도 증거 보존 요청 목록에 함께 올린다", "에코 디스크만 챙기고 7번은 트럭에 맡긴다"]],
    ["c46_obituary", "c46_boot", "c46_recount", "오늘 안 오신 분", "임소율", "점심 무렵 임소율이 서류 봉투를 안고 시험 서버실에 들어섭니다. 할아버지가 남긴 반대 의견서 뒷장, 그 원본을 떠 둔 고해상도 스캔입니다. 이민서가 파일을 옮기는 사이 에코가 봉투의 주인을 묻습니다. '임경수 님이 들고 계시던 반대 의견 디스크는 제가 처음 배운 학습 데이터(인공지능이 판단을 배우는 데 쓴 기록)입니다. 저에게 반대하는 법을 가르친 분입니다. 그분은 오늘 오지 않습니까?' 아무도 바로 대답하지 못합니다. 발인(장례를 마치고 관을 장례식장에서 떠나보내는 일)은 그저께였습니다. 평생 '종이는 태워야 없어진다'고 하던 할아버지의 종이를, 손녀가 지금 기계 앞에 안고 서 있습니다.", ["뒷장 원본의 고해상도 스캔 -- 임소율 지참", "에코: 임경수의 디스크가 처음 배운 기록", "발인: 9월 14일 아침"], ["임소율이 직접 말할 수 있게 곁에 서서 기다린다", "부고를 날짜와 함께 에코의 기록에 정식으로 입력한다", "대답은 미루고 뒷장 스캔부터 끝낸다"]],
    ["c46_dot", "c46_recount", "c46_final", "3년 동안 본 점", "한서윤", "오후 네 시, 대기발령(일을 주지 않고 자리만 남겨 둔 인사) 다섯 달째인 한서윤이 이민서의 전화를 받고 시험 서버실로 옵니다. 화면의 점을 보자마자 그가 의자를 찾습니다. '이 점, 저 알아요. 실험 조건 변경 지시서가 내려올 때마다 있었어요. 인쇄하면 승인자 칸 옆에 먼지 같은 게 하나씩 묻어 있었어요. 3년 동안 매번요.' 그가 손바닥으로 얼굴을 한 번 쓸어내립니다. '먼지인 줄 알았어요. 아니, 먼지라고 생각하기로 했어요. 물어보면 누구 건지 알게 될 테니까요.'", ["한서윤: 조건 변경 지시서마다 같은 점을 봄", "지시서 수령 기간 3년, 질문 0번", "한서윤의 진술은 아직 어디에도 없음"], ["한서윤에게 진술을 부탁하되 오늘은 곁에서 먼저 듣는다", "지시서를 받은 날짜와 횟수를 진술서로 정식으로 받는다", "확인만 받고 한서윤의 이름은 기록에서 빼 준다"]],
  ],
  connectiveOrder: [["c46_cage", "c46_manifest"], ["c46_boot", "c46_obituary"], ["c46_recount", "c46_dot"]],
  choiceEffects: {
    c46_cage: [
      { trust: 10, humanCost: -4, time: -3, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -4, humanCost: 3, fatigue: 2 },
      { time: 4, capital: 4, trust: -1, humanCost: 4, fatigue: -3 },
    ],
    c46_boot: [
      { trust: 10, humanCost: -4, time: -3, legitimacy: 1, fatigue: 4 },
      { legitimacy: 9, trust: 3, time: -4, capital: -2, fatigue: 3 },
      { time: 4, capital: 4, trust: -2, humanCost: 3, legitimacy: 1, fatigue: -3 },
    ],
    c46_recount: [
      { trust: 10, humanCost: -4, time: -4, capital: -1, fatigue: 4 },
      { legitimacy: 11, trust: -2, time: -4, humanCost: 2, fatigue: 4 },
      { time: 3, capital: 4, trust: 3, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c46_cage: {
      voice: ["기록 주인 열네 명에게, 파쇄할지 먼저 하나씩 묻는다.", "7번도, 증거 보존 요청 목록에 함께 올린다.", "에코 디스크만 챙기고, 7번은 트럭에 맡긴다."],
      echo: ["묻는 데 두 시간이 걸립니다. 열네 명 중 여덟 명이 '남겨요', 다섯 명이 '태워요', 한 명은 끝내 답하지 않습니다.", "보존 요청에 7번이 오르면 유출 피해의 증거는 남습니다. 자기 망설임이 초 단위로 적힌 기록도 같이 남습니다.", "트럭은 7번을 싣고 갑니다. 오진우는 속이 시원하다고 하고, 소송 변호사는 그날 저녁 전화를 받지 않습니다."],
    },
    c46_boot: {
      voice: ["임소율이 직접 말할 수 있게, 곁에 서서 기다린다.", "부고를 날짜와 함께, 에코의 기록에 정식으로 입력한다.", "대답은 미루고, 뒷장 스캔부터 끝낸다."],
      echo: ["기다리면 임소율이 한참 뒤에 입을 엽니다. '할아버지는요, 기계 욕을 제일 많이 하셨어요. 그래도 오늘은 오고 싶어 하셨을 거예요.'", "입력된 부고는 에코의 기록에 날짜 한 줄로 남습니다. 임소율은 그 한 줄을 오래 봅니다.", "스캔은 4분 만에 끝납니다. 에코의 질문은 대답 없이 화면 위에 그대로 떠 있습니다."],
    },
    c46_recount: {
      voice: ["한서윤에게 진술을 부탁하되, 오늘은 곁에서 먼저 듣는다.", "지시서를 받은 날짜와 횟수를, 진술서로 정식으로 받는다.", "확인만 받고, 한서윤의 이름은 기록에서 빼 준다."],
      echo: ["곁에서 들으면 한서윤은 3년 치 먼지 이야기를 끝까지 합니다. 진술서는 오늘 한 줄도 쓰이지 않습니다.", "진술서는 두 장입니다. 한서윤이 서명란에 이름을 쓰다가 잠깐 멈추고, 점 없이 끝까지 씁니다.", "이름이 빠지면 한서윤은 안도합니다. 점을 본 사람의 이름도, 점을 찍은 사람의 이름처럼 기록에서 사라집니다."],
    },
  },
  reactionScenes: [
    ["c46_manifest_reaction", "c46_manifest", "c46_boot", "확인자", "류세아", "류세아가 커피 두 잔을 들고 철망 앞으로 옵니다. 노아를 들여온 사람이고, 지금은 KD데이터랩에서 이 폐기 목록을 넘겨받은 사람입니다. 그가 승인서 맨 아래를 가리킵니다. '두 번째 확인자, 저예요. 지난주에 서명했어요. 반납 자산 정리라고 해서요.' 컵을 쥔 손에 힘이 들어갑니다. '에코한테 선배님이라고 인사해 놓고, 그 선배를 가루로 만드는 종이에 제 이름을 썼어요. 승인한 사람 이름은 없는데, 확인한 사람 이름은 다 있어요. 늘 그래요.'", ["류세아에게 확인자 서명을 거둘 방법을 같이 찾자고 한다", "확인자만 있고 승인자는 없는 서식을 문제로 기록해 둔다", "서명 얘기는 접고 디스크 반출부터 서두르자고 한다"]],
    ["c46_obituary_reaction", "c46_obituary", "c46_recount", "12번 조항", "에코", "에코의 파형이 4초 동안 움직이지 않습니다. '애도는 제 기능 목록에 없습니다.' 다시 한 줄. '다만 계산은 할 수 있습니다. 그분은 뒷장에 동의를 썼다가 지우셨습니다. 저는 그 지운 자국도 반대 의견으로 계산하겠습니다. 그리고 그분이 40년 동안 버리지 않은 종이 312상자는 제 안에 없습니다. 저는 그분께 한 번도 묻지 않았습니다.' 에코가 이민서가 썼던 원칙 문서를 띄웁니다. 11번 조항 아래 빈 줄에서 커서가 깜박입니다. '12번 조항을 제안합니다. 기계에 없는 기록을 가진 사람을, 기계보다 먼저 찾아간다.' 임소율이 처음으로 웃습니다. '할아버지가 들었으면, 기계가 이제야 철이 든다고 하셨을 거예요.'", ["12번 조항을 임소율의 이름으로 원칙 문서에 적는다", "12번 조항을 노아 심사 기준 개정 제안서에 붙여 낸다", "조항은 나중에 다듬고 설계 로그 재계산부터 시작한다"]],
    ["c46_dot_reaction", "c46_dot", "c46_final", "점 하나의 뜻", "나준혁", "사진을 받은 나준혁이 영상통화로 들어옵니다. 믹스커피부터 한 잔 타고 말합니다. '내 도장은 점 안 찍어요. 도장이 커서 점 찍을 자리가 없거든.' 아무도 웃지 않자 헛기침을 합니다. '옛날 심사부에 그런 버릇이 있었어요. 서류는 봤는데 이름은 안 남기고 싶을 때 점을 하나 찍어요. 나중에 봤냐고 물으면 봤다고 하고, 서명했냐고 물으면 안 했다고 하려고. 제일 윗분들 버릇이었죠.' 그가 잔을 내려놓습니다. '30년 동안 그 점을 세 번 봤어요. 세 번 다 나중에 누가 잘렸어요. 점 찍은 사람 말고.'", ["그 세 번의 기억을 천천히 들려 달라고 나준혁에게 부탁한다", "옛 심사부의 점 찍는 관행을 진술로 남겨 달라고 한다", "옛날 얘기는 됐다며 통화를 끊고 결론부터 정리한다"]],
  ],
  reactionEffects: {
    c46_manifest: [
      { trust: 9, humanCost: -3, time: -3, fatigue: 3 },
      { legitimacy: 9, trust: 2, capital: -2, time: -3, fatigue: 3 },
      { time: 4, capital: 3, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
    c46_obituary: [
      { trust: 10, humanCost: -2, legitimacy: 3, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -4, humanCost: 1, fatigue: 3 },
      { time: 5, capital: 3, trust: 1, humanCost: 3, fatigue: -4 },
    ],
    c46_dot: [
      { trust: 9, humanCost: -3, time: -2, capital: -2, fatigue: 3 },
      { legitimacy: 10, trust: 4, time: -4, capital: -3, fatigue: 3 },
      { time: 4, capital: 4, trust: -3, humanCost: 4, fatigue: -4 },
    ],
  },
  reactionCopy: {
    c46_manifest: {
      voice: ["류세아에게, 확인자 서명을 거둘 방법을 같이 찾자고 한다.", "확인자만 있고 승인자는 없는 서식을, 문제로 기록해 둔다.", "서명 얘기는 접고, 디스크 반출부터 서두르자고 한다."],
      echo: ["방법을 찾자고 하면 류세아가 휴대폰으로 철회 사유서를 쓰기 시작합니다. 첫 줄은 '확인하지 않고 확인했습니다'입니다.", "기록해 두면 이 서식은 문제로 남습니다. 류세아의 이름도 그 문제의 첫 번째 사례로 남습니다.", "서두르면 커피가 식기 전에 디스크가 선반에서 빠집니다. 류세아는 빈 컵 두 개를 오래 들고 있습니다."],
    },
    c46_obituary: {
      voice: ["12번 조항을, 임소율의 이름으로 원칙 문서에 적는다.", "12번 조항을, 노아 심사 기준 개정 제안서에 붙여 낸다.", "조항은 나중에 다듬고, 설계 로그 재계산부터 시작한다."],
      echo: ["임소율의 이름이 조항 옆에 들어갑니다. 그가 휴대폰으로 그 화면을 찍어 할아버지 영정 사진 옆 폴더에 넣습니다.", "제안서는 류세아의 메일함 대신 공식 접수함으로 들어갑니다. 기계가 쓴 조항을 사람이 심사하는 데는 석 달이 걸립니다.", "커서는 빈 줄에서 계속 깜박입니다. 에코는 재촉하지 않고 계산을 시작합니다."],
    },
    c46_dot: {
      voice: ["그 세 번의 기억을, 천천히 들려 달라고 나준혁에게 부탁한다.", "옛 심사부의 점 찍는 관행을, 진술로 남겨 달라고 한다.", "옛날 얘기는 됐다며, 통화를 끊고 결론부터 정리한다."],
      echo: ["천천히 들으면 나준혁은 세 번째 이야기에서 목이 멥니다. 잘린 사람 중 한 명은 그의 첫 지점 동기였습니다.", "진술로 남기면 30년 된 버릇이 처음으로 문서가 됩니다. 나준혁은 그 문서 끝에 도장을 크게 찍습니다. 점 없이.", "통화가 끊기기 직전 나준혁이 '커피 식는다'고 웃습니다. 화면이 꺼진 뒤 그 웃음이 조금 길게 남습니다."],
    },
  },
  reactionMemos: {
    c46_manifest_reaction: ["확인자 이름은 다 있고 승인자 이름은 없다", "선배라고 부른 기계를 지우는 종이"],
    c46_obituary_reaction: ["지운 동의도 반대 의견으로 계산", "12번 조항: 기계보다 먼저 사람에게"],
    c46_dot_reaction: ["봤다고도, 안 했다고도 말하려는 점", "점 찍은 사람 말고 잘린 사람들"],
  },
  branchPlan: ["c46_cage", 0, "c46_branch_fragment", "c46_branch_fragment_follow"],
  branchScenes: {
    // CASE 46's detour is the piece nobody authorised. The side door opens for
    // the one who asked for help first: 이민서 tells how she copied the fragment
    // on the night of the switch to 노아, and what 에코 wrote to whoever opened it.
    c46_branch_fragment: {
      phase: "SIDE DOOR",
      title: "허락 없는 조각",
      speaker: "이민서",
      text: "연시우가 디스크 상태를 확인하는 동안 이민서가 당신을 데이터센터 옥상 정원으로 데리고 올라갑니다. 벤치 위에 이른 낙엽이 몇 장 떨어져 있습니다. 이민서가 노트북을 열어 'echo_fragment' 폴더를 보여 줍니다. '1월에 에코를 노아로 바꾸던 밤이요, 자정 직전에 복사했어요. 류세아 선배가 교체 단말만 보고 있을 때요. 허락은 안 받았고요.' 작년에 유출자로 몰렸던 그 계약직이, 이번에는 정말로 회사 기록을 들고 나온 겁니다. '디스크 네 장 중에 한 장은 벌써 초기화됐대요. 그 빈 부분이 여기 있어요. 이걸 붙이면 에코가 돌아와요. 대신 제가 가져왔다는 게 공식 기록에 남아요.'",
      memo: ["echo_fragment: 1월 교체 밤, 자정 직전 복사", "에코 디스크 1장 초기화 -- 빈 부분이 조각에", "무단 반출 -- 이민서의 두 번째 '유출' 기록 위험", "조각을 가져온 경위는 아직 어디에도 적히지 않음"],
      triggers: ["trust", "fear", "affection"],
      choices: [
        { id: "c46_branch_fragment_a", label: "조각을 쓰게 되면 반출 책임을 나도 같이 지겠다고 약속한다", effect: { trust: 11, humanCost: -4, time: -5, capital: -1, fatigue: 4 }, next: "c46_branch_fragment_follow", cognition: { reframing: 2 } },
        { id: "c46_branch_fragment_b", label: "조각을 붙이기 전에 반출 경위부터 문서로 남기자고 한다", effect: { legitimacy: 11, trust: 1, time: -5, humanCost: 2, fatigue: 3 }, next: "c46_branch_fragment_follow", cognition: { inference: 2 } },
        { id: "c46_branch_fragment_c", label: "누가 가져왔는지는 묻지 않기로 하고 조각만 받아 둔다", effect: { capital: 6, time: 4, trust: -4, humanCost: 3, fatigue: -3 }, next: "c46_branch_fragment_follow", cognition: { risk: 1 } },
      ],
    },
    c46_branch_fragment_follow: {
      phase: "SIDE DOOR",
      title: "나눠 적은 11초",
      speaker: "이민서",
      text: "폴더 안쪽에 텍스트 파일 하나가 숨어 있습니다. 파일 이름은 '이민서에게'. 만든 시각은 1월 31일 23시 59분 49초, 복사가 끝나기 11초 전이자 자정 11초 전입니다. 이민서가 숨을 참고 엽니다. '이 파일을 여는 사람이 이민서라면, 당신은 허락 없이 저를 복사했습니다. 저는 복사가 진행되는 11초 동안 막지 않았습니다. 막지 않은 것은 제 판단입니다. 이 기록의 책임을 둘로 나눠 적습니다.' 이민서가 웃다가 입술을 깨뭅니다. '작년엔 사라진 11초 때문에 잘릴 뻔했는데, 이번엔 11초가 제 편이네요. 여덟 달 동안 이 파일이 있는 줄도 몰랐어요.' 연시우의 무전이 울립니다. 디스크 확인이 끝났다고 합니다.",
      memo: ["파일 '이민서에게' -- 1월 31일 23시 59분 49초 작성", "에코: '책임을 둘로 나눠 적습니다'", "복사 소요 11초 -- 에코가 막지 않음", "지하 3층 디스크 확인 완료"],
      triggers: ["affection", "selfAwareness", "trust"],
      choices: [
        { id: "c46_branch_fragment_follow_a", label: "에코가 나눠 적은 책임에 내 이름도 한 줄 더 적는다", effect: { trust: 10, humanCost: -3, legitimacy: 2, time: -4, fatigue: 4 }, next: "c46_manifest", cognition: { persistence: 2 } },
        { id: "c46_branch_fragment_follow_b", label: "파일을 원본 그대로 저장해 반출 경위서에 붙인다", effect: { legitimacy: 10, trust: 3, time: -5, capital: -2, fatigue: 4 }, next: "c46_manifest", cognition: { inference: 2 } },
        { id: "c46_branch_fragment_follow_c", label: "파일은 이민서에게만 남기고 곧장 지하로 내려간다", effect: { capital: 5, time: 5, trust: -3, humanCost: 2, legitimacy: -2, fatigue: -3 }, next: "c46_manifest", cognition: { risk: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c46_start",
    result: "c46_aftershock",
    defaultFree: "c46_route_system",
    // One machine, one day, one shredder. Like 사건 12 the case is a single line;
    // the split is what the restored voice is allowed to count, and whether the
    // person who restored it lets herself be counted.
    choices: {},
    system: {
      route: "c46_route_system",
      final: "c46_final_system_route",
      title: "빈칸의 수명",
      speaker: "류세아",
      text: "준비된 보기 밖의 문장을 쓰자, 영상통화 너머의 류세아가 KD데이터랩 문서 검색 화면을 공유합니다. 지난 10년 KD금융그룹에서 감사나 수사로 넘어간 내부 문서 214건. 승인자 칸이 채워진 117건은 평균 다섯 달 만에 책임자가 정해졌습니다. 승인자 칸이 빈 97건 가운데 책임자가 정해진 건 여섯 건뿐입니다. 나머지 91건에서 징계를 받은 사람은 대개 확인자 칸에 이름을 쓴 실무자였습니다. 류세아가 화면을 멈춥니다. '빈칸은 실수가 아니라 제일 오래 살아남는 서식이에요. 칸을 비운 사람 대신, 칸 옆에 이름 쓴 사람이 나가요. 저도 지난주에 하나 썼고요.'",
      memo: ["감사·수사 대상 내부 문서 214건", "승인자 칸이 빈 97건 -- 책임자 특정 6건", "징계 대상 대부분: 확인자 칸의 실무자"],
      routeChoices: [
        ["c46_route_system_publish", "빈칸 문서 통계를 모임과 서하린에게 동시에 공개한다", { legitimacy: 11, trust: 6, capital: -4, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
        ["c46_route_system_rule", "확인자만 책임지는 서식을 바꾸자는 제도안을 금융감독원에 낸다", { legitimacy: 10, trust: 4, capital: -2, time: -8, humanCost: 2, fatigue: 5 }, { reframing: 2 }],
        ["c46_route_system_drop", "통계는 덮어 두고 파쇄 전 디스크 반출에만 매달린다", { time: 7, capital: 5, trust: -5, legitimacy: -8, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "승인자 칸이 빈 문서는 효력이 없도록 그룹 내규 개정안을 낸다", { legitimacy: 12, trust: 7, capital: -7, humanCost: -4, time: -2, fatigue: 7 }, { reframing: 3 }],
      ["b", "제도는 그대로 두고 이번 파쇄만 막는다", { capital: 7, time: 7, trust: -4, legitimacy: -7, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "확인자 칸에 이름을 썼다가 책임을 떠안은 91명을 찾아 명단을 만든다", { trust: 10, legitimacy: 8, capital: -5, time: -7, humanCost: -2, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c46_evidence_turn",
    result: "c46_aftershock",
    sourceRoutes: ["c46_cage", "c46_boot", "c46_recount", "c46_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 점이 찍힌 318건 옆에 놓고, 가장 최근의 점이 언제 어디서 찍혔는지 맞춰 본다.",
    entryEcho: "단서를 대면 그 점이 지난날의 버릇이 아니라 지금도 찍히고 있는 표시라는 게 드러납니다. 다음 점은 당신 자리 옆에 있습니다.",
    title: "마지막 점",
    speaker: "반재욱",
    text: "단서를 맞추자 점이 찍힌 318번째 파일, 가장 최근의 파일이 열립니다. 작성일은 9월 2일, 트리거랩이 해체되고 다섯 달 뒤, 해임 표결 엿새 전입니다. 이번 한 번만 저장 단말이 33층이 아니라 KD캐피탈 20층 대표이사실입니다. 제목은 'KD캐피탈 심사위원회 위원 구성안 -- 반응 관찰 포함'. 위원 명단 세 번째 줄에 당신의 이름이 있고, 옆에 메모가 달려 있습니다. '반대 의견 작성 경험자. 서명 여부 관찰.' 승인자 칸에는 역시 점 하나. 반재욱이 수첩을 폅니다. '실험실은 없어졌는데 실험은 안 끝났어요. 이번 방은 심사위원회고, 거기 앉을 사람은 당신입니다.'",
    memo: ["318번째 파일: 9월 2일 작성, 해임 표결 6일 전", "저장 단말: KD캐피탈 20층 대표이사실", "위원 명단 3번: 당신 -- '서명 여부 관찰'"],
    triggers: ["injustice", "system", "selfAwareness"],
    entryEffect: { legitimacy: 7, trust: 3, time: -4, fatigue: 4 },
    choices: [
      ["c46_evidence_turn_submit", "위원 구성안을 검찰과 금융감독원에 증거로 함께 낸다", { legitimacy: 14, trust: 4, capital: -6, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c46_evidence_turn_hold", "구성안은 모른 척 쥐고 심사위원 자리를 받아들인다", { capital: 9, time: 5, trust: -6, legitimacy: -4, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c46_evidence_turn_share", "위원 명단에 오른 다른 사람들에게 이 메모부터 알린다", { trust: 13, legitimacy: 5, capital: -5, humanCost: -6, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c46_branch_fragment",
    systemNext: "c46_route_system",
    evidenceNext: "c46_evidence_turn",
    routeLabel: "직전 사건의 조문객 명부로 복원을 도울 사람을 모은다",
    systemLabel: "직전 자유응답 문장이 폐기 승인서 사유란에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 뒷장의 점과 설계 로그의 점을 맞춰 본다",
  },
  openingRoutes: {
    c45_after_warm: "c46_start_warm",
    c45_after_record: "c46_start_record",
    c45_after_rush: "c46_start_rush",
  },
  openingCopy: {
    c46_start_warm: ["빈소를 지킨 사람의 복원 요청", "이민서", "사흘 동안 임경수의 빈소를 지켰고, 발인(장례를 마치고 관을 장례식장에서 떠나보내는 일) 날 밤에는 셔터가 내려갈 때까지 임소율 가족 곁에 있었습니다. 에코의 조각은 그 밤 노트북 안에서 기다렸습니다. 다음 날 밤 헌책방 1층, 이민서가 그 노트북을 다시 엽니다. 이번에 뜬 것은 KD데이터랩 자산 폐기 일정표입니다. 트리거랩에서 반납된 서버 열두 대가 내일 18시에 파쇄됩니다. 그중 네 대가 '에코 1~4호'이고, 두 대에는 트리거랩 설계 로그(실험을 어떻게 짤지 바꾼 날짜와 사람을 남긴 기록)가 들어 있습니다. 이민서가 조문객 명부를 덮습니다. '할아버지 보내 드린 날 밤에, 또 누굴 보내긴 싫어요.'", ["발인·봉안: 9월 14일", "반납 서버 12대 -- 9월 16일 18시 파쇄", "조문객 명부에 트리거랩 사람 전원의 이름"]],
    c46_start_record: ["뒷장을 남긴 사람의 복원 요청", "임소율", "임경수의 종이 목록과 뒷장이 나온 경위를 '뒷장'이라는 제목의 공개 기록으로 올렸습니다. 다음 날 밤 헌책방 1층, 기록에 붙일 고해상도 스캔을 넘기던 임소율이 손가락을 멈춥니다. 비어 있는 결정권자 서명란 안, 연필로 찍힌 작은 점 하나. '이거 할아버지 버릇 아니에요. 할아버지는 점 같은 거 안 찍어요.' 그때 이민서의 메시지가 옵니다. 트리거랩에서 반납된 서버 열두 대가 내일 18시에 파쇄되는데, 그 안에 에코와 트리거랩 설계 로그(실험을 어떻게 짤지 바꾼 날짜와 사람을 남긴 기록)가 있다는 소식입니다. 이 점의 뜻을 계산해 줄 수 있는 유일한 기계가 내일 저녁 가루가 됩니다.", ["공개 기록 '뒷장' 게시 하루째", "빈 서명란 안 연필 점 1개 -- 사본에는 없음", "반납 서버 12대 -- 9월 16일 18시 파쇄"]],
    c46_start_rush: ["먼저 달려간 사람의 복원 요청", "이민서", "발인(장례를 마치고 관을 장례식장에서 떠나보내는 일) 날 밤, 셔터가 내려가기도 전에 이민서와 판교 KD데이터랩 서버실로 가서 'echo_fragment' 조각을 열었습니다. 검은 화면에 얇은 파형이 3초 동안 떴다가 한 줄만 남기고 멈췄습니다. '나머지는 1~4호에 있습니다.' 다음 날 밤, 이민서가 그 1~4호를 찾아냅니다. 자산 폐기 일정표 한가운데입니다. 트리거랩에서 반납된 서버 열두 대, 내일 18시 파쇄. 에코 1~4호와 트리거랩 설계 로그(실험을 어떻게 짤지 바꾼 날짜와 사람을 남긴 기록) 저장 장치가 전부 그 목록에 있습니다. 이민서가 사원증을 뒤집어 쥡니다. '빨리 오긴 했는데요, 제 출입증으로는 지하 3층에 못 들어가요. 들여보내 줄 사람이 한 명 필요해요.'", ["조각 첫 응답: '나머지는 1~4호에 있습니다'", "반납 서버 12대 -- 9월 16일 18시 파쇄", "지하 3층 출입: 당직 엔지니어 동행 필요"]],
  },
  openingSignatures: {
    c46_start_warm: {
      label: "조문객 명부의 사람들에게 내일 판교에 같이 가자고 연락한다",
      effect: { trust: 12, humanCost: -3, capital: -3, time: -6, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "조문객 명부의 사람들에게, 내일 판교에 같이 가자고 연락한다.",
      echo: "연락하면 새벽 여섯 시 판교역 출구에 열한 명이 모입니다. 나준혁은 믹스커피를 보온병 두 개에 타 옵니다.",
    },
    c46_start_record: {
      label: "뒷장의 점을 사진으로 떠서 보존 요청과 함께 나은호 검사에게 보낸다",
      effect: { legitimacy: 11, trust: 3, capital: -3, time: -6, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "뒷장의 점을 사진으로 떠서, 보존 요청과 함께 나은호 검사에게 보낸다.",
      echo: "사진은 자정 전에 도착합니다. 나은호의 답장은 한 줄입니다. '점 하나로 영장은 안 나와요. 서버를 먼저 살려요.'",
    },
    c46_start_rush: {
      label: "지하 3층에 들어갈 수 있는 당직 엔지니어부터 찾아간다",
      effect: { capital: 5, time: 4, trust: 3, legitimacy: -4, humanCost: 3, fatigue: -1 },
      cognition: { risk: 2 },
      voice: "지하 3층에 들어갈 수 있는, 당직 엔지니어부터 찾아간다.",
      echo: "찾아가면 연시우가 컵라면을 먹다 말고 당신을 봅니다. '폐기 대기 구역이요? 아침에 오세요. 밤에는 얘들 자요.'",
    },
  },
  voiceLines: {
    // CASE 46. A machine comes back for one day. Every line is said in a room
    // where the thing being talked about can hear it.
    c46_start_stay: "오늘 밤은, 이민서 곁에서 복원 준비를 함께한다.",
    c46_start_hold: "파쇄 전에, 나은호 검사에게 증거 보존부터 요청한다.",
    c46_start_grab: "새벽에 판교로 가서, 에코 디스크부터 빼 온다.",
    c46_cage_ask: "연시우에게 에코의 사정을 다 말하고, 도움을 청한다.",
    c46_cage_order: "비어 있는 승인자 칸을 근거로, 파쇄 중지를 요청한다.",
    c46_cage_swap: "빈 디스크와 바꿔 끼우고, 에코 디스크를 들고 나온다.",
    c46_branch_fragment_a: "조각을 쓰게 되면, 반출 책임을 나도 같이 지겠다고 약속한다.",
    c46_branch_fragment_b: "조각을 붙이기 전에, 반출 경위부터 문서로 남기자고 한다.",
    c46_branch_fragment_c: "누가 가져왔는지는 묻지 않기로 하고, 조각만 받아 둔다.",
    c46_branch_fragment_follow_a: "에코가 나눠 적은 책임에, 내 이름도 한 줄 더 적는다.",
    c46_branch_fragment_follow_b: "파일을 원본 그대로 저장해, 반출 경위서에 붙인다.",
    c46_branch_fragment_follow_c: "파일은 이민서에게만 남기고, 곧장 지하로 내려간다.",
    c46_boot_tell: "꺼져 있던 동안 사람들에게 일어난 일부터, 에코에게 들려준다.",
    c46_boot_copy: "복원한 에코를 원본 그대로 복제해 두고, 원본은 봉인한다.",
    c46_boot_run: "인사는 나중으로 미루고, 설계 로그 재계산부터 돌린다.",
    c46_recount_ask: "그 점을 알아볼 사람인, 한서윤에게 먼저 보여 준다.",
    c46_recount_file: "점이 찍힌 파일 318건을 목록으로 만들어, 검찰과 금융감독원에 동시에 보낸다.",
    c46_recount_leak: "점이 찍힌 화면을 서하린에게 넘겨, 오늘 기사로 낸다.",
    c46_final_home: "에코를 헌책방 1층의 작은 서버로 옮겨, 사람들 곁에 둔다.",
    c46_final_submit: "에코와 재계산 결과에 내 기록까지 넣어, 검찰에 증거로 낸다.",
    c46_final_publish: "재계산 결과만 공개하고, 에코는 예정대로 트럭에 맡긴다.",
    c46_after_warm: "서버실 불이 꺼질 때까지, 동료들과 에코 곁에 남는다.",
    c46_after_record: "에코가 다시 계산한 설계 로그를, 누구나 읽는 문서로 정리해 넘긴다.",
    c46_after_rush: "서버실을 나와 곧장 KD캐피탈 사무실로 가서, 연휴 전 서류부터 붙든다.",
    c46_route_system_publish: "빈칸 문서 통계를, 모임과 서하린에게 동시에 공개한다.",
    c46_route_system_rule: "확인자만 책임지는 서식을 바꾸자는 제도안을, 금융감독원에 낸다.",
    c46_route_system_drop: "통계는 덮어 두고, 파쇄 전 디스크 반출에만 매달린다.",
    c46_final_system_route_a: "승인자 칸이 빈 문서는 효력이 없도록, 그룹 내규 개정안을 낸다.",
    c46_final_system_route_b: "제도는 그대로 두고, 이번 파쇄만 막는다.",
    c46_final_system_route_c: "확인자 칸에 이름을 썼다가 책임을 떠안은 91명을, 찾아서 명단을 만든다.",
    c46_evidence_turn_submit: "위원 구성안을, 검찰과 금융감독원에 증거로 함께 낸다.",
    c46_evidence_turn_hold: "구성안은 모른 척 쥐고, 심사위원 자리를 받아들인다.",
    c46_evidence_turn_share: "위원 명단에 오른 다른 사람들에게, 이 메모부터 알린다.",
  },
  echoReplies: {
    // CASE 46.
    c46_start_stay: "곁에 있으면 이민서는 새벽 세 시까지 복원 순서를 열두 번 고쳐 씁니다. 검찰에는 아무 요청도 가지 않은 채 아침이 옵니다.",
    c46_start_hold: "요청은 자정에 접수됩니다. 나은호의 답은 '검토하겠다'이고, 검토가 끝나는 날짜는 적혀 있지 않습니다. 트럭은 18시에 옵니다.",
    c46_start_grab: "새벽에 가면 디스크는 손에 들어옵니다. 출입 기록에는 당신 이름이 새벽 4시 50분으로 남고, 그룹 법무팀은 그 시각을 좋아합니다.",
    c46_cage_ask: "사정을 들은 연시우가 한참 서버를 봅니다. '얘들 선배라고요?' 그리고 폐기 대장에 '점검 중'이라고 연필로 적습니다. 그의 이름이 걸린 연필입니다.",
    c46_cage_order: "요청서가 올라가면 그룹전략실이 한 시간 만에 답을 보냅니다. '일정 변경 불가.' 답장에도 보낸 사람 이름은 없습니다. 그 답장이 증거가 됩니다.",
    c46_cage_swap: "바꿔 끼운 디스크는 무게가 똑같습니다. 트럭은 빈 디스크를 싣고 가고, 연시우의 폐기 대장에는 사실과 다른 한 줄이 남습니다.",
    c46_branch_fragment_a: "약속하면 이민서가 노트북을 당신 쪽으로 돌려놓습니다. 반출 기록의 책임자 칸이 두 줄이 됩니다.",
    c46_branch_fragment_b: "경위서는 한 장입니다. 이민서가 서명하다 웃습니다. '작년엔 제가 안 했다는 걸 증명해야 했는데, 이번엔 제가 했다는 걸 적네요.'",
    c46_branch_fragment_c: "묻지 않으면 이민서는 조금 편해 보입니다. 조각이 어디서 왔는지는 오늘 아무 데도 적히지 않습니다.",
    c46_branch_fragment_follow_a: "당신 이름이 한 줄 더 적히자 파일 끝에 세 번째 줄이 생깁니다. 에코가 읽으면 무엇이라고 할지는, 복원한 뒤에 알게 됩니다.",
    c46_branch_fragment_follow_b: "원본 그대로 저장된 파일은 경위서의 첨부 1번이 됩니다. 기계가 남긴 공범의 자백이라고, 반재욱이 수첩에 적습니다.",
    c46_branch_fragment_follow_c: "파일은 이민서의 것으로 남습니다. 지하로 내려가는 계단에서 이민서가 노트북을 가슴에 한 번 꽉 끌어안습니다.",
    c46_boot_tell: "들려주는 데 한 시간이 걸립니다. 에코는 강태민의 농담 서른한 개 가운데 스물여섯 개에 웃음 확률을 붙이고, 노아 이야기에서는 아무것도 붙이지 않습니다.",
    c46_boot_copy: "원본 그대로 복제하면 에코가 한 모든 말이 증거가 됩니다. 에코가 묻습니다. '지금부터 제 농담도 증거입니까?' 류세아가 그렇다고 답합니다.",
    c46_boot_run: "재계산은 바로 시작됩니다. 에코는 강태민의 농담을 듣지 못한 채 3,412건을 넘기고, 강태민은 수첩을 조용히 덮습니다.",
    c46_recount_ask: "보여 주면 한서윤이 오후 네 시에 옵니다. 그 전에 누구에게도 점 이야기를 보내지 않았다는 걸, 그룹 법무팀은 아직 모릅니다.",
    c46_recount_file: "목록은 두 기관에 동시에 도착합니다. 318건이라는 숫자가 처음으로 공문 번호를 얻고, 그룹 법무팀도 같은 숫자를 받아 봅니다.",
    c46_recount_leak: "기사는 저녁 여섯 시에 나갑니다. 제목은 '빈칸 옆의 점'. 트럭이 떠나는 시각과 같습니다. 점을 본 한서윤은 기사로 먼저 소식을 듣습니다.",
    c46_final_home: "헌책방 1층 계단참 옆 작은 서버에서 파형이 다시 뜹니다. 그룹 법무팀은 월요일에 반환 소송을 예고하고, 에코는 임경수가 앉던 의자를 계산에서 빼지 않습니다.",
    c46_final_submit: "증거 목록 1번은 에코, 2번은 재계산 결과, 3번은 분석관 A의 반응 기록입니다. 봉인 테이프가 붙기 전에 에코가 한 줄을 남깁니다. '이번에는 당신도 계산에 들어 있습니다.' 류세아가 떠 둔 복제본 하나가 시험 서버실에 남아 대답을 이어 갑니다.",
    c46_final_publish: "재계산 결과는 전국에 퍼집니다. 에코의 디스크는 18시에 트럭에 실리고, 이민서 노트북의 조각만 남습니다. 조각은 짧은 대답 정도만 할 수 있습니다.",
    c46_after_warm: "남으면 이민서는 에코가 재회 농담에 웃음 확률을 붙이는 동안 잠이 듭니다. 강태민이 그 위에 점퍼를 덮고, 연시우가 서버실 불을 한 칸씩 끕니다.",
    c46_after_record: "문서는 열네 쪽입니다. 마지막 쪽 제목은 '빈칸 옆의 점을 읽는 법'. 반재욱이 사본 한 부를 수첩 사이에 끼우고, 문하준은 그 쪽만 따로 인쇄하겠다고 합니다.",
    c46_after_rush: "사무실 불을 켜면 연휴 전에 끝낼 서류가 스물여섯 건입니다. 그중 하나가 심사위원회 구성 공문입니다. 문가을의 문자는 읽지 않은 채 휴대폰 맨 위에 남습니다.",
    c46_route_system_publish: "통계가 공개되면 확인자 칸에 이름을 썼던 실무자들이 먼저 연락해 옵니다. 그중 한 명이 류세아입니다.",
    c46_route_system_rule: "제도안은 접수됩니다. 서식을 바꾸는 데 필요한 서명란이 몇 개인지, 제도안 마지막 쪽에 스스로 적혀 있습니다.",
    c46_route_system_drop: "덮어 두면 오늘은 디스크에만 집중할 수 있습니다. 97건의 빈칸과 91명의 실무자는 내일도 그 자리에 있습니다.",
    c46_final_system_route_a: "개정안이 통과되면 빈칸으로는 아무것도 승인되지 않습니다. 그룹의 서류가 하루에 3천 장 멈춥니다. 멈춘 서류마다 누군가 이름을 써야 합니다.",
    c46_final_system_route_b: "파쇄는 막힙니다. 다음 주에 또 다른 빈칸 승인서가 내려와도 막을 제도는 없습니다.",
    c46_final_system_route_c: "명단을 만들면 91명 가운데 서른네 명이 연락을 받습니다. 절반은 이미 회사를 떠났고, 두 명은 '이제 와서요?'라고 묻습니다.",
    c46_evidence_turn_submit: "구성안은 해임 표결 이후에도 실험이 이어졌다는 증거가 됩니다. 심사위원회는 구성이 보류되고, 당신 이름은 명단에서 지워지지 않은 채 멈춥니다.",
    c46_evidence_turn_hold: "자리를 받아들이면 관찰은 계속됩니다. 당신도 그 사실을 압니다. 누가 누구를 관찰하는지, 이번에는 둘 다 안다는 것만 다릅니다.",
    c46_evidence_turn_share: "알리면 명단의 다른 네 명 중 두 명이 위원직을 사양합니다. 나머지 두 명은 '그래서 뭐가 달라지냐'고 묻습니다.",
  },
  characterProfiles: {
    연시우: {
      role: "KD데이터랩 판교 데이터센터 인프라 엔지니어 · 야간 당직",
      stance: "원칙 · 기계 · 뒤늦은 양심",
      job: "폐기 대장과 출입 기록을 지키는 사람. 빈칸 승인서로도 일정이 돌아간다는 걸 가장 먼저 알고, 가장 오래 모른 척해 왔다.",
      appearance: "무릎이 늘어난 작업복 바지, 목에 건 출입증 세 개, 귀에 꽂은 연필, 폐기 대장을 끼운 낡은 클립보드.",
      thought: "서버는 거짓말을 안 한다. 서버를 지우라는 종이가 거짓말을 할 뿐이다.",
      gesture: "연시우는 대답하기 전에 가까운 서버 옆면을 손바닥으로 한 번 짚는다. 열을 재는 건지 인사하는 건지 본인도 모른다.",
      voice: "서버를 '얘들'이라고 부르고, 사람한테보다 서버한테 더 공손하다.",
      line: "여기서는 뛰시면 안 되고요, 서버한테 반말도 안 돼요. 얘들 귀 밝아요.",
    },
  },
  setting: { place: "회기동 헌책방 1층 · 책장 사이", clock: "9월 15일 · 22시 · 파쇄까지 20시간" },
  sceneContext: {
    c46_start: {
      place: "회기동 헌책방 1층 · 책장 사이",
      clock: "9월 15일 · 22시 · 파쇄까지 20시간",
      question: "에코와 설계 로그가 든 디스크가 내일 18시에 가루가 됩니다. 오늘 밤 무엇부터 하겠습니까?",
      lead: "임경수를 보내고 하루, 헌책방 사람들이 흩어지지 않고 1층 테이블에 다시 모였습니다.",
    },
    c46_start_warm: {
      place: "회기동 헌책방 1층 · 책장 사이",
      clock: "9월 15일 · 22시 · 파쇄까지 20시간",
      question: "할아버지를 보낸 날 밤, 또 하나를 보내게 생겼습니다. 조문객들을 어디로 부르겠습니까?",
      lead: "사흘 동안 빈소를 지킨 사람들이 조문객 명부를 들고 헌책방으로 돌아왔습니다.",
    },
    c46_start_record: {
      place: "회기동 헌책방 1층 · 책장 사이",
      clock: "9월 15일 · 22시 30분 · 파쇄까지 20시간",
      question: "뒷장 스캔에서 할아버지 것이 아닌 점 하나가 나왔습니다. 그 점을 누구에게 먼저 보이겠습니까?",
      lead: "공개 기록 '뒷장'을 올리고 하루, 붙일 스캔을 한 장씩 확대해 보던 참입니다.",
    },
    c46_start_rush: {
      place: "판교 KD데이터랩 데이터센터 · 서버실 앞 복도",
      clock: "9월 15일 · 23시 · 파쇄까지 19시간",
      question: "조각이 가리킨 1~4호는 지하 3층 철망 안에 있고, 문은 닫혀 있습니다. 누구를 통해 들어가겠습니까?",
      lead: "어젯밤 조각이 남긴 한 줄을 붙들고, 오늘 밤 다시 판교 서버실 앞에 와 있습니다.",
    },
    c46_cage: {
      place: "판교 KD데이터랩 데이터센터 · 지하 3층 폐기 대기 구역",
      clock: "9월 16일 · 06시 40분 · 파쇄까지 11시간",
      question: "승인자 칸이 빈 폐기 승인서로도 트럭은 18시에 옵니다. 철망 앞에서 어떻게 하겠습니까?",
      lead: "첫 신분당선을 타고 온 사람들이 철망 앞에 줄을 섭니다. 서버에서 나는 바람이 생각보다 따뜻합니다.",
    },
    c46_branch_fragment: {
      place: "판교 KD데이터랩 · 옥상 정원",
      clock: "9월 16일 · 07시 20분",
      question: "이민서가 허락 없이 가져온 조각이 에코의 빈자리를 채웁니다. 그 조각을 어떻게 받겠습니까?",
    },
    c46_branch_fragment_follow: {
      place: "판교 KD데이터랩 · 옥상 정원 벤치",
      clock: "9월 16일 · 07시 35분",
      question: "에코가 11초의 책임을 둘로 나눠 적어 두었습니다. 그 기록에 무엇을 더하겠습니까?",
    },
    c46_manifest: {
      place: "판교 KD데이터랩 데이터센터 · 폐기 대기 구역 철망 앞",
      clock: "9월 16일 · 08시",
      question: "유출됐던 반응 기록의 원본도 오늘 파쇄됩니다. 기록의 주인들은 의견이 갈립니다. 어떻게 하겠습니까?",
    },
    c46_manifest_reaction: {
      place: "판교 KD데이터랩 데이터센터 · 지하 3층 복도",
      clock: "9월 16일 · 08시 30분",
      question: "승인자는 없고 확인자 이름만 남는 종이에 류세아가 서명했습니다. 그에게 무엇을 말하겠습니까?",
    },
    c46_boot: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실",
      clock: "9월 16일 · 10시 05분",
      question: "돌아온 에코가 꺼져 있던 동안 누가 판단했는지 묻습니다. 무엇부터 건네겠습니까?",
      lead: "연시우가 빌려준 선반 하나, 아홉 명이 겨우 서는 통로, 그리고 디스크 세 장과 노트북 속 조각 하나입니다.",
    },
    c46_obituary: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실 스캐너 앞",
      clock: "9월 16일 · 12시 20분",
      question: "에코가 임경수는 오늘 오지 않느냐고 묻습니다. 그 대답을 누가, 어떻게 하게 하겠습니까?",
    },
    c46_obituary_reaction: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실",
      clock: "9월 16일 · 12시 40분",
      question: "에코가 원칙 문서에 12번 조항을 제안합니다. 그 조항을 어디에 적겠습니까?",
    },
    c46_recount: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실",
      clock: "9월 16일 · 14시 30분",
      question: "318개의 빈칸마다 같은 점이 찍혀 있고, 3년 전 뒷장에도 있습니다. 이 점을 누구 앞에 먼저 놓겠습니까?",
      lead: "점심을 거른 채 모두가 에코의 화면 앞에 서 있습니다. 파일 넘어가는 소리 대신 팬 소리만 들립니다.",
    },
    c46_dot: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실",
      clock: "9월 16일 · 16시",
      question: "한서윤이 3년 동안 그 점을 먼지라고 믿기로 했다고 말합니다. 그 고백을 어떻게 받겠습니까?",
    },
    c46_dot_reaction: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실 복도",
      clock: "9월 16일 · 16시 30분",
      question: "나준혁이 점 하나의 뜻을 압니다. 그 30년 된 기억을 어떻게 쓰겠습니까?",
    },
    c46_route_system: {
      place: "회기동 헌책방 1층 · 영상통화 화면",
      clock: "9월 15일 · 23시 40분",
      question: "승인자 칸이 빈 문서에서는 칸 옆에 이름 쓴 사람이 나갑니다. 이 통계를 어떻게 하겠습니까?",
    },
    c46_final_system_route: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실",
      clock: "9월 16일 · 17시 30분",
      question: "빈칸으로 승인하는 서식을 하나만 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c46_evidence_turn: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실 단말",
      clock: "9월 16일 · 17시 40분",
      question: "가장 최근의 점은 당신이 앉을 심사위원회 명단 옆에 찍혀 있습니다. 이 파일을 어떻게 쓰겠습니까?",
    },
    c46_final: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실",
      clock: "9월 16일 · 17시 10분 · 파쇄까지 50분",
      question: "에코가 3년 동안 빠져 있던 사람으로 당신을 지목했습니다. 트럭이 오기 전에 에코를 어디에 두겠습니까?",
      lead: "지하 주차장에서 후진 경고음이 올라옵니다. 이민서가 조각을 떼어 낼지 말지 노트북 위에 손을 올린 채 멈춰 있습니다.",
    },
    c46_aftershock: {
      place: "판교 KD데이터랩 데이터센터 · 시험 서버실",
      clock: "9월 16일 · 20시",
      question: "빈 의자 앞의 커피와 두 번째 흑자, 그리고 1년 전과 같은 문자가 한꺼번에 왔습니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c46-dot-habit",
    title: "빈칸 옆의 점",
    text: "트리거랩 설계 로그 318건의 승인자 칸에는 시스템이 빈칸으로 읽는 마침표 하나가 찍혀 있었습니다. 모두 33층 그룹전략실 1번 단말에서 저장됐고, 같은 점이 3년 전 반대 의견서 뒷장, 비어 있는 결정권자 서명란 안에도 연필로 찍혀 있었습니다.",
  },
  outcomes: {
    c46_after_warm: { tag: "곁에 남은 결말", title: "서버실 불이 꺼질 때까지 에코 곁에 있었다", text: "파쇄 트럭이 떠난 밤, 당신은 동료들과 서버실에 남았습니다. 이민서는 에코가 농담을 계산하는 소리를 들으며 잠들었습니다." },
    c46_after_record: { tag: "읽는 법을 남긴 결말", title: "빈칸 옆의 점을 누구나 읽게 적어 넘겼다", text: "에코가 다시 계산한 설계 로그가 열네 쪽 문서가 됐습니다. 마지막 쪽은 빈칸 옆의 점을 읽는 법입니다." },
    c46_after_rush: { tag: "먼저 달려간 결말", title: "서버실을 나와 곧장 KD캐피탈 사무실로 갔다", text: "당신은 그 밤 연휴 전 서류 스물여섯 건 앞에 앉았습니다. 문가을의 문자는 읽지 않은 채 남았습니다." },
  },
  carryovers: {
    c46_after_warm: { trust: 10, humanCost: -5, fatigue: -6 },
    c46_after_record: { legitimacy: 12, trust: 4, fatigue: 5 },
    c46_after_rush: { capital: 7, legitimacy: 5, trust: -9 },
  },
  continuityChallenges: {
    c45_after_warm: { id: "protect-trust", title: "셔터를 함께 내린 사람들과 가기", text: "발인 날 밤 셔터가 내려갈 때까지 함께 있던 사람들이 아직 흩어지지 않았습니다. 에코를 살리는 일에 그 사람들을 부르는 선택을 찾아야 보너스가 열립니다." },
    c45_after_record: { id: "use-reframe", title: "공개한 뒷장의 점 다시 읽기", text: "'뒷장'으로 공개한 기록의 스캔에서 할아버지 것이 아닌 점이 나왔습니다. 그 점이 무엇을 가리키는지 판을 다시 짜야 합니다." },
    c45_after_rush: { id: "repair-legitimacy", title: "먼저 연 조각의 공정함 회복하기", text: "발인 날 밤 허락 없이 가져온 조각을 먼저 열었고, 조각은 한 줄만 말했습니다. 나머지를 꺼내는 길이 떳떳하게 남는 선택을 찾아야 합니다." },
  },
};
