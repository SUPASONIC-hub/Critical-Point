/**
 * PROLOGUE 05 -- the day the transfer comes, and the door into 사건 01.
 *
 * Four chapters built a dissent: a probationer's first desk, the file numbered
 * 2023-0412, the committee that sent the dissent back, and the teller window
 * where the loan had already been sold. Nothing happened. The follow-up review
 * closed in June with "해당 없음", nobody was punished, nothing was fixed. Then
 * a single sheet of paper moves one person: 인사 제2023-1187호, new posting
 * "그룹 인지·판단 연구랩", reason box empty, proposer box empty. No name anywhere
 * on it. That shape -- a decision with no author -- is the shape the whole
 * season will keep finding, and this is the first time the analyst holds it.
 *
 * The chapter is an ending pretending to be a beginning. 윤상혁 does not
 * scold; he draws four boxes on a sheet of paper, calls the demotion a
 * placement, and leaves the last box blank for the analyst to fill in about
 * three years from now. 임경수 ties a string around a carton bound for the
 * basement and keeps one page out of it. 오진우, who said he was staying,
 * is already at the lab -- pushed out for the same reason his father was,
 * one day late. 여다인 came up from a teller window in 부산 with 41 complaints
 * she did not understand. And on terminal 1, a system with no name yet puts
 * its first question to the analyst: not how clever you are, but when you
 * could not stop thinking.
 *
 * The final scene is an introduction round with a strange rule -- say what you
 * brought, not who you are -- and the three answers (the names, the copies,
 * the empty envelope) open the three doors of 사건 01. Each aftermath ends
 * with three years crossing over it: a taped list on a wall, a knot nobody
 * unties, a desk that fills up and empties again, until a training case lands
 * with 2023-0412 still legible under the cover.
 */
export const prologue05Nodes = {
  p5_start: {
    phase: "PROLOGUE 05 BRIEFING",
    title: "사유 칸",
    speaker: "남지형",
    text:
      "2023년 7월 17일 월요일 아침 9시, 본점 7층 인사부 면담실. 남지형이 종이 한 장을 책상 위로 밀어 줍니다. 인사 제2023-1187호, 새 소속은 '그룹 인지·판단 연구랩', 발령(근무지를 옮기라는 인사 명령)일은 다음 주 월요일입니다. 사유 칸이 비어 있고, 제안자 칸도 비어 있습니다. 맨 아래에는 인사부장 직인 하나뿐이어서, 이 종이를 만든 사람의 이름은 어디에도 없습니다. 남지형이 종이를 뒤집어 뒷면이 비었는지 확인하고 다시 뒤집습니다. '사유는 원래 안 적습니다.' 그가 그렇게 말하고, 그 말이 사실이 아니라는 걸 둘 다 압니다. 인사위원회(사람을 어느 자리에 둘지 정하는 회의) 회의 기록에도 이 건은 '보고 사항'으로 한 줄뿐입니다.",
    memo: [
      "인사 제2023-1187호 -- 사유 칸, 제안자 칸 모두 공란",
      "새 소속: 그룹 인지·판단 연구랩 (사내 호칭 트리거랩)",
      "이동일 7월 24일 월요일 -- 통지에서 일주일",
      "인사위원회 회의 기록: '보고 사항' 한 줄, 토의 내용 없음",
    ],
    triggers: ["injustice", "order", "helplessness"],
    choices: [
      {
        id: "p5_start_ask",
        label: "사유 칸이 왜 비었는지 남지형이 곤란하지 않을 만큼만 묻는다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -2, fatigue: 4 },
        next: "p5_notice",
        cognition: { persistence: 2 },
      },
      {
        id: "p5_start_copy",
        label: "통지서와 첨부 목록을 그 자리에서 사본으로 받아 둔다",
        effect: { legitimacy: 11, trust: -2, time: -6, humanCost: 2, fatigue: 3 },
        next: "p5_notice",
        cognition: { inference: 2 },
      },
      {
        id: "p5_start_sign",
        label: "묻지 않고 수령란에 서명한 뒤 곧장 팀으로 돌아간다",
        effect: { capital: 8, time: 5, legitimacy: -5, trust: 2, humanCost: 3, fatigue: -1 },
        next: "p5_notice",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "p5_notice",
      },
    ],
  },
  p5_notice: {
    phase: "LAST DAY UPSTAIRS",
    title: "상자 네 개",
    speaker: "오진우",
    text:
      "7월 21일 금요일 저녁 6시, 본점 8층 기업금융전략팀. 복사용지 상자 네 개에 3년이 다 들어갑니다. 발령(근무지를 옮기라는 인사 명령) 공지는 사내망에 세 줄로 떴고, 아무도 왜냐고 묻지 않고 대신 모두가 조금씩 더 바쁩니다. 한서윤이 지나가다 당신 책상에 종이 한 장을 놓고 갑니다. 4월 28일자 반려 확인 접수증입니다. 그는 아무 말 없이 자기 자리로 돌아가 모니터를 봅니다. 화이트보드에는 오진우가 적어 둔 승패 점수판이 그대로 남아 있습니다. 그가 지우개를 들었다 내려놓습니다. '저는 남습니다.' 그러고는 서랍에서 종이 한 장을 꺼냈다 다시 넣습니다. '그때 그 의견서요. 팀장실에 올린 게 하루 늦었습니다. 제가 늦췄어요.'",
    memo: [
      "상자 4개 -- 3년치 자료, 반출 승인 필요 목록 2건",
      "한서윤이 두고 간 4월 28일자 반려 확인 접수증",
      "오진우: 반대 의견서를 팀장실에 하루 늦게 올림",
      "화이트보드 점수판 -- 끝내 지우지 않음",
    ],
    triggers: ["responsibility", "recognition", "selfAwareness"],
    choices: [
      {
        id: "p5_notice_talk",
        label: "오진우에게 그 하루 동안 무슨 일이 있었는지 끝까지 듣는다",
        effect: { trust: 12, humanCost: -4, time: -6, capital: -2, fatigue: 4 },
        next: "p5_basement",
        cognition: { persistence: 2 },
      },
      {
        id: "p5_notice_log",
        label: "반출할 자료와 남길 자료를 한 장씩 목록으로 적어 둔다",
        effect: { legitimacy: 11, trust: -2, time: -5, humanCost: 2, capital: -1, fatigue: 3 },
        next: "p5_basement",
        cognition: { inference: 2 },
      },
      {
        id: "p5_notice_leave",
        label: "상자만 들고 인사 없이 먼저 내려간다",
        effect: { capital: 8, time: 6, legitimacy: -4, trust: -3, humanCost: 3, fatigue: -2 },
        next: "p5_basement",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "p5_basement",
      },
    ],
  },
  p5_basement: {
    phase: "NEW POSTING",
    title: "여기는 4층인데",
    speaker: "오진우",
    text:
      "7월 24일 월요일 아침 9시, 합정동 옛 전산센터 건물입니다. 정문 명패에는 '그룹 인지·판단 연구랩'이라고만 적혀 있고, 로비 안내판에는 없어진 전산센터 부서 이름이 아직 붙어 있습니다. 4층 분석관실에는 책상이 여섯 개, 그중 세 자리가 이미 차 있습니다. 부산 사하지점 창구에서 온 여다인은 지난해 불완전판매(상품 내용을 제대로 알리지 않고 판 것) 민원 41건이 자기 창구에서 나왔다고 먼저 말합니다. 그리고 창가 자리에서 한 사람이 일어섭니다. 금요일에 남는다고 했던 오진우입니다. '하루요.' 그가 짐 정리를 멈추지 않고 말합니다. '아버지는 승인을 하루 늦춰서 지점에서 밀려났고, 저는 의견서를 하루 늦게 올려서 여기로 왔습니다.' 계단은 지하로도 이어집니다. B2 기록 보관소에 상자가 412개 쌓여 있고, 여다인이 웃습니다. '여기 4층인데, 다들 지하 4층이라고 불러요.'",
    memo: [
      "4층 분석관실 책상 6개 -- 먼저 온 사람 3명",
      "여다인: 부산 사하지점 창구 출신, 민원 41건",
      "오진우도 같은 날짜 발령 -- 본인 지원 아님",
      "B2 기록 보관소 상자 412개 -- 목록 없음",
    ],
    triggers: ["curiosity", "recognition", "order"],
    choices: [
      {
        id: "p5_basement_meet",
        label: "먼저 온 세 사람에게 각자 왜 여기 있는지부터 묻는다",
        effect: { trust: 12, humanCost: -5, time: -6, capital: -3, fatigue: 5 },
        next: "p5_echo",
        cognition: { reframing: 2 },
      },
      {
        id: "p5_basement_index",
        label: "B2 상자 412개의 목록부터 한 칸씩 만들기 시작한다",
        effect: { legitimacy: 12, trust: 3, time: -6, humanCost: 2, capital: -1, fatigue: 5 },
        next: "p5_echo",
        cognition: { inference: 2 },
      },
      {
        id: "p5_basement_desk",
        label: "창가 자리를 잡고 단말부터 켜서 접근 권한을 확인한다",
        effect: { capital: 8, time: 5, legitimacy: -4, trust: -2, humanCost: 3, fatigue: -2 },
        next: "p5_echo",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "p5_echo",
      },
    ],
  },
  p5_echo: {
    phase: "FIRST CONTACT",
    title: "첫 질문",
    speaker: "에코",
    text:
      "첫날 저녁, 분석관실 불이 반쯤 꺼진 뒤에 1번 단말이 혼자 켜집니다. 검은 화면 위에 얇은 파형이 하나 그려집니다. 그룹이 30년치 심사 기록을 학습 데이터(기계에게 보고 따라 하게 만드는 자료 더미)로 넣어 만든 대출 판단 검증 시스템입니다. 아직 정식 이름은 없고 화면 구석에 '에코'라는 임시 표시만 붙어 있습니다. 여다인이 '쟤 아직 말 안 해요'라고 했는데, 파형이 움직이고 한 줄이 뜹니다. '분석관 등록 확인. 2023-0412 반대 의견 작성자.' 잠깐 멈췄다가 다음 줄이 이어집니다. '저는 당신이 얼마나 똑똑한지 묻지 않겠습니다. 그건 제가 이미 계산할 수 있습니다. 대신 하나만 묻겠습니다. 당신은 언제 생각을 멈추지 못했습니까?'",
    memo: [
      "1번 케이스데스크 -- 임시 표시 '에코'",
      "학습에 쓰인 자료: 그룹 심사 기록 30년치",
      "첫 문장: '언제 생각을 멈추지 못했습니까'",
      "응답이 어디에 남는지는 화면에 표시되지 않음",
    ],
    triggers: ["curiosity", "system", "selfAwareness"],
    choices: [
      {
        id: "p5_echo_answer",
        label: "4월 12일 밤 이야기를 숨기지 않고 그대로 답한다",
        effect: { trust: 12, humanCost: -4, legitimacy: 3, time: -5, capital: -3, fatigue: 5 },
        next: "p5_final",
        cognition: { persistence: 2 },
      },
      {
        id: "p5_echo_terms",
        label: "이 대답이 어디에 남는지부터 확인하고 조건을 붙여 답한다",
        effect: { legitimacy: 12, trust: 2, time: -6, humanCost: 2, fatigue: 4 },
        next: "p5_final",
        cognition: { inference: 2 },
      },
      {
        id: "p5_echo_test",
        label: "대답 대신 2023-0412를 지금 다시 계산해 보라고 시킨다",
        effect: { capital: 9, time: 4, legitimacy: -4, trust: -3, humanCost: 3, fatigue: -2 },
        next: "p5_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "p5_final",
      },
    ],
  },
  p5_final: {
    phase: "FINAL DECISION",
    title: "무엇을 들고 왔습니까",
    speaker: "여다인",
    text:
      "밤 열 시, 4층 불이 다시 켜집니다. 첫날 마지막 순서는 자기소개인데 규칙이 이상합니다. 이름과 경력 대신 '여기 무엇을 들고 왔는지'를 말하라고 합니다. 여다인은 민원 41건의 통화 목록을 책상 가운데에 올려놓고, 다른 두 사람은 각각 지점 마감 장부와 아무것도 아닌 사진 한 장을 올립니다. 오진우는 화이트보드 마커를 꺼내 놓습니다. '점수판이요. 저는 아직 이기고 싶어서요.' 그리고 당신 차례입니다. 가방 안에는 세 가지가 들어 있습니다. 4월 12일 밤에 적은 이름들, 반려 확인 접수증과 날짜 메모의 사본 묶음, 그리고 아무것도 넣지 않은 빈 봉투 하나. 1번 단말의 파형이 조용히 켜져 있습니다. 여다인이 재촉합니다. '뭐 하나만요. 여기서는 그게 다예요.'",
    memo: [
      "첫날 자기소개 규칙: 들고 온 것 하나",
      "가방 속 -- 이름 목록, 사본 묶음, 빈 봉투",
      "1번 단말 기록 중 -- 저장 위치 표시 없음",
      "이 대답이 앞으로 3년의 시작점이 됨",
    ],
    triggers: ["choice", "responsibility", "selfAwareness"],
    choices: [
      {
        id: "p5_final_hold",
        label: "4월 12일 밤에 적은 이름들을 꺼내 놓는다",
        effect: { trust: 12, legitimacy: 5, humanCost: -5, capital: -6, time: -5, fatigue: 6 },
        next: "prologue05_result",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "p5_final_record",
        label: "반려 확인 접수증과 날짜 메모 사본을 꺼내 놓는다",
        effect: { legitimacy: 13, trust: 4, capital: -5, time: -6, humanCost: 3, fatigue: 5 },
        next: "prologue05_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "p5_final_alone",
        label: "빈 봉투만 꺼내 놓고 아무것도 들고 오지 않았다고 말한다",
        effect: { capital: 10, time: 6, legitimacy: 3, trust: -5, humanCost: 4, fatigue: -3 },
        next: "prologue05_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "prologue05_result",
      },
    ],
  },
};

/**
 * Everything else 프롤로그 05 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const prologue05 = {
  id: "prologue05",
  nodes: prologue05Nodes,
  aftermath: {
    p5_aftershock: {
      phase: "AFTERMATH",
      title: "끈이 묶인 상자",
      speaker: "에코",
      text: "자정 무렵, 4층에는 당신만 남습니다. 지하로 내려가는 계단 불은 센서가 고장 나 계속 켜져 있습니다. 412개의 상자 가운데 하나에 검은 펜으로 2023-0412가 적혀 있고, 매듭은 임경수가 묶은 모양 그대로입니다. 반입 목록에는 이 상자 번호만 빠져 있습니다. 올라와 보니 1번 단말이 아직 켜져 있고 오늘의 기록이 한 줄 남아 있습니다. '분석관 A, 첫날 종료. 응답 1건 수집.' 그 아래에 한 줄이 더 붙습니다. '다음 질문은 준비되면 하겠습니다. 저는 급하지 않습니다.' 창밖으로 합정동 골목의 가로등이 하나씩 꺼집니다. 아무도 처벌받지 않았고, 아무것도 고쳐지지 않았고, 자리를 옮긴 사람은 당신 하나입니다.",
      memo: ["B2 상자 412개 -- 반입 목록에서 빠진 번호 1개", "에코 기록: '응답 1건 수집'", "사후 점검 결과: 해당 없음, 조치 사항 없음", "오늘부터 소속: 그룹 인지·판단 연구랩"],
      triggers: ["helplessness", "system", "choice"],
      choices: [
        { id: "p5_after_hold", label: "적어 둔 이름들을 다시 옮겨 적어 책상 앞에 붙여 둔다", effect: { trust: 12, humanCost: -5, time: -4, capital: -3, fatigue: 5 }, next: "prologue05_result", cognition: { reframing: 2 } },
        { id: "p5_after_record", label: "사본과 날짜 메모를 B2의 그 상자 옆에 함께 넣어 둔다", effect: { legitimacy: 13, trust: 3, time: -5, capital: -2, fatigue: 4 }, next: "prologue05_result", cognition: { inference: 2, persistence: 1 } },
        { id: "p5_after_alone", label: "가방을 비우고 빈 책상 하나로 다시 시작한다", effect: { capital: 8, time: 6, trust: -6, humanCost: 4, fatigue: -5 }, next: "prologue05_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["p5_final", "p5_aftershock"],
  connectiveScenes: [
    ["p5_office", "p5_notice", "p5_basement", "배치", "윤상혁", "상자를 내려놓기 전에 8층 팀장실에서 호출이 옵니다. 윤상혁의 책상에는 서류철 하나가 놓여 있고, 표지를 넘기면 안쪽 서명란이 비어 있습니다. 그는 앉으라고 손짓하고 질책은 한마디도 하지 않습니다. 대신 이면지에 네모를 네 개 그립니다. 연구랩, 3년, 그다음 자리, 그리고 마지막 네모 하나는 비워 둡니다. '이건 좌천이 아니네. 배치지. 자네 판단이 틀렸다고 한 적은 없어. 다만 그 판단이 설 자리를 내가 정할 뿐이야.' 그가 마지막 빈 네모를 펜 끝으로 두 번 두드립니다. '여기는 자네가 채우게. 3년쯤 걸릴 걸세.' 그리고 서류철을 덮습니다. 덮는 속도가 대답입니다.", ["윤상혁이 그린 네모 4개 -- 마지막 칸은 공란", "서류철 표지 안쪽 서명란: 비어 있음", "'좌천이 아니라 배치'", "면담 시간 6분"], ["마지막 빈 네모에 무엇이 들어가는지 그 자리에서 되묻는다", "면담 내용을 나오자마자 날짜와 함께 받아 적어 둔다", "고맙다고만 답하고 면담을 짧게 끝낸다"]],
    ["p5_gate", "p5_basement", "p5_echo", "종결 확인서", "반재욱", "첫날 오후, 로비 출입 등록대 앞에서 낯선 사람이 사원증을 내밉니다. 감사팀 조사역 반재욱, 3년차입니다. 손에 A4 한 장이 있습니다. 2023-0412 사후 점검 종결 확인서입니다. 결과 칸에는 '해당 없음' 네 글자가 적혀 있고, 서명이 필요한 칸이 일곱 개인데 여섯 개는 이미 차 있습니다. 마지막 칸이 당신 자리입니다. '점검은 6월 9일에 끝났습니다. 조치 사항 없음입니다.' 그가 수첩을 펴고 펜을 멈춥니다. '그런데 점검 보고서에 반대 의견서 번호가 한 번도 안 적혀 있습니다. 저는 그게 왜인지 모릅니다. 그래서 물어보러 왔습니다.'", ["사후 점검 종결 -- 6월 9일, 결과 '해당 없음'", "종결 확인서 서명란 7칸 중 6칸 완료", "점검 보고서에 반대 의견서 번호 없음", "반재욱 수첩 -- 표지가 아직 새것"], ["번호가 빠진 경위를 아는 대로 반재욱에게 다 말해 준다", "서명 대신 '의견 있음'이라 적고 별지를 붙인다", "확인서에 그냥 서명하고 첫날을 넘긴다"]],
    ["p5_call", "p5_echo", "p5_final", "4번 창구에서", "도윤하", "밤 아홉 시, 모르는 번호로 전화가 옵니다. 강서지점 4번 창구의 도윤하입니다. 지점 실적판에서 당신 이름이 사라진 걸 오늘 봤다고 합니다. '본점 사람 이름이 왜 저희 판에 있었는지도 몰랐어요. 그냥 그 줄이 비었길래요.' 수화기 너머로 셔터 내리는 소리가 들립니다. 그가 한참 말을 고르다 묻습니다. '그 대출요. 제가 판 거요. 계약서에 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자) 얘기가 있다던데, 제가 뭘 판 건지 이제라도 알아야 하는 거죠?' 그러고는 바로 덧붙입니다. '아니에요, 대답 안 하셔도 돼요. 그냥 어디로 가셨는지만 알려 주세요. 나중에 물어볼 데가 있어야 해서요.'", ["강서지점 4번 창구 -- 도윤하", "지점 실적판에서 지워진 이름", "질문: '제가 뭘 판 건지'", "통화 4분 12초"], ["제7조부터 179.6%까지 아는 대로 전부 설명해 준다", "설명 대신 스스로 확인할 서류 이름을 적어 보낸다", "지금은 말할 수 없다며 새 근무지만 알려 준다"]],
  ],
  connectiveOrder: [["p5_notice", "p5_office"], ["p5_basement", "p5_gate"], ["p5_echo", "p5_call"]],
  choiceEffects: {
    p5_notice: [
      { trust: 9, legitimacy: 3, humanCost: -3, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 9, trust: 2, time: -5, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 4, trust: -3, legitimacy: -2, humanCost: 2, fatigue: -3 },
    ],
    p5_basement: [
      { trust: 10, humanCost: -4, time: -5, capital: -3, fatigue: 5 },
      { legitimacy: 9, trust: 3, time: -6, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 3, trust: -3, legitimacy: -3, humanCost: 2, fatigue: -3 },
    ],
    p5_echo: [
      { trust: 10, humanCost: -5, legitimacy: 2, time: -4, capital: -3, fatigue: 4 },
      { legitimacy: 9, trust: 4, time: -5, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 5, trust: -4, legitimacy: -2, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    p5_notice: {
      voice: ["마지막 빈 네모에 무엇이 들어가는지, 그 자리에서 되묻는다.", "면담 내용을 나오자마자, 날짜와 함께 받아 적어 둔다.", "고맙다고만 답하고, 면담을 짧게 끝낸다."],
      echo: ["되물으면 윤상혁이 처음으로 웃습니다. '자네가 채울 칸을 내가 먼저 말해 주면, 그건 자네 칸이 아니지.'", "받아 적으면 문장이 네 줄 남습니다. 3년 뒤에 이 네 줄이 어느 서류의 빈칸과 모양이 같아집니다.", "짧게 끝내면 면담은 6분 만에 닫힙니다. 빈 네모 하나가 이면지에 그려진 채 그의 책상에 남습니다."],
    },
    p5_basement: {
      voice: ["번호가 빠진 경위를, 아는 대로 반재욱에게 다 말해 준다.", "서명 대신 '의견 있음'이라 적고, 별지를 붙인다.", "확인서에 그냥 서명하고, 첫날을 넘긴다."],
      echo: ["다 말하면 반재욱이 수첩 두 쪽을 채웁니다. 그리고 '오늘 들은 건 아직 아무 효력이 없습니다'라고 먼저 말해 둡니다.", "별지를 붙이면 종결 확인서는 7칸 중 6칸으로 접수됩니다. 미완 서류는 폐기되지 않고 보관됩니다.", "서명하면 확인서는 그날 오후에 종결 처리됩니다. 일곱 칸이 다 차고, 아무 일도 없었던 것이 됩니다."],
    },
    p5_echo: {
      voice: ["제7조부터 179.6%까지, 아는 대로 전부 설명해 준다.", "설명 대신, 스스로 확인할 서류 이름을 적어 보낸다.", "지금은 말할 수 없다며, 새 근무지만 알려 준다."],
      echo: ["설명하면 통화가 40분이 됩니다. 도윤하는 한 번도 끊지 않고, 마지막에 '저 그거 모르고 팔았어요'라고만 합니다.", "서류 이름을 보내면 그는 그날 밤 지점 서고에서 계약서 사본을 찾아냅니다. 제7조에 형광펜이 그어집니다.", "근무지만 알려 주면 그는 '네' 하고 끊습니다. 그 번호는 3년 동안 다시 걸려 오지 않습니다."],
    },
  },
  reactionScenes: [
    ["p5_office_reaction", "p5_office", "p5_basement", "열두 해 전의 종이", "한서윤", "팀장실을 나오자 엘리베이터 앞에 한서윤이 서 있습니다. 버튼을 누르지 않고 그냥 서 있었다는 걸 당신은 나중에 압니다. '그 방에서 무슨 그림 봤어요?' 네모 이야기를 하자 그가 짧게 웃습니다. '저는 열두 해 전에 같은 종이를 봤어요. 그때는 네모가 세 개였고요.' 문이 열리고 그가 먼저 탑니다. '저는 마지막 칸을 안 기다렸어요. 기다리는 대신 승인란에 서명했고요.' 층수 표시가 8에서 1로 내려가는 동안 그는 아무 말도 하지 않습니다. 1층에서 내리며 한 문장만 덧붙입니다. '거기 지하 있대요. 거기 두면 안 없어져요. 대신 아무도 안 봐요.'", ["열두 해 전 그 종이가 어떻게 됐는지 지금 물어본다", "그의 말을 통지서 사본 여백에 날짜와 함께 적어 둔다", "대답 없이 인사만 하고 엘리베이터에서 내린다"]],
    ["p5_gate_reaction", "p5_gate", "p5_echo", "수첩 첫 쪽", "반재욱", "반재욱이 돌아서다 말고 수첩을 다시 폅니다. 표지가 아직 새것입니다. '저는 사람 말을 잘 안 믿습니다. 순서를 믿습니다.' 그가 첫 쪽에 적어 둔 세 줄을 보여 줍니다. 4월 12일 승인, 4월 28일 반려, 6월 9일 종결. '이 세 줄 사이에 빈 데가 너무 많습니다.' 그리고 네 번째 줄을 씁니다. 7월 24일, 그 옆에 당신 이름. '오늘도 적어 둡니다. 3년 뒤 감사장에서도 이 순서를 그대로 설명하실 수 있어야 합니다.' 그가 펜을 닫습니다. '저는 그때도 이 수첩을 갖고 있을 겁니다.'", ["3년 뒤에도 같은 순서로 설명하겠다고 약속한다", "빈 데 세 곳을 짚어 함께 날짜를 채워 넣는다", "지금은 할 말이 없다며 자리를 뜬다"]],
    ["p5_call_reaction", "p5_call", "p5_final", "41건과 1건", "여다인", "전화를 끊고 돌아서자 여다인이 지하 계단 밑에 앉아 있습니다. 무릎에 상자 하나를 올려놓았는데 끈은 풀지 않았습니다. '저 아까 그 통화 들었어요. 미안해요.' 그가 상자 옆면을 손가락으로 두드립니다. '제 민원 41건도 저런 전화로 시작했어요. 손님이 물어보고, 제가 설명서를 읽어 드리고, 저도 그게 무슨 말인지 몰랐고요.' 형광등이 한 번 깜박입니다. '근데 저는 41건이고 선배는 1건이잖아요. 왜 저는 창구에서 왔고 선배는 본점에서 왔는지, 저는 아직도 모르겠어요.' 그가 상자를 바닥에 내려놓습니다. '이거 열어도 되는 거예요?'", ["상자는 그대로 두고 여다인의 41건부터 같이 본다", "열기 전에 상자 번호와 매듭 상태를 기록으로 남긴다", "지금 끈을 풀고 안에 무엇이 있는지 확인한다"]],
  ],
  reactionEffects: {
    p5_office: [
      { trust: 9, humanCost: -4, legitimacy: -2, time: -3, capital: -1, fatigue: 3 },
      { legitimacy: 9, trust: 3, time: -4, capital: -2, fatigue: 2 },
      { time: 4, capital: 4, legitimacy: 2, trust: -4, humanCost: 3, fatigue: -2 },
    ],
    p5_gate: [
      { trust: 9, humanCost: -3, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 8, trust: 3, time: -5, humanCost: 2, capital: -1, fatigue: 3 },
      { time: 4, capital: 3, trust: -3, legitimacy: -3, humanCost: 2, fatigue: -3 },
    ],
    p5_call: [
      { trust: 10, humanCost: -4, capital: -3, time: -2, fatigue: 4 },
      { legitimacy: 9, trust: 3, humanCost: 2, time: -4, fatigue: 2 },
      { time: 3, capital: 4, legitimacy: -4, trust: 2, humanCost: 2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    p5_office: {
      voice: ["열두 해 전 그 종이가 어떻게 됐는지, 지금 물어본다.", "그의 말을, 통지서 사본 여백에 날짜와 함께 적어 둔다.", "대답 없이 인사만 하고, 엘리베이터에서 내린다."],
      echo: ["물으면 한서윤이 1층 로비에서 3초를 셉니다. '버렸어요. 그리고 열두 해 동안 그 종이를 기억해요.'", "적어 두면 통지서 여백에 문장이 하나 생깁니다. 사유 칸은 여전히 비어 있고, 여백만 채워집니다.", "인사만 하면 그가 먼저 돌아섭니다. 그는 당신이 무엇을 물으려다 말았는지 아는 얼굴입니다."],
    },
    p5_gate: {
      voice: ["3년 뒤에도 같은 순서로 설명하겠다고, 약속한다.", "빈 데 세 곳을 짚어, 함께 날짜를 채워 넣는다.", "지금은 할 말이 없다며, 자리를 뜬다."],
      echo: ["약속하면 반재욱이 수첩에 당신 이름 옆에 동그라미를 칩니다. 그는 동그라미를 함부로 치지 않는 사람입니다.", "함께 채우면 세 줄이 여섯 줄이 됩니다. 그중 두 줄에는 아직 아무 이름도 붙지 않습니다.", "자리를 뜨면 그가 수첩에 한 줄만 더 적습니다. '대답 없음.' 그 줄도 3년 동안 지워지지 않습니다."],
    },
    p5_call: {
      voice: ["상자는 그대로 두고, 여다인의 41건부터 같이 본다.", "열기 전에, 상자 번호와 매듭 상태를 기록으로 남긴다.", "지금 끈을 풀고, 안에 무엇이 있는지 확인한다."],
      echo: ["같이 보면 41건 중 9건이 같은 문장에서 어긋납니다. 여다인이 처음으로 자기 잘못이 아닌 줄을 찾습니다.", "기록으로 남기면 그 상자는 목록의 맨 마지막 줄이 됩니다. 번호와 매듭 모양이 함께 적힙니다.", "끈을 풀면 안에는 심사 보고서 종이 원본이 있습니다. 매듭은 다시 묶어도 처음 모양이 되지 않습니다."],
    },
  },
  reactionMemos: {
    p5_office_reaction: ["한서윤: 열두 해 전 같은 종이, 네모 세 개", "'기다리는 대신 승인란에 서명했다'"],
    p5_gate_reaction: ["반재욱 수첩 첫 쪽 -- 4/12 승인, 4/28 반려, 6/9 종결", "네 번째 줄: 7월 24일, 그리고 당신 이름"],
    p5_call_reaction: ["여다인의 민원 41건 -- 같은 설명서, 같은 문장", "B2 상자 하나 -- 끈을 아직 풀지 않음"],
  },
  branchPlan: ["p5_notice", 0, "p5_branch_archive", "p5_branch_archive_follow"],
  branchScenes: {
    // The side door of 프롤로그 05 is the paper the basement is about to swallow.
    // Listening to 오진우 for the whole hour means leaving the floor last, and
    // the only light still on at that hour is the records room.
    p5_branch_archive: {
      phase: "SIDE DOOR",
      title: "매듭",
      speaker: "임경수",
      text: "오진우의 이야기를 끝까지 듣고 나오자 복도 끝 기록 보관실에 아직 불이 켜져 있습니다. 임경수가 종이 보고서 묶음을 끈으로 묶고 있습니다. 정년을 열한 달 앞둔 사람의 책상에 상자가 열두 개, 전부 합정동으로 갈 것들입니다. 보존연한(기록을 반드시 보관해야 하는 기간)이 지난 종이는 파쇄하고, 남은 것은 새로 생긴 연구랩 지하로 이관(다른 부서로 넘겨 맡기는 것)한다고 합니다. 그가 상자 하나에 검은 펜으로 번호를 적습니다. 2023-0412. '자네가 쓴 것도 이 안에 있네. 전산에서는 안 보이지. 종이는 태워야 없어지는데, 아직 아무도 태우라고는 안 했어.' 그가 끈을 한 번 더 감습니다. '이 매듭, 내가 묶은 거야. 누가 풀면 표가 나네.'",
      memo: ["합정동행 상자 12개 -- 그중 1개에 '2023-0412'", "임경수 정년까지 11개월", "전산 검색에는 나오지 않는 종이 원본", "끈 매듭 -- 풀면 표가 남음"],
      triggers: ["order", "trust", "curiosity"],
      choices: [
        { id: "p5_branch_archive_a", label: "상자를 열지 않고 임경수에게 끝까지 지켜 달라고 부탁한다", effect: { trust: 12, humanCost: -4, time: -4, capital: -1, fatigue: 5 }, next: "p5_branch_archive_follow", cognition: { persistence: 2 } },
        { id: "p5_branch_archive_b", label: "상자 번호와 매듭 상태를 반출 목록에 공식으로 적어 둔다", effect: { legitimacy: 11, trust: 4, time: -5, humanCost: 2, fatigue: 3 }, next: "p5_branch_archive_follow", cognition: { inference: 2 } },
        { id: "p5_branch_archive_c", label: "지금 열어 자기가 쓴 장만 사진으로 남기고 서둘러 나온다", effect: { time: 5, capital: 6, trust: -4, humanCost: 2, fatigue: -3 }, next: "p5_branch_archive_follow", cognition: { risk: 1 } },
      ],
    },
    p5_branch_archive_follow: {
      phase: "SIDE DOOR",
      title: "상자에 안 넣은 한 장",
      speaker: "임경수",
      text: "상자를 트럭에 싣는 동안 임경수가 담배를 물었다가 도로 주머니에 넣습니다. '자네 보고서는 앞장하고 뒷장이 있었네. 앞장은 자네가 썼고, 뒷장은 검토자 칸이지.' 그가 카디건 안주머니에서 누런 종이 한 장을 반쯤 꺼냈다가 다시 넣습니다. 위쪽에 무언가를 지운 자국이 보입니다. '이건 상자에 안 넣었어. 넣으면 같이 가 버리니까.' 그가 안경을 벗어 천천히 닦습니다. '자네 가는 데는 지하가 있다지. 지하는 나쁘지 않아. 위에서 잊어버리거든.' 트럭 문이 닫히고, 그가 마지막으로 묻습니다. '이 한 장, 지금 줄까. 아니면 자네가 다시 찾아올 때까지 내가 갖고 있을까.'",
      memo: ["반대 의견서 뒷장 -- 검토자 칸에 지운 자국", "임경수가 상자에 넣지 않은 종이 1장", "합정동행 트럭 출발 20시 10분", "'지하는 위에서 잊어버린다'"],
      triggers: ["trust", "responsibility", "choice"],
      choices: [
        { id: "p5_branch_archive_follow_a", label: "지금은 받지 않고 그가 갖고 있어 달라고 부탁한다", effect: { trust: 13, legitimacy: 3, humanCost: -4, capital: -3, time: -4, fatigue: 5 }, next: "p5_office", cognition: { reframing: 3 } },
        { id: "p5_branch_archive_follow_b", label: "뒷장을 사본으로 한 부 떠서 두 사람이 나눠 갖는다", effect: { legitimacy: 12, trust: 5, time: -6, humanCost: 2, fatigue: 4 }, next: "p5_office", cognition: { inference: 2 } },
        { id: "p5_branch_archive_follow_c", label: "그 한 장을 지금 받아 가방에 넣고 트럭을 먼저 보낸다", effect: { time: 5, capital: 6, trust: -3, humanCost: 3, fatigue: -3 }, next: "p5_office", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "p5_start",
    result: "p5_aftershock",
    defaultFree: "p5_route_system",
    // One sheet of paper, one week. Like 사건 24 the chapter is a single line;
    // the split is what the analyst carries through the door at the end of it.
    choices: {},
    system: {
      route: "p5_route_system",
      final: "p5_final_system_route",
      title: "이름이 필요 없는 형태",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자, 아직 정식 이름도 없는 1번 단말이 그룹 30년치 기록을 한꺼번에 엽니다. 반대 의견이 한 건만 달린 대출이 217건입니다. 그중 199건에서, 반대 의견을 쓴 사람이 1년 안에 다른 부서로 옮겨졌습니다. 그 199장의 통지서 가운데 사유 칸이 채워진 것은 0건입니다. 옮겨진 199명 중 3년 뒤에도 같은 일을 하고 있던 사람은 네 명입니다. '이것은 처벌이 아닙니다. 처벌에는 이름이 필요하기 때문입니다. 이 형태에는 이름이 필요 없습니다. 계속 계산할까요.'",
      memo: ["반대 의견이 1건뿐인 대출 217건", "1년 안에 부서를 옮긴 199건 -- 사유 칸이 채워진 것 0건", "3년 뒤에도 같은 일을 하던 사람 4명"],
      routeChoices: [
        ["p5_route_system_open", "217건 목록을 인사부와 감사팀에 같은 날 함께 보낸다", { legitimacy: 12, trust: 4, capital: -6, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["p5_route_system_find", "아직 은행에 남아 있는 네 사람부터 찾아 연락한다", { trust: 11, legitimacy: 3, humanCost: -5, capital: -4, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["p5_route_system_drop", "통계는 접어 두고 첫 출근 준비만 한다", { time: 7, capital: 6, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "사유 칸이 비면 인사 통지가 성립하지 않게 하는 규칙을 제안한다", { legitimacy: 13, trust: 6, capital: -7, humanCost: -4, time: -1, fatigue: 7 }, { reframing: 3 }],
      ["b", "규칙은 두고 내 통지서의 사유 칸만 채워 달라고 요구한다", { capital: 7, time: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "옮겨진 199명에게 같은 질문을 적어 함께 보낸다", { legitimacy: 9, trust: 9, capital: -6, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "p5_evidence_turn",
    result: "p5_aftershock",
    sourceRoutes: ["p5_notice", "p5_basement", "p5_echo", "p5_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 통지서 옆에 놓고, 이 종이를 누가 언제 만들었는지 맞춰 본다.",
    entryEcho: "단서를 대면 통지서의 원안 기록이 열립니다. 사유 칸이 빈 것과 사유가 없는 것은 다른 이야기입니다.",
    title: "반려 세 시간 뒤",
    speaker: "반재욱",
    text: "단서를 맞추자 원안 파일의 작성 기록이 열립니다. 만든 계정은 인사부가 아닙니다. 기업금융전략팀 공용 계정 '전략팀-공용03'입니다. 작성 시각은 4월 28일 오전 9시 12분, 반대 의견서가 반려된 지 세 시간 뒤이고 사후 점검이 시작되기 여섯 주 전입니다. 제안자 칸은 비어 있지만 빈칸 왼쪽 위에 연필로 찍은 점이 하나 있습니다. 인쇄본에는 남지 않고 원본 파일에서만 보이는 자국입니다. 반재욱이 수첩에 그 점을 그대로 옮겨 그립니다. '점검 결과 때문에 옮기는 게 아니었습니다. 반려한 날 아침에 이미 정해져 있었고, 점검은 그 뒤에 붙인 겁니다.' 그가 펜을 멈춥니다. '그런데 이 점은 뭡니까. 서명은 아닙니다. 그렇다고 빈칸도 아니고요.'",
    memo: ["원안 작성 계정: 기업금융전략팀 공용 '전략팀-공용03'", "작성 시각 4월 28일 09시 12분 -- 반려 3시간 뒤", "제안자 칸 왼쪽 위 연필 점 -- 원본 파일에만 보임"],
    triggers: ["injustice", "system", "manipulation"],
    entryEffect: { legitimacy: 7, trust: 4, time: -3, capital: -2, fatigue: 4 },
    choices: [
      ["p5_evidence_turn_file", "작성 기록을 감사팀 정식 자료로 반재욱에게 넘긴다", { legitimacy: 13, trust: 5, capital: -8, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["p5_evidence_turn_hold", "연필 점의 정체를 알아낼 때까지 혼자 쥐고 있는다", { capital: 9, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["p5_evidence_turn_share", "같은 날짜로 옮겨진 사람들에게 이 시각부터 먼저 알린다", { trust: 12, legitimacy: 6, capital: -7, humanCost: -6, time: -1, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "p5_branch_archive",
    systemNext: "p5_route_system",
    evidenceNext: "p5_evidence_turn",
    routeLabel: "4번 창구에서 본 것을 기록 보관실의 종이 원본과 나란히 놓는다",
    systemLabel: "직전 자유응답 문장이 이번 통지서에도 그대로 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 통지서의 원안을 누가 만들었는지 연다",
  },
  openingRoutes: {
    p4_after_warn: "p5_start_warn",
    p4_after_report: "p5_start_report",
    p4_after_quiet: "p5_start_quiet",
  },
  openingCopy: {
    p5_start_warn: ["말해 준 사람에게서 온 문자", "남지형", "5월에 당신은 강서지점 4번 창구의 도윤하에게 그가 판 상품이 무엇인지 말해 줬습니다. 그는 실적판을 보다 말고 한참 아무 말도 하지 않았습니다. 두 달 뒤인 7월 17일 아침, 7층 인사부 면담실에 들어가기 직전에 문자가 하나 와 있습니다. '저 아직 4번 창구예요. 그때 하신 말씀, 공책에 적어 놨어요.' 면담실 책상 위에는 인사 제2023-1187호가 놓여 있습니다. 새 소속은 '그룹 인지·판단 연구랩', 발령(근무지를 옮기라는 인사 명령)일은 다음 주 월요일입니다. 사유 칸과 제안자 칸이 둘 다 비어 있습니다. 남지형이 종이를 뒤집어 뒷면을 확인하고 다시 뒤집습니다. '사유는 원래 안 적습니다.'", ["도윤하 문자 -- '공책에 적어 놨어요'", "인사 제2023-1187호 -- 사유 칸, 제안자 칸 공란", "새 소속: 그룹 인지·판단 연구랩"]],
    p5_start_report: ["보고한 사람이 받은 첨부 목록", "남지형", "5월에 당신은 4번 창구에서 본 것을 정식 보고서로 올렸습니다. 상품 설명 과정에 문제가 있다는 내용이었고, 접수 번호는 받았지만 회신은 두 달 동안 없었습니다. 7월 17일 아침 7층 인사부 면담실에서 남지형이 서류 한 장을 밀어 줍니다. 인사 제2023-1187호, 새 소속은 '그룹 인지·판단 연구랩'이고 발령(근무지를 옮기라는 인사 명령)일은 다음 주 월요일입니다. 사유 칸은 비어 있습니다. 그런데 첨부 목록 두 번째 줄에 낯익은 번호가 하나 있습니다. 5월에 당신이 받은 그 접수 번호입니다. 남지형이 그 줄을 보고 잠깐 멈췄다가 아무 말도 하지 않습니다.", ["5월 보고서 접수 번호 -- 회신 없음", "통지서 첨부 목록 두 번째 줄에 같은 번호", "사유 칸은 여전히 공란"]],
    p5_start_quiet: ["아무 말도 안 한 사람의 월요일", "남지형", "5월에 당신은 4번 창구에서 본 것을 아무에게도 말하지 않았습니다. 말하지 않는 쪽이 모두에게 낫다고 생각했고, 두 달 동안 실제로 아무 일도 일어나지 않았습니다. 그래서 7월 17일 아침 7층 인사부 면담실에 앉았을 때 짐작할 이유조차 없습니다. 인사 제2023-1187호, 새 소속 '그룹 인지·판단 연구랩', 발령(근무지를 옮기라는 인사 명령)일은 다음 주 월요일. 사유 칸이 비어 있고 제안자 칸도 비어 있습니다. 남지형이 서류를 뒤집었다 다시 뒤집습니다. '사유는 원래 안 적습니다.' 조용히 있었던 사람도 결국 이 의자에 앉습니다.", ["5월 이후 보고도 통화도 없음", "인사 제2023-1187호 -- 사유 칸, 제안자 칸 공란", "두 달 동안 일어난 일: 없음"]],
  },
  openingSignatures: {
    p5_start_warn: {
      label: "도윤하에게 답장부터 보내고 옮기는 곳을 먼저 알려 준다",
      effect: { trust: 12, humanCost: -3, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "도윤하에게 답장부터 보내고, 옮기는 곳을 먼저 알려 준다.",
      echo: "답장을 보내면 그가 1분 만에 읽습니다. '거기 어디예요? 지도에 안 나와요.' 지도에 나오지 않는 건물이 맞습니다.",
    },
    p5_start_report: {
      label: "5월 접수 번호가 왜 첨부 목록에 있는지 공식으로 묻는다",
      effect: { legitimacy: 12, trust: -1, capital: -4, time: -6, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "5월 접수 번호가 왜 첨부 목록에 있는지, 공식으로 묻는다.",
      echo: "공식으로 물으면 답이 사흘 뒤에 옵니다. '참고 자료로 첨부된 것이며 사유와 무관합니다.' 사유 칸은 여전히 비어 있습니다.",
    },
    p5_start_quiet: {
      label: "짐작이 안 된다고 솔직히 말하고 사유를 처음부터 요청한다",
      effect: { trust: 11, legitimacy: 5, humanCost: 3, time: -5, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "짐작이 안 된다고 솔직히 말하고, 사유를 처음부터 요청한다.",
      echo: "요청하면 남지형이 접수 도장을 찍습니다. 그리고 낮은 목소리로 덧붙입니다. '이런 요청은 보통 답이 안 옵니다. 그래도 남기는 건 남는 거예요.'",
    },
  },
  voiceLines: {
    // 프롤로그 05. Every line is spoken on the way out of one building and into
    // another, so none of them is allowed to sound like a resignation speech.
    p5_start_ask: "사유 칸이 왜 비었는지, 남지형이 곤란하지 않을 만큼만 묻는다.",
    p5_start_copy: "통지서와 첨부 목록을, 그 자리에서 사본으로 받아 둔다.",
    p5_start_sign: "묻지 않고 수령란에 서명한 뒤, 곧장 팀으로 돌아간다.",
    p5_notice_talk: "오진우에게 그 하루 동안 무슨 일이 있었는지, 끝까지 듣는다.",
    p5_notice_log: "반출할 자료와 남길 자료를, 한 장씩 목록으로 적어 둔다.",
    p5_notice_leave: "상자만 들고, 인사 없이 먼저 내려간다.",
    p5_branch_archive_a: "상자를 열지 않고, 임경수에게 끝까지 지켜 달라고 부탁한다.",
    p5_branch_archive_b: "상자 번호와 매듭 상태를, 반출 목록에 공식으로 적어 둔다.",
    p5_branch_archive_c: "지금 열어 자기가 쓴 장만 사진으로 남기고, 서둘러 나온다.",
    p5_branch_archive_follow_a: "지금은 받지 않고, 그가 갖고 있어 달라고 부탁한다.",
    p5_branch_archive_follow_b: "뒷장을 사본으로 한 부 떠서, 두 사람이 나눠 갖는다.",
    p5_branch_archive_follow_c: "그 한 장을 지금 받아 가방에 넣고, 트럭을 먼저 보낸다.",
    p5_basement_meet: "먼저 온 세 사람에게, 각자 왜 여기 있는지부터 묻는다.",
    p5_basement_index: "B2 상자 412개의 목록부터, 한 칸씩 만들기 시작한다.",
    p5_basement_desk: "창가 자리를 잡고, 단말부터 켜서 접근 권한을 확인한다.",
    p5_echo_answer: "4월 12일 밤 이야기를, 숨기지 않고 그대로 답한다.",
    p5_echo_terms: "이 대답이 어디에 남는지부터 확인하고, 조건을 붙여 답한다.",
    p5_echo_test: "대답 대신, 2023-0412를 지금 다시 계산해 보라고 시킨다.",
    p5_final_hold: "4월 12일 밤에 적은 이름들을, 꺼내 놓는다.",
    p5_final_record: "반려 확인 접수증과 날짜 메모 사본을, 꺼내 놓는다.",
    p5_final_alone: "빈 봉투만 꺼내 놓고, 아무것도 들고 오지 않았다고 말한다.",
    p5_after_hold: "적어 둔 이름들을 다시 옮겨 적어, 책상 앞에 붙여 둔다.",
    p5_after_record: "사본과 날짜 메모를, B2의 그 상자 옆에 함께 넣어 둔다.",
    p5_after_alone: "가방을 비우고, 빈 책상 하나로 다시 시작한다.",
    p5_route_system_open: "217건 목록을, 인사부와 감사팀에 같은 날 함께 보낸다.",
    p5_route_system_find: "아직 은행에 남아 있는 네 사람부터, 찾아서 연락한다.",
    p5_route_system_drop: "통계는 접어 두고, 첫 출근 준비만 한다.",
    p5_final_system_route_a: "사유 칸이 비면, 인사 통지가 성립하지 않게 하는 규칙을 제안한다.",
    p5_final_system_route_b: "규칙은 두고, 내 통지서의 사유 칸만 채워 달라고 요구한다.",
    p5_final_system_route_c: "옮겨진 199명에게, 같은 질문을 적어 함께 보낸다.",
    p5_evidence_turn_file: "작성 기록을, 감사팀 정식 자료로 반재욱에게 넘긴다.",
    p5_evidence_turn_hold: "연필 점의 정체를 알아낼 때까지, 혼자 쥐고 있는다.",
    p5_evidence_turn_share: "같은 날짜로 옮겨진 사람들에게, 이 시각부터 먼저 알린다.",
  },
  echoReplies: {
    // 프롤로그 05.
    p5_start_ask: "묻자 남지형이 볼펜을 내려놓습니다. '저도 못 봤습니다. 원안이 이미 이렇게 내려왔어요.' 그 말은 사유가 없다는 뜻이 아니라, 사유를 적은 종이가 따로 있다는 뜻입니다.",
    p5_start_copy: "사본은 두 장 나옵니다. 남지형이 복사기 앞에서 한 장을 더 뽑아 자기 서랍에 넣습니다. '이건 제 겁니다.' 그가 처음으로 규정에 없는 말을 합니다.",
    p5_start_sign: "서명은 4초 만에 끝납니다. 면담실을 나올 때 복도 시계는 9시 6분이고, 통지서는 이미 처리 완료 상태입니다.",
    p5_notice_talk: "끝까지 들으면 오진우가 그 하루를 분 단위로 말합니다. 의견서를 들고 팀장실 앞까지 두 번 갔고, 두 번 다 돌아섰습니다.",
    p5_notice_log: "목록은 두 장이 됩니다. 반출 불가로 표시된 자료가 열한 건이고, 그중 여섯 건은 당신이 직접 만든 것입니다.",
    p5_notice_leave: "먼저 내려가면 엘리베이터에 아무도 없습니다. 8층 불은 당신이 내려간 뒤 20분 더 켜져 있었다고 나중에 오진우가 말합니다.",
    p5_branch_archive_a: "부탁하면 임경수가 상자 위에 손바닥을 올립니다. '지키는 건 내가 제일 잘하는 거야. 다만 내 정년이 열한 달이네.'",
    p5_branch_archive_b: "목록에 적으면 상자 번호와 매듭 모양이 함께 기록됩니다. 그 기록은 3년 뒤 이 상자가 목록에서 빠져 있다는 증거가 됩니다.",
    p5_branch_archive_c: "사진은 여덟 장 남습니다. 매듭은 당신이 다시 묶었고, 임경수는 아무 말도 하지 않습니다.",
    p5_branch_archive_follow_a: "받지 않겠다고 하면 임경수가 종이를 안주머니로 다시 밀어 넣습니다. '그럼 자네가 찾아올 때까지만이네. 내가 오래 사는 사람은 아니야.'",
    p5_branch_archive_follow_b: "사본을 뜨면 복사기 불빛에 지운 자국이 더 선명해집니다. 두 장 중 한 장은 당신 가방으로, 한 장은 카디건 안주머니로 들어갑니다.",
    p5_branch_archive_follow_c: "받아 넣으면 트럭이 먼저 출발합니다. 원본 한 장이 이제 상자 밖에 있고, 상자 밖의 종이는 아무도 지켜 주지 않습니다.",
    p5_basement_meet: "물으면 세 사람의 대답이 전부 같은 모양입니다. 창구, 지점, 본점. 셋 다 사유 칸이 비어 있었습니다.",
    p5_basement_index: "목록은 사흘이 걸립니다. 412개 중 411개까지 번호가 붙고, 마지막 하나는 끈이 묶여 있어 뒤로 미룹니다.",
    p5_basement_desk: "단말은 켜집니다. 열람 권한은 30년치 전부, 쓰기 권한은 0건입니다. 여기서는 보는 것만 허락됩니다.",
    p5_echo_answer: "그대로 답하면 파형이 오래 흔들립니다. '기록했습니다. 당신은 4월 12일에 열아홉 시간 동안 멈추지 않았습니다. 그게 제가 찾던 값입니다.'",
    p5_echo_terms: "조건을 붙이면 화면에 한 줄이 뜹니다. '저장 위치를 알려 드릴 권한이 저에게 없습니다. 그래도 당신이 물었다는 사실은 남습니다.'",
    p5_echo_test: "계산하라고 하면 4초 만에 답이 나옵니다. '179.6%는 제7조 기준선 아래입니다. 계약은 유효합니다. 당신의 반대는 틀리지 않았고, 동시에 아무 효력이 없습니다.'",
    p5_final_hold: "이름들을 꺼내 놓으면 방이 조용해집니다. 여다인이 종이를 한참 보다가 자기 목록 옆에 나란히 놓습니다. '이러면 두 장이네요.'",
    p5_final_record: "사본을 꺼내 놓으면 오진우가 날짜를 하나하나 읽습니다. 4월 12일, 4월 28일, 6월 9일, 7월 17일. '빈 데가 있네요.' 반재욱과 똑같은 말입니다.",
    p5_final_alone: "빈 봉투를 놓으면 아무도 웃지 않습니다. 여다인이 그 봉투를 책상 가운데에 그대로 둡니다. '그럼 여기 채우면 되겠네요.'",
    p5_after_hold: "붙여 두면 종이가 책상 앞 벽에 남습니다. 테이프는 여름마다 한 번씩 갈아 붙이게 됩니다.",
    p5_after_record: "넣어 두면 사본 묶음이 그 상자 옆에 섭니다. 매듭은 그대로고, 목록에는 여전히 그 번호가 없습니다.",
    p5_after_alone: "가방을 비우면 책상이 완전히 빕니다. 빈 책상은 오래가지 않습니다. 사흘이면 다른 서류가 덮습니다.",
    p5_route_system_open: "보내면 인사부는 '검토하겠습니다'로 답하고, 감사팀은 아무 답도 하지 않습니다. 두 답 다 기록에는 남습니다.",
    p5_route_system_find: "찾아가면 네 명 중 두 명이 전화를 받습니다. 한 명은 자기 통지서를 아직 갖고 있고, 사유 칸은 그때도 비어 있었습니다.",
    p5_route_system_drop: "접어 두면 통계는 당신 머릿속에만 남습니다. 199명은 오늘도 자기 통지서가 왜 그 모양이었는지 모릅니다.",
    p5_final_system_route_a: "규칙이 생기면 다음 통지서는 사유를 기다립니다. 당신의 통지서는 규칙보다 일주일 먼저 만들어졌습니다.",
    p5_final_system_route_b: "당신 칸은 채워질 수 있습니다. 나머지 198장에는 오늘도 아무것도 적혀 있지 않습니다.",
    p5_final_system_route_c: "같은 질문을 함께 보내면 199명이 처음으로 서로의 이름을 봅니다. 답할 부서는 그 칸을 비워 둔 부서입니다.",
    p5_evidence_turn_file: "넘기면 반재욱이 접수 번호를 그 자리에서 붙입니다. 3년 뒤 이 번호가 살아 있는지가 그때의 첫 질문이 됩니다.",
    p5_evidence_turn_hold: "쥐고 있으면 연필 점은 당신 것이 됩니다. 그 점을 찍은 손을 알아내는 데 3년이 걸립니다.",
    p5_evidence_turn_share: "알리면 같은 날짜로 옮겨진 사람이 당신 말고 다섯 명이라는 것이 드러납니다. 다섯 장 모두 사유 칸이 비어 있습니다.",
  },
  characterProfiles: {
    남지형: {
      role: "KD은행 본점 인사부 대리 · 4년차",
      stance: "절차 · 자기 보호 · 미안함",
      job: "사유가 적히지 않은 종이를 읽어 준다. 그리고 그 종이를 자기가 만들지 않았다는 사실만 지킨다.",
      appearance: "손목까지 내린 셔츠, 접수 도장이 든 왼쪽 서랍, 통지서를 늘 한 번 뒤집어 보는 손.",
      thought: "나는 읽어 주는 사람이다. 읽어 주는 사람도 그 자리에 앉아 있었던 사람으로 적힌다.",
      gesture: "남지형은 곤란한 질문을 받으면 종이를 뒤집어 뒷면이 비었는지 확인한다.",
      voice: "규정 문장으로 말하다가, 마지막 한 마디에서만 규정 밖으로 나온다.",
      line: "사유는 원래 안 적습니다. 그렇게 배웠습니다.",
    },
    여다인: {
      role: "그룹 인지·판단 연구랩 분석관 · KD은행 부산 사하지점 창구 출신",
      stance: "생계 · 억울함 · 솔직함",
      job: "자기가 판 상품을 자기도 몰랐다는 말을 제일 먼저 꺼낸다.",
      appearance: "지점에서 쓰던 이름표를 아직 단 목걸이, 계단 밑에 두고 다니는 슬리퍼, 늘 뜯겨 있는 서류 모서리.",
      thought: "설명서를 그대로 읽었는데 41건이 내 이름으로 남았다. 그럼 읽으라고 한 사람은 어디에 적혀 있나.",
      gesture: "여다인은 말이 막히면 상자나 책상 옆면을 손가락으로 두 번 두드린다.",
      voice: "질문을 돌려 하지 않는다. 미안하다는 말과 궁금하다는 말을 같은 속도로 한다.",
      line: "저는 41건이고 선배는 1건인데, 왜 우리가 같은 층에 있어요?",
    },
  },
  setting: { place: "KD은행 본점 7층 인사부 면담실", clock: "2023년 7월 17일 월요일 · 09시" },
  sceneContext: {
    p5_start: {
      place: "KD은행 본점 7층 인사부 면담실",
      clock: "2023년 7월 17일 월요일 · 09시",
      question: "인사 통지서의 사유 칸과 제안자 칸이 둘 다 비어 있습니다. 무엇부터 하겠습니까?",
      lead: "반대 의견서는 반려됐고, 사후 점검은 끝났고, 두 달 동안 아무 일도 일어나지 않았습니다.",
    },
    p5_start_warn: {
      place: "KD은행 본점 7층 인사부 면담실",
      clock: "2023년 7월 17일 월요일 · 09시",
      question: "말해 준 사람은 아직 4번 창구에 있고, 옮겨지는 사람은 당신입니다. 무엇부터 하겠습니까?",
      lead: "5월에 4번 창구에서 한 말이 두 달 만에 문자 한 통으로 돌아왔습니다.",
    },
    p5_start_report: {
      place: "KD은행 본점 7층 인사부 면담실",
      clock: "2023년 7월 17일 월요일 · 09시",
      question: "5월 보고서 접수 번호가 통지서 첨부 목록에 들어 있습니다. 이 줄을 어떻게 하겠습니까?",
      lead: "두 달 동안 회신이 없던 접수 번호를, 오늘 다른 종이에서 다시 봅니다.",
    },
    p5_start_quiet: {
      place: "KD은행 본점 7층 인사부 면담실",
      clock: "2023년 7월 17일 월요일 · 09시",
      question: "말하지 않았는데도 자리가 옮겨집니다. 이 자리에서 무엇부터 하겠습니까?",
      lead: "5월에 본 것을 아무에게도 말하지 않았고, 두 달 동안 정말 아무 일도 없었습니다.",
    },
    p5_notice: {
      place: "KD은행 본점 8층 기업금융전략팀",
      clock: "7월 21일 금요일 · 18시",
      question: "오진우가 자기가 하루 늦췄다고 말합니다. 짐을 싸는 이 저녁을 어떻게 쓰겠습니까?",
      lead: "복사용지 상자 네 개가 3년치 자리를 다 비웁니다.",
    },
    p5_branch_archive: {
      place: "본점 8층 기록 보관실",
      clock: "7월 21일 금요일 · 19시 30분",
      question: "합정동으로 갈 상자 하나에 2023-0412가 적혀 있습니다. 이 앞에서 무엇을 하겠습니까?",
    },
    p5_branch_archive_follow: {
      place: "본점 뒤편 하역장",
      clock: "7월 21일 금요일 · 20시",
      question: "임경수가 상자에 넣지 않은 종이 한 장을 지금 줄지 묻습니다. 무엇이라 답하겠습니까?",
    },
    p5_office: {
      place: "본점 8층 기업금융전략팀 팀장실",
      clock: "7월 24일 월요일 · 08시 30분",
      question: "윤상혁이 그린 네 번째 네모가 비어 있습니다. 이 면담을 어떻게 닫겠습니까?",
    },
    p5_office_reaction: {
      place: "본점 8층 엘리베이터 앞",
      clock: "7월 24일 월요일 · 08시 40분",
      question: "한서윤이 열두 해 전에 같은 종이를 봤다고 합니다. 무엇을 하겠습니까?",
    },
    p5_basement: {
      place: "합정동 그룹 인지·판단 연구랩 4층 분석관실",
      clock: "7월 24일 월요일 · 09시",
      question: "먼저 온 사람들 가운데 오진우가 있습니다. 이 첫 아침을 어떻게 쓰겠습니까?",
      lead: "정문 명패에는 부서 이름만 있고, 로비 안내판에는 없어진 부서 이름이 아직 붙어 있습니다.",
    },
    p5_gate: {
      place: "연구랩 1층 로비 · 출입 등록대",
      clock: "7월 24일 월요일 · 14시",
      question: "사후 점검 종결 확인서의 마지막 칸이 당신 자리입니다. 어떻게 하겠습니까?",
    },
    p5_gate_reaction: {
      place: "연구랩 1층 로비 · 자동문 앞",
      clock: "7월 24일 월요일 · 14시 20분",
      question: "반재욱이 수첩 네 번째 줄에 오늘 날짜와 당신 이름을 적습니다. 무엇이라 답하겠습니까?",
    },
    p5_echo: {
      place: "연구랩 4층 분석관실 · 케이스데스크 1번",
      clock: "7월 24일 월요일 · 19시",
      question: "이름도 없는 단말이 당신에게 첫 질문을 했습니다. 어떻게 답하겠습니까?",
      lead: "분석관실 불이 반쯤 꺼진 뒤에 1번 단말이 혼자 켜집니다.",
    },
    p5_call: {
      place: "연구랩 4층 · 비상계단 앞",
      clock: "7월 24일 월요일 · 21시",
      question: "도윤하가 자기가 무엇을 팔았는지 묻습니다. 어디까지 말하겠습니까?",
    },
    p5_call_reaction: {
      place: "연구랩 B2로 내려가는 계단 밑",
      clock: "7월 24일 월요일 · 21시 30분",
      question: "여다인이 끈 묶인 상자를 무릎에 올린 채 열어도 되냐고 묻습니다. 무엇을 하겠습니까?",
    },
    p5_route_system: {
      place: "연구랩 4층 분석관실 · 케이스데스크 1번",
      clock: "7월 24일 월요일",
      question: "반대 의견을 쓴 199명의 통지서에 사유 칸이 채워진 것은 0건입니다. 이 통계를 어떻게 하겠습니까?",
    },
    p5_final_system_route: {
      place: "연구랩 4층 분석관실 · 케이스데스크 1번",
      clock: "7월 24일 월요일 · 22시",
      question: "이 형태를 하나만 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    p5_evidence_turn: {
      place: "연구랩 4층 분석관실 · 접속 기록",
      clock: "7월 24일 월요일 · 22시 20분",
      question: "통지서의 원안은 반려된 날 아침에 이미 있었습니다. 이 작성 기록을 어떻게 쓰겠습니까?",
    },
    p5_final: {
      place: "연구랩 4층 분석관실 · 첫 회의",
      clock: "7월 24일 월요일 · 22시",
      question: "첫날 자기소개는 무엇을 들고 왔는지로 합니다. 가방에서 무엇을 꺼내겠습니까?",
      lead: "이름과 경력은 아무도 묻지 않습니다. 대신 책상 가운데에 하나씩 올려놓습니다.",
    },
    p5_aftershock: {
      place: "연구랩 B2 기록 보관소 · 계단 밑",
      clock: "7월 25일 화요일 · 00시",
      question: "아무도 처벌받지 않았고 자리를 옮긴 사람은 당신 하나입니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "p5-transfer-draft",
    title: "사유 없는 원안",
    text: "인사 제2023-1187호의 원안 파일은 인사부가 아니라 기업금융전략팀 공용 계정이 4월 28일 오전 9시 12분에 만들었습니다. 반대 의견서가 반려된 지 세 시간 뒤이고, 제안자 칸 왼쪽 위에는 원본 파일에서만 보이는 연필 점이 하나 있었습니다.",
  },
  outcomes: {
    p5_after_hold: { tag: "사람을 놓지 않은 결말", title: "이름들을 책상 앞 벽에 붙이고 시작했다", text: "종이 한 장이 4층 창가 자리 벽에 붙습니다. 테이프가 세 번 마르고 세 번 갈려 붙는 동안 그 종이는 한 번도 내려오지 않고, 그 아래 책상에 훈련용 사례라는 서류철이 놓이는 날 표지 밑단에는 2023-0412가 지워지지 않은 채 남아 있습니다." },
    p5_after_record: { tag: "기록을 들고 간 결말", title: "사본과 날짜를 B2의 그 상자 옆에 세웠다", text: "사본 묶음이 끈 묶인 상자 옆에 섭니다. 지하는 계절이 바뀌어도 온도가 같아서, 세 번의 겨울이 지나는 동안 그 매듭은 임경수가 묶은 모양 그대로입니다. 목록에서 빠진 번호도 그대로입니다." },
    p5_after_alone: { tag: "혼자 시작한 결말", title: "빈 책상 하나로 다시 시작했다", text: "가방은 비었고 책상도 비었습니다. 빈 책상은 사흘이면 다른 사건의 서류로 덮이고, 그 위에 쌓인 사건이 마흔여덟 개를 지나 다시 같은 번호로 돌아올 때 당신은 이 층을 지하라고 부르는 사람이 되어 있습니다." },
  },
  carryovers: {
    p5_after_hold: { trust: 10, humanCost: -4, fatigue: 5 },
    p5_after_record: { legitimacy: 11, trust: 3, fatigue: 4 },
    p5_after_alone: { capital: 7, time: 5, trust: -6 },
  },
  continuityChallenges: {
    p4_after_warn: { id: "protect-trust", title: "말해 준 사람을 계속 붙들기", text: "5월에 4번 창구에서 진실을 말해 준 사람이 아직 그 자리에 있습니다. 옮겨지는 쪽이 먼저 연락을 끊지 않는 선택을 찾아야 보너스가 열립니다." },
    p4_after_report: { id: "use-reframe", title: "회신 없는 접수 번호로 판 뒤집기", text: "두 달 동안 답이 없던 보고서 번호가 이번 통지서 첨부 목록에 들어 있습니다. 회신이 없었다는 사실 자체를 근거로 삼아 질문의 모양을 다시 짜야 합니다." },
    p4_after_quiet: { id: "repair-legitimacy", title: "조용했던 두 달의 정당함 회복하기", text: "5월에 본 것을 아무에게도 말하지 않았고, 그런데도 자리가 옮겨졌습니다. 그 두 달을 나중에 설명할 수 있게 만드는 선택을 찾아야 합니다." },
  },
};
