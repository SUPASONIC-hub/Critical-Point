import { expect, test } from "./helpers/network.js";
import { writeFileSync } from "node:fs";
import { LOCALE_KEY } from "../src/appConfig.js";
import { CASE_SEQUENCE, nodeOrders, nodes } from "../src/gameData.js";
import { dismissProtocolBreach, startDebugNode } from "./helpers/gameFlow.js";
import { FIVE_RELICS, LAYOUT_VIEWPORTS, measureStakedTable, measureTable,OVERCLOCKED_BOARD, openBrokenBoard } from "./helpers/layout.js";
import { readJsonStorage, TEST_STORAGE_KEYS, writeJsonStorage } from "./helpers/storage.js";

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

/**
 * LAYOUT_BANK=max (or cap) measures the same hands under the numbers a run
 * carries late in the season. A debug jump opens every scene on a fresh table:
 * a pot of 0, an empty vault, no streak. Measured 2026-10-30, the bank row
 * over the hand (`.gx-bank`: pot, vault, and the streak / BUST / best line)
 * took one line at 0 and two at the numbers below on a 360px phone, and the
 * second line put the last card of a five-card hand under the action bar.
 *
 * `max` is as large as a season plays: a pot of 99,999, a vault of 1,999,999
 * (the season's closing vault averaged 866,939 in the B2 measurement), a streak
 * of 49, 99 busts, a best of x64 (HIGH ROLLER). `cap` is what the engine lets
 * them reach at all: the vault and pot have no ceiling, so 999,999 and
 * 9,999,999 stand in for them; busts 999, the best x512 (`normalizeRunState`).
 *
 * The numbers are written into the save from a static page on the same origin
 * and the scene is loaded again, as `openBrokenBoard` does: a reload a scene,
 * where the plain pass jumps without one. Unset, the pass is as it was.
 */
const LAYOUT_BANK = process.env.LAYOUT_BANK ?? "";
const BANK_TABLES = {
  max: { runPot: 99_999, vault: 1_999_999, streak: 49, busts: 99, bestMultiplier: 64 },
  cap: { runPot: 999_999, vault: 9_999_999, streak: 99, busts: 999, bestMultiplier: 512 },
};
if (LAYOUT_BANK && !BANK_TABLES[LAYOUT_BANK]) throw new Error(`LAYOUT_BANK=${LAYOUT_BANK}: the bank tables are ${Object.keys(BANK_TABLES).join(", ")}`);
const BANK = BANK_TABLES[LAYOUT_BANK] ?? null;
const BANK_SUFFIX = BANK ? `-bank-${LAYOUT_BANK}` : "";
if (BANK && !HAND5) throw new Error("LAYOUT_BANK measures the hand5 pass: set LAYOUT_SCENES=hand5 with it");

async function loadBank(page, nodeId) {
  await page.goto("/profile.jpg");
  const save = await readJsonStorage(page, TEST_STORAGE_KEYS.save);
  expect(save?.nodeId, `${nodeId}: the save holds the scene`).toBe(nodeId);
  save.dynamics = { ...(save.dynamics ?? {}), ...BANK, handVault: 0, runHand: 0 };
  await writeJsonStorage(page, TEST_STORAGE_KEYS.save, save);
  await page.goto("/?debug=1");
  await page.locator(".choices .choice").first().waitFor();
  await dismissProtocolBreach(page);
  await expect(page.getByTestId("gauntlet-run-pot"), `${nodeId}: the bank is the one written`).toHaveText(BANK.runPot.toLocaleString("en-US"));
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; } .gx-table { transform: none !important; }" });
}

/** The bank row and the HUD it sits in, so a report says how many lines the numbers took. */
async function measureBank(page) {
  return page.evaluate(() => {
    const height = (selector) => Math.round(document.querySelector(selector)?.getBoundingClientRect().height ?? 0);
    return { bankHeight: height(".gx-bank"), hudHeight: height(".gx-hud"), bankText: document.querySelector(".gx-bank")?.textContent.replace(/\s+/g, " ").trim() ?? "" };
  });
}

/**
 * The signals row over the hand: the overclock line, LOCK and the logic
 * streak, each in its own column of the HUD. On a 360px phone in English and
 * Japanese the streak's longer line once left LOCK less than its own width,
 * and LOCK ran under the streak (Linux, hand5, 2026-11-03: en 15 to 25px, ja
 * 8 to 18px). `overlap` is how far any one runs into the next or past the
 * row's end; `slack` is the row's width less the least the three can take,
 * gaps counted: the overclock line's word (its sentence is the one cut with an
 * ellipsis), LOCK and the streak whole. Below 0 something runs over.
 */
async function measureSignals(page) {
  return page.evaluate(() => {
    const row = document.querySelector(".gx-signals");
    if (!row) return null;
    const kids = [...row.children];
    const style = getComputedStyle(row);
    const right = row.getBoundingClientRect().right - parseFloat(style.paddingRight);
    // scrollWidth is a whole number: it counts only past a pixel of rounding.
    const ends = kids.map((el) => { const box = el.getBoundingClientRect(); return { left: box.left, right: el.scrollWidth > el.clientWidth + 1 ? box.left + el.scrollWidth : box.right }; });
    const overlap = Math.max(0, ...ends.slice(0, -1).map((end, i) => end.right - ends[i + 1].left), ...ends.map((end) => end.right - right));
    const columns = row.style.gridTemplateColumns;
    row.style.gridTemplateColumns = kids.map(() => "max-content").join(" ");
    const least = (el) => (el.matches(".gx-overdrive") ? el.querySelector("b").getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap) : el.getBoundingClientRect().width);
    const need = kids.reduce((sum, el) => sum + least(el), 0) + parseFloat(style.columnGap) * (kids.length - 1);
    row.style.gridTemplateColumns = columns;
    const inner = row.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    return { overlap: Math.round(overlap), slack: Math.round(inner - need), text: kids.map((el) => el.textContent.replace(/\s+/g, " ").trim()) };
  });
}

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
  test(`the five-card ${caseId} hands fit above the action bar on a 360x740 phone${BANK ? ` with a ${LAYOUT_BANK} bank` : ", without reloads"} @layout`, async ({ page }) => {
    const nodeIds = fiveCardScenes(caseId);
    test.skip(!nodeIds.length, `${caseId} deals no five-card hand`);
    test.setTimeout(60_000 + nodeIds.length * (BANK ? 45_000 : 30_000));
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
      if (BANK) await loadBank(page, nodeId);
      await expectLayoutLang(page, nodeId);
      await page.locator(".choices .choice").first().waitFor();
      await page.locator(".gx-hand").evaluate(async (hand) => {
        const ending = hand.getAnimations({ subtree: true }).filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime));
        await Promise.all(ending.map((animation) => animation.finished.catch(() => {})));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      const row = { caseId, nodeId, name: "small phone", ...(BANK ? { bank: LAYOUT_BANK } : null), ...(await measureTable(page)), ...(await measureBank(page)), signals: await measureSignals(page), hand: await measureCards(page) };
      rows.push(row);
      if (row.signals?.overlap > 0) failures.push(`${nodeId}: the signals row runs ${row.signals.overlap}px into itself (${row.signals.text.join(" | ")})`);
      if (row.lastCard > row.actionsTop) {
        const lastRow = row.hand.filter((card) => card.bottom > row.actionsTop);
        const tallest = lastRow.reduce((a, b) => (b.height > a.height ? b : a), lastRow[0]);
        failures.push(`${nodeId}: last card ${row.lastCard - row.actionsTop}px under the action bar (${row.cards} cards; tallest under it: "${tallest?.label}" ${tallest?.height}px)`);
      }
      if (row.widest > row.innerWidth + 1) failures.push(`${nodeId}: ${row.widest - row.innerWidth}px wider than the screen`);
    }
    if (process.env.LAYOUT_REPORT_DIR) writeFileSync(`${process.env.LAYOUT_REPORT_DIR}/layout-hand5-${caseId}${REPORT_SUFFIX}${BANK_SUFFIX}.json`, JSON.stringify(rows));
    expect(failures, failures.join("\n")).toEqual([]);
  });
}

/**
 * Each case's walk is two tests, the first and second half of its scenes. As
 * one test a case took 5 to 11 minutes on a hand-started run, and 6 to 15.4 on
 * the scheduled run of 2026-11-09, where every case ran about 40% slower and
 * case01 went over the 15-minute limit. Halved, the longest is about 8 minutes
 * on the slower runner, and the limit stays as it was.
 */
const SWEEP_PARTS = 2;

for (const caseId of HAND5 ? [] : CASE_SEQUENCE) for (let part = 1; part <= SWEEP_PARTS; part += 1) {
  test(`every ${caseId} decision fits above the action bar (part ${part}/${SWEEP_PARTS}) @layout`, async ({ page }) => {
    test.setTimeout(900_000);
    await page.goto("/?debug=1");
    await page.getByTestId("debug-case-select").selectOption(caseId);
    const allNodeIds = await page.getByTestId("debug-node-select").locator("option").evaluateAll((options) => options.map((option) => option.value));
    expect(allNodeIds.length).toBeGreaterThan(0);
    const size = Math.ceil(allNodeIds.length / SWEEP_PARTS);
    const nodeIds = allNodeIds.slice((part - 1) * size, part * size);
    test.skip(!nodeIds.length, `${caseId} has fewer than ${SWEEP_PARTS} scenes`);
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
    if (process.env.LAYOUT_REPORT_DIR) writeFileSync(`${process.env.LAYOUT_REPORT_DIR}/layout-${caseId}-part${part}${REPORT_SUFFIX}.json`, JSON.stringify(rows));
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
 *
 * On the 390x844 phone 사건 01 put a staked hand up to 9px under the bar
 * (c1_start_hold, c1_start_record, c1_start_alone; Linux, Korean, 2026-11-10)
 * with the detail's two lines. The detail is one line there now too, the hand
 * ends 12px above the bar, and that phone holds 사건 01 staked, with no
 * allowance. Measured staked in every case the same day with one line, other
 * scenes were still under at 390x844: up to 16px in Korean (c33_mother),
 * 20 in Japanese (c18_route_system), 16 in English (c38_witness). Those are
 * not held yet.
 */
const HEAVY_BOARD = { schema: OVERCLOCKED_BOARD, streak: 2, runPot: 4200, relics: FIVE_RELICS };
const STAKED_CASES = ["case01", "case05", "final"];
const STAKED_UNDER_THE_BAR = { c1_start_hold: 14 };
const STAKED_ON = { "small phone": STAKED_CASES, phone: ["case01"] };

/**
 * The same board late in a season: the bank row at the max table's numbers
 * (LAYOUT_BANK above), on both phones. Measured apart, each fit; together
 * the bank's second line on the heavy board put the last card of a five-card
 * hand 18px under the action bar in Korean and 9px in Japanese (Linux, c6_desk,
 * 2026-11-09). With the chain lit by the streak the signals row is held too,
 * on both phones: at 390px the English STRIKE was squeezed to 68px of its 81.
 * On the 390x844 phone the relics took a third line of the bank row and put
 * the last card 22px under the bar in Korean (c33_mother) and 20px in Japanese
 * (c7_paper; Linux, 2026-11-10), so that phone takes the visit as well.
 * The visits are a fifth load a scene, so a case's time limit is 20 minutes
 * (15 with the 360px visit alone; case17 took 5.7 on Windows with it).
 */
const HEAVY_BANK_BOARD = { ...HEAVY_BOARD, runPot: BANK_TABLES.max.runPot, streak: BANK_TABLES.max.streak, run: { ...BANK_TABLES.max, handVault: 0, runHand: 0 } };

function checkHeavyRow(row, failures) {
  const where = `${row.nodeId} @ ${row.name}${row.bankHeight === undefined ? "" : ", max bank"}`;
  if (row.lastCard > row.actionsTop) failures.push(`${where}: last card ${row.lastCard - row.actionsTop}px under the action bar (${row.cards} cards)`);
  if (row.widest > row.innerWidth + 1) failures.push(`${where}: ${row.widest - row.innerWidth}px wider than the screen`);
  if (row.signals?.overlap > 0) failures.push(`${where}: the signals row runs ${row.signals.overlap}px into itself (${row.signals.text.join(" | ")})`);
}

function fullestScenes(caseId) {
  const hands = nodeOrders[caseId].map((nodeId) => [nodeId, nodes[nodeId].choices.filter((choice) => choice.type !== "reframe").length]);
  const most = Math.max(...hands.map(([, count]) => count));
  return hands.filter(([, count]) => count === most).map(([nodeId]) => nodeId);
}

for (const caseId of HAND5 ? [] : CASE_SEQUENCE) {
  test(`the fullest ${caseId} hands fit on an overclocked board with five relics @layout`, async ({ page }) => {
    test.setTimeout(1_200_000);
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
        const row = { caseId, nodeId, name, board: "overclocked, five relics", ...(await measureTable(page)), ...(name === "laptop" ? null : { signals: await measureSignals(page) }) };
        rows.push(row);
        checkHeavyRow(row, failures);
        if (STAKED_ON[name]?.includes(caseId)) {
          const staked = await measureStakedTable(page);
          expect(staked.length, `${nodeId} @ ${name}: no card could be staked`).toBeGreaterThan(0);
          rows.push(...staked.map((stake) => ({ ...row, ...stake })));
          const allowed = name === "small phone" ? (STAKED_UNDER_THE_BAR[nodeId] ?? 0) : 0;
          for (const stake of staked) {
            const under = stake.lastCard - stake.actionsTop;
            if (under > allowed) failures.push(`${nodeId} @ ${name}, card ${stake.staked} staked: last card ${under}px under the action bar (${allowed}px allowed)`);
          }
        }
        if (name === "laptop") continue;
        await openBrokenBoard(page, caseId, nodeId, HEAVY_BANK_BOARD);
        await expectLayoutLang(page, `${nodeId} @ ${name}, max bank`);
        await page.addStyleTag({ content: ".debug-overlay { display: none !important; } .gx-table { transform: none !important; }" });
        await expect(page.getByTestId("gauntlet-run-pot"), `${nodeId} @ ${name}: the bank is the one written`).toHaveText(BANK_TABLES.max.runPot.toLocaleString("en-US"));
        const banked = { caseId, nodeId, name, board: "overclocked, five relics, max bank", ...(await measureTable(page)), ...(await measureBank(page)), signals: await measureSignals(page) };
        rows.push(banked);
        checkHeavyRow(banked, failures);
      }
    }
    if (process.env.LAYOUT_REPORT_DIR) writeFileSync(`${process.env.LAYOUT_REPORT_DIR}/layout-heavy-${caseId}${REPORT_SUFFIX}.json`, JSON.stringify(rows));
    expect(failures, failures.join("\n")).toEqual([]);
  });
}
