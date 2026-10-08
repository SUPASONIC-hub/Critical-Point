import { expect } from "./network.js";
import { SEASON_ENTRY_CASE, seasonCasesBase } from "../../src/gameCases.js";
import { getCaseBranchNodes, nodes, reframeRouteNodes } from "../../src/gameData.js";
import { clearGameStorage, readJsonStorage, TEST_STORAGE_KEYS } from "./storage.js";

// Both sit under the test timeout (playwright.config.js, 60s). At 60s each the
// test died first, with Playwright's own "Test timeout exceeded", and the
// message `clickElement` had ready -- which control, in which scene -- was never
// printed.
export const ACTION_TIMEOUT_MS = 20_000;
export const TRANSITION_TIMEOUT_MS = 30_000;

export async function clickElement(locator, label) {
  try {
    await locator.click({ timeout: ACTION_TIMEOUT_MS });
  } catch (error) {
    const message = String(error).split("\n")[0];
    throw new Error(`${label} click failed: ${message}`, { cause: error });
  }
}

/**
 * A pointer click on a control that does not hold still. The briefing's and
 * the draft's buttons breathe, and in WebKit Playwright never finds them
 * "stable", so an ordinary click() waits out its timeout. The checks click()
 * would have made are made here instead -- visible, enabled, and the thing
 * under the pointer -- and then the pointer is pressed where the control is. A
 * control that is covered, or that does not take pointer events, fails with
 * the name of what the pointer would have hit.
 */
export async function clickThroughMotion(locator, label) {
  await expect(locator, `${label} is not visible`).toBeVisible({ timeout: ACTION_TIMEOUT_MS });
  await expect(locator, `${label} is disabled`).toBeEnabled({ timeout: ACTION_TIMEOUT_MS });
  // Not scrollIntoViewIfNeeded(): that waits for stillness too.
  await locator.evaluate((element) => element.scrollIntoView({ block: "nearest", inline: "nearest" }));
  await expect
    .poll(
      () =>
        locator.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
          if (hit && (hit === element || element.contains(hit))) return "";
          return hit ? `the pointer lands on <${hit.tagName.toLowerCase()} class="${hit.getAttribute("class") ?? ""}">` : "the control is off screen";
        }),
      { message: `${label} cannot be pressed`, timeout: 5_000 },
    )
    .toBe("");
  try {
    await locator.click({ force: true, timeout: ACTION_TIMEOUT_MS });
  } catch (error) {
    throw new Error(`${label} click failed: ${String(error).split("\n")[0]}`, { cause: error });
  }
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
    // The pointer, where it lands. This was a synthetic event for a long time,
    // because the gates keep moving and click() waits for stillness -- but a
    // synthetic event reaches a button that is covered, off screen or not
    // taking pointer events. Every test passes through here, so every test
    // would have passed with the gate unusable.
    await clickThroughMotion(gate, `table gate ${cleared}`);
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
  // Eight pushes that never opened the seal used to end in a click on a
  // disabled button, which waited out the whole test and failed as "Test
  // timeout exceeded" with no word about the table.
  await expect(cash, "the cash button never enabled: no card is staked, or the seal did not open in eight pushes").toBeEnabled({ timeout: 5_000 });
  await clickElement(cash, "cash the staked card");
}

/**
 * Waits for a surface to finish arriving. The briefing page, the reveal, the
 * draft and the table's question all fade or pop in, and an audit that reads
 * them on the way measures text half faded into what is behind it: the
 * briefing's contrast read 2.7, 3.26 and 3.87 on three runs of 2026-10-08 and
 * passed once the page had landed.
 *
 * Only animations that end, and end soon, are waited for. The loops (the splash
 * glitch, a late timer's throb) never finish, and a long finite one -- the
 * reading clock's bar, a table countdown -- is not an entrance.
 */
export async function waitForEntrance(locator, { longestMs = 3_000 } = {}) {
  await locator.evaluate(
    (node, longest) =>
      Promise.all(
        node
          .getAnimations({ subtree: true })
          .filter((animation) => {
            const timing = animation.effect?.getComputedTiming();
            const left = (timing?.endTime ?? Infinity) - (animation.currentTime ?? 0);
            return animation.playState !== "finished" && Number.isFinite(left) && left <= longest;
          })
          .map((animation) => animation.finished.catch(() => {})),
      ),
    longestMs,
  );
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

/**
 * Where committing `choice` sends the run, as useChoiceCommit decides it.
 *
 * A 판을 다시 짠다 card does not follow its own `next`. Cashed (and the helper
 * always cashes), the first one that opens a route in a case jumps to the
 * case's authored hidden route (`reframeRouteNodes`), or -- in a case without
 * one, or when the scene already is that route -- to the far side of the
 * case's first fork. A later reframe in the same case, or one with nowhere to
 * go, falls back to `choice.next`. "In the same case" is counted the way the
 * runtime counts it: log entries with `reframeOpenedRoute` whose caseId is the
 * run's case, or the season's entry case when the save names none it knows.
 */
function reframeTargetFor(caseId, fromNodeId) {
  const dramaticRoute = reframeRouteNodes[caseId];
  if (dramaticRoute && fromNodeId !== dramaticRoute && nodes[dramaticRoute]) return dramaticRoute;
  const branch = getCaseBranchNodes().find((item) => item.caseId === caseId);
  if (!branch || branch.nodeId === fromNodeId) return null;
  return branch.detourIds[0] ?? branch.nextIds[0] ?? null;
}

function expectedNextNode(saved, choice) {
  if (choice.type !== "reframe" || !saved) return choice.next;
  const currentCase = saved.currentCase;
  const countedCase = seasonCasesBase.some((caseItem) => caseItem.id === currentCase) ? currentCase : SEASON_ENTRY_CASE;
  const reframesOpened = (saved.log ?? []).filter((entry) => entry?.reframeOpenedRoute && entry.caseId === countedCase).length;
  if (reframesOpened > 0) return choice.next;
  return reframeTargetFor(currentCase, saved.nodeId) ?? choice.next;
}

export async function chooseSceneChoice(page, scene, choiceIndex) {
  const choice = scene.choices[choiceIndex];
  await dismissProtocolBreach(page);
  // Read before the commit rewrites it: the jump depends on the log as it
  // stood when the card was cashed.
  const nextNodeId = expectedNextNode(await readJsonStorage(page, TEST_STORAGE_KEYS.save), choice);
  if (choice.type === "reframe") {
    await clickElement(page.locator(".gx-card-wild"), `${scene.title}/${choice.id}`);
  } else {
    const fixedIndex = scene.choices.slice(0, choiceIndex + 1).filter((candidate) => candidate.type !== "reframe").length - 1;
    await clickElement(page.locator(".choices .choice").nth(fixedIndex), `${scene.title}/${choice.id}`);
  }
  // One attempt. A second one used to follow when the reveal did not open,
  // and it clicked the same card again -- which unstakes it.
  await cashStakedCard(page);
  const reveal = page.getByTestId("decision-next");
  const closed = page.locator(".result-page, .ending-reveal").first();
  await expect(reveal.or(closed).first(), `${scene.title}/${choice.id} did not open the decision reveal`).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
  if (!(await reveal.isVisible())) return;

  // A click that fails is a failure. It used to be forgiven when the save had
  // moved on anyway, which is the case worth hearing about: the run advanced
  // and the button the player advances it with could not be pressed.
  await clickElement(page.getByTestId("decision-next"), `${scene.title}/${choice.id} next`);

  await expect(page.locator(".decision-reveal-backdrop")).toHaveCount(0, { timeout: TRANSITION_TIMEOUT_MS });
  // A side door that asks for something of the run (`branchCondition`) leads
  // past itself when the run has not got it: 사건 04's opens only for a run that
  // has already paid, and a fresh one is sent on to `branchBypass`. Either is
  // where the card goes. The walk waited thirty seconds for the detour, on
  // every run, and called the card broken.
  await page.waitForFunction(
    ({ nextNodeIds, nextTitle }) => {
      const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null");
      const heading = document.querySelector(".game-header h1")?.textContent ?? "";
      return (
        nextNodeIds.includes(saved?.nodeId) ||
        (nextTitle && heading.includes(nextTitle)) ||
        Boolean(document.querySelector(".result-page, .ending-reveal"))
      );
    },
    { nextNodeIds: [nextNodeId, choice.branchCondition ? choice.branchBypass : null].filter(Boolean), nextTitle: nodes[nextNodeId]?.title ?? "" },
    { timeout: TRANSITION_TIMEOUT_MS },
  );
}

/**
 * `beforeChoice` is told which card the walk drew before it is pressed. The
 * draw is over every card of the scene, locked ones included, and a locked card
 * cannot be staked: a walk that has to press whatever it draws uses this to
 * give the run the standing the card asks for (full-coverage.spec.js).
 */
export async function completeCase(page, random, { beforeChoice } = {}) {
  for (let step = 0; step < 80; step += 1) {
    if (await page.locator(".result-page").isVisible()) return;
    await expect(page.locator(".game-shell")).toBeVisible({ timeout: 8000 });
    const { nodeId } = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
    const scene = nodes[nodeId];
    if (!scene) throw new Error(`missing scene ${nodeId}`);
    const choiceIndex = Math.floor(random() * scene.choices.length);
    await beforeChoice?.(scene.choices[choiceIndex], scene);
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
