/* global document, Image -- the drawing runs inside the page, through page.evaluate. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

/**
 * Draw the app icons from `public/profile.jpg`.
 *
 * The tab and home-screen icon is the creator's drawing, `profile.jpg` -- the
 * owner's choice. A pass on 2026-09-27 had swapped it for the lime brand dot;
 * that was reverted on 2026-09-29. The files below keep the sizes and names
 * the page and the manifest ask for, cut from that one image.
 *
 * The browser is the renderer, as it is for the art variants: Playwright is
 * already a devDependency, so there is no image toolchain to install. The PNGs
 * are committed. The source is 256px, so the 512px icons are drawn up from it.
 */
const SOURCE = "public/profile.jpg";

const OUT_DIR = "public/icons";
const ICONS = [
  // The picture edge to edge, as the tab showed it before.
  { file: "favicon-32.png", size: 32, inset: 0 },
  { file: "icon-192.png", size: 192, inset: 0 },
  { file: "icon-512.png", size: 512, inset: 0 },
  { file: "apple-touch-icon.png", size: 180, inset: 0 },
  // A maskable icon is cut to a circle of 80% by the platform, so the picture
  // sits inside that on its own white ground.
  { file: "icon-maskable-512.png", size: 512, inset: 0.1 },
];

const browser = await chromium.launch();
const page = await browser.newPage();
mkdirSync(OUT_DIR, { recursive: true });

const source = `data:image/jpeg;base64,${readFileSync(SOURCE).toString("base64")}`;

for (const icon of ICONS) {
  const dataUrl = await page.evaluate(
    async ({ size, inset, source }) => {
      const image = new Image();
      image.src = source;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const margin = Math.round(size * inset);
      ctx.drawImage(image, margin, margin, size - margin * 2, size - margin * 2);
      return canvas.toDataURL("image/png");
    },
    { ...icon, source },
  );
  const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
  writeFileSync(`${OUT_DIR}/${icon.file}`, bytes);
  console.log(`${OUT_DIR}/${icon.file.padEnd(24)} ${icon.size}px ${String(bytes.length).padStart(6)} bytes`);
}

await browser.close();
