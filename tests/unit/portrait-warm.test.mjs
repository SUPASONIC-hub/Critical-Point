import assert from "node:assert/strict";
import { test } from "node:test";

import { nodeOrders, nodes } from "../../src/gameData.js";
import { getSpeakerPortrait, warmCasePortraits } from "../../src/speakerPortraits.js";

// A case's faces, fetched as it opens (improvement notes D-14, 2026-10-22).
test("every painted speaker of a case is fetched once a page, and again when a worker first takes the page", async () => {
  const asked = [];
  const listeners = [];
  const realFetch = globalThis.fetch;
  const realNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  globalThis.fetch = (src) => {
    asked.push(src);
    return src.includes("han-seoyun") ? Promise.reject(new Error("offline")) : Promise.resolve({});
  };
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { serviceWorker: { controller: null, addEventListener: (type, listener) => listeners.push({ type, listener }) } },
  });
  try {
    const faces = [...new Set(nodeOrders.prologue02.map((id) => getSpeakerPortrait(nodes[id]?.speaker)).filter(Boolean))];
    warmCasePortraits("prologue02");
    assert.deepEqual(asked, faces, "each face once, in the order they speak");
    warmCasePortraits("prologue02");
    assert.equal(asked.length, faces.length, "a second opening asks for nothing");
    assert.equal(listeners.length, 1);
    assert.equal(listeners[0].type, "controllerchange");
    listeners[0].listener();
    assert.equal(asked.length, faces.length * 2, "asked again once the worker can keep them");
    // No case, an unknown case and a page without fetch ask for nothing.
    warmCasePortraits("");
    warmCasePortraits("no-such-case");
    await new Promise((resolve) => setTimeout(resolve, 0));
    globalThis.fetch = undefined;
    warmCasePortraits("case03");
    assert.equal(asked.length, faces.length * 2);
  } finally {
    globalThis.fetch = realFetch;
    if (realNavigator) Object.defineProperty(globalThis, "navigator", realNavigator);
    else delete globalThis.navigator;
  }
});
