import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Rules a later sheet or a wider query silently undoes. They are read from the
 * source because nothing here renders a page: the browser suite holds what
 * they look like, and this holds that they are still written the way that
 * makes them apply.
 */
const sheet = (name) => readFileSync(new globalThis.URL(`../../src/styles/app/${name}.css`, import.meta.url), "utf8");

test("the phone-on-its-side layout is for phones", () => {
  const queries = sheet("responsive").match(/@media[^{]*orientation: landscape[^{]*/g) ?? [];
  assert.equal(queries.length, 3);
  for (const query of queries) {
    assert.match(query, /\(pointer: coarse\)/, `${query.trim()}: a laptop zoomed to 200% is this short too`);
  }
});

test("the table's shell does not pad the notch a second time", () => {
  const shell = sheet("responsive").match(/\(pointer: coarse\) \{\s*\.game-shell \{[^}]*\}/)?.[0] ?? "";
  assert.match(shell, /padding:/);
  assert.doesNotMatch(shell, /safe-area-inset-(left|right)/, "the body already pads the sides");
});

test("no phone on its side reads the question as one line", () => {
  const clamps = sheet("responsive").match(/\.gx-question \{[^}]*\}/g) ?? [];
  assert.equal(clamps.length, 1);
  assert.match(clamps[0], /-webkit-line-clamp: 2;/, "the brief is hidden there, so the question has nowhere else to be read");
});

test("the reveal keeps out from under a side notch at every width", () => {
  // recovery.css comes later and sets the backdrop's padding under 768px; one
  // class there, so two here.
  assert.match(sheet("responsive"), /\.shell \.decision-reveal-backdrop \{\s*padding: [^;]*safe-area-inset-right[^;]*safe-area-inset-left/);
  assert.match(sheet("recovery"), /\n {2}\.decision-reveal-backdrop \{/);
});

test("the quiet skip outranks the ending's primary button", () => {
  const result = sheet("result");
  assert.match(result, /\.ending-shell \.ending-beat \.ending-quiet-skip \{/);
  assert.ok(result.includes(".ending-shell .ending-beat button {"), "the rule it has to beat is still two classes and a tag");
});

test("the callsign field's focus ring survives forced colours", () => {
  const focus = sheet("base-intro-ranking").match(/\.intro \.start-panel \.start-input-row input:focus-visible \{[^}]*\}/)?.[0] ?? "";
  assert.match(focus, /outline: 2px solid transparent;/, "a box-shadow is dropped in forced colours; a transparent outline is repainted");
});

test("the mastery bar's fill is drawn in forced colours", () => {
  // A background colour is repainted as the canvas there, and the bar is nothing else.
  const fills = sheet("responsive").match(/@media \(forced-colors: active\) \{[\s\S]*?(\.gx-gauge-fill,[^{]*)\{[^}]*\}/);
  assert.ok(fills, "the forced-colours block lists the fills");
  assert.match(fills[1], /\.gx-focus-modes i b,/);
  assert.match(fills[0].slice(fills[0].lastIndexOf("{")), /forced-color-adjust: none;\s*background: Highlight;/);
});
test("a stance that cannot be changed is dimmed, and the one in force is not", () => {
  const play = sheet("play");
  assert.match(play, /\.gx-focus-modes \[aria-disabled="true"\] \{\s*cursor: not-allowed;\s*\}/);
  assert.match(play, /\.gx-focus-modes \[aria-disabled="true"\]:not\(\.active\) \{\s*opacity: 0\.5;\s*\}/, "the active stance is what a locked table is holding: it stays at full strength");
});

test("the clock, the key hints and the card preview are sized in the type's own unit", () => {
  const play = sheet("play");
  const boxes = [...play.matchAll(/\.gx-clock \{[^}]*\}|\.gx-card-key \{[^}]*\}|\.gx-hand-head kbd \{[^}]*\}|\.gx-card-preview \{[^}]*\}/g)].map((match) => match[0]);
  assert.ok(boxes.length >= 10, `found ${boxes.length} rules`);
  for (const box of boxes) {
    const sized = box.match(/^\s*(?:min-|max-)?(?:width|height): [^;]*;/gm) ?? [];
    for (const declaration of sized) assert.doesNotMatch(declaration, /\dpx/, `${box.split("{")[0].trim()} holds rem type in a px box: ${declaration.trim()}`);
  }
});