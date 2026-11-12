import assert from "node:assert/strict";
import { test } from "node:test";

import { layOver } from "./locale-gaps.shared.mjs";
import { readResultTabTitle } from "../../src/state/resultTabTitle.js";
import { composeTabTitle } from "../../src/state/tabTitle.js";
import introCopy from "../../src/copy/intro.js";
import enIntro from "../../src/locales/en/screens/intro.js";

/**
 * The browser tab on a result (state/resultTabTitle.js; 개선 포인트 A3-1 (1),
 * user decision 11-12): the season's ending screen names its ending in the
 * page's language, a collapse 「[붕괴]」, a case its tag. Korean first; the
 * English test lays its dictionary over the tables for good, so Japanese is
 * tests/unit/result-tab-title-ja.test.mjs.
 */

const season = (id, label = id.toUpperCase()) => readResultTabTitle({ currentCase: "final", endingVariant: { id, label } });

test("Korean: the season's ending by its name, a collapse, a case", () => {
  assert.equal(composeTabTitle(season("open-oversight"), introCopy.pageTitle), `[공개와 개입] 시즌 판정 · ${introCopy.pageTitle}`);
  assert.equal(season("quiet-cover"), "[보호와 은폐] 시즌 판정 · {title}");
  assert.equal(season("collapse"), "[붕괴] 시즌 판정 · {title}");
  assert.equal(season("unheard-of", "UNHEARD OF"), "[UNHEARD OF] 시즌 판정 · {title}", "no name: the label");
  assert.equal(readResultTabTitle({ currentCase: "final" }), "[질문과 계승] 시즌 판정 · {title}", "no ending yet");
  assert.equal(readResultTabTitle({ currentCase: "case1", endingVariant: { id: "collapse" }, caseTag: "봉인" }), "[사건 종료] 봉인 · {title}", "a case's result is not the ending screen");
});

test("English: the ending's English name", async () => {
  await layOver("en");
  assert.equal(composeTabTitle(season("open-oversight"), enIntro.pageTitle), `[Disclosure and Intervention] Season verdict · ${enIntro.pageTitle}`);
  assert.equal(season("collapse"), "[Collapse] Season verdict · {title}");
});
