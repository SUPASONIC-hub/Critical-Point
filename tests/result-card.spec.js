import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "./helpers/network.js";
import { cashStakedCard, clickElement, completeCurrentCase, dismissProtocolBreach, resumeSavedRun, startDebugNode, TRANSITION_TIMEOUT_MS, waitForEntrance } from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";
import { ACCESSIBILITY_SETTINGS_KEY, FRIEND_TARGET_KEY } from "../src/appConfig.js";
import { fill } from "../src/locale.js";
import { savedRunAt, seedSave } from "./helpers/seededSave.js";
import { createCaseSummary, getSeasonLogic } from "../src/gameLogic.js";
import { formatMoney } from "../src/gameConstants.js";
import { PAY_LADDER } from "../src/gauntlet/settlementPay.js";
import resultCopy from "../src/copy/result.js";
import { RESULT_CARD_FILE_NAME, RESULT_CARD_HEIGHT, RESULT_CARD_WIDTH } from "../src/resultCard.js";
import { RESULT_CARD_COPY } from "../src/resultCardCopy.js";
import { LOGIC_REPORT_COPY } from "../src/logicReport.js";
import { buildResultCardModel } from "../src/resultCardModel.js";
import reportLinesCopy from "../src/copy/reportLines.js";
import { getJudgementHabit, habitCardLine } from "../src/judgementHabit.js";

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
    // The band the 논리 유지력 line is set in, between the longest ending and the cells.
    const ground = at(12, 12);
    let logicInk = 0;
    for (let y = 942; y < 976; y += 1) for (let x = 80; x < 540; x += 1) if (at(x, y) !== ground) logicInk += 1;
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
      logicInk,
      // The corner is ground; (540, 141) is on the hairline under the top strip.
      corner: at(12, 12),
      hairline: at(540, 141),
      ground: painted("--ui-surface-1"),
      accent: painted("--c-acid"),
      heat: painted("--c-gx-heat"),
    };
  }, readFileSync(file).toString("base64"));
}

/** The download is a card: named, a PNG of the card's size, and drawn on. */
async function expectCardFile(page, download, { failure = false, logic, keepAs } = {}) {
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
  if (logic !== undefined) expect(pixels.logicInk > 0, logic ? "the 논리 유지력 line is drawn over the cells" : "a season without the score has nothing over the cells").toBe(logic);
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

/** The copied line, as `buildShareText` writes it for this page's season, and the season's 논리 유지력 if it has one. */
async function expectedShareLine(page) {
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  const { bestBurst, bestRank } = buildResultCardModel({ caseResults: saved.caseResults });
  const { logicHold } = getSeasonLogic(saved.caseResults);
  // The card names the season's 판단 습관 when it has one (judgementHabit.js):
  // the copied line then says it in one sentence after the record (D1) and
  // its 판단 DNA is the DNA's own title, which the report does not print when
  // there is a habit. Without one the 판단 DNA is the title the report prints.
  const habit = getJudgementHabit(saved.caseResults);
  const modeTitle = habit ? "[^']+" : await page.locator(".result-why-grid article").nth(1).locator("strong").innerText();
  const tail = habit ? ` ${habitCardLine(habit).replace(/[.「」]/g, "\\$&")}` : "";
  const origin = new URL(page.url()).origin;
  const pattern = new RegExp(`^「임계점: CRITICAL POINT」에서 한 시즌을 끝냈습니다\\. 판단 DNA는 '${modeTitle}', 결말은 '[^']+'\\. 최고 버스트 ${bestBurst}점, ${bestRank} 랭크\\.${tail} ${origin}/\\?from=card${habit ? `&h=${habit.id}` : ""}${bestBurst > 0 ? `&s=${bestBurst}` : ""}$`);
  return { pattern, bestBurst, bestRank, logicHold };
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
  // The card has no room for the habit's line; the report's 당신이 반복한 방식 box draws it under the name.
  const habit = getJudgementHabit((await readJsonStorage(page, TEST_STORAGE_KEYS.save)).caseResults);
  if (habit) await expect(page.locator(".result-why-grid article").nth(1).locator("p").first()).toHaveText(habit.line);

  await keepScreenshots(page, testInfo, "buttons-after-save");
});

/**
 * N32: a device that came from a friend's card keeps the friend's best burst
 * (src/friendTarget.js); the ending says beside the buttons whether this
 * season beat it. Said, not drawn: the card and its copied line are as before.
 */
test("a kept friend's record is measured against the season beside the card", async ({ page }) => {
  test.setTimeout(120_000);
  await withoutWebShare(page);
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({ habit: "moth", score: 1, at: Date.now() }));
  }, FRIEND_TARGET_KEY);
  await reachTheRecordByDebugJump(page);
  await expectCardReady(page);
  const { bestBurst } = await expectedShareLine(page);
  const said = page.getByTestId("friend-target-result");
  const standing = bestBurst > 1 ? fill(RESULT_CARD_COPY.friendBeaten, { score: 1, mine: bestBurst }) : fill(RESULT_CARD_COPY.friendShort, { score: 1, mine: bestBurst, gap: 2 - bestBurst });
  await expect(said).toHaveText(standing);
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
    const line = await expectedShareLine(page);
    const bytes = await expectCardFile(page, download, { failure: Boolean(season.failure), logic: line.logicHold !== undefined, keepAs: `${season.keepAs}-${testInfo.project.name}.png` });
    for (const sentinel of [PLAYER, MESSAGE]) expect(bytes.includes(Buffer.from(sentinel)), `${sentinel} in the file's bytes`).toBe(false);

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(line.pattern);
    expect(copied).not.toContain(PLAYER);
    expect(copied).not.toContain(MESSAGE);
    expect(pageErrors).toEqual([]);
  });
}

// C2-1 and C3 (2026-11-11): a season that lost cash and kept people, closed on
// 폭로 (f_after_witness, staked by its words: the hand is dealt shuffled). The
// ending is the one the ruling gave; the panel only gains words: the 폭로
// paragraph after the ending's own and the nearest other ending under it.
test("a held season closed on 폭로 prints the 폭로 paragraph and the nearest other ending, and its card is made", { tag: "@prod" }, async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  await withoutWebShare(page);
  await seedSave(page, savedRunAt("final", "f_aftershock", { resources: { time: 72, capital: 40, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 } }));
  await page.goto("/");
  await resumeSavedRun(page);
  await dismissProtocolBreach(page);
  await clickElement(page.locator(".choices .choice").filter({ hasText: "외부 증언을 준비한다" }), "f_after_witness");
  await cashStakedCard(page);
  const reveal = page.getByTestId("decision-next");
  await expect(reveal.or(page.locator(".ending-sequence")).first()).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  if (await reveal.isVisible()) await reveal.click();
  await openTheRecord(page);
  await leaveTheMessage(page);
  await expectCardReady(page);
  const panel = page.locator(".ending-variant-panel");
  await expect(panel).toHaveCount(1);
  await expect(panel).not.toHaveClass(/failure/);
  await expect(page.getByTestId("standing-held"), "the season is a held one").toHaveCount(1);
  await expect(page.getByTestId("ending-witness")).toHaveText(reportLinesCopy.witnessHeld);
  await expect(page.getByTestId("ending-nearest")).toHaveText(/^가장 가까웠던 다른 결말: [A-Z]+(?: [A-Z]+)*까지 .+$/);

  const { save, status } = cardControls(page);
  const downloading = page.waitForEvent("download");
  await save.click();
  const download = await downloading;
  await expect(status).toHaveText(RESULT_CARD_COPY.saved);
  await expectCardFile(page, download, { keepAs: `ending-held-witness-${testInfo.project.name}.png` });
  expect(pageErrors).toEqual([]);
});

// The card's 논리 유지력 is the report's: both read the season's stored
// summaries, so the number the panel prints is the one the card was given, and
// the line is on the card exactly when the panel has a score. A story-mode
// season keeps it, as it keeps its score cells.
for (const season of [
  { title: "a season with a logic record", keepAs: "ending-logic", extra: {} },
  { title: "a story-mode season", keepAs: "ending-logic-story", extra: { assistStory: true } },
]) {
  test(`the card carries the 논리 유지력 the closing report prints: ${season.title}`, { tag: "@prod" }, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    await withoutWebShare(page);
    const record = (logicRecord) => ({ burstScore: 64, rank: "B", ...season.extra, logicRecord: { windows: 8, heat: 6, peak: 2, top: ["risk", 5], grows: 2, switches: 1, breaks: 0, busts: 0, keeps: 0, best: 3, ...logicRecord } });
    await seedSave(page, savedRunAt("final", "f_aftershock", { caseResults: { case01: record({ breaks: 2 }), case02: record({ busts: 1, keeps: 1, best: 7 }) } }));
    await page.goto("/");
    await resumeSavedRun(page);
    await openTheRecord(page);
    await leaveTheMessage(page);
    await expectCardReady(page);

    const line = await expectedShareLine(page);
    expect(line.logicHold, "the season has a score from 0 to 100").toBeGreaterThanOrEqual(0);
    expect(line.logicHold).toBeLessThan(100);
    await expect(page.getByTestId("logic-report").locator("p").nth(1)).toContainText(LOGIC_REPORT_COPY.hold(line.logicHold));
    await expect(page.locator(".result-hero-copy > p").filter({ hasText: "스토리 모드" })).toHaveCount(season.extra.assistStory ? 1 : 0);

    const { save, status } = cardControls(page);
    const downloading = page.waitForEvent("download");
    await save.click();
    const download = await downloading;
    await expect(status).toHaveText(RESULT_CARD_COPY.saved);
    await expectCardFile(page, download, { logic: true, keepAs: `${season.keepAs}-${testInfo.project.name}.png` });
    // The copied line is the one it was: the score is on the card only.
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toMatch(line.pattern);
    expect(copied).not.toContain(LOGIC_REPORT_COPY.label);
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

// N23 (2026-11-16): the report of 사건 01 to 17 says where it stands in its act
// and how far the next 중간 결산 is; 사건 07's, at the end of 1막, carries the N1
// tally in its small form -- the three rows, no note and no share buttons.
async function closeDebugCaseToReport(page, caseId, nodeId) {
  await startDebugNode(page, caseId, nodeId);
  await completeCurrentCase(page);
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".result-page")).toBeVisible({ timeout: 30_000 });
}

test("사건 03's report says 1막 · 3/7 and how far the 중간 결산 is, with no tally", async ({ page }) => {
  test.setTimeout(120_000);
  await closeDebugCaseToReport(page, "case03", "c3_aftershock");
  await expect(page.getByTestId("act-progress")).toHaveText("1막 · 3/7 · 중간 결산까지 4사건");
  await expect(page.getByTestId("act-tally")).toHaveCount(0);
  // N42 (2026-11-18): the foot of the report says the season is saved and what
  // comes next; the install button only once the browser offers an install.
  const leave = page.getByTestId("leave-line");
  await expect(leave).toHaveText("쉬어도 저장됩니다 · 다음: 사건 04 - 치러야 할 대가 (약 10분)");
  expect(await page.locator(".result-page > [data-testid='leave-line']:last-child").count()).toBe(1);
  await expect(page.getByTestId("leave-line-install")).toHaveCount(0);
  await page.evaluate(() => {
    const event = new Event("beforeinstallprompt");
    event.prompt = () => {
      window.__installPrompted = true;
      return Promise.resolve();
    };
    window.dispatchEvent(event);
  });
  await clickElement(page.getByTestId("leave-line-install"), "add to the home screen from the report");
  expect(await page.evaluate(() => window.__installPrompted)).toBe(true);
  await expect(page.getByTestId("leave-line-install")).toHaveCount(0);
});

test("사건 07's report closes 1막 with the small 중간 결산", async ({ page }) => {
  test.setTimeout(120_000);
  await closeDebugCaseToReport(page, "case07", "c7_aftershock");
  await expect(page.getByTestId("act-progress")).toHaveText("1막 · 7/7 · 중간 결산은 아래에");
  const tally = page.getByTestId("act-tally");
  await expect(tally).toBeVisible();
  await expect(tally.getByRole("heading")).toHaveText("중간 결산 · 1막 끝 · 사건 07");
  await expect(tally.getByTestId("act-tally-habit")).not.toBeEmpty();
  await expect(tally.getByTestId("act-tally-ending")).not.toBeEmpty();
  await expect(tally.locator(".gx-tally-note")).toHaveCount(0);
  await expect(tally.getByRole("button")).toHaveCount(0);
  await expect(page.getByTestId("leave-line")).toHaveText("쉬어도 저장됩니다 · 다음: 사건 08 - 돈의 흔적 (약 10분)");
  const results = await new AxeBuilder({ page }).include("[data-testid='act-tally']").include("[data-testid='leave-line']").analyze();
  expect(results.violations).toEqual([]);
});

// G34 보상금 (RULES_MARK 9, CaseCover.jsx): a case that closed on people hurt
// can be paid off from the KD은행 계좌 on its report. 사건 01's last scene moves
// no harm, so the case closes on the harm the save was seeded with.
const COVER_HARM = 24;
const COVER_RESOURCES = { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: COVER_HARM, fatigue: 10 };
const COVER_COST = PAY_LADDER[0];
const withLang = (url, lang) => (lang === "ko" ? url : `${url}${url.includes("?") ? "&" : "?"}lang=${lang}`);

/** A seeded run on 사건 01's last scene, closed to its report; the save once the close is in it. */
async function closeCaseOneOnHarm(page, { vault, dynamics = {}, lang = "ko", ...overrides }) {
  await seedSave(page, savedRunAt("case01", "c1_aftershock", { resources: COVER_RESOURCES, dynamics: { vault, ...dynamics }, ...overrides }));
  await page.goto(withLang("/", lang));
  await resumeSavedRun(page);
  await completeCurrentCase(page);
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await expect(page.locator(".result-page")).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(async () => Boolean((await readJsonStorage(page, TEST_STORAGE_KEYS.save))?.caseResults?.case01), { message: "사건 01 is in the save" })
    .toBe(true);
  const save = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(save.caseResults.case01.finalHumanCost, "the case closed on the seeded harm").toBe(COVER_HARM);
  return save;
}

test("a case closed on harm offers 보상금 on its report, and paying it takes the price from the 계좌", async ({ page }) => {
  test.setTimeout(120_000);
  const closed = await closeCaseOneOnHarm(page, { vault: 50_000 });
  const vault = closed.dynamics.vault;
  expect(vault, "the 계좌 holds the price").toBeGreaterThanOrEqual(COVER_COST);
  const line = page.locator(".outcome-panel").getByTestId("case-cover");
  await expect(line).toHaveCount(1);
  await expect(line.locator("span:not([role='status'])")).toHaveText(fill(resultCopy.cover.offer, { cost: formatMoney(COVER_COST), harm: COVER_HARM }));
  await expect(line.locator("small")).toHaveText(resultCopy.cover.record);
  const pay = line.getByTestId("case-cover-pay");
  await expect(pay).toHaveText(resultCopy.cover.pay);
  await expect(pay).not.toHaveAttribute("aria-disabled", "true");
  // The polite live region is on the page, empty, before the press: the paid line lands in it and is heard once.
  const status = line.getByRole("status");
  await expect(status).toHaveCount(1);
  await expect(status).toHaveAttribute("aria-live", "polite");
  await expect(status).toBeEmpty();
  await status.evaluate((node) => (node.dataset.e2eKept = "1"));

  await clickElement(pay, "pay the case's 보상금");
  await expect(status).toHaveText(fill(resultCopy.cover.paid, { cost: formatMoney(COVER_COST), harm: COVER_HARM, covers: 1 }));
  await expect(status, "the same live region, not a new one mounted with the text").toHaveAttribute("data-e2e-kept", "1");
  await expect(line).toHaveText(fill(resultCopy.cover.paid, { cost: formatMoney(COVER_COST), harm: COVER_HARM, covers: 1 }));
  await expect(page.getByTestId("case-cover-pay")).toHaveCount(0);
  await expect
    .poll(async () => (await readJsonStorage(page, TEST_STORAGE_KEYS.save))?.caseResults?.case01?.covered ?? null)
    .toEqual({ cost: COVER_COST, harm: COVER_HARM });
  const paid = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(paid.dynamics.vault, "the 계좌 dropped by the price").toBe(vault - COVER_COST);
  expect(paid.dynamics.seasonSpent).toBe((closed.dynamics.seasonSpent ?? 0) + COVER_COST);
  expect(paid.dynamics.paid).toMatchObject({ caseId: "case01", cost: COVER_COST, harm: COVER_HARM });
  expect(paid.caseResults.case01.finalHumanCost, "the harm is kept as the case closed on it").toBe(COVER_HARM);
});

test("paying 보상금 with Enter hands focus to the next case's button, not <body>", async ({ page }) => {
  test.setTimeout(120_000);
  await closeCaseOneOnHarm(page, { vault: 50_000 });
  const line = page.locator(".outcome-panel").getByTestId("case-cover");
  const pay = line.getByTestId("case-cover-pay");
  await pay.focus();
  await expect(pay).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(pay).toHaveCount(0);
  await expect(line.getByRole("status")).toHaveText(fill(resultCopy.cover.paid, { cost: formatMoney(COVER_COST), harm: COVER_HARM, covers: 1 }));
  // The paid line itself is not the target: focus there would read the payment again over its live region.
  await expect(page.getByTestId("next-case-button")).toBeFocused();
  expect(await page.evaluate(() => document.activeElement?.dataset?.testid ?? document.activeElement?.tagName)).toBe("next-case-button");
});

test("with too little in the 계좌 the 보상금 button says so, is off, and a press pays nothing", async ({ page }) => {
  test.setTimeout(120_000);
  const closed = await closeCaseOneOnHarm(page, { vault: 0 });
  expect(closed.dynamics.vault, "the close banked less than the price").toBeLessThan(COVER_COST);
  const line = page.locator(".outcome-panel").getByTestId("case-cover");
  const pay = line.getByTestId("case-cover-pay");
  await expect(pay).toHaveText(resultCopy.cover.short);
  await expect(pay).toHaveAttribute("aria-disabled", "true");

  // Forced: Playwright waits for an aria-disabled control to turn on; a finger presses it anyway.
  await pay.click({ force: true });
  await expect(line.locator("span:not([role='status'])")).toHaveText(fill(resultCopy.cover.offer, { cost: formatMoney(COVER_COST), harm: COVER_HARM }));
  await expect(pay).toHaveAttribute("aria-disabled", "true");
  const after = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(after.caseResults.case01.covered ?? null, "nothing was paid").toBeNull();
  expect(after.dynamics.vault).toBe(closed.dynamics.vault);
  expect(after.dynamics.paid ?? null).toBeNull();
});

for (const mode of [
  // Story mode is the device's setting, and the run carries it from the case's open.
  { title: "story mode", settings: { storyMode: true }, dynamics: { story: true }, overrides: {} },
  // A closed case played again: the replay's 계좌 is lent, and its report pays nothing.
  // The close hands the lent run back (endPractice), so the report reads the replay
  // off the closing entry's `firstRecord`, the first close's record the replay carried.
  {
    title: "a replay (practice)",
    dynamics: { practice: { vault: 50_000, record: { cashes: 8, busts: 0 } } },
    overrides: { completedCases: ["case01"], caseResults: { case01: createCaseSummary({}, {}, [{ caseId: "case01" }], { resources: COVER_RESOURCES, schemaVersion: 2 }) } },
  },
]) {
  test(`a case closed on harm in ${mode.title} has no 보상금 line @once`, async ({ page }) => {
    test.setTimeout(120_000);
    if (mode.settings) {
      await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify(mode.settings) });
    }
    const closed = await closeCaseOneOnHarm(page, { vault: 50_000, dynamics: mode.dynamics, ...mode.overrides });
    if (mode.dynamics.story) expect(closed.dynamics.story, "the run closed in story mode").toBe(true);
    if (mode.dynamics.practice) {
      expect(closed.dynamics.practice, "the replay handed its lent run back as it closed").toBeNull();
      expect(closed.log.some((entry) => entry?.threshold?.firstRecord), "the closing entry says it was a replay").toBe(true);
      expect(closed.dynamics.vault, "the 계좌 would hold the price").toBeGreaterThanOrEqual(COVER_COST);
    }
    await expect(page.locator(".outcome-panel").getByTestId("season-standing")).toBeVisible();
    await expect(page.getByTestId("case-cover")).toHaveCount(0);
    await expect(page.getByTestId("case-cover-pay")).toHaveCount(0);
  });
}

// The line on a 360px phone, in each language: the offer (and the 계좌 부족
// button, the longest of its words) and the paid line wrap inside the page,
// and the button is a finger's 44px tall (accessibility.spec.js's rule).
for (const lang of ["ko", "en", "ja"]) {
  for (const afford of [true, false]) {
    test(`the 보상금 line fits a 360x740 phone with no sideways scroll: ${lang}, ${afford ? "offer and paid" : "계좌 부족"} @once`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width: 360, height: 740 });
      await closeCaseOneOnHarm(page, { vault: afford ? 50_000 : 0, lang });
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      const line = page.locator(".outcome-panel").getByTestId("case-cover");
      const pay = line.getByTestId("case-cover-pay");
      await expect(pay).toBeVisible();
      const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
      expect(await fits(), "nothing is wider than the screen beside the offer").toBe(true);
      const box = await pay.boundingBox();
      expect(box.height, "the button is a finger's height").toBeGreaterThanOrEqual(44);
      expect(box.x, "the button starts on the screen").toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, "the button ends on the screen").toBeLessThanOrEqual(361);
      const lineBox = await line.boundingBox();
      expect(lineBox.x + lineBox.width, "the line ends on the screen").toBeLessThanOrEqual(361);
      if (!afford) return;
      await clickElement(pay, "pay the case's 보상금");
      await expect(pay).toHaveCount(0);
      await expect(line).toContainText(formatMoney(COVER_COST));
      expect(await fits(), "nothing is wider than the screen beside the paid line").toBe(true);
    });
  }
}
