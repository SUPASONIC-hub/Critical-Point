import { expect } from "@playwright/test";
import { nodes } from "../../src/gameData.js";

export const ACTION_TIMEOUT_MS = 60_000;
export const TRANSITION_TIMEOUT_MS = 60_000;

export async function clickElement(locator, label) {
  try {
    await locator.click({ timeout: ACTION_TIMEOUT_MS });
  } catch (error) {
    const message = String(error).split("\n")[0];
    throw new Error(`${label} click failed: ${message}`);
  }
}

export async function waitUntilVisible(locator, timeout = ACTION_TIMEOUT_MS) {
  return locator.waitFor({ state: "visible", timeout }).then(() => true).catch(() => false);
}

export async function startDebugNode(page, caseId, nodeId, options = {}) {
  const {
    navigate = true,
    resetStorage = true,
    expectGameShell = true,
  } = options;
  if (navigate) await page.goto("/?debug=1");
  if (resetStorage) {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  }
  await page.getByTestId("debug-case-select").selectOption(caseId);
  await page.getByTestId("debug-node-select").selectOption(nodeId);
  await expect(page.getByTestId("debug-case-select")).toHaveValue(caseId);
  await expect(page.getByTestId("debug-node-select")).toHaveValue(nodeId);
  await page.getByTestId("debug-start-node").click();
  if (expectGameShell) await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
}

export async function chooseFirstAvailableChoice(page) {
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible().catch(() => false)) {
    await decisionNext.evaluate((button) => button.click());
    return;
  }
  await page.waitForFunction(
    () => Boolean(document.querySelector("[data-testid='decision-next']") || document.querySelector(".result-page") || document.querySelector(".choices .choice:not([aria-disabled='true'])")),
    undefined,
    { timeout: 15_000 },
  );
  const domAction = await page.evaluate(() => {
    const decisionNext = document.querySelector("[data-testid='decision-next']");
    if (decisionNext instanceof HTMLButtonElement) {
      decisionNext.click();
      return "advanced";
    }
    if (document.querySelector(".result-page")) return "result";
    const firstChoice = document.querySelector(".choices .choice:not([aria-disabled='true'])");
    if (firstChoice instanceof HTMLButtonElement) {
      firstChoice.click();
      return "choice";
    }
    return "none";
  });
  if (domAction !== "choice") return;
  await page.evaluate(() => document.querySelector("[data-testid='commit-confirm']")?.click());
  await page.waitForFunction(
    () => Boolean(document.querySelector("[data-testid='decision-next']") || document.querySelector(".choices .choice:not([aria-disabled='true'])") || document.querySelector(".result-page")),
    undefined,
    { timeout: 15_000 },
  );
  await page.evaluate(() => document.querySelector("[data-testid='decision-next']")?.click());
}

export async function chooseSceneChoice(page, scene, choiceIndex) {
  const choice = scene.choices[choiceIndex];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (choice.type === "free") {
      await page.locator(".reframe-box textarea").fill(
        "Separate people, evidence, and conditions before deciding the next step.",
        { timeout: ACTION_TIMEOUT_MS },
      );
      await clickElement(page.locator(".submit-reframe"), `${scene.title}/${choice.id}`);
    } else {
      const fixedIndex = scene.choices.slice(0, choiceIndex + 1).filter((candidate) => candidate.type !== "free").length - 1;
      await clickElement(page.locator(".choices .choice").nth(fixedIndex), `${scene.title}/${choice.id}`);
      if (!(await waitUntilVisible(page.getByTestId("commit-confirm"), 3_000))) continue;
      try {
        await clickElement(page.getByTestId("commit-confirm"), `${scene.title}/${choice.id} confirm`);
      } catch (error) {
        if (await waitUntilVisible(page.getByTestId("decision-next"), 1_000)) break;
        if (attempt === 1) throw error;
        continue;
      }
    }

    if (
      await page.locator(".result-page").isVisible().catch(() => false) ||
      await page.locator(".ending-reveal").isVisible().catch(() => false)
    ) return;
    if (await waitUntilVisible(page.getByTestId("decision-next"))) break;
    if (attempt === 1) throw new Error(`${scene.title}/${choice.id} did not open decision reveal`);
  }

  try {
    await clickElement(page.getByTestId("decision-next"), `${scene.title}/${choice.id} next`);
  } catch (error) {
    const transitioned = await page.waitForFunction(
      ({ nextNodeId }) => {
        const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null");
        return saved?.nodeId === nextNodeId || Boolean(document.querySelector(".result-page, .ending-reveal"));
      },
      { nextNodeId: choice.next },
      { timeout: 2_000 },
    ).then(() => true).catch(() => false);
    if (!transitioned) throw error;
    await page.locator(".decision-reveal-backdrop").waitFor({ state: "detached", timeout: TRANSITION_TIMEOUT_MS }).catch(() => {});
    return;
  }

  await page.locator(".decision-reveal-backdrop").waitFor({ state: "detached", timeout: TRANSITION_TIMEOUT_MS }).catch(() => {});
  await page.waitForFunction(
    ({ nextNodeId, nextTitle }) => {
      const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null");
      const heading = document.querySelector(".game-header h1")?.textContent ?? "";
      return (
        saved?.nodeId === nextNodeId ||
        (nextTitle && heading.includes(nextTitle)) ||
        Boolean(document.querySelector(".result-page, .ending-reveal"))
      );
    },
    { nextNodeId: choice.next, nextTitle: nodes[choice.next]?.title ?? "" },
    { timeout: TRANSITION_TIMEOUT_MS },
  );
}

export async function completeCase(page, random) {
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

export async function dismissDecisionRevealIfPresent(page) {
  const reveal = page.locator(".decision-reveal-backdrop");
  const revealNext = reveal.getByTestId("decision-next");
  if (!(await revealNext.isVisible().catch(() => false))) return;
  await revealNext.evaluate((button) => button.click());
  await expect(reveal).toHaveCount(0);
}

export async function completeCurrentCase(page) {
  for (let step = 0; step < 24; step += 1) {
    if (await page.locator(".result-page.final-report-locked, .ending-sequence").count()) {
      await dismissDecisionRevealIfPresent(page);
      return;
    }
    await page.waitForFunction(
      () => {
        if (document.querySelector(".result-page.final-report-locked, .result-page, .ending-sequence")) return true;
        const choice = document.querySelector(".choices .choice");
        return Boolean(choice && getComputedStyle(choice).display !== "none" && choice.getClientRects().length);
      },
      undefined,
      { timeout: 8_000 },
    );
    if (await page.locator(".result-page, .ending-sequence").count()) {
      await dismissDecisionRevealIfPresent(page);
      return;
    }
    const choice = page.locator(".choices .choice:not([aria-disabled='true'])").first();
    await expect(choice).toBeVisible();
    await choice.evaluate((button) => button.click());
    const commitButton = page.getByTestId("commit-confirm");
    if (await commitButton.isVisible().catch(() => false)) {
      await commitButton.evaluate((button) => button.click());
    }
    const nextButton = page.getByTestId("decision-next");
    if (await nextButton.isVisible().catch(() => false)) {
      await nextButton.evaluate((button) => button.click());
      await page.locator(".decision-reveal-backdrop").waitFor({ state: "detached", timeout: TRANSITION_TIMEOUT_MS }).catch(() => {});
    }
    if (await page.locator(".result-page, .ending-sequence").count()) {
      await dismissDecisionRevealIfPresent(page);
      return;
    }
  }
  throw new Error("Case did not reach result page");
}

export function createSeededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

export function collectRuntimeErrors(page, errors) {
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (/AudioContext encountered an error from the audio device|WebAudio renderer/i.test(message.text())) return;
    errors.push(`console: ${message.text()}`);
  });
}
