import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
const { nodeOrders, nodes } = await import("../../src/gameData.js");
const { PAST_PICKS_KEY } = await import("../../src/appConfig.js");
const {
  decodeCasePicks,
  decodePicks,
  encodeCasePicks,
  encodePicks,
  getPastPick,
  normalizePastPicksRecord,
  pastPicks,
  picksFingerprint,
  picksFromLog,
  readPastPicksRecord,
  recordPastPicks,
  storePastPicks,
} = await import("../../src/state/pastPicks.js");

/**
 * B-14(1) 「지난 시즌의 당신」: the card each scene of the season before was
 * picked with, one base-36 character a scene, kept on the device for the
 * NEW GAME+ season after.
 */

const card = (id) => ({ id });
const SCENES = {
  a1: { choices: [card("a1x"), card("a1y"), card("a1z")] },
  a2: { choices: [card("a2x"), card("a2y")] },
  a3: { choices: [card("a3x"), card("a3y"), card("a3z"), card("a3w"), card("a3v")] },
  b1: { choices: [card("b1x"), card("b1y")] },
  b2: { choices: [card("b2x"), card("b2y")] },
};
const ORDERS = { a: ["a1", "a2", "a3"], b: ["b1", "b2"] };
const pick = (nodeId, choiceId, extra = {}) => ({ nodeId, choiceId, ...extra });

test("a case's picks come back as they went in, a scene not picked in is 0, and trailing zeros are cut", () => {
  const picks = new Map([["a1", "a1z"], ["a3", "a3v"], ["b2", "b2x"]]);
  const value = encodeCasePicks(ORDERS.a, picks, SCENES);
  assert.equal(value, `${picksFingerprint(ORDERS.a, SCENES)}:305`);
  assert.deepEqual(decodeCasePicks(ORDERS.a, value, SCENES), [["a1", "a1z"], ["a3", "a3v"]]);
  assert.equal(encodeCasePicks(ORDERS.a, new Map([["a1", "a1x"]]), SCENES).split(":")[1], "1", "the zeros after the last pick are cut");
  assert.equal(encodeCasePicks(ORDERS.a, new Map([["b1", "b1x"]]), SCENES), null, "a case with nothing picked is not written");
  assert.equal(encodeCasePicks(ORDERS.a, new Map([["a1", "nowhere"]]), SCENES), null, "a card the scene does not have is not written");
  assert.equal(encodeCasePicks(["zz"], new Map([["zz", "zzx"]]), SCENES), null, "a scene the graph does not have is not written");
});

test("a case whose scenes or cards changed since reads as picked in nowhere", () => {
  const value = encodeCasePicks(ORDERS.a, new Map([["a2", "a2y"]]), SCENES);
  assert.deepEqual(decodeCasePicks(ORDERS.a, value, SCENES), [["a2", "a2y"]]);
  assert.deepEqual(decodeCasePicks([...ORDERS.a, "b1"], value, SCENES), [], "a scene added");
  assert.deepEqual(decodeCasePicks(["a2", "a1", "a3"], value, SCENES), [], "scenes moved");
  const renamed = { ...SCENES, a2: { choices: [card("a2x"), card("a2-new")] } };
  assert.deepEqual(decodeCasePicks(ORDERS.a, value, renamed), [], "a card id changed");
  const reordered = { ...SCENES, a2: { choices: [card("a2y"), card("a2x")] } };
  assert.deepEqual(decodeCasePicks(ORDERS.a, value, reordered), [], "the cards' order changed");
  const reworded = { ...SCENES, a2: { choices: [{ id: "a2x", label: "새 문구" }, { id: "a2y", label: "새 문구" }] } };
  assert.deepEqual(decodeCasePicks(ORDERS.a, value, reworded), [["a2", "a2y"]], "the wording alone changed: the mark stays");
});

test("a value not written for this graph is no value", () => {
  const print = picksFingerprint(ORDERS.a, SCENES);
  for (const value of [null, 3, "x", `${print}:`, `${print}:0A`, `${print}:1-`, `${print}:0004`, `${print}:9`, `${print}:04`, `nope:1`]) {
    assert.deepEqual(decodeCasePicks(ORDERS.a, value, SCENES), [], String(value));
  }
  assert.deepEqual(decodeCasePicks(ORDERS.a, `${print}:005`, SCENES), [["a3", "a3v"]]);
  const holed = { ...SCENES, a1: { choices: [null, card("a1y")] } };
  assert.deepEqual(decodeCasePicks(ORDERS.a, `${picksFingerprint(ORDERS.a, holed)}:1`, holed), [], "a place on no card");
  assert.notEqual(picksFingerprint(ORDERS.a, SCENES), picksFingerprint(ORDERS.a, {}), "a scene with no cards prints differently");
});

test("every case of the season fits, picked in every scene, in about 2,300 characters; no scene has 35 cards", () => {
  const scenes = Object.values(nodeOrders).flat();
  for (const id of scenes) assert.ok(nodes[id].choices.length < 36, `${id} has ${nodes[id].choices.length} cards`);
  const all = new Map(scenes.map((id) => [id, nodes[id].choices.at(-1).id]));
  const cases = encodePicks(all);
  assert.deepEqual(decodePicks(cases), all);
  assert.equal(Object.keys(cases).length, Object.keys(nodeOrders).length);
  assert.ok(JSON.stringify(cases).length < 2300, `${JSON.stringify(cases).length} characters`);
  assert.deepEqual(encodePicks(new Map()), {});
  assert.equal(decodePicks(null).size, 0);
  assert.equal(decodePicks([]).size, 0);
  assert.equal(decodePicks({ nowhere: "1:1" }).size, 0, "a case the graph no longer has is skipped");
});

test("the log keeps the last card of each scene, and leaves out system entries, forced cards and dynamic cards", () => {
  const log = [
    pick("a1", "a1x"),
    pick("a2", "a2x"),
    pick("a1", "a1y"), // the case played again: the last pick is kept
    pick("a3", "a3z", { threshold: { forced: true } }), // the clock picked it
    pick("a3", "a3x", { isSystemEvent: true }),
    pick("b1", "b1_adaptive_reframe"), // a dynamic card: no place in the scene's cards
    pick("b2", "b2_relationship_bridge"),
    pick("b2", "b2y", { threshold: { forced: false } }),
    pick("zz", "zzx"),
    pick(4, "a1x"),
    pick("a2", 4),
    null,
    [],
  ];
  const picks = picksFromLog(log, SCENES);
  assert.deepEqual([...picks], [["a2", "a2x"], ["a1", "a1y"], ["b2", "b2y"]]);
  assert.equal(picksFromLog(null, SCENES).size, 0);
  // A forced card after a pick of the same scene keeps the pick.
  assert.equal(picksFromLog([pick("a1", "a1x"), pick("a1", "a1z", { threshold: { forced: true } })], SCENES).get("a1"), "a1x");
  // The real graph by default.
  const [first] = nodeOrders.case01;
  assert.equal(picksFromLog([pick(first, nodes[first].choices[0].id)]).get(first), nodes[first].choices[0].id);
});

test("a new season's finale writes over the last one; the run that wrote it still reads the season before", () => {
  const first = recordPastPicks(null, { runId: "r1", log: [pick("a1", "a1x"), pick("b1", "b1y")] }, ORDERS, SCENES);
  assert.equal(first.runId, "r1");
  assert.deepEqual(first.before, {});
  assert.deepEqual([...pastPicks(first, "r2", ORDERS, SCENES)], [["a1", "a1x"], ["b1", "b1y"]]);
  assert.equal(pastPicks(first, "r1", ORDERS, SCENES).size, 0, "the first season has no season before it");

  const second = recordPastPicks(first, { runId: "r2", log: [pick("a2", "a2y")] }, ORDERS, SCENES);
  assert.deepEqual(second.before, first.picks);
  assert.deepEqual([...pastPicks(second, "r3", ORDERS, SCENES)], [["a2", "a2y"]], "written over, not added to");
  assert.deepEqual([...pastPicks(second, "r2", ORDERS, SCENES)], [["a1", "a1x"], ["b1", "b1y"]], "r2 reads r1's picks, not its own");

  // r2's finale replayed after a case played again: its picks are written over, the season before kept.
  const again = recordPastPicks(second, { runId: "r2", log: [pick("a2", "a2x")] }, ORDERS, SCENES);
  assert.deepEqual(again.before, second.before);
  assert.deepEqual([...pastPicks(again, "r3", ORDERS, SCENES)], [["a2", "a2x"]]);
  assert.deepEqual([...pastPicks(again, "r2", ORDERS, SCENES)], [["a1", "a1x"], ["b1", "b1y"]]);

  const nameless = recordPastPicks(again, { log: [pick("b2", "b2x")] }, ORDERS, SCENES);
  assert.equal(nameless.runId, null);
  assert.deepEqual(nameless.before, again.picks, "a finale with no run id is a new season");
  assert.deepEqual([...pastPicks(nameless, null, ORDERS, SCENES)], [["b2", "b2x"]]);
});

test("a record this version did not write, or a device that kept none, reads as empty", () => {
  const empty = { v: 1, runId: null, picks: {}, before: {} };
  for (const value of [null, undefined, [], "x", { v: 2, picks: { a: "1:1" } }]) assert.deepEqual(normalizePastPicksRecord(value), empty);
  assert.deepEqual(normalizePastPicksRecord({ v: 1, runId: 4, picks: [], before: "x" }), empty);
  assert.equal(recordPastPicks(null, {}).runId, null);
  assert.deepEqual(recordPastPicks(null).picks, {});
  assert.equal(pastPicks(null).size, 0);
});

test("the device keeps one season's picks under its own key", () => {
  const [first, second] = nodeOrders.case01;
  const [x, y] = [nodes[first].choices[0].id, nodes[second].choices.at(-1).id];
  assert.deepEqual(readPastPicksRecord(), normalizePastPicksRecord(null), "a device from before this key: nothing");
  storePastPicks({ runId: "r1", log: [pick(first, x)] });
  assert.equal(PAST_PICKS_KEY, "critical-point-past-picks-v1");
  assert.ok(globalThis.localStorage.getItem(PAST_PICKS_KEY));
  assert.equal(getPastPick(pastPicks(readPastPicksRecord(), "r2"), first), x);
  // The same season written twice writes nothing new.
  const stored = globalThis.localStorage.getItem(PAST_PICKS_KEY);
  assert.deepEqual(storePastPicks({ runId: "r1", log: [pick(first, x)] }), readPastPicksRecord());
  assert.equal(globalThis.localStorage.getItem(PAST_PICKS_KEY), stored);
  storePastPicks({ runId: "r2", log: [pick(second, y)] });
  const past = pastPicks(readPastPicksRecord(), "r3");
  assert.equal(getPastPick(past, first), null, "the season before last is gone");
  assert.equal(getPastPick(past, second), y);
  assert.deepEqual(storePastPicks().picks, {});
  globalThis.localStorage.setItem(PAST_PICKS_KEY, "{");
  assert.deepEqual(readPastPicksRecord(), normalizePastPicksRecord(null), "an unreadable record is no record");
});

test("the scene's past pick, or nothing to tell it by", () => {
  const past = new Map([["a1", "a1x"]]);
  assert.equal(getPastPick(past, "a1"), "a1x");
  assert.equal(getPastPick(past, "a2"), null);
  assert.equal(getPastPick(new Map(), "a1"), null);
  assert.equal(getPastPick(new Set(["a1"]), "a1"), null);
  assert.equal(getPastPick(null, "a1"), null);
  assert.equal(getPastPick(past, null), null);
});

test("a closed finale writes its season's picks; pressing NEW GAME+ or half a season writes none", async () => {
  const { storeSeasonPicks } = await import("../../src/state/useNewGamePlus.js");
  const [scene] = nodeOrders.case02;
  const choiceId = nodes[scene].choices[1].id;
  globalThis.localStorage.removeItem(PAST_PICKS_KEY);
  assert.equal(storeSeasonPicks({ case01: {} }, { log: [pick(scene, choiceId)] }), null, "half a season writes nothing");
  assert.equal(storeSeasonPicks({ final: { runId: "r9" } }), null, "a finale handed no log writes nothing");
  assert.equal(storeSeasonPicks(null, { log: [] }), null);
  assert.equal(storeSeasonPicks(), null);
  assert.equal(globalThis.localStorage.getItem(PAST_PICKS_KEY), null);
  const record = storeSeasonPicks({ final: { runId: "r9" } }, { log: [pick(scene, choiceId)] });
  assert.equal(record.runId, "r9");
  assert.equal(getPastPick(pastPicks(record, "r10"), scene), choiceId);
  assert.equal(storeSeasonPicks({ final: {} }, { log: [] }).runId, null);
  // Written in unlock, next to the read scenes, from the finale's log.
  const source = readFileSync("src/state/useNewGamePlus.js", "utf8");
  assert.match(source, /const seen = storeSeasonScenes\(finishedSeason, finale\);\s*if \(seen\) setSeenRecord\(seen\);\s*const picks = storeSeasonPicks\(finishedSeason, finale\);\s*if \(picks\) setPicksRecord\(picks\);/);
});

test("the picks never reach the judgement: the log is left as it was, and only useNewGamePlus imports the module", () => {
  const [first] = nodeOrders.case01;
  const entry = Object.freeze({
    nodeId: first,
    choiceId: nodes[first].choices[0].id,
    cognition: Object.freeze({ evidence: 2 }),
    threshold: Object.freeze({ forced: false }),
  });
  const log = Object.freeze([entry]);
  const copy = structuredClone(log);
  recordPastPicks(null, { runId: "r1", log });
  storePastPicks({ runId: "r1", log });
  assert.deepEqual(log, copy, "the season's log is read, never written");

  // Who imports the module: the finale's writer alone. The commit, the seed,
  // the cognition, the summary and the ranking rows do not see it.
  const importers = [];
  const walk = (directory) => {
    for (const item of readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, item.name);
      // The case packs are prose and tables; nothing there imports a module.
      if (item.isDirectory()) { if (item.name !== "nodes") walk(file); }
      else if (/\.(js|jsx|mjs)$/.test(item.name) && /pastPicks(\.js)?["']/.test(readFileSync(file, "utf8"))) importers.push(file.replaceAll("\\", "/"));
    }
  };
  walk("src");
  // The finale's writer, and the online save's merge (E-12), which writes the
  // device key and never the run.
  assert.deepEqual(importers.sort(), ["src/state/cloudDeviceRecords.js", "src/state/useNewGamePlus.js"]);
  for (const file of ["src/state/useChoiceCommit.js", "src/state/savedState.js", "src/state/useLocalRanking.js"]) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /past-picks|pastPicks|storeSeasonPicks/, file);
  }
});

test("a reset keeps the picks", async () => {
  const { RESET_STORAGE_KEYS } = await import("../../src/state/runStorageReset.js");
  assert.ok(!RESET_STORAGE_KEYS.includes(PAST_PICKS_KEY));
  assert.match(readFileSync("src/state/runStorageReset.js", "utf8"), /the cards the last season picked\s*\* \(pastPicks\.js/);
});
