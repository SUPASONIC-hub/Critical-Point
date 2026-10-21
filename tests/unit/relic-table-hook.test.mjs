import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser } from "./helpers/browser.mjs";

/**
 * The relic table as the runtime holds it (gauntlet/useRelicTable.js): the
 * codex read from this device's storage, `settle` bound to it, and
 * `keepUnlocks` writing the feats back. Its settling is settleChoice.js's
 * `settleAgainstCodex` (F1 phase 3, S2); this is what is left around it.
 */
const browser = installBrowser({ storage: { "critical-point-relic-codex-v1": JSON.stringify({ unlocked: ["not-a-relic"] }) } });
const { createElement } = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const { DEFAULT_RELIC_POOL } = await import("../../src/gauntlet/relics.js");
const { readRelicCodex, useRelicTable, settleAgainstCodex } = await import("../../src/gauntlet/useRelicTable.js");
const { settleAgainstCodex: pureSettle } = await import("../../src/state/settleChoice.js");

test("the hook reads the codex this device keeps, settles against it, and writes the feats it is handed", () => {
  assert.equal(settleAgainstCodex, pureSettle, "the hook's module hands on the pure settle");
  assert.deepEqual(readRelicCodex(), { unlocked: [] }, "an id that is no relic is dropped on reading");
  let api = null;
  const Probe = () => {
    api = useRelicTable();
    return null;
  };
  renderToStaticMarkup(createElement(Probe));
  assert.deepEqual(api.codex, { unlocked: [] });
  assert.equal(typeof api.settle, "function");
  assert.equal(typeof api.equip, "function");

  const relic = DEFAULT_RELIC_POOL[0];
  api.keepUnlocks([relic]);
  assert.deepEqual(JSON.parse(browser.storage.getItem("critical-point-relic-codex-v1")), { unlocked: [relic] });
  const written = browser.storage.getItem("critical-point-relic-codex-v1");
  api.keepUnlocks([relic]);
  assert.equal(browser.storage.getItem("critical-point-relic-codex-v1"), written, "feats already held write nothing");
});
