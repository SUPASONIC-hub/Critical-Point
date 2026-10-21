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
  for (const name of ["한서윤", "반재욱", "도윤하", "오진우", "에코", "이민서", "한지우", "권도현", "백아린", "윤상혁", "문하준", "나은호", "고은비", "주은채", "선재윤", "백다온", "하도율", "남지형"]) {
    const src = getSpeakerPortrait(name);
    assert.match(src, /^\/portrait-[a-z0-9-]+\.webp$/, name);
    assert.ok(existsSync(`public${src}`), `${name}: public${src} ships`);
  }
});

test("a speaker not painted yet, or no speaker at all, has no portrait", () => {
  assert.equal(getSpeakerPortrait("탁예린"), null, "a speaker of a few lines keeps the silhouette");
  assert.equal(getSpeakerPortrait("장부에 없는 사람"), null);
  assert.equal(getSpeakerPortrait(undefined), null);
});
