import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { migrateSavedState, SAVE_SCHEMA_VERSION } from "../../src/appConfig.js";
import {
  applyGauntletEffect, BASE_SCHEMA, createWindow, getWindowBand, normalizeRunState, openCaseRun, reduceWindow, resolveWindow, RUN_INITIAL_STATE, suspendWindow,
} from "../../src/gauntlet/gauntletEngine.js";
import { readTableMeters } from "../../src/gauntlet/tableMeters.js";
import { SCOUT_REACH, SCOUT_SECONDS, SCOUT_TRUST } from "../../src/gauntlet/tableRules.js";
import { ALL_RULES, rulesFor } from "../../src/gauntlet/tableUnlocks.js";
import { appendWindowEvent, compareReplay, createWindowRecord, replayWindow } from "../../src/gauntlet/windowReplay.js";
import { createStorage } from "./helpers/browser.mjs";
import { thresholdOf } from "./helpers/windowRecorder.mjs";

// tableVoice.js is a hook module; its sentences are held here without a browser (table-voice.test.mjs does the same).
globalThis.localStorage = createStorage();
const { describeScout } = await import("../../src/gauntlet/tableVoice.js");

/**
 * SCOUT (B1, 11일차): one look a window, paid in table clock, that narrows the
 * drawn band to `2 * SCOUT_REACH` around the wall -- never onto it.
 */
const seeds = Array.from({ length: 400 }, (_, index) => `scout:${index}`);

test("a look narrows the band to one that holds the wall, inside the board's band", () => {
  const middles = new Set();
  for (const seed of seeds) {
    const win = reduceWindow(createWindow({ schema: BASE_SCHEMA, seed }), { type: "SCOUT" }, ALL_RULES);
    const band = getWindowBand(win);
    assert.equal(band.scouted, true);
    assert.ok(band.wallMin <= win.wall && win.wall <= band.wallMax, `${seed}: the wall is inside`);
    assert.ok(band.wallMin >= win.schema.wallMin && band.wallMax <= win.schema.wallMax, `${seed}: and the band inside the board's`);
    assert.ok(band.wallMax - band.wallMin <= SCOUT_REACH * 2);
    middles.add(win.wall - (band.wallMin + band.wallMax) / 2);
  }
  assert.ok(middles.size > 5, "the middle of the band is not the wall");
});

test("a look costs SCOUT_SECONDS of clock, once a window, and only where the case has it", () => {
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: "scout:clock" });
  assert.deepEqual(getWindowBand(fresh), { wallMin: fresh.schema.wallMin, wallMax: fresh.schema.wallMax, scouted: false });
  const looked = reduceWindow(fresh, { type: "SCOUT" }, ALL_RULES);
  assert.equal(looked.elapsed, SCOUT_SECONDS);
  assert.equal(reduceWindow(looked, { type: "SCOUT" }, ALL_RULES), looked, "a second look is nothing");
  const before = rulesFor("prologue02", { staged: true });
  assert.equal(before.has("scout"), false);
  assert.equal(reduceWindow(fresh, { type: "SCOUT" }, before), fresh, "before the rule, the window is as it was");
  assert.equal(rulesFor("prologue03", { staged: true }).has("scout"), true);
});

test("a window put down after a look comes back with it, and the band is dealt again from the seed", () => {
  const looked = reduceWindow(createWindow({ schema: BASE_SCHEMA, seed: "scout:resume" }), { type: "SCOUT" }, ALL_RULES);
  const suspended = suspendWindow(looked, 4);
  assert.equal(suspended.window.scouted, true);
  const resumed = createWindow({ schema: BASE_SCHEMA, seed: suspended.seed, resume: suspended.window });
  assert.deepEqual(getWindowBand(resumed), getWindowBand(looked));
});

test("a v2 save reaches v3 with its put-down window marked as not looked at", () => {
  const v2 = { saveSchemaVersion: 2, dynamics: { suspended: { seed: "s", windowIndex: 1, window: { gauge: 10 } } } };
  const v3 = migrateSavedState(v2, 3);
  assert.equal(v3.saveSchemaVersion, 3);
  assert.equal(v3.dynamics.suspended.window.scouted, false);
  assert.equal(migrateSavedState(v2).dynamics.suspended.window.scouted, false, "and keeps the mark on its way to this build's version");
  assert.equal(migrateSavedState({ saveSchemaVersion: 1 }, 3).saveSchemaVersion, 3, "a v1 save steps through v2");
  assert.equal(migrateSavedState({ saveSchemaVersion: SAVE_SCHEMA_VERSION + 1 }), null, "a save from a newer build is not read");
});

test("the stage reads the band it draws off the meters, and SCOUT's button is ScoutBand's", async () => {
  // Both moved out of GauntletStage on 2026-10-19, to keep it inside 830 lines and 68 names.
  const fresh = createWindow({ schema: BASE_SCHEMA, seed: "scout:meters" });
  const looked = reduceWindow(fresh, { type: "SCOUT" }, ALL_RULES);
  for (const win of [fresh, looked]) {
    assert.deepEqual(readTableMeters({ win, schema: win.schema, selectedCard: null }).band, getWindowBand(win));
  }
  const stage = readFileSync(new URL("../../src/gauntlet/GauntletStage.jsx", import.meta.url), "utf8");
  assert.ok(!stage.includes("getWindowBand") && !stage.includes("gx-band-label"), "the stage draws no band of its own");
  assert.match(stage, /<ScoutBand band=\{band\} canScout=\{canScout\} onScout=\{scout\} shortcut=\{canScout \? keys\("R"\) : undefined\} \/>/);
  const notices = readFileSync(new URL("../../src/gauntlet/TableNotices.jsx", import.meta.url), "utf8");
  const scoutBand = notices.slice(notices.indexOf("export function ScoutBand("), notices.indexOf("export function TableGlossary("));
  // Before the case has SCOUT, the plain label; after, the button, which stays put once spent.
  assert.match(scoutBand, /if \(!canScout && !band\.scouted\) return <span className="gx-band-label" aria-hidden="true">/);
  assert.match(scoutBand, /data-testid="commit-scout" onClick=\{onScout\} aria-disabled=\{!canScout\}/);
  // The name's words are the copy table's (src/copy/table.js), filled with the band and SCOUT's price (B1: 믿음 and the clock).
  assert.match(scoutBand, /aria-keyshortcuts=\{shortcut\} aria-label=\{band\.scouted \? undefined : fill\(say\.scoutLabel, \{ min: band\.wallMin, max: band\.wallMax, trust: SCOUT_TRUST, seconds: SCOUT_SECONDS \}\)\}/);
  const { default: tableCopy } = await import("../../src/copy/table.js");
  assert.equal(tableCopy.notices.scoutLabel, "벽 {min}–{max} · 조회, 믿음 {trust}과 시간 {seconds}초");
  // The stage opens SCOUT on the meters' `canPayScout`, read off the run's resources, and adds no import for it.
  assert.match(stage, /\} = readTableMeters\(\{ win, schema, selectedCard, run, audit: auditCount, resources \}\);/);
  assert.match(stage, /const canScout = scoutOn && live && !paused && !locked && !win\.scouted && canPayScout;/);
  assert.ok(!stage.includes("SCOUT_TRUST"), "the price is the meters' to read, not the stage's");
});

/**
 * B1 (사용자 결정 2026-11-05 (1)): the look costs SCOUT_TRUST of 믿음 as well as
 * the clock, billed when the window settles. The look itself, the band and the
 * once-a-window rule are as above.
 */
const CARD = { trust: 6, capital: 4, legitimacy: -3 };

test("a scouted window bills 믿음 SCOUT_TRUST at the settle: unmultiplied, unfractured, and on a bust too", () => {
  const plain = applyGauntletEffect(CARD, { outcome: "cash", gauge: 70 });
  const looked = applyGauntletEffect(CARD, { outcome: "cash", gauge: 70, scouted: true });
  assert.ok(plain.trust > CARD.trust, "the card's gain rides the heat");
  assert.deepEqual(looked, { ...plain, trust: plain.trust - SCOUT_TRUST }, "the look comes off after the multiplier, once");
  // A bust strips the gain and keeps the look's price, like any cost.
  assert.equal(applyGauntletEffect(CARD, { outcome: "bust", gauge: 70 }).trust, 0);
  assert.equal(applyGauntletEffect(CARD, { outcome: "bust", gauge: 70, scouted: true }).trust, -SCOUT_TRUST);
  // A card with no 믿음 line still pays it; FRACTURE on the 믿음 axis bills the card's cost, never the look's.
  assert.equal(applyGauntletEffect({ capital: 5 }, { outcome: "cash", gauge: 20, scouted: true }).trust, -SCOUT_TRUST);
  const fractured = applyGauntletEffect({ trust: -4 }, { outcome: "cash", gauge: 20, fracturedAxis: "trust", fractureRate: 1.5, scouted: true });
  assert.equal(fractured.trust, -6 - SCOUT_TRUST);
  assert.equal(applyGauntletEffect(CARD, { outcome: "cash", gauge: 70, scouted: false }).trust, plain.trust, "no look, no price");
});

test("the verdict says whether the look was spent, and the settle prices it from the verdict", () => {
  const run = normalizeRunState({});
  const card = { id: "sim", effect: CARD };
  const fresh = reduceWindow(createWindow({ schema: BASE_SCHEMA, seed: "scout:verdict" }), { type: "SELECT", id: "sim" }, ALL_RULES);
  const looked = reduceWindow(fresh, { type: "SCOUT" }, ALL_RULES);
  const cashed = (win) => resolveWindow({ run, window: reduceWindow(win, { type: "CASH" }, ALL_RULES), card }).verdict;
  assert.equal(cashed(fresh).scouted, false);
  assert.equal(cashed(looked).scouted, true);
  // Without the rule a look is never spent, so nothing is billed.
  const before = rulesFor("prologue02", { staged: true });
  assert.equal(resolveWindow({ run, window: reduceWindow(reduceWindow(fresh, { type: "SCOUT" }, before), { type: "CASH" }, before), card, rules: before }).verdict.scouted, false);
  // settleChoice.js and the season bot hand the verdict's mark to applyGauntletEffect; the log entry carries it.
  const settle = readFileSync(new URL("../../src/state/settleChoice.js", import.meta.url), "utf8");
  assert.match(settle, /focusMultiplier: verdict\.focus\?\.resourceMultiplier,\n {4}scouted: verdict\.scouted,\n {2}\}\);/);
  const bot = readFileSync(new URL("../../scripts/sim/season-bot.mjs", import.meta.url), "utf8");
  assert.match(bot, /focusMultiplier: verdict\.focus\?\.resourceMultiplier,\n {10}scouted: verdict\.scouted,\n {8}\}\);/);
  const commit = readFileSync(new URL("../../src/state/useChoiceCommit.js", import.meta.url), "utf8");
  assert.match(commit, /pushes: verdict\.pushes,\n(?:\s*\/\/.*\n)*\s*scouted: verdict\.scouted,/);
});

test("the table sells a look only to a hand that can pay for it", () => {
  const win = createWindow({ schema: BASE_SCHEMA, seed: "scout:pay" });
  const meters = (resources) => readTableMeters({ win, schema: win.schema, selectedCard: null, resources }).canPayScout;
  assert.equal(meters({ trust: SCOUT_TRUST }), true);
  assert.equal(meters({ trust: 50 }), true);
  assert.equal(meters({ trust: SCOUT_TRUST - 1 }), false);
  assert.equal(meters(null), false, "no resources handed over, no look");
  assert.equal(meters({}), false);
  // The reducer stays pure: it knows the rule and the once-a-window mark, never the purse. The stage and the bots keep the gate.
  assert.equal(reduceWindow(win, { type: "SCOUT" }, ALL_RULES).scouted, true);
});

test("a window replays with its look, and an older log that says nothing of the look is not held to it", () => {
  const rules = ALL_RULES;
  const schema = BASE_SCHEMA;
  let win = createWindow({ schema, seed: "scout:replay" });
  let trail = [];
  const press = (event) => {
    const next = reduceWindow(win, event, rules);
    trail = appendWindowEvent(trail, win, event, next);
    win = next;
  };
  press({ type: "SELECT", id: "sim" });
  press({ type: "TICK", delta: 1 });
  press({ type: "SCOUT" });
  press({ type: "PUSH" });
  press({ type: "CASH" });
  const windowRecord = createWindowRecord(win, trail);
  assert.ok(windowRecord.events.some(([, code]) => code === "L"), "the look is on the trail");
  const { window: replayed, problem } = replayWindow(windowRecord, rules);
  assert.equal(problem, null);
  assert.equal(replayed.scouted, true);
  assert.deepEqual(compareReplay(thresholdOf(win), replayed), []);
  // A log that says the look was not spent, against a trail that spent it, differs on the look; one that says nothing does not.
  assert.deepEqual(compareReplay({ ...thresholdOf(win), scouted: false }, replayed), ["scout"]);
  const { scouted: _dropped, ...older } = thresholdOf(win);
  assert.deepEqual(compareReplay(older, replayed), []);
  // A run that never looked is the run it was: the same presses without the look replay to the same window, scouted false.
  let bare = createWindow({ schema, seed: "scout:replay" });
  let bareTrail = [];
  for (const event of [{ type: "SELECT", id: "sim" }, { type: "TICK", delta: 1 }, { type: "PUSH" }, { type: "CASH" }]) {
    const next = reduceWindow(bare, event, rules);
    bareTrail = appendWindowEvent(bareTrail, bare, event, next);
    bare = next;
  }
  const bareReplay = replayWindow(createWindowRecord(bare, bareTrail), rules).window;
  assert.equal(bareReplay.scouted, false);
  assert.deepEqual(compareReplay(thresholdOf(bare), bareReplay), []);
});

test("the look's price is said in three languages, by the button's name and the table's voice", async () => {
  const { default: ko } = await import("../../src/copy/table.js");
  const { default: en } = await import("../../src/locales/en/screens/table.js");
  const { default: ja } = await import("../../src/locales/ja/screens/table.js");
  for (const [lang, copy] of [["ko", ko], ["en", en], ["ja", ja]]) {
    for (const key of ["scoutLabel"]) assert.match(copy.notices[key], /\{trust\}/, `${lang} notices.${key} names the 믿음`);
    assert.match(copy.notices.scoutLabel, /\{seconds\}/, `${lang} keeps the clock`);
    assert.match(copy.voice.scout, /\{trust\}/, `${lang} voice.scout says the 믿음`);
    assert.match(copy.voice.scout, /\{min\}[\s\S]*\{max\}/, `${lang} voice.scout still says the band`);
  }
  assert.equal(describeScout({ wallMin: 70, wallMax: 90 }), `조회했다. 믿음 ${SCOUT_TRUST}을 썼다. 벽은 70에서 90 사이 어딘가`);
  // The prologue that opens SCOUT tells the price in every language (tableUnlocks.js writes the numbers out).
  const { default: unlocksKo } = await import("../../src/copy/unlocks.js");
  const { default: unlocksEn } = await import("../../src/locales/en/screens/unlocks.js");
  const { default: unlocksJa } = await import("../../src/locales/ja/screens/unlocks.js");
  assert.match(unlocksKo.steps.prologue03.intro[2], new RegExp(`믿음 ${SCOUT_TRUST}과 시간 ${SCOUT_SECONDS}초`));
  assert.match(unlocksEn.steps.prologue03.intro[2], new RegExp(`${SCOUT_TRUST} Trust and ${SCOUT_SECONDS} seconds`));
  assert.match(unlocksJa.steps.prologue03.intro[2], new RegExp(`信頼${SCOUT_TRUST}と時間${SCOUT_SECONDS}秒`));
});

test("the bots look when their timing says, pay 믿음 for it, and a hand with none does not look", async () => {
  const { createSeasonBot, scoutDue, SCOUT_TIMINGS } = await import("../../scripts/sim/season-bot.mjs");
  const { STAGED } = await import("../../src/gauntlet/tableUnlocks.js");
  assert.deepEqual([...SCOUT_TIMINGS], ["never", "always", "late", "danger"]);
  const at = (pushes, gauge) => ({ pushes, gauge, schema: BASE_SCHEMA });
  assert.equal(scoutDue("always", at(0, 0)), true);
  assert.equal(scoutDue("late", at(1, 30)), false);
  assert.equal(scoutDue("late", at(2, 30)), true);
  assert.equal(scoutDue("danger", at(0, BASE_SCHEMA.wallMin - BASE_SCHEMA.stepMax - 1)), false);
  assert.equal(scoutDue("danger", at(0, BASE_SCHEMA.wallMin - BASE_SCHEMA.stepMax)), true);
  assert.equal(scoutDue("never", at(5, 80)), false);
  // The season player: the same slot, same seed, one look per timing. "always" looks on every table that sells one.
  const bot = (scout) => createSeasonBot({ seed: 20261105, staged: STAGED, archetypes: { hand: { values: { trust: 1 }, noise: 2, board: "listens", scout } } });
  const looksOf = (scout) => {
    let looks = 0;
    const season = bot(scout).playSeason("scout:bot", "hand", false, ({ verdict }) => {
      if (verdict.scouted) looks += 1;
    });
    return { looks, season };
  };
  const never = looksOf("never");
  const always = looksOf("always");
  const late = looksOf("late");
  assert.equal(never.looks, 0);
  assert.ok(always.looks > 0 && late.looks > 0 && late.looks < always.looks, `a late look is taken less often: ${late.looks} < ${always.looks}`);
  assert.ok(always.looks <= always.season.windows, "at most one look a window");
  // The purse's gate: the same hand on the same table looks with the 믿음 to pay and not without.
  const hand = bot("always");
  const policy = hand.makePolicy("hand");
  const run = openCaseRun({ ...RUN_INITIAL_STATE }, { rules: ALL_RULES });
  assert.equal(hand.playWindow(policy, run, "scout:pay:0", ALL_RULES, null, SCOUT_TRUST - 1).scouted, false, "no 믿음, no look");
  assert.equal(hand.playWindow(policy, run, "scout:pay:0", ALL_RULES, null, SCOUT_TRUST).scouted, true, "the last 믿음 buys the look");
});

