/**
 * `npm run capture:readme`: the README's screenshots, taken again from this tree.
 *
 * Starts the vite dev server on a free port with the same blanked environment
 * the e2e runner uses (no Supabase, debug tools on the dev server, a fixed
 * weekly-rule clock), opens each screen the way tests/visual-regression.spec.js
 * does (the debug jump, a pinned run seed so the table deals the same hand,
 * reduced motion, animations off, debug chrome hidden), and writes WebP files
 * to docs/images/. The WebP encoding is Chromium's own canvas encoder, as in
 * scripts/build-portrait.mjs; each file is checked against the 400 KB cap of
 * docs/readme-rules.md, and the quality steps down until it fits.
 *
 *   npm run capture:readme              all four
 *   npm run capture:readme -- table     only the named ones (title, table, briefing, result)
 *
 * Takes a browser and a dev server for about a minute: on the shared PC run it
 * through .claude/locked-run.ps1 like any other browser job.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";

import { chromium } from "@playwright/test";

import { ACCESSIBILITY_SETTINGS_KEY, COLD_OPENING_SEEN_KEY } from "../src/appConfig.js";
import { completeCurrentCase, startDebugNode } from "../tests/helpers/gameFlow.js";

const OUT_DIR = "docs/images";
const MAX_BYTES = 400 * 1024;
const PINNED_RUN_UUID = "00000000-0000-4000-8000-000000000000";
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2 };
const DESKTOP = { width: 1366, height: 860, deviceScaleFactor: 1 };

const HIDE_CHROME = `
  *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
  .debug-overlay, .result-page .top-actions [data-testid="export-diagnostic-log"] { display: none !important; }
`;

async function settle(page) {
  await page.addStyleTag({ content: HIDE_CHROME });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll("img")].map((image) => image.decode().catch(() => {})));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

/** name -> { viewport, open(page) }. Each leaves the page on the screen to capture. */
const SHOTS = {
  title: {
    viewport: DESKTOP,
    open: async (page) => {
      await page.goto("/");
      await page.locator(".intro").waitFor({ state: "visible" });
    },
  },
  table: {
    viewport: PHONE,
    seed: true,
    open: async (page) => {
      await startDebugNode(page, "case05", "c5_voice");
      await page.locator(".game-shell").waitFor({ state: "visible" });
    },
  },
  briefing: {
    viewport: PHONE,
    open: async (page) => {
      await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), {
        key: ACCESSIBILITY_SETTINGS_KEY,
        value: JSON.stringify({ holdReadingClock: true }),
      });
      await startDebugNode(page, "prologue01", "p1_start", { openTable: false });
      await page.getByTestId("scene-briefing").waitFor({ state: "visible" });
    },
  },
  result: {
    viewport: PHONE,
    open: async (page) => {
      await startDebugNode(page, "case01", "c1_aftershock");
      await completeCurrentCase(page);
      await page.locator(".result-page").waitFor({ state: "visible" });
      await page.evaluate(() => window.scrollTo(0, 0));
    },
  },
};

const freePort = () =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });

async function startServer(port) {
  const env = { ...process.env, VITE_SUPABASE_URL: "", VITE_SUPABASE_ANON_KEY: "", VITE_ENABLE_DEBUG_TOOLS: "", VITE_WEEKLY_RULE_CLOCK: "2026-01-07T12:00:00+09:00" };
  const child = spawn(process.execPath, [path.join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const url = `http://127.0.0.1:${port}`;
  for (let tries = 0; tries < 120; tries += 1) {
    try {
      if ((await fetch(url)).ok) return { child, url };
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  child.kill();
  throw new Error(`the dev server did not answer at ${url} within a minute`);
}

/** PNG bytes -> WebP bytes at the first quality that fits under MAX_BYTES. */
async function toWebp(encoder, png) {
  for (const quality of [0.86, 0.8, 0.72, 0.64, 0.56]) {
    const dataUrl = await encoder.evaluate(
      async ({ base64, quality: q }) => {
        const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${base64}`)).blob());
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.getContext("2d").drawImage(bitmap, 0, 0);
        return canvas.toDataURL("image/webp", q);
      },
      { base64: png.toString("base64"), quality },
    );
    const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
    if (bytes.length <= MAX_BYTES) return { bytes, quality };
  }
  throw new Error(`could not fit a capture under ${MAX_BYTES / 1024} KB`);
}

async function main() {
  const wanted = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const unknown = wanted.filter((name) => !SHOTS[name]);
  if (unknown.length) throw new Error(`no shot named ${unknown.join(", ")}; the shots are ${Object.keys(SHOTS).join(", ")}`);
  const names = wanted.length ? wanted : Object.keys(SHOTS);
  mkdirSync(OUT_DIR, { recursive: true });

  const { child, url } = await startServer(await freePort());
  const browser = await chromium.launch();
  try {
    const encoder = await browser.newPage();
    for (const name of names) {
      const shot = SHOTS[name];
      const { deviceScaleFactor, ...viewport } = shot.viewport;
      const context = await browser.newContext({ baseURL: url, viewport, deviceScaleFactor, colorScheme: "light", reducedMotion: "reduce" });
      // No backend: anything that is not this machine is refused, as in tests/helpers/network.js.
      await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
      await context.addInitScript((key) => {
        try {
          if (localStorage.getItem(key) === null) localStorage.setItem(key, "1");
        } catch {
          // no storage on this page
        }
      }, COLD_OPENING_SEEN_KEY);
      if (shot.seed) {
        await context.addInitScript((uuid) => {
          Object.defineProperty(globalThis.crypto, "randomUUID", { configurable: true, value: () => uuid });
        }, PINNED_RUN_UUID);
      }
      const page = await context.newPage();
      await shot.open(page);
      await settle(page);
      const png = await page.screenshot({ animations: "disabled", caret: "hide" });
      const { bytes, quality } = await toWebp(encoder, png);
      const file = path.join(OUT_DIR, `${name}.webp`);
      writeFileSync(file, bytes);
      console.log(`${file}: ${Math.round(bytes.length / 1024)} KB (webp ${quality})`);
      await context.close();
    }
  } finally {
    await browser.close();
    child.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
