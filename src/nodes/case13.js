/**
 * CASE 13 -- the face of the reform, and the door into act three.
 *
 * Twelve cases took the loan from collapse to compensation. The hearing named
 * the chain and the fund paid the first people it landed on; the 33rd floor
 * called afterwards to talk about the empty signature line. It does not. 윤상혁
 * makes an offer instead: the group is launching a "KD 혁신위원회" to turn the
 * public mood after the hearing, and it wants the one person who wrote the
 * dissent as its outside member and advertising face. The price is one line at
 * the end of the script -- "과거는 모두 정리되었습니다" -- and the reward is real:
 * the 212 are written into the compensation standard and every colleague in the
 * lab goes back to a regular department.
 *
 * Act three ("사슬은 반복된다") opens on the same method the season has been
 * fighting -- push from above, leave the signature line blank -- dressed as
 * reform. The case introduces 백아린, the committee's secretary and 윤상혁's right
 * hand, who believes a good story outlives the facts. The emotional range stays
 * wide: seventeen takes in a 성수동 studio where 나준혁's stamping hand nearly
 * steals the lead and 강태민 moves the light stands alone; the trailer caption
 * that lands on 문가을's shop TV; the colleagues' one-minute "real script" shot on
 * their phones. The evidence turn finds the committee budget and the lab's
 * closure costs under one cost code, and the aftermath points at the "상생"
 * product that becomes 사건 14.
 */
export const case13Nodes = {
  c13_start: {
    phase: "CASE 13 BRIEFING",
    title: "과거는 정리됐다고",
    speaker: "윤상혁",
    text:
      "추석 연휴가 끝난 첫 출근일, 본사 33층 그룹전략실. 서명란 얘기를 하자던 윤상혁은 서명란을 꺼내지 않습니다. 대신 태블릿을 밀어 줍니다. 'KD 혁신위원회' 출범 계획서, 외부 공개 위원 명단 맨 위에 당신 이름이 있습니다. '국정감사(국회가 공개적으로 따져 묻는 자리) 뒤로 사람들은 얼굴을 원하네. 반대 의견을 썼던 사람이, 과거는 정리됐다고 말해 주는 얼굴.' 대가는 두 줄입니다. 212명 배상 기준 확정, 트리거랩 동료 전원 정규 부서 복귀. 창가에 서 있던 여자가 명함을 내밉니다. 그룹전략실 차장 백아린, 혁신위원회 간사. '촬영은 금요일, 생중계는 다음 주 수요일이에요. 대본은 제가 썼고요. 좋은 이야기는 사실보다 오래 가거든요.' 윤상혁이 펜 뚜껑을 닫습니다. '이번엔 서명란이 아니라 출연 계약서네. 칸은 하나야.'",
    memo: [
      "KD 혁신위원회 -- 외부 공개 위원 5명, 광고 얼굴 1명",
      "대가: 212명 배상 기준 확정 + 트리거랩 동료 전원 정규 부서 복귀",
      "조건: 반대 의견을 쓴 사람이 '과거는 정리됐다'고 말할 것",
      "출범 캠페인 생중계까지 D-6",
    ],
    triggers: ["manipulation", "responsibility", "choice"],
    choices: [
      {
        id: "c13_start_colleagues",
        label: "동료들에게 이 제안을 대가까지 그대로 먼저 알린다",
        effect: { trust: 12, humanCost: -5, time: -4, capital: -3, fatigue: 4 },
        next: "c13_studio",
        cognition: { persistence: 2 },
      },
      {
        id: "c13_start_read",
        label: "혁신위원회 계획서와 출연 계약서를 한 줄씩 읽는다",
        effect: { legitimacy: 11, time: -4, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c13_studio",
        cognition: { inference: 2 },
      },
      {
        id: "c13_start_accept",
        label: "대가부터 확정받겠다며 그 자리에서 출연을 수락한다",
        effect: { capital: 9, time: 6, legitimacy: -4, trust: -3, humanCost: 2, fatigue: -2 },
        next: "c13_studio",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c13_studio",
      },
    ],
  },
  c13_studio: {
    phase: "THE SET",
    title: "NG 열일곱 번",
    speaker: "신이안",
    text:
      "금요일 오후, 성수동 광고 스튜디오. 구경을 따라온 동료들까지 촬영장에 섰습니다. 크로마키(초록 벽 앞에서 찍고 배경은 나중에 합성하는 방식) 벽 앞에서 NG가 열일곱 번 납니다. 웃는 얼굴이 '인질 같다'는 이유로 다섯 번, 'KD'가 '캐디'로 들린다는 이유로 세 번. 카메오(짧게 얼굴만 비추는 출연)로 불려 온 영동지점장 나준혁은 도장 찍는 장면을 한 번에 끝냅니다. 30년 손목이라 도장이 종이에 앉는 소리까지 깨끗합니다. 신이안 감독이 모니터에 얼굴을 붙입니다. '주인공, 저분으로 바꾸면 안 될까요?' 조명팀이 늦자 강태민이 스탠드 네 개를 혼자 옮겨 놓습니다. 열여덟 번째 테이크, 프롬프터(읽을 문장을 렌즈 앞에 띄워 주는 화면)에 마지막 줄이 올라옵니다. '과거는 모두 정리되었습니다.'",
    memo: [
      "NG 17회 -- 표정 5회, 'KD' 발음 3회",
      "카메오 나준혁: 도장 장면 1회 만에 통과",
      "조명 스탠드 4개 -- 운반 강태민 단독",
      "대본 마지막 줄: '과거는 모두 정리되었습니다'",
    ],
    triggers: ["injustice", "manipulation", "competition"],
    choices: [
      {
        id: "c13_studio_meet",
        label: "촬영을 멈추고 이 광고에 나오는 사람들부터 만나 본다",
        effect: { trust: 12, humanCost: -5, legitimacy: 3, time: -4, capital: -3, fatigue: 4 },
        next: "c13_market",
        cognition: { persistence: 1, reframing: 1 },
      },
      {
        id: "c13_studio_basis",
        label: "마지막 문장이 무슨 근거로 쓰였는지 서면 답변을 요구한다",
        effect: { legitimacy: 12, trust: -3, time: -6, humanCost: 3, fatigue: 4 },
        next: "c13_market",
        cognition: { inference: 2 },
      },
      {
        id: "c13_studio_read",
        label: "일단 읽어 주고 편집 단계에서 빼 달라고 한다",
        effect: { time: 6, capital: 7, trust: -4, legitimacy: -2, humanCost: 2, fatigue: -3 },
        next: "c13_market",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c13_market",
      },
    ],
  },
  c13_market: {
    phase: "THE TRAILER",
    title: "15초",
    speaker: "문가을",
    text:
      "촬영 사흘 뒤 저녁 8시, 가을떡방 구석 TV에서 15초짜리 예고편이 나갑니다. 초록 벽은 지워지고 파란 하늘이 합성돼 있습니다. 화면 속 당신이 웃습니다. 마지막 문장을 소리 내 읽었든 아니든, 편집실은 그 얼굴 위에 자막을 얹었습니다. '과거는 모두 정리되었습니다.' 떡을 썰던 문가을의 칼이 멈춥니다. 문하준이 리모컨을 찾다 못 찾고 TV 전원 코드를 뽑습니다. 한참 뒤 문가을이 말합니다. '정리됐구나. 우리 남편도.' 그가 선반 위 남편 사진 옆에 붙여 둔 당신 명함을 떼어 앞치마 주머니에 넣습니다. '서운해서 그러는 거 아니에요. 모임 사람들이 볼까 봐요.' 문하준이 묻습니다. '그거, 진짜 하시는 거예요?'",
    memo: [
      "예고편 15초 -- 저녁 뉴스 광고 시간 첫 방송",
      "자막: '과거는 모두 정리되었습니다'",
      "문가을이 선반에서 당신 명함을 뗌",
      "피해자 모임 단체방 메시지 340개 -- 1시간 만에",
    ],
    triggers: ["helplessness", "affection", "selfAwareness"],
    choices: [
      {
        id: "c13_market_stay",
        label: "변명하지 않고 셔터를 내릴 때까지 문가을 옆에서 떡을 썬다",
        effect: { trust: 12, humanCost: -5, time: -4, capital: -2, fatigue: 5 },
        next: "c13_lab",
        cognition: { persistence: 2 },
      },
      {
        id: "c13_market_correct",
        label: "자막이 촬영 원본과 다르다는 정정 요청을 공식으로 낸다",
        effect: { legitimacy: 12, trust: 2, time: -6, humanCost: 2, fatigue: 4 },
        next: "c13_lab",
        cognition: { inference: 2 },
      },
      {
        id: "c13_market_deal",
        label: "212명 배상이 걸린 일이니 예고편은 참아 달라고 부탁한다",
        effect: { capital: 8, time: 5, trust: -4, humanCost: 3, legitimacy: -1, fatigue: -3 },
        next: "c13_lab",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c13_lab",
      },
    ],
  },
  c13_lab: {
    phase: "THE REAL SCRIPT",
    title: "진짜 대본",
    speaker: "이민서",
    text:
      "생중계 전날 밤, 트리거랩 4층. 이민서가 노트북을 돌려 동료들이 폰으로 찍은 1분짜리 '진짜 대본'을 틉니다. 도윤하가 말합니다. '서류가 없는 31명, 아직 기다립니다.' 반재욱이 수첩을 펼칩니다. '적힌 이름 47개. 정리된 이름 0개.' 권도현은 계산기를 들어 보입니다. '제작비 11억이면 31명 몫이 나옵니다. 적자입니다.' 나준혁은 사흘 걸려 새긴 도장을 꾹 찍습니다. '미정리.' 강태민은 한 줄입니다. '안 끝났습니다.' 오진우는 NG 없이 간다더니 다섯 번 만에 성공했고, 이민서는 그 다섯 번을 엔딩 크레디트 뒤에 전부 붙였습니다. 마지막 화면은 모두의 목소리입니다. '과거는 정리되지 않았습니다. 그래서 우리가 여기 있습니다.' 이민서가 묻습니다. '이거, 어디에 쓸 거예요?'",
    memo: [
      "'진짜 대본' 영상 1분 04초 -- 휴대폰 7대로 촬영",
      "나준혁의 새 도장: '미정리'",
      "오진우 NG 5회 -- 엔딩 크레디트 뒤에 수록",
      "생중계 송출 순서표가 이민서의 옛 부서 시스템에 있음",
    ],
    triggers: ["trust", "affection", "recognition"],
    choices: [
      {
        id: "c13_lab_share",
        label: "영상을 문가을과 피해자 모임에 먼저 보낸다",
        effect: { trust: 13, humanCost: -5, legitimacy: 2, time: -4, capital: -2, fatigue: 5 },
        next: "c13_final",
        cognition: { reframing: 2 },
      },
      {
        id: "c13_lab_submit",
        label: "영상을 수정 대본으로 혁신위원회에 정식 제출한다",
        effect: { legitimacy: 11, trust: 4, time: -5, humanCost: 3, fatigue: 4 },
        next: "c13_final",
        cognition: { inference: 1, persistence: 1 },
      },
      {
        id: "c13_lab_cue",
        label: "생방송 중에 영상이 나가도록 송출 순서를 몰래 바꿔 둔다",
        effect: { capital: 4, time: 5, trust: 6, legitimacy: -5, humanCost: 2, fatigue: -3 },
        next: "c13_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c13_final",
      },
    ],
  },
  c13_final: {
    phase: "FINAL DECISION",
    title: "프롬프터의 마지막 줄",
    speaker: "백아린",
    text:
      "수요일 저녁 7시 59분, 성수동 스튜디오 생방송 세트장. 세트 뒤 모니터에서 동시 접속자 숫자가 올라갑니다. 4만, 7만, 11만. 백아린이 인이어(귀에 꽂아 연출 지시를 듣는 작은 수신기)를 건넵니다. '마지막 줄은 그대로예요. 읽으시면 212명 배상 기준 확정 공문이 9시에 나가고, 동료분들은 월요일에 원래 자리로 돌아가요.' 스튜디오 뒷벽에 트리거랩 사람들이 방청객처럼 서 있습니다. 강태민은 자기가 옮긴 조명 스탠드 옆에, 나준혁은 '미정리' 도장을 쥔 채. 문가을은 오지 않았습니다. 맨 뒷줄에서 교복 차림의 문하준이 스케치북을 안고 있습니다. 신이안 감독이 손가락을 접습니다. 다섯, 넷, 셋. 프롬프터에 첫 줄이 뜹니다.",
    memo: [
      "생중계 동시 접속 11만 명",
      "읽으면: 212명 배상 기준 확정 공문 21시 발송",
      "동료 복귀 발령 월요일 -- 같은 날 트리거랩 4층을 비움",
      "이 선택은 시즌 3막의 첫 문장이 됨",
    ],
    triggers: ["choice", "manipulation", "responsibility"],
    choices: [
      {
        id: "c13_final_terms",
        label: "위원 자리는 받되 마지막 문장을 빼야 앉겠다고 조건을 건다",
        effect: { trust: 8, legitimacy: 8, capital: -5, time: -5, humanCost: -3, fatigue: 5 },
        next: "case13_result",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c13_final_refuse",
        label: "카메라 앞에서 제안과 대가를 밝히고 자리를 거절한다",
        effect: { legitimacy: 13, trust: 9, capital: -11, time: -7, humanCost: 4, fatigue: 7 },
        next: "case13_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c13_final_rewrite",
        label: "받아 두고 생방송에서 마지막 문장을 바꿔 읽는다",
        effect: { capital: 6, time: 5, trust: 10, legitimacy: -4, humanCost: 3, fatigue: -2 },
        next: "case13_result",
        cognition: { risk: 2, reframing: 1 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case13_result",
      },
    ],
  },
};

/**
 * Everything else case 13 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case13 = {
  id: "case13",
  nodes: case13Nodes,
  aftermath: {
    c13_aftershock: {
      phase: "AFTERMATH",
      title: "불이 꺼진 세트장",
      speaker: "백아린",
      text: "방송이 끝나고 12분 뒤, 당신이 마지막에 한 말이 클립으로 잘려 돌기 시작합니다. 무슨 말을 했든 댓글 첫 줄은 둘로 갈립니다. 세트장은 철수가 한창입니다. 강태민은 올 때처럼 스탠드 네 개를 혼자 들고 나가고, 신이안 감독은 끝내 나준혁에게 명함을 한 장 더 쥐여 줍니다. 문하준이 스케치북을 펼쳐 보입니다. 오늘 밤 세트장을 그린 그림, 맨 끝 조명 아래에 작게 '끝까지'라고 적혀 있습니다. 모니터 앞에 혼자 남은 백아린은 당신의 마지막 8초를 열한 번째 되감고 있습니다. 그가 돌아보지 않고 말합니다. '다음 달에 새 상품이 나와요. 이름에 \"상생\"이 들어가요. 거기에도 이야기가 필요할 거예요.'",
      memo: ["클립 조회 수 3시간 만에 90만", "문하준의 스케치: '끝까지'", "백아린, 마지막 8초를 11회 재생", "다음 달 출시 예정: '상생'이 붙은 새 상품"],
      triggers: ["trust", "recognition", "choice"],
      choices: [
        { id: "c13_after_warm", label: "오늘은 동료들과 마지막 스탠드를 나를 때까지 남는다", effect: { trust: 13, humanCost: -5, time: -3, capital: -2, fatigue: -8 }, next: "case13_result", cognition: { reframing: 2 } },
        { id: "c13_after_record", label: "출연 제안의 조건과 대가를 전부 문서로 남긴다", effect: { legitimacy: 15, trust: 3, time: -5, capital: -3, fatigue: 5 }, next: "case13_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c13_after_rush", label: "'상생'이 들어간 다음 상품부터 곧장 캐낸다", effect: { capital: 8, legitimacy: 5, trust: -7, humanCost: 5, fatigue: 6 }, next: "case13_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c13_final", "c13_aftershock"],
  connectiveScenes: [
    ["c13_script", "c13_studio", "c13_market", "신뢰도 68%", "백아린", "쉬는 시간, 분장실 거울 앞에서 백아린이 대본의 수정 이력을 태블릿으로 넘겨 보여 줍니다. 마지막 문장은 열네 번 바뀌었습니다. 1번 버전은 '과거를 잊지 않겠습니다'였습니다. '포커스 그룹(광고를 미리 보여 주고 반응을 듣는 소수의 조사 참가자)에서 신뢰도가 41% 나왔어요. 잊지 않겠다는 말은 아직 안 끝났다는 뜻으로 들린대요. \"정리되었습니다\"는 68%고요.' 그가 형광펜 뚜껑을 닫으며 담담하게 덧붙입니다. '사실을 바꾸자는 게 아니에요. 사람들이 끝까지 들어 주는 문장을 고르는 거예요.'", ["마지막 문장 수정 14회", "1번 버전 '과거를 잊지 않겠습니다' -- 신뢰도 41%", "현재 버전 '정리되었습니다' -- 신뢰도 68%"], ["잊지 않겠다는 1번 문장으로 되돌리자고 백아린을 설득한다", "포커스 그룹 조사의 원자료를 달라고 요구한다", "68%면 이기는 문장이라며 대본을 그대로 둔다"]],
    ["c13_rumor", "c13_market", "c13_lab", "은행 총각의 편", "오진우", "다음 날 아침, 팀 간식 떡을 사러 망원시장에 간 오진우가 채소 가게 앞에서 할머니 세 명에게 붙잡힙니다. '은행 총각, 어제 그 광고 진짜야?' 오진우는 휴대폰 메모장에 혁신위원회 조직도를 그려 가며 설명을 시작합니다. 위원장, 간사, 외부 위원, 자문단. 3분쯤 지나자 가운데 할머니가 화면을 손바닥으로 덮습니다. '그래서 총각은 누구 편이야?' 오진우가 입을 열었다가 닫습니다. 승부에서 말문이 막혀 본 적 없는 사람입니다. 할머니가 떡 봉지에 가래떡 두 줄을 더 넣어 줍니다. '대답 생기면 와. 그때 돈 받을게.'", ["피해자 모임 단체방: '배신' 언급 27회", "38번 할머니의 답글: '그 사람 떡은 잘 썰던데'", "오진우, 조직도 설명 3분 만에 중단"], ["할머니들에게 제안의 조건과 대가를 있는 그대로 설명한다", "피해자 모임 단체방에 공식 입장문을 올린다", "오늘은 떡만 사서 빠져나오라고 오진우에게 말한다"]],
    ["c13_offer", "c13_lab", "c13_final", "간사의 커피", "백아린", "밤 11시 40분, 엘리베이터가 4층에 섭니다. 백아린이 커피 여덟 잔을 들고 나옵니다. 오진우가 영상을 사내 메신저 상태 메시지에 실수로 올렸다가 4분 만에 내렸고, 그 4분 사이에 그가 봤습니다. '잘 만들었네요. 편집은 제가 하면 더 좋아지겠지만.' 그가 커피를 한 잔씩 나눠 놓고 당신 앞에 앉습니다. '제안할게요. 내일 생방송에 이 영상 20초를 넣죠. 대신 마지막 문장은 그대로 읽어 주세요.' 잠깐 말이 끊깁니다. '좋은 이야기는 사실보다 오래 가요. 저는 그걸 믿어서 이 일을 해요. 그런데 이 영상은, 사실이 이야기보다 낫네요. 곤란하게.'", ["백아린의 제안: 영상 20초 삽입 ↔ 마지막 문장 낭독", "오진우의 메신저 실수 -- 노출 4분", "커피 8잔 -- 트리거랩 인원수를 정확히 앎"], ["영상 20초 대신 마지막 문장을 빼자고 백아린에게 역제안한다", "그 제안을 말이 아니라 서면으로 남겨 달라고 한다", "영상 20초와 마지막 문장을 맞바꾸는 제안을 받아들인다"]],
  ],
  connectiveOrder: [["c13_studio", "c13_script"], ["c13_market", "c13_rumor"], ["c13_lab", "c13_offer"]],
  choiceEffects: {
    c13_studio: [
      { trust: 11, legitimacy: 5, humanCost: -4, time: -4, capital: -2, fatigue: 4 },
      { legitimacy: 8, trust: 2, time: -5, humanCost: 3, fatigue: 4 },
      { time: 6, capital: 5, trust: -4, humanCost: 4, fatigue: -3 },
    ],
    c13_market: [
      { trust: 11, humanCost: -5, legitimacy: 3, capital: -2, time: -3, fatigue: 3 },
      { legitimacy: 7, trust: 3, capital: -3, time: -4, humanCost: -2, fatigue: 3 },
      { time: 5, capital: 4, trust: -3, humanCost: 2, fatigue: -4 },
    ],
    c13_lab: [
      { legitimacy: 9, trust: 6, humanCost: -3, time: -3, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: 3, humanCost: 2, time: -4, fatigue: 4 },
      { capital: 6, time: 4, trust: -4, legitimacy: 3, humanCost: 2, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c13_studio: {
      voice: ["잊지 않겠다는, 1번 문장으로 되돌리자고 백아린을 설득한다.", "포커스 그룹 조사의 원자료를, 달라고 요구한다.", "68%면 이기는 문장이라며, 대본을 그대로 둔다."],
      echo: ["설득하면 백아린이 처음으로 대답을 늦춥니다. '41%로 가면, 그 27%는 누가 메우죠?'", "원자료를 받으면 조사 참가자 120명 중 피해자는 0명이라는 게 보입니다. 그 사실을 누구에게 보일지는 아직 모릅니다.", "대본은 그대로 갑니다. 68%의 사람들은 끝까지 듣고, 1,740명도 그 문장을 끝까지 듣게 됩니다."],
    },
    c13_market: {
      voice: ["할머니들에게, 제안의 조건과 대가를 있는 그대로 설명한다.", "피해자 모임 단체방에, 공식 입장문을 올린다.", "오늘은 떡만 사서, 빠져나오라고 오진우에게 말한다."],
      echo: ["있는 그대로 들은 할머니들이 한참 셈을 합니다. 212명과 동료들 자리, 그리고 당신 얼굴. 한 분이 '그건 남는 장사가 아니네' 합니다.", "입장문은 정확합니다. 단체방의 메시지 340개 사이에서 그 정확함은 금방 위로 밀려 올라갑니다.", "오진우는 가래떡 두 줄을 들고 돌아옵니다. 할머니들의 질문은 시장에 그대로 남습니다."],
    },
    c13_lab: {
      voice: ["영상 20초 대신, 마지막 문장을 빼자고 백아린에게 역제안한다.", "그 제안을 말이 아니라, 서면으로 남겨 달라고 한다.", "영상 20초와 마지막 문장을 맞바꾸는, 그 제안을 받아들인다."],
      echo: ["역제안을 들은 백아린이 커피를 내려놓습니다. '그건 제 권한 밖이에요.' 그리고 한참 뒤, '물어는 볼게요.'", "서면을 달라고 하자 백아린이 웃습니다. '반대 의견 쓰신 분답네요.' 새벽 1시에 메일이 옵니다. 서명란은 비어 있습니다.", "받아들이면 20초는 전국에 나갑니다. 그 20초 바로 뒤에, 당신은 '과거는 모두 정리되었습니다'를 읽습니다."],
    },
  },
  reactionScenes: [
    ["c13_script_reaction", "c13_script", "c13_market", "도장 모델", "나준혁", "촬영장 밖 주차장에서 나준혁이 명함 한 장을 흔듭니다. 신이안 감독이 준 것입니다. '도장 모델로 전속 계약하재요. 손만 나오는데 출연료가 제 한 달 월급이에요. 퇴직하면 손으로 먹고살면 되겠어요.' 강태민이 웃고, 오진우는 말없이 자기 손을 내려다봅니다. 나준혁이 믹스커피를 한 모금 마시고 명함을 주머니에 넣습니다. '근데요, 30년 동안 이 손으로 찍은 대출 중에 정리된 건 하나도 없어요. 갚았거나, 못 갚았거나, 아직 갚는 중이거나. 그 셋뿐이에요.'", ["나준혁의 그 세 가지를 대본의 대안 문장으로 받아 적는다", "카메오 계약서의 얼굴 사용 범위부터 확인하게 한다", "오늘은 웃고 넘기며 커피나 한 잔 더 산다"]],
    ["c13_rumor_reaction", "c13_rumor", "c13_lab", "복귀 명단", "한서윤", "밤 11시, 트리거랩 옥상. 한서윤이 인사부에서 온 메일을 보여 줍니다. '정규 부서 복귀 대상자 명단.' 이민서, 도윤하, 오진우, 반재욱. 협력 인원인 나준혁과 강태민은 원래 소속으로 돌아갑니다. 명단 어디에도 한서윤의 이름은 없고, 트리거랩이라는 부서 이름도 없습니다. '당연하죠. 복귀는 돌아갈 데가 있는 사람한테 쓰는 말이니까. 여기가 없어지는 거예요.' 그가 난간에 팔을 얹습니다. '다들 좋아할 거예요. 3년 만에 지하에서 나가는 거니까. 저도 좋아해야 하는데요.'", ["한서윤과 함께 동료들에게 명단의 뜻을 먼저 알린다", "인사부에 복귀 명단의 근거 문서를 공식 요청한다", "명단 이야기는 생방송이 끝난 뒤로 미룬다"]],
    ["c13_offer_reaction", "c13_offer", "c13_final", "새벽 1시의 문자", "문가을", "새벽 1시 10분, 탕비실에서 컵을 씻는데 문자가 옵니다. 문가을입니다. '하준이가 영상 보여 줬어요. 누가 보냈는지는 몰라요. 떡 썰던 사람들이 나와서 좋았어요. 강태민 씨는 떡메 칠 때보다 말을 더 못하던데요.' 잠시 뒤 한 줄이 더 옵니다. '내일 뭐라고 하든, 명함을 다시 붙일지는 그다음에 정할게요. 남편이라면 한 번은 더 믿어 봤을 거예요. 저는 남편보다 조금 덜 착해요.' 답장 칸에서 커서가 오래 깜빡입니다.", ["문가을에게 내일 생방송 방청석에 와 달라고 부탁한다", "문가을의 문자를 내일 발언 원고 맨 뒤에 붙여 둔다", "답장은 생방송이 끝난 뒤에 하기로 한다"]],
  ],
  reactionEffects: {
    c13_script: [
      { trust: 10, humanCost: -4, time: -3, fatigue: 3 },
      { legitimacy: 8, trust: 2, capital: -4, time: -3, fatigue: 2 },
      { time: 3, capital: -2, trust: 4, humanCost: 2, fatigue: -4 },
    ],
    c13_rumor: [
      { trust: 9, humanCost: -5, time: -4, fatigue: 4 },
      { legitimacy: 10, trust: 3, capital: -5, time: -3, fatigue: 4 },
      { time: 5, capital: 5, trust: -3, humanCost: 4, fatigue: -3 },
    ],
    c13_offer: [
      { trust: 10, humanCost: -4, legitimacy: 2, time: -3, fatigue: 3 },
      { legitimacy: 9, trust: 4, capital: -4, time: -3, humanCost: -2, fatigue: 4 },
      { time: 5, capital: 4, trust: -3, humanCost: 2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c13_script: {
      voice: ["나준혁의 그 세 가지를, 대본의 대안 문장으로 받아 적는다.", "카메오 계약서의 얼굴 사용 범위부터, 확인하게 한다.", "오늘은 웃고 넘기며, 커피나 한 잔 더 산다."],
      echo: ["받아 적으면 나준혁이 쑥스러워하며 '저작권은 영동지점'이라고 합니다. 그 문장이 방송에 나갈 수 있을지는 모릅니다.", "계약서를 보면 얼굴 사용 기간이 '무기한'입니다. 나준혁의 손은 그가 퇴직한 뒤에도 KD 광고에서 도장을 찍습니다.", "커피는 달고 저녁은 짧습니다. 나준혁의 세 가지는 주차장 바람에 흩어집니다."],
    },
    c13_rumor: {
      voice: ["한서윤과 함께, 동료들에게 명단의 뜻을 먼저 알린다.", "인사부에, 복귀 명단의 근거 문서를 공식 요청한다.", "명단 이야기는, 생방송이 끝난 뒤로 미루자고 한다."],
      echo: ["알리면 탕비실이 조용해집니다. 이민서가 제일 먼저 '저는 여기 있을래요'라고 하고, 그 말에 누구도 대답하지 못합니다.", "요청하면 인사부는 '검토 중'이라는 답을 사흘 뒤에 줍니다. 생방송은 그보다 먼저 옵니다.", "미루면 동료들은 생방송 날까지 복귀를 기다립니다. 한서윤만 그 기다림의 끝을 압니다."],
    },
    c13_offer: {
      voice: ["문가을에게, 내일 생방송 방청석에 와 달라고 부탁한다.", "문가을의 문자를, 내일 발언 원고 맨 뒤에 붙여 둔다.", "답장은, 생방송이 끝난 뒤에 하기로 한다."],
      echo: ["부탁하면 한참 뒤 답이 옵니다. '가게 문 열어야 해요. 하준이 보낼게요.' 그 답에는 거절과 승낙이 반씩 들어 있습니다.", "원고에 붙인 문자는 당신만 봅니다. 읽을지 말지는 카메라 앞에서 정해야 합니다.", "답장 없는 휴대폰을 문가을이 두 번 확인하고 불을 끕니다."],
    },
  },
  reactionMemos: {
    c13_script_reaction: ["도장 모델 전속 제안 -- 출연료는 한 달 월급", "갚았거나, 못 갚았거나, 갚는 중이거나"],
    c13_rumor_reaction: ["복귀 명단에 없는 두 이름: 한서윤, 트리거랩", "돌아갈 데가 있는 사람한테 쓰는 말"],
    c13_offer_reaction: ["'명함을 다시 붙일지는 그다음에'", "남편보다 조금 덜 착한 사람"],
  },
  branchPlan: ["c13_studio", 0, "c13_branch_extras", "c13_branch_extras_follow"],
  branchScenes: {
    // CASE 13's detour is the extras' room. The case argues over whose face the
    // reform wears; the side door is the people hired to play the victims, one of
    // whom used to be one -- and who has heard the robots are coming (사건 16).
    c13_branch_extras: {
      phase: "SIDE DOOR",
      title: "보조출연 대기실",
      speaker: "강태민",
      text: "스튜디오 지하 대기실에서 보조출연자 여덟 명이 도시락을 먹고 있습니다. 배역 이름은 '배상받고 다시 일어선 소상공인', 일당 8만 원입니다. 벽에 붙은 섭외표 맨 아래에 작은 글씨가 있습니다. '실제 피해자 섭외 불가 -- 이미지 위험.' 강태민이 문간에서 멈춥니다. 구석의 한 사람이 젓가락을 떨어뜨립니다. 플로우온 야간조에서 3년을 같이 일한 곽민재, 작년 인원 감축 때 나간 후배입니다. '형, 저 오늘 사장님 역이에요. 대사는 없어요. 웃기만 하면 돼요.' 그가 웃다가 목소리를 낮춥니다. '근데 형, 저 같은 사람도 진짜로 배상받을 수 있어요?'",
      memo: ["보조출연자 8명 -- 배역 '배상받고 다시 일어선 소상공인'", "섭외표: '실제 피해자 섭외 불가'", "곽민재: 플로우온 야간조 3년, 작년 인원 감축", "일당 8만 원, 대행 수수료 20% 공제"],
      triggers: ["injustice", "protection", "affection"],
      choices: [
        { id: "c13_branch_extras_tell", label: "곽민재와 보조출연자들에게 이 광고가 무엇인지 먼저 알린다", effect: { trust: 11, humanCost: -4, time: -3, capital: -2, fatigue: 4 }, next: "c13_branch_extras_follow", cognition: { reframing: 2 } },
        { id: "c13_branch_extras_sheet", label: "'실제 피해자 섭외 불가'가 적힌 섭외표 원본을 확보한다", effect: { legitimacy: 11, trust: 2, time: -6, humanCost: 3, fatigue: 4 }, next: "c13_branch_extras_follow", cognition: { inference: 2 } },
        { id: "c13_branch_extras_quiet", label: "오늘 일당은 받아야 하니 모른 척 촬영을 마치게 둔다", effect: { capital: 6, time: 5, trust: -6, humanCost: 4, fatigue: -3 }, next: "c13_branch_extras_follow", cognition: { risk: 1 } },
      ],
    },
    c13_branch_extras_follow: {
      phase: "SIDE DOOR",
      title: "일당 8만 원",
      speaker: "곽민재",
      text: "촬영이 끝난 저녁, 스튜디오 주차장. 곽민재가 입금 문자를 보여 줍니다. 8만 원에서 수수료를 떼고 6만 4천 원. '은행 광고만 여섯 번 찍었어요. 대출 상담받고 활짝 웃는 손님 역으로요. 진짜 은행에선 한 번도 못 웃어 봤는데.' 강태민이 캔커피 두 개를 사 와 하나를 건넵니다. 둘은 한참 말이 없습니다. 곽민재가 캔을 따며 말합니다. '센터에 남은 애들이 그러는데요, 연말에 로봇이 들어온대요. 백 몇십 대. 그 돈도 KD에서 나온대요.' 강태민이 캔을 쥔 손에 힘을 줍니다. 알루미늄이 찌그러지는 소리가 납니다.",
      memo: ["입금액 6만 4천 원 -- 수수료 20%", "은행 광고 보조출연 6회, 배역은 모두 '웃는 손님'", "풀필먼트센터 소문: 연말 물류 로봇 도입", "도입 자금: KD 계열사라는 말만 돎"],
      triggers: ["injustice", "trust", "protection"],
      choices: [
        { id: "c13_branch_extras_follow_invite", label: "곽민재를 생방송 방청석에 자기 이름으로 초대한다", effect: { trust: 12, legitimacy: 4, capital: -3, time: -3, fatigue: 4 }, next: "c13_script", cognition: { reframing: 2 } },
        { id: "c13_branch_extras_follow_fee", label: "대행사에 섭외 기준과 수수료 명세서를 공식 요청한다", effect: { legitimacy: 11, trust: 3, time: -6, humanCost: 3, fatigue: 4 }, next: "c13_script", cognition: { inference: 2 } },
        { id: "c13_branch_extras_follow_later", label: "로봇 소문은 나중 일이라며 연락처만 받아 둔다", effect: { time: 6, capital: 5, trust: -5, humanCost: 4, fatigue: -3 }, next: "c13_script", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c13_start",
    result: "c13_aftershock",
    defaultFree: "c13_route_system",
    // One offer, one line of script. Like 사건 12 the case is a single line; the
    // split is what the face ends up saying.
    choices: {},
    system: {
      route: "c13_route_system",
      final: "c13_final_system_route",
      title: "위원회의 수명",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 지난 15년 국내 금융회사들이 사고 뒤에 만든 혁신·쇄신위원회 23곳을 엽니다. 평균 수명 14개월. 외부 위원이 낸 권고 186건 가운데 끝까지 이행된 것은 17건입니다. 위원회 광고비는 운영비의 평균 3.4배였고, 첫 광고의 마지막 문장으로 가장 많이 쓰인 말은 '새롭게 태어나겠습니다', 두 번째가 '과거를 정리하고'였습니다. '위원회는 사과보다 싸고 오래 쓰이도록 학습되어 있습니다. 얼굴이 붙으면 더 오래 쓰입니다.'",
      memo: ["위원회 23곳 평균 수명 14개월", "외부 권고 186건 중 이행 17건", "광고비 = 운영비의 3.4배"],
      routeChoices: [
        ["c13_route_system_publish", "위원회 23곳의 이행률을 생방송 전에 공개한다", { legitimacy: 11, trust: 5, capital: -6, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c13_route_system_clause", "권고 이행 여부를 분기마다 공개하는 조항을 출연 조건에 넣는다", { legitimacy: 9, capital: 4, trust: 3, time: -7, humanCost: 3, fatigue: 6 }, { reframing: 2 }],
        ["c13_route_system_drop", "통계는 덮고 촬영 일정대로 간다", { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "권고를 거부할 때 그 사유를 공개하게 하는 조항을 요구한다", { legitimacy: 13, trust: 6, capital: -8, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "조항 없이 출연료만 올려 받는다", { capital: 9, time: 7, trust: -5, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "위원회 밖에 피해자 모임이 뽑는 감시 위원 자리를 만든다", { legitimacy: 8, trust: 9, capital: -7, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c13_evidence_turn",
    result: "c13_aftershock",
    sourceRoutes: ["c13_studio", "c13_market", "c13_lab", "c13_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 혁신위원회 예산서 옆에 놓고, 38억이 어느 코드에서 나오는지 맞춰 본다.",
    entryEcho: "단서를 대면 광고비가 어디서 오는지 보입니다. 그 돈이 무엇을 치우는 데 함께 쓰이는지도 보입니다.",
    title: "예산의 번호",
    speaker: "권도현",
    text: "단서를 맞추자 혁신위원회 예산서가 열립니다. 총 38억. 광고 제작비 11억, 방송 광고비 19억, 위원 활동비 8억. 권도현이 비용 코드 SP-0412를 그룹 회계 원장(회사의 모든 돈이 드나든 기록을 적는 장부)에서 검색합니다. 같은 코드로 한 줄이 더 나옵니다. '트리거랩 정리 비용 -- 인력 재배치, 장비 반납, 4층 원상 복구.' 그가 계산기를 내려놓습니다. '동료 전원 정규 부서 복귀요. 그건 대가가 아니라 폐쇄 공사비예요. 한 예산으로 광고를 찍고 우리 방을 치우는 겁니다.' 그가 코드 끝을 손톱으로 짚습니다. '그리고 이 네 자리, 우리 다 아는 번호죠.'",
    memo: ["혁신위원회 예산 38억 -- 비용 코드 SP-0412", "같은 코드: 트리거랩 정리 비용", "코드 끝 네 자리 = 대출번호 2023-0412"],
    triggers: ["manipulation", "system", "injustice"],
    entryEffect: { legitimacy: 6, trust: 2, time: -4, fatigue: 4 },
    choices: [
      ["c13_evidence_turn_confront", "예산 코드를 생방송 전에 백아린 앞에 놓고 대가를 다시 협상한다", { legitimacy: 12, trust: 4, capital: -7, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c13_evidence_turn_hold", "코드는 알아 두고 위원회 첫 회의 날 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c13_evidence_turn_tell", "복귀 발령을 기다리는 동료들에게 먼저 사실을 알린다", { trust: 12, legitimacy: 6, capital: -6, humanCost: -6, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c13_branch_extras",
    systemNext: "c13_route_system",
    evidenceNext: "c13_evidence_turn",
    routeLabel: "직전 사건의 떡 상자 명단과 광고 속 '피해자' 배역을 대조한다",
    systemLabel: "직전 자유응답 문장이 혁신위원회 계획서에도 인용됐는지 본다",
    evidenceLabel: "직전 단서의 광고비 계정을 혁신위원회 예산서에 붙인다",
  },
  openingRoutes: {
    c12_after_feast: "c13_start_warm",
    c12_after_fund: "c13_start_record",
    c12_after_meet: "c13_start_rush",
  },
  openingCopy: {
    c13_start_warm: ["떡 냄새가 밴 채로 받은 제안", "강태민", "떡집 셔터를 내린 다음 날 아침, 참기름 냄새가 밴 재킷 그대로 33층에 오릅니다. 서명란 얘기를 하자던 윤상혁은 서명란 대신 'KD 혁신위원회' 계획서를 내밉니다. 외부 공개 위원이자 광고 얼굴 자리, 조건은 반대 의견을 쓴 사람이 '과거는 정리됐다'고 말해 주는 것입니다. 대가는 212명 배상 기준 확정과 트리거랩 동료 전원의 정규 부서 복귀. 로비에서 기다리던 강태민이 문자를 보냅니다. '어제 떡 받은 사람들, 오늘도 가게 앞에 와 있대요.'", ["어제 떡 상자 1,021개 -- 모임 전원", "혁신위원회 광고 얼굴 제안", "대가: 212명 배상 기준 + 동료 전원 복귀"]],
    c13_start_record: ["소품이 된 개정안", "백아린", "212명이 들어갈 배상 기준 개정안을 들고 33층에 갑니다. 문을 열자 처음 보는 사람이 이미 그 문서를 출력해 형광펜을 칠해 두었습니다. 그룹전략실 차장 백아린. '잘 쓰셨어요. 혁신위원회 1호 안건으로 올리죠. 발표는 광고로 하고요.' 윤상혁이 조건을 덧붙입니다. 광고에서 반대 의견을 쓴 당신이 '과거는 정리됐다'고 말할 것. 대가는 개정안 확정과 트리거랩 동료 전원의 정규 부서 복귀. 당신의 문서가 촬영 소품 목록 3번에 올라 있습니다.", ["배상 기준 개정안 -- 촬영 소품 목록 3번", "혁신위원회 1호 안건 예정", "조건: '과거는 정리됐다'는 한 문장"]],
    c13_start_rush: ["떡 상자를 든 사람", "윤상혁", "마지막 떡 상자를 든 채 33층에 들어섭니다. 윤상혁이 뚜껑을 열고 송편 하나를 집습니다. '문 사장 떡이군. 잘 찌네.' 서명란 얘기는 나오지 않습니다. 창가의 백아린이 휴대폰으로 상자를 찍습니다. '이 장면 좋네요. 광고에 넣죠.' 제안은 'KD 혁신위원회'의 광고 얼굴입니다. 반대 의견을 쓴 사람이 '과거는 정리됐다'고 말해 주면 212명 배상 기준이 확정되고 트리거랩 동료 전원이 정규 부서로 돌아갑니다. 문성호 대표 몫이던 상자가 벌써 누군가의 광고 한 장면이 되어 있습니다.", ["떡 상자 사진 -- 광고 시안 1컷", "윤상혁이 송편 1개를 먹음", "대가: 212명 배상 기준 + 동료 전원 복귀"]],
  },
  openingSignatures: {
    c13_start_warm: {
      label: "떡을 받은 사람들에게 먼저 묻고 오겠다며 답을 미룬다",
      effect: { trust: 11, humanCost: -5, capital: -4, time: -6, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "떡을 받은 사람들에게 먼저 묻고 오겠다며, 답을 미룬다.",
      echo: "답을 미루면 윤상혁이 처음으로 시계를 봅니다. 가게 앞의 사람들은 '그걸 왜 우리한테 물어요'라고 되묻습니다.",
    },
    c13_start_record: {
      label: "개정안을 광고 소품이 아니라 위원회 공식 안건 번호로 먼저 받아 낸다",
      effect: { legitimacy: 12, trust: -2, capital: -5, time: -5, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "개정안을 광고 소품이 아니라, 위원회 공식 안건 번호로 먼저 받아 낸다.",
      echo: "안건 번호가 붙으면 문서는 소품 목록에서 빠집니다. 대신 백아린은 같은 문서를 새로 출력해 소품으로 씁니다.",
    },
    c13_start_rush: {
      label: "떡 상자 사진은 광고에 쓰지 말라고 그 자리에서 못 박는다",
      effect: { trust: 10, legitimacy: 5, humanCost: 3, time: -5, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "떡 상자 사진은, 광고에 쓰지 말라고 그 자리에서 못 박는다.",
      echo: "못 박으면 백아린이 사진을 지웁니다. 당신이 보는 앞에서 휴지통까지 비웁니다. 다른 기기에 남았는지는 모릅니다.",
    },
  },
  voiceLines: {
    // CASE 13. Every line is said with a camera somewhere in the room, so each
    // one is also a line someone could cut and air.
    c13_start_colleagues: "동료들의 자리가 걸린 일이라며, 이 제안을 대가까지 그대로 먼저 알린다.",
    c13_start_read: "답하기 전에, 혁신위원회 계획서와 출연 계약서를 한 줄씩 읽는다.",
    c13_start_accept: "대가부터 확정받겠다며, 그 자리에서 출연을 수락한다.",
    c13_studio_meet: "촬영을 멈추고, 이 광고에 나오는 사람들부터 만나 본다.",
    c13_studio_basis: "마지막 문장이 무슨 근거로 쓰였는지, 서면 답변을 요구한다.",
    c13_studio_read: "일단 읽어 주고, 편집 단계에서 빼 달라고 한다.",
    c13_branch_extras_tell: "곽민재와 보조출연자들에게, 이 광고가 무엇인지 먼저 알린다.",
    c13_branch_extras_sheet: "'실제 피해자 섭외 불가'가 적힌, 섭외표 원본을 확보한다.",
    c13_branch_extras_quiet: "오늘 일당은 받아야 하니, 모른 척 촬영을 마치게 둔다.",
    c13_branch_extras_follow_invite: "곽민재를, 생방송 방청석에 자기 이름으로 초대한다.",
    c13_branch_extras_follow_fee: "대행사에, 섭외 기준과 수수료 명세서를 공식 요청한다.",
    c13_branch_extras_follow_later: "로봇 소문은 나중 일이라며, 연락처만 받아 둔다.",
    c13_market_stay: "변명하지 않겠다며, 셔터를 내릴 때까지 문가을 옆에서 떡을 썬다.",
    c13_market_correct: "자막이 촬영 원본과 다르다며, 정정 요청을 공식으로 낸다.",
    c13_market_deal: "212명 배상이 걸린 일이니, 예고편은 참아 달라고 부탁한다.",
    c13_lab_share: "영상을, 문가을과 피해자 모임에 먼저 보낸다.",
    c13_lab_submit: "영상을 수정 대본으로, 혁신위원회에 정식 제출한다.",
    c13_lab_cue: "생방송 중에 영상이 나가도록, 송출 순서를 몰래 바꿔 둔다.",
    c13_final_terms: "위원 자리는 받되, 마지막 문장을 빼야 앉겠다고 조건을 건다.",
    c13_final_refuse: "카메라 앞에서 제안과 대가를 밝히고, 자리를 거절한다.",
    c13_final_rewrite: "받아 두고, 생방송에서 마지막 문장을 바꿔 읽는다.",
    c13_after_warm: "오늘은 동료들과, 마지막 스탠드를 나를 때까지 남는다.",
    c13_after_record: "출연 제안의 조건과 대가를, 전부 문서로 남긴다.",
    c13_after_rush: "'상생'이 들어간 다음 상품부터, 곧장 캐낸다.",
    c13_route_system_publish: "위원회 23곳의 이행률을, 생방송 전에 공개한다.",
    c13_route_system_clause: "권고 이행 여부를 분기마다 공개하는 조항을, 출연 조건에 넣는다.",
    c13_route_system_drop: "통계는 덮고, 촬영 일정대로 간다.",
    c13_final_system_route_a: "권고를 거부할 때, 그 사유를 공개하게 하는 조항을 요구한다.",
    c13_final_system_route_b: "조항은 없이, 출연료만 올려 받는다.",
    c13_final_system_route_c: "위원회 밖에, 피해자 모임이 뽑는 감시 위원 자리를 만든다.",
    c13_evidence_turn_confront: "예산 코드를 생방송 전에 백아린 앞에 놓고, 대가를 다시 협상한다.",
    c13_evidence_turn_hold: "코드는 알아 두고, 위원회 첫 회의 날 꺼낸다.",
    c13_evidence_turn_tell: "복귀 발령을 기다리는 동료들에게, 먼저 사실을 알린다.",
  },
  echoReplies: {
    // CASE 13.
    c13_start_colleagues: "알리면 탕비실에서 박수가 먼저 나옵니다. 3년 만의 지상 발령입니다. 그 박수를 끊어야 하는 사람은 당신일지도 모릅니다.",
    c13_start_read: "읽으면 계약서 11조가 보입니다. '출연자는 방송 뒤 1년간 캠페인과 다른 공개 발언을 하지 않는다.' 그 한 줄을 찾는 데 하루가 갑니다.",
    c13_start_accept: "수락하면 백아린이 바로 촬영 일정을 보냅니다. 212명의 기준은 아직 '확정 예정'이라는 말로 적혀 있습니다.",
    c13_studio_meet: "멈추면 신이안 감독이 한숨을 쉬고 조명이 식습니다. 대기실 문 너머에서 이 광고의 '피해자들'이 도시락을 먹고 있습니다.",
    c13_studio_basis: "서면을 요구하면 백아린이 수정 이력 파일을 보냅니다. 근거는 사실이 아니라 설문 결과입니다.",
    c13_studio_read: "읽으면 테이크는 한 번에 끝납니다. 편집실은 당신의 부탁보다 당신의 목소리를 먼저 받습니다.",
    c13_branch_extras_tell: "알리면 여덟 명 중 둘이 도시락을 덮고 일어섭니다. 남은 여섯에게는 오늘 일당이 필요합니다. 곽민재도 남습니다.",
    c13_branch_extras_sheet: "원본을 찍으면 대행사 직원이 벽에서 종이를 뗍니다. 사진은 남고, 그 직원은 오늘 저녁 경위서를 씁니다.",
    c13_branch_extras_quiet: "촬영은 끝납니다. 곽민재는 대사 없이 열한 번 웃고, 광고 속 '다시 일어선 사장님'이 됩니다.",
    c13_branch_extras_follow_invite: "초대하면 곽민재가 한참 망설이다 묻습니다. '형, 그날은 안 웃어도 돼요?'",
    c13_branch_extras_follow_fee: "명세서가 오면 일당의 20%가 그룹 계열 광고대행사로 돌아간다는 게 보입니다. 곽민재의 6만 4천 원은 그대로입니다.",
    c13_branch_extras_follow_later: "연락처가 저장됩니다. 강태민은 찌그러진 캔을 버리지 않고 조끼 주머니에 넣습니다.",
    c13_market_stay: "썰다 보면 문가을이 칼 잡는 법을 한 번 고쳐 줍니다. 명함은 여전히 앞치마 주머니에 있습니다.",
    c13_market_correct: "요청은 접수됩니다. 예고편은 그사이 오늘 밤에만 네 번 더 나갑니다.",
    c13_market_deal: "부탁을 들은 문가을이 떡을 한 번 더 썹니다. '그 212명 중에 누가 당신한테 대신 참아 달라고 했어요?'",
    c13_lab_share: "보내면 단체방이 한참 조용하다가 떡 이모티콘이 하나씩 올라옵니다. 그룹도 곧 이 영상을 보게 됩니다.",
    c13_lab_submit: "제출하면 접수 번호가 나옵니다. 위원회 첫 회의는 생방송 3주 뒤입니다.",
    c13_lab_cue: "바꿔 두면 이민서의 옛 계정이 새벽 접속 기록에 남습니다. 3년 전 그를 유출자로 만든 것도 접속 기록이었습니다.",
    c13_final_terms: "조건을 걸면 백아린이 인이어 너머로 33층과 통화합니다. 방송은 3분 늦게 시작하고, 212명의 공문도 그만큼 늦어집니다.",
    c13_final_refuse: "거절하면 11만 명이 대가까지 듣습니다. 212명의 기준과 동료들의 복귀 발령은 오늘 밤 어느 공문에도 오르지 않습니다.",
    c13_final_rewrite: "바꿔 읽으면 프롬프터와 당신의 입이 처음으로 다른 말을 합니다. 백아린은 그 3초를 끊지 않습니다. 계약서 11조는 내일 아침에 도착합니다.",
    c13_after_warm: "마지막 스탠드를 트럭에 싣고 나면 강태민이 컵라면을 여덟 개 삽니다. 백아린의 '상생'은 내일까지 기다립니다.",
    c13_after_record: "문서로 남기면 33층의 제안에도 날짜와 문장이 생깁니다. 서명란이 비어 있다는 것까지 적힙니다.",
    c13_after_rush: "곧장 파고들면 KD자산운용 서버에서 '상생 ESG'라는 폴더가 보입니다. 세트장에 남은 동료들은 당신 없이 스탠드를 나릅니다.",
    c13_route_system_publish: "공개하면 기사 두 개가 붙습니다. 백아린은 그 기사를 읽고 대본에서 한 단어를 뺍니다. '모두'입니다.",
    c13_route_system_clause: "조항이 들어가면 위원회는 매 분기 숫자를 내야 합니다. 첫 숫자가 나오기까지 석 달이 걸립니다.",
    c13_route_system_drop: "일정은 지켜집니다. 당신의 위원회는 에코의 표에 24번째 줄로 추가됩니다.",
    c13_final_system_route_a: "그 조항이 들어가면 위원회의 '아니오'에도 문장이 붙습니다. 그룹은 그 조항에 가장 오래 반대합니다.",
    c13_final_system_route_b: "출연료는 두 배가 됩니다. 에코의 표에서 당신의 위원회는 평균 수명 14개월 쪽으로 기웁니다.",
    c13_final_system_route_c: "자리가 생기면 문가을이 첫 후보로 올라옵니다. 그는 '떡집 문 닫는 날만 갈 수 있다'고 합니다.",
    c13_evidence_turn_confront: "코드를 본 백아린이 태블릿을 내려놓습니다. 처음으로 수정 이력이 없는 문서를 본 얼굴입니다.",
    c13_evidence_turn_hold: "기다리는 3주 동안 4층의 장비 반납 목록이 한 장씩 늘어납니다.",
    c13_evidence_turn_tell: "알리면 이민서가 복귀 신청서를 조용히 파쇄기에 넣습니다. 도윤하는 넣지 못하고 오래 들고 있습니다.",
  },
  characterProfiles: {
    백아린: {
      role: "KD금융그룹 그룹전략실 차장 · KD 혁신위원회 간사",
      stance: "이야기 · 속도 · 설계",
      job: "사실을 바꾸지 않고 사실의 순서를 바꾼다. 윤상혁의 오른손으로, 반대 의견을 쓴 사람을 개혁 광고의 얼굴로 만들러 온다.",
      appearance: "구김 없는 회색 수트, 색이 다른 형광펜 세 자루, 늘 80%로 충전된 태블릿.",
      thought: "진실은 사람들이 끝까지 들어 줄 때만 힘이 있다. 끝까지 듣게 만드는 게 내 일이다.",
      gesture: "백아린은 반론을 들으면 태블릿의 수정 이력을 한 칸 뒤로 넘긴다. 이미 생각해 본 반론이라는 뜻이다.",
      voice: "빠르고 정확하고 친절하다. 숫자를 먼저 말하고, 감정은 퍼센트로 말한다.",
      line: "좋은 이야기는 사실보다 오래 갑니다.",
    },
    신이안: {
      role: "광고 감독 · KD 혁신위원회 캠페인 연출",
      stance: "장면 · 진짜처럼 보이는 것",
      job: "혁신위원회 광고를 찍는다. 누가 진짜인지보다 누가 진짜처럼 보이는지를 먼저 안다.",
      appearance: "무릎이 나온 작업 바지, 목에 건 스톱워치, 모니터 자국이 남은 코끝.",
      thought: "진짜는 한 번에 찍힌다. 열일곱 번 찍어야 하는 얼굴은 뭔가를 참고 있는 얼굴이다.",
      gesture: "신이안은 마음에 드는 장면을 보면 모니터에 코가 닿을 만큼 얼굴을 붙인다.",
      voice: "밝고 빠르게 말하고, 칭찬과 재촬영을 같은 문장에 넣는다.",
      line: "좋아요, 너무 좋아요. 한 번만 더 갈게요. 이번엔 진짜처럼요.",
    },
    곽민재: {
      role: "보조출연자 · 전 플로우온 야간조",
      stance: "생계 · 웃는 역",
      job: "혁신위원회 광고에서 '배상받고 다시 일어선 소상공인'을 연기한다. 실제로는 배상 기준 어디에도 없는 사람이다.",
      appearance: "보조출연용 빌린 셔츠, 야간조 시절의 안전화, 입금 문자를 캡처해 둔 휴대폰.",
      thought: "카메라 앞에서는 웃으면 돈을 준다. 카메라 밖에서는 아무도 안 준다.",
      gesture: "곽민재는 곤란하면 먼저 웃는다. 웃고 나서야 목소리를 낮춘다.",
      voice: "강태민에게는 '형', 나머지에게는 깍듯한 존댓말. 농담처럼 말하고 끝에 진짜 질문을 붙인다.",
      line: "은행 광고에선 저는 늘 웃는 손님이에요. 진짜 은행에선 한 번도 못 웃어 봤는데.",
    },
  },
  setting: { place: "KD금융그룹 본사 33층 · 그룹전략실", clock: "출범 생중계까지 D-6" },
  sceneContext: {
    c13_start: {
      place: "KD금융그룹 본사 33층 · 그룹전략실",
      clock: "10월 초 · 출범 생중계까지 D-6",
      question: "212명과 동료들의 자리를 대가로 '과거는 정리됐다'고 말해 달라는 제안입니다. 무엇부터 하겠습니까?",
      lead: "추석 떡 냄새가 아직 옷에 남은 아침, 33층 엘리베이터 문이 열리자 처음 보는 사람이 먼저 인사합니다.",
    },
    c13_start_warm: {
      place: "KD금융그룹 본사 33층 · 그룹전략실",
      clock: "10월 초 · 출범 생중계까지 D-6",
      question: "어제 떡을 받은 사람들이 오늘도 가게 앞에 있습니다. 이 제안에 어떻게 답하겠습니까?",
      lead: "셔터를 내리고 떡집을 나선 게 자정이었는데, 아침 9시에 33층 비서실의 전화가 왔습니다.",
    },
    c13_start_record: {
      place: "KD금융그룹 본사 33층 · 그룹전략실",
      clock: "10월 초 · 출범 생중계까지 D-6",
      question: "당신이 쓴 개정안이 광고 소품 목록에 올라 있습니다. 그 문서를 어떻게 되찾겠습니까?",
      lead: "밤새 고친 개정안을 서류 봉투에 넣어 들고 갔는데, 33층 회의 탁자에 같은 문서가 먼저 놓여 있습니다.",
    },
    c13_start_rush: {
      place: "KD금융그룹 본사 33층 · 그룹전략실",
      clock: "배상 입금일 밤 · 출범 생중계까지 D-7",
      question: "문성호 대표 몫이던 떡 상자가 광고 시안이 되려 합니다. 이 자리에서 무엇을 못 박겠습니까?",
      lead: "떡집 앞 줄을 두고 올라온 33층, 로비 보안요원이 떡 하나를 얻어 간 상자를 아직 들고 있습니다.",
    },
    c13_studio: {
      place: "성수동 광고 스튜디오 · 촬영장",
      clock: "촬영일 · 생중계까지 D-5",
      question: "열여덟 번째 테이크에서 '과거는 모두 정리되었습니다'가 프롬프터에 떴습니다. 어떻게 하겠습니까?",
      lead: "33층 제안 사흘 뒤, 백아린이 '세트만 보고 가시라'며 보낸 검은 승합차가 트리거랩 앞에 서 있었습니다.",
    },
    c13_branch_extras: {
      place: "성수동 광고 스튜디오 · 보조출연 대기실",
      clock: "촬영일 · 점심시간",
      question: "피해자 역할의 보조출연자 가운데 야간조 후배가 있습니다. 이 대기실에서 무엇을 하겠습니까?",
    },
    c13_branch_extras_follow: {
      place: "성수동 광고 스튜디오 · 주차장",
      clock: "촬영일 · 18시",
      question: "일당 6만 4천 원을 받은 곽민재가 로봇 소문을 전합니다. 그를 어떻게 하겠습니까?",
    },
    c13_script: {
      place: "성수동 광고 스튜디오 · 분장실",
      clock: "촬영일 · 15시 휴식",
      question: "잊지 않겠다는 문장은 41%, 정리됐다는 문장은 68%였습니다. 어느 숫자와 싸우겠습니까?",
    },
    c13_script_reaction: {
      place: "성수동 골목 · 스튜디오 앞 주차장",
      clock: "촬영일 · 19시",
      question: "30년 동안 정리된 대출은 하나도 없었다고 나준혁이 말합니다. 그 말을 어떻게 받겠습니까?",
    },
    c13_market: {
      place: "망원시장 가을떡방",
      clock: "생중계까지 D-3 · 20시",
      question: "문가을이 남편 사진 옆에서 당신 명함을 뗐습니다. 이 가게에서 무엇을 하겠습니까?",
      lead: "예고편이 나간다는 문자를 받고 떡집으로 뛰었지만, 문을 열었을 때 광고는 이미 시작되고 있었습니다.",
    },
    c13_rumor: {
      place: "망원시장 · 채소 가게 앞",
      clock: "생중계까지 D-2 · 오전 장",
      question: "시장 할머니들이 '그래서 누구 편이냐'고 묻습니다. 오진우 대신 무엇이라고 답하겠습니까?",
    },
    c13_rumor_reaction: {
      place: "트리거랩 옥상",
      clock: "생중계까지 D-2 · 23:00",
      question: "복귀 명단에 한서윤과 트리거랩이 없습니다. 이 명단을 어떻게 하겠습니까?",
    },
    c13_lab: {
      place: "트리거랩 4층 분석관실",
      clock: "생중계 전날 · 21시",
      question: "동료들이 폰으로 찍은 '진짜 대본'이 완성됐습니다. 이 영상을 어디에 쓰겠습니까?",
      lead: "생중계를 하루 앞둔 밤, 4층 불이 아직 켜져 있어 올라가 보니 모두가 노트북 한 대 앞에 모여 있습니다.",
    },
    c13_offer: {
      place: "트리거랩 4층 분석관실 · 야간",
      clock: "생중계 전날 · 23:40",
      question: "영상 20초와 마지막 문장을 맞바꾸자는 제안이 커피와 함께 왔습니다. 어떻게 답하겠습니까?",
    },
    c13_offer_reaction: {
      place: "트리거랩 4층 · 탕비실",
      clock: "생중계 당일 · 01:10",
      question: "명함을 다시 붙일지는 내일 뒤에 정하겠다는 문자가 왔습니다. 어떻게 답하겠습니까?",
    },
    c13_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "생중계까지 D-5",
      question: "위원회 23곳의 권고 186건 중 17건만 끝까지 갔습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c13_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "생중계 당일 · 새벽",
      question: "위원회가 14개월 만에 사라지지 않게 할 조건을 하나 넣을 수 있다면, 무엇을 넣겠습니까?",
    },
    c13_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 회계 원장",
      clock: "생중계 당일 · 07시",
      question: "혁신위원회 예산과 트리거랩 정리 비용이 같은 코드를 씁니다. 이 번호를 어떻게 쓰겠습니까?",
    },
    c13_final: {
      place: "성수동 광고 스튜디오 · 생방송 세트장",
      clock: "생중계 당일 · 19:59",
      question: "11만 명이 보는 생방송, 프롬프터 마지막 줄은 그대로입니다. 무엇이라고 말하겠습니까?",
      lead: "승합차에서 내리자 스튜디오 입구에 '생방송 중 출입 금지' 빨간 불이 이미 켜져 있습니다.",
    },
    c13_aftershock: {
      place: "성수동 광고 스튜디오 · 철수하는 세트장",
      clock: "생중계 당일 · 22시",
      question: "클립이 돌고 백아린이 다음 상품 이야기를 꺼냅니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c13-committee-code",
    title: "예산의 번호",
    text: "혁신위원회 예산 38억과 트리거랩 정리 비용이 같은 비용 코드 SP-0412를 씁니다. 코드 끝 네 자리는 3년 전 대출번호와 같습니다.",
  },
  outcomes: {
    c13_after_warm: { tag: "스탠드를 나른 결말", title: "조명이 다 꺼질 때까지 동료들과 세트장에 남았다", text: "생방송이 끝난 밤, 스탠드 네 개와 컵라면 여덟 개가 남았습니다. 무슨 말을 했든, 그 말을 들은 사람들과 같은 트럭을 탔습니다." },
    c13_after_record: { tag: "제안을 남긴 결말", title: "33층의 제안이 빈 서명란까지 문서가 됐다", text: "출연 제안의 날짜와 조건과 대가가 문서로 남았습니다. 위원회가 당신의 얼굴로 무엇을 사려 했는지, 이제 누구든 읽을 수 있습니다." },
    c13_after_rush: { tag: "먼저 캐낸 결말", title: "'상생'이라는 이름의 다음 상품을 먼저 찾아 나섰다", text: "세트장이 식기도 전에 '상생 ESG' 폴더를 열었습니다. 다음 싸움은 먼저 찾았고, 오늘 밤 동료들 곁에는 없었습니다." },
  },
  carryovers: {
    c13_after_warm: { trust: 9, humanCost: -4, fatigue: -8 },
    c13_after_record: { legitimacy: 12, trust: 3, fatigue: 5 },
    c13_after_rush: { capital: 7, legitimacy: 3, trust: -8 },
  },
  continuityChallenges: {
    c12_after_feast: { id: "protect-trust", title: "떡을 받은 사람들 앞에 서기", text: "어제 떡을 받은 1,021명이 오늘 광고 속 당신 얼굴을 봅니다. 그들 앞에서 설명할 수 있는 선택을 찾아야 보너스가 열립니다." },
    c12_after_fund: { id: "use-reframe", title: "소품이 된 개정안 되찾기", text: "212명을 위해 쓴 문서가 광고 소품 목록에 올랐습니다. 그 문서가 누구를 위한 것인지 판을 다시 짜야 합니다." },
    c12_after_meet: { id: "repair-legitimacy", title: "떡 상자 한 장면의 공정함 회복하기", text: "먼저 올라간 33층에서 문성호 대표 몫의 상자가 광고 시안이 됐습니다. 그 장면을 피해자들에게 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
