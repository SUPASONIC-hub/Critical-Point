import assert from "node:assert/strict";
import { test } from "node:test";

import { createMusicLimiter, LIMITER_SETTINGS, MUSIC_LIMITER_ON, routeMaster } from "../../src/components/musicLimiter.js";

function fakeNode(name) {
  const node = { name, links: [], connect(to) { node.links.push(to); }, disconnect() { node.links = []; } };
  return node;
}
function fakeContext() {
  const destination = fakeNode("destination");
  return {
    destination,
    createDynamicsCompressor() {
      const node = fakeNode("limiter");
      for (const key of ["threshold", "knee", "ratio", "attack", "release"]) node[key] = { value: 0 };
      return node;
    },
  };
}

test("limiter is on in the A7 draft and only catches peaks", () => {
  assert.equal(MUSIC_LIMITER_ON, true);
  assert.ok(LIMITER_SETTINGS.threshold >= -4 && LIMITER_SETTINGS.threshold <= -2);
  assert.ok(LIMITER_SETTINGS.ratio >= 12);
  assert.ok(LIMITER_SETTINGS.attack <= 0.003);
});

test("limiter takes its settings and feeds destination", () => {
  const context = fakeContext();
  const limiter = createMusicLimiter(context);
  for (const [key, value] of Object.entries(LIMITER_SETTINGS)) assert.equal(limiter[key].value, value);
  assert.deepEqual(limiter.links, [context.destination]);
});

test("master goes through the limiter when on, around it when off, never both", () => {
  const context = fakeContext();
  const limiter = createMusicLimiter(context);
  const master = fakeNode("master");
  routeMaster(context, master, limiter, true);
  assert.deepEqual(master.links, [limiter]);
  routeMaster(context, master, limiter, false);
  assert.deepEqual(master.links, [context.destination]);
  routeMaster(context, master, limiter, true);
  assert.deepEqual(master.links, [limiter]);
});

test("AdaptiveMusic routes master via routeMaster, not straight to destination", async () => {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync(new URL("../../src/components/AdaptiveMusic.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /master\.connect\(context\.destination\)/);
  assert.match(source, /routeMaster\(context, audioRuntime\.master, audioRuntime\.limiter/);
});
