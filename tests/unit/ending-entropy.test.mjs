import assert from "node:assert/strict";
import { test } from "node:test";

import { ENTROPY_MS, ENTROPY_VISUAL_CLASS, isStillPage, scatterGlyphs, shouldScatterEndingLine } from "../../src/endingEntropy.js";
import { getEndingVisualClass } from "../../src/runtimeSystems.js";

/**
 * 「언어의 엔트로피」 (개선 포인트 A2-1 (1), user decision 11-12): the collapse
 * ending's headline scatters for 0.8 s on its first record, and nowhere else;
 * reduced motion and the comfort setting keep it whole.
 */

const page = ({ reduce = false, calm = false } = {}) => ({
  matchMedia: (query) => ({ matches: reduce && query === "(prefers-reduced-motion: reduce)" }),
  document: { documentElement: { hasAttribute: (name) => calm && name === "data-calm-effects" } },
});

test("the gate: the collapse ending's first record only", () => {
  assert.equal(ENTROPY_MS, 800);
  assert.equal(ENTROPY_VISUAL_CLASS, getEndingVisualClass("collapse"));
  const collapse = { endingVisualClass: getEndingVisualClass("collapse"), endingStep: 0, endingTwistIndex: 0, still: false };
  assert.equal(shouldScatterEndingLine(collapse), true);
  assert.equal(shouldScatterEndingLine({ ...collapse, endingTwistIndex: 1 }), false, "the second record stands");
  assert.equal(shouldScatterEndingLine({ ...collapse, endingStep: 1 }), false, "the quiet beat stands");
  assert.equal(shouldScatterEndingLine({ ...collapse, endingVisualClass: getEndingVisualClass("open-oversight") }), false, "another ending stands");
  assert.equal(shouldScatterEndingLine({ ...collapse, still: true }), false, "a still page stands");
});

test("a still page: reduced motion or the comfort setting", () => {
  assert.equal(isStillPage(page()), false);
  assert.equal(isStillPage(page({ reduce: true })), true);
  assert.equal(isStillPage(page({ calm: true })), true);
  assert.equal(isStillPage({}), false, "no window: nothing to still");
});

test("the letters: the sentence whole, spaces kept, offsets small and repeatable", () => {
  const line = "권한은 있었지만, 사람이 치른 값을";
  const letters = scatterGlyphs(line);
  assert.equal(letters.map((letter) => letter.glyph).join(""), line);
  assert.deepEqual(letters, scatterGlyphs(line), "the same line scatters the same way");
  for (const letter of letters) {
    if (letter.glyph === " ") {
      assert.equal(letter.space, true);
      continue;
    }
    for (const offset of [letter.dx, letter.dy]) {
      assert.match(offset, /^-?\d+(\.\d+)?em$/);
      assert.ok(Math.abs(parseFloat(offset)) <= 0.25, `${offset} stays inside a quarter letter`);
    }
  }
  assert.ok(new Set(letters.filter((letter) => !letter.space).map((letter) => letter.dx)).size > 3, "the letters go different ways");
  assert.deepEqual(scatterGlyphs(undefined), []);
});
