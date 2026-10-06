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
  // The runtime: the table, the rules and the index every case needs. It
  // loads after the intro has painted and the player has clicked, never before.
  // 3,200,014 bytes / 935,327 gzip on 2026-09-27, with all fifty-five cases in
  // it; 524,788 / 167,683 on 2026-09-29, when each case became a chunk of its
  // own (scripts/vite-season-data.mjs).
  { pattern: /^GameRuntime-.*\.js$/, maxBytes: 551_000, maxGzip: 176_100 },
  // One case: its scenes, replies and voice lines. A first visit fetches the
  // season's first one before the table and the rest behind it. The largest,
  // case01, was 79,679 / 19,176 on 2026-09-29.
  { pattern: /^(prologue0[1-5]|case[0-9]{2}|final)-.*\.js$/, maxBytes: 84_000, maxGzip: 20_200 },
  // The shell: what the intro needs to boot, now including the intro screen
  // itself, which stopped being a lazy chunk the entry had to fetch before it
  // could paint. 161,674 / 57,486 on 2026-09-27.
  { pattern: /^index-.*\.js$/, maxBytes: 169_800, maxGzip: 60_400 },
  // The table and its plate painters. 97,490 / 30,995 on 2026-09-27.
  // 102,400 / 32,600 -> 104,200 / 34,300 on 2026-09-28, with the table's
  // fixes from the audit. What it bought is the table being playable and
  // honest for more people: one gate for a card's click and its key, a bust
  // written before its slam is painted, Space and Enter left to the control
  // the keyboard walked to, presses graded where the pointer went down and
  // when the beat reached the ear, names a screen reader and a phone can read
  // for what only a tooltip said, and frame-loop variables that no longer
  // restyle the whole table. Measured 103,738 / 34,105. It is not on the first
  // paint: the chunk loads after the player has started a run.
  { pattern: /^PlayScreen-.*\.js$/, maxBytes: 104_200, maxGzip: 34_300 },
  // 44,024 / 13,638 on 2026-09-27.
  { pattern: /^ResultScreen-.*\.js$/, maxBytes: 46_300, maxGzip: 14_400 },
  // The whole stylesheet (the intro's share is also inlined; see
  // build-critical-css.mjs). 199,426 / 36,483 before 2026-09-27, when 133 unread
  // tokens went; 196,510 / 35,448 after. 185,195 / 33,636 on 2026-09-28, when 514
  // declarations that never won a cascade were cut and extensions.css retired.
  { pattern: /^index-.*\.css$/, maxBytes: 194_400, maxGzip: 35_300 },
  // The one font file (scripts/build-fonts.mjs), already compressed, so the raw
  // size is the transfer size. 270,000 bytes on 2026-09-27; it replaced 92
  // dynamic subsets, of which the intro alone pulled ~537KB.
  { pattern: /^pretendard-cp-.*\.woff2$/, maxBytes: 283_500, compressed: true },
  // The chunks below had no budget until 2026-09-28: the list named six files
  // and the build emits eleven, so a new 400KB lazy screen would have passed a
  // check described as a ratchet on every chunk. Measured that day, plus 5%.
  // React and the scheduler. 221,715 / 68,975. It moves only with a React bump.
  { pattern: /^react-vendor-.*\.js$/, maxBytes: 232_800, maxGzip: 72_400 },
  // The four budgets below were first written against the tree before the
  // 2026-09-28 fix pass and are set here against the tree after it, measured
  // plus 5%: the same day's other changes are what they have to hold.
  // The lucide icons the screens import, tree-shaken. 13,711 / 4,900, with the
  // icons the board's states and the recovery controls added.
  { pattern: /^icons-vendor-.*\.js$/, maxBytes: 14_400, maxGzip: 5_150 },
  // 5,293 / 2,232, with the board's loading, error and retry states.
  { pattern: /^BoardScreen-.*\.js$/, maxBytes: 5_560, maxGzip: 2_350 },
  // 3,860 / 1,759, with rows typed before they are rendered.
  // 4,060 / 1,850 -> 4,420 / 1,980 on 2026-10-06, measured 4,210 / 1,883 plus
  // 5%: the count that is not "0명" while it loads, the region that says when
  // the rows arrive, and `lang` on the English labels.
  { pattern: /^RankingScreen-.*\.js$/, maxBytes: 4_420, maxGzip: 1_980 },
  // Online save, which left the entry chunk: a device that never turned it on
  // does not download it. 9,530 / 3,780 and 4,510 / 1,890.
  { pattern: /^cloudSave-.*\.js$/, maxBytes: 10_010, maxGzip: 3_970 },
  // The panel: 4,740 / 1,990 -> 5,090 / 2,100 on 2026-10-06, measured 4,845 /
  // 1,995 plus 5%, for telling a success from a failure -- two regions that
  // are on the page before they speak, where one alert said both.
  { pattern: /^CloudSavePanelBody-.*\.js$/, maxBytes: 5_090, maxGzip: 2_100 },
  // The table's engine, shared by the shell's save repair and the runtime, so
  // the bundler gives it a chunk of its own. 34,010 / 12,870.
  { pattern: /^gauntletEngine-.*\.js$/, maxBytes: 35_720, maxGzip: 13_520 },
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

// The service worker (src/serviceWorker/worker.js), written to the root by
// `serviceWorker()` in vite.config.js. Its size is its code plus one line that
// lists every file of the release: 8,358 / 2,992 on 2026-10-06, plus 5%. It
// is fetched after `load`, so it is on no paint's path.
const WORKER_BUDGET = { maxBytes: 8_780, maxGzip: 3_150 };
try {
  const worker = readFileSync(path.join(distDir, "sw.js"));
  const gzipBytes = gzipSync(worker).length;
  reported.push(`sw.js: ${worker.length} bytes raw / ${gzipBytes} bytes gzip`);
  if (worker.length > WORKER_BUDGET.maxBytes) failures.push(`sw.js is ${worker.length} bytes, over the ${WORKER_BUDGET.maxBytes} byte budget.`);
  if (gzipBytes > WORKER_BUDGET.maxGzip) failures.push(`sw.js is ${gzipBytes} gzip bytes, over the ${WORKER_BUDGET.maxGzip} gzip budget.`);
} catch {
  failures.push("dist/sw.js is missing; the build writes it (serviceWorker() in vite.config.js).");
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
