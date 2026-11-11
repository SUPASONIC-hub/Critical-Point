import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();
const { COLD_OPENING_SEEN_KEY, SEASON_RECORD_KEY } = await import("../../src/appConfig.js");
const {
  COLD_OPENING_ENABLED,
  coldOpeningForced,
  coldOpeningSeen,
  markColdOpeningSeen,
  panelReadingSeconds,
  playsColdOpening,
  shouldPlayColdOpening,
} = await import("../../src/state/coldOpening.js");
const { COLD_OPENING_COPY, coldOpeningCopy } = await import("../../src/components/coldOpeningCopy.js");
const { nodes } = await import("../../src/gameData.js");
const { getReadingSeconds } = await import("../../src/gauntlet/gauntletEngine.js");

/**
 * B-3(1) 냉정한 오프닝, behind one switch (src/coldOpeningSwitch.js): on since
 * 2026-11-10 (#477) so it can be judged live, and turned off again by that one
 * constant alone.
 */

test("the page ships on, and the start button reads the switch before anything else", () => {
  assert.equal(COLD_OPENING_ENABLED, true);
  // The switch is the file's one export and has no imports, so the bundler can
  // read it (vite.config.js) and turning it off is one word.
  const switchFile = readFileSync(new URL("../../src/coldOpeningSwitch.js", import.meta.url), "utf8");
  assert.match(switchFile, /^export const COLD_OPENING_ENABLED = (true|false);$/m);
  assert.doesNotMatch(switchFile, /^import /m);
  const intro = readFileSync(new URL("../../src/screens/IntroScreen.jsx", import.meta.url), "utf8");
  // The switch as the bundler writes it, then the build constant: a release
  // build folds the branch (and the page's dynamic import) away while it is off.
  assert.match(intro, /\(__CP_COLD_OPENING__ \|\| \(__CP_DEBUG_BUILD__ && coldOpeningForced\(\)\)\) && playsColdOpening\(/);
  const vite = readFileSync(new URL("../../vite.config.js", import.meta.url), "utf8");
  assert.match(vite, /__CP_COLD_OPENING__: JSON\.stringify\(COLD_OPENING_ENABLED\)/);
  assert.equal((intro.match(/import\("\.\.\/components\/ColdOpening\.jsx"\)/g) ?? []).length, 1);
});

test("switched off, no device plays the page", () => {
  // What IntroScreen asks when the build constant is false (and no dev
  // override): `enabled` false answers no for every device.
  for (const hasResumableSave of [false, true]) for (const firstSeason of [false, true]) for (const seen of [false, true]) {
    assert.equal(shouldPlayColdOpening({ enabled: false, hasResumableSave, firstSeason, seen }), false);
  }
  localStorage.clear();
  assert.equal(playsColdOpening({ enabled: false, hasResumableSave: false }), false);
  assert.equal(playsColdOpening({ enabled: true, hasResumableSave: false }), true);
});

test("only a first season with no run to lose, not seen before, plays the page", () => {
  const base = { enabled: true, hasResumableSave: false, firstSeason: true, seen: false };
  assert.equal(shouldPlayColdOpening(base), true);
  assert.equal(shouldPlayColdOpening({ ...base, enabled: false }), false);
  assert.equal(shouldPlayColdOpening({ ...base, hasResumableSave: true }), false);
  assert.equal(shouldPlayColdOpening({ ...base, firstSeason: false }), false);
  assert.equal(shouldPlayColdOpening({ ...base, seen: true }), false);
});

test("the dev override is ?coldOpening=1 and nothing else", () => {
  assert.equal(coldOpeningForced("?debug=1&coldOpening=1"), true);
  assert.equal(coldOpeningForced("?coldOpening=true"), false);
  assert.equal(coldOpeningForced(""), false);
});

test("the page is shown once on a device, and a finished season skips it", () => {
  localStorage.clear();
  assert.equal(coldOpeningSeen(), false);
  assert.equal(playsColdOpening({ enabled: true, hasResumableSave: false }), true);
  localStorage.setItem(SEASON_RECORD_KEY, JSON.stringify({ seasons: 1 }));
  assert.equal(playsColdOpening({ enabled: true, hasResumableSave: false }), false);
  localStorage.removeItem(SEASON_RECORD_KEY);
  assert.equal(markColdOpeningSeen(), true);
  assert.equal(localStorage.getItem(COLD_OPENING_SEEN_KEY), "1");
  assert.equal(playsColdOpening({ enabled: true, hasResumableSave: false }), false);
  localStorage.clear();
});

test("every language tells the same four panels, with case 01's numbers unchanged", () => {
  const ko = COLD_OPENING_COPY.ko;
  for (const [lang, words] of Object.entries(COLD_OPENING_COPY)) {
    assert.equal(words.panels.length, ko.panels.length, lang);
    for (const key of ["label", "title", "next", "skip", "step"]) assert.ok(words[key], `${lang} ${key}`);
    const all = words.panels.map((panel) => panel.caption + panel.text).join(" ");
    for (const figure of ["72", "1,140", "2023-0412", "2022"]) assert.ok(all.includes(figure), `${lang} keeps ${figure}`);
  }
  assert.equal(ko.panels.at(-1).caption, "3년 전");
  assert.equal(coldOpeningCopy("xx"), ko);
  // The facts are case 01's: its first scene and memo.
  const start = [nodes.start.text, ...nodes.start.memo].join(" ");
  for (const fact of ["1,140명", "2023-0412", "72시간", "반대 1건", "검색되지 않"]) assert.ok(start.includes(fact), fact);
});

/**
 * The budget B-3(1) set: the first screen to the first live table in 60~90
 * seconds. The prologue's first page holds its reader for its reading clock
 * (54 seconds on 2026-11-06: the scene and the rules it introduces, more than
 * the scene alone, which is the floor checked here) and the burst for 860ms,
 * so the panels get what is left: 35 seconds on the table's own scale. The
 * whole walk is timed in a browser by tests/cold-opening.spec.js ("timed").
 */
test("the panels fit in what the 90 seconds leave after the first page", () => {
  const panels = COLD_OPENING_COPY.ko.panels.reduce((sum, panel) => sum + panelReadingSeconds(panel), 0);
  assert.ok(panels >= 20 && panels <= 35, `panels ${panels}s`);
  const floor = panels + 0.86 + getReadingSeconds(nodes.p1_start);
  assert.ok(floor >= 60 && floor <= 90, `at least ${floor}s`);
});
