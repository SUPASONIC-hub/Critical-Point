/**
 * CASE 48 -- the new dissent, where the season's first loan comes back with a
 * new name and the analyst is, for the first time, one of the people who sign.
 *
 * 사건 01 opened on 2023-0412: a same-day delivery platform, an investment that
 * fell through, a clause 7 that let the bank call the loan the moment debt
 * passed 180% of equity, and a signature box nobody filled. Forty-seven cases
 * later the board has removed 윤상혁, KD캐피탈 has a new rule -- every member of
 * the credit committee signs by name, approve, dissent or abstain -- and the
 * first file under that rule is 루프나우: fifteen-minute urban delivery out of
 * dark stores, 214 staff, 1,380 contract riders, a 480억 Series C from 라운드힐
 * that only closes if KD캐피탈 commits 290억. Clause 7 is word for word the
 * old one. The founder, 민하랑, drew up night-shift rosters at 플로우온 and cut
 * fifty-eight drivers from them in its last seventy-two hours; she built this
 * company so she would never have to cut a roster again, and she swallowed
 * the clause because the investor asked for it.
 *
 * The committee is called in the middle of the 추석 holiday for 09:00 the day
 * after 추석, because the investment closes at 10:00; the case is the one night
 * in between, from a dark store under the full moon to a server room at 4 a.m.
 * to a bookshop at dawn -- twelve hours, where 사건 01 had seventy-two.
 *
 * The case closes the circle without repeating it. The engine 노아 scores the
 * file A in 0.6 seconds because its training data was relabelled in March to
 * show the collapsed 2023 loan as a model approval; the restored 에코 calls the
 * file the 173rd of its shape. The evidence turn finds a side letter: if the
 * clause fires, 라운드힐 buys the loan at 41% -- one point under the 42% offer
 * of 사건 01 -- with 윤상혁 named as the restructuring adviser. Anger at a
 * disaster taught to a machine as a success, laughter at a signature that
 * never looks the same twice and a profit-and-loss sheet on a cup-noodle lid,
 * grief in 임경수's signature practice book, two weeks after his funeral, and joy on a roof
 * at dusk when a head of risk signs something other than "abstain" for the
 * first time in seventeen years. A dissent no longer disappears; it sends the
 * file to the board for two weeks and lets the investment deadline pass. The
 * aftermath ends on a name that has not called since the verdict -- 사건 49.
 */
export const case48Nodes = {
  c48_start: {
    phase: "CASE 48 BRIEFING",
    title: "제7조",
    speaker: "채이안",
    text:
      "추석 밤 9시 40분, 불 꺼진 KD캐피탈 위험관리부에 스탠드 하나가 켜져 있습니다. 채이안이 명절 밤에 당신을 불러낸 이유는 파일 한 부입니다. 내일 오전 9시 임시 심사위원회, 안건은 도심 15분 배송 회사 루프나우의 운영자금 대출 290억. 연휴 한가운데 소집된 이유는 하나입니다. 싱가포르 라운드힐 캐피탈이 480억을 넣기로 했는데, 그 투자의 선행 조건(투자금이 들어오기 전에 먼저 갖춰야 할 조건)이 KD캐피탈의 대출 확약(돈을 빌려주겠다는 공식 약속)이고, 마감이 내일 오전 10시입니다. 위원 명단 다섯 줄 중 마지막 줄에 당신 이름이 인쇄돼 있습니다. 해임안(이사를 자리에서 물러나게 하는 안건) 가결 뒤 생긴 새 규칙 때문입니다. 위원은 승인이든 반대든 기권이든 자기 이름으로 서명해야 합니다. 채이안이 귀에 꽂은 연필을 빼서 책상에 눕힙니다. '14쪽 제7조 읽어 보세요. 아는 문장일 거예요.' 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)이 180%를 넘으면 만기 전이라도 즉시 회수한다. 쉼표 자리까지 2023-0412 계약서와 같습니다.",
    memo: [
      "임시 심사위원회: 내일 09:00, 연휴 중 소집, 위원 5명 실명 서명",
      "루프나우 운영자금 대출 290억 -- 라운드힐 투자 480억의 조건",
      "계약서 제7조: 부채비율 180% 초과 시 즉시 회수",
      "안건 발의: 기업금융본부장 우지환 · 노아 사전 점수 A등급",
    ],
    triggers: ["responsibility", "selfAwareness", "choice"],
    choices: [
      {
        id: "c48_start_visit",
        label: "루프나우 대표를 오늘 밤 현장에서 직접 만난다",
        effect: { trust: 11, humanCost: -4, legitimacy: 1, time: -6, capital: -3, fatigue: 4 },
        next: "c48_hub",
        cognition: { persistence: 2 },
      },
      {
        id: "c48_start_compare",
        label: "2023-0412 계약서와 조항을 한 줄씩 대조한다",
        effect: { legitimacy: 12, time: -5, capital: -1, trust: -3, humanCost: 3, fatigue: 3 },
        next: "c48_hub",
        cognition: { inference: 2 },
      },
      {
        id: "c48_start_score",
        label: "노아의 A등급을 기준 삼아 검토 시간을 줄인다",
        effect: { time: 7, capital: 6, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -2 },
        next: "c48_hub",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c48_hub",
      },
    ],
  },
  c48_hub: {
    phase: "THE NEW SHAPE",
    title: "우리는 안 망해요",
    speaker: "민하랑",
    text:
      "추석 밤 11시 40분, 성수동 루프나우 1호 다크스토어(손님은 들어올 수 없는 배송 전용 소형 창고). 보름달 아래 전기자전거 마흔 대가 충전기에 꽂혀 있습니다. 파일에서 대표 이름을 본 강태민이 따라나섰습니다. 문이 열리자 민하랑이 그를 먼저 알아봅니다. '반장님? 플로우온 야간조 반장님!' 그는 플로우온에서 야간 배차를 짜던 매니저였습니다. 강태민이 배송 앱에 시험 삼아 가입했다가 '신규 라이더 · 평점 없음'이 뜨자 조용히 상처받는 사이, 민하랑이 사업계획서를 펼칩니다. '플로우온 마지막 72시간에 제가 배차표에서 이름 58개를 지웠어요. 그래서 만든 회사예요. 우리는 안 망해요.' 목소리가 떨리지 않습니다. 당신은 계획서 마지막 장에서 멈춥니다. 상환(빌린 돈을 갚는 것)에 쓸 돈의 출처 칸에 적힌 것은 매출이 아니라 '다음 투자 유치'입니다.",
    memo: [
      "루프나우: 다크스토어 18곳, 직원 214명, 계약 라이더 1,380명",
      "민하랑: 전 플로우온 야간 배차 매니저",
      "상환 재원: 매출이 아니라 다음 투자",
      "강태민의 라이더 앱 평점: 없음",
    ],
    triggers: ["affection", "fear", "responsibility"],
    choices: [
      {
        id: "c48_hub_riders",
        label: "라이더와 직원 명단부터 받아 누가 다칠지 센다",
        effect: { trust: 11, humanCost: -5, legitimacy: 1, time: -5, capital: -2, fatigue: 5 },
        next: "c48_engine",
        cognition: { persistence: 2 },
      },
      {
        id: "c48_hub_plan",
        label: "상환 재원이 투자뿐인 계획서를 숫자로 따진다",
        effect: { legitimacy: 10, trust: -3, time: -6, humanCost: 3, fatigue: 4 },
        next: "c48_engine",
        cognition: { inference: 2 },
      },
      {
        id: "c48_hub_believe",
        label: "민하랑의 각오를 믿고 현장 확인을 짧게 끝낸다",
        effect: { time: 6, capital: 5, trust: 4, legitimacy: -4, humanCost: 4, fatigue: -3 },
        next: "c48_engine",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c48_engine",
      },
    ],
  },
  c48_engine: {
    phase: "THE ENGINE",
    title: "결과 우수",
    speaker: "이민서",
    text:
      "추석 다음 날 새벽 4시, 판교 KD데이터랩 서버실. 이민서가 당직자에게 송편을 건네고 출입증 두 장을 빌려 문을 엽니다. 한쪽 화면에는 그룹 심사 엔진(대출을 자동으로 심사하는 AI) 노아가 있습니다. 루프나우 파일을 넣자 0.6초 만에 답합니다. 'A등급, 승인 권고. 가장 닮은 과거 사례 2023-0412, 유사도(얼마나 닮았는지 나타내는 숫자) 94.1%, 결과 우수.' 다른 화면에서 복원된 에코가 깨어납니다. '추석 인사를 배웠습니다. 송편 한 개는 약 50킬로칼로리이고, 류세아 님이 방금 서버실에 두 개를 반입했습니다.' 류세아가 송편을 등 뒤로 숨깁니다. 에코가 같은 파일을 계산합니다. '같은 모양의 173번째 사례입니다. 앞의 172건 중 169건은 매각으로 닫혔습니다.' 이민서가 노아 화면의 마지막 단어를 손가락으로 짚습니다. '결과 우수라니요. 그 대출은 무너졌어요. 우리가 다 거기서 왔잖아요.'",
    memo: [
      "노아: A등급 · 승인 권고 · 0.6초",
      "가장 닮은 사례: 2023-0412, 유사도 94.1%, '결과 우수'",
      "에코: 같은 모양 173번째 -- 앞선 169건은 매각으로 끝",
      "서버실 반입 금지 물품: 송편 2개",
    ],
    triggers: ["injustice", "system", "curiosity"],
    choices: [
      {
        id: "c48_engine_people",
        label: "노아가 셈에서 뺀 라이더와 가게를 점수표에 다시 넣는다",
        effect: { trust: 10, humanCost: -5, legitimacy: 3, time: -6, capital: -3, fatigue: 5 },
        next: "c48_pen",
        cognition: { reframing: 2 },
      },
      {
        id: "c48_engine_report",
        label: "2023-0412의 결과 우수 표시를 공식 오류로 신고한다",
        effect: { legitimacy: 12, time: -5, trust: -2, humanCost: 3, fatigue: 4 },
        next: "c48_pen",
        cognition: { inference: 2 },
      },
      {
        id: "c48_engine_note",
        label: "노아 점수는 두고 에코 분석을 참고 의견으로만 붙인다",
        effect: { time: 5, capital: 3, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -3 },
        next: "c48_pen",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c48_pen",
      },
    ],
  },
  c48_pen: {
    phase: "THE PEN",
    title: "읽고 쓴 사람만",
    speaker: "나준혁",
    text:
      "추석 다음 날 새벽 6시 반, 회기동 헌책방 1층. 창밖으로 보름달이 지고, 떡방에서 밤을 새운 사람들이 하나둘 들어옵니다. 나준혁이 남은 송편 옆에 A4 한 묶음을 펴고 서명 연습을 시킵니다. '30년 도장만 찍은 사람이 서명을 가르치니 웃기죠? 그래서 잘 알아요. 도장은 남이 찍어도 되는데, 서명은 안 돼요.' 당신이 쓴 서명 열두 개가 전부 다르게 생겼고, 권도현이 '같은 사람일 확률 31%'를 선언합니다. 수시 합격 통지서를 코팅해 들고 온 문하준은 스케치북에 당신 서명을 크게 그려 '이게 제일 비슷해요'라고 합니다. 웃음이 가라앉을 즈음 임소율이 낡은 노트 한 권을 내밉니다. 할아버지 장례를 치른 지 두 주가 안 됐습니다. 임경수가 심사역 첫해에 쓰던 서명 연습장입니다. 서른 쪽이 넘는 서명이 하나도 같지 않고, 첫 장에 한 줄이 있습니다. '매번 달라도 된다. 읽고 쓴 사람만 서명할 것.' 그 뒤에서 한서윤이 코트도 벗지 않고 말합니다. '그때는 제가 반려했어요. 이번엔 반려할 사람이 없어요. 당신이 쓰는 그대로 의사록(회의 내용을 적은 공식 기록)에 남아요.'",
    memo: [
      "서명 연습 12회 -- 같은 모양 0회",
      "임경수의 서명 연습장: '읽고 쓴 사람만 서명할 것'",
      "새 규칙: 반대 의견은 반려되지 않고 의사록에 그대로 남음",
      "심사위원회까지 2시간 30분",
    ],
    triggers: ["affection", "selfAwareness", "trust"],
    choices: [
      {
        id: "c48_pen_aloud",
        label: "반대 의견을 동료들과 함께 한 줄씩 소리 내어 쓴다",
        effect: { trust: 12, humanCost: -3, legitimacy: 2, time: -5, fatigue: 6 },
        next: "c48_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c48_pen_clauses",
        label: "조건을 조항 단위로 적은 승인 조건 초안을 쓴다",
        effect: { legitimacy: 10, trust: 3, time: -6, capital: -1, humanCost: 3, fatigue: 4 },
        next: "c48_final",
        cognition: { inference: 2 },
      },
      {
        id: "c48_pen_wait",
        label: "지금은 쓰지 않고 회의실 분위기를 보고 정한다",
        effect: { time: 6, capital: 3, trust: 2, legitimacy: -4, humanCost: 4, fatigue: -5 },
        next: "c48_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c48_final",
      },
    ],
  },
  c48_final: {
    phase: "FINAL DECISION",
    title: "다섯 번째 칸",
    speaker: "채이안",
    text:
      "추석 다음 날 오전 9시, KD캐피탈 심사위원회 회의실. 서명지 맨 위에는 노아의 칸이 인쇄돼 있습니다. '승인 권고 · A등급 · 0.6초.' 그 아래 다섯 칸. 기업금융본부장 우지환이 '승인'에 먼저 서명하고, 외부위원이 뒤따르고, 준법감시인(회사가 법을 지키는지 감시하는 임원)은 조건부 승인(붙인 조건을 지켜야만 효력이 생기는 승인)에 씁니다. 남은 칸은 둘, 위원장 채이안과 당신입니다. 우지환이 부드럽게 말합니다. '반대하셔도 됩니다. 이제는 반대 의견도 지워지지 않으니까요. 다만 한 건이라도 붙으면 안건은 이사회로 올라가 2주 뒤에 다시 정하고, 10시 투자 마감은 지나갑니다.' 복도 유리 너머에 민하랑이 서 있습니다. 채이안이 연필을 빼서 눕힙니다. '저는 17년 동안 기권만 했어요. 오늘은 당신 다음에 쓰겠습니다.' 주머니 속 서명 연습장의 첫 줄이 떠오릅니다. 읽고 쓴 사람만.",
    memo: [
      "서명 현황: 승인 2, 조건부 승인 1, 남은 칸 2",
      "반대 의견 1건 이상이면 이사회 재심의 -- 2주",
      "라운드힐 투자 마감: 오늘 10:00",
      "루프나우 10월 급여일 5일 -- 214명",
    ],
    triggers: ["choice", "responsibility", "selfAwareness"],
    choices: [
      {
        id: "c48_final_dissent",
        label: "반대 의견을 쓰고 내 이름으로 서명한다",
        effect: { legitimacy: 13, trust: 6, capital: -8, time: -6, humanCost: 4, fatigue: 6 },
        next: "case48_result",
        cognition: { persistence: 2, inference: 1 },
      },
      {
        id: "c48_final_condition",
        label: "제7조 삭제와 보증금 분리를 붙여 조건부 승인에 서명한다",
        effect: { trust: 9, legitimacy: 8, capital: -5, time: -5, humanCost: -3, fatigue: 5 },
        next: "case48_result",
        cognition: { reframing: 3 },
      },
      {
        id: "c48_final_handover",
        label: "서명을 위원장에게 넘기고 내 칸을 비워 둔다",
        effect: { capital: 9, time: 6, trust: -4, legitimacy: -6, humanCost: 4, fatigue: -4 },
        next: "case48_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case48_result",
      },
    ],
  },
};

/**
 * Everything else case 48 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case48 = {
  id: "case48",
  nodes: case48Nodes,
  aftermath: {
    c48_aftershock: {
      phase: "AFTERMATH",
      title: "기권이 아닌 칸",
      speaker: "채이안",
      text: "해 질 무렵, KD캐피탈 옥상에 낙엽이 몰려 있습니다. 밤을 새운 지 스무 시간째입니다. 심사위원회 의사록(회의 내용을 적은 공식 기록)이 사내망에 올라왔습니다. 다섯 칸 가운데 한 칸은 17년 만에 처음으로 '기권'이 아닙니다. 채이안이 그 칸을 휴대폰으로 찍더니 벚나무 사진 달력 옆에 붙이겠다고 합니다. 강태민이 남은 송편 한 상자를 들고 올라오고, 권도현은 어젯밤부터 쓴 컵라면 뚜껑 계산서를 세다가 '일곱 장, 전부 적자'라고 보고합니다. 민하랑의 문자가 옵니다. 라이더 쉼터에서 찍은 사진 한 장, 헬멧 마흔 개가 나란히 놓여 있습니다. 채이안이 난간에 기대 연필을 귀에 다시 꽂습니다. '그 사람도 이 의사록 읽을 거예요. 권한이 없어도요. 늘 그랬거든요.' 연락처 맨 아래, 1심 선고 뒤 한 번도 울리지 않은 이름 하나가 오늘따라 눈에 걸립니다.",
      memo: ["의사록 공개: 다섯 칸, 다섯 이름", "채이안: 17년 만의 첫 서명", "민하랑: 라이더 쉼터의 헬멧 사진", "윤상혁: 1심 선고 뒤 연락 없음"],
      triggers: ["trust", "affection", "choice"],
      choices: [
        { id: "c48_after_warm", label: "송편을 들고 동료들과 헌책방에서 막차가 끊길 때까지 남는다", effect: { trust: 12, humanCost: -6, time: -4, capital: -1, fatigue: -7 }, next: "case48_result", cognition: { reframing: 2 } },
        { id: "c48_after_record", label: "심사위원회 결론과 내 의견을 다음 심사에도 남도록 문서로 접수한다", effect: { legitimacy: 14, trust: 4, time: -5, capital: -3, humanCost: -1, fatigue: 5 }, next: "case48_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c48_after_rush", label: "곧장 사무실로 돌아가 윤상혁 시절의 승인 문서를 다시 넘긴다", effect: { capital: 7, legitimacy: 4, trust: -6, humanCost: 4, fatigue: 5 }, next: "case48_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c48_final", "c48_aftershock"],
  connectiveScenes: [
    ["c48_senior", "c48_hub", "c48_engine", "뚜껑 계산서", "권도현", "새벽 두 시, 다크스토어 옥상. 브릿지은행 권도현이 택시에서 내리자마자 올라옵니다. 브릿지도 루프나우에 80억을 넣기로 했고, 그 돈은 선순위(회사가 무너지면 가장 먼저 돌려받는 순서)입니다. 권도현이 강태민이 비운 컵라면 뚜껑을 뒤집어 볼펜으로 줄을 긋습니다. 맨 위 브릿지 80억, 그다음 KD캐피탈 290억, 그 아래 동네 가게 96곳 정산금, 맨 아래 라이더 보증금 27억. '저는 이 대출이 나가면 이익을 보는 쪽입니다. 그래서 반대 계산서를 드립니다. 공정하려면요.' 뚜껑 끝까지 적다가 그가 멈춥니다. '칸이 모자랍니다. 라이더 칸은 테두리에 적겠습니다.'", ["브릿지은행 80억 -- 선순위", "돌려받는 순서의 맨 끝: 라이더 보증금 27억 6천만 원", "계산서 용지: 컵라면 뚜껑 1장"], ["라이더 보증금을 맨 앞 순서로 올리는 조건을 요구한다", "권도현의 뚜껑 계산서를 심사 자료로 정식 접수한다", "브릿지 쪽 계산이라며 참고만 하고 덮는다"]],
    ["c48_label", "c48_engine", "c48_pen", "3월 17일 새벽", "이민서", "이민서가 노아의 학습 데이터(AI가 판단을 배우는 과거 기록)를 한 줄씩 거슬러 올라갑니다. 2023-0412 옆 결과 칸은 원래 '손실'이었습니다. 그 칸이 '회수 완료 · 우수 승인'으로 바뀐 건 올해 3월 17일 새벽입니다. 손실을 다른 회사 장부로 옮긴 뒤 KD은행 쪽 기록에서는 빚이 다 갚아진 것처럼 보였기 때문입니다. 같은 날 같은 방식으로 결과 칸이 바뀐 대출이 271건 더 있습니다. 이민서가 모니터를 손톱으로 두드립니다. '노아는 무너진 대출을 성공이라고 배웠어요. 그래서 그 대출이랑 닮을수록 점수를 더 줘요. 끝까지정밀을 떨어뜨린 것도, 루프나우를 붙여 주는 것도 같은 칸이에요.'", ["결과 칸 변경: 올해 3월 17일 새벽, 272건", "2023-0412: '손실' → '회수 완료 · 우수 승인'", "닮을수록 점수가 오르는 구조"], ["바뀐 결과 칸 때문에 거절당한 사람들부터 찾아 연락한다", "결과 칸이 바뀐 272건을 금융감독원 한지우에게 보낸다", "위원회가 급하니 결과 칸 문제는 다음 주로 미룬다"]],
    ["c48_call", "c48_pen", "c48_final", "망고는 안 왔다", "조현석", "아침 7시 10분, 헌책방 앞 골목에서 모르는 번호가 울립니다. 싱가포르의 조현석입니다. 그쪽은 아직 6시 10분입니다. '추석 잘 보냈어요? 망고 보냈는데 받았나 몰라.' 받지 않았습니다. 그의 억양이 숫자에서만 사라집니다. '오늘 오전 10시까지 KD캐피탈 대출 확약(돈을 빌려주겠다는 공식 약속)이 없으면 480억은 안 들어갑니다. 루프나우 10월 급여일은 5일이고, 214명이에요.' 그가 웃습니다. '한국 속담에 돌다리도 두들기면 깨진다, 하잖아요. 그러니까 너무 두들기지 마요.' 끊기 직전 한마디가 덧붙습니다. '아, 요즘 우리한테 조언해 주시는 분이 안부 전하래요. 당신을 잘 안다고.'", ["라운드힐 투자 마감: 오늘 10:00", "루프나우 10월 급여 214명분", "조현석의 '자문역'이 누구인지는 말하지 않음"], ["민하랑에게 투자 철회 가능성을 먼저 솔직히 알린다", "투자 조건 전문과 부속 합의서를 위원회에 내라고 요구한다", "10시 마감에 맞춰 위원회 순서를 앞당기자고 한다"]],
  ],
  connectiveOrder: [["c48_hub", "c48_senior"], ["c48_engine", "c48_label"], ["c48_pen", "c48_call"]],
  choiceEffects: {
    c48_hub: [
      { trust: 10, humanCost: -5, legitimacy: 3, capital: -5, time: -4, fatigue: 4 },
      { legitimacy: 9, trust: 2, time: -5, capital: -1, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 6, trust: -4, legitimacy: -1, humanCost: 4, fatigue: -3 },
    ],
    c48_engine: [
      { trust: 11, humanCost: -6, time: -5, capital: -2, fatigue: 5 },
      { legitimacy: 11, trust: 4, time: -5, capital: -1, humanCost: 3, fatigue: 4 },
      { time: 6, capital: 4, trust: -4, legitimacy: -2, humanCost: 4, fatigue: -4 },
    ],
    c48_pen: [
      { trust: 11, humanCost: -4, legitimacy: -2, time: -3, fatigue: 4 },
      { legitimacy: 10, trust: 2, capital: -3, time: -5, humanCost: 3, fatigue: 4 },
      { time: 6, capital: 5, trust: -4, legitimacy: -3, humanCost: 4, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c48_hub: {
      voice: ["라이더 보증금을, 맨 앞 순서로 올리는 조건을 요구한다.", "권도현의 뚜껑 계산서를, 심사 자료로 정식 접수한다.", "브릿지 쪽 계산이라며, 참고만 하고 덮는다."],
      echo: ["순서를 바꾸자는 말에 권도현이 뚜껑을 한 번 더 뒤집습니다. 브릿지의 80억이 한 칸 내려가면 브릿지 쪽 서명이 빠질 수 있습니다.", "접수된 뚜껑은 심사 자료 번호를 받습니다. 사무국 직원이 컵라면 냄새가 난다며 비닐에 넣습니다.", "덮은 뚜껑은 옥상 쓰레기통으로 갑니다. 라이더 칸은 테두리에 적힌 채로 버려집니다."],
    },
    c48_engine: {
      voice: ["바뀐 결과 칸 때문에 거절당한 사람들부터, 찾아 연락한다.", "결과 칸이 바뀐 272건을, 금융감독원 한지우에게 보낸다.", "위원회가 급하니, 결과 칸 문제는 다음 주로 미룬다."],
      echo: ["연락을 돌리면 첫 번째로 받는 사람은 문가을입니다. 끝까지정밀의 거절 사유가 무엇이었는지, 이번에는 이유까지 말해 줄 수 있습니다.", "한지우는 연휴에도 답장합니다. '숫자 272 확인. 오전 9시 전에 요청서 발송.' 요청서가 위원회보다 먼저 닿을지는 모릅니다.", "다음 주가 되면 위원회는 끝나 있습니다. 노아는 그 사이에도 같은 칸으로 서른 건을 더 심사합니다."],
    },
    c48_pen: {
      voice: ["민하랑에게, 투자 철회 가능성을 먼저 솔직히 알린다.", "투자 조건 전문과 부속 합의서를, 위원회에 내라고 요구한다.", "10시 마감에 맞춰, 위원회 순서를 앞당기자고 한다."],
      echo: ["솔직히 알리면 민하랑이 한참 말이 없습니다. 그리고 라이더 단체방에 올릴 문장을 세 번 지웠다 씁니다.", "전문을 요구하면 조현석이 웃음을 멈춥니다. '부속 합의서라는 건 없어요.' 없는 서류치고는 대답이 너무 빠릅니다.", "순서를 당기면 마감에는 맞습니다. 위원들이 파일을 읽을 시간도 그만큼 줄어듭니다."],
    },
  },
  reactionScenes: [
    ["c48_senior_reaction", "c48_senior", "c48_engine", "58개의 이름", "민하랑", "계단참에서 듣고 있던 민하랑이 옥상 문을 엽니다. '제 회사를 망하는 순서대로 줄 세우지 마세요.' 권도현이 뚜껑을 내려놓지 않습니다. 민하랑이 휴대폰에서 파일 하나를 엽니다. 플로우온 마지막 72시간에 그가 배차표에서 지운 단기 기사 58명의 명단입니다. 이름 옆마다 작은 메모가 있습니다. '아이 돌', '어머니 투석', '라면 물 담당'. 강태민이 마지막 메모를 보고 웃다가 고개를 돌립니다. '라면 물 담당은 나였는데.' 민하랑이 명단을 닫습니다. '이 명단 다시 만들기 싫어서 돈 빌리는 거예요.'", ["망하는 순서를 세는 건 안 망하게 하려는 거라고 말한다", "58명 명단과 지금 라이더 명단을 나란히 놓아 본다", "감정은 빼고 숫자로만 이야기하자고 한다"]],
    ["c48_label_reaction", "c48_label", "c48_pen", "빠진 사람 목록", "에코", "에코가 한 줄을 더 띄웁니다. '노아의 학습 기록에는 제 판단 로그도 들어 있습니다. 트리거랩 첫날 플로우온 파일에서 당신이 고른 선택도 있습니다. 노아는 당신에게서도 배웠습니다.' 류세아가 숨겼던 송편을 조용히 책상에 내려놓습니다. 에코가 이어 말합니다. '노아의 점수표에는 라이더 1,380명과 동네 가게 96곳의 칸이 없습니다. 대출 계약의 당사자가 아니기 때문입니다. 지난번에 드린 말을 반복합니다. 방금 판단에서 빠진 사람을 다시 계산하십시오. 이번에는 그 목록에 당신도 있습니다.'", ["에코에게 라이더와 가게를 넣어 다시 계산해 달라고 한다", "내 반응 기록이 노아 학습에 쓰인 범위를 공식 확인한다", "에코의 계산은 듣기만 하고 위원회 준비로 돌아간다"]],
    ["c48_call_reaction", "c48_call", "c48_final", "비겁한 부탁", "민하랑", "통화가 끝나자 골목 끝에서 민하랑이 걸어옵니다. 손에 어머니가 싸 준 송편 봉지가 들려 있습니다. 강태민에게 주소를 물어 왔다고 합니다. 계단참에 앉아 그가 한참 봉지만 만지다 입을 엽니다. '사실 제7조, 저도 무서워요. 라운드힐이 넣으라고 했어요. 안 넣으면 투자 안 한대서.' 그가 웃는데 눈가가 붉습니다. '반대 의견 쓰셨던 분이 위원이라길래 좀 기대했어요. 막아 주시면 제가 거절 안 해도 되니까. 비겁하죠. 근데 막으면 우리 214명 10월 월급은요?'", ["민하랑이 직접 제7조를 거절할 수 있게 곁에 선다", "민하랑의 말을 진술서로 받아 위원회에 낸다", "대표가 원하는 건 승인이라며 말을 줄인다"]],
  ],
  reactionEffects: {
    c48_senior: [
      { trust: 9, humanCost: -4, time: -4, fatigue: 4 },
      { trust: 7, legitimacy: 5, humanCost: -3, time: -5, capital: -2, fatigue: 4 },
      { time: 4, capital: 3, trust: 2, legitimacy: -2, humanCost: 2, fatigue: -3 },
    ],
    c48_label: [
      { trust: 8, humanCost: -5, legitimacy: 2, time: -5, capital: -2, fatigue: 4 },
      { legitimacy: 10, trust: 3, time: -4, capital: -1, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 3, trust: 3, legitimacy: -3, humanCost: 3, fatigue: -2 },
    ],
    c48_call: [
      { trust: 10, humanCost: -4, legitimacy: 3, capital: -3, time: -4, fatigue: 5 },
      { legitimacy: 9, trust: 4, time: -4, humanCost: 1, fatigue: 2 },
      { time: 4, capital: 4, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -4 },
    ],
  },
  reactionCopy: {
    c48_senior: {
      voice: ["망하는 순서를 세는 건, 안 망하게 하려는 거라고 말한다.", "58명 명단과 지금 라이더 명단을, 나란히 놓아 본다.", "감정은 빼고, 숫자로만 이야기하자고 한다."],
      echo: ["그 말에 민하랑이 뚜껑을 받아 듭니다. 그리고 테두리의 라이더 칸을 자기 볼펜으로 한 번 더 진하게 긋습니다.", "나란히 놓으면 이름 여섯 개가 두 명단에 모두 있습니다. 유하온도 그중 하나입니다.", "숫자로만 말하면 대화는 빨라집니다. 민하랑은 그 뒤로 58이라는 숫자를 다시 꺼내지 않습니다."],
    },
    c48_label: {
      voice: ["에코에게, 라이더와 가게를 넣어 다시 계산해 달라고 한다.", "내 반응 기록이 노아 학습에 쓰인 범위를, 공식 확인한다.", "에코의 계산은 듣기만 하고, 위원회 준비로 돌아간다."],
      echo: ["다시 계산하자 루프나우의 등급이 A에서 C로 내려갑니다. 에코가 덧붙입니다. '등급은 내려갔지만 사람들은 그대로입니다. 등급이 누구를 지키는지는 서명이 정합니다.'", "확인 요청서에는 당신 이름이 정보를 준 사람으로 적힙니다. 노아에게 가르친 사람 칸에 처음으로 이름이 생깁니다.", "돌아가는 길에 에코의 화면이 절전 모드로 바뀝니다. 마지막 줄은 지워지지 않고 남아 있습니다."],
    },
    c48_call: {
      voice: ["민하랑이 직접 제7조를 거절할 수 있게, 곁에 선다.", "민하랑의 말을 진술서로 받아, 위원회에 낸다.", "대표가 원하는 건 승인이라며, 말을 줄인다."],
      echo: ["곁에 서 주겠다고 하자 민하랑이 송편 봉지를 당신 손에 쥐여 줍니다. '그럼 제가 조현석한테 먼저 전화할게요. 떨리면 옆에서 기침해 주세요.'", "진술서가 되면 민하랑의 두려움은 기록이 됩니다. 기록이 된 두려움을 투자사가 읽게 될 수도 있습니다.", "말을 줄이면 민하랑이 고개를 끄덕이고 일어섭니다. 계단을 내려가며 한 번도 돌아보지 않습니다."],
    },
  },
  reactionMemos: {
    c48_senior_reaction: ["배차표에서 지운 58개의 이름", "다시 만들고 싶지 않은 명단"],
    c48_label_reaction: ["노아가 배운 사람 중 하나: 당신", "점수표에 칸이 없는 1,476곳"],
    c48_call_reaction: ["투자사가 넣으라고 한 조항", "대신 막아 달라는 비겁한 부탁"],
  },
  branchPlan: ["c48_hub", 2, "c48_branch_riders", "c48_branch_riders_follow"],
  branchScenes: {
    // CASE 48's detour is the riders' container. The committee argues over a
    // company's balance sheet; the side door is the money that sits on nobody's
    // balance sheet but still disappears first when the clause fires.
    c48_branch_riders: {
      phase: "SIDE DOOR",
      title: "보증금 200만 원",
      speaker: "유하온",
      text: "자정을 넘긴 라이더 쉼터 컨테이너. 헬멧을 벗은 얼굴 하나가 강태민을 보고 벌떡 일어납니다. 플로우온 야간조 막내였던 유하온입니다. 지금은 루프나우 라이더 2년 차입니다. 그가 휴대폰으로 계약서를 보여 줍니다. 전기자전거를 쓰려면 보증금 200만 원을 회사에 맡겨야 하고, 라이더 1,380명이 맡긴 돈을 합치면 27억 6천만 원입니다. 그 돈은 따로 보관되지 않고 회사 운영비 통장에 섞여 있습니다. 유하온이 웃습니다. '대표님 좋은 분이에요. 사고 나면 자기 월급으로 병원비 내 줘요. 근데 회사가 망하면 이 200은 누가 돌려줘요? 플로우온 때 제 마지막 달 수당은 아무도 안 돌려줬거든요.'",
      memo: ["라이더 보증금 1인 200만 원 × 1,380명", "보관 방식: 운영비 통장에 섞여 있음", "유하온: 전 플로우온 야간조 막내, 루프나우 2년 차", "플로우온 때 못 받은 마지막 달 수당"],
      triggers: ["protection", "injustice", "affection"],
      choices: [
        { id: "c48_branch_riders_a", label: "보증금을 따로 떼어 맡겨 두는 조건을 대출에 넣자고 한다", effect: { trust: 11, legitimacy: 5, capital: -6, time: -5, fatigue: 5 }, next: "c48_branch_riders_follow", cognition: { reframing: 2 } },
        { id: "c48_branch_riders_b", label: "보증금이 어디에 쓰였는지 장부부터 확인한다", effect: { legitimacy: 10, trust: 3, time: -6, humanCost: 3, fatigue: 5 }, next: "c48_branch_riders_follow", cognition: { inference: 2 } },
        { id: "c48_branch_riders_c", label: "라이더 일은 대출 심사 밖이라며 넘어간다", effect: { time: 6, capital: 5, trust: -5, humanCost: 5, fatigue: -4 }, next: "c48_branch_riders_follow", cognition: { risk: 1 } },
      ],
    },
    c48_branch_riders_follow: {
      phase: "SIDE DOOR",
      title: "오늘도 무사히",
      speaker: "민하랑",
      text: "새벽 1시, 쉼터로 민하랑이 컵라면 두 상자를 들고 옵니다. 강태민이 물을 붓는 동안 그가 보증금 이야기를 듣고 한참 말이 없습니다. '투자사가 보증금 계좌를 따로 두지 말래요. 현금이 많아 보여야 투자금이 들어온다고요.' 그가 라이더 단체방을 보여 줍니다. 추석 당일 배송 4,212건, 사고 0건, 그리고 새벽마다 대표가 올리는 '오늘도 무사히' 한 줄. 유하온이 라면을 불며 말합니다. '좋은 사람이 대표인 회사도 망해요. 플로우온 대표님도 좋은 사람이었어요.' 민하랑의 젓가락이 멈춥니다. 강태민이 두 번째 컵라면을 그의 앞으로 밀어 줍니다.",
      memo: ["투자사 요구: 보증금 계좌를 따로 두지 말 것", "추석 당일 배송 4,212건 -- 사고 0건", "대표의 새벽 인사: '오늘도 무사히'", "강태민의 두 번째 컵라면"],
      triggers: ["trust", "responsibility", "fear"],
      choices: [
        { id: "c48_branch_riders_follow_a", label: "민하랑과 라이더 대표를 한자리에 앉혀 조건을 같이 쓴다", effect: { trust: 12, humanCost: -4, capital: -5, time: -6, fatigue: 5 }, next: "c48_senior", cognition: { reframing: 3 } },
        { id: "c48_branch_riders_follow_b", label: "라이더 보증금 명세를 심사 자료에 정식으로 붙인다", effect: { legitimacy: 11, trust: 4, time: -5, humanCost: 3, fatigue: 3 }, next: "c48_senior", cognition: { inference: 2 } },
        { id: "c48_branch_riders_follow_c", label: "밤이 늦었다며 보증금 이야기는 위원회 뒤로 미룬다", effect: { time: 5, capital: 4, trust: -4, humanCost: 4, fatigue: -4 }, next: "c48_senior", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c48_start",
    result: "c48_aftershock",
    defaultFree: "c48_route_system",
    // One committee, five boxes. Like the cases before it the line does not
    // split; the split is what the analyst's own box ends up holding.
    choices: {},
    system: {
      route: "c48_route_system",
      final: "c48_final_system_route",
      title: "빈칸의 통계",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 KD캐피탈 심사위원회의 지난 10년 서명지 1,318건을 엽니다. 위원이 이름을 걸고 반대 의견을 쓴 건 아홉 번뿐입니다. 위원장에게 서명을 넘기거나 기권한 칸은 406개입니다. 아홉 건 가운데 일곱 건은 나중에 반대한 사람이 옳았고, 빈칸이 하나라도 있던 안건은 전원이 서명한 안건보다 네 배 자주 무너졌습니다. '빈칸은 반대보다 마흔다섯 배 흔했습니다. 빈칸을 남긴 사람은 누구도 인사 기록에 불리한 줄을 얻지 않았습니다. 반대한 아홉 명 가운데 여섯 명은 2년 안에 다른 부서로 옮겨졌습니다.'",
      memo: ["서명지 1,318건 중 이름을 건 반대 의견 9건", "위원장에게 넘긴 칸과 기권 칸 406개", "빈칸 있는 안건이 무너진 비율: 전원 서명 안건의 4배"],
      routeChoices: [
        ["c48_route_system_publish", "빈칸 통계를 위원 전원과 준법감시인에게 공개한다", { legitimacy: 11, trust: 4, capital: -4, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c48_route_system_rule", "위원장에게 서명을 넘기는 관행을 없애는 개정안을 낸다", { legitimacy: 9, trust: 3, time: -6, humanCost: 3, fatigue: 6 }, { reframing: 2 }],
        ["c48_route_system_drop", "통계는 덮고 이번 안건에만 집중한다", { time: 7, capital: 6, trust: -6, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "빈칸이 하나라도 생기면 안건이 자동으로 멈추는 규칙을 만든다", { legitimacy: 13, trust: 6, capital: -7, humanCost: 3, fatigue: 7 }, { reframing: 3 }],
      ["b", "빈칸은 그대로 두고 서명한 사람에게만 책임을 묻는다", { capital: 8, time: 6, trust: -5, legitimacy: -6, humanCost: 6, fatigue: -4 }, { risk: 2 }],
      ["c", "반대 의견을 쓴 위원을 인사에서 보호하는 조항을 만든다", { trust: 10, legitimacy: 8, capital: -6, time: -7, humanCost: -3, fatigue: 7 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c48_evidence_turn",
    result: "c48_aftershock",
    sourceRoutes: ["c48_hub", "c48_engine", "c48_pen", "c48_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 라운드힐 투자 계약서 옆에 놓고, 목차에 없는 쪽이 있는지 맞춰 본다.",
    entryEcho: "단서를 대면 제7조가 왜 그대로 복사됐는지 보입니다. 조항이 터지길 기다리는 사람이 누구인지도 함께 보입니다.",
    title: "41%",
    speaker: "반재욱",
    text: "단서를 맞추자 라운드힐 캐피탈 투자 계약서의 맨 뒤, 목차에 없는 두 쪽이 열립니다. 이면 합의(공식 계약서 밖에서 따로 맺은 약속)입니다. 루프나우가 제7조 때문에 만기 전 회수를 당하면, 라운드힐이 KD캐피탈의 대출 채권을 원금의 41%에 사들일 권리를 갖습니다. 사들인 뒤 회사를 정리할 자문역(실무 책임 없이 조언만 하는 자리)의 이름도 적혀 있습니다. 윤상혁. 반재욱이 수첩을 폅니다. '그때 넥스트마일은 핵심 사업부를 장부가의 42%에 사겠다고 했죠. 이번엔 1%포인트 싸졌습니다. 조항을 넣은 사람과 조항이 터지길 기다리는 사람이, 이번에도 같은 테이블에 앉아 있습니다.'",
    memo: ["이면 합의: 회수 시 대출 채권을 원금의 41%에 인수", "인수 뒤 정리 자문역: 윤상혁", "2023년 넥스트마일 제안: 장부가의 42%"],
    triggers: ["injustice", "system", "revenge"],
    entryEffect: { legitimacy: 7, trust: 4, time: -5, capital: -2, fatigue: 3 },
    choices: [
      ["c48_evidence_turn_attach", "이면 합의를 의사록에 첨부하기 전에는 서명하지 않는다", { legitimacy: 13, trust: 4, capital: -7, time: -6, humanCost: 1, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c48_evidence_turn_hold", "이면 합의는 알아 두고 표결 직전에 꺼낸다", { capital: 8, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -3 }, { risk: 2 }],
      ["c48_evidence_turn_founder", "민하랑에게 먼저 이면 합의를 보여 주고 함께 정한다", { trust: 12, legitimacy: 6, capital: -6, humanCost: -5, fatigue: 7 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c48_branch_riders",
    systemNext: "c48_route_system",
    evidenceNext: "c48_evidence_turn",
    routeLabel: "직전 사건의 떡방 명단처럼 라이더 명단부터 이름으로 센다",
    systemLabel: "직전 자유응답 문장이 이번 서명지 빈칸 통계에도 남는지 본다",
    evidenceLabel: "직전 단서를 붙여 투자 계약서의 목차에 없는 쪽을 연다",
  },
  openingRoutes: {
    c47_after_warm: "c48_start_warm",
    c47_after_record: "c48_start_record",
    c47_after_rush: "c48_start_rush",
  },
  openingCopy: {
    c48_start_warm: ["달 아래서 받은 파일", "도윤하", "추석 밤, 가을떡방 옥상에서 송편을 빚다가 호출 문자를 받았습니다. 내일 오전 9시 KD캐피탈 임시 심사위원회, 안건은 루프나우. 도윤하가 화면을 들여다보다 손을 멈춥니다. 도심 15분 배송, 직원 214명, 라운드힐 캐피탈 투자 480억, 그리고 그 투자의 선행 조건(투자금이 들어오기 전에 먼저 갖춰야 할 조건)인 KD캐피탈 대출 290억. '이거 플로우온이잖아요. 이름만 바꾼.' 문가을이 남은 송편을 봉지에 싸서 내밉니다. '달 질 때까지 같이 있기로 했잖아요. 장소만 바꿔요.' 도윤하가 앞치마를 벗으며 웃습니다. '저는 그때 창구에서 파는 사람이었죠. 이번엔 서명하는 사람 옆에 있을게요.'", ["호출: 내일 09:00 임시 심사위원회", "루프나우 대출 290억 -- 라운드힐 투자 480억의 조건", "문가을: '장소만 바꿔요'"]],
    c48_start_record: ["요청서를 보낸 뒤의 파일", "채이안", "추석 밤 11시, 서른한 명의 이야기와 증거를 묶은 배상 기준 개정 요청서를 선재윤에게 보내고 나서야 안건 파일을 엽니다. 곧바로 채이안의 전화가 옵니다. '문서 좋아하는 사람이니 14쪽부터 보세요.' 내일 오전 9시 임시 심사위원회, 루프나우 운영자금 대출 290억. 첫 장 서명란 다섯 칸 가운데 맨 아래 칸에 당신 이름이 인쇄돼 있습니다. 14쪽 제7조는 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자)이 180%를 넘으면 즉시 회수한다는 문장입니다. 방금 보낸 문서가 2023-0412의 뒷수습이었다면, 이 파일은 그 앞장입니다.", ["배상 기준 개정 요청서 발송 -- 서른한 명의 문장", "심사위원회 서명란 맨 아래 칸: 당신", "제7조: 부채비율 180% 초과 시 즉시 회수"]],
    c48_start_rush: ["먼저 내려온 밤의 전화", "오진우", "추석 밤, 옥상을 먼저 내려와 택시에서 안건 파일을 여는데 브릿지은행의 오진우가 전화를 겁니다. '우리 은행이 루프나우라는 회사에 80억을 넣기로 했어요. 조건이 KD캐피탈 290억이래요. 내일 9시 심사위원회, 거기 당신 이름 있죠?' 화면 맨 아래 칸에 정말 당신 이름이 있습니다. 오진우가 먼저 읽어 줍니다. 도심 15분 배송, 직원 214명, 투자 480억, 그리고 14쪽 제7조. 부채비율(회사 빚이 자기 돈의 몇 배인지 보는 숫자) 180% 초과 시 즉시 회수. 오진우가 웃지 않습니다. '그 대출 계약서에 있던 조항이에요. 토씨 하나 안 틀리고요. 누가 복사해 붙였는지는 몰라도, 이번엔 서명한 사람 이름이 남겠네요.'", ["브릿지은행 80억 -- KD캐피탈 290억이 조건", "택시 안에서 연 파일 14쪽: 제7조", "택시 행선지: KD캐피탈 본사"]],
  },
  openingSignatures: {
    c48_start_warm: {
      label: "도윤하와 송편을 들고 루프나우 사람들부터 만나러 간다",
      effect: { trust: 10, humanCost: -5, legitimacy: 2, time: -7, capital: -3, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "도윤하와 송편을 들고, 루프나우 사람들부터 만나러 간다.",
      echo: "송편을 든 은행 사람 둘이 다크스토어에 들어서면 라이더들이 먼저 웃습니다. 심사하러 온 사람처럼 보이지 않는 것도 비용입니다.",
    },
    c48_start_record: {
      label: "2023-0412 계약서 원본을 꺼내 제7조 옆에 나란히 놓는다",
      effect: { legitimacy: 12, trust: -3, time: -6, capital: -2, humanCost: 2, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "2023-0412 계약서 원본을 꺼내, 제7조 옆에 나란히 놓는다.",
      echo: "나란히 놓으면 다른 곳은 딱 한 군데, 회사 이름뿐입니다. 채이안이 그 사진을 찍어 둡니다.",
    },
    c48_start_rush: {
      label: "오진우에게 브릿지 쪽 조건서 전문을 오늘 밤 받아 낸다",
      effect: { legitimacy: 7, trust: 4, capital: 3, time: -4, humanCost: 3, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "오진우에게, 브릿지 쪽 조건서 전문을 오늘 밤 받아 낸다.",
      echo: "오진우는 보내 줍니다. 보낸 기록은 브릿지은행 보안팀에도 남습니다. 그는 '이것도 승부죠'라고만 합니다.",
    },
  },
  voiceLines: {
    // CASE 48. The analyst is a signatory for the first time, so every line is
    // said by someone whose name will be on the page.
    c48_start_visit: "파일보다 사람이 먼저라며, 루프나우 대표를 오늘 밤 현장에서 직접 만난다.",
    c48_start_compare: "2023-0412 계약서와, 조항을 한 줄씩 대조한다.",
    c48_start_score: "노아의 A등급을 기준 삼아, 검토 시간을 줄인다.",
    c48_hub_riders: "라이더와 직원 명단부터 받아, 누가 다칠지 센다.",
    c48_hub_plan: "상환 재원이 투자뿐인 계획서를, 숫자로 따진다.",
    c48_hub_believe: "민하랑의 각오를 믿고, 현장 확인을 짧게 끝낸다.",
    c48_branch_riders_a: "보증금을 따로 떼어 맡겨 두는 조건을, 대출에 넣자고 한다.",
    c48_branch_riders_b: "보증금이 어디에 쓰였는지, 장부부터 확인한다.",
    c48_branch_riders_c: "라이더 일은 대출 심사 밖이라며, 넘어간다.",
    c48_branch_riders_follow_a: "민하랑과 라이더 대표를 한자리에 앉혀, 조건을 같이 쓴다.",
    c48_branch_riders_follow_b: "라이더 보증금 명세를, 심사 자료에 정식으로 붙인다.",
    c48_branch_riders_follow_c: "밤이 늦었다며, 보증금 이야기는 위원회 뒤로 미룬다.",
    c48_engine_people: "노아가 셈에서 뺀 라이더와 가게를, 점수표에 다시 넣는다.",
    c48_engine_report: "2023-0412의 결과 우수 표시를, 공식 오류로 신고한다.",
    c48_engine_note: "노아 점수는 두고, 에코 분석을 참고 의견으로만 붙인다.",
    c48_pen_aloud: "반대 의견을, 동료들과 함께 한 줄씩 소리 내어 쓴다.",
    c48_pen_clauses: "조건을 조항 단위로 적은, 승인 조건 초안을 쓴다.",
    c48_pen_wait: "지금은 쓰지 않고, 회의실 분위기를 보고 정한다.",
    c48_final_dissent: "반대 의견을 쓰고, 내 이름으로 서명한다.",
    c48_final_condition: "제7조 삭제와 보증금 분리를 붙여, 조건부 승인에 서명한다.",
    c48_final_handover: "서명을 위원장에게 넘기고, 내 칸을 비워 둔다.",
    c48_after_warm: "송편을 들고, 동료들과 헌책방에서 막차가 끊길 때까지 남는다.",
    c48_after_record: "심사위원회 결론과 내 의견을, 다음 심사에도 남도록 문서로 접수한다.",
    c48_after_rush: "곧장 사무실로 돌아가, 윤상혁 시절의 승인 문서를 다시 넘긴다.",
    c48_route_system_publish: "빈칸 통계를, 위원 전원과 준법감시인에게 공개한다.",
    c48_route_system_rule: "위원장에게 서명을 넘기는 관행을, 없애는 개정안을 낸다.",
    c48_route_system_drop: "통계는 덮고, 이번 안건에만 집중한다.",
    c48_final_system_route_a: "빈칸이 하나라도 생기면, 안건이 자동으로 멈추는 규칙을 만든다.",
    c48_final_system_route_b: "빈칸은 그대로 두고, 서명한 사람에게만 책임을 묻는다.",
    c48_final_system_route_c: "반대 의견을 쓴 위원을, 인사에서 보호하는 조항을 만든다.",
    c48_evidence_turn_attach: "이면 합의를 의사록에 첨부하기 전에는, 서명하지 않겠다고 한다.",
    c48_evidence_turn_hold: "이면 합의는 알아 두고, 표결 직전에 꺼낸다.",
    c48_evidence_turn_founder: "민하랑에게 먼저 이면 합의를 보여 주고, 함께 정한다.",
  },
  echoReplies: {
    // CASE 48.
    c48_start_visit: "현장에 가면 파일의 숫자들이 헬멧을 쓴 얼굴이 됩니다. 얼굴을 본 사람은 반대 의견을 쓰기가 더 어려워집니다.",
    c48_start_compare: "대조하면 다른 글자는 회사 이름과 날짜뿐입니다. 복사한 사람이 누구인지는 조항이 말해 주지 않습니다.",
    c48_start_score: "시간은 벌립니다. 노아의 A등급이 무엇을 보고 나온 점수인지는 아무도 묻지 않은 채 아침 9시가 옵니다.",
    c48_hub_riders: "명단을 받으면 1,380명의 이름이 스크롤 끝까지 이어집니다. 민하랑은 그중 절반의 생일을 외웁니다.",
    c48_hub_plan: "숫자로 따지면 민하랑의 얼굴이 굳습니다. '다음 투자가 안 되면요? 그런 생각은 안 해 봤어요.' 거짓말은 아닙니다.",
    c48_hub_believe: "믿어 주면 민하랑이 활짝 웃습니다. 계획서 마지막 장은 넘기지 않은 채로 가방에 들어갑니다.",
    c48_branch_riders_a: "조건이 붙으면 보증금 27억은 회사가 쓸 수 없는 돈이 됩니다. 라운드힐이 싫어할 조건입니다.",
    c48_branch_riders_b: "장부를 보면 보증금 가운데 19억이 이미 다크스토어 세 곳의 보증금으로 나가 있습니다. 돈이 돈을 맡긴 셈입니다.",
    c48_branch_riders_c: "넘어가면 심사 파일은 가벼워집니다. 유하온은 헬멧을 다시 쓰고 새벽 배송을 나갑니다.",
    c48_branch_riders_follow_a: "한자리에 앉히자 유하온이 대표보다 먼저 말합니다. '조건 하나만요. 보증금 통장 번호를 우리도 볼 수 있게.'",
    c48_branch_riders_follow_b: "명세가 붙으면 위원회 파일에 처음으로 라이더라는 단어가 들어갑니다. 쪽수가 11쪽 늘어납니다.",
    c48_branch_riders_follow_c: "미뤄 두면 컵라면은 맛있습니다. 위원회가 끝난 뒤에 이 이야기를 들어 줄 자리는 정해져 있지 않습니다.",
    c48_engine_people: "다시 넣으면 점수표가 두 배로 길어집니다. 노아는 새 칸을 읽는 법을 모릅니다. 사람이 읽어야 합니다.",
    c48_engine_report: "신고서는 접수 번호를 받습니다. 연휴라 처리 담당자 칸은 비어 있습니다.",
    c48_engine_note: "참고 의견은 서명지 뒷장에 붙습니다. 뒷장은 대개 아무도 넘기지 않습니다.",
    c48_pen_aloud: "소리 내어 쓰면 문하준이 받아 적고, 나준혁이 틀린 맞춤법을 고칩니다. 반대 의견이 처음으로 여러 사람의 목소리를 갖습니다.",
    c48_pen_clauses: "조항 단위로 쓰면 반대는 협상이 됩니다. 협상은 상대가 받아야 성립합니다.",
    c48_pen_wait: "쓰지 않고 가면 두 시간을 법니다. 회의실의 분위기는 대개 가장 먼저 서명한 사람이 만듭니다.",
    c48_final_dissent: "이번 반대 의견은 반려되지 않습니다. 안건은 이사회로 올라가고, 10시는 지나가고, 민하랑의 휴대폰이 울리기 시작합니다.",
    c48_final_condition: "조건부 승인은 조현석이 조건을 받아야 살아납니다. 제7조가 빠진 계약서에 그가 서명할지는 10시에 알게 됩니다.",
    c48_final_handover: "넘기면 채이안이 당신 칸에 '위임에 따라'라고 적습니다. 서명지에는 빈칸이 없지만, 당신 글씨도 없습니다.",
    c48_after_warm: "헌책방 불이 막차 시간을 넘겨서까지 켜져 있습니다. 서류 얘기는 한 줄도 나오지 않고, 송편 접시만 세 번 비워집니다.",
    c48_after_record: "접수된 문서는 누구든 찾아볼 수 있습니다. 누구든이라는 말에는, 읽을 권한이 없어야 할 사람도 들어갑니다.",
    c48_after_rush: "불 꺼진 층에서 문서를 넘기는 동안 단체방의 송편 사진이 쌓입니다. 출입문 기록기는 당신이 들어간 시각을 조용히 적습니다.",
    c48_route_system_publish: "통계를 받은 위원 중 둘이 서명지를 다시 읽기 시작합니다. 우지환은 통계의 출처부터 묻습니다.",
    c48_route_system_rule: "개정안은 다음 달 이사회에 올라갑니다. 내일 아침 서명지에는 아직 위임 칸이 있습니다.",
    c48_route_system_drop: "덮으면 406개의 빈칸은 406개인 채로 남습니다. 내일 아침 407번째가 생길 수도 있습니다.",
    c48_final_system_route_a: "자동으로 멈추는 규칙은 빈칸을 없앱니다. 대신 한 사람의 결석으로 급한 대출도 멈춥니다.",
    c48_final_system_route_b: "서명한 사람만 책임지면 서명하지 않는 게 가장 안전해집니다. 다음 해 빈칸은 두 배가 됩니다.",
    c48_final_system_route_c: "보호 조항이 생기면 반대한 아홉 명 중 여섯의 인사 기록이 다시 검토됩니다. 그중 하나는 채이안입니다.",
    c48_evidence_turn_attach: "첨부를 요구하면 우지환이 처음으로 손목시계를 보지 않습니다. 두 쪽의 존재를 그도 몰랐던 얼굴입니다.",
    c48_evidence_turn_hold: "아껴 두면 표결 순간의 효과는 큽니다. 그 사이 민하랑은 그 두 쪽이 있는 줄도 모르고 조현석에게 고맙다고 문자를 보냅니다.",
    c48_evidence_turn_founder: "보여 주면 민하랑이 두 쪽을 세 번 읽습니다. 그리고 묻습니다. '41%면, 우리 라이더 보증금은 몇 퍼센트예요?'",
  },
  characterProfiles: {
    민하랑: {
      role: "루프나우 대표 · 전 플로우온 야간 배차 매니저 · 31세",
      stance: "신념 · 죄책감 · 속도",
      job: "플로우온의 마지막 72시간 동안 배차표에서 이름 58개를 지운 사람. 다시는 명단을 지우지 않으려고, 같은 모양의 회사를 만들었다.",
      appearance: "소매에 형광 반사띠가 붙은 루프나우 점퍼, 배터리 팩을 매단 휴대폰, 라이더 단체방 알림이 쉬지 않는 손목시계.",
      thought: "안 망하면 된다. 망하지 않을 수만 있다면 무서운 조항 하나쯤은 삼킬 수 있다.",
      gesture: "민하랑은 불안하면 배차 앱을 새로고침한다. 지도 위의 점들이 움직이는 걸 확인해야 다음 말을 한다.",
      voice: "빠르고 밝게 말하다가, 숫자가 사람 이름으로 바뀌는 순간 반 박자 느려진다.",
      line: "우리는 안 망해요. 그러려고 만든 회사예요.",
    },
    우지환: {
      role: "KD캐피탈 기업금융본부장 · 루프나우 안건 발의자",
      stance: "성과 · 확신 · 매끄러움",
      job: "개혁 뒤 첫 성장 금융이라는 제목을 원한다. 회장의 뜻이라고 말하지 않고, 시장의 기대라고 말한다.",
      appearance: "마라톤 완주 사진이 배경 화면인 태블릿, 넥타이 대신 단정한 니트, 분 단위로 맞춰 둔 시계 알람.",
      thought: "반대 의견이 기록에 남는 시대다. 그러니 반대가 있어도 대출은 나갈 수 있다.",
      gesture: "우지환은 불리한 질문을 받으면 손목시계를 한 번 보고, 대답을 구간 기록처럼 짧게 끊는다.",
      voice: "공손하고 매끄럽고, 모든 문장이 '다만'에서 한 번 꺾인다.",
      line: "이번엔 서명란 다섯 칸을 전부 채웁니다. 그게 개혁 아닙니까.",
    },
  },
  setting: { place: "KD캐피탈 본사 · 위험관리부", clock: "추석 밤 · 심사위원회까지 11시간" },
  sceneContext: {
    c48_start: {
      place: "KD캐피탈 본사 · 위험관리부",
      clock: "9월 말 · 추석 밤 21:40 · 심사위원회까지 11시간",
      question: "2023-0412의 제7조가 토씨 하나 다르지 않은 채 새 안건에 들어 있고, 서명란에는 당신 이름이 있습니다. 무엇부터 하겠습니까?",
      lead: "추석 밤, 떡 냄새가 아직 옷에 밴 채로 채이안의 호출을 받고 KD캐피탈 12층에 올라왔습니다.",
    },
    c48_start_warm: {
      place: "망원시장 가을떡방 · 옥상",
      clock: "9월 말 · 추석 밤 21:40 · 보름달",
      question: "달이 질 때까지 같이 있기로 한 사람들이 장소만 바꾸자고 합니다. 누구와 무엇부터 보겠습니까?",
      lead: "보름달 아래 평상에 송편이 절반쯤 빚어져 있을 때 휴대폰이 울렸습니다.",
    },
    c48_start_record: {
      place: "망원시장 가을떡방 · 계산대",
      clock: "9월 말 · 추석 밤 23:00",
      question: "뒷수습 문서를 보낸 직후 같은 사고의 앞장을 받았습니다. 이 파일을 어떻게 읽겠습니까?",
      lead: "개정 요청서의 마지막 첨부 파일이 전송되자, 떡방 계산대 위 노트북에 안건 파일 알림이 떠 있습니다.",
    },
    c48_start_rush: {
      place: "택시 안 · 망원에서 여의도로",
      clock: "9월 말 · 추석 밤 21:50 · 보름달",
      question: "택시 안에서 연 파일의 제7조를 브릿지은행 쪽이 먼저 읽어 줍니다. 오늘 밤 무엇을 확보하겠습니까?",
      lead: "옥상 계단을 먼저 내려와 잡은 택시가 강변북로에 오르자 오진우의 이름이 화면에 뜹니다.",
    },
    c48_hub: {
      place: "성수동 루프나우 1호 다크스토어 · 야간조 물류 현장",
      clock: "추석 밤 23:40 · 보름달",
      question: "안 망하려고 만든 회사의 상환 재원 칸에 다음 투자가 적혀 있습니다. 이 현장에서 무엇을 확인하겠습니까?",
      lead: "대표 이름을 본 강태민이 말없이 따라나섰고, 성수동 골목 끝에 전기자전거 충전 불빛이 줄지어 있습니다.",
    },
    c48_branch_riders: {
      place: "성수동 골목 · 라이더 쉼터 컨테이너",
      clock: "추석 다음 날 00:30 · 보름달",
      question: "라이더 1,380명이 맡긴 보증금 27억이 운영비 통장에 섞여 있습니다. 이 돈을 어떻게 다루겠습니까?",
    },
    c48_branch_riders_follow: {
      place: "성수동 골목 · 라이더 쉼터 컨테이너",
      clock: "추석 다음 날 01:00",
      question: "투자사가 보증금 계좌를 따로 두지 말라고 했습니다. 좋은 대표의 이 선택을 어떻게 하겠습니까?",
    },
    c48_senior: {
      place: "성수동 루프나우 다크스토어 · 옥상",
      clock: "추석 다음 날 02:10 · 보름달",
      question: "컵라면 뚜껑 계산서의 맨 끝, 테두리에 라이더 보증금이 적혔습니다. 이 순서를 어떻게 하겠습니까?",
    },
    c48_senior_reaction: {
      place: "성수동 루프나우 다크스토어 · 옥상 계단참",
      clock: "추석 다음 날 02:30",
      question: "망하는 순서로 줄 세우지 말라는 대표가 58명의 명단을 내밉니다. 무엇이라 하겠습니까?",
    },
    c48_engine: {
      place: "판교 KD데이터랩 · 서버실",
      clock: "추석 다음 날 04:00 · 심사위원회까지 5시간",
      question: "노아는 무너진 대출을 '결과 우수'라며 이 안건에 A등급을 줬습니다. 이 점수를 어떻게 다루겠습니까?",
      lead: "성수에서 판교까지 새벽 고속도로를 달려왔고, 이민서가 서버실 앞에서 출입증 두 장을 흔들고 있습니다.",
    },
    c48_label: {
      place: "판교 KD데이터랩 · 데이터센터",
      clock: "추석 다음 날 04:40",
      question: "3월 17일 새벽 272건의 결과 칸이 손실에서 우수로 바뀌었습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c48_label_reaction: {
      place: "판교 KD데이터랩 · 서버실 앞 복도",
      clock: "추석 다음 날 05:10",
      question: "노아가 배운 사람 가운데 당신도 있다고 에코가 말합니다. 빠진 사람을 어떻게 다시 세겠습니까?",
    },
    c48_pen: {
      place: "회기동 헌책방 1층 · 책장 사이 탁자",
      clock: "추석 다음 날 06:30 · 보름달 · 9월 · 낙엽",
      question: "반려할 사람이 없는 서명지 앞에서 임경수의 서명 연습장을 받았습니다. 오늘 아침 무엇을 쓰겠습니까?",
      lead: "밤새 성수와 판교를 돌고 온 새벽, 헌책방 앞 골목에 낙엽이 쌓여 있고 셔터가 반쯤 올라가 있습니다.",
    },
    c48_call: {
      place: "회기동 헌책방 앞 · 골목",
      clock: "추석 다음 날 07:10",
      question: "10시까지 대출 확약이 없으면 480억이 빠진다는 전화가 왔습니다. 이 마감을 어떻게 대하겠습니까?",
    },
    c48_call_reaction: {
      place: "회기동 헌책방 1층 · 계단참",
      clock: "추석 다음 날 07:30",
      question: "대표가 자기 대신 막아 달라고, 막으면 214명은 어떻게 하냐고 묻습니다. 어떻게 답하겠습니까?",
    },
    c48_route_system: {
      place: "KD캐피탈 본사 · 기록실 단말",
      clock: "추석 밤 · 심사위원회까지 11시간",
      question: "10년 서명지에서 빈칸이 반대보다 마흔다섯 배 흔했습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c48_final_system_route: {
      place: "KD캐피탈 본사 · 기록실 단말",
      clock: "추석 다음 날 · 새벽",
      question: "서명지의 빈칸을 다루는 규칙을 하나 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c48_evidence_turn: {
      place: "KD금융그룹 감사팀 · 서고",
      clock: "추석 다음 날 · 08:00",
      question: "조항이 터지면 41%에 사들일 사람과 그 뒤를 정리할 자문역이 이미 정해져 있습니다. 이 두 쪽을 어떻게 쓰겠습니까?",
    },
    c48_final: {
      place: "KD캐피탈 본사 · 심사위원회 회의실",
      clock: "추석 다음 날(토) 09:00 · 투자 마감 10:00",
      question: "승인 둘, 조건부 승인 하나, 그리고 당신 칸입니다. 반대하면 사라지지 않지만 10시가 지나갑니다. 어떻게 서명하겠습니까?",
      lead: "한숨도 못 잔 채 올라온 회의실, 유리벽 너머 복도에 루프나우 점퍼를 입은 사람이 휴대폰을 쥐고 서 있습니다.",
    },
    c48_aftershock: {
      place: "KD캐피탈 본사 · 옥상",
      clock: "추석 다음 날 · 17:50 · 낙엽",
      question: "의사록이 올라온 저녁, 연락 없던 한 사람도 이 의사록을 읽을 거라고 합니다. 이 저녁을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c48-side-letter",
    title: "41%",
    text: "라운드힐 투자 계약서 뒤에 목차에 없는 두 쪽이 있었습니다. 제7조가 터지면 KD캐피탈의 대출 채권을 원금의 41%에 사들이고, 정리 자문역은 윤상혁입니다.",
  },
  outcomes: {
    c48_after_warm: { tag: "곁에 남은 결말", title: "심사위원회가 끝난 밤, 헌책방에서 송편을 나눠 먹었다", text: "서류 얘기는 한 줄도 하지 않았습니다. 임경수의 서명 연습장이 탁자 가운데 펼쳐져 있었고, 막차가 끊긴 뒤에야 모두 흩어졌습니다." },
    c48_after_record: { tag: "기록으로 남긴 결말", title: "심사위원회의 결론과 내 의견이 문서로 접수됐다", text: "서명란에 이름을 쓴 사람이 누구인지, 이번에는 누구든 찾아볼 수 있습니다. 반대 의견이 반려되지 않고 남은 첫 문서입니다." },
    c48_after_rush: { tag: "먼저 달려간 결말", title: "회의실을 나와 곧장 사무실로 돌아갔다", text: "불 꺼진 층에서 윤상혁 시절의 승인 문서를 한 장씩 넘겼습니다. 단체방의 송편 사진에는 '나중에'라는 답만 남겼습니다." },
  },
  carryovers: {
    c48_after_warm: { trust: 9, humanCost: -4, fatigue: -7 },
    c48_after_record: { legitimacy: 11, trust: 3, fatigue: 5 },
    c48_after_rush: { capital: 6, legitimacy: 5, trust: -7 },
  },
  continuityChallenges: {
    c47_after_warm: { id: "protect-trust", title: "보름달 밤의 사람들과 같이 서명하기", text: "떡방에서 밤을 같이 샌 사람들이 이번 파일에도 곁에 있습니다. 서명을 혼자 하지 않는 선택을 찾아야 보너스가 열립니다." },
    c47_after_record: { id: "use-reframe", title: "뒷수습 문서를 앞장으로 돌리기", text: "2차 배상 기준은 무너진 뒤의 문서였습니다. 같은 모양이 무너지기 전에, 그 기준을 심사 조건으로 바꿔 쓰는 판을 짜야 합니다." },
    c47_after_rush: { id: "repair-legitimacy", title: "먼저 나온 밤의 공정함 회복하기", text: "떡방을 먼저 나온 밤은 아무 기록도 남기지 않았습니다. 이번 서명이 누구 앞에서도 설명될 수 있는 선택을 찾아야 합니다." },
  },
};
