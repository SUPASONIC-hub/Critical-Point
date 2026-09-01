import { useState } from "react";

export function useGameSaveState({ saved, initialRunId, initialResources, triggerDefaults, cognitionDefaults, normalizeText }) {
  const [runId, setRunId] = useState(() => saved?.runId || initialRunId);
  const [playerName, setPlayerName] = useState(() => saved?.playerName ?? "");
  const [playStyle, setPlayStyle] = useState(saved?.playStyle ?? "instinct");
  const [openingLegacy, setOpeningLegacy] = useState(saved?.openingLegacy ?? null);
  const [dataConsent, setDataConsent] = useState(saved?.dataConsent ?? false);
  const [started, setStarted] = useState(saved?.started ?? false);
  const [currentCase, setCurrentCase] = useState(saved?.currentCase ?? "case01");
  const [completedCases, setCompletedCases] = useState(saved?.completedCases ?? []);
  const [discoveredClues, setDiscoveredClues] = useState(saved?.discoveredClues ?? []);
  const [caseResults, setCaseResults] = useState(saved?.caseResults ?? {});
  const [playtestFeedback, setPlaytestFeedback] = useState(saved?.playtestFeedback ?? {});
  const [nodeId, setNodeId] = useState(saved?.nodeId ?? "start");
  const [resources, setResources] = useState(saved?.resources ?? initialResources);
  const [log, setLog] = useState(saved?.log ?? []);
  const [triggers, setTriggers] = useState(saved?.triggers ?? triggerDefaults);
  const [cognition, setCognition] = useState(saved?.cognition ?? cognitionDefaults);
  const [freeText, setFreeText] = useState(() => normalizeText(saved?.freeText));
  const [lastSavedAt, setLastSavedAt] = useState(saved?.savedAt ?? "");
  const [isPausedSave, setIsPausedSave] = useState(saved?.paused ?? false);
  const [pendingTelemetry, setPendingTelemetry] = useState(saved?.pendingTelemetry ?? []);
  const [protocolUsed, setProtocolUsed] = useState(saved?.protocolUsed ?? false);
  const [timerPenaltyApplied, setTimerPenaltyApplied] = useState(saved?.timerPenaltyApplied ?? false);
  const [probeUsed, setProbeUsed] = useState(saved?.probeUsed ?? false);
  const [investigatedTargets, setInvestigatedTargets] = useState(saved?.investigatedTargets ?? {});
  const [hypothesisDecisions, setHypothesisDecisions] = useState(saved?.hypothesisDecisions ?? {});

  return {
    runId, setRunId,
    playerName, setPlayerName,
    playStyle, setPlayStyle,
    openingLegacy, setOpeningLegacy,
    dataConsent, setDataConsent,
    started, setStarted,
    currentCase, setCurrentCase,
    completedCases, setCompletedCases,
    discoveredClues, setDiscoveredClues,
    caseResults, setCaseResults,
    playtestFeedback, setPlaytestFeedback,
    nodeId, setNodeId,
    resources, setResources,
    log, setLog,
    triggers, setTriggers,
    cognition, setCognition,
    freeText, setFreeText,
    lastSavedAt, setLastSavedAt,
    isPausedSave, setIsPausedSave,
    pendingTelemetry, setPendingTelemetry,
    protocolUsed, setProtocolUsed,
    timerPenaltyApplied, setTimerPenaltyApplied,
    probeUsed, setProbeUsed,
    investigatedTargets, setInvestigatedTargets,
    hypothesisDecisions, setHypothesisDecisions,
  };
}
