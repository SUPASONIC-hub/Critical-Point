import { registerHooks } from "node:module";

/**
 * B2's three candidate value sets (B2 design 3, decision 8): the link's four
 * numbers for each. B is what cascadeRisk.js carries.
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
 * Loaded before a measurement with `node --import`, this switches B2 on and
 * plays it on a value set without touching the game's source: a load hook
 * rewrites `CASCADE_ON` and the four numbers in src/gauntlet/cascadeRisk.js
 * as the module is read. A measurement only; the game, its tests and its
 * build never load it, and ship the switch off.
 *
 *   CASCADE_WEEK=1 LINK_VALUES=C node --import ./scripts/sim/cascade-values.mjs scripts/check-endings.mjs --report
 *
 * season-bot.mjs checks that the switch and the numbers it plays are the ones
 * asked for, so CASCADE_WEEK=1 or LINK_VALUES without this file fails instead
 * of measuring the game with B2 off.
 */
const on = process.env.CASCADE_WEEK === "1";
const asked = process.env.LINK_VALUES || "B";
if (on) {
  const set = LINK_VALUE_SETS[asked];
  if (!set) throw new Error(`LINK_VALUES=${asked}: one of ${Object.keys(LINK_VALUE_SETS).join(", ")}`);
  registerHooks({
    load(url, context, nextLoad) {
      const result = nextLoad(url, context);
      if (!url.endsWith("/src/gauntlet/cascadeRisk.js")) return result;
      let source = String(result.source);
      const lines = [["CASCADE_ON", /export const CASCADE_ON = (true|false);/, "true"], ...Object.entries(set).map(([name, value]) => [name, new RegExp(`export const ${name} = \\d+;`), String(value)])];
      for (const [name, line, value] of lines) {
        if (!line.test(source)) throw new Error(`cascade-values: ${name} is no longer a plain value in cascadeRisk.js`);
        source = source.replace(line, `export const ${name} = ${value};`);
      }
      return { ...result, source };
    },
  });
}
