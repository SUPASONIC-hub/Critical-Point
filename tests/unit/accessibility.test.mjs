import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { createStorage } from "./helpers/browser.mjs";

globalThis.localStorage = createStorage();

const { ACCESSIBILITY_SETTINGS_KEY } = await import("../../src/appConfig.js");
const settings = await import("../../src/state/accessibilitySettings.js");
const { createCaseSummary } = await import("../../src/gameLogic.js");
const { buildLeaderboard } = await import("../../src/ranking.js");

test("the settings read back what was stored, and only values the game offers", () => {
  settings.resetAccessibilityCache();
  assert.deepEqual({ ...settings.getAccessibility() }, { ...settings.DEFAULT_ACCESSIBILITY });

  localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify({ tableTime: 3, letterKeys: "no", calmEffects: true, extra: 1 }));
  settings.resetAccessibilityCache();
  assert.deepEqual({ ...settings.getAccessibility() }, { ...settings.DEFAULT_ACCESSIBILITY, calmEffects: true });

  localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, "{broken");
  settings.resetAccessibilityCache();
  assert.equal(settings.getAccessibility().tableTime, 1);
});

test("a change is stored, told to subscribers and put on the document", () => {
  settings.resetAccessibilityCache();
  const attributes = new Map();
  globalThis.document = { documentElement: { toggleAttribute: (name, on) => attributes.set(name, on) } };
  let told = 0;
  const unsubscribe = settings.subscribeAccessibility(() => told++);
  try {
    const next = settings.setAccessibility({ tableTime: 1.5, stillIntro: true });
    assert.equal(next.tableTime, 1.5);
    assert.equal(told, 1);
    assert.equal(JSON.parse(localStorage.getItem(ACCESSIBILITY_SETTINGS_KEY)).stillIntro, true);
    assert.equal(attributes.get("data-still-intro"), true);
    assert.equal(attributes.get("data-calm-effects"), false);
    settings.setAccessibility({ tableTime: 7 });
    assert.equal(settings.getAccessibility().tableTime, 1, "a scale the game does not offer falls back to 1");
  } finally {
    unsubscribe();
    delete globalThis.document;
  }
});

test("a case played on a slowed clock says so in its summary, and one played at pace does not", () => {
  const entry = (extra = {}) => ({ caseId: "case02", nodeId: "c2_start", choiceId: "x", responseTimeSec: 10, effect: {}, ...extra });
  assert.equal("assistTime" in createCaseSummary({}, {}, [entry(), entry()]), false);
  assert.equal(createCaseSummary({}, {}, [entry(), entry({ assistTime: 1.5 }), entry({ assistTime: 2 })]).assistTime, 2);
});

test("a ranking row shows the slowed clock only for a value the game offers", () => {
  const row = (assistTime) => ({ case_id: "season-final", run_id: `run-${assistTime}`, completed_at: "2026-09-29T00:00:00Z", summary: { rank: "A", burstScore: 10, assistTime } });
  const [slowed] = buildLeaderboard([row(1.5)]);
  assert.equal(slowed.assistTime, 1.5);
  assert.equal(buildLeaderboard([row(9)])[0].assistTime, 1);
  assert.equal(buildLeaderboard([row(undefined)])[0].assistTime, 1);
});

test("a control names only the keys the setting leaves on", () => {
  const { listedShortcuts } = settings;
  assert.equal(listedShortcuts("Space W", true), "Space W");
  assert.equal(listedShortcuts("Space W", false), "Space", "W is one character; Space is not");
  assert.equal(listedShortcuts("Space Enter W", false), "Space Enter");
  assert.equal(listedShortcuts("Escape", false), "Escape");
  // Nothing left means no attribute at all, not an empty one.
  assert.equal(listedShortcuts("E", false), undefined);
  assert.equal(listedShortcuts(3, false), undefined, "a card's digit");
  assert.equal(listedShortcuts(3, true), "3");
  // Shift does not make P a different kind of key: the setting turns it off too.
  assert.equal(listedShortcuts("Shift+P", false), undefined);
  assert.equal(listedShortcuts("Shift+P", true), "Shift+P");
  assert.equal(listedShortcuts("", true), undefined);
});

test("the loading screen is told how much of the season has arrived", async () => {
  const { getLoadProgress, noteCasesArrived, subscribeLoadProgress } = await import("../../src/state/loadProgress.js");
  let told = 0;
  const unsubscribe = subscribeLoadProgress(() => {
    told += 1;
  });
  noteCasesArrived(3, 55);
  assert.deepEqual({ ...getLoadProgress() }, { done: 3, total: 55 });
  noteCasesArrived(3, 55);
  assert.equal(told, 1, "the same count again is not news");
  unsubscribe();
  noteCasesArrived(4, 55);
  assert.equal(told, 1);
  assert.equal(getLoadProgress().done, 4);
});

test("the hooks read the setting the way a component will", async () => {
  const { createElement } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { useConsentToggle } = await import("../../src/state/useConsentToggle.js");
  function Probe() {
    const { letterKeys, keys } = settings.useShortcutHints();
    const consent = useConsentToggle({});
    return createElement("button", { "aria-keyshortcuts": keys("Space W"), "data-note": String(consent.note) }, letterKeys ? "W" : "");
  }
  settings.resetAccessibilityCache();
  localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify({ letterKeys: false }));
  assert.equal(renderToStaticMarkup(createElement(Probe)), '<button aria-keyshortcuts="Space" data-note="null"></button>');
  settings.resetAccessibilityCache();
  localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify({ letterKeys: true }));
  assert.equal(renderToStaticMarkup(createElement(Probe)), '<button aria-keyshortcuts="Space W" data-note="null">W</button>');
  settings.resetAccessibilityCache();
});

/* ------------------------------------------------------------- story mode */

const source = (file) => readFileSync(new URL(`../../src/${file}`, import.meta.url), "utf8");

test("story mode is off until it is chosen, and is stored like any other switch", () => {
  assert.equal(settings.DEFAULT_ACCESSIBILITY.storyMode, false);
  localStorage.removeItem(ACCESSIBILITY_SETTINGS_KEY);
  settings.resetAccessibilityCache();
  assert.equal(settings.getAccessibility().storyMode, false);
  assert.equal(settings.setAccessibility({ storyMode: true }).storyMode, true);
  assert.equal(JSON.parse(localStorage.getItem(ACCESSIBILITY_SETTINGS_KEY)).storyMode, true);
  settings.resetAccessibilityCache();
  assert.equal(settings.getAccessibility().storyMode, true, "and read back on the next visit");
  // Only a boolean: anything else is not a choice the panel can have made.
  assert.equal(settings.normalizeAccessibility({ storyMode: 1 }).storyMode, false);
  // It changes nothing else: the table reads it when a case opens
  // (state/runLifecycle.js), not from an attribute on the document.
  assert.deepEqual({ ...settings.setAccessibility({ storyMode: false }) }, { ...settings.DEFAULT_ACCESSIBILITY });
  settings.resetAccessibilityCache();
});

test("the comfort panel's switches are settings the game has, and story mode is the first of them", () => {
  const panel = source("components/AccessibilityPanel.jsx");
  const start = panel.indexOf("const TOGGLES = [");
  const list = panel.slice(start, panel.indexOf("\n];", start));
  const keys = [...list.matchAll(/key: "(\w+)"/g)].map((match) => match[1]);
  assert.deepEqual(keys, ["storyMode", "holdReadingClock", "calmEffects", "letterKeys", "stillIntro"]);
  for (const key of keys) assert.equal(typeof settings.DEFAULT_ACCESSIBILITY[key], "boolean", `${key} is a switch`);
  assert.match(list, /label: "스토리 모드"/);
  // What the switch says it does, each clause being something the engine does
  // (tests/unit/story-mode.test.mjs): the far wall, no broken next board, no
  // skipped scene, the clock, when it starts, and the ranking.
  for (const clause of ["벽이 멀어지고", "다음 판으로 넘어오지 않습니다", "장면을 건너뛰지 않습니다", "시계는 2배 느립니다", "다음 사건부터 적용되고", "공개 랭킹에는 오르지 않습니다"]) {
    assert.ok(list.includes(clause), `the description says: ${clause}`);
  }
});

// The pledges are a pick-one list and story mode is on or off: as a fourth
// card it read as two of four picked. It is chosen in the comfort panel alone,
// and the drawer says where.
test("the play-style drawer holds the three pledges and points to the comfort panel for story mode", () => {
  const intro = source("screens/IntroScreen.jsx");
  const grid = intro.slice(intro.indexOf('<div className="play-style-grid">'), intro.indexOf('<p className="play-style-note">'));
  const [pledge, ...more] = grid.split("<button").slice(1);
  assert.equal(more.length, 0, "one mapped pledge card and no other");
  assert.match(pledge, /setPlayStyle\(style\.id\)/);
  assert.match(pledge, /aria-pressed=\{playStyle === style\.id\}/);
  assert.doesNotMatch(intro, /storyMode|setAccessibility|useAccessibility/, "the intro screen itself reads and sets no setting");
  assert.ok(intro.includes("고른 방식은 내 다짐으로 기록됩니다. 판의 규칙을 바꾸는 스토리 모드는 편의 설정에 있습니다."));
  assert.ok(!intro.includes("판의 규칙은 바뀌지 않습니다"));
  // The one switch: the comfort panel's checkbox, writing the device setting.
  const panel = source("components/AccessibilityPanel.jsx");
  assert.match(panel, /onChange=\{\(event\) => setAccessibility\(\{ \[toggle\.key\]: event\.target\.checked \}\)\}/);
});

test("the report and the ranking row show what the run recorded, never the device's setting", () => {
  const result = source("screens/ResultScreen.jsx");
  const ranking = source("screens/RankingScreen.jsx");
  for (const [name, screen] of [["ResultScreen", result], ["RankingScreen", ranking]]) {
    assert.doesNotMatch(screen, /accessibilitySettings|useAccessibility|getAccessibility|storyMode/, `${name} does not read the setting`);
  }
  // The case's own summary (the season's, on the finale: caseResults.final).
  // It ends the eyebrow line that says whose record this is, not the rank badge.
  assert.ok(result.includes('의 생각 활성 프로필{view.score.caseResults[currentCase]?.assistStory && " · 스토리 모드 · 공개 랭킹 제외"}</p>'));
  assert.ok(result.includes("<small>{momentumTier} · {momentumScore} POINTS</small>"));
  assert.equal(result.split("assistStory").length, 2, "and is printed once");
  // The row model's field, beside the table-time mark and in its class.
  assert.ok(ranking.includes('{entry.assistStory && <span className="ranking-assist">스토리 모드</span>}'));
  // And the row model takes it from the row's summary alone.
  const story = { local: true, case_id: "season-final", run_id: "run-story", completed_at: "2026-10-10T00:00:00Z", summary: { rank: "A", burstScore: 10, assistStory: true, assistTime: 2 } };
  const plain = { ...story, run_id: "run-plain", summary: { rank: "A", burstScore: 10 } };
  settings.setAccessibility({ storyMode: true });
  const rows = buildLeaderboard([story, plain]);
  assert.equal(rows.find((row) => row.runId === "run-story").assistStory, true);
  assert.equal(rows.find((row) => row.runId === "run-story").assistTime, 2);
  assert.equal(rows.find((row) => row.runId === "run-plain").assistStory, false, "the setting being on marks no row");
  settings.setAccessibility({ storyMode: false });
  settings.resetAccessibilityCache();
});

test("the intro and the origin profiles carry nothing the page cannot print", async () => {
  // Removed on 2026-10-10 to make room for story mode's copy in the entry
  // chunk; this holds why each was dead, so none comes back as a guard.
  const { getOperatorProfile, getOperatorProfiles, getOriginPrologue, getPastRunMemory, getPlayStyleUnlocks, getSeasonGoals, getTutorialSteps, getAuthorityProfile } =
    await import("../../src/advancedSystems.js");
  // The drawers the intro no longer guards: each of these is always there.
  assert.equal(getOperatorProfiles().length, 3);
  assert.ok(getTutorialSteps().length > 0);
  assert.ok(getSeasonGoals().length > 0);
  for (const origin of ["courier", "lab", "public", "nobody", undefined]) {
    assert.equal(typeof getOperatorProfile(origin).title, "string");
    assert.equal(typeof getOperatorProfile(origin).authority, "string");
    assert.equal(typeof getOriginPrologue(origin).title, "string");
  }
  for (const style of ["instinct", "auditor", "mediator", "nobody", undefined]) assert.equal(typeof getPlayStyleUnlocks(style).label, "string");
  // An origin's own permission list fed one field, `originPermissions`, that
  // no screen read; the authority level's list is the one that is shown.
  assert.deepEqual(getAuthorityProfile("lab", "OVERSIGHT").permissions, ["기록 공개", "현장 개입", "실험 종료"]);
  assert.equal("originPermissions" in getAuthorityProfile("lab", "OVERSIGHT"), false);
  for (const profile of getOperatorProfiles()) assert.equal("permissions" in profile, false);
  const everySource = ["screens", "components", "state", "viewModels", "gauntlet"].map((dir) => new URL(`../../src/${dir}/`, import.meta.url));
  const { readdirSync } = await import("node:fs");
  for (const dir of everySource) {
    for (const file of readdirSync(dir).filter((name) => /\.jsx?$/.test(name))) {
      assert.doesNotMatch(readFileSync(new URL(file, dir), "utf8"), /originPermissions/, `${file} reads no origin permission list`);
    }
  }
  // The past-run note is a label and a sentence; the intro prints those two.
  assert.deepEqual(Object.keys(getPastRunMemory({ case01: { outcomeChoiceId: "c1_public" } })), ["label", "text"]);
  assert.equal(getPastRunMemory({}), null);
  // The shell hands the view model nothing it does not take.
  const params = source("viewModels/introViewModel.js");
  assert.doesNotMatch(params.slice(params.indexOf("export function createIntroViewModel({"), params.indexOf("}) {", params.indexOf("export function createIntroViewModel({"))), /setSaveStatus/);
  const shell = source("AppContent.jsx");
  assert.doesNotMatch(shell.slice(shell.indexOf("const introView = createIntroViewModel({"), shell.indexOf("return <IntroScreen view={introView} />")), /^\s*setSaveStatus,$/m);
});
