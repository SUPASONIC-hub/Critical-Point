import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "./helpers/network.js";
import { completeCurrentCase, resumeSavedRun, startDebugNode, TRANSITION_TIMEOUT_MS, waitForEntrance } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";
import { savedRunAt, seedSave } from "./helpers/seededSave.js";
import { RESULT_CARD_FILE_NAME, RESULT_CARD_HEIGHT, RESULT_CARD_WIDTH } from "../src/resultCard.js";
import { RESULT_CARD_COPY } from "../src/resultCardCopy.js";
import { buildResultCardModel } from "../src/resultCardModel.js";

/**
 * The season's result card, from the buttons at the ending to the file.
 *
 * The unit tests (tests/unit/result-card.test.mjs) hold the model, the drawing
 * calls and the outcomes against stand-ins. These are the same things in a
 * browser: the chunk arrives, the game's own font draws a 1080x1350 PNG, and a
 * press hands that file to a download or to the share sheet.
 *
 * Windows Chrome has Web Share and the Linux Chromium CI runs has not, so no
 * test here leaves `navigator.share` as the platform made it: each one either
 * takes it away or puts its own in.
 *
 * `RESULT_CARD_OUT=<directory>` keeps the downloaded cards and two screenshots
 * of the buttons, for a person to look at. Nothing is written without it.
 */
const KEEP = process.env.RESULT_CARD_OUT;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const PLAYER = "SENTINEL-PLAYER-7Q";
const MESSAGE = "SENTINEL-MESSAGE-7Q";

// The @prod tests below would otherwise join the WebKit tier. They read the
// copied line back from the clipboard, and this project's WebKit is given no
// clipboard permission (playwright.config.js), so they are skipped there, not
// passed: Safari is checked by hand on a phone.
test.skip(({ browserName }) => browserName === "webkit", "the clipboard cannot be read back on Playwright WebKit");

test.beforeEach(async ({ page }) => {
  // Reduced motion drops the ending's eight-second hold.
  await page.emulateMedia({ reducedMotion: "reduce" });
});

async function withoutWebShare(page) {
  await page.addInitScript(() => {
    delete Navigator.prototype.share;
    delete Navigator.prototype.canShare;
  });
}

/**
 * A share sheet that takes any file and writes down what it was handed.
 * `__shareMode` is what the next call does: "ok", "abort" (the player closed
 * the sheet) or "fail" (the platform refused).
 */
async function withRecordedWebShare(page) {
  await page.addInitScript(() => {
    window.__shares = [];
    window.__shareMode = "ok";
    Object.defineProperty(Navigator.prototype, "canShare", {
      configurable: true,
      writable: true,
      value: (data) => Boolean(data?.files?.length),
    });
    Object.defineProperty(Navigator.prototype, "share", {
      configurable: true,
      writable: true,
      value: (data) => {
        window.__shares.push({ text: data.text, files: (data.files ?? []).map((file) => ({ name: file.name, type: file.type, size: file.size })) });
        if (window.__shareMode === "abort") return Promise.reject(new DOMException("The share sheet was closed.", "AbortError"));
        if (window.__shareMode === "fail") return Promise.reject(new DOMException("The platform refused.", "NotAllowedError"));
        return Promise.resolve();
      },
    });
  });
}

/** From the season's last scene to the step where the record opens (step 3). */
async function openTheRecord(page) {
  await completeCurrentCase(page);
  const ending = page.locator(".ending-sequence");
  await expect(ending).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  // Three records, each under the same 다음.
  for (let twist = 0; twist < 3; twist += 1) {
    await expect(ending).toHaveClass(/ending-step-0/);
    await ending.locator("button").click();
  }
  await expect(page.locator(".ending-step-1")).toBeVisible();
  await page.getByTestId("ending-next").click();
  await page.locator(".ending-step-2 textarea").fill(MESSAGE);
}

/** The last press: 기록 남기기 opens the record, and the card starts being made. */
async function leaveTheMessage(page) {
  await page.locator(".ending-step-2 button").click();
  await expect(page.locator(".ending-step-3")).toBeVisible();
}

async function reachTheRecordByDebugJump(page) {
  await startDebugNode(page, "final", "f_aftershock");
  await openTheRecord(page);
  await leaveTheMessage(page);
}

function cardControls(page) {
  const block = page.locator(".ending-step-3 .ending-beat");
  return {
    block,
    share: block.getByRole("button", { name: RESULT_CARD_COPY.shareLabel }),
    save: block.getByRole("button", { name: RESULT_CARD_COPY.saveLabel }),
    status: block.locator("[role='status']"),
  };
}

async function expectCardReady(page) {
  const { save, status } = cardControls(page);
  await expect(save).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(save, "the card is held, so the button is ready").not.toHaveAttribute("aria-disabled", "true", { timeout: TRANSITION_TIMEOUT_MS });
  await expect(status).toHaveText("");
}

/** What the page's tokens paint, read the way the card reads them: through a canvas. */
async function readCardPixels(page, file) {
  return page.evaluate(async (base64) => {
    const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
    const bitmap = await createImageBitmap(new Blob([bytes], { type: "image/png" }));
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(bitmap, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const at = (x, y) => Array.from(data.slice((y * canvas.width + x) * 4, (y * canvas.width + x) * 4 + 3)).join(",");
    const colours = new Set();
    for (let y = 0; y < canvas.height; y += 5) for (let x = 0; x < canvas.width; x += 5) colours.add(at(x, y));
    const tokens = getComputedStyle(document.documentElement);
    const painted = (token) => {
      const probe = document.createElement("canvas");
      probe.width = 1;
      probe.height = 1;
      const probeCtx = probe.getContext("2d");
      probeCtx.fillStyle = tokens.getPropertyValue(token).trim();
      probeCtx.fillRect(0, 0, 1, 1);
      return Array.from(probeCtx.getImageData(0, 0, 1, 1).data.slice(0, 3)).join(",");
    };
    return {
      width: bitmap.width,
      height: bitmap.height,
      colours: colours.size,
      // The corner is ground; (540, 141) is on the hairline under the top strip.
      corner: at(12, 12),
      hairline: at(540, 141),
      ground: painted("--c-gx-felt"),
      accent: painted("--c-acid"),
      heat: painted("--c-gx-heat"),
    };
  }, readFileSync(file).toString("base64"));
}

/** The download is a card: named, a PNG of the card's size, and drawn on. */
async function expectCardFile(page, download, { failure = false, keepAs } = {}) {
  expect(download.suggestedFilename()).toBe(RESULT_CARD_FILE_NAME);
  const file = await download.path();
  const bytes = readFileSync(file);
  expect([...bytes.subarray(0, 8)], "a PNG signature").toEqual(PNG_SIGNATURE);
  expect({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }, "the size its header declares").toEqual({ width: RESULT_CARD_WIDTH, height: RESULT_CARD_HEIGHT });
  const pixels = await readCardPixels(page, file);
  expect({ width: pixels.width, height: pixels.height }, "the size it decodes to").toEqual({ width: RESULT_CARD_WIDTH, height: RESULT_CARD_HEIGHT });
  expect(pixels.colours, "text was drawn: a flat rectangle has a handful of colours").toBeGreaterThan(40);
  expect(pixels.corner, "the ground is the table's felt").toBe(pixels.ground);
  expect(pixels.hairline, failure ? "the collapse ending is drawn in the wall's colour" : "the hairline is the accent").toBe(failure ? pixels.heat : pixels.accent);
  if (KEEP && keepAs) {
    mkdirSync(KEEP, { recursive: true });
    writeFileSync(path.join(KEEP, keepAs), bytes);
  }
  return bytes;
}

/** The block the buttons are in, at a phone's width and a laptop's, when a person asked to keep them. */
async function keepScreenshots(page, testInfo, label) {
  if (!KEEP) return;
  const { block } = cardControls(page);
  const before = page.viewportSize();
  mkdirSync(KEEP, { recursive: true });
  for (const [width, height] of [[390, 844], [1366, 768]]) {
    await page.setViewportSize({ width, height });
    await block.scrollIntoViewIfNeeded();
    await block.screenshot({ path: path.join(KEEP, `${label}-${width}x${height}-${testInfo.project.name}.png`) });
  }
  await page.setViewportSize(before);
}

/** The copied line, as `buildShareText` writes it for this page's season. */
async function expectedShareLine(page) {
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  const { bestBurst, bestRank } = buildResultCardModel({ caseResults: saved.caseResults });
  const modeTitle = await page.locator(".result-why-grid article").nth(1).locator("strong").innerText();
  const origin = new URL(page.url()).origin;
  const pattern = new RegExp(`^트리거랩에서 한 시즌을 끝냈습니다\\. 판단 DNA는 '${modeTitle}', 결말은 '[^']+'\\. 최고 버스트 ${bestBurst}점, ${bestRank} 랭크\\. ${origin}/$`);
  return { pattern, bestBurst, bestRank };
}

test("결과 카드 저장 downloads a drawn 1080x1350 card and copies its line", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await withoutWebShare(page);
  await reachTheRecordByDebugJump(page);
  const { block, share, save, status } = cardControls(page);
  await expectCardReady(page);
  // No share sheet on this platform, so one button.
  await expect(share).toHaveCount(0);
  await expect(block.locator("small").filter({ hasText: RESULT_CARD_COPY.note })).toBeVisible();

  // The step no audit had reached, with the buttons on it.
  await waitForEntrance(page.locator(".ending-sequence"));
  const audit = await new AxeBuilder({ page }).analyze();
  expect(audit.violations).toEqual([]);
  const overflow = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(overflow.scrollWidth, "the buttons do not widen the page").toBeLessThanOrEqual(overflow.clientWidth + 1);

  // By keyboard: the button takes focus and Enter presses it.
  await save.focus();
  await expect(save).toBeFocused();
  const downloading = page.waitForEvent("download");
  await page.keyboard.press("Enter");
  const download = await downloading;
  await expect(status).toHaveText(RESULT_CARD_COPY.saved);
  await expectCardFile(page, download, { keepAs: `ending-normal-${testInfo.project.name}.png` });

  const line = await expectedShareLine(page);
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toMatch(line.pattern);
  expect(copied).not.toContain(MESSAGE);

  await keepScreenshots(page, testInfo, "buttons-after-save");
});

// The way a returning player arrives, so the production build runs it too: no
// debug jump. The save carries a name and the walk leaves a message, and
// neither may reach what is saved or copied.
for (const season of [
  { title: "a season with one closed case", keepAs: "ending-seeded-near-empty", overrides: {} },
  { title: "a season that collapsed", keepAs: "ending-collapse", failure: true, overrides: { resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 96, fatigue: 10 } } },
]) {
  test(`a resumed save makes its card without the player's name or message: ${season.title}`, { tag: "@prod" }, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(String(error)));
    await withoutWebShare(page);
    await seedSave(page, savedRunAt("final", "f_aftershock", { playerName: PLAYER, ...season.overrides }));
    await page.goto("/");
    await resumeSavedRun(page);
    await openTheRecord(page);
    await leaveTheMessage(page);
    await expectCardReady(page);
    await expect(page.locator(".ending-variant-panel.failure"), "which ending the season reached").toHaveCount(season.failure ? 1 : 0);
    // The name is on this screen -- the report's eyebrow prints it -- and not on the card.
    await expect(page.locator(".result-hero-copy > p")).toContainText(PLAYER);

    const { save, status } = cardControls(page);
    const downloading = page.waitForEvent("download");
    await save.click();
    const download = await downloading;
    await expect(status).toHaveText(RESULT_CARD_COPY.saved);
    const bytes = await expectCardFile(page, download, { failure: Boolean(season.failure), keepAs: `${season.keepAs}-${testInfo.project.name}.png` });
    for (const sentinel of [PLAYER, MESSAGE]) expect(bytes.includes(Buffer.from(sentinel)), `${sentinel} in the file's bytes`).toBe(false);

    const line = await expectedShareLine(page);
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(line.pattern);
    expect(copied).not.toContain(PLAYER);
    expect(copied).not.toContain(MESSAGE);
    expect(pageErrors).toEqual([]);
  });
}

test("결과 카드 공유 hands one PNG and the line to the share sheet, and only saves when the platform refuses", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await withRecordedWebShare(page);
  const downloads = [];
  page.on("download", (download) => downloads.push(download));
  await reachTheRecordByDebugJump(page);
  const { share, save, status } = cardControls(page);
  await expectCardReady(page);
  await expect(share).toBeVisible();
  await expect(share).not.toHaveAttribute("aria-disabled", "true");
  await keepScreenshots(page, testInfo, "buttons-ready");

  // 공유 first, 저장 after it, one Tab apart.
  await share.focus();
  await page.keyboard.press("Tab");
  await expect(save).toBeFocused();

  // Shared: the sheet got one file and the line, and nothing was downloaded.
  await share.click();
  await expect(status).toHaveText(RESULT_CARD_COPY.shared);
  const line = await expectedShareLine(page);
  const shares = await page.evaluate(() => window.__shares);
  expect(shares).toHaveLength(1);
  expect(shares[0].text).toMatch(line.pattern);
  expect(shares[0].files).toHaveLength(1);
  expect(shares[0].files[0]).toMatchObject({ name: RESULT_CARD_FILE_NAME, type: "image/png" });
  expect(shares[0].files[0].size, "a drawn card, not an empty file").toBeGreaterThan(10_000);

  // Closed by the player: no news, no error, no download.
  await page.evaluate(() => (window.__shareMode = "abort"));
  await share.click();
  await expect.poll(() => page.evaluate(() => window.__shares.length)).toBe(2);
  await expect(status).toHaveText("");
  await expect(share).not.toHaveAttribute("aria-disabled", "true");
  expect(downloads, "nothing was downloaded by a share or by a closed sheet").toHaveLength(0);

  // Refused by the platform: the card is not lost, it is downloaded instead.
  await page.evaluate(() => (window.__shareMode = "fail"));
  const downloading = page.waitForEvent("download");
  await share.click();
  const download = await downloading;
  await expect(status).toHaveText(RESULT_CARD_COPY.saved);
  await expectCardFile(page, download);
  await expect.poll(() => page.evaluate(() => window.__shares.length)).toBe(3);

  // 저장 beside a working share sheet still downloads, and does not open the sheet.
  await page.evaluate(() => (window.__shareMode = "ok"));
  const savingToo = page.waitForEvent("download");
  await save.click();
  await savingToo;
  await expect(status).toHaveText(RESULT_CARD_COPY.saved);
  expect(await page.evaluate(() => window.__shares.length), "저장 did not open the share sheet").toBe(3);
  expect(downloads).toHaveLength(2);
});

test("the buttons wait for the card, say when it could not be made, and a press makes it again", async ({ page }) => {
  test.setTimeout(120_000);
  await withoutWebShare(page);
  // The canvas answers when the test lets it, and with nothing while told to fail.
  await page.addInitScript(() => {
    const toBlob = HTMLCanvasElement.prototype.toBlob;
    window.__card = { hold: true, fail: true, asked: 0, release: null };
    HTMLCanvasElement.prototype.toBlob = function (callback, ...rest) {
      window.__card.asked += 1;
      const answer = () => (window.__card.fail ? callback(null) : toBlob.call(this, callback, ...rest));
      if (window.__card.hold) window.__card.release = answer;
      else answer();
    };
  });
  const downloads = [];
  page.on("download", (download) => downloads.push(download));
  await reachTheRecordByDebugJump(page);
  const { save, status } = cardControls(page);

  // Not ready: said so, still in the tab order, and a press does nothing.
  await expect(save).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(save).toHaveAttribute("aria-disabled", "true");
  await expect(status).toHaveText(RESULT_CARD_COPY.making);
  await expect.poll(() => page.evaluate(() => window.__card.asked), "the card is being made before any press").toBe(1);
  await save.focus();
  await expect(save).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(status).toHaveText(RESULT_CARD_COPY.making);
  expect(await page.evaluate(() => window.__card.asked)).toBe(1);

  // The canvas gives nothing back.
  await page.evaluate(() => {
    window.__card.hold = false;
    window.__card.release();
  });
  await expect(status).toHaveText(RESULT_CARD_COPY.failed);
  await expect(save, "the button can be pressed to try again").not.toHaveAttribute("aria-disabled", "true");
  expect(downloads, "nothing was downloaded while there was no card").toHaveLength(0);

  // The press the message asks for: the card is made again and saved.
  await page.evaluate(() => (window.__card.fail = false));
  const downloading = page.waitForEvent("download");
  await save.click();
  const download = await downloading;
  await expect(status).toHaveText(RESULT_CARD_COPY.saved);
  await expectCardFile(page, download);
  expect(await page.evaluate(() => window.__card.asked)).toBe(2);
});
