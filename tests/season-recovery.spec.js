// Saved runs that leave, come back, break or are repaired: the recovery notice
// and error log, recovery slots, corrupt saves, storage that refuses a write,
// reset, the error boundary and replay links. Split from season-flow.spec.js.
import { expect, expectNoStrayRequests, guardNetwork, test } from "./helpers/network.js";
import { acceptConfirms } from "./helpers/dialogs.js";
import { CASE_SEQUENCE, nodes } from "../src/gameData.js";
import { encodeReplaySeed, REPLAY_QUERY_KEY } from "../src/state/trace.js";
import {
  chooseFirstAvailableChoice,
  resumeSavedRun,
  startFirstRun,
  dismissProtocolBreach,
} from "./helpers/gameFlow.js";
import { startDebugNode } from "./helpers/seasonFlow.js";

// @once, here and below: the test runs in the desktop project only
// (playwright.config.js, the phone project's grepInvert). The tag is for a
// test that reads a save, a request or what the page says, and presses nothing
// that an untagged test does not press on the phone on the same screen. A test
// that is the only one to press a control stays in both projects.
test("leaving an active scene marks the saved run as paused", { tag: "@once" }, async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).paused))
    .toBe(true);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.started).toBe(true);
  expect(saved.currentCase).toBe("case05");
  expect(saved.nodeId).toBe("c5_voice");
});

test("bfcache return resumes an active scene without losing its route", { tag: "@once" }, async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).paused))
    .toBe(true);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).paused))
    .toBe(false);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.started).toBe(true);
  expect(saved.currentCase).toBe("case05");
  expect(saved.nodeId).toBe("c5_voice");
});

test("recovery notice and local error log are visible from saved error metadata", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
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
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        lastError: {
          id: "error-e2e",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Synthetic recovery check",
          currentCase: "case05",
          nodeId: "c5_voice",
        },
      }),
    );
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [
          {
            id: "error-e2e",
            occurredAt: new Date().toISOString(),
            error: { message: "Synthetic recovery check" },
            context: {
              source: "react-render",
              currentCase: "case05",
              nodeId: "c5_voice",
              logLength: 0,
              lastChoiceId: "",
            },
          },
        ],
      }),
    );
  });
  await page.reload();

  await expect(page.getByText("복구됨")).toBeVisible();
  await page.getByTestId("open-error-log-from-notice").click();
  await expect(page.getByTestId("error-log-panel").getByText("Synthetic recovery check")).toBeVisible();
});

test("Escape closes the recovery error panel", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("error-log-panel")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("error-log-panel")).toHaveCount(0);
});

test("recovery center is reachable for normal players after an error", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        paused: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        lastError: {
          id: "normal-recovery-center",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Recovery center access check",
          currentCase: "case05",
          nodeId: "c5_voice",
        },
      }),
    );
  });
  await page.goto("/");
  await page.getByTestId("open-error-log-from-notice").click();
  await expect(page.getByTestId("error-log-panel")).toBeVisible();
  await expect(page.getByTestId("save-slot-panel")).toBeVisible();
});

test("starting a fresh game clears stale recovery guidance", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        paused: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: { time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 },
        triggers: {},
        cognition: {},
        lastError: {
          id: "stale-recovery-guidance",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Stale error should disappear after a fresh start",
          currentCase: "case05",
          nodeId: "c5_voice",
        },
      }),
    );
  });
  await page.goto("/");
  await expect(page.getByText("복구됨")).toBeVisible();
  // The save is a run that can be resumed, so starting over asks first.
  const asked = await acceptConfirms(page);
  await startFirstRun(page);
  expect(asked.at(-1)).toContain("첫 사건부터 새로 시작");
  await expect(page.locator(".recovery-notice")).toHaveCount(0);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.lastError).toBeNull();
  expect(saved.currentCase).toBe(CASE_SEQUENCE[0]);
});

test("error log replay jumps to the captured scene", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case02",
        nodeId: "c2_start",
        completedCases: ["case01"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        lastError: {
          id: "error-replay-e2e",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Replay recovery check",
          currentCase: "case05",
          nodeId: "c5_voice",
        },
      }),
    );
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [
          {
            id: "error-replay-e2e",
            occurredAt: new Date().toISOString(),
            error: { message: "Replay recovery check" },
            context: {
              source: "react-render",
              currentCase: "case05",
              nodeId: "c5_voice",
              logLength: 0,
              lastChoiceId: "",
            },
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-notice").click();
  await page.locator(".error-replay-button").first().click();
  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.getByRole("heading", { name: "이름 없는 증언" })).toBeVisible();
  const savedAfterReplay = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(savedAfterReplay.currentCase).toBe("case02");
  expect(savedAfterReplay.nodeId).toBe("c2_start");
});

test("corrupt saved route is repaired before resume", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case05",
        nodeId: "c3_start",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        paused: true,
      }),
    );
  });
  await page.reload();
  // The runtime is the one place a save is repaired (the shell cannot see the
  // scene graph), and it does so once its chunk has loaded -- wait for that.
  await expect
    .poll(async () => (await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")))).nodeId, {
      timeout: 30_000,
    })
    .toBe("c5_start");
  const repaired = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(repaired.currentCase).toBe("case05");
  expect(repaired.nodeId).toBe("c5_start");
  expect(repaired.lastError.source).toBe("save-integrity");
  await page.getByTestId("resume-save").click();
  await expect(page.getByRole("heading", { name: "NO ONE TO BLAME" })).toBeVisible();
});

test("corrupt saved nested gameplay data is repaired before render", { tag: "@once" }, async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "missing-case", null],
        discoveredClues: [null, { id: "clue-e2e" }],
        log: [
          null,
          { nodeId: null, choiceId: "broken" },
          {
            nodeId: "c5_voice",
            title: "이름 없는 증언",
            choiceId: "c5_voice_reaction_choice_1",
            choice: "증언자를 보호하고 기록을 복원한다",
            effect: { trust: "bad", legitimacy: 4 },
            triggers: [null, "system"],
            responseTimeSec: Number.NaN,
          },
        ],
        pendingTelemetry: [],
        caseResults: {
          case01: { primary: null, rank: null },
          missing: { primary: ["responsibility", 1] },
        },
        playtestFeedback: {
          case01: { comment: 42 },
          missing: { comment: "drop" },
        },
        resources: {},
        triggers: {},
        cognition: {},
      }),
    );
  });
  await page.reload();

  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.getByRole("heading", { name: "이름 없는 증언" })).toBeVisible();
  const repaired = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(repaired.lastError.source).toBe("save-integrity");
  expect(repaired.completedCases).toEqual(["case01"]);
  expect(repaired.discoveredClues).toEqual([{ id: "clue-e2e", title: "clue-e2e", text: "" }]);
  expect(repaired.log).toHaveLength(1);
  expect(repaired.log[0].effect).toEqual({ legitimacy: 4 });
  expect(repaired.log[0].triggers).toEqual(["system"]);
  expect(repaired.caseResults.case01.primary).toEqual(["responsibility", 0]);
  expect(repaired.caseResults.missing).toBeUndefined();
  expect(repaired.playtestFeedback.case01.comment).toBe("");
  expect(repaired.playtestFeedback.missing).toBeUndefined();
});

test("corrupt error log entries are filtered before the diagnostics panel renders", { tag: "@once" }, async ({ page }) => {
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: false,
        currentCase: "case01",
        nodeId: "start",
        completedCases: [],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
      }),
    );
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [
          null,
          { id: "broken-null-context", context: null, error: null },
          {
            id: "valid-error",
            occurredAt: "2026-08-21T10:00:00.000Z",
            error: { name: "TypeError", message: "Recovered diagnostic entry", stack: 42 },
            context: { source: "runtime", currentCase: "case01", nodeId: "start", logLength: 0 },
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();

  await expect(page.getByTestId("error-log-panel").getByText("Recovered diagnostic entry")).toBeVisible();
  const entries = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-error-log-v1")).entries);
  expect(entries).toHaveLength(2);
  expect(entries[0].context.currentCase).toBe("unknown");
  expect(entries[0].error.message).toBe("Unknown error");
  expect(entries[1].error.stack).toBe("");
});

test("restoring a corrupt recovery slot repairs nested data before resume", { tag: "@once" }, async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    const snapshot = {
      saveSchemaVersion: 2,
      playerName: "E2E",
      started: false,
      paused: true,
      currentCase: "case05",
      nodeId: "c5_voice",
      completedCases: ["case01", "bad-case"],
      discoveredClues: [null],
      log: [null],
      pendingTelemetry: [{ id: "bad", type: "unknown", payload: {} }],
      caseResults: { case05: { primary: null } },
      playtestFeedback: { case05: { comment: 42 } },
      resources: {},
      triggers: {},
      cognition: {},
    };
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [{
          id: "slot-corrupt",
          savedAt: "2026-08-21T10:00:00.000Z",
          currentCase: "case05",
          nodeId: "c5_voice",
          completedCases: ["case01"],
          snapshot,
        }],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await page.getByTestId("restore-save-slot-slot-corrupt").click();
  await page.waitForLoadState("domcontentloaded");

  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(restored.currentCase).toBe("case05");
  expect(restored.nodeId).toBe("c5_voice");
  expect(restored.completedCases).toEqual(["case01"]);
  expect(restored.pendingTelemetry).toEqual([]);
  expect(restored.caseResults.case05.primary).toEqual(["responsibility", 0]);
  expect(restored.playtestFeedback).toEqual({});
});

test("storage write failure does not block scene start", async ({ page }) => {
  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "trigger-prototype-v2" || key === "trigger-prototype-save-slots-v1") {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto("/");
  await startFirstRun(page);
  await expect(page.locator(".choices .choice").first()).toBeVisible();
});

test("recovery slot can be restored and deleted from debug panel", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [
          {
            id: "slot-restore-e2e",
            savedAt: new Date().toISOString(),
            currentCase: "case05",
            nodeId: "c5_voice",
            completedCases: ["case01", "case02", "case03", "case04"],
            snapshot: {
              recoverySlotSchemaVersion: 1,
              saveSchemaVersion: 2,
              playerName: "E2E",
              started: false,
              paused: true,
              currentCase: "case05",
              nodeId: "c5_voice",
              completedCases: ["case01", "case02", "case03", "case04"],
              discoveredClues: [],
              log: [],
              pendingTelemetry: [],
              caseResults: {},
              playtestFeedback: {},
              resources: {},
              triggers: {},
              cognition: {},
            },
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("save-slot-panel").getByText("case05 / c5_voice")).toBeVisible();
  await page.getByTestId("save-slot-panel").getByRole("button", { name: /삭제/ }).click();
  expect(await page.getByTestId("save-slot-panel").getByText("case05 / c5_voice").count()).toBe(0);
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("trigger-prototype-save-slots-v1"));
    state.slots = [
      {
        id: "slot-restore-e2e",
        savedAt: new Date().toISOString(),
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        snapshot: {
          recoverySlotSchemaVersion: 1,
          saveSchemaVersion: 2,
          playerName: "E2E",
          started: false,
          paused: true,
          currentCase: "case05",
          nodeId: "c5_voice",
          completedCases: ["case01", "case02", "case03", "case04"],
          discoveredClues: [],
          log: [],
          pendingTelemetry: [],
          caseResults: {},
          playtestFeedback: {},
          resources: {},
          triggers: {},
          cognition: {},
        },
      },
    ];
    localStorage.setItem("trigger-prototype-save-slots-v1", JSON.stringify(state));
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await page.getByTestId("save-slot-panel").getByRole("button", { name: /복원/ }).click();
  await page.waitForLoadState("domcontentloaded");
  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(restored.currentCase).toBe("case05");
  expect(restored.nodeId).toBe("c5_voice");
  expect(restored.resources).toEqual({ time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 });
  expect(Object.values(restored.triggers).every((value) => value === 0)).toBe(true);
  expect(Object.values(restored.cognition).every((value) => value === 0)).toBe(true);
  await resumeSavedRun(page);
  await expect(page.locator(".choices .choice").first()).toBeVisible();
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".choices .choice").first()).toBeVisible();
});

test("recovery slot delete failure keeps the slot visible", { tag: "@once" }, async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [
          {
            id: "slot-delete-failure-e2e",
            savedAt: new Date().toISOString(),
            currentCase: "case05",
            nodeId: "c5_voice",
            completedCases: ["case01", "case02", "case03", "case04"],
            snapshot: {
              recoverySlotSchemaVersion: 1,
              saveSchemaVersion: 2,
              playerName: "E2E",
              started: false,
              paused: true,
              currentCase: "case05",
              nodeId: "c5_voice",
              completedCases: ["case01", "case02", "case03", "case04"],
              discoveredClues: [],
              log: [],
              pendingTelemetry: [],
              caseResults: {},
              playtestFeedback: {},
              resources: {},
              triggers: {},
              cognition: {},
            },
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("save-slot-panel").getByText("case05 / c5_voice")).toBeVisible();
  await page.evaluate(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "trigger-prototype-save-slots-v1") {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.getByTestId("save-slot-panel").getByRole("button", { name: /삭제/ }).click();
  await expect(page.getByTestId("save-slot-panel").getByText("case05 / c5_voice")).toBeVisible();
});

test("recovery slot restore repairs invalid saved route before writing", { tag: "@once" }, async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [
          {
            id: "slot-invalid-route-e2e",
            savedAt: new Date().toISOString(),
            currentCase: "case05",
            nodeId: "missing-node",
            completedCases: ["case01", "case02", "case03", "case04"],
            snapshot: {
              recoverySlotSchemaVersion: 1,
              saveSchemaVersion: 2,
              playerName: "E2E",
              started: false,
              paused: true,
              currentCase: "case05",
              nodeId: "missing-node",
              completedCases: ["case01", "case02", "case03", "case04"],
              discoveredClues: [],
              log: [],
              pendingTelemetry: [],
              caseResults: {},
              playtestFeedback: {},
              resources: {},
              triggers: {},
              cognition: {},
            },
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await page.getByTestId("save-slot-panel").getByRole("button", { name: /복원/ }).click();
  await page.waitForLoadState("domcontentloaded");
  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(restored.currentCase).toBe("case05");
  expect(restored.nodeId).toBe("c5_start");
  expect(restored.lastError.source).toBe("save-integrity");
});

test("error log clear failure keeps the log visible", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [
          {
            id: "error-clear-failure-e2e",
            occurredAt: new Date().toISOString(),
            error: { message: "Clear failure check" },
            context: { source: "e2e", currentCase: "case05", nodeId: "c5_voice", logLength: 0, lastChoiceId: "" },
          },
        ],
      }),
    );
  });
  await page.reload();
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("error-log-panel").getByText("Clear failure check")).toBeVisible();
  await page.evaluate(() => {
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function removeItem(key) {
      if (key === "trigger-prototype-error-log-v1") {
        throw new DOMException("Remove failed", "QuotaExceededError");
      }
      return originalRemoveItem.call(this, key);
    };
  });
  await page.getByTestId("error-log-panel").getByRole("button", { name: /로그 비우기/ }).click();
  await expect(page.getByTestId("error-log-panel").getByText("Clear failure check")).toBeVisible();
  await expect(
    page.getByTestId("error-log-panel").getByText("Error log clear failed because local storage could not be written.", { exact: true }),
  ).toBeVisible();
});

test("reset clears progress, error logs, and recovery slots", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
      }),
    );
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        saveSchemaVersion: 1,
        entries: [{ id: "reset-error", occurredAt: new Date().toISOString(), error: { message: "reset" }, context: {} }],
      }),
    );
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [{ id: "reset-slot", savedAt: new Date().toISOString(), currentCase: "case05", nodeId: "c5_voice", completedCases: [], snapshot: {} }],
      }),
    );
  });
  await page.reload();
  await expect(page.locator(".game-shell")).toBeVisible();
  // The briefing page covers 초기화, and the click used to wait out its reading clock.
  await dismissProtocolBreach(page);
  await page.getByRole("button", { name: /초기화/ }).click();
  const storedKeys = await page.evaluate(() => ({
    save: localStorage.getItem("trigger-prototype-v2"),
    errors: localStorage.getItem("trigger-prototype-error-log-v1"),
    slots: localStorage.getItem("trigger-prototype-save-slots-v1"),
  }));
  expect(storedKeys).toEqual({ save: null, errors: null, slots: null });
  await expect(page.locator(".intro")).toBeVisible();
});

test("reset failure records failed storage keys", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.locator(".game-shell")).toBeVisible();
  await page.evaluate(() => {
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function removeItem(key) {
      if (key === "trigger-prototype-save-slots-v1") {
        throw new DOMException("Remove failed", "QuotaExceededError");
      }
      return originalRemoveItem.call(this, key);
    };
  });
  await page.getByRole("button", { name: /초기화/ }).click();
  await expect(page.locator(".intro")).toBeVisible();
  await expect(page.getByTestId("retry-storage-cleanup")).toBeVisible();
  await page.getByTestId("retry-storage-cleanup").click();
  await expect(page.getByText(/저장소 정리 재시도 실패/)).toBeVisible();
  const errorLog = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-error-log-v1")));
  expect(errorLog.entries[0].context.failedStorageKeys).toContain("trigger-prototype-save-slots-v1");
  expect(["StorageResetError", "StorageResetRetryError"]).toContain(errorLog.entries[0].error.name);
});

test("repeated render errors block the retry loop and preserve recovery choices", { tag: "@once" }, async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
        lastError: {
          id: "repeat-render-error",
          occurredAt: new Date().toISOString(),
          source: "react-render",
          message: "Repeated render failure",
          currentCase: "case05",
          nodeId: "c5_voice",
          retryCount: 2,
        },
      }),
    );
    localStorage.setItem("critical-point-force-render-error", "1");
  });
  await page.goto("/?debug=1");
  await expect(page.getByTestId("error-retry")).toBeDisabled();
  await expect(page.getByText("같은 저장 지점에서 오류가 반복되어 재시도를 중단했습니다.")).toBeVisible();
  await expect(page.getByTestId("error-start-fresh")).toBeVisible();
});

test("error boundary can clear the current saved state", async ({ page }) => {
  await acceptConfirms(page);
  await page.goto("/?debug=1");
  await page.evaluate(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
      }),
    );
    localStorage.setItem("critical-point-force-render-error", "1");
  });
  await page.reload();
  await expect(page.getByRole("heading", { name: "장면을 불러오지 못했습니다." })).toBeVisible();
  await page.getByRole("button", { name: "저장본을 초기화하고 새 게임" }).click();
  await expect(page.locator(".intro")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("trigger-prototype-v2"))).toBeNull();
});

test("error boundary clear save failure does not reload", { tag: "@once" }, async ({ page }) => {
  await acceptConfirms(page);
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "E2E",
        started: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        discoveredClues: [],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
      }),
    );
    localStorage.setItem("critical-point-force-render-error", "1");
    const originalRemoveItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function removeItem(key) {
      if (key === "trigger-prototype-v2") {
        throw new DOMException("Remove failed", "QuotaExceededError");
      }
      return originalRemoveItem.call(this, key);
    };
  });
  await page.goto("/?debug=1");
  await expect(page.getByRole("heading", { name: "장면을 불러오지 못했습니다." })).toBeVisible();
  await page.getByRole("button", { name: "저장본을 초기화하고 새 게임" }).click();
  await expect(page.getByText("현재 저장본을 삭제하지 못했습니다. 브라우저 저장소 권한을 확인한 뒤 다시 시도하세요.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "장면을 불러오지 못했습니다." })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("trigger-prototype-v2"))).not.toBeNull();
});

test("a replay link restores the captured scene in a fresh context", async ({ page, browser, baseURL }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case04", "c4_vote");
  await chooseFirstAvailableChoice(page);
  await page.waitForSelector(".game-shell");

  const before = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
    return {
      nodeId: saved.nodeId,
      currentCase: saved.currentCase,
      resources: saved.resources,
      log: (saved.log ?? []).map((entry) => ({ nodeId: entry.nodeId, choiceId: entry.choiceId })),
    };
  });

  // The player copies this link from the debug panel; build it with the same
  // encoder so the test does not depend on a headless clipboard.
  await expect(page.getByTestId("copy-replay-link")).toBeVisible();
  const replayUrl = `/?debug=1&${REPLAY_QUERY_KEY}=${encodeReplaySeed({
    currentCase: before.currentCase,
    nodeId: before.nodeId,
    resources: before.resources,
    log: before.log,
  })}`;

  // Someone else's browser: its own storage, with nothing in it. This used to
  // be a second page of the same context, which shares storage with the first
  // -- and a replay never writes the save, so what the test read back as the
  // replay's state was the save of the run that made the link. A link that
  // decoded to nothing still opened that run and passed.
  const viewer = await browser.newContext({ baseURL });
  const strays = await guardNetwork(viewer);
  try {
    const fresh = await viewer.newPage();
    await fresh.goto(replayUrl);
    await expect(fresh.locator(".game-shell")).toBeVisible();

    // What is on screen is the scene the link names, with the resources it carries.
    await expect(fresh.locator(".game-header h1")).toHaveText(nodes[before.nodeId].title);
    const overlay = fresh.getByTestId("debug-overlay");
    await expect(overlay).toContainText(`${before.currentCase} / ${before.nodeId}`);
    for (const [key, value] of Object.entries(before.resources)) {
      await expect(overlay).toContainText(`${key}:${value}`);
    }

    // And opening it saved nothing: the viewer has no run of their own now.
    const stored = await fresh.evaluate(() => ({
      save: localStorage.getItem("trigger-prototype-v2"),
      slots: localStorage.getItem("trigger-prototype-save-slots-v1"),
    }));
    expect(stored).toEqual({ save: null, slots: null });
    expectNoStrayRequests(strays);
  } finally {
    await viewer.close();
  }
});

test("a replay link that decodes to nothing opens no scene", async ({ browser, baseURL }) => {
  const viewer = await browser.newContext({ baseURL });
  await guardNetwork(viewer);
  try {
    const fresh = await viewer.newPage();
    await fresh.goto(`/?${REPLAY_QUERY_KEY}=not-a-seed`);
    await expect(fresh.locator(".intro")).toBeVisible();
    await expect(fresh.locator(".game-shell")).toHaveCount(0);
    expect(await fresh.evaluate(() => localStorage.getItem("trigger-prototype-v2"))).toBeNull();
  } finally {
    await viewer.close();
  }
});
