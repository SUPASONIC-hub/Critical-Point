import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { completeCurrentCase, startDebugNode } from "./helpers/gameFlow.js";

test.use({ colorScheme: "light" });

async function stabilizeVisualPage(page, { expectMasked = [] } = {}) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      /* Blanked, not removed: every element here is one a player sees, so its
         box is a real layout fact the baseline should keep. Only the content is
         noise. The music controls are in this group for determinism, not for
         geometry -- they are position: fixed and contribute no height either
         way, but the toggle's label, icon, background colour and even the
         number of buttons all change with audioState and modeKey
         (src/components/AdaptiveMusic.jsx:473-512), and the CI container may
         have no audio device at all (tests/helpers/gameFlow.js:210 already
         filters that error), so a rendered control would differ between
         captures and between platforms. */
      .debug-overlay,
      .music-controls,
      .music-toggle,
      .status-bar-timer,
      .timer-card,
      /* Regenerated per browser context, so it is eight glyphs of noise in
         every baseline that prints it. */
      [data-testid="session-code"] {
        visibility: hidden !important;
      }
      /* Debug-only chrome, taken out of the flow rather than blanked. The
         ?debug=1 entry turns all four on in the harness (tests/helpers/gameFlow.js:27,
         src/appConfig.js:22) and nothing turns them on for a player, so leaving
         their boxes behind would bake vertical space no player can ever see into
         the two result baselines: 96px of diagnostics blocks on both, plus 100px
         of buttons on mobile, where src/styles/app/responsive.css:196-212 stacks
         .top-actions into full-width rows. Neither debug button has a class of
         its own; aria-expanded is the error-log disclosure's only signature in
         this row (src/screens/ResultScreen.jsx:208) and the export button
         carries a testid (:224). The expectMasked guard below is what keeps
         those two selectors honest. */
      .telemetry-stats,
      .replay-diagnostics,
      .result-page .top-actions button[aria-expanded],
      .result-page .top-actions [data-testid="export-diagnostic-log"] {
        display: none !important;
      }
    `,
  });

  // A mask selector that silently stops matching would put debug chrome back
  // into a baseline without failing anything, so assert both halves: the target
  // is still in the DOM, and it no longer takes up space.
  for (const selector of expectMasked) {
    await expect(page.locator(selector), `mask selector matched nothing: ${selector}`).not.toHaveCount(0);
    await expect(page.locator(`${selector}:visible`), `mask selector left something rendered: ${selector}`).toHaveCount(0);
  }
}

// The four selectors the display:none block above has to keep hitting on a
// result capture. Intro and play captures never render them.
const RESULT_MASK_SELECTORS = [
  ".telemetry-stats",
  ".replay-diagnostics",
  ".result-page .top-actions button[aria-expanded]",
  '.result-page .top-actions [data-testid="export-diagnostic-log"]',
];

function readPngSize(file) {
  const buffer = readFileSync(file);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function readCaptureGeometry(target, { fullPage = false } = {}) {
  if (fullPage) {
    return await target.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      return {
        width: Math.ceil(Math.max(root.clientWidth, root.scrollWidth, body?.scrollWidth ?? 0)),
        height: Math.ceil(Math.max(root.clientHeight, root.scrollHeight, body?.scrollHeight ?? 0)),
      };
    });
  }

  const box = await target.boundingBox();
  expect(box, "visual capture target must have a measurable bounding box").not.toBeNull();
  return {
    width: Math.ceil(box.width),
    height: Math.ceil(box.height),
  };
}

async function expectCaptureGeometry(target, testInfo, screenshotName, options = {}) {
  // `--update-snapshots` exists to rewrite the baseline; this gate exists to stop
  // a *comparison* run from rewriting one without an explanation. Leaving it
  // armed in record mode makes recording impossible: the throw below lands before
  // toHaveScreenshot() is ever reached, so neither a local refresh nor the
  // workflow's update_baselines dispatch (.github/workflows/visual-regression.yml:55)
  // could record a drifted screen. This is a positive allowlist on purpose --
  // the default "missing" and an explicit "none" both keep the gate armed, so
  // comparison runs are unchanged.
  if (testInfo.config.updateSnapshots === "all" || testInfo.config.updateSnapshots === "changed") return;
  const baselinePath = testInfo.snapshotPath(screenshotName, { kind: "screenshot" });
  expect(existsSync(baselinePath), `visual baseline is missing: ${baselinePath}`).toBe(true);
  const baseline = readPngSize(baselinePath);
  const actual = await readCaptureGeometry(target, options);

  if (actual.width !== baseline.width || actual.height !== baseline.height) {
    const actualPngPath = testInfo.outputPath(`${screenshotName.replace(/\.png$/u, "")}-geometry-actual.png`);
    await target.screenshot({
      path: actualPngPath,
      ...(options.fullPage ? { fullPage: true } : {}),
      animations: "disabled",
      caret: "hide",
    });
    const captured = readPngSize(actualPngPath);
    const classification = captured.width === actual.width && captured.height === actual.height ? "layout" : "harness";
    const diagnostics = {
      screenshotName,
      classification,
      baseline,
      measuredDomGeometry: actual,
      capturedPngGeometry: captured,
      widthDelta: actual.width - baseline.width,
      heightDelta: actual.height - baseline.height,
    };
    await testInfo.attach(`${screenshotName} geometry diagnostics`, {
      body: JSON.stringify(diagnostics, null, 2),
      contentType: "application/json",
    });

    expect(
      actual,
      `${screenshotName} capture geometry changed: classification=${classification}; ` +
        `expected baseline ${baseline.width}x${baseline.height}, measured DOM ${actual.width}x${actual.height}, ` +
        `captured PNG ${captured.width}x${captured.height}. ` +
        `If classification=layout, fix the rendered layout before refreshing baselines; ` +
        `if classification=harness, fix readCaptureGeometry().`,
    ).toEqual(baseline);
  }

  expect(
    actual,
    `${screenshotName} capture geometry changed: expected ${baseline.width}x${baseline.height}, ` +
      `measured ${actual.width}x${actual.height}. Identify the layout or harness cause before refreshing baselines.`,
  ).toEqual(baseline);
}

test("intro desktop visual baseline @visual", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await stabilizeVisualPage(page);
  await expectCaptureGeometry(page, testInfo, "intro-desktop.png", { fullPage: true });
  await expect(page).toHaveScreenshot("intro-desktop.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 500,
  });
});

test("case play desktop visual baseline @visual", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.locator(".game-shell")).toBeVisible();
  await stabilizeVisualPage(page);
  const gameShell = page.locator(".game-shell");
  await expectCaptureGeometry(gameShell, testInfo, "case-play-desktop.png");
  await expect(gameShell).toHaveScreenshot("case-play-desktop.png", {
    animations: "disabled",
    caret: "hide",
  });
});

// The densest screen in the app, and the one the layout work was aimed at.
test("case play mobile visual baseline @visual", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.locator(".game-shell")).toBeVisible();
  await stabilizeVisualPage(page);
  const gameShell = page.locator(".game-shell");
  await expectCaptureGeometry(gameShell, testInfo, "case-play-mobile.png");
  await expect(gameShell).toHaveScreenshot("case-play-mobile.png", {
    animations: "disabled",
    caret: "hide",
  });
});

test("case result desktop visual baseline @visual", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case01", "c1_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  await stabilizeVisualPage(page, { expectMasked: RESULT_MASK_SELECTORS });
  // Eight buttons render under ?debug=1 and six of them are the player's. If the
  // first line breaks the row changed; if only the second breaks, a mask
  // selector went stale.
  await expect(page.locator(".result-page .top-actions button")).toHaveCount(8);
  await expect(page.locator(".result-page .top-actions button:visible")).toHaveCount(6);
  // The report prints numbers derived from real response times, so a few
  // hundred glyph pixels differ every run. The budget is wide enough to ignore
  // those and narrow enough that a moved block still fails.
  const resultPage = page.locator(".result-page");
  await expectCaptureGeometry(resultPage, testInfo, "case-result-desktop.png");
  await expect(resultPage).toHaveScreenshot("case-result-desktop.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 4000,
  });
});

test("case result mobile layout stays within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case01", "c1_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    resultWidth: document.querySelector(".result-page")?.getBoundingClientRect().width ?? 0,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  expect(dimensions.resultWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
});

test("case result mobile visual baseline @visual", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case01", "c1_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  await stabilizeVisualPage(page, { expectMasked: RESULT_MASK_SELECTORS });
  await expect(page.locator(".result-page .top-actions button")).toHaveCount(8);
  await expect(page.locator(".result-page .top-actions button:visible")).toHaveCount(6);
  const resultPage = page.locator(".result-page");
  await expectCaptureGeometry(resultPage, testInfo, "case-result-mobile.png");
  await expect(resultPage).toHaveScreenshot("case-result-mobile.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 2500,
  });
});

test("case result explains the ending signals", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case01", "c1_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".ending-rationale")).toContainText("신뢰");
  await expect(page.locator(".ending-rationale")).toContainText("정당성");
});

// U-1: one decision used to be seven screens of scrolling on a phone, with the
// resource board below the choices. Both are budgets, not pixel comparisons, so
// they fail on a layout regression rather than on a font hint.
test("mobile play screen keeps the decision reachable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.locator(".game-shell")).toBeVisible();
  // The debug overlay only exists in this harness, so it is not part of the budget.
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  const rail = page.locator(".resource-rail");
  await expect(rail).toBeVisible();
  const choicePanelTop = await page.locator("#choice-panel").evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
  // Budgets, not measurements: ratchet them down, never up. The screen was
  // 5,775px with the choices starting around y=2,600 before the layout pass.
  expect(choicePanelTop).toBeLessThan(844 * 2);
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  expect(pageHeight).toBeLessThan(844 * 5);
  await page.locator("#choice-panel").scrollIntoViewIfNeeded();
  await expect(rail).toBeInViewport();
});

// U-1: the console used to open 1,639px down an 844px screen and take 700ms of
// smooth scrolling to arrive, so a tap during the scroll landed on whatever slid
// past. It is fixed to the viewport on a phone now.
test("mobile commit console opens inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  });
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.locator(".game-shell")).toBeVisible();
  const track = await page.evaluate(async () => {
    document.querySelector(".choices .choice").click();
    const samples = [];
    for (let frame = 0; frame < 30; frame += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const button = document.querySelector("[data-testid='commit-confirm']");
      if (button) samples.push(Math.round(button.getBoundingClientRect().top));
    }
    return samples;
  });
  expect(track.length).toBeGreaterThan(0);
  expect(track[0]).toBeLessThan(844);
  expect(track.at(-1)).toBeLessThan(844);
  // Only the open animation may move it, never a scroll chasing it down the page.
  expect(Math.abs(track.at(-1) - track[0])).toBeLessThan(80);

  // Every row the console keeps is a choice card it hides, so its footprint is
  // a budget too: it was 356px and covered two cards including the selected one.
  // 240 until 2026-09-09, when the target-lock chips added a row; the covered
  // card count below is the harm the height was standing in for, and it went
  // from one card to none over the same change.
  const footprint = await page.evaluate(() => {
    const box = document.querySelector(".commit-console").getBoundingClientRect();
    const fullyCovered = [...document.querySelectorAll(".choices .choice")].filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1;
    }).length;
    return { height: Math.round(box.height), fullyCovered };
  });
  expect(footprint.height).toBeLessThan(260);
  expect(footprint.fullyCovered).toBeLessThanOrEqual(1);
});

test("intro mobile visual baseline @visual", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await stabilizeVisualPage(page);
  await expectCaptureGeometry(page, testInfo, "intro-mobile.png", { fullPage: true });
  await expect(page).toHaveScreenshot("intro-mobile.png", {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 500,
  });
});

// The two spec widths plus the three the layout has to survive between them.
for (const viewport of [
  { name: "desktop", width: 1366, height: 768 },
  { name: "laptop", width: 1280, height: 720 },
  { name: "mobile", width: 390, height: 844 },
  { name: "narrow phone", width: 320, height: 844 },
  { name: "large phone", width: 412, height: 915 },
]) {
  test(`intro start controls stay reachable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    const startButton = page.getByTestId("start-first-case");
    await expect(startButton).toBeVisible();
    const box = await startButton.boundingBox();
    expect(box?.y ?? Number.POSITIVE_INFINITY).toBeGreaterThanOrEqual(0);
    // Was "inside the document" until 2026-09-09, which an eight-screen intro
    // passed at y=3,000 on an 844px phone. The control the first click needs has
    // to be in the first viewport, so the viewport is the bound.
    expect((box?.y ?? 0) + (box?.height ?? Number.POSITIVE_INFINITY)).toBeLessThanOrEqual(viewport.height);
    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(horizontalOverflow).toBe(0);
  });
}

// Budget, not a measurement: ratchet it down, never up. The intro was 6,687px on
// a 390x844 screen -- 7.9 viewports -- against 3,953px for the play screen it was
// supposed to be the door to.
test("intro fits a phone reading budget", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  expect(pageHeight).toBeLessThan(844 * 4);
});
