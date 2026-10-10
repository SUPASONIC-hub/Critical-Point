import { useCallback, useRef, useState } from "react";

import { recordSettledWindowSeed, SAVE_SCHEMA_VERSION } from "../appConfig.js";
import { CASE_RESULT_NODES, CASE_SEQUENCE, RESULT_NODE_IDS } from "../gameCases.js";
import {
  applyEffect,
  buildSceneBeat,
  createCaseSummary,
  getAuthorityGate,
  getDramaticChoiceLabel,
  getEcho,
  getEndingVariant,
  getObserverTag,
  getOutcomeChoiceId,
  getSeasonLogic,
  getSeasonStrain,
  getRiskPressure,
  getSuspenseEvent,
  getUnattendedNext,
  getWindowResponseTime,
  REFRAME_COGNITION,
  REFRAME_EFFECT,
} from "../gameLogic.js";
import { getBranchDetourBypass, getCaseBranchNodes, nodes, reframeRouteNodes } from "../gameData.js";
import { chapterRules } from "../caseCopy.js";
import { applyGauntletEffect, BUST_EFFECT, createRunSummary, getTableClockScale } from "../gauntlet/gauntletEngine.js";
import { getLogicType } from "../gauntlet/logicStreak.js";
import { getTableRules, STAGED } from "../gauntlet/tableUnlocks.js";
import { hasCloudConflict } from "../cloudSave.js";
import { telemetryEnabled } from "../telemetry.js";
import { createSeasonLeaderboardRow, createSeasonTelemetryPayload } from "../viewModels/seasonViewModels.js";
import { recordAppError, reportSilentFailure } from "./savedState.js";
import { getAccessibility } from "./accessibilitySettings.js";
import { appendTraceEvent } from "./trace.js";
import { createTelemetryEventId } from "./telemetryEventId.js";
import { validateTelemetryItem } from "./payloadSchemas.js";

// Uploads stop on a conflict, and the panel that explains it is on the intro.
// A player in the middle of a case is told here, where the save speaks: once a
// page load and in one line, because the line sits on the play screen and
// priority 27 gives that screen to the table.
const CLOUD_CONFLICT_MESSAGE = "온라인 저장이 멈췄습니다. 이 기기에는 저장됩니다. 시작 화면의 '다른 기기에서 이어하기'에서 확인해 주세요.";
let cloudConflictSaid = false;

/**
 * Where 판을 다시 짠다 leads: the case's authored hidden route, once per case,
 * or the far side of the case's first fork when it has none.
 */
function getReframeTarget(caseId, fromNodeId) {
  const dramaticRoute = reframeRouteNodes[caseId];
  if (dramaticRoute && fromNodeId !== dramaticRoute && nodes[dramaticRoute]) return dramaticRoute;
  const branch = getCaseBranchNodes().find((item) => item.caseId === caseId);
  if (!branch || branch.nodeId === fromNodeId) return null;
  return branch.detourIds[0] ?? branch.nextIds[0] ?? null;
}

/**
 * What a bust costs the story, not just the score. The room does not wait for
 * an analyst who blew up: the scene the card led to plays out without them,
 * and the table deals the one after it. Never onto a result -- a bust does not
 * close a case -- and never off the authored graph.
 *
 * The room goes where the skipped scene's lead card would have taken it
 * (gameLogic.getUnattendedNext), through the same gate a played card passes.
 * It used to follow the first card dealt, which the shuffled deal made a
 * different route on forty fork scenes, and it walked into gated detours.
 *
 * A story run is not skipped past anything (the caller does not ask): the
 * mode is there so the story can be read, and a scene played without the
 * player is a scene they did not read. The bust still costs what a bust costs.
 */
function getBlackoutSkip(fromNodeId, branchContext) {
  const skippedNode = nodes[fromNodeId];
  if (!skippedNode || RESULT_NODE_IDS.has(fromNodeId)) return null;
  const onward = getUnattendedNext(skippedNode, branchContext);
  if (!onward || !nodes[onward] || RESULT_NODE_IDS.has(onward)) return null;
  return { nodeId: onward, skippedNodeId: fromNodeId, skippedTitle: skippedNode.title };
}

/**
 * A case summary as a telemetry row carries it. The run keeps the ending as
 * the record the report prints (label, title, text); the row carries its id.
 * The server's ranking summary publishes `endingVariant` only when it is a
 * short id string (ranking_public_summary), and check-grants has always sent
 * it one, so the object the client really sent was dropped from every ranking
 * row -- and each case row carried two sentences of copy the server already
 * has by name.
 */
export function toRowSummary(caseSummary) {
  const ending = caseSummary?.endingVariant;
  const id = typeof ending === "string" ? ending : ending?.id;
  return { ...caseSummary, endingVariant: typeof id === "string" ? id : null };
}

function describeTempo(verdict) {
  if (verdict.tempo.groovePot > 0) {
    return { label: "GROOVE", text: `박자 ${verdict.tempo.hits}회 · 최고 콤보 ${verdict.tempo.maxCombo} · 판돈 +${verdict.tempo.groovePot}` };
  }
  if (verdict.focus?.charge > 0) {
    return { label: "FOCUS", text: `LOCK ${verdict.focus.charge} · 보상 ${verdict.focus.potMultiplier}x · 자원 ${verdict.focus.resourceMultiplier}x` };
  }
  return null;
}

/**
 * The rules a window is settled under (gauntlet/tableUnlocks.js): the ones its
 * case plays under, and the ones the board it deals will be played under.
 * Those are the same until the window that closes the case. The board dealt
 * there, and the relic draft offered with it, are the next case's opening, so
 * they follow the next case's rules: 프롤로그 05 has the draft, which makes the
 * offer at the close of 프롤로그 04 the first one.
 *
 * A replay closes onto whichever case the player opens next, which is not
 * known here, and it hands back what the run held before it -- so its closing
 * board is dealt under everything.
 */
export function getSettlementRules({ caseId, run, caseClosed }, staged = STAGED) {
  const rules = getTableRules(caseId, run, staged);
  if (!caseClosed) return { rules, nextRules: rules };
  const nextCaseId = run?.practice ? null : CASE_SEQUENCE[CASE_SEQUENCE.indexOf(caseId) + 1];
  return { rules, nextRules: getTableRules(nextCaseId, run, staged) };
}

/**
 * The types of card a scene has on the table, for the logic streak: a hand
 * that leaves its type because no card of that type was there keeps its streak
 * (`advanceLogic` in gauntlet/logicStreak.js). The scene's own cards, the wild one among
 * them, less any the player's standing has not opened -- a card that cannot be
 * played is not an offer.
 */
export function getOfferedTypes(node, standing) {
  const open = (node?.choices ?? []).filter((card) => getAuthorityGate(card, standing).unlocked);
  return [...new Set(open.map(getLogicType).filter(Boolean))];
}

/**
 * Committing a decision: the table's verdict prices the card, the log gains
 * its entry, a closed case writes its summary, its ranking row and its
 * telemetry, and the reveal opens over the next scene.
 *
 * `isAdvancing` blocks a second commit until the next scene has mounted. It
 * used to be cleared only by an effect keyed on the scene, so a commit that
 * threw half way, or one whose next scene was the scene it left, blocked every
 * choice for the rest of the run. A throw now releases it at once, and the
 * runtime releases it again when the reveal closes.
 */
export function useChoiceCommit(context) {
  const [isAdvancing, setIsAdvancing] = useState(false);
  const committingRef = useRef(false);

  const releaseAdvance = useCallback(() => {
    committingRef.current = false;
    setIsAdvancing(false);
  }, []);

  function recordClosedCase({ caseSummary, finalResources, nextTriggers, nextCognition, nextLog, nextRun, nextCompletedCases, responseTimeSec }) {
    const {
      currentCase, runId, sessionId, sessionCode, playerName, activeCaseMeta, dataConsent, caseResults,
      appendLocalRankingRow, queueTelemetry, setSaveStatus, setTelemetryStatus, onSeasonFinal,
    } = context;
    // The season as it stands with its finale closed: what NEW GAME+ remembers.
    if (currentCase === "final") onSeasonFinal({ ...caseResults, [currentCase]: caseSummary });
    const rowSummary = toRowSummary(caseSummary);
    // Whether the case row is in the queue, and so whether a ranking row may follow it.
    let caseRowQueued = false;
    const { saved: localRankingSaved } = appendLocalRankingRow({
      local: true,
      run_id: runId,
      session_code: sessionCode,
      player_name: playerName || "현재 분석관",
      case_id: currentCase,
      case_title: activeCaseMeta?.title ?? currentCase,
      completed_at: caseSummary.completedAt,
      summary: caseSummary,
    });
    if (!localRankingSaved) {
      setSaveStatus("Local ranking save failed: browser storage is unavailable.");
      recordAppError(new Error("Local ranking save failed because browser storage could not be written."), {}, "local-ranking-save");
    }

    if (!telemetryEnabled) {
      setTelemetryStatus({ tone: "local", text: "원격 저장 미설정. 이 케이스 로그는 로컬과 JSON 내보내기에만 남습니다." });
    } else if (!dataConsent) {
      setTelemetryStatus({ tone: "local", text: "데이터 제공 동의가 없어 원격 저장을 건너뛰었습니다." });
    } else {
      const caseTelemetryPayload = {
        event_id: createTelemetryEventId(),
        session_id: sessionId,
        run_id: runId,
        session_code: sessionCode,
        player_name: "익명 분석관",
        case_id: currentCase,
        case_title: activeCaseMeta?.title ?? currentCase,
        summary: rowSummary,
        resources: finalResources,
        triggers: nextTriggers,
        cognition: nextCognition,
        decision_log: nextLog,
        dynamics: { ...createRunSummary(nextRun), responseTimeSec },
      };
      const caseItem = {
        id: `case-${caseTelemetryPayload.event_id}`,
        type: "case",
        label: `${activeCaseMeta?.label ?? currentCase} 케이스 로그`,
        payload: caseTelemetryPayload,
      };
      // Into the queue first, and so into the save, and sent from there (the
      // runtime starts a pass as soon as the queue holds a row). The row used
      // to be sent straight away and queued only when the send failed: a tab
      // closed or frozen while it was in flight had kept it nowhere, and the
      // server ranks a run only when every one of its cases has a row. The
      // queue runs the same privacy check before each send (priority 61), and
      // the row's event id makes a send that did land harmless to repeat.
      if (validateTelemetryItem(caseItem).length > 0) {
        setTelemetryStatus({ tone: "error", text: "이 케이스 로그는 보낼 수 없는 형식이라 원격 저장하지 않습니다. 기록은 이 기기와 JSON 내보내기에 남아 있습니다." });
      } else {
        queueTelemetry(caseItem);
        caseRowQueued = true;
        setTelemetryStatus({ tone: "pending", text: "케이스 로그를 보관했습니다. 연결되는 대로 원격 저장합니다." });
      }
    }

    if (currentCase !== "final" || nextCompletedCases.length !== CASE_SEQUENCE.length) return;
    const seasonTelemetryPayload = createSeasonTelemetryPayload({
      caseSummary: rowSummary,
      completedCaseCount: nextCompletedCases.length,
      cognition: nextCognition,
      decisionLog: nextLog,
      resources: finalResources,
      runId,
      sessionCode,
      sessionId,
      triggers: nextTriggers,
    });
    const { saved: seasonRankingSaved } = appendLocalRankingRow(createSeasonLeaderboardRow({
      caseSummary,
      completedCaseCount: nextCompletedCases.length,
      playerName,
      runId,
      sessionCode,
    }));
    if (!seasonRankingSaved) {
      setSaveStatus("Season ranking save failed: browser storage is unavailable.");
      recordAppError(new Error("Season ranking save failed because browser storage could not be written."), {}, "local-ranking-save");
    }
    // The server takes a ranking row only once the run's last case row has
    // landed. It goes into the queue behind that row, and the queue holds it
    // there until the case row is through (telemetryBatch.isHeldBehindCaseRow).
    // With no case row queued the run cannot rank, and no ranking row is sent.
    //
    // Nor for a season that played any case in story mode. Its wall stood at
    // 88 and up, so it banked several times what the table pays anyone else
    // (check:pressure prints the ratio), and the public ranking compares
    // seasons played on one table. The case rows above are still sent, with
    // the mark, and this device's own ranking keeps the row.
    if (telemetryEnabled && dataConsent && caseRowQueued && !caseSummary.assistStory) {
      queueTelemetry({
        id: `season-final-${runId}`,
        type: "case",
        label: "SEASON 01 COMPLETE",
        payload: seasonTelemetryPayload,
      });
    }
  }

  function commit(choice, closedWindow, forced) {
    const {
      currentCase, fallbackCaseId, resolvedNodeId, node, resources, triggers, cognition, log,
      caseResults, completedCases, discoveredClues, gauntletRun, relicTable, riskPressure,
      sceneChallenge, nodeEnteredAt, currentCaseReframeCount, runId, readers, applyRun, clueCount, casesOpened,
    } = context;
    const windowState = closedWindow ?? { status: "cashed", cause: "cash", gauge: 0, wall: 0, pushes: 0, elapsed: 0 };
    const responseTimeSec = getWindowResponseTime({ elapsed: windowState.elapsed, enteredAt: nodeEnteredAt, clockSeconds: windowState.schema?.seconds ?? gauntletRun?.schema?.seconds });
    const assistTime = Math.max(Number(windowState.timeScale) || 1, getTableClockScale(gauntletRun, getAccessibility().tableTime));
    // The case on the table was opened in story mode (gauntletEngine's `story`).
    const assistStory = gauntletRun?.story === true;
    const reframe = choice.type === "reframe";
    // A reframe that busts is still a reframe the player paid for, but it does
    // not open a door: the wall took the window before the new board was laid.
    const reframeOpenedRoute = reframe && windowState.status === "cashed";
    const reframeTarget = reframeOpenedRoute && currentCaseReframeCount === 0
      ? getReframeTarget(currentCase, resolvedNodeId)
      : null;
    const baseEffect = reframe ? REFRAME_EFFECT : choice.effect;
    const cognitiveEffect = reframe ? REFRAME_COGNITION : choice.cognition;
    const { challengeMatch, tacticalRead, riskDelta } = readers.getEffectiveChoiceRead(choice, baseEffect, cognitiveEffect);

    const previousCaseId = CASE_SEQUENCE[CASE_SEQUENCE.indexOf(currentCase) - 1];
    const branchContext = {
      resources,
      previousOutcomeChoiceId: previousCaseId ? caseResults[previousCaseId]?.outcomeChoiceId : undefined,
    };
    const branchBypass = getBranchDetourBypass(choice, branchContext);
    const plannedNode = reframeTarget ?? branchBypass ?? choice.next;
    const blackoutSkip = windowState.status === "bust" && !assistStory ? getBlackoutSkip(plannedNode, branchContext) : null;
    const nextNode = blackoutSkip?.nodeId ?? plannedNode;
    const caseClosed = CASE_RESULT_NODES[currentCase] === nextNode;
    const { verdict, nextRun, unlockedRelics } = relicTable.settle({
      run: gauntletRun,
      window: windowState,
      card: choice,
      // For the logic streak: whether the room played this card, and what the
      // scene had on the table.
      forced,
      offered: getOfferedTypes(node, { clueCount, trust: resources.trust, legitimacy: resources.legitimacy, casesOpened }),
      caseClosed,
      offerRelics: currentCase !== "final",
      ...getSettlementRules({ caseId: currentCase, run: gauntletRun, caseClosed }),
    });
    const busted = verdict.outcome === "bust";

    const gauntletEffect = applyGauntletEffect(baseEffect, {
      outcome: verdict.outcome,
      gauge: verdict.gauge,
      fracturedAxis: verdict.fracturedAxis,
      fractureRate: verdict.fractureRate,
      focusMultiplier: verdict.focus?.resourceMultiplier,
    });
    const clue = busted ? null : readers.getClueReveal(challengeMatch, riskDelta, responseTimeSec, reframeOpenedRoute);
    const clueReward = clue
      ? { label: "EVIDENCE BONUS", text: "숨은 단서를 확보했다.", effect: { legitimacy: 2, fatigue: -1 } }
      : null;
    const finalEffect = readers.mergeEffects(gauntletEffect, clueReward?.effect ?? {}, busted ? BUST_EFFECT : {});
    const finalResources = applyEffect(resources, finalEffect);
    const nextDiscoveredClues = clue ? [...discoveredClues, clue] : discoveredClues;
    const suspenseEvent = getSuspenseEvent({
      riskBefore: riskPressure,
      riskAfter: getRiskPressure(finalResources),
      currentCase,
      logLength: log.length,
    });
    const nextTriggers = { ...triggers };
    const nextCognition = { ...cognition };
    node.triggers.forEach((trigger) => {
      nextTriggers[trigger] = (nextTriggers[trigger] ?? 0) + (reframe ? 10 : 6);
    });
    Object.entries(cognitiveEffect ?? {}).forEach(([key, value]) => {
      nextCognition[key] = (nextCognition[key] ?? 0) + value;
    });

    const entryBase = {
      nodeId: resolvedNodeId,
      caseId: fallbackCaseId,
      speaker: node.speaker,
      choiceId: choice.id,
      title: node.title,
      chapterRule: chapterRules[currentCase]?.label ?? "",
      choice: choice.label,
      spokenChoice: getDramaticChoiceLabel(choice),
      reframe,
      reframeOpenedRoute,
      reframeBranchId: reframeTarget,
      continuityMemory: Boolean(choice.continuityMemory),
      routeChangeKind: choice.continuityMemory
        ? "memory"
        : String(choice.id ?? "").includes("evidence_turn")
          ? "evidence-turn"
          : reframeTarget
            ? "reframe"
            : blackoutSkip
              ? "blackout-skip"
              : undefined,
      skippedNodeId: blackoutSkip?.skippedNodeId,
      effect: finalEffect,
      riskRewardEffect: gauntletEffect,
      cognition: cognitiveEffect ?? {},
      triggers: node.triggers,
      echo: getEcho(choice.id),
      sceneBeat: buildSceneBeat(node, choice, finalEffect),
      challenge: { title: sceneChallenge.title, matched: challengeMatch, riskDelta },
      tactical: tacticalRead,
      tempoBonus: describeTempo(verdict),
      clueReward,
      threshold: {
        state: busted ? "bust" : "cash",
        busted,
        cause: verdict.cause,
        forced,
        gauge: verdict.gauge,
        wall: verdict.wall,
        pushes: verdict.pushes,
        rewardMultiplier: busted ? 1 : verdict.resourceMultiplier * (verdict.focus?.resourceMultiplier ?? 1),
        potMultiplier: verdict.multiplier,
        pot: verdict.pot,
        lostPot: verdict.lostPot,
        tempo: verdict.tempo,
        focus: verdict.focus,
        logic: verdict.logic,
      },
      environmentMode: verdict.nextMutations.map((mutation) => mutation.id).join("+") || "stable",
      // The table clock ran this many times slower (the comfort setting); the
      // case summary and the ranking row carry it.
      // It is the slowest the window was run, not the setting at this moment:
      // a window played slow, put down, and cashed after the setting was put
      // back on the intro used to carry no mark.
      ...(assistTime > 1 ? { assistTime } : {}),
      // Played in story mode: a far wall and no next-table rules. The case
      // summary carries it, and a season with any such case is not ranked.
      ...(assistStory ? { assistStory } : {}),
      suspenseEvent,
      clue,
      responseTimeSec,
      resourcesBefore: resources,
      resourcesAfter: finalResources,
    };
    const entry = { ...entryBase, observerTag: getObserverTag(entryBase) };

    const nextLog = [...log, entry];
    const nextEcho = reframeTarget
      ? `${entry.echo} 다음 장면은 당신이 다시 짠 판을 기준으로 이어집니다.`
      : entry.echo;
    appendTraceEvent({
      kind: "choose",
      caseId: currentCase,
      nodeId: resolvedNodeId,
      choiceId: choice.id,
      nextNodeId: nextNode,
      logLength: nextLog.length,
      resources: finalResources,
    });
    const nextCompletedCases = caseClosed ? Array.from(new Set([...completedCases, currentCase])) : completedCases;
    const completedNow = nextCompletedCases !== completedCases;
    let nextCaseResults = caseResults;
    let closedCase = null;
    if (completedNow) {
      const caseSummaryDraft = createCaseSummary(nextTriggers, nextCognition, nextLog, {
        resources: finalResources,
        schemaVersion: SAVE_SCHEMA_VERSION,
        replayOf: caseResults[currentCase],
      });
      const caseSummary = {
        ...caseSummaryDraft,
        endingVariant: getEndingVariant({
          resources: finalResources,
          discoveredClues: nextDiscoveredClues,
          log: nextLog,
          ...getSeasonStrain(caseResults, caseSummaryDraft),
        }),
        gauntlet: createRunSummary(nextRun),
        runId,
        outcomeChoiceId: getOutcomeChoiceId(entry.choiceId, node),
        outcomeNodeId: entry.nodeId,
        completedAt: new Date().toISOString(),
      };
      // A case played again keeps the table record of its first close, and the
      // vault that play banked stays banked (openCaseRun). So it keeps that
      // play's story mark as well: playing a story case once more at the table
      // does not make the season one that was played there.
      if (caseResults[currentCase]?.assistStory === true) caseSummary.assistStory = true;
      // The ranking publishes the run's final case row, so the finale carries
      // the slowest table clock of the whole season, not only its own.
      if (currentCase === "final") {
        const seasonAssist = Object.values(caseResults).reduce((slowest, result) => Math.max(slowest, Number(result?.assistTime) || 1), caseSummary.assistTime ?? 1);
        if (seasonAssist > 1) caseSummary.assistTime = seasonAssist;
        // And the story mark of any case in it: one such case keeps the whole
        // season off the public ranking (`recordClosedCase`).
        if (Object.values(caseResults).some((result) => result?.assistStory === true)) caseSummary.assistStory = true;
        // And the season's two logic numbers (`logicHold`, `bestLogic`), where
        // its cases have a record to make them from.
        Object.assign(caseSummary, getSeasonLogic({ ...caseResults, [currentCase]: caseSummary }));
      }
      nextCaseResults = { ...caseResults, [currentCase]: caseSummary };
      closedCase = { caseSummary, finalResources, nextTriggers, nextCognition, nextLog, nextRun, nextCompletedCases, responseTimeSec };
    }

    const enteredAt = Date.now();
    // One patch: the run in memory and the save are both made from it.
    const written = applyRun({
      gauntletRun: nextRun,
      resources: finalResources,
      triggers: nextTriggers,
      cognition: nextCognition,
      log: nextLog,
      echo: nextEcho,
      nodeId: nextNode,
      completedCases: nextCompletedCases,
      caseResults: nextCaseResults,
      discoveredClues: nextDiscoveredClues,
      nodeEnteredAt: enteredAt,
      decisionReveal: {
        verdict,
        forced,
        caseClosed,
        runPot: nextRun.runPot,
        vault: nextRun.vault,
        spokenChoice: entry.spokenChoice,
        beat: entry.sceneBeat,
        effect: finalEffect,
        clue,
        skippedTitle: blackoutSkip?.skippedTitle ?? null,
        nextTitle: nodes[nextNode]?.title ?? "결과 화면",
        nextNode,
        unlockedRelics,
      },
    });
    // Everything that leaves this tab's own state waits for the save to say
    // whose run this is. A tab another tab has moved past is refused by
    // `persist` and locks its table -- and it used to have sent the case row,
    // the ranking row and the settled seed of a decision nobody kept by then.
    // A replay is not this player's run either.
    if (written?.stale || written?.replay) return;
    relicTable.keepUnlocks(unlockedRelics);
    if (windowState.seed) recordSettledWindowSeed(windowState.seed);
    if (closedCase) recordClosedCase(closedCase);
    if (!cloudConflictSaid && hasCloudConflict()) {
      cloudConflictSaid = true;
      context.setSaveStatus(CLOUD_CONFLICT_MESSAGE);
    }
  }

  function choose(choice, closedWindow = null, forced = false) {
    const { staleSave, clueCount, casesOpened, resources, resolvedNodeId, setSaveStatus } = context;
    if (committingRef.current || isAdvancing || staleSave) return;
    const authorityGate = getAuthorityGate(choice, {
      clueCount,
      trust: resources.trust,
      legitimacy: resources.legitimacy,
      casesOpened,
    });
    if (!authorityGate.unlocked && !forced) {
      setSaveStatus(`Choice locked: ${authorityGate.reason}`);
      return;
    }
    if (!nodes[choice.next] && !RESULT_NODE_IDS.has(choice.next)) {
      reportSilentFailure("bad-next", { from: resolvedNodeId, choiceId: choice.id, next: choice.next });
      return;
    }
    committingRef.current = true;
    setIsAdvancing(true);
    try {
      commit(choice, closedWindow, forced);
    } catch (error) {
      releaseAdvance();
      throw error;
    }
  }

  return { choose, isAdvancing, releaseAdvance };
}
