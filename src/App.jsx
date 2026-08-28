import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Info,
  LockKeyhole,
  MessageSquareText,
  Trophy,
  Copy,
  RefreshCcw,
  Save,
  Send,
  Shield,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import "./styles/tokens.css";
import "./styles/app.css";
import {
  appendStoredErrorLog,
  ERROR_LOG_STORAGE_KEY,
  FEEDBACK_COMMENT_MAX_LENGTH,
  PLAYER_NAME_MAX_LENGTH,
  appendSaveSlot,
  copyText,
  FREE_TEXT_MAX_LENGTH,
  getInvalidSavedStateKeys,
  isSavedStateShapeValid,
  normalizeFeedback,
  normalizePlayerName,
  normalizeSavedText,
  parseErrorLog,
  parseCurrentSavedState,
  parseRecoverySlots,
  readStoredValue,
  RECOVERY_SLOT_SCHEMA_VERSION,
  RECOVERY_CENTER_STORAGE_KEY,
  removeStoredValue,
  SAVE_SCHEMA_VERSION,
  SAVE_STATE_KEYS,
  SAVE_SLOT_STORAGE_KEY,
  TELEMETRY_QUEUE_TYPES,
  restoreRecoverySnapshot,
  createSafeErrorContext,
  serializeError,
  STORAGE_KEY,
  writeStoredValue,
} from "./appConfig.js";
import {
  boardChangePrompts,
  CASE_RESULT_NODES,
  CASE_SEQUENCE,
  CASE_START_NODES,
  caseObjectives,
  caseOpeningRoutes,
  characterProfiles,
  cognitionLabels,
  initialResources,
  nodeOrders,
  nodes,
  getCaseRouteLength,
  getNodeRouteIndex,
  seasonCasesBase,
  triggerLabels,
} from "./gameData.js";
import {
  applyEffect,
  applySeededEffectVariation,
  anonymizeSensitiveText,
  buildSceneBeat,
  clamp,
  createDecisionForecast,
  createCaseSummary,
  getDecisionFingerprint,
  getDecisionLedger,
  getDiscoveryClue,
  getCaseOutcome,
  getOutcomeCarryover,
  getContinuityChallenge,
  detectPrivacySignals,
  explainResourceTradeoff,
  getChoiceSubtext,
  getCounterfactualReport,
  getDramaticChoiceLabel,
  getEcho,
  getFreeTextSignals,
  getGameplayStats,
  getObservationLedger,
  buildNarrativeSpine,
  getRiskPressure,
  getRiskPressureDrivers,
  getSuspenseEvent,
  getSuspenseState,
  limitText,
  makeEmptyScores,
  scoreFreeText,
  speechifyChoice,
} from "./gameLogic.js";
import {
  getSessionId,
  getSessionCode,
  saveCaseTelemetry,
  checkTelemetryHealth,
  saveErrorTelemetry,
  saveFeedbackTelemetry,
  fetchLeaderboard,
  telemetryEnabled,
} from "./telemetry.js";
import { buildLeaderboard, getLeaderboardHeadline } from "./ranking.js";
import { easyCognitionLabels, easyResourceLabels, easyRiskLabels, simplifyPlayerText } from "./playerLanguage.js";
import { DecisionRail } from "./components/DecisionRail.jsx";
import { DecisionDock } from "./components/DecisionDock.jsx";
import { MemoPanel } from "./components/MemoPanel.jsx";
import { StatusBoard } from "./components/StatusBoard.jsx";
import { GameMetricsDrawer } from "./components/GameMetricsDrawer.jsx";
import { GameHeader } from "./components/GameHeader.jsx";
import { DecisionReveal } from "./components/DecisionReveal.jsx";
import { RecoveryNotice } from "./components/RecoveryNotice.jsx";
import { SaveStatus } from "./components/SaveStatus.jsx";
import { ErrorLogPanel } from "./components/ErrorLogPanel.jsx";
import { RankingScreen } from "./screens/RankingScreen.jsx";
import { IntroScreen } from "./screens/IntroScreen.jsx";
import { ResultScreen } from "./screens/ResultScreen.jsx";
import { PlayScreen } from "./screens/PlayScreen.jsx";
import { useGameSaveState } from "./state/useGameSave.js";
import { useDecision } from "./state/useDecision.js";

const resourceMeta = {
  time: { label: easyResourceLabels.time, suffix: "시간", icon: Clock3 },
  capital: { label: easyResourceLabels.capital, suffix: "", icon: BriefcaseBusiness },
  trust: { label: easyResourceLabels.trust, suffix: "", icon: Users },
  legitimacy: { label: easyResourceLabels.legitimacy, suffix: "", icon: Shield },
  humanCost: { label: easyResourceLabels.humanCost, suffix: "", icon: AlertTriangle },
  fatigue: { label: easyResourceLabels.fatigue, suffix: "", icon: BarChart3 },
};

const GAME_TITLE = "임계점";
const GAME_SUBTITLE = "판단이 깊어지는 순간";
const GAME_LABEL = "CRITICAL POINT";
const MUSIC_PREF_KEY = "critical-point-music-enabled";
const TRACE_STORAGE_KEY = "critical-point-trace-v1";
const TRACE_MAX_ITEMS = 200;
const REPLAY_QUERY_KEY = "replay";
const NEXT_PARTICIPANT_MESSAGE_KEY = "critical-point-next-participant-message";

function encodeReplaySeed(seed) {
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(seed))));
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  } catch {
    return "";
  }
}

function decodeReplaySeed(value) {
  if (!value) return null;
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  } catch {
    return null;
  }
}

function getReplaySeedFromLocation() {
  try {
    return decodeReplaySeed(new URLSearchParams(globalThis.location?.search ?? "").get(REPLAY_QUERY_KEY));
  } catch {
    return null;
  }
}

function getTraceEvents() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(TRACE_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function appendTraceEvent(event = {}) {
  try {
    const next = [
      ...getTraceEvents(),
      { t: Date.now(), ...event },
    ].slice(-TRACE_MAX_ITEMS);
    sessionStorage.setItem(TRACE_STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return getTraceEvents();
  }
}

function createReplaySavedState(seed) {
  if (!seed || !isKnownCaseId(seed.currentCase) || !isNodeValidForCase(seed.currentCase, seed.nodeId)) return null;
  const replayLog = (Array.isArray(seed.log) ? seed.log : [])
    .filter((entry) => entry && typeof entry.nodeId === "string" && nodes[entry.nodeId])
    .map((entry) => {
      const choice = nodes[entry.nodeId]?.choices?.find((item) => item.id === entry.choiceId);
      return {
        nodeId: entry.nodeId,
        title: nodes[entry.nodeId]?.title ?? "",
        choiceId: typeof entry.choiceId === "string" ? entry.choiceId : "",
        choice: choice?.label ?? "",
        freeText: "",
        effect: {},
        cognition: {},
        triggers: [],
        responseTimeSec: 0,
        resourcesBefore: {},
        resourcesAfter: {},
        isSystemEvent: false,
      };
    });
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    playerName: "",
    playStyle: "instinct",
    dataConsent: false,
    started: true,
    paused: false,
    currentCase: seed.currentCase,
    completedCases: [],
    discoveredClues: [],
    caseResults: {},
    playtestFeedback: {},
    nodeId: seed.nodeId,
    resources: normalizeNumberMap(seed.resources, initialResources).value,
    log: replayLog,
    triggers: makeEmptyScores(triggerLabels),
    cognition: makeEmptyScores(cognitionLabels),
    freeText: "",
    echo: "재현 링크로 복원된 장면입니다.",
    nodeEnteredAt: Date.now(),
    pendingTelemetry: [],
    protocolUsed: false,
    timerPenaltyApplied: false,
    probeUsed: false,
  };
}

const playStyleOptions = [
  {
    id: "instinct",
    label: "감각형",
    title: "첫 반응을 믿는다",
    text: "전술 정보를 덜 보고 장면의 온도와 사람의 반응으로 결정합니다.",
    payoff: "직관 챌린지 보너스 강화",
  },
  {
    id: "auditor",
    label: "감사형",
    title: "근거를 끝까지 확인한다",
    text: "비용과 위험을 펼쳐 본 뒤, 설명 가능한 선택을 밀어붙입니다.",
    payoff: "전술 챌린지 보너스 강화",
  },
  {
    id: "mediator",
    label: "중재형",
    title: "대화로 압박을 낮춘다",
    text: "에코의 힌트와 관계의 맥락을 활용해 손실을 분산합니다.",
    payoff: "에코 힌트 비용 절감",
  },
];

const caseSequence = CASE_SEQUENCE;

const sceneVisuals = {
  case01: "/scene-case01.png",
  case02: "/scene-case02.png",
  case03: "/scene-case03.png",
  case04: "/scene-case04.png",
  case05: "/scene-case05.png",
  final: "/scene-final.png",
};

const legacyProfiles = {
  S: {
    label: "CLEAR SIGNAL",
    title: "이전 판단의 신뢰가 다음 사건을 받칩니다.",
    text: "직전 케이스에서 기준을 끝까지 설명해 냈습니다. 다음 사건은 작은 신뢰와 정당성을 품고 시작합니다.",
    effect: { trust: 4, legitimacy: 3 },
  },
  A: {
    label: "STABLE HAND",
    title: "이전 판단의 균형이 남아 있습니다.",
    text: "대부분의 압박을 통제했습니다. 다음 사건은 약간의 신뢰와 정당성을 가진 채 열립니다.",
    effect: { trust: 2, legitimacy: 1 },
  },
  B: {
    label: "UNFINISHED COST",
    title: "해결되지 않은 비용이 다음 사건으로 넘어왔습니다.",
    text: "사건은 통과했지만 설명되지 않은 손실이 남았습니다. 다음 사건은 피로를 안고 시작합니다.",
    effect: { fatigue: 2 },
  },
  C: {
    label: "OPEN WOUND",
    title: "지난 판단의 균열이 아직 닫히지 않았습니다.",
    text: "압박을 낮추지 못한 흔적이 다음 사건의 첫 질문이 됩니다. 정당성과 피로가 불리하게 출발합니다.",
    effect: { legitimacy: -2, fatigue: 4 },
  },
};

const musicModes = {
  intro: {
    label: "대기",
    interval: 860,
    volume: 0.12,
    wave: "sine",
    bass: [55, 55, 65.4, 49],
    notes: [220, null, 277.18, null, 196, 246.94, null, 164.81],
    chords: [[110, 164.81, 220], null, [98, 146.83, 196], null],
    hitEvery: 0,
    noiseEvery: 12,
  },
  controlled: {
    label: "안정",
    interval: 720,
    volume: 0.14,
    wave: "triangle",
    bass: [65.4, 73.42, 82.41, 73.42],
    notes: [261.63, null, 329.63, 392, null, 293.66, 349.23, null],
    chords: [[130.81, 196, 261.63], null, [146.83, 220, 293.66], null],
    hitEvery: 8,
    noiseEvery: 16,
  },
  unstable: {
    label: "불안정",
    interval: 520,
    volume: 0.16,
    wave: "triangle",
    bass: [73.42, 69.3, 82.41, 65.4],
    notes: [293.66, 311.13, null, 392, 349.23, null, 329.63, 277.18],
    chords: [[146.83, 220, 311.13], null, [138.59, 207.65, 277.18], null],
    hitEvery: 6,
    noiseEvery: 10,
  },
  critical: {
    label: "위기",
    interval: 360,
    volume: 0.19,
    wave: "sawtooth",
    bass: [49, 51.91, 55, 46.25],
    notes: [196, 207.65, null, 233.08, 246.94, null, 220, 207.65],
    chords: [[98, 146.83, 207.65], [92.5, 138.59, 196], null, [103.83, 155.56, 220]],
    hitEvery: 4,
    noiseEvery: 6,
  },
  result: {
    label: "결과",
    interval: 940,
    volume: 0.13,
    wave: "sine",
    bass: [65.4, 82.41, 98, 73.42],
    notes: [261.63, null, 392, 329.63, null, 440, 392, null],
    chords: [[130.81, 196, 261.63], [164.81, 246.94, 329.63], null, [146.83, 220, 293.66]],
    hitEvery: 0,
    noiseEvery: 18,
  },
};

function playTone(context, destination, frequency, duration, gainValue, type = "sine") {
  if (!frequency) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.04);
}

function playChord(context, destination, frequencies = [], duration = 1, gainValue = 0.06, type = "sine") {
  frequencies.filter(Boolean).forEach((frequency, index) => {
    playTone(context, destination, frequency, duration + index * 0.04, gainValue / Math.max(1, frequencies.length), type);
  });
}

function playNoiseHit(context, destination, duration = 0.18, gainValue = 0.08, filterFrequency = 900) {
  const sampleCount = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < sampleCount; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / sampleCount);
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const now = context.currentTime;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(filterFrequency, now);
  filter.Q.setValueAtTime(4, now);
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(now);
  source.stop(now + duration + 0.02);
}

function AdaptiveMusic({ modeKey }) {
  const [enabled, setEnabled] = useState(() => readStoredValue(MUSIC_PREF_KEY, "true") !== "false");
  const [audioState, setAudioState] = useState("starting");
  const contextRef = useRef(null);
  const masterGainRef = useRef(null);
  const timerRef = useRef(null);
  const stepRef = useRef(0);
  const pulseRef = useRef(null);
  const resumeRef = useRef(null);
  const modeRef = useRef(musicModes[modeKey] ?? musicModes.intro);
  const mode = musicModes[modeKey] ?? musicModes.intro;

  useEffect(() => {
    modeRef.current = mode;
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(mode.volume, contextRef.current.currentTime, 0.35);
    }
  }, [mode]);

  useEffect(() => {
    writeStoredValue(MUSIC_PREF_KEY, String(enabled));
    if (!enabled) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      setAudioState("off");
      masterGainRef.current?.gain.setTargetAtTime(0.0001, contextRef.current?.currentTime ?? 0, 0.08);
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setAudioState("unsupported");
      return;
    }
    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;
    if (!masterGainRef.current) {
      masterGainRef.current = context.createGain();
      masterGainRef.current.gain.value = modeRef.current.volume;
      masterGainRef.current.connect(context.destination);
    }

    function pulse() {
      if (context.state === "suspended") return;
      const currentMode = modeRef.current;
      const step = stepRef.current;
      const note = currentMode.notes[step % currentMode.notes.length];
      const bass = currentMode.bass[Math.floor(step / 4) % currentMode.bass.length];
      const chord = currentMode.chords[Math.floor(step / 4) % currentMode.chords.length];
      playTone(context, masterGainRef.current, note, currentMode.interval / 1200, 0.3, currentMode.wave);
      if (step % 4 === 0) {
        playTone(context, masterGainRef.current, bass, currentMode.interval / 650, 0.2, "sine");
        playChord(context, masterGainRef.current, chord ?? [], currentMode.interval / 420, 0.16, "triangle");
      }
      if (currentMode.hitEvery > 0 && step % currentMode.hitEvery === 0) {
        playTone(context, masterGainRef.current, bass * 2, 0.08, 0.08, "square");
      }
      if (currentMode.noiseEvery > 0 && step % currentMode.noiseEvery === 0) {
        playNoiseHit(context, masterGainRef.current, 0.12, currentMode.volume * 0.45, 700 + step % 5 * 180);
      }
      stepRef.current += 1;
    }

    pulseRef.current = pulse;
    async function resumeAudio() {
      try {
        await context.resume?.();
        setAudioState(context.state === "running" ? "running" : "blocked");
        if (context.state === "running") pulse();
      } catch (error) {
        console.warn("Audio resume blocked", error);
        setAudioState("blocked");
      }
    }
    resumeRef.current = resumeAudio;
    context.onstatechange = () => {
      setAudioState(context.state === "running" ? "running" : context.state === "closed" ? "off" : "blocked");
    };
    function resumeAfterAutoplayBlock() {
      resumeAudio();
    }
    window.addEventListener("pointerdown", resumeAfterAutoplayBlock, { passive: true });
    window.addEventListener("keydown", resumeAfterAutoplayBlock);
    window.addEventListener("touchstart", resumeAfterAutoplayBlock, { passive: true });

    pulse();
    resumeAudio();
    timerRef.current = window.setInterval(pulse, modeRef.current.interval);
    return () => {
      window.clearInterval(timerRef.current);
      window.removeEventListener("pointerdown", resumeAfterAutoplayBlock);
      window.removeEventListener("keydown", resumeAfterAutoplayBlock);
      window.removeEventListener("touchstart", resumeAfterAutoplayBlock);
      if (pulseRef.current === pulse) pulseRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !timerRef.current || !pulseRef.current) return;
    window.clearInterval(timerRef.current);
    pulseRef.current();
    timerRef.current = window.setInterval(pulseRef.current, modeRef.current.interval);
  }, [enabled, modeKey]);

  function startAudioFromGesture() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      setAudioState("unsupported");
      return;
    }
    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;
    if (!masterGainRef.current) {
      masterGainRef.current = context.createGain();
      masterGainRef.current.gain.value = modeRef.current.volume;
      masterGainRef.current.connect(context.destination);
    }
    context.resume().then(() => {
      setAudioState(context.state === "running" ? "running" : "blocked");
      if (context.state === "running") pulseRef.current?.();
    }).catch(() => setAudioState("blocked"));
  }

  return (
    <button
      type="button"
      className={enabled ? "music-toggle active" : "music-toggle"}
      onClick={() => {
        if (!enabled) {
          setEnabled(true);
          startAudioFromGesture();
          return;
        }
        if (enabled && audioState !== "running" && audioState !== "unsupported") {
          resumeRef.current?.();
          return;
        }
        setEnabled((value) => !value);
      }}
      aria-label={enabled ? (audioState === "running" ? "배경음악 끄기" : "배경음악 재생 시작") : "배경음악 켜기"}
      title={enabled ? (audioState === "running" ? "배경음악 끄기" : "배경음악 재생 시작") : "배경음악 켜기"}
    >
      {enabled && audioState === "running" ? <Volume2 size={18} /> : <VolumeX size={18} />}
      <span>{enabled ? (audioState === "running" ? mode.label : audioState === "unsupported" ? "미지원" : "소리 시작") : "꺼짐"}</span>
    </button>
  );
}

const nextCaseSignals = {
  case01: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case02",
    title: "사건 02 - 가짜 신호",
    button: "사건 02 시작",
    premise:
      "동료가 내부 정보 유출자로 지목됩니다. 증거는 명확하지만, 사람의 맥락은 다른 이야기를 합니다.",
    hook:
      "트리거랩은 방금 당신이 손실을 누구에게 먼저 배분했는지 기록했습니다. 다음 사건에서는 그 기준이 사람을 믿을지, 기록을 믿을지의 압박으로 바뀝니다.",
  },
  case02: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case03",
    title: "사건 03 - 경쟁자의 반격",
    button: "사건 03 시작",
    premise:
      "오진우와 같은 자료를 받고 동시에 해결안을 냅니다. 이번에는 경쟁심이 판단을 빠르게 만드는지, 얕게 만드는지 확인합니다.",
    hook:
      "당신이 증거와 신뢰 사이에서 망설인 시간은 다음 테스트의 난이도가 됩니다. 오진우는 그 망설임을 점수판으로 바꿔 보여줄 것입니다.",
  },
  case03: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case04",
    title: "사건 04 - 치러야 할 대가",
    button: "사건 04 시작",
    premise:
      "작은 규칙 위반이 수천 명을 살릴 수 있습니다. 이번에는 좋은 결과가 절차 훼손을 어디까지 정당화하는지 묻습니다.",
    hook:
      "경쟁 압박 속에서 당신이 줄인 검증과 남긴 근거가 분리됩니다. 다음 사건은 좋은 결과를 얻기 위해 어느 선까지 넘을 수 있는지 묻습니다.",
  },
  case04: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case05",
    title: "사건 05 - 범인은 없었다",
    button: "사건 05 시작",
    premise:
      "명백한 악인은 없습니다. 모두가 합리적으로 움직였지만 시스템은 가장 조용한 사람들을 밀어냈습니다.",
    hook:
      "명분 있는 예외를 허용한 기록은 사라지지 않습니다. 다음 사건에서는 누구도 규칙을 어기지 않았는데도 피해가 생깁니다.",
  },
  case05: {
    eyebrow: "FINAL CASE UNLOCKED",
    caseId: "final",
    title: "마지막 사건 - 트리거랩의 진실",
    button: "마지막 사건 시작",
    premise:
      "모든 사건의 로그가 하나의 폴더로 연결됩니다. 이제 트리거랩이 당신의 사고 조건을 어떻게 사용했는지 마주합니다.",
    hook:
      "악인이 없는 실패까지 통과한 뒤, 남는 것은 사건이 아니라 당신의 반응 패턴입니다. 마지막 폴더에는 그 패턴이 사건 설계에 쓰인 흔적이 있습니다.",
  },
};

const playGuideItems = [
  {
    title: "에코",
    text: "정답을 주는 사람이 아니라, 방금 선택에서 빠진 점을 알려주는 도우미입니다.",
  },
  {
    title: "판 바꾸기",
    text: "보기 중 마음에 드는 답이 없을 때 사람, 조건, 순서를 직접 새로 정합니다.",
  },
  {
    title: "상태 변화",
    text: "선택 뒤에 달라지는 시간, 현금, 믿음, 공정함, 사람 피해, 지침을 보여줍니다.",
  },
  {
    title: "반응 버튼",
    text: "당신이 특히 오래 고민하거나 쉽게 움직이는 마음의 지점입니다. 다음 사건에도 영향을 줍니다.",
  },
];

const triggerLabSignals = {
  case01: "관찰 항목: 손실 배분 순서, 보호 대상, 공개 지연 허용선",
  case02: "관찰 항목: 로그 신뢰도, 관계 신뢰도, 절차 밖 확인 허용선",
  case03: "관찰 항목: 경쟁 상황의 검증 생략, 속도 보상 반응, 점수판 민감도",
  case04: "관찰 항목: 좋은 결과를 위한 예외 허용선, 기록 은폐 저항, 공개 감사 선호",
  case05: "관찰 항목: 단일 책임 욕구, 구조 실패 인내, 조용한 피해자 감지",
  final: "관찰 항목: 자기 조건 인식, 프로필 공개 범위, 시스템 존치 허용선",
};

const debugToolsEnabled =
  import.meta.env.VITE_ENABLE_DEBUG_TOOLS === "true" ||
  (import.meta.env.DEV && new URLSearchParams(globalThis.location?.search ?? "").get("debug") === "1");
const DEBUG_RENDER_CRASH_KEY = "critical-point-force-render-error";
let saveSuppressed = false;
const replaySeed = getReplaySeedFromLocation();

export function suppressSaves() {
  saveSuppressed = true;
}

function isKnownCaseId(caseId) {
  return caseSequence.includes(caseId);
}

function isNodeValidForCase(caseId, nodeId) {
  if (!isKnownCaseId(caseId) || typeof nodeId !== "string") return false;
  return Boolean(nodeOrders[caseId]?.includes(nodeId) || CASE_RESULT_NODES[caseId] === nodeId);
}

function repairSavedRoute(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return null;
  const currentCase = isKnownCaseId(state.currentCase) ? state.currentCase : "case01";
  const nodeId = isNodeValidForCase(currentCase, state.nodeId) ? state.nodeId : CASE_START_NODES[currentCase];
  if (currentCase === state.currentCase && nodeId === state.nodeId) return state;
  reportSilentFailure("route-repair", { from: state.nodeId, to: nodeId, currentCase });
  return {
    ...state,
    currentCase,
    nodeId,
    paused: true,
    lastError: {
      id: `repair-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      source: "save-integrity",
      message: "Saved route was repaired before resume.",
      currentCase,
      nodeId,
    },
  };
}

function normalizeNumberMap(value, defaults) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { value: { ...defaults }, changed: true };
  }

  const allowedKeys = Object.keys(defaults);
  const sourceKeys = Object.keys(value);
  let changed = sourceKeys.length !== allowedKeys.length;
  const next = {};

  allowedKeys.forEach((key) => {
    const candidate = value[key];
    if (Number.isFinite(candidate)) {
      next[key] = candidate;
      return;
    }
    next[key] = defaults[key];
    changed = true;
  });

  return { value: next, changed };
}

function normalizeSavedGameplayState(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return null;

  const normalizedResources = normalizeNumberMap(state.resources, initialResources);
  const normalizedTriggers = normalizeNumberMap(state.triggers, makeEmptyScores(triggerLabels));
  const normalizedCognition = normalizeNumberMap(state.cognition, makeEmptyScores(cognitionLabels));

  if (!normalizedResources.changed && !normalizedTriggers.changed && !normalizedCognition.changed) {
    return state;
  }

  return {
    ...state,
    resources: normalizedResources.value,
    triggers: normalizedTriggers.value,
    cognition: normalizedCognition.value,
    paused: true,
    lastError: state.lastError ?? {
      id: `repair-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      source: "save-integrity",
      message: "Saved gameplay metrics were repaired before resume.",
      currentCase: state.currentCase,
      nodeId: state.nodeId,
    },
  };
}

function areSavedValuesEquivalent(left, right) {
  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return left === right;
  }
}

function normalizeSavedArray(value, normalizeItem) {
  if (!Array.isArray(value)) return { value: [], changed: true };
  let changed = false;
  const next = value
    .map((item) => {
      const normalized = normalizeItem(item);
      if (!areSavedValuesEquivalent(normalized, item)) changed = true;
      return normalized;
    })
    .filter((item) => {
      const keep = item !== null;
      if (!keep) changed = true;
      return keep;
    });
  if (next.length !== value.length) changed = true;
  return { value: next, changed };
}

function normalizeSavedPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeSavedEffect(value) {
  const source = normalizeSavedPlainObject(value);
  return Object.fromEntries(
    Object.entries(source).filter(([, effectValue]) => Number.isFinite(effectValue)),
  );
}

function normalizeSavedLogEntry(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    reportSilentFailure("log-entry-drop", { nodeId: entry?.nodeId, reason: "invalid-entry" });
    return null;
  }
  const nodeId = typeof entry.nodeId === "string" ? entry.nodeId : "";
  if (!nodeId || (!nodes[nodeId] && !Object.values(CASE_RESULT_NODES).includes(nodeId))) {
    reportSilentFailure("log-entry-drop", { nodeId, reason: "unknown-node" });
    return null;
  }
  return {
    ...entry,
    nodeId,
    title: typeof entry.title === "string" ? entry.title : nodes[nodeId]?.title ?? "",
    choiceId: typeof entry.choiceId === "string" ? entry.choiceId : "",
    choice: typeof entry.choice === "string" ? entry.choice : "",
    spokenChoice: typeof entry.spokenChoice === "string" ? entry.spokenChoice : "",
    freeText: normalizeSavedText(entry.freeText, FREE_TEXT_MAX_LENGTH),
    effect: normalizeSavedEffect(entry.effect),
    cognition: normalizeSavedEffect(entry.cognition),
    triggers: Array.isArray(entry.triggers) ? entry.triggers.filter((trigger) => typeof trigger === "string") : [],
    responseTimeSec: Number.isFinite(entry.responseTimeSec) ? entry.responseTimeSec : 0,
    resourcesBefore: normalizeSavedPlainObject(entry.resourcesBefore),
    resourcesAfter: normalizeSavedPlainObject(entry.resourcesAfter),
    isSystemEvent: Boolean(entry.isSystemEvent),
  };
}

function normalizeSavedClue(clue) {
  if (!clue || typeof clue !== "object" || Array.isArray(clue) || typeof clue.id !== "string") return null;
  return {
    ...clue,
    title: typeof clue.title === "string" ? clue.title : clue.id,
    text: typeof clue.text === "string" ? clue.text : "",
  };
}

function normalizeSavedCaseSummaryShape(summary) {
  if (!summary || typeof summary !== "object" || Array.isArray(summary)) return null;
  const tuple = (value, fallback) => (
    Array.isArray(value) && typeof value[0] === "string" && Number.isFinite(value[1]) ? value : fallback
  );
  return {
    ...summary,
    schemaVersion: Number.isFinite(summary.schemaVersion) ? summary.schemaVersion : SAVE_SCHEMA_VERSION,
    primary: tuple(summary.primary, ["responsibility", 0]),
    secondary: tuple(summary.secondary, ["protection", 0]),
    thinking: tuple(summary.thinking, ["persistence", 0]),
    freeCount: Number.isFinite(summary.freeCount) ? summary.freeCount : 0,
    averageResponseTime: Number.isFinite(summary.averageResponseTime) ? summary.averageResponseTime : 0,
    challengeClearCount: Number.isFinite(summary.challengeClearCount) ? summary.challengeClearCount : 0,
    reducedRiskCount: Number.isFinite(summary.reducedRiskCount) ? summary.reducedRiskCount : 0,
    rhythmScore: Number.isFinite(summary.rhythmScore) ? summary.rhythmScore : 0,
    cognitionScore: Number.isFinite(summary.cognitionScore) ? summary.cognitionScore : 0,
    pressureAdaptScore: Number.isFinite(summary.pressureAdaptScore) ? summary.pressureAdaptScore : 0,
    reflectionScore: Number.isFinite(summary.reflectionScore) ? summary.reflectionScore : 0,
    exploitPenalty: Number.isFinite(summary.exploitPenalty) ? summary.exploitPenalty : 0,
    burstScore: Number.isFinite(summary.burstScore) ? summary.burstScore : Number.isFinite(summary.momentumScore) ? summary.momentumScore : 0,
    momentumScore: Number.isFinite(summary.momentumScore) ? summary.momentumScore : 0,
    momentumTier: typeof summary.momentumTier === "string" ? summary.momentumTier : "BUILDING",
    rank: typeof summary.rank === "string" ? summary.rank : "C",
    outcomeChoiceId: typeof summary.outcomeChoiceId === "string" ? summary.outcomeChoiceId : null,
    outcomeNodeId: typeof summary.outcomeNodeId === "string" ? summary.outcomeNodeId : null,
  };
}

function normalizeSavedObjectMap(value, normalizeItem) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { value: {}, changed: true };
  let changed = false;
  const next = {};
  Object.entries(value).forEach(([key, item]) => {
    const normalized = normalizeItem(item, key);
    if (!areSavedValuesEquivalent(normalized, item)) changed = true;
    if (normalized !== null) next[key] = normalized;
  });
  if (Object.keys(next).length !== Object.keys(value).length) changed = true;
  return { value: next, changed };
}

function normalizeSavedTelemetryQueue(value) {
  if (!Array.isArray(value)) return { value: [], changed: true };
  const next = value.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      typeof item.id === "string" &&
      TELEMETRY_QUEUE_TYPES.includes(item.type) &&
      typeof item.label === "string" &&
      item.payload &&
      typeof item.payload === "object" &&
      !Array.isArray(item.payload),
  );
  return { value: next, changed: next.length !== value.length };
}

function normalizeSavedNestedState(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) return null;

  const normalizedCompletedCases = normalizeSavedArray(
    state.completedCases,
    (caseId) => (isKnownCaseId(caseId) ? caseId : null),
  );
  const normalizedDiscoveredClues = normalizeSavedArray(state.discoveredClues, normalizeSavedClue);
  const normalizedLog = normalizeSavedArray(state.log, normalizeSavedLogEntry);
  const normalizedCaseResults = normalizeSavedObjectMap(
    state.caseResults,
    (summary, caseId) => (isKnownCaseId(caseId) ? normalizeSavedCaseSummaryShape(summary) : null),
  );
  const normalizedFeedback = normalizeSavedObjectMap(
    state.playtestFeedback,
    (feedback, caseId) => (isKnownCaseId(caseId) ? normalizeFeedback(feedback) : null),
  );
  const normalizedTelemetry = normalizeSavedTelemetryQueue(state.pendingTelemetry);
  const changed =
    normalizedCompletedCases.changed ||
    normalizedDiscoveredClues.changed ||
    normalizedLog.changed ||
    normalizedCaseResults.changed ||
    normalizedFeedback.changed ||
    normalizedTelemetry.changed;

  if (!changed) return state;
  return {
    ...state,
    completedCases: normalizedCompletedCases.value,
    discoveredClues: normalizedDiscoveredClues.value,
    log: normalizedLog.value,
    caseResults: normalizedCaseResults.value,
    playtestFeedback: normalizedFeedback.value,
    pendingTelemetry: normalizedTelemetry.value,
    paused: true,
    lastError: state.lastError ?? {
      id: `repair-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      source: "save-integrity",
      message: "Saved nested gameplay data was repaired before resume.",
      currentCase: state.currentCase,
      nodeId: state.nodeId,
    },
  };
}

function shouldCaptureSaveSlot(previousState, nextState) {
  if (!nextState?.saveSchemaVersion) return false;
  if (nextState.lastError) return true;
  if (!previousState?.started && nextState.started) return true;
  if (previousState?.currentCase !== nextState.currentCase) return true;
  if (previousState?.nodeId !== nextState.nodeId) return true;
  const previousCompletedCount = Array.isArray(previousState?.completedCases) ? previousState.completedCases.length : 0;
  const nextCompletedCount = Array.isArray(nextState.completedCases) ? nextState.completedCases.length : 0;
  return previousCompletedCount !== nextCompletedCount;
}

function createSafeDomSnapshot(documentRef = globalThis.document) {
  try {
    const root = documentRef?.querySelector?.("#root");
    if (!root) return "";
    const elements = [...root.querySelectorAll("main, section, article, button, input, select, textarea, [role], [aria-label]")].slice(0, 40);
    return elements
      .map((element) => {
        const tag = element.tagName.toLowerCase();
        const className = typeof element.className === "string" ? element.className.split(/\s+/).filter(Boolean).slice(0, 3).join(".") : "";
        const role = element.getAttribute("role");
        const ariaLabel = element.getAttribute("aria-label");
        return [tag, className ? `.${className}` : "", role ? `[role=${role}]` : "", ariaLabel ? "[aria-label]" : ""].join("");
      })
      .join(" > ")
      .slice(0, 1800);
  } catch {
    return "";
  }
}

function getRouteMarker(entry) {
  const nodeId = typeof entry?.nodeId === "string" ? entry.nodeId : "";
  const scene = nodes[nodeId];
  if (scene?.phase === "BRANCH BRIEFING") return { label: "분기 시작", tone: "branch" };
  if (nodeId.includes("aftershock")) return { label: "후폭풍", tone: "aftermath" };
  if (nodeId.includes("reaction")) return { label: "즉시 반응", tone: "reaction" };
  if (["WITNESS", "TRACE", "ASSEMBLY", "BARGAIN", "AUDIT", "PUBLIC", "PATTERN", "VOICE", "DILEMMA"].some((phase) => scene?.phase?.includes(phase))) {
    return { label: "증거 추적", tone: "evidence" };
  }
  return { label: "핵심 판단", tone: "decision" };
}

function getSavedRecoveryState() {
  const saved = parseCurrentSavedState(readStoredValue(STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
  return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : null;
}

function createErrorRecoveryEntry(error, errorInfo = {}, source = "runtime") {
  const saved = getSavedRecoveryState();
  const serialized = serializeError(error);
  const occurredAt = new Date().toISOString();
  const context = createSafeErrorContext(saved ?? {}, source);

  return {
    id: `error-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    occurredAt,
    error: serialized,
    componentStack: errorInfo?.componentStack ?? "",
    domSnapshot: createSafeDomSnapshot(),
    viewport: {
      width: globalThis.innerWidth ?? 0,
      height: globalThis.innerHeight ?? 0,
    },
    context,
    trace: getTraceEvents(),
  };
}

function persistErrorRecovery(entry) {
  appendStoredErrorLog(entry);
  const saved = getSavedRecoveryState();
  if (saved) {
    const previousError = saved.lastError;
    const sameRecoveryPoint =
      previousError?.currentCase === entry.context.currentCase &&
      previousError?.nodeId === entry.context.nodeId;
    const recoveredSave = {
      ...saved,
      savedAt: entry.occurredAt,
      paused: true,
      lastError: {
        id: entry.id,
        occurredAt: entry.occurredAt,
        source: entry.context.source,
        message: entry.error.message,
        currentCase: entry.context.currentCase,
        nodeId: entry.context.nodeId,
        retryCount: sameRecoveryPoint ? (Number(previousError.retryCount) || 0) + 1 : 1,
      },
    };
    writeStoredValue(STORAGE_KEY, JSON.stringify(recoveredSave));
    appendSaveSlot(recoveredSave);
  }
}

function createErrorTelemetryPayload(entry) {
  const sessionId = getSessionId();
  return {
    session_id: sessionId,
    session_code: getSessionCode(sessionId),
    occurred_at: entry.occurredAt,
    source: entry.context.source,
    current_case: entry.context.currentCase,
    node_id: entry.context.nodeId,
    error_name: entry.error.name,
    error_message: entry.error.message,
    error_stack: entry.error.stack,
    component_stack: entry.componentStack,
    dom_snapshot: entry.domSnapshot ?? "",
    viewport: entry.viewport ?? {},
    context: entry.context,
  };
}

function queueSavedErrorTelemetry(entry) {
  const saved = getSavedRecoveryState();
  if (!saved) return false;
  const pendingTelemetry = Array.isArray(saved.pendingTelemetry) ? saved.pendingTelemetry : [];
  const nextQueue = [
    ...pendingTelemetry.filter((item) => item.id !== entry.id),
    {
      id: entry.id,
      queuedAt: new Date().toISOString(),
      type: "error",
      label: `${entry.context.currentCase} / ${entry.context.nodeId} 에러 로그`,
      payload: createErrorTelemetryPayload(entry),
    },
  ];
  return writeStoredValue(
    STORAGE_KEY,
    JSON.stringify({
      ...saved,
      pendingTelemetry: nextQueue,
      savedAt: entry.occurredAt,
    }),
  );
}

function reportErrorRecovery(entry) {
  if (!telemetryEnabled) return;
  const saved = getSavedRecoveryState();
  if (!saved?.dataConsent) return;
  saveErrorTelemetry(createErrorTelemetryPayload(entry)).catch((telemetryError) => {
    console.warn("Critical Point error telemetry failed", telemetryError);
    queueSavedErrorTelemetry(entry);
  });
}

function recordAppError(error, errorInfo = {}, source = "runtime") {
  const saved = getSavedRecoveryState();
  appendTraceEvent({
    kind: "error",
    caseId: saved?.currentCase,
    nodeId: saved?.nodeId,
    logLength: saved?.log?.length ?? 0,
    note: serializeError(error).message,
  });
  const entry = createErrorRecoveryEntry(error, errorInfo, source);
  persistErrorRecovery(entry);
  reportErrorRecovery(entry);
  return entry;
}

let consoleErrorHookBusy = false;

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

// The error boundary and reportSilentFailure already write their own entries,
// so skip their console output instead of logging the same failure twice.
function isAlreadyRecordedConsoleError(text) {
  return text.startsWith("Critical Point render error") || text.includes("[silent:");
}

function reportSilentFailure(code, detail = {}) {
  const error = new Error(`[silent:${code}] ${JSON.stringify(detail)}`);
  error.name = "SilentRouteFailure";
  recordAppError(error, {}, `silent-${code}`);
  if (import.meta.env.DEV) console.warn(error);
  return error;
}

export function App() {
  const saved = useMemo(() => {
    const replay = createReplaySavedState(replaySeed);
    const rawSaved = readStoredValue(STORAGE_KEY, "null");
    const hasStoredSave = Boolean(replay) || (typeof rawSaved === "string" && rawSaved !== "null" && rawSaved !== "");
    const parsed = replay ?? parseCurrentSavedState(rawSaved, SAVE_SCHEMA_VERSION);
    const repaired = normalizeSavedNestedState(normalizeSavedGameplayState(repairSavedRoute(parsed)));
    if (!isSavedStateShapeValid(repaired)) {
      // A first-time visitor simply has no save yet; only a save that exists and
      // fails validation is a real failure worth spending an error-log slot on.
      if (hasStoredSave) {
        reportSilentFailure("save-shape", {
          currentCase: repaired?.currentCase,
          nodeId: repaired?.nodeId,
          invalidKeys: getInvalidSavedStateKeys(repaired),
        });
      }
      return null;
    }
    const resumed = repaired.started && repaired.paused ? { ...repaired, paused: false } : repaired;
    if (resumed !== parsed) {
      writeStoredValue(STORAGE_KEY, JSON.stringify(resumed));
      appendSaveSlot(resumed);
    }
    return resumed;
  }, []);
  const sessionId = useMemo(() => getSessionId(), []);
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);

  const {
    pendingChoice, setPendingChoice, decisionReveal, setDecisionReveal,
    decisionSeconds, setDecisionSeconds,
  } = useDecision();

  const {
    playerName, setPlayerName, playStyle, setPlayStyle, openingLegacy, setOpeningLegacy,
    dataConsent, setDataConsent, started, setStarted, currentCase, setCurrentCase,
    completedCases, setCompletedCases, discoveredClues, setDiscoveredClues,
    caseResults, setCaseResults, playtestFeedback, setPlaytestFeedback, nodeId, setNodeId,
    resources, setResources, log, setLog, triggers, setTriggers, cognition, setCognition,
    freeText, setFreeText, lastSavedAt, setLastSavedAt, isPausedSave, setIsPausedSave,
    pendingTelemetry, setPendingTelemetry, protocolUsed, setProtocolUsed,
    timerPenaltyApplied, setTimerPenaltyApplied, probeUsed, setProbeUsed,
  } = useGameSaveState({
    saved,
    initialResources,
    triggerDefaults: makeEmptyScores(triggerLabels),
    cognitionDefaults: makeEmptyScores(cognitionLabels),
    normalizeText: (value) => normalizeSavedText(value, FREE_TEXT_MAX_LENGTH),
  });
  const [endingStep, setEndingStep] = useState(0);
  const [endingTwistIndex, setEndingTwistIndex] = useState(0);
  const [endingQuietReady, setEndingQuietReady] = useState(false);
  const [nextParticipantMessage, setNextParticipantMessage] = useState(() => readStoredValue(NEXT_PARTICIPANT_MESSAGE_KEY, ""));
  const [echo, setEcho] = useState(
    () => normalizeSavedText(saved?.echo) || "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.",
  );
  const [nodeEnteredAt, setNodeEnteredAt] = useState(saved?.nodeEnteredAt ?? Date.now());
  const [copyStatus, setCopyStatus] = useState("");
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const pendingTelemetryRef = useRef(saved?.pendingTelemetry ?? []);
  const [isRetryingTelemetry, setIsRetryingTelemetry] = useState(false);
  const [showTacticalDetails, setShowTacticalDetails] = useState(false);
  const [memoOpened, setMemoOpened] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardStatus, setLeaderboardStatus] = useState("idle");
  const [leaderboardError, setLeaderboardError] = useState("");
  const [isOnline, setIsOnline] = useState(() => globalThis.navigator?.onLine !== false);
  const [telemetryStatus, setTelemetryStatus] = useState({
    tone: telemetryEnabled && isOnline ? "ready" : "local",
    text:
      !isOnline
        ? "오프라인. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다."
        : telemetryEnabled
          ? "원격 저장 준비됨. 데이터 제공 동의 시 케이스 완료 로그가 저장됩니다."
          : "로컬 저장. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
  });
  const [lastRecoveredError, setLastRecoveredError] = useState(saved?.lastError ?? null);
  const [showRecoveryCenter, setShowRecoveryCenter] = useState(() => readStoredValue(RECOVERY_CENTER_STORAGE_KEY, "") === "1");
  const [showErrorLog, setShowErrorLog] = useState(() => readStoredValue(RECOVERY_CENTER_STORAGE_KEY, "") === "1");
  const [localErrorEntries, setLocalErrorEntries] = useState(() => {
    const rawErrorLog = readStoredValue(ERROR_LOG_STORAGE_KEY, "null");
    const localErrorLog = parseErrorLog(rawErrorLog);
    if (localErrorLog && rawErrorLog !== JSON.stringify(localErrorLog)) {
      writeStoredValue(ERROR_LOG_STORAGE_KEY, JSON.stringify(localErrorLog));
    }
    return Array.isArray(localErrorLog?.entries) ? localErrorLog.entries : [];
  });
  const [saveSlots, setSaveSlots] = useState(() => {
    const localSaveSlots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"));
    return Array.isArray(localSaveSlots?.slots) ? localSaveSlots.slots : [];
  });
  const [telemetryHealth, setTelemetryHealth] = useState({ status: "idle", tables: [] });
  const [telemetryRetryInfo, setTelemetryRetryInfo] = useState({ attempt: 0, nextRetryAt: "" });
  const [debugCaseId, setDebugCaseId] = useState("case05");
  const [debugNodeId, setDebugNodeId] = useState("c5_start");
  const debugCaseIdRef = useRef("case05");
  const debugNodeIdRef = useRef("c5_start");
  const debugCaseSelectRef = useRef(null);
  const debugNodeSelectRef = useRef(null);
  const telemetryRetryAttemptRef = useRef(0);
  const telemetryRetryTimerRef = useRef(null);
  const hadDecisionRevealRef = useRef(false);
  const decisionRevealRef = useRef(null);
  const choiceButtonsRef = useRef(new Map());
  const choiceHoldTimerRef = useRef(null);
  const choiceHoldTriggeredRef = useRef(false);
  const commitConsoleRef = useRef(null);
  const commitConfirmRef = useRef(null);
  const visibilityPauseRef = useRef(null);
  const freeTextSaveTimerRef = useRef(null);

  const fallbackCaseId = seasonCasesBase.some((caseItem) => caseItem.id === currentCase)
    ? currentCase
    : "case01";
  const activePlayStyle = playStyleOptions.find((style) => style.id === playStyle) ?? playStyleOptions[0];
  const activeNodeOrder = nodeOrders[fallbackCaseId] ?? nodeOrders.case01;
  const debugNodeOptions = nodeOrders[debugCaseId] ?? nodeOrders.case05;
  const fallbackNodeId = activeNodeOrder[0] ?? "start";
  const resolvedNodeId = nodes[nodeId] ? nodeId : fallbackNodeId;
  const branchOpeningNodeIds = new Set([
    CASE_START_NODES[fallbackCaseId],
    ...Object.values(caseOpeningRoutes[fallbackCaseId] ?? {}),
  ]);
  const isOpeningNode = branchOpeningNodeIds.has(resolvedNodeId);
  const node = nodes[resolvedNodeId] ?? nodes.start;
  const isResult = Object.values(CASE_RESULT_NODES).includes(nodeId);
  const activeCaseMeta = seasonCasesBase.find((caseItem) => caseItem.id === currentCase);
  const seasonCases = seasonCasesBase.map((caseItem) => {
    const isCompleted = completedCases.includes(caseItem.id);
    const isCurrent = caseItem.id === currentCase;
    const isUnlocked =
      caseItem.id === "case01" ||
      caseItem.id === "case02" && completedCases.includes("case01") ||
      caseItem.id === "case03" && completedCases.includes("case02") ||
      caseItem.id === "case04" && completedCases.includes("case03") ||
      caseItem.id === "case05" && completedCases.includes("case04") ||
      caseItem.id === "final" && completedCases.includes("case05") ||
      isCurrent;
    return {
      ...caseItem,
      status: isCompleted ? "COMPLETE" : isCurrent ? "PLAYING" : isUnlocked ? "OPEN" : "LOCKED",
    };
  });
  const speakerProfile = characterProfiles[node?.speaker] ?? {
    role: "사건 관계자",
    stance: "상황 설명",
    job: "현재 국면의 핵심 정보를 전달한다.",
    appearance: "정돈되지 않은 자료 더미 앞에 사건 관계자가 앉아 있다.",
    thought: "이 장면에서 놓친 전제가 있는지 다시 확인한다.",
    gesture: "사건 관계자는 잠깐 말을 멈추고, 테이블 위 자료를 다시 바라본다.",
    voice: "상황을 과장하지 않고 필요한 정보만 전달한다.",
    line: "지금 결정하면, 무엇이 다음 장면으로 넘어갑니까?",
  };
  const latestBeat = log.at(-1)?.sceneBeat ?? "";
  const freeTextSignals = getFreeTextSignals(freeText);
  const activeFreeTextSignalCount = freeTextSignals.filter((signal) => signal.active).length;
  const freeTextPreview = freeText.trim() ? scoreFreeText(freeText) : null;
  const evidenceCount = discoveredClues.length + (memoOpened ? 1 : 0) + (probeUsed ? 1 : 0) + activeFreeTextSignalCount;
  useEffect(() => {
    setMemoOpened(false);
  }, [resolvedNodeId]);
  const privacySignals = detectPrivacySignals(freeText);
  const activePrivacySignals = privacySignals.filter((signal) => signal.active);
  const freeTextBlockedByPrivacy = activePrivacySignals.length > 0;
  const freeTextSuccessEntries = log.filter((entry) => entry.freeTextSuccess);
  const currentCaseFreeTextSuccessCount = freeTextSuccessEntries.filter(
    (entry) => entry.caseId === fallbackCaseId,
  ).length;
  const aftermathNodeId = fallbackCaseId === "final" ? "f_aftershock" : `${fallbackCaseId.replace("case", "c")}_aftershock`;
  const adaptiveChoiceUnlocked = resolvedNodeId === aftermathNodeId && currentCaseFreeTextSuccessCount >= 2;
  const adaptiveChoice = adaptiveChoiceUnlocked
    ? {
        id: `${fallbackCaseId}_adaptive_reframe`,
        label: "앞서 남긴 문장을 공개 기준으로 삼는다",
        effect: { legitimacy: 7, trust: 5, fatigue: 4 },
        next: node?.choices?.[0]?.next ?? "result",
        cognition: { reframing: 2, persistence: 1 },
        adaptive: true,
      }
    : null;
  const fixedChoices = [
    ...(node?.choices?.filter((choice) => choice.type !== "free") ?? []),
    ...(adaptiveChoice ? [adaptiveChoice] : []),
  ];
  const freeChoice = node?.choices?.find((choice) => choice.type === "free");
  const latestFreeTextSuccess = [...log].reverse().find(
    (entry) => entry.caseId === fallbackCaseId && entry.freeTextSuccess && entry.freeText,
  );
  const currentAverageResponseTime =
    log.length > 0
      ? Math.round(log.reduce((sum, entry) => sum + (entry.responseTimeSec ?? 0), 0) / log.length)
      : 0;
  const riskPressure = getRiskPressure(resources);
  const riskTier =
    riskPressure >= 60 ? "CRITICAL" : riskPressure >= 35 ? "UNSTABLE" : "CONTROLLED";
  const suspenseState = getSuspenseState({
    riskPressure,
    decisionSeconds,
    log,
    currentCase,
  });
  const narrativeSpine = buildNarrativeSpine({
    caseObjective: caseObjectives[currentCase],
    node,
    log,
    triggerLabels,
    riskTier,
    suspenseState,
  });
  const primarySceneTrigger = node?.triggers?.[0] ?? "responsibility";
  const primarySceneTriggerLabel = triggerLabels[primarySceneTrigger] ?? "책임";
  const sceneDirection =
    riskTier === "CRITICAL"
      ? `${primarySceneTriggerLabel} 압박이 회의실의 말끝을 짧게 자른다. 누구도 먼저 편한 결론을 꺼내지 못한다.`
      : riskTier === "UNSTABLE"
        ? `${primarySceneTriggerLabel} 압박이 테이블 위에 얇게 깔린다. 대답은 가능하지만, 아직 비용의 이름이 다 불리지 않았다.`
        : `${primarySceneTriggerLabel} 압박은 낮게 유지된다. 그래서 지금은 결론보다 전제를 바꾸기 좋은 순간이다.`;
  const pressureCascade = useMemo(() => {
    const latest = log.at(-1);
    const humanCost = resources.humanCost ?? 0;
    const fatigue = resources.fatigue ?? 0;
    const pressure = riskPressure;
    if (pressure >= 72 || humanCost >= 28) {
      return {
        tone: "critical",
        label: "PRESSURE CASCADE",
        title: "숫자로 막던 문제가 사람의 반응으로 새고 있습니다.",
        text: "다음 선택은 자원 하나만 움직이지 않습니다. 침묵한 사람, 떠날 사람, 기록을 들고 있는 사람이 동시에 반응합니다.",
        cue: "가장 큰 성과보다 피해가 어디로 이동하는지 먼저 말해야 합니다.",
      };
    }
    if (pressure >= 48 || fatigue >= 32) {
      return {
        tone: "unstable",
        label: "AFTERSHOCK",
        title: "직전 판단의 비용이 아직 회의실에 남아 있습니다.",
        text: "다음 결론을 서두르면 방금 줄인 비용이 다른 이해관계자에게 옮겨갈 수 있습니다.",
        cue: latest?.challenge?.matched
          ? "챌린지를 맞혔어도, 남겨둔 비용까지 사라진 것은 아닙니다."
          : "이번 장면은 정답보다 비용의 이동 경로를 확인해야 합니다.",
      };
    }
    return {
      tone: "stable",
      label: "LOW SIGNAL",
      title: "아직 방향을 바꿀 여지가 있습니다.",
      text: "압박이 낮을 때는 빠른 결론보다 다음 사건에 남길 기준을 설계할 수 있습니다.",
      cue: "지금 남기는 문장이 다음 장면의 출발점이 됩니다.",
    };
  }, [log, resources, riskPressure]);
  const gameplayStats = getGameplayStats(log, riskPressure);
  const observationLedger = getObservationLedger(log);
  const clueCount = discoveredClues.length;
  const unopenedRecordCount = Math.max(0, 4 - clueCount);
  const decisionLedger = getDecisionLedger(log, resources);
  const decisionFingerprint = getDecisionFingerprint({
    triggerScores: triggers,
    cognitionScores: cognition,
    entries: log,
    resources,
  });
  const counterfactualReport = useMemo(
    () => getCounterfactualReport(log, nodes),
    [log],
  );
  const {
    freeCount: freeTextCombo,
    reducedRiskCount,
    challengeClearCount,
    currentChallengeStreak,
    rhythmScore,
    cognitionScore,
    pressureAdaptScore,
    reflectionScore,
    exploitPenalty,
    momentumScore,
    momentumTier,
    rank: gameplayRank,
  } = gameplayStats;
  const activeBonus =
    log.at(-1)?.title === "CRISIS PROTOCOL"
      ? "구조 개입"
      : log.at(-1)?.instinctSurge
        ? "INSTINCT SURGE"
        : log.at(-1)?.auditSurge
          ? "AUDIT SURGE"
        : log.at(-1)?.tempoBonus
          ? "QUICK READ"
          : freeTextCombo >= 2
            ? "판 바꾸기 보너스"
            : currentChallengeStreak >= 2
              ? "연속 챌린지 보너스"
              : currentAverageResponseTime >= 20
                ? "숙고 보너스"
                : log.length >= 3
                  ? "연속 판단 보너스"
                  : "보너스 대기";
  const inheritedChallenge =
    openingLegacy && isOpeningNode
      ? (openingLegacy.continuityChallenge ?? {
          id:
            openingLegacy.label === "CLEAR SIGNAL"
              ? "protect-trust"
              : openingLegacy.label === "OPEN WOUND"
                ? "repair-legitimacy"
                : openingLegacy.label === "UNFINISHED COST"
                  ? "lower-risk"
                  : "find-cost",
          title:
            openingLegacy.label === "CLEAR SIGNAL"
              ? "신뢰를 다음 장면에 넘기기"
              : openingLegacy.label === "OPEN WOUND"
                ? "정당성 균열 봉합하기"
                : openingLegacy.label === "UNFINISHED COST"
                  ? "남은 비용 줄이기"
                  : "이전 판단의 비용 확인하기",
          text:
            openingLegacy.label === "CLEAR SIGNAL"
              ? "이전 케이스에서 얻은 신뢰를 잃지 않는 선택이 다음 압박의 문을 엽니다."
              : openingLegacy.label === "OPEN WOUND"
                ? "정당성을 회복하는 선택으로 지난 사건의 균열을 먼저 봉합해야 합니다."
                : openingLegacy.label === "UNFINISHED COST"
                  ? "지난 사건에서 넘어온 비용을 줄이면 이번 장면의 회복 보너스가 붙습니다."
                  : "이전 판단이 남긴 숨은 비용을 찾아야 다음 사건의 기준을 다시 세울 수 있습니다.",
        })
      : null;
  const sceneChallenge =
    inheritedChallenge ??
    (riskPressure >= 35
      ? {
          id: "lower-risk",
          title: "위험 압력 낮추기",
          text: "예상 위험이 내려가는 선택을 찾으면 압박 관리 보너스가 붙습니다.",
        }
      : freeTextCombo === 0 && freeChoice
        ? {
            id: "use-reframe",
            title: "판 바꾸기 시도",
            text: "구조 재설계에서 반영 기준 2개 이상을 채우면 보너스 조건이 열립니다.",
          }
        : (node?.triggers ?? []).includes("competition")
          ? {
              id: "avoid-risk",
              title: "속도에 말리지 않기",
              text: "위험 상승을 감수하지 않고 경쟁 압박을 통과하는 선택을 찾습니다.",
            }
          : {
              id: "find-cost",
              title: "숨은 비용 찾기",
              text: "가장 좋아 보이는 선택의 반대 비용을 확인하고 고릅니다.",
            });
  const echoProbeHint = {
    "protect-trust": "힌트: 이번 장면에서는 가장 큰 성과보다 관계를 회복하는 말이 지난 사건의 신뢰를 이어갑니다.",
    "repair-legitimacy": "힌트: 정당성을 올리는 선택을 먼저 골라야 지난 사건의 균열이 다음 장면을 삼키지 않습니다.",
    "lower-risk": "힌트: 지금은 가장 큰 이득보다 위험 압력을 실제로 낮추는 선택이 오래 버팁니다.",
    "use-reframe": "힌트: 사람, 조건, 순서 중 두 가지 이상을 다시 설계하면 선택지 밖 계획으로 인정됩니다.",
    "avoid-risk": "힌트: 경쟁자의 속도를 따라가는 대신 위험을 유지하거나 낮추는 선택이 다음 장면을 엽니다.",
    "find-cost": "힌트: 가장 좋아 보이는 선택이 누구에게 비용을 넘기는지 먼저 찾으십시오.",
  }[sceneChallenge.id];
  const echoProbeCost = playStyle === "mediator" ? "결정 시간 4초와 신뢰 1" : "결정 시간 8초와 피로 1";
  function getChallengeMatch(choice, riskDelta) {
    if (sceneChallenge.id === "protect-trust" && (choice.effect?.trust ?? 0) > 0) return "신뢰 회복 후보";
    if (sceneChallenge.id === "repair-legitimacy" && (choice.effect?.legitimacy ?? 0) > 0) return "정당성 회복 후보";
    if (sceneChallenge.id === "lower-risk" && riskDelta < 0) return "챌린지 후보";
    if (sceneChallenge.id === "avoid-risk" && riskDelta <= 0) return "챌린지 후보";
    if (sceneChallenge.id === "find-cost" && Object.values(choice.effect ?? {}).some((value) => value < 0)) {
      return "비용 확인됨";
    }
    return "";
  }

  function getTacticalRead(choice, riskDelta, challengeMatch) {
    const effectEntries = Object.entries(choice.effect ?? {}).filter(([, value]) => value !== 0);
    const biggestCost = effectEntries
      .filter(([, value]) => value < 0)
      .sort((a, b) => a[1] - b[1])[0];
    const biggestGain = effectEntries
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])[0];
    const cognitionGain = Object.values(choice.cognition ?? {}).reduce((sum, value) => sum + value, 0);
    const grade =
      challengeMatch && riskDelta < 0
        ? "S"
        : challengeMatch || riskDelta < 0
          ? "A"
          : riskDelta === 0 && cognitionGain >= 2
            ? "B"
            : riskDelta <= 6
              ? "C"
              : "D";
    const gradeText = {
      S: "브레이크스루",
      A: "공략 후보",
      B: "안정 전개",
      C: "대가 있는 선택",
      D: "고위험 도박",
    }[grade];
    const reward =
      challengeMatch
        ? "챌린지 적중"
        : riskDelta < 0
          ? "위험 압력 하락"
          : riskDelta === 0
            ? "압력 유지"
            : `위험 압력 +${riskDelta}`;
    const cost = biggestCost
      ? `${resourceMeta[biggestCost[0]]?.label ?? biggestCost[0]} ${biggestCost[1]}`
      : "즉시 손실 낮음";
    const gain = biggestGain
      ? `${resourceMeta[biggestGain[0]]?.label ?? biggestGain[0]} +${biggestGain[1]}`
      : cognitionGain > 0
        ? `사고 가속 +${cognitionGain}`
        : "관망";

    return { grade, gradeText, reward, cost, gain };
  }

  function describeForecast(forecast) {
    if (evidenceCount === 0) return "??";
    const direction = forecast.riskDelta > 0 ? "위험 ↑" : forecast.riskDelta < 0 ? "위험 ↓" : "위험 유지";
    if (evidenceCount < 3) return direction;
    return `${direction} · ${formatResourceDelta(forecast.biggestGain)} / ${formatResourceDelta(forecast.biggestCost)}`;
  }

  function mergeEffects(...effects) {
    return effects.reduce((merged, effect = {}) => {
      Object.entries(effect).forEach(([key, value]) => {
        merged[key] = (merged[key] ?? 0) + value;
      });
      return merged;
    }, {});
  }

  function getFlowSurge(tacticalRead, challengeMatch, riskDelta) {
    if (currentChallengeStreak >= 4 && challengeMatch) {
      return {
        label: "PERFECT RUN",
        text: "다섯 번째 연속 공략이 맞물렸습니다. 팀의 신뢰와 정당성이 최고 흐름에 들어갑니다.",
        effect: { trust: 3, legitimacy: 3, fatigue: -3 },
      };
    }
    if (currentChallengeStreak >= 2 && challengeMatch) {
      return {
        label: "STREAK BREAKTHROUGH",
        text: "세 번째 연속 공략이 맞물렸습니다. 팀의 신뢰가 붙고 판단 피로가 회복됩니다.",
        effect: { trust: 2, legitimacy: 2, fatigue: -2 },
      };
    }
    if (tacticalRead.grade === "S") {
      return {
        label: "FLOW SURGE",
        text: "챌린지와 위험 제어가 동시에 맞물려 회의실의 지지가 붙었습니다.",
        effect: { trust: 2, legitimacy: 2, fatigue: -3 },
      };
    }
    if (tacticalRead.grade === "A" && challengeMatch) {
      return {
        label: "CHALLENGE SURGE",
        text: "장면 목표를 정확히 찔러 다음 선택의 피로가 줄었습니다.",
        effect: { trust: 1, legitimacy: 1, fatigue: -2 },
      };
    }
    if (riskDelta < 0) {
      return {
        label: "PRESSURE DROP",
        text: "위험 압력을 낮춘 덕분에 판단 여력이 조금 회복됐습니다.",
        effect: { fatigue: -1 },
      };
    }
    return null;
  }

  function getClueReveal(challengeMatch, riskDelta, responseTimeSec) {
    const clue = getDiscoveryClue({
      currentCase,
      challengeMatch,
      riskDelta,
      responseTimeSec,
      logLength: log.length,
    });
    return clue && !discoveredClues.some((item) => item.id === clue.id) ? clue : null;
  }

  function getEffectiveChoiceRead(choice, baseEffect, cognitiveEffect) {
    const baseResources = applyEffect(resources, baseEffect);
    const baseRiskDelta = getRiskPressure(baseResources) - riskPressure;
    const challengeMatch =
      choice.type === "free"
        ? sceneChallenge.id === "use-reframe" && getFreeTextSignals(freeText).filter((signal) => signal.active).length >= 2
        : Boolean(getChallengeMatch(choice, baseRiskDelta));
    const tacticalRead = getTacticalRead(
      { ...choice, effect: baseEffect, cognition: cognitiveEffect },
      baseRiskDelta,
      challengeMatch,
    );
    const flowSurge = getFlowSurge(tacticalRead, challengeMatch, baseRiskDelta);
    const finalEffect = flowSurge ? mergeEffects(baseEffect, flowSurge.effect) : baseEffect;
    const finalResources = applyEffect(resources, finalEffect);
    const finalRiskDelta = getRiskPressure(finalResources) - riskPressure;

    return {
      baseRiskDelta,
      challengeMatch,
      tacticalRead,
      flowSurge,
      finalEffect,
      finalResources,
      finalRiskDelta,
    };
  }

  const riskPressureDrivers = getRiskPressureDrivers(resources);
  const decisionForecasts = fixedChoices
    .map((choice) => {
      const read = getEffectiveChoiceRead(choice, choice.effect, choice.cognition);
      const forecast = createDecisionForecast({ ...choice, effect: read.finalEffect }, resources);
      return {
        choice,
        read,
        forecast,
        tacticalRead: read.tacticalRead,
      };
    });
  const pressureLensForecast = [...decisionForecasts].sort((a, b) => {
    if (a.forecast.riskDelta !== b.forecast.riskDelta) {
      return a.forecast.riskDelta - b.forecast.riskDelta;
    }
    return b.forecast.cognitionGain - a.forecast.cognitionGain;
  })[0];
  const tradeoffLensForecast = [...decisionForecasts].sort((a, b) => {
    const aCost = Math.abs(a.forecast.biggestCost?.[1] ?? 0);
    const bCost = Math.abs(b.forecast.biggestCost?.[1] ?? 0);
    return bCost - aCost;
  })[0];
  const pressureLeader = riskPressureDrivers[0];
  const formatResourceDelta = (delta) => {
    if (!delta) return "즉시 비용 낮음";
    const [key, value] = delta;
    return `${resourceMeta[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`;
  };
  const formatRiskDelta = (value) =>
    value > 0 ? `+${value}` : value < 0 ? `${value}` : "유지";
  const pendingChoiceRead = pendingChoice
    ? getEffectiveChoiceRead(pendingChoice, pendingChoice.effect, pendingChoice.cognition)
    : null;
  const pendingChoiceForecast = pendingChoiceRead
    ? createDecisionForecast({ ...pendingChoice, effect: pendingChoiceRead.finalEffect }, resources)
    : null;

  const questSteps = [
    {
      title: "장면 챌린지",
      value: `${challengeClearCount}/${Math.max(1, log.length)}`,
      text: currentChallengeStreak > 0 ? `${currentChallengeStreak}연속 유지 중` : "이번 장면에서 다시 시작",
      complete: currentChallengeStreak > 0,
    },
    {
      title: "위험 압력 제어",
      value: `${reducedRiskCount}`,
      text: reducedRiskCount > 0 ? "하락 선택 기록됨" : "위험 하락 선택을 찾아야 함",
      complete: reducedRiskCount > 0,
    },
    {
      title: "판 바꾸기",
      value: `${freeTextCombo}`,
      text: freeTextCombo > 0 ? "선택지 밖 계획이 남음" : "구조 재설계 미사용",
      complete: freeTextCombo > 0,
    },
  ];
  const turnBriefItems = [
    { label: "챌린지", value: sceneChallenge.title },
    { label: "압력", value: `${riskTier} ${riskPressure}` },
    { label: "버스트", value: `${momentumTier} ${momentumScore}` },
    { label: "보너스", value: activeBonus },
    { label: "남은 시간", value: `${decisionSeconds}초` },
  ];
  const currentFeedback = normalizeFeedback(playtestFeedback[currentCase]);
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const firstRenderRef = useRef(true);
  const sceneTitleRef = useRef(null);
  const hasResumableSave =
    !started &&
    currentCase &&
    nodeId &&
    (isPausedSave || Boolean(saveStatus) || Boolean(lastSavedAt && (log.length > 0 || completedCases.length > 0)));
  const telemetrySummary = !isOnline
    ? {
        tone: "local",
        title: "오프라인",
        text: "연결이 복구되면 원격 저장을 다시 사용할 수 있습니다. 현재 기록은 브라우저에 저장됩니다.",
      }
    : telemetryEnabled
    ? dataConsent
      ? {
          tone: "ready",
          title: "원격 저장 준비됨",
          text: "케이스 완료와 피드백 제출 시 동의한 기록만 원격 저장합니다.",
        }
      : {
          tone: "pending",
          title: "원격 저장 준비됨 · 동의 대기",
          text: "체크박스에 동의하면 이 세션의 완료 로그와 피드백을 원격 저장합니다.",
        }
    : {
        tone: "local",
        title: "로컬 저장",
        text: "원격 저장 설정이 없어 브라우저 저장과 JSON 내보내기만 사용합니다.",
    };
  const localLeaderboardRows = useMemo(
    () => Object.entries(caseResults).map(([caseId, summary]) => ({
      local: true,
      session_code: sessionCode,
      player_name: playerName || "현재 분석관",
      case_id: caseId,
      case_title: seasonCasesBase.find((caseItem) => caseItem.id === caseId)?.title ?? caseId,
      completed_at: summary?.completedAt ?? "",
      summary,
    })),
    [caseResults, playerName, sessionCode],
  );
  useEffect(() => {
    const updateNetworkStatus = () => {
      const online = globalThis.navigator?.onLine !== false;
      setIsOnline(online);
      if (!online) {
        setTelemetryStatus({
          tone: "local",
          text: "오프라인. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
        });
        return;
      }
      setTelemetryStatus({
        tone: telemetryEnabled ? "ready" : "local",
        text: telemetryEnabled
          ? "네트워크 연결됨. 데이터 제공 동의 시 케이스 완료 로그가 저장됩니다."
          : "로컬 저장. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
      });
    };
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);
  useEffect(() => {
    if (!telemetryEnabled || !dataConsent || !isOnline || pendingTelemetry.length === 0) return undefined;
    scheduleTelemetryRetry({ immediate: telemetryRetryAttemptRef.current === 0 });
    return () => {
      if (telemetryRetryTimerRef.current) {
        window.clearTimeout(telemetryRetryTimerRef.current);
        telemetryRetryTimerRef.current = null;
      }
    };
  }, [dataConsent, isOnline, pendingTelemetry.length]);
  useEffect(() => {
    if (!debugToolsEnabled) return undefined;
    if (!telemetryEnabled || !isOnline) {
      setTelemetryHealth({ status: telemetryEnabled ? "offline" : "disabled", tables: [] });
      return undefined;
    }
    let cancelled = false;
    setTelemetryHealth({ status: "checking", tables: [] });
    checkTelemetryHealth()
      .then((health) => {
        if (cancelled) return;
        setTelemetryHealth({
          status: health.ok ? "ok" : "error",
          tables: health.tables ?? [],
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setTelemetryHealth({
          status: "error",
          tables: [{ table: "healthcheck", ok: false, status: 0, message: error instanceof Error ? error.message : "failed" }],
        });
      });
    return () => {
      cancelled = true;
    };
  }, [isOnline]);
  useEffect(() => {
    const handleWindowError = (event) => {
      const entry = recordAppError(event.error ?? event.message, {}, "window-error");
      setLastRecoveredError({
        id: entry.id,
        occurredAt: entry.occurredAt,
        source: entry.context.source,
        message: entry.error.message,
        currentCase: entry.context.currentCase,
        nodeId: entry.context.nodeId,
      });
      refreshLocalErrorLog();
    };
    const handleUnhandledRejection = (event) => {
      const entry = recordAppError(event.reason, {}, "unhandled-rejection");
      setLastRecoveredError({
        id: entry.id,
        occurredAt: entry.occurredAt,
        source: entry.context.source,
        message: entry.error.message,
        currentCase: entry.context.currentCase,
        nodeId: entry.context.nodeId,
      });
      refreshLocalErrorLog();
    };
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      if (consoleErrorHookBusy) return;
      const text = args
        .map((arg) => (arg instanceof Error ? arg.message : typeof arg === "string" ? arg : safeStringify(arg)))
        .join(" ")
        .trim();
      if (!text || isAlreadyRecordedConsoleError(text)) return;
      consoleErrorHookBusy = true;
      try {
        const consoleError = args.find((arg) => arg instanceof Error) ?? new Error(limitText(text, 400));
        consoleError.name = "ConsoleError";
        recordAppError(consoleError, {}, "console-error");
        refreshLocalErrorLog();
      } catch {
        // Never let diagnostics break the console itself.
      } finally {
        consoleErrorHookBusy = false;
      }
    };
    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);
  useEffect(() => {
    const closeOverlay = (event) => {
      if (event.key !== "Escape") return;
      if (decisionReveal) {
        setDecisionReveal(null);
      } else if (showRanking) {
        setShowRanking(false);
      } else if (showErrorLog) {
        closeRecoveryCenter();
      }
    };
    window.addEventListener("keydown", closeOverlay);
    return () => window.removeEventListener("keydown", closeOverlay);
  }, [decisionReveal, showErrorLog, showRanking]);
  useEffect(() => {
    const handleChoiceShortcut = (event) => {
      if (!started || decisionReveal || isAdvancing) return;
      if (event.repeat) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;
      if (isResult) {
        if (event.key.toLowerCase() === "r") {
          event.preventDefault();
          startCase(currentCase);
        } else if (event.key.toLowerCase() === "n" && nextCaseSignal) {
          event.preventDefault();
          startCase(nextCaseSignal.caseId);
        }
        return;
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        saveCurrentGame({ exit: event.shiftKey });
        return;
      }
      if (event.key === "Escape" && pendingChoice) {
        event.preventDefault();
        setPendingChoice(null);
        return;
      }
      if ((event.key === "Enter" || event.key === " ") && pendingChoice) {
        event.preventDefault();
        choose(pendingChoice);
        return;
      }
      if (fixedChoices.length > 1 && ["ArrowDown", "ArrowRight", "j", "J", "ArrowUp", "ArrowLeft", "k", "K"].includes(event.key)) {
        event.preventDefault();
        const currentIndex = pendingChoice ? fixedChoices.findIndex((choice) => choice.id === pendingChoice.id) : -1;
        const direction = ["ArrowUp", "ArrowLeft", "k", "K"].includes(event.key) ? -1 : 1;
        const nextIndex = (currentIndex + direction + fixedChoices.length) % fixedChoices.length;
        previewChoice(fixedChoices[nextIndex]);
        return;
      }
      const choiceIndex = Number(event.key) - 1;
      if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || !fixedChoices[choiceIndex]) return;
      event.preventDefault();
      previewChoice(fixedChoices[choiceIndex]);
    };
    window.addEventListener("keydown", handleChoiceShortcut);
    return () => window.removeEventListener("keydown", handleChoiceShortcut);
  }, [currentCase, decisionReveal, fixedChoices, isAdvancing, isResult, pendingChoice, started]);
  useEffect(() => {
    if (!pendingChoice) return;
    window.requestAnimationFrame(() => {
      commitConsoleRef.current?.scrollIntoView({ behavior: getScrollBehavior(), block: "center" });
      commitConfirmRef.current?.focus({ preventScroll: true });
    });
  }, [pendingChoice]);
  useEffect(() => {
    if (decisionReveal) {
      hadDecisionRevealRef.current = true;
      return;
    }
    if (!hadDecisionRevealRef.current) return;
    hadDecisionRevealRef.current = false;
    window.requestAnimationFrame(() => sceneTitleRef.current?.focus({ preventScroll: true }));
  }, [decisionReveal]);
  useEffect(() => {
    if (!showRanking) return undefined;
    let cancelled = false;
    setLeaderboardStatus("loading");
    setLeaderboardError("");
    fetchLeaderboard()
      .then(({ rows = [], skipped = false }) => {
        if (cancelled) return;
        setLeaderboard(buildLeaderboard([...rows, ...localLeaderboardRows]));
        setLeaderboardStatus(skipped ? "local" : "ready");
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn(error);
        setLeaderboard(buildLeaderboard(localLeaderboardRows));
        setLeaderboardStatus(isOnline ? "error" : "local");
        setLeaderboardError(
          isOnline
            ? "원격 기록을 불러오지 못해 이 브라우저의 완료 기록만 표시합니다."
            : "오프라인이라 이 브라우저의 완료 기록만 표시합니다.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [isOnline, localLeaderboardRows, showRanking]);
  const musicModeKey = isResult ? "result" : started ? riskTier.toLowerCase() : "intro";

  useEffect(() => {
    if (!isResult || currentCase !== "final" || endingStep !== 1) return undefined;
    const reducedMotion = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reducedMotion) {
      setEndingQuietReady(true);
      return undefined;
    }
    setEndingQuietReady(false);
    const timer = window.setTimeout(() => setEndingQuietReady(true), 8000);
    return () => window.clearTimeout(timer);
  }, [currentCase, endingStep, isResult]);

  useEffect(() => {
    if (!started || isResult) return undefined;
    setDecisionSeconds(45);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setDecisionSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, currentCase, resolvedNodeId, isResult]);

  useEffect(() => {
    if (!started || isResult) return undefined;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityPauseRef.current ??= Date.now();
        return;
      }
      if (visibilityPauseRef.current === null) return;
      const pausedForMs = Date.now() - visibilityPauseRef.current;
      visibilityPauseRef.current = null;
      const adjustedNodeEnteredAt = nodeEnteredAt + pausedForMs;
      setNodeEnteredAt(adjustedNodeEnteredAt);
      persist({ nodeEnteredAt: adjustedNodeEnteredAt });
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isResult, nodeEnteredAt, persist, started]);

  useEffect(() => {
    const handlePageHide = () => {
      if (!started || saveSuppressed) return;
      if (readStoredValue(STORAGE_KEY, null) === null) return;
      persist({ paused: true });
    };
    const handlePageShow = (event) => {
      if (!started || !event.persisted) return;
      setIsPausedSave(false);
      persist({ paused: false });
    };
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [persist, started]);

  useEffect(() => {
    if (!started || isResult || decisionSeconds > 0 || timerPenaltyApplied) return;
    const timeoutEffect = { time: -2, fatigue: 3 };
    const nextResources = applyEffect(resources, timeoutEffect);
    const entry = {
      nodeId: resolvedNodeId,
      title: "TIMEOUT PRESSURE",
      choice: "결정 윈도우 초과",
      spokenChoice: "잠깐. 늦어진 만큼의 비용도 기록하겠습니다.",
      freeText: "",
      effect: timeoutEffect,
      triggers: ["fear", "responsibility"],
      echo: "결정을 늦추는 것도 하나의 결정입니다. 이제 줄어든 시간과 늘어난 피로를 감안하십시오.",
      sceneBeat: "에코: 결정 윈도우가 닫혔습니다.\n회의실: 아무도 당신을 대신해 결론을 내리지 않았지만, 기다린 비용은 이미 숫자로 남았습니다.",
      challenge: { title: "시간 압박 버티기", matched: false, riskDelta: getRiskPressure(nextResources) - riskPressure },
      tactical: null,
      flowSurge: null,
      tempoBonus: null,
      instinctSurge: null,
      note: "결정 윈도우 초과 비용",
      responseTimeSec: 45,
      resourcesBefore: resources,
      resourcesAfter: nextResources,
      isSystemEvent: true,
    };
    const nextLog = [...log, entry];
    setTimerPenaltyApplied(true);
    setResources(nextResources);
    setLog(nextLog);
    setEcho(entry.echo);
    setNodeEnteredAt(Date.now());
    setSaveStatus("결정 윈도우 초과 비용 적용됨");
    persist({
      timerPenaltyApplied: true,
      resources: nextResources,
      log: nextLog,
      echo: entry.echo,
      nodeEnteredAt: Date.now(),
    });
  }, [decisionSeconds, isResult, log, nodeEnteredAt, persist, resources, resolvedNodeId, riskPressure, started, timerPenaltyApplied]);

  function getScrollBehavior() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  }

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: getScrollBehavior() });
      sceneTitleRef.current?.focus({ preventScroll: true });
      setIsAdvancing(false);
      setShowTacticalDetails(false);
      setPendingChoice(null);
    });
  }, [started, currentCase, nodeId, isResult]);

  function persist(nextState) {
    if (saveSuppressed) return { storageSaved: false };
    const baseState = {
        saveSchemaVersion: SAVE_SCHEMA_VERSION,
        playerName,
        playStyle,
        openingLegacy,
        dataConsent,
        started,
        currentCase,
        completedCases,
        discoveredClues,
        caseResults,
        playtestFeedback,
        nodeId,
        resources,
        log,
        triggers,
        cognition,
        freeText,
        echo,
        nodeEnteredAt,
        pendingTelemetry: pendingTelemetryRef.current,
        protocolUsed,
        timerPenaltyApplied,
        probeUsed,
        paused: isPausedSave,
        savedAt: new Date().toISOString(),
      };
    const missingKeys = SAVE_STATE_KEYS.filter((key) => !Object.hasOwn(baseState, key));
    if (missingKeys.length > 0 && import.meta.env.DEV) {
      throw new Error(`Save payload missing keys: ${missingKeys.join(", ")}`);
    }
    const payload = {
      ...SAVE_STATE_KEYS.reduce((state, key) => {
        state[key] = baseState[key];
        return state;
      }, {}),
      ...nextState,
    };
    const previousState = {
      started,
      currentCase,
      nodeId,
      completedCases,
    };
    const storageSaved = writeStoredValue(STORAGE_KEY, JSON.stringify(payload));
    if (storageSaved && shouldCaptureSaveSlot(previousState, payload)) {
      appendSaveSlot(payload);
    }
    if (!storageSaved) {
      setSaveStatus("브라우저 저장소를 사용할 수 없어 현재 탭에서만 진행됩니다.");
    }
    return { ...payload, storageSaved };
  }

  function startGame() {
    const name = normalizePlayerName(playerName) || "분석관";
    setPlayerName(name);
    setStarted(true);
    setIsPausedSave(false);
    setCurrentCase("case01");
    setCompletedCases([]);
    setDiscoveredClues([]);
    setCaseResults({});
    setPlaytestFeedback({});
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setProtocolUsed(false);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    setOpeningLegacy(null);
    setDecisionReveal(null);
    setPendingChoice(null);
    setLastRecoveredError(null);
    setShowRecoveryCenter(false);
    setShowErrorLog(false);
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    setFreeText("");
    setNodeId("start");
    setNodeEnteredAt(Date.now());
    persist({
      playerName: name,
      playStyle,
      openingLegacy: null,
      dataConsent,
      started: true,
      currentCase: "case01",
      completedCases: [],
      discoveredClues: [],
      caseResults: {},
      playtestFeedback: {},
      resources: initialResources,
      log: [],
      triggers: makeEmptyScores(triggerLabels),
      cognition: makeEmptyScores(cognitionLabels),
      nodeId: "start",
      freeText: "",
      nodeEnteredAt: Date.now(),
      protocolUsed: false,
      timerPenaltyApplied: false,
      probeUsed: false,
      paused: false,
      lastError: null,
    });
  }

  function resumeSavedGame() {
    setStarted(true);
    setIsPausedSave(false);
    setNodeEnteredAt(Date.now());
    setSaveStatus("");
    setDecisionReveal(null);
    persist({
      started: true,
      paused: false,
      nodeEnteredAt: Date.now(),
    });
  }

  function pauseAfterRecovery() {
    setStarted(false);
    setIsPausedSave(true);
    setSaveStatus("저장 지점을 일시정지했습니다. 같은 오류가 반복되면 새로 시작하거나 복구 슬롯을 선택하세요.");
    persist({ started: false, paused: true });
  }

  function startFreshAfterRecovery() {
    suppressSaves();
    const removed = removeStoredValue(STORAGE_KEY);
    if (!removed) {
      saveSuppressed = false;
      setSaveStatus("저장본을 초기화하지 못했습니다. 브라우저 저장소 권한을 확인하세요.");
      return;
    }
    writeStoredValue(RECOVERY_CENTER_STORAGE_KEY, "1");
    removeStoredValue(DEBUG_RENDER_CRASH_KEY);
    window.location.reload();
  }

  function saveCurrentGame({ exit = false } = {}) {
    const nextStarted = exit ? false : started;
    const nextNodeEnteredAt = exit ? nodeEnteredAt : Date.now();
    const payload = persist({
      started: nextStarted,
      paused: exit,
      nodeEnteredAt: nextNodeEnteredAt,
    });
    if (payload.storageSaved) {
      setLastSavedAt(payload.savedAt);
    }
    setIsPausedSave(exit);
    setSaveStatus(
      payload.storageSaved
        ? `저장됨 ${formatSaveTime(payload.savedAt)}`
        : "브라우저 저장소를 사용할 수 없어 현재 탭에서만 진행됩니다.",
    );
    if (exit) {
      setStarted(false);
    } else {
      setNodeEnteredAt(nextNodeEnteredAt);
    }
  }

  function refreshLocalErrorLog() {
    const rawErrorLog = readStoredValue(ERROR_LOG_STORAGE_KEY, "null");
    const localErrorLog = parseErrorLog(rawErrorLog);
    if (localErrorLog && rawErrorLog !== JSON.stringify(localErrorLog)) {
      writeStoredValue(ERROR_LOG_STORAGE_KEY, JSON.stringify(localErrorLog));
    }
    setLocalErrorEntries(Array.isArray(localErrorLog?.entries) ? localErrorLog.entries : []);
    refreshSaveSlots();
  }

  function refreshSaveSlots() {
    const localSaveSlots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"));
    setSaveSlots(Array.isArray(localSaveSlots?.slots) ? localSaveSlots.slots : []);
  }

  function dismissRecoveryNotice() {
    setLastRecoveredError(null);
    persist({ lastError: null });
  }

  function closeRecoveryCenter() {
    setShowErrorLog(false);
    setShowRecoveryCenter(false);
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
  }

  function clearLocalErrorLog() {
    const cleared = removeStoredValue(ERROR_LOG_STORAGE_KEY);
    if (!cleared) {
      recordAppError(new Error("Error log clear failed because local storage could not be written."), {}, "error-log-clear");
      setSaveStatus("Error log clear failed: browser storage is unavailable.");
      refreshLocalErrorLog();
      return;
    }
    setLocalErrorEntries([]);
    setLastRecoveredError(null);
    persist({ lastError: null });
  }

  function deleteSaveSlot(slotId) {
    const nextSlots = saveSlots.filter((slot) => slot.id !== slotId);
    const deleteSaved = writeStoredValue(
      SAVE_SLOT_STORAGE_KEY,
      JSON.stringify({
        recoverySlotSchemaVersion: RECOVERY_SLOT_SCHEMA_VERSION,
        slots: nextSlots,
      }),
    );
    if (!deleteSaved) {
      recordAppError(new Error("Save slot delete failed because local storage could not be written."), {}, "save-slot-delete");
      setSaveStatus("Delete failed: browser storage is unavailable.");
      return;
    }
    setSaveSlots(nextSlots);
  }

  function restoreSaveSlot(slot) {
    const restored = restoreRecoverySnapshot(slot?.snapshot);
    const repaired = normalizeSavedNestedState(normalizeSavedGameplayState(repairSavedRoute(restored)));
    if (!repaired || !isSavedStateShapeValid(repaired)) return;
    const nextState = normalizeSavedGameplayState({
      ...repaired,
      paused: true,
      started: false,
      savedAt: new Date().toISOString(),
    });
    const savedRestore = writeStoredValue(STORAGE_KEY, JSON.stringify(nextState));
    if (!savedRestore) {
      recordAppError(new Error("Save slot restore failed because local storage could not be written."), {}, "save-slot-restore");
      setSaveStatus("Restore failed: browser storage is unavailable.");
      return;
    }
    window.location.reload();
  }

  function startCase(caseId) {
    const baseStartNode = CASE_START_NODES[caseId];
    const introEcho =
      caseId === "final"
        ? "마지막 사건입니다. 에코는 더 이상 조언자처럼 말하지 않습니다. 당신의 조건이 어떻게 사용됐는지 직접 묻습니다."
        : caseId === "case05"
        ? "이번 사건의 핵심은 악인이 없는 실패입니다. 에코는 책임자를 찾고 싶은 충동과 구조를 끝까지 보려는 사고를 분리해 묻습니다."
        : caseId === "case04"
        ? "이번 사건의 핵심은 명분 있는 위반입니다. 에코는 좋은 결과가 규칙 훼손을 어디까지 정당화하는지 묻습니다."
        : caseId === "case03"
        ? "이번 사건의 핵심은 경쟁 압박입니다. 에코는 당신이 이기려는 순간 무엇을 덜 검증하는지 추적합니다."
        : caseId === "case02"
          ? "이번 사건의 핵심은 증거와 신뢰의 충돌입니다. 에코는 당신이 무엇을 믿고 싶은지와 무엇을 증명할 수 있는지를 분리해서 묻습니다."
          : "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.";
    const previousCaseId = caseSequence[caseSequence.indexOf(caseId) - 1];
    const previousResult = previousCaseId ? caseResults[previousCaseId] : null;
    const startNode = caseOpeningRoutes[caseId]?.[previousResult?.outcomeChoiceId] ?? baseStartNode;
    const previousOutcome = previousResult?.outcomeChoiceId
      ? getCaseOutcome({ caseId: previousCaseId, choiceId: previousResult.outcomeChoiceId })
      : null;
    const continuityChallenge = previousResult?.outcomeChoiceId
      ? getContinuityChallenge({ caseId: previousCaseId, choiceId: previousResult.outcomeChoiceId })
      : null;
    const carryoverEffect = previousResult?.outcomeChoiceId
      ? getOutcomeCarryover({ caseId: previousCaseId, choiceId: previousResult.outcomeChoiceId })
      : {};
    const baseLegacy = previousResult ? legacyProfiles[previousResult.rank] ?? legacyProfiles.C : null;
    const openingEffect = { ...(baseLegacy?.effect ?? {}) };
    Object.entries(carryoverEffect).forEach(([key, value]) => {
      openingEffect[key] = (openingEffect[key] ?? 0) + value;
    });
    const legacy = previousResult
      ? {
          ...baseLegacy,
          effect: openingEffect,
          continuity: previousOutcome,
          continuityChallenge,
        }
      : null;
    const openingEcho = previousOutcome
      ? `${introEcho} 직전 사건의 결과는 '${previousOutcome.title}'로 기록됐습니다. 이번 사건은 그 선택의 비용을 이어받습니다.`
      : introEcho;
    const openingResources = previousResult ? applyEffect(initialResources, openingEffect) : initialResources;
    appendTraceEvent({
      kind: "case-start",
      caseId,
      nodeId: startNode,
      logLength: 0,
      resources: openingResources,
      note: previousResult?.outcomeChoiceId ?? "season-start",
    });
    setStarted(true);
    setIsPausedSave(false);
    setCurrentCase(caseId);
    setNodeId(startNode);
    setResources(openingResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setProtocolUsed(false);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    setOpeningLegacy(legacy);
    setDecisionReveal(null);
    setEndingStep(0);
    setEndingTwistIndex(0);
    setEndingStep(0);
    setEndingTwistIndex(0);
    setEcho(openingEcho);
    setFreeText("");
    setNodeEnteredAt(Date.now());
    persist({
      started: true,
      paused: false,
      currentCase: caseId,
      nodeId: startNode,
      resources: openingResources,
      log: [],
      triggers: makeEmptyScores(triggerLabels),
      cognition: makeEmptyScores(cognitionLabels),
      freeText: "",
      protocolUsed: false,
      timerPenaltyApplied: false,
      probeUsed: false,
      openingLegacy: legacy,
      echo: openingEcho,
      nodeEnteredAt: Date.now(),
    });
  }

  function anonymizeFreeText() {
    updateFreeText(anonymizeSensitiveText(freeText));
  }

  function updateFreeText(value) {
    const nextText = limitText(value, FREE_TEXT_MAX_LENGTH);
    setFreeText(nextText);
    window.clearTimeout(freeTextSaveTimerRef.current);
    freeTextSaveTimerRef.current = window.setTimeout(() => {
      persist({ freeText: nextText });
      freeTextSaveTimerRef.current = null;
    }, 400);
  }

  function requestEchoProbe() {
    if (probeUsed || isAdvancing || !echoProbeHint) return;
    const probeSeconds = playStyle === "mediator" ? 4 : 8;
    const probeEffect = playStyle === "mediator"
      ? { time: -1, trust: 1 }
      : { time: -1, fatigue: 1 };
    const nextResources = applyEffect(resources, probeEffect);
    const probeLine = `${echoProbeHint} 단, 힌트를 얻는 대가로 결정 시간 ${probeSeconds}초를 지불합니다.`;
    const entry = {
      nodeId: resolvedNodeId,
      title: "ECHO PROBE",
      choice: "에코에게 힌트 요청",
      spokenChoice: "판단을 대신하지 말고, 어느 방향을 더 봐야 하는지만 말해.",
      freeText: "",
      effect: probeEffect,
      triggers: ["curiosity", "inference"],
      echo: probeLine,
      sceneBeat: `당신: 에코에게 한 번 더 묻는다.\n에코: ${echoProbeHint}`,
      challenge: null,
      tactical: null,
      flowSurge: null,
      tempoBonus: null,
      instinctSurge: null,
      note: "장면당 1회 힌트 요청",
      responseTimeSec: probeSeconds,
      resourcesBefore: resources,
      resourcesAfter: nextResources,
      isSystemEvent: true,
    };
    const nextLog = [...log, entry];
    setProbeUsed(true);
    setResources(nextResources);
    setLog(nextLog);
    setEcho(probeLine);
    setDecisionSeconds((value) => Math.max(0, value - probeSeconds));
    setSaveStatus(`에코 힌트 확보됨 · 결정 시간 ${probeSeconds}초 사용`);
    persist({
      probeUsed: true,
      resources: nextResources,
      log: nextLog,
      echo: probeLine,
    });
  }

  function activateCrisisProtocol() {
    if (protocolUsed || riskPressure < 60 || isAdvancing) return;
    const protocolEffect = { time: -4, capital: -2, legitimacy: 3, fatigue: 4 };
    const nextResources = applyEffect(resources, protocolEffect);
    const entry = {
      nodeId: resolvedNodeId,
      title: "CRISIS PROTOCOL",
      choice: "위기 프로토콜 발동",
      spokenChoice: "지금 구조를 바꾸고, 그 비용을 기록하겠습니다.",
      freeText: "",
      effect: protocolEffect,
      triggers: ["responsibility", "order"],
      echo: "프로토콜은 시간을 구하지 않습니다. 대신 누구에게 어떤 기준으로 개입했는지 남깁니다.",
      sceneBeat: `에코: 위험 압력 ${riskPressure}에서 일반 절차를 유지할 여유가 사라졌습니다.\n당신: 위기 프로토콜을 발동한다. 시간과 현금을 더 내놓고, 판단 기준을 공개된 절차로 묶는다.`,
      challenge: { title: "위기 압력 버티기", matched: true, riskDelta: getRiskPressure(nextResources) - riskPressure },
      tactical: { grade: "A", gradeText: "공략 후보", reward: "구조 개입", cost: "TIME -4 · CAPITAL -2", gain: "LEGITIMACY +3" },
      flowSurge: null,
      tempoBonus: null,
      note: "케이스당 1회 사용 가능한 구조 개입",
      responseTimeSec: Math.max(1, Math.round((Date.now() - nodeEnteredAt) / 1000)),
      isSystemEvent: true,
      resourcesBefore: resources,
      resourcesAfter: nextResources,
    };
    const nextLog = [...log, entry];
    setProtocolUsed(true);
    setResources(nextResources);
    setLog(nextLog);
    setEcho(entry.echo);
    setNodeEnteredAt(Date.now());
    setDecisionSeconds(45);
    setSaveStatus("위기 프로토콜 발동됨");
    persist({
      protocolUsed: true,
      resources: nextResources,
      log: nextLog,
      echo: entry.echo,
      nodeEnteredAt: Date.now(),
    });
  }

  function buildCaseSummary(nextTriggers, nextCognition, nextLog, nextResources = resources) {
    return createCaseSummary(nextTriggers, nextCognition, nextLog, {
      resources: nextResources,
      schemaVersion: SAVE_SCHEMA_VERSION,
    });
  }

  function normalizeCaseSummary(summary) {
    return {
      schemaVersion: summary?.schemaVersion ?? 1,
      primary: summary?.primary ?? ["responsibility", 0],
      secondary: summary?.secondary ?? ["protection", 0],
      thinking: summary?.thinking ?? ["persistence", 0],
      freeCount: summary?.freeCount ?? 0,
      averageResponseTime: summary?.averageResponseTime ?? 0,
      challengeClearCount: summary?.challengeClearCount ?? 0,
      reducedRiskCount: summary?.reducedRiskCount ?? 0,
      rhythmScore: summary?.rhythmScore ?? 0,
      cognitionScore: summary?.cognitionScore ?? 0,
      pressureAdaptScore: summary?.pressureAdaptScore ?? 0,
      reflectionScore: summary?.reflectionScore ?? 0,
      exploitPenalty: summary?.exploitPenalty ?? 0,
      burstScore: summary?.burstScore ?? summary?.momentumScore ?? 0,
      momentumScore: summary?.momentumScore ?? 0,
      momentumTier: summary?.momentumTier ?? "BUILDING",
      rank: summary?.rank ?? "C",
      outcomeChoiceId: summary?.outcomeChoiceId ?? null,
      outcomeNodeId: summary?.outcomeNodeId ?? null,
    };
  }

  function queueTelemetry(item) {
    const nextQueue = [
      ...pendingTelemetryRef.current.filter((queued) => queued.id !== item.id),
      {
        queuedAt: new Date().toISOString(),
        ...item,
      },
    ];
    commitPendingTelemetryQueue(nextQueue);
  }

  function commitPendingTelemetryQueue(nextQueue) {
    const latestSaved = parseCurrentSavedState(readStoredValue(STORAGE_KEY, "null"), SAVE_SCHEMA_VERSION);
    if (!isSavedStateShapeValid(latestSaved)) {
      setSaveStatus("원격 저장 대기열을 저장하지 못했습니다. 브라우저 저장본을 확인해 주세요.");
      return false;
    }
    const savedAt = new Date().toISOString();
    const stored = writeStoredValue(
      STORAGE_KEY,
      JSON.stringify({
        ...latestSaved,
        pendingTelemetry: nextQueue,
        savedAt,
      }),
    );
    if (stored) {
      pendingTelemetryRef.current = nextQueue;
      setPendingTelemetry(nextQueue);
      setLastSavedAt(savedAt);
      return true;
    }
    setSaveStatus("브라우저 저장소를 사용할 수 없어 원격 저장 대기열 변경을 반영하지 못했습니다.");
    return false;
  }

  async function sendTelemetryItem(item) {
    if (item.type === "case") return saveCaseTelemetry(item.payload);
    if (item.type === "feedback") return saveFeedbackTelemetry(item.payload);
    if (item.type === "error") return saveErrorTelemetry(item.payload);
    throw new Error(`Unknown telemetry item type: ${item.type}`);
  }

  async function retryPendingTelemetry() {
    const retryBatch = pendingTelemetryRef.current;
    if (!telemetryEnabled || !dataConsent || !isOnline || retryBatch.length === 0 || isRetryingTelemetry) {
      return { attempted: false, failedCount: retryBatch.length };
    }
    setIsRetryingTelemetry(true);
    setTelemetryStatus({
      tone: "pending",
      text: `대기 중인 원격 저장 ${retryBatch.length}건을 다시 전송하는 중입니다.`,
    });

    const failedItems = [];
    for (const item of retryBatch) {
      try {
        await sendTelemetryItem(item);
      } catch (error) {
        console.warn(error);
        failedItems.push(item);
      }
    }

    const retryIds = new Set(retryBatch.map((item) => item.id));
    const newlyQueuedItems = pendingTelemetryRef.current.filter((item) => !retryIds.has(item.id));
    const nextQueue = [...failedItems, ...newlyQueuedItems];
    const queueCommitted = commitPendingTelemetryQueue(nextQueue);
    const visibleQueue = queueCommitted ? nextQueue : retryBatch;
    setIsRetryingTelemetry(false);
    if (queueCommitted && nextQueue.length === 0) {
      telemetryRetryAttemptRef.current = 0;
      setTelemetryRetryInfo({ attempt: 0, nextRetryAt: "" });
    }
    setTelemetryStatus(
      queueCommitted && nextQueue.length === 0
        ? {
            tone: "success",
            text: "대기 중이던 원격 저장을 모두 완료했습니다.",
          }
        : {
            tone: "error",
            text: queueCommitted
              ? `원격 저장 ${visibleQueue.length}건이 아직 실패 상태입니다. 잠시 후 다시 시도하세요.`
              : "원격 저장 응답을 받았지만 브라우저 저장본 갱신에 실패했습니다. 저장소 권한을 확인한 뒤 다시 시도하세요.",
          },
    );
    return { attempted: true, failedCount: visibleQueue.length, queueCommitted };
  }

  function scheduleTelemetryRetry({ immediate = false } = {}) {
    if (!telemetryEnabled || !dataConsent || !isOnline || pendingTelemetryRef.current.length === 0 || isRetryingTelemetry) return;
    if (telemetryRetryTimerRef.current) return;
    const attempt = immediate ? 0 : telemetryRetryAttemptRef.current + 1;
    const delayMs = immediate ? 0 : Math.min(60_000, 2_000 * 2 ** Math.max(0, attempt - 1));
    const nextRetryAt = new Date(Date.now() + delayMs).toISOString();
    telemetryRetryAttemptRef.current = attempt;
    setTelemetryRetryInfo({ attempt, nextRetryAt });
    telemetryRetryTimerRef.current = window.setTimeout(async () => {
      telemetryRetryTimerRef.current = null;
      const result = await retryPendingTelemetry();
      if (result?.failedCount > 0) {
        scheduleTelemetryRetry();
      }
    }, delayMs);
  }

  function choose(choice) {
    if (isAdvancing) return;
    if (!nodes[choice.next] && !Object.values(CASE_RESULT_NODES).includes(choice.next)) {
      reportSilentFailure("bad-next", { from: resolvedNodeId, choiceId: choice.id, next: choice.next });
      return;
    }
    window.clearTimeout(freeTextSaveTimerRef.current);
    freeTextSaveTimerRef.current = null;
    setIsAdvancing(true);
    setPendingChoice(null);
    const responseTimeSec = Math.max(1, Math.round((Date.now() - nodeEnteredAt) / 1000));
    const free = choice.type === "free";
    const freeResult = free ? scoreFreeText(freeText) : null;
    const submittedFreeText = free ? freeText.trim() : "";
    const submittedSignals = free ? getFreeTextSignals(submittedFreeText) : [];
    const submittedSignalCount = submittedSignals.filter((signal) => signal.active).length;
    const submittedPrivacySignals = free ? detectPrivacySignals(submittedFreeText) : [];
    const freeTextSuccess =
      free &&
      submittedSignalCount >= 3 &&
      !submittedPrivacySignals.some((signal) => signal.active);
    const baseEffect = free ? freeResult.effect : choice.effect;
    const cognitiveEffect = free ? freeResult.cognition : choice.cognition;
    const {
      challengeMatch,
      tacticalRead,
      flowSurge,
      finalEffect: effect,
      finalResources: nextResources,
      finalRiskDelta: challengeRiskDelta,
    } = getEffectiveChoiceRead(choice, baseEffect, cognitiveEffect);
    const instinctChoice = playStyle === "instinct" && !showTacticalDetails;
    const instinctSurge = instinctChoice && challengeMatch
      ? {
          label: "INSTINCT SURGE",
          text: "정보를 더 열어보지 않고 장면의 핵심 압박을 읽었습니다.",
          effect: { trust: 3, fatigue: -2 },
        }
      : null;
    const auditSurge = playStyle === "auditor" && showTacticalDetails && challengeMatch
      ? {
          label: "AUDIT SURGE",
          text: "비용과 위험을 확인한 뒤, 설명 가능한 챌린지 선택을 완수했습니다.",
          effect: { legitimacy: 2, fatigue: -1 },
        }
      : null;
    const quickRead = responseTimeSec <= 12 && challengeMatch;
    const tempoBonus = quickRead
      ? {
          label: "QUICK READ",
          text: "장면의 핵심 압박을 빠르게 읽고, 망설임 없이 챌린지를 맞혔습니다.",
        effect: { trust: 1, fatigue: -1 },
      }
      : null;
    const streakBreak = currentChallengeStreak > 0 && !challengeMatch
      ? {
          label: "STREAK BROKEN",
          text: `${currentChallengeStreak}연속 장면 목표가 끊겼습니다. 다음 장면부터 다시 흐름을 쌓을 수 있습니다.`,
          tone: "break",
        }
      : null;
    const clue = getClueReveal(challengeMatch, challengeRiskDelta, responseTimeSec);
    const clueReward = clue
      ? {
          label: "EVIDENCE BONUS",
          text: "숨은 단서를 확보해 정당성이 오르고 판단 피로가 줄었습니다.",
          effect: { legitimacy: 2, fatigue: -1 },
        }
      : null;
    const mergedEffect = mergeEffects(
      effect,
      ...(tempoBonus ? [tempoBonus.effect] : []),
      ...(instinctSurge ? [instinctSurge.effect] : []),
      ...(auditSurge ? [auditSurge.effect] : []),
      ...(clueReward ? [clueReward.effect] : []),
    );
    const finalEffect = applySeededEffectVariation(
      mergedEffect,
      `${sessionId}:${resolvedNodeId}:${choice.id}`,
    );
    const finalResourcesWithTempo = applyEffect(resources, finalEffect);
    const nextDiscoveredClues = clue ? [...discoveredClues, clue] : discoveredClues;
    const suspenseEvent = getSuspenseEvent({
      riskBefore: riskPressure,
      riskAfter: getRiskPressure(finalResourcesWithTempo),
      currentCase,
      logLength: log.length,
    });
    const nextTriggers = { ...triggers };
    const nextCognition = { ...cognition };

    node.triggers.forEach((trigger) => {
      nextTriggers[trigger] = (nextTriggers[trigger] ?? 0) + (free ? 10 : 6);
    });
    Object.entries(cognitiveEffect ?? {}).forEach(([key, value]) => {
      nextCognition[key] = (nextCognition[key] ?? 0) + value;
    });

    const entry = {
      nodeId: resolvedNodeId,
      caseId: fallbackCaseId,
      choiceId: choice.id,
      title: node.title,
      choice: choice.label,
      spokenChoice: getDramaticChoiceLabel(choice),
      freeText: submittedFreeText,
      freeTextSignalCount: submittedSignalCount,
      freeTextSuccess,
      effect: finalEffect,
      cognition: cognitiveEffect ?? {},
      triggers: node.triggers,
      echo: getEcho(choice.id, free ? freeText : ""),
      sceneBeat: buildSceneBeat(node, choice, free ? freeText : "", finalEffect),
      challenge: {
        title: sceneChallenge.title,
        matched: challengeMatch,
        riskDelta: challengeRiskDelta,
      },
      tactical: tacticalRead,
      flowSurge,
      tempoBonus,
      instinctSurge,
      auditSurge,
      clueReward,
      streakBreak,
      suspenseEvent,
      clue,
      note: freeResult?.note ?? "",
      responseTimeSec,
      resourcesBefore: resources,
      resourcesAfter: finalResourcesWithTempo,
    };

    const nextLog = [...log, entry];
    const safeQuote = freeTextSuccess ? limitText(submittedFreeText, 140) : "";
    const nextEcho = safeQuote
      ? `${entry.echo} 다음 장면은 당신이 남긴 문장 \u201c${safeQuote}\u201d을 기준으로 이어집니다.`
      : entry.echo;
    const nextNode = choice.next;
    appendTraceEvent({
      kind: "choose",
      caseId: currentCase,
      nodeId: resolvedNodeId,
      choiceId: choice.id,
      nextNodeId: nextNode,
      logLength: nextLog.length,
      resources: finalResourcesWithTempo,
    });
    const nextCompletedCases = CASE_RESULT_NODES[currentCase] === nextNode
      ? Array.from(new Set([...completedCases, currentCase]))
      : completedCases;
    const completedNow = nextCompletedCases !== completedCases;
    const caseSummary = completedNow
      ? {
          ...buildCaseSummary(nextTriggers, nextCognition, nextLog, finalResourcesWithTempo),
          outcomeChoiceId: entry.choiceId,
          outcomeNodeId: entry.nodeId,
        }
      : null;
    const nextCaseResults = completedNow
      ? {
          ...caseResults,
          [currentCase]: caseSummary,
        }
      : caseResults;

    if (completedNow && caseSummary) {
      if (!telemetryEnabled) {
        setTelemetryStatus({
          tone: "local",
          text: "원격 저장 미설정. 이 케이스 로그는 로컬과 JSON 내보내기에만 남습니다.",
        });
      } else if (!dataConsent) {
        setTelemetryStatus({
          tone: "local",
          text: "데이터 제공 동의가 없어 원격 저장을 건너뛰었습니다.",
        });
      } else {
        const caseTelemetryPayload = {
          session_id: sessionId,
          session_code: sessionCode,
          player_name: "익명 분석관",
          case_id: currentCase,
          case_title: activeCaseMeta?.title ?? currentCase,
          completed_at: new Date().toISOString(),
          summary: caseSummary,
          resources: finalResourcesWithTempo,
          triggers: nextTriggers,
          cognition: nextCognition,
          decision_log: nextLog,
        };
        setTelemetryStatus({
          tone: "pending",
          text: "케이스 로그를 원격 저장하는 중입니다.",
        });
        saveCaseTelemetry(caseTelemetryPayload)
          .then(() => {
            setTelemetryStatus({
              tone: "success",
              text: "케이스 로그가 원격 저장됐습니다.",
            });
          })
          .catch((error) => {
            console.warn(error);
            queueTelemetry({
              id: `case-${currentCase}-${Date.now()}`,
              type: "case",
              label: `${activeCaseMeta?.label ?? currentCase} 케이스 로그`,
              payload: caseTelemetryPayload,
            });
            setTelemetryStatus({
              tone: "error",
              text: "원격 저장에 실패했습니다. 로컬 대기열에 보관했으니 결과 화면에서 재시도할 수 있습니다.",
            });
          });
      }
    }

    setResources(finalResourcesWithTempo);
    setTriggers(nextTriggers);
    setCognition(nextCognition);
    setLog(nextLog);
    setEcho(nextEcho);
    setFreeText("");
    setNodeId(nextNode);
    setCompletedCases(nextCompletedCases);
    setCaseResults(nextCaseResults);
    setDiscoveredClues(nextDiscoveredClues);
    setNodeEnteredAt(Date.now());
    const strongestCost = Object.entries(finalEffect)
      .filter(([, value]) => value < 0)
      .sort((a, b) => a[1] - b[1])[0];
    const cascade = finalResourcesWithTempo.humanCost >= 28 || getRiskPressure(finalResourcesWithTempo) >= 72;
    setDecisionReveal({
      title: suspenseEvent?.title ?? (cascade ? "선택이 연쇄 반응을 일으켰습니다." : "선택의 잔향"),
      label: suspenseEvent?.label ?? (cascade ? "CASCADE DETECTED" : "DECISION AFTERIMAGE"),
      spokenChoice: entry.spokenChoice,
      beat: entry.sceneBeat,
      effect: finalEffect,
      consequence: suspenseEvent
        ? suspenseEvent.text
        : clue
        ? `${clue.title}를 발견했습니다. 다음 사건에서 이 단서를 잊지 마십시오.`
        : cascade
        ? "당신의 말은 실행안으로 끝나지 않았습니다. 누군가의 행동을 바꾸고, 다음 장면의 압박을 앞당겼습니다."
        : strongestCost
          ? `${resourceMeta[strongestCost[0]]?.label ?? strongestCost[0]}의 감소분이 다음 장면의 숨은 질문으로 남습니다.`
          : entry.challenge?.matched
            ? "장면의 핵심을 읽어낸 대가로, 회의실은 당신의 기준을 기억하기 시작합니다."
            : "결론은 닫혔지만, 말하지 않은 비용은 아직 닫히지 않았습니다.",
      nextTitle: nodes[nextNode]?.title ?? "결과 화면",
      nextNode,
      cascade,
      streakBreak,
          suspenseEvent,
          clue,
          bonuses: [flowSurge, tempoBonus, instinctSurge, auditSurge, clueReward, streakBreak]
            .filter(Boolean)
            .map(({ label, text, effect, tone }) => ({ label, text, effect, tone })),
        });
    persist({
      resources: finalResourcesWithTempo,
      triggers: nextTriggers,
      cognition: nextCognition,
      log: nextLog,
      echo: nextEcho,
      nodeId: nextNode,
      completedCases: nextCompletedCases,
      caseResults: nextCaseResults,
      discoveredClues: nextDiscoveredClues,
      freeText: "",
      timerPenaltyApplied: false,
      probeUsed: false,
      nodeEnteredAt: Date.now(),
    });
  }

  function previewChoice(choice) {
    if (isAdvancing || choice.type === "free") return;
    setPendingChoice(choice);
  }

  function beginChoiceHold(choice) {
    if (isAdvancing || choice.type === "free") return;
    window.clearTimeout(choiceHoldTimerRef.current);
    choiceHoldTriggeredRef.current = false;
    choiceHoldTimerRef.current = window.setTimeout(() => {
      choiceHoldTriggeredRef.current = true;
      choose(choice);
      choiceHoldTimerRef.current = null;
    }, 600);
  }

  function endChoiceHold() {
    window.clearTimeout(choiceHoldTimerRef.current);
    choiceHoldTimerRef.current = null;
  }

  function handleChoiceClick(choice) {
    if (choiceHoldTriggeredRef.current) {
      choiceHoldTriggeredRef.current = false;
      return;
    }
    previewChoice(choice);
  }

  function reset() {
    if (
      typeof globalThis.confirm === "function" &&
      !globalThis.confirm("저장된 진행과 현재 플레이 기록을 모두 지울까요?")
    ) {
      return;
    }
    suppressSaves();
    const resetStorageResults = [
      ["trigger-prototype", removeStoredValue("trigger-prototype")],
      [STORAGE_KEY, removeStoredValue(STORAGE_KEY)],
      [ERROR_LOG_STORAGE_KEY, removeStoredValue(ERROR_LOG_STORAGE_KEY)],
      [SAVE_SLOT_STORAGE_KEY, removeStoredValue(SAVE_SLOT_STORAGE_KEY)],
    ];
    removeStoredValue(RECOVERY_CENTER_STORAGE_KEY);
    const failedResetKeys = resetStorageResults.filter(([, removed]) => !removed).map(([key]) => key);
    setPlayerName("");
    setPlayStyle("instinct");
    setDataConsent(false);
    setStarted(false);
    setCurrentCase("case01");
    setCompletedCases([]);
    setOpeningLegacy(null);
    setCaseResults({});
    setDiscoveredClues([]);
    setPlaytestFeedback({});
    pendingTelemetryRef.current = [];
    setPendingTelemetry([]);
    setLocalErrorEntries([]);
    setSaveSlots([]);
    setLastRecoveredError(null);
    setNodeId("start");
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setProtocolUsed(false);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    setDecisionReveal(null);
    setEcho("얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.");
    setFreeText("");
    let resetErrorLogSaved = true;
    if (failedResetKeys.length > 0) {
      resetErrorLogSaved = appendStoredErrorLog({
        id: `reset-failed-${Date.now()}`,
        occurredAt: new Date().toISOString(),
        error: {
          name: "StorageResetError",
          message: "Some browser storage keys could not be removed during reset.",
          stack: "",
        },
        context: {
          source: "reset",
          currentCase,
          nodeId,
          failedStorageKeys: failedResetKeys,
        },
      });
    }
    setSaveStatus(
      failedResetKeys.length === 0
        ? ""
        : `일부 브라우저 저장소를 지우지 못했습니다: ${failedResetKeys.join(", ")}${resetErrorLogSaved ? "" : " · 진단 로그 저장도 실패했습니다."}`,
    );
    setLastSavedAt("");
    setIsPausedSave(false);
    setNodeEnteredAt(Date.now());
    setTelemetryStatus({
      tone: telemetryEnabled && isOnline ? "ready" : "local",
      text: !isOnline
        ? "오프라인. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다."
        : telemetryEnabled
          ? "원격 저장 준비됨. 데이터 제공 동의 시 케이스 완료 로그가 저장됩니다."
          : "로컬 저장. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
    });
    saveSuppressed = false;
  }

  function retryStorageCleanup() {
    const cleanupResults = [
      ["trigger-prototype", removeStoredValue("trigger-prototype")],
      [STORAGE_KEY, removeStoredValue(STORAGE_KEY)],
      [ERROR_LOG_STORAGE_KEY, removeStoredValue(ERROR_LOG_STORAGE_KEY)],
      [SAVE_SLOT_STORAGE_KEY, removeStoredValue(SAVE_SLOT_STORAGE_KEY)],
    ];
    const failedKeys = cleanupResults.filter(([, removed]) => !removed).map(([key]) => key);
    if (failedKeys.length === 0) {
      setLocalErrorEntries([]);
      setSaveSlots([]);
      setLastRecoveredError(null);
      setSaveStatus("브라우저 저장소 정리를 완료했습니다.");
      return;
    }
    const retryLogSaved = appendStoredErrorLog({
      id: `reset-retry-failed-${Date.now()}`,
      occurredAt: new Date().toISOString(),
      error: {
        name: "StorageResetRetryError",
        message: "Some browser storage keys could not be removed during reset retry.",
        stack: "",
      },
      context: {
        source: "reset-retry",
        currentCase,
        nodeId,
        failedStorageKeys: failedKeys,
      },
    });
    setSaveStatus(`저장소 정리 재시도 실패: ${failedKeys.join(", ")}${retryLogSaved ? "" : " · 진단 로그 저장도 실패했습니다."}`);
  }

  function showSeasonMap() {
    setStarted(false);
    setIsPausedSave(true);
    persist({ started: false, paused: true });
  }

  function unlockAllCasesForTest() {
    const allPlayableCases = ["case01", "case02", "case03", "case04", "case05"];
    setCompletedCases(allPlayableCases);
    persist({ completedCases: allPlayableCases });
  }

  function startAtNode(
    caseIdValue,
    nodeIdValue,
    {
      echoText = "디버그 진입입니다. 이 장면부터 선택 흐름을 재현합니다.",
      persistRun = true,
    } = {},
  ) {
    const caseId = seasonCasesBase.some((caseItem) => caseItem.id === caseIdValue) ? caseIdValue : "case05";
    const nodeOptions = nodeOrders[caseId] ?? nodeOrders.case05;
    const nextNodeId = nodeOptions.includes(nodeIdValue) ? nodeIdValue : nodeOptions[0];
    appendTraceEvent({
      kind: "enter",
      caseId,
      nodeId: nextNodeId,
      logLength: 0,
      resources: initialResources,
      note: persistRun ? "debug-start" : "replay",
    });
    const allPreviousCases = caseSequence.slice(0, Math.max(0, caseSequence.indexOf(caseId)));
    const now = Date.now();
    setStarted(true);
    setIsPausedSave(false);
    setCurrentCase(caseId);
    setCompletedCases(allPreviousCases);
    setNodeId(nextNodeId);
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setProtocolUsed(false);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    setOpeningLegacy(null);
    setDecisionReveal(null);
    setPendingChoice(null);
    setFreeText("");
    setEcho(echoText);
    setShowErrorLog(false);
    setNodeEnteredAt(now);
    if (persistRun) {
      persist({
        started: true,
        paused: false,
        currentCase: caseId,
        completedCases: allPreviousCases,
        nodeId: nextNodeId,
        resources: initialResources,
        log: [],
        triggers: makeEmptyScores(triggerLabels),
        cognition: makeEmptyScores(cognitionLabels),
        freeText: "",
        echo: echoText,
        protocolUsed: false,
        timerPenaltyApplied: false,
        probeUsed: false,
        openingLegacy: null,
        nodeEnteredAt: now,
      });
    }
  }

  function startDebugNode() {
    const selectedCaseId = debugCaseSelectRef.current?.value ?? debugCaseIdRef.current;
    const selectedNodeId = debugNodeSelectRef.current?.value ?? debugNodeIdRef.current;
    startAtNode(selectedCaseId, selectedNodeId);
  }

  function exportPlaytestLog({ includeDiagnostics = false } = {}) {
    const localErrorLog = parseErrorLog(readStoredValue(ERROR_LOG_STORAGE_KEY, "null"));
    const localSaveSlots = parseRecoverySlots(readStoredValue(SAVE_SLOT_STORAGE_KEY, "null"));
    const payload = {
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      exportMode: includeDiagnostics ? "diagnostic" : "summary",
      currentCase,
      openingLegacy,
      completedCases,
      caseResults,
      resources,
      triggers,
      cognition,
      summary: result,
      fingerprint: decisionFingerprint,
      ledger: decisionLedger,
      counterfactuals: counterfactualReport,
      gameplay: {
        rank: resultRank,
        momentumScore,
        momentumTier,
        rhythmScore,
        cognitionScore,
        pressureAdaptScore,
        reflectionScore,
        exploitPenalty,
        challengeClearCount,
        reducedRiskCount,
        currentChallengeStreak,
        freeTextCombo,
        riskPressure,
        riskTier,
        activeBonus,
        protocolUsed,
      },
      telemetryEnabled,
      dataConsent,
      sessionCode,
    };
    if (includeDiagnostics) {
      payload.playerName = playerName;
      payload.playtestFeedback = playtestFeedback;
      payload.log = log;
      payload.sessionId = sessionId;
      payload.pendingTelemetry = pendingTelemetry;
      payload.errorLog = Array.isArray(localErrorLog?.entries) ? localErrorLog.entries : [];
      payload.saveSlots = Array.isArray(localSaveSlots?.slots) ? localSaveSlots.slots : [];
      payload.trace = getTraceEvents();
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = includeDiagnostics ? `trigger-diagnostic-${Date.now()}.json` : `trigger-summary-${Date.now()}.json`;
    anchor.type = "application/json";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => {
      anchor.remove();
      URL.revokeObjectURL(url);
    }, 1000);
  }

  async function copySessionCode() {
    if (await copyText(sessionCode)) {
      setCopyStatus("복사됨");
    } else {
      setCopyStatus("복사 실패");
    }
    window.setTimeout(() => setCopyStatus(""), 1600);
  }

  async function copyDiagnosticTrace() {
    const copied = await copyText(JSON.stringify(getTraceEvents(), null, 2));
    setCopyStatus(copied ? "Trace copied" : "Copy failed");
    window.setTimeout(() => setCopyStatus(""), 1600);
  }

  async function copyReplayLink() {
    const seed = {
      currentCase: fallbackCaseId,
      nodeId: resolvedNodeId,
      resources,
      log: routeTimeline.map((entry) => ({ nodeId: entry.nodeId, choiceId: entry.choiceId })),
    };
    const encoded = encodeReplaySeed(seed);
    const replayUrl = encoded
      ? `${window.location.origin}${window.location.pathname}?${REPLAY_QUERY_KEY}=${encoded}`
      : "";
    const copied = replayUrl ? await copyText(replayUrl) : false;
    setCopyStatus(copied ? "Replay link copied" : "Copy failed");
    window.setTimeout(() => setCopyStatus(""), 1600);
  }

  const result = useMemo(() => {
    return createCaseSummary(triggers, cognition, log, {
      resources,
      schemaVersion: SAVE_SCHEMA_VERSION,
      includeLongestDecision: true,
    });
  }, [triggers, cognition, log, resources]);
  const routeTimeline = useMemo(
    () => log
      .filter((entry) => entry && typeof entry === "object" && !entry.isSystemEvent)
      .map((entry, index) => ({ ...entry, index, marker: getRouteMarker(entry) })),
    [log],
  );
  const finalEndingEntry = [...log].reverse().find((entry) => entry.nodeId === "f_choice");
  const finalAftermathEntry = [...log].reverse().find((entry) => entry.nodeId === "f_aftershock");
  const outcomeNodeId = currentCase === "final" ? "f_aftershock" : `${currentCase}_aftershock`;
  const outcomeEntry = [...log].reverse().find((entry) => entry.nodeId === outcomeNodeId);
  const caseOutcome = getCaseOutcome({ caseId: currentCase, choiceId: outcomeEntry?.choiceId });
  const endingProfile = {
    ending_seal: {
      tag: "봉인",
      title: "당신은 문을 닫았지만, 흔적은 남겼다.",
      text: "데이터를 봉인해 다시 이용되지 않게 했습니다. 그러나 마지막 후폭풍에서 고른 태도는 당신이 지키려는 것이 침묵인지 안전인지 드러냈습니다.",
    },
    ending_reform: {
      tag: "개혁",
      title: "당신은 실험을 규칙으로 바꾸었다.",
      text: "트리거를 없애는 대신 동의와 감시를 붙였습니다. 사람을 읽는 힘을 누가, 언제, 어디까지 쓸 수 있는지 직접 정했습니다.",
    },
    ending_expose: {
      tag: "폭로",
      title: "당신은 관찰자를 세상 밖으로 끌어냈다.",
      text: "실험의 구조를 공개했습니다. 혼란은 시작됐지만, 적어도 다음 참가자는 자신이 관찰당하고 있다는 사실을 알고 선택할 수 있습니다.",
    },
  }[finalEndingEntry?.choiceId] ?? {
    tag: "미확정",
    title: "당신의 마지막 선택은 아직 기록 중이다.",
    text: "마지막 폴더의 문장이 완전히 닫히지 않았습니다. 다음 플레이에서는 다른 결말의 조건을 시험해 보십시오.",
  };

  function updateCurrentFeedback(patch) {
    const normalizedPatch =
      typeof patch.comment === "string"
        ? { ...patch, comment: limitText(patch.comment, FEEDBACK_COMMENT_MAX_LENGTH) }
        : patch;
    const nextFeedback = {
      ...playtestFeedback,
      [currentCase]: {
        ...currentFeedback,
        ...normalizedPatch,
      },
    };
    setPlaytestFeedback(nextFeedback);
    setFeedbackStatus("");
    persist({ playtestFeedback: nextFeedback });
  }

  async function submitCurrentFeedback() {
    if (isSubmittingFeedback) return;
    if (activeFeedbackPrivacySignals.length > 0) {
      setFeedbackStatus("식별 정보로 보일 수 있는 표현을 익명화한 뒤 저장해 주세요.");
      return;
    }

    setIsSubmittingFeedback(true);
    const savedAt = new Date().toISOString();
    const feedback = {
      ...currentFeedback,
      comment: limitText(currentFeedback.comment, FEEDBACK_COMMENT_MAX_LENGTH),
      savedAt,
    };
    const nextFeedback = {
      ...playtestFeedback,
      [currentCase]: feedback,
    };
    setPlaytestFeedback(nextFeedback);
    persist({ playtestFeedback: nextFeedback });

    if (!telemetryEnabled || !dataConsent) {
      setFeedbackStatus(
        telemetryEnabled
          ? "로컬에 저장했습니다. 데이터 제공 동의가 없어 원격 저장은 건너뛰었습니다."
          : "로컬에 저장했습니다. 원격 저장 미설정 상태라 원격 저장은 건너뛰었습니다.",
      );
      setIsSubmittingFeedback(false);
      return;
    }

    const feedbackTelemetryPayload = {
        session_id: sessionId,
        session_code: sessionCode,
        case_id: currentCase,
        case_title: activeCaseMeta?.title ?? currentCase,
        submitted_at: savedAt,
        clarity_score: Number(feedback.clarity) || null,
        difficulty_score: Number(feedback.difficulty) || null,
        comment: feedback.comment.trim() || null,
      };

    try {
      await saveFeedbackTelemetry(feedbackTelemetryPayload);
      setFeedbackStatus("피드백을 저장했습니다.");
    } catch (error) {
      console.warn(error);
      queueTelemetry({
        id: `feedback-${currentCase}-${Date.now()}`,
        type: "feedback",
        label: `${activeCaseMeta?.label ?? currentCase} 피드백`,
        payload: feedbackTelemetryPayload,
      });
      setFeedbackStatus("로컬에는 저장했습니다. 원격 저장 실패분은 대기열에 보관했습니다.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  }

  function anonymizeFeedbackComment() {
    updateCurrentFeedback({
      comment: limitText(
        anonymizeSensitiveText(currentFeedback.comment),
        FEEDBACK_COMMENT_MAX_LENGTH,
      ),
    });
  }

  const routeLength = getCaseRouteLength(fallbackCaseId);
  const routeIndex = getNodeRouteIndex(fallbackCaseId, resolvedNodeId);
  const debugTrace = getTraceEvents();
  const silentFailureCount = debugTrace.filter((event) => event.kind === "error" && String(event.note ?? "").startsWith("silent-")).length;
  const progress = isResult
    ? 100
    : Math.round(((Math.max(0, routeIndex) + 1) / Math.max(1, routeLength)) * 100);
  const completedCaseResultList = seasonCasesBase
    .filter((caseItem) => caseResults[caseItem.id])
    .map((caseItem) => ({ ...caseItem, result: normalizeCaseSummary(caseResults[caseItem.id]) }));
  const seasonJourney = completedCaseResultList.map((caseItem) => ({
    ...caseItem,
    outcome: getCaseOutcome({ caseId: caseItem.id, choiceId: caseItem.result.outcomeChoiceId }),
    carryover: getOutcomeCarryover({ caseId: caseItem.id, choiceId: caseItem.result.outcomeChoiceId }),
  }));
  const nextCaseSignal = nextCaseSignals[currentCase];
  const resultBridge =
    result.longestDecision
      ? `${triggerLabels[result.primary[0]]} 압박이 가장 오래 남았고, "${result.longestDecision.title}"에서 판단 시간이 길어졌습니다.`
      : `${triggerLabels[result.primary[0]]} 압박이 다음 사건의 시작 조건으로 기록됩니다.`;
  const resultRank = gameplayRank;
  const rankingHeadline = getLeaderboardHeadline(leaderboard);
  const flowSurgeCount = log.filter((entry) => entry.flowSurge).length;
  const streakGoal = currentChallengeStreak < 3 ? 3 : 5;
  const streakRemaining = Math.max(0, streakGoal - currentChallengeStreak);
  const feedbackPrivacySignals = detectPrivacySignals(currentFeedback.comment);
  const activeFeedbackPrivacySignals = feedbackPrivacySignals.filter((signal) => signal.active);
  const screenReaderStatus = isResult
    ? `${activeCaseMeta?.label ?? "현재 케이스"} 결과 화면입니다. 랭크 ${resultRank}, 버스트 ${momentumScore}점, 주요 트리거는 ${triggerLabels[result.primary[0]]}입니다.`
    : `${activeCaseMeta?.label ?? "현재 케이스"} ${node.title} 장면입니다. 진행률 ${progress}퍼센트, 챌린지는 ${sceneChallenge.title}, 위험 압력은 ${riskTier} ${riskPressure}입니다.`;
  const rankLine =
    resultRank === "S"
      ? "사고 리듬, 관점 전환, 압박 회복이 동시에 솟았습니다."
      : resultRank === "A"
        ? "정답을 고른 것이 아니라, 압박 속에서 판단 패턴이 선명하게 드러났습니다."
        : resultRank === "B"
          ? "사건은 통과했습니다. 다음 플레이에서는 다른 사고 방식으로 흔들어볼 여지가 있습니다."
          : "사건은 통과했지만 버스트 신호는 아직 약합니다. 즉답보다 근거, 비용, 회복 경로를 더 남겨보세요.";
  const scoreBreakdown = [
    {
      label: "사고 리듬",
      value: rhythmScore,
      text: `${rhythmScore}점`,
      note: "즉답이나 방치가 아니라, 압박을 읽고 결론까지 밀어낸 시간대입니다.",
    },
    {
      label: "관점 전환",
      value: cognitionScore,
      text: `${cognitionScore}점`,
      note: "같은 방식만 반복하지 않고 추론, 위험, 재구성, 버티기 사이를 오간 흔적입니다.",
    },
    {
      label: "압박 대응",
      value: pressureAdaptScore,
      text: `${pressureAdaptScore}점`,
      note: "위험을 무조건 피한 점수가 아니라, 상승한 압박을 다시 회수한 능력입니다.",
    },
    {
      label: "구조 재설계",
      value: reflectionScore,
      text: `${reflectionScore}점`,
      note: "선택지 밖에서 이해관계자, 조건, 근거, 실패 가능성을 구체화한 정도입니다.",
    },
    {
      label: "즉답 패널티",
      value: exploitPenalty,
      text: exploitPenalty > 0 ? `-${exploitPenalty}점` : "없음",
      note: "표시된 정보만 따라 빠르게 누르는 플레이가 반복될 때만 감점됩니다.",
    },
  ];
  const achievementBadges = [
    { title: `Burst ${momentumTier}`, text: `사고 버스트 ${momentumScore}점을 기록했습니다.` },
    result.freeCount > 0
      ? { title: "Board Breaker", text: "선택지 밖에서 판을 다시 짰습니다." }
      : { title: "Route Follower", text: "주어진 선택지 안에서 비용을 비교했습니다." },
    result.averageResponseTime >= 20
      ? { title: "Slow Thinker", text: "한 장면 이상에서 판단을 오래 붙잡았습니다." }
      : { title: "Fast Closer", text: "빠르게 결론을 닫는 플레이를 보였습니다." },
    reducedRiskCount > 0
      ? { title: "Risk Cutter", text: `${reducedRiskCount}번 위험 압력을 낮췄습니다.` }
      : { title: "Heat Taker", text: "위험을 낮추기보다 다른 목표를 우선했습니다." },
    challengeClearCount > 0
      ? { title: "Challenge Clear", text: `${challengeClearCount}개 장면 도전을 달성했습니다.` }
      : { title: "Open Quest", text: "장면 도전은 남았고, 선택 로그만 기록됐습니다." },
    currentChallengeStreak >= 5
      ? { title: "Perfect Run", text: `${currentChallengeStreak}연속 장면 목표를 맞혀 최고 보상을 열었습니다.` }
      : currentChallengeStreak >= 3
      ? { title: "Streak Breakthrough", text: `${currentChallengeStreak}연속 장면 목표를 맞혀 추가 보상을 열었습니다.` }
      : { title: "Chain Starter", text: "장면 목표를 연속으로 맞히면 추가 보상이 열립니다." },
    flowSurgeCount > 0
      ? { title: "Flow Surge", text: `${flowSurgeCount}번 보너스 자원 회복을 만들었습니다.` }
      : { title: "No Surge", text: "챌린지와 위험 제어가 아직 보너스로 이어지지 않았습니다." },
    riskTier === "CRITICAL"
      ? { title: "Crisis Runner", text: "높은 압력 상태로 케이스를 통과했습니다." }
      : { title: "Pressure Keeper", text: "위험 압력을 통제 가능한 범위에 묶었습니다." },
  ];
  const feedbackPrompts = [
    `${result.longestDecision?.title ?? "가장 오래 머문 장면"}에서 실제로 멈칫한 이유가 있었나요?`,
    result.freeCount > 0
      ? "구조 재설계 입력이 선택지 밖의 계획처럼 느껴졌나요?"
      : "구조 재설계를 쓰지 않았다면, 기존 선택지가 충분히 답처럼 보였나요?",
    nextCaseSignal
      ? `${nextCaseSignal.title}로 넘어가고 싶은 이유가 생겼나요?`
      : "최종 선택이 트리거랩의 실험 구조와 자연스럽게 연결됐나요?",
  ];
  function getSceneLineType(line) {
    if (line.startsWith("'")) return "thought-line";
    if (line.startsWith('"')) return "spoken-line";
    return "narration-line";
  }

  function renderSceneLines(text) {
    return text.split("\n").map((line, index) => (
      <p className={getSceneLineType(line)} key={`${index}-${line.slice(0, 12)}`}>
        {line}
      </p>
    ));
  }

  function getEchoChecks(currentNode) {
    const memoChecks = (currentNode?.memo ?? []).slice(0, 2);
    const triggerCheck = currentNode?.triggers?.[0]
      ? `${triggerLabels[currentNode.triggers[0]]} 압박 때문에 생략한 근거가 있는지 확인`
      : "방금 판단에서 빠진 이해관계자 확인";
    return [...memoChecks, triggerCheck];
  }

  function trapDecisionRevealFocus(event) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      decisionRevealRef.current?.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])") ?? [],
    ).filter((element) => !element.disabled);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const decisionRevealView = { decisionReveal, decisionRevealRef, trapDecisionRevealFocus, renderSceneLines, simplifyPlayerText, setDecisionReveal };
  function renderDecisionReveal() {
    return <DecisionReveal view={decisionRevealView} />;
  }

  const recoveryNoticeView = { lastRecoveredError, started, pauseAfterRecovery, startFreshAfterRecovery, showErrorLog, setShowRecoveryCenter, setShowErrorLog, dismissRecoveryNotice };
  function renderRecoveryNotice() {
    return <RecoveryNotice view={recoveryNoticeView} />;
  }

  const saveStatusView = { saveStatus, retryStorageCleanup };
  function renderSaveStatus() {
    return <SaveStatus view={saveStatusView} />;
  }

  const errorLogPanelView = { showErrorLog, debugToolsEnabled, showRecoveryCenter, copyDiagnosticTrace, exportPlaytestLog, refreshLocalErrorLog, clearLocalErrorLog, closeRecoveryCenter, telemetryHealth, pendingTelemetry, telemetryRetryInfo, formatSaveTime, localErrorEntries, startAtNode, saveSlots, refreshSaveSlots, restoreSaveSlot, deleteSaveSlot };
  function renderErrorLogPanel() {
    return <ErrorLogPanel view={errorLogPanelView} />;
  }

  function getCaseStatusText(status) {
    if (status === "PLAYING") return "진행 중";
    if (status === "OPEN") return "시작 가능";
    if (status === "COMPLETE") return "완료됨";
    return "이전 케이스 필요";
  }

  function formatSaveTime(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    } catch {
      return "";
    }
  }

  if (showRanking && !started) {
    return (
      <RankingScreen
        Music={AdaptiveMusic}
        gameTitle={GAME_TITLE}
        leaderboardStatus={leaderboardStatus}
        rankingHeadline={rankingHeadline}
        leaderboardError={leaderboardError}
        leaderboard={leaderboard}
        sessionCode={sessionCode}
        triggerLabels={triggerLabels}
        onClose={() => setShowRanking(false)}
      />
    );
  }
  const introView = { AdaptiveMusic, musicModeKey, renderRecoveryNotice, renderErrorLogPanel, renderSaveStatus, setShowRanking, GAME_TITLE, simplifyPlayerText, activeCaseMeta, nextParticipantMessage, GAME_SUBTITLE, playStyleOptions, playStyle, setPlayStyle, persist, seasonCasesBase, caseObjectives, triggerLabSignals, hasResumableSave, node, formatSaveTime, lastSavedAt, log, progress, playerName, PLAYER_NAME_MAX_LENGTH, setPlayerName, limitText, startGame, dataConsent, setDataConsent, pendingTelemetryRef, setTelemetryStatus, telemetryEnabled, isOnline, telemetrySummary, sessionCode, debugToolsEnabled, showErrorLog, setShowErrorLog, unlockAllCasesForTest, debugCaseSelectRef, debugCaseId, debugCaseIdRef, debugNodeOptions, debugNodeId, debugNodeIdRef, debugNodeSelectRef, caseSequence, nodes, setDebugCaseId, setDebugNodeId, startDebugNode, playGuideItems, completedCaseResultList, seasonJourney, resourceMeta, seasonCases, caseResults, completedCases, currentCase, startCase, getCaseStatusText, resumeSavedGame, activePlayStyle, setPendingTelemetry, setSaveStatus, nodeOrders, normalizeCaseSummary };
  if (!started) {
    return <IntroScreen view={introView} />;
  }
  function advanceEndingStep() {
    if (endingStep === 0 && endingTwistIndex < 2) {
      setEndingTwistIndex((index) => index + 1);
      return;
    }
    setEndingStep((step) => Math.min(3, step + 1));
  }

  function saveNextParticipantMessage() {
    const message = limitText(nextParticipantMessage.trim(), 180);
    setNextParticipantMessage(message);
    writeStoredValue(NEXT_PARTICIPANT_MESSAGE_KEY, message);
    setEndingStep(3);
  }

  const resultView = { AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, currentCase, endingStep, endingTwistIndex, finalAftermathEntry, finalEndingEntry, caseResults, decisionFingerprint, observationLedger, endingProfile, advanceEndingStep, endingQuietReady, nextParticipantMessage, setNextParticipantMessage, saveNextParticipantMessage, unopenedRecordCount, GAME_TITLE, startCase, setStarted, setShowRanking, showSeasonMap, debugToolsEnabled, showErrorLog, setShowErrorLog, exportPlaytestLog, reset, playerName, activeCaseMeta, sceneTitleRef, triggerLabels, triggers, result, caseOutcome, resultRank, momentumTier, momentumScore, rankLine, scoreBreakdown, clamp, easyCognitionLabels, cognitionLabels, formatRiskDelta, counterfactualReport, sessionCode, telemetryStatus, pendingTelemetry, retryPendingTelemetry, scheduleTelemetryRetry, telemetryEnabled, dataConsent, isOnline, isRetryingTelemetry, copySessionCode, copyStatus, nextCaseSignal, resultBridge, achievementBadges, feedbackPrompts, currentFeedback, updateCurrentFeedback, FEEDBACK_COMMENT_MAX_LENGTH, activeFeedbackPrivacySignals, anonymizeFeedbackComment, submitCurrentFeedback, isSubmittingFeedback, feedbackStatus, routeTimeline, resourceMeta, explainResourceTradeoff, log, clueCount, renderSceneLines };
  if (isResult) {
    return <ResultScreen view={resultView} />;
  }

  const playView = { suspenseState, AdaptiveMusic, musicModeKey, renderDecisionReveal, renderRecoveryNotice, renderErrorLogPanel, screenReaderStatus, simplifyPlayerText, caseObjectives, currentCase, node, triggerLabels, openingLegacy, pressureCascade, riskPressure, playGuideItems, sceneTitleRef, saveCurrentGame, reset, renderSaveStatus, progress, easyRiskLabels, riskTier, activeBonus, freeTextCombo, currentAverageResponseTime, log, clueCount, discoveredClues, currentChallengeStreak, momentumTier, streakGoal, streakRemaining, momentumScore, decisionSeconds, protocolUsed, isAdvancing, activateCrisisProtocol, decisionFingerprint, decisionLedger, resourceMeta, sceneChallenge, triggerLabSignals, narrativeSpine, questSteps, sceneVisuals, speakerProfile, latestFreeTextSuccess, resolvedNodeId, sceneDirection, latestBeat, renderSceneLines, setMemoOpened, echo, probeUsed, echoProbeCost, requestEchoProbe, getEchoChecks, pendingChoice, showTacticalDetails, setShowTacticalDetails, decisionForecasts, pressureLeader, pressureLensForecast, tradeoffLensForecast, previewChoice, describeForecast, evidenceCount, pendingChoiceRead, pendingChoiceForecast, commitConsoleRef, formatRiskDelta, setPendingChoice, commitConfirmRef, choose, fixedChoices, getEffectiveChoiceRead, getRiskPressure, getChallengeMatch, choiceButtonsRef, handleChoiceClick, beginChoiceHold, endChoiceHold, speechifyChoice, getChoiceSubtext, getDramaticChoiceLabel, explainResourceTradeoff, easyCognitionLabels, cognitionLabels, freeChoice, boardChangePrompts, updateFreeText, freeText, FREE_TEXT_MAX_LENGTH, freeTextBlockedByPrivacy, activePrivacySignals, anonymizeFreeText, activeFreeTextSignalCount, freeTextSignals, freeTextPreview, applyEffect, resources, playerName, activePlayStyle, turnBriefItems, completedCases, activeCaseMeta, debugToolsEnabled, fallbackCaseId, routeIndex, routeLength, silentFailureCount, copyReplayLink, copyDiagnosticTrace };
  return <PlayScreen view={playView} />;

}

export class AppErrorBoundary extends React.Component {
  state = { hasError: false, recoveryMessage: "" };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical Point render error", error);
    try {
      recordAppError(error, errorInfo, "react-render");
    } catch (recoveryError) {
      console.warn("Critical Point recovery logging failed", recoveryError);
    }
  }

  reload({ clearSave = false } = {}) {
    const retryCount = Number(getSavedRecoveryState()?.lastError?.retryCount) || 0;
    if (!clearSave && retryCount >= 2) {
      this.setState({
        recoveryMessage: "같은 저장 지점에서 오류가 반복되어 재시도를 중단했습니다. 저장본을 초기화하고 새 게임으로 시작하거나 복구 슬롯을 선택하세요.",
      });
      return;
    }
    if (clearSave) suppressSaves();
    if (clearSave && !removeStoredValue(STORAGE_KEY)) {
      saveSuppressed = false;
      this.setState({
        recoveryMessage: "현재 저장본을 삭제하지 못했습니다. 브라우저 저장소 권한을 확인한 뒤 다시 시도하세요.",
      });
      return;
    }
    if (clearSave) writeStoredValue(RECOVERY_CENTER_STORAGE_KEY, "1");
    removeStoredValue(DEBUG_RENDER_CRASH_KEY);
    window.location.reload();
  }

  render() {
    const forcedDebugError = debugToolsEnabled && readStoredValue(DEBUG_RENDER_CRASH_KEY) === "1";
    const retryCount = Number(getSavedRecoveryState()?.lastError?.retryCount) || 0;
    if (!this.state.hasError && !forcedDebugError) return this.props.children;

    return (
      <main className="error-screen">
        <section className="error-panel" role="alert">
          <span className="eyebrow">CRITICAL POINT / RECOVERY</span>
          <h1>장면을 불러오지 못했습니다.</h1>
          <p>오류 지점은 자동 저장됐습니다. 수정 후 다시 열면 저장된 장면에서 이어서 진행할 수 있습니다.</p>
          {this.state.recoveryMessage && (
            <p className="error-recovery-message" role="status">
              {this.state.recoveryMessage}
            </p>
          )}
          {retryCount >= 2 && (
            <p className="error-retry-blocked" role="status">
              같은 저장 지점에서 오류가 반복되어 재시도를 중단했습니다. 저장본을 초기화하면 복구 슬롯과 로그를 보존한 채 새 게임으로 시작할 수 있습니다.
            </p>
          )}
          <div className="error-actions">
            <button type="button" className="ghost" data-testid="error-start-fresh" aria-label="현재 저장본만 초기화" onClick={() => this.reload({ clearSave: true })}>
              저장본을 초기화하고 새 게임
            </button>
            <button type="button" data-testid="error-retry" disabled={retryCount >= 2} onClick={() => this.reload()}>
              저장된 지점에서 다시 시도
            </button>
          </div>
          <p className="error-recovery-hint">복구 슬롯과 에러 로그는 보존됩니다. 같은 지점에서 계속 실패하면 저장본을 초기화하고 새 게임으로 진입하세요.</p>
        </section>
      </main>
    );
  }
}
