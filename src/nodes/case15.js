/**
 * CASE 15 -- the authored scenes of 이민서's permanent-contract review.
 *
 * 이민서 has been the season's easiest name to write down. In 사건 02 the access
 * logs pointed at her because she was a contract worker up for renewal, and the
 * eleven missing seconds in those logs -- the gap in which someone else changed
 * page 3 of the 플로우온 review -- were what cleared her, later read aloud in
 * the 국정감사. Now the bank offers her the permanent job she has waited three
 * years for. The seventh page of the offer is a confirmation she must sign:
 * the eleven seconds were her own keyboard mistake. The interview is at 08:40
 * on the morning of her younger brother's 수능.
 *
 * The case is the third act's argument made small. The group does not push the
 * loss onto her by force; it offers her a desk, and the form it hands down has
 * no box to refuse in and no department name on it -- the same blank signature
 * box, one floor lower. The people carrying the paper are decent: 채윤슬 in HR
 * signed the same kind of page seven years ago to get in, and has been waiting
 * to change things from inside ever since. The evidence turn shows that twelve
 * contract workers got twelve different incidents and one identical sentence.
 *
 * Emotionally it runs from the joy of a business-card mock-up that 반재욱 --
 * the auditor who once wrote her name on the first line of a report -- prints
 * on the audit team's printer, to the whole lab turning into a cheering squad
 * at a school gate on exam morning, to the gate closing twenty steps in front
 * of her with her brother's lunch in her hand. The final choice is hers as much
 * as the analyst's: fight, sign and change it from inside, or show the paper.
 */
export const case15Nodes = {
  c15_start: {
    phase: "CASE 15 BRIEFING",
    title: "7쪽짜리 축하",
    speaker: "채윤슬",
    text:
      "11월 둘째 주 금요일, 트리거랩 4층에 처음 보는 사람이 귤 한 봉지를 들고 내려옵니다. KD은행 인사부 채용 담당 채윤슬 과장입니다. '지하는 처음 와 봐요. 좋은 소식 들고 왔어요!' 그가 이민서에게 봉투를 건넵니다. 정규직 전환 서류 심사 통과, 최종 면접은 다음 주 목요일 오전 8시 40분. 3년 만입니다. 오진우가 제일 먼저 박수를 칩니다. 그런데 서류는 7쪽이고, 마지막 쪽은 확인서입니다. '유출 소동 당시 접속 기록의 11초 공백은 본인의 단말 조작 실수로 생긴 것임을 확인합니다.' 이민서가 책상 달력을 봅니다. 목요일에는 빨간 동그라미가 이미 그려져 있습니다. 동생의 수능 날입니다. 채윤슬의 웃음이 한 박자 늦게 사라집니다. '날짜는 제가 못 바꿔요. 그 종이도요.'",
    memo: [
      "정규직 전환 최종 면접: 다음 주 목요일 08:40, 본점 인사부",
      "제출 서류 7쪽 -- 마지막 쪽 확인서 서명 필수",
      "확인서 대상: 유출 소동 당시 접속 기록의 11초 공백",
      "같은 날 08:10 수능 입실 마감 -- 동생 이서준, 고3",
    ],
    triggers: ["injustice", "affection", "choice"],
    choices: [
      {
        id: "c15_start_ask",
        label: "서류보다 먼저 이민서에게 무엇을 원하는지 묻는다",
        effect: { trust: 12, humanCost: -5, time: -6, capital: -3, fatigue: 5 },
        next: "c15_form",
        cognition: { persistence: 2 },
      },
      {
        id: "c15_start_compare",
        label: "확인서 문장을 유출 사건 기록과 한 줄씩 대조한다",
        effect: { legitimacy: 11, time: -5, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c15_form",
        cognition: { inference: 2 },
      },
      {
        id: "c15_start_prep",
        label: "3년 만의 기회라며 면접 준비부터 돕는다",
        effect: { capital: 8, time: 5, legitimacy: -6, trust: -2, humanCost: 4, fatigue: -2 },
        next: "c15_form",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c15_form",
      },
    ],
  },
  c15_form: {
    phase: "THE FORM",
    title: "반려 칸이 없는 양식",
    speaker: "채윤슬",
    text:
      "본점 12층 인사부 면담실. 채윤슬이 확인서를 다시 펼쳐 놓고 한 문장씩 읽어 줍니다. 마지막 두 줄에서 목소리가 작아집니다. '본인은 위 사실과 관련하여 향후 어떠한 이의도 제기하지 않습니다. 본 확인서는 전환 심사의 참고 자료로만 사용됩니다.' 이민서가 묻습니다. '참고 자료인데, 서명 안 하면 왜 탈락이에요?' 채윤슬이 모니터를 돌립니다. 위에서 내려온 사내 메일에는 보낸 부서 이름이 없고, 그가 누를 수 있는 버튼은 '전달 완료' 하나뿐입니다. '반려 칸이 없어요. 제 양식에는요.' 리드라인 기사와 국정감사(국회가 공개적으로 따져 묻는 자리)에서 '누군가 고친 흔적'으로 불린 11초가, 이 종이 한 장이면 계약직 한 사람의 손가락 실수가 됩니다. 채윤슬이 작게 덧붙입니다. '문구 조정 요청은 한 번 올릴 수 있어요. 오늘 18시까지요.'",
    memo: [
      "확인서 마지막 줄: '향후 어떠한 이의도 제기하지 않습니다'",
      "발신 부서 표시 없음 -- 채윤슬의 처리 버튼은 '전달 완료' 하나",
      "문구 조정 요청 기회 1회, 오늘 18시 마감",
      "서명 거부 시 전환 심사 자동 탈락",
    ],
    triggers: ["injustice", "system", "helplessness"],
    choices: [
      {
        id: "c15_form_refuse",
        label: "이민서와 나란히 앉아 확인서 없이 면접을 보겠다고 버틴다",
        effect: { trust: 11, legitimacy: 4, capital: -6, time: -5, fatigue: 6 },
        next: "c15_rooftop",
        cognition: { persistence: 2 },
      },
      {
        id: "c15_form_amend",
        label: "'조작 실수'를 '원인 미상'으로 고치는 문구 조정 요청서를 쓴다",
        effect: { legitimacy: 12, time: -6, trust: -4, humanCost: 3, fatigue: 4 },
        next: "c15_rooftop",
        cognition: { inference: 2 },
      },
      {
        id: "c15_form_ask",
        label: "채윤슬을 따로 불러 그도 이 종이를 받아 본 적이 있는지 묻는다",
        effect: { trust: 9, humanCost: -4, legitimacy: 3, time: -7, capital: -2, fatigue: 3 },
        next: "c15_rooftop",
        cognition: { reframing: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c15_rooftop",
      },
    ],
  },
  c15_rooftop: {
    phase: "HOME",
    title: "명함 시안 100장",
    speaker: "이민서",
    text:
      "수능 이틀 전 저녁, 해방촌 옥탑방 평상에 트리거랩 사람들이 모였습니다. 가운데에는 문가을이 '붙으라고' 보낸 찹쌀떡 한 상자가 있습니다. 이서준은 헤드폰을 쓴 채 꾸벅 인사만 하고 방으로 들어갑니다. 그때 반재욱이 서류봉투를 내밉니다. 안에는 명함 100장. 'KD은행 데이터관리부 이민서.' '시안입니다. 감사팀 프린터로 뽑았으니 경위서는 제가 씁니다.' 유출 소동 때 이민서의 이름을 보고서 첫 줄에 적었던 사람입니다. 이민서가 명함 한 장을 오래 들여다봅니다. 모두 돌아간 뒤, 그가 평상에 남아 말합니다. '그 11초에 저 응급실에 있었어요. 서준이 맹장이 터져서요. 진료 기록을 내면 끝나요. 근데 거기 서준이 이름이 있어요. 걔는 그날 밤이 자기 탓인 줄 알아요. 시험 이틀 전에 그 얘기를 꺼내고 싶지 않아요.'",
    memo: [
      "명함 시안 100장 -- 반재욱이 감사팀 프린터로 인쇄",
      "그 11초: 이민서는 이음병원 응급실에 보호자로 있었음",
      "진료 기록의 환자 이름: 이서준",
      "수능 입실까지 38시간",
    ],
    triggers: ["affection", "protection", "selfAwareness"],
    choices: [
      {
        id: "c15_rooftop_shield",
        label: "서준의 기록은 쓰지 않고 다른 증거로 싸우자고 한다",
        effect: { trust: 12, humanCost: -5, legitimacy: -3, time: -5, fatigue: 6 },
        next: "c15_gate",
        cognition: { persistence: 2 },
      },
      {
        id: "c15_rooftop_consent",
        label: "수능이 끝난 뒤 서준의 동의를 받아 진료 기록을 내자고 한다",
        effect: { legitimacy: 11, trust: 4, time: -7, humanCost: 2, fatigue: 4 },
        next: "c15_gate",
        cognition: { inference: 2 },
      },
      {
        id: "c15_rooftop_now",
        label: "내일 바로 진료 기록을 떼어 문구 조정 요청에 붙인다",
        effect: { legitimacy: 6, capital: 5, time: 5, trust: -4, humanCost: 4, fatigue: -2 },
        next: "c15_gate",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c15_gate",
      },
    ],
  },
  c15_gate: {
    phase: "THE GATE",
    title: "08시 10분",
    speaker: "강태민",
    text:
      "수능 날 아침 7시 40분, 영하 2도. 용산 은강고 교문 앞에 트리거랩 응원단이 섭니다. 강태민은 핫팩 박스를 뜯어 지나가는 수험생마다 두 개씩 쥐여 주다가 '저희 이 학교 아닌데요'라는 말을 스무 번 듣고, 스무 번 다 '추운 건 똑같아' 하며 또 줍니다. 오진우는 옆 학교 응원 소리가 더 크다며 목이 쉬도록 외치고, 나준혁의 피켓 '찍어도 붙는다'는 학부모들의 인증 사진 명소가 됩니다. 서준은 7시 50분에 들어갔습니다. 8시 2분, 비탈길 아래에서 이민서가 뛰어옵니다. 손에 보온 도시락 가방이 들려 있습니다. 서준이 평상에 두고 간 것입니다. 8시 10분, 스무 걸음을 남기고 교문이 닫힙니다. 경찰관이 미안한 얼굴로 고개를 젓습니다. 면접까지 30분 남았습니다.",
    memo: [
      "입실 마감 08:10 -- 이민서 도착 08:10:14",
      "도시락: 소고기뭇국과 계란말이, 뚜껑에 쪽지 한 장",
      "본점 인사부 면접 08:40 -- 지하철로 32분",
      "나준혁 피켓, 학부모 인증 사진 47장",
    ],
    triggers: ["affection", "helplessness", "choice"],
    choices: [
      {
        id: "c15_gate_stay",
        label: "면접이 늦어져도 좋다며 이민서가 숨을 고를 때까지 곁에 선다",
        effect: { trust: 12, humanCost: -5, legitimacy: -2, time: -5, fatigue: 5 },
        next: "c15_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c15_gate_office",
        label: "시험장 본부에 도시락 전달 절차가 있는지 정식으로 묻는다",
        effect: { legitimacy: 10, trust: 3, time: -7, humanCost: 2, fatigue: 3 },
        next: "c15_final",
        cognition: { inference: 2 },
      },
      {
        id: "c15_gate_taxi",
        label: "도시락은 든 채 택시를 잡아 면접장으로 곧장 달린다",
        effect: { time: 7, capital: 4, trust: -3, legitimacy: -3, humanCost: 2, fatigue: -3 },
        next: "c15_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c15_final",
      },
    ],
  },
  c15_final: {
    phase: "FINAL DECISION",
    title: "만년필 한 자루",
    speaker: "이민서",
    text:
      "면접실 긴 테이블 건너편에 면접관 넷이 앉아 있습니다. 인사부장, 데이터관리부장, 그룹전략실 백아린, 그리고 간사석의 채윤슬. 이민서 앞에는 확인서와 만년필 한 자루가 놓여 있습니다. 당신은 추천서를 쓴 사람으로 벽 쪽 의자에 앉았습니다. 인사부장이 부드럽게 말합니다. '서명해 주시면 결과는 오늘 오후에 나옵니다.' 이 시각 은강고 3층에서는 1교시 국어 시험이 20분째 이어지고 있습니다. 이민서가 만년필을 들었다가 내려놓고, 당신을 돌아봅니다. '제가 뭘 고르든 존중해 주실 거죠? 근데 하나만요. 서준이한테 거짓말하는 누나는 되기 싫어요.' 그의 코트 주머니에 명함 시안 한 장이 꽂혀 있습니다. 백아린이 손목시계를 한 번 봅니다.",
    memo: [
      "면접관 4명 -- 백아린 포함, 채윤슬은 간사",
      "서명 시: 정규직 전환, 11초는 '본인 실수'로 공식 종결",
      "거부 시: 자동 탈락, 계약 만료까지 4개월",
      "같은 양식을 받은 전환 대상 계약직 12명",
    ],
    triggers: ["choice", "injustice", "affection"],
    choices: [
      {
        id: "c15_final_fight",
        label: "서명하지 말고 11초를 끝까지 같이 싸우자고 말한다",
        effect: { legitimacy: 12, trust: 8, capital: -9, time: -8, humanCost: 3, fatigue: 6 },
        next: "case15_result",
        cognition: { persistence: 2, reframing: 1 },
      },
      {
        id: "c15_final_respect",
        label: "서명하고 안에서 바꾸겠다는 이민서의 선택을 존중한다",
        effect: { trust: 10, capital: 9, humanCost: -4, legitimacy: -8, time: 5, fatigue: 3 },
        next: "case15_result",
        cognition: { reframing: 2 },
      },
      {
        id: "c15_final_publish",
        label: "확인서 자체를 면접실 밖 세상에 공개한다",
        effect: { legitimacy: 10, trust: 2, capital: -4, time: 5, humanCost: 4, fatigue: -2 },
        next: "case15_result",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case15_result",
      },
    ],
  },
};

/**
 * Everything else case 15 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case15 = {
  id: "case15",
  nodes: case15Nodes,
  aftermath: {
    c15_aftershock: {
      phase: "AFTERMATH",
      title: "식은 도시락",
      speaker: "이서준",
      text: "17시 45분, 교문이 다시 열립니다. 나준혁이 피켓을 뒤집어 듭니다. 뒷면에는 '찍은 거 다 맞았다.' 수험생 무리 속에서 이서준이 나옵니다. 이민서를 보자마자 묻습니다. '누나, 면접은?' 이민서가 대답 대신 도시락 가방을 내밉니다. 뭇국은 식었고 세 숟가락이 비어 있습니다. 서준이 웃습니다. '점심은 감독관 선생님이 초코바 줬어. 옆자리 애가 김밥 반 줄 주고.' 남매가 교문 계단에 앉아 식은 뭇국을 나눠 먹습니다. 강태민이 남은 핫팩을 두 사람 무릎에 하나씩 올려 줍니다. 그러다 자기 휴대폰을 보고 표정이 굳습니다. 풀필먼트센터(주문받은 물건을 보관하고 포장해 내보내는 물류 창고) 야간조 단체방입니다.",
      memo: ["수능 종료 17:45 -- 이서준, 마지막 교시까지 마침", "도시락: 세 숟가락 빈 소고기뭇국", "나준혁 피켓 뒷면: '찍은 거 다 맞았다'", "강태민에게 온 풀필먼트센터 단체 문자"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c15_after_warm", label: "교문 계단에서 식은 도시락을 남매와 끝까지 나눠 먹는다", effect: { trust: 13, humanCost: -6, time: -3, capital: -2, fatigue: -8 }, next: "case15_result", cognition: { reframing: 2 } },
        { id: "c15_after_record", label: "계약직 확인서 관행을 없앨 개선안을 문서로 남긴다", effect: { legitimacy: 14, trust: 4, time: -5, capital: -3, fatigue: 5 }, next: "case15_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c15_after_rush", label: "강태민이 받은 문자를 따라 곧장 다음 현장으로 간다", effect: { capital: 8, legitimacy: 5, trust: -7, humanCost: 5, fatigue: 6 }, next: "case15_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c15_final", "c15_aftershock"],
  connectiveScenes: [
    ["c15_report", "c15_form", "c15_rooftop", "근거 자료 1번", "오진우", "밤 열한 시, 오진우가 확인서의 첨부 목록을 인쇄해 들고 옵니다. 근거 자료 1번: '유출 사건 1차 분석 보고서 -- 작성자 오진우.' 유출 소동 때 그가 이틀 만에 써서 올린 초안입니다. 결론 칸에는 '이민서 단독 유출 가능성 높음'이라고 적혀 있습니다. 11초가 드러나면서 폐기된 줄 알았던 그 보고서가, 인사부 서버에서 첨부 파일로 멀쩡히 살아 있습니다. 오진우가 넥타이를 느슨하게 풉니다. '제가 빨랐죠. 그때는 빠른 게 이기는 거라고 생각했거든요. 이 보고서, 제 손으로 끝내야겠어요.'", ["확인서 근거 자료 1번: 오진우의 1차 분석 보고서", "결론: '이민서 단독 유출 가능성 높음'", "폐기 기록 없음 -- 인사부 서버에 원본 보관"], ["오진우와 함께 이민서에게 그 보고서부터 사과하러 간다", "오진우 이름으로 보고서 철회서를 공식 접수하게 한다", "철회는 면접 뒤로 미루고 지금은 조용히 있자고 한다"]],
    ["c15_picket", "c15_rooftop", "c15_gate", "찍어도 붙는다", "나준혁", "수능 전날 밤, 트리거랩 탕비실이 응원 도구 공장이 됩니다. 영동에서 올라온 나준혁이 붓펜으로 피켓을 씁니다. '찍어도 붙는다.' 30년 도장 찍던 손이라 글씨가 관공서 현판처럼 반듯합니다. 한서윤이 '찍는다는 말, 교문 앞에서 괜찮을까요?' 하자 나준혁이 귀퉁이에 작게 '도장 얘기입니다'라고 덧붙입니다. 강태민은 핫팩 200개를 박스째 메고 들어오고, 권도현은 1인당 적정 핫팩 수를 계산하다 '이건 적자가 아니라 과잉입니다'라고 선언합니다. 웃음이 잦아들 무렵 도윤하가 지도를 펼칩니다. 고사장에서 본점까지 지하철로 32분. 입실 마감 8시 10분, 면접 8시 40분. 둘 다 지키려면 누군가는 한쪽을 놓아야 합니다.", ["피켓 6장 -- 나준혁의 붓펜 글씨", "핫팩 200개 -- 강태민 자비", "고사장에서 본점까지 지하철 32분, 여유 없음"], ["전원이 교문에 갔다가 이민서와 함께 면접장까지 간다", "교문 조와 면접 조로 나눠 역할표를 짠다", "응원은 짧게 맡겨 두고 나머지는 일찍 자고 면접장으로 간다"]],
    ["c15_lunchbox", "c15_gate", "c15_final", "틀려도 돼", "이민서", "을지로로 가는 택시 뒷자리에서 이민서가 도시락 가방을 무릎에 올려놓습니다. 새벽 다섯 시에 끓인 소고기뭇국이 아직 따뜻합니다. 뚜껑에는 그가 붙인 쪽지가 있습니다. '틀려도 돼. 누나도 많이 틀렸어.' 이민서가 쪽지를 읽다가 웃고, 웃다가 웁니다. 그러다 숟가락을 꺼냅니다. '저 아침을 못 먹었어요. 이거 먹고 들어가도 돼요? 서준이도 이해할 거예요.' 세 숟가락째에 채윤슬의 문자가 옵니다. '면접관 한 분이 바뀌었어요. 그룹전략실 백아린 차장님이 들어오세요.'", ["면접 시작까지 16분", "면접관 교체: 그룹전략실 백아린", "도시락 뚜껑의 쪽지: '틀려도 돼'"], ["택시 안에서 이민서가 하고 싶은 말만 같이 정리한다", "인사 면접에 그룹전략실이 들어올 근거를 규정에서 찾는다", "백아린에게 먼저 전화해 원하는 게 뭔지 떠본다"]],
  ],
  connectiveOrder: [["c15_form", "c15_report"], ["c15_rooftop", "c15_picket"], ["c15_gate", "c15_lunchbox"]],
  choiceEffects: {
    c15_form: [
      { trust: 12, humanCost: -5, legitimacy: 3, time: -4, capital: -2, fatigue: 5 },
      { legitimacy: 10, trust: 3, time: -6, humanCost: 2, fatigue: 4 },
      { time: 6, capital: 4, trust: -4, humanCost: 3, fatigue: -3 },
    ],
    c15_rooftop: [
      { trust: 11, humanCost: -4, capital: -4, time: -5, fatigue: 5 },
      { legitimacy: 7, trust: 4, time: -4, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 3, trust: -4, humanCost: 3, fatigue: -4 },
    ],
    c15_gate: [
      { trust: 11, humanCost: -5, time: -3, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: 2, time: -5, humanCost: 2, fatigue: 4 },
      { time: 5, capital: 5, legitimacy: 2, trust: -4, humanCost: 3, fatigue: -4 },
    ],
  },
  choiceCopy: {
    c15_form: {
      voice: ["오진우와 함께, 이민서에게 그 보고서부터 사과하러 간다.", "오진우 이름으로, 보고서 철회서를 공식 접수하게 한다.", "철회는 면접 뒤로 미루고, 지금은 조용히 있자고 한다."],
      echo: ["사과를 들은 이민서가 한참 있다가 말합니다. '그 보고서 덕에 11초를 찾은 거잖아요. 반은 고마워요. 반만요.'", "철회서는 접수 번호를 받습니다. 오진우의 이름이 처음으로, 공식적으로 틀린 쪽에 적힙니다.", "조용히 있으면 면접관들은 첨부 1번을 읽고 들어옵니다. 오진우는 그날 밤 자기 보고서를 세 번 다시 읽습니다."],
    },
    c15_rooftop: {
      voice: ["전원이 교문에 갔다가, 이민서와 함께 면접장까지 간다.", "교문 조와 면접 조로 나눠, 역할표를 짠다.", "응원은 짧게 맡겨 두고, 나머지는 일찍 자고 면접장으로 간다."],
      echo: ["전원이 움직이면 그날 오전 트리거랩은 비어 있습니다. 33층은 그 빈자리를 기록해 둡니다.", "역할표는 반듯합니다. 그런데 이민서의 이름은 어느 조에도 없어서, 그는 자기가 어디 서야 할지 모릅니다.", "일찍 자면 아침은 가볍습니다. 교문 앞에는 피켓이 한 장만 올라갑니다."],
    },
    c15_gate: {
      voice: ["택시 안에서, 이민서가 하고 싶은 말만 같이 정리한다.", "인사 면접에 그룹전략실이 들어올 근거를, 규정에서 찾는다.", "백아린에게 먼저 전화해, 원하는 게 뭔지 떠본다."],
      echo: ["정리한 말은 세 문장입니다. 이민서가 그중 두 문장을 지우고 하나만 남깁니다.", "규정에는 '필요시 관계 부서 참여 가능'이라는 한 줄이 있습니다. 누가 필요를 판단하는지는 적혀 있지 않습니다.", "백아린은 두 번째 신호에 받습니다. '좋은 아침이에요. 면접장에서 뵈면 되겠네요.' 그리고 먼저 끊습니다."],
    },
  },
  reactionScenes: [
    ["c15_report_reaction", "c15_report", "c15_rooftop", "초당 1,700만 원", "권도현", "다음 날 아침, 권도현이 탕비실 화이트보드에 세로줄을 긋습니다. 왼쪽은 서명할 때, 오른쪽은 안 할 때. 정규직과 계약직의 연봉 차이, 성과급, 퇴직금, 가족 학자금 지원까지 30년 치를 더합니다. '서명의 값은 1억 9천만 원입니다. 11초로 나누면 초당 약 1,700만 원. 제가 본 가장 비싼 11초입니다.' 컵라면을 들고 지나가던 강태민이 멈춥니다. '그럼 서명 안 하면 1억 9천을 버리는 거네.' 권도현이 고개를 젓습니다. '아뇨. 서명하면 11초를 파는 겁니다. 그 11초 안에는 다른 사람 이름이 들어 있고요. 그 칸은 제가 값을 못 매깁니다.'", ["계산서를 이민서에게 보여 주고 판단을 맡긴다", "11초에 들어 있는 다른 사람 이름부터 찾자고 한다", "1억 9천이면 서명할 만하다고 솔직히 말한다"]],
    ["c15_picket_reaction", "c15_picket", "c15_gate", "나 때문에 쓰는 거야?", "이서준", "자정이 넘어 이민서의 번호로 전화가 옵니다. 목소리는 이서준입니다. '누나 씻는 중이에요. 저기, 이거 물어봐도 돼요?' 식탁에 놓인 확인서 사본을 봤다고 합니다. '11초, 그날 밤이죠. 나 응급실 갔던 날.' 한참 숨소리만 들립니다. '누나 이거 나 때문에 쓰는 거예요? 나 대학 가라고?' 입실까지 일곱 시간 반 남았습니다. 전화기 너머에서 욕실 물소리가 멈춥니다.", ["서준에게 사실대로 말해 주고 누나 편이 되어 달라고 한다", "누나가 직접 말할 수 있게 전화를 넘겨 달라고 한다", "시험 끝나고 얘기하자며 지금은 자라고 한다"]],
    ["c15_lunchbox_reaction", "c15_lunchbox", "c15_final", "좋은 이야기", "백아린", "본점 1층 엘리베이터 앞에서 백아린이 기다리고 있습니다. 회색 코트에 태블릿 하나. '이민서 씨, 오늘 수능이시죠. 동생분 잘 보길 바랄게요.' 진심처럼 들립니다. 엘리베이터 문이 닫히자 그가 화면을 보여 줍니다. 그룹이 여론을 돌리려 만든 혁신위원회의 보도자료 초안입니다. '계약직 12명 전원 정규직 전환 -- 과거 사고는 모두 정리되었습니다.' '서명해 주시면 이게 오늘 오후에 나가요. 12명이 같이 들어가요. 좋은 이야기는 사실보다 오래 가거든요.' 12층 버튼에 불이 들어옵니다.", ["12명 전원의 확인서를 먼저 보여 달라고 한다", "보도자료 초안을 면접 기록에 첨부해 달라고 요구한다", "좋은 이야기라면 12명을 위해 받아들이자고 한다"]],
  ],
  reactionEffects: {
    c15_report: [
      { trust: 10, humanCost: -4, time: -4, fatigue: 4 },
      { legitimacy: 8, trust: 2, capital: -4, time: -3, fatigue: 3 },
      { time: 4, capital: 4, trust: -3, humanCost: 3, fatigue: -3 },
    ],
    c15_picket: [
      { trust: 10, humanCost: -5, legitimacy: 2, time: -2, fatigue: 4 },
      { legitimacy: 7, trust: 5, time: -4, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 3, trust: -4, humanCost: 3, fatigue: -3 },
    ],
    c15_lunchbox: [
      { trust: 9, legitimacy: 4, humanCost: -4, time: -4, fatigue: 4 },
      { legitimacy: 10, trust: -2, time: -3, capital: -3, fatigue: 3 },
      { capital: 6, time: 4, trust: -3, legitimacy: -4, humanCost: 3, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c15_report: {
      voice: ["계산서를 이민서에게 보여 주고, 판단을 맡긴다.", "11초에 들어 있는 다른 사람 이름부터, 찾자고 한다.", "1억 9천이면, 서명할 만하다고 솔직히 말한다."],
      echo: ["계산서를 받은 이민서가 오른쪽 칸 맨 아래에 한 줄을 씁니다. '서준이 등록금 4년.' 권도현이 그 줄을 조용히 왼쪽에도 옮겨 적습니다.", "이름을 찾으려면 인사부 서버가 아니라 그 새벽의 기록 원본이 필요합니다. 원본은 면접보다 늦게 나옵니다.", "솔직한 말에 방이 조용해집니다. 권도현은 화이트보드를 지우지 않고 그대로 둡니다."],
    },
    c15_picket: {
      voice: ["서준에게 사실대로 말해 주고, 누나 편이 되어 달라고 한다.", "누나가 직접 말할 수 있게, 전화를 넘겨 달라고 한다.", "시험 끝나고 얘기하자며, 지금은 자라고 한다."],
      echo: ["사실을 들은 서준이 '그럼 누나, 서명하지 마'라고 말합니다. 일곱 시간 뒤 그는 그 말을 들고 시험장에 들어갑니다.", "전화를 넘겨받은 이민서가 평상으로 나갑니다. 남매의 통화는 40분이 걸리고, 당신은 한마디도 듣지 못합니다.", "서준은 '네' 하고 끊습니다. 그날 밤 그가 잤는지는 아무도 모릅니다."],
    },
    c15_lunchbox: {
      voice: ["12명 전원의 확인서를, 먼저 보여 달라고 한다.", "보도자료 초안을, 면접 기록에 첨부해 달라고 요구한다.", "좋은 이야기라면, 12명을 위해 받아들이자고 한다."],
      echo: ["백아린이 처음으로 1초쯤 늦게 대답합니다. '개인정보라서요.' 그 1초가 대답입니다.", "첨부 요구는 면접 기록에 남습니다. 백아린은 웃으며 '좋아요'라고 하고, 초안에서 한 줄을 지웁니다.", "받아들이면 12명은 오후에 정규직이 됩니다. 그 12명이 무엇에 서명했는지는 보도자료 어디에도 없습니다."],
    },
  },
  reactionMemos: {
    c15_report_reaction: ["서명의 값 1억 9천만 원", "값을 매길 수 없는 칸 하나"],
    c15_picket_reaction: ["확인서 사본을 본 동생", "입실까지 일곱 시간 반"],
    c15_lunchbox_reaction: ["보도자료 초안: '과거 사고는 모두 정리되었습니다'", "같이 들어간다는 12명"],
  },
  branchPlan: ["c15_form", 2, "c15_branch_roof", "c15_branch_roof_follow"],
  branchScenes: {
    // CASE 15's detour is the person carrying the paper. The case argues over
    // whether to sign and change things from inside; the side door is someone
    // who did exactly that seven years ago.
    c15_branch_roof: {
      phase: "SIDE DOOR",
      title: "옥상의 김밥",
      speaker: "채윤슬",
      text: "밤 아홉 시 반, 채윤슬이 본점 옥상 벤치에서 편의점 김밥을 먹고 있습니다. 불러낸 사람은 당신인데, 그가 먼저 반 줄을 내밉니다. 질문을 듣고 그는 한참 김밥만 씹습니다. 그러다 지갑 안쪽에서 네 번 접힌 종이를 꺼냅니다. 7년 전 날짜, 그의 서명. '본인은 창구 시재 부족(금고 속 현금이 장부보다 모자란 것) 30만 원이 본인이 돈을 잘못 센 실수로 생긴 것임을 확인합니다.' '저 그때 창구 계약직이었어요. 그 30만 원, 제가 센 돈 아니에요. 근데 서명하고 들어왔고, 7년 동안 안에서 바꾸겠다고 생각했어요.' 그가 종이를 다시 접습니다. '그런데 지금 제가 그 종이를 나르고 있네요.'",
      memo: ["채윤슬: 7년 전 창구 계약직, 전환 때 확인서 서명", "시재 부족 30만 원 -- 본인이 센 돈이 아니었음", "그 확인서는 지금도 인사 기록에 남아 있음", "채윤슬의 권한: 문구 조정 요청 1회, 반려 불가"],
      triggers: ["selfAwareness", "helplessness", "trust"],
      choices: [
        { id: "c15_branch_roof_a", label: "그 종이를 이민서에게 직접 보여 줄 수 있는지 부탁한다", effect: { trust: 12, humanCost: -4, time: -5, capital: -2, fatigue: 5 }, next: "c15_branch_roof_follow", cognition: { reframing: 2 } },
        { id: "c15_branch_roof_b", label: "7년 전 확인서도 문구 조정 요청에 같은 사례로 붙이자고 한다", effect: { legitimacy: 11, trust: 3, time: -6, humanCost: 4, fatigue: 4 }, next: "c15_branch_roof_follow", cognition: { inference: 2 } },
        { id: "c15_branch_roof_c", label: "그의 사정은 묻어 두고 김밥값만 계산하고 내려온다", effect: { time: 6, capital: 4, trust: -4, humanCost: 3, fatigue: -3 }, next: "c15_branch_roof_follow", cognition: { risk: 1 } },
      ],
    },
    c15_branch_roof_follow: {
      phase: "SIDE DOOR",
      title: "보류라는 칸",
      speaker: "채윤슬",
      text: "엘리베이터를 기다리며 채윤슬이 휴대폰 배경화면을 보여 줍니다. 앞니 빠진 여자아이가 제 몸만 한 책가방을 메고 있습니다. '7년 전 서명할 때 얘가 뱃속에 있었어요. 그래서 했어요. 후회하냐고 물으면, 모르겠어요.' 엘리베이터가 12층을 그냥 지나쳐 올라갑니다. 그가 목소리를 낮춥니다. '규정에 전달을 보류하는 칸은 없어요. 근데 하지 말라는 줄도 없어요. 제가 그 메일을 목요일 아침까지 안 열면, 면접은 확인서 없이 시작돼요. 그다음 일은 저도 몰라요.' 문이 열리고, 그가 먼저 내립니다.",
      memo: ["채윤슬의 딸, 올해 초등학교 1학년", "규정: 전달 보류 조항 없음 -- 금지 조항도 없음", "보류 시 채윤슬 본인이 징계 대상이 될 수 있음", "면접까지 나흘"],
      triggers: ["trust", "responsibility", "fear"],
      choices: [
        { id: "c15_branch_roof_follow_a", label: "채윤슬의 보류 옆에 트리거랩의 이름도 나란히 걸겠다고 한다", effect: { trust: 12, legitimacy: 5, capital: -7, time: -5, fatigue: 5 }, next: "c15_report", cognition: { persistence: 2 } },
        { id: "c15_branch_roof_follow_b", label: "보류 대신 인사부 양식에 반려 칸을 만드는 개선안을 같이 쓴다", effect: { legitimacy: 12, trust: 4, time: -7, humanCost: 3, fatigue: 5 }, next: "c15_report", cognition: { inference: 2 } },
        { id: "c15_branch_roof_follow_c", label: "그가 다치지 않게 보류는 말리고 원래대로 전달하게 한다", effect: { time: 6, capital: 5, trust: -3, humanCost: 3, fatigue: -3 }, next: "c15_report", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c15_start",
    result: "c15_aftershock",
    defaultFree: "c15_route_system",
    // One signature, one person. Like 사건 12 the case is a single line; the
    // split is whose mistake the eleven seconds end up being.
    choices: {},
    system: {
      route: "c15_route_system",
      final: "c15_final_system_route",
      title: "실수의 주인",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 KD은행 지난 10년의 내부 사고 보고서 1,284건을 엽니다. 원인이 '개인 조작 실수'로 닫힌 사고는 342건. 그중 243건이 계약직이나 파견(잠시 다른 회사에 보내 일하게 하는 것)으로 온 직원의 이름으로 닫혔고, 231건에 확인서가 붙어 있습니다. 서명한 사람 가운데 1년 안에 정규직이 된 사람은 188명입니다. 그리고 97건은 나중에 같은 원인으로 사고가 또 났습니다. '실수는 가장 싸게 계약된 사람에게 배정되도록 학습되어 있습니다. 원인은 닫혔고, 사고는 계속됩니다.'",
      memo: ["개인 실수로 닫힌 사고 342건 중 계약직·파견직 243건", "확인서가 붙은 231건 -- 같은 원인 재발 97건", "이 통계는 어떤 인사 자료에도 인용된 적 없음"],
      routeChoices: [
        ["c15_route_system_publish", "통계를 인사부와 노동조합에 동시에 보낸다", { legitimacy: 11, trust: 6, capital: -6, time: -8, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c15_route_system_reopen", "재발한 97건의 원인 조사를 다시 열라고 요구한다", { legitimacy: 8, capital: 5, trust: 3, time: -7, humanCost: 3, fatigue: 6 }, { reframing: 2 }],
        ["c15_route_system_drop", "통계는 덮고 면접 일정대로 간다", { time: 8, capital: 7, trust: -7, legitimacy: -7, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "확인서 없이도 심사받을 수 있게 양식에 반려 칸을 만든다", { legitimacy: 13, trust: 7, capital: -8, humanCost: -5, fatigue: 7 }, { reframing: 3 }],
      ["b", "확인서는 그대로 두고 전환 인원만 늘려 달라고 한다", { capital: 9, time: 7, trust: -6, legitimacy: -8, humanCost: 5, fatigue: -5 }, { risk: 2 }],
      ["c", "서명을 거부한 계약직들이 함께 이의를 낼 수 있게 돕는다", { legitimacy: 8, trust: 9, capital: -7, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c15_evidence_turn",
    result: "c15_aftershock",
    sourceRoutes: ["c15_form", "c15_rooftop", "c15_gate", "c15_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 전환 심사 대상자 명단 옆에 놓고, 확인서가 누구누구에게 갔는지 맞춰 본다.",
    entryEcho: "단서를 대면 이민서 한 사람의 서류가 아니라, 같은 날 같은 양식을 받은 사람들이 보입니다.",
    title: "열두 장의 같은 문장",
    speaker: "반재욱",
    text: "단서를 맞추자 이번 전환 심사 대상자 12명의 서류가 한꺼번에 열립니다. 12명 모두 마지막 쪽에 확인서가 붙어 있습니다. 창구 시재 부족(금고 속 현금이 장부보다 모자란 것), 콜센터 녹취(상담 내용을 녹음해 남긴 것) 누락, 서버 백업 실패. 사고는 전부 다르고 문장은 전부 같습니다. '본인의 실수로 생긴 것임을 확인합니다.' 파일 속성의 작성 부서는 인사부가 아니라 그룹전략실, 만든 날은 혁신위원회 출범 다음 날입니다. 반재욱이 수첩을 덮습니다. '정규직을 미끼로 원인 모를 사고 12건을 한 번에 닫는 겁니다. 제가 감사팀에서 하던 일을, 이제는 서명 한 줄로 하네요.'",
    memo: ["전환 대상 12명 전원 확인서 첨부", "작성 부서: 그룹전략실 -- 혁신위원회 출범 다음 날", "12건 모두 원인 조사가 끝나지 않은 사고"],
    triggers: ["injustice", "system", "order"],
    entryEffect: { legitimacy: 4, trust: 3, time: -3, capital: -2, fatigue: 4 },
    choices: [
      ["c15_evidence_turn_all", "12명 모두의 확인서가 빠지기 전에는 누구도 서명하지 않게 한다", { legitimacy: 13, trust: 6, capital: -8, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c15_evidence_turn_hold", "작성 부서 기록은 쥐고 있다가 면접이 끝난 뒤에 꺼낸다", { capital: 9, time: 6, trust: -6, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c15_evidence_turn_share", "12명에게 서로의 확인서를 먼저 알린다", { trust: 12, legitimacy: 7, capital: -7, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c15_branch_roof",
    systemNext: "c15_route_system",
    evidenceNext: "c15_evidence_turn",
    routeLabel: "직전 사건의 판매 대본 대조법으로 확인서 문장을 한 줄씩 읽는다",
    systemLabel: "직전 자유응답 문장이 혁신위원회 보도자료에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 확인서 파일의 작성 부서를 연다",
  },
  openingRoutes: {
    c14_after_warm: "c15_start_warm",
    c14_after_record: "c15_start_record",
    c14_after_rush: "c15_start_rush",
  },
  openingCopy: {
    c15_start_warm: ["받아쓰기 시험 다음 날", "도윤하", "펀드 철회가 접수된 그날 저녁, 당신은 가입자 모임 자리에 끝까지 남아 이정숙 선생님이 낸 받아쓰기 시험을 봤습니다. 칠판의 '모르면 사인하지 마세요'는 손자의 학교 단체방까지 돌았습니다. 그 저녁 이민서가 보낸 메시지의 '조건 하나'가 무엇인지는, 2주 뒤 인사부 채윤슬 과장이 서류를 들고 트리거랩에 내려와서야 드러납니다. 7쪽 중 마지막 쪽은 확인서입니다. 유출 소동 때 접속 기록의 11초 공백을 자기 조작 실수로 인정하라는 문장입니다. 면접 날은 동생의 수능 날입니다. 도윤하가 칠판 사진을 이민서에게 보냅니다.", ["칠판 문장: '모르면 사인하지 마세요'", "이민서 정규직 전환 -- 확인서 서명 조건", "면접 날 = 동생 이서준의 수능 날"]],
    c15_start_record: ["고치는 문서와 지우는 문서", "에코", "당신이 쓴 창구 판매 기준 개정안이 은행 내부 문서로 정식 등록됐습니다. 등록 버튼을 누른 사람은 데이터 기록 담당 이민서였습니다. 그날 저녁 그가 단체방에 남긴 '조건이 하나 있대요'의 내용이 2주 뒤 도착합니다. 인사부의 정규직 전환 서류 7쪽, 마지막 쪽은 확인서입니다. 유출 소동 때 접속 기록의 11초 공백이 본인의 조작 실수라는 문장. 서명하면 정규직이고, 면접은 동생의 수능 날입니다. 에코가 두 문서를 나란히 띄웁니다. 하나는 기록을 고치는 문서, 하나는 기록을 지우는 문서입니다.", ["창구 판매 기준 개정안 등록 -- 등록자 이민서", "2주 뒤 도착한 전환 서류 7쪽", "확인서: 11초 공백을 '본인 실수'로"]],
    c15_start_rush: ["먼저 읽은 사람", "반재욱", "이민서의 메시지를 받자마자 당신은 곧장 본점 인사부로 올라갔습니다. 저녁 일곱 시, 불 꺼진 복도 끝에 채윤슬 과장 혼자 남아 있었고, 그는 당황한 얼굴로 아직 발송 전인 서류를 보여 주었습니다. 정규직 전환 서류 7쪽, 마지막 쪽은 확인서입니다. 유출 소동 때 접속 기록의 11초 공백을 자기 실수로 인정하면 정규직. 면접은 동생의 수능 날입니다. 2주 뒤 봉투가 정식으로 도착한 아침, 반재욱이 조용히 말합니다. '이민서 씨가 그러더군요. 자기 서류를 자기보다 먼저 읽은 사람이 있다고.'", ["인사부 복도 19시 -- 발송 전 서류 열람", "이민서보다 먼저 확인서를 읽음", "면접 날 = 동생 수능 당일"]],
  },
  openingSignatures: {
    c15_start_warm: {
      label: "이정숙 선생님의 칠판 문장을 들고 이민서 곁에 앉는다",
      effect: { trust: 11, humanCost: -4, capital: -3, time: -5, fatigue: 3 },
      cognition: { reframing: 2 },
      voice: "이정숙 선생님의 칠판 문장을 들고, 이민서 곁에 앉는다.",
      echo: "칠판 사진을 본 이민서가 웃습니다. '저는 알고 사인하는 거면요?' 그 질문에는 칠판도 답이 없습니다.",
    },
    c15_start_record: {
      label: "개선안을 등록한 방식 그대로 확인서에도 이의 기록을 남긴다",
      effect: { legitimacy: 12, trust: -2, capital: -4, time: -5, humanCost: 2, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "개선안을 등록한 방식 그대로, 확인서에도 이의 기록을 남긴다.",
      echo: "이의 기록은 번호를 받습니다. 인사부 시스템에는 그 번호를 붙일 칸이 없어서, 기록은 트리거랩 서버에만 남습니다.",
    },
    c15_start_rush: {
      label: "서류를 먼저 읽어 버린 일부터 이민서에게 사과한다",
      effect: { trust: 12, humanCost: -3, legitimacy: 3, time: -6, fatigue: 4 },
      cognition: { persistence: 2 },
      voice: "서류를 먼저 읽어 버린 일부터, 이민서에게 사과한다.",
      echo: "사과를 들은 이민서가 괜찮다고 합니다. 그러고는 봉투를 당신 앞에서 처음 뜯는 것처럼 천천히 엽니다.",
    },
  },
  voiceLines: {
    // CASE 15. Every line is spoken with 이민서 in the room, so none of them is
    // allowed to decide for her out loud.
    c15_start_ask: "서류보다 먼저, 이민서에게 무엇을 원하는지 묻는다.",
    c15_start_compare: "확인서 문장을, 유출 사건 기록과 한 줄씩 대조한다.",
    c15_start_prep: "3년 만의 기회라며, 면접 준비부터 돕는다.",
    c15_form_refuse: "이민서와 나란히 앉아, 확인서 없이 면접을 보겠다고 버틴다.",
    c15_form_amend: "'조작 실수'를 '원인 미상'으로 고치는, 문구 조정 요청서를 쓴다.",
    c15_form_ask: "채윤슬을 따로 불러, 그도 이 종이를 받아 본 적이 있는지 묻는다.",
    c15_branch_roof_a: "그 종이를, 이민서에게 직접 보여 줄 수 있는지 부탁한다.",
    c15_branch_roof_b: "7년 전 확인서도, 문구 조정 요청에 같은 사례로 붙이자고 한다.",
    c15_branch_roof_c: "그의 사정은 묻어 두고, 김밥값만 계산하고 내려온다.",
    c15_branch_roof_follow_a: "채윤슬의 보류 옆에, 트리거랩의 이름도 나란히 걸겠다고 한다.",
    c15_branch_roof_follow_b: "보류 대신, 인사부 양식에 반려 칸을 만드는 개선안을 같이 쓴다.",
    c15_branch_roof_follow_c: "그가 다치지 않게 보류는 말리고, 원래대로 전달하게 한다.",
    c15_rooftop_shield: "서준의 기록은 쓰지 않고, 다른 증거로 싸우자고 한다.",
    c15_rooftop_consent: "수능이 끝난 뒤 서준의 동의를 받아, 진료 기록을 내자고 한다.",
    c15_rooftop_now: "내일 바로 진료 기록을 떼어, 문구 조정 요청에 붙이자고 한다.",
    c15_gate_stay: "면접이 늦어져도 좋다며, 이민서가 숨을 고를 때까지 곁에 선다.",
    c15_gate_office: "시험장 본부에, 도시락 전달 절차가 있는지 정식으로 묻는다.",
    c15_gate_taxi: "도시락은 든 채, 택시를 잡아 면접장으로 곧장 달린다.",
    c15_final_fight: "서명하지 말고, 11초를 끝까지 같이 싸우자고 말한다.",
    c15_final_respect: "서명하고 안에서 바꾸겠다는, 이민서의 선택을 존중한다.",
    c15_final_publish: "확인서 자체를, 면접실 밖 세상에 공개한다.",
    c15_after_warm: "교문 계단에서, 식은 도시락을 남매와 끝까지 나눠 먹는다.",
    c15_after_record: "계약직 확인서 관행을 없앨 개선안을, 문서로 남긴다.",
    c15_after_rush: "강태민이 받은 문자를 따라, 곧장 다음 현장으로 간다.",
    c15_route_system_publish: "통계를, 인사부와 노동조합에 동시에 보낸다.",
    c15_route_system_reopen: "재발한 97건의, 원인 조사를 다시 열라고 요구한다.",
    c15_route_system_drop: "통계는 덮고, 면접 일정대로 간다.",
    c15_final_system_route_a: "확인서 없이도 심사받을 수 있게, 양식에 반려 칸을 만든다.",
    c15_final_system_route_b: "확인서는 그대로 두고, 전환 인원만 늘려 달라고 한다.",
    c15_final_system_route_c: "서명을 거부한 계약직들이, 함께 이의를 낼 수 있게 돕는다.",
    c15_evidence_turn_all: "12명 모두의 확인서가 빠지기 전에는, 누구도 서명하지 않게 한다.",
    c15_evidence_turn_hold: "작성 부서 기록은 쥐고 있다가, 면접이 끝난 뒤에 꺼낸다.",
    c15_evidence_turn_share: "12명에게, 서로의 확인서를 먼저 알린다.",
  },
  echoReplies: {
    // CASE 15.
    c15_start_ask: "물으면 이민서는 한참 대답하지 않습니다. 그러다 '저 정규직 되고 싶어요. 되게요'라고 말하고, 그 말에 스스로 놀랍니다.",
    c15_start_compare: "대조하면 확인서가 유출 사건 보고서의 단어를 그대로 가져다 썼다는 게 보입니다. 같은 사람이 쓴 문장입니다.",
    c15_start_prep: "준비는 빨라집니다. 모의 면접 첫 질문부터 '확인서는 제출하셨죠?'가 나옵니다.",
    c15_form_refuse: "버티면 채윤슬이 난처하게 웃습니다. '저도 그랬으면 좋겠어요.' 그러고는 '전달 완료'를 누르지 않은 채 창을 닫습니다.",
    c15_form_amend: "'원인 미상'으로 고쳐도 서명은 서명입니다. 요청서를 읽은 이민서가 '그래도 제 이름은 들어가네요'라고 합니다.",
    c15_form_ask: "묻자 채윤슬이 모니터에서 눈을 떼지 않습니다. '퇴근하고 옥상에서 얘기해요.' 그의 손이 지갑 쪽으로 한 번 갑니다.",
    c15_branch_roof_a: "부탁하면 채윤슬이 한참 망설이다 고개를 끄덕입니다. 7년 동안 아무에게도 보여 준 적 없는 종이입니다.",
    c15_branch_roof_b: "사례로 붙이면 요청서는 두꺼워집니다. 채윤슬의 이름도 그 두께 안에 들어갑니다.",
    c15_branch_roof_c: "김밥값은 3,500원입니다. 채윤슬이 '다음엔 제가 살게요'라고 하고, 종이를 지갑에 다시 넣습니다.",
    c15_branch_roof_follow_a: "이름을 나란히 걸면 채윤슬은 혼자가 아닙니다. 대신 트리거랩은 인사부에 처음으로 적이 하나 생깁니다.",
    c15_branch_roof_follow_b: "개선안은 반듯합니다. 반려 칸이 생기려면 인사위원회를 두 번 거쳐야 하고, 목요일은 그보다 빨리 옵니다.",
    c15_branch_roof_follow_c: "말리면 채윤슬은 다치지 않습니다. 목요일 아침 8시, 메일은 제시간에 열립니다.",
    c15_rooftop_shield: "다른 증거는 느립니다. 이민서가 고맙다고 하고, 그 말 뒤에 '근데 시간이 없어요'를 붙입니다.",
    c15_rooftop_consent: "동의를 기다리면 면접이 먼저 옵니다. 진료 기록은 서명 뒤에야 쓸 수 있는 증거가 됩니다.",
    c15_rooftop_now: "기록을 떼면 11초는 거의 풀립니다. 서준의 이름과 병명이 인사부 첨부 파일 목록에 한 줄 추가됩니다.",
    c15_gate_stay: "곁에 서 있는 동안 이민서가 교문 철창을 한 번 잡았다 놓습니다. 면접장에는 9분 늦게 도착합니다.",
    c15_gate_office: "본부의 대답은 친절하고 분명합니다. '입실 후 반입은 안 됩니다.' 규정을 확인하는 데 11분이 걸립니다.",
    c15_gate_taxi: "택시는 빠릅니다. 이민서는 뒷유리로 교문이 멀어지는 걸 끝까지 봅니다.",
    c15_final_fight: "싸우자고 하면 이민서가 만년필 뚜껑을 닫습니다. 명함 시안은 시안으로 남고, 계약 만료까지 넉 달이 시작됩니다.",
    c15_final_respect: "존중하면 이민서가 서명합니다. 글씨가 조금 떨립니다. 그는 서명 아래에 날짜를 쓰고, 그 옆에 아무도 모르게 작은 점을 하나 찍습니다.",
    c15_final_publish: "공개하면 확인서는 이민서 한 사람의 종이가 아니게 됩니다. 12명의 이름도 함께 세상에 나갑니다. 그중 몇은 원하지 않았습니다.",
    c15_after_warm: "뭇국은 차갑지만 서준은 국물까지 다 마십니다. 강태민의 문자는 내일 아침까지 기다립니다.",
    c15_after_record: "개선안은 인사부에 접수됩니다. 채윤슬이 접수 칸에 '보류 없음'이라고 적고, 처음으로 반려 칸이 있는 양식 초안을 첨부합니다.",
    c15_after_rush: "당신이 일어서자 서준이 '누나 친구분 바쁘시네'라고 합니다. 이민서는 대답 대신 식은 뭇국을 한 숟가락 더 뜹니다.",
    c15_route_system_publish: "노동조합이 통계를 받자마자 긴급 회의를 잡습니다. 인사부는 같은 날 '자료 출처 확인 중'이라는 답만 보냅니다.",
    c15_route_system_reopen: "다시 열면 97건 중 첫 번째 사고의 담당자가 이미 퇴사했다는 게 나옵니다. 그 사람도 확인서에 서명했습니다.",
    c15_route_system_drop: "덮은 통계는 에코의 기록에만 남습니다. 에코는 그 숫자를 지우지 않고 다음 사건까지 들고 갑니다.",
    c15_final_system_route_a: "반려 칸이 생기면 채윤슬의 버튼은 두 개가 됩니다. 두 번째 버튼을 누르는 사람에게 무슨 일이 생길지는 아직 모릅니다.",
    c15_final_system_route_b: "인원은 늘어납니다. 늘어난 인원만큼 서명된 확인서도 늘어납니다.",
    c15_final_system_route_c: "함께 내는 이의는 느리지만 무겁습니다. 서명을 거부한 사람은 이민서를 포함해 세 명입니다.",
    c15_evidence_turn_all: "전원을 묶으면 그룹은 12명을 한꺼번에 잃거나 한꺼번에 들여야 합니다. 그 계산은 33층이 합니다.",
    c15_evidence_turn_hold: "쥐고 있으면 면접은 예정대로 흘러갑니다. 기록은 무기가 되지만, 이민서는 그 무기를 모른 채 면접실에 들어갑니다.",
    c15_evidence_turn_share: "알리자 12명 중 여덟 명이 같은 날 저녁 한 카페에 모입니다. 서로의 확인서를 처음 나란히 놓고, 누군가 '문장이 똑같네'라고 말합니다.",
  },
  characterProfiles: {
    채윤슬: {
      role: "KD은행 인사부 채용 담당 과장 · 전 창구 계약직",
      stance: "친절 · 체념 · 뒤늦은 칸",
      job: "위에서 내려온 서류를 웃으며 전달한다. 전달하지 않을 권한은 그의 양식에 없다.",
      appearance: "밝은 베이지 카디건, 사원증 줄에 매달린 딸의 머리끈, 지갑 안쪽에 네 번 접힌 종이 한 장.",
      thought: "나도 서명하고 들어왔다. 안에서 바꾸겠다고 했는데, 7년 동안 바뀐 건 내가 나르는 서류의 양뿐이다.",
      gesture: "채윤슬은 곤란한 말을 하기 전에 먼저 웃고, 웃음이 끝나기 전에 서류를 상대 쪽으로 돌려 놓는다.",
      voice: "상냥하고 빠르게 말하다가, 자기 권한 밖의 이야기가 나오면 문장이 짧아진다.",
      line: "반려 칸이 없어요. 제 양식에는요.",
    },
    이서준: {
      role: "이민서의 남동생 · 고3 수험생",
      stance: "미안함 · 자존심 · 누나 편",
      job: "누나가 무엇을 걸고 서명하려는지 제일 늦게 알고, 제일 정확하게 묻는다.",
      appearance: "목까지 올린 패딩, 늘 쓰고 다니는 헤드폰, 수학 문제집 모서리에 붙인 형광 포스트잇.",
      thought: "그날 밤 내가 아프지만 않았으면 누나는 그 자리에서 아니라고 말할 수 있었다.",
      gesture: "이서준은 대답하기 싫으면 헤드폰을 한쪽 귀에만 걸친다. 듣고는 있다는 뜻이다.",
      voice: "말수가 적고 반말과 존댓말을 섞어 쓰다가, 중요한 질문만은 끝까지 존댓말로 한다.",
      line: "누나 이거 나 때문에 쓰는 거예요?",
    },
  },
  setting: { place: "트리거랩 4층 분석관실", clock: "정규직 면접까지 D-6" },
  sceneContext: {
    c15_start: {
      place: "트리거랩 4층 분석관실",
      clock: "정규직 면접까지 D-6 · 수능 D-6",
      question: "정규직 전환의 조건이 11초를 자기 실수로 인정하는 서명입니다. 무엇부터 하겠습니까?",
      lead: "지하 4층에 인사부 사람이 내려온 건 트리거랩이 생긴 뒤 처음입니다. 귤 냄새가 먼저 들어옵니다.",
    },
    c15_start_warm: {
      place: "트리거랩 4층 분석관실",
      clock: "정규직 면접까지 D-6 · 수능 D-6",
      question: "모르면 사인하지 말라던 칠판 문장이, 알면서 사인해야 하는 사람 앞에 왔습니다. 그 문장을 어떻게 건네겠습니까?",
      lead: "받아쓰기 시험을 본 지 2주, 도윤하의 휴대폰에는 아직 칠판 사진이 배경화면으로 있습니다.",
    },
    c15_start_record: {
      place: "트리거랩 4층 분석관실",
      clock: "정규직 면접까지 D-6 · 수능 D-6",
      question: "기록을 고치는 문서를 등록한 사람이, 기록을 지우는 문서에 서명하라는 요구를 받았습니다. 어떻게 하겠습니까?",
      lead: "개선안 등록 알림이 온 지 2주, 이민서의 책상에 인사부 봉투가 놓였습니다.",
    },
    c15_start_rush: {
      place: "트리거랩 4층 분석관실",
      clock: "정규직 면접까지 D-6 · 수능 D-6",
      question: "이민서보다 먼저 그의 확인서를 읽었습니다. 봉투가 정식으로 도착한 지금, 무엇부터 하겠습니까?",
      lead: "인사부 복도에서 서류를 먼저 본 지 2주, 같은 봉투가 이민서의 책상에 정식으로 놓였습니다.",
    },
    c15_form: {
      place: "KD은행 본점 인사부 · 면담실",
      clock: "정규직 면접까지 D-5",
      question: "위에서 내려온 확인서에는 보낸 부서도, 반려할 칸도 없습니다. 이 종이를 어떻게 하겠습니까?",
      lead: "채윤슬이 확인서를 설명해 주겠다며 이민서와 당신을 본점 12층으로 불렀습니다.",
    },
    c15_branch_roof: {
      place: "KD은행 본점 · 옥상",
      clock: "정규직 면접까지 D-5 · 21:30",
      question: "서류를 나르는 사람이 7년 전 같은 서류에 서명했습니다. 그 종이를 어떻게 하겠습니까?",
    },
    c15_branch_roof_follow: {
      place: "KD은행 본점 · 엘리베이터",
      clock: "정규직 면접까지 D-5 · 22:10",
      question: "채윤슬이 규정에 없는 '보류'를 해 보겠다고 합니다. 그 위험을 어떻게 나누겠습니까?",
    },
    c15_report: {
      place: "트리거랩 4층 분석관실 · 야간",
      clock: "정규직 면접까지 D-5 · 23:10",
      question: "확인서의 근거 자료 1번이 오진우의 옛 보고서입니다. 그 보고서를 어떻게 끝내겠습니까?",
    },
    c15_report_reaction: {
      place: "트리거랩 4층 분석관실 · 탕비실",
      clock: "정규직 면접까지 D-4",
      question: "서명의 값이 초당 1,700만 원으로 계산됐습니다. 이 계산서를 어떻게 쓰겠습니까?",
    },
    c15_rooftop: {
      place: "해방촌 이민서의 옥탑방 · 옥상 평상",
      clock: "수능 D-2 · 저녁",
      question: "11초를 풀 진료 기록에 동생의 이름이 있습니다. 그 기록을 어떻게 하겠습니까?",
      lead: "찹쌀떡 상자와 명함 시안이 놓인 평상에, 손님들이 돌아간 뒤 이민서 혼자 남았습니다.",
    },
    c15_picket: {
      place: "트리거랩 4층 분석관실 · 탕비실",
      clock: "수능 전날 · 22:00",
      question: "입실 마감과 면접 시각 사이가 30분입니다. 내일 아침 사람들을 어떻게 나누겠습니까?",
    },
    c15_picket_reaction: {
      place: "해방촌 이민서의 옥탑방 · 옥상 평상",
      clock: "수능 당일 · 00:40",
      question: "동생이 확인서 사본을 보고 자기 때문이냐고 묻습니다. 무엇이라 답하겠습니까?",
    },
    c15_gate: {
      place: "용산 은강고 · 교문 · 고사장 앞",
      clock: "수능 당일 · 07:40",
      question: "스무 걸음 앞에서 교문이 닫히고, 도시락은 아직 이민서의 손에 있습니다. 어떻게 하겠습니까?",
      lead: "핫팩 박스를 뜯고 피켓을 올린 지 30분, 비탈길 아래에서 누군가 뛰어오는 소리가 들립니다.",
    },
    c15_lunchbox: {
      place: "을지로행 택시 안",
      clock: "수능 당일 · 08:24",
      question: "면접관 한 명이 그룹전략실 사람으로 바뀌었습니다. 남은 16분을 어떻게 쓰겠습니까?",
    },
    c15_lunchbox_reaction: {
      place: "KD은행 본점 · 엘리베이터",
      clock: "수능 당일 · 08:38",
      question: "백아린이 서명 한 줄과 12명의 정규직 전환을 한데 묶어 내밉니다. 어떻게 답하겠습니까?",
    },
    c15_route_system: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "정규직 면접까지 D-3",
      question: "개인 실수로 닫힌 사고의 대부분이 계약직의 이름으로 닫혔습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c15_final_system_route: {
      place: "트리거랩 4층 분석관실 · 실험 단말",
      clock: "수능 당일 · 새벽",
      question: "전환 심사의 양식 하나를 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c15_evidence_turn: {
      place: "트리거랩 기록 보관소 B2 · 인사 자료",
      clock: "수능 당일 · 06:30",
      question: "12명의 서로 다른 사고가 같은 문장으로 닫히려 합니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c15_final: {
      place: "KD은행 본점 12층 인사부 · 회의실",
      clock: "수능 당일 · 08:52 · 1교시 국어",
      question: "이민서 앞에 확인서와 만년필이 놓였고, 그가 당신을 돌아봅니다. 어떻게 하겠습니까?",
      lead: "이민서는 머리가 땀에 젖은 채 들어왔고, 코트 주머니에 명함 시안 한 장이 꽂혀 있습니다.",
    },
    c15_aftershock: {
      place: "용산 은강고 · 교문",
      clock: "수능 당일 · 17:45",
      question: "식은 도시락을 사이에 두고 남매가 앉았고, 강태민의 휴대폰이 울렸습니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c15-confirm-author",
    title: "확인서의 작성 부서",
    text: "전환 대상 계약직 12명의 확인서는 사고는 달라도 문장이 같았고, 파일을 만든 곳은 인사부가 아니라 그룹전략실이었습니다. 만든 날은 혁신위원회 출범 다음 날입니다.",
  },
  outcomes: {
    c15_after_warm: { tag: "도시락을 나눈 결말", title: "교문 계단에서 식은 뭇국을 끝까지 나눠 먹었다", text: "수능이 끝난 저녁, 남매와 트리거랩 사람들이 교문 계단에 앉아 도시락 하나를 나눠 먹었습니다. 서준은 국물까지 다 마셨습니다." },
    c15_after_record: { tag: "양식을 고친 결말", title: "확인서 대신 반려 칸이 있는 양식이 접수됐다", text: "계약직 확인서 관행을 없애는 개선안이 인사부에 접수됐습니다. 채윤슬의 양식에 처음으로 두 번째 버튼이 생길 차례입니다." },
    c15_after_rush: { tag: "먼저 일어선 결말", title: "식은 도시락을 두고 다음 현장으로 먼저 갔다", text: "당신은 교문 계단의 남매를 두고 강태민의 문자를 따라 일어섰습니다. 뭇국 몇 숟가락이 당신 몫으로 남았습니다." },
  },
  carryovers: {
    c15_after_warm: { trust: 9, humanCost: -5, fatigue: -8 },
    c15_after_record: { legitimacy: 12, trust: 2, fatigue: 5 },
    c15_after_rush: { capital: 6, legitimacy: 4, trust: -8 },
  },
  continuityChallenges: {
    c14_after_warm: { id: "protect-trust", title: "칠판 문장을 이민서 곁으로", text: "복지관 칠판의 문장은 모르면 사인하지 말라고 합니다. 알면서 사인하라는 요구를 받은 사람 곁에 그 문장을 들고 서는 선택을 찾아야 보너스가 열립니다." },
    c14_after_record: { id: "use-reframe", title: "고치는 문서로 지우는 문서 읽기", text: "당신의 개선안을 등록한 사람이 기록을 지우는 확인서를 받았습니다. 두 문서를 나란히 놓고 판을 다시 짜야 합니다." },
    c14_after_rush: { id: "repair-legitimacy", title: "먼저 읽은 저녁의 공정함 회복하기", text: "당신은 이민서보다 먼저 그의 확인서를 읽었습니다. 그 저녁을 모른 척하지 않고 서류의 주인에게 자리를 돌려주는 선택을 찾아야 합니다." },
  },
};
