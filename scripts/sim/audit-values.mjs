import { registerHooks } from "node:module";

/**
 * B3's three candidate value sets (B3 design 3, decision 5): the audit's four
 * numbers for each. B is what auditRisk.js ships.
 *
 *   A  light   a cash under 30, five marks, -2 at HEAT DEBT, one part in five
 *   B  middle  a cash under 40, four marks, -2, one part in four
 *   C  heavy   a cash under 48, three marks, -1, one part in three
 */
export const AUDIT_VALUE_SETS = Object.freeze({
  A: Object.freeze({ AUDIT_HEAT: 30, AUDIT_LIMIT: 5, AUDIT_RELIEF: 2, AUDIT_SHARE: 5 }),
  B: Object.freeze({ AUDIT_HEAT: 40, AUDIT_LIMIT: 4, AUDIT_RELIEF: 2, AUDIT_SHARE: 4 }),
  C: Object.freeze({ AUDIT_HEAT: 48, AUDIT_LIMIT: 3, AUDIT_RELIEF: 1, AUDIT_SHARE: 3 }),
});

/**
 * Loaded before the measurement with `node --import`, this plays the audit
 * on another value set without touching the game's source: a load hook
 * rewrites the four numbers in src/gauntlet/auditRisk.js as the module is
 * read. A measurement only; the game, its tests and its build never load it.
 *
 *   AUDIT_VALUES=C node --import ./scripts/sim/audit-values.mjs scripts/check-endings.mjs --report
 *
 * season-bot.mjs checks that the numbers it plays are the set asked for, so
 * an AUDIT_VALUES without this file fails instead of measuring B.
 */
const asked = process.env.AUDIT_VALUES;
if (asked) {
  const set = AUDIT_VALUE_SETS[asked];
  if (!set) throw new Error(`AUDIT_VALUES=${asked}: one of ${Object.keys(AUDIT_VALUE_SETS).join(", ")}`);
  registerHooks({
    load(url, context, nextLoad) {
      const result = nextLoad(url, context);
      if (!url.endsWith("/src/gauntlet/auditRisk.js")) return result;
      let source = String(result.source);
      for (const [name, value] of Object.entries(set)) {
        const line = new RegExp(`export const ${name} = \\d+;`);
        if (!line.test(source)) throw new Error(`audit-values: ${name} is no longer a plain number in auditRisk.js`);
        source = source.replace(line, `export const ${name} = ${value};`);
      }
      return { ...result, source };
    },
  });
}
