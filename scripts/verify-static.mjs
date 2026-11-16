/**
 * `npm run verify:static`: every check that needs no browser, run side by side.
 *
 * It used to be one `&&` chain of twenty-two `npm run` hops. Each hop paid for
 * its own npm start-up, the chain stopped at the first failure (so a red lint
 * hid a red balance check behind it), and the checks -- which read files and
 * share nothing -- waited on each other for no reason. Here they run in a small
 * pool, each one's output is held back and printed as a block when it finishes,
 * and the run fails if any of them failed, after all of them have reported.
 *
 * CHECKS is the list. Each entry is an npm script name, and the script in
 * package.json stays the single definition of what the check runs, so
 * `npm run check:x` on its own does exactly what it does here. Add a check by
 * adding its name; order only decides who starts first, so the slow ones lead.
 *
 * The pool itself is scripts/check-pool.mjs, shared with `npm run
 * check:changed` (scripts/check-changed.mjs), which imports CHECKS from here
 * and runs only the ones a branch's changes touch. Importing this file runs
 * nothing; running it does.
 */
import { pathToFileURL } from "node:url";
import { poolOptions, readScripts, runPool } from "./check-pool.mjs";

export const CHECKS = [
  // The unit tests, run once, with the coverage floors read off the same run
  // (scripts/check-coverage.mjs). `npm test` is the same tests without them.
  "test:coverage",
  "lint",
  "check:pressure",
  "check:endings",
  "check:balance",
  "check:types",
  "check:dialogue",
  "check:graph",
  "check:runtime-budget",
  "check:views",
  "check:constants",
  "check:text",
  "check:plain-language",
  "check:encoding",
  "check:css",
  "check:css-structure",
  "format:check",
  "check:art",
  "check:fonts",
  "check:export-schema",
  "check:test-storage",
  "check:visual-baselines",
  "check:node",
  "check:grants",
  "check:canon",
  "check:card-labels",
  // English and Japanese open to the end (10-28, the owner's choice 1): a Korean
  // line changed without its translations, or a translation left over, fails here.
  "check:locale:strict",
  "check:doc-numbers",
  // README.md keeps docs/readme-rules.md: a short portfolio page, detail in <details>.
  "check:readme",
];

async function main() {
  const root = process.cwd();
  const scripts = readScripts(root);
  const missing = CHECKS.filter((name) => !scripts[name]);
  if (missing.length) {
    console.error(`verify:static names checks package.json does not define: ${missing.join(", ")}`);
    process.exit(1);
  }

  const argv = process.argv.slice(2);
  const only = argv.filter((arg) => !arg.startsWith("--"));
  // A name that matches nothing used to select nothing: `verify:static --
  // chekc:types` ran zero checks, printed "0/0 passed" and exited 0.
  const unknown = only.filter((name) => !CHECKS.includes(name));
  if (unknown.length) {
    console.error(`verify:static has no check named ${unknown.join(", ")}. The checks are: ${CHECKS.join(", ")}.`);
    process.exit(1);
  }
  const selected = only.length ? CHECKS.filter((name) => only.includes(name)) : CHECKS;
  const { jobs, timeoutMs } = poolOptions(argv, selected.length);
  const failed = await runPool(
    selected.map((name) => ({ name, command: scripts[name] })),
    { root, jobs, timeoutMs, label: "verify:static" },
  );
  process.exitCode = failed.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
