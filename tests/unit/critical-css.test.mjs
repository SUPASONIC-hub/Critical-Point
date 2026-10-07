import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { criticalFreshnessProblem, readGeneratedCritical, STYLESHEET_HASH_PREFIX } from "../../scripts/critical-css-rules.mjs";
import { DEFERRED_STYLES_SOURCE } from "../../vite.config.js";

/**
 * The two halves of the inlined critical CSS that a build cannot be seen to
 * get wrong: the guard that refuses a stale generated file
 * (scripts/critical-css-rules.mjs, called from vite.config.js), and the
 * script that turns the deferred stylesheet on (vite.config.js).
 */
const FILE = "src/styles/critical.generated.css";
const SHEET = ".intro{color:red}.topbar{display:flex}.gx-table{display:grid}";
const hashOf = (css) => createHash("sha256").update(css).digest("hex");
const generatedFrom = (sheet, css) => readGeneratedCritical(`${STYLESHEET_HASH_PREFIX}${hashOf(sheet)} */\n${css}\n`);

test("a generated file cut from the sheet this build made is inlined", () => {
  assert.equal(criticalFreshnessProblem({ generated: generatedFrom(SHEET, ".intro{color:red}"), bundledCss: SHEET, file: FILE }), null);
});

test("a generated file cut from another sheet fails the build, and says what changed", () => {
  const generated = generatedFrom(SHEET, ".intro{color:red}");
  // A rule added to the sheet: every inlined rule is still there, and only the hash can tell.
  const grown = criticalFreshnessProblem({ generated, bundledCss: `${SHEET}.intro h1{margin:0}`, file: FILE });
  assert.match(grown, /cut from a different stylesheet[\s\S]*build:critical[\s\S]*gained rules/);
  const changed = criticalFreshnessProblem({ generated, bundledCss: SHEET.replace("red", "blue"), file: FILE });
  assert.match(changed, /1 inlined rules no longer appear at all; first: \.intro\{color:red\}/);
});

test("a guard that cannot run is a build error, not a build", () => {
  // Both of these used to inline the file unchecked and say nothing.
  const unsigned = readGeneratedCritical(".intro{color:red}\n");
  assert.equal(unsigned.sourceHash, "");
  assert.match(criticalFreshnessProblem({ generated: unsigned, bundledCss: SHEET, file: FILE }), /does not say which stylesheet it was cut from[\s\S]*build:critical/);
  assert.match(criticalFreshnessProblem({ generated: generatedFrom(SHEET, ".intro{color:red}"), bundledCss: "", file: FILE }), /was not found in this build's bundle[\s\S]*SKIP_CRITICAL_CSS/);
});

test("the committed file says which sheet it was cut from", () => {
  const generated = readGeneratedCritical(readFileSync(FILE, "utf8"));
  assert.match(generated.sourceHash, /^[0-9a-f]{64}$/);
  assert.ok(generated.css.length > 0);
});

/** A page with one deferred stylesheet link, for the loader to run against. */
function fakePage({ landed = false } = {}) {
  const page = { links: [], fetched: 0 };
  const makeLink = (media) => {
    const link = {
      media,
      sheet: null,
      onload: null,
      onerror: null,
      cloneNode: () => makeLink(link.media),
      replaceWith(next) {
        page.links[page.links.indexOf(link)] = next;
        page.fetched += 1;
      },
    };
    return link;
  };
  const first = makeLink("print");
  if (landed) first.sheet = {};
  page.links.push(first);
  page.document = { querySelectorAll: (selector) => (selector === "link[data-deferred-style]" ? [...page.links] : []) };
  return page;
}
const runLoader = (page) => new Function("document", DEFERRED_STYLES_SOURCE)(page.document);

test("the deferred stylesheet is switched on when it lands, or at once when it already has", () => {
  const waiting = fakePage();
  runLoader(waiting);
  assert.equal(waiting.links[0].media, "print", "not before it has loaded");
  waiting.links[0].onload();
  assert.equal(waiting.links[0].media, "all");

  const landed = fakePage({ landed: true });
  runLoader(landed);
  assert.equal(landed.links[0].media, "all");
  assert.equal(landed.links[0].onerror, null, "nothing left to listen for");
});

test("a deferred stylesheet that fails to load is asked for once more, as an ordinary sheet", () => {
  // It used to stay `media="print"` for good: an intro that looked right and
  // a first table with no styles at all.
  const page = fakePage();
  const failed = page.links[0];
  runLoader(page);
  failed.onerror();
  const retry = page.links[0];
  assert.notEqual(retry, failed, "a new link, which the browser fetches again");
  assert.equal(retry.media, "all");
  assert.equal(page.fetched, 1);
  assert.equal(retry.onerror, null, "once: a server that is down is not asked forever");
});

test("the loader is one small classic script with nothing a CSP of 'self' refuses", () => {
  assert.ok(Buffer.byteLength(DEFERRED_STYLES_SOURCE) <= 200, `the loader is ${Buffer.byteLength(DEFERRED_STYLES_SOURCE)} bytes; its budget in check-bundle-size.mjs is 200`);
  assert.doesNotMatch(DEFERRED_STYLES_SOURCE, /\beval\b|new Function|setAttribute\(\s*["']on/);
});
