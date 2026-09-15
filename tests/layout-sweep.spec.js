import { expect, test } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { CASE_SEQUENCE } from "../src/gameData.js";
import { startDebugNode } from "./helpers/gameFlow.js";
import { LAYOUT_VIEWPORTS, measureTable } from "./helpers/layout.js";

/**
 * Every decision in the game, on every screen the table promises to fit.
 *
 * `gauntlet-loop.spec.js` holds the densest scenes on each push; this walks all
 * of them. It is slow -- 149 scenes at three sizes -- so it runs with the weekly
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
