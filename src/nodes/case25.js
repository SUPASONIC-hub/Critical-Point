/**
 * CASE 25 -- the man who did not come, and the door into the second half.
 *
 * The lab went dark at 18:00 and 윤상혁 asked the analyst up "to talk about the
 * empty signature box". He is not on the 33rd floor. What waits on his cleared
 * desk is tomorrow's personnel notice: 윤상혁 moves up to chief executive of
 * KD캐피탈, and at the bottom of the list the analyst is posted to KD캐피탈's
 * risk department, reporting to him. The six people of 트리거랩 scatter to six
 * places -- a branch counter, a data lab, a provincial audit tour, a rival bank,
 * a room with no desk work, and the new man's own floor. Nobody mentions the
 * signature box again.
 *
 * The case is the first week of that scattering, and it opens volume two's
 * question: why the same shape grows back after the chain is cut. The notice
 * lands on April Fools' Day (오진우 is sure it is a prank), 한서윤 is handed a
 * wall-facing desk and a ten-page self-improvement assignment, the old team eats
 * farewell lunchboxes under the cherry trees on 윤중로 (권도현 finds his first
 * surplus), and the six argue over a group-chat name on a Seoul Station platform
 * while 반재욱 boards a train to 군산. Under the laughter the dates line up: the
 * promotion was decided on 14 March, four days before the shareholders voted,
 * and the same board meeting named one extra hire for the risk department. The
 * analyst was not sent away. The analyst was sent for. The inauguration ends
 * with a Monday agenda item -- a stalled officetel site in 평택 -- which is where
 * 사건 26 begins.
 */
export const case25Nodes = {
  c25_start: {
    phase: "CASE 25 BRIEFING",
    title: "오지 않은 사람",
    speaker: "백아린",
    text:
      "금요일 21시 40분, 33층 엘리베이터 문이 열립니다. 그룹전략실은 불이 반만 켜져 있고, 복도 끝 윤상혁의 방은 문이 활짝 열려 있습니다. 책상 위에는 서류 한 장 없고, 명패는 뒤집혀 있습니다. 자기 자리에서 상자를 싸던 백아린이 고개를 듭니다. '안 오세요. 오후 네 시에 차가 나갔어요. 그 문자는 차 안에서 보내신 거예요.' 그가 빈 책상 한가운데를 가리킵니다. 종이 한 장이 놓여 있습니다. 내일 날짜로 된 인사 공지 인쇄본입니다. 첫 줄은 '윤상혁, KD캐피탈 대표이사 선임'. 그 아래로 트리거랩 해체에 따른 발령(근무지를 옮기라는 인사 명령) 명단이 이어지고, 맨 끝 줄에 당신 이름이 있습니다. 'KD캐피탈 위험관리부, 대표이사 직속.' 빈 서명란 이야기는 어디에도 없습니다.",
    memo: [
      "33층 윤상혁의 방 -- 불 켜짐, 사람 없음, 명패 뒤집힘",
      "인쇄본: 4월 1일자 인사 공지, 윤상혁 KD캐피탈 대표이사",
      "당신의 새 자리: KD캐피탈 위험관리부, 대표이사 직속",
      "주머니 속 수신 기록 사본 -- 아직 아무에게도 보이지 않음",
    ],
    triggers: ["injustice", "manipulation", "choice"],
    choices: [
      {
        id: "c25_start_call",
        label: "인쇄본을 찍어 이름이 오른 동료들에게 오늘 밤 먼저 알린다",
        effect: { trust: 11, humanCost: -4, time: -4, legitimacy: -3, fatigue: 5 },
        next: "c25_notice",
        cognition: { persistence: 2 },
      },
      {
        id: "c25_start_log",
        label: "빈방과 인쇄본을 백아린의 확인과 함께 기록으로 남긴다",
        effect: { legitimacy: 11, trust: -3, time: -4, humanCost: 4, fatigue: 2 },
        next: "c25_notice",
        cognition: { inference: 2 },
      },
      {
        id: "c25_start_seat",
        label: "인쇄본을 챙겨 나와 공지가 뜨기 전에 수를 먼저 짠다",
        effect: { capital: 7, time: 5, legitimacy: -5, trust: 2, humanCost: 2, fatigue: -2 },
        next: "c25_notice",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c25_notice",
      },
    ],
  },
  c25_notice: {
    phase: "APRIL NOTICE",
    title: "만우절의 인사 공지",
    speaker: "오진우",
    text:
      "4월 1일 토요일 오전 7시, 전 직원 인사 공지가 올라옵니다. 어젯밤 33층 책상 위에 있던 문장 그대로입니다. 윤상혁, KD캐피탈 대표이사 영전(더 높은 자리로 옮겨 가는 인사). 10시, 트리거랩 건물 앞 골목에 이삿짐 트럭이 섭니다. 벚꽃이 이틀 새 절반쯤 피었습니다. 상자를 안고 나온 오진우가 공지를 다시 읽습니다. '오늘 만우절이잖아요. 이거 누가 장난친 거죠?' 야간조를 마치고 들른 강태민이 대답 대신 상자 두 개를 한꺼번에 듭니다. 도윤하는 강서지점, 이민서는 KD데이터랩, 반재욱은 감사팀 지방 순회, 오진우는 브릿지은행. 한서윤의 이름 옆에만 부서가 없습니다. '대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치).' 사유 칸은 비어 있습니다. 오진우가 휴대폰을 뒤집습니다. '성과 없음은 그래도 네 글자였는데, 이번엔 한 글자도 없네요.'",
    memo: [
      "4월 1일 07시 인사 공지 -- 윤상혁 KD캐피탈 대표이사 영전",
      "여섯 자리: 강서지점 · KD데이터랩 · 지방 순회 · 브릿지은행 · 대기 · KD캐피탈",
      "한서윤: 대기발령, 사유 칸 비어 있음",
      "이삿짐 트럭 1대, 상자 스무 개, 오늘 안에 반출",
    ],
    triggers: ["injustice", "affection", "helplessness"],
    choices: [
      {
        id: "c25_notice_call",
        label: "짐보다 먼저 한서윤에게 전화해 곁에 있겠다고 말한다",
        effect: { trust: 13, humanCost: -5, time: -5, capital: -3, fatigue: 4 },
        next: "c25_standby",
        cognition: { persistence: 1, reframing: 1 },
      },
      {
        id: "c25_notice_ask",
        label: "사유 없는 대기발령에 인사부의 공식 설명을 요구한다",
        effect: { legitimacy: 11, trust: 2, time: -6, humanCost: 2, fatigue: 5 },
        next: "c25_standby",
        cognition: { inference: 2 },
      },
      {
        id: "c25_notice_load",
        label: "공지는 공지대로 두고 트럭부터 오늘 안에 채운다",
        effect: { capital: 6, time: 6, trust: 2, legitimacy: -5, humanCost: 3, fatigue: -3 },
        next: "c25_standby",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c25_standby",
      },
    ],
  },
  c25_standby: {
    phase: "NO DESK WORK",
    title: "벽을 보는 책상",
    speaker: "한서윤",
    text:
      "월요일 9시, 본사 7층 복도 끝 방. 문패 없는 방에 책상 여섯 개가 모두 벽을 보고 놓여 있습니다. 컴퓨터는 없고, 책상마다 A4 한 묶음과 볼펜 한 자루뿐입니다. 한서윤은 창가 쪽 책상에 앉아 있습니다. 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 조치)을 받은 사람에게 인사부가 내준 첫 과제는 '자기계발 계획서 A4 10장'입니다. 그가 볼펜을 돌리며 웃습니다. '3년 동안 남의 생각을 초 단위로 기록하던 사람한테, 이제 자기 생각을 10장 써 오래요.' 창밖으로 여의도 벚꽃이 보입니다. 그가 목소리를 낮춥니다. '어제 엄마가 전화했어요. 뉴스에 KD 인사가 나왔는데, 너도 좋은 데로 가냐고요.' 그는 계획서 첫 장에 이름만 쓰고, 한참 아무것도 쓰지 못합니다.",
    memo: [
      "본사 7층 대기실 -- 벽을 보는 책상 6개, 컴퓨터 없음",
      "첫 과제: 자기계발 계획서 A4 10장, 제출은 금요일",
      "한서윤의 어머니: '너도 좋은 데로 가냐'",
      "대기 기간: 공지에 적히지 않음",
    ],
    triggers: ["affection", "helplessness", "injustice"],
    choices: [
      {
        id: "c25_standby_sit",
        label: "오늘은 옆 책상에 앉아 계획서 열 장을 같이 채운다",
        effect: { trust: 12, humanCost: -5, time: -5, capital: -1, fatigue: 5 },
        next: "c25_chatroom",
        cognition: { persistence: 2 },
      },
      {
        id: "c25_standby_rule",
        label: "대기 기간과 사유를 서면으로 받아 내는 절차부터 밟는다",
        effect: { legitimacy: 12, trust: -1, time: -5, humanCost: 4, fatigue: 4 },
        next: "c25_chatroom",
        cognition: { inference: 2 },
      },
      {
        id: "c25_standby_leave",
        label: "오래 머물면 서로 표적이 된다며 짧게 인사만 하고 나온다",
        effect: { capital: 5, time: 6, trust: -4, legitimacy: 2, humanCost: 3, fatigue: -3 },
        next: "c25_chatroom",
        cognition: { risk: 1, reframing: 1 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c25_chatroom",
      },
    ],
  },
  c25_chatroom: {
    phase: "GROUP CHAT",
    title: "여섯 명의 단체방",
    speaker: "반재욱",
    text:
      "수요일 밤 9시, 서울역 승강장. 반재욱이 군산행 KTX 앞에 서 있습니다. 감사팀 지방 순회의 첫 행선지입니다. 한서윤이 휴대폰을 들어 보입니다. '단체방 만들었어요. 여섯 명. 이름은 투표로 정해요.' 후보가 쏟아집니다. 오진우는 '트리거랩 동창회', 이민서는 '성과 없음', 도윤하는 '화요일 점심'. 반재욱이 '4층'을 올리자 한서윤이 '엘리베이터가 안 서는 층 같잖아요'라며 반대합니다. 초대받지도 않은 강태민이 밖에서 문자를 보냅니다. '내일도 출근합시다로 하십시오.' 개표 결과는 3 대 3. 발차 벨이 울리고, 반재욱이 기차에 오르며 마지막 한 표를 당신에게 넘깁니다. '결정은 늘 당신 몫이었잖아요. 이번엔 가벼운 걸로 하세요.' 문이 닫히고, 휴대폰 화면에서 투표 창이 깜빡입니다.",
    memo: [
      "단체방 인원 6명 -- 이름 미정, 개표 3 대 3",
      "후보: 트리거랩 동창회 · 성과 없음 · 화요일 점심 · 4층",
      "장외 후보: '내일도 출근합시다' (강태민, 초대 안 됨)",
      "반재욱 지방 순회 첫 행선지: 군산",
    ],
    triggers: ["trust", "affection", "choice"],
    choices: [
      {
        id: "c25_chatroom_tuesday",
        label: "'화요일 점심'으로 정하고 안부부터 지키는 방으로 둔다",
        effect: { trust: 12, humanCost: -4, time: -3, capital: -3, fatigue: 5 },
        next: "c25_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c25_chatroom_log",
        label: "'4층'으로 정하고 매일 본 것을 날짜와 함께 적는 방으로 만든다",
        effect: { legitimacy: 10, trust: 5, time: -6, humanCost: 2, fatigue: 4 },
        next: "c25_final",
        cognition: { inference: 1, persistence: 1 },
      },
      {
        id: "c25_chatroom_toast",
        label: "'내일도 출근합시다'로 정하고 강태민까지 불러 웃고 끝낸다",
        effect: { trust: 5, capital: 4, time: 5, legitimacy: -5, humanCost: 2, fatigue: -5 },
        next: "c25_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c25_final",
      },
    ],
  },
  c25_final: {
    phase: "FINAL DECISION",
    title: "창가 자리",
    speaker: "윤상혁",
    text:
      "금요일 10시, KD캐피탈 본사 1층 로비. 취임식 무대 뒤로 벚꽃 화분 스무 개가 줄지어 섰습니다. 윤상혁이 연단에 올라 4분 동안 말합니다. '위험을 아는 사람이 위험을 맡아야 합니다.' 박수가 두 번 나옵니다. 연단을 내려온 그가 인사하는 줄을 따라 걷다가 당신 앞에서 멈춥니다. 일주일 전 33층에 오지 않은 사람이 이번에는 먼저 손을 내밉니다. '창가 자리는 마음에 드나. 자네 같은 사람이 옆에 있어야 내가 덜 틀리지.' 서명란 이야기는 이번에도 없습니다. 그가 목소리를 낮춥니다. '월요일 아침 여덟 시, 20층으로 올라오게. 첫 안건이 평택일세.' 그가 다음 사람에게 걸어갑니다. 주머니 속 휴대폰에서 여섯 명의 단체방 알림이 쉬지 않고 울립니다.",
    memo: [
      "KD캐피탈 대표이사 취임식 -- 연설 4분, 박수 두 번",
      "윤상혁: '자네 같은 사람이 옆에 있어야 내가 덜 틀리지'",
      "월요일 08시 20층 -- 첫 안건: 평택",
      "단체방 읽지 않은 메시지 47개",
    ],
    triggers: ["choice", "manipulation", "responsibility"],
    choices: [
      {
        id: "c25_final_share",
        label: "들어가되 20층에서 본 것을 매일 단체방에 나눈다",
        effect: { trust: 11, legitimacy: 5, humanCost: -4, capital: -5, time: -5, fatigue: 6 },
        next: "case25_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c25_final_refuse",
        label: "대표이사 직속 자리를 거부하고 인사 이의를 낸다",
        effect: { legitimacy: 13, trust: 4, capital: -9, time: -6, humanCost: 3, fatigue: 5 },
        next: "case25_result",
        cognition: { inference: 2 },
      },
      {
        id: "c25_final_enter",
        label: "윤상혁 아래로 들어가 월요일 첫 안건부터 곁에서 본다",
        effect: { capital: 10, time: 5, legitimacy: 3, trust: -6, humanCost: 4, fatigue: -2 },
        next: "case25_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case25_result",
      },
    ],
  },
};

/**
 * Everything else case 25 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case25 = {
  id: "case25",
  nodes: case25Nodes,
  aftermath: {
    c25_aftershock: {
      phase: "AFTERMATH",
      title: "출근 1주 차",
      speaker: "한서윤",
      text: "금요일 밤 11시, 윤중로 벚꽃이 눈처럼 떨어집니다. 흩어진 지 한 주 만에 여섯이 다시 한 줄로 걷습니다. 반재욱은 군산에서 영상통화로 따라옵니다. 한서윤이 단체방 이름 옆에 작은 글씨를 붙입니다. '출근 1주 차.' 오진우가 '브릿지 첫 주 점심 대결 4전 3승'을 올리자 권도현이 곧바로 답합니다. '그 1패가 접니다. 밥값은 제가 냈으니 실질적으로는 제가 이겼습니다.' 모두 웃는 사이, 당신의 메일함에 채이안의 메일이 도착합니다. 제목은 '평택 현장 -- 타워크레인 위 1명'. 본문은 한 줄입니다. '월요일 안건 전에 보셔야 할 것 같아서요.'",
      memo: ["윤중로 벚꽃 -- 절정 지나 지는 중", "단체방: '출근 1주 차'", "오진우 점심 대결 4전 3승, 1패는 권도현", "채이안의 메일: 평택 현장, 타워크레인 위 1명"],
      triggers: ["affection", "responsibility", "choice"],
      choices: [
        { id: "c25_after_warm", label: "벚꽃길 끝까지 여섯이 함께 걷고 월요일은 월요일에 연다", effect: { trust: 12, humanCost: -5, time: -3, capital: -2, fatigue: -8 }, next: "case25_result", cognition: { reframing: 2 } },
        { id: "c25_after_record", label: "흩어진 여섯 자리에서 첫 주에 본 것을 한 문서로 묶어 둔다", effect: { legitimacy: 13, trust: 4, time: -6, capital: -1, fatigue: 5 }, next: "case25_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c25_after_rush", label: "메일을 열자마자 그 밤에 곧장 평택 현장으로 차를 몬다", effect: { capital: 7, legitimacy: 6, trust: -6, humanCost: 4, fatigue: 7 }, next: "case25_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c25_final", "c25_aftershock"],
  connectiveScenes: [
    ["c25_photo", "c25_notice", "c25_standby", "마지막 단체 사진", "문하준", "트럭 문을 닫기 전, 문하준이 삼각대를 폅니다. 떡집 배달을 따라왔다가 사진사가 됐습니다. '마지막 단체 사진이요. 트리거랩 간판 나오게 서 주세요.' 강태민이 맨 뒤에 서자 간판이 가려지고, 앞줄에 앉히자 이번엔 권도현이 통째로 가려집니다. 권도현이 '저는 원래 장부 뒤에 있는 사람입니다'라며 까치발을 듭니다. 앞줄 가운데 한 자리가 비어 있습니다. 한서윤은 오지 않았습니다. 문하준이 타이머를 누르려다 멈춥니다. '실장님 자리, 비워 둘까요? 아니면 나중에 제가 그려 넣을까요?' 꽃잎 하나가 렌즈 위에 내려앉습니다.", ["마지막 단체 사진 -- 삼각대, 타이머 10초", "앞줄 가운데 빈자리: 한서윤", "사진사: 문하준 (떡집 배달 동행)"], ["한서윤의 자리를 비워 두고 사진을 들고 그를 찾아간다", "사진에 날짜와 각자의 새 자리를 적어 기록으로 남긴다", "빈자리 없이 모인 사람끼리 바로 찍고 트럭을 보낸다"]],
    ["c25_lunchbox", "c25_standby", "c25_chatroom", "벚꽃 도시락", "도윤하", "화요일 점심, 도윤하의 제안으로 윤중로 벚나무 아래에 돗자리를 폅니다. 송별 도시락입니다. 도윤하는 김밥 여섯 줄, 나준혁은 영동에서 도장 모양으로 찍어 온 주먹밥, 강태민은 보온병 물로 컵라면을 붓습니다. '벚꽃에는 컵라면입니다.' 1인당 단가를 계산하던 권도현이 '이 가격이면 흑자입니다'라고 말해 버리고, 모두 그의 첫 흑자에 박수를 칩니다. 그때 한서윤이 보자기를 들고 나타납니다. 대기실에서 받은 점심시간 한 시간 동안 싸 온 유부초밥입니다. '할 일이 없으니까 손이 부지런해지더라고요.' 도윤하가 웃다가 조용해집니다. '다음 주부터는 이렇게 모일 핑계가 없네요.'", ["송별 도시락 -- 김밥 6줄, 도장 주먹밥, 컵라면, 유부초밥", "권도현 시즌 첫 '흑자' 선언", "다음 모임: 정해지지 않음"], ["핑계가 없으면 만들자며 매주 화요일 점심을 약속한다", "모이는 날마다 서로 본 것을 한 장씩 적어 오기로 한다", "오늘은 사진만 남기고 각자 새 자리에 먼저 적응하자고 한다"]],
    ["c25_firstday", "c25_chatroom", "c25_final", "창밖을 보는 사람", "채이안", "목요일, KD캐피탈 위험관리부 첫 출근입니다. 부장 채이안이 당신을 창가 자리로 안내합니다. 창밖으로 벚나무가 한 줄로 서 있습니다. '대표님이 직접 고르신 자리예요. 여기 온 사람은 둘로 나뉩니다. 창밖을 보는 사람과 모니터를 보는 사람.' 그가 두툼한 파일을 책상에 내려놓습니다. 부동산 PF(짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출) 목록입니다. 맨 위 평택 오피스텔 공사의 상태 칸에 연필로 '멈춤'이라고 적혀 있습니다. '이 부서 일은 위험을 줄이는 게 아니라, 위험이 누구 이름으로 적히는지 정하는 거예요. 첫 주는 창밖을 보세요. 둘째 주부터는 못 봅니다.'", ["KD캐피탈 위험관리부 -- 창가 자리, 대표이사 지정", "부동산 PF 목록 맨 위: 평택 오피스텔, 상태 '멈춤'", "채이안: '둘째 주부터는 못 봅니다'"], ["평택 현장에서 기다리는 사람들부터 명단으로 확인한다", "멈춤이라고 적힌 칸의 근거 서류부터 달라고 한다", "첫 주는 창밖을 보라는 말대로 조용히 자리를 익힌다"]],
  ],
  connectiveOrder: [["c25_notice", "c25_photo"], ["c25_standby", "c25_lunchbox"], ["c25_chatroom", "c25_firstday"]],
  choiceEffects: {
    c25_notice: [
      { trust: 10, humanCost: -4, time: -4, capital: -3, fatigue: 3 },
      { legitimacy: 8, trust: 3, time: -5, humanCost: 1, fatigue: 3 },
      { time: 5, capital: 3, trust: 2, legitimacy: -3, humanCost: 2, fatigue: -3 },
    ],
    c25_standby: [
      { trust: 10, humanCost: -3, capital: -3, time: -3, fatigue: 3 },
      { legitimacy: 8, trust: 4, time: -4, humanCost: 2, fatigue: 4 },
      { time: 4, capital: 3, trust: 3, legitimacy: -3, humanCost: 2, fatigue: -4 },
    ],
    c25_chatroom: [
      { trust: 9, humanCost: -4, time: -4, capital: -2, fatigue: 5 },
      { legitimacy: 9, trust: 1, time: -5, humanCost: 2, fatigue: 2 },
      { capital: 5, time: 5, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c25_notice: {
      voice: ["한서윤의 자리는 비워 두고, 사진을 들고 그를 찾아간다.", "사진에 날짜와 각자의 새 자리를 적어, 기록으로 남긴다.", "빈자리 없이 모인 사람끼리, 바로 찍고 트럭을 보낸다."],
      echo: ["빈자리를 둔 사진은 이상하게 꽉 차 보입니다. 사진을 받은 한서윤은 한참 뒤에야 '고마워요' 네 글자를 보냅니다.", "날짜와 자리를 적으면 사진은 명단이 됩니다. 1년 뒤에 이 명단이 누구 손에 있을지는 아무도 모릅니다.", "사진은 금방 찍힙니다. 앞줄 가운데가 조금 좁아 보이는 걸 알아챈 사람은 문하준 하나입니다."],
    },
    c25_standby: {
      voice: ["핑계가 없으면 만들자며, 매주 화요일 점심을 약속한다.", "모이는 날마다, 서로 본 것을 한 장씩 적어 오기로 한다.", "오늘은 사진만 남기고, 각자 새 자리에 먼저 적응하자고 한다."],
      echo: ["화요일 점심은 약속이 됩니다. 권도현이 '매주면 연간 52회, 흑자가 유지될지 모르겠습니다'라고 걱정합니다.", "한 장씩 적어 오기로 하면 도시락이 회의가 됩니다. 도윤하는 그래도 김밥을 싸 오겠다고 합니다.", "각자 적응하면 다음 주 화요일은 조용히 지나갑니다. 한서윤의 유부초밥 통은 돌려받지 못한 채 도윤하의 가방에 남습니다."],
    },
    c25_chatroom: {
      voice: ["평택 현장에서 기다리는 사람들부터, 명단으로 확인한다.", "멈춤이라고 적힌 칸의, 근거 서류부터 달라고 한다.", "첫 주는 창밖을 보라는 말대로, 조용히 자리를 익힌다."],
      echo: ["명단을 부탁하자 채이안이 연필을 귀에서 뺍니다. '분양 계약자 212세대, 인부는 아직 세어 본 사람이 없어요.'", "근거 서류는 사흘 뒤에 옵니다. 서류마다 결정한 사람 칸은 연필로 적혀 있다가 지워져 있습니다.", "창밖의 벚나무는 일주일이면 잎이 납니다. 그사이 평택 파일은 책상 위에서 한 번도 열리지 않습니다."],
    },
  },
  reactionScenes: [
    ["c25_photo_reaction", "c25_photo", "c25_standby", "같은 층의 적수", "권도현", "트럭이 떠나자 권도현이 영수증 뭉치를 꺼냅니다. 이삿짐 운임 42만 원, 사다리차 8만 원, 강태민의 팔 힘은 '값을 매길 칸 없음'. 그러다 그가 공지의 한 줄에서 멈춥니다. 오진우, 브릿지은행 기업금융부. 자기 자리 바로 옆 칸입니다. '월요일부터 같은 층입니다. 점심때마다 이겼다고 할 텐데요.' 오진우가 '오늘 점심부터요'라고 받자 권도현이 계산기를 두드립니다. 웃음이 잦아들 무렵 그가 조용히 덧붙입니다. '브릿지가 KD캐피탈의 부실 대출 묶음을 들여다보고 있습니다. 오진우 씨가 앉을 자리가 바로 그 일입니다.'", ["오진우가 혼자 떠안지 않게 그 일을 같이 들여다보자고 한다", "브릿지와 KD캐피탈 사이 거래를 이해충돌 신고로 먼저 남긴다", "브릿지 쪽 정보를 오진우에게 부탁해 먼저 받아 둔다"]],
    ["c25_lunchbox_reaction", "c25_lunchbox", "c25_chatroom", "이름만 바뀐 폴더", "이민서", "돗자리를 접을 때 이민서가 당신 옆으로 옵니다. 그는 어제 KD데이터랩에 처음 출근했습니다. 새 출입증 사진은 트리거랩 사원증 사진 그대로입니다. '제 자리 옆 서버에 트리거랩 폴더가 있어요. 이름만 바뀌었어요. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자) 폴더로요.' 그가 유부초밥 하나를 입에 넣고 한참 씹습니다. '그리고 그 폴더를 매주 월요일 새벽에 열어 보는 외부 계정이 하나 있어요. 우리 그룹 사람이 아니에요.'", ["이민서가 혼자 위험해지지 않게 그 폴더는 건드리지 말라고 한다", "외부 계정의 접속 기록을 보존해 달라고 공식 요청한다", "외부 계정이 누구인지 오늘 밤 알아봐 달라고 부탁한다"]],
    ["c25_firstday_reaction", "c25_firstday", "c25_final", "둘째 줄", "반재욱", "밤 11시, 군산 숙소에서 반재욱이 사진 한 장을 보냅니다. 이번 인사의 발령(근무지를 옮기라는 인사 명령) 사유서입니다. 여섯 명 모두 사유는 한 줄로 같습니다. '조직 해체에 따른 재배치.' 그런데 당신의 사유서에만 둘째 줄이 있습니다. '요청 부서: KD캐피탈 대표이사실.' 반재욱이 문자를 잇습니다. '다른 다섯은 흩어진 거고, 당신은 불려 간 겁니다.' 한참 뒤 한 줄이 더 옵니다. '그리고 여기 군산 새봄신협 앞에 오늘 아침부터 어르신들이 줄을 서 있어요. 이유는 아직 모르겠습니다.'", ["불려 간 이유를 알기 전까지 다섯 동료에게는 짐을 지우지 않는다", "둘째 줄이 적힌 사유서를 원본째 보존해 달라고 요청한다", "새봄신협 줄이 무슨 일인지 반재욱에게 곧장 알아봐 달라고 한다"]],
  ],
  reactionEffects: {
    c25_photo: [
      { trust: 9, humanCost: -3, time: -2, capital: -3, fatigue: 3 },
      { legitimacy: 9, trust: -2, time: -4, humanCost: 2, fatigue: 3 },
      { capital: 5, time: 4, trust: -2, legitimacy: -4, humanCost: 3, fatigue: -2 },
    ],
    c25_lunchbox: [
      { trust: 9, humanCost: -4, legitimacy: -2, time: -3, fatigue: 3 },
      { legitimacy: 9, trust: 2, time: -4, capital: -2, humanCost: 2, fatigue: 4 },
      { capital: 4, time: 4, legitimacy: 2, trust: -3, humanCost: 4, fatigue: -2 },
    ],
    c25_firstday: [
      { trust: 8, humanCost: -4, legitimacy: -2, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -4, capital: -2, humanCost: 2, fatigue: 3 },
      { capital: 4, time: 4, trust: -2, humanCost: 4, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c25_photo: {
      voice: ["오진우가 혼자 떠안지 않게, 그 일을 같이 들여다보자고 한다.", "브릿지와 KD캐피탈 사이 거래를, 이해충돌 신고로 먼저 남긴다.", "브릿지 쪽 정보를, 오진우에게 부탁해 먼저 받아 둔다."],
      echo: ["같이 보자고 하면 오진우가 처음으로 이기자는 말 대신 '고마워요'라고 합니다. 권도현은 그 장면을 계산서에 적지 못합니다.", "신고는 접수됩니다. 오진우는 첫 출근 날 인사부에서 서약서 두 장을 더 받습니다.", "정보는 빨리 옵니다. 오진우는 새 자리 첫 주부터 두 회사 사이에 서게 됩니다."],
    },
    c25_lunchbox: {
      voice: ["이민서가 혼자 위험해지지 않게, 그 폴더는 건드리지 말라고 한다.", "외부 계정의 접속 기록을, 보존해 달라고 공식 요청한다.", "외부 계정이 누구인지, 오늘 밤 알아봐 달라고 부탁한다."],
      echo: ["건드리지 말라고 하면 이민서는 고개를 끄덕입니다. 월요일 새벽의 접속은 그다음 주에도 이어집니다.", "요청서는 접수되고, 접수 사실이 KD데이터랩 보안팀에 먼저 알려집니다. 이민서의 자리가 조금 불편해집니다.", "이민서는 그날 밤 계정 이름의 앞 세 글자를 찾아냅니다. 그리고 다음 날 아침 출입증이 한 번 먹통이 됩니다."],
    },
    c25_firstday: {
      voice: ["불려 간 이유를 알기 전까지, 다섯 동료에게는 짐을 지우지 않는다.", "둘째 줄이 적힌 사유서를, 원본째 보존해 달라고 요청한다.", "새봄신협 줄이 무슨 일인지, 반재욱에게 곧장 알아봐 달라고 한다."],
      echo: ["짐을 지우지 않으면 단체방은 가볍게 남습니다. 둘째 줄은 당신 혼자 들고 월요일을 맞습니다.", "보존 요청은 받아들여집니다. 요청서 사본은 당신의 새 부서장 책상에도 한 부 올라갑니다.", "반재욱은 이튿날 새벽부터 줄 끝에 섭니다. 감사팀 순회 일정표에는 그 줄이 없습니다."],
    },
  },
  reactionMemos: {
    c25_photo_reaction: ["오진우 새 자리: 브릿지은행 기업금융부, 권도현 옆 칸", "브릿지 검토 대상: KD캐피탈 부실 대출 묶음"],
    c25_lunchbox_reaction: ["KD데이터랩 서버 -- 트리거랩 폴더, 이름만 바뀜", "매주 월요일 새벽 외부 계정 접속"],
    c25_firstday_reaction: ["당신의 사유서 둘째 줄: 요청 부서 KD캐피탈 대표이사실", "군산 새봄신협 앞 아침 줄 -- 이유 미상"],
  },
  branchPlan: ["c25_standby", 0, "c25_branch_boxes", "c25_branch_boxes_follow"],
  branchScenes: {
    // CASE 25's detour is the floor the man left. The waiting room shows where a
    // person is parked; the side door shows how carefully another is moved.
    c25_branch_boxes: {
      phase: "SIDE DOOR",
      title: "33층의 이삿짐",
      speaker: "백아린",
      text: "7층에서 나오는 길에 엘리베이터가 33층에서 멈춥니다. 문이 열리자 이삿짐 업체 직원 넷이 윤상혁의 방을 싸고 있습니다. 상자마다 'KD캐피탈 대표이사실' 라벨이 붙고, 복도 끝에는 파쇄 업체의 회색 자루가 일곱 개 서 있습니다. 백아린이 자기 상자 위에 걸터앉아 그걸 보고 있습니다. '금요일에 사표 냈어요. 수리는 2주 뒤래요.' 그가 회색 자루 하나를 턱으로 가리킵니다. '저 자루들, 오늘 오후 세 시에 나가요. 제가 여기 있는 동안 그룹전략실 문서가 파쇄되러 나가기 전에 목록을 만든 적은 한 번도 없어요.'",
      memo: ["윤상혁의 방 이삿짐 -- 라벨 'KD캐피탈 대표이사실'", "파쇄 자루 7개, 오늘 15시 반출", "백아린 사표 제출, 수리까지 2주", "파쇄 전 반출 목록: 없음"],
      triggers: ["fear", "trust", "system"],
      choices: [
        { id: "c25_branch_boxes_a", label: "백아린 곁에 남아 떠나기 전 무엇이 두려운지 먼저 듣는다", effect: { trust: 12, humanCost: -5, capital: -3, time: -5, fatigue: 4 }, next: "c25_branch_boxes_follow", cognition: { reframing: 2 } },
        { id: "c25_branch_boxes_b", label: "파쇄 자루가 나가기 전에 반출 목록부터 만들어 달라고 요청한다", effect: { legitimacy: 11, trust: 3, time: -6, humanCost: 3, fatigue: 3 }, next: "c25_branch_boxes_follow", cognition: { inference: 2 } },
        { id: "c25_branch_boxes_c", label: "자루 하나를 열어 볼 수 있는지 이삿짐 직원에게 슬쩍 묻는다", effect: { capital: 6, time: 4, legitimacy: -6, trust: -2, humanCost: 3, fatigue: -2 }, next: "c25_branch_boxes_follow", cognition: { risk: 1 } },
      ],
    },
    c25_branch_boxes_follow: {
      phase: "SIDE DOOR",
      title: "나흘 먼저 온 메일",
      speaker: "백아린",
      text: "백아린이 휴대폰에서 메일 한 통을 엽니다. 윤상혁을 KD캐피탈 대표이사로 내정한다는 통보 메일입니다. 발송일은 3월 14일, 주주총회(회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의)보다 나흘 앞선 날입니다. 표결이 어떻게 나오든 이 자리는 이미 정해져 있었다는 뜻입니다. 메일 맨 아래에 한 줄이 더 있습니다. '위험관리부 충원 1명, 대표이사 지정.' 백아린이 휴대폰을 내립니다. '당신은 해체 공지보다 먼저 그분 명단에 있었어요. 치우는 쪽이 아니라 데려가는 쪽으로요. 그게 더 무섭지 않아요?'",
      memo: ["대표이사 내정 통보 메일 -- 3월 14일 발송", "주주총회보다 나흘 앞섬", "메일 끝줄: 위험관리부 충원 1명, 대표이사 지정", "백아린: '데려가는 쪽으로요'"],
      triggers: ["manipulation", "selfAwareness", "fear"],
      choices: [
        { id: "c25_branch_boxes_follow_a", label: "데려가는 이유를 알기 전까지 백아린의 이름은 어디에도 쓰지 않는다", effect: { trust: 11, humanCost: -4, legitimacy: -2, time: -4, fatigue: 5 }, next: "c25_lunchbox", cognition: { persistence: 2 } },
        { id: "c25_branch_boxes_follow_b", label: "내정 메일을 3월 14일 발송일 그대로 문서로 확보해 둔다", effect: { legitimacy: 12, trust: 2, capital: -2, time: -5, humanCost: 3, fatigue: 4 }, next: "c25_lunchbox", cognition: { inference: 2 } },
        { id: "c25_branch_boxes_follow_c", label: "그 자리가 미끼라면 먼저 물고 들어가 속을 본다", effect: { capital: 7, time: 5, trust: -3, legitimacy: -3, humanCost: 3, fatigue: -3 }, next: "c25_lunchbox", cognition: { risk: 2 } },
      ],
    },
  },
  routePlan: {
    start: "c25_start",
    result: "c25_aftershock",
    defaultFree: "c25_route_system",
    // One week of scattering. Like 사건 24 the case is a single line; what splits
    // is how the analyst walks into the new man's building.
    choices: {},
    system: {
      route: "c25_route_system",
      final: "c25_final_system_route",
      title: "영전의 통계",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 그룹 업무 앱에서 노아가 응답합니다. 트리거랩 단말이 꺼진 뒤 당신 계정에 남은 유일한 계산기입니다. 노아가 지난 10년 KD금융그룹 인사 공지 4,212건을 엽니다. 감사나 국정감사(국회가 1년에 한 번 정부와 금융회사의 일을 공개적으로 따져 묻는 자리)에 이름이 오른 임원 17명 가운데 14명이 석 달 안에 그룹 안 다른 회사의 대표로 옮겼습니다. 14건의 공지 문구는 모두 영전(더 높은 자리로 옮겨 가는 인사)이었고, 사유 칸은 전부 비어 있습니다. '옮긴다는 결정은 기록되고, 옮긴 이유는 기록되지 않습니다. 이 서식은 벌이 아니라 보호로 학습되어 있습니다.'",
      memo: ["최근 10년 인사 공지 4,212건", "문제 된 임원 17명 중 14명, 석 달 안에 다른 회사 대표로", "14건 모두 '영전', 사유 칸 비어 있음"],
      routeChoices: [
        ["c25_route_system_publish", "14건의 영전 공지를 나란히 묶어 동료들과 먼저 나눈다", { trust: 10, legitimacy: 5, capital: -4, time: -6, fatigue: 5 }, { reframing: 2 }],
        ["c25_route_system_file", "사유 칸이 빈 인사 공지를 감사위원회에 정식으로 묻는다", { legitimacy: 12, trust: 2, capital: -5, time: -7, humanCost: 2, fatigue: 4 }, { inference: 2, persistence: 1 }],
        ["c25_route_system_keep", "통계는 쥐고 있다가 윤상혁 앞에서 처음 꺼낸다", { capital: 8, time: 6, trust: -5, legitimacy: -4, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "임원이 옮길 때마다 옮긴 이유를 공지에 적게 하는 규칙을 제안한다", { legitimacy: 12, trust: 6, capital: -7, humanCost: -3, fatigue: 6 }, { reframing: 3 }],
      ["b", "규칙은 두고 흩어진 동료들의 새 자리 조건만 챙긴다", { capital: 8, time: 6, trust: -5, legitimacy: -7, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "영전한 임원 아래로 옮겨 간 직원들의 이야기를 먼저 모은다", { trust: 10, legitimacy: 7, capital: -6, time: -6, humanCost: 3, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c25_evidence_turn",
    result: "c25_aftershock",
    sourceRoutes: ["c25_notice", "c25_standby", "c25_chatroom", "c25_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 영전 공지 옆에 놓고, 이 자리가 언제 정해졌는지 날짜부터 맞춰 본다.",
    entryEcho: "날짜를 맞추면 공지보다 먼저 쓰인 문서가 보입니다. 그 문서에는 당신의 사번도 있습니다.",
    title: "3월 14일의 이사회",
    speaker: "반재욱",
    text: "단서를 맞추자 KD캐피탈 이사회 의사록(회의에서 무엇을 어떻게 정했는지 적은 공식 기록)이 열립니다. 날짜는 3월 14일. 1호 안건 '신임 대표이사 내정', 2호 안건 '위험관리부 인력 충원 1명, 대표이사 지정'. 두 안건 모두 만장일치이고, 2호 안건의 대상자 칸에 당신의 사번이 적혀 있습니다. 나흘 뒤가 그룹의 주주총회(회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의)였습니다. 반재욱이 수첩에 날짜 두 개를 나란히 적습니다. '표결이 어떻게 나오든 자리는 먼저 정해져 있었습니다. 당신 자리까지요. 한 사람을 옮길 때 옆에 둘 사람까지 같이 정한 겁니다.'",
    memo: ["KD캐피탈 이사회 의사록 -- 3월 14일", "2호 안건 대상자: 당신의 사번", "그룹 주주총회는 나흘 뒤"],
    triggers: ["manipulation", "injustice", "order"],
    entryEffect: { legitimacy: 4, trust: 2, time: -2, fatigue: 3 },
    choices: [
      ["c25_evidence_turn_attach", "의사록을 인사 이의서에 붙여 감사위원회에 낸다", { legitimacy: 12, trust: 4, capital: -7, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
      ["c25_evidence_turn_hold", "의사록은 쥐고 들어가 20층에서 처음 꺼낸다", { capital: 8, time: 4, trust: -5, legitimacy: -3, humanCost: 4, fatigue: -3 }, { risk: 2 }],
      ["c25_evidence_turn_share", "지정된 이유를 알기 전에 다섯 동료에게 의사록부터 보여 준다", { trust: 11, legitimacy: 6, capital: -6, humanCost: -5, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c25_branch_boxes",
    systemNext: "c25_route_system",
    evidenceNext: "c25_evidence_turn",
    routeLabel: "직전 사건의 송별회 연락망으로 33층 이삿짐 소식을 먼저 돌린다",
    systemLabel: "직전 해체 공지의 빈 사유 칸이 영전 공지에도 있는지 본다",
    evidenceLabel: "직전 수신 기록을 붙여 KD캐피탈 이사회 날짜를 맞춘다",
  },
  openingRoutes: {
    c24_after_warm: "c25_start_warm",
    c24_after_record: "c25_start_record",
    c24_after_rush: "c25_start_rush",
  },
  openingCopy: {
    c25_start_warm: ["새벽 네 시의 빈방", "도윤하", "불 꺼진 4층에서 열아홉 명은 끝내 아무도 먼저 계단을 내려가지 않았습니다. 강태민은 컵라면을 두 번 끓였고, 나준혁은 화이트보드의 사건 번호를 하나씩 지우며 사연을 한 줄씩 붙였습니다. 새벽 네 시, 도윤하가 식은 커피 두 잔을 들고 말합니다. '이제 올라가요. 같이요.' 여섯이 비상계단으로 33층까지 오릅니다. 그룹전략실은 불이 반만 켜져 있고, 윤상혁의 방은 문이 열린 채 비어 있습니다. 밤새 기다린 사람은 여기에도 없었습니다. 책상 위에는 오늘 날짜 인사 공지 인쇄본 한 장뿐입니다. 윤상혁 KD캐피탈 대표이사, 그리고 발령(근무지를 옮기라는 인사 명령) 명단 맨 끝에 당신 이름. 도윤하가 커피를 빈 책상에 내려놓습니다. '우리가 밤새 기다리는 동안, 이분은 벌써 다음 자리에 가 계셨네요.'", ["33층 도착 04:00 -- 비상계단, 여섯 명", "윤상혁의 방: 문 열림, 사람 없음", "책상 위 인쇄본: 4월 1일자 인사 공지"]],
    c25_start_record: ["요청서가 도착한 곳", "이민서", "봉인 해제 요청서는 금요일 17시 58분에 접수됐습니다. 해체 2분 전, 트리거랩 참가자 전원의 기록을 본인에게 돌려 달라는 문서입니다. 수신처가 그룹전략실이라 당신은 밤 10시 50분, 접수증을 들고 33층에 오릅니다. 그룹전략실은 불이 반만 켜져 있고 윤상혁의 방은 비어 있습니다. 대신 책상 위에 당신의 요청서가 놓여 있습니다. 첫 장에 새 도장이 찍혀 있습니다. '이관(서류를 다른 부서로 넘겨 맡기는 것): KD캐피탈 대표이사실.' 그 옆에 내일 날짜 인사 공지 인쇄본이 있습니다. 윤상혁 KD캐피탈 대표이사. 발령(근무지를 옮기라는 인사 명령) 명단 맨 끝에 당신 이름. 이민서에게서 문자가 옵니다. '요청서가 그분을 따라가네요. 이번엔 받는 사람 칸에 이름이 있어요.'", ["봉인 해제 요청서 접수 17:58 -- 해체 2분 전", "요청서 첫 장 도장: KD캐피탈 대표이사실로 넘김", "책상 위 인쇄본: 4월 1일자 인사 공지"]],
    c25_start_rush: ["18시 4분의 빈방", "백아린", "불이 꺼지고 4분 뒤, 당신은 휴대폰을 쥔 채 33층에 내립니다. 출입 권한은 정말로 살아 있었습니다. 그룹전략실은 불이 다 켜져 있고 윤상혁의 방 문도 열려 있습니다. 그런데 방이 비어 있습니다. 책상 위 찻잔에서 김이 아직 조금 오릅니다. 자기 자리에서 상자를 싸던 백아린이 일어섭니다. '방금 내려가셨어요. 화물 엘리베이터로요. 문자 보내시고 바로요.' 당신이 탄 엘리베이터와 그가 탄 엘리베이터가 어느 층에선가 엇갈렸습니다. 책상 한가운데 내일 날짜 인사 공지 인쇄본이 남아 있습니다. 윤상혁 KD캐피탈 대표이사. 발령(근무지를 옮기라는 인사 명령) 명단 맨 끝에 당신 이름. 백아린이 쓴웃음을 짓습니다. '올라오라고 해 놓고 먼저 내려가신 거예요. 이 층에서는 그걸 초대라고 불러요.'", ["33층 도착 18:04 -- 출입 권한 유지", "찻잔 온기, 화물 엘리베이터 하행", "책상 위 인쇄본: 4월 1일자 인사 공지"]],
  },
  openingSignatures: {
    c25_start_warm: {
      label: "밤새 함께한 다섯에게 빈방을 보여 주고 아침까지 곁을 지킨다",
      effect: { trust: 10, humanCost: -3, time: -5, capital: -2, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "밤새 함께한 다섯에게 빈방을 보여 주고, 아침까지 곁을 지킨다.",
      echo: "빈방을 같이 본 사람들은 화를 나눠 가집니다. 해가 뜰 무렵 한서윤이 윤상혁의 명패를 바로 세워 놓고 나옵니다.",
    },
    c25_start_record: {
      label: "도장 찍힌 요청서를 그 자리에서 찍어 모두에게 보낸다",
      effect: { legitimacy: 10, trust: 4, time: -4, capital: -3, humanCost: 2, fatigue: 3 },
      cognition: { inference: 2 },
      voice: "도장 찍힌 요청서를, 그 자리에서 찍어 모두에게 보낸다.",
      echo: "사진은 여섯 휴대폰에 남습니다. 요청서 원본은 월요일 아침 KD캐피탈 20층 문서함으로 옮겨집니다.",
    },
    c25_start_rush: {
      label: "엇갈린 엘리베이터 운행 기록을 경비실에서 받아 둔다",
      effect: { legitimacy: 9, capital: 3, time: -4, trust: -2, humanCost: 2, fatigue: 3 },
      cognition: { persistence: 1, inference: 1 },
      voice: "엇갈린 엘리베이터의 운행 기록을, 경비실에서 받아 둔다.",
      echo: "기록에는 18시 1분 화물 엘리베이터 하행이 찍혀 있습니다. 문자를 보낸 시각보다 1분 빠릅니다.",
    },
  },
  voiceLines: {
    // CASE 25. The first week apart. Every line is said to someone who has just
    // been moved, so none of them may sound like a farewell speech.
    c25_start_call: "인쇄본을 찍어, 이름이 오른 동료들에게 오늘 밤 먼저 알린다.",
    c25_start_log: "빈방과 인쇄본을, 백아린의 확인과 함께 기록으로 남긴다.",
    c25_start_seat: "인쇄본을 챙겨 나와, 공지가 뜨기 전에 수를 먼저 짠다.",
    c25_notice_call: "짐보다 먼저, 한서윤에게 전화해 곁에 있겠다고 말한다.",
    c25_notice_ask: "사유 없는 대기발령에, 인사부의 공식 설명을 요구한다.",
    c25_notice_load: "공지는 공지대로 두고, 트럭부터 오늘 안에 채운다.",
    c25_standby_sit: "오늘은 옆 책상에 앉아, 계획서 열 장을 같이 채운다.",
    c25_standby_rule: "대기 기간과 사유를, 서면으로 받아 내는 절차부터 밟는다.",
    c25_standby_leave: "오래 머물면 서로 표적이 된다며, 짧게 인사만 하고 나온다.",
    c25_branch_boxes_a: "백아린 곁에 남아, 떠나기 전 무엇이 두려운지 먼저 듣는다.",
    c25_branch_boxes_b: "파쇄 자루가 나가기 전에, 반출 목록부터 만들어 달라고 요청한다.",
    c25_branch_boxes_c: "자루 하나를 열어 볼 수 있는지, 이삿짐 직원에게 슬쩍 묻는다.",
    c25_branch_boxes_follow_a: "데려가는 이유를 알기 전까지, 백아린의 이름은 어디에도 쓰지 않는다.",
    c25_branch_boxes_follow_b: "내정 메일을, 3월 14일 발송일 그대로 문서로 확보해 둔다.",
    c25_branch_boxes_follow_c: "그 자리가 미끼라면, 먼저 물고 들어가 속을 본다.",
    c25_chatroom_tuesday: "'화요일 점심'으로 정하고, 안부부터 지키는 방으로 둔다.",
    c25_chatroom_log: "'4층'으로 정하고, 매일 본 것을 날짜와 함께 적는 방으로 만든다.",
    c25_chatroom_toast: "'내일도 출근합시다'로 정하고, 강태민까지 불러 웃고 끝낸다.",
    c25_final_share: "들어가되, 20층에서 본 것을 매일 단체방에 나눈다.",
    c25_final_refuse: "대표이사 직속 자리를 거부하고, 인사 이의를 낸다.",
    c25_final_enter: "윤상혁 아래로 들어가, 월요일 첫 안건부터 곁에서 본다.",
    c25_after_warm: "벚꽃길 끝까지 여섯이 함께 걷고, 월요일은 월요일에 연다.",
    c25_after_record: "흩어진 여섯 자리에서 첫 주에 본 것을, 한 문서로 묶어 둔다.",
    c25_after_rush: "메일을 열자마자, 그 밤에 곧장 평택 현장으로 차를 몬다.",
    c25_route_system_publish: "14건의 영전 공지를 나란히 묶어, 동료들과 먼저 나눈다.",
    c25_route_system_file: "사유 칸이 빈 인사 공지를, 감사위원회에 정식으로 묻는다.",
    c25_route_system_keep: "통계는 쥐고 있다가, 윤상혁 앞에서 처음 꺼낸다.",
    c25_final_system_route_a: "임원이 옮길 때마다, 옮긴 이유를 공지에 적게 하는 규칙을 제안한다.",
    c25_final_system_route_b: "규칙은 두고, 흩어진 동료들의 새 자리 조건만 챙긴다.",
    c25_final_system_route_c: "영전한 임원 아래로 옮겨 간 직원들의, 이야기를 먼저 모은다.",
    c25_evidence_turn_attach: "의사록을 인사 이의서에 붙여, 감사위원회에 낸다.",
    c25_evidence_turn_hold: "의사록은 쥐고 들어가, 20층에서 처음 꺼낸다.",
    c25_evidence_turn_share: "지정된 이유를 알기 전에, 다섯 동료에게 의사록부터 보여 준다.",
  },
  echoReplies: {
    // CASE 25.
    c25_start_call: "알리면 다섯 개의 답장이 자정 전에 옵니다. 한서윤의 답장만 '알고 있었어요' 한 줄입니다.",
    c25_start_log: "기록으로 남기면 백아린이 확인란에 서명합니다. 사표를 낸 사람의 서명이 이 층에서 받는 마지막 서명입니다.",
    c25_start_seat: "먼저 수를 짜면 토요일 아침 공지가 놀랍지 않습니다. 놀라지 않은 사람은 당신 하나뿐이라 동료들과 표정이 어긋납니다.",
    c25_notice_call: "전화를 걸면 한서윤은 세 번째 신호에 받습니다. '짐은요?' '강태민 씨가 들었어요.' 그가 처음으로 웃습니다.",
    c25_notice_ask: "설명 요구서는 접수됩니다. 답변 기한 칸에는 '대기 기간 종료 시'라고 적혀 옵니다.",
    c25_notice_load: "트럭은 정오 전에 찹니다. 한서윤의 상자 하나가 주인 없이 짐칸 맨 안쪽에 실립니다.",
    c25_standby_sit: "같이 채우면 계획서 열 장이 오후 네 시에 끝납니다. 마지막 장 제목은 '다음에는 기록을 누구에게 돌려줄 것인가'입니다.",
    c25_standby_rule: "서면을 요구하면 인사부가 대기 기간 칸에 '미정'이라고 적어 보냅니다. 미정도 문서가 되면 날짜가 붙습니다.",
    c25_standby_leave: "짧게 나오면 둘 다 덜 눈에 띕니다. 한서윤은 그날 계획서 첫 장을 끝내 채우지 못합니다.",
    c25_branch_boxes_a: "곁에 남으면 백아린은 파쇄 자루 대신 자기 사원증을 한참 봅니다. '저는 이 층에서 좋은 이야기만 만들었어요.'",
    c25_branch_boxes_b: "목록을 요청하면 세 시 반출이 다섯 시로 밀립니다. 그 두 시간 동안 자루 일곱 개에 번호가 붙습니다.",
    c25_branch_boxes_c: "이삿짐 직원은 어깨를 으쓱합니다. 자루는 열리지만, 그 장면을 복도 끝 카메라가 봅니다.",
    c25_branch_boxes_follow_a: "이름을 쓰지 않으면 백아린은 2주를 조용히 버팁니다. 메일의 출처를 묻는 질문은 전부 당신에게 옵니다.",
    c25_branch_boxes_follow_b: "문서로 확보하면 날짜는 움직이지 않습니다. 대신 백아린의 메일함에 열람 기록이 한 줄 남습니다.",
    c25_branch_boxes_follow_c: "미끼를 물면 속이 보입니다. 동시에 당신도 그 속의 일부가 됩니다.",
    c25_chatroom_tuesday: "안부방이 되면 첫 메시지는 도윤하의 김밥 사진입니다. 두 번째 메시지는 한서윤의 '저 오늘 할 일 없어요'입니다.",
    c25_chatroom_log: "기록방이 되면 첫날부터 여섯 줄이 쌓입니다. 한서윤의 줄은 '7층, 벽, 볼펜 1자루'입니다.",
    c25_chatroom_toast: "강태민이 초대되자마자 '출근 확인'을 올립니다. 반재욱이 기차 안에서 소리 내어 웃다가 옆자리에 사과합니다.",
    c25_final_share: "들어가되 나누면 20층의 일이 매일 밤 여섯 사람에게 퍼집니다. 그 단체방이 언젠가 증거가 될지 짐이 될지는 아직 모릅니다.",
    c25_final_refuse: "이의를 내면 인사부는 대기발령을 한 칸 더 준비합니다. 7층 방의 벽을 보는 책상이 하나 더 채워질 수 있습니다.",
    c25_final_enter: "곁에서 보면 가장 많이 보입니다. 윤상혁도 가장 가까이에서 당신을 봅니다.",
    c25_after_warm: "여섯이 끝까지 걸으면 벚꽃길이 생각보다 짧습니다. 평택 메일은 월요일 아침까지 읽지 않은 채로 기다립니다.",
    c25_after_record: "한 문서로 묶으면 흩어진 여섯 자리가 한 장의 지도가 됩니다. 그 지도의 한가운데에 평택이 있습니다.",
    c25_after_rush: "곧장 가면 새벽 두 시에 현장에 닿습니다. 타워크레인 위의 불빛이 당신 차의 전조등을 먼저 봅니다.",
    c25_route_system_publish: "나누면 동료들이 자기 발령 공지를 다시 엽니다. 여섯 장 모두 사유 칸이 비어 있습니다.",
    c25_route_system_file: "질의는 접수됩니다. 감사위원회 위원 세 명 중 두 명이 영전한 임원의 대학 동기입니다.",
    c25_route_system_keep: "쥐고 있으면 20층에서 강한 패가 됩니다. 그사이 열네 번째 공지는 열다섯 번째를 기다립니다.",
    c25_final_system_route_a: "규칙이 생기면 다음 영전 공지에는 이유가 한 줄 적힙니다. 윤상혁의 공지에는 끝내 적히지 않습니다.",
    c25_final_system_route_b: "동료들의 새 자리 조건은 좋아집니다. 사유 칸은 그대로 비어 있습니다.",
    c25_final_system_route_c: "모으면 열네 개 회사에서 같은 이야기가 옵니다. '대표가 바뀐 첫 달, 우리 팀이 없어졌어요.'",
    c25_evidence_turn_attach: "붙이면 이의서는 날짜로 말합니다. 감사위원회는 답변 기한을 한 달 뒤로 잡습니다.",
    c25_evidence_turn_hold: "쥐고 들어가면 월요일 20층에서 먼저 꺼낼 패가 생깁니다. 그 패를 쥔 채 첫 안건에 서명을 요구받을 수도 있습니다.",
    c25_evidence_turn_share: "보여 주면 다섯 동료가 당신의 사번을 봅니다. 오진우가 먼저 말합니다. '데려간 거면, 우리가 데리러 가면 되죠.'",
  },
  characterProfiles: {
    채이안: {
      role: "KD캐피탈 위험관리부 부장 · 17년 차",
      stance: "냉소 · 관찰 · 경고",
      job: "위험이 누구 이름으로 적히는지 정하는 부서에서, 적히지 않은 이름을 연필로 따로 적어 둔다.",
      appearance: "소매를 두 번 접은 회색 셔츠, 귀에 꽂은 HB 연필, 책상 위 벚나무 사진 달력.",
      thought: "나는 이 회사 대표를 세 명 모셨다. 다들 창가 자리를 좋아했고, 다들 그 자리에 자기 사람을 앉혔다.",
      gesture: "채이안은 중요한 말을 할 때 귀에 꽂은 연필을 빼서 책상 위에 눕혀 놓는다.",
      voice: "낮고 건조하게 말하고, 농담처럼 들리는 경고로 문장을 끝낸다.",
      line: "첫 주는 창밖을 보세요. 둘째 주부터는 못 봅니다.",
    },
  },
  setting: { place: "KD금융그룹 본사 33층 그룹전략실", clock: "3월 31일 · 금요일 21:40" },
  sceneContext: {
    c25_start: {
      place: "KD금융그룹 본사 33층 · 그룹전략실",
      clock: "3월 31일 · 금요일 21:40",
      question: "빈방의 책상 위에 당신 이름이 적힌 인사 공지가 놓여 있습니다. 이 종이를 어떻게 하겠습니까?",
      lead: "트리거랩의 불이 꺼지고 '올라오게'라는 문자가 온 밤, 33층 엘리베이터가 한 번도 서지 않고 올라갑니다.",
    },
    c25_start_warm: {
      place: "KD금융그룹 본사 33층 · 그룹전략실",
      clock: "4월 1일 · 토요일 새벽 04:00",
      question: "밤새 기다린 동료들과 빈방 앞에 섰습니다. 이 새벽을 어떻게 끝내겠습니까?",
      lead: "불 꺼진 4층에서 밤을 새운 여섯이, 해 뜨기 전에 비상계단으로 33층을 오릅니다.",
    },
    c25_start_record: {
      place: "KD금융그룹 본사 33층 · 그룹전략실",
      clock: "3월 31일 · 금요일 22:50",
      question: "당신의 요청서가 윤상혁을 따라 새 회사로 넘어갔습니다. 그 도장을 어떻게 하겠습니까?",
      lead: "해체 2분 전에 접수된 요청서의 수신처를 따라, 접수증을 들고 33층에 오릅니다.",
    },
    c25_start_rush: {
      place: "KD금융그룹 본사 33층 · 그룹전략실",
      clock: "3월 31일 · 금요일 18:04",
      question: "올라오라던 사람이 당신과 엇갈려 내려갔습니다. 그 엇갈림을 어떻게 증명하겠습니까?",
      lead: "불이 꺼지자마자 누른 33층 버튼은 아직 눌렸고, 문이 열린 층에는 김이 오르는 찻잔만 남아 있습니다.",
    },
    c25_notice: {
      place: "트리거랩 건물 앞 · 골목 이삿짐 트럭",
      clock: "4월 1일 · 토요일 10시 · 벚꽃",
      question: "만우절 아침의 인사 공지에서 한서윤의 이름 옆만 비어 있습니다. 무엇부터 하겠습니까?",
      lead: "출입 권한이 사라진 건물 앞, 토요일 아침 골목에 이삿짐 트럭 한 대가 후진해 들어옵니다.",
    },
    c25_photo: {
      place: "트리거랩 건물 앞 · 벚나무 아래 골목",
      clock: "4월 1일 · 토요일 11시 30분 · 벚꽃",
      question: "마지막 단체 사진의 앞줄 가운데가 비어 있습니다. 그 빈자리를 어떻게 하겠습니까?",
    },
    c25_photo_reaction: {
      place: "트리거랩 건물 앞 · 트럭이 떠난 골목",
      clock: "4월 1일 · 토요일 12시 10분",
      question: "오진우의 새 자리가 KD캐피탈의 부실 대출을 사려는 쪽이라고 합니다. 어떻게 하겠습니까?",
    },
    c25_standby: {
      place: "KD금융그룹 본사 7층 · 복도 끝 대기실",
      clock: "4월 3일 · 월요일 09시",
      question: "벽을 보는 책상에서 한서윤이 계획서 첫 장을 채우지 못합니다. 이 방에서 무엇을 하겠습니까?",
      lead: "한서윤이 보낸 문자에는 층수와 방 번호만 적혀 있었습니다. 7층 복도 끝, 문패 없는 문입니다.",
    },
    c25_branch_boxes: {
      place: "KD금융그룹 본사 33층 · 그룹전략실 복도",
      clock: "4월 3일 · 월요일 11시",
      question: "윤상혁의 방에서 나온 파쇄 자루가 목록 없이 오늘 오후에 나갑니다. 어떻게 하겠습니까?",
    },
    c25_branch_boxes_follow: {
      place: "KD금융그룹 본사 33층 · 백아린의 자리",
      clock: "4월 3일 · 월요일 11시 40분",
      question: "당신의 자리가 주주 표결보다 먼저 정해져 있었습니다. 그 메일을 어떻게 다루겠습니까?",
    },
    c25_lunchbox: {
      place: "여의도 윤중로 · 벚나무 아래 골목",
      clock: "4월 4일 · 화요일 12시 · 벚꽃 절정",
      question: "다음 주부터는 모일 핑계가 없다고 도윤하가 말합니다. 어떤 핑계를 만들겠습니까?",
    },
    c25_lunchbox_reaction: {
      place: "여의도 윤중로 · 돗자리를 접는 골목",
      clock: "4월 4일 · 화요일 12시 50분 · 벚꽃",
      question: "트리거랩 폴더를 매주 여는 외부 계정이 있다고 이민서가 말합니다. 이민서에게 무엇을 부탁하겠습니까?",
    },
    c25_chatroom: {
      place: "서울역 · KTX 승강장",
      clock: "4월 5일 · 수요일 21시",
      question: "여섯 명 단체방의 이름이 3 대 3으로 갈렸고, 마지막 한 표가 당신에게 왔습니다. 무엇으로 정하겠습니까?",
      lead: "지방 순회 첫 행선지로 떠나는 반재욱을 배웅하러, 흩어진 여섯이 서울역 승강장에 모입니다.",
    },
    c25_firstday: {
      place: "KD캐피탈 본사 12층 · 위험관리부 회의실",
      clock: "4월 6일 · 목요일 09시 · 벚꽃",
      question: "첫 출근 날, 멈춘 평택 공사 파일이 책상에 놓였습니다. 무엇부터 보겠습니까?",
    },
    c25_firstday_reaction: {
      place: "군산 · 감사팀 숙소 방",
      clock: "4월 6일 · 목요일 23:00",
      question: "여섯 명 중 당신의 사유서에만 요청 부서가 적혀 있습니다. 그 둘째 줄을 어떻게 하겠습니까?",
    },
    c25_route_system: {
      place: "KD캐피탈 본사 · 그룹 업무 앱",
      clock: "4월 초",
      question: "문제가 된 임원 열넷이 모두 영전했고 사유 칸은 비어 있습니다. 이 통계를 어떻게 쓰겠습니까?",
    },
    c25_final_system_route: {
      place: "KD캐피탈 본사 · 그룹 업무 앱",
      clock: "4월 6일 · 목요일 새벽",
      question: "사람을 옮기는 공지의 모양을 하나 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c25_evidence_turn: {
      place: "KD캐피탈 본사 · 이사회 문서 보관소",
      clock: "4월 7일 · 금요일 07시",
      question: "주주 표결 나흘 전 이사회가 당신의 사번까지 정해 두었습니다. 이 의사록을 어떻게 쓰겠습니까?",
    },
    c25_final: {
      place: "KD캐피탈 본사 · 1층 로비 취임식장",
      clock: "4월 7일 · 금요일 10시 · 벚꽃",
      question: "오지 않았던 사람이 이제 곁에 있으라며 손을 내밉니다. 그 자리에 어떻게 들어가겠습니까?",
      lead: "금요일 오전, 위험관리부 전원이 취임식 자리를 채우러 1층 로비로 내려갑니다. 창가 자리의 주인도 그 줄에 섭니다.",
    },
    c25_aftershock: {
      place: "여의도 윤중로 · 벚꽃 지는 골목",
      clock: "4월 7일 · 금요일 23:10 · 벚꽃",
      question: "흩어진 첫 주가 끝난 밤, 평택 현장의 메일이 도착했습니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c25-march14-board",
    title: "3월 14일의 내정",
    text: "윤상혁의 KD캐피탈 대표이사 자리는 주주총회 나흘 전 이사회에서 이미 정해져 있었습니다. 같은 회의의 2호 안건은 대표이사가 지정한 위험관리부 충원 1명이었고, 대상자 칸에는 당신의 사번이 적혀 있었습니다.",
  },
  outcomes: {
    c25_after_warm: { tag: "끝까지 걸은 결말", title: "벚꽃길 끝까지 여섯이 함께 걸었다", text: "흩어진 첫 주의 끝에서 여섯은 다시 한 줄로 걸었습니다. 평택 현장의 메일은 월요일 아침까지 읽지 않은 채로 기다렸습니다." },
    c25_after_record: { tag: "지도로 묶은 결말", title: "흩어진 여섯 자리가 한 장의 지도가 됐다", text: "강서지점, KD데이터랩, 군산, 브릿지은행, 7층 대기실, 그리고 20층. 첫 주에 각자 본 것을 한 문서로 묶자 그 가운데에 평택이 있었습니다." },
    c25_after_rush: { tag: "곧장 달려간 결말", title: "메일을 연 그 밤에 평택으로 차를 몰았다", text: "벚꽃길에 동료들을 남겨 두고 당신은 고속도로에 올랐습니다. 새벽 두 시, 타워크레인 위의 불빛이 먼저 당신을 봤습니다." },
  },
  carryovers: {
    c25_after_warm: { trust: 8, humanCost: -5, fatigue: -7 },
    c25_after_record: { legitimacy: 12, trust: 2, fatigue: 4 },
    c25_after_rush: { capital: 5, legitimacy: 4, trust: -8 },
  },
  continuityChallenges: {
    c24_after_warm: { id: "protect-trust", title: "밤새 기다린 사람들 곁에 남기", text: "불 꺼진 4층에서 밤을 함께 새운 동료들과 33층의 빈방을 같이 봤습니다. 흩어지는 첫 주에 그 사람들을 혼자 두지 않는 선택을 찾아야 보너스가 열립니다." },
    c24_after_record: { id: "use-reframe", title: "요청서가 따라간 곳을 다시 읽기", text: "기록을 돌려 달라는 요청서가 윤상혁을 따라 새 회사로 넘어갔습니다. 받는 사람 칸에 이름이 생겼다는 사실을 어떻게 쓸지 판을 다시 짜야 합니다." },
    c24_after_rush: { id: "repair-legitimacy", title: "엇갈린 엘리베이터의 공정함 회복하기", text: "곧장 올라간 33층에서 올라오라던 사람과 엇갈렸습니다. 그 엇갈림을 혼자의 분노가 아니라 누구나 확인할 수 있는 기록으로 바꾸는 선택을 찾아야 합니다." },
  },
};
