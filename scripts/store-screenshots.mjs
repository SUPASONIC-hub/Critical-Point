#!/usr/bin/env node
/**
 * The store screenshots (notes D-8: six scenes, the same in both stores), taken
 * from the production-like build at every size the two stores ask for.
 *
 *   npm run store:shots                    build:e2e, then every size and scene
 *   npm run store:shots -- --no-build      reuse dist/ as it is
 *   npm run store:shots -- --only=ios      one platform (android | ios), or one
 *                                          size (--only=phone, --only=ipad-13)
 *   npm run store:shots -- --scenes=1,3    some of the scenes, by number
 *   npm run store:shots -- --no-captions   the bare screens only
 *
 * Out (gitignored): store-shots/<platform>/<size>/NN-name.png, the screen as the
 * player sees it, and beside it ko/NN-name.png and en/NN-name.png, the same
 * screen framed under its caption (Korean set first, English second). The UI
 * is Korean in both until the English build lands (notes D-8 retakes them then);
 * the English frames are for the English listing's captions.
 *
 * Each scene is reached the way the @prod tests reach one -- the release has no
 * debug console -- by seeding a returning player's save and pressing 이어하기
 * (tests/helpers/seededSave.js), then the same helpers the e2e suite plays with.
 * The backend is the stub origin of .env.e2e, answered as an empty backend
 * (tests/helpers/network.js): nothing leaves this machine.
 */
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { chromium } from "@playwright/test";
import { ACCESSIBILITY_SETTINGS_KEY } from "../src/appConfig.js";
import { CASE_START_NODES } from "../src/gameData.js";
import { createCaseSummary } from "../src/gameLogic.js";
import { bustStakedCard, clickElement, completeCurrentCase, resumeSavedRun, TRANSITION_TIMEOUT_MS, waitForEntrance } from "../tests/helpers/gameFlow.js";
import { expect, guardNetwork } from "../tests/helpers/network.js";
import { savedRunAt, seedSave } from "../tests/helpers/seededSave.js";

const root = process.cwd();
const OUT = path.join(root, "store-shots");
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1];

/**
 * The sizes, as CSS pixels times the device scale. Play: phone and 7"/10"
 * tablet, PNG, each side 320-3,840px, 9:16. App Store: the 6.9" iPhone
 * (1320x2868) and, while the iOS project keeps iPad, the 13" iPad (2064x2752).
 */
const SIZES = [
  { platform: "android", size: "phone", width: 432, height: 768, scale: 2.5 }, // 1080x1920
  { platform: "android", size: "tablet-7", width: 630, height: 1120, scale: 2 }, // 1260x2240
  { platform: "android", size: "tablet-10", width: 900, height: 1600, scale: 2 }, // 1800x3200
  { platform: "ios", size: "iphone-6.9", width: 440, height: 956, scale: 3 }, // 1320x2868
  { platform: "ios", size: "ipad-13", width: 1032, height: 1376, scale: 2 }, // 2064x2752
];

/** A season of six closed cases, so the record has something to read (as in tests/logic-report.spec.js). */
function closedCase(caseId, logicRecord) {
  const summary = createCaseSummary({}, {}, [{ caseId }], { resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 }, schemaVersion: 2 });
  return { ...summary, gauntlet: { logicStreak: 0, tableRules: 2 }, logicRecord: { windows: 6, heat: 3, peak: 1, top: ["inference", 2], grows: 0, switches: 0, breaks: 0, busts: 0, keeps: 0, best: 0, ...logicRecord } };
}
const SEASON = {
  case01: closedCase("case01", {}),
  case02: closedCase("case02", { breaks: 1 }),
  case03: closedCase("case03", { windows: 8, heat: 20, peak: 3, top: ["risk", 5], grows: 3, switches: 1, busts: 4, best: 9 }),
  case04: closedCase("case04", {}),
  case05: closedCase("case05", { keeps: 2 }),
  case06: closedCase("case06", { best: 4 }),
};

const PLAYER = "분석관";

/** A table with a card down and pushed twice: the gauge up, the pot growing. */
async function stakeAndPush(page, pushes) {
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  const stage = page.getByTestId("gauntlet-stage");
  for (let press = 0; press < pushes; press += 1) {
    const gauge = await stage.getAttribute("data-gauge");
    await page.getByTestId("commit-push").click();
    await expect.poll(() => stage.getAttribute("data-gauge"), { timeout: 5_000 }).not.toBe(gauge);
  }
}

/**
 * The six scenes of notes D-8. `save` is the seeded run; `hold` keeps the
 * briefing's reading clock from opening the table under the camera; `play`
 * walks from 이어하기 to the frame and returns when it is up.
 */
const SCENES = [
  {
    id: "01-briefing",
    caption: { ko: "310억, 혼자 반대한 사람", en: "The lone dissent on a ₩31B loan" },
    save: () => savedRunAt("prologue01", CASE_START_NODES.prologue01),
    hold: true,
    play: async (page) => {
      await clickElement(page.getByTestId("resume-save"), "resume saved run");
      const briefing = page.getByTestId("scene-briefing");
      await expect(briefing).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
      await waitForEntrance(briefing);
    },
  },
  {
    id: "02-table",
    caption: { ko: "밀어붙일까, 확정할까", en: "Push your luck, or commit?" },
    save: () => savedRunAt("case02", CASE_START_NODES.case02, { playerName: PLAYER }),
    play: async (page) => {
      await resumeSavedRun(page);
      await stakeAndPush(page, 2);
      await page.waitForTimeout(700);
    },
  },
  {
    id: "03-bust",
    caption: { ko: "벽은 끝까지 보이지 않는다", en: "You never see the Wall coming" },
    save: () => savedRunAt("case02", CASE_START_NODES.case02, { playerName: PLAYER }),
    play: async (page) => {
      await resumeSavedRun(page);
      await stakeAndPush(page, 1);
      await bustStakedCard(page);
      await waitForEntrance(page.locator(".decision-reveal"));
    },
  },
  {
    id: "04-protocol-breach",
    caption: { ko: "당신의 판단이 다음 판을 부순다", en: "Your choices break the next hand" },
    // As a run that broke its last board meets the next one (tests/table-keys.spec.js).
    save: () => savedRunAt("case03", CASE_START_NODES.case03, { playerName: PLAYER, dynamics: { schema: { mutations: ["aftershock"] }, openSeed: null } }),
    hold: true,
    play: async (page) => {
      await clickElement(page.getByTestId("resume-save"), "resume saved run");
      const breach = page.getByTestId("protocol-breach");
      await expect(breach).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
      await waitForEntrance(page.getByTestId("scene-briefing"));
      await breach.evaluate((element) => element.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(300);
    },
  },
  {
    id: "05-act-card",
    caption: { ko: "쉰다섯 사건, 하나의 사슬", en: "55 cases, one chain" },
    // An act's first case reached by play, forty tables in (tests/season-flow.spec.js).
    save: () => savedRunAt("case08", CASE_START_NODES.case08, { playerName: PLAYER, dynamics: { windowIndex: 40 } }),
    play: async (page) => {
      await clickElement(page.getByTestId("resume-save"), "resume saved run");
      const card = page.getByTestId("act-card");
      await expect(card).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
      await waitForEntrance(card);
    },
  },
  {
    id: "06-ending-dna",
    caption: { ko: "언제 가장 깊이 생각했나", en: "When did you think hardest?" },
    save: () => savedRunAt("final", "f_aftershock", { playerName: PLAYER, caseResults: SEASON }),
    reducedMotion: true,
    play: async (page) => {
      await resumeSavedRun(page);
      await completeCurrentCase(page);
      const ending = page.locator(".ending-sequence");
      await expect(ending).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
      for (let twist = 0; twist < 3; twist += 1) {
        await expect(ending).toHaveClass(/ending-step-0/);
        await ending.locator("button").click();
      }
      await expect(page.locator(".ending-step-1")).toBeVisible();
      await page.getByTestId("ending-next").click();
      await expect(page.locator(".ending-step-2")).toBeVisible();
      await page.locator(".ending-step-2 button").click();
      await expect(page.locator(".ending-step-3")).toBeVisible();
      await page.locator("details.report-archive > summary").click();
      const dna = page.locator(".fingerprint-panel");
      await expect(dna).toBeVisible();
      await dna.evaluate((element) => element.scrollIntoView({ block: "start" }));
      await page.waitForTimeout(400);
    },
  },
];

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function run(command, commandArgs, options = {}) {
  return spawn(process.execPath, [command, ...commandArgs], { cwd: root, stdio: options.stdio ?? "inherit", shell: false });
}

async function build() {
  console.log("store:shots: vite build --mode e2e");
  const code = await new Promise((resolve) => run("node_modules/vite/bin/vite.js", ["build", "--mode", "e2e"]).on("exit", resolve));
  if (code !== 0) throw new Error(`build:e2e exited ${code}`);
}

async function startPreview() {
  const port = await freePort();
  const child = run("node_modules/vite/bin/vite.js", ["preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: ["ignore", "pipe", "pipe"] });
  const base = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error("vite preview exited before it served");
    try {
      if ((await fetch(base)).ok) return { base, stop: () => child.kill() };
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  child.kill();
  throw new Error(`vite preview did not answer on ${base}`);
}

async function shoot(browser, base, size, scene) {
  const context = await browser.newContext({
    baseURL: base,
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.scale,
    isMobile: true,
    hasTouch: true,
    locale: "ko-KR",
    reducedMotion: scene.reducedMotion ? "reduce" : "no-preference",
    serviceWorkers: "block",
  });
  const strays = await guardNetwork(context);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await seedSave(page, scene.save());
    if (scene.hold) {
      await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify({ holdReadingClock: true }) });
    }
    await page.goto("/");
    await scene.play(page);
    const file = path.join(OUT, size.platform, size.size, `${scene.id}.png`);
    mkdirSync(path.dirname(file), { recursive: true });
    await page.screenshot({ path: file, animations: "allow", caret: "hide" });
    if (errors.length) console.warn(`  page errors in ${scene.id}: ${errors.join(" | ")}`);
    if (strays.length) console.warn(`  refused requests in ${scene.id}: ${strays.join(" | ")}`);
    return file;
  } finally {
    await context.close();
  }
}

/** The screen under its caption, at the screen's own pixel size: one simple HTML frame. */
async function frame(browser, size, file, text, lang) {
  const width = Math.round(size.width * size.scale);
  const height = Math.round(size.height * size.scale);
  const image = `data:image/png;base64,${readFileSync(file).toString("base64")}`;
  const unit = Math.min(width, height) / 100;
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const escaped = text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
  await page.setContent(`<!doctype html><html lang="${lang}"><meta charset="utf-8"><style>
    html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; }
    body { background: radial-gradient(120% 70% at 50% 0%, #2a1416 0%, #0d0b0c 60%); color: #f4ede4;
      display: flex; flex-direction: column; align-items: center; font-family: "Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif; }
    h1 { margin: ${unit * 9}px ${unit * 7}px ${unit * 6}px; font-size: ${unit * 7.4}px; line-height: 1.25; font-weight: 800;
      letter-spacing: ${lang === "ko" ? "-0.02em" : "-0.01em"}; text-align: center; word-break: keep-all; }
    h1::after { content: ""; display: block; width: ${unit * 10}px; height: ${unit * 0.8}px; margin: ${unit * 3.2}px auto 0; background: #e5484d; border-radius: 99px; }
    .shot { flex: 1; min-height: 0; display: flex; align-items: flex-start; justify-content: center; padding: 0 ${unit * 7}px ${unit * 7}px; }
    img { max-width: 100%; max-height: 100%; border-radius: ${unit * 3.6}px; box-shadow: 0 ${unit * 2}px ${unit * 8}px rgba(0,0,0,.6), 0 0 0 ${unit * 0.35}px rgba(255,255,255,.12); }
  </style><body><h1>${escaped}</h1><div class="shot"><img src="${image}" alt=""></div></body></html>`);
  await page.evaluate(() => Promise.all([globalThis.document.fonts.ready, ...[...globalThis.document.images].map((img) => img.decode())]));
  const out = path.join(path.dirname(file), lang, path.basename(file));
  mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out });
  await page.close();
  return out;
}

const only = option("only");
const sizes = SIZES.filter((size) => !only || size.platform === only || size.size === only);
const wanted = option("scenes")?.split(",").map(Number);
const scenes = SCENES.filter((_, index) => !wanted || wanted.includes(index + 1));
if (!sizes.length || !scenes.length) {
  console.error(`store:shots: nothing to take (--only=${only ?? ""} --scenes=${option("scenes") ?? ""})`);
  process.exit(1);
}

if (!flag("no-build")) await build();
if (!only && !wanted) rmSync(OUT, { recursive: true, force: true });
const preview = await startPreview();
const browser = await chromium.launch();
const failed = [];
try {
  for (const size of sizes) {
    console.log(`store:shots: ${size.platform}/${size.size} ${size.width * size.scale}x${size.height * size.scale}`);
    for (const scene of scenes) {
      try {
        const file = await shoot(browser, preview.base, size, scene);
        console.log(`  ${path.relative(root, file)}`);
        if (!flag("no-captions")) {
          for (const lang of ["ko", "en"]) console.log(`  ${path.relative(root, await frame(browser, size, file, scene.caption[lang], lang))}`);
        }
      } catch (error) {
        failed.push(`${size.platform}/${size.size}/${scene.id}`);
        console.error(`  FAILED ${scene.id}: ${String(error.message ?? error).split("\n")[0]}`);
      }
    }
  }
} finally {
  await browser.close();
  preview.stop();
}
if (failed.length) {
  console.error(`store:shots: ${failed.length} failed: ${failed.join(", ")}`);
  process.exit(1);
}
console.log(`store:shots: done, ${sizes.length} sizes x ${scenes.length} scenes in ${path.relative(root, OUT)}/`);
