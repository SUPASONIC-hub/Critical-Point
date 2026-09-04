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
  await page.getByTestId("debug-case-select").selectOption("case01");
  await page.getByTestId("debug-node-select").selectOption("start");
  await page.getByTestId("debug-start-node").click();
  await page.waitForSelector(".game-shell", { timeout: 10000 });
});

await step("select a choice (commit console)", async () => {
  await page.locator(".choices .choice").first().evaluate((b) => b.click());
  await page.waitForSelector(".commit-console", { timeout: 8000 });
});

await step("commit and reveal", async () => {
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
    await page.locator(".choices .choice").first().evaluate((b) => b.click());
    const c = page.getByTestId("commit-confirm");
    if (await c.isVisible().catch(() => false)) await c.evaluate((b) => b.click());
    await page.waitForTimeout(250);
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
