/* global document, Image -- the drawing runs inside the page, through page.evaluate. */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

/**
 * Draw the app icons from the game's own mark, `docs/images/brand/`.
 *
 * The mark is GAUGE (chosen 2026-11-16): a C-shaped gauge with the point that
 * has just left it -- C·P, the critical point. It is drawn by hand as SVG
 * paths, no font and no outside image, so the icons carry no licence but ours.
 * Until then the icons were cut from the creators' picture `public/profile.jpg`,
 * which now stays only where it credits them (the studio credit).
 *
 * The browser is the renderer, as it is for the art variants: Playwright is
 * already a devDependency, so there is no image toolchain to install. The PNGs
 * are committed; `public/icons/favicon-<version>.svg` is the tile itself, for browsers
 * that take an SVG icon.
 */
const BRAND = "docs/images/brand";
const TILE = readFileSync(`${BRAND}/mark-dark.svg`, "utf8");
/** The mark without its rounded tile, to draw on a full-bleed ground. */
const ART = TILE.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<rect[^>]*rx="22"[^>]*\/>/, "");
const GROUND = "#06090a"; // the manifest's background_color and theme_color
const bleed = (scale) => {
  const inset = (100 - 100 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${GROUND}"/><g transform="translate(${inset} ${inset}) scale(${scale})">${ART}</g></svg>`;
};

const OUT_DIR = "public/icons";
/**
 * Part of every icon's file name. Installed apps (Chrome, Android, desktop)
 * refresh their icon only when the manifest names a new URL, so a redrawn icon
 * takes the next version; index.html, the manifest and legal-pages.mjs follow.
 */
const ICON_VERSION = "v2";
const named = (base, ext = "png") => `${base}-${ICON_VERSION}.${ext}`;
const ICONS = [
  // The rounded tile, as the tab and an installed app's "any" icon show it.
  { file: named("favicon-32"), size: 32, svg: TILE },
  { file: named("icon-192"), size: 192, svg: TILE },
  { file: named("icon-512"), size: 512, svg: TILE },
  // iOS rounds the corners itself and paints transparency black: full bleed.
  { file: named("apple-touch-icon"), size: 180, svg: bleed(1) },
  // A maskable icon is cut to a circle of 80% by the platform: the mark sits
  // well inside that, on a ground that runs to the edges.
  { file: named("icon-maskable-512"), size: 512, svg: bleed(0.8) },
];

const browser = await chromium.launch();
const page = await browser.newPage();
mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(`${BRAND}/mark-dark.svg`, `${OUT_DIR}/${named("favicon", "svg")}`);

for (const icon of ICONS) {
  const source = `data:image/svg+xml;base64,${Buffer.from(icon.svg).toString("base64")}`;
  const dataUrl = await page.evaluate(
    async ({ size, source }) => {
      const image = new Image(size, size);
      image.src = source;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(image, 0, 0, size, size);
      return canvas.toDataURL("image/png");
    },
    { size: icon.size, source },
  );
  const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
  writeFileSync(`${OUT_DIR}/${icon.file}`, bytes);
  console.log(`${OUT_DIR}/${icon.file.padEnd(24)} ${icon.size}px ${String(bytes.length).padStart(6)} bytes`);
}

await browser.close();
