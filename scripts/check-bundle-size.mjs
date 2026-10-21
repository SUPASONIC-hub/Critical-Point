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
  // case01, was 79,679 / 19,176 on 2026-09-29, and 94,175 / 24,159 on
  // 2026-10-06, when cases 01-07 and the finale were written at the length of
  // the rest of the season: its thirty scenes are the most of any case. It is
  // not the chunk a first visit waits for; that one is prologue01.
  { pattern: /^(prologue0[1-5]|case[0-9]{2}|final)-.*\.js$/, maxBytes: 98_900, maxGzip: 25_400 },
  // The shell: what the intro needs to boot, now including the intro screen
  // itself, which stopped being a lazy chunk the entry had to fetch before it
  // could paint. 161,674 / 57,486 on 2026-09-27.
  // 60,400 -> 61,300 gzip on 2026-10-07, measured 60,666: the shell's start
  // save tied to the run's fields, the roadmap card that resumes or asks, the
  // board and ranking states, and the worker's second warm-up.
  // 169,800 -> 169,930 bytes on 2026-10-20, measured 169,930 in the e2e build
  // CI checks, on main after #209 (main itself 167,625): 이번 주의 규칙's calendar, clock and
  // device key, the start screen's and the ranking's fetch of its views, and
  // the ranking's board switch, after the words went to chunks of their own
  // and the clock stopped writing a third copy of import.meta.env (158). Raw
  // sizes carry no hash noise.
  // 169,930 -> 169,935 the same evening, measured 169,935: the case summary that
  // ships with the shell says 사라진 열한 쪽 again, not 11쪽 (+5 bytes), so the
  // dissent's length does not read as a page number beside 14쪽 and 26쪽.
  // 169,935 -> 169,938 on 2026-10-21, measured 169,938: the origin's story
  // under DISSENT is titled 반대 의견서를 쓴 밤, the button's own word (+3).
  // 169,935 -> 169,977 on 2026-10-21 (B3 on main, the e2e build CI checks): the
  // audit's chunk in the preload list (26), the debug overlay's auditCount (13)
  // and one more dependency index (3). Folding the dev switch's leftovers
  // (an alias, a `&&!0`) by hand came out 2 bytes longer, so it stays.
  { pattern: /^index-.*\.js$/, maxBytes: 169_938, maxGzip: 61_300 },
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
  // 34,300 -> 34,373 gzip on 2026-10-20, measured 34,369 on main after #209
  // (34,363-34,369 on the day's three mains) plus the 4 bytes of hash noise: 이번 주의 규칙's briefing
  // panel. The panel and the catalogue lookup went to a chunk of their own
  // (WeekRulePanel, below); what stays is the two imports, the weeklyRules
  // import the bundler hoists, and the line that asks whether the page opens
  // a case. Main measured 34,274 that day, after #198, #205 and #209.
  // 34,300 -> 34,332 gzip on 2026-10-20, measured 34,328 plus the 4 bytes of
  // hash noise: 이번 주의 규칙's briefing panel. It took the chunk to 34,395;
  // the panel and the catalogue lookup went to a chunk of their own
  // (WeekRulePanel, below), which left the two imports and the line that asks
  // whether the page opens a case, 28 bytes over.
  // 34,332 -> 34,572 gzip on 2026-10-20, measured 34,568 plus the 4 bytes of
  // hash noise: B3's audit on the table (the run signal's 감사 n/N token, the
  // 확정 button's description, the voice's once-a-window line). It took the
  // chunk to 34,880; the audit's count, its judgement, its reading and its
  // words went to a chunk of their own (auditRisk, below), which left the
  // stage's token and description, the voice's hook and the import, 236
  // bytes over. The raw budget does not move (103,924).
  // 34,373 -> 34,615 on 2026-10-21, B3 rebased on main's 34,373 (#199):
  // measured 34,611 in the e2e build plus the 4 bytes of hash noise, the same
  // 240 bytes the audit took on the day-ten base.
  { pattern: /^PlayScreen-.*\.js$/, maxBytes: 104_200, maxGzip: 34_615 },
  // 44,024 / 13,638 on 2026-09-27.
  // 45,610 / 14,397 on 2026-10-09 with the result card's import and the
  // interlude's paragraphs, 3 gzip bytes under the ceiling; 44,365 / 13,981
  // later that day, once the report
  // stopped carrying what it could not print: a stand-in observer record, an
  // "open" afterglow and an open verdict for runs the runtime cannot produce,
  // and a guard on every panel whose record is always there
  // (tests/unit/report-copy.test.mjs holds why). The same change gave the card
  // its four fields back in place of the whole view. The "open" afterglow was
  // not one of those after all -- a finale's ledger can be all zero -- and came
  // back on 2026-10-11 for that run, inside this ceiling. The ceiling stays where
  // it was: measured plus 5% would be 46,583 / 14,680, above it, and a budget
  // here does not go up.
  { pattern: /^ResultScreen-.*\.js$/, maxBytes: 46_300, maxGzip: 14_400 },
  // The whole stylesheet (the intro's share is also inlined; see
  // build-critical-css.mjs). 199,426 / 36,483 before 2026-09-27, when 133 unread
  // tokens went; 196,510 / 35,448 after. 185,195 / 33,636 on 2026-09-28, when 514
  // declarations that never won a cascade were cut and extensions.css retired.
  // 35,300 -> 35,363 gzip on 2026-10-20, measured 35,363 (the same in every
  // build): 이번 주의 규칙's notice, which shares the previous participant's
  // card rule, and the ranking's two board tabs. Main measured 35,264 that
  // day; grouping the pressed tab with a rule of the same declarations made
  // it 5 bytes larger, not smaller.
  { pattern: /^index-.*\.css$/, maxBytes: 194_400, maxGzip: 35_363 },
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
  // 5,560 / 2,350 -> 6,040 / 2,490 on 2026-10-07, measured 5,748 / 2,373 plus
  // 5%: a button that says why it will not act, and the counters as
  // descriptions rather than part of each field's name.
  { pattern: /^BoardScreen-.*\.js$/, maxBytes: 6_040, maxGzip: 2_490 },
  // 3,860 / 1,759, with rows typed before they are rendered.
  // 4,060 / 1,850 -> 4,420 / 1,980 on 2026-10-06, measured 4,210 / 1,883 plus
  // 5%: the count that is not "0명" while it loads, the region that says when
  // the rows arrive, and `lang` on the English labels.
  // -> 4,800 / 2,100 on 2026-10-07, measured 4,567 / 2,001 plus 5%: a list
  // with spoken ranks, and a retry when the rows did not come.
  { pattern: /^RankingScreen-.*\.js$/, maxBytes: 4_800, maxGzip: 2_100 },
  // Online save, which left the entry chunk: a device that never turned it on
  // does not download it. 9,530 / 3,780 and 4,510 / 1,890.
  // -> 10,960 / 4,380 on 2026-10-07, measured 10,438 / 4,173 plus 5%: the
  // online copy held through a reset, and uploads paced under the hourly limit.
  { pattern: /^cloudSave-.*\.js$/, maxBytes: 10_960, maxGzip: 4_380 },
  // The panel: 4,740 / 1,990 -> 5,090 / 2,100 on 2026-10-06, measured 4,845 /
  // 1,995 plus 5%, for telling a success from a failure -- two regions that
  // are on the page before they speak, where one alert said both.
  { pattern: /^CloudSavePanelBody-.*\.js$/, maxBytes: 5_090, maxGzip: 2_100 },
  // The table's engine, shared by the shell's save repair and the runtime, so
  // the bundler gives it a chunk of its own. 34,010 / 12,870.
  // 35,720 / 13,520 -> 37,870 / 14,200 on 2026-10-09, measured 36,063 /
  // 13,515 plus 5% (it stood at 35,120 raw before): the reducer, the next
  // board and the settlement each ask which rules the case plays under, for
  // the prologues' staged unlocks. The list of steps and its copy are kept
  // out of this chunk; they load with the runtime.
  { pattern: /^gauntletEngine-.*\.js$/, maxBytes: 37_870, maxGzip: 14_200 },
  // The season's result card: the two buttons at the ending, the card's
  // model and the canvas code that draws it, in one chunk the ending asks for
  // when it opens. 8,271 / 3,996 on 2026-10-09, plus 5%. The buttons are in
  // here and not in the report's chunk because that chunk had 181 gzip bytes
  // left (14,219 of 14,400); what the report's chunk carries for the card is
  // the import and the four fields it hands over.
  // 4,200 -> 4,209 gzip on 2026-10-19, measured 4,205 plus the 4 bytes of hash
  // noise the tableAudio line allows: the chunk's own code did not change, it
  // gained one more `import "./weeklyRules-<hash>.js"` (이번 주의 규칙 has a
  // chunk of its own, below). The raw budget does not move.
  // 4,209 -> 4,210 on 2026-10-20: 4,204-4,210 over eight builds, the hashes'.
  // 4,209 -> 4,228 gzip on 2026-10-20, measured 4,224 plus 4, for the same
  // reason: one more `import "./auditRisk-<hash>.js"` (B3's audit, below).
  { pattern: /^ResultCardShare-.*\.js$/, maxBytes: 8_690, maxGzip: 4_229 },
  // What a run and its report read about the analyst, the ending and the
  // record (src/runtimeSystems.js). It was in the entry chunk, inside
  // advancedSystems.js, where the screen before a run never called it: taking
  // it out took the entry chunk from 169,332 / 61,055 to 162,396 / 58,367 on
  // 2026-10-11. It is a file of its own, loaded beside the runtime, because
  // the runtime's chunk had 667 gzip bytes left and this is 2,600 inside it
  // (runtimeSystemsChunk in vite.config.js). 7,103 / 3,633, plus 5%.
  { pattern: /^runtimeSystems-.*\.js$/, maxBytes: 7_460, maxGzip: 3_815 },
  // The season's copy between and around cases (src/caseCopy.js): the
  // next-case teasers and interludes, chapter rules, rank legacy lines and
  // 에코's opening lines. It was in the runtime's chunk, which had 255 gzip
  // bytes left (175,845 of 176,100) on 2026-10-14; it is fetched beside the
  // runtime the same way runtimeSystems is (CASE_COPY in
  // vite.config.js), so nothing loads later than it did. Taking it out left the
  // runtime's ceiling where it was, for the changes that were waiting on it.
  // 108,233 / 34,828, plus 5%.
  { pattern: /^caseCopy-.*\.js$/, maxBytes: 113_650, maxGzip: 36_570 },
  // The table's sound (src/gauntlet/gauntletAudio.js). It was in the
  // PlayScreen chunk, which stood at 104,323 of 104,200 on 2026-10-19 when two
  // changes that each fitted were merged together; it is fetched with the table
  // (TABLE_AUDIO in vite.config.js), so nothing loads later than it did.
  // Taking it out took PlayScreen to 97,898 / 32,131. 6,676 / 2,166 measured.
  { pattern: /^tableAudio-.*\.js$/, maxBytes: 6_700, maxGzip: 2_205 },
  // The other players' wall rate on the scene page (improvement notes D3):
  // src/state/useSceneBustRates.js and src/sceneTraces.js. Written into the
  // PlayScreen chunk they added about 945 / 441 bytes to it on 2026-10-19,
  // more than its 104,200 / 34,300 budget left before tableAudio came out; it
  // is fetched with the table (SCENE_TRACES in vite.config.js), so the line
  // appears when it did. PlayScreen carries only the import, 141 / 54.
  // 1,054 / 652 measured, plus the 4 bytes tableAudio was given for the
  // hashed file names it imports.
  { pattern: /^sceneTraces-.*\.js$/, maxBytes: 1_058, maxGzip: 656 },
  // 이번 주의 규칙 (2026-10-19), split off the entry chunk so the entry stays
  // under its budget: the rules and their words (src/gauntlet/weeklyRules.js),
  // shared by the runtime, the engine and the views below, and the start
  // screen's line and the ranking's two boards (WeeklyRuleViews.jsx), fetched
  // only in a week the calendar has (WeeklyRuleNotice.jsx). The entry keeps
  // the calendar, the clock and the device's choice. Each at what it measured
  // (1,141 / 715 and 1,662 / 909), the gzip with the 4 bytes of hash noise.
  // weeklyRules 1,141 -> 1,142 on 2026-10-20: HEAVY FRACTURE's "1.75배로"
  // (check:text) is one UTF-8 byte longer than "×1.75로".
  // 1,142 / 719 -> 1,159 / 738 on 2026-10-21, measured 1,159 / 734: NEAR WALL
  // says what the 4 is, 벽 띠가 열기 4만큼 앞당겨 선다 (+17).
  // 1,141 / 719 -> 1,552 / 957 on 2026-10-19, measured 1,552 / 953 plus the
  // hash noise: B3's AUDIT is a week's device, so its entry, its line, its
  // four numbers, the allowlist of devices and the check that reads it live
  // here. Cut first: its numbers were imported from tableRules.js, which
  // pulled that whole module into this chunk (2,033 / 1,246), and the line
  // lost its first sentence; the HUD's and the voice's words are in the
  // table's own chunk (tableMeters.js, tableVoice.js).
  // Rebased on main (2026-10-21): main's 1,142 plus B3's 411 bytes.
  // audit's own chunk (auditRisk, below).
  { pattern: /^weeklyRules-.*\.js$/, maxBytes: 1_570, maxGzip: 976 },
  { pattern: /^WeeklyRuleViews-.*\.js$/, maxBytes: 1_662, maxGzip: 913 },
  // Its panel on a case's opening page (src/gauntlet/WeekRulePanel.jsx,
  // WEEK_RULE_PANEL in vite.config.js), taken out of the PlayScreen chunk on
  // 2026-10-20 and fetched with it. 801 / 511 measured, the gzip plus 4.
  { pattern: /^WeekRulePanel-.*\.js$/, maxBytes: 801, maxGzip: 515 },
  // B3's audit (src/gauntlet/auditRisk.js, AUDIT_RISK in vite.config.js): its
  // count, its judgement, the table's reading and its words, out of the
  // engine's chunk (14,417 of 14,200 with it, 14,186 without) and the table's
  // on 2026-10-20. 1,680 / 938 measured, the gzip plus 4. 1,917 / 1,044 the
  // same day with the table record's audit sentence (describeAuditLedger,
  // user's choice 1): it went here because the result screen's chunk, where
  // the record is drawn, had 157 gzip bytes left and took it to 14,422 of
  // 14,400 even written as a file of its own, and that budget does not go up.
  // Raised by what it measured, the gzip plus 4.
  { pattern: /^auditRisk-.*\.js$/, maxBytes: 1_917, maxGzip: 1_048 },
  // The deferred-stylesheet loader (vite.config.js), a fixed string. 153 bytes.
  { pattern: /^deferred-styles-.*\.js$/, maxBytes: 200, maxGzip: 200 },
];

/**
 * What a release must not carry. The debug console -- the case jump, the
 * unlock-all button, the overlay -- is compiled out of a build that did not ask
 * for it (`debugBuild`, src/appConfig.js). It used to ship switched off, and a
 * `VITE_ENABLE_DEBUG_TOOLS=true` left in the build environment would have
 * switched it on for every visitor with every check green.
 *
 * The dev switch that forces this week's rule (`?week=`, weeklyCalendar.js)
 * is held the same way: its entry is the only place `added:"dev"` is written.
 */
const MUST_NOT_SHIP = ["debug-case-select", "debug-node-select", "debug-start-node", "unlock-all-cases", "debug-overlay", "DEBUG JUMP", 'added:"dev"'];

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
// 8,780 / 3,150 -> 8,792 / 3,171 on 2026-10-19, measured 8,792 / 3,167 (gzip
// plus the 4 bytes of hash noise): the list names two more files, the chunks
// 이번 주의 규칙 was split into above; the worker's code did not change.
// 8,792 / 3,171 -> 8,828 / 3,183 on 2026-10-20, measured 8,828 / 3,179 (gzip
// plus 4): one more file, the week's rule's briefing panel (WeekRulePanel).
// 8,828 / 3,183 -> 8,862 / 3,200 on 2026-10-20, measured 8,862 / 3,196 on main
// after #209 (3,188-3,196 on the day's three mains; main itself 8,754 / 3,146)
// plus 4: the same three more file names in a longer list.
// 8,828 / 3,183 -> 8,860 / 3,196 on 2026-10-20, measured 8,860 / 3,192 (gzip
// plus 4): one more file, B3's audit (auditRisk).
const WORKER_BUDGET = { maxBytes: 8_894, maxGzip: 3_217 };
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
