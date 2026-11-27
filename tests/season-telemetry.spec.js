// The telemetry queue: retries after a failed response or a failed storage
// commit, consent opt-out, and a late failure against newer progress. Split
// from season-flow.spec.js.
// @once, here and below: the test runs in the desktop project only
// (playwright.config.js, the phone project's grepInvert). The tag is for a
// test that reads a save, a request or what the page says, and presses nothing
// that an untagged test does not press on the phone on the same screen. A test
// that is the only one to press a control stays in both projects.
import { expect, test } from "./helpers/network.js";
import { bustStakedCard, cashStakedCard, clickElement, completeCurrentCase, dismissProtocolBreach, openIntroDrawer, TRANSITION_TIMEOUT_MS } from "./helpers/gameFlow.js";
import { FIRST_HOUR_KEY } from "../src/appConfig.js";
import { FIRST_HOUR_FIELDS } from "../src/firstHourLog.js";
import { startDebugNode } from "./helpers/seasonFlow.js";
import { collectPostedRows, jsonbBytes, SERVER_DYNAMICS_BYTES } from "./helpers/caseRows.js";
import { recheckCaseGap, recheckCaseLinks } from "../src/chainRecheck.js";
import { verifyRows } from "../scripts/verify-ranking-rows.mjs";

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

// F1 phase 3, S7: the season's last two case rows as the server's chain check
// reads them. Each carries its opening snapshot (`dynamics.open`, S3) and what
// its close hands on (`linksOut`, the draft, the practice count); the finale,
// opened from the case before's report, opens on what that case closed on.
// The ranking row is the one it always was: the server copies its scores from
// the finale's row, and it carries no `dynamics`.
test("a season's case rows carry their opening snapshot and what they hand on, and the ranking row is as it was", { tag: "@once" }, async ({ page }) => {
  test.setTimeout(120_000);
  const posted = await collectPostedRows(page, "https://e2e.supabase.co");
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
  });
  await page.goto("/?debug=1");
  await startDebugNode(page, "case49", "c49_aftershock");
  await completeCurrentCase(page);
  await page.getByRole("button", { name: /마지막 사건 시작/ }).click();
  await completeCurrentCase(page);
  await expect(page.locator(".ending-sequence")).toBeVisible();
  await expect.poll(() => posted.map((row) => row.case_id), { timeout: 20_000 }).toEqual(expect.arrayContaining(["case49", "final", "season-final"]));

  const [before, finale] = ["case49", "final"].map((caseId) => posted.find((row) => row.case_id === caseId));
  for (const row of [before, finale]) {
    expect(row.dynamics.open?.caseId, `${row.case_id} carries its opening snapshot`).toBe(row.case_id);
    expect(Array.isArray(row.dynamics.linksOut), `${row.case_id} carries its links out`).toBe(true);
    expect(Array.isArray(row.dynamics.relicOffer)).toBe(true);
    expect(typeof row.dynamics.practiceWindows).toBe("number");
    expect(jsonbBytes(row.dynamics), `${row.case_id}'s dynamics as jsonb text`).toBeLessThanOrEqual(SERVER_DYNAMICS_BYTES);
    expect(recheckCaseLinks(row), `${row.case_id}'s decisions chain from its opening hand`).toMatchObject({ status: "linked", breaks: [] });
  }
  // The finale opened from case49's report: its opening is that close.
  expect(recheckCaseGap(before, finale), "the finale opens on what case49 closed on").toMatchObject({ status: "linked", breaks: [] });
  expect(finale.dynamics.open.vault).toBe(before.dynamics.vault);
  expect(finale.dynamics.open.linksIn).toEqual(before.dynamics.linksOut);

  const season = posted.find((row) => row.case_id === "season-final");
  expect(Object.keys(season), "the ranking row carries no dynamics").not.toContain("dynamics");
  expect(season.summary.seasonComplete).toBe(true);

  // The rows as the page wrote them, through the server check's own reader
  // (verify-ranking-rows): every window replayed from its record and its seed
  // read at its place in the run (S1, the page's `run_id:windowIndex:nodeId`),
  // the scores worked out again, the two cases chained. The rows before case49
  // were never played here, so the run's start is not read (a gap), not passed.
  const [result] = verifyRows(posted);
  const windows = before.decision_log.length + finale.decision_log.length;
  expect(result.status, "every window carries its replay record").toBe("checked");
  expect(result.marks).toEqual([]);
  expect(result.cases.reduce((sum, entry) => sum + entry.windows.counts.match, 0), "each window replays to what the log says").toBe(windows);
  expect(result.cases.every((entry) => entry.windows.findings.length === 0), "no window's seed is off its place").toBe(true);
  expect(result.chain).toMatchObject({ status: "linked", breaks: [] });
});

// N22 (2026-11-16): once a season, the sheet between two hands of 프롤로그 01·02
// asks 「여기까지 어땠나요?」; one press sends one playtest_feedback row with a
// word of three, and the question does not come back.
test("the between-hands question is asked once in 프롤로그 01 and sends one feedback row", async ({ page }) => {
  test.setTimeout(90_000);
  const feedbackRows = [];
  await page.route("https://e2e.supabase.co/**", async (route) => {
    const request = route.request();
    if (request.method() === "POST" && request.url().includes("/playtest_feedback")) feedbackRows.push(request.postDataJSON());
    await route.fulfill({ status: 201, contentType: "application/json", body: "{}" });
  });
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
    localStorage.setItem("critical-point-telemetry-key", "anon");
  });
  await page.goto("/?debug=1");
  await startDebugNode(page, "prologue01", "p1_start");
  const pulse = page.getByTestId("between-hands-pulse");
  const decisionNext = page.getByTestId("decision-next");
  /** Stakes the first open card, cashes it, and stops on the sheet. */
  const settleOneHand = async () => {
    await dismissProtocolBreach(page);
    await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
    await cashStakedCard(page);
    await expect(decisionNext).toBeVisible({ timeout: 15_000 });
  };
  await settleOneHand();
  await expect(pulse, "not on the season's first sheet").toHaveCount(0);
  await decisionNext.click();
  await settleOneHand();
  await expect(pulse).toBeVisible();
  await expect(pulse.getByRole("button")).toHaveText(["재밌음", "어려움", "길다"]);
  await expect(decisionNext, "the way on keeps the focus").toBeFocused();
  await pulse.getByTestId("pulse-hard").click();
  await expect(pulse).toContainText("고맙습니다");
  await expect.poll(() => feedbackRows.length).toBe(1);
  const [row] = [feedbackRows[0]].flat();
  expect(row).toMatchObject({ case_id: "prologue01", feedback: { kind: "between-hands", answer: "hard", comment: null } });
  expect(Object.keys(row.feedback).sort()).toEqual(["answer", "clarity", "comment", "difficulty", "kind", "sceneNo", "submittedAt"]);
  await decisionNext.click();
  await settleOneHand();
  await expect(pulse, "once a season").toHaveCount(0);
});

// 첫 30분 자동 기록 (2026-11-27): a device with none of the game's data is a
// first visit. After its first BUST the verdict sheet asks 「무엇을 잃었나요?」,
// and 프롤로그 01's report asks 0 to 10; each is a tap, each once, neither
// takes the focus from the way on, and the record goes to its own RPC with
// only the listed fields -- no session id, no address.
test.describe("a first visit", () => {
  test.use({ coldOpeningSeen: false });

  test("is asked what it lost after its first BUST and whether it will come back on 프롤로그 01's report", async ({ page }) => {
    test.setTimeout(150_000);
    const records = [];
    await page.route("https://e2e.supabase.co/**", async (route) => {
      const request = route.request();
      if (request.method() === "POST" && request.url().endsWith("/rpc/first_hour_record")) records.push(request.postDataJSON());
      await route.fulfill({ status: 201, contentType: "application/json", body: "{}" });
    });
    await page.addInitScript(() => {
      localStorage.setItem("critical-point-telemetry-url", "https://e2e.supabase.co");
      localStorage.setItem("critical-point-telemetry-key", "anon");
    });
    await page.goto("/");
    await clickElement(page.getByTestId("start-first-case"), "start first case");
    const skip = page.getByTestId("cold-opening-skip");
    await expect(skip.or(page.locator(".game-shell")).first()).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    if (await skip.isVisible()) await skip.click();
    await expect(page.locator(".game-shell")).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await dismissProtocolBreach(page);
    await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
    await bustStakedCard(page);

    const lost = page.getByTestId("first-hour-lost");
    const decisionNext = page.getByTestId("decision-next");
    await expect(lost).toBeVisible();
    await expect(lost.getByRole("button")).toHaveText(["판돈", "다음 장면", "모르겠다", "건너뛰기"]);
    await expect(decisionNext, "the way on keeps the focus").toBeFocused();
    await lost.getByTestId("first-hour-lost-stake").click();
    await expect(lost.getByRole("status")).toBeFocused();
    await expect.poll(() => records.at(-1)?.p_record?.lost).toBe("stake");
    const sent = records.at(-1);
    expect(Object.keys(sent).sort()).toEqual(["p_id", "p_record"]);
    expect(Object.keys(sent.p_record).filter((key) => !FIRST_HOUR_FIELDS.includes(key))).toEqual([]);
    expect(sent.p_record).toMatchObject({ first: true, btn: "prologue", t1: expect.any(String), bustNode: expect.any(String) });
    expect(sent.p_record.t1Push).toBeGreaterThan(0);
    expect(JSON.stringify(sent)).not.toMatch(/session/i);

    await decisionNext.click();
    await completeCurrentCase(page);
    const again = page.getByTestId("first-hour-again");
    await expect(again).toBeVisible({ timeout: TRANSITION_TIMEOUT_MS });
    await expect(again.getByRole("button")).toHaveCount(12);
    await again.getByTestId("first-hour-again-7").click();
    await expect.poll(() => records.at(-1)?.p_record?.again).toBe(7);
    expect(records.every((record) => record.p_id === sent.p_id), "one record, sent whole each time").toBe(true);
    const kept = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), FIRST_HOUR_KEY);
    expect([kept.lost, kept.again]).toEqual(["stake", 7]);
    await expect(page.getByTestId("first-hour-lost")).toHaveCount(0);
  });
});
