import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
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
  Copy,
  RefreshCcw,
  Send,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import "./styles.css";
import {
  FEEDBACK_COMMENT_MAX_LENGTH,
  FREE_TEXT_MAX_LENGTH,
  SAVE_SCHEMA_VERSION,
  STORAGE_KEY,
} from "./appConfig.js";
import {
  boardChangePrompts,
  caseObjectives,
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
  createCaseSummary,
  detectPrivacySignals,
  explainResourceTradeoff,
  getChoiceSubtext,
  getDramaticChoiceLabel,
  getEcho,
  getFreeTextSignals,
  getGameplayStats,
  getRiskPressure,
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
  telemetryEnabled,
} from "./telemetry.js";

const resourceMeta = {
  time: { label: "TIME", suffix: "h", icon: Clock3 },
  capital: { label: "CAPITAL", suffix: "", icon: BriefcaseBusiness },
  trust: { label: "TRUST", suffix: "", icon: Users },
  legitimacy: { label: "LEGITIMACY", suffix: "", icon: Shield },
  humanCost: { label: "HUMAN COST", suffix: "", icon: AlertTriangle },
  fatigue: { label: "FATIGUE", suffix: "", icon: BarChart3 },
};

const GAME_TITLE = "임계점";
const GAME_SUBTITLE = "판단이 깊어지는 순간";
const GAME_LABEL = "CRITICAL POINT";

const nextCaseSignals = {
  case01: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case02",
    title: "CASE 02 - FALSE SIGNAL",
    button: "CASE 02 시작",
    premise:
      "동료가 내부 정보 유출자로 지목됩니다. 증거는 명확하지만, 사람의 맥락은 다른 이야기를 합니다.",
    hook:
      "트리거랩은 방금 당신이 손실을 누구에게 먼저 배분했는지 기록했습니다. 다음 사건에서는 그 기준이 사람을 믿을지, 기록을 믿을지의 압박으로 바뀝니다.",
  },
  case02: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case03",
    title: "CASE 03 - RED TEAM",
    button: "CASE 03 시작",
    premise:
      "오진우와 같은 자료를 받고 동시에 해결안을 냅니다. 이번에는 경쟁심이 판단을 빠르게 만드는지, 얕게 만드는지 확인합니다.",
    hook:
      "당신이 증거와 신뢰 사이에서 망설인 시간은 다음 테스트의 난이도가 됩니다. 오진우는 그 망설임을 점수판으로 바꿔 보여줄 것입니다.",
  },
  case03: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case04",
    title: "CASE 04 - THE PRICE",
    button: "CASE 04 시작",
    premise:
      "작은 규칙 위반이 수천 명을 살릴 수 있습니다. 이번에는 좋은 결과가 절차 훼손을 어디까지 정당화하는지 묻습니다.",
    hook:
      "경쟁 압박 속에서 당신이 줄인 검증과 남긴 근거가 분리됩니다. 다음 사건은 좋은 결과를 얻기 위해 어느 선까지 넘을 수 있는지 묻습니다.",
  },
  case04: {
    eyebrow: "NEXT CASE UNLOCKED",
    caseId: "case05",
    title: "CASE 05 - NO ONE TO BLAME",
    button: "CASE 05 시작",
    premise:
      "명백한 악인은 없습니다. 모두가 합리적으로 움직였지만 시스템은 가장 조용한 사람들을 밀어냈습니다.",
    hook:
      "명분 있는 예외를 허용한 기록은 사라지지 않습니다. 다음 사건에서는 누구도 규칙을 어기지 않았는데도 피해가 생깁니다.",
  },
  case05: {
    eyebrow: "FINAL CASE UNLOCKED",
    caseId: "final",
    title: "FINAL - TRIGGER LAB",
    button: "FINAL 시작",
    premise:
      "모든 사건의 로그가 하나의 폴더로 연결됩니다. 이제 트리거랩이 당신의 사고 조건을 어떻게 사용했는지 마주합니다.",
    hook:
      "악인이 없는 실패까지 통과한 뒤, 남는 것은 사건이 아니라 당신의 반응 패턴입니다. 마지막 폴더에는 그 패턴이 사건 설계에 쓰인 흔적이 있습니다.",
  },
};

const playGuideItems = [
  {
    title: "에코",
    text: "정답을 알려주는 조언자가 아니라, 방금 선택의 약한 근거를 되묻는 반론자입니다.",
  },
  {
    title: "구조 재설계",
    text: "주어진 대응안이 답처럼 보이지 않을 때 이해관계자, 조건, 순서를 직접 다시 짜는 선택입니다.",
  },
  {
    title: "자원 변화",
    text: "좋고 나쁜 점수가 아니라 선택의 비용입니다. 시간이 줄면 빠르게 해결한 만큼 검증 여지가 줄어듭니다.",
  },
  {
    title: "트리거",
    text: "플레이어가 오래 멈추거나 원칙을 바꾸는 압박 조건입니다. 결과와 다음 사건의 연결 단서가 됩니다.",
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

function App() {
  const saved = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }, []);
  const sessionId = useMemo(() => getSessionId(), []);
  const sessionCode = useMemo(() => getSessionCode(sessionId), [sessionId]);

  const [playerName, setPlayerName] = useState(saved?.playerName ?? "");
  const [dataConsent, setDataConsent] = useState(saved?.dataConsent ?? false);
  const [started, setStarted] = useState(saved?.started ?? false);
  const [currentCase, setCurrentCase] = useState(saved?.currentCase ?? "case01");
  const [completedCases, setCompletedCases] = useState(saved?.completedCases ?? []);
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
  const [telemetryStatus, setTelemetryStatus] = useState({
    tone: telemetryEnabled ? "ready" : "local",
    text: telemetryEnabled
      ? "DB 연결 준비됨. 데이터 제공 동의 시 케이스 완료 로그가 저장됩니다."
      : "DB 미연결. 이 플레이는 브라우저와 JSON 로그로만 저장됩니다.",
  });

  const fallbackCaseId = seasonCasesBase.some((caseItem) => caseItem.id === currentCase)
    ? currentCase
    : "case01";
  const activeNodeOrder = nodeOrders[fallbackCaseId] ?? nodeOrders.case01;
  const fallbackNodeId = activeNodeOrder[0] ?? "start";
  const resolvedNodeId = nodes[nodeId] ? nodeId : fallbackNodeId;
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
  const primarySceneTrigger = node?.triggers?.[0] ?? "responsibility";
  const primarySceneTriggerLabel = triggerLabels[primarySceneTrigger] ?? "책임";
  const sceneDirection =
    riskTier === "CRITICAL"
      ? `${primarySceneTriggerLabel} 압박이 회의실의 말끝을 짧게 자른다. 누구도 먼저 편한 결론을 꺼내지 못한다.`
      : riskTier === "UNSTABLE"
        ? `${primarySceneTriggerLabel} 압박이 테이블 위에 얇게 깔린다. 대답은 가능하지만, 아직 비용의 이름이 다 불리지 않았다.`
        : `${primarySceneTriggerLabel} 압박은 낮게 유지된다. 그래서 지금은 결론보다 전제를 바꾸기 좋은 순간이다.`;
  const gameplayStats = getGameplayStats(log, riskPressure);
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
    freeTextCombo >= 2
      ? "판 바꾸기 보너스"
      : currentChallengeStreak >= 2
        ? "연속 챌린지 보너스"
      : currentAverageResponseTime >= 20
        ? "숙고 보너스"
        : log.length >= 3
          ? "연속 판단 보너스"
          : "보너스 대기";
  const sceneChallenge =
    riskPressure >= 35
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
            };
  function getChallengeMatch(choice, riskDelta) {
    if (sceneChallenge.id === "lower-risk" && riskDelta < 0) return "챌린지 후보";
    if (sceneChallenge.id === "avoid-risk" && riskDelta <= 0) return "챌린지 후보";
    if (sceneChallenge.id === "find-cost" && Object.values(choice.effect ?? {}).some((value) => value < 0)) {
      return "비용 확인됨";
    }
    return "";
  }
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
    });
  }, [started, currentCase, nodeId, isResult]);

  function persist(nextState) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        saveSchemaVersion: SAVE_SCHEMA_VERSION,
        playerName,
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
        ...nextState,
      }),
    );
  }

  function startGame() {
    const name = playerName.trim() || "분석관";
    setPlayerName(name);
    setStarted(true);
    setCurrentCase("case01");
    setNodeId("start");
    setNodeEnteredAt(Date.now());
    persist({
      playerName: name,
      dataConsent,
      started: true,
      currentCase: "case01",
      nodeId: "start",
      nodeEnteredAt: Date.now(),
    });
  }

  function startCase(caseId) {
    const startNode =
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
    setStarted(true);
    setCurrentCase(caseId);
    setNodeId(startNode);
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setEcho(introEcho);
    setFreeText("");
    setNodeEnteredAt(Date.now());
    persist({
      started: true,
      currentCase: caseId,
      nodeId: startNode,
      resources: initialResources,
      log: [],
      triggers: makeEmptyScores(triggerLabels),
      cognition: makeEmptyScores(cognitionLabels),
      echo: introEcho,
      nodeEnteredAt: Date.now(),
    });
  }

  function anonymizeFreeText() {
    setFreeText(limitText(anonymizeSensitiveText(freeText), FREE_TEXT_MAX_LENGTH));
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
    };
  }

  function choose(choice) {
    if (isAdvancing) return;
    setIsAdvancing(true);
    const responseTimeSec = Math.max(1, Math.round((Date.now() - nodeEnteredAt) / 1000));
    const free = choice.type === "free";
    const freeResult = free ? scoreFreeText(freeText) : null;
    const effect = free ? freeResult.effect : choice.effect;
    const cognitiveEffect = free ? freeResult.cognition : choice.cognition;
    const nextResources = applyEffect(resources, effect);
    const challengeRiskDelta = getRiskPressure(nextResources) - riskPressure;
    const challengeMatch = free
      ? sceneChallenge.id === "use-reframe" && getFreeTextSignals(freeText).filter((signal) => signal.active).length >= 2
      : Boolean(getChallengeMatch(choice, challengeRiskDelta));
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
      title: node.title,
      choice: choice.label,
      spokenChoice: getDramaticChoiceLabel(choice),
      freeText: free ? freeText.trim() : "",
      effect,
      triggers: node.triggers,
      echo: getEcho(choice.id, free ? freeText : ""),
      sceneBeat: buildSceneBeat(node, choice, free ? freeText : "", effect),
      challenge: {
        title: sceneChallenge.title,
        matched: challengeMatch,
        riskDelta: challengeRiskDelta,
      },
      note: freeResult?.note ?? "",
      responseTimeSec,
      resourcesBefore: resources,
      resourcesAfter: nextResources,
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
      ? buildCaseSummary(nextTriggers, nextCognition, nextLog)
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
        setTelemetryStatus({
          tone: "pending",
          text: "케이스 로그를 원격 DB에 저장하는 중입니다.",
        });
        saveCaseTelemetry({
          session_id: sessionId,
          session_code: sessionCode,
          player_name: null,
          case_id: currentCase,
          case_title: activeCaseMeta?.title ?? currentCase,
          completed_at: new Date().toISOString(),
          summary: caseSummary,
          resources: nextResources,
          triggers: nextTriggers,
          cognition: nextCognition,
          decision_log: nextLog,
          feedback: playtestFeedback[currentCase] ?? null,
        })
          .then(() => {
            setTelemetryStatus({
              tone: "success",
              text: "케이스 로그가 원격 DB에 저장됐습니다.",
            });
          })
          .catch((error) => {
            console.warn(error);
            setTelemetryStatus({
              tone: "error",
              text: "원격 저장에 실패했습니다. JSON 로그 내보내기를 백업으로 사용하세요.",
            });
          });
      }
    }

    setResources(nextResources);
    setTriggers(nextTriggers);
    setCognition(nextCognition);
    setLog(nextLog);
    setEcho(nextEcho);
    setFreeText("");
    setNodeId(nextNode);
    setCompletedCases(nextCompletedCases);
    setCaseResults(nextCaseResults);
    setNodeEnteredAt(Date.now());
    persist({
      resources: nextResources,
      triggers: nextTriggers,
      cognition: nextCognition,
      log: nextLog,
      echo: nextEcho,
      nodeId: nextNode,
      completedCases: nextCompletedCases,
      caseResults: nextCaseResults,
      nodeEnteredAt: Date.now(),
    });
  }

  function reset() {
    localStorage.removeItem("trigger-prototype");
    localStorage.removeItem(STORAGE_KEY);
    setPlayerName("");
    setDataConsent(false);
    setStarted(false);
    setCurrentCase("case01");
    setCompletedCases([]);
    setCaseResults({});
    setPlaytestFeedback({});
    setNodeId("start");
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setEcho("얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.");
    setFreeText("");
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
    persist({ started: false });
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
      completedCases,
      caseResults,
      playtestFeedback,
      resources,
      triggers,
      cognition,
      summary: result,
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
      },
      log,
      telemetryEnabled,
      dataConsent,
      sessionId,
      sessionCode,
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
    try {
      await navigator.clipboard.writeText(sessionCode);
      setCopyStatus("복사됨");
    } catch {
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
      setFeedbackStatus("로컬에 저장했습니다. DB 연결 또는 동의가 없으면 원격 저장은 건너뜁니다.");
      return;
    }

    try {
      await saveFeedbackTelemetry({
        session_id: sessionId,
        session_code: sessionCode,
        case_id: currentCase,
        case_title: activeCaseMeta?.title ?? currentCase,
        submitted_at: savedAt,
        clarity_score: Number(feedback.clarity) || null,
        difficulty_score: Number(feedback.difficulty) || null,
        comment: feedback.comment.trim() || null,
      });
      setFeedbackStatus("피드백을 저장했습니다.");
    } catch (error) {
      console.warn(error);
      setFeedbackStatus("로컬에는 저장했습니다. 원격 저장은 실패했습니다.");
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
  const nextCaseSignal = nextCaseSignals[currentCase];
  const resultBridge =
    result.longestDecision
      ? `${triggerLabels[result.primary[0]]} 압박이 가장 오래 남았고, "${result.longestDecision.title}"에서 판단 시간이 길어졌습니다.`
      : `${triggerLabels[result.primary[0]]} 압박이 다음 사건의 시작 조건으로 기록됩니다.`;
  const resultRank = gameplayRank;
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

  function getCaseStatusText(status) {
    if (status === "PLAYING") return "진행 중";
    if (status === "OPEN") return "시작 가능";
    if (status === "COMPLETE") return "완료됨";
    return "이전 케이스 필요";
  }

  if (!started) {
    return (
      <main className="shell intro-shell">
        <section className="intro">
          <div className="brand-row">
            <span className="brand-mark">{GAME_TITLE}</span>
            <span className="case-chip">{GAME_LABEL} / {activeCaseMeta?.title ?? GAME_TITLE}</span>
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
          <div className="start-panel">
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
                  <h2>{caseItem.title}</h2>
                  <b>{caseItem.trigger}</b>
                  <p>{caseItem.summary}</p>
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
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {screenReaderStatus}
        </p>
        <section className="result-page">
          <div className="topbar">
            <span className="brand-mark">{GAME_TITLE}</span>
            <div className="top-actions">
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
          <section className="session-panel">
            <div>
              <span>PLAYTEST SESSION</span>
              <strong>{sessionCode}</strong>
              <p>테스터 인터뷰, JSON 로그, Supabase row를 맞출 때 쓰는 짧은 세션 코드입니다.</p>
              <small className={`remote-status ${telemetryStatus.tone}`}>
                {telemetryStatus.text}
              </small>
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
              <strong>{cognitionLabels[result.thinking[0]]}</strong>
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
                      <small className={entry.challenge.matched ? "challenge-success" : "challenge-miss"}>
                        {entry.challenge.matched ? "챌린지 달성" : "챌린지 미달"} · {entry.challenge.title}
                      </small>
                      <small>
                        위험 {entry.challenge.riskDelta > 0 ? "+" : ""}
                        {entry.challenge.riskDelta}
                      </small>
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
              <span>SEASON 1 COMPLETE</span>
              <h2>나는 이런 조건에서 생각을 멈추지 않는다.</h2>
              <p>
                이 결과는 능력 평가가 아닙니다. 당신을 더 깊이 생각하게 만든 조건의
                기록입니다. 이제 남은 질문은 그 조건을 숨길지, 고칠지, 사용할지입니다.
              </p>
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
    <main className="shell game-shell">
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
            <strong>{caseObjectives[currentCase] ?? caseObjectives.case01}</strong>
          </div>
          <div>
            <span>이번 장면</span>
            <strong>{node.phase}</strong>
          </div>
          <div>
            <span>핵심 압박</span>
            <strong>{node.triggers.map((trigger) => triggerLabels[trigger]).join(" / ")}</strong>
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
            <span className="case-chip">{node.phase}</span>
            <h1 ref={sceneTitleRef} tabIndex={-1}>{node.title}</h1>
          </div>
          <button className="ghost" onClick={reset}>
            <RefreshCcw size={16} />
            초기화
          </button>
        </header>
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
            <span>RISK</span>
            <strong>{riskTier}</strong>
            <p>{riskPressure} 압력</p>
          </article>
          <article>
            <span>ACTIVE BONUS</span>
            <strong>{activeBonus}</strong>
            <p>자유입력 {freeTextCombo}회 · 평균 {currentAverageResponseTime}s</p>
          </article>
          <article>
            <span>OBJECTIVE</span>
            <strong>{progress}%</strong>
            <p>{log.length}개 판단 기록</p>
          </article>
          <article>
            <span>MOMENTUM</span>
            <strong>{momentumTier}</strong>
            <p>{momentumScore}점 · 챌린지 {currentChallengeStreak}연속</p>
          </article>
        </section>

        <section className="scene-challenge">
          <div>
            <span>SCENE CHALLENGE</span>
            <strong>{sceneChallenge.title}</strong>
          </div>
          <p>{sceneChallenge.text}</p>
        </section>

        <section className="quest-panel" aria-label="현재 플레이 퀘스트">
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
        </section>

        <section className="lab-trace">
          <div>
            <span>TRIGGERLAB TRACE</span>
            <strong>{triggerLabSignals[currentCase] ?? triggerLabSignals.case01}</strong>
          </div>
          <p>
            현재 {log.length}개 선택이 기록됐고, {node.triggers.map((trigger) => triggerLabels[trigger]).join(" / ")}
            압박이 다음 장면 조정값으로 남습니다.
          </p>
        </section>

        <div className="scene">
          <div className="scene-visual" aria-hidden="true">
            <picture>
              <source srcSet="/triggerlab-key-visual.webp" type="image/webp" />
              <img src="/triggerlab-key-visual.png" alt="" width="1792" height="1024" loading="lazy" />
            </picture>
          </div>
          <div className="speaker">
            <div>{node.speaker.slice(0, 1)}</div>
            <span>
              <b>{node.speaker}</b>
              <small>{speakerProfile.role} · {speakerProfile.stance}</small>
            </span>
          </div>
          <div className="speaker-context">
            <span>{speakerProfile.appearance}</span>
            <b>{speakerProfile.job}</b>
          </div>
          <aside className="character-cutin">
            <div>
              <span>CHARACTER CUT-IN</span>
              <strong>{speakerProfile.line}</strong>
            </div>
            <p className="scene-direction">{sceneDirection}</p>
            <dl>
              <div>
                <dt>생각</dt>
                <dd>'{speakerProfile.thought}'</dd>
              </div>
              <div>
                <dt>지문</dt>
                <dd>{speakerProfile.gesture}</dd>
              </div>
              <div>
                <dt>말투</dt>
                <dd>{speakerProfile.voice}</dd>
              </div>
            </dl>
          </aside>
          <p>{node.text}</p>
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

        <details className="memo-panel" open>
          <summary>
            <h2>
              <FileText size={17} />
              케이스데스크 자료
            </h2>
            <span>{node.memo.length}개 근거</span>
          </summary>
          <ul>
            {node.memo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>

        <section className="echo-panel">
          <div className="panel-title-row">
            <h2>
              <MessageSquareText size={17} />
              에코의 검증 질문
            </h2>
            <span>선택을 돕는 조언자가 아니라, 판단의 약점을 드러내는 반론자</span>
          </div>
          <p>{echo}</p>
          <details className="echo-checks">
            <summary>다시 확인할 것</summary>
            <ul>
              {getEchoChecks(node).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        </section>

        <section className="choice-panel" id="choice-panel" tabIndex={-1}>
          <div className="choice-heading">
            <h2>어떻게 말할까</h2>
            <p>
              어떤 선택도 무료가 아닙니다. 지금 고르는 말은 한 자원을 올리는 대신 다른
              부담을 다음 장면으로 넘깁니다.
            </p>
          </div>
          <div className="choices">
            {fixedChoices.map((choice) => {
              const projectedResources = applyEffect(resources, choice.effect);
              const projectedRisk = getRiskPressure(projectedResources);
              const riskDelta = projectedRisk - riskPressure;
              const riskClass =
                riskDelta > 0 ? "risk-up" : riskDelta < 0 ? "risk-down" : "risk-flat";
              const riskLabel =
                riskDelta > 0
                  ? `위험 +${riskDelta}`
                  : riskDelta < 0
                    ? `위험 ${riskDelta}`
                    : "위험 유지";
              const challengeMatch = getChallengeMatch(choice, riskDelta);
              return (
                <button
                  key={choice.id}
                  className="choice"
                  onClick={() => choose(choice)}
                  disabled={isAdvancing}
                  aria-label={`${speechifyChoice(choice)} ${riskLabel}. ${getChoiceSubtext(choice)}`}
                >
                  <span className="choice-main">
                    <Check size={16} />
                    {getDramaticChoiceLabel(choice)}
                  </span>
                  <span className="choice-action">{choice.label}</span>
                  <span className="choice-speech">"{speechifyChoice(choice)}"</span>
                  {challengeMatch && <span className="challenge-match">{challengeMatch}</span>}
                  <span className="choice-subtext">{getChoiceSubtext(choice)}</span>
                  {choice.effect && (
                    <span className="choice-tradeoff">
                      {explainResourceTradeoff(choice.effect)}
                    </span>
                  )}
                  {choice.effect && (
                    <span className={`choice-risk ${riskClass}`}>
                      {riskLabel} · 예상 압력 {projectedRisk}
                    </span>
                  )}
                  {choice.effect && (
                    <span className="choice-effect">
                      {Object.entries(choice.effect)
                        .map(([key, value]) => `${resourceMeta[key]?.label ?? key} ${value > 0 ? "+" : ""}${value}`)
                        .join(" · ")}
                    </span>
                  )}
                  {choice.cognition && (
                    <span className="choice-cognition">
                      {Object.entries(choice.cognition)
                        .map(([key, value]) => `${cognitionLabels[key] ?? key} +${value}`)
                        .join(" · ")}
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
                          {cognitionLabels[key] ?? key} +{value}
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
        <section>
          <h2>상황판</h2>
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
        </section>
        <section>
          <h2>발언자</h2>
          <div className="speaker-card">
            <strong>{node.speaker}</strong>
            <span>{speakerProfile.role}</span>
            <small>{speakerProfile.appearance}</small>
            <p>{speakerProfile.job}</p>
          </div>
        </section>
        <section>
          <h2>현재 트리거</h2>
          <div className="trigger-tags">
            {node.triggers.map((trigger) => (
              <span key={trigger}>{triggerLabels[trigger]}</span>
            ))}
          </div>
        </section>
        <section>
          <h2>진행률</h2>
          <div className="mini-progress">
            <div style={{ width: `${progress}%` }} />
          </div>
          <p className="status-note">{progress}% · {log.length}개 선택 기록됨</p>
        </section>
        <section>
          <h2>시즌 아크</h2>
          <p className="status-note">
            {activeCaseMeta?.label}은 {activeCaseMeta?.summary}
          </p>
          <p className="status-note">
            완료 {completedCases.length}개 케이스와 현재 로그 {log.length}개가 다음 사건의 압박
            조건으로 누적됩니다.
          </p>
        </section>
      </aside>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

