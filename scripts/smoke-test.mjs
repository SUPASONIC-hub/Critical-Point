import assert from "node:assert/strict";

import {
  anonymizeSensitiveText,
  applyEffect,
  applySeededEffectVariation,
  createDecisionForecast,
  createCaseSummary,
  getCounterfactualReport,
  getDecisionFingerprint,
  getDecisionLedger,
  getDiscoveryClue,
  getCaseOutcome,
  getOutcomeCarryover,
  getContinuityChallenge,
  detectPrivacySignals,
  getGameplayStats,
  getAllDiscoveryClueIds,
  getObservationLedger,
  getRiskPressure,
  getRiskPressureDrivers,
  buildNarrativeSpine,
  getSuspenseEvent,
  getSuspenseState,
  limitText,
  speechifyChoice,
} from "../src/gameLogic.js";
import {
  appendStoredErrorLog,
  appendSaveSlot,
  ERROR_LOG_MAX_ITEMS,
  ERROR_LOG_STORAGE_KEY,
  FEEDBACK_COMMENT_MAX_LENGTH,
  PLAYER_NAME_MAX_LENGTH,
  copyText,
  FREE_TEXT_MAX_LENGTH,
  isSavedStateShapeValid,
  normalizeFeedback,
  normalizePlayerName,
  normalizeSavedText,
  parseSavedState,
  parseRecoverySlots,
  readStoredValue,
  RECOVERY_SLOT_SCHEMA_VERSION,
  removeStoredValue,
  SAVE_SCHEMA_VERSION,
  SAVE_STATE_KEYS,
  SAVE_SLOT_MAX_ITEMS,
  SAVE_SLOT_STORAGE_KEY,
  serializeError,
  STORAGE_KEY,
  TELEMETRY_QUEUE_TYPES,
  writeStoredValue,
  createSafeErrorContext,
  createRecoverySnapshot,
  restoreRecoverySnapshot,
  parseCurrentSavedState,
  migrateSavedState,
} from "../src/appConfig.js";
import {
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseOpeningRoutes,
  getCaseBranchNodes,
  getCaseRouteLength,
  getNodeRouteIndex,
  initialResources,
  nodeOrders,
  nodes,
  choiceVoiceLines,
  echoReplies,
  triggerLabels,
} from "../src/gameData.js";
import { buildLeaderboard, getLeaderboardHeadline } from "../src/ranking.js";
import { easyResourceLabels, simplifyPlayerText } from "../src/playerLanguage.js";

assert.equal(STORAGE_KEY, "trigger-prototype-v2", "storage key should stay on the v2 namespace");
assert.equal(ERROR_LOG_STORAGE_KEY, "trigger-prototype-error-log-v1", "error logs should use a separate storage namespace");
assert.equal(SAVE_SCHEMA_VERSION, 2, "save schema version should match exported log format");
assert.equal(RECOVERY_SLOT_SCHEMA_VERSION, 1, "recovery slots should keep their own schema version");
assert.equal(ERROR_LOG_MAX_ITEMS, 20, "local error logs should be bounded");
assert.equal(SAVE_SLOT_STORAGE_KEY, "trigger-prototype-save-slots-v1", "save recovery slots should use a separate namespace");
assert.equal(SAVE_SLOT_MAX_ITEMS, 5, "save recovery slots should keep a bounded history");
assert.deepEqual(TELEMETRY_QUEUE_TYPES, ["case", "feedback", "error"], "pending telemetry should only accept supported queue types");
assert.deepEqual(
  SAVE_STATE_KEYS,
  [
    "saveSchemaVersion",
    "playerName",
    "playStyle",
    "openingLegacy",
    "dataConsent",
    "started",
    "currentCase",
    "completedCases",
    "discoveredClues",
    "caseResults",
    "playtestFeedback",
    "nodeId",
    "resources",
    "log",
    "triggers",
    "cognition",
    "freeText",
    "echo",
    "nodeEnteredAt",
    "pendingTelemetry",
    "protocolUsed",
    "timerPenaltyApplied",
    "probeUsed",
    "paused",
    "savedAt",
  ],
  "save state keys should include every required persisted field",
);
["completedCases", "discoveredClues", "log", "pendingTelemetry", "caseResults", "playtestFeedback", "resources", "triggers", "cognition", "currentCase", "nodeId"].forEach((key) => {
  assert.ok(SAVE_STATE_KEYS.includes(key), `save state keys should cover shape validator key ${key}`);
});
assert.equal(FREE_TEXT_MAX_LENGTH, 600, "free text should keep a bounded log length");
assert.equal(FEEDBACK_COMMENT_MAX_LENGTH, 600, "feedback comments should keep a bounded log length");
assert.equal(PLAYER_NAME_MAX_LENGTH, 24, "player names should keep a bounded display length");
assert.equal(normalizePlayerName("  analyst "), "analyst", "player names should be trimmed when restored");
assert.equal(normalizePlayerName({}), "", "invalid saved player names should be ignored");
assert.equal(normalizeSavedText("abcdef", 3), "abc", "saved text should keep the configured limit");
assert.equal(normalizeSavedText(null, 3), "", "invalid saved text should be ignored");
assert.deepEqual(
  normalizeFeedback({ clarity: 5, comment: "x".repeat(700) }),
  { clarity: "", difficulty: "", comment: "x".repeat(FEEDBACK_COMMENT_MAX_LENGTH), savedAt: "" },
  "feedback restores only bounded text fields",
);
assert.deepEqual(
  parseSavedState(JSON.stringify({ saveSchemaVersion: SAVE_SCHEMA_VERSION, started: false }), SAVE_SCHEMA_VERSION),
  { saveSchemaVersion: SAVE_SCHEMA_VERSION, started: false },
  "matching save schemas should be restored",
);
assert.deepEqual(
  migrateSavedState({ saveSchemaVersion: 1, currentCase: "case01", nodeId: "start", completedCases: [], log: [] }),
  {
    saveSchemaVersion: 2,
    currentCase: "case01",
    nodeId: "start",
    completedCases: [],
    log: [],
    discoveredClues: [],
    pendingTelemetry: [],
    caseResults: {},
    playtestFeedback: {},
    protocolUsed: false,
    timerPenaltyApplied: false,
    probeUsed: false,
  },
  "v1 saves should migrate into the current schema",
);
assert.equal(
  parseCurrentSavedState(JSON.stringify({ saveSchemaVersion: 9 }), SAVE_SCHEMA_VERSION),
  null,
  "future save schemas should not be restored",
);
assert.equal(parseSavedState('{"saveSchemaVersion":1}', SAVE_SCHEMA_VERSION), null, "old save schemas should be ignored");
assert.equal(parseSavedState("not-json", SAVE_SCHEMA_VERSION), null, "corrupt saves should be ignored");
assert.equal(
  parseRecoverySlots(JSON.stringify({ recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION, slots: [] }))?.slots.length,
  0,
  "matching recovery slot schemas should be restored",
);
assert.equal(parseRecoverySlots(JSON.stringify({ saveSchemaVersion: 1, slots: [] })), null, "save schemas should not parse as recovery slots");
assert.equal(
  parseRecoverySlots(JSON.stringify({ recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION, slots: {} })),
  null,
  "recovery slot saves should require a slot array",
);
assert.deepEqual(
  parseRecoverySlots(
    JSON.stringify({
      recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION,
      slots: [
        {
          id: "valid-slot",
          savedAt: "now",
          currentCase: "case05",
          nodeId: "c5_voice",
          completedCases: ["case01"],
          snapshot: {
            saveSchemaVersion: SAVE_SCHEMA_VERSION,
            currentCase: "case05",
            nodeId: "c5_voice",
            completedCases: ["case01"],
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
        { id: "", savedAt: "now", currentCase: "case05", nodeId: "c5_voice", snapshot: null },
      ],
    }),
  )?.slots.map((slot) => slot.id),
  ["valid-slot"],
  "recovery slot parsing should filter malformed slots",
);
assert.equal(
  isSavedStateShapeValid({
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
  true,
  "valid save shapes should be restorable",
);
assert.equal(
  isSavedStateShapeValid({
    currentCase: "case01",
    nodeId: "start",
    completedCases: [],
    discoveredClues: [],
    log: [],
    pendingTelemetry: [{ id: "case-1", type: "case", label: "케이스 로그", payload: { case_id: "case01" } }],
    caseResults: {},
    playtestFeedback: {},
    resources: {},
    triggers: {},
    cognition: {},
  }),
  true,
  "valid pending telemetry items should be restorable",
);
assert.equal(
  isSavedStateShapeValid({
    currentCase: "case05",
    nodeId: "c5_voice",
    completedCases: [],
    discoveredClues: [],
    log: [],
    pendingTelemetry: [{ id: "error-1", type: "error", label: "에러 로그", payload: { current_case: "case05" } }],
    caseResults: {},
    playtestFeedback: {},
    resources: {},
    triggers: {},
    cognition: {},
  }),
  true,
  "error telemetry items should be restorable in the retry queue",
);
assert.equal(
  isSavedStateShapeValid({ currentCase: "case01", nodeId: "start", completedCases: {} }),
  false,
  "invalid save shapes should be ignored",
);
assert.equal(
  isSavedStateShapeValid({
    currentCase: "case01",
    nodeId: "start",
    completedCases: [],
    discoveredClues: [],
    log: [],
    pendingTelemetry: [null],
    caseResults: {},
    playtestFeedback: {},
    resources: {},
    triggers: {},
    cognition: {},
  }),
  false,
  "corrupt pending telemetry items should be ignored",
);
assert.equal(
  isSavedStateShapeValid({
    currentCase: "case01",
    nodeId: "start",
    completedCases: [],
    discoveredClues: [],
    log: [],
    pendingTelemetry: [{ id: "unknown-1", type: "unknown", label: "잘못된 큐", payload: {} }],
    caseResults: {},
    playtestFeedback: {},
    resources: {},
    triggers: {},
    cognition: {},
  }),
  false,
  "unknown pending telemetry item types should be ignored",
);
assert.equal(readStoredValue("missing-key", "fallback"), "fallback", "storage reads should degrade gracefully");
assert.equal(writeStoredValue("test-key", "value"), false, "storage writes should report unavailable browser storage");
assert.equal(removeStoredValue("test-key"), false, "storage removals should report unavailable browser storage");
assert.equal(serializeError(new Error("boom")).message, "boom", "errors should serialize for recovery logs");
assert.equal(serializeError("plain failure").message, "plain failure", "string errors should serialize for recovery logs");
const safeErrorContext = createSafeErrorContext(
  {
    currentCase: "case05",
    nodeId: "c5_voice",
    started: true,
    completedCases: ["case01"],
    freeText: "민감한 자유입력",
    log: [{ nodeId: "c5_voice", choiceId: "choice-1", freeText: "민감한 로그 전문", spokenChoice: "전체 문장" }],
  },
  "react-render",
);
assert.deepEqual(
  safeErrorContext,
  {
    source: "react-render",
    currentCase: "case05",
    nodeId: "c5_voice",
    started: true,
    completedCases: ["case01"],
    logLength: 1,
    lastChoiceId: "choice-1",
    lastNodeId: "c5_voice",
  },
  "error contexts should keep reproduction metadata without free text or full choice text",
);
assert.equal("freeText" in safeErrorContext, false, "error contexts must not include free text");
assert.equal(
  appendStoredErrorLog({ id: "error-test", occurredAt: "now", error: { message: "boom" }, context: {} }),
  false,
  "error log writes should degrade gracefully without browser storage",
);
assert.equal(
  appendSaveSlot({ currentCase: "case05", nodeId: "c5_voice", savedAt: "now", completedCases: [] }),
  false,
  "save slot writes should degrade gracefully without browser storage",
);
const recoverySnapshot = createRecoverySnapshot({
  saveSchemaVersion: SAVE_SCHEMA_VERSION,
  playerName: "Analyst",
  currentCase: "case05",
  nodeId: "c5_voice",
  completedCases: ["case01"],
  discoveredClues: [],
  pendingTelemetry: [{ id: "pending", type: "case", label: "pending", payload: {} }],
  caseResults: {},
  playtestFeedback: { case05: { clarity: "5", difficulty: "3", comment: "private feedback", savedAt: "now" } },
  resources: {},
  triggers: {},
  cognition: {},
  freeText: "private free text",
  log: Array.from({ length: 24 }, (_, index) => ({
    nodeId: `node-${index}`,
    choiceId: `choice-${index}`,
    freeText: "private log text",
    spokenChoice: "private spoken text",
    sceneBeat: "private scene beat",
  })),
});
assert.equal("freeText" in recoverySnapshot, false, "recovery snapshots should not duplicate free text");
assert.equal("freeText" in recoverySnapshot.log.at(-1), false, "recovery snapshot log entries should not keep free text");
assert.equal("spokenChoice" in recoverySnapshot.log.at(-1), false, "recovery snapshot log entries should not keep spoken text");
assert.equal("sceneBeat" in recoverySnapshot.log.at(-1), false, "recovery snapshot log entries should not keep scene beats");
assert.equal(recoverySnapshot.pendingTelemetry.length, 0, "recovery snapshots should not duplicate telemetry queues");
assert.deepEqual(recoverySnapshot.playtestFeedback, {}, "recovery snapshots should not duplicate playtest feedback");
assert.equal(recoverySnapshot.log.length, 20, "recovery snapshots should keep only a bounded log tail");
const restoredRecoverySnapshot = restoreRecoverySnapshot(recoverySnapshot);
assert.equal(restoredRecoverySnapshot.saveSchemaVersion, SAVE_SCHEMA_VERSION, "recovery snapshots should restore to current save schema");
assert.equal(restoredRecoverySnapshot.freeText, "", "recovered saves should use empty free text");
assert.equal("recoverySlotSchemaVersion" in restoredRecoverySnapshot, false, "recovered saves should not keep recovery slot schema metadata");
assert.equal(await copyText("test"), false, "clipboard fallback should fail safely without a browser");
assert.equal(easyResourceLabels.capital, "현금", "player language should use an intuitive resource label");
assert.equal(
  simplifyPlayerText("CASE 02 / LEGITIMACY / HIDDEN PROTOCOL"),
  "CASE 02 / 공정함 / 숨은 긴급 절차",
  "player language should translate visible system terms",
);
assert.ok(nodes.c1_aftershock?.choices?.length === 3, "case 01 should include a post-decision branch scene");
assert.ok(nodes.f_aftershock?.choices?.length === 3, "the final act should include a final branch scene");
assert.equal(nodeOrders.case01.at(-1), "c1_aftershock", "case 01 order should include its aftermath scene");
assert.equal(nodeOrders.final.at(-1), "f_aftershock", "the final order should include its aftermath scene");
assert.ok(nodes.c1_witness && nodes.c1_verdict, "case 01 should include connective witness and verdict scenes");
assert.ok(nodes.c2_trace && nodes.c3_signal && nodes.c4_public && nodes.c5_voice, "every middle case should include a new evidence scene");
assert.equal(nodeOrders.case01.length, 17, "case 01 should include its authored detour scenes");
assert.equal(nodeOrders.final.length, 14, "the final act should include its authored detour scenes");
assert.ok(nodes.c1_witness_reaction && nodes.c2_trace_reaction && nodes.c3_signal_reaction, "early cases should include reaction scenes");
assert.ok(nodes.c4_public_reaction && nodes.c5_voice_reaction && nodes.f_dilemma_reaction, "late cases should include reaction scenes");
assert.ok(nodeOrders.case01.length > 14, "case 01 should include a second layer of reaction scenes");
assert.ok(nodeOrders.final.length > 8, "the final act should include a second layer of reaction scenes");
assert.equal(
  getDiscoveryClue({ currentCase: "case01", challengeMatch: true, riskDelta: 4, responseTimeSec: 20, logLength: 1 }).id,
  "c1-hidden-ledger",
  "a risky successful choice should reveal a case clue",
);
assert.equal(
  getDiscoveryClue({ currentCase: "case01", challengeMatch: false, riskDelta: 8, responseTimeSec: 20, logLength: 1 }),
  null,
  "a risky choice without a challenge should not reveal a clue",
);
assert.equal(
  getCaseOutcome({ caseId: "case04", choiceId: "c4_after_service" }).tag,
  "서비스를 지킨 결말",
  "case outcomes should reflect the selected aftermath branch",
);
assert.equal(caseOpeningRoutes.case02.c1_after_people, "c2_start_people", "case 02 should have a people-led opening route");
assert.equal(caseOpeningRoutes.final.c5_after_system, "f_start_system", "the final act should have a system-led opening route");
assert.equal(nodes.c4_start_proof.phase, "BRANCH BRIEFING", "branch openings should be real playable nodes");
assert.equal(getOutcomeCarryover({ caseId: "case01", choiceId: "c1_after_people" }).trust, 6, "outcome effects should carry into the next case");
assert.equal(getContinuityChallenge({ caseId: "case02", choiceId: "c1_after_people" }).id, "protect-trust", "outcome branches should create a custom next-case challenge");
assert.equal(Object.values(caseOpeningRoutes.case02).length, 3, "all case 02 opening branches should be addressable");
assert.equal(triggerLabels.system, "시스템", "case 05 roadmap labels should have a trigger translation");
assert.equal(triggerLabels.helplessness, "무력감", "case 05 roadmap labels should cover helplessness");
assert.equal(triggerLabels.selfAwareness, "자기 인식", "final roadmap labels should cover self awareness");

const resultNodeIds = new Set(Object.values(CASE_RESULT_NODES));
const nodeIdsInOrders = new Set(Object.values(nodeOrders).flat());
Object.entries(nodes).forEach(([nodeId, node]) => {
  assert.ok(nodeIdsInOrders.has(nodeId), `${nodeId} should be present in a case order`);
  assert.ok(Array.isArray(node.choices) && node.choices.length > 0, `${nodeId} should expose playable choices`);
  node.choices.forEach((choice) => {
    assert.ok(choice.next, `${nodeId}/${choice.id} should have a next route`);
    assert.ok(nodes[choice.next] || resultNodeIds.has(choice.next), `${nodeId}/${choice.id} should route to an existing node or result`);
  });
  (node.triggers ?? []).forEach((trigger) => {
    assert.ok(triggerLabels[trigger], `${nodeId} trigger ${trigger} should have a display label`);
  });
});

Object.entries(nodes).forEach(([nodeId, node]) => {
  [node.title, node.text, ...(node.memo ?? [])].forEach((copy) => {
    assert.equal(simplifyPlayerText(copy), copy, `${nodeId}: authored copy must not be rewritten by player language`);
  });
  node.choices.forEach((choice) => {
    assert.equal(simplifyPlayerText(choice.label), choice.label, `${nodeId}/${choice.id}: authored choice must not be rewritten`);
  });
});

const authoredGeneratedScenes = Object.values(nodes).filter(
  (node) => node.phase === "CONNECTIVE SCENE" || node.phase === "REACTION",
);
let generatedChoiceCount = 0;
authoredGeneratedScenes.forEach((node) => {
  const effectSignatures = new Set();
  node.choices.forEach((choice) => {
    generatedChoiceCount += 1;
    assert.ok(choiceVoiceLines[choice.id], `${choice.id} should have authored voice copy`);
    assert.ok(echoReplies[choice.id], `${choice.id} should have authored echo copy`);
    const signature = JSON.stringify(choice.effect ?? {});
    assert.ok(!effectSignatures.has(signature), `${node.title}/${choice.id} should have a distinct effect`);
    effectSignatures.add(signature);
  });
});
assert.equal(generatedChoiceCount, 108, "36 generated scenes should expose 108 authored choices");

const fixedChoiceFallbacks = CASE_SEQUENCE.flatMap((caseId) =>
  [...new Set(nodeOrders[caseId])].flatMap((nodeId) =>
    nodes[nodeId].choices
      .filter((choice) => choice.type !== "free")
      .filter((choice) => !choiceVoiceLines[choice.id] || !echoReplies[choice.id])
      .map((choice) => `${nodeId}/${choice.id}`),
  ),
);
assert.ok(
  fixedChoiceFallbacks.length <= 20,
  `at most 20 fixed choices may fall back to default copy, found ${fixedChoiceFallbacks.length}: ${fixedChoiceFallbacks.join(", ")}`,
);

function simulateCaseRoute(caseId, startNodeId = CASE_START_NODES[caseId], choiceIndex = 0) {
  const visited = [];
  let cursor = startNodeId;
  for (let step = 0; step < 80; step += 1) {
    if (cursor === CASE_RESULT_NODES[caseId]) return visited;
    const node = nodes[cursor];
    assert.ok(node, `${caseId} route reached missing node ${cursor}`);
    const playableChoices = node.choices.filter((choice) => choice.type !== "free");
    assert.ok(playableChoices.length > 0, `${cursor} should have fixed choices for automated route simulation`);
    const choice = playableChoices[Math.min(choiceIndex, playableChoices.length - 1)];
    visited.push({ nodeId: cursor, choiceId: choice.id, next: choice.next });
    cursor = choice.next;
  }
  assert.fail(`${caseId} route did not reach ${caseResultNodeIds[caseId]}`);
}

function simulateCaseRouteAfterFirstChoice(caseId, startNodeId, firstChoiceIndex) {
  const firstNode = nodes[startNodeId];
  assert.ok(firstNode, `${caseId} first-choice simulation reached missing node ${startNodeId}`);
  const firstChoice = firstNode.choices[firstChoiceIndex];
  assert.ok(firstChoice, `${caseId}/${startNodeId} should expose choice ${firstChoiceIndex}`);
  const visited = [{ nodeId: startNodeId, choiceId: firstChoice.id, next: firstChoice.next }];
  if (firstChoice.next === CASE_RESULT_NODES[caseId]) return visited;
  return [
    ...visited,
    ...simulateCaseRoute(caseId, firstChoice.next, 0),
  ];
}

assert.deepEqual(Object.keys(CASE_START_NODES), CASE_SEQUENCE, "case start nodes should cover the complete sequence");
assert.deepEqual(Object.keys(CASE_RESULT_NODES), CASE_SEQUENCE, "case result nodes should cover the complete sequence");
assert.deepEqual(Object.keys(nodeOrders), CASE_SEQUENCE, "node orders should cover the complete sequence");
for (const caseId of CASE_SEQUENCE) {
  const branchingNodes = [...new Set(nodeOrders[caseId])].filter((nodeId) => {
    const nextIds = new Set(nodes[nodeId].choices.map((choice) => choice.next));
    return nextIds.size > 1;
  });
  assert.equal(branchingNodes.length, 1, `${caseId} should have exactly one authored mid-case branch`);
}
for (const caseId of CASE_SEQUENCE) {
  for (const choiceIndex of [0, 1, 2]) {
    const route = simulateCaseRoute(caseId, CASE_START_NODES[caseId], choiceIndex);
    assert.ok(route.length > 0, `${caseId} simulated route should contain decisions`);
    assert.equal(route.at(-1).next, CASE_RESULT_NODES[caseId], `${caseId} should end at its result screen`);
  }
}
assert.equal(getNodeRouteIndex("case02", "c2_start_people"), 0, "branch openings should share the first route index");
assert.equal(getNodeRouteIndex("case02", "c2_logs"), 1, "common route nodes should keep their route index");
assert.ok(getCaseRouteLength("case02") > 0, "case route lengths should be available for progress calculation");
Object.entries(caseOpeningRoutes).forEach(([caseId, routes]) => {
  Object.entries(routes).forEach(([outcomeId, startNodeId]) => {
    assert.ok(nodes[startNodeId], `${caseId}/${outcomeId} branch opening should exist`);
    const route = simulateCaseRoute(caseId, startNodeId, 1);
    assert.equal(route.at(-1).next, CASE_RESULT_NODES[caseId], `${caseId}/${outcomeId} should complete from branch opening`);
  });
});

Object.entries(nodeOrders).forEach(([caseId, order]) => {
  [...new Set(order)].forEach((nodeId) => {
    nodes[nodeId].choices.forEach((choice, choiceIndex) => {
      const route = simulateCaseRouteAfterFirstChoice(caseId, nodeId, choiceIndex);
      assert.equal(
        route.at(-1).next,
        CASE_RESULT_NODES[caseId],
        `${caseId}/${nodeId}/${choice.id} should still complete after taking this branch`,
      );
    });
  });
});

function createSeededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

function simulateRandomCaseRoute(caseId, startNodeId, random) {
  const visited = [];
  let cursor = startNodeId;
  for (let step = 0; step < 80; step += 1) {
    if (cursor === CASE_RESULT_NODES[caseId]) return visited;
    const node = nodes[cursor];
    assert.ok(node, `${caseId} random route reached missing node ${cursor}`);
    const playableChoices = node.choices.filter((choice) => choice.type !== "free");
    assert.ok(playableChoices.length > 0, `${cursor} should have fixed choices for random simulation`);
    const choice = playableChoices[Math.floor(random() * playableChoices.length)];
    visited.push({ nodeId: cursor, choiceId: choice.id, next: choice.next });
    cursor = choice.next;
  }
  assert.fail(`${caseId} random route did not reach ${CASE_RESULT_NODES[caseId]}`);
}

for (let seed = 1; seed <= 200; seed += 1) {
  const random = createSeededRandom(seed);
  let previousOutcomeChoiceId = null;
  for (const caseId of CASE_SEQUENCE) {
    const startNodeId = caseOpeningRoutes[caseId]?.[previousOutcomeChoiceId] ?? CASE_START_NODES[caseId];
    const route = simulateRandomCaseRoute(caseId, startNodeId, random);
    assert.equal(route.at(-1).next, CASE_RESULT_NODES[caseId], `seed ${seed} ${caseId} should complete`);
    previousOutcomeChoiceId = route.at(-1).choiceId;
  }
}

const riskyResources = {
  time: 40,
  capital: 60,
  trust: 50,
  legitimacy: 50,
  humanCost: 40,
  fatigue: 40,
};
const recoveredResources = {
  time: 55,
  capital: 70,
  trust: 50,
  legitimacy: 50,
  humanCost: 25,
  fatigue: 20,
};

assert.equal(getRiskPressure(initialResources), 2, "initial risk pressure should stay low");
assert.equal(getRiskPressure({ fatigue: 10 }), 2, "partial resources should use safe defaults");
assert.ok(
  getRiskPressure(recoveredResources) < getRiskPressure(riskyResources),
  "recovered resources should reduce risk pressure",
);
assert.deepEqual(
  getRiskPressureDrivers(riskyResources)
    .slice(0, 2)
    .map((driver) => driver.id),
  ["time", "capital"],
  "risk pressure drivers should be sorted by pressure contribution",
);

const suspenseWatch = getSuspenseState({ riskPressure: 20, decisionSeconds: 35, log: [{}, {}], currentCase: "case02" });
assert.equal(suspenseWatch.tier, "WATCH", "suspense state should escalate into watch tier");
assert.equal(suspenseWatch.caseCode, "02", "suspense state should expose compact case code");
const observerEvent = getSuspenseEvent({ riskBefore: 42, riskAfter: 54, currentCase: "case02", logLength: 1 });
assert.equal(observerEvent.id, "observer-awake", "suspense event should reveal observer at the unstable threshold");
const protocolEvent = getSuspenseEvent({ riskBefore: 68, riskAfter: 74, currentCase: "case03", logLength: 2 });
assert.equal(protocolEvent.tone, "redline", "suspense event should use redline tone at critical threshold");
const narrativeSpine = buildNarrativeSpine({
  caseObjective: "72시간 안에 손실 구조를 선택한다",
  node: { phase: "BOARD", title: "누가 비용을 내는가", triggers: ["responsibility", "protection"] },
  log: [{ choice: "기록을 남긴다" }],
  triggerLabels: { responsibility: "책임", protection: "보호" },
  riskTier: "UNSTABLE",
  suspenseState: { tier: "UNSTABLE" },
});
assert.equal(narrativeSpine.turn, 2, "narrative spine should number the current turn");
assert.match(narrativeSpine.previous, /기록을 남긴다/, "narrative spine should carry the previous decision");
assert.match(narrativeSpine.conflict, /책임 \/ 보호/, "narrative spine should summarize current conflict");

assert.deepEqual(
  applyEffect({ ...initialResources, time: 70, fatigue: 98 }, { time: 10, fatigue: 8 }),
  { ...initialResources, time: 72, fatigue: 100 },
  "resource effects should clamp to resource caps",
);
const seededEffect = applySeededEffectVariation({ trust: 10, fatigue: -10 }, "session:node:choice");
assert.deepEqual(
  seededEffect,
  applySeededEffectVariation({ trust: 10, fatigue: -10 }, "session:node:choice"),
  "seeded effect variation should be deterministic",
);
Object.values(seededEffect).forEach((value) => {
  assert.ok(Math.abs(value) >= 8 && Math.abs(value) <= 12, "seeded effect variation should stay within plus or minus 15 percent");
});
assert.deepEqual(
  applySeededEffectVariation({ trust: 10 }, "", 0.15),
  { trust: 10 },
  "missing seeds should preserve authored effects",
);

const decisionForecast = createDecisionForecast(
  {
    id: "recover",
    effect: { time: 8, capital: 10, fatigue: -12 },
    cognition: { inference: 2, risk: 1 },
  },
  riskyResources,
);

assert.equal(decisionForecast.choiceId, "recover", "decision forecast should keep the choice id");
assert.ok(decisionForecast.riskDelta < 0, "decision forecast should calculate risk reduction");
assert.deepEqual(decisionForecast.biggestGain, ["fatigue", -12], "decision forecast should identify biggest gain");
assert.deepEqual(decisionForecast.biggestCost, undefined, "decision forecast should allow choices without costs");
assert.equal(decisionForecast.cognitionGain, 3, "decision forecast should sum cognition gain");

const ledger = getDecisionLedger(
  [
    { effect: { time: -8, capital: -4 }, resourcesBefore: initialResources, resourcesAfter: riskyResources },
    { effect: { trust: 2, humanCost: -8 }, resourcesBefore: riskyResources, resourcesAfter: recoveredResources },
  ],
  recoveredResources,
);
assert.equal(ledger.riskRises, 1, "decision ledger should count rising pressure turns");
assert.equal(ledger.riskDrops, 1, "decision ledger should count recovery turns");
assert.deepEqual(ledger.strongestRecovery, ["humanCost", -8], "decision ledger should identify recovery effects");

const fingerprint = getDecisionFingerprint({
  triggerScores: { responsibility: 12, protection: 8, curiosity: 2 },
  cognitionScores: { reframing: 4, inference: 2 },
  entries: [
    { freeText: "조건을 다시 설계한다", challenge: { matched: true }, effect: { humanCost: -6 }, resourcesBefore: riskyResources, resourcesAfter: recoveredResources },
  ],
  resources: recoveredResources,
});
assert.equal(fingerprint.mode, "GUARDIAN", "decision fingerprint should classify recovery-led play");
assert.deepEqual(fingerprint.primaryTrigger, ["responsibility", 12], "decision fingerprint should expose primary pressure");
assert.equal(fingerprint.pressureShare, 55, "decision fingerprint should calculate pressure share");

const counterfactuals = getCounterfactualReport(
  [{
    nodeId: "briefing",
    choiceId: "slow",
    title: "브리핑",
    choice: "느린 선택",
    resourcesBefore: riskyResources,
  }],
  {
    briefing: {
      choices: [
        { id: "slow", label: "느린 선택", effect: { time: 8, capital: 4 } },
        { id: "fast", label: "빠른 선택", effect: { time: -12, capital: 10, fatigue: 8 } },
      ],
    },
  },
);
assert.equal(counterfactuals.length, 1, "counterfactual report should include comparable scenes");
assert.equal(counterfactuals[0].actual.id, "slow", "counterfactual report should identify the actual choice");
assert.equal(counterfactuals[0].safest.id, "slow", "counterfactual report should identify the safest alternative");
assert.equal(counterfactuals[0].actualWasSafest, true, "counterfactual report should flag safest actual choices");

const leaderboard = buildLeaderboard([
  {
    session_code: "ALPHA",
    player_name: "첫 분석관",
    case_id: "case01",
    case_title: "CASE 01",
    summary: { rank: "A", momentumScore: 72, primary: ["responsibility", 4], averageResponseTime: 18, freeCount: 1 },
  },
  {
    session_code: "ALPHA",
    player_name: "첫 분석관",
    case_id: "final",
    case_title: "FINAL",
    summary: { rank: "S", momentumScore: 88, primary: ["curiosity", 5], averageResponseTime: 21, freeCount: 2 },
  },
  {
    session_code: "BETA",
    player_name: "두 번째 분석관",
    case_id: "case02",
    case_title: "CASE 02",
    summary: { rank: "A", momentumScore: 80, primary: ["trust", 4], averageResponseTime: 15, freeCount: 0 },
  },
]);
assert.equal(leaderboard.length, 2, "leaderboard should keep one best run per session");
assert.equal(leaderboard[0].sessionCode, "ALPHA", "leaderboard should sort by momentum score");
assert.equal(leaderboard[0].position, 1, "leaderboard should assign positions");
assert.match(getLeaderboardHeadline(leaderboard).title, /익명 분석관/, "remote leaderboard should use anonymous names");
assert.match(
  getLeaderboardHeadline(
    buildLeaderboard([{ local: true, session_code: "LOCAL", player_name: "현재 분석관", summary: { rank: "S", momentumScore: 90 } }]),
  ).title,
  /현재 분석관/,
  "local leaderboard should keep the local player name",
);
const malformedLeaderboard = buildLeaderboard([
  { session_code: "MALFORMED", summary: { rank: "UNKNOWN", momentumScore: 30 } },
]);
assert.equal(malformedLeaderboard[0].rank, "C", "leaderboard should normalize unknown ranks");
assert.equal(
  buildLeaderboard([
    { session_code: "INVALID", summary: { rank: "A", momentumScore: "not-a-score" } },
    { session_code: "OUT-OF-RANGE", summary: { rank: "A", momentumScore: 101 } },
  ]).length,
  0,
  "leaderboard should omit invalid scores",
);

const gameplayStats = getGameplayStats(
  [
    {
      responseTimeSec: 14,
      freeText: "",
      cognition: { inference: 2, risk: 1 },
      challenge: { matched: true },
      resourcesBefore: riskyResources,
      resourcesAfter: recoveredResources,
    },
    {
      responseTimeSec: 21,
      freeText: "이해관계자를 다시 묶어 조건부 협상안을 제안한다.",
      cognition: { reframing: 3, persistence: 1 },
      challenge: { matched: true },
      resourcesBefore: recoveredResources,
      resourcesAfter: { ...recoveredResources, fatigue: 24 },
    },
    {
      responseTimeSec: 9,
      freeText: "",
      cognition: { ethics: 2 },
      challenge: { matched: false },
      resourcesBefore: initialResources,
      resourcesAfter: initialResources,
    },
  ],
  getRiskPressure(initialResources),
);

assert.equal(gameplayStats.freeCount, 1, "free text count should be tracked");
assert.equal(gameplayStats.reducedRiskCount, 1, "risk reductions should be tracked");
assert.equal(gameplayStats.challengeClearCount, 2, "cleared scene challenges should be tracked");
assert.equal(gameplayStats.currentChallengeStreak, 0, "failed latest challenge should reset streak");
assert.equal(gameplayStats.momentumTier, "FLOW", "sample gameplay should reach FLOW momentum");
assert.equal(gameplayStats.rank, "B", "sample gameplay should map to B rank under the burst algorithm");
const observationLedger = getObservationLedger([
  { responseTimeSec: 1, choiceId: "audit", resourcesBefore: riskyResources, resourcesAfter: recoveredResources },
  { freeText: "조건과 근거를 다시 묶는다", choiceId: "reframe", resourcesBefore: recoveredResources, resourcesAfter: { ...recoveredResources, humanCost: 28 } },
  { choice: "침묵을 유지한다", resourcesBefore: recoveredResources, resourcesAfter: { ...recoveredResources, humanCost: 32 } },
]);
assert.deepEqual(observationLedger, { compliance: 1, defiance: 1, opacity: 1, sacrifice: 2 }, "observation ledger should be deterministic and hidden during play");

// D-6: system events must not feed the challenge streak or the clear count.
const statsWithSystemEvent = getGameplayStats(
  [
    {
      responseTimeSec: 8,
      cognition: { risk: 2 },
      challenge: { matched: true },
      resourcesBefore: initialResources,
      resourcesAfter: initialResources,
    },
    {
      title: "CRISIS PROTOCOL",
      isSystemEvent: true,
      responseTimeSec: 3,
      challenge: { matched: true },
      resourcesBefore: initialResources,
      resourcesAfter: initialResources,
    },
  ],
  getRiskPressure(initialResources),
);
assert.equal(
  statsWithSystemEvent.challengeClearCount,
  1,
  "D-6: the crisis protocol must not count as a cleared scene challenge",
);

// D-5: the stabiliser score reads the fatigue bonus as its own comparison.
const guardianFingerprint = getDecisionFingerprint({
  triggerScores: {},
  cognitionScores: {},
  entries: [
    { effect: { fatigue: -4 }, resourcesBefore: riskyResources, resourcesAfter: recoveredResources },
    { effect: { fatigue: -3 }, resourcesBefore: riskyResources, resourcesAfter: recoveredResources },
  ],
  resources: recoveredResources,
});
assert.ok(
  typeof guardianFingerprint.modeTitle === "string" && guardianFingerprint.modeTitle.length > 0,
  "D-5: the ending mode must resolve to a named profile",
);

// T5-3: the closing screen counts what the run left shut, from the graph itself.
const branchNodes = getCaseBranchNodes();
assert.equal(branchNodes.length, CASE_SEQUENCE.length, "every case should expose exactly one authored fork");
for (const branch of branchNodes) {
  assert.ok(branch.nextIds.length >= 2, `${branch.caseId} fork should lead to at least two scenes`);
}
const allClueIds = getAllDiscoveryClueIds();
assert.equal(allClueIds.length, CASE_SEQUENCE.length, "each case should hide exactly one clue");
assert.equal(new Set(allClueIds).size, allClueIds.length, "hidden clue ids should be unique");

const caseSummary = createCaseSummary(
  { responsibility: 3, protection: 1 },
  { persistence: 2, risk: 5 },
  [
    {
      title: "빠른 결정",
      responseTimeSec: 8,
      freeText: "",
      challenge: { matched: false },
      resourcesBefore: initialResources,
      resourcesAfter: initialResources,
    },
    {
      title: "오래 고민한 결정",
      responseTimeSec: 24,
      freeText: "조건부 협상으로 이해관계자를 다시 묶는다.",
      challenge: { matched: true },
      resourcesBefore: riskyResources,
      resourcesAfter: recoveredResources,
    },
  ],
  { resources: recoveredResources, schemaVersion: SAVE_SCHEMA_VERSION, includeLongestDecision: true },
);

assert.equal(caseSummary.schemaVersion, SAVE_SCHEMA_VERSION, "case summary should keep schema version");
assert.deepEqual(caseSummary.primary, ["responsibility", 3], "case summary should track primary trigger");
assert.deepEqual(caseSummary.thinking, ["risk", 5], "case summary should track strongest cognition");
assert.equal(caseSummary.freeCount, 1, "case summary should include gameplay stats");
assert.equal(caseSummary.averageResponseTime, 16, "case summary should average response time");
assert.equal(
  caseSummary.longestDecision.title,
  "오래 고민한 결정",
  "case summary should optionally include longest decision",
);

assert.deepEqual(
  getGameplayStats(),
  {
    freeCount: 0,
    reducedRiskCount: 0,
    challengeClearCount: 0,
    currentChallengeStreak: 0,
    rhythmScore: 0,
    cognitionScore: 0,
    pressureAdaptScore: 0,
    reflectionScore: 0,
    exploitPenalty: 0,
    momentumScore: 0,
    burstScore: 0,
    momentumTier: "BUILDING",
    rank: "C",
  },
  "empty gameplay stats should stay stable",
);

assert.equal(
  speechifyChoice({ label: "조건을 다시 설계한다" }),
  "조건을 다시 설계하겠습니다.",
  "choice labels should be converted into spoken lines",
);

const sensitiveText = "담당자는 test@example.com, 010-1234-5678, 플로우온테크에 공유한다.";
assert.deepEqual(
  detectPrivacySignals(sensitiveText)
    .filter((signal) => signal.active)
    .map((signal) => signal.label),
  ["이메일", "전화번호", "회사·조직명"],
  "privacy detector should flag direct identifiers",
);
assert.equal(
  anonymizeSensitiveText(sensitiveText),
  "담당자는 익명 이메일, 익명 연락처, 익명 조직에 공유한다.",
  "privacy anonymizer should replace direct identifiers",
);
assert.equal(
  anonymizeSensitiveText("주식회사 세림과 (주)하람에 확인한다."),
  "익명 조직과 익명 조직에 확인한다.",
  "privacy anonymizer should remove organization names after company prefixes",
);
assert.deepEqual(
  detectPrivacySignals("주식회사 세림과 회의했다.")
    .filter((signal) => signal.active)
    .map((signal) => signal.label),
  ["회사·조직명"],
  "privacy detector should flag prefixed organization names",
);
assert.deepEqual(
  detectPrivacySignals("회사 정책과 전자 문서를 다시 검토한다.")
    .filter((signal) => signal.active)
    .map((signal) => signal.label),
  [],
  "privacy detector should not flag generic business terms as organizations",
);
assert.equal(
  anonymizeSensitiveText("회사 정책과 전자 문서를 다시 검토한다."),
  "회사 정책과 전자 문서를 다시 검토한다.",
  "privacy anonymizer should keep generic business terms unchanged",
);
assert.equal(limitText("abcdef", 3), "abc", "text limiter should truncate long input");
assert.equal(limitText("abcdef", 0), "", "text limiter should return empty text for invalid limits");

console.log("Smoke tests passed");
