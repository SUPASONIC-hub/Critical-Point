import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { RESPONSIVE_ART } from "../src/responsiveArt.js";

/**
 * Art weight guardrail.
 *
 * Every scene was authored at about 1,700px and shipped at that width to every
 * screen, so a phone downloaded 146KB of key visual for a 356px slot. Each of
 * these files now also exists at 480px and 960px. These budgets keep the small
 * ones small: a variant that creeps back up to the original's weight defeats
 * the point without failing anything else.
 */

const BUDGETS = { 480: 26_000, 960: 72_000 };
const failures = [];

for (const src of RESPONSIVE_ART) {
  const base = `public${src}`.replace(/\.webp$/, "");
  for (const width of Object.keys(BUDGETS)) {
    const file = `${base}-${width}.webp`;
    let size;
    try {
      size = statSync(file).size;
    } catch {
      failures.push(`${file} is missing: src/responsiveArt.js promises it to the browser`);
      continue;
    }
    if (size > BUDGETS[width]) {
      failures.push(`${file} is ${Math.round(size / 1024)}KB, over the ${BUDGETS[width] / 1024}KB budget`);
    }
  }
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log(`Art budget checks passed (${RESPONSIVE_ART.size} images x ${Object.keys(BUDGETS).length} widths)`);
