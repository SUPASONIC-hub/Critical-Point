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

// A phone drew a digit on every card and R and N on the report: the setting
// was all a hint asked about. The pointer is the second question.
test("a key is drawn only where a mouse or a trackpad says a keyboard may be there", () => {
  const { shortcutHints } = settings;
  const read = (hints) => [hints.drawn, hints.letterKeys, hints.keys("Space W"), hints.keys(1)];
  assert.deepEqual(read(shortcutHints(true, true)), [true, true, "Space W", "1"], "a laptop");
  // Named to a screen reader, because the key works if one arrives; not drawn.
  assert.deepEqual(read(shortcutHints(true, false)), [false, false, "Space W", "1"], "a phone");
  assert.deepEqual(read(shortcutHints(false, true)), [true, false, "Space", undefined], "a laptop with the letters off");
  assert.deepEqual(read(shortcutHints(false, false)), [false, false, "Space", undefined], "a phone with the letters off");
});

test("the pointer is asked of the browser, heard when it changes, and taken as a mouse where it cannot be asked", () => {
  const { hasFinePointer, subscribeFinePointer } = settings;
  // Node, and the hook's server render: the hints follow the setting alone.
  assert.equal(globalThis.matchMedia, undefined);
  assert.equal(hasFinePointer(), true);
  assert.doesNotThrow(() => subscribeFinePointer(() => {})());

  const asked = [];
  const listeners = new Set();
  let fine = false;
  globalThis.matchMedia = (query) => {
    asked.push(query);
    return {
      get matches() {
        return fine;
      },
      addEventListener: (type, listener) => type === "change" && listeners.add(listener),
      removeEventListener: (type, listener) => type === "change" && listeners.delete(listener),
    };
  };
  try {
    assert.equal(hasFinePointer(), false, "a phone");
    assert.deepEqual(asked, ["(any-pointer: fine)"], "any of the inputs, not the first: a touch laptop has a trackpad");
    let told = 0;
    const unsubscribe = subscribeFinePointer(() => told++);
    assert.equal(listeners.size, 1);
    // A mouse is attached with the page open.
    fine = true;
    for (const listener of listeners) listener({ matches: true });
    assert.equal(told, 1);
    assert.equal(hasFinePointer(), true);
    unsubscribe();
    assert.equal(listeners.size, 0);

    // A browser whose query list cannot be listened to still answers.
    globalThis.matchMedia = () => ({ matches: false });
    assert.equal(hasFinePointer(), false);
    assert.doesNotThrow(() => subscribeFinePointer(() => {})());
  } finally {
    delete globalThis.matchMedia;
  }
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

test("the comfort panel's switches are settings the game has, and story mode is the first of them", async () => {
  const panel = source("components/AccessibilityPanel.jsx");
  const start = panel.indexOf("const TOGGLES = [");
  const keys = [...panel.slice(start, panel.indexOf("];", start)).matchAll(/"(\w+)"/g)].map((match) => match[1]);
  assert.deepEqual(keys, ["storyMode", "holdReadingClock", "foldReadScenes", "calmEffects", "edgeNotices", "letterKeys", "stillIntro"]);
  for (const key of keys) assert.equal(typeof settings.DEFAULT_ACCESSIBILITY[key], "boolean", `${key} is a switch`);
  // The words are the panel's copy table (src/copy/comfort.js), one entry per switch.
  const { default: comfortCopy } = await import("../../src/copy/comfort.js");
  assert.deepEqual(Object.keys(comfortCopy.toggles), keys);
  assert.equal(comfortCopy.toggles.storyMode.label, "스토리 모드");
  const list = comfortCopy.toggles.storyMode.text;
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
  // The drawer's note is the screen's copy table (src/copy/intro.js), printed by the drawer.
  const introWords = source("copy/intro.js");
  assert.ok(introWords.includes('note: "고른 방식은 내 다짐으로 기록됩니다. 판의 규칙을 바꾸는 스토리 모드는 편의 설정에 있습니다."'));
  assert.ok(intro.includes("<small>{introCopy.playStyle.note}</small>"));
  assert.ok(!intro.includes("판의 규칙은 바뀌지 않습니다") && !introWords.includes("판의 규칙은 바뀌지 않습니다"));
  // The one switch: the comfort panel's checkbox, writing the device setting.
  const panel = source("components/AccessibilityPanel.jsx");
  assert.match(panel, /onChange=\{\(event\) => setAccessibility\(\{ \[key\]: event\.target\.checked \}\)\}/);
});

test("the report and the ranking row show what the run recorded, never the device's setting", () => {
  const result = source("screens/ResultScreen.jsx");
  const ranking = source("screens/RankingScreen.jsx");
  for (const [name, screen] of [["ResultScreen", result], ["RankingScreen", ranking]]) {
    assert.doesNotMatch(screen, /accessibilitySettings|useAccessibility|getAccessibility|storyMode/, `${name} does not read the setting`);
  }
  // The case's own summary (the season's, on the finale: caseResults.final).
  // It ends the eyebrow line that says whose record this is, not the rank badge.
  // Its words are the screen's copy table (src/copy/result.js, 다국어 틀).
  assert.ok(result.includes('analyst: analystName })}{view.score.caseResults[currentCase]?.assistStory && resultCopy.storyRunMark}</p>'));
  const resultWords = source("copy/result.js");
  assert.ok(resultWords.includes('profileLine: "{caseLabel} · {analyst}의 생각 활성 프로필"'));
  assert.ok(resultWords.includes('storyRunMark: " · 스토리 모드 · 공개 랭킹 제외"'));
  assert.ok(result.includes('<small lang="en">{momentumTier} · {momentumScore} POINTS</small>'));
  assert.equal(result.split("assistStory").length, 2, "and is printed once");
  // The row model's field, beside the table-time mark and in its class.
  // Its words are the screen's copy table too (src/copy/ranking.js).
  assert.ok(ranking.includes('{entry.assistStory && <span className="ranking-assist">{words.story}</span>}'));
  assert.ok(source("copy/ranking.js").includes('story: "스토리 모드",'));
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

// A bust was read twice: the slam over the table is an alert ("BUST", the wall,
// the pot), and the reveal that opens 1.35 seconds later was a dialog named by
// its own headline, "BUST" again as focus arrived. The slam is on the page
// first and says more, so it keeps the announcement; the dialog has a name
// that is not the verdict.
test("a verdict is announced once, by the slam, and the reveal's name does not repeat it", () => {
  const notices = source("gauntlet/TableNotices.jsx");
  const reveal = source("components/DecisionReveal.jsx");
  // The one announcement, and what it says of a bust: the word, why, and the pot.
  assert.match(notices, /<div className=\{`gx-slam gx-slam-\$\{win\.status\}`\} role="alert">/);
  const slam = notices.slice(notices.indexOf("function VerdictSlam("), notices.indexOf("export function TableNotices("));
  assert.match(slam, /<strong lang="en">BUST<\/strong>/);
  // Its words are the table's copy (src/copy/table.js, `notices`), read by key.
  for (const said of ["say.slamTimeout", "say.slamAbandon", "fill(say.slamWall, { wall: win.wall })", "{say.slamPot} {formatNumber(runPot)} → {formatNumber(bustKeeps)}"]) {
    assert.ok(slam.includes(said), `the slam says: ${said}`);
  }
  const slamCopy = source("copy/table.js");
  for (const said of ['slamTimeout: "시간이 먼저 끝났다"', 'slamAbandon: "테이블을 떠났다"', 'slamWall: "벽은 {wall}에 있었다"', 'slamPot: "판돈"']) {
    assert.ok(slamCopy.includes(said), `the slam's copy says: ${said}`);
  }
  // The reveal is a named modal dialog that announces nothing by itself.
  // Its name is the reveal's copy (src/copy/reveal.js), read by key.
  assert.match(reveal, /role="dialog"\s+aria-modal="true"\s+aria-label=\{revealCopy\.dialogLabel\}/);
  assert.match(readFileSync(new globalThis.URL("../../src/copy/reveal.js", import.meta.url), "utf8"), /dialogLabel: "판정 결과"/);
  assert.doesNotMatch(reveal, /aria-labelledby|aria-describedby|aria-live|role="(?:alert|status|log)"/, "no second voice for the verdict");
  // What it shows is what it showed: the headline as the sheet's heading, and the line under it.
  assert.match(reveal, /\{busted && <Skull size=\{34\} aria-hidden="true" \/>\}\s+<h2>\{headline\}<\/h2>\s+<p>\{subline\}<\/p>/);
  assert.match(reveal, /busted\s+\? "BUST"/);
});

test("the intro and the origin profiles carry nothing the page cannot print", async () => {
  // Removed on 2026-10-10 to make room for story mode's copy in the entry
  // chunk; this holds why each was dead, so none comes back as a guard.
  const { getOperatorProfile, getOperatorProfiles, getOriginPrologue, getPastRunMemory, getPlayStyleUnlocks, getSeasonGoals, getTutorialSteps } =
    await import("../../src/advancedSystems.js");
  const { getAuthorityProfile } = await import("../../src/runtimeSystems.js");
  // The drawers the intro no longer guards: each of these is always there.
  assert.equal(getOperatorProfiles().length, 3);
  assert.ok(getTutorialSteps().length > 0);
  assert.ok(getSeasonGoals().length > 0);
  for (const origin of ["courier", "lab", "public", "nobody", undefined]) {
    assert.equal(typeof getOperatorProfile(origin).title, "string");
    assert.equal(typeof getOperatorProfile(origin).start, "string");
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
  assert.deepEqual(Object.keys(getPastRunMemory({ case01: { outcomeChoiceId: "c1_public" } })), ["round", "book", "text"]);
  assert.equal(getPastRunMemory({}), null);
  // The shell hands the view model nothing it does not take.
  const params = source("viewModels/introViewModel.js");
  assert.doesNotMatch(params.slice(params.indexOf("export function createIntroViewModel({"), params.indexOf("}) {", params.indexOf("export function createIntroViewModel({"))), /setSaveStatus/);
  const shell = source("AppContent.jsx");
  assert.doesNotMatch(shell.slice(shell.indexOf("const introView = createIntroViewModel({"), shell.indexOf("return <IntroScreen view={introView} />")), /^\s*setSaveStatus,$/m);
});

test("이야기 글 크기 is one of three sizes, carried on the document as an attribute and a factor (D-5)", () => {
  assert.deepEqual([...settings.STORY_SCALES], [1, 1.125, 1.25]);
  assert.equal(settings.DEFAULT_ACCESSIBILITY.storyScale, 1);
  assert.equal(settings.normalizeAccessibility({ storyScale: 1.25 }).storyScale, 1.25);
  assert.equal(settings.normalizeAccessibility({ storyScale: 2 }).storyScale, 1, "a size the panel does not offer is the default");
  assert.equal(settings.normalizeAccessibility({ storyScale: "1.125" }).storyScale, 1);
  const attributes = new Map();
  const style = new Map();
  const root = { toggleAttribute: (name, on) => attributes.set(name, on), style: { setProperty: (name, value) => style.set(name, value) } };
  settings.applyAccessibilityToDocument(settings.normalizeAccessibility({ storyScale: 1.125 }), root);
  assert.equal(attributes.get("data-story-scale"), true);
  assert.equal(style.get("--story"), "1.125");
  settings.applyAccessibilityToDocument(settings.normalizeAccessibility({}), root);
  assert.equal(attributes.get("data-story-scale"), false, "the default size leaves the prose alone");
  // The table is not on the list: its height is budgeted to the pixel.
  const css = readFileSync(new globalThis.URL("../../src/styles/app/comfort.css", import.meta.url), "utf8");
  const rules = css.slice(css.indexOf("[data-story-scale]"));
  for (const target of [".gx-panel-story .gx-caption", ".gx-balloon", ".decision-reveal-beat p", ".outcome-panel p", ".interlude-panel p"]) assert.ok(rules.includes(target), `${target} grows`);
  assert.doesNotMatch(rules, /\.gx-table|\.gx-hand|\.gx-card|\.gx-brief\b/, "the table keeps its size");
});

test("the edge notices are on until turned off, and say no number aloud or on screen", () => {
  assert.equal(settings.DEFAULT_ACCESSIBILITY.edgeNotices, true);
  assert.equal(settings.normalizeAccessibility({ edgeNotices: false }).edgeNotices, false);
  assert.equal(settings.normalizeAccessibility({ edgeNotices: "off" }).edgeNotices, true);
  const notice = source("gauntlet/EdgeNotice.jsx");
  // Noise, not a reading: kept out of the table's one polite region, and off the pointer's way.
  assert.match(notice, /aria-hidden="true"/);
  assert.match(notice, /pointerEvents: "none"/);
  assert.doesNotMatch(notice, /role="(?:status|alert)"|aria-live/);
  // The notices' words are their own copy table (src/copy/edgeNotices.js, `notices`).
  const edgeWords = source("copy/edgeNotices.js");
  const words = edgeWords.slice(edgeWords.indexOf("  notices: {"), edgeWords.indexOf("\n  },", edgeWords.indexOf("  notices: {")));
  for (const [, line] of words.matchAll(/"([^"]*[가-힣][^"]*)"/g)) assert.doesNotMatch(line, /\d/, `"${line}" carries no number`);
  // Reduced motion and the calm switch both stop the slide.
  assert.match(notice, /prefers-reduced-motion: reduce/);
  assert.match(notice, /data-calm-effects/);
});

test("the edge notices are written case by case, and keep the third and sixth press", async () => {
  const { CASE_SEQUENCE } = await import("../../src/gameCases.js");
  // The JSX cannot be imported here, so its pure part (the table and its reader) is run as written.
  const file = source("gauntlet/EdgeNotice.jsx");
  const body = file.slice(file.indexOf("export const EDGE_AT"), file.indexOf("const STILL")).replaceAll("export ", "");
  // Its words are the notices' copy table (src/copy/edgeNotices.js), handed in as the file imports it.
  const { default: edgeNoticesCopy } = await import("../../src/copy/edgeNotices.js");
  const edge = new Function("edgeNoticesCopy", `${body}
return { EDGE_AT, EDGE_NOTICES, pickEdgeNotice };`)(edgeNoticesCopy);
  assert.deepEqual([...edge.EDGE_AT], [3, 6]);
  // One entry per case of the season, in its order, and none for a case that is not in it (B-15, 2026-10-24).
  assert.deepEqual(Object.keys(edge.EDGE_NOTICES), CASE_SEQUENCE);
  for (const caseId of CASE_SEQUENCE) {
    const [message, mail] = edge.EDGE_NOTICES[caseId];
    for (const [notice, label] of [[message, "메신저 · "], [mail, "메일 · "]]) {
      const [from, ...lines] = notice;
      assert.equal(lines.length, 2, `${caseId}: ${label}${from} has two lines`);
      assert.ok(from && lines.every(Boolean), `${caseId}: ${label}${from} is written`);
      // Short enough for one line at the bottom left of a phone, before its ellipsis.
      for (const line of [label + from, ...lines]) assert.ok(line.length <= 20, `"${line}" is short`);
      // Only the third press brings the message and only the sixth the mail; n picks the line.
      assert.deepEqual(lines.map((_, n) => edge.pickEdgeNotice(label === "메일 · " ? 6 : 3, n, caseId)), lines.map((line) => ({ from: label + from, line })));
    }
    for (const line of mail.slice(1)) assert.match(line, /^\[[가-힣]+\] \S/, `${caseId}: "${line}" reads as a mail subject`);
    for (const pushes of [0, 1, 2, 4, 5, 7, 9]) assert.equal(edge.pickEdgeNotice(pushes, 0, caseId), null);
  }
  // A case outside the season's order reads as 프롤로그 01.
  assert.deepEqual(edge.pickEdgeNotice(3, 0, "nowhere"), edge.pickEdgeNotice(3, 0, "prologue01"));
  assert.deepEqual(edge.pickEdgeNotice(6, 1, undefined), edge.pickEdgeNotice(6, 1, "prologue01"));
});

test("every edge-notice sender is someone that case's own scenes bring in", async () => {
  const { CASE_SEQUENCE } = await import("../../src/gameCases.js");
  const file = source("gauntlet/EdgeNotice.jsx");
  const body = file.slice(file.indexOf("export const EDGE_AT"), file.indexOf("const STILL")).replaceAll("export ", "");
  const { default: edgeNoticesCopy } = await import("../../src/copy/edgeNotices.js");
  const { EDGE_NOTICES } = new Function("edgeNoticesCopy", `${body}
return { EDGE_NOTICES };`)(edgeNoticesCopy);
  // The messenger and the mail's office are named in the case itself, so neither is news from a later case
  // nor someone the player has not met yet (B-15, per case since 2026-10-24).
  for (const caseId of CASE_SEQUENCE) {
    const scenes = readFileSync(new globalThis.URL(`../../src/nodes/${caseId === "final" ? "finalCase" : caseId}.js`, import.meta.url), "utf8");
    const [[name], [office]] = EDGE_NOTICES[caseId];
    assert.ok(scenes.includes(name), `메신저 · ${name} appears in ${caseId}'s scenes`);
    assert.ok(scenes.includes(office), `메일 · ${office} appears in ${caseId}'s scenes`);
  }
});

test("the reading clock asks once: 프롤로그 01-02 start held until it has, and the answer is the comfort switch", () => {
  // A-11 = D-4 (user's choice 1, 2026-10-22). The flag is kept, not a switch of the panel.
  assert.equal(settings.DEFAULT_ACCESSIBILITY.readingClockAsked, false);
  assert.equal(settings.normalizeAccessibility({ readingClockAsked: "yes" }).readingClockAsked, false);
  assert.equal(settings.normalizeAccessibility({ readingClockAsked: true }).readingClockAsked, true);
  const ask = source("gauntlet/ReadingClockAsk.jsx");
  assert.match(ask, /const READ_FIRST_CASES = new Set\(\["prologue01", "prologue02"\]\);/);
  assert.match(ask, /const ask = !holdReadingClock && !readingClockAsked;/);
  assert.match(ask, /held: holdReadingClock \|\| \(ask && READ_FIRST_CASES\.has\(caseId\)\)/);
  // The question is the edge's copy (src/copy/edge.js), read by key.
  assert.match(ask, /<p id="gx-read-ask">\{edgeCopy\.ask\.question\}<\/p>/);
  assert.match(source("copy/edge.js"), /question: "다 읽고 직접 열기로 바꿀까요\?"/);
  assert.match(ask, /\{ readingClockAsked: true, holdReadingClock: true \} : \{ readingClockAsked: true \}/);
  // The briefing asks where the clock would open the table, and only once.
  const briefing = source("gauntlet/SceneBriefing.jsx");
  assert.match(briefing, /if \(remaining <= 0 && askRef\.current\) \{\s*\/\/[^\n]*\s*askRef\.current = false;/);
  // Reading time is not in the score: nothing outside the page reads its seconds.
  for (const file of ["gauntlet/GauntletStage.jsx", "gameLogic.js", "ranking.js", "state/useChoiceCommit.js"]) {
    assert.doesNotMatch(source(file), /getReadingSeconds|readingClockAsked/, `${file} reads the reading clock`);
  }
});
