import { registerHooks } from "node:module";

/**
 * N43 (11-18): plays B1's second look on other numbers without touching the
 * game's source. Loaded before a measurement with `node --import`, a load
 * hook rewrites SCOUT_NARROW_REACH (half the narrowed band: 7 is 14 cells)
 * and SCOUT_NARROW_TRUST (its 믿음) in src/gauntlet/tableRules.js as the
 * module is read. A measurement only; the game, its tests and its build never
 * load it.
 *
 *   SCOUT_NARROW_REACH=6 node --import ./scripts/sim/scout-values.mjs scripts/sim/scout-narrow-report.mjs
 *
 * scout-narrow-report.mjs prints the numbers it played, read back from
 * tableRules.js, so a value asked without this file shows as the game's.
 */
export const SCOUT_VALUE_NAMES = Object.freeze(["SCOUT_NARROW_REACH", "SCOUT_NARROW_TRUST"]);

/** tableRules.js's source with the asked numbers in place; throws if a name is no longer a plain number there. */
export function rewriteScoutValues(source, values) {
  let text = String(source);
  for (const [name, value] of Object.entries(values)) {
    if (!SCOUT_VALUE_NAMES.includes(name)) throw new Error(`scout-values: ${name} is not one of ${SCOUT_VALUE_NAMES.join(", ")}`);
    if (!Number.isInteger(value) || value < 0) throw new Error(`scout-values: ${name}=${value} must be a whole number`);
    const line = new RegExp(`export const ${name} = \\d+;`);
    if (!line.test(text)) throw new Error(`scout-values: ${name} is no longer a plain number in tableRules.js`);
    text = text.replace(line, `export const ${name} = ${value};`);
  }
  return text;
}

const asked = Object.fromEntries(SCOUT_VALUE_NAMES.filter((name) => process.env[name]).map((name) => [name, Number(process.env[name])]));
if (Object.keys(asked).length) {
  registerHooks({
    load(url, context, nextLoad) {
      const result = nextLoad(url, context);
      if (!url.endsWith("/src/gauntlet/tableRules.js")) return result;
      return { ...result, source: rewriteScoutValues(result.source, asked) };
    },
  });
}
