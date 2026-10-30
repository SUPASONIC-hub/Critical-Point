/**
 * The web build the iOS shell carries inside the app (docs/app-shell.md).
 *
 * The root's own Vite, from the root, in `--mode app`: the same page and the
 * same chunks as the site, written to app/dist-app instead of dist/ so the
 * site's build, budgets and tests never see it. `--mode app` switches the
 * service worker off (vite.config.js): WKWebView does not run one for the
 * app's own scheme, and every file is already on the device. It also leaves
 * out the AdSense and Search Console site verification, which no crawler
 * reads inside the app.
 *
 * The Supabase keys come from the environment as they do for the site's build
 * (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY); without them the app runs with
 * the remote leaderboard and telemetry off, like a local build.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const vite = path.join(root, "node_modules", "vite", "bin", "vite.js");
const outDir = path.join(here, "dist-app");

const result = spawnSync(process.execPath, [vite, "build", "--mode", "app", "--outDir", outDir, "--emptyOutDir"], {
  cwd: root,
  stdio: "inherit",
});
process.exit(result.status ?? 1);
