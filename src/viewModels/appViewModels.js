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
  return createScreenView("intro", baseView, extras);
}

export function createResultView(baseView, extras = {}) {
  return createScreenView("result", baseView, extras);
}

export function createPlayView(baseView, extras = {}) {
  return createScreenView("play", baseView, extras);
}
