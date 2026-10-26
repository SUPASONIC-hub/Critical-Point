/**
 * The privacy patterns, in a module with no dependencies.
 *
 * These three regexes and the two functions over them were written in
 * `gameLogic.js`, which is where the feedback panel reads them from. It lives in
 * the runtime chunk, which already carries the season, so importing them from
 * there costs that chunk nothing.
 *
 * The 참가자 게시판 is the first surface outside the runtime that needs the same
 * check, and it sits in the pre-start shell. `gameLogic.js` imports `gameData.js`,
 * which merges the case packs at module scope -- a side effect, so rollup cannot
 * shake it out. Importing `detectPrivacySignals` from there into the shell was
 * measured at +3.0MB on the entry chunk (index 132KB -> 3,130KB): the whole
 * season, downloaded before the intro paints, for two regexes. `appConfig.js`
 * already carries `limitText` and `makeEmptyScores` for exactly this reason and
 * says so.
 *
 * So the patterns live here, where anything may import them, and `gameLogic.js`
 * re-exports them for the runtime surfaces that already read them from there.
 * One home, so a change to a pattern is one edit.
 */
const emailPatternSource = String.raw`[^\s@,.;:!?]+@[^\s@,.;:!?]+\.[^\s@,.;:!?]+`;
const phonePatternSource = String.raw`01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}`;
const organizationPatternSource = String.raw`((주식회사|\(주\))\s*[가-힣A-Za-z0-9]+?(?=(과|와|에|에서|에게|으로|로|은|는|이|가|을|를|,|\.|\s|$))|[가-힣A-Za-z0-9]+(회사|그룹|은행|전자|건설|테크|랩스|코퍼레이션|inc\.?|llc))`;

const emailPattern = new RegExp(emailPatternSource);
const phonePattern = new RegExp(phonePatternSource);
const organizationPattern = new RegExp(organizationPatternSource, "i");

/** What each signal is called where it is named (the board lays another language over them, src/copy/boardPost.js). */
export const PRIVACY_SIGNAL_LABELS = { email: "이메일", phone: "전화번호", organization: "회사·조직명" };

export function detectPrivacySignals(text = "") {
  return [
    { label: PRIVACY_SIGNAL_LABELS.email, active: emailPattern.test(text) },
    { label: PRIVACY_SIGNAL_LABELS.phone, active: phonePattern.test(text) },
    { label: PRIVACY_SIGNAL_LABELS.organization, active: organizationPattern.test(text) },
  ];
}

export function anonymizeSensitiveText(text = "") {
  return text
    .replace(new RegExp(emailPatternSource, "g"), "익명 이메일")
    .replace(new RegExp(phonePatternSource, "g"), "익명 연락처")
    .replace(new RegExp(organizationPatternSource, "gi"), "익명 조직");
}

/**
 * What the game says about the data it keeps, in the words both the intro and
 * the privacy policy use.
 *
 * The 데이터 저장 안내 drawer prints `PLAYTEST_DATA_NOTICE` beside the consent
 * box, and the policy pages (`/privacy.html`, `/en/privacy.html`, written at
 * build time by scripts/legal-pages.mjs) quote the same sentence as the short
 * form of their playtest section, so the two cannot drift. The pages are plain
 * files beside the build, not screens of the app: a store listing links to
 * them, and nothing about them reaches the entry chunk but these strings.
 * The contact address is appConfig.js's SUPPORT_CONTACT, which the data
 * drawer's deletion-request line prints.
 */
export const PRIVACY_PAGE_PATH = "/privacy.html";
export const TERMS_PAGE_PATH = "/terms.html";
export const DATA_RETENTION_DAYS = 180;
export const PLAYTEST_DATA_NOTICE =
  "사건 결과, 선택 로그, 응답 시간, 보낸 피드백, 오류 보고가 이 기기의 무작위 식별 번호와 함께 연구용으로 저장되고 180일 뒤 지워집니다. 이름은 원격 저장하지 않으며, 접속 주소는 요청 횟수를 제한하는 데만 씁니다.";
