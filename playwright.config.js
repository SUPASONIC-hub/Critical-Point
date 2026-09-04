import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: {
    timeout: 8_000,
  },
  /**
   * The platform token is the reason a baseline recorded on Windows cannot be
   * compared against a run on Linux: font rasterisation genuinely differs, so
   * one shared baseline would either fail constantly or need a budget wide
   * enough to hide a moved block. Keeping the token is correct; what it costs
   * is that every platform CI runs on needs its own committed baseline, which
   * `npm run check:visual-baselines` is the ratchet for.
   *
   * Spelled out rather than left to the default so that it is greppable from
   * the file names, which is how the missing Linux set went unnoticed.
   */
  snapshotPathTemplate: "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}-{platform}{ext}",
  use: {
    // `npm run test:e2e` asks the OS for a free port and passes it here, so the
    // fallback only applies when a dev server is started by hand on 5197.
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:5197",
    trace: "on-first-retry",
    permissions: ["clipboard-read", "clipboard-write"],
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
