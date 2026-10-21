import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { migrateSavedState, SAVE_SCHEMA_VERSION } from "../../src/appConfig.js";
import { BASE_SCHEMA, createWindow, getWindowBand, reduceWindow, suspendWindow } from "../../src/gauntlet/gauntletEngine.js";
import { readTableMeters } from "../../src/gauntlet/tableMeters.js";
import { SCOUT_REACH, SCOUT_SECONDS } from "../../src/gauntlet/tableRules.js";
import { ALL_RULES, rulesFor } from "../../src/gauntlet/tableUnlocks.js";

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

test("the stage reads the band it draws off the meters, and SCOUT's button is ScoutBand's", () => {
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
  assert.match(scoutBand, /aria-keyshortcuts=\{shortcut\} aria-label=\{band\.scouted \? undefined : `벽 \$\{band\.wallMin\}–\$\{band\.wallMax\} · 조회, 시간 \$\{SCOUT_SECONDS\}초`\}/);
});
