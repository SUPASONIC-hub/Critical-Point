import { registerHooks } from "node:module";

/**
 * A week's numbers, played on other values without touching the game's
 * source (as audit-values.mjs does for the audit): loaded first with
 * `node --import`, a load hook rewrites the plain-number constants named in
 * WEEK_VALUES as src/gauntlet/weeklyRules.js is read. A measurement only; the
 * game, its tests and its build never load it.
 *
 *   WEEK_RULE=idle-erosion WEEK_VALUES=IDLE_EROSION_PERCENT=6 node --import ./scripts/sim/week-values.mjs scripts/check-endings.mjs
 *
 * season-bot.mjs checks that the numbers it plays are the ones asked for, so
 * a WEEK_VALUES without this file fails instead of measuring the shipped ones.
 */
export function parseWeekValues(text = "") {
  return Object.fromEntries(String(text).split(",").filter(Boolean).map((pair) => {
    const [name, value] = pair.split("=");
    if (!/^[A-Z][A-Z0-9_]*$/.test(name ?? "") || !Number.isFinite(Number(value))) throw new Error(`WEEK_VALUES: "${pair}" is not NAME=number`);
    return [name, Number(value)];
  }));
}

const asked = parseWeekValues(process.env.WEEK_VALUES);
if (Object.keys(asked).length) {
  registerHooks({
    load(url, context, nextLoad) {
      const result = nextLoad(url, context);
      if (!url.endsWith("/src/gauntlet/weeklyRules.js")) return result;
      let source = String(result.source);
      for (const [name, value] of Object.entries(asked)) {
        const line = new RegExp(`export const ${name} = [0-9.]+;`);
        if (!line.test(source)) throw new Error(`week-values: ${name} is not a plain number in weeklyRules.js`);
        source = source.replace(line, `export const ${name} = ${value};`);
      }
      return { ...result, source };
    },
  });
}
