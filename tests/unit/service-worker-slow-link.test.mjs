import assert from "node:assert/strict";
import { test } from "node:test";

import { installServiceWorker, mayWarm } from "../../src/serviceWorker/register.js";
import { noteCasesArrived } from "../../src/state/loadProgress.js";

/**
 * The warm-up is the rest of the release, about five megabytes, fetched behind
 * a game that is being played. It was held back only for a reader who had
 * turned on data saving; a link the browser measures as 2G got the whole of it
 * on top of the scene it was waiting for. Cellular in general is still asked.
 */
test("the rest of the release is not asked for over a link measured as 2G", () => {
  assert.equal(mayWarm({ online: true, effectiveType: "slow-2g" }), false);
  assert.equal(mayWarm({ online: true, effectiveType: "2g" }), false);
  assert.equal(mayWarm({ online: true, effectiveType: "3g" }), true, "cellular as such is asked");
  assert.equal(mayWarm({ online: true, effectiveType: "4g" }), true);
  assert.equal(mayWarm({ online: true, effectiveType: undefined }), true, "a browser that does not say is asked");
  assert.equal(mayWarm({ online: true, saveData: true, effectiveType: "4g" }), false, "data saving still holds it back");
  assert.equal(mayWarm({ online: false, effectiveType: "4g" }), false);
});

/** A page with a worker active and a table up: all the warm-up waits for. */
function pageOn(connection) {
  const posted = [];
  const listeners = new Map();
  const registration = { active: { postMessage: (message) => posted.push(message) } };
  return {
    posted,
    location: { search: "" },
    document: { readyState: "complete", documentElement: { setAttribute() {}, removeAttribute() {} } },
    navigator: {
      onLine: true,
      connection,
      serviceWorker: { controller: null, register: async () => {}, ready: Promise.resolve(registration), addEventListener() {} },
    },
    requestIdleCallback: (work) => work(),
    addEventListener: (type, listener) => listeners.set(type, listener),
    fire: (type) => listeners.get(type)?.(),
  };
}
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

test("the page reads the link off the browser, and asks once it is no longer 2G", async () => {
  noteCasesArrived(55, 55);
  try {
    const slow = pageOn({ saveData: false, effectiveType: "2g" });
    installServiceWorker({ setting: "on", scope: slow });
    await settle();
    assert.deepEqual(slow.posted, [], "nothing asked over 2G");
    // The same listener that retries a warm-up the connection cut short.
    slow.navigator.connection.effectiveType = "4g";
    slow.fire("online");
    assert.deepEqual(slow.posted, [{ type: "warm" }]);

    const cellular = pageOn({ saveData: false, effectiveType: "3g" });
    installServiceWorker({ setting: "on", scope: cellular });
    await settle();
    assert.deepEqual(cellular.posted, [{ type: "warm" }]);

    const silent = pageOn(undefined);
    installServiceWorker({ setting: "on", scope: silent });
    await settle();
    assert.deepEqual(silent.posted, [{ type: "warm" }], "no Network Information API: asked");
  } finally {
    noteCasesArrived(0, 0);
  }
});
