/**
 * 번외 1 -- 아직 찾아가지 못한 일곱 명 (E-11, 설계안 질문 6 (1)).
 *
 * The Saturday between 사건 17's 인사위원회 (12월 19일, 금) and the 송년회
 * (12월 21일, 일): 2025년 12월 20일. 권도현's whiteboard in 사건 17 counted
 * seven of 반재욱's forty-seven names as "아직 찾아가지 못한 사람"; the
 * committee is over, so visiting them is no use to anyone any more, and that is
 * why 반재욱 goes. He takes the analyst and his daughter 반서아, and the oldest
 * of the seven: 유정례, a teller at KD은행 수유지점 whose cash came up 300만 원
 * short one evening in March 2012 because the branch manager had it handed to
 * a client's driver "with the slip tomorrow" and told her to close the day as
 * balanced under her own 사번. 반재욱 closed that inquiry in five working days,
 * the target the New York owner's quarterly review had set, and never asked
 * whose word it was. She runs a dry cleaner's in 수유동 now; the retired
 * manager brings five shirts every Tuesday and does not know her.
 *
 * It says nothing the season has to keep. It does not say what became of the
 * black notebook on 12월 19일 (court, owners, fire or the hidden route all fit):
 * 반서아 has bought her father a new one, and the case ends on its first page.
 * Its people are the season's (반재욱, 반서아, 정태오, who have portraits) and
 * 유정례 and 공태식, who are spoken of and quoted but never a scene's speaker,
 * so they need no portrait. Nothing here reaches a season save
 * (nodes/sidePacks.js, state/sideRun.js).
 *
 * The laughter is 반재욱 folding shirts like an audit -- he finds a ticket
 * missing -- and the collar starch 유정례 lays on the manager's shirts "so his
 * neck is a little uncomfortable"; 정태오 offering to park his food truck at
 * her door on Tuesday so the manager has to queue. The anger is one 사번 and a
 * five-day target; the sorrow a dismissal letter her sister read first; the
 * joy what goes on the new notebook's first line.
 *
 * The shape is the one checkSidePack holds (state/sidePackCheck.js): eleven
 * scenes, `s1_aftershock`'s three cards to `s1_result`, three `outcomes`. The
 * side screen shows no decision reveal, so the cards carry no voice or echo.
 */
export const side01 = {
  id: "side01",
  label: "번외 1",
  title: "아직 찾아가지 못한 일곱 명",
  startNode: "s1_start",
  // A mid-season table: what an analyst holds around 사건 17, not this device's season.
  startState: {
    resources: { time: 55, capital: 65, trust: 55, legitimacy: 55, humanCost: 18, fatigue: 30 },
  },
  nodes: {
    s1_start: {
      phase: "SIDE 01 BRIEFING",
      title: "일곱 칸",
      speaker: "반재욱",
      place: "합정동 트리거랩 앞 주차장",
      clock: "12월 20일 (토) 09:10, 인사위원회 다음 날",
      lead: "인사위원회와 송년회 사이의 토요일. 반재욱이 수첩 속 47명 가운데 아직 찾아가지 못한 일곱 명을 찾아 나섭니다.",
      text: "반재욱의 낡은 은색 차 조수석에 새 수첩 한 권이 놓여 있습니다. 표지에 별 스티커가 하나 붙어 있고, 속은 첫 장부터 비어 있습니다. 뒷자리에서 서아가 '내가 골라 준 거야' 하고 말합니다. 반재욱이 휴대전화를 내밉니다. 권도현이 탕비실 화이트보드에 그렸던 표를 찍은 사진입니다. '아직 찾아가지 못한 사람 7명' 칸에 이름이 일곱 개 적혀 있습니다. '인사위원회는 어제 끝났습니다. 이제 이 사람들을 찾아갈 이유는 없어요.' 그가 시동을 겁니다. '그래서 오늘 가려고요. 이유 없이 가는 건 처음입니다.'",
      question: "찾아갈 이유가 사라진 날, 반재욱이 일곱 명을 찾아가겠다고 합니다. 어떻게 하겠습니까?",
      memo: ["못 찾아간 7명 -- 권도현의 화이트보드 사진", "새 수첩: 서아가 고름, 첫 장부터 빈칸", "내일 송년회"],
      triggers: ["responsibility", "trust", "affection"],
      choices: [
        { id: "s1_start_ride", label: "이유 없는 하루라도 끝까지 같이 간다", effect: { trust: 10, humanCost: -3, time: -4, fatigue: 4 }, cognition: { persistence: 2 }, next: "s1_stickers" },
        { id: "s1_start_files", label: "일곱 명의 옛 조사 내용부터 물어 정리한다", effect: { legitimacy: 9, trust: 2, time: -4, fatigue: 3 }, cognition: { inference: 2 }, next: "s1_stickers" },
        { id: "s1_start_one", label: "한 명만 만나고 점심 전에 돌아오자고 한다", effect: { time: 6, capital: 3, trust: -4, fatigue: -2 }, cognition: { risk: 2 }, next: "s1_stickers" },
      ],
    },
    s1_stickers: {
      phase: "SIDE 01 ROUTE",
      title: "별 없는 이름",
      speaker: "반서아",
      place: "반재욱의 차 안, 내부순환로",
      clock: "09:40",
      text: "신호에 걸릴 때마다 서아가 사진 속 이름을 하나씩 메모지에 옮겨 계기판에 붙입니다. 일곱 장이 나란히 붙습니다. '아빠, 여기는 별을 어떻게 줘? 아직 안 만났잖아.' 반재욱이 대답을 찾는 사이 서아가 한 장을 떼어 듭니다. '유정례. 이 아줌마는 세탁소래. 세탁소는 토요일에도 열잖아.' 반재욱의 손이 핸들 위에서 잠깐 멈춥니다. 일곱 명 가운데 가장 오래된 이름, 2012년입니다. '그 사람한테는 제가 닷새밖에 안 썼습니다.' 서아가 메모지를 그의 앞에 붙입니다. '그럼 오늘은 하루 다 써.'",
      question: "일곱 장 가운데 서아가 한 장을 떼어 들었습니다. 어느 이름부터 찾아가겠습니까?",
      memo: ["메모지 일곱 장, 아직 별 없음", "유정례: 2012년, 일곱 명 가운데 가장 오래된 이름", "수유동 세탁소, 토요일에도 영업"],
      triggers: ["affection", "curiosity", "responsibility"],
      choices: [
        { id: "s1_stickers_seoa", label: "서아가 떼어 든 이름부터 찾아간다", effect: { trust: 9, humanCost: -2, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s1_shop" },
        { id: "s1_stickers_oldest", label: "가장 오래된 2012년 이름이라 먼저 간다", effect: { legitimacy: 8, trust: 2, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s1_shop" },
        { id: "s1_stickers_near", label: "길이 막히니 가까운 수유동부터 들른다", effect: { time: 5, capital: 2, trust: -3, fatigue: -1 }, cognition: { risk: 1 }, next: "s1_shop" },
      ],
    },
    s1_shop: {
      phase: "SIDE 01 VISIT",
      title: "정례세탁",
      speaker: "반재욱",
      place: "수유동 시장 골목 '정례세탁'",
      clock: "10:30",
      text: "시장 골목 끝, 김이 서린 유리문에 '정례세탁 -- 수선·드라이'라는 글씨가 붙어 있습니다. 문을 열자 다리미를 든 여자가 고개를 듭니다. 유정례 씨는 반재욱을 한 번에 알아봅니다. '13년 만이네요, 조사역님.' 다리미가 내려가지 않습니다. 반재욱이 고개를 숙이려는데 그녀가 턱으로 작업대를 가리킵니다. '앉을 데 없어요. 토요일은 손이 모자라요. 거기 와이셔츠나 개요.' 서아가 먼저 소매를 걷습니다. 반재욱은 코트를 벗어 빈 옷걸이에 걸었다가, 옷걸이에도 번호표가 달린 것을 보고 다시 벗겨 팔에 걸칩니다.",
      question: "유정례 씨가 반재욱을 알아보고 일부터 시킵니다. 어떻게 하겠습니까?",
      memo: ["유정례(61): 전 KD은행 수유지점 창구 직원", "2012년 해고, 4년 뒤 세탁소 개업", "토요일 오전: 맡긴 옷 찾는 손님이 가장 많음"],
      triggers: ["injustice", "selfAwareness", "trust"],
      choices: [
        { id: "s1_shop_fold", label: "말없이 소매를 걷고 와이셔츠부터 갠다", effect: { trust: 10, humanCost: -3, time: -4, fatigue: 5 }, cognition: { persistence: 2 }, next: "s1_fold" },
        { id: "s1_shop_ask", label: "온 이유를 먼저 밝히고 13년 전 일을 묻는다", effect: { legitimacy: 9, trust: -1, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s1_slip" },
        { id: "s1_shop_wait", label: "손님이 빠질 때까지 차에서 기다린다", effect: { time: 3, trust: -3, fatigue: -2 }, cognition: { risk: 1 }, next: "s1_fold" },
      ],
    },
    s1_fold: {
      phase: "SIDE 01 COUNTER",
      title: "한 장이 빕니다",
      speaker: "반재욱",
      place: "정례세탁 작업대",
      clock: "11:10",
      text: "반재욱이 와이셔츠를 갭니다. 깃을 맞추고, 소매를 같은 폭으로 접고, 다 개면 번호표를 장부와 맞춰 봅니다. 손님 셋이 그가 갠 셔츠를 받아 들며 '사장님, 사람 새로 쓰셨어요?' 하고 묻습니다. 유정례 씨가 '감사 나온 사람이에요' 하고 대답하자 손님들이 웃습니다. 농담인 줄 압니다. 열두 번째 셔츠에서 반재욱의 손이 멈춥니다. '사장님, 번호표가 하나 빕니다. 38번이 없습니다.' 유정례 씨가 다리미를 내려놓습니다. '그 버릇 그대로네요. 그때도 그렇게 말했어요. 하나 빈다고.' 그녀가 앞치마에 손을 닦습니다. '300만 원이 비었죠, 그날.'",
      question: "반재욱의 버릇이 13년 전 그날을 불러냈습니다. 어떻게 하겠습니까?",
      memo: ["반재욱이 갠 셔츠 12장, 번호표 하나 빔", "손님들: '사람 새로 쓰셨어요?'", "2012년: 창구 현금 300만 원 부족"],
      triggers: ["selfAwareness", "affection", "injustice"],
      choices: [
        { id: "s1_fold_finish", label: "남은 셔츠를 다 개고 나서 이야기를 듣는다", effect: { trust: 9, humanCost: -2, time: -4, fatigue: 4 }, cognition: { persistence: 2 }, next: "s1_slip" },
        { id: "s1_fold_ticket", label: "빈 번호표부터 장부에서 찾아 맞춘다", effect: { legitimacy: 8, trust: 1, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s1_slip" },
        { id: "s1_fold_stop", label: "셔츠를 내려놓고 그날 일을 바로 묻는다", effect: { time: 4, legitimacy: 2, trust: -3, fatigue: 1 }, cognition: { risk: 1 }, next: "s1_slip" },
      ],
    },
    s1_slip: {
      phase: "SIDE 01 RECORD",
      title: "사번 한 번",
      speaker: "반재욱",
      place: "정례세탁 작업대",
      clock: "11:40",
      text: "유정례 씨가 다리미 손잡이를 쥔 채 말합니다. 2012년 3월, KD은행 수유지점 3번 창구. 마감 30분 전에 지점장이 단골 고객의 기사에게 현금 300만 원을 먼저 내주라고 했습니다. 전표는 내일 쓰자고. 마감 화면에서 시재(창구와 금고에 지금 있는 현금)가 맞지 않자 지점장이 '일단 맞춰 둬요' 했고, 그녀는 자기 사번으로 '시재 일치'를 눌렀습니다. 전표는 오지 않았고 감사가 왔습니다. 반재욱이 작업대를 내려다봅니다. '그해 대주주 킹스데일 파트너스의 뉴욕 본사가 현금 사고는 닷새 안에 닫으라고 했습니다. 닷새면 사번 하나로 충분했습니다. 지점장 말은 어디에도 없었으니까요.'",
      question: "말로 한 지시는 남지 않았고, 사번 하나가 남았습니다. 무엇을 하겠습니까?",
      memo: ["2012년 3월 수유지점 3번 창구: 현금 300만 원 부족", "지점장: '전표는 내일' '일단 맞춰 둬요' -- 말로만", "마감 화면의 '시재 일치': 유정례 사번", "감사 종결 닷새 -- 뉴욕 본사 분기 검토의 목표"],
      triggers: ["injustice", "system", "responsibility"],
      choices: [
        { id: "s1_slip_now", label: "그 지점장이 지금 어디서 뭘 하는지 묻는다", effect: { legitimacy: 6, trust: 4, time: -3, fatigue: 3 }, cognition: { inference: 1, persistence: 1 }, next: "s1_tuesday" },
        { id: "s1_slip_lunch", label: "이야기를 멈추고 점심부터 같이 먹자고 한다", effect: { trust: 9, humanCost: -3, time: -3, fatigue: -1 }, cognition: { persistence: 1 }, next: "s1_lunch" },
        { id: "s1_slip_target", label: "본사 목표 탓으로 돌리지 말라고 반재욱에게 말한다", effect: { legitimacy: 8, trust: -2, time: -2, fatigue: 3 }, cognition: { reframing: 2 }, next: "s1_tuesday" },
      ],
    },
    s1_lunch: {
      phase: "SIDE 01 LUNCH",
      title: "별 반 개",
      speaker: "반서아",
      place: "정례세탁 작업대",
      clock: "12:20",
      text: "배달 앱으로 시킨 짜장면 셋과 짬뽕 하나가 다리미판 옆에 놓입니다. 서아가 단무지를 나눠 놓다가 유정례 씨를 봅니다. '아줌마는 우리 아빠한테 별 몇 개 줄 거예요?' 반재욱이 젓가락을 멈춥니다. 유정례 씨가 오래 생각합니다. '반 개.' '왜 반 개예요?' '오긴 왔으니까.' 서아가 별 스티커를 반으로 잘라 새 수첩 표지에 붙입니다. 유정례 씨가 휴대전화로 음식값을 보냅니다. '나는 은행 창구에 안 가요. 그날 뒤로 한 번도요. 창구 앞에 서면 손이 떨려서, 다 앱으로 해요.'",
      question: "유정례 씨가 별 반 개를 주고, 창구에 가지 않는다고 말합니다. 어떻게 하겠습니까?",
      memo: ["반재욱의 별점: 반 개 -- '오긴 왔으니까'", "유정례: 2012년 뒤로 은행 창구에 간 적 없음", "점심값은 유정례가 앱으로 보냄"],
      triggers: ["affection", "helplessness", "trust"],
      choices: [
        { id: "s1_lunch_listen", label: "창구 이야기를 더 묻지 않고 끝까지 듣는다", effect: { trust: 9, humanCost: -3, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s1_tuesday" },
        { id: "s1_lunch_star", label: "나머지 반 개는 언제 받는지 서아와 묻는다", effect: { trust: 6, humanCost: -2, time: -2, fatigue: -2 }, cognition: { reframing: 1 }, next: "s1_tuesday" },
        { id: "s1_lunch_app", label: "앱으로 은행 일을 볼 때 막히는 게 없는지 묻는다", effect: { legitimacy: 6, trust: 3, time: -3, fatigue: 2 }, cognition: { inference: 1 }, next: "s1_tuesday" },
      ],
    },
    s1_tuesday: {
      phase: "SIDE 01 TAG",
      title: "화요일 다섯 장",
      speaker: "반재욱",
      place: "정례세탁 옷걸이 줄",
      clock: "13:10",
      text: "반재욱이 갠 셔츠를 걸다가 한 묶음 앞에서 멈춥니다. 비닐 위 꼬리표에 '공태식 · 와이셔츠 5 · 깃 풀 세게 · 화'라고 적혀 있습니다. 그때 수유지점장의 이름입니다. 유정례 씨가 다림질을 멈추지 않고 말합니다. '정년퇴임하고 이 동네 살아요. 4년째 화요일마다 다섯 장씩 맡겨요. 나를 못 알아봐요.' 그녀가 다리미에 물을 뿌립니다. '그래서 깃에 풀을 세게 먹여요. 아주 세게. 목이 좀 불편하라고.' 서아가 웃음을 터뜨렸다가 아빠 얼굴을 보고 입을 막습니다. 반재욱은 꼬리표의 글씨를 오래 봅니다. 13년 전 그는 이 이름을 한 번도 적지 않았습니다.",
      question: "13년 전 지시한 사람이 화요일마다 이 세탁소에 옵니다. 무엇을 하겠습니까?",
      memo: ["꼬리표: 공태식, 와이셔츠 5, 깃 풀 세게, 화요일", "공태식: 2012년 수유지점장, 징계 없이 정년퇴임", "4년째 단골 -- 유정례를 알아보지 못함"],
      triggers: ["injustice", "revenge", "selfAwareness"],
      choices: [
        { id: "s1_tuesday_meet", label: "화요일에 다시 와서 공태식을 직접 만난다", effect: { trust: 5, legitimacy: 4, humanCost: 2, time: -4, fatigue: 5 }, cognition: { persistence: 2 }, next: "s1_call" },
        { id: "s1_tuesday_proof", label: "그 지시가 남은 기록이 아직 있는지 찾는다", effect: { legitimacy: 10, trust: 2, time: -5, fatigue: 4 }, cognition: { inference: 2 }, next: "s1_record" },
        { id: "s1_tuesday_leave", label: "꼬리표는 못 본 걸로 하고 다림질을 돕는다", effect: { time: 4, trust: 3, legitimacy: -5, humanCost: 1, fatigue: -1 }, cognition: { risk: 1 }, next: "s1_letter" },
      ],
    },
    s1_call: {
      phase: "SIDE 01 CALL",
      title: "트럭 한 대",
      speaker: "정태오",
      place: "정례세탁 앞 골목",
      clock: "13:40",
      text: "골목에 나온 반재욱의 휴대전화가 울립니다. 정태오입니다. 화요일 이야기를 듣자 수화기 너머로 꼬치 뒤집는 소리가 멈춥니다. '그 사람 화요일에 와요? 그럼 내가 그날 세탁소 앞에 트럭을 댈게요. 떡꼬치를 공짜로 돌리면 골목에 줄이 서요. 그 사람도 줄 서야 들어가요.' 반재욱이 '그건 영업 방해입니다' 하고 대답하자 정태오가 웃습니다. '조사역님, 우리 지점장은 퇴임식 때 꽃다발을 두 개 받았어요. 줄 한 번 서는 게 뭐 어때서요.' 그가 목소리를 낮춥니다. '근데 그분한테 먼저 물어봐요. 만나고 싶은지. 나는 그 사람 얼굴 보고 싶지 않았거든요.'",
      question: "정태오가 트럭을 대겠다고 하면서, 만날지는 본인에게 먼저 물으라고 합니다. 어떻게 하겠습니까?",
      memo: ["정태오: 화요일에 세탁소 앞에 트럭을 대겠다고 함", "구로지점장: 징계 없이 정년퇴임, 꽃다발 2개", "'만나고 싶은지 먼저 물어봐요'"],
      triggers: ["affection", "revenge", "trust"],
      choices: [
        { id: "s1_call_ask", label: "공태식을 만날지 유정례 씨에게 먼저 묻는다", effect: { trust: 10, humanCost: -3, time: -3, fatigue: 3 }, cognition: { persistence: 2 }, next: "s1_letter" },
        { id: "s1_call_truck", label: "화요일 트럭 계획에 같이 끼겠다고 한다", effect: { trust: 5, capital: -2, legitimacy: -3, time: -2, fatigue: 2 }, cognition: { risk: 2 }, next: "s1_letter" },
        { id: "s1_call_letter", label: "공태식에게 사실을 묻는 편지를 보내기로 한다", effect: { legitimacy: 9, trust: -1, time: -4, fatigue: 3 }, cognition: { inference: 2 }, next: "s1_letter" },
      ],
    },
    s1_record: {
      phase: "SIDE 01 DRAWER",
      title: "충전기 상자",
      speaker: "반서아",
      place: "정례세탁 계산대",
      clock: "13:40",
      text: "유정례 씨가 계산대 서랍에서 2012년에 쓰던 휴대전화를 꺼냅니다. 액정 모서리가 깨졌고 배터리는 오래전에 죽었습니다. 은행 쪽 기록은 보존연한(기록을 몇 년 보관하고 버릴지 정해 둔 기간)이 지나 남지 않았을 것입니다. 맞는 충전기가 없습니다. 서아가 손님들이 두고 간 물건 상자를 뒤져 옛날 충전기 하나를 들어 올립니다. '이거 맞아? 끝이 납작해.' 화면이 켜지고 문자함이 열립니다. 2012년 3월, 지점장 번호. '정례 씨, 기사님 가시면 마감 먼저 맞춰 둬요. 전표는 내일 내가 할게.' 반재욱이 그 문자를 오래 봅니다. 유정례 씨가 말합니다. '그때 안 보여 드렸어요. 조사역님이 안 물었잖아요.'",
      question: "13년 전 아무도 묻지 않은 문자가 화면에 떠 있습니다. 어떻게 하겠습니까?",
      memo: ["2012년 휴대전화: 손님이 두고 간 충전기로 켜짐", "지점장 문자: '마감 먼저 맞춰 둬요. 전표는 내일 내가'", "은행 쪽 기록: 보존연한이 지나 남지 않았을 것", "'조사역님이 안 물었잖아요'"],
      triggers: ["curiosity", "selfAwareness", "injustice"],
      choices: [
        { id: "s1_record_photo", label: "문자 화면을 날짜가 보이게 사진으로 남긴다", effect: { legitimacy: 10, trust: 2, time: -3, fatigue: 2 }, cognition: { inference: 2 }, next: "s1_letter" },
        { id: "s1_record_hers", label: "문자를 어떻게 할지 유정례 씨에게 맡긴다", effect: { trust: 10, humanCost: -3, time: -2, fatigue: 2 }, cognition: { persistence: 1, reframing: 1 }, next: "s1_letter" },
        { id: "s1_record_step", label: "반재욱이 먼저 말하도록 한 걸음 물러선다", effect: { trust: 6, humanCost: -2, time: -1, fatigue: -1 }, cognition: { reframing: 2 }, next: "s1_letter" },
      ],
    },
    s1_letter: {
      phase: "SIDE 01 LETTER",
      title: "언니가 믿은 종이",
      speaker: "반재욱",
      place: "정례세탁 작업대",
      clock: "15:00",
      text: "해가 기울자 손님이 끊깁니다. 유정례 씨가 앞치마 주머니에서 접힌 종이 한 장을 꺼냅니다. 2012년에 등기 우편으로 온 해고 통지서입니다. 접힌 자리가 닳아 글자가 끊겨 있습니다. '이걸 우리 언니가 먼저 받았어요. 내가 아니라고 해도 언니는 이 종이를 믿었어요. 은행이 그렇다는데 뭐, 하고요.' 그녀가 종이를 다시 접습니다. '회사 종이 한 장이 내 말보다 셌어요.' 서아가 반재욱의 소매를 잡습니다. 유정례 씨가 반재욱을 봅니다. '조사역님은 그때 나를 뭐라고 적었어요?' 반재욱이 대답합니다. '300만 원 부족, 마감 확인자 유정례. 그렇게 적었습니다. 지점장 이름은 적지 않았습니다.'",
      question: "회사 종이 한 장이 13년 동안 그녀의 말보다 셌습니다. 어떻게 하겠습니까?",
      memo: ["2012년 해고 통지서: 등기 우편, 언니가 먼저 받음", "'회사 종이 한 장이 내 말보다 셌어요'", "반재욱이 적은 줄: 300만 원 부족, 마감 확인자"],
      triggers: ["helplessness", "injustice", "responsibility"],
      choices: [
        { id: "s1_letter_sister", label: "언니에게 사실을 알리는 일을 돕겠다고 한다", effect: { trust: 10, humanCost: -4, time: -4, fatigue: 4 }, cognition: { persistence: 2 }, next: "s1_aftershock" },
        { id: "s1_letter_line", label: "그 줄에 빠진 지점장의 말을 하나씩 짚는다", effect: { legitimacy: 10, trust: 1, time: -3, fatigue: 3 }, cognition: { inference: 2 }, next: "s1_aftershock" },
        { id: "s1_letter_quiet", label: "아무 말 없이 통지서를 접어 돌려준다", effect: { time: 3, trust: 3, legitimacy: -3, fatigue: -2 }, cognition: { risk: 1 }, next: "s1_aftershock" },
      ],
    },
    s1_aftershock: {
      phase: "SIDE 01 AFTERMATH",
      title: "첫 장",
      speaker: "반재욱",
      place: "정례세탁 앞",
      clock: "16:30, 해 질 무렵",
      text: "셔터를 반쯤 내린 세탁소 앞에서 반재욱이 새 수첩을 꺼냅니다. 표지에 별 스티커가 붙어 있고, 속은 아직 첫 장부터 비어 있습니다. 20년 동안 그는 사람을 내보낸 날 이름을 적었습니다. 오늘은 아무도 내보내지 않았습니다. 그가 펜 뚜껑을 열었다가 닫습니다. '이 수첩 첫 줄을 뭘로 할지 모르겠습니다.' 유정례 씨가 셔터 손잡이를 쥔 채 서 있습니다. 서아는 메모지 한 장을 들고 기다립니다. 남은 여섯 장은 아직 차 계기판에 붙어 있습니다. 반재욱이 수첩을 당신 쪽으로 내밉니다. '같이 정해 주세요.'",
      question: "새 수첩의 첫 장이 비어 있습니다. 첫 줄을 어떻게 하겠습니까?",
      memo: ["새 수첩: 첫 장부터 빈칸", "메모지 일곱 장 가운데 여섯 장이 남음", "고른 결말은 이 기기에만 남음"],
      triggers: ["choice", "responsibility", "trust"],
      choices: [
        { id: "s1_after_hers", label: "첫 장을 유정례 씨에게 내밀어 직접 쓰게 한다", effect: { trust: 6, humanCost: -2 }, cognition: { persistence: 2 }, next: "s1_result" },
        { id: "s1_after_order", label: "지점장의 말과 날짜를 그녀 이름 위에 적는다", effect: { legitimacy: 6, trust: 2 }, cognition: { inference: 2 }, next: "s1_result" },
        { id: "s1_after_blank", label: "첫 장은 비워 두고 다음 메모지로 간다", effect: { time: 3, trust: 2 }, cognition: { reframing: 1 }, next: "s1_result" },
      ],
    },
  },
  outcomes: {
    s1_after_hers: {
      title: "그녀의 글씨",
      text: "유정례 씨가 펜을 받아 첫 장에 씁니다. '유정례. 2012년 3월, 시킨 대로 했음. 이 줄은 내가 씀.' 글씨가 조금 떨립니다. 창구 앞에서만큼은 아닙니다. 반재욱은 그 줄 아래에 아무것도 덧붙이지 않습니다. 20년 만에 처음으로, 그의 수첩 첫 줄이 남의 글씨입니다. 서아가 그 옆에 별 스티커를 붙입니다. 잘라 쓰지 않은 온전한 한 장입니다.",
    },
    s1_after_order: {
      title: "위에 적은 이름",
      text: "반재욱이 첫 줄에 지점장의 이름을 적습니다. '공태식. 2012년 3월, 마감 30분 전, 말로 지시함.' 둘째 줄에 유정례 씨의 이름을 씁니다. '시킨 대로 사번을 눌렀음.' 20년 만에 처음으로 시킨 사람이 위에 있습니다. 유정례 씨가 두 줄을 오래 읽다가 셔터를 끝까지 내립니다. '화요일에 그 사람 깃에는 풀을 조금만 먹일게요. 이제 적혔으니까.'",
    },
    s1_after_blank: {
      title: "빈 첫 장",
      text: "당신이 수첩을 덮어 반재욱에게 돌려줍니다. 유정례 씨가 고개를 끄덕입니다. '나는 어디 안 적혀도 돼요. 오늘 왔으니까.' 반재욱이 빈 수첩을 코트 안주머니에 넣습니다. 서아가 들고 있던 메모지를 세탁소 유리문 안쪽에 붙이고 별 하나를 그려 넣습니다. 차에 오르자 계기판에 여섯 장이 남아 있습니다. 반재욱이 시동을 겁니다. '다음 토요일에도 이유는 없습니다.'",
    },
  },
};
