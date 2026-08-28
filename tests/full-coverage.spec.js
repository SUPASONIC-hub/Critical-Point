import { expect, test } from "@playwright/test";
import { caseOpeningRoutes, nodeOrders, nodes } from "../src/gameData.js";

const CASE_SEQUENCE = ["case01", "case02", "case03", "case04", "case05", "final"];
const RESULT_NODE_IDS = {
  case01: "result",
  case02: "case02_result",
  case03: "case03_result",
  case04: "case04_result",
  case05: "case05_result",
  final: "final_result",
};

test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "full coverage runs only once");
});

async function startDebugNode(page, caseId, nodeId) {
  await page.goto("/?debug=1");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId("debug-case-select").selectOption(caseId);
  await page.getByTestId("debug-node-select").selectOption(nodeId);
  await expect(page.getByTestId("debug-case-select")).toHaveValue(caseId);
  await expect(page.getByTestId("debug-node-select")).toHaveValue(nodeId);
  await page.getByTestId("debug-start-node").click();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
}

async function chooseSceneChoice(page, scene, choiceIndex) {
  const choice = scene.choices[choiceIndex];
  if (choice.type === "free") {
    await page.locator(".reframe-box textarea").fill("Separate people, evidence, and conditions before deciding the next step.");
    await page.locator(".submit-reframe").evaluate((button) => button.click());
  } else {
    const fixedIndex = scene.choices.slice(0, choiceIndex + 1).filter((candidate) => candidate.type !== "free").length - 1;
    await page.locator(".choices .choice").nth(fixedIndex).evaluate((button) => button.click());
    await page.getByTestId("commit-confirm").evaluate((button) => button.click());
  }
  await expect(page.getByTestId("decision-next")).toBeVisible({ timeout: 8000 });
  await page.getByTestId("decision-next").evaluate((button) => button.click());
  await page.waitForFunction(
    ({ nextNodeId }) => {
      const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null");
      return saved?.nodeId === nextNodeId || Boolean(document.querySelector(".result-page, .ending-reveal"));
    },
    { nextNodeId: choice.next },
    { timeout: 8000 },
  );
}

async function completeCase(page, random) {
  for (let step = 0; step < 80; step += 1) {
    if (await page.locator(".result-page").isVisible().catch(() => false)) return;
    await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
    const { nodeId } = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), "trigger-prototype-v2");
    const scene = nodes[nodeId];
    if (!scene) throw new Error(`missing scene ${nodeId}`);
    const choiceIndex = Math.floor(random() * scene.choices.length);
    await chooseSceneChoice(page, scene, choiceIndex);
    await page.waitForSelector(".game-shell, .result-page, .ending-reveal", { timeout: 8000 });
  }
  throw new Error("case did not reach result");
}

function createSeededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

function collectRuntimeErrors(page, errors) {
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
}

async function assertReloadRoundTrip(page, before) {
  await page.reload();
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
  const after = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
    return {
      currentCase: saved.currentCase,
      nodeId: saved.nodeId,
      logLength: saved.log.length,
      clueCount: saved.discoveredClues.length,
      paused: saved.paused,
      lastError: saved.lastError ?? null,
    };
  });
  expect(after.currentCase).toBe(before.currentCase);
  expect(after.nodeId).toBe(before.nodeId);
  expect(after.logLength).toBe(before.logLength);
  expect(after.clueCount).toBeGreaterThanOrEqual(before.clueCount);
  expect(after.paused).toBe(false);
  expect(after.lastError).toBeFalsy();
}

test("all scene-choice pairs advance without runtime errors @full", async ({ page }) => {
  test.setTimeout(45 * 60_000);
  const failures = [];
  const errors = [];
  await page.addInitScript(() => {
    try {
      localStorage.clear();
    } catch {}
  });
  collectRuntimeErrors(page, errors);

  for (const caseId of CASE_SEQUENCE) {
    for (const nodeId of nodeOrders[caseId]) {
      const scene = nodes[nodeId];
      for (let choiceIndex = 0; choiceIndex < scene.choices.length; choiceIndex += 1) {
        errors.length = 0;
        const choice = scene.choices[choiceIndex];
        try {
          await startDebugNode(page, caseId, nodeId);
          await chooseSceneChoice(page, scene, choiceIndex);
          await page.waitForSelector(".game-shell, .result-page, .ending-reveal", { timeout: 8000 });
          if (await page.locator(".error-screen").isVisible().catch(() => false)) {
            failures.push(`${caseId}/${nodeId}/${choice.id}: error screen visible`);
          }
          if (errors.length) failures.push(`${caseId}/${nodeId}/${choice.id}: ${errors.slice(0, 2).join(" | ")}`);
        } catch (error) {
          failures.push(`${caseId}/${nodeId}/${choice.id}: ${String(error).split("\n")[0]}`);
        }
      }
    }
  }

  if (failures.length) throw new Error(`${failures.length} failures\n${failures.join("\n")}`);
});

for (let seed = 1; seed <= 20; seed += 1) {
  test(`seed ${seed} complete season uses real case transitions @full`, async ({ page }) => {
    test.setTimeout(12 * 60_000);
    const errors = [];
    collectRuntimeErrors(page, errors);
    const random = createSeededRandom(seed);

    await startDebugNode(page, "case01", "start");
    for (let index = 0; index < CASE_SEQUENCE.length; index += 1) {
      const caseId = CASE_SEQUENCE[index];
      await completeCase(page, random);
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
      expect(saved.completedCases).toContain(caseId);
      expect(saved.caseResults[caseId]?.outcomeChoiceId).toBeTruthy();
      if (index < CASE_SEQUENCE.length - 1) {
        const nextCaseId = CASE_SEQUENCE[index + 1];
        const expectedStart = caseOpeningRoutes[nextCaseId]?.[saved.caseResults[caseId].outcomeChoiceId];
        const nextCaseButton = page.locator(".next-case-panel button");
        await expect(nextCaseButton).toBeVisible({ timeout: 8000 });
        await nextCaseButton.evaluate((button) => button.click());
        await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
        const afterTransition = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
        if (expectedStart) expect(afterTransition.nodeId).toBe(expectedStart);
      }
    }
    await expect(page.locator(".ending-sequence")).toBeVisible({ timeout: 8000 });
    const completed = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).completedCases);
    expect(completed).toHaveLength(6);
    if (errors.length) throw new Error(errors.slice(0, 2).join("\n"));
  });
}

test("saved state survives reload stress during complete season @full", async ({ page }) => {
  test.setTimeout(10 * 60_000);
  const errors = [];
  collectRuntimeErrors(page, errors);
  const random = createSeededRandom(20260828);

  await startDebugNode(page, "case01", "start");
  for (let index = 0; index < CASE_SEQUENCE.length; index += 1) {
    const before = await page.evaluate(() => {
      const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
      return {
        currentCase: saved.currentCase,
        nodeId: saved.nodeId,
        logLength: saved.log.length,
        clueCount: saved.discoveredClues.length,
      };
    });
    await assertReloadRoundTrip(page, before);
    if (index === 0) {
      await page.keyboard.press("KeyP");
      await assertReloadRoundTrip(page, before);
    }
    if (index === 1) {
      await page.locator('[aria-keyshortcuts="P"]').click();
      await assertReloadRoundTrip(page, before);
    }
    const textarea = page.locator(".reframe-box textarea");
    if (index === 2 && await textarea.isVisible().catch(() => false)) {
      await textarea.fill("Reload stress ".repeat(20));
      const typed = await page.evaluate(() => {
        const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
        return {
          currentCase: saved.currentCase,
          nodeId: saved.nodeId,
          logLength: saved.log.length,
          clueCount: saved.discoveredClues.length,
        };
      });
      await assertReloadRoundTrip(page, typed);
    }
    await completeCase(page, random);
    if (index < CASE_SEQUENCE.length - 1) {
      await page.locator(".next-case-panel button").evaluate((button) => button.click());
      await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
    }
  }

  await expect(page.locator(".ending-sequence")).toBeVisible({ timeout: 8000 });
  if (errors.length) throw new Error(errors.join("\n"));
});
