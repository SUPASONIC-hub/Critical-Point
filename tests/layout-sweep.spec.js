import { expect, test } from "./helpers/network.js";
import { writeFileSync } from "node:fs";
import { CASE_SEQUENCE, nodeOrders, nodes } from "../src/gameData.js";
import { startDebugNode } from "./helpers/gameFlow.js";
import { FIVE_RELICS, LAYOUT_VIEWPORTS, measureTable, OVERCLOCKED_BOARD, openBrokenBoard } from "./helpers/layout.js";

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
 */
for (const caseId of CASE_SEQUENCE) {
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
        await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
        const row = { caseId, nodeId, name, ...(await measureTable(page)) };
        rows.push(row);
        if (row.lastCard > row.actionsTop) failures.push(`${nodeId} @ ${name}: last card ${row.lastCard - row.actionsTop}px under the action bar (${row.cards} cards)`);
        if (row.widest > row.innerWidth + 1) failures.push(`${nodeId} @ ${name}: ${row.widest - row.innerWidth}px wider than the screen`);
      }
    }
    if (process.env.LAYOUT_REPORT_DIR) writeFileSync(`${process.env.LAYOUT_REPORT_DIR}/layout-${caseId}.json`, JSON.stringify(rows));
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
 * The 390x844 phone and the laptop are held. The 360x740 phone is measured and
 * written to the report, and is not held yet: the first run of this pass
 * (2026-10-08, Chromium, 사건 01 and the finale) found every five-card scene it
 * opened there with its last card under the action bar -- 사건 01 by 19, 35 and
 * 52px, the finale by 4, 4, 4 and 21px -- while the other two sizes fit. That
 * is a defect in the table's small-phone layout, not in this test, and it is
 * the `fixme` below until the layout is fixed.
 */
const HEAVY_BOARD = { schema: OVERCLOCKED_BOARD, streak: 2, runPot: 4200, relics: FIVE_RELICS };
const SMALL_PHONE = "small phone";
// The furthest any last card sat under the bar on 2026-10-08 was 52px. Past
// this the small phone has got worse, and that fails.
const SMALL_PHONE_WORST_PX = 56;

function fullestScenes(caseId) {
  const hands = nodeOrders[caseId].map((nodeId) => [nodeId, nodes[nodeId].choices.filter((choice) => choice.type !== "reframe").length]);
  const most = Math.max(...hands.map(([, count]) => count));
  return hands.filter(([, count]) => count === most).map(([nodeId]) => nodeId);
}

for (const caseId of CASE_SEQUENCE) {
  test(`the fullest ${caseId} hands fit on an overclocked board with five relics @layout`, async ({ page }) => {
    test.setTimeout(600_000);
    const nodeIds = fullestScenes(caseId);
    expect(nodeIds.length, `${caseId} has no scene to measure`).toBeGreaterThan(0);
    const rows = [];
    const failures = [];
    const notHeldYet = [];
    for (const nodeId of nodeIds) {
      for (const [name, size] of Object.entries(LAYOUT_VIEWPORTS)) {
        await page.setViewportSize(size);
        await openBrokenBoard(page, caseId, nodeId, HEAVY_BOARD);
        await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
        // The board measured is the heavy one: the rules are on the table and
        // all five relics are in the row. A save the app repaired back to a
        // plain board would otherwise be measured and called a pass.
        await expect(page.getByTestId("active-mutations"), `${nodeId} @ ${name}: the changed rules are on the table`).toBeVisible();
        await expect(page.getByTestId("gauntlet-relics").locator(".gx-relic-chip"),`${nodeId} @ ${name}: five relics are carried`).toHaveCount(FIVE_RELICS.length);
        const row = { caseId, nodeId, name, board: "overclocked, five relics", ...(await measureTable(page)) };
        rows.push(row);
        if (name === SMALL_PHONE && row.lastCard > row.actionsTop) {
          if (row.lastCard - row.actionsTop > SMALL_PHONE_WORST_PX) {
            failures.push(`${nodeId} @ ${name}: last card ${row.lastCard - row.actionsTop}px under the action bar, further than the ${SMALL_PHONE_WORST_PX}px this size is known to miss by`);
          }
          notHeldYet.push(`${nodeId} @ ${name}: last card ${row.lastCard - row.actionsTop}px under the action bar (${row.cards} cards)`);
          continue;
        }
        if (row.lastCard > row.actionsTop) failures.push(`${nodeId} @ ${name}: last card ${row.lastCard - row.actionsTop}px under the action bar (${row.cards} cards)`);
        if (row.widest > row.innerWidth + 1) failures.push(`${nodeId} @ ${name}: ${row.widest - row.innerWidth}px wider than the screen`);
      }
    }
    if (process.env.LAYOUT_REPORT_DIR) writeFileSync(`${process.env.LAYOUT_REPORT_DIR}/layout-heavy-${caseId}.json`, JSON.stringify(rows));
    // Printed in the run's own report, so the weekly pass says how far off the small phone is.
    if (notHeldYet.length) test.info().annotations.push({ type: "360x740, not held yet", description: notHeldYet.join("; ") });
    expect(failures, failures.join("\n")).toEqual([]);
  });
}

// The defect, on the scene that showed it worst. Marked as failing: while the
// last card is under the bar this test fails as expected and the run is green;
// the day the small phone is fixed it passes, Playwright reports that as a
// failure, and whoever fixed it holds SMALL_PHONE in the loop above and deletes
// this test.
test("the fullest 사건 01 hand fits a 360x740 phone on an overclocked board with five relics @layout", async ({ page }) => {
  test.fail(true, "360x740: c1_start_hold's last card sat 52px under the action bar on 2026-10-08 (the small-phone table layout, not this test)");
  await page.setViewportSize(LAYOUT_VIEWPORTS[SMALL_PHONE]);
  await openBrokenBoard(page, "case01", "c1_start_hold", HEAVY_BOARD);
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await expect(page.getByTestId("gauntlet-relics").locator(".gx-relic-chip")).toHaveCount(FIVE_RELICS.length);
  const row = await measureTable(page);
  expect(row.lastCard, `last card ${row.lastCard - row.actionsTop}px under the action bar`).toBeLessThanOrEqual(row.actionsTop);
});
