import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const { SEEN_GLOSSES_KEY } = await import("../../src/appConfig.js");
const { markGlossesSeen, readSeenGlosses } = await import("../../src/components/seenGlosses.js");
const { RESET_STORAGE_KEYS } = await import("../../src/state/runStorageReset.js");
const { markProse } = await import("../../src/components/proseMarks.js");
const { GLOSSARY, STANDARD_GLOSS } = await import("../../scripts/plain-language-rules.mjs");

// Folded brackets (improvement notes B-7, 2026-10-22).
test("the save remembers the terms it has seen explained, and 초기화 forgets them", () => {
  localStorage.clear();
  assert.deepEqual([...readSeenGlosses()], []);
  markGlossesSeen(["계열사", "부채비율"]);
  markGlossesSeen(["계열사"]);
  assert.deepEqual([...readSeenGlosses()], ["계열사", "부채비율"]);
  localStorage.setItem(SEEN_GLOSSES_KEY, "{broken");
  assert.deepEqual([...readSeenGlosses()], [], "an unreadable record folds nothing");
  assert.ok(RESET_STORAGE_KEYS.includes(SEEN_GLOSSES_KEY), "a new run sees every term explained again");
});

test("every glossary term, glossed after it, is a term the page can fold", () => {
  // The list the plain-language check keeps (GLOSSARY, and the terms with a
  // standard gloss) is the list a reader is told; each one, written the way
  // the season writes a gloss, is marked as a term with its note after it.
  for (const term of new Set([...GLOSSARY, ...Object.keys(STANDARD_GLOSS)])) {
    if (/\s/.test(term)) continue; // two words: the mark takes the word right before the bracket.
    const segments = markProse(`그 ${term}(${STANDARD_GLOSS[term] ?? "뜻풀이"})이 있었다.`);
    const at = segments.findIndex((segment) => segment.marks.includes("term"));
    assert.equal(segments[at]?.text, term, term);
    assert.ok(segments[at + 1]?.marks.includes("note"), `${term}: its bracket follows`);
  }
});

test("a folded bracket stays in the page for a screen reader, and the word unfolds it", () => {
  const prose = readFileSync(new globalThis.URL("../../src/components/Prose.jsx", import.meta.url), "utf8");
  assert.match(prose, /<button type="button" className="pr-term pr-fold" aria-expanded=\{open\}/);
  assert.match(prose, /<span className=\{open \? undefined : "sr-only"\}>/, "hidden from the eye, not removed");
  const css = readFileSync(new globalThis.URL("../../src/styles/app/base-intro-ranking.css", import.meta.url), "utf8");
  assert.match(css, /\.pr-fold \{[^}]*border: 0;/);
});
