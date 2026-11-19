import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  applyGauntletEffect, BASE_SCHEMA, createWindow, getWindowBand, normalizeRunState, openCaseRun, reduceWindow, resolveWindow, RUN_INITIAL_STATE, suspendWindow,
} from "../../src/gauntlet/gauntletEngine.js";
import { readTableMeters } from "../../src/gauntlet/tableMeters.js";
import { SCOUT_NARROW_REACH, SCOUT_NARROW_TRUST, SCOUT_SECONDS, SCOUT_TRUST } from "../../src/gauntlet/tableRules.js";
import { ALL_RULES, rulesFor } from "../../src/gauntlet/tableUnlocks.js";
import { appendWindowEvent, compareReplay, createWindowRecord, replayWindow } from "../../src/gauntlet/windowReplay.js";
import { createStorage } from "./helpers/browser.mjs";
import { thresholdOf } from "./helpers/windowRecorder.mjs";

// tableVoice.js is a hook module; its sentences are held here without a browser (scout.test.mjs does the same).
globalThis.localStorage = createStorage();
const { describeScout } = await import("../../src/gauntlet/tableVoice.js");

/**
 * B1's next step (2026-11-18): a second press of SCOUT on the same window
 * narrows the band the first drew, 20 to `2 * SCOUT_NARROW_REACH`, for
 * SCOUT_NARROW_TRUST more 믿음 and the same clock. Information, not luck: the
 * narrowed band still holds the wall at a seeded place, inside the first band.
 */
const look = (win) => reduceWindow(win, { type: "SCOUT" }, ALL_RULES);
const seeds = Array.from({ length: 400 }, (_, index) => `narrow:${index}`);

test("the second look narrows the first band to one that still holds the wall, inside the first", () => {
  const middles = new Set();
  for (const seed of seeds) {
    const once = look(createWindow({ schema: BASE_SCHEMA, seed }));
    const twice = look(once);
    const first = getWindowBand(once);
    const band = getWindowBand(twice);
    assert.equal(twice.narrowed, true);
    assert.equal(band.narrowed, true);
    assert.ok(band.wallMin <= twice.wall && twice.wall <= band.wallMax, `${seed}: the wall is inside`);
    assert.ok(band.wallMin >= first.wallMin && band.wallMax <= first.wallMax, `${seed}: and inside the first band`);
    assert.ok(band.wallMax - band.wallMin <= SCOUT_NARROW_REACH * 2);
    middles.add(twice.wall - (band.wallMin + band.wallMax) / 2);
  }
  assert.ok(middles.size > 5, "the middle of the narrowed band is not the wall either");
});

test("the second look costs the same clock, comes after the first, and there is no third", () => {
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: "narrow:clock" });
  const once = look(fresh);
  assert.equal(once.narrowed, false, "the first press is the first look");
  const twice = look(once);
  assert.equal(twice.elapsed, SCOUT_SECONDS * 2);
  assert.equal(look(twice), twice, "a third press is nothing");
  const before = rulesFor("prologue02", { staged: true });
  assert.equal(reduceWindow(once, { type: "SCOUT" }, before), once, "without the rule, nothing");
  // Put down and picked up, the window keeps both looks; a save that says narrowed without the first look keeps neither.
  const resumed = createWindow({ schema: BASE_SCHEMA, seed: "narrow:clock", resume: suspendWindow(twice, 2).window });
  assert.deepEqual(getWindowBand(resumed), getWindowBand(twice));
  const forged = createWindow({ schema: BASE_SCHEMA, seed: "narrow:clock", resume: { ...suspendWindow(twice, 2).window, scouted: false } });
  assert.equal(forged.narrowed, false);
});

test("both looks are billed at the settle, and the verdict writes the second only when it was spent", () => {
  const card = { trust: 6, capital: 4 };
  const plain = applyGauntletEffect(card, { outcome: "cash", gauge: 70 });
  assert.equal(applyGauntletEffect(card, { outcome: "cash", gauge: 70, scouted: true, narrowed: true }).trust, plain.trust - SCOUT_TRUST - SCOUT_NARROW_TRUST);
  assert.equal(applyGauntletEffect(card, { outcome: "bust", gauge: 70, scouted: true, narrowed: true }).trust, -SCOUT_TRUST - SCOUT_NARROW_TRUST);
  assert.equal(applyGauntletEffect(card, { outcome: "cash", gauge: 70, narrowed: true }).trust, plain.trust, "no first look, nothing to narrow");
  const run = normalizeRunState({});
  const fresh = reduceWindow(createWindow({ schema: BASE_SCHEMA, seed: "narrow:verdict" }), { type: "SELECT", id: "sim" }, ALL_RULES);
  const cashed = (win) => resolveWindow({ run, window: reduceWindow(win, { type: "CASH" }, ALL_RULES), card: { id: "sim", effect: card } }).verdict;
  assert.equal("narrowed" in cashed(look(fresh)), false, "one look writes nothing new");
  assert.equal(cashed(look(look(fresh))).narrowed, true);
  // The settle, the log entry, the server's price check and the season bot all pass it on.
  const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
  assert.match(read("../../src/state/settleChoice.js"), /scouted: verdict\.scouted,\n {4}narrowed: verdict\.narrowed === true,/);
  assert.match(read("../../src/state/useChoiceCommit.js"), /\.\.\.\(verdict\.narrowed \? \{ narrowed: true \} : \{\}\),/);
  assert.match(read("../../src/settlementRecheck.js"), /scouted: threshold\.scouted === true,\n {4}narrowed: threshold\.narrowed === true,/);
  assert.match(read("../../scripts/sim/season-bot.mjs"), /scouted: verdict\.scouted,\n {10}narrowed: verdict\.narrowed === true,/);
});

test("the table sells the second look only with both looks' 믿음", () => {
  const win = look(createWindow({ schema: BASE_SCHEMA, seed: "narrow:pay" }));
  const meters = (trust) => readTableMeters({ win, schema: win.schema, selectedCard: null, resources: { trust } }).canPayNarrow;
  assert.equal(meters(SCOUT_TRUST + SCOUT_NARROW_TRUST), true);
  assert.equal(meters(SCOUT_TRUST + SCOUT_NARROW_TRUST - 1), false);
  const stage = readFileSync(new URL("../../src/gauntlet/GauntletStage.jsx", import.meta.url), "utf8");
  assert.match(stage, /const canScout = scoutOn && live && !paused && !locked && \(win\.scouted \? !win\.narrowed && canPayNarrow : canPayScout\);/);
});

test("a narrowed window replays, and a log that says nothing of the second look is held to none", () => {
  let win = createWindow({ schema: BASE_SCHEMA, seed: "narrow:replay" });
  let trail = [];
  for (const event of [{ type: "SELECT", id: "sim" }, { type: "SCOUT" }, { type: "PUSH" }, { type: "SCOUT" }, { type: "SCOUT" }, { type: "CASH" }]) {
    const next = reduceWindow(win, event, ALL_RULES);
    trail = appendWindowEvent(trail, win, event, next);
    win = next;
  }
  assert.equal(trail.filter(([, code]) => code === "L").length, 2, "the third press changed nothing and left no mark");
  const { window: replayed, problem } = replayWindow(createWindowRecord(win, trail), ALL_RULES);
  assert.equal(problem, null);
  assert.equal(replayed.narrowed, true);
  const threshold = { ...thresholdOf(win), narrowed: true };
  assert.deepEqual(compareReplay(threshold, replayed), []);
  const { narrowed: _dropped, ...silent } = threshold;
  assert.deepEqual(compareReplay(silent, replayed), ["narrow"]);
  // A log from before B1 (no `scouted` at all) is held to neither look.
  const { scouted: _scouted, ...older } = silent;
  assert.deepEqual(compareReplay(older, replayed), []);
});

test("the second look is named and said in three languages", async () => {
  const { default: ko } = await import("../../src/copy/table.js");
  const { default: en } = await import("../../src/locales/en/screens/table.js");
  const { default: ja } = await import("../../src/locales/ja/screens/table.js");
  for (const [lang, copy] of [["ko", ko], ["en", en], ["ja", ja]]) {
    assert.ok(copy.notices.narrow, `${lang} notices.narrow`);
    for (const key of ["{min}", "{max}", "{trust}", "{seconds}", "{width}"]) assert.ok(copy.notices.narrowLabel.includes(key), `${lang} narrowLabel has ${key}`);
    // label-in-name: the name starts with what the button shows, the band and the word.
    assert.ok(copy.notices.narrowLabel.includes(`{max} · ${copy.notices.narrow}`), `${lang}: the visible words lead the name`);
    assert.match(copy.voice.scoutNarrow, /\{trust\}[\s\S]*\{min\}[\s\S]*\{max\}/, `${lang} voice.scoutNarrow`);
  }
  assert.equal(describeScout({ wallMin: 72, wallMax: 82, narrowed: true }), `더 좁혔다(믿음 −${SCOUT_NARROW_TRUST}). 벽은 72에서 82 사이 어딘가`);
  assert.equal(describeScout({ wallMin: 70, wallMax: 90 }), `조회했다. 믿음 ${SCOUT_TRUST}을 썼다. 벽은 70에서 90 사이 어딘가`);
  const notices = readFileSync(new URL("../../src/gauntlet/TableNotices.jsx", import.meta.url), "utf8");
  assert.match(notices, /fill\(say\.narrowLabel, \{ min: band\.wallMin, max: band\.wallMax, trust: SCOUT_NARROW_TRUST, seconds: SCOUT_SECONDS, width: SCOUT_NARROW_REACH \* 2 \}\)/);
});

test("the narrowing bot looks first, then narrows when its next push reaches the first band, and only with the 믿음", async () => {
  const { createSeasonBot, narrowDue, SCOUT_TIMINGS } = await import("../../scripts/sim/season-bot.mjs");
  const { STAGED } = await import("../../src/gauntlet/tableUnlocks.js");
  assert.ok(SCOUT_TIMINGS.includes("narrow"));
  const once = look(createWindow({ schema: BASE_SCHEMA, seed: "narrow:bot" }));
  const band = getWindowBand(once);
  assert.equal(narrowDue("narrow", { ...once, gauge: band.wallMin - BASE_SCHEMA.stepMax - 1 }, 0), false);
  assert.equal(narrowDue("narrow", { ...once, gauge: band.wallMin - BASE_SCHEMA.stepMax }, 0), true);
  assert.equal(narrowDue("always", { ...once, gauge: band.wallMin }, 0), false, "only the narrowing hand");
  const hand = createSeasonBot({ seed: 20261118, staged: STAGED, archetypes: { hand: { values: { trust: 1 }, noise: 2, board: "listens", scout: "narrow" } } });
  const policy = hand.makePolicy("hand");
  const run = openCaseRun({ ...RUN_INITIAL_STATE }, { rules: ALL_RULES });
  let narrowed = 0;
  let poor = 0;
  for (let index = 0; index < 40; index += 1) {
    if (hand.playWindow(policy, run, `narrow:pay:${index}`, ALL_RULES, null, SCOUT_TRUST + SCOUT_NARROW_TRUST).narrowed) narrowed += 1;
    if (hand.playWindow(policy, run, `narrow:pay:${index}`, ALL_RULES, null, SCOUT_TRUST + SCOUT_NARROW_TRUST - 1).narrowed) poor += 1;
  }
  assert.ok(narrowed > 0, `the hand narrows some tables: ${narrowed}`);
  assert.equal(poor, 0, "not without both looks' 믿음");
});
