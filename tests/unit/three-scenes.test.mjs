import assert from "node:assert/strict";
import { test } from "node:test";

import { nodes } from "../../src/gameData.js";
import { createCaseSummary } from "../../src/gameLogic.js";
import { toRowSummary } from "../../src/state/useChoiceCommit.js";
import { getThreeScenes, THREE_SCENES, threeScenesHeading } from "../../src/threeScenes.js";

/**
 * B-12(2) 「당신의 세 장면」 (src/threeScenes.js): the cards of 프롤로그 01, 사건 48
 * and the finale, named on the closing report. What is tested: each scene
 * deals the cards it is read for, a missing or unknown card shows nothing for
 * that scene, a forced finale card is left out, and reading them changes no
 * byte of the summary or the ranking row.
 */
const label = (sceneId, choiceId) => nodes[sceneId].choices.find((choice) => choice.id === choiceId).label;
const fullSeason = () => ({
  prologue01: { outcomeChoiceId: "p1_after_record", outcomeNodeId: "p1_aftershock" },
  case48: { outcomeChoiceId: "c48_after_record", outcomeNodeId: "c48_aftershock", finalChoiceId: "c48_final_dissent" },
  final: { outcomeChoiceId: "f_after_x", outcomeNodeId: "f_aftershock", finalChoiceId: "ending_reform" },
});
const finaleLog = (entry = {}) => [
  { caseId: "final", nodeId: "f_choice", choiceId: "ending_seal", choice: label("f_choice", "ending_seal"), ...entry },
  { caseId: "final", nodeId: "f_aftershock", choiceId: "f_after_x", choice: "-" },
];

test("each scene deals the cards it is read for, and has a title", () => {
  for (const { sceneId } of THREE_SCENES) {
    assert.ok(nodes[sceneId]?.choices?.length >= 3, `${sceneId} deals cards`);
    assert.ok(nodes[sceneId].title, `${sceneId} has a title`);
  }
});

test("a full season shows three scenes in season order, with the card's own label", () => {
  const scenes = getThreeScenes({ caseResults: fullSeason(), log: finaleLog() });
  assert.deepEqual(scenes, [
    { id: "prologue01", place: `프롤로그 01 · ${nodes.p1_aftershock.title}`, label: label("p1_aftershock", "p1_after_record") },
    { id: "case48", place: `사건 48 · ${nodes.c48_final.title}`, label: label("c48_final", "c48_final_dissent") },
    // The finale's own log wins over its summary.
    { id: "final", place: `마지막 사건 · ${nodes.f_choice.title}`, label: label("f_choice", "ending_seal") },
  ]);
  assert.equal(threeScenesHeading(scenes.length), "당신의 세 장면");
});

test("the finale with no log of its last question reads the summary's card", () => {
  const scenes = getThreeScenes({ caseResults: fullSeason(), log: [] });
  assert.equal(scenes.at(-1).label, label("f_choice", "ending_reform"));
});

test("a forced or system finale card is left out, even with a card in the summary", () => {
  for (const entry of [{ threshold: { forced: true } }, { isSystemEvent: true }]) {
    const scenes = getThreeScenes({ caseResults: fullSeason(), log: finaleLog(entry) });
    assert.deepEqual(scenes.map((scene) => scene.id), ["prologue01", "case48"]);
  }
});

test("a missing record shows only what is there, or nothing", () => {
  for (const input of [undefined, {}, { caseResults: null }, { caseResults: [] }, { caseResults: {}, log: null }]) {
    assert.deepEqual(getThreeScenes(input), []);
  }
  // A save from before `finalChoiceId`: 사건 48 and the finale have no card to read.
  const old = fullSeason();
  delete old.case48.finalChoiceId;
  delete old.final.finalChoiceId;
  const scenes = getThreeScenes({ caseResults: old, log: [] });
  assert.deepEqual(scenes.map((scene) => scene.id), ["prologue01"]);
  assert.equal(threeScenesHeading(1), "당신의 한 장면");
  assert.equal(threeScenesHeading(2), "당신의 두 장면");
});

test("a card the scene does not deal shows nothing for that scene", () => {
  const season = fullSeason();
  season.prologue01.outcomeChoiceId = "p1_after_record_adaptive_reframe";
  season.case48.finalChoiceId = "c48_pen_x"; // a route that skipped 다섯 번째 칸
  season.final.finalChoiceId = 7;
  assert.deepEqual(getThreeScenes({ caseResults: season, log: [] }), []);
});

const freeze = (value) => {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

test("display only: the same log gives the same summary and ranking row bytes, read or not", () => {
  const log = finaleLog();
  const options = { resources: { time: 60, capital: 80, trust: 50, legitimacy: 50, humanCost: 5, fatigue: 20 }, schemaVersion: 2 };
  const rowBytes = () => {
    const summary = createCaseSummary({ choice: 2 }, { inference: 1 }, log, options);
    return [JSON.stringify(summary), JSON.stringify(toRowSummary({ ...summary, finalChoiceId: "ending_seal", endingVariant: { id: "reform" } }))];
  };
  const caseResults = fullSeason();
  const before = { row: rowBytes(), caseResults: JSON.stringify(caseResults), log: JSON.stringify(log) };
  // Frozen: a write to either would throw in this strict-mode module.
  getThreeScenes({ caseResults: freeze(caseResults), log: freeze(log) });
  assert.deepEqual(rowBytes(), before.row);
  assert.equal(JSON.stringify(caseResults), before.caseResults);
  assert.equal(JSON.stringify(log), before.log);
});
