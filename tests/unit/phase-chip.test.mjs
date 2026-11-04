import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { nodes } from "../../src/gameData.js";

/**
 * A scene's phase (the chip over its title, GameHeader.jsx) is printed as it
 * is written, in every language.
 *
 * It went through simplifyPlayerText until 2026-11-04, whose Korean UI words
 * turned two of the 225 phases into half-Korean chips on every page --
 * "OPEN RECORDS" read 「열림 RECORDS」 (c37_reading) and "CAPITAL ROUTE"
 * 「현금 ROUTE」 (c1_route_funding). The user's choice (1): no word swaps on a
 * phase. The phases are English capitals in the source and no dictionary lays
 * one over, so the chip is the source in Korean, English and Japanese alike.
 */
const root = fileURLToPath(new URL("../../", import.meta.url));

function moduleFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    return statSync(file).isDirectory() ? moduleFiles(file) : file.endsWith(".js") ? [file] : [];
  });
}

/** Every value named `phase` under a module's exports. */
function phasesIn(value, out = [], seen = new Set()) {
  if (value && typeof value === "object" && !seen.has(value)) {
    seen.add(value);
    for (const [key, item] of Object.entries(value)) {
      if (key === "phase") out.push(item);
      phasesIn(item, out, seen);
    }
  }
  return out;
}

test("the header's chip prints the scene's phase with nothing done to it", () => {
  const header = readFileSync(path.join(root, "src/components/GameHeader.jsx"), "utf8");
  assert.match(header, /<span className="case-chip">\{node\.phase\}<\/span>/);
  assert.doesNotMatch(header, /simplify/);
});

test("no dictionary lays a phase over a scene, so every language prints the source phase", async () => {
  for (const lang of ["en", "ja"]) {
    const files = moduleFiles(path.join(root, "src/locales", lang));
    assert.ok(files.length > 50, `${lang}: the dictionary's modules were found`);
    for (const file of files) {
      const phases = phasesIn(await import(pathToFileURL(file)));
      assert.deepEqual(phases, [], `${path.relative(root, file)} carries a phase`);
    }
  }
});

test("the source phases are the English capitals the chip shows", () => {
  const phases = [...new Set(Object.values(nodes).map((node) => node.phase).filter(Boolean))];
  assert.ok(phases.length > 200, `${phases.length} phases`);
  assert.ok(phases.includes("OPEN RECORDS") && phases.includes("CAPITAL ROUTE"));
  for (const phase of phases) assert.doesNotMatch(phase, /[가-힣]/, phase);
});
