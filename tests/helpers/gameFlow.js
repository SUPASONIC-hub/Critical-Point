import { expect } from "@playwright/test";
import { nodes } from "../../src/gameData.js";
import { clearGameStorage, readJsonStorage, TEST_STORAGE_KEYS } from "./storage.js";

export const ACTION_TIMEOUT_MS = 60_000;
export const TRANSITION_TIMEOUT_MS = 60_000;

export async function clickElement(locator, label) {
  try {
    await locator.click({ timeout: ACTION_TIMEOUT_MS });
  } catch (error) {
    const message = String(error).split("\n")[0];
    throw new Error(`${label} click failed: ${message}`, { cause: error });
  }
}

export async function waitUntilVisible(locator, timeout = ACTION_TIMEOUT_MS) {
  return locator.waitFor({ state: "visible", timeout }).then(() => true).catch(() => false);
}

/**
 * The table's two verbs, for flows that only need to get past a decision.
 *
 * A card is staked by clicking it; the cash button enables once one is. A card
 * the previous window sealed (COLD FEET) opens when the gauge reaches the seal,
 * and the seal plus one push can never reach the lowest wall a board that did
 * not just bust can draw -- so pushing until cash enables is always safe here.
 *
 * Before either, clear whatever stands between the run and a live table: the
 * relic draft, then the briefing page (which also carries the protocol breach).
 * Both hold the clock, so a flow that does not pass them finds a board it
 * cannot press. Idempotent, because most callers do not know which is up.
 */
const TABLE_GATES = "[data-testid='relic-skip'], [data-testid='open-table']";

export async function dismissProtocolBreach(page) {
  // Best effort, not an assertion: give the stage a beat to paint so the clicks
  // below have something to hit. It runs on every scene of every walk, so the
  // ceiling is short -- at ACTION_TIMEOUT_MS a screen that legitimately has none
  // of these on it stalled the caller for a minute and the suite began timing
  // out in a different place each run.
  //
  // "Painted" is the next screen, not the one on its way out: right after a
  // reveal's next button the old table is still in the DOM for a frame, and
  // looking for a gate then found none and returned with the briefing about to
  // mount -- so the caller clicked a card on a held table and nothing happened.
  await page
    .waitForFunction(
      (gates) =>
        Boolean(document.querySelector(".result-page, .ending-sequence")) ||
        (!document.querySelector(".decision-reveal-backdrop") &&
          Boolean(document.querySelector(gates) || document.querySelector(".choices .choice:not([aria-disabled='true'])"))),
      TABLE_GATES,
      { timeout: 6_000 },
    )
    .then(
      () => true,
      () => false,
    );
  // The two are never mounted at once -- `briefingOpen` is false while the draft
  // is up -- so one pass could only ever clear the first of them. It skipped the
  // draft, React mounted the briefing behind it, and the caller then asserted on
  // a table whose cards were all still disabled. Clearing one at a time until
  // neither is there is what this function always claimed to do.
  const gate = page.locator(TABLE_GATES).first();
  for (let pass = 0; pass < 4 && (await gate.isVisible()); pass += 1) {
    const cleared = await gate.getAttribute("data-testid");
    // dispatchEvent, not click(): the draft and the briefing slide in and keep
    // animating, so Playwright never finds the button "stable" and a real click
    // waits forever -- which is why this used to be an evaluate(el => el.click()).
    await gate.dispatchEvent("click");
    // Settled means: the gate just pressed is gone, and either the next one
    // is up or the table is live. It used to be a fixed 120ms pause, which was
    // either wasted or -- on a slow frame -- not enough for the briefing to
    // mount behind the draft, so the loop ended with the table still held.
    await page.waitForFunction(
      ({ cleared, gates }) =>
        !document.querySelector(`[data-testid='${cleared}']`) &&
        Boolean(
          document.querySelector(gates) ||
            document.querySelector(".choices .choice:not([aria-disabled='true'])") ||
            document.querySelector(".result-page, .ending-sequence"),
        ),
      { cleared, gates: TABLE_GATES },
      { timeout: TRANSITION_TIMEOUT_MS },
    );
  }
}

/**
 * Push until the cash button enables, then cash. Each push is followed by a
 * wait for the gauge to move rather than a fixed pause, so the next press
 * never lands on a board still animating the last one.
 */
export async function cashStakedCard(page) {
  const cash = page.getByTestId("commit-confirm");
  const stage = page.getByTestId("gauntlet-stage");
  await expect(cash).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  for (let press = 0; press < 8 && !(await cash.isEnabled()); press += 1) {
    const gauge = await stage.getAttribute("data-gauge");
    await page.getByTestId("commit-push").click();
    await expect
      .poll(async () => (await cash.isEnabled()) || (await stage.getAttribute("data-gauge")) !== gauge, { timeout: 5_000 })
      .toBe(true);
  }
  await cash.click();
}

/**
 * The intro's entry path, in one place. Every spec that opens a run from the
 * intro goes through these so the locators live here and not in nine files.
 */
export async function startFirstRun(page) {
  await clickElement(page.getByTestId("start-first-case"), "start first case");
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await dismissProtocolBreach(page);
}

export async function resumeSavedRun(page) {
  await clickElement(page.getByTestId("resume-save"), "resume saved run");
  await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  await dismissProtocolBreach(page);
}

/** Pre-start prose sits in closed <details>; force one open to reach a control. */
export async function openIntroDrawer(page, selector) {
  await page.locator(`details.intro-drawer:has(${selector})`).evaluate((element) => {
    element.open = true;
  });
}

export async function startDebugNode(page, caseId, nodeId, options = {}) {
  const {
    navigate = true,
    resetStorage = true,
    expectGameShell = true,
    // A window opens on its briefing page with the clock held, and almost every
    // test is about the timed table behind it. Opening it here keeps that out
    // of each spec; a test of the briefing page itself passes false.
    openTable = true,
  } = options;
  if (navigate) await page.goto("/?debug=1");
  if (resetStorage) {
    await clearGameStorage(page);
    await page.reload();
  }
  await page.getByTestId("debug-case-select").selectOption(caseId);
  await page.getByTestId("debug-node-select").selectOption(nodeId);
  await expect(page.getByTestId("debug-case-select")).toHaveValue(caseId);
  await expect(page.getByTestId("debug-node-select")).toHaveValue(nodeId);
  await page.getByTestId("debug-start-node").click();
  if (expectGameShell) await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  if (openTable) await dismissProtocolBreach(page);
}

export async function chooseFirstAvailableChoice(page) {
  const decisionNext = page.getByTestId("decision-next");
  const result = page.locator(".result-page");
  if (await decisionNext.isVisible()) {
    await decisionNext.click();
    return;
  }
  await expect(decisionNext.or(result).or(page.locator(".choices .choice")).first()).toBeVisible({ timeout: 15_000 });
  await dismissProtocolBreach(page);
  if (await decisionNext.isVisible()) {
    await decisionNext.click();
    return;
  }
  if (await result.count()) return;
  const firstChoice = page.locator(".choices .choice:not([aria-disabled='true'])").first();
  if (!(await firstChoice.count())) return;
  await firstChoice.click();
  await cashStakedCard(page);
  await expect(
    decisionNext.or(result).or(page.locator(".choices .choice:not([aria-disabled='true'])")).first(),
  ).toBeVisible({ timeout: 15_000 });
  if (await decisionNext.isVisible()) await decisionNext.click();
}

export async function chooseSceneChoice(page, scene, choiceIndex) {
  const choice = scene.choices[choiceIndex];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    await dismissProtocolBreach(page);
    if (choice.type === "reframe") {
      await page.locator(".gx-card-wild").click();
      await cashStakedCard(page);
    } else {
      const fixedIndex = scene.choices.slice(0, choiceIndex + 1).filter((candidate) => candidate.type !== "reframe").length - 1;
      await clickElement(page.locator(".choices .choice").nth(fixedIndex), `${scene.title}/${choice.id}`);
      try {
        await cashStakedCard(page);
      } catch (error) {
        if (await waitUntilVisible(page.getByTestId("decision-next"), 1_000)) break;
        if (attempt === 1) throw error;
        continue;
      }
    }

    if (await page.locator(".result-page, .ending-reveal").first().isVisible()) return;
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
    await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
    return;
  }

  await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
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
    if (await page.locator(".result-page").isVisible()) return;
    await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
    const { nodeId } = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
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
  if (!(await revealNext.isVisible())) return;
  await revealNext.click();
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
    await dismissProtocolBreach(page);
    const choice = page.locator(".choices .choice:not([aria-disabled='true'])").first();
    await expect(choice).toBeVisible();
    await choice.click();
    await cashStakedCard(page);
    const nextButton = page.getByTestId("decision-next");
    // The reveal can take a while on a loaded machine; wait for it or for the
    // report, rather than 5s and then walking on with the reveal still up.
    await expect(nextButton.or(page.locator(".result-page, .ending-sequence")).first()).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
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
