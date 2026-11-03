import assert from "node:assert/strict";
import test from "node:test";
import { buildCacheKey, buildEnv, entriesToPrune, envFileNames } from "../../scripts/build-cache.mjs";

/**
 * `npm run build:e2e` reuses a dist/ built from the same tree
 * (scripts/build-cache.mjs). The key has to change with everything else the
 * build reads, and with nothing that does not.
 */

const TREE = "0123456789abcdef0123456789abcdef01234567";
const base = { tree: TREE, mode: "e2e", args: [], env: {}, envFiles: { ".env.e2e": "VITE_SUPABASE_URL=https://e2e.supabase.co\n" }, node: "v24.22.1", deps: "lock" };

test("the key starts with the tree and is stable", () => {
  const key = buildCacheKey(base);
  assert.match(key, /^0123456789abcdef-[0-9a-f]{16}$/);
  assert.equal(buildCacheKey({ ...base }), key);
});

test("the key changes with the mode, arguments, build env, .env files, Node and packages", () => {
  const key = buildCacheKey(base);
  const variants = {
    tree: { tree: "f".repeat(40) },
    mode: { mode: "production" },
    args: { args: ["--sourcemap"] },
    vite: { env: { VITE_SUPABASE_URL: "https://placeholder.supabase.co" } },
    critical: { env: { SKIP_CRITICAL_CSS: "true" } },
    worker: { env: { SERVICE_WORKER: "off" } },
    ads: { env: { ADSENSE_ADS: "on" } },
    analytics: { env: { GA_MEASUREMENT_ID: "G-X" } },
    envFile: { envFiles: { ...base.envFiles, ".env.local": "VITE_ENABLE_DEBUG_TOOLS=true\n" } },
    envText: { envFiles: { ".env.e2e": "VITE_SUPABASE_URL=https://other.supabase.co\n" } },
    node: { node: "v24.23.0" },
    deps: { deps: "lock2" },
  };
  for (const [what, change] of Object.entries(variants)) assert.notEqual(buildCacheKey({ ...base, ...change }), key, what);
});

test("variables the build does not read leave the key alone, in any order", () => {
  const key = buildCacheKey({ ...base, env: { VITE_A: "1", GA_B: "2" } });
  assert.equal(buildCacheKey({ ...base, env: { GA_B: "2", PATH: "/usr/bin", TEMP: "x", VITE_A: "1" } }), key);
  assert.deepEqual(Object.keys(buildEnv({ PATH: "x", VITE_A: "1", NODE_ENV: "production", E2E_BACKEND_ORIGIN: "y" })), ["E2E_BACKEND_ORIGIN", "NODE_ENV", "VITE_A"]);
});

test("a tree id is required", () => {
  assert.throws(() => buildCacheKey({ ...base, tree: "HEAD" }));
});

test("the .env files are Vite's for the mode", () => {
  assert.deepEqual(envFileNames("e2e"), [".env", ".env.local", ".env.e2e", ".env.e2e.local"]);
});

test("pruning keeps the newest", () => {
  const entries = [
    { name: "a", time: 1 },
    { name: "b", time: 3 },
    { name: "c", time: 2 },
  ];
  assert.deepEqual(entriesToPrune(entries, 2), ["a"]);
  assert.deepEqual(entriesToPrune(entries, 5), []);
});
