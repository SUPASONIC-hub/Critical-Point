/**
 * Plain-language check.
 *
 * The season is a bank story told to people who do not work in a bank, so it
 * keeps two promises about its words, and both used to be kept by hand:
 *
 * 1. It speaks the Korean a bank speaks today. The Japanese-era terms a loan
 *    file used to be written in -- 여신, 융자, 품의, 기안, 결재 and their kin --
 *    were replaced once (대출, 승인, 작성) and crept back in a later case
 *    ("개정을 기안한 부서"). They are banned from every file that holds player
 *    copy.
 *
 *    The same files are read for what the game said while 판을 다시 짠다 was
 *    a text box (`RETIRED_PHRASES`): nothing is typed any more, so no scene
 *    may describe a sentence the player wrote.
 *
 * 2. A hard word is explained, in parentheses, the first time a player can read
 *    it in a case. Every case can be entered on its own (the debug jump, a
 *    resumed save, a route split), so "first" is per case, not per season. A
 *    case can open on its default scene or on one of the opening variants the
 *    previous case's aftermath picks, so each opening scene that uses a term
 *    has to explain it itself, and any later scene may say it bare only when
 *    every route from every opening has explained it by then
 *    (`unexplainedUses`). What that rule found on its first day is held as a
 *    ceiling that only comes down (`BARE_ON_A_ROUTE`).
 *
 * 3. A term is explained the same way every time. The season explained 자문료
 *    nine ways and 실사 in two meanings, because each case wrote its own
 *    parenthesis. `STANDARD_GLOSS` names the one wording per term, and every
 *    parenthesis that says something else is a warning, not a failure: the copy
 *    is rewritten after the W44 freeze. Their number is held as a ceiling that
 *    only comes down (`OFF_STANDARD_CEILING`), so a new case writes the
 *    standard wording. `--glosses` lists every one.
 *
 * Only narration is checked -- a scene's lead and body -- because that is where
 * a sentence has room for a parenthesis. Choice labels and memo lines are short
 * by design and lean on the narration above them.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { CASE_SEQUENCE, CASE_START_NODES, caseOpeningRoutes, nodeOrders, nodes } from "../src/gameData.js";
import { UNLOCK_LADDER } from "../src/gauntlet/tableUnlocks.js";
import { BANNED, GLOSSARY, RETIRED_PHRASES, STANDARD_GLOSS, findBannedWords, findGlosses, findRetiredPhrases } from "./plain-language-rules.mjs";

// Every case file is copy, so the list reads the folder rather than naming each
// case: a new case was once added and its file left off this list.
const COPY_FILES = [
  ...readdirSync("src/nodes")
    .filter((name) => name.endsWith(".js"))
    .sort()
    .map((name) => `src/nodes/${name}`),
  "src/gameData.js",
  "src/gameDialogue.js",
  "src/appCopy.js",
  "src/caseCopy.js",
  "src/gameCases.js",
  "src/gameLogic.js",
  "src/featurePack.js",
  "src/advancedSystems.js",
  "src/runtimeSystems.js",
  // The 판단 습관 names and lines the result card prints.
  "src/judgementHabit.js",
  // The lines a prologue's first briefing says about the rules it turns on.
  "src/gauntlet/tableUnlocks.js",
];

// Copy a screen prints about the game itself. It never held a bank word, so
// the banned list does not read it; it did describe the text box.
const SCREEN_COPY_FILES = [
  "src/viewModels/sceneViewModels.js",
  "src/viewModels/reportViewModels.js",
  "src/state/useResultReport.js",
  "src/logicReport.js",
];

const failures = [];

for (const file of COPY_FILES) {
  const text = readFileSync(file, "utf8");
  for (const { word, instead, line } of findBannedWords(text)) {
    failures.push(`${file}:${line} uses "${word}" -- write "${instead}"`);
  }
}
for (const file of [...COPY_FILES, ...SCREEN_COPY_FILES]) {
  const text = readFileSync(file, "utf8");
  for (const { word, instead, line } of findRetiredPhrases(text)) {
    failures.push(`${file}:${line} still describes the text box ("${word}") -- the card is staked, not typed: "${instead}"`);
  }
}
// A rule's introduction is one line on a briefing, with no room for a
// parenthesis: it is about the table and says no word that would need one.
for (const step of UNLOCK_LADDER) {
  for (const line of [step.kicker, ...step.intro]) {
    for (const term of GLOSSARY.filter((word) => line.includes(word))) {
      failures.push(`src/gauntlet/tableUnlocks.js: ${step.caseId}'s introduction says "${term}" with no room to explain it ("${line}")`);
    }
  }
}

// Which nodes belong to a case: the graph stamps every scene with its case
// (`finishSceneGraph`). This used to be read off the id -- digits first, which
// left the 프롤로그 unchecked, then a prefix per case with its own regex for
// 사건 01 -- and a third copy of that mapping could only drift.

function narration(node = {}) {
  return [node.lead, node.text].filter(Boolean).join(" ");
}

/** Right after the term, or after one short word that finishes it: 유동성 위기(…). */
function explainedAt(text, index, term) {
  return /^(\s?[가-힣]{1,3})?\s?\(/.test(text.slice(index + term.length, index + term.length + 6));
}

/**
 * How one scene uses one term: whether the first time it says it is explained,
 * and whether it explains it anywhere. Null when the scene never says it.
 */
function useIn(id, term) {
  const text = narration(nodes[id]);
  if (!text.includes(term)) return null;
  // A word start only: 우선순위 is not 선순위.
  const uses = [...text.matchAll(new RegExp(`(^|[^가-힣])${term}`, "g"))].map((match) => explainedAt(text, match.index + match[1].length, term));
  return uses.length ? { firstExplained: uses[0], explains: uses.includes(true) } : null;
}

/**
 * "First use" is the first time a player reads the word, and a player reads a
 * case along a route, not down `nodeOrders`. The order puts a case's hidden
 * route right after its start and its side door after the scene it hangs on,
 * so a gloss in a scene most runs never enter used to pass the whole case:
 * 사건 11 explained 참고인 on the hidden route, and one ordinary card from the
 * start read it bare (audit of 2026-10-07, finding 2).
 *
 * So a scene may say a term bare only if every route into it has already
 * explained it. Routes start on each scene the case can open on and follow the
 * cards a scene deals; 판을 다시 짠다 is not followed, because it can jump from
 * anywhere and would leave nothing explained before the hidden route. The
 * scenes only that jump reaches are walked second, from their own first scene.
 */
function unexplainedUses(caseId, term, sceneIds, starts) {
  const use = new Map(sceneIds.map((id) => [id, useIn(id, term)]));
  if (![...use.values()].some(Boolean)) return [];
  const walk = (roots, within) => {
    const reached = new Set();
    const pending = [...roots];
    while (pending.length > 0) {
      const id = pending.pop();
      if (reached.has(id) || !within.has(id)) continue;
      reached.add(id);
      for (const choice of nodes[id].choices ?? []) if (choice.type !== "reframe") pending.push(choice.next);
    }
    // explainedBefore(scene) holds when every card into it comes from a scene
    // that explains the term or already had it explained. Start from "yes" and
    // take it away until nothing changes; a root has no card into it.
    const explainedBefore = new Map([...reached].map((id) => [id, !roots.includes(id)]));
    for (let changed = true; changed; ) {
      changed = false;
      for (const id of reached) {
        if (explainedBefore.get(id) || use.get(id)?.explains) continue;
        for (const choice of nodes[id].choices ?? []) {
          if (choice.type === "reframe" || !explainedBefore.get(choice.next)) continue;
          explainedBefore.set(choice.next, false);
          changed = true;
        }
      }
    }
    return [...reached].filter((id) => use.get(id) && !use.get(id).firstExplained && !explainedBefore.get(id));
  };
  const all = new Set(sceneIds);
  const onRoutes = walk(starts, all);
  const played = new Set();
  for (const pending = [...starts]; pending.length > 0; ) {
    const id = pending.pop();
    if (played.has(id) || !all.has(id)) continue;
    played.add(id);
    for (const choice of nodes[id].choices ?? []) if (choice.type !== "reframe") pending.push(choice.next);
  }
  const offRoute = sceneIds.filter((id) => !played.has(id));
  const entered = new Set(offRoute.flatMap((id) => (nodes[id].choices ?? []).filter((choice) => choice.type !== "reframe").map((choice) => choice.next)));
  const hiddenRoots = offRoute.filter((id) => !entered.has(id));
  const offRoutes = walk([...starts, ...hiddenRoots], all).filter((id) => !played.has(id));
  return [...onRoutes, ...offRoutes];
}

/**
 * The terms a case still says bare on some route, as `case/term`. The rule
 * above found these the day it was written (2026-10-07) and they are story to
 * rewrite, not a script to fix, so they are held as a ceiling: the check fails
 * when a case/term pair is added, and names the ones not on this list. The last
 * 28 were explained on 2026-10-08, so the list is empty and any pair fails.
 */
const BARE_ON_A_ROUTE = new Set([]);
const bareOnARoute = new Map();
for (const caseId of CASE_SEQUENCE) {
  const starts = [...new Set([CASE_START_NODES[caseId], ...Object.values(caseOpeningRoutes[caseId] ?? {})])].filter((id) => nodes[id]);
  const sceneIds = [...new Set([...(nodeOrders[caseId] ?? []), ...Object.keys(nodes).filter((id) => nodes[id].caseId === caseId).sort()])].filter((id) => nodes[id]);
  for (const term of GLOSSARY) {
    const scenes = unexplainedUses(caseId, term, sceneIds, starts);
    if (scenes.length) bareOnARoute.set(`${caseId}/${term}`, scenes);
  }
}
const describeBare = (pair) => `${pair}: needs a (plain explanation) in ${bareOnARoute.get(pair).join(", ")}, where a route reaches it unexplained`;
if (bareOnARoute.size > BARE_ON_A_ROUTE.size) {
  const added = [...bareOnARoute.keys()].filter((pair) => !BARE_ON_A_ROUTE.has(pair));
  for (const pair of added) failures.push(describeBare(pair));
  failures.push(`${bareOnARoute.size} case/term pairs are read unexplained on some route, over the ${BARE_ON_A_ROUTE.size} allowed`);
}
if (process.argv.includes("--list")) for (const pair of bareOnARoute.keys()) console.log(describeBare(pair));

/**
 * Every parenthesis that explains a term differently from its standard
 * wording. Counted on 2026-10-22: 830 parentheses explain a term right after
 * it, 71 terms are explained more than one way, and 195 of the parentheses say
 * something other than the standard. They are warnings, and the count only
 * comes down: the copy rewrite of the same day (prose-polish) wrote the
 * standard wording into 168 of them, and the four where the standard would
 * have said the wrong thing were settled the same day (증거 보전 신청 became a
 * term of its own; 시행사 and 비밀유지 서약서 got a wording that fits every
 * scene; 필적 감정's sentence was reworded). The 22 left are in the prologues,
 * which another branch was rewriting.
 */
const OFF_STANDARD_CEILING = 22;
for (const term of Object.keys(STANDARD_GLOSS)) {
  if (!GLOSSARY.includes(term)) failures.push(`STANDARD_GLOSS explains "${term}", which is not in GLOSSARY`);
}
const offStandard = [];
const variedTerms = new Set();
for (const term of GLOSSARY) {
  const uses = [];
  for (const id of Object.keys(nodes).sort()) {
    for (const { gloss } of findGlosses(narration(nodes[id]), term)) uses.push({ id, caseId: nodes[id].caseId, gloss });
  }
  if (!uses.length) continue;
  const counts = new Map();
  for (const { gloss } of uses) counts.set(gloss, (counts.get(gloss) ?? 0) + 1);
  if (counts.size > 1) variedTerms.add(term);
  const standard = STANDARD_GLOSS[term] ?? [...counts].sort((a, b) => b[1] - a[1] || a[0].length - b[0].length || a[0].localeCompare(b[0]))[0][0];
  for (const use of uses) if (use.gloss !== standard) offStandard.push({ ...use, term, standard, named: term in STANDARD_GLOSS });
}
const describeGloss = ({ id, caseId, term, gloss, standard, named }) =>
  `${id} (${caseId}): ${term}(${gloss}) -- the standard is ${term}(${standard})${named ? "" : ", the wording used most; give it a STANDARD_GLOSS entry"}`;
if (process.argv.includes("--glosses")) for (const use of offStandard) console.log(describeGloss(use));
if (offStandard.length > OFF_STANDARD_CEILING) {
  for (const use of offStandard) failures.push(describeGloss(use));
  failures.push(`${offStandard.length} parentheses explain a term other than its standard way, over the ${OFF_STANDARD_CEILING} allowed: write the STANDARD_GLOSS wording in the new one`);
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log(
  `Plain-language check passed (${Object.keys(BANNED).length} banned words, ${Object.keys(RETIRED_PHRASES).length} retired phrases, ${GLOSSARY.length} glossary terms across ${CASE_SEQUENCE.length} cases; ` +
    `${bareOnARoute.size} of the ${BARE_ON_A_ROUTE.size} allowed case/term pairs are still read unexplained on some route).`,
);
const settled = [...BARE_ON_A_ROUTE].filter((pair) => !bareOnARoute.has(pair));
if (settled.length) console.log(`Explained on every route now; take them off BARE_ON_A_ROUTE: ${settled.join(", ")}.`);
if (offStandard.length) {
  const byTerm = new Map();
  for (const { term } of offStandard) byTerm.set(term, (byTerm.get(term) ?? 0) + 1);
  const most = [...byTerm].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([term, count]) => `${term} ${count}`).join(", ");
  console.log(`warning: ${offStandard.length} of the ${OFF_STANDARD_CEILING} allowed parentheses explain a term other than its STANDARD_GLOSS way (${variedTerms.size} terms explained more than one way; most: ${most}); --glosses lists them.`);
}
if (offStandard.length < OFF_STANDARD_CEILING) console.log(`Fewer parentheses are off the standard now; take OFF_STANDARD_CEILING down to ${offStandard.length}.`);
