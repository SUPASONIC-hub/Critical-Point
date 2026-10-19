import AxeBuilder from "@axe-core/playwright";
import { BACKEND_ORIGIN, expect, test } from "./helpers/network.js";
import { ACCESSIBILITY_SETTINGS_KEY } from "../src/appConfig.js";
import { cashStakedCard, completeCurrentCase, dismissProtocolBreach, startDebugNode, waitForEntrance } from "./helpers/gameFlow.js";
import { TEST_STORAGE_KEYS } from "./helpers/storage.js";

async function expectNoA11yViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

test("intro screen has no structural accessibility violations", { tag: "@prod" }, async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await expectNoA11yViolations(page);
});

// The intro's audit above is of closed drawers, and axe does not read what a
// closed <details> holds. These two are opened: the play-style drawer, whose
// note points to story mode, and the comfort panel with the switch itself,
// off and then on.
test("the play-style drawer and the comfort panel, open, have no structural accessibility violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  for (const selector of [".play-style-panel", ".accessibility-panel"]) {
    await page.locator(`details.intro-drawer:has(${selector})`).evaluate((drawer) => {
      drawer.open = true;
    });
  }
  const pledges = page.getByRole("region", { name: "플레이 스타일 선택" });
  const toggle = page.getByRole("region", { name: "편의 설정" }).getByLabel(/스토리 모드/);
  await expect(pledges.getByRole("button")).toHaveCount(3);
  await expect(toggle).toBeVisible();
  await expect(toggle).not.toBeChecked();
  await expectNoA11yViolations(page);

  await toggle.check();
  await expect(toggle).toBeChecked();
  // The checked box's own transition has to land before its colours are read.
  await waitForEntrance(page.locator(".accessibility-panel"));
  await expectNoA11yViolations(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("case 05 scene has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await expect(page.getByRole("heading", { name: "이름 없는 증언" })).toBeVisible();
  await expectNoA11yViolations(page);
});

/**
 * The four dialogs the table opens. Every scene test above audits the table
 * after `startDebugNode` has closed the briefing page, and none ever stopped on
 * the reveal, the draft or the question a second tab is asked -- so the
 * surfaces a player is held on until they answer were the ones never read
 * (the 2026-10-07 audit, B4 finding 3).
 */
test("the briefing page has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice", { openTable: false });
  const briefing = page.getByTestId("scene-briefing");
  await expect(briefing.getByRole("dialog")).toBeVisible();
  // The page fades in and its panels pop one after another for about a second.
  // Read before they land, the contrast rule measures text half faded into
  // the paper and fails a page that passes once it has arrived.
  await waitForEntrance(briefing);
  await expectNoA11yViolations(page);
});

test("the decision reveal has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await cashStakedCard(page);
  await expect(page.getByTestId("decision-next")).toBeVisible();
  await expect(page.locator(".decision-reveal-backdrop").getByRole("dialog")).toBeVisible();
  // The backdrop fades in and the window rises; the same race as the briefing.
  await waitForEntrance(page.locator(".decision-reveal-backdrop"));
  await expectNoA11yViolations(page);
});

/**
 * A bust is said once. The slam over the table is an alert -- BUST, where the
 * wall was, what the pot came to -- and 1.35 seconds later the reveal opens
 * and takes focus. The reveal was a dialog named by its own headline, so a
 * screen reader said BUST a second time as focus arrived; it is named 판정 결과
 * now, and the headline is the sheet's heading.
 *
 * The slam is gone from the page at about the moment the reveal opens, so the
 * alerts are counted from before the card is pushed rather than looked for at
 * one instant: every element that was ever an alert saying BUST, and the most
 * there were at once.
 */
async function watchVerdictAlerts(page) {
  await page.evaluate(() => {
    const seen = new Set();
    const record = { ever: 0, most: 0 };
    window.__bustAlerts = record;
    const scan = () => {
      const now = [...document.querySelectorAll("[role='alert']")].filter((element) => element.textContent.includes("BUST"));
      for (const element of now) seen.add(element);
      record.ever = seen.size;
      record.most = Math.max(record.most, now.length);
    };
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["role"] });
    scan();
  });
}

const VERDICT_DIALOG = "판정 결과";

test("a bust is announced once, by the slam: the reveal is named 판정 결과 and its headline still reads BUST", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/?debug=1");
  await startDebugNode(page, "case01", "start");
  // The debug overlay is harness chrome; on a phone it sits over the action bar.
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await page.locator(".choices .choice").first().click();
  await expect(page.locator(".gx-card.selected")).toHaveCount(1);
  await watchVerdictAlerts(page);
  expect(await page.evaluate(() => window.__bustAlerts.ever), "nothing has said BUST before the wall").toBe(0);

  // Into the wall. The loop stops on the verdict, which stays up until it is
  // dismissed; the stage's own "bust" is gone once the next window is dealt.
  const stage = page.getByTestId("gauntlet-stage");
  const headline = page.locator(".decision-reveal h2");
  for (let press = 0; press < 30; press += 1) {
    if ((await headline.isVisible()) || (await stage.getAttribute("data-status")) !== "live") break;
    await page
      .getByTestId("commit-push")
      .click({ timeout: 1_000 })
      .catch(() => {});
  }
  await expect(headline).toHaveText("BUST", { timeout: 30_000 });
  await expect(page.getByTestId("decision-next")).toBeFocused();

  // One alert said BUST, and it was the slam: never two at once, never a second one.
  const alerts = await page.evaluate(() => ({ ...window.__bustAlerts }));
  expect(alerts.ever, "elements that were an alert saying BUST, from the push to the open reveal").toBe(1);
  expect(alerts.most, "alerts saying BUST at one time").toBe(1);
  expect(await page.getByRole("alert").filter({ hasText: "BUST" }).count(), "alerts saying BUST with the reveal open").toBeLessThanOrEqual(1);

  // The dialog focus arrived in is named for what it is, not for the verdict.
  const dialog = page.getByRole("dialog", { name: VERDICT_DIALOG, exact: true });
  await expect(dialog).toHaveCount(1);
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName(VERDICT_DIALOG);
  await expect(page.getByRole("dialog", { name: /BUST/ })).toHaveCount(0);
  await expect(dialog).not.toHaveAttribute("aria-labelledby", /.*/);
  // It is no alert itself and holds none: the verdict in it is read by walking the sheet.
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await expect(dialog.locator("[aria-live]")).toHaveCount(0);
  // The headline is still there to be seen, as the sheet's heading.
  const heading = dialog.getByRole("heading", { level: 2 });
  await expect(heading).toHaveCount(1);
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("BUST");
});

test("a cash's reveal has the same name, and its headline is the multiplier", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case01", "start");
  await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await watchVerdictAlerts(page);
  await cashStakedCard(page);
  await expect(page.getByTestId("decision-next")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId("decision-next")).toBeFocused();

  const dialog = page.getByRole("dialog", { name: VERDICT_DIALOG, exact: true });
  await expect(dialog).toHaveCount(1);
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName(VERDICT_DIALOG);
  const heading = dialog.getByRole("heading", { level: 2 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText(/^×\d+(\.\d+)?$/);
  // The multiplier is the slam's to say, as BUST is: the dialog is not named by it.
  await expect(page.getByRole("dialog", { name: /×/ })).toHaveCount(0);
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  expect(await page.evaluate(() => window.__bustAlerts.ever), "a cash says BUST nowhere").toBe(0);
});

/**
 * The box a finger can press each visible control under `root` in, for every
 * one under `min` px either way -- or under its own minimum, for a control one
 * of `exceptions` names by selector. Runs in the page.
 *
 * Several controls are pressed over more than they draw: a positioned ::before
 * or ::after reaches into the gap around them (the briefing's cards, the
 * stances, the header's buttons; layout-css.test.mjs holds the rules). The box
 * is the control's own layout box joined with any such pseudo-element that
 * takes the pointer. Layout boxes, not getBoundingClientRect: the briefing's
 * cards breathe and the table shakes, and a transform moves no hit area the
 * player can count on. offsetWidth rounds to the pixel, which is the tolerance.
 */
function narrowTargets(root, { min, exceptions }) {
  const px = (value) => (value === "" || value === "auto" ? null : Number.parseFloat(value));
  const span = (start, end, size, inner) => {
    if (start !== null && end !== null) return [start, inner - end];
    if (start !== null && size !== null) return [start, start + size];
    if (end !== null && size !== null) return [inner - end - size, inner - end];
    return null;
  };
  const pressBox = (element) => {
    const own = getComputedStyle(element);
    const box = { left: 0, top: 0, right: element.offsetWidth, bottom: element.offsetHeight };
    // A pseudo-element is placed against the control only when the control is positioned.
    if (own.position === "static") return box;
    const [bl, bt, br, bb] = [own.borderLeftWidth, own.borderTopWidth, own.borderRightWidth, own.borderBottomWidth].map(Number.parseFloat);
    for (const pseudo of ["::before", "::after"]) {
      const style = getComputedStyle(element, pseudo);
      if (["none", "normal"].includes(style.content) || style.display === "none" || style.position !== "absolute" || style.pointerEvents === "none") continue;
      const x = span(px(style.left), px(style.right), px(style.width), element.offsetWidth - bl - br);
      const y = span(px(style.top), px(style.bottom), px(style.height), element.offsetHeight - bt - bb);
      if (!x || !y) continue;
      box.left = Math.min(box.left, x[0] + bl);
      box.right = Math.max(box.right, x[1] + bl);
      box.top = Math.min(box.top, y[0] + bt);
      box.bottom = Math.max(box.bottom, y[1] + bt);
    }
    return box;
  };
  const CONTROLS = "button, a[href], summary, input:not([type='hidden']), select, textarea, [role='button'], [role='switch'], [role='tab'], [tabindex]:not([tabindex='-1'])";
  return [...root.querySelectorAll(CONTROLS)]
    .filter((element) => !element.closest(".debug-overlay, .sr-only") && element.offsetWidth > 0 && element.checkVisibility({ visibilityProperty: true }))
    .map((element) => {
      const box = pressBox(element);
      const name = element.getAttribute("aria-label") || element.textContent.trim().replace(/\s+/g, " ").slice(0, 24) || element.className;
      const floor = exceptions.find((exception) => element.matches(exception.selector)) ?? { width: min, height: min };
      return { name, width: Math.round(box.right - box.left), height: Math.round(box.bottom - box.top), floor };
    })
    .filter((target) => target.width < target.floor.width || target.height < target.floor.height)
    .map((target) => `${target.name}: ${target.width}x${target.height}`);
}

/**
 * The controls held to less than 44x44, each by name and with the reason.
 * WCAG 2.5.8's spacing exception is the rule they are held to instead: a
 * target under 24px either way fails, and one that is 24 or more passes when
 * the areas of its neighbours do not overlap it. Every one here is still
 * pressed over 44px the other way.
 */
const TOUCH_TARGET_EXCEPTIONS = [
  {
    // The header's four tools on a phone: 저장, 저장 후 나가기, 편의 설정 and
    // 초기화. They are drawn 28x28 so the header keeps its one row beside the
    // music controls and the case stamp, and each is pressed over 44px tall
    // and as wide as the 3px gap to its neighbour lets it be without
    // overlapping (play.css): 29px, and 34 for 초기화, which stands 9px apart
    // because it throws the run away and asks first. Four 44px areas would
    // not fit the 240px a 360px row has left of the music controls.
    selector: ".gauntlet-shell .top-actions.compact-actions button",
    width: 24,
    height: 44,
  },
];

/** Polled, so a surface still settling is read again rather than failed on one frame. */
async function expectTouchTargets(root, where) {
  await expect
    .poll(() => root.evaluate(narrowTargets, { min: 44, exceptions: TOUCH_TARGET_EXCEPTIONS }), {
      message: `${where}: controls a finger presses over less than 44x44px (or their named exception's minimum)`,
    })
    .toEqual([]);
}

/**
 * Every control on the three surfaces a phone player presses most -- the
 * briefing page, the live table and the decision reveal -- takes a press over
 * at least 44x44 CSS px (WCAG 2.5.5), on a small Android phone and on what
 * Safari leaves of an iPhone 14. The fixes so far were held by reading the
 * sheets (layout-css.test.mjs); this is the screen they were for. The reading
 * clock is held so the briefing does not open the table while it is measured.
 */
for (const size of [{ width: 360, height: 740 }, { width: 390, height: 664 }]) {
  test(`the briefing, the table and the reveal are pressed over 44x44px at ${size.width}x${size.height}`, async ({ page }) => {
    const where = `${size.width}x${size.height}`;
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: ACCESSIBILITY_SETTINGS_KEY, value: JSON.stringify({ holdReadingClock: true }) },
    );
    await page.setViewportSize(size);
    await page.goto("/?debug=1");
    await startDebugNode(page, "case01", "start", { openTable: false });
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });

    const briefing = page.getByTestId("scene-briefing");
    await expect(briefing.getByRole("dialog")).toBeVisible();
    await expect(page.getByTestId("reading-timer")).toHaveAttribute("aria-pressed", "true");
    await waitForEntrance(briefing);
    await expectTouchTargets(briefing, `the briefing @ ${where}`);

    await dismissProtocolBreach(page);
    await expect(page.getByTestId("gauntlet-stage")).toHaveAttribute("data-status", "live");
    // 사건 01 has the whole table, so the stances are on it.
    await expect(page.getByTestId("gauntlet-stance-mastery")).toBeVisible();
    await waitForEntrance(page.locator(".game-shell"));
    await expectTouchTargets(page.locator("body"), `the table @ ${where}`);

    await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
    await cashStakedCard(page);
    const reveal = page.locator(".decision-reveal-backdrop");
    await expect(reveal.getByTestId("decision-next")).toBeVisible();
    await waitForEntrance(reveal);
    await expectTouchTargets(reveal, `the reveal @ ${where}`);
  });
}

/**
 * The two surfaces a case ends on, at the same two sizes: the report, with
 * its archive folded as it opens, and the tool draft dealt in front of the
 * next case. Read from the sheets before this test, the report's tool dock
 * and its second 이 사건 다시 도전 were drawn 38px tall on a phone and the
 * music pill 38x36; each is pressed over 44 now (result.css,
 * base-intro-ranking.css). The draft's cards, its skip and its folded feats
 * were already held (layout-css.test.mjs).
 */
for (const size of [{ width: 360, height: 740 }, { width: 390, height: 664 }]) {
  test(`the case report and the tool draft are pressed over 44x44px at ${size.width}x${size.height}`, async ({ page }) => {
    const where = `${size.width}x${size.height}`;
    await page.setViewportSize(size);
    await page.goto("/?debug=1");
    await startDebugNode(page, "case01", "c1_aftershock");
    await page.addStyleTag({ content: ".debug-overlay { display: none !important; }" });
    await completeCurrentCase(page);
    const decisionNext = page.getByTestId("decision-next");
    if (await decisionNext.isVisible()) await decisionNext.click();

    const report = page.locator(".result-page");
    await expect(report).toBeVisible();
    await expect(page.locator(".next-case-panel button")).toBeVisible();
    await waitForEntrance(report);
    await expectTouchTargets(page.locator("body"), `the report @ ${where}`);

    await page.locator(".next-case-panel button").click();
    const draft = page.getByTestId("relic-draft");
    await expect(draft).toBeVisible();
    await expect(page.getByTestId("relic-option").first()).toBeVisible();
    await waitForEntrance(draft);
    await expectTouchTargets(draft, `the tool draft @ ${where}`);
  });
}

/**
 * A stance is a GuardedButton (StanceRow.jsx): on a table that is not live it
 * is aria-disabled, says why in its description and drops the press. Live, it
 * is read through the accessibility tree, not the markup layout-css.test.mjs
 * matches. Closed, the table is there for 760ms only (RESOLVE_DELAY_MS): a
 * commit sets the next scene and opens the reveal in one render, so the stage
 * under the reveal is the next scene's, and live. The closed table is read in
 * one frame instead, the frame its status leaves live, by the ids its
 * description names.
 */
test("a stance that cannot be changed says why, and one that can says only what its count counts", async ({ page }) => {
  // Patterns, not the sentences: the copy is still being worded (one-name-per-term
  // rewrites both), and what is held here is which of them is said when.
  const DETAIL = /^시즌 숙련: \S.*판$/;
  const BLOCKED = /^판이 열려 있을 때만 자세를 바꿀 수 있\S*\. 시즌 숙련: \S.*판$/;
  await page.goto("/?debug=1");
  await startDebugNode(page, "case01", "start");
  const stage = page.getByTestId("gauntlet-stage");
  const stances = page.locator(".gx-focus-modes button");
  await expect(stage).toHaveAttribute("data-status", "live");
  await expect(stances).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    await expect(stances.nth(index)).not.toHaveAttribute("aria-disabled", "true");
    await expect(stances.nth(index)).toHaveAccessibleDescription(DETAIL);
  }
  await expect(page.locator(".gx-focus-modes button.mode-steady")).toHaveAttribute("aria-pressed", "false");

  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  const closed = page.waitForFunction(
    () => {
      const table = document.querySelector("[data-testid='gauntlet-stage']");
      if (!table || table.getAttribute("data-status") === "live") return false;
      const buttons = [...table.querySelectorAll(".gx-focus-modes button")];
      const said = (button) =>
        (button.getAttribute("aria-describedby") ?? "")
          .split(/\s+/)
          .filter(Boolean)
          .map((id) => document.getElementById(id)?.textContent.trim() ?? "")
          .join(" ");
      const read = buttons.map((button) => ({ disabled: button.getAttribute("aria-disabled"), description: said(button) }));
      // And it refuses the press it says it refuses. React flushes a click's
      // state before dispatchEvent returns, so a stance that took it shows it here.
      const steady = table.querySelector(".gx-focus-modes button.mode-steady");
      steady.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      return { status: table.getAttribute("data-status"), read, steadyPressed: steady.getAttribute("aria-pressed") };
    },
    null,
    { polling: "raf", timeout: 30_000 },
  );
  await cashStakedCard(page);
  const table = await (await closed).jsonValue();
  expect(table.status).toBe("cashed");
  expect(table.read).toHaveLength(3);
  for (const stance of table.read) {
    expect(stance.disabled).toBe("true");
    expect(stance.description).toMatch(BLOCKED);
  }
  expect(table.steadyPressed).toBe("false");
  await expect(page.getByTestId("decision-next")).toBeVisible();
});

test("the relic draft has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case01", "c1_aftershock");
  await completeCurrentCase(page);
  const decisionNext = page.getByTestId("decision-next");
  if (await decisionNext.isVisible()) await decisionNext.click();
  await page.locator(".next-case-panel button").click();
  await expect(page.getByTestId("relic-draft")).toBeVisible();
  await expect(page.getByTestId("relic-option").first()).toBeVisible();
  // The draft and each of its cards are dealt in.
  await waitForEntrance(page.getByTestId("relic-draft"));
  await expectNoA11yViolations(page);
});

test("the question a second tab is asked has no structural accessibility violations", async ({ page, context }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case01", "start");
  await page.locator(".choices .choice").first().click();
  await page.getByTestId("commit-push").click();
  const second = await context.newPage();
  await second.goto("/?debug=1");
  await expect(second.getByRole("alertdialog")).toBeVisible();
  await expect(second.getByTestId("table-held-elsewhere")).toBeVisible();
  await waitForEntrance(second.getByTestId("table-held-elsewhere"));
  await expectNoA11yViolations(second);
  await second.close();
});

// The question a destructive control asks is a dialog of the game's own since
// it stopped being the browser's (src/components/ConfirmDialog.jsx), so it is
// read like the other four. Nothing answers it here: it stays up for the audit.
test("the question before a reset has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await page.getByRole("button", { name: /초기화/ }).click();
  const question = page.getByRole("alertdialog");
  await expect(question).toBeVisible();
  await expect(question.getByRole("button", { name: "취소" })).toBeFocused();
  await expectNoA11yViolations(page);
});

test("final case scene has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "final", "f_start");
  await expect(page.locator(".game-shell")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("case result report has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await completeCurrentCase(page);
  await expect(page.locator(".result-page")).toBeVisible();
  await expectNoA11yViolations(page);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

test("case result report keeps keyboard focus on an actionable control", async ({ page }) => {
  await page.goto("/?debug=1");
  await startDebugNode(page, "case05", "c5_voice");
  await completeCurrentCase(page);
  const firstButton = page.locator(".result-page button").first();
  await firstButton.focus();
  await expect(firstButton).toBeFocused();
  await page.keyboard.press("Tab");
  // Focus moved, and to something a key can act on. `:focus` being visible
  // was all this asked, which the button it started on satisfied too.
  const focused = await page.evaluate(() => {
    const element = document.activeElement;
    const first = document.querySelector(".result-page button");
    return {
      inReport: Boolean(element?.closest(".result-page")),
      moved: element !== first,
      actionable: Boolean(element?.matches("button, a[href], input, select, textarea, summary, [tabindex]:not([tabindex='-1'])")),
      disabled: Boolean(element?.disabled),
      visible: Boolean(element?.getClientRects().length),
    };
  });
  expect(focused).toEqual({ inReport: true, moved: true, actionable: true, disabled: false, visible: true });
});

test("final ending report has no structural accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?debug=1");
  await startDebugNode(page, "final", "f_start");
  await completeCurrentCase(page);
  await expect(page.locator(".ending-sequence")).toBeVisible();
  await expect(page.locator(".ending-sequence")).toHaveClass(/ending-step-0/);
  await expectNoA11yViolations(page);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

test("error log and save slot panels have no structural accessibility violations", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "trigger-prototype-error-log-v1",
      JSON.stringify({
        // The key the app reads. It was `schemaVersion` here, so the log parsed
        // to nothing and the audit below was of an empty panel.
        saveSchemaVersion: 1,
        entries: [
          {
            id: "a11y-error",
            occurredAt: new Date().toISOString(),
            error: { message: "A11y panel check", stack: "" },
            context: { source: "a11y", currentCase: "case05", nodeId: "c5_voice", logLength: 0 },
            viewport: { width: 1280, height: 720 },
            domSnapshot: "",
          },
        ],
      }),
    );
    localStorage.setItem(
      "trigger-prototype-save-slots-v1",
      JSON.stringify({
        recoverySlotSchemaVersion: 1,
        slots: [
          {
            id: "a11y-slot",
            savedAt: new Date().toISOString(),
            currentCase: "case05",
            nodeId: "c5_voice",
            completedCases: ["case01", "case02", "case03", "case04"],
            snapshot: {
              recoverySlotSchemaVersion: 1,
              saveSchemaVersion: 2,
              playerName: "A11y",
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
  await page.goto("/?debug=1");
  await page.getByTestId("open-error-log-from-header").click();
  await expect(page.getByTestId("error-log-panel")).toBeVisible();
  await expect(page.getByTestId("save-slot-panel")).toBeVisible();
  // The panels have something in them: the seeded error and the seeded slot.
  await expect(page.getByTestId("error-log-panel")).toContainText("A11y panel check");
  await expect(page.getByTestId("save-slot-panel").getByRole("button").first()).toBeVisible();
  await expectNoA11yViolations(page);
});

test("error recovery screen has no structural accessibility violations", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("critical-point-force-render-error", "1");
    localStorage.setItem(
      "trigger-prototype-v2",
      JSON.stringify({
        saveSchemaVersion: 2,
        playerName: "A11y",
        started: true,
        currentCase: "case05",
        nodeId: "c5_voice",
        completedCases: ["case01", "case02", "case03", "case04"],
        log: [],
        pendingTelemetry: [],
        caseResults: {},
        playtestFeedback: {},
        resources: {},
        triggers: {},
        cognition: {},
      }),
    );
  });
  await page.goto("/?debug=1");
  await expect(page.getByRole("heading", { name: "장면을 불러오지 못했습니다." })).toBeVisible();
  await expectNoA11yViolations(page);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

/** Points the page at the stub backend, as board-ranking.spec.js does. */
async function useStubBackend(page) {
  await page.addInitScript(
    ({ urlKey, keyKey, url }) => {
      localStorage.setItem(urlKey, url);
      localStorage.setItem(keyKey, "anon");
    },
    { urlKey: TEST_STORAGE_KEYS.telemetryUrl, keyKey: TEST_STORAGE_KEYS.telemetryKey, url: BACKEND_ORIGIN },
  );
}

const stubRows = (rows) => (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(rows) });

// The board had no audit at all, and the ranking's was of an empty list: the
// guard answers every read with no rows, so no row had ever been on the page.
test("the board, with posts on it, has no structural accessibility violations", async ({ page }) => {
  await page.route(`${BACKEND_ORIGIN}/**`, stubRows([]));
  await page.route(
    `${BACKEND_ORIGIN}/rest/v1/board_posts**`,
    stubRows([
      { id: 2, nickname: "나중에 온 사람", body: "두 번째 글입니다.", created_at: "2026-09-28T09:00:00Z" },
      { id: 1, nickname: "먼저 온 사람", body: "끝까지 가 보세요.", created_at: "2026-09-27T09:00:00Z" },
    ]),
  );
  await useStubBackend(page);
  await page.goto("/");
  await page.getByRole("button", { name: "게시판" }).first().click();
  await expect(page.locator(".board-post")).toHaveCount(2);
  // With something typed that the board will not take as it is: the privacy
  // notice is an alert, and the button it blocks is described by it.
  await page.getByPlaceholder("게시판에 보일 이름").fill("분석관 김");
  await page.getByPlaceholder(/사건을 지나며/).fill("연락은 tester@example.com 으로 주세요");
  await expect(page.locator("#board-privacy-notice")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("ranking screen, with rows on it, has no structural accessibility violations", async ({ page }) => {
  const row = (tag, score) => ({
    run_tag: tag,
    player_name: "익명 분석관",
    case_id: "season-final",
    case_title: "SEASON 01 COMPLETE",
    completed_at: "2026-09-27T09:00:00Z",
    score,
    summary: { burstScore: score, rank: "B", primary: ["curiosity", 90], seasonComplete: true, averageResponseTime: 14, reframeCount: 2 },
  });
  await page.route(`${BACKEND_ORIGIN}/**`, stubRows([]));
  await page.route(`${BACKEND_ORIGIN}/rest/v1/public_rankings**`, stubRows([row("AXEROW01", 82), row("AXEROW02", 71)]));
  await useStubBackend(page);
  await page.goto("/");
  await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.locator(".ranking-row")).toHaveCount(2);
  await expectNoA11yViolations(page);
});

test("ranking screen has no structural accessibility violations", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.getByRole("button", { name: "랭킹" }).first().click();
  await expect(page.locator(".ranking-page")).toBeVisible();
  await expectNoA11yViolations(page);
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

/**
 * The table's one voice (tableVoice.js, E3). Drafted 2026-10-14 in
 * `table-voice` and not yet run: run with --repeat-each=3 --retries=0 on both
 * projects before it merges (e2e runs only on main, and a failure there skips
 * the deploy).
 *
 * case01 `start` is the table the overclock test pushes three times without
 * meeting the wall, so one push here lands live.
 */
const PUSH_CALL = /^열기 \d+ · (벽까지 최소 \d+|다음 밀기가 벽 사정권)$/;

test("a push is said in the table's one polite region, with the shown band and never the drawn wall", async ({ page }) => {
  await startDebugNode(page, "case01", "start");
  const voice = page.getByTestId("table-voice");
  await expect(voice).toHaveAttribute("role", "status");
  await expect(voice).toHaveText("");
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await page.getByTestId("commit-push").click();
  await expect(page.getByTestId("gauntlet-stage")).toHaveAttribute("data-status", "live");
  await expect(voice).toHaveText(PUSH_CALL);
  // Not compared with the meter: the clock's creep can move the heat after the call.
  // The heartbeat is not said: it is the one number that moves on every tick.
  await expect(voice).not.toContainText("심박");
  // One region on the table speaks; the pot and the heartbeat are read when asked for.
  await expect(page.getByTestId("gauntlet-stage").locator("[role='status'], [aria-live='polite'], [aria-live='assertive']")).toHaveCount(1);
});

test("the verdict is the slam's alone, and the next table says what the cash banked", async ({ page }) => {
  await startDebugNode(page, "case01", "start");
  const voice = page.getByTestId("table-voice");
  await page.locator(".choices .choice:not([aria-disabled='true'])").first().click();
  await cashStakedCard(page);
  // Under the slam and the reveal the voice is empty, so the multiplier is heard once.
  await expect(voice).toHaveText("");
  await page.getByTestId("decision-next").click();
  await dismissProtocolBreach(page);
  const runPot = await page.getByTestId("gauntlet-run-pot").textContent();
  await expect(voice).toHaveText(new RegExp(`^판돈 ${runPot} · 금고 [\\d,]+$`));
});
