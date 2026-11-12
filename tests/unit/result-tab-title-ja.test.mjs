import assert from "node:assert/strict";
import { test } from "node:test";

import { layOver } from "./locale-gaps.shared.mjs";
import { readResultTabTitle } from "../../src/state/resultTabTitle.js";
import { composeTabTitle } from "../../src/state/tabTitle.js";
import jaIntro from "../../src/locales/ja/screens/intro.js";

/** The Japanese side of tests/unit/result-tab-title.test.mjs: the ending's Japanese name before the Japanese title. */
test("Japanese: the ending's name and 崩壊", async () => {
  await layOver("ja");
  const season = (id) => readResultTabTitle({ currentCase: "final", endingVariant: { id, label: id } });
  assert.equal(composeTabTitle(season("field-pact"), jaIntro.pageTitle), `[現場と協約] シーズン判定 · ${jaIntro.pageTitle}`);
  assert.equal(season("collapse"), "[崩壊] シーズン判定 · {title}");
});
