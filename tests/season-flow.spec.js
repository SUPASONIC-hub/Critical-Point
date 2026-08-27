import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { nodes } from "../src/gameData.js";

async function chooseFirstFixedChoice(page) {
  await page.waitForFunction(
    () => Boolean(document.querySelector(".result-page") || document.querySelector(".choices .choice")),
    undefined,
    { timeout: 15_000 },
  );
  if (await page.locator(".result-page").isVisible().catch(() => false)) return;
  const firstChoice = page.locator(".choices .choice").first();
  await firstChoice.evaluate((button) => button.click());
  const commitButton = page.getByRole("button", { name: /이 선택을 기록한다/ });
  if (await commitButton.isVisible().catch(() => false)) {
    await commitButton.evaluate((button) => button.click());
  }
  await page.waitForFunction(
    () => Boolean(document.querySelector("[data-testid='decision-next']") || document.querySelector(".choices .choice") || document.querySelector(".result-page")),
    undefined,
    { timeout: 15_000 },
  );
  await page.evaluate(() => document.querySelector("[data-testid='decision-next']")?.click());
}

async function completeCurrentCase(page) {
  for (let step = 0; step < 24; step += 1) {
    if (await page.locator(".result-page").isVisible().catch(() => false)) return;
    await chooseFirstFixedChoice(page);
  }
  throw new Error("Case did not reach result page");
}

async function startDebugNode(page, caseId, nodeId) {
  await page.getByTestId("debug-case-select").selectOption(caseId);
  await page.getByTestId("debug-node-select").selectOption(nodeId);
  await page.getByTestId("debug-start-node").click();
}

test("case 05 browser flow can unlock and open the final case", async ({ page }) => {
  const dialogMessages = [];
  page.on("dialog", (dialog) => {
    dialogMessages.push(dialog.message());
    dialog.accept();
  });
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_aftershock");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  const playDownloadPromise = page.waitForEvent("download");
  await page.getByTestId("export-play-log").click();
  const playDownload = await playDownloadPromise;
  const playPayload = JSON.parse(await readFile(await playDownload.path(), "utf8"));
  expect(playPayload.exportMode).toBe("summary");
  expect(playPayload.playerName).toBeUndefined();
  expect(playPayload.playtestFeedback).toBeUndefined();
  expect(playPayload.log).toBeUndefined();
  expect(playPayload.sessionId).toBeUndefined();
  expect(playPayload.pendingTelemetry).toBeUndefined();
  expect(playPayload.errorLog).toBeUndefined();
  expect(playPayload.saveSlots).toBeUndefined();
  const diagnosticDownloadPromise = page.waitForEvent("download");
  await page.getByTestId("export-diagnostic-log").click();
  expect(dialogMessages.at(-1)).toContain("피드백 원문");
  const diagnosticDownload = await diagnosticDownloadPromise;
  const diagnosticPayload = JSON.parse(await readFile(await diagnosticDownload.path(), "utf8"));
  expect(diagnosticPayload.exportMode).toBe("diagnostic");
  expect(diagnosticPayload.log).toBeDefined();
  expect(diagnosticPayload.sessionId).toBeDefined();
  expect(Array.isArray(diagnosticPayload.pendingTelemetry)).toBe(true);
  expect(Array.isArray(diagnosticPayload.errorLog)).toBe(true);
  expect(Array.isArray(diagnosticPayload.saveSlots)).toBe(true);
  await page.getByRole("button", { name: /마지막 사건 시작/ }).click();
  await expect(page.getByRole("heading", { name: /책임을 맡은 사람의 실험|고쳐진 구조의 실험|이름을 남긴 뒤|TRIGGER LAB/ })).toBeVisible();
});

test("case flow has no unhandled browser runtime errors", async ({ page }) => {
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await chooseFirstFixedChoice(page);
  await expect(page.getByRole("heading", { name: /말할 수 있는 조건|선의의 실패|책임의 모양/ })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("the complete season can progress from case 01 to the final ending", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto("/?debug=1");
  await page.getByTestId("unlock-all-cases").click();
  await startDebugNode(page, "case01", "start");

  for (let caseIndex = 0; caseIndex < 6; caseIndex += 1) {
    await completeCurrentCase(page);
    if (caseIndex < 5) {
      const nextCaseButton = page.locator(".next-case-panel button");
      await expect(nextCaseButton).toBeVisible();
      await nextCaseButton.evaluate((button) => button.click());
      await expect(page.locator(".game-shell")).toBeVisible();
    }
  }

  await expect(page.locator(".ending-reveal")).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.currentCase).toBe("final");
  expect(saved.completedCases).toContain("final");
});

test("representative branch choices advance without browser runtime errors", async ({ page }) => {
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  await page.addInitScript(() => localStorage.clear());

  const samples = [
    { caseId: "case01", nodeId: "accounting", choiceIndex: 3 },
    { caseId: "case02", nodeId: "c2_trace", choiceIndex: 1 },
    { caseId: "case03", nodeId: "c3_signal", choiceIndex: 2 },
    { caseId: "case04", nodeId: "c4_aftershock", choiceIndex: 0 },
    { caseId: "case05", nodeId: "c5_voice", choiceIndex: 0 },
    { caseId: "final", nodeId: "f_aftershock", choiceIndex: 2 },
  ];

  for (const { caseId, nodeId, choiceIndex } of samples) {
    const scene = nodes[nodeId];
    const choice = scene.choices[choiceIndex];
    await page.goto("/?debug=1");
    await startDebugNode(page, caseId, nodeId);
    await expect(page.locator(".game-shell")).toBeVisible();

    if (choice.type === "free") {
      await page.locator(".reframe-box textarea").fill("직원과 협력사 조건을 분리하고, 원본 자료를 확인한 뒤 위험을 공개한다.");
      await page.locator(".submit-reframe").evaluate((button) => button.click());
    } else {
      const fixedChoiceIndex = scene.choices
        .slice(0, choiceIndex + 1)
        .filter((candidate) => candidate.type !== "free").length - 1;
      await page.locator(".choices .choice").nth(fixedChoiceIndex).evaluate((button) => button.click());
      await expect(page.locator(".decision-dock")).toBeVisible();
      await page.getByTestId("commit-confirm").evaluate((button) => button.click());
    }

    await expect(page.getByTestId("decision-next")).toBeVisible();
    await page.getByTestId("decision-next").evaluate((button) => button.click());
    await expect(page.locator(".game-shell, .result-page, .ending-reveal").first()).toBeVisible();
  }

  expect(runtimeErrors).toEqual([]);
});

test("debug jump opens case 05 scenes directly", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");

  await expect(page.getByRole("heading", { name: "이름 없는 증언" })).toBeVisible();
  await chooseFirstFixedChoice(page);
  await expect(page.getByRole("heading", { name: /말할 수 있는 조건|선의의 실패|책임의 모양/ })).toBeVisible();
});

test("mobile decision actions stay reachable without manual page scrolling", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.locator(".choices .choice").first().click();

  const commitButton = page.getByTestId("commit-confirm");
  await expect(commitButton).toBeVisible();
  const commitBox = await commitButton.boundingBox();
  const viewport = page.viewportSize();
  expect(commitBox).not.toBeNull();
  expect(commitBox.y + commitBox.height).toBeLessThanOrEqual(viewport.height + 2);

  await commitButton.click();
  const nextButton = page.getByTestId("decision-next");
  await expect(nextButton).toBeVisible();
  const nextBox = await nextButton.boundingBox();
  expect(nextBox).not.toBeNull();
  expect(nextBox.y + nextBox.height).toBeLessThanOrEqual(viewport.height + 2);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

test("landscape mobile keeps decision actions within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.locator(".choices .choice").first().click();
  const commitButton = page.getByTestId("commit-confirm");
  await expect(commitButton).toBeVisible();
  const commitBox = await commitButton.boundingBox();
  expect(commitBox).not.toBeNull();
  expect(commitBox.y + commitBox.height).toBeLessThanOrEqual(375 + 2);
  await commitButton.evaluate((button) => button.click());
  const nextButton = page.getByTestId("decision-next");
  await expect(nextButton).toBeVisible();
  const nextBox = await nextButton.boundingBox();
  expect(nextBox).not.toBeNull();
  expect(nextBox.y + nextBox.height).toBeLessThanOrEqual(375 + 2);
});

test("leaving an active scene marks the saved run as paused", async ({ page }) => {
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

test("bfcache return resumes an active scene without losing its route", async ({ page }) => {
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
  await page.getByRole("button", { name: /첫 케이스 시작/ }).click();
  await expect(page.locator(".recovery-notice")).toHaveCount(0);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.lastError).toBeNull();
  expect(saved.currentCase).toBe("case01");
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
  const repaired = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(repaired.currentCase).toBe("case05");
  expect(repaired.nodeId).toBe("c5_start");
  expect(repaired.lastError.source).toBe("save-integrity");
  await page.getByTestId("resume-save").click();
  await expect(page.getByRole("heading", { name: "NO ONE TO BLAME" })).toBeVisible();
});

test("corrupt saved nested gameplay data is repaired before render", async ({ page }) => {
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

test("corrupt error log entries are filtered before the diagnostics panel renders", async ({ page }) => {
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

test("restoring a corrupt recovery slot repairs nested data before resume", async ({ page }) => {
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
  await page.locator(".start-input-row button").click();
  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.locator(".choices .choice").first()).toBeVisible();
});

test("recovery slot can be restored and deleted from debug panel", async ({ page }) => {
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
  expect(restored.freeText).toBe("");
  expect(restored.resources).toEqual({ time: 72, capital: 100, trust: 50, legitimacy: 50, humanCost: 0, fatigue: 10 });
  expect(Object.values(restored.triggers).every((value) => value === 0)).toBe(true);
  expect(Object.values(restored.cognition).every((value) => value === 0)).toBe(true);
  await page.getByTestId("resume-save").click();
  await expect(page.locator(".choices .choice").first()).toBeVisible();
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".choices .choice").first()).toBeVisible();
});

test("recovery slot delete failure keeps the slot visible", async ({ page }) => {
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

test("recovery slot restore repairs invalid saved route before writing", async ({ page }) => {
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
  page.on("dialog", (dialog) => dialog.accept());
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
  page.on("dialog", (dialog) => dialog.accept());
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

test("repeated render errors block the retry loop and preserve recovery choices", async ({ page }) => {
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
  await page.getByRole("button", { name: "현재 저장본만 초기화" }).click();
  await expect(page.locator(".intro")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("trigger-prototype-v2"))).toBeNull();
});

test("error boundary clear save failure does not reload", async ({ page }) => {
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
  await page.getByRole("button", { name: "현재 저장본만 초기화" }).click();
  await expect(page.getByText("현재 저장본을 삭제하지 못했습니다. 브라우저 저장소 권한을 확인한 뒤 다시 시도하세요.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "장면을 불러오지 못했습니다." })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("trigger-prototype-v2"))).not.toBeNull();
});

test("pending telemetry retries after a failed Supabase response", async ({ page }) => {
  let requestCount = 0;
  await page.route("https://e2e.supabase.co/**", async (route) => {
    requestCount += 1;
    await route.fulfill({
      status: requestCount === 1 ? 500 : 201,
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
});

test("telemetry retry keeps the queue when storage commit fails", async ({ page }) => {
  await page.route("https://e2e.supabase.co/**", async (route) => {
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
  const pendingLength = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")).pendingTelemetry.length);
  expect(pendingLength).toBe(1);
});

test("consent opt-out failure keeps consent and pending telemetry intact", async ({ page }) => {
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
  const consentCheckbox = page.locator(".consent-box input");
  await expect(consentCheckbox).toBeChecked();
  await consentCheckbox.click({ force: true });
  await expect(consentCheckbox).toBeChecked();
  await expect(page.getByText(/동의 해제 내용을 브라우저 저장본에 반영하지 못했습니다/)).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("trigger-prototype-v2")));
  expect(saved.dataConsent).toBe(true);
  expect(saved.pendingTelemetry.length).toBe(1);
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
  await page.locator(".consent-box input").check({ force: true });
  await startDebugNode(page, "case05", "c5_aftershock");
  await completeCurrentCase(page);
  await playtestRequestSeenPromise;
  await page.getByRole("button", { name: /마지막 사건 시작/ }).click();
  await expect(page.getByRole("heading", { name: /책임을 맡은 사람의 실험|고쳐진 구조의 실험|이름을 남긴 뒤|TRIGGER LAB/ })).toBeVisible();

  const savedBeforeFailureCallback = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
    return {
      currentCase: saved.currentCase,
      nodeId: saved.nodeId,
      logLength: saved.log.length,
    };
  });
  releaseTelemetryFailure();
  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const saved = JSON.parse(localStorage.getItem("trigger-prototype-v2"));
          return {
            currentCase: saved.currentCase,
            nodeId: saved.nodeId,
            logLength: saved.log.length,
          };
        }),
      { timeout: 10_000 },
    )
    .toEqual(savedBeforeFailureCallback);
  expect(savedBeforeFailureCallback.currentCase).toBe("final");
});
