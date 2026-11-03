/**
 * `npm run build:e2e`: `vite build --mode e2e`, reused when the same tree was
 * built before.
 *
 * Several agents build the same main, each in its own worktree, one after the
 * other behind the build lock, and every one of those builds writes the same
 * dist/. A clean worktree's tree (`git rev-parse HEAD^{tree}`) names its files
 * exactly, so its dist/ is kept in a cache beside the repository (`..\cp-build-cache\`
 * next to the main checkout; CP_BUILD_CACHE moves it) and copied back the next
 * time any worktree asks for the same build. The key also carries what the
 * build reads besides the tree: the mode and the arguments, every environment
 * variable Vite or vite.config.js reads, the untracked .env files of that mode,
 * the Node version and the installed packages. The budgets are still measured
 * on that build (check:bundle reads dist/ as before): a copy of it is it.
 *
 * Not reused, the build just runs: a worktree with anything uncommitted
 * (untracked files included), CI (`CI` is set), `--no-cache`, or
 * BUILD_CACHE=off. The cache keeps the newest `--keep=N` (default 6) builds.
 *
 *   node scripts/build-cache.mjs [--mode e2e] [--no-cache] [--keep=6] [-- vite args]
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const KEY_VERSION = 1;

// Names Vite exposes (VITE_), the prefixes vite.config.js loads with loadEnv,
// and the variables it or its plugins read from process.env.
const ENV_PREFIXES = ["VITE_", "GA_", "ADSENSE_", "GOOGLE_", "E2E_"];
const ENV_NAMES = ["NODE_ENV", "SKIP_CRITICAL_CSS", "SERVICE_WORKER", "RENDER_GIT_COMMIT", "RENDER_EXTERNAL_URL", "SITE_URL", "BASE_URL"];

/** The environment variables that can change the build, sorted by name. */
export function buildEnv(env) {
  return Object.fromEntries(
    Object.entries(env)
      .filter(([name]) => ENV_NAMES.includes(name) || ENV_PREFIXES.some((prefix) => name.startsWith(prefix)))
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
}

/** The .env files Vite reads for `mode`, in its own order. */
export const envFileNames = (mode) => [".env", ".env.local", `.env.${mode}`, `.env.${mode}.local`];

const sha = (text) => createHash("sha256").update(text).digest("hex");

/**
 * The cache entry's name: the tree first (to read), then a hash of everything
 * else the build reads. `envFiles` maps a file name to its text (absent files
 * left out); `deps` is the installed packages' lock text.
 */
export function buildCacheKey({ tree, mode, args = [], env = {}, envFiles = {}, node, deps = "" }) {
  if (!/^[0-9a-f]{40,64}$/.test(tree ?? "")) throw new Error(`not a tree id: ${tree}`);
  const files = Object.fromEntries(Object.entries(envFiles).sort(([a], [b]) => (a < b ? -1 : 1)).map(([name, text]) => [name, sha(text)]));
  const rest = JSON.stringify({ v: KEY_VERSION, mode, args, env: buildEnv(env), files, node, deps: sha(deps) });
  return `${tree.slice(0, 16)}-${sha(rest).slice(0, 16)}`;
}

/** Entry names to delete so that only the `keep` newest remain. */
export function entriesToPrune(entries, keep) {
  return [...entries].sort((a, b) => b.time - a.time).slice(Math.max(0, keep)).map((entry) => entry.name);
}

function git(args, cwd) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

/** `..\cp-build-cache` beside the main checkout, wherever this worktree is. */
export function defaultCacheDir(root) {
  if (process.env.CP_BUILD_CACHE) return path.resolve(process.env.CP_BUILD_CACHE);
  const common = git(["rev-parse", "--path-format=absolute", "--git-common-dir"], root);
  return path.join(path.dirname(path.dirname(common)), "cp-build-cache");
}

function parseArgs(argv) {
  const split = argv.indexOf("--");
  const own = split === -1 ? argv : argv.slice(0, split);
  const viteArgs = split === -1 ? [] : argv.slice(split + 1);
  const modeAt = own.indexOf("--mode");
  const mode = modeAt === -1 ? "production" : own[modeAt + 1];
  const keep = Number(own.find((arg) => arg.startsWith("--keep="))?.slice(7)) || 6;
  return { mode, keep, viteArgs, noCache: own.includes("--no-cache") };
}

function viteBuild(root, mode, viteArgs) {
  const require = createRequire(path.join(root, "package.json"));
  const pkg = require.resolve("vite/package.json");
  const bin = path.join(path.dirname(pkg), JSON.parse(readFileSync(pkg, "utf8")).bin.vite);
  const result = spawnSync(process.execPath, [bin, "build", "--mode", mode, ...viteArgs], { cwd: root, stdio: "inherit" });
  return result.status ?? 1;
}

function main() {
  const root = process.cwd();
  const { mode, keep, viteArgs, noCache } = parseArgs(process.argv.slice(2));
  const dist = path.join(root, "dist");
  const why = process.env.CI
    ? "CI"
    : noCache
      ? "--no-cache"
      : (process.env.BUILD_CACHE ?? "").toLowerCase() === "off"
        ? "BUILD_CACHE=off"
        : git(["status", "--porcelain", "--untracked-files=normal"], root)
          ? "uncommitted changes"
          : null;
  if (why) {
    if (!process.env.CI) console.log(`build-cache: not reused (${why}); building.`);
    process.exit(viteBuild(root, mode, viteArgs));
  }

  const envFiles = {};
  for (const name of envFileNames(mode)) {
    const file = path.join(root, name);
    if (existsSync(file)) envFiles[name] = readFileSync(file, "utf8");
  }
  const depsFile = path.join(root, "node_modules", ".package-lock.json");
  const key = buildCacheKey({
    tree: git(["rev-parse", "HEAD^{tree}"], root),
    mode,
    args: viteArgs,
    env: process.env,
    envFiles,
    node: process.version,
    deps: existsSync(depsFile) ? readFileSync(depsFile, "utf8") : "",
  });
  const cacheDir = defaultCacheDir(root);
  const entry = path.join(cacheDir, key);

  if (existsSync(path.join(entry, "meta.json")) && existsSync(path.join(entry, "dist", "index.html"))) {
    const startedAt = Date.now();
    rmSync(dist, { recursive: true, force: true });
    cpSync(path.join(entry, "dist"), dist, { recursive: true });
    const meta = JSON.parse(readFileSync(path.join(entry, "meta.json"), "utf8"));
    writeFileSync(path.join(entry, "meta.json"), JSON.stringify({ ...meta, usedAt: new Date().toISOString() }, null, 2));
    console.log(`build-cache: reused ${key} (built ${meta.builtAt} in ${meta.builtIn}) in ${((Date.now() - startedAt) / 1000).toFixed(1)}s.`);
    return;
  }

  console.log(`build-cache: no build of ${key} yet; building.`);
  const startedAt = Date.now();
  const code = viteBuild(root, mode, viteArgs);
  if (code !== 0) process.exit(code);
  // The tree may have moved while the build ran (a commit in another shell):
  // then dist/ is not that tree's build, and is not kept.
  if (git(["status", "--porcelain", "--untracked-files=normal"], root) || !key.startsWith(git(["rev-parse", "HEAD^{tree}"], root).slice(0, 16))) {
    console.log("build-cache: the worktree changed during the build; not kept.");
    return;
  }
  mkdirSync(cacheDir, { recursive: true });
  const staging = path.join(cacheDir, `.tmp-${key}-${process.pid}`);
  rmSync(staging, { recursive: true, force: true });
  cpSync(dist, path.join(staging, "dist"), { recursive: true });
  const now = new Date().toISOString();
  writeFileSync(
    path.join(staging, "meta.json"),
    JSON.stringify({ key, mode, args: viteArgs, builtAt: now, usedAt: now, builtIn: `${((Date.now() - startedAt) / 1000).toFixed(1)}s`, from: root }, null, 2),
  );
  try {
    renameSync(staging, entry);
    console.log(`build-cache: kept ${key} in ${cacheDir}.`);
  } catch {
    // Another worktree kept the same build first.
    rmSync(staging, { recursive: true, force: true });
  }
  const entries = readdirSync(cacheDir, { withFileTypes: true })
    .filter((item) => item.isDirectory() && !item.name.startsWith("."))
    .map((item) => {
      const meta = path.join(cacheDir, item.name, "meta.json");
      return { name: item.name, time: existsSync(meta) ? statSync(meta).mtimeMs : 0 };
    });
  for (const name of entriesToPrune(entries, keep)) rmSync(path.join(cacheDir, name), { recursive: true, force: true });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
