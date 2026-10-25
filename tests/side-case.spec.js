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
 * The first case played is the framework's placeholder, side00, which only a
 * debug build visited with `?side-fixture=1` lists (src/nodes/sidePacks.js) --
 * the dev server these specs run against is one. Without the switch the list is
 * what a release lists: 번외 1 (side01) and 번외 2 (side02), each played to its
 * ending below.
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
  // 번외 1, 번외 2 and the placeholder.
  await expect(slot).toContainText("번외 0/3");
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
  await expect(page.getByTestId("side-case-slot")).toContainText("번외 1/3");
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

// The release's cases: the first card each scene deals, scene after scene, to
// the close -- 번외 1 in seven to ten decisions, 번외 2 in eight to eleven.
const RELEASE_CASES = [
  { id: "side01", prefix: "s1", title: "아직 찾아가지 못한 일곱 명", most: 10 },
  { id: "side02", prefix: "s2", title: "돌려줄 것", most: 11 },
];

for (const { id, prefix, most } of RELEASE_CASES) {
  test(`without the fixture switch a finished device lists the release's cases, plays ${id} to an ending, and finds the season as it left it @once`, async ({ page }) => {
    // Each decision is a table played to its cash-out: side01's first cards take
    // about a minute, side02's eleven longer than the default 60 seconds.
    test.setTimeout(150_000);
    const errors = [];
    collectRuntimeErrors(page, errors);
    await seedDevice(page, { finaleClosed: true });
    await page.goto("/");
    const slot = page.getByTestId("side-case-slot");
    await expect(slot).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await expect(slot).toContainText("번외 0/2");
    for (const listed of RELEASE_CASES) await expect(slot).toContainText(listed.title);
    await expect(page.getByTestId("side-case-open-side00")).toHaveCount(0);
    const before = await readSeasonKeys(page);

    await clickElement(page.getByTestId(`side-case-open-${id}`), `open ${id}`);
    const screen = page.getByTestId("side-case-screen");
    await expect(screen).toHaveAttribute("data-side-node", `${prefix}_start`, { timeout: TRANSITION_TIMEOUT_MS });
    const seen = [];
    while (!(await page.getByTestId("side-case-ending").isVisible())) {
      const nodeId = await screen.getAttribute("data-side-node");
      expect(nodeId.startsWith(`${prefix}_`)).toBe(true);
      seen.push(nodeId);
      expect(seen.length).toBeLessThanOrEqual(most);
      await dismissProtocolBreach(page);
      await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
      await cashStakedCard(page);
      await expect
        .poll(async () => ((await page.getByTestId("side-case-ending").isVisible()) ? "ending" : await screen.getAttribute("data-side-node")), { timeout: TRANSITION_TIMEOUT_MS })
        .not.toBe(nodeId);
    }
    expect(seen[0]).toBe(`${prefix}_start`);
    expect(seen.at(-1)).toBe(`${prefix}_aftershock`);
    await expect(page.getByTestId("side-case-out-of-ranking")).toContainText("랭킹 밖");
    const record = JSON.parse(await readStorage(page, SIDE_CASES_KEY));
    expect(record[id].outcomeChoiceId.startsWith(`${prefix}_after_`)).toBe(true);
    expect(record[id].inProgress).toBeNull();
    expect(await readSeasonKeys(page)).toEqual(before);

    await clickElement(page.getByTestId("side-case-close"), "back to the start screen");
    await expect(page.getByTestId("side-case-slot")).toContainText("번외 1/2");
    expect(errors).toEqual([]);
  });
}
