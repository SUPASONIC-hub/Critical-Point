import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { getBalanceSignals, getPlayReport, getRankingComparison } from "../../src/advancedSystems.js";

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
