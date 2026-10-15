// The telemetry queue: retries after a failed response or a failed storage
// commit, consent opt-out, and a late failure against newer progress. Split
// from season-flow.spec.js.
// @once, here and below: the test runs in the desktop project only
// (playwright.config.js, the phone project's grepInvert). The tag is for a
// test that reads a save, a request or what the page says, and presses nothing
// that an untagged test does not press on the phone on the same screen. A test
// that is the only one to press a control stays in both projects.
import { expect, test } from "./helpers/network.js";
import { completeCurrentCase, openIntroDrawer } from "./helpers/gameFlow.js";
import { startDebugNode } from "./helpers/seasonFlow.js";

test("pending telemetry retries after a failed Supabase response", { tag: "@once" }, async ({ page }) => {
  let requestCount = 0;
  const postBodies = [];
  // Only table writes are telemetry. The cloud-save RPC fires a few seconds
  // after load on the same host, and when it landed between the two telemetry
  // attempts it took slot [1] -- or took the scripted 500 -- and the test
  // failed about one run in six without the retry being wrong.
  await page.route("https://e2e.supabase.co/**", async (route) => {
    const telemetryWrite = route.request().method() === "POST" && !route.request().url().includes("/rpc/");
    if (telemetryWrite) {
      requestCount += 1;
      postBodies.push(route.request().postDataJSON());
    }
    await route.fulfill({
      status: telemetryWrite && postBodies.length === 1 ? 500 : 201,
      contentType: "application/json",
      body: "{}",
    });
  });
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [
          {
            id: "telemetry-retry-e2e",
            type: "error",
            label: "retry check",
            payload: { occurred_at: new Date().toISOString(), source: "e2e", current_case: "case05", node_id: "c5_voice" },
          },
        ],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        dataConsent: true,
      }),
    );
  });
  await page.goto("/");
  await expect
    .poll(
      async () =>
        page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).pendingTelemetry.length),
      { timeout: 10_000 },
    )
    .toBe(0);
  expect(requestCount).toBeGreaterThanOrEqual(2);
  expect(postBodies.length).toBeGreaterThanOrEqual(2);
  expect(postBodies[0].event_id).toBe("telemetry-retry-e2e");
  expect(postBodies[1].event_id).toBe("telemetry-retry-e2e");
});

test("telemetry retry keeps the queue when storage commit fails", { tag: "@once" }, async ({ page }) => {
  let posts = 0;
  await page.route("https://e2e.supabase.co/**", async (route) => {
    if (route.request().method() === "POST") posts += 1;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: "{}",
    });
  });
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [
          {
            id: "telemetry-commit-failure-e2e",
            type: "error",
            label: "commit failure check",
            payload: { occurred_at: new Date().toISOString(), source: "e2e", current_case: "case05", node_id: "c5_voice" },
          },
        ],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        dataConsent: true,
      }),
    );
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "trigger-prototype-v2") {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto("/");
  await expect(page.getByText(/원격 저장 대기열 변경을 반영하지 못했습니다/)).toBeVisible({ timeout: 10_000 });
  // The row was sent, and the save could not be told so. Reading the save back
  // proved nothing -- this test is what stops it being written -- so what is
  // held is what the kept row means: the next load sends it again.
  expect(posts).toBe(1);
  await page.reload();
  await expect.poll(() => posts, { timeout: 10_000 }).toBe(2);
});

test("consent opt-out failure keeps consent and pending telemetry intact", { tag: "@once" }, async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [
          {
            id: "consent-queue-e2e",
            type: "error",
            label: "consent queue check",
            payload: { source: "e2e" },
          },
        ],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        dataConsent: true,
      }),
    );
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "trigger-prototype-v2") {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto("/");
  await openIntroDrawer(page, ".data-info-panel");
  const consentCheckbox = page.locator(".consent-box input");
  await expect(consentCheckbox).toBeChecked();
  await consentCheckbox.click();
  await expect(consentCheckbox).toBeChecked();
  await expect(page.getByText(/동의 해제 내용을 브라우저 저장본에 반영하지 못했습니다/)).toBeVisible();
  // The save itself cannot have changed (this test refuses every write to it),
  // so it is not read back. What the page holds is what counts: the box is
  // still ticked above, and after a reload it is the same page -- ticked, with
  // the row still waiting to be sent.
  await page.reload();
  await openIntroDrawer(page, ".data-info-panel");
  await expect(page.locator(".consent-box input")).toBeChecked();
});

test("delayed telemetry failure does not overwrite newer saved progress", async ({ page }) => {
  let releaseTelemetryFailure;
  let playtestRequestSeen;
  const playtestRequestSeenPromise = new Promise((resolve) => {
    playtestRequestSeen = resolve;
  });
  await page.route("https://e2e.supabase.co/**", async (route) => {
    const request = route.request();
    if (request.method() === "POST" && request.url().includes("/playtest_sessions") && !releaseTelemetryFailure) {
      playtestRequestSeen();
      await new Promise((resolve) => {
        releaseTelemetryFailure = () =>
          resolve(
            route.fulfill({
              status: 500,
              contentType: "application/json",
              body: "{}",
            }),
          );
      });
      return;
    }
    await route.fulfill({
      status: request.method() === "GET" ? 200 : 201,
      contentType: "application/json",
      body: "{}",
    });
  });
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
  });

  await page.goto("/?debug=1");
  await openIntroDrawer(page, ".data-info-panel");
  // Ticked from the first visit; check() on it was a press that could not fail.
  await expect(page.locator(".consent-box input")).toBeChecked();
  await startDebugNode(page, "case49", "c49_aftershock");
  await completeCurrentCase(page);
  await playtestRequestSeenPromise;
  await page.getByRole("button", { name: /마지막 사건 시작/ }).click();
  await expect(page.getByRole("heading", { name: /끝까지 남은 사람의 마지막 밤|모든 기록을 묶은 사람의 마지막 밤|곧장 올라간 사람의 마지막 밤|인사평가 보조지표/ })).toBeVisible();

  const savedBeforeFailureCallback = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
    return {
      currentCase: saved.currentCase,
      nodeId: saved.nodeId,
      logLength: saved.log.length,
      savedAt: saved.savedAt,
    };
  });
  // The poll that stood here read the save the moment the failure was let go,
  // found it unchanged -- nothing had answered yet -- and passed. What has to
  // be read is the save the failure's own write leaves: the page gets its 500,
  // rewrites the queue into the save (a new `savedAt`), and only then is the
  // run compared.
  const failureAnswered = page.waitForResponse((response) => response.url().includes("/playtest_sessions") && response.status() === 500);
  releaseTelemetryFailure();
  await failureAnswered;
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).savedAt), {
      message: "the failed send never wrote the queue back into the save",
      timeout: 10_000,
    })
    .not.toBe(savedBeforeFailureCallback.savedAt);
  const savedAfterFailureCallback = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
    return {
      currentCase: saved.currentCase,
      nodeId: saved.nodeId,
      logLength: saved.log.length,
      queued: saved.pendingTelemetry.length,
    };
  });
  expect(savedAfterFailureCallback).toMatchObject({
    currentCase: savedBeforeFailureCallback.currentCase,
    nodeId: savedBeforeFailureCallback.nodeId,
    logLength: savedBeforeFailureCallback.logLength,
  });
  expect(savedAfterFailureCallback.queued, "the row that failed is still waiting").toBeGreaterThan(0);
  expect(savedBeforeFailureCallback.currentCase).toBe("final");
});
