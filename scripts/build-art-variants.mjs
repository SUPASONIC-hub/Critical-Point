import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { RESPONSIVE_ART } from "../src/responsiveArt.js";

/**
 * Regenerate the responsive art variants.
 *
 * The browser is the encoder: each original is decoded, drawn to a canvas at the
 * target width and read back as webp. Playwright is already a devDependency, so
 * this needs no image toolchain, and `npm run check:art` is what tells you to
 * run it -- it fails when a variant is missing or has crept back up in weight.
 */

const WIDTHS = [480, 960];
const QUALITY = 0.82;
const PORTRAIT_FALLBACK = ["/speaker-profile.webp", 160];

const browser = await chromium.launch();
const page = await browser.newPage();
let written = 0;

async function encode(src, width) {
  const source = `data:image/webp;base64,${readFileSync(`public${src}`).toString("base64")}`;
  const dataUrl = await page.evaluate(
    async ([url, targetWidth]) => {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = Math.round((image.naturalHeight / image.naturalWidth) * targetWidth);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/webp", 0.82);
    },
    [source, width],
  );
  const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
  const out = `public${src.replace(/\.webp$/, "")}-${width}.webp`;
  writeFileSync(out, bytes);
  written += 1;
  console.log(`${out.padEnd(46)} ${String(Math.round(bytes.length / 1024)).padStart(4)} KB`);
}

for (const src of RESPONSIVE_ART) {
  for (const width of WIDTHS) await encode(src, width);
}
await encode(...PORTRAIT_FALLBACK);

await browser.close();
console.log(`Wrote ${written} variants at quality ${QUALITY}. Run npm run check:art to confirm the budgets.`);
