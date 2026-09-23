/**
 * The privacy patterns, in a module with no dependencies.
 *
 * These three regexes and the two functions over them were written in
 * `gameLogic.js`, which is where the free-input card and the feedback panel read
 * them from. Both of those live in the runtime chunk, which already carries the
 * season, so importing them from there costs that chunk nothing.
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

export function detectPrivacySignals(text = "") {
  return [
    { label: "이메일", active: emailPattern.test(text) },
    { label: "전화번호", active: phonePattern.test(text) },
    { label: "회사·조직명", active: organizationPattern.test(text) },
  ];
}

export function anonymizeSensitiveText(text = "") {
  return text
    .replace(new RegExp(emailPatternSource, "g"), "익명 이메일")
    .replace(new RegExp(phonePatternSource, "g"), "익명 연락처")
    .replace(new RegExp(organizationPatternSource, "gi"), "익명 조직");
}
