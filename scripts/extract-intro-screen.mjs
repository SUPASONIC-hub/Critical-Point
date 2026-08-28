import fs from "node:fs";

const file = "src/App.jsx";
let source = fs.readFileSync(file, "utf8");
const start = source.indexOf("  if (!started) {");
const end = source.indexOf("\n  function advanceEndingStep", start);
if (start < 0 || end < 0) throw new Error("Intro screen markers not found");
const branch = source.slice(start, end);
const returnStart = branch.indexOf("    return (");
const body = branch.slice(returnStart + "    return (".length, branch.lastIndexOf("    );"));
const aliases = [
  "AdaptiveMusic", "musicModeKey", "renderRecoveryNotice", "renderErrorLogPanel", "renderSaveStatus", "setShowRanking",
  "GAME_TITLE", "simplifyPlayerText", "activeCaseMeta", "nextParticipantMessage", "GAME_SUBTITLE", "playStyleOptions", "playStyle",
  "setPlayStyle", "persist", "seasonCasesBase", "caseObjectives", "triggerLabSignals", "hasResumableSave", "node", "formatSaveTime",
  "lastSavedAt", "log", "progress", "playerName", "PLAYER_NAME_MAX_LENGTH", "setPlayerName", "limitText", "startGame", "dataConsent",
  "setDataConsent", "pendingTelemetryRef", "setTelemetryStatus", "telemetryEnabled", "isOnline", "telemetrySummary", "sessionCode",
  "debugToolsEnabled", "showErrorLog", "setShowErrorLog", "unlockAllCasesForTest", "debugCaseSelectRef", "debugCaseId", "debugNodeOptions",
  "debugNodeId", "debugNodeSelectRef", "caseSequence", "nodes", "setDebugCaseId", "setDebugNodeId", "startDebugNode", "playGuideItems",
  "completedCaseResultList", "seasonJourney", "resourceMeta", "seasonCases", "caseResults", "completedCases", "currentCase", "startCase",
  "getCaseStatusText", "nextParticipantMessage", "onShowRanking",
];
const destructure = aliases.filter((name, index, all) => all.indexOf(name) === index).join(", ");
const transformed = body.replaceAll("GAME_TITLE", "gameTitle").replaceAll("AdaptiveMusic", "Music").replaceAll("setShowRanking", "onShowRanking");
const screen = `import React from "react";\nimport { AlertTriangle, ChevronRight, Info, Trophy } from "lucide-react";\n\nexport function IntroScreen({ view }) {\n  const { ${destructure} } = view;\n  const gameTitle = GAME_TITLE;\n  return (${transformed});\n}\n`;
fs.mkdirSync("src/screens", { recursive: true });
fs.writeFileSync("src/screens/IntroScreen.jsx", screen);

const viewObject = `  const introView = { ${destructure} };\n`;
source = source.slice(0, start) + viewObject + `  if (!started) {\n    return <IntroScreen view={introView} />;\n  }` + source.slice(end);
fs.writeFileSync(file, source);
