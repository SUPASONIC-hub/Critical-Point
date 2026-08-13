import React, { useMemo, useState } from "react";
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
  RefreshCcw,
  Send,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import "./styles.css";
import {
  boardChangePrompts,
  caseObjectives,
  characterProfiles,
  cognitionLabels,
  echoReplies,
  initialResources,
  nodeOrders,
  nodes,
  seasonCasesBase,
  triggerLabels,
} from "./gameData.js";
import { applyEffect, clamp, getEcho, makeEmptyScores, scoreFreeText } from "./gameLogic.js";

const resourceMeta = {
  time: { label: "TIME", suffix: "h", icon: Clock3 },
  capital: { label: "CAPITAL", suffix: "", icon: BriefcaseBusiness },
  trust: { label: "TRUST", suffix: "", icon: Users },
  legitimacy: { label: "LEGITIMACY", suffix: "", icon: Shield },
  humanCost: { label: "HUMAN COST", suffix: "", icon: AlertTriangle },
  fatigue: { label: "FATIGUE", suffix: "", icon: BarChart3 },
};

const STORAGE_KEY = "trigger-prototype-v2";
const GAME_TITLE = "임계점";
const GAME_SUBTITLE = "판단이 깊어지는 순간";
const GAME_LABEL = "CRITICAL POINT";

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

function App() {
  const saved = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }, []);

  const [playerName, setPlayerName] = useState(saved?.playerName ?? "");
  const [started, setStarted] = useState(saved?.started ?? false);
  const [currentCase, setCurrentCase] = useState(saved?.currentCase ?? "case01");
  const [completedCases, setCompletedCases] = useState(saved?.completedCases ?? []);
  const [caseResults, setCaseResults] = useState(saved?.caseResults ?? {});
  const [nodeId, setNodeId] = useState(saved?.nodeId ?? "start");
  const [resources, setResources] = useState(saved?.resources ?? initialResources);
  const [log, setLog] = useState(saved?.log ?? []);
  const [triggers, setTriggers] = useState(saved?.triggers ?? makeEmptyScores(triggerLabels));
  const [cognition, setCognition] = useState(saved?.cognition ?? makeEmptyScores(cognitionLabels));
  const [freeText, setFreeText] = useState("");
  const [echo, setEcho] = useState(saved?.echo ?? "얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.");
  const [nodeEnteredAt, setNodeEnteredAt] = useState(saved?.nodeEnteredAt ?? Date.now());

  const node = nodes[nodeId];
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
  };
  const fixedChoices = node?.choices?.filter((choice) => choice.type !== "free") ?? [];
  const freeChoice = node?.choices?.find((choice) => choice.type === "free");

  function persist(nextState) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        playerName,
        started,
        currentCase,
        completedCases,
        caseResults,
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

  function buildCaseSummary(nextTriggers, nextCognition, nextLog) {
    const sortedTriggers = Object.entries(nextTriggers).sort((a, b) => b[1] - a[1]);
    const sortedCognition = Object.entries(nextCognition).sort((a, b) => b[1] - a[1]);
    return {
      primary: sortedTriggers[0] ?? ["responsibility", 0],
      secondary: sortedTriggers[1] ?? ["protection", 0],
      thinking: sortedCognition[0] ?? ["persistence", 0],
      freeCount: nextLog.filter((entry) => entry.freeText).length,
      averageResponseTime:
        nextLog.length > 0
          ? Math.round(
              nextLog.reduce((sum, entry) => sum + (entry.responseTimeSec ?? 0), 0) /
                nextLog.length,
            )
          : 0,
    };
  }

  function choose(choice) {
    const responseTimeSec = Math.max(1, Math.round((Date.now() - nodeEnteredAt) / 1000));
    const free = choice.type === "free";
    const freeResult = free ? scoreFreeText(freeText) : null;
    const effect = free ? freeResult.effect : choice.effect;
    const cognitiveEffect = free ? freeResult.cognition : choice.cognition;
    const nextResources = applyEffect(resources, effect);
    const nextTriggers = { ...triggers };
    const nextCognition = { ...cognition };

    node.triggers.forEach((trigger) => {
      nextTriggers[trigger] = (nextTriggers[trigger] ?? 0) + (free ? 10 : 6);
    });
    Object.entries(cognitiveEffect ?? {}).forEach(([key, value]) => {
      nextCognition[key] = (nextCognition[key] ?? 0) + value;
    });

    const entry = {
      nodeId,
      title: node.title,
      choice: choice.label,
      freeText: free ? freeText.trim() : "",
      effect,
      triggers: node.triggers,
      echo: getEcho(choice.id, free ? freeText : ""),
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
    const nextCaseResults = completedNow
      ? {
          ...caseResults,
          [currentCase]: buildCaseSummary(nextTriggers, nextCognition, nextLog),
        }
      : caseResults;

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
    setStarted(false);
    setCurrentCase("case01");
    setCompletedCases([]);
    setCaseResults({});
    setNodeId("start");
    setResources(initialResources);
    setLog([]);
    setTriggers(makeEmptyScores(triggerLabels));
    setCognition(makeEmptyScores(cognitionLabels));
    setEcho("얼마나 똑똑한지는 묻지 않겠습니다. 대신 언제 생각을 멈추지 못하는지 보겠습니다.");
    setFreeText("");
    setNodeEnteredAt(Date.now());
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
      exportedAt: new Date().toISOString(),
      playerName,
      currentCase,
      completedCases,
      caseResults,
      resources,
      triggers,
      cognition,
      summary: result,
      log,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `trigger-playtest-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const result = useMemo(() => {
    const sortedTriggers = Object.entries(triggers).sort((a, b) => b[1] - a[1]);
    const sortedCognition = Object.entries(cognition).sort((a, b) => b[1] - a[1]);
    const primary = sortedTriggers[0] ?? ["responsibility", 0];
    const secondary = sortedTriggers[1] ?? ["protection", 0];
    const thinking = sortedCognition[0] ?? ["persistence", 0];
    const freeCount = log.filter((entry) => entry.freeText).length;
    const averageResponseTime =
      log.length > 0
        ? Math.round(log.reduce((sum, entry) => sum + (entry.responseTimeSec ?? 0), 0) / log.length)
        : 0;
    const longestDecision = [...log].sort(
      (a, b) => (b.responseTimeSec ?? 0) - (a.responseTimeSec ?? 0),
    )[0];
    return { primary, secondary, thinking, freeCount, averageResponseTime, longestDecision };
  }, [triggers, cognition, log]);

  const progress = isResult
    ? 100
    : Math.round(
        (((nodeOrders[currentCase] ?? nodeOrders.case01).indexOf(nodeId) + 1) /
          (nodeOrders[currentCase] ?? nodeOrders.case01).length) *
          100,
      );
  const completedCaseResultList = seasonCasesBase
    .filter((caseItem) => caseResults[caseItem.id])
    .map((caseItem) => ({ ...caseItem, result: caseResults[caseItem.id] }));

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
            <button className="test-unlock" onClick={unlockAllCasesForTest}>
              테스트용 전체 케이스 열기
            </button>
          </div>
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
                      {caseItem.result.averageResponseTime}s · 자유입력 {caseItem.result.freeCount}
                    </small>
                  </article>
                ))}
              </div>
            </section>
          )}
          <div className="case-roadmap">
            {seasonCases.map((caseItem) => (
              <article
                key={caseItem.id}
                className={
                  caseItem.status === "PLAYING" || caseItem.status === "OPEN"
                    ? "case-card active-case"
                    : caseItem.status === "COMPLETE"
                      ? "case-card complete-case"
                      : "case-card"
                }
                onClick={() => {
                  if (
                    caseItem.status === "OPEN" ||
                    caseItem.status === "PLAYING" ||
                    caseItem.status === "COMPLETE"
                  ) {
                    startCase(caseItem.id);
                  }
                }}
              >
                <div>
                  <span>{caseItem.label}</span>
                  {caseItem.status === "LOCKED" && <LockKeyhole size={14} />}
                </div>
                <h2>{caseItem.title}</h2>
                <b>{caseItem.trigger}</b>
                <p>{caseItem.summary}</p>
                {caseResults[caseItem.id] && (
                  <small className="case-result-mini">
                    {triggerLabels[caseResults[caseItem.id].primary[0]]} ·{" "}
                    {caseResults[caseItem.id].averageResponseTime}s · 자유입력{" "}
                    {caseResults[caseItem.id].freeCount}
                  </small>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (isResult) {
    return (
      <main className="shell">
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
            <h1>
              {currentCase === "final"
                ? "이제 당신은 자신의 조건을 어떻게 쓸지 선택해야 합니다."
                : `${triggerLabels[result.primary[0]]} 조건에서 사고가 가장 오래 유지됐습니다.`}
            </h1>
          </div>
          {currentCase === "case01" && (
            <section className="next-case-panel">
              <div>
                <span>NEXT CASE UNLOCKED</span>
                <h2>CASE 02 — FALSE SIGNAL</h2>
                <p>
                  동료가 내부 정보 유출자로 지목됩니다. 증거는 명확하지만, 사람의 맥락은
                  다른 이야기를 합니다.
                </p>
              </div>
              <button onClick={() => startCase("case02")}>
                <ChevronRight size={18} />
                CASE 02 시작
              </button>
            </section>
          )}
          {currentCase === "case02" && (
            <section className="next-case-panel">
              <div>
                <span>NEXT CASE UNLOCKED</span>
                <h2>CASE 03 — RED TEAM</h2>
                <p>
                  오진우와 같은 자료를 받고 동시에 해결안을 냅니다. 이번에는 경쟁심이
                  판단을 빠르게 만드는지, 얕게 만드는지 확인합니다.
                </p>
              </div>
              <button onClick={() => startCase("case03")}>
                <ChevronRight size={18} />
                CASE 03 시작
              </button>
            </section>
          )}
          {currentCase === "case03" && (
            <section className="next-case-panel">
              <div>
                <span>NEXT CASE UNLOCKED</span>
                <h2>CASE 04 — THE PRICE</h2>
                <p>
                  작은 규칙 위반이 수천 명을 살릴 수 있습니다. 이번에는 좋은 결과가
                  절차 훼손을 어디까지 정당화하는지 묻습니다.
                </p>
              </div>
              <button onClick={() => startCase("case04")}>
                <ChevronRight size={18} />
                CASE 04 시작
              </button>
            </section>
          )}
          {currentCase === "case04" && (
            <section className="next-case-panel">
              <div>
                <span>NEXT CASE UNLOCKED</span>
                <h2>CASE 05 — NO ONE TO BLAME</h2>
                <p>
                  명백한 악인은 없습니다. 모두가 합리적으로 움직였지만 시스템은 가장
                  조용한 사람들을 밀어냈습니다.
                </p>
              </div>
              <button onClick={() => startCase("case05")}>
                <ChevronRight size={18} />
                CASE 05 시작
              </button>
            </section>
          )}
          {currentCase === "case05" && (
            <section className="next-case-panel">
              <div>
                <span>FINAL CASE UNLOCKED</span>
                <h2>FINAL — TRIGGER LAB</h2>
                <p>
                  모든 사건의 로그가 하나의 폴더로 연결됩니다. 이제 트리거랩이 당신의
                  사고 조건을 어떻게 사용했는지 마주합니다.
                </p>
              </div>
              <button onClick={() => startCase("final")}>
                <ChevronRight size={18} />
                FINAL 시작
              </button>
            </section>
          )}
          <div className="result-grid">
            <section className="report-section">
              <h2>Primary Trigger</h2>
              <strong>{triggerLabels[result.primary[0]]}</strong>
              <p>
                이 조건이 등장한 뒤 선택 유지, 정보 탐색, 자유입력, 반론 대응이 가장 크게
                증가했습니다.
              </p>
            </section>
            <section className="report-section">
              <h2>Secondary Trigger</h2>
              <strong>{triggerLabels[result.secondary[0]]}</strong>
              <p>두 번째로 강하게 사고를 밀어붙인 조건입니다.</p>
            </section>
            <section className="report-section">
              <h2>Cognitive Acceleration</h2>
              <strong>{cognitionLabels[result.thinking[0]]}</strong>
              <p>이번 플레이에서는 이 사고 능력이 가장 자주 사용됐습니다.</p>
            </section>
            <section className="report-section">
              <h2>Free Text</h2>
              <strong>{result.freeCount}회</strong>
              <p>선택지 밖에서 판을 바꾸려 한 횟수입니다.</p>
            </section>
            <section className="report-section">
              <h2>Avg Time</h2>
              <strong>{result.averageResponseTime}s</strong>
              <p>각 국면에서 결정을 내리기까지 걸린 평균 시간입니다.</p>
            </section>
            <section className="report-section wide-report">
              <h2>Longest Decision</h2>
              <strong>{result.longestDecision?.title ?? "없음"}</strong>
              <p>
                가장 오래 머문 국면입니다. 테스트 때 이 장면에서 실제 고민이 생겼는지
                확인해야 합니다.
              </p>
            </section>
          </div>
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
                  <p>{entry.freeText || entry.choice}</p>
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
            <h1>{node.title}</h1>
          </div>
          <button className="ghost" onClick={reset}>
            <RefreshCcw size={16} />
            초기화
          </button>
        </header>
        <div className="progress-wrap" aria-label={`진행률 ${progress}%`}>
          <div style={{ width: `${progress}%` }} />
        </div>

        <div className="scene">
          <div className="speaker">
            <div>{node.speaker.slice(0, 1)}</div>
            <span>
              <b>{node.speaker}</b>
              <small>{speakerProfile.role} · {speakerProfile.stance}</small>
            </span>
          </div>
          <p>{node.text}</p>
        </div>

        <section className="memo-panel">
          <h2>
            <FileText size={17} />
            케이스데스크 자료
          </h2>
          <ul>
            {node.memo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="echo-panel">
          <div className="panel-title-row">
            <h2>
              <MessageSquareText size={17} />
              에코의 검증 질문
            </h2>
            <span>선택을 돕는 조언자가 아니라, 판단의 약점을 드러내는 반론자</span>
          </div>
          <p>{echo}</p>
        </section>

        <section className="choice-panel">
          <h2>대응안 선택</h2>
          <div className="choices">
            {fixedChoices.map((choice) => (
              <button
                key={choice.id}
                className="choice"
                onClick={() => choose(choice)}
              >
                <span className="choice-main">
                  <Check size={16} />
                  {choice.label}
                </span>
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
            ))}
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
                placeholder="예: 누구를 새로 협상장에 부를지, 어떤 조건을 교환할지, 어떤 정보를 먼저 확인할지 적는다."
              />
              <button
                className="choice free-choice submit-reframe"
                onClick={() => choose(freeChoice)}
                disabled={!freeText.trim()}
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
        </section>
      </aside>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

