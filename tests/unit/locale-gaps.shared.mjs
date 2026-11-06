import assert from "node:assert/strict";
import { readdirSync } from "node:fs";

import { overlayModule } from "../../src/locales/overlay.js";
import * as appCopy from "../../src/appCopy.js";
import * as playerLanguage from "../../src/playerLanguage.js";
import * as gameCases from "../../src/gameCases.js";
import { getJudgementHabit, habitCardLine, JUDGEMENT_HABITS } from "../../src/judgementHabit.js";
import { buildResultCardModel, buildShareText } from "../../src/resultCardModel.js";
import { buildNarrativeSpine, explainResourceTradeoff, getCaseOutcome, getDecisionFingerprint, getThinkingMotive, speechifyChoice } from "../../src/gameLogic.js";
import { createLogicReport, describeLogicCase, LOGIC_RANK_COPY, LOGIC_REPORT_COPY } from "../../src/logicReport.js";
import { SCENE_CHOICE_COPY } from "../../src/sceneChoices.js";
import { SCENE_TRACE_COPY } from "../../src/sceneTraces.js";
import { getEndingBook } from "../../src/state/endingBook.js";
import { getMemoryLine, getOpeningEcho, getSeasonComparison } from "../../src/state/newGamePlusCarry.js";
import { CASE_ECHOES, getSeasonCard } from "../../src/state/secondSeason.js";
import { openingEcho } from "../../src/state/openingState.js";
import { getSuspenseEvent, getSuspenseState } from "../../src/riskLogic.js";
import { createEndingProfile } from "../../src/viewModels/reportViewModels.js";
import { getPastRunMemory, getPlayStyleUnlocks, getRankingIntegrity, getSeasonGoals, getTutorialSteps } from "../../src/advancedSystems.js";
import { ANALYST_TITLE_STEPS, getAnalystTitle } from "../../src/analystTitle.js";
import { ENDING_NAMES, getEndingPreview } from "../../src/runtimeSystems.js";
import { characterProfiles } from "../../src/gameDialogue.js";
import { nodes } from "../../src/gameData.js";
import { buildSceneBeat, getEcho } from "../../src/gameLogic.js";
import { farCallbacks, withFarCallback } from "../../src/farCallbacks.js";
import { getSceneBridge } from "../../src/viewModels/sceneBridge.js";
import { getRouteMarker } from "../../src/state/savedState.js";
import { describeBatchResult } from "../../src/state/useTelemetryQueue.js";
import { createTelemetrySummary } from "../../src/viewModels/appViewModels.js";
import { buildLeaderboard } from "../../src/ranking.js";
import { getAnalystName } from "../../src/endingCopy.js";
import { runtimeCardLabel } from "../../src/viewModels/sceneViewModels.js";

/**
 * The guard for the strings the 10-30 playtest found Korean on English and
 * Japanese pages (「돌다리 두들김형」 on the result card): every line those
 * modules print, made with a language's dictionary laid over the screen copy
 * the way a page in that language lays it (src/locales/overlay.js), and not
 * one letter of Hangul in any of them. The overlay writes over the tables in
 * place, so each language runs in its own test file (a process of its own).
 */
const HANGUL = /[가-힣ㄱ-ㅣ]/;

/** Every string in a value, deep, with its path. */
function strings(value, path = "", out = []) {
  if (typeof value === "string") out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((item, index) => strings(item, `${path}[${index}]`, out));
  else if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) strings(child, path ? `${path}.${key}` : key, out);
  return out;
}

/** Lays `lang` over every screen-copy module (src/copy/*.js) and the shell's tables, as the page does before its first paint. */
export async function layOver(lang) {
  const dictionary = await import(`../../src/locales/${lang}/index.js`);
  const copyDir = new URL("../../src/copy/", import.meta.url);
  const files = readdirSync(copyDir).filter((file) => file.endsWith(".js"));
  const tables = Object.fromEntries(await Promise.all(files.map(async (file) => [file.replace(/\.js$/, ""), (await import(new URL(file, copyDir).href)).default])));
  overlayModule(dictionary.copy, "screens", tables);
  overlayModule(dictionary.copy, "appCopy", appCopy);
  overlayModule(dictionary.copy, "playerLanguage", playerLanguage);
  overlayModule(dictionary.copy, "gameCases", gameCases);
  // The runtime's late words (src/locales/<lang>/late/<module>.js): the character profiles.
  const late = await import(`../../src/locales/${lang}/late/gameDialogue.js`);
  overlayModule({ gameDialogue: late.default }, "gameDialogue", { characterProfiles });
  return tables;
}

const summary = ({ windows = 4, busts = 0, pushes = 12, harm = 4, logic = { windows: 4, keeps: 3, breaks: 1, busts: 0, best: 3, heat: 8, switches: 1, top: ["inference", 3] } } = {}) => ({
  pushRecord: { pushes, busts, cashes: windows - busts },
  tableRecord: { windows, busts, locks: windows - busts },
  humanCost: harm,
  averageResponseTime: 8,
  burstScore: 71,
  rank: "A",
  logicRecord: logic,
});
const season = (shape, cases = 6) => Object.fromEntries(Array.from({ length: cases }, (_, index) => [`case${String(index + 1).padStart(2, "0")}`, summary(shape)]));

/** Every line the swept modules can print, by where it comes from. */
export function collectLines(tables) {
  const lines = [];
  const add = (where, value) => {
    for (const [path, text] of strings(value)) lines.push([path ? `${where}.${path}` : where, text]);
  };

  // The swept copy modules, whole.
  for (const name of ["habits", "judgment", "logicReport", "sceneRates", "seasonLines", "playReads", "introPanels", "music", "runLines", "farCallbacks"]) add(`copy/${name}`, tables[name]);
  add("copy/reportLines.endingProfiles", tables.reportLines.endingProfiles);

  // The 판단 습관, as the card and the report read them.
  for (const habit of JUDGEMENT_HABITS) add(`habit.${habit.id}`, { title: habit.title, line: habit.line });
  const results = season({});
  const habit = getJudgementHabit(results);
  assert.ok(habit, "the test season has a habit");
  add("getJudgementHabit", habit);
  // D1: the sentence the card says the name in, for every habit.
  for (const other of JUDGEMENT_HABITS) add(`habitCardLine.${other.id}`, habitCardLine(other));

  // The 판단 DNA: every motive family and mode, and the unrecorded aftermath.
  for (const trigger of ["affection", "revenge", "responsibility", "curiosity"]) add(`motive.${trigger}`, getThinkingMotive({ [trigger]: 5 }));
  add("motive.mixed", getThinkingMotive({}));
  const fingerprint = { ...getDecisionFingerprint({}), habit: { ...habit, card: habitCardLine(habit) } };
  add("fingerprint", { modeTitle: fingerprint.modeTitle, modeText: fingerprint.modeText, motive: fingerprint.motive });
  add("getCaseOutcome", getCaseOutcome({ caseId: "", choiceId: "" }));
  add("tradeoff", [{}, { capital: 4 }, { humanCost: 3 }, { capital: 4, humanCost: 3 }].map((effect) => explainResourceTradeoff(effect)));
  add("spine.question", [buildNarrativeSpine({ node: {} }).question, buildNarrativeSpine({ node: { title: "Title" } }).question]);
  add("speechifyChoice", speechifyChoice({ label: "Reframe the table and propose" }));

  // The result card and its shared line, on a second season with a week's rule.
  const endingName = getEndingPreview({ id: "open-oversight" }).label;
  const card = getSeasonCard({ secondSeason: { round: 2 }, pastEndingName: getEndingPreview({ id: "collapse" }).label, weekRuleLabel: "BLACKOUT WEEK" });
  const model = buildResultCardModel({ fingerprint, endingName, endingVariant: { label: "OPEN", title: "" }, caseResults: results, logicHold: 80, host: "example.org", ...card });
  add("resultCard", model);
  add("shareText", buildShareText(model, "https://example.org"));
  add("resultCard.noHabit", buildResultCardModel({ fingerprint: { ...fingerprint, habit: null }, endingName, caseResults: results }).modeTitle);

  // The closing report's 논리 유지력 panel and its rank lines.
  const cases = Array.from({ length: 6 }, (_, index) => ({ id: `case${String(index + 1).padStart(2, "0")}`, label: `CASE ${index + 1}`, title: "Title" }));
  add("logicReport", createLogicReport({ caseResults: results, cases, standing: { band: 10 } }));
  add("logicReport.tooFew", createLogicReport({ caseResults: season({}, 2), cases }));
  add("describeLogicCase", [
    describeLogicCase({ windows: 4, top: ["inference", 4] }),
    describeLogicCase({ windows: 4, top: ["inference", 3] }),
    describeLogicCase({ windows: 4, breaks: 2 }),
    describeLogicCase({ windows: 4, switches: 2 }),
    describeLogicCase({ windows: 4 }),
  ]);
  add("logicRank", [LOGIC_RANK_COPY.pending, LOGIC_RANK_COPY.band(25), LOGIC_REPORT_COPY.label, LOGIC_REPORT_COPY.caption]);

  // The other players' lines on a scene.
  add("sceneRates", [SCENE_CHOICE_COPY.line(47, false), SCENE_CHOICE_COPY.line(12, true), SCENE_TRACE_COPY.line(31)]);

  // NEW GAME+ and the 결말 도감.
  add("endingBook.first", getEndingBook({ seasons: 1 }));
  add("endingBook.verdicts", getEndingBook({ seasons: 3, endingsSeen: Object.keys(ENDING_NAMES) }));
  for (const verdict of ["ending_seal", "ending_reform", "ending_expose", "collapse", "open", null]) {
    add(`memoryLine.${verdict}`, getMemoryLine({ endingLabel: endingName, verdict }));
    add(`openingEcho.${verdict}`, getOpeningEcho(verdict));
  }
  add("openingEcho()", openingEcho());
  const last = { runId: "run-b", endingId: "open-oversight", endingLabel: endingName, tableRules: 2 };
  add("seasonComparison", [
    getSeasonComparison({ seasons: 2, last, previous: { ...last, runId: "run-a" } }, "run-b"),
    getSeasonComparison({ seasons: 2, last, previous: { ...last, runId: "run-a", tableRules: 1 } }, "run-b"),
    getSeasonComparison({ seasons: 2, last, previous: { ...last, runId: "run-a", endingId: "collapse", endingLabel: "X" } }, "run-b"),
  ]);
  add("caseEchoes", CASE_ECHOES);

  // What the table reads as it is played.
  for (const riskPressure of [0, 30, 60, 90]) add(`suspense.${riskPressure}`, getSuspenseState({ riskPressure, log: [] }));
  add("suspenseEvents", [
    getSuspenseEvent({ riskBefore: 60, riskAfter: 75 }),
    getSuspenseEvent({ riskBefore: 40, riskAfter: 55 }),
    getSuspenseEvent({ riskBefore: 40, riskAfter: 45, logLength: 4, currentCase: "case02" }),
  ]);

  // The report's framing of the finale's ruling.
  for (const choiceId of ["ending_seal", "ending_reform", "ending_expose", "toString"]) add(`endingProfile.${choiceId}`, createEndingProfile({ finalEndingEntry: { choiceId } }));

  // The start screen's panels.
  for (const style of ["instinct", "auditor", "mediator"]) for (const newGamePlus of [true, false]) add(`playStyle.${style}`, getPlayStyleUnlocks(style, newGamePlus));
  add("tutorial", getTutorialSteps());
  add("seasonGoals", getSeasonGoals());
  add("pastRunMemory", getPastRunMemory({ case03: { outcomeChoiceId: "x" } }));
  add("integrity", [getRankingIntegrity({ runId: "r", completedAt: 1, summary: { rank: "A" } }), getRankingIntegrity({})]);
  for (const step of ANALYST_TITLE_STEPS) add(`analystTitle.${step.id}`, step.title);
  add("analystTitle.finished", getAnalystTitle({ finishedSeason: true }));
  return lines;
}

/**
 * The second pass (10-30 playtest, #393): what the runtime writes as a run is
 * played. `speakers` is the dictionary's names, as the scenes of that
 * language carry them (`speakerName`, src/locales/overlay.js).
 */
export function collectRunLines(speakers) {
  const lines = [];
  const add = (where, value) => {
    for (const [path, text] of strings(value)) lines.push([path ? `${where}.${path}` : where, text]);
  };
  // The report's scene beat, for every speaker the season profiles and one it does not.
  const card = { label: "Reframe the table and propose" };
  for (const name of Object.keys(characterProfiles)) {
    add(`sceneBeat.${name}`, buildSceneBeat({ speaker: name, speakerName: speakers[name] ?? "Someone" }, card, { trust: 3 }));
  }
  add("sceneBeat.stock", [buildSceneBeat({ speakerName: "Someone" }, card, { humanCost: 4 }), buildSceneBeat({}, card, {})]);
  add("getEcho.reframe", getEcho("reframe"));
  // The line above the briefing and under a case's first scene.
  add("sceneBridge", [
    getSceneBridge({ log: [{ echo: "Echo." }] }),
    getSceneBridge({ caseResults: { case01: { outcomeChoiceId: "x" } }, currentCase: "case02" }),
  ]);
  for (const entry of [{ routeChangeKind: "memory" }, { routeChangeKind: "evidence-turn" }, { routeChangeKind: "reframe" }, { nodeId: "x_aftershock" }, { nodeId: "x_reaction" }, {}]) add("routeMarker", getRouteMarker(entry).label);
  // The runtime's own cards.
  add("runtimeCards", [runtimeCardLabel("adaptive").label, runtimeCardLabel("relationship").label]);
  // The storage lines.
  for (const isOnline of [true, false]) for (const telemetryEnabled of [true, false]) for (const dataConsent of [true, false]) add("telemetrySummary", createTelemetrySummary({ dataConsent, isOnline, telemetryEnabled }));
  add("batchResult", [
    describeBatchResult({ queueCommitted: false, left: 0 }),
    describeBatchResult({ queueCommitted: true, left: 0 }),
    describeBatchResult({ queueCommitted: true, left: 2, refused: 1, unranked: 1, beatTable: 1 }),
  ]);
  // The default name, shown and kept apart.
  add("analystName", [getAnalystName("분석관"), getAnalystName("")]);
  const summary = { burstScore: 50, rank: "B", triggers: {}, cognition: {} };
  add("leaderboard.names", buildLeaderboard([
    { local: true, player_name: "분석관", case_id: "case01", summary },
    { local: true, player_name: "현재 분석관", case_id: "case02", summary },
  ]).map((row) => [row.name, row.headline]));
  return lines;
}

/**
 * The far callbacks on a language's scenes: each anchor is in its scene's
 * text once, and every line and the fallback land right after it.
 */
export async function assertFarCallbacksLand(lang) {
  for (const [nodeId, callback] of Object.entries(farCallbacks)) {
    const caseId = nodes[nodeId].caseId;
    const text = (await import(`../../src/locales/${lang}/nodes/${caseId}.js`)).default.nodes[nodeId].text;
    assert.equal(text.split(callback.after).length - 1, 1, `${lang} ${nodeId}: "${callback.after}" once in the scene`);
    for (const line of [...Object.values(callback.lines), callback.fallback]) assert.ok(!HANGUL.test(line), `${lang} ${nodeId}: ${line}`);
    const read = withFarCallback(nodeId, { text }, {});
    assert.ok(read.text.includes(`${callback.after} ${callback.fallback}`), `${lang} ${nodeId}: the fallback follows the anchor`);
  }
}

/** Fails on any line with Hangul in it, naming each. */
export function assertNoHangul(lines, lang, least = 150) {
  const korean = lines.filter(([, text]) => HANGUL.test(text));
  assert.deepEqual(korean, [], `${lang}: these lines are still Korean`);
  assert.ok(lines.length > least, `${lang}: the sweep read ${lines.length} lines`);
}
