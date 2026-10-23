import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
const { nodeOrders } = await import("../../src/gameData.js");
const {
  decodeCase,
  decodeSeen,
  encodeCase,
  encodeSeen,
  getSceneRead,
  normalizeSeenRecord,
  orderFingerprint,
  pastSeenScenes,
  readSeenRecord,
  recordSeenScenes,
  storeSeenScenes,
} = await import("../../src/state/seenScenes.js");

/**
 * E-1 = B-14(3): the scenes a finished season read, kept a bit a scene, so a
 * NEW GAME+ season folds the ones read before and marks the rest NEW.
 */

const ORDERS = { a: ["a1", "a2", "a3", "a4", "a5", "a6", "a7"], b: ["b1", "b2"] };

test("a case's read scenes come back as they went in, and a changed order reads as none", () => {
  const seen = new Set(["a1", "a3", "a7", "b2"]);
  const value = encodeCase(ORDERS.a, seen);
  assert.match(value, /^[0-9a-z]+:[0-9a-v]+$/);
  assert.deepEqual(decodeCase(ORDERS.a, value), ["a1", "a3", "a7"]);
  assert.equal(encodeCase(ORDERS.a, new Set(["b1"])), null, "a case with nothing read is not written");
  assert.deepEqual(decodeCase([...ORDERS.a, "a8"], value), [], "a scene added since: the case reads as unread");
  assert.deepEqual(decodeCase(ORDERS.a, `${orderFingerprint(ORDERS.a)}:zz`), []);
  assert.deepEqual(decodeCase(ORDERS.a, null), []);
  assert.deepEqual(decodeCase(ORDERS.a, "x"), []);
  assert.notEqual(orderFingerprint(ORDERS.a), orderFingerprint([...ORDERS.a].reverse()));
});

test("every case of the season fits, and every scene read is about 1,300 characters", () => {
  const all = new Set(Object.values(nodeOrders).flat());
  const cases = encodeSeen(all);
  assert.deepEqual(decodeSeen(cases), all);
  assert.ok(JSON.stringify(cases).length < 1500, `${JSON.stringify(cases).length} characters`);
  assert.deepEqual(encodeSeen(new Set()), {});
  assert.equal(decodeSeen(null).size, 0);
  assert.equal(decodeSeen({ nowhere: "1:1" }).size, 0, "a case the graph no longer has is skipped");
});

test("a finished season's log is counted in, and the run that wrote it still reads the seasons before it", () => {
  const first = recordSeenScenes(null, { runId: "r1", log: [{ nodeId: "a1" }, { nodeId: "b1" }, null, { nodeId: 3 }] }, ORDERS);
  assert.equal(first.runId, "r1");
  assert.deepEqual(first.before, {});
  assert.deepEqual([...pastSeenScenes(first, "r2", ORDERS)].sort(), ["a1", "b1"]);
  assert.equal(pastSeenScenes(first, "r1", ORDERS).size, 0, "the first season has no season before it");

  const second = recordSeenScenes(first, { runId: "r2", log: [{ nodeId: "a2" }] }, ORDERS);
  assert.deepEqual([...pastSeenScenes(second, "r2", ORDERS)].sort(), ["a1", "b1"], "r2 reads r1's scenes, not its own");
  assert.deepEqual([...pastSeenScenes(second, "r3", ORDERS)].sort(), ["a1", "a2", "b1"]);

  // r2's finale replayed: its scenes are added to, the seasons before kept as they were.
  const again = recordSeenScenes(second, { runId: "r2", log: [{ nodeId: "a3" }] }, ORDERS);
  assert.deepEqual(again.before, second.before);
  assert.deepEqual([...pastSeenScenes(again, "r3", ORDERS)].sort(), ["a1", "a2", "a3", "b1"]);
  assert.deepEqual([...pastSeenScenes(again, "r2", ORDERS)].sort(), ["a1", "b1"]);
});

test("a record this version did not write is read as empty", () => {
  for (const value of [null, [], "x", { v: 2, scenes: { a: "1:1" } }]) {
    assert.deepEqual(normalizeSeenRecord(value), { v: 1, runId: null, scenes: {}, before: {} });
  }
  assert.deepEqual(normalizeSeenRecord({ v: 1, runId: 4, scenes: [], before: "x" }), { v: 1, runId: null, scenes: {}, before: {} });
  assert.equal(recordSeenScenes(null, {}).runId, null);
  assert.equal(recordSeenScenes(null).runId, null);
});

test("the device keeps the record across seasons", () => {
  const [first] = nodeOrders.case01;
  assert.deepEqual(readSeenRecord(), normalizeSeenRecord(null));
  storeSeenScenes({ runId: "r1", log: [{ nodeId: first }] });
  assert.ok(pastSeenScenes(readSeenRecord(), "r2").has(first));
  // The same season counted twice writes nothing new.
  assert.deepEqual(storeSeenScenes({ runId: "r1", log: [{ nodeId: first }] }), readSeenRecord());
  assert.deepEqual(storeSeenScenes(), readSeenRecord());
  globalThis.localStorage.setItem("critical-point-seen-scenes-v1", "{");
  assert.deepEqual(readSeenRecord(), normalizeSeenRecord(null), "an unreadable record is no record");
});

test("the page's read: folded, NEW, or nothing to tell it by", () => {
  const past = new Set(["a1"]);
  assert.equal(getSceneRead(past, "a1"), true);
  assert.equal(getSceneRead(past, "a2"), false);
  assert.equal(getSceneRead(new Set(), "a1"), null, "a device that kept no scene marks none NEW");
  assert.equal(getSceneRead(null, "a1"), null);
  assert.equal(getSceneRead(past, null), null);
});

test("the briefing folds a read scene unless the switch is off, counts what it shows, and marks a new one", async () => {
  const { readFileSync } = await import("node:fs");
  const settings = await import("../../src/state/accessibilitySettings.js");
  assert.equal(settings.DEFAULT_ACCESSIBILITY.foldReadScenes, true, "on unless turned off");
  assert.equal(settings.normalizeAccessibility({ foldReadScenes: false }).foldReadScenes, false);
  assert.equal(settings.normalizeAccessibility({ foldReadScenes: "no" }).foldReadScenes, true);
  const panel = readFileSync("src/gauntlet/WeekRulePanel.jsx", "utf8");
  assert.match(panel, /useState\(\(\) => page\?\.read === true && getAccessibility\(\)\.foldReadScenes\)/);
  assert.match(panel, /folded \? \{ \.\.\.node, lead: null, text: "", memo: \[\] \} : node/);
  assert.match(panel, /data-testid="scene-unfold" onClick=\{\(\) => setFolded\(false\)\}>\s*지난 시즌에 읽은 장면 · 펼치기/);
  assert.match(panel, /page\?\.read === false \? <b data-testid="scene-new"> · NEW<\/b> : null/);
  // The briefing prints and times the scene as told.
  const briefing = readFileSync("src/gauntlet/SceneBriefing.jsx", "utf8");
  assert.match(briefing, /const \[told, unfold, newMark\] = useSceneFold\(node, echo\);/);
  // With #272 a comment sits between them and the captions take the speaker's chip.
  assert.match(briefing, /\{unfold\}\s*(?:\{\/\*[^\n]*\*\/\}\s*)?\{told\.lead &&[^\n]*\s*<ProseCaptions text=\{told\.text\}[^\n]*\/>/);
  assert.match(briefing, /<ProseItems items=\{told\.memo\} \/>/);
  // Written when a finale closes, from the season's log.
  assert.match(readFileSync("src/state/useChoiceCommit.js", "utf8"), /finalChoiceId: findFinalChoiceEntry\(nextLog\)\?\.choiceId \?\? null, log: nextLog \}/);
  assert.match(readFileSync("src/state/useNewGamePlus.js", "utf8"), /const seen = storeSeasonScenes\(finishedSeason, finale\);/);
});

test("a closed finale counts its season's scenes; a NEW GAME+ run alone folds", async () => {
  const { seenBefore, storeSeasonScenes } = await import("../../src/state/useNewGamePlus.js");
  const [scene] = nodeOrders.case02;
  assert.equal(storeSeasonScenes({ case01: {} }, { log: [{ nodeId: scene }] }), null, "half a season counts nothing");
  assert.equal(storeSeasonScenes({ final: { runId: "r9" } }), null, "a finale handed no log counts nothing");
  assert.equal(storeSeasonScenes(null, { log: [] }), null);
  const record = storeSeasonScenes({ final: { runId: "r9" } }, { log: [{ nodeId: scene }] });
  assert.equal(record.runId, "r9");
  assert.equal(storeSeasonScenes({ final: {} }, { log: [] }).runId, null);
  assert.ok(seenBefore(record, "r10", true).has(scene));
  assert.equal(seenBefore(record, "r10", false), null);
});
