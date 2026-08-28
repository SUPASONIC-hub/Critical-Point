import fs from "node:fs";

const appFile = "src/App.jsx";
let source = fs.readFileSync(appFile, "utf8");

function unique(items) {
  return items.filter((item, index, all) => item && all.indexOf(item) === index);
}

function indentBlock(text, spaces) {
  const prefix = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line ? `${prefix}${line}` : line))
    .join("\n");
}

function extractReturnBody(block) {
  const returnStart = block.indexOf("    return (");
  const returnEnd = block.lastIndexOf("    );");
  if (returnStart < 0 || returnEnd < 0) throw new Error("Return body not found");
  return block.slice(returnStart + "    return (".length, returnEnd);
}

function writeScreen(file, imports, name, aliases, body) {
  const destructure = unique(aliases).join(", ");
  const content = `${imports}\n\nexport function ${name}({ view }) {\n  const { ${destructure} } = view;\n  return (${body});\n}\n`;
  fs.writeFileSync(file, content);
}

function findPatternIndex(pattern, start = 0) {
  const match = pattern.exec(source.slice(start));
  return match ? start + match.index : -1;
}

const resultStart = source.lastIndexOf("  if (isResult) {");
const playStart = findPatternIndex(/\r?\n  return \(\r?\n    <main className=\{`shell game-shell/, resultStart);
const appEnd = findPatternIndex(/\r?\n}\r?\n\r?\nexport class AppErrorBoundary/, playStart);
if (resultStart < 0 || playStart < 0 || appEnd < 0) {
  throw new Error("Screen markers not found");
}

const resultBlock = source.slice(resultStart, playStart);
const playReturn = source.slice(playStart, appEnd);
const resultBody = extractReturnBody(resultBlock);
const playBody = playReturn.slice(playReturn.indexOf("  return (") + "  return (".length, playReturn.lastIndexOf("  );"));

const resultAliases = [
  "AdaptiveMusic", "musicModeKey", "renderDecisionReveal", "renderRecoveryNotice", "renderErrorLogPanel", "screenReaderStatus",
  "currentCase", "endingStep", "endingTwistIndex", "finalAftermathEntry", "finalEndingEntry", "caseResults", "decisionFingerprint",
  "observationLedger", "endingProfile", "advanceEndingStep", "endingQuietReady", "nextParticipantMessage", "setNextParticipantMessage",
  "saveNextParticipantMessage", "unopenedRecordCount", "GAME_TITLE", "startCase", "setStarted", "setShowRanking", "showSeasonMap",
  "debugToolsEnabled", "showErrorLog", "setShowErrorLog", "exportPlaytestLog", "reset", "playerName", "activeCaseMeta",
  "sceneTitleRef", "triggerLabels", "triggers", "result", "caseOutcome", "resultRank", "momentumTier", "momentumScore", "rankLine",
  "scoreBreakdown", "clamp", "easyCognitionLabels", "cognitionLabels", "formatRiskDelta", "counterfactualReport",
  "sessionCode", "telemetryStatus", "pendingTelemetry", "retryPendingTelemetry", "scheduleTelemetryRetry", "telemetryEnabled",
  "dataConsent", "isOnline", "isRetryingTelemetry", "copySessionCode", "copyStatus", "nextCaseSignal", "resultBridge",
  "achievementBadges", "feedbackPrompts", "currentFeedback", "updateCurrentFeedback", "FEEDBACK_COMMENT_MAX_LENGTH",
  "activeFeedbackPrivacySignals", "anonymizeFeedbackComment", "submitCurrentFeedback", "isSubmittingFeedback", "feedbackStatus",
  "routeTimeline", "resourceMeta", "explainResourceTradeoff", "log", "clueCount", "renderSceneLines",
];

const playAliases = [
  "suspenseState", "AdaptiveMusic", "musicModeKey", "renderDecisionReveal", "renderRecoveryNotice", "renderErrorLogPanel",
  "screenReaderStatus", "simplifyPlayerText", "caseObjectives", "currentCase", "node", "triggerLabels", "openingLegacy",
  "pressureCascade", "riskPressure", "playGuideItems", "sceneTitleRef", "saveCurrentGame", "reset", "renderSaveStatus",
  "progress", "easyRiskLabels", "riskTier", "activeBonus", "freeTextCombo", "currentAverageResponseTime", "log", "clueCount",
  "discoveredClues", "currentChallengeStreak", "momentumTier", "streakGoal", "streakRemaining", "momentumScore",
  "decisionSeconds", "protocolUsed", "isAdvancing", "activateCrisisProtocol", "decisionFingerprint", "decisionLedger",
  "resourceMeta", "sceneChallenge", "triggerLabSignals", "narrativeSpine", "questSteps", "sceneVisuals", "speakerProfile",
  "latestFreeTextSuccess", "resolvedNodeId", "sceneDirection", "latestBeat", "renderSceneLines", "setMemoOpened", "echo",
  "probeUsed", "echoProbeCost", "requestEchoProbe", "getEchoChecks", "pendingChoice", "showTacticalDetails",
  "setShowTacticalDetails", "decisionForecasts", "pressureLeader", "pressureLensForecast", "tradeoffLensForecast",
  "previewChoice", "describeForecast", "evidenceCount", "pendingChoiceRead", "pendingChoiceForecast", "commitConsoleRef",
  "formatRiskDelta", "setPendingChoice", "commitConfirmRef", "choose", "fixedChoices", "getEffectiveChoiceRead",
  "getRiskPressure", "getChallengeMatch", "choiceButtonsRef", "handleChoiceClick", "beginChoiceHold", "endChoiceHold",
  "speechifyChoice", "getChoiceSubtext", "getDramaticChoiceLabel", "explainResourceTradeoff", "easyCognitionLabels",
  "cognitionLabels", "freeChoice", "boardChangePrompts", "updateFreeText", "freeText", "FREE_TEXT_MAX_LENGTH",
  "freeTextBlockedByPrivacy", "activePrivacySignals", "anonymizeFreeText", "activeFreeTextSignalCount", "freeTextSignals",
  "freeTextPreview", "applyEffect", "resources", "playerName", "activePlayStyle", "turnBriefItems", "completedCases",
  "activeCaseMeta", "debugToolsEnabled", "fallbackCaseId", "routeIndex", "routeLength", "riskTier", "silentFailureCount",
  "copyReplayLink", "copyDiagnosticTrace",
];

writeScreen(
  "src/screens/ResultScreen.jsx",
  'import React from "react";\nimport { AlertTriangle, ChevronRight, Copy, Download, FileText, MessageSquareText, RefreshCcw, Sparkles, Trophy } from "lucide-react";',
  "ResultScreen",
  resultAliases,
  resultBody,
);

writeScreen(
  "src/screens/PlayScreen.jsx",
  'import React from "react";\nimport { Check, Info, LockKeyhole, MessageSquareText, Send, Sparkles } from "lucide-react";\nimport { DecisionRail } from "../components/DecisionRail.jsx";\nimport { DecisionDock } from "../components/DecisionDock.jsx";\nimport { MemoPanel } from "../components/MemoPanel.jsx";\nimport { StatusBoard } from "../components/StatusBoard.jsx";\nimport { GameMetricsDrawer } from "../components/GameMetricsDrawer.jsx";\nimport { GameHeader } from "../components/GameHeader.jsx";',
  "PlayScreen",
  playAliases,
  playBody,
);

const resultView = `  const resultView = { ${unique(resultAliases).join(", ")} };\n`;
const playView = `  const playView = { ${unique(playAliases).join(", ")} };\n`;
const replacement = `${resultView}  if (isResult) {\n    return <ResultScreen view={resultView} />;\n  }\n\n${playView}  return <PlayScreen view={playView} />;\n`;

source = source.slice(0, resultStart) + replacement + source.slice(appEnd);
source = source.replace(
  /import \{ RankingScreen \} from "\.\/screens\/RankingScreen\.jsx";\r?\nimport \{ IntroScreen \} from "\.\/screens\/IntroScreen\.jsx";/,
  'import { RankingScreen } from "./screens/RankingScreen.jsx";\nimport { IntroScreen } from "./screens/IntroScreen.jsx";\nimport { ResultScreen } from "./screens/ResultScreen.jsx";\nimport { PlayScreen } from "./screens/PlayScreen.jsx";',
);

fs.writeFileSync(appFile, source);
