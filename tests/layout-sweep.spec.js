import { expect, test } from "./helpers/network.js";
import { writeFileSync } from "node:fs";
import { LOCALE_KEY } from "../src/appConfig.js";
import { CASE_SEQUENCE, nodeOrders, nodes } from "../src/gameData.js";
import { dismissProtocolBreach, startDebugNode } from "./helpers/gameFlow.js";
import { FIVE_RELICS, LAYOUT_VIEWPORTS, measureStakedTable, measureTable,OVERCLOCKED_BOARD, openBrokenBoard } from "./helpers/layout.js";

/**
 * Every decision in the game, on every screen the table promises to fit.
 *
 * `gauntlet-loop.spec.js` holds the densest scenes on each push; this walks all
 * of them. It is slow -- every scene in the graph at three sizes -- so it runs with the weekly
 * full-coverage pass (`npm run test:e2e:full`), not on every push. It was
 * written after a measurement found 42 of 149 scenes hiding a card under the
 * action bar on a 390x844 phone, all 149 on a 360x740 one, and every five-card
 * scene on a 1366x768 laptop, while the one-screen test -- which only opened
 * case01's first scene and compared against the bottom of the viewport, not
 * the top of the bar -- stayed green.
 *
 * Failures are collected across the whole walk and reported together, so one
 * run names every scene that does not fit. Set LAYOUT_REPORT_DIR to also write
 * the measurements as JSON.
 *
 * Set LAYOUT_LANG (en, ja) to walk the same scenes on a page in that language:
 * English runs longer than the Korean, and Japanese is drawn in the system
 * face. The choice is kept in this device's storage before each page's own
 * scripts run, so it outlives the storage the debug jump clears. Unset, the
 * walk is the Korean one as it was; the report files take the language's code.
 */
const LAYOUT_LANG = process.env.LAYOUT_LANG ?? "";
const REPORT_SUFFIX = LAYOUT_LANG ? `-${LAYOUT_LANG}` : "";

if (LAYOUT_LANG) {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(([key, code]) => localStorage.setItem(key, code), [LOCALE_KEY, LAYOUT_LANG]);
  });
}

/** On a page in another language, that the table really is in it: a dictionary that never came would leave the Korean measured. */
async function expectLayoutLang(page, label) {
  if (LAYOUT_LANG) await expect(page.locator("html"), `${label}: the page is in ${LAYOUT_LANG}`).toHaveAttribute("lang", LAYOUT_LANG);
}
/**
 * LAYOUT_SCENES=hand5 is the narrow pass: the 360x740 phone only, and only the
 * scenes of each case that deal five cards, walked on one page by the debug
 * build's `window.__cpDebugJump` (GameRuntime.jsx) instead of a reload per
 * scene. The full walk in English or Japanese took about ten minutes a case;
 * this is the hand most likely to run under the bar on the screen most likely
 * to show it. Each row also carries every card's label and box, so a hand that
 * does not fit names the card that is tallest in its last row. The full walk
 * and the heavy-board pass below do not run in this mode; unset, they run as
 * they did.
 */
const LAYOUT_SCENES = process.env.LAYOUT_SCENES ?? "";
const HAND5 = LAYOUT_SCENES === "hand5";
if (LAYOUT_SCENES && !HAND5) throw new Error(`LAYOUT_SCENES=${LAYOUT_SCENES}: the only narrow mode is hand5`);

const fiveCardScenes = (caseId) => nodeOrders[caseId].filter((nodeId) => nodes[nodeId].choices.length === 5);

async function measureCards(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll(".choices .choice")].map((card) => {
      const box = card.getBoundingClientRect();
      const label = card.querySelector("[data-testid='card-label']");
      const lines = label ? Math.round(label.getBoundingClientRect().height / parseFloat(getComputedStyle(label).lineHeight)) : 0;
      return { label: label?.textContent ?? "", lines, locked: card.classList.contains("locked-choice"), top: Math.round(box.top), bottom: Math.round(box.bottom), height: Math.round(box.height) };
    }),
  );
}

for (const caseId of HAND5 ? CASE_SEQUENCE : []) {
  test(`the five-card ${caseId} hands fit above the action bar on a 360x740 phone, without reloads @layout`, async ({ page }) => {
    const nodeIds = fiveCardScenes(caseId);
    test.skip(!nodeIds.length, `${caseId} deals no five-card hand`);
    test.setTimeout(60_000 + nodeIds.length * 30_000);
    await page.setViewportSize(LAYOUT_VIEWPORTS["small phone"]);
    await startDebugNode(page, caseId, nodeIds[0]);
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; } .gx-table { transform: none !important; }" });
    const rows = [];
    const failures = [];
    for (const [index, nodeId] of nodeIds.entries()) {
      if (index > 0) {
        await page.evaluate(([c, n]) => window.__cpDebugJump(c, n), [caseId, nodeId]);
        await expect(page.getByTestId("debug-overlay").locator(".debug-overlay-heading b"), `${nodeId}: the jump landed`).toHaveText(`${caseId} / ${nodeId}`);
        await dismissProtocolBreach(page);
      }
      await expectLayoutLang(page, nodeId);
      await page.locator(".choices .choice").first().waitFor();
      await page.locator(".gx-hand").evaluate(async (hand) => {
        const ending = hand.getAnimations({ subtree: true }).filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime));
        await Promise.all(ending.map((animation) => animation.finished.catch(() => {})));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      const row = { caseId, nodeId, name: "small phone", ...(await measureTable(page)), hand: await measureCards(page) };
      rows.push(row);
      if (row.lastCard > row.actionsTop) {
        const lastRow = row.hand.filter((card) => card.bottom > row.actionsTop);
        const tallest = lastRow.reduce((a, b) => (b.height > a.height ? b : a), lastRow[0]);
        failures.push(`${nodeId}: last card ${row.lastCard - row.actionsTop}px under the action bar (${row.cards} cards; tallest under it: "${tallest?.label}" ${tallest?.height}px)`);
      }
      if (row.widest > row.innerWidth + 1) failures.push(`${nodeId}: ${row.widest - row.innerWidth}px wider than the screen`);
    }
    if (process.env.LAYOUT_REPORT_DIR) writeFileSync(`${process.env.LAYOUT_REPORT_DIR}/layout-hand5-${caseId}${REPORT_SUFFIX}.json`, JSON.stringify(rows));
    expect(failures, failures.join("\n")).toEqual([]);
  });
}

for (const caseId of HAND5 ? [] : CASE_SEQUENCE) {
  test(`every ${caseId} decision fits above the action bar @layout`, async ({ page }) => {
    test.setTimeout(900_000);
    await page.goto("/?debug=1");
    await page.getByTestId("debug-case-select").selectOption(caseId);
    const nodeIds = await page.getByTestId("debug-node-select").locator("option").evaluateAll((options) => options.map((option) => option.value));
    const rows = [];
    const failures = [];
    for (const nodeId of nodeIds) {
      for (const [name, size] of Object.entries(LAYOUT_VIEWPORTS)) {
        await page.setViewportSize(size);
        await startDebugNode(page, caseId, nodeId);
        await expectLayoutLang(page, `${nodeId} @ ${name}`);
        await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
        const row = { caseId, nodeId, name, ...(await measureTable(page)) };
        rows.push(row);
        if (row.lastCard > row.actionsTop) failures.push(`${nodeId} @ ${name}: last card ${row.lastCard - row.actionsTop}px under the action bar (${row.cards} cards)`);
        if (row.widest > row.innerWidth + 1) failures.push(`${nodeId} @ ${name}: ${row.widest - row.innerWidth}px wider than the screen`);
      }
    }
    if (process.env.LAYOUT_REPORT_DIR) writeFileSync(`${process.env.LAYOUT_REPORT_DIR}/layout-${caseId}${REPORT_SUFFIX}.json`, JSON.stringify(rows));
    expect(nodeIds.length).toBeGreaterThan(0);
    expect(failures, failures.join("\n")).toEqual([]);
  });
}

/**
 * The same measurement on the heaviest table there is. The walk above opens
 * every scene on the board a debug jump deals: no changed rules, no relics. A
 * run in its thirtieth case has both, and each takes height from the hand -- a
 * rule chip on every card, a row of relics over them. `gauntlet-loop.spec.js`
 * holds two scenes to that board on each push; nothing held the rest of the
 * season to it (the 2026-10-07 audit, B4 finding 10).
 *
 * Not every scene again: the scenes of each case that deal the most cards,
 * since a hand that fits with five cards fits with four. That is one to three
 * scenes a case, so the weekly pass grows by about a tenth and not by half.
 *
 * All three sizes are held. The 360x740 phone was not at first: the first run
 * of this pass (2026-10-08, Chromium) found every five-card scene it opened
 * there with its last card under the action bar -- 사건 01 by 19, 35 and 52px,
 * 사건 05 by up to 28px, the finale by 4 to 21px -- while the other two sizes
 * fit. On a short phone a board with changed rules now gives the rules line the
 * situation board's place (play.css), and the same scenes clear the bar.
 *
 * That was the hand before a card is chosen. A staked card opens a detail line
 * and its row grows by it, and on the 360x740 phone that put the hand back
 * under the bar: measured 2026-10-09 with each card staked in turn, fifteen
 * stakes across six of the ten five-card scenes of 사건 01, 사건 05 and the
 * finale, by 2 to 35px. On a short phone the staked card's detail is now one
 * line (play.css), and those three cases are held with every card staked, on
 * the same visit that measures the unstaked hand. The other 52 cases have not
 * been measured staked.
 *
 * One scene is not clear and is held where it is: `c1_start_hold`, 14px under
 * with its first or third card staked and 11px with its fifth. Its hand ends
 * 9px above the bar before anything is staked and one line of detail costs
 * 23px; the fifth card takes a whole row, so its detail was already one line.
 * The allowance is a ceiling, so the scene cannot slip further, and it is to be
 * lowered or deleted when the scene is given the room.
 */
const HEAVY_BOARD = { schema: OVERCLOCKED_BOARD, streak: 2, runPot: 4200, relics: FIVE_RELICS };
const STAKED_CASES = ["case01", "case05", "final"];
const STAKED_UNDER_THE_BAR = { c1_start_hold: 14 };

function fullestScenes(caseId) {
  const hands = nodeOrders[caseId].map((nodeId) => [nodeId, nodes[nodeId].choices.filter((choice) => choice.type !== "reframe").length]);
  const most = Math.max(...hands.map(([, count]) => count));
  return hands.filter(([, count]) => count === most).map(([nodeId]) => nodeId);
}

for (const caseId of HAND5 ? [] : CASE_SEQUENCE) {
  test(`the fullest ${caseId} hands fit on an overclocked board with five relics @layout`, async ({ page }) => {
    test.setTimeout(600_000);
    const nodeIds = fullestScenes(caseId);
    expect(nodeIds.length, `${caseId} has no scene to measure`).toBeGreaterThan(0);
    const rows = [];
    const failures = [];
    for (const nodeId of nodeIds) {
      for (const [name, size] of Object.entries(LAYOUT_VIEWPORTS)) {
        await page.setViewportSize(size);
        await openBrokenBoard(page, caseId, nodeId, HEAVY_BOARD);
        await expectLayoutLang(page, `${nodeId} @ ${name}`);
        await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
        // The board measured is the heavy one: the rules are on the table and
        // all five relics are in the row. A save the app repaired back to a
        // plain board would otherwise be measured and called a pass.
        await expect(page.getByTestId("active-mutations"), `${nodeId} @ ${name}: the changed rules are on the table`).toBeVisible();
        await expect(page.getByTestId("gauntlet-relics").locator(".gx-relic-chip"),`${nodeId} @ ${name}: five relics are carried`).toHaveCount(FIVE_RELICS.length);
        const row = { caseId, nodeId, name, board: "overclocked, five relics", ...(await measureTable(page)) };
        rows.push(row);
        if (row.lastCard > row.actionsTop) failures.push(`${nodeId} @ ${name}: last card ${row.lastCard - row.actionsTop}px under the action bar (${row.cards} cards)`);
        if (row.widest > row.innerWidth + 1) failures.push(`${nodeId} @ ${name}: ${row.widest - row.innerWidth}px wider than the screen`);
        if (name !== "small phone" || !STAKED_CASES.includes(caseId)) continue;
        const staked = await measureStakedTable(page);
        expect(staked.length, `${nodeId} @ ${name}: no card could be staked`).toBeGreaterThan(0);
        rows.push(...staked.map((stake) => ({ ...row, ...stake })));
        const allowed = STAKED_UNDER_THE_BAR[nodeId] ?? 0;
        for (const stake of staked) {
          const under = stake.lastCard - stake.actionsTop;
          if (under > allowed) failures.push(`${nodeId} @ ${name}, card ${stake.staked} staked: last card ${under}px under the action bar (${allowed}px allowed)`);
        }
      }
    }
    if (process.env.LAYOUT_REPORT_DIR) writeFileSync(`${process.env.LAYOUT_REPORT_DIR}/layout-heavy-${caseId}${REPORT_SUFFIX}.json`, JSON.stringify(rows));
    expect(failures, failures.join("\n")).toEqual([]);
  });
}
