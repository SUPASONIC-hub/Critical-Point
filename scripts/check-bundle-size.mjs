import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const assetsDir = path.join(root, "dist", "assets");
const budgets = [
  // GameRuntime read 450_000 until 2026-09-16, when every scene started carrying
  // its own question, room, clock and lead line (`src/nodes/sceneContext.js`),
  // and 490_000 until 사건 06 added a seventh case, 540_000 until 사건 07
  // added an eighth, and 585_000 until 사건 08 and 09 added a ninth and tenth
  // (with the scene plate's two new rooms and its motion layer). The chunk is
  // mostly the scene graph, so narrative that the player reads is exactly what
  // it is meant to weigh. Gzip is the number that reaches a phone and it stays
  // well inside its share.
  // 660_000 -> 720_000 on 2026-09-18 for 사건 10, an eleventh case: twenty scenes
  // of authored Korean prose plus its eleven data tables. The chunk is mostly
  // the scene graph, so this is narrative the player reads.
  // 720_000 -> 760_000 on 2026-09-21 for 사건 11, a twelfth case, and
  // 760_000 -> 800_000 the same day for 사건 12, a thirteenth, on the same terms.
  // 800_000 -> 1_520_000 on 2026-09-22 for 사건 13-24, twelve cases at once: some
  // 270 scenes of authored prose and their tables, plus the case copy that moved
  // here from the intro chunk (`src/caseCopy.js`). ~440KB gzip reaches a phone
  // after the intro has painted and the first click, never before it.
  // 1_520_000 -> 3_000_000 later the same day for 사건 25-49, twenty-five more
  // cases: ~530 scenes of prose and their tables. ~860KB gzip, still loaded only
  // after the intro has painted and the player has clicked.
  { pattern: /^GameRuntime-.*\.js$/, maxBytes: 3_000_000 },
  // 120_000 -> 105_000 on 2026-09-22: the per-case teasers, interludes and
  // chapter rules left for the runtime chunk, so the intro lost 44KB it never
  // showed even while twelve cases were added to them.
  // 105_000 -> 125_000 later the same day: the season list the intro draws now
  // carries 49 case titles, summaries and objectives (`gameCases.js`).
  { pattern: /^index-.*\.js$/, maxBytes: 125_000 },
  // 75_000 -> 78_000 on 2026-09-21: the plate's chamber and newsroom painters,
  // its effects layer and the drawn speaker portrait; 78_000 -> 81_000 the same
  // day for the market, memorial and factory painters and the steam layer.
  // 81_000 -> 92_000 on 2026-09-22 for six more rooms (studio, auditorium,
  // server room, orchard, trading floor, school gate) and the second effects
  // layer (snow, stage light, LEDs, bokeh, the price board, the mood grade).
  // 92_000 -> 100_000 later the same day for four more rooms (construction site,
  // courtroom, airport, call centre) and the seasonal effects layer.
  { pattern: /^PlayScreen-.*\.js$/, maxBytes: 100_000 },
  { pattern: /^ResultScreen-.*\.js$/, maxBytes: 60_000 },
  { pattern: /^index-.*\.css$/, maxBytes: 200_000 },
];

let files;
try {
  files = readdirSync(assetsDir);
} catch {
  console.error("Bundle size check could not find dist/assets. Run npm run build first.");
  process.exit(1);
}

const failures = [];
const reported = [];
for (const budget of budgets) {
  const file = files.find((name) => budget.pattern.test(name));
  if (!file) {
    failures.push(`no bundle matched ${budget.pattern}`);
    continue;
  }
  const assetPath = path.join(assetsDir, file);
  const bytes = statSync(assetPath).size;
  const gzipBytes = gzipSync(readFileSync(assetPath)).length;
  const gzipBudget = Math.ceil(budget.maxBytes * 0.4);
  reported.push(`${file}: ${bytes} bytes raw / ${gzipBytes} bytes gzip`);
  if (bytes > budget.maxBytes) failures.push(`${file} is ${bytes} bytes, over the ${budget.maxBytes} byte budget.`);
  if (gzipBytes > gzipBudget) failures.push(`${file} is ${gzipBytes} gzip bytes, over the ${gzipBudget} gzip budget.`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Bundle size checks passed (${reported.join("; ")}).`);
}
