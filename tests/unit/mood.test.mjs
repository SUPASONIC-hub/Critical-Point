import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { applyMood, currentMood, MOODS, normalizeMood, onMoodChange } from "../../src/mood.js";

/**
 * src/mood.js: the page's mood, as the stylesheet and the music read it. The
 * document is a stand-in with only what the module touches (dataset), so the
 * test shows the attribute written and removed without a DOM.
 */
beforeEach(() => {
  globalThis.document = { documentElement: { dataset: {} } };
  applyMood("neutral");
});

afterEach(() => {
  applyMood("neutral");
  delete globalThis.document;
});

test("MOODS is the design's five, neutral first, and anything else normalises to neutral", () => {
  assert.deepEqual(MOODS, ["neutral", "bright", "tense", "dread", "sorrow"]);
  for (const mood of MOODS) assert.equal(normalizeMood(mood), mood);
  for (const value of [undefined, null, "", "calm", "TENSE", 3, {}]) assert.equal(normalizeMood(value), "neutral");
});

test("a mood is written on <html data-mood> and neutral removes the attribute", () => {
  const dataset = globalThis.document.documentElement.dataset;
  assert.equal(applyMood("tense"), "tense");
  assert.equal(dataset.mood, "tense");
  assert.equal(currentMood(), "tense");
  assert.equal(applyMood("sorrow"), "sorrow");
  assert.equal(dataset.mood, "sorrow");
  assert.equal(applyMood("neutral"), "neutral");
  assert.ok(!("mood" in dataset), 'neutral is no attribute, not data-mood="neutral"');
  assert.equal(currentMood(), "neutral");
  applyMood("dread");
  assert.equal(applyMood(undefined), "neutral", "an untagged scene (no mood) is neutral");
  assert.ok(!("mood" in dataset));
  applyMood("bright");
  assert.equal(applyMood("no-such-mood"), "neutral");
  assert.ok(!("mood" in dataset));
});

test("listeners hear each change once, the same mood again is silent, and an unsubscribed listener hears nothing", () => {
  const heard = [];
  const stop = onMoodChange((mood) => heard.push(mood));
  const other = [];
  const stopOther = onMoodChange((mood) => other.push(mood));
  applyMood("tense");
  applyMood("tense");
  applyMood("tense");
  applyMood("bright");
  applyMood("unknown");
  applyMood("neutral");
  assert.deepEqual(heard, ["tense", "bright", "neutral"]);
  assert.deepEqual(other, heard);
  stop();
  applyMood("dread");
  assert.deepEqual(heard, ["tense", "bright", "neutral"]);
  assert.deepEqual(other, ["tense", "bright", "neutral", "dread"]);
  stopOther();
  stop();
  applyMood("sorrow");
  assert.deepEqual(other, ["tense", "bright", "neutral", "dread"]);
});

test("the same mood again writes nothing: the attribute is touched only on a change", () => {
  const writes = [];
  const dataset = new Proxy(
    {},
    {
      set(target, key, value) {
        writes.push(["set", key, value]);
        target[key] = value;
        return true;
      },
      deleteProperty(target, key) {
        writes.push(["delete", key]);
        delete target[key];
        return true;
      },
    },
  );
  globalThis.document = { documentElement: { dataset } };
  applyMood("tense");
  applyMood("tense");
  applyMood("neutral");
  applyMood("neutral");
  assert.deepEqual(writes, [
    ["set", "mood", "tense"],
    ["delete", "mood"],
  ]);
});

test("without a document the mood is still kept and the listeners still told", () => {
  delete globalThis.document;
  const heard = [];
  const stop = onMoodChange((mood) => heard.push(mood));
  assert.equal(applyMood("dread"), "dread");
  assert.equal(currentMood(), "dread");
  assert.deepEqual(heard, ["dread"]);
  stop();
});
