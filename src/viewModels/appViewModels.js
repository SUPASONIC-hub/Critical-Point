const requiredViewFields = {
  intro: [
    "AdaptiveMusic",
    "GAME_TITLE",
    "renderRecoveryNotice",
    "renderErrorLogPanel",
    "renderSaveStatus",
    "seasonCases",
    "startGame",
    "resumeSavedGame",
    "startCase",
  ],
  result: [
    "AdaptiveMusic",
    "GAME_TITLE",
    "renderDecisionReveal",
    "renderRecoveryNotice",
    "currentCase",
    "result",
    "resultRank",
    "reset",
    "startCase",
  ],
  play: [
    "AdaptiveMusic",
    "renderDecisionReveal",
    "renderRecoveryNotice",
    "currentCase",
    "node",
    "fixedChoices",
    "choose",
    "handleChoiceClick",
    "resources",
  ],
};

function createScreenView(screenName, baseView, extras = {}) {
  const view = { ...baseView, ...extras };
  const missing = requiredViewFields[screenName].filter((field) => view[field] === undefined);
  if (missing.length > 0) {
    throw new Error(`${screenName} view is missing required field(s): ${missing.join(", ")}`);
  }
  return Object.freeze(view);
}

export function createIntroView(baseView, extras = {}) {
  const view = createScreenView("intro", baseView, extras);
  return Object.freeze({
    ...view,
    common: {
      AdaptiveMusic: view.AdaptiveMusic,
      musicModeKey: view.musicModeKey,
      renderRecoveryNotice: view.renderRecoveryNotice,
      renderErrorLogPanel: view.renderErrorLogPanel,
      renderSaveStatus: view.renderSaveStatus,
      setShowRanking: view.setShowRanking,
      GAME_TITLE: view.GAME_TITLE,
      GAME_TITLE_READING: view.GAME_TITLE_READING,
      GAME_SUBTITLE: view.GAME_SUBTITLE,
      triggerLabels: view.triggerLabels,
      simplifyPlayerText: view.simplifyPlayerText,
      activeCaseMeta: view.activeCaseMeta,
      nextParticipantMessage: view.nextParticipantMessage,
    },
    start: {
      hasResumableSave: view.hasResumableSave,
      node: view.node,
      formatSaveTime: view.formatSaveTime,
      lastSavedAt: view.lastSavedAt,
      log: view.log,
      progress: view.progress,
      playerName: view.playerName,
      PLAYER_NAME_MAX_LENGTH: view.PLAYER_NAME_MAX_LENGTH,
      setPlayerName: view.setPlayerName,
      limitText: view.limitText,
      startGame: view.startGame,
      resumeSavedGame: view.resumeSavedGame,
      activePlayStyle: view.activePlayStyle,
      playStyleOptions: view.playStyleOptions,
      playStyle: view.playStyle,
      setPlayStyle: view.setPlayStyle,
      persist: view.persist,
      newGamePlusUnlocked: view.newGamePlusUnlocked,
      startNewGamePlus: view.startNewGamePlus,
    },
    telemetry: {
      dataConsent: view.dataConsent,
      setDataConsent: view.setDataConsent,
      pendingTelemetryRef: view.pendingTelemetryRef,
      setTelemetryStatus: view.setTelemetryStatus,
      telemetryEnabled: view.telemetryEnabled,
      isOnline: view.isOnline,
      telemetrySummary: view.telemetrySummary,
      sessionCode: view.sessionCode,
      setPendingTelemetry: view.setPendingTelemetry,
      setSaveStatus: view.setSaveStatus,
    },
    debug: {
      debugToolsEnabled: view.debugToolsEnabled,
      showErrorLog: view.showErrorLog,
      setShowErrorLog: view.setShowErrorLog,
      unlockAllCasesForTest: view.unlockAllCasesForTest,
      debugCaseSelectRef: view.debugCaseSelectRef,
      debugCaseId: view.debugCaseId,
      debugCaseIdRef: view.debugCaseIdRef,
      debugNodeOptions: view.debugNodeOptions,
      debugNodeId: view.debugNodeId,
      debugNodeIdRef: view.debugNodeIdRef,
      debugNodeSelectRef: view.debugNodeSelectRef,
      caseSequence: view.caseSequence,
      nodes: view.nodes,
      setDebugCaseId: view.setDebugCaseId,
      setDebugNodeId: view.setDebugNodeId,
      startDebugNode: view.startDebugNode,
      nodeOrders: view.nodeOrders,
    },
    season: {
      seasonCasesBase: view.seasonCasesBase,
      caseObjectives: view.caseObjectives,
      triggerLabSignals: view.triggerLabSignals,
      completedCaseResultList: view.completedCaseResultList,
      seasonJourney: view.seasonJourney,
      resourceMeta: view.resourceMeta,
      seasonCases: view.seasonCases,
      caseResults: view.caseResults,
      startCase: view.startCase,
      getCaseStatusText: view.getCaseStatusText,
      normalizeCaseSummary: view.normalizeCaseSummary,
    },
    content: {
      playGuideItems: view.playGuideItems,
      operatorProfiles: view.operatorProfiles,
      operatorOrigin: view.operatorOrigin,
      setOperatorOrigin: view.setOperatorOrigin,
      operatorProfile: view.operatorProfile,
      originPrologue: view.originPrologue,
      tutorialSteps: view.tutorialSteps,
      playStyleUnlocks: view.playStyleUnlocks,
      seasonGoals: view.seasonGoals,
      pastRunMemory: view.pastRunMemory,
    },
  });
}

export function createResultView(baseView, extras = {}) {
  return createScreenView("result", baseView, extras);
}

export function createPlayView(baseView, extras = {}) {
  return createScreenView("play", baseView, extras);
}
