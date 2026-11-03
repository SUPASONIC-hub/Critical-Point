/* global document, Image -- the drawing runs inside the page, through page.evaluate. */
/**
 * The iOS shell's app icon and launch image, from `public/profile.jpg`.
 *
 * The same picture and the same way of drawing it as the site's icons
 * (scripts/build-icons.mjs): the browser is the renderer, Playwright comes
 * from the root's devDependencies, and the PNGs are committed. Run it from the
 * repository root once the picture changes:
 *
 *   node app/build-ios-assets.mjs
 *
 * App Store Connect refuses an app icon with an alpha channel, and a canvas
 * always hands back RGBA, so the pixels are read out of the canvas and written
 * here as an RGB PNG (colour type 2) with node's zlib.
 *
 * The source is 256px: the 1024px icon is drawn up from it and looks soft.
 * A larger original of the drawing is a placeholder to fill before release
 * (docs/app-shell.md).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import { chromium } from "@playwright/test";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const SOURCE = path.join(root, "public", "profile.jpg");
const ASSETS = path.join(here, "ios", "App", "App", "Assets.xcassets");
// The manifest's background_color: the page's own first frame.
const GROUND = "#06090a";

const OUTPUTS = [
  // Edge to edge on white, as icon-512.png; iOS rounds the corners itself.
  { files: ["AppIcon.appiconset/AppIcon-512@2x.png"], size: 1024, picture: 1024, ground: "#ffffff" },
  // The template's three scales of one square launch image, shown "aspect fill".
  {
    files: ["Splash.imageset/splash-2732x2732.png", "Splash.imageset/splash-2732x2732-1.png", "Splash.imageset/splash-2732x2732-2.png"],
    size: 2732,
    picture: 512,
    ground: GROUND,
  },
];

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes) {
  let c = 0xffffffff;
  for (const byte of bytes) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
}
/**
 * An RGB PNG without alpha, `size` square on `ground`, with the RGBA pixels
 * of the `picture`-square drawing in the middle. Only the drawing goes
 * through the browser: the launch image is 2,732px of one colour.
 */
function rgbPng({ size, picture, ground }, rgba) {
  const [r, g, b] = [1, 3, 5].map((at) => parseInt(ground.slice(at, at + 2), 16));
  const at = Math.round((size - picture) / 2);
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 3 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const to = row + 1 + x * 3;
      const inside = x >= at && x < at + picture && y >= at && y < at + picture;
      const from = inside ? ((y - at) * picture + (x - at)) * 4 : -1;
      raw[to] = inside ? rgba[from] : r;
      raw[to + 1] = inside ? rgba[from + 1] : g;
      raw[to + 2] = inside ? rgba[from + 2] : b;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // colour type: RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const source = `data:image/jpeg;base64,${readFileSync(SOURCE).toString("base64")}`;
  for (const output of OUTPUTS) {
    const pixels = await page.evaluate(
      async ({ picture, ground, source }) => {
        const image = new Image();
        image.src = source;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = picture;
        canvas.height = picture;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = ground;
        ctx.fillRect(0, 0, picture, picture);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(image, 0, 0, picture, picture);
        return Array.from(ctx.getImageData(0, 0, picture, picture).data);
      },
      { ...output, source },
    );
    const bytes = rgbPng(output, pixels);
    for (const file of output.files) {
      const target = path.join(ASSETS, file);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, bytes);
      console.log(`${path.relative(root, target).padEnd(70)} ${output.size}px ${String(bytes.length).padStart(7)} bytes`);
    }
  }
} finally {
  await browser.close();
}
