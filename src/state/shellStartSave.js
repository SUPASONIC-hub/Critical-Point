import { createRunId, makeEmptyScores, normalizePlayerName, SAVE_SCHEMA_VERSION } from "../appConfig.js";
import { SEASON_ENTRY_CASE, SEASON_ENTRY_NODE } from "../gameCases.js";
import { cognitionLabels, triggerLabels } from "../gameConstants.js";
import { createOpeningResources, OPENING_ECHO } from "./openingState.js";

/**
 * The save 시작 writes from the pre-start shell, before the runtime is there.
 *
 * It is the save the runtime's own new game writes (`RUN_FIELDS`' newGame, in
 * runState.js), typed out a second time: the shell cannot read it off that
 * table, because the table imports the engine and the shell is the entry
 * chunk. `shell-start-save.test.mjs` holds the two together key by key, so a
 * field added to the run fails there until it is added here.
 *
 * Two keys are the shell's own answer, and the test names both:
 *   dynamics          null, the save format's "no table yet". The runtime reads
 *                     that as the opening table and writes it out in full.
 *   pendingTelemetry  empty. A new game in the runtime keeps the queue; the
 *                     shell never starts one over a queue it may send, because
 *                     a save holding one opens the runtime instead (AppContent).
 */
export function createStartSave(
  { playerName, playStyle, dataConsent, operatorOrigin },
  { now = Date.now(), runId = createRunId() } = {},
) {
  return {
    saveSchemaVersion: SAVE_SCHEMA_VERSION,
    runId,
    playerName: normalizePlayerName(playerName) || "분석관",
    playStyle,
    openingLegacy: null,
    dataConsent,
    started: true,
    currentCase: SEASON_ENTRY_CASE,
    completedCases: [],
    discoveredClues: [],
    caseResults: {},
    playtestFeedback: {},
    nodeId: SEASON_ENTRY_NODE,
    resources: createOpeningResources(operatorOrigin),
    log: [],
    triggers: makeEmptyScores(triggerLabels),
    cognition: makeEmptyScores(cognitionLabels),
    echo: OPENING_ECHO,
    nodeEnteredAt: now,
    pendingTelemetry: [],
    dynamics: null,
    paused: false,
    savedAt: new Date(now).toISOString(),
  };
}
