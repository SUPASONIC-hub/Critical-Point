import assert from "node:assert/strict";
import { test } from "node:test";

import { CASE_SEQUENCE } from "../../src/gameCases.js";
import { nodes } from "../../src/gameData.js";
import { REFRAME_EFFECT } from "../../src/gameLogic.js";
import { CHAIN_MARK, recheckChain, SETTLED_INSIDE, UNCHECKED } from "../../src/chainRecheck.js";
import { applyGauntletEffect } from "../../src/gauntlet/gauntletEngine.js";
import { STAGED } from "../../src/gauntlet/tableUnlocks.js";
import { WINDOW_RECORD_KEY } from "../../src/rankingRecheck.js";
import { recheckCaseSettlement } from "../../src/settlementRecheck.js";
import { createSeasonBot } from "../../scripts/sim/season-bot.mjs";
import { createWindowRecorder, thresholdOfVerdict } from "./helpers/windowRecorder.mjs";

/** A run's case rows as the server stores them, made by the season bot (fixed seeds). */
function seasonRows(seed, archetype) {
  const season = createSeasonBot({ seed, staged: STAGED }).playSeason(0, archetype);
  return CASE_SEQUENCE.map((caseId) => ({
    run_id: `bot-${seed}`,
    case_id: caseId,
    summary: season.caseResults[caseId],
    dynamics: season.caseDynamics[caseId],
    decision_log: season.caseLogs[caseId],
  }));
}

/**
 * The same with every window's replay record and the verdict's threshold and
 * price on each entry (`riskRewardEffect`, the look), as useChoiceCommit logs them.
 */
function recordedRows(seed) {
  const recorder = createWindowRecorder({ digits: 3 });
  const verdicts = [];
  const season = createSeasonBot({ seed, staged: STAGED, reduce: recorder.reduce }).playSeason(0, "balanced", false, ({ verdict }) => verdicts.push(verdict));
  const total = CASE_SEQUENCE.reduce((sum, caseId) => sum + season.caseLogs[caseId].length, 0);
  let at = recorder.closed.length - total;
  let settled = verdicts.length - total;
  return CASE_SEQUENCE.map((caseId) => ({
    run_id: `rec-${seed}`,
    case_id: caseId,
    summary: season.caseResults[caseId],
    dynamics: season.caseDynamics[caseId],
    decision_log: season.caseLogs[caseId].map((entry) => {
      const verdict = verdicts[settled++];
      const card = nodes[entry.nodeId].choices.find((choice) => choice.id === entry.choiceId);
      const base = entry.reframe ? REFRAME_EFFECT : card?.effect;
      // A card the page adds (a memory card) is priced by the page alone: no price is logged for it here.
      const riskRewardEffect = base && applyGauntletEffect(base, {
        outcome: verdict.outcome,
        gauge: verdict.gauge,
        fracturedAxis: verdict.fracturedAxis,
        fractureRate: verdict.fractureRate,
        focusMultiplier: verdict.focus?.resourceMultiplier,
        scouted: verdict.scouted,
      });
      return { ...entry, ...(riskRewardEffect ? { riskRewardEffect } : {}), threshold: { ...entry.threshold, ...thresholdOfVerdict(verdict), scouted: verdict.scouted }, [WINDOW_RECORD_KEY]: recorder.closed[at++].record };
    }),
  }));
}

const settle = recheckCaseSettlement;
const honest = [seasonRows(20261021, "balanced"), seasonRows(20261022, "money"), seasonRows(20261023, "random")];
const recorded = recordedRows(1000);
const copy = (rows) => structuredClone(rows);
/** The first case row whose log has at least `length` entries. */
const caseWith = (rows, length = 3) => rows.findIndex((row) => row.decision_log.length >= length);

test("honest seasons settle again with no break, and the next scene and resourcesAfter leave the not-checked count", () => {
  for (const rows of [...honest, recorded]) {
    const report = recheckChain(rows, { settle });
    assert.deepEqual(report.breaks, [], `${rows[0].run_id}: ${JSON.stringify(report.breaks.slice(0, 3))}`);
    assert.deepEqual(report.marks, []);
    // The board, the audit and the link are still counted on every case; resourcesAfter on none.
    for (const field of UNCHECKED.inside.filter((name) => !SETTLED_INSIDE.includes(name))) assert.equal(report.unchecked.fields[field], CASE_SEQUENCE.length, field);
    assert.equal(report.unchecked.fields.resourcesAfter, undefined);
    // A scene is left unread only for a card the page adds (a memory card), never for most cases.
    assert.ok((report.unchecked.fields.scene ?? 0) < CASE_SEQUENCE.length / 2, `scene ${report.unchecked.fields.scene}`);
  }
  // Without the settle checker the five are counted as before.
  const plain = recheckChain(honest[0]);
  for (const field of UNCHECKED.inside) assert.equal(plain.unchecked.fields[field], CASE_SEQUENCE.length, field);
});

test("a recorded season prices every logged price again off its replay record", () => {
  const report = recheckChain(recorded, { settle });
  assert.ok(recorded.some((row) => row.decision_log.some((entry) => entry.riskRewardEffect)));
  assert.equal(report.unchecked.fields.price, undefined);
});

test("resourcesAfter edited (and the next entry started from it) is marked, with where", () => {
  const rows = copy(honest[0]);
  const at = caseWith(rows);
  const log = rows[at].decision_log;
  log[0].resourcesAfter = { ...log[0].resourcesAfter, capital: log[0].resourcesAfter.capital + 7 };
  log[1].resourcesBefore = { ...log[0].resourcesAfter };
  const report = recheckChain(rows, { settle });
  assert.deepEqual(report.marks, [CHAIN_MARK]);
  assert.ok(report.breaks.some((found) => found.case === rows[at].case_id && found.where === "inside" && found.entry === 0 && found.field === "resourcesAfter"));
});

test("an effect, or a price, edited to match the resources is marked", () => {
  const rows = copy(recorded);
  const at = caseWith(rows);
  const entry = rows[at].decision_log.findIndex((item) => !item.threshold.busted && nodes[item.nodeId].choices.some((choice) => choice.id === item.choiceId));
  const log = rows[at].decision_log;
  const bump = (effect) => ({ ...effect, trust: (effect.trust ?? 0) + 1 });
  // The effect raised, the price left: the merge does not come out.
  const effectOnly = copy(rows);
  effectOnly[at].decision_log[entry].effect = bump(log[entry].effect);
  assert.ok(recheckCaseSettlement(effectOnly[at]).breaks.some((found) => found.field === "resourcesAfter" || found.field === "effect"));
  const merged = copy(rows);
  const edited = merged[at].decision_log[entry];
  edited.effect = bump(edited.effect);
  edited.resourcesAfter = { ...edited.resourcesAfter, trust: edited.resourcesBefore.trust + edited.effect.trust };
  if (edited.resourcesAfter.trust >= 0 && edited.resourcesAfter.trust <= 100) {
    assert.ok(recheckCaseSettlement(merged[at]).breaks.some((found) => found.entry === entry && found.field === "effect"));
  }
  // The price raised with it: the card's own effect at that verdict does not come to it.
  const priced = copy(merged);
  priced[at].decision_log[entry].riskRewardEffect = bump(priced[at].decision_log[entry].riskRewardEffect);
  assert.ok(recheckCaseSettlement(priced[at]).breaks.some((found) => found.entry === entry && (found.field === "riskRewardEffect" || found.field === "resourcesAfter")));
});

test("a scene the card does not lead to, or a case that does not close where it ends, is marked", () => {
  const rows = copy(honest[1]);
  const at = caseWith(rows);
  const log = rows[at].decision_log;
  const other = Object.keys(nodes).find((id) => id !== log[1].nodeId && nodes[id].choices?.length);
  log[1].nodeId = other;
  const found = recheckCaseSettlement(rows[at], rows[at - 1] ?? null).breaks;
  assert.ok(found.some((item) => item.entry === 0 && item.field === "scene"), JSON.stringify(found));
  // The log cut short: its last card does not close the case.
  const cut = copy(honest[1]);
  cut[at].decision_log = cut[at].decision_log.slice(0, -1);
  assert.ok(recheckCaseSettlement(cut[at], cut[at - 1] ?? null).breaks.some((item) => item.field === "scene" && item.found === "the case's close"));
});

test("without the case before, a route that does not come out is not checked rather than marked", () => {
  const rows = copy(honest[0]);
  const at = Math.max(1, caseWith(rows));
  rows[at].decision_log[1].nodeId = Object.keys(nodes).find((id) => id !== rows[at].decision_log[1].nodeId);
  const alone = recheckCaseSettlement(rows[at], null);
  assert.equal(alone.breaks.filter((item) => item.field === "scene").length, 0);
  assert.ok(alone.unchecked.includes("scene"));
});

test("what a row cannot say is counted, never passed or marked", () => {
  assert.deepEqual(recheckCaseSettlement({ case_id: "prologue01", decision_log: null }), { breaks: [], unchecked: ["resourcesAfter", "scene"] });
  assert.deepEqual(recheckCaseSettlement({ case_id: "prologue01", decision_log: [] }).breaks, []);
  const bare = recheckCaseSettlement({ case_id: "prologue01", decision_log: [null, { nodeId: "nowhere", choiceId: "x" }] });
  assert.deepEqual(bare.breaks, []);
  assert.deepEqual(bare.unchecked.sort(), ["resourcesAfter", "scene"]);
  // A price with no replay record behind it is not worked out.
  const rows = copy(recorded);
  const at = caseWith(rows);
  for (const entry of rows[at].decision_log) delete entry[WINDOW_RECORD_KEY];
  const unrecorded = recheckCaseSettlement(rows[at]);
  assert.deepEqual(unrecorded.breaks, []);
  assert.ok(unrecorded.unchecked.includes("price"));
  // An unreadable row is the chain's own "not checked": the settlement is not asked.
  const report = recheckChain([{ run_id: "x", case_id: "prologue01", dynamics: {}, decision_log: "no" }], { settle });
  assert.equal(report.unchecked.cases, 1);
  assert.equal(report.unchecked.fields.resourcesAfter, undefined);
});
