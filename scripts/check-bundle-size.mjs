import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

/**
 * Bundle and first-paint budgets.
 *
 * Every budget here ratchets DOWN, never up. Until 2026-09-27 each one sat at
 * 97-99.7% of its chunk because every change that grew a chunk also raised its
 * number, which made the check a record of sizes rather than a limit on them.
 * They were re-baselined that day to the measured size plus about 5% -- room for
 * an ordinary change, not for a new feature -- and the history of the old
 * numbers is in `git log -p` of this file. A change that needs more than the
 * headroom has to take the weight out somewhere else, or say in its commit why
 * the cold path is worth more now.
 *
 * Raw bytes are what the browser parses; gzip is what reaches a phone. Both are
 * checked, gzip at 40% of the raw budget unless a budget names its own.
 */

const root = process.cwd();
const distDir = path.join(root, "dist");
const assetsDir = path.join(distDir, "assets");

const budgets = [
  // The scene graph: fifty-five cases of authored prose and their tables. It
  // loads after the intro has painted and the player has clicked, never before.
  // 3,200,014 bytes / 935,327 gzip on 2026-09-27.
  { pattern: /^GameRuntime-.*\.js$/, maxBytes: 3_360_000, maxGzip: 982_000 },
  // The shell: what the intro needs to boot, now including the intro screen
  // itself, which stopped being a lazy chunk the entry had to fetch before it
  // could paint. 161,674 / 57,486 on 2026-09-27.
  { pattern: /^index-.*\.js$/, maxBytes: 169_800, maxGzip: 60_400 },
  // The table and its plate painters. 97,490 / 30,995 on 2026-09-27.
  { pattern: /^PlayScreen-.*\.js$/, maxBytes: 102_400, maxGzip: 32_600 },
  // 44,024 / 13,638 on 2026-09-27.
  { pattern: /^ResultScreen-.*\.js$/, maxBytes: 46_300, maxGzip: 14_400 },
  // The whole stylesheet (the intro's share is also inlined; see
  // build-critical-css.mjs). 199,426 / 36,483 before 2026-09-27, when 133 unread
  // tokens went; 196,510 / 35,448 after.
  { pattern: /^index-.*\.css$/, maxBytes: 206_300, maxGzip: 37_300 },
  // The one font file (scripts/build-fonts.mjs), already compressed, so the raw
  // size is the transfer size. 270,000 bytes on 2026-09-27; it replaced 92
  // dynamic subsets, of which the intro alone pulled ~537KB.
  { pattern: /^pretendard-cp-.*\.woff2$/, maxBytes: 283_500, compressed: true },
  // The chunks below had no budget until 2026-09-28: the list named six files
  // and the build emits eleven, so a new 400KB lazy screen would have passed a
  // check described as a ratchet on every chunk. Measured that day, plus 5%.
  // React and the scheduler. 221,715 / 68,975. It moves only with a React bump.
  { pattern: /^react-vendor-.*\.js$/, maxBytes: 232_800, maxGzip: 72_400 },
  // The lucide icons the screens import, tree-shaken. 13,063 / 4,703.
  { pattern: /^icons-vendor-.*\.js$/, maxBytes: 13_700, maxGzip: 4_900 },
  // 4,316 / 1,813.
  { pattern: /^BoardScreen-.*\.js$/, maxBytes: 4_500, maxGzip: 1_900 },
  // 3,743 / 1,674.
  { pattern: /^RankingScreen-.*\.js$/, maxBytes: 3_900, maxGzip: 1_750 },
  // The deferred-stylesheet loader (vite.config.js), a fixed string. 153 bytes.
  { pattern: /^deferred-styles-.*\.js$/, maxBytes: 200, maxGzip: 200 },
];

/**
 * What a release must not carry. The debug console -- the case jump, the
 * unlock-all button, the overlay -- is compiled out of a build that did not ask
 * for it (`debugBuild`, src/appConfig.js). It used to ship switched off, and a
 * `VITE_ENABLE_DEBUG_TOOLS=true` left in the build environment would have
 * switched it on for every visitor with every check green.
 */
const MUST_NOT_SHIP = ["debug-case-select", "debug-node-select", "debug-start-node", "unlock-all-cases", "debug-overlay", "DEBUG JUMP"];

/**
 * The cold path: every byte a first visit on a phone waits on before the intro
 * can paint its hero -- the HTML, each script and stylesheet the HTML links,
 * the preloaded font, and the key visual the phone's `<picture>` picks at 2x
 * (what index.html preloads for it). Measured as transfer bytes: gzip for text,
 * raw for the font and the image.
 *
 * 490,643 bytes on 2026-09-27, down from ~776KB: ~537KB of font subsets became
 * one 270KB file, and a retina phone stopped fetching the -480 preload and
 * then the -960 the picture actually used. 494,937 once the old dynamic-subset
 * font stylesheet stopped being imported and the intro joined the entry chunk.
 */
const FIRST_PAINT_BUDGET = 515_000;
const FIRST_PAINT_IMAGE = "triggerlab-key-visual-960.webp";

let files;
try {
  files = readdirSync(assetsDir);
} catch {
  console.error("Bundle size check could not find dist/assets. Run npm run build first.");
  process.exit(1);
}

const failures = [];
const reported = [];
const budgeted = new Set();
for (const budget of budgets) {
  // Every match, not the first: a second `index-*.js` would otherwise ride in
  // unmeasured behind the one the list happened to return first.
  const matches = files.filter((name) => budget.pattern.test(name));
  if (!matches.length) failures.push(`no bundle matched ${budget.pattern}`);
  for (const file of matches) {
    budgeted.add(file);
    checkBudget(file, budget);
  }
}
for (const file of files) {
  if (!budgeted.has(file)) failures.push(`${file} has no size budget. Every file the build emits into dist/assets needs one.`);
}
for (const file of files.filter((name) => name.endsWith(".js"))) {
  const source = readFileSync(path.join(assetsDir, file), "utf8");
  for (const marker of MUST_NOT_SHIP) {
    if (source.includes(marker)) failures.push(`${file} contains "${marker}": the debug tools are in this build.`);
  }
}

function checkBudget(file, budget) {
  const assetPath = path.join(assetsDir, file);
  const bytes = statSync(assetPath).size;
  if (bytes > budget.maxBytes) failures.push(`${file} is ${bytes} bytes, over the ${budget.maxBytes} byte budget.`);
  if (budget.compressed) {
    reported.push(`${file}: ${bytes} bytes`);
    return;
  }
  const gzipBytes = gzipSync(readFileSync(assetPath)).length;
  const gzipBudget = budget.maxGzip ?? Math.ceil(budget.maxBytes * 0.4);
  reported.push(`${file}: ${bytes} bytes raw / ${gzipBytes} bytes gzip`);
  if (gzipBytes > gzipBudget) failures.push(`${file} is ${gzipBytes} gzip bytes, over the ${gzipBudget} gzip budget.`);
}

// First paint.
const html = readFileSync(path.join(distDir, "index.html"), "utf8");
const coldAssets = new Set();
for (const match of html.matchAll(/<(?:script|link)\b[^>]*>/g)) {
  const tag = match[0];
  if (/<link\b/.test(tag) && !/\brel="(?:stylesheet|modulepreload|preload)"/.test(tag)) continue;
  if (/\brel="preload"/.test(tag) && !/\bas="font"/.test(tag)) continue;
  const url = tag.match(/\b(?:src|href)="\/(assets\/[^"]+)"/)?.[1];
  if (url) coldAssets.add(url);
}
const transfer = (relative) => {
  const buffer = readFileSync(path.join(distDir, relative));
  return /\.(woff2|webp|png|jpe?g)$/.test(relative) ? buffer.length : gzipSync(buffer).length;
};
let firstPaint = gzipSync(Buffer.from(html)).length;
const parts = [`index.html ${firstPaint}`];
for (const asset of coldAssets) {
  const bytes = transfer(asset);
  firstPaint += bytes;
  parts.push(`${path.basename(asset)} ${bytes}`);
}
try {
  const image = transfer(FIRST_PAINT_IMAGE);
  firstPaint += image;
  parts.push(`${FIRST_PAINT_IMAGE} ${image}`);
} catch {
  failures.push(`dist/${FIRST_PAINT_IMAGE} is missing; the intro preloads it.`);
}
if (!coldAssets.size) failures.push("dist/index.html links no /assets/ files; the first-paint budget measured nothing.");
if (firstPaint > FIRST_PAINT_BUDGET) {
  failures.push(`The first paint transfers ${firstPaint} bytes, over the ${FIRST_PAINT_BUDGET} byte budget (${parts.join(", ")}).`);
}
reported.push(`first paint ${firstPaint} bytes (${parts.join(", ")})`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Bundle size checks passed (${reported.join("; ")}).`);
}
