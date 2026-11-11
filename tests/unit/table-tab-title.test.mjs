import assert from "node:assert/strict";
import { test } from "node:test";

import { layOver } from "./locale-gaps.shared.mjs";
import { BASE_SCHEMA, createWindow, getWindowBand } from "../../src/gauntlet/gauntletEngine.js";
import { readTableTabTitle } from "../../src/gauntlet/tableTabTitle.js";
import { composeTabTitle } from "../../src/state/tabTitle.js";
import introCopy from "../../src/copy/intro.js";
import enIntro from "../../src/locales/en/screens/intro.js";

/**
 * The browser tab while a table runs (gauntlet/tableTabTitle.js; 개선 포인트
 * A3, user decision 11-05): the count to the wall band once a push can reach
 * it, 「[징계 회부]」 after a bust until the next table opens, and the page's
 * own title everywhere else. The Korean tests run first: the English one lays
 * its dictionary over the copy tables for good (a laid-over table takes no
 * second language, so Japanese is tests/unit/table-tab-title-ja.test.mjs).
 */

const schema = { ...BASE_SCHEMA };

function tableAt(gauge, extra = {}) {
  const win = { ...createWindow({ schema, seed: "tab" }), gauge, ...extra };
  return { win, band: getWindowBand(win), schema, tableOpen: true, live: win.status === "live" };
}

const title = (gauge, extra) => readTableTabTitle(tableAt(gauge, extra));

test("a cold table leaves the tab to the page; a push's reach counts to the band; the band is 0", () => {
  assert.equal(schema.wallMin, 56);
  assert.equal(schema.stepMax, 15);
  assert.equal(title(0), null, "cold: nothing to say");
  assert.equal(title(schema.wallMin - schema.stepMax - 1), null, "one short of the reach");
  assert.equal(title(schema.wallMin - schema.stepMax), "⚠ 벽까지 15 · {title}", "the first heat a push can reach the band from");
  assert.equal(title(53), "⚠ 벽까지 3 · {title}");
  // The creep moves the heat by halves; the count moves only when it crosses a whole number.
  assert.equal(title(53.5), title(53), "half a point of creep does not change the title");
  assert.equal(title(52.5), "⚠ 벽까지 4 · {title}");
  assert.equal(title(schema.wallMin), "⚠ 벽까지 0 · {title}", "in the band");
  assert.equal(title(80), "⚠ 벽까지 0 · {title}", "deep in the band, the wall unseen");
});

test("the table's state decides: not open says nothing, closed lets go, a bust is 징계 회부 and stays", () => {
  assert.equal(readTableTabTitle({ ...tableAt(53), tableOpen: false }), undefined, "an unopened table leaves the slot as it is");
  assert.equal(title(53, { status: "cashed" }), null, "a cash lets the tab go");
  assert.equal(title(70, { status: "bust", cause: "wall" }), "[징계 회부] {title}");
  assert.equal(title(70, { status: "bust", cause: "timeout" }), "[징계 회부] {title}");
  assert.equal(readTableTabTitle({ ...tableAt(70, { status: "bust", cause: "wall" }), tableOpen: false }), "[징계 회부] {title}", "kept through the reveal and the briefing");
  assert.equal(title(70, { status: "bust", cause: "abandon" }), null, "a table left to another tab is no referral");
  // The reset: the next table opens cold, and the tab is the page's again.
  assert.equal(title(schema.startGauge), null);
});

test("the slot's text takes the page's title, and no slot is the page's title", () => {
  assert.equal(composeTabTitle("⚠ 벽까지 3 · {title}", introCopy.pageTitle), `⚠ 벽까지 3 · ${introCopy.pageTitle}`);
  assert.equal(composeTabTitle("[징계 회부] {title}", introCopy.pageTitle), `[징계 회부] ${introCopy.pageTitle}`);
  assert.equal(composeTabTitle(undefined, introCopy.pageTitle), introCopy.pageTitle);
  assert.equal(composeTabTitle(null, enIntro.pageTitle), enIntro.pageTitle);
});

test("English: Wall in N and Disciplinary referral before the English title", async () => {
  await layOver("en");
  assert.equal(composeTabTitle(title(53), enIntro.pageTitle), `⚠ Wall in 3 · ${enIntro.pageTitle}`);
  assert.equal(composeTabTitle(title(70, { status: "bust", cause: "wall" }), enIntro.pageTitle), `[Disciplinary referral] ${enIntro.pageTitle}`);
  assert.equal(title(0), null);
});
