import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { RESPONSIVE_ART } from "../src/responsiveArt.js";
import { ART_LOCK, hashBytes, hashFile } from "./art-lock.mjs";

/**
 * Regenerate the responsive art variants.
 *
 * The browser is the encoder: each original is decoded, drawn to a canvas at the
 * target width and read back as webp. Playwright is already a devDependency, so
 * this needs no image toolchain, and `npm run check:art` is what tells you to
 * run it -- it fails when a variant is missing or has crept back up in weight,
 * and when an original is not the file its variants were cut from. That last
 * one is what `art-variants.lock.json` is for (see art-lock.mjs); this script
 * writes it.
 */

const WIDTHS = [480, 960];
const QUALITY = 0.82;
// The one variant a first visit waits on: the key visual at 960, which a phone
// paints at 2x and a desktop at 1x (FIRST_PAINT_IMAGE in check-bundle-size.mjs).
// 0.75 since 2026-10-26 (첫 화면 전송량 줄이기, the user's choice 1): 50,480 ->
// 38,108 bytes of the first paint. The other variants are not on the first
// paint and keep QUALITY.
const QUALITY_FOR = { "/triggerlab-key-visual.webp": { 960: 0.75 } };
const qualityOf = (src, width) => QUALITY_FOR[src]?.[width] ?? QUALITY;

const browser = await chromium.launch();
const page = await browser.newPage();
let written = 0;
const lock = Object.fromEntries([...RESPONSIVE_ART].map((src) => [src, { original: hashFile(`public${src}`), variants: {} }]));

async function encode(src, width) {
  const source = `data:image/webp;base64,${readFileSync(`public${src}`).toString("base64")}`;
  const dataUrl = await page.evaluate(
    async ([url, targetWidth, quality]) => {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = Math.round((image.naturalHeight / image.naturalWidth) * targetWidth);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/webp", quality);
    },
    [source, width, qualityOf(src, width)],
  );
  const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
  const out = `public${src.replace(/\.webp$/, "")}-${width}.webp`;
  writeFileSync(out, bytes);
  written += 1;
  lock[src].variants[width] = hashBytes(bytes);
  console.log(`${out.padEnd(46)} ${String(Math.round(bytes.length / 1024)).padStart(4)} KB  q${qualityOf(src, width)}`);
}

for (const src of RESPONSIVE_ART) {
  for (const width of WIDTHS) await encode(src, width);
}

await browser.close();
writeFileSync(ART_LOCK, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
const exceptions = Object.entries(QUALITY_FOR).flatMap(([src, widths]) => Object.entries(widths).map(([width, quality]) => `${src} ${width} at ${quality}`));
console.log(`Wrote ${written} variants at quality ${QUALITY}${exceptions.length ? ` (${exceptions.join(", ")})` : ""}. Run npm run check:art to confirm the budgets.`);
