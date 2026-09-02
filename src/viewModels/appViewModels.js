/**
 * Screen view contracts.
 *
 * AppContent assembles one flat bag of fields per screen; the groups below give
 * that bag a named shape so a screen destructures by concern instead of reading
 * a hundred-name list. The groups are also the contract: every field a screen is
 * handed must be listed in exactly one group, so a field that is wired into the
 * bag but never grouped -- or grouped but never wired -- fails loudly instead of
 * arriving as undefined. scripts/check-view-contracts.mjs enforces the same
 * partition statically, before the app ever runs.
 */
export const viewGroups = {
  intro: {
    common: [
      "AdaptiveMusic", "musicModeKey", "renderRecoveryNotice", "renderErrorLogPanel", "renderSaveStatus",
      "setShowRanking", "GAME_TITLE", "GAME_TITLE_READING", "GAME_SUBTITLE", "simplifyPlayerText",
      "activeCaseMeta", "nextParticipantMessage", "triggerLabels",
    ],
    start: [
      "hasResumableSave", "node", "formatSaveTime", "lastSavedAt", "log", "progress", "playerName",
      "PLAYER_NAME_MAX_LENGTH", "setPlayerName", "limitText", "startGame", "resumeSavedGame",
      "activePlayStyle", "playStyleOptions", "playStyle", "setPlayStyle", "persist", "newGamePlusUnlocked",
      "startNewGamePlus",
    ],
    telemetry: [
      "dataConsent", "setDataConsent", "pendingTelemetryRef", "setTelemetryStatus", "telemetryEnabled",
      "isOnline", "telemetrySummary", "sessionCode", "setPendingTelemetry", "setSaveStatus",
    ],
    debug: [
      "debugToolsEnabled", "showErrorLog", "setShowErrorLog", "unlockAllCasesForTest",
      "debugCaseSelectRef", "debugCaseId", "debugCaseIdRef", "debugNodeOptions", "debugNodeId",
      "debugNodeIdRef", "debugNodeSelectRef", "caseSequence", "nodes", "setDebugCaseId", "setDebugNodeId",
      "startDebugNode", "nodeOrders",
    ],
    season: [
      "seasonCasesBase", "caseObjectives", "triggerLabSignals", "completedCaseResultList", "seasonJourney",
      "resourceMeta", "seasonCases", "caseResults", "completedCases", "currentCase", "startCase",
      "getCaseStatusText", "normalizeCaseSummary",
    ],
    content: [
      "playGuideItems", "operatorProfiles", "operatorOrigin", "setOperatorOrigin", "operatorProfile",
      "originPrologue", "tutorialSteps", "playStyleUnlocks", "seasonGoals", "pastRunMemory",
    ],
  },
  result: {
    common: [
      "AdaptiveMusic", "musicModeKey", "renderDecisionReveal", "renderRecoveryNotice",
      "renderErrorLogPanel", "renderSceneLines", "screenReaderStatus", "GAME_TITLE", "currentCase",
      "activeCaseMeta", "playerName", "sceneTitleRef", "chapterUiModel", "operatorProfile",
    ],
    ending: [
      "endingStep", "endingTwistIndex", "finalAftermathEntry", "finalEndingEntry", "endingProfile",
      "endingVariant", "advanceEndingStep", "endingQuietReady", "endingQuietLine", "skipEndingQuietHold",
      "unopenedRecordCount", "unopenedClueCount", "unopenedBranchCount", "nextParticipantMessage",
      "setNextParticipantMessage", "saveNextParticipantMessage", "endingSceneProfile", "endingVisualClass",
      "endingCause", "endingAtmosphere", "originEndingVariant", "endingEpilogue", "endingPreview",
      "aftermath", "operatorReveal",
    ],
    score: [
      "result", "caseOutcome", "resultRank", "momentumTier", "momentumScore", "rankLine", "scoreBreakdown",
      "triggers", "triggerLabels", "clamp", "easyCognitionLabels", "cognitionLabels", "formatRiskDelta",
      "counterfactualReport", "rankingComparison", "rankingIntegrity", "achievementBadges",
      "achievementProgress", "resourceMeta", "explainResourceTradeoff", "routeTimeline",
      "observationLedger", "observerPattern", "decisionFingerprint", "caseResults", "log", "clueCount",
      "clueHypotheses", "playReport", "balanceSignals",
    ],
    telemetry: [
      "sessionCode", "telemetryStatus", "pendingTelemetry", "retryPendingTelemetry",
      "scheduleTelemetryRetry", "telemetryEnabled", "dataConsent", "isOnline", "isRetryingTelemetry",
      "copySessionCode", "copyStatus", "telemetryDashboard",
    ],
    feedback: [
      "feedbackPrompts", "currentFeedback", "updateCurrentFeedback", "FEEDBACK_COMMENT_MAX_LENGTH",
      "activeFeedbackPrivacySignals", "anonymizeFeedbackComment", "submitCurrentFeedback",
      "isSubmittingFeedback", "feedbackStatus", "latestChoiceFeedback",
    ],
    actions: [
      "startCase", "setStarted", "setShowRanking", "showSeasonMap", "exportPlaytestLog", "copyReplayLink",
      "reset", "startRecoveryRoute", "nextCaseSignal", "resultBridge", "seasonGoals", "failureObjectives",
      "failureRecovery", "delayedConsequences",
    ],
    debug: [
      "debugToolsEnabled", "showErrorLog", "setShowErrorLog", "replayDiagnostics", "operationsSnapshot",
      "authorityState", "authorityReview",
    ],
  },
  play: {
    common: [
      "AdaptiveMusic", "musicModeKey", "renderDecisionReveal", "renderRecoveryNotice",
      "renderErrorLogPanel", "renderSaveStatus", "renderSceneLines", "screenReaderStatus",
      "simplifyPlayerText", "currentCase", "activeCaseMeta", "playerName", "sceneTitleRef",
      "chapterUiModel", "operatorProfile", "suspenseState",
    ],
    scene: [
      "node", "caseObjectives", "openingLegacy", "operatorBriefs", "chapterRules", "narrativeSpine",
      "questSteps", "sceneVisuals", "speakerProfile", "speakerPortrait", "sceneDirection", "latestBeat",
      "resolvedNodeId", "sceneChallenge", "timelineStamp", "interlude", "relationshipScene",
      "chapterTransitionBridge", "midBoss", "characterState", "characterMemory", "rivalResponse",
      "rivalIntervention", "counterRival", "autonomousSignal",
    ],
    decision: [
      "pendingChoice", "setPendingChoice", "showTacticalDetails", "setShowTacticalDetails",
      "decisionForecasts", "pressureLeader", "previewChoice", "pendingChoiceRead", "pendingChoiceForecast",
      "commitConsoleRef", "commitConfirmRef", "choose", "decisionSeconds", "decisionFingerprint",
      "decisionLedger", "isAdvancing", "protocolUsed", "activateCrisisProtocol", "formatRiskDelta",
      "formatForecastRisk",
    ],
    choices: [
      "fixedChoices", "getEffectiveChoiceRead", "getRiskPressure", "getChallengeMatch", "choiceButtonsRef",
      "handleChoiceClick", "beginChoiceHold", "endChoiceHold", "speechifyChoice", "getChoiceSubtext",
      "getDramaticChoiceLabel", "explainResourceTradeoff", "easyCognitionLabels", "cognitionLabels",
    ],
    freeInput: [
      "freeChoice", "boardChangePrompts", "updateFreeText", "freeText", "FREE_TEXT_MAX_LENGTH",
      "freeTextBlockedByPrivacy", "activePrivacySignals", "anonymizeFreeText", "activeFreeTextSignalCount",
      "freeTextSignals", "freeTextPreview", "freeTextCombo", "latestFreeTextSuccess",
    ],
    status: [
      "resources", "applyEffect", "resourceMeta", "resourceChain", "progress", "easyRiskLabels",
      "riskTier", "riskPressure", "pressureCascade", "activeBonus", "currentAverageResponseTime", "log",
      "observerPattern", "clueCount", "discoveredClues", "clueHypotheses", "currentChallengeStreak",
      "momentumTier", "momentumScore", "streakGoal", "streakRemaining", "triggerLabels",
      "triggerLabSignals", "turnBriefItems", "activePlayStyle", "completedCases", "routeIndex",
      "routeLength", "relationshipScores", "relationshipQuest", "relationshipGraph", "authorityState",
      "balanceSignals", "delayedConsequences", "achievementProgress", "playStyleUnlocks", "pastRunMemory",
      "operatorReveal", "playGuideItems", "dynamicMusicLayers", "latestChoiceFeedback", "setMemoOpened",
      "saveCurrentGame", "reset",
    ],
    investigation: [
      "echo", "probeUsed", "echoProbeCost", "requestEchoProbe", "getEchoChecks", "evidenceCount",
      "evidenceMetadata", "evidenceContamination", "evidenceRepairPuzzle", "repairEvidence",
      "evidenceCombinations", "hypothesisConflict", "hypothesisLockState", "hypothesisActions",
      "resolveHypothesisAction", "investigationTargets", "investigateTarget",
      "selectedInvestigationOutcome",
    ],
    debug: [
      "debugToolsEnabled", "fallbackCaseId", "silentFailureCount", "copyReplayLink", "copyDiagnosticTrace",
    ],
  },
};

function groupScreenView(screenName, view) {
  const groups = viewGroups[screenName];
  const grouped = {};
  const missing = [];
  for (const [groupName, fields] of Object.entries(groups)) {
    const bucket = {};
    for (const field of fields) {
      // `in`, not a truthiness check: a field may legitimately be undefined, but
      // the key has to be there or nobody wired it.
      if (!(field in view)) missing.push(`${groupName}.${field}`);
      bucket[field] = view[field];
    }
    grouped[groupName] = Object.freeze(bucket);
  }
  const ungrouped = Object.keys(view).filter(
    (field) => !Object.values(groups).some((fields) => fields.includes(field)),
  );
  if (missing.length > 0 || ungrouped.length > 0) {
    const problems = [
      missing.length > 0 ? `missing ${missing.join(", ")}` : "",
      ungrouped.length > 0 ? `ungrouped ${ungrouped.join(", ")}` : "",
    ].filter(Boolean);
    throw new Error(`${screenName} view contract broken: ${problems.join("; ")}`);
  }
  // The flat spread stays so a screen can still reach a field directly while its
  // own destructuring migrates to the groups.
  return Object.freeze({ ...view, ...grouped });
}

function createScreenView(screenName, baseView, extras = {}) {
  return groupScreenView(screenName, { ...baseView, ...extras });
}

export function createIntroView(baseView, extras = {}) {
  return createScreenView("intro", baseView, extras);
}

export function createResultView(baseView, extras = {}) {
  return createScreenView("result", baseView, extras);
}

export function createPlayView(baseView, extras = {}) {
  return createScreenView("play", baseView, extras);
}
