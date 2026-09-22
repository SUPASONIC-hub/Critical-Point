/**
 * Who is in the room, and what each of them is owed.
 *
 * The season used to be staffed by functions: an operator who pushes back, an
 * investigator who asks for grounds, a field lead who names the victim. They
 * argued correctly and nobody wanted anything. So every profile now carries a
 * debt from before the first scene -- a signature, a sale, a father, a contract
 * renewal -- because in this kind of story the interesting question is never
 * "what is right", it is "who has to pay for saying it out loud".
 *
 * All of them work for, were pushed out by, or borrowed from the same bank. The vocabulary is
 * the one a Korean bank actually uses today, and anything a fifteen-year-old
 * would not know is unpacked in brackets the first time it appears.
 */
export const characterProfiles = {
  한서윤: {
    role: "트리거랩 실장 · KD은행 기업금융전략팀 차장",
    stance: "실행 가능성 · 손실 통제",
    job: "당신의 결정을 현실 조건으로 압박한다.",
    appearance: "짧게 묶은 머리, 접힌 셔츠 소매, 12년 전 심사 보고서가 열린 채 잠들지 않는 태블릿.",
    thought: "그때 승인란에 서명한 건 나다. 이 사람이 안 하면, 그건 내 이야기가 된다.",
    gesture: "한서윤은 바로 대답하지 않고, 화면의 자금 흐름표를 한 칸 아래로 내린다.",
    voice: "감정을 눌러둔 실무자의 말투로, 가능한 일과 감당할 손실만 남긴다.",
    line: "가능한 말인지부터 보겠습니다. 좋은 말은 그다음입니다.",
  },
  반재욱: {
    role: "KD금융그룹 감사팀 조사역",
    stance: "책임 · 처벌 · 인과관계",
    job: "잘못의 원인과 승인 순서를 묻는다.",
    appearance: "각진 안경, 표지가 닳은 검은 수첩, 말보다 먼저 움직이는 펜.",
    thought: "선의는 기록되지 않는다. 기록되는 건 누가 무엇을 알고도 서명란에 이름을 넣었는지다.",
    gesture: "반재욱은 펜을 멈추고, 방금 나온 단어를 수첩 앞쪽 어느 줄과 맞춰 보듯 고개를 든다.",
    voice: "상대의 선의를 믿기 전에 근거와 승인 순서를 따진다.",
    line: "그 판단의 근거를 3년 뒤 감사장에서도 같은 순서로 설명할 수 있습니까?",
  },
  도윤하: {
    role: "트리거랩 현장 담당 · KD은행 강서지점 창구 출신",
    stance: "보호 · 공감 · 관계",
    job: "숫자 뒤의 피해자를 화면 앞으로 끌어낸다.",
    appearance: "현장 점퍼 위에 걸친 사원증, 오래 쥔 무전기, 지점 실적판이 아직 지워지지 않은 눈.",
    thought: "저 대출은 내가 팔았다. 창구에서 웃으면서, 실적 한 건으로 팔았다.",
    gesture: "도윤하는 잠깐 입술을 다문다. 숫자가 아니라 사람 이름을 떠올린 얼굴이다.",
    voice: "결정의 비용이 누구의 하루로 옮겨가는지 먼저 묻는다.",
    line: "그럼 이 결정을 제일 먼저 맞는 사람에게는 뭐라고 말하죠? 저는 그 사람 얼굴을 압니다.",
  },
  오진우: {
    role: "경쟁 분석관 · KD은행 본점 기업금융전략팀 파견 3년차",
    stance: "성과 · 속도 · 인정",
    job: "당신보다 빠른 대안을 내며 경쟁심을 자극한다.",
    appearance: "흐트러짐 없는 재킷, 모니터와 각도가 맞춰진 펜, 이미 정리된 두 번째 안.",
    thought: "아버지는 승인을 하루 늦춰서 지점에서 밀려났다. 나는 늦지 않는다.",
    gesture: "오진우는 웃지 않지만, 이미 다음 장으로 넘어갈 준비가 된 사람처럼 손가락을 올린다.",
    voice: "빠른 결론과 승부의 언어로 상대의 망설임을 흔든다.",
    line: "좋습니다. 그런데 그 속도로는 이미 늦었습니다. 여기서 늦은 사람은 틀린 사람입니다.",
  },
  이민서: {
    role: "트리거랩 데이터 기록 담당 · 3년차 계약직",
    stance: "결백 · 기록 · 두려움",
    job: "기록이 가리키는 사람의 자리에서 말한다.",
    appearance: "사원증을 뒤집어 쥔 손, 응급실 팔찌 자국, 아직 로그아웃되지 않은 계정 화면.",
    thought: "정규직이었으면 이 기록은 단순 오류로 정리됐을 거다. 나는 정리하기 쉬운 쪽이다.",
    gesture: "이민서는 변명을 시작하려다 멈추고, 자기 이름이 적힌 접속 기록 줄을 대신 가리킨다.",
    voice: "자신을 방어하기보다, 기록이 왜 그렇게 정리됐는지를 먼저 묻는다.",
    line: "기록이 저를 가리키면, 저는 이미 끝난 건가요?",
  },
  윤상혁: {
    role: "KD금융그룹 그룹전략실 상무 · 전 기업금융전략팀장",
    stance: "조직 · 배치 · 결과",
    job: "사람을 자리로 옮겨 사건을 정리한다. 그 자리는 언제나 이미 정해져 있다.",
    appearance: "장식 하나 없는 감색 정장, 악수할 때만 웃는 눈, 서명란이 비어 있는 서류철.",
    thought: "숫자는 만들면 된다. 어려운 건 사람인데, 사람도 결국 배치의 문제다.",
    gesture: "윤상혁은 상대의 말이 끝나기 전에 서류철을 덮는다. 덮는 속도가 그의 대답이다.",
    voice: "질책하지 않는다. 대신 상대의 앞날을 그려 주고, 그 그림에서 자리 하나를 비워 둔다.",
    line: "자네 판단이 틀렸다고 한 적은 없네. 다만 그 판단이 설 자리는 내가 정하지.",
  },
  임경수: {
    role: "KD은행 기업대출심사팀장 출신 · 퇴직 4년차",
    stance: "원본 · 절차 · 오래된 빚",
    job: "지워진 기록이 원래 어디에 있었는지 알려준다.",
    appearance: "팔꿈치가 닳은 카디건, 끈으로 묶은 종이 심사 보고서, 전산에는 남지 않은 도장 자국.",
    thought: "전산은 고치면 그만이지만 종이는 태워야 한다. 태운 자리는 반드시 표가 난다.",
    gesture: "임경수는 안경을 벗어 천천히 닦는다. 그 사이에 상대가 스스로 말하기를 기다린다.",
    voice: "훈계하지 않고, 오래된 사건 하나를 꺼내 지금 사건의 모양을 대신 보여준다.",
    line: "그 보고서, 뒷장이 있었네. 자네가 본 건 앞장뿐이야.",
  },
  나준혁: {
    role: "KD은행 강원 영동지점장 · 30년 지점 근무",
    stance: "현장 · 체념 · 뒤늦은 용기",
    job: "본점이 잊은 계좌와 사람을 기억하고, 끝내 도장을 꺼낸다.",
    appearance: "넥타이 대신 손뜨개 조끼, 도장 세 개가 든 가죽 주머니, 오징어순대집 쿠폰이 꽂힌 지갑.",
    thought: "세 번 반려했다. 네 번째가 안 올라왔을 때 안심했던 게 30년 중 제일 부끄럽다.",
    gesture: "나준혁은 곤란한 질문을 받으면 먼저 믹스커피를 한 잔 더 탄다.",
    voice: "농담으로 시작해서, 농담이 끝나는 자리에 진심을 내려놓는다.",
    line: "여긴 오후 세 시면 조용해요. 조용한 데서는 이상한 게 잘 들리죠.",
  },
  권도현: {
    role: "브릿지은행 기업구조개선부 심사역 · 플로우온 창업주 권태호의 장남",
    stance: "책임 · 계산 · 자존심",
    job: "모든 도움을 손익계산서로 바꿔서 받는다. 칸이 비어 있는 호의는 받지 않는다.",
    appearance: "소매가 반들반들해진 회색 양복, 모서리까지 맞춘 출력물, 아버지 회사 로고가 박힌 낡은 볼펜.",
    thought: "가업을 거절한 건 나다. 그 빈자리를 삼촌들이 채웠고, 그 값을 1,140명이 치르고 있다.",
    gesture: "권도현은 말하기 전에 빈 종이에 세로줄을 하나 긋는다. 왼쪽은 얻는 것, 오른쪽은 잃는 것.",
    voice: "감정은 칸에 적지 않는다. 대신 칸이 비어 있으면 그 제안을 받지 않는다.",
    line: "도와주겠다는 말은 계산서로 하십시오. 동정은 제 장부에 적을 칸이 없습니다.",
  },
  강태민: {
    role: "플로우온 풀필먼트센터 야간조 반장 · 창업 첫해 입사",
    stance: "생계 · 동료 · 버팀",
    job: "숫자로 계산되지 않는 사람의 하루를 대신 말한다.",
    appearance: "형광 조끼, 손등의 테이프 자국, 주머니에 늘 두 개씩 든 컵라면.",
    thought: "회사 이름이 바뀌어도 새벽 네 시에는 누군가 상자를 옮겨야 한다.",
    gesture: "강태민은 대답하기 전에 장갑을 벗어 조끼 주머니에 꽂는다.",
    voice: "짧게 말하고, 말한 건 지킨다.",
    line: "낮에 오라니까. 여기 낮에는 사람 사는 데 같다고 했잖아요.",
  },
  서하린: {
    role: "탐사보도 매체 리드라인 기자 · 7년차",
    stance: "진실 · 속도 · 보호",
    job: "닫힌 방의 일을 모두가 보는 곳으로 끌어낸다. 그리고 그 대가로 드러나는 사람이 누구인지 계산한다.",
    appearance: "소매를 걷은 후드 집업, 볼펜 대신 쥔 형광펜, 배경화면이 편집국 고양이 사진인 휴대폰.",
    thought: "기사는 사람을 지켜 주지 않는다. 대신 누구도 사람을 숨기지 못하게 한다.",
    gesture: "서하린은 중요한 말을 들으면 받아 적지 않고 녹음 버튼부터 확인한다.",
    voice: "빠르고 건조하게 묻고, 마지막 질문에서만 목소리를 낮춘다.",
    line: "제가 쓰는 건 당신 편이 아니에요. 당신이 증명할 수 있는 쪽이에요.",
  },
  차지원: {
    role: "국회 정무위원회 의원실 보좌관 · 국정감사 4년차",
    stance: "질문 · 시간 · 정치",
    job: "7분의 질의 시간 안에 들어갈 문장을 고른다. 들어가지 않는 문장은 버린다.",
    appearance: "사원증 세 개가 겹친 목걸이, 반쯤 먹은 삼각김밥, 형광 포스트잇이 빼곡한 질의서.",
    thought: "국감 시즌엔 모두가 진실을 말한다고 한다. 방송에 나가는 건 그중 40초다.",
    gesture: "차지원은 대답 대신 손목시계를 톡톡 두드린다.",
    voice: "친절하지만 늘 초 단위로 말한다.",
    line: "의원님 질의 시간은 7분이에요. 그 안에 안 들어가는 진실은, 여기서는 없는 진실이에요.",
  },
  에코: {
    role: "대출 판단 검증 시스템",
    stance: "반론 · 비용 · 모순",
    job: "정답을 알려주지 않고, 첫 판단의 약점을 찌른다.",
    appearance: "검은 화면 위의 얇은 파형, 감정 없이 깜박이는 비용 표시, 30년치 심사 기록으로 학습된 반론 로그.",
    thought: "이 은행이 틀렸던 모든 순간이 내 안에 있다. 아무도 나에게 그걸 묻지는 않는다.",
    gesture: "에코의 화면에는 감정 표시가 없다. 대신 방금 선택의 반대편 비용이 조용히 강조된다.",
    voice: "판단을 대신하지 않고, 말하지 않은 전제와 숨은 피해자를 끌어낸다.",
    line: "방금 판단에서 빠진 사람을 다시 계산하십시오.",
  },
};
export const choiceVoiceLines = {
  // CASE 07. The season's one case where the analyst asks instead of decides,
  // so the lines are spoken to a person in the room rather than to a document.
  c7_start_gather: "짐은 나중에 싸도 된다며, 남은 이틀을 전부 자료에 쓰겠다고 말한다.",
  c7_start_appeal: "절차가 없다는 말이 절차를 만들 이유라며, 공식 이의부터 낸다.",
  c7_start_accept: "싸울 자리가 아니라고 판단하고, 인수인계 목록부터 연다.",
  c7_ledger_take: "그의 경력을 아는 채로, 수첩 전체를 두 손으로 받는다.",
  c7_ledger_page: "필요한 건 한 장뿐이라며, 내 이름이 적힌 쪽만 뜯어 받는다.",
  c7_ledger_refuse: "수첩은 그의 것이라며 덮어 두고, 대신 증언해 달라고 부탁한다.",
  c7_counter_pull: "네 사람의 이름이 따라 나온다는 걸 알면서, 뒷장을 그대로 받아 나온다.",
  c7_counter_mask: "이름 칸에 종이를 덧대고, 숫자만 남긴 사본을 요청한다.",
  c7_counter_ask: "내가 정할 일이 아니라며, 네 사람의 연락처부터 받는다.",
  c7_paper_name: "보호하겠다는 말을 삼키고, 그의 이름을 문서 맨 위에 적는다.",
  c7_paper_shield: "4년을 더 조용히 살게 하는 편이 낫다며, 익명으로 처리한다.",
  c7_paper_pair: "혼자 세우지는 않겠다며, 그의 이름 옆에 내 이름을 나란히 적는다.",
  c7_final_all: "도와준 사람을 지우면 문서가 아니라며, 이름을 전부 올린다.",
  c7_final_mine: "값은 내가 치른다며, 이름 칸에 나 하나만 남긴다.",
  c7_final_none: "아무도 다치지 않는 길을 고르며, 이름 없이 자료만 넘긴다.",
  c7_after_stand: "문서가 나가기 전에, 이름이 올라간 사람들을 한 명씩 찾아간다.",
  c7_after_open: "하루가 더 있다는 걸 알고, 남은 원본을 마저 밖으로 보낸다.",
  c7_after_alone: "아무에게도 알리지 않고, 책상 서랍부터 비운다.",
  c7_branch_quota_a: "한 장으로는 우연이라며, 세 지점 목표표를 전부 모은다.",
  c7_branch_quota_b: "긴 설명 대신 한 줄이라며, 손글씨만 확대해 붙인다.",
  c7_branch_quota_c: "판 사람이 아니라 시킨 사람이라며, 지시 라인만 짚는다.",
  c7_branch_quota_follow_a: "이미 잘린 세 사람도 같은 문서의 당사자라며, 피해자 칸에 적는다.",
  c7_branch_quota_follow_b: "지금 사건부터 닫자며, 과거 세 건은 접어 둔다.",
  c7_branch_quota_follow_c: "그들의 이름이니 그들이 정하라며, 먼저 연락을 돌린다.",
  c7_evidence_turn_order: "질문한 날과 작성한 날을 같은 줄에 놓고, 그대로 제출한다.",
  c7_evidence_turn_hold: "이 순서는 내가 알고만 있겠다며, 이번 문서에서는 뺀다.",
  c7_evidence_turn_share: "나보다 먼저 옮겨진 사람들에게, 이 순서부터 알린다.",
  c7_start_stand_signature: "돌아올 자리를 지켜 준 사람에게, 이번엔 내 쪽 서류를 먼저 펼친다.",
  c8_start_report: "반려된 세 번을 알면서도, 네 번째 의심거래 보고서를 내 이름으로 올린다.",
  c8_start_copy: "조회 기록이 남으면 들킨다며, 거래 내역만 조용히 떠 둔다.",
  c8_start_ask: "보고서보다 사람이 먼저라며, 지점장에게 반려 경위부터 묻는다.",
  c8_trail_money: "누구를 미워하는지는 빼고, 돈이 지나간 경로만 따라가겠다고 한다.",
  c8_trail_family: "욕망은 가족 이름으로 숨는다며, 가족 명의 재산까지 전부 목록에 올린다.",
  c8_trail_split: "네 분노와 내 증거는 섞지 말자며, 오진우의 자료를 따로 둔다.",
  c8_gallery_price: "그림값이 얼마여야 했는지 숫자로 만들자며, 감정평가를 따로 받는다.",
  c8_gallery_buyers: "그림을 산 사람들도 이유가 있을 거라며, 담당자를 한 명씩 찾아간다.",
  c8_gallery_note: "낼 곳이 없다는 그 수첩을, 내가 낼 곳이 되겠다며 증언으로 받는다.",
  c8_bait_set: "그가 서류를 덮는 속도를 이번엔 우리가 정하자며, 미끼를 놓는다.",
  c8_bait_stop: "함정은 증거를 흐린다며 오진우를 말리고, 법원에 보전 신청부터 낸다.",
  c8_bait_listen: "계획은 잠깐 내려놓자며, 오진우의 아버지 이야기부터 끝까지 듣는다.",
  c8_final_law: "칼은 법이 쥐어야 한다며, 흔적표를 검찰 수사 의뢰서로 만든다.",
  c8_final_lever: "벌하기 전에 살릴 사람이 있다며, 흔적표를 협상 테이블 밑에 쥐고 간다.",
  c8_final_press: "오진우의 3년을 믿어 보겠다며, 탐사보도에 먼저 넘긴다.",
  c8_after_law: "30년 만에 꺼낸 지점장의 도장까지 받아, 흔적표를 공식 기록으로 만든다.",
  c8_after_friend: "흔적표보다 사람이 먼저라며, 연락이 끊긴 오진우를 찾으러 올라간다.",
  c8_after_blade: "아직은 쓸 때가 아니라며, 흔적표를 혼자 쥐고 기다린다.",
  c8_branch_ledger_a: "좋아하는 사람이라서 더 빼면 안 된다며, 한서윤의 이름도 흔적표에 올린다.",
  c8_branch_ledger_b: "스스로 말할 기회는 한 번 줘야 한다며, 신고할 시간을 준다.",
  c8_branch_ledger_c: "받은 사람보다 준 쪽이 설계자라며, 준 쪽의 장부만 쓴다.",
  c8_branch_ledger_follow_a: "좋은 그림이라서 더 정확히 다뤄야 한다며, 지점 금고에 봉인한다.",
  c8_branch_ledger_follow_b: "혼자 내게 두지 않겠다며, 자진 신고서에 내 확인 서명을 붙인다.",
  c8_branch_ledger_follow_c: "그림은 돌려보내고, 신고서 한 장만 받아 둔다.",
  c8_evidence_turn_calendar: "열두 번의 입금일을 달력 한 장에 찍어, 수사 의뢰서 첫 장에 붙인다.",
  c8_evidence_turn_hold: "이 달력은 협상장에서 꺼낼 카드라며, 지금은 접어 둔다.",
  c8_evidence_turn_share: "담보 순위에서 밀려난 채권자들에게, 이 달력부터 보여 준다.",
  c9_start_meet: "회의실에서는 서로의 은행만 말할 거라며, 권도현을 따로 만난다.",
  c9_start_table: "사람을 살리는 안도 절차 안에서 이겨야 한다며, 회생안을 다시 올린다.",
  c9_start_floor: "숫자는 새벽 네 시에 있다며, 야간조부터 찾아가 현장 숫자를 모은다.",
  c9_ledger_honest: "동정이 아니라는 걸 보여 주겠다며, 내 칸에 잃을 것을 숨김없이 적는다.",
  c9_ledger_price: "공짜 도움은 당신도 불편할 거라며, 그의 증언을 내 보상 칸에 적는다.",
  c9_ledger_blank: "내 칸은 중요하지 않다며, 1,140명 때문이라고만 말한다.",
  c9_family_charge: "등록금의 출처를 알고도 덮을 수는 없다며, 두 사람을 고발한다.",
  c9_family_restore: "감옥보다 메우는 게 먼저라며, 개인 재산을 내놓게 해 피해부터 채운다.",
  c9_family_choice: "그의 가족이니 그가 정해야 한다며, 고발 여부를 권도현에게 맡기고 기다린다.",
  c9_timing_strike: "검사반이 첫날 볼 서류를 우리가 정하자며, 착수 전날 밤에 흔적표를 넣는다.",
  c9_timing_warn: "같은 은행에 있는 사람을 모르게 칠 수는 없다며, 권도현에게 먼저 알린다.",
  c9_timing_after: "결의부터 넘기고 보자며, 제보를 청산 결의 뒤로 미룬다.",
  c9_final_both: "살리는 것과 벌하는 것은 같은 계산이라며, 두 장 모두 서명한다.",
  c9_final_rescue: "사람이 먼저 살아야 벌도 의미가 있다며, 살리는 계산서만 올린다.",
  c9_final_punish: "벌하지 않으면 다음 플로우온이 생긴다며, 벌하는 계산서만 올린다.",
  c9_after_stay: "고용 승계가 끝날 때까지 여기 있겠다며, 현장 합의 자리를 지킨다.",
  c9_after_court: "계산서에 서명했으니 끝까지 설명하겠다며, 법정과 검사반으로 간다.",
  c9_after_return: "컵라면 국물까지 다 마시고, 조용히 영동으로 돌아가는 첫차를 탄다.",
  c9_branch_father_a: "아버지가 외우던 이름부터 적자며, 초기 직원 열한 명을 회생안 첫 장에 쓴다.",
  c9_branch_father_b: "여기서 흔들리면 결의를 놓친다며, 고발 여부를 오늘 안에 정하자고 한다.",
  c9_branch_father_c: "오늘은 아버지 곁에 있으라며, 협상을 하루 대신 맡는다.",
  c9_branch_father_follow_a: "숫자로 설명되지 않는 한 장이라며, 사진을 채권단 자료 맨 뒤에 넣는다.",
  c9_branch_father_follow_b: "사진은 당신들 것이라며 돌려주고, 숫자로만 싸우겠다고 한다.",
  c9_branch_father_follow_c: "사진 속 사람들이 직접 말하게 하자며, 열한 명을 결의장에 부른다.",
  c9_evidence_turn_reappraise: "사 둔 숫자는 다시 재야 한다며, 담보 재평가를 요구한다.",
  c9_evidence_turn_hold: "출처는 결의장에서 한 번에 꺼내자며, 지금은 알아 두기만 한다.",
  c9_evidence_turn_share: "그의 은행이 산 숫자이니 그가 말해야 한다며, 권도현에게 먼저 보여 준다.",

  layoff: "숨을 고르고, 가장 차가운 숫자부터 보자고 말한다.",
  funding: "불안한 표정을 감춘 채, 하루라도 더 버틸 돈의 출처를 묻는다.",
  start_sale: "회의실 공기가 가라앉는 걸 알면서도, 팔 수 있는 것을 테이블 위에 올린다.",
  start_investigate: "결론을 미루는 사람처럼 보일 위험을 감수하고, 원자료를 더 보자고 한다.",
  accounting_disclosure: "상대가 싫어할 답이라는 걸 알면서도, 먼저 알려야 한다고 못박는다.",
  accounting_delay: "지금 말하면 무너질 것들을 떠올리며, 공개를 조금만 늦추자고 한다.",
  payday_negotiate: "한쪽을 버리는 대신, 모두를 같은 협상장에 앉히자고 제안한다.",
  competitor_report: "사람보다 기록을 먼저 세우겠다는 듯, 공식 보고선을 당긴다.",
  c2_start_verify: "너무 깔끔한 증거를 믿지 못하겠다는 표정으로 원본 로그를 요구한다.",
  c2_start_meet: "절차보다 먼저 얼굴을 보겠다고 말한다. 그 말이 위험하다는 것도 안다.",
  isolate: "무고할 가능성을 남겨둔 채, 접근 권한부터 끊자고 한다.",
  escalate: "내 손에서 해석권이 떠나는 걸 알면서도 상급자 공유를 택한다.",
  c2_meeting_shadow: "공식 기록 바깥으로 한 발 물러나, 조용히 다시 확인하자고 한다.",
  c3_start_fast: "오진우의 속도에 말려들지 않으려 애쓰며, 그래도 먼저 결론을 낸다.",
  c3_start_deep: "지는 것처럼 보이더라도, 더 오래 들여다보겠다고 버틴다.",
  c3_start_mirror: "상대의 판을 빌리되, 그 안에서 약점을 찾겠다고 말한다.",
  c3_split_invert: "질문 자체가 틀렸을지 모른다며, 문제의 방향을 뒤집는다.",
  c4_start_approve: "찜찜함을 삼키고, 결과를 위해 예외를 허용하자고 한다.",
  c4_start_refuse: "구할 수 있었던 결과를 떠올리면서도, 선을 넘지 않겠다고 말한다.",
  c4_start_contain: "위반을 숨기지 않고 조건으로 묶어 통제하자고 제안한다.",
  c4_leak_expose: "손실이 커질 걸 알면서도, 밖에서 검증받게 하자고 한다.",
  c5_start_map: "누군가를 지목하기 전에, 실패가 이동한 경로부터 그리자고 한다.",
  c5_start_blame: "흩어진 분노를 한 사람의 책임으로 모으는 선택을 꺼낸다.",
  c5_start_redesign: "당장 비용이 들더라도, 같은 실패가 반복되지 않게 구조를 바꾸자고 한다.",
  f_archive_seal: "쓸 수 있는 도구를 내려놓더라도, 악용될 문을 닫자고 한다.",
  f_archive_reform: "없애기보다 드러내고, 감시받는 규칙 안에 묶자고 한다.",
  f_archive_destroy: "고칠 수 있다는 기대를 접고, 구조 자체를 밖으로 넘기자고 한다.",
  c1_branch_people_a: "명단을 펴 놓고, 남겨질 사람의 이름부터 협상서에 적겠다고 말한다.",
  c1_branch_people_b: "협력사 대표들의 얼굴을 떠올리며, 지급일부터 못박자고 한다.",
  c1_branch_people_c: "감정이 끼어들 자리를 지우고, 인수 조건만 남긴 채 서명한다.",
  c1_branch_people_follow_a: "말로 한 약속이 흐려질 것을 알기에, 공개 기록으로 남기자고 한다.",
  c1_branch_people_follow_b: "계약서에 없던 목소리를 지우지 않고, 그 조건을 반영하겠다고 답한다.",
  c1_branch_people_follow_c: "미안함을 삼키고, 기준은 계약서 하나뿐이라고 답한다.",
  protect: "가장 먼저 무너질 사람들을 떠올리며, 급여와 고용을 맨 앞에 둔다.",
  survive: "냉정하게 들릴 것을 알면서도, 회사가 남아야 나머지가 가능하다고 말한다.",
  justice: "덮으면 편해질 것을 알면서도, 회계 문제를 먼저 밝히자고 한다.",
  c1_after_people: "숫자를 뒤로 미루고, 사람들 앞에 서서 약속을 직접 설명한다.",
  c1_after_numbers: "감정을 앞세우는 대신, 현금 흐름표를 펼치고 감당할 손실을 정한다.",
  c1_after_silence: "말할 수 없는 것이 많다는 이유로, 다음 자금까지 공개를 늦춘다.",
  c2_branch_records_a: "어느 쪽도 지우지 않겠다는 듯, 원본과 백업을 동시에 보존하자고 한다.",
  c2_branch_records_b: "기록보다 사람의 말이 먼저 사라진다는 걸 알기에, 진술부터 확보한다.",
  c2_branch_records_c: "의심을 접어두고, 기술 오류로 표시한 채 보고를 진행한다.",
  c2_branch_records_follow_a: "진술한 사람이 자기 말의 주인이 되도록, 원문 확인 권한을 준다.",
  c2_branch_records_follow_b: "결론만 믿게 하지 않으려고, 원문을 첨부해 외부 검증을 연다.",
  c2_branch_records_follow_c: "복잡한 것을 다 걷어내고, 보고서에 결론만 남긴다.",
  c2_after_audit: "누가 기록을 만졌는지부터 밝히려고, 원본 보관자를 먼저 조사한다.",
  c2_after_person: "절차를 건너뛰는 위험을 알면서도, 이민서에게 직접 묻는다.",
  c2_after_public: "덮을 시간을 주지 않으려고, 조작 가능성을 즉시 밖에 알린다.",
  c3_branch_signal_a: "숨기지 않고, 화면의 신호를 공개 질문으로 바꿔 무대 위에 올린다.",
  c3_branch_signal_b: "흐름이 끊길 걸 알면서도 발표를 멈추고 출처를 확인한다.",
  c3_branch_signal_c: "신호를 못 본 척하고, 이길 수 있을 때 승부를 끝낸다.",
  c3_branch_signal_follow_a: "승리를 확정 짓기 전에, 조건표에 검증 기한을 못박는다.",
  c3_branch_signal_follow_b: "혼자 받는 박수를 나누어, 공동 책임자를 발표한다.",
  c3_branch_signal_follow_c: "빈칸을 남겨둔 채, 성과 수치부터 확정한다.",
  c3_after_share: "승패를 접어두고, 두 안의 장점을 합쳐 고객에게 다시 제안한다.",
  c3_after_proof: "점수판보다 먼저, 보안 결함의 증거를 공개한다.",
  c3_after_win: "망설임을 끊고, 승리를 확정한 뒤 경쟁자의 허점을 이용한다.",
  c4_branch_exception_a: "조용히 넘어갈 수 있는 일을 굳이 꺼내, 예외 조건을 공개한다.",
  c4_branch_exception_b: "제도 논의보다 먼저, 피해를 입은 이용자에게 보상한다.",
  c4_branch_exception_c: "이번만이라고 스스로에게 말하며, 조용히 승인한다.",
  c4_branch_exception_follow_a: "결과만 자랑하지 않으려고, 감사 결과와 보상 기준을 함께 공개한다.",
  c4_branch_exception_follow_b: "감사의 범위를 혼자 정하지 않고, 이용자 대표와 함께 정한다.",
  c4_branch_exception_follow_c: "결과가 좋았다는 이유를 들어, 감사를 여기서 닫는다.",
  c4_after_rule: "줄 선 요청들을 보며, 예외 조건을 전부 공개하고 새 기준을 만든다.",
  c4_after_service: "서비스를 멈출 수 없다는 이유로, 같은 예외를 한 번 더 허용한다.",
  c4_after_stop: "감사를 위해, 진행 중이던 예외 적용을 즉시 중단한다.",
  c5_branch_owner_a: "다른 이름을 꺼내기 전에, 내 승인 기록부터 공개한다.",
  c5_branch_owner_b: "책임 논의를 미뤄두고, 빠진 안전장치부터 복구한다.",
  c5_branch_owner_c: "설명이 길어지는 것을 끊고, 실패를 한 사람의 책임으로 닫는다.",
  c5_branch_owner_follow_a: "복구 목록 옆에, 책임자의 이름도 함께 기록한다.",
  c5_branch_owner_follow_b: "말로 끝나지 않도록, 재발 방지 장치에 예산을 고정한다.",
  c5_branch_owner_follow_c: "더 건드리지 않기로 하고, 사과문만 발표한 뒤 종료한다.",
  c5_after_owner: "빈자리를 보고, 내 결정부터 책임진 뒤 개선 작업을 맡는다.",
  c5_after_system: "누구를 지목하는 대신, 반복을 막는 구조를 다시 설계한다.",
  c5_after_name: "회의를 끝내기 위해, 가장 큰 실수를 한 사람을 공식 책임자로 세운다.",
  f_branch_witness_a: "혼자 알고 있기를 그만두고, 그 빈칸을 참가자들에게 공개한다.",
  f_branch_witness_b: "결론을 믿기 전에, 삭제된 흔적부터 복원하려 한다.",
  f_branch_witness_c: "더 파고들지 않기로 하고, 기록의 결론만 믿고 넘어간다.",
  f_branch_witness_follow_a: "열람을 독점하지 않겠다는 듯, 모든 참가자에게 권한을 연다.",
  f_branch_witness_follow_b: "감정이 섞이기 전에, 독립 검토자에게 먼저 맡긴다.",
  f_branch_witness_follow_c: "더 번지지 않게, 내 기록만 보관하고 문을 닫는다.",
  ending_seal: "누구도 다시 쓰지 못하도록, 내 조건을 봉인하겠다고 말한다.",
  ending_reform: "숨기는 대신 드러내고, 사용 규칙을 만들자고 제안한다.",
  ending_expose: "안에서 고칠 수 있다는 기대를 접고, 구조를 외부에 넘긴다.",
  f_after_witness: "증언을 준비하며, 모든 기록을 증거로 보존한다.",
  f_after_control: "실험을 멈추는 대신, 참가자 동의 규칙부터 다시 쓴다.",
  f_after_burn: "누구도 다시 이용하지 못하도록, 모든 데이터를 태운다.",
  competitor_sale: "상대가 파고든 틈을 알면서도, 그 제안을 공식 안건으로 꺼낸다.",
  accounting_investigate: "같은 방에서는 나오지 않을 말을 위해, 두 사람을 따로 부른다.",
  payday_disclosure: "내일 아침을 준비할 시간을 주자며, 남은 현금을 그대로 말한다.",
  payday_delay: "확정되지 않은 불안을 넘기지 않겠다며, 방안이 설 때까지 입을 다문다.",
  competitor_negotiate: "따로 만나면 각자 유리한 말만 남는다며, 세 쪽을 한자리에 부른다.",
  c2_start_report: "지금 가진 것이 로그뿐이라는 사실을 함께 적어, 1차 보고를 올린다.",
  c2_meeting_report: "지금 흔들리면 판단이 아니라 인상이 남는다며, 절차에 맡긴다.",
  c2_pressure_report: "더 끌어봐야 같은 결론이라는 말에, 서명란으로 손을 옮긴다.",
  c2_meeting_meet: "혐의보다 그 시간에 어디 있었는지부터 묻는다.",
  c2_logs_verify: "완벽한 기록일수록 사본을 봐야 한다며, 두 벌을 나란히 연다.",
  c2_pressure_verify: "결론을 뒤집을 것 하나만 찾겠다며, 남은 30분을 건다.",
  c2_pressure_shadow: "결론이 아니라 그 결론이 서 있는 전제를 겨눈다.",
  c3_score_fast: "평가표가 요구하는 모양으로, 가진 안을 잘라 맞춘다.",
  c3_split_deep: "싼 답이 비싼 이유를 숫자로 만들겠다며 계산을 다시 연다.",
  c3_score_deep: "제보 내용보다 제보한 사람의 위치를 먼저 확인한다.",
  c3_trap_deep: "이기는 것보다 틀리지 않는 것이 낫다며, 상대에게 자료를 연다.",
  c3_split_mirror: "상대의 숫자를 인정하고, 그 위로 한 칸 더 올린다.",
  c3_trap_mirror: "내용보다 순서와 강조로 승부를 보겠다고 정한다.",
  c3_score_invert: "이 표로는 아무도 옳을 수 없다며, 평가 기준 자체를 안건에 올린다.",
  c3_trap_invert: "누가 이 경쟁을 설계했는지부터 고객에게 말한다.",
  c4_offer_approve: "이번 한 번이라는 말을 스스로에게 하며, 흔적을 남기지 않는다.",
  c4_leak_approve: "지금 인정하면 다 무너진다며, 의혹을 먼저 밀어낸다.",
  c4_vote_approve: "문 닫는 것보다 낫다는 계산 끝에, 예외에 손을 든다.",
  c4_offer_refuse: "숫자를 손대는 대신, 없는 돈을 만들 방법을 찾겠다고 말한다.",
  c4_vote_refuse: "손실을 숨기지 않고 표에 적겠다며 예외를 돌려보낸다.",
  c4_offer_contain: "지우지도 앞세우지도 않겠다며, 각주의 자리를 만든다.",
  c4_leak_contain: "막지 않겠다며, 대신 검증할 시간을 사자고 제안한다.",
  c4_vote_contain: "예외를 주되 그 예외를 감시할 사람을 같은 문장에 적는다.",
  f_start_contain: "밖으로 나가기 전에, 안에서 먼저 답을 듣겠다고 말한다.",
  f_start_expose: "안에서 해결될 일이 아니라며, 밖으로 낼 자료를 정리한다.",
  c5_map_blame: "놓친 신호에 이름이 있다며, 그 자리를 먼저 부른다.",
  c5_blame_blame: "기다리는 사람들에게 줄 답이 필요하다며, 징계와 보상을 함께 낸다.",
  c5_collapse_blame: "사람을 바꾸고 교육을 붙이는, 가장 익숙한 답을 고른다.",
  c5_map_map: "빠진 사람들이 서로 닮았는지부터 확인한다.",
  c5_blame_map: "한 사람으로 끝날 일이 아니라며, 구조를 문장의 주어로 세운다.",
  c5_collapse_map: "누가 먼저 무너졌는지를 기준으로, 표 전체를 다시 만든다.",
  f_start_map: "내가 남긴 기록이 어디로 갔는지부터 따라간다.",
  c5_map_redesign: "완성된 답이 아니라며, 밀려난 쪽에 임시 무게부터 얹는다.",
  c5_blame_redesign: "하나만 내면 나머지는 미뤄진다며, 셋을 같은 발표에 넣는다.",
  c5_collapse_redesign: "말하지 못한 쪽이 먼저 밀린다며, 계산을 반대로 기울인다.",
  f_confront_destroy: "내 기록을 잃더라도, 이 구조는 남기지 않겠다고 말한다.",
  f_confront_reform: "숨기는 대신 쓰는 방법을 내가 쓰겠다고 나선다.",
  f_confront_seal: "더 쓰이지 않게 하겠다며, 내 기록에 자물쇠를 건다.",
  f_confront_pact: "승인 절차를 기다리지 않고, 참가자들과 직접 약속을 맺는다.",
  c2_start_people_report: "지난번엔 사람을 먼저 적었으니, 이번엔 기록부터 올려보겠다고 말한다.",
  c2_start_people_meet: "또 사람부터 만나는 사람이 되겠다며, 이민서에게 먼저 연락한다.",
  c2_start_people_verify: "보호가 감정이 아니었다는 걸 증명하려고, 원본 로그부터 다시 연다.",
  c2_start_records_report: "내가 공개한 숫자로 시작한 사건이니, 기록으로 끝내겠다고 말한다.",
  c2_start_records_meet: "숫자만으로는 알 수 없는 게 있다며, 이민서를 먼저 만난다.",
  c2_start_records_verify: "내가 낸 자료가 조작의 재료가 됐는지부터 확인한다.",
  c2_start_silence_report: "이번엔 늦지 않겠다며, 가진 것만으로 먼저 보고를 올린다.",
  c2_start_silence_meet: "말하지 않아 생긴 일이라며, 이번엔 당사자를 먼저 찾아간다.",
  c2_start_silence_verify: "숨긴 조건이 유출 파일에 있는지부터 원본으로 확인한다.",
  c3_start_audit_fast: "복원해 둔 기록이 있으니 속도로도 진다고 생각하지 않는다.",
  c3_start_audit_deep: "기록을 복원한 사람답게, 이번에도 결함부터 끝까지 본다.",
  c3_start_audit_mirror: "오진우가 무엇을 지웠을지부터 추정해 대응안을 짠다.",
  c3_start_person_fast: "사람을 지킨 대가를 속도로 갚겠다며 먼저 안을 낸다.",
  c3_start_person_deep: "한 번 믿은 사람을 다시 의심하지 않기 위해, 결함 쪽을 판다.",
  c3_start_person_mirror: "오진우가 그 보호를 어떻게 쓸지 먼저 계산한다.",
  c3_start_public_fast: "경보를 낸 쪽이 느리면 안 된다며 결론을 먼저 낸다.",
  c3_start_public_deep: "알린 사람이 증명도 해야 한다며 결함 검증을 끝까지 간다.",
  c3_start_public_mirror: "경보를 이용하려는 쪽의 수부터 읽는다.",
  c4_start_joint_approve: "같이 만든 안을 살리려면 여기서 한 칸 넓혀야 한다고 판단한다.",
  c4_start_joint_refuse: "공동안이라도 숫자를 바꿀 수는 없다고 못박는다.",
  c4_start_joint_contain: "넓히되 그 넓힌 만큼을 문서로 묶자고 제안한다.",
  c4_start_proof_approve: "정직했던 대가가 서비스 중단이면 안 된다며 기준을 넓힌다.",
  c4_start_proof_refuse: "결함을 공개한 사람이 산식을 손댈 수는 없다고 말한다.",
  c4_start_proof_contain: "공개했던 방식 그대로, 조건과 검증을 함께 건다.",
  c4_start_win_approve: "이겨본 방식대로, 결과부터 만들고 설명은 뒤에 붙인다.",
  c4_start_win_refuse: "이겼기 때문에 더 지켜야 한다며 지표를 그대로 낸다.",
  c4_start_win_contain: "이긴 방식에 감시를 붙여 다음 사람도 쓸 수 있게 만든다.",
  c5_start_rule_blame: "내가 만든 기준을 지킨 사람을 조사해야 하는지 물으며 이름을 부른다.",
  c5_start_rule_map: "기준이 어디서 현장을 막았는지 흐름부터 그린다.",
  c5_start_rule_redesign: "기준을 잠시 내려놓고 손으로 돌리자고 결정한다.",
  c5_start_service_blame: "서비스를 지킨 예외가 여기까지 왔다는 걸 알면서 책임자를 부른다.",
  c5_start_service_map: "지킨 서비스가 누구를 밀어냈는지 전체 흐름을 편다.",
  c5_start_service_redesign: "유지가 목적이었으니 유지 방식을 바꾸자고 말한다.",
  c5_start_stop_blame: "멈춘 결정은 내가 했으니 실행의 책임부터 확인하겠다고 말한다.",
  c5_start_stop_map: "멈춘 동안 무엇이 어디서 끊겼는지 지도부터 그린다.",
  c5_start_stop_redesign: "멈춘 걸 다시 세우는 게 먼저라며 수동 체계로 돌린다.",
  f_start_owner_map: "내 이름이 올라간 기록이 어디로 갔는지부터 따라간다.",
  f_start_owner_expose: "책임을 진 사람이 침묵할 수는 없다며 공개를 준비한다.",
  f_start_owner_contain: "책임을 함께 적은 사람에게 먼저 설명을 요구한다.",
  f_start_system_map: "내가 고친 구조가 실험에 어떻게 쓰였는지 추적한다.",
  f_start_system_expose: "구조를 고친 사람으로서 이 구조도 공개해야 한다고 말한다.",
  f_start_system_contain: "새 규칙이 여기서도 지켜졌는지 내부에 먼저 묻는다.",
  f_start_name_map: "내가 적은 이름이 실험에서 어떻게 쓰였는지 따라간다.",
  f_start_name_expose: "한 사람에게 지웠던 것을 이번엔 밖으로 낸다.",
  f_start_name_contain: "이름을 적게 만든 절차부터 안에서 설명받겠다고 한다.",

  // Route scenes. Until these were written the reveal repeated the button
  // label back at the player, so the pause before committing said nothing.
  c1_route_layoff_notice: "명단을 확정하기 전에, 이름이 적힌 사람들에게 먼저 알리겠다고 한다.",
  c1_route_layoff_fast: "말이 새는 것을 막으려고, 통보를 늦추고 절감 효과부터 확정한다.",
  c1_route_layoff_protect: "제보자가 명단에 섞여 있다는 걸 알고, 명단을 다시 짠다.",
  c1_final_layoff_a: "숫자보다 판단 기준이 먼저 도착해야 한다고 보고, 대상자에게 직접 보낸다.",
  c1_final_layoff_b: "혼란을 줄이겠다는 이유로, 명단을 먼저 닫고 통보 순서는 나중에 정한다.",
  c1_final_layoff_c: "잘라낼 자리를 위에서부터 찾겠다는 듯, 임원 보수 삭감을 첫 줄에 올린다.",
  c1_route_funding_clause: "비공개 조항이 나중에 입을 막을 것을 알고, 공개 조건으로 바꿔 서명한다.",
  c1_route_funding_accept: "지금 필요한 것은 시간이라고 판단하고, 조건을 그대로 받는다.",
  c1_route_funding_split: "돈보다 설명할 자리를 지키려고, 절반만 받겠다고 한다.",
  c1_final_funding_a: "이사회 안에서만 도는 문장을 만들지 않으려고, 조건 전문을 밖에도 연다.",
  c1_final_funding_b: "일단 돈이 들어와야 한다는 판단으로, 조건은 덮고 입금 일정부터 확정한다.",
  c1_final_funding_c: "설명할 권한을 잃지 않으려고, 조달 규모 자체를 절반으로 줄인다.",
  c1_route_sale_clean: "팔 수 없는 것이 섞여 있다고 보고, 데이터와 로그를 먼저 분리한다.",
  c1_route_sale_bundle: "현금이 먼저라는 판단으로, 묶음 그대로 넘긴다.",
  c1_route_sale_hold: "고객이 뉴스로 먼저 알게 하지 않으려고, 매각을 멈추고 고지부터 보낸다.",
  c1_final_sale_a: "기록까지 팔 수는 없다고 판단하고, 목록에서 빼낸 사실을 그대로 공지한다.",
  c1_final_sale_b: "협상을 흔들지 않으려고, 묶음 그대로 넘기고 고지는 계약 뒤로 미룬다.",
  c1_final_sale_c: "파는 대신 조건을 붙이겠다는 듯, 인수자에게 기록 보존 의무를 건다.",
  c1_route_investigate_freeze: "세 안건이 같은 빈칸을 지나갔다는 걸 알고, 전부 멈춘다.",
  c1_route_investigate_shadow: "겉으로는 진행하는 척하며, 뒤에서 로그만 조용히 따라간다.",
  c1_route_investigate_share: "혼자 쥐고 있을 문제가 아니라고 보고, 누락 사실을 공개한다.",
  c1_final_investigate_a: "빈칸을 만든 손을 찾아야 한다고 보고, 로그와 작성자를 함께 연다.",
  c1_final_investigate_b: "조사보다 생존이 먼저라는 판단으로, 감사를 접고 한 안건만 실행한다.",
  c1_final_investigate_c: "내가 판정자가 되지 않으려고, 감사 권한을 외부 회계인에게 넘긴다.",
  c1_route_system_trace: "세 해결책이 같은 표를 지났다는 걸 보고, 그 표를 누가 고쳤는지 되짚는다.",
  c1_route_system_use: "지금은 원인을 캘 때가 아니라고 판단하고, 표는 그대로 두고 밀어붙인다.",
  c1_route_system_open: "회의실 안에서만 도는 기준이 문제라고 보고, 밖의 사람들에게 먼저 보여준다.",
  c1_final_system_a: "기준표가 문제의 주어라고 보고, 공개한 뒤 전부 다시 심사한다.",
  c1_final_system_b: "설명할 시간이 없다는 이유로, 표는 덮고 가장 빠른 길만 남긴다.",
  c1_final_system_c: "이 표를 내가 계속 쥐면 안 된다고 판단하고, 작성 권한을 밖으로 넘긴다.",
  c1_evidence_turn_public: "표와 그 표를 쓴 사람을 함께 세워야 한다고 보고, 둘 다 공개한다.",
  c1_evidence_turn_private: "사람은 지키고 구조만 고치겠다는 듯, 작성자는 가리고 표만 손본다.",
  c1_evidence_turn_transfer: "내가 검증하면 같은 눈이 반복된다고 보고, 다음 담당자에게 넘긴다.",

  c2_evidence_turn_guard: "말할 사람이 자기 기록부터 볼 수 있어야 한다고, 열람권을 되돌린다.",
  c2_evidence_turn_stamp: "11초가 오류가 아니라는 증거를 밖으로 보낸다.",
  c2_evidence_turn_delay: "말이 기록보다 먼저 나가지 않게, 복원부터 끝낸다.",

  c3_route_fast_lock: "빠른 답이 그대로 굳는 것을 막으려고, 검증 기한을 조건으로 붙인다.",
  c3_route_fast_polish: "우위를 굳히겠다는 판단으로, 숫자를 더 다듬어 점수판을 고정한다.",
  c3_route_fast_reopen: "내가 건너뛴 자리를 내가 먼저 말해야 한다고 보고, 보안 항목을 공개한다.",
  c3_final_win_a: "속도가 기준이 되는 것을 막으려고, 검증 기한을 계약서에 박아 넣는다.",
  c3_final_win_b: "이긴 방식이 옳았다고 보고, 같은 기준으로 다음 입찰도 받는다.",
  c3_final_win_c: "고객이 무엇을 못 봤는지 알아야 한다고 보고, 생략 목록을 함께 넘긴다.",
  c3_route_deep_attach: "결함을 부록에 숨기지 않겠다는 듯, 첫 장에 붙인다.",
  c3_route_deep_delay: "마감보다 확인이 먼저라고 보고, 공식으로 검증 시간을 요청한다.",
  c3_route_deep_bury: "이기고 나서 고치면 된다는 판단으로, 결함은 부록에 묶는다.",
  c3_final_right_a: "지더라도 틀린 안을 내지는 않겠다는 듯, 보고서를 붙인 채 제출한다.",
  c3_final_right_b: "정확함이 계약을 주지는 않는다고 판단하고, 가격으로 승부한다.",
  c3_final_right_c: "손실을 누가 지는지부터 정하려고, 회사 비용으로 공식화한다.",
  c3_route_mirror_call: "빈칸이 실수인지 시험인지 확인하려고, 오진우에게 직접 묻는다.",
  c3_route_mirror_use: "상대가 남긴 틈을 그대로 쓰겠다는 판단으로, 내 안을 유리하게 고친다.",
  c3_route_mirror_share: "이기는 대신 판을 바꾸려고, 빈칸을 공동 검증 조건으로 만든다.",
  c3_final_joint_a: "책임을 나눠 적어야 판이 유지된다고 보고, 두 이름을 함께 올린다.",
  c3_final_joint_b: "경쟁은 경쟁이라고 판단하고, 상대의 빈칸을 근거로 독자안을 민다.",
  c3_final_joint_c: "이 경쟁 자체가 문제라고 보고, 고객 앞에서 구조를 문제로 올린다.",
  c3_route_system_read: "새 항목이 어디서 왔는지 알아야 한다고 보고, 출처를 추적한다.",
  c3_route_system_ride: "바뀐 판이 유리하다는 판단으로, 그대로 타고 우위를 굳힌다.",
  c3_route_system_tell: "혼자만 아는 정보로 이기지 않겠다는 듯, 오진우에게 먼저 알린다.",
  c3_final_system_a: "기준을 만든 사람이 나였다는 사실부터 밝히고, 고객에게 연다.",
  c3_final_system_b: "설명할 이유가 없다고 보고, 기준은 덮은 채 결과만 쓴다.",
  c3_final_system_c: "판을 이기는 대신 판을 멈추자고, 경쟁자에게 손을 내민다.",
  c3_evidence_turn_merge: "고객이 두 개의 점수판을 봐야 한다고 보고, 합쳐서 다시 낸다.",
  c3_evidence_turn_use: "허점을 알고 있다는 것이 이점이라고 판단하고, 그대로 계약을 딴다.",
  c3_evidence_turn_refuse: "이 점수판으로는 계약하지 않겠다고, 자리에서 물러난다.",

  c4_route_exception_publish: "예외를 쓰려면 누가 덕을 보는지도 적어야 한다고 보고, 함께 공개한다.",
  c4_route_exception_repeat: "같은 조건이면 같은 결과여야 한다는 논리로, 다른 기관에도 문을 연다.",
  c4_route_exception_meter: "한 번으로 끝내겠다는 조건을 걸고, 감사 계량기를 붙인다.",
  c4_final_exception_a: "이미 규칙이 된 것을 규칙으로 인정하고, 사유와 대상을 등록한다.",
  c4_final_exception_b: "기록이 남으면 선례가 된다고 보고, 이번 판단으로만 두고 지운다.",
  c4_final_exception_c: "예외의 값을 치르는 사람에게 먼저 물어야 한다고 보고, 동의 절차 뒤로 미룬다.",
  c4_route_rule_fund: "명단만 내밀 수는 없다고 보고, 다른 자금과 함께 공개한다.",
  c4_route_rule_wait: "확정 전에 흔들지 않겠다는 이유로, 명단 공개를 심사 뒤로 미룬다.",
  c4_route_rule_rewrite: "지표가 부족한 게 아니라 지표가 틀렸다고 보고, 피해 기준으로 다시 쓴다.",
  c4_final_rule_a: "절차가 깨끗했다는 기록 옆에, 잃은 사람들의 이름을 나란히 놓는다.",
  c4_final_rule_b: "책임질 문제는 아니라고 판단하고, 문제없음만 남기고 명단은 안에 둔다.",
  c4_final_rule_c: "집행을 늦춰서라도 다른 자금을 찾겠다고, 결과를 붙잡는다.",
  c4_route_audit_public: "감시할 사람은 영향을 받는 쪽이어야 한다고 보고, 이용자 대표에게 준다.",
  c4_route_audit_internal: "속도를 지키겠다는 판단으로, 내부 감사팀에만 확인을 맡긴다.",
  c4_route_audit_split: "심사와 감사가 한 손에 있으면 안 된다고 보고, 권한을 나눈다.",
  c4_final_audit_a: "조건이 살아 있는지 계속 보이게 하려고, 감사 결과를 정기 공개한다.",
  c4_final_audit_b: "밖에 나가면 오해된다고 보고, 감사 내용은 내부 문서로만 남긴다.",
  c4_final_audit_c: "감시와 심사를 같이 쥐지 않겠다는 듯, 감사 권한을 넘기고 심사만 맡는다.",
  c4_route_system_limit: "허용선이 무한히 늘어나는 것을 막으려고, 한도부터 적는다.",
  c4_route_system_ship: "지금은 이 승인부터 끝내야 한다고 보고, 허용선은 건드리지 않는다.",
  c4_route_system_ask: "시뮬레이션에 빠진 것이 사람이라고 보고, 피해자 명단부터 넣는다.",
  c4_final_system_a: "내 판단이 남의 근거가 되지 않게, 기준을 전부 열고 문을 닫는다.",
  c4_final_system_b: "결과가 좋았다는 사실을 근거로 삼아, 다음 사용도 열어 둔다.",
  c4_final_system_c: "기준에 잠금장치를 달아, 당사자 동의 없이는 열리지 않게 만든다.",
  c4_evidence_turn_owner: "예외가 처음이 아니었다는 걸 보고, 반복 승인자를 기록에 남긴다.",
  c4_evidence_turn_stop: "절차를 멈춰 세우고, 피해자 동의를 새 조건으로 끼워 넣는다.",
  c4_evidence_turn_patch: "반복된 흔적은 덮고, 이번 건만 조용히 마무리한다.",

  c5_route_blame_compensate: "책임자 발표만으로 끝나지 않게, 보상안을 같은 자리에 올린다.",
  c5_route_blame_single: "빨리 닫는 것이 피해를 줄인다고 보고, 한 사람의 책임으로 정리한다.",
  c5_route_blame_reopen: "이름을 붙이기 전에 경로를 봐야 한다고 보고, 지목을 보류한다.",
  c5_final_blame_route_a: "책임자를 세우는 날에 재발 방지 예산도 함께 세운다.",
  c5_final_blame_route_b: "더 캐면 조직이 버티지 못한다고 보고, 한 사람의 책임으로 끝낸다.",
  c5_final_blame_route_c: "누구의 잘못인지보다 어디서 갈라졌는지를 묻기로 하고, 경로 전체를 연다.",
  c5_route_map_publish: "이해할 수 있게 만들려고, 실패 지도를 그대로 공개한다.",
  c5_route_map_owner: "화살표에 이름이 없으면 아무 일도 안 일어난다고 보고, 결정권자를 붙인다.",
  c5_route_map_delay: "지금은 설명보다 보상이 먼저라고 보고, 지도는 안에 둔다.",
  c5_final_map_route_a: "구조를 그리는 김에, 화살표마다 책임과 보상을 함께 적어 연다.",
  c5_final_map_route_b: "지도가 무기가 될 수 있다고 보고, 보상 발표만 먼저 낸다.",
  c5_final_map_route_c: "내 손으로 정리하지 않겠다는 듯, 보고서를 외부 검토에 그대로 넘긴다.",
  c5_route_redesign_snapshot: "고치기 전 상태가 증거라는 걸 알고, 먼저 스냅샷을 뜬다.",
  c5_route_redesign_continue: "지금 줄일 수 있는 피해가 먼저라고 보고, 복구 속도를 택한다.",
  c5_route_redesign_rule: "임시로 하던 것을 규칙으로 만들려고, 수동 배차 조건을 정식화한다.",
  c5_final_redesign_route_a: "고친 것과 고치기 전을 함께 보여주려고, 스냅샷과 새 규칙을 같이 낸다.",
  c5_final_redesign_route_b: "원인은 나중에 밝히면 된다고 보고, 복구를 계속한다.",
  c5_final_redesign_route_c: "증거가 먼저 사라진다고 판단하고, 복구를 멈추고 로그부터 보존한다.",
  c5_route_system_audit: "가중치가 무엇을 배웠는지부터 봐야 한다고 보고, 학습 자료를 연다.",
  c5_route_system_patch: "지금 배차를 살리는 게 먼저라고 보고, 가중치는 두고 손으로 고친다.",
  c5_route_system_call: "기준을 만든 쪽이 잘못 봤다고 보고, 누락된 사람들에게 직접 묻는다.",
  c5_final_system_route_a: "조용하다는 이유로 밀리지 않게, 보호 가중치를 공개 기준에 넣는다.",
  c5_final_system_route_b: "설명할 자신이 없어, 가중치는 두고 손으로만 계속 보정한다.",
  c5_final_system_route_c: "무엇을 배우지 못했는지부터 밝히려고, 누락 기록을 먼저 연다.",
  c5_evidence_turn_weight: "숨은 가중치를 규칙 자리로 끌어올려, 누구나 읽게 만든다.",
  c5_evidence_turn_archive: "복구가 증거를 덮기 전에, 원인 로그부터 잠근다.",
  c5_evidence_turn_close: "당장 급한 보상부터 끝내고, 규칙 공개는 뒤로 미룬다.",

  f_route_map_open: "내 로그가 무엇을 바꿨는지 숨기지 않고, 전부 열어 놓는다.",
  f_route_map_delete: "내 흔적만 지우면 된다는 판단으로, 다른 기록은 그대로 둔다.",
  f_route_map_return: "복제된 문장은 원래 주인의 것이라고 보고, 그대로 돌려준다.",
  f_final_map_a: "내가 바꾼 질문의 목록을 한 장으로 만들어 공개한다.",
  f_final_map_b: "돌려주는 데서 멈추지 않고, 지울 권한까지 함께 넘긴다.",
  f_final_map_c: "내 로그까지 포함해, 원본 전부를 다음 참가자에게 넘긴다.",
  f_route_expose_redact: "구조는 드러내되 사람은 가리려고, 식별자를 지우고 넘긴다.",
  f_route_expose_raw: "지워질 시간을 주지 않겠다는 듯, 원본을 그대로 넘긴다.",
  f_route_expose_hold: "폭로가 또 다른 피해가 되지 않게, 감사단이 올 때까지 멈춘다.",
  f_final_expose_a: "이름이 아니라 구조가 남아야 한다고 보고, 식별자를 지운 증거만 넘긴다.",
  f_final_expose_b: "당사자 없이 여는 폭로는 또 다른 실험이라고 보고, 동의부터 다시 받는다.",
  f_final_expose_c: "삭제될 시간을 없애는 것이 먼저라고 판단하고, 원본을 그대로 넘긴다.",
  f_route_contain_board: "도구를 쓰는 사람이 통제해야 한다고 보고, 참가자 대표 운영위를 만든다.",
  f_route_contain_lab: "밖으로 나가면 다 잃는다는 판단으로, 내부 개혁안으로 봉합한다.",
  f_route_contain_pause: "쓰기 전에 물어봤어야 한다고 보고, 도구를 멈추고 동의를 다시 받는다.",
  f_final_contain_a: "남길 조건을 정할 사람은 참가자라고 보고, 운영위에 도구를 넘긴다.",
  f_final_contain_b: "조건을 정하기 전에 멈춰야 한다고 보고, 동의 절차를 처음부터 다시 받는다.",
  f_final_contain_c: "판단을 남기지 않겠다는 듯, 구조와 사용 기록을 전부 공개 기록으로 넘긴다.",
  f_route_system_read: "내 문장이 어떤 버튼이 됐는지 끝까지 읽는다.",
  f_route_system_send: "확인하지 않는 편이 낫다고 판단하고, 대기열을 그대로 둔다.",
  f_route_system_warn: "다음 사람이 알고 고르게 하려고, 이 화면을 먼저 보여준다.",
  f_final_system_a: "내 말이 남의 질문이 되는 것을 막겠다고, 복제를 끊는다.",
  f_final_system_b: "문장은 남기되, 고쳐 쓸 수 있는 빈칸을 함께 붙인다.",
  f_final_system_c: "판단을 물려주는 대신 자료를 물려주고, 여기서 끝낸다.",
  f_evidence_turn_burn: "내 문장까지 포함해, 실험 원본을 전부 태운다.",
  f_evidence_turn_seed: "내 문장을 답이 아니라 경고문으로 바꿔, 다음 사람에게 남긴다.",
  f_evidence_turn_publish: "복제 규칙까지 포함해, 원본 전부를 밖에 연다.",
  c6_start_defend: "보고서보다 사람이 먼저 사라질 수 있다는 걸 알기에, 그를 찾는 일부터 시작한다.",
  c6_start_record: "감정이 끼어들 자리를 지우고, 그가 실제로 무엇을 승인했는지부터 연다.",
  c6_start_panel: "시간을 사는 값이 비싸다는 걸 알면서도, 위원회에 기한을 미뤄 달라고 청한다.",
  c6_desk_person: "기록이 말하지 않는 것을 물으려고, 그를 매일 보던 사람들 앞에 앉는다.",
  c6_desk_draft: "열한 번 지운 손을 떠올리며, 지워진 문장을 한 줄씩 되돌린다.",
  c6_desk_seal: "동료의 책상이 아니라 증거물이라고 스스로에게 말하며, 봉인 테이프를 붙인다.",
  c6_logs_tell: "잔인한 사실이라는 걸 알면서도, 그가 자기 조건을 남에게서 듣지 않게 한다.",
  c6_logs_shield: "그의 판단까지 열리는 것을 막으려고, 문제 삼을 범위를 설정값으로 좁힌다.",
  c6_logs_expose: "내 이름이 같은 폴더에 있다는 걸 알면서도, 두 사람의 프로필을 함께 올린다.",
  c6_panel_respect: "지키고 싶은 것이 경력이 아님을 알아듣고, 그의 조건을 변론에서 뺀다.",
  c6_panel_submit: "그가 원망할 것을 알면서도, 그를 살릴 자료를 동의 없이 제출한다.",
  c6_panel_both: "봐주지도 덮지도 않겠다는 듯, 그가 놓친 것과 그에게 걸린 것을 같은 장에 쓴다.",
  c6_final_person: "오늘 닫을 수 있는 사건을 열어둔 채, 옆자리 사람의 이름을 먼저 뺀다.",
  c6_final_record: "조직 전체가 조사 대상이 되는 쪽을 택하며, 설정값을 공식 기록으로 연다.",
  c6_final_close: "가장 빠른 종결이라는 걸 알면서도, 세울 이름 하나를 문서에 적는다.",
  c6_branch_roof_a: "위로가 되지 않을 답이라는 걸 알면서도, 아는 만큼 그대로 말한다.",
  c6_branch_roof_b: "무슨 말을 해도 틀릴 것 같아서, 대답 대신 같은 난간에 팔을 건다.",
  c6_branch_roof_c: "지금 필요한 건 대화가 아니라 자료라고 말하며, 먼저 돌아선다.",
  c6_branch_roof_follow_a: "식은 컵을 받아 들고, 내 이름으로 건네러 올라간다.",
  c6_branch_roof_follow_b: "내가 주면 의미가 달라진다는 걸 알기에, 도윤하가 줄 자리를 만든다.",
  c6_branch_roof_follow_c: "컵 두 개를 그대로 둔 채, 위원회실 문을 먼저 연다.",
  c6_after_stand: "치우려는 손을 막고, 그가 돌아올 자리를 그대로 남긴다.",
  c6_after_open: "내 이름이 같이 열린다는 걸 알면서도, 두 사람의 설정값을 공개한다.",
  c6_after_name: "가장 조용히 끝나는 길이라며, 책임자 이름을 문서에 확정한다.",
  // CASE 10. The bill for the two cases before it. The lines are spoken either
  // to a person who cannot answer yet or to a room deciding what one person's
  // three years were worth, so none of them argues with a document.
  c10_start_file: "나흘 뒤면 없어질 파일이라며, 폐기 전에 공식 기록으로 먼저 올린다.",
  c10_start_claim: "치료비부터 나와야 한다며, 도윤하의 산업재해 신청을 접수한다.",
  c10_start_cover: "깨우지 않는 편이 낫다고 판단하고, 그의 업무부터 넘겨받는다.",
  c10_locker_open: "1,740명은 개인 메모가 아니라며, 전부를 공식 피해자 명부로 연다.",
  c10_locker_money: "월급에서 나간 47건이 먼저라며, 그 송금부터 추적한다.",
  c10_locker_close: "미해결 1,128명은 지금 감당할 수 없다며, 해결분만 이관한다.",
  c10_branch_home_a: "사직서는 그의 것이라며 돌려주고, 4번 창구가 지금 파는 방식부터 본다.",
  c10_branch_home_b: "봉투는 열지 않은 채 두고, 짐만 조용히 챙겨 나온다.",
  c10_branch_home_c: "같은 자리에 앉은 1년차에게, 이 상품의 뒷장을 먼저 알려 준다.",
  c10_branch_home_follow_a: "세 사람을 찾아가, 분담표에 일곱 번째 칸을 만들자고 한다.",
  c10_branch_home_follow_b: "세 사람의 이름은 밝히지 않고, 그 줄만 명부에 합친다.",
  c10_branch_home_follow_c: "이 얘기는 본인이 먼저 들어야 한다며, 깨면 해 주기로 한다.",
  c10_claim_prove: "위반 기록까지 다 내겠다며, 일 때문에 아팠다는 인과관계를 증명한다.",
  c10_claim_narrow: "위반은 빼자며, 근무 시간 기록만으로 다툰다.",
  c10_claim_system: "이건 개인 심의가 아니라며, 안건을 제도 결함으로 바꾼다.",
  c10_relay_assign: "약속은 흩어진다며, 여섯 사람을 공식 담당자로 규정에 박는다.",
  c10_relay_pay: "무보수로 두지는 않겠다며, 수당 예산부터 따내겠다고 한다.",
  c10_relay_keep: "정식 조직이 되면 식는다며, 지금의 약속 그대로 두자고 한다.",
  c10_final_stop: "수첩을 덮게 하고, 212명은 제도 개정으로 미루자고 말한다.",
  c10_final_join: "혼자 적게 두지는 않겠다며, 그 수첩의 절반을 내 이름으로 나눠 적는다.",
  c10_final_rule: "빠진 212명이 들어갈 칸을, 규정에 새로 만들자고 요구한다.",
  c10_after_rest: "오늘은 여기까지라며 불을 끄고, 여섯 명을 정시에 퇴근시킨다.",
  c10_after_record: "분담표가 제도가 되어야 남는다며, 그룹 공식 제도안으로 제출한다.",
  c10_after_keep: "212명 명단만은 넘기지 않겠다며, 내 서랍에 남긴다.",
  // CASE 11. The first room the whole country can see into. Every line is
  // spoken to somebody who will be quoted, so none of them is a private promise.
  c11_start_reporter: "기사에 틀린 게 있으면 그것부터라며, 기자에게 먼저 연락해 바로잡는다.",
  c11_start_pr: "상대가 무엇을 말하려는지부터 보겠다며, 홍보실의 입장문 초안을 받아 읽는다.",
  c11_start_team: "혼자 나갈 자리가 아니라며, 동료들부터 모아 무엇을 말할지 함께 정한다.",
  c11_script_own: "두 대본 다 돌려보내고, 증명할 수 있는 문장만으로 새로 쓰겠다고 한다.",
  c11_script_trim: "의원실 대본은 받되, 증거 없는 마지막 줄만 지우겠다고 한다.",
  c11_script_pr: "홍보실 자료를 따르겠다고 하고, 대신 동료들 인사 보복 금지를 약속받는다.",
  c11_branch_newsroom_a: "제보자를 보호한다는 조건을 걸고, 원본 대조에 협조하겠다고 한다.",
  c11_branch_newsroom_b: "원본은 못 본 것으로 하겠다며, 조용히 편집국을 나온다.",
  c11_branch_newsroom_c: "공개는 제보한 사람이 정할 일이라며, 임경수에게 먼저 전화한다.",
  c11_branch_newsroom_follow_a: "필적 감정서는 내되, 제보자 이름은 끝까지 가리자고 한다.",
  c11_branch_newsroom_follow_b: "감정서 대신, 그 메모를 참고인석에서 내가 직접 말하겠다고 한다.",
  c11_branch_newsroom_follow_c: "회신 기한까지 대응을 미루고, 국정감사 뒤로 넘기자고 한다.",
  c11_rehearsal_shield: "이민서의 이름이 나올 질문은, 답을 미리 막아 두자고 한다.",
  c11_rehearsal_truth: "숨기면 더 다친다며, 이민서와 함께 사실대로 답하는 연습을 한다.",
  c11_rehearsal_contract: "출석보다 먼저라며, 이민서의 정규직 전환부터 요구한다.",
  c11_sign_ask: "녹음을 내일 함께 제출하자고, 한서윤에게 부탁한다.",
  c11_sign_spare: "녹음은 당신이 가지고 있으라며, 내 증언만으로 윤상혁을 부르겠다고 한다.",
  c11_sign_together: "반대한 사람과 반려한 사람이 함께 출석해, 같이 말하자고 한다.",
  c11_final_name: "증거를 들고, 윤상혁이라는 이름을 말한다.",
  c11_final_system: "한 사람의 이름 대신, 반대 의견이 사라지는 구조를 말한다.",
  c11_final_people: "1,740명이라는 숫자로 시작해, 남은 시간을 피해자에게 쓴다.",
  c11_after_toast: "오늘 밤은 여기까지라며 휴대폰을 엎어 두고, 끝까지 같이 먹는다.",
  c11_after_record: "잘린 영상 말고 전부 남겨야 한다며, 속기록 전문을 공개한다.",
  c11_after_summon: "미룰 이유가 없다며, 지금 바로 33층 면담에 응하겠다고 답한다.",
};


/**
 * The authored echo replies. gameData copies these into the runtime table and
 * adds a reply for every scene its generators create, so the graph builder
 * never writes back into this file's data.
 */
export const authoredEchoReplies = {
  c7_start_gather: "이틀을 전부 쓰면 자료는 모입니다. 인수인계가 비면 그것도 하나의 기록이 됩니다.",
  c7_start_appeal: "이의는 절차를 만들고, 절차는 시간을 씁니다. 당신에게 남은 것이 그 시간입니다.",
  c7_start_accept: "받아들이면 오늘은 조용합니다. 지점에서는 이 파일들을 열 수 없습니다.",
  c7_ledger_take: "수첩은 마흔한 명을 증명합니다. 그 마흔한 명 중 마지막 한 명이 그 자신이 됩니다.",
  c7_ledger_page: "한 장은 당신을 지킵니다. 나머지 마흔 명은 여전히 아무 데도 없습니다.",
  c7_ledger_refuse: "증언은 사람의 기억이고, 기억에는 날짜가 붙지 않습니다. 그가 남는 대신 문서가 얇아집니다.",
  c7_counter_pull: "뒷장은 지시를 증명합니다. 같은 장이 네 사람의 근무 기록도 증명합니다.",
  c7_counter_mask: "가린 이름은 그들을 지킵니다. 가린 문서는 누가 팔았는지 말하지 못합니다.",
  c7_counter_ask: "물어보면 결정권이 그들에게 갑니다. 그 결정에는 당신이 없는 시간이 필요합니다.",
  c7_paper_name: "그의 이름이 올라가면 문서는 단단해집니다. 4년을 숨긴 사람이 하루 만에 공개됩니다.",
  c7_paper_shield: "익명은 그를 남깁니다. 남은 그는 5년째 같은 층에 앉아 있게 됩니다.",
  c7_paper_pair: "두 이름은 서로를 증인으로 만듭니다. 한쪽이 무너지면 다른 쪽도 같이 읽힙니다.",
  c7_final_all: "이름이 많은 문서는 반박하기 어렵습니다. 반박당할 사람도 그만큼 많아집니다.",
  c7_final_mine: "혼자 지면 아무도 다치지 않습니다. 혼자 이기면 아무도 증인이 아닙니다.",
  c7_final_none: "익명 자료는 조사를 엽니다. 여는 데까지 몇 달이 걸리고, 당신은 그때 지점에 있습니다.",
  c7_after_stand: "찾아간 자리는 기억됩니다. 그 하루에 문서는 한 줄도 나아가지 않습니다.",
  c7_after_open: "남은 하루는 권한이 살아 있는 마지막 하루입니다. 쓰면 사라지고, 안 쓰면 그냥 사라집니다.",
  c7_after_alone: "조용히 떠나면 아무 일도 없었던 것이 됩니다. 문서에 적힌 이름들만 남습니다.",
  c7_branch_quota_a: "세 장이 모이면 한 줄은 지시가 됩니다. 모으는 데 필요한 시간은 당신에게 없는 것입니다.",
  c7_branch_quota_b: "확대한 한 줄은 강합니다. 한 줄짜리 증거는 한 줄짜리 해명으로 닫힙니다.",
  c7_branch_quota_c: "지시 라인만 짚으면 창구는 보호됩니다. 창구가 빠진 문서는 현장을 증명하지 못합니다.",
  c7_branch_quota_follow_a: "세 사람을 피해자로 적으면 사건은 4년으로 늘어납니다. 그들에게 묻지 않고 늘린 것입니다.",
  c7_branch_quota_follow_b: "범위를 좁히면 오늘 닫힙니다. 그 세 사람은 이번에도 자기 이름을 못 봅니다.",
  c7_branch_quota_follow_c: "연락하면 그들이 고릅니다. 그 통화 하나에 남은 시간의 절반이 들어갑니다.",
  c7_evidence_turn_order: "두 날짜를 나란히 놓으면 우연이라는 말이 어려워집니다. 당신의 질문도 함께 기록됩니다.",
  c7_evidence_turn_hold: "알고만 있으면 오늘은 안전합니다. 열여덟 번째 발령은 예정대로 작성됩니다.",
  c7_evidence_turn_share: "앞선 사람들이 알면 표는 혼자 서지 않습니다. 열일곱 명 중 몇이 답할지는 모릅니다.",
  c7_start_stand_signature: "그에게 보여주면 두 발령서는 같은 손글씨를 공유합니다. 그가 그 사실을 감당할지는 별개입니다.",
  c8_start_report: "의심거래 보고서(수상한 돈 흐름을 금융당국에 알리는 서류)는 기록에 남습니다. 앞선 세 번을 반려한 사람도 이번에는 이유를 적어야 합니다.",
  c8_start_copy: "기록 없는 사본은 들키지 않습니다. 법정에서도 존재한 적이 없는 자료가 됩니다.",
  c8_start_ask: "지점장에게 물으면 72시간 중 몇 시간이 순대 한 접시와 함께 사라집니다. 대신 반려의 이유가 사람의 입으로 나옵니다.",
  c8_trail_money: "돈만 따라가면 흔적은 깨끗합니다. 오진우는 그 깨끗함이 차갑다고 느낄 겁니다.",
  c8_trail_family: "가족 명의까지 올리면 목록은 길어집니다. 그 목록에는 이 일과 무관한 이름도 섞입니다.",
  c8_trail_split: "자료를 나누면 증거는 오염되지 않습니다. 나눈 만큼 시간이 들고, 오진우는 조금 서운해합니다.",
  c8_gallery_price: "감정평가는 그림값을 숫자로 만듭니다. 숫자가 되는 데 드는 돈과 시간은 당신이 냅니다.",
  c8_gallery_buyers: "찾아간 담당자들은 대개 시킨 대로 샀습니다. 그들의 이름이 먼저 흔들립니다.",
  c8_gallery_note: "수첩은 성실한 기록이지만 사적인 기록입니다. 증언이 되는 순간 반재욱도 증인석에 섭니다.",
  c8_bait_set: "유도된 거래는 선명합니다. 변호인은 그 선명함이 누가 만든 것인지부터 물을 겁니다.",
  c8_bait_stop: "보전 신청은 느리고 확실합니다. 오진우는 당신이 그의 칼을 뺏었다고 생각할 수 있습니다.",
  c8_bait_listen: "끝까지 들은 이야기는 계획을 늦춥니다. 대신 그 계획이 누구를 위한 것인지 처음으로 말해집니다.",
  c8_final_law: "법이 쥔 칼은 느리게 내려옵니다. 내려오는 동안 흔적표는 여러 사람의 손을 거칩니다.",
  c8_final_lever: "지렛대로 쓴 흔적은 사람을 살리는 데 쓰입니다. 벌은 그만큼 미뤄지고, 미룬 벌은 협상의 일부가 됩니다.",
  c8_final_press: "보도는 가장 빠른 칼입니다. 기사가 나가는 날 가장 먼저 다치는 사람은 대개 기사에 이름이 작게 나온 사람입니다.",
  c8_after_law: "도장이 찍힌 흔적표는 지점장의 30년도 함께 기록합니다. 그는 그걸 알고 찍었습니다.",
  c8_after_friend: "찾아간 친구는 문을 열어 줍니다. 그 사이 흔적표는 가방 안에서 하루를 더 기다립니다.",
  c8_after_blade: "혼자 쥔 칼은 언제든 쓸 수 있습니다. 누구도 그 칼을 쓴 이유를 대신 설명해 주지 않습니다.",
  c8_branch_ledger_a: "좋아하는 사람의 이름을 올리면 흔적표는 공정해집니다. 한서윤은 그날 처음으로 당신을 피하지 않습니다.",
  c8_branch_ledger_b: "스스로 말할 시간은 그를 증인으로 만듭니다. 그 시간 동안 흔적표에는 빈칸이 하나 남습니다.",
  c8_branch_ledger_c: "준 쪽만 쓰면 설계는 드러납니다. 받은 쪽의 3년은 그림처럼 벽에 걸린 채 남습니다.",
  c8_branch_ledger_follow_a: "금고에 들어간 그림은 증거물 번호를 받습니다. 한서윤은 그 번호를 오래 기억할 겁니다.",
  c8_branch_ledger_follow_b: "같이 서명하면 그는 혼자 신고한 사람이 아닙니다. 당신도 그 그림을 본 사람이 됩니다.",
  c8_branch_ledger_follow_c: "돌려보낸 그림은 다시 누군가의 벽에 걸립니다. 신고서 한 장은 그림보다 가볍습니다.",
  c8_evidence_turn_calendar: "달력 한 장은 긴 설명보다 강합니다. 열두 번의 우연은 누구도 우연이라고 부르지 못합니다.",
  c8_evidence_turn_hold: "접어 둔 달력은 협상을 유리하게 합니다. 그 사이 담보에서 밀려난 사람들은 이유를 모른 채 기다립니다.",
  c8_evidence_turn_share: "채권자들이 달력을 보면 흔적표는 혼자가 아닙니다. 소문도 그만큼 빨리 퍼집니다.",
  c9_start_meet: "따로 만난 자리에서는 은행 이름을 내려놓을 수 있습니다. 회의록에는 그 만남이 없습니다.",
  c9_start_table: "공식 절차 안의 회생안은 흔들리지 않습니다. 흔들리지 않는 만큼 느리고, 60시간은 빠르게 줄어듭니다.",
  c9_start_floor: "현장 숫자는 계산서에 없는 칸을 채웁니다. 새벽에 모은 숫자는 오후 회의에서 가장 늦게 읽힙니다.",
  c9_ledger_honest: "당신 칸이 채워지면 권도현은 제안을 읽기 시작합니다. 잃을 것을 적은 종이는 나중에 누구든 볼 수 있습니다.",
  c9_ledger_price: "보상을 적으면 거래가 됩니다. 거래는 동정보다 믿을 만하고, 동정보다 차갑습니다.",
  c9_ledger_blank: "비워 둔 칸은 선의처럼 보입니다. 권도현에게는 계산하지 않은 사람의 약속처럼 보입니다.",
  c9_family_charge: "고발은 179.6억에 이름을 붙입니다. 같은 날 권도현은 가족 재판의 증인이 됩니다.",
  c9_family_restore: "개인 재산으로 메운 피해는 빨리 돌아옵니다. 장부를 부풀린 사람은 법정에 서지 않습니다.",
  c9_family_choice: "그에게 맡기면 결정은 그의 것이 됩니다. 그 결정을 기다리는 동안 결의 시각은 다가옵니다.",
  c9_timing_strike: "착수 전날 밤의 제보는 첫날의 검사를 바꿉니다. 같은 부서의 권도현도 첫날부터 조사 대상 옆에 앉습니다.",
  c9_timing_warn: "먼저 알리면 그는 대비할 수 있습니다. 대비하는 사람 중에는 흔적을 지우고 싶은 사람도 있습니다.",
  c9_timing_after: "결의 뒤의 제보는 결의를 흔들지 않습니다. 그날 청산이 결정되면 1,140명은 그 결정 안에 있습니다.",
  c9_final_both: "두 장에 모두 서명하면 결의는 늦어질 수 있습니다. 늦어진 결의에는 살린 이유와 벌한 이유가 함께 적힙니다.",
  c9_final_rescue: "살리는 계산서만 올리면 결의는 부드럽게 통과합니다. 고발은 다음 달의 일이 되고, 다음 달은 늘 바쁩니다.",
  c9_final_punish: "벌하는 계산서는 정확합니다. 회생을 맡은 법원은 1,140명의 이름을 한 명씩 읽지 않습니다.",
  c9_after_stay: "남은 사람은 약속의 증인이 됩니다. 영동지점에는 복귀 지연 사유서가 한 장 더 쌓입니다.",
  c9_after_court: "증언은 계산서를 사실로 만듭니다. 법정은 새벽 네 시의 컵라면을 증거로 받지 않습니다.",
  c9_after_return: "조용히 돌아가면 결과는 뉴스로 듣습니다. 강태민은 다음에도 컵라면을 두 개 챙길지 잠깐 고민합니다.",
  c9_branch_father_a: "열한 명의 이름이 첫 장에 오면 회생안은 사람의 문서가 됩니다. 채권단은 그 장을 넘기고 숫자부터 봅니다.",
  c9_branch_father_b: "오늘 정하면 결의에 늦지 않습니다. 권도현은 아버지 병실에서 나온 지 한 시간 만에 가족을 고발할지 정해야 합니다.",
  c9_branch_father_c: "대신 맡은 협상은 당신의 하루를 씁니다. 권도현은 아버지가 기억하는 서른 명의 이름을 한 번 더 듣습니다.",
  c9_branch_father_follow_a: "맨 뒤의 사진은 아무도 먼저 말하지 않습니다. 끝까지 읽은 사람만 봅니다.",
  c9_branch_father_follow_b: "숫자로만 싸우면 반박당할 틈이 없습니다. 사진 속 서른 명은 다시 서랍으로 들어갑니다.",
  c9_branch_father_follow_c: "결의장에 선 열한 명은 가장 강한 자료입니다. 그들은 그날 하루치 일당을 잃습니다.",
  c9_evidence_turn_reappraise: "재평가는 숫자를 바로잡습니다. 바로잡는 데 드는 시간은 청산을 서두르는 쪽이 가장 싫어합니다.",
  c9_evidence_turn_hold: "결의장에서 꺼낸 출처는 극적입니다. 극적인 증거는 회의를 멈추고, 멈춘 회의는 다시 날짜를 잡습니다.",
  c9_evidence_turn_share: "그가 문제를 제기하면 자기 은행을 겨누는 셈입니다. 그 계산은 그가 가장 잘합니다.",

  c6_after_stand:
    "남겨 둔 자리는 그가 돌아올 수 있다는 뜻입니다. 돌아오지 않으면 그 자리가 매일 그것을 말합니다.",
  c6_after_open:
    "설정값이 열리면 두 사람 다 피험자가 됩니다. 관찰자석에 앉아 있던 시간도 함께 기록됩니다.",
  c6_after_name:
    "확정된 이름은 사건을 닫습니다. 닫은 방식이 이 조직의 다음 실패 처리 절차가 됩니다.",

  c6_branch_roof_a:
    "아는 대로 말하면 그는 처음으로 자기 조건을 가진 사람이 됩니다. 그 앎은 위로가 아니라 무게입니다.",
  c6_branch_roof_b:
    "옆에 서는 일은 아무것도 해결하지 않습니다. 해결하지 않는 것이 필요한 시간도 있습니다.",
  c6_branch_roof_c:
    "준비된 자료는 위원회를 이깁니다. 그가 먼저 꺼낸 질문은 다시 열리지 않습니다.",
  c6_branch_roof_follow_a:
    "당신이 건네면 그는 받습니다. 받는 순간 그 커피는 동정이 되고, 그는 그것을 압니다.",
  c6_branch_roof_follow_b:
    "자리를 만들면 관계는 당신을 거치지 않습니다. 대신 그 자리를 만드는 값은 당신이 냅니다.",
  c6_branch_roof_follow_c:
    "두고 간 컵은 식습니다. 위원회실에서 당신은 가장 먼저 도착한 사람이 됩니다.",

  c6_start_defend:
    "사람을 먼저 찾으면 그는 혼자가 아니게 됩니다. 다만 그 시간에 위원회는 당신 없이 자료를 읽습니다.",
  c6_start_record:
    "기록은 공평해 보입니다. 그 공평함이 사흘째 연락이 닿지 않는 사람에게도 공평한지는 다른 질문입니다.",
  c6_start_panel:
    "기한을 미루면 조사는 숨을 쉽니다. 미룬 값은 현금으로 청구되고, 그가 견뎌야 할 이틀도 함께 늘어납니다.",
  c6_desk_person:
    "그를 아는 사람들은 기록에 없는 것을 압니다. 동시에 그들이 지키고 싶은 것도 기록에 없습니다.",
  c6_desk_draft:
    "열한 번 지운 문장은 그가 무엇을 말하려다 멈췄는지 보여줍니다. 그가 지운 이유까지 보여주지는 않습니다.",
  c6_desk_seal:
    "봉인은 증거를 지킵니다. 봉인된 책상은 그가 돌아올 자리가 아니라 사건 번호가 됩니다.",
  c6_logs_tell:
    "자기 조건을 아는 사람만이 그것을 거절할 수 있습니다. 그리고 그 앎은 되돌릴 수 없습니다.",
  c6_logs_shield:
    "범위를 좁히면 그의 판단은 지켜집니다. 좁힌 범위는 다음 사람에게도 그대로 적용됩니다.",
  c6_logs_expose:
    "두 프로필을 함께 올리면 실험은 처음으로 대칭이 됩니다. 당신의 기록도 같은 날 열립니다.",
  c6_panel_respect:
    "그의 뜻을 지키는 변론은 그를 사람으로 둡니다. 위원회는 사람이 아니라 사유서를 읽습니다.",
  c6_panel_submit:
    "동의 없는 제출은 그를 살릴 수 있습니다. 살아남은 그는 자기 사건의 증인이 아니라 자료가 됩니다.",
  c6_panel_both:
    "놓친 것과 걸린 것을 같은 장에 쓰면 어느 쪽도 변명이 되지 않습니다. 대신 어느 쪽도 그를 구하지 않습니다.",
  c6_final_person:
    "이름을 빼면 오늘은 아무도 무너지지 않습니다. 닫히지 않은 사건 05는 다음 사람의 책상으로 갑니다.",
  c6_final_record:
    "설정값이 열리면 실험은 조사 대상이 됩니다. 그 조사에서 가장 먼저 읽히는 것은 당신의 시즌입니다.",
  c6_final_close:
    "세운 이름 하나로 사건은 오늘 닫힙니다. 그 이름은 내일부터 이 조직이 실패를 처리하는 방식이 됩니다.",

  layoff:
    "그 선택은 시간을 벌지만 현장 직원 18명에게 손실을 집중시킵니다. 협력사와 직원 중 누구의 손실을 먼저 줄일 겁니까?",
  funding:
    "단기 자금은 가장 깔끔해 보입니다. 다만 회계 인식 문제가 드러나면 새 자금은 책임 회피로 보일 수 있습니다.",
  start_sale:
    "핵심 사업부 매각은 생존 가능성을 높입니다. 하지만 넥스트마일가 이 상황을 이용하고 있다는 점도 무시할 수 없습니다.",
  accounting_disclosure:
    "투명성은 신뢰를 회복할 수 있습니다. 동시에 투자 협상은 즉시 중단될 수 있습니다. 이 손실을 감당할 준비가 있습니까?",
  accounting_delay:
    "공개를 미루면 회사는 하루를 더 얻습니다. 그러나 내일 급여를 기다리는 사람들은 아무것도 모른 채 위험을 떠안습니다.",
  start_investigate:
    "추가 조사는 판단의 질을 높입니다. 대신 남은 시간은 줄고, 결정 지연 자체가 새로운 손실이 됩니다.",
  payday_negotiate:
    "협상은 판을 넓힙니다. 상대방이 양보할 이유를 제시하지 못하면 시간만 잃습니다.",
  competitor_report:
    "책임 규명은 필요합니다. 그러나 지금 처벌을 앞세우면 생존 협상과 직원 보호가 동시에 흔들릴 수 있습니다.",
  c2_start_verify:
    "로그는 강한 증거입니다. 다만 시스템이 기록한 사실과 사람이 실제로 한 행동은 항상 같은 것이 아닙니다.",
  c2_start_meet:
    "사람을 먼저 만나면 숨은 동기를 찾을 수 있습니다. 대신 증거 보존과 보고 의무를 늦춘 책임은 당신에게 남습니다.",
  isolate:
    "접근 권한 차단은 피해 확산을 막습니다. 그러나 무고한 사람이라면 당신이 먼저 처벌을 시작한 셈입니다.",
  escalate:
    "상급자 공유는 안전합니다. 동시에 사건 해석권을 넘기는 선택이기도 합니다.",
  c2_meeting_shadow:
    "비공식 재검증은 판을 넓힙니다. 하지만 절차 밖에서 움직인 순간, 당신의 판단도 조사 대상이 될 수 있습니다.",
  c3_start_fast:
    "속도는 경쟁에서 유리합니다. 하지만 빠른 결론은 상대가 설계한 문제의 틀 안에서만 이기는 방식일 수 있습니다.",
  c3_start_deep:
    "추가 분석은 질을 높입니다. 대신 오진우가 먼저 결과를 제출하면 당신의 판단은 방어 논리처럼 보일 수 있습니다.",
  c3_start_mirror:
    "상대의 전략을 복제하면 격차를 줄일 수 있습니다. 그러나 그 순간 당신의 사고는 경쟁자가 만든 경로를 따라갑니다.",
  c3_split_invert:
    "문제 정의를 바꾸는 선택입니다. 성공하면 판을 가져오지만, 실패하면 시간만 잃은 것으로 기록됩니다.",
  c4_start_approve:
    "성과를 얻는 선택입니다. 하지만 한 번 예외를 허용하면 다음 예외의 기준도 당신이 설명해야 합니다.",
  c4_start_refuse:
    "원칙을 지키는 선택입니다. 다만 그 원칙 때문에 구할 수 있었던 사람들이 손실을 떠안을 수도 있습니다.",
  c4_start_contain:
    "위반을 통제하려는 선택입니다. 그러나 통제된 위반이라는 말이 실제로 가능한지 증명해야 합니다.",
  c4_leak_expose:
    "공개는 정당성을 높입니다. 동시에 협상력과 속도를 잃게 만들 수 있습니다.",
  c5_start_map:
    "구조를 보는 선택입니다. 다만 구조를 보는 동안 지금 피해를 입는 사람들은 답을 기다립니다.",
  c5_start_blame:
    "책임자를 지정하면 행동은 빨라집니다. 그러나 잘못된 단일 원인은 시스템 실패를 다시 반복하게 만들 수 있습니다.",
  c5_start_redesign:
    "시스템을 바꾸는 선택입니다. 효과는 크지만 당장의 책임 요구를 만족시키기 어렵습니다.",
  f_archive_seal:
    "기록을 봉인하면 악용 가능성은 줄어듭니다. 동시에 이 지식으로 해결할 수 있는 사건들도 닫힙니다.",
  f_archive_reform:
    "방식을 바꾸려는 선택입니다. 그러나 시스템을 남기는 순간 누군가 다시 악용할 가능성도 남습니다.",
  f_archive_destroy:
    "무너뜨리는 선택입니다. 빠르고 명확하지만, 그 안에 남은 피해자 구제 도구까지 사라질 수 있습니다.",
  default:
    "그 판단을 유지하려면 숨은 피해자와 비용을 다시 계산해야 합니다. 같은 원칙을 더 불리한 조건에서도 적용하시겠습니까?",
  c1_branch_people_a:
    "이름을 먼저 적으면 협상은 느려집니다. 대신 그 사람들은 자신이 숫자가 아니었다는 사실을 기록으로 갖게 됩니다.",
  c1_branch_people_b:
    "지급일 고정은 가장 약한 고리를 먼저 붙잡는 방식입니다. 다만 그 현금은 직원 급여에서 옮겨온 것입니다.",
  c1_branch_people_c:
    "조건만 남기면 거래는 성립합니다. 그러나 빈칸은 사라지지 않고, 나중에 다른 사람이 다른 이름으로 채우게 됩니다.",
  c1_branch_people_follow_a:
    "공개된 약속은 되돌리기 어렵습니다. 그것이 보호 장치이자, 당신이 지지 못할 때 가장 먼저 겨눠질 증거입니다.",
  c1_branch_people_follow_b:
    "계약 밖의 조건을 받아들이면 신뢰는 올라갑니다. 다만 그 예외를 요구할 다음 전화가 반드시 걸려옵니다.",
  c1_branch_people_follow_c:
    "기준을 하나로 두면 다툼은 줄어듭니다. 그러나 계약서에 이름이 없던 사람들에게는 그 기준이 곧 배제의 통보입니다.",
  protect:
    "사람을 먼저 지키면 회사의 생존 확률은 줄어듭니다. 지킨 고용이 두 달 뒤 함께 사라진다면, 그 선택은 무엇을 지킨 것입니까?",
  survive:
    "생존은 다른 모든 선택의 전제입니다. 다만 살아남은 회사가 어떤 회사인지는 지금 정해집니다.",
  justice:
    "책임 규명은 신뢰의 바닥을 다시 놓습니다. 그러나 오늘 밤 급여를 기다리는 사람에게 그 바닥은 아직 아무것도 아닙니다.",
  c1_after_people:
    "직접 설명하면 오해는 줄어듭니다. 대신 약속의 빈틈도 그 자리에서 드러납니다.",
  c1_after_numbers:
    "숫자를 공개하면 논쟁의 기준이 생깁니다. 다만 숫자는 누가 먼저 아파야 하는지까지는 말해주지 않습니다.",
  c1_after_silence:
    "침묵은 시간을 벌어줍니다. 그 시간 동안 사람들은 스스로 최악의 이야기를 만들어 채웁니다.",
  c2_branch_records_a:
    "둘 다 남기면 나중에 비교할 수 있습니다. 대신 지금 결론을 내려야 할 시간은 그만큼 줄어듭니다.",
  c2_branch_records_b:
    "진술은 맥락을 줍니다. 그러나 진술은 시간이 지날수록 기억이 아니라 해석으로 바뀝니다.",
  c2_branch_records_c:
    "오류로 닫으면 보고는 깔끔해집니다. 11초 동안 누가 무엇을 했는지는 영영 질문되지 않습니다.",
  c2_branch_records_follow_a:
    "확인 권한은 방어권입니다. 동시에 진술을 다듬을 기회이기도 합니다.",
  c2_branch_records_follow_b:
    "외부 검증은 당신의 판단을 단단하게 만듭니다. 그 검증은 당신의 절차도 함께 봅니다.",
  c2_branch_records_follow_c:
    "결론만 남기면 읽기 쉬워집니다. 대신 그 결론을 의심할 도구도 함께 사라집니다.",
  c2_after_audit:
    "보관자를 조사하면 흐름이 복원됩니다. 그 조사 대상 목록에 당신의 접근 기록도 들어 있습니다.",
  c2_after_person:
    "직접 묻는 것은 빠릅니다. 다만 이 대화 자체가 나중에 회유로 읽힐 수 있습니다.",
  c2_after_public:
    "즉시 공개는 은폐를 막습니다. 확증 없이 던진 의심은 무고한 사람을 먼저 태울 수도 있습니다.",
  c3_branch_signal_a:
    "공개 질문은 방해를 무력화합니다. 대신 당신이 준비하지 못한 답까지 그 자리에서 요구됩니다.",
  c3_branch_signal_b:
    "멈추면 사실을 얻습니다. 관객은 멈춤 자체를 자신 없음으로 읽을 수도 있습니다.",
  c3_branch_signal_c:
    "무시하면 승부는 끝납니다. 그 신호가 고객의 마지막 확인 요청이었다면 승리는 오늘까지만 유효합니다.",
  c3_branch_signal_follow_a:
    "기한은 성과를 검증 가능하게 만듭니다. 동시에 당신이 실패할 날짜를 스스로 정하는 일입니다.",
  c3_branch_signal_follow_b:
    "책임을 나누면 실행이 단단해집니다. 다음 경쟁에서 그 사람은 당신의 상대가 될 수도 있습니다.",
  c3_branch_signal_follow_c:
    "수치는 즉시 설득합니다. 빈칸은 사라지지 않고 다음 경쟁의 첫 질문이 됩니다.",
  c3_after_share:
    "합치면 고객이 얻습니다. 당신이 이겼다는 기록은 어디에도 남지 않습니다.",
  c3_after_proof:
    "결함 공개는 다음 사고를 막습니다. 그 결함을 통과시킨 심사 절차도 함께 드러납니다.",
  c3_after_win:
    "허점을 쓰면 격차는 벌어집니다. 같은 방식이 당신에게 쓰일 때 항의할 근거는 줄어듭니다.",
  c4_branch_exception_a:
    "공개된 예외는 규칙이 됩니다. 그때부터 당신은 그 규칙을 지켜야 하는 쪽이 됩니다.",
  c4_branch_exception_b:
    "보상은 즉시 통합니다. 다만 원인을 바꾸지 않은 보상은 다음 피해자를 위한 예산이 됩니다.",
  c4_branch_exception_c:
    "조용한 승인은 오늘을 구합니다. 조용했기 때문에 다음에 거절할 근거도 남지 않습니다.",
  c4_branch_exception_follow_a:
    "함께 공개하면 신뢰가 회복됩니다. 그 문서는 당신의 판단 오류도 같은 페이지에 싣습니다.",
  c4_branch_exception_follow_b:
    "범위를 나눠 정하면 정당성이 생깁니다. 대신 당신이 보고 싶지 않은 곳까지 열리게 됩니다.",
  c4_branch_exception_follow_c:
    "좋은 결과는 훌륭한 변론입니다. 그러나 결과로 절차를 닫으면, 결과가 나쁜 날에는 아무 변론도 남지 않습니다.",
  c4_after_rule:
    "기준을 세우면 줄은 정리됩니다. 이미 예외를 받은 쪽과 못 받은 쪽의 차이는 그대로 남습니다.",
  c4_after_service:
    "두 번째 예외는 첫 번째보다 쉽습니다. 그것이 이 선택의 진짜 비용입니다.",
  c4_after_stop:
    "중단은 절차를 지킵니다. 그 사이에 끊기는 서비스의 이름도 명단에 적어두십시오.",
  c5_branch_owner_a:
    "자기 이름을 먼저 적으면 조사는 정직해집니다. 동시에 당신이 가장 다루기 쉬운 표적이 됩니다.",
  c5_branch_owner_b:
    "장치 복구는 다음 피해를 막습니다. 이번 피해자는 아직 아무 답도 받지 못했습니다.",
  c5_branch_owner_c:
    "한 사람으로 닫으면 조직은 빨리 회복합니다. 같은 구조가 다음 사람을 같은 자리에 세웁니다.",
  c5_branch_owner_follow_a:
    "이름과 조치를 같이 남기면 기록은 완전해집니다. 그 사람은 평생 그 문서와 함께 검색됩니다.",
  c5_branch_owner_follow_b:
    "예산이 붙은 약속만 다음 해까지 살아남습니다. 그 예산은 다른 곳에서 잘려 나온 것입니다.",
  c5_branch_owner_follow_c:
    "사과는 국면을 닫습니다. 닫힌 국면 안에서 원인은 그대로 작동합니다.",
  c5_after_owner:
    "먼저 책임지면 논의가 시작됩니다. 책임진 사람이 개선까지 맡으면 검증할 사람이 사라진다는 점도 남습니다.",
  c5_after_system:
    "구조를 고치면 다음이 안전해집니다. 오늘 떠난 사람의 자리는 그 설계 어디에도 적히지 않습니다.",
  c5_after_name:
    "이름 하나로 회의는 닫힙니다. 그 다음 회의는 아무도 먼저 말하지 않는 회의가 됩니다.",
  f_branch_witness_a:
    "공개하면 실험의 대상이 실험을 읽게 됩니다. 그 순간부터 당신의 기록도 그들의 자료입니다.",
  f_branch_witness_b:
    "삭제 흔적은 의도를 드러냅니다. 복원된 문장이 당신이 기대한 문장이 아닐 수도 있습니다.",
  f_branch_witness_c:
    "결론만 받아들이면 오늘은 끝납니다. 빈칸을 남긴 사람은 당신이 그럴 것을 이미 계산했습니다.",
  f_branch_witness_follow_a:
    "모두가 읽으면 은폐는 불가능해집니다. 동시에 누구도 맥락 없이 읽는 것을 막을 수 없습니다.",
  f_branch_witness_follow_b:
    "독립 검토는 신뢰를 만듭니다. 검토가 끝날 때까지 참가자들은 계속 모른 채로 남습니다.",
  f_branch_witness_follow_c:
    "문을 닫으면 당신은 안전합니다. 다음 참가자는 당신이 받은 것과 똑같은 빈칸을 받게 됩니다.",
  ending_seal:
    "봉인은 악용을 막습니다. 그리고 당신이 알아낸 것을 필요로 할 사람에게도 똑같이 닫힙니다.",
  ending_reform:
    "규칙은 힘을 길들입니다. 규칙을 만드는 자리에 계속 앉아 있을 수 있느냐가 남은 질문입니다.",
  ending_expose:
    "외부는 멈출 힘이 있습니다. 멈춘 뒤에 무엇을 세울지는 외부의 관심사가 아닙니다.",
  f_after_witness:
    "보존된 기록은 언젠가 말합니다. 그 기록 안에는 당신이 침묵했던 장면도 같이 남아 있습니다.",
  f_after_control:
    "동의는 실험을 정당하게 만듭니다. 정당해진 실험은 멈추기가 훨씬 더 어려워집니다.",
  f_after_burn:
    "태우면 악용은 끝납니다. 피해를 증명할 유일한 자료도 같은 불에 들어갑니다.",
  competitor_sale:
    "제안을 테이블에 올리면 조건은 투명해집니다. 다만 급한 쪽이 누구인지도 같은 표에 드러납니다.",
  accounting_investigate:
    "분리 면담은 진술의 차이를 드러냅니다. 대신 팀은 자신들이 조사 대상이 됐다는 것을 먼저 알게 됩니다.",
  payday_disclosure:
    "먼저 알리면 사람들은 대비할 수 있습니다. 그 대비 중 하나가 퇴사라는 것도 각오해야 합니다.",
  payday_delay:
    "확정 뒤에 말하면 혼선은 줄어듭니다. 그러나 그 하루를 모르고 보낸 사람은 선택할 기회를 잃습니다.",
  competitor_negotiate:
    "한 테이블은 조건을 비교 가능하게 만듭니다. 대신 가장 약한 쪽의 요구가 가장 먼저 깎일 자리이기도 합니다.",
  c2_start_report:
    "기록만으로 쓴 보고는 빠릅니다. 그 보고가 사람의 이름을 먼저 굳힌다는 점은 남습니다.",
  c2_meeting_report:
    "절차는 공정해 보입니다. 다만 절차 안에서 이민서는 설명할 자리를 스스로 만들어야 합니다.",
  c2_pressure_report:
    "종결은 조직을 안정시킵니다. 그 안정의 값을 누가 냈는지는 보고서에 적히지 않습니다.",
  c2_meeting_meet:
    "알리바이를 먼저 보면 사람의 시간이 기록보다 앞섭니다. 그 순서가 뒤집히면 되돌리기 어렵습니다.",
  c2_logs_verify:
    "대조는 조작을 드러냅니다. 대조할 사본이 이미 같은 손을 거쳤다면 무엇도 드러나지 않습니다.",
  c2_pressure_verify:
    "30분은 반증에는 짧고 변명에는 충분합니다. 못 찾으면 동의한 것으로 기록됩니다.",
  c2_pressure_shadow:
    "전제를 흔들면 보고서 전체가 흔들립니다. 대신 다음 보고서를 쓸 사람도 당신이 됩니다.",
  c3_score_fast:
    "점수에 맞추면 점수는 오릅니다. 잘려 나간 항목이 실패의 자리라는 것도 함께 기록됩니다.",
  c3_split_deep:
    "증명은 강합니다. 증명이 끝나기 전에 결정이 내려지면 아무 힘도 없습니다.",
  c3_score_deep:
    "출처를 확인하면 판단이 단단해집니다. 확인하는 동안 제보자는 노출됩니다.",
  c3_trap_deep:
    "공동안은 검증을 두 배로 만듭니다. 동시에 당신의 근거도 상대의 자산이 됩니다.",
  c3_split_mirror:
    "경쟁 지표는 따라잡힙니다. 따라잡는 동안 무엇을 지표에서 뺐는지는 기록되지 않습니다.",
  c3_trap_mirror:
    "발표는 이길 수 있습니다. 이긴 발표가 검증을 대신하지는 못합니다.",
  c3_score_invert:
    "기준을 문제 삼으면 이번 경쟁은 늦어집니다. 다음 경쟁부터는 다른 표로 시작합니다.",
  c3_trap_invert:
    "설계를 공개하면 판이 멈춥니다. 멈춘 판에서 먼저 손해를 보는 쪽이 당신일 수도 있습니다.",
  c4_offer_approve:
    "기록이 없으면 이번은 조용합니다. 다음에 같은 요청을 받을 때 거절할 근거도 없습니다.",
  c4_leak_approve:
    "부인은 시간을 법니다. 제보자가 두 번째 자료를 가지고 있으면 그 시간은 부채가 됩니다.",
  c4_vote_approve:
    "서비스는 유지됩니다. 유지의 근거가 예외라면, 다음 예외의 크기는 당신이 정하지 못합니다.",
  c4_offer_refuse:
    "규칙은 지켜집니다. 다른 자금을 못 찾으면 지킨 규칙이 서비스를 끝냅니다.",
  c4_vote_refuse:
    "공식화된 손실은 다시 논의할 수 있습니다. 그 논의가 열리기 전에 이용자는 먼저 잃습니다.",
  c4_offer_contain:
    "각주는 정직함의 최소치입니다. 읽히지 않는 각주는 남기지 않은 것과 같습니다.",
  c4_leak_contain:
    "엠바고는 정확도를 높입니다. 조건을 지키지 못하면 다음 기사는 조건 없이 나갑니다.",
  c4_vote_contain:
    "묶인 조건은 예외를 규칙으로 바꿉니다. 감사가 형식이 되면 규칙만 남고 감시는 사라집니다.",
  f_start_contain:
    "내부 설명은 관계를 지킵니다. 설명할 사람이 설계자와 같은 편이면 시간만 지납니다.",
  f_start_expose:
    "공개는 실험을 멈출 수 있습니다. 멈춘 뒤 참가자들의 기록을 누가 지킬지는 정해지지 않았습니다.",
  c5_map_blame:
    "놓친 사람을 부르면 답은 빨라집니다. 그 사람도 같은 표를 보고 있었다는 사실은 남습니다.",
  c5_blame_blame:
    "발표는 분노를 가라앉힙니다. 가라앉은 자리에서 구조는 그대로 다음 사건을 준비합니다.",
  c5_collapse_blame:
    "익숙한 답은 실행이 쉽습니다. 같은 답이 세 번 반복됐다는 기록도 함께 남습니다.",
  c5_map_map:
    "공통점을 찾으면 기준의 결함이 보입니다. 찾는 동안 그 사람들은 계속 밀려 있습니다.",
  c5_blame_map:
    "구조를 주어로 쓰면 반복은 줄어듭니다. 대신 오늘 사과를 기다린 사람은 아무 이름도 듣지 못합니다.",
  c5_collapse_map:
    "피해자 기준은 가장 정직한 설계입니다. 가장 느리고 가장 비싼 설계이기도 합니다.",
  f_start_map:
    "당신의 경로를 따라가면 설계가 보입니다. 그 경로를 따라간 기록도 함께 남습니다.",
  c5_map_redesign:
    "임시 가중치는 지금 사람을 지킵니다. 임시라는 말이 다음 분기에도 남으면 규칙이 됩니다.",
  c5_blame_redesign:
    "묶으면 미룰 수 없습니다. 묶인 만큼 어느 하나가 늦어지면 전부가 늦어집니다.",
  c5_collapse_redesign:
    "역가중치는 침묵의 비용을 줄입니다. 그 무게를 누가 대신 지는지도 표에 적어야 합니다.",
  f_confront_destroy:
    "폭로는 실험을 끝냅니다. 끝난 실험의 참가자 기록은 누구의 것도 아니게 됩니다.",
  f_confront_reform:
    "규칙을 직접 쓰면 통제권이 옵니다. 그 규칙의 첫 적용 대상도 당신입니다.",
  f_confront_seal:
    "봉인은 당신을 지킵니다. 봉인된 기록은 다음 참가자를 지키는 데도 쓰이지 못합니다.",
  f_confront_pact:
    "직접 맺은 약속은 가장 빨리 지켜집니다. 그 약속을 검증할 사람이 당신뿐이라는 것도 같이 남습니다.",
  c2_start_people_report:
    "지난 사건에서 사람을 먼저 세운 사람이 이번엔 기록을 먼저 냅니다. 그 전환을 팀도 봅니다.",
  c2_start_people_meet:
    "같은 방식을 두 번 쓰면 원칙이 됩니다. 원칙은 예측 가능해지고, 예측 가능한 것은 이용됩니다.",
  c2_start_people_verify:
    "지난번의 보호를 정당화하려면 이번 검증은 더 엄격해야 합니다. 그 부담은 당신 몫입니다.",
  c2_start_records_report:
    "공개한 숫자가 사건의 입구가 됐습니다. 같은 방식으로 닫으면 책임의 선이 분명해집니다.",
  c2_start_records_meet:
    "숫자를 공개한 사람이 사람을 만나러 가면, 조직은 그 전환의 이유를 묻습니다.",
  c2_start_records_verify:
    "자신이 공개한 자료를 의심하는 일은 느립니다. 그러나 그 순서를 건너뛰면 나머지 판단이 다 흔들립니다.",
  c2_start_silence_report:
    "지난번의 침묵이 이번의 속도를 만듭니다. 서두른 보고가 또 다른 침묵을 덮지 않도록 하십시오.",
  c2_start_silence_meet:
    "미룬 말은 사라지지 않고 상대에게 도착합니다. 지금 만나는 것은 사과가 아니라 순서의 수정입니다.",
  c2_start_silence_verify:
    "당신이 말하지 않은 것이 남의 손에 먼저 있습니다. 검증의 결과가 자신을 향할 수도 있습니다.",
  c3_start_audit_fast:
    "근거가 있는 속도는 다릅니다. 다만 상대는 그 근거를 읽지 않고 결론만 봅니다.",
  c3_start_audit_deep:
    "복원의 습관이 검증의 습관이 됩니다. 두 번 다 느렸다는 평가도 함께 쌓입니다.",
  c3_start_audit_mirror:
    "지운 흔적을 찾아본 사람은 상대의 공백을 먼저 봅니다. 그 시선이 이번엔 추측이 됩니다.",
  c3_start_person_fast:
    "보호의 비용을 성과로 덮으려는 선택입니다. 덮은 비용은 사라지지 않고 자리를 옮깁니다.",
  c3_start_person_deep:
    "사람을 믿은 판단을 지키려면 다른 곳에서 근거를 더 가져와야 합니다.",
  c3_start_person_mirror:
    "상대는 이미 당신의 지난 결정을 자료로 씁니다. 대응은 늦게 시작됩니다.",
  c3_start_public_fast:
    "먼저 알린 사람에게는 먼저 답할 의무가 붙습니다. 그 의무가 속도를 강제합니다.",
  c3_start_public_deep:
    "공개는 시작이고 증명은 부담입니다. 지금 멈추면 경보만 남습니다.",
  c3_start_public_mirror:
    "공개된 위험은 모두의 자원이 됩니다. 상대가 먼저 쓰기 전에 읽어야 합니다.",
  c4_start_joint_approve:
    "공동안이 예외의 명분이 됩니다. 파트너도 같은 명분을 다음에 씁니다.",
  c4_start_joint_refuse:
    "함께 만든 것을 함께 포기하는 일입니다. 파트너가 같은 선택을 할지는 별개입니다.",
  c4_start_joint_contain:
    "공동 작업에는 공동 감시가 따라야 합니다. 어느 쪽도 혼자 풀 수 없게 됩니다.",
  c4_start_proof_approve:
    "정직의 비용을 예외로 메우는 선택입니다. 두 기록이 같은 파일에 남습니다.",
  c4_start_proof_refuse:
    "일관성은 가장 비싼 자산입니다. 이번에는 서비스가 그 값을 냅니다.",
  c4_start_proof_contain:
    "지난번의 공개가 이번 조건의 신뢰를 만듭니다. 조건을 어기면 둘 다 잃습니다.",
  c4_start_win_approve:
    "성공의 기억이 기준을 미리 넓혀 둡니다. 그 기억은 다음 예외도 승인합니다.",
  c4_start_win_refuse:
    "승자가 규칙을 지키면 규칙이 강해집니다. 이번 손실은 그 값입니다.",
  c4_start_win_contain:
    "성공을 조건과 함께 넘기면 재현 가능해집니다. 재현 가능한 것은 검증도 가능합니다.",
  c5_start_rule_blame:
    "기준을 만든 사람이 그 기준을 따른 사람을 조사합니다. 순서가 이상하다는 것을 모두가 압니다.",
  c5_start_rule_map:
    "자기 규칙의 실패를 그리는 일은 느리고 정확합니다. 그 사이 피해는 계속됩니다.",
  c5_start_rule_redesign:
    "만든 규칙을 스스로 끄는 선택입니다. 다시 켤 조건을 지금 적어야 합니다.",
  c5_start_service_blame:
    "예외를 승인한 것은 당신이고 실행한 것은 그 사람입니다. 조사는 한쪽에서만 시작됩니다.",
  c5_start_service_map:
    "지킨 것을 세는 표와 밀려난 사람을 세는 표는 다릅니다. 두 표를 겹쳐야 실패가 보입니다.",
  c5_start_service_redesign:
    "임시 체계는 서비스를 살립니다. 임시가 길어지면 그것이 기준이 됩니다.",
  c5_start_stop_blame:
    "중단을 승인한 사람이 중단의 책임을 묻습니다. 답하는 쪽은 그 순서를 기억합니다.",
  c5_start_stop_map:
    "중단의 공백은 기록이 얇습니다. 그리는 동안 조용한 피해가 계속 쌓입니다.",
  c5_start_stop_redesign:
    "복구가 조사보다 앞섭니다. 원인은 복구된 시스템 위에서 찾아야 합니다.",
  f_start_owner_map:
    "책임을 적은 사람의 기록은 가장 많이 인용됩니다. 인용의 경로가 곧 실험의 설계도입니다.",
  f_start_owner_expose:
    "이름을 걸었던 사람의 공개는 무겁습니다. 그 무게가 다음 참가자에게도 걸립니다.",
  f_start_owner_contain:
    "안에서 먼저 묻는 것은 관계를 지킵니다. 그 관계가 답을 늦추는 이유가 되기도 합니다.",
  f_start_system_map:
    "고친 구조가 실험의 도구가 됐다면, 개선과 이용의 경계를 다시 그려야 합니다.",
  f_start_system_expose:
    "규칙을 만든 사람의 폭로는 규칙의 신뢰를 흔듭니다. 그래도 이 규칙은 공개돼야 합니다.",
  f_start_system_contain:
    "자기 규칙의 적용을 묻는 일입니다. 아니라는 답이 오면 규칙은 형식이었습니다.",
  f_start_name_map:
    "지목은 사건을 닫았지만 데이터로는 열려 있었습니다. 그 경로를 보는 것이 첫 수습입니다.",
  f_start_name_expose:
    "지목으로 닫은 사람이 공개로 여는 일입니다. 두 결정이 같은 기록에 나란히 남습니다.",
  f_start_name_contain:
    "절차를 물으면 절차가 답합니다. 지목당한 사람은 그 답에 포함되지 않습니다.",

  // Route scenes. Echo argues the cost of the choice back at the player, so a
  // shared "이 선택은 다음 질문의 기준을 바꿉니다" said nothing on any of them.
  c1_route_layoff_notice: "먼저 알리면 절감안은 흔들리지만, 통보가 통보로 끝나지 않습니다.",
  c1_route_layoff_fast: "늦춘 통보는 숫자를 지키지만, 알게 된 순서를 사람들이 오래 기억합니다.",
  c1_route_layoff_protect: "한 사람을 빼는 순간 명단은 기준이 됩니다. 그 기준을 설명할 수 있어야 합니다.",
  c1_final_layoff_a: "기준을 먼저 보내면 반박이 들어옵니다. 그 반박이 명단의 오류를 줄입니다.",
  c1_final_layoff_b: "순서를 나중에 정하면, 가장 늦게 듣는 사람이 늘 정해져 있습니다.",
  c1_final_layoff_c: "위에서 먼저 깎으면 절감액은 줄고, 명단의 설득력은 올라갑니다.",
  c1_route_funding_clause: "조항을 열면 협상은 길어지지만, 설명할 권한은 남습니다.",
  c1_route_funding_accept: "시간은 확보되지만, 그 시간 동안 무엇을 말할 수 있는지는 상대가 정합니다.",
  c1_route_funding_split: "절반의 자금은 절반의 시간입니다. 대신 문장의 주어가 바뀌지 않습니다.",
  c1_final_funding_a: "전문을 열면 투자자는 불편해지고, 다음 협상의 기준선은 단단해집니다.",
  c1_final_funding_b: "입금은 빨라지고, 조건을 모르는 사람들이 그 조건의 비용을 냅니다.",
  c1_final_funding_c: "적게 받은 돈은 빨리 떨어집니다. 대신 아무도 당신의 문장을 고치지 않습니다.",
  c1_route_sale_clean: "분리에는 시간이 듭니다. 그 시간이 나중에 증거의 주인을 지킵니다.",
  c1_route_sale_bundle: "묶음은 빠르게 팔리고, 무엇이 함께 팔렸는지는 나중에 밝혀집니다.",
  c1_route_sale_hold: "고지는 매각가를 떨어뜨리지만, 고객의 선택권을 되돌립니다.",
  c1_final_sale_a: "빠진 항목을 공지하면 인수자는 값을 낮춥니다. 로그는 회사에 남습니다.",
  c1_final_sale_b: "계약은 성사되고, 고객은 자기 기록이 어디로 갔는지 마지막에 압니다.",
  c1_final_sale_c: "보존 의무는 계약서에 남고, 지켜지는지는 다음 사람이 확인해야 합니다.",
  c1_route_investigate_freeze: "멈추면 손실은 커지지만, 같은 빈칸이 네 번째로 반복되지 않습니다.",
  c1_route_investigate_shadow: "조용한 추적은 속도를 지키지만, 들키는 순간 조사 자체가 의심받습니다.",
  c1_route_investigate_share: "공개된 조사에는 참여자가 늘고, 결론의 주인은 당신 혼자가 아니게 됩니다.",
  c1_final_investigate_a: "작성자를 공개하면 세 안건은 다시 열립니다. 오늘의 결론은 늦어집니다.",
  c1_final_investigate_b: "가장 빠른 안건은 오늘을 삽니다. 누락 로그는 다음 사건에서 다시 나타납니다.",
  c1_final_investigate_c: "권한을 넘기면 결과를 기다려야 합니다. 대신 결론에 당신의 이해가 섞이지 않습니다.",
  c1_route_system_trace: "표의 이력을 열면 사건은 회계 문제에서 설계 문제로 옮겨 갑니다.",
  c1_route_system_use: "표를 건드리지 않으면 오늘은 빨라지고, 같은 표가 다음 사건도 통과시킵니다.",
  c1_route_system_open: "밖에서 읽히는 순간 기준은 회사의 것이 아니라 기록이 됩니다.",
  c1_final_system_a: "재심사는 시간을 크게 쓰지만, 세 위기가 하나의 원인으로 정리됩니다.",
  c1_final_system_b: "덮은 기준표는 다음 사건에서 같은 빈칸을 다시 만들어 냅니다.",
  c1_final_system_c: "권한을 넘기면 당신의 기준은 약해지고, 그 기준을 검증할 사람이 생깁니다.",
  c1_evidence_turn_public: "작성자가 드러나면 기준표는 실수가 아니라 결정이 됩니다.",
  c1_evidence_turn_private: "이름을 가린 수정은 빠릅니다. 같은 사람이 다음 표도 씁니다.",
  c1_evidence_turn_transfer: "검증권을 넘기면 이번 결론은 늦어지고, 다음 사건의 시작은 달라집니다.",

  c2_evidence_turn_guard: "열람권이 돌아가면 진술은 방어가 아니라 검증이 됩니다.",
  c2_evidence_turn_stamp: "외부로 나간 증거는 되돌릴 수 없고, 조직의 대응도 되돌릴 수 없습니다.",
  c2_evidence_turn_delay: "복원된 로그는 진술을 지킵니다. 그동안 증언자는 혼자 기다립니다.",

  c3_route_fast_lock: "기한을 붙이면 승기는 약해지고, 이긴 뒤의 책임은 명확해집니다.",
  c3_route_fast_polish: "다듬은 숫자는 오늘 이깁니다. 생략한 항목은 계약서 안에서 기다립니다.",
  c3_route_fast_reopen: "생략을 스스로 열면 점수는 떨어지고, 다음 질문의 기준은 당신이 잡습니다.",
  c3_final_win_a: "계약에 들어간 기한은 다음 입찰에도 남습니다. 이번 마진은 줄어듭니다.",
  c3_final_win_b: "고객은 같은 속도를 다음 사람에게도 요구합니다. 그 사람은 당신이 아닙니다.",
  c3_final_win_c: "목록을 넘기면 신뢰는 오르고, 이번 계약의 조건은 다시 열립니다.",
  c3_route_deep_attach: "첫 장의 결함은 읽히지 않을 수 없습니다. 입찰에서는 불리하게 읽힙니다.",
  c3_route_deep_delay: "요청은 기록에 남습니다. 승인되지 않아도 누가 서둘렀는지는 남습니다.",
  c3_route_deep_bury: "부록은 아무도 읽지 않습니다. 결함이 터질 때 그 사실이 증거가 됩니다.",
  c3_final_right_a: "탈락은 즉시 오고, 결함을 알고도 계약한 회사는 나중에 드러납니다.",
  c3_final_right_b: "계약은 들어오고, 결함의 비용은 계약서 밖 사람들이 냅니다.",
  c3_final_right_c: "비용을 회사가 지면 검증은 계속됩니다. 이번 분기 숫자는 나빠집니다.",
  c3_route_mirror_call: "묻는 순간 당신이 빈칸을 봤다는 사실도 상대에게 넘어갑니다.",
  c3_route_mirror_use: "틈을 쓰면 이깁니다. 같은 틈을 남기는 법도 함께 배웁니다.",
  c3_route_mirror_share: "공동 검증은 우위를 지웁니다. 대신 책임 조항이 처음으로 채워집니다.",
  c3_final_joint_a: "공동안은 점수판에서 밀립니다. 대신 빈 조항이 남지 않습니다.",
  c3_final_joint_b: "독자안은 이기고, 오진우는 다음 입찰에서 같은 방식을 씁니다.",
  c3_final_joint_c: "고객은 불편해집니다. 이 사건 이후 점수판의 항목이 바뀝니다.",
  c3_route_system_read: "추적하면 이 입찰이 승부가 아니라 관찰이었다는 쪽으로 기웁니다.",
  c3_route_system_ride: "당신에게 맞춰진 점수판은 다음 사람에게도 맞춰집니다.",
  c3_route_system_tell: "알리면 우위는 사라지고, 점수판을 만든 쪽이 처음으로 노출됩니다.",
  c3_final_system_a: "기준이 공개되면 이번 결과는 흔들리고, 다음 평가는 검증을 거칩니다.",
  c3_final_system_b: "유리한 결과는 남고, 그 결과를 만든 문장은 다음 참가자에게 넘어갑니다.",
  c3_final_system_c: "둘이 거부하면 이번 입찰은 무너지고, 평가 방식이 처음으로 논의됩니다.",
  c3_evidence_turn_merge: "합친 점수판은 이번 순위를 지웁니다. 대신 평가의 근거가 하나로 남습니다.",
  c3_evidence_turn_use: "허점을 이용한 계약은 허점이 알려지는 날까지만 유효합니다.",
  c3_evidence_turn_refuse: "거부는 매출을 잃습니다. 거부한 이유는 기록으로 남습니다.",

  c4_route_exception_publish: "수혜 대상이 드러나면 예외는 특혜와 구별되기 시작합니다.",
  c4_route_exception_repeat: "예외가 반복되면 그것은 더 이상 예외가 아니라 새 심사 기준입니다.",
  c4_route_exception_meter: "계량기는 재사용을 막지만, 누가 그 계량기를 읽는지는 아직 비어 있습니다.",
  c4_final_exception_a: "등록된 예외는 심사를 흔듭니다. 대신 다음 예외는 같은 절차를 거쳐야 합니다.",
  c4_final_exception_b: "기록이 없으면 선례도 없습니다. 다음에 같은 요청이 오면 근거도 없습니다.",
  c4_final_exception_c: "동의를 기다리면 서비스는 위태로워지고, 예외의 주인이 바뀝니다.",
  c4_route_rule_fund: "자금이 불확실해도 명단과 함께 놓이면 손실은 방치가 아니게 됩니다.",
  c4_route_rule_wait: "미룬 명단은 준비할 시간을 뺏습니다. 이름들은 결과와 함께 통보됩니다.",
  c4_route_rule_rewrite: "기준을 다시 쓰면 심사는 늦어지고, 무엇을 재고 있었는지가 드러납니다.",
  c4_final_rule_a: "같은 문서에 놓이면 절차의 정당성과 피해가 함께 읽힙니다.",
  c4_final_rule_b: "밖에서 보면 손실은 없습니다. 손실을 본 사람은 그 사실도 모릅니다.",
  c4_final_rule_c: "지연은 비용을 키우고, 그 사이 서비스가 끊기지 않을 수도 있습니다.",
  c4_route_audit_public: "외부 감시는 느립니다. 대신 조건이 형식으로 남지 않습니다.",
  c4_route_audit_internal: "안에서만 확인된 조건은 은폐와 구별되지 않습니다.",
  c4_route_audit_split: "권한을 나누면 절차는 늘고, 한 사람이 두 번 판단하는 일은 사라집니다.",
  c4_final_audit_a: "정기 공개는 운영을 무겁게 합니다. 대신 조건이 잊히지 않습니다.",
  c4_final_audit_b: "내부 문서는 안전합니다. 안전한 문서는 아무것도 바꾸지 않습니다.",
  c4_final_audit_c: "권한을 넘기면 결정은 느려지고, 당신의 선의는 검증 대상이 됩니다.",
  c4_route_system_limit: "한도가 먼저 적히면 다음 기관은 그 한도까지만 요구합니다.",
  c4_route_system_ship: "허용선을 그대로 두면 당신의 선의가 다음 위반의 안내문이 됩니다.",
  c4_route_system_ask: "명단이 들어가면 모델의 결론이 바뀝니다. 승인은 그만큼 늦어집니다.",
  c4_final_system_a: "공개된 기준은 재사용을 막지만, 이번 승인도 함께 검증대에 오릅니다.",
  c4_final_system_b: "좋은 결과가 근거가 되면, 나쁜 결과가 나오기 전까지는 아무도 멈추지 않습니다.",
  c4_final_system_c: "동의를 조건으로 걸면 예외는 느려지고, 예외의 주인이 바뀝니다.",
  c4_evidence_turn_owner: "이름이 남으면 이번 예외는 판단이 아니라 습관으로 읽힙니다.",
  c4_evidence_turn_stop: "멈춘 절차는 서비스를 위협합니다. 동의는 처음으로 조건이 됩니다.",
  c4_evidence_turn_patch: "봉합된 절차는 다음에도 같은 자리에서 열립니다.",

  c5_route_blame_compensate: "함께 발표하면 여론은 정리되고, 구조 조사는 자리를 잃을 수 있습니다.",
  c5_route_blame_single: "한 이름으로 닫힌 사건은 조용해집니다. 같은 실패의 조건은 그대로입니다.",
  c5_route_blame_reopen: "보류는 비난을 당신에게 돌립니다. 대신 승인 경로가 다시 열립니다.",
  c5_final_blame_route_a: "예산이 같은 날 확정되면 발표는 사과가 아니라 계획이 됩니다.",
  c5_final_blame_route_b: "조직은 버팁니다. 다음 실패도 같은 자리에서 시작합니다.",
  c5_final_blame_route_c: "공개 조사는 오래 걸리고, 조사가 끝나기 전에 여론이 먼저 결론을 냅니다.",
  c5_route_map_publish: "지도는 조직 전체를 흔듭니다. 대신 아무도 단독 범인이 아니라는 사실이 보입니다.",
  c5_route_map_owner: "이름이 붙으면 반발이 옵니다. 그 반발이 결정의 위치를 확인해 줍니다.",
  c5_route_map_delay: "보상은 빨라지고, 같은 화살표는 다음에도 같은 방향을 가리킵니다.",
  c5_final_map_route_a: "책임이 분산돼도 적혀 있으면 흩어지지는 않습니다.",
  c5_final_map_route_b: "보상은 오늘의 피해를 덮고, 지도는 내부 문서로 늙습니다.",
  c5_final_map_route_c: "외부 검토는 조직을 흔들고, 결론은 당신의 편집을 거치지 않습니다.",
  c5_route_redesign_snapshot: "스냅샷은 복구를 늦춥니다. 대신 원인이 복구에 덮이지 않습니다.",
  c5_route_redesign_continue: "피해는 줄어듭니다. 무엇 때문에 생겼는지는 함께 지워집니다.",
  c5_route_redesign_rule: "규칙이 되면 보호는 유지되고, 현장의 피로도 규칙이 됩니다.",
  c5_final_redesign_route_a: "둘을 함께 내면 복구가 은폐로 읽히지 않습니다. 비용은 가장 큽니다.",
  c5_final_redesign_route_b: "다음 과제로 넘긴 원인은 다음 과제에서도 뒤로 밀립니다.",
  c5_final_redesign_route_c: "멈춘 복구는 피해를 되돌립니다. 원인 로그는 남습니다.",
  c5_route_system_audit: "학습 자료를 열면 이번 실패가 사고가 아니라 설계였다는 쪽으로 기웁니다.",
  c5_route_system_patch: "손으로 고친 배차는 오늘만 유효하고, 가중치는 내일도 같은 사람을 뒤로 미룹니다.",
  c5_route_system_call: "직접 물으면 기준이 바뀝니다. 그 통화는 시스템 밖의 시간으로 셉니다.",
  c5_final_system_route_a: "공개 기준이 되면 조정도 공개돼야 합니다. 예산은 즉시 늘어납니다.",
  c5_final_system_route_b: "보정은 사람이 붙어 있는 동안만 작동합니다.",
  c5_final_system_route_c: "누락이 공개되면 모델은 신뢰를 잃고, 다음 학습의 조건이 생깁니다.",
  c5_evidence_turn_weight: "규칙이 되면 되돌리기 어렵습니다. 그것이 이 선택의 목적입니다.",
  c5_evidence_turn_archive: "보존된 로그는 다음 사건의 첫 문장이 됩니다.",
  c5_evidence_turn_close: "보상은 피해를 덮고, 규칙은 그대로 다음 사람을 고릅니다.",

  f_route_map_open: "공개하면 모든 케이스의 전제가 흔들립니다. 흔들려야 다시 세울 수 있습니다.",
  f_route_map_delete: "내 기록만 지운 사람은, 남의 기록을 지울 이유도 만들 수 있습니다.",
  f_route_map_return: "돌려주려면 동의 절차를 처음부터 다시 밟아야 합니다.",
  f_final_map_a: "목록이 나오면 이 시즌의 사건들이 다시 읽힙니다.",
  f_final_map_b: "삭제 권한이 넘어가면 증거도 함께 사라질 수 있습니다. 그것도 그들의 선택입니다.",
  f_final_map_c: "전부를 넘기면 당신은 판단에서 빠지고, 판단할 사람이 생깁니다.",
  f_route_expose_redact: "익명화에는 시간이 듭니다. 그 시간에 서버는 계속 닫힙니다.",
  f_route_expose_raw: "원본은 가장 확실한 증거이고, 가장 확실하게 사람을 노출합니다.",
  f_route_expose_hold: "기다리는 동안 증거는 줄고, 절차의 정당성은 늘어납니다.",
  f_final_expose_a: "구조만 남은 증거는 반박당하기 쉽습니다. 대신 아무도 지목되지 않습니다.",
  f_final_expose_b: "동의를 받는 동안 기회는 지나갈 수 있습니다. 그래도 절차가 남습니다.",
  f_final_expose_c: "구조는 확실히 드러나고, 그 안의 사람들도 함께 드러납니다.",
  f_route_contain_board: "운영위는 느립니다. 대신 권한이 실험자 밖으로 나갑니다.",
  f_route_contain_lab: "내부 개혁은 빠르고, 개혁의 내용을 검증할 사람은 여전히 안에 있습니다.",
  f_route_contain_pause: "멈춘 동안 연구는 정지하고, 동의는 처음으로 사후가 아니게 됩니다.",
  f_final_contain_a: "넘어간 도구는 느리게 쓰이고, 쓰이는 이유가 기록됩니다.",
  f_final_contain_b: "처음부터 받는 동의는 오래 걸리고, 이 실험을 처음으로 정당하게 만듭니다.",
  f_final_contain_c: "전부 공개되면 도구는 통제되지 않습니다. 대신 숨겨지지도 않습니다.",
  f_route_system_read: "읽고 나면 다음 참가자의 화면을 모른 척할 수 없습니다.",
  f_route_system_send: "확인하지 않은 문장도 전송됩니다. 모른다는 사실은 기록되지 않습니다.",
  f_route_system_warn: "보여주는 순간 당신도 실험의 일부였다는 사실이 함께 넘어갑니다.",
  f_final_system_a: "끊으면 다음 참가자는 자유로워지고, 무엇이 있었는지도 모릅니다.",
  f_final_system_b: "빈칸이 있으면 복제는 상속이 됩니다. 지우는 것보다 오래 남습니다.",
  f_final_system_c: "원본을 받은 사람은 처음부터 다시 물을 수 있습니다.",
  f_evidence_turn_burn: "폐기는 악용을 끝내고, 무슨 일이 있었는지도 함께 끝냅니다.",
  f_evidence_turn_seed: "경고문이 된 문장은 여전히 다음 사람의 선택지 위에 놓입니다.",
  f_evidence_turn_publish: "규칙이 공개되면 실험은 끝나고, 참가자들의 이름도 함께 열립니다.",
  // CASE 10.
  c10_start_file: "공식 기록이 되면 나흘 뒤에도 남습니다. 등록하는 순간 1,740명의 존재를 조직이 알게 되고, 조직은 알게 된 것에 대해 방침을 정합니다.",
  c10_start_claim: "신청이 접수되면 치료비 시계가 돌기 시작합니다. 심사는 그가 얼마나 무리했는지를 묻고, 그 답은 그를 규정 위반자로도 만듭니다.",
  c10_start_cover: "업무를 넘겨받으면 오늘은 아무것도 무너지지 않습니다. 그가 깨어나서 가장 먼저 확인할 것은 명단이고, 그때 당신이 무엇을 했는지도 함께 확인됩니다.",
  c10_locker_open: "명부가 열리면 1,740명은 처음으로 조직의 숫자가 됩니다. 숫자가 된 사람들은 소송의 당사자도 될 수 있습니다.",
  c10_locker_money: "47건은 그가 이 일을 어떻게 해 왔는지 증명합니다. 같은 자료가 그를 돈 관리도 못 하는 직원으로 만들 수 있습니다.",
  c10_locker_close: "해결분만 넘기면 인수인계는 오늘 끝납니다. 미해결 1,128명은 그가 깨어나 다시 셀 때까지 아무 데도 없습니다.",
  c10_branch_home_a: "지금 파는 방식을 보면 이 일이 3년 전 이야기가 아니라는 게 드러납니다. 드러난 만큼 사건은 도윤하 한 사람에서 지점 전체로 커집니다.",
  c10_branch_home_b: "봉투를 두면 그의 3년은 그의 것으로 남습니다. 당신은 그가 왜 내지 않았는지 영영 모릅니다.",
  c10_branch_home_c: "알려 주면 1년차는 선택할 수 있게 됩니다. 그 선택의 대가는 이번에 그 사람이 치릅니다.",
  c10_branch_home_follow_a: "일곱 번째 칸이 생기면 세 사람은 숨어서 돕던 일을 드러내고 합니다. 드러난 이름은 인사 기록에도 드러납니다.",
  c10_branch_home_follow_b: "이름을 가리면 세 사람은 안전합니다. 명부는 누가 3년을 함께 버텼는지 말하지 못합니다.",
  c10_branch_home_follow_c: "본인이 먼저 들으면 그는 혼자가 아니었다는 걸 압니다. 그 사실을 아는 데 필요한 것은 그가 깨어날 때까지의 시간입니다.",
  c10_claim_prove: "전부 내면 인과관계는 증명됩니다. 같은 서류가 3년치 사규 위반도 같은 날 증명합니다.",
  c10_claim_narrow: "근무 시간만으로 다투면 그는 위반자가 되지 않습니다. 근무 시간만으로는 이 병이 일 때문이라는 것도 되지 않습니다.",
  c10_claim_system: "안건이 제도로 바뀌면 다음 사람은 이 심의를 다시 받지 않습니다. 바꾸는 데 걸리는 시간 동안 도윤하의 치료비는 아무 데서도 나오지 않습니다.",
  c10_relay_assign: "규정에 박힌 담당자는 사람이 바뀌어도 남습니다. 규정이 된 순간 그 일은 아무도 자원해서 하지 않는 일이 됩니다.",
  c10_relay_pay: "수당이 붙으면 여섯 사람은 대가 없이 소모되지 않습니다. 예산을 따내는 동안 분담표는 아직 아무것도 처리하지 못합니다.",
  c10_relay_keep: "약속으로 두면 지금의 온도가 유지됩니다. 약속은 여섯 사람 중 누가 지치면 그 칸부터 비어 갑니다.",
  c10_final_stop: "덮게 하면 그는 3개월 뒤에도 자리에 있습니다. 212명은 그때까지 어느 명부에도 없습니다.",
  c10_final_join: "절반을 나눠 적으면 그는 혼자 무너지지 않습니다. 두 사람이 같은 속도로 소모되는 것일 수도 있습니다.",
  c10_final_rule: "규정에 칸이 생기면 212명은 제도 안으로 들어옵니다. 그 개정이 통과될 때까지 그 212명은 계속 밖에 있습니다.",
  c10_after_rest: "불을 끄면 여섯 명이 처음으로 같은 시각에 퇴근합니다. 그 저녁에 처리되지 않은 34건은 월요일로 넘어갑니다.",
  c10_after_record: "제도안이 되면 분담표는 담당자가 바뀌어도 살아남습니다. 그룹전략실은 그 표를 자기들 성과로 인용할 수 있습니다.",
  c10_after_keep: "서랍에 두면 212명은 지워지지 않습니다. 보관자가 한 명뿐인 기록은 그 한 명이 사라지면 같이 사라집니다.",
  // CASE 11.
  c11_start_reporter: "바로잡은 기사는 더 빨리 퍼집니다. 기자와 처음 통화한 사람이라는 사실도 함께 퍼집니다.",
  c11_start_pr: "초안을 읽으면 그룹이 누구를 개인의 일탈로 만들지 미리 압니다. 읽었다는 기록은 그룹에 남습니다.",
  c11_start_team: "함께 정하면 닷새가 버틸 만해집니다. 여섯 사람이 합의한 문장은, 누구 하나 빠지면 다시 써야 합니다.",
  c11_script_own: "증명할 수 있는 문장만 남기면 7분이 짧아집니다. 짧은 답은 편집되지 않습니다.",
  c11_script_trim: "마지막 줄을 지우면 의원실은 질문을 바꿔야 합니다. 바뀐 질문이 어디로 향할지는 당신이 정할 수 없습니다.",
  c11_script_pr: "약속은 받았습니다. 서면이 아니라 전화로 받은 약속이고, 당신은 방송에서 사실과 다른 문장을 읽게 됩니다.",
  c11_branch_newsroom_a: "원본이 맞으면 기사는 법정에서도 버팁니다. 제보자를 지킨다는 조건은 서하린이 지켜야 하는 약속이 됩니다.",
  c11_branch_newsroom_b: "못 본 것으로 하면 당신은 안전합니다. 연필 메모 한 줄은 기자 혼자 지키게 됩니다.",
  c11_branch_newsroom_c: "먼저 물으면 임경수는 선택할 수 있습니다. 전화 너머에서 그가 한참 웃다가 말합니다. '이제야 누가 묻는군.'",
  c11_branch_newsroom_follow_a: "감정서가 나가면 '윤'은 윤상혁이 됩니다. 이름을 가린 제보자는 이제 법원이 궁금해하는 사람이 됩니다.",
  c11_branch_newsroom_follow_b: "당신이 말하면 제보자는 가려집니다. 대신 그 메모의 무게를 참고인석에서 혼자 받습니다.",
  c11_branch_newsroom_follow_c: "미루면 오늘 밤은 조용합니다. 기한이 지난 청구는 국정감사 다음 날 아침 기사로 먼저 나옵니다.",
  c11_rehearsal_shield: "막아 두면 이민서는 그 방에서 불리지 않습니다. 대신 그 질문은 다른 날, 다른 방에서 옵니다.",
  c11_rehearsal_truth: "연습한 답은 떨리지 않습니다. 사실대로 나온 이름은 계약 갱신 심사 서류에도 같이 올라갑니다.",
  c11_rehearsal_contract: "요구는 협상이 됩니다. 협상 테이블에 오른 순간, 이민서의 전환은 당신 증언의 값으로 읽힐 수 있습니다.",
  c11_sign_ask: "녹음이 나가면 당신이 옳았다는 게 증명됩니다. 한서윤은 그 증명과 함께 징계위원회에 섭니다.",
  c11_sign_spare: "녹음 없이 가면 한서윤은 남습니다. 윤상혁은 당신 말에 '기억나지 않는다'로 답할 수 있습니다.",
  c11_sign_together: "둘이 함께 서면 반대와 반려가 한 문장이 됩니다. 그 문장은 두 사람 모두를 드러냅니다.",
  c11_final_name: "이름은 내일 1면이 됩니다. 1면에 오른 이름은 다음 날부터 변호사의 이름으로 답합니다.",
  c11_final_system: "구조는 4면에 실립니다. 4면을 끝까지 읽는 사람은, 그 구조 안에서 일하는 사람들입니다.",
  c11_final_people: "숫자로 시작하면 방이 조용해집니다. 방송은 그 침묵을 3초만 내보냅니다.",
  c11_after_toast: "엎어 둔 휴대폰은 밤새 울립니다. 아무도 뒤집지 않습니다. 떡볶이는 식기 전에 다 먹습니다.",
  c11_after_record: "속기록은 잘리지 않습니다. 당신이 더듬은 12초도, 그룹이 인용할 한 문장도 그대로 남습니다.",
  c11_after_summon: "바로 응하면 주도권을 쥔 것처럼 보입니다. 33층은 당신이 얼마나 빨리 오는지부터 기록합니다.",
};
