/**
 * The words the plain-language check refuses, and the two readers that find
 * them. They live apart from `check-plain-language.mjs` because that script
 * runs the whole season when it is imported, and a rule that cannot be called
 * on one sentence cannot be tested on one.
 *
 * The glossary is here for the same reason: `check-doc-numbers.mjs` counts it
 * against what the README says, and could not import it from a script that
 * runs on import.
 */

/** Japanese-era banking words, with what the season says instead. */
export const BANNED = {
  여신: "대출",
  융자: "대출",
  품의: "승인 요청",
  기안: "작성",
  결재: "승인",
  금번: "이번",
  익일: "다음 날",
  불입: "납입",
  수순: "순서",
};

/**
 * What the game said while 판을 다시 짠다 was a text box. It is a card now
 * (maintenance priority 77): the player stakes it, nothing is typed, and no
 * sentence of theirs exists for a scene to quote. These phrases survived the
 * change in 54 memory cards and 52 hidden routes, telling a player who had
 * staked a card about a sentence they wrote.
 *
 * Matched anywhere, not at a word start like `BANNED`: each is long enough to
 * be unmistakable, and the ones that open mid-phrase (밖의 문장을) have a
 * Hangul neighbour on the left by construction.
 */
export const RETIRED_PHRASES = {
  자유응답: "다시 짠 판",
  "자유 응답": "다시 짠 판",
  "자유 입력": "판을 다시 짠다",
  "자유로운 제안": "다시 짠 판",
  "밖의 문장을": "판을 다시 짜자",
  "문장을 쓰자": "판을 다시 짜자",
  "문장을 입력": "판을 다시 짜자",
  "입력하신 문장": "다시 짠 판",
  "입력한 문장": "다시 짠 판",
  "직접 쓴 제안": "다시 짠 판",
  "제안 문장": "다시 짠 판",
  "반영 기준": "숨은 경로",
};

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

/**
 * Bank words are mostly met in compounds -- 전자결재, 신규여신, 주택융자, 재기안
 * -- and a word-start rule let every one of them through. Three of the words
 * are found inside no ordinary Korean word, so they are refused wherever they
 * stand. The rest do turn up inside other words (상품의 holds 품의, 정기안내
 * holds 기안), so they are refused at a word start, or behind one of the
 * prefixes a bank puts in front of them.
 */
const REFUSED_ANYWHERE = new Set(["여신", "융자", "결재"]);
const COMPOUND_PREFIXES = ["재", "사전", "최종", "전자", "신규", "공동"];

/** `[{ word, instead, line }]` for every banned word in `text`, alone or in a compound. */
export function findBannedWords(text) {
  const found = [];
  for (const [word, instead] of Object.entries(BANNED)) {
    // A Hangul neighbour on the left means the letters are part of another
    // word (정당해 is not 당해), so only a word start or a known compound counts.
    const pattern = REFUSED_ANYWHERE.has(word) ? new RegExp(word, "g") : new RegExp(`(?:^|[^가-힣]|${COMPOUND_PREFIXES.join("|")})${word}`, "g");
    for (const match of text.matchAll(pattern)) found.push({ word, instead, line: lineOf(text, match.index) });
  }
  return found;
}

/** `[{ word, instead, line }]` for every retired free-text phrase in `text`. */
export function findRetiredPhrases(text) {
  const found = [];
  for (const [word, instead] of Object.entries(RETIRED_PHRASES)) {
    let index = text.indexOf(word);
    while (index >= 0) {
      found.push({ word, instead, line: lineOf(text, index) });
      index = text.indexOf(word, index + word.length);
    }
  }
  return found;
}

/**
 * Words a player outside a bank has to be told. Everyday words that happen to
 * be official -- 감사, 징계, 결의, 고용 -- are left alone on purpose: the list is
 * the words a reader would actually stop at.
 */
export const GLOSSARY = [
  "유동성",
  "선순위",
  "청산",
  "배임",
  "횡령",
  "분식회계",
  "채권단",
  "감정평가",
  "휴면 계좌",
  "보전 신청",
  "고용 승계",
  "회수율",
  "산업재해",
  "보존연한",
  "출자전환",
  "부채비율",
  "엠바고",
  "정기검사",
  "시효",
  "국정감사",
  "참고인",
  "불출석 사유서",
  "속기록",
  "정정보도",
  "공익신고",
  "분쟁조정",
  "부제소 합의",
  "집단소송",
  "협동조합",
  "상환",
  "담보 순위",
  "부도",
  "자문료",
  "계열사",
  "풀필먼트",
  "인사위원회",
  "발령",
  "크로마키",
  "카메오",
  "프롬프터",
  "포커스 그룹",
  "인이어",
  "회계 원장",
  "불완전판매",
  "부실채권",
  "ESG",
  "미스터리 쇼퍼",
  "환매",
  "후순위",
  "녹취",
  "기준가",
  "PB",
  "청약 철회",
  "시재",
  "리스",
  "풀필먼트센터",
  "피킹",
  "선행 조건",
  "관제",
  "지분",
  "내용증명",
  "문서제출명령",
  "실사",
  "마니또",
  "시행사",
  "공정표",
  "이관",
  "심사 엔진",
  "학습 데이터",
  "가명 처리",
  "설명 가능성",
  "알고리즘",
  "조직 적합도",
  "사후 동의서",
  "정보 주체",
  "열람 청구",
  "영농자금",
  "비상품과",
  "수매",
  "가중치",
  "유사도",
  "시설자금",
  "예외 승인",
  "특수관계인",
  "5축 가공기",
  "출자금",
  "주주총회",
  "사내이사",
  "의결권",
  "위임장",
  "의결권 자문사",
  "기관투자자",
  "소액주주",
  "의사록",
  "전자투표",
  "지배구조",
  "인사평가 보조지표",
  "수신 기록",
  "영전",
  "대기발령",
  "PF",
  "하도급",
  "유치권",
  "중도금",
  "공정률",
  "공매",
  "뱅크런",
  "예금자 보호",
  "약관",
  "부지급",
  "후유장해",
  "손해사정사",
  "손해율",
  "통지 의무",
  "파견",
  "통매각",
  "부속서",
  "자문역",
  "추심",
  "채무조정",
  "페이퍼컴퍼니",
  "사모펀드",
  "호커센터",
  "비밀유지 서약서",
  "신기술투자조합",
  "검사역",
  "충당금",
  "만기 연장",
  "압수수색",
  "피의자",
  "영장",
  "진술조서",
  "포렌식",
  "기소",
  "영업비밀",
  "보호조치",
  "구조금",
  "필적 감정",
  "임의제출",
  "손해사정",
  "특약",
  "면책",
  "방청유",
  "차주",
  "준법감시인",
  "꼬리 자르기",
  "상호신용금고",
  "미러 사이트",
  "디지털 장의사",
  "증거능력",
  "메타데이터",
  "변론",
  "준비서면",
  "반대신문",
  "원고 적격",
  "분리 심리",
  "결방",
  "가처분",
  "주조정실",
  "심의",
  "타임코드",
  "반론",
  "역량검사",
  "청문회",
  "위증",
  "대질신문",
  "경매",
  "조기 회수",
  "사외이사",
  "해임안",
  "준비 기일",
  "공시",
  "구형",
  "양형",
  "집행유예",
  "추징",
  "처벌불원서",
  "항소",
  "법정구속",
  "상주",
  "발인",
  "설계 로그",
  "인우보증",
  "재원",
  "위로금",
  "대출 확약",
  "조건부 승인",
  "이면 합의",
  "다크스토어",
];
