import { expect, test } from "./helpers/network.js";
import { CASE_SEQUENCE, CASE_START_NODES, caseOpeningRoutes, nodeOrders, nodes } from "../src/gameData.js";
import {
  ACTION_TIMEOUT_MS,
  chooseSceneChoice,
  clickElement,
  collectRuntimeErrors,
  completeCase,
  createSeededRandom,
  dismissProtocolBreach,
  startDebugNode,
  TRANSITION_TIMEOUT_MS,
} from "./helpers/gameFlow.js";
import { readJsonStorage, TEST_STORAGE_KEYS, writeJsonStorage } from "./helpers/storage.js";

/**
 * The weekly tier (`npm run test:e2e:full`): what is too slow to gate a push.
 *
 * Every budget here is derived from the season, not written down. They were
 * literals once -- 45 minutes for every scene-choice pair, 12 for a season, 10
 * for the reload walk -- set when the season was twelve cases, and at
 * fifty-five none of them could be met: the pairs alone are about four
 * thousand. The walks are split so that a run can be sharded (one test a case,
 * one a seed), and each test's timeout is what its own size needs.
 */
// Measured 2026-09-28 on a busy desktop, one worker: see the numbers in
// .github/workflows/full-coverage.yml. The allowances are about three times
// the measured cost, so a slow runner finishes and a hung one does not take
// the whole job's time with it.
const SECONDS_PER_PAIR = 20;
const SECONDS_PER_CASE_WALKED = 90;
// A seeded season plays every case, so its cost grows with the season. Twenty
// seeds were chosen when that was twelve cases (240 cases played); the count
// keeps the cases played at about that.
const SEEDED_SEASONS = Math.max(4, Math.round(240 / CASE_SEQUENCE.length));

test.use({ actionTimeout: ACTION_TIMEOUT_MS });
test.describe.configure({ mode: "parallel" });

// Playwright reads the first parameter's source to learn which fixtures a hook
// wants, and refuses anything that is not a destructuring pattern -- at load
// time, for the whole invocation. `_fixtures` here kept this file and the
// layout sweep beside it from running for four weekly passes.
// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "full coverage runs only once");
});

async function readProgress(page) {
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  return {
    currentCase: saved.currentCase,
    nodeId: saved.nodeId,
    logLength: saved.log.length,
    clueCount: saved.discoveredClues.length,
  };
}

async function assertReloadRoundTrip(page, before) {
  await page.reload();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
  const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  const after = {
    currentCase: saved.currentCase,
    nodeId: saved.nodeId,
    logLength: saved.log.length,
    clueCount: saved.discoveredClues.length,
    paused: saved.paused,
    lastError: saved.lastError ?? null,
  };
  expect(after.currentCase).toBe(before.currentCase);
  expect(after.nodeId).toBe(before.nodeId);
  expect(after.logLength).toBe(before.logLength);
  expect(after.clueCount).toBeGreaterThanOrEqual(before.clueCount);
  expect(after.paused).toBe(false);
  expect(after.lastError).toBeFalsy();
}

/**
 * A card that asks for standing -- each case's evidence card -- is locked on
 * the fresh save a debug jump starts from, and a locked card cannot be staked.
 * The walk pressed it anyway, so every case failed on its four evidence cards
 * and the scene behind them was reached only by jumping to it. The run is
 * given the standing a player would have earned by then: records and the two
 * gauges the gate reads (`getAuthorityGate`), written to the save from a
 * static page so the table's own save on the way out does not overwrite them.
 */
const KEEP_SAVE_FLAG = "e2e-keep-save";

async function grantAuthority(page) {
  const save = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  await page.goto("/profile.jpg");
  save.resources = { ...save.resources, trust: 90, legitimacy: 90 };
  save.discoveredClues = CASE_SEQUENCE.map((caseId) => ({ id: `e2e-record-${caseId}`, title: caseId, text: "" }));
  // The walk clears storage on every load, to start each pair clean; this one
  // load has to find the save just written.
  await page.evaluate((flag) => sessionStorage.setItem(flag, "1"), KEEP_SAVE_FLAG);
  await writeJsonStorage(page, TEST_STORAGE_KEYS.save, save);
  await page.goto("/?debug=1");
  // A runner with four workers on it took longer than eight seconds to bring
  // the table back in 31 of 220 cards; this is a load, not a transition.
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await page.evaluate((flag) => sessionStorage.removeItem(flag), KEEP_SAVE_FLAG);
  await dismissProtocolBreach(page);
}

const pairsIn = (caseId) => nodeOrders[caseId].reduce((count, nodeId) => count + nodes[nodeId].choices.length, 0);

for (const caseId of CASE_SEQUENCE) {
  test(`every ${caseId} scene-choice pair advances without runtime errors @full`, async ({ page }) => {
    const pairs = pairsIn(caseId);
    expect(pairs, `${caseId} has no scene-choice pairs to walk`).toBeGreaterThan(0);
    test.setTimeout(pairs * SECONDS_PER_PAIR * 1000);
    const failures = [];
    const errors = [];
    let aborted = "";
    let walked = 0;
    await page.addInitScript((keepFlag) => {
      try {
        if (!sessionStorage.getItem(keepFlag)) localStorage.clear();
      } catch {
        // Storage can be blocked before the app boots.
      }
    }, KEEP_SAVE_FLAG);
    collectRuntimeErrors(page, errors);

    for (const nodeId of nodeOrders[caseId]) {
      const scene = nodes[nodeId];
      for (let choiceIndex = 0; choiceIndex < scene.choices.length; choiceIndex += 1) {
        errors.length = 0;
        const choice = scene.choices[choiceIndex];
        try {
          await startDebugNode(page, caseId, nodeId);
          if (choice.requiredAuthority) await grantAuthority(page);
          await chooseSceneChoice(page, scene, choiceIndex);
          await page.waitForSelector(".game-shell, .result-page, .ending-reveal", { timeout: 8000 });
          if (await page.locator(".error-screen").isVisible()) {
            failures.push(`${caseId}/${nodeId}/${choice.id}: error screen visible`);
          }
          if (errors.length) failures.push(`${caseId}/${nodeId}/${choice.id}: ${errors.slice(0, 2).join(" | ")}`);
          walked += 1;
        } catch (error) {
          const message = String(error).split("\n")[0];
          failures.push(`${caseId}/${nodeId}/${choice.id}: ${message}`);
          // Once the page or browser is gone, every later pair reports the same
          // teardown message. Those entries carry no information and would bury
          // the one failure that actually explains the run, so stop collecting.
          if (/browser has been closed|Target page.*closed|Test ended/i.test(message)) {
            aborted = `harness stopped responding at ${caseId}/${nodeId}/${choice.id}`;
          }
        }
        if (aborted) break;
      }
      if (aborted) break;
    }

    if (aborted) {
      throw new Error(
        `${aborted}\nCollected ${failures.length} failure(s) before the harness died; ` +
          `only the first explains the run:\n${failures[0] ?? "(none)"}`,
      );
    }
    if (failures.length) throw new Error(`${failures.length} failures\n${failures.join("\n")}`);
    expect(walked).toBe(pairs);
  });
}

for (let seed = 1; seed <= SEEDED_SEASONS; seed += 1) {
  test(`seed ${seed} complete season uses real case transitions @full`, async ({ page }) => {
    test.setTimeout(CASE_SEQUENCE.length * SECONDS_PER_CASE_WALKED * 1000);
    const errors = [];
    collectRuntimeErrors(page, errors);
    const random = createSeededRandom(seed);

    await startDebugNode(page, CASE_SEQUENCE[0], CASE_START_NODES[CASE_SEQUENCE[0]]);
    for (let index = 0; index < CASE_SEQUENCE.length; index += 1) {
      const caseId = CASE_SEQUENCE[index];
      await completeCase(page, random);
      const saved = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
      expect(saved.completedCases).toContain(caseId);
      const outcome = saved.caseResults[caseId]?.outcomeChoiceId;
      expect(outcome, `${caseId} closed without recording how`).toBeTruthy();
      if (index < CASE_SEQUENCE.length - 1) {
        const nextCaseId = CASE_SEQUENCE[index + 1];
        // Every way a case can close opens the next one somewhere: a route of
        // its own, or the case's ordinary first scene. This used to be checked
        // only `if (expectedStart)`, so an outcome with no route checked
        // nothing about where the next case opened.
        const routes = caseOpeningRoutes[nextCaseId] ?? {};
        const expectedStart = routes[outcome] ?? CASE_START_NODES[nextCaseId];
        const nextCaseButton = page.locator(".next-case-panel button");
        await expect(nextCaseButton).toBeVisible({ timeout: 8000 });
        await nextCaseButton.click();
        await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
        const afterTransition = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
        expect(afterTransition.currentCase).toBe(nextCaseId);
        expect(afterTransition.nodeId, `${nextCaseId} after ${caseId} closed on ${outcome}`).toBe(expectedStart);
      }
    }
    await expect(page.locator(".ending-sequence")).toBeVisible({ timeout: 8000 });
    const completed = (await readJsonStorage(page, TEST_STORAGE_KEYS.save)).completedCases;
    expect(completed).toHaveLength(CASE_SEQUENCE.length);
    if (errors.length) throw new Error(errors.slice(0, 2).join("\n"));
  });
}

test("saved state survives reload stress during complete season @full", async ({ page }) => {
  test.setTimeout(CASE_SEQUENCE.length * SECONDS_PER_CASE_WALKED * 1000);
  const errors = [];
  collectRuntimeErrors(page, errors);
  const random = createSeededRandom(20260828);

  await startDebugNode(page, CASE_SEQUENCE[0], CASE_START_NODES[CASE_SEQUENCE[0]]);
  for (let index = 0; index < CASE_SEQUENCE.length; index += 1) {
    const before = await readProgress(page);
    await assertReloadRoundTrip(page, before);
    if (index === 0) {
      await page.keyboard.press("KeyP");
      await assertReloadRoundTrip(page, before);
    }
    if (index === 1) {
      await page.locator('[aria-keyshortcuts="P"]').click();
      await assertReloadRoundTrip(page, before);
    }
    if (index === 2) {
      // The reframe card is the one card every scene has, so staking it is the
      // third reload this walk takes: a table with a card on it has to survive
      // one. It is asserted, not looked for: `if (await card.isVisible())`
      // skipped the whole check whenever the card was a frame late.
      const reframeCard = page.locator(".gx-card-wild");
      await expect(reframeCard).toBeVisible();
      await clickElement(reframeCard, "reframe card");
      await expect(reframeCard).toHaveClass(/selected/);
      await assertReloadRoundTrip(page, await readProgress(page));
    }
    await completeCase(page, random);
    if (index < CASE_SEQUENCE.length - 1) {
      await page.locator(".next-case-panel button").click();
      await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
    }
  }

  await expect(page.locator(".ending-sequence")).toBeVisible({ timeout: 8000 });
  if (errors.length) throw new Error(errors.join("\n"));
});
