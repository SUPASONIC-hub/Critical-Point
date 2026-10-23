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
  "증거 보전 신청",
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
  "인수 실사",
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

/**
 * The one way each glossary term is explained, where the season explains it
 * more than one way (A-5 of the 2026-10-22 review). A term is explained afresh
 * in every case and on every route, so the same word reached a player in up to
 * nine wordings -- 자문료 as 조언값이라며 내보낸 돈, 조언을 해 준 값으로 받는
 * 돈, 조언해 준 값이라며 주고받은 돈 and six more -- and 실사 even changed its
 * meaning between case 18 (사기 전에 장부와 서류를 샅샅이 확인하는 일) and case
 * 45 (현장에 직접 가서 확인하는 일).
 *
 * Each entry is a candidate, not a ruling: the wording the season used most on
 * 2026-10-22, the shorter one on a tie. The copy is not rewritten to it until
 * after the W44 freeze (from 11-02), and an entry may be changed to a better
 * wording before then. A term with one wording everywhere has no entry; the
 * check takes the wording used most as its standard, so a second wording of it
 * is still counted.
 */
export const STANDARD_GLOSS = {
  "자문료": "조언값이라며 내보낸 돈",
  "심사 엔진": "대출 신청을 자동으로 판단하는 인공지능 프로그램",
  "학습 데이터": "인공지능이 판단을 배우는 데 쓴 자료",
  "가중치": "어떤 조건을 얼마나 무겁게 따질지 정한 값",
  "대기발령": "맡은 일 없이 다음 자리를 기다리게 하는 인사 조치",
  "산업재해": "일하다 다치거나 병든 것",
  "국정감사": "국회가 공개적으로 따져 묻는 자리",
  "배임": "맡은 일을 저버려 회사에 손해를 끼친 죄",
  "PF": "건물을 짓기 전에 앞으로 들어올 분양 대금을 믿고 빌려주는 대출",
  "보존연한": "기록을 몇 년 보관하고 버릴지 정해 둔 기간",
  "정기검사": "금융감독원이 몇 년마다 금융회사의 장부와 업무를 통째로 들여다보는 점검",
  "불완전판매": "위험을 제대로 설명하지 않고 파는 것",
  "후순위": "돈을 돌려받는 차례가 뒤인 자리",
  "녹취": "상담 내용을 녹음해 남긴 것",
  "풀필먼트센터": "주문받은 물건을 보관하고 포장해 내보내는 물류 창고",
  "실사": "현장에 직접 가서 확인하는 일",
  // Case 18's 실사 is reading a company's books before buying it, so it became
  // a term of its own on 2026-10-22 (decision 17'): 실사 is the site visit.
  "인수 실사": "사기 전에 장부와 서류를 샅샅이 확인하는 일",
  "이관": "기록을 다른 곳에 넘겨 맡기는 것",
  "조직 적합도": "사람이 회사에 얼마나 잘 맞을지 매긴 점수",
  "정보 주체": "기록의 주인인 사람",
  "참고인": "증언할 의무는 없지만 사실을 설명하러 나오는 사람",
  "선행 조건": "이게 먼저 이뤄져야 계약이 효력을 갖는 조건",
  "내용증명": "누가 언제 무엇을 요구했는지 우체국이 증명해 주는 편지",
  "의사록": "회의 내용을 적은 공식 기록",
  "상환": "빌린 돈을 갚는 일",
  "발령": "근무지를 옮기라는 인사 명령",
  "가명 처리": "누구인지 바로 알 수 없게 이름을 지운 것",
  "회수율": "빌려준 돈 중 실제로 돌려받는 비율",
  "엠바고": "보도 시점을 약속해 미루는 것",
  "인사위원회": "직원의 징계나 자리 이동을 정하는 회의",
  "회계 원장": "거래를 하나하나 적어 둔 원래 장부",
  "유사도": "얼마나 닮았는지",
  "예외 승인": "기준 밖이지만 책임자가 이름을 걸고 승인하는 것",
  "필적 감정": "글씨를 비교해 누가 썼는지 가려내는 감정",
  "준법감시인": "회사가 법과 규정을 지키는지 안에서 감시하는 책임자",
  "항소": "1심 판결에 불복해 다시 재판해 달라고 하는 것",
  "조건부 승인": "조건을 달아서 내주는 승인",
  "부도": "빚을 갚지 못해 회사가 쓰러지는 일",
  "채권단": "돈을 빌려준 금융회사들의 협의체",
  "공익신고": "회사의 불법을 공공기관에 알리는 것",
  "ESG": "환경·사회·회사 운영을 따지는 평가",
  "알고리즘": "판단 순서를 정해 둔 계산 규칙",
  "사후 동의서": "이미 끝난 일을 뒤늦게 허락받는 서류",
  "주주총회": "회사의 주인인 주주들이 모여 중요한 일을 표로 정하는 회의",
  "수신 기록": "문서를 누가 언제 받았는지 남은 기록",
  "하도급": "큰 회사가 맡은 일을 작은 업체에 다시 나눠 맡기는 것",
  "사외이사": "회사 밖에서 와서 경영진을 감시하는 이사",
  "집행유예": "유죄지만 형을 당장 살게 하지 않고 미뤄 두는 것",
  "선순위": "가장 먼저 돌려받는 순서",
  "보전 신청": "재산을 못 옮기게 묶어 두는 절차",
  // Case 19 preserves evidence, not property: a term of its own (2026-10-22).
  "증거 보전 신청": "증거가 없어지지 않게 법원이 미리 확보해 두는 절차",
  "불출석 사유서": "나오지 못하는 이유를 적어 내는 서류",
  "속기록": "오간 말을 그대로 적은 공식 기록",
  "담보 순위": "누가 먼저 돈을 받느냐의 순서",
  "미스터리 쇼퍼": "손님인 척 판매 과정을 점검하는 사람",
  "환매": "펀드를 팔아 돈을 돌려받는 것",
  "기준가": "펀드 한 좌의 가격",
  "청약 철회": "가입을 없던 일로 되돌릴 수 있는 기간",
  "리스": "장비를 빌려 쓰고 매달 사용료를 내는 금융",
  "피킹": "창고에서 주문받은 물건을 찾아 꺼내는 일",
  // 재개발 only fit case 19; case 26's 시행사 builds a PF officetel.
  "시행사": "건물을 지어 파는 사업을 맡은 회사",
  "설명 가능성": "판단 이유를 사람이 알아들을 수 있게 보여 주는 능력",
  "출자금": "조합원이 조합에 넣은 돈",
  "인사평가 보조지표": "사람을 평가할 때 곁들여 보는 숫자",
  "약관": "계약의 세부 조건을 적은 문서",
  "손해사정사": "보험 사고의 손해를 조사해 금액을 정하는 사람",
  // The 식탁 wording fit case 36 only; case 30's pledge is signed at work.
  "비밀유지 서약서": "알게 된 것을 밖에 옮기지 않겠다는 약속",
  "충당금": "떼일 것에 대비해 쌓아 두는 돈",
  "만기 연장": "갚을 날짜를 미뤄 주는 것",
  "압수수색": "법원의 허락을 받아 자료와 물건을 강제로 가져가는 수사",
  "포렌식": "지워진 파일까지 되살려 들여다보는 분석",
  "조기 회수": "만기 전에 빌려준 돈을 한꺼번에 돌려받는 것",
  "설계 로그": "실험을 어떻게 짤지 바꾼 날짜와 사람을 남긴 기록",
};

const normalizeGloss = (gloss) => gloss.trim().replace(/\s+/g, " ");

/**
 * `[{ gloss, index }]` for every place `text` explains `term` in a parenthesis
 * right after it: 자문료(조언값이라며 내보낸 돈), with one space allowed before
 * the parenthesis. A parenthesis behind a longer word -- 발령서(…), 참고인석(…)
 * -- explains that word, not the term, and is not read; neither is a term met
 * inside another word (우선순위 is not 선순위), nor one that ends a longer
 * glossary term (인수 실사 is not 실사).
 */
export function findGlosses(text, term) {
  const pattern = new RegExp(`(^|[^가-힣])${term} ?[(]([^()]*)[)]`, "g");
  // 인수 실사(…) explains 인수 실사, a glossary term of its own, not 실사.
  const heads = GLOSSARY.filter((other) => other !== term && other.endsWith(` ${term}`)).map((other) => other.slice(0, -term.length));
  return [...String(text).matchAll(pattern)]
    .map((match) => ({ gloss: normalizeGloss(match[2]), index: match.index + match[1].length }))
    .filter(({ index }) => !heads.some((head) => String(text).slice(0, index).endsWith(head)));
}
