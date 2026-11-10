import assert from "node:assert/strict";
import { test } from "node:test";

import { layOver } from "./locale-gaps.shared.mjs";
import { BASE_SCHEMA, createWindow, getWindowBand } from "../../src/gauntlet/gauntletEngine.js";
import { readTableTabTitle } from "../../src/gauntlet/tableTabTitle.js";
import { composeTabTitle } from "../../src/state/tabTitle.js";
import jaIntro from "../../src/locales/ja/screens/intro.js";

/** The Japanese side of tests/unit/table-tab-title.test.mjs: the tab's two forms before the Japanese title. */
const schema = { ...BASE_SCHEMA };

function title(gauge, extra = {}) {
  const win = { ...createWindow({ schema, seed: "tab" }), gauge, ...extra };
  return readTableTabTitle({ win, band: getWindowBand(win), schema, tableOpen: true, live: win.status === "live" });
}

test("Japanese: 壁まで N and 懲戒回付 before the Japanese title", async () => {
  await layOver("ja");
  assert.equal(composeTabTitle(title(53), jaIntro.pageTitle), `⚠ 壁まで 3 · ${jaIntro.pageTitle}`);
  assert.equal(composeTabTitle(title(70, { status: "bust", cause: "wall" }), jaIntro.pageTitle), `[懲戒回付] ${jaIntro.pageTitle}`);
  assert.equal(title(0), null);
});
