import assert from "node:assert/strict";
import { test } from "node:test";

import { installBrowser } from "./helpers/browser.mjs";
import { CHARSET_OUTPUT, FIRST_CHARSET_OUTPUT, readCharsetList } from "../../scripts/font-charset.mjs";

/**
 * The start screen draws only from the first font file.
 *
 * The font is cut in two (scripts/font-charset.mjs): the first file holds what
 * the start screen prints, read from the source files in FIRST_PAINT_SOURCES,
 * and every other syllable waits in a second file the browser fetches the
 * moment one of them is on the screen. A source missing from that list costs
 * nothing visible -- the syllable is drawn once the second file arrives -- so
 * nothing failed when the case cards, the play styles and the operator origins
 * were missing from it, and the Korean start screen fetched the second file on
 * every first visit (Linux, 2026-11-04: 217 syllables, +15KB over one file).
 *
 * So the intro's own field bag is held to the list: every string the bag
 * carries, for each play style and each operator origin, has to be in the
 * first file. A new field fed from a new module fails here until that module
 * joins FIRST_PAINT_SOURCES and `npm run build:fonts` is run.
 *
 * Only what the full list carries is asked of the first: a character the font
 * does not have at all is drawn in the system face either way.
 */
installBrowser();
const { playStyleOptions } = await import("../../src/appCopy.js");
const { seasonCasesBase } = await import("../../src/gameCases.js");
const { getOperatorProfiles } = await import("../../src/advancedSystems.js");
const { INTRO_FIELDS_WITHOUT_RUNTIME } = await import("../../src/viewModels/appViewModels.js");
const { createIntroViewModel } = await import("../../src/viewModels/introViewModel.js");

/** Every string under a value: object values and array items, not keys, not functions. */
function stringsOf(value, out = [], seen = new Set()) {
  if (typeof value === "string") out.push(value);
  else if (value && typeof value === "object" && !seen.has(value)) {
    seen.add(value);
    for (const item of Array.isArray(value) ? value : Object.values(value)) stringsOf(item, out, seen);
  }
  return out;
}

test("every string the intro's field bag carries is in the first font file", () => {
  const first = readCharsetList(undefined, FIRST_CHARSET_OUTPUT);
  const all = readCharsetList(undefined, CHARSET_OUTPUT);
  const missing = new Map();
  for (const style of playStyleOptions) {
    for (const origin of getOperatorProfiles()) {
      const view = createIntroViewModel({
        playerName: "", playStyle: style.id, dataConsent: false, operatorOrigin: origin.id, sessionCode: "UNIT", isOnline: true,
        hasResumableSave: false, lastSavedAt: null, log: [], caseResults: {}, completedCases: [], currentCase: seasonCasesBase[0].id, nodeId: "start",
        newGamePlusUnlocked: false, newGamePlusMemory: {},
      });
      for (const [field, value] of Object.entries(view)) {
        if (field in INTRO_FIELDS_WITHOUT_RUNTIME) continue;
        for (const text of stringsOf(value)) {
          for (const character of text) {
            if (all.has(character) && !first.has(character) && !missing.has(character)) missing.set(character, `${field}: ${text.slice(0, 40)}`);
          }
        }
      }
    }
  }
  assert.ok(playStyleOptions.length > 0 && getOperatorProfiles().length > 0);
  assert.deepEqual(
    [...missing].map(([character, where]) => `${character} (${where})`),
    [],
    "add the module these come from to FIRST_PAINT_SOURCES (scripts/font-charset.mjs) and run `npm run build:fonts`",
  );
});
