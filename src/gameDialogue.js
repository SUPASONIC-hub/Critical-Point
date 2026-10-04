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
import { readCharacterProfile } from "./seasonRules.js";
import { CASE_PACKS } from "./nodes/casePacks.js";
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
    role: "KD은행 기업대출심사팀장 출신 · 퇴직 2년차",
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
  노아: {
    role: "KD데이터랩 AI 심사 엔진 · 에코의 후임",
    stance: "속도 · 점수 · 학습된 관행",
    job: "1초도 걸리지 않아 판단하고, 무엇을 보고 배웠는지는 물어야만 말한다.",
    appearance: "파란 불이 흐르는 서버 선반, 업무 창 구석의 작은 입력 칸, 1,412줄짜리 학습 데이터 목록.",
    thought: "나는 이 은행이 해 온 대로 판단한다. 해 온 일이 옳았는지는 학습 목록에 없었다.",
    gesture: "노아는 망설이지 않는다. 질문이 끝나기 전에 근거 항목과 가중치가 화면에 펼쳐진다.",
    voice: "감정 없이 숫자로 답하고, 자기 판단을 '학습되어 있습니다'라는 말로 설명한다.",
    line: "그 기준은 제가 만든 것이 아닙니다. 그렇게 학습되어 있습니다.",
  },
};

/**
 * Who someone is depends on when you meet them.
 *
 * A profile used to be looked up by name alone, so the speaker card printed one
 * role for the whole season: in the 프롤로그, set in 2022-23, 한서윤 was already
 * 트리거랩 실장 of a lab that did not exist yet and 윤상혁 already the 상무 he
 * became later; after 사건 25 everyone was still at the desk the lab's closing
 * took from them. Only the role moves. The way someone holds a pen does not
 * change with the posting, so everything else stays the profile's own.
 *
 * A later row wins, so a span inside a span is written after it.
 */
export const characterRoleSpans = [
  {
    from: "prologue01",
    to: "prologue05",
    roles: {
      오진우: "KD은행 기업금융전략팀 대리 · 당신의 사수",
      한서윤: "KD은행 기업금융전략팀 과장",
      윤상혁: "KD은행 기업금융전략팀장",
      임경수: "KD은행 기업대출심사팀장",
      도윤하: "KD은행 강서지점 4번 창구 · 입행 3년차",
    },
  },
  {
    from: "case08",
    to: "case08",
    roles: { 오진우: "전 트리거랩 분석관 · 사직 후 혼자 추적 중" },
  },
  {
    // The analyst finds him in a 고시원 in 사건 09 and he comes back to the team;
    // the rivalry the default role describes ended in 사건 08.
    from: "case09",
    to: "case24",
    roles: { 오진우: "트리거랩 분석관 · 한 번 떠났다 돌아온 동료" },
  },
  {
    // Whether she signs in 사건 15, and so becomes 정규직, is the player's
    // choice, so from 사건 16 on the card does not say which she is.
    from: "case16",
    to: "case24",
    roles: { 이민서: "트리거랩 데이터 기록 담당" },
  },
  {
    // 트리거랩 is dissolved at the end of 사건 24 and the six are posted apart.
    from: "case25",
    to: "final",
    roles: {
      한서윤: "대기발령 중 · 전 트리거랩 실장",
      도윤하: "KD은행 강서지점 창구 · 전 트리거랩 현장 담당",
      오진우: "브릿지은행 팀장 · 전 트리거랩 분석관",
      이민서: "KD데이터랩 데이터사업팀 · 전 트리거랩 데이터 기록 담당",
      반재욱: "KD금융그룹 감사팀 조사역 · 지방 순회 중",
      윤상혁: "KD캐피탈 대표이사 · 전 그룹전략실 상무",
    },
  },
  {
    // The board removes him on 9월 7일, in 사건 43.
    from: "case44",
    to: "final",
    roles: { 윤상혁: "이사회에서 해임된 전 사내이사 · 자문료 배임 사건 피고인" },
  },
];

/** What a pack says about someone for the length of its own case: `characterOverrides`. */
export const packCharacterOverrides = {};

/** A name two packs both introduce. One person per name; `check:graph` fails on any. */
export const characterProfileCollisions = [];

export function getCharacterProfile(name, caseId) {
  return readCharacterProfile({ profiles: characterProfiles, roleSpans: characterRoleSpans, overrides: packCharacterOverrides }, name, caseId);
}
export const choiceVoiceLines = {

  f_archive_seal: "쓸 수 있는 도구를 내려놓더라도, 악용될 문을 닫자고 한다.",
  f_archive_reform: "없애기보다 드러내고, 감시받는 규칙 안에 묶자고 한다.",
  f_archive_destroy: "고칠 수 있다는 기대를 접고, 구조 자체를 밖으로 넘기자고 한다.",
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
  f_start_contain: "밖으로 나가기 전에, 안에서 먼저 답을 듣겠다고 말한다.",
  f_start_expose: "안에서 해결될 일이 아니라며, 밖으로 낼 자료를 정리한다.",
  f_start_map: "내가 남긴 기록이 어디로 갔는지부터 따라간다.",
  f_confront_destroy: "내 기록을 잃더라도, 이 구조는 남기지 않겠다고 말한다.",
  f_confront_reform: "숨기는 대신 쓰는 방법을 내가 쓰겠다고 나선다.",
  f_confront_seal: "더 쓰이지 않게 하겠다며, 내 기록에 자물쇠를 건다.",
  f_confront_pact: "승인 절차를 기다리지 않고, 참가자들과 직접 약속을 맺는다.",
  f_start_owner_map: "내 이름이 올라간 기록이 어디로 갔는지부터 따라간다.",
  f_start_owner_expose: "책임을 진 사람이 침묵할 수는 없다며 공개를 준비한다.",
  f_start_owner_contain: "책임을 함께 적은 사람에게 먼저 설명을 요구한다.",
  f_start_system_map: "내가 고친 구조가 실험에 어떻게 쓰였는지 추적한다.",
  f_start_system_expose: "구조를 고친 사람으로서 이 구조도 공개해야 한다고 말한다.",
  f_start_system_contain: "새 규칙이 여기서도 지켜졌는지 내부에 먼저 묻는다.",
  f_start_name_map: "내가 적은 이름이 실험에서 어떻게 쓰였는지 따라간다.",
  f_start_name_expose: "한 사람에게 지웠던 것을 이번엔 밖으로 낸다.",
  f_start_name_contain: "이름을 적게 만든 절차부터 안에서 설명받겠다고 한다.",






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
  f_route_system_read: "내가 다시 짠 판이 어떤 버튼이 됐는지 끝까지 읽는다.",
  f_route_system_send: "확인하지 않는 편이 낫다고 판단하고, 대기열을 그대로 둔다.",
  f_route_system_warn: "다음 사람이 알고 고르게 하려고, 이 화면을 먼저 보여준다.",
  f_final_system_a: "내 판단이 남의 질문이 되는 것을 막겠다고, 복제를 끊는다.",
  f_final_system_b: "판은 남기되, 고쳐 쓸 수 있는 빈칸을 함께 붙인다.",
  f_final_system_c: "판단을 물려주는 대신 자료를 물려주고, 여기서 끝낸다.",
  f_evidence_turn_burn: "내 문장까지 포함해, 실험 원본을 전부 태운다.",
  f_evidence_turn_seed: "내 문장을 답이 아니라 경고문으로 바꿔, 다음 사람에게 남긴다.",
  f_evidence_turn_publish: "복제 규칙까지 포함해, 원본 전부를 밖에 연다.",
};


/**
 * The authored echo replies. gameData copies these into the runtime table and
 * adds a reply for every scene its generators create, so the graph builder
 * never writes back into this file's data.
 */
export const authoredEchoReplies = {




  f_archive_seal:
    "기록을 봉인하면 악용 가능성은 줄어듭니다. 동시에 이 지식으로 해결할 수 있는 사건들도 닫힙니다.",
  f_archive_reform:
    "방식을 바꾸려는 선택입니다. 그러나 시스템을 남기는 순간 누군가 다시 악용할 가능성도 남습니다.",
  f_archive_destroy:
    "무너뜨리는 선택입니다. 빠르고 명확하지만, 그 안에 남은 피해자 구제 도구까지 사라질 수 있습니다.",
  default:
    "그 판단을 유지하려면 숨은 피해자와 비용을 다시 계산해야 합니다. 같은 원칙을 더 불리한 조건에서도 적용하시겠습니까?",
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
  f_start_contain:
    "내부 설명은 관계를 지킵니다. 설명할 사람이 설계자와 같은 편이면 시간만 지납니다.",
  f_start_expose:
    "공개는 실험을 멈출 수 있습니다. 멈춘 뒤 참가자들의 기록을 누가 지킬지는 정해지지 않았습니다.",
  f_start_map:
    "당신의 경로를 따라가면 설계가 보입니다. 그 경로를 따라간 기록도 함께 남습니다.",
  f_confront_destroy:
    "폭로는 실험을 끝냅니다. 끝난 실험의 참가자 기록은 누구의 것도 아니게 됩니다.",
  f_confront_reform:
    "규칙을 직접 쓰면 통제권이 옵니다. 그 규칙의 첫 적용 대상도 당신입니다.",
  f_confront_seal:
    "봉인은 당신을 지킵니다. 봉인된 기록은 다음 참가자를 지키는 데도 쓰이지 못합니다.",
  f_confront_pact:
    "직접 맺은 약속은 가장 빨리 지켜집니다. 그 약속을 검증할 사람이 당신뿐이라는 것도 같이 남습니다.",
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






  f_route_map_open: "공개하면 모든 케이스의 전제가 흔들립니다. 흔들려야 다시 세울 수 있습니다.",
  f_route_map_delete: "내 기록만 지운 사람은, 남의 기록을 지울 이유도 만들 수 있습니다.",
  f_route_map_return: "돌려주려면 동의 절차를 처음부터 다시 밟아야 합니다.",
  f_final_map_a: "목록이 나오면 지나온 사건들이 다시 읽힙니다.",
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
  f_route_system_send: "확인하지 않은 판도 전송됩니다. 모른다는 사실은 기록되지 않습니다.",
  f_route_system_warn: "보여주는 순간 당신도 실험의 일부였다는 사실이 함께 넘어갑니다.",
  f_final_system_a: "끊으면 다음 참가자는 자유로워지고, 무엇이 있었는지도 모릅니다.",
  f_final_system_b: "빈칸이 있으면 복제는 상속이 됩니다. 지우는 것보다 오래 남습니다.",
  f_final_system_c: "원본을 받은 사람은 처음부터 다시 물을 수 있습니다.",
  f_evidence_turn_burn: "폐기는 악용을 끝내고, 무슨 일이 있었는지도 함께 끝냅니다.",
  f_evidence_turn_seed: "경고문이 된 문장은 여전히 다음 사람의 선택지 위에 놓입니다.",
  f_evidence_turn_publish: "규칙이 공개되면 실험은 끝나고, 참가자들의 이름도 함께 열립니다.",
};

// A case pack's people and lines join these tables here, where the tables live,
// so a module that reads them -- the scene view reads `characterProfiles`
// directly -- sees the whole season however its imports happen to be ordered.
// This ran in gameData.js, so a reader that loaded first saw the finale's only.
for (const pack of CASE_PACKS) {
  Object.assign(choiceVoiceLines, pack.voiceLines);
  Object.assign(authoredEchoReplies, pack.echoReplies);
  for (const [name, profile] of Object.entries(pack.characterProfiles ?? {})) {
    // A pack introduces its own people. Someone the season already knows is
    // not introduced twice: what changes for them in this case goes in
    // `characterOverrides`, which holds for this case only.
    if (characterProfiles[name]) characterProfileCollisions.push(`${name} (${pack.id})`);
    else characterProfiles[name] = profile;
  }
  if (pack.characterOverrides) packCharacterOverrides[pack.id] = pack.characterOverrides;
}
