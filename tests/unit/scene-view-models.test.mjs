import assert from "node:assert/strict";
import { test } from "node:test";

import { getOperatorProfile } from "../../src/advancedSystems.js";
import { AUTHORITY_THRESHOLDS, getAuthorityClueThresholds } from "../../src/gameLogic.js";
import { characterProfiles } from "../../src/gameDialogue.js";
import { easyResourceLabels } from "../../src/playerLanguage.js";
import {
  createActiveBonus, createAuthorityState, createInheritedChallenge, createSceneChallenge, createSpeakerProfile,
} from "../../src/viewModels/sceneViewModels.js";

/**
 * The copy the play screen derives from a handful of run values: who is
 * speaking, what the analyst is allowed to do and what would allow more, which
 * bonus is named, and the one challenge a scene sets.
 *
 * That every speaker written into the graph has a profile of their own is
 * held in characterProfiles.test.mjs; here it is what is shown when one has
 * none, and which of several answers wins when more than one applies.
 */

const { oversightLegitimacy, fieldClues, fieldTrust } = AUTHORITY_THRESHOLDS;
const authority = (extra) => createAuthorityState({ evidence: 0, legitimacy: 0, trust: 0, operatorOrigin: "courier", ...extra });

test("a speaker with no profile is shown the stock card, whole", () => {
  const stock = createSpeakerProfile({ node: { speaker: "장부에 없는 사람", caseId: "case01" } });
  assert.equal(stock.role, "사건 관계자");
  for (const field of ["role", "stance", "job", "appearance", "thought", "gesture", "voice", "line"]) {
    assert.ok(typeof stock[field] === "string" && stock[field].length > 0, `the stock card has a ${field} to print`);
  }
  assert.deepEqual(createSpeakerProfile({ node: {} }), stock, "a scene with no speaker reads the same card");
  assert.deepEqual(createSpeakerProfile({}), stock, "and so does no scene at all");
});

test("a speaker with a profile is shown their own, not the stock card", () => {
  const [name] = Object.keys(characterProfiles);
  const own = createSpeakerProfile({ node: { speaker: name, caseId: "case01" } });
  assert.notEqual(own.role, "사건 관계자");
  assert.notEqual(own.line, createSpeakerProfile({}).line);
});

test("the authority level opens on clues or on trust, and oversight on clues with legitimacy", () => {
  assert.equal(authority().level, "OBSERVER");
  assert.equal(authority({ evidence: fieldClues }).level, "FIELD ACCESS");
  assert.equal(authority({ trust: fieldTrust }).level, "FIELD ACCESS", "trust alone opens the field");
  const { oversightClues } = getAuthorityClueThresholds(0);
  assert.equal(authority({ evidence: oversightClues, legitimacy: oversightLegitimacy - 1 }).level, "FIELD ACCESS", "clues without legitimacy do not open oversight");
  assert.equal(authority({ evidence: oversightClues, legitimacy: oversightLegitimacy }).level, "OVERSIGHT");
});

test("each authority level says what would open the next one, in the numbers the gate asks for", () => {
  const observer = authority().locked;
  assert.equal(observer, `단서 ${fieldClues}개, 또는 ${easyResourceLabels.trust} ${fieldTrust}가 필요합니다.`, "55 is read 오십오, so it takes 가");
  const field = authority({ evidence: fieldClues }).locked;
  assert.ok(field.includes(`${easyResourceLabels.legitimacy} ${oversightLegitimacy}`), "the field level quotes the legitimacy oversight asks for");
  assert.ok(field.includes(`단서 ${getAuthorityClueThresholds(0).oversightClues}개`));
  const oversight = authority({ evidence: 99, legitimacy: 100 }).locked;
  assert.doesNotMatch(oversight, /\d/, "the top level asks for nothing more");
  assert.equal(new Set([observer, field, oversight]).size, 3);
});

test("the clues quoted for oversight grow with the cases the run has opened", () => {
  const late = 10;
  const asked = getAuthorityClueThresholds(late).oversightClues;
  assert.ok(asked > getAuthorityClueThresholds(0).oversightClues, "ten cases in, the gate asks for more clues than at the start");
  const state = authority({ evidence: fieldClues, casesOpened: late });
  assert.ok(state.locked.includes(`단서 ${asked}개`), "and the sentence quotes that count, not the first case's");
  assert.equal(authority({ evidence: asked - 1, legitimacy: 100, casesOpened: late }).level, "FIELD ACCESS", "which is the count the level is decided on");
  assert.equal(authority({ evidence: asked, legitimacy: 100, casesOpened: late }).level, "OVERSIGHT");
});

test("the authority state carries the clue count, the level's permissions and the analyst's origin", () => {
  const observer = authority({ evidence: 1, operatorOrigin: "courier" });
  const oversight = authority({ evidence: 99, legitimacy: 100, operatorOrigin: "courier" });
  assert.equal(observer.evidence, 1);
  assert.equal(observer.permissions.length, 3);
  assert.notDeepEqual(observer.permissions, oversight.permissions, "a higher level is allowed different things");
  assert.equal(observer.origin.title, getOperatorProfile("courier").title);
  assert.equal(observer.origin.level, "OBSERVER");
  assert.equal(authority({ operatorOrigin: "no-such-origin" }).origin.id, getOperatorProfile().id, "an origin the game does not know falls back to the default one");
});

test("the bonus named is the first that applies: the hand's line, then the reframe, the streak, the slow read, the long run", () => {
  const bonus = (extra) => createActiveBonus({ currentAverageResponseTime: 0, currentChallengeStreak: 0, reframeCombo: 0, log: [], ...extra });
  const three = [{}, {}, {}];
  assert.equal(bonus(), "보너스 대기");
  assert.equal(bonus({ log: three }), "연속 판단 보너스");
  assert.equal(bonus({ log: [{}, {}] }), "보너스 대기", "two decisions are not yet a run of them");
  assert.equal(bonus({ log: three, currentAverageResponseTime: 20 }), "숙고 보너스");
  assert.equal(bonus({ log: three, currentAverageResponseTime: 20, currentChallengeStreak: 2 }), "연속 챌린지 보너스");
  assert.equal(bonus({ log: three, currentAverageResponseTime: 20, currentChallengeStreak: 2, reframeCombo: 2 }), "판 바꾸기 보너스");
  assert.equal(bonus({ log: [...three, { handLine: "QUICK READ ×1.2" }], currentChallengeStreak: 2, reframeCombo: 2 }), "QUICK READ");
  assert.equal(bonus({ currentChallengeStreak: 1, reframeCombo: 1, currentAverageResponseTime: 19.9 }), "보너스 대기", "one under each line names nothing");
});

test("only the last decision's hand line names QUICK READ, under either name it was logged by", () => {
  const bonus = (log) => createActiveBonus({ currentAverageResponseTime: 0, currentChallengeStreak: 0, reframeCombo: 0, log });
  assert.equal(bonus([{ tempoBonus: "QUICK READ" }]), "QUICK READ", "an entry logged before 2026-10-11 holds it as tempoBonus");
  assert.equal(bonus([{ handLine: "QUICK READ" }, {}]), "보너스 대기", "a hand line one decision back is over");
  assert.equal(bonus([{ handLine: "" }]), "보너스 대기", "an empty line is no line");
});

test("an opening scene inherits the last case's challenge, and no other scene does", () => {
  const written = { id: "from-the-pack", title: "t", text: "x" };
  const legacy = { label: "CLEAR SIGNAL", continuityChallenge: written };
  assert.equal(createInheritedChallenge({ isOpeningNode: true, openingLegacy: legacy }), written, "the challenge the pack wrote is used as written");
  assert.equal(createInheritedChallenge({ isOpeningNode: false, openingLegacy: legacy }), null);
  assert.equal(createInheritedChallenge({ isOpeningNode: true, openingLegacy: null }), null, "the first case inherits nothing");
});

test("a legacy with no challenge written gets the one its label stands for", () => {
  const inherited = (label) => createInheritedChallenge({ isOpeningNode: true, openingLegacy: { label } });
  const byLabel = { "CLEAR SIGNAL": "protect-trust", "OPEN WOUND": "repair-legitimacy", "UNFINISHED COST": "lower-risk", "SOMETHING ELSE": "find-cost" };
  const seen = new Set();
  for (const [label, id] of Object.entries(byLabel)) {
    const challenge = inherited(label);
    assert.equal(challenge.id, id, `${label} sets ${id}`);
    assert.ok(challenge.title && challenge.text, `${label} has a title and a sentence`);
    seen.add(`${challenge.title}|${challenge.text}`);
  }
  assert.equal(seen.size, 4, "no two labels share their copy");
  assert.match(inherited("CLEAR SIGNAL").title, new RegExp(easyResourceLabels.trust), "the trust challenge names trust as the player reads it");
  assert.match(inherited("OPEN WOUND").title, new RegExp(easyResourceLabels.legitimacy));
});

test("a scene sets one challenge: the inherited one, then risk, the reframe, the competition, the hidden cost", () => {
  const reframeChoice = { id: "__reframe__" };
  const challenge = (extra) => createSceneChallenge({ reframeChoice: null, reframeCombo: 0, inheritedChallenge: null, node: { triggers: [] }, riskPressure: 0, ...extra }).id;
  const inherited = { id: "protect-trust", title: "t", text: "x" };
  assert.equal(createSceneChallenge({ reframeChoice, reframeCombo: 0, inheritedChallenge: inherited, node: { triggers: ["competition"] }, riskPressure: 99 }), inherited);
  assert.equal(challenge({ riskPressure: 35, reframeChoice, node: { triggers: ["competition"] } }), "lower-risk");
  assert.equal(challenge({ riskPressure: 34, reframeChoice, node: { triggers: ["competition"] } }), "use-reframe", "one under the risk line, the reframe is offered first");
  assert.equal(challenge({ reframeChoice, reframeCombo: 1, node: { triggers: ["competition"] } }), "avoid-risk", "a reframe already made is not asked for again");
  assert.equal(challenge({ node: { triggers: ["competition"] } }), "avoid-risk", "nor is one the scene does not offer");
  assert.equal(challenge({ node: { triggers: ["deadline"] } }), "find-cost");
  assert.equal(challenge({ node: {} }), "find-cost", "a scene with no triggers written still sets one");
  assert.equal(challenge({ node: undefined }), "find-cost");
});
