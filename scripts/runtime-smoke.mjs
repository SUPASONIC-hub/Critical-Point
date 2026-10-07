/**
 * Fast runtime check: load every screen once and fail on any page error.
 * Catches ReferenceErrors from refactors that a bundler build cannot see.
 *
 * It runs against the production build (`npm run test:runtime`, which serves
 * dist/ with `vite preview`) as well as the dev server (`test:runtime:dev`).
 * Debug tools are compiled out of the production build, so there the run
 * enters through the intro's own start button -- which opens the same first
 * case the debug jump names -- and uses the tables that case deals.
 */
import { chromium } from "@playwright/test";

const url = process.env.BASE_URL || "http://127.0.0.1:5197";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];

page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 200)}`);
});
page.on("crash", () => errors.push("PAGE CRASHED"));

// The e2e build is given a made-up backend (.env.e2e), and since 2026-10-07 a
// device with no save starts with the playtest-data box ticked: closing a case
// sends its row. Nothing answers at that address, and the failed request is a
// console error this walk would count as the app's. It is answered here with
// an empty backend, as the specs' network guard does (tests/helpers/network.js).
await page.route(/^https:\/\/[^/]*\.supabase\.co\//, (route) =>
  route.fulfill({ status: route.request().method() === "GET" ? 200 : 201, contentType: "application/json", body: "[]" }),
);

const TIMEOUT = 10_000;
// A cold dev server transforms the whole app on first load; give navigation room.
page.setDefaultNavigationTimeout(60_000);

async function step(label, fn) {
  const before = errors.length;
  try {
    await fn();
  } catch (e) {
    // "Timeout exceeded" says a selector never came; what was on screen instead
    // is what explains it.
    const screen = await page
      .evaluate(() => {
        const main = document.querySelector("main, .error-screen");
        const ids = [...document.querySelectorAll("[data-testid]")].map((element) => element.getAttribute("data-testid"));
        return `${main?.className || "no <main>"} [${[...new Set(ids)].slice(0, 12).join(", ")}]`;
      })
      .catch(() => "the page could not be read");
    errors.push(`${label}: THREW ${String(e).split("\n")[0]} -- on screen: ${screen}`);
  }
  const added = errors.slice(before);
  console.log(`${added.length ? "FAIL" : "ok  "}  ${label}${added.length ? " -> " + added[0] : ""}`);
}

async function fresh() {
  // Storage is cleared from a static file on the same origin, not from the
  // app: a run that is on screen saves itself as the page goes away, which put
  // the save straight back after it had been cleared from inside the game.
  await page.goto(`${url}/profile.jpg`);
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch {
      // Storage can be blocked; the smoke run does not depend on it.
    }
  });
  await page.goto(`${url}/?debug=1`);
  await page.waitForSelector(".intro-shell", { timeout: TIMEOUT });
}

let debugTools = false;

await step("intro loads", async () => {
  await fresh();
  debugTools = (await page.getByTestId("debug-case-select").count()) > 0;
  console.log(`      (${debugTools ? "debug tools present" : "no debug tools: production build"})`);
});

await step(debugTools ? "debug jump into a scene" : "start the first case from the intro", async () => {
  if (debugTools) {
    // The season's first case, so the smoke run walks the door the player uses.
    await page.getByTestId("debug-case-select").selectOption("prologue01");
    await page.getByTestId("debug-node-select").selectOption("p1_start");
    await page.getByTestId("debug-start-node").click();
  } else {
    await page.getByTestId("start-first-case").click();
  }
  await page.waitForSelector(".game-shell", { timeout: TIMEOUT });
});

const readSave = () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2") || "null"));

/**
 * The window opens on its briefing page with the clock held (and, between
 * cases, behind a relic draft), so every flow below clears those first. They
 * are never mounted at once; clear one, then look again.
 */
const GATES = "[data-testid='relic-skip'], [data-testid='open-table']";
async function openTable() {
  const gate = page.locator(GATES).first();
  await page.locator(".choices .choice, .result-page").first().waitFor();
  for (let pass = 0; pass < 4 && (await gate.isVisible()); pass += 1) {
    const cleared = await gate.getAttribute("data-testid");
    // A real click, where the pointer lands: a gate that is covered, off screen
    // or not taking pointer events has to fail here, as it would for a player.
    // This used to be a synthetic event, which reaches a button whatever is in
    // front of it.
    await gate.click({ timeout: TIMEOUT });
    // Settled: that gate is gone, and either the next one is up or the table is live.
    await page.waitForFunction(
      ({ cleared, gates }) =>
        !document.querySelector(`[data-testid='${cleared}']`) &&
        Boolean(
          document.querySelector(gates) ||
            document.querySelector(".choices .choice:not([aria-disabled='true'])") ||
            document.querySelector(".result-page"),
        ),
      { cleared, gates: GATES },
    );
  }
}

/**
 * Stake a card and cash it. A sealed card opens once the gauge reaches the seal,
 * which is always reachable without crossing the lowest wall, so this pushes
 * until the cash button enables.
 */
async function stakeAndCash(cardIndex = 0) {
  await openTable();
  await page.locator(".choices .choice").nth(cardIndex).click();
  const cash = page.getByTestId("commit-confirm");
  for (let press = 0; press < 6 && !(await cash.isEnabled()); press += 1) {
    await page.getByTestId("commit-push").click();
  }
  await cash.click();
}

await step("stake a card on the table", async () => {
  await openTable();
  await page.locator(".choices .choice").first().click();
  await page.waitForSelector(".gx-card.selected", { timeout: 8000 });
});

await step("push raises the gauge", async () => {
  await page.getByTestId("commit-push").click();
  await page.waitForFunction(() => Number(document.querySelector("[data-testid='gauntlet-gauge']")?.textContent) > 0, undefined, {
    timeout: 4000,
  });
});

await step("cash and reveal", async () => {
  await page.getByTestId("commit-confirm").click();
  await page.getByTestId("decision-next").click();
  await page.waitForSelector(".game-shell", { timeout: 8000 });
});

await step("open every drawer", async () => {
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  // Opening a drawer mounts what it holds; give that a frame to throw.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
});

await step("reload restores the run", async () => {
  await page.reload();
  await page.waitForSelector(".game-shell", { timeout: TIMEOUT });
});

await step("play through to a result page", async () => {
  const result = page.locator(".result-page");
  // A case deals about nine tables; thirty is room for the longest route.
  for (let i = 0; i < 30 && !(await result.isVisible()); i += 1) {
    await stakeAndCash(0);
    await page.getByTestId("decision-next").click();
    await page.locator(".choices .choice, .result-page").first().waitFor();
  }
  // The walk used to end without looking: fourteen steps or a missing card
  // both left the loop, and the step passed on whatever screen that was.
  await result.waitFor({ timeout: TIMEOUT });
  const saved = await readSave();
  if (!saved?.completedCases?.length) throw new Error("the result page is up but the save records no completed case");
  if (!(await page.getByTestId("export-play-log").isVisible())) throw new Error("the result page has no report actions");
});

await step("판을 다시 짠다 opens the case's hidden route", async () => {
  if (debugTools) {
    await fresh();
    await page.getByTestId("debug-case-select").selectOption("case02");
    await page.getByTestId("debug-node-select").selectOption("c2_pressure");
    await page.getByTestId("debug-start-node").click();
  } else {
    // No jump in this build: start a fresh run, whose first table deals the
    // wild card as well.
    await fresh();
    await page.getByTestId("start-first-case").click();
  }
  await page.waitForSelector(".game-shell", { timeout: TIMEOUT });
  await openTable();
  await page.locator(".gx-card-wild").click();
  await page.waitForSelector(".gx-card-wild.selected", { timeout: 8000 });
  // Staking the card opens nothing. The route opens on the cash, and the save
  // is where it says so.
  const before = (await readSave())?.nodeId;
  const cash = page.getByTestId("commit-confirm");
  for (let press = 0; press < 6 && !(await cash.isEnabled()); press += 1) {
    await page.getByTestId("commit-push").click();
  }
  await cash.click();
  await page.getByTestId("decision-next").click();
  await page.locator(".choices .choice").first().waitFor();
  const saved = await readSave();
  const entry = saved?.log?.at(-1);
  if (!entry?.reframeOpenedRoute) throw new Error(`the reframe card was cashed and the log does not record a route opening (${JSON.stringify(entry?.choiceId)})`);
  if (!saved.nodeId || saved.nodeId === before) throw new Error(`the run is still on ${before}`);
});

await browser.close();

if (errors.length) {
  console.log(`\n${errors.length} runtime error(s):`);
  [...new Set(errors)].slice(0, 12).forEach((e) => console.log("  " + e));
  process.exit(1);
}
console.log("\nno runtime errors");
