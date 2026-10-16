import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";

import { getSpeakerPortrait } from "../../src/speakerPortraits.js";

/**
 * The portrait table moved out of GameRuntime (2026-10-16). A painted speaker
 * reads a file the build ships; anyone else reads null, and SpeakerPortrait
 * draws the silhouette.
 */

test("a painted speaker's portrait is a file under public/", () => {
  for (const name of ["한서윤", "반재욱", "도윤하", "오진우", "에코", "이민서", "한지우"]) {
    const src = getSpeakerPortrait(name);
    assert.match(src, /^\/portrait-[a-z0-9-]+\.webp$/, name);
    assert.ok(existsSync(`public${src}`), `${name}: public${src} ships`);
  }
});

test("a speaker not painted yet, or no speaker at all, has no portrait", () => {
  assert.equal(getSpeakerPortrait("권도현"), null, "a line still commented out is not switched on");
  assert.equal(getSpeakerPortrait("장부에 없는 사람"), null);
  assert.equal(getSpeakerPortrait(undefined), null);
});
