import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import { nodes } from "../../src/gameData.js";
import { simplifyPlayerText } from "../../src/playerLanguage.js";

/**
 * `simplifyPlayerText` writes Korean words in: it was made for the Korean
 * screen, where a case card or a phase still carried an English UI word. Its
 * patterns match any case, and on an English page they matched the copy
 * itself -- the start screen's case cards read "Injustice / 믿음 /
 * Helplessness" and "This 시간 the agenda is liquidation" (Linux measurement,
 * 2026-11-04). The dictionaries were clean, so no locale check saw it: the
 * Korean came in at render time.
 *
 * So every string of both dictionaries goes through it in its own language and
 * has to come out with no Hangul, and the Korean screen keeps what it had.
 */
const HANGUL = /[가-힣]/;
const localesRoot = fileURLToPath(new URL("../../src/locales/", import.meta.url));

function moduleFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    return statSync(file).isDirectory() ? moduleFiles(file) : file.endsWith(".js") ? [file] : [];
  });
}

function stringsOf(value, out = [], seen = new Set()) {
  if (typeof value === "string") out.push(value);
  else if (value && typeof value === "object" && !seen.has(value)) {
    seen.add(value);
    for (const item of Object.values(value)) stringsOf(item, out, seen);
  }
  return out;
}

for (const lang of ["en", "ja"]) {
  test(`every ${lang} dictionary string comes out of simplifyPlayerText with no Hangul`, async () => {
    const files = moduleFiles(path.join(localesRoot, lang));
    assert.ok(files.length > 50, `${lang}: the dictionary's modules were found`);
    const leaks = [];
    let count = 0;
    for (const file of files) {
      for (const text of stringsOf(await import(pathToFileURL(file)))) {
        count += 1;
        const shown = simplifyPlayerText(text, lang);
        if (HANGUL.test(shown)) leaks.push(`${path.relative(localesRoot, file)}: ${text.slice(0, 60)} -> ${shown.slice(0, 60)}`);
      }
    }
    assert.ok(count > 10_000, `${lang}: ${count} strings read`);
    assert.deepEqual(leaks.slice(0, 20), [], `${leaks.length} ${lang} strings came out with Korean in them`);
  });
}

test("a page in another language keeps the text it was given; the Korean page still gets its words", () => {
  assert.equal(simplifyPlayerText("Injustice / Trust / Helplessness", "en"), "Injustice / Trust / Helplessness");
  assert.equal(simplifyPlayerText("This time the agenda is liquidation", "en"), "This time the agenda is liquidation");
  assert.equal(simplifyPlayerText("OPEN RECORDS", "ja"), "OPEN RECORDS");
  assert.equal(simplifyPlayerText("PRESSURE CASCADE", "ko"), "압박이 이어짐");
  assert.equal(simplifyPlayerText("부당함 / 신뢰 / 무력감", "ko"), "부당함 / 신뢰 / 무력감");
  // The scene phases are English in the source; in English and Japanese they pass through untouched.
  for (const node of Object.values(nodes)) {
    if (!node.phase) continue;
    assert.equal(simplifyPlayerText(node.phase, "en"), node.phase);
    assert.equal(simplifyPlayerText(node.phase, "ja"), node.phase);
  }
});
