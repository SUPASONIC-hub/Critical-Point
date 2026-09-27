import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  /**
   * Playwright's local default is half the core count, which on an 18-core
   * laptop is nine Chromium instances per project. The suite is bound by memory
   * rather than by cores -- with ~5GB free that oversubscribes the machine, the
   * run starts swapping, and tests fail on 60-second timeouts in a different
   * place each time while anything else running alongside it stalls too. Three
   * is slower in wall clock and finishes. CI is left alone: Playwright already
   * runs one worker there.
   */
  workers: process.env.CI ? undefined : 3,
  // A `test.only` left in a spec would quietly turn the CI run into one test.
  forbidOnly: !!process.env.CI,
  // On CI: an HTML report for the uploaded artifact, annotations on the PR, and
  // the plain list in the log. Locally the list alone.
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"], ["list"]] : "list",
  timeout: 60_000,
  expect: {
    timeout: 8_000,
  },
  /**
   * The platform token is the reason a baseline recorded on Windows cannot be
   * compared against a run on Linux: font rasterisation genuinely differs. Only
   * the `linux` set is committed, recorded in the pinned Playwright container
   * (the Visual Regression workflow, or `npm run test:visual:docker` locally);
   * a `-win32` file from a desktop run is gitignored and refused by
   * `npm run check:visual-baselines`.
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
