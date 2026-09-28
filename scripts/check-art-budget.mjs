import assert from "node:assert/strict";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { RESPONSIVE_ART } from "../src/responsiveArt.js";
import { ART_LOCK, hashFile, readWebpSize } from "./art-lock.mjs";

/**
 * Art weight guardrail.
 *
 * Every scene was authored at about 1,700px and shipped at that width to every
 * screen, so a phone downloaded 146KB of key visual for a 356px slot. Each of
 * these files now also exists at 480px and 960px. These budgets keep the small
 * ones small: a variant that creeps back up to the original's weight defeats
 * the point without failing anything else.
 *
 * It also holds each variant to its original. Presence and weight were all this
 * used to look at, so an original could be repainted and keep the variants cut
 * from the old painting. `art-variants.lock.json` names the original each set
 * was cut from, by hash, and the variants by theirs; a variant also has to be
 * the width its name says and the shape its original is.
 *
 * `--write-lock` records the files as they stand, without encoding anything.
 * It is for adopting the lock over variants already known to be current, and
 * nothing else: after a repaint the command is `npm run build:art`.
 */

const BUDGETS = { 480: 26_000, 960: 72_000 };
const failures = [];

if (process.argv.includes("--write-lock")) {
  const lock = Object.fromEntries(
    [...RESPONSIVE_ART].map((src) => [
      src,
      {
        original: hashFile(`public${src}`),
        variants: Object.fromEntries(Object.keys(BUDGETS).map((width) => [width, hashFile(`public${src.replace(/\.webp$/, "")}-${width}.webp`)])),
      },
    ]),
  );
  writeFileSync(ART_LOCK, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
  console.log(`Wrote ${ART_LOCK} for ${RESPONSIVE_ART.size} images as they stand.`);
  process.exit(0);
}

let lock = null;
try {
  lock = JSON.parse(readFileSync(ART_LOCK, "utf8"));
} catch {
  failures.push(`${ART_LOCK} is missing or unreadable. Run \`npm run build:art\` and commit it with the variants.`);
}

for (const src of RESPONSIVE_ART) {
  const original = `public${src}`;
  const base = original.replace(/\.webp$/, "");
  const recorded = lock?.[src];
  const originalSize = readWebpSize(original);
  if (!originalSize) failures.push(`${original} is not a webp this check can read`);
  if (lock && !recorded) {
    failures.push(`${original} has no entry in ${ART_LOCK}. Run \`npm run build:art\`.`);
  } else if (recorded && recorded.original !== hashFile(original)) {
    failures.push(`${original} is not the file its variants were cut from. Run \`npm run build:art\` and commit the variants.`);
  }
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
    if (recorded && recorded.variants?.[width] !== hashFile(file)) {
      failures.push(`${file} is not the variant ${ART_LOCK} records. Run \`npm run build:art\`.`);
    }
    const variantSize = readWebpSize(file);
    if (!variantSize) {
      failures.push(`${file} is not a webp this check can read`);
    } else {
      if (variantSize.width !== Number(width)) failures.push(`${file} is ${variantSize.width}px wide; its name says ${width}`);
      if (originalSize) {
        const expectedHeight = Math.round((originalSize.height / originalSize.width) * Number(width));
        if (Math.abs(variantSize.height - expectedHeight) > 1) {
          failures.push(`${file} is ${variantSize.width}x${variantSize.height}; ${original} at that width is ${width}x${expectedHeight}`);
        }
      }
    }
  }
}
for (const src of Object.keys(lock ?? {})) {
  if (!RESPONSIVE_ART.has(src)) failures.push(`${ART_LOCK} names ${src}, which src/responsiveArt.js no longer lists.`);
}

assert.deepEqual(failures, [], failures.join("\n"));
console.log(`Art budget checks passed (${RESPONSIVE_ART.size} images x ${Object.keys(BUDGETS).length} widths, each cut from its current original)`);
