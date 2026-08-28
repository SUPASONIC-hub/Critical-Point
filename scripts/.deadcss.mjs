/**
 * Finds CSS rules whose selectors never match anything in the running app.
 * Only the structural part of a selector is tested (pseudo-classes and
 * pseudo-elements are stripped) so hover/focus/::before rules survive as long
 * as their element exists somewhere.
 */
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import postcss from "postcss";

const url = process.env.BASE_URL || "http://127.0.0.1:5197";

const css = readFileSync("src/styles/app.css", "utf8");
const root = postcss.parse(css);

const selectors = new Set();
root.walkRules((rule) => {
  if (rule.parent?.type === "atrule" && rule.parent.name === "keyframes") return;
  for (const part of rule.selector.split(",")) selectors.add(part.trim());
});

const structural = (sel) =>
  sel
    .replace(/::[a-z-]+(\([^)]*\))?/g, "")
    .replace(/:(hover|focus|focus-visible|focus-within|active|disabled|checked|open|first-child|last-child|nth-child\([^)]*\)|not\([^)]*\)|is\([^)]*\)|where\([^)]*\)|has\([^)]*\)|placeholder|target|empty|only-child|read-only|indeterminate|default|valid|invalid|required|optional|root|before|after|any-link|link|visited|lang\([^)]*\)|dir\([^)]*\))/g, "")
    .replace(/\s+/g, " ")
    .trim();

const list = [...selectors].map((s) => ({ raw: s, test: structural(s) })).filter((s) => s.test);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const matched = new Set();

async function sweep(label) {
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  await page.waitForTimeout(250);
  const hits = await page.evaluate(
    (tests) =>
      tests.filter((t) => {
        try {
          return document.querySelector(t) !== null;
        } catch {
          return true; // unparseable here -> keep the rule
        }
      }),
    list.map((s) => s.test),
  );
  hits.forEach((h) => matched.add(h));
  console.log(`${label}: cumulative matched ${matched.size}/${list.length}`);
}

async function fresh() {
  await page.goto(`${url}/?debug=1`);
  await page.evaluate(() => { try { localStorage.clear(); } catch {} });
  await page.goto(`${url}/?debug=1`);
  await page.waitForSelector(".intro-shell", { timeout: 10000 });
}
async function jump(c, n) {
  await fresh();
  await page.getByTestId("debug-case-select").selectOption(c);
  await page.getByTestId("debug-node-select").selectOption(n);
  await page.getByTestId("debug-start-node").click();
  await page.waitForSelector(".game-shell", { timeout: 10000 });
}

await fresh();
await sweep("intro");

for (const [c, n] of [["case01", "start"], ["case02", "c2_final"], ["case03", "c3_trap"], ["case04", "c4_vote"], ["case05", "c5_voice"], ["final", "f_archive"]]) {
  await jump(c, n);
  await sweep(`play ${c}`);
}

// tactical details open
const t = page.locator(".tactical-toggle");
if (await t.isVisible().catch(() => false)) { await t.click(); await sweep("tactical open"); }

// commit console + decision reveal
await jump("case01", "start");
await page.locator(".choices .choice").first().evaluate((b) => b.click());
await page.waitForTimeout(300);
await sweep("commit console");
await page.getByTestId("commit-confirm").evaluate((b) => b.click());
await page.waitForSelector("[data-testid='decision-next']", { timeout: 10000 });
await sweep("decision reveal");
await page.getByTestId("decision-next").evaluate((b) => b.click());

// result + ending
async function playOut(limit = 16) {
  for (let i = 0; i < limit; i += 1) {
    if (await page.locator(".result-page, .ending-sequence").first().isVisible().catch(() => false)) return;
    if (!(await page.locator(".choices .choice").count())) return;
    await page.locator(".choices .choice").first().evaluate((b) => b.click());
    const c = page.getByTestId("commit-confirm");
    if (await c.isVisible().catch(() => false)) await c.evaluate((b) => b.click());
    await page.waitForTimeout(220);
    await page.evaluate(() => document.querySelector("[data-testid='decision-next']")?.click());
    await page.waitForTimeout(180);
  }
}
await jump("case02", "c2_aftershock");
await playOut();
await sweep("case result");

await jump("final", "f_aftershock");
await playOut();
for (let i = 0; i < 5; i += 1) {
  await sweep(`ending ${i}`);
  const skip = page.locator(".ending-quiet-skip");
  if (await skip.isVisible().catch(() => false)) await skip.click();
  const next = page.getByTestId("ending-next");
  if (await next.isVisible().catch(() => false)) { await next.click(); await page.waitForTimeout(350); continue; }
  const submit = page.locator(".ending-message-beat button");
  if (await submit.isVisible().catch(() => false)) { await submit.click(); await page.waitForTimeout(350); continue; }
  break;
}
await sweep("final report");

// diagnostics panels
await page.evaluate(() => {
  const raw = localStorage.getItem("trigger-prototype-v2");
  if (!raw) return;
  const s = JSON.parse(raw);
  s.lastError = { id: "x", occurredAt: new Date().toISOString(), source: "save-integrity", message: "감사", currentCase: "case02", nodeId: "c2_logs" };
  localStorage.setItem("trigger-prototype-v2", JSON.stringify(s));
});
await page.goto(`${url}/?debug=1`);
await page.waitForTimeout(500);
await sweep("recovery notice");
const eb = page.getByTestId("open-error-log-from-notice");
if (await eb.isVisible().catch(() => false)) { await eb.evaluate((b) => b.click()); await page.waitForTimeout(400); await sweep("error log"); }

// ranking + mobile
await fresh();
const rank = page.locator("button").filter({ hasText: /순위|랭킹/ }).first();
if (await rank.isVisible().catch(() => false)) { await rank.click(); await page.waitForTimeout(500); await sweep("ranking"); }
await page.setViewportSize({ width: 390, height: 844 });
await jump("case03", "c3_split");
await sweep("mobile play");

await browser.close();

const dead = list.filter((s) => !matched.has(s.test));
const deadRaw = new Set(dead.map((d) => d.raw));
console.log(`\nselectors: ${list.length} | never matched: ${dead.length}`);
writeFileSync(".tmp/dead-selectors.json", JSON.stringify([...deadRaw].sort(), null, 1));
console.log("sample:", [...deadRaw].slice(0, 40).join("\n  "));
