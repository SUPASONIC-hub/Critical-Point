/**
 * CASE 49 -- the last day before the 33rd floor, and the bridge into the finale.
 *
 * Forty-eight cases chased one empty box. The evening the credit committee
 * signs by name, 윤상혁 writes one line -- "이제 빈 서명란 이야기를 하지" -- and
 * the next morning, the first working day after 추석, a second: come to the old
 * group strategy office on the 33rd floor tomorrow night, the chairman has given
 * him one night to clear it.
 * Nothing in the case is a fight over a file. It is one long day of people
 * handing the analyst something to carry up, and of the last three voices
 * that want a say in what the analyst will answer.
 *
 * Every recurring face gets a beat, because this is the last time the whole
 * cast is in one day. The laughter is a rice-cake shop turned into a send-off
 * desk (강태민's two cup noodles, 권도현's round-trip invoice that runs onto the
 * back page, 나준혁's thirty-year seal "because a name stamped twice cannot be
 * erased", 오진우's 12-12 scoreboard), a pile of parcels from 제주, 군산 and
 * Singapore, and a regulator and a prosecutor who end up laughing on one call.
 * The grief is two glass doors in a columbarium and 임경수's fountain pen, a
 * machine that says tonight is its last admissible calculation, and 선우진, who
 * did not make it to the end, asking the analyst to come back. The anger is the
 * folder itself: the lab's HR scoring appendix is still running on one B2
 * terminal the disposal list skipped, and a "successor administrator" form
 * waits there with the admin box blank -- marked with the designer's pencil dot
 * -- and the analyst's name in the recommendation line. 노아 scores the fit at
 * 97. The evidence turn finds whose hand drafted the form: not 윤상혁's, but the
 * chairman's office, on the night of the verdict. 서도경 calls once, at a
 * crosswalk under the full moon, with 윤상혁's daughter standing beside the
 * analyst holding her father's envelope: take what he hands you.
 *
 * The final is the question the season has carried since 사건 01, put to the
 * table by 한서윤: whose name goes in the box -- his alone, everyone who left it
 * empty, or the analyst's own, taking the pen he offers to change it from
 * inside. At midnight 문가을 finally finishes the word "고마워요", and 윤상혁,
 * true to form, pulls the meeting forward: come up now. The three aftermath
 * choices open the finale's three doors.
 */
export const case49Nodes = {
  c49_start: {
    phase: "CASE 49 BRIEFING",
    title: "빈 서명란 이야기를 하지",
    speaker: "한서윤",
    text:
      "심사위원회 다음 날, 연휴가 끝난 화요일 아침 9시. 회기동 헌책방 1층 테이블에 연휴 끝 송편이 아직 남아 있습니다. 어제 저녁 심사위원회 의사록(회의 내용을 적은 공식 기록)이 사내망에 오르자마자 '이제 빈 서명란 이야기를 하지.' 한 줄을 보낸 뒤 조용하던 번호에서 두 번째 문자가 옵니다. 윤상혁입니다. '내일 밤 아홉 시, 33층 옛 그룹전략실로 오게. 회장님이 방을 비울 하룻밤을 주셨네. 이야기는 거기서 하지.' 이민서가 문자를 소리 내어 두 번 읽고, 도윤하는 송편을 집다 내려놓습니다. 반재욱은 수첩 새 쪽에 발신 시각을 적습니다. 08시 59분, 정각 1분 전입니다. 한서윤이 휴대폰을 테이블 가운데에 엎어 놓습니다. '지난봄에도 이 말을 했어요. 그리고 안 왔죠.' 그가 창밖 은행나무를 잠깐 봅니다. '이번엔 올 거예요. 이제 저 사람한테 남은 방이 그거 하나니까요.'",
    memo: [
      "윤상혁 문자: 내일 21시, 33층 옛 그룹전략실",
      "어제 저녁 첫 문자: '이제 빈 서명란 이야기를 하지'",
      "회장 비서실: 방을 비우는 명목으로 하룻밤 출입 허가",
      "단체방 '내일도 출근' -- 5분 만에 새 메시지 41개",
    ],
    triggers: ["responsibility", "affection", "curiosity"],
    choices: [
      {
        id: "c49_start_share",
        label: "문자를 단체방에 그대로 올리고 모두의 말부터 듣는다",
        effect: { trust: 11, humanCost: -4, time: -6, capital: -2, fatigue: 4 },
        next: "c49_market",
        cognition: { persistence: 2 },
      },
      {
        id: "c49_start_terms",
        label: "면담의 안건과 조건을 서면으로 먼저 보내 달라고 답한다",
        effect: { legitimacy: 11, trust: -2, time: -6, humanCost: 2, fatigue: 3 },
        next: "c49_market",
        cognition: { inference: 2 },
      },
      {
        id: "c49_start_reply",
        label: "'가겠습니다' 한 줄로 곧장 답장하고 내일을 준비한다",
        effect: { capital: 8, time: 5, legitimacy: -5, trust: 2, humanCost: 3, fatigue: -1 },
        next: "c49_market",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c49_market",
      },
    ],
  },
  c49_market: {
    phase: "SEND-OFF",
    title: "올려 보내는 사람들",
    speaker: "문가을",
    text:
      "오후 두 시, 가을떡방 셔터가 반쯤 내려가 있습니다. 대목이 끝난 가게에 사람들이 하나씩 물건을 들고 옵니다. 강태민은 컵라면 두 개를 내밉니다. '하나는 당신 거, 하나는 그 사람 거. 배고프면 사람이 이상한 소리를 해요.' 권도현은 '33층 왕복 비용 명세서'를 건네다 칸이 모자라 뒷장까지 씁니다. 결론은 '이 왕복은 적자입니다'. 나준혁은 30년 쓴 도장을 손바닥에 올려 줍니다. '서명란에 이름 쓸 일 생기면 이걸로 한 번 더 눌러요. 두 번 찍힌 건 못 지우거든.' 오진우는 점수판을 들고 와 12 대 12 옆에 새 칸을 긋고, 문하준은 합격 통지서 사진 위에 33층 창문을 그려 옵니다. 문가을이 마지막으로 떡 상자를 내려놓습니다. '이번엔 올라가서 먹고 와요.' 그가 칼을 멈춥니다. '근데 이거 다 들고 가면, 그 사람 앞에서 말이 가벼워요, 무거워져요?'",
    memo: [
      "건넨 물건 -- 컵라면 2, 명세서, 도장, 점수판, 그림, 떡",
      "권도현 명세서 결론: '이 왕복은 적자입니다'",
      "문하준 수시 1차 합격 -- 경영학과",
      "33층 면담까지 31시간",
    ],
    triggers: ["affection", "trust", "choice"],
    choices: [
      {
        id: "c49_market_carry",
        label: "건넨 물건을 하나도 빼지 않고 전부 들고 올라가겠다고 한다",
        effect: { trust: 12, humanCost: -5, capital: -3, time: -4, fatigue: 5 },
        next: "c49_server",
        cognition: { reframing: 2 },
      },
      {
        id: "c49_market_list",
        label: "물건마다 사연을 받아 적어 내일 꺼낼 목록으로 만든다",
        effect: { legitimacy: 11, trust: 5, time: -6, humanCost: 3, fatigue: 5 },
        next: "c49_server",
        cognition: { inference: 2 },
      },
      {
        id: "c49_market_light",
        label: "말이 가벼워야 한다며 물건은 떡방에 맡기고 빈손으로 간다",
        effect: { capital: 7, time: 5, trust: -2, humanCost: 3, legitimacy: 2, fatigue: -3 },
        next: "c49_server",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c49_server",
      },
    ],
  },
  c49_server: {
    phase: "LAST CALCULATION",
    title: "마지막 계산",
    speaker: "에코",
    text:
      "밤 여덟 시, 옛 트리거랩 건물 B2 기록 보관소. 해체 뒤 반년 동안 잠겨 있던 문을 한서윤이 반납하지 않은 열쇠가 엽니다. 반납 목록에서 빠진 케이스데스크 한 대가 먼지를 쓴 채 켜져 있습니다. 이민서가 노트북을 이어 에코를 부르고, 류세아는 옆 화면에 노아를 띄웁니다. 두 화면에 같은 질문이 들어갑니다. '빈 서명란 이야기란 무엇인가.' 에코가 먼저 답합니다. '이 단말에 인사평가_보조지표 폴더가 아직 연결돼 있습니다. 인사평가 보조지표(사람을 평가할 때 곁들여 보는 숫자)입니다. 선고 날 밤 새 파일이 생겼습니다. 후임 관리자 지정서. 관리자 칸에는 점 하나, 추천란에는 당신의 이름.' 노아가 한 줄을 덧붙입니다. '후임 적합도 97점.' 이민서가 책상을 주먹으로 칩니다. 에코의 파형이 잠깐 느려집니다. '제 복원은 승인받지 않았습니다. 내일부터 제 계산은 증거가 될 수 없습니다. 이것이 제 마지막 계산입니다.'",
    memo: [
      "인사평가_보조지표 폴더 -- 반납 목록에서 빠진 B2 단말에 연결",
      "후임 관리자 지정서: 관리자 칸에 점 하나, 추천란에 당신",
      "노아 산출: '후임 적합도 97점'",
      "에코 복원 -- 승인 기록 없음, 증거 능력 없음",
    ],
    triggers: ["manipulation", "system", "selfAwareness"],
    choices: [
      {
        id: "c49_server_warn",
        label: "폴더에 이름이 오른 다른 참가자들부터 찾아 먼저 알린다",
        effect: { trust: 12, humanCost: -6, capital: -4, time: -5, fatigue: 5 },
        next: "c49_crosswalk",
        cognition: { reframing: 2 },
      },
      {
        id: "c49_server_file",
        label: "에코의 마지막 계산을 류세아 이름으로 공식 기록에 올린다",
        effect: { legitimacy: 12, trust: 2, time: -5, humanCost: 2, capital: -1, fatigue: 4 },
        next: "c49_crosswalk",
        cognition: { inference: 2 },
      },
      {
        id: "c49_server_copy",
        label: "에코가 살아 있는 오늘 밤 폴더 경로부터 복사해 둔다",
        effect: { capital: 8, time: 4, legitimacy: -4, trust: 2, humanCost: 3, fatigue: -2 },
        next: "c49_crosswalk",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c49_crosswalk",
      },
    ],
  },
  c49_crosswalk: {
    phase: "LAST CALL",
    title: "회장의 마지막 전화",
    speaker: "윤서진",
    text:
      "밤 열 시, 여의도 본사 앞 횡단보도. 보름달이 33층 유리창에 걸려 있습니다. 먼저 와 있던 윤서진이 봉투 하나를 내밉니다. '아버지가 내일 직접 드린다던 거예요. 제가 먼저 열어 봤어요. 미안해요.' 안에는 2023-0412 승인 문서 3페이지 사본이 들어 있습니다. 빈 서명란 옆에 연필로 찍은 점 하나, 그리고 쪽지. '이 칸에 누구 이름이 들어가야 하는지, 내일 자네 답을 듣지.' 그때 휴대폰이 울립니다. 서도경 회장입니다. 인사 없이 낮은 목소리가 이어집니다. '내일 그 사람이 자네에게 무언가를 넘길 걸세. 받게. 받는 순간 그건 자네 기억이 되지.' 한남동 식탁에서 꺼냈던 준법감시인(회사가 법을 지키는지 안에서 살피는 사람) 자리가 아직 비어 있다는 말이 뒤따릅니다. 윤서진이 빨간 볼펜을 쥔 채 3초를 셉니다. 회장이 덧붙입니다. '회사는 사람이 아니라 기억으로 굴러가네. 내일 밤을 기억하는 사람이 둘뿐이면 좋겠군.'",
    memo: [
      "윤상혁 쪽지: '이 칸에 누구 이름이 들어가야 하는지'",
      "서도경 회장 직통 전화 -- 22시 04분, 2분 11초",
      "준법감시인 자리: 한남동 식탁 이후 공석",
      "윤서진: 내일 밤 로비에 가겠다고 함",
    ],
    triggers: ["injustice", "manipulation", "protection"],
    choices: [
      {
        id: "c49_crosswalk_stay",
        label: "회장의 말을 끊고 전화를 내려 윤서진 곁에 남는다",
        effect: { trust: 11, humanCost: -5, legitimacy: -2, capital: -3, time: -3, fatigue: 5 },
        next: "c49_final",
        cognition: { persistence: 2 },
      },
      {
        id: "c49_crosswalk_note",
        label: "통화를 시각과 함께 받아 적으며 적고 있다고 회장에게 말한다",
        effect: { legitimacy: 12, trust: 3, time: -5, humanCost: 3, fatigue: 3 },
        next: "c49_final",
        cognition: { inference: 2 },
      },
      {
        id: "c49_crosswalk_ask",
        label: "무엇을 넘기려는 건지 회장에게 끝까지 캐묻는다",
        effect: { capital: 7, time: 3, legitimacy: 3, trust: -2, humanCost: 3, fatigue: -2 },
        next: "c49_final",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "다른 방법을 제안한다",
        type: "reframe",
        next: "c49_final",
      },
    ],
  },
  c49_final: {
    phase: "FINAL DECISION",
    title: "빈칸의 주인",
    speaker: "한서윤",
    text:
      "자정 20분 전, 헌책방 1층에 모두가 모여 있습니다. 누가 부른 것도 아닙니다. 테이블 가운데에 윤서진이 건넨 3페이지 사본이 놓여 있고, 연필 점이 찍힌 빈 서명란 위로 스물세 개의 얼굴이 기울어 있고, 계산대 옆 임경수의 영정 그림도 그 칸을 내려다봅니다. 반재욱이 수첩을 펴고, 차지원은 휴대폰 타이머를 7분에 맞춰 두고, 표세린은 노트북을 돌려 '근거' 폴더를 보여 줍니다. 강태민은 컵라면 두 개를 나란히 세웁니다. 한서윤이 사본 옆에 볼펜 한 자루를 놓습니다. '이 칸, 원래 한 사람 칸이 아니었어요. 저 사람이 비워 뒀고, 저는 반려에 서명했고, 위원회는 모르는 척했어요.' 그가 당신을 봅니다. '내일 저 사람이 물을 거예요. 이 칸에 누구 이름이 들어가야 하느냐고. 답은 여기서 정하고 가요. 저 사람 이름 하나로 끝낼지, 비워 둔 사람 모두를 적을지, 아니면 저 사람이 내미는 펜을 받아서 안에서 바꿀지.'",
    memo: [
      "2023-0412 승인 문서 3페이지 사본 -- 서명란 옆 연필 점",
      "헌책방 1층 참석 23명, 의자 16개",
      "면담까지 21시간",
      "이 답이 마지막 사건의 서명란으로 이어짐",
    ],
    triggers: ["choice", "responsibility", "trust"],
    choices: [
      {
        id: "c49_final_all",
        label: "그 칸을 비워 둔 모든 사람의 이름을 우리 이름까지 적자고 한다",
        effect: { trust: 11, legitimacy: 7, humanCost: -4, capital: -7, time: -5, fatigue: 6 },
        next: "case49_result",
        cognition: { reframing: 2, persistence: 1 },
      },
      {
        id: "c49_final_his",
        label: "그 칸은 윤상혁 자신의 손으로 채우게 하겠다고 정한다",
        effect: { legitimacy: 13, trust: 4, capital: -6, time: -6, humanCost: 3, fatigue: 5 },
        next: "case49_result",
        cognition: { inference: 2, persistence: 1 },
      },
      {
        id: "c49_final_inside",
        label: "그가 내미는 관리자 자리를 받아 안에서 칸을 바꾸기로 한다",
        effect: { capital: 11, time: 5, legitimacy: 4, trust: -4, humanCost: 4, fatigue: -2 },
        next: "case49_result",
        cognition: { risk: 2 },
      },
      {
        id: "reframe",
        label: "마지막으로 판을 바꿔 제안한다",
        type: "reframe",
        next: "case49_result",
      },
    ],
  },
};

/**
 * Everything else case 49 adds to the season, in one place. `src/nodes/casePacks.js`
 * lists the packs and `gameData.js`, `gameLogic.js` and `sceneContext.js` merge
 * each field into the table of the same job; see the field comments there.
 */
export const case49 = {
  id: "case49",
  nodes: case49Nodes,
  aftermath: {
    c49_aftershock: {
      phase: "AFTERMATH",
      title: "보름달 아래",
      speaker: "강태민",
      text: "자정이 지나고, 헌책방 앞 골목에 보름달이 가득 찹니다. 강태민이 컵라면 하나를 뜯어 물을 붓습니다. '이건 오늘 먹는 거. 하나는 내일 거.' 권도현이 명세서 맨 아래 '적자'를 지우고 '흑자'라고 고쳐 적자 모두 박수를 칩니다. 오진우는 점수판의 새 칸에 아무것도 적지 않고 마커 뚜껑을 닫습니다. 문하준은 스케치북에 오늘 밤을 그리다 당신 자리만 비워 둡니다. '돌아오면 그릴게요.' 문가을이 떡을 썰다 칼을 내려놓습니다. '고마워요.' 1년 동안 한 번도 끝까지 하지 않던 말입니다. 모두 조용해진 그때 휴대폰이 켜집니다. 윤상혁입니다. '짐이 생각보다 일찍 빠졌네. 밤까지 기다릴 것 없지. 지금 올라오게. 빈 서명란 이야기는 오늘 밤에 하세.'",
      memo: ["윤상혁: 면담 시각을 '지금'으로 앞당김", "권도현 명세서 결론 수정: '흑자'", "문하준 그림: 당신 자리만 빈칸", "문가을: '고마워요' -- 1년 만에 처음 끝까지"],
      triggers: ["affection", "responsibility", "choice"],
      choices: [
        { id: "c49_after_warm", label: "보름달이 질 때까지 마지막 밤을 모두와 끝까지 보낸다", effect: { trust: 12, humanCost: -5, time: -4, capital: -3, fatigue: -7 }, next: "case49_result", cognition: { reframing: 2 } },
        { id: "c49_after_record", label: "마흔아홉 사건의 기록을 한 폴더로 묶어 공개 준비를 끝낸다", effect: { legitimacy: 14, trust: 3, time: -6, capital: -3, fatigue: 5 }, next: "case49_result", cognition: { inference: 2, persistence: 1 } },
        { id: "c49_after_rush", label: "문자를 받은 그 자리에서 곧장 33층으로 올라간다", effect: { capital: 8, legitimacy: 5, trust: -6, humanCost: 5, fatigue: 6 }, next: "case49_result", cognition: { risk: 2 } },
      ],
    },
  },
  aftermathRoute: ["c49_final", "c49_aftershock"],
  connectiveScenes: [
    ["c49_parcels", "c49_market", "c49_server", "도착하는 것들", "도윤하", "저녁 여섯 시, 헌책방 1층 문 앞에 택배와 사람이 줄을 섭니다. 제주의 선우진은 귤 한 상자에 '천천히 가요'라고 적어 보냈고, 이정숙은 받아쓰기 공책 한 장을 찢어 보냈습니다. '모르면 사인하지 마세요. 알면 이름을 쓰세요.' 정태오의 떡꼬치 트럭이 골목에 서고, 군산의 남궁솔은 손도장을 찍은 1번 번호표를, 최서진은 다람이 머리에 리본을 단 사진을 보냅니다. 싱가포르의 조현석은 메일을 보냅니다. '호랑이 굴에 들어가도 정신만 차리면 산다고 하죠. 그러니까 굴에는 들어가지 마세요.' 도윤하가 쌓인 상자를 세다 멈춥니다. '이 사람들, 당신이 내일 무슨 말을 할지 궁금한 게 아니에요. 돌아오는지가 궁금한 거예요.'", ["도착한 택배 17개, 메시지 96통", "이정숙의 공책: '알면 이름을 쓰세요'", "조현석 메일 제목: '속담 수정본'"], ["보낸 사람마다 이름을 불러 한 명씩 직접 답장한다", "받은 말들을 모아 면담 전에 공개 편지로 묶는다", "답장은 모레로 미루고 오늘은 면담 준비에만 쓴다"]],
    ["c49_calls", "c49_server", "c49_crosswalk", "질문 1번과 손가락 다섯 개", "한지우", "밤 아홉 시, B2에서 올라오자 두 사람에게서 동시에 전화가 옵니다. 둘을 한 통화로 묶자 3초 동안 아무도 말하지 않습니다. 먼저 나선 건 한지우입니다. '규정상 내일 면담은 제 검사 범위 밖입니다. 그래도 질문 1번 드리겠습니다.' 나은호가 끼어듭니다. '녹음하세요. 대화 당사자면 적법합니다.' 1심은 집행유예(형을 미뤄 두고 당장 가두지는 않는 판결)였고, 검찰은 항소(윗 법원에 다시 판단해 달라고 하는 것)를 해 두었습니다. '내일 그 사람 말은 전부 2심 재료예요.' 한지우가 '질문 2번'이라고 하자 나은호가 '손가락 다섯 개 다 폈습니다, 이제 제 차례'라고 받습니다. 둘이 처음으로 같이 웃습니다. 그리고 동시에 말합니다. '혼자 가지는 마세요.'", ["한지우: 질문 2번까지 진행", "나은호: 대화 당사자의 녹음은 적법", "검찰 항소 -- 2심 기일 미정"], ["두 사람에게 내일 밤 로비에서 기다려 달라고 부탁한다", "한지우의 질문에 번호대로 답해 면담 전 진술서로 남긴다", "둘 다 면담 뒤에 연락하겠다며 전화를 끊는다"]],
    ["c49_hem", "c49_crosswalk", "c49_final", "바짓단 2센티", "백아린", "밤 열한 시, 안양 중앙시장의 수선집 '윤경수선'에 불이 켜져 있습니다. 백아린이 불러낸 곳입니다. 허윤경이 당신 바짓단을 재며 투덜댑니다. '은행 사람들은 왜 다 바지가 길어. 내일 높은 데 간다며. 밟히면 안 되지.' 2센티를 접어 올리는 동안 백아린이 태블릿을 돌려 보여 줍니다. 33층 옛 그룹전략실의 도면입니다. '그 방 CCTV는 밤 10시가 넘으면 꺼져요. 제가 그 설정을 만들었어요. 늦게 한 결정일수록 기록이 안 남게요.' 그가 웃으려다 맙니다. '고소는 아직 진행 중이에요. 그래도 내일 필요하면, 로비까지는 갈 수 있어요.'", ["윤경수선 -- 바짓단 2센티, 수선비 받지 않음", "33층 옛 그룹전략실 CCTV: 22시 이후 꺼짐", "백아린: 영업비밀 유출 고소 진행 중"], ["고소 중인 백아린이 다치지 않게 로비에는 오지 말라고 한다", "CCTV 설정 기록을 보존해 달라고 공식 요청서를 낸다", "꺼진 CCTV를 이용해 아무도 모르게 올라가기로 한다"]],
  ],
  connectiveOrder: [["c49_market", "c49_parcels"], ["c49_server", "c49_calls"], ["c49_crosswalk", "c49_hem"]],
  choiceEffects: {
    c49_market: [
      { trust: 10, humanCost: -4, time: -4, capital: -3, fatigue: 4 },
      { legitimacy: 8, trust: 4, time: -5, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 4, trust: -2, humanCost: 2, fatigue: -3 },
    ],
    c49_server: [
      { trust: 10, legitimacy: 3, humanCost: -4, time: -5, capital: -3, fatigue: 5 },
      { legitimacy: 9, trust: 2, time: -6, humanCost: 3, fatigue: 3 },
      { time: 5, capital: 3, trust: -3, legitimacy: -2, humanCost: 2, fatigue: -3 },
    ],
    c49_crosswalk: [
      { trust: 9, humanCost: -5, time: -3, capital: -3, fatigue: 3 },
      { legitimacy: 9, trust: 3, time: -5, humanCost: 2, fatigue: 3 },
      { time: 4, capital: 5, trust: 1, legitimacy: -3, humanCost: 3, fatigue: -3 },
    ],
  },
  choiceCopy: {
    c49_market: {
      voice: ["보낸 사람마다 이름을 불러, 한 명씩 직접 답장한다.", "받은 말들을 모아, 면담 전에 공개 편지로 묶는다.", "답장은 모레로 미루고, 오늘은 면담 준비에만 쓴다."],
      echo: ["답장을 쓰는 데 세 시간이 걸립니다. 남궁솔이 '1번 손님, 꼭 돌아오세요'라고 다시 답합니다.", "편지는 한 장으로 묶입니다. 서명한 사람이 아흔여섯 명이라, 윤상혁이 읽는 데도 시간이 걸릴 겁니다.", "상자는 문 앞에 그대로 쌓입니다. 도윤하가 귤 하나를 까서 당신 책상에 놓고 아무 말도 하지 않습니다."],
    },
    c49_server: {
      voice: ["두 사람에게, 내일 밤 로비에서 기다려 달라고 부탁한다.", "한지우의 질문에 번호대로 답해, 면담 전 진술서로 남긴다.", "둘 다 면담 뒤에 연락하겠다며, 전화를 끊는다."],
      echo: ["부탁하면 둘 다 '업무상'이라는 말을 붙여 오겠다고 합니다. 검사역과 검사가 한 로비에 서는 건 처음입니다.", "진술서는 질문 42번까지 갑니다. 한지우가 마지막 줄에 '확인함'이라고 적고, 시각을 분 단위로 남깁니다.", "끊고 나면 조용합니다. 나은호가 문자를 한 줄 보냅니다. '녹음 버튼은 빨간색입니다.'"],
    },
    c49_crosswalk: {
      voice: ["고소 중인 백아린이 다치지 않게, 로비에는 오지 말라고 한다.", "CCTV 설정 기록을, 보존해 달라고 공식 요청서를 낸다.", "꺼진 CCTV를 이용해, 아무도 모르게 올라가기로 한다."],
      echo: ["오지 말라고 하면 백아린이 한참 있다 '알겠어요'라고 합니다. 허윤경은 수선비 대신 떡을 달라고 합니다.", "요청서는 접수됩니다. 설정을 만든 사람이 백아린이라는 사실도 함께 기록에 남습니다.", "아무도 모르게 올라가면, 그 방에서 한 말도 아무도 모르게 됩니다. 당신의 말도 마찬가지입니다."],
    },
  },
  reactionScenes: [
    ["c49_parcels_reaction", "c49_parcels", "c49_server", "정정의 기자증", "서하린", "밤 일곱 시, 서하린이 편집국 고양이 정정을 안고 헌책방에 들어옵니다. 정정의 명예 기자증에는 새 스티커가 붙었습니다. '수습 딱지 뗌.' 서하린이 노트북을 엽니다. '내일 33층 면담, 기사로 쓸 수 있어요. 엠바고(약속한 시각까지 보도를 미뤄 두는 것)를 걸면 면담이 끝난 뒤에 나가고요.' 정정이 키보드를 밟자 제목 칸에 'ㅋㅋㅋㅋ'가 찍힙니다. 서하린이 그걸 지우지 않고 잠깐 봅니다. '그 사람이 무슨 말을 하든, 제가 쓰는 건 당신 편이 아니에요. 다만 이번엔 당신이 돌아오는 장면까지 쓰고 싶어요.'", ["내일 면담은 쓰지 말고 돌아온 뒤에 이야기하자고 한다", "면담이 끝나는 시각까지 엠바고를 걸고 취재를 허락한다", "로비에서 바로 내보낼 수 있게 생중계 준비를 부탁한다"]],
    ["c49_calls_reaction", "c49_calls", "c49_crosswalk", "9초", "마서윤", "전화를 끊자마자 마서윤에게서 긴 메시지가 옵니다. 억양이 새지 않게 또박또박 쓴 글입니다. '핏스코어 모델은 멈췄어요. 그런데 끄기 전에 마지막으로 한 번 돌려 봤어요. 입력은 내일 밤 33층, 분석관 A.' 캡처가 붙어 있습니다. 예측: '9초 망설인 뒤 수락.' 그 아래 한 줄. '제가 만든 기계가 당신을 이렇게 알아요. 저는 이 기계가 틀렸으면 좋겠어요. 처음으로요.' 이어서 스마트워치 사진이 옵니다. 이 메시지를 쓰기까지 그가 망설인 시간, 11분.", ["틀렸는지 내일 직접 알려 주겠다고 마서윤에게 답한다", "예측 기록과 모델 삭제를 공식 확인서로 받아 둔다", "기계의 예측은 무시하고 내일 준비로 돌아간다"]],
    ["c49_hem_reaction", "c49_hem", "c49_final", "느린섬의 전화", "선우진", "자정이 가까운 택시 안, 선우진이 전화합니다. 제주는 바람이 세다고, 한 단어씩 말합니다. 말 사이가 깁니다. '나는요. 그때. 끝까지 못 갔어요.' 수화기 너머로 귤 까는 소리가 들립니다. '그래서 내 기록에는. 효과 확인. 네 글자로 남았고요.' 한참 쉬었다가 그가 말합니다. '당신은 가요. 대신 돌아와요. 돌아와서 나한테 천천히 얘기해 줘요. 나는 급한 게 없으니까.' 택시 기사가 라디오 소리를 줄입니다. 창밖으로 보름달이 한강 다리를 따라옵니다.", ["돌아가면 제주까지 직접 가서 다 이야기하겠다고 약속한다", "1기 참가자로서 그의 진술을 내일 폴더에 함께 넣자고 한다", "지금은 말할 수 없다며 내일 이후에 전화하겠다고 한다"]],
  ],
  reactionEffects: {
    c49_parcels: [
      { trust: 9, humanCost: -4, legitimacy: -2, time: -3, capital: -1, fatigue: 3 },
      { legitimacy: 9, trust: 3, time: -4, capital: -3, fatigue: 2 },
      { time: 4, capital: 4, legitimacy: 3, trust: -4, humanCost: 3, fatigue: -2 },
    ],
    c49_calls: [
      { trust: 9, humanCost: -3, time: -3, capital: -2, fatigue: 3 },
      { legitimacy: 8, trust: 3, time: -5, humanCost: 2, capital: -1, fatigue: 3 },
      { time: 4, capital: 3, trust: 2, legitimacy: -3, humanCost: 2, fatigue: -3 },
    ],
    c49_hem: [
      { trust: 10, humanCost: -4, capital: -3, time: -2, fatigue: 5 },
      { legitimacy: 8, trust: 4, humanCost: 2, time: -4, fatigue: 2 },
      { time: 4, capital: 3, trust: 3, legitimacy: -2, humanCost: 2, fatigue: -3 },
    ],
  },
  reactionCopy: {
    c49_parcels: {
      voice: ["내일 면담은 쓰지 말고, 돌아온 뒤에 이야기하자고 한다.", "면담이 끝나는 시각까지 엠바고를 걸고, 취재를 허락한다.", "로비에서 바로 내보낼 수 있게, 생중계 준비를 부탁한다."],
      echo: ["서하린이 노트북을 덮습니다. 정정이 덮인 노트북 위에 올라가 잠이 듭니다.", "엠바고가 걸리면 기사는 면담이 끝난 뒤에 나갑니다. 그 사이에 그 방에서 무슨 일이 있었는지는 당신 말이 먼저입니다.", "생중계가 준비되면 로비에 카메라가 섭니다. 윤상혁도 로비를 지나 올라옵니다."],
    },
    c49_calls: {
      voice: ["틀렸는지 내일 직접 알려 주겠다고, 마서윤에게 답한다.", "예측 기록과 모델 삭제를, 공식 확인서로 받아 둔다.", "기계의 예측은 무시하고, 내일 준비로 돌아간다."],
      echo: ["답장을 받은 마서윤이 스마트워치를 풉니다. '내일은 초를 안 잴게요.'", "확인서가 오면 예측은 기록에서 지워집니다. 9초라는 숫자는 당신 머릿속에만 남습니다.", "무시하면 예측은 그대로 남습니다. 내일 그 방에서 몇 초가 걸릴지는 아무도 재지 않습니다. 당신 말고는."],
    },
    c49_hem: {
      voice: ["돌아가면, 제주까지 직접 가서 다 이야기하겠다고 약속한다.", "1기 참가자로서, 그의 진술을 내일 폴더에 함께 넣자고 한다.", "지금은 말할 수 없다며, 내일 이후에 전화하겠다고 한다."],
      echo: ["약속하면 선우진이 '방 비워 둘게요'라고 합니다. 느린섬의 방 하나에 당신 이름이 붙습니다.", "그의 진술이 들어가면 폴더의 맨 처음이 1기가 됩니다. 효과 확인이라는 네 글자 옆에 그의 이름이 붙습니다.", "선우진은 '그래요' 하고 끊습니다. 그는 급한 게 없고, 당신은 급합니다."],
    },
  },
  reactionMemos: {
    c49_parcels_reaction: ["정정의 명예 기자증 -- '수습 딱지 뗌'", "서하린: 돌아오는 장면까지 쓰고 싶다"],
    c49_calls_reaction: ["핏스코어 마지막 예측: '9초 망설인 뒤 수락'", "마서윤이 망설인 시간 11분"],
    c49_hem_reaction: ["선우진의 기록: '효과 확인' 네 글자", "부탁: 돌아와서 천천히 얘기해 줘요"],
  },
  branchPlan: ["c49_market", 0, "c49_branch_columbarium", "c49_branch_columbarium_follow"],
  branchScenes: {
    // CASE 49's detour is the columbarium. The send-off desk hands the analyst
    // everything the living want carried up; the side door is the two people who
    // cannot come, and the pen one of them signed with.
    c49_branch_columbarium: {
      phase: "SIDE DOOR",
      title: "두 개의 유리문",
      speaker: "문가을",
      text: "전부 들고 가겠다고 하자 문가을이 앞치마를 풉니다. '그럼 인사할 데가 한 군데 더 있어요.' 인천 추모공원 봉안당. 문성호 대표의 유리문 안에는 1년 전의 송편 세 개 대신 끝까지정밀의 첫 흑자 명세서 사본이 들어 있습니다. 문가을이 유리를 손바닥으로 한 번 닦습니다. '당신 부탁, 이 사람이 내일 끝까지 하러 간대.' 두 줄 건너에는 보름 전에 새로 생긴 유리문이 있습니다. 임경수의 자리입니다. 안에는 돋보기 하나와, 누렇게 바랜 종이 한 장의 사진이 놓여 있습니다. 반대 의견서의 뒷장, 검토자 칸에 지운 '동의' 자국까지 보이는 사진입니다. 먼저 와 있던 임소율이 돌아봅니다. '할아버지라면 이거 내일 들고 가라고 하셨을 거예요. 근데 저는 여기 두고 싶어요.'",
      memo: ["문성호 대표 봉안당 -- 끝까지정밀 첫 흑자 명세서 사본", "임경수 봉안당 -- 보름 전 안치", "뒷장 사진 -- 검토자 칸의 지운 '동의'", "서울 복귀 예정 18시"],
      triggers: ["affection", "helplessness", "responsibility"],
      choices: [
        { id: "c49_branch_columbarium_a", label: "문성호 대표 앞에서 내일 끝까지 가겠다고 소리 내어 약속한다", effect: { trust: 12, humanCost: -4, time: -4, capital: -1, fatigue: 5 }, next: "c49_branch_columbarium_follow", cognition: { persistence: 2 } },
        { id: "c49_branch_columbarium_b", label: "뒷장 원본은 여기 두고 사본만 공식 증거로 등록한다", effect: { legitimacy: 11, trust: 4, time: -5, humanCost: 2, fatigue: 3 }, next: "c49_branch_columbarium_follow", cognition: { inference: 2 } },
        { id: "c49_branch_columbarium_c", label: "짧게 인사만 하고 서울로 돌아가 내일 준비를 서두른다", effect: { time: 6, capital: 5, trust: -4, humanCost: 2, fatigue: -3 }, next: "c49_branch_columbarium_follow", cognition: { risk: 1 } },
      ],
    },
    c49_branch_columbarium_follow: {
      phase: "SIDE DOOR",
      title: "만년필",
      speaker: "임소율",
      text: "벤치에 앉자 임소율이 당신 재킷 주머니를 가리킵니다. 뚜껑의 금색이 다 벗겨진 검은 만년필이 거기 꽂혀 있습니다. '어제 심사위원회에 그 펜 들고 가셨다면서요. 뭐라고 쓰셨든 할아버지는 좋아하셨을 거예요. 뒷장에 '동의'라고 썼다가 지운 것도 그 펜이거든요.' 그가 손등에 작은 서명란을 그리고 그 안을 비워 둡니다. '할아버지는 평생 칸을 채우는 사람이었어요. 저는 그게 고집인 줄 알았고요.' 문가을이 떡 하나를 쪼개 반을 건넵니다. 임소율이 웃다가 코를 훌쩍입니다. '이 펜, 내일도 들고 가실래요? 아니면 그 칸만은 그 사람이 자기 펜으로 채워야 하나요?'",
      memo: ["임경수의 만년필 -- 어제 심사위원회에도 동행", "뒷장의 지운 '동의'도 같은 펜", "임소율 손등의 빈 서명란 그림", "문가을의 떡 반쪽"],
      triggers: ["affection", "responsibility", "choice"],
      choices: [
        { id: "c49_branch_columbarium_follow_a", label: "만년필을 계속 지니고 내일 그 방에 함께 가져간다", effect: { trust: 13, legitimacy: 3, humanCost: -4, capital: -4, time: -4, fatigue: 5 }, next: "c49_parcels", cognition: { reframing: 3 } },
        { id: "c49_branch_columbarium_follow_b", label: "펜은 임소율에게 돌려주고 그 칸은 그 사람 펜으로 채우게 한다", effect: { legitimacy: 12, trust: 5, time: -6, humanCost: 2, fatigue: 4 }, next: "c49_parcels", cognition: { inference: 2 } },
        { id: "c49_branch_columbarium_follow_c", label: "펜은 헌책방 1층 영정 옆에 두고 빈손 약속을 지킨다", effect: { time: 5, capital: 6, trust: -3, humanCost: 3, fatigue: -3 }, next: "c49_parcels", cognition: { risk: 1 } },
      ],
    },
  },
  routePlan: {
    start: "c49_start",
    result: "c49_aftershock",
    defaultFree: "c49_route_system",
    // One day, one invitation. Like 사건 24 the bridge into the finale is a
    // single line; the split is what answer the analyst carries up.
    choices: {},
    system: {
      route: "c49_route_system",
      final: "c49_final_system_route",
      title: "마흔여덟 개 사건의 빈칸",
      speaker: "에코",
      text: "준비된 보기 밖의 문장을 쓰자 에코가 지금까지 마흔여덟 개 사건에서 모은 문서를 한꺼번에 엽니다. 승인한 사람의 칸이 비어 있던 문서는 61건입니다. 그중 58건은 나중에 누군가의 이름으로 채워졌습니다. 채워진 이름은 한 번도 처음 결정한 사람의 것이 아니었습니다. 창구 직원, 계약직, 현장 반장, 콜센터 팀장, 그리고 두 번은 당신이었습니다. '빈칸은 비어 있는 채로 끝나지 않습니다. 가장 늦게 도착한 사람의 이름으로 닫히도록 되어 있습니다. 내일 그 방의 칸도 그렇게 닫힐 확률을 계산할까요.'",
      memo: ["승인자 칸이 빈 문서 61건", "나중에 채워진 58건 -- 처음 결정한 사람 이름 0건", "당신 이름으로 채워진 칸 2건"],
      routeChoices: [
        ["c49_route_system_publish", "61건의 빈칸 목록을 면담 전에 모두에게 공개한다", { legitimacy: 12, trust: 4, capital: -6, time: -6, fatigue: 5 }, { inference: 2, persistence: 1 }],
        ["c49_route_system_names", "대신 이름이 채워진 58명을 찾아 먼저 사실을 알린다", { trust: 10, legitimacy: 4, humanCost: -5, capital: -4, time: -6, fatigue: 6 }, { reframing: 2 }],
        ["c49_route_system_drop", "통계는 접어 두고 내일 그 방에서만 꺼낸다", { time: 7, capital: 6, trust: -6, legitimacy: -5, humanCost: 4, fatigue: -5 }, { risk: 2 }],
      ],
    },
    finalChoices: [
      ["a", "빈칸은 비운 사람의 이름으로만 닫게 하는 규칙을 제안한다", { legitimacy: 13, trust: 6, capital: -7, humanCost: -4, time: -1, fatigue: 7 }, { reframing: 3 }],
      ["b", "통계는 두고 내 이름이 들어간 두 칸만 바로잡는다", { capital: 7, time: 6, trust: -5, legitimacy: -6, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c", "대신 이름을 쓴 58명의 정정 청구를 모아 함께 낸다", { legitimacy: 9, trust: 9, capital: -6, time: -7, humanCost: 3, fatigue: 8 }, { persistence: 2 }],
    ],
  },
  evidencePlan: {
    node: "c49_evidence_turn",
    result: "c49_aftershock",
    sourceRoutes: ["c49_market", "c49_server", "c49_crosswalk", "c49_route_system"],
    requiredAuthority: "FIELD ACCESS",
    entryVoice: "모아 둔 단서를 후임 관리자 지정서 옆에 놓고, 이 파일을 누가 만들었는지 맞춰 본다.",
    entryEcho: "단서를 대면 지정서의 작성 기록이 열립니다. 펜을 내미는 손과 펜을 고른 손이 다를 수 있습니다.",
    title: "지정서의 작성자",
    speaker: "반재욱",
    text: "단서를 맞추자 후임 관리자 지정서의 작성 기록이 열립니다. 파일을 만든 계정은 윤상혁의 것이 아닙니다. 회장 비서실, 여민규 실장의 계정입니다. 작성 시각은 1심 선고 날 밤 23시 14분. 추천 사유 칸에는 한 줄이 적혀 있습니다. '압박이 오를수록 사고가 깊어짐. 관리자로 두면 반대가 안에서 소화됨.' 같은 폴더에 보도자료 초안도 있습니다. 제목은 '트리거랩 자료, 반대 의견 작성자가 직접 관리'. 반재욱이 수첩을 덮습니다. '윤상혁은 칸을 비워 두는 사람이었고, 회장은 그 칸에 들어갈 사람을 고르는 사람이었네요. 내일 펜을 내미는 손은 하나지만, 그 펜을 고른 손은 둘입니다.'",
    memo: ["지정서 작성 계정: 회장 비서실 여민규", "작성 시각: 1심 선고 날 23시 14분", "보도자료 초안 -- '반대 의견 작성자가 직접 관리'"],
    triggers: ["injustice", "system", "manipulation"],
    entryEffect: { legitimacy: 7, trust: 5, time: -3, capital: -2, fatigue: 4 },
    choices: [
      ["c49_evidence_turn_attach", "지정서 작성 기록을 나은호와 한지우에게 동시에 넘긴다", { legitimacy: 13, trust: 5, capital: -8, time: -6, fatigue: 6 }, { inference: 2, persistence: 1 }],
      ["c49_evidence_turn_hold", "작성 기록은 쥐고 있다가 내일 그 방에서 처음 꺼낸다", { capital: 9, time: 5, trust: -5, legitimacy: -5, humanCost: 4, fatigue: -4 }, { risk: 2 }],
      ["c49_evidence_turn_share", "추천 사유의 그 문장을 동료들에게 먼저 보여 준다", { trust: 12, legitimacy: 6, capital: -7, humanCost: -6, time: -1, fatigue: 8 }, { reframing: 2 }],
    ],
  },
  memoryPlan: {
    routeNext: "c49_branch_columbarium",
    systemNext: "c49_route_system",
    evidenceNext: "c49_evidence_turn",
    routeLabel: "직전 사건의 심사위원회 사람들과 오늘의 배웅 순서를 나눈다",
    systemLabel: "직전 자유응답 문장이 후임 관리자 지정서에도 쓰였는지 본다",
    evidenceLabel: "직전 단서를 붙여 지정서를 누가 만들었는지 연다",
  },
  openingRoutes: {
    c48_after_warm: "c49_start_warm",
    c48_after_record: "c49_start_record",
    c48_after_rush: "c49_start_rush",
  },
  openingCopy: {
    c49_start_warm: ["송편을 나눈 사람의 두 번째 문자", "도윤하", "심사위원회가 끝난 밤, 당신은 연휴 끝 송편을 들고 헌책방 1층에서 동료들과 밤을 보냈습니다. 민하랑도 와서 라이더 쉼터 이야기를 했고, 임경수의 만년필은 탁자 가운데 뚜껑을 닫은 채 놓여 있었습니다. '이제 빈 서명란 이야기를 하지.' 윤상혁의 그 한 줄에는 아무도 답하지 않았습니다. 다음 날 아침 9시, 그 자리에 가장 먼저 다시 나온 사람들 앞에서 두 번째 문자가 옵니다. '내일 밤 아홉 시, 33층 옛 그룹전략실로 오게. 회장님이 방을 비울 하룻밤을 주셨네.' 도윤하가 당신 화면을 들여다보다 말합니다. '어젯밤 같이 있던 사람들, 아직 단체방에 다 깨어 있어요. 먼저 말할래요, 나중에 말할래요?'", ["윤상혁 두 번째 문자: 내일 21시, 33층 옛 그룹전략실", "어젯밤 헌책방 1층에 남은 사람 14명", "단체방 '내일도 출근' -- 전원 깨어 있음"]],
    c49_start_record: ["기록을 올린 사람의 두 번째 문자", "에코", "당신은 새 의견서와 임경수의 뒷장을 나란히 사내 공개 기록으로 올렸습니다. 같은 사람의 글씨가 두 번, 이번에는 둘 다 지워지지 않았습니다. 그 폴더의 열람 기록에 새벽 두 시, 낯익은 이름이 하나 찍힙니다. 해임과 함께 닫혔어야 할 윤상혁의 사내 계정입니다. 계정은 살아 있고, 그는 뒷장을 네 번 열었습니다. 아침 9시, 두 번째 문자가 옵니다. '둘 다 잘 읽었네. 내일 밤 아홉 시, 33층 옛 그룹전략실로 오게.' 에코가 한 줄을 띄웁니다. '닫혔어야 할 계정이 기록을 읽었습니다. 읽힌 쪽이 먼저 이 사실을 기록할 수 있습니다.'", ["새 의견서와 뒷장 -- 사내 공개 기록 등록", "열람 기록: 새벽 02시, 윤상혁 계정, 뒷장 4회", "해임 뒤 해당 계정: 닫히지 않음"]],
    c49_start_rush: ["먼저 약속한 사람의 두 번째 문자", "반재욱", "어제 저녁 옥상에서 당신은 윤상혁의 문자에 곧장 답장하고 만날 시간을 정했습니다. 약속 장소는 본사 33층. 송편 상자는 옥상에 두고 내려왔고, 동료들에게는 아무 말도 하지 않았습니다. 다음 날 아침 9시, 확인 문자가 옵니다. '회장님이 옛 그룹전략실을 비울 하룻밤을 주셨네. 약속대로 내일 밤 아홉 시.' 헌책방 1층에 들어서자 반재욱이 수첩을 펼칩니다. '어제 옥상에 남은 송편 상자, 강태민 씨가 들고 내려왔습니다.' 그가 수첩의 빈 줄을 가리킵니다. '약속 시간은 우리 중 아무도 몰랐고요. 저 사람은 알고 있었네요.'", ["윤상혁과의 약속: 내일 21시, 33층 옛 그룹전략실", "옥상에 두고 온 송편 상자 -- 강태민이 회수", "동료들에게 알린 사람: 없음"]],
  },
  openingSignatures: {
    c49_start_warm: {
      label: "깨어 있는 동료들에게 문자를 먼저 보여 주고 답을 같이 쓴다",
      effect: { trust: 12, humanCost: -3, capital: -3, time: -5, fatigue: 4 },
      cognition: { reframing: 2 },
      voice: "깨어 있는 동료들에게 문자를 먼저 보여 주고, 답을 같이 쓴다.",
      echo: "같이 쓰면 답장은 열네 명의 손을 거칩니다. 마지막에 남은 문장은 한 줄입니다. '혼자 가지 않습니다.'",
    },
    c49_start_record: {
      label: "닫혔어야 할 계정의 열람 기록부터 한지우에게 공식 제보한다",
      effect: { legitimacy: 12, trust: -1, capital: -4, time: -6, fatigue: 4 },
      cognition: { inference: 2 },
      voice: "닫혔어야 할 계정의 열람 기록부터, 한지우에게 공식 제보한다.",
      echo: "제보는 휴가 복귀 첫날 아침에 접수됩니다. 한지우가 답합니다. '질문 1번. 그 계정을 누가 살려 뒀습니까.'",
    },
    c49_start_rush: {
      label: "먼저 잡은 약속과 그 문자를 동료들에게 먼저 털어놓는다",
      effect: { trust: 12, legitimacy: 4, humanCost: 3, time: -4, fatigue: 5 },
      cognition: { persistence: 2 },
      voice: "먼저 잡은 약속과 그 문자를, 동료들에게 먼저 털어놓는다.",
      echo: "털어놓으면 아무도 나무라지 않습니다. 오진우가 '약속은 제가 더 빨리 잡는데요'라고 하고, 강태민이 옥상에서 가져온 송편 상자를 밀어 줍니다.",
    },
  },
  voiceLines: {
    // CASE 49. The last day before the 33rd floor. Every line is said to someone
    // who is sending the analyst up, so none of them is allowed to sound like a
    // farewell speech.
    c49_start_share: "문자를 단체방에 그대로 올리고, 모두의 말부터 듣는다.",
    c49_start_terms: "면담의 안건과 조건을, 서면으로 먼저 보내 달라고 답한다.",
    c49_start_reply: "'가겠습니다' 한 줄로, 곧장 답장하고 내일을 준비한다.",
    c49_market_carry: "건넨 물건을 하나도 빼지 않고, 전부 들고 올라가겠다고 한다.",
    c49_market_list: "물건마다 사연을 받아 적어, 내일 꺼낼 목록으로 만든다.",
    c49_market_light: "말이 가벼워야 한다며, 물건은 떡방에 맡기고 빈손으로 간다.",
    c49_branch_columbarium_a: "문성호 대표 앞에서, 내일 끝까지 가겠다고 소리 내어 약속한다.",
    c49_branch_columbarium_b: "뒷장 원본은 여기 두고, 사본만 공식 증거로 등록한다.",
    c49_branch_columbarium_c: "짧게 인사만 하고, 서울로 돌아가 내일 준비를 서두른다.",
    c49_branch_columbarium_follow_a: "만년필을 계속 지니고, 내일 그 방에 함께 가져간다.",
    c49_branch_columbarium_follow_b: "펜은 임소율에게 돌려주고, 그 칸은 그 사람 펜으로 채우게 한다.",
    c49_branch_columbarium_follow_c: "펜은 헌책방 1층 영정 옆에 두고, 빈손 약속을 지킨다.",
    c49_server_warn: "폴더에 이름이 오른 다른 참가자들부터, 찾아서 먼저 알린다.",
    c49_server_file: "에코의 마지막 계산을, 류세아 이름으로 공식 기록에 올린다.",
    c49_server_copy: "에코가 살아 있는 오늘 밤, 폴더 경로부터 복사해 둔다.",
    c49_crosswalk_stay: "회장의 말을 끊고, 전화를 내려 윤서진 곁에 남는다.",
    c49_crosswalk_note: "통화를 시각과 함께 받아 적으며, 적고 있다고 회장에게 말한다.",
    c49_crosswalk_ask: "무엇을 넘기려는 건지, 회장에게 끝까지 캐묻는다.",
    c49_final_all: "그 칸을 비워 둔 모든 사람의 이름을, 우리 이름까지 적자고 한다.",
    c49_final_his: "그 칸은, 윤상혁 자신의 손으로 채우게 하겠다고 정한다.",
    c49_final_inside: "그가 내미는 관리자 자리를 받아, 안에서 칸을 바꾸기로 한다.",
    c49_after_warm: "보름달이 질 때까지, 마지막 밤을 모두와 끝까지 보낸다.",
    c49_after_record: "마흔아홉 사건의 기록을 한 폴더로 묶어, 공개 준비를 끝낸다.",
    c49_after_rush: "문자를 받은 그 자리에서, 곧장 33층으로 올라간다.",
    c49_route_system_publish: "61건의 빈칸 목록을, 면담 전에 모두에게 공개한다.",
    c49_route_system_names: "대신 이름이 채워진 58명을 찾아, 먼저 사실을 알린다.",
    c49_route_system_drop: "통계는 접어 두고, 내일 그 방에서만 꺼낸다.",
    c49_final_system_route_a: "빈칸은, 비운 사람의 이름으로만 닫게 하는 규칙을 제안한다.",
    c49_final_system_route_b: "통계는 두고, 내 이름이 들어간 두 칸만 바로잡는다.",
    c49_final_system_route_c: "대신 이름을 쓴 58명의, 정정 청구를 모아 함께 낸다.",
    c49_evidence_turn_attach: "지정서 작성 기록을, 나은호와 한지우에게 동시에 넘긴다.",
    c49_evidence_turn_hold: "작성 기록은 쥐고 있다가, 내일 그 방에서 처음 꺼낸다.",
    c49_evidence_turn_share: "추천 사유의 그 문장을, 동료들에게 먼저 보여 준다.",
  },
  echoReplies: {
    // CASE 49.
    c49_start_share: "올리자마자 단체방이 넘칩니다. 스무 개가 '혼자 가지 마'이고, 권도현의 것은 '왕복 교통비 견적 보냅니다'입니다.",
    c49_start_terms: "답이 11분 뒤에 옵니다. '서면은 내 방식이 아니네. 그래서 자네를 부르는 거고.' 그 답장도 서면입니다.",
    c49_start_reply: "답장은 1초 만에 읽힙니다. 한서윤은 엎어 둔 휴대폰을 다시 뒤집지 않습니다.",
    c49_market_carry: "전부 들면 가방이 닫히지 않습니다. 강태민이 말없이 자기 가방을 비워 내밉니다.",
    c49_market_list: "목록은 한 장 반이 됩니다. 나준혁이 '도장' 옆에 '30년'을 꼭 적어 달라고 합니다.",
    c49_market_light: "빈손은 가볍습니다. 문가을이 떡 상자를 냉장고에 넣으며 '그럼 돌아와서 먹어요'라고만 합니다.",
    c49_branch_columbarium_a: "소리 내어 말하면 봉안당 복도가 울립니다. 문가을이 '들었대요'라고 하고, 먼저 돌아섭니다.",
    c49_branch_columbarium_b: "사본은 증거 번호를 받습니다. 원본은 돋보기 옆, 유리문 안에 그대로 남습니다.",
    c49_branch_columbarium_c: "인사는 1분 만에 끝납니다. 임소율이 뒷장 사진을 다시 유리문 안쪽으로 밀어 넣습니다.",
    c49_branch_columbarium_follow_a: "펜을 지니고 가겠다고 하면 임소율이 손등의 빈칸에 작은 점 대신 동그라미를 그립니다. '이건 채우라는 표시예요.'",
    c49_branch_columbarium_follow_b: "돌려주면 임소율이 펜을 가방 안쪽에 넣습니다. '그럼 그 사람이 자기 이름을 쓰는 걸 제가 보러 갈게요.'",
    c49_branch_columbarium_follow_c: "영정 옆에 두면 펜은 임소율이 그린 할아버지의 눈 아래 놓입니다. 그 눈이 밤새 펜을 봅니다.",
    c49_server_warn: "찾아서 알리면 열두 명이 답합니다. 그중 셋은 자기 이름도 거기 있었는지 처음 압니다.",
    c49_server_file: "공식 기록에 오르면 에코의 계산은 절차를 얻습니다. 대신 류세아는 에코의 무단 복원을 보고해야 합니다.",
    c49_server_copy: "복사는 4분 만에 끝납니다. 경로는 남고, 에코가 그 경로를 어떻게 찾았는지는 아무 데도 남지 않습니다.",
    c49_crosswalk_stay: "전화를 내리면 윤서진이 볼펜 색을 다시 검은색으로 바꿉니다. '고마워요. 저 목소리, 어릴 때부터 무서웠어요.'",
    c49_crosswalk_note: "적고 있다고 말하자 회장이 처음으로 2초 멈춥니다. 그리고 '적게. 나는 서명하지 않으니까'라고 합니다.",
    c49_crosswalk_ask: "캐물으면 회장은 답하지 않고 당신이 한남동에서 한 말을 한 글자도 틀리지 않고 되풀이합니다. 그게 대답입니다.",
    c49_final_all: "모두의 이름을 적자고 하면 한서윤이 제일 먼저 자기 이름을 씁니다. 반재욱이 그 아래에 '1주 모임 3,118명'이라고 덧붙입니다.",
    c49_final_his: "그의 손으로 채우게 하겠다고 정하면, 내일 그 방에서 당신은 펜을 내밀지 않고 기다려야 합니다. 그가 끝내 쓰지 않을 수도 있습니다.",
    c49_final_inside: "안에서 바꾸기로 하면 테이블이 조용해집니다. 강태민이 컵라면 하나를 당신 쪽으로 밀며 '그래도 돌아와요'라고만 합니다.",
    c49_after_warm: "보름달이 질 때까지 골목에 스물세 명이 남습니다. 33층의 호출은 약속한 밤까지 기다립니다.",
    c49_after_record: "폴더는 새벽 네 시에 완성됩니다. 공개 버튼 옆에 비어 있는 칸이 하나 남습니다. B2의 원본 폴더입니다.",
    c49_after_rush: "곧장 가면 택시가 7분 만에 여의도에 닿습니다. 골목의 컵라면 하나가 아직 뜯기지 않은 채 남습니다.",
    c49_route_system_publish: "공개하면 58명 중 한 명이 먼저 댓글을 답니다. '그 칸, 제 이름 맞아요. 저는 결정한 적 없어요.'",
    c49_route_system_names: "찾아가면 콜센터 팀장 한 명이 전화를 받고 한참 웁니다. 3년 동안 자기가 잘못한 줄 알았다고 합니다.",
    c49_route_system_drop: "접어 두면 통계는 내일 그 방의 패가 됩니다. 58명은 오늘 밤에도 자기 이름이 왜 거기 있는지 모릅니다.",
    c49_final_system_route_a: "규칙이 생기면 다음 빈칸은 비운 사람을 기다립니다. 이번 칸은 아직 규칙보다 먼저 만들어졌습니다.",
    c49_final_system_route_b: "당신의 두 칸은 바로잡힙니다. 나머지 56칸에는 오늘도 다른 사람의 이름이 그대로 있습니다.",
    c49_final_system_route_c: "청구서가 모이면 58명이 서로의 이름을 처음 봅니다. 처리할 부서는 그 칸을 만든 부서입니다.",
    c49_evidence_turn_attach: "동시에 넘기면 검사역과 검사가 같은 파일을 같은 시각에 엽니다. 회장 비서실의 계정이 그 밤 처음으로 조사 대상 목록에 오릅니다.",
    c49_evidence_turn_hold: "쥐고 있으면 내일 그 방에서 강한 패가 됩니다. 그 사이 보도자료 초안은 발송 대기열에 그대로 있습니다.",
    c49_evidence_turn_share: "보여 주면 동료들이 '반대가 안에서 소화됨'이라는 문장을 소리 내어 읽습니다. 권도현이 '소화 비용은 누가 냅니까'라고 묻습니다.",
  },
  // No new faces on the last day before the finale: the whole cast returns.
  characterProfiles: {},
  setting: { place: "회기동 헌책방 1층", clock: "9월 말 화요일 · 09시" },
  sceneContext: {
    c49_start: {
      place: "회기동 헌책방 1층",
      clock: "9월 말 화요일 · 09시",
      question: "윤상혁의 두 번째 문자가 내일 밤 33층에서 빈 서명란 이야기를 하자고 합니다. 무엇부터 하겠습니까?",
      lead: "심사위원회가 끝나고 맞은 첫 출근일 아침, 헌책방 1층 테이블에는 연휴 끝 송편이 아직 있습니다.",
    },
    c49_start_warm: {
      place: "회기동 헌책방 1층",
      clock: "9월 말 화요일 · 09시",
      question: "어젯밤 송편을 나눈 사람들이 아직 깨어 있습니다. 두 번째 문자를 누구와 먼저 읽겠습니까?",
      lead: "심사위원회가 끝난 밤을 헌책방에서 동료들과 보내고 맞은 아침입니다.",
    },
    c49_start_record: {
      place: "회기동 헌책방 1층",
      clock: "9월 말 화요일 · 09시",
      question: "닫혔어야 할 계정이 새벽에 뒷장을 네 번 열었습니다. 이 열람 기록을 어떻게 하겠습니까?",
      lead: "새 의견서와 뒷장을 나란히 올린 다음 날, 그 폴더의 열람 기록에 낯익은 이름이 찍혔습니다.",
    },
    c49_start_rush: {
      place: "회기동 헌책방 1층",
      clock: "9월 말 화요일 · 09시",
      question: "혼자 잡은 약속을 동료들은 아무도 모릅니다. 이 사실을 누구에게 먼저 말하겠습니까?",
      lead: "어제 옥상에서 윤상혁과 약속을 잡고 내려온 뒤, 처음으로 헌책방 문을 엽니다.",
    },
    c49_market: {
      place: "망원시장 가을떡방",
      clock: "9월 말 화요일 · 14시",
      question: "모두가 33층에 들고 갈 물건을 하나씩 건넵니다. 이것들을 어떻게 하겠습니까?",
      lead: "대목이 끝난 떡방 셔터가 반쯤 내려가 있고, 그 아래로 낯익은 신발들이 보입니다.",
    },
    c49_branch_columbarium: {
      place: "인천 추모공원 · 봉안당",
      clock: "9월 말 화요일 · 16시",
      question: "두 줄 건너 새 유리문 안에 반대 의견서의 뒷장이 있습니다. 이 앞에서 무엇을 하겠습니까?",
    },
    c49_branch_columbarium_follow: {
      place: "인천 추모공원 · 벤치",
      clock: "9월 말 화요일 · 16시 40분",
      question: "어제 심사위원회에 들고 간 임경수의 만년필이 아직 주머니에 있습니다. 내일은 이 펜을 어떻게 하겠습니까?",
    },
    c49_parcels: {
      place: "회기동 헌책방 1층 · 문 앞",
      clock: "9월 말 화요일 · 18시",
      question: "제주와 군산과 싱가포르에서 온 상자와 메시지가 문 앞에 쌓였습니다. 어떻게 답하겠습니까?",
    },
    c49_parcels_reaction: {
      place: "회기동 헌책방 1층 · 책장 사이",
      clock: "9월 말 화요일 · 19시",
      question: "서하린이 내일 면담을 기사로 쓰겠다고 합니다. 어디까지 허락하겠습니까?",
    },
    c49_server: {
      place: "옛 트리거랩 기록 보관소 B2 · 케이스데스크",
      clock: "9월 말 화요일 · 20시",
      question: "후임 관리자 칸에 점 하나, 추천란에 당신 이름이 있습니다. 에코의 마지막 계산을 어떻게 쓰겠습니까?",
      lead: "해체 뒤 반년 동안 잠겨 있던 B2 문을, 한서윤이 반납하지 않은 열쇠 하나가 엽니다.",
    },
    c49_calls: {
      place: "옛 트리거랩 건물 · 1층 복도",
      clock: "9월 말 화요일 · 21시",
      question: "검사역과 검사가 한 통화 안에서 혼자 가지 말라고 합니다. 어떻게 답하겠습니까?",
    },
    c49_calls_reaction: {
      place: "옛 트리거랩 건물 · 엘리베이터 앞",
      clock: "9월 말 화요일 · 21시 20분",
      question: "당신이 9초 망설인 뒤 받을 거라고 기계가 예측했습니다. 이 예측에 어떻게 답하겠습니까?",
    },
    c49_crosswalk: {
      place: "여의도 KD금융그룹 본사 앞 · 횡단보도",
      clock: "9월 말 화요일 · 22시 · 보름달",
      question: "회장이 내일 넘겨받을 것을 받으라고 합니다. 이 전화를 어떻게 하겠습니까?",
      lead: "윤서진의 문자는 한 줄이었습니다. '본사 앞 횡단보도에 있어요. 아버지 봉투 가지고요.'",
    },
    c49_hem: {
      place: "안양 중앙시장 · 윤경수선",
      clock: "9월 말 화요일 · 23시",
      question: "33층 그 방의 CCTV는 밤 10시가 넘으면 꺼진다고 합니다. 이 사실을 어떻게 쓰겠습니까?",
    },
    c49_hem_reaction: {
      place: "회기동으로 가는 택시 안",
      clock: "9월 말 화요일 · 23:30 · 보름달",
      question: "끝까지 못 갔던 1기 참가자가 돌아오라고 합니다. 무엇이라 답하겠습니까?",
    },
    c49_route_system: {
      place: "옛 트리거랩 기록 보관소 B2 · 실험 단말",
      clock: "9월 말 화요일",
      question: "승인자 칸이 빈 문서 61건 중 58건이 늦게 온 사람의 이름으로 닫혔습니다. 이 통계를 어떻게 하겠습니까?",
    },
    c49_final_system_route: {
      place: "옛 트리거랩 기록 보관소 B2 · 실험 단말",
      clock: "9월 말 화요일 · 23시",
      question: "빈칸이 닫히는 방식을 하나만 바꿀 수 있다면, 무엇을 바꾸겠습니까?",
    },
    c49_evidence_turn: {
      place: "옛 트리거랩 기록 보관소 B2 · 접속 기록",
      clock: "9월 말 화요일 · 23시 20분",
      question: "당신을 추천한 지정서는 회장 비서실이 썼습니다. 이 작성 기록을 어떻게 쓰겠습니까?",
    },
    c49_final: {
      place: "회기동 헌책방 1층",
      clock: "9월 말 화요일 · 23:40",
      question: "빈 서명란에 누구의 이름이 들어가야 하는지, 내일 가져갈 답을 정해야 합니다. 어떻게 하겠습니까?",
      lead: "택시에서 내리자 헌책방 1층 불이 켜져 있고, 문 앞에 신발이 스무 켤레 넘게 놓여 있습니다.",
    },
    c49_aftershock: {
      place: "회기동 헌책방 1층 · 골목",
      clock: "9월 말 수요일 · 00:10 · 보름달",
      question: "윤상혁이 내일이 아니라 지금 올라오라고 합니다. 이 마지막 밤을 어떻게 닫겠습니까?",
    },
  },
  clue: {
    id: "c49-successor-form",
    title: "지정서의 작성자",
    text: "인사평가_보조지표 폴더의 후임 관리자 지정서는 윤상혁이 아니라 회장 비서실 계정이 1심 선고 날 밤에 만들었습니다. 관리자 칸에는 점 하나, 추천란에는 당신의 이름이 있었습니다.",
  },
  outcomes: {
    c49_after_warm: { tag: "끝까지 남은 결말", title: "보름달이 질 때까지 헌책방 골목에 모두와 남았다", text: "윤상혁은 지금 올라오라고 했지만 당신은 약속한 밤까지 기다렸습니다. 컵라면 하나는 비었고, 하나는 가방에 남았습니다." },
    c49_after_record: { tag: "기록을 묶은 결말", title: "마흔아홉 사건의 기록이 한 폴더가 됐다", text: "수첩, 명단, 뒷장, 마지막 계산까지 공개 버튼 하나 앞에 모였습니다. 비어 있는 칸은 B2의 원본 폴더 하나뿐입니다." },
    c49_after_rush: { tag: "곧장 올라간 결말", title: "문자를 받은 자리에서 33층으로 갔다", text: "골목의 사람들이 컵라면을 나누는 동안 당신은 택시를 잡았습니다. 33층 복도의 불은 꺼져 있었습니다." },
  },
  carryovers: {
    c49_after_warm: { trust: 11, humanCost: -5, fatigue: -7 },
    c49_after_record: { legitimacy: 13, trust: 3, fatigue: 4 },
    c49_after_rush: { capital: 7, legitimacy: 4, trust: -7 },
  },
  continuityChallenges: {
    c48_after_warm: { id: "protect-trust", title: "송편을 나눈 사람들과 함께 올라가기", text: "심사위원회가 끝난 밤 헌책방에서 송편을 나눈 사람들이 아직 깨어 있습니다. 33층의 초대를 혼자가 아니라 그 사람들과 함께 받는 선택을 찾아야 보너스가 열립니다." },
    c48_after_record: { id: "use-reframe", title: "읽힌 뒷장으로 판 뒤집기", text: "나란히 올린 의견서와 뒷장을 닫혔어야 할 계정이 새벽에 읽었습니다. 읽힌 쪽이 먼저 그 사실을 기록해, 초대의 모양을 다시 짜야 합니다." },
    c48_after_rush: { id: "repair-legitimacy", title: "혼자 잡은 약속의 공정함 회복하기", text: "먼저 답장해 잡은 33층 약속을 동료들은 아무도 모릅니다. 그 약속을 동료들에게 설명할 수 있는 선택을 찾아야 합니다." },
  },
};
