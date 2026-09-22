/**
 * CASE 30 -- the six scattered chairs pulled back around one table.
 *
 * Five cases have followed the analyst and the old 트리거랩 crew into the
 * corners of the group they were posted to: a stalled tower, a run on a
 * co-op, a call centre, a rooftop in Singapore. Each corner showed a new link
 * of the same chain, and each was walked by one or two of them. This case
 * gathers all six for the first time in a month -- and what brings them back is
 * the one link that is made of them. 이민서, now at KD데이터랩, finds a signed
 * contract selling three years of the lab's reaction records to 핏스코어, a
 * hiring-score company. The names are swapped for codes; A-017 is her.
 *
 * The case is about stakes, not clues. To move on the contract, every one of
 * the six has to put a seat on the table: a bank window, a five-month-old
 * permanent contract, a team lead's chair, a desk right under 윤상혁 -- and
 * 한서윤, benched, who has nothing left to lose and offers her name. 반재욱
 * does the hardest thing the season has asked of him: he crosses out his own
 * name and steps out. The emotions are all there on purpose -- a chat-room
 * name vote that ties 3-3 however often it is rerun, lunch boxes cooked by a
 * woman who still tells her mother she goes to work, a man who is hurt that
 * his hesitation had no price, a job seeker marked "slow to judge" for
 * checking his work -- and the case closes on which seat goes first. The
 * evidence turn finds that the group owns part of the buyer, and that the
 * desk that wrote "no issue" on the deal is the analyst's own. The aftermath
 * announces the regulator's inspection that opens the next act.
 */
export const case30Nodes = {
  c30_start: {
    phase: "CASE 30 BRIEFING",
    title: "임시(진짜 임시)",
    speaker: "이민서",
    text:
      "싱가포르에서 돌아온 다음 날 아침 7시 12분, 여섯 명의 단체방이 다시 울립니다. 트리거랩이 해체된 뒤 여섯 명은 각자 발령(근무지를 옮기라는 인사 명령)을 받아 흩어졌습니다. 도윤하는 강서지점 창구, 반재욱은 감사팀 지방 순회, 오진우는 브릿지은행, 한서윤은 대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 명령), 이민서는 판교 KD데이터랩, 당신은 KD캐피탈 위험관리부, 윤상혁의 바로 아래입니다. 방 이름은 그사이 열네 번 바뀌어 지금은 '임시(진짜 임시)'입니다. 어젯밤 '우리 기록이 밖으로 팔렸어요'라고 남긴 이민서가 사진 한 장을 올립니다. '데이터 제공 계약서 -- KD데이터랩 ↔ 핏스코어.' 채용 회사에 지원자 점수를 파는 곳입니다. 제공 대상 칸에는 '트리거랩 참가자 반응 기록 3년 치'. 1분 뒤 한 줄이 더 옵니다. '이거 올려도 되는 거 맞죠? 올리고 나서 물어봐서 미안해요. 오늘 저녁에 다들 모일 수 있어요?'",
    memo: [
      "계약: KD데이터랩 → 핏스코어, 서명 5월 둘째 주",
      "제공 대상: 트리거랩 참가자 63명의 반응 기록 3년 치",
      "단체방 이름 변경 14회 -- 현재 '임시(진짜 임시)'",
      "여섯 명이 마지막으로 한자리에 모인 날: 4월 첫 주",
    ],
    triggers: ["injustice", "affection", "fear"],
    choices: [
      {
        id: "c30_start_gather",
        label: "오늘 저녁 여섯 명이 얼굴을 보고 정하자고 한다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -2, fatigue: 5 },
        next: "c30_bookstore",
        cognition: { persistence: 2 },
      },
      {
        id: "c30_start_verify",
        label: "계약서가 진짜인지 원본 경로부터 확인한다",
        effect: { legitimacy: 12, time: -5, trust: -3, humanCost: 2, fatigue: 4 },
        next: "c30_bookstore",
        cognition: { inference: 2 },
      },
      {
        id: "c30_start_forward",
        label: "이민서에게 나머지 쪽도 지금 전부 보내 달라고 한다",
        effect: { capital: 7, time: 6, legitimacy: -5, trust: -3, humanCost: 3, fatigue: 1 },
        next: "c30_bookstore",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c30_bookstore",
      },
    ],
  },
  c30_bookstore: {
    phase: "REUNION",
    title: "3 대 3",
    speaker: "오진우",
    text:
      "수요일 저녁 8시, 회기동 헌책방 1층. 임경수가 셔터를 내린 가게를 내줬습니다. 책장 사이에 접이식 탁자 두 개를 붙이자 여섯 명이 한 달 만에 한자리에 앉습니다. 첫 안건은 계약서가 아니라 단체방 이름입니다. 사회를 자청한 오진우가 후보를 받습니다. '성과 없음 동창회', '반대 의견 동호회', '내일도 출근'. 결과는 3 대 3. 오진우가 '여섯 명 투표에서 동점이 나오는 건 설계 결함'이라며 자기 표를 바꾸자, 도윤하가 미안하다며 반대로 바꿉니다. 또 3 대 3입니다. 웃음이 가라앉자 이민서가 계약서 전문을 폅니다. 기록은 63명분, 대금은 18억. 가명 처리(누구인지 바로 알 수 없게 이름 대신 기호를 붙이는 것)를 했다고 적혀 있고, 용도 칸에는 '조직 적합도(회사에 맞는 사람인지를 점수로 매긴 것) 모델 개발'. 이민서가 말합니다. '이걸 꺼내면, 여기 있는 사람 모두 자기 자리를 걸어야 해요.'",
    memo: [
      "단체방 이름 투표 -- 3 대 3, 재투표 3회 모두 동점",
      "계약 대금 18억, 대상 63명",
      "가명 처리: 이름 대신 A-001부터 A-063까지",
      "용도: 핏스코어 '조직 적합도' 모델 개발",
    ],
    triggers: ["affection", "injustice", "responsibility"],
    choices: [
      {
        id: "c30_bookstore_share",
        label: "이민서 혼자 걸지 않게 여섯이 똑같이 나눠 든다",
        effect: { trust: 12, humanCost: -5, time: -4, capital: -3, fatigue: 6 },
        next: "c30_datalab",
        cognition: { persistence: 2 },
      },
      {
        id: "c30_bookstore_list",
        label: "누가 무엇을 가졌는지 목록부터 만들고 원본은 한 곳에 둔다",
        effect: { legitimacy: 11, trust: 3, time: -5, capital: -1, humanCost: 3, fatigue: 4 },
        next: "c30_datalab",
        cognition: { inference: 2 },
      },
      {
        id: "c30_bookstore_front",
        label: "잃을 것이 가장 적은 사람부터 앞에 세운다",
        effect: { capital: 6, time: 5, trust: -3, legitimacy: 2, humanCost: 4, fatigue: -2 },
        next: "c30_datalab",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c30_datalab",
      },
    ],
  },
  c30_datalab: {
    phase: "DATA LAB",
    title: "A-017",
    speaker: "진서우",
    text:
      "목요일 오후, 판교 KD데이터랩 데이터센터. 이민서가 당신을 '계열사(같은 그룹에 속한 다른 회사) 위험관리부 점검 방문'으로 등록해 들여보냅니다. 그의 사수 진서우가 탕비실 과자를 한 아름 안고 나옵니다. '위험관리부에서 오신다길래 긴장해서요. 뇌물 아니고 환영입니다.' 그가 계약 현황판을 자랑스럽게 띄웁니다. 올해 팀 매출의 41%가 핏스코어 계약 하나입니다. '이름은 다 지웠어요. 기호만 남아서 누가 누군지 아무도 몰라요.' 부속 명세서에는 '망설임 시간(초)', '반대 의견 작성 이력' 같은 칸이 있고, 본인 동의는 사후 동의서(일이 끝난 뒤에 받는 동의서)로 대신한다고 적혀 있습니다. 이민서가 한 줄을 가리킵니다. 'A-017. 망설임 평균 4.2초. 이거 저예요. 입사 순서대로 번호를 붙였거든요.' 진서우의 손에서 과자 봉지가 멈춥니다.",
    memo: [
      "핏스코어 계약 -- KD데이터랩 올해 매출의 41%",
      "명세서 칸: 망설임 시간(초), 반대 의견 작성 이력",
      "본인 동의: 사후 동의서로 대신",
      "A-017 = 이민서 (입사 순서 번호)",
    ],
    triggers: ["injustice", "trust", "selfAwareness"],
    choices: [
      {
        id: "c30_datalab_help",
        label: "진서우에게 계약을 멈출 방법을 같이 찾자고 한다",
        effect: { trust: 11, humanCost: -4, legitimacy: 2, capital: -4, time: -5, fatigue: 6 },
        next: "c30_leaving",
        cognition: { reframing: 2 },
      },
      {
        id: "c30_datalab_request",
        label: "당사자로서 내 기록의 열람 청구서를 공식으로 낸다",
        effect: { legitimacy: 12, trust: 1, time: -6, humanCost: 3, fatigue: 4 },
        next: "c30_leaving",
        cognition: { inference: 2 },
      },
      {
        id: "c30_datalab_snap",
        label: "진서우가 자리를 비운 사이 부속 명세서를 찍어 둔다",
        effect: { capital: 6, time: 6, legitimacy: -6, trust: -2, humanCost: 3, fatigue: -2 },
        next: "c30_leaving",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c30_leaving",
      },
    ],
  },
  c30_leaving: {
    phase: "ONE STEPS OUT",
    title: "빠지겠습니다",
    speaker: "반재욱",
    text:
      "금요일 밤 11시, 목포 순회를 마친 반재욱이 곧장 올라와 헌책방 앞 골목에 차를 세웁니다. 조수석에 순회 서류와 반서아의 실내화 주머니가 있어서 당신은 뒷자리에 앉습니다. 그가 시동을 끄지 않은 채 말합니다. '순회 나가기 전에 감사팀이 비밀유지 서약서(업무에서 알게 된 것을 밖에 말하지 않겠다는 약속 문서)를 받았습니다. 어기면 가족 명의 계좌 조사에도 동의한다는 조항이 있습니다.' 그가 한참 앞유리만 봅니다. '서아가 내년에 중학교 갑니다. 이번엔 빠지겠습니다. 단체방에서도 나가겠습니다.' 수첩의 '트리거랩 7명' 쪽에서 그가 자기 이름에 천천히 줄을 긋습니다. '처음으로 제 이름을 제가 지웁니다.' 그리고 종이 한 장을 내밉니다. 이번 분기 감사 일정표입니다. KD데이터랩만 대상에서 빠져 있습니다.",
    memo: [
      "반재욱: 비밀유지 서약서 -- 가족 명의 계좌 조사 동의 조항",
      "반서아, 내년 중학교 입학",
      "수첩 '트리거랩 7명' -- 본인 이름에 줄",
      "이번 분기 감사 일정: KD데이터랩만 제외",
    ],
    triggers: ["affection", "helplessness", "fear"],
    choices: [
      {
        id: "c30_leaving_let",
        label: "반재욱의 이름을 모든 기록에서 빼고 단체방 자리만 남겨 둔다",
        effect: { trust: 12, humanCost: -5, legitimacy: -3, time: -3, fatigue: 5 },
        next: "c30_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c30_leaving_note",
        label: "빠지더라도 감사 제외 사실만은 공식 기록으로 남겨 달라고 한다",
        effect: { legitimacy: 11, trust: -3, time: -5, humanCost: 3, fatigue: 4 },
        next: "c30_final",
        cognition: { inference: 2 },
      },
      {
        id: "c30_leaving_ask",
        label: "감사팀 권한으로 딱 한 번만 조회해 달라고 부탁한다",
        effect: { capital: 5, time: 5, trust: -4, legitimacy: 3, humanCost: 4, fatigue: -2 },
        next: "c30_final",
        cognition: { risk: 2 },
      },
      {
        id: "free",
        label: "다른 방법을 제안한다",
        type: "free",
        next: "c30_final",
      },
    ],
  },
  c30_final: {
    phase: "FINAL DECISION",
    title: "각자의 자리",
    speaker: "한서윤",
    text:
      "일요일 밤, 헌책방 1층. 의자 여섯 개를 놓았지만 한 자리는 비어 있고 반재욱의 머그잔만 제자리에 있습니다. 한서윤이 책 포장지를 뒤집어 각자 걸 것을 적습니다. 도윤하, 강서지점 창구. 이민서, 정규직 5개월 차. 오진우, 브릿지은행 팀장 자리. 한서윤, '없음'. 당신, 윤상혁 바로 아래 위험관리부. 이민서가 달력을 넘깁니다. '사후 동의서가 다음 주 금요일에 63명한테 나가요. 다들 서명하면 팔린 게 처음부터 괜찮았던 일이 돼요.' 길은 셋입니다. 각자 자리에서 조용히 더 모으거나, 공익신고(회사의 불법을 공공기관에 알리는 것)로 정식 제보하거나, 동의서가 나가기 전에 핏스코어부터 찾아가는 것. 한서윤이 펜을 내려놓습니다. '어느 쪽이든 누군가의 자리는 없어져요. 어느 자리를 먼저 내놓을지 정해 주세요.'",
    memo: [
      "사후 동의서 발송: 다음 주 금요일, 63명",
      "걸린 자리: 창구, 정규직, 팀장, 없음, 위험관리부",
      "반재욱의 자리: 머그잔만 남음",
      "먼저 받은 대금 12억 -- 동의서보다 먼저",
    ],
    triggers: ["choice", "trust", "responsibility"],
    choices: [
      {
        id: "c30_final_quiet",
        label: "각자 자리에서 몰래 모으되 서로의 이름은 끝까지 지킨다",
        effect: { trust: 12, humanCost: -5, legitimacy: -4, capital: -4, time: -5, fatigue: 6 },
        next: "case30_result",
        cognition: { persistence: 2 },
      },
      {
        id: "c30_final_report",
        label: "63명의 이름을 모아 공익신고로 정식 제보한다",
        effect: { legitimacy: 13, trust: 7, capital: -8, time: -7, humanCost: 3, fatigue: 6 },
        next: "case30_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c30_final_visit",
        label: "동의서가 나가기 전에 핏스코어를 먼저 찾아간다",
        effect: { capital: 9, time: 5, legitimacy: 3, trust: -4, humanCost: 3, fatigue: -2 },
        next: "case30_result",
        cognition: { risk: 2, reframing: 1 },
      },
      {
        id: "free",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "free",
        next: "case30_result",
      },
    ],
  },
};

/**
 * Everything else case 30 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case30 = {
  id: "case30",
  nodes: case30Nodes,
  aftermath: {
    c30_aftershock: {
      phase: "AFTERMATH",
      title: "내일도 출근",
      speaker: "이민서",
      text: "일요일 밤 11시 50분, 헌책방 1층. 결정을 내린 뒤에도 아무도 먼저 일어나지 않습니다. 한서윤이 단체방 이름을 바꿉니다. '내일도 출근.' 3 대 3이던 투표는 그렇게 끝납니다. 오진우가 '실장님 직권 남용'이라고 항의하더니 제일 먼저 박수 이모티콘을 답니다. 그때 뒷문이 덜컹 열립니다. 목포로 내려갔다던 반재욱이 반서아의 실내화 주머니를 든 채 서 있습니다. '읽기만 하러 왔습니다.' 그가 비어 있던 의자에 앉아 자기 머그잔을 집습니다. 이민서가 웃다가 눈가를 훔칩니다. 자정 직전, 회사 메일이 울립니다. '내일 09시 금융감독원 정기검사(금융감독원이 금융회사의 장부와 업무를 정해진 주기로 들여다보는 점검) 착수. 위험관리부 대응 인력: 당신. -- 대표이사 윤상혁.'",
      memo: ["단체방 이름 확정: '내일도 출근'", "반재욱: 말없이 돌아와 자기 의자에", "금융감독원 정기검사 -- 내일 09시, KD캐피탈", "대응 인력 지정: 당신, 발신 윤상혁"],
      triggers: ["affection", "trust", "choice"],
      choices: [
        { id: "c30_after_warm", label: "새벽까지 여섯이 함께 계약서를 끝까지 읽고 헤어진다", effect: { trust: 12, humanCost: -4, time: -4, capital: -2, fatigue: -7 }, next: "case30_result", cognition: { reframing: 2 } },
        { id: "c30_after_record", label: "모은 자료를 제보 문서로 묶어 오늘 밤 금융감독원에 보낸다", effect: { legitimacy: 13, trust: 5, time: -5, capital: -3, fatigue: 5 }, next: "case30_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c30_after_rush", label: "모임이 끝나자마자 12층으로 돌아가 부서 공유 폴더를 뒤진다", effect: { capital: 8, legitimacy: 5, trust: -5, humanCost: 4, fatigue: 5 }, next: "case30_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c30_final", "c30_aftershock"],
  connectiveScenes: [
    ["c30_lunch", "c30_bookstore", "c30_datalab", "도시락 여섯 개", "한서윤", "재투표가 또 동점으로 끝나자 한서윤이 보자기를 풉니다. 도시락 여섯 개에 이름 스티커가 붙어 있습니다. 오진우 것에는 매운 제육과 '이긴 사람 반찬'이라는 쪽지, 이민서 것에는 파를 뺀 계란말이, 반재욱 것에는 반서아가 좋아한다던 유부초밥이 두 줄 더 들어 있습니다. '대기발령(맡은 일 없이 다음 자리를 기다리게 하는 인사 명령) 두 달째예요. 7층 대기실은 다섯 시 정각에 퇴근이라 요리가 늘었어요.' 모두 웃는데 그가 젓가락을 내려놓습니다. '엄마한테는 아직 실장이라고 했어요. 하루 종일 창밖만 보는 실장이요.' 그리고 계약서를 봅니다. '제보에 이름이 필요하면 제 이름을 쓰세요. 저는 이제 잃을 게 없어요.'", ["도시락 6개 -- 이름 스티커, 반찬은 사람마다 다름", "한서윤 대기발령 9주째 -- 가족에게는 알리지 않음", "한서윤의 제안: 제보자 칸에 자기 이름을"], ["한서윤 혼자 이름을 걸게 두지 않겠다고 말한다", "한서윤의 대기발령 사유부터 공식으로 따져 묻는다", "잃을 게 없다는 한서윤의 제안을 그대로 받는다"]],
    ["c30_price", "c30_datalab", "c30_leaving", "1인당 단가", "권도현", "목요일 저녁, 판교 KD데이터랩 1층 카페. 여의도에서 퇴근하자마자 온 권도현이 냅킨에 세로줄을 긋습니다. '18억 나누기 63명. 한 사람의 3년이 2,857만 원입니다. 망설임 1초당 단가도 나옵니다. 들으시겠습니까?' 아무도 대답하지 않자 그가 명세서의 기호 목록을 끝까지 내려 보다가 조금 조용해집니다. '저는 없네요. 트리거랩에 없었으니까요. 다행인데 이상하게 서운합니다. 제 망설임은 값이 없다는 뜻이니까요.' 이민서가 웃음을 터뜨립니다. 권도현이 마지막 칸을 짚습니다. '그런데 18억 중 12억은 벌써 들어왔습니다. 동의서는 아직 한 장도 안 나갔고요.'", ["18억 ÷ 63명 = 1인당 2,857만 원", "먼저 받은 대금 12억 -- 동의서 발송 0건", "권도현: 명세서에 자기 기호 없음"], ["63명 모두에게 자기 기록이 팔렸다는 사실부터 알린다", "대금 흐름을 계열사 거래 명세서와 맞춰 기록으로 남긴다", "권도현의 계산서를 들고 곧장 진서우의 팀장에게 간다"]],
    ["c30_notice", "c30_leaving", "c30_final", "하반기 공채 안내", "오진우", "토요일 저녁, 헌책방 앞 포장마차. 오진우가 브릿지은행 인사팀 공지를 출력해 와 어묵 국물 옆에 놓습니다. '하반기 공채부터 핏스코어 조직 적합도 도입.' 그가 빈 잔을 손끝으로 돌립니다. '지난달 제 팀 인턴 선발에 시범으로 썼대요. 세 명 중 두 명이 떨어졌는데, 하나는 제가 면접에서 1등 준 친구예요. 끝까지 질문하던 친구였어요.' 그가 웃지도 않고 덧붙입니다. '아버지가 이기는 쪽에 서라고 했잖아요. 요즘은 점수가 누가 이기는 쪽인지 먼저 정해요.' 포장마차 사장님이 비어 있는 의자를 가리키며 한 분 더 오시냐고 묻습니다.", ["브릿지은행 하반기 공채: 핏스코어 도입", "시범 적용 인턴 3명 중 2명 탈락", "탈락자 1명: 오진우의 면접 1등"], ["떨어진 두 사람에게 이유를 알려 주자고 오진우와 약속한다", "브릿지은행 도입 공지를 증거 목록에 공식으로 올린다", "오진우에게 브릿지 쪽 계약서를 오늘 밤 안에 가져와 달라고 한다"]],
  ],
  connectiveOrder: [["c30_bookstore", "c30_lunch"], ["c30_datalab", "c30_price"], ["c30_leaving", "c30_notice"]],
  choiceEffects: {
    c30_bookstore: [
      { trust: 10, humanCost: -4, capital: -2, time: -4, fatigue: 5 },
      { legitimacy: 9, trust: 2, time: -5, humanCost: 2, fatigue: 3 },
      { time: 5, capital: 4, trust: -3, humanCost: 4, fatigue: -3 },
    ],
    c30_datalab: [
      { trust: 10, humanCost: -5, capital: -3, time: -5, fatigue: 5 },
      { legitimacy: 9, trust: 3, capital: -2, time: -5, humanCost: 1, fatigue: 3 },
      { time: 4, capital: 5, trust: 2, legitimacy: -4, humanCost: 3, fatigue: -3 },
    ],
    c30_leaving: [
      { trust: 9, humanCost: -4, legitimacy: 2, time: -4, fatigue: 4 },
      { legitimacy: 10, trust: 2, humanCost: 3, time: -5, fatigue: 3 },
      { time: 5, capital: 4, trust: 2, humanCost: 3, legitimacy: -2, fatigue: -2 },
    ],
  },
  choiceCopy: {
    c30_bookstore: {
      voice: ["한서윤 혼자, 이름을 걸게 두지 않겠다고 말한다.", "한서윤의 대기발령 사유부터, 공식으로 따져 묻는다.", "잃을 게 없다는, 한서윤의 제안을 그대로 받는다."],
      echo: ["혼자 두지 않겠다고 하면 한서윤이 도시락 뚜껑을 닫았다가 다시 엽니다. '그럼 반찬을 더 싸 와야겠네요.'", "사유를 물으면 인사부가 답합니다. '조직 개편에 따른 일시 대기.' 그 일시가 언제 끝나는지는 적혀 있지 않습니다.", "제안을 받으면 일은 빨라집니다. 한서윤의 이름이 제보서 맨 위에 올라가고, 그의 어머니는 그 이름을 뉴스에서 먼저 보게 될 수 있습니다."],
    },
    c30_datalab: {
      voice: ["63명 모두에게, 자기 기록이 팔렸다는 사실부터 알린다.", "대금 흐름을, 계열사 거래 명세서와 맞춰 기록으로 남긴다.", "권도현의 계산서를 들고, 곧장 진서우의 팀장에게 간다."],
      echo: ["알리면 63명 중 마흔한 명이 그날 밤 답장합니다. 나머지 스물두 명은 아직 자기 번호가 뭔지도 모릅니다.", "기록으로 맞추면 12억이 들어온 날짜가 찍힙니다. 동의서 양식이 만들어진 날보다 열흘 빠릅니다.", "팀장은 계산서를 끝까지 봅니다. 그리고 '단가는 시장가'라고만 말하고 회의실 문을 닫습니다."],
    },
    c30_leaving: {
      voice: ["떨어진 두 사람에게, 이유를 알려 주자고 오진우와 약속한다.", "브릿지은행 도입 공지를, 증거 목록에 공식으로 올린다.", "오진우에게, 브릿지 쪽 계약서를 오늘 밤 안에 가져와 달라고 한다."],
      echo: ["약속하면 오진우가 두 사람의 이력서를 다시 출력합니다. 1등 준 친구의 이름 옆에 그가 작게 '다시'라고 적습니다.", "목록에 오르면 브릿지은행도 이 사슬의 한 칸이 됩니다. 오진우의 팀장 자리도 함께 그 칸에 들어갑니다.", "오진우는 새벽 두 시에 계약서 사진을 보냅니다. 그의 출입 기록에도 새벽 두 시가 찍힙니다."],
    },
  },
  reactionScenes: [
    ["c30_lunch_reaction", "c30_lunch", "c30_datalab", "뒷문 열쇠", "임경수", "도시락이 비어 갈 무렵 안쪽 책장 사이에서 지팡이 소리가 납니다. 임경수가 계약서를 한참 내려다보다가 안경을 벗어 닦습니다. '종이는 태우면 없어지지. 이건 태워도 안 없어져. 몇 벌이 복사됐는지 아무도 모르니까.' 그가 주머니에서 열쇠 하나를 꺼내 탁자에 놓습니다. 가게 뒷문 열쇠입니다. '셔터 내린 뒤에 써. 대신 여기 둔 종이는 나한테도 말하지 마. 나는 늙어서 누가 물어보면 다 대답하거든.' 문간에서는 임소율이 뒷문에 붙일 작은 간판을 벌써 그리고 있습니다.", ["열쇠를 받아 헌책방 1층을 여섯 명의 아지트로 삼는다", "헌책방에는 자료 원본 대신 목록만 두자고 한다", "열쇠는 사양하고 모이는 곳을 매번 바꾸자고 한다"]],
    ["c30_price_reaction", "c30_price", "c30_leaving", "마이너스 0.31", "류세아", "밤 아홉 시, 노아 운영실. 노아 도입을 맡았던 류세아가 불을 켜지 않은 채 화면 하나를 띄웁니다. '핏스코어 모델의 입력 칸이 노아의 학습 데이터(인공지능이 배우는 데 쓰는 자료) 목록과 똑같아요. 같은 기록을 두 번 판 거예요.' 그가 한 칸을 키웁니다. '반대 의견 작성 이력'의 가중치(점수에 얼마나 크게 반영할지 정한 값)가 마이너스 0.31입니다. '노아는 적어도 설명 가능성(판단 이유를 사람이 알아들을 수 있게 보여 주는 능력)을 붙이려고 했어요. 여긴 점수만 나가요. 반대 의견을 한 번 쓴 사람은 이유도 모른 채 깎여요.' 그가 당신을 봅니다. '당신이 제일 많이 깎였을 거예요.'", ["류세아에게 이름은 빼고 기술 설명만 부탁한다", "가중치 목록을 류세아의 공식 검토 의견으로 받아 둔다", "류세아에게 모델 파일을 통째로 복사해 달라고 한다"]],
    ["c30_notice_reaction", "c30_notice", "c30_final", "창구에 걸 것", "도윤하", "토요일 밤, 포장마차를 나온 도윤하가 불 꺼진 강서지점 앞까지 걷자고 합니다. 가로등 아래에서 그가 수첩 두 권을 꺼냅니다. 1,740명의 이름을 적었던 모서리 닳은 수첩과, 어제 새로 산 얇은 수첩입니다. 새 수첩 첫 장에는 A-001부터 A-063까지 번호만 적혀 있습니다. '이름을 모르니까 번호라도요. 번호 옆에 이름을 하나씩 채우는 게 제 일 같아요.' 그가 유리문 너머 자기 창구를 가리킵니다. '3년 전 저 자리에서 저는 걸 게 있는 줄도 몰랐어요. 이번엔 알아요. 저 창구요.' 그가 웃습니다. '걸어도 돼요. 대신 혼자 걸게 하지는 마세요.'", ["도윤하가 창구를 건다면 옆에서 같이 걸겠다고 한다", "도윤하의 몫은 창구 밖 공식 경로로 돌리자고 한다", "지점 전산으로 계약 대금 입금 기록부터 조회해 달라고 한다"]],
  ],
  reactionEffects: {
    c30_lunch: [
      { trust: 9, humanCost: -3, legitimacy: -2, time: -3, fatigue: 3 },
      { legitimacy: 7, trust: 3, time: -4, capital: -1, fatigue: 3 },
      { time: 3, capital: 3, trust: 2, legitimacy: 2, humanCost: 1, fatigue: -3 },
    ],
    c30_price: [
      { trust: 9, humanCost: -4, time: -3, capital: -1, fatigue: 3 },
      { legitimacy: 8, trust: 2, capital: -3, time: -4, fatigue: 3 },
      { time: 5, capital: 4, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
    c30_notice: [
      { trust: 10, humanCost: -3, capital: -2, time: -3, fatigue: 4 },
      { legitimacy: 7, trust: 3, humanCost: -2, time: -4, fatigue: 3 },
      { time: 4, capital: 3, trust: -2, legitimacy: -2, humanCost: 3, fatigue: -2 },
    ],
  },
  reactionCopy: {
    c30_lunch: {
      voice: ["열쇠를 받아, 헌책방 1층을 여섯 명의 아지트로 삼는다.", "헌책방에는 자료 원본 대신, 목록만 두자고 한다.", "열쇠는 사양하고, 모이는 곳을 매번 바꾸자고 한다."],
      echo: ["열쇠를 받으면 임소율의 간판이 뒷문에 붙습니다. '셔터 내린 뒤 -- 여섯 명만 출입.' 임경수는 글씨가 너무 크다고 투덜댑니다.", "목록만 두면 임경수는 아무것도 모르는 사람으로 남습니다. 목록 맨 아래에 그가 연필로 '계약서 사본: 나도 모름'이라고 적습니다.", "매번 바꾸면 들키기는 어렵습니다. 대신 한서윤은 다음 도시락을 어디로 싸 가야 하는지 매주 묻게 됩니다."],
    },
    c30_price: {
      voice: ["류세아에게, 이름은 빼고 기술 설명만 부탁한다.", "가중치 목록을, 류세아의 공식 검토 의견으로 받아 둔다.", "류세아에게, 모델 파일을 통째로 복사해 달라고 한다."],
      echo: ["이름을 빼면 류세아는 설명을 세 쪽으로 써 줍니다. 마지막 줄은 '누가 물어도 제가 쓴 건 아닙니다'입니다.", "공식 의견이 되면 류세아의 이름이 문서 맨 아래에 남습니다. 그는 서명하기 전에 한 번 크게 숨을 쉽니다.", "복사는 4분이면 끝납니다. 노아 운영실 출입 기록에는 류세아의 사번이 4분 동안 켜져 있습니다."],
    },
    c30_notice: {
      voice: ["도윤하가 창구를 건다면, 옆에서 같이 걸겠다고 한다.", "도윤하의 몫은, 창구 밖 공식 경로로 돌리자고 한다.", "지점 전산으로, 계약 대금 입금 기록부터 조회해 달라고 한다."],
      echo: ["같이 걸겠다고 하면 도윤하가 새 수첩 첫 장 맨 위에 당신 이름을 먼저 적습니다. 'A-000. 번호 없는 사람.'", "공식 경로로 돌리면 창구는 지켜집니다. 도윤하는 조금 서운한 얼굴로, 그래도 고개를 끄덕입니다.", "조회는 3분이면 끝납니다. 창구 단말의 조회 기록에 도윤하의 사번이 남습니다."],
    },
  },
  reactionMemos: {
    c30_lunch_reaction: ["헌책방 뒷문 열쇠 1개", "임경수의 조건: 여기 둔 종이는 나한테도 말하지 말 것"],
    c30_price_reaction: ["'반대 의견 작성 이력' 가중치 -0.31", "핏스코어 입력 칸 = 노아 학습 목록"],
    c30_notice_reaction: ["도윤하의 새 수첩: A-001 ~ A-063", "도윤하가 걸겠다는 것: 강서지점 창구"],
  },
  branchPlan: ["c30_datalab", 2, "c30_branch_fitscore", "c30_branch_fitscore_follow"],
  branchScenes: {
    // CASE 30's detour is the buyer's own showroom. The data lab shows the
    // records leaving; the side door is the stage where they come back as a
    // sales example, and the lobby where the first score lands on a stranger.
    c30_branch_fitscore: {
      phase: "SIDE DOOR",
      title: "사례 1번",
      speaker: "강태민",
      text: "찍어 둔 명세서 맨 끝에 핏스코어의 주소와 이번 주 '기업 고객 설명회' 일정이 있습니다. 금요일 오전, 성수동 핏스코어 설명회장. 당신은 방명록에 '브릿지은행 채용 담당'이라고 적고, 강태민은 '동행 1인'으로 들어옵니다. 직원이 의자 정리를 좀 도와 달라고 하자 강태민이 혼자 180개를 다 펴 버려 직원이 두 번 고개를 숙입니다. 무대 화면에 영업 이사의 발표 자료가 뜹니다. '사례 1: A-017 유형 -- 망설이는 원칙주의자. 채용 비권장.' 객석의 인사 담당자들이 고개를 끄덕이며 받아 적습니다. 강태민이 장갑을 벗어 조끼 주머니에 꽂습니다. '저거, 민서 씨죠.'",
      memo: ["핏스코어 기업 고객 설명회 -- 참석 기업 38곳", "발표 사례 1번: A-017 '채용 비권장'", "당신의 명찰: 브릿지은행 채용 담당(가짜)", "강태민이 편 의자 180개"],
      triggers: ["injustice", "protection", "manipulation"],
      choices: [
        { id: "c30_branch_fitscore_a", label: "질의 시간에 A-017은 실제 사람이라고 그 자리에서 말한다", effect: { trust: 11, legitimacy: 3, humanCost: -3, capital: -5, time: -5, fatigue: 5 }, next: "c30_branch_fitscore_follow", cognition: { persistence: 2 } },
        { id: "c30_branch_fitscore_b", label: "설명회 자료집을 공식 증거로 남기려고 정식 요청한다", effect: { legitimacy: 10, trust: 2, time: -6, humanCost: 3, fatigue: 4 }, next: "c30_branch_fitscore_follow", cognition: { inference: 2 } },
        { id: "c30_branch_fitscore_c", label: "정체를 숨긴 채 무료 체험 계정까지 받아 온다", effect: { capital: 7, time: 4, trust: -2, humanCost: 2, fatigue: -3 }, next: "c30_branch_fitscore_follow", cognition: { risk: 1 } },
      ],
    },
    c30_branch_fitscore_follow: {
      phase: "SIDE DOOR",
      title: "38점",
      speaker: "하도율",
      text: "설명회장을 나서는 로비에서 정장 차림의 청년이 결과지를 접었다 폈다 합니다. 하도율, 스물여섯. KD금융그룹 공채 최종 면접까지 갔다가 어제 이 종이를 받았습니다. '조직 적합도 38점. 판단 지연 성향 -- 협업 위험.' 그가 당신 명찰을 보고 브릿지은행 사람인 줄 알고 묻습니다. '지연이 나쁜 건가요? 저는 확인하느라 늦는 건데요. 면접에서는 그게 장점이라고 하셨거든요.' 그가 웃으려다 맙니다. '엄마가 이번엔 붙을 거라고 떡을 맞춰 놨어요. 그거 찾으러 가야 해요.' 로비 벽에는 핏스코어의 표어가 걸려 있습니다. '맞는 사람을, 더 빨리.'",
      memo: ["하도율: KD금융그룹 공채 최종 면접 탈락", "결과지: 조직 적합도 38점 -- '판단 지연 성향'", "면접관 평가표에는 '꼼꼼함' 최고점", "로비 표어: '맞는 사람을, 더 빨리'"],
      triggers: ["injustice", "affection", "helplessness"],
      choices: [
        { id: "c30_branch_fitscore_follow_a", label: "하도율의 연락처를 받아 같은 일을 겪은 사람들을 함께 찾는다", effect: { trust: 12, humanCost: -4, capital: -4, time: -6, fatigue: 5 }, next: "c30_price", cognition: { reframing: 2 } },
        { id: "c30_branch_fitscore_follow_b", label: "하도율에게 탈락 사유를 설명받을 권리부터 알려 준다", effect: { legitimacy: 11, trust: 4, time: -6, humanCost: 2, fatigue: 4 }, next: "c30_price", cognition: { inference: 2 } },
        { id: "c30_branch_fitscore_follow_c", label: "지금은 증거가 먼저라며 결과지 사진만 받아 온다", effect: { time: 5, capital: 5, trust: 2, legitimacy: -3, humanCost: 3, fatigue: -2 }, next: "c30_price", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c30_start",
    result: "c30_aftershock",
    defaultFree: "c30_route_system",
    // Six seats, one table. Like the cases before it the chapter is a single
    // line; the split is whose seat goes on the table first.
    choices: {},
    system: {
      route: "c30_route_system",
      final: "c30_final_system_route",
      title: "가명의 가격",
      speaker: "노아",
      text: "준비된 보기 밖의 문장을 쓰자 KD캐피탈 단말의 심사 엔진(대출을 자동으로 판단하는 프로그램) 노아가 그룹 계열사(같은 그룹에 속한 다른 회사)들이 지난 5년 맺은 데이터 제공 계약 38건을 엽니다. 34건에 가명 처리(누구인지 바로 알 수 없게 이름 대신 기호를 붙이는 것) 조항이 있습니다. 정보 주체(그 기록이 가리키는 사람 본인)에게 판매 사실이 알려진 건 2건이고, 두 건 모두 유출 사고가 난 뒤였습니다. '가명은 보호가 아니라 가격 조건으로 학습되어 있습니다. 가명 처리된 기록은 그렇지 않은 기록보다 1.8배 비싸게 팔렸습니다.'",
      memo: ["계열사 데이터 제공 계약 38건 중 가명 처리 조항 34건", "본인에게 알려진 판매 2건 -- 모두 유출 사고 뒤", "가명 처리 기록의 단가: 1.8배"],
      routeChoices: [
        ["c30_route_system_publish", "38건의 통계를 계약서와 함께 여섯 명 모두에게 공개한다", { legitimacy: 10, trust: 6, capital: -6, time: -7, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c30_route_system_notify", "알려진 두 건의 당사자를 찾아 판매 사실을 직접 알린다", { trust: 11, legitimacy: 3, humanCost: -4, capital: -3, time: -7, fatigue: 6 }, { reframing: 2 }],
        ["c30_route_system_drop", "통계는 덮고 핏스코어 계약 하나에만 집중한다", { time: 7, capital: 7, trust: -6, legitimacy: -7, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "기록을 팔 때마다 당사자에게 먼저 알리는 규칙을 제안한다", { legitimacy: 12, trust: 8, capital: -8, humanCost: -4, fatigue: 7 }, { reframing: 3 }],
      ["b", "판매는 두고 63명에게 대금 일부를 나눠 주게 한다", { capital: 8, time: 6, trust: -5, legitimacy: -6, humanCost: 5, fatigue: -4 }, { risk: 2 }],
      ["c", "팔려 나간 기록의 삭제 요청을 63명 대신 모은다", { legitimacy: 8, trust: 10, capital: -5, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c30_evidence_turn",
    result: "c30_aftershock",
    sourceRoutes: ["c30_bookstore", "c30_datalab", "c30_leaving", "c30_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 계약서 옆에 놓고, 핏스코어에 누가 돈을 넣었는지 맞춰 본다.",
    entryEcho: "단서를 대면 사는 쪽과 파는 쪽이 같은 주머니에서 나온 돈으로 이어집니다. 그리고 그 사이에 검토 의견 한 줄이 있습니다.",
    title: "이상 없음",
    speaker: "한서윤",
    text: "단서를 맞추자 핏스코어의 주주 명단이 열립니다. 3월 투자 때 지분(회사를 나눠 가진 몫) 14%를 산 곳은 KD캐피탈 신기술투자조합(새 기술 회사에 돈을 넣으려고 만든 투자 모임)입니다. 투자 승인일은 윤상혁이 KD캐피탈 대표로 온 지 9일째, 데이터 계약은 그로부터 23일 뒤입니다. 승인 문서의 검토 의견 칸에는 한 줄이 적혀 있습니다. '위험관리부 검토: 이상 없음.' 한서윤이 부서 코드를 짚습니다. '그룹이 돈을 넣은 회사에 그룹 직원의 기록을 판 거예요. 그리고 이상 없다고 쓴 칸은, 지금 당신이 앉은 책상의 전임자예요.'",
    memo: ["핏스코어 지분 14% -- KD캐피탈 신기술투자조합", "투자 승인: 윤상혁 부임 9일째, 데이터 계약은 23일 뒤", "위험관리부 검토 의견 '이상 없음' -- 당신 책상의 전임자"],
    triggers: ["injustice", "system", "selfAwareness"],
    entryEffect: { legitimacy: 4, trust: 5, time: -3, fatigue: 5 },
    choices: [
      ["c30_evidence_turn_bundle", "투자 승인 기록을 계약서와 한 묶음으로 공식 제출한다", { legitimacy: 12, trust: 6, capital: -7, time: -7, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c30_evidence_turn_hold", "승인 기록은 쥐고 있다가 가장 아플 때 꺼낸다", { capital: 8, time: 6, trust: -5, legitimacy: -5, humanCost: 5, fatigue: -3 }, { risk: 2 }],
      ["c30_evidence_turn_share", "63명에게 누가 돈을 넣고 누가 팔았는지부터 알린다", { trust: 12, legitimacy: 5, capital: -6, humanCost: -7, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c30_branch_fitscore",
    systemNext: "c30_route_system",
    evidenceNext: "c30_evidence_turn",
    routeLabel: "직전 사건의 싱가포르 동선표로 핏스코어 설명회 일정을 맞춘다",
    systemLabel: "직전 자유응답 문장이 데이터 계약서 용도 칸에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 핏스코어의 주주 명단을 연다",
  },
  openingRoutes: {
    c29_after_warm: "c30_start_warm",
    c29_after_record: "c30_start_record",
    c29_after_rush: "c30_start_rush",
  },
  openingCopy: {
    c30_start_warm: ["제일 먼저 온 사람의 계약서", "이민서", "입국장 편의점 전자레인지 앞에서 마중 나온 사람들과 컵라면을 나눠 먹은 다음 날 아침, 당신은 약속대로 제일 먼저 판교로 갑니다. 트리거랩이 해체되고 각자 발령(근무지를 옮기라는 인사 명령)을 받아 흩어진 뒤 이민서의 새 회사에 오는 건 처음입니다. KD데이터랩 1층 로비에서 이민서가 사원증을 뒤집어 쥔 채 휴대폰을 내밉니다. '데이터 제공 계약서 -- KD데이터랩 ↔ 핏스코어.' 채용 회사에 지원자 점수를 파는 곳이고, 제공 대상은 트리거랩 참가자 반응 기록 3년 치입니다. 그가 작게 웃습니다. '진짜 제일 먼저 오셨네요. 아직 컵라면 냄새 나요.'", ["어젯밤 약속: '내일 아침 제일 먼저 갈게요'", "계약서: KD데이터랩 → 핏스코어, 참가자 63명 반응 기록", "이민서: 사원증을 뒤집어 쥐고 로비에서 대기"]],
    c30_start_record: ["폴더를 낸 사람의 계약서", "이민서", "부속서(계약서 뒤에 붙는 추가 약속 문서) C와 해온파트너스의 송금 흔적을 한 폴더로 묶어 감사위원회에 낸 다음 날 아침, 당신은 KD캐피탈 12층 자리에서 접수 확인 메일을 기다립니다. 그사이 여섯 명의 단체방에 이민서의 사진이 올라옵니다. 'KD데이터랩 ↔ 핏스코어 데이터 제공 계약서.' 채용 회사에 지원자 점수를 파는 곳이고, 제공 대상은 트리거랩 참가자 반응 기록 3년 치입니다. 서명 날짜는 라운드힐 부속서 C와 같은 주입니다. 흩어진 곳은 여섯 군데인데 서류는 자꾸 같은 주에 모입니다. 감사위원회의 접수 메일은 점심이 지나도 오지 않습니다.", ["감사위원회 제출 폴더 -- 접수 확인 메일 아직 없음", "계약서: KD데이터랩 → 핏스코어, 참가자 63명 반응 기록", "두 서류의 서명 주: 5월 둘째 주"]],
    c30_start_rush: ["곧장 달려온 사람의 계약서", "강태민", "캐리어를 끈 채 공항 철도를 타고 곧장 이민서에게 갔습니다. 강태민이 접은 팻말을 들고 말없이 따라왔습니다. 밤 11시 반, 이민서의 옥탑방 평상. 트리거랩이 해체되고 각자 발령(근무지를 옮기라는 인사 명령)을 받아 흩어진 뒤 여기 온 건 처음입니다. 이민서가 노트북을 돌립니다. '데이터 제공 계약서 -- KD데이터랩 ↔ 핏스코어.' 채용 회사에 지원자 점수를 파는 곳이고, 제공 대상은 트리거랩 참가자 반응 기록 3년 치입니다. '제가 괜히 판을 키우는 거예요?' 강태민이 '컵라면 있음' 팻말을 평상에 세워 둡니다. '판은 원래 컸어요. 민서 씨가 불을 켠 거지.'", ["공항 철도 직행 -- 강태민 동행, 팻말 '컵라면 있음'", "계약서: KD데이터랩 → 핏스코어, 참가자 63명 반응 기록", "이민서: '제가 괜히 판을 키우는 거예요?'"]],
  },
  openingSignatures: {
    c30_start_warm: {
      label: "로비에서 바로 여섯 명에게 오늘 저녁 모이자고 연락한다",
      effect: { trust: 10, humanCost: -4, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "로비에서 바로, 여섯 명에게 오늘 저녁 모이자고 연락한다.",
      echo: "연락하면 오진우가 제일 먼저 답합니다. '매운 것만 빼고 아무 데나.' 반재욱은 목포에서 순회 서류 사진과 함께 '늦게라도 갑니다'라고 답합니다.",
    },
    c30_start_record: {
      label: "감사위원회 폴더에 데이터 계약서를 두 번째 묶음으로 덧붙인다",
      effect: { legitimacy: 11, trust: -2, capital: -4, time: -5, fatigue: 3 },
      cognition: { inference: 2 },
      voice: "감사위원회 폴더에, 데이터 계약서를 두 번째 묶음으로 덧붙인다.",
      echo: "덧붙이면 두 서류의 날짜가 서로를 설명합니다. 접수 확인은 이틀 뒤, 두 묶음 다 받았다는 한 줄로 옵니다.",
    },
    c30_start_rush: {
      label: "오늘 밤은 이민서 곁에 남아 계약서를 한 쪽씩 같이 읽는다",
      effect: { trust: 11, legitimacy: 3, time: -6, capital: -2, fatigue: 6 },
      cognition: { persistence: 2 },
      voice: "오늘 밤은 이민서 곁에 남아, 계약서를 한 쪽씩 같이 읽는다.",
      echo: "곁에 남으면 이민서가 새벽 두 시에 처음으로 잠깐 잡니다. 강태민은 평상 끝에서 팻말을 베개 삼아 눕습니다.",
    },
  },
  voiceLines: {
    // CASE 30. Six people at one table. Every line is said to someone who is
    // about to put a seat on it, so none of them is allowed to sound like an order.
    c30_start_gather: "오늘 저녁, 여섯 명이 얼굴을 보고 정하자고 한다.",
    c30_start_verify: "계약서가 진짜인지, 원본 경로부터 확인한다.",
    c30_start_forward: "이민서에게, 나머지 쪽도 지금 전부 보내 달라고 한다.",
    c30_bookstore_share: "이민서 혼자 걸지 않게, 여섯이 똑같이 나눠 든다.",
    c30_bookstore_list: "누가 무엇을 가졌는지 목록부터 만들고, 원본은 한 곳에 둔다.",
    c30_bookstore_front: "잃을 것이 가장 적은 사람부터, 앞에 세우자고 한다.",
    c30_datalab_help: "진서우에게, 계약을 멈출 방법을 같이 찾자고 한다.",
    c30_datalab_request: "당사자로서, 내 기록의 열람 청구서를 공식으로 낸다.",
    c30_datalab_snap: "진서우가 자리를 비운 사이, 부속 명세서를 찍어 둔다.",
    c30_branch_fitscore_a: "질의 시간에, A-017은 실제 사람이라고 그 자리에서 말한다.",
    c30_branch_fitscore_b: "설명회 자료집을, 공식 증거로 남기려고 정식 요청한다.",
    c30_branch_fitscore_c: "정체를 숨긴 채, 무료 체험 계정까지 받아 온다.",
    c30_branch_fitscore_follow_a: "하도율의 연락처를 받아, 같은 일을 겪은 사람들을 함께 찾는다.",
    c30_branch_fitscore_follow_b: "하도율에게, 탈락 사유를 설명받을 권리부터 알려 준다.",
    c30_branch_fitscore_follow_c: "지금은 증거가 먼저라며, 결과지 사진만 받아 온다.",
    c30_leaving_let: "반재욱의 이름을 모든 기록에서 빼고, 단체방 자리만 남겨 둔다.",
    c30_leaving_note: "빠지더라도, 감사 제외 사실만은 공식 기록으로 남겨 달라고 한다.",
    c30_leaving_ask: "감사팀 권한으로, 딱 한 번만 조회해 달라고 부탁한다.",
    c30_final_quiet: "각자 자리에서 몰래 모으되, 서로의 이름은 끝까지 지킨다.",
    c30_final_report: "63명의 이름을 모아, 공익신고로 정식 제보한다.",
    c30_final_visit: "동의서가 나가기 전에, 핏스코어를 먼저 찾아간다.",
    c30_after_warm: "새벽까지 여섯이 함께, 계약서를 끝까지 읽고 헤어진다.",
    c30_after_record: "모은 자료를 제보 문서로 묶어, 오늘 밤 금융감독원에 보낸다.",
    c30_after_rush: "모임이 끝나자마자, 12층으로 돌아가 부서 공유 폴더를 뒤진다.",
    c30_route_system_publish: "38건의 통계를 계약서와 함께, 여섯 명 모두에게 공개한다.",
    c30_route_system_notify: "알려진 두 건의 당사자를 찾아, 판매 사실을 직접 알린다.",
    c30_route_system_drop: "통계는 덮고, 핏스코어 계약 하나에만 집중한다.",
    c30_final_system_route_a: "기록을 팔 때마다, 당사자에게 먼저 알리는 규칙을 제안한다.",
    c30_final_system_route_b: "판매는 두고, 63명에게 대금 일부를 나눠 주게 한다.",
    c30_final_system_route_c: "팔려 나간 기록의 삭제 요청을, 63명 대신 모은다.",
    c30_evidence_turn_bundle: "투자 승인 기록을, 계약서와 한 묶음으로 공식 제출한다.",
    c30_evidence_turn_hold: "승인 기록은 쥐고 있다가, 가장 아플 때 꺼낸다.",
    c30_evidence_turn_share: "63명에게, 누가 돈을 넣고 누가 팔았는지부터 알린다.",
  },
  echoReplies: {
    // CASE 30.
    c30_start_gather: "얼굴을 보자고 하면 다섯 명이 1분 안에 답합니다. 반재욱의 답만 두 시간 뒤에 옵니다. '막차 타고 올라가겠습니다.'",
    c30_start_verify: "원본 경로를 따라가면 계약서가 진짜라는 게 확인됩니다. 확인하는 동안 당신의 조회 기록도 KD데이터랩 서버에 남습니다.",
    c30_start_forward: "나머지 쪽은 10분 만에 옵니다. 이민서의 회사 계정에서 외부로 나간 첫 파일이 됩니다.",
    c30_bookstore_share: "똑같이 나눠 들면 이민서가 처음으로 계약서에서 손을 뗍니다. 무게는 줄지만 여섯 명 모두 같은 서류에 손자국을 남깁니다.",
    c30_bookstore_list: "목록을 만들면 누가 무엇을 쥐었는지 분명해집니다. 분명해진 목록은 잃어버리면 그대로 누군가의 증거가 됩니다.",
    c30_bookstore_front: "잃을 것이 적은 사람은 한서윤입니다. 그가 먼저 고개를 끄덕이고, 다른 다섯 명은 그 끄덕임을 오래 기억합니다.",
    c30_datalab_help: "같이 찾자고 하면 진서우가 과자 봉지를 내려놓습니다. '저 이 계약으로 올해 승진 심사 올라가요.' 그래도 그는 자리를 뜨지 않습니다.",
    c30_datalab_request: "열람 청구서는 접수됩니다. 답변 기한은 30일, 사후 동의서 발송일보다 3주 넘게 늦습니다.",
    c30_datalab_snap: "사진은 선명하게 나옵니다. 진서우가 돌아와 빈 과자 봉지를 보고 웃습니다. 그는 아직 아무것도 모릅니다.",
    c30_branch_fitscore_a: "말하면 설명회장이 3초 동안 조용해집니다. 영업 이사가 '가상의 사례입니다'라고 답하고, 슬라이드를 넘깁니다.",
    c30_branch_fitscore_b: "자료집은 정식으로 옵니다. A-017 쪽만 빠진 채로요. 빠진 쪽 번호가 그대로 남아 있습니다.",
    c30_branch_fitscore_c: "체험 계정은 브릿지은행 이름으로 발급됩니다. 강태민이 에코백과 텀블러를 두 개씩 받아 옵니다.",
    c30_branch_fitscore_follow_a: "연락처를 받으면 하도율이 그날 밤 단체방 하나를 만듭니다. 첫날 열한 명이 들어옵니다.",
    c30_branch_fitscore_follow_b: "권리를 알면 하도율은 설명 요청서를 씁니다. 답장은 한 줄입니다. '평가 기준은 영업 비밀입니다.'",
    c30_branch_fitscore_follow_c: "사진은 증거가 됩니다. 하도율은 결과지를 네 번 접어 넣고, 떡을 찾으러 갑니다.",
    c30_leaving_let: "이름을 빼면 반재욱은 어디에도 없습니다. 단체방의 그의 자리에는 읽음 숫자만 하나 남습니다.",
    c30_leaving_note: "공식 기록을 부탁하면 반재욱이 한참 핸들만 잡고 있습니다. '제 이름으로는 못 합니다. 날짜만 적어 드리죠.'",
    c30_leaving_ask: "부탁하면 반재욱이 조회를 해 줍니다. 그리고 그 조회 기록이 서약서의 첫 번째 위반이 됩니다.",
    c30_final_quiet: "몰래 모으면 아무도 다치지 않은 채로 닷새가 갑니다. 금요일, 동의서 63통은 예정대로 발송됩니다.",
    c30_final_report: "공익신고서에 63명의 번호가 올라갑니다. 신고자 칸에 이름을 쓰는 순간, 쓴 사람의 자리는 그날부터 흔들립니다.",
    c30_final_visit: "먼저 찾아가면 핏스코어는 판매를 '검토'하겠다고 합니다. 그 검토 결과를 전하러 오는 사람은 그룹 법무팀입니다.",
    c30_after_warm: "새벽 두 시, 여섯 명이 계약서 마지막 쪽을 덮고 헤어집니다. 검사 대응 메일은 아무도 다시 열어 보지 않은 채 아침을 기다립니다.",
    c30_after_record: "제보 문서는 자정 넘어 금융감독원 제보 창구에 접수됩니다. 검사를 받는 회사의 직원이 검사 전날 밤에 보낸 제보라는 사실도 함께 접수됩니다.",
    c30_after_rush: "12층의 불은 당신 자리 하나만 켜집니다. 공유 폴더를 여는 순간마다 접속 기록에 당신 이름과 시각이 한 줄씩 쌓입니다.",
    c30_route_system_publish: "공개하면 여섯 명이 38건을 나눠 읽습니다. 이민서가 그중 한 건의 담당자 이름이 진서우라는 걸 찾아냅니다.",
    c30_route_system_notify: "찾아가면 두 건의 당사자들은 이미 잊고 살고 있었습니다. 한 명은 알려 줘서 고맙다고, 한 명은 왜 이제 왔냐고 합니다.",
    c30_route_system_drop: "덮으면 핏스코어 하나는 선명해집니다. 나머지 37건은 그대로 가격표를 달고 남습니다.",
    c30_final_system_route_a: "규칙이 생기면 다음 계약부터는 알림이 먼저 갑니다. 이미 팔린 63명의 기록은 규칙보다 먼저 떠났습니다.",
    c30_final_system_route_b: "대금이 나뉘면 한 사람 앞에 몇백만 원이 들어옵니다. 받은 사람은 그 돈으로 팔린 걸 인정한 셈이 됩니다.",
    c30_final_system_route_c: "삭제 요청이 모이면 63명이 처음으로 서로의 번호를 압니다. 복사본이 몇 벌인지는 여전히 아무도 모릅니다.",
    c30_evidence_turn_bundle: "한 묶음이 되면 사는 쪽과 파는 쪽이 한 문서에 섭니다. 그 문서를 받는 곳이 그룹 안이라면, 얼마나 오래 서 있을지는 모릅니다.",
    c30_evidence_turn_hold: "쥐고 있으면 가장 아픈 순간에 쓸 패가 됩니다. 그 사이 금요일이 지나고, 동의서 몇 장은 서명되어 돌아옵니다.",
    c30_evidence_turn_share: "알리면 63명 중 몇 명은 투자한 쪽이 자기 회사라는 걸 처음 압니다. 그중 한 명이 '그럼 나는 누구한테 따져요'라고 묻습니다.",
  },
  characterProfiles: {
    진서우: {
      role: "KD데이터랩 데이터사업팀 선임 · 이민서의 사수",
      stance: "선의 · 실적 · 흔들림",
      job: "계약서의 사람 얼굴. 기호만 남기면 아무도 다치지 않는다고 믿었던 사람이, A-017이 옆자리 후배라는 걸 알게 된다.",
      appearance: "사원증 줄에 매단 과자 봉지 집게, 늘 반쯤 열린 백팩, 모니터 옆에 붙인 팀 매출 그래프 포스트잇.",
      thought: "나쁜 일인 줄 알았으면 안 했다. 그런데 몰랐다는 말이 이제는 변명처럼 들린다.",
      gesture: "진서우는 곤란해지면 과자 봉지를 하나 더 뜯어 상대 앞에 밀어 놓는다.",
      voice: "밝고 빠르게 말하다가, 숫자가 사람 이름으로 바뀌는 순간 말끝이 흐려진다.",
      line: "이름은 다 지웠어요. 기호만 남았어요. ...그 기호가 민서 씨였어요?",
    },
    하도율: {
      role: "KD금융그룹 공채 최종 면접 탈락자 · 스물여섯",
      stance: "확인 · 억울함 · 다시",
      job: "점수가 처음으로 낯선 사람에게 떨어지는 장면. 꼼꼼해서 늦는 사람이 '판단 지연'이 된다.",
      appearance: "한 번 입고 세탁소에 맡기려던 면접 정장, 네 번 접힌 결과지, 어머니가 맞춘 떡 사진이 뜬 휴대폰.",
      thought: "틀린 적은 없는데 늦었다는 이유로 떨어졌다. 확인하는 게 잘못이면 무엇을 고쳐야 하나.",
      gesture: "하도율은 대답하기 전에 결과지의 접힌 선을 손톱으로 한 번 더 누른다.",
      voice: "예의 바르고 또박또박 말하다가, 엄마 얘기가 나오면 속도가 빨라진다.",
      line: "지연이 나쁜 건가요? 저는 확인하느라 늦는 건데요.",
    },
  },
  setting: { place: "KD캐피탈 12층 · 위험관리부", clock: "귀국 다음 날 수요일 · 07:12" },
  sceneContext: {
    c30_start: {
      place: "KD캐피탈 12층 · 위험관리부",
      clock: "귀국 다음 날 수요일 · 07:12",
      question: "흩어진 여섯 명의 기록이 한 계약서로 팔려 나갔습니다. 이 사진에 어떻게 답하겠습니까?",
      lead: "싱가포르에서 돌아와 처음 출근한 아침, 윤상혁의 대표실은 아직 불이 꺼져 있습니다.",
    },
    c30_start_warm: {
      place: "판교 KD데이터랩 · 1층 로비",
      clock: "귀국 다음 날 수요일 · 08시",
      question: "약속대로 제일 먼저 온 로비에서 계약서를 받았습니다. 누구부터 부르겠습니까?",
      lead: "입국장 편의점에서 '내일 아침 제일 먼저 갈게요'라고 보낸 답장을 지키러 판교행 첫 버스를 탔습니다.",
    },
    c30_start_record: {
      place: "KD캐피탈 12층 · 위험관리부",
      clock: "귀국 다음 날 수요일 · 13시",
      question: "감사위원회에 낸 부속서와 새 계약서가 같은 주에 서명됐습니다. 두 서류를 어떻게 다루겠습니까?",
      lead: "감사위원회 접수함에 폴더를 넣은 지 열두 시간, 메일함을 스무 번째 새로 고칩니다.",
    },
    c30_start_rush: {
      place: "이민서의 옥탑방 · 옥상 평상",
      clock: "귀국한 밤 · 23:30",
      question: "판을 괜히 키우는 거냐고 이민서가 묻습니다. 캐리어를 세워 둔 채 무엇부터 하겠습니까?",
      lead: "공항 철도에서 내려 캐리어 바퀴 소리를 끌고 옥탑 계단을 올라왔습니다. 강태민이 뒤에서 팻말을 들고 있습니다.",
    },
    c30_bookstore: {
      place: "회기동 헌책방 · 1층 책장 사이",
      clock: "수요일 · 20시",
      question: "꺼내는 순간 여섯 명 모두 자리를 걸어야 하는 계약서가 탁자에 펼쳐졌습니다. 누가 무엇을 들겠습니까?",
      lead: "셔터를 반쯤 내린 헌책방 안, 한 달 만에 여섯 개의 의자가 한 탁자에 붙었습니다.",
    },
    c30_lunch: {
      place: "회기동 헌책방 · 1층 책장 사이",
      clock: "수요일 · 21시",
      question: "잃을 게 없다는 사람이 제보서에 자기 이름을 쓰겠다고 합니다. 어떻게 답하겠습니까?",
    },
    c30_lunch_reaction: {
      place: "회기동 헌책방 · 1층 안쪽 책장",
      clock: "수요일 · 22시",
      question: "임경수가 뒷문 열쇠를 내밀며 아무것도 말하지 말라고 합니다. 이 열쇠를 어떻게 하겠습니까?",
    },
    c30_datalab: {
      place: "판교 KD데이터랩 · 데이터센터",
      clock: "목요일 · 15시",
      question: "가명 뒤의 A-017이 옆자리 동료였습니다. 이 방에서 무엇을 하겠습니까?",
      lead: "이민서가 방문증을 건네며 속삭입니다. '제 사수는 좋은 사람이에요. 그게 더 문제예요.'",
    },
    c30_branch_fitscore: {
      place: "성수동 핏스코어 · 기업 고객 설명회장",
      clock: "금요일 · 10시",
      question: "동료의 기호가 영업 발표의 '사례 1번'으로 떴습니다. 가짜 명찰을 단 채 어떻게 하겠습니까?",
    },
    c30_branch_fitscore_follow: {
      place: "성수동 핏스코어 · 1층 로비",
      clock: "금요일 · 11시 30분",
      question: "꼼꼼해서 늦는 청년이 '판단 지연 38점'을 받았습니다. 그 결과지를 어떻게 하겠습니까?",
    },
    c30_price: {
      place: "판교 KD데이터랩 · 1층 카페",
      clock: "목요일 · 19시",
      question: "한 사람의 3년이 2,857만 원으로 계산됐고, 동의서보다 돈이 먼저 들어왔습니다. 무엇부터 하겠습니까?",
    },
    c30_price_reaction: {
      place: "판교 KD데이터랩 · 노아 운영실",
      clock: "목요일 · 21시",
      question: "반대 의견을 쓴 이력이 점수를 깎는 칸이었습니다. 그 사실을 알려 준 사람을 어떻게 지키겠습니까?",
    },
    c30_leaving: {
      place: "회기동 헌책방 앞 골목 · 반재욱의 차 뒷자리",
      clock: "금요일 · 23시",
      question: "늘 이름을 적던 사람이 자기 이름을 지우고 빠지겠다고 합니다. 그를 어떻게 보내겠습니까?",
      lead: "시동이 켜진 차 안, 조수석의 실내화 주머니 때문에 당신은 뒷자리에 앉았습니다.",
    },
    c30_notice: {
      place: "회기동 헌책방 앞 · 포장마차",
      clock: "토요일 · 20시",
      question: "오진우가 1등을 준 지원자를 점수가 먼저 떨어뜨렸습니다. 그 공지를 어떻게 쓰겠습니까?",
    },
    c30_notice_reaction: {
      place: "KD은행 강서지점 앞 · 횡단보도",
      clock: "토요일 · 23시",
      question: "도윤하가 이번엔 불 꺼진 저 창구를 걸겠다고 합니다. 그 창구를 어떻게 하겠습니까?",
    },
    c30_route_system: {
      place: "KD캐피탈 12층 · 위험관리부 노아 단말",
      clock: "수요일 · 08시",
      question: "가명은 기록을 지키는 대신 값을 올려 왔습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c30_final_system_route: {
      place: "KD캐피탈 12층 · 위험관리부 노아 단말",
      clock: "동의서 발송 D-5 · 새벽",
      question: "기록을 팔 때의 규칙 하나를 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c30_evidence_turn: {
      place: "KD캐피탈 · 투자 승인 기록실",
      clock: "일요일 · 19시",
      question: "사는 쪽에 그룹 돈이 들어가 있고, 이상 없다고 쓴 칸은 당신 책상이었습니다. 이 기록을 어떻게 쓰겠습니까?",
    },
    c30_final: {
      place: "회기동 헌책방 · 1층 책장 사이",
      clock: "일요일 · 21시",
      question: "사후 동의서가 나가기까지 닷새, 누군가의 자리는 없어집니다. 어느 길로 가겠습니까?",
      lead: "뒷문 열쇠로 들어가니 한서윤이 도시락 다섯 개를 이미 펼쳐 두었습니다.",
    },
    c30_aftershock: {
      place: "회기동 헌책방 · 1층 책장 사이",
      clock: "일요일 · 23:50 · 검사 전날",
      question: "빈 의자가 다시 찬 밤, 내일 아침 정기검사의 대응 인력으로 당신이 지정됐습니다. 이 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c30-fitscore-stake",
    title: "이상 없음이라고 쓴 칸",
    text: "핏스코어 주식 14%는 KD캐피탈이 만든 투자 모임이 샀고, 데이터 계약은 그 투자 23일 뒤였습니다. 투자 검토 의견은 위험관리부의 '이상 없음' 한 줄이었습니다.",
  },
  outcomes: {
    c30_after_warm: { tag: "새벽까지 남은 결말", title: "돌아온 반재욱까지 여섯이 계약서 마지막 쪽을 함께 덮었다", text: "단체방 이름이 '내일도 출근'으로 정해진 밤, 아무도 먼저 가지 않았습니다. 빈 의자는 자정 직전에 다시 찼습니다." },
    c30_after_record: { tag: "제보를 낸 결말", title: "63명의 번호가 든 제보 문서가 검사 전날 밤 접수됐다", text: "계약서, 명세서, 투자 승인 기록이 한 문서가 되어 금융감독원으로 갔습니다. 검사는 일곱 시간 뒤에 시작됩니다." },
    c30_after_rush: { tag: "먼저 돌아간 결말", title: "모임이 끝나자마자 12층 부서 폴더를 새벽까지 열었다", text: "당신은 헌책방의 다섯 명을 두고 불 꺼진 12층으로 갔습니다. 새벽 네 시까지의 접속 기록이 당신 이름으로 남았습니다." },
  },
  carryovers: {
    c30_after_warm: { trust: 9, humanCost: -4, fatigue: -7 },
    c30_after_record: { legitimacy: 11, trust: 3, fatigue: 5 },
    c30_after_rush: { capital: 7, legitimacy: 4, trust: -7 },
  },
  continuityChallenges: {
    c29_after_warm: { id: "protect-trust", title: "제일 먼저 간다는 약속 지키기", text: "컵라면을 먹으며 이민서에게 제일 먼저 가겠다고 했습니다. 이민서 혼자 걸지 않게 여섯이 나눠 드는 선택을 찾아야 보너스가 열립니다." },
    c29_after_record: { id: "use-reframe", title: "같은 주에 모이는 서류들", text: "라운드힐 부속서 C와 데이터 계약서가 같은 주에 서명됐습니다. 두 서류를 한 판 위에 놓고 다시 읽어야 합니다." },
    c29_after_rush: { id: "repair-legitimacy", title: "캐리어째 달려간 밤의 공정함 회복하기", text: "캐리어를 끈 채 이민서에게 먼저 달려갔습니다. 이번에는 여섯이 같이 정했다는 것을 증명할 선택을 찾아야 합니다." },
  },
};
