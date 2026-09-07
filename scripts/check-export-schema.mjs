import { buildPlaytestExport } from "../src/state/playtestExport.js";
import { validatePlaytestExport } from "../src/state/payloadSchemas.js";

const payload = buildPlaytestExport({
  run: { currentCase: "case01", summary: { rank: "A" } },
  gameplay: { rank: "A", momentumScore: 70 },
});

const errors = validatePlaytestExport(payload);

if (errors.length) {
  console.error(`Export schema check failed: ${errors.join(", ")}`);
  process.exit(1);
}

console.log("Export schema check passed (required keys and private summary fields). ");
