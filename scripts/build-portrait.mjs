import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

/**
 * Turn one painted portrait into the file the game ships.
 *
 *   node scripts/build-portrait.mjs <image.png|jpg|webp> <slug>
 *   -> public/portrait-<slug>.webp, 256x256, webp at quality 0.82
 *
 * The five portraits that shipped first are 256x256 webp at about 10KB
 * (630d93a re-encoded them from PNG at q82). This makes a new one the same:
 * the browser is the encoder, as in build-art-variants.mjs, so it needs no
 * image toolchain. A picture that is not square is cut to its centre square
 * first, with the top kept rather than the middle when it is taller than wide,
 * so a head-and-shoulders crop does not lose the head. Rows and columns along
 * an edge that are mostly transparent are cut off first, and the canvas is
 * painted black under the picture: portrait-echo.webp has 42 transparent rows
 * along its bottom and portrait-oh-jinwoo.webp 10 transparent columns on its
 * right, which show as a band on a light page. Run on those two files
 * themselves (there is no original left) it re-cuts them without the band:
 *
 *   node scripts/build-portrait.mjs public/portrait-echo.webp echo
 *   node scripts/build-portrait.mjs public/portrait-oh-jinwoo.webp oh-jinwoo
 */

const SIZE = 256;
const QUALITY = 0.82;

const [input, slug] = process.argv.slice(2);
if (!input || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? "")) {
  console.error("usage: node scripts/build-portrait.mjs <image> <slug>   (slug: lowercase romanised name, e.g. lee-minseo)");
  process.exit(1);
}

const type = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" }[path.extname(input).toLowerCase()];
if (!type) {
  console.error(`${input}: png, jpg or webp only`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
const dataUrl = await page.evaluate(
  async ([url, size, quality]) => {
    const image = new Image();
    image.src = url;
    await image.decode();
    // The box of the picture that is actually there: rows and columns that are
    // mostly transparent along an edge are left out before the square is cut.
    const probe = document.createElement("canvas");
    probe.width = image.naturalWidth;
    probe.height = image.naturalHeight;
    const probeContext = probe.getContext("2d");
    probeContext.drawImage(image, 0, 0);
    const { data, width, height } = probeContext.getImageData(0, 0, probe.width, probe.height);
    const clearAt = (x, y) => data[(y * width + x) * 4 + 3] < 128;
    const clearRow = (y) => Array.from({ length: width }, (_, x) => clearAt(x, y)).filter(Boolean).length > width / 2;
    const clearColumn = (x) => Array.from({ length: height }, (_, y) => clearAt(x, y)).filter(Boolean).length > height / 2;
    let top = 0, bottom = height, left = 0, right = width;
    while (top < bottom - 1 && clearRow(top)) top += 1;
    while (bottom - 1 > top && clearRow(bottom - 1)) bottom -= 1;
    while (left < right - 1 && clearColumn(left)) left += 1;
    while (right - 1 > left && clearColumn(right - 1)) right -= 1;
    const boxWidth = right - left;
    const boxHeight = bottom - top;
    const side = Math.min(boxWidth, boxHeight);
    const sx = left + Math.round((boxWidth - side) / 2);
    const sy = top + (boxHeight > boxWidth ? 0 : Math.round((boxHeight - side) / 2));
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    context.fillStyle = "#000";
    context.fillRect(0, 0, size, size);
    context.imageSmoothingQuality = "high";
    context.drawImage(image, sx, sy, side, side, 0, 0, size, size);
    return canvas.toDataURL("image/webp", quality);
  },
  [`data:${type};base64,${readFileSync(input).toString("base64")}`, SIZE, QUALITY],
);
await browser.close();

const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
const out = `public/portrait-${slug}.webp`;
writeFileSync(out, bytes);
console.log(`${out}  ${SIZE}x${SIZE}  ${(bytes.length / 1024).toFixed(1)} KB`);
if (bytes.length > 16_000) console.log("Heavier than the shipped five (9.4-11.3 KB). Fine to ship, but a busy background is usually why.");
