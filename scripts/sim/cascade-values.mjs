import { registerHooks } from "node:module";

/**
 * B2's three candidate value sets (B2 design 3, decision 8): the link's four
 * numbers for each. B is what cascadeRisk.js carries, and what the user kept
 * on 2026-10-20 (decision 2 (1)).
 *
 *   A  light   a burn of 10, two to three boards, a wall 3 closer (STEADY LINE's 3)
 *   B  middle  a burn of 8 (FRACTURE's), two to four boards, 6 (BLACKOUT's)
 *   C  heavy   a burn of 7, two to five boards, 8
 */
export const LINK_VALUE_SETS = Object.freeze({
  A: Object.freeze({ LINK_BURN: 10, LINK_SPAN_MIN: 2, LINK_SPAN_MAX: 3, LINK_WALL: 3 }),
  B: Object.freeze({ LINK_BURN: 8, LINK_SPAN_MIN: 2, LINK_SPAN_MAX: 4, LINK_WALL: 6 }),
  C: Object.freeze({ LINK_BURN: 7, LINK_SPAN_MIN: 2, LINK_SPAN_MAX: 5, LINK_WALL: 8 }),
});

/**
 * Loaded before a measurement with `node --import`, this plays the cascade
 * week on another value set without touching the game's source: a load hook
 * rewrites the four numbers in src/gauntlet/cascadeRisk.js as the module is
 * read. The week itself is CASCADE_WEEK=1, which stamps it on the bots' runs
 * (season-bot.mjs). A measurement only; the game, its tests and its build
 * never load it.
 *
 *   CASCADE_WEEK=1 LINK_VALUES=C node --import ./scripts/sim/cascade-values.mjs scripts/check-endings.mjs --report
 *
 * season-bot.mjs checks that the numbers it plays are the set asked for, so
 * a LINK_VALUES without this file fails instead of measuring B.
 */
const asked = process.env.LINK_VALUES;
if (asked) {
  const set = LINK_VALUE_SETS[asked];
  if (!set) throw new Error(`LINK_VALUES=${asked}: one of ${Object.keys(LINK_VALUE_SETS).join(", ")}`);
  registerHooks({
    load(url, context, nextLoad) {
      const result = nextLoad(url, context);
      if (!url.endsWith("/src/gauntlet/cascadeRisk.js")) return result;
      let source = String(result.source);
      for (const [name, value] of Object.entries(set)) {
        const line = new RegExp(`export const ${name} = \\d+;`);
        if (!line.test(source)) throw new Error(`cascade-values: ${name} is no longer a plain number in cascadeRisk.js`);
        source = source.replace(line, `export const ${name} = ${value};`);
      }
      return { ...result, source };
    },
  });
}
