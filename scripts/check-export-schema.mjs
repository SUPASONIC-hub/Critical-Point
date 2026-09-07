import { buildPlaytestExport } from "../src/state/playtestExport.js";

const payload = buildPlaytestExport({
  run: { currentCase: "case01", summary: { rank: "A" } },
  gameplay: { rank: "A", momentumScore: 70 },
});

const requiredKeys = ["saveSchemaVersion", "exportedAt", "exportMode", "currentCase", "summary", "gameplay"];
const missing = requiredKeys.filter((key) => !(key in payload));
const privateKeys = ["playerName", "freeText", "comment", "sessionId", "log", "errorLog", "saveSlots", "trace"];
const leaked = privateKeys.filter((key) => key in payload);

if (missing.length || leaked.length || payload.exportMode !== "summary") {
  console.error(
    `Export schema check failed: missing=${missing.join(",") || "none"}; ` +
      `private=${leaked.join(",") || "none"}; mode=${payload.exportMode}`,
  );
  process.exit(1);
}

console.log(`Export schema check passed (${requiredKeys.length} required keys, no private summary fields).`);
