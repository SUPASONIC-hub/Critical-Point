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
import "./styles.css";
import {
  FEEDBACK_COMMENT_MAX_LENGTH,
  copyText,
  FREE_TEXT_MAX_LENGTH,
  readStoredValue,
  removeStoredValue,
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
  writeStoredValue,
} from "./appConfig.js";
import {
  boardChangePrompts,
  caseObjectives,
  caseOpeningRoutes,
  characterProfiles,
  cognitionLabels,
  initialResources,
  nodeOrders,
  nodes,
  seasonCasesBase,
  triggerLabels,
} from "./gameData.js";
import {
  applyEffect,
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
  saveFeedbackTelemetry,
  fetchLeaderboard,
  telemetryEnabled,
} from "./telemetry.js";
import { buildLeaderboard, getLeaderboardHeadline } from "./ranking.js";
import { easyCognitionLabels, easyResourceLabels, easyRiskLabels, simplifyPlayerText } from "./playerLanguage.js";

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

const caseSequence = ["case01", "case02", "case03", "case04", "case05", "final"];

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
    interval: 920,
    volume: 0.14,
    wave: "sine",
    bass: [55, 55, 65.4, 49],
    notes: [220, null, 277.18, null, 196, 246.94, null, 164.81],
  },
  controlled: {
    label: "안정",
    interval: 760,
    volume: 0.15,
    wave: "triangle",
    bass: [65.4, 73.42, 82.41, 73.42],
    notes: [261.63, null, 329.63, 392, null, 293.66, 349.23, null],
  },
  unstable: {
    label: "불안정",
    interval: 560,
    volume: 0.16,
    wave: "triangle",
    bass: [73.42, 69.3, 82.41, 65.4],
    notes: [293.66, 311.13, null, 392, 349.23, null, 329.63, 277.18],
  },
  critical: {
    label: "위기",
    interval: 390,
    volume: 0.18,
    wave: "sawtooth",
    bass: [49, 51.91, 55, 46.25],
    notes: [196, 207.65, null, 233.08, 246.94, null, 220, 207.65],
  },
  result: {
    label: "결과",
    interval: 980,
    volume: 0.15,
    wave: "sine",
    bass: [65.4, 82.41, 98, 73.42],
    notes: [261.63, null, 392, 329.63, null, 440, 392, null],
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
      playTone(context, masterGainRef.current, note, currentMode.interval / 1200, 0.3, currentMode.wave);
      if (step % 4 === 0) {
        playTone(context, masterGainRef.current, bass, currentMode.interval / 650, 0.2, "sine");
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

function getRouteMarker(entry) {
  const scene = nodes[entry.nodeId];
  if (scene?.phase === "BRANCH BRIEFING") return { label: "분기 시작", tone: "branch" };
  if (entry.nodeId.includes("aftershock")) return { label: "후폭풍", tone: "aftermath" };
  if (entry.nodeId.includes("reaction")) return { label: "즉시 반응", tone: "reaction" };
  if (["WITNESS", "TRACE", "ASSEMBLY", "BARGAIN", "AUDIT", "PUBLIC", "PATTERN", "VOICE", "DILEMMA"].some((phase) => scene?.phase?.includes(phase))) {
    return { label: "증거 추적", tone: "evidence" };
  }
  return { label: "핵심 판단", tone: "decision" };
}

function App() {
  const saved = useMemo(() => {
    try {
      return JSON.parse(readStoredValue(STORAGE_KEY, "null"));
    } catch {
      return null;
    }
  }, []);
  const sessionId = useMemo(() => getSessionId(), []);
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);

  const [playerName, setPlayerName] = useState(saved?.playerName ?? "");
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
  const [triggers, setTriggers] = useState(saved?.triggers ?? makeEmptyScores(triggerLabels));
  const [cognition, setCognition] = useState(saved?.cognition ?? makeEmptyScores(cognitionLabels));
  const [freeText, setFreeText] = useState("");
  const [echo, setEcho] = useState(saved?.echo ?? "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.");
  const [nodeEnteredAt, setNodeEnteredAt] = useState(saved?.nodeEnteredAt ?? Date.now());
  const [copyStatus, setCopyStatus] = useState("");
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [decisionReveal, setDecisionReveal] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(saved?.savedAt ?? "");
  const [isPausedSave, setIsPausedSave] = useState(saved?.paused ?? false);
  const [pendingTelemetry, setPendingTelemetry] = useState(saved?.pendingTelemetry ?? []);
  const [isRetryingTelemetry, setIsRetryingTelemetry] = useState(false);
  const [decisionSeconds, setDecisionSeconds] = useState(45);
  const [protocolUsed, setProtocolUsed] = useState(saved?.protocolUsed ?? false);
  const [showTacticalDetails, setShowTacticalDetails] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardStatus, setLeaderboardStatus] = useState("idle");
  const [leaderboardError, setLeaderboardError] = useState("");
  const [timerPenaltyApplied, setTimerPenaltyApplied] = useState(saved?.timerPenaltyApplied ?? false);
  const [probeUsed, setProbeUsed] = useState(saved?.probeUsed ?? false);
  const [telemetryStatus, setTelemetryStatus] = useState({
    tone: telemetryEnabled ? "ready" : "local",
    text: telemetryEnabled
      ? "DB 연결 준비됨. 데이터 제공 동의 시 케이스 완료 로그가 저장됩니다."
      : "DB 미연결. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
  });

  const fallbackCaseId = seasonCasesBase.some((caseItem) => caseItem.id === currentCase)
    ? currentCase
    : "case01";
  const activePlayStyle = playStyleOptions.find((style) => style.id === playStyle) ?? playStyleOptions[0];
  const activeNodeOrder = nodeOrders[fallbackCaseId] ?? nodeOrders.case01;
  const fallbackNodeId = activeNodeOrder[0] ?? "start";
  const resolvedNodeId = nodes[nodeId] ? nodeId : fallbackNodeId;
  const baseCaseStartNodes = {
    case01: "start",
    case02: "c2_start",
    case03: "c3_start",
    case04: "c4_start",
    case05: "c5_start",
    final: "f_start",
  };
  const branchOpeningNodeIds = new Set([
    baseCaseStartNodes[fallbackCaseId],
    ...Object.values(caseOpeningRoutes[fallbackCaseId] ?? {}),
  ]);
  const isOpeningNode = branchOpeningNodeIds.has(resolvedNodeId);
  const node = nodes[resolvedNodeId] ?? nodes.start;
  const isResult =
    nodeId === "result" ||
    nodeId === "case02_result" ||
    nodeId === "case03_result" ||
    nodeId === "case04_result" ||
    nodeId === "case05_result" ||
    nodeId === "final_result";
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
  const fixedChoices = node?.choices?.filter((choice) => choice.type !== "free") ?? [];
  const freeChoice = node?.choices?.find((choice) => choice.type === "free");
  const latestBeat = log.at(-1)?.sceneBeat ?? "";
  const freeTextSignals = getFreeTextSignals(freeText);
  const activeFreeTextSignalCount = freeTextSignals.filter((signal) => signal.active).length;
  const freeTextPreview = freeText.trim() ? scoreFreeText(freeText) : null;
  const privacySignals = detectPrivacySignals(freeText);
  const activePrivacySignals = privacySignals.filter((signal) => signal.active);
  const freeTextBlockedByPrivacy = activePrivacySignals.length > 0;
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
  const clueCount = discoveredClues.length;
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

  function mergeEffects(...effects) {
    return effects.reduce((merged, effect = {}) => {
      Object.entries(effect).forEach(([key, value]) => {
        merged[key] = (merged[key] ?? 0) + value;
      });
      return merged;
    }, {});
  }

  function getFlowSurge(tacticalRead, challengeMatch, riskDelta) {
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
    })
    .sort((a, b) => {
      if (a.forecast.riskDelta !== b.forecast.riskDelta) {
        return a.forecast.riskDelta - b.forecast.riskDelta;
      }
      return b.forecast.cognitionGain - a.forecast.cognitionGain;
    });
  const safestForecast = decisionForecasts[0];
  const costliestForecast = [...decisionForecasts].sort((a, b) => {
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
    { label: "모멘텀", value: `${momentumTier} ${momentumScore}` },
    { label: "보너스", value: activeBonus },
    { label: "남은 시간", value: `${decisionSeconds}초` },
  ];
  const currentFeedback = playtestFeedback[currentCase] ?? {
    clarity: "",
    difficulty: "",
    comment: "",
    savedAt: "",
  };
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const firstRenderRef = useRef(true);
  const sceneTitleRef = useRef(null);
  const hasResumableSave =
    !started &&
    currentCase &&
    nodeId &&
    (isPausedSave || Boolean(saveStatus) || Boolean(lastSavedAt && (log.length > 0 || completedCases.length > 0)));
  const telemetrySummary = telemetryEnabled
    ? dataConsent
      ? {
          tone: "ready",
          title: "DB 연결됨",
          text: "케이스 완료와 피드백 제출 시 Supabase에 원격 저장합니다.",
        }
      : {
          tone: "pending",
          title: "DB 연결됨 · 동의 대기",
          text: "체크박스에 동의하면 이 세션의 완료 로그와 피드백을 원격 저장합니다.",
        }
    : {
        tone: "local",
        title: "DB 미연결",
      text: "환경변수가 없어 브라우저 저장과 JSON 내보내기만 사용합니다.",
    };
  const localLeaderboardRows = useMemo(
    () => Object.entries(caseResults).map(([caseId, summary]) => ({
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
        setLeaderboardStatus("error");
        setLeaderboardError("원격 기록을 불러오지 못해 이 브라우저의 완료 기록만 표시합니다.");
      });
    return () => {
      cancelled = true;
    };
  }, [localLeaderboardRows, showRanking]);
  const musicModeKey = isResult ? "result" : started ? riskTier.toLowerCase() : "intro";

  useEffect(() => {
    if (!started || isResult) return undefined;
    setDecisionSeconds(45);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    const timer = window.setInterval(() => {
      setDecisionSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, currentCase, resolvedNodeId, isResult]);

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
    const payload = {
        saveSchemaVersion: SAVE_SCHEMA_VERSION,
        playerName,
        playStyle,
        openingLegacy,
        dataConsent,
        started,
        currentCase,
        completedCases,
        caseResults,
        playtestFeedback,
        nodeId,
        resources,
        log,
        triggers,
        cognition,
        echo,
        nodeEnteredAt,
        pendingTelemetry,
        protocolUsed,
        timerPenaltyApplied,
        probeUsed,
        paused: isPausedSave,
        savedAt: new Date().toISOString(),
        ...nextState,
      };
    const storageSaved = writeStoredValue(STORAGE_KEY, JSON.stringify(payload));
    if (!storageSaved) {
      setSaveStatus("브라우저 저장소를 사용할 수 없어 현재 탭에서만 진행됩니다.");
    }
    return { ...payload, storageSaved };
  }

  function startGame() {
    const name = playerName.trim() || "분석관";
    setPlayerName(name);
    setStarted(true);
    setIsPausedSave(false);
    setCurrentCase("case01");
    setProtocolUsed(false);
    setTimerPenaltyApplied(false);
    setProbeUsed(false);
    setOpeningLegacy(null);
    setDecisionReveal(null);
    setPendingChoice(null);
    setNodeId("start");
    setNodeEnteredAt(Date.now());
    persist({
      playerName: name,
      playStyle,
      openingLegacy: null,
      dataConsent,
      started: true,
      currentCase: "case01",
      nodeId: "start",
      nodeEnteredAt: Date.now(),
      protocolUsed: false,
      timerPenaltyApplied: false,
      probeUsed: false,
      paused: false,
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

  function startCase(caseId) {
    const baseStartNode =
      caseId === "final"
        ? "f_start"
        : caseId === "case05"
        ? "c5_start"
        : caseId === "case04"
        ? "c4_start"
        : caseId === "case03"
          ? "c3_start"
          : caseId === "case02"
            ? "c2_start"
            : "start";
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
      protocolUsed: false,
      timerPenaltyApplied: false,
      probeUsed: false,
      openingLegacy: legacy,
      echo: openingEcho,
      nodeEnteredAt: Date.now(),
    });
  }

  function anonymizeFreeText() {
    setFreeText(limitText(anonymizeSensitiveText(freeText), FREE_TEXT_MAX_LENGTH));
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

  function buildCaseSummary(nextTriggers, nextCognition, nextLog) {
    return createCaseSummary(nextTriggers, nextCognition, nextLog, {
      resources,
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
      momentumScore: summary?.momentumScore ?? 0,
      momentumTier: summary?.momentumTier ?? "BUILDING",
      rank: summary?.rank ?? "C",
      outcomeChoiceId: summary?.outcomeChoiceId ?? null,
      outcomeNodeId: summary?.outcomeNodeId ?? null,
    };
  }

  function queueTelemetry(item) {
    const nextQueue = [
      ...pendingTelemetry.filter((queued) => queued.id !== item.id),
      {
        queuedAt: new Date().toISOString(),
        ...item,
      },
    ];
    setPendingTelemetry(nextQueue);
    persist({ pendingTelemetry: nextQueue });
  }

  async function sendTelemetryItem(item) {
    if (item.type === "case") return saveCaseTelemetry(item.payload);
    if (item.type === "feedback") return saveFeedbackTelemetry(item.payload);
    throw new Error(`Unknown telemetry item type: ${item.type}`);
  }

  async function retryPendingTelemetry() {
    if (!telemetryEnabled || !dataConsent || pendingTelemetry.length === 0 || isRetryingTelemetry) return;
    setIsRetryingTelemetry(true);
    setTelemetryStatus({
      tone: "pending",
      text: `대기 중인 원격 저장 ${pendingTelemetry.length}건을 다시 전송하는 중입니다.`,
    });

    const failedItems = [];
    for (const item of pendingTelemetry) {
      try {
        await sendTelemetryItem(item);
      } catch (error) {
        console.warn(error);
        failedItems.push(item);
      }
    }

    setPendingTelemetry(failedItems);
    persist({ pendingTelemetry: failedItems });
    setIsRetryingTelemetry(false);
    setTelemetryStatus(
      failedItems.length === 0
        ? {
            tone: "success",
            text: "대기 중이던 원격 저장을 모두 완료했습니다.",
          }
        : {
            tone: "error",
            text: `원격 저장 ${failedItems.length}건이 아직 실패 상태입니다. 잠시 후 다시 시도하세요.`,
          },
    );
  }

  function choose(choice) {
    if (isAdvancing) return;
    setIsAdvancing(true);
    setPendingChoice(null);
    const responseTimeSec = Math.max(1, Math.round((Date.now() - nodeEnteredAt) / 1000));
    const free = choice.type === "free";
    const freeResult = free ? scoreFreeText(freeText) : null;
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
    const finalEffect = mergeEffects(
      effect,
      ...(tempoBonus ? [tempoBonus.effect] : []),
      ...(instinctSurge ? [instinctSurge.effect] : []),
      ...(auditSurge ? [auditSurge.effect] : []),
    );
    const finalResourcesWithTempo = applyEffect(resources, finalEffect);
    const clue = getClueReveal(challengeMatch, challengeRiskDelta, responseTimeSec);
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
      choiceId: choice.id,
      title: node.title,
      choice: choice.label,
      spokenChoice: getDramaticChoiceLabel(choice),
      freeText: free ? freeText.trim() : "",
      effect: finalEffect,
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
      suspenseEvent,
      clue,
      note: freeResult?.note ?? "",
      responseTimeSec,
      resourcesBefore: resources,
      resourcesAfter: finalResourcesWithTempo,
    };

    const nextLog = [...log, entry];
    const nextEcho = entry.echo;
    const nextNode = choice.next;
    const nextCompletedCases =
      nextNode === "result" ||
      nextNode === "case02_result" ||
      nextNode === "case03_result" ||
      nextNode === "case04_result" ||
      nextNode === "case05_result" ||
      nextNode === "final_result"
        ? Array.from(new Set([...completedCases, currentCase]))
        : completedCases;
    const completedNow = nextCompletedCases !== completedCases;
    const caseSummary = completedNow
      ? {
          ...buildCaseSummary(nextTriggers, nextCognition, nextLog),
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
          text: "DB 미연결. 이 케이스 로그는 로컬과 JSON 내보내기에만 남습니다.",
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
          player_name: playerName.trim().slice(0, 24) || "익명 분석관",
          case_id: currentCase,
          case_title: activeCaseMeta?.title ?? currentCase,
          completed_at: new Date().toISOString(),
          summary: caseSummary,
          resources: finalResourcesWithTempo,
          triggers: nextTriggers,
          cognition: nextCognition,
          decision_log: nextLog,
          feedback: playtestFeedback[currentCase] ?? null,
        };
        setTelemetryStatus({
          tone: "pending",
          text: "케이스 로그를 원격 DB에 저장하는 중입니다.",
        });
        saveCaseTelemetry(caseTelemetryPayload)
          .then(() => {
            setTelemetryStatus({
              tone: "success",
              text: "케이스 로그가 원격 DB에 저장됐습니다.",
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
      suspenseEvent,
      clue,
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
      timerPenaltyApplied: false,
      probeUsed: false,
      nodeEnteredAt: Date.now(),
    });
  }

  function previewChoice(choice) {
    if (isAdvancing || choice.type === "free") return;
    setPendingChoice(choice);
  }

  function reset() {
    removeStoredValue("trigger-prototype");
    removeStoredValue(STORAGE_KEY);
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
    setPendingTelemetry([]);
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
    setSaveStatus("");
    setLastSavedAt("");
    setIsPausedSave(false);
    setNodeEnteredAt(Date.now());
    setTelemetryStatus({
      tone: telemetryEnabled ? "ready" : "local",
      text: telemetryEnabled
        ? "DB 연결 준비됨. 데이터 제공 동의 시 케이스 완료 로그가 저장됩니다."
        : "DB 미연결. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
    });
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

  function exportPlaytestLog() {
    const payload = {
      saveSchemaVersion: SAVE_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      playerName,
      currentCase,
      openingLegacy,
      completedCases,
      caseResults,
      playtestFeedback,
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
        challengeClearCount,
        reducedRiskCount,
        currentChallengeStreak,
        freeTextCombo,
        riskPressure,
        riskTier,
        activeBonus,
        protocolUsed,
      },
      log,
      telemetryEnabled,
      dataConsent,
      sessionId,
      sessionCode,
      pendingTelemetry,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `trigger-playtest-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copySessionCode() {
    if (await copyText(sessionCode)) {
      setCopyStatus("복사됨");
    } else {
      setCopyStatus("복사 실패");
    }
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
    () => log.filter((entry) => !entry.isSystemEvent).map((entry, index) => ({ ...entry, index, marker: getRouteMarker(entry) })),
    [log],
  );
  const finalEndingEntry = [...log].reverse().find((entry) => entry.nodeId === "f_choice");
  const finalAftermathEntry = [...log].reverse().find((entry) => entry.nodeId === "f_aftershock");
  const outcomeNodeId = currentCase === "final" ? "f_aftershock" : `${currentCase}_aftershock`;
  const outcomeEntry = [...log].reverse().find((entry) => entry.nodeId === outcomeNodeId);
  const caseOutcome = getCaseOutcome({ caseId: currentCase, choiceId: outcomeEntry?.choiceId });
  const endingProfiles = {
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
    if (activeFeedbackPrivacySignals.length > 0) {
      setFeedbackStatus("식별 정보로 보일 수 있는 표현을 익명화한 뒤 저장해 주세요.");
      return;
    }

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
          : "로컬에 저장했습니다. DB 미연결 상태라 원격 저장은 건너뛰었습니다.",
      );
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

  const progress = isResult
    ? 100
    : Math.round(((activeNodeOrder.indexOf(resolvedNodeId) + 1) / activeNodeOrder.length) * 100);
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
  const feedbackPrivacySignals = detectPrivacySignals(currentFeedback.comment);
  const activeFeedbackPrivacySignals = feedbackPrivacySignals.filter((signal) => signal.active);
  const screenReaderStatus = isResult
    ? `${activeCaseMeta?.label ?? "현재 케이스"} 결과 화면입니다. 랭크 ${resultRank}, 모멘텀 ${momentumScore}점, 주요 트리거는 ${triggerLabels[result.primary[0]]}입니다.`
    : `${activeCaseMeta?.label ?? "현재 케이스"} ${node.title} 장면입니다. 진행률 ${progress}퍼센트, 챌린지는 ${sceneChallenge.title}, 위험 압력은 ${riskTier} ${riskPressure}입니다.`;
  const rankLine =
    resultRank === "S"
      ? "장면 목표, 위험 제어, 판 바꾸기가 균형 있게 맞물렸습니다."
      : resultRank === "A"
        ? "판단 흐름이 안정적입니다. 한두 장면만 더 공략하면 최고 랭크에 닿습니다."
        : resultRank === "B"
          ? "핵심 선택은 통과했습니다. 다음 플레이에서는 챌린지 조건을 더 의식해도 좋습니다."
          : "사건은 통과했지만 보상 조건은 많이 남았습니다. 위험 예고와 구조 재설계를 더 활용해보세요.";
  const scoreBreakdown = [
    { label: "챌린지", value: challengeClearCount, text: `${challengeClearCount}개 달성` },
    { label: "위험 제어", value: reducedRiskCount, text: `${reducedRiskCount}회 하락` },
    { label: "플로우 서지", value: flowSurgeCount, text: `${flowSurgeCount}회 발동` },
    { label: "판 바꾸기", value: freeTextCombo, text: `${freeTextCombo}회 사용` },
    { label: "응답 평균", value: result.averageResponseTime, text: `${result.averageResponseTime}s` },
  ];
  const achievementBadges = [
    { title: `Momentum ${momentumTier}`, text: `플레이 모멘텀 ${momentumScore}점을 기록했습니다.` },
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
    return text.split("\n").map((line) => (
      <p className={getSceneLineType(line)} key={line}>
        {simplifyPlayerText(line)}
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

  function renderDecisionReveal() {
    if (!decisionReveal) return null;
    const revealTone = decisionReveal.clue
      ? "clue-found"
      : decisionReveal.suspenseEvent
        ? "system-alert"
        : decisionReveal.cascade
          ? "chain-reaction"
          : "decision-locked";
    return (
      <div className="decision-reveal-backdrop" role="presentation">
        <div className={`cinematic-burst ${revealTone}`} aria-hidden="true">
          <div className="cinematic-vignette" />
          <div className="impact-ring" />
          <div className="impact-lines">
            {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--line-index": index }} />)}
          </div>
        </div>
        <section
          className={`decision-reveal ${revealTone}${decisionReveal.cascade ? " cascade" : ""}${decisionReveal.suspenseEvent ? " suspense-twist" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="decision-reveal-title"
        >
          <div className="cinematic-status">
            <span className="cinematic-status-dot" />
            <b>{decisionReveal.clue ? "NEW EVIDENCE" : decisionReveal.suspenseEvent ? "SYSTEM ALERT" : decisionReveal.cascade ? "CHAIN REACTION" : "DECISION LOCKED"}</b>
            <span>{decisionReveal.clue ? "새 단서가 기록되었습니다" : "선택의 영향이 번지는 중"}</span>
          </div>
          <div className="decision-reveal-kicker">
            <span>{decisionReveal.label}</span>
            {decisionReveal.cascade && <strong>압박 연쇄</strong>}
            {decisionReveal.suspenseEvent && <strong>반전 신호</strong>}
          </div>
          <h2 id="decision-reveal-title">{simplifyPlayerText(decisionReveal.title)}</h2>
          <p className="decision-reveal-choice">"{simplifyPlayerText(decisionReveal.spokenChoice)}"</p>
          <div className="decision-reveal-beat">
            {renderSceneLines(decisionReveal.beat.split("\n").slice(-3).join("\n"))}
          </div>
          <p className="decision-reveal-consequence">{decisionReveal.consequence}</p>
          {decisionReveal.clue && (
            <div className="cinematic-clue-card">
              <Sparkles size={18} />
              <div>
                <span>숨은 단서 발견</span>
                <strong>{decisionReveal.clue.title}</strong>
                <p>{decisionReveal.clue.text}</p>
              </div>
            </div>
          )}
          <div className="decision-reveal-footer">
            <span>다음 장면 · {decisionReveal.nextTitle}</span>
            <button type="button" onClick={() => setDecisionReveal(null)} autoFocus>
              다음 장면으로
              <ChevronRight size={17} />
            </button>
          </div>
        </section>
      </div>
    );
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
      <main className="shell ranking-shell">
        <AdaptiveMusic modeKey="intro" />
        <section className="ranking-page">
          <div className="topbar">
            <button className="ghost" type="button" onClick={() => setShowRanking(false)}>
              <ArrowLeft size={16} />
              브리핑으로 돌아가기
            </button>
            <span className="brand-mark">{GAME_TITLE}</span>
          </div>
          <header className="ranking-hero">
            <span>PUBLIC SIGNAL BOARD</span>
            <h1>누가 가장 오래 생각했는가</h1>
            <p>
              완료된 사건의 모멘텀 점수와 랭크를 비교합니다. 점수가 높다는 것은 정답을 맞혔다는 뜻이 아니라,
              압박 속에서 위험을 관리하고 선택지를 확장했다는 뜻입니다.
            </p>
          </header>
          <section className="ranking-status-bar">
            <div>
              <span>{leaderboardStatus === "ready" ? "REMOTE LEADERBOARD" : "LOCAL PLAYTEST BOARD"}</span>
              <strong>{rankingHeadline.title}</strong>
              <p>{leaderboardError || rankingHeadline.text}</p>
            </div>
            <button type="button" onClick={() => setShowRanking(false)}>
              <ChevronRight size={17} />
              내 기록 만들기
            </button>
          </section>
          <section className="ranking-table-panel" aria-label="플레이어 랭킹">
            <div className="ranking-table-heading">
              <div>
                <span>SEASON 1 / BEST RUN</span>
                <h2>현재 기준선</h2>
              </div>
              <small>{leaderboard.length}명의 기록</small>
            </div>
            {leaderboardStatus === "loading" ? (
              <p className="ranking-empty">기록을 불러오는 중입니다.</p>
            ) : leaderboard.length === 0 ? (
              <p className="ranking-empty">아직 완료된 기록이 없습니다. 첫 시즌을 끝내고 기준선을 세워보세요.</p>
            ) : (
              <div className="ranking-list">
                {leaderboard.map((entry) => (
                  <article className={entry.sessionCode === sessionCode ? "ranking-row current-player" : "ranking-row"} key={entry.id}>
                    <strong className="ranking-position">{String(entry.position).padStart(2, "0")}</strong>
                    <div className="ranking-player">
                      <b>{entry.name}</b>
                      <small>{entry.caseTitle} · 주요 압박 {triggerLabels[entry.trigger] ?? entry.trigger}</small>
                    </div>
                    <div className="ranking-stat">
                      <span>RANK</span>
                      <b>{entry.rank}</b>
                    </div>
                    <div className="ranking-stat score-stat">
                      <span>MOMENTUM</span>
                      <b>{entry.score}</b>
                    </div>
                    <div className="ranking-detail">
                      <span>평균 {entry.averageResponseTime}s</span>
                      <span>자유입력 {entry.freeCount}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          <p className="ranking-footnote">
            이름은 데이터 제공 동의가 있는 완료 기록에만 표시되며, 원격 연결이 없으면 이 브라우저의 로컬 기록만 집계합니다.
          </p>
        </section>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="shell intro-shell">
        <AdaptiveMusic modeKey={musicModeKey} />
        <section className="intro">
          <div className="brand-row">
            <span className="brand-mark">{GAME_TITLE}</span>
            <div className="top-actions">
              <button className="ghost intro-ranking-button" type="button" onClick={() => setShowRanking(true)}>
                <Trophy size={16} />
                랭킹
              </button>
              <span className="case-chip">임계점 / {simplifyPlayerText(activeCaseMeta?.title ?? GAME_TITLE)}</span>
            </div>
          </div>
          <h1>{GAME_TITLE}</h1>
          <strong className="intro-kicker">{GAME_SUBTITLE}</strong>
          <div className="creator-badge">
            <img src="/profile.jpg" alt="" />
            <span>Created by SUPASONIC</span>
          </div>
          <figure className="intro-visual">
            <picture>
              <source srcSet="/triggerlab-key-visual.webp" type="image/webp" />
              <img
                src="/triggerlab-key-visual.png"
                alt="트리거랩 작전실에서 사건 지도를 분석하는 라이트노벨풍 일러스트"
                width="1792"
                height="1024"
                fetchPriority="high"
              />
            </picture>
            <figcaption>
              <span>TRIGGERLAB NIGHT SHIFT</span>
              <b>선택지는 사건을 끝내지 않는다. 다음 압박의 모양을 바꾼다.</b>
            </figcaption>
          </figure>
          <p>
            트리거랩의 신입 분석관이 되어 현재 한국의 기업·조직 위기를 검토합니다.
            사건은 훈련처럼 시작되지만, 당신이 오래 붙잡은 조건은 다음 사건의 압력이 됩니다.
          </p>
          <div className="season-panel">
            <div>
              <span>SEASON 1</span>
              <strong>사고를 깨우는 조건은 조종 가능한 조건이기도 하다.</strong>
            </div>
            <p>
              처음에는 내 판단이 깊어지는 순간을 찾습니다. 마지막에는 누군가 그 순간을
              설계할 수 있다면, 나는 여전히 자유로운지 묻게 됩니다.
            </p>
          </div>
          <section className="intro-brief" aria-label="첫 케이스 브리핑">
            <article>
              <span>첫 사건</span>
              <b>{seasonCasesBase[0].title}</b>
              <p>{caseObjectives.case01}</p>
            </article>
            <article>
              <span>관찰 항목</span>
              <b>손실 배분 순서</b>
              <p>{triggerLabSignals.case01}</p>
            </article>
            <article>
              <span>다음 압박</span>
              <b>기록은 다음 사건으로 이동한다</b>
              <p>오래 붙잡은 조건이 CASE 02의 신뢰와 증거 충돌로 이어집니다.</p>
            </article>
          </section>
          <section className="play-style-panel" aria-label="플레이 스타일 선택">
            <div className="panel-title-row">
              <div>
                <span>ANALYST PROTOCOL</span>
                <h2>어떤 방식으로 판단할까요?</h2>
              </div>
              <small>선택한 프로토콜은 이번 시즌에 적용됩니다.</small>
            </div>
            <div className="play-style-grid">
              {playStyleOptions.map((style) => (
                <button
                  type="button"
                  key={style.id}
                  className={playStyle === style.id ? "play-style selected" : "play-style"}
                  onClick={() => {
                    setPlayStyle(style.id);
                    persist({ playStyle: style.id });
                  }}
                  aria-pressed={playStyle === style.id}
                >
                  <span>{style.label}</span>
                  <strong>{style.title}</strong>
                  <p>{style.text}</p>
                  <small>{style.payoff}</small>
                </button>
              ))}
            </div>
            <p className="play-style-note">현재 선택: {activePlayStyle.label} · {activePlayStyle.title}</p>
          </section>
          <div className="start-panel">
            {hasResumableSave && (
              <div className="resume-panel">
                <div>
                  <span>저장된 진행</span>
                  <strong>{simplifyPlayerText(activeCaseMeta?.label ?? "현재 사건")} · {simplifyPlayerText(node.title)}</strong>
                  <small>
                    {formatSaveTime(lastSavedAt)} 저장 · {log.length}개 판단 기록 · 진행률 {progress}%
                  </small>
                </div>
                <button type="button" onClick={resumeSavedGame}>
                  <ChevronRight size={18} />
                  이어하기
                </button>
              </div>
            )}
            <label htmlFor="playerName">분석관 이름</label>
            <div className="start-input-row">
              <input
                id="playerName"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && startGame()}
                placeholder="이름을 입력하세요"
              />
              <button onClick={startGame}>
                <ChevronRight size={18} />
                첫 케이스 시작
              </button>
            </div>
            <label className="consent-box">
              <input
                type="checkbox"
                checked={dataConsent}
                onChange={(event) => {
                  setDataConsent(event.target.checked);
                  persist({ dataConsent: event.target.checked });
                }}
              />
              <span>
                <b>플레이테스트 데이터 제공 동의</b>
                <small>
                  {telemetryEnabled
                    ? "케이스 결과, 선택 로그, 응답 시간, 자유입력 내용이 연구용으로 저장됩니다. 이름은 원격 DB에 저장하지 않습니다."
                    : "현재 배포 환경에는 DB가 연결되어 있지 않아 원격 저장은 비활성화됩니다."}
                </small>
                <small className={telemetryEnabled ? "data-status ready" : "data-status local"}>
                  {telemetryEnabled ? "DB 연결됨" : "DB 미연결"}
                </small>
              </span>
            </label>
            <div className={`db-status-panel ${telemetrySummary.tone}`}>
              <div>
                <span>DB 상태</span>
                <strong>{telemetrySummary.title}</strong>
              </div>
              <p>{telemetrySummary.text}</p>
              <small>세션 코드 {sessionCode}</small>
            </div>
            <div className="privacy-note">
              <b>데이터 안내</b>
              <p>
                이름은 원격 DB에 저장하지 않습니다. 자유입력과 피드백에는 실명, 연락처,
                회사명처럼 개인이나 조직을 식별할 수 있는 정보는 쓰지 마세요. 삭제 요청은
                결과 화면의 8자리 세션 코드로 처리합니다.
              </p>
            </div>
            <button className="test-unlock" onClick={unlockAllCasesForTest}>
              테스트용 전체 케이스 열기
            </button>
          </div>
          <section className="quick-guide" aria-label="처음 플레이 가이드">
            <div className="guide-heading">
              <Info size={16} />
              <span>처음 플레이할 때 보는 기준</span>
            </div>
            <div className="guide-grid">
              {playGuideItems.map((item) => (
                <article key={item.title}>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
          {completedCaseResultList.length > 0 && (
            <section className="season-summary">
              <div>
                <span>SEASON LOG</span>
                <strong>완료한 케이스에서 반복적으로 활성화된 조건</strong>
              </div>
              <div className="season-summary-list">
                {completedCaseResultList.map((caseItem) => (
                  <article key={caseItem.id}>
                    <b>{caseItem.label}</b>
                    <span>{triggerLabels[caseItem.result.primary[0]]}</span>
                    <small>
                      RANK {caseItem.result.rank} · {caseItem.result.averageResponseTime}s · 자유입력{" "}
                      {caseItem.result.freeCount}
                    </small>
                  </article>
                ))}
              </div>
              <div className="season-journey" aria-label="사건 간 결말 연결">
                {seasonJourney.map((caseItem, index) => (
                  <React.Fragment key={caseItem.id}>
                    {index > 0 && <ChevronRight className="season-journey-arrow" size={18} aria-hidden="true" />}
                    <article className="season-journey-card">
                      <div className="season-journey-card-head">
                        <b>{caseItem.label}</b>
                        <span>{caseItem.outcome.tag}</span>
                      </div>
                      <strong>{caseItem.outcome.title}</strong>
                      <p>{caseItem.outcome.text}</p>
                      {Object.keys(caseItem.carryover).length > 0 && (
                        <small>
                          다음 사건 전달: {Object.entries(caseItem.carryover)
                            .map(([key, value]) => `${resourceMeta[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`)
                            .join(" · ")}
                        </small>
                      )}
                    </article>
                  </React.Fragment>
                ))}
              </div>
            </section>
          )}
          <div className="roadmap-heading">
            <span>SEASON ROADMAP</span>
            <b>케이스는 완료한 판단 로그를 다음 압박으로 넘기며 순서대로 열립니다.</b>
          </div>
          <div className="case-roadmap">
            {seasonCases.map((caseItem) => {
              const savedResult = caseResults[caseItem.id]
                ? normalizeCaseSummary(caseResults[caseItem.id])
                : null;
              const canOpenCase =
                caseItem.status === "OPEN" ||
                caseItem.status === "PLAYING" ||
                caseItem.status === "COMPLETE";
              function openCaseFromCard() {
                if (canOpenCase) startCase(caseItem.id);
              }
              return (
                <article
                  key={caseItem.id}
                  role={canOpenCase ? "button" : undefined}
                  tabIndex={canOpenCase ? 0 : undefined}
                  aria-disabled={canOpenCase ? undefined : true}
                  aria-label={`${caseItem.label} ${caseItem.title}. ${getCaseStatusText(caseItem.status)}`}
                  className={
                    caseItem.status === "PLAYING" || caseItem.status === "OPEN"
                      ? "case-card active-case"
                      : caseItem.status === "COMPLETE"
                        ? "case-card complete-case"
                        : "case-card"
                  }
                  onClick={openCaseFromCard}
                  onKeyDown={(event) => {
                    if ((event.key === "Enter" || event.key === " ") && canOpenCase) {
                      event.preventDefault();
                      openCaseFromCard();
                    }
                  }}
                >
                  <div>
                    <span>{caseItem.label}</span>
                    <small className="case-status-chip">
                      {caseItem.status === "LOCKED" && <LockKeyhole size={13} />}
                      {getCaseStatusText(caseItem.status)}
                    </small>
                  </div>
                  <h2>{simplifyPlayerText(caseItem.title)}</h2>
                  <b>{simplifyPlayerText(caseItem.trigger)}</b>
                  <p>{simplifyPlayerText(caseItem.summary)}</p>
                  {caseItem.status === "LOCKED" && (
                    <small className="case-lock-note">앞선 케이스의 판단 로그가 필요합니다.</small>
                  )}
                  {savedResult && (
                    <small className="case-result-mini">
                      RANK {savedResult.rank} · {triggerLabels[savedResult.primary[0]]} · {savedResult.averageResponseTime}s · 자유입력{" "}
                      {savedResult.freeCount}
                    </small>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  if (isResult) {
    return (
      <main className="shell">
        <AdaptiveMusic modeKey={musicModeKey} />
        {renderDecisionReveal()}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {screenReaderStatus}
        </p>
        <section className="result-page">
          <div className="topbar">
            <span className="brand-mark">{GAME_TITLE}</span>
            <div className="top-actions">
              <button className="ghost" onClick={() => { setStarted(false); setShowRanking(true); }}>
                <Trophy size={16} />
                랭킹
              </button>
              <button className="ghost" onClick={showSeasonMap}>
                <FileText size={16} />
                시즌 로드맵
              </button>
              <button className="ghost" onClick={exportPlaytestLog}>
                <Download size={16} />
                로그 내보내기
              </button>
              <button className="ghost" onClick={reset}>
                <RefreshCcw size={16} />
                다시 플레이
              </button>
            </div>
          </div>
          <div className="result-hero">
            <p>{playerName}의 {activeCaseMeta?.label} 사고 활성 프로필</p>
            <h1 ref={sceneTitleRef} tabIndex={-1}>
              {currentCase === "final"
                ? "이제 당신은 자신의 조건을 어떻게 쓸지 선택해야 합니다."
                : `${triggerLabels[result.primary[0]]} 조건에서 사고가 가장 오래 유지됐습니다.`}
            </h1>
          </div>
          <section className="outcome-panel" aria-label="내가 만든 결말">
            <div className="outcome-panel-mark">
              <span>YOUR CONSEQUENCE</span>
              <strong>{caseOutcome.tag}</strong>
            </div>
            <div>
              <h2>{caseOutcome.title}</h2>
              <p>{caseOutcome.text}</p>
            </div>
          </section>
          <section className={`rank-panel rank-${resultRank.toLowerCase()}`}>
            <div className="rank-mark">
              <span>CASE RANK</span>
              <strong>{resultRank}</strong>
            </div>
            <div className="rank-copy">
              <span>{momentumTier} · {momentumScore} POINTS</span>
              <h2>{rankLine}</h2>
              <p>
                다음 케이스는 이 랭크보다 트리거 분포를 더 중요하게 사용합니다. 그래도 랭크는
                이번 사건을 얼마나 능동적으로 공략했는지 보여주는 플레이 지표입니다.
              </p>
            </div>
            <div className="score-breakdown">
              {scoreBreakdown.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <b>{item.text}</b>
                  <div>
                    <i style={{ width: `${clamp(item.value * 18, item.value > 0 ? 14 : 4, 100)}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="fingerprint-panel" aria-label="판단 DNA">
            <div className="fingerprint-heading">
              <div>
                <span>DECISION DNA</span>
                <h2>{decisionFingerprint.modeTitle}</h2>
                <p>{decisionFingerprint.modeText}</p>
              </div>
              <strong>{decisionFingerprint.mode}</strong>
            </div>
            <div className="fingerprint-grid">
              <article>
                <span>PRIMARY PRESSURE</span>
                <b>{triggerLabels[decisionFingerprint.primaryTrigger[0]]}</b>
                <small>{decisionFingerprint.pressureShare}% of recorded pressure</small>
              </article>
              <article>
                <span>THINKING ENGINE</span>
                <b>{easyCognitionLabels[decisionFingerprint.primaryCognition[0]] ?? cognitionLabels[decisionFingerprint.primaryCognition[0]]}</b>
                <small>{decisionFingerprint.signature.join(" / ")}</small>
              </article>
              <article>
                <span>RISK TRAJECTORY</span>
                <b>{decisionFingerprint.ledger.netRiskDelta > 0 ? "압박 누적" : "압박 회수"}</b>
                <small>
                  {decisionFingerprint.ledger.riskDrops}회 하락 · {decisionFingerprint.ledger.riskRises}회 상승
                </small>
              </article>
            </div>
          </section>
          <section className="counterfactual-panel" aria-label="Counterfactual Lab">
            <div className="panel-title-row">
              <h2>COUNTERFACTUAL LAB</h2>
              <span>실제 선택과 버린 경로의 압박 차이</span>
            </div>
            {counterfactualReport.length > 0 ? (
              <div className="counterfactual-list">
                {counterfactualReport.map((report) => (
                  <article key={report.nodeId}>
                    <div className="counterfactual-scene">
                      <span>{report.title}</span>
                      <small>{report.actualWasSafest ? "가장 낮은 위험 경로" : "대안 경로와 차이 발생"}</small>
                    </div>
                    <div className="counterfactual-path actual-path">
                      <b>ACTUAL</b>
                      <strong>{report.actual.label}</strong>
                      <small>
                        위험 {report.actualForecast ? formatRiskDelta(report.actualForecast.riskDelta) : "기록"}
                      </small>
                    </div>
                    <div className="counterfactual-path safest-path">
                      <b>SAFEST ALTERNATIVE</b>
                      <strong>{report.safest.label}</strong>
                      <small>위험 {formatRiskDelta(report.safestForecast.riskDelta)}</small>
                    </div>
                    <div className="counterfactual-path costliest-path">
                      <b>HIGHEST PRESSURE</b>
                      <strong>{report.costliest.label}</strong>
                      <small>위험 {formatRiskDelta(report.costliestForecast.riskDelta)}</small>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="counterfactual-empty">선택 로그가 쌓이면 지나간 장면의 다른 경로가 열립니다.</p>
            )}
          </section>
          <section className="session-panel">
            <div>
              <span>PLAYTEST SESSION</span>
              <strong>{sessionCode}</strong>
              <p>테스터 인터뷰, JSON 로그, Supabase row를 맞출 때 쓰는 짧은 세션 코드입니다.</p>
              <small className={`remote-status ${telemetryStatus.tone}`}>
                {telemetryStatus.text}
              </small>
              {pendingTelemetry.length > 0 && (
                <div className="retry-telemetry">
                  <b>원격 저장 대기 {pendingTelemetry.length}건</b>
                  <p>
                    {pendingTelemetry.map((item) => item.label).join(" · ")}
                  </p>
                  <button
                    type="button"
                    onClick={retryPendingTelemetry}
                    disabled={!telemetryEnabled || !dataConsent || isRetryingTelemetry}
                  >
                    {isRetryingTelemetry ? "재전송 중" : "원격 저장 재시도"}
                  </button>
                </div>
              )}
            </div>
            <button onClick={copySessionCode}>
              <Copy size={16} />
              {copyStatus || "코드 복사"}
            </button>
          </section>
          {nextCaseSignal && (
            <section className="next-case-panel">
              <div>
                <span>{nextCaseSignal.eyebrow}</span>
                <h2>{nextCaseSignal.title}</h2>
                <p>{nextCaseSignal.premise}</p>
                <p className="next-case-hook">{nextCaseSignal.hook}</p>
                <small>{resultBridge}</small>
              </div>
              <button onClick={() => startCase(nextCaseSignal.caseId)}>
                <ChevronRight size={18} />
                {nextCaseSignal.button}
              </button>
            </section>
          )}
          <section className="achievement-panel">
            <div className="panel-title-row">
              <h2>
                <Sparkles size={17} />
                획득 배지
              </h2>
              <span>이번 케이스의 플레이 스타일입니다.</span>
            </div>
            <div>
              {achievementBadges.map((badge) => (
                <article key={badge.title}>
                  <b>{badge.title}</b>
                  <p>{badge.text}</p>
                </article>
              ))}
            </div>
          </section>
          <div className="result-grid">
            <section className="report-section">
              <h2>Primary Trigger</h2>
              <strong>{triggerLabels[result.primary[0]]}</strong>
              <p>
                {result.longestDecision?.title ?? "이번 케이스"}에서 가장 오래 남은 압박입니다.
                이후 선택 로그는 이 조건을 중심으로 다음 사건에 반영됩니다.
              </p>
            </section>
            <section className="report-section">
              <h2>Secondary Trigger</h2>
              <strong>{triggerLabels[result.secondary[0]]}</strong>
              <p>
                첫 번째 조건을 보조한 압박입니다. 같은 선택 안에서도 명분과 비용이 이
                방향으로 다시 흔들렸습니다.
              </p>
            </section>
            <section className="report-section">
              <h2>Cognitive Acceleration</h2>
              <strong>{easyCognitionLabels[result.thinking[0]] ?? cognitionLabels[result.thinking[0]]}</strong>
              <p>
                로그상 가장 자주 사용된 사고 방식입니다. 선택을 빠르게 닫기보다 이 방식으로
                한 번 더 버티거나 뒤집었습니다.
              </p>
            </section>
            <section className="report-section">
              <h2>Free Text</h2>
              <strong>{result.freeCount}회</strong>
              <p>
                준비된 선택지 밖에서 조건을 다시 짠 횟수입니다. 0회라면 다음 테스트에서는
                구조 재설계 유도가 충분했는지 확인해야 합니다.
              </p>
            </section>
            <section className="report-section">
              <h2>Avg Time</h2>
              <strong>{result.averageResponseTime}s</strong>
              <p>
                각 국면에서 결정을 내리기까지 걸린 평균 시간입니다. 짧을수록 선택지가
                명확했거나 압박이 약했을 수 있습니다.
              </p>
            </section>
            <section className="report-section wide-report">
              <h2>Longest Decision</h2>
              <strong>{result.longestDecision?.title ?? "없음"}</strong>
              <p>
                가장 오래 머문 국면입니다. 이 장면의 메모, 에코 반론, 선택지 비용이 실제
                고민을 만들었는지 인터뷰에서 우선 확인합니다.
              </p>
            </section>
          </div>
          <section className="route-atlas">
            <div className="panel-title-row">
              <h2>
                <Sparkles size={17} />
                내가 지나온 경로
              </h2>
              <span>{routeTimeline.length}개 판단 · 마지막 선택이 이번 결말을 만들었습니다.</span>
            </div>
            <div className="route-atlas-track" aria-label="이번 플레이 선택 경로">
              {routeTimeline.map((entry) => (
                <article className={`route-atlas-node ${entry.marker.tone}`} key={`${entry.nodeId}-${entry.index}`}>
                  <div className="route-atlas-dot" aria-hidden="true">{String(entry.index + 1).padStart(2, "0")}</div>
                  <div className="route-atlas-copy">
                    <div className="route-atlas-meta">
                      <span>{entry.marker.label}</span>
                      {entry.challenge && (
                        <b className={entry.challenge.matched ? "route-hit" : "route-miss"}>
                          {entry.challenge.matched ? "목표 달성" : "목표 미달"}
                        </b>
                      )}
                      {entry.clue && <b className="route-clue">단서 발견</b>}
                    </div>
                    <strong>{entry.title}</strong>
                    <p>{entry.freeText || entry.spokenChoice || entry.choice}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="feedback-panel">
            <div className="panel-title-row">
              <h2>
                <MessageSquareText size={17} />
                플레이테스트 피드백
              </h2>
              <span>이 케이스가 실제로 고민을 만들었는지 확인합니다.</span>
            </div>
            <div className="feedback-prompts">
              <span>이번 케이스에서 확인할 질문</span>
              <ul>
                {feedbackPrompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>
            </div>
            <div className="feedback-controls">
              <label>
                <span>이해도</span>
                <select
                  value={currentFeedback.clarity}
                  onChange={(event) => updateCurrentFeedback({ clarity: event.target.value })}
                >
                  <option value="">선택</option>
                  <option value="1">1 · 거의 이해되지 않음</option>
                  <option value="2">2 · 일부만 이해됨</option>
                  <option value="3">3 · 보통</option>
                  <option value="4">4 · 대체로 명확함</option>
                  <option value="5">5 · 매우 명확함</option>
                </select>
              </label>
              <label>
                <span>고민 강도</span>
                <select
                  value={currentFeedback.difficulty}
                  onChange={(event) => updateCurrentFeedback({ difficulty: event.target.value })}
                >
                  <option value="">선택</option>
                  <option value="1">1 · 바로 결정함</option>
                  <option value="2">2 · 조금 고민함</option>
                  <option value="3">3 · 보통</option>
                  <option value="4">4 · 꽤 오래 고민함</option>
                  <option value="5">5 · 매우 결정하기 어려움</option>
                </select>
              </label>
            </div>
            <textarea
              value={currentFeedback.comment}
              onChange={(event) => updateCurrentFeedback({ comment: event.target.value })}
              maxLength={FEEDBACK_COMMENT_MAX_LENGTH}
              placeholder="막힌 장면, 이해되지 않은 용어, 다시 보고 싶은 선택지를 짧게 남겨주세요."
              aria-label="플레이테스트 피드백 자유 의견"
              aria-describedby={
                activeFeedbackPrivacySignals.length > 0
                  ? "feedback-input-note feedback-privacy-warning"
                  : "feedback-input-note"
              }
            />
            <p className="input-note" id="feedback-input-note">
              실명, 연락처, 회사명, 실제 사건 관계자 이름은 적지 마세요. {currentFeedback.comment.length}/
              {FEEDBACK_COMMENT_MAX_LENGTH}
            </p>
            {activeFeedbackPrivacySignals.length > 0 && (
              <div className="privacy-warning" id="feedback-privacy-warning" role="alert">
                <strong>피드백에 식별 정보로 보일 수 있는 표현이 있습니다.</strong>
                <p>
                  감지 항목: {activeFeedbackPrivacySignals.map((signal) => signal.label).join(" / ")}.
                  저장하려면 인터뷰 기록과 원격 DB에 남기기 전에 익명 표현으로 바꿔주세요.
                </p>
                <button type="button" onClick={anonymizeFeedbackComment}>
                  피드백 익명화
                </button>
              </div>
            )}
            <div className="feedback-actions">
              <button
                onClick={submitCurrentFeedback}
                disabled={activeFeedbackPrivacySignals.length > 0}
                aria-label={
                  activeFeedbackPrivacySignals.length > 0
                    ? "식별 정보로 보일 수 있는 표현을 익명화해야 피드백을 저장할 수 있습니다."
                    : "피드백 저장"
                }
              >
                피드백 저장
              </button>
              {feedbackStatus && (
                <span role="status" aria-live="polite">
                  {feedbackStatus}
                </span>
              )}
            </div>
          </section>
          <section className="bars-panel">
            <h2>Trigger Map</h2>
            {Object.entries(triggerLabels).map(([key, label]) => (
              <div className="bar-row" key={key}>
                <span>{label}</span>
                <div className="bar-track">
                  <div style={{ width: `${clamp(triggers[key] * 5, 4, 100)}%` }} />
                </div>
                <b>{triggers[key]}</b>
              </div>
            ))}
          </section>
          <section className="history">
            <h2>Decision Log</h2>
            {log.map((entry, index) => (
              <article key={`${entry.nodeId}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <b>{entry.title}</b>
                  <p>{entry.freeText || entry.spokenChoice || entry.choice}</p>
                  {entry.challenge && (
                    <div className="history-challenge">
                      {entry.tactical && (
                        <small className={`challenge-grade grade-${entry.tactical.grade.toLowerCase()}`}>
                          등급 {entry.tactical.grade} · {entry.tactical.gradeText}
                        </small>
                      )}
                      <small className={entry.challenge.matched ? "challenge-success" : "challenge-miss"}>
                        {entry.challenge.matched ? "챌린지 달성" : "챌린지 미달"} · {entry.challenge.title}
                      </small>
                      <small>
                        위험 {entry.challenge.riskDelta > 0 ? "+" : ""}
                        {entry.challenge.riskDelta}
                      </small>
                      {entry.flowSurge && (
                        <small className="surge-success">
                          {entry.flowSurge.label} · {entry.flowSurge.text}
                        </small>
                      )}
                      {entry.suspenseEvent && (
                        <small className="suspense-event-log">
                          {entry.suspenseEvent.label} · {entry.suspenseEvent.text}
                        </small>
                      )}
                    </div>
                  )}
                  {entry.sceneBeat && (
                    <details className="decision-scene">
                      <summary>장면 다시 보기</summary>
                      <div>{renderSceneLines(entry.sceneBeat)}</div>
                    </details>
                  )}
                  <small>{entry.responseTimeSec}s · {entry.echo}</small>
                </div>
              </article>
            ))}
          </section>
          <section className="resource-delta-panel">
            <h2>Resource Change</h2>
            <div className="delta-table">
              {log.map((entry, index) => (
                <article key={`${entry.nodeId}-delta-${index}`}>
                  <b>{String(index + 1).padStart(2, "0")} · {entry.title}</b>
                  <div>
                    {Object.entries(entry.effect ?? {}).map(([key, value]) => (
                      <span key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
                        {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}
                        {value}
                      </span>
                    ))}
                  </div>
                  <p>{explainResourceTradeoff(entry.effect)}</p>
                </article>
              ))}
            </div>
          </section>
          {currentCase === "final" ? (
            <section className="story-reveal ending-reveal">
              <span>SEASON 1 COMPLETE · {endingProfile.tag}</span>
              <h2>{endingProfile.title}</h2>
              <p>
                {endingProfile.text} {finalAftermathEntry ? `마지막 후폭풍에서 "${finalAftermathEntry.choice}"을 선택했습니다.` : ""}
              </p>
              <div className="ending-clue-summary">
                <strong>{clueCount}/6 숨은 단서 발견</strong>
                <span>
                  {clueCount >= 4
                    ? "실험의 바깥쪽까지 도달했습니다. 마지막 기록이 당신의 선택을 기다립니다."
                    : "다른 장면에서 위험한 성공을 만들면 더 많은 기록을 찾을 수 있습니다."}
                </span>
              </div>
            </section>
          ) : (
            <section className="story-reveal">
              <span>NEXT CASE SIGNAL</span>
              <h2>다음 사건은 당신이 가장 강하게 반응한 조건을 중심으로 재구성됩니다.</h2>
              <p>
                트리거랩은 사건 해결 능력만 보지 않습니다. 어떤 압박이 들어왔을 때 당신이
                더 오래 생각하고, 더 쉽게 원칙을 바꾸며, 더 많은 손실을 감수하는지 기록합니다.
              </p>
            </section>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className={`shell game-shell suspense-${suspenseState.tier.toLowerCase()}`}>
      <AdaptiveMusic modeKey={musicModeKey} />
      {renderDecisionReveal()}
      <a className="skip-link" href="#choice-panel">
        선택지로 건너뛰기
      </a>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {screenReaderStatus}
      </p>
      <section className="game-board">
        <section className="mission-strip">
          <div>
            <span>현재 목표</span>
            <strong>{simplifyPlayerText(caseObjectives[currentCase] ?? caseObjectives.case01)}</strong>
          </div>
          <div>
            <span>이번 장면</span>
            <strong>{simplifyPlayerText(node.phase)}</strong>
          </div>
          <div>
            <span>핵심 압박</span>
            <strong>{simplifyPlayerText(node.triggers.map((trigger) => triggerLabels[trigger]).join(" / "))}</strong>
          </div>
        </section>
        {openingLegacy && (
          <section className="legacy-panel">
            <div>
              <span>{simplifyPlayerText(openingLegacy.label)}</span>
              <strong>{simplifyPlayerText(openingLegacy.title)}</strong>
            </div>
            <p>{simplifyPlayerText(openingLegacy.text)}</p>
            {openingLegacy.continuity && (
              <div className="continuity-bridge">
                <span>직전 사건의 결과</span>
                <strong>{simplifyPlayerText(openingLegacy.continuity.title)}</strong>
                <p>{simplifyPlayerText(openingLegacy.continuity.text)}</p>
              </div>
            )}
            <div className="legacy-effect">
              {Object.entries(openingLegacy.effect).map(([key, value]) => (
                <small key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
                  {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}{value}
                </small>
              ))}
            </div>
          </section>
        )}
        <section className={`pressure-cascade ${pressureCascade.tone}`}>
          <div className="pressure-cascade-mark">
            <span>{simplifyPlayerText(pressureCascade.label)}</span>
            <strong>{riskPressure}</strong>
          </div>
          <div>
            <h2>{simplifyPlayerText(pressureCascade.title)}</h2>
            <p>{simplifyPlayerText(pressureCascade.text)}</p>
          </div>
          <small>{simplifyPlayerText(pressureCascade.cue)}</small>
        </section>
        <section className={`suspense-console ${suspenseState.tier.toLowerCase()}`} aria-label="서스펜스 신호">
          <div className="suspense-console-mark">
            <span>{simplifyPlayerText(suspenseState.label)}</span>
            <strong>{String(suspenseState.score).padStart(2, "0")}</strong>
          </div>
          <div className="suspense-console-copy">
            <h2>{simplifyPlayerText(suspenseState.title)}</h2>
            <p>{simplifyPlayerText(suspenseState.text)}</p>
          </div>
          <div className="suspense-meter" aria-label={`서스펜스 ${suspenseState.score}퍼센트`}>
            <div style={{ width: `${suspenseState.score}%` }} />
            <small>{simplifyPlayerText(suspenseState.cue)} · 사건 {suspenseState.caseCode}</small>
          </div>
        </section>
        <details className="play-help">
          <summary>
            <span>
              <Info size={16} />
              플레이 규칙
            </span>
            <b>에코, 구조 재설계, 자원 변화를 다시 확인합니다.</b>
          </summary>
          <div className="guide-grid compact-guide">
            {playGuideItems.map((item) => (
              <article key={item.title}>
                <b>{item.title}</b>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </details>
        <header className="game-header">
          <div>
            <span className="case-chip">{simplifyPlayerText(node.phase)}</span>
            <h1 ref={sceneTitleRef} tabIndex={-1}>{simplifyPlayerText(node.title)}</h1>
          </div>
          <div className="top-actions">
            <button className="ghost" onClick={() => saveCurrentGame()}>
              <Save size={16} />
              저장
            </button>
            <button className="ghost" onClick={() => saveCurrentGame({ exit: true })}>
              <FileText size={16} />
              저장 후 나가기
            </button>
            <button className="ghost" onClick={reset}>
              <RefreshCcw size={16} />
              초기화
            </button>
          </div>
        </header>
        {saveStatus && <p className="save-status">{saveStatus}</p>}
        <div
          className="progress-wrap"
          role="progressbar"
          aria-label="현재 케이스 진행률"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <div style={{ width: `${progress}%` }} />
        </div>

        <section className="game-hud">
          <article className={`risk-card ${riskTier.toLowerCase()}`}>
            <span>위험</span>
            <strong>{easyRiskLabels[riskTier] ?? riskTier}</strong>
            <p>{riskPressure} 압박</p>
          </article>
          <article>
            <span>지금 받는 보너스</span>
            <strong>{simplifyPlayerText(activeBonus)}</strong>
            <p>자유입력 {freeTextCombo}회 · 평균 {currentAverageResponseTime}s</p>
          </article>
          <article>
            <span>진행 목표</span>
            <strong>{progress}%</strong>
            <p>{log.length}개 판단 기록</p>
          </article>
          <article className={clueCount > 0 ? "clue-hud discovered" : "clue-hud"}>
            <span>숨은 단서</span>
            <strong>{clueCount}/6</strong>
            <p>{clueCount > 0 ? "다음 비밀이 열림" : "장면 목표를 노려보세요"}</p>
          </article>
          <article>
            <span>플레이 흐름</span>
            <strong>{simplifyPlayerText(momentumTier)}</strong>
            <p>{momentumScore}점 · 장면 목표 {currentChallengeStreak}연속</p>
          </article>
          <article className={decisionSeconds <= 10 ? "timer-card urgent" : "timer-card"}>
            <span>남은 결정 시간</span>
            <strong>{decisionSeconds}s</strong>
            <p>
              {decisionSeconds === 0
                ? "시간·피로 비용 적용됨"
                : decisionSeconds <= 10
                  ? "다음 판단이 닫히기 전"
                  : "빠른 챌린지 적중 보너스 가능"}
            </p>
          </article>
        </section>

        <section className="live-ledger" aria-label="누적 판단 원장">
          <div>
            <span>선택 기록</span>
            <strong>{simplifyPlayerText(decisionFingerprint.modeTitle)}</strong>
          </div>
          <div className="live-ledger-stats">
            <span>압박 변화 <b>{decisionLedger.netRiskDelta > 0 ? "+" : ""}{decisionLedger.netRiskDelta}</b></span>
            <span>회복 선택 <b>{decisionLedger.riskDrops}</b></span>
            <span>누적 비용 <b>{decisionLedger.strongestCost ? `${resourceMeta[decisionLedger.strongestCost[0]]?.label ?? decisionLedger.strongestCost[0]} ${decisionLedger.strongestCost[1]}` : "없음"}</b></span>
          </div>
        </section>

        <section className="scene-challenge">
          <div>
            <span>이번 장면 목표</span>
            <strong>{simplifyPlayerText(sceneChallenge.title)}</strong>
          </div>
          <p>{simplifyPlayerText(sceneChallenge.text)}</p>
        </section>

        {riskPressure >= 60 && (
          <section className={protocolUsed ? "protocol-panel used" : "protocol-panel"}>
            <div>
              <span>EMERGENCY OPTION</span>
              <strong>{protocolUsed ? "위기 프로토콜 사용 완료" : "위기 프로토콜"}</strong>
              <p>
                {protocolUsed
                  ? "이번 케이스에서는 더 이상 구조 개입을 요청할 수 없습니다. 이제 남은 비용을 감당해야 합니다."
                  : "시간과 현금을 더 내어놓고 판단 기준을 공개 절차로 묶습니다. 케이스당 한 번만 사용할 수 있습니다."}
              </p>
            </div>
            {!protocolUsed && (
              <button type="button" onClick={activateCrisisProtocol} disabled={isAdvancing}>
                <Shield size={16} />
                프로토콜 발동
              </button>
            )}
          </section>
        )}

        <details className="insight-drawer quest-drawer">
          <summary>
            <span>QUESTS</span>
            <b>{questSteps.filter((quest) => quest.complete).length}/{questSteps.length} 완료</b>
          </summary>
          <div className="quest-panel" aria-label="현재 플레이 퀘스트">
            {questSteps.map((quest) => (
              <article className={quest.complete ? "quest-step complete" : "quest-step"} key={quest.title}>
                <span>
                  <Check size={15} />
                  {quest.title}
                </span>
                <strong>{quest.value}</strong>
                <p>{quest.text}</p>
              </article>
            ))}
          </div>
        </details>

        <details className="insight-drawer trace-drawer">
          <summary>
            <span>트리거랩 관찰 기록</span>
            <b>관찰 항목 보기</b>
          </summary>
          <div className="lab-trace">
            <div>
              <span>현재 관찰 중</span>
              <strong>{simplifyPlayerText(triggerLabSignals[currentCase] ?? triggerLabSignals.case01)}</strong>
            </div>
            <p>
              현재 {log.length}개 선택이 기록됐고, {simplifyPlayerText(node.triggers.map((trigger) => triggerLabels[trigger]).join(" / "))}
              압박이 다음 장면 조정값으로 남습니다.
            </p>
          </div>
        </details>

        <details className="insight-drawer clue-drawer" open={clueCount > 0}>
          <summary>
            <span>숨은 단서 보관함</span>
            <b>{clueCount}/6 발견</b>
          </summary>
          {clueCount > 0 ? (
            <div className="clue-grid">
              {discoveredClues.map((clue) => (
                <article key={clue.id}>
                  <span>FOUND</span>
                  <strong>{clue.title}</strong>
                  <p>{clue.text}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="status-note">위험을 감수하면서도 이번 장면의 목표를 맞히면 숨은 단서가 나타납니다.</p>
          )}
        </details>

        <section className={`narrative-spine ${suspenseState.tier.toLowerCase()}`} aria-label="이야기 흐름">
          <div className="narrative-spine-heading">
            <span>이야기 흐름 / {String(narrativeSpine.turn).padStart(2, "0")}</span>
            <strong>이번 장면을 읽는 순서</strong>
          </div>
          <div className="narrative-spine-grid">
            <article>
              <span>01 · 지금까지</span>
              <p>{simplifyPlayerText(narrativeSpine.previous)}</p>
            </article>
            <article>
              <span>02 · 현재 충돌</span>
              <p>{simplifyPlayerText(narrativeSpine.conflict)}</p>
            </article>
            <article>
              <span>03 · 이번 질문</span>
              <p>{simplifyPlayerText(narrativeSpine.question)}</p>
            </article>
            <article>
              <span>04 · 다음 파장</span>
              <p>{simplifyPlayerText(narrativeSpine.consequence)}</p>
            </article>
          </div>
        </section>

        <div className="scene">
          <div className="scene-visual" aria-hidden="true">
            <img
              src={sceneVisuals[currentCase] ?? "/triggerlab-key-visual.png"}
              alt=""
              width="1792"
              height="1024"
              loading="lazy"
            />
          </div>
          <div className="speaker">
            <div>{node.speaker.slice(0, 1)}</div>
            <span>
              <b>{node.speaker}</b>
              <small>{simplifyPlayerText(speakerProfile.role)} · {simplifyPlayerText(speakerProfile.stance)}</small>
            </span>
          </div>
          <div className="scene-story">
            <p className="scene-narration"><span className="story-label">상황</span>{simplifyPlayerText(speakerProfile.appearance)} {simplifyPlayerText(speakerProfile.gesture)}</p>
            <p className="scene-thought"><span className="story-label">속마음</span>'{simplifyPlayerText(speakerProfile.thought)}'</p>
            <p className="scene-narration scene-direction"><span className="story-label">지금의 압박</span>{simplifyPlayerText(sceneDirection)}</p>
            <p className="scene-body"><span className="story-label">사건 보고</span>{simplifyPlayerText(node.text)}</p>
            <p className="scene-dialogue"><span className="story-label">중요한 말</span>"{simplifyPlayerText(speakerProfile.line)}" <span className="story-voice">({simplifyPlayerText(speakerProfile.voice)})</span></p>
          </div>
        </div>

        {latestBeat && (
          <section className="scene-beat">
            <div className="panel-title-row">
              <h2>
                <MessageSquareText size={17} />
                직전 선택의 여운
              </h2>
              <span>선택이 회의실의 대화와 침묵을 어떻게 바꿨는지 기록합니다.</span>
            </div>
            <div className="scene-beat-preview">
              {renderSceneLines(latestBeat.split("\n").slice(0, 2).join("\n"))}
            </div>
            <details className="scene-beat-more">
              <summary>전체 장면 보기</summary>
              <div>{renderSceneLines(latestBeat)}</div>
            </details>
          </section>
        )}

        <details className="memo-panel">
          <summary>
            <h2>
              <FileText size={17} />
              케이스데스크 자료
            </h2>
            <span>{node.memo.length}개 근거</span>
          </summary>
          <ul>
            {node.memo.map((item) => (
              <li key={item}>{simplifyPlayerText(item)}</li>
            ))}
          </ul>
        </details>

        <details className="echo-panel insight-drawer">
          <summary>
            <span>에코의 검증 질문</span>
            <b>반론 열기</b>
          </summary>
          <p>{simplifyPlayerText(echo)}</p>
          <div className="echo-probe">
            <div>
              <strong>{probeUsed ? "힌트 사용 완료" : "막혔다면 에코에게 한 번 더 묻기"}</strong>
              <span>{probeUsed ? "이번 장면의 방향성 힌트가 대화에 남았습니다." : `${echoProbeCost}을 지불하고 방향성만 확인합니다.`}</span>
            </div>
            <button type="button" onClick={requestEchoProbe} disabled={probeUsed || isAdvancing}>
              {probeUsed ? "확인됨" : "힌트 요청"}
            </button>
          </div>
          <details className="echo-checks">
            <summary>다시 확인할 것</summary>
            <ul>
              {getEchoChecks(node).map((item) => (
                <li key={item}>{simplifyPlayerText(item)}</li>
              ))}
            </ul>
          </details>
        </details>

        <section className="choice-panel" id="choice-panel" tabIndex={-1}>
          <div className="choice-heading">
            <h2>어떻게 말할까</h2>
            <p>
              어떤 선택도 무료가 아닙니다. 지금 고르는 말은 한 자원을 올리는 대신 다른
              부담을 다음 장면으로 넘깁니다.
            </p>
            <div className="turn-tactic">
              <span>이번 턴 공략</span>
              <strong>{simplifyPlayerText(sceneChallenge.title)}</strong>
              <p>
                {showTacticalDetails
                  ? "챌린지 달성 가능성, 위험 압력 변화, 사고 가속 보상을 계산한 전술 정보입니다."
                  : "먼저 장면과 대화만 보고 판단해 보세요. 필요한 경우 전술 정보를 열 수 있습니다."}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="tactical-toggle"
            onClick={() => setShowTacticalDetails((value) => !value)}
            aria-expanded={showTacticalDetails}
          >
            <Info size={15} />
            {showTacticalDetails ? "전술 정보 닫기" : "전술 정보 열기"}
          </button>
          {showTacticalDetails && decisionForecasts.length > 0 && (
            <section className="decision-forecast" aria-label="결정 예보">
              <div className="forecast-header">
                <span>선택 미리보기</span>
                <strong>현재 압박 {riskPressure}</strong>
                <p>
                  {pressureLeader
                    ? `${pressureLeader.label}이 가장 크게 압력을 만들고 있습니다.`
                    : "현재 압박 요인이 낮게 유지되고 있습니다."}
                </p>
              </div>
              <div className="forecast-grid">
                <article>
                  <span>가장 안정적인 말</span>
                    <b>{simplifyPlayerText(safestForecast.choice.label)}</b>
                  <small>
                    위험 {formatRiskDelta(safestForecast.forecast.riskDelta)} · 예상 압력{" "}
                    {safestForecast.forecast.afterRisk}
                  </small>
                </article>
                <article>
                  <span>가장 큰 대가</span>
                    <b>{simplifyPlayerText(costliestForecast.choice.label)}</b>
                  <small>{formatResourceDelta(costliestForecast.forecast.biggestCost)}</small>
                </article>
                <article>
                  <span>압박 원인</span>
                  <b>{riskPressureDrivers.slice(0, 2).map((driver) => driver.label).join(" / ")}</b>
                  <small>
                    {riskPressureDrivers
                      .slice(0, 2)
                      .map((driver) => `${driver.value}`)
                      .join(" · ")}
                  </small>
                </article>
              </div>
              <ol className="forecast-list">
                {decisionForecasts.map(({ choice, forecast, tacticalRead }) => (
                  <li key={choice.id}>
                    <b className={`tactical-grade grade-${tacticalRead.grade.toLowerCase()}`}>
                      {tacticalRead.grade}
                    </b>
                    <span>
                      <strong>{simplifyPlayerText(choice.label)}</strong>
                      <small>
                        위험 {formatRiskDelta(forecast.riskDelta)} · 예상 압력 {forecast.afterRisk} ·{" "}
                        {formatResourceDelta(forecast.biggestGain)} / {formatResourceDelta(forecast.biggestCost)}
                      </small>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {pendingChoice && pendingChoiceRead && pendingChoiceForecast && (
            <section className={`commit-console ${suspenseState.tier.toLowerCase()}`} aria-label="선택 확정 콘솔">
              <div className="commit-console-heading">
                <span>선택 확인</span>
                <strong>이 말을 실제로 남기겠습니까?</strong>
              </div>
              <p className="commit-console-choice">“{simplifyPlayerText(speechifyChoice(pendingChoice))}”</p>
              <div className="commit-console-readout">
                <span>예상 위험 <b>{formatRiskDelta(pendingChoiceForecast.riskDelta)}</b></span>
                <span>압력 <b>{pendingChoiceForecast.afterRisk}</b></span>
                <span>전술 등급 <b>{pendingChoiceRead.tacticalRead.grade}</b></span>
              </div>
              <div className="commit-console-actions">
                <button type="button" className="commit-cancel" onClick={() => setPendingChoice(null)}>
                  다시 고르기
                </button>
                <button type="button" className="commit-confirm" onClick={() => choose(pendingChoice)}>
                  <LockKeyhole size={16} />
                  이 선택을 기록한다
                </button>
              </div>
            </section>
          )}
          <div className="choices">
            {fixedChoices.map((choice) => {
              const choiceRead = getEffectiveChoiceRead(choice, choice.effect, choice.cognition);
              const projectedRisk = getRiskPressure(choiceRead.finalResources);
              const riskDelta = choiceRead.finalRiskDelta;
              const riskClass =
                riskDelta > 0 ? "risk-up" : riskDelta < 0 ? "risk-down" : "risk-flat";
              const riskLabel =
                riskDelta > 0
                  ? `위험 +${riskDelta}`
                  : riskDelta < 0
                    ? `위험 ${riskDelta}`
                    : "위험 유지";
              const challengeMatch = getChallengeMatch(choice, choiceRead.baseRiskDelta);
              const tacticalRead = choiceRead.tacticalRead;
              return (
                <button
                  key={choice.id}
                  className={pendingChoice?.id === choice.id ? "choice selected" : "choice"}
                  onClick={() => previewChoice(choice)}
                  disabled={isAdvancing}
                  aria-pressed={pendingChoice?.id === choice.id}
                  aria-label={`${simplifyPlayerText(speechifyChoice(choice))} ${riskLabel}. ${simplifyPlayerText(getChoiceSubtext(choice))}`}
                >
                  <span className="choice-main">
                    <Check size={16} />
                    <small>{pendingChoice?.id === choice.id ? "검토 중" : "선택"}</small>
                  </span>
                  <span className="choice-speech">"{simplifyPlayerText(speechifyChoice(choice))}"</span>
                  <span className="choice-action">{simplifyPlayerText(getDramaticChoiceLabel(choice))}</span>
                  {showTacticalDetails && (
                    <>
                      <span className="choice-tactical">
                        <b className={`tactical-grade grade-${tacticalRead.grade.toLowerCase()}`}>
                          {tacticalRead.grade}
                        </b>
                        <span>
                          <strong>{simplifyPlayerText(tacticalRead.gradeText)}</strong>
                          <small>{simplifyPlayerText(tacticalRead.reward)} · 얻는 것 {simplifyPlayerText(tacticalRead.gain)} · 드는 것 {simplifyPlayerText(tacticalRead.cost)}</small>
                        </span>
                      </span>
                      {challengeMatch && <span className="challenge-match">{simplifyPlayerText(challengeMatch)}</span>}
                      {choiceRead.flowSurge && (
                        <span className="choice-surge">
                          {simplifyPlayerText(choiceRead.flowSurge.label)} · {simplifyPlayerText(explainResourceTradeoff(choiceRead.flowSurge.effect))}
                        </span>
                      )}
                      <span className="choice-subtext">{simplifyPlayerText(getChoiceSubtext(choice))}</span>
                      {choice.effect && (
                        <span className="choice-tradeoff">
                          {simplifyPlayerText(explainResourceTradeoff(choice.effect))}
                        </span>
                      )}
                      {choice.effect && (
                        <span className={`choice-risk ${riskClass}`}>
                          {riskLabel} · 예상 압력 {projectedRisk}
                        </span>
                      )}
                      {choice.effect && (
                        <span className="choice-effect">
                          {Object.entries(choiceRead.finalEffect)
                            .map(([key, value]) => `${resourceMeta[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`)
                            .join(" · ")}
                        </span>
                      )}
                      {choice.cognition && (
                        <span className="choice-cognition">
                          {Object.entries(choice.cognition)
                            .map(([key, value]) => `${easyCognitionLabels[key] ?? cognitionLabels[key] ?? key} +${value}`)
                            .join(" · ")}
                        </span>
                      )}
                    </>
                  )}
                  {!showTacticalDetails && (
                    <span className="choice-intuition-hint">
                      바로 선택 · 장면 목표를 맞히면 직감 보너스
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {freeChoice && (
            <div className="reframe-box">
              <div className="panel-title-row">
                <h2>
                  <Sparkles size={17} />
                  구조 재설계
                </h2>
                <span>기존 선택지 대신 이해관계자, 조건, 순서를 새로 짠다</span>
              </div>
              <div className="prompt-chips">
                {boardChangePrompts.map((prompt) => (
                  <button key={prompt} onClick={() => setFreeText(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
              <textarea
                value={freeText}
                onChange={(event) => setFreeText(event.target.value)}
                maxLength={FREE_TEXT_MAX_LENGTH}
                placeholder="예: 누구를 새로 협상장에 부를지, 어떤 조건을 교환할지, 어떤 정보를 먼저 확인할지 적는다."
                aria-label="구조 재설계 자유입력"
                aria-describedby={
                  freeTextBlockedByPrivacy
                    ? "reframe-input-note reframe-privacy-warning"
                    : "reframe-input-note"
                }
              />
              <p className="input-note" id="reframe-input-note">
                자유입력은 로그에 남을 수 있습니다. 실제 개인정보나 식별 가능한 회사명은 쓰지 마세요.{" "}
                {freeText.length}/{FREE_TEXT_MAX_LENGTH}
              </p>
              {activePrivacySignals.length > 0 && (
                <div className="privacy-warning" id="reframe-privacy-warning" role="alert">
                  <strong>식별 정보로 보일 수 있는 표현이 있습니다.</strong>
                  <p>
                    감지 항목: {activePrivacySignals.map((signal) => signal.label).join(" / ")}.
                    제출하려면 실제 이름, 연락처, 회사명을 가상의 역할명이나 익명 표현으로 바꿔주세요.
                  </p>
                  <button type="button" onClick={anonymizeFreeText}>
                    감지 표현 익명화
                  </button>
                </div>
              )}
              {freeText.trim() && (
                <div className="reframe-speech">
                  <span>발화 예고</span>
                  <p>"{freeText.trim()}"</p>
                  <small>
                    준비된 선택지 밖으로 나가면, 이 문장이 그대로 장면 로그와 에코의 반론에 남습니다.
                  </small>
                </div>
              )}
              <div className="reframe-signals">
                <div>
                  <span>반영 기준</span>
                  <b>{activeFreeTextSignalCount}/4</b>
                </div>
                {sceneChallenge.id === "use-reframe" && activeFreeTextSignalCount >= 2 && (
                  <strong className="reframe-challenge-hit">챌린지 달성 가능</strong>
                )}
                <ul>
                  {freeTextSignals.map((signal) => (
                    <li className={signal.active ? "active" : ""} key={signal.id}>
                      <Check size={14} />
                      <span>
                        <b>{signal.label}</b>
                        <small>{signal.hint}</small>
                      </span>
                    </li>
                  ))}
                </ul>
                <p>
                  두 개 이상 채워지면 선택지 밖의 제안이 단순 의견이 아니라 판을 바꾸는
                  계획으로 기록됩니다.
                </p>
              </div>
              {freeTextPreview && (
                <div className="reframe-preview">
                  <span>예상 반영</span>
                  <p>{explainResourceTradeoff(freeTextPreview.effect)}</p>
                  {(() => {
                    const projectedRisk = getRiskPressure(applyEffect(resources, freeTextPreview.effect));
                    const riskDelta = projectedRisk - riskPressure;
                    const riskClass =
                      riskDelta > 0 ? "risk-up" : riskDelta < 0 ? "risk-down" : "risk-flat";
                    const riskLabel =
                      riskDelta > 0
                        ? `위험 +${riskDelta}`
                        : riskDelta < 0
                          ? `위험 ${riskDelta}`
                          : "위험 유지";
                    return (
                      <div>
                        <small className={`preview-risk ${riskClass}`}>
                          {riskLabel} · 예상 압력 {projectedRisk}
                        </small>
                      </div>
                    );
                  })()}
                  <div>
                    {Object.entries(freeTextPreview.effect).map(([key, value]) => (
                      <small key={key} className={value >= 0 ? "delta-up" : "delta-down"}>
                        {resourceMeta[key]?.label ?? key} {value > 0 ? "+" : ""}
                        {value}
                      </small>
                    ))}
                  </div>
                  <div>
                    {Object.entries(freeTextPreview.cognition)
                      .filter(([, value]) => value > 0)
                      .map(([key, value]) => (
                        <small key={key} className="cognition-preview">
                          {easyCognitionLabels[key] ?? cognitionLabels[key] ?? key} +{value}
                        </small>
                      ))}
                  </div>
                </div>
              )}
              <button
                className="choice free-choice submit-reframe"
                onClick={() => choose(freeChoice)}
                disabled={!freeText.trim() || freeTextBlockedByPrivacy || isAdvancing}
                aria-label={
                  freeTextBlockedByPrivacy
                    ? "식별 정보로 보일 수 있는 표현을 익명화해야 구조 재설계를 제출할 수 있습니다."
                    : freeText.trim()
                      ? `구조 재설계 제출. ${freeText.trim()}`
                      : "구조 재설계 내용을 입력해야 제출할 수 있습니다."
                }
              >
                <span className="choice-main">
                  <Send size={16} />
                  {freeChoice.label}
                </span>
              </button>
            </div>
          )}
        </section>
      </section>

      <aside className="status-board">
        <div className="analyst-card">
          <span>분석관</span>
          <strong>{playerName}</strong>
          <small>{activePlayStyle.label} · {activePlayStyle.title}</small>
        </div>
        <section className="turn-brief">
          <h2>이번 턴 브리프</h2>
          <div>
            {turnBriefItems.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <b>{item.value}</b>
              </article>
            ))}
          </div>
          <p>{sceneChallenge.text}</p>
        </section>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>상황판</span>
            <b>자원 상세 보기</b>
          </summary>
          <div className="resource-list">
            {Object.entries(resourceMeta).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <div className="resource" key={key}>
                  <div>
                    <Icon size={16} />
                    <span>{meta.label}</span>
                  </div>
                  <b>
                    {resources[key]}
                    {meta.suffix}
                  </b>
                </div>
              );
            })}
          </div>
        </details>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>발언자</span>
            <b>맥락 보기</b>
          </summary>
          <div className="speaker-card">
            <strong>{node.speaker}</strong>
            <span>{speakerProfile.role}</span>
            <p>{speakerProfile.stance}</p>
          </div>
        </details>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>현재 트리거</span>
            <b>{node.triggers.length}개 활성</b>
          </summary>
          <div className="trigger-tags">
            {node.triggers.map((trigger) => (
              <span key={trigger}>{triggerLabels[trigger]}</span>
            ))}
          </div>
        </details>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>진행률</span>
            <b>{progress}%</b>
          </summary>
          <div className="mini-progress">
            <div style={{ width: `${progress}%` }} />
          </div>
          <p className="status-note">{progress}% · {log.length}개 선택 기록됨</p>
        </details>
        <details className="insight-drawer status-drawer">
          <summary>
            <span>시즌 아크</span>
            <b>사건 배경</b>
          </summary>
          <p className="status-note">
            {activeCaseMeta?.label}은 {activeCaseMeta?.summary}
          </p>
          <p className="status-note">
            완료 {completedCases.length}개 케이스와 현재 로그 {log.length}개가 다음 사건의 압박
            조건으로 누적됩니다.
          </p>
        </details>
      </aside>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

