import { expect, test } from "./helpers/network.js";
import { cashStakedCard, clickElement, collectRuntimeErrors, dismissProtocolBreach, resumeSavedRun, TRANSITION_TIMEOUT_MS } from "./helpers/gameFlow.js";
import { savedRunAt } from "./helpers/seededSave.js";
import { readStorage, TEST_STORAGE_KEYS } from "./helpers/storage.js";
import { NEW_GAME_PLUS_KEY, SIDE_CASES_KEY } from "../src/appConfig.js";

/**
 * E-11 번외 사건 (E11-번외사건-설계안 6절, e2e 1-3): the side slot on the start
 * screen, a side case played to its ending on the season's table, and the
 * season exactly where it was afterwards.
 *
 * The case played is the framework's placeholder, side00, which only a debug
 * build visited with `?side-fixture=1` lists (src/nodes/sidePacks.js) -- the
 * dev server these specs run against is one. A release lists no side case
 * until side01 is written, and the slot is hidden there.
 */

const FIXTURE_URL = "/?side-fixture=1";
const SEASON_SAVE = savedRunAt("case12", "c12_start", {
  caseResults: {},
  log: [{ nodeId: "c12_start", caseId: "case12", choiceId: "c12_start_seed" }],
});
const RANKING_ROWS = [{ local: true, run_id: "e2e-seeded-run", case_id: "case11", case_title: "사건 11", summary: { score: 300 } }];

/** A season paused at 사건 12 on a device that has (or has not) closed a finale. */
async function seedDevice(page, { finaleClosed }) {
  await page.addInitScript(
    ({ saveKey, save, rankingKey, rows, newGamePlusKey, finale }) => {
      if (sessionStorage.getItem("e2e-side-seeded")) return;
      sessionStorage.setItem("e2e-side-seeded", "1");
      localStorage.clear();
      localStorage.setItem(saveKey, JSON.stringify(save));
      localStorage.setItem(rankingKey, JSON.stringify(rows));
      if (finale) localStorage.setItem(newGamePlusKey, "true");
    },
    {
      saveKey: TEST_STORAGE_KEYS.save,
      save: SEASON_SAVE,
      rankingKey: TEST_STORAGE_KEYS.localRanking,
      rows: RANKING_ROWS,
      newGamePlusKey: NEW_GAME_PLUS_KEY,
      finale: finaleClosed,
    },
  );
}

async function readSeasonKeys(page) {
  return {
    save: await readStorage(page, TEST_STORAGE_KEYS.save),
    ranking: await readStorage(page, TEST_STORAGE_KEYS.localRanking),
    windows: await readStorage(page, TEST_STORAGE_KEYS.settledWindows),
    newGamePlus: await readStorage(page, NEW_GAME_PLUS_KEY),
  };
}

test("a device that closed a finale opens 번외 0, plays it to an ending, and finds the season as it left it @once", async ({ page }) => {
  const errors = [];
  collectRuntimeErrors(page, errors);
  await seedDevice(page, { finaleClosed: true });
  await page.goto(FIXTURE_URL);
  const slot = page.getByTestId("side-case-slot");
  await expect(slot).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(slot).toContainText("번외 0/1");
  await expect(slot).toContainText("랭킹 밖");
  const before = await readSeasonKeys(page);

  await clickElement(page.getByTestId("side-case-open-side00"), "open side00");
  const screen = page.getByTestId("side-case-screen");
  await expect(screen).toHaveAttribute("data-side-node", "s0_start", { timeout: TRANSITION_TIMEOUT_MS });

  for (const nodeId of ["s0_start", "s0_desk", "s0_aftershock"]) {
    await expect(screen).toHaveAttribute("data-side-node", nodeId, { timeout: TRANSITION_TIMEOUT_MS });
    await dismissProtocolBreach(page);
    await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
    await cashStakedCard(page);
    // A step is written before the next scene is drawn.
    if (nodeId !== "s0_aftershock") {
      await expect.poll(async () => JSON.parse((await readStorage(page, SIDE_CASES_KEY)) ?? "{}").side00?.inProgress?.nodeId ?? null).not.toBe(nodeId);
    }
  }

  await expect(page.getByTestId("side-case-ending")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.getByTestId("side-case-out-of-ranking")).toContainText("랭킹 밖");
  const record = JSON.parse(await readStorage(page, SIDE_CASES_KEY));
  expect(record.side00.closedAt).toBeTruthy();
  expect(record.side00.outcomeChoiceId).toMatch(/^s0_after_/);
  expect(record.side00.inProgress).toBeNull();
  // Not a key of the season moved: save, ranking, window log, NEW GAME+.
  expect(await readSeasonKeys(page)).toEqual(before);

  await clickElement(page.getByTestId("side-case-close"), "back to the start screen");
  await expect(page.getByTestId("side-case-slot")).toContainText("번외 1/1");
  // 이어하기 opens the season where it was paused.
  await resumeSavedRun(page);
  expect(JSON.parse(await readStorage(page, TEST_STORAGE_KEYS.save)).currentCase).toBe("case12");
  expect(errors).toEqual([]);
});

test("a device that has not closed a finale has no side slot @once", async ({ page }) => {
  await seedDevice(page, { finaleClosed: false });
  await page.goto(FIXTURE_URL);
  await expect(page.getByTestId("resume-save")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.getByTestId("side-case-slot")).toHaveCount(0);
});

test("without the fixture switch no side case is listed, so a finished device has no slot either @once", async ({ page }) => {
  await seedDevice(page, { finaleClosed: true });
  await page.goto("/");
  await expect(page.getByTestId("resume-save")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await expect(page.getByTestId("side-case-slot")).toHaveCount(0);
});
