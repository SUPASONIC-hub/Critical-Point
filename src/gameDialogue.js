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
/**
 * What the analyst says on a card, by the card's id. Every line is written on
 * its card in the case packs; `gameData.js` files them here as it builds the
 * scenes, so this is empty until that module has loaded.
 */
export const choiceVoiceLines = {};

/**
 * The reply for a card that has none. The replies themselves are written on
 * their cards too; gameData copies this into the runtime table and files the
 * rest beside it, so the graph builder never writes back into this file's data.
 */
export const authoredEchoReplies = {
  // What a choice with no reply of its own is answered with.
  default: "그 판단을 유지하려면 숨은 피해자와 비용을 다시 계산해야 합니다. 같은 원칙을 더 불리한 조건에서도 적용하시겠습니까?",
};

// A case pack's people join these tables here, where the tables live,
// so a module that reads them -- the scene view reads `characterProfiles`
// directly -- sees the whole season however its imports happen to be ordered.
// This ran in gameData.js, so a reader that loaded first saw none of them.
for (const pack of CASE_PACKS) {
  for (const [name, profile] of Object.entries(pack.characterProfiles ?? {})) {
    // A pack introduces its own people. Someone the season already knows is
    // not introduced twice: what changes for them in this case goes in
    // `characterOverrides`, which holds for this case only.
    if (characterProfiles[name]) characterProfileCollisions.push(`${name} (${pack.id})`);
    else characterProfiles[name] = profile;
  }
  if (pack.characterOverrides) packCharacterOverrides[pack.id] = pack.characterOverrides;
}
