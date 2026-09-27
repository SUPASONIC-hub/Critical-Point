import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

/**
 * Draw the app icons.
 *
 * The tab and home-screen icon used to be `profile.jpg`, the creator's 256px
 * photo, which is a credit and not a mark. The icon is the brand mark instead
 * -- the lime point with its halo that sits in front of the wordmark on every
 * page (`.brand-mark-dot`) -- on the app's ground, `--ui-bg`.
 *
 * The browser is the renderer, as it is for the art variants: Playwright is
 * already a devDependency, so there is no image toolchain to install. The PNGs
 * are committed.
 */

const OUT_DIR = "public/icons";
const ICONS = [
  // Rounded tile with transparent corners, for tabs and "any" manifest icons.
  { file: "favicon-32.png", size: 32, bleed: false },
  { file: "icon-192.png", size: 192, bleed: false },
  { file: "icon-512.png", size: 512, bleed: false },
  // Full-bleed: the platform applies its own mask, and the mark sits well inside
  // the 80% safe zone a maskable icon is cut to.
  { file: "icon-maskable-512.png", size: 512, bleed: true },
  { file: "apple-touch-icon.png", size: 180, bleed: true },
];

const browser = await chromium.launch();
const page = await browser.newPage();
mkdirSync(OUT_DIR, { recursive: true });

for (const icon of ICONS) {
  const dataUrl = await page.evaluate(({ size, bleed }) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const ground = "rgb(6 9 10)";
    const accent = "rgb(217 255 98)";
    const c = size / 2;

    ctx.fillStyle = ground;
    if (bleed) {
      ctx.fillRect(0, 0, size, size);
    } else {
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, size * 0.22);
      ctx.fill();
    }

    // Small sizes get a bigger point so it survives 16-32px.
    const small = size <= 48;
    const dot = size * (small ? 0.2 : 0.15);

    // The halo ring (0 0 0 3px at 16% on a 7px dot).
    ctx.beginPath();
    ctx.arc(c, c, dot * 1.85, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(217 255 98 / 0.18)";
    ctx.fill();

    // The glow and the point.
    ctx.shadowColor = accent;
    ctx.shadowBlur = dot * 1.6;
    ctx.beginPath();
    ctx.arc(c, c, dot, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.shadowBlur = 0;

    return canvas.toDataURL("image/png");
  }, icon);
  const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
  writeFileSync(`${OUT_DIR}/${icon.file}`, bytes);
  console.log(`${OUT_DIR}/${icon.file.padEnd(24)} ${icon.size}px ${String(bytes.length).padStart(6)} bytes`);
}

await browser.close();
