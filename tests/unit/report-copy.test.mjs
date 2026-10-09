import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  getAftermath,
  getAuthorityReview,
  getBalanceSignals,
  getDelayedConsequences,
  getEndingAtmosphere,
  getEndingPreview,
  getEndingSceneProfile,
  getEndingVisualClass,
  getFailureCause,
  getFailureObjectives,
  getOriginEndingVariant,
  getPlayReport,
  getRankingComparison,
  getRankingIntegrity,
  getSeasonGoals,
  getTelemetryDashboardSnapshot,
} from "../../src/advancedSystems.js";
import { getEndingAfterglow, getSeasonRecordNotice, observationLabels } from "../../src/endingCopy.js";
import { getAchievementProgress, getEndingEpilogue, getOperationsSnapshot, getOperatorReveal } from "../../src/featurePack.js";
import { cognitionLabels } from "../../src/gameConstants.js";
import { ENDING_IDS, getEndingVariant, getObservationLedger, getObserverPattern, getThinkingMotive } from "../../src/gameLogic.js";
import { easyCognitionLabels } from "../../src/playerLanguage.js";

/**
 * What the report prints is copy, never a key. The full record listed choice
 * ids as the route ("p1_start_a → ...") and as the over-used choice.
 */
const log = [
  { nodeId: "p1_start", choiceId: "p1_start_a", title: "마감 직전의 창구", choice: "서류를 다시 대조한다" },
  { nodeId: "p1_desk", choiceId: "p1_desk_b", title: "반대 의견", choice: "의견을 남긴다" },
  { isSystemEvent: true, nodeId: "p1_desk", choiceId: "system", title: "시스템", choice: "" },
];
const ID = /[a-z]+\d*_[a-z0-9_]+/;

test("the page before the finale says whether the season record will be sent", () => {
  const sent = getSeasonRecordNotice({ nextCaseId: "final", telemetryEnabled: true, dataConsent: true });
  assert.match(sent, /피날레를 마치면 .*시즌 기록이 .*전송됩니다/);
  // The one thing the player can still not undo: cases closed before the box was ticked.
  assert.match(sent, /동의를 켜기 전에 마친 사건이 있는 회차는 랭킹에 오르지 않습니다/);
  const notSent = getSeasonRecordNotice({ nextCaseId: "final", telemetryEnabled: true, dataConsent: false });
  assert.match(notSent, /동의가 꺼져 있어/);
  assert.match(notSent, /전송되지 않고 온라인 랭킹에도 오르지 않습니다/);
  assert.notEqual(sent, notSent);
  // Nowhere else: another case is next, nothing is next, or no server exists.
  assert.equal(getSeasonRecordNotice({ nextCaseId: "case49", telemetryEnabled: true, dataConsent: true }), null);
  assert.equal(getSeasonRecordNotice({ nextCaseId: undefined, telemetryEnabled: true, dataConsent: true }), null);
  assert.equal(getSeasonRecordNotice({ nextCaseId: "final", telemetryEnabled: false, dataConsent: true }), null);
  assert.equal(getSeasonRecordNotice({ nextCaseId: "final", telemetryEnabled: false, dataConsent: false }), null);
});

/**
 * The report and the ending read these without asking whether they are there
 * (ResultScreen.jsx, ReportArchive.jsx, EndingSequence.jsx, endingCopy.js).
 * The fallbacks they used to carry -- a stand-in observer record, an "open"
 * afterglow, three sentences of an open verdict, a default plate -- could not
 * be reached, and cost the report's chunk bytes it did not have. What made
 * them unreachable is held here, on a run with nothing in it: the day one of
 * these can be missing, this fails before the screen does.
 */
test("a run with nothing in it still has everything the report reads without asking", () => {
  const pattern = getObserverPattern([]);
  for (const field of ["label", "title", "text"]) assert.ok(pattern.endingRecord[field], `endingRecord.${field}`);
  assert.ok(pattern.arc.text);
  assert.equal(pattern.turningPoint, null);

  // Four reactions, each with a label and an afterglow; the most seen of none is the first.
  const ledger = getObservationLedger([]);
  assert.deepEqual(Object.keys(ledger), Object.keys(observationLabels));
  for (const observation of Object.keys(ledger)) assert.ok(getEndingAfterglow(observation).title, observation);
  assert.equal(Object.entries(ledger).sort((a, b) => b[1] - a[1])[0][0], "compliance");

  const motive = getThinkingMotive({});
  for (const field of ["label", "when", "path"]) assert.ok(motive[field], `motive.${field}`);
  // One table would do: the report reads the first and used to fall back on the second.
  assert.deepEqual(easyCognitionLabels, cognitionLabels);

  const collapse = getEndingVariant({ seasonHumanCost: 9999, casesPlayed: 1 });
  assert.equal(collapse.failure, true);
  for (const ending of [getEndingVariant({}), getEndingVariant(), collapse]) {
    for (const field of ["id", "label", "title", "text"]) assert.ok(ending[field], `${ending.id}.${field}`);
    assert.ok(getEndingPreview(ending).label);
    // The retry objectives and the cause they quote come and go together.
    assert.equal(getFailureObjectives(ending).length > 0, Boolean(ending.failure));
    assert.equal(getFailureCause(ending) !== null, Boolean(ending.failure));
  }
  for (const id of [...ENDING_IDS, "open-question", "an id no ending has", undefined]) {
    const scene = getEndingSceneProfile(id);
    for (const field of ["location", "image", "cue", "choice"]) assert.ok(scene[field], `${id}.${field}`);
    assert.ok(getEndingAtmosphere(id).palette, `${id} palette`);
    assert.match(getEndingVisualClass(id), /^ending-visual-[a-z0-9-]+$/i);
    assert.ok(getEndingEpilogue(id), `${id} epilogue`);
    assert.ok(getAftermath(id).text);
    assert.ok(getOriginEndingVariant(undefined, id).label);
  }

  assert.ok(getOperatorReveal().title);
  assert.equal(getAchievementProgress().length, 3);
  assert.ok(getOperationsSnapshot().state);
  assert.ok(getAuthorityReview().title);
  assert.ok(getRankingIntegrity().label);
  assert.equal(getTelemetryDashboardSnapshot().completed, 0);
  assert.equal(getRankingComparison().length, 3);
  assert.equal(getSeasonGoals().length, 3);
  assert.deepEqual(getPlayReport().route, []);
  assert.deepEqual(getDelayedConsequences(), []);
  assert.deepEqual(getBalanceSignals(), []);
});

test("the route in the play report is the scenes passed, by title", () => {
  const { route, decisions } = getPlayReport({}, log);
  assert.deepEqual(route, ["마감 직전의 창구", "반대 의견"]);
  assert.equal(decisions, 2);
  assert.equal(getPlayReport({}, Array.from({ length: 12 }, (_, index) => ({ choiceId: `c_${index}`, title: `장면 ${index}` }))).route.length, 8);
  assert.deepEqual(getPlayReport({}, []).route, []);
});

test("an over-used choice is named by the card the player read", () => {
  const repeated = [log[0], log[0], log[0], log[1]];
  const [signal] = getBalanceSignals(repeated);
  assert.equal(signal.label, "서류를 다시 대조한다");
  assert.equal(signal.share, 75);
  assert.doesNotMatch(signal.label, ID);
  // An entry without its label still prints words.
  assert.doesNotMatch(getBalanceSignals([{ choiceId: "p9_x" }])[0].label, ID);
});

test("the finale counts its clues out of the clues there are", () => {
  // The line is JSX in a screen with no room for another import, so it is held
  // here by its source: it read "N/6" against 55 clues, with a bar of four.
  const archive = readFileSync(new globalThis.URL("../../src/screens/ReportArchive.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(archive, /\/6 숨은 단서/);
  assert.match(archive, /const clueTotal = clueCount \+ unopenedClueCount;/);
  assert.match(archive, /\{clueCount\}\/\{clueTotal\} 숨은 단서 발견/);
  assert.match(archive, /clueCount >= clueTotal \* gameConstants\.ENDING_GATES\.clueRate/);
});

test("the comparison bar left after the 즉답 패널티 is not called PEOPLE", () => {
  const rows = getRankingComparison({ exploitPenalty: 3, rhythmScore: 40, challengeClearCount: 2 });
  assert.deepEqual(rows.map((row) => row.label), ["EVIDENCE", "PATIENCE", "RHYTHM"]);
  assert.equal(rows[1].value, 76);
});
