/**
 * Fast runtime check: load every screen once and fail on any page error.
 * Catches ReferenceErrors from refactors that a bundler build cannot see.
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

async function step(label, fn) {
  const before = errors.length;
  try {
    await fn();
  } catch (e) {
    errors.push(`${label}: THREW ${String(e).split("\n")[0]}`);
  }
  const added = errors.slice(before);
  console.log(`${added.length ? "FAIL" : "ok  "}  ${label}${added.length ? " -> " + added[0] : ""}`);
}

async function fresh() {
  await page.goto(`${url}/?debug=1`);
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch {
      // Storage can be blocked; the smoke run does not depend on it.
    }
  });
  await page.goto(`${url}/?debug=1`);
  await page.waitForSelector(".intro-shell", { timeout: 10000 });
}

await step("intro loads", fresh);

await step("debug jump into a scene", async () => {
  // The season's first case, so the smoke run walks the door the player uses.
  await page.getByTestId("debug-case-select").selectOption("prologue01");
  await page.getByTestId("debug-node-select").selectOption("p1_start");
  await page.getByTestId("debug-start-node").click();
  await page.waitForSelector(".game-shell", { timeout: 10000 });
});

/**
 * Stake a card and cash it. A sealed card opens once the gauge reaches the seal,
 * which is always reachable without crossing the lowest wall, so the helper
 * pushes until the cash button enables.
 */
async function stakeAndCash(cardIndex = 0) {
  await openTable();
  await page.locator(".choices .choice").nth(cardIndex).evaluate((b) => b.click());
  const cash = page.getByTestId("commit-confirm");
  for (let press = 0; press < 6 && !(await cash.isEnabled()); press += 1) {
    await page.getByTestId("commit-push").evaluate((b) => b.click());
    await page.waitForTimeout(80);
  }
  await cash.evaluate((b) => b.click());
}

/**
  * The window opens on its briefing page with the clock held, so every flow below
  * starts the table before it can press anything on it.
  */
async function openTable() {
  await page.evaluate(() => {
    document.querySelector("[data-testid='relic-skip']")?.click();
    document.querySelector("[data-testid='open-table']")?.click();
  });
}

await step("stake a card on the table", async () => {
  await openTable();
  await page.locator(".choices .choice").first().evaluate((b) => b.click());
  await page.waitForSelector(".gx-card.selected", { timeout: 8000 });
});

await step("push raises the gauge", async () => {
  await page.getByTestId("commit-push").evaluate((b) => b.click());
  await page.waitForFunction(() => Number(document.querySelector("[data-testid='gauntlet-gauge']")?.textContent) > 0, undefined, { timeout: 4000 });
});

await step("cash and reveal", async () => {
  await page.getByTestId("commit-confirm").evaluate((b) => b.click());
  await page.waitForSelector("[data-testid='decision-next']", { timeout: 10000 });
  await page.getByTestId("decision-next").evaluate((b) => b.click());
  await page.waitForSelector(".game-shell", { timeout: 8000 });
});

await step("open every drawer", async () => {
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  await page.waitForTimeout(400);
});

await step("reload restores the run", async () => {
  await page.reload();
  await page.waitForSelector(".game-shell", { timeout: 10000 });
});

await step("play through to a result page", async () => {
  for (let i = 0; i < 14; i += 1) {
    if (await page.locator(".result-page").isVisible().catch(() => false)) return;
    if (!(await page.locator(".choices .choice").count())) return;
    await stakeAndCash(0);
    await page.waitForSelector("[data-testid='decision-next']", { timeout: 10000 });
    await page.evaluate(() => document.querySelector("[data-testid='decision-next']")?.click());
    await page.waitForTimeout(200);
  }
});

await step("free-text scene accepts input", async () => {
  await page.goto(`${url}/?debug=1`);
  await page.evaluate(() => {
    try {
      localStorage.clear();
    } catch {
      // Storage can be blocked; the smoke run does not depend on it.
    }
  });
  await page.goto(`${url}/?debug=1`);
  await page.getByTestId("debug-case-select").selectOption("case02");
  await page.getByTestId("debug-node-select").selectOption("c2_pressure");
  await page.getByTestId("debug-start-node").click();
  await page.waitForSelector(".game-shell", { timeout: 10000 });
  await openTable();
  await page.locator(".gx-card-wild").evaluate((b) => b.click());
  await page.locator(".reframe-box textarea").fill("직원과 협력사 조건을 분리하고 원본 기록을 확인한 뒤 위험을 공개한다.");
  await page.waitForTimeout(500);
});

await browser.close();

if (errors.length) {
  console.log(`\n${errors.length} runtime error(s):`);
  [...new Set(errors)].slice(0, 12).forEach((e) => console.log("  " + e));
  process.exit(1);
}
console.log("\nno runtime errors");
