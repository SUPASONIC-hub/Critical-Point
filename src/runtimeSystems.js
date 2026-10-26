/**
 * What a run and its report read about the analyst, the ending and the
 * record: the half of advancedSystems.js the screen before a run never calls.
 * It is a module of its own so that it loads with the runtime and not with the
 * first paint, so nothing the entry chunk imports may import it.
 */
import { getOperatorProfile } from "./advancedSystems.js";
import { caseDisplayCode } from "./gameCases.js";
import { ENDING_GATES } from "./gameConstants.js";
import { directionParticle, easyResourceLabels, objectParticle, subjectParticle } from "./playerLanguage.js";
import seasonEndCopy from "./copy/seasonEnd.js";
import { fill } from "./locale.js";

// The words are src/copy/seasonEnd.js's (another language is laid over them
// there); the tables below read them as the runtime loads, after the page's
// language is in.
const W = seasonEndCopy;

const HARM = easyResourceLabels.humanCost;
const percent = (share) => Math.round(share * 100);

export function getAuthorityProfile(origin = "courier", level = "OBSERVER") {
  const profile = getOperatorProfile(origin);
  // What each level may do (src/copy/seasonEnd.js `authority.permissions`).
  const levelPermissions = W.authority.permissions;
  return {
    ...profile,
    level,
    permissions: levelPermissions[level] ?? levelPermissions.OBSERVER,
  };
}

const endingScenes = {
  "open-oversight": { location: "OBSERVATORY / OPEN FLOOR", image: "/ending-oversight-room.webp", ...W.scenes["open-oversight"] },
  "evidence-reform": { location: "TRIGGER LAB / PUBLIC AUDIT", image: "/ending-final-archive.webp", ...W.scenes["evidence-reform"] },
  "human-record": { location: "FIELD OFFICE / WITNESS ROOM", image: "/scene-case05.webp", ...W.scenes["human-record"] },
  "profitable-silence": { location: "BOARDROOM / SEALED WINDOW", image: "/scene-case04.webp", ...W.scenes["profitable-silence"] },
  "cold-justice": { location: "POLICY ROOM / EMPTY CHAIR", image: "/scene-case03.webp", ...W.scenes["cold-justice"] },
  "field-pact": { location: "DELIVERY HUB / NIGHT SHIFT", image: "/scene-case01.webp", ...W.scenes["field-pact"] },
  "quiet-cover": { location: "ARCHIVE / LOW LIGHT", image: "/scene-case02.webp", ...W.scenes["quiet-cover"] },
  collapse: { location: "SYSTEM CORE / REDLINE", image: "/ending-system-collapse.webp", ...W.scenes["collapse"] },
  "open-question": { location: "TRANSFER HALL / NEXT SHIFT", image: "/ending-final-archive.webp", ...W.scenes["open-question"] },
};

export function getEndingSceneProfile(endingId = "open-question") {
  return endingScenes[endingId] ?? endingScenes["open-question"];
}

// `visible` used to be worked out from `entry.continuitySource`, a field no
// commit has ever written, so it was false for every entry and read by nothing.
export function getDelayedConsequences(caseResults = {}) {
  return Object.entries(caseResults)
    .filter(([, result]) => result?.outcomeChoiceId)
    .map(([caseId, result]) => ({
      caseId,
      source: result.outcomeChoiceId,
      // The outcome id is a key, not copy: it used to print as `c1_after_people`.
      text: fill(W.delayed, { code: caseDisplayCode(caseId) }),
    }));
}

/**
 * What would have kept the season standing, quoted from the gate that closed
 * it (`ENDING_GATES`). It promised "risk pressure under 60, human cost under
 * 50, three clues" -- none of which the collapse gate has ever read.
 */
export function getFailureObjectives(variant = {}) {
  if (!variant.failure) return [];
  const { collapseHarmPerCase, collapseBustRate, collapseOverreachHarm } = ENDING_GATES;
  return [
    fill(W.failureObjectives.harm, { harm: HARM, particle: objectParticle(HARM), gate: collapseHarmPerCase }),
    fill(W.failureObjectives.overreach, { bust: percent(collapseBustRate), harm: HARM, particle: objectParticle(HARM), gate: collapseOverreachHarm }),
  ];
}

export function getRankingComparison(summary = {}) {
  return [
    { label: "EVIDENCE", value: Math.min(100, (summary.challengeClearCount ?? 0) * 20) },
    // What is left after the 즉답 패널티. It was labelled PEOPLE, which it does not measure.
    { label: "PATIENCE", value: Math.min(100, Math.max(0, 100 - (summary.exploitPenalty ?? 0) * 8)) },
    { label: "RHYTHM", value: Math.min(100, summary.rhythmScore ?? 0) },
  ];
}

/** What each ending is called in a sentence. An ending's id is a key, never copy. */
export const ENDING_NAMES = W.names;

export function getEndingPreview(ending = {}) {
  if (!ending?.id) return null;
  return {
    label: ENDING_NAMES[ending.id] ?? W.preview.unnamed,
    text: ending.failure ? W.preview.failure : W.preview.building,
  };
}

export function getEndingVisualClass(endingId = "open-question") {
  return `ending-visual-${String(endingId).replace(/[^a-z0-9-]/gi, "-")}`;
}

// `label` is what the report prints: the card as the player read it. The
// choice id is a key, and it used to be the text ("p1_start_a 60%").
export function getBalanceSignals(log = []) {
  const choices = log.filter((entry) => !entry?.isSystemEvent);
  const labelOf = (choiceId) => choices.find((entry) => entry.choiceId === choiceId)?.choice || W.unnamedChoice;
  const counts = choices.reduce((map, entry) => {
    map[entry.choiceId] = (map[entry.choiceId] ?? 0) + 1;
    return map;
  }, {});
  const total = choices.length || 1;
  return Object.entries(counts)
    .filter(([, count]) => count / total >= 0.6)
    .map(([choiceId, count]) => ({ choiceId, label: labelOf(choiceId), share: Math.round((count / total) * 100), count, signal: "CHOICE DOMINANCE" }));
}

/**
 * Why the season collapsed, from the door it came through (`variant.cause`,
 * set by `getEndingVariant`, which the report always computes fresh). It used
 * to guess from the last case's resources and blame 판단 피로 or the clock.
 */
export function getFailureCause(variant = {}) {
  if (!variant?.failure) return null;
  const { id = "harm", harmPerCase = 0, bustRate = 0 } = variant.cause ?? {};
  const words = W.failureCause;
  const harm = fill(words.harm, { harm: HARM, particle: subjectParticle(HARM), perCase: harmPerCase, direction: directionParticle(String(harmPerCase)) });
  return id === "overreach"
    ? { id, value: percent(bustRate), text: fill(words.overreach, { bust: percent(bustRate), harmLine: harm }), recovery: words.overreachRecovery }
    : { id: "human-cost", value: harmPerCase, text: harm, recovery: fill(words.harmRecovery, { harm: HARM, particle: objectParticle(HARM) }) };
}

export function getEndingAtmosphere(endingId = "open-question") {
  const atmospheres = {
    "open-oversight": { palette: "lime", motion: "expanding", sound: "wide-harmonics" },
    "evidence-reform": { palette: "mint", motion: "layered", sound: "measured-pulse" },
    "human-record": { palette: "warm", motion: "close-focus", sound: "voice-memory" },
    collapse: { palette: "redline", motion: "fractured", sound: "low-impact" },
  };
  return atmospheres[endingId] ?? { palette: "archive", motion: "slow-pan", sound: "quiet-motif" };
}

export function getPlayReport(summary = {}, log = []) {
  const entries = log.filter((entry) => !entry?.isSystemEvent);
  return {
    decisions: entries.length,
    clues: summary.challengeClearCount ?? 0,
    dominantStyle: summary.reframeCount > summary.challengeClearCount ? "BOARD BREAKER" : summary.pressureAdaptScore >= summary.reflectionScore ? "RISK CUTTER" : "SYSTEM THINKER",
    // The scenes passed, by title. It listed choice ids ("p1_start_a → ...").
    route: entries.map((entry) => entry.title).filter(Boolean).slice(-8),
  };
}

export function getTelemetryDashboardSnapshot({ errors = [], pending = [], rankings = [], caseResults = {} } = {}) {
  return {
    errors: errors.length,
    pending: pending.length,
    runs: new Set(rankings.map((row) => row.run_id).filter(Boolean)).size,
    completed: Object.keys(caseResults).length,
    lastError: errors.at(-1)?.error?.message ?? errors.at(-1)?.error_message ?? "none",
  };
}

export function getAuthorityReview(origin = {}, level = "OBSERVER", result = {}) {
  return {
    title: `${origin.title ?? W.authority.analyst} / AUTHORITY REVIEW`,
    text: level === "OVERSIGHT"
      ? W.authority.oversight
      : fill(W.authority.level, { level, count: result.challengeClearCount ?? 0 }),
    next: level === "OBSERVER" ? W.authority.nextObserver : level === "FIELD ACCESS" ? W.authority.nextField : W.authority.nextOversight,
  };
}

export function getOriginEndingVariant(origin = "courier", endingId = "open-question") {
  const labels = W.origins;
  const ending = ENDING_NAMES[endingId] ?? ENDING_NAMES["open-question"];
  return { label: labels[origin] ?? labels.courier, text: fill(W.originEnding, { origin: labels[origin] ?? labels.courier, ending }) };
}

// Both of these printed their keys: "courier 출신 분석관의 선택 이후, open-question 경로는".
export function getAftermath(endingId = "open-question", origin = "courier") {
  const ending = ENDING_NAMES[endingId] ?? ENDING_NAMES["open-question"];
  return { title: "AFTERMATH / NEXT SHIFT", text: fill(W.aftermath, { operator: getOperatorProfile(origin).title, ending }) };
}

export function getReplayDiagnostics({ runId = "", caseId = "", nodeId = "", choiceId = "", pending = 0 } = {}) {
  return { runId, scene: `${caseId}/${nodeId}`, choiceId, pending, text: `${caseId}/${nodeId}에서 ${choiceId || "선택 없음"} 처리 후 대기 큐 ${pending}건` };
}
